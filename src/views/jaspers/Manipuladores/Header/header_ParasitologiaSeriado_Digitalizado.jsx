// src/views/jaspers/AnalisisBioquimicos/Header/headerManipuladores.jsx
const headerManipuladores = (doc, datos = {}, yStart = 10) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = yStart;
  const blockOffset = 10;

  // 1. Logo
  const img = "./img/logo-color.png";
  doc.addImage(img, "PNG", margin, y, 50, 16);
  y += 18;

  // 2. Sede (derecha)
  doc.setFontSize(11).setFont("helvetica", "bold");
  doc.text("Sede :", pageW - margin - 100, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.sede || ""}`, pageW - margin - 20, y, { align: "right" });
  y += 7;

  // 3. Nro Orden (derecha)
  doc.setFont("helvetica", "bold");
  doc.text("Nro Orden :", pageW - margin - 70, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.norden || ""}`, pageW - margin - 30, y, { align: "right" });
  y += 12;

  // 4. Apellidos y Nombres (izquierda)
  doc.setFontSize(11).setFont("helvetica", "bold");
  doc.text("Apellidos y Nombres :", margin + blockOffset, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.nombre || datos.nombres || ""}`, margin + blockOffset + 45, y);
  y += 7;

  // 5. Edad (izquierda)
  doc.setFont("helvetica", "bold");
  doc.text("Edad :", margin + blockOffset, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.edad || ""} AÑOS`, margin + blockOffset + 20, y);
  y += 7;

  // 6. DNI (izquierda)
  doc.setFont("helvetica", "bold");
  doc.text("DNI :", margin + blockOffset, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.dni || ""}`, margin + blockOffset + 15, y);
  y += 7;

  // 7. Fecha (izquierda)
  doc.setFont("helvetica", "bold");
  doc.text("Fecha :", margin + blockOffset, y);
  doc.setFont("helvetica", "normal");
  let fecha = datos.fecha || "";
  if (fecha && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    // yyyy-mm-dd => dd/mm/yyyy
    const [a, m, d] = fecha.split("-");
    fecha = `${d}/${m}/${a}`;
  }
  doc.text(fecha, margin + blockOffset + 20, y);
  y += 7;

  // 8. Muestra (izquierda)
  doc.setFont("helvetica", "bold");
  doc.text("Muestra :", margin + blockOffset, y);
  doc.setFont("helvetica", "normal");
  doc.text(`HECES`, margin + blockOffset + 22, y);
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  if (colorValido) {
    let color = datos.codigoColor || "#008f39";
    let boxText = (datos.textoColor || "F").toUpperCase();
  
    const boxSize = 15;
    const boxX = pageW - margin - boxSize;
    const boxY = 10 + 2;
    
    // Draw box outline in black
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);

    // Solo renderiza si color es válido
    doc.setDrawColor(color);
    doc.setLineWidth(2);
    doc.setLineCap('round');
    doc.line(boxX + boxSize + 3, boxY, boxX + boxSize + 3, boxY + boxSize);
    doc.setLineCap('butt');
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color);
    doc.text(boxText, boxX + boxSize/2, boxY + (boxSize/2), { 
      align: "center",
      baseline: "middle",
      maxWidth: boxSize - 1
    });
    
    // Reset color settings after drawing the colored elements
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2)
  }
};

export default headerManipuladores;
