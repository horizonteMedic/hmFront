// Campos de los 32 dientes (d1..d32), que se resaltan y revierten en conjunto al editar un registro.
export const CAMPOS_DIENTES = Array.from({ length: 32 }, (_, i) => `d${i + 1}`);

// Observaciones y su CIE10 se revierten en conjunto.
export const CAMPOS_OBSERVACIONES = ["observaciones", "observacionesCie10"];
