import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const UMBRAL_CERCANIA_PORCENTAJE = 20;

const ESTILO_STOCK = {
    critico: { punto: "bg-red-400", texto: "text-red-600", titulo: "Stock igual o menor al mínimo" },
    cercano: { punto: "bg-orange-400", texto: "text-orange-600", titulo: "Stock cerca del mínimo" },
};

// 'critico' si el stock llegó al mínimo, 'cercano' si está a menos de un 20% sobre él, null si no hay problema
const getEstadoStock = (stockActual, stockMinimo) => {
    const actual = stockActual ?? 0;
    const minimo = stockMinimo ?? 0;
    if (minimo <= 0) return null;
    if (actual <= minimo) return "critico";
    return ((actual - minimo) / minimo) * 100 <= UMBRAL_CERCANIA_PORCENTAJE ? "cercano" : null;
};

const ENCABEZADO = "px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500";
const SECUNDARIA = "hidden md:table-cell"; // en pantallas chicas solo quedan Nombre, Presentación, Stock y el «+»

// Clic en la fila: ver el detalle. El «+» de la última columna abre el ingreso de stock sin abrir el detalle.
export default function MedicamentosTabla({ medicamentos, numeroInicial, emptyText, onSeleccionar, onIngresarStock }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className={`${ENCABEZADO} ${SECUNDARIA}`}>N°</th>
                        <th className={ENCABEZADO}>Nombre</th>
                        <th className={`${ENCABEZADO} ${SECUNDARIA}`}>Uso</th>
                        <th className={ENCABEZADO}>Presentación</th>
                        <th className={`${ENCABEZADO} ${SECUNDARIA}`}>Stock mínimo</th>
                        <th className={`${ENCABEZADO} w-16`}>Stock</th>
                        <th className={`${ENCABEZADO} w-10`}></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {medicamentos.map((medicamento, i) => {
                        const estado = getEstadoStock(medicamento.stockActual, medicamento.stockMinimo);
                        const estilo = ESTILO_STOCK[estado];
                        return (
                            <tr
                                key={medicamento.id}
                                onClick={() => onSeleccionar(medicamento)}
                                className="cursor-pointer transition-colors hover:bg-blue-50"
                                title="Clic para ver el detalle"
                            >
                                <td className={`px-3 py-3 text-gray-500 ${SECUNDARIA}`}>{numeroInicial + i}</td>
                                <td className="px-3 py-3 font-semibold text-gray-800">{medicamento.nombre}</td>
                                <td className={`px-3 py-3 text-gray-700 ${SECUNDARIA}`}>{medicamento.uso}</td>
                                <td className="px-3 py-3 text-gray-700">{medicamento.presentacion}</td>
                                <td className={`px-3 py-3 text-gray-700 ${SECUNDARIA}`}>{medicamento.stockMinimo}</td>
                                <td className="px-3 py-3 font-semibold">
                                    <span className="inline-flex items-center gap-2" title={estilo?.titulo}>
                                        {estilo && <span className={`h-2 w-2 shrink-0 rounded-full ${estilo.punto}`} />}
                                        <span className={estilo?.texto ?? "text-gray-700"}>{medicamento.stockActual ?? 0}</span>
                                    </span>
                                </td>
                                <td className="px-2 py-3 text-center">
                                    <button
                                        type="button"
                                        title="Agregar stock"
                                        aria-label={`Agregar stock a ${medicamento.nombre}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onIngresarStock(medicamento);
                                        }}
                                        className="azul-btn inline-flex h-7 w-7 items-center justify-center rounded-full"
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    {medicamentos.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-2 py-8 text-center text-gray-500">
                                {emptyText}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
