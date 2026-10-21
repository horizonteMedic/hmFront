import TituloSeccionAsistencial from "./tituloSeccionAsistencial.jsx";
import FilaEtiquetaValorAsistencial from "./filaEtiquetaValorAsistencial.jsx";

// Sección de un reporte asistencial: barra de título + filas con borde "Etiqueta: valor". Cada fila de `filas` es
// [etiqueta, valor] (una celda de todo el ancho) o [[etiqueta, valor], [etiqueta, valor]] (dos columnas).
// `valorX` es la distancia desde el borde de cada celda hasta su valor (alinea los valores de la sección).
// Devuelve la Y donde termina.
const SeccionEtiquetaValorAsistencial = (doc, titulo, filas, { x = 15, y, ancho = 180, valorX = 40 } = {}) => {
  let yActual = TituloSeccionAsistencial(doc, titulo, { x, y, ancho });
  filas.forEach((fila) => {
    const pares = Array.isArray(fila[0]) ? fila : [fila];
    const celdas = pares.map(([etiqueta, valor]) => ({
      etiqueta: etiqueta ? `${etiqueta}:` : "",
      valor,
      ancho: ancho / pares.length,
      valorX,
    }));
    yActual = FilaEtiquetaValorAsistencial(doc, celdas, { x, y: yActual });
  });
  return yActual;
};

export default SeccionEtiquetaValorAsistencial;
