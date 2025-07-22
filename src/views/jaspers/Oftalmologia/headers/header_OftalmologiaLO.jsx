/**
 * Header para Oftalmología LO (logo izq, título centrado, ficha/sede derecha, footer horizontal, bloque color)
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - Datos del paciente y ficha
 */
function footerFichaOftalmoCabecera(doc, opts = {}) {
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  const logoW = 38;
  const y = 22; // bajado 10 puntos
  const fontSize = opts.fontSize !== undefined ? opts.fontSize : 6;
  const yOffset = opts.yOffset !== undefined ? opts.yOffset : -8;
  const totalFooterW = 140;
  const baseX = (pageW - totalFooterW) / 2;
  let yFila = y + 2 + yOffset;
  const rowH = 3.2;
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 0, 0);
  const filas = [
    {
      direccion: 'TRUJILLO: Nicolás de Piérola 123',
      celular: '999 888 777',
      email: 'trujillo@horizontemedic.com',
      telefono: '044-123456'
    },
    {
      direccion: 'HUAMACHUCO: Jr. Libertad 456',
      celular: '988 777 666',
      email: 'huamachuco@horizontemedic.com',
      telefono: '044-654321'
    },
    {
      direccion: 'HUANCAYO: Av. Central 789',
      celular: '977 666 555',
      email: 'huancayo@horizontemedic.com',
      telefono: '064-123456'
    }
  ];
  filas.forEach((fila, idx) => {
    let x = baseX;
    if (fila.direccion) {
      const idx2 = fila.direccion.indexOf(":");
      if (idx2 !== -1) {
        const sedeNombre = fila.direccion.substring(0, idx2 + 1);
        const sedeResto = fila.direccion.substring(idx2 + 1);
        doc.setFont('helvetica', 'bold');
        doc.text(sedeNombre, x, yFila, { baseline: 'top' });
        x += doc.getTextWidth(sedeNombre) + 2;
        doc.setFont('helvetica', 'normal');
        doc.text(sedeResto, x, yFila, { baseline: 'top' });
        x += doc.getTextWidth(sedeResto) + 6;
      } else {
        doc.setFont('helvetica', 'normal');
        doc.text(fila.direccion, x, yFila, { baseline: 'top' });
        x += doc.getTextWidth(fila.direccion) + 6;
      }
    }
    if (fila.celular) {
      doc.setFont('helvetica', 'bold');
      doc.text('Cel.', x, yFila, { baseline: 'top' });
      x += doc.getTextWidth('Cel.');
      doc.setFont('helvetica', 'normal');
      doc.text(` ${fila.celular}`, x, yFila, { baseline: 'top' });
      x += doc.getTextWidth(` ${fila.celular}`) + 6;
    }
    if (fila.email) {
      doc.setFont('helvetica', 'normal');
      doc.text(fila.email, x, yFila, { baseline: 'top' });
      x += doc.getTextWidth(fila.email) + 6;
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

const header_OftalmologiaLO = (doc, datos = {}) => {
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 22; // bajado 10 puntos
  // Logo a la izquierda
  const logoW = 38, logoH = 13;
  const logoY = y + 2;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, logoY, logoW, logoH);
  } catch {
    doc.setFont("helvetica", "normal").setFontSize(9).text("Policlinico Horizonte Medic", margin, logoY + 8);
  }
  // Footer horizontal de cabecera (datos de contacto)
  footerFichaOftalmoCabecera(doc, { fontSize: 6, yOffset: -8 });
  // === BLOQUE CÓDIGO DE COLOR ===
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  const color = datos.codigoColor || "#008f39";
  const boxText = (datos.textoColor || "F").toUpperCase();
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y + 2;
  if (colorValido || true) {
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
    doc.text(boxText, boxX + boxSize/2, boxY + (boxSize/2), { align: "center", baseline: "middle", maxWidth: boxSize - 1 });
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2);
  }
  // Sede a la derecha, alineado a la derecha
  doc.setFont("helvetica", "normal").setFontSize(8);
  const sedeValue = `${datos.sede || 'TRUJILLO - NICOLAS DE PIEROLA'}`;
  const sedeX = pageW - margin - 20;
  const sedeY = y + 6;
  doc.text(sedeValue, sedeX, sedeY, { align: "right" });
  // N° de Ficha debajo de la sede, alineado a la derecha, solo el número
  const fichaDato = `${datos.norden || '97800'}`;
  const fichaY = sedeY + 8;
  const fichaX = pageW - margin - 20;
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(fichaDato, fichaX, fichaY + 1, { align: "right" });
  // Título perfectamente centrado
  doc.setFont("helvetica", "bold").setFontSize(13);
  const titulo = "FICHA OFTALMOLÓGICA";
  const tituloY = y + 10;
  doc.text(titulo, pageW / 2, tituloY, { align: "center" });
  const w = doc.getTextWidth(titulo);
  doc.setLineWidth(0.7).line((pageW - w) / 2, tituloY + 2, (pageW + w) / 2, tituloY + 2).setLineWidth(0.2);
  doc.setFont("helvetica", "normal").setFontSize(11);
  // Línea de datos personales debajo del header, con espacios
  const datosY = fichaY + 14;
  const nombreLabel = "Nombres :";
  const nombreValue = `${datos.nombres || 'JOSUE SPENCER ROJAS SIGUENZA'}`;
  const edadLabel = "Edad:";
  const edadValue = `${datos.edad || '29'}  años`;
  let fechaValue = datos.fecha || '21/07/2025';
  // Forzar formato dd/mm/yyyy
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaValue)) {
    const [yyyy, mm, dd] = fechaValue.split('-');
    fechaValue = `${dd}/${mm}/${yyyy}`;
  } else if (/^(\d{2})\/(\d{2})\/(\d{4})$/.test(fechaValue)) {
    // ya está bien
  } else {
    // Si es texto largo, fuerza ejemplo
    fechaValue = '21/07/2025';
  }
  // Espaciado manual
  const nombreX = margin;
  const edadX = pageW / 2 + 26; // corre más a la derecha
  const fechaX = pageW - margin;
  doc.text(`${nombreLabel}  ${nombreValue}`, nombreX, datosY);
  doc.text(`${edadLabel}  ${edadValue}`, edadX, datosY);
  doc.text(`Fecha :  ${fechaValue}`, fechaX, datosY, { align: "right" });
};

export default header_OftalmologiaLO; 