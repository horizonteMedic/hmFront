const headerAnexo2 = (doc, datos, numeroPagina = 1) => {
  const pageW = doc.internal.pageSize.getWidth();
  
  // Márgenes de 8mm a cada lado (consistente con Anexo2)
  const margenLateral = 8; // 8mm
  const margenSuperior = 15; // 15mm - margen superior aumentado
  
  let y = margenSuperior; // Posición ajustada con margen superior

  // Datos de prueba
  const datosPrueba = {
    sede: "Trujillo-Nicolas de Pierola",
    norden: "96639",
    color: 1,
    codigoColor: "#008f39",
    textoColor: "F"
  };

  const datosReales = {
    sede: datos?.informacionSede?.sede ?? "Trujillo-Nicolas de Pierola",
    norden: String(datos?.norden_n_orden ?? ""),
    color: datos?.informacionSede?.color ?? 1,
    codigoColor: datos?.informacionSede?.codigoColor?.trim() ?? "#008f39",
    textoColor: datos?.informacionSede?.textoColor?.trim() ?? "F"
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
  const fichaValue = String(datosFinales.norden || "").padStart(5, "0");
  doc.setFont("helvetica", "bold").setFontSize(9);
  const ordenLabel = "N° Orden:";
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
  doc.setFont("helvetica", "bold").setFontSize(13);
  const titulo = "ANEXO 16";
  const tituloY = y + 10;
  doc.text(titulo, pageW / 2, tituloY, { align: "center" });

  const w = doc.getTextWidth(titulo);
  doc
    .setLineWidth(0.7)
    .line((pageW - w) / 2, tituloY + 2, (pageW + w) / 2, tituloY + 2)
    .setLineWidth(0.2);

  // restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default headerAnexo2;
