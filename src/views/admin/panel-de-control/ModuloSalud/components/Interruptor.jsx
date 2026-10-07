// Interruptor encendido/apagado (accesible: role="switch"). `etiqueta` es su nombre para lectores de pantalla.
export default function Interruptor({ activo, onChange, etiqueta, disabled = false }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={activo}
            aria-label={etiqueta}
            disabled={disabled}
            onClick={() => onChange(!activo)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 ${
                activo ? "bg-green-500" : "bg-gray-300"
            }`}
        >
            <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    activo ? "translate-x-5" : "translate-x-0.5"
                }`}
            />
        </button>
    );
}
