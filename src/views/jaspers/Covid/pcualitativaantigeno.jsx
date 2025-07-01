import jsPDF from "jspdf";
import header_PCualitativoAntigeno from "./header/header_PCualitativoAntigeno";
import footer from "../components/footer";

// --- Configuración Centralizada ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 80,
  col3X: 140,
  fontSize: {
    title: 14,
    header: 11,
    body: 11,
  },
  font: "helvetica",
  lineHeight: 8,
};

// --- Función de Título Subrayado ---
const drawUnderlinedTitle = (doc, text, y) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(config.font, "bold")
     .setFontSize(config.fontSize.title)
     .text(text, pageW / 2, y, { align: "center" });
  y += 2;
  doc.setLineWidth(0.5)
     .line(config.margin, y, pageW - config.margin, y);
};

// --- Componente Principal ---
export default function pcualitativaantigeno(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  header_PCualitativoAntigeno(doc, datos);

  // === CUERPO ===
  let y = 80;

  // 1) TÍTULO
  drawUnderlinedTitle(doc, "PRUEBA CUALITATIVA DE ANTÍGENOS", y);
  y += config.lineHeight * 2;

  // 2) MARCA
  doc.setFont(config.font, "bold")
     .setFontSize(config.fontSize.body)
     .text("MARCA:", config.margin, y);
  doc.setFont(config.font, "normal")
     .text(datos.cbomarca || "-", config.margin + 30, y);
  y += config.lineHeight * 2;

  // 3) ENCABEZADOS DE TABLA
  doc.setFont(config.font, "bold")
     .setFontSize(config.fontSize.header);
  doc.text("PRUEBA", config.col1X, y);
  doc.text("RESULTADOS", config.col2X, y);
  doc.text("VALORES DE REFERENCIA", config.col3X, y);
  y += 3;
  doc.setLineWidth(0.4)
     .line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // 4) FILA DE RESULTADO
  doc.setFont(config.font, "normal")
     .setFontSize(config.fontSize.body)
     .text("Antígenos virales SARS-CoV-2", config.col1X, y);

  const reactivo = datos.chkigm_reactivo === true;
  const textoResultado = reactivo ? "Reactivo" : "No reactivo";
  doc.text(textoResultado, config.col2X, y);

  const refLines = doc.splitTextToSize(
    datos.txtvrigm || "",
    pageW - config.col3X - config.margin
  );
  doc.text(refLines, config.col3X, y);

  y += Math.max(refLines.length, 1) * config.lineHeight + config.lineHeight;

  // 5) COMENTARIOS
  doc.setFont(config.font, "bold")
     .setFontSize(config.fontSize.body)
     .text("COMENTARIOS:", config.margin, y);
  y += config.lineHeight;

  const textoCom = reactivo
    ? "Presenta antígenos virales SARS-CoV-2"
    : "No presenta antígenos virales SARS-CoV-2";
  const comLines = doc.splitTextToSize(
    textoCom,
    pageW - 2 * config.margin
  );
  doc.setFont(config.font, "normal")
     .text(comLines, config.margin, y);
  y += comLines.length * config.lineHeight + config.lineHeight;

  // 6) SINTOMATOLOGÍA
  doc.setFont(config.font, "bold")
     .setFontSize(config.fontSize.body)
     .text("SINTOMATOLOGÍA", config.margin, y);
  y += config.lineHeight;

  const obs = datos.txtobservaciones;
  const sintoma = !obs || obs.trim() === ""
    ? "Paciente declara no tener síntomas"
    : `Paciente declara tener:\n\n${obs}`;
  const sintLines = doc.splitTextToSize(
    sintoma,
    pageW - 2 * config.margin
  );
  doc.setFont(config.font, "normal")
     .text(sintLines, config.margin, y);

  // === FOOTER ===
  if (typeof footer === "function") {
    footer(doc, datos);
  }

  return doc;
}
