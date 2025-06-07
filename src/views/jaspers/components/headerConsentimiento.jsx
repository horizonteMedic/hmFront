const headerConsentimiento = (doc, datos = {}) => {
  const margin = 15;
  const y = 10;
  const pageW = doc.internal.pageSize.getWidth();
  // Logo a la izquierda
  const img = "./img/logo-color.png"; // Ruta de la imagen en public
  doc.addImage(img, "PNG", margin, y, 50, 16); // ancho 50mm, alto 16mm

  // Nro Orden y Sede a la derecha
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text("Nro Orden :", pageW - 70, y + 6);
  doc.setFontSize(13);
  doc.text(`${datos.nro_orden || ''}`, pageW - 35, y + 6);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text("Sede :", pageW - 70, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.sede || ''}`, pageW - 50, y + 14);
};

export default headerConsentimiento; 