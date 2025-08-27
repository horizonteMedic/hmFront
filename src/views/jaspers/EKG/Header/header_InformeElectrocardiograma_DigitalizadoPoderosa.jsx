import { formatearFechaLarga } from "../../../utils/formatDateUtils";

// === FOOTER FICHA RADIOGRAFÍA CABECERA ===
function footerFichaRadiografiaCabecera(doc, opts = {}, datos = {}) {
  const margin = 15;
  const logoW = 38;
  const y = 20;
  const xOffset = opts.xOffset;
  const fontSize = opts.fontSize;
  const yOffset = opts.yOffset;
  const baseX = margin + logoW + 8 - xOffset;
  let yFila = y + 2 + yOffset;
  const rowH = 3.2;
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 0, 0);
  const filas = [
    {
      direccion: datos?.dirTruPierola ?? "",
      celular: datos?.celTrujilloPie ?? "",
      email: datos?.emailTruPierola ?? "",
      telefono: datos?.telfTruPierola ?? "",
    },
    {
      direccion: datos?.dirHuamachuco ?? "",
      celular: datos?.celHuamachuco ?? "",
      email: datos?.emailHuamachuco ?? "",
      telefono: datos?.telfHuamachuco ?? "",
    },
    {
      direccion: datos?.dirHuancayo ?? "",
      celular: datos?.celHuancayo ?? "",
      email: datos?.emailHuancayo ?? "",
      telefono: datos?.telfHuancayo ?? "",
    },
  ];
  filas.forEach((fila) => {
    let x = baseX;
    if (fila.direccion) {
      const idx2 = fila.direccion.indexOf(":");
      if (idx2 !== -1) {
        const sedeNombre = fila.direccion.substring(0, idx2 + 1);
        const sedeResto = fila.direccion.substring(idx2 + 1);
        doc.setFont("helvetica", "bold");
        doc.text(sedeNombre, x, yFila, { baseline: "top" });
        x += doc.getTextWidth(sedeNombre) + 2;
        doc.setFont("helvetica", "normal");
        doc.text(sedeResto, x, yFila, { baseline: "top" });
        x += doc.getTextWidth(sedeResto) + 6;
      } else {
        doc.setFont("helvetica", "normal");
        doc.text(fila.direccion, x, yFila, { baseline: "top" });
        x += doc.getTextWidth(fila.direccion) + 6;
      }
    }
    if (fila.celular) {
      doc.setFont("helvetica", "bold");
      doc.text("Cel.", x, yFila, { baseline: "top" });
      x += doc.getTextWidth("Cel.");
      doc.setFont("helvetica", "normal");
      doc.text(` ${fila.celular}`, x, yFila, { baseline: "top" });
      x += doc.getTextWidth(` ${fila.celular}`) + 6;
    }
    if (fila.email) {
      doc.setFont("helvetica", "normal");
      doc.text(fila.email, x, yFila, { baseline: "top" });
      x += doc.getTextWidth(fila.email) + 6;
    }
    if (fila.telefono) {
      doc.setFont("helvetica", "bold");
      doc.text("Telf.", x, yFila, { baseline: "top" });
      x += doc.getTextWidth("Telf.");
      doc.setFont("helvetica", "normal");
      doc.text(` ${fila.telefono}`, x, yFila, { baseline: "top" });
    }
    yFila += rowH;
  });

  // Agregar website
  doc.setFont("helvetica", "normal").setFontSize(6);
  doc.text("Web : www.horizontemedic.com", baseX, yFila + 2);
}

