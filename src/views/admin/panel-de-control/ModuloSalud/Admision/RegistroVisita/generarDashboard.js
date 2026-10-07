import { getJson } from "../../utils/apiSalud";
import { agregarHojaTabla, agregarTabla, agregarTitulo, crearLibro, nombreSeguro } from "../../utils/excelReporte";

const URL_ESTADISTICAS = "/api/reportes/visitas/estadisticas";
const URL_ATENCIONES = "/api/reportes/especialidades/atenciones";
const URL_PROCEDENCIA = "/api/reportes/pacientes/procedencia";
const URL_GENERO = "/api/reportes/pacientes/genero";
const URL_EDADES = "/api/reportes/pacientes/edades";

const MENSAJE_ERROR = "No se pudieron consultar los datos del dashboard";

// Visitas y atenciones se pueden pedir por campaña. Procedencia, género y edades todavía no tienen ese
// filtro en el backend (cuentan a los pacientes registrados en el período), y así se rotulan en el Excel.
const SECCIONES = {
    estadisticas: {
        titulo: "VISITAS POR ESTADO",
        hoja: "📈 Visitas por Estado",
        conTotal: true,
        columnas: [
            { key: "concepto", label: "Concepto", ancho: 30 },
            { key: "cantidad", label: "Cantidad", ancho: 18 },
            { key: "porcentaje", label: "(%)", ancho: 14 },
        ],
    },
    atenciones: {
        titulo: "ATENCIONES POR ESPECIALIDAD",
        hoja: "🩺 Atenciones",
        conTotal: true,
        columnas: [
            { key: "especialidadNombre", label: "Especialidad", ancho: 28 },
            { key: "totalAsignadas", label: "Asignadas", ancho: 14 },
            { key: "totalAtendidas", label: "Atendidas", ancho: 14 },
            { key: "totalPaso", label: "Pasó", ancho: 12 },
            { key: "totalNoPaso", label: "No pasó", ancho: 12 },
            { key: "totalPendiente", label: "Pendientes", ancho: 14 },
        ],
    },
    procedencia: {
        titulo: "PROCEDENCIA (CASERÍO) · TODAS LAS CAMPAÑAS",
        hoja: "📍 Procedencia",
        conTotal: true,
        columnas: [
            { key: "procedencia", label: "Procedencia", ancho: 44 },
            { key: "cantidad", label: "Cantidad", ancho: 18 },
        ],
    },
    genero: {
        titulo: "GÉNERO · TODAS LAS CAMPAÑAS",
        hoja: "👥 Género",
        columnas: [
            { key: "genero", label: "Género", ancho: 26 },
            { key: "total", label: "Total", ancho: 18 },
            { key: "porcentaje", label: "(%)", ancho: 18 },
        ],
    },
    edades: {
        titulo: "RANGOS DE EDAD · TODAS LAS CAMPAÑAS",
        hoja: "📅 Rangos de Edad",
        columnas: [
            { key: "rango", label: "Rango", ancho: 16 },
            { key: "descripcion", label: "Descripción", ancho: 22 },
            { key: "cantidad", label: "Cantidad", ancho: 16 },
            { key: "porcentaje", label: "(%)", ancho: 14 },
        ],
    },
};

const ORDEN_RESUMEN = ["estadisticas", "atenciones", "genero", "edades", "procedencia"];
const ORDEN_HOJAS = ["estadisticas", "atenciones", "procedencia", "genero", "edades"];

const COLUMNAS_RESUMEN = 6;
const ANCHO_COLUMNA_RESUMEN = 22;

// ── Respuestas del backend -> filas de cada sección ─────────────────────────────
const raw = (res) => res?.resultado ?? res ?? [];

const porcentaje = (cantidad, total) => (total ? `${((cantidad / total) * 100).toFixed(1)}%` : "0%");

