/**
 * Formatea una fecha en formato "dd/mm/yyyy".
 * @param {string} dateString - La fecha en formato YYYY-MM-DD.
 * @returns {string} - La fecha formateada.
 */
const formatDateToNumeric = (dateString) => {
  if (!dateString) return '';
  // Se agrega T00:00:00 para asegurar que la fecha se interprete como UTC y evitar errores de zona horaria.
  const date = new Date(`${dateString}T00:00:00`);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Dibuja el encabezado para los reportes de Hepatitis.
 * @param {jsPDF} doc - La instancia del documento jsPDF.
 * @param {object} datos - Los datos a imprimir (norden, nombres, edad, fecha, etc.).
 */
const headerHepatitisDigitalizado = (doc, datos = {}) => {
  const margin = 15;
  const pageW = doc.internal.pageSize.getWidth();
  const y = 10; // Posición Y superior

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
  let nroOrdenX = colorValido ? (boxX - nroOrdenValueWidth - nroOrdenLabelWidth - 18) : (pageW - margin - nroOrdenValueWidth - nroOrdenLabelWidth);
  let nroOrdenY = y + 8;
  doc.text(nroOrdenLabel, nroOrdenX, nroOrdenY);
  doc.setFont('helvetica', 'bold').setFontSize(18);
  doc.text(nroOrdenValue, nroOrdenX + nroOrdenLabelWidth + 2, nroOrdenY);
  doc.setLineWidth(0.5);
  doc.line(nroOrdenX + nroOrdenLabelWidth + 2, nroOrdenY + 1.5, nroOrdenX + nroOrdenLabelWidth + 2 + nroOrdenValueWidth, nroOrdenY + 1.5);

  // --- Datos del paciente (Segundo bloque, más abajo) ---
  let patientDataY = y + 25;
  const patientDataX = margin + 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Apellidos y Nombres :", patientDataX, patientDataY);
  const labelWidthNombres = doc.getTextWidth("Apellidos y Nombres :");
  let valueXNombres = patientDataX + labelWidthNombres + 4;
  if (labelWidthNombres < 23) valueXNombres = patientDataX + 23;
  doc.setFont('helvetica', 'normal');
  doc.text(String(datos.nombres || '').toUpperCase(), valueXNombres, patientDataY);
  patientDataY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text("Edad :", patientDataX, patientDataY);
  const labelWidthEdad = doc.getTextWidth("Edad :");
  doc.setFont('helvetica', 'normal');
  doc.text(String(datos.edad ? `${datos.edad} AÑOS` : ''), patientDataX + labelWidthEdad + 4, patientDataY);
  patientDataY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text("DNI:", patientDataX, patientDataY);
  const labelWidthDNI = doc.getTextWidth("DNI:");
  doc.setFont('helvetica', 'normal');
  doc.text(String(datos.dni || ''), patientDataX + labelWidthDNI + 4, patientDataY);
  patientDataY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text("Fecha :", patientDataX, patientDataY);
  const labelWidthFecha = doc.getTextWidth("Fecha :");
  doc.setFont('helvetica', 'normal');
  doc.text(formatDateToNumeric(datos.fechaExamen), patientDataX + labelWidthFecha + 4, patientDataY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setLineWidth(0.2);

  // Mostrar código de color si está presente
  if (typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50) {
    let color = datos.codigoColor || "#008f39";
    let boxText = (datos.textoColor || "F").toUpperCase();
    let boxSize = 15;
    let boxX = pageW - margin - boxSize;
    let boxY = y + 2;
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
};

export default headerHepatitisDigitalizado; 