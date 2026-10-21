// Resultados del Examen de Orina: campo del formulario ↔ campo del POST (/asistencial/laboratorio/clinico con
// esOrina) ↔ campo del reporte (GET /clinico/obtenerReporteOrina).
export const CAMPOS_ORINA = [
  { form: "color", body: "txtColorEf", reporte: "colorUrina" },
  { form: "aspecto", body: "txtAspectoEf", reporte: "aspecto" },
  { form: "densidad", body: "txtDensidadEf", reporte: "densidad" },
  { form: "ph", body: "txtPhEf", reporte: "ph" },

  { form: "nitritos", body: "txtNitritosEq", reporte: "nitritos" },
  { form: "proteinas", body: "txtProteinasEq", reporte: "proteinas" },
  { form: "cetonas", body: "txtCetonasEq", reporte: "cetonas" },
  { form: "leucocitosExamenQuimico", body: "txtLeucocitosEq", reporte: "leucocitosEq" },
  { form: "acAscorbico", body: "txtAcAscorbico", reporte: "acAscorbico" },
  { form: "urobilinogeno", body: "txtUrobilinogenoEq", reporte: "urobilinogeno" },
  { form: "bilirrubina", body: "txtBilirrubinaEq", reporte: "bilirrubina" },
  { form: "glucosaExamenQuimico", body: "txtGlucosaEq", reporte: "glucosa" },
  { form: "sangre", body: "txtSangreEq", reporte: "sangre" },

  { form: "leucocitosSedimentoUnitario", body: "txtLeucocitosSu", reporte: "leucocitosSu" },
  { form: "hematiesSedimentoUnitario", body: "txtHematiesSu", reporte: "hematiesSu" },
  { form: "celEpiteliales", body: "txtCelEpitelialesSu", reporte: "celulasEpiteliales" },
  { form: "cristales", body: "txtCristalesSu", reporte: "cristales" },
  { form: "almidon", body: "almidon", reporte: "almidon" },
  { form: "levadura", body: "levadura", reporte: "levadura" },
  { form: "cilindros", body: "txtCilindrosSu", reporte: "cilindros" },
  { form: "bacterias", body: "txtBacteriasSu", reporte: "bacterias" },
  { form: "gramSc", body: "txtPusSu", reporte: "gramSC" },
  { form: "otros", body: "txtOtrosSu", reporte: "otros" },
];

// Valores normales con los que arranca el formulario (y que restaura el botón "No Aplica").
export const VALORES_NORMALES = {
  color: "AMARILLO CLARO",
  aspecto: "TRANSPARENTE",
  densidad: "",
  ph: "",
  nitritos: "NEGATIVO",
  proteinas: "NEGATIVO",
  cetonas: "NEGATIVO",
  leucocitosExamenQuimico: "NEGATIVO",
  acAscorbico: "NEGATIVO",
  urobilinogeno: "NEGATIVO",
  bilirrubina: "NEGATIVO",
  glucosaExamenQuimico: "NEGATIVO",
  sangre: "NEGATIVO",
  leucocitosSedimentoUnitario: "0-1",
  hematiesSedimentoUnitario: "0-0",
  celEpiteliales: "ESCASAS",
  cristales: "NO SE OBSERVAN",
  almidon: "NO SE OBSERVAN",
  levadura: "NO SE OBSERVAN",
  cilindros: "NO SE OBSERVAN",
  bacterias: "NO SE OBSERVAN",
  gramSc: "NO SE OBSERVAN",
  otros: "NO SE OBSERVAN",
};

export const COLORES = ["N/A", "AMARILLO CLARO", "AMARILLO PAJIZO", "AMARILLO AMBAR", "AMBAR", "INCOLORO", "MEDICAMENTOSO", "SANGUINOLENTO"];
export const ASPECTOS = ["N/A", "LIGERAMENTE TURBIO", "TRANSPARENTE", "TURBIO"];
