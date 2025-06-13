// src/views/jaspers/Toxicologia/Panel2d_Digitalizado.jsx
import jsPDF from "jspdf";
import header from "../components/header";
import footer from "../components/footer";

export default function Panel2d_Digitalizado(datos) {
  const doc = new jsPDF();
  // ahora usamos el header_toxicologia que creaste
  header(doc, datos);

  // baja todo el contenido un poco más
  let y = 80;

  // --- TÍTULO ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("TOXICOLÓGICO", 105, y, { align: "center" });
  y += 12;

  // --- MUESTRA Y MÉTODO ---
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("MUESTRA :", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(datos.muestra || "ORINA", 50, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.text("MÉTODO  :", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(datos.metodo || "INMUNOCROMATOGRÁFICO", 50, y);
  y += 12;

  // --- ENCABEZADO DE COLUMNAS ---
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("PRUEBA CUALITATIVO", 20, y);
  doc.text("RESULTADOS", 85, y);
  doc.text("UNIDADES", 150, y);

  // Línea bajo encabezados
  y += 5;
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);

  // --- PANEL DROGAS 2D ---
  y += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PANEL DROGAS 2D", 20, y);

  // --- DATOS ---
  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text("Cocaína (COC)", 20, y);
  doc.text(datos.cocaina  || "NEGATIVO", 85, y);
  doc.text("S/U", 150, y);

  y += 7;
  doc.text("Marihuana (THC)", 20, y);
  doc.text(datos.marihuana || "POSITIVO", 85, y);
  doc.text("S/U", 150, y);

  // --- FOOTER ---
  footer(doc, datos);

  // abrir para imprimir
  const pdfBlob = doc.output("blob");
  const pdfUrl  = URL.createObjectURL(pdfBlob);
  const iframe  = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}
