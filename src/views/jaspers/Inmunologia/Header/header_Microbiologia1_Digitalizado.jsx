/**
 * Formatea una fecha en formato "dd mes yyyy" (ej. "04 noviembre 2024").
 * @param {string} dateString - La fecha en formato YYYY-MM-DD.
 * @returns {string} - La fecha formateada.
 */
const formatDateToSpanish = (dateString) => {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  const options = { year: 'numeric', month: 'long', day: '2-digit' };
  return new Intl.DateTimeFormat('es-ES', options).format(date).replace(/ de/g, '');
};

/**
 * Dibuja el encabezado para los reportes de Microbiología 1.
 * @param {jsPDF} doc - La instancia del documento jsPDF.
 * @param {object} datos - Los datos a imprimir (norden, nombres, edad, fecha, etc.).
 */
const headerMicrobiologia1Digitalizado = (doc, datos = {}) => {
  const margin = 15;
  const pageW = doc.internal.pageSize.getWidth();
  const y = 10;

  // 1. Logo a la izquierda
  const img = "./img/logo-color.png";
  try {
    doc.addImage(img, "PNG", margin, y, 50, 16);
  } catch (error) {
    console.error("No se pudo cargar el logo. Asegúrese de que la ruta es correcta.", error);
    doc.text("Policlinico Horizonte Medic", margin, y + 8);
  }

  // --- Código de color ---
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y + 2;
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

  // --- Nro Orden pegado a la derecha o ajustado si hay color ---
  const nroOrdenLabel = "Nro Orden :";
  const nroOrdenValue = String(datos.norden || '');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  let nroOrdenX = colorValido ? (boxX - nroOrdenValueWidth - nroOrdenLabelWidth - 10) : (pageW - margin - nroOrdenValueWidth - nroOrdenLabelWidth);
  let nroOrdenY = y + 8;
  doc.text(nroOrdenLabel, nroOrdenX, nroOrdenY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(nroOrdenValue, nroOrdenX + nroOrdenLabelWidth + 2, nroOrdenY);
  doc.setLineWidth(0.3);
  doc.line(nroOrdenX + nroOrdenLabelWidth + 2, nroOrdenY + 1.5, nroOrdenX + nroOrdenLabelWidth + 2 + nroOrdenValueWidth, nroOrdenY + 1.5);

  // --- Datos del paciente ---
  let patientDataY = y + 35;
  const patientDataX = margin;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Apellidos y Nombres :", patientDataX, patientDataY);
  doc.setFont('helvetica', 'normal');
  const labelWidthNombres = doc.getTextWidth("Apellidos y Nombres :");
  doc.text(String(datos.nombres || '').toUpperCase(), patientDataX + labelWidthNombres + 4, patientDataY);
  patientDataY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text("Edad :", patientDataX, patientDataY);
  doc.setFont('helvetica', 'normal');
  const labelWidthEdad = doc.getTextWidth("Edad :");
  doc.text(String(datos.edad ? `${datos.edad} AÑOS` : ''), patientDataX + labelWidthEdad + 4, patientDataY);
  patientDataY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text("Fecha :", patientDataX, patientDataY);
  doc.setFont('helvetica', 'normal');
  const labelWidthFecha = doc.getTextWidth("Fecha :");
  doc.text(String(datos.fecha), patientDataX + labelWidthFecha + 4, patientDataY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setLineWidth(0.2);
};

export default headerMicrobiologia1Digitalizado; 