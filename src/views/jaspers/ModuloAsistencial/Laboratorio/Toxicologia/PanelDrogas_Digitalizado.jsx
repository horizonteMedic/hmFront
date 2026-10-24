import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de los paneles de drogas (2D, 3D, 4D, 5D y 10D) del módulo asistencial. Mismo cuerpo que
// jaspers/Toxicologia/Panel{2d,3d,4d,10d}_Digitalizado.jsx y ResultadosPanel5d_Digitalizado.jsx
// (ocupacional): título TOXICOLÓGICO, MUESTRA / MÉTODO y la tabla PRUEBA CUALITATIVO / RESULTADOS /
// UNIDADES, pero con la cabecera y los datos personales estándar del módulo asistencial (N° Ticket /
// N° Historia Clínica) y sin datos laborales (Tipo Examen, Ocupación, Cargo, Área, Empresa, Contrata).
//
// Recibe el reporte de GET /asistencial/laboratorio/panel-<n>d/obtenerReporte?esJasper=true (campos
// planos del DTO: metodo, cocaina, marihuana..., fechaExamen, digitalizacion...). El controller completa
// numeroTicket, nombres (apellidos primero), numeroHistoriaClinica, sede y sellos, y fija `tipoPanel`
// ("2D" | "3D" | "4D" | "5D" | "10D"), que elige título y filas.

// --- Configuración (la del ocupacional) ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 100,
  col3X: 170,
  fontSize: {
    title: 14,
    header: 9,
    body: 9,
  },
  font: "helvetica",
  lineHeight: 7,
};

// Definición de cada panel: rótulo de la tabla, método (el 4D lo imprime fijo, como el ocupacional; los
// demás leen `datos.metodo`, que el 5D no captura y por eso tiene un valor por defecto) y filas.
// Los rótulos y las mayúsculas son los del jasper ocupacional de cada panel.
const PANELES = {
  "2D": {
    titulo: "PANEL DROGAS 2D",
    filas: [
      { label: "Cocaína (COC)", key: "cocaina" },
      { label: "Marihuana(THC)", key: "marihuana" },
    ],
  },
  "3D": {
    titulo: "PANEL DROGAS 3D",
    filas: [
      { label: "Cocaína (COC)", key: "cocaina" },
      { label: "Marihuana(THC)", key: "marihuana" },
      { label: "Éxtasis (MDMA)", key: "extasis" },
    ],
  },
  "4D": {
    titulo: "DROGAS PANEL 4D",
    metodoFijo: "INMUNOCROMATOGRAFICO",
    filas: [
      { label: "COCAINA", key: "cocaina" },
      { label: "MARIHUANA", key: "marihuana" },
      { label: "OPIACEOS", key: "opiaceos" },
      { label: "METHANFETAMINA", key: "metanfetamina" },
    ],
  },
  "5D": {
    titulo: "PANEL DROGAS 5D",
    metodoPorDefecto: "INMUNOCROMATOGRÁFICO",
    filas: [
      { label: "Cocaína", key: "cocaina" },
      { label: "Marihuana", key: "marihuana" },
      { label: "Anfetamina en Orina", key: "anfetamina" },
      { label: "Metanfetamina", key: "metanfetamina" },
      { label: "Benzodiacepina", key: "benzodiacepina" },
    ],
  },
  "10D": {
    titulo: "PANEL DROGAS 10D",
    filas: [
      { label: "COCAÍNA (COC)", key: "cocaina" },
      { label: "MARIHUANA (THC)", key: "marihuana" },
      { label: "ANFETAMINA (AMP)", key: "anfetamina" },
      { label: "METANFETAMINA (MET)", key: "metanfetamina" },
      { label: "BENZODIACEPINA (BZO)", key: "benzodiacepina" },
      { label: "OPIÁCEOS (OPI)", key: "opiaceos" },
      { label: "BARBITÚRICOS", key: "barbituricos" },
      { label: "METADONA (MTD)", key: "metadona" },
      { label: "FENCICLIDINA (PCP)", key: "fenciclidina" },
      { label: "ANTIDEPRESIVOS TRICÍCLICOS (TCA)", key: "antidepresivos" },
    ],
  },
};

