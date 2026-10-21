import ExamenItem from "./ExamenItem";
import { formularioDe } from "../config/formulariosExamen";
import { resumirExamenes } from "../utils/progreso";

// Exámenes de la orden agrupados por área, cada una con cuántos lleva completos.
// `onSeleccionar(examen)` se dispara solo en los exámenes que ya tienen formulario.
export default function ListaExamenes({ areas, seleccionada, onSeleccionar }) {
    return (
        <div className="space-y-4">
            {areas.map((area) => {
                const { completos, total } = resumirExamenes(area.examenes);

                return (
                    <section key={area.id} className="space-y-2">
                        <div className="flex items-center justify-between gap-2 border-b border-gray-200 pb-1">
                            <h3 className="break-words text-sm font-bold uppercase tracking-wide text-primario">{area.nombre}</h3>
                            <span className={`flex-shrink-0 text-xs font-bold ${completos === total ? "text-green-700" : "text-red-700"}`}>
                                {completos}/{total}
                            </span>
                        </div>
                        <div className="space-y-1.5">
                            {area.examenes.map((examen) => (
                                <ExamenItem
                                    key={examen.clave}
                                    examen={examen}
                                    seleccionado={examen.clave === seleccionada}
                                    onClick={formularioDe(examen) ? () => onSeleccionar(examen) : undefined}
                                />
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
