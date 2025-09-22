const headerAnexo16Boroo = (doc, datos, numeroPagina = 1) => {
  const pageW = doc.internal.pageSize.getWidth();
  
  // Márgenes de 8mm a cada lado (consistente con Anexo2)
  const margenLateral = 8; // 8mm
  const margenSuperior = 15; // 15mm - margen superior aumentado
  
  let y = margenSuperior; // Posición ajustada con margen superior

  // Datos de prueba
  const datosPrueba = {
    sede: "Trujillo-Pierola",
    norden: "96639",
    color: 1,
    codigoColor: "#008f39",
    textoColor: "F",
    empresa: "ESTA ES UNA EMPRESA SUPER LARGA QUE DEBE BAJAR PARA CONTINUAR EL TEXTO",
    contrata: "ESTA ES UNA CONTRATA SUPER LARGA QUE TAMBIEN DEBE BAJAR PARA CONTINUAR",
    apellidosNombres: "CASTILLO PLASENCIA HADY KATHERINE",
    tipoExamen: "PRE OCUPACIONAL" // PRE OCUPACIONAL, ANUAL, RETIRO, REUBICACIÓN
  };

  const datosReales = {
    sede: datos?.informacionSede?.sede ?? "Trujillo-Pierola",
    norden: String(datos?.norden_n_orden ?? ""),
    color: datos?.informacionSede?.color ?? 1,
    codigoColor: datos?.informacionSede?.codigoColor?.trim() ?? "#008f39",
    textoColor: datos?.informacionSede?.textoColor?.trim() ?? "F",
    empresa: datos?.empresa ?? "ESTA ES UNA EMPRESA SUPER LARGA QUE DEBE BAJAR PARA CONTINUAR EL TEXTO",
    contrata: datos?.contrata ?? "ESTA ES UNA CONTRATA SUPER LARGA QUE TAMBIEN DEBE BAJAR PARA CONTINUAR",
    apellidosNombres: datos?.apellidosNombres ?? "CASTILLO PLASENCIA HADY KATHERINE",
    tipoExamen: datos?.tipoExamen ?? "PRE OCUPACIONAL"
  };

  const datosFinales = datos && Object.keys(datos).length > 0 ? datosReales : datosPrueba;

  // 1) Logo a la izquierda - alineado con número de orden
  const logoW = 50,
    logoH = 15;
  const logoY = y -8; // Alineado con infoY (número de orden)
  const logoX = margenLateral; // Posición con margen lateral
  try {
    doc.addImage("./img/logo-color.png", "PNG", logoX, logoY - 2, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", logoX, logoY + 6);
  }

  // === BLOQUE CÓDIGO DE COLOR ===
  const colorValido =
    typeof datosFinales.color === "number" &&
    datosFinales.color >= 1 &&
    datosFinales.color <= 500;

  const color = datosFinales.codigoColor || "#008f39";
  const boxText = (datosFinales.textoColor || "F").toUpperCase();
  let boxSize = 15;
  let boxX = pageW - margenLateral - boxSize; // Margen lateral del borde derecho
  let boxY = y - 8; // Subido significativamente más arriba

  if (colorValido) {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
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
      maxWidth: boxSize - 1
    });
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2);
  }
  y -= 7;

  // 2) Información organizada a la derecha
  const infoX = pageW - margenLateral - 5; // Margen lateral + 5mm del borde derecho
  const infoY = y + 2; // Ajustado para y = margenSuperior

  // Número de orden
  const fichaValue = String(datosFinales.norden || "").padStart(5, "0") + "-TP";
  doc.setFont("helvetica", "bold").setFontSize(9);
  const ordenLabel = "N° de ORDEN:";
  const ordenLabelWidth = doc.getTextWidth(ordenLabel);
  const ordenX = infoX - 60; // Posición con margen (corrido 10 puntos a la izquierda)
  doc.text(ordenLabel, ordenX, infoY);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(fichaValue, ordenX + ordenLabelWidth + 2, infoY);

  // === SEDE (dinámica para no pisar bloque de color) ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  const sedeLabel = "Sede:";
  const sedeLabelWidth = doc.getTextWidth(sedeLabel);

  doc.setFont("helvetica", "normal").setFontSize(8);
  const sedeValue = String(datosFinales.sede || "");
  const sedeValueWidth = doc.getTextWidth(sedeValue);
  const sedeTotalWidth = sedeLabelWidth + 2 + sedeValueWidth;

  const espacioMinimo = 10;
  const limiteDerecho = boxX - espacioMinimo;
  const sedeX = Math.max(ordenX, limiteDerecho - sedeTotalWidth);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text(sedeLabel, sedeX, infoY + 5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(sedeValue, sedeX + sedeLabelWidth + 2, infoY + 5);

  // Página
  doc.setFont("helvetica", "bold").setFontSize(9);
  const pagLabel = "Pag:";
  const pagLabelWidth = doc.getTextWidth(pagLabel);
  doc.text(pagLabel, ordenX, infoY + 10);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(numeroPagina.toString(), ordenX + pagLabelWidth + 2, infoY + 10);

  // 3) TÍTULO centrado
  doc.setFont("helvetica", "bold").setFontSize(11);
  const titulo = "ANEXO 16 BOROO";
  const tituloY = y + 10;
  doc.text(titulo, pageW / 2, tituloY, { align: "center" });

  const w = doc.getTextWidth(titulo);
  doc
    .setLineWidth(0.7)
    .line((pageW - w) / 2, tituloY + 2, (pageW + w) / 2, tituloY + 2)
    .setLineWidth(0.2);

  // 4) SECCIONES DE DATOS DEL PACIENTE EN 3 FILAS
  let dataY = tituloY + 7; // Posición después del título, más cerca
  
  // Calcular posiciones de las columnas para la fila 1
  const col1X = margenLateral; // Columna izquierda
  const col2X = pageW / 2 + 10; // Columna derecha (mitad de la página + margen)
  
  // === FILA 1: NOMBRE APELLIDOS + EXAMEN MEDICO ===
  // NOMBRE APELLIDOS (columna izquierda)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("NOMBRE APELLIDOS:", col1X, dataY);
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Calcular ancho disponible para el texto de nombre
  const nombreLabelWidth = doc.getTextWidth("NOMBRE APELLIDOS:");
  const nombreStartX = col1X + nombreLabelWidth + 5;
  const nombreMaxWidth = col2X - nombreStartX - 10; // Ancho disponible hasta la columna derecha
  
  // Dividir el texto de nombre en líneas si es necesario
  const nombreLines = doc.splitTextToSize(datosFinales.apellidosNombres, nombreMaxWidth);
  let nombreY = dataY;
  
  nombreLines.forEach((line, index) => {
    doc.text(line, nombreStartX, nombreY);
    if (index < nombreLines.length - 1) {
      nombreY += 4; // Espaciado entre líneas del mismo campo
    }
  });
  
  // EXAMEN MEDICO (columna derecha)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("EXAMEN MEDICO:", col2X, dataY);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.tipoExamen, col2X + 30, dataY);
  
  // Ajustar dataY basado en la fila más larga
  const fila1MaxY = Math.max(nombreY, dataY);
  dataY = fila1MaxY + 4;
  
  // === FILA 2: SOLO EMPRESA (ancho completo) ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("EMPRESA:", col1X, dataY);
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Calcular ancho disponible para el texto de empresa (ancho completo)
  const empresaLabelWidth = doc.getTextWidth("EMPRESA:");
  const empresaStartX = col1X + empresaLabelWidth + 5;
  const empresaMaxWidth = pageW - margenLateral - empresaStartX - 10; // Ancho completo hasta el borde derecho
  
  // Dividir el texto de empresa en líneas si es necesario
  const empresaLines = doc.splitTextToSize(datosFinales.empresa, empresaMaxWidth);
  let empresaY = dataY;
  
  empresaLines.forEach((line, index) => {
    doc.text(line, empresaStartX, empresaY);
    if (index < empresaLines.length - 1) {
      empresaY += 4; // Espaciado entre líneas del mismo campo
    }
  });
  
  dataY = empresaY + 4;
  
  // === FILA 3: SOLO CONTRATA (ancho completo) ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CONTRATA:", col1X, dataY);
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Calcular ancho disponible para el texto de contrata (ancho completo)
  const contrataLabelWidth = doc.getTextWidth("CONTRATA:");
  const contrataStartX = col1X + contrataLabelWidth + 5;
  const contrataMaxWidth = pageW - margenLateral - contrataStartX - 10; // Ancho completo hasta el borde derecho
  
  // Dividir el texto de contrata en líneas si es necesario
  const contrataLines = doc.splitTextToSize(datosFinales.contrata, contrataMaxWidth);
  let contrataY = dataY;
  
  contrataLines.forEach((line, index) => {
    doc.text(line, contrataStartX, contrataY);
    if (index < contrataLines.length - 1) {
      contrataY += 4; // Espaciado entre líneas del mismo campo
    }
  });
  
  dataY = contrataY;
  
  
  // restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.setTextColor(0, 0, 0);
};

export default headerAnexo16Boroo;



