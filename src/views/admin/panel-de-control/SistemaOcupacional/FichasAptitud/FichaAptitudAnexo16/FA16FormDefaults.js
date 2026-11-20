import { getDatePlus364Days } from "../../../../../utils/helpers";
import { crearRestriccionesFicha } from "../restriccionesFichaAptitud";

const restriccionesFA16 = crearRestriccionesFicha("USO DE EPP AUDITIVO ANTE EXPOSICIÓN A RUIDO >=80 DB");

export const RESTRICCIONES_FA16 = restriccionesFA16.restricciones;
export const RESTRICCIONES_FA16_NAMES = restriccionesFA16.nombres;
export const RESTRICCIONES_FA16_DESMARCADAS = restriccionesFA16.desmarcadas;
export const armarRestriccionesFA16 = restriccionesFA16.armar;
export const inferirRestriccionesFA16 = restriccionesFA16.inferir;

export const getFA16InitialFormState = ({ today, userlogued, userName }) => ({
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

  visionCercaOd: "",
  visionLejosOd: "",
  visionCercaOi: "",
  visionLejosOi: "",

  visionCercaOdCorregida: "",
  visionLejosOdCorregida: "",
  visionCercaOiCorregida: "",
  visionLejosOiCorregida: "",

  visionColores: "",
  visionBinocular: "",
  reflejosPupilares: "",
  enfermedadOculares: "",

  hemoglobina: "",
  vsg: "",
  glucosa: "",
  creatinina: "",

  // Médico que Certifica //BUSCADOR
  nombre_medico: userName,
  user_medicoFirma: userlogued,
});
