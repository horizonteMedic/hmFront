import logo from '../../../../../public/img/logo-color.png'

const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function formatDate(dateString) {
  if (!dateString) return '04 noviembre 2024';
  const date = new Date(dateString.replace(/-/g, '/'));
  const day = date.getDate().toString().padStart(2, '0');
  const month = meses[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

export default function header_Perfil_Renal_Digitalizado(doc, datos) {
  // Logo
  doc.addImage(logo, 'PNG', 15, 10, 50, 15)

  // Título de la empresa
  doc.setFont(undefined, 'bold')
  doc.setFontSize(8)
  doc.text('POLICLINICO HORIZONTE MEDIC', 19.5, 28)
  doc.setFont(undefined, 'normal')
  doc.text('CUIDAMOS SU SALUD', 28, 31)

  // Info Derecha (movida más a la izquierda)
  doc.setFontSize(11)
  doc.setFont(undefined, 'bold')
  const nroOrdenLabel = 'Nro Orden:';
  const nroOrdenValue = String(datos.norden) || '';
  const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
  doc.text(nroOrdenLabel, 110, 20)
  doc.setFontSize(18)
  doc.text(nroOrdenValue, 110 + nroOrdenLabelWidth + 4, 20)
  // Subrayado
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  doc.setLineWidth(0.7);
  doc.line(110 + nroOrdenLabelWidth + 4, 21.5, 110 + nroOrdenLabelWidth + 4 + nroOrdenValueWidth, 21.5);
  doc.setLineWidth(0.2);
  doc.setFontSize(10).setFont('helvetica', 'normal');
  // doc.setFont(undefined, 'normal')
  doc.text('Sede:', 110, 27)
  doc.text(datos.sede || 'Trujillo-Pierola', 122, 27)

  // Título
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text('ANÁLISIS CLÍNICOS', 105, 45, { align: 'center' })

  // Datos del paciente
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  const patientDataY = 55
  const patientDataX = 15
  const labelWidth = 55;

  const field = (label, value, y) => {
    doc.setFont(undefined, 'bold')
    doc.text(label, patientDataX, y)
    doc.setFont(undefined, 'normal')
    const labelW = doc.getTextWidth(label);
    doc.text(value, patientDataX + labelW + 4, y)
  }

  field('Apellidos y Nombres :', datos.nombres || 'HADY KATHERINE CASTILLO PLASENCIA', patientDataY)
  field('Edad :', (datos.edad || '31') + ' AÑOS', patientDataY + 5)
  field('DNI :', String(datos.dni) || '72384273', patientDataY + 10)
  field('Fecha :', String(datos.fechaExamen), patientDataY + 15)
} 