// Header para Ficha Audiológica: logo izquierda, número ficha grande derecha, sede debajo
/**
 * Dibuja el header de la ficha audiológica: logo izquierda, número ficha grande derecha, sede debajo
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - { norden: string|number, sede: string }
 */
const header_FichaAudiologica = (doc, datos = {}) => {
  const margin = 18;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // Logo izquierda
  const logoW = 37,
    logoH = 15; // Más pequeño y ancho
  const logoY = y + 10; // bajar un poco el logo
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, logoY, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "bold")
      .setFontSize(12)
      .text("HORIZONTE MEDIC", margin, logoY + 10);
  }
  // Llamar al footer horizontal de cabecera (datos de contacto) con tamaño más pequeño y más a la izquierda
  footerFichaAudiologicaCabecera(
    doc,
    { xOffset: 40, fontSize: 6, yOffset: -8 },
    datos
  );
  // === BLOQUE CÓDIGO DE COLOR ===
  // Prueba: si no hay datos.color, usar uno de ejemplo
  const colorValido =
    typeof datos.color === "number" && datos.color >= 1 && datos.color <= 500;
  const color = datos.codigoColor || "#008f39";
  const boxText = (datos.textoColor || "F").toUpperCase();
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y + 2;
  if (colorValido ) {
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

  // Sede arriba
  const sedeX = pageW - margin - 17; // más a la izquierda
  const sedeY = y + 8;
  
  // Calcular el ancho del label "Sede:" para posicionarlo correctamente
  doc.setFont("helvetica", "bold").setFontSize(9);
  const sedeLabelWidth = doc.getTextWidth("Sede:");
  const sedeLabelX = sedeX - sedeLabelWidth - 50; // 25 unidades de separación hacia la izquierda
  
  // Agregar label "Sede:" antes del valor
  doc.text("Sede:", sedeLabelX, sedeY, { align: "left" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`${datos.sede || ""}`, sedeX, sedeY, { align: "right" });
  
  // Número de ficha grande, negrita, subrayado, abajo
  const fichaX = sedeX; // misma posición X
  const fichaY = sedeY + 6;
  
  // Calcular el ancho del label "N° Ficha:" para posicionarlo correctamente
  doc.setFont("helvetica", "bold").setFontSize(9);
  const fichaLabelWidth = doc.getTextWidth("N° Ficha:");
  const fichaLabelX = fichaX - fichaLabelWidth - 25; // 25 unidades de separación hacia la izquierda
  
  // Agregar label "N° Ficha:" antes del valor
  doc.text("N° Ficha:", fichaLabelX, fichaY, { align: "left" });
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(`${datos.norden || ""}`, fichaX, fichaY, { align: "right" });
  
  // Subrayado
  const fichaWidth = doc.getTextWidth(`${datos.norden || ""}`);
  doc.setLineWidth(1.2);
  doc.line(fichaX - fichaWidth, fichaY + 2, fichaX, fichaY + 2);
  doc.setLineWidth(0.2);
  // Fecha debajo de la sede
  if (datos.fecha) {
    // Formatear fecha yyyy-mm-dd a dd/mm/yyyy
    let fechaStr = datos.fecha;
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
      const [y, m, d] = fechaStr.split("-");
      fechaStr = `${d}/${m}/${y}`;
    }
    doc.setFont("helvetica", "normal").setFontSize(10);
    const label = "Fecha :";
    const labelW = doc.getTextWidth(label);
    doc
      .setFont("helvetica", "bold")
      .text(label, fichaX - labelW - 2, fichaY + 20, { align: "right" });
    doc
      .setFont("helvetica", "normal")
      .text(fechaStr, fichaX, fichaY + 20, { align: "right" });
  }
};

// === FOOTER FICHA AUDIOLOGICA CABECERA ===
function footerFichaAudiologicaCabecera(doc, opts = {}, datos = {}) {
  // Posición inicial: a la izquierda del bloque de ficha
  const margin = 18;
  const logoW = 37;
  const y = 12;
  const xOffset = opts.xOffset !== undefined ? opts.xOffset : 0;
  const fontSize = opts.fontSize !== undefined ? opts.fontSize : 7;
  const baseX = margin + logoW + 8 - xOffset; // más a la izquierda si xOffset > 0
  const yOffset = opts.yOffset !== undefined ? opts.yOffset : 0;
  let yFila = y + 2 + yOffset;
  const rowH = 3.2;
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 0, 0);

  // Definir las filas principales
  const filas = [
    {
      direccion: datos?.dirTruPierola || "",
      celular: datos?.celTrujilloPie || "",
      email: datos?.emailTruPierola || "",
      telefono: datos?.telfTruPierola || ""
    },
    {
      direccion: datos?.dirHuamachuco || "",
      celular: datos?.celHuamachuco || "",
      email: datos?.emailHuamachuco || "",
      telefono: datos?.telfHuamachuco || ""
    },
    {
      direccion: datos?.dirHuancayo || "",
      celular: datos?.celHuancayo || "",
      email: datos?.emailHuancayo || "",
      telefono: datos?.telfHuancayo || ""
    }
  ];

  // Renderizar filas principales en horizontal
  filas.forEach((fila, idx) => {
    let x = baseX;
    // Dirección: negrita hasta el primer ':'
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
    // Celular
    if (fila.celular) {
      doc.setFont("helvetica", "bold");
      doc.text("Cel.", x, yFila, { baseline: "top" });
      x += doc.getTextWidth("Cel.");
      doc.setFont("helvetica", "normal");
      doc.text(` ${fila.celular}`, x, yFila, { baseline: "top" });
      x += doc.getTextWidth(` ${fila.celular}`) + 6;
    }
    // Email
    if (fila.email) {
      doc.setFont("helvetica", "normal");
      doc.text(fila.email, x, yFila, { baseline: "top" });
      x += doc.getTextWidth(fila.email) + 6;
    }
    // Teléfono
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

export default header_FichaAudiologica;
