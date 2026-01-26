import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../utils/functionUtils";

const obtenerReporteUrl =
    "/api/v01/ct/certificadoManipuladoresAlimentos/obtenerReporteCertificadoManipuladoresAlimentos";
const registrarUrl =
    "/api/v01/ct/certificadoManipuladoresAlimentos/registrarActualizarCertificadoManipuladoresAlimentos";

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
            ...res,
            norden: res.norden,
            fechaExam: res.fechaExamen,
            nombreExamen: res.nombreExamen ?? "",
            esApto: res.apto ?? false,

            // Datos personales
            nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
            dni: res.dniPaciente ?? "",
            edad: res.edadPaciente ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            cargo: res.cargoPaciente ?? "",
            areaTrabajo: res.areaPaciente ?? "",

            // Recomendaciones
            recomendaciones: res.recomendaciones ?? "",
            observaciones: res.observaciones ?? "",

            user_medicoFirma: res.usuarioFirma,
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
    if (form.esApto === undefined) {
        await Swal.fire("Error", "Por favor, seleccione la aptitud.", "error");
        return;
    }
    const body = {
        norden: form.norden,
        fechaExamen: form.fechaExam,
        apto: form.esApto,
        noApto: !form.esApto,
        observaciones: form.observaciones,
        recomendaciones: form.recomendaciones,
        usuarioRegistro: user,

        usuarioFirma: form.user_medicoFirma,
    };
    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/Poderosa/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/Poderosa"
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
                    "Este paciente ya cuenta con registros de Certificado de Manipuladores de Alimentos.",
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
            nombres: res.nombres,
            nombreExamen: res.nomExam ?? "",
            dni: res.dni,
            edad: res.edad + " AÑOS",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
            empresa: res.empresa,
            contrata: res.contrata,
            cargo: res.cargo ?? "",
            areaTrabajo: res.areaO ?? "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};