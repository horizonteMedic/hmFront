import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { formatearFechaCorta, formatearFechaHora } from "../../../../../utils/formatDateUtils";
import { consultarInventario, inventarioUrl } from "../../Inventario/Compartido/inventarioUtils";
import {
    FORMATO_MONTO_EXCEL,
    indexarLotes,
    montoExcel,
    ObtenerLotesInventario,
    precioDeLote,
    sumarValores,
    textoValorTotal,
    valorDeMovimiento,
} from "../../Inventario/Compartido/precioReferencial";
import { agregarHojaTabla, descargarLibro, nuevoLibro } from "../Compartido/excelReporte";

const historialesUrl = `${inventarioUrl}/historiales`;

const NOMBRE_ENTREGAS = "Entregas de medicamentos";
const NOMBRE_INGRESOS = "Ingresos de stock";
const NOMBRE_RETIROS = "Retiros de medicamentos";

const aNombreArchivo = (nombre, desde, hasta) => `${nombre.replace(/ /g, "_")}_${desde}_${hasta}.xlsx`;
const textoTipo = (tipo) => String(tipo ?? "").replace(/_/g, " ");
const etiquetaRango = (desde, hasta) => `${formatearFechaCorta(desde)} al ${formatearFechaCorta(hasta)}`;
const porFecha = (campo) => (a, b) => String(a[campo] ?? "").localeCompare(String(b[campo] ?? ""));
const porMedicamento = (a, b) => String(a.medicamentoNombre ?? "").localeCompare(String(b.medicamentoNombre ?? ""), "es");

// Mensaje de lo que falta o es inválido en el inventario y el rango; "" si todo está bien.
const validarFiltros = ({ inventarioId, desde, hasta }) => {
    if (!inventarioId) return "Seleccione el inventario.";
    if (!desde || !hasta) return "Seleccione ambas fechas.";
    if (desde > hasta) return "La fecha inicial no puede ser mayor a la fecha final.";
    return "";
};

// Consulta uno de los historiales y devuelve su `resultado`, o null si falló (ya avisó al usuario).
const consultarHistorial = async (ruta, params, token, mensajeError) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([clave, valor]) => query.set(clave, valor));

    const res = await consultarInventario(`${historialesUrl}/${ruta}?${query}`, token, mensajeError);
    if (!res.ok) {
        await Swal.fire("Error", res.mensaje, "error");
        return null;
    }
    return res.resultado;
};

// Como `consultarHistorial`, pero además trae los lotes del inventario: los historiales mencionan el lote de cada movimiento
// (`loteId`) y no su precio, así que el valor sale de ahí. Devuelve { resultado, lotesPorId }, o null si algo falló (ya
// avisó al usuario). Sin los precios no se genera el reporte: saldría con los valores en blanco sin explicación.
const consultarHistorialConPrecios = async (ruta, params, token, mensajeError) => {
    const resultado = await consultarHistorial(ruta, params, token, mensajeError);
    if (!resultado) return null;

    const lotes = await ObtenerLotesInventario(params.inventarioId, token);
    if (!lotes.ok) {
        await Swal.fire("Error", `${lotes.mensaje} El reporte necesita los precios para calcular los valores.`, "error");
        return null;
    }
    return { resultado, lotesPorId: indexarLotes(lotes.resultado) };
};

const avisoSinResultados = (texto) => Swal.fire("Sin resultados", texto, "info");

const subtitulosBase = ({ inventarioNombre, desde, hasta }) => [
    `Inventario: ${inventarioNombre}`,
    `Rango de fechas: ${etiquetaRango(desde, hasta)}`,
];

// Clave con la que se agrupan los movimientos de un mismo medicamento.
const claveMedicamento = (item) => String(item.medicamentoId ?? `${item.medicamentoNombre}|${item.presentacion}`);

// Valor referencial de los movimientos de cada medicamento: Map(clave -> { total, sinPrecio }). `sinPrecio` cuenta los
// movimientos cuyo lote no tiene precio o ya no se encontró: el total solo suma los demás.
const valoresPorMedicamento = (movimientos, lotesPorId) => {
    const valores = new Map();
    movimientos.forEach((movimiento) => {
        const clave = claveMedicamento(movimiento);
        valores.set(clave, [...(valores.get(clave) ?? []), valorDeMovimiento(movimiento, lotesPorId)]);
    });
    return new Map([...valores].map(([clave, lista]) => [clave, sumarValores(lista)]));
};

