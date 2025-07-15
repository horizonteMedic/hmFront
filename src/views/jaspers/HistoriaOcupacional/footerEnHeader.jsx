

function footerEnHeader(doc, datos) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginBottom = 212;
  const baseY = pageHeight - marginBottom;
  const col1X = 15+55;   // Dirección
  const col2X = 90-17+55;   // Celular
  const col3X = 122-24.5+55;  // Email
  const col4X = 176-42+55;  // Teléfono

  // Línea horizontal arriba del footer
//   doc.setLineWidth(0.3);
//   doc.line(15, baseY - 3, doc.internal.pageSize.getWidth() - 15, baseY - 3);
//   doc.setLineWidth(0.2);

  doc.setFontSize(5.5);
  doc.setTextColor(0, 0, 0);

  // Definir las filas principales
  const filas = [
    {
      direccion: datos?.dirTruPierola || "",
      celular: datos?.celTrujilloPie || "",
      email: datos?.emailTruPierola || "",
      telefono: datos?.telfTruPierola || ""
    },
    {
      direccion: datos?.dirHuamachuco || "",
      celular: datos?.celHuamachuco || "",
      email: datos?.emailHuamachuco || "",
      telefono: datos?.telfHuamachuco || ""
    },
    {
      direccion: datos?.dirHuancayo || "",
      celular: datos?.celHuancayo || "",
      email: datos?.emailHuancayo || "",
      telefono: datos?.telfHuancayo || ""
    }
  ];

  // Fila opcional para Prescott
  const prescott = datos?.dirTrujillo || "";

  // Renderizar filas principales
  let y = baseY;
  filas.forEach((fila) => {
    // Dirección: negrita hasta el primer ':'
    if (fila.direccion) {
      const idx = fila.direccion.indexOf(":");
      if (idx !== -1) {
        const sedeNombre = fila.direccion.substring(0, idx + 1);
        const sedeResto = fila.direccion.substring(idx + 1);
        doc.setFont('helvetica', 'bold');
        doc.text(sedeNombre, col1X, y, { baseline: 'top' });
        doc.setFont('helvetica', 'normal');
        doc.text(sedeResto, col1X + doc.getTextWidth(sedeNombre) + 2, y, { baseline: 'top' });
      } else {
        doc.setFont('helvetica', 'normal');
        doc.text(fila.direccion, col1X, y, { baseline: 'top' });
      }
    }
    // Celular
    if (fila.celular) {
      doc.setFont('helvetica', 'bold');
      doc.text('Cel.', col2X, y, { baseline: 'top' });
      doc.setFont('helvetica', 'normal');
      doc.text(` ${fila.celular}`, col2X + doc.getTextWidth('Cel.'), y, { baseline: 'top' });
    }
    // Email
    if (fila.email) {
      doc.setFont('helvetica', 'normal');
      doc.text(fila.email, col3X, y, { baseline: 'top' });
    }
    // Teléfono
    if (fila.telefono) {
      doc.setFont('helvetica', 'bold');
      doc.text('Telf.', col4X, y, { baseline: 'top' });
      doc.setFont('helvetica', 'normal');
      doc.text(` ${fila.telefono}`, col4X + doc.getTextWidth('Telf.'), y, { baseline: 'top' });
    }
    y += 4;
  });

  // Renderizar la fila de Prescott solo si existe
  if (prescott) {
    doc.setFont('helvetica', 'normal');
    doc.text(prescott, col1X, y, { baseline: 'top' });
  }
}

export default footerEnHeader;