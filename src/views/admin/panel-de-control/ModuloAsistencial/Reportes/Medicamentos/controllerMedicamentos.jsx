import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { formatearFechaCorta, formatearFechaHora } from "../../../../../utils/formatDateUtils";
import { consultarInventario, inventarioUrl } from "../../Inventario/Compartido/inventarioUtils";
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

const avisoSinResultados = (texto) => Swal.fire("Sin resultados", texto, "info");

const subtitulosBase = ({ inventarioNombre, desde, hasta }) => [
    `Inventario: ${inventarioNombre}`,
    `Rango de fechas: ${etiquetaRango(desde, hasta)}`,
];

const columnasResumen = [
    { key: "medicamento", label: "Medicamento", width: 40 },
    { key: "presentacion", label: "Presentación", width: 24 },
    { key: "total", label: "Total", width: 14, numero: true },
];

const filasResumen = (resumenPorMedicamento) =>
    [...(resumenPorMedicamento ?? [])].sort(porMedicamento).map((item) => ({
        medicamento: item.medicamentoNombre,
        presentacion: item.presentacion,
        total: item.totalCantidad,
    }));

// ===== 1) Entregas de medicamentos (por receta, a área o ambas) =====
export const GenerarExcelEntregas = async ({ inventarioId, inventarioNombre, desde, hasta, incluirReceta, incluirArea }, token) => {
    const error = validarFiltros({ inventarioId, desde, hasta });
    if (error) return Swal.fire("Atención", error, "warning");
    if (!incluirReceta && !incluirArea) return Swal.fire("Atención", "Marque al menos un tipo de entrega: receta o área.", "warning");

    LoadingDefault("Generando Excel");
    const resultado = await consultarHistorial(
        "entregas",
        { inventarioId, desde, hasta, incluirReceta, incluirArea },
        token,
        "No se pudo obtener el historial de entregas."
    );
    Swal.close();
    if (!resultado) return;

    const detalle = [...(resultado.detalle ?? [])].sort(porFecha("fecha"));
    if (detalle.length === 0) return avisoSinResultados("No se encontraron entregas en el rango de fechas seleccionado.");

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
        ],
        columnas: columnasResumen.map((c) => (c.key === "total" ? { ...c, label: "Total entregado" } : c)),
        filas: filasResumen(resultado.resumenPorMedicamento),
        totales: { etiqueta: "TOTAL", valores: { total: resultado.totalUnidadesEntregadas ?? 0 } },
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
            lote: item.numeroLote,
            vencimiento: formatearFechaCorta(item.fechaVencimiento),
            numeroTicket: item.numeroTicket,
            referencia: item.referencia,
            motivo: item.motivo,
            usuario: item.usuario,
        })),
    });

    await descargarLibro(libro, aNombreArchivo(NOMBRE_ENTREGAS, desde, hasta));
};

// ===== 2) Ingresos de stock =====
export const GenerarExcelIngresos = async ({ inventarioId, inventarioNombre, desde, hasta }, token) => {
    const error = validarFiltros({ inventarioId, desde, hasta });
    if (error) return Swal.fire("Atención", error, "warning");

    LoadingDefault("Generando Excel");
    const resultado = await consultarHistorial(
        "ingresos",
        { inventarioId, desde, hasta },
        token,
        "No se pudo obtener el historial de ingresos."
    );
    Swal.close();
    if (!resultado) return;

    const ingresos = [...(Array.isArray(resultado) ? resultado : [])].sort(porFecha("fecha"));
    if (ingresos.length === 0) return avisoSinResultados("No se encontraron ingresos de stock en el rango de fechas seleccionado.");

    // El backend no resume los ingresos: se suma aquí por medicamento, sin importar el lote.
    const totalesPorMedicamento = new Map();
    ingresos.forEach((item) => {
        const clave = item.medicamentoId ?? `${item.medicamentoNombre}|${item.presentacion}`;
        const acumulado = totalesPorMedicamento.get(clave) ?? {
            medicamentoNombre: item.medicamentoNombre,
            presentacion: item.presentacion,
            totalCantidad: 0,
        };
        acumulado.totalCantidad += Number(item.cantidad) || 0;
        totalesPorMedicamento.set(clave, acumulado);
    });
    const totalUnidades = [...totalesPorMedicamento.values()].reduce((suma, item) => suma + item.totalCantidad, 0);

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
        ],
        columnas: columnasResumen.map((c) => (c.key === "total" ? { ...c, label: "Total ingresado" } : c)),
        filas: filasResumen([...totalesPorMedicamento.values()]),
        totales: { etiqueta: "TOTAL", valores: { total: totalUnidades } },
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
            lote: item.numeroLote,
            vencimiento: formatearFechaCorta(item.fechaVencimiento),
            referencia: item.referencia,
            motivo: item.motivo,
            usuario: item.usuario,
        })),
        totales: { etiqueta: `TOTAL: ${ingresos.length} ingresos`, valores: { cantidad: totalUnidades } },
    });

    await descargarLibro(libro, aNombreArchivo(NOMBRE_INGRESOS, desde, hasta));
};

// ===== 3) Retiros de medicamentos =====
export const GenerarExcelRetiros = async ({ inventarioId, inventarioNombre, desde, hasta }, token) => {
    const error = validarFiltros({ inventarioId, desde, hasta });
    if (error) return Swal.fire("Atención", error, "warning");

    LoadingDefault("Generando Excel");
    const resultado = await consultarHistorial(
        "retiros",
        { inventarioId, desde, hasta },
        token,
        "No se pudo obtener el historial de retiros."
    );
    Swal.close();
    if (!resultado) return;

    const detalle = [...(resultado.detalle ?? [])].sort(porFecha("fechaRegistro"));
    if (detalle.length === 0) return avisoSinResultados("No se encontraron retiros en el rango de fechas seleccionado.");

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
        ],
        columnas: columnasResumen.map((c) => (c.key === "total" ? { ...c, label: "Total retirado" } : c)),
        filas: filasResumen(resultado.resumenPorMedicamento),
        totales: { etiqueta: "TOTAL", valores: { total: resultado.totalUnidadesRetiradas ?? 0 } },
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
            lote: item.numeroLote,
            vencimiento: formatearFechaCorta(item.fechaVencimiento),
            motivo: item.motivo,
            observacion: item.observacion,
            automatico: item.automatico ? "Sí" : "No",
            usuario: item.usuarioRegistro,
        })),
    });

    await descargarLibro(libro, aNombreArchivo(NOMBRE_RETIROS, desde, hasta));
};
