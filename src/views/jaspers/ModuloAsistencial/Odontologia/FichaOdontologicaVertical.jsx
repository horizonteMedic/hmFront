import jsPDF from "jspdf";
import CabeceraLogo from "../../components/CabeceraLogo.jsx";
import drawColorBox from "../../components/ColorBox.jsx";
import { formatearTicketAsistencial } from "../../../utils/ticketAsistencial";
import { compressImage, convertirGenero } from "../../../utils/helpers.js";
import {
  HALLAZGOS_BUCALES,
  piezasConEstado,
} from "../../../admin/panel-de-control/ModuloAsistencial/Odontologia/estadosOdontograma.js";
import { drawEstadisticas, drawLeyenda, estadosDeDientes, ICONO_PNG } from "./OdontogramaDigitalizado/leyendaYTotales.js";
import { dibujarEstadoVectorial, tieneDibujoVectorial } from "./OdontogramaDigitalizado/estadosVectoriales.js";

// Ficha Médica Odontológica (A4 VERTICAL) de un ticket. Es la Ficha Odontológica Asistencial (OdontogramaAsistencial,
// horizontal) con la sección "2.- Observaciones" de la ficha en papel y, antes del punto 1, los datos personales del
// paciente (nombres y apellidos, DNI, edad, sexo, empresa y cargo): la ficha horizontal ya no los imprime, los lleva solo esta.
// Recibe lo que arma PrintFichaOdontologica (controller del formulario) a partir de
// GET /api/odontogramas-asistencial/ticket/{numeroTicket}/reporte (OdontogramaHistorialReporteDTO): numeroTicket, nombres, dni,
// edad, sexo, empresa, sede, fechaOd, lbl11..lbl48, txtObservaciones, procedimiento, piezasConCaries, piezasAusentes, los 6
// hallazgos (gingivitis, sarroDental, placaBacteriana, periodontitis, necrosisPulpar, remanenteRadicularPresente), más
// `cargo` (el reporte no lo trae: el controller lo toma del ticket) y `digitalizacion` (firmas/sello).

const FONT = "helvetica";
const X = 15; // margen izquierdo
const ANCHO = 180; // ancho útil (A4 vertical = 210 mm, márgenes de 15)
const CONTENIDO_Y = 38; // donde empieza el contenido bajo la cabecera
const Y_MAX = 282; // límite inferior del contenido (la ficha no lleva pie de página); más abajo se abre otra página

const texto = (valor) => String(valor ?? "").trim();

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  const valor = texto(fecha);
  if (!valor || valor.includes("/")) return valor;
  const [anio, mes, dia] = valor.split("-");
  if (!anio || !mes || !dia) return valor;
  return `${dia.slice(0, 2)}/${mes}/${anio}`;
};

// Alto (mm) de una línea de texto con la fuente actual
const altoLinea = (doc) => doc.getLineHeight() / doc.internal.scaleFactor;

// ===== Cabecera =====
// Logo, N° de ticket, sede, fecha de examen y página (como la ficha horizontal).
const drawHeader = async (doc, datos = {}, pagina = 1) => {
  const pageW = doc.internal.pageSize.getWidth();
  const x = pageW - 80;

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false, yOffset: 10 });

  doc.setTextColor(0, 0, 0);
  const etiquetaTicket = "N° Ticket:";
  doc.setFont(FONT, "normal").setFontSize(8);
  doc.text(etiquetaTicket, x, 15);
  const xTicket = x + doc.getTextWidth(etiquetaTicket) + 2; // se mide con la fuente de la etiqueta (8 pt)
  doc.setFont(FONT, "bold").setFontSize(18);
  doc.text(formatearTicketAsistencial(datos.numeroTicket ?? datos.norden), xTicket, 16);

  doc.setFont(FONT, "normal").setFontSize(8);
  doc.text(`Sede: ${texto(datos.sede || datos.nombreSede)}`, x, 20);
  const fechaExamen = datos.fechaExamen || datos.fechaRegistro || datos.fecha || datos.fechaOd || "";
  doc.text(`Fecha de examen: ${toDDMMYYYY(fechaExamen)}`, x, 25);
  doc.text(`Pag. ${String(pagina).padStart(2, "0")}`, pageW - 30, 10);

  // Bloque de color
  if (datos.color && datos.textoColor) {
    drawColorBox(doc, {
      color: datos.codigoColor || "#008f39",
      text: datos.textoColor,
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9,
    });
  }
};

