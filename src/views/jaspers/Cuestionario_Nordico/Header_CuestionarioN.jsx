

/**
 * Dibuja el header de la ficha audiológica: logo izquierda, número ficha grande derecha, sede debajo
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - { norden: string|number, sede: string }
 */

function footerOIT(doc, opts = {}, datos = {}) {
  const margin = 15;
  const logoW = 38;
  const y = 12;
  const xOffset = opts.xOffset !== undefined ? opts.xOffset : 25;
  const fontSize = opts.fontSize !== undefined ? opts.fontSize : 5.5;
  const yOffset = opts.yOffset !== undefined ? opts.yOffset : -8;
  const baseX = margin + logoW + 8 - xOffset;
  let yFila = y + 2 + yOffset;
  const rowH = 2.0; // más compacto
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 0, 0);

  const filas = [
    {
      direccion: datos?.dirTruPierola || "Sede Trujillo: Av. Nicolas de Piérola N°1106 Urb. San Fernando",
      celular: datos?.celTrujilloPie || "Cel. 964385075",
      email: datos?.emailTruPierola || "admisión.trujillo@horizontemedic.com",
      telefono: datos?.telfTruPierola || ""
    },
    {
      direccion: datos?.dirHuamachuco || "Sede Huamachuco: Jr. Leoncio Prado N°786",
      celular: datos?.celHuamachuco || "Cel. 990094744-969603777",
      email: datos?.emailHuamachuco || "admision.huamachuco@horizontemedic.com",
      telefono: datos?.telfHuamachuco || "Telf. 044-348070"
    },
    {
      direccion: datos?.dirHuancayo || "Sede Huancayo: Av. Huancavelica N°2225 - Distrito El Tambo",
      celular: datos?.celHuancayo || "",
      email: datos?.emailHuancayo || "admision.huancayo@horizontemedic.com",
      telefono: datos?.telfHuancayo || "Telf. 064-659554"
    }
  ];

  filas.forEach((fila) => {
    let x = baseX;
    if (fila.direccion) {
      const idx2 = fila.direccion.indexOf(":");
      if (idx2 !== -1) {
        const sedeNombre = fila.direccion.substring(0, idx2 + 1);
        const sedeResto = fila.direccion.substring(idx2 + 1);
        doc.setFont('helvetica', 'bold');
        doc.text(sedeNombre, x, yFila, { baseline: 'top' });
        x += doc.getTextWidth(sedeNombre) + 1.5;
        doc.setFont('helvetica', 'normal');
        doc.text(sedeResto, x, yFila, { baseline: 'top' });
        x += doc.getTextWidth(sedeResto) + 3;
      } else {
        doc.setFont('helvetica', 'normal');
        doc.text(fila.direccion, x, yFila, { baseline: 'top' });
        x += doc.getTextWidth(fila.direccion) + 3;
      }
    }
    if (fila.celular) {
      doc.setFont('helvetica', 'bold');
      doc.text('Cel.', x, yFila, { baseline: 'top' });
      x += doc.getTextWidth('Cel.');
      doc.setFont('helvetica', 'normal');
      doc.text(` ${fila.celular}`, x, yFila, { baseline: 'top' });
      x += doc.getTextWidth(` ${fila.celular}`) + 3;
    }
    if (fila.email) {
      doc.setFont('helvetica', 'normal');
      doc.text(fila.email, x, yFila, { baseline: 'top' });
      x += doc.getTextWidth(fila.email) + 3;
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

  // Línea final con Web
  doc.setFont('helvetica', 'normal').setFontSize(5.5);
  doc.text("Web : www.horizontemedic.com", baseX, yFila + 1.5);
}


const header_Cuestionario = (doc, datos = {}) => {
   const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // 1) Logo a la izquierda
  const logoW = 43,
    logoH = 16;
  const logoY = y ;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, logoY - 5, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, logoY + 8);
  }

  // Footer horizontal de cabecera (datos de contacto)
  footerOIT(doc, { xOffset: 3, fontSize: 5, yOffset: -8 }, datos);
  // 3) Sección de datos del paciente
  const datosPacienteY = y + 45; // Bajado de 35 a 45
  const datosPacienteX = margin + 25;
  
  
  // Datos del paciente - todos en mayúsculas y labels en negrita
  

  // 4) Información de sede y número de ficha a la derecha (al costado del bloque de color)
  const sedeValue = `${datos.sede || 'Trujillo-Pierola'}`;
  const sedeX = pageW - margin - 20;
  const sedeY = y + 5;
  
  // Número de ficha primero
  const fichaNum = `${datos.norden || "96639"}`;
  const fichaY = sedeY;
  
  // Texto "N° Ficha :" delante del número
  const fichaLabelX = sedeX - 40;
  doc.setFont("helvetica", "normal").setFontSize(9);  
  // Número de ficha grande y subrayado
  const fichaNumX = fichaLabelX + doc.getTextWidth("N° Ficha :") + 5;
  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.text(fichaNum, fichaNumX+2, fichaY);
  
  // Subrayar el número de ficha
  const fichaWidth = doc.getTextWidth(fichaNum);
  const fichaCenterX = fichaNumX + 2 + (fichaWidth / 2); // centro de la línea

  doc.setLineWidth(0.3);
  doc.line(fichaNumX + 2, fichaY + 1, fichaNumX + 4 + fichaWidth, fichaY + 1);

  // Texto sede centrado debajo de la línea
  doc.setFont("helvetica", "normal").setFontSize(6);
  doc.text(`${sedeValue}`, fichaCenterX, fichaY + 4, { align: "center" });


  // Prueba: si no hay datos.color, usar uno de ejemplo
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 500;
  if (colorValido) {
    // === BLOQUE CÓDIGO DE COLOR ===
  const color = datos.codigoColor || "#008f39";
  const boxText = (datos.textoColor || "F").toUpperCase();
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y - 9;
  
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
  

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
}

export default header_Cuestionario;
