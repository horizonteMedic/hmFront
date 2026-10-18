import Swal from "sweetalert2";
import { SubmitData } from "../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { getToday } from "../../../../../utils/helpers";
import {
    obtenerCmpMedico,
    obtenerDigitalizacionMedico,
    obtenerDigitalizacionPaciente,
    obtenerRegistroPorTicket,
} from "../../../../../utils/registroAsistencialUtils";

// Informe médico de accidentes del ticket (InformeAccidenteAsistencialDTO). Lo comparten las Historias
// Clínicas del módulo: solo se muestra en tickets de La Arena (esArena) y se guarda junto con la Historia
// Clínica (su botón Guardar), no por separado (ver controllerComplementos).
//   GET  .../ticket/{numeroTicket}  -> el informe registrado (404 / id null si todavía no hay).
//   POST ...?usuario=               -> { numeroTicket, circunstancias } (crea o edita).
// El DTO solo guarda las circunstancias: el resto del reporte (diagnóstico, tratamiento, médico, paciente)
// sale de la Historia Clínica guardada, por eso solo se puede IMPRIMIR si el ticket ya tiene Historia Clínica.
//
// Campos del formulario que usa (cada Historia Clínica los declara en su estado inicial):
//   n_hcl, accidenteRegistrado / accidenteCircunstancias.
const baseUrl = "/asistencial/informe-accidente";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por eso se
// declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../../jaspers/ModuloAsistencial/InformeMedicoAccidentes/InformeMedicoAccidentes.jsx");
const rutaJasper = "../../../../../jaspers/ModuloAsistencial/InformeMedicoAccidentes/InformeMedicoAccidentes.jsx";

// "Lugar y fecha" de la firma: así se rotula en la hoja del informe (la fecha es la de la impresión).
const LUGAR_FIRMA = "Unidad Médica";

// ¿El formulario trae circunstancias para guardar? Sin texto no se registra informe.
export const hayInformeAccidente = (form) => Boolean(String(form.accidenteCircunstancias ?? "").trim());

// ===== Lectura =====
// Informe registrado para el ticket, o null si todavía no tiene (o el servicio falla).
export const ObtenerInformeAccidente = (numeroTicket, token) => obtenerRegistroPorTicket(baseUrl, numeroTicket, token);

// InformeAccidenteAsistencialDTO -> campos del formulario. Sin informe solo marca "no registrado".
export const formFromInformeAccidente = (informe) =>
    informe
        ? { accidenteRegistrado: true, accidenteCircunstancias: informe.circunstancias ?? "" }
        : { accidenteRegistrado: false };

// ===== Registro =====
// SubmitData devuelve el Response SIN parsear cuando el HTTP no es 2xx: se lee para mostrar el motivo
// que da el backend (p. ej. "circunstancias vacías").
const detalleError = async (res) => {
    const cuerpo = res?.ok === false ? await res.json().catch(() => null) : res;
    return cuerpo?.resultado?.detalle ?? cuerpo?.resultado?.mensaje ?? cuerpo?.mensaje ?? cuerpo?.message ?? "";
};

// Registra (crea o edita) las circunstancias del accidente del ticket: POST. Lo llama el Guardar de la
// Historia Clínica. true si quedó guardado; si no, muestra el motivo y devuelve false (la Historia Clínica
// no se guarda).
export const GuardarInformeAccidente = async (form, token, userlogued) => {
    const body = {
        numeroTicket: Number(form.n_hcl),
        circunstancias: form.accidenteCircunstancias.trim(),
    };
    const query = new URLSearchParams({ usuario: userlogued ?? "" });

    try {
        LoadingDefault("Registrando Informe de Accidente");
        const res = await SubmitData(body, `${baseUrl}?${query.toString()}`, token);
        Swal.close();

        const fallo = !res || res.ok === false || res.error === true || (res.codigo && Number(res.codigo) >= 400);
        if (fallo) {
            const detalle = (await detalleError(res)) || "Ocurrió un error al registrar el informe de accidente.";
            Swal.fire("Error", `No se pudo registrar el informe de accidente, por eso no se guardó la Historia Clínica: ${detalle}`, "error");
            return false;
        }
        return true;
    } catch (e) {
        Swal.close();
        console.error(e);
        Swal.fire("Error", "Ocurrió un error inesperado al registrar el informe de accidente.", "error");
        return false;
    }
};

