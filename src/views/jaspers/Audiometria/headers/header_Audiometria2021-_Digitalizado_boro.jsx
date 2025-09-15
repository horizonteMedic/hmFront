/**
 * Header para FICHA DE EVALUACIÓN AUDIOMETRÍA (logo izq, título centrado, ficha/sede derecha)
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - Datos del paciente y ficha
 */
const header_Audiometria2021_Digitalizado = (doc, datos = {}) => {
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
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 500;
  const color = datos.codigoColor || "#008f39";
  const boxText = (datos.textoColor || "F").toUpperCase();
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y - 6.5;
  if (colorValido) {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
    doc.setDrawColor(color);
    doc.setLineWidth(2);
    doc.setLineCap('round');
    doc.line(boxX + boxSize + 3, boxY, boxX + boxSize + 3, boxY + boxSize);
    doc.setLineCap('butt');
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color);
    doc.text(boxText, boxX + boxSize/2, boxY + boxSize/2, { align: "center", baseline: "middle", maxWidth: boxSize - 1 });
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2);
  }
  y -= 7;

  // 2) Número de ficha arriba y sede debajo, alineados a la derecha
  const fichaX = pageW - margin - 18;
  const bloqueY = y + 5;
  
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
  
  const w = doc.getTextWidth(titulo);
  doc
    .setLineWidth(0.7)
    .line((pageW - w) / 2, tituloY + 2, (pageW + w) / 2, tituloY + 2)
    .setLineWidth(0.2);

  // 4) Datos del paciente en filas
  let datosY = y + 22;
  const labelW = 34;
  const sep = 3;
  const rowH = 5.2;
  doc.setFontSize(8);

  // Título de la sección
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("1.- Datos Personales", margin, datosY);
  datosY += 4;

  // Fila 1: Apellidos y Nombres | Edad | Fecha
  doc.setFont("helvetica", "bold").setFontSize(8);
  const labelNombres = "Apellidos y Nombres";
  doc.text(labelNombres, margin, datosY);
  doc.text(":", margin + labelW, datosY);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const nombresW = doc.getTextWidth(datos.nombres || '');
  doc.text(datos.nombres || '', margin + labelW + sep, datosY);

  doc.setFont("helvetica", "bold").setFontSize(8);
  const labelEdad = "Edad";
  const edadX = margin + labelW + sep + nombresW + 18;
  doc.text(labelEdad, edadX, datosY);
  doc.text(":", edadX + 8, datosY);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.edad || '', edadX + 12, datosY);
  doc.text(" AÑOS", edadX + 13.5 + doc.getTextWidth(datos.edad || ''), datosY);

  doc.setFont("helvetica", "bold").setFontSize(8);
  const labelFecha = "Fecha";
  const fechaX = edadX + 30;
  doc.text(labelFecha, fechaX, datosY);
  doc.text(":", fechaX + 15, datosY);
  
  // Formatear fechaAu a DD/MM/YYYY si viene como YYYY-MM-DD
  let fechaFormateada = datos.fechaAu || '';
  if (fechaFormateada && fechaFormateada.includes("-")) {
    const [yyyy, mm, dd] = fechaFormateada.split("-");
    fechaFormateada = `${dd}/${mm}/${yyyy}`;
  }
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(fechaFormateada, fechaX + 19, datosY);
  

  // Fila 2: DNI | Ptrabajo | Sexo
  datosY += rowH;
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  const labelPuestoDeTrabajo = "Puesto de Trabajo";
  const cargoX = margin + labelW + sep  -37;
  doc.text(labelPuestoDeTrabajo, cargoX, datosY);
  doc.text(":", cargoX + 34, datosY);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const cargoW = doc.getTextWidth(datos.ocupacion || '');
  doc.text(datos.ocupacion || '', cargoX + 37, datosY);
  

  doc.setFont("helvetica", "bold").setFontSize(8);
  const labelSexo = "Sexo";
  const sexoX = cargoX + 95.5 + cargoW;
  doc.text(labelSexo, sexoX, datosY);
  doc.text(":", sexoX + 15, datosY);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.sexo || '', sexoX + 19, datosY);

  datosY += rowH;
  doc.setFont("helvetica", "bold").setFontSize(8);
  const labelEmp = "Empresa";
  doc.text(labelEmp, margin, datosY);
  doc.text(":", margin + labelW, datosY);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.empresa || '', margin + labelW + sep, datosY);
  // Fila 4: Empresa
  

  // restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default header_Audiometria2021_Digitalizado;