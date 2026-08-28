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

const getJson = (url, token) => getFetch(url, token).then(unwrap);

// ---------- CIE10 (solo búsqueda, catálogo existente) ----------
export const buscarCie10 = (q, token) =>
    getJson(`/api/v01/ct/cie10/buscar?q=${encodeURIComponent(q)}`, token).then(
        (res) => res || []
    );

// ---------- Recomendación ----------
// El GET ya no acepta filtro por query: siempre trae el listado completo de
// activas y se filtra en el front (ver useCatalogoSimple/CreatableMultiSelect).
export const getRecomendaciones = (token) => getJson(`/api/v01/ct/recomendacion`, token);

// Registra (id null) o actualiza (id enviado) una recomendación. Ya no hay
// endpoint de eliminación.
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

// ---------- Diagnóstico (antes "Plantilla de Diagnóstico") ----------
// PENDIENTE: el backend confirmó que también cambiaron los endpoints GET
// (listado con filtros y obtener por id) de este recurso, pero aún no
// mandaron el nuevo contrato. Mientras tanto se deja apuntando al contrato
// anterior (/api/v01/ct/plantillaDiagnostico) como placeholder: el buscador
// y "editar/clonar" van a fallar (mostrarán "sin resultados") hasta que se
// actualice esto con el nuevo swagger.
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

// Registra (POST /diagnostico/registrar, sin id) o actualiza
// (POST /diagnostico/actualizar, con id) un diagnóstico. Ya no admite crear
// recomendaciones/restricciones "al vuelo": solo ids ya existentes
// (idsRecomendacion / idsRestriccion). Tampoco hay endpoint de eliminación.
export const guardarPlantillaDiagnostico = (data, usuario, token) => {
    const body = {
        id: data.id ?? null,
        codigo: data.codigo,
        titulo: data.titulo,
        diagnostico: data.diagnostico,
        cie10Cods: data.cie10Cods || [],
        idsRestriccion: data.idsRestriccion || [],
        idsRecomendacion: data.idsRecomendacion || [],
        usuarioRegistro: usuario,
        usuarioActualizacion: usuario,
    };
    const url = data.id
        ? `/api/v01/ct/diagnostico/actualizar`
        : `/api/v01/ct/diagnostico/registrar`;
    return postJson(url, body, token);
};
