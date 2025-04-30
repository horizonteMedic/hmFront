const drawC = (doc,text, x, y, w, h, drawX = false) => {
    doc.rect(x, y, w, h, "S"); // Dibuja el rectángulo
    doc.text(text, x + w / 2, y + h / 2 + 0.5, { align: "center", baseline: "middle" }); // Ajusta la posición del texto
    if (drawX) {
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        const size = 5; // tamaño de la X
        doc.line(centerX - size, centerY - size, centerX + size, centerY + size);
        doc.line(centerX + size, centerY - size, centerX - size, centerY + size);
      }
}

export default drawC