const HeaderInformeElectrocardiogramaPoderosa = (doc, datos) => {
  // Datos de prueba por defecto
  const datosPrueba = {
    nombres: "HADY KATHERINE CASTILLO PLASENCIA",
    fecha: "28 enero 2025",
    edad: "31",
    sexo: "Femenino",
    dni: "72384273",
    empresa: "MINERA BOROO MISQUICHILCA S.A.",
    procedencia: "",
    presionArterial: "50/60 mmHg",
    antecedentesCardiologicos: "",
    sede: "Trujillo-Pierola",
    norden: "96639",
  };
  const textoSexo = datos?.sexo ?? "";

  const datosReales = {
    nombres: datos?.nombres ?? "",
    fecha: datos?.fechaInforme ?? "",
    edad: datos?.edad ?? "",
    sexo: textoSexo == "F" ? "Femenino" : textoSexo == "M" ? "Masculino" : "",

    dni: datos?.dni,
    empresa: datos?.empresa ?? "",
    procedencia: "",
    presionArterial: "",
    antecedentesCardiologicos: "",
    sede: datos?.sede ?? "",
    norden: datos?.norden ?? "",
  };

  // Combinar datos de prueba con datos reales
  const datosFinales =
    datos && Object.keys(datos).length > 0 ? datosReales : datosPrueba;

  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // === 1) LOGO A LA IZQUIERDA ===
  const logoW = 60;
  const logoH = 20;
  const logoY = y + 10;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, logoY, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, logoY + 8);
  }

  // === 2) FOOTER HORIZONTAL DE CABECERA (DATOS DE CONTACTO) ===
  footerFichaRadiografiaCabecera(
    doc,
    { xOffset: 30, fontSize: 6, yOffset: -13 },
    datos
  );

  // === 3) INFORMACIÓN DE SEDE, NÚMERO DE FICHA Y BLOQUE DE COLOR A LA DERECHA ===
  // Alinear al mismo nivel que el logo

  // Número de ficha y sede a la derecha
  const sedeValue = `${datosFinales.sede || ""}`;
  const sedeX = pageW - margin - 25; // A la derecha
  const sedeY = logoY + 8; // Bajar un poco más para alinear mejor con el logo

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

  const fechaTransformada = formatearFechaLarga(datos?.fechaInforme);
  doc.text(`Fecha : ${fechaTransformada}`, sedeX, sedeY2 + 5, {
    align: "right",
  });

  const colorValido =
    typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  if (colorValido) {
    // === 4) BLOQUE CÓDIGO DE COLOR A LA DERECHA ===
    // Siempre mostrar el bloque de color con datos de prueba
    const color = datosFinales.codigoColor || "#008f39";
    const boxText = (datosFinales.textoColor || "E").toUpperCase(); // Cambiado a "E" para EKG
    let boxSize = 15;
    let boxX = pageW - margin - boxSize;
    let boxY = sedeY - 5; // Subir 5 puntos arriba de la posición del número de orden

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
  // === 5) TÍTULO "INFORME : ELECTROCARDIOGRAMA" ===
  const tituloY = sedeY2 + 15; // Bajar el título para evitar superposiciones

  doc.setFont("helvetica", "normal").setFontSize(15);
  const examTitle = "INFORME DE ELECTROCARDIOGRAMA";
  const examTitleX = pageW / 2;
  doc.text(examTitle, examTitleX, tituloY, { align: "center" });

  // Subrayar el texto del informe
  const examWidth = doc.getTextWidth(examTitle);
  const examX = examTitleX - examWidth / 2;
  doc.setLineWidth(0.3);
  doc.line(examX, tituloY + 1, examX + examWidth, tituloY + 1);

  // === 6) TABLA DE DATOS DEL PACIENTE Y EMPRESA ===
  const tablaY = tituloY + 10; // Subir 7 puntos (era +20, ahora +13)
  const tableX = margin + 20;
  const tableY = tablaY;
  const tableW = pageW - 2 * (margin + 20);
  const tableH = 40; // Aumentar altura para acomodar 5 filas

  // Marco de la tabla
  doc.setLineWidth(0.5);
  doc.rect(tableX, tableY, tableW, tableH);

  // Líneas horizontales internas para separar las 5 filas
  doc.line(tableX, tableY + 8, tableX + tableW, tableY + 8); // Fila 1
  doc.line(tableX, tableY + 16, tableX + tableW, tableY + 16); // Fila 2
  doc.line(tableX, tableY + 24, tableX + tableW, tableY + 24); // Fila 3
  doc.line(tableX, tableY + 32, tableX + tableW, tableY + 32); // Fila 4

  // Líneas verticales para separar columnas
  // Para la fila 2: Apellidos y Nombres (80%) + DNI (20%)
  const col1W = tableW * 0.8; // Primera columna (80%) - Apellidos y Nombres

  // Para la fila 3: Procedencia (33.33%) + Edad (33.33%) + Sexo (33.33%)
  const col3W = tableW / 3; // Cada columna de la fila 3 tiene 33.33%

  // Línea vertical para la fila 2 (Apellidos y Nombres + DNI)
  doc.line(tableX + col1W, tableY + 8, tableX + col1W, tableY + 16);

  // Líneas verticales para la fila 3 (Procedencia + Edad + Sexo)
  doc.line(tableX + col3W, tableY + 16, tableX + col3W, tableY + 24);
  doc.line(tableX + col3W * 2, tableY + 16, tableX + col3W * 2, tableY + 24);

  // Contenido de la tabla
  doc.setFont("helvetica", "normal").setFontSize(8);

  // Primera fila - Empresa (1 celda)
  doc.text("Empresa :", tableX + 2, tableY + 5);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.empresa || "", tableX + 25, tableY + 5);

  // Segunda fila - Apellidos y Nombres + DNI (2 celdas)
  // Primera celda: Apellidos y Nombres
  doc.setFont("helvetica", "normal");
  doc.text("Apellidos y Nombres :", tableX + 2, tableY + 13);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.nombres || "", tableX + 35, tableY + 13);

  // Segunda celda: DNI
  doc.setFont("helvetica", "normal");
  doc.text("DNI :", tableX + col1W + 2, tableY + 13);
  doc.setFont("helvetica", "bold");
  doc.text(`${datosFinales.dni || ""}`, tableX + col1W + 15, tableY + 13);

  // Tercera fila - Procedencia + Edad + Sexo (3 celdas)
  doc.setFont("helvetica", "normal");
  doc.text("Procedencia :", tableX + 2, tableY + 21);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.procedencia || "", tableX + 25, tableY + 21);

  // Edad en la segunda columna de la tercera fila
  doc.setFont("helvetica", "normal");
  doc.text("Edad :", tableX + col3W + 2, tableY + 21);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.edad + " AÑOS" || "", tableX + col3W + 25, tableY + 21);

  // Sexo en la tercera columna de la tercera fila
  doc.setFont("helvetica", "normal");
  doc.text("Sexo :", tableX + col3W * 2 + 2, tableY + 21);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.sexo || "", tableX + col3W * 2 + 25, tableY + 21);

  // Cuarta fila - Antecedentes Cardiológicos (1 celda)
  doc.setFont("helvetica", "normal");
  doc.text("Antecedentes Cardiológicos :", tableX + 2, tableY + 29);
  doc.setFont("helvetica", "bold");
  doc.text(
    datosFinales.antecedentesCardiologicos || "",
    tableX + 25,
    tableY + 29
  );

  // Quinta fila - Presión Arterial (1 celda)
  doc.setFont("helvetica", "normal");
  doc.text("Presión Arterial :", tableX + 2, tableY + 37);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.presionArterial || "", tableX + 25, tableY + 37);

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default HeaderInformeElectrocardiogramaPoderosa;
