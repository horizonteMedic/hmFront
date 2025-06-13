// src/views/jaspers/Microbiologia/InmunologiaAglutinacion_Digitalizado.jsx
import jsPDF from "jspdf";
import headerLabGenerico from "./Header/headerLabGenerico";
import footer from "../components/footer";

export default function InmunologiaAglutinacion_Digitalizado(datos = {}) {
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

  // Muestra
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("MUESTRA :", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(datos.muestra || "SUERO", margin + 25, y);
  y += 8;

  // Método
  doc.setFont("helvetica", "bold");
  doc.text("MÉTODO:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(
    datos.metodo || "AGLUTINACIÓN EN LÁMINA PORTAOBJETO",
    margin + 25,
    y
  );
  y += 12;

  // Encabezado de tabla
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("PRUEBA CUALITATIVO", margin, y);
  doc.text("RESULTADOS", pageW - margin, y, { align: "right" });
  y += 5;

  // Línea
  doc.setLineWidth(0.5).line(margin, y, pageW - margin, y);
  y += 6;

  // Datos
  const testsAglu = [
    { label: "TÍFICO O", key: "tificoO" },
    { label: "TÍFICO H", key: "tificoH" },
    { label: "PARATÍFICO A", key: "paratifA" },
    { label: "PARATÍFICO B", key: "paratifB" },
    { label: "Brucella abortus", key: "brucella" },
  ];
  doc.setFont("helvetica", "normal").setFontSize(11);
  testsAglu.forEach(({ label, key }) => {
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
