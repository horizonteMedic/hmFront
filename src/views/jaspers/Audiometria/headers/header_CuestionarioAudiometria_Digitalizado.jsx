/**
 * Header maqueta para FICHA AUDIOLÓGICA (logo izq, título centrado, ficha/sede derecha)
 * Sólo muestra layout estático con espacios en blanco para valores
 * @param {jsPDF} doc - Instancia de jsPDF
 */
// === FOOTER FICHA AUDIOLOGICA CABECERA ===
function footerFichaAudiologicaCabecera(doc, opts = {}, datos = {}) {
  const margin = 8;
  const logoW = 38;
  const y = 10;
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
  const usableW = pageW - 2 * margin;
  let y = 12; // Vuelvo al valor original para mantener proporción con el nuevo margen

  // 1) Logo a la izquierda
  const logoW = 38, // Más ancho
    logoH = 13;
  const logoY = y -1;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, logoY, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, logoY + 8);
  }

  // === NUEVO: Usar imagen de fondo para la cabecera del cuestionario ===
  const fondoImg = "/img/header cuestionario.png";
  const fondoH = 25; // altura aproximada de la cabecera en mm (ajusta si es necesario)
  let yHeader = 25;
  try {
    doc.addImage(fondoImg, "PNG", margin, yHeader, usableW, fondoH);
  } catch (e) {
    doc.text("Imagen de cabecera no disponible", margin, yHeader + 10);
  }

  // Footer horizontal de cabecera (datos de contacto)
  footerFichaAudiologicaCabecera(doc, { xOffset: 25, fontSize: 6, yOffset: -8 }, datos);
  
  // === BLOQUE CÓDIGO DE COLOR ===
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  const color = datos.codigoColor || "#008f39";
  const boxText = (datos.textoColor || "F").toUpperCase();
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y - 3;
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
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Sede a la derecha, alineado a la derecha
  const sedeValue = `${datos.sede || ''}`;
  const sedeX = pageW - margin - 20;
  const sedeY = y + 6;
  
  // Calcular el ancho del label "Sede:" para posicionarlo correctamente
  doc.setFont("helvetica", "bold").setFontSize(9);
  const sedeLabelWidth = doc.getTextWidth("Sede:");
  const sedeLabelX = sedeX - sedeLabelWidth - 51.5; // 25 unidades de separación hacia la izquierda
  
  // Agregar label "Sede:" antes del valor
  doc.text("Sede:", sedeLabelX, sedeY, { align: "left" });
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(sedeValue, sedeX, sedeY, { align: "right" });

  // N° de Ficha debajo de la sede, alineado a la derecha, solo el número
  const fichaDato = `${datos.norden || ''}`;
  const fichaY = sedeY + 5.4;
  const fichaX = pageW - margin - 20;
  
  // Calcular el ancho del label "N° Ficha:" para posicionarlo correctamente
  doc.setFont("helvetica", "bold").setFontSize(9);
  const fichaLabelWidth = doc.getTextWidth("N° Ficha:");
  const fichaLabelX = fichaX - fichaLabelWidth - 22; // 25 unidades de separación hacia la izquierda
  
  // Agregar label "N° Ficha:" antes del valor
  doc.text("N° Ficha:", fichaLabelX, fichaY + 1, { align: "left" });
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(fichaDato, fichaX, fichaY + 1, { align: "right" });

  // === Datos del paciente con posicionamiento libre ===
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Nombre completo
  const xNombres = margin + 32;
  const yNombres = margin + 27;
  doc.text(String(datos.nombres || ""), xNombres, yNombres, { maxWidth: 90 });

  // Fecha de Encuesta
  const xfechaCuestionario = margin + 167;
  const yfechaCuestionario = margin + 23;
  let fechaCuestionarioFormateada = datos.fechaCuestionario || "";
  
  // Formatear fecha de encuesta a DD/MM/YYYY
  if (fechaCuestionarioFormateada && fechaCuestionarioFormateada.includes("-")) {
    // Formato yyyy-mm-dd del backend
    const [yyyy, mm, dd] = fechaCuestionarioFormateada.split("-");
    fechaCuestionarioFormateada = `${dd}/${mm}/${yyyy}`;
  } else if (fechaCuestionarioFormateada && fechaCuestionarioFormateada.includes("/")) {
    // Si ya viene con /, verificar el formato
    const partes = fechaCuestionarioFormateada.split("/");
    if (partes.length === 3) {
      if (partes[0].length === 4) {
        // Formato yyyy/mm/dd
        const [yyyy, mm, dd] = partes;
        fechaCuestionarioFormateada = `${dd}/${mm}/${yyyy}`;
      }
      // Si ya está en dd/mm/yyyy, se mantiene igual
    }
  }
  
  doc.text(fechaCuestionarioFormateada, xfechaCuestionario, yfechaCuestionario);

  // Fecha de Nacimiento
  const xFechaNac = margin + 167;
  const yFechaNac = margin + 27;
  let fechaNacFormateada = datos.fechaNac || "";
  
  // Formatear fecha a DD/MM/YYYY
  if (fechaNacFormateada && fechaNacFormateada.includes("-")) {
    // Formato yyyy-mm-dd del backend
    const [yyyy, mm, dd] = fechaNacFormateada.split("-");
    fechaNacFormateada = `${dd}/${mm}/${yyyy}`;
  } else if (fechaNacFormateada && fechaNacFormateada.includes("/")) {
    // Si ya viene con /, verificar el formato
    const partes = fechaNacFormateada.split("/");
    if (partes.length === 3) {
      if (partes[0].length === 4) {
        // Formato yyyy/mm/dd
        const [yyyy, mm, dd] = partes;
        fechaNacFormateada = `${dd}/${mm}/${yyyy}`;
      }
      // Si ya está en dd/mm/yyyy, se mantiene igual
    }
  }
  
  doc.text(fechaNacFormateada, xFechaNac, yFechaNac);

  // Ocupación
  const xOcupacion = margin + 22;
  const yOcupacion = margin + 32;
  doc.text(String(datos.ocupacion || ""), xOcupacion, yOcupacion, { maxWidth: 60 });

  // Edad
  const xEdad = margin + 97;
  const yEdad = margin +  32;
  doc.text(String(datos.edad || ""), xEdad, yEdad);

  // Cargo a desempeñar
  const xCargo = margin + 142.5;
  const yCargo = margin + 31.5;
  doc.text(String(datos.cargo || ""), xCargo, yCargo, { maxWidth: 50 });

  // Empresa
  const xEmpresa = margin + 22;
  const yEmpresa = margin + 36.5;
  doc.text(String(datos.empresa || ""), xEmpresa, yEmpresa, { maxWidth: 80 });

  // Contrata
  const xContrata = margin + 116;
  const yContrata = margin + 36.5;
  doc.text(String(datos.contrata || ""), xContrata, yContrata, { maxWidth: 80 });

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default header_FichaAudiologica_Maqueta;
