import { getFetch } from "../../../utils/apiHelpers";

// TEMPORAL: endpoint de la hoja de ruta, usado como prueba hasta que exista el definitivo de auditoría.
const URL_HOJA_RUTA = "/api/v01/ct/consentDigit/infoFormatoHojaRutaProtocolo";

// Error con un mensaje pensado para el usuario (el resto de fallos se reemplaza por un texto genérico).
export class ErrorBusqueda extends Error {}

// `referenciaNp` indica qué formulario abre el examen (ver formulariosExamen.js); `pasoExamen`, si ya se realizó.
const normalizarExamen = (examen, adicional) => ({
    id: examen.id,
    nombre: examen.nombre,
    referenciaNp: examen.referenciaNp,
    adicional,
    completado: Boolean(examen.pasoExamen),
});

// Cada área junta sus exámenes del protocolo y los adicionales en una sola lista.
const normalizarArea = ({ id, nombre, examenes = [], examenesAdicionales = [] }) => ({
    id,
    nombre,
    examenes: [
        ...examenes.map((examen) => normalizarExamen(examen, false)),
        ...examenesAdicionales.map((examen) => normalizarExamen(examen, true)),
    ],
});

export const getHojaRuta = async (orden, token) => {
    const res = await getFetch(`${URL_HOJA_RUTA}/${encodeURIComponent(orden)}`, token);
    if (res?.status === 404) throw new ErrorBusqueda(`No se encontró la orden ${orden}.`);
    if (res?.error || res?.codigo !== 200 || !res.resultado) throw new Error("Respuesta inesperada de la hoja de ruta");

    const { areas = [], ...datos } = res.resultado;
    return { ...datos, areas: areas.map(normalizarArea) };
};

export const resumirExamenes = (examenes) => ({
    total: examenes.length,
    completos: examenes.filter((examen) => examen.completado).length,
});
