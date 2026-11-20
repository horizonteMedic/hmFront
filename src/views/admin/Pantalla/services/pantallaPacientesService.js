import { getFetch } from "../../../utils/apiHelpers";

// Órdenes del rango de fechas con el estado de sus exámenes por área.
const URL_ESTADO_FECHAS = "/api/v01/ct/consentDigit/estadoExamenesProtocolo/fechas";

// Un área solo está completa al 100%: todos sus exámenes (del protocolo y adicionales) ya se realizaron.
const normalizarArea = ({ id, nombre, examenes = [], examenesAdicionales = [] }) => {
    const todos = [...examenes, ...examenesAdicionales];
    return {
        id,
        nombre,
        total: todos.length,
        completado: todos.length > 0 && todos.every((examen) => examen.pasoExamen),
    };
};

export const normalizarOrden = (orden) => {
    // Las áreas sin exámenes no aportan nada a la pantalla.
    const areas = (orden.areas ?? []).map(normalizarArea).filter((area) => area.total > 0);
    const completadas = areas.filter((area) => area.completado).length;

    return {
        id: orden.orden,
        nombres: orden.nombres,
        fecha: orden.fecha,
        hora: orden.hora,
        // Letra + color que identifican al paciente en sala (textoColor / codigoColor del backend).
        color: { letra: orden.textoColor, hex: orden.codigoColor },
        areas,
        // id del área -> área, para ubicarla en la columna que le corresponde.
        areasPorId: Object.fromEntries(areas.map((area) => [area.id, area])),
        total: areas.length,
        completadas,
        finalizado: areas.length > 0 && completadas === areas.length,
    };
};

export const getPacientesPantalla = async ({ fechaInicio, fechaFin }, token, signal) => {
    const query = new URLSearchParams({ fechaInicio, fechaFin });
    const res = await getFetch(`${URL_ESTADO_FECHAS}?${query}`, token, signal);

    // Se acepta la lista directa o el envoltorio { resultado } de otros endpoints.
    const cuerpo = res?.resultado ?? res;
    if (res?.error || !Array.isArray(cuerpo)) {
        const error = new Error("Respuesta inesperada del estado de pacientes");
        error.status = res?.status;
        throw error;
    }
    return cuerpo.map(normalizarOrden);
};
