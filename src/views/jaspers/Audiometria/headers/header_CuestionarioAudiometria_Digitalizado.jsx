/**
 * Header maqueta para FICHA AUDIOLÓGICA (logo izq, título centrado, ficha/sede derecha)
 * Sólo muestra layout estático con espacios en blanco para valores
 * @param {jsPDF} doc - Instancia de jsPDF
 */
const header_FichaAudiologica_Maqueta = (doc,datos) => {
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
  doc.setFont("helvetica", "bold");
  const label1 = "Apellidos y Nombres:";
  doc.text(label1, margin, datosY);
  const label1W = doc.getTextWidth(label1);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.nombres || ""}`, margin + label1W, datosY, {
    maxWidth: col2X - (margin + label1W) - 2,
  });

  doc.setFont("helvetica", "bold");
  const label2 = "Edad:";
  doc.text(label2, col2X, datosY);
  const label2W = doc.getTextWidth(label2);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.edad || ""}`, col2X + label2W, datosY);

  doc.setFont("helvetica", "bold");
  const label3 = "Fecha:";
  doc.text(label3, col3X, datosY);
  const label3W = doc.getTextWidth(label3);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.fechaCuestionario || ""}`, col3X + label3W, datosY);

  // Fila 2
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  const label4 = "DNI:";
  doc.text(label4, margin, datosY);
  const label4W = doc.getTextWidth(label4);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.dni || ""}`, margin + label4W, datosY, {
    maxWidth: col2X - (margin + label4W) - 2,
  });

  doc.setFont("helvetica", "bold");
  const label5 = "Cargo:";
  doc.text(label5, col2X, datosY);
  const label5W = doc.getTextWidth(label5);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.cargo || ""}`, col2X + label5W, datosY);

  doc.setFont("helvetica", "bold");
  const label6 = "Sexo:";
  doc.text(label6, col3X, datosY);
  const label6W = doc.getTextWidth(label6);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${datos.sexo ? (datos.sexo == "M" ? "Masculino" : "Femenino") : ""}`,
    col3X + label6W,
    datosY
  );

  // Fila 3
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  const label7 = "Empresa:";
  doc.text(label7, margin, datosY);
  const label7W = doc.getTextWidth(label7);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.empresa || ""}`, margin + label7W, datosY, {
    maxWidth: col2X - (margin + label7W) - 2,
  });

  doc.setFont("helvetica", "bold");
  const label8 = "Contrata:";
  doc.text(label8, col2X, datosY);
  const label8W = doc.getTextWidth(label8);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.contrata || ""}`, col2X + label8W, datosY);

  // Fila 5
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  const label9 = "Ocupación:";
  doc.text(label9, margin, datosY);
  const label9W = doc.getTextWidth(label9);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.ocupacion || ""}`, margin + label9W, datosY, {
    maxWidth: col2X - (margin + label9W) - 2,
  });

  doc.setFont("helvetica", "bold");
  const label10 = "Fecha Nacimiento:";
  doc.text(label10, col2X, datosY);
  const label10W = doc.getTextWidth(label10);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.fechaNac || ""}`, col2X + label10W, datosY);
  

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default header_FichaAudiologica_Maqueta;
