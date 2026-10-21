const FONT = "helvetica";

// Párrafo justificado con segmentos { texto, negrita } (p. ej. datos del paciente en negrita). Se parte en palabras
// (una palabra puede mezclar estilos: un dato en negrita seguido de una coma), se reparten en líneas del ancho
// disponible y en todas menos la última el espacio sobrante se reparte entre las palabras. Devuelve la Y siguiente.
const parrafoJustificado = (doc, segmentos, y, { margin = 18, fontSize = 11, interlineado = 7 } = {}) => {
  const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin;
  doc.setFontSize(fontSize);

  const anchoDe = (texto, negrita) => {
    doc.setFont(FONT, negrita ? "bold" : "normal");
    return doc.getTextWidth(texto);
  };
  const espacio = anchoDe(" ", false);

  // Cada palabra es una lista de partes { texto, negrita, ancho }; el espacio en blanco cierra la palabra.
  const palabras = [];
  let palabra = [];
  segmentos.forEach(({ texto, negrita }) => {
    texto.split(/(\s+)/).forEach((trozo) => {
      if (/^\s+$/.test(trozo)) {
        if (palabra.length) palabras.push(palabra);
        palabra = [];
      } else if (trozo) {
        palabra.push({ texto: trozo, negrita, ancho: anchoDe(trozo, negrita) });
      }
    });
  });
  if (palabra.length) palabras.push(palabra);

  const anchoPalabra = (partes) => partes.reduce((suma, parte) => suma + parte.ancho, 0);
  const lineas = [];
  let actual = [];
  let ancho = 0;
  palabras.forEach((partes) => {
    const anchoItem = anchoPalabra(partes);
    if (actual.length && ancho + espacio + anchoItem > maxWidth) {
      lineas.push(actual);
      actual = [];
      ancho = 0;
    }
    ancho += (actual.length ? espacio : 0) + anchoItem;
    actual.push(partes);
  });
  if (actual.length) lineas.push(actual);

  lineas.forEach((linea, i) => {
    const ultima = i === lineas.length - 1;
    const anchoPalabras = linea.reduce((suma, partes) => suma + anchoPalabra(partes), 0);
    const hueco = !ultima && linea.length > 1 ? (maxWidth - anchoPalabras) / (linea.length - 1) : espacio;
    let x = margin;
    linea.forEach((partes) => {
      partes.forEach((parte) => {
        doc.setFont(FONT, parte.negrita ? "bold" : "normal");
        doc.text(parte.texto, x, y);
        x += parte.ancho;
      });
      x += hueco;
    });
    y += interlineado;
  });
  return y;
};

export default parrafoJustificado;
