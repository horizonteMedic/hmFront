import { URLAzure } from "../../../../config/config";
import { getFetch, SubmitData, updateData } from "../../../../utils/apiHelpers";

// Error con un mensaje pensado para el usuario (p. ej. el { mensaje } que responde el backend).
class ErrorApi extends Error {}

// Cualquier otro fallo (red caída, respuesta ilegible...) se reemplaza por un texto en español.
export const mensajeDeError = (error, mensajePorDefecto) =>
    error instanceof ErrorApi ? error.message : mensajePorDefecto;

// El backend responde los errores como { mensaje }; si no viene, se usa el texto por defecto.
export const errorDeRespuesta = async (res, mensajePorDefecto) => {
    const data = await res.json().catch(() => ({}));
    return new ErrorApi(data.mensaje ?? mensajePorDefecto);
};

// GET que lanza ErrorApi(mensajeError) si la petición no fue ok.
export const getJson = async (url, token, mensajeError) => {
    const res = await getFetch(url, token);
    if (res?.error) throw new ErrorApi(mensajeError);
    return res;
};

export const getLista = async (url, token, mensajeError) => {
    const lista = await getJson(url, token, mensajeError);
    if (!Array.isArray(lista)) throw new ErrorApi(mensajeError);
    return lista;
};

// POST con body JSON; si falla lanza el error del backend ({ mensaje }) o `mensajeError`.
export const postJson = async (url, body, token, mensajeError) => {
    const res = await SubmitData(body, url, token);
    // SubmitData devuelve el Response crudo cuando la petición no fue ok
    if (res instanceof Response) throw await errorDeRespuesta(res, mensajeError);
    return res;
};

// PUT con body JSON (mismo manejo de errores que postJson).
export const putJson = async (url, body, token, mensajeError) => {
    const res = await updateData(body, url, token);
    if (res instanceof Response) throw await errorDeRespuesta(res, mensajeError);
    return res;
};

// PATCH sin body (activar / desactivar). Devuelve null si la respuesta viene vacía.
export const patchJson = async (url, token, mensajeError) => {
    const res = await fetch(`${URLAzure}${url}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw await errorDeRespuesta(res, mensajeError);
    return res.json().catch(() => null);
};
