import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    handleSubirArchivoDefault,
    ReadArchivosFormDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRPerzonalizadoDefault,
} from "../../../../../utils/functionUtils";

const obtenerReporteUrl =
    "/api/v01/ct/certificadoTrabajoAltura/obtenerReporteCertificadoTrabajoAlturaPoderosa";
const registrarUrl =
    "/api/v01/ct/certificadoTrabajoAltura/registrarActualizarCertificadoTrabajoAlturaPoderosa";
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
        let nuevoConclusiones = ""
        const trigliseridos = parseFloat(res.trigliseridosAnalisisBioquimico_txttrigliseridos)?.toFixed(2)
        if (trigliseridos && trigliseridos > 150) {
            nuevoConclusiones += `HIPERTRIGLICERIDEMIA\n`
        }
        const colesterol = parseFloat(res.colesterolAnalisisBioquimico_txtcolesterol)?.toFixed(2)
        if (colesterol && colesterol > 200) {
            nuevoConclusiones += `HIPERCOLESTEROLEMIA\n`
        }
        const diagnosticoAudio = (res.diagnosticoAudiometricoCompleto_diagnostico ?? "").trim()
        if (diagnosticoAudio != "NORMAL" && diagnosticoAudio != "") {
            nuevoConclusiones += `HIPOACUSIA\n`
        }

        const imc = res.imctriaje_imc ?? "";
        let obesidadIMC30 = false;
        let imcRed = false;
        if (imc) {
            const imcValue = parseFloat(imc);
            if (!isNaN(imcValue) && imcValue > 25) {
                imcRed = true;
                if (imcValue >= 25 && imcValue < 30) {
                    nuevoConclusiones += "SOBREPESO: DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
                } else if (imcValue >= 30 && imcValue < 35) {
                    obesidadIMC30 = true;
                    nuevoConclusiones += "OBESIDAD I: NO HACER TRABAJO 1.8 M.N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
                } else if (imcValue >= 35 && imcValue < 40) {
                    obesidadIMC30 = true;
                    nuevoConclusiones += "OBESIDAD II: NO HACER TRABAJO 1.8 M.N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
                } else if (imcValue >= 40) {
                    obesidadIMC30 = true;
                    nuevoConclusiones += "OBESIDAD III: NO HACER TRABAJOS EN ESPACIOS CONFINADOS. NO HACER TRABAJOS SOBRE 1.8 M.S.N PISO. DIETA HIPOCALORICA, HIPOGRASA Y EJERCICIOS.\n";
                }
            }
        }


        let presion_sistolica = parseFloat(res.sistolicatriaje_sistolica);
        let presion_diastolica = parseFloat(res.diastolicatriaje_diastolica);
        if (!isNaN(presion_sistolica) && !isNaN(presion_diastolica) &&
            (presion_sistolica >= 140 || presion_diastolica >= 90)) {
            nuevoConclusiones += "HTA NO CONTROLADA.\n";
        }

        set((prev) => ({
            ...prev,
            // Header
            norden: res.norden ?? "",
            nombreExamen: res.nombreExamen ?? "",
            esApto: obesidadIMC30 ? false : prev.esApto,

            // Datos personales
            nombres: res.nombresPaciente ?? "",
            dni: res.dniPaciente ?? "",
            edad: `${res.edadPaciente ?? ""} AÑOS`,
            sexo: res.sexoPaciente ?? "",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            cargo: res.cargoPaciente ?? "",
            areaTrabajo: res.areaPaciente ?? "",

            // ====================== TAB LATERAL: AGUDEZA VISUAL ======================
            vcOD: res.visioncercasincorregirod_v_cerca_s_od ?? "",
            vlOD: res.visionlejossincorregirod_v_lejos_s_od ?? "",
            vcOI: res.visioncercasincorregiroi_v_cerca_s_oi ?? "",
            vlOI: res.visionlejossincorregiroi_v_lejos_s_oi ?? "",
            vcCorregidaOD: res.odcc_odcc ?? "",
            vlCorregidaOD: res.odlc_odlc ?? "",
            vcCorregidaOI: res.oicc_oicc ?? "",
            vlCorregidaOI: res.oilc_oilc ?? "",
            vclrs: res.vc_vc ?? "",
            vb: res.vb_vb ?? "",
            rp: res.rp_rp ?? "",
            enfermedadesOculares: res.enfermedadesocularesoftalmo_e_oculares ?? "",

            // ====================== EXAMEN FISICO ======================
            // Perímetros
            perimetroCadera: res.caderatriaje_cadera ?? "",
            perimetroCuello: res.perimetrocuellotriaje_perimetro_cuello ?? "",
            perimetroCintura: res.cinturatriaje_cintura ?? "",

            // Medidas corporales
            talla: res.tallatriaje_talla ?? "",
            peso: res.pesotriaje_peso ?? "",
            imc: res.imctriaje_imc ?? "",

            // Medidas Extra
            fc: res.frecuenciacardiacatriaje_f_cardiaca ?? "",
            fr: res.frecuenciarespiratoriatriaje_f_respiratoria ?? "",
            pa: `${res.sistolicatriaje_sistolica ?? ""}/${res.diastolicatriaje_diastolica ?? ""}`,
            icc: res.icctriaje_icc ?? "",
            pToracicoInspiracion: res.maximaInspiracionPtoracico_p_max_inspiracion ?? "",
            pToracicoEspiracion: res.forazadaPtoracico_p_ex_forzada ?? "",

            diagnostico: nuevoConclusiones,
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

        set((prev) => ({
            ...prev,
            // Header
            norden: res.norden ?? "",
            codigoCertificado: res.codigoCertificado_cod_certificado,
            fechaExam: res.fechaExamen_f_examen ?? "",
            nombreExamen: res.nombreExamen ?? "",
            fechaHasta: res.fechaCaducidad_f_caducidad ?? "",
            esApto: res.apto_chk_apto ?? false,

            // Datos personales
            nombres: res.nombresPaciente ?? "",
            dni: res.dniPaciente ?? "",
            edad: `${res.edadPaciente ?? ""} AÑOS`,
            sexo: res.sexoPaciente ?? "",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            cargo: res.cargoPaciente ?? "",
            areaTrabajo: res.areaPaciente ?? "",

            // Datos extra
            tiempoExperiencia: res.tiempoExperiencia_t_experiencia ?? "",
            lugarTrabajo: res.lugarExperiencia_lugar_expe ?? "",
            altura: res.altura_txtaltura ?? "",

            // ====================== TAB LATERAL: AGUDEZA VISUAL ======================
            vcOD: res.visioncercasincorregirod_v_cerca_s_od ?? "",
            vlOD: res.visionlejossincorregirod_v_lejos_s_od ?? "",
            vcOI: res.visioncercasincorregiroi_v_cerca_s_oi ?? "",
            vlOI: res.visionlejossincorregiroi_v_lejos_s_oi ?? "",
            vcCorregidaOD: res.odcc_odcc ?? "",
            vlCorregidaOD: res.odlc_odlc ?? "",
            vcCorregidaOI: res.oicc_oicc ?? "",
            vlCorregidaOI: res.oilc_oilc ?? "",
            vclrs: res.vc_vc ?? "",
            vb: res.vb_vb ?? "",
            rp: res.rp_rp ?? "",
            enfermedadesOculares: res.enfermedadesocularesoftalmo_e_oculares ?? "",

            // ====================== ANTECEDENTES ======================
            // Historial
            accidentesTrabajoEnfermedades: res.accidentesTrabajo_txtaccidentes_trab ?? "",
            antecedentesFamiliares: res.antecedentesFamiliares_txtantecedente_familiares ?? "",

            // Antecedentes Psiconeuroológicos
            tecModeradoGrave: res.tecModeradoSi_chk_psico_si1 ?? false,
            tecModeradoGraveDescripcion: res.tecModeradoDescripcion_txt_antecpsico_1 ?? "",
            convulsiones: res.convulsionesSi_chk_psico_si2 ?? false,
            convulsionesDescripcion: res.convulsionesDescripcion_txt_antecpsico_2 ?? "",
            mareosModosidadAcatisia: res.mareosSi_chk_psico_si3 ?? false,
            mareosModosidadAcatasiaDescripcion: res.mareosDescripcion_txt_antecpsico_3 ?? "",
            problemasAudicion: res.problemasAuditivosSi_chk_psico_si4 ?? false,
            problemasAudicionDescripcion: res.problemasAuditivosDescripcion_txt_antecpsico_4 ?? "",
            problemasEquilibrio: res.problemasEquilibrioSi_chk_psico_si5 ?? false,
            problemasEquilibrioDescripcion: res.problemasEquilibrioDescripcion_txt_antecpsico_5 ?? "",
            acrofobia: res.acrofobiaSi_chk_psico_si6 ?? false,
            acrofobiaDescripcion: res.acrofobiaDescripcion_txt_antecpsico_6 ?? "",
            agarofobia: res.agarofobiaSi_chk_psico_si7 ?? false,
            agarofobiaDescripcion: res.agarofobiaDescripcion_txt_antecpsico_7 ?? "",

            // Consumo de sustancias
            tabaco: res.tabacoCantidad_txt_tabaco_cantiad ?? "",
            tabacoFrecuencia: res.tabacoFrecuencia_txt_tabaco_frecuencia ?? "",
            alcohol: res.alcoholCantidad_txt_alcohol_cantiad ?? "",
            alcoholFrecuencia: res.alcoholFrecuencia_txt_alcohol_frecuencia ?? "",
            drogas: res.drogasCantidad_txt_drogas_cantiad ?? "",
            drogasFrecuencia: res.drogasFrecuencia_txt_drogas_frecuencia ?? "",
            hojaCoca: res.hojaCocaCantidad_txt_hojacoca_cantiad ?? "",
            hojaCocaFrecuencia: res.hojaCocaFrecuencia_txt_hojacoca_frecuencia ?? "",
            cafe: res.cafeCantidad_txt_cafe_cantiad ?? "",
            cafeFrecuencia: res.cafeFrecuencia_txt_cafe_frecuencia ?? "",

            // Conclusiones Finales
            diagnostico: res.diagnostico_txtdiagnostico ?? "",
            conclusionesRecomendaciones: res.conclusiones_atxtobservaciones ?? "",

            // Recomendaciones específicas
            sobrepesoObesidadHipocalorica: (res.conclusiones_atxtobservaciones ?? "").includes("SOBREPESO. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS."),
            corregirAgudezaVisual: (res.conclusiones_atxtobservaciones ?? "").includes("CORREGIR AGUDEZA VISUAL."),
            corregirAgudezaVisualTotal: (res.conclusiones_atxtobservaciones ?? "").includes("CORREGIR AGUDEZA VISUAL TOTAL."),
            obesidadDietaHipocalorica: (res.conclusiones_atxtobservaciones ?? "").includes("OBESIDAD I. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS."),
            usoLentesCorrectoresLecturaCerca: (res.conclusiones_atxtobservaciones ?? "").includes("USO DE LENTES CORRECTORES PARA LECTURA DE CERCA."),
            corregirAgudezaLecturaCerca: (res.conclusiones_atxtobservaciones ?? "").includes("CORREGIR AGUDEZA VISUAL PARA LECTURA DE CERCA."),

            // ====================== TEST DE CAGE ======================
            // Preguntas del test CAGE
            gustaSalirDivertirse: res.gustaDivertirseSi_chktest_si1 ?? false,
            gustaSalirDivertirsePuntaje: res.gustaDivertirsePuntaje_txttest_p1 ?? "",
            molestaLlegaTardeCompromiso: res.tardeCompromisoSi_chktest_si2 ?? false,
            molestaLlegaTardeCompromisoPuntaje: res.tardeCompromisoPuntaje_txttest_p2 ?? "",
            molestadoGenteCriticaBeber: res.criticaFormaBeberSi_chktest_si3 ?? false,
            molestadoGenteCriticaBeberPuntaje: res.criticaFormaBeberPuntaje_txttest_p3 ?? "",
            sentidoEstarReunionDivirtiendoseReanima: res.reunionDivertirseReanimaSi_chktest_si4 ?? false,
            sentidoEstarReunionDivirtiendoseReanimaPuntaje: res.reunionDivertirseReanimaPuntaje_txttest_p4 ?? "",
            impresionDeberiaBeberMenos: res.impresionBeberMenosSi_chktest_si5 ?? false,
            impresionDeberiaBeberMenosPuntaje: res.impresionBeberMenosPuntaje_txttest_p5 ?? "",
            duermeBien: res.duermeBienSi_chktest_si6 ?? false,
            duermeBienPuntaje: res.duermeBienPuntaje_txttest_p6 ?? "",
            sentidoCulpablePorBeber: res.costumbreBeberSi_chktest_si7 ?? false,
            sentidoCulpablePorBeberPuntaje: res.costumbreBeberPuntaje_txttest_p7 ?? "",
            poneNerviosoMenudo: res.nerviosoAMenudoSi_chktest_si8 ?? false,
            poneNerviosoMenudoPuntaje: res.nerviosoAMenudoPuntaje_txttest_p8 ?? "",
            bebeMananaParaCalmarNervios: res.beberCalmarNerviosSi_chktest_si9 ?? false,
            bebeMananaParaCalmarNerviosPuntaje: res.beberCalmarNerviosPuntaje_txttest_p9 ?? "",
            doloresEspaldaLevantarse: res.doloresEspaldaSi_chktest_si10 ?? false,
            doloresEspaldaLevantarsePuntaje: res.doloresEspaldaPuntaje_txttest_p10 ?? "",

            // Anamnesis Test de Cage
            anamnesisTestDeCage: res.anamnesis_txtanamnesis ?? "",

            // ====================== EXAMEN FISICO ======================
            // Perímetros
            perimetroCadera: res.caderatriaje_cadera ?? "",
            perimetroCuello: res.perimetrocuellotriaje_perimetro_cuello ?? "",
            perimetroCintura: res.cinturatriaje_cintura ?? "",

            // Medidas corporales
            talla: res.tallatriaje_talla ?? "",
            peso: res.pesotriaje_peso ?? "",
            imc: res.imctriaje_imc ?? "",

            // Medidas Extra
            fc: res.frecuenciacardiacatriaje_f_cardiaca ?? "",
            fr: res.frecuenciarespiratoriatriaje_f_respiratoria ?? "",
            pa: `${res.sistolicatriaje_sistolica ?? ""}/${res.diastolicatriaje_diastolica ?? ""}`,
            icc: res.icctriaje_icc ?? "",
            pToracicoInspiracion: res.maximaInspiracionPtoracico_p_max_inspiracion ?? "",
            pToracicoEspiracion: res.forazadaPtoracico_p_ex_forzada ?? "",

            // Examen físico detallado
            apreciacionGeneral: res.apreciacionGeneral_txtapresiaciongeneral ?? "",
            cabeza: res.cabeza_txtcabeza ?? "",
            piel: res.piel_txtpiel ?? "",
            movilidadOcular: res.motilidadOcular_txtmotilidadocular ?? "",
            otoscopiaOD: res.otoscopiaOd_txtotoscopiaod ?? "",
            otoscopiaOI: res.otoscopiaOi_txtotoscopiaoi ?? "",
            nariz: res.nariz_txtnariz ?? "",
            aparatoRespiratorio: res.apRespiratorio_txtaprespiratorio ?? "",
            aparatoCardiovascular: res.apCardiovascular_txtapcardiovascuar ?? "",
            abdomen: res.abdomen_txtabdomen ?? "",
            musculoEsqueletico: res.musculoEsqueletico_txtmusculoesqueletico ?? "",
            columna: res.columna_txtcolumna ?? "",
            testEpworth: res.tesEpworth_txttesepworth ?? "",
            otrosExaLaboratorio: res.otrosExamenesLaboratorio_txtotrosexamlab ?? "",

            // ====================== NEUROLOGICO ======================
            // Reflejos
            reflejos: res.reflejos_txtreflejos ?? "",
            // Pruebas neurológicas
            pruebaDedoNariz: res.dedoNarizPositivo_chkneuro_pos1 ?? false,
            indiceBarany: res.indiceBaranyPositivo_chkneuro_pos2 ?? false,
            diadococinesia: res.diadococinesiaPositivo_chkneuro_pos3 ?? false,
            rombergSimple: res.rombergSimplePositivo_chkneuro_pos4 ?? false,
            rombergSensibilizado: res.rombergSensibilizadoPositivo_chkneuro_pos5 ?? false,
            marchaEnTandem: res.marchaTandemPositivo_chkneuro_pos6 ?? false,
            unterberg: res.unterbergPositivo_chkneuro_pos7 ?? false,
            babinskiWeil: res.babinskiPositivo_chkneuro_pos8 ?? false,
            dixHallpike: res.dixPositivo_chkneuro_pos9 ?? false,
            marcha: res.marchaPositivo_chkneuro_pos10 ?? false,

            SubirDoc: true,
            digitalizacion: res.digitalizacion,

            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
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
        codigoCertificado: form.codigoCertificado,
        fechaExamen: form.fechaExam,
        fechaCaducidad: form.fechaHasta,
        procedencia: "",
        tiempoExperiencia: form.tiempoExperiencia,
        lugarExperiencia: form.lugarTrabajo,
        edad: form.edad.replace(" AÑOS", ""),
        accidentesTrabajo: form.accidentesTrabajoEnfermedades,
        antecedentesFamiliares: form.antecedentesFamiliares,
        tecModeradoSi: form.tecModeradoGrave,
        tecModeradoNo: !form.tecModeradoGrave,
        convulsionesSi: form.convulsiones,
        convulsionesNo: !form.convulsiones,
        mareosSi: form.mareosModosidadAcatisia,
        mareosNo: !form.mareosModosidadAcatisia,
        problemasAuditivosSi: form.problemasAudicion,
        problemasAuditivosNo: !form.problemasAudicion,
        problemasEquilibrioSi: form.problemasEquilibrio,
        problemasEquilibrioNo: !form.problemasEquilibrio,
        acrofobiaSi: form.acrofobia,
        acrofobiaNo: !form.acrofobia,
        agarofobiaSi: form.agarofobia,
        agarofobiaNo: !form.agarofobia,
        tecModeradoDescripcion: form.tecModeradoGraveDescripcion,
        convulsionesDescripcion: form.convulsionesDescripcion,
        mareosDescripcion: form.mareosModosidadAcatasiaDescripcion,
        problemasAuditivosDescripcion: form.problemasAudicionDescripcion,
        problemasEquilibrioDescripcion: form.problemasEquilibrioDescripcion,
        acrofobiaDescripcion: form.acrofobiaDescripcion,
        agarofobiaDescripcion: form.agarofobiaDescripcion,
        tabacoCantidad: form.tabaco,
        tabacoFrecuencia: form.tabacoFrecuencia,
        alcoholCantidad: form.alcohol,
        alcoholFrecuencia: form.alcoholFrecuencia,
        drogasCantidad: form.drogas,
        drogasFrecuencia: form.drogasFrecuencia,
        hojaCocaCantidad: form.hojaCoca,
        hojaCocaFrecuencia: form.hojaCocaFrecuencia,
        cafeCantidad: form.cafe,
        cafeFrecuencia: form.cafeFrecuencia,
        gustaDivertirseSi: form.gustaSalirDivertirse,
        gustaDivertirseNo: !form.gustaSalirDivertirse,
        gustaDivertirsePuntaje: form.gustaSalirDivertirsePuntaje,
        tardeCompromisoSi: form.molestaLlegaTardeCompromiso,
        tardeCompromisoNo: !form.molestaLlegaTardeCompromiso,
        tardeCompromisoPuntaje: form.molestaLlegaTardeCompromisoPuntaje,
        criticaFormaBeberSi: form.molestadoGenteCriticaBeber,
        criticaFormaBeberNo: !form.molestadoGenteCriticaBeber,
        criticaFormaBeberPuntaje: form.molestadoGenteCriticaBeberPuntaje,
        reunionDivertirseReanimaSi: form.sentidoEstarReunionDivirtiendoseReanima,
        reunionDivertirseReanimaNo: !form.sentidoEstarReunionDivirtiendoseReanima,
        reunionDivertirseReanimaPuntaje: form.sentidoEstarReunionDivirtiendoseReanimaPuntaje,
        impresionBeberMenosSi: form.impresionDeberiaBeberMenos,
        impresionBeberMenosNo: !form.impresionDeberiaBeberMenos,
        impresionBeberMenosPuntaje: form.impresionDeberiaBeberMenosPuntaje,
        duermeBienSi: form.duermeBien,
        duermeBienNo: !form.duermeBien,
        duermeBienPuntaje: form.duermeBienPuntaje,
        costumbreBeberSi: form.sentidoCulpablePorBeber,
        costumbreBeberNo: !form.sentidoCulpablePorBeber,
        costumbreBeberPuntaje: form.sentidoCulpablePorBeberPuntaje,
        nerviosoAMenudoSi: form.poneNerviosoMenudo,
        nerviosoAMenudoNo: !form.poneNerviosoMenudo,
        nerviosoAMenudoPuntaje: form.poneNerviosoMenudoPuntaje,
        beberCalmarNerviosSi: form.bebeMananaParaCalmarNervios,
        beberCalmarNerviosNo: !form.bebeMananaParaCalmarNervios,
        beberCalmarNerviosPuntaje: form.bebeMananaParaCalmarNerviosPuntaje,
        doloresEspaldaSi: form.doloresEspaldaLevantarse,
        doloresEspaldaNo: !form.doloresEspaldaLevantarse,
        doloresEspaldaPuntaje: form.doloresEspaldaLevantarsePuntaje,
        anamnesis: form.anamnesisTestDeCage,
        apreciacionGeneral: form.apreciacionGeneral,
        cabeza: form.cabeza,
        piel: form.piel,
        motilidadOcular: form.movilidadOcular,
        otoscopiaOd: form.otoscopiaOD,
        otoscopiaOi: form.otoscopiaOI,
        nariz: form.nariz,
        apRespiratorio: form.aparatoRespiratorio,
        apCardiovascular: form.aparatoCardiovascular,
        abdomen: form.abdomen,
        musculoEsqueletico: form.musculoEsqueletico,
        columna: form.columna,
        tesEpworth: form.testEpworth,
        reflejos: form.reflejos,
        dedoNarizNegativo: !form.pruebaDedoNariz,
        dedoNarizPositivo: form.pruebaDedoNariz,
        indiceBaranyNegativo: !form.indiceBarany,
        indiceBaranyPositivo: form.indiceBarany,
        diadococinesiaNegativo: !form.diadococinesia,
        diadococinesiaPositivo: form.diadococinesia,
        rombergSimpleNegativo: !form.rombergSimple,
        rombergSimplePositivo: form.rombergSimple,
        rombergSensibilizadoNegativo: !form.rombergSensibilizado,
        rombergSensibilizadoPositivo: form.rombergSensibilizado,
        marchaTandemNegativo: !form.marchaEnTandem,
        marchaTandemPositivo: form.marchaEnTandem,
        unterbergNegativo: !form.unterberg,
        unterbergPositivo: form.unterberg,
        babinskiNegativo: !form.babinskiWeil,
        babinskiPositivo: form.babinskiWeil,
        dixNegativo: !form.dixHallpike,
        dixPositivo: form.dixHallpike,
        marchaNegativo: !form.marcha,
        marchaPositivo: form.marcha,
        diagnostico: form.diagnostico,
        apto: form.esApto === true,
        noApto: form.esApto === false,
        aptoRestriccion: false,
        conclusiones: form.conclusionesRecomendaciones,
        dniUsuario: form.dni_medico,
        otrosExamenesLaboratorio: form.otrosExaLaboratorio,
        altura: form.altura,
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
                    "Este paciente ya cuenta con registros de Certificado de Altura Poderosa",
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