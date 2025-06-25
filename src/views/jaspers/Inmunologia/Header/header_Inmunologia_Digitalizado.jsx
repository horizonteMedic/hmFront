/**
 * Formatea una fecha en formato "13 diciembre 2024".
 * @param {string} dateString - La fecha en formato YYYY-MM-DD.
 * @returns {string} - La fecha formateada.
 */
const formatDateToLong = (dateString) => {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Dibuja el encabezado para el reporte de Inmunología genérico.
 * @param {jsPDF} doc - La instancia del documento jsPDF.
 * @param {object} datos - Los datos a imprimir.
 */
const header_Inmunologia_Digitalizado = (doc, datos = {}) => {
  const margin = 15;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 10;

  // 1. Logo a la izquierda
  const img = "./img/logo-color.png";
  try {
    doc.addImage(img, "PNG", margin, y, 60, 20);
  } catch (error) {
    console.error("No se pudo cargar el logo.", error);
    doc.text("Policlinico Horizonte Medic", margin, y + 8);
  }

  // --- Código de color ---
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y - 8;
  if (colorValido) {
    let color = datos.codigoColor || "#008f39";
    let boxText = (datos.textoColor || "F").toUpperCase();
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
    doc.setLineWidth(0.2);
  }

  // --- Sede ---
  const rightColX = pageW - margin;
  const lineHeight = 8;
  doc.setFontSize(10).setFont('helvetica', 'normal');
  doc.text(`Sede : ${datos.sede || ''}`, rightColX, y + 5, { align: 'right' });

  // --- Nro Orden pegado a la derecha o ajustado si hay color ---
  const nroOrdenLabel = "Nro Orden :";
  const nroOrdenValue = String(datos.norden || '');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  let nroOrdenX = colorValido ? (boxX - nroOrdenValueWidth - nroOrdenLabelWidth - 10) : (pageW - margin - nroOrdenValueWidth - nroOrdenLabelWidth);
  y += 10;
  doc.text(nroOrdenLabel, nroOrdenX, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(nroOrdenValue, nroOrdenX + nroOrdenLabelWidth + 2, y);
  doc.setLineWidth(0.3);
  doc.line(nroOrdenX + nroOrdenLabelWidth + 2, y + 1.5, nroOrdenX + nroOrdenLabelWidth + 2 + nroOrdenValueWidth, y + 1.5);

  y += lineHeight;

  // --- Datos del paciente ---
  y += 20;
  const patientDataX = margin;
  const drawPatientDataRow = (label, value) => {
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text(label, patientDataX, y);
    doc.setFont('helvetica', 'normal');
    const labelWidth = doc.getTextWidth(label);
    doc.text(String(value).toUpperCase(), patientDataX + labelWidth + 4, y);
    y += lineHeight;
  };
  drawPatientDataRow("Apellidos y Nombres :", datos.nombres || '');
  drawPatientDataRow("Edad :", datos.edad ? `${datos.edad} AÑOS` : '');
  doc.setFontSize(11).setFont('helvetica', 'bold');
  const fechaLabel = "Fecha :";
  doc.text(fechaLabel, patientDataX, y);
  doc.setFont('helvetica', 'normal');
  const fechaLabelWidth = doc.getTextWidth(fechaLabel);
  doc.text(formatDateToLong(datos.fecha), patientDataX + fechaLabelWidth + 4, y);
  doc.setFont('helvetica', 'normal').setFontSize(10).setLineWidth(0.2);
};

export default header_Inmunologia_Digitalizado; 