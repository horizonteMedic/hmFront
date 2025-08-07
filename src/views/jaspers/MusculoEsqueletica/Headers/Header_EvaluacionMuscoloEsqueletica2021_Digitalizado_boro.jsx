const headerEvaluacionMuscoloEsqueletica = (doc, datos) => {
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // === NUEVO: Usar imagen de fondo para la cabecera ===
  const fondoImg = "/img/header_EvaluacionMusculoEsqueletica_boro.png";
  const fondoH = 47; // altura aproximada de la cabecera en mm (ajusta si es necesario)
  let yHeader = 0; // Pegado a la parte superior
  try {
    doc.addImage(fondoImg, "PNG", 0, yHeader, pageW, fondoH); // Todo el ancho de la hoja
  } catch (e) {
    doc.text("Imagen de cabecera no disponible", margin, yHeader + 10);
  }

  // 2) TÍTULO centrado - FICHA DE EVALUACIÓN MÚSCULO ESQUELÉTICA
  const titulo1 = "FICHA DE EVALUACIÓN MÚSCULO";
  const titulo2 = "ESQUELÉTICA";
  const tituloY = y - 4; // Subido de y + 15 a y + 8
  doc.setFont("helvetica", "bold").setFontSize(13);
  doc.text(titulo1, pageW / 2, tituloY, { align: "center" });
  doc.text(titulo2, pageW / 2, tituloY + 6, { align: "center" });

  // 3) Información de sede y número de ficha a la derecha
  const sedeValue = datos.sede || 'Trujillo-Pierola';
  const sedeX = pageW - margin - 25;
  const sedeY = y + 1; // Subido de y + 6 a y + 2
  
  // Número de ficha primero
  const fichaNum = datos.norden || datos.numeroFicha || datos.nroFicha || "96639";
  const fichaY = sedeY;
  
  // Texto "N° Ficha :" delante del número
  const fichaLabelX = sedeX - 45;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("N° Ficha :", fichaLabelX, fichaY);
  
  // Número de ficha grande y subrayado
  const fichaNumX = fichaLabelX + doc.getTextWidth("N° Ficha :") + 5;
  doc.setFont("helvetica", "bold").setFontSize(22);
  doc.text(fichaNum, fichaNumX, fichaY);
  
  // Subrayar el número de ficha
  const fichaWidth = doc.getTextWidth(fichaNum);
  doc.setLineWidth(0.3);
  doc.line(fichaNumX, fichaY + 1, fichaNumX + fichaWidth, fichaY + 1);
  
  // Sede debajo del número de ficha
  const sedeY2 = sedeY + 5;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(`Sede : ${sedeValue}`, sedeX, sedeY2, { align: "right" });

  // 4) NÚMERO DE PÁGINA
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("Pag. 1", pageW - margin, margin + 5, { align: "right" });

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default headerEvaluacionMuscoloEsqueletica;
