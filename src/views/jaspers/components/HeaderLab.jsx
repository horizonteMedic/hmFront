const HeaderLab = (doc, datos) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const yOffset = 10;
  const lineHeight = 7;

  // Logo grande a la izquierda, bien separado
  const img = "./img/logo-color.png";
  doc.addImage(img, "PNG", margin, yOffset, 70, 28);

  // Número de ficha muy grande y en negrita arriba a la derecha
  let yNum = yOffset + 12;
  if (datos.numero) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    doc.setTextColor(0, 0, 0);
    doc.text(`${datos.numero}`, pageW - margin, yNum, { align: "right" });
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Sede: ${datos.nombre_sede || ''}`, pageW - margin, yNum + 10, { align: "right" });
    doc.setTextColor(0, 0, 0);
  }

  // Título centrado y fecha a la derecha en la misma línea
  const titleY = yOffset + 38;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("LABORATORIO CLÍNICO", pageW / 2, titleY, { align: "center" });
  // Fecha a la derecha, bien separada del título
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  const fechaLabel = "Fecha :";
  const fechaValue = `${datos.fecha_lab || ""}`;
  const fechaText = `${fechaLabel} ${fechaValue}`;
  const fechaWidth = doc.getTextWidth(fechaText);
  doc.text(fechaText, pageW - margin, titleY, { align: "right" });

  // Datos en dos columnas bien separadas debajo del título
  let yDatos = titleY + 12;
  doc.setFontSize(12);
  // Columna izquierda
  doc.setFont("helvetica", "bold");
  doc.text("Trabajador :", margin, yDatos);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.nombres || ""}`, margin + 45, yDatos);
  yDatos += lineHeight + 2;
  doc.setFont("helvetica", "bold");
  doc.text("Empresa Contratista :", margin, yDatos);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.razon_contrata || ""}`, margin + 70, yDatos);

  // Columna derecha
  let yDatosR = titleY + 12;
  const col2X = pageW / 2 + 30;
  doc.setFont("helvetica", "bold");
  doc.text("N° Ficha :", col2X, yDatosR);
  // Cuadro para N° Ficha
  doc.setDrawColor(0);
  doc.rect(col2X + 35, yDatosR - 5, 35, 10);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.n_orden || ""}`, col2X + 37, yDatosR + 2);
  yDatosR += lineHeight + 2;
  doc.setFont("helvetica", "bold");
  doc.text("Empresa :", col2X, yDatosR);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.razon_empresa || ""}`, col2X + 35, yDatosR);

  // Línea divisoria bajo el header, más abajo
  doc.setDrawColor(0);
  doc.setLineWidth(0.7);
  doc.line(margin, yDatosR + 10, pageW - margin, yDatosR + 10);

  // Devuelve la posición Y final para continuar el reporte
  return yDatosR + 12;
};

export default HeaderLab; 