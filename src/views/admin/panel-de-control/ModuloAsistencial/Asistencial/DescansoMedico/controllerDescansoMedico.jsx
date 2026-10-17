import Swal from "sweetalert2";
import { SubmitData } from "../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { getToday } from "../../../../../utils/helpers";
import { obtenerDigitalizacionMedico, obtenerRegistroPorTicket, sedeDelTicket } from "../../../../../utils/registroAsistencialUtils";

// Descanso médico del ticket (DescansoMedicoAsistencialDTO). Lo comparten las Historias Clínicas del
// módulo (Adulto Mayor, Mujer y Varón Adulto): solo se muestra en tickets de La Arena (esArena) y se
// guarda junto con la Historia Clínica (su botón Guardar), no por separado (ver controllerComplementos).
//   GET  .../ticket/{numeroTicket}  -> el descanso registrado (404 / id null si todavía no hay).
//   POST ...?usuario=               -> { numeroTicket, fechaInicio, cantidadDias, fechaFin, tipoEvento }.
// Fecha fin es INCLUSIVA: del 15 al 17 son 3 días. El backend valida que días y fecha fin concuerden, por
// eso el formulario los mantiene sincronizados (actualizarDescanso) y envía los dos.
//
// Campos del formulario que usa (cada Historia Clínica los declara en su estado inicial):
//   n_hcl, descansoRegistrado / descansoFechaInicio / descansoDias / descansoFechaFin / descansoTipoEvento y
//   ticketEmpresa / ticketArea / ticketCargo / ticketSede / ticketFecha (ver formFromTicketInfo).
// Para imprimir cada Historia entrega los datos de la Historia guardada (ver ImprimirDescansoPorTicket).
const baseUrl = "/asistencial/descanso-medico";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por eso se
// declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../../jaspers/ModuloAsistencial/DescansoMedico/DescansoMedico.jsx");
const rutaJasper = "../../../../../jaspers/ModuloAsistencial/DescansoMedico/DescansoMedico.jsx";

// El backend guarda el tipo de evento como texto libre; estos son los que se manejan hoy.
export const TIPOS_EVENTO = ["ENFERMEDAD COMÚN", "ACCIDENTE DE TRABAJO"];

// ===== Fechas (yyyy-MM-dd) =====
// Todo se calcula en UTC para que el cambio de horario local no corra el día.
const MS_DIA = 24 * 60 * 60 * 1000;

const fechaAMs = (fecha) => {
    const [, anio, mes, dia] = String(fecha ?? "").match(/^(\d{4})-(\d{2})-(\d{2})$/) ?? [];
    return anio ? Date.UTC(Number(anio), Number(mes) - 1, Number(dia)) : null;
};

export const sumarDias = (fecha, dias) => {
    const ms = fechaAMs(fecha);
    return ms === null ? "" : new Date(ms + dias * MS_DIA).toISOString().slice(0, 10);
};

// Días que abarca el descanso, contando ambos extremos. null si alguna fecha no es válida.
export const diasEntre = (inicio, fin) => {
    const desde = fechaAMs(inicio);
    const hasta = fechaAMs(fin);
    return desde === null || hasta === null ? null : Math.round((hasta - desde) / MS_DIA) + 1;
};

const esCantidadValida = (dias) => /^\d+$/.test(String(dias ?? "")) && Number(dias) >= 1;

// Nuevo estado de los campos del descanso al cambiar `campo`, manteniendo días y fecha fin concordantes:
//  - cambia la fecha fin          -> se recalculan los días.
//  - cambian los días / el inicio -> se recalcula la fecha fin (si no hay días válidos pero sí fecha fin,
//                                    al cambiar el inicio se recalculan los días).
// Devuelve solo los campos que cambian (para mezclar con `{ ...form, ...resultado }`).
export const actualizarDescanso = (form, campo, valor) => {
    const siguiente = {
        descansoFechaInicio: form.descansoFechaInicio,
        descansoDias: form.descansoDias,
        descansoFechaFin: form.descansoFechaFin,
        [campo]: valor,
    };

    if (campo === "descansoFechaFin") {
        const dias = diasEntre(siguiente.descansoFechaInicio, valor);
        siguiente.descansoDias = dias !== null && dias >= 1 ? String(dias) : "";
    } else if (esCantidadValida(siguiente.descansoDias)) {
        siguiente.descansoFechaFin = sumarDias(siguiente.descansoFechaInicio, Number(siguiente.descansoDias) - 1);
    } else if (campo === "descansoFechaInicio" && siguiente.descansoFechaFin) {
        const dias = diasEntre(valor, siguiente.descansoFechaFin);
        siguiente.descansoDias = dias !== null && dias >= 1 ? String(dias) : "";
    } else if (campo === "descansoDias") {
        siguiente.descansoFechaFin = "";
    }
    return siguiente;
};

