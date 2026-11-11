import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from "../../components/CabeceraLogo.jsx";
import footerTR from "../../components/footerTR.jsx";

/**
 * Constancia de lectura y entrega de resultados EMO (La Arena).
 *
 * Datos de `GET /api/v01/ct/ocupacional/entrega-resultados/obtenerReporte` (`resultado`):
 *   norden, nombres, apellidos, dni, puestoTrabajo, fechaEmo, tipoEmo, empresa, responsableRegistro,
 *   fechaEntrega, notas, digitalizacion[{ nombreDigitalizacion, url }]  (+ datos del footer).
 */

const MARGIN = 15;
const FILA_ALTURA = 8;
const LINE_HEIGHT = 5;

const urlValida = (d) => Boolean(d?.url) && d.url !== "Sin registro";

const cargarImagen = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar ${url}`));
    img.src = url;
  });

// Carga la imagen de una digitalización; si falla o no existe devuelve null (el documento se imprime igual).
const cargarDigitalizacion = async (digitalizacion, nombre) => {
  const item = digitalizacion.find((d) => d.nombreDigitalizacion === nombre);
  if (!urlValida(item)) return null;
  try {
    return await cargarImagen(item.url);
  } catch (error) {
    console.log(`Error cargando ${nombre}:`, error);
    return null;
  }
};

// Párrafo justificado con partes en negrita: [{ texto, negrita }]. Devuelve la Y siguiente.
const parrafoJustificado = (doc, partes, x, y, anchoMaximo, interlineado) => {
  const palabras = partes.flatMap((parte) =>
    parte.texto
      .split(" ")
      .filter(Boolean)
      .map((texto) => ({ texto, negrita: Boolean(parte.negrita) }))
  );
  const anchoPalabra = (p) => {
    doc.setFont("helvetica", p.negrita ? "bold" : "normal");
    return doc.getTextWidth(p.texto);
  };

  // Armado de líneas por ancho
  const lineas = [];
  let linea = [];
  let anchoLinea = 0;
  palabras.forEach((p) => {
    const ancho = anchoPalabra(p);
    doc.setFont("helvetica", "normal");
    const espacio = linea.length ? doc.getTextWidth(" ") : 0;
    if (linea.length === 0 || anchoLinea + espacio + ancho <= anchoMaximo) {
      linea.push({ ...p, ancho });
      anchoLinea += espacio + ancho;
    } else {
      lineas.push(linea);
      linea = [{ ...p, ancho }];
      anchoLinea = ancho;
    }
  });
  if (linea.length) lineas.push(linea);

  // Dibujo: todas las líneas se justifican menos la última
  doc.setFont("helvetica", "normal");
  const ancoEspacio = doc.getTextWidth(" ");
  let yActual = y;
  lineas.forEach((l, i) => {
    const esUltima = i === lineas.length - 1;
    const anchoPalabras = l.reduce((acc, p) => acc + p.ancho, 0);
    const espacio =
      !esUltima && l.length > 1 ? (anchoMaximo - anchoPalabras) / (l.length - 1) : ancoEspacio;
    let xActual = x;
    l.forEach((p) => {
      doc.setFont("helvetica", p.negrita ? "bold" : "normal");
      doc.text(p.texto, xActual, yActual);
      xActual += p.ancho + espacio;
    });
    yActual += interlineado;
  });
  doc.setFont("helvetica", "normal");
  return yActual;
};

// Texto centrado en una celda, en varias líneas si hace falta.
const textoCentradoCelda = (doc, texto, centroX, centroY, anchoCelda) => {
  const lineas = doc.splitTextToSize(texto, anchoCelda - 4);
  lineas.forEach((linea, idx) => {
    doc.text(linea, centroX, centroY - (lineas.length - 1) * 2 + idx * 4, { align: "center" });
  });
};

const SELLOS = {
  SELLOFIRMA: ["Firma y Sello del Profesional", "Responsable de la Evaluación"],
  SELLOFIRMADOCASIG: ["Firma y Sello Médico Asignado"],
};

export default async function ConstanciaEntregaResultadosEMOLaArena(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const anchoTexto = pageW - 2 * MARGIN;
  const digitalizacion = data?.digitalizacion || [];

  const datos = {
    numeroFicha: String(data?.norden ?? ""),
    apellidosNombres: `${data?.apellidos ?? ""} ${data?.nombres ?? ""}`.trim(),
    dni: String(data?.dni ?? ""),
    puestoTrabajo: String(data?.puestoTrabajo ?? ""),
    empresa: String(data?.empresa ?? ""),
    tipoEmo: String(data?.tipoEmo ?? ""),
    responsableRegistro: String(data?.responsableRegistro ?? ""),
    fechaEmo: formatearFechaCorta(data?.fechaEmo ?? ""),
    fechaEntrega: formatearFechaCorta(data?.fechaEntrega ?? ""),
    notas: String(data?.notas ?? "").trim(),
  };

  // ===== Encabezado =====
  await CabeceraLogo(doc, { tieneMembrete: false, yOffset: 12 });

  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("CONSTANCIA DE LECTURA Y ENTREGA DE RESULTADOS", pageW / 2, 50, { align: "center" });
  doc.text("DE EXÁMENES MÉDICOS OCUPACIONALES", pageW / 2, 57, { align: "center" });

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 70, 15);
  doc.setFontSize(18);
  doc.text(datos.numeroFicha, pageW - 50, 16);
  doc.setFontSize(8);
  doc.text(`Fecha de examen: ${datos.fechaEmo}`, pageW - 70, 22);
  doc.text("Pag. 01", pageW - 25, 8);

  let yPos = 70;

  // ===== Tabla superior: Fecha de EMO, Tipo de EMO, Responsable del Registro =====
  const columnas = [
    { nombre: "Fecha de EMO", valor: datos.fechaEmo },
    { nombre: "Tipo de EMO", valor: datos.tipoEmo },
    { nombre: "Responsable del Registro", valor: datos.responsableRegistro },
  ];
  const anchoCol = anchoTexto / columnas.length;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(MARGIN, yPos, anchoTexto, FILA_ALTURA * 2);
  doc.line(MARGIN, yPos + FILA_ALTURA, MARGIN + anchoTexto, yPos + FILA_ALTURA);
  columnas.forEach((col, i) => {
    const centroX = MARGIN + anchoCol * i + anchoCol / 2;
    if (i > 0) doc.line(MARGIN + anchoCol * i, yPos, MARGIN + anchoCol * i, yPos + FILA_ALTURA * 2);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(col.nombre, centroX, yPos + 4, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(col.valor || "", centroX, yPos + FILA_ALTURA + 4, { align: "center" });
  });
  yPos += FILA_ALTURA * 2 + 10;

  // ===== Texto de conformidad =====
  doc.setFontSize(11);
  yPos = parrafoJustificado(
    doc,
    [
      { texto: "Mediante el presente dejo constancia que el Médico Ocupacional representante de la empresa " },
      { texto: datos.empresa, negrita: true },
      {
        texto:
          " me ha entregado, informado y explicado de manera presencial o por medios digitales los resultados del Examen Médico Ocupacional que se me ha realizado.",
      },
    ],
    MARGIN,
    yPos,
    anchoTexto,
    LINE_HEIGHT
  );
  yPos += 8;

  yPos = parrafoJustificado(
    doc,
    [{ texto: "Así mismo me comprometo a cumplir con las indicaciones y recomendaciones recibidas por parte del médico ocupacional." }],
    MARGIN,
    yPos,
    anchoTexto,
    LINE_HEIGHT
  );
  yPos += 10;

  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.text("Doy conformidad de lo indicado mediante mi firma y/o huella digital:", MARGIN, yPos);
  yPos += 8;

  // ===== Tabla de datos del colaborador =====
  const filasDatos = [
    ["Apellidos y Nombres:", datos.apellidosNombres],
    ["DNI N°", datos.dni],
    ["Puesto de trabajo:", datos.puestoTrabajo],
    ["Fecha de entrega:", datos.fechaEntrega],
  ];
  const anchoEtiqueta = anchoTexto * 0.35;
  const alturaDatos = FILA_ALTURA * filasDatos.length;

  doc.rect(MARGIN, yPos, anchoTexto, alturaDatos);
  doc.line(MARGIN + anchoEtiqueta, yPos, MARGIN + anchoEtiqueta, yPos + alturaDatos);
  doc.setFontSize(8);
  filasDatos.forEach(([etiqueta, valor], i) => {
    const yFila = yPos + FILA_ALTURA * i;
    if (i > 0) doc.line(MARGIN, yFila, MARGIN + anchoTexto, yFila);
    doc.text(etiqueta, MARGIN + 2, yFila + FILA_ALTURA / 2 + 2);
    doc.text(valor || "", MARGIN + anchoEtiqueta + 2, yFila + FILA_ALTURA / 2 + 2);
  });
  yPos += alturaDatos;

  // ===== Notas (solo si se registraron) =====
  if (datos.notas) {
    const lineasNotas = doc.splitTextToSize(datos.notas, anchoTexto - anchoEtiqueta - 4);
    const alturaNotas = Math.max(FILA_ALTURA, lineasNotas.length * 3.8 + 4);
    doc.rect(MARGIN, yPos, anchoTexto, alturaNotas);
    doc.line(MARGIN + anchoEtiqueta, yPos, MARGIN + anchoEtiqueta, yPos + alturaNotas);
    doc.text("Notas:", MARGIN + 2, yPos + FILA_ALTURA / 2 + 2);
    doc.text(lineasNotas, MARGIN + anchoEtiqueta + 2, yPos + 5);
    yPos += alturaNotas;
  }

  // ===== Firma y huella del colaborador =====
  const alturaFirmas = 25;
  const anchoFirmaCol = anchoTexto / 4;
  doc.rect(MARGIN, yPos, anchoTexto, alturaFirmas);
  [1, 2, 3].forEach((i) =>
    doc.line(MARGIN + anchoFirmaCol * i, yPos, MARGIN + anchoFirmaCol * i, yPos + alturaFirmas)
  );

  doc.setFont("helvetica", "normal").setFontSize(8);
  textoCentradoCelda(
    doc,
    "Firma de conformidad del colaborador",
    MARGIN + anchoFirmaCol / 2,
    yPos + alturaFirmas / 2,
    anchoFirmaCol
  );
  textoCentradoCelda(
    doc,
    "Huella digital: (indice derecho) (OPCIONAL)",
    MARGIN + anchoFirmaCol * 2 + anchoFirmaCol / 2,
    yPos + alturaFirmas / 2,
    anchoFirmaCol
  );

  const [firma, huella] = await Promise.all([
    cargarDigitalizacion(digitalizacion, "FIRMAP"),
    cargarDigitalizacion(digitalizacion, "HUELLA"),
  ]);
  if (firma) {
    doc.addImage(firma, "JPEG", MARGIN + anchoFirmaCol + anchoFirmaCol / 2 - 15, yPos + 2, 30, 20);
  }
  if (huella) {
    doc.addImage(huella, "JPEG", MARGIN + anchoFirmaCol * 3 + anchoFirmaCol / 2 - 6, yPos + 2, 12, 20);
  }
  yPos += alturaFirmas + 10;

  // ===== Sello y firma del médico =====
  const sellos = (
    await Promise.all(
      Object.keys(SELLOS).map(async (tipo) => ({ tipo, img: await cargarDigitalizacion(digitalizacion, tipo) }))
    )
  ).filter((s) => s.img);

  if (sellos.length) {
    const selloW = 48;
    const selloH = 20;
    const gap = 16;
    const totalW = selloW * sellos.length + gap * (sellos.length - 1);
    const startX = pageW / 2 - totalW / 2;
    const selloY = yPos + 2;
    const lineaY = selloY + selloH + 3;

    sellos.forEach(({ tipo, img }, i) => {
      const x = startX + i * (selloW + gap);
      const centroX = x + selloW / 2;
      const [texto1, texto2] = SELLOS[tipo];

      doc.addImage(img, "JPEG", x, selloY, selloW, selloH);

      doc.setFont("helvetica", "normal").setFontSize(9);
      const anchoLinea = Math.max(doc.getTextWidth(texto1), texto2 ? doc.getTextWidth(texto2) : 0);
      doc.setLineWidth(0.2);
      doc.line(centroX - anchoLinea / 2, lineaY, centroX + anchoLinea / 2, lineaY);
      doc.text(texto1, centroX, lineaY + 3, { align: "center" });
      if (texto2) doc.text(texto2, centroX, lineaY + 6, { align: "center" });
    });
  }

  footerTR(doc, { footerOffsetY: 8, fontSize: 8 });

  if (!docExistente) {
    imprimir(doc);
  }

  return doc;
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
