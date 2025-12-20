import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRPerzonalizadoDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";

const obtenerReporteUrl =
    "/api/v01/ct/certificacionMedicinaAltura/obtenerReporteCertificacionMedicinaAltura";
const registrarUrl =
    "/api/v01/ct/certificacionMedicinaAltura/registrarActualizarCertificacionMedicinaAltura";

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
        let concatenacionObservacion = "";

        //Validación nombre examen para tipo examen
        const nombreExamen = res.tipoExamen ?? ""
        const examen = nombreExamen == "PRE-OCUPACIONAL" ? "PRIMERA ACTITUD" : nombreExamen == "ANUAL" ? "REVALIDACIÓN" : ""

        //validacion imc
        const imc = res.imc ?? "";
        if (imc) {
            const imcValue = parseFloat(imc);
            if (!isNaN(imcValue) && imcValue > 25) {
                if (imcValue >= 25 && imcValue < 30) {
                    concatenacionObservacion += "SOBREPESO: DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
                } else if (imcValue >= 30 && imcValue < 35) {
                    concatenacionObservacion += "OBESIDAD I: NO HACER TRABAJO 1.8 M.N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
                } else if (imcValue >= 35 && imcValue < 40) {
                    concatenacionObservacion += "OBESIDAD II: NO HACER TRABAJO 1.8 M.N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
                } else if (imcValue >= 40) {
                    concatenacionObservacion += "OBESIDAD III: NO HACER TRABAJOS EN ESPACIOS CONFINADOS. NO HACER TRABAJOS SOBRE 1.8 M.S.N PISO. DIETA HIPOCALORICA, HIPOGRASA Y EJERCICIOS.\n";
                }
            }
        }

        //Validacion HTA
        let presion_sistolica = parseFloat(res.sistolica);
        let presion_diastolica = parseFloat(res.diastolica);
        if (!isNaN(presion_sistolica) && !isNaN(presion_diastolica) &&
            (presion_sistolica >= 140 || presion_diastolica >= 90)) {
            concatenacionObservacion += "HTA NO CONTROLADA.\n";
        }

        //Validación Oftalmo uso lentes correctores y agudeza visual
        const vlejoscod = res.odlcOftalmologia_odlc || "";
        const vlejoscoi = res.oilcOftalmologia_oilc || "";

        const vcercacod = res.odccOfalmologia_odcc || "";
        const vcercacoi = res.oiccOfalmologia_oicc || "";
        const textoEnfermedadOftalmo = (res.enfermedadesOcularesOftalmologia_e_oculares ?? "").trim().toUpperCase();

        if (textoEnfermedadOftalmo && textoEnfermedadOftalmo !== "NINGUNA") {
            const enfermedadesRefractarias = ["AMETROPIA", "PRESBICIA", "HIPERMETROPIA", "OJO CIEGO", "CUENTA DEDOS", "PERCIBE LUZ"];
            if (enfermedadesRefractarias.some(e => textoEnfermedadOftalmo.includes(e))) {
                const visionLejosNormal = vlejoscod === "00" && vlejoscoi === "00";
                const visionCercaNormal = vcercacod === "00" && vcercacoi === "00";
                concatenacionObservacion += visionLejosNormal && visionCercaNormal
                    ? "CORREGIR AGUDEZA VISUAL.\n"
                    : "USO DE LENTES CORRECTORES.\n";
            }
        }

        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",

            codigoCertificadoAltura: null,
            aniosExperiencia: res.tiempoExperiencia ?? "",

            nombreExamen: res.tipoExamen ?? "",
            examen: examen,
            dni: res.dniPaciente ?? "",

            nombres: res.nombresPaciente ?? "",
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

            //oftalmo
            vcOD: res.visionCercaSinCorregiroOd_v_cerca_s_od ?? "",
            vlOD: res.visionLejosSinCorregiroOd_v_lejos_s_od ?? "",
            vcOI: res.visionCercaSinCorregiroOi_v_cerca_s_oi ?? "",
            vlOI: res.visionLejosSinCorregiroOi_v_lejos_s_oi ?? "",

            vcCorregidaOD: res.odccOfalmologia_odcc ?? "",
            vlCorregidaOD: res.odlcOftalmologia_odlc ?? "",
            vcCorregidaOI: res.oiccOfalmologia_oicc ?? "",
            vlCorregidaOI: res.oilcOftalmologia_oilc ?? "",

            vclrs: res.vcOftalmologia_vc ?? "",
            vb: res.vbOftalmologia_vb ?? "",
            rp: res.rpOftalmologia_rp ?? "",
            enfermedadesOculares: res.enfermedadesOcularesOftalmologia_e_oculares ?? "",

            //Altura
            alturaLabor: `${res.altura ?? ""} M.S.N.M`,
            alturaPara: res.cargoPaciente ?? "",

            frecuenciaCardiaca: res.frecuenciaCardiaca ?? "",
            frecuenciaRespiratoria: res.frecuenciaRespiratoria ?? "",
            saturacionO2: res.saturacionOxigeno ?? "",
            talla: res.talla ?? "",
            peso: res.peso ?? "",
            imc: res.imc ?? "",
            presionArterial: `${res.sistolica ?? ""}/${res.diastolica ?? ""}`,

            observacionesYRecomendaciones: concatenacionObservacion,
        }));
    }
};

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
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            fecha: res.fechaCertificacion,
            aniosExperiencia: res.tiempoExperiencia ?? "",
            examen: res.primeraActitud ? "PRIMERA ACTITUD" : res.revalidacion ? "REVALIDACIÓN" : "",

            codigoCertificadoAltura: res.codigoCertificadoAltura,

            nombreExamen: res.tipoExamen ?? "",
            dni: res.dniPaciente ?? "",

            nombres: res.nombresPaciente ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: res.lugarNacimientoPaciente ?? "",
            edad: res.edadPaciente ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            estadoCivil: res.estadoCivilPaciente,
            nivelEstudios: res.nivelEstudioPaciente,
            //Datos Laborales
            empresa: res.empresa,
            contrata: res.contrata,
            ocupacion: res.ocupacionPaciente,
            cargoDesempenar: res.cargoPaciente,

            //Antecedentes del Registro Médico
            miedoAlturas: res.tieneFobiaSi ? "SI" : "NO",
            epilepsiaa: res.epilepsiaSi ? "SI" : "NO",
            alcoholismo: res.alcoholismoSi ? "SI" : "NO",
            enfermedadPsiquiatrica: res.portadorPsiquiatricaSi ? "SI" : "NO",
            diabetesNoControlada: res.diabetesMellitusSi ? "SI" : "NO",
            migranaNoControlada: res.miagranaSi ? "SI" : "NO",

            insuficienciaCardiaca: res.insuficienciaCardiacaSi ? "SI" : "NO",
            asma: res.asmaBronquialSi ? "SI" : "NO",
            hipertensionNoControlada: res.hipertensionArterialSi ? "SI" : "NO",
            hipoacusia: res.hipoacusiaSeveraSi ? "SI" : "NO",
            alteracionVisual: res.alteracionAgudezaVisualSi ? "SI" : "NO",
            noAptoAltura: res.declaroNoAptoSi ? "SI" : "NO",

            comentarios: res.comentarios ?? "",

            //Antecedentes de la Entrevista con el Paciente
            resfriado: res.resfriadoSi ? "SI" : "NO",
            vertigoMareo: res.vertigoMareoSi ? "SI" : "NO",

            alcohol24h: res.consumioLicorSi ? "SI" : "NO",
            frecuenciaCefaleas: res.frecuenciaCefaleasSi ? "SI" : "NO",

            medicinasTomando: res.detalleMedicinas ?? "",

            //Examen Físico
            limitacionFuerzaMovilidad: res.limitacionFuerzaSi ? "SI" : "NO",
            alteracionEquilibrio: res.alteracionEquilibrioSi ? "SI" : "NO",
            anormalidadMarcha: res.anormalidadMarchaSi ? "SI" : "NO",
            anormalidadFuerzaMiembros: res.anormalidadFuerzaSi ? "SI" : "NO",
            lenguajeAnormal: res.lenguajeAnormalSi ? "SI" : "NO",
            alteracionCoordinacion: res.alteracionCoordinacionPresenteSi ? "SI" : "NO",
            nistagmus: res.presenciaNisfagmusSi ? "SI" : "NO",
            anormalidadMovOculares: res.anormalidadMovimientosOcularesSi ? "SI" : "NO",
            pupilasCIRLA: res.pupilasCirlaSi ? "SI" : "NO",
            asimetriaFacial: res.asimetriaFacialSi ? "SI" : "NO",
            hallazgoHombro: res.hallazgoAnormalHombroSi ? "SI" : "NO",
            hallazgoCodo: res.hallazgoAnormalCodoSi ? "SI" : "NO",
            hallazgoRodilla: res.hallazgoAnormalRodillaSi ? "SI" : "NO",
            hallazgoTobillo: res.hallazgoAnormalTobilloSi ? "SI" : "NO",
            otrosHallazgosMusculoEsqueleticos: res.anormalidadMovimientosOcularesSi ? "SI" : "NO",

            hallazgosAnormales: res.detalleinformacionactual ?? "",

            //Conclusión
            apto18: res.aptoTrabajar18metrosSi ? "SI" : "NO",
            usoPermanenteLentesCorrectores: res.usoLentesCorrectoresSi ? "SI" : "NO",
            usoPermanenteAudifonos: res.usoAudifonosSi ? "SI" : "NO",

            otraRestriccion: res.otraRestriccion ?? "",

            //oftalmo
            vcOD: res.visionCercaSinCorregiroOd_v_cerca_s_od ?? "",
            vlOD: res.visionLejosSinCorregiroOd_v_lejos_s_od ?? "",
            vcOI: res.visionCercaSinCorregiroOi_v_cerca_s_oi ?? "",
            vlOI: res.visionLejosSinCorregiroOi_v_lejos_s_oi ?? "",

            vcCorregidaOD: res.odccOfalmologia_odcc ?? "",
            vlCorregidaOD: res.odlcOftalmologia_odlc ?? "",
            vcCorregidaOI: res.oiccOfalmologia_oicc ?? "",
            vlCorregidaOI: res.oilcOftalmologia_oilc ?? "",

            vclrs: res.vcOftalmologia_vc ?? "",
            vb: res.vbOftalmologia_vb ?? "",
            rp: res.rpOftalmologia_rp ?? "",
            enfermedadesOculares: res.enfermedadesOcularesOftalmologia_e_oculares ?? "",

            //Altura
            alturaLabor: res.altura ?? "",
            alturaPara: res.cargoPaciente ?? "",

            frecuenciaCardiaca: res.frecuenciaCardiaca ?? "",
            frecuenciaRespiratoria: res.frecuenciaRespiratoria ?? "",
            saturacionO2: res.saturacionOxigeno ?? "",
            talla: res.talla ?? "",
            peso: res.peso ?? "",
            imc: res.imc ?? "",
            presionArterial: `${res.sistolica ?? ""}/${res.diastolica ?? ""}`,

            observacionesYRecomendaciones: res.observaciones ?? "",

            // Recomendaciones específicas
            sobrepesoObesidadHipocalorica: (res.observaciones ?? "").includes("SOBREPESO. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS."),
            corregirAgudezaVisual: (res.observaciones ?? "").includes("CORREGIR AGUDEZA VISUAL."),
            corregirAgudezaVisualTotal: (res.observaciones ?? "").includes("CORREGIR AGUDEZA VISUAL TOTAL."),
            obesidadDietaHipocalorica: (res.observaciones ?? "").includes("OBESIDAD I. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS."),
            usoLentesCorrectoresLecturaCerca: (res.observaciones ?? "").includes("USO DE LENTES CORRECTORES PARA LECTURA DE CERCA."),
            corregirAgudezaLecturaCerca: (res.observaciones ?? "").includes("CORREGIR AGUDEZA VISUAL PARA LECTURA DE CERCA."),

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
    const body = {
        norden: form.norden,
        codigoCertificadoAltura: form.codigoCertificadoAltura,
        fechaCertificacion: form.fecha,
        primeraActitud: form.examen == "PRIMERA ACTITUD",
        revalidacion: form.examen == "REVALIDACIÓN",

        tieneFobiaNo: form.miedoAlturas == "NO",
        epilepsiaNo: form.epilepsiaa == "NO",
        alcoholismoNo: form.alcoholismo == "NO",
        tieneFobiaSi: form.miedoAlturas == "SI",
        epilepsiaSi: form.epilepsiaa == "SI",
        alcoholismoSi: form.alcoholismo == "SI",
        portadorPsiquiatricaSi: form.enfermedadPsiquiatrica == "SI",
        diabetesMellitusSi: form.diabetesNoControlada == "SI",
        miagranaSi: form.migranaNoControlada == "SI",
        insuficienciaCardiacaSi: form.insuficienciaCardiaca == "SI",
        asmaBronquialSi: form.asma == "SI",
        hipertensionArterialSi: form.hipertensionNoControlada == "SI",
        hipoacusiaSeveraSi: form.hipoacusia == "SI",
        alteracionAgudezaVisualSi: form.alteracionVisual == "SI",
        declaroNoAptoSi: form.noAptoAltura == "SI",

        portadorPsiquiatricaNo: form.enfermedadPsiquiatrica == "NO",
        diabetesMellitusNo: form.diabetesNoControlada == "NO",
        miagranaNo: form.migranaNoControlada == "NO",
        insuficienciaCardiacaNo: form.insuficienciaCardiaca == "NO",
        asmaBronquialNo: form.asma == "NO",
        hipertensionArterialNo: form.hipertensionNoControlada == "NO",
        hipoacusiaSeveraNo: form.hipoacusia == "NO",
        alteracionAgudezaVisualNo: form.alteracionVisual == "NO",
        declaroNoAptoNo: form.noAptoAltura == "NO",

        resfriadoSi: form.resfriado == "SI",
        vertigoMareoSi: form.vertigoMareo == "SI",
        consumioLicorSi: form.alcohol24h == "SI",
        frecuenciaCefaleasSi: form.frecuenciaCefaleas == "SI",
        resfriadoNo: form.resfriado == "NO",
        vertigoMareoNo: form.vertigoMareo == "NO",
        consumioLicorNo: form.alcohol24h == "NO",
        frecuenciaCefaleasNo: form.frecuenciaCefaleas == "NO",

        limitacionFuerzaSi: form.limitacionFuerzaMovilidad == "SI",
        alteracionEquilibrioSi: form.alteracionEquilibrio == "SI",
        anormalidadMarchaSi: form.anormalidadMarcha == "SI",
        anormalidadFuerzaSi: form.anormalidadFuerzaMiembros == "SI",
        lenguajeAnormalSi: form.lenguajeAnormal == "SI",
        alteracionCoordinacionPresenteSi: form.alteracionCoordinacion == "SI",
        presenciaNisfagmusSi: form.nistagmus == "SI",
        anormalidadMovimientosOcularesSi: form.anormalidadMovOculares == "SI",
        pupilasCirlaSi: form.pupilasCIRLA == "SI",
        asimetriaFacialSi: form.asimetriaFacial == "SI",

        otrosHallazgosSi: form.otrosHallazgosMusculoEsqueleticos == "SI",
        hallazgoAnormalTobilloSi: form.hallazgoTobillo == "SI",
        hallazgoAnormalRodillaSi: form.hallazgoRodilla == "SI",
        hallazgoAnormalCodoSi: form.hallazgoCodo == "SI",
        hallazgoAnormalHombroSi: form.hallazgoHombro == "SI",

        limitacionFuerzaNo: form.limitacionFuerzaMovilidad == "NO",
        alteracionEquilibrioNo: form.alteracionEquilibrio == "NO",
        anormalidadMarchaNo: form.anormalidadMarcha == "NO",
        anormalidadFuerzaNo: form.anormalidadFuerzaMiembros == "NO",
        lenguajeAnormalNo: form.lenguajeAnormal == "NO",

        alteracionCoordinacionPresenteNo: form.alteracionCoordinacion == "NO",
        presenciaNisfagmusNo: form.nistagmus == "NO",
        anormalidadMovimientosOcularesNo: form.anormalidadMovOculares == "NO",
        pupilasCirlaNo: form.pupilasCIRLA == "NO",
        asimetriaFacialNo: form.asimetriaFacial == "NO",
        otrosHallazgosNo: form.otrosHallazgosMusculoEsqueleticos == "NO",
        hallazgoAnormalTobilloNo: form.hallazgoTobillo == "NO",
        hallazgoAnormalRodillaNo: form.hallazgoRodilla == "NO",
        hallazgoAnormalCodoNo: form.hallazgoCodo == "NO",
        hallazgoAnormalHombroNo: form.hallazgoHombro == "NO",

        aptoTrabajar18metrosSi: form.apto18 == "SI",
        usoLentesCorrectoresSi: form.usoPermanenteLentesCorrectores == "SI",
        usoAudifonosSi: form.usoPermanenteAudifonos == "SI",
        aptoTrabajar18metrosNo: form.apto18 == "NO",
        usoLentesCorrectoresNo: form.usoPermanenteLentesCorrectores == "NO",
        usoAudifonosNo: form.usoPermanenteAudifonos == "NO",

        comentarios: form.comentarios,
        detalleMedicinas: form.medicinasTomando,
        detalleinformacionactual: form.hallazgosAnormales,
        otraRestriccion: form.otraRestriccion,
        observaciones: form.observacionesYRecomendaciones,
        edad: "",
        dni: form.dniusuario,
        tiempoExperiencia: form.aniosExperiencia,

        usuarioRegistro: user,

        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
    GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/CertificadoAlturaPoderosa/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/CertificadoAlturaPoderosa"
    );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRPerzonalizadoDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => { Swal.close(); });
        },
        () => {
            //Tiene registro
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Altura 1.8",
                    "warning"
                );
            });
        },
        () => {
            //Necesita
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Triaje.",
                "warning"
            );
        }
    );
};
export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};