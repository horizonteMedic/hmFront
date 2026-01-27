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
    "/api/v01/ct/informePsicologicoAdeco/obtenerReporteInformePsicologicoAdeco";
const registrarUrl =
    "/api/v01/ct/informePsicologicoAdeco/registrarActualizarInformePsicologicoAdeco";

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
            fechaExamen: res.fechaExamen,
            nombreExamen: res.nombreExamen,
            esApto: res.apto,

            // Datos Personales
            nombres: res.nombresPaciente,
            apellidos: res.apellidosPaciente,
            fechaNacimiento: res.fechaNacimientoPaciente,
            edad: res.edadPaciente,
            lugarNacimiento: res.lugarNacimientoPaciente,
            domicilioActual: res.direccionPaciente,
            estadoCivil: res.estadoCivilPaciente,
            nivelEstudios: res.nivelEstudioPaciente,

            // Datos Laborales
            empresa: res.empresa,
            contrata: res.contrata,
            ocupacion: res.ocupacionPaciente,
            cargoDesempenar: res.cargoPaciente,

            // Criterios Psicológicos
            escalaStress: res.escalaSintomatica,
            somnolencia: res.somnolencia,
            testFatiga: res.testFatiga,

            // Análisis FODA
            fortalezasOportunidades: res.fortalezasOportunidades,
            amenazasDebilidades: res.amenazasDebilidades,

            // Observaciones y Recomendaciones
            observaciones: res.observaciones,
            recomendaciones: res.recomendacion,

            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
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
        fechaExamen: form.fechaExamen,
        nombreExamen: form.nombreExamen,
        escalaSintomatica: form.escalaStress,
        somnolencia: form.somnolencia,
        testFatiga: form.testFatiga,
        fortalezasOportunidades: form.fortalezasOportunidades,
        amenazasDebilidades: form.amenazasDebilidades,
        observaciones: form.observaciones,
        recomendacion: form.recomendaciones,
        apto: form.esApto,
        noApto: !form.esApto,
        usuarioRegistro: user,

        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/InformePsicologicoADECO/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/InformePsicologicoADECO"
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
                    "Este paciente ya cuenta con registros de Estrés, Fátiga y Somnolencia.",
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
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad + " AÑOS",
            ocupacion: res.areaO ?? "",
            domicilioActual: res.direccion ?? "",
            nombreExamen: res.nomExam ?? "",
            cargoDesempenar: res.cargo ?? "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};