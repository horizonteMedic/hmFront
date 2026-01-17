// const ExamenesList = [
//     {
//         nombre: "RESUMEN MEDICO PODEROSA", //NUEVO OPTIMIZAR   //1 CORRECTO Resumen Médico
//         resultado: false,
//         tabla: "resumen_medico_poderosa",
//         url: "/api/v01/ct/anexos/obtenerReporteResumenMedico",
//     },
//     {
//         nombre: "CONSTANCIA DE EXAMEN MEDICO OCUPACIONAL",  //2 CORRECTO Constancia de Examen Médico Ocupacional
//         resultado: false,
//         tabla: "certificado_aptitud_medico_resumen",
//         url: "/api/v01/ct/certificadoAptitudMedicoOcupacional/obtenerReporteCertificadoMedicoOcupacional",
//         esJasper: true
//     },
//     {
//         nombre: "ANEXO 16", //3 CORRECTO Anexo 16 
//         resultado: false,
//         tabla: "anexo7c",
//         url: "/api/v01/ct/anexos/anexo16/obtenerReporteAnexo16"
//     },
//     {
//         nombre: "CERTIFICADO ALTURA",  //4 CORRECTO Ficha Certificado de Trabajos de Altura
//         resultado: false,
//         tabla: "b_certificado_altura",
//         url: "/api/v01/ct/certificadoTrabajoAltura/obtenerReporteCertificadoTrabajoAltura",
//         esJasper: true
//     },
//     {
//         // Solo si tiene ficha certificado de trabajos de altura
//         //(Si hay psicosensométrico y test de altura, se colocará el psicosensométrico donde va el test de altura)
//         nombre: "OFTALMOLOGIA VISION TESTER", //NUEVO ARCHIVO   //5 REVISAR  Test de Altura (Visual)
//         resultado: false,
//         tabla: "OFTALMOLOGIA VISION TESTER",
//         nomenclatura: "OFTALMOLOGIA VISION TESTER"
//     },
//     {
//         nombre: "CERTIFICADO VEHICULOS", //6 CORRECTO Ficha Conducción de Vehículos
//         resultado: false,
//         tabla: "b_certificado_conduccion",
//         url: "/api/v01/ct/certificadoConduccion/obtenerReporteCertificadoConduccion",
//         esJasper: true
//     },
//     {
//         //Solo si tiene ficha de conducción de vehículos
//         nombre: "FICHA SAS", //7 CORRECTO Ficha SAS
//         resultado: false,
//         tabla: "ficha_sas",
//         url: "/api/v01/ct/fichaApneaSueno/obtenerReporteFichaSas",
//         esJasper: true
//     },
//     {  //Solo si tiene ficha de conducción de vehículos
//         nombre: "PSICOSENSOMETRICO VEHI-FOLIO",//NUEVO ARCHIVO //8 REVISAR  Psicosensométrico
//         resultado: false,
//         tabla: "PSICOSENSOMETRICO VEHI-FOLIO",
//         nomenclatura: "PSICOSENSOMETRICO VEHI-FOLIO",
//     },
//     {
//         nombre: "HISTORIA OCUPACIONAL", //9 CORRECTO  Historia Ocupacional
//         resultado: false,
//         tabla: "historia_oc_info",
//         url: "/api/v01/ct/historiaOcupacional/obtenerReporteHistoriaOcupacional"
//     },
//     {
//         nombre: "ANTECEDENTES PATOLOGICOS", //10 CORRECTO  Antecedentes Patológicos
//         resultado: false,
//         tabla: "antecedentes_patologicos",
//         url: "/api/v01/ct/antecedentesPatologicos/obtenerReporteAntecedentesPatologicos",
//         esJasper: true
//     },
//     {
//         nombre: "DECLARACION JURADA DE ANTECEDENTES PATOLOGICOS Y FAMILIARES",//NUEVO OPTIMIZAR //11 REVISAR Declaración Jurada de Antecedentes Personales
//         resultado: false,
//         tabla: "DECLA_JURA_ANTECE_PERSON_FAM",
//         url: "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision",
//         esJasper: true
//     },
//     {
//         nombre: "CUESTIONARIO NORDICO", //12 CORRECTO Cuestionario Nórdico
//         resultado: false,
//         tabla: "cuestionario_nordico",
//         url: "/api/v01/ct/cuestionarioNordico/obtenerReporteCuestionarioNordico"
//     },
//     {
//         nombre: "EVALUACION MUSCULO ESQUELETICA",//13 CORRECTO Cuestionario Nórdico
//         resultado: false,
//         tabla: "evaluacion_musculo_esqueletica",
//         url: "/api/v01/ct/evaluacionMusculoEsqueletica/obtenerReporteEvaluacionMusculoEsqueletica"
//     },
//     {
//         nombre: "CONSENTIMIENTO DE MUESTRA DE SANGRE",//NUEVO OPTIMIZAR   //14 CORRECTO Consentimientos – Muestra de Sangre
//         resultado: false,
//         tabla: "consent_Muestra_Sangre",
//         url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
//         nameConset: true
//     },
//     {
//         nombre: "LABORATORIO CLINICO", //15 CORRECTO Laboratorio Clínico – Hematología Bioquímica
//         resultado: false,
//         tabla: "lab_clinico",
//         url: "/api/v01/ct/laboratorio/obtenerReporteLaboratorioClinico"
//     },
//     {
//         nombre: "ANALISIS BIOQUIMICOS - PERFIL LIPIDICO", //16 CORRECTO Análisis Bioquímico – Perfil Lipídico
//         resultado: false,
//         tabla: "analisis_bioquimicos",
//         url: "/api/v01/ct/laboratorio/reporteAnalisisBioquimico"
//     },
//     {
//         nombre: "INMUNOLOGIA - GENODOTROPINA",//NUEVO OPTIMIZAR //17 CORRECTO Gonadotropina
//         resultado: false,
//         tabla: "lgonadotropina",
//         url: "/api/v01/ct/inmunologia/obtenerReporteLgonadotropina",
//     },
//     {
//         nombre: "ANALISIS BIOQUIMICOS - PERFIL RENAL",//NUEVO OPTIMIZAR  //18 CORRECTO Análisis Bioquímico – Perfil Renal
//         resultado: false,
//         tabla: "l_bioquimica",
//         url: "/api/v01/ct/analisisBioquimico/obtenerReportePerfilRenal"
//     },
//     {
//         nombre: "ANALISIS BIOQUIMICOS - PERFIL HEPÁTICO",//NUEVO OPTIMIZAR  //19 CORRECTO Análisis Bioquímico – Perfil Hepático
//         resultado: false,
//         tabla: "perfil_hepatico",
//         url: "/api/v01/ct/analisisBioquimico/obtenerReportePerfilHepatico"
//     },
//     {
//         nombre: "CONSENTIMIENTO PANEL 5D",//NUEVO OPTIMIZAR //20 CORRECTO Consentimiento Panel 5D
//         resultado: false,
//         tabla: "con_panel5D",
//         url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
//         nameConset: true,
//     },
//     {
//         nombre: "OIT",//21 CORRECTO REVISAR Consentimiento Panel 5D
//         resultado: false,
//         tabla: "oit",
//         url: "/api/v01/ct/oit/obtenerReporteOit"
//     },
//     {
//         nombre: "RAYOS X TORAX ARCHIVO", //NUEVO ARCHIVO FALTA IMPRIMIR  //22 CORRECTO Radiografía de Tórax – Archivo
//         resultado: false,
//         tabla: "RAYOS X TORAX",
//         nomenclatura: "RAYOS X TORAX"
//     },
//     {
//         nombre: "INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA)", //NUEVO OPTIMIZAR //23 CORRECTO Radiografía de Columna
//         resultado: false,
//         tabla: "radiografia",
//         url: "/api/v01/ct/rayosX/obtenerReporteInformeRadiografico"
//     },
//     {
//         nombre: "INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA) ARCHIVO", //NUEVO ARCHIVO FALTA IMPRIMIR //24 CORRECTO Radiografía de Columna – Archivo
//         resultado: false,
//         tabla: "INFORME RADIOGRAFICO",
//         nomenclatura: "INFORME RADIOGRAFICO"
//     },
//     {
//         nombre: "ELECTROCARDIOGRAMA", //25 CORRECTO EKG
//         resultado: false,
//         tabla: "informe_electrocardiograma",
//         url: "/api/v01/ct/electroCardiograma/obtenerReporteInformeElectroCardiograma",
//         esJasper: true
//     },
//     {
//         nombre: "ESPIROMETRIA",  //26 CORRECTO Espirometría – Archivo
//         resultado: false,
//         tabla: "ESPIROMETRIA",
//         nomenclatura: "ESPIROMETRIA"
//     },
//     {
//         nombre: "FICHA AUDIOLOGICA OHLA", //27 CORRECTO  Audiometría OHLA
//         resultado: false,
//         tabla: "audiometria_po",
//         url: "/api/v01/ct/audiometria/obtenerReporteAudiometriaM"
//     },
//     { //REENCUADRE JEAN
//         nombre: "ODONTROGRAMA", //NUEVO OPTIMIZAR //28 CORRECTO Odontología
//         resultado: false,
//         tabla: "odontograma",
//         url: "/api/v01/ct/odontograma/obtenerReporteOdontograma"
//     },
//     {
//         nombre: "PSICOLOGIA ANEXO 02", //NUEVO OPTIMIZAR //29 CORRECTO Informe Psicológico Ocupacional – Anexo 2
//         resultado: false,
//         tabla: "ficha_psicologica_anexo02",
//         url: "/api/v01/ct/psicologia/obtenerFichaPsicologiaAnexo02",
//         esJasper: true,
//     },
//     { //revisar con viviana si es este
//         nombre: "TEST DE FATIGA Y SOMNOLENCIA", //NUEVO OPTIMIZAR //30 CORRECTO Informe Psicológico de Estrés
//         resultado: false,
//         tabla: "informe_psicologico_estres",
//         url: "/api/v01/ct/informePsicologicoAdeco/obtenerReporteInformePsicologicoAdeco",
//         esJasper: true,
//     },
//     {
//         nombre: "CUESTIONARIO BERLIN", //31 CORRECTO  Informe Cuestionario Berlin
//         resultado: false,
//         tabla: "cuestionario_berlin",
//         url: "/api/v01/ct/cuestionarioBerlin/obtenerReporte",
//         esJasper: true
//     },
//     {
//         nombre: "INFORME PSICOLOGICO", //32 CORRECTO  Informe Psicológico / Exámenes Complementarios
//         resultado: false,
//         tabla: "informe_psicologico",
//         url: "/api/v01/ct/informePsicologico/obtenerReporteInformePsicologico",
//         esJasper: true
//     },
//     {
//         nombre: "TRABAJO EN ALTURA", //NUEVO OPTIMIZAR //33 CORRECTO  Informe Psicológico – Trabajo en Altura
//         resultado: false,
//         tabla: "psicologiafobias",
//         url: "/api/v01/ct/informePsicologicoFobias/obtenerReporteInformePsicologicoFobias",
//         esJasper: true
//     },
//     {
//         nombre: "OFTALMOLOGIA", //NUEVO OPTIMIZAR JEAN URGENTE //34 CORRECTO Oftalmología
//         resultado: false,
//         tabla: "oftalmologia2021",
//         url: "/api/v01/ct/agudezaVisual/obtenerReporteEvaluacionOftalmologica",
//     },
//     {
//         nombre: "CONSENTIMIENTO DECLARACIÓN DE INFORMACION APTITUD MEDICO OCUPACIONAL", //NUEVO OPTIMIZAR//35 CORRECTO Declaración de Información de Aptitud Médico Ocupacional 
//         resultado: false,
//         tabla: "DECLA_INFO_APTITUD_MO",
//         url: "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision",
//         esJasper: true
//     },
//     {
//         nombre: "DECLARACION USO FIRMA", //NUEVO ARCHIVO //36 CORRECTO Declaración Jurada para el Uso de Firma Electrónica archivo solo archivo
//         resultado: false,
//         tabla: "DECLARACION USO FIRMA",
//         nomenclatura: "DECLARACION USO FIRMA",
//     },
//     //37. ** Interconsultas **

