import { getDatePlus364Days } from "../../../../../utils/helpers";

export const getFA2InitialFormState = ({ today, userlogued, userName }) => ({
  norden: "",
  tipoExamen: "",

  dni: "",
  nombres: "",
  fechaNacimiento: "",
  lugarNacimiento: "",
  edad: "",
  sexo: "",
  estadoCivil: "",
  nivelEstudios: "",

  // Datos Laborales
  empresa: "",
  contrata: "",
  puestoPostula: "",
  ocupacion: "",
  cargoDesempenar: "",

  conclusiones: "",
  apto: "APTO",
  fechaValido: today,
  fechaVencimiento: getDatePlus364Days(today),
  recomendaciones: "",
  restricciones: "NINGUNO.",

  // Checkboxes de recomendaciones
  corregirAgudezaVisualTotal: false,
  corregirAgudezaVisual: false,
  dietaHipocalorica: false,
  evitarMovimientosDisergonomicos: false,
  noHacerTrabajoConCodigoColores: false,
  noHacerTrabajoAltoRiesgo: false,
  noHacerTrabajoSobre18: false,
  usoEppAuditivo: false,
  usoLentesConducir: false,
  usoLentesTrabajo: false,
  usoLentesTrabajoSobre18: false,
  ninguno: true,
  noConducirVehiculos: false,

  // Médico que Certifica
  nombre_medico: userName,
  user_medicoFirma: userlogued,
});
