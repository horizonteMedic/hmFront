/**
 * Header maqueta para FICHA AUDIOLÓGICA (logo izq, título centrado, ficha/sede derecha)
 * Sólo muestra layout estático con espacios en blanco para valores
 * @param {jsPDF} doc - Instancia de jsPDF
 */
const header_FichaAudiologica_Maqueta = (doc,datos) => {
  const margin = 8; // Igual que en CuestionarioAudiometria_Digitalizado.jsx
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12; // Vuelvo al valor original para mantener proporción con el nuevo margen

  // 1) Logo a la izquierda
  const logoW = 38, // Más ancho
    logoH = 13;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, y, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, y + 8);
  }

  // 2) TÍTULO centrado, SEDE a la derecha en la misma línea, N° de Ficha debajo de sede
  const titulo = "CUESTIONARIO AUDIOMETRÍA";
  const tituloY = y + 10;
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
  const sedeValue = `${datos.sede || ""}`;
  const sedeX = pageW - margin;
  const sedeY = y + 8;
  doc.text(sedeValue, sedeX, sedeY, { align: "right" });

  // N° de Ficha debajo de la sede, alineado a la derecha, label y dato juntos y alineados al margen derecho
  doc.setFont("helvetica", "normal").setFontSize(11);
  const fichaLabel = "N° de Ficha :";
  const fichaDato = `${datos.norden || ""}`;
  const fichaLabelW = doc.getTextWidth(fichaLabel);
  doc.setFont("helvetica", "bold").setFontSize(18);
  const fichaDatoW = doc.getTextWidth(fichaDato);
  const totalFichaW = fichaLabelW + 6 + fichaDatoW; // 6px de espacio entre label y dato
  const fichaY = sedeY + 8;
  const fichaX = pageW - margin - totalFichaW;
  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.text(fichaLabel, fichaX, fichaY);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(fichaDato, fichaX + fichaLabelW + 6, fichaY + 1);

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