// ];

// const ExamenesListCampana = [
//     {
//         nombre: "CERTIFICADO DE APTITUD ANEXO 16",
//         resultado: false,
//         tabla: "certificado_aptitud_medico_ocupacional",
//         url: "/api/v01/ct/anexos/fichaAnexo16/obtenerReporteFichaAnexo16",
//         esJasper: true
//     },
//     {
//         nombre: "ANEXO 16",
//         resultado: false,
//         tabla: "anexo7c",
//         url: "/api/v01/ct/anexos/anexo16/obtenerReporteAnexo16"
//     },
//     {
//         nombre: "ENFERMEDADES EN ALTURA",
//         resultado: false,
//         tabla: "antece_enfermedades_altura",
//         url: "/api/v01/ct/antecedentesEnfermedadesAltura/obtenerReporteAntecedentesEnfermedadesAltura"
//     },
//     {
//         nombre: "USO DE RESPIRADORES",
//         resultado: false,
//         tabla: "b_uso_respiradores",
//         url: "/api/v01/ct/respiradores/obtenerReporteRespiradores",
//         esJasper: true
//     },
//     {
//         nombre: "HISTORIA OCUPACIONAL",
//         resultado: false,
//         tabla: "historia_oc_info",
//         url: "/api/v01/ct/historiaOcupacional/obtenerReporteHistoriaOcupacional"
//     },
//     {
//         nombre: "ANTECEDENTES PATOLOGICOS",
//         resultado: false,
//         tabla: "antecedentes_patologicos",
//         url: "/api/v01/ct/antecedentesPatologicos/obtenerReporteAntecedentesPatologicos",
//         esJasper: true
//     },
//     {
//         nombre: "CUESTIONARIO NORDICO",
//         resultado: false,
//         tabla: "cuestionario_nordico",
//         url: "/api/v01/ct/cuestionarioNordico/obtenerReporteCuestionarioNordico"
//     },
//     {
//         nombre: "EVALUACION MUSCULO ESQUELETICA ",
//         resultado: false,
//         tabla: "evaluacion_musculo_esqueletica",
//         url: "/api/v01/ct/evaluacionMusculoEsqueletica/obtenerReporteEvaluacionMusculoEsqueletica"
//     },
//     {
//         nombre: "LABORATORIO CLINICO ",
//         resultado: false,
//         tabla: "lab_clinico",
//         url: "/api/v01/ct/laboratorio/obtenerReporteLaboratorioClinico"
//     },
//     {
//         nombre: "ANALISIS BIOQUIMICOS (PERFIL LIPIDICO) OPCIONAL EN ALGUNOS EXAMANES ",
//         resultado: false,
//         tabla: "analisis_bioquimicos",
//         url: "/api/v01/ct/laboratorio/reporteAnalisisBioquimico"
//     },
//     {
//         nombre: "OIT",
//         resultado: false,
//         tabla: "oit",
//         url: "/api/v01/ct/oit/obtenerReporteOit"
//     },
//     {
//         nombre: "RADIOGRAFIA TORAX",
//         resultado: false,
//         tabla: "radiografia_torax",
//         url: "/api/v01/ct/rayosX/obtenerReporteRadiografiaTorax"
//     },
//     {
//         nombre: "ELECTROCARDIOGRAMA",
//         resultado: false,
//         tabla: "informe_electrocardiograma",
//         url: "/api/v01/ct/electroCardiograma/obtenerReporteInformeElectroCardiograma",
//         esJasper: true
//     },
//     {
//         nombre: "ESPIROMETRIA",
//         resultado: false,
//         tabla: "ESPIROMETRIA",
//         nomenclatura: "ESPIROMETRIA"
//     },
//     {
//         nombre: "FICHA AUDIOLOGICA",
//         resultado: false,
//         tabla: "audiometria_po",
//         url: "/api/v01/ct/audiometria/obtenerReporteAudiometriaM"
//     },
//     {
//         nombre: "INFORME PSICOLOGICO",
//         resultado: false,
//         tabla: "informe_psicologico",
//         url: "/api/v01/ct/informePsicologico/obtenerReporteInformePsicologico",
//         esJasper: true
//     },
//     {
//         nombre: "FICHA OFTALMOLOGICA",
//         resultado: false,
//         tabla: "oftalmologia",
//         url: "/api/v01/ct/agudezaVisual/obtenerReporteOftalmologia"
//     },
//     {
//         nombre: "CONSENTIMIENTO INFORMADO ",
//         resultado: false,
//         tabla: "consentimientoInformado",
//         url: "/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoInformado"
//     },
// ];

