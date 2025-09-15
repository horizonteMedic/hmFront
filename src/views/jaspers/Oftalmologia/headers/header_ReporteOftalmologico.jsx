/**
 * Header para Reporte Oftalmológico (logo izq, título centrado, ficha/sede derecha, footer horizontal)
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - Datos del paciente y ficha
 */
// === FOOTER HORIZONTAL DE CABECERA ===
function footerFichaOftalmoCabecera(doc, datos={}) {
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  const logoW = 38;
  const y = 12;
  const fontSize = 6;
  const yOffset = -8;
  // Centrar el bloque horizontalmente en la página
  const totalFooterW = 140; // Ajusta este valor según el ancho total estimado del bloque
  const baseX = (pageW - totalFooterW) / 2;
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
  filas.forEach((fila, idx) => {
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
}

const header_ReporteOftalmologico = (doc, datos = {}) => {
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;
  // Logo a la izquierda
  const logoW = 38,
    logoH = 13;
  const logoY = y + 2;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, logoY, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, logoY + 8);
  }
  // Footer horizontal de cabecera (datos de contacto)
  footerFichaOftalmoCabecera(doc, datos);
  // === BLOQUE CÓDIGO DE COLOR ===
  const colorValido =
    typeof datos.color === "number" && datos.color >= 1 && datos.color <= 500;
  // const color = datos.codigoColor || "#008f39";
  // const boxText = (datos.textoColor || "F").toUpperCase();
  const color = (datos.codigoColor?.trim() && datos.codigoColor.trim() !== ""
            ? datos.codigoColor.trim()
            : "#008f39");
  const boxText = (datos.textoColor?.trim() && datos.textoColor.trim() !== ""
            ? datos.textoColor.trim().toUpperCase()
            : "F");
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y + 2;
  if (colorValido) {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
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
  // Sede a la derecha, alineado a la derecha
  doc.setFont("helvetica", "normal").setFontSize(8);
  const sedeValue = `${datos.sede || "TRUJILLO - NICOLAS DE PIEROLA"}`;
  const sedeX = pageW - margin - 20;
  const sedeY = y + 6;
  doc.text(sedeValue, sedeX, sedeY, { align: "right" });
  // N° de Ficha debajo de la sede, alineado a la derecha, solo el número
  const fichaDato = `${datos.norden || "97800"}`;
  const fichaY = sedeY + 8;
  const fichaX = pageW - margin - 20;
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(fichaDato, fichaX, fichaY + 1, { align: "right" });
  // Título perfectamente centrado
  doc.setFont("helvetica", "bold").setFontSize(13);
  const titulo = "REPORTE OFTALMOLÓGICO";
  const tituloY = y + 10;
  doc.text(titulo, pageW / 2, tituloY, { align: "center" });
  const w = doc.getTextWidth(titulo);
  doc
    .setLineWidth(0.7)
    .line((pageW - w) / 2, tituloY + 2, (pageW + w) / 2, tituloY + 2)
    .setLineWidth(0.2);
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default header_ReporteOftalmologico;