// Campos del descanso en blanco (inicio hoy, resto vacío): el estado de partida de la sección. Sirve para descartar
// un descanso que se empezó a llenar (ver ComplementosDesplegables).
export const descansoVacio = () => ({
    descansoFechaInicio: getToday(),
    descansoDias: "",
    descansoFechaFin: "",
    descansoTipoEvento: "",
});

// ¿El formulario trae un descanso para guardar? La fecha de inicio no cuenta: siempre viene con "hoy" por
// defecto. Con cualquiera de los otros datos el descanso debe estar completo (ver validarDescanso).
export const hayDatosDescanso = (form) =>
    Boolean(String(form.descansoDias ?? "").trim() || form.descansoFechaFin || form.descansoTipoEvento);

// Mensaje del primer problema del descanso (o null si se puede enviar).
export const validarDescanso = (form) => {
    if (fechaAMs(form.descansoFechaInicio) === null) return "Indique la fecha de inicio del descanso.";

    const dias = diasEntre(form.descansoFechaInicio, form.descansoFechaFin);
    if (form.descansoFechaFin && dias !== null && dias < 1) return "La fecha fin no puede ser anterior a la fecha de inicio.";
    if (!esCantidadValida(form.descansoDias)) return "Indique la cantidad de días del descanso (mínimo 1).";
    if (fechaAMs(form.descansoFechaFin) === null) return "Indique la fecha fin del descanso.";
    if (dias !== Number(form.descansoDias)) {
        const [desde, hasta] = [form.descansoFechaInicio, form.descansoFechaFin].map(formatearFechaCorta);
        return `La cantidad de días y la fecha fin no concuerdan: del ${desde} al ${hasta} son ${dias} día(s).`;
    }
    if (!form.descansoTipoEvento) return "Seleccione el tipo de evento.";
    return null;
};

// ===== Lectura =====
// Descanso registrado para el ticket, o null si todavía no tiene (o el servicio falla).
export const ObtenerDescanso = (numeroTicket, token) => obtenerRegistroPorTicket(baseUrl, numeroTicket, token);

// DescansoMedicoAsistencialDTO -> campos del formulario. Sin descanso solo marca "no registrado" y deja los
// valores por defecto del formulario (inicio hoy, resto vacío).
export const formFromDescanso = (descanso) =>
    descanso
        ? {
            descansoRegistrado: true,
            descansoFechaInicio: descanso.fechaInicio ?? "",
            descansoDias: descanso.cantidadDias === null || descanso.cantidadDias === undefined ? "" : String(descanso.cantidadDias),
            descansoFechaFin: descanso.fechaFin ?? "",
            descansoTipoEvento: String(descanso.tipoEvento ?? "").toUpperCase(),
        }
        : { descansoRegistrado: false };

// Datos del ticket (resultado.infoTicket de la Historia Clínica) que el Descanso Médico imprime y que no se
// editan en el formulario: empresa, área y cargo del trabajador, sede donde se atendió y fecha de atención.
export const formFromTicketInfo = (infoTicket) => ({
    ticketEmpresa: infoTicket?.empresa ?? "",
    ticketArea: infoTicket?.area ?? "",
    ticketCargo: infoTicket?.cargo ?? "",
    ticketSede: sedeDelTicket(infoTicket),
    ticketFecha: infoTicket?.fechaTicket ?? "",
});

// ===== Registro =====
// SubmitData devuelve el Response SIN parsear cuando el HTTP no es 2xx: se lee para mostrar el motivo
// que da el backend (p. ej. "días y fecha fin no concuerdan").
const detalleError = async (res) => {
    const cuerpo = res?.ok === false ? await res.json().catch(() => null) : res;
    return cuerpo?.resultado?.detalle ?? cuerpo?.resultado?.mensaje ?? cuerpo?.mensaje ?? cuerpo?.message ?? "";
};

