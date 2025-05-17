const drawBox = (doc,text, x, y, w, h, r, drawX = false) => {
    doc.roundedRect(x, y, w, h, r,r, "S"); // Dibuja un rectángulo con esquinas redondeadas
    doc.text(text, x + w / 2, y + h / 2, { align: "center", baseline: "middle" }); // Texto centrado
    if (drawX) {
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        const size = 5; // tamaño de la X
        if (text === 'ADMISION') {
            doc.setDrawColor(0, 102, 255); // 🔵 Azul
        } else {
            doc.setDrawColor(255, 0, 0); // 🔴 Rojo
        }
        doc.line(centerX - size, centerY - size, centerX + size, centerY + size);
        doc.line(centerX + size, centerY - size, centerX - size, centerY + size);
        doc.setDrawColor(0); // 🔁 Restaurar color predeterminado (negro)
      }
};

export default drawBox