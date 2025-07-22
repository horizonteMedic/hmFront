/**
 * Header maqueta para FICHA AUDIOLÓGICA (logo izq, título centrado, ficha/sede derecha)
 * Sólo muestra layout estático con espacios en blanco para valores
 * @param {jsPDF} doc - Instancia de jsPDF
 */
// === FOOTER FICHA AUDIOLOGICA (código copiado y adaptado para cabecera) ===
function footerFichaAudiologicaCabecera(doc, opts = {}) {
  const margin = 8;
  const logoW = 38;
  const y = 12;
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
const header_FichaAudiologica_Maqueta = (doc,datos) => {
  const margin = 8; // Igual que en CuestionarioAudiometria_Digitalizado.jsx
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12; // Vuelvo al valor original para mantener proporción con el nuevo margen

  // 1) Logo a la izquierda
  const logoW = 38, // Más ancho
    logoH = 13;
  const logoY = y + 2;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, logoY, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, logoY + 8);
  }
  // Footer horizontal de cabecera (datos de contacto)
  footerFichaAudiologicaCabecera(doc, { xOffset: 25, fontSize: 6, yOffset: -8 });
  // === BLOQUE CÓDIGO DE COLOR ===
  // Prueba: si no hay datos.color, usar uno de ejemplo
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  const color = datos.codigoColor || "#008f39";
  const boxText = (datos.textoColor || "F").toUpperCase();
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y + 2;
  if (colorValido) { // Forzar a mostrar para prueba visual
    // Draw box outline in black
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
    // Solo renderiza si color es válido o para prueba
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

  // 2) TÍTULO centrado, SEDE a la derecha en la misma línea, N° de Ficha debajo de sede
  const titulo = "CUESTIONARIO AUDIOMETRÍA";
  const tituloY = y + 12;
  doc.setFont("helvetica", "bold").setFontSize(13);
  doc.text(titulo, pageW / 2, tituloY, { align: "center" });
  // subrayado
  const w = doc.getTextWidth(titulo);
  doc
    .setLineWidth(0.7)
    .line((pageW - w) / 2, tituloY + 2, (pageW + w) / 2, tituloY + 2)
    .setLineWidth(0.2);


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

  // 4) Layout de datos del paciente en filas (etiquetas + líneas en blanco)
  let datosY = y + 22;
  const labelW = 34;
  const sep = 3;
  const col2X = pageW / 2 - 10;
  const col3X = pageW - margin - 60;
  const rowH = 5.2;
  doc.setFont("helvetica", "bold").setFontSize(9);

  // Fila 1: Nombre completo y Fecha de Nacimiento
  doc.setFont("helvetica", "bold");
  const labelNombre = "Nombre completo:";
  doc.text(labelNombre, margin, datosY);
  const labelNombreW = doc.getTextWidth(labelNombre);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.nombres || ""}`, margin + labelNombreW + 2, datosY);

  doc.setFont("helvetica", "bold");
  const labelFechaNac = "Fecha de Nacimiento:";
  const labelFechaNacW = doc.getTextWidth(labelFechaNac);
  // Espacio entre bloques (reducido de +40 a +20)
  const fechaNacX = margin + labelNombreW + 2 + doc.getTextWidth(`${datos.nombres || ""}`) + 9;
  doc.text(labelFechaNac, fechaNacX, datosY);
  doc.setFont("helvetica", "normal");
  // Formatear fecha a DD/MM/YYYY
  let fechaNacFormateada = datos.fechaNac || "";
  if (fechaNacFormateada && fechaNacFormateada.includes("-")) {
    const [yyyy, mm, dd] = fechaNacFormateada.split("-");
    fechaNacFormateada = `${dd}/${mm}/${yyyy}`;
  }
  doc.text(fechaNacFormateada, fechaNacX + labelFechaNacW + 2, datosY);

  // Fila 2: Ocupación, Edad, Cargo a desempeñar
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  const labelOcup = "Ocupación:";
  doc.text(labelOcup, margin, datosY);
  const labelOcupW = doc.getTextWidth(labelOcup);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.ocupacion || ""}`, margin + labelOcupW + 2, datosY);

  doc.setFont("helvetica", "bold");
  const labelEdad = "Edad:";
  // Espacio entre bloques (reducido de +30 a +15)
  const edadX = margin + labelOcupW + 2 + doc.getTextWidth(`${datos.ocupacion || ""}`) + 15;
  doc.text(labelEdad, edadX, datosY);
  const labelEdadW = doc.getTextWidth(labelEdad);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.edad || ""}`, edadX + labelEdadW + 2, datosY);
  doc.setFont("helvetica", "bold");
  doc.text("AÑOS", edadX + labelEdadW + 2 + doc.getTextWidth(`${datos.edad || ""}`) + 2, datosY);

  doc.setFont("helvetica", "bold");
  const labelCargo = "Cargo a desempeñar:";
  // Espacio entre bloques (reducido de +30 a +15)
  const cargoX = edadX + labelEdadW + 2 + doc.getTextWidth(`${datos.edad || ""}`) + 2 + doc.getTextWidth("AÑOS") + 15;
  doc.text(labelCargo, cargoX, datosY);
  const labelCargoW = doc.getTextWidth(labelCargo);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.cargo || ""}`, cargoX + labelCargoW + 2, datosY);

  // Fila 3: Empresa y Contrata
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  const labelEmp = "Empresa:";
  doc.text(labelEmp, margin, datosY);
  const labelEmpW = doc.getTextWidth(labelEmp);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.empresa || ""}`, margin + labelEmpW + 2, datosY);

  doc.setFont("helvetica", "bold");
  const labelContrata = "Contrata:";
  // Espacio entre bloques (reducido de +40 a +20)
  const contrataX = margin + labelEmpW + 2 + doc.getTextWidth(`${datos.empresa || ""}`) + 30;
  doc.text(labelContrata, contrataX, datosY);
  const labelContrataW = doc.getTextWidth(labelContrata);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.contrata || ""}`, contrataX + labelContrataW + 2, datosY);

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default header_FichaAudiologica_Maqueta;
