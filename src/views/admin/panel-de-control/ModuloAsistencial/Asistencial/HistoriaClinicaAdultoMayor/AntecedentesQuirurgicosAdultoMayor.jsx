import { SectionFieldset } from "../../../../../components/reusableComponents/ResusableComponents";

const COLUMNAS = [
    { titulo: "Año", campo: "anio" },
    { titulo: "Hospital (Nombre - Lugar)", campo: "hospital" },
    { titulo: "Operación", campo: "operacion" },
    { titulo: "Días", campo: "diasHospitalizacion" },
    { titulo: "Complicaciones", campo: "complicaciones" },
];

/**
 * Antecedentes Quirúrgicos de la Historia Clínica del Adulto Mayor: solo lectura. El backend los entrega
 * en `antecedentesQuirurgicos` (readOnly) desde el registro de Antecedentes Patológicos del paciente;
 * se agregan o eliminan allí, no aquí.
 */
export default function AntecedentesQuirurgicosAdultoMayor({ quirurgicos = [] }) {
    return (
        <SectionFieldset legend="Antecedentes Quirúrgicos" collapsible className="space-y-3">
            <p className="text-sm italic text-gray-600">
                Solo lectura: se cargan desde Antecedentes Patológicos.
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead className="bg-blue-100">
                        <tr>
                            {COLUMNAS.map(({ titulo }) => (
                                <th key={titulo} className="px-3 py-2 text-left font-semibold border-b border-gray-300">
                                    {titulo}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {quirurgicos.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={COLUMNAS.length}
                                    className="px-4 py-6 text-center text-gray-500 bg-gray-300"
                                >
                                    No hay antecedentes quirúrgicos registrados
                                </td>
                            </tr>
                        ) : (
                            quirurgicos.map((reg, index) => (
                                <tr key={index} className="border-b border-gray-200 last:border-b-0">
                                    {COLUMNAS.map(({ campo }) => (
                                        <td key={campo} className="px-3 py-2 border-r border-gray-200 last:border-r-0 bg-gray-300">
                                            {reg[campo]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </SectionFieldset>
    );
}
