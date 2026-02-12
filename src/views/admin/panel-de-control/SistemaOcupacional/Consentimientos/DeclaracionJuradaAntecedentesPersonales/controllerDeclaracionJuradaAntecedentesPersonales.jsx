import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { getHoraActual } from "../../../../../utils/helpers";

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
            existenAntecedentes: res.antecedentesPatologicos,
            detalleAntecedentes: res.detalleAntecedentes ?? "",
        }));
    }
};

export const SubmitDataService = async (form, token, user, limpiar, tabla, datosFooter) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }

    const body = {
        norden: form.norden,
        idConsentimiento: form.idConsentimiento,

        tipoReporte: tabla,
        nombreReporte: "DECLARACION JURADA DE ANTECEDENTES PERSONALES Y FAMILIARES",

        antecedentesPatologicos: form.existenAntecedentes,
        detalleAntecedentes: form.existenAntecedentes == false ? null : form.detalleAntecedentes,

        fechaFirma: form.fecha,
        horaReporte: getHoraActual(),
        usuarioRegistro: user,
        fechaRegistro: form.fecha,
        usuarioActualiza: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/ModuloConsentimientos/ConsentAdmisDeclaAntecePatolo/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/ModuloConsentimientos/ConsentAdmisDeclaAntecePatolo"
    );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
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
                    "Este paciente ya cuenta con registros de Declaración Jurada Antecedentes Personales.",
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

