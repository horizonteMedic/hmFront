const header = (doc) => {
    const img = "./img/logo-color.png"; // Ruta de la imagen en public
    
    doc.addImage(img, "PNG", 10, 10, 50, 20); // Imagen alineada a la izquierda
  
    doc.setFontSize(8);
    doc.text("POLICLÍNICO HORIZONTE MEDIC", 70, 10);
    doc.text("CUIDAMOS SU SALUD", 70, 15);
    doc.text("Web: www.horizontemedic.com", 70, 20);
    doc.text("Tel: ______", 70, 25);
    return
}

export default header