import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faCircleCheck, faImage, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";

export default function CampaniaCard({ campania, activa, onToggle }) {
    const { codigo, nombre, empresa, fechaCampania, fotoUrl } = campania;

    return (
        <article
            className={`flex flex-col gap-3 rounded-xl border-2 p-4 shadow-sm transition-shadow hover:shadow-md ${
                activa ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"
            }`}
        >
            <div className="flex items-start gap-3">
                {fotoUrl ? (
                    <img src={fotoUrl} alt="" className="h-16 w-16 flex-shrink-0 rounded-lg border bg-white object-contain p-1" />
                ) : (
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border bg-gray-100 text-2xl text-gray-300">
                        <FontAwesomeIcon icon={faImage} />
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="break-all text-xs font-semibold tracking-wide text-gray-500">{codigo}</span>
                        {activa && (
                            <span className="flex flex-shrink-0 items-center gap-1 rounded-full bg-green-600 px-2 py-0.5 text-xs font-bold text-white">
                                <FontAwesomeIcon icon={faCircleCheck} /> ACTIVA
                            </span>
                        )}
                    </div>
                    <h3 className="break-words font-bold leading-tight text-primario">{nombre}</h3>
                    {empresa && <p className="break-words text-sm text-gray-600">{empresa}</p>}
                </div>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
                <span className="flex items-center gap-1.5 text-sm text-gray-600">
                    <FontAwesomeIcon icon={faCalendarDays} />
                    {formatearFechaCorta(fechaCampania?.slice(0, 10))}
                </span>
                <button
                    type="button"
                    onClick={() => onToggle(campania)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        activa
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                >
                    <FontAwesomeIcon icon={faPowerOff} />
                    {activa ? "Desactivar" : "Activar"}
                </button>
            </div>
        </article>
    );
}
