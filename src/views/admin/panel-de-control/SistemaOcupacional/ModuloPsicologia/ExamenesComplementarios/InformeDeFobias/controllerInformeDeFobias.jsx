import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
const obtenerReporteUrl =
    "";
const registrarUrl =
    "";

export const GetInfoServicio = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => {}
) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res) {
        set((prev) => ({
            ...prev,
           
            norden: res.norden,
           
        }));
    }
};

export const SubmitDataService = async (
    form,
    token,
    user,
    limpiar,
    tabla,
    datosFooter
) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }
    if (form.esApto === undefined || form.esApto === null) {
        await Swal.fire("Error", "Debe marcar aptitud", "error");
        return;
    }
    const body = {
        norden: form.norden,
        usuarioRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob(
        "../../../../../jaspers/ModuloPsicologia/InformeDeFobias/*.jsx"
    );
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/ModuloPsicologia/InformeDeFobias"
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
            // No tiene registro
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            // Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Informe de Fobias.",
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
            nombres: res.nombres ?? prev.nombres,
            apellidos: res.apellidos ?? prev.apellidos,
            edad: (res.edad ? `${res.edad} AÑOS` : prev.edad),
            gradoEstudios: res.nivelEstudioPaciente ?? prev.gradoEstudios,
            empresa: res.empresa ?? prev.empresa,
            cargo: res.cargo ?? prev.cargo,
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};