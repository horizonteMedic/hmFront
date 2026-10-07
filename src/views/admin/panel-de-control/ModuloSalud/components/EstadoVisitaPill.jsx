const ESTILOS = {
    ABIERTA: "bg-green-100 text-green-700",
    CERRADA: "bg-gray-200 text-gray-700",
    ANULADA: "bg-red-100 text-red-700",
};

// Estado de una visita (ABIERTA | CERRADA | ANULADA)
export default function EstadoVisitaPill({ estado }) {
    return (
        <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${ESTILOS[estado] ?? ESTILOS.CERRADA}`}>
            {estado}
        </span>
    );
}
