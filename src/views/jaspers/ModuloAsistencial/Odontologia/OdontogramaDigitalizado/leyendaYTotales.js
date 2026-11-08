import { compressImage } from "../../../../utils/helpers.js";
import {
  contarEstados,
  estadosVisibles,
  labelParaLeer,
} from "../../../../admin/panel-de-control/ModuloAsistencial/Odontologia/estadosOdontograma.js";
import { dibujarEstadoVectorial } from "./estadosVectoriales.js";

// Leyenda y totales del reporte del odontograma. Salen de la misma lista de estados que usa el formulario
// (estadosOdontograma.js) y los totales se cuentan desde los 32 dientes del registro, porque el backend solo
// guarda totales de los estados antiguos (txtCariadasOturar, txtPorExtraer, ...).

// Estados que conservan su ícono PNG (public/img/iconos_odonto/Icon_<nombre>.png). El resto se dibuja con trazos
// (ver estadosVectoriales).
export const ICONO_PNG = {
  Ausente: "ausente",
  "Carie Dental": "cariada",
  Puente: "puente",
  "P.Total": "p_total",
  Normal: "normal",
  "Por extraer": "por_extraer",
  "Obturacion Efectuada": "obturacion",
};

const RUTA_ICONOS = "/img/iconos_odonto/";

// lbl del backend por cada diente d1..d32 (d1 = 18 ... d8 = 11, d9 = 21 ... d16 = 28, d17 = 48 ... d24 = 41, d25 = 31 ... d32 = 38).
const LBL_POR_DIENTE = [
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
];

// Estado de cada diente (d1..d32) a partir de las imágenes que guarda el backend.
export const estadosDeDientes = (datos = {}) =>
  Object.fromEntries(LBL_POR_DIENTE.map((lbl, i) => [`d${i + 1}`, labelParaLeer(datos[`lbl${lbl}`])]));

const cargarImagen = async (src) => {
  try {
    const comprimida = await compressImage(src, 0.7, 200);
    if (!comprimida) return null;
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(`No se pudo cargar ${src}`);
      img.src = comprimida;
    });
  } catch (error) {
    console.error(`Error al comprimir/cargar imagen ${src}:`, error);
    return null;
  }
};

// Escribe "texto" achicando la letra (hasta `minimo`) para que quepa en `anchoMax`, sin saltar de línea.
const textoAjustado = (doc, texto, x, y, anchoMax, { size = 7.5, minimo = 5.5 } = {}) => {
  let actual = size;
  doc.setFontSize(actual);
  while (actual > minimo && doc.getTextWidth(texto) > anchoMax) {
    actual -= 0.25;
    doc.setFontSize(actual);
  }
  doc.text(texto, x, y);
};

const MARGEN = 15;
const columnasDerecha = (doc) => {
  const pageW = doc.internal.pageSize.getWidth();
  const inicioX = pageW * 0.45;
  return { inicioX, ancho: pageW - inicioX - MARGEN };
};

// Reparte `n` elementos en 4 columnas, llenando de arriba hacia abajo: devuelve cuántos caben por columna.
const FILAS = (n) => Math.ceil(n / 4);

// Leyenda: un ícono por cada estado que se ofrece (y los antiguos solo si este odontograma los trae).
// Devuelve la Y donde sigue el contenido.
export const drawLeyenda = async (doc, datos, yPosInicial) => {
  const { inicioX, ancho } = columnasDerecha(doc);
  const estados = estadosVisibles(contarEstados(estadosDeDientes(datos)));

  const iconSize = 5.5;
  const colSpacing = ancho / 4;
  const rowSpacing = 6;
  const filas = FILAS(estados.length);
  const alturaLeyenda = filas * rowSpacing + 2;

  let yPos = yPosInicial + 4;
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("LEYENDA", inicioX, yPos);
  yPos += 4;
  const startY = yPos;

  const imagenes = await Promise.all(
    estados.map((estado) =>
      ICONO_PNG[estado.label] ? cargarImagen(`${RUTA_ICONOS}Icon_${ICONO_PNG[estado.label]}.png`) : null
    )
  );

  estados.forEach((estado, i) => {
    const colX = inicioX + Math.floor(i / filas) * colSpacing;
    const y = startY + (i % filas) * rowSpacing;

    if (imagenes[i]) {
      try {
        doc.addImage(imagenes[i], "PNG", colX, y, iconSize, iconSize);
      } catch (error) {
        console.error(`Error al dibujar el ícono de ${estado.label}:`, error);
      }
    } else {
      dibujarEstadoVectorial(doc, estado.label, colX, y, iconSize, iconSize);
    }

    doc.setFont("helvetica", "normal").setTextColor(0, 0, 0);
    textoAjustado(doc, estado.label, colX + iconSize + 1.5, y + iconSize / 2 + 1, colSpacing - iconSize - 3);
  });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(inicioX - 2, startY - 2, ancho + 4, alturaLeyenda + 2);

  return startY + alturaLeyenda + 4;
};

// Totales: piezas en mal estado y cuántos dientes tiene cada estado. Devuelve la Y donde sigue el contenido.
export const drawEstadisticas = (doc, datos, yPosInicial) => {
  const { inicioX, ancho } = columnasDerecha(doc);
  const conteo = contarEstados(estadosDeDientes(datos));
  const totales = [
    { label: "Piezas en mal estado", valor: conteo.malEstado },
    ...estadosVisibles(conteo).map((estado) => ({ label: estado.label, valor: conteo[estado.clave] })),
  ];

  const filaAltura = 4;
  const colWidth = ancho / 4;
  const filas = FILAS(totales.length);
  const startY = yPosInicial + 4;

  totales.forEach(({ label, valor }, i) => {
    const colX = inicioX + Math.floor(i / filas) * colWidth;
    const y = startY + (i % filas) * filaAltura;
    const etiqueta = `${label}:`;
    const texto = `${etiqueta} ${valor}`;

    // Etiqueta en negrita y valor normal; si no caben en la columna se achica todo junto.
    let size = 8;
    doc.setFont("helvetica", "bold").setFontSize(size);
    while (size > 6 && doc.getTextWidth(texto) > colWidth - 2) {
      size -= 0.25;
      doc.setFontSize(size);
    }
    doc.text(etiqueta, colX, y);
    const anchoEtiqueta = doc.getTextWidth(etiqueta);
    doc.setFont("helvetica", "normal").setFontSize(size);
    doc.text(String(valor), colX + anchoEtiqueta + 1.5, y);
  });

  return startY + filas * filaAltura;
};
