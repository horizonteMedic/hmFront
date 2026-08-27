import { URLAzure } from "../../../config/config";
import { getFetch } from "../../../admin/panel-de-control/getFetch/getFetch";

const jsonHeaders = (token) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
});

const buildQuery = (params = {}) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        search.append(key, value);
    });
    const qs = search.toString();
    return qs ? `?${qs}` : "";
};

// El backend envuelve TODAS las respuestas (incluso errores) en
// { codigo, estatus, resultado, timestamp }. El dato real está en
// "resultado"; si no viene envuelto (o es un error sin ese formato) se
// devuelve la respuesta tal cual llegó.
const unwrap = (res) => (res && typeof res === "object" && "resultado" in res ? res.resultado : res);

const postJson = (url, body, token) =>
    fetch(`${URLAzure}${url}`, {
        method: "POST",
        headers: jsonHeaders(token),
        body: JSON.stringify(body),
    }).then((res) => (res.ok ? res.json().then(unwrap) : res));

const deleteJson = (url, token) =>
    fetch(`${URLAzure}${url}`, {
        method: "DELETE",
        headers: jsonHeaders(token),
    }).then((res) => (res.ok ? res.json().then(unwrap) : res));

const getJson = (url, token) => getFetch(url, token).then(unwrap);

// ---------- CIE10 (solo búsqueda, catálogo existente) ----------
export const buscarCie10 = (q, token) =>
    getJson(`/api/v01/ct/cie10/buscar?q=${encodeURIComponent(q)}`, token).then(
        (res) => res || []
    );

// ---------- Recomendación ----------
export const getRecomendaciones = (filtro, token) =>
    getJson(`/api/v01/ct/recomendacion${buildQuery({ filtro })}`, token);

export const getRecomendacion = (id, token) =>
    getJson(`/api/v01/ct/recomendacion/${id}`, token);

// Registra (id null) o actualiza (id enviado) una recomendación.
export const guardarRecomendacion = ({ id = null, descripcion, usuarioRegistro }, token) =>
    postJson(
        `/api/v01/ct/recomendacion/registrarActualizar`,
        { id, descripcion, usuarioRegistro },
        token
    );

export const eliminarRecomendacion = (id, token) =>
    deleteJson(`/api/v01/ct/recomendacion/eliminar/${id}`, token);

// ---------- Restricción ----------
export const getRestricciones = (filtro, token) =>
    getJson(`/api/v01/ct/restriccion${buildQuery({ filtro })}`, token);

export const getRestriccion = (id, token) =>
    getJson(`/api/v01/ct/restriccion/${id}`, token);

// Registra (id null) o actualiza (id enviado) una restricción.
export const guardarRestriccion = ({ id = null, descripcion, usuarioRegistro }, token) =>
    postJson(
        `/api/v01/ct/restriccion/registrarActualizar`,
        { id, descripcion, usuarioRegistro },
        token
    );

export const eliminarRestriccion = (id, token) =>
    deleteJson(`/api/v01/ct/restriccion/eliminar/${id}`, token);

// ---------- Plantilla de Diagnóstico ----------
export const getPlantillasDiagnostico = (filtros, token) =>
    getJson(
        `/api/v01/ct/plantillaDiagnostico${buildQuery({
            titulo: filtros?.titulo,
            codigo: filtros?.codigo,
            diagnostico: filtros?.diagnostico,
            cie10: filtros?.cie10,
        })}`,
        token
    );

export const getPlantillaDiagnostico = (id, token) =>
    getJson(`/api/v01/ct/plantillaDiagnostico/${id}`, token);

// Registra (idPlantilla null) o actualiza (idPlantilla enviado) una plantilla.
export const guardarPlantillaDiagnostico = (data, usuarioCreacion, token) =>
    postJson(
        `/api/v01/ct/plantillaDiagnostico/registrarActualizar`,
        {
            idPlantilla: data.idPlantilla ?? null,
            codigo: data.codigo,
            titulo: data.titulo,
            // El esquema de la API no expone "diagnostico" en el DTO de
            // request, pero el GET de listado sí lo acepta como filtro. Se
            // envía igual por si el backend lo persiste; si lo ignora, no
            // afecta el resto del payload.
            diagnostico: data.diagnostico,
            cie10Cods: data.cie10Cods || [],
            recomendacionIds: data.recomendacionIds || [],
            recomendacionesNuevas: data.recomendacionesNuevas || [],
            restriccionIds: data.restriccionIds || [],
            restriccionesNuevas: data.restriccionesNuevas || [],
            usuarioCreacion,
        },
        token
    );

export const eliminarPlantillaDiagnostico = (id, token) =>
    deleteJson(`/api/v01/ct/plantillaDiagnostico/eliminar/${id}`, token);
