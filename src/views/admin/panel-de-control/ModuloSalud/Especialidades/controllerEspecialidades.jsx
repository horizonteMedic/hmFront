import { getLista, patchJson, postJson } from "../utils/apiSalud";

const URL_ESPECIALIDADES = "/api/especialidades";

const porNombre = (a, b) => (a.nombre ?? "").localeCompare(b.nombre ?? "", "es");

// Especialidades de UNA campaña, activas o no (para administrarlas). Cada campaña tiene las suyas: sin
// `campaniaId` el backend trae las de todas mezcladas, por eso nunca se piden sin él.
export const getEspecialidades = async (campaniaId, token) => {
    const especialidades = await getLista(
        `${URL_ESPECIALIDADES}?${new URLSearchParams({ campaniaId, soloActivas: true })}`,
        token,
        "No se pudo cargar la lista de especialidades"
    );
    return especialidades.sort(porNombre);
};

// Solo las activas: son las que se asignan a cada visita nueva.
export const getEspecialidadesActivas = async (campaniaId, token) =>
    (await getEspecialidades(campaniaId, token)).filter((especialidad) => especialidad.activo);

// El nombre debe ser único dentro de la campaña (el backend lo valida y responde con su mensaje).
export const crearEspecialidad = (nombre, campaniaId, token) =>
    postJson(URL_ESPECIALIDADES, { campaniaId, nombre: nombre.trim() }, token, "No se pudo registrar la especialidad");

export const cambiarEstadoEspecialidad = (id, activar, token) =>
    patchJson(
        `${URL_ESPECIALIDADES}/${id}/${activar ? "activar" : "desactivar"}`,
        token,
        "No se pudo actualizar la especialidad"
    );
