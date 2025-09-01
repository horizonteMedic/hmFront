/**
 * Header maqueta para FICHA ODONTOGRAFICA DE PERSONAL - REPORTE POR FECHAS
 * @param {jsPDF} doc - Instancia de jsPDF
 */
const obtenerFechaActualFormateada = () => {
  const hoy = new Date();

  const opciones = {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("es-ES", opciones).format(hoy);
};

// === FOOTER FICHA ODONTOLÓGICA CABECERA ===

function footerFichaOdontologicaCabecera(doc, opts = {}, datos = {}) {
  const margin = 8;
  const logoW = 38;
  const y = 12;
  const xOffset = opts.xOffset !== undefined ? opts.xOffset : 25;
  const fontSize = opts.fontSize !== undefined ? opts.fontSize : 6;
  const yOffset = opts.yOffset !== undefined ? opts.yOffset : -8;
  const baseX = margin + logoW + 8 - xOffset;
  let yFila = y + 2 + yOffset;
  const rowH = 3.2;
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 0, 0);
  const filas = [
    {
      direccion:
        datos?.dirTruPierola ||
        "",
      celular: datos?.celTrujilloPie || "",
      email: datos?.emailTruPierola || "",
      telefono:
        datos?.telfTruPierola ||
        "",
    },
    {
      direccion:
        datos?.dirHuamachuco || "",
      celular: datos?.celHuamachuco || "",
      email: datos?.emailHuamachuco || "",
      telefono: datos?.telfHuamachuco || "",
    },
    {
      direccion:
        datos?.dirHuancayo ||
        "",
      celular: datos?.celHuancayo || "",
      email: datos?.emailHuancayo || "",
      telefono: datos?.telfHuancayo || "",
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

const header_OdontogramaFechas = (doc, datos) => {
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // 1) Logo a la izquierda
  const logoW = 45,
    logoH = 15;
  const logoY = y + 10; // Bajado de y - 1 a y + 3
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, logoY, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, logoY + 8);
  }

  // Footer horizontal de cabecera (datos de contacto)
  footerFichaOdontologicaCabecera(
    doc,
    { xOffset: 25, fontSize: 6, yOffset: -8 },
    datos
  );

  // 2) TÍTULO centrado - FICHA ODONTOGRAFICA DE PERSONAL
  const titulo1 = "FICHA ODONTOGRAFICA DE PERSONAL";
  const titulo2 = "REPORTE POR FECHAS";
  const tituloY = y + 20; // Bajado de 12 a 20
  doc.setFont("helvetica", "bold").setFontSize(13);
  doc.text(titulo1, pageW / 2, tituloY, { align: "center" });
  doc.text(titulo2, pageW / 2, tituloY + 6, { align: "center" });

  // 3) Información de sede y número de ficha a la derecha (al costado del bloque de color)
  const sedeValue = `${datos.sede || "Trujillo-Pierola"}`;
  const sedeX = pageW - margin - 20;
  const sedeY = y + 6;

  // Número de ficha primero
  const fichaNum = datos.norden || "";
  const fichaY = sedeY;

  // Texto "N° Ficha :" delante del número
  // const fichaLabelX = sedeX - 40;
  // doc.setFont("helvetica", "normal").setFontSize(9);
  // doc.text("N° Ficha :", fichaLabelX, fichaY);

  // Número de ficha grande y subrayado
  // const fichaNumX = fichaLabelX + doc.getTextWidth("N° Ficha :") + 5;
  // doc.setFont("helvetica", "bold").setFontSize(22);
  // doc.text(fichaNum, fichaNumX, fichaY);

  // // Subrayar el número de ficha
  // const fichaWidth = doc.getTextWidth(fichaNum);
  // doc.setLineWidth(0.3);
  // doc.line(fichaNumX, fichaY + 1, fichaNumX + fichaWidth, fichaY + 1);

  // Sede debajo del número de ficha
  const sedeY2 = sedeY + 8;
  doc.setFont("helvetica", "normal").setFontSize(9);

  doc.text(`Sede : ${sedeValue}`, sedeX, sedeY2, { align: "right" });

  // === BLOQUE CÓDIGO DE COLOR ===
  const colorValido =
    typeof datos.color === "number" && datos.color >= 1 && datos.color <= 150;
  if (colorValido) {
    const color = datos.codigoColor || "#008f39";
    const boxText = (datos.textoColor || "F").toUpperCase();
    let boxSize = 15;
    let boxX = pageW - margin - boxSize;
    let boxY = y + 2;

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
  const formatear = (datoo) => {
    let fecha = datoo || "";
    if (fecha && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      // yyyy-mm-dd => dd/mm/yyyy
      const [a, m, d] = fecha.split("-");
      fecha = `${d}/${m}/${a}`;
    }
    return fecha;
  };

  // 4) Rango de fechas centrado en la parte inferior
  const desdeFecha = formatear(datos.desdeFecha);
  const hastaFecha = formatear(datos.hastaFecha);
  const fechaRangoY = y + 35; // Bajado de 25 a 35

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(
    `Desde : ${desdeFecha} Hasta : ${hastaFecha}`,
    pageW / 2,
    fechaRangoY,
    { align: "center" }
  );

  doc.text(
    `Fecha Impresión Reporte ${obtenerFechaActualFormateada()}`,
    pageW / 2 + 38,
    fechaRangoY,
    { maxWidth: 50 }
  );

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default header_OdontogramaFechas;
