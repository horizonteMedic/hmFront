/**
 * Formatea una fecha en formato "dd/mm/yyyy" (ej. "04/11/2024").
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
 * Dibuja el encabezado para el reporte de Prueba Cualitativa de Antígenos, estilo profesional.
 * @param {jsPDF} doc - La instancia del documento jsPDF.
 * @param {object} datos - Los datos a imprimir (numero, nombre, edad, fecha_examen, etc).
 */
const header_PCualitativoAntigeno = (doc, datos = {}) => {
  const margin = 15;
  const pageW = doc.internal.pageSize.getWidth();
  const y = 10;

  // 1. Logo a la izquierda
  const img = "./img/logo-color.png";
  try {
    doc.addImage(img, "PNG", margin, y, 50, 16);
  } catch (error) {
    console.error("No se pudo cargar el logo.", error);
    doc.text("Policlinico Horizonte Medic", margin, y + 8);
  }

  // 2. Número de orden a la derecha
  const nroOrdenLabel = "Nro Orden :";
  const nroOrdenValue = String(datos.norden || '');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  let extraMargin = 20;
  let nroOrdenX = pageW - margin - nroOrdenValueWidth - nroOrdenLabelWidth - extraMargin;
  let nroOrdenY = y + 8;
  doc.text(nroOrdenLabel, nroOrdenX, nroOrdenY);
  doc.setFont('helvetica', 'bold').setFontSize(18);
  doc.text(nroOrdenValue, nroOrdenX + nroOrdenLabelWidth + 2, nroOrdenY);
  doc.setLineWidth(0.5);
  doc.line(nroOrdenX + nroOrdenLabelWidth + 2, nroOrdenY + 1.5, nroOrdenX + nroOrdenLabelWidth + 2 + nroOrdenValueWidth, nroOrdenY + 1.5);

  // 3. Datos del paciente (debajo)
  let patientDataY = y + 35;
  const patientDataX = margin;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Paciente :", patientDataX, patientDataY);
  const labelWidthNombres = doc.getTextWidth("Paciente :");
  let valueXNombres = patientDataX + labelWidthNombres + 4;
  doc.setFont('helvetica', 'normal');
  doc.text(String(datos.nombres || '').toUpperCase(), valueXNombres, patientDataY);
  patientDataY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text("Edad :", patientDataX, patientDataY);
  const labelWidthEdad = doc.getTextWidth("Edad :");
  doc.setFont('helvetica', 'normal');
  doc.text(String(datos.edad ? `${datos.edad} años` : ''), patientDataX + labelWidthEdad + 4, patientDataY);
  patientDataY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text("Fecha :", patientDataX, patientDataY);
  const labelWidthFecha = doc.getTextWidth("Fecha :");
  doc.setFont('helvetica', 'normal');
  doc.text(formatDateToShort(datos.fechaExamen), patientDataX + labelWidthFecha + 4, patientDataY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setLineWidth(0.2);
};

export default header_PCualitativoAntigeno;
