// Header para Ficha Audiológica: logo izquierda, número ficha grande derecha, sede debajo
/**
 * Dibuja el header de la ficha audiológica: logo izquierda, número ficha grande derecha, sede debajo
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - { norden: string|number, sede: string }
 */
const header_FichaAudiologica = (doc, datos = {}) => {
  const margin = 18;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // Logo izquierda
  const logoW = 48, logoH = 15; // Más pequeño y ancho
  try {
    doc.addImage('./img/logo-color.png', 'PNG', margin, y, logoW, logoH);
  } catch {
    doc.setFont('helvetica', 'bold').setFontSize(12).text('HORIZONTE MEDIC', margin, y + 10);
  }

  // Número de ficha grande, negrita, subrayado, derecha
  const fichaX = pageW - margin - 2;
  const fichaY = y + 8;
  doc.setFont('helvetica', 'bold').setFontSize(22);
  doc.text(`${datos.norden || '97800'}`, fichaX, fichaY, { align: 'right' });
  // Subrayado
  const fichaWidth = doc.getTextWidth(`${datos.norden || '97800'}`);
  doc.setLineWidth(1.2);
  doc.line(fichaX - fichaWidth, fichaY + 2, fichaX, fichaY + 2);
  doc.setLineWidth(0.2);
  // Sede debajo
  doc.setFont('helvetica', 'normal').setFontSize(11);
  doc.text(`${datos.sede || ''}`, fichaX, fichaY + 10, { align: 'right' });
  // Fecha debajo de la sede
  if (datos.fecha) {
    // Formatear fecha yyyy-mm-dd a dd/mm/yyyy
    let fechaStr = datos.fecha;
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
      const [y, m, d] = fechaStr.split('-');
      fechaStr = `${d}/${m}/${y}`;
    }
    doc.setFont('helvetica', 'normal').setFontSize(10);
    const label = 'Fecha :';
    const labelW = doc.getTextWidth(label);
    doc.setFont('helvetica', 'bold').text(label, fichaX - labelW - 2, fichaY + 20, { align: 'right' });
    doc.setFont('helvetica', 'normal').text(fechaStr, fichaX, fichaY + 20, { align: 'right' });
  }
};

export default header_FichaAudiologica;
