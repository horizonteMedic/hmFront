import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import EvaluacionBasicaBoro, { footerTR } from "./EvaluacionMuscoloEsqueletica2021_Digitalizado_boro.jsx";
import headerEvaluacion from "./Headers/Header_EvaluacionMuscoloEsqueletica2021_Digitalizado_boro.jsx";

// Evaluación Músculo Esquelética 2021 - formato MARSA. Orden del reporte:
//  1) Página 1 del formato boro: datos del paciente + evaluación básica (aptitud espalda y rangos articulares).
//  2) Contenido MARSA: descripción de las tareas, columna vertebral (estática y dinámica), evaluación dinámica de
//     articulaciones, puntuación de referencia / descripción de hallazgos y valoración.
//  3) Conclusiones y recomendaciones (tabla propia, sin CIE 10) + firmas.
// Datos MARSA: `data.adicional` (mismas claves que `form.marsaMsk`); cadera/rodilla/tobillo salen de los campos de siempre.

const IMG_PAGINA1 = "/img/Pagina1_EvaluacionMusculoEsqueletica_boro.png";
const IMG_CABECERA = "/img/header_EvaluacionMusculoEsqueletica_boro.png";
// Fondo de la página 1 (boro): solo hasta los rangos articulares; la columna vertebral y las maniobras de
// miembros superiores no van en el reporte MARSA
const TOPE_PAGINA1 = 0.5;

const MARGEN = 10;
const ANCHO = 190;
// El reporte entra en 2 hojas: el contenido llega hasta aquí (debajo va el footer)
const Y_LIMITE = 266;
const ALTO_FIRMA = 27; // alto máximo de las imágenes de firma, huella y sello

// ===== Imágenes =====
// jsPDF incrusta los PNG con transparencia sin comprimir y los decodifica en JavaScript (una página de fondo pesa
// ~17 MB y tarda en generarse, imprimirse y unirse en el Folio). Por eso toda imagen se pasa antes por un canvas:
// se aplana sobre blanco, se limita su ancho y se entrega en JPEG, que jsPDF incrusta tal cual.
const cargarImagen = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.error("Error al cargar la imagen:", url);
      resolve(null);
    };
    img.src = url;
  });

// Devuelve { data, ancho, alto } (ancho/alto originales) o null si no se pudo cargar
const aJpeg = async (url, { desde = 0, hasta = 1, maxAncho = 1700 } = {}) => {
  const img = await cargarImagen(url);
  if (!img) return null;
  const altoOrigen = Math.round((hasta - desde) * img.height);
  const escala = Math.min(1, maxAncho / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * escala);
  canvas.height = Math.round(altoOrigen * escala);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, Math.round(desde * img.height), img.width, altoOrigen, 0, 0, canvas.width, canvas.height);
  return { data: canvas.toDataURL("image/jpeg", 0.9), ancho: img.width, alto: img.height };
};

// Los fondos son fijos: se preparan una sola vez y se reutilizan (p. ej. al generar varias órdenes seguidas)
const fondos = new Map();
const fondoJpeg = (url, opciones) => {
  const clave = url + JSON.stringify(opciones ?? {});
  if (!fondos.has(clave)) {
    fondos.set(clave, aJpeg(url, opciones).then((r) => {
      if (!r) fondos.delete(clave); // si falló se reintenta la próxima vez
      return r?.data;
    }));
  }
  return fondos.get(clave);
};

// Firmas, huella y sello: se descargan en paralelo y se centran en una caja de ALTO_FIRMA mm de alto
const agregarFirmas = async (doc, digitalizacion, firmas) => {
  const urls = Object.fromEntries(digitalizacion.map((d) => [d.nombreDigitalizacion, d.url]));
  const listas = await Promise.all(
    firmas.map(async (f) => ({ ...f, img: urls[f.nombre] ? await aJpeg(urls[f.nombre], { maxAncho: 600 }) : null }))
  );
  listas.filter((f) => f.img).forEach(({ img, x, y, maxw }) => {
    const escala = Math.min(maxw / img.ancho, ALTO_FIRMA / img.alto, 1);
    const w = img.ancho * escala;
    const h = img.alto * escala;
    doc.addImage(img.data, "JPEG", x, y + (ALTO_FIRMA - h) / 2, w, h);
  });
};

