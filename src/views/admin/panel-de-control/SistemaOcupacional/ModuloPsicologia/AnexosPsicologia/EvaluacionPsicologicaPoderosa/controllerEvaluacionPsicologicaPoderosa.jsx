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
    "/api/v01/ct/evaluacionPsicologicaPoderosa/obtenerReporteEvaluacionPsicologicaPoderosa";
const registrarUrl =
    "/api/v01/ct/evaluacionPsicologicaPoderosa/registrarActualizarEvaluacionPsicologicaPoderosa";

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
        // Helper para mapear opciones S/NPS/NP/NPI/I desde el JSON
        const pickEval = (prefix) => {
            if (res[`${prefix}S`]) return "S";
            if (res[`${prefix}NPS`]) return "NPS";
            if (res[`${prefix}NP`]) return "NP";
            if (res[`${prefix}NPI`]) return "NPI";
            if (res[`${prefix}I`]) return "I";
            return "";
        };

        // Derivar tipo de informe desde flags del JSON
        const tipoInformeDerivado = res.trabajosCaliente
            ? "T. EN CALIENTE"
            : res.licencia
                ? "LICENCIA"
                : "NORMAL";

        // Derivar aptitud desde flags del JSON (prioridad: APTO > NO APTO > EX > AP O.)
        const aptitudDerivada = res.apto
            ? "APTO"
            : res.noApto
                ? "NO APTO"
                : res.excelente
                    ? "EX"
                    : res.aptoObservacion
                        ? "AP O."
                        : "";

        set((prev) => ({
            ...prev,
            // Header
            norden: res.norden,
            codigoEvaluacionPsicologicaPoderosa: res.codigoEvaluacionPsicologicaPoderosa,
            fechaExam: res.fecha,
            nombreExamen: res.nombreExamen,
            tipoInforme: tipoInformeDerivado,
            aptitud: aptitudDerivada,

            // Datos personales
            nombres: res.nombresPaciente,
            apellidos: res.apellidosPaciente,
            fechaNacimiento: res.fechaNacimientoPaciente,
            lugarNacimiento: res.lugarNacimientoPaciente,
            domicilioActual: res.direccionPaciente,
            edad: res.edadPaciente,
            estadoCivil: res.estadoCivilPaciente,
            nivelEstudios: res.nivelEstudioPaciente,

            // Datos laborales
            ocupacion: res.ocupacionPaciente,
            cargoDesempenar: res.cargoPaciente,
            empresa: res.empresa,
            contrata: res.contrata,

            // Áreas de Evaluación (Inteligencia)
            intelCoeficiente: pickEval("coeficienteIntelectual"),
            intelComprension: pickEval("compresion"),
            intelAtencion: pickEval("nivelAtencion"),
            intelMemoria: pickEval("memoria"),
            intelVisomotora: pickEval("coordinacionViso"),
            intelOrientacionEspacial: pickEval("orientacionEspacial"),
            intelDiscriminarDetalles: pickEval("capacidadDetalles"),
            intelAprendizaje: pickEval("capacidadAprendizaje"),
            intelAnalisisSintesis: pickEval("capacidadAnalisis"),

            // Áreas de Evaluación (Personalidad)
            persEstabilidad: pickEval("estabilidadEmocional"),
            persAfrontaEstres: pickEval("afrontamientoEstres"),
            persAfrontaRiesgo: pickEval("afrontamientoRiesgo"),
            persRelaciones: pickEval("relacionesInterpersonales"),
            persNormasReglas: pickEval("disposicionNormas"),

            // Campos de texto libres
            fortalezasOportunidades: res.fortalezasOportunidades,
            amenazasDebilidades: res.amenazasDebilidades,
            observaciones: res.observaciones,
            recomendaciones: res.recomendaciones,
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
    if (form.aptitud === undefined || form.aptitud === null || form.aptitud === "") {
        Swal.fire({
            icon: "error",
            title: "Datos Incompletos",
            text: "Por favor, seleccione la aptitud.",
        });
        return;
    }
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }
    const body = {
        norden: form.norden,
        codigoEvaluacionPsicologicaPoderosa: form.codigoEvaluacionPsicologicaPoderosa,
        edad: form.edad,
        fecha: form.fechaExam,

        // Inteligencia
        coeficienteIntelectualS: form.intelCoeficiente === "S",
        coeficienteIntelectualNPS: form.intelCoeficiente === "NPS",
        coeficienteIntelectualNP: form.intelCoeficiente === "NP",
        coeficienteIntelectualNPI: form.intelCoeficiente === "NPI",
        coeficienteIntelectualI: form.intelCoeficiente === "I",

        compresionS: form.intelComprension === "S",
        compresionNPS: form.intelComprension === "NPS",
        compresionNP: form.intelComprension === "NP",
        compresionNPI: form.intelComprension === "NPI",
        compresionI: form.intelComprension === "I",

        nivelAtencionS: form.intelAtencion === "S",
        nivelAtencionNPS: form.intelAtencion === "NPS",
        nivelAtencionNP: form.intelAtencion === "NP",
        nivelAtencionNPI: form.intelAtencion === "NPI",
        nivelAtencionI: form.intelAtencion === "I",

        memoriaS: form.intelMemoria === "S",
        memoriaNPS: form.intelMemoria === "NPS",
        memoriaNP: form.intelMemoria === "NP",
        memoriaNPI: form.intelMemoria === "NPI",
        memoriaI: form.intelMemoria === "I",

        coordinacionVisoS: form.intelVisomotora === "S",
        coordinacionVisoNPS: form.intelVisomotora === "NPS",
        coordinacionVisoNP: form.intelVisomotora === "NP",
        coordinacionVisoNPI: form.intelVisomotora === "NPI",
        coordinacionVisoI: form.intelVisomotora === "I",

        orientacionEspacialS: form.intelOrientacionEspacial === "S",
        orientacionEspacialNPS: form.intelOrientacionEspacial === "NPS",
        orientacionEspacialNP: form.intelOrientacionEspacial === "NP",
        orientacionEspacialNPI: form.intelOrientacionEspacial === "NPI",
        orientacionEspacialI: form.intelOrientacionEspacial === "I",

        capacidadDetallesS: form.intelDiscriminarDetalles === "S",
        capacidadDetallesNPS: form.intelDiscriminarDetalles === "NPS",
        capacidadDetallesNP: form.intelDiscriminarDetalles === "NP",
        capacidadDetallesNPI: form.intelDiscriminarDetalles === "NPI",
        capacidadDetallesI: form.intelDiscriminarDetalles === "I",

        capacidadAprendizajeS: form.intelAprendizaje === "S",
        capacidadAprendizajeNPS: form.intelAprendizaje === "NPS",
        capacidadAprendizajeNP: form.intelAprendizaje === "NP",
        capacidadAprendizajeNPI: form.intelAprendizaje === "NPI",
        capacidadAprendizajeI: form.intelAprendizaje === "I",

        capacidadAnalisisS: form.intelAnalisisSintesis === "S",
        capacidadAnalisisNPS: form.intelAnalisisSintesis === "NPS",
        capacidadAnalisisNP: form.intelAnalisisSintesis === "NP",
        capacidadAnalisisNPI: form.intelAnalisisSintesis === "NPI",
        capacidadAnalisisI: form.intelAnalisisSintesis === "I",

        // Personalidad
        estabilidadEmocionalS: form.persEstabilidad === "S",
        estabilidadEmocionalNPS: form.persEstabilidad === "NPS",
        estabilidadEmocionalNP: form.persEstabilidad === "NP",
        estabilidadEmocionalNPI: form.persEstabilidad === "NPI",
        estabilidadEmocionalI: form.persEstabilidad === "I",

        afrontamientoEstresS: form.persAfrontaEstres === "S",
        afrontamientoEstresNPS: form.persAfrontaEstres === "NPS",
        afrontamientoEstresNP: form.persAfrontaEstres === "NP",
        afrontamientoEstresNPI: form.persAfrontaEstres === "NPI",
        afrontamientoEstresI: form.persAfrontaEstres === "I",

        afrontamientoRiesgoS: form.persAfrontaRiesgo === "S",
        afrontamientoRiesgoNPS: form.persAfrontaRiesgo === "NPS",
        afrontamientoRiesgoNP: form.persAfrontaRiesgo === "NP",
        afrontamientoRiesgoNPI: form.persAfrontaRiesgo === "NPI",
        afrontamientoRiesgoI: form.persAfrontaRiesgo === "I",

        relacionesInterpersonalesS: form.persRelaciones === "S",
        relacionesInterpersonalesNPS: form.persRelaciones === "NPS",
        relacionesInterpersonalesNP: form.persRelaciones === "NP",
        relacionesInterpersonalesNPI: form.persRelaciones === "NPI",
        relacionesInterpersonalesI: form.persRelaciones === "I",

        disposicionNormasS: form.persNormasReglas === "S",
        disposicionNormasNPS: form.persNormasReglas === "NPS",
        disposicionNormasNP: form.persNormasReglas === "NP",
        disposicionNormasNPI: form.persNormasReglas === "NPI",
        disposicionNormasI: form.persNormasReglas === "I",

        // Textos libres
        fortalezasOportunidades: form.fortalezasOportunidades,
        amenazasDebilidades: form.amenazasDebilidades,
        observaciones: form.observaciones,
        recomendaciones: form.recomendaciones,

        // Aptitud
        apto: form.aptitud === "APTO",
        noApto: form.aptitud === "NO APTO",
        excelente: form.aptitud === "EX",
        aptoObservacion: form.aptitud === "AP O.",

        // Tipo Informe
        licencia: form.tipoInforme === "LICENCIA",
        trabajosCaliente: form.tipoInforme === "T. EN CALIENTE",
        usuarioRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/EvaluacionPsicologicaPoderosa/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/EvaluacionPsicologicaPoderosa"
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
                    "Este paciente ya cuenta con registros de Evaluación Psicológica Poderosa.",
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
            cargoDesempenar: res.cargo ?? "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};