// Si lo que sigue (`necesario` mm) no cabe en la página, abre otra con su cabecera; devuelve la Y donde sigue el contenido.
const asegurarEspacio = async (doc, datos, y, necesario) => {
  if (y + necesario <= Y_MAX) return y;
  doc.addPage();
  await drawHeader(doc, datos, doc.internal.getNumberOfPages());
  return CONTENIDO_Y;
};

// ===== Datos personales =====
// Los mismos datos que imprimía la ficha horizontal más el cargo, en un cuadro de 3 renglones bajo el título: nombres y
// apellidos / DNI, edad y sexo / empresa y cargo (lado a lado). Los valores pasan a otra línea si no caben. Devuelve la Y
// donde termina el cuadro.
const PAD_DATOS = 1.6; // margen interno del cuadro
const FILA_DATOS = 4.4; // alto de cada renglón
const BASE_DATOS = 3.3; // línea base del texto dentro del renglón

// Posición del valor tras su etiqueta (en negrita) y líneas en que se parte para que quepa en `ancho`
const medirDato = (doc, etiqueta, valor, ancho) => {
  doc.setFont(FONT, "bold").setFontSize(8);
  const xValor = doc.getTextWidth(etiqueta) + 1.5;
  doc.setFont(FONT, "normal").setFontSize(8);
  return { xValor, lineas: doc.splitTextToSize(valor, ancho - xValor) };
};

const drawDatosPersonales = (doc, datos, y) => {
  const x0 = X + PAD_DATOS;
  const anchoUtil = ANCHO - 2 * PAD_DATOS;
  const edadNumero = texto(datos.edad || datos.edadOd).replace(/\s*años$/i, "");
  const edad = edadNumero ? `${edadNumero} AÑOS` : "";

  const nombres = medirDato(doc, "Nombres y Apellidos:", texto(datos.nombres), anchoUtil);
  // Empresa (60 % del ancho) y cargo (el resto) comparten el último renglón
  const anchoEmpresa = anchoUtil * 0.6;
  const empresa = medirDato(doc, "Empresa:", texto(datos.empresa), anchoEmpresa - 3);
  const cargo = medirDato(doc, "Cargo:", texto(datos.cargo), anchoUtil - anchoEmpresa);
  const lineaExtra = altoLinea(doc); // cada línea adicional cuando un valor se parte
  const altoNombres = FILA_DATOS + (Math.max(1, nombres.lineas.length) - 1) * lineaExtra;
  const altoLaboral = FILA_DATOS + (Math.max(1, empresa.lineas.length, cargo.lineas.length) - 1) * lineaExtra;
  const alto = 2 * PAD_DATOS + altoNombres + FILA_DATOS + altoLaboral;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(X, y, ANCHO, alto);
  doc.setTextColor(0, 0, 0);

  // Etiqueta en negrita y su valor a continuación (una sola línea)
  const par = (etiqueta, valor, x, yBase) => {
    doc.setFont(FONT, "bold").setFontSize(8);
    doc.text(etiqueta, x, yBase);
    doc.setFont(FONT, "normal").setFontSize(8);
    doc.text(valor, x + doc.getTextWidth(etiqueta) + 1.5, yBase);
  };

  let yFila = y + PAD_DATOS;
  doc.setFont(FONT, "bold").setFontSize(8);
  doc.text("Nombres y Apellidos:", x0, yFila + BASE_DATOS);
  doc.setFont(FONT, "normal").setFontSize(8);
  doc.text(nombres.lineas, x0 + nombres.xValor, yFila + BASE_DATOS);
  yFila += altoNombres;

  // DNI | Edad | Sexo, en tres columnas iguales
  const columna = anchoUtil / 3;
  par("DNI:", texto(datos.dni), x0, yFila + BASE_DATOS);
  par("Edad:", edad, x0 + columna, yFila + BASE_DATOS);
  par("Sexo:", convertirGenero(datos.sexo), x0 + 2 * columna, yFila + BASE_DATOS);
  yFila += FILA_DATOS;

  // Empresa (izquierda) y cargo (derecha)
  doc.setFont(FONT, "bold").setFontSize(8);
  doc.text("Empresa:", x0, yFila + BASE_DATOS);
  doc.text("Cargo:", x0 + anchoEmpresa, yFila + BASE_DATOS);
  doc.setFont(FONT, "normal").setFontSize(8);
  doc.text(empresa.lineas, x0 + empresa.xValor, yFila + BASE_DATOS);
  doc.text(cargo.lineas, x0 + anchoEmpresa + cargo.xValor, yFila + BASE_DATOS);

  return y + alto;
};

