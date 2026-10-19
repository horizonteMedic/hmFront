// Franja roja con el motivo por el que no se pudo cargar algo y, si se pasa `onRetry`, un botón para reintentar.
export default function AvisoError({ mensaje, onRetry, className = "mb-3" }) {
    if (!mensaje) return null;

    return (
        <div className={`flex items-center justify-between gap-4 p-3 rounded border border-red-300 bg-red-50 text-red-700 ${className}`}>
            <span>{mensaje}</span>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition-all duration-150 ease-out active:scale-95"
                >
                    Reintentar
                </button>
            )}
        </div>
    );
}
