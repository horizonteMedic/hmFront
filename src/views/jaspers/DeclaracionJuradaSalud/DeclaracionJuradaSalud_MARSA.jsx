import jsPDF from "jspdf";
import CabeceraLogo from "../components/CabeceraLogo.jsx";
import drawColorBox from "../components/ColorBox.jsx";
import footerTR from "../components/footerTR.jsx";
import parrafoJustificado from "../components/parrafoJustificado.jsx";
import dibujarCuadroTextoDinamico from "../components/CuadroTextoDinamico.jsx";
import { formatearFechaCorta, formatearFechaLarga } from "../../utils/formatDateUtils.js";
import { getSignCompressed } from "../../utils/helpers.js";
import { DECLARACION_JURADA_COLUMNAS } from "../../utils/declaracionJuradaSaludUtils.js";

const FUENTE_BASE = "helvetica";

// Página A4 VERTICAL (mm)
const MARGEN_X = 15;
const ANCHO_UTIL = 180;
const CONTENIDO_Y = 42; // primera Y útil bajo la cabecera
const LIMITE_Y = 274; // por encima del pie de página

// Tablas de cuadros clínicos: dos bloques (ítems 1–26 y 27–51) con columnas Item | Cuadro Clínico | NO | SÍ
const GAP_BLOQUES = 4;
const ANCHO_BLOQUE = (ANCHO_UTIL - GAP_BLOQUES) / 2;
const ANCHO_ITEM = 6.5;
const ANCHO_RESPUESTA = 7.5;
const ANCHO_CUADRO = ANCHO_BLOQUE - ANCHO_ITEM - 2 * ANCHO_RESPUESTA;
const ALTO_CABECERA_TABLA = 5;
const ALTO_MIN_FILA = 4.4;
const PADDING_FILA = 0.9;
const LADO_CASILLA = 3.2;
const TAM_MAX = 7; // la letra de la tabla es la mayor de TAM_MAX a TAM_MIN con la que todo cabe en la página
const TAM_MIN = 5.5;

// Bajo la tabla: detalle de las respuestas afirmativas, declaración final y firma + huella del trabajador
const SEPARACION_Y = 3;
const MAX_LINEAS_DETALLE = 6;
const ANCHO_FIRMA = 70;
const ALTO_RECUADRO_FIRMA = 24;
const ALTO_FIRMAS = ALTO_RECUADRO_FIRMA + 7;

const texto = (v) => String(v ?? "").trim();
const dia = (v) => texto(v).slice(0, 10); // "2026-11-17T20:33:56" -> "2026-11-17"

/**
 * Declaración Jurada de Salud (formato MARSA): página VERTICAL con los 51 cuadros clínicos en dos tablas
 * (columnas NO | SÍ), el detalle de las respuestas afirmativas, la declaración final y la firma y huella del trabajador.
 *
 * Módulo independiente: se agrega como una página más al reporte de Antecedentes Patológicos cuando la empresa es
 * MARSA (ver ficha_antecedente_patologico_Digitalizado), pero también puede imprimirse sola.
 *
 * @param {object} data  Declaración del backend (obtenerReporte) + datos de la cabecera del reporte que ese endpoint
 *                       no trae: numeroFicha, sede, fechaExamen, codigoColor y textoColor.
 * @param {jsPDF}  docExistente  Si viene, la declaración se agrega como página nueva y se devuelve el doc; si no, se
 *                       crea el PDF y se imprime.
 * @param {number} numeroPaginaInicial  N° con el que se rotula la página ("Pag. 03").
 * @param {boolean} agregarPagina  false cuando `docExistente` ya trae la página en blanco donde dibujar (Folio).
 */
