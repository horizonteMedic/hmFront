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
    "/api/v01/ct/cuestionarioBerlin/obtenerReporte";

const registrarUrl =
    "/api/v01/ct/cuestionarioBerlin/registrarActualizar";

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

            nombreExamen: res.tipoExamen ?? "",
            dni: res.dniPaciente ?? "",

            esApto: res.perfilCumple,

            nombres: `${res.nombresPaciente} ${res.apellidosPaciente}`,
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: res.lugarNacimientoPaciente ?? "",
            edad: res.edad ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            estadoCivil: res.estadoCivilPaciente,
            nivelEstudios: res.nivelEstudioPaciente,
            // Datos Laborales
            empresa: res.empresa,
            contrata: res.contrata,
            ocupacion: res.ocupacionPaciente,
            cargoDesempenar: res.cargoPaciente,

            criterioApneaObstructivaSueno: res.criterioApneaObstructivaSueno ?? "",
            criterioFatigaSomnolencia: res.criterioFatigaSomnolencia ?? "",
            criterioHipertensionArterial: res.criterioHipertensionArterial ?? "",

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
        criterioApneaObstructivaSueno: form.criterioApneaObstructivaSueno ?? "",
        criterioFatigaSomnolencia: form.criterioFatigaSomnolencia ?? "",
        criterioHipertensionArterial: form.criterioHipertensionArterial ?? "",
        analisisFodaFortaOport: form.fortalezasOportunidades ?? "",
        analisisFodaAmenazDebili: form.amenazasDebilidades ?? "",
        observaciones: form.observaciones,
        recomendaciones: form.recomendaciones,
        perfCumple: form.esApto,
        perfNoCumple: !form.esApto,

        //agregar
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
                    "Este paciente ya cuenta con registros de Cuestionario de Berlin.",
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