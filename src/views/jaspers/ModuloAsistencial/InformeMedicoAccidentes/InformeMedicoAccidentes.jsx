import jsPDF from "jspdf";
import HeaderAsistencial from "../../components/headerAsistencial.jsx";
import footerTR from "../../components/footerTR.jsx";
import { formatearFechaLarga } from "../../../utils/formatDateUtils.js";
import { dibujarFirmas } from "../../../utils/dibujarFirmas.js";
import { getSign } from "../../../utils/helpers.js";

// Informe médico de accidentes: declaración del trabajador atendido tras un accidente (diagnóstico,
// tratamiento inicial y circunstancias), con firma y huella del trabajador y sello del médico.
//
// Cabecera y pie: los del módulo asistencial (HeaderAsistencial: N° Ticket, N° Historia Clínica, sede y
// fecha). Cuerpo: el formato de las declaraciones juradas (Consent_Admision_DeclacionAntecePatologicos):
// texto de 11pt justificado con los datos en negrita, listas con guion, "Lugar y fecha" y firmas.
//
// Datos que recibe (objeto plano):
//   numeroTicket, numeroHistoriaClinica, sede, fecha (fecha de atención, yyyy-MM-dd),
//   nombres, apellidos, dni,
//   medico, cmp,
//   diagnosticos      (arreglo o texto con un diagnóstico por línea),
//   tratamiento       (arreglo o texto con una indicación por línea),
//   circunstancias    (texto libre),
//   lugarFirma, fechaFirma (yyyy-MM-dd, por defecto `fecha`),
//   digitalizacion[]  (FIRMAP, HUELLA, SELLOFIRMA...), footerData, codigoColor, textoColor.

const MARGEN = 15;
const FUENTE = 11;
const FUENTE_LISTA = 10;
const INTERLINEADO = 5;
const LIMITE_Y = 272; // último Y utilizable antes del pie de página
const ALTO_FIRMAS = 45;
const PIE_OFFSET_Y = 8;
const SELLOS = ["SELLOFIRMA", "SELLOFIRMADOCASIG", "SELLOFIRMADOCASIG-EXTRA"];

const texto = (v) => String(v ?? "").trim();
const lista = (v) =>
  (Array.isArray(v) ? v : String(v ?? "").split(/\r\n|\r|\n|\\n/g)).map(texto).filter(Boolean);
const fechaLarga = (v) => {
  try {
    return formatearFechaLarga(texto(v));
  } catch {
    return texto(v);
  }
};

