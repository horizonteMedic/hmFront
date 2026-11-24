import * as XLSX from "xlsx";
import Swal from "sweetalert2";

/**
 * Importación de resultados de Hematología desde el Excel que imprime el analizador hematológico.
 *
 * El Excel NO identifica al paciente (Nombre/ID/Código de barras vienen vacíos y el nombre del archivo varía),
 * por eso el paciente se busca antes con el N° Orden y aquí solo se leen los resultados. Los valores se cargan TAL COMO vienen en el Excel (sin convertir unidades).
 */

// Ítem del Excel -> campo del formulario. `items`: nombres que se reconocen (el que va antes del paréntesis,
// p. ej. "LEU", o el que va dentro, p. ej. "WBC", de "LEU (WBC)"). Los ítems que no aparezcan aquí se ignoran
// (VSG, abastonados y segmentados no los entrega el equipo y no se tocan).
const MAPEO = [
  { campo: "leucocitos", etiqueta: "Leucocitos (mm³)", items: ["LEU", "WBC"] },
  { campo: "hematies", etiqueta: "Hematíes (mm³)", items: ["ERI", "RBC"] },
  { campo: "hemoglobina", etiqueta: "Hemoglobina (g/dl)", items: ["HGB"] },
  { campo: "hematocrito", etiqueta: "Hematocrito (%)", items: ["HCT"] },
  { campo: "plaquetas", etiqueta: "Plaquetas (mm³)", items: ["PLQ", "PLT"] },
  { campo: "neutrofilos", etiqueta: "Neutrófilos (%)", items: ["NEU%"] },
  { campo: "monocitos", etiqueta: "Monocitos (%)", items: ["MON%"] },
  { campo: "eosinofilos", etiqueta: "Eosinófilos (%)", items: ["EOS%"] },
  { campo: "basofilos", etiqueta: "Basófilos (%)", items: ["BASO%"] },
  { campo: "linfocitos", etiqueta: "Linfocitos (%)", items: ["LIN%", "LYM%"] },
];

const CAMPOS_PORCENTAJE = ["neutrofilos", "monocitos", "eosinofilos", "basofilos", "linfocitos"];
const HEMOGLOBINA_MAX = 25; // mismo límite que la validación del campo en el formulario

// Error con un mensaje pensado para el usuario (archivo mal armado).
export class ErrorArchivoExcel extends Error {}