const tituloSeccion = (doc, titulo, y) => {
  doc.setTextColor(0, 0, 0);
  doc.setFont(FONT, "bold").setFontSize(9);
  doc.text(titulo, X, y);
};

// ===== 1.- Odontograma =====
// Posiciones de los dientes sobre la imagen del odontograma comprimida a 600 px de ancho (x, y, ancho y alto en px de esa
// imagen; se escalan al tamaño con que se dibuja). 1-16 = arcada superior, 17-32 = inferior (reflejo de espejo).
const POSICIONES_DIENTES = {
  1: { x: 45, y: 415, width: 50, height: 50 },
  2: { x: 47, y: 350, width: 47, height: 47 },
  3: { x: 65, y: 275, width: 45, height: 45 },
  4: { x: 87, y: 210, width: 43, height: 43 },
  5: { x: 109, y: 155, width: 40, height: 40 },
  6: { x: 140, y: 100, width: 37, height: 37 },
  7: { x: 193, y: 62, width: 34, height: 34 },
  8: { x: 250, y: 42, width: 40, height: 40 },

  9: { x: 325, y: 42, width: 40, height: 40 },
  10: { x: 385, y: 62, width: 34, height: 34 },
  11: { x: 440, y: 100, width: 37, height: 37 },
  12: { x: 465, y: 155, width: 40, height: 40 },
  13: { x: 490, y: 210, width: 43, height: 43 },
  14: { x: 510, y: 275, width: 45, height: 45 },
  15: { x: 520, y: 350, width: 47, height: 47 },
  16: { x: 525, y: 415, width: 50, height: 50 },

  17: { x: 45, y: 585, width: 50, height: 50 },
  18: { x: 60, y: 660, width: 47, height: 47 },
  19: { x: 70, y: 730, width: 45, height: 45 },
  20: { x: 100, y: 795, width: 43, height: 43 },
  21: { x: 125, y: 847, width: 40, height: 40 },
  22: { x: 165, y: 890, width: 37, height: 37 },
  23: { x: 215, y: 920, width: 34, height: 34 },
  24: { x: 265, y: 933, width: 34, height: 34 },

  25: { x: 320, y: 933, width: 34, height: 34 },
  26: { x: 370, y: 920, width: 34, height: 34 },
  27: { x: 415, y: 890, width: 37, height: 37 },
  28: { x: 448, y: 847, width: 40, height: 40 },
  29: { x: 475, y: 795, width: 43, height: 43 },
  30: { x: 500, y: 730, width: 45, height: 45 },
  31: { x: 510, y: 660, width: 47, height: 47 },
  32: { x: 525, y: 585, width: 50, height: 50 },
};

