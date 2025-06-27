// src/views/jaspers/Toxicologia/Header/headerAnalisisBioquimicos.js
const headerAnalisisBioquimicos = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 10;

  // 1. Logo a la izquierda
  const img = "./img/logo-color.png"; // Ruta pública
  doc.addImage(img, "PNG", margin, y, 60, 20);

  // 2. Número de Orden (derecha, alineado como en headerPerfilHepatico)
  const rightColX = pageW - margin;
  const nroOrdenLabel = "Nro Orden :";
  const nroOrdenValue = String(datos.norden || "");
  const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  const nroOrdenX = rightColX - nroOrdenValueWidth - nroOrdenLabelWidth - 2;
  doc.setFontSize(11).setFont("helvetica", "normal");
  doc.text(nroOrdenLabel, nroOrdenX, y + 5);
  doc.setFontSize(18).setFont("helvetica", "bold");
  doc.text(nroOrdenValue, nroOrdenX + nroOrdenLabelWidth + 2, y + 5);
  doc.setLineWidth(0.7);
  doc.line(
    nroOrdenX + nroOrdenLabelWidth + 2, y + 6.5,
    nroOrdenX + nroOrdenLabelWidth + 2 + nroOrdenValueWidth, y + 6.5
  );
  doc.setLineWidth(0.2);

  // Sede (debajo, alineado con el Nro Orden)
  doc.setFontSize(9).setFont("helvetica", "normal");
  doc.text(datos.sede || "", rightColX, y + 11, { align: "right" });
};

export default headerAnalisisBioquimicos;
