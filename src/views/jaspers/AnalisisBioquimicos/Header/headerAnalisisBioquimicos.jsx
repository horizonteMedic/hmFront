// src/views/jaspers/Toxicologia/Header/headerAnalisisBioquimicos.js
const headerAnalisisBioquimicos = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 10;

  // 1. Logo a la izquierda
  const img = "./img/logo-color.png"; // Ruta pública
  doc.addImage(img, "PNG", margin, y, 60, 20);

  // 2. Número de Orden (derecha, alineado como en headerPerfilHepatico)
  const rightColX = pageW - margin;
  const nroOrdenLabel = "Nro Orden :";
  const nroOrdenValue = String(datos.norden || "");
  const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  const nroOrdenX = rightColX - nroOrdenValueWidth - nroOrdenLabelWidth - 2;
  doc.setFontSize(11).setFont("helvetica", "normal");
  doc.text(nroOrdenLabel, nroOrdenX, y + 5);
  doc.setFontSize(18).setFont("helvetica", "bold");
  doc.text(nroOrdenValue, nroOrdenX + nroOrdenLabelWidth + 2, y + 5);
  doc.setLineWidth(0.7);
  doc.line(
    nroOrdenX + nroOrdenLabelWidth + 2, y + 6.5,
    nroOrdenX + nroOrdenLabelWidth + 2 + nroOrdenValueWidth, y + 6.5
  );
  doc.setLineWidth(0.2);

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
