import React from "react";

function footer(doc, datos) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginBottom = 25;
  const baseY = pageHeight - marginBottom;
  const col1X = 15;   // Dirección
  const col2X = 90;   // Celular
  const col3X = 122;  // Email
  const col4X = 176;  // Teléfono

  // Línea horizontal arriba del footer
  doc.setLineWidth(0.3);
  doc.line(15, baseY - 3, doc.internal.pageSize.getWidth() - 15, baseY - 3);
  doc.setLineWidth(0.2);

  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);

  // Definir las filas principales con datos de prueba si no hay datos
  const filas = [
    {
      direccion: datos?.dirTruPierola || 'TRUJILLO: Nicolás de Piérola 123',
      celular: datos?.celTrujilloPie || '999 888 777',
      email: datos?.emailTruPierola || 'trujillo@horizontemedic.com',
      telefono: datos?.telfTruPierola || '044-123456'
    },
    {
      direccion: datos?.dirHuamachuco || 'HUAMACHUCO: Jr. Libertad 456',
      celular: datos?.celHuamachuco || '988 777 666',
      email: datos?.emailHuamachuco || 'huamachuco@horizontemedic.com',
      telefono: datos?.telfHuamachuco || '044-654321'
    },
    {
      direccion: datos?.dirHuancayo || 'HUANCAYO: Av. Central 789',
      celular: datos?.celHuancayo || '977 666 555',
      email: datos?.emailHuancayo || 'huancayo@horizontemedic.com',
      telefono: datos?.telfHuancayo || '064-123456'
    }
  ];

  // Fila opcional para Prescott
  const prescott = datos?.dirTrujillo || 'PRESCOTT: Calle Falsa 123';

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

export default footer;