const COLUMNAS = [["cervical", "Columna cervical"], ["dorsal", "Columna dorsal"], ["lumbar", "Columna lumbar"]];
const MOV_COLUMNA = ["Flexión", "Extensión", "Lateraliz. Derecha", "Lateraliz. Izquierda", "Rotación Derecha", "Rotación Izquierda", "Irradiación", "Alt. masa Muscular."];
const MOVIMIENTOS = [
  ["abduccion", "Abducc.", "Abduccion"], ["aduccion", "Adducc.", "Aduccion"], ["flexion", "Flexion", "Flexion"],
  ["extension", "Extens.", "Extension"], ["rotacionExterna", "Rot. Ext.", "RotExterna"],
  ["rotacionInterna", "Rot. Int.", "RotInterna"], ["irradiacion", "Irrad.", "Irradiacion"],
  ["altMasaMuscular", "Alt. Masa Muscular.", "MasaMuscular"],
];
// [clave en marsaMsk, etiqueta, prefijo del campo del backend (si ya existía)]
const ARTICULACIONES = [
  ["hombroDerecho", "Hombro derecho"], ["hombroIzquierdo", "Hombro izquierdo"],
  ["codoDerecho", "Codo derecho"], ["codoIzquierdo", "Codo izquierdo"],
  ["munecaDerecha", "Muñeca derecha"], ["munecaIzquierda", "Muñeca izquierda"],
  ["manosDerechas", "Manos y dedos derechos"], ["manosIzquierdas", "Manos y dedos izquierdos"],
  ["caderaDerecha", "Cadera derecha", "caderaDerecha"], ["caderaIzquierda", "Cadera izquierda", "caderaIzquierda"],
  ["rodillaDerecha", "Rodilla derecha", "rodillaDerecha"], ["rodillaIzquierda", "Rodilla izquierda", "rodillaIzquierda"],
  ["tobilloDerecho", "Tobillo derecho", "tobilloDerecho"], ["tobilloIzquierdo", "Tobillo izquierdo", "tobilloIzquierdo"],
];
const GRADOS = [
  "Grado 0 Ausencia de signos y síntomas",
  "Grado 1 Contractura y/o dolor a la movilización",
  "Grado 2 Grado 1 más dolor a la palpación y/o percusión",
  "Grado 3 Grado 2 más limitación funcional evidente clínicamente",
  "Grado 4 Dolor en reposo",
];

const ESTILO_TABLA = {
  theme: "grid",
  styles: { fontSize: 7, cellPadding: 0.8, lineColor: [0, 0, 0], lineWidth: 0.2, textColor: [0, 0, 0], valign: "middle", halign: "center" },
  headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: "bold", lineColor: [0, 0, 0], lineWidth: 0.2 },
  margin: { top: 28, left: MARGEN, right: MARGEN, bottom: 297 - Y_LIMITE },
};

// Las "X" se pintan en azul, como en el resto de formatos boro
const pintarX = (d) => {
  if (d.section === "body" && d.cell.raw === "X") {
    d.cell.styles.textColor = [0, 0, 255];
    d.cell.styles.fontStyle = "bold";
  }
};

const marca = (cond) => (cond ? "X" : "");

// Casilla con (o sin) X
const casilla = (doc, x, y, marcada) => {
  doc.setDrawColor(0, 0, 0).setLineWidth(0.25);
  doc.rect(x, y, 3.6, 3.6);
  if (marcada) {
    doc.setTextColor(0, 0, 255).setFont("helvetica", "bold").setFontSize(8);
    doc.text("X", x + 1.8, y + 3, { align: "center" });
    doc.setTextColor(0, 0, 0).setFont("helvetica", "normal").setFontSize(7);
  }
};

