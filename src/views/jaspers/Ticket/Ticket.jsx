// Sticker de la ticketera Advance ADV-9026N: rollo de 80 x 50 mm.
//
//   ┌──────────────────────────────────────────────┐
//   │ PACIENTE                  ┊      N° ORDEN    │
//   │ NOMBRES COMPLETOS         ┊                  │
//   │ DNI    70543209           ┊        24        │
//   │ EDAD   27 años            ┊                  │
//   │                           ┊    19/11/2026    │
//   └──────────────────────────────────────────────┘
//   Filas a la izquierda (nombre, DNI, edad); a la derecha, separado por una línea vertical,
//   el N° de orden grande y la fecha pequeña.
//
// Se imprime con el diálogo de impresión del navegador (en escritorio o en Android), así que la impresora
// se elige ahí. Es una página HTML con `@page { size }` (y no PDF): el navegador le pide a la impresora o al
// servicio de impresión exactamente 80 x 50 mm, en vez de adaptar la hoja a un papel más grande.

import {
    ANCHO, ALTO, MARGEN, COL_IZQUIERDA, COL_ETIQUETA, PADDING_COLUMNAS,
    FUENTES_NOMBRE, FUENTES_DATO, FUENTES_ORDEN, INTERLINEADO_NOMBRE, prepararDatos,
} from "./ticketComun";

// Giro del contenido, en grados horarios: 0, 90, 180 o 270.
// Si el sticker sale girado, se corrige solo con este valor:
//   0   = el sticker se alimenta con el lado de 80 mm horizontal (lo normal).
//   90 / 270 = el driver alimenta el lado de 80 mm en vertical: la página pasa a ser de 50 x 80 mm.
//   180 = igual que 0 pero de cabeza.
const GIRO = 0;

export default async function Ticket({ datos = null }) {
    imprimir(construirHtml(prepararDatos(datos)));
}

const escapar = (texto) =>
    String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Transformación que gira el sticker (diseñado en 80 x 50) dentro de la página, según GIRO
const transformacion = () =>
    ({
        0: "none",
        90: `translate(${ALTO}mm, 0) rotate(90deg)`,
        180: `translate(${ANCHO}mm, ${ALTO}mm) rotate(180deg)`,
        270: `translate(0, ${ANCHO}mm) rotate(-90deg)`,
    })[GIRO] ?? "none";

