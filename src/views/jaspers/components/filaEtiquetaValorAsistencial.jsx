import { ALTO_FILA, FUENTE_CUERPO } from "./tituloSeccionAsistencial.jsx"; 


const FONT = "helvetica";
const PADDING = 2;
const PRIMERA_LINEA = 3.5; // baseline de la 1ª línea respecto al borde superior de la fila
const INTERLINEA = 4; // a FUENTE_CUERPO; se escala con la letra
const FUENTE_UNA_LINEA_MIN = 7;
const FUENTE_MIN = 5.5;
const MAX_LINEAS_CELDA = 3;
const ANCHO_MIN_PRIMERA_LINEA = 12; // si la 1ª línea queda más angosta, el valor empieza en la siguiente

export const ajustarTexto = (doc, valor, { anchoPrimera, anchoResto }) => {
  const limpio = String(valor ?? "").replace(/\s+/g, " ").trim();
  if (!limpio) return { lineas: [], size: FUENTE_CUERPO };
  doc.setFont(FONT, "normal");

  for (let size = FUENTE_CUERPO; size >= FUENTE_UNA_LINEA_MIN; size -= 0.5) {
    doc.setFontSize(size);
    if (doc.getTextWidth(limpio) <= anchoPrimera) return { lineas: [limpio], size };
  }

  const envolver = (size) => {
    doc.setFontSize(size);
    const [primera = ""] =
      anchoPrimera >= ANCHO_MIN_PRIMERA_LINEA ? doc.splitTextToSize(limpio, anchoPrimera) : [""];
    const resto = limpio.slice(primera.length).trim();
    return [primera, ...(resto ? doc.splitTextToSize(resto, Math.max(anchoResto, ANCHO_MIN_PRIMERA_LINEA)) : [])];
  };
  let size = FUENTE_CUERPO;
  let lineas = envolver(size);
  while (lineas.length > MAX_LINEAS_CELDA && size > FUENTE_MIN) {
    size = Math.max(FUENTE_MIN, size - 0.5);
    lineas = envolver(size);
  }
  return { lineas, size };
};

// Calcula cómo se dibujará una celda (líneas, tamaño de letra y alto) sin dibujar nada.
export const medirEtiquetaValor = (doc, { etiqueta = "", valor = "", ancho, valorX, adorno, anchoValor }) => {
  doc.setFont(FONT, "bold").setFontSize(FUENTE_CUERPO);
  const anchoEtiqueta = etiqueta ? doc.getTextWidth(etiqueta) + 1.5 : 0;
  const inicioValor = valorX ?? PADDING + anchoEtiqueta + (adorno?.ancho ?? 0);
  const tope = anchoValor ?? Infinity;
  const anchoPrimera = Math.min(ancho - inicioValor - PADDING, tope);
  const anchoResto = valorX !== undefined ? anchoPrimera : Math.min(ancho - 2 * PADDING, tope);
  const { lineas, size } = ajustarTexto(doc, valor, { anchoPrimera, anchoResto });
  const interlinea = (INTERLINEA * size) / FUENTE_CUERPO;
  const alto = Math.max(ALTO_FILA, PRIMERA_LINEA + Math.max(0, lineas.length - 1) * interlinea + 1.5);
  return { etiqueta, ancho, valorX, adorno, anchoEtiqueta, inicioValor, lineas, size, interlinea, alto };
};

// Dibuja el texto de una celda ya medida (sin el borde) con su esquina superior izquierda en (x, y).
export const dibujarEtiquetaValor = (doc, medida, x, y) => {
  const yBase = y + PRIMERA_LINEA;
  if (medida.etiqueta) {
    doc.setFont(FONT, "bold").setFontSize(FUENTE_CUERPO);
    doc.text(medida.etiqueta, x + PADDING, yBase);
  }
  medida.adorno?.dibujar(x + PADDING + medida.anchoEtiqueta, yBase);
  doc.setFont(FONT, "normal").setFontSize(medida.size);
  medida.lineas.forEach((linea, i) => {
    if (linea) doc.text(linea, x + (i === 0 ? medida.inicioValor : medida.valorX ?? PADDING), yBase + i * medida.interlinea);
  });
  doc.setFont(FONT, "normal").setFontSize(FUENTE_CUERPO);
};

// Fila de celdas con borde, todas del mismo alto (el de la más alta). Devuelve la Y donde termina.
const FilaEtiquetaValorAsistencial = (doc, celdas, { x = 15, y } = {}) => {
  const medidas = celdas.map((celda) => medirEtiquetaValor(doc, celda));
  const alto = Math.max(ALTO_FILA, ...medidas.map((m) => m.alto));
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  let xCelda = x;
  medidas.forEach((medida) => {
    doc.rect(xCelda, y, medida.ancho, alto);
    dibujarEtiquetaValor(doc, medida, xCelda, y);
    xCelda += medida.ancho;
  });
  return y + alto;
};

export default FilaEtiquetaValorAsistencial;
