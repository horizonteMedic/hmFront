/**
 * Header para ANEXO CB - ANTECEDENTES DE ALTURA (BORO)
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {Object} datos - Datos del documento
 */
const Header_AnexoCB_boro_Digitalizado = (doc, datos = {}) => {
  // Datos por defecto para el header
  const headerData = {
    nombreSede: datos.nombreSede || "TRUJILLO NICOLAS DE PIEROLA - HM",
    numeroFicha: datos.numeroFicha || "99164",
    color: datos.color || 1,
    codigoColor: datos.codigoColor || "#E3BF34",
    textoColor: datos.textoColor || "L"
  };

  const margin = 18;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // === 1) LOGO Y TÍTULO PRINCIPAL ===
  const logoW = 42;
  const logoH = 15;
  const logoY = y - 4;
  const logoX = margin;

  try {
    doc.addImage("./img/logo-color.png", "PNG", logoX, logoY, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", logoX, logoY + 8);
  }

  // === 2) BLOQUE CÓDIGO DE COLOR ===
  const colorValido = typeof headerData.color === "number" && headerData.color >= 1 && headerData.color <= 50;
  const color = headerData.codigoColor || "#E3BF34";
  const boxText = (headerData.textoColor || "L").toUpperCase();
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y - 6.5;

  if (colorValido) {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
    doc.setDrawColor(color);
    doc.setLineWidth(2);
    doc.setLineCap('round');
    doc.line(boxX + boxSize + 3, boxY, boxX + boxSize + 3, boxY + boxSize);
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color);
    doc.text(boxText, boxX + boxSize/2, boxY + boxSize/2, {
      align: "center",
      baseline: "middle",
      maxWidth: boxSize - 1
    });
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2);
  }

  y -= 7;

  // === 3) NÚMERO DE FICHA Y SEDE ===
  const fichaX = pageW - margin - 18;
  const bloqueY = y + 5;

  // Número de orden arriba
  const fichaValue = String(headerData.numeroFicha || '');

  doc.setFont("helvetica", "bold").setFontSize(9);
  const fichaLabel = "N° Ficha:";
  const fichaLabelWidth = doc.getTextWidth(fichaLabel);
  const fichaLabelX = fichaX - fichaLabelWidth - 25;

  doc.text(fichaLabel, fichaLabelX, bloqueY, { align: "left" });
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(fichaValue, fichaX, bloqueY, { align: "right" });

  // === 4) SEDE ===
  const sedeValue = String(headerData.nombreSede || '');
  doc.setFont("helvetica", "normal").setFontSize(8);
  const sedeValueWidth = doc.getTextWidth(sedeValue);

  doc.setFont("helvetica", "bold").setFontSize(9);
  const sedeLabel = "Sede:";
  const sedeLabelWidth = doc.getTextWidth(sedeLabel);
  const sedeLabelX = fichaX - sedeValueWidth - sedeLabelWidth - 5;

  doc.text(sedeLabel, sedeLabelX, bloqueY + 10, { align: "left" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(sedeValue, fichaX, bloqueY + 10, { align: "right" });

  // === 5) TÍTULO PRINCIPAL DEL DOCUMENTO ===
  y = y + 35;

  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);

  const titulo = "ENFERMEDADES QUE PUEDEN AGRAVARSE EN ALTITUD GEOGRÁFICA";
  const tituloX = pageW / 2;

  doc.text(titulo, tituloX, y, { align: "center" });

  // Subrayar el título
  const tituloWidth = doc.getTextWidth(titulo);
  const tituloStartX = tituloX - tituloWidth / 2;

  doc.setLineWidth(0.5);
  doc.line(tituloStartX, y + 2, tituloStartX + tituloWidth, y + 2);

  // === 6) LÍNEA DIVISORIA ===
  y = y + 8;
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);

  return y + 5;
};

export default Header_AnexoCB_boro_Digitalizado;
