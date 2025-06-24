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
 * Dibuja el encabezado para el reporte de Inmunología (Aglutinación).
 * @param {jsPDF} doc - La instancia del documento jsPDF.
 * @param {object} datos - Los datos a imprimir.
 */
const header_InmunologiaLab_Digitalizado = (doc, datos = {}) => {
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

  // 2. Bloque de datos a la derecha
  const rightColX = pageW - margin;
  const lineHeight = 6;
  
  // --- Sede ---
  doc.setFontSize(10).setFont('helvetica', 'normal');
  doc.text(`Sede : ${datos.sede || ''}`, rightColX, y + 5, { align: 'right' });

  // --- Nro Orden ---
  y += 10;
  doc.setFont('helvetica', 'normal');
  const nroOrdenLabel = "Nro Orden :";
  const nroOrdenValue = String(datos.norden || '');
  const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  const nroOrdenX = rightColX - nroOrdenValueWidth - nroOrdenLabelWidth - 2;
  doc.text(nroOrdenLabel, nroOrdenX, y);

  doc.setFont('helvetica', 'bold');
  doc.text(nroOrdenValue, nroOrdenX + nroOrdenLabelWidth + 2, y);
  doc.setLineWidth(0.5);
  doc.line(
    nroOrdenX + nroOrdenLabelWidth + 2, y + 1.5,
    nroOrdenX + nroOrdenLabelWidth + 2 + nroOrdenValueWidth, y + 1.5
  );
  y += lineHeight;

  // --- Datos del paciente ---
  y += 20;
  const patientDataX = margin;
  
  const drawPatientDataRow = (label, value) => {
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text(label, patientDataX, y);
    doc.setFont('helvetica', 'normal');
    const labelWidth = doc.getTextWidth(label);
    doc.text(String(value).toUpperCase(), patientDataX + labelWidth + 2, y);
    y += lineHeight;
  };
  
  drawPatientDataRow("Apellidos y Nombres :", datos.nombres || '');
  drawPatientDataRow("Edad :", datos.edad ? `${datos.edad} AÑOS` : '');
  
  // --- Fecha (sin valor en mayúsculas) ---
  doc.setFontSize(11).setFont('helvetica', 'bold');
  const fechaLabel = "Fecha :";
  doc.text(fechaLabel, patientDataX, y);
  doc.setFont('helvetica', 'normal');
  const fechaLabelWidth = doc.getTextWidth(fechaLabel);
  doc.text(String(datos.fecha), patientDataX + fechaLabelWidth + 2, y);
  
  // Reseteo
  doc.setFont('helvetica', 'normal').setFontSize(10).setLineWidth(0.2);
};

export default header_InmunologiaLab_Digitalizado; 