// Dibuja la imagen del odontograma dentro de la caja `{ x, y, ancho, alto }` (mm), sin deformarla y centrada, y sobre ella el
// ícono de cada diente que no esté Normal. Devuelve la Y donde termina la imagen.
const drawOdontograma = async (doc, datos, caja) => {
  let compressedDataUrl;
  let img;
  try {
    compressedDataUrl = await compressImage("/img/odonto/dientes.webp", 0.7, 600);
    if (!compressedDataUrl) {
      console.warn("No se pudo cargar la imagen del odontograma");
      return caja.y;
    }
    img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = compressedDataUrl;
    });
  } catch (error) {
    console.error("Error al cargar el odontograma:", error);
    return caja.y;
  }

  // mm por píxel de la imagen comprimida (no se agranda más de lo original)
  const scale = Math.min(caja.ancho / img.width, caja.alto / img.height, 1);
  const imgWidth = img.width * scale;
  const imgHeight = img.height * scale;
  const xPos = caja.x + (caja.ancho - imgWidth) / 2;
  const yPos = caja.y;
  doc.addImage(compressedDataUrl, "JPEG", xPos, yPos, imgWidth, imgHeight);

  // Los estados con ícono PNG están en ICONO_PNG (leyendaYTotales); el resto se dibuja con trazos (estadosVectoriales).
  const datosDientes = estadosDeDientes(datos);
  const iconos = new Map(); // cada ícono se carga una sola vez
  const cargarIcono = async (nombre) => {
    if (!iconos.has(nombre)) {
      iconos.set(
        nombre,
        compressImage(`/img/iconos_odonto/Icon_${nombre}.png`, 0.8, 100).catch((error) => {
          console.log(`Error al cargar icono ${nombre}:`, error);
          return null;
        })
      );
    }
    return iconos.get(nombre);
  };

  for (let i = 1; i <= 32; i++) {
    const tipoDiente = datosDientes[`d${i}`];
    const base = POSICIONES_DIENTES[i];
    if (!tipoDiente || tipoDiente === "Normal" || !base) continue;

    const nombreIcono = ICONO_PNG[tipoDiente];
    if (!nombreIcono && !tieneDibujoVectorial(tipoDiente)) continue;

    const iconX = xPos + base.x * scale;
    const iconY = yPos + base.y * scale;
    const iconW = base.width * scale;
    const iconH = base.height * scale;

    if (!nombreIcono) {
      dibujarEstadoVectorial(doc, tipoDiente, iconX, iconY, iconW, iconH);
      continue;
    }
    const icono = await cargarIcono(nombreIcono);
    if (icono) doc.addImage(icono, "PNG", iconX, iconY, iconW, iconH);
  }

  return yPos + imgHeight;
};

// Cuadro con título y texto que crece con los saltos de línea (Procedimiento). Devuelve la Y donde termina.
const drawCuadroTexto = (doc, titulo, valor, y, { x, ancho }) => {
  let yPos = y + 4;
  doc.setTextColor(0, 0, 0);
  doc.setFont(FONT, "bold").setFontSize(8);
  doc.text(titulo, x, yPos);
  yPos += 3;

  doc.setFont(FONT, "normal").setFontSize(8);
  const lineas = doc.splitTextToSize(texto(valor) || "-", ancho - 4);
  const alto = Math.max(10, lineas.length * altoLinea(doc) + 4);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(x, yPos, ancho, alto);
  doc.text(lineas, x + 2, yPos + 4);
  return yPos + alto;
};

// Sección 1: odontograma a la izquierda; a la derecha leyenda, totales y procedimiento. Devuelve la Y donde sigue el contenido.
const drawSeccionOdontograma = async (doc, datos, y) => {
  tituloSeccion(doc, "1.- Odontograma", y);

  const cajaOdonto = { x: X, y: y + 3, ancho: 66, alto: 104 };
  const yOdonto = await drawOdontograma(doc, datos, cajaOdonto);

  // Columna derecha (2 columnas): el borde de la leyenda sale 2 mm hacia fuera de [inicioX, inicioX + ancho], por eso el
  // ancho se calcula para que ese borde llegue justo al margen derecho.
  const inicioX = X + cajaOdonto.ancho + 8;
  const zona = { inicioX, ancho: X + ANCHO - 2 - inicioX, columnas: 2 };
  const yLeyenda = await drawLeyenda(doc, datos, y, zona);
  const yTotales = drawEstadisticas(doc, datos, yLeyenda, zona);
  const yProcedimiento = drawCuadroTexto(doc, "Procedimiento:", datos.procedimiento, yTotales, { x: zona.inicioX, ancho: zona.ancho });

  return Math.max(yOdonto, yProcedimiento);
};

// ===== 2.- Observaciones =====
const ETIQUETA_W = 32; // ancho de la columna de etiquetas
const FILA_GAP = 1.5;
const LADO_CASILLA = 6;
const ALTO_FILA_HALLAZGOS = 9;

// Líneas y alto (mm) del cuadro de una fila de texto
const medirFila = (doc, valor, minAlto) => {
  doc.setFont(FONT, "normal").setFontSize(8);
  const lineas = doc.splitTextToSize(texto(valor), ANCHO - ETIQUETA_W - 4);
  return { lineas, alto: Math.max(minAlto, lineas.length * altoLinea(doc) + 3.5) };
};

