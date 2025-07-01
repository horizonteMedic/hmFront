import jsPDF from "jspdf";
import header_PCuantiAntigeno from "./header/header_PCuantiAntigeno";
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

// --- Funciones de Ayuda ---
const drawUnderlinedTitle = (doc, text, y) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc
    .setFont(config.font, "bold")
    .setFontSize(config.fontSize.title)
    .text(text, pageW / 2, y, { align: "center" });
};

const drawReferenceValues = (doc, y) => {
  // Ya imprimimos el encabezado en la tabla, así que aquí solo ponemos los valores:
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text("Negativo: 0.0 - 0.04 mIU/mL", config.col3X, y);
  y += config.lineHeight;
  doc.text("Positivo: >= 0.04 mIU/mL", config.col3X, y);
  return y;
};

// --- Componente Principal ---
export default function pcuantiantigeno(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  console.log("Datos recibidos:", datos);

  // === HEADER ===
  header_PCuantiAntigeno(doc, datos);

  // === CUERPO ===
  let y = 80; // <-- lo subimos de 70 a 80 para bajarlo aún más

  // Título principal
  drawUnderlinedTitle(doc, "PRUEBA CUANTITATIVA DE ANTÍGENOS", y);
  y += config.lineHeight * 2;

  // Marca
  doc
    .setFont(config.font, "bold")
    .setFontSize(config.fontSize.body)
    .text("MARCA:", config.margin, y);
  doc
    .setFont(config.font, "normal")
    .text(String(datos.cboMarca || ""), config.margin + 25, y);
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
  doc
    .setFont(config.font, "bold")
    .setFontSize(config.fontSize.body)
    .text("COVID-19 ANTÍGENO", config.col1X, y);
  doc
    .setFont(config.font, "normal")
    .text(String(datos.valorIgm || ""), config.col2X, y);

  // Valores de referencia (sin repetir el título)
  y = drawReferenceValues(doc, y);
  y += config.lineHeight * 2;

  // Resultado destacado
  doc.setFont(config.font, "bold").setFontSize(12);
  doc.text(String(datos.resultado || ""), config.margin, y);
  y += config.lineHeight * 2;

  // Observaciones o texto libre
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text(String(datos.txtvrigm || ""), config.margin, y, {
    maxWidth: pageW - 2 * config.margin,
  });

  // === FOOTER ===
  footer(doc, datos);

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
