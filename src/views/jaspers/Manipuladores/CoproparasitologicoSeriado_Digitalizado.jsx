// src/views/jaspers/AnalisisBioquimicos/CoproparasitologicoSeriado_Digitalizado.jsx
import jsPDF from "jspdf";
import headerManipuladores from "./Header/headerManipuladores";
import footer from "../components/footer";

export default function CoproparasitologicoSeriado_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const xLeft = margin * 2;
  const xRight = pageW - margin * 2;
  let y;

  // === PRIMERA PÁGINA (con header) ===
  headerManipuladores(doc, datos);
  y = 80;
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("COPROPARASITOLÓGICO SERIADO", pageW / 2, y, { align: "center" });
  y += 12;

  // MUESTRA I
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("MUESTRA: " + (datos.muestra1 || "HECES I"), xLeft, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  ["COLOR","ASPECTO","MOCO FECAL","GRASA","SANGRE VISIBLE","RESTOS ALIMENTICIOS"].forEach((lbl,i) => {
    const key = ["color1","aspecto1","moco_fecal1","grasa1","sangre_visible1","restos1"][i];
    doc.text(lbl + " :", xLeft, y);
    doc.text(datos[key] || "", xRight, y, { align: "right" });
    y += 7;
  });

  // EXAMEN MICROSCÓPICO I
  y += 6;
  doc.setFont("helvetica", "bold").text("EXAMEN MICROSCÓPICO I", xLeft, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  ["LEUCOCITOS","HEMATÍES","INVESTIGACIÓN DE PARÁSITOS"].forEach((lbl,i) => {
    const key = ["leucocitos1","hematies1","investigacion1"][i];
    doc.text(lbl + " :", xLeft, y);
    doc.text(datos[key] || "", xRight, y, { align: "right" });
    y += 7;
  });

  // MUESTRA II
  y += 10;
  doc.setFont("helvetica", "bold").text("MUESTRA: " + (datos.muestra2 || "HECES II"), xLeft, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  ["COLOR","ASPECTO","MOCO FECAL","GRASA","SANGRE VISIBLE","RESTOS ALIMENTICIOS"].forEach((lbl,i) => {
    const key = ["color2","aspecto2","moco_fecal2","grasa2","sangre_visible2","restos2"][i];
    doc.text(lbl + " :", xLeft, y);
    doc.text(datos[key] || "", xRight, y, { align: "right" });
    y += 7;
  });

  // EXAMEN MICROSCÓPICO II
  y += 6;
  doc.setFont("helvetica", "bold").text("EXAMEN MICROSCÓPICO II", xLeft, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  ["LEUCOCITOS","HEMATÍES","INVESTIGACIÓN DE PARÁSITOS"].forEach((lbl,i) => {
    const key = ["leucocitos2","hematies2","investigacion2"][i];
    doc.text(lbl + " :", xLeft, y);
    doc.text(datos[key] || "", xRight, y, { align: "right" });
    y += 7;
  });

  // Footer de primera página
  footer(doc, datos);

  // === SEGUNDA PÁGINA (SIN header) ===
  doc.addPage();
  y = 80;
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("MUESTRA: " + (datos.muestra3 || "HECES III"), xLeft, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  ["COLOR","ASPECTO","MOCO FECAL","GRASA","SANGRE VISIBLE","RESTOS ALIMENTICIOS"].forEach((lbl,i) => {
    const key = ["color3","aspecto3","moco_fecal3","grasa3","sangre_visible3","restos3"][i];
    doc.text(lbl + " :", xLeft, y);
    doc.text(datos[key] || "", xRight, y, { align: "right" });
    y += 7;
  });
  y += 6;
  doc.setFont("helvetica", "bold").text("EXAMEN MICROSCÓPICO III", xLeft, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  ["LEUCOCITOS","HEMATÍES","INVESTIGACIÓN DE PARÁSITOS"].forEach((lbl,i) => {
    const key = ["leucocitos3","hematies3","investigacion3"][i];
    doc.text(lbl + " :", xLeft, y);
    doc.text(datos[key] || "", xRight, y, { align: "right" });
    y += 7;
  });

  // Footer de segunda página
  footer(doc, datos);

  // Imprimir
  const pdfBlob = doc.output("blob");
  const pdfUrl  = URL.createObjectURL(pdfBlob);
  const iframe  = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
