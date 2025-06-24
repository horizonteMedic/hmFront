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

  // 2. Bloque de datos del paciente a la derecha
  const labelEndX = pageW - 105;
  const valueX = labelEndX + 3;
  const lineHeight = 6;

  // --- Nro Orden ---
  let nroOrdenY = y + 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Nro Orden :", labelEndX, nroOrdenY, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const nordenText = String(datos.norden || '');
  doc.text(nordenText, valueX, nroOrdenY);
  const nordenWidth = doc.getTextWidth(nordenText);
  doc.setLineWidth(0.3);
  doc.line(valueX, nroOrdenY + 1.5, valueX + nordenWidth, nroOrdenY + 1.5);

  // --- Datos del paciente ---
  let patientDataY = y + 35;
  const patientDataX = margin;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Apellidos y Nombres :", patientDataX, patientDataY);
  doc.setFont('helvetica', 'normal');
  const labelWidthNombres = doc.getTextWidth("Apellidos y Nombres :");
  doc.text(String(datos.nombres || '').toUpperCase(), patientDataX + labelWidthNombres + 2, patientDataY);
  patientDataY += lineHeight;

  doc.setFont('helvetica', 'bold');
  doc.text("Edad :", patientDataX, patientDataY);
  doc.setFont('helvetica', 'normal');
  const labelWidthEdad = doc.getTextWidth("Edad :");
  doc.text(String(datos.edad ? `${datos.edad} AÑOS` : ''), patientDataX + labelWidthEdad + 2, patientDataY);
  patientDataY += lineHeight;

  doc.setFont('helvetica', 'bold');
  doc.text("Fecha :", patientDataX, patientDataY);
  doc.setFont('helvetica', 'normal');
  const labelWidthFecha = doc.getTextWidth("Fecha :");
  doc.text(String(datos.fecha), patientDataX + labelWidthFecha + 2, patientDataY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setLineWidth(0.2);
};

export default headerMicrobiologia1Digitalizado; 