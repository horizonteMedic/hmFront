// Caja de texto para editar un valor dentro de una celda de tabla (lote, vencimiento, cantidad...). Con `error`
// se marca en rojo y el mensaje sale al pasar el mouse. Es de ancho completo para llenar la celda, y los clics no
// llegan a la fila (que puede tener su propio onRowClick).
export default function InputCelda({ error, className = "", ...props }) {
    return (
        <input
            {...props}
            title={error || props.title}
            aria-invalid={Boolean(error)}
            onClick={(e) => e.stopPropagation()}
            className={`w-full min-w-0 rounded border px-1.5 py-0.5 text-base text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
            } ${className}`}
        />
    );
}
