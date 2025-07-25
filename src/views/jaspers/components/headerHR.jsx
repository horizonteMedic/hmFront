// views/jaspers/components/headerHR.js

const headerHR = (doc, datos) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const yOffset = 10;       // separación extra arriba y abajo
  const lineHeight = 4;     // altura entre líneas en mm

  let color = null;
  let boxText = null;

  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  if (colorValido) {
    color = datos.codigoColor || "#008f39";
    boxText = (datos.textoColor || "F").toUpperCase();
  
    const boxSize = 15;
    const boxX = pageW - margin - boxSize;
    const boxY = yOffset + 2;
    
    // Draw box outline in black
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);

    // Solo renderiza si color es válido
    doc.setDrawColor(color);
    doc.setLineWidth(2);
    doc.setLineCap('round');
    doc.line(boxX + boxSize + 3, boxY, boxX + boxSize + 3, boxY + boxSize);
    doc.setLineCap('butt');
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color);
    doc.text(boxText, boxX + boxSize/2, boxY + (boxSize/2), { 
      align: "center",
      baseline: "middle",
      maxWidth: boxSize - 1
    });
    
    // Reset color settings after drawing the colored elements
    doc.setDrawColor(0);
    doc.setTextColor(0);
  }

  // Draw top and bottom lines
  doc.setLineWidth(0.5);
  doc.line(margin, yOffset, pageW - margin, yOffset);
  
  // === 1) Título principal en negrita y centrado ===
  doc
    .setFont("helvetica", "bold")
    .setFontSize(13)
    .text(
      "CORPORACION PERUANA DE CENTROS MEDICOS S.A.C.",
      pageW / 2,
      8 + yOffset + 5,  // Adjusted position
      { align: "center" }
    );

  // Sede al costado izquierdo de "HOJA DE RUTA"
  doc
    .setFont("helvetica", "bold")
    .setFontSize(10)
    .text(
      `SEDE: ${datos.nombreSede || ""}`,
      margin,
      25 + yOffset,
      { align: "left" }
    );

  // "HOJA DE RUTA..." centrado
  doc
    .setFontSize(12)
    .text(
      `HOJA DE RUTA${datos.examen ? " " + datos.examen : ""}`,
      pageW / 2,
      20 + yOffset,
      { align: "center" }
    );

  // === 3) Campos en negrita ===
  doc.setFontSize(9).setFont("helvetica", "bold");

  // Fila 1: TIPO EX / Fecha / Hora / N° Orden
  const y1 = 30 + yOffset;
  doc.setFont("helvetica", "bold");
  doc.text("TIPO EX:", margin, y1);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.examen || ""}`, margin + 20, y1);
  
  doc.setFont("helvetica", "bold");
  doc.text("FECHA:", margin + 80, y1);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.fecha || ""}`, margin + 95, y1);
  
  doc.setFont("helvetica", "bold");
  doc.text("HORA:", margin + 120, y1);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.hora || ""}`, margin + 135, y1);
  
  doc.setFont("helvetica", "bold");
  doc.text("N° DE ORDEN:", margin + 145, y1-6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const orderText = `${datos.orden || ""}`;
  const orderX = margin + 170;
  const orderY = y1-6;
  
  // Draw underline
  const orderWidth = doc.getTextWidth(orderText);
  doc.setLineWidth(0.5);
  doc.line(orderX, orderY + 1, orderX + orderWidth, orderY + 1);
  
  doc.text(orderText, orderX, orderY);
  doc.setFontSize(9);

  // Fila 2: Nombres y Apellidos y Edad
  let y2 = y1 + lineHeight+ 0.5;
  doc.setFont("helvetica", "bold");
  doc.text("NOMBRES Y APELLIDOS:", margin, y2);
  const value = datos.nombres || "";
  const x = margin + 45;
  const y = y2;

  doc.setFont("helvetica", "normal");

  // fondo amarillo solo para el texto del valor
  doc.setFillColor(255, 255, 0);
  doc.rect(x, y - 4.2, doc.getTextWidth(value), 6, "F");

  // texto en negro encima del fondo
  doc.setTextColor(0, 0, 0);
  doc.text(value, x, y);
  
  doc.setFont("helvetica", "bold");
  doc.text("EDAD:", margin + 145, y2);
  doc.setFont("helvetica", "normal");
  const edadText = datos.edad ? `${datos.edad} AÑOS` : "";
  const xedad = margin + 160;
  const yedad = y2;

  doc.setFillColor(255, 255, 0);
  doc.rect(xedad, yedad - 4.2, doc.getTextWidth(edadText), 6, "F");
  doc.setTextColor(0, 0, 0);
  doc.text(edadText, xedad, yedad);

  // Fila 3: Cargo / DNI / G. Sanguíneo
  const y3 = y2 + lineHeight+ 0.5;
  doc.setFont("helvetica", "bold");
  doc.text("CARGO:", margin, y3);
  doc.setFont("helvetica", "normal");
  const cargoText = datos.cargo || "";
  const xCargo = margin + 20;
  const yCargo = y3;

  doc.setFillColor(255, 255, 0); // Yellow background
  doc.rect(xCargo, yCargo - 4.2, doc.getTextWidth(cargoText), 6, "F");
  doc.setTextColor(0, 0, 0); // Black text
  doc.text(cargoText, xCargo, yCargo);
  
  doc.setFont("helvetica", "bold");
  doc.text("DNI:", margin + 100, y3);
  const dni = `${datos.dni || ""}`;
  const xdni = margin + 108;
  const ydni = y3;

  doc.setFillColor(255, 255, 0);
  doc.rect(xdni, ydni - 4.2, doc.getTextWidth(dni), 6, "F");
  doc.setTextColor(0, 0, 0);
  doc.text(dni, xdni, ydni);
  
  doc.setFont("helvetica", "bold");
  doc.text("G. SANGUINEO:", margin + 145, y3);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.gruposan || "-"}`, margin + 175, y3);

  // Fila 4: Empresa (SEDE eliminada)
  const y4 = y3 + lineHeight +0.5;
  doc.setFont("helvetica", "bold");
  doc.text("EMPRESA:", margin, y4);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.empresa || ""}`, margin + 25, y4, { maxWidth: 170 });

  // Fila 5: Empresa Contratista
  const y5 = y4 + lineHeight +2;
  doc.setFont("helvetica", "bold");
  doc.text("EMP. CONTRATISTA:", margin, y5);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.contrata || ""}`, margin + 40, y5, { maxWidth: 170 });

  if (Array.isArray(datos.subReporte) && datos.subReporte.length > 0) {
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold");
  datos.subReporte.forEach((item, index) => {
    doc.text(`${item.orden}        ${item.fecha}            ${item.grupo}`, margin + 124, y5 + 6 + (index * 6));
  });
  }
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal");


  // Add extra spacing after the data section (30mm margin)
  return y5 + 30;  // Updated return value to use y5
};

export default headerHR;
