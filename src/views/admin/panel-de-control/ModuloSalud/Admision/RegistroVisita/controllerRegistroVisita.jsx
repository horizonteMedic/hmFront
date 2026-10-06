import { getFetch } from "../../../../../utils/apiHelpers";
import { getJson, getLista, postJson } from "../../utils/apiSalud";

const URL_VISITAS = "/api/visitas";
const URL_BUSCAR_VISITAS = "/api/visitas/buscar";
const URL_REPORTE_VISITAS = "/api/reportes/visitas";
const URL_PACIENTE_DNI = "/api/pacientes/buscar-por-dni";
const URL_PACIENTE_NOMBRE = "/api/pacientes/buscar-por-nombre-apellido";

// Visitas de UNA campaña. El `norden` se reinicia en 1 en cada campaña, así que la lista
// siempre se pide filtrada: sin `codigoCampania` el backend mezcla las visitas de todas.
export const getVisitas = (codigoCampania, token) =>
    getLista(
        `${URL_REPORTE_VISITAS}?${new URLSearchParams({ codigoCampania })}`,
        token,
        "No se pudo cargar la lista de visitas"
    );

export const crearVisita = ({ campaniaId, pacienteId, especialidadIds, usuarioRegistro }, token) =>
    postJson(
        URL_VISITAS,
        { campaniaId, pacienteId, especialidadIds, usuarioRegistro },
        token,
        "No se pudo registrar la visita"
    );

// Detalle completo: { visita, paciente (con parentescos), fichas (con medicamentos entregados) }
export const getVisitaById = (visitaId, token) =>
    getJson(`${URL_VISITAS}/${visitaId}`, token, "No se pudo obtener el detalle de la visita");

const listaOVacia = (res) => (Array.isArray(res) ? res : []);

// Primer paciente que coincide con el DNI o, si no hay, con los nombres escritos (null si no hay ninguno)
export const buscarPaciente = async ({ dni, nombres }, token) => {
    const url = dni
        ? `${URL_PACIENTE_DNI}?${new URLSearchParams({ dni })}`
        : `${URL_PACIENTE_NOMBRE}?${new URLSearchParams({ texto: nombres })}`;
    return listaOVacia(await getFetch(url, token))[0] ?? null;
};

// Todas las visitas del paciente, de cualquier campaña (la búsqueda no filtra por campaña)
export const buscarVisitasPrevias = async (dni, token) =>
    dni ? listaOVacia(await getFetch(`${URL_BUSCAR_VISITAS}?${new URLSearchParams({ dni })}`, token)) : [];
