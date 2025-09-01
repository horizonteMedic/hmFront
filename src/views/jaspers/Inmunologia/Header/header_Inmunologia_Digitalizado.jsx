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
 * Formatea una fecha en formato dd/mm/yyyy.
 * @param {string} dateString - La fecha en formato YYYY-MM-DD.
 * @returns {string} - La fecha formateada.
 */
const formatDateToShort = (dateString) => {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
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

  // Logo a la izquierda
  const img = "./img/logo-color.png";
  try {
    doc.addImage(img, "PNG", margin, y, 60, 20);
  } catch (error) {
    console.error("No se pudo cargar el logo.", error);
    doc.text("Policlinico Horizonte Medic", margin, y + 8);
  }

  // --- Cuadro de color a la derecha ---
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 150;
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y - 8;
  if (colorValido) {
    let color = datos.codigoColor || "#008f39";
    let boxText = (datos.textoColor || "F").toUpperCase();
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
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
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2);
  }

  // --- Nro Orden y sede alineados a la derecha, sede bajo el número ---
  const nroOrdenLabel = "Nro Orden :";
  const nroOrdenValue = String(datos.norden || '');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  let rightMargin = pageW - margin - (boxSize + 10);
  let nroOrdenX = rightMargin - nroOrdenLabelWidth - nroOrdenValueWidth - 2;
  let nroOrdenY = y + 8;
  // Primera línea: label y número
  doc.text(nroOrdenLabel, nroOrdenX, nroOrdenY, { align: 'left' });
  doc.setFont('helvetica', 'bold').setFontSize(18);
  doc.text(nroOrdenValue, rightMargin - nroOrdenValueWidth, nroOrdenY, { align: 'left' });
  doc.setLineWidth(0.5);
  doc.line(rightMargin - nroOrdenValueWidth, nroOrdenY + 1.5, rightMargin, nroOrdenY + 1.5);
  // Segunda línea: sede alineada con el número
  doc.setFontSize(12).setFont('helvetica', 'normal');
  const sedeText = (datos.sede || '').toUpperCase();
  const sedeWidth = doc.getTextWidth(sedeText);
  doc.text(sedeText, rightMargin - sedeWidth, nroOrdenY + 10, { align: 'left' });

  // --- Datos del paciente ---
  let yDatos = nroOrdenY + 28;
  const patientDataX = margin;
  const lineHeight = 8;
  const drawPatientDataRow = (label, value) => {
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text(label, patientDataX, yDatos);
    let valueX = patientDataX + doc.getTextWidth(label) + 4;
    if (label.toLowerCase().includes('apellidos y nombres')) {
      if (doc.getTextWidth(label) < 23) valueX = patientDataX + 23;
    }
    doc.setFont('helvetica', 'normal');
    doc.text(String(value).toUpperCase(), valueX, yDatos);
    yDatos += lineHeight;
  };
  drawPatientDataRow("Apellidos y Nombres :", datos.nombres || '');
  drawPatientDataRow("Edad :", datos.edad ? `${datos.edad} AÑOS` : '');
  doc.setFontSize(11).setFont('helvetica', 'bold');
  const fechaLabel = "Fecha :";
  doc.text(fechaLabel, patientDataX, yDatos);
  let valueXFecha = patientDataX + doc.getTextWidth(fechaLabel) + 4;
  doc.setFont('helvetica', 'normal');
  doc.text(formatDateToShort(datos.fecha), valueXFecha, yDatos);
  doc.setFont('helvetica', 'normal').setFontSize(10).setLineWidth(0.2);
};

export default header_Inmunologia_Digitalizado; 