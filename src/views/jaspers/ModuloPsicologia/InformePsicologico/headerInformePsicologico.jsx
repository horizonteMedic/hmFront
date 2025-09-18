const headerInformePsicologico = (doc, datos) => {
  const margin = 3;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 5;

  // === 1) LOGO A LA IZQUIERDA ===
  const logoW = 45;
  const logoH = 15;
  const logoY = y + 2;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, logoY, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, logoY + 8);
  }

  // === 2) INFORMACIÓN DE CONTACTO EN LA PARTE SUPERIOR DERECHA ===
  // La información de contacto ahora se maneja en el footer

  // === 3) NÚMERO DE FICHA Y SEDE EN LA ESQUINA SUPERIOR DERECHA ===
  const fichaX = pageW - margin - 20;
  const fichaY = y +2;
  
  // Sede
  const sedeValue = `${datos.sede || 'Trujillo-Piérola'}`;
  doc.setFont("helvetica", "normal").setFontSize(9);
  // doc.text(`Sede : ${sedeValue}`, fichaX, fichaY, { align: "right" });
  
  // Código de entrevista
  const codigoY = fichaY + 5;
  // const codigoValue = String(datos.codigoEntrevista || "63163");
  doc.text(`Sede : ${sedeValue}`, fichaX, codigoY, { align: "right" });
  
  // Número de ficha
  const fichaNumY = codigoY + 8;
  const fichaNum = String(datos.norden || datos.numeroFicha || "99164");
  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.text(`N° de Ficha : ${fichaNum}`, fichaX, fichaNumY, { align: "right" });

    // === 3) BLOQUE CÓDIGO DE COLOR ===
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 500;
  if (colorValido) {
    const color = datos.codigoColor || "#008f39";
    const boxText = (datos.textoColor || "F").toUpperCase();
    let boxSize = 15;
    let boxX = pageW - margin - boxSize;
    let boxY = y + 2;
    
    // Draw box outline in black
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
    
    // Solo renderiza si color es válido o para prueba
    doc.setDrawColor(color);
    doc.setLineWidth(2);
    doc.setLineCap("round");
    doc.line(boxX + boxSize + 3, boxY, boxX + boxSize + 3, boxY + boxSize);
    doc.setLineCap("butt");
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color);
    doc.text(boxText, boxX + boxSize / 2, boxY + boxSize / 2, {
      align: "center",
      baseline: "middle",
      maxWidth: boxSize - 1,
    });
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2);
  }


  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default headerInformePsicologico;