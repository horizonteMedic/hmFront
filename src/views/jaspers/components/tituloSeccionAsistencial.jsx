// Estándar tipográfico de los reportes del módulo asistencial (el de "Datos personales"):
//  - Títulos de sección: barra gris, negrita, 8pt y SIEMPRE en MAYÚSCULAS (esta función las aplica).
//  - Cuerpo: 9pt. Subtítulos/etiquetas ("Estado civil:") en negrita y con solo la primera letra en
//    mayúscula; valores en normal. Filas de ALTO_FILA mm (crecen si el texto no cabe).
export const FUENTE_CUERPO = 9;
export const FUENTE_TITULO = 8;
export const ALTO_FILA = 5;

const PADDING = 2;
const PRIMERA_LINEA = 3.5; // baseline del texto respecto al borde superior de la barra

// Dibuja la barra de título de una sección y devuelve la Y donde termina.
const TituloSeccionAsistencial = (doc, titulo, { x = 15, y, ancho = 180 } = {}) => {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(x, y, ancho, ALTO_FILA, "FD");
  doc.setFont("helvetica", "bold").setFontSize(FUENTE_TITULO);
  doc.setTextColor(0, 0, 0);
  doc.text(String(titulo).toUpperCase(), x + PADDING, y + PRIMERA_LINEA);
  return y + ALTO_FILA;
};

export default TituloSeccionAsistencial;
