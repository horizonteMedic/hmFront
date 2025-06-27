// src/views/jaspers/AnalisisBioquimicos/coprocultivo_digitalizado.jsx
import jsPDF from "jspdf";
import headerCoprocultivoDigitalizado from "./Header/headerCoprocultivoDigitalizado";
import footer from "../components/footer";

export default function Coprocultivo_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  // === HEADER ===
  headerCoprocultivoDigitalizado(doc, datos);

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
    ["Muestra", datos.txtmuestra ? ":  "+ datos.txtmuestra.toUpperCase() : "Heces"],
    ["Color", datos.txtcolor ? ":  "+ datos.txtcolor.toUpperCase() : ""],
    ["Consistencia", datos.txtconsistencia ? ":  "+ datos.txtconsistencia.toUpperCase() : ""],
    ["Moco Fecal", datos.txtmoco_fecal ? ":  "+ datos.txtmoco_fecal.toUpperCase() : ""],
    ["Sangre Visible", datos.txtsangrev ? ":  "+ datos.txtsangrev.toUpperCase() : ""],
    ["Restos Alimenticios", datos.txtrestosa ? ":  "+ datos.txtrestosa.toUpperCase() : ""],
  ].forEach(([label, val]) => {
    doc.text(label, xLeft, y);
    doc.text(val, xLeft + 45, y, { align: "left" });
    y += 7;
  });

  // --- COPROCULTIVO – EXAMEN MICROSCÓPICO ---
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.text("COPROCULTIVO – EXAMEN MICROSCÓPICO", xLeft, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  [
    ["Leucocitos", datos.txtleucocitos ? ":  " + datos.txtleucocitos.toUpperCase() : ""],
    ["Hematíes", datos.txthematies ? ":  " + datos.txthematies.toUpperCase() : ""],
    ["Parásitos", datos.txtparasitos ? ":  " + datos.txtparasitos.toUpperCase() : ""],
    ["Gotas de grasa", datos.txtgotasg ? ":  " + datos.txtgotasg.toUpperCase() : ""],
    ["Levaduras", datos.txtlevaduras ? ":  " + datos.txtlevaduras.toUpperCase() : ""],
  ].forEach(([label, val]) => {
    doc.text(label, xLeft, y);
    doc.text(val, xLeft + 45, y, { align: "left" });
    y += 7;
  });

  // --- COPROCULTIVO – IDENTIFICACIÓN Y ANTIBIOGRAMA ---
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.text("COPROCULTIVO – IDENTIFICACIÓN Y ANTIBIOGRAMA", xLeft, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.text("Identificación :", xLeft, y);
  doc.text(datos.txtidentificacion || "", xLeft + 45, y, { align: "left" });
  y += 7;
  doc.text("Flora Coliforme :", xLeft, y);
  doc.text(datos.txtflorac || "", xLeft + 45, y, { align: "left" });
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
    datos.txtobservaciones ||" ",
    xLeft,
    y
  );


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
