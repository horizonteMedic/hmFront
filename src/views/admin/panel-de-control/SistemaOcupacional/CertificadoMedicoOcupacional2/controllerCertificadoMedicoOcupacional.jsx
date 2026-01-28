import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../utils/functionUtils";
import { getHoraActual } from "../../../../../utils/helpers";

const obtenerReporteUrl = "/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoInformado";
const registrarUrl = "/api/v01/ct/anexos/anexo16/registrarActualizarConsentimientoInformado";

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => {}) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            norden: res.norden ?? prev.norden ?? "",
            fecha: res.fecha ?? prev.fecha ?? "",
            nombres: res.nombres ?? prev.nombres ?? "",
            dni: res.dni ?? prev.dni ?? "",

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
        fecha: form.fecha,
        hora: getHoraActual(),
        userRegistro: user,
    };
    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};