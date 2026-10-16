import ExcelJS from "exceljs";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { agregarHoja, descargarLibro, nombreSeguro } from "../excelInventario";
import { consultarInventario, hoyISO, inventarioUrl } from "../inventarioUtils";

const alertasUrl = `${inventarioUrl}/stock/alertas`;

// Medicamentos del inventario cuyo stock disponible llegó al mínimo o quedó por debajo.
export const ObtenerAlertasReposicion = (inventarioId, token) =>
    consultarInventario(
        `${alertasUrl}?${new URLSearchParams({ inventarioId })}`,
        token,
        "No se pudieron cargar las alertas de reposición."
    );

// Unidades que faltan para volver al stock mínimo (0 si ya lo alcanzó).
export const Faltante = (fila) => Math.max((Number(fila.stockMinimo) || 0) - (Number(fila.cantidadDisponible) || 0), 0);

// Lo más urgente (mayor faltante) primero; a igual faltante, por nombre.
export const OrdenarPorUrgencia = (alertas) =>
    [...alertas].sort((a, b) => Faltante(b) - Faltante(a) || String(a.nombre ?? "").localeCompare(String(b.nombre ?? ""), "es"));

// Columnas del Excel de alertas. Lleva todas, estén o no ocultas en la tabla de la pantalla.
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
];

// Exporta las alertas que recibe, todas (no solo la página que se ve en pantalla), a un Excel.
export const DescargarAlertasExcel = async (alertas, inventario) => {
    const libro = new ExcelJS.Workbook();
    agregarHoja(libro, "ALERTAS", `ALERTAS DE REPOSICIÓN | ${inventario.nombre} | ${formatearFechaCorta(hoyISO())}`, columnasExcel, alertas);

    await descargarLibro(libro, `Alertas_reposicion_${nombreSeguro(inventario.nombre)}_${hoyISO()}.xlsx`);
};
