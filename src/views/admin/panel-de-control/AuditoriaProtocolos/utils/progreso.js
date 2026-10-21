// Cuántos exámenes de la lista ya se realizaron.
export const resumirExamenes = (examenes) => ({
    total: examenes.length,
    completos: examenes.filter((examen) => examen.completado).length,
});
