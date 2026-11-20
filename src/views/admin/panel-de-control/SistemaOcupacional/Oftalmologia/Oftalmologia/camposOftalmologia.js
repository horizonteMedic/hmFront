// Campos que el usuario puede editar en cada pestaña del formulario (para resaltar/revertir los cambios por
// pestaña al editar un registro existente).

export const CAMPOS_OFTALMOLOGIA_PARTE_I = [
  // Evaluación oftalmológica
  "parpadosYAnexos",
  "corneas",
  "otrosHallazgos",
  "conjuntivas",
  "cristalino",
  // Fondo de ojo
  "fondoNormalOD",
  "fondoNormalOI",
  "fondoAnormalOD",
  "fondoAnormalOI",
  "fondoHallazgos",
  // PIO
  "pioOd",
  "pioOi",
  "noAplica",
  // Correctores oculares
  "correctorOcular",
  "correctorCerca",
  "correctorLejos",
  "noTrajocorrectorCerca",
  "noTrajocorrectorLejos",
  // Antecedentes
  "antecedentesPersonales",
  "antecedentesFamiliares",
  // Test de evaluación complementaria
  "ishihara",
  "coloresPuros",
  "estereopsia",
  "estereopsiaText",
  // Refracción
  "aplicaRefraccion",
  "odsfL", "odcilL", "odejeL",
  "oisfL", "oicilL", "oiejeL", "dipL",
  "odsfC", "odcilC", "odejeC",
  "oisfC", "oicilC", "oiejeC", "dipC",
];

export const CAMPOS_OFTALMOLOGIA_PARTE_II = [
  // Agudeza visual final
  "agudezaOdLejos",
  "agudezaOiLejos",
  "agudezaOdCerca",
  "agudezaOiCerca",
  // Indicaciones
  "ninguna",
  "usoCorrectoresCerca",
  "usoCorrectoresLejos",
  "lentesCorrectoresCerca",
  "lentesCorrectoresLejos",
  "lentesCambioLunas",
  "indicacionPterigion",
  "indicacionOtras",
  // Restricciones
  "noRestringeActividades",
  "restriccionCorrectorLejos",
  "restriccionCorrectorCerca",
  "noTrabajosCableElectrico",
  "noConduccion",
];

export const CAMPOS_OFTALMOLOGIA_PARTE_III = [
  // Exposición ocupacional
  "vc_sinc_od", "vc_sinc_oi", "vc_conc_od", "vc_conc_oi", "vc_agujero_od", "vc_agujero_oi",
  "vl_sinc_od", "vl_sinc_oi", "vl_conc_od", "vl_conc_oi", "vl_agujero_od", "vl_agujero_oi",
  "bino_sinc",
  "bino_conc",
  "reflejos_pupilares",
  // Visión de colores y enfermedades oculares
  "visionColores",
  "visionColoresCie10",
  "enfOculares",
  "enfOcularesCie10",
  "presenciaPterigion",
  "presenciaPterigionCie10",
  "diagnostico",
  // Examen clínico externo
  "ptosisPalpebralOd", "ptosisPalpebralOi",
  "pterigionGradoOd", "pterigionGradoOi",
  "estrabismoOd", "estrabismoOi",
  "pingueculaOd", "pingueculaOi",
  "conjuntivitisOd", "conjuntivitisOi",
  "chalazionOd", "chalazionOi",
  "cataratasOd", "cataratasOi",
  "otrosOd", "otrosOi",
  "examenClinicoHallazgos",
];
