const drawGridItem = (doc, text, x, y, w, h, drawX) => {
    // Configuración básica para TODOS (Normal)
    doc.setDrawColor(0); // Borde negro
    doc.setFillColor(255, 255, 255); // Fondo blanco
    doc.setLineWidth(0.1);
    doc.setTextColor(0); // Texto negro
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");

    // Dibujar rectángulo
    doc.rect(x, y, w, h, "FD");

    // Ajuste de texto
    const textLines = doc.splitTextToSize(text, w - 2);
    const lineHeight = 3;
    const totalTextHeight = textLines.length * lineHeight;
    const startY = y + (h - totalTextHeight) / 2 + 2;

    textLines.forEach((line, i) => {
        doc.text(line, x + w / 2, startY + (i * lineHeight), { align: "center" });
    });

    // Dibujar X Roja si drawX es true (Excluido)
    if (drawX) {
        doc.setDrawColor(255, 0, 0); // Rojo
        doc.setLineWidth(0.5);

        // X centrada (no de esquina a esquina, sino un poco más pequeña y centrada)
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        const size = Math.min(w, h) / 2.5; // Tamaño proporcional

        doc.line(centerX - size, centerY - size, centerX + size, centerY + size);
        doc.line(centerX + size, centerY - size, centerX - size, centerY + size);

        // Restaurar
        doc.setDrawColor(0);
        doc.setLineWidth(0.1);
    }
};

export default drawGridItem;
