import { getFetch, SubmitData } from "../../../../utils/apiHelpers";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";

// Base común de los endpoints del Inventario Asistencial.
export const inventarioUrl = "/asistencial/inventario";

const MENSAJE_SIN_CONEXION = "No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.";
const MENSAJE_RESPUESTA_INVALIDA = "El servidor devolvió una respuesta que no se pudo interpretar.";

const MENSAJES_HTTP = {
    400: "Los datos enviados no son válidos.",
    401: "Su sesión ha expirado. Vuelva a iniciar sesión.",
    403: "No tiene permisos para realizar esta acción.",
    404: "No se encontró el recurso solicitado.",
    409: "Ya existe un registro con esos datos.",
};

export const unwrap = (res) => (res && typeof res === "object" && "resultado" in res ? res.resultado : res);

// Texto sin tildes, en minúsculas y con espacios simples: sirve para comparar nombres sin que
// "Paracetamol  500 MG" y "paracetamol 500 mg" cuenten como distintos.
export const normalizarTexto = (texto) =>
    String(texto ?? "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

// Quita espacios sobrantes (inicio, fin y repetidos) antes de enviar un texto al backend.
export const limpiarTexto = (texto) => String(texto ?? "").replace(/\s+/g, " ").trim();

// "NOMBRE - PRESENTACIÓN": cómo se muestra un medicamento en listas, selectores y reportes.
export const etiquetaMedicamento = (medicamento) =>
    [medicamento?.nombre, medicamento?.presentacion].filter(Boolean).join(" - ");

// "5 de A-OLD (vence 31/12/2026), 2 de A-NEW (vence 30/06/2028)": de qué lotes salió una entrega o una receta
// (el backend las descuenta por lotes, primero lo que vence antes).
export const resumenLotes = (lotes) =>
    (lotes ?? [])
        .map((lote) => `${lote.cantidad} de ${lote.numeroLote || "sin lote"} (vence ${formatearFechaCorta(lote.fechaVencimiento) || "—"})`)
        .join(", ");

// ── Fechas de vencimiento ──────────────────────────────────────────────────────────────────────
const ANIO_MIN = 2000;
const ANIO_MAX = 2100;
const MS_POR_DIA = 86400000;
// Números de serie de Excel que se interpretan como fecha (aprox. años 1954 a 2119).
const SERIAL_EXCEL_MIN = 20000;
const SERIAL_EXCEL_MAX = 80000;

const dosDigitos = (numero) => String(numero).padStart(2, "0");
const fechaISO = (anio, mes, dia) => `${anio}-${dosDigitos(mes)}-${dosDigitos(dia)}`;

const ultimoDiaDelMes = (anio, mes) => new Date(anio, mes, 0).getDate();

// true si el día existe en el calendario (el 31/02 no).
const diaExiste = (anio, mes, dia) => {
    const fecha = new Date(anio, mes - 1, dia);
    return fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
};

// Formatos de texto que se aceptan; `dia: null` significa que solo viene mes y año.
const FORMATOS_FECHA = [
    { regex: /^(\d{4})-(\d{1,2})-(\d{1,2})$/, partes: (m) => ({ anio: +m[1], mes: +m[2], dia: +m[3] }) },
    { regex: /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/, partes: (m) => ({ anio: +m[3], mes: +m[2], dia: +m[1] }) },
    { regex: /^(\d{4})-(\d{1,2})$/, partes: (m) => ({ anio: +m[1], mes: +m[2], dia: null }) },
    { regex: /^(\d{1,2})[/-](\d{4})$/, partes: (m) => ({ anio: +m[2], mes: +m[1], dia: null }) },
];

// Fecha de vencimiento -> "yyyy-MM-dd", o null si no se puede interpretar. Acepta:
//   - Date (celda de fecha de Excel, que ExcelJS entrega a medianoche UTC) o número de serie de Excel,
//   - "15/03/2027" (día/mes/año) y "2027-03-15",
//   - solo mes y año ("06/2027" o "2028-01"), que queda como el último día de ese mes.
export const parsearFechaVencimiento = (valor) => {
    let entrada = valor;
    if (typeof entrada === "number") {
        if (entrada < SERIAL_EXCEL_MIN || entrada > SERIAL_EXCEL_MAX) return null;
        entrada = new Date(Date.UTC(1899, 11, 30) + Math.round(entrada) * MS_POR_DIA);
    }
    if (entrada instanceof Date) {
        if (Number.isNaN(entrada.getTime())) return null;
        return fechaISO(entrada.getUTCFullYear(), entrada.getUTCMonth() + 1, entrada.getUTCDate());
    }

    const texto = String(entrada ?? "").trim();
    for (const { regex, partes } of FORMATOS_FECHA) {
        const coincidencia = texto.match(regex);
        if (!coincidencia) continue;

        const { anio, mes, dia } = partes(coincidencia);
        if (anio < ANIO_MIN || anio > ANIO_MAX || mes < 1 || mes > 12) return null;
        const diaFinal = dia ?? ultimoDiaDelMes(anio, mes);
        return diaExiste(anio, mes, diaFinal) ? fechaISO(anio, mes, diaFinal) : null;
    }
    return null;
};

// Hoy como "yyyy-MM-dd" (hora local), para comparar con fechas de vencimiento en el mismo formato.
export const hoyISO = () => {
    const hoy = new Date();
    return fechaISO(hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate());
};

// Rango por defecto de los historiales: desde el primer día del mes actual hasta hoy.
export const rangoMesActual = () => {
    const hoy = hoyISO();
    return { desde: `${hoy.slice(0, 8)}01`, hasta: hoy };
};

// Escapa un texto que viene de la base de datos (lote, nombre...) antes de ponerlo dentro del `html` de un Swal.
export const escaparHtml = (texto) =>
    String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const mensajePorStatus = (status) => {
    if (MENSAJES_HTTP[status]) return MENSAJES_HTTP[status];
    return status >= 500 ? "Error en el servidor. Intente nuevamente en unos minutos." : null;
};

// El backend responde los errores como { codigo, resultado: { mensaje, detalle } }.
const mensajeDeCuerpo = (cuerpo) => cuerpo?.resultado?.detalle ?? cuerpo?.resultado?.mensaje ?? cuerpo?.mensaje ?? null;

// Unifica las respuestas de SubmitData / getFetch en { ok, resultado, mensaje }:
//   - SubmitData devuelve el Response crudo cuando el HTTP no es OK (se lee el cuerpo para mostrar el
//     motivo exacto que dio el backend, p. ej. "Medicamento duplicado").
//   - getFetch devuelve { error: true, status } cuando el HTTP no es OK.
//   - Un cuerpo con `codigo` >= 400 también se trata como fallo.
const normalizarRespuesta = async (res, mensajeDefecto) => {
    if (res instanceof Response) {
        const cuerpo = await res.json().catch(() => null);
        return { ok: false, status: res.status, mensaje: mensajeDeCuerpo(cuerpo) ?? mensajePorStatus(res.status) ?? mensajeDefecto };
    }
    if (!res || res.error) {
        return { ok: false, status: res?.status, mensaje: mensajePorStatus(res?.status) ?? mensajeDefecto };
    }
    if (Number(res.codigo) >= 400) {
        return { ok: false, status: Number(res.codigo), mensaje: mensajeDeCuerpo(res) ?? mensajeDefecto };
    }
    return { ok: true, resultado: unwrap(res) };
};

// Una respuesta ilegible (SyntaxError) no es lo mismo que no tener conexión (TypeError de fetch).
const mensajeDeExcepcion = (error) => (error instanceof SyntaxError ? MENSAJE_RESPUESTA_INVALIDA : MENSAJE_SIN_CONEXION);

// GET -> { ok, resultado, mensaje }. Nunca lanza: el que llama decide cómo mostrar el error.
export const consultarInventario = async (url, token, mensajeDefecto) => {
    try {
        return await normalizarRespuesta(await getFetch(url, token), mensajeDefecto);
    } catch (error) {
        console.error(error);
        return { ok: false, mensaje: mensajeDeExcepcion(error) };
    }
};

// POST -> { ok, resultado, mensaje }. Nunca lanza.
export const enviarInventario = async (url, body, token, mensajeDefecto) => {
    try {
        return await normalizarRespuesta(await SubmitData(body, url, token), mensajeDefecto);
    } catch (error) {
        console.error(error);
        return { ok: false, mensaje: mensajeDeExcepcion(error) };
    }
};
