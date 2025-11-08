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
    onFinish = () => { }
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
            // Header
            norden: res.norden ?? "",
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

    const body = {
        // Header
        norden: form.norden,
        usuarioRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/ModuloPsicologia/CalidadDeSueno/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/ModuloPsicologia/CalidadDeSueno"
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
            // NO tiene registro: cargar datos del paciente
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            // Sí tiene registro: cargar servicio y alertar
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Calidad de Sueño.",
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
            nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`.trim(),
            dni: res.dniPaciente ?? prev.dni ?? "",
            edad: (res.edadPaciente ? `${res.edadPaciente} AÑOS` : prev.edad) ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : (res.sexoPaciente === "F" ? "FEMENINO" : prev.sexo),
            empresa: res.empresa ?? prev.empresa ?? "",
            contrata: res.contrata ?? prev.contrata ?? "",
            puestoPostula: res.areaPaciente ?? prev.puestoPostula ?? "",
            puestoActual: res.cargoPaciente ?? prev.puestoActual ?? "",
            gradoInstruccion: res.nivelEstudioPaciente ?? prev.gradoInstruccion ?? "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};