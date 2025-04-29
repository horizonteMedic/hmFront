
const drawBox = (doc,text, x, y, w, h, r, drawX = false) => {
    doc.roundedRect(x, y, w, h, r,r, "S"); // Dibuja un rectángulo con esquinas redondeadas
    doc.text(text, x + w / 2, y + h / 2 + 2.5, { align: "center" }); // Texto centrado
    if (drawX) {
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        const size = 5; // tamaño de la X
        doc.line(centerX - size, centerY - size, centerX + size, centerY + size);
        doc.line(centerX + size, centerY - size, centerX - size, centerY + size);
      }
};

export default drawBox