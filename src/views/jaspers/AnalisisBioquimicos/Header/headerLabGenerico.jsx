// This file will be renamed to headerLabGenerico.jsx
const headerMicrobiologia = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 10;

  // 1. Logo
  const img = "./img/logo-color.png";
  doc.addImage(img, "PNG", margin, y, 50, 16);
  y += 18;

  // 2. Nro Orden (derecha)
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Nro Orden :", pageW - margin - 60, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.n_orden || datos.norden || ""}`, pageW - margin - 10, y, {
    align: "right",
  });
  y += 7;

  // 3. Sede (derecha)
  doc.setFont("helvetica", "bold");
  doc.text("Sede :", pageW - margin - 60, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.sede || ""}`, pageW - margin - 10, y, { align: "right" });
  y += 12;

  // 4. Apellidos y Nombres (izquierda)
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Apellidos y Nombres :", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.nombre || datos.nombres || ""}`, margin + 55, y);
  y += 7;

  // 5. Edad (izquierda)
  doc.setFont("helvetica", "bold");
  doc.text("Edad :", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.edad || ""} AÑOS`, margin + 20, y);
  y += 7;

  // 6. Fecha (izquierda)
  doc.setFont("helvetica", "bold");
  doc.text("Fecha :", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.fecha || ""}`, margin + 22, y);
};

export default headerMicrobiologia;
