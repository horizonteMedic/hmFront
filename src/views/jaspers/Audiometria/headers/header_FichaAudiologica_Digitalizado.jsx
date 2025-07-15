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
  const logoW = 60, logoH = 28;
  try {
    doc.addImage('./img/logo-color.png', 'PNG', margin, y, logoW, logoH);
  } catch {
    doc.setFont('helvetica', 'bold').setFontSize(12).text('HORIZONTE MEDIC', margin, y + 10);
  }

  // Número de ficha grande, negrita, subrayado, derecha
  const fichaX = pageW - margin - 2;
  const fichaY = y + 8;
  doc.setFont('helvetica', 'bold').setFontSize(22);
  doc.text(`${datos.norden || ''}`, fichaX, fichaY, { align: 'right' });
  // Subrayado
  const fichaWidth = doc.getTextWidth(`${datos.norden || ''}`);
  doc.setLineWidth(1.2);
  doc.line(fichaX - fichaWidth, fichaY + 2, fichaX, fichaY + 2);
  doc.setLineWidth(0.2);
  // Sede debajo
  doc.setFont('helvetica', 'normal').setFontSize(11);
  doc.text(`${datos.sede || ''}`, fichaX, fichaY + 10, { align: 'right' });
};

export default header_FichaAudiologica;
