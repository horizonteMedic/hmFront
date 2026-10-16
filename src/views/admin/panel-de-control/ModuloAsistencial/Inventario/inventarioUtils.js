import { getFetch, SubmitData } from "../../../../utils/apiHelpers";

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
