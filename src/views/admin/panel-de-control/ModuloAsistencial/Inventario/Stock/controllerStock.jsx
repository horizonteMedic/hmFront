import ExcelJS from "exceljs";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { agregarHoja, descargarLibro, nombreSeguro } from "../Compartido/excelInventario";
import { consultarInventario, hoyISO, inventarioUrl } from "../Compartido/inventarioUtils";

const stockUrl = `${inventarioUrl}/stock`;

// Un lote que vence dentro de este número de días se marca "Por vencer" (solo es una ayuda visual: el
// vencimiento real lo decide el backend).
export const DIAS_ALERTA_VENCIMIENTO = 90;

// Stock por medicamento del inventario: físico, reservado, disponible, mínimo, próximo vencimiento y si requiere reposición.
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

// Unidades que faltan para volver al stock mínimo (0 si ya lo alcanzó).
export const Faltante = (fila) => Math.max((Number(fila.stockMinimo) || 0) - (Number(fila.cantidadDisponible) || 0), 0);

// Lo más urgente (mayor faltante) primero; a igual faltante, por nombre.
export const OrdenarPorUrgencia = (filas) =>
    [...filas].sort((a, b) => Faltante(b) - Faltante(a) || String(a.nombre ?? "").localeCompare(String(b.nombre ?? ""), "es"));

// Columnas del Excel de stock. Lleva todas, estén o no ocultas en la tabla de la pantalla.
const columnasExcel = [
    { etiqueta: "N°", ancho: 6, valor: (_, i) => i + 1 },
    { etiqueta: "Medicamento", ancho: 38, valor: (fila) => fila.nombre },
    { etiqueta: "Presentación", ancho: 18, valor: (fila) => fila.presentacion },
    { etiqueta: "Tipo", ancho: 20, valor: (fila) => fila.tipoMedicamentoDescripcion },
    { etiqueta: "Stock Físico", ancho: 13, valor: (fila) => fila.cantidadActual },
    { etiqueta: "Stock Reservado", ancho: 16, valor: (fila) => fila.cantidadReservada },
    { etiqueta: "Stock Disponible", ancho: 16, valor: (fila) => fila.cantidadDisponible },
    { etiqueta: "Stock Mínimo", ancho: 13, valor: (fila) => fila.stockMinimo },
    { etiqueta: "Faltante para el mínimo", ancho: 17, valor: (fila) => Faltante(fila) },
    { etiqueta: "Próx. Vencimiento", ancho: 16, valor: (fila) => formatearFechaCorta(fila.proximoVencimiento) || "—" },
    { etiqueta: "Estado", ancho: 12, valor: (fila) => (fila.requiereReposicion ? "Reponer" : "Suficiente") },
];

// Exporta las filas que recibe, todas (no solo la página que se ve en pantalla), a un Excel. Con `soloReposicion` el archivo
// es la lista de alertas de reposición.
export const DescargarStockExcel = async (filas, inventario, soloReposicion) => {
    const libro = new ExcelJS.Workbook();
    const titulo = soloReposicion ? "ALERTAS DE REPOSICIÓN" : "STOCK";
    agregarHoja(libro, soloReposicion ? "ALERTAS" : "STOCK", `${titulo} | ${inventario.nombre} | ${formatearFechaCorta(hoyISO())}`, columnasExcel, filas);

    const prefijo = soloReposicion ? "Alertas_reposicion" : "Stock";
    await descargarLibro(libro, `${prefijo}_${nombreSeguro(inventario.nombre)}_${hoyISO()}.xlsx`);
};

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
