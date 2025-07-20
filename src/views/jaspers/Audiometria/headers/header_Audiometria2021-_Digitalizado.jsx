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
  const logoW = 28,
    logoH = 13;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, y - 4, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, y + 8);
  }
  y -= 7;
  // 2) BLOQUE "No Ficha" / "Sede" (ajustado a la derecha)
  const fichaBlockX = pageW - margin + 1;
  const fichaBlockY = y + 2;
  const fichaLabel = "No Ficha :";
  const fichaValue = String(datos.norden || "");
  const sedeLabel = "Sede     :";
  const sedeValue = String(datos.sede || "");

  // No Ficha
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(fichaLabel, fichaBlockX - 30, fichaBlockY+4);
  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.text(fichaValue, fichaBlockX + 6, fichaBlockY+4, { align: "right" });

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(9);
  // doc.text(sedeLabel, fichaBlockX - 30, fichaBlockY + 8);
  doc.setFont("helvetica", "normal").setFontSize(8.5);
  doc.text(sedeValue, fichaBlockX + 6, fichaBlockY + 8, { align: "right" });

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
  doc.text(String(datos.fechaAu || ""), fechaX + 19, datosY);

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
