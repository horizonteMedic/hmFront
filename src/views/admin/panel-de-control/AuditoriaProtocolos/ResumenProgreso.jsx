import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

// Avance de la orden (exámenes completos / total) y leyenda de colores de los pads.
export default function ResumenProgreso({ completos, total }) {
    const porcentaje = total ? Math.round((completos / total) * 100) : 0;
    const terminada = total > 0 && completos === total;

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-gray-800">
                    {completos} de {total} exámenes completos
                </p>
                {terminada && (
                    <span className="flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-0.5 text-xs font-bold text-white">
                        <FontAwesomeIcon icon={faCircleCheck} /> ORDEN COMPLETA
                    </span>
                )}
            </div>

            <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={completos}
                className="mt-2 h-2.5 overflow-hidden rounded-full bg-red-200"
            >
                <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${porcentaje}%` }} />
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-green-500" /> Completo
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-red-500" /> Pendiente
                </span>
            </div>
        </section>
    );
}
