/**
 * Header maqueta para FICHA AUDIOLÓGICA (logo izq, título centrado, ficha/sede derecha)
 * Sólo muestra layout estático con espacios en blanco para valores
 * @param {jsPDF} doc - Instancia de jsPDF
 */
const header_FichaAudiologica_Maqueta = (doc) => {
  const margin = 18;
  const pageW  = doc.internal.pageSize.getWidth();
  let   y      = 12;

  // 1) Logo a la izquierda
  const logoW = 28, logoH = 13;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, y, logoW, logoH);
  } catch {
    doc.setFont("helvetica", "normal")
       .setFontSize(9)
       .text("Policlinico Horizonte Medic", margin, y + 8);
  }

  // 2) BLOQUE "No Ficha" / "Sede" (ajustado a la derecha)
  const fichaBlockX = pageW - margin + 1;
  const fichaBlockY = y + 2;

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("No Ficha :", fichaBlockX - 30, fichaBlockY);
  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.text("__________", fichaBlockX + 6, fichaBlockY, { align: "right" });

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Sede     :", fichaBlockX - 30, fichaBlockY + 8);
  doc.text("______________", fichaBlockX + 6, fichaBlockY + 8, { align: "right" });

  // 3) TÍTULO perfectamente centrado
  doc.setFont("helvetica", "bold").setFontSize(13);
  const titulo  = "FICHA AUDIOLÓGICA";
  const tituloY = y + 10;
  doc.text(titulo, pageW / 2, tituloY, { align: "center" });
  // subrayado
  const w = doc.getTextWidth(titulo);
  doc.setLineWidth(0.7)
     .line((pageW - w) / 2, tituloY + 2, (pageW + w) / 2, tituloY + 2)
     .setLineWidth(0.2);

  // 4) Layout de datos del paciente en filas (etiquetas + líneas en blanco)
  let datosY = y + 22;
  const labelW = 34;
  const sep    = 3;
  const col2X  = pageW / 2 - 10;
  const col3X  = pageW - margin - 60;
  const rowH   = 5.2;
  doc.setFont("helvetica", "bold").setFontSize(9);

  // Fila 1
  doc.text("Apellidos y Nombres :", margin, datosY);
  doc.setFont("helvetica", "normal");
  doc.text("__________________________", margin + labelW + sep, datosY, {
    maxWidth: col2X - (margin + labelW + sep) - 2
  });

  doc.setFont("helvetica", "bold");
  doc.text("Edad :", col2X, datosY);
  doc.setFont("helvetica", "normal");
  doc.text("____", col2X + 19, datosY);

  doc.setFont("helvetica", "bold");
  doc.text("Fecha :", col3X, datosY);
  doc.setFont("helvetica", "normal");
  doc.text("__________", col3X + 19, datosY);

  // Fila 2
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  doc.text("DNI :", margin, datosY);
  doc.setFont("helvetica", "normal");
  doc.text("__________", margin + labelW + sep, datosY, {
    maxWidth: col2X - (margin + labelW + sep) - 2
  });

  doc.setFont("helvetica", "bold");
  doc.text("Cargo :", col2X, datosY);
  doc.setFont("helvetica", "normal");
  doc.text("________________", col2X + 19, datosY);

  doc.setFont("helvetica", "bold");
  doc.text("Sexo :", col3X, datosY);
  doc.setFont("helvetica", "normal");
  doc.text("__", col3X + 19, datosY);

  // Fila 3
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  doc.text("Área de Trabajo :", margin, datosY);
  doc.setFont("helvetica", "normal");
  doc.text("__________________________", margin + labelW + sep, datosY, {
    maxWidth: col2X - (margin + labelW + sep) - 2
  });

  doc.setFont("helvetica", "bold");
  doc.text("Contrata :", col2X, datosY);
  doc.setFont("helvetica", "normal");
  doc.text("________________", col2X + 19, datosY);

  // Fila 4
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  doc.text("Empresa :", margin, datosY);
  doc.setFont("helvetica", "normal");
  doc.text("__________________________", margin + labelW + sep, datosY, {
    maxWidth: col2X - (margin + labelW + sep) - 2
  });

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default header_FichaAudiologica_Maqueta;