// { totalGeneradas, totalAbiertas, totalCerradas, totalAnuladas }
const normEstadisticas = (res) => {
    if (Array.isArray(res)) return res;
    const total = res.totalGeneradas || 0;
    return [
        { concepto: "Total generadas", cantidad: res.totalGeneradas ?? 0 },
        { concepto: "Abiertas", cantidad: res.totalAbiertas ?? 0 },
        { concepto: "Cerradas", cantidad: res.totalCerradas ?? 0 },
        { concepto: "Anuladas", cantidad: res.totalAnuladas ?? 0 },
    ].map((fila) => ({ ...fila, porcentaje: porcentaje(fila.cantidad, total) }));
};

// { masculino, femenino, total }
const normGenero = (res) => {
    if (Array.isArray(res)) return res;
    const masculino = res.masculino ?? 0;
    const femenino = res.femenino ?? 0;
    const total = res.total ?? masculino + femenino;
    return [
        { genero: "Masculino", total: masculino, porcentaje: porcentaje(masculino, total) },
        { genero: "Femenino", total: femenino, porcentaje: porcentaje(femenino, total) },
        { genero: "TOTAL", total, porcentaje: "100%" },
    ];
};

// [{ rango, descripcion, cantidad }]
const normEdades = (res) => {
    const lista = Array.isArray(res) ? res : [];
    const total = lista.reduce((suma, e) => suma + (e.cantidad || 0), 0);
    return lista.map((e) => ({ ...e, porcentaje: porcentaje(e.cantidad, total) }));
};

const comoLista = (res) => (Array.isArray(res) ? res : []);

// Excel de 6 hojas (resumen + una por sección) de la campaña en el rango de fechas.
export const generarDashboard = async ({ token, campania, fechaInicio, fechaFin }) => {
    const fechas = { fechaDesde: fechaInicio, fechaHasta: fechaFin };
    const deLaCampania = new URLSearchParams({ ...fechas, codigoCampania: campania.codigo });
    const porFechas = new URLSearchParams(fechas);
    const pedir = async (url, params) => raw(await getJson(`${url}?${params}`, token, MENSAJE_ERROR));

    const [estadisticas, atenciones, procedencia, genero, edades] = await Promise.all([
        pedir(URL_ESTADISTICAS, deLaCampania),
        pedir(URL_ATENCIONES, deLaCampania),
        pedir(URL_PROCEDENCIA, porFechas),
        pedir(URL_GENERO, porFechas),
        pedir(URL_EDADES, porFechas),
    ]);
    const filas = {
        estadisticas: normEstadisticas(estadisticas),
        atenciones: comoLista(atenciones),
        procedencia: comoLista(procedencia),
        genero: normGenero(genero),
        edades: normEdades(edades),
    };

    const libro = crearLibro();
    const periodo = `${fechaInicio} al ${fechaFin}`;

    const resumen = libro.addWorksheet("📊 RESUMEN");
    resumen.columns = Array(COLUMNAS_RESUMEN).fill({ width: ANCHO_COLUMNA_RESUMEN });
    agregarTitulo(
        resumen,
        `DASHBOARD · ${campania.nombre}  |  ${periodo}`,
        COLUMNAS_RESUMEN,
        COLUMNAS_RESUMEN * ANCHO_COLUMNA_RESUMEN,
        "principal"
    );
    resumen.addRow([]);
    ORDEN_RESUMEN.forEach((clave) =>
        agregarTabla(resumen, { ...SECCIONES[clave], conTotal: false, seccion: true, filas: filas[clave] })
    );

    ORDEN_HOJAS.forEach((clave) => {
        const { hoja, titulo, ...seccion } = SECCIONES[clave];
        agregarHojaTabla(libro, hoja, { ...seccion, titulo: `${titulo}  |  ${periodo}`, filas: filas[clave] });
    });

    return {
        libro,
        nombreArchivo: `Dashboard_Salud_${nombreSeguro(campania.codigo)}_${fechaInicio}_${fechaFin}.xlsx`,
    };
};