// ===== Impresión =====
// Imprime el Informe de Accidente GUARDADO de un ticket, con el diagnóstico y tratamiento de su Historia
// Clínica, el sello y CMP del médico asignado y la firma y huella del trabajador (si las tiene registradas).
// Los datos del paciente y de la Historia los entrega cada Historia con `obtenerDatosHC(numeroTicket, token)`:
// un objeto con los nombres de campo del formulario (n_hcl, numeroHistoriaClinica, nombres, dni, diagnostico,
// tratamiento, nombre_medico, ticket*, tieneRegistro) o null si el ticket no existe.
export const ImprimirInformeAccidentePorTicket = async (numeroTicket, token, datosFooter, obtenerDatosHC) => {
    LoadingDefault("Cargando Formato a Imprimir");

    try {
        const [hc, informe] = await Promise.all([obtenerDatosHC(numeroTicket, token), ObtenerInformeAccidente(numeroTicket, token)]);

        if (!hc) {
            await Swal.fire("No encontrado", `No existe un ticket registrado con el N° ${numeroTicket}.`, "error");
            return;
        }
        // El informe usa los datos de la Historia Clínica: sin ella no hay diagnóstico ni tratamiento que imprimir.
        if (!hc.tieneRegistro) {
            await Swal.fire(
                "Sin Historia Clínica",
                `El ticket N° ${numeroTicket} todavía no tiene una Historia Clínica guardada: el informe de accidente usa sus datos (diagnóstico y tratamiento).`,
                "warning"
            );
            return;
        }
        if (!informe) {
            await Swal.fire("Sin informe de accidente", `El ticket N° ${numeroTicket} todavía no tiene un informe de accidente registrado.`, "warning");
            return;
        }

        const modulo = await jasperModules[rutaJasper]();
        if (typeof modulo.default !== "function") {
            console.error(`El módulo ${rutaJasper} no exporta una función por defecto`);
            await Swal.fire("Error", "No se pudo cargar el formato de impresión.", "error");
            return;
        }

        const [sellos, firmaTrabajador, cmp] = await Promise.all([
            obtenerDigitalizacionMedico(hc.nombre_medico, token),
            obtenerDigitalizacionPaciente(hc.dni, token),
            obtenerCmpMedico(hc.nombre_medico, token),
        ]);

        await modulo.default({
            numeroTicket: hc.n_hcl,
            // El N° de historia clínica también viene (solo lectura) en el informe: respaldo si la Historia no lo trae.
            numeroHistoriaClinica: hc.numeroHistoriaClinica || informe.numeroHistoriaClinica || "",
            sede: hc.ticketSede,
            fecha: hc.ticketFecha || hc.fecha_apertura_hcl,
            // El reporte rotula "Apellidos y nombres": cada Historia entrega `nombreCompleto` así ("nombres" va como
            // "Nombres Apellidos", que queda de respaldo).
            nombreCompleto: hc.nombreCompleto || hc.nombres,
            dni: hc.dni,
            edad: hc.edad,
            sexo: hc.sexo,
            estadoCivil: hc.estadoCivil,
            fechaNacimiento: hc.fechaNacimiento,
            lugarNacimiento: hc.lugarNacimiento,
            nivelEstudios: hc.nivelEstudios,
            // Datos laborales del ticket (mismos que imprime el Descanso Médico).
            ocupacion: hc.ocupacion || hc.ticketCargo,
            empresa: hc.empresa || hc.ticketEmpresa,
            area: hc.ticketArea,
            cargo: hc.ticketCargo,
            medico: hc.nombre_medico,
            cmp,
            diagnosticos: hc.diagnostico,
            tratamiento: hc.tratamiento,
            circunstancias: informe.circunstancias,
            lugarFirma: LUGAR_FIRMA,
            fechaFirma: getToday(),
            digitalizacion: [...firmaTrabajador, ...sellos],
            ...datosFooter,
        });
        Swal.close();
    } catch (e) {
        console.error("Error al generar el reporte:", e);
        await Swal.fire("Error", "Ocurrió un error al generar el reporte.", "error");
    }
};
