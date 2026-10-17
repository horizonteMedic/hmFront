import { getFetch } from "./apiHelpers";
import { formatearHora } from "./formatDateUtils";
import { unwrap } from "./registroAsistencialUtils";

/**
 * resumenAsistencialUtils
 * =======================
 * Piezas comunes del botón "Resumen Asistencial" de las Historias Clínicas del módulo asistencial (Mujer/Varón
 * Adulto y Adulto Mayor). Ambas imprimen la misma hoja (jaspers/.../HistoriaClinicaMujerVaronAdulto/
 * ResumenAsistencial.jsx) y la arman igual: paciente + ticket + Historia Clínica + signos vitales y anamnesis
 * del Triaje del mismo ticket. Cada controller aporta lo propio de su Historia (datos del paciente y qué
 * antecedentes patológicos marcó); aquí vive lo que no cambia.
 */

const triajeUrl = "/asistencial/triaje";

// Triaje del ticket (signos vitales y anamnesis de la hoja). Sin Triaje, o con error, devuelve null y esos
// renglones simplemente quedan en blanco.
export const obtenerTriajeDeTicket = async (numeroTicket, token) => {
  const res = await getFetch(`${triajeUrl}/numero-ticket/${numeroTicket}`, token);
  return res && !res.error ? unwrap(res) : null;
};

// "horaTicket" (LocalTime) puede llegar como "HH:mm:ss", [h, m, s] o { hour, minute }.
export const horaDeTicket = (hora) => {
  if (!hora) return "";
  const pad = (n) => String(n).padStart(2, "0");
  if (typeof hora === "string") return formatearHora(hora);
  const [h, m] = Array.isArray(hora) ? hora : [hora.hour, hora.minute];
  return Number.isFinite(Number(h)) && Number.isFinite(Number(m)) ? `${pad(h)}:${pad(m)}` : "";
};

const conUnidad = (valor, unidad) => {
  const v = String(valor ?? "").trim();
  return v ? `${v} ${unidad}` : "";
};

// Signos vitales y anamnesis del Triaje con los nombres de campo que lee el reporte. La hoja tiene "P" (pulso)
// y "FC": el Triaje solo registra la frecuencia cardiaca, así que "P" queda en blanco.
export const datosTriajeResumen = (triaje) => {
  const presion =
    triaje?.presionSistolica != null && triaje?.presionDiastolica != null
      ? `${triaje.presionSistolica}/${triaje.presionDiastolica} mmHg`
      : "";

  return {
    presionArterial: presion,
    pulso: "",
    frecuenciaCardiaca: conUnidad(triaje?.frecuenciaCardiaca, "x'"),
    frecuenciaRespiratoria: conUnidad(triaje?.frecuenciaRespiratoria, "x'"),
    temperatura: conUnidad(triaje?.temperaturaC, "°C"),
    saturacionO2: conUnidad(triaje?.saturacionO2, "%"),
    peso: conUnidad(triaje?.pesoKg, "kg"),
    // La talla del Triaje asistencial se guarda en metros (ver ReporteTriajeAsistencial).
    talla: conUnidad(triaje?.tallaCm, "m"),
    // "PC" de la hoja: perímetro del cuello (TriajeAsistencialDTO.perimetroCuelloCm).
    perimetroCuelloCm: conUnidad(triaje?.perimetroCuelloCm, "cm"),
    anamnesis: triaje?.anamnesis ?? "",
  };
};

const FAMILIARES = [
  ["Padre", "padre"],
  ["Madre", "madre"],
  ["Hermanos", "hermanos"],
  ["Hijos", "hijos"],
  ["Esposa/Cónyuge", "esposaConyuge"],
];

// Texto de "Antecedentes familiares y patológicos" de la hoja: lo que trae el Triaje (si trae texto propio va
// primero), los antecedentes patológicos ya redactados (`patologicos`: lista de textos) y el texto de cada
// familiar tal como está en la Historia Clínica (`historia.padre`, `.madre`, ...).
export const armarAntecedentesResumen = ({ triaje, patologicos = [], historia = {} }) => {
  const familiares = FAMILIARES.filter(([, campo]) => String(historia[campo] ?? "").trim()).map(
    ([nombre, campo]) => `${nombre}: ${String(historia[campo]).trim()}`
  );

  return [
    String(triaje?.antecedentes ?? "").trim(),
    patologicos.length ? `Patológicos: ${patologicos.join(", ")}.` : "",
    familiares.length ? `Familiares: ${familiares.join("; ")}.` : "",
  ]
    .filter(Boolean)
    .join("\n");
};
