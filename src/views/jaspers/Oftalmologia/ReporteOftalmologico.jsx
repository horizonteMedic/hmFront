import jsPDF from "jspdf";
import header_ReporteOftalmologico from "./headers/header_ReporteOftalmologico.jsx";

function drawOftalmoTable(doc, datos = {}) {
  const margin = 10;
  const startY = 40;
  const rowH = 8;
  // Columnas: N° ORDEN, FECHA INGRESO, SIN CORREGIR (4), CORREGIDA (4), VISION DE COLORES, VISION BINOCULAR, REFLEJOS PUPILARES, ENFERMEDADES OCULARES
  // SIN CORREGIR: CERCA OD, CERCA OI, LEJOS OD, LEJOS OI
  // CORREGIDA: CERCA OD, CERCA OI, LEJOS OD, LEJOS OI
  const colW = [18, 28, 16, 16, 16, 16, 16, 16, 16, 16, 28, 22, 32, 38];
  const pageW = doc.internal.pageSize.getWidth();
  const totalW = colW.reduce((a, b) => a + b, 0);
  const scale = (pageW - 2 * margin) / totalW;
  const colWScaled = colW.map((w) => w * scale);

  // 1ra fila: agrupados
  let x = margin;
  let y = startY;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.rect(x, y, colWScaled[0], rowH * 3); // N° ORDEN
  doc.text("N°\nORDEN", x + colWScaled[0] / 2, y + rowH * 1.5, {
    align: "center",
    baseline: "middle",
  });
  x += colWScaled[0];
  doc.rect(x, y, colWScaled[1], rowH * 3); // FECHA INGRESO
  doc.text("FECHA\nINGRESO", x + colWScaled[1] / 2, y + rowH * 1.5, {
    align: "center",
    baseline: "middle",
  });
  x += colWScaled[1];
  // SIN CORREGIR
  doc.rect(
    x,
    y,
    colWScaled[2] + colWScaled[3] + colWScaled[4] + colWScaled[5],
    rowH
  );
  doc.text(
    "SIN CORREGIR",
    x + (colWScaled[2] + colWScaled[3] + colWScaled[4] + colWScaled[5]) / 2,
    y + rowH / 2 + 1,
    { align: "center" }
  );
  // CORREGIDA
  doc.rect(
    x + colWScaled[2] + colWScaled[3] + colWScaled[4] + colWScaled[5],
    y,
    colWScaled[6] + colWScaled[7] + colWScaled[8] + colWScaled[9],
    rowH
  );
  doc.text(
    "CORREGIDA",
    x +
      colWScaled[2] +
      colWScaled[3] +
      colWScaled[4] +
      colWScaled[5] +
      (colWScaled[6] + colWScaled[7] + colWScaled[8] + colWScaled[9]) / 2,
    y + rowH / 2 + 1,
    { align: "center" }
  );
  // VISION DE COLORES
  doc.rect(
    x +
      colWScaled[2] +
      colWScaled[3] +
      colWScaled[4] +
      colWScaled[5] +
      colWScaled[6] +
      colWScaled[7] +
      colWScaled[8] +
      colWScaled[9],
    y,
    colWScaled[10],
    rowH * 3
  );
  doc.text(
    "VISION DE\nCOLORES",
    x +
      colWScaled[2] +
      colWScaled[3] +
      colWScaled[4] +
      colWScaled[5] +
      colWScaled[6] +
      colWScaled[7] +
      colWScaled[8] +
      colWScaled[9] +
      colWScaled[10] / 2,
    y + rowH * 1.5,
    { align: "center", baseline: "middle" }
  );
  // VISION BINOCULAR
  doc.rect(
    x +
      colWScaled[2] +
      colWScaled[3] +
      colWScaled[4] +
      colWScaled[5] +
      colWScaled[6] +
      colWScaled[7] +
      colWScaled[8] +
      colWScaled[9] +
      colWScaled[10],
    y,
    colWScaled[11],
    rowH * 3
  );
  doc.text(
    "VISION\nBINOCULAR",
    x +
      colWScaled[2] +
      colWScaled[3] +
      colWScaled[4] +
      colWScaled[5] +
      colWScaled[6] +
      colWScaled[7] +
      colWScaled[8] +
      colWScaled[9] +
      colWScaled[10] +
      colWScaled[11] / 2,
    y + rowH * 1.5,
    { align: "center", baseline: "middle" }
  );
  // REFLEJOS PUPILARES
  doc.rect(
    x +
      colWScaled[2] +
      colWScaled[3] +
      colWScaled[4] +
      colWScaled[5] +
      colWScaled[6] +
      colWScaled[7] +
      colWScaled[8] +
      colWScaled[9] +
      colWScaled[10] +
      colWScaled[11],
    y,
    colWScaled[12],
    rowH * 3
  );
  doc.text(
    "REFLEJOS\nPUPILARES",
    x +
      colWScaled[2] +
      colWScaled[3] +
      colWScaled[4] +
      colWScaled[5] +
      colWScaled[6] +
      colWScaled[7] +
      colWScaled[8] +
      colWScaled[9] +
      colWScaled[10] +
      colWScaled[11] +
      colWScaled[12] / 2,
    y + rowH * 1.5,
    { align: "center", baseline: "middle" }
  );
  // ENFERMEDADES OCULARES
  doc.rect(
    x +
      colWScaled[2] +
      colWScaled[3] +
      colWScaled[4] +
      colWScaled[5] +
      colWScaled[6] +
      colWScaled[7] +
      colWScaled[8] +
      colWScaled[9] +
      colWScaled[10] +
      colWScaled[11] +
      colWScaled[12],
    y,
    colWScaled[13],
    rowH * 3
  );
  doc.text(
    "ENFERMEDADES\nOCULARES",
    x +
      colWScaled[2] +
      colWScaled[3] +
      colWScaled[4] +
      colWScaled[5] +
      colWScaled[6] +
      colWScaled[7] +
      colWScaled[8] +
      colWScaled[9] +
      colWScaled[10] +
      colWScaled[11] +
      colWScaled[12] +
      colWScaled[13] / 2,
    y + rowH * 1.5,
    { align: "center", baseline: "middle" }
  );

  // 2da fila: subcolumnas
  x = margin + colWScaled[0] + colWScaled[1];
  y += rowH;
  // SIN CORREGIR subdivisiones
  doc.rect(x, y, colWScaled[2] + colWScaled[3], rowH);
  doc.text(
    "VISION DE CERCA",
    x + (colWScaled[2] + colWScaled[3]) / 2,
    y + rowH / 2 + 1,
    { align: "center" }
  );
  doc.rect(
    x + colWScaled[2] + colWScaled[3],
    y,
    colWScaled[4] + colWScaled[5],
    rowH
  );
  doc.text(
    "VISION DE LEJOS",
    x + colWScaled[2] + colWScaled[3] + (colWScaled[4] + colWScaled[5]) / 2,
    y + rowH / 2 + 1,
    { align: "center" }
  );
  // CORREGIDA subdivisiones
  x += colWScaled[2] + colWScaled[3] + colWScaled[4] + colWScaled[5];
  doc.rect(x, y, colWScaled[6] + colWScaled[7], rowH);
  doc.text(
    "VISION DE CERCA",
    x + (colWScaled[6] + colWScaled[7]) / 2,
    y + rowH / 2 + 1,
    { align: "center" }
  );
  doc.rect(
    x + colWScaled[6] + colWScaled[7],
    y,
    colWScaled[8] + colWScaled[9],
    rowH
  );
  doc.text(
    "VISION DE LEJOS",
    x + colWScaled[6] + colWScaled[7] + (colWScaled[8] + colWScaled[9]) / 2,
    y + rowH / 2 + 1,
    { align: "center" }
  );

  // 3ra fila: OD/OI
  x = margin + colWScaled[0] + colWScaled[1];
  y += rowH;
  // SIN CORREGIR OD/OI
  doc.rect(x, y, colWScaled[2], rowH);
  doc.text("OD", x + colWScaled[2] / 2, y + rowH / 2 + 1, { align: "center" });
  x += colWScaled[2];
  doc.rect(x, y, colWScaled[3], rowH);
  doc.text("OI", x + colWScaled[3] / 2, y + rowH / 2 + 1, { align: "center" });
  x += colWScaled[3];
  doc.rect(x, y, colWScaled[4], rowH);
  doc.text("OD", x + colWScaled[4] / 2, y + rowH / 2 + 1, { align: "center" });
  x += colWScaled[4];
  doc.rect(x, y, colWScaled[5], rowH);
  doc.text("OI", x + colWScaled[5] / 2, y + rowH / 2 + 1, { align: "center" });
  // CORREGIDA OD/OI
  x += colWScaled[5];
  doc.rect(x, y, colWScaled[6], rowH);
  doc.text("OD", x + colWScaled[6] / 2, y + rowH / 2 + 1, { align: "center" });
  x += colWScaled[6];
  doc.rect(x, y, colWScaled[7], rowH);
  doc.text("OI", x + colWScaled[7] / 2, y + rowH / 2 + 1, { align: "center" });
  x += colWScaled[7];
  doc.rect(x, y, colWScaled[8], rowH);
  doc.text("OD", x + colWScaled[8] / 2, y + rowH / 2 + 1, { align: "center" });
  x += colWScaled[8];
  doc.rect(x, y, colWScaled[9], rowH);
  doc.text("OI", x + colWScaled[9] / 2, y + rowH / 2 + 1, { align: "center" });

  // 4ta fila: datos de ejemplo
  x = margin;
  y += rowH;
  doc.setFont("helvetica", "normal").setFontSize(8);
  // const fila = [
  //   datos.norden || "97800",
  //   datos.fecha || "28/06/2025",
  //   "20/20", "20/20", "20/20", "20/20", // Sin corregir: cerca OD, cerca OI, lejos OD, lejos OI
  //   "00", "00", "00", "00", // Corregida: cerca OD, cerca OI, lejos OD, lejos OI
  //   datos.visionColores || "NORMAL",
  //   datos.visionBinocular || "20/20",
  //   datos.reflejosPupilares || "CONSERVADO",
  //   datos.enfermedadesOculares || "NINGUNA"
  // ];
  const fila = [
    String(datos.norden ?? ""),
    String(datos.fechaOf ?? ""),
    String(datos.vcercaSOd ?? ""),
    String(datos.vcercaSOi ?? ""),
    String(datos.vlejosSOd ?? ""),
    String(datos.vlejosSOi ?? ""),
    String(datos.vcercaCOd ?? ""),
    String(datos.vcercaCOi ?? ""),
    String(datos.vlejosCOd ?? ""),
    String(datos.vlejosCOi ?? ""),
    String(datos.vcolores ?? ""),
    String(datos.vbinocular ?? ""),
    String(datos.rpupilares ?? ""),
    String(datos.eoculares ?? ""),
  ];

  let dataX = margin;
  let dataY = y;
  for (let i = 0; i < fila.length; i++) {
    if (i == fila.length - 1 || i == fila.length - 2) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.rect(dataX, dataY, colWScaled[i], rowH);
      doc.text(fila[i], dataX + colWScaled[i] / 2, dataY + rowH / 2 - 1, {
        align: "center",
        maxWidth: colWScaled[i],
      });
      doc.setFont("helvetica", "normal").setFontSize(8);
    } else {
      doc.rect(dataX, dataY, colWScaled[i], rowH);
      doc.text(fila[i], dataX + colWScaled[i] / 2, dataY + rowH / 2 + 1, {
        align: "center",
        maxWidth: colWScaled[i],
      });
    }

    dataX += colWScaled[i];
  }
  // --- Fila extra ---
  y += rowH; // mover a la siguiente fila
  const fila2 = [
    datos.fechaOfLo == null ? "" : `${datos.norden}`,
    String(datos.fechaOfLo ?? ""),
    String(datos.vcsodLo ?? ""),
    String(datos.vcsoiLo ?? ""),
    String(datos.vlsodLo ?? ""),
    String(datos.vlsoiLo ?? ""),
    String(datos.vccodLo ?? ""),
    String(datos.vccoiLo ?? ""),
    String(datos.vlcodLo ?? ""),
    String(datos.vlcoiLo ?? ""),
    String(datos.vcoloresLo ?? ""),
    String(datos.vbinocularLo ?? ""),
    String(datos.rpupilaresLo ?? ""),
    String(datos.eocularesLo ?? ""),
  ];

  dataX = margin;
  dataY = y;

  for (let i = 0; i < fila2.length; i++) {
    doc.rect(dataX, dataY, colWScaled[i], rowH);
    if (i == fila2.length - 1 || i == fila2.length - 2) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(fila2[i], dataX + colWScaled[i] / 2, dataY + rowH / 2 - 1, {
        align: "center",
      });
      doc.setFont("helvetica", "normal").setFontSize(8);
    } else {
      doc.text(fila2[i], dataX + colWScaled[i] / 2, dataY + rowH / 2 + 1, {
        align: "center",
      });
    }

    dataX += colWScaled[i];
  }
}

export default function ReporteOftalmologico(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  header_ReporteOftalmologico(doc, datos);
  drawOftalmoTable(doc, datos);
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
