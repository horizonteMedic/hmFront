import jsPDF from "jspdf";
import HeaderAsistencial from "../../components/headerAsistencial.jsx";
import footerTR from "../../components/footerTR.jsx";
import { formatearFechaCorta, formatearFechaHora } from "../../../utils/formatDateUtils.js";
import { dibujarFirmas } from "../../../utils/dibujarFirmas.js";
import { getSign } from "../../../utils/helpers.js";

// Receta médica: indicación de medicamentos al paciente atendido, con el diagnóstico, la cantidad e indicación de
// cada medicamento y el sello y la firma del médico.
//
// Cabecera y pie: los del módulo asistencial (HeaderAsistencial: logo, N° Ticket, N° Historia Clínica, sede y
// fecha; footerTR). Cuerpo: el de una receta convencional: título, cuadro con los datos del paciente y del médico,
// el símbolo "Rp/", la lista numerada de medicamentos (nombre y presentación, cantidad, indicaciones) y la firma.
// En color solo lleva un azul sobrio (bordes, "Rp/" y encabezado de la tabla); se lee igual en blanco y negro.
//
// Datos que recibe (objeto plano):
//   numeroTicket, numeroHistoriaClinica, sede, fecha (fecha de atención, yyyy-MM-dd), codigoColor, textoColor,
//   nombres, apellidos, dni, edad, sexo, empresa,
//   diagnostico (texto, una línea por diagnóstico), medico, cmp,
//   fechaEmision (fecha y hora en que se registró la receta; por defecto `fecha`),
//   medicamentos[] ({ nombre, presentacion, cantidad, indicacion }),
//   digitalizacion[] (SELLOFIRMA / SELLOFIRMADOCASIG...), footerData.

const X = 15;
const ANCHO = 180;
const LIMITE_Y = 270; // último Y utilizable antes del pie de página
const ALTO_FIRMAS = 50; // separación + sello (20 mm) + rótulos
const SEPARACION_FIRMAS = 18;
const PIE_OFFSET_Y = 8;
const TITULO_Y = 38;
const LINEA_TITULO_Y = 41.5;
const INTERLINEA = 4.2;
const SELLOS = ["SELLOFIRMA", "SELLOFIRMADOCASIG", "SELLOFIRMADOCASIG-EXTRA"];

const AZUL = [8, 71, 136]; // #084788, el azul de la interfaz del sistema (sobrio, no el azul puro de otros reportes)
const AZUL_SUAVE = [234, 240, 247];
const GRIS_TEXTO = [95, 95, 95];
const GRIS_LINEA = [205, 205, 205];
const NEGRO = [0, 0, 0];

// Columnas de la tabla de medicamentos.
const COL_NUM = { x: X, ancho: 10 };
const COL_MED = { x: X + 10, ancho: 74 };
const COL_CANT = { x: X + 84, ancho: 22 };
const COL_IND = { x: X + 108, ancho: 72 };

const texto = (v) => String(v ?? "").trim();
const lineasDe = (v) =>
  texto(v)
    .split(/\r\n|\r|\n|\\n/g)
    .map((linea) => linea.replace(/\s+/g, " ").trim())
    .filter(Boolean);
const edadTexto = (v) => (/^\d+$/.test(texto(v)) ? `${texto(v)} AÑOS` : texto(v));

