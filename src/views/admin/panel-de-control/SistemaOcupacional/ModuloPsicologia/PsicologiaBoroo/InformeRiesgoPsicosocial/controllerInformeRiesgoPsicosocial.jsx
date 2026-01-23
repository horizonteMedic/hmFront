import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";

const obtenerReporteUrl =
    "/api/v01/ct/informeRiesgoPsicosocial/obtenerReporteInformeRiesgoPsicosocial";
const registrarUrl =
    "/api/v01/ct/informeRiesgoPsicosocial/registrarActualizarInformeRiesgoPsicosocial";

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
            norden: res.norden ?? "",
            fecha: res.fecha,

            nombreExamen: res.nombreExamen ?? "",
            dni: res.dniPaciente ?? "",

            nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: res.lugarNacimientoPaciente ?? "",
            edad: res.edadPaciente ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            estadoCivil: res.estadoCivilPaciente,
            nivelEstudios: res.nivelEstudioPaciente,
            // Datos Laborales
            empresa: res.empresa,
            contrata: res.contrata,
            ocupacion: res.ocupacionPaciente,
            cargoDesempenar: res.cargoPaciente,

            // Riesgos Psicosociales
            exigenciasPsicologicas: res.exigenciasPsicologicasFavorable ? "FAVORABLE" :
                res.exigenciasPsicologicasPromedio ? "PROMEDIO" :
                    res.exigenciasPsicologicasDesfavorable ? "DESFAVORABLE" : "",

            trabajoActivoDesarrollo: res.trabajoActivoFavorable ? "FAVORABLE" :
                res.trabajoActivoPromedio ? "PROMEDIO" :
                    res.trabajoActivoDesfavorable ? "DESFAVORABLE" : "",

            apoyoSocial: res.apoyoSocialFavorable ? "FAVORABLE" :
                res.apoyoSocialPromedio ? "PROMEDIO" :
                    res.apoyoSocialDesfavorable ? "DESFAVORABLE" : "",

            compensaciones: res.compensacionesFavorable ? "FAVORABLE" :
                res.compensacionesPromedio ? "PROMEDIO" :
                    res.compensacionesDesfavorable ? "DESFAVORABLE" : "",

            doblePresencia: res.doblePresenciaFavorable ? "FAVORABLE" :
                res.doblePresenciaPromedio ? "PROMEDIO" :
                    res.doblePresenciaDesfavorable ? "DESFAVORABLE" : "",

            // Texto libre
            recomendaciones: res.recomendaciones ?? "",
            analisisResultados: res.analisis ?? "",
            conclusionPerfil: res.apto ?? false,

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
    if (form.conclusionPerfil == undefined || form.conclusionPerfil == null) {
        await Swal.fire("Error", "Debe ingresar la conclusión del perfil del paciente", "error");
        return;
    }
    const body = {
        norden: form.norden,
        fecha: form.fecha,

        exigenciasPsicologicasFavorable: form.exigenciasPsicologicas == "FAVORABLE",
        exigenciasPsicologicasPromedio: form.exigenciasPsicologicas == "PROMEDIO",
        exigenciasPsicologicasDesfavorable: form.exigenciasPsicologicas == "DESFAVORABLE",

        trabajoActivoFavorable: form.trabajoActivoDesarrollo == "FAVORABLE",
        trabajoActivoPromedio: form.trabajoActivoDesarrollo == "PROMEDIO",
        trabajoActivoDesfavorable: form.trabajoActivoDesarrollo == "DESFAVORABLE",

        apoyoSocialFavorable: form.apoyoSocial == "FAVORABLE",
        apoyoSocialPromedio: form.apoyoSocial == "PROMEDIO",
        apoyoSocialDesfavorable: form.apoyoSocial == "DESFAVORABLE",

        compensacionesFavorable: form.compensaciones == "FAVORABLE",
        compensacionesPromedio: form.compensaciones == "PROMEDIO",
        compensacionesDesfavorable: form.compensaciones == "DESFAVORABLE",

        doblePresenciaFavorable: form.doblePresencia == "FAVORABLE",
        doblePresenciaPromedio: form.doblePresencia == "PROMEDIO",
        doblePresenciaDesfavorable: form.doblePresencia == "DESFAVORABLE",

        analisis: form.analisisResultados,
        recomendaciones: form.recomendaciones,
        apto: form.conclusionPerfil,
        noApto: !form.conclusionPerfil,
        usuarioRegistro: user,

        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob(
        "../../../../../jaspers/ModuloPsicologia/InformeRiesgosPsicosociales/*.jsx"
    );
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/ModuloPsicologia/InformeRiesgosPsicosociales"
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
            // NO Tiene registro
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            // Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Informe de Riesgos Psicosociales.",
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
            nombres: res.nombresApellidos ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad,
            ocupacion: res.areaO ?? "",
            nombreExamen: res.nomExam ?? "",
            cargoDesempenar: res.cargo ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};