const columnasResumen = [
    { key: "medicamento", label: "Medicamento", width: 40 },
    { key: "presentacion", label: "Presentación", width: 24 },
    { key: "total", label: "Total", width: 14, numero: true },
    { key: "valor", label: "Valor referencial (S/)", width: 20, numero: true, formato: FORMATO_MONTO_EXCEL },
    { key: "sinPrecio", label: "Movimientos sin precio", width: 16, numero: true },
];

const filasResumen = (resumenPorMedicamento, valores) =>
    [...(resumenPorMedicamento ?? [])].sort(porMedicamento).map((item) => {
        const valor = valores.get(claveMedicamento(item));
        return {
            medicamento: item.medicamentoNombre,
            presentacion: item.presentacion,
            total: item.totalCantidad,
            valor: valor?.total ?? 0,
            sinPrecio: valor?.sinPrecio ?? 0,
        };
    });

// Columnas de monto del DETALLE (precio del lote y valor del movimiento), que van después de la cantidad.
const columnasMonto = [
    { key: "precio", label: "Precio ref. (S/)", width: 14, numero: true, formato: FORMATO_MONTO_EXCEL },
    { key: "valor", label: "Valor (S/)", width: 14, numero: true, formato: FORMATO_MONTO_EXCEL },
];

const celdasMonto = (movimiento, lotesPorId) => ({
    precio: montoExcel(precioDeLote(lotesPorId.get(String(movimiento.loteId)))),
    valor: montoExcel(valorDeMovimiento(movimiento, lotesPorId)),
});

// ===== 1) Entregas de medicamentos (por receta, a área o ambas) =====
export const GenerarExcelEntregas = async ({ inventarioId, inventarioNombre, desde, hasta, incluirReceta, incluirArea }, token) => {
    const error = validarFiltros({ inventarioId, desde, hasta });
    if (error) return Swal.fire("Atención", error, "warning");
    if (!incluirReceta && !incluirArea) return Swal.fire("Atención", "Marque al menos un tipo de entrega: receta o área.", "warning");

    LoadingDefault("Generando Excel");
    const consulta = await consultarHistorialConPrecios(
        "entregas",
        { inventarioId, desde, hasta, incluirReceta, incluirArea },
        token,
        "No se pudo obtener el historial de entregas."
    );
    Swal.close();
    if (!consulta) return;

    const { resultado, lotesPorId } = consulta;
    const detalle = [...(resultado.detalle ?? [])].sort(porFecha("fecha"));
    if (detalle.length === 0) return avisoSinResultados("No se encontraron entregas en el rango de fechas seleccionado.");

    const valores = valoresPorMedicamento(detalle, lotesPorId);
    const valorTotal = sumarValores(detalle.map((item) => valorDeMovimiento(item, lotesPorId)));

    const tiposIncluidos = [incluirReceta && "Receta", incluirArea && "Área"].filter(Boolean).join(" y ");
    const subtitulos = [...subtitulosBase({ inventarioNombre, desde, hasta }), `Tipo de entrega: ${tiposIncluidos}`];
    const titulo = `${NOMBRE_ENTREGAS.toUpperCase()} | ${etiquetaRango(desde, hasta)}`;

    const libro = nuevoLibro();
    agregarHojaTabla(libro, {
        nombre: "RESUMEN",
        titulo,
        subtitulos: [
            ...subtitulos,
            `Total de unidades entregadas: ${resultado.totalUnidadesEntregadas ?? 0}`,
            `Medicamentos distintos entregados: ${resultado.totalMedicamentosDistintos ?? 0}`,
            `Valor referencial entregado: ${textoValorTotal(valorTotal)}`,
        ],
        columnas: columnasResumen.map((c) => (c.key === "total" ? { ...c, label: "Total entregado" } : c)),
        filas: filasResumen(resultado.resumenPorMedicamento, valores),
        totales: {
            etiqueta: "TOTAL",
            valores: { total: resultado.totalUnidadesEntregadas ?? 0, valor: valorTotal.total, sinPrecio: valorTotal.sinPrecio },
        },
    });
    agregarHojaTabla(libro, {
        nombre: "DETALLE",
        titulo,
        subtitulos,
        columnas: [
            { key: "fecha", label: "Fecha", width: 19 },
            { key: "tipo", label: "Tipo", width: 18 },
            { key: "medicamento", label: "Medicamento", width: 36 },
            { key: "presentacion", label: "Presentación", width: 22 },
            { key: "cantidad", label: "Cantidad", width: 11, numero: true },
            ...columnasMonto,
            { key: "lote", label: "Lote", width: 16 },
            { key: "vencimiento", label: "Vencimiento", width: 13 },
            { key: "numeroTicket", label: "N° Ticket", width: 11 },
            { key: "referencia", label: "Referencia", width: 28 },
            { key: "motivo", label: "Motivo", width: 24 },
            { key: "usuario", label: "Usuario", width: 22 },
        ],
        filas: detalle.map((item) => ({
            fecha: formatearFechaHora(item.fecha),
            tipo: textoTipo(item.tipo),
            medicamento: item.medicamentoNombre,
            presentacion: item.presentacion,
            cantidad: item.cantidad,
            ...celdasMonto(item, lotesPorId),
            lote: item.numeroLote,
            vencimiento: formatearFechaCorta(item.fechaVencimiento),
            numeroTicket: item.numeroTicket,
            referencia: item.referencia,
            motivo: item.motivo,
            usuario: item.usuario,
        })),
        totales: { etiqueta: `TOTAL: ${detalle.length} entregas`, valores: { cantidad: resultado.totalUnidadesEntregadas ?? 0, valor: valorTotal.total } },
    });

    await descargarLibro(libro, aNombreArchivo(NOMBRE_ENTREGAS, desde, hasta));
};

