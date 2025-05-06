// views/jaspers/components/headerHR.js

const headerHR = (doc, datos) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const yOffset = 10;       // separación extra arriba y abajo
  const lineHeight = 4;     // altura entre líneas en mm

  // Draw top and bottom lines
  doc.setLineWidth(0.5);
  doc.line(margin, yOffset, pageW - margin, yOffset);
  
  // Draw box with "$sf" text on the right
  const boxSize = 15;
  const boxX = pageW - margin - boxSize;
  const boxY = yOffset + 2;
  doc.rect(boxX, boxY, boxSize, boxSize);
  doc.setFontSize(10);
  doc.text("$sf", boxX + boxSize/2, boxY + boxSize/2, { align: "center" });

  // === 1) Título principal en negrita y centrado ===
  doc
    .setFont("helvetica", "bold")
    .setFontSize(13)
    .text(
      "CORPORACION PERUANA DE CENTROS MEDICOS S.A.C.",
      pageW / 2,
      8 + yOffset + 10,  // Added offset to push content down
      { align: "center" }
    );

  // Rest of the content with adjusted Y positions (+10 to push everything down)
  doc
    .setFontSize(12)
    .text(
      `HOJA DE RUTA${datos.examen ? " " + datos.examen : ""}`,
      pageW / 2,
      15 + yOffset + 10,
      { align: "center" }
    );

  // === 3) Campos en negrita ===
  doc.setFontSize(8).setFont("helvetica", "bold");

  // Fila 1: TIPO EX / Fecha / Hora / N° Orden
  const y1 = 24 + yOffset;
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
  doc.text(`EDAD: ${datos.edad + "AÑOS"|| "___"}`, margin + 95, y3);
  doc.text(`SEDE: ${datos.nombreSede || "___"}`, margin + 140, y3);

  // Fila 4: Cargo / DNI / G. Sanguíneo
  const y4 = y3 + lineHeight;
  doc.text(`CARGO: ${datos.cargo || "___"}`, margin, y4);
  doc.text(`DNI: ${datos.dni || "___"}`, margin + 95, y4);
  doc.text(`G. SANGUINEO: ${datos.gruposan || "___"}`, margin + 140, y4);

  // Draw bottom line
  const finalY = y4 + lineHeight;  // Get the Y position after all content
  doc.line(margin, finalY + 5, pageW - margin, finalY + 5);
};

export default headerHR;
