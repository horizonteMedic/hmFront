import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
} from "../../../../../utils/functionUtils";
import { getFetch } from "../../../../../utils/apiHelpers";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
} from "../../../../../utils/registroOcupacionalUtils";

// Nombre de la tabla / servicio (nameService) en el backend.
export const TABLA = "registro_entrega_resultados_emo";

// POST registra o actualiza (RegistroEntregaResultadosEmoDTO). GET obtenerReporte responde
// { codigo, estatus, resultado, timestamp }: los datos vienen dentro de `resultado`.
const registrarUrl = "/api/v01/ct/ocupacional/registro-entrega-resultados";
const obtenerReporteUrl = `${registrarUrl}/obtenerReporte`;

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish);
    const r = res?.resultado ?? res;
    if (r) {
        set((prev) => ({
            ...prev,
            norden: String(r.nOrden ?? nro ?? ""),
            fecha: r.fechaEntrega ?? prev.fecha,
            fechaEmo: r.fechaEmo ?? "",
            nombreExamen: r.tipoEmo ?? "",
            nombresPac: r.nombres ?? "",
            apellidosPac: r.apellidos ?? "",
            nombres: `${r.nombres ?? ""} ${r.apellidos ?? ""}`.trim(),
            dni: r.codPa ?? "",
            empresa: r.empresa ?? "",
            ocupacion: r.puestoTrabajo ?? "",

            user_medicoFirma: r.usuarioFirma ? r.usuarioFirma : prev.user_medicoFirma,

            // Auditoría (se guarda CRUDA: la vista la formatea)
            fechaRegistro: r.fechaRegistro ?? "",
            userRegistro: r.userRegistro ?? "",
            fechaActualizacion: r.fechaActualizacion ?? "",
            usuarioActualizacion: r.usuarioActualizacion ?? "",
            tieneRegistro: true,
        }));
    }
};

// El backend recibe LocalDate (yyyy-MM-dd): se recorta cualquier fecha-hora y se descarta lo que no cumpla el formato.
const soloFecha = (valor) => {
    const fecha = String(valor ?? "").slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : null;
};

// ===== Mapeo: Body base =====
// Campos propios del registro (sin auditoría). Los datos del paciente los completa el backend a partir de nOrden.
// Las notas van fijas.
const NOTAS = "Paciente informado conforme a Ley 29783 (Art. 49 inc. d). Se compromete a cumplir indicaciones.";

const construirBase = (form) => ({
    nOrden: Number(form.norden),
    fechaEntrega: soloFecha(form.fecha),
    usuarioFirma: form.user_medicoFirma ?? "",
    notas: NOTAS,
});

// Body completo (creación / actualización): solo estos 5 campos, sin otros datos de auditoría.
// Al editar se conserva el usuario que registró originalmente; si no se conoce, el de la sesión.
const construirBody = (form, user, esActualizacion) => ({
    ...construirBase(form),
    userRegistro: esActualizacion ? (form.userRegistro || user) : user,
});

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla, datosFooter) =>
    guardarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla, datosFooter) =>
    actualizarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });

// ===== Imprimir =====
// Se arma aquí (y no con PrintHojaRDefault) porque la respuesta viene envuelta en `resultado`.
const jasperModules = import.meta.glob("../../../../../jaspers/ModuloConsentimientos/ConsentAdmisRegistroEntregaInformeEMO/Consent_Admision_RegistroEntregaInformeEMO.jsx");
const rutaJasper = "../../../../../jaspers/ModuloConsentimientos/ConsentAdmisRegistroEntregaInformeEMO/Consent_Admision_RegistroEntregaInformeEMO.jsx";

export const PrintHojaR = async (nro, token, tabla, datosFooter) => {
    LoadingDefault("Cargando Formato a Imprimir");
    try {
        const res = await getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`, token);
        const datos = res?.resultado ?? res;
        if (!datos || res?.error || !(datos.nOrden ?? datos.norden)) {
            Swal.fire("Error", "No se pudo obtener el reporte o no existe registro.", "error");
            return;
        }
        const modulo = await jasperModules[rutaJasper]();
        await modulo.default({ ...datos, norden: datos.nOrden ?? datos.norden, ...datosFooter });
        Swal.close();
    } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo cargar el formato de impresión.", "error");
    }
};

// ===== Búsqueda / verificación por N° Orden (valida también la sede) =====
export const VerifyTR = (nro, tabla, token, set, sede) =>
    verificarRegistro({
        nro,
        tabla,
        token,
        sede,
        onNuevo: () => GetInfoPac(nro, set, token, sede),
        onExistente: () =>
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros del Registro de Entrega de Resultados del EMO.",
                    "warning"
                );
            }),
    });

const GetInfoPac = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            fechaNac: formatearFechaCorta(res.fechaNac ?? ""),
            nombresPac: res.nombres ?? "",
            apellidosPac: res.apellidos ?? "",
            nombres: res.nombresApellidos ?? prev.nombres ?? "",
            dni: res.dni ?? prev.dni ?? "",
            empresa: res.empresa ?? prev.empresa ?? "",
            ocupacion: res.cargo ?? prev.ocupacion ?? "",
            nombreExamen: res.nomExam ?? prev.nombreExamen ?? "",
            fechaEmo: res.fechaExamen ?? prev.fechaEmo ?? "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
