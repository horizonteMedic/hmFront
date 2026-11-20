// Impresión del sticker en Android: se dibuja el ticket como imagen en blanco y negro y se envía a la
// app RawBT (por Bluetooth) dentro de comandos TSPL, el lenguaje de la ticketera.
//
// Por qué no el diálogo de impresión de Android: ese servicio manda una «hoja» de unos 300 mm de alto y la
// ticketera la imprime entera (~6 stickers, solo el primero con datos). En TSPL el tamaño de la etiqueta
// se declara con SIZE, así que cada ticket ocupa exactamente un sticker de 80 x 50 mm.
//
// Mismo diseño que la versión HTML (Ticket.jsx), con las medidas de ticketComun.js.

import {
    ANCHO, ALTO, MARGEN, COL_IZQUIERDA, COL_ETIQUETA, PADDING_COLUMNAS,
    FUENTES_NOMBRE, FUENTES_DATO, FUENTES_ORDEN, INTERLINEADO_NOMBRE,
} from "./ticketComun";

// ── Ajustes de la impresora (probar con el sticker real) ─────────────────────
const DPI = 203; // resolución: 203 dpi = 8 puntos por mm (el sticker son 640 x 400 puntos)
const GAP_MM = 3; // separación entre stickers del rollo; si avanza mal, ajustar a la medida real
const DIRECCION = 0; // 0 ó 1. Si el ticket sale de cabeza, cambiar al otro valor
const BIT_NEGRO = 0; // en BITMAP de TSPL 0 = punto negro. Si sale en negativo (fondo negro), poner 1
const UMBRAL_NEGRO = 140; // 0-255: por debajo de esta luminosidad el punto se imprime
const PAQUETE_RAWBT = "ru.a402d.rawbtprinter";

const FAMILIA = "Arial, Helvetica, sans-serif";
const ETIQUETA_PT = 7; // «PACIENTE», «DNI», «EDAD», «N° ORDEN»: algo más grande que en el HTML para que se lea en 1 bit
const FECHA_PT = 8;

const PUNTOS_POR_MM = DPI / 25.4;
const ANCHO_PUNTOS = Math.ceil(Math.round(ANCHO * PUNTOS_POR_MM) / 8) * 8; // múltiplo de 8: 8 puntos por byte
const ALTO_PUNTOS = Math.round(ALTO * PUNTOS_POR_MM);

// pt -> mm (el canvas se dibuja en milímetros)
const ptAMm = (pt) => (pt * 25.4) / 72;

// ── Dibujo ───────────────────────────────────────────────────────────────────
export function dibujarSticker({ nombres, edad, dni, fecha, norden }) {
    const canvas = document.createElement("canvas");
    canvas.width = ANCHO_PUNTOS;
    canvas.height = ALTO_PUNTOS;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(PUNTOS_POR_MM, PUNTOS_POR_MM); // desde aquí todo está en mm
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000";
    ctx.textBaseline = "alphabetic";

    const usarFuente = (pt, negrita = true) => {
        ctx.font = `${negrita ? "bold " : ""}${ptAMm(pt)}px ${FAMILIA}`;
    };
    const ancho = (texto) => ctx.measureText(texto).width;

    // Geometría (mm)
    const arriba = MARGEN.arriba;
    const abajo = ALTO - MARGEN.abajo;
    const izqX = MARGEN.izquierdo;
    const izqAncho = COL_IZQUIERDA - PADDING_COLUMNAS;
    const lineaX = izqX + COL_IZQUIERDA;
    const derX = lineaX + PADDING_COLUMNAS;
    const derAncho = ANCHO - MARGEN.derecho - derX;
    const derCentro = derX + derAncho / 2;

    // ── Columna izquierda: nombre, DNI y edad, centrados en vertical ──────────
    const nombre = ajustarNombre({ usarFuente, ancho, texto: nombres, anchoMax: izqAncho });
    const ptDato = ajustarAncho({ usarFuente, ancho, textos: [dni, edad], anchoMax: izqAncho - COL_ETIQUETA, fuentes: FUENTES_DATO });

    const altoEtiqueta = ptAMm(ETIQUETA_PT);
    const altoLineaNombre = ptAMm(nombre.pt) * INTERLINEADO_NOMBRE;
    const altoNombre = altoEtiqueta + 0.8 + nombre.lineas.length * altoLineaNombre;
    const altoFila = ptAMm(ptDato) * 1.05;
    const separacion = 3;
    const total = altoNombre + separacion + altoFila + separacion + altoFila;
    let y = arriba + Math.max(0, (abajo - arriba - total) / 2);

    usarFuente(ETIQUETA_PT, false);
    ctx.fillText("PACIENTE", izqX, y + altoEtiqueta * 0.85);
    y += altoEtiqueta + 0.8;

    usarFuente(nombre.pt);
    nombre.lineas.forEach((linea, i) => {
        ctx.fillText(linea, izqX, y + i * altoLineaNombre + altoLineaNombre / 2 + ptAMm(nombre.pt) * 0.3);
    });
    y += nombre.lineas.length * altoLineaNombre + separacion;

    for (const [etiqueta, valor] of [["DNI", dni], ["EDAD", edad]]) {
        const baseline = y + altoFila / 2 + ptAMm(ptDato) * 0.36; // los números ocupan ~72 % de la altura de la letra
        usarFuente(ETIQUETA_PT, false);
        ctx.fillText(etiqueta, izqX, baseline);
        usarFuente(ptDato);
        ctx.fillText(valor, izqX + COL_ETIQUETA, baseline);
        y += altoFila + separacion;
    }

    // ── Línea vertical punteada ───────────────────────────────────────────────
    ctx.lineWidth = 0.3;
    ctx.setLineDash([0.9, 0.9]);
    ctx.beginPath();
    ctx.moveTo(lineaX, arriba);
    ctx.lineTo(lineaX, abajo);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── Columna derecha: N° de orden grande y fecha pequeña ───────────────────
    ctx.textAlign = "center";
    usarFuente(ETIQUETA_PT, false);
    ctx.fillText("N° ORDEN", derCentro, arriba + altoEtiqueta * 0.85);

    usarFuente(FECHA_PT, false);
    ctx.fillText(fecha, derCentro, abajo - ptAMm(FECHA_PT) * 0.2);

    const ptOrden = ajustarAncho({ usarFuente, ancho, textos: [norden], anchoMax: derAncho, fuentes: FUENTES_ORDEN });
    const medioY = (arriba + altoEtiqueta + (abajo - ptAMm(FECHA_PT))) / 2;
    usarFuente(ptOrden);
    ctx.fillText(norden, derCentro, medioY + ptAMm(ptOrden) * 0.36);
    ctx.textAlign = "left";

    return canvas;
}

