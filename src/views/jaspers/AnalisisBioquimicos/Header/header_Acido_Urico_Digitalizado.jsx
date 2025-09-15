// src/views/jaspers/AnalisisBioquimicos/Header/headerPerfilHepatico.jsx

/**
 * Formatea una fecha en formato "04 noviembre 2024".
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

const header_Acido_Urico_Digitalizado = (doc, datos = {}) => {
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

  // 2. Nro Orden (movido más a la izquierda)
  const rightColX = pageW - margin - 30;
  const nroOrdenLabel = "Nro Orden :";
  const nroOrdenValue = String(datos.norden || '');
  const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  const nroOrdenX = rightColX - nroOrdenValueWidth - nroOrdenLabelWidth - 2;
  doc.setFontSize(11).setFont("helvetica", "normal");
  doc.text(nroOrdenLabel, nroOrdenX, y + 5);
  doc.setFontSize(18).setFont("helvetica", "bold");
  doc.text(nroOrdenValue, nroOrdenX + nroOrdenLabelWidth + 2, y + 5);
  doc.setLineWidth(0.7);
  doc.line(
    nroOrdenX + nroOrdenLabelWidth + 2, y + 6.5,
    nroOrdenX + nroOrdenLabelWidth + 2 + nroOrdenValueWidth, y + 6.5
  );
  doc.setLineWidth(0.2);

  // Sede (debajo, alineado con el Nro Orden)
  doc.setFontSize(9).setFont("helvetica", "normal");
  doc.text(datos.sede || "Trujillo-Pierola", rightColX, y + 11, { align: "right" });

  // 3. Bloque de datos del paciente
  y = 40; 
  const lineHeight = 6;
  const patientDataX = margin;
  
  const drawPatientDataRow = (label, value) => {
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text(label, patientDataX, y);
    doc.setFont('helvetica', 'normal');
    const labelWidth = doc.getTextWidth(label);
    doc.text(String(value || '').toUpperCase(), patientDataX + labelWidth + 4, y);
    y += lineHeight;
  };
  
  drawPatientDataRow("Apellidos y Nombres :", datos.nombres);
  drawPatientDataRow("Edad :", datos.edad ? `${datos.edad} AÑOS` : '');
  drawPatientDataRow("DNI :", String(datos.dni));
  
  // Fecha con formato largo para coincidir con la imagen
  doc.setFontSize(11).setFont('helvetica', 'bold');
  const fechaLabel = "Fecha :";
  doc.text(fechaLabel, patientDataX, y);
  doc.setFont('helvetica', 'normal');
  const fechaLabelWidth = doc.getTextWidth(fechaLabel);
  // Mostrar la fecha en formato dd/mm/yyyy
  let fechaFormateada = '';
  if (datos.fecha) {
    const date = new Date(`${datos.fecha}T00:00:00`);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    fechaFormateada = `${day}/${month}/${year}`;
  }
  doc.text(fechaFormateada, patientDataX + fechaLabelWidth + 2, y);
  
  // Reseteo de estilos para el cuerpo
  doc.setFont('helvetica', 'normal').setFontSize(10).setLineWidth(0.2);
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 500;
  if (colorValido) {
    let color = datos.codigoColor || "#008f39";
    let boxText = (datos.textoColor || "F").toUpperCase();
  
    const boxSize = 15;
    const boxX = pageW - margin - boxSize;
    const boxY = 10 + 2;
    
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

export default header_Acido_Urico_Digitalizado;
