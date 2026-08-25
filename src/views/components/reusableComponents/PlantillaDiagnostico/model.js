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

const postJson = (url, body, token) =>
    fetch(`${URLAzure}${url}`, {
        method: "POST",
        headers: jsonHeaders(token),
        body: JSON.stringify(body),
    }).then((res) => (res.ok ? res.json() : res));

const putJson = (url, body, token) =>
    fetch(`${URLAzure}${url}`, {
        method: "PUT",
        headers: jsonHeaders(token),
        body: JSON.stringify(body),
    }).then((res) => (res.ok ? res.json() : res));

const deleteJson = (url, token) =>
    fetch(`${URLAzure}${url}`, {
        method: "DELETE",
        headers: jsonHeaders(token),
    }).then((res) => (res.ok ? { ok: true } : res));

// ---------- CIE10 (solo búsqueda, catálogo existente) ----------
export const buscarCie10 = (q, token) =>
    getFetch(`/api/v01/ct/cie10/buscar?q=${encodeURIComponent(q)}`, token).then(
        (res) => res?.resultado || []
    );

// ---------- Recomendación ----------
export const getRecomendaciones = (filtro, token) =>
    getFetch(`/api/v01/ct/recomendacion${buildQuery({ filtro })}`, token);

export const getRecomendacion = (id, token) =>
    getFetch(`/api/v01/ct/recomendacion/${id}`, token);

export const crearRecomendacion = (descripcion, usuarioCreacion, token) =>
    postJson(
        `/api/v01/ct/recomendacion${buildQuery({ usuarioCreacion })}`,
        { id: null, descripcion },
        token
    );

export const actualizarRecomendacion = (id, descripcion, token) =>
    putJson(`/api/v01/ct/recomendacion/${id}`, { id, descripcion }, token);

export const eliminarRecomendacion = (id, token) =>
    deleteJson(`/api/v01/ct/recomendacion/${id}`, token);

// ---------- Restricción ----------
export const getRestricciones = (filtro, token) =>
    getFetch(`/api/v01/ct/restriccion${buildQuery({ filtro })}`, token);

export const getRestriccion = (id, token) =>
    getFetch(`/api/v01/ct/restriccion/${id}`, token);

export const crearRestriccion = (descripcion, usuarioCreacion, token) =>
    postJson(
        `/api/v01/ct/restriccion${buildQuery({ usuarioCreacion })}`,
        { id: null, descripcion },
        token
    );

export const actualizarRestriccion = (id, descripcion, token) =>
    putJson(`/api/v01/ct/restriccion/${id}`, { id, descripcion }, token);

export const eliminarRestriccion = (id, token) =>
    deleteJson(`/api/v01/ct/restriccion/${id}`, token);

// ---------- Plantilla de Diagnóstico ----------
export const getPlantillasDiagnostico = (filtros, token) =>
    getFetch(
        `/api/v01/ct/plantillaDiagnostico${buildQuery({
            titulo: filtros?.titulo,
            codigo: filtros?.codigo,
            diagnostico: filtros?.diagnostico,
            cie10: filtros?.cie10,
        })}`,
        token
    );

export const getPlantillaDiagnostico = (id, token) =>
    getFetch(`/api/v01/ct/plantillaDiagnostico/${id}`, token);

const buildPlantillaBody = (data) => ({
    codigo: data.codigo,
    titulo: data.titulo,
    // El esquema de la API no expone "diagnostico" en el DTO de request, pero el
    // GET de listado sí lo acepta como filtro. Se envía igual por si el backend
    // lo persiste; si lo ignora, no afecta el resto del payload.
    diagnostico: data.diagnostico,
    cie10Cods: data.cie10Cods || [],
    recomendacionIds: data.recomendacionIds || [],
    recomendacionesNuevas: data.recomendacionesNuevas || [],
    restriccionIds: data.restriccionIds || [],
    restriccionesNuevas: data.restriccionesNuevas || [],
});

export const crearPlantillaDiagnostico = (data, usuarioCreacion, token) =>
    postJson(
        `/api/v01/ct/plantillaDiagnostico${buildQuery({ usuarioCreacion })}`,
        buildPlantillaBody(data),
        token
    );

export const actualizarPlantillaDiagnostico = (id, data, usuarioCreacion, token) =>
    putJson(
        `/api/v01/ct/plantillaDiagnostico/${id}${buildQuery({ usuarioCreacion })}`,
        buildPlantillaBody(data),
        token
    );

export const eliminarPlantillaDiagnostico = (id, token) =>
    deleteJson(`/api/v01/ct/plantillaDiagnostico/${id}`, token);
