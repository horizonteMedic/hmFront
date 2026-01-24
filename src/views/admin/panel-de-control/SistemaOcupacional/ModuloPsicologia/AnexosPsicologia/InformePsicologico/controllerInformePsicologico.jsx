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
    "/api/v01/ct/informePsicologico/obtenerReporteInformePsicologico";
const registrarUrl =
    "/api/v01/ct/informePsicologico/registrarActualizarInformePsicologico";

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
            norden: res.norden,
            codigoInforme: res.codigoInforme,
            fechaEntrevista: res.fechaEntrevista || "",
            nombreExamen: res.nombreExamen ?? "",
            nombres: res.nombresPaciente,
            apellidos: res.apellidosPaciente,
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente),
            lugarNacimiento: res.lugarNacimientoPaciente,
            domicilioActual: res.direccionPaciente,
            edad: res.edadPaciente,
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            estadoCivil: res.estadoCivilPaciente,
            nivelEstudios: res.nivelEstudioPaciente,

            // Datos Laborales
            empresa: res.empresa,
            contrata: res.contrata,
            ocupacion: res.ocupacionPaciente,
            cargoDesempenar: res.cargoPaciente,

            // Área Intelectual
            areaIntelectual: res.areaIntelectual ?? "",
            intelectualSuperior: (res.areaIntelectual ?? "").includes("- EL EVALUADO POSEE UN NIVEL INTELECTUAL SUPERIOR."),
            intelectualPromedio: (res.areaIntelectual ?? "").includes("- EL EVALUADO POSEE UN NIVEL INTELECTUAL PROMEDIO."),
            intelectualPromedioSuperior: (res.areaIntelectual ?? "").includes("- EL EVALUADO POSEE UN NIVEL INTELECTUAL PROMEDIO SUPERIOR."),
            intelectualPromedioBajo: (res.areaIntelectual ?? "").includes("- EL EVALUADO POSEE UN NIVEL INTELECTUAL PROMEDIO BAJO."),

            promSuperior: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL PROMEDIO SUPERIOR EN COMPRENSION VERBAL Y EN CAPACIDAD DE CÁLCULO."),
            promedio: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL PROMEDIO EN COMPRENSION VERBAL Y EN CAPACIDAD DE CÁLCULO."),
            superior: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL SUPERIOR EN COMPRENSION VERBAL Y EN CAPACIDAD DE CÁLCULO."),
            promBajo: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL PROMEDIO BAJO EN COMPRENSION VERBAL Y EN CAPACIDAD DE CÁLCULO."),

            infosencilla: (res.areaIntelectual ?? "").includes("- COMPRENDE Y PROCESA LA INFORMACION SENCILLA CON FACILIDAD."),
            infogeneral: (res.areaIntelectual ?? "").includes("- COMPRENDE Y PROCESA LA INFORMACION CON FACILIDAD."),

            compInfo: (res.areaIntelectual ?? "").includes("- COMPRENDE Y PROCESA LA INFORMACION SENCILLA CON FACILIDAD."),
            // compBajo: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL PROMEDIO BAJO EN EL MANEJO DE FACULTADES MENTALES."),

            supVerbalNum: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL SUPERIOR EN COMPRENSION VERBAL Y EN CAPACIDAD NUMÉRICA."),
            promVerbalNum: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL PROMEDIO EN COMPRENSION VERBAL Y EN CAPACIDAD NUMÉRICA."),
            promSupVerbalNum: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL PROMEDIO SUPERIOR EN COMPRENSION VERBAL Y EN CAPACIDAD NUMÉRICA."),
            promBajoVerbalNum: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL PROMEDIO BAJO EN COMPRENSION VERBAL Y EN CAPACIDAD NUMÉRICA."),

            adecuado: (res.areaIntelectual ?? "").includes("- ADECUADA RETENCION DE DIGITOS."),
            prmBajo: (res.areaIntelectual ?? "").includes("- PRESENTA UN NIVEL PROMEDIO BAJO RETENCION DE DIGITOS."),

            // Área de Personalidad
            areaPersonalidad: res.areaPersonalidad ?? "",

            // Área de Psicomotricidad
            areaPsicomotricidad: res.areaPsicomotricidad ?? "",
            nivAdecuado: (res.areaPsicomotricidad ?? "").includes("- NIVEL ADECUADO EN DESARROLLO PSICOMOTOR."),
            facilidad: (res.areaPsicomotricidad ?? "").includes("- REALIZA LAS INSTRUCCIONES BRINDADAS CON FACILIDAD."),
            dificultad: (res.areaPsicomotricidad ?? "").includes("- REALIZA LAS INSTRUCCIONES BRINDADAS CON DIFICULTAD."),

            // Área de Organicidad
            areaOrganicidad: res.areaOrganicidad ?? "",
            orientadoTiempo: (res.areaOrganicidad ?? "").includes("- ORIENTADO EN TIEMPO, ESPACIO, Y PERSONA."),

            adecuadoManejo: (res.areaOrganicidad ?? "").includes("- POSEE UN ADECUADO MANEJO DE FACULTADES MENTALES"),
            bajoManejo: (res.areaOrganicidad ?? "").includes("- POSEE UN NIVEL PROMEDIO BAJO EN EL MANEJO DE FACULTADES MENTALES."),

            noEnvidencia: (res.areaOrganicidad ?? "").includes("- NO SE EVIDENCIA DAÑO ORGÁNICO."),

            // Recomendaciones
            recomendaciones: res.recomendaciones,



            // Aprobó Test
            aproboTest: res.aprobo ?? false,
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
    if (form.aproboTest == undefined || form.aproboTest == null) {
        await Swal.fire("Datos Incompletos", "Seleccione si Aprobó Test", "error");
        return;
    }
    const body = {
        codigoInforme: form.codigoInforme,
        norden: form.norden,
        fechaEntrevista: form.fechaEntrevista,
        edad: form.edad,
        areaIntelectual: form.areaIntelectual,
        areaPersonalidad: form.areaPersonalidad,
        areaOrganicidad: form.areaOrganicidad,
        areaPsicomotricidad: form.areaPsicomotricidad,
        recomendaciones: form.recomendaciones,
        aprobo: form.aproboTest ?? false,
        desaprobo: !(form.aproboTest ?? false),
        usuarioRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/InformePsicologico/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/InformePsicologico"
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
                    "Este paciente ya cuenta con registros de Informe Psicologico.",
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
            edad: res.edad,
            ocupacion: res.areaO ?? "",
            nombreExamen: res.nomExam ?? "",
            cargoDesempenar: res.cargo ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            domicilioActual: res.direccion ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
        }));
    }
};


export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
