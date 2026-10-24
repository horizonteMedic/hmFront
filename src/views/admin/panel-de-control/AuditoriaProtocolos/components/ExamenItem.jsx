import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const ESTADOS = {
    completo: { borde: "border-green-500", fondo: "bg-green-50", icono: faCircleCheck, colorIcono: "text-green-600", etiqueta: "Completo" },
    pendiente: { borde: "border-red-500", fondo: "bg-red-50", icono: faCircleXmark, colorIcono: "text-red-600", etiqueta: "Pendiente" },
};

// Fila de un examen del protocolo: verde si ya se realizó, roja si falta (el estado también va escrito y con ícono).
// Con `onClick` es un botón que abre el formulario; sin él queda atenuada porque el examen aún no tiene formulario.
export default function ExamenItem({ examen, seleccionado, onClick }) {
    const { borde, fondo, icono, colorIcono, etiqueta } = ESTADOS[examen.completado ? "completo" : "pendiente"];

    return (
        <button
            type="button"
            disabled={!onClick}
            onClick={onClick}
            aria-current={seleccionado ? "true" : undefined}
            title={onClick ? undefined : `Este examen aún no tiene formulario disponible (referenciaNp: ${JSON.stringify(examen.referenciaNp ?? null)})`}
            className={`flex w-full items-center gap-3 rounded-lg border-l-4 px-3 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${borde} ${fondo} ${
                seleccionado ? "ring-2 ring-blue-600 shadow-md" : "shadow-sm"
            } ${onClick ? "hover:shadow-md" : "cursor-default opacity-60"}`}
        >
            <FontAwesomeIcon icon={icono} className={`flex-shrink-0 text-lg ${colorIcono}`} />
            <span className="min-w-0 flex-1">
                <span className="block break-words text-base font-semibold leading-tight text-gray-900">{examen.nombre}</span>
                <span className="block text-xs font-bold uppercase tracking-wide text-gray-600">
                    {etiqueta}
                    {examen.adicional && " · Adicional"}
                </span>
            </span>
            {onClick && <FontAwesomeIcon icon={faChevronRight} className="flex-shrink-0 text-xs text-gray-500" />}
        </button>
    );
}
