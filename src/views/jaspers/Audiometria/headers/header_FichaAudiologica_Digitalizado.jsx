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
  const logoW = 37,
    logoH = 15; // Más pequeño y ancho
  const logoY = y + 10; // bajar un poco el logo
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, logoY, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "bold")
      .setFontSize(12)
      .text("HORIZONTE MEDIC", margin, logoY + 10);
  }
  // Llamar al footer horizontal de cabecera (datos de contacto) con tamaño más pequeño y más a la izquierda
  footerFichaAudiologicaCabecera(
    doc,
    { xOffset: 40, fontSize: 6, yOffset: -8 },
    datos
  );
  // === BLOQUE CÓDIGO DE COLOR ===
  // Prueba: si no hay datos.color, usar uno de ejemplo
  const colorValido =
    typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  const color = datos.codigoColor || "#008f39";
  const boxText = (datos.textoColor || "F").toUpperCase();
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y + 2;
  if (colorValido || true) {
    // Forzar a mostrar para prueba visual
    // Draw box outline in black
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
    // Solo renderiza si color es válido o para prueba
    doc.setDrawColor(color);
    doc.setLineWidth(2);
    doc.setLineCap("round");
    doc.line(boxX + boxSize + 3, boxY, boxX + boxSize + 3, boxY + boxSize);
    doc.setLineCap("butt");
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color);
    doc.text(boxText, boxX + boxSize / 2, boxY + boxSize / 2, {
      align: "center",
      baseline: "middle",
      maxWidth: boxSize - 1,
    });
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2);
  }

  // Número de ficha grande, negrita, subrayado, derecha
  const fichaX = pageW - margin - 17; // más a la izquierda
  const fichaY = y + 8;
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(`${datos.norden || ""}`, fichaX, fichaY, { align: "right" });
  // Subrayado
  const fichaWidth = doc.getTextWidth(`${datos.norden || ""}`);
  doc.setLineWidth(1.2);
  doc.line(fichaX - fichaWidth, fichaY + 2, fichaX, fichaY + 2);
  doc.setLineWidth(0.2);
  // Sede debajo
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${datos.sede || ""}`, fichaX, fichaY + 6, { align: "right" });
  // Fecha debajo de la sede
  if (datos.fecha) {
    // Formatear fecha yyyy-mm-dd a dd/mm/yyyy
    let fechaStr = datos.fecha;
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
      const [y, m, d] = fechaStr.split("-");
      fechaStr = `${d}/${m}/${y}`;
    }
    doc.setFont("helvetica", "normal").setFontSize(10);
    const label = "Fecha :";
    const labelW = doc.getTextWidth(label);
    doc
      .setFont("helvetica", "bold")
      .text(label, fichaX - labelW - 2, fichaY + 20, { align: "right" });
    doc
      .setFont("helvetica", "normal")
      .text(fechaStr, fichaX, fichaY + 20, { align: "right" });
  }
};

// === FOOTER FICHA AUDIOLOGICA (código copiado y adaptado) ===
function footerFichaAudiologica(doc, datos = {}) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginBottom = 25;
  const baseY = pageHeight - marginBottom;
  const col1X = 15; // Dirección
  const col2X = 90; // Celular
  const col3X = 122; // Email
  const col4X = 176; // Teléfono

  // Línea horizontal arriba del footer
  doc.setLineWidth(0.3);
  doc.line(15, baseY - 3, doc.internal.pageSize.getWidth() - 15, baseY - 3);
  doc.setLineWidth(0.2);

  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);

  // Definir las filas principales con datos de prueba
  const filas = [
    {
      direccion: "TRUJILLO: Nicolás de Piérola 123",
      celular: "999 888 777",
      email: "trujillo@horizontemedic.com",
      telefono: "044-123456",
    },
    {
      direccion: "HUAMACHUCO: Jr. Libertad 456",
      celular: "988 777 666",
      email: "huamachuco@horizontemedic.com",
      telefono: "044-654321",
    },
    {
      direccion: "HUANCAYO: Av. Central 789",
      celular: "977 666 555",
      email: "huancayo@horizontemedic.com",
      telefono: "064-123456",
    },
  ];

  // Fila opcional para Prescott
  const prescott = "PRESCOTT: Calle Falsa 123";

  // Renderizar filas principales
  let y = baseY;
  filas.forEach((fila) => {
    // Dirección: negrita hasta el primer ':'
    if (fila.direccion) {
      const idx = fila.direccion.indexOf(":");
      if (idx !== -1) {
        const sedeNombre = fila.direccion.substring(0, idx + 1);
        const sedeResto = fila.direccion.substring(idx + 1);
        doc.setFont("helvetica", "bold");
        doc.text(sedeNombre, col1X, y, { baseline: "top" });
        doc.setFont("helvetica", "normal");
        doc.text(sedeResto, col1X + doc.getTextWidth(sedeNombre) + 2, y, {
          baseline: "top",
        });
      } else {
        doc.setFont("helvetica", "normal");
        doc.text(fila.direccion, col1X, y, { baseline: "top" });
      }
    }
    // Celular
    if (fila.celular) {
      doc.setFont("helvetica", "bold");
      doc.text("Cel.", col2X, y, { baseline: "top" });
      doc.setFont("helvetica", "normal");
      doc.text(` ${fila.celular}`, col2X + doc.getTextWidth("Cel."), y, {
        baseline: "top",
      });
    }
    // Email
    if (fila.email) {
      doc.setFont("helvetica", "normal");
      doc.text(fila.email, col3X, y, { baseline: "top" });
    }
    // Teléfono
    if (fila.telefono) {
      doc.setFont("helvetica", "bold");
      doc.text("Telf.", col4X, y, { baseline: "top" });
      doc.setFont("helvetica", "normal");
      doc.text(` ${fila.telefono}`, col4X + doc.getTextWidth("Telf."), y, {
        baseline: "top",
      });
    }
    y += 4;
  });

  // Renderizar la fila de Prescott solo si existe
  if (prescott) {
    doc.setFont("helvetica", "normal");
    doc.text(prescott, col1X, y, { baseline: "top" });
  }
}

// === FOOTER FICHA AUDIOLOGICA (código copiado y adaptado para cabecera) ===
function footerFichaAudiologicaCabecera(doc, opts = {}, datos = {}) {
  // Posición inicial: a la izquierda del bloque de ficha
  const margin = 18;
  const logoW = 37;
  const y = 12;
  const xOffset = opts.xOffset !== undefined ? opts.xOffset : 0;
  const fontSize = opts.fontSize !== undefined ? opts.fontSize : 7;
  const baseX = margin + logoW + 8 - xOffset; // más a la izquierda si xOffset > 0
  const yOffset = opts.yOffset !== undefined ? opts.yOffset : 0;
  let yFila = y + 2 + yOffset;
  const rowH = 3.2;
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 0, 0);

  // Definir las filas principales con datos de prueba
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

  // Renderizar filas principales en horizontal
  filas.forEach((fila, idx) => {
    let x = baseX;
    // Dirección: negrita hasta el primer ':'
    if (fila.direccion) {
      const idx2 = fila.direccion.indexOf(":");
      if (idx2 !== -1) {
        const sedeNombre = fila.direccion.substring(0, idx2 + 1);
        const sedeResto = fila.direccion.substring(idx2 + 1);
        doc.setFont("helvetica", "bold");
        doc.text(sedeNombre, x, yFila, { baseline: "top" });
        x += doc.getTextWidth(sedeNombre) + 2;
        doc.setFont("helvetica", "normal");
        doc.text(sedeResto, x, yFila, { baseline: "top" });
        x += doc.getTextWidth(sedeResto) + 6;
      } else {
        doc.setFont("helvetica", "normal");
        doc.text(fila.direccion, x, yFila, { baseline: "top" });
        x += doc.getTextWidth(fila.direccion) + 6;
      }
    }
    // Celular
    if (fila.celular) {
      doc.setFont("helvetica", "bold");
      doc.text("Cel.", x, yFila, { baseline: "top" });
      x += doc.getTextWidth("Cel.");
      doc.setFont("helvetica", "normal");
      doc.text(` ${fila.celular}`, x, yFila, { baseline: "top" });
      x += doc.getTextWidth(` ${fila.celular}`) + 6;
    }
    // Email
    if (fila.email) {
      doc.setFont("helvetica", "normal");
      doc.text(fila.email, x, yFila, { baseline: "top" });
      x += doc.getTextWidth(fila.email) + 6;
    }
    // Teléfono
    if (fila.telefono) {
      doc.setFont("helvetica", "bold");
      doc.text("Telf.", x, yFila, { baseline: "top" });
      x += doc.getTextWidth("Telf.");
      doc.setFont("helvetica", "normal");
      doc.text(` ${fila.telefono}`, x, yFila, { baseline: "top" });
    }
    yFila += rowH;
  });
}

export default header_FichaAudiologica;
