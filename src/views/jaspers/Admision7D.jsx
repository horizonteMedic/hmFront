// views/jaspers/Admision7D.jsx

import React from "react";
import jsPDF from "jspdf";
import footer from "./components/footer";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";

export default function Admision7d(datos) {
  // 1) Inicializar PDF (A4 en mm)
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // 2) Encabezado (logo, campos, título)
  headerHR(doc, datos);

  // 3) Texto base
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(0, 0, 0);

  // 4) Constantes de diseño
  const pageW        = doc.internal.pageSize.getWidth();
  const margin       = 15;
  const diagramShift = -15;        // mueve el diagrama a la izq
  const headerGap    = 75;         // baja el diagrama para dar más espacio
  const centerX      = pageW / 2 + diagramShift;
  const startY       = headerGap;
  const ovalW=35, ovalH=12, boxR=6;
  const rectW=40, rectH=12;
  const vertStep=20;

  const line = (x1,y1,x2,y2) => doc.line(x1,y1,x2,y2);

  // 5) Óvalos ADMISION → TRIAJE
  drawBox(doc, "ADMISION", centerX-ovalW/2, startY, ovalW, ovalH, boxR, datos.orden);
  drawBox(doc, "TRIAJE",   centerX-ovalW/2, startY+vertStep, ovalW, ovalH, boxR, datos.triaje);

  // Una sola línea continua entre ellos
  line(centerX, startY+ovalH, centerX, startY+vertStep);

  // 6) Fila de recuadros
  const row2Y = startY + 2*vertStep;
  const cols = [
    centerX - rectW*1.5 - 5,
    centerX - rectW*0.5 - 2.5,
    centerX + rectW*0.5 + 0,
    centerX + rectW*1.5 + 5
  ];
  drawC(doc, "LABORATORIO\n(HTO-HB)", cols[0], row2Y, rectW, rectH, datos.laboratorio);
  drawC(doc, "EKG (> 40 años)",     cols[1], row2Y, rectW, rectH, datos.electrocardiograma);
  drawC(doc, "PSICOLOGIA",          cols[2], row2Y, rectW, rectH, datos.psicologia);
  drawC(doc, "A. VISUAL",           cols[3], row2Y, rectW, rectH, datos.oftalmologia);

  // Conexiones horizontales entre TODOS los recuadros
  for (let i = 0; i < cols.length - 1; i++) {
    line(cols[i] + rectW, row2Y + rectH/2, cols[i+1], row2Y + rectH/2);
  }

  // 7) Unión TRIAJE → EKG
  const yTriajeBottom = startY + vertStep + ovalH;
  const yEkgTop       = row2Y;
  const xEkgCenter    = cols[1] + rectW/2;
  line(xEkgCenter, yTriajeBottom, xEkgCenter, yEkgTop);

  // 8) Uniones a EVALUACIÓN MÉDICA (solo LAB, EKG, PSICOLOGÍA)
  const yTop    = row2Y + rectH;
  const yBottom = yTop + 7;
  [cols[0], cols[1], cols[2]].forEach(x =>
    line(x + rectW/2, yTop, x + rectW/2, yBottom)
  );
  const labX = cols[0] + rectW/2;
  const psiX = cols[2] + rectW/2;
  line(labX, yBottom, psiX, yBottom);

  // Conector vertical central hacia Evaluación Médica
  const trunkX = cols[1] + rectW/2;
  const evalY  = yBottom + 5;
  line(trunkX, yBottom, trunkX, evalY);

  // Recuadro EVALUACIÓN MÉDICA
  drawC(doc, "EVALUACIÓN MÉDICA", trunkX - 16, evalY, 33, 10, datos.anexo7c);

  // 9) Bloque “Indicaciones” al lado de ADMISION
  const indX = margin + (pageW - 2*margin)*0.65;
  const indY = startY - 2;
  const indW = pageW - margin - indX;
  const indH = 35;

  doc.setFillColor(245,245,245)
     .roundedRect(indX, indY, indW, indH, 2, 2, "F")
     .setFont("helvetica","bold").setFontSize(9).setTextColor(200,0,0)
     .text("INDICACIONES:", indX+2, indY+7)
     .setFont("helvetica","normal").setFontSize(8).setTextColor(0,0,0);

  let cursorY = indY + 11;
  [
    "Si ud. es conductor y/o operador dejar copia a color de DNI y licencia de conducir.",
    "Si ud. no es conductor dejar copia a color de su DNI.",
    "Si ud. va a examen psicosensométrico para conducir dejar copia a color de su DNI."
  ].forEach(txt => {
    const lines = doc.splitTextToSize("• " + txt, indW - 4);
    doc.text(lines, indX+3, cursorY);
    cursorY += lines.length * 3.5;
  });

  // 10) Footer e impresión
  footer(doc,datos);
  const blob = doc.output("blob");
  const url  = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
