// src/views/jaspers/Microbiologia/InmunologiaAglutinacion_Digitalizado.jsx
import jsPDF from "jspdf";
import header_InmunologiaLab_Digitalizado from "./Header/header_InmunologiaLab_Digitalizado";
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
};

const drawResultRow = (doc, y, label, value) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(config.font, 'normal').setFontSize(config.fontSize.body);
  doc.text(label, config.margin, y);
  doc.text(value, pageW - config.margin, y, { align: "right" });
  return y + config.lineHeight;
};

// --- Componente Principal ---

export default function InmunologiaLab_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  header_InmunologiaLab_Digitalizado(doc, datos);

  // === CUERPO ===
  let y = 80;

  // Título
  drawUnderlinedTitle(doc, "INMUNOLOGÍA", y);
  y += config.lineHeight * 1.5;

  // Muestra y Método
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("MUESTRA :", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text(datos.muestra || "SUERO", config.margin + 30, y);
  y += config.lineHeight;

  doc.setFont(config.font, "bold");
  doc.text("MÉTODO:", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text(
    datos.metodo || "AGLUTINACIÓN EN LÁMINA PORTAOBJETO",
    config.margin + 30,
    y
  );
  y += config.lineHeight * 2;

  // Encabezado de tabla
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA CUALITATIVO", config.margin, y);
  doc.text("RESULTADOS", pageW - config.margin, y, { align: "right" });
  y += 3;

  // Línea
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // Datos
  const testsAglu = [
    { label: "TIFICO O", key: "tificoO" },
    { label: "TIFICO H", key: "tificoH" },
    { label: "PARATIFICO A", key: "paratifA" },
    { label: "PARATIFICO B", key: "paratifB" },
    { label: "Brucella abortus", key: "brucella" },
  ];
  
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  testsAglu.forEach(({ label, key }) => {
    const value = datos[key] != null ? datos[key] : "N/A";
    y = drawResultRow(doc, y, label, value);
  });

  // === FOOTER ===
  footer(doc, datos);

  // === IMPRIMIR ===
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