// Las listas de piezas las calcula el backend; si no vinieran (null) se sacan de las 32 piezas del propio reporte.
const filasObservaciones = (datos) => {
  const dientes = estadosDeDientes(datos);
  return [
    { etiqueta: "Piezas con Caries:", valor: datos.piezasConCaries ?? piezasConEstado(dientes, "cariada"), minAlto: 7 },
    { etiqueta: "Piezas ausentes:", valor: datos.piezasAusentes ?? piezasConEstado(dientes, "ausente"), minAlto: 7 },
    { etiqueta: "Otros:", valor: datos.txtObservaciones, minAlto: 12 },
  ];
};

const alturaObservaciones = (doc, datos) =>
  6 +
  filasObservaciones(datos).reduce((suma, { valor, minAlto }) => suma + medirFila(doc, valor, minAlto).alto + FILA_GAP, 0) +
  3 +
  Math.ceil(HALLAZGOS_BUCALES.length / 3) * ALTO_FILA_HALLAZGOS;

// Piezas con caries, piezas ausentes y otros en cuadros; debajo los 6 hallazgos con su casilla (X si está marcado).
const drawObservaciones = (doc, datos, y) => {
  tituloSeccion(doc, "2.- Observaciones", y);
  let yPos = y + 3;

  filasObservaciones(datos).forEach(({ etiqueta, valor, minAlto }) => {
    const { lineas, alto } = medirFila(doc, valor, minAlto);
    doc.setTextColor(0, 0, 0);
    doc.setFont(FONT, "bold").setFontSize(8);
    doc.text(etiqueta, X + 2, yPos + 4.6);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(X + ETIQUETA_W, yPos, ANCHO - ETIQUETA_W, alto);
    doc.setFont(FONT, "normal").setFontSize(8);
    doc.text(lineas, X + ETIQUETA_W + 2, yPos + 4.2);
    yPos += alto + FILA_GAP;
  });

  // Hallazgos: 3 por fila, etiqueta a la izquierda y casilla a su derecha (alineadas entre filas)
  yPos += 3;
  const anchoColumna = ANCHO / 3;
  HALLAZGOS_BUCALES.forEach(({ clave, label }, i) => {
    const colX = X + (i % 3) * anchoColumna;
    const filaY = yPos + Math.floor(i / 3) * ALTO_FILA_HALLAZGOS;
    const casillaX = colX + 42;

    doc.setFont(FONT, "bold").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(label.toUpperCase(), colX + 2, filaY + LADO_CASILLA / 2 + 1.1);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(casillaX, filaY, LADO_CASILLA, LADO_CASILLA);
    if (datos[clave]) {
      doc.setFont(FONT, "bold").setFontSize(11);
      doc.text("X", casillaX + LADO_CASILLA / 2, filaY + LADO_CASILLA / 2 + 1.5, { align: "center" });
    }
  });

  return yPos + Math.ceil(HALLAZGOS_BUCALES.length / 3) * ALTO_FILA_HALLAZGOS;
};

// ===== Lugar y fecha + firmas =====
const drawLugarFecha = (doc, datos, y) => {
  const lugar = texto(datos.lugar || datos.sede);
  const fecha = toDDMMYYYY(datos.fechaOd || datos.fechaExamen || datos.fecha);
  doc.setTextColor(0, 0, 0);
  doc.setFont(FONT, "normal").setFontSize(8);
  doc.text([lugar, fecha].filter(Boolean).join(", "), X, y + 4);
  return y + 8;
};

// Carga una imagen (firma, huella, sello) comprimida a JPEG con fondo blanco
const loadImg = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 800;
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.6));
    };
    img.onerror = () => reject(`No se pudo cargar ${src}`);
    img.src = src;
  });

const ALTO_FIRMAS = 33; // alto que ocupa el bloque de firmas (imágenes de 20 mm + línea + textos)

