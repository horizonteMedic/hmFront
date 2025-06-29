// src/views/jaspers/Microbiologia/InmunologiaRapida_Digitalizado.jsx
import jsPDF from "jspdf";
import header_Inmunologia_Digitalizado from "./Header/header_Inmunologia_Digitalizado";
import footer from "../components/footer";

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

export default function InmunologiaLab1_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  
  // === HEADER ===
  header_Inmunologia_Digitalizado(doc, datos);

  // === CUERPO ===
  let y = 90; // Posición Y inicial después del nuevo header

  // Título
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("INMUNOLOGÍA", pageW / 2, y, { align: "center" });
  y += 10;

  // Encabezado de tabla
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  const colW = 60;
  const col1X = config.margin;
  const col2X = (pageW / 2) + colW;
  doc.text("PRUEBA", col1X, y);
  doc.text("RESULTADO", col2X, y, { align: "center" });
  y += 2;
  
  // Línea
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += 10;

  // Datos de la prueba (con etiqueta de 2 líneas)
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  
  const testLabel1 = "Prueba Rápida";
  const testLabel2 = "HEPATITIS A";
  const testValue = datos.hepatitisA != null ? datos.hepatitisA : "N/A";
  
  // Dibujar etiquetas de prueba alineadas a la izquierda
  doc.text(testLabel1, col1X, y);
  y += 5;
  doc.text(testLabel2, col1X, y);
  
  // Dibujar el resultado centrado
  const resultY = y - 2.5;
  doc.text(testValue, col2X, resultY, { align: "center" });

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
