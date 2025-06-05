const header = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const yOffset = 10;
  let y = yOffset;

  // Logo a la izquierda
  const img = "./img/logo-color.png"; // Ruta de la imagen en public
  doc.addImage(img, "PNG", margin, y, 50, 16); // ancho 50mm, alto 16mm
  y += 18;

  // 1. Texto color con línea y color si se provee
  if (typeof datos.color === "string" && datos.color) {
    // Línea de color
    doc.setDrawColor(datos.color);
    doc.setLineWidth(2);
    doc.line(margin, y, pageW - margin, y);
    // Texto color
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(datos.color);
    doc.text((datos.textoColor || ""), pageW / 2, y + 8, { align: "center" });
    doc.setTextColor(0, 0, 0);
    y += 16;
  } else {
    y += 8;
  }

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  // 2. Nro Orden
  doc.text("Nro Orden :", pageW - margin - 60, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.n_orden || datos.norden || ''}`, pageW - margin - 10, y, { align: "right" });
  y += 8;

  // 3. Apellidos y Nombres
  doc.setFont("helvetica", "bold");
  doc.text("Apellidos y Nombres :", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.nombre || datos.nombres || ''}`, margin + 55, y);
  y += 8;

  // 4. Edad
  doc.setFont("helvetica", "bold");
  doc.text("Edad :", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.edad || ''} AÑOS`, margin + 20, y);
  y += 8;

  // 5. Fecha
  doc.setFont("helvetica", "bold");
  doc.text("Fecha :", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.fecha || ''}`, margin + 22, y);
};

export default header;