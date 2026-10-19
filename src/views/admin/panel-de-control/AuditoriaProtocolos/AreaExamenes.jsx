import ExamenPad from "./ExamenPad";
import { resumirExamenes } from "./controllerAuditoriaProtocolos";
import { formularioDe } from "./formulariosExamen";

// Un área del protocolo con sus exámenes y cuántos lleva completos.
// `onSeleccionar(examen)` se dispara solo en los exámenes que ya tienen formulario.
export default function AreaExamenes({ area, onSeleccionar }) {
    const { completos, total } = resumirExamenes(area.examenes);

    return (
        <section className="space-y-2">
            <div className="flex items-center justify-between gap-2 border-b border-gray-300 pb-1">
                <h3 className="break-words font-bold text-primario">{area.nombre}</h3>
                <span className={`flex-shrink-0 text-sm font-semibold ${completos === total ? "text-green-700" : "text-red-700"}`}>
                    {completos}/{total}
                </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {area.examenes.map((examen) => (
                    <ExamenPad
                        key={`${examen.adicional ? "adicional" : "protocolo"}-${examen.id}`}
                        examen={examen}
                        onClick={formularioDe(examen) ? () => onSeleccionar(examen) : undefined}
                    />
                ))}
            </div>
        </section>
    );
}
