/**
 * Header para FICHA DE EVALUACIÓN AUDIOMETRÍA (logo izq, título centrado, ficha/sede derecha)
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - Datos del paciente y ficha
 */
const header_EvaluacionOftalmologica2021_Digitalizado_boro = (
  doc,
  datos = {}
) => {
  const margin = 15; // Aumentado el margen lateral
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // Logo a la izquierda
  const logoW = 60,
    logoH = 20;
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
    typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  const color = datos.codigoColor || "#008f39";
  const boxText = (datos.textoColor || "F").toUpperCase();
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y + 2;
  if (colorValido) {
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

  // Título centrado con subrayado (más pequeño)
  doc.setFont("helvetica", "bold").setFontSize(14); // Reducido de 18 a 14
  const titulo = "FICHA DE EVALUACIÓN OFTALMOLÓGICA";
  const tituloY = y + 25;
  const tituloWidth = doc.getTextWidth(titulo);
  const tituloX = (pageW - tituloWidth) / 2;
  doc.text(titulo, tituloX, tituloY);

  // Subrayado del título
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(tituloX, tituloY + 2, tituloX + tituloWidth, tituloY + 2);

  // Información del paciente (izquierda)
  const infoY = tituloY + 8;
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Nombres y Apellidos
  doc.text("Nombre:", margin, infoY);
  doc.setFont("helvetica", "bold");
  doc.text(`${datos.nombre || ""} ${datos.apellido || ""}`, margin + 15, infoY);

  // Fecha
  doc.setFont("helvetica", "normal");
  doc.text("Fecha:", pageW - margin - 80, infoY);
  doc.setFont("helvetica", "bold");
  let fechaStr = String(datos.fechaOf || "");
  // Formatear fecha yyyy-mm-dd a dd/mm/yyyy
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    const [y, m, d] = fechaStr.split("-");
    fechaStr = `${d}/${m}/${y}`;  
  }
  doc.text(fechaStr, pageW - margin - 65, infoY);

  // Empresa y Contrata
  const infoY2 = infoY + 6;
  doc.setFont("helvetica", "normal");
  doc.text("Empresa:", margin, infoY2);
  doc.setFont("helvetica", "bold");
  doc.text(`${datos.empresa || ""}`, margin + 15, infoY2, { maxWidth: 60 });

  doc.setFont("helvetica", "normal");
  doc.text("Puesto de Trabajo:", pageW - margin - 100, infoY2);
  doc.setFont("helvetica", "bold");
  doc.text(`${datos.areaO || ""}`, pageW - margin - 65, infoY2);

  // Nro Orden y Sede a la derecha (alineados y más juntos)
  const fichaX = pageW - margin - 25;
  const fichaY = logoY + 8;
  const fichaSpacing = 3; // Espaciado entre Nro Orden y Sede

  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("Nro Orden:", fichaX - 35, fichaY, { align: "right" });
  doc.setFont("helvetica", "bold").setFontSize(18); // Reducido de 22 a 18
  doc.text(`${datos.norden || ""}`, fichaX, fichaY, { align: "right" });

  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("Sede:", fichaX - 60, fichaY + fichaSpacing, { align: "right" });
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text(`${datos.sede || ""}`, fichaX, fichaY + fichaSpacing, {
    align: "right",
  });
};

export default header_EvaluacionOftalmologica2021_Digitalizado_boro;

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
