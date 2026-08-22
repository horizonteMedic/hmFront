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
    "/api/v01/ct/psicologia/obtenerFichaPsicologiaAnexo02";
const registrarUrl =
    "/api/v01/ct/psicologia/registrarActualizarFichaPsicologiaAnexo02";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build.
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/FichaAnexo2/*.jsx");
const rutaReporte = "../../../../../../jaspers/ModuloPsicologia/FichaAnexo2/InformePsicologico_Anexo02_Digitalizado.jsx";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            nombres: res.nombresApellidos ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            fechaExamen: prev.fechaExamen,
            edad: res.edad,
            dni: res.dni ?? "",
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
    set((prev) => ({
        ...prev,
        ...res,
        norden: res.norden,
        fechaExamen: res.fechaExamen_fecha,
        esApto: res.apto_apto,
        nombres: res.nombresPaciente + " " + res.apellidosPaciente,
        dni: res.dniPaciente,
        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente),
        lugarNacimiento: res.lugarNacimientoPaciente,
        domicilioActual: res.direccionPaciente,
        edad: res.edadPaciente,
        nivelEstudios: res.nivelEstudioPaciente,
        sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
        estadoCivil: res.estadoCivilPaciente,

        // Datos laborales
        empresa: res.empresa,
        contrata: res.contrata,
        ocupacion: res.ocupacionPaciente,
        cargoDesempenar: res.cargoPaciente,

        // Motivo de evaluación
        motivoEvaluacion: res.motivoEvaluacion_motivo_eval,

        // Observación de Conductas
        presentacion: res.presentacionAdecuado_rb_adecuado ? "ADECUADO" :
            res.presentacionInadecuado_rb_inadecuado ? "INADECUADO" : "",
        postura: res.posturaErguida_rb_erguida ? "ERGUIDA" :
            res.posturaEncorvada_rb_encorvada ? "ENCORVADA" : "",
        discursoRitmo: res.ritmoFluido_rb_fluido ? "FLUIDO" :
            res.ritmoLento_rb_lento ? "LENTO" :
                res.ritmoRapido_rb_rapido ? "RAPIDO" : "",
        discursoTono: res.tonoModerado_rb_moderado ? "MODERADO" :
            res.tonoBajo_rb_bajo ? "BAJO" :
                res.tonoAlto_rb_alto ? "ALTO" : "",

        discursoArticulacion: res.articulacionSinDificultad_rb_sindificultad ? "SIN_DIFICULTAD" :
            res.articulacionConDificultad_rb_condificultad ? "CON_DIFICULTAD" : "",
        orientacionTiempo: res.tiempoOrientado_rb_tiempo_orientado ? "ORIENTADO" :
            res.tiempoDesorientado_rb_tiempo_desorientado ? "DESORIENTADO" : "",
        orientacionEspacio: res.espacioOrientado_rb_espacio_orientado ? "ORIENTADO" :
            res.espacioDesorientado_rb_espacio_desorientado ? "DESORIENTADO" : "",
        orientacionPersona: res.personaOrientado_rb_persona_orientado ? "ORIENTADO" :
            res.personaDesorientado_rb_persona_desorientado ? "DESORIENTADO" : "",


        // Resultados de evaluación
        nivelIntelectual: res.nivelIntelectual_resul_nivel_intelectual,
        coordinacionVisomotriz: res.coordinacionVisomotriz_resul_coordinacion_visomotriz,
        nivelMemoria: res.nivelMemoria_resul_nivel_memoria,
        personalidad: res.personalidad_resul_personalidad,
        afectividad: res.efectividad_resul_efectividad,

        // Recomendaciones y Conclusiones
        recomendaciones: res.recomendaciones_recomendaciones,
        areaCognitiva: res.areaCognitiva_areacognitiva,
        areaEmocional: res.areaEmocional_areaemocional,

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
    fechaExamen: form.fechaExamen,
    motivoEvaluacion: form.motivoEvaluacion,
    presentacionAdecuado: form.presentacion == "ADECUADO",
    presentacionInadecuado: form.presentacion == "INADECUADO",
    posturaErguida: form.postura == "ERGUIDA",
    posturaEncorvada: form.postura == "ENCORVADA",
    ritmoLento: form.discursoRitmo == "LENTO",
    ritmoRapido: form.discursoRitmo == "RAPIDO",
    ritmoFluido: form.discursoRitmo == "FLUIDO",
    tonoBajo: form.discursoTono == "BAJO",
    tonoModerado: form.discursoTono == "MODERADO",
    tonoAlto: form.discursoTono == "ALTO",
    articulacionConDificultad: form.discursoArticulacion == "CON_DIFICULTAD",
    articulacionSinDificultad: form.discursoArticulacion == "SIN_DIFICULTAD",
    tiempoOrientado: form.orientacionTiempo == "ORIENTADO",
    tiempoDesorientado: form.orientacionTiempo == "DESORIENTADO",
    espacioOrientado: form.orientacionEspacio == "ORIENTADO",
    espacioDesorientado: form.orientacionEspacio == "DESORIENTADO",
    personaOrientado: form.orientacionPersona == "ORIENTADO",
    personaDesorientado: form.orientacionPersona == "DESORIENTADO",
    nivelIntelectual: form.nivelIntelectual,
    coordinacionVisomotriz: form.coordinacionVisomotriz,
    nivelMemoria: form.nivelMemoria,
    personalidad: form.personalidad,
    efectividad: form.afectividad,
    areaCognitiva: form.areaCognitiva,
    areaEmocional: form.areaEmocional,
    recomendaciones: form.recomendaciones,
    apto: form.esApto,
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
    if (form.esApto === undefined || form.esApto === "") {
        Swal.fire({
            icon: "error",
            title: "Datos Incompletos",
            text: "Por favor, marque la aptitud.",
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
                    "Este paciente ya cuenta con registros de Ficha Psicológica 2.",
                    "warning"
                );
            }),
    });

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
