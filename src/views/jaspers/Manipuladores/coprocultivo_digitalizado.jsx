// src/views/jaspers/AnalisisBioquimicos/coprocultivo_digitalizado.jsx
import jsPDF from "jspdf";
import headerManipuladores from "./Header/headerManipuladores";
import footer from "../components/footer";

export default function Coprocultivo_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  // === HEADER ===
  headerManipuladores(doc, datos);

  // Empezamos debajo del header
  let y = 80;
  const xLeft = margin * 2;            // 30 mm
  const xValue = pageW - margin * 2;   // pageW - 30 mm

  // === TÍTULO ===
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("COPROCULTIVO", pageW / 2, y, { align: "center" });
  y += 12;

  // --- COPROCULTIVO – MUESTRA ---
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("COPROCULTIVO – MUESTRA", xLeft, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  [
    ["Muestra", datos.muestra || ""],
    ["Color", ""],
    ["Consistencia", ""],
    ["Moco Fecal", ""],
    ["Sangre Visible", ""],
    ["Restos Alimenticios", ""],
  ].forEach(([label, val]) => {
    doc.text(label + " :", xLeft, y);
    doc.text(val, xValue, y, { align: "right" });
    y += 7;
  });

  // --- COPROCULTIVO – EXAMEN MICROSCÓPICO ---
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.text("COPROCULTIVO – EXAMEN MICROSCÓPICO", xLeft, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  [
    "Leucocitos",
    "Hematíes",
    "Parásitos",
    "Gotas de grasa",
    "Levaduras",
  ].forEach((label) => {
    doc.text(label + " :", xLeft, y);
    doc.text("", xValue, y, { align: "right" });
    y += 7;
  });

  // --- COPROCULTIVO – IDENTIFICACIÓN Y ANTIBIOGRAMA ---
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.text("COPROCULTIVO – IDENTIFICACIÓN Y ANTIBIOGRAMA", xLeft, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.text("Identificación :", xLeft, y);
  doc.text(datos.identificacion || "Escherichia coli (*)", xValue, y, { align: "right" });
  y += 7;
  doc.text("Flora Coliforme :", xLeft, y);
  doc.text("", xValue, y, { align: "right" });
  y += 8;

  // Comentario
  doc.setFont("helvetica", "italic");
  doc.text("Comentario: (*) Pertenece a la flora normal", xLeft, y);
  y += 12;

  // --- COPROCULTIVO – RESULTADO ---
  doc.setFont("helvetica", "bold");
  doc.text("COPROCULTIVO – RESULTADO", xLeft, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.text("Resultado :", xLeft, y);
  doc.text("", xValue, y, { align: "right" });
  y += 10;

  // Mensajes fijos de resultados
  doc.text(
    "No se aisló Echerichia Coli Enteroinvasiva - Enteropatógena - Enterohemorragica.",
    xLeft,
    y
  );
  y += 7;
  doc.text("No se aisló bacteria patógenas.", xLeft, y);

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
