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
    "/api/v01/ct/altoRiesgo/obtenerReporteAltoRiesgo";
const registrarUrl =
    "/api/v01/ct/altoRiesgo/registrarActualizarAltoRiesgo";

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
            fecha: res.fechaRegistro,

            esApto: res.perfilCumple ?? false,

            nombreExamen: res.tipoExamen ?? "",
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

            temorRiesgoElectrico: res.critTemorRiesgoElectrico ?? "",
            temorTareaAltura: res.critTemorAlturasIzaje ?? "",
            temorEspaciosConfinados: res.critTemorEspacConfi ?? "",

            // Análisis FODA
            fortalezasOportunidades: res.analisisFodaFortalezasOportunidades ?? "",
            amenazasDebilidades: res.analisisFodaAmenazasDebilidades ?? "",

            // Observaciones y Recomendaciones
            observaciones: res.observaciones ?? "",
            recomendaciones: res.recomendaciones ?? "",

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
    if (form.esApto === undefined || form.esApto === null) {
        await Swal.fire("Error", "Debe marcar aptitud", "error");
        return;
    }
    const body = {
        norden: form.norden,
        fechaRegistro: form.fecha,

        critTemorRiesgoElectrico: form.temorRiesgoElectrico,
        critTemorAlturasIzaje: form.temorTareaAltura,
        critTemorEspacConfi: form.temorEspaciosConfinados,
        analiFodaFortaOport: form.fortalezasOportunidades,
        analiFodaAmenazDebili: form.amenazasDebilidades,
        observaciones: form.observaciones,
        recomendaciones: form.recomendaciones,
        perfCumple: form.esApto,
        perfNoCumple: !form.esApto,

        usuarioRegistro: user,
        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/InformePsicoAltoRiesgo/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/InformePsicoAltoRiesgo"
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
                    "Este paciente ya cuenta con registros de Alto Riesgo.",
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