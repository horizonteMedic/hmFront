import { getFetch } from "../../../admin/panel-de-control/getFetch/getFetch";
import { URLAzure } from "../../../config/config";

const unwrap = (res) => (res && typeof res === "object" && "resultado" in res ? res.resultado : res);

const getJson = (url, token) => getFetch(url, token).then(unwrap);

export function getDiagnosticosRelacionados(setLoading, setLista, token) {
    setLoading(true);

    const list = getJson(`/api/v01/ct/diagnostico`, token);

    return Promise.resolve(list)
        .then((res) => setLista(Array.isArray(res) ? res : []))
        .catch(() => setLista([]))
        .finally(() => setLoading(false));

};

// Registra un diagnóstico nuevo (POST /api/v01/ct/diagnostico/registrar, sin
// id) junto con sus relaciones a CIE10, restricciones y recomendaciones.
// Devuelve el recurso creado ya "desenvuelto" si todo va bien, o la Response
// cruda si el backend responde con error (para poder leer el motivo).
export function registrarDiagnostico(body, token) {
    return fetch(`${URLAzure}/api/v01/ct/diagnostico/registrar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    }).then((res) => (res.ok ? res.json().then(unwrap) : res));
}