// ===== 2) Ingresos de stock =====
export const GenerarExcelIngresos = async ({ inventarioId, inventarioNombre, desde, hasta }, token) => {
    const error = validarFiltros({ inventarioId, desde, hasta });
    if (error) return Swal.fire("Atención", error, "warning");

    LoadingDefault("Generando Excel");
    const consulta = await consultarHistorialConPrecios(
        "ingresos",
        { inventarioId, desde, hasta },
        token,
        "No se pudo obtener el historial de ingresos."
    );
    Swal.close();
    if (!consulta) return;

    const { resultado, lotesPorId } = consulta;
    const ingresos = [...(Array.isArray(resultado) ? resultado : [])].sort(porFecha("fecha"));
    if (ingresos.length === 0) return avisoSinResultados("No se encontraron ingresos de stock en el rango de fechas seleccionado.");

    // El backend no resume los ingresos: se suma aquí por medicamento, sin importar el lote.
    const totalesPorMedicamento = new Map();
    ingresos.forEach((item) => {
        const clave = claveMedicamento(item);
        const acumulado = totalesPorMedicamento.get(clave) ?? {
            medicamentoId: item.medicamentoId,
            medicamentoNombre: item.medicamentoNombre,
            presentacion: item.presentacion,
            totalCantidad: 0,
        };
        acumulado.totalCantidad += Number(item.cantidad) || 0;
        totalesPorMedicamento.set(clave, acumulado);
    });
    const totalUnidades = [...totalesPorMedicamento.values()].reduce((suma, item) => suma + item.totalCantidad, 0);

    const valores = valoresPorMedicamento(ingresos, lotesPorId);
    const valorTotal = sumarValores(ingresos.map((item) => valorDeMovimiento(item, lotesPorId)));

    const subtitulos = subtitulosBase({ inventarioNombre, desde, hasta });
    const titulo = `${NOMBRE_INGRESOS.toUpperCase()} | ${etiquetaRango(desde, hasta)}`;

    const libro = nuevoLibro();
    agregarHojaTabla(libro, {
        nombre: "RESUMEN",
        titulo,
        subtitulos: [
            ...subtitulos,
            `Total de unidades ingresadas: ${totalUnidades}`,
            `Medicamentos distintos ingresados: ${totalesPorMedicamento.size}`,
            `Valor referencial ingresado: ${textoValorTotal(valorTotal)}`,
        ],
        columnas: columnasResumen.map((c) => (c.key === "total" ? { ...c, label: "Total ingresado" } : c)),
        filas: filasResumen([...totalesPorMedicamento.values()], valores),
        totales: { etiqueta: "TOTAL", valores: { total: totalUnidades, valor: valorTotal.total, sinPrecio: valorTotal.sinPrecio } },
    });
    agregarHojaTabla(libro, {
        nombre: "DETALLE",
        titulo,
        subtitulos,
        columnas: [
            { key: "fecha", label: "Fecha", width: 19 },
            { key: "tipo", label: "Tipo", width: 18 },
            { key: "medicamento", label: "Medicamento", width: 36 },
            { key: "presentacion", label: "Presentación", width: 22 },
            { key: "cantidad", label: "Cantidad", width: 11, numero: true },
            ...columnasMonto,
            { key: "lote", label: "Lote", width: 16 },
            { key: "vencimiento", label: "Vencimiento", width: 13 },
            { key: "referencia", label: "Referencia", width: 28 },
            { key: "motivo", label: "Motivo", width: 24 },
            { key: "usuario", label: "Usuario", width: 22 },
        ],
        filas: ingresos.map((item) => ({
            fecha: formatearFechaHora(item.fecha),
            tipo: textoTipo(item.tipo),
            medicamento: item.medicamentoNombre,
            presentacion: item.presentacion,
            cantidad: item.cantidad,
            ...celdasMonto(item, lotesPorId),
            lote: item.numeroLote,
            vencimiento: formatearFechaCorta(item.fechaVencimiento),
            referencia: item.referencia,
            motivo: item.motivo,
            usuario: item.usuario,
        })),
        totales: { etiqueta: `TOTAL: ${ingresos.length} ingresos`, valores: { cantidad: totalUnidades, valor: valorTotal.total } },
    });

    await descargarLibro(libro, aNombreArchivo(NOMBRE_INGRESOS, desde, hasta));
};