function construirHtml({ nombres, edad, dni, fecha, norden }) {
    const vertical = GIRO === 90 || GIRO === 270;
    const paginaAncho = vertical ? ALTO : ANCHO;
    const paginaAlto = vertical ? ANCHO : ALTO;

    return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Ticket N° ${escapar(norden)}</title>
<style>
  @page { size: ${paginaAncho}mm ${paginaAlto}mm; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${paginaAncho}mm; height: ${paginaAlto}mm; overflow: hidden; background: #fff; }
  body { font-family: Arial, Helvetica, sans-serif; color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .pagina { position: relative; width: ${paginaAncho}mm; height: ${paginaAlto}mm; overflow: hidden; }
  .sticker { position: absolute; top: 0; left: 0; width: ${ANCHO}mm; height: ${ALTO}mm;
             padding: ${MARGEN.arriba}mm ${MARGEN.derecho}mm ${MARGEN.abajo}mm ${MARGEN.izquierdo}mm;
             transform-origin: top left; transform: ${transformacion()}; display: flex; flex-direction: column; }
  .etiqueta { font-size: 6pt; color: #6e6e6e; letter-spacing: .02em; }
  .cuerpo { flex: 1; min-height: 0; display: grid; grid-template-columns: ${COL_IZQUIERDA}mm minmax(0, 1fr); }
  .izquierda { display: flex; flex-direction: column; justify-content: center; gap: 3mm; padding-right: ${PADDING_COLUMNAS}mm; }
  .nombre { font-size: 10pt; font-weight: 700; line-height: ${INTERLINEADO_NOMBRE}; margin-top: 0.8mm; word-break: break-word; }
  .fila { display: grid; grid-template-columns: ${COL_ETIQUETA}mm minmax(0, 1fr); align-items: baseline; }
  .dato { font-size: ${FUENTES_DATO[0]}pt; font-weight: 700; line-height: 1.05; white-space: nowrap; }
  .derecha { border-left: 0.3mm dashed #6e6e6e; padding-left: ${PADDING_COLUMNAS}mm; display: flex; flex-direction: column; text-align: center; }
  .centro { flex: 1; display: flex; align-items: center; }
  .norden { width: 100%; font-size: ${FUENTES_ORDEN[0]}pt; font-weight: 700; line-height: 1; white-space: nowrap; }
  .fecha { font-size: 8pt; color: #333; }
</style>
</head>
<body>
<div class="pagina"><div class="sticker"><div class="cuerpo">
  <div class="izquierda">
    <div>
      <div class="etiqueta">PACIENTE</div>
      <div class="nombre" id="nombre">${escapar(nombres)}</div>
    </div>
    <div class="fila"><div class="etiqueta">DNI</div><div class="dato" id="dni">${escapar(dni)}</div></div>
    <div class="fila"><div class="etiqueta">EDAD</div><div class="dato" id="edad">${escapar(edad)}</div></div>
  </div>
  <div class="derecha">
    <div class="etiqueta">N° ORDEN</div>
    <div class="centro"><div class="norden" id="norden">${escapar(norden)}</div></div>
    <div class="fecha">${escapar(fecha)}</div>
  </div>
</div></div></div>
</body>
</html>`;
}

// Letra más grande con la que el nombre cabe en 2 líneas; si no cabe, en 3
function ajustarNombre(doc) {
    const el = doc.getElementById("nombre");
    if (!el) return;
    const lineasConTamano = (pt) => {
        el.style.fontSize = `${pt}pt`;
        const altoLinea = ((pt * 96) / 72) * INTERLINEADO_NOMBRE;
        return Math.round(el.scrollHeight / altoLinea);
    };
    for (const maxLineas of [2, 3]) {
        const pt = FUENTES_NOMBRE.find((tam) => lineasConTamano(tam) <= maxLineas);
        if (pt) {
            el.style.fontSize = `${pt}pt`;
            return;
        }
    }
    el.style.fontSize = `${FUENTES_NOMBRE[FUENTES_NOMBRE.length - 1]}pt`;
}

// Letra más grande, de `fuentes`, con la que el texto de todos los elementos cabe en su ancho. Todos los
// elementos del grupo comparten el mismo tamaño (el del que menos cabe), para que las filas se vean parejas.
// (un DNI/pasaporte largo o un N° de orden de varios dígitos no deben salirse del ticket)
function ajustarAncho(doc, ids, fuentes) {
    const elementos = ids.map((id) => doc.getElementById(id)).filter(Boolean);
    const caben = (tam) =>
        elementos.every((el) => {
            el.style.fontSize = `${tam}pt`;
            return el.scrollWidth <= el.clientWidth;
        });
    const pt = fuentes.find(caben) ?? fuentes[fuentes.length - 1];
    elementos.forEach((el) => (el.style.fontSize = `${pt}pt`));
}

// Escribe el ticket en un iframe oculto y abre el diálogo de impresión del navegador
function imprimir(html) {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
    document.body.appendChild(iframe);

    const quitar = () => iframe.isConnected && iframe.remove();
    const doc = iframe.contentDocument;
    doc.open();
    doc.write(html);
    doc.close();

    ajustarNombre(doc);
    ajustarAncho(doc, ["dni", "edad"], FUENTES_DATO);
    ajustarAncho(doc, ["norden"], FUENTES_ORDEN);
    iframe.contentWindow.addEventListener("afterprint", quitar);
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(quitar, 60000);
}
