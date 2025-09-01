const headerConsentimiento = (doc, datos = {}) => {
  const margin = 15;
  const y = 10;
  const pageW = doc.internal.pageSize.getWidth();
  // Logo a la izquierda
  const img = "./img/logo-color.png"; // Ruta de la imagen en public
  doc.addImage(img, "PNG", margin, y, 50, 16); // ancho 50mm, alto 16mm

  // Nro Orden y Sede a la derecha
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text("Nro Orden :", pageW - 110, y + 6);
  doc.setFontSize(17);
  doc.text(`${datos.norden || ''}`, pageW - 75, y + 6);
  
  // Add underline to the order number
  const textWidth = doc.getTextWidth(`${datos.norden || ''}`);
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(pageW - 75, y + 8, pageW - 75 + textWidth, y + 8);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Sede :", pageW - 110, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.sede || ''}`, pageW - 90, y + 14);


  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 150;
  if (colorValido) {
    let color = datos.codigoColor || "#008f39";
    let boxText = (datos.textoColor || "F").toUpperCase();
  
    const boxSize = 15;
    const boxX = pageW - margin - boxSize;
    const boxY = 10 + 2;
    
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
    doc.setLineWidth(0.2)
  }
};

export default headerConsentimiento; 