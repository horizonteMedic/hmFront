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
const obtenerReporteUrl = "/api/v01/ct/aversionRiesgo/obtenerReporteAversionRiesgo";
const registrarUrl = "/api/v01/ct/aversionRiesgo/registrarActualizar";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build.
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/PsicologiaAversionRiesgo/*.jsx");
const rutaReporte = "../../../../../../jaspers/ModuloPsicologia/PsicologiaAversionRiesgo/Informe_Aversión_Riesgo_Digitalizado.jsx";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
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
        norden: res.norden,
        fechaExam: res.fechaExamen,
        nombreExamen: res.tipoExamen ?? "",
        dni: res.dniPaciente ?? "",

        nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
        lugarNacimiento: res.lugarNacimiento ?? "",
        edad: res.edadPaciente ?? "",
        sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
        estadoCivil: res.estadoCivil ?? "",
        nivelEstudios: res.nivelEstudio ?? "",
        // Datos Laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.ocupacion ?? "",
        cargoDesempenar: res.cargoPaciente ?? "",

        practicaFuncional: res.aspIntelPractFuncBajo ? "BAJO" :
            res.aspIntelPractFuncMedio ? "MEDIO" :
                res.aspIntelPractFuncAlto ? "ALTO" : "",

        recursividad: res.aspIntelRecurBajo ? "BAJO" :
            res.aspIntelRecurMedio ? "MEDIO" :
                res.aspIntelRecurAlto ? "ALTO" : "",

        capacidadAtencion: res.aspIntelAtenciConcBajo ? "BAJO" :
            res.aspIntelAtenciConcMedio ? "MEDIO" :
                res.aspIntelAtenciConcAlto ? "ALTO" : "",

        estabilidadEmocional: res.aspEmocEstabilEmocMadBajo ? "BAJO" :
            res.aspEmocEstabilEmocMadMedio ? "MEDIO" :
                res.aspEmocEstabilEmocMadAlto ? "ALTO" : "",

        flexibilidadEmociones: res.aspFlexibManjEmocBajo ? "BAJO" :
            res.aspFlexibManjEmocMedio ? "MEDIO" :
                res.aspFlexibManjEmocAlto ? "ALTO" : "",

        controlImpulsos: res.aspCtrlImpulBajo ? "BAJO" :
            res.aspCtrlImpulMedio ? "MEDIO" :
                res.aspCtrlImpulAlto ? "ALTO" : "",

        subordinacion: res.compEspecfCapSuborBajo ? "BAJO" :
            res.compEspecfCapSuborMedio ? "MEDIO" :
                res.compEspecfCapSuborAlto ? "ALTO" : "",

        adecuacionNormas: res.compEspecfAdecNorProcedBajo ? "BAJO" :
            res.compEspecfAdecNorProcedMedio ? "MEDIO" :
                res.compEspecfAdecNorProcedAlto ? "ALTO" : "",

        consideracionTerceros: res.compEspecfConsideraTercerosBajo ? "BAJO" :
            res.compEspecfConsideraTercerosMedio ? "MEDIO" :
                res.compEspecfConsideraTercerosAlto ? "ALTO" : "",

        autonomiaTrabajo: res.compEspecfAutonomiaTrabajarBajo ? "BAJO" :
            res.compEspecfAutonomiaTrabajarMedio ? "MEDIO" :
                res.compEspecfAutonomiaTrabajarAlto ? "ALTO" : "",

        proactividad: res.compEspecfProactividadBajo ? "BAJO" :
            res.compEspecfProactividadMedio ? "MEDIO" :
                res.compEspecfProactividadAlto ? "ALTO" : "",

        capacidadPresion: res.compEspecfCapTrabjoBajoPresionBajo ? "BAJO" :
            res.compEspecfCapTrabjoBajoPresionMedio ? "MEDIO" :
                res.compEspecfCapTrabjoBajoPresionAlto ? "ALTO" : "",

        evaluacionRiesgos: res.compEspecfCapEvaluarRiesgosBajo ? "BAJO" :
            res.compEspecfCapEvaluarRiesgosMedio ? "MEDIO" :
                res.compEspecfCapEvaluarRiesgosAlto ? "ALTO" : "",

        motivacionCargo: res.compEspecfMotPorCarBajo ? "BAJO" :
            res.compEspecfMotPorCarMedio ? "MEDIO" :
                res.compEspecfMotPorCarAlto ? "ALTO" : "",

        analisisResultados: res.analisisResultados ?? "",
        recomendaciones: res.recomendaciones ?? "",

        conclusion: res.conclusionesCumple,

        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

        // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
        fechaRegistro: res.fechaRegistro ?? "",
        userRegistro: res.userRegistro ?? "",
        fechaActualizacion: res.fechaActualizacion ?? "",
        usuarioActualizacion: res.usuarioActualizacion ?? "",
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body base =====
// El backend de este examen espera la clave "numeroOrden" (no "norden") para identificar el registro.
const construirBase = (form) => ({
    numeroOrden: form.norden,
    fechaExamen: form.fechaExam,

    aspectoIntelectualPracticoFuncionalBajo: form.practicaFuncional === "BAJO",
    aspectoIntelectualPracticoFuncionalMedio: form.practicaFuncional === "MEDIO",
    aspectoIntelectualPracticoFuncionalAlto: form.practicaFuncional === "ALTO",

    aspectoIntelectualRecursosBajo: form.recursividad === "BAJO",
    aspectoIntelectualRecursosMedio: form.recursividad === "MEDIO",
    aspectoIntelectualRecursosAlto: form.recursividad === "ALTO",

    aspectoIntelectualAtencionConcentracionBajo: form.capacidadAtencion === "BAJO",
    aspectoIntelectualAtencionConcentracionMedio: form.capacidadAtencion === "MEDIO",
    aspectoIntelectualAtencionConcentracionAlto: form.capacidadAtencion === "ALTO",

    aspectoEmocionalEstabilidadMadurezBajo: form.estabilidadEmocional === "BAJO",
    aspectoEmocionalEstabilidadMadurezMedio: form.estabilidadEmocional === "MEDIO",
    aspectoEmocionalEstabilidadMadurezAlto: form.estabilidadEmocional === "ALTO",

    aspectoFlexibilidadManejoEmocionalBajo: form.flexibilidadEmociones === "BAJO",
    aspectoFlexibilidadManejoEmocionalMedio: form.flexibilidadEmociones === "MEDIO",
    aspectoFlexibilidadManejoEmocionalAlto: form.flexibilidadEmociones === "ALTO",

    aspectoControlImpulsosBajo: form.controlImpulsos === "BAJO",
    aspectoControlImpulsosMedio: form.controlImpulsos === "MEDIO",
    aspectoControlImpulsosAlto: form.controlImpulsos === "ALTO",

    competenciaCapacidadSubordinacionBajo: form.subordinacion === "BAJO",
    competenciaCapacidadSubordinacionMedio: form.subordinacion === "MEDIO",
    competenciaCapacidadSubordinacionAlto: form.subordinacion === "ALTO",

    competenciaAdecuacionNormasProcedimientosBajo: form.adecuacionNormas === "BAJO",
    competenciaAdecuacionNormasProcedimientosMedio: form.adecuacionNormas === "MEDIO",
    competenciaAdecuacionNormasProcedimientosAlto: form.adecuacionNormas === "ALTO",

    competenciaConsideracionTercerosBajo: form.consideracionTerceros === "BAJO",
    competenciaConsideracionTercerosMedio: form.consideracionTerceros === "MEDIO",
    competenciaConsideracionTercerosAlto: form.consideracionTerceros === "ALTO",

    competenciaAutonomiaTrabajoBajo: form.autonomiaTrabajo === "BAJO",
    competenciaAutonomiaTrabajoMedio: form.autonomiaTrabajo === "MEDIO",
    competenciaAutonomiaTrabajoAlto: form.autonomiaTrabajo === "ALTO",

    competenciaProactividadBajo: form.proactividad === "BAJO",
    competenciaProactividadMedio: form.proactividad === "MEDIO",
    competenciaProactividadAlto: form.proactividad === "ALTO",

    competenciaCapacidadTrabajoBajoPresionBajo: form.capacidadPresion === "BAJO",
    competenciaCapacidadTrabajoBajoPresionMedio: form.capacidadPresion === "MEDIO",
    competenciaCapacidadTrabajoBajoPresionAlto: form.capacidadPresion === "ALTO",

    competenciaCapacidadEvaluarRiesgosBajo: form.evaluacionRiesgos === "BAJO",
    competenciaCapacidadEvaluarRiesgosMedio: form.evaluacionRiesgos === "MEDIO",
    competenciaCapacidadEvaluarRiesgosAlto: form.evaluacionRiesgos === "ALTO",

    competenciaMotivacionPorCargoBajo: form.motivacionCargo === "BAJO",
    competenciaMotivacionPorCargoMedio: form.motivacionCargo === "MEDIO",
    competenciaMotivacionPorCargoAlto: form.motivacionCargo === "ALTO",

    analisisResultados: form.analisisResultados,
    recomendaciones: form.recomendaciones,
    conclusionesCumple: form.conclusion,
    conclusionesNoCumple: !form.conclusion,

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
    if (form.conclusion === undefined || form.conclusion === null) {
        Swal.fire("Error", "Debe seleccionar el cumplimiento del perfil", "error");
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
                Swal.fire({
                    icon: "warning",
                    title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                    html: "Este paciente ya cuenta con registros de Aversión al Riesgo.",
                });
            }),
    });

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
