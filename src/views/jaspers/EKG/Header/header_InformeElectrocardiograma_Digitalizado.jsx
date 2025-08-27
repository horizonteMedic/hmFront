/**
 * Header maqueta para INFORME DE ELECTROCARDIOGRAMA
 * @param {jsPDF} doc - Instancia de jsPDF
 */

import { formatearFechaLarga } from "../../../utils/formatDateUtils";

const HeaderInformeElectrocardiograma = (doc, datos) => {
  const margin = 8;
  const leftMargin = margin + 25;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // Logo a la izquierda
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

  // Sección de datos del paciente
  const datosPacienteY = y + 35;

  // Título "EXAMEN" centrado
  doc.setFont("helvetica", "normal").setFontSize(15);
  const examTitle = "INFORME DE ELECTROCARDIOGRAMA";
  const examTitleX = pageW / 2;
  doc.text(examTitle, examTitleX, datosPacienteY + 5, { align: "center" });

  // Subrayar el texto del examen
  const examWidth = doc.getTextWidth(examTitle);
  const examX = examTitleX - examWidth / 2;
  doc.setLineWidth(0.3);
  doc.line(examX, datosPacienteY + 6, examX + examWidth, datosPacienteY + 6);

  // Datos del paciente en formato de tabla
  const pacienteData = [
    {
      label: "NOMBRES",
      value: (datos?.nombres || "").toUpperCase(),
      fullWidth: true,
    },
    { label: "EDAD", value: datos?.edad ? `${datos.edad} AÑOS` : "" },
    { label: "CONTRATA", value: datos?.contrata || "" },
    { label: "EMPRESA", value: datos?.empresa || "" },
  ];

  // Configuración de la tabla
  const tableStartX = leftMargin;
  const tableStartY = datosPacienteY + 20;
  const tableWidth = pageW - 2 * leftMargin;

  // Proporciones fijas para las columnas
  const labelColWidth = tableWidth * 0.25;
  const valueColWidth = tableWidth * 0.75;

  const baseRowHeight = 6; // Reducir altura base de las filas
  const borderWidth = 0.2;
  const padding = 2;

  // Dibujar tabla
  let currentY = tableStartY;

  pacienteData.forEach((item) => {
    const rowY = currentY;

    // Si es la fila de nombres (fullWidth), usar todo el ancho disponible
    if (item.fullWidth) {
      const maxValueWidth = tableWidth - padding * 2;

      // Calcular altura de fila basada en el contenido
      let rowHeight = baseRowHeight;
      let valueLines = [item.value];

      if (doc.getTextWidth(item.value) > maxValueWidth) {
        valueLines = doc.splitTextToSize(item.value, maxValueWidth);
        rowHeight = Math.max(baseRowHeight, valueLines.length * 3.5 + padding);
      }

      // Dibujar bordes de la fila completa
      doc.setDrawColor(0);
      doc.setLineWidth(borderWidth);

      // Línea horizontal superior
      doc.line(tableStartX, rowY, tableStartX + tableWidth, rowY);

      // Línea vertical entre columnas (separador NOMBRE | DATA)
      doc.line(
        tableStartX + tableWidth * 0.25,
        rowY,
        tableStartX + tableWidth * 0.25,
        rowY + rowHeight
      );

      // Línea horizontal inferior
      doc.line(
        tableStartX,
        rowY + rowHeight,
        tableStartX + tableWidth,
        rowY + rowHeight
      );

      // Línea vertical izquierda
      doc.line(tableStartX, rowY, tableStartX, rowY + rowHeight);

      // Línea vertical derecha
      doc.line(
        tableStartX + tableWidth,
        rowY,
        tableStartX + tableWidth,
        rowY + rowHeight
      );

      // Label en negrita (más pequeño para la fila completa)
      doc.setFont("helvetica", "bold").setFontSize(8);
      const labelX = tableStartX + padding;
      doc.text(item.label, labelX, rowY + padding, {
        align: "left",
        baseline: "top",
        maxWidth: tableWidth * 0.25 - padding * 2,
      });

      // Valor (usando el resto del ancho)
      doc.setFont("helvetica", "normal").setFontSize(8);
      const valueX = tableStartX + tableWidth * 0.25 + padding;

      // Para valores largos, dividir en múltiples líneas
      valueLines.forEach((line, lineIndex) => {
        doc.text(line, valueX, rowY + padding + lineIndex * 3.5, {
          align: "left",
          baseline: "top",
          maxWidth: tableWidth * 0.75 - padding * 2,
        });
      });

      currentY += rowHeight;
    } else {
      // Para las otras filas, mantener el comportamiento original
      const maxValueWidth = valueColWidth - padding * 2;

      // Calcular altura de fila basada en el contenido
      let rowHeight = baseRowHeight;
      let valueLines = [item.value];

      if (doc.getTextWidth(item.value) > maxValueWidth) {
        valueLines = doc.splitTextToSize(item.value, maxValueWidth);
        rowHeight = Math.max(baseRowHeight, valueLines.length * 3.5 + padding);
      }

      // Dibujar bordes de la fila
      doc.setDrawColor(0);
      doc.setLineWidth(borderWidth);

      // Línea horizontal superior
      doc.line(
        tableStartX,
        rowY,
        tableStartX + labelColWidth + valueColWidth,
        rowY
      );

      // Línea vertical entre columnas
      doc.line(
        tableStartX + labelColWidth,
        rowY,
        tableStartX + labelColWidth,
        rowY + rowHeight
      );

      // Línea horizontal inferior
      doc.line(
        tableStartX,
        rowY + rowHeight,
        tableStartX + labelColWidth + valueColWidth,
        rowY + rowHeight
      );

      // Línea vertical izquierda
      doc.line(tableStartX, rowY, tableStartX, rowY + rowHeight);

      // Línea vertical derecha
      doc.line(
        tableStartX + labelColWidth + valueColWidth,
        rowY,
        tableStartX + labelColWidth + valueColWidth,
        rowY + rowHeight
      );

      // Label en negrita
      doc.setFont("helvetica", "bold").setFontSize(9);
      const labelX = tableStartX + padding;
      doc.text(item.label, labelX, rowY + padding, {
        align: "left",
        baseline: "top",
        maxWidth: labelColWidth - padding * 2,
      });

      // Valor
      doc.setFont("helvetica", "normal").setFontSize(9);
      const valueX = tableStartX + labelColWidth + padding;

      // Para valores largos, dividir en múltiples líneas
      valueLines.forEach((line, lineIndex) => {
        doc.text(line, valueX, rowY + padding + lineIndex * 3.5, {
          align: "left",
          baseline: "top",
        });
      });

      // Actualizar posición Y para la siguiente fila
      currentY += rowHeight;
    }
  });

  // Resto del código (información de sede, número de ficha, bloque de color)...
  // 4) Información de sede y número de ficha pegada al costado del bloque de color
  const sedeValue = `${datos?.sede || ""}`;
  const sedeX = pageW - margin - 25;
  const sedeY = y + 6;

  // Número de ficha primero
  const fichaNum = `${datos?.norden || ""}`;
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

  // Fecha del informe
  const fechaInformeY = sedeY2 + 8;
  doc.setFont("helvetica", "normal").setFontSize(9);
  const fechaTransformada = formatearFechaLarga(datos?.fechaInforme);
  doc.text(
    `Fecha informe : ${fechaTransformada}`,
    sedeX,
    fechaInformeY,
    { align: "right" }
  );

  // === BLOQUE CÓDIGO DE COLOR ===
  // Mostrar el bloque de color usando el color de texto del dato
  const colorValido =
    typeof datos?.color === "number" && datos.color >= 1 && datos.color <= 50;
  if (colorValido) {
    const color = datos?.codigoColor || "#008f39";
    const boxText = (datos?.textoColor || "E").toUpperCase();
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
