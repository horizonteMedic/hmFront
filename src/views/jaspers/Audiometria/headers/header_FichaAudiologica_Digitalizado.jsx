/**
 * Header maqueta para FICHA AUDIOLÓGICA (logo izq, título centrado, ficha/sede derecha)
 * Sólo muestra layout estático con espacios en blanco para valores
 * @param {jsPDF} doc - Instancia de jsPDF
 */
const header_FichaAudiologica_Maqueta = (doc, datos) => {
  const margin = 18;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // 1) Logo a la izquierda
  const logoW = 28,
    logoH = 13;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, y, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, y + 8);
  }

  // 2) BLOQUE "No Ficha" / "Sede" (ajustado a la derecha)
  const fichaBlockX = pageW - margin + 1;
  const fichaBlockY = y + 2;

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("No Ficha :", fichaBlockX - 30, fichaBlockY);
  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.text(`${datos.norden || ""}`, fichaBlockX + 6, fichaBlockY, {
    align: "right",
  });

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Sede     :", fichaBlockX - 30, fichaBlockY + 8);
  doc.text(`${datos.sede || ""}`, fichaBlockX + 6, fichaBlockY + 8, {
    align: "right",
  });

  // 3) TÍTULO perfectamente centrado
  doc.setFont("helvetica", "bold").setFontSize(13);
  const titulo = "FICHA AUDIOLÓGICA";
  const tituloY = y + 10;
  doc.text(titulo, pageW / 2, tituloY, { align: "center" });
  // subrayado
  const w = doc.getTextWidth(titulo);
  doc
    .setLineWidth(0.7)
    .line((pageW - w) / 2, tituloY + 2, (pageW + w) / 2, tituloY + 2)
    .setLineWidth(0.2);

  // 4) Layout de datos del paciente en filas (etiquetas + líneas en blanco)
  let datosY = y + 22;
  const labelW = 34;
  const sep = 3;
  const col2X = pageW / 2 - 10;
  const col3X = pageW - margin - 60;
  const rowH = 5.2;
  doc.setFont("helvetica", "bold").setFontSize(9);

  // Fila 1
  doc.text("Apellidos y Nombres :", margin, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.nombres || ""}`, margin + labelW + sep, datosY, {
    maxWidth: col2X - (margin + labelW + sep) - 2,
  });

  doc.setFont("helvetica", "bold");
  doc.text("Edad :", col2X, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.edad || ""}`, col2X + 19, datosY);

  doc.setFont("helvetica", "bold");
  doc.text("Fecha :", col3X, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.fechaCuestionario || ""}`, col3X + 19, datosY);

  // Fila 2
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  doc.text("DNI :", margin, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.dni || ""}`, margin + labelW + sep, datosY, {
    maxWidth: col2X - (margin + labelW + sep) - 2,
  });

  doc.setFont("helvetica", "bold");
  doc.text("Cargo :", col2X, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.cargo || ""}`, col2X + 19, datosY);

  doc.setFont("helvetica", "bold");
  doc.text("Sexo :", col3X, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${datos.sexo ? (datos.sexo == "M" ? "Masculino" : "Femenino") : ""}`,
    col3X + 19,
    datosY
  );

  // Fila 3
  datosY += rowH;
   doc.setFont("helvetica", "bold");
  doc.text("Empresa :", margin, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.empresa || ""}`, margin + labelW + sep, datosY, {
    maxWidth: col2X - (margin + labelW + sep) - 2,
  });

  doc.setFont("helvetica", "bold");
  doc.text("Contrata :", col2X, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.contrata || ""}`, col2X + 19, datosY);

  
 // Fila 5
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  doc.text("Ocupación :", margin, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.ocupacion || ""}`, margin + labelW + sep, datosY, {
    maxWidth: col2X - (margin + labelW + sep) - 2,
  });

  doc.setFont("helvetica", "bold");
  doc.text("Fecha Nacimiento :", col2X, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.fechaNac || ""}`, col2X + 19, datosY);
  

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default header_FichaAudiologica_Maqueta;
