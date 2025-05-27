const headerTriaje = (doc, datos) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const yOffset = 10;       // separación extra arriba y abajo
  const textYOffset = 12;   // sube un poco el texto principal
  const lineHeight = 4;     // altura entre líneas en mm

  // Agregar logo
  const img = "./img/logo-color.png";
  doc.addImage(img, "PNG", margin, yOffset, 70, 22);

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

  // === 1) Título principal en negrita y centrado ===
  // doc
  //   .setFont("helvetica", "bold")
  //   .setFontSize(13)
  //   .text(
  //     "CORPORACION PERUANA DE CENTROS MEDICOS S.A.C.",
  //     pageW / 2,
  //     8 + yOffset + 5 + textYOffset,
  //     { align: "center" }
  //   );

  // Sede, fecha y hora a la derecha, alineadas con el logo
  const sedeY = yOffset + 8;
  const sedeX = pageW - margin;
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text(`SEDE: ${datos.sede }`, sedeX, sedeY, { align: "right" });
  doc.text(`FECHA: ${datos.fecha_triaje || ""}`, sedeX, sedeY + 7, { align: "right" });
  doc.text(`HORA: ${datos.hora || ""}`, sedeX, sedeY + 14, { align: "right" });

  // "INFORME TRIAJE" centrado
  doc
    .setFontSize(14)
    .setFont("helvetica", "bold")
    .text(
      "INFORME TRIAJE",
      pageW / 2,
      20 + yOffset + textYOffset,
      { align: "center" }
    );

  // === 2) Campos en negrita ===
  doc.setFontSize(9).setFont("helvetica", "bold");

  // Fila 1: N° Orden / Hora
  const y1 = 30 + yOffset + textYOffset;
  // N° DE ORDEN a la derecha
  doc.setFont("helvetica", "bold");
  const orderLabel = "N° DE ORDEN:";
  const orderText = `${datos.n_orden || ""}`;
  doc.setFontSize(9);
  const orderBoxW = 28;
  const orderBoxH = 10;
  const orderBoxX = pageW - margin - orderBoxW;
  const orderBoxY = y1 - orderBoxH/2 - 3;
  // Etiqueta a la izquierda del recuadro
  const orderLabelX = orderBoxX - doc.getTextWidth(orderLabel) - 3;
  doc.text(orderLabel, orderLabelX, y1);
  // Dibuja el recuadro
  doc.setDrawColor(0);
  doc.rect(orderBoxX, orderBoxY, orderBoxW, orderBoxH);
  // Número centrado en el recuadro
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(orderText, orderBoxX + orderBoxW/2, orderBoxY + orderBoxH/2 + 1, { align: "center", baseline: "middle" });
  doc.setFontSize(9);

  // Fila 2: Nombres y Apellidos
  let y2 = y1 + lineHeight + 2;
  doc.setFont("helvetica", "bold");
  doc.text("NOMBRES Y APELLIDOS:", margin, y2);
  const value = datos.nombres + ' ' + datos.apellidos || "";
  const x = margin + 45;
  const y = y2;

  doc.setFont("helvetica", "normal");

  // fondo amarillo solo para el texto del valor
  doc.setFillColor(255, 255, 0);
  doc.rect(x, y - 4.2, doc.getTextWidth(value), 6, "F");

  // texto en negro encima del fondo
  doc.setTextColor(0, 0, 0);
  doc.text(value, x, y);

  // Fila 3: Sexo y Fecha de Nacimiento
  const y3 = y2 + lineHeight + 2;
  doc.setFont("helvetica", "bold");
  doc.text("SEXO:", margin, y3);
  doc.setFont("helvetica", "normal");
  const sexoText = datos.sexo_pa === "M" ? "MASCULINO" : "FEMENINO" || "";
  const xSexo = margin + 20;
  const ySexo = y3;

  doc.setFillColor(255, 255, 0);
  doc.rect(xSexo, ySexo - 4.2, doc.getTextWidth(sexoText), 6, "F");
  doc.setTextColor(0, 0, 0);
  doc.text(sexoText, xSexo, ySexo);

  doc.setFont("helvetica", "bold");
  doc.text("F. NACIMIENTO:", margin + 100, y3);
  doc.setFont("helvetica", "normal");
  const nacimientoText = datos.fecha_nac || "";
  const xNacimiento = margin + 125;
  const yNacimiento = y3;

  doc.setFillColor(255, 255, 0);
  doc.rect(xNacimiento, yNacimiento - 4.2, doc.getTextWidth(nacimientoText), 6, "F");
  doc.setTextColor(0, 0, 0);
  doc.text(nacimientoText, xNacimiento, yNacimiento);

  // Add extra spacing after the data section
  return y3 + 30;
};

export default headerTriaje; 