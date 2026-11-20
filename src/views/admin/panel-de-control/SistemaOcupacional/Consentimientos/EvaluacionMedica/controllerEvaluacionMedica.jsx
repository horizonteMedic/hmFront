import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { getHoraActual } from "../../../../../utils/helpers";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
} from "../../../../../utils/registroOcupacionalUtils";
import { auditoriaDesdeReporte, sellarConsentimientoAdmision } from "../consentimientosAdmisionUtils";

// Este endpoint es compartido por varios consentimientos: `tipoReporte` identifica cuál es.
const TIPO_REPORTE = "CONSENT_INFORMADO_MEDICA";

const obtenerReporteUrl = "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision";
const registrarUrl = "/api/v01/ct/consentimientos/registrarActualizarConsentimientosAdmision";

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish);
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            idConsentimiento: res.idConsentimiento ?? null,
            fecha: res.fechaRegistro ?? "",
            nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
            dni: res.dniPaciente ?? "",
            ocupacion: res.ocupacionPaciente ?? "",
            empresa: res.empresa ?? "",

            // Auditoría (ver consentimientosAdmisionUtils)
            ...auditoriaDesdeReporte(res),
        }));
    }
};

// ===== Mapeo: Body base =====
// Campos propios del consentimiento (sin auditoría).
const construirBase = (form) => ({
    norden: form.norden,
    idConsentimiento: form.idConsentimiento,

    tipoReporte: TIPO_REPORTE,
    nombreReporte: "CONSENTIMIENTO INFORMADO DE EVALUACION MEDICA ",

    antecedentesPatologicos: false,
    detalleAntecedentes: null,

    fechaFirma: form.fecha,
    horaReporte: getHoraActual(),
});

const construirBody = (form, user, esActualizacion) =>
    sellarConsentimientoAdmision(construirBase(form), form, user, esActualizacion);

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

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/ModuloConsentimientos/ConsentAdmisEvaluaMedica/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/ModuloConsentimientos/ConsentAdmisEvaluaMedica"
    );
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
                    "Este paciente ya cuenta con registros del Consentimiento.",
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
            nombres: res.nombresApellidos ?? prev.nombres ?? "",
            ocupacion: res.cargo ?? prev.ocupacion ?? "",
            dni: res.dni ?? prev.dni ?? "",
            empresa: res.empresa ?? prev.empresa ?? "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};