// Bloque "DESCRIPCIÓN DE LAS TAREAS" (dos columnas con casillas). Devuelve el Y donde termina.
const dibujarTareas = (doc, m, y0) => {
  const colW = ANCHO / 2;
  const xL = MARGEN;
  const xR = MARGEN + colW;
  const fila = 4.3;
  const tituloH = 5.5;

  // Título general
  doc.setFillColor(217, 217, 217).setDrawColor(0, 0, 0).setLineWidth(0.25);
  doc.rect(MARGEN, y0, ANCHO, 6.5, "FD");
  doc.setFont("helvetica", "bold").setFontSize(7.5).setTextColor(0, 0, 0);
  doc.text("DESCRIPCIÓN DE LAS TAREAS  (ACTIVIDADES RELACIONADAS AL PUESTO DE TRABAJO)", MARGEN + ANCHO / 2, y0 + 4.4, { align: "center" });

  const bloque = (x, y, w, titulo, extra, items) => {
    const h = tituloH + items.length * fila + 1.5;
    doc.setFillColor(237, 237, 237);
    doc.rect(x, y, w, tituloH, "FD");
    doc.rect(x, y, w, h);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(titulo, x + 2, y + 4);
    if (extra) {
      doc.setFont("helvetica", "normal");
      doc.text(extra, x + 2 + doc.getTextWidth(titulo) + 6, y + 4);
    }
    doc.setFont("helvetica", "normal").setFontSize(7);
    items.forEach(([texto, marcada], i) => {
      const yy = y + tituloH + 3.2 + i * fila;
      doc.text(texto, x + 4, yy);
      casilla(doc, x + w - 8, yy - 3, marcada);
    });
    return h;
  };

  const y1 = y0 + 6.5;
  const h1 = Math.max(tituloH + 5 * fila + 1.5, tituloH + 3 * fila + 1.5);
  const hA = bloque(xL, y1, colW, "TIEMPO DE TAREA", `Número de horas/día en el trabajo:  ${m.horasDia ?? ""}`, [
    ["- Esporádico:  < 2 horas", m.tiempoTarea === "esporadico"],
    ["- Continuo:  > 2 horas  y  < 4 horas", m.tiempoTarea === "continuo2a4"],
    ["- Continuo:  > 4 horas", m.tiempoTarea === "continuo4"],
  ]);
  bloque(xR, y1, colW, "TIEMPO DE TAREA", "", [
    ["- Movimiento de hombro y cintura escapular", !!m.movHombro],
    ["- Movimiento de pronosupinación en codo y/o muñeca", !!m.movPronosupinacion],
    ["- Repetidas extensiones y flexiones de muñeca", !!m.repetidas],
    ["- Trabajos contra resistencia", !!m.contraResistencia],
    ["- Otros    POSTURAS FORZADAS", !!m.posturasForzadas],
  ]);
  // El bloque izquierdo se estira al alto del derecho
  if (hA < h1) doc.rect(xL, y1, colW, h1);

  const y2 = y1 + h1;
  const h2 = tituloH + 3 * fila + 1.5;
  bloque(xL, y2, colW, "CICLO DE TRABAJO", "", [
    ["- Largo:  > a 2 minutos", m.ciclo === "largo"],
    ["- Moderado:  30 segundos - 1 a 2 minutos", m.ciclo === "moderado"],
    ["- Corto:  hasta 30 segundos", m.ciclo === "corto"],
  ]);
  bloque(xR, y2, colW, "MANIPULACIÓN MANUAL DE CARGAS", "", [
    ["- < de  1 Kg", m.carga === "menor1"],
    ["- Entre  1 Kg  y  3 Kg", m.carga === "entre1y3"],
    ["- > de  3 Kg", m.carga === "mayor3"],
  ]);
  return y2 + h2;
};