{/* 
const ExamenesListPODEROSA = [
    {
        nombre: "RESUMEN MEDICO PODEROSA", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "resumen_medico_poderosa",
        url: "/api/v01/ct/anexos/obtenerReporteResumenMedico",
    },
    {
        nombre: "CONSTANCIA DE EXAMEN MEDICO OCUPACIONAL",
        resultado: false,
        tabla: "certificado_aptitud_medico_resumen",
        url: "/api/v01/ct/certificadoAptitudMedicoOcupacional/obtenerReporteCertificadoMedicoOcupacional",
        esJasper: true
    },
    {
        nombre: "CERTIFICADO DE APTITUD ANEXO 16",
        resultado: false,
        tabla: "certificado_aptitud_medico_ocupacional",
        url: "/api/v01/ct/anexos/fichaAnexo16/obtenerReporteFichaAnexo16",
        esJasper: true
    },
    {
        nombre: "ANEXO 16",
        resultado: false,
        tabla: "anexo7c",
        url: "/api/v01/ct/anexos/anexo16/obtenerReporteAnexo16"
    },
    //FICHA APTITUD ANEXO 2
    {
        nombre: "CERTIFICADO MEDICO OCUPACIONAL ANEXO 02",
        resultado: false,
        tabla: "aptitud_medico_ocupacional_agro",
        url: "/api/v01/ct/anexos/fichaAnexo2/obtenerReporteFichaAnexo2",
        esJasper: true
    },
    //ANEXO 02
    {
        nombre: "ANEXO 02",
        resultado: false,
        tabla: "anexo_agroindustrial",
        url: "/api/v01/ct/anexos/anexo2/obtenerReporteAnexo2Completo",
        esJasper: true
    },
    //ENFERMEDADES ALTURA GEOGRAFICA
    {
        nombre: "ENFERMEDADES EN ALTURA",
        resultado: false,
        tabla: "antece_enfermedades_altura",
        url: "/api/v01/ct/antecedentesEnfermedadesAltura/obtenerReporteAntecedentesEnfermedadesAltura"
    },
    //ANEXO 16A
    {
        nombre: "ANEXO 16A",
        resultado: false,
        tabla: "anexo16a",
        url: "/api/v01/ct/anexos/anexo16a/obtenerReporteAnexo16a",
        esJasper: true
    },
    //Certificado en Altura
    {
        nombre: "CERTIFICADO ALTURA",
        resultado: false,
        tabla: "b_certificado_altura",
        url: "/api/v01/ct/certificadoTrabajoAltura/obtenerReporteCertificadoTrabajoAltura",
        esJasper: true
    },
    //PSICOSENSOMETRICO
    // {
    //     nombre: "PSICOSENSOMETRICO ",//NUEVO ARCHIVO EXTERNO
    //     resultado: false,
    //     tabla: "PSICOSENSOMETRICO",
    //     url: ""
    // },
    //Certificado en Altura PODEROSA
    {
        nombre: "CERTIFICADO APTITUD ALTURA PODEROSA",
        resultado: false,
        tabla: "aptitud_altura_poderosa",
        url: "/api/v01/ct/aptitudAltura/obtenerReporteAptitudAlturaPoderosa",
        esJasper: true
    },
    //Certificado Vehiculos
    {
        nombre: "CERTIFICADO VEHICULOS",
        resultado: false,
        tabla: "b_certificado_conduccion",
        url: "/api/v01/ct/certificadoConduccion/obtenerReporteCertificadoConduccion",
        esJasper: true
    },
    //Ficha sas
    {
        nombre: "FICHA SAS",
        resultado: false,
        tabla: "ficha_sas",
        url: "/api/v01/ct/fichaApneaSueno/obtenerReporteFichaSas",
        esJasper: true
    },
    //LICENCIA PARA CONDUCIR INTERNA PODEROSA
    {
        nombre: "LICENCIA PARA CONDUCIR INTERNA PODEROSA",//NUEVO  OPTIMIZAR
        resultado: false,
        tabla: "aptitud_licencia_conduciri",
        url: "/api/v01/ct/aptitudLicenciaConducir/obtenerReporteAptitudLicenciaConducir",
        esJasper: true
    },
    //HOJA DE CONSULTA EXTERNA
    {
        nombre: "HOJA DE CONSULTA EXTERNA",//NUEVO OPTIMIZAR
        resultado: false,
        tabla: "hoja_consulta_externa",
        url: "/api/v01/ct/hojaConsultaExterna/obtenerReporteHojaConsultaExterna",
    },
    {
        nombre: "USO DE RESPIRADORES",
        resultado: false,
        tabla: "b_uso_respiradores",
        url: "/api/v01/ct/respiradores/obtenerReporteRespiradores",
        esJasper: true
    },
    {
        nombre: "HISTORIA OCUPACIONAL",
        resultado: false,
        tabla: "historia_oc_info",
        url: "/api/v01/ct/historiaOcupacional/obtenerReporteHistoriaOcupacional"
    },
    {
        nombre: "ANTECEDENTES PATOLOGICOS",
        resultado: false,
        tabla: "antecedentes_patologicos",
        url: "/api/v01/ct/antecedentesPatologicos/obtenerReporteAntecedentesPatologicos",
        esJasper: true
    },
    //DECLARACION JURADA DE ANTECEDENTES PATOLOGICOS Y FAMILIARES
    {
        nombre: "DECLARACION JURADA DE ANTECEDENTES PATOLOGICOS Y FAMILIARES",//NUEVO OPTIMIZAR
        resultado: false,
        tabla: "DECLA_JURA_ANTECE_PERSON_FAM",
        url: "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision",
        esJasper: true
    },
    {
        nombre: "CUESTIONARIO NORDICO",
        resultado: false,
        tabla: "cuestionario_nordico",
        url: "/api/v01/ct/cuestionarioNordico/obtenerReporteCuestionarioNordico"
    },
    {
        nombre: "EVALUACION MUSCULO ESQUELETICA",
        resultado: false,
        tabla: "evaluacion_musculo_esqueletica",
        url: "/api/v01/ct/evaluacionMusculoEsqueletica/obtenerReporteEvaluacionMusculoEsqueletica"
    },
    //CONSENTIMIENTO DE MUESTRA DE SANGRE
    {
        nombre: "CONSENTIMIENTO DE MUESTRA DE SANGRE",//NUEVO OPTIMIZAR
        resultado: false,
        tabla: "consent_Muestra_Sangre",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true
    },
    {
        nombre: "LABORATORIO CLINICO",
        resultado: false,
        tabla: "lab_clinico",
        url: "/api/v01/ct/laboratorio/obtenerReporteLaboratorioClinico"
    },
    {
        nombre: "ANALISIS BIOQUIMICOS (PERFIL LIPIDICO) OPCIONAL EN ALGUNOS EXAMANES ",
        resultado: false,
        tabla: "analisis_bioquimicos",
        url: "/api/v01/ct/laboratorio/reporteAnalisisBioquimico"
    },
    //INMUNOLOGIA - GENODOTROPINA
    {
        nombre: "INMUNOLOGIA - GENODOTROPINA",//NUEVO OPTIMIZAR
        resultado: false,
        tabla: "lgonadotropina",
        url: "/api/v01/ct/inmunologia/obtenerReporteLgonadotropina",
    },
    //CONSENTIMIENTO DE MARIHUANA 
    {
        nombre: "CONSENTIMIENTO DE MARIHUANA",//NUEVO OPTIMIZAR
        resultado: false,
        tabla: "consent_marihuana",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },
    //CONSENTIMIENTO PANEL 2D
    {
        nombre: "CONSENTIMIENTO PANEL 2D",//NUEVO OPTIMIZAR
        resultado: false,
        tabla: "con_panel2D",
        url: "/api/v01/ct/laboratorio/consentimiento-laboratorio",
        nameConset: true,
    },
    //CONSENTIMIENTO DROGAS BOROO
    {
        nombre: "CONSENTIMIENTO DROGAS BOROO",//NUEVO OPTIMIZAR
        resultado: false,
        tabla: "consent_Boro",
        url: "/api/v01/ct/laboratorio/consentimientoLaboratorioBoro",
        nameConset: true,
    },
    {
        nombre: "OIT",
        resultado: false,
        tabla: "oit",
        url: "/api/v01/ct/oit/obtenerReporteOit"
    },
    {
        nombre: "RADIOGRAFIA TORAX",
        resultado: false,
        tabla: "radiografia_torax",
        url: "/api/v01/ct/rayosX/obtenerReporteRadiografiaTorax"
    },
    //RAYOS X TORAX ARCHIVO
    {
        nombre: "RAYOS X TORAX ARCHIVO", //NUEVO ARCHIVO FALTA IMPRIMIR
        resultado: false,
        tabla: "RAYOS X TORAX",
        nomenclatura: "RAYOS X TORAX"
    },
    //INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA)
    {
        nombre: "INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA)", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "radiografia",
        url: "/api/v01/ct/rayosX/obtenerReporteInformeRadiografico"
    },
    //INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA) ARCHIVO
    {
        nombre: "INFORME RADIOGRAFICO (RADIOGRAFIA COLUMNA) ARCHIVO", //NUEVO ARCHIVO FALTA IMPRIMIR
        resultado: false,
        tabla: "INFORME RADIOGRAFICO",
        nomenclatura: "INFORME RADIOGRAFICO"
    },
    {
        nombre: "ELECTROCARDIOGRAMA",
        resultado: false,
        tabla: "informe_electrocardiograma",
        url: "/api/v01/ct/electroCardiograma/obtenerReporteInformeElectroCardiograma",
        esJasper: true
    },
    //ELECTROCARDIOGRAMA ARCHIVO
    {
        nombre: "ELECTROCARDIOGRAMA ARCHIVO", //NUEVO ARCHIVO FALTA IMPRIMIR
        resultado: false,
        tabla: "ELECTROCARDIOGRAMA",
        nomenclatura: "ELECTROCARDIOGRAMA"
    },
    {
        nombre: "ESPIROMETRIA",
        resultado: false,
        tabla: "ESPIROMETRIA",
        nomenclatura: "ESPIROMETRIA"
    },
    {
        nombre: "FICHA AUDIOLOGICA OHLA",
        resultado: false,
        tabla: "audiometria_po",
        url: "/api/v01/ct/audiometria/obtenerReporteAudiometriaM"
    },
    //FICHA AUDIOMETRIA
    {
        nombre: "FICHA AUDIOMETRIA", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "audiometria_2023",
        url: "/api/v01/ct/manipuladores/obtenerReporteAudiometria"
    },
    //CUESTIONARIO AUDIOMETRIA 
    {
        nombre: "CUESTIONARIO AUDIOMETRIA ", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "cuestionario_audiometria",
        url: "/api/v01/ct/audiometria/obtenerReporteCuestionarioAudiometria"
    },
    //FICHA INTERCONSULTA 
    // {
    //     nombre: "FICHA INTERCONSULTA", //NUEVO REVISAR SERAN VARIOS CONSUMOS
    //     resultado: false,
    //     tabla: "ficha_interconsulta",
    //     url: "/api/v01/ct/fichaInterconsulta/obtenerFichaInterconsultaReporte"
    // },
    //ODONTROGRAMA
    {
        nombre: "ODONTROGRAMA", //NUEVO OPTIMIZAR Y REENCUADRE JEAN
        resultado: false,
        tabla: "odontograma",
        url: "/api/v01/ct/odontograma/obtenerReporteOdontograma"
    },
    //PSICOLOGIA ANEXO 03
    {
        nombre: "PSICOLOGIA ANEXO 03", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "ficha_psicologica_anexo03",
        url: "/api/v01/ct/psicologia/obtenerFichaPsicologiaAnexo03",
        esJasper: true,
    },
    //TEST DE FATIGA Y SOMNOLENCIA
    {
        nombre: "TEST DE FATIGA Y SOMNOLENCIA", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "informe_psicologico_estres",
        url: "/api/v01/ct/informePsicologicoAdeco/obtenerReporteInformePsicologicoAdeco",
        esJasper: true,
    },
    //INFORME PSICOLOGICO DE PODEROSA LICENCIA PARA OPERAR
    {
        nombre: "INFORME PSICOLOGICO DE PODEROSA LICENCIA PARA OPERAR", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "evaluacion_psicologica_poderosa",
        url: "/api/v01/ct/evaluacionPsicologicaPoderosa/obtenerReporteEvaluacionPsicologicaPoderosa",
        esJasper: true,
    },
    //PSICOLOGIA ANEXO 02
    {
        nombre: "PSICOLOGIA ANEXO 02", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "ficha_psicologica_anexo02",
        url: "/api/v01/ct/psicologia/obtenerFichaPsicologiaAnexo02",
        esJasper: true,
    },
    {
        nombre: "INFORME PSICOLOGICO",
        resultado: false,
        tabla: "informe_psicologico",
        url: "/api/v01/ct/informePsicologico/obtenerReporteInformePsicologico",
        esJasper: true
    },
    //INFORME PSICOLOGIA FOBIAS
    {
        nombre: "INFORME PSICOLOGIA FOBIAS", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "fobias",
        url: "/api/v01/ct/fobias/obtenerReporte",
        esJasper: true
    },
    //INFORME PSICOLABORAL
    {
        nombre: "INFORME PSICOLABORAL", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "informe_psicolaboral",
        url: "/api/v01/ct/informePsicolaboral/obtenerReporteInformePsicolaboral",
        esJasper: true
    },
    //TRABAJOS EN ESPECIFICOS
    {
        nombre: "TRABAJOS EN ESPECIFICOS", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "especificos",
        url: "/api/v01/ct/trabajoEspecifico/obtenerReporteTrabajosEspecificos",
        esJasper: true
    },
    //TRABAJO EN ALTURA
    {
        nombre: "TRABAJO EN ALTURA", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "psicologiafobias",
        url: "/api/v01/ct/informePsicologicoFobias/obtenerReporteInformePsicologicoFobias",
        esJasper: true
    },
    //OFTALMOLOGIA
    {
        nombre: "OFTALMOLOGIA", //NUEVO OPTIMIZAR JEAN URGENTE
        resultado: false,
        tabla: "oftalmologia2021",
        url: "/api/v01/ct/agudezaVisual/obtenerReporteEvaluacionOftalmologica",
    },
    //OFTALMOLOGIA VISION TESTER
    {
        nombre: "OFTALMOLOGIA VISION TESTER", //NUEVO ARCHIVO FALTA IMPRIMIR
        resultado: false,
        tabla: "OFTALMOLOGIA VISION TESTER",
        nomenclatura: "OFTALMOLOGIA VISION TESTER"
    },
    {
        nombre: "FICHA OFTALMOLOGICA",
        resultado: false,
        tabla: "oftalmologia",
        url: "/api/v01/ct/agudezaVisual/obtenerReporteOftalmologia"
    },
    //DECLARACION DE SINTOMATICO RESPIRATORIO
    {
        nombre: "DECLARACION DE SINTOMATICO RESPIRATORIO", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "CONSENT_SINTOMATICO",
        url: "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision",
        esJasper: true
    },
    //CONSENTIMIENTO INFORMADO DE EVALUACION MEDICA
    {
        nombre: "CONSENTIMIENTO INFORMADO DE EVALUACION MEDICA", //NUEVO OPTIMIZAR
        resultado: false,
        tabla: "CONSENT_INFORMADO_MEDICA",
        url: "/api/v01/ct/consentimientos/obtenerReporteConsentimientosAdmision",
        esJasper: true
    },
    //CONSENTIMIENTO BUENA SALUD
    {
        nombre: "CONSENTIMIENTO BUENA SALUD", //NUEVO
        resultado: false,
        tabla: "consentimientobuenasalud",
        url: "/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoBuenaSalud",
        esJasper: true
    },
    {
        nombre: "CONSENTIMIENTO INFORMADO",
        resultado: false,
        tabla: "consentimientoInformado",
        url: "/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoInformado"
    },
    //DECLARACION JURADA PARA EL USO DE FIRMA ELECTRONICA
    // {
    //     nombre: "DECLARACION JURADA PARA EL USO DE FIRMA ELECTRONICA", //NUEVO ARCHIVO
    //     resultado: false,
    //     tabla: "DECLARACION USO FIRMA",
    //     url: "",
    // },
    //DNI Y OTROS DOCUMENTOS
    // {
    //     nombre: "DNI Y OTROS DOCUMENTOS", //NUEVO ARCHIVO
    //     resultado: false,
    //     tabla: "DNI Y OTROS DOCUMENTOS",
    //     url: "",
    // },
];
*/}