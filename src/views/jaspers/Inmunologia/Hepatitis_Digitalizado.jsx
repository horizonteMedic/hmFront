import jsPDF from "jspdf";
import headerHepatitisDigitalizado from "./Header/header_Hepatitis_Digitalizado";
import footer from "../components/footer";

// --- Configuración Centralizada (Estándar) ---
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

// --- Funciones de Ayuda (Estándar) ---

const drawUnderlinedTitle = (doc, text, y) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text(text, pageW / 2, y, { align: "center" });
  const textWidth = doc.getTextWidth(text);
  const x = (pageW - textWidth) / 2;
  doc.setLineWidth(0.5);
  doc.line(x, y + 1.5, x + textWidth, y + 1.5);
  doc.setLineWidth(0.2); // Reset
};

const drawResultRow = (doc, y, label, value) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(config.font, 'normal').setFontSize(config.fontSize.body);
  doc.text(label, config.margin, y);
  doc.text(value, pageW - config.margin, y, { align: "right" });
  return y + config.lineHeight;
};

// --- Componente Principal ---

export default function Hepatitis_Digitalizado(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  headerHepatitisDigitalizado(doc, datos);

  let y = 65; 

  // === TÍTULO ===
  drawUnderlinedTitle(doc, 'INMUNOLOGÍA', y);
  y += config.lineHeight * 2;
  
  // === MUESTRA Y MÉTODO ===
  doc.setFontSize(config.fontSize.header);
  doc.setFont(config.font, 'bold');
  doc.text('MUESTRA :', config.margin, y);
  doc.setFont(config.font, 'normal');
  doc.text('SUERO', config.margin + 30, y);
  y += config.lineHeight;

  doc.setFont(config.font, 'bold');
  doc.text('MÉTODO :', config.margin, y);
  doc.setFont(config.font, 'normal');
  doc.text('INMUNOENSAYO CROMATOGRÁFICO', config.margin + 30, y);
  y += config.lineHeight * 2;

  // === ENCABEZADO DE TABLA ===
  doc.setFont(config.font, 'bold');
  doc.text('PRUEBA CUALITATIVO', config.margin, y);
  doc.text('RESULTADO', pageW - config.margin, y, { align: 'right' });
  
  y += 3;
  doc.setLineWidth(0.3);
  doc.line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // === CUERPO DE TABLA ===
  // Nota: Se usa 'hepatitisb' de los datos, que corresponde a "HEPATITIS B (HBsAg)".
  drawResultRow(
    doc,
    y,
    'HEPATITIS B (HBsAg) - RAPID TEST - MONTEST',
    datos.hepatitisb || ''
  );
  
  // === FOOTER ===
  footer(doc, datos);

  // === IMPRIMIR ===
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = function () {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
} 