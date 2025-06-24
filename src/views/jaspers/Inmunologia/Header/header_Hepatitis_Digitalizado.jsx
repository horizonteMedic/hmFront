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

  // 2. Bloque de datos del paciente a la derecha
  const labelEndX = pageW - 105; // Coordenada X donde terminan las etiquetas
  const valueX = labelEndX + 3;    // Coordenada X donde comienzan los valores
  const lineHeight = 6;

  // --- Nro Orden (Primer bloque, más arriba) ---
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
  
  // --- Datos del paciente (Segundo bloque, más abajo) ---
  let patientDataY = y + 35;
  const patientDataX = margin;

  // --- Apellidos y Nombres ---
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Apellidos y Nombres :", patientDataX, patientDataY);
  doc.setFont('helvetica', 'normal');
  const labelWidthNombres = doc.getTextWidth("Apellidos y Nombres :");
  doc.text(String(datos.nombres || '').toUpperCase(), patientDataX + labelWidthNombres + 2, patientDataY);
  patientDataY += lineHeight;
  
  // --- Edad ---
  doc.setFont('helvetica', 'bold');
  doc.text("Edad :", patientDataX, patientDataY);
  doc.setFont('helvetica', 'normal');
  const labelWidthEdad = doc.getTextWidth("Edad :");
  doc.text(String(datos.edad ? `${datos.edad} AÑOS` : ''), patientDataX + labelWidthEdad + 2, patientDataY);
  patientDataY += lineHeight;

  // --- DNI ---
  doc.setFont('helvetica', 'bold');
  doc.text("DNI:", patientDataX, patientDataY);
  doc.setFont('helvetica', 'normal');
  const labelWidthDNI = doc.getTextWidth("DNI:");
  doc.text(String(datos.dni || ''), patientDataX + labelWidthDNI + 2, patientDataY);
  patientDataY += lineHeight;

  // --- Fecha ---
  doc.setFont('helvetica', 'bold');
  doc.text("Fecha :", patientDataX, patientDataY);
  doc.setFont('helvetica', 'normal');
  const labelWidthFecha = doc.getTextWidth("Fecha :");
  doc.text(String(datos.fecha), patientDataX + labelWidthFecha + 2, patientDataY);
  
  // Reseteo de estilos para no afectar el resto del documento
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setLineWidth(0.2);
};

export default headerHepatitisDigitalizado; 