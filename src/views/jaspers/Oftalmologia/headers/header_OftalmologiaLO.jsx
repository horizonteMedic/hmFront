/**
 * Header para Oftalmología (logo izq, título centrado, ficha/sede derecha, footer horizontal)
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - Datos del paciente y ficha
 */
function footerFichaOftalmoCabecera(doc, datos = {}) {
  const pageW = doc.internal.pageSize.getWidth();
  const y = 12;
  const fontSize = 6;
  const yOffset = -8;
  const totalFooterW = 140;
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

const header_OftalmologiaLO = (doc, datos = {}) => {
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;
  // Logo a la izquierda
  const logoW = 60,
    logoH = 20; // Reducido de 28 a 20 para que no se vea estirado
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
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 500;
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
  let boxY = y + 2; // Bajado un poco más
  if (colorValido) { // Forzar a mostrar para prueba visual
    // Draw box outline in black
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
    // Solo renderiza si color es válido o para prueba
    doc.setDrawColor(color);
    doc.setLineWidth(2);
    doc.setLineCap('round');
    doc.line(boxX + boxSize + 3, boxY, boxX + boxSize + 3, boxY + boxSize);
    doc.setLineCap('butt');
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color);
    doc.text(boxText, boxX + boxSize/2, boxY + (boxSize/2), { align: "center", baseline: "middle", maxWidth: boxSize - 1 });
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2);
  }
  
  // Título centrado
  doc.setFont("helvetica", "bold").setFontSize(18);
  const titulo = "Ficha Oftalmológica";
  const tituloY = y + 40;
  doc.text(titulo, pageW / 2, tituloY, { align: "center" });
  // Nro Orden y Sede a la derecha
  const fichaX = pageW - margin - 25; // Movido más a la izquierda
  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.text("Nro Orden :", fichaX - 30, logoY + 8, { align: "right" });
  doc.setFont("helvetica", "bold").setFontSize(22);
  doc.text(`${datos.norden || ""}`, fichaX, logoY + 8, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.text("Sede :", fichaX - 63, logoY + 18, { align: "right" });
  doc.text(`${datos.sede || ""}`, fichaX, logoY + 18, { align: "right" });
};

export default header_OftalmologiaLO;
