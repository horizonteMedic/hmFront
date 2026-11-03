// Patologías del paciente que la Historia Clínica no tiene como ítem fijo (solo lectura).
// `items`: textos ya redactados (ver patologiasAdicionales en catalogoPatologias.js). Sin ítems no se muestra.
export default function PatologiasAdicionales({ items = [] }) {
    if (items.length === 0) return null;

    return (
        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3">
            <h4 className="mb-2 font-semibold text-blue-800">Patologías Adicionales</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1">
                {items.map((item) => (
                    <li key={item} className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" checked readOnly disabled />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
