import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
    RegistrarServicioAsistencialDefault,
    existeRegistro,
} from "../../../../../utils/functionUtils";
import { getFetch } from "../../../../../utils/apiHelpers";
import { verificarRegistro } from "../../../../../utils/registroOcupacionalUtils";

// Constancia de entrega de resultados EMO (La Arena). Es un servicio REST nuevo: responde
// `{ codigo, estatus, resultado }` y el `resultado` trae los datos del paciente + el registro.
const obtenerReporteUrl = "/api/v01/ct/ocupacional/entrega-resultados/obtenerReporte";
const registrarUrl = "/api/v01/ct/ocupacional/entrega-resultados";

const nombreCompleto = (r) => `${r.nombres ?? ""} ${r.apellidos ?? ""}`.trim();

// Carga el formulario desde obtenerReporte. El MISMO endpoint sirve para una orden con registro y para una
// nueva (en ese caso solo trae los datos del paciente y los campos del registro vienen vacíos):
//  - `esNuevo = false` -> se cargan también fecha, notas, médico y auditoría del registro (tieneRegistro: true).
//  - `esNuevo = true`  -> solo datos del paciente; fecha de entrega y médico quedan los de la sesión.
export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }, esNuevo = false) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl);
    const r = res?.resultado;
    if (!r) return; // GetInfoServicioDefault ya mostró el error

    // Datos del paciente / examen.
    const paciente = {
        norden: r.norden ?? nro,
        fechaEmo: r.fechaEmo ?? "",
        nombreExamen: r.tipoEmo ?? "",
        nombres: nombreCompleto(r),
        dni: r.dni ?? "",
        ocupacion: r.puestoTrabajo ?? "",
        empresa: r.empresa ?? "",
    };

    set((prev) => ({
        ...prev,
        ...paciente,
        ...(esNuevo
            ? { tieneRegistro: false }
            : {
                fecha: r.fechaEntrega ?? prev.fecha,
                notas: r.notas ?? "",

                // Médico que firma: `usuarioFirma` es el usuario; `responsableRegistro` su nombre.
                user_medicoFirma: r.usuarioFirma || prev.user_medicoFirma,
                nombre_medico: r.responsableRegistro || prev.nombre_medico,

                // Auditoría REAL (cruda: la vista la formatea).
                fechaRegistro: r.fechaRegistro ?? "",
                userRegistro: r.userRegistro ?? "",
                fechaActualizacion: r.fechaActualizacion ?? "",
                usuarioActualizacion: r.usuarioActualizacion ?? "",
                tieneRegistro: true,
            }),
    }));
    onFinish();
};

// ===== Body del POST (el mismo endpoint registra y actualiza) =====
const construirBody = (form, user) => ({
    norden: Number(form.norden),
    fechaEntrega: form.fecha,
    usuarioFirma: form.user_medicoFirma,
    notas: form.notas?.trim() ?? "",
    userRegistro: user,
});

const validarNorden = async (form) => {
    if (form.norden) return true;
    await Swal.fire({
        icon: "error",
        title: '<i class="fa-solid fa-clipboard-list"></i>Error',
        html: "Datos Incompletos",
    });
    return false;
};

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = async (form, token, user, limpiar, tabla, datosFooter) => {
    if (!(await validarNorden(form))) return;

    LoadingDefault("Validando datos");
    if (await existeRegistro(form.norden, tabla, token)) {
        await Swal.fire({
            icon: "warning",
            title: '<i class="fa-solid fa-pen-to-square"></i>Alerta',
            html: "Ya existe un registro para esta Orden. Use el botón Editar para actualizarlo.",
        });
        return;
    }

    await RegistrarServicioAsistencialDefault(
        token,
        construirBody(form, user),
        registrarUrl,
        limpiar,
        "Datos registrados correctamente.",
        () => PrintHojaR(form.norden, token, tabla, datosFooter)
    );
};

// ===== Editar (registro existente) =====
export const UpdateDataService = async (form, token, user, limpiar, tabla, datosFooter) => {
    if (!(await validarNorden(form))) return;

    await RegistrarServicioAsistencialDefault(
        token,
        construirBody(form, user),
        registrarUrl,
        limpiar,
        "Datos actualizados correctamente.",
        () => PrintHojaR(form.norden, token, tabla, datosFooter)
    );
};

// ===== Impresión =====
// PrintHojaRDefault espera la respuesta plana con `norden` y `nameJasper`; este servicio anida los datos en
// `resultado` y no trae jasper, así que se resuelve aquí: se imprime el jasper propio de La Arena con ese `resultado`.
export const PrintHojaR = async (nro, token, tabla, datosFooter) => {
    LoadingDefault("Cargando Formato a Imprimir");
    try {
        const res = await getFetch(
            `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`,
            token
        );
        const r = res?.resultado;
        if (!r || res.error) {
            Swal.fire("Error", "No se pudo obtener el reporte. Verifique que exista el registro.", "error");
            return;
        }

        const { default: imprimirConstancia } = await import(
            "../../../../../jaspers/ModuloConsentimientos/ConstanciaEntregaResultadosEMO_laarena/Constancia_entrega_resultados_emo_laarena.jsx"
        );
        await imprimirConstancia({ ...r, norden: r.norden ?? nro, ...datosFooter }, null);
        Swal.close();
    } catch (error) {
        console.error("Error al generar el reporte:", error);
        Swal.fire("Error", "Ocurrió un error al generar el reporte.", "error");
    }
};

// ===== Búsqueda / verificación por N° Orden (valida también la sede) =====
export const VerifyTR = (nro, tabla, token, set, sede) =>
    verificarRegistro({
        nro,
        tabla,
        token,
        sede,
        onNuevo: () => GetInfoServicio(nro, tabla, set, token, () => Swal.close(), true),
        // Aviso solo si la carga salió bien (si falla, queda el error de GetInfoServicioDefault).
        onExistente: () =>
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de la Conformidad EMO.",
                    "warning"
                );
            }),
    });
