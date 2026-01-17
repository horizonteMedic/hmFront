import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    handleSubirArchivoDefault,
    handleSubirArchivoDefaultSinSellos,
    LoadingDefault,
    PrintHojaRDefault,
    ReadArchivosFormDefault,
    SubmitDataServiceDefault,
} from "../../../../utils/functionUtils";
import { getFetch } from "../../../../utils/apiHelpers";

const obtenerReporteUrl =
    "/api/v01/ct/certificadoConduccion/obtenerReporteCertificadoConduccion";
const registrarUrl =
    "/api/v01/ct/certificadoConduccion/registrarActualizarCertificadoConduccion";
const registrarPDF =
    "/api/v01/ct/archivos/archivoInterconsulta"


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
        const imc = res.imcTriaje ?? "";
        let imcRed = false;
        let nuevasObservaciones = (res.diagnosticoAudiometria ?? "").toUpperCase();
        if (nuevasObservaciones != "") {
            nuevasObservaciones = "Dx Audiometría: " + nuevasObservaciones + "\n";
        }
        if (imc) {
            const imcValue = parseFloat(imc);
            if (!isNaN(imcValue) && imcValue > 25) {
                imcRed = true;
                if (imcValue >= 25 && imcValue < 30) {
                    nuevasObservaciones += "SOBREPESO: DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
                } else if (imcValue >= 30 && imcValue < 35) {
                    nuevasObservaciones += "OBESIDAD I: NO HACER TRABAJO 1.8 M.N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
                } else if (imcValue >= 35 && imcValue < 40) {
                    nuevasObservaciones += "OBESIDAD II: NO HACER TRABAJO 1.8 M.N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
                } else if (imcValue >= 40) {
                    nuevasObservaciones += "OBESIDAD III: NO HACER TRABAJOS EN ESPACIOS CONFINADOS. NO HACER TRABAJOS SOBRE 1.8 M.S.N PISO. DIETA HIPOCALORICA, HIPOGRASA Y EJERCICIOS.\n";
                }
            }
        }


        const promedioOidoDerecho = res.promedioOidoDerecho ?? 0;
        const promedioOidoIzquierdo = res.promedioOidoIzquierdo ?? 0;
        let oidoMayor40 = false;
        if (promedioOidoDerecho > 40 || promedioOidoIzquierdo > 40) {
            oidoMayor40 = true;
        }


        let debeCorregirAgudezaVisual = false;
        let debeUsarLentesCorrectores = false;
        const vlejoscod = res.odlcoftalmologia_odlc || "";
        const vlejoscoi = res.oilcoftalmologia_oilc || "";

        const vcercacod = res.oftalodccmologia_odcc || "";
        const vcercacoi = res.oiccoftalmologia_oicc || "";
        const textoEnfermedadOftalmo = (res.enfermedadesocularesoftalmo_e_oculares ?? "").trim().toUpperCase();

        if (textoEnfermedadOftalmo && textoEnfermedadOftalmo !== "NINGUNA") {
            const enfermedadesRefractarias = ["AMETROPIA", "PRESBICIA", "HIPERMETROPIA", "OJO CIEGO", "CUENTA DEDOS", "PERCIBE LUZ"];
            if (enfermedadesRefractarias.some(e => textoEnfermedadOftalmo.includes(e))) {
                const visionLejosNormal = vlejoscod === "00" && vlejoscoi === "00";
                const visionCercaNormal = vcercacod === "00" && vcercacoi === "00";

                debeCorregirAgudezaVisual = visionLejosNormal && visionCercaNormal;
                debeUsarLentesCorrectores = !debeCorregirAgudezaVisual;

                nuevasObservaciones += debeCorregirAgudezaVisual
                    ? "CORREGIR AGUDEZA VISUAL.\n"
                    : "USO DE LENTES CORRECTORES.\n";
            }
        }


        let anemia = false;
        const hemoglobina = parseFloat(res.laboratorioClinicoHemoglobina);

        if (!isNaN(hemoglobina)) {
            const umbral = res.sexoPaciente === "M" ? 13 : 12;
            anemia = hemoglobina < umbral;
        }


        //Validacion cuello
        const sexo = res.sexoPaciente ?? "";
        const textoCuello = "AL EX FISICO: CUELLO ANORMAL. PROBABLE APNEA OBSTRUCTIVA DE SUEÑO. APTO POR 3 MESES. PARA CONDUCIR. EVALUACION POR NEUROLOGIA. REQUIERE PSG Y/U OXIMETRIA DE PULSO Y/O CERTIFICACION DE CUMPLIMIENTO DE TRATAMIENTO DE APNEA DEL SUEÑO ANTES DE DAR APTITUD DE 12 MESES."
        if (res.perimetroCuelloTriaje) {
            let cuello = parseFloat(res.perimetroCuelloTriaje);
            if (!isNaN(cuello)) {
                if (sexo == "M" && cuello >= 43.2) {
                    nuevasObservaciones += textoCuello + "\n"
                }
                else if (sexo == "F" && cuello >= 40.6) {
                    nuevasObservaciones += textoCuello + "\n"
                }
            }
        }

        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            codigoCertificado_cod_certificado: null,
            tipoExamen: res.nombreExamen ?? "",
            nombres: res.nombresPaciente ?? "",
            dni: res.dniPaciente ?? "",
            edad: res.edadPaciente ?? "",
            sexo: res.sexoPaciente ?? "",

            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            puestoPostula: res.cargoPaciente ?? "",
            puestoActual: res.ocupacionPaciente ?? "",
            //=====================TAB LATERAL=====================
            // Agudeza Visual
            vcOD: res.visioncercasincorregirod_v_cerca_s_od ?? "",
            vlOD: res.visionlejossincorregirod_v_lejos_s_od ?? "",
            vcOI: res.visioncercasincorregiroi_v_cerca_s_oi ?? "",
            vlOI: res.visionlejossincorregiroi_v_lejos_s_oi ?? "",

            vcCorregidaOD: res.oftalodccmologia_odcc ?? "",
            vlCorregidaOD: res.odlcoftalmologia_odlc ?? "",
            vcCorregidaOI: res.oiccoftalmologia_oicc ?? "",
            vlCorregidaOI: res.oilcoftalmologia_oilc ?? "",

            hipoacusiaFrecuenciasConversacionales: oidoMayor40,
            conclusion: oidoMayor40 ? "NO APTO" :
                debeUsarLentesCorrectores ? "APTO CON RESTRICCION" : null,
            anemiaCriteriosOMS2011: anemia,

            vclrs: res.vcoftalmologia_vc ?? "",
            vb: res.vboftalmologia_vb ?? "",
            rp: res.rpoftalmologia_rp ?? "",
            enfermedadesOculares: res.enfermedadesocularesoftalmo_e_oculares ?? "",
            //=====================TAB EXAMEN MEDICO=====================
            frecuenciaCardiaca: res.frecuenciaCardiaca ?? "",
            frecuenciaRespiratoria: res.frecuenciaRespiratoriaTriaje_f_respiratoria ?? "",
            presionArterial: `${res.sistolica ?? ""}/${res.diastolica ?? ""}`,
            talla: res.tallaTriaje ?? "",
            peso: res.pesoTriaje ?? "",
            imc: res.imcTriaje ?? "",
            perimetroCuello: res.perimetroCuelloTriaje ?? "",
            perimetroCintura: res.cinturaTriaje ?? "",
            perimetroCadera: res.caderaTriaje ?? "",
            icc: res.iccTriaje ?? "",
            perimetroToracicoInspiracion: res.maximaInspiracionPtoracico_p_max_inspiracion ?? "",
            perimetroToracicoEspiracion: res.forazadaPtoracico_p_ex_forzada ?? "",
            observacionesRecomendaciones: nuevasObservaciones,
            imcRed: imcRed,

            medicinasTomando: res.medicamentosAnexo16A ?? "",

            obesidadIMC30: parseFloat(res.imcTriaje) >= 30,

            SubirDoc: true,
            digitalizacion: res.digitalizacion
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
        onFinish,
        true
    );
    if (res) {
        let debeCorregirAgudezaVisual = false;
        let debeUsarLentesCorrectores = false;
        const vlejoscod = res.odlcoftalmologia_odlc || "";
        const vlejoscoi = res.oilcoftalmologia_oilc || "";

        const vcercacod = res.oftalodccmologia_odcc || "";
        const vcercacoi = res.oiccoftalmologia_oicc || "";
        const textoEnfermedadOftalmo = (res.enfermedadesocularesoftalmo_e_oculares ?? "").trim().toUpperCase();

        if (textoEnfermedadOftalmo && textoEnfermedadOftalmo !== "NINGUNA") {
            const enfermedadesRefractarias = ["AMETROPIA", "PRESBICIA", "HIPERMETROPIA", "OJO CIEGO", "CUENTA DEDOS", "PERCIBE LUZ"];
            if (enfermedadesRefractarias.some(e => textoEnfermedadOftalmo.includes(e))) {
                const visionLejosNormal = vlejoscod === "00" && vlejoscoi === "00";
                const visionCercaNormal = vcercacod === "00" && vcercacoi === "00";

                debeCorregirAgudezaVisual = visionLejosNormal && visionCercaNormal;
                debeUsarLentesCorrectores = !debeCorregirAgudezaVisual;

                // nuevasObservaciones += debeCorregirAgudezaVisual
                //     ? "CORREGIR AGUDEZA VISUAL.\n"
                //     : "USO DE LENTES CORRECTORES.\n";
            }
        }


        const promedioOidoDerecho = res.promedioOidoDerecho ?? 0;
        const promedioOidoIzquierdo = res.promedioOidoIzquierdo ?? 0;
        let oidoMayor40 = false;
        if (promedioOidoDerecho > 40 || promedioOidoIzquierdo > 40) {
            oidoMayor40 = true;
        }


        const imc = res.imcTriaje ?? "";
        let imcRed = false;
        if (imc) {
            const imcValue = parseFloat(imc);
            if (!isNaN(imcValue) && imcValue > 25) {
                imcRed = true;
            }
        }
        set((prev) => ({
            ...prev,
            // Header
            norden: res.norden ?? "",
            codigoCertificado_cod_certificado: res.codigoCertificado_cod_certificado ?? null,
            fechaExam: res.fechaExamen_f_examen ?? "",
            tipoExamen: res.nombreExamen ?? "",
            razonVisita: res.primeraAptitud_chk_primera ? "PRIMERA ACTITUD" : (res.revalidacion_chk_revalidacion ? "REVALIDACION" : ""),
            nombres: res.nombresPaciente ?? "",
            dni: res.dniPaciente ?? "",
            edad: res.edadPaciente ?? "",
            sexo: res.sexoPaciente ?? "",
            experienciaAnios: res.tiempoExperiencia_t_experiencia ?? "",

            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            puestoPostula: res.cargoPaciente ?? "",
            puestoActual: res.ocupacionPaciente ?? "",
            //=====================TAB LATERAL=====================
            // Agudeza Visual
            vcOD: res.visioncercasincorregirod_v_cerca_s_od ?? "",
            vlOD: res.visionlejossincorregirod_v_lejos_s_od ?? "",
            vcOI: res.visioncercasincorregiroi_v_cerca_s_oi ?? "",
            vlOI: res.visionlejossincorregiroi_v_lejos_s_oi ?? "",

            vcCorregidaOD: res.oftalodccmologia_odcc ?? "",
            vlCorregidaOD: res.odlcoftalmologia_odlc ?? "",
            vcCorregidaOI: res.oiccoftalmologia_oicc ?? "",
            vlCorregidaOI: res.oilcoftalmologia_oilc ?? "",

            vclrs: res.vcoftalmologia_vc ?? "",
            vb: res.vboftalmologia_vb ?? "",
            rp: res.rpoftalmologia_rp ?? "",
            enfermedadesOculares: res.enfermedadesocularesoftalmo_e_oculares ?? "",
            //=====================TAB EXAMEN MEDICO=====================
            frecuenciaCardiaca: res.frecuenciaCardiaca ?? "",
            frecuenciaRespiratoria: res.frecuenciaRespiratoriaTriaje_f_respiratoria ?? "",
            presionArterial: `${res.sistolica ?? ""}/${res.diastolica ?? ""}`,
            talla: res.tallaTriaje ?? "",
            peso: res.pesoTriaje ?? "",
            imc: res.imcTriaje ?? "",
            imcRed: imcRed,
            perimetroCuello: res.perimetroCuelloTriaje ?? "",
            perimetroCintura: res.cinturaTriaje ?? "",
            perimetroCadera: res.caderaTriaje ?? "",
            icc: res.iccTriaje ?? "",
            perimetroToracicoInspiracion: res.maximaInspiracionPtoracico_p_max_inspiracion ?? "",
            perimetroToracicoEspiracion: res.forazadaPtoracico_p_ex_forzada ?? "",
            // Examen Médico - Hallazgos del Examen Físico
            limitacionFuerzaExtremidades: res.examenFisicoLimitacionSi_chk_21_si ?? false,
            alteracionEquilibrioRomberg: res.examenFisicoAleracionPresenteSi_chk_22_si ?? false,
            anormalidadMarchaOjosCerrados: res.examenFisicoAnormalidadMarchaSi_chk_23_si ?? false,
            alteracionCoordinacionDedoNariz: res.examenFisicoAlteracionCoordinacionSi_chk_24_si ?? false,
            asimetriaFacial: res.examenFisicoAsimetriaFacialSi_chk_30_si ?? false,
            sustentacionUnPie: res.examenFisicoSustentacionPie_sustentacionpie ?? false,
            presenciaNistagmus: res.examenFisicoNistagmusSi_chk_25_si ?? false,
            anormalidadMovimientosOculares: res.examenFisicoAnormalidadMovimientoSi_chk_26_si ?? false,
            pupilasNoCirla: res.examenFisicoCirlaSi_chk_27_si ?? false,
            anormalidadLenguaje: res.examenFisicoAnormalidadLenguajeSi_chk_28_si ?? false,
            movimientosInvoluntarios: res.examenFisicoMovimientoInvoluntarioSi_chk_29_si ?? false,
            // Examen Médico - Información Adicional
            detalleInformacionExamenMedico: res.detalleInformacion_d_informacion ?? "",

            //=====================TAB ANTECEDENTES=====================
            alteracionConsciencia: res.antecedentesTodasEnfermedadesSi_chk_1_si ?? false,
            alcoholismoCronico: res.antecedentesAlcoholismoCronicoSi_chk_2_si ?? false,
            movimientosInvoluntariosEnfermedades: res.antecedentesEnfermedadesInvoluntariosSi_chk_3_si ?? false,
            perdidaRecurrenteConsciencia: res.antecedentesPerdidaConcienciaSi_chk_4_si ?? false,
            diabetesHipoglicemiaNoControlada: res.antecedentesDiabetesMellitus_diabete_mellitus ?? false,
            insuficienciaRenalCronicaGradoIV: res.antecedentesInsuficienciaRenal_insuficiencia_renalIV ?? false,
            // Antecedentes - Columna Derecha
            efectosEnfermedadTratamiento: res.antecedentesVariosEfectosSi_chk_7_si ?? false,
            sustanciasEstupefacientesSinTratamiento: res.antecedentesConsumeSustanciasNoAltereSi_chk_8_si ?? false,
            sustanciasEstupefacientesConAlteracion: res.antecedentesConsumeSustanciasSiAltereSi_chk_9_si ?? false,
            sindromeApneaObstructivaSueño: res.antecedentesApneaSi_chk_10_si ?? false,
            obesidadIMC30: res.antecedentesObesidadSi_chk_11_si ?? false,
            anemiaCriteriosOMS2011: res.antecedentesAnemiaGradoSi_chk_5_si ?? false,
            comentariosDetalleAntecedentes: res.antecedentesComentariosDetalles_comenDetalleAntecedentes ?? "",

            //=====================TAB PRUEBAS COMPLEMENTARIAS=====================
            // Pruebas Complementarias
            hipoacusiaFrecuenciasConversacionales: res.pcomplementariasHipoacusiaSi_chk_13_si ?? false,
            alteracionAgudezaVisual: res.pcomplementariasAlteracionAgudezaVisualSi_chk_14_si ?? false,
            noReconocimientoColores: res.pcomplementariasNoColorSi_chk_17_si ?? false,
            campimetriaAnormal: res.pcomplementariasAmpliometriaAnormalSi_chk_15_si ?? false,
            pruebaVisionProfundidadAlterada: res.pcomplementariasPruebaVisionSi_chk_18_si ?? false,
            testSASAnormal: res.pcomplementariasTestSas_testSAS ?? false,
            evaluacionPsicosensometricaAlterada: res.pcomplementariasPsicosensometricaAlteradaSi_chk_19_si ?? false,
            // Otros Datos de Relevancia
            medicinasTomando: res.detalleMedicinas_d_medicina ?? "",
            otrosDatosRelevancia: res.otrosDescripcion_txtotros ?? "",

            //PARTE INFERIOR
            // Conclusión y Comentarios
            aptoDesde: res.fechaDesde_f_desde ?? "",
            aptoHasta: res.fechaHasta_f_hasta ?? "",
            conclusion: oidoMayor40 ? "NO APTO" :
                debeUsarLentesCorrectores ? "APTO CON RESTRICCION" :
                    res.apto_chk_si ? "APTO" :
                        (res.noApto_chk_no ? "NO APTO" :
                            (res.observado_chk_observado ? "OBSERVADO" :
                                (res.aptoConRestriccion_chk_apto_r ? "APTO CON RESTRICCION" : null))),
            observacionesRecomendaciones: res.observacionesRecomendaciones_b_c_observaciones ?? "",
            // nombreMedicoColegiatura:"",
            // Recomendaciones - 
            sobrepesoDietaHipocalorica: (res.observacionesRecomendaciones_b_c_observaciones ?? "").includes("SOBREPESO. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS."),
            corregirAgudezaVisual: (res.observacionesRecomendaciones_b_c_observaciones ?? "").includes("CORREGIR AGUDEZA VISUAL."),
            corregirAgudezaVisualTotal: (res.observacionesRecomendaciones_b_c_observaciones ?? "").includes("CORREGIR AGUDEZA VISUAL TOTAL."),
            obesidadDietaHipocalorica: (res.observacionesRecomendaciones_b_c_observaciones ?? "").includes("OBESIDAD I. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS."),
            usoLentesCorrectoresLectura: (res.observacionesRecomendaciones_b_c_observaciones ?? "").includes("USO DE LENTES CORRECTORES PARA LECTURA DE CERCA."),
            corregirAgudezaLectura: (res.observacionesRecomendaciones_b_c_observaciones ?? "").includes("CORREGIR AGUDEZA VISUAL PARA LECTURA DE CERCA."),
            user_medicoFirma: res.usuarioFirma,

            SubirDoc: true,
            digitalizacion: res.digitalizacion
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
        codigoCertificado: form.codigoCertificado_cod_certificado,
        dniPaciente: form.dni,
        tiempoExperiencia: form.experienciaAnios,
        edad: form.edad,
        primeraAptitud: form.razonVisita === "PRIMERA ACTITUD",
        revalidacion: form.razonVisita === "REVALIDACION",
        fechaExamen: form.fechaExam,
        antecedentesTodasEnfermedadesSi: form.alteracionConsciencia,
        antecedentesTodasEnfermedadesNo: !form.alteracionConsciencia,
        antecedentesAlcoholismoCronicoSi: form.alcoholismoCronico,
        antecedentesAlcoholismoCronicoNo: !form.alcoholismoCronico,
        antecedentesEnfermedadesInvoluntariosSi: form.movimientosInvoluntariosEnfermedades,
        antecedentesEnfermedadesInvoluntariosNo: !form.movimientosInvoluntariosEnfermedades,
        antecedentesPerdidaConcienciaSi: form.perdidaRecurrenteConsciencia,
        antecedentesPerdidaConcienciaNo: !form.perdidaRecurrenteConsciencia,
        antecedentesAnemiaGradoSi: form.anemiaCriteriosOMS2011,
        antecedentesAnemiaGradoNo: !form.anemiaCriteriosOMS2011,
        antecedentesVariosEfectosSi: form.efectosEnfermedadTratamiento,
        antecedentesVariosEfectosNo: !form.efectosEnfermedadTratamiento,
        antecedentesConsumeSustanciasNoAltereSi: form.sustanciasEstupefacientesSinTratamiento,
        antecedentesConsumeSustanciasNoAltereNo: !form.sustanciasEstupefacientesSinTratamiento,
        antecedentesConsumeSustanciasSiAltereSi: form.sustanciasEstupefacientesConAlteracion,
        antecedentesConsumeSustanciasSiAltereNo: !form.sustanciasEstupefacientesConAlteracion,
        antecedentesApneaSi: form.sindromeApneaObstructivaSueño,
        antecedentesApneaNo: !form.sindromeApneaObstructivaSueño,
        antecedentesObesidadSi: form.obesidadIMC30,
        antecedentesObesidadNo: !form.obesidadIMC30,
        pcomplementariasHipoacusiaSi: form.hipoacusiaFrecuenciasConversacionales,
        pcomplementariasHipoacusiaNo: !form.hipoacusiaFrecuenciasConversacionales,
        pcomplementariasAlteracionAgudezaVisualSi: form.alteracionAgudezaVisual,
        pcomplementariasAlteracionAgudezaVisualNo: !form.alteracionAgudezaVisual,
        pcomplementariasAmpliometriaAnormalSi: form.campimetriaAnormal,
        pcomplementariasAmpliometriaAnormalNo: !form.campimetriaAnormal,
        pcomplementariasNoColorSi: form.noReconocimientoColores,
        pcomplementariasNoColorNo: !form.noReconocimientoColores,
        pcomplementariasPruebaVisionSi: form.pruebaVisionProfundidadAlterada,
        pcomplementariasPruebaVisionNo: !form.pruebaVisionProfundidadAlterada,
        pcomplementariasPsicosensometricaAlteradaSi: form.evaluacionPsicosensometricaAlterada,
        pcomplementariasPsicosensometricaAlteradaNo: !form.evaluacionPsicosensometricaAlterada,
        examenFisicoLimitacionSi: form.limitacionFuerzaExtremidades,
        examenFisicoLimitacionNo: !form.limitacionFuerzaExtremidades,
        examenFisicoAleracionPresenteSi: form.alteracionEquilibrioRomberg,
        examenFisicoAleracionPresenteNo: !form.alteracionEquilibrioRomberg,
        examenFisicoAnormalidadMarchaSi: form.anormalidadMarchaOjosCerrados,
        examenFisicoAnormalidadMarchaNo: !form.anormalidadMarchaOjosCerrados,
        examenFisicoAlteracionCoordinacionSi: form.alteracionCoordinacionDedoNariz,
        examenFisicoAlteracionCoordinacionNo: !form.alteracionCoordinacionDedoNariz,
        exameFisicoNistagmusSi: form.presenciaNistagmus,
        exameFisicoNistagmusNo: !form.presenciaNistagmus,
        examenFisicoAnormalidadMovimientoSi: form.anormalidadMovimientosOculares,
        examenFisicoAnormalidadMovimientoNo: !form.anormalidadMovimientosOculares,
        examenFisicoCirlaSi: form.pupilasNoCirla,
        examenFisicoCirlaNo: !form.pupilasNoCirla,
        examenFisicoAnormalidadLenguajeSi: form.anormalidadLenguaje,
        examenFisicoAnormalidadLenguajeNo: !form.anormalidadLenguaje,
        examenFisicoMovimientoInvoluntarioSi: form.movimientosInvoluntarios,
        examenFisicoMovimientoInvoluntarioNo: !form.movimientosInvoluntarios,
        examenFisicoAsimetriaFacialSi: form.asimetriaFacial,
        examenFisicoAsimetriaFacialNo: !form.asimetriaFacial,
        fechaDesde: form.aptoDesde,
        fechaHasta: form.aptoHasta,
        apto: form.conclusion === "APTO",
        noApto: form.conclusion === "NO APTO",
        observado: form.conclusion === "OBSERVADO",
        dniUsuario: form.dniUsuario,
        observacionesRecomendaciones: form.observacionesRecomendaciones,
        detalleMedicinas: form.medicinasTomando,
        detalleInformacion: form.detalleInformacionExamenMedico,
        aptoConRestriccion: form.conclusion === "APTO CON RESTRICCION",
        otrosDescripcion: form.otrosDatosRelevancia,
        antecedentesDiabetesMellitus: form.diabetesHipoglicemiaNoControlada,
        antecedentesInsuficienciaRenal: form.insuficienciaRenalCronicaGradoIV,
        pcomplementariasTestSas: form.testSASAnormal,
        examenFisicoSustentacionPie: form.sustentacionUnPie,
        antecedentesComentariosDetalles: form.comentariosDetalleAntecedentes,

        usuarioFirma: form.user_medicoFirma,
        usuarioRegistro: user,
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
    const jasperModules = import.meta.glob("../../../../jaspers/FichaConduccion/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../jaspers/FichaConduccion"
    );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRPerzonalizado(
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
                    "Este paciente ya cuenta con registros de Ficha de Conducción de Vehículos",
                    "warning"
                );
            });
        },
        () => {
            //Necesita Agudeza visual 
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Ficha SAS.",
                "warning"
            );
        }
    );
};

