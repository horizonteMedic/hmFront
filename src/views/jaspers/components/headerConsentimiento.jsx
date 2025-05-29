const headerConsentimiento = (doc) => {
  const margin = 15;
  const y = 10;
  // Logo a la izquierda
  const img = "./img/logo-color.png"; // Ruta de la imagen en public
  doc.addImage(img, "PNG", margin, y, 50, 16); // ancho 50mm, alto 16mm
};

export default headerConsentimiento; 