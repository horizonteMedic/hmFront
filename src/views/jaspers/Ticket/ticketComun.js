// Medidas y datos del sticker que comparten las dos formas de imprimirlo:
//  - Ticket.jsx     : página HTML + diálogo de impresión del navegador (escritorio).
//  - TicketTspl.js  : comandos TSPL enviados a RawBT (Android).

// Rollo de la ticketera Advance ADV-9026N: stickers de 80 x 50 mm.
export const ANCHO = 80;
export const ALTO = 50;

// Márgenes del sticker (mm). La impresora no imprime hasta el borde derecho, por eso ese margen es mayor.
// Si algo sigue cortándose, se sube el margen del lado afectado.
export const MARGEN = { arriba: 3, derecho: 7, abajo: 3, izquierdo: 4 };

// Ancho (mm) de la columna izquierda (filas de datos) y de las etiquetas «DNI» / «EDAD» dentro de ella.
// El resto del ancho es para el N° de orden.
export const COL_IZQUIERDA = 42;
export const COL_ETIQUETA = 11;
export const PADDING_COLUMNAS = 2;

// Tamaños de letra (pt), del más grande al más pequeño. Se usa el primero que cabe.
export const FUENTES_NOMBRE = [10, 9, 8, 7];
export const FUENTES_DATO = [19, 17, 15, 13, 11, 9]; // DNI y edad
export const FUENTES_ORDEN = [52, 46, 40, 34, 30, 26];
export const INTERLINEADO_NOMBRE = 1.15;

// Datos de la API (visita + paciente) -> textos que se escriben en el sticker
export function prepararDatos(datos) {
    const visita = datos?.visita ?? {};
    const paciente = datos?.paciente ?? {};
    const edad = calcularEdad(paciente.fechaNacimiento);

    return {
        nombres: `${paciente.nombres ?? ""} ${paciente.apellidos ?? ""}`.trim().toUpperCase(),
        edad: edad ? `${edad} años` : "-",
        dni: paciente.dni || "S/D",
        fecha: formatearFecha(visita.fechaVisita) || formatearFecha(new Date().toISOString()),
        norden: String(visita.norden ?? ""),
    };
}

// "2026-11-19" (o con hora) -> "19/11/2026", por texto para no desfasar el día por zona horaria
export function formatearFecha(fecha) {
    const [anio, mes, dia] = String(fecha ?? "").slice(0, 10).split("-");
    return anio && mes && dia ? `${dia}/${mes}/${anio}` : "";
}

export function calcularEdad(fechaNacimiento) {
    const [anio, mes, dia] = String(fechaNacimiento ?? "").slice(0, 10).split("-").map(Number);
    if (!anio || !mes || !dia) return "";
    const hoy = new Date();
    let edad = hoy.getFullYear() - anio;
    if (hoy.getMonth() + 1 < mes || (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)) edad--;
    return String(edad);
}
