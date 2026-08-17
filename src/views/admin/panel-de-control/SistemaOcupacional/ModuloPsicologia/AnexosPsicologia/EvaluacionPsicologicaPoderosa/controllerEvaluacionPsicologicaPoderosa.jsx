import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
    imprimirReporteJasper,
} from "../../../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl =
    "/api/v01/ct/evaluacionPsicologicaPoderosa/obtenerReporteEvaluacionPsicologicaPoderosa";
const registrarUrl =
    "/api/v01/ct/evaluacionPsicologicaPoderosa/registrarActualizarEvaluacionPsicologicaPoderosa";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build.
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/EvaluacionPsicologicaPoderosa/*.jsx");
const rutaReporte = "../../../../../../jaspers/ModuloPsicologia/EvaluacionPsicologicaPoderosa/InformePsicologico_Digitalizado.jsx";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
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
            tieneRegistro: false,
        }));
    }
};

// ===== Mapeo Edición (registro existente) =====
export const GetInfoServicioEditar = async (
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
    if (!res) return;

    // Helper para mapear opciones S/NPS/NP/NPI/I desde el JSON
    const pickEval = (prefix) => {
        if (res[`${prefix}S`]) return "S";
        if (res[`${prefix}NPS`]) return "NPS";
        if (res[`${prefix}NP`]) return "NP";
        if (res[`${prefix}NPI`]) return "NPI";
        if (res[`${prefix}I`]) return "I";
        return "";
    };

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
        aptitud: aptitudDerivada,
        sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",

        // Datos personales
        nombres: res.nombresPaciente,
        apellidos: res.apellidosPaciente,
        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente),
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
        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

        // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
        fechaRegistro: res.fechaRegistro ?? "",
        userRegistro: res.usuarioRegistro ?? "",
        fechaActualizacion: res.fechaActualizacion ?? "",
        usuarioActualizacion: res.usuarioActualizacion ?? "",
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
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
    usuarioFirma: form.user_medicoFirma,
});

// Body completo (creación / actualización). El backend de este módulo espera la
// clave "usuarioRegistro" (no "userRegistro") para el usuario que registra.
const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
        campoUserRegistro: "usuarioRegistro",
    });

// ===== Validación de datos obligatorios =====
const datosCompletos = (form) => {
    if (!form.norden) {
        Swal.fire("Error", "Datos Incompletos", "error");
        return false;
    }
    if (form.aptitud === undefined || form.aptitud === null || form.aptitud === "") {
        Swal.fire({
            icon: "error",
            title: "Datos Incompletos",
            text: "Por favor, seleccione la aptitud.",
        });
        return false;
    }
    return true;
};

// ===== Impresión =====
export const PrintHojaR = (nro, token, tabla, datosFooter, sede) =>
    imprimirReporteJasper({
        nro,
        token,
        tabla,
        datosFooter,
        sede,
        obtenerReporteUrl,
        jasperModules,
        rutaModulo: rutaReporte,
    });

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla, datosFooter) => {
    if (!datosCompletos(form)) return;
    return guardarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });
};

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla, datosFooter) => {
    if (!datosCompletos(form)) return;
    return actualizarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });
};

// ===== Búsqueda / verificación por N° Orden =====
export const VerifyTR = (nro, tabla, token, set, sede) =>
    verificarRegistro({
        nro,
        tabla,
        token,
        sede,
        onNuevo: () => GetInfoServicio(nro, set, token, sede),
        onExistente: () =>
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Evaluación Psicológica Poderosa.",
                    "warning"
                );
            }),
    });

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