// Primer tamaño de `fuentes` con el que todos los textos caben en `anchoMax` (mm); el mismo para todos
function ajustarAncho({ usarFuente, ancho, textos, anchoMax, fuentes }) {
    const pt = fuentes.find((tam) => {
        usarFuente(tam);
        return textos.every((t) => ancho(t) <= anchoMax);
    });
    return pt ?? fuentes[fuentes.length - 1];
}

// Letra más grande con la que el nombre cabe en 2 líneas; si no cabe, en 3
function ajustarNombre({ usarFuente, ancho, texto, anchoMax }) {
    const partir = (pt) => {
        usarFuente(pt);
        return partirEnLineas(texto, anchoMax, ancho);
    };
    for (const maxLineas of [2, 3]) {
        for (const pt of FUENTES_NOMBRE) {
            const lineas = partir(pt);
            if (lineas.length <= maxLineas) return { pt, lineas };
        }
    }
    const pt = FUENTES_NOMBRE[FUENTES_NOMBRE.length - 1];
    return { pt, lineas: partir(pt) };
}

// Parte el texto en líneas que caben en `anchoMax`, cortando por palabras (y por letras si una palabra sola no cabe)
function partirEnLineas(texto, anchoMax, ancho) {
    const lineas = [];
    let actual = "";
    for (const palabra of texto.split(/\s+/).filter(Boolean)) {
        const prueba = actual ? `${actual} ${palabra}` : palabra;
        if (ancho(prueba) <= anchoMax) {
            actual = prueba;
            continue;
        }
        if (actual) lineas.push(actual);
        actual = "";
        for (const letra of palabra) {
            if (actual && ancho(actual + letra) > anchoMax) {
                lineas.push(actual);
                actual = "";
            }
            actual += letra;
        }
    }
    if (actual) lineas.push(actual);
    return lineas.length ? lineas : [""];
}

// ── TSPL ─────────────────────────────────────────────────────────────────────
// Canvas -> bytes de imagen de 1 bit por punto (8 puntos por byte, de izquierda a derecha)
function aBitmap(canvas) {
    const { width, height } = canvas;
    const { data } = canvas.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, width, height);
    const bytesPorFila = width / 8;
    const bytes = new Uint8Array(bytesPorFila * height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const luminosidad = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            const bit = luminosidad < UMBRAL_NEGRO ? BIT_NEGRO : 1 - BIT_NEGRO;
            if (bit) bytes[y * bytesPorFila + (x >> 3)] |= 0x80 >> (x & 7);
        }
    }
    return { bytes, bytesPorFila, alto: height };
}

// Comandos TSPL completos de un sticker (bytes listos para enviar a la ticketera)
export function construirTspl(ticket) {
    const { bytes, bytesPorFila, alto } = aBitmap(dibujarSticker(ticket));
    const texto = new TextEncoder();
    const inicio = texto.encode(
        `SIZE ${ANCHO} mm,${ALTO} mm\r\nGAP ${GAP_MM} mm,0 mm\r\nDIRECTION ${DIRECCION}\r\nREFERENCE 0,0\r\nCLS\r\n` +
            `BITMAP 0,0,${bytesPorFila},${alto},0,`
    );
    const fin = texto.encode("\r\nPRINT 1,1\r\n");

    const comandos = new Uint8Array(inicio.length + bytes.length + fin.length);
    comandos.set(inicio, 0);
    comandos.set(bytes, inicio.length);
    comandos.set(fin, inicio.length + bytes.length);
    return comandos;
}

function aBase64(bytes) {
    let binario = "";
    const paso = 0x8000;
    for (let i = 0; i < bytes.length; i += paso) {
        binario += String.fromCharCode.apply(null, bytes.subarray(i, i + paso));
    }
    return btoa(binario);
}

// Abre RawBT con los comandos TSPL: RawBT los manda tal cual a la ticketera que tenga configurada.
// Debe llamarse desde un toque del usuario (Chrome bloquea abrir apps sin él).
export function enviarTicketARawBT(ticket) {
    const datos = aBase64(construirTspl(ticket));
    window.location.href = `intent:base64,${datos}#Intent;scheme=rawbt;package=${PAQUETE_RAWBT};end;`;
}
