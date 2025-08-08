const headerConInformadoOcupacional = (doc, datos) => {
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

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

  // === 2) NÚMERO DE FICHA Y SEDE AL COSTADO DEL BLOQUE DE COLOR ===
  const sedeValue = `${datos.sede || 'ESTE ES UNA SEDE DE PRUEBA'}`;
  const sedeX = pageW - margin - 20;
  const sedeY = y + 6;
  
  // Número de ficha primero
  const fichaNum = String(datos.norden || datos.numeroFicha || "96639");
  const fichaY = sedeY;
  
  // Texto "N° Ficha :" delante del número
  const fichaLabelX = sedeX - 40;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("N° Ficha :", fichaLabelX, fichaY);
  
  // Número de ficha grande y subrayado
  const fichaNumX = fichaLabelX + doc.getTextWidth("N° Ficha :") + 5;
  doc.setFont("helvetica", "bold").setFontSize(22);
  doc.text(fichaNum, fichaNumX, fichaY);
  
  // Subrayar el número de ficha
  const fichaWidth = doc.getTextWidth(fichaNum);
  doc.setLineWidth(0.3);
  doc.line(fichaNumX, fichaY + 1, fichaNumX + fichaWidth, fichaY + 1);
  
  // Sede debajo del número de ficha
  const sedeY2 = sedeY + 8;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(`Sede : ${sedeValue}`, sedeX, sedeY2, { align: "right" });

  // === 3) BLOQUE CÓDIGO DE COLOR ===
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
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

export default headerConInformadoOcupacional;
