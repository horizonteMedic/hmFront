import { getFetch } from "../../../../utils/apiHelpers";

const urlBuscarReniec = "/api/pacientes-asistencial/reniec/buscar";
const LIMITE_RESULTADOS = 100;

export const buscarPersonasReniec = async (params, token) => {
    const query = new URLSearchParams();
    if (params.nombres) query.set("nombres", params.nombres);
    if (params.apellidoPaterno) query.set("apellidoPaterno", params.apellidoPaterno);
    if (params.apellidoMaterno) query.set("apellidoMaterno", params.apellidoMaterno);
    query.set("limit", LIMITE_RESULTADOS);

    const res = await getFetch(`${urlBuscarReniec}?${query.toString()}`, token);
    return Array.isArray(res?.resultado) ? res.resultado : [];
};

export const LIMITE_RESULTADOS_RENIEC = LIMITE_RESULTADOS;
