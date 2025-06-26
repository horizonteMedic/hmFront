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

  // 2. Número de Orden (movido más a la izquierda)
  const nroOrdenLabel = "Nro Orden :";
  const nroOrdenValue = String(datos.norden || "");
  doc.setFontSize(11).setFont("helvetica", "bold");
  doc.text(nroOrdenLabel, pageW - margin - 90, y);
  doc.setFontSize(18).setFont("helvetica", "bold");
  doc.text(nroOrdenValue, pageW - margin - 40, y, { align: "right" });
  // Subrayado
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  doc.setLineWidth(0.7);
  doc.line(pageW - margin - 40 - nroOrdenValueWidth, y + 1.5, pageW - margin - 40, y + 1.5);
  doc.setLineWidth(0.2);
  y += 8;

  // 3. Sede (movido más a la izquierda, alineado con Nro Orden)
  doc.setFont("helvetica", "bold");
  doc.text("Sede :", pageW - margin - 90, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.sede || ""}`, pageW - margin - 40, y, { align: "right" });
};

export default headerAnalisisBioquimicos;
