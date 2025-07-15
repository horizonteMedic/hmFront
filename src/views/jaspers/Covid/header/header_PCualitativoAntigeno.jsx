import jsPDF from "jspdf";

/**
 * Fecha"dd/mm/yyyy" (ej. "04/11/2024").
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
 * Dibuja el encabezado para el reporte de Prueba Cualitativa de Antígenos (igual Marsa).
 * @param {jsPDF} doc - La instancia del documento jsPDF.
 * @param {object} datos - Los datos a imprimir (numero, nombre, edad, dni, fecha_examen, etc).
 */
const header_PCualitativoAntigeno = (doc, datos = {}) => {
  const margin = 15;
  const pageW = doc.internal.pageSize.getWidth();
  const y = 10;

  // 1. Logo a la izquierda
  const img = "./img/logo-color.png";
  try {
    doc.addImage(img, "PNG", margin, y, 60, 20);
  } catch (error) {
    console.error("No se pudo cargar el logo.", error);
    doc.setFont("helvetica", "bold").text("Policlinico Horizonte Medic", margin, y + 8);
  }

  // 2. Nro Orden a la derecha, grande y subrayado
  const nroOrdenValue = String(datos.numero || datos.norden || '');
  doc.setFontSize(10).setFont('helvetica', 'bold');
  const nroOrdenLabel = "Nro Orden :";
  const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  let nroOrdenX = pageW - margin - nroOrdenValueWidth - nroOrdenLabelWidth - 10;
  let nroOrdenY = y + 10;
  doc.text(nroOrdenLabel, nroOrdenX, nroOrdenY);
  doc.setFont('helvetica', 'bold').setFontSize(18);
  doc.text(nroOrdenValue, nroOrdenX + nroOrdenLabelWidth + 2, nroOrdenY);
  doc.setLineWidth(0.5);
  doc.line(nroOrdenX + nroOrdenLabelWidth + 2, nroOrdenY + 1.5, nroOrdenX + nroOrdenLabelWidth + 2 + nroOrdenValueWidth, nroOrdenY + 1.5);

  // 3. Datos del paciente (PACIENTE, EDAD, DNI, FECHA)
  let dataY = y + 30;
  const labelX = margin;
  const valueX = labelX + 35;
  doc.setFontSize(11).setFont('helvetica', 'bold');
  doc.text("PACIENTE:", labelX, dataY);
  doc.setFont('helvetica', 'normal');
  doc.text(String(datos.nombre || datos.nombres || ''), valueX, dataY);
  dataY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text("EDAD :", labelX, dataY);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.edad ? `${datos.edad} años` : '', valueX, dataY);
  dataY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text("DNI:", labelX, dataY);
  doc.setFont('helvetica', 'normal');
  doc.text(String(datos.dni || datos.cod_pa || ''), valueX, dataY);
  dataY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text("FECHA :", labelX, dataY);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDateToShort(datos.fecha_examen || datos.fechaExamen), valueX, dataY);
  doc.setFont('helvetica', 'normal').setFontSize(10);
};

export default header_PCualitativoAntigeno;