// ===== 3) Retiros de medicamentos =====
export const GenerarExcelRetiros = async ({ inventarioId, inventarioNombre, desde, hasta }, token) => {
    const error = validarFiltros({ inventarioId, desde, hasta });
    if (error) return Swal.fire("Atención", error, "warning");

    LoadingDefault("Generando Excel");
    const consulta = await consultarHistorialConPrecios(
        "retiros",
        { inventarioId, desde, hasta },
        token,
        "No se pudo obtener el historial de retiros."
    );
    Swal.close();
    if (!consulta) return;

    const { resultado, lotesPorId } = consulta;
    const detalle = [...(resultado.detalle ?? [])].sort(porFecha("fechaRegistro"));
    if (detalle.length === 0) return avisoSinResultados("No se encontraron retiros en el rango de fechas seleccionado.");

    const valores = valoresPorMedicamento(detalle, lotesPorId);
    const valorTotal = sumarValores(detalle.map((item) => valorDeMovimiento(item, lotesPorId)));

    const subtitulos = subtitulosBase({ inventarioNombre, desde, hasta });
    const titulo = `${NOMBRE_RETIROS.toUpperCase()} | ${etiquetaRango(desde, hasta)}`;

    const libro = nuevoLibro();
    agregarHojaTabla(libro, {
        nombre: "RESUMEN",
        titulo,
        subtitulos: [
            ...subtitulos,
            `Total de unidades retiradas: ${resultado.totalUnidadesRetiradas ?? 0}`,
            `Medicamentos distintos retirados: ${resultado.totalMedicamentosDistintos ?? 0}`,
            `Valor referencial retirado: ${textoValorTotal(valorTotal)}`,
        ],
        columnas: columnasResumen.map((c) => (c.key === "total" ? { ...c, label: "Total retirado" } : c)),
        filas: filasResumen(resultado.resumenPorMedicamento, valores),
        totales: {
            etiqueta: "TOTAL",
            valores: { total: resultado.totalUnidadesRetiradas ?? 0, valor: valorTotal.total, sinPrecio: valorTotal.sinPrecio },
        },
    });
    agregarHojaTabla(libro, {
        nombre: "DETALLE",
        titulo,
        subtitulos,
        columnas: [
            { key: "fecha", label: "Fecha", width: 19 },
            { key: "medicamento", label: "Medicamento", width: 36 },
            { key: "presentacion", label: "Presentación", width: 22 },
            { key: "cantidad", label: "Cantidad", width: 11, numero: true },
            ...columnasMonto,
            { key: "lote", label: "Lote", width: 16 },
            { key: "vencimiento", label: "Vencimiento", width: 13 },
            { key: "motivo", label: "Motivo", width: 16 },
            { key: "observacion", label: "Observación", width: 36 },
            { key: "automatico", label: "Automático", width: 12 },
            { key: "usuario", label: "Usuario", width: 22 },
        ],
        filas: detalle.map((item) => ({
            fecha: formatearFechaHora(item.fechaRegistro),
            medicamento: item.medicamentoNombre,
            presentacion: item.presentacion,
            cantidad: item.cantidad,
            ...celdasMonto(item, lotesPorId),
            lote: item.numeroLote,
            vencimiento: formatearFechaCorta(item.fechaVencimiento),
            motivo: item.motivo,
            observacion: item.observacion,
            automatico: item.automatico ? "Sí" : "No",
            usuario: item.usuarioRegistro,
        })),
        totales: { etiqueta: `TOTAL: ${detalle.length} retiros`, valores: { cantidad: resultado.totalUnidadesRetiradas ?? 0, valor: valorTotal.total } },
    });

    await descargarLibro(libro, aNombreArchivo(NOMBRE_RETIROS, desde, hasta));
};
