/**
 * Dibuja un cuadro (rectángulo) de reporte cuya altura se ajusta automáticamente
 * al contenido: respeta saltos de línea explícitos ("\n") y el ajuste de palabras
 * por ancho (word-wrap). Devuelve la posición Y donde termina el cuadro para que
 * el llamador pueda seguir apilando elementos debajo sin que se superpongan.
 *
 * Reutilizable en cualquier jasper: basta con pasarle el doc y las opciones.
 * 
 * @param {jsPDF} doc
 * @param {Object} opciones
 * @param {number} opciones.x
 * @param {number} opciones.y
 * @param {number} opciones.ancho
 * @param {string} [opciones.titulo] - Etiqueta en negrita al inicio del cuadro
 * @param {string} [opciones.texto] - Contenido del cuadro (puede incluir "\n")
 * @param {number} [opciones.fontSize=8]
 * @param {number} [opciones.minHeight=6] - Altura mínima del cuadro
 * @param {number} [opciones.paddingTop] - Espacio desde el borde superior hasta la primera línea de texto (por defecto deja lugar al título)
 * @param {number} [opciones.paddingBottom=2]
 * @param {number} [opciones.lineHeight] - Alto de línea (por defecto fontSize * 0.5)
 * @param {number} [opciones.paddingX=4] - Margen izquierdo del texto dentro del cuadro
 * @param {number} [opciones.maxLineas] - Tope de líneas del cuerpo; si se excede, se reduce la letra en vez de crecer el cuadro
 * @param {number} [opciones.minFontSize=5] - Tamaño de letra mínimo al que se reduce antes de recortar texto
 * @param {Function} [opciones.drawHeaderFn] - async (numeroPagina) => void, redibuja el header al saltar de página
 * @param {{value:number}} [opciones.numeroPaginaRef] - referencia mutable al número de página actual
 * @param {number} [opciones.margenInferior=25] - espacio mínimo a respetar sobre el pie de página
 * 
 * @returns {number} yFinal - posición Y inmediatamente debajo del cuadro dibujado
 */
const dibujarCuadroTextoDinamico = (doc, opciones = {}) => {
  const {
    x,
    y,
    ancho,
    titulo = "",
    texto = "",
    fontSize = 8,
    minHeight = 6,
    paddingBottom = 2,
    paddingX = 4,
    maxLineas = null,
    minFontSize = 5,
    drawHeaderFn = null,
    numeroPaginaRef = null,
    margenInferior = 25,
  } = opciones;

  let lineHeight = opciones.lineHeight ?? fontSize * 0.5;
  const paddingTop = opciones.paddingTop ?? ((opciones.lineHeight ?? fontSize * 0.5) + (titulo ? 5 : -4));
  const textoFinal = String(texto ?? "").trim();
  const anchoTexto = ancho - paddingX - 2;

  let fontSizeBody = fontSize;

  const envolverTexto = (tamano) => {
    doc.setFont("helvetica", "normal").setFontSize(tamano);
    const parrafos = textoFinal.split("\n");
    const resultado = [];
    parrafos.forEach((parrafo) => {
      if (parrafo.trim() === "") {
        resultado.push("");
      } else {
        doc.splitTextToSize(parrafo, anchoTexto).forEach((l) => resultado.push(l));
      }
    });
    return resultado;
  };

  let lineas = envolverTexto(fontSizeBody);

  if (maxLineas && lineas.length > maxLineas) {
    while (lineas.length > maxLineas && fontSizeBody > minFontSize) {
      fontSizeBody = Math.max(minFontSize, fontSizeBody - 0.5);
      lineHeight = (opciones.lineHeight ?? fontSize * 0.5) * (fontSizeBody / fontSize);
      lineas = envolverTexto(fontSizeBody);
    }
    // if (lineas.length > maxLineas) {
    //   lineas = lineas.slice(0, maxLineas);
    // }
  }

  const alturaContenido = lineas.length * lineHeight;
  const altura = Math.max(minHeight, alturaContenido + paddingTop + paddingBottom);

  doc.rect(x, y, ancho, altura);

  if (titulo) {
    doc.setFont("helvetica", "bold").setFontSize(fontSize);
    doc.text(titulo, x + 2, y + 4);
  }

  if (textoFinal) {
    doc.setFont("helvetica", "normal").setFontSize(fontSizeBody);
    let yTexto = y + paddingTop;
    lineas.forEach((linea) => {
      if (linea) doc.text(linea, x + paddingX, yTexto);
      yTexto += lineHeight;
    });
  }

  return y + altura;
};

export default dibujarCuadroTextoDinamico;
