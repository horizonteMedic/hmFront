// src/views/jaspers/Toxicologia/ResultadosPanel5d_Digitalizado.jsx
import jsPDF from "jspdf";
import header from "./Header/Header_toxicologia";
import footer from "../components/footer";

export default function ResultadosPanel5d_Digitalizado(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  let y = 80;
  // --- TÍTULO ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("TOXICOLÓGICO", 105, y, { align: "center" });
  y += 12;

  // --- MUESTRA / MÉTODO ---
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

  // --- ENCABEZADOS ---
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("PRUEBA CUALITATIVO", 20, y);
  doc.text("RESULTADOS", 85, y);
  doc.text("UNIDADES", 150, y);
  y += 5;
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);

  // --- PANEL 5D ---
  y += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PANEL DROGAS 5D", 20, y);

  // --- FILAS ---
  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const tests = [
    { label: "Cocaína", key: "cocaina" },
    { label: "Marihuana", key: "marihuana" },
    { label: "Anfetamina en Orina", key: "anfetamina" },
    { label: "Metanfetamina", key: "metanfetamina" },
    { label: "Benzodiacepina", key: "benzodiacepina" },
  ];

  tests.forEach(({ label, key }) => {
    doc.text(label, 20, y);
    const res = (datos[key] || "NEGATIVO").toUpperCase();
    doc.text(res, 85, y);
    doc.text("S/U", 150, y);
    y += 7;
  });

  footer(doc, datos);

  // imprimir
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
