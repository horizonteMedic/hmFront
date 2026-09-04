import { URLAzure } from "../../../config/config";
import { getFetch } from "../../../admin/panel-de-control/getFetch/getFetch";

// Modelo propio de DiagnosticoRelacionado. No depende de PlantillaDiagnostico:
// contiene solo lo que usan los selectores de este módulo (CIE10,
// recomendaciones y restricciones).

const jsonHeaders = (token) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
});

// El backend envuelve TODAS las respuestas (incluso errores) en
// { codigo, estatus, resultado, timestamp }. El dato real está en
// "resultado"; si no viene envuelto se devuelve tal cual.
const unwrap = (res) => (res && typeof res === "object" && "resultado" in res ? res.resultado : res);

const postJson = (url, body, token) =>
    fetch(`${URLAzure}${url}`, {
        method: "POST",
        headers: jsonHeaders(token),
        body: JSON.stringify(body),
    }).then((res) => (res.ok ? res.json().then(unwrap) : res));

const getJson = (url, token) => getFetch(url, token).then(unwrap);

// ---------- CIE10 (solo búsqueda, catálogo existente) ----------
export const buscarCie10 = (q, token) =>
    getJson(`/api/v01/ct/cie10/buscar?q=${encodeURIComponent(q)}`, token).then(
        (res) => res || []
    );

// ---------- Recomendación ----------
// El GET trae el listado completo de activas y se filtra en el front.
export const getRecomendaciones = (token) => getJson(`/api/v01/ct/recomendacion`, token);

// Registra (id null) o actualiza (id enviado) una recomendación.
export const guardarRecomendacion = ({ id = null, descripcion, usuarioRegistro, usuarioActualizacion }, token) =>
    postJson(
        `/api/v01/ct/recomendacion/registrarActualizar`,
        { id, descripcion, usuarioRegistro, usuarioActualizacion },
        token
    );

// ---------- Restricción ----------
export const getRestricciones = (token) => getJson(`/api/v01/ct/restriccion`, token);

export const guardarRestriccion = ({ id = null, descripcion, usuarioRegistro, usuarioActualizacion }, token) =>
    postJson(
        `/api/v01/ct/restriccion/registrarActualizar`,
        { id, descripcion, usuarioRegistro, usuarioActualizacion },
        token
    );
