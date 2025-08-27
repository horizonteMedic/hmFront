/**
 * Header maqueta para INFORME DE ELECTROCARDIOGRAMA
 * @param {jsPDF} doc - Instancia de jsPDF
 */

const HeaderInformeElectrocardiograma = (doc, datos) => {
  // Datos de prueba por defecto
  const datosPrueba = {
    nombres: "JUAN CARLOS",
    apellidos: "PEREZ GONZALEZ",
    fecha: "15/12/2024",
    edad: "35",
    sede: "SE TRUJILLO NICOLAS PIEROLA PIEROLA PIEROLA",
    norden: "990909",
    color: 1,
    codigoColor: "#008f39",
    textoColor: "E",
  };
  const datosReales = {
    // apellidosNombres: datos?.nombres ?? "",
    // dni: datos?.dni ?? "",
    // empresa: datos?.empresa ?? "",
    // contrata: datos?.contrata ?? "",
    // fecha: datos?.fechaExamen ?? "",
    // edad: datos?.edad ?? "",
    // areaTrabajo: datos?.areaTrabajo ?? "",
    // sexo: datos?.sexo ?? "",
    // sede: datos?.informacionSede?.sede ?? "",
    // color: datos?.informacionSede?.color ?? "",
    // codigoColor: datos?.informacionSede?.codigoColor.trim() ?? "",
    // textoColor: datos?.informacionSede?.textoColor.trim() ?? "",
    // norden: datos?.norden ?? "",
    nombres: "JUAN CARLOS",
    apellidos: "PEREZ GONZALEZ",
    fecha: "15/12/2024",
    edad: "35",
    sede: "SE TRUJILLO NICOLAS PIEROLA PIEROLA PIEROLA",
    norden: "990909",
    color: 1,
    codigoColor: "#008f39",
    textoColor: "E",
  };

  // Combinar datos de prueba con datos reales
  const datosFinales =
    datos && Object.keys(datos).length > 0 ? datosReales : datosPrueba;

  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // 1) Logo a la izquierda
  const logoW = 60,
    logoH = 20;
  const logoY = y + 10;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, logoY, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, logoY + 8);
  }

  // 3) Sección de datos del paciente
  const datosPacienteY = y + 35;

  // Título "EXAMEN" centrado y con fuente más grande
  doc.setFont("helvetica", "normal").setFontSize(15);
  const examTitle = "INFORME DE ELECTROCARDIOGRAMA";
  const examTitleX = pageW / 2;
  doc.text(examTitle, examTitleX, datosPacienteY + 5, { align: "center" });

  // Subrayar el texto del examen - LÍNEA ARRIBA DEL TEXTO
  const examWidth = doc.getTextWidth(examTitle);
  const examX = examTitleX - examWidth / 2;
  doc.setLineWidth(0.3);
  doc.line(examX, datosPacienteY + 6, examX + examWidth, datosPacienteY + 6);

  // Datos del paciente - formato alineado como parámetros EKG
  const pacienteData = [
    { label: "NOMBRES", value: (datosFinales.nombres || "").toUpperCase() },
    { label: "APELLIDOS", value: (datosFinales.apellidos || "").toUpperCase() },
    {
      label: "FECHA",
      value: datosFinales.fecha || datosFinales.fechaExamen || "",
    },
    {
      label: "EDAD",
      value: datosFinales.edad ? `${datosFinales.edad} AÑOS` : "",
    },
  ];

  // Usar el mismo formato que los parámetros EKG
  const colLabelX = margin + 25;
  const colPuntosX = colLabelX + 35; // columna fija para los ':'
  const colValueX = colLabelX + 45; // columna fija para los valores

  let pacienteY = datosPacienteY + 20; // Ajustar posición después del título centrado

  pacienteData.forEach((item) => {
    // Label en negrita
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(item.label, colLabelX, pacienteY, { baseline: "top" });

    // Dos puntos
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(":", colPuntosX, pacienteY, { baseline: "top" });

    // Valor
    doc.text(item.value, colValueX, pacienteY, { baseline: "top" });

    pacienteY += 4; // Espaciado igual que los parámetros EKG
  });

  // 4) Información de sede y número de ficha pegada al costado del bloque de color
  const sedeValue = `${datosFinales.sede || ""}`;
  const sedeX = pageW - margin - 25; // Mover más cerca del bloque de color
  const sedeY = y + 6;

  // Número de ficha primero
  const fichaNum = `${datosFinales.norden || ""}`;
  const fichaY = sedeY;

  // Texto "N° Ficha :" delante del número
  const fichaLabelX = sedeX - 40;
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
  const sedeY2 = sedeY + 8;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(`Sede : ${sedeValue}`, sedeX, sedeY2, { align: "right" });

  // === BLOQUE CÓDIGO DE COLOR ===
  // Siempre mostrar el bloque de color con datos de prueba
  const colorValido =
    typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  if (colorValido) {
    const color = datosFinales.codigoColor || "#008f39";
    const boxText = (datosFinales.textoColor || "E").toUpperCase(); // Cambiado a "E" para EKG
    let boxSize = 15;
    let boxX = pageW - margin - boxSize;
    let boxY = y + 2;

    // Draw box outline in black
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);

    // Solo renderiza si color es válido
    doc.setDrawColor(color);
    doc.setLineWidth(2);
    doc.setLineCap("round");
    doc.line(boxX + boxSize + 3, boxY, boxX + boxSize + 3, boxY + boxSize);
    doc.setLineCap("butt");
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color);
    doc.text(boxText, boxX + boxSize / 2, boxY + boxSize / 2, {
      align: "center",
      baseline: "middle",
      maxWidth: boxSize - 1,
    });
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2);
  }

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default HeaderInformeElectrocardiograma;
