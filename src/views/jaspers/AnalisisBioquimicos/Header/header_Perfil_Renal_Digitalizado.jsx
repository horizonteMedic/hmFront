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

  // Info Derecha
  doc.setFontSize(11)
  doc.setFont(undefined, 'bold')
  doc.text('Nro Orden:', 140, 20)
  doc.text(datos.n_orden || '96639', 165, 20)
  doc.setFont(undefined, 'normal')
  doc.text('Sede:', 140, 25)
  doc.text(datos.sede || 'Trujillo-Piarda', 152, 25)

  // Título
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text('ANÁLISIS CLÍNICOS', 105, 45, { align: 'center' })

  // Datos del paciente
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  const patientDataY = 55
  const patientDataX = 20
  const labelWidth = 45;

  const field = (label, value, y) => {
    doc.setFont(undefined, 'bold')
    doc.text(label, patientDataX, y)
    doc.setFont(undefined, 'normal')
    doc.text(value, patientDataX + labelWidth, y)
  }

  const formattedDate = formatDate(datos.fecha);

  field('Apellidos y Nombres :', datos.paciente || 'HADY KATHERINE CASTILLO PLASENCIA', patientDataY)
  field('Edad :', (datos.edad || '31') + ' AÑOS', patientDataY + 5)
  field('DNI :', datos.dni || '72384273', patientDataY + 10)
  field('Fecha :', formattedDate, patientDataY + 15)
} 