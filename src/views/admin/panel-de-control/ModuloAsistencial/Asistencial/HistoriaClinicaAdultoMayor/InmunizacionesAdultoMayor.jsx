import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { InputTextOneLine, SectionFieldset } from "../../../../../components/reusableComponents/ResusableComponents";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";

/**
 * Inmunizaciones de la Historia Clínica del Adulto Mayor.
 *
 * El backend maneja las vacunas como una lista que solo crece: las ya registradas llegan en
 * `vacunas` (con id, de solo lectura; se eliminan una a una con su propio endpoint) y las que se
 * agregan en este registro viajan en `vacunasNuevas`.
 */
export default function InmunizacionesAdultoMayor({
    vacunas = [],
    vacunasNuevas = [],
    disabled = false,
    onChangeNueva,
    onAgregar,
    onQuitar,
    onEliminar,
}) {
    return (
        <SectionFieldset legend="Inmunizaciones" className="space-y-4">
            {vacunas.length > 0 && (
                <div className="space-y-2">
                    <p className="font-semibold">Vacunas registradas</p>
                    <ul className="divide-y divide-gray-300 border border-gray-300 rounded bg-white">
                        {vacunas.map((v) => (
                            <li key={v.id} className="flex items-center gap-3 px-3 py-2">
                                <span className="font-semibold flex-1 min-w-0 break-words">{v.vacuna}</span>
                                <span className="shrink-0 text-gray-600">{formatearFechaCorta(v.fecha) || "Sin fecha"}</span>
                                <button
                                    type="button"
                                    onClick={() => onEliminar(v.id)}
                                    disabled={disabled}
                                    title="Eliminar vacuna"
                                    aria-label={`Eliminar vacuna ${v.vacuna}`}
                                    className="shrink-0 w-8 h-8 inline-flex items-center justify-center rounded text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="space-y-3">
                <p className="font-semibold">Nuevas vacunas</p>
                {vacunasNuevas.map((v, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-2 pb-3 border-b border-gray-300 last:border-b-0 last:pb-0"
                    >
                        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                            <InputTextOneLine
                                label="Vacuna"
                                name={`vacunaNueva_${index}`}
                                value={v.vacuna}
                                onChange={(e) => onChangeNueva(index, "vacuna", e.target.value.toUpperCase())}
                                disabled={disabled}
                                labelWidth="70px"
                            />
                            <InputTextOneLine
                                label="Fecha"
                                name={`fechaVacunaNueva_${index}`}
                                type="date"
                                value={v.fecha}
                                onChange={(e) => onChangeNueva(index, "fecha", e.target.value)}
                                disabled={disabled}
                                labelWidth="70px"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => onQuitar(index)}
                            disabled={disabled}
                            title="Quitar fila"
                            aria-label="Quitar fila de vacuna"
                            className="shrink-0 w-8 h-8 mt-0.5 inline-flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={onAgregar}
                    disabled={disabled}
                    className="
                        bg-emerald-600 hover:bg-emerald-700
                        text-white text-sm px-3 py-1.5 rounded
                        inline-flex items-center gap-2
                        transition-all duration-150 ease-out
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-600
                        active:scale-95"
                >
                    <FontAwesomeIcon icon={faPlus} /> Agregar vacuna
                </button>
            </div>
        </SectionFieldset>
    );
}
