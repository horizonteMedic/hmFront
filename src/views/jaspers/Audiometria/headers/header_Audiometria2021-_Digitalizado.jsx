/**
 * Header para FICHA DE EVALUACIÓN AUDIOMETRÍA (logo izq, título centrado, ficha/sede derecha)
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - Datos del paciente y ficha
 */
const header_Audiometria2021_Digitalizado = (doc, datos = {}) => {
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
  const fichaLabel   = "No Ficha :";
  const fichaValue   = String(datos.nroficha || "95877");
  const sedeLabel    = "Sede     :";
  const sedeValue    = String(datos.sede     || "Trujillo-Pierola");

  // No Ficha
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(fichaLabel, fichaBlockX - 30, fichaBlockY);
  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.text(fichaValue, fichaBlockX + 6, fichaBlockY, { align: "right" });

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(sedeLabel, fichaBlockX - 30, fichaBlockY + 8);
  doc.setFont("helvetica", "normal").setFontSize(8.5);
  doc.text(sedeValue, fichaBlockX + 6, fichaBlockY + 8, { align: "right" });

  // 3) TÍTULO perfectamente centrado
  doc.setFont("helvetica", "bold").setFontSize(13);
  const titulo  = "FICHA DE EVALUACIÓN AUDIOMETRÍA";
  const tituloY = y + 10;
  doc.text(titulo, pageW / 2, tituloY, { align: "center" });
  // subrayado
  const w = doc.getTextWidth(titulo);
  doc.setLineWidth(0.7)
     .line((pageW - w) / 2, tituloY + 2, (pageW + w) / 2, tituloY + 2)
     .setLineWidth(0.2);

  // 4) Datos del paciente en filas
  let datosY = y + 22;
  const labelW = 34;
  const sep    = 3;
  const col2X  = pageW / 2 - 10;
  const col3X  = pageW - margin - 60;
  const rowH   = 5.2;
  doc.setFontSize(9);

  // Fila 1: Apellidos y Nombres | Edad | Fecha
  doc.setFont("helvetica", "bold");
  doc.text("Apellidos y Nombres", margin, datosY);
  doc.text(":", margin + labelW, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.nombres || ""), margin + labelW + sep, datosY, {
    maxWidth: col2X - (margin + labelW + sep) - 2
  });

  doc.setFont("helvetica", "bold");
  doc.text("Edad", col2X, datosY);
  doc.text(":", col2X + 15, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.edad || ""), col2X + 19, datosY);

  doc.setFont("helvetica", "bold");
  doc.text("Fecha", col3X, datosY);
  doc.text(":", col3X + 15, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.fecha || ""), col3X + 19, datosY);

  // Fila 2: DNI | Cargo | Sexo
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  doc.text("DNI", margin, datosY);
  doc.text(":", margin + labelW, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.dni || ""), margin + labelW + sep, datosY, {
    maxWidth: col2X - (margin + labelW + sep) - 2
  });

  doc.setFont("helvetica", "bold");
  doc.text("Cargo", col2X, datosY);
  doc.text(":", col2X + 15, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.cargo || ""), col2X + 19, datosY);

  doc.setFont("helvetica", "bold");
  doc.text("Sexo", col3X, datosY);
  doc.text(":", col3X + 15, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.sexo || ""), col3X + 19, datosY);

  // Fila 3: Área de Trabajo | Contrata
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  doc.text("Área de Trabajo", margin, datosY);
  doc.text(":", margin + labelW, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.areaTrabajo || ""), margin + labelW + sep, datosY, {
    maxWidth: col2X - (margin + labelW + sep) - 2
  });

  doc.setFont("helvetica", "bold");
  doc.text("Contrata", col2X, datosY);
  doc.text(":", col2X + 15, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.contrata || ""), col2X + 19, datosY);

  // Fila 4: Empresa
  datosY += rowH;
  doc.setFont("helvetica", "bold");
  doc.text("Empresa", margin, datosY);
  doc.text(":", margin + labelW, datosY);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.empresa || ""), margin + labelW + sep, datosY, {
    maxWidth: col2X - (margin + labelW + sep) - 2
  });

  // restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default header_Audiometria2021_Digitalizado;
