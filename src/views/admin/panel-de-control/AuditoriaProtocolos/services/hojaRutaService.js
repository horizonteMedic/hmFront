import { getFetch } from "../../../../utils/apiHelpers";
import { validarSede } from "../../../../utils/registroOcupacionalUtils";

// Estado de los exámenes del protocolo de una orden, junto con los datos del paciente.
const URL_HOJA_RUTA = "/api/v01/ct/consentDigit/estadoExamenesProtocolo";

// Error con un mensaje pensado para el usuario (el resto de fallos se reemplaza por un texto genérico).
export class ErrorBusqueda extends Error { }

// La orden existe pero es de otra sede. Se distingue para avisarlo como en el resto de formularios
// (popup "Sede incorrecta"); `descripcionSede` es la sede a la que sí pertenece.
export class ErrorSedeIncorrecta extends ErrorBusqueda {
    constructor(orden, descripcionSede) {
        super(`El N° Orden ${orden} pertenece a otra sede.`);
        this.orden = orden;
        this.descripcionSede = descripcionSede;
    }
}

// Comprueba que la orden pertenezca a la sede del usuario (`codigo` = cod_sede) antes de pedir su hoja.
// Misma consulta que usan los formularios al buscar un N° Orden; si la sede no se pudo determinar no valida.
export const validarSedeOrden = async (orden, codigoSede, token) => {
    if (!codigoSede) return;
    const { estado, descripcionSede } = await validarSede(orden, codigoSede, token);
    if (estado === "ok") return;
    if (estado === "otraSede") throw new ErrorSedeIncorrecta(orden, descripcionSede);
    if (estado === "noEncontrado") throw new ErrorBusqueda(`No se encontró la orden ${orden}.`);
    throw new ErrorBusqueda(`No se pudo validar la sede de la orden ${orden}. Verifica el número e inténtalo de nuevo.`);
};

// `referenciaNp` indica qué formulario abre el examen (ver config/formulariosExamen.js); `pasoExamen`, si ya se realizó.
// `clave` identifica al examen dentro de la orden (un mismo id puede repetirse como adicional o en otra área).
const normalizarExamen = (areaId, examen, adicional) => ({
    clave: `${areaId}-${adicional ? "adicional" : "protocolo"}-${examen.id}`,
    id: examen.id,
    nombre: examen.nombre,
    referenciaNp: examen.referenciaNp,
    adicional,
    // TEMPORAL (pruebas): EKG siempre figura como realizado para poder abrir su reporte. Quitar el `||`.
    completado: examen.referenciaNp === "electrocardiograma" || Boolean(examen.pasoExamen),
});

// Cada área junta sus exámenes del protocolo y los adicionales en una sola lista.
const normalizarArea = ({ id, nombre, examenes = [], examenesAdicionales = [] }) => ({
    id,
    nombre,
    examenes: [
        ...examenes.map((examen) => normalizarExamen(id, examen, false)),
        ...examenesAdicionales.map((examen) => normalizarExamen(id, examen, true)),
    ],
});

export const getHojaRuta = async (orden, token) => {
    const res = await getFetch(`${URL_HOJA_RUTA}/${encodeURIComponent(orden)}`, token);
    if (res?.status === 404) throw new ErrorBusqueda(`No se encontró la orden ${orden}.`);

    // El endpoint responde con los datos directamente; también se acepta el envoltorio { codigo, resultado } de otros endpoints.
    const cuerpo = res?.resultado ?? res;
    if (res?.error || !cuerpo || !Array.isArray(cuerpo.areas)) throw new Error("Respuesta inesperada del estado de la orden");

    const { areas, ...datos } = cuerpo;
    return { ...datos, areas: areas.map(normalizarArea) };
};
