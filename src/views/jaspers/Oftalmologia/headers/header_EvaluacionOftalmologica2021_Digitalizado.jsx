/**
 * Header para Evaluación Oftalmológica 2021 Digitalizado
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - Datos del paciente y ficha
 */
function footerFichaOftalmoCabecera(doc, datos = {}) {
  const pageW = doc.internal.pageSize.getWidth();
  const y = 12;
  const fontSize = 6;
  const yOffset = + 260;
  const totalFooterW = 140;
  const baseX = (pageW - totalFooterW) / 2 + 10;
  let yFila = y + 2 + yOffset;
  const rowH = 3.2;
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 0, 0);
  const filas = [
    {
      direccion: datos?.dirTruPierola || "",
      celular: datos?.celTrujilloPie || "",
      email: datos?.emailTruPierola || "",
      telefono: datos?.telfTruPierola || "",
    },
    {
      direccion: datos?.dirHuamachuco || "",
      celular: datos?.celHuamachuco || "",
      email: datos?.emailHuamachuco || "",
      telefono: datos?.telfHuamachuco || "",
    },
    {
      direccion: datos?.dirHuancayo || "",
      celular: datos?.celHuancayo || "",
      email: datos?.emailHuancayo || "",
      telefono: datos?.telfHuancayo || "",
    },
  ];
  filas.forEach((fila) => {
    let x = baseX;
    if (fila.direccion) {
      doc.setFont("helvetica", "normal");
      doc.text(fila.direccion, x, yFila, { baseline: "top" });
      x += doc.getTextWidth(fila.direccion) + 6;
    }
    if (fila.celular) {
      doc.setFont("helvetica", "bold");
      doc.text("Cel.", x, yFila, { baseline: "top" });
      x += doc.getTextWidth("Cel.");
      doc.setFont("helvetica", "normal");
      doc.text(` ${fila.celular}`, x, yFila, { baseline: "top" });
      x += doc.getTextWidth(` ${fila.celular}`) + 6;
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
}

const header_EvaluacionOftalmologica2021_Digitalizado = (doc, datos = {}) => {
  footerFichaOftalmoCabecera(doc, datos);
  const margin = 18;
  const pageW = doc.internal.pageSize.getWidth();
  const usableW = pageW - 2 * margin;
  let y = 12;

  // 1) Logo a la izquierda
  const logoW = 35,
    logoH = 15;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, y - 4, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, y + 8);
  }
  // === NUEVO: Usar imagen de fondo para la cabecera de audiometría 2021 ===
  const fondoImg =
    "/img/header_EvaluacionOftalmologica2021_Digitalizado_boro.png";
  const fondoH = 25; // altura aproximada de la cabecera en mm (ajusta si es necesario)
  let yHeader = 30;
  try {
    doc.addImage(fondoImg, "PNG", margin, yHeader, usableW, fondoH);
  } catch (e) {
    doc.text("Imagen de cabecera no disponible", margin, yHeader + 10);
  }

  // === BLOQUE CÓDIGO DE COLOR ===
  const colorValido =
    typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  const color = datos.codigoColor || "#008f39";
  const boxText = (datos.textoColor || "F").toUpperCase();
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y - 6.5;
  if (colorValido) {
    // Forzar a mostrar para prueba visual
    // Draw box outline in black
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
    // Solo renderiza si color es válido o para prueba
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
  y -= 7;
  // 2) Número de ficha arriba y sede debajo, alineados a la derecha
  const fichaX = pageW - margin - 18;
  const bloqueY = y + 5; // subir el bloque 3 puntos más arriba

  // Número de orden arriba
  const fichaValue = String(datos.norden || "");

  // Calcular el ancho del label "N° Ficha:" para posicionarlo correctamente
  doc.setFont("helvetica", "bold").setFontSize(9);
  const fichaLabelWidth = doc.getTextWidth("N° Ficha:");
  const fichaLabelX = fichaX - fichaLabelWidth - 25; // 25 unidades de separación hacia la izquierda

  // Agregar label "N° Ficha:" antes del valor
  doc.text("N° Ficha:", fichaLabelX, bloqueY, { align: "left" });
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(fichaValue, fichaX, bloqueY, { align: "right" });

  // Sede debajo
  const sedeValue = String(datos.sede || "");

  // Calcular el ancho del label "Sede:" para posicionarlo correctamente
  doc.setFont("helvetica", "bold").setFontSize(9);
  const sedeLabelWidth = doc.getTextWidth("Sede:");
  const sedeLabelX = fichaX - sedeLabelWidth - 48; // 25 unidades de separación hacia la izquierda

  // Agregar label "Sede:" antes del valor
  doc.text("Sede:", sedeLabelX, bloqueY + 10, { align: "left" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(sedeValue, fichaX, bloqueY + 10, { align: "right" });

  // 3) TÍTULO perfectamente centrado
  doc.setFont("helvetica", "bold").setFontSize(13);
  const titulo = "FICHA DE EVALUACIÓN OFTALMOLÓGICA";
  const tituloY = y + 10;
  doc.text(titulo, pageW / 2, tituloY, { align: "center" });
  // subrayado
  const w = doc.getTextWidth(titulo);
  doc
    .setLineWidth(0.7)
    .line((pageW - w) / 2, tituloY + 2, (pageW + w) / 2, tituloY + 2)
    .setLineWidth(0.2);

  // === NUEVO: Datos del paciente con posicionamiento libre ===
  doc.setFont("helvetica", "normal").setFontSize(8);

  // Apellidos y Nombres
  const xNombres = margin + 30;
  const yNombres = margin + 15;
  doc.text(
    `${datos.nombre || ""} ${datos.apellido || ""}`,
    xNombres,
    yNombres,
    { maxWidth: 85 }
  );

  // Fecha
  const xFecha = margin + 140;
  const yFecha = margin + 15;
  let fechaStr = String(datos.fechaOf || "");
  // Formatear fecha yyyy-mm-dd a dd/mm/yyyy
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    const [y, m, d] = fechaStr.split("-");
    fechaStr = `${d}/${m}/${y}`;
  }
  doc.text(fechaStr, xFecha, yFecha);

  // DNI
  //SEGUNDA=================================================
  const ysegundaFila = margin + 21;
  const yterceraFila = margin + 27;
  const ycuartaFila = margin + 33;
  const xDni = margin + 30;
  doc.text(String(datos.dni || ""), xDni, ysegundaFila);

  // Edad
  const xEdad = margin + 95;
  doc.text(String(datos.edad || ""), xEdad, ysegundaFila);

  // Sexo - Marcar "X" según el valor
  const xSexoM = margin + 150.2; // Posición para Masculino
  const xSexoF = margin + 168.2; // Posición para Femenino

  const sexo = String(datos.sexo || "")
    .toUpperCase()
    .trim();
  if (sexo === "M") {
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("X", xSexoM, ysegundaFila);
  } else if (sexo === "F") {
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("X", xSexoF, ysegundaFila);
  }
  doc.setFont("helvetica", "normal").setFontSize(8);

  //TERCERA=================================================
  // Área de Trabajo

  const xAreaTrabajo = margin + 30;
  doc.text(String(datos.areaO || ""), xAreaTrabajo, yterceraFila, {
    maxWidth: 60,
  });

  // Cargo
  const xCargo = margin + 104;
  doc.text(String(datos.ocupacion || ""), xCargo, yterceraFila, {
    maxWidth: 50,
  });

  //CUARTA=================================================

  // Empresa
  const xEmpresa = margin + 30;
  doc.text(String(datos.empresa || ""), xEmpresa, ycuartaFila, {
    maxWidth: 70,
  });

  // Contrata
  const xContrata = margin + 119;
  doc.text(String(datos.contrata || ""), xContrata, ycuartaFila, {
    maxWidth: 50,
  });

  // restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default header_EvaluacionOftalmologica2021_Digitalizado;