// Firma y huella del paciente a la izquierda, sello del profesional a la derecha (centrado si solo hay uno de los dos).
const drawFirmas = async (doc, datos, y) => {
  const digitalizacion = datos.digitalizacion || [];
  const buscar = (nombre) => digitalizacion.find((d) => d.nombreDigitalizacion === nombre)?.url;
  const esUrl = (url) => url && url !== "Sin registro";
  const cargar = (url) => (esUrl(url) ? loadImg(url).catch(() => null) : Promise.resolve(null));

  const [firmap, huellap, s1, s2] = await Promise.all([
    cargar(buscar("FIRMAP")),
    cargar(buscar("HUELLA")),
    cargar(buscar("SELLOFIRMA")),
    cargar(buscar("SELLOFIRMADOCASIG")),
  ]);

  const tieneFirmaPaciente = firmap !== null || huellap !== null;
  const tieneSelloProfesional = s1 !== null || s2 !== null;
  const centroX = X + ANCHO / 2;
  const sigY = y + 4;
  const lineY = sigY + 21;

  doc.setTextColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setDrawColor(0, 0, 0);

  if (tieneFirmaPaciente) {
    const pacienteX = tieneSelloProfesional ? X + ANCHO / 4 : centroX;
    if (firmap) doc.addImage(firmap, "JPEG", pacienteX - 22, sigY, 30, 20);
    if (huellap) doc.addImage(huellap, "JPEG", pacienteX + 10, sigY, 12, 20);

    doc.setFont(FONT, "normal").setFontSize(7);
    const etiqueta = "Firma y Huella del Paciente";
    const mitad = doc.getTextWidth(etiqueta) / 2;
    doc.line(pacienteX - mitad, lineY, pacienteX + mitad, lineY);
    doc.text(etiqueta, pacienteX, lineY + 3.5, { align: "center" });
  }

  if (tieneSelloProfesional) {
    const profesionalX = tieneFirmaPaciente ? X + (ANCHO * 3) / 4 : centroX;
    const sellos = [
      s1 && { imagen: s1, texto1: "Firma y Sello del Profesional", texto2: "Responsable de la Evaluación" },
      s2 && { imagen: s2, texto1: "Firma y Sello Médico Asignado", texto2: null },
    ].filter(Boolean);
    // Con los dos sellos se achican para que quepan en la mitad derecha de la hoja
    const sigW = sellos.length > 1 ? 40 : 48;
    const gap = 8;
    const total = sigW * sellos.length + gap * (sellos.length - 1);

    sellos.forEach(({ imagen, texto1, texto2 }, i) => {
      const imgX = profesionalX - total / 2 + i * (sigW + gap);
      doc.addImage(imagen, "JPEG", imgX, sigY, sigW, 20);

      doc.setFont(FONT, "normal").setFontSize(7);
      const cx = imgX + sigW / 2;
      const anchoLinea = Math.max(doc.getTextWidth(texto1), texto2 ? doc.getTextWidth(texto2) : 0);
      doc.line(cx - anchoLinea / 2, lineY, cx + anchoLinea / 2, lineY);
      doc.text(texto1, cx, lineY + 3.5, { align: "center" });
      if (texto2) doc.text(texto2, cx, lineY + 6, { align: "center" });
    });
  }

  return y + ALTO_FIRMAS;
};

// Función principal del jasper
export default async function FichaOdontologicaVertical(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // 1) Cabecera y título
  await drawHeader(doc, datos, doc.internal.getNumberOfPages());
  doc.setFont(FONT, "bold").setFontSize(14);
  doc.text("HISTORIA ODONTOLOGICA ASISTENCIAL", pageW / 2, 33, { align: "center" });

  // 2) Datos personales (antes del punto 1)
  let y = drawDatosPersonales(doc, datos, CONTENIDO_Y);

  // 3) 1.- Odontograma (con leyenda, totales y procedimiento)
  y = await drawSeccionOdontograma(doc, datos, y + 5);

  // 4) 2.- Observaciones (si no cabe, pasa entera a otra página)
  y = await asegurarEspacio(doc, datos, y + 5, alturaObservaciones(doc, datos));
  y = drawObservaciones(doc, datos, y);

  // 5) Lugar y fecha + firmas
  y = await asegurarEspacio(doc, datos, y + 4, 8 + ALTO_FIRMAS);
  y = drawLugarFecha(doc, datos, y);
  await drawFirmas(doc, datos, y);

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
