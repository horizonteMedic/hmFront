import jsPDF from "jspdf";
import header_PCualitativoAntigenoMarsa from "./header/header_PCualitativoAntigenoMarsa";
import footer from "../components/footer";

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

export default function pcualitativaantigenoMarsa(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  header_PCualitativoAntigenoMarsa(doc, datos);

  // === CUERPO ===
  let y = 70;
  // Título
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("PRUEBA CUALITATIVA DE ANTIGENOS", pageW / 2, y, { align: "center" });
  y += config.lineHeight * 2;

  // Marca
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("MARCA:", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text(String(datos.cbomarca || datos.cboMarca || ""), config.margin + 30, y);
  y += config.lineHeight * 2;

  // Encabezados de tabla
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", config.col1X, y);
  doc.text("RESULTADOS", config.col2X, y);
  doc.text("VALORES DE REFERENCIA", config.col3X, y);
  y += 3;
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // Fila de resultado
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text("Antígenos virales SARS-CoV-2", config.col1X, y);
  const reactivo = datos.chkigm_reactivo === true || datos.chkigm_reactivo === 'true';
  const textoResultado = reactivo ? "Reactivo" : "No reactivo";
  doc.text(textoResultado, config.col2X, y);
  const refLines = doc.splitTextToSize(
    datos.txtvrigm || "Negativo: 0.0 - 0.04 mIU/mL\nPositivo: >= 0.04 mIU/mL",
    pageW - config.col3X - config.margin
  );
  doc.text(refLines, config.col3X, y);
  y += Math.max(refLines.length, 1) * config.lineHeight + config.lineHeight;

  // Comentarios
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("COMENTARIOS:", config.margin, y);
  y += config.lineHeight;
  const textoCom = reactivo
    ? "Presenta antígenos virales SARS-CoV-2"
    : "No presenta antígenos virales SARS-CoV-2";
  const comLines = doc.splitTextToSize(
    textoCom,
    pageW - 2 * config.margin
  );
  doc.setFont(config.font, "normal").text(comLines, config.margin, y);
  y += comLines.length * config.lineHeight + config.lineHeight;

  // APTO / NO APTO
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("APTO", config.margin, y);
  doc.text("NO APTO", config.margin + 30, y);
  doc.setFont(config.font, "normal");
  doc.text(datos.apto === true || datos.apto === 'true' ? 'X' : '', config.margin + 15, y);
  doc.text(datos.apto === false || datos.apto === 'false' ? 'X' : '', config.margin + 45, y);
  y += config.lineHeight * 2;

  // Sintomatología
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("SINTOMATOLOGÍA", config.margin, y);
  y += config.lineHeight;
  const obs = datos.txtobservaciones;
  const sintoma = !obs || obs.trim() === ""
    ? "Paciente declara no tener síntomas"
    : `Paciente declara tener:\n\n${obs}`;
  const sintLines = doc.splitTextToSize(
    sintoma,
    pageW - 2 * config.margin
  );
  doc.setFont(config.font, "normal").text(sintLines, config.margin, y);
  y += sintLines.length * config.lineHeight + config.lineHeight;

  // Firma y Huella
  doc.setFont(config.font, "normal").setFontSize(10);
  doc.text("Firmo en conformidad de lo anteriormente declarado.", config.margin, y);
  y += config.lineHeight * 2;

  // Firma y huella digital (dibujar recuadros)
  doc.setLineWidth(0.2);
  doc.rect(config.margin, y, 60, 18); // Firma
  doc.text("FIRMA", config.margin + 2, y + 6);
  doc.rect(config.margin + 70, y, 30, 30); // Huella
  doc.text("Huella Digital", config.margin + 72, y + 6);

  // Footer
  if (typeof footer === "function") {
    footer(doc, datos);
  }

  return doc;
}
