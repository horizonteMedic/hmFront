import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

// Aviso de la campaña activa de la sesión (verde) o, si no hay ninguna, de que falta activarla (amarillo).
// `hint` es lo que se muestra cuando no hay campaña activa.
export default function CampaniaActivaBanner({ campania, hint = "No hay ninguna campaña activa.", className = "" }) {
    if (!campania) {
        return (
            <div className={`flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm text-yellow-800 ${className}`}>
                <FontAwesomeIcon icon={faTriangleExclamation} className="flex-shrink-0" />
                <span>{hint}</span>
            </div>
        );
    }

    const detalle = [campania.codigo, campania.empresa].filter(Boolean).join(" · ");

    return (
        <div className={`flex items-center gap-3 rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-green-800 ${className}`}>
            {campania.fotoUrl && <img src={campania.fotoUrl} alt="" className="h-10 flex-shrink-0 rounded object-contain" />}
            <div className="flex min-w-0 flex-col leading-tight">
                <span className="text-xs font-medium text-green-600">Campaña activa</span>
                <span className="break-words text-sm font-bold">{campania.nombre}</span>
                {detalle && <span className="break-words text-xs text-green-600">{detalle}</span>}
            </div>
        </div>
    );
}
