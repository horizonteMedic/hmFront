// src/views/jaspers/Toxicologia/Header/headerAnalisisBioquimicos.js
const headerAnalisisBioquimicos = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const yOffset = 10;
  let y = yOffset;

  // 1. Logo a la izquierda
  const img = "./img/logo-color.png"; // Ruta pública
  doc.addImage(img, "PNG", margin, y, 50, 16);
  y += 18;

  // 2. Número de Orden (alineado a la derecha)
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Nro Orden :", pageW - margin - 60, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.n_orden || datos.norden || ""}`, pageW - margin - 10, y, { align: "right" });
  y += 8;

  // 3. Sede (alineado a la derecha, debajo del nro orden)
  doc.setFont("helvetica", "bold");
  doc.text("Sede :", pageW - margin - 60, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.sede || ""}`, pageW - margin - 10, y, { align: "right" });
};

export default headerAnalisisBioquimicos;
