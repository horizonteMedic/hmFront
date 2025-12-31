import React from "react";
import jsPDF from "jspdf";
import header from "./components/header";
import footer from "./components/footer";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";

export default async function Ecografia(datos) {

  const doc = new jsPDF();

  // Llamamos al header (si tienes un encabezado personalizado)
  headerHR(doc, datos);

  // Ajustes iniciales de fuente y color
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  // Punto inicial vertical
  let startY = 50;

  // Ancho de la página (para centrar texto y diagrama)
  const pageWidth = doc.internal.pageSize.getWidth();

  // --- TÍTULO PRINCIPAL ---

  // --- DIAGRAMA DE FLUJO CENTRADO ---
  const shapeWidth = 60;
  const shapeHeight = 12;
  const cornerRadius = 6;
  const centerX = pageWidth / 2;
  const drawLine = (x1, y1, x2, y2) => {
    doc.line(x1, y1, x2, y2);
  };

  // Moved map lower by adjusting Y positions
  drawBox(doc, "ADMISION", 90, 75, 30, 10, 4, datos.orden ? true : false);
  drawLine(105, 85, 105, 90);
  drawBox(doc, "TRIAJE", 90, 90, 30, 10, 4, datos.triaje ? true : false);
  drawLine(105, 100, 105, 105);
  drawBox(doc, "ECOGRAFIA", 90, 105, 30, 10, 4);

  let finalY = startY + 90;

  // Indicaciones box with background
  const indX = 15;
  const indY = finalY - 5;
  const indW = 180;
  const indH = 35;

  // Draw background box for Indicaciones
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(indX, indY, indW, indH, 2, 2, "F");

  // Indicaciones title and text
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(200, 0, 0);
  doc.text("INDICACIONES:", indX + 2, finalY);
  finalY += 5;
  // Vuelve a la configuración original para el resto del texto
  doc.setFont("helvetica", "normal"); // Fuente normal para el resto
  doc.setFontSize(9);                 // Vuelve a tamaño de fuente 8
  doc.setTextColor(0, 0, 0);          // Regresa al color negro
  doc.text(
    "- Si ud. es conductor y/o operador dejar una copia a color de su DNI y licencia de conducir.",
    20,
    finalY
  );
  finalY += 5;
  doc.text(
    "- Si ud. no es conductor dejar una copia a color de su DNI.",
    20,
    finalY
  );
  finalY += 5;
  doc.text(
    "- Si es conductor u operador de maquinaria pesada también debe dejar copia a color de su DNI.",
    20,
    finalY
  );
  finalY += 10;

  // Llamamos al footer (si tienes un pie de página personalizado)
  footer(doc, datos);

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Crear un iframe invisible para imprimir directamente
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);

  iframe.onload = function () {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }


};

