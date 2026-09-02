import { getFetch } from "../../../admin/panel-de-control/getFetch/getFetch";

const unwrap = (res) => (res && typeof res === "object" && "resultado" in res ? res.resultado : res);

const getJson = (url, token) => getFetch(url, token).then(unwrap);

export function getDiagnosticosRelacionados(setLoading, setDiagnosticosRelacionados, token) {
    setLoading(true);

    const list = getJson(`/api/v01/ct/diagnostico`, token);

    return Promise.resolve(list)
        .then((res) => setDiagnosticosRelacionados(((prev) => ({ ...prev, lista: Array.isArray(res) ? res : [] }))))
        .catch(() => setDiagnosticosRelacionados((prev) => ({ ...prev, lista: [] })))
        .finally(() => setLoading(false));

};
