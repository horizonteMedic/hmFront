/**
 * Header para Oftalmología (logo izq, título centrado, ficha/sede derecha, footer horizontal)
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - Datos del paciente y ficha
 */
function footerFichaOftalmoCabecera(doc, opts = {}) {
  const pageW = doc.internal.pageSize.getWidth();
  const y = 12;
  const fontSize = opts.fontSize !== undefined ? opts.fontSize : 6;
  const yOffset = opts.yOffset !== undefined ? opts.yOffset : -8;
  const totalFooterW = 140;
  const baseX = (pageW - totalFooterW) / 2;
  let yFila = y + 2 + yOffset;
  const rowH = 3.2;
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 0, 0);
  const filas = [
    { direccion: 'Sede Huancayo: Av. Huancavelica N°2225 - Distrito El Tambo', telefono: 'Telf. 064-659554' },
    { direccion: 'Sede Huamachuco: Jr. Leoncio Prado N°786', celular: 'Cel. 990094744-969603777', telefono: 'Telf. 044-348070' },
    { direccion: 'Sede Trujillo: Av. Nicolas de Piérola N°1106 Urb. San Fernando', celular: 'Cel. 964385075' },
    { direccion: 'Cl.Guillermo Prescott N°127 Urb. Sto. Dominguito', telefono: 'Telf. 044-767608' },
    { direccion: 'Web : www.horizontemedic.com' }
  ];
  filas.forEach((fila) => {
    let x = baseX;
    if (fila.direccion) {
      doc.setFont('helvetica', 'normal');
      doc.text(fila.direccion, x, yFila, { baseline: 'top' });
      x += doc.getTextWidth(fila.direccion) + 6;
    }
    if (fila.celular) {
      doc.setFont('helvetica', 'bold');
      doc.text('Cel.', x, yFila, { baseline: 'top' });
      x += doc.getTextWidth('Cel.');
      doc.setFont('helvetica', 'normal');
      doc.text(` ${fila.celular}`, x, yFila, { baseline: 'top' });
      x += doc.getTextWidth(` ${fila.celular}`) + 6;
    }
    if (fila.telefono) {
      doc.setFont('helvetica', 'bold');
      doc.text('Telf.', x, yFila, { baseline: 'top' });
      x += doc.getTextWidth('Telf.');
      doc.setFont('helvetica', 'normal');
      doc.text(` ${fila.telefono}`, x, yFila, { baseline: 'top' });
    }
    yFila += rowH;
  });
}

const header_Oftalmologia = (doc, datos = {}) => {
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;
  // Logo a la izquierda
  const logoW = 60, logoH = 28;
  const logoY = y + 2;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, logoY, logoW, logoH);
  } catch {
    doc.setFont("helvetica", "normal").setFontSize(9).text("Policlinico Horizonte Medic", margin, logoY + 8);
  }
  // Footer horizontal de cabecera (datos de contacto)
  footerFichaOftalmoCabecera(doc, { fontSize: 6, yOffset: -8 });
  // Título centrado
  doc.setFont("helvetica", "normal").setFontSize(18);
  const titulo = "Ficha Oftalmológica";
  const tituloY = y + 40;
  doc.text(titulo, pageW / 2, tituloY, { align: "center" });
  // Nro Orden y Sede a la derecha
  const fichaX = pageW - margin - 10;
  doc.setFont("helvetica", "normal").setFontSize(12);
  doc.text("Nro Orden :", fichaX - 30, tituloY, { align: "right" });
  doc.setFont("helvetica", "bold").setFontSize(22);
  doc.text(`${datos.norden || '95877'}`, fichaX, tituloY, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(12);
  doc.text("Sede :", fichaX - 30, tituloY + 10, { align: "right" });
  doc.text(`${datos.sede || 'Trujillo-Pierola'}`, fichaX, tituloY + 10, { align: "right" });
};

export default header_Oftalmologia; 