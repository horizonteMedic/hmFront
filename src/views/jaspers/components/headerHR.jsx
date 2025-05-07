// views/jaspers/components/headerHR.js

const headerHR = (doc, datos) => {
  console.log(datos)
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
    doc.text(boxText, boxX + boxSize/2, boxY + (boxSize/2), { 
      align: "center",
      baseline: "middle",
      maxWidth: boxSize - 1
    });
  }

  // Draw top and bottom lines
  doc.setLineWidth(0.5);
  doc.line(margin, yOffset, pageW - margin, yOffset);
  
  // Draw box with "$sf" text on the right
  
  
  // Set colored text
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(color);
  
  // Reset text color to default black
  doc.setTextColor(0);

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

  // Rest of the content with adjusted Y positions
  doc
    .setFontSize(12)
    .text(
      `HOJA DE RUTA${datos.examen ? " " + datos.examen : ""}`,
      pageW / 2,
      20 + yOffset,  // Increased spacing after title
      { align: "center" }
    );

  // === 3) Campos en negrita ===
  doc.setFontSize(8).setFont("helvetica", "bold");

  // Fila 1: TIPO EX / Fecha / Hora / N° Orden
  const y1 = 35 + yOffset;  // Increased initial position for data
  doc.text(`TIPO EX: ${datos.examen || "___"}`, margin, y1);
  doc.text(`Fecha: ${datos.fecha || "___"}`, margin + 60, y1);
  doc.text(`HORA: ${datos.hora || "___"}`, margin + 110, y1);
  doc.text(`N° DE ORDEN: ${datos.orden || "___"}`, margin + 155, y1);

  // Fila 2: Nombres y Apellidos (dinámico) y Emp. Contratista
  let y2 = y1 + lineHeight;
  const nameText = `NOMBRES Y APELLIDOS: ${datos.nombres || "___"}`;
  const nameLines = doc.splitTextToSize(nameText, 80);
  doc.text(nameLines, margin, y2);

  // Ajustar Y de contratista si el nombre ocupa más de una línea
  const y2b = y2 + (nameLines.length - 1) * lineHeight;
  doc.text(`EMP. CONTRATISTA: ${datos.contrata || "___"}`, margin + 95, y2b);

  // Fila 3: Empresa / Edad / Sede
  const y3 = y2b + lineHeight;
  doc.text(`EMPRESA: ${datos.empresa || "___"}`, margin, y3);
  doc.text(`EDAD: ${datos.edad || "___"}`, margin + 95, y3);
  doc.text(`SEDE: ${datos.nombreSede || "___"}`, margin + 140, y3);

  // Fila 4: Cargo / DNI / G. Sanguíneo
  const y4 = y3 + lineHeight;
  doc.text(`CARGO: ${datos.cargo || "___"}`, margin, y4);
  doc.text(`DNI: ${datos.dni || "___"}`, margin + 95, y4);
  doc.text(`G. SANGUINEO: ${datos.gruposan || "___"}`, margin + 140, y4);

  // Add extra spacing after the data section (30mm margin)
  return y4 + 30;  // Return the final Y position for content that follows
};

export default headerHR;
