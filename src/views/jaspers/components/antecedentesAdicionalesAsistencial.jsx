import TituloSeccionAsistencial, { ALTO_FILA, FUENTE_CUERPO } from "./tituloSeccionAsistencial.jsx";

// Sección "ANTECEDENTES ADICIONALES" de las historias clínicas asistenciales: las patologías del paciente que
// la hoja no tiene como casilla fija. Cada una va con su casilla marcada, acomodadas en filas del ancho de la
// hoja (un texto largo salta de línea y la fila crece). Sin patologías no se dibuja nada.
//
// `items`: textos ya redactados (ver patologiasAdicionales en AntecedentesPatologicos/catalogoPatologias.js).
// `asegurarEspacio(y, alto)`: async, devuelve la Y donde dibujar un bloque de ese alto (salta de página si no
// cabe). Por defecto no pagina. Devuelve la Y donde termina la sección.

const CASILLA = 3.2;
const GAP = 6; // separación horizontal entre patologías
const INTERLINEA = 4;
const PRIMERA_LINEA = 3.5; // baseline de la 1ª línea respecto al borde superior de la fila

const AntecedentesAdicionalesAsistencial = async (
  doc,
  items = [],
  { x = 10, y, ancho = 190, asegurarEspacio = async (yy) => yy } = {}
) => {
  if (items.length === 0) return y;

  const xTexto = CASILLA + 2;
  const anchoUtil = ancho - 4;
  doc.setFont("helvetica", "normal").setFontSize(FUENTE_CUERPO);

  const piezas = items.map((item) => {
    const lineas = doc.splitTextToSize(item, anchoUtil - xTexto);
    return {
      lineas,
      ancho: xTexto + Math.max(...lineas.map((l) => doc.getTextWidth(l))),
      alto: Math.max(ALTO_FILA, PRIMERA_LINEA + (lineas.length - 1) * INTERLINEA + 1.5),
    };
  });

  const filas = [];
  let actual = { piezas: [], ancho: 0 };
  piezas.forEach((pieza) => {
    if (actual.piezas.length && actual.ancho + pieza.ancho > anchoUtil) {
      filas.push(actual);
      actual = { piezas: [], ancho: 0 };
    }
    actual.piezas.push(pieza);
    actual.ancho += pieza.ancho + GAP;
  });
  filas.push(actual);
  const altoFila = (fila) => Math.max(...fila.piezas.map((p) => p.alto));

  // La barra va siempre con su primera fila; si el resto no cabe en la hoja, sigue en la página siguiente.
  let yy = await asegurarEspacio(y, ALTO_FILA + altoFila(filas[0]));
  yy = TituloSeccionAsistencial(doc, "ANTECEDENTES ADICIONALES", { x, y: yy, ancho });
  for (const fila of filas) {
    yy = await asegurarEspacio(yy, altoFila(fila));
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(x, yy, ancho, altoFila(fila));
    let xPieza = x + 2;
    fila.piezas.forEach((pieza) => {
      const yCasilla = yy + (ALTO_FILA - CASILLA) / 2;
      doc.rect(xPieza, yCasilla, CASILLA, CASILLA);
      doc.setLineWidth(0.5);
      doc.line(xPieza + 0.5, yCasilla + 0.5, xPieza + CASILLA - 0.5, yCasilla + CASILLA - 0.5);
      doc.line(xPieza + CASILLA - 0.5, yCasilla + 0.5, xPieza + 0.5, yCasilla + CASILLA - 0.5);
      doc.setLineWidth(0.2);
      doc.setFont("helvetica", "normal").setFontSize(FUENTE_CUERPO);
      pieza.lineas.forEach((linea, i) => doc.text(linea, xPieza + xTexto, yy + PRIMERA_LINEA + i * INTERLINEA));
      xPieza += pieza.ancho + GAP;
    });
    yy += altoFila(fila);
  }
  return yy;
};

export default AntecedentesAdicionalesAsistencial;
