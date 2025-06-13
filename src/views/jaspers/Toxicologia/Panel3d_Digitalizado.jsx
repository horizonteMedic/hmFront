// src/views/jaspers/Toxicologia/Panel3d_Digitalizado.jsx
import jsPDF from "jspdf";
import header from "./Header/Header_toxicologia";
import footer from "../components/footer";

export default function Panel3d_Digitalizado(datos) {
  const doc = new jsPDF();
  // Header común
  header(doc, datos);

  // Posición inicial
  let y = 80;

  // --- TÍTULO PRINCIPAL ---
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
  y += 5;
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);

  // --- TÍTULO DEL PANEL 3D ---
  y += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PANEL DROGAS 3D", 20, y);

  // --- FILAS DE ANALITOS ---
  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const tests3d = [
    { label: "Cocaína (COC)", key: "cocaina" },
    { label: "Marihuana (THC)", key: "marihuana" },
    { label: "Éxtasis (MDMA)", key: "extasis" },
  ];

  tests3d.forEach(({ label, key }) => {
    doc.text(label, 20, y);
    const resultado = (datos[key] || "NEGATIVO").toUpperCase();
    doc.text(resultado, 85, y);
    doc.text("S/U", 150, y);
    y += 7;
  });

  // Footer común
  footer(doc, datos);

  // Generar blob y lanzar impresión
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}
