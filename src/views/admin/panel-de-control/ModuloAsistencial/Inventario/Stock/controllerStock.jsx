import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { consultarInventario, inventarioUrl } from "../inventarioUtils";

const stockUrl = `${inventarioUrl}/stock`;

// Un lote que vence dentro de este número de días se marca "Por vencer" (solo es una ayuda visual: el
// vencimiento real lo decide el backend).
export const DIAS_ALERTA_VENCIMIENTO = 90;

// Stock por medicamento del inventario: actual, reservado, disponible y próximo vencimiento.
export const ObtenerStockResumen = (inventarioId, token) =>
    consultarInventario(
        `${stockUrl}/resumen?${new URLSearchParams({ inventarioId })}`,
        token,
        "No se pudo cargar el stock del inventario."
    );

// Lotes de un medicamento en el inventario, ya ordenados por el backend del que vence primero al último.
export const ObtenerLotesMedicamento = (inventarioId, medicamentoId, incluirVencidos, token) =>
    consultarInventario(
        `${stockUrl}/lotes?${new URLSearchParams({ inventarioId, medicamentoId, incluirVencidos })}`,
        token,
        "No se pudieron cargar los lotes del medicamento."
    );

// Texto de un lote en un select: "L-2301 · vence 15/03/2027 · actual 100 · disp. 90".
export const EtiquetaLote = (lote) =>
    `${lote.numeroLote || "Sin lote"} · vence ${formatearFechaCorta(lote.fechaVencimiento) || "—"}${lote.vencido ? " (VENCIDO)" : ""} · actual ${lote.cantidadActual} · disp. ${lote.cantidadDisponible}`;

export const OpcionesLote = (lotes) => lotes.map((lote) => ({ value: String(lote.id), label: EtiquetaLote(lote) }));

// Estado visual de un lote según su vencimiento.
export const EstadoLote = (lote) => {
    if (lote.vencido) return { texto: "Vencido", clases: "bg-red-100 text-red-700" };
    if (lote.diasParaVencer != null && lote.diasParaVencer <= DIAS_ALERTA_VENCIMIENTO) {
        return { texto: "Por vencer", clases: "bg-amber-100 text-amber-700" };
    }
    return { texto: "Vigente", clases: "bg-emerald-100 text-emerald-700" };
};
