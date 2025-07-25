/**
 * Header para FICHA DE EVALUACIÓN AUDIOMETRÍA (logo izq, título centrado, ficha/sede derecha)
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - Datos del paciente y ficha
 */
const header_Audiometria2021_Digitalizado = (doc, datos = {}) => {
  const margin = 18;
  const pageW = doc.internal.pageSize.getWidth();
  const usableW = pageW - 2 * margin;
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

  // === NUEVO: Usar imagen de fondo para la cabecera de audiometría 2021 ===
  const fondoImg = "/img/Header_Audiometria2021Digitalizado.png";
  const fondoH = 22; // altura aproximada de la cabecera en mm (ajusta si es necesario)
  let yHeader = 22;
  try {
    doc.addImage(fondoImg, "PNG", margin, yHeader, usableW, fondoH);
  } catch (e) {
    doc.text("Imagen de cabecera no disponible", margin, yHeader + 10);
  }

  // === BLOQUE CÓDIGO DE COLOR ===
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  const color = datos.codigoColor || "#008f39";
  const boxText = (datos.textoColor || "F").toUpperCase();
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y - 6.5;
  if (colorValido ) { // Forzar a mostrar para prueba visual
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
  // 2) Número de ficha arriba y sede debajo, alineados a la derecha
  const fichaX = pageW - margin - 18;
  const bloqueY = y + 5; // subir el bloque 3 puntos más arriba
  
  // Número de orden arriba
  const fichaValue = String(datos.norden || '');
  
  // Calcular el ancho del label "N° Ficha:" para posicionarlo correctamente
  doc.setFont("helvetica", "bold").setFontSize(9);
  const fichaLabelWidth = doc.getTextWidth("N° Ficha:");
  const fichaLabelX = fichaX - fichaLabelWidth - 25; // 25 unidades de separación hacia la izquierda
  
  // Agregar label "N° Ficha:" antes del valor
  doc.text("N° Ficha:", fichaLabelX, bloqueY, { align: "left" });
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(fichaValue, fichaX, bloqueY, { align: "right" });
  
  // Sede debajo
  const sedeValue = String(datos.sede || '');
  
  // Calcular el ancho del label "Sede:" para posicionarlo correctamente
  doc.setFont("helvetica", "bold").setFontSize(9);
  const sedeLabelWidth = doc.getTextWidth("Sede:");
  const sedeLabelX = fichaX - sedeLabelWidth - 48; // 25 unidades de separación hacia la izquierda
  
  // Agregar label "Sede:" antes del valor
  doc.text("Sede:", sedeLabelX, bloqueY + 10, { align: "left" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(sedeValue, fichaX, bloqueY + 10, { align: "right" });

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

  // === NUEVO: Datos del paciente con posicionamiento libre ===
  doc.setFont("helvetica", "normal").setFontSize(8);

  // Apellidos y Nombres
  const xNombres = margin + 30;
  const yNombres = margin + 7.3;
  doc.text(String(datos.nombres || ""), xNombres, yNombres, { maxWidth: 70 });

  // Fecha
  const xFecha = margin + 140;
  const yFecha = margin + 7.3;
  let fechaStr = String(datos.fechaAu || "");
  // Formatear fecha yyyy-mm-dd a dd/mm/yyyy
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    const [y, m, d] = fechaStr.split('-');
    fechaStr = `${d}/${m}/${y}`;
  }
  doc.text(fechaStr, xFecha, yFecha);

  // DNI
  const xDni = margin + 30;
  const yDni = margin + 12.1;
  doc.text(String(datos.dni || ""), xDni, yDni);

  // Edad
  const xEdad = margin + 95;
  const yEdad = margin + 12.1;
  doc.text(String(datos.edad || ""), xEdad, yEdad);

  // Sexo - Marcar "X" según el valor
  const xSexoM = margin + 150.2; // Posición para Masculino
  const xSexoF = margin + 168.2; // Posición para Femenino
  const ySexo = margin + 12.3;
  
  const sexo = String(datos.sexo || "").toUpperCase().trim();
  if (sexo === "M") {
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("X", xSexoM, ySexo);
  } else if (sexo === "F") {
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("X", xSexoF, ySexo);
  }
  doc.setFont("helvetica", "normal").setFontSize(8);

  // Área de Trabajo
  const xAreaTrabajo = margin + 30;
  const yAreaTrabajo = margin + 17;
  doc.text(String(datos.areaTrabajo || ""), xAreaTrabajo, yAreaTrabajo, { maxWidth: 60 });

  // Cargo
  const xCargo = margin + 104;
  const yCargo = margin + 17;
  doc.text(String(datos.ocupacion || ""), xCargo, yCargo, { maxWidth: 50 });

  // Empresa
  const xEmpresa = margin + 30;
  const yEmpresa = margin + 21.8;
  doc.text(String(datos.empresa || ""), xEmpresa, yEmpresa, { maxWidth: 70 });

  // Contrata
  const xContrata = margin + 119;
  const yContrata = margin + 21.8;
  doc.text(String(datos.contrata || ""), xContrata, yContrata, { maxWidth: 50 });

  
  // restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default header_Audiometria2021_Digitalizado;
