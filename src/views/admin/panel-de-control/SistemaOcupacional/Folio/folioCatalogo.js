export const EXAMENES_CATALOGO = {
    /* =========================
       GENERALES / BASE
    ========================= */
    ANEXO_02: {
        nombre: "ANEXO 02",
        tabla: "anexo_agroindustrial",
        url: "/api/v01/ct/anexos/anexo2/obtenerReporteAnexo2Completo",
        esJasper: true,
    },

    ANEXO_16: {
        nombre: "ANEXO 16",
        tabla: "anexo7c",
        url: "/api/v01/ct/anexos/anexo16/obtenerReporteAnexo16",
    },

    ANEXO_16A: {
        nombre: "ANEXO 16A",
        tabla: "anexo16a",
        url: "/api/v01/ct/anexos/anexo16a/obtenerReporteAnexo16a",
        esJasper: true,
    },

    ANTECEDENTES_PATOLOGICOS: {
        nombre: "ANTECEDENTES PATOLOGICOS",
        tabla: "antecedentes_patologicos",
        url: "/api/v01/ct/antecedentesPatologicos/obtenerReporteAntecedentesPatologicos",
        esJasper: true
    },

    CERTIFICADO_ANEXO_02: {
        nombre: "CERTIFICADO MEDICO OCUPACIONAL ANEXO 02",
        tabla: "aptitud_medico_ocupacional_agro",
        url: "/api/v01/ct/anexos/fichaAnexo2/obtenerReporteFichaAnexo2",
        esJasper: true,
    },

    CERTIFICADO_APTITUD_ANEXO_16: {
        nombre: "CERTIFICADO DE APTITUD ANEXO 16",
        tabla: "certificado_aptitud_medico_ocupacional",
        url: "/api/v01/ct/anexos/fichaAnexo16/obtenerReporteFichaAnexo16",
        esJasper: true,
    },

    CONSTANCIA_EXAMEN_MEDICO_OCUPACIONAL: {
        nombre: "CONSTANCIA DE EXAMEN MEDICO OCUPACIONAL",
        tabla: "certificado_aptitud_medico_resumen",
        url: "/api/v01/ct/certificadoAptitudMedicoOcupacional/obtenerReporteCertificadoMedicoOcupacional",
        esJasper: true,
    },

    CUESTIONARIO_NORDICO: {
        nombre: "CUESTIONARIO NORDICO",
        tabla: "cuestionario_nordico",
        url: "/api/v01/ct/cuestionarioNordico/obtenerReporteCuestionarioNordico"
    },

    EVALUACION_MUSCULO_ESQUELETICA: {
        nombre: "EVALUACION MUSCULO ESQUELETICA",
        tabla: "evaluacion_musculo_esqueletica",
        url: "/api/v01/ct/evaluacionMusculoEsqueletica/obtenerReporteEvaluacionMusculoEsqueletica"
    },

    EVALUACION_MUSCULO_ESQUELETICA_BOROO: {
        nombre: "EVALUACION MUSCULO ESQUELETICA BOROO",
        tabla: "evaluacion_musculo_esqueletica2021",
        url: "/api/v01/ct/evaluacionMusculoEsqueletica/obtenerReporteEvaluacionMusculoEsqueletica2021"
    },

    RESUMEN_MEDICO_PODEROSA: {
        nombre: "RESUMEN MEDICO",
        tabla: "resumen_medico_poderosa",
        url: "/api/v01/ct/anexos/obtenerReporteResumenMedico",
    },

    /* =========================
       ALTURA / VEHÍCULOS
    ========================= */
    CERTIFICADO_ALTURA: {
        nombre: "CERTIFICADO ALTURA",
        tabla: "b_certificado_altura",
        url: "/api/v01/ct/certificadoTrabajoAltura/obtenerReporteCertificadoTrabajoAltura",
        esJasper: true,
    },

    CERTIFICADO_ALTURA_PODEROSA: {
        nombre: "CERTIFICADO ALTURA PODEROSA",
        tabla: "certificado_altura_poderosa",
        url: "/api/v01/ct/certificadoTrabajoAltura/obtenerReporteCertificadoTrabajoAlturaPoderosa",
        esJasper: true,
    },

    CERTIFICADO_APTITUD_ALTURA_PODEROSA: {
        nombre: "CERTIFICADO APTITUD ALTURA PODEROSA",
        tabla: "aptitud_altura_poderosa",
        url: "/api/v01/ct/aptitudAltura/obtenerReporteAptitudAlturaPoderosa",
        esJasper: true,
    },

    CERTIFICADO_VEHICULOS: {
        nombre: "CERTIFICADO VEHICULOS",
        tabla: "b_certificado_conduccion",
        url: "/api/v01/ct/certificadoConduccion/obtenerReporteCertificadoConduccion",
        esJasper: true,
    },

    ENFERMEDADES_ALTURA: {
        nombre: "ENFERMEDADES EN ALTURA",
        tabla: "antece_enfermedades_altura",
        url: "/api/v01/ct/antecedentesEnfermedadesAltura/obtenerReporteAntecedentesEnfermedadesAltura"
    },

    FICHA_SAS: {
        nombre: "FICHA SAS",
        tabla: "ficha_sas",
        url: "/api/v01/ct/fichaApneaSueno/obtenerReporteFichaSas",
        esJasper: true
    },

    HISTORIA_OCUPACIONAL: {
        nombre: "HISTORIA OCUPACIONAL",
        tabla: "historia_oc_info",
        url: "/api/v01/ct/historiaOcupacional/obtenerReporteHistoriaOcupacional"
    },

    HOJA_DE_CONSULTA_EXTERNA: {
        nombre: "HOJA DE CONSULTA EXTERNA",
        tabla: "hoja_consulta_externa",
        url: "/api/v01/ct/hojaConsultaExterna/obtenerReporteHojaConsultaExterna",
    },

    LICENCIA_CONDUCIR_PODEROSA: {
        nombre: "LICENCIA PARA CONDUCIR INTERNA PODEROSA",
        tabla: "aptitud_licencia_conduciri",
        url: "/api/v01/ct/aptitudLicenciaConducir/obtenerReporteAptitudLicenciaConducir",
        esJasper: true,
    },

    USO_RESPIRADORES: {
        nombre: "USO DE RESPIRADORES",
        tabla: "b_uso_respiradores",
        url: "/api/v01/ct/respiradores/obtenerReporteRespiradores",
        esJasper: true,
    },

    /* =========================
       ARCHIVOS EXTERNOS
    ========================= */
    DECLARACION_USO_FIRMA_ARCHIVO: {
        nombre: "DECLARACION USO FIRMA",
        tabla: "DECLARACION USO FIRMA",
        nomenclatura: "DECLARACION USO FIRMA",
        esArchivo: true,
    },

    ELECTROCARDIOGRAMA_ARCHIVO: {
        nombre: "ELECTROCARDIOGRAMA ARCHIVO",
        tabla: "ELECTROCARDIOGRAMA",
        nomenclatura: "ELECTROCARDIOGRAMA",
        esArchivo: true,
    },

    LABORATORIO_ARCHIVO_EXTERNO: {
        nombre: "LABORATORIO ARCHIVO EXTERNO",
        tabla: "LABORATORIO MANIPULADORES",
        nomenclatura: "LABORATORIO MANIPULADORES",
        esArchivo: true,
    },

    ESPIROMETRIA_ARCHIVO: {
        nombre: "ESPIROMETRIA",
        tabla: "ESPIROMETRIA",
        nomenclatura: "ESPIROMETRIA",
        tablaArchivo: "funcion_abs",
        urlInfo: "/api/v01/ct/espirometria/obtenerReporteEspirometria",
        esArchivo: true,
    },

    INTERCONSULTAS: {
        nombre: "INTERCONSULTAS",
        tabla: "",
        url: "",
        esArchivo: true,
    },

    OFTALMOLOGIA_VISION_TESTER: {
        nombre: "VISION TESTER ARCHIVO EXTERNO",
        tabla: "OFTALMOLOGIA VISION TESTER",
        nomenclatura: "OFTALMOLOGIA VISION TESTER",
        tablaArchivo: "oftalmologia2021",
        urlInfo: "/api/v01/ct/agudezaVisual/obtenerReporteEvaluacionOftalmologica",
        esArchivo: true,
    },

    PSICOSENSOMETRICO_CERT_ALTURA: {
        nombre: "CERT. ALTURA ARCHIVO EXTERNO",
        tabla: "PSICOSENSOMETRICO CERT-ALTURA",
        nomenclatura: "PSICOSENSOMETRICO CERT-ALTURA",
        tablaArchivo: "b_certificado_altura",
        urlInfo: "/api/v01/ct/certificadoTrabajoAltura/obtenerReporteCertificadoTrabajoAltura",
        esArchivo: true,
    },

    PSICOSENSOMETRICO_CERT_ALTURA_PODEROSA: {
        nombre: "CERT. ALTURA PODEROSA ARCHIVO EXTERNO",
        tabla: "PSICOSENSOMETRICO ALTU-POD",
        nomenclatura: "PSICOSENSOMETRICO ALTU-POD",
        tablaArchivo: "certificado_altura_poderosa",
        urlInfo: "/api/v01/ct/certificadoTrabajoAltura/obtenerReporteCertificadoTrabajoAlturaPoderosa",
        esArchivo: true,
    },

    PSICOSENSOMETRICO_CERT_ALTURA_1_8: {
        nombre: "ALTURA 1.8 ARCHIVO EXTERNO",
        tabla: "PSICOSENSOMETRICO ALTURA 1-8",
        nomenclatura: "PSICOSENSOMETRICO ALTURA 1-8",
        tablaArchivo: "certificacion_medica_altura",
        urlInfo: "/api/v01/ct/certificacionMedicinaAltura/obtenerReporteCertificacionMedicinaAltura",
        esArchivo: true,
    },

    PSICOSENSOMETRICO_VEHI_FOLIO: {
        nombre: "PSICOSENSOMETRICO CONDUCCION ARCHIVO EXTERNO",
        tabla: "PSICOSENSOMETRICO VEHI-FOLIO",
        nomenclatura: "PSICOSENSOMETRICO VEHI-FOLIO",
        tablaArchivo: "b_certificado_conduccion",
        urlInfo: "/api/v01/ct/certificadoConduccion/obtenerReporteCertificadoConduccion",
        esArchivo: true,
    },

    RADIOGRAFIA_COLUMNA_ARCHIVO: {
        nombre: "INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA) ARCHIVO",
        tabla: "INFORME RADIOGRAFICO",
        nomenclatura: "INFORME RADIOGRAFICO",
        esArchivo: true,
    },

    RADIOGRAFIA_COLUMNA_ARCHIVO2: {
        nombre: "INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA) ARCHIVO 2",
        tabla: "INFORME RADIOGRAFICO 2",
        nomenclatura: "INFORME RADIOGRAFICO 2",
        esArchivo: true,
    },

    RAYOS_X_TORAX_ARCHIVO: {
        nombre: "RAYOS X TORAX ARCHIVO",
        tabla: "RAYOS X TORAX",
        nomenclatura: "RAYOS X TORAX",
        esArchivo: true,
    },

    /* =========================
       LABORATORIO
    ========================= */
    HEMOGRAMA: {
        nombre: "HEMOGRAMA",
        tabla: "hemograma_autom",
        url: "/api/v01/ct/laboratorio/obtenerReporteLabHematograma",
        esJasper: true,
    },

    ACIDO_URICO: {//NUEVO Gr
        nombre: "ACIDO URICO",
        tabla: "ac_bioquimica2022",
        url: "/api/v01/ct/analisisBioquimico/obtenerReporteAcidoUrico",
        esJasper: true,
    },

    GONADOTROPINA: {
        nombre: "INMUNOLOGIA - GONADOTROPINA",
        tabla: "lgonadotropina",
        url: "/api/v01/ct/inmunologia/obtenerReporteLgonadotropina",
    },

    INMUNOLOGIA_BK_KOH: {
        nombre: "INMUNOLOGIA BK-KOH",
        tabla: "microbiologia",
        url: "/api/v01/ct/inmunologia/obtenerReporteMicrobiologia",
        esJasper: true,
    },

    
    INMUNLOGIA_AGLUTINACIONES: {
        nombre: "INMUNOLOGIA - AGLUTINACIONES",
        tabla: "inmunologia",
        url: "/api/v01/ct/inmunologia/obtenerReporteInmunologia",
        esJasper: true,
    },

    INMUNOLOGIA_HEPATITIS: {
        nombre: "INMUNOLOGIA - HEPATITIS",
        tabla: "lhepatitis",
        url: "/api/v01/ct/inmunologia/obtenerReporteHepatitis",
        esJasper: true,
    },

    INMUNOLOGIA_VRL: {
        nombre: "INMUNOLOGIA - VRL",
        tabla: "inmunologia_vdrl",
        url: "/api/v01/ct/inmunologia/obtenerReporteVdrl",
        esJasper: true,
    },
 

    PANEL_2D: {
        nombre: "PANEL 2D",
        tabla: "panel2d",
        url: "/api/v01/ct/toxicologia/obtenerReportePanel2D",
        esJasper: true,
    },	

    PANEL_3D: {
        nombre: "PANEL 3D",
        tabla: "panel3d",
        url: "/api/v01/ct/toxicologia/obtenerReportePanel3D",
        esJasper: true,
    },

    PANEL_4D: {
        nombre: "PANEL 4D",
        tabla: "panel4d",
        url: "/api/v01/ct/toxicologia/obtenerReportePanel4D",
        esJasper: true,
    },

   PANEL_10D: {
        nombre: "PANEL 10D",
        tabla: "panel10d",
        url: "/api/v01/ct/toxicologia/obtenerReportePanel10D",
        esJasper: true,
    },


    CONSENT_PANEL_3D: {
        nombre: "CONSENTIMIENTO PANEL 3D",
        tabla: "con_panel3D",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },

    CONSENT_PANEL_4D: {
        nombre: "CONSENTIMIENTO PANEL 4D",
        tabla: "con_panel4D",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },

    CONSENT_PANEL_10D: {
        nombre: "CONSENTIMIENTO PANEL 10D",
        tabla: "con_panel10D",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },

    CONSENT_MARIHUANA:{
        nombre: "CONSENTIMIENTO DE MARIHUANA",
        tabla: "consent_marihuana",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },

    MANIPULADORES_COPROCULTIVO: {
        nombre: "MANIPULADORES COPROCULTIVO",
        tabla: "ac_coprocultivo",
        url: "/api/v01/ct/manipuladores/obtenerReporteCoprocultivo",
        esJasper: true,
    },

    MANIPULADORES_PARASITOLOGIA:{
        nombre: "MANIPULADORES PARASITOLOGIA",
        tabla: "ac_coproparasitologico",
        url: "/api/v01/ct/manipuladores/obtenerReporteCoproparasitologico",
        esJasper: true,
    },
    LABORATORIO_CLINICO: {
        nombre: "LABORATORIO CLINICO",
        tabla: "lab_clinico",
        url: "/api/v01/ct/laboratorio/obtenerReporteLaboratorioClinico",
    },

    PANEL_5D: {
        nombre: "PANEL 5D",
        tabla: "toxicologia",
        url: "/api/v01/ct/toxicologia/obtenerReportePanel5D",
        esJasper: true,
    },

    PERFIL_HEPATICO: {
        nombre: "ANALISIS BIOQUIMICOS - PERFIL HEPÁTICO",
        tabla: "perfil_hepatico",
        url: "/api/v01/ct/analisisBioquimico/obtenerReportePerfilHepatico",
    },

    PERFIL_LIPIDICO: {
        nombre: "ANALISIS BIOQUIMICOS - PERFIL LIPIDICO",
        tabla: "analisis_bioquimicos",
        url: "/api/v01/ct/laboratorio/reporteAnalisisBioquimico",
    },

    PERFIL_RENAL: {
        nombre: "ANALISIS BIOQUIMICOS - PERFIL RENAL",
        tabla: "l_bioquimica",
        url: "/api/v01/ct/analisisBioquimico/obtenerReportePerfilRenal",
    },

    /* =========================
       CONSENTIMIENTOS
    ========================= */
    CONSENT_BUENA_SALUD: {
        nombre: "CONSENTIMIENTO BUENA SALUD",
        tabla: "consentimientobuenasalud",
        url: "/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoBuenaSalud",
        esJasper: true
    },

    CONSENT_DECLARACION_APTITUD: {
        nombre: "DECLARACIÓN JURADA DE INFORMACION APTITUD MEDICO OCUPACIONAL",
        tabla: "DECLA_INFO_APTITUD_MO",
        url: "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision",
        esJasper: true
    },

    CONSENT_DROGAS_BOROO: {
        nombre: "CONSENTIMIENTO DROGAS BOROO",
        tabla: "consent_Boro",
        url: "/api/v01/ct/laboratorio/consentimientoLaboratorioBoro",
        nameConset: true,
    },

    CONSENT_INFORMADO_EVALUACION_MEDICA: {
        nombre: "CONSENTIMIENTO INFORMADO DE EVALUACION MEDICA",
        tabla: "CONSENT_INFORMADO_MEDICA",
        url: "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision",
        esJasper: true
    },

    CONSENT_MARIHUANA: {
        nombre: "CONSENTIMIENTO DE MARIHUANA",
        tabla: "consent_marihuana",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },

    CONSENT_MUESTRA_SANGRE: {
        nombre: "CONSENTIMIENTO DE MUESTRA DE SANGRE",
        tabla: "consent_Muestra_Sangre",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },

    CONSENT_PANEL_2D: {
        nombre: "CONSENTIMIENTO PANEL 2D",
        tabla: "con_panel2D",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },

    CONSENT_PANEL_5D: {
        nombre: "CONSENTIMIENTO PANEL 5D",
        tabla: "con_panel5D",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },

    CONSENT_SINTOMATICO_RESPIRATORIO: {
        nombre: "DECLARACION DE SINTOMATICO RESPIRATORIO",
        tabla: "CONSENT_SINTOMATICO",
        url: "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision",
        esJasper: true
    },

    CONSENTIMIENTO_INFORMADO_EXAMEN_MEDICO_OCUPACIONAL: {
        nombre: "CONSENTIMIENTO INFORMADO EXAMEN MEDICO OCUPACIONAL",
        tabla: "consentimientoInformado",
        url: "/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoInformado"
    },

    DECLARACION_JURADA_ANTECEDENTES: {
        nombre: "DECLARACION JURADA DE ANTECEDENTES PATOLOGICOS Y FAMILIARES",
        tabla: "DECLA_JURA_ANTECE_PERSON_FAM",
        url: "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision",
        esJasper: true
    },

    /* =========================
       EXÁMENES MÉDICOS
    ========================= */
    AUDIOMETRIA_OHLA: {
        nombre: "FICHA AUDIOLOGICA OHLA",
        tabla: "audiometria_po",
        url: "/api/v01/ct/audiometria/obtenerReporteAudiometriaM",
    },

    CUESTIONARIO_AUDIOMETRIA: {
        nombre: "CUESTIONARIO AUDIOMETRIA",
        tabla: "cuestionario_audiometria",
        url: "/api/v01/ct/audiometria/obtenerReporteCuestionarioAudiometria",
    },

    ELECTROCARDIOGRAMA: {
        nombre: "ELECTROCARDIOGRAMA",
        tabla: "informe_electrocardiograma",
        url: "/api/v01/ct/electroCardiograma/obtenerReporteInformeElectroCardiograma",
        esJasper: true,
    },

    FICHA_AUDIOMETRIA: {
        nombre: "FICHA AUDIOMETRIA",
        tabla: "audiometria_2023",
        url: "/api/v01/ct/manipuladores/obtenerReporteAudiometria",
    },

    FICHA_OFTALMOLOGICA: {
        nombre: "FICHA OFTALMOLOGICA",
        tabla: "oftalmologia",
        url: "/api/v01/ct/agudezaVisual/obtenerReporteOftalmologia"
    },

    ODONTOGRAMA: {
        nombre: "ODONTROGRAMA",
        tabla: "odontograma",
        url: "/api/v01/ct/odontograma/obtenerReporteOdontograma",
    },

    OFTALMOLOGIA: {
        nombre: "OFTALMOLOGIA",
        tabla: "oftalmologia2021",
        url: "/api/v01/ct/agudezaVisual/obtenerReporteEvaluacionOftalmologica",
    },

    OIT: {
        nombre: "OIT",
        tabla: "oit",
        url: "/api/v01/ct/oit/obtenerReporteOit",
    },

    RADIOGRAFIA_COLUMNA: {
        nombre: "INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA)",
        tabla: "radiografia",
        url: "/api/v01/ct/rayosX/obtenerReporteInformeRadiografico",
    },

    RADIOGRAFIA_TORAX: {
        nombre: "RADIOGRAFIA TORAX",
        tabla: "radiografia_torax",
        url: "/api/v01/ct/rayosX/obtenerReporteRadiografiaTorax",
    },

    TEST_FATIGA_SOMNOLENCIA: {
        nombre: "TEST FATIGA Y SOMNOLENCIA",
        tabla: "test_fatiga_somnolencia",
        url: "/api/v01/ct/testFatigaSomnolencia/obtenerReporteTestFatigaSomnolencia",
    },

    ALTURA1PUNTO8: {
        nombre: "ALTURA 1.8",
        tabla: "certificacion_medica_altura",
        url: "/api/v01/ct/certificacionMedicinaAltura/obtenerReporteCertificacionMedicinaAltura",
        esJasper: true,
    },

    /* =========================
       PSICOLOGÍA
    ========================= */
    CUESTIONARIO_BERLIN: {
        nombre: "CUESTIONARIO BERLIN",
        tabla: "cuestionario_berlin",
        url: "/api/v01/ct/cuestionarioBerlin/obtenerReporte",
        esJasper: true
    },

    ESPACIOS_CONFINADOS_PSICOLOGIA: {
        nombre: "ESPACIOS CONFINADOS PSICOLOGIA",
        tabla: "psicologia_espacios_confinados",
        url: "/api/v01/ct/psicologiaEspaciosConfinados/obtenerReportePsicologiaEspaciosConfinados",
        esJasper: true
    },

    ESTRES_FATIGA_SOMNOLENCIA_PSICOLOGIA: {
        nombre: "TEST DE ESTRES FATIGA Y SOMNOLENCIA PSICOLOGIA",
        tabla: "informe_psicologico_estres",
        url: "/api/v01/ct/informePsicologicoAdeco/obtenerReporteInformePsicologicoAdeco",
        esJasper: true
    },

    EXAMENES_COMPLEMENTARIOS: {
        nombre: "EXAMENES COMPLEMENTARIOS",
        tabla: "exam_complementarios",
        url: "/api/v01/ct/examenComplementario/obtenerReporte",
        esJasper: true
    },

    INFORME_PODEROSA_OPERAR: {
        nombre: "INFORME PSICOLOGICO DE PODEROSA LICENCIA PARA OPERAR - NORMAL",
        tabla: "evaluacion_psicologica_poderosa_normal",
        url: "/api/v01/ct/evaluacionPsicologicaPoderosa/obtenerReporteEvaluacionPsicologicaPoderosa",
        esJasper: true,
    },

    INFORME_PODEROSA_OPERAR_LICENCIA: {
        nombre: "INFORME PSICOLOGICO DE PODEROSA LICENCIA PARA OPERAR - LICENCIA",
        tabla: "evaluacion_psicologica_poderosa_licencia",
        url: "/api/v01/ct/evaluacionPsicologicaPoderosa/obtenerReporteEvaluacionPsicologicaPoderosa",
        esJasper: true,
    },

    INFORME_PODEROSA_OPERAR_CALIENTE: {
        nombre: "INFORME PSICOLOGICO DE PODEROSA LICENCIA PARA OPERAR - CALIENTE",
        tabla: "evaluacion_psicologica_poderosa_caliente",
        url: "/api/v01/ct/evaluacionPsicologicaPoderosa/obtenerReporteEvaluacionPsicologicaPoderosa",
        esJasper: true,
    },

    INFORME_PSICOLOGIA_FOBIAS: {
        nombre: "INFORME PSICOLOGIA FOBIAS",
        tabla: "fobias",
        url: "/api/v01/ct/fobias/obtenerReporte",
        esJasper: true,
    },

    INFORME_PSICOLABORAL: {
        nombre: "INFORME PSICOLABORAL",
        tabla: "informe_psicolaboral",
        url: "/api/v01/ct/informePsicolaboral/obtenerReporteInformePsicolaboral",
        esJasper: true,
    },

    INFORME_PSICOLOGICO: {
        nombre: "INFORME PSICOLOGICO",
        tabla: "informe_psicologico",
        url: "/api/v01/ct/informePsicologico/obtenerReporteInformePsicologico",
        esJasper: true,
    },

    PSICOLOGIA_ANEXO_02: {
        nombre: "PSICOLOGIA ANEXO 02",
        tabla: "ficha_psicologica_anexo02",
        url: "/api/v01/ct/psicologia/obtenerFichaPsicologiaAnexo02",
        esJasper: true,
    },

    PSICOLOGIA_ANEXO_03: {
        nombre: "PSICOLOGIA ANEXO 03",
        tabla: "ficha_psicologica_anexo03",
        url: "/api/v01/ct/psicologia/obtenerFichaPsicologiaAnexo03",
        esJasper: true,
    },

    TRABAJO_ALTURA_PSICO: {
        nombre: "TRABAJO EN ALTURA PSICOLOGIA",
        tabla: "psicologiafobias",
        url: "/api/v01/ct/informePsicologicoFobias/obtenerReporteInformePsicologicoFobias",
        esJasper: true,
    },

    TRABAJO_ESPECIFICOS: {
        nombre: "TRABAJOS EN ESPECIFICOS",
        tabla: "especificos",
        url: "/api/v01/ct/trabajoEspecifico/obtenerReporteTrabajosEspecificos",
        esJasper: true,
    },

    CALIDADSUEÑO: {
        nombre: "CALIDAD DE SUEÑO",
        tabla: "calidad_sueño",
        url: "/api/v01/ct/cuestionarioCalidadSueno/obtenerReporteCalidadSueno",
        esJasper: true,
    },
};


const EXAMEN_DEFAULT = {
    resultado: false,
    imprimir: false,
    esJasper: false,
    nameConset: false,
};

const buildExamen = (config) => ({
    ...EXAMEN_DEFAULT,
    ...config,
});

export const buildExamenesList = (orden) =>
    orden.map((key) => {
        const config = EXAMENES_CATALOGO[key];
        if (!config) {
            console.warn(`⚠️ Examen no registrado en catálogo: ${key}`);
            return null;
        }
        return buildExamen(config);
    }).filter(Boolean);
