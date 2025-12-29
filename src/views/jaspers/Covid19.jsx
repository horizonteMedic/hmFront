import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import footer from "./components/footer";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";

export default async function Covid19Examen(datos = {}) {

  const doc = new jsPDF();
  // Llamamos al header (si tienes un encabezado personalizado)
  headerHR(doc, datos);

  // Fuente base (letra 8)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);

  const pageWidth = doc.internal.pageSize.getWidth();
  let startY = 80;



  // 4) INDICACIONES (en rojo/negrita)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 0, 0);
  doc.text("INDICACIONES:", 15, startY);
  startY += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(
    "- Si ud. es conductor y/o operador dejar una copia a color de su DNI y licencia de conducir.",
    20,
    startY
  );
  startY += 4;
  doc.text("- Si ud. no es conductor dejar una copia a color de su DNI.", 20, startY);
  startY += 4;
  doc.text(
    "- Si ud. va a pasar examen psicosensométrico para conductor debe dejar una copia a color de su DNI.",
    20,
    startY
  );
  startY += 8;

  // 5) DIAGRAMA DE FLUJO (con línea troncal y pequeñas líneas)
  const centerX = pageWidth / 2;

  // a) ADMISION (oval)
  const ovalWidth = 35;
  const ovalHeight = 8;
  const cornerRadius = 4;

  // ADMISION
  let flowY = startY;
  let leftEdge = centerX - ovalWidth / 2;
  drawBox(doc, "ADMISION", leftEdge, flowY, ovalWidth, ovalHeight, cornerRadius, datos.orden);


  // Línea vertical: ADMISION -> TRIAJE
  doc.line(centerX, flowY + ovalHeight, centerX, flowY + ovalHeight + 6);

  // TRIAJE
  let triajeY = flowY + ovalHeight + 6;
  drawBox(doc, "TRIAJE", leftEdge, triajeY, ovalWidth, ovalHeight, cornerRadius, datos.triaje)

  // Línea vertical: TRIAJE -> COVID 19
  doc.line(centerX, triajeY + ovalHeight, centerX, triajeY + ovalHeight + 6);

  // COVID 19
  let covidY = triajeY + ovalHeight + 6;
  const rectWidth = 35;
  const rectHeight = 8;
  drawBox(doc, "COVID 19", leftEdge, covidY, rectWidth, rectHeight, cornerRadius, datos.covid1 ? true : datos.covid2 ? true : false)

  // b) LÍNEA TRONCAL HORIZONTAL (debajo de COVID 19)
  const trunkY = covidY + rectHeight + 10; // un poco más cercano a COVID
  const boxes = ["PRIMERA", "SEGUNDA", "PA", "HOTEL", "PCON"];
  const boxW = 35;
  const boxH = 8;
  const boxGap = 4;
  const totalBoxes = boxes.length;
  const totalBoxesWidth = totalBoxes * boxW + (totalBoxes - 1) * boxGap;

  // Alineamos la caja "PA" (índice 2) con COVID 19
  const paIndex = 2;
  const paLeft = centerX - boxW / 2;
  const rowStartX = paLeft - paIndex * (boxW + boxGap);


  // Línea vertical: COVID 19 -> trunkY
  doc.line(centerX, covidY + rectHeight, centerX, trunkY);
  // Línea troncal
  doc.line(20, trunkY, 180, trunkY);

  // c) Dibujamos cada caja, colgando con una línea corta
  const smallLine = 4; // pequeña línea vertical
  const boxX = rowStartX * (boxW + boxGap);
  const boxCenterX = boxX + boxW / 2;
  // Línea vertical corta
  doc.line(boxCenterX, trunkY, boxCenterX, trunkY + smallLine);
  drawC(doc, "PRIMERA", 10, trunkY + 5, 25, 10, datos.tipoooo === 'P1' ? true : false);
  drawC(doc, "SEGUNDA", 50, trunkY + 5, 25, 10, datos.tipoooo === 'P2' ? true : false);
  drawC(doc, "PA", 90, trunkY + 5, 25, 10, datos.tipoooo === 'PA' ? true : false);
  drawC(doc, "HOTEL", 130, trunkY + 5, 25, 10, datos.tipoooo === 'PC' ? true : false);
  drawC(doc, "PCON", 170, trunkY + 5, 25, 10, datos.tipoooo === 'PCON' ? true : false);
  doc.line(20, trunkY, 20, trunkY + 5)
  doc.line(60, trunkY, 60, trunkY + 5)
  doc.line(100, trunkY, 100, trunkY + 5)
  doc.line(140, trunkY, 140, trunkY + 5)
  doc.line(180, trunkY, 180, trunkY + 5)

  // -----------------------------------------------------------------------
  // NUEVO: LÍNEA HORIZONTAL DEBAJO DE SEGUNDA, PA, HOTEL, PCON
  // Para conectar luego EVALUACION MEDICA y ALTA EPIDEMIOLOGICA
  // -----------------------------------------------------------------------
  const secondIndex = 1; // "SEGUNDA"
  const lastIndex = 4;   // "PCON"

  // Ajusta la altura donde quieres la nueva línea
  const lineBelowBoxesY = trunkY + smallLine + boxH + 10;

  // X del centro de la "SEGUNDA"
  const secondBoxCenterX = rowStartX + secondIndex * (boxW + boxGap) + boxW / 2;
  // X del centro de la "PCON"
  const lastBoxCenterX = rowStartX + lastIndex * (boxW + boxGap) + boxW / 2;

  // Dibujamos la línea horizontal
  doc.line(20, lineBelowBoxesY, lastBoxCenterX, lineBelowBoxesY);

  // Bajamos líneas verticales desde cada caja [SEGUNDA..PCON]
  for (let i = secondIndex; i <= lastIndex; i++) {
    const boxX = rowStartX + i * (boxW + boxGap);
    const boxCenterX = boxX + boxW / 2;
    doc.line(boxCenterX, trunkY + smallLine + boxH + 3, boxCenterX, lineBelowBoxesY);
  }
  doc.line(20, trunkY + smallLine + boxH + 3, 20, lineBelowBoxesY)
  // d) EVALUACION MEDICA y ALTA EPIDEMIOLOGICA
  // Menor espacio debajo
  const bigBoxW = 60;
  const bigBoxH = 8;
  const bigGap = 20;
  // Ajustamos la altura para que cuelguen de la línea nueva
  const bigRowY = lineBelowBoxesY + 12;
  const totalBigWidth = 2 * bigBoxW + bigGap;
  const bigRowX = centerX - totalBigWidth / 2;

  // EVALUACION MEDICA
  drawC(doc, "EVALUACION MEDICA", bigRowX, bigRowY, bigBoxW, bigBoxH, datos.anexo7c)

  // ALTA EPIDEMIOLOGICA
  const altaX = bigRowX + bigBoxW + bigGap;
  drawC(doc, "ALTA EPIDEMIOLOGICA", altaX, bigRowY, bigBoxW, bigBoxH, datos.altaepidemiologica)

  // -----------------------------------------------------------------------
  // QUITADO: Antes conectábamos PA -> EVALUACION MEDICA y HOTEL -> ALTA
  // doc.line(paCenterX, trunkY + smallLine + boxH, bigRowX + bigBoxW / 2, bigRowY);
  // doc.line(hotelCenterX, trunkY + smallLine + boxH, altaX + bigBoxW / 2, bigRowY);
  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------
  // NUEVO: Conectamos EVALUACION MEDICA y ALTA EPIDEMIOLOGICA
  // desde la NUEVA línea horizontal
  // -----------------------------------------------------------------------
  // Por ejemplo, usando las posiciones de "PA" y "HOTEL" en la línea nueva
  const hotelIndex = 3; // "HOTEL"

  // X de "PA" en la nueva línea
  const paNewLineX = rowStartX + paIndex * (boxW + boxGap) + boxW / 2;
  // X de "HOTEL" en la nueva línea
  const hotelNewLineX = rowStartX + hotelIndex * (boxW + boxGap) + boxW / 2;

  // Conectar la línea nueva con EVALUACION MEDICA
  doc.line(paNewLineX, lineBelowBoxesY, bigRowX + bigBoxW / 2, bigRowY);

  // Conectar la línea nueva con ALTA EPIDEMIOLOGICA
  doc.line(hotelNewLineX, lineBelowBoxesY, altaX + bigBoxW / 2, bigRowY);

  // Ajustamos para seguir debajo de esas cajas
  let finalY = bigRowY + bigBoxH + 8;

  // 6) Tabla de síntomas (opcional)
  autoTable(doc, {
    startY: finalY,
    body: [
      ["Tos", " ", "Fiebre/ Escalofrío", " ", "Cefalea", " "],
      ["Dolor de Garganta", " ", "Malestar General", " ", "Irritabilidad", " "],
      ["Congestión Nasal", " ", "Diarrea", " ", "Dolor", " "],
      ["Dificultad respiratoria", " ", "Nauseas Vómitos", " ", "Otros:", " "],
      [
        { content: "Persona de contacto:", colSpan: 2 },
        { content: "Celular del contacto:", colSpan: 4 },
      ],
    ],
    theme: "grid",
    styles: {
      fontSize: 7,
      textColor: [0, 0, 0],
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineWidth: 0.5,
      lineColor: [0, 0, 0],
    },
    bodyStyles: {
      lineWidth: 0.5,
      lineColor: [0, 0, 0],
    },
  });

  // 7) Footer
  footer(doc, datos);

  // Abre el PDF
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();

};

