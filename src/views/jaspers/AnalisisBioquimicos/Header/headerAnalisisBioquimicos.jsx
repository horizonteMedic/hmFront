// src/views/jaspers/Toxicologia/Header/headerAnalisisBioquimicos.js
const headerAnalisisBioquimicos = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const yOffset = 10;
  let y = yOffset;

  // 1. Logo a la izquierda
  const img = "./img/logo-color.png"; // Ruta pública
  doc.addImage(img, "PNG", margin, y, 50, 16);
  y += 18;

  // 2. Número de Orden (movido más a la izquierda)
  const nroOrdenLabel = "Nro Orden :";
  const nroOrdenValue = String(datos.norden || "");
  doc.setFontSize(11).setFont("helvetica", "bold");
  doc.text(nroOrdenLabel, pageW - margin - 90, y);
  doc.setFontSize(18).setFont("helvetica", "bold");
  doc.text(nroOrdenValue, pageW - margin - 40, y, { align: "right" });
  // Subrayado
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  doc.setLineWidth(0.7);
  doc.line(pageW - margin - 40 - nroOrdenValueWidth, y + 1.5, pageW - margin - 40, y + 1.5);
  doc.setLineWidth(0.2);
  y += 8;

  // 3. Sede (movido más a la izquierda, alineado con Nro Orden)
  doc.setFont("helvetica", "bold");
  doc.text("Sede :", pageW - margin - 90, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.sede || ""}`, pageW - margin - 20, y, { align: "right" });
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
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

export default headerAnalisisBioquimicos;
