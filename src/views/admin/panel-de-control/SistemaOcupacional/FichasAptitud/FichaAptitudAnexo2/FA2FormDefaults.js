import { getDatePlus364Days, getDatePlusYearsMinusOneDay } from "../../../../../utils/helpers";

export const DURACION_FA2_OPCIONES = [
  { label: "1 año", value: "1" },
  { label: "2 años", value: "2" },
];

// 1 año conserva la regla histórica (+364 días); 2 años vence el día previo al 2.º aniversario.
export const getFA2FechaVencimiento = (fechaValido, duracionAnios) =>
  String(duracionAnios) === "2"
    ? getDatePlusYearsMinusOneDay(fechaValido, 2)
    : getDatePlus364Days(fechaValido);

// Al editar un registro, deduce la duración a partir de las fechas guardadas.
export const inferirDuracionFA2 = (fechaValido, fechaVencimiento) =>
  fechaValido && fechaVencimiento && getFA2FechaVencimiento(fechaValido, "2") === fechaVencimiento
    ? "2"
    : "1";

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
  duracionAnios: "1",
  fechaVencimiento: getFA2FechaVencimiento(today, "1"),
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
