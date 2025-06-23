// src/views/jaspers/AnalisisBioquimicos/Header/headerPerfilHepatico.jsx

/**
 * Formatea una fecha en formato "04 noviembre 2024".
 * @param {string} dateString - La fecha en formato YYYY-MM-DD.
 * @returns {string} - La fecha formateada.
 */
const formatDateToLong = (dateString) => {
  if (!dateString) return '';
  // Aseguramos que la fecha se interprete en la zona horaria local y no en UTC.
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const headerPerfilHepatico = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 10;

  // 1. Logo (izquierda)
  try {
    const img = "./img/logo-color.png";
    doc.addImage(img, "PNG", margin, y, 60, 20);
  } catch (error) {
    console.error("No se pudo cargar el logo.", error);
    doc.setFont("helvetica", "bold").text("Policlinico Horizonte Medic", margin, y + 8);
  }

  // 2. Nro Orden (derecha)
  const rightColX = pageW - margin;
  doc.setFontSize(11).setFont("helvetica", "normal");
  const nroOrdenLabel = "Nro Orden :";
  const nroOrdenValue = String(datos.norden || '');
  const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  const nroOrdenX = rightColX - nroOrdenValueWidth - nroOrdenLabelWidth - 2;
  
  doc.text(nroOrdenLabel, nroOrdenX, y + 5);
  doc.setFont("helvetica", "bold");
  doc.text(nroOrdenValue, nroOrdenX + nroOrdenLabelWidth + 2, y + 5);
  doc.setLineWidth(0.5).line(
    nroOrdenX + nroOrdenLabelWidth + 1, y + 6.5,
    nroOrdenX + nroOrdenLabelWidth + 2 + nroOrdenValueWidth, y + 6.5
  );

  // Sede (debajo, alineado con el Nro Orden)
  doc.setFontSize(9).setFont("helvetica", "normal");
  doc.text(datos.sede || "Trujillo-Pierola", rightColX, y + 11, { align: "right" });

  // 3. Bloque de datos del paciente
  y = 40; 
  const lineHeight = 6;
  const patientDataX = margin + 80;
  
  const drawPatientDataRow = (label, value) => {
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text(label, patientDataX, y);
    doc.setFont('helvetica', 'normal');
    const labelWidth = doc.getTextWidth(label);
    doc.text(String(value || '').toUpperCase(), patientDataX + labelWidth + 2, y);
    y += lineHeight;
  };
  
  drawPatientDataRow("Apellidos y Nombres :", datos.nombres);
  drawPatientDataRow("Edad :", datos.edad ? `${datos.edad} AÑOS` : '');
  drawPatientDataRow("DNI :", String(datos.dni));
  
  // Fecha con formato especial
  doc.setFontSize(11).setFont('helvetica', 'bold');
  const fechaLabel = "Fecha :";
  doc.text(fechaLabel, patientDataX, y);
  doc.setFont('helvetica', 'normal');
  const fechaLabelWidth = doc.getTextWidth(fechaLabel);
  doc.text(String(datos.fechaExamen), patientDataX + fechaLabelWidth + 2, y);
  
  // Reseteo de estilos para el cuerpo
  doc.setFont('helvetica', 'normal').setFontSize(10).setLineWidth(0.2);
};

export default headerPerfilHepatico;