const normalizar = (texto) =>
  String(texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .trim();

const escapar = (texto) =>
  String(texto ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// "LEU (WBC)" -> ["LEU", "WBC"]; "NEU% (NEU%)" -> ["NEU%", "NEU%"]
const clavesDelItem = (item) => {
  const texto = normalizar(item).replace(/\s+/g, "");
  const [antes, dentro] = texto.split("(");
  return [antes, dentro?.replace(")", "")].filter(Boolean);
};

// Solo números (coma o punto decimal). Devuelve el valor con punto, o null si no es un número.
const numeroValido = (texto) => {
  const limpio = String(texto ?? "").trim().replace(",", ".");
  return /^\d+(\.\d+)?$/.test(limpio) ? limpio : null;
};

/**
 * Lee el Excel y devuelve los resultados reconocidos.
 * Se ubica la tabla por sus encabezados ("Ítem" / "Resultado"), no por posición de fila, para tolerar
 * cambios en el orden o en la cantidad de parámetros del equipo.
 *
 * @returns {Promise<{
 *   serie: string,
 *   valores: Object<string,string>,              campo del form -> valor
 *   detalle: {campo:string, etiqueta:string, valor:string}[],
 *   faltantes: string[],                          etiquetas de campos que el Excel no trajo
 *   invalidos: string[],                          campos cuyo valor no es válido (no se cargan)
 *   advertencias: string[],
 * }>}
 */
export const leerExcelHematologia = async (file) => {
  let filas;
  try {
    const libro = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const hoja = libro.Sheets[libro.SheetNames[0]];
    filas = XLSX.utils.sheet_to_json(hoja, { header: 1, defval: "", raw: false });
  } catch {
    throw new ErrorArchivoExcel("No se pudo leer el archivo. Verifique que sea un Excel (.xlsx) válido.");
  }

  const filaEncabezado = filas.findIndex((fila) => fila.some((celda) => normalizar(celda) === "RESULTADO"));
  if (filaEncabezado === -1) {
    throw new ErrorArchivoExcel('No se encontró la tabla de resultados (columna "Resultado") en el archivo.');
  }
  const encabezado = filas[filaEncabezado];
  const colResultado = encabezado.findIndex((celda) => normalizar(celda) === "RESULTADO");
  const colItem = Math.max(0, encabezado.findIndex((celda) => normalizar(celda) === "ITEM"));

  // N° de muestra del equipo (informativo)
  let serie = "";
  for (const fila of filas.slice(0, filaEncabezado)) {
    const col = fila.findIndex((celda) => /SERIE/.test(normalizar(celda)));
    if (col !== -1) {
      serie = String(fila.slice(col + 1).find((celda) => String(celda).trim() !== "") ?? "").trim();
      break;
    }
  }

  const valores = {};
  const detalle = [];
  const invalidos = [];

  for (const fila of filas.slice(filaEncabezado + 1)) {
    const claves = clavesDelItem(fila[colItem]);
    if (claves.length === 0) continue;
    const entrada = MAPEO.find((m) => m.items.some((i) => claves.includes(i)));
    if (!entrada || entrada.campo in valores) continue;

    const valor = numeroValido(fila[colResultado]);
    const esHemoglobinaFueraDeRango =
      entrada.campo === "hemoglobina" && valor !== null && (Number(valor) <= 0 || Number(valor) > HEMOGLOBINA_MAX);
    if (valor === null || esHemoglobinaFueraDeRango) {
      invalidos.push(`${entrada.etiqueta}: "${String(fila[colResultado]).trim() || "vacío"}"`);
      continue;
    }
    valores[entrada.campo] = valor;
    detalle.push({ campo: entrada.campo, etiqueta: entrada.etiqueta, valor });
  }

  if (detalle.length === 0) {
    throw new ErrorArchivoExcel("El archivo no contiene ningún resultado de hematología reconocido.");
  }

  const faltantes = MAPEO.filter((m) => !(m.campo in valores) && !invalidos.some((i) => i.startsWith(m.etiqueta))).map(
    (m) => m.etiqueta
  );

  const advertencias = [];
  if (CAMPOS_PORCENTAJE.every((c) => c in valores)) {
    const suma = CAMPOS_PORCENTAJE.reduce((total, c) => total + Number(valores[c]), 0);
    if (Math.abs(suma - 100) > 2) {
      advertencias.push(`El recuento diferencial suma ${suma.toFixed(2)}% (se esperaba ~100%).`);
    }
  }

  return { serie, valores, detalle, faltantes, invalidos, advertencias };
};

/**
 * Muestra el resumen de lo que se va a cargar y pide confirmación.
 * @returns {Promise<boolean>} true si el usuario confirma.
 */
export const confirmarImportacionHematologia = async ({ resultado, nombreArchivo, nombresPaciente, sobrescribe }) => {
  const { detalle, serie, faltantes, invalidos, advertencias } = resultado;

  const avisos = [];
  if (sobrescribe) avisos.push("Este paciente ya tiene un registro: los valores del Excel reemplazarán los actuales.");
  if (invalidos.length) avisos.push(`Valores no válidos (no se cargarán): ${invalidos.join(", ")}.`);
  avisos.push(...advertencias);

  const filas = detalle
    .map(
      ({ etiqueta, valor }) =>
        `<tr><td style="text-align:left;padding:2px 12px 2px 0;">${escapar(etiqueta)}</td><td style="text-align:right;font-weight:600;">${escapar(valor)}</td></tr>`
    )
    .join("");

  const { isConfirmed } = await Swal.fire({
    title: "Importar resultados del Excel",
    icon: "question",
    html: `
      <div style="text-align:left;font-size:0.95em;">
        <p style="margin:0 0 4px;"><b>Archivo:</b> ${escapar(nombreArchivo)}${serie ? ` (Nº serie ${escapar(serie)})` : ""}</p>
        <p style="margin:0 0 10px;"><b>Paciente:</b> ${escapar(nombresPaciente)}</p>
        <table style="margin:0 auto 10px;">${filas}</table>
        ${faltantes.length ? `<p style="margin:0 0 6px;color:#6b7280;">No vienen en el Excel (no se modifican): ${escapar(faltantes.join(", "))}.</p>` : ""}
        ${avisos.map((a) => `<p style="margin:0 0 6px;color:#b45309;">⚠ ${escapar(a)}</p>`).join("")}
      </div>`,
    showCancelButton: true,
    confirmButtonText: "Cargar valores",
    cancelButtonText: "Cancelar",
  });
  return isConfirmed;
};