export default async function EvaluacionMuscoloEsqueletica2021_Marsa(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageH = doc.internal.pageSize.getHeight();
  const m = data.adicional || {};

  // En el Folio `doc` ya trae otros reportes: cabecera, numeración y footer se cuentan desde la hoja donde empieza este
  const paginaInicial = doc.internal.getCurrentPageInfo().pageNumber;
  const cabecera = () => headerEvaluacion(doc, data, false, doc.internal.getNumberOfPages() - paginaInicial + 1);
  const nuevaPagina = () => {
    doc.addPage();
    cabecera();
    return 28;
  };
  // Cada bloque se mantiene completo: si no entra en lo que queda de la hoja, empieza en una nueva
  const yPara = (yDeseada, alto) => (yDeseada + alto <= Y_LIMITE ? yDeseada : nuevaPagina());
  const opcionesTabla = {
    ...ESTILO_TABLA,
    didParseCell: pintarX,
    // `pageNumber` es la hoja dentro de la tabla: solo hace falta la cabecera si la tabla continúa en otra
    didDrawPage: (d) => {
      if (d.pageNumber > 1) cabecera();
    },
  };

  // === 1) Página 1 (datos del paciente + evaluación básica: aptitud espalda y rangos articulares) ===
  const [fondoPagina1, fondoCabecera] = await Promise.all([
    fondoJpeg(IMG_PAGINA1, { hasta: TOPE_PAGINA1 }),
    fondoJpeg(IMG_CABECERA),
  ]);
  await EvaluacionBasicaBoro(data, doc, {
    marsa: true,
    fondoPagina1,
    fondoCabecera,
    fondoPagina1Alto: TOPE_PAGINA1 * 0.85 * pageH,
  });

  // === 2) Contenido MARSA, debajo de las pruebas de la página 2 ===
  // La página 1 usa el 85% inferior de la hoja; el fondo recortado termina aquí
  let y = 0.15 * pageH + TOPE_PAGINA1 * 0.85 * pageH + 3;

  y = dibujarTareas(doc, m, y) + 3;

  // Evaluación estática de columna vertebral
  const estatica = COLUMNAS.map(([c, nombre]) => [
    nombre,
    marca(m[`${c}Lateral`] === "normal"), marca(m[`${c}Lateral`] === "concavidadDerecha"), marca(m[`${c}Lateral`] === "concavidadIzquierda"),
    marca(m[`${c}AnteroPosterior`] === "normal"), marca(m[`${c}AnteroPosterior`] === "aumentada"), marca(m[`${c}AnteroPosterior`] === "disminuida"),
    marca(m[`${c}Apofisis`]), marca(m[`${c}Contractura`]),
  ]);
  autoTable(doc, {
    ...opcionesTabla,
    startY: yPara(y, 30),
    head: [
      [{ content: "COLUMNA VERTEBRAL", colSpan: 9 }],
      [
        { content: "EVALUACIÓN\nESTÁTICA", rowSpan: 2 },
        { content: "DESVIACIONES DEL EJE LATERAL", colSpan: 3 },
        { content: "DESVIACIÓN DEL EJE ANTERO-POSTERIOR", colSpan: 3 },
        { content: "PALPACIÓN", colSpan: 2 },
      ],
      ["Normal", "Concavidad derecha", "Concavidad izquierda", "Normal", "Aumentada", "Disminuida", "Apóf. espinosas dolorosas", "Contractura Muscular"],
    ],
    body: estatica,
    columnStyles: { 0: { halign: "left", fontStyle: "bold", cellWidth: 30 } },
  });

  // Evaluación dinámica de columna vertebral
  autoTable(doc, {
    ...opcionesTabla,
    startY: yPara(doc.lastAutoTable.finalY + 3, 22),
    head: [
      [{ content: "EVALUACIÓN\nDINÁMICA", rowSpan: 2 }, { content: "MOVILIDAD - DOLOR", colSpan: 8 }],
      MOV_COLUMNA,
    ],
    body: COLUMNAS.map(([c, nombre]) => [nombre, ...MOV_COLUMNA.map((_, i) => m[`${c}Din${i}`] ?? "")]),
    columnStyles: { 0: { halign: "left", fontStyle: "bold", cellWidth: 30 } },
  });

  // Evaluación dinámica de articulaciones (hombro/codo/muñeca/manos desde marsaMsk; el resto, campos de siempre)
  const valorArticulacion = ([clave, , prefijo], [mov, , sufijo]) =>
    prefijo ? (data[`${prefijo}${sufijo}`] ?? "") : (m[`${clave}_${mov}`] ?? "");
  autoTable(doc, {
    ...opcionesTabla,
    startY: yPara(doc.lastAutoTable.finalY + 3, 72),
    head: [
      [{ content: "EVALUACIÓN\nDINÁMICA DE ARTICULACIONES", rowSpan: 2 }, { content: "MOVILIDAD - DOLOR", colSpan: 8 }],
      MOVIMIENTOS.map(([, titulo]) => titulo),
    ],
    body: ARTICULACIONES.map((art) =>
      [art[1], ...MOVIMIENTOS.map((mov) => {
        // Rodilla: abducción y aducción no aplican
        if (art[0].startsWith("rodilla") && (mov[0] === "abduccion" || mov[0] === "aduccion")) {
          return { content: "No Aplica", styles: { fillColor: [51, 51, 51], textColor: [255, 255, 255], fontStyle: "bold" } };
        }
        return valorArticulacion(art, mov);
      })]
    ),
    columnStyles: { 0: { halign: "left", fontStyle: "bold", cellWidth: 38 } },
  });

  // Puntuación de referencia / descripción de hallazgos (un campo por grado)
  autoTable(doc, {
    ...opcionesTabla,
    startY: doc.lastAutoTable.finalY + 3,
    head: [["PUNTUACIÓN DE REFERENCIA (SIGNOS Y SÍNTOMAS)", "DESCRIPCIÓN DE HALLAZGOS"]],
    body: GRADOS.map((g, i) => [g, m[`hallazgoGrado${i}`] ?? ""]),
    columnStyles: { 0: { halign: "left", fontStyle: "bold", cellWidth: 95 }, 1: { halign: "left" } },
  });

  // === 3) Conclusiones y recomendaciones + firmas (bloque del formato boro) ===
  // Valoración (apto / no apto / en observación)
  const yVal = yPara(doc.lastAutoTable.finalY + 3, 8);
  doc.setDrawColor(0, 0, 0).setLineWidth(0.2).setTextColor(0, 0, 0);
  doc.rect(MARGEN, yVal, ANCHO, 8);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("VALORACIÓN", MARGEN + 3, yVal + 5.2);
  [["APTO", "apto"], ["NO APTO", "noApto"], ["EN OBSERVACIÓN", "observacion"]].forEach(([texto, valor], i) => {
    const x = MARGEN + 45 + i * 52;
    doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(0, 0, 0);
    doc.text(texto, x, yVal + 5.2);
    casilla(doc, x + doc.getTextWidth(texto) + 3, yVal + 2, m.valoracion === valor);
  });
  // Bloque final: título (3) + tabla (alto variable) + firmas (35). Mínimo con una tabla de 24 mm
  const RESTO_BLOQUE = 3 + 35;
  const yConc = yPara(yVal + 8 + 5, RESTO_BLOQUE + 24);

  // La tabla crece con el texto hasta donde alcance la hoja; si aun así no entra, se reduce la letra
  const anchoTexto = ANCHO / 2 - 6;
  const maxAltoTabla = Y_LIMITE - yConc - RESTO_BLOQUE;
  const textos = [data.conclusiones || "", data.recomendaciones || ""];
  const altoNecesario = (tamano) => {
    doc.setFont("helvetica", "normal").setFontSize(tamano);
    const lineas = Math.max(...textos.map((t) => doc.splitTextToSize(t, anchoTexto).length));
    return 12 + lineas * tamano * 0.41;
  };
  let tamanoTexto = 8;
  while (tamanoTexto > 5 && altoNecesario(tamanoTexto) > maxAltoTabla) tamanoTexto -= 0.5;
  const altoTabla = Math.min(Math.max(altoNecesario(tamanoTexto), 36), maxAltoTabla);

  // Título de la sección
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(0, 0, 0);
  doc.text("V.- CONCLUSIONES Y RECOMENDACIONES:", MARGEN, yConc);

  // Tabla de conclusiones y recomendaciones (sin columna CIE 10)
  const yTabla = yConc + 3;
  doc.setDrawColor(0, 0, 0).setLineWidth(0.25);
  doc.rect(MARGEN, yTabla, ANCHO, altoTabla);
  doc.line(MARGEN + ANCHO / 2, yTabla, MARGEN + ANCHO / 2, yTabla + altoTabla);
  doc.line(MARGEN, yTabla + 7, MARGEN + ANCHO, yTabla + 7);
  doc.setFont("helvetica", "bold").setFontSize(8.5);
  doc.text("CONCLUSIONES", MARGEN + ANCHO / 4, yTabla + 4.8, { align: "center" });
  doc.text("RECOMENDACIONES - RESTRICCIONES", MARGEN + (ANCHO * 3) / 4, yTabla + 4.8, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(tamanoTexto);
  textos.forEach((t, i) => {
    doc.text(t, MARGEN + (ANCHO / 2) * i + 3, yTabla + 11, { maxWidth: anchoTexto });
  });

  // Líneas y rótulos de firmas
  const yLinea = yTabla + altoTabla + 30;
  doc.setLineWidth(0.8);
  doc.line(MARGEN + 16, yLinea, MARGEN + 84, yLinea);
  doc.line(MARGEN + 108, yLinea, MARGEN + 176, yLinea);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Firma del Trabajador - Huella digital", MARGEN + 50, yLinea + 4, { align: "center" });
  doc.text("Firma y Sello del Médico Evaluador", MARGEN + 142, yLinea + 4, { align: "center" });

  // Footer en las hojas de este reporte (la última queda activa para pintar las firmas)
  const totalPaginas = doc.internal.getNumberOfPages();
  for (let i = paginaInicial; i <= totalPaginas; i++) {
    doc.setPage(i);
    footerTR(doc, data);
  }
  doc.setPage(totalPaginas);
  // Las imágenes de firma van justo encima de sus líneas
  await agregarFirmas(doc, data?.digitalizacion || [], [
    { nombre: "FIRMAP", x: MARGEN + 20, y: yLinea - ALTO_FIRMA - 1, maxw: 50 },
    { nombre: "HUELLA", x: MARGEN + 82, y: yLinea - ALTO_FIRMA - 1, maxw: 15 },
    { nombre: "SELLOFIRMA", x: MARGEN + 118, y: yLinea - ALTO_FIRMA - 1, maxw: 50 },
  ]);

  if (docExistente) return doc;
  const blob = doc.output("blob");
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = URL.createObjectURL(blob);
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
