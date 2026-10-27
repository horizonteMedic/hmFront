/**
 * Columnas de la tabla: una por área, tomadas de todos los pacientes (no solo de la página visible)
 * para que no cambien al rotar de página. Ordenadas por id de área.
 */
export const armarColumnas = (pacientes) => {
    const columnas = new Map();
    pacientes.forEach((paciente) =>
        paciente.areas.forEach(({ id, nombre }) => columnas.set(id, { id, nombre }))
    );
    return [...columnas.values()].sort((a, b) =>
        String(a.id).localeCompare(String(b.id), undefined, { numeric: true })
    );
};
