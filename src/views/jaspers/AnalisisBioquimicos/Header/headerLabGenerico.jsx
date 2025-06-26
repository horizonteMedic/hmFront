// This file will be renamed to headerLabGenerico.jsx
const headerMicrobiologia = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 10;

  // 1. Logo
  const img = "./img/logo-color.png";
  doc.addImage(img, "PNG", margin, y, 50, 16);
  y += 18;

  // 2. Nro Orden (movido más a la izquierda)
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
  y += 7;

  // 3. Sede (movido más a la izquierda, alineado con Nro Orden)
  doc.setFont("helvetica", "bold");
  doc.text("Sede :", pageW - margin - 90, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.sede || ""}`, pageW - margin - 40, y, { align: "right" });
  y += 12;

  // 4. Apellidos y Nombres (izquierda)
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  const labelNombres = "Apellidos y Nombres :";
  doc.text(labelNombres, margin, y);
  doc.setFont("helvetica", "normal");
  const labelNombresWidth = doc.getTextWidth(labelNombres);
  doc.text(`${ datos.nombres || "" }`, margin + labelNombresWidth + 4, y);
  y += 7;

  // 5. Edad (izquierda)
  doc.setFont("helvetica", "bold");
  const labelEdad = "Edad :";
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
