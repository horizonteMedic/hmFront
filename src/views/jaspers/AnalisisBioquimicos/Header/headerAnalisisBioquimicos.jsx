// src/views/jaspers/Toxicologia/Header/headerAnalisisBioquimicos.js
const headerAnalisisBioquimicos = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 10;

  // 1. Logo a la izquierda
  const img = "./img/logo-color.png"; // Ruta pública
  doc.addImage(img, "PNG", margin, y, 60, 20);

  // --- NRO ORDEN y SEDE alineados a la derecha ---
  const rightColX = pageW - margin;
  const nroOrdenLabel = "Nro Orden :";
  const nroOrdenValue = String(datos.norden || "");
  const sedeLabel = "Sede :";
  const sedeValue = datos.sede || "";
  const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  const sedeLabelWidth = doc.getTextWidth(sedeLabel);
  const sedeValueWidth = doc.getTextWidth(sedeValue);

  // Calcula el ancho máximo de los bloques de texto
  const maxTextWidth = Math.max(
    nroOrdenLabelWidth + 2 + nroOrdenValueWidth,
    sedeLabelWidth + 2 + sedeValueWidth
  );

  // Espacio entre textos y cuadro de color
  const colorBoxMargin = 10;

  // Posición X de los textos (dejando espacio para el cuadro de color)
  const textX = rightColX - 15 - maxTextWidth - colorBoxMargin - 15; // 15mm para el cuadro de color
  const nroOrdenY = y + 5;
  const sedeY = nroOrdenY + 10;

  // NRO ORDEN
  doc.setFontSize(11).setFont("helvetica", "normal");
  doc.text(nroOrdenLabel, textX, nroOrdenY);
  doc.setFontSize(18).setFont("helvetica", "bold");
  doc.text(nroOrdenValue, textX + nroOrdenLabelWidth + 2, nroOrdenY);
  doc.setLineWidth(0.7);
  doc.line(
    textX + nroOrdenLabelWidth + 2, nroOrdenY + 1.5,
    textX + nroOrdenLabelWidth + 2 + nroOrdenValueWidth, nroOrdenY + 1.5
  );
  doc.setLineWidth(0.2);

  // SEDE
  doc.setFontSize(11).setFont("helvetica", "bold");
  doc.text(sedeLabel, textX, sedeY);
  doc.setFont("helvetica", "normal");
  doc.text(sedeValue, textX + sedeLabelWidth + 2, sedeY);

  // --- Cuadro de color a la derecha de los textos ---
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 500;
  if (colorValido) {
    let color = datos.codigoColor || "#008f39";
    let boxText = (datos.textoColor || "F").toUpperCase();
    const boxSize = 15;
    // El cuadro de color alineado verticalmente con el NRO ORDEN y SEDE
    const boxX = rightColX - boxSize;
    const boxY = nroOrdenY - 5;
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
