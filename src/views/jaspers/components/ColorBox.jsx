/**
 * Componente reutilizable para letra con línea de color (sin recuadro)
 * @param {Object} doc - Instancia de jsPDF
 * @param {Object} options - Opciones de configuración
 * @param {string} options.color - Código de color (ej: "#008f39")
 * @param {string} options.text - Texto a mostrar (ej: "F")
 * @param {number} options.size - Tamaño del área (default: 15)
 * @param {number} options.x - Posición X
 * @param {number} options.y - Posición Y
 * @param {number} options.margin - Margen del borde (default: 8)
 * @param {boolean} options.showLine - Mostrar línea de color (default: true)
 * @param {number} options.fontSize - Tamaño de fuente (default: 18)
 */
const drawColorBox = (doc, options = {}) => {
  const {
    color = "#008f39",
    text = "F",
    size = 15,
    x = null,
    y = null,
    margin = 8,
    showLine = true,
    fontSize = 18,
    borderRadius = 2
  } = options;

  const pageW = doc.internal.pageSize.getWidth();
  
  // Posiciones por defecto si no se especifican
  const boxX = x !== null ? x : pageW - margin - size;
  const boxY = y !== null ? y : 15;

  // Validar color
  const isValidColor = color && typeof color === 'string' && color.startsWith('#');
  const finalColor = isValidColor ? color : "#008f39";
  const finalText = String(text || "F").toUpperCase();

  try {
    // Solo línea de color a la derecha (opcional)
    if (showLine) {
      doc.setDrawColor(finalColor);
      doc.setLineWidth(2);
      doc.setLineCap("round");
      doc.line(boxX + size + 3, boxY, boxX + size + 3, boxY + size);
      doc.setLineCap("butt");
    }
    
    // Texto en color (sin recuadro)
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(finalColor);
    doc.text(finalText, boxX + size * 0.85, boxY + size / 2, {
      align: "center",
      baseline: "middle",
      maxWidth: size - 1
    });
    
    // Restaurar configuraciones
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2);
    
    return {
      x: boxX,
      y: boxY,
      width: size,
      height: size,
      rightEdge: boxX + size + (showLine ? 3 : 0)
    };
    
  } catch (error) {
    console.error("Error al dibujar ColorBox:", error);
    return null;
  }
};

export default drawColorBox;
