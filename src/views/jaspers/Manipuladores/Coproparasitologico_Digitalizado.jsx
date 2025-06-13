// src/views/jaspers/AnalisisBioquimicos/Coproparasitologico_Digitalizado.jsx
import jsPDF from "jspdf";
import headerManipuladores from "./Header/headerManipuladores";
import footer from "../components/footer";

export default function Coproparasitologico_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const xLeft = margin * 2;
  const xRight = pageW - margin * 2;

  // HEADER
  headerManipuladores(doc, datos);

  // BODY
  let y = 80;
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("COPROPARASITOLÓGICO", pageW / 2, y, { align: "center" });
  y += 12;

  // MUESTRA I
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("MUESTRA: " + (datos.muestra1 || "HECES I"), xLeft, y);
  y += 10;

  // EXAMEN MACROSCÓPICO I
  doc.setFont("helvetica", "bold");
  doc.text("EXAMEN MACROSCÓPICO I", xLeft, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  ["color1","aspecto1","moco_fecal1","grasa1","sangre_visible1","restos1"].forEach(key => {
    const label = {
      color1: "COLOR",
      aspecto1: "ASPECTO",
      moco_fecal1: "MOCO FECAL",
      grasa1: "GRASA",
      sangre_visible1: "SANGRE VISIBLE",
      restos1: "RESTOS ALIMENTICIOS"
    }[key];
    doc.text(label + " :", xLeft, y);
    doc.text(datos[key] || "", xRight, y, { align: "right" });
    y += 7;
  });

  // EXAMEN MICROSCÓPICO I
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("EXAMEN MICROSCÓPICO I", xLeft, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  ["leucocitos1","hematies1","investigacion1"].forEach(key => {
    const label = {
      leucocitos1: "LEUCOCITOS",
      hematies1: "HEMATÍES",
      investigacion1: "INVESTIGACIÓN DE PARÁSITOS"
    }[key];
    doc.text(label + " :", xLeft, y);
    doc.text(datos[key] || "", xRight, y, { align: "right" });
    y += 7;
  });

  // FOOTER
  footer(doc, datos);

  // PRINT
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