const texto = (v) => (v === undefined || v === null ? "" : String(v).trim());

// El Panel 4D guarda cada droga como booleano (true = POSITIVO); los demás, como texto.
const resultadoDe = (valor) => {
  if (valor === undefined || valor === null || valor === "") return "NEGATIVO";
  if (typeof valor === "boolean") return valor ? "POSITIVO" : "NEGATIVO";
  const t = String(valor).trim().toUpperCase();
  if (t === "TRUE") return "POSITIVO";
  if (t === "FALSE") return "NEGATIVO";
  return t;
};

const drawResultRow = (doc, y, label, result, units) => {
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text(label || "", config.col1X, y);
  doc.text(String(result || ""), config.col2X, y, { align: "center" });
  doc.text(String(units || ""), config.col3X, y, { align: "center" });
  return y + config.lineHeight;
};

export default async function PanelDrogas(datos = {}, docExistente = null) {
  const panel = PANELES[datos.tipoPanel];
  if (!panel) throw new Error(`Panel de drogas desconocido: ${datos.tipoPanel}`);

  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // ===== Encabezado =====
  // Cabecera compartida del módulo asistencial (el título queda en y = 38).
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  await HeaderAsistencial(
    doc,
    {
      numeroTicket: datos.numeroTicket,
      numeroHistoriaClinica: datos.numeroHistoriaClinica,
      sede: datos.sede || datos.nombreSede,
      fecha: datos.fechaExamen || datos.fecha,
      codigoColor: datos.codigoColor,
      textoColor: datos.textoColor,
    },
    { pagina: 1, titulo: "TOXICOLÓGICO", etiquetaFecha: "Fecha de examen" }
  );

  // ===== Datos personales (sin datos laborales) =====
  const finalYPos = DatosPersonalesAsistencial(
    doc,
    { ...datos, nombreCompleto: datos.nombres || datos.nombreCompleto },
    { x: 15, y: 43, ancho: 180, laborales: false }
  );

  // ===== Muestra y método =====
  let y = finalYPos + 10;
  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("MUESTRA :", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text("ORINA", config.margin + 30, y);
  y += config.lineHeight;

  const metodo = panel.metodoFijo ?? (texto(datos.metodo) || panel.metodoPorDefecto || "");
  doc.setFont(config.font, "bold");
  doc.text("MÉTODO :", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text(metodo.toUpperCase(), config.margin + 30, y);
  y += config.lineHeight * 2;

  // ===== Encabezado de la tabla =====
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA CUALITATIVO", config.col1X, y);
  doc.text("RESULTADOS", config.col2X, y, { align: "center" });
  doc.text("UNIDADES", config.col3X, y, { align: "center" });
  y += 3;
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // ===== Panel y resultados =====
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text(panel.titulo, config.col1X, y);
  y += config.lineHeight;

  panel.filas.forEach(({ label, key }) => {
    y = drawResultRow(doc, y, label, resultadoDe(datos[key]), "S/U");
  });

  // ===== Firmas =====
  // Sello del especialista y del doctor asignado (sin firma/huella del paciente: no existen por ticket).
  // Misma posición que el ocupacional (y = 210); el Panel 10D, con más filas, los baja si no caben. Si
  // una imagen no se puede cargar, el informe se imprime igual (sin ese sello).
  doc.setLineWidth(0.2);
  try {
    await dibujarFirmas({ doc, datos, y: Math.max(210, y + 10), pageW, mostrarFirmaPaciente: false });
  } catch (error) {
    console.error("Error dibujando firmas:", error);
  }

  // ===== Pie =====
  footerTR(doc, { footerOffsetY: 8 });

  // Si se recibió un documento existente (folio), solo se dibuja en él y se retorna.
  if (docExistente) {
    return doc;
  }
  imprimir(doc);
}

function imprimir(doc) {
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}
