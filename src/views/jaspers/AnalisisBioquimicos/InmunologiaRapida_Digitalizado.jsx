// src/views/jaspers/Microbiologia/InmunologiaRapida_Digitalizado.jsx
import jsPDF from "jspdf";
import headerLabGenerico from "./Header/headerLabGenerico";
import footer from "../components/footer";

export default function InmunologiaRapida_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  // === HEADER ===
  headerLabGenerico(doc, datos);

  // === CUERPO ===
  let y = 65;

  // Título
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("INMUNOLOGÍA", pageW / 2, y, { align: "center" });
  y += 10;

  // Encabezado de tabla
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("PRUEBA", margin, y);
  doc.text("RESULTADO", pageW - margin, y, { align: "right" });
  y += 5;

  // Línea
  doc.setLineWidth(0.5).line(margin, y, pageW - margin, y);
  y += 6;

  // Datos
  const testsRapida = [
    { label: "Prueba Rápida HEPATITIS A", key: "hepatitisA" },
  ];
  doc.setFont("helvetica", "normal").setFontSize(11);
  testsRapida.forEach(({ label, key }) => {
    const val = datos[key] != null ? datos[key] : "N/A";
    doc.text(label, margin, y);
    doc.text(val, pageW - margin, y, { align: "right" });
    y += 8;
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
