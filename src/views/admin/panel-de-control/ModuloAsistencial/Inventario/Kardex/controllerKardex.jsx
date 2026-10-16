import { consultarInventario, inventarioUrl, rangoMesActual } from "../inventarioUtils";

const movimientosUrl = `${inventarioUrl}/stock/movimientos`;

// Rango por defecto del kardex: desde el primer día del mes actual hasta hoy.
export const RangoInicialKardex = rangoMesActual;

// { campo: mensaje } solo con lo que falta o es inválido; vacío si la búsqueda se puede hacer.
export const ValidarFiltrosKardex = ({ inventarioId, medicamentoTexto, medicamentoId, desde, hasta }) => {
    const errores = {};
    if (!inventarioId) errores.inventario = "Seleccione el inventario";
    if (medicamentoTexto && !medicamentoId) errores.medicamento = "Elija un medicamento de la lista o deje el campo vacío";
    if (desde && hasta && desde > hasta) errores.desde = "La fecha inicial no puede ser mayor a la fecha final";
    return errores;
};

// Movimientos del inventario (ingresos, entregas, retiros, reservas...) con el saldo después de cada uno.
// Medicamento y fechas son opcionales: sin ellos trae todo el historial.
export const ObtenerMovimientos = ({ inventarioId, medicamentoId, desde, hasta }, token) => {
    const query = new URLSearchParams({ inventarioId });
    if (medicamentoId) query.set("medicamentoId", medicamentoId);
    if (desde) query.set("desde", desde);
    if (hasta) query.set("hasta", hasta);

    return consultarInventario(`${movimientosUrl}?${query}`, token, "No se pudo cargar el kardex.");
};

// El primer patrón que coincida con el tipo define el color; el orden importa (LIBERACION antes que RESERVA).
const COLORES_TIPO = [
    { patron: /INGRESO|ENTRADA|DEVOLUCION/, clases: "bg-emerald-100 text-emerald-700" },
    { patron: /LIBERACION/, clases: "bg-sky-100 text-sky-700" },
    { patron: /RESERVA/, clases: "bg-amber-100 text-amber-700" },
    { patron: /ENTREGA|RETIRO|SALIDA|VENCIMIENTO|PERDIDA|MERMA/, clases: "bg-red-100 text-red-700" },
    { patron: /TRANSFERENCIA/, clases: "bg-indigo-100 text-indigo-700" },
];

// "ENTREGA_RECETA" -> { texto: "ENTREGA RECETA", clases }. Un tipo que no se reconoce se muestra en gris.
export const TipoMovimiento = (tipo) => {
    const original = String(tipo ?? "").toUpperCase();
    const color = COLORES_TIPO.find(({ patron }) => patron.test(original));
    return { texto: original.replace(/_/g, " "), clases: color?.clases ?? "bg-gray-200 text-gray-700" };
};
