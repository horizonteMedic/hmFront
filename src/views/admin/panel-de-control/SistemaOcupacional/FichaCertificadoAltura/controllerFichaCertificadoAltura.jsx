import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    handleSubirArchivoDefault,
    LoadingDefault,
    PrintHojaRDefault,
    ReadArchivosFormDefault,
    SubmitDataServiceDefault,
} from "../../../../utils/functionUtils";
import { getFetch } from "../../../../utils/apiHelpers";

const obtenerReporteUrl =
    "/api/v01/ct/certificadoTrabajoAltura/obtenerReporteCertificadoTrabajoAltura";
const registrarUrl =
    "/api/v01/ct/certificadoTrabajoAltura/registrarActualizarCertificadoTrabajoAltura";
const registrarPDF =
    "/api/v01/ct/archivos/archivoInterconsulta"

const recomendacionesTextMap = {
    sobrepesoDietaHipocalorica: "SOBREPESO. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS.",
    corregirAgudezaVisual: "CORREGIR AGUDEZA VISUAL.",
    corregirAgudezaVisualTotal: "CORREGIR AGUDEZA VISUAL TOTAL.",
    obesidadDietaHipocalorica: "OBESIDAD I. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS.",
    usoLentesCorrectoresLectura: "USO DE LENTES CORRECTORES PARA LECTURA DE CERCA.",
    corregirAgudezaLectura: "CORREGIR AGUDEZA VISUAL PARA LECTURA DE CERCA.",
};

