import { formatearFechaHora } from "../../../../../utils/formatDateUtils";
import { estadoDeReceta } from "./controllerReceta";

// Estado de la receta en su cabecera.
const ESTADOS_RECETA = {
    pendiente: { texto: "FALTA ENTREGAR", clases: "bg-amber-500 text-white" },
    entregada: { texto: "ENTREGADA", clases: "bg-emerald-100 text-emerald-700" },
    anulada: { texto: "ANULADA", clases: "bg-red-100 text-red-700" },
};

// Estado de cada medicamento dentro de la receta.
const ESTADOS_LINEA = {
    entregado: { texto: "ENTREGADO", clases: "bg-emerald-100 text-emerald-700" },
    pendiente: { texto: "FALTA ENTREGAR", clases: "bg-amber-100 text-amber-700" },
    anulado: { texto: "ANULADO", clases: "bg-red-100 text-red-700" },
};

const estadoLinea = (receta, detalle) => (receta.anulada ? "anulado" : receta.entregado || detalle.entregado ? "entregado" : "pendiente");

const ESTILOS = {
    pendiente: "border-amber-400 bg-amber-50 shadow-md",
    entregada: "border-gray-300 bg-white",
    anulada: "border-red-200 bg-red-50/40",
};

/**
 * Una receta YA GUARDADA del ticket (solo lectura), completa: cabecera con su N°, estado, fecha, usuario e inventario, y
 * la lista de medicamentos con el estado de cada uno. La receta pendiente (falta que farmacia la entregue) se destaca
 * con color ámbar para que se note de inmediato. `numero` es su orden dentro del ticket (1 = la más antigua).
 */
export default function RecetaGuardada({ receta, numero }) {
    const estado = estadoDeReceta(receta);
    const { texto, clases } = ESTADOS_RECETA[estado];
    const detalles = receta.detalles ?? [];

    return (
        <article className={`rounded-lg border-2 overflow-hidden ${ESTILOS[estado]}`}>
            <header className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 border-b border-inherit">
                <h3 className="font-semibold text-primario text-lg">Receta N° {numero}</h3>
                <span className={`px-2 py-0.5 rounded text-sm font-semibold whitespace-nowrap ${clases}`}>{texto}</span>
                <p className="text-sm text-gray-600">
                    Registrada {formatearFechaHora(receta.fechaRegistro) || "—"}
                    {receta.usuarioRegistro ? ` por ${receta.usuarioRegistro}` : ""}
                    {receta.inventarioNombre ? ` · ${receta.inventarioNombre}` : ""}
                </p>
                {estado === "entregada" && receta.fechaEntrega && (
                    <p className="text-sm text-emerald-700">Entregada {formatearFechaHora(receta.fechaEntrega)}</p>
                )}
            </header>

            {estado === "pendiente" && (
                <p className="px-3 py-2 text-sm text-amber-800 font-medium">
                    Falta que farmacia entregue esta receta (Inventario &gt; Entrega por Ticket). Mientras tanto no se puede modificar ni abrir otra receta.
                    {receta.conFaltante && " Tiene faltante de stock en algún medicamento."}
                </p>
            )}
            {estado === "anulada" && (
                <p className="px-3 py-2 text-sm text-red-700">
                    Receta anulada{receta.motivoAnulacion ? ` (motivo: ${receta.motivoAnulacion})` : ""}: ya no reserva medicamentos.
                </p>
            )}

            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead className="bg-[#233245] text-white">
                        <tr>
                            {["Medicamento", "Cantidad", "Indicación", "Estado"].map((titulo) => (
                                <th key={titulo} className="border px-2 py-1 text-left font-semibold">
                                    {titulo}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {detalles.length ? (
                            detalles.map((detalle) => {
                                const linea = estadoLinea(receta, detalle);
                                const { texto: textoLinea, clases: clasesLinea } = ESTADOS_LINEA[linea];
                                return (
                                    <tr key={detalle.id ?? detalle.medicamentoId} className="align-top">
                                        <td className="border px-2 py-1">
                                            {detalle.medicamentoNombre}
                                            {detalle.presentacion && <span className="text-gray-600"> · {detalle.presentacion}</span>}
                                        </td>
                                        <td className="border px-2 py-1">
                                            {detalle.cantidad}
                                            {detalle.cantidadFaltante > 0 && linea === "pendiente" && (
                                                <strong className="text-red-600"> (faltan {detalle.cantidadFaltante})</strong>
                                            )}
                                        </td>
                                        <td className="border px-2 py-1">{detalle.indicacion || "—"}</td>
                                        <td className="border px-2 py-1">
                                            <span className={`px-2 py-0.5 rounded text-sm font-semibold whitespace-nowrap ${clasesLinea}`}>{textoLinea}</span>
                                            {linea === "entregado" && (detalle.fechaEntrega || receta.fechaEntrega) && (
                                                <span className="block text-xs text-gray-500">{formatearFechaHora(detalle.fechaEntrega || receta.fechaEntrega)}</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={4} className="border px-2 py-3 text-center text-gray-500">
                                    La receta no tiene medicamentos
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </article>
    );
}
