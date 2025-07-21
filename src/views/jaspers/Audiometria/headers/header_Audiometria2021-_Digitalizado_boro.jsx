/**
 * Header para FICHA DE EVALUACIÓN AUDIOMETRÍA (logo izq, título centrado, ficha/sede derecha)
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - Datos del paciente y ficha
 */
const header_Audiometria2021_Digitalizado = (doc, datos = {}) => {
  // Valores de ejemplo por defecto
  // datos = {
  //   norden: datos.norden || '95899',
  //   sede: datos.sede || 'SEDE CENTRAL',
  //   nombres: datos.nombres || 'ROJAS SIGUENZA JOSUE SPENCER',
  //   edad: datos.edad || '29',
  //   fechaAu: datos.fechaAu || '24/10/2025',
  //   dni: datos.dni || '12345678',
  //   cargo: datos.cargo || 'ADMINISTRADOR ESPECIALISTA',
  //   sexo: datos.sexo || 'M',
  //   areaTrabajo: datos.areaTrabajo || 'ALMACÉN',
  //   contrata: datos.contrata || 'CONSTRUCTORA E INMOBILIARIA JAMELY E.I. R.L.',
  //   empresa: datos.empresa || 'EMPRESA DEL AREA PRINCIPAL DE GRANDES ZONAS XYZ S.A.C.',
  //   ...datos
  // };
  const margin = 18;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // 1) Logo a la izquierda
  const logoW = 35,
    logoH = 15;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, y - 4, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, y + 8);
  }
  // === BLOQUE CÓDIGO DE COLOR ===
  // Prueba: si no hay datos.color, usar uno de ejemplo
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  const color = datos.codigoColor || "#008f39";
  const boxText = (datos.textoColor || "F").toUpperCase();
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y - 5;
  if (colorValido || true) { // Forzar a mostrar para prueba visual
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
  y -= 7;
  // 2) Número de ficha grande y sede debajo, alineados a la derecha
  const fichaX = pageW - margin - 18;
  const bloqueY = y + 5; // subir el bloque 3 puntos más arriba
  const sedeValue = String(datos.sede || 'TRUJILLO - NICOLAS DE PIEROLA');
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(sedeValue, fichaX, bloqueY, { align: "right" });
  // Número de orden debajo
  const fichaValue = String(datos.norden || '97800');
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(fichaValue, fichaX, bloqueY + 7, { align: "right" });

  // 3) TÍTULO perfectamente centrado
  doc.setFont("helvetica", "bold").setFontSize(13);
  const titulo = "FICHA DE EVALUACIÓN AUDIOMETRÍA";
  const tituloY = y + 10;
  doc.text(titulo, pageW / 2, tituloY, { align: "center" });
  // subrayado
  const w = doc.getTextWidth(titulo);
  doc
    .setLineWidth(0.7)
    .line((pageW - w) / 2, tituloY + 2, (pageW + w) / 2, tituloY + 2)
    .setLineWidth(0.2);

  // 4) Datos del paciente en filas
  let datosY = y + 22;
  const labelW = 34;
  const sep = 3;
  const col2X = pageW / 2 - 10;
  const col3X = pageW - margin - 60;
  const rowH = 5.2;
  doc.setFontSize(9);

  // Fila 1: Apellidos y Nombres | Edad | Fecha
  doc.setFont("helvetica", "bold");
  const labelNombres = "Apellidos y Nombres";
  doc.text(labelNombres, margin, datosY);
  doc.text(":", margin + labelW, datosY);
  doc.setFont("helvetica", "normal");
  const nombresW = doc.getTextWidth(String(datos.nombres || ""));
  doc.text(String(datos.nombres || ""), margin + labelW + sep, datosY);

  doc.setFont("helvetica", "bold");
  const labelEdad = "Edad";
  const edadX = margin + labelW + sep + nombresW + 20;
  doc.text(labelEdad, edadX, datosY);
  doc.text(":", edadX + 15, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.edad || ""), edadX + 19, datosY);

  doc.setFont("helvetica", "bold");
  const labelFecha = "Fecha";
  const fechaX = edadX + 30;
  doc.text(labelFecha, fechaX, datosY);
  doc.text(":", fechaX + 15, datosY);
  doc.setFont("helvetica", "normal");
  // Formatear fecha yyyy-mm-dd a dd/mm/yyyy
  let fechaStr = String(datos.fechaAu || "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    const [y, m, d] = fechaStr.split('-');
    fechaStr = `${d}/${m}/${y}`;
  }
  doc.text(fechaStr, fechaX + 19, datosY);

  // Fila 2: DNI | Cargo | Sexo
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  const labelDni = "DNI";
  doc.text(labelDni, margin, datosY);
  doc.text(":", margin + labelW, datosY);
  doc.setFont("helvetica", "normal");
  const dniW = doc.getTextWidth(String(datos.dni || ""));
  doc.text(String(datos.dni || ""), margin + labelW + sep, datosY);

  doc.setFont("helvetica", "bold");
  const labelCargo = "Cargo";
  const cargoX = margin + labelW + sep + dniW + 20;
  doc.text(labelCargo, cargoX, datosY);
  doc.text(":", cargoX + 15, datosY);
  doc.setFont("helvetica", "normal");
  const cargoW = doc.getTextWidth(String(datos.ocupacion || ""));
  doc.text(String(datos.ocupacion || ""), cargoX + 19, datosY);

  doc.setFont("helvetica", "bold");
  const labelSexo = "Sexo";
  const sexoX = cargoX + 30 + cargoW;
  doc.text(labelSexo, sexoX, datosY);
  doc.text(":", sexoX + 15, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.sexo || ""), sexoX + 19, datosY);

  // Fila 3: Área de Trabajo | Contrata
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  const labelArea = "Área de Trabajo";
  doc.text(labelArea, margin, datosY);
  doc.text(":", margin + labelW, datosY);
  doc.setFont("helvetica", "normal");
  const areaW = doc.getTextWidth(String(datos.areaTrabajo || ""));
  doc.text(String(datos.areaTrabajo || ""), margin + labelW + sep, datosY);

  doc.setFont("helvetica", "bold");
  const labelContrata = "Contrata";
  const contrataX = margin + labelW + sep + areaW + 30;
  doc.text(labelContrata, contrataX, datosY);
  doc.text(":", contrataX + 15, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.contrata || ""), contrataX + 19, datosY);

  // Fila 4: Empresa
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  const labelEmp = "Empresa";
  doc.text(labelEmp, margin, datosY);
  doc.text(":", margin + labelW, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.empresa || ""), margin + labelW + sep, datosY);

  // restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default header_Audiometria2021_Digitalizado;
