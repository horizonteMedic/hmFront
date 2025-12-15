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
    "/api/v01/ct/psicologia/obtenerFichaPsicologiaAnexo03";
const registrarUrl =
    "/api/v01/ct/psicologia/registrarActualizarFichaPsicologiaAnexo03";
const obtenerReporteInfoTablaUrl =
    "/api/v01/ct/historiaOcupacional/obtenerHistoriaOcupacionalDetallesPorNorden";

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
            // ===== TAB: DATOS PERSONALES =====
            // Información General
            norden: res.norden,
            fechaExamen: res.fechaExamen_fecha,
            nombreExamen: res.nombreExamen,
            codigoAnexo: res.codigoAnexo_cod_anexo03,

            // Datos Personales
            nombres: res.nombresPaciente,
            dni: res.dniPaciente,
            sexo: res.sexoPaciente,
            apellidos: res.apellidosPaciente,
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente),
            lugarNacimiento: res.lugarNacimientoPaciente,
            edad: res.edadPaciente,
            estadoCivil: res.estadoCivilPaciente,
            gradoInstruccion: res.nivelEstudioPaciente,

            // Datos Laborales
            empresa: res.empresa,
            tiempoExperiencia: res.tiempoTrabajo_timpo_trab,
            contrata: res.contrata,
            puesto: res.cargoPaciente,
            area: res.areaPaciente,
            mineralExp: res.mineralExp ?? "", //revisar - no encontrado en JSON
            explotacionEn: res.explotacionEn ?? "", //revisar - no encontrado en JSON
            alturaLabor: res.alturaLabor ?? "", //revisar - no encontrado en JSON

            // Evaluación y Riesgos
            motivoEvaluacion: res.motivoEvaluacion_motivo_eval,
            principalesRiesgos: res.principalRiesgo_princ_riesgo,
            medidasSeguridad: res.medidasSeguridad_med_seguridad,

            // Historia y Observaciones
            historiaFamiliar: res.historialFamiliar_hist_familiar,
            habitos: res.habitos_habitos,
            otrasObservaciones: res.otrasObservaciones_otras_observ,

            // ===== TAB: EXAMEN MENTAL =====
            // Observación de Conductas - Presentación
            presentacion: res.presentacionAdecuado_rb_adecuado ? "ADECUADO" : (res.presentacionIndecuado_rb_indecuado ? "INADECUADO" : ""),

            // Observación de Conductas - Postura
            postura: res.posturaErguida_rb_erguida ? "ERGUIDA" : (res.posturaEncorvada_rb_encorvada ? "ENCORVADA" : ""),

            // Observación de Conductas - Discurso
            ritmo: res.ritmoLento_rb_lento ? "LENTO" :
                (res.ritmoRapido_rb_rapido ? "RAPIDO" :
                    (res.ritmoFluido_rb_fluido ? "FLUIDO" : "")),
            tono: res.tonoBajo_rb_bajo ? "BAJO" :
                (res.tonoModerado_rb_moderado ? "MODERADO" :
                    (res.tonoAlto_rb_alto ? "ALTO" : "")),
            articulacion: res.articulacionConDificultad_rb_condificultad ? "CON_DIFICULTAD" :
                (res.articulacionSinDificultad_rb_sindificultad ? "SIN_DIFICULTAD" : ""),

            // Observación de Conductas - Orientación
            orientacionTiempo: res.tiempoOrientado_rb_torientado ? "ORIENTADO" :
                (res.tiempoDesorientado_rb_tdesorientado ? "DESORIENTADO" : ""),
            orientacionEspacio: res.espacioOrientado_rb_eorientado ? "ORIENTADO" :
                (res.espacioDesorientado_rb_edesorientado ? "DESORIENTADO" : ""),
            orientacionPersona: res.personaOrientado_rb_porientado ? "ORIENTADO" :
                (res.personaDesorientado_rb_pdesorientado ? "DESORIENTADO" : ""),

            // Observación de Conductas - Área Cognitiva
            areaCognitiva: res.areaCognitiva_area_cognitiva,

            // Procesos Cognitivos
            lucidoAtento: res.lucido_lucido,
            pensamiento: res.pensamiento_pensamiento,
            percepcion: res.percepcion_percepcion,
            memoria: res.memoriaCortoPlazo_rb_cortoplazo ? "CORTO_PLAZO" :
                (res.memoriaMedianoPlazo_rb_medianoplazo ? "MEDIANO_PLAZO" :
                    (res.memoriaLargoPlazo_rb_largoplazo ? "LARGO_PLAZO" : "")),

            inteligencia: res.inteligenciaMuySuperior_rb_muysuperior ? "MUY_SUPERIOR" :
                (res.inteligenciaSuperior_rb_superior ? "SUPERIOR" :
                    (res.inteligenciaNormal_rb_normal ? "NORMAL" :
                        (res.inteligenciaPromedio_rb_promedio ? "PROMEDIO" :
                            (res.inteligenciaTorpe_rb_torpe ? "TORPE" :
                                (res.inteligenciaFronterizo_rb_fronterizo ? "FRONTERIZO" :
                                    (res.inteligenciaRMLeve_rb_rleve ? "RM_LEVE" :
                                        (res.inteligenciaRMModerado_rb_rmoderado ? "RM_MODERADO" :
                                            (res.inteligenciaRMSevero_rb_rsevero ? "RM_SEVERO" :
                                                (res.inteligenciaRMProfundo_rb_rprofundo ? "RM_PROFUNDO" : ""))))))))),
            apetito: res.apetito_apetito,
            sueno: res.sueno_sueno,
            personalidad: res.personalidad_personalidad,
            afectividad: res.afectividad_afectividad,
            conductaSexual: res.conductaSexual_conducta_sexual,

            empresasAnteriores: res.detalles ?? [],

            // Pruebas Psicológicas - Ptje Nombre
            mips: res.puntajeMips_puntaje1 == "X" ? true : false,
            mps: res.puntajeMps_puntaje2 == "X" ? true : false,
            luria: res.puntajeDna_puntaje3 == "X" ? true : false,
            eae: res.puntajeEAE_puntaje4 == "X" ? true : false,
            maslach: res.puntajeInventarioBormout_puntaje5 == "X" ? true : false,
            climaLaboral: res.puntajeClimaLaboral_puntaje6 == "X" ? true : false,
            conductores: res.puntajeBacteriaConductores_puntaje7 == "X" ? true : false,
            wais: res.puntajeWais_puntaje8 == "X" ? true : false,
            benton: res.puntajeBenton_puntaje9 == "X" ? true : false,
            bender: res.puntajeBender_puntaje10 == "X" ? true : false,
            zungAnsiedad: res.puntajeAnsiedadZung_puntaje11 == "X" ? true : false,
            zungDepresion: res.puntajeDepresionZung_puntaje12 == "X" ? true : false,
            wechsler: res.puntajeEscalaMemoriaWechsler_puntaje13 == "X" ? true : false,
            otrasPruebas: res.puntajeOtrasPruebas_puntaje14 == "X" ? true : false,

            // Pruebas Psicológicas - Área Emocional
            areaEmocional: res.areaEmocional_area_emocional,
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
        norden: form.norden,
        codigoAnexo: form.codigoAnexo,
        fechaExamen: form.fechaExamen,
        edad: form.edad,
        motivoEvaluacion: form.motivoEvaluacion,
        tiempoTrabajo: form.tiempoExperiencia,
        principalRiesgo: form.principalesRiesgos,
        medidasSeguridad: form.medidasSeguridad,
        historialFamiliar: form.historiaFamiliar,
        habitos: form.habitos,
        otrasObservaciones: form.otrasObservaciones,
        presentacionAdecuado: form.presentacion === 'ADECUADO',
        presentacionIndecuado: form.presentacion === 'INADECUADO',
        posturaErguida: form.postura === 'ERGUIDA',
        posturaEncorvada: form.postura === 'ENCORVADA',
        ritmoLento: form.ritmo === 'LENTO',
        ritmoRapido: form.ritmo === 'RAPIDO',
        ritmoFluido: form.ritmo === 'FLUIDO',
        tonoBajo: form.tono === 'BAJO',
        tonoModerado: form.tono === 'MODERADO',
        tonoAlto: form.tono === 'ALTO',
        articulacionConDificultad: form.articulacion === 'CON_DIFICULTAD',
        articulacionSinDificultad: form.articulacion === 'SIN_DIFICULTAD',
        tiempoOrientado: form.orientacionTiempo === 'ORIENTADO',
        tiempoDesorientado: form.orientacionTiempo === 'DESORIENTADO',
        espacioOrientado: form.orientacionEspacio === 'ORIENTADO',
        espacioDesorientado: form.orientacionEspacio === 'DESORIENTADO',
        personaOrientado: form.orientacionPersona === 'ORIENTADO',
        personaDesorientado: form.orientacionPersona === 'DESORIENTADO',
        lucido: form.lucidoAtento,
        pensamiento: form.pensamiento,
        percepcion: form.percepcion,
        memoriaCortoPlazo: form.memoria === 'CORTO_PLAZO',
        memoriaMedianoPlazo: form.memoria === 'MEDIANO_PLAZO',
        memoriaLargoPlazo: form.memoria === 'LARGO_PLAZO',
        inteligenciaMuySuperior: form.inteligencia === 'MUY_SUPERIOR',
        inteligenciaSuperior: form.inteligencia === 'SUPERIOR',
        inteligenciaNormal: form.inteligencia === 'NORMAL_BRILLANTE',
        inteligenciaPromedio: form.inteligencia === 'PROMEDIO',
        inteligenciaTorpe: form.inteligencia === 'N_TORPE',
        inteligenciaFronterizo: form.inteligencia === 'FRONTERIZO',
        inteligenciaRMLeve: form.inteligencia === 'RM_LEVE',
        inteligenciaRMModerado: form.inteligencia === 'RM_MODERADO',
        inteligenciaRMSevero: form.inteligencia === 'RM_SEVERO',
        inteligenciaRMProfundo: form.inteligencia === 'RM_PROFUNDO',
        apetito: form.apetito,
        sueno: form.sueno,
        personalidad: form.personalidad,
        afectividad: form.afectividad,
        conductaSexual: form.conductaSexual,

        puntajeMips: form.mips ? "X" : "",
        puntajeMps: form.mps ? "X" : "",
        puntajeDna: form.luria ? "X" : "",
        puntajeEAE: form.eae ? "X" : "",
        puntajeInventarioBormout: form.maslach ? "X" : "",
        puntajeClimaLaboral: form.climaLaboral ? "X" : "",
        puntajeBacteriaConductores: form.conductores ? "X" : "",
        puntajeWais: form.wais ? "X" : "",
        puntajeBenton: form.benton ? "X" : "",
        puntajeBender: form.bender ? "X" : "",
        puntajeAnsiedadZung: form.zungAnsiedad ? "X" : "",
        puntajeDepresionZung: form.zungDepresion ? "X" : "",
        puntajeEscalaMemoriaWechsler: form.wechsler ? "X" : "",
        puntajeOtrasPruebas: form.otrasPruebas ? "X" : "",

        areaCognitiva: form.areaCognitiva,
        areaEmocional: form.areaEmocional,
        usuarioRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/FichaAnexo3/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/FichaAnexo3"
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
                    "Este paciente ya cuenta con registros de Ficha Psicológica 3.",
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
            area: res.areaO ?? "",
            puesto: res.cargo ?? "",
            nombreExamen: res.nomExam ?? "",
            cargoDesempenar: res.cargo ?? "",
            explotacionEn: res.explotacion ?? "",
            mineral:res.mineralExp ?? "",
            alturaLabor: res.alturaLabor ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            domicilioActual: res.direccion ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
            gradoInstruccion: res.nivelEstudios,
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};