const validarContenidoTieneChecks = (texto, grupoAValidar) => {
    const textoLimpio = texto ?? "";
    const mapedados = {};
    Object.keys(grupoAValidar).forEach(key => {
        mapedados[key] = textoLimpio.includes(grupoAValidar[key]);
    });
    return mapedados;
};

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
        onFinish,
    );
    if (res) {
        const imc = res.imcTriaje ?? "";
        let obesidadIMC30 = false;
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
                    obesidadIMC30 = true;
                    nuevasObservaciones += "OBESIDAD I: NO HACER TRABAJO 1.8 M.N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
                } else if (imcValue >= 35 && imcValue < 40) {
                    obesidadIMC30 = true;
                    nuevasObservaciones += "OBESIDAD II: NO HACER TRABAJO 1.8 M.N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
                } else if (imcValue >= 40) {
                    obesidadIMC30 = true;
                    nuevasObservaciones += "OBESIDAD III: NO HACER TRABAJOS EN ESPACIOS CONFINADOS. NO HACER TRABAJOS SOBRE 1.8 M.S.N PISO. DIETA HIPOCALORICA, HIPOGRASA Y EJERCICIOS.\n";
                }
            }
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

        const promedioOidoDerecho = res.promedioOidoDerecho ?? 0;
        const promedioOidoIzquierdo = res.promedioOidoIzquierdo ?? 0;
        let oidoMayor40 = false;
        if (promedioOidoDerecho > 40 || promedioOidoIzquierdo > 40) {
            oidoMayor40 = true;
        }

        let anemia = false;
        const hemoglobina = parseFloat(res.laboratorioClinicoHemoglobina);

        if (!isNaN(hemoglobina)) {
            const umbral = res.sexoPaciente === "M" ? 13 : 12;
            anemia = hemoglobina < umbral;
        }
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            tipoExamen: res.nombreExamen ?? "",
            //datos personales
            nombres: res.nombresPaciente ?? "",
            dni: res.dniPaciente ?? "",
            edad: String((res.edadPaciente ?? "") + " AÑOS"),
            sexo: res.sexoPaciente ?? "",
            areaTrabajo: res.areaPaciente ?? "",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            //==========================TAB LATERAL===========================
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

            hipoacusiaFrecuenciasConversacionales: oidoMayor40,
            conclusion: oidoMayor40 || obesidadIMC30 ? "NO APTO" :
                debeUsarLentesCorrectores ? "APTO CON RESTRICCION" : null,
            anemiaCriteriosOMS2011: anemia,
            //==========================TAB EXAMEN FISICO===========================
            // Examen Médico - Medidas Antropométricas y Signos Vitales
            frecuenciaCardiaca: res.frecuenciaCardiaca ?? "",
            frecuenciaRespiratoria: res.frecuenciaRespiratoriaTriaje_f_respiratoria ?? "",
            presionArterial: `${res.sistolica ?? ""}/${res.diastolica ?? ""}`, //revisar - combinando sistólica y diastólica
            talla: res.tallaTriaje ?? "",
            peso: res.pesoTriaje ?? "",
            imc: res.imcTriaje ?? "",
            observacionesRecomendaciones: nuevasObservaciones,
            obesidadIMC30: obesidadIMC30,
            imcRed: imcRed,
            perimetroCuello: res.perimetroCuelloTriaje ?? "",
            perimetroCintura: res.cinturaTriaje ?? "",
            perimetroCadera: res.caderaTriaje ?? "",
            icc: res.iccTriaje ?? "",
            perimetroToracicoInspiracion: res.maximaInspiracionPtoracico_p_max_inspiracion ?? "",
            perimetroToracicoEspiracion: res.forazadaPtoracico_p_ex_forzada ?? "",

            medicinasTomando: res.medicamentosAnexo16A ?? "",
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
        const imc = res.imcTriaje ?? "";
        let obesidadIMC30 = false;
        let imcRed = false;
        let nuevasObservaciones = (res.diagnosticoAudiometria ?? "").toUpperCase();
        if (nuevasObservaciones != "") {
            nuevasObservaciones += "\n";
        }
        if (imc) {
            const imcValue = parseFloat(imc);
            if (!isNaN(imcValue) && imcValue > 25) {
                imcRed = true;
                if (imcValue >= 25 && imcValue < 30) {
                    // nuevasObservaciones += "SOBREPESO: DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
                } else if (imcValue >= 30 && imcValue < 35) {
                    obesidadIMC30 = true;
                    // nuevasObservaciones += "OBESIDAD I: NO HACER TRABAJO 1.8 M.N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
                } else if (imcValue >= 35 && imcValue < 40) {
                    obesidadIMC30 = true;
                    // nuevasObservaciones += "OBESIDAD II: NO HACER TRABAJO 1.8 M.N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
                } else if (imcValue >= 40) {
                    obesidadIMC30 = true;
                    // nuevasObservaciones += "OBESIDAD III: NO HACER TRABAJOS EN ESPACIOS CONFINADOS. NO HACER TRABAJOS SOBRE 1.8 M.S.N PISO. DIETA HIPOCALORICA, HIPOGRASA Y EJERCICIOS.\n";
                }
            }
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

        set((prev) => ({
            ...prev,
            // Header
            norden: res.norden ?? "",
            codigoCertificado: res.codigoCertificado_cod_certificado ?? null,
            fechaExam: res.fechaExamen_f_examen ?? "",
            tipoExamen: res.nombreExamen ?? "",
            razonVisita: res.primeraAptitud_chk_primera ? "PRIMERA ACTITUD" : (res.revalidacion_chk_revalidacion ? "REVALIDACION" : ""),
            //datos personales
            nombres: res.nombresPaciente ?? "",
            dni: res.dniPaciente ?? "",
            edad: String((res.edadPaciente ?? "") + " AÑOS"),
            sexo: res.sexoPaciente ?? "",
            experienciaAnios: res.tiempoExperiencia_t_experiencia ?? "",
            areaTrabajo: res.areaPaciente ?? "",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            //==========================TAB LATERAL===========================
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

            //==========================TAB ANTECEDENTES===========================
            // Antecedentes - Columna Izquierda
            alteracionConsciencia: res.antecedentesTodasEnfermedadesSi_chk_1_si ?? false,
            alcoholismoCronico: res.antecedentesAlcoholismoCronicoSi_chk_2_si ?? false,
            movimientosInvoluntariosEnfermedades: res.antecedentesEnfermedadesInvoluntariosSi_chk_3_si ?? false,
            perdidaRecurrenteConsciencia: res.antecedentesPerdidaConcienciaSi_chk_4_si ?? false,
            diabetesHipoglicemiaNoControlada: res.antecedentesDiabetesMellitusSi_chk_29_si ?? false,
            insuficienciaRenalCronicaGradoIV: res.chk30Si_chk_30_si ?? false,

            // Antecedentes - Columna Derecha
            efectosEnfermedadTratamiento: res.antecedentesVariosEfectosSi_chk_9_si ?? false,
            sustanciasEstupefacientesSinTratamiento: res.antecedentesConsumeSustanciasNoAltereSi_chk_8_si ?? false,
            sustanciasEstupefacientesConAlteracion: res.antecedentesConsumeSustanciasSiAltereSi_chk_7_si ?? false,
            sindromeApneaObstructivaSueño: res.antecedentesApneaSi_chk_10_si ?? false,
            obesidadIMC30: res.antecedentesObesidadSi_chk_11_si ?? false,
            anemiaCriteriosOMS2011: res.chk5Si_chk_5_si ?? false,
            comentariosDetalleAntecedentes: res.antecedentesComentariosDetalles_comentariosdetalleantecedent ?? "",

            //==========================TAB PRUEBAS COMPLEMENTARIAS===========================
            // Pruebas Complementarias
            resfriadoCuadroRespiratorio: res.pcomplementariasResfriadoSi_chk_16_si ?? false,
            vertigoMareos: res.pcomplementariasVertigoSi_chk_17_si ?? false,
            temorAlturas: res.pcomplementariasTemorAlturasSi_chk_15_si ?? false,
            hipoacusiaFrecuenciasConversacionales: res.pcomplementariasHipoacusiaSi_chk_13_si ?? false,
            alteracionAgudezaVisual: res.pcomplementariasAlteracionAgudezaVisualSi_chk_14_si ?? false,
            campimetriaAnormal: res.pcomplementariaCampimetriaSi_chk_18_si ?? false,

            // Otros Datos de Relevancia
            medicinasTomando: res.detalleMedicina_d_medicina ?? "",
            otrosDatosRelevancia: res.detalleInformacion_d_informacion ?? "",
            //==========================TAB EXAMEN FISICO===========================
            // Examen Médico - Medidas Antropométricas y Signos Vitales
            frecuenciaCardiaca: res.frecuenciaCardiaca ?? "",
            frecuenciaRespiratoria: res.frecuenciaRespiratoriaTriaje_f_respiratoria ?? "",
            presionArterial: `${res.sistolica ?? ""}/${res.diastolica ?? ""}`, //revisar - combinando sistólica y diastólica
            talla: res.tallaTriaje ?? "",
            peso: res.pesoTriaje ?? "",
            imc: res.imcTriaje ?? "",
            perimetroCuello: res.perimetroCuelloTriaje ?? "",
            perimetroCintura: res.cinturaTriaje ?? "",
            perimetroCadera: res.caderaTriaje ?? "",
            icc: res.iccTriaje ?? "",
            perimetroToracicoInspiracion: res.maximaInspiracionPtoracico_p_max_inspiracion ?? "",
            perimetroToracicoEspiracion: res.forazadaPtoracico_p_ex_forzada ?? "",

            // Examen Físico - Hallazgos del Examen Físico
            limitacionFuerzaExtremidades: res.examenFisicoLimitacionFuerzaSi_chk_19_si ?? false,
            alteracionEquilibrio: res.examenFisicoAlteracionEquilibrioSi_chk_20_si ?? false,
            anormalidadMarcha: res.examenFisicoAnormalidadMarchaSi_chk_21_si ?? false,
            alteracionCoordinacionDedoNariz: res.examenFisicoAlteracionCoordinacionSi_chk_22_si ?? false,
            asimetriaFacial: res.examenFisicoAsimetriaFacialSi_chk_23_si ?? false,
            sustentacionPie1: res.examenFisicoSustentacionPie_suste_pie_15 ?? false,
            presenciaNistagmus: res.exameFisicoNistagmusSi_chk_24_si ?? false,
            anormalidadMovimientosOculares: res.examenFisicoAnormalidadMovimientoSi_chk_25_si ?? false,
            pupilasNoCirla: res.examenFisicoCirlaSi_chk_26_si ?? false,
            anormalidadLenguaje: res.examenFisicoAnormalidadLenguajeSi_chk_27_si ?? false,
            movimientosInvoluntarios: res.examenFisicoMovimientoInvoluntarioSi_chk_28_si ?? false,

            // Examen Físico - Información Adicional
            detalleInformacionExamenFisico: res.detalleInformacion_d_informacion ?? "",

            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
            //===============PARTE INFERIOR=======================
            // Conclusión y Comentarios
            aptoDesde: res.fechaDesde_f_desde ?? today,
            aptoHasta: res.fechaHasta_f_hasta ?? getTodayPlusOneYear(),

            conclusion: oidoMayor40 || obesidadIMC30 ? "NO APTO" :
                debeUsarLentesCorrectores ? "APTO CON RESTRICCION" :
                    res.apto_chk_si ? "APTO" :
                        (res.noApto_chk_no_apto ? "NO APTO" :
                            (res.aptoConRestriccion_chk_apto_r ? "APTO CON RESTRICCION" :
                                res.observado_chk_observado ? "OBSERVADO" : null)),

            observacionesRecomendaciones: res.observacionesRecomendaciones_b_c_observaciones ?? "",
            SubirDoc: true,
            digitalizacion: res.digitalizacion,
            // nombreMedicoColegiatura: userCompleto?.datos?.nombres_user?.toUpperCase(),
            // dniUsuario: userCompleto?.datos?.dni_user,

            // Recomendaciones
            ...validarContenidoTieneChecks(res.observacionesRecomendaciones_b_c_observaciones, recomendacionesTextMap),
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
    if (!form.conclusion) {
        await Swal.fire("Error", "Ingrese la Conclusión", "error");
        return;
    }
    if (!form.experienciaAnios || form.experienciaAnios === "") {
        await Swal.fire("Error", "Ingrese el Tiempo de Experiencia", "error");
        return;
    }
    const body = {
        norden: form.norden,
        codigoCertificado: form.codigoCertificado,
        dniPaciente: form.dni,
        tiempoExperiencia: form.experienciaAnios,
        edad: form.edad.replace(" AÑOS", ""),
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
        antecedentesConsumeSustanciasSiAltereSi: form.sustanciasEstupefacientesConAlteracion,
        antecedentesConsumeSustanciasSiAltereNo: !form.sustanciasEstupefacientesConAlteracion,
        antecedentesConsumeSustanciasNoAltereSi: form.sustanciasEstupefacientesSinTratamiento,
        antecedentesConsumeSustanciasNoAltereNo: !form.sustanciasEstupefacientesSinTratamiento,
        antecedentesVariosEfectosSi: form.efectosEnfermedadTratamiento,
        antecedentesVariosEfectosNo: !form.efectosEnfermedadTratamiento,
        antecedentesApneaSi: form.sindromeApneaObstructivaSueño,
        antecedentesApneaNo: !form.sindromeApneaObstructivaSueño,
        antecedentesObesidadSi: form.obesidadIMC30,
        antecedentesObesidadNo: !form.obesidadIMC30,
        pcomplementariasHipoacusiaSi: form.hipoacusiaFrecuenciasConversacionales,
        pcomplementariasHipoacusiaNo: !form.hipoacusiaFrecuenciasConversacionales,
        pcomplementariasAlteracionAgudezaVisualSi: form.alteracionAgudezaVisual,
        pcomplementariasAlteracionAgudezaVisualNo: !form.alteracionAgudezaVisual,
        pcomplementariasTemorAlturasSi: form.temorAlturas,
        pcomplementariasTemorAlturasNo: !form.temorAlturas,
        pcomplementariasResfriadoSi: form.resfriadoCuadroRespiratorio,
        pcomplementariasResfriadoNo: !form.resfriadoCuadroRespiratorio,
        pcomplementariasVertigoSi: form.vertigoMareos,
        pcomplementariasVertigoNo: !form.vertigoMareos,
        pcomplementariaCampimetriaSi: form.campimetriaAnormal,
        pcomplementariaCampimetriaNo: !form.campimetriaAnormal,
        examenFisicoLimitacionFuerzaSi: form.limitacionFuerzaExtremidades,
        examenFisicoLimitacionFuerzaNo: !form.limitacionFuerzaExtremidades,
        examenFisicoAlteracionEquilibrioSi: form.alteracionEquilibrio,
        examenFisicoAlteracionEquilibrioNo: !form.alteracionEquilibrio,
        examenFisicoAnormalidadMarchaSi: form.anormalidadMarcha,
        examenFisicoAnormalidadMarchaNo: !form.anormalidadMarcha,
        examenFisicoAlteracionCoordinacionSi: form.alteracionCoordinacionDedoNariz,
        examenFisicoAlteracionCoordinacionNo: !form.alteracionCoordinacionDedoNariz,
        examenFisicoAsimetriaFacialSi: form.asimetriaFacial,
        examenFisicoAsimetriaFacialNo: !form.asimetriaFacial,
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
        antecedentesDiabetesMellitusSi: form.diabetesHipoglicemiaNoControlada,
        antecedentesDiabetesMellitusNo: !form.diabetesHipoglicemiaNoControlada,
        fechaDesde: form.aptoDesde,
        fechaHasta: form.aptoHasta,
        apto: form.conclusion === "APTO",
        observado: form.conclusion === "OBSERVADO",
        dniUsuario: form.dniUsuario,
        detalleMedicina: form.medicinasTomando,
        detalleInformacion: form.detalleInformacionExamenFisico,
        noApto: form.conclusion === "NO APTO",
        aptoConRestriccion: form.conclusion === "APTO CON RESTRICCION",
        observacionesRecomendaciones: form.observacionesRecomendaciones,
        antecedentesComentariosDetalles: form.comentariosDetalleAntecedentes,
        examenFisicoSustentacionPie: form.sustentacionPie1,
        antecedentesInsuficienciaRenalCronicaSi: form.insuficienciaRenalCronicaGradoIV,
        antecedentesInsuficienciaRenalCronicaNo: !form.insuficienciaRenalCronicaGradoIV,
        antecedentesAnemiaCualquierGradoSi: form.anemiaCriteriosOMS2011,
        antecedentesAnemiaCualquierGradoNo: !form.anemiaCriteriosOMS2011,

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
    const jasperModules = import.meta.glob("../../../../jaspers/CertificadoAltura/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../jaspers/CertificadoAltura"
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
                    "Este paciente ya cuenta con registros de Ficha Certificado de Altura",
                    "warning"
                );
            });
        },
        () => {
            //Necesita Agudeza visual 
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Audiometria.",
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
        HUELLA: { x: 400, y: 680, width: 60, height: 60 },
        FIRMA: { x: 466, y: 680, width: 120, height: 60 },
        SELLOFIRMA: { x: 40, y: 680, width: 120, height: 80 },
    };
    handleSubirArchivoDefault(form, selectedSede, registrarPDF, userlogued, token, coordenadas)
};

export const ReadArchivosForm = async (form, setVisualerOpen, token) => {
    ReadArchivosFormDefault(form, setVisualerOpen, token)
}