export default async function DeclaracionJuradaSalud_MARSA(
  data = {},
  docExistente = null,
  numeroPaginaInicial = 1,
  { agregarPagina = true } = {}
) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  // Agregada a un reporte existente: página nueva y siempre vertical
  if (docExistente && agregarPagina) doc.addPage("a4", "portrait");
  const pageW = doc.internal.pageSize.getWidth();
  let pagina = numeroPaginaInicial;

  const datos = {
    numeroFicha: texto(data.numeroFicha ?? data.nOrden),
    sede: texto(data.sede),
    fechaExamen: texto(data.fechaExamen) || (dia(data.fechaEmo) ? formatearFechaCorta(dia(data.fechaEmo)) : ""),
    codigoColor: texto(data.codigoColor),
    textoColor: texto(data.textoColor),
    nombreCompleto: [data.nombres, data.apellidos].map(texto).filter(Boolean).join(" "),
    dni: texto(data.dni),
    detalle: texto(data.detalleAfirmativo),
    fechaDeclaracion: dia(data.fechaDeclaracion) || dia(data.fechaEmo),
  };

  // === HEADER reutilizable (mismo estilo que las páginas del reporte de antecedentes) ===
  const drawHeader = async (numeroPagina) => {
    await CabeceraLogo(doc, { tieneMembrete: false });

    doc.setTextColor(0, 0, 0);
    doc.setFont(FUENTE_BASE, "bold").setFontSize(12);
    doc.text("DECLARACIÓN JURADA DE SALUD", pageW / 2, 36, { align: "center" });

    doc.setFont(FUENTE_BASE, "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);
    doc.setFontSize(18);
    doc.text(datos.numeroFicha, pageW - 60, 16);
    doc.setFontSize(8);
    doc.text("Sede: " + datos.sede, pageW - 80, 20);
    doc.text("Fecha de examen: " + datos.fechaExamen, pageW - 80, 25);
    doc.text("Pag. " + String(numeroPagina).padStart(2, "0"), pageW - 30, 10);

    if (datos.codigoColor) {
      drawColorBox(doc, {
        color: datos.codigoColor,
        text: datos.textoColor,
        x: pageW - 30,
        y: 10,
        size: 22,
        showLine: true,
        fontSize: 30,
      });
    }
  };

  await drawHeader(pagina);

  // === DECLARACIÓN INICIAL ===
  const yTabla = parrafoJustificado(
    doc,
    [
      { texto: "Yo, ", negrita: false },
      { texto: datos.nombreCompleto || "____________________", negrita: true },
      { texto: ", identificado con DNI N° ", negrita: false },
      { texto: datos.dni || "________", negrita: true },
      {
        texto: ", declaro bajo juramento que no tengo ni he tenido ninguno de los siguientes cuadros clínicos:",
        negrita: false,
      },
    ],
    CONTENIDO_Y + 4,
    { margin: MARGEN_X, fontSize: 8.5, interlineado: 4.4 }
  );

  // === TABLAS DE CUADROS CLÍNICOS ===
  const xBloque = (b) => MARGEN_X + b * (ANCHO_BLOQUE + GAP_BLOQUES);
  const xNo = (x0) => x0 + ANCHO_ITEM + ANCHO_CUADRO;
  const xSi = (x0) => xNo(x0) + ANCHO_RESPUESTA;

  // Líneas y alto de cada fila a la letra `tam` (sin dibujar)
  const medirFilas = (items, tam) => {
    doc.setFont(FUENTE_BASE, "normal").setFontSize(tam);
    const interlinea = tam * 0.3528 * 1.2;
    return items.map((item) => {
      const lineas = doc.splitTextToSize(item.texto, ANCHO_CUADRO - 2.4);
      return { lineas, interlinea, alto: Math.max(ALTO_MIN_FILA, lineas.length * interlinea + 2 * PADDING_FILA) };
    });
  };
  const altoBloque = (filas) => ALTO_CABECERA_TABLA + filas.reduce((suma, fila) => suma + fila.alto, 0);
  const altoTabla = (tam) =>
    Math.max(...DECLARACION_JURADA_COLUMNAS.map((items) => altoBloque(medirFilas(items, tam))));

  // La mayor letra con la que ambas tablas caben en `presupuesto` mm (null si ni con la mínima)
  const elegirTam = (presupuesto) => {
    for (let tam = TAM_MAX; tam >= TAM_MIN; tam -= 0.25) {
      if (altoTabla(tam) <= presupuesto) return tam;
    }
    return null;
  };

  // Alto del cuadro de detalle (misma regla de CuadroTextoDinamico: título + texto, con tope de líneas)
  const textoDetalle = datos.detalle || "---";
  doc.setFont(FUENTE_BASE, "normal").setFontSize(8);
  const lineasDetalle = doc.splitTextToSize(textoDetalle, ANCHO_UTIL - 6).length;
  const altoDetalle = Math.max(10, Math.min(lineasDetalle, MAX_LINEAS_DETALLE) * 4 + 9 + 2);
  const altoInferior = SEPARACION_Y + altoDetalle + SEPARACION_Y + ALTO_FIRMAS;

  // Si ni con la letra mínima caben las tablas y lo de abajo, lo de abajo pasa a una página nueva
  let bloqueInferiorEnPaginaNueva = false;
  let tam = elegirTam(LIMITE_Y - yTabla - altoInferior);
  if (tam === null) {
    bloqueInferiorEnPaginaNueva = true;
    tam = elegirTam(LIMITE_Y - yTabla) ?? TAM_MIN;
  }

  const casilla = (x, y, marcada) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.25);
    doc.rect(x, y, LADO_CASILLA, LADO_CASILLA);
    if (marcada) {
      const m = 0.55;
      doc.setLineWidth(0.45);
      doc.line(x + m, y + m, x + LADO_CASILLA - m, y + LADO_CASILLA - m);
      doc.line(x + LADO_CASILLA - m, y + m, x + m, y + LADO_CASILLA - m);
    }
  };

  const alturaTabla = altoTabla(tam);

  const dibujarBloque = (items, b) => {
    const x0 = xBloque(b);
    const filas = medirFilas(items, tam);

    // Cabecera
    doc.setFillColor(210, 210, 210);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(x0, yTabla, ANCHO_BLOQUE, ALTO_CABECERA_TABLA, "FD");
    doc.setFont(FUENTE_BASE, "bold").setFontSize(6.5);
    doc.setTextColor(0, 0, 0);
    const yCabecera = yTabla + ALTO_CABECERA_TABLA / 2;
    doc.text("Item", x0 + ANCHO_ITEM / 2, yCabecera, { align: "center", baseline: "middle" });
    doc.text("Cuadro Clínico", x0 + ANCHO_ITEM + ANCHO_CUADRO / 2, yCabecera, { align: "center", baseline: "middle" });
    doc.text("NO", xNo(x0) + ANCHO_RESPUESTA / 2, yCabecera, { align: "center", baseline: "middle" });
    doc.text("SI", xSi(x0) + ANCHO_RESPUESTA / 2, yCabecera, { align: "center", baseline: "middle" });

    // Filas
    let y = yTabla + ALTO_CABECERA_TABLA;
    items.forEach((item, i) => {
      const { lineas, interlinea, alto } = filas[i];
      const yPrimeraLinea = y + (alto - lineas.length * interlinea) / 2 + interlinea * 0.73;

      doc.setFont(FUENTE_BASE, "bold").setFontSize(tam);
      doc.text(String(item.numero), x0 + ANCHO_ITEM / 2, yPrimeraLinea, { align: "center" });

      doc.setFont(FUENTE_BASE, "normal").setFontSize(tam);
      lineas.forEach((linea, k) => doc.text(linea, x0 + ANCHO_ITEM + 1.2, yPrimeraLinea + k * interlinea));

      // Sin respuesta registrada, las dos casillas quedan vacías
      const respuesta = typeof data[item.campoBackend] === "boolean" ? data[item.campoBackend] : null;
      const yCasilla = y + (alto - LADO_CASILLA) / 2;
      casilla(xNo(x0) + (ANCHO_RESPUESTA - LADO_CASILLA) / 2, yCasilla, respuesta === false);
      casilla(xSi(x0) + (ANCHO_RESPUESTA - LADO_CASILLA) / 2, yCasilla, respuesta === true);

      y += alto;
      if (i < items.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.1);
        doc.line(x0, y, x0 + ANCHO_BLOQUE, y);
      }
    });

    // Marco y divisiones de columna hasta la base común: las dos tablas terminan a la misma altura
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(x0, yTabla, ANCHO_BLOQUE, alturaTabla);
    [x0 + ANCHO_ITEM, xNo(x0), xSi(x0)].forEach((x) => doc.line(x, yTabla, x, yTabla + alturaTabla));
  };

  DECLARACION_JURADA_COLUMNAS.forEach((items, b) => dibujarBloque(items, b));

  // === DETALLE, DECLARACIÓN FINAL, FIRMA Y HUELLA ===
  let y = yTabla + alturaTabla + SEPARACION_Y;
  if (bloqueInferiorEnPaginaNueva) {
    footerTR(doc, { footerOffsetY: 8 });
    doc.addPage("a4", "portrait");
    pagina++;
    await drawHeader(pagina);
    y = CONTENIDO_Y + 4;
  }

  y = dibujarCuadroTextoDinamico(doc, {
    x: MARGEN_X,
    y,
    ancho: ANCHO_UTIL,
    titulo: "Detalle en caso que alguno sea afirmativo:",
    texto: textoDetalle,
    fontSize: 8,
    minHeight: 10,
    maxLineas: MAX_LINEAS_DETALLE,
  });
  y += SEPARACION_Y;

  // Declaración final (izquierda)
  const fechaLarga = datos.fechaDeclaracion ? formatearFechaLarga(datos.fechaDeclaracion) : "";
  parrafoJustificado(
    doc,
    [
      {
        texto:
          "Por este medio de este documento médico legal declaro que es verdad toda la información proporcionada al médico o funcionario responsable en fecha ",
        negrita: false,
      },
      { texto: fechaLarga || "____ de ____________ de ______", negrita: true },
      { texto: ".", negrita: false },
    ],
    y + 5,
    { margin: MARGEN_X, anchoMaximo: ANCHO_UTIL - ANCHO_FIRMA - 6, fontSize: 8, interlineado: 4.4 }
  );

  // Firma y huella del trabajador (derecha)
  const xFirma = MARGEN_X + ANCHO_UTIL - ANCHO_FIRMA;
  const ANCHO_ZONA_FIRMA = 46;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(xFirma, y, ANCHO_FIRMA, ALTO_RECUADRO_FIRMA);
  doc.line(xFirma + ANCHO_ZONA_FIRMA, y, xFirma + ANCHO_ZONA_FIRMA, y + ALTO_RECUADRO_FIRMA);

  const [firmaUrl, huellaUrl] = await Promise.all([
    getSignCompressed(data, "FIRMAP"),
    getSignCompressed(data, "HUELLA"),
  ]);
  if (firmaUrl) {
    try {
      doc.addImage(firmaUrl, "PNG", xFirma + (ANCHO_ZONA_FIRMA - 30) / 2, y + 2, 30, 20);
    } catch (error) {
      console.log("Error cargando firma del trabajador:", error);
    }
  }
  if (huellaUrl) {
    try {
      doc.addImage(huellaUrl, "PNG", xFirma + ANCHO_ZONA_FIRMA + (ANCHO_FIRMA - ANCHO_ZONA_FIRMA - 12) / 2, y + 2, 12, 20);
    } catch (error) {
      console.log("Error cargando huella del trabajador:", error);
    }
  }

  doc.setFont(FUENTE_BASE, "normal").setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("Firma y huella del trabajador", xFirma + ANCHO_FIRMA / 2, y + ALTO_RECUADRO_FIRMA + 3.5, { align: "center" });
  doc.text(`DNI N°: ${datos.dni}`, xFirma + ANCHO_FIRMA / 2, y + ALTO_RECUADRO_FIRMA + 7, { align: "center" });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });

  // === Imprimir ===
  if (docExistente) {
    return doc;
  } else {
    imprimir(doc);
  }
}

function imprimir(doc) {
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