export default async function Receta(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  const medicamentos = Array.isArray(data.medicamentos) ? data.medicamentos : [];
  const hayFirma = SELLOS.some((nombre) => getSign(data, nombre));
  const d = {
    paciente: `${texto(data.nombres)} ${texto(data.apellidos)}`.trim(),
    medico: texto(data.medico) ? `Dr(a). ${texto(data.medico)}` : "",
    emision:
      formatearFechaHora(data.fechaEmision).slice(0, 16) || formatearFechaCorta(texto(data.fecha)) || texto(data.fecha),
  };

  let pagina = 1;
  let y = 0;

  const fuente = (estilo = "normal", size = 9, color = NEGRO) =>
    doc.setFont("helvetica", estilo).setFontSize(size).setTextColor(...color);
  const linea = (x1, y1, x2, y2, color, grosor) => {
    doc.setDrawColor(...color).setLineWidth(grosor);
    doc.line(x1, y1, x2, y2);
  };

  // ===== Páginas =====
  // Membrete de la empresa + título de la receta. Devuelve la Y donde sigue el contenido.
  const dibujarEncabezado = async (numeroPagina) => {
    await HeaderAsistencial(
      doc,
      {
        numeroTicket: data.numeroTicket,
        numeroHistoriaClinica: data.numeroHistoriaClinica,
        sede: data.sede,
        fecha: data.fecha,
        codigoColor: data.codigoColor,
        textoColor: data.textoColor,
      },
      { pagina: numeroPagina }
    );
    fuente("bold", 15);
    doc.text("RECETA MÉDICA", pageW / 2, TITULO_Y, { align: "center" });
    linea(X, LINEA_TITULO_Y, X + ANCHO, LINEA_TITULO_Y, AZUL, 0.6);
    return LINEA_TITULO_Y;
  };

  const dibujarPie = () => footerTR(doc, { footerData: data, footerOffsetY: PIE_OFFSET_Y, colorLinea: AZUL });

  // Hoja de continuación: la tabla sigue con su encabezado (salvo que lo que pasa a la hoja sea solo la firma).
  const nuevaPagina = async (conTabla = true) => {
    dibujarPie();
    doc.addPage();
    pagina += 1;
    y = (await dibujarEncabezado(pagina)) + 7;
    if (conTabla) encabezadoTabla();
  };

  // Si el bloque que sigue no cabe en la página, pasa a una nueva.
  const asegurarEspacio = async (alto, conTabla = true) => {
    if (y + alto > LIMITE_Y) await nuevaPagina(conTabla);
  };

  // ===== Cuadro de datos del paciente y del médico =====
  // Cada celda lleva su rótulo pequeño arriba y el valor debajo (crece si el valor no cabe en una línea).
  const medirCelda = ({ etiqueta, valor, ancho, negrita = false }) => {
    fuente(negrita ? "bold" : "normal", 9.5);
    const lineas = lineasDe(valor).flatMap((parte) => doc.splitTextToSize(parte, ancho - 5));
    const visibles = lineas.length ? lineas : [""];
    return { etiqueta, ancho, negrita, lineas: visibles, alto: 9.3 + (visibles.length - 1) * INTERLINEA };
  };

  const cuadroDatos = (filas) => {
    const medidas = filas.map((celdas) => {
      const celdasMedidas = celdas.map(medirCelda);
      return { celdas: celdasMedidas, alto: Math.max(...celdasMedidas.map((celda) => celda.alto)) };
    });
    const altoTotal = medidas.reduce((suma, fila) => suma + fila.alto, 0);

    doc.setDrawColor(...AZUL).setLineWidth(0.3);
    doc.roundedRect(X, y, ANCHO, altoTotal, 1.5, 1.5);

    let yFila = y;
    medidas.forEach((fila, i) => {
      if (i > 0) linea(X, yFila, X + ANCHO, yFila, GRIS_LINEA, 0.15);
      let xCelda = X;
      fila.celdas.forEach((celda, j) => {
        if (j > 0) linea(xCelda, yFila + 1.5, xCelda, yFila + fila.alto - 1.5, GRIS_LINEA, 0.15);
        fuente("bold", 6.5, GRIS_TEXTO);
        doc.text(celda.etiqueta, xCelda + 2.5, yFila + 3.3);
        fuente(celda.negrita ? "bold" : "normal", 9.5);
        celda.lineas.forEach((parte, k) => doc.text(parte, xCelda + 2.5, yFila + 7.3 + k * INTERLINEA));
        xCelda += celda.ancho;
      });
      yFila += fila.alto;
    });
    y += altoTotal;
  };

  // ===== Tabla de medicamentos =====
  const marcaRp = () => {
    doc.setFont("times", "italic").setFontSize(17).setTextColor(...AZUL);
    doc.text("Rp/", X + 1, y + 6);
    y += 8;
  };

  function encabezadoTabla() {
    doc.setFillColor(...AZUL_SUAVE);
    doc.rect(X, y, ANCHO, 6.5, "F");
    fuente("bold", 7.5, AZUL);
    doc.text("N°", COL_NUM.x + COL_NUM.ancho / 2, y + 4.4, { align: "center" });
    doc.text("MEDICAMENTO", COL_MED.x, y + 4.4);
    doc.text("CANT.", COL_CANT.x + COL_CANT.ancho / 2, y + 4.4, { align: "center" });
    doc.text("INDICACIONES", COL_IND.x, y + 4.4);
    linea(X, y + 6.5, X + ANCHO, y + 6.5, AZUL, 0.4);
    y += 6.5;
  }

  // Cómo se dibuja una fila (líneas de cada columna y alto), sin dibujar nada.
  const medirMedicamento = (medicamento) => {
    fuente("bold", 9.5);
    const nombre = doc.splitTextToSize(texto(medicamento.nombre), COL_MED.ancho - 2);
    fuente("normal", 8);
    const presentacion = texto(medicamento.presentacion) ? doc.splitTextToSize(texto(medicamento.presentacion), COL_MED.ancho - 2) : [];
    fuente("normal", 9);
    const indicacion = doc.splitTextToSize(lineasDe(medicamento.indicacion).join(" ") || "—", COL_IND.ancho - 1);
    const altoMedicamento = nombre.length * 4.3 + presentacion.length * 3.6;
    const altoIndicacion = indicacion.length * INTERLINEA;
    return { nombre, presentacion, indicacion, cantidad: texto(medicamento.cantidad), alto: Math.max(11, Math.max(altoMedicamento, altoIndicacion) + 5) };
  };

  const dibujarMedicamento = (fila, numero) => {
    const base = y + 5.6;
    fuente("bold", 9.5, GRIS_TEXTO);
    doc.text(`${numero}`, COL_NUM.x + COL_NUM.ancho / 2, base, { align: "center" });

    fuente("bold", 9.5);
    fila.nombre.forEach((parte, i) => doc.text(parte, COL_MED.x, base + i * 4.3));
    fuente("normal", 8, GRIS_TEXTO);
    fila.presentacion.forEach((parte, i) => doc.text(parte, COL_MED.x, base + fila.nombre.length * 4.3 - 0.5 + i * 3.6));

    fuente("bold", 10);
    doc.text(fila.cantidad, COL_CANT.x + COL_CANT.ancho / 2, base, { align: "center" });

    fuente("normal", 9);
    fila.indicacion.forEach((parte, i) => doc.text(parte, COL_IND.x, base + i * INTERLINEA));

    linea(X, y + fila.alto, X + ANCHO, y + fila.alto, GRIS_LINEA, 0.15);
    y += fila.alto;
  };

  // ===== Firma del médico =====
  // Con sello digitalizado lo dibuja el helper común; sin él deja la línea para que el médico firme y selle a mano.
  const firmaManual = (yFirma) => {
    const yLinea = yFirma + 16;
    linea(pageW / 2 - 35, yLinea, pageW / 2 + 35, yLinea, NEGRO, 0.2);
    fuente("normal", 7);
    doc.text("Firma y Sello del Médico", pageW / 2, yLinea + 3.5, { align: "center" });
    if (d.medico) {
      fuente("bold", 8);
      doc.text(d.medico, pageW / 2, yLinea + 8, { align: "center" });
    }
    if (texto(data.cmp)) {
      fuente("normal", 8);
      doc.text(`CMP: ${texto(data.cmp)}`, pageW / 2, yLinea + 12, { align: "center" });
    }
  };

  // ===== Armado del documento =====
  y = (await dibujarEncabezado(1)) + 5.5;

  cuadroDatos([
    [
      { etiqueta: "PACIENTE", valor: d.paciente, ancho: 100, negrita: true },
      { etiqueta: "DNI", valor: data.dni, ancho: 30 },
      { etiqueta: "EDAD", valor: edadTexto(data.edad), ancho: 25 },
      { etiqueta: "SEXO", valor: data.sexo, ancho: 25 },
    ],
    [
      { etiqueta: "EMPRESA", valor: data.empresa, ancho: 100 },
      { etiqueta: "FECHA Y HORA DE EMISIÓN", valor: d.emision, ancho: 80 },
    ],
    [{ etiqueta: "DIAGNÓSTICO", valor: data.diagnostico, ancho: ANCHO }],
    [
      { etiqueta: "MÉDICO TRATANTE", valor: d.medico, ancho: 130 },
      { etiqueta: "CMP", valor: data.cmp, ancho: 50 },
    ],
  ]);

  y += 5;
  marcaRp();
  encabezadoTabla();

  for (const [i, medicamento] of medicamentos.entries()) {
    const fila = medirMedicamento(medicamento);
    await asegurarEspacio(fila.alto);
    dibujarMedicamento(fila, i + 1);
  }

  linea(X, y, X + ANCHO, y, AZUL, 0.4);
  fuente("normal", 7.5, GRIS_TEXTO);
  doc.text(`Total: ${medicamentos.length} ${medicamentos.length === 1 ? "medicamento" : "medicamentos"}`, X + ANCHO, y + 4.5, { align: "right" });
  y += 8;

  // Firma y sello
  await asegurarEspacio(SEPARACION_FIRMAS + ALTO_FIRMAS - 20, false);
  const yFirma = y + SEPARACION_FIRMAS;
  if (hayFirma) await dibujarFirmas({ doc, datos: data, y: yFirma, pageW, mostrarFirmaPaciente: false });
  else firmaManual(yFirma);

  dibujarPie();

  if (docExistente) return doc;
  imprimir(doc);
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
