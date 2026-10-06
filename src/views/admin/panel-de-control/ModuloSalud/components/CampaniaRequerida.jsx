import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";

// Pantalla de espera para las secciones que solo funcionan dentro de una campaña.
// El botón solo aparece si `onIrACampanias` existe (es decir, si el usuario puede entrar a Campañas).
export default function CampaniaRequerida({ mensaje, onIrACampanias }) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-yellow-400 bg-yellow-50 px-6 py-10 text-center text-yellow-900">
            <FontAwesomeIcon icon={faBullhorn} className="text-4xl text-yellow-500" />
            <h3 className="text-lg font-bold">Primero activa una campaña</h3>
            <p className="max-w-md text-sm">{mensaje}</p>
            {onIrACampanias && (
                <button
                    type="button"
                    onClick={onIrACampanias}
                    className="mt-1 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                >
                    <FontAwesomeIcon icon={faBullhorn} /> Ir a Campañas
                </button>
            )}
        </div>
    );
}
