import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    VerifyTRDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { getHoraActual } from "../../../../../utils/helpers";
import { guardarRegistro, actualizarRegistro, validarSede } from "../../../../../utils/registroOcupacionalUtils";
import { auditoriaDesdeReporte, sellarConsentimientoAdmision } from "../consentimientosAdmisionUtils";

const obtenerReporteUrl = "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision";
const registrarUrl = "/api/v01/ct/consentimientos/registrarActualizarConsentimientosAdmision";

// Este endpoint es compartido por varios consentimientos: `tipoReporte` identifica cuál es.
const TIPO_REPORTE = "CONSENT_SINTOMATICO";

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
// Campos propios del examen (sin auditoría).
const construirBase = (form) => ({
    norden: form.norden,
    idConsentimiento: form.idConsentimiento,

    tipoReporte: TIPO_REPORTE,
    nombreReporte: "DECLARACION DE SINTOMATICO RESPIRATORIO",

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
    const jasperModules = import.meta.glob("../../../../../jaspers/ModuloConsentimientos/ConsentAdmisDeclaSintomaRespi/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/ModuloConsentimientos/ConsentAdmisDeclaSintomaRespi"
    );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    if (!nro) {
        await Swal.fire({
            icon: "error",
            title: '<i class="fa-solid fa-keyboard"></i>Error',
            html: "Debe Introducir un N° Orden válido",
        });
        return;
    }

    Loading("Validando datos");

    // Como el resto de formularios de la plantilla: el N° Orden debe pertenecer a la sede actual.
    if (sede) {
        const { estado, descripcionSede } = await validarSede(nro, sede, token);
        if (estado === "otraSede") {
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
                html: `El N° Orden ${nro} pertenece a la sede${descripcionSede ? `: ${descripcionSede}` : ""}.`,
            });
            return;
        }
        if (estado !== "ok") {
            Swal.fire({
                icon: "error",
                title: '<i class="fa-solid fa-triangle-exclamation"></i>Error',
                html: `Verifique el número de orden ${nro} e intente nuevamente.`,
            });
            return;
        }
    }

    VerifyTRDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            //Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Sintomatico Respiratorio.",
                    "warning"
                );
            });
        }
    );
};

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

