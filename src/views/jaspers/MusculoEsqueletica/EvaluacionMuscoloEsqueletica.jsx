import jsPDF from "jspdf";
import headerEvaluacionMuscoloEsqueletica from "./Headers/Header_EvaluacionMuscoloEsqueletica.jsx";

export default function EvaluacionMuscoloEsqueletica(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // === PÁGINA 1 ===
  // === 0) HEADER ===
  headerEvaluacionMuscoloEsqueletica(doc, data, true, 1);

  // === 1) Imagen de fondo para la evaluación músculo esquelética ===
  const fondoImg = "/img/EvaluacionMusculoEsqueletica_pag1.png";
  
  // Usar todo el ancho del documento pero no toda la altura
  const imgWidth = pageW; // Todo el ancho disponible
  const imgHeight = pageH * 0.842; // 83.5% de la altura para dejar espacio para ajustar

  // Posicionar desde abajo hacia arriba
  const xOffset = 0;
  const yOffset = pageH - imgHeight; // Posición original sin ajustes

  try {
    doc.addImage(fondoImg, "PNG", xOffset, yOffset, imgWidth, imgHeight);
  } catch (e) {
    doc.text("Imagen de evaluación músculo esquelética no disponible", margin, yOffset + 10);
  }

  // === PÁGINA 2 ===
  doc.addPage();
  
  // === 0) HEADER PÁGINA 2 (solo texto, sin imagen) ===
  headerEvaluacionMuscoloEsqueletica(doc, data, false, 2);

  // === 1) Imagen de fondo para la página 2 ===
  const fondoImgPag2 = "/img/EvaluacionMusculoEsqueletica_pag2.png";
  
  // Página 2 ocupa toda la hoja
  const imgWidthPag2 = pageW; // Todo el ancho disponible
  const imgHeightPag2 = pageH; // Toda la altura de la página

  // Posicionar desde arriba para ocupar toda la página
  const xOffsetPag2 = 0;
  const yOffsetPag2 = 0; // Desde la parte superior

  try {
    doc.addImage(fondoImgPag2, "PNG", xOffsetPag2, yOffsetPag2, imgWidthPag2, imgHeightPag2);
  } catch (e) {
    doc.text("Imagen de evaluación músculo esquelética página 2 no disponible", margin, yOffsetPag2 + 10);
  }

  // === GENERAR PDF Y ABRIR PARA IMPRESIÓN ===
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}
