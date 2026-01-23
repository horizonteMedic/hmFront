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
    "/api/v01/ct/psicologia/obtenerFichaPsicologiaAnexo02";
const registrarUrl =
    "/api/v01/ct/psicologia/registrarActualizarFichaPsicologiaAnexo02";

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
            fechaExamen: res.fechaExamen_fecha,
            esApto: res.apto_apto,
            nombres: res.nombresPaciente,
            apellidos: res.apellidosPaciente,
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente),
            lugarNacimiento: res.lugarNacimientoPaciente,
            domicilioActual: res.direccionPaciente,
            edad: res.edadPaciente,
            estadoCivil: res.estadoCivil,
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
    if (form.esApto === undefined || form.esApto === "") {
        Swal.fire({
            icon: "Error",
            title: "Datos Incompletos",
            text: "Por favor, marque la aptitud.",
        });
        return;
    }
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }
    const body = {
        norden: form.norden,
        fechaExamen: form.fechaExamen,
        motivoEvaluacion: form.motivoEvaluacion,
        presentacionAdecuado: form.presentacion == "ADECUADO", //revisar - mapear con form.presentacion
        presentacionInadecuado: form.presentacion == "INADECUADO", //revisar - mapear con form.presentacion
        posturaErguida: form.postura == "ERGUIDA", //revisar - mapear con form.postura
        posturaEncorvada: form.postura == "ENCORVADA", //revisar - mapear con form.postura
        ritmoLento: form.discursoRitmo == "LENTO", //revisar - mapear con form.discursoRitmo
        ritmoRapido: form.discursoRitmo == "RAPIDO", //revisar - mapear con form.discursoRitmo
        ritmoFluido: form.discursoRitmo == "FLUIDO", //revisar - mapear con form.discursoRitmo
        tonoBajo: form.discursoTono == "BAJO", //revisar - mapear con form.discursoTono
        tonoModerado: form.discursoTono == "MODERADO", //revisar - mapear con form.discursoTono
        tonoAlto: form.discursoTono == "ALTO", //revisar - mapear con form.discursoTono
        articulacionConDificultad: form.discursoArticulacion == "CON_DIFICULTAD", //revisar - mapear con form.discursoArticulacion
        articulacionSinDificultad: form.discursoArticulacion == "SIN_DIFICULTAD", //revisar - mapear con form.discursoArticulacion
        tiempoOrientado: form.orientacionTiempo == "ORIENTADO", //revisar - mapear con form.orientacionTiempo
        tiempoDesorientado: form.orientacionTiempo == "DESORIENTADO", //revisar - mapear con form.orientacionTiempo
        espacioOrientado: form.orientacionEspacio == "ORIENTADO", //revisar - mapear con form.orientacionEspacio
        espacioDesorientado: form.orientacionEspacio == "DESORIENTADO", //revisar - mapear con form.orientacionEspacio
        personaOrientado: form.orientacionPersona == "ORIENTADO", //revisar - mapear con form.orientacionPersona
        personaDesorientado: form.orientacionPersona == "DESORIENTADO", //revisar - mapear con form.orientacionPersona
        nivelIntelectual: form.nivelIntelectual,
        coordinacionVisomotriz: form.coordinacionVisomotriz,
        nivelMemoria: form.nivelMemoria,
        personalidad: form.personalidad,
        efectividad: form.afectividad,
        areaCognitiva: form.areaCognitiva,
        areaEmocional: form.areaEmocional,
        recomendaciones: form.recomendaciones,
        apto: form.esApto,
        usuarioRegistro: user,

        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/FichaAnexo2/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/FichaAnexo2"
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
                    "Este paciente ya cuenta con registros de Ficha Psicológica 2.",
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