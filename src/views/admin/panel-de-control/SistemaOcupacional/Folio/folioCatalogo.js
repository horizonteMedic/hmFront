export const EXAMENES_CATALOGO = {
    /* =========================
       GENERALES / BASE
    ========================= */
    RESUMEN_MEDICO_PODEROSA: {
        nombre: "RESUMEN MEDICO PODEROSA",
        tabla: "resumen_medico_poderosa",
        url: "/api/v01/ct/anexos/obtenerReporteResumenMedico",
    },

    CONSTANCIA_EXAMEN_MEDICO_OCUPACIONAL: {
        nombre: "CONSTANCIA DE EXAMEN MEDICO OCUPACIONAL",
        tabla: "certificado_aptitud_medico_resumen",
        url: "/api/v01/ct/certificadoAptitudMedicoOcupacional/obtenerReporteCertificadoMedicoOcupacional",
        esJasper: true,
    },

    CERTIFICADO_APTITUD_ANEXO_16: {
        nombre: "CERTIFICADO DE APTITUD ANEXO 16",
        tabla: "certificado_aptitud_medico_ocupacional",
        url: "/api/v01/ct/anexos/fichaAnexo16/obtenerReporteFichaAnexo16",
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

    ANEXO_02: {
        nombre: "ANEXO 02",
        tabla: "anexo_agroindustrial",
        url: "/api/v01/ct/anexos/anexo2/obtenerReporteAnexo2Completo",
        esJasper: true,
    },

    CERTIFICADO_ANEXO_02: {
        nombre: "CERTIFICADO MEDICO OCUPACIONAL ANEXO 02",
        tabla: "aptitud_medico_ocupacional_agro",
        url: "/api/v01/ct/anexos/fichaAnexo2/obtenerReporteFichaAnexo2",
        esJasper: true,
    },

    ANTECEDENTES_PATOLOGICOS: {
        nombre: "ANTECEDENTES PATOLOGICOS",
        tabla: "antecedentes_patologicos",
        url: "/api/v01/ct/antecedentesPatologicos/obtenerReporteAntecedentesPatologicos",
        esJasper: true
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
        nombre: "CERTIFICADO APTITUD ALTURA PODEROSA",
        tabla: "aptitud_altura_poderosa",
        url: "/api/v01/ct/aptitudAltura/obtenerReporteAptitudAlturaPoderosa",
        esJasper: true,
    },
    ENFERMEDADES_ALTURA: {
        nombre: "ENFERMEDADES EN ALTURA",
        tabla: "antece_enfermedades_altura",
        url: "/api/v01/ct/antecedentesEnfermedadesAltura/obtenerReporteAntecedentesEnfermedadesAltura"
    },
    CERTIFICADO_VEHICULOS: {
        nombre: "CERTIFICADO VEHICULOS",
        tabla: "b_certificado_conduccion",
        url: "/api/v01/ct/certificadoConduccion/obtenerReporteCertificadoConduccion",
        esJasper: true,
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

    HISTORIA_OCUPACIONAL: {
        nombre: "HISTORIA OCUPACIONAL",
        tabla: "historia_oc_info",
        url: "/api/v01/ct/historiaOcupacional/obtenerReporteHistoriaOcupacional"
    },

    FICHA_SAS: {
        nombre: "FICHA SAS",
        tabla: "ficha_sas",
        url: "/api/v01/ct/fichaApneaSueno/obtenerReporteFichaSas",
        esJasper: true
    },
    /* =========================
       ARCHIVOS EXTERNOS
    ========================= */
    OFTALMOLOGIA_VISION_TESTER: {
        nombre: "OFTALMOLOGIA VISION TESTER",
        tabla: "OFTALMOLOGIA VISION TESTER",
        nomenclatura: "OFTALMOLOGIA VISION TESTER",
    },

    PSICOSENSOMETRICO: {
        nombre: "PSICOSENSOMETRICO VEHI-FOLIO",
        tabla: "PSICOSENSOMETRICO VEHI-FOLIO",
        nomenclatura: "PSICOSENSOMETRICO VEHI-FOLIO",
    },

    RAYOS_X_TORAX_ARCHIVO: {
        nombre: "RAYOS X TORAX ARCHIVO",
        tabla: "RAYOS X TORAX",
        nomenclatura: "RAYOS X TORAX",
    },

    RADIOGRAFIA_COLUMNA_ARCHIVO: {
        nombre: "INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA) ARCHIVO",
        tabla: "INFORME RADIOGRAFICO",
        nomenclatura: "INFORME RADIOGRAFICO",
    },

    ELECTROCARDIOGRAMA_ARCHIVO: {
        nombre: "ELECTROCARDIOGRAMA ARCHIVO",
        tabla: "ELECTROCARDIOGRAMA",
        nomenclatura: "ELECTROCARDIOGRAMA",
    },

    DECLARACION_USO_FIRMA_ARCHIVO: {
        nombre: "DECLARACION USO FIRMA",
        tabla: "DECLARACION USO FIRMA",
        nomenclatura: "DECLARACION USO FIRMA",
    },

    ESPIROMETRIA_ARCHIVO: {
        nombre: "ESPIROMETRIA",
        tabla: "ESPIROMETRIA",
        nomenclatura: "ESPIROMETRIA",
    },

    INTERCONSULTAS: {
        nombre: "INTERCONSULTAS",
        tabla: "",
        url: "",
    },

    /* =========================
       LABORATORIO
    ========================= */
    LABORATORIO_CLINICO: {
        nombre: "LABORATORIO CLINICO",
        tabla: "lab_clinico",
        url: "/api/v01/ct/laboratorio/obtenerReporteLaboratorioClinico",
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

    PERFIL_HEPATICO: {
        nombre: "ANALISIS BIOQUIMICOS - PERFIL HEPÁTICO",
        tabla: "perfil_hepatico",
        url: "/api/v01/ct/analisisBioquimico/obtenerReportePerfilHepatico",
    },

    GONADOTROPINA: {
        nombre: "INMUNOLOGIA - GENODOTROPINA",
        tabla: "lgonadotropina",
        url: "/api/v01/ct/inmunologia/obtenerReporteLgonadotropina",
    },

    PANEL_5D: {
        nombre: "PANEL 5D",
        tabla: "toxicologia",
        url: "/api/v01/ct/toxicologia/obtenerReportePanel5D",
        esJasper: true,
    },

    /* =========================
       CONSENTIMIENTOS
    ========================= */
    CONSENT_MUESTRA_SANGRE: {
        nombre: "CONSENTIMIENTO DE MUESTRA DE SANGRE",
        tabla: "consent_Muestra_Sangre",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },

    CONSENT_PANEL_5D: {
        nombre: "CONSENTIMIENTO PANEL 5D",
        tabla: "con_panel5D",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },

    CONSENT_MARIHUANA: {
        nombre: "CONSENTIMIENTO DE MARIHUANA",
        tabla: "consent_marihuana",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },

    CONSENT_PANEL_2D: {
        nombre: "CONSENTIMIENTO PANEL 2D",
        tabla: "con_panel2D",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },

    CONSENT_BORO: {
        nombre: "CONSENTIMIENTO DROGAS BOROO",
        tabla: "consent_Boro",
        url: "/api/v01/ct/laboratorio/consentimientoLaboratorioBoro",
        nameConset: true,
    },

    CONSENTIMIENTO_INFORMADO: {
        nombre: "CONSENTIMIENTO INFORMADO ",
        tabla: "consentimientoInformado",
        url: "/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoInformado"
    },

    DECLARACION_JURADA_ANTECEDENTES: {
        nombre: "DECLARACION JURADA DE ANTECEDENTES PATOLOGICOS Y FAMILIARES",//NUEVO OPTIMIZAR //11 REVISAR Declaración Jurada de Antecedentes Personales
        tabla: "DECLA_JURA_ANTECE_PERSON_FAM",
        url: "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision",
        esJasper: true
    },

    CONSENT_DECLARACION_APTITUD: {
        nombre: "CONSENTIMIENTO DECLARACIÓN DE INFORMACION APTITUD MEDICO OCUPACIONAL",
        tabla: "DECLA_INFO_APTITUD_MO",
        url: "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision",
        esJasper: true
    },

    /* =========================
       EXÁMENES MÉDICOS
    ========================= */
    OIT: {
        nombre: "OIT",
        tabla: "oit",
        url: "/api/v01/ct/oit/obtenerReporteOit",
    },

    OFTALMOLOGIA: {
        nombre: "OFTALMOLOGIA",
        tabla: "oftalmologia2021",
        url: "/api/v01/ct/agudezaVisual/obtenerReporteEvaluacionOftalmologica",
    },

    RADIOGRAFIA_TORAX: {
        nombre: "RADIOGRAFIA TORAX",
        tabla: "radiografia_torax",
        url: "/api/v01/ct/rayosX/obtenerReporteRadiografiaTorax",
    },

    RADIOGRAFIA_COLUMNA: {
        nombre: "INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA)",
        tabla: "radiografia",
        url: "/api/v01/ct/rayosX/obtenerReporteInformeRadiografico",
    },

    ELECTROCARDIOGRAMA: {
        nombre: "ELECTROCARDIOGRAMA",
        tabla: "informe_electrocardiograma",
        url: "/api/v01/ct/electroCardiograma/obtenerReporteInformeElectroCardiograma",
        esJasper: true,
    },

    AUDIOMETRIA_OHLA: {
        nombre: "FICHA AUDIOLOGICA OHLA",
        tabla: "audiometria_po",
        url: "/api/v01/ct/audiometria/obtenerReporteAudiometriaM",
    },

    AUDIOMETRIA_2023: {
        nombre: "FICHA AUDIOMETRIA",
        tabla: "audiometria_2023",
        url: "/api/v01/ct/manipuladores/obtenerReporteAudiometria",
    },

    CUESTIONARIO_AUDIOMETRIA: {
        nombre: "CUESTIONARIO AUDIOMETRIA",
        tabla: "cuestionario_audiometria",
        url: "/api/v01/ct/audiometria/obtenerReporteCuestionarioAudiometria",
    },

    ODONTOGRAMA: {
        nombre: "ODONTROGRAMA",
        tabla: "odontograma",
        url: "/api/v01/ct/odontograma/obtenerReporteOdontograma",
    },

    /* =========================
       PSICOLOGÍA
    ========================= */
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

    INFORME_PSICOLOGICO: {
        nombre: "INFORME PSICOLOGICO",
        tabla: "informe_psicologico",
        url: "/api/v01/ct/informePsicologico/obtenerReporteInformePsicologico",
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

    INFORME_PODEROSA_OPERAR: {
        nombre: "INFORME PSICOLOGICO DE PODEROSA LICENCIA PARA OPERAR",
        tabla: "evaluacion_psicologica_poderosa",
        url: "/api/v01/ct/evaluacionPsicologicaPoderosa/obtenerReporteEvaluacionPsicologicaPoderosa",
        esJasper: true,
    },

    TRABAJO_ESPECIFICOS: {
        nombre: "TRABAJOS EN ESPECIFICOS",
        tabla: "especificos",
        url: "/api/v01/ct/trabajoEspecifico/obtenerReporteTrabajosEspecificos",
        esJasper: true,
    },

    TRABAJO_ALTURA_PSICO: {
        nombre: "TRABAJO EN ALTURA PSICOLOGIA",
        tabla: "psicologiafobias",
        url: "/api/v01/ct/informePsicologicoFobias/obtenerReporteInformePsicologicoFobias",
        esJasper: true,
    },

    TEST_FATIGA_SOMNOLENCIA: {
        nombre: "TEST DE FATIGA Y SOMNOLENCIA",
        tabla: "informe_psicologico_estres",
        url: "/api/v01/ct/informePsicologicoAdeco/obtenerReporteInformePsicologicoAdeco",
        esJasper: true,
    },

    CUESTIONARIO_BERLIN: {
        nombre: "CUESTIONARIO BERLIN",
        tabla: "cuestionario_berlin",
        url: "/api/v01/ct/cuestionarioBerlin/obtenerReporte",
        esJasper: true
    },

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
    }




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