// Registra (crea o edita) el descanso del ticket: POST. Lo llama el Guardar de la Historia Clínica, que ya
// validó el descanso (validarDescanso). true si quedó guardado; si no, muestra el motivo y devuelve false
// (la Historia Clínica no se guarda).
export const GuardarDescanso = async (form, token, userlogued) => {
    const body = {
        numeroTicket: Number(form.n_hcl),
        fechaInicio: form.descansoFechaInicio,
        cantidadDias: Number(form.descansoDias),
        fechaFin: form.descansoFechaFin,
        tipoEvento: form.descansoTipoEvento,
    };
    const query = new URLSearchParams({ usuario: userlogued ?? "" });

    try {
        LoadingDefault("Registrando Descanso Médico");
        const res = await SubmitData(body, `${baseUrl}?${query.toString()}`, token);
        Swal.close();

        const fallo = !res || res.ok === false || res.error === true || (res.codigo && Number(res.codigo) >= 400);
        if (fallo) {
            const detalle = (await detalleError(res)) || "Ocurrió un error al registrar el descanso médico.";
            Swal.fire("Error", `No se pudo registrar el descanso médico, por eso no se guardó la Historia Clínica: ${detalle}`, "error");
            return false;
        }
        return true;
    } catch (e) {
        Swal.close();
        console.error(e);
        Swal.fire("Error", "Ocurrió un error inesperado al registrar el descanso médico.", "error");
        return false;
    }
};

// ===== Impresión =====
// Imprime el Descanso Médico GUARDADO de un ticket. Los datos del paciente, del ticket y de la Historia Clínica
// (diagnóstico, médico asignado) los entrega cada Historia con `obtenerDatosHC(numeroTicket, token)`, que
// devuelve un objeto con los nombres de campo del formulario (n_hcl, numeroHistoriaClinica, nombres, dni,
// diagnostico, nombre_medico, ticket*...) o null si el ticket no existe.
export const ImprimirDescansoPorTicket = async (numeroTicket, token, datosFooter, obtenerDatosHC) => {
    LoadingDefault("Cargando Formato a Imprimir");

    try {
        const [hc, descanso] = await Promise.all([obtenerDatosHC(numeroTicket, token), ObtenerDescanso(numeroTicket, token)]);

        if (!hc) {
            await Swal.fire("No encontrado", `No existe un ticket registrado con el N° ${numeroTicket}.`, "error");
            return;
        }
        if (!descanso) {
            await Swal.fire("Sin descanso médico", `El ticket N° ${numeroTicket} todavía no tiene un descanso médico registrado.`, "warning");
            return;
        }

        const modulo = await jasperModules[rutaJasper]();
        if (typeof modulo.default !== "function") {
            console.error(`El módulo ${rutaJasper} no exporta una función por defecto`);
            await Swal.fire("Error", "No se pudo cargar el formato de impresión.", "error");
            return;
        }

        const digitalizacion = await obtenerDigitalizacionMedico(hc.nombre_medico, token);
        await modulo.default({
            numeroTicket: hc.n_hcl,
            // El N° de historia clínica también viene (solo lectura) en el descanso: respaldo si la Historia no lo trae.
            numeroHistoriaClinica: hc.numeroHistoriaClinica || descanso.numeroHistoriaClinica || "",
            sede: hc.ticketSede,
            fecha: hc.ticketFecha || hc.fecha_apertura_hcl,
            // "nombres" ya viene como "Nombres Apellidos".
            nombres: hc.nombres,
            apellidos: "",
            dni: hc.dni,
            empresa: hc.ticketEmpresa,
            area: hc.ticketArea,
            cargo: hc.ticketCargo,
            diagnostico: hc.diagnostico,
            tipoEvento: String(descanso.tipoEvento ?? "").toUpperCase(),
            fechaInicio: descanso.fechaInicio,
            cantidadDias: descanso.cantidadDias,
            fechaFin: descanso.fechaFin,
            digitalizacion,
            ...datosFooter,
        });
        Swal.close();
    } catch (e) {
        console.error("Error al generar el reporte:", e);
        await Swal.fire("Error", "Ocurrió un error al generar el reporte.", "error");
    }
};
