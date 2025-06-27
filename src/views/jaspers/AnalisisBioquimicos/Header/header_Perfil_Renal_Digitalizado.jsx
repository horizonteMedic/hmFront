import logo from '../../../../../public/img/logo-color.png'

const formatDateToShort = (dateString) => {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function header_Perfil_Renal_Digitalizado(doc, datos) {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 10;

  // Logo
  doc.addImage(logo, 'PNG', margin, y, 60, 20);

  // Nro Orden (derecha)
  const rightColX = pageW - margin;
  const nroOrdenLabel = 'Nro Orden :';
  const nroOrdenValue = String(datos.norden || '');
  const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  const nroOrdenX = rightColX - nroOrdenValueWidth - nroOrdenLabelWidth - 2;
  doc.setFontSize(11).setFont('helvetica', 'normal');
  doc.text(nroOrdenLabel, nroOrdenX, y + 5);
  doc.setFontSize(18).setFont('helvetica', 'bold');
  doc.text(nroOrdenValue, nroOrdenX + nroOrdenLabelWidth + 2, y + 5);
  doc.setLineWidth(0.7);
  doc.line(
    nroOrdenX + nroOrdenLabelWidth + 2, y + 6.5,
    nroOrdenX + nroOrdenLabelWidth + 2 + nroOrdenValueWidth, y + 6.5
  );
  doc.setLineWidth(0.2);
<<<<<<< HEAD

  // Sede (debajo, alineado con el Nro Orden)
  doc.setFontSize(9).setFont('helvetica', 'normal');
  doc.text(datos.sede || 'Trujillo-Pierola', rightColX, y + 11, { align: 'right' });
=======
  doc.setFontSize(10).setFont('helvetica', 'normal');
  // doc.setFont(undefined, 'normal')
  doc.text('Sede:', 110, 27)
  doc.text(datos.sede || 'Trujillo-Pierola', 122, 27)
>>>>>>> ac56af38d6f762c1388aeaeb2a38a41562b31233

  // Título
  doc.setFontSize(16).setFont('helvetica', 'bold');
  doc.text('ANÁLISIS CLÍNICOS', pageW / 2, 45, { align: 'center' });

  // Datos del paciente
  y = 55;
  const lineHeight = 6;
  const patientDataX = margin;

  const drawPatientDataRow = (label, value) => {
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text(label, patientDataX, y);
    doc.setFont('helvetica', 'normal');
    const labelWidth = doc.getTextWidth(label);
    const extraSpace = label === 'Apellidos y Nombres :' ? 8 : 2;
    doc.text(String(value || '').toUpperCase(), patientDataX + labelWidth + extraSpace, y);
    y += lineHeight;
  };

  drawPatientDataRow('Apellidos y Nombres :', datos.nombres);
  drawPatientDataRow('Edad :', datos.edad ? `${datos.edad} AÑOS` : '');
  drawPatientDataRow('DNI :', String(datos.dni));
  drawPatientDataRow('Fecha :', formatDateToShort(datos.fechaExamen));

  // Reseteo de estilos para el cuerpo
  doc.setFont('helvetica', 'normal').setFontSize(10).setLineWidth(0.2);
} 