const header = (doc) => {
    const img = "./img/logo-color.png"; // Ruta de la imagen en public
    // Logo a la izquierda, más largo
    doc.addImage(img, "PNG", 10, 10, 70, 22);

    // Labels en negrita y alineados a la derecha
    doc.setFontSize(10);
    let y = 18;
    const rightX = 205;
    doc.setFont(undefined, 'bold');
    doc.text("Dirección:", rightX, y, { align: "right" }); y += 6;
    doc.text("Teléfono:", rightX, y, { align: "right" }); y += 6;
    doc.text("Email:", rightX, y, { align: "right" }); y += 6;
    doc.text("Web:", rightX, y, { align: "right" });
};

export default header;