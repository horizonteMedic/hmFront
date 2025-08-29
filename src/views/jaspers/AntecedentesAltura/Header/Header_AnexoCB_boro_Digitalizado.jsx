/**
 * Header para AnexoCB_boro (logo izq, footer cabecera, sede/ficha derecha, bloque color)
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {Object} opts - Opciones de configuración
 * @param {Object} datos - Datos del documento
 */
const headerAnexoCB_boro = (doc, datos = {}) => {
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // === 1) LOGO A LA IZQUIERDA ===
  const logoW = 38;
  const logoH = 13;
  const logoY = y - 1;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, logoY, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, logoY + 8);
  }

  // === 2) FOOTER HORIZONTAL DE CABECERA (datos de contacto) ===
  const footerCabecera = (doc, opts = {}, datos = {}) => {
    const logoW = 38;
    const xOffset = opts.xOffset !== undefined ? opts.xOffset : 25;
    const fontSize = opts.fontSize !== undefined ? opts.fontSize : 6;
    const yOffset = opts.yOffset !== undefined ? opts.yOffset : -8;
    const baseX = margin + logoW + 8 - xOffset;
    let yFila = y + 2 + yOffset;
    const rowH = 3.2;
    
    doc.setFontSize(fontSize);
    doc.setTextColor(0, 0, 0);
    
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
    
    filas.forEach((fila) => {
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
  };

  // Ejecutar footer de cabecera
  footerCabecera(doc, { xOffset: 25, fontSize: 6, yOffset: -8 }, datos);

  // === 3) SEDE Y NÚMERO DE FICHA A LA DERECHA ===
  const sedeValue = `${datos.sede || ''}`;
  const sedeX = pageW - margin - 20;
  const sedeY = y + 6;
  
  // Sede a la derecha
  doc.setFont("helvetica", "bold").setFontSize(9);
  const sedeLabelWidth = doc.getTextWidth("Sede:");
  const sedeLabelX = sedeX - sedeLabelWidth - 51.5;
  
  doc.text("Sede:", sedeLabelX, sedeY, { align: "left" });
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(sedeValue, sedeX, sedeY, { align: "right" });

  // N° de Ficha debajo de la sede
  const fichaDato = `${datos.norden || datos.numeroFicha || ''}`;
  const fichaY = sedeY + 5.4;
  const fichaX = pageW - margin - 20;
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  const fichaLabelWidth = doc.getTextWidth("N° Ficha:");
  const fichaLabelX = fichaX - fichaLabelWidth - 22;
  
  doc.text("N° Ficha:", fichaLabelX, fichaY + 1, { align: "left" });
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(fichaDato, fichaX, fichaY + 1, { align: "right" });

  // === 4) BLOQUE CÓDIGO DE COLOR ===
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  const color = datos.codigoColor || "#008f39";
  const boxText = (datos.textoColor || "T").toUpperCase();
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y - 3;
  
  if (colorValido) {
    // Draw box outline in black
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
    
    // Solo renderiza si color es válido
    doc.setDrawColor(color);
    doc.setLineWidth(2);
    doc.setLineCap('round');
    doc.line(boxX + boxSize + 3, boxY, boxY + boxSize);
    doc.setLineCap('butt');
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color);
    doc.text(boxText, boxX + boxSize/2, boxY + (boxSize/2), { 
      align: "center", 
      baseline: "middle", 
      maxWidth: boxSize - 1 
    });
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2);
  }

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default headerAnexoCB_boro;
