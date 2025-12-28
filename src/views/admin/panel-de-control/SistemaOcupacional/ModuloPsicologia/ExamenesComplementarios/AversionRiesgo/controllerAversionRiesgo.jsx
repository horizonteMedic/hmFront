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

// Reutilizamos los endpoints generales de Informe Psicológico
const obtenerReporteUrl =
    "/api/v01/ct/aversionRiesgo/obtenerReporteAversionRiesgo";
const registrarUrl =
    "/api/v01/ct/aversionRiesgo/registrarActualizar";

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
            fechaExam: res.fechaRegistro,
            nombreExamen: res.tipoExamen ?? "",
            dni: res.dniPaciente ?? "",

            nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: res.lugarNacimientoPaciente ?? "",
            edad: res.edadPaciente ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            estadoCivil: res.estadoCivilPaciente ?? "",
            nivelEstudios: res.nivelEstudioPaciente ?? "",
            // Datos Laborales
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            ocupacion: res.ocupacionPaciente ?? "",
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
    if (form.conclusion === undefined || form.conclusion === null) {
        await Swal.fire("Error", "Debe seleccionar el cumplimiento del perfil", "error");
        return;
    }
    const body = {
        numeroOrden: form.norden,
        fechaRegistro: form.fechaExam,

        aspectoIntelectualPracticoFuncionalBajo: form.practicaFuncional == "BAJO",
        aspectoIntelectualPracticoFuncionalMedio: form.practicaFuncional == "MEDIO",
        aspectoIntelectualPracticoFuncionalAlto: form.practicaFuncional == "ALTO",

        aspectoIntelectualRecursosBajo: form.recursividad == "BAJO",
        aspectoIntelectualRecursosMedio: form.recursividad == "MEDIO",
        aspectoIntelectualRecursosAlto: form.recursividad == "ALTO",

        aspectoIntelectualAtencionConcentracionBajo: form.capacidadAtencion == "BAJO",
        aspectoIntelectualAtencionConcentracionMedio: form.capacidadAtencion == "MEDIO",
        aspectoIntelectualAtencionConcentracionAlto: form.capacidadAtencion == "ALTO",

        aspectoEmocionalEstabilidadMadurezBajo: form.estabilidadEmocional == "BAJO",
        aspectoEmocionalEstabilidadMadurezMedio: form.estabilidadEmocional == "MEDIO",
        aspectoEmocionalEstabilidadMadurezAlto: form.estabilidadEmocional == "ALTO",

        aspectoFlexibilidadManejoEmocionalBajo: form.flexibilidadEmociones == "BAJO",
        aspectoFlexibilidadManejoEmocionalMedio: form.flexibilidadEmociones == "MEDIO",
        aspectoFlexibilidadManejoEmocionalAlto: form.flexibilidadEmociones == "ALTO",

        aspectoControlImpulsosBajo: form.controlImpulsos == "BAJO",
        aspectoControlImpulsosMedio: form.controlImpulsos == "MEDIO",
        aspectoControlImpulsosAlto: form.controlImpulsos == "ALTO",

        competenciaCapacidadSubordinacionBajo: form.subordinacion == "BAJO",
        competenciaCapacidadSubordinacionMedio: form.subordinacion == "MEDIO",
        competenciaCapacidadSubordinacionAlto: form.subordinacion == "ALTO",

        competenciaAdecuacionNormasProcedimientosBajo: form.adecuacionNormas == "BAJO",
        competenciaAdecuacionNormasProcedimientosMedio: form.adecuacionNormas == "MEDIO",
        competenciaAdecuacionNormasProcedimientosAlto: form.adecuacionNormas == "ALTO",

        competenciaConsideracionTercerosBajo: form.consideracionTerceros == "BAJO",
        competenciaConsideracionTercerosMedio: form.consideracionTerceros == "MEDIO",
        competenciaConsideracionTercerosAlto: form.consideracionTerceros == "ALTO",

        competenciaAutonomiaTrabajoBajo: form.autonomiaTrabajo == "BAJO",
        competenciaAutonomiaTrabajoMedio: form.autonomiaTrabajo == "MEDIO",
        competenciaAutonomiaTrabajoAlto: form.autonomiaTrabajo == "ALTO",

        competenciaProactividadBajo: form.proactividad == "BAJO",
        competenciaProactividadMedio: form.proactividad == "MEDIO",
        competenciaProactividadAlto: form.proactividad == "ALTO",

        competenciaCapacidadTrabajoBajoPresionBajo: form.capacidadPresion == "BAJO",
        competenciaCapacidadTrabajoBajoPresionMedio: form.capacidadPresion == "MEDIO",
        competenciaCapacidadTrabajoBajoPresionAlto: form.capacidadPresion == "ALTO",

        competenciaCapacidadEvaluarRiesgosBajo: form.evaluacionRiesgos == "BAJO",
        competenciaCapacidadEvaluarRiesgosMedio: form.evaluacionRiesgos == "MEDIO",
        competenciaCapacidadEvaluarRiesgosAlto: form.evaluacionRiesgos == "ALTO",

        competenciaMotivacionPorCargoBajo: form.motivacionCargo == "BAJO",
        competenciaMotivacionPorCargoMedio: form.motivacionCargo == "MEDIO",
        competenciaMotivacionPorCargoAlto: form.motivacionCargo == "ALTO",

        analisisResultados: form.analisisResultados,
        recomendaciones: form.recomendaciones,
        conclusionesCumple: form.conclusion,
        conclusionesNoCumple: !form.conclusion,

        usuarioRegistro: user,

        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/PsicologiaAversionRiesgo/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/PsicologiaAversionRiesgo"
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
                    "Este paciente ya cuenta con registros de Informe Psicológico para Altura.",
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