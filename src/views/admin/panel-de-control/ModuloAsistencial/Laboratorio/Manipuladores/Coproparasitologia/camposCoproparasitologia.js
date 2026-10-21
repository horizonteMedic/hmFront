// Campos del examen Coproparasitológico (POST /asistencial/laboratorio/coproparasitologico y su reporte): cada
// resultado existe por muestra con el sufijo 1, 2 o 3 (color1, color2, color3...). El formulario los guarda con
// el mismo nombre que el DTO.
const PRESENCIA = ["AUSENTE", "PRESENTE"];
const NO_SE_OBSERVAN = ["NO SE OBSERVAN"];

export const MUESTRAS = ["1", "2", "3"];

export const MACROSCOPICO = [
  { name: "color", label: "Color", opciones: ["MARRON", "MOSTAZA", "VERDOSO"] },
  { name: "aspecto", label: "Aspecto", opciones: ["SOLIDO", "SEMISOLIDO", "DIARREICO"] },
  { name: "mocoFecal", label: "Moco Fecal", opciones: PRESENCIA },
  { name: "grasa", label: "Grasa", opciones: PRESENCIA },
  { name: "sangreVisible", label: "Sangre Visible", opciones: PRESENCIA },
  { name: "restosAlimenticios", label: "Restos Alimenticios", opciones: PRESENCIA },
];

export const MICROSCOPICO = [
  { name: "leucocitos", label: "Leucocitos", opciones: NO_SE_OBSERVAN, xCampo: true },
  { name: "hematies", label: "Hematíes", opciones: NO_SE_OBSERVAN, xCampo: true },
  { name: "lugol", label: "Parásitos", opciones: PRESENCIA },
];

// Nombres de los campos de una muestra ("1", "2" o "3").
export const camposDeMuestra = (muestra) => [...MACROSCOPICO, ...MICROSCOPICO].map(({ name }) => `${name}${muestra}`);

// Todos los campos de resultado de las 3 muestras.
export const CAMPOS_RESULTADO = MUESTRAS.flatMap(camposDeMuestra);

// Muestras que se informan: 1 si es Coproparasitológico simple, 2 si falta la tercera, 3 si es seriado completo.
export const cantidadMuestras = ({ tipoCoproparasitologico, sinHecesTres }) =>
  tipoCoproparasitologico ? 1 : sinHecesTres ? 2 : 3;
