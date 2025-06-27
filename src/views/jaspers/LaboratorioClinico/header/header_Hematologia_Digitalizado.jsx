/**
 * Formatea una fecha en formato "19 diciembre 2024".
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
 * Dibuja el encabezado para el reporte de Hematología.
 * @param {jsPDF} doc - La instancia del documento jsPDF.
 * @param {object} datos - Los datos a imprimir.
 */
const header_Hematologia = (doc, datos = {}) => {
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
  
  // --- Nro Orden ---
  doc.setFont('helvetica', 'normal').setFontSize(11);
  const nroOrdenLabel = "Nro Orden :";
  const nroOrdenValue = String(datos.norden || '');
  const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  const nroOrdenX = rightColX - nroOrdenValueWidth - nroOrdenLabelWidth - 2;
  doc.text(nroOrdenLabel, nroOrdenX, y + 5);

  doc.setFont('helvetica', 'bold').setFontSize(20);
  doc.text(nroOrdenValue, nroOrdenX + nroOrdenLabelWidth + 2, y + 5);
  doc.setLineWidth(0.5);
  doc.line(
    nroOrdenX + nroOrdenLabelWidth + 2, y + 6.5,
    nroOrdenX + nroOrdenLabelWidth + 2 + nroOrdenValueWidth, y + 6.5
  );

  // --- Sede (debajo de Nro Orden) ---
  doc.setFontSize(10).setFont('helvetica', 'normal');
  doc.text(`Sede : ${datos.sede || ''}`, rightColX, y + 12, { align: 'right' });

  // --- Datos del paciente (más abajo) ---
  y += 28;
  const patientDataX = margin + 5;
  
  const drawPatientDataRow = (label, value) => {
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text(label, patientDataX, y);
    doc.setFont('helvetica', 'normal');
    const labelWidth = doc.getTextWidth(label);
    doc.text(String(value).toUpperCase(), patientDataX + labelWidth + 8, y);
    y += lineHeight;
  };
  
  drawPatientDataRow("Apellidos y Nombres :", datos.nombres || '');
  drawPatientDataRow("Edad :", datos.edad ? `${datos.edad} AÑOS` : '');
  drawPatientDataRow("DNI :", datos.dni || '');
  
  // --- Fecha ---
  doc.setFontSize(11).setFont('helvetica', 'bold');
  const fechaLabel = "Fecha :";
  doc.text(fechaLabel, patientDataX, y);
  doc.setFont('helvetica', 'normal');
  const fechaLabelWidth = doc.getTextWidth(fechaLabel);
  // Formatear fecha como dd/mm/yyyy
  let fechaFormateada = '';
  if (datos.fechaExamen) {
    const d = new Date(datos.fechaExamen);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    fechaFormateada = `${day}/${month}/${year}`;
  }
  doc.text(fechaFormateada, patientDataX + fechaLabelWidth + 8, y);
  y += lineHeight;

  // --- Muestra ---
  doc.setFontSize(11).setFont('helvetica', 'bold');
  const muestraLabel = "Muestra :";
  doc.text(muestraLabel, patientDataX, y);
  doc.setFont('helvetica', 'normal');
  const muestraLabelWidth = doc.getTextWidth(muestraLabel);
  doc.text('SANGRE TOTAL C/ EDTA'.toUpperCase(), patientDataX + muestraLabelWidth + 2, y);

  // Reseteo
  doc.setFont('helvetica', 'normal').setFontSize(10).setLineWidth(0.2);
};

export default header_Hematologia; 