// Cómo se ve cada estado de una fila en la tabla de las cargas masivas
export const ESTADO_FILA = {
    pendiente: { etiqueta: "— Listo", fila: "" },
    sinCambios: { etiqueta: "= Sin cambios", fila: "text-gray-400" },
    invalida: { etiqueta: "⚠ Inválida", fila: "bg-yellow-50" },
    success: { etiqueta: "✔ Registrado", fila: "bg-green-50" },
    error: { etiqueta: "✖ Error", fila: "bg-red-50" },
};