export const VerifyTRPerzonalizado = async (nro, tabla, token, set, sede, noTieneRegistro = () => { }, tieneRegistro = () => { }, necesitaExamen = () => { }) => {
    if (!nro) {
        await Swal.fire(
            "Error",
            "Debe Introducir un Nro de Historia Clínica válido",
            "error"
        );
        return;
    }
    Loading("Validando datos");
    getFetch(
        `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,
        token
    ).then((res) => {
        if (res.id === 0) {
            //No tiene registro previo 
            noTieneRegistro();//datos paciente
        } else if (res.id === 2) {
            necesitaExamen();
        } else {
            tieneRegistro();//obtener data servicio
        }
    });
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};

export const handleSubirArchivo = async (form, selectedSede, userlogued, token) => {
    const coordenadas = {
        HUELLA: { x: 40, y: 680, width: 60, height: 60 },
        FIRMA: { x: 106, y: 680, width: 120, height: 60 },
        SELLOFIRMA: { x: 400, y: 680, width: 120, height: 80 },
    };
    handleSubirArchivoDefault(form, selectedSede, registrarPDF, userlogued, token, coordenadas)
};

export const ReadArchivosForm = async (form, setVisualerOpen, token) => {
    ReadArchivosFormDefault(form, setVisualerOpen, token)
}
