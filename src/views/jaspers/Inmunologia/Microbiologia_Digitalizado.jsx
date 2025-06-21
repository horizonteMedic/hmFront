// src/views/jaspers/Microbiologia/Microbiologia_Digitalizado.jsx
import jsPDF from "jspdf";
import headerMicrobiologiaDigitalizado from "./Header/header_Microbiologia_Digitalizado";
import footer from "../components/footer";

// --- Configuración Centralizada ---
const config = {
  margin: 15,
  fontSize: {
    title: 14,
    header: 11,
    body: 11,
  },
  font: 'helvetica',
  lineHeight: 8,
};

// --- Funciones de Ayuda ---

// Dibuja una fila de la tabla de resultados
const drawResultRow = (doc, y, label, value) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.text(label, config.margin, y);
  doc.text(value, pageW - config.margin, y, { align: "right" });
  return y + config.lineHeight; // Devuelve la nueva posición Y
};

/**
 * Dibuja un título centrado y subrayado.
 * @param {jsPDF} doc - La instancia del documento jsPDF.
 * @param {string} text - El texto del título.
 * @param {number} y - La posición Y inicial.
 * @param {number} fontSize - El tamaño de la fuente.
 */
const drawUnderlinedTitle = (doc, text, y, fontSize) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(config.font, "bold").setFontSize(fontSize);
  doc.text(text, pageW / 2, y, { align: "center" });
  const textWidth = doc.getTextWidth(text);
  const x = (pageW - textWidth) / 2;
  doc.setLineWidth(0.5);
  doc.line(x, y + 1.5, x + textWidth, y + 1.5);
  doc.setLineWidth(0.2); // Resetear grosor de línea
};


// --- Componente Principal ---

export default function Microbiologia_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  
  // === HEADER personalizado ===
  headerMicrobiologiaDigitalizado(doc, datos);

  // Posición Y inicial después del header
  let y = 65; 

  // === TÍTULO con subrayado ===
  drawUnderlinedTitle(doc, "MICROBIOLOGÍA", y, config.fontSize.title);

  y += config.lineHeight * 2;

  // === MUESTRA ===
  doc.setFontSize(config.fontSize.header).setFont(config.font, "bold");
  doc.text("MUESTRA :", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text(datos.muestra || "ESPUTO", config.margin + 25, y);

  y += config.lineHeight * 2;

  // === ENCABEZADO DE TABLA ===
  doc.setFont(config.font, "bold");
  doc.text("PRUEBA", config.margin, y);
  doc.text("RESULTADO", pageW - config.margin, y, { align: "right" });

  y += 4;
  doc.setLineWidth(0.5);
  doc.line(config.margin, y, pageW - config.margin, y);
  doc.setLineWidth(0.2); // reset line width

  y += config.lineHeight;
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);

  // === Datos de pruebas (Condicional) ===
  // Dependiendo de si es un examen directo o no, se muestran diferentes pruebas.
  if (datos.examenDirecto) {
    drawResultRow(
      doc,
      y,
      "EXAMEN DIRECTO (KOH)",
      datos.koh ?? "N/A"
    );
  } else {
    y = drawResultRow(
      doc,
      y,
      "Examen de BK - BACILOSCOPIA 1° Muestra",
      datos.bk1 ?? "N/A"
    );
    drawResultRow(
      doc,
      y,
      "Examen de BK - BACILOSCOPIA 2° Muestra",
      datos.bk2 ?? "N/A"
    );
  }

  // === FOOTER ===
  // El footer se encarga de su propio posicionamiento en la parte inferior.
  footer(doc, datos);

  // === IMPRIMIR ===
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      alert("Error al intentar imprimir: " + e.message);
    }
  };
}
