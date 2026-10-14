import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusMinus } from "@fortawesome/free-solid-svg-icons";
import { formatearPrecio } from "./controllerProductosEnInventario";

const ENCABEZADO = "px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500";
const SECUNDARIA = "hidden md:table-cell"; // en pantallas chicas solo quedan Nombre, Presentación, Stock y el botón de ajuste

// Clic en la fila: ver el detalle. El botón «±» de la última columna abre el ajuste de stock sin abrir el detalle.
export default function MedicamentosTabla({ medicamentos, numeroInicial, emptyText, onSeleccionar, onAjustarStock }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className={`${ENCABEZADO} ${SECUNDARIA}`}>N°</th>
                        <th className={ENCABEZADO}>Nombre</th>
                        <th className={`${ENCABEZADO} ${SECUNDARIA}`}>Uso</th>
                        <th className={ENCABEZADO}>Presentación</th>
                        <th className={`${ENCABEZADO} ${SECUNDARIA}`}>Precio unit.</th>
                        <th className={`${ENCABEZADO} w-16`}>Stock</th>
                        <th className={`${ENCABEZADO} w-10`}></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {medicamentos.map((medicamento, i) => {
                        const stock = medicamento.stockActual ?? 0;
                        const sinStock = stock <= 0;
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
                                <td className={`whitespace-nowrap px-3 py-3 text-gray-700 ${SECUNDARIA}`}>
                                    {formatearPrecio(medicamento.precioUnitario)}
                                </td>
                                <td className={`px-3 py-3 font-semibold ${sinStock ? "text-red-600" : "text-gray-700"}`} title={sinStock ? "Sin stock" : undefined}>
                                    {stock}
                                </td>
                                <td className="px-2 py-3 text-center">
                                    <button
                                        type="button"
                                        title="Ajustar stock"
                                        aria-label={`Ajustar stock de ${medicamento.nombre}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAjustarStock(medicamento);
                                        }}
                                        className="azul-btn inline-flex h-7 w-7 items-center justify-center rounded-full"
                                    >
                                        <FontAwesomeIcon icon={faPlusMinus} className="text-xs" />
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