export default async function InformeMedicoAccidentes(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const anchoTexto = pageW - 2 * MARGEN;

  const d = {
    nombreCompleto: `${texto(data.apellidos)} ${texto(data.nombres)}`.trim(),
    dni: texto(data.dni),
    medico: texto(data.medico),
    cmp: texto(data.cmp),
    diagnosticos: lista(data.diagnosticos),
    tratamiento: lista(data.tratamiento),
    circunstancias: lista(data.circunstancias),
    lugarFirma: texto(data.lugarFirma),
    fechaFirma: fechaLarga(data.fechaFirma || data.fecha),
  };

  let pagina = 1;
  let y = 0;

  // ===== Páginas =====
  const dibujarEncabezado = (numeroPagina) =>
    HeaderAsistencial(
      doc,
      {
        numeroTicket: data.numeroTicket,
        numeroHistoriaClinica: data.numeroHistoriaClinica,
        sede: data.sede,
        fecha: data.fecha,
        codigoColor: data.codigoColor,
        textoColor: data.textoColor,
      },
      { pagina: numeroPagina, titulo: "INFORME MÉDICO DE ACCIDENTES" }
    );

  const dibujarPie = () => footerTR(doc, { footerData: data, footerOffsetY: PIE_OFFSET_Y });

  const nuevaPagina = async () => {
    dibujarPie();
    doc.addPage();
    pagina += 1;
    y = (await dibujarEncabezado(pagina)) + 9;
  };

  // Si el bloque que sigue no cabe en la página, pasa a una nueva.
  const asegurarEspacio = async (alto) => {
    if (y + alto > LIMITE_Y) await nuevaPagina();
  };

  const fuente = (estilo = "normal", size = FUENTE) =>
    doc.setFont("helvetica", estilo).setFontSize(size).setTextColor(0, 0, 0);

  // ===== Texto justificado con partes en negrita =====
  // Cada parte es { texto, negrita }. Las partes pegadas sin espacio (p. ej. el nombre en negrita y la
  // coma que le sigue) forman una sola palabra para no separarlas al justificar.
  const armarLineas = (partes) => {
    const palabras = [];
    let pegada = false;
    partes.forEach(({ texto: t, negrita }) => {
      const cadena = String(t ?? "");
      for (const m of cadena.matchAll(/\S+/g)) {
        const segmento = { texto: m[0], negrita: Boolean(negrita) };
        if (m.index === 0 && pegada && palabras.length) palabras[palabras.length - 1].push(segmento);
        else palabras.push([segmento]);
      }
      if (cadena) pegada = !/\s$/.test(cadena);
    });

    const anchoPalabra = (palabra) =>
      palabra.reduce((suma, { texto: t, negrita }) => {
        doc.setFont("helvetica", negrita ? "bold" : "normal");
        return suma + doc.getTextWidth(t);
      }, 0);

    doc.setFont("helvetica", "normal");
    const anchoEspacio = doc.getTextWidth(" ");
    const lineas = [];
    let actual = [];
    let ancho = 0;
    palabras.forEach((palabra) => {
      const w = anchoPalabra(palabra);
      const total = actual.length ? ancho + anchoEspacio + w : w;
      if (actual.length && total > anchoTexto) {
        lineas.push(actual);
        actual = [palabra];
        ancho = w;
      } else {
        actual.push(palabra);
        ancho = total;
      }
    });
    if (actual.length) lineas.push(actual);
    return { lineas, anchoPalabra, anchoEspacio };
  };

  const parrafo = async (partes, { x = MARGEN, ancho = anchoTexto } = {}) => {
    fuente("normal");
    const { lineas, anchoPalabra, anchoEspacio } = armarLineas(partes);
    for (const [i, linea] of lineas.entries()) {
      await asegurarEspacio(INTERLINEADO);
      const justificar = i < lineas.length - 1 && linea.length > 1;
      const suma = linea.reduce((s, palabra) => s + anchoPalabra(palabra), 0);
      const espacio = justificar ? (ancho - suma) / (linea.length - 1) : anchoEspacio;
      let xActual = x;
      linea.forEach((palabra) => {
        palabra.forEach(({ texto: t, negrita }) => {
          doc.setFont("helvetica", negrita ? "bold" : "normal");
          doc.text(t, xActual, y);
          xActual += doc.getTextWidth(t);
        });
        xActual += espacio;
      });
      y += INTERLINEADO;
    }
  };

  // Lista con guion y sangría francesa (las líneas que continúan quedan alineadas con el texto).
  const listaConGuion = async (items) => {
    const xGuion = MARGEN + 3;
    const xTexto = MARGEN + 7;
    fuente("normal", FUENTE_LISTA);
    for (const item of items) {
      const lineas = doc.splitTextToSize(item, pageW - MARGEN - xTexto);
      for (const [i, linea] of lineas.entries()) {
        await asegurarEspacio(INTERLINEADO);
        fuente("normal", FUENTE_LISTA);
        if (i === 0) doc.text("-", xGuion, y);
        doc.text(linea, xTexto, y);
        y += INTERLINEADO;
      }
    }
  };

  // ===== Armado del documento =====
  y = (await dibujarEncabezado(1)) + 12;

  // Identificación y médico tratante
  await parrafo([
    { texto: "Yo, " },
    { texto: d.nombreCompleto, negrita: true },
    { texto: ", identificado(a) con N° DNI " },
    { texto: d.dni, negrita: true },
    { texto: ", he sido atendido(a) por el Dr(a). " },
    { texto: d.medico, negrita: true },
    { texto: " con CMP: " },
    { texto: d.cmp, negrita: true },
    { texto: "." },
  ]);
  y += 5;

  // Diagnóstico
  await asegurarEspacio(2 * INTERLINEADO);
  fuente("bold");
  doc.text("Por diagnóstico de:", MARGEN, y);
  y += 6;
  await listaConGuion(d.diagnosticos);
  y += d.diagnosticos.length ? 4 : 10;

  // Tratamiento inicial
  await asegurarEspacio(2 * INTERLINEADO);
  fuente("bold");
  doc.text("Asimismo, se me informa que el tratamiento inicial a seguir es:", MARGEN, y);
  y += 6;
  await listaConGuion(d.tratamiento);
  y += d.tratamiento.length ? 4 : 10;

  // Circunstancias del accidente
  await asegurarEspacio(2 * INTERLINEADO);
  fuente("bold");
  doc.text("Declaro que el accidente fue en las siguientes circunstancias:", MARGEN, y);
  y += 6;
  for (const bloque of d.circunstancias) {
    await parrafo([{ texto: bloque }]);
    y += 1;
  }
  if (!d.circunstancias.length) y += 10;
  y += 8;

  // Lugar y fecha
  await asegurarEspacio(ALTO_FIRMAS + 2 * INTERLINEADO);
  fuente("normal");
  doc.text(`Lugar y fecha: ${[d.lugarFirma, d.fechaFirma].filter(Boolean).join(", ")}.`, MARGEN, y);
  y += 15;

  // Firma y huella del trabajador / sello del médico
  const yFirmas = await dibujarFirmas({ doc, datos: data, y, pageW });

  // DNI bajo la firma del trabajador (su columna depende de cuántos sellos se dibujan).
  const tieneFirmaTrabajador = Boolean(getSign(data, "FIRMAP") || getSign(data, "HUELLA"));
  if (tieneFirmaTrabajador && d.dni) {
    const numSellos = SELLOS.filter((nombre) => getSign(data, nombre)).length;
    fuente("normal", 9);
    doc.text(`DNI: ${d.dni}`, pageW / (2 * (numSellos + 1)), yFirmas + 1.5, { align: "center" });
  }

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
