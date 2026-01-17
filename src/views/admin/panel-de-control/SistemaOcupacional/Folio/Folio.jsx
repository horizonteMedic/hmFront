import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { useState } from "react";
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import FolioJasper from "../../../../jaspers/FolioJasper/FolioJasper";
import { getToday } from "../../../../utils/helpers";
import { GetInfoPac } from "./controllerFolio";
import Swal from "sweetalert2";

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

export const EXAMENES_CATALOGO = {
    /* =========================
       GENERALES / BASE
    ========================= */
    RESUMEN_MEDICO_PODEROSA: {
        nombre: "RESUMEN MEDICO PODEROSA",
        tabla: "resumen_medico_poderosa",
        url: "/api/v01/ct/anexos/obtenerReporteResumenMedico",
    },

    CONSTANCIA_EMO: {
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

    ESPIROMETRIA_ARCHIVO: {
        nombre: "ESPIROMETRIA",
        tabla: "ESPIROMETRIA",
        nomenclatura: "ESPIROMETRIA",
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

    INTERCONSULTAS: {
        nombre: "INTERCONSULTAS",
        tabla: "",
        url: "",
    },

};

const buildExamenesList = (orden) =>
    orden.map((key) => {
        const config = EXAMENES_CATALOGO[key];
        if (!config) {
            console.warn(`⚠️ Examen no registrado en catálogo: ${key}`);
            return null;
        }
        return buildExamen(config);
    }).filter(Boolean);

const ExamenesList4 = buildExamenesList([
    "OFTALMOLOGIA_VISION_TESTER",
    "PSICOSENSOMETRICO",
]);
const ExamenesList2 = buildExamenesList([
    "OFTALMOLOGIA_VISION_TESTER",
    "PSICOSENSOMETRICO",
]);


const ExamenesList = buildExamenesList([       //OHLA
    "RESUMEN_MEDICO_PODEROSA",                 // 1
    "CONSTANCIA_EMO",                          // 2
    "ANEXO_16",                                // 3
    "CERTIFICADO_ALTURA",                      // 4
    "OFTALMOLOGIA_VISION_TESTER",              // 5
    "CERTIFICADO_VEHICULOS",                   // 6
    "FICHA_SAS",                               // 7
    "PSICOSENSOMETRICO",                       // 8
    "HISTORIA_OCUPACIONAL",                    // 9
    "ANTECEDENTES_PATOLOGICOS",                // 10
    "DECLARACION_JURADA_ANTECEDENTES",         // 11
    "CUESTIONARIO_NORDICO",                    // 12
    "EVALUACION_MUSCULO_ESQUELETICA",          // 13
    "CONSENT_MUESTRA_SANGRE",                  // 14
    "LABORATORIO_CLINICO",                     // 15
    "PERFIL_LIPIDICO",                         // 16
    "GONADOTROPINA",                           // 17
    "PERFIL_RENAL",                            // 18
    "PERFIL_HEPATICO",                         // 19
    "CONSENT_PANEL_5D",                        // 20
    "OIT",                                     // 21
    "RAYOS_X_TORAX_ARCHIVO",                   // 22
    "RADIOGRAFIA_COLUMNA",                     // 23
    "RADIOGRAFIA_COLUMNA_ARCHIVO",             // 24
    "ELECTROCARDIOGRAMA",                      // 25
    "ESPIROMETRIA_ARCHIVO",                    // 26
    "AUDIOMETRIA_OHLA",                        // 27
    "ODONTOGRAMA",                             // 28
    "PSICOLOGIA_ANEXO_02",                     // 29
    "TEST_FATIGA_SOMNOLENCIA",                 // 30
    "CUESTIONARIO_BERLIN",                     // 31
    "INFORME_PSICOLOGICO",                     // 32
    "TRABAJO_ALTURA_PSICO",                    // 33
    "OFTALMOLOGIA",                            // 34
    "CONSENT_DECLARACION_APTITUD",             // 35
    "DECLARACION_USO_FIRMA_ARCHIVO",           // 36
    "INTERCONSULTAS"                           // 37
]);

const ExamenesList3 = buildExamenesList([ // Campaña
    "CERTIFICADO_APTITUD_ANEXO_16",  // 1
    "ANEXO_16",                      // 2
    "ENFERMEDADES_ALTURA",           // 3
    "ANEXO_16A",                     // 4
    "USO_RESPIRADORES",              // 5
    "HISTORIA_OCUPACIONAL",          // 6
    "ANTECEDENTES_PATOLOGICOS",      // 7
    "CUESTIONARIO_NORDICO",          // 8
    "EVALUACION_MUSCULO_ESQUELETICA",// 9
    "LABORATORIO_CLINICO",           // 10
    "PERFIL_LIPIDICO",               // 11
    "OIT",                           // 12
    "RADIOGRAFIA_TORAX",             // 13
    "ELECTROCARDIOGRAMA",            // 14
    "ESPIROMETRIA_ARCHIVO",          // 15
    "AUDIOMETRIA_OHLA",              // 16
    "INFORME_PSICOLOGICO",           // 17
    "OFTALMOLOGIA",                  // 18
    "CONSENTIMIENTO_INFORMADO",      // 19
]);

// const ExamenesList2 = [
//     {
//         nombre: "OIT",//21 CORRECTO REVISAR Consentimiento Panel 5D
//         resultado: true,
//         tabla: "oit",
//         url: "/api/v01/ct/oit/obtenerReporteOit"
//     },
// ]
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
const Folio = () => {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();
    const [selectedListType, setSelectedListType] = useState("OHLA");
    const initialFormState = {
        norden: "",
        codigoInforme: null,
        fechaEntrevista: today,
        nombreExamen: "",
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        domicilioActual: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos Laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",
        listaExamenes: ExamenesList,
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleClear,
        handleRadioButtonBoolean,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "Folio_KEY" });

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            const currentList = selectedListType === "OHLA" ? ExamenesList : ExamenesList3;
            GetInfoPac(form.norden, setForm, token, selectedSede, currentList);
            //VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handleListChange = (e) => {
        const newValue = e.target.value;
        setSelectedListType(newValue);
        const newList = newValue === "OHLA" ? ExamenesList : ExamenesList3;

        if (form.norden) {
            handleClearnotO();
            GetInfoPac(form.norden, setForm, token, selectedSede, newList);
        } else {
            setForm((prev) => ({
                ...prev,
                listaExamenes: newList,
            }));
        }
    };

    const toggleExamen = (index) => {
        const newList = [...form.listaExamenes];
        // Solo permitir cambiar si el examen existe (resultado es true)
        if (newList[index].resultado) {
            newList[index].imprimir = !newList[index].imprimir;
            setForm((prev) => ({
                ...prev,
                listaExamenes: newList,
            }));
        }
    };

    const handleGenerarFolio = async () => {
        // Mostrar alerta de carga con barra de progreso
        Swal.fire({
            title: 'Generando Folio',
            html: `
                <div class="mb-4">
                    <p class="text-gray-700 mb-2">Procesando reportes...</p>
                    <div class="w-full bg-gray-200 rounded-full h-6 mb-2">
                        <div id="progress-bar" class="bg-gradient-to-r from-blue-500 to-purple-600 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-white text-sm font-semibold" style="width: 0%">
                            0%
                        </div>
                    </div>
                    <p id="current-report" class="text-sm text-gray-600">Iniciando...</p>
                    <p id="report-count" class="text-xs text-gray-500 mt-1">0 de 0 reportes completados</p>
                </div>
            `,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Función callback para actualizar el progreso
            const updateProgress = (current, total, percentage, reportName) => {
                const progressBar = document.getElementById('progress-bar');
                const currentReport = document.getElementById('current-report');
                const reportCount = document.getElementById('report-count');

                if (progressBar) {
                    progressBar.style.width = `${percentage}%`;
                    progressBar.textContent = `${percentage}%`;
                }

                if (currentReport) {
                    currentReport.textContent = `Generando: ${reportName}`;
                }

                if (reportCount) {
                    reportCount.textContent = `${current} de ${total} reportes completados`;
                }
            };

            // Llamar a FolioJasper con el callback de progreso
            await FolioJasper(form.norden, token, form.listaExamenes, updateProgress, selectedListType);

            // Cerrar la alerta de carga y mostrar éxito
            Swal.fire({
                icon: 'success',
                title: '¡Folio Generado!',
                text: 'El folio se ha generado correctamente',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error generando folio:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al generar el folio. Por favor, intenta nuevamente.',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    return (
        <div className="w-full space-y-3 px-4">
            {/* ===== SECCIÓN: DATOS NECESARIOS ===== */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onKeyUp={handleSearch}
                    onChange={handleChangeNumber}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Fecha Entrevista"
                    name="fechaEntrevista"
                    type="date"
                    value={form.fechaEntrevista}
                    onChange={handleChange}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Nombre Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>
            {/* Contenido principal */}
            <SectionFieldset legend="Datos Personales" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Columna Izquierda */}
                <div className="space-y-3">
                    <InputTextOneLine
                        label="Nombres"
                        name="nombres"
                        value={form.nombres}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Apellidos"
                        name="apellidos"
                        value={form.apellidos}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Fecha Nacimiento"
                        name="fechaNacimiento"
                        value={form.fechaNacimiento}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Lugar Nacimiento"
                        name="lugarNacimiento"
                        value={form.lugarNacimiento}
                        disabled
                        labelWidth="120px"
                    />
                </div>

                {/* Columna Derecha */}
                <div className="space-y-3">
                    <InputTextOneLine
                        label="Domicilio Actual"
                        name="domicilioActual"
                        value={form.domicilioActual}
                        disabled
                        labelWidth="120px"
                    />
                    <div className="grid md:grid-cols-2 gap-3">
                        <InputTextOneLine
                            label="Edad (Años)"
                            name="edad"
                            value={form.edad}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Sexo"
                            name="sexo"
                            value={form.sexo}
                            disabled
                            labelWidth="120px"
                        />
                    </div>
                    <InputTextOneLine
                        label="Estado Civil"
                        name="estadoCivil"
                        value={form.estadoCivil}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Nivel Estudios"
                        name="nivelEstudios"
                        value={form.nivelEstudios}
                        disabled
                        labelWidth="120px"
                    />
                </div>
            </SectionFieldset>
            {/* ===== SECCIÓN: DATOS LABORALES ===== */}
            <SectionFieldset legend="Datos Laborales" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <InputTextOneLine
                    label="Empresa"
                    name="empresa"
                    value={form.empresa}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Contrata"
                    name="contrata"
                    value={form.contrata}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Ocupación"
                    name="ocupacion"
                    value={form.ocupacion}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Cargo Desempeñar"
                    name="cargoDesempenar"
                    value={form.cargoDesempenar}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: CONFIGURACIÓN ===== */}
            <SectionFieldset legend="Configuración" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                    <label className="font-semibold" style={{ minWidth: "120px" }}>Plantilla Protoco:</label>
                    <select
                        className="border rounded px-2 py-1 w-full"
                        value={selectedListType}
                        onChange={handleListChange}
                    >
                        <option value="OHLA">OHLA</option>
                        <option value="CAMPANA">Campaña</option>
                    </select>
                </div>
            </SectionFieldset>

            {/* ===== SECCIÓN: EXAMENES ===== */}
            <SectionFieldset legend="Examenes" className="flex flex-col justify-center items-center w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {form.listaExamenes?.map((examen, index) => (
                        <div key={index} className="flex justify-between items-center border p-3 rounded-md shadow-sm bg-white gap-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={examen.imprimir || false}
                                    onChange={() => toggleExamen(index)}
                                    disabled={!examen.resultado}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <span className="font-medium text-gray-700 text-sm whitespace-normal break-words max-w-[150px] cursor-pointer" onClick={() => toggleExamen(index)}>
                                    {index + 1}.- {examen.nombre}
                                </span>
                            </div>
                            <span className={`font-bold text-sm ${examen.resultado ? 'text-green-600' : 'text-red-600'}`}>
                                {examen.resultado ? 'PASO' : 'NO PASO'}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center w-full gap-4">
                    <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-md mt-4 text-semibold"
                        onClick={() => { handleClear(); setSelectedListType("OHLA") }}
                    >
                        Limpiar
                    </button>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md mt-4 text-semibold"
                        onClick={handleGenerarFolio}
                    >
                        Generar Folio
                    </button>
                </div>

            </SectionFieldset>
        </div>
    );
};

export default Folio;