import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { getToday } from "../../../../../utils/helpers";
import { getFetch } from "../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";

// ── Colores ───────────────────────────────────────────────────────────────────
const C = {
    azulOscuro:  "FF1F4E79",
    azulMedio:   "FF2E75B6",
    azulClaro:   "FFD6E4F0",
    verdeMedio:  "FF1D7A45",
    verdeClaro:  "FFD6F0E0",
    grisClaro:   "FFF2F2F2",
    blanco:      "FFFFFFFF",
    negro:       "FF000000",
    amarillo:    "FFFFF3CD",
};

// ── Helper: título de hoja ────────────────────────────────────────────────────
const titulo = (sheet, texto, ncols, periodo) => {
    const ref = `A1:${String.fromCharCode(64 + ncols)}1`;
    sheet.mergeCells(ref);
    const c = sheet.getCell("A1");
    c.value = `${texto}  |  ${periodo}`;
    c.font = { bold: true, size: 12, color: { argb: C.blanco } };
    c.alignment = { horizontal: "center", vertical: "middle" };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.azulOscuro } };
    sheet.getRow(1).height = 26;
};

// ── Helper: fila de headers ───────────────────────────────────────────────────
const headers = (sheet, cols) => {
    const row = sheet.addRow(cols.map(c => c.label));
    row.height = 20;
    row.eachCell((cell, i) => {
        cell.font = { bold: true, size: 9, color: { argb: C.blanco } };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.azulMedio } };
        cell.border = bordes("thin", C.blanco);
    });
    sheet.columns = cols.map(c => ({ width: c.w || 18 }));
};

// ── Helper: filas de datos ────────────────────────────────────────────────────
const filas = (sheet, data, cols) => {
    data.forEach((item, idx) => {
        const values = cols.map(c => item[c.key] ?? "");
        const row = sheet.addRow(values);
        row.height = 18;
        const par = idx % 2 === 0;
        row.eachCell(cell => {
            cell.font = { size: 9 };
            cell.alignment = { vertical: "middle", wrapText: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: par ? C.grisClaro : C.blanco } };
            cell.border = bordes("hair", "FFCCCCCC");
        });
    });
};

// ── Helper: fila total ────────────────────────────────────────────────────────
const totalRow = (sheet, ncols, n) => {
    const row = sheet.addRow([`TOTAL: ${n} registros`, ...Array(ncols - 1).fill("")]);
    sheet.mergeCells(`A${row.number}:${String.fromCharCode(64 + ncols)}${row.number}`);
    const c = sheet.getCell(`A${row.number}`);
    c.font = { bold: true, size: 9, color: { argb: C.blanco } };
    c.alignment = { horizontal: "right", vertical: "middle" };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.azulOscuro } };
    row.height = 18;
};

// ── Helper: sección en hoja resumen ──────────────────────────────────────────
const seccionResumen = (sheet, startRow, tituloSec, cols, data, color = C.azulMedio) => {
    // Título de sección
    const ncols = cols.length;
    const endCol = String.fromCharCode(64 + ncols);
    sheet.mergeCells(`A${startRow}:${endCol}${startRow}`);
    const tc = sheet.getCell(`A${startRow}`);
    tc.value = tituloSec;
    tc.font = { bold: true, size: 10, color: { argb: C.blanco } };
    tc.alignment = { horizontal: "left", vertical: "middle" };
    tc.fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };
    sheet.getRow(startRow).height = 20;
    startRow++;

    // Headers
    const hRow = sheet.addRow(cols.map(c => c.label));
    hRow.height = 18;
    hRow.eachCell(cell => {
        cell.font = { bold: true, size: 8, color: { argb: C.blanco } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.azulClaro.replace("FFD6", "FF9AB") } };
        cell.border = bordes("thin", "FFAAAAAA");
    });
    startRow++;

    // Data
    const rows = Array.isArray(data) ? data : [data];
    rows.forEach((item, idx) => {
        const values = cols.map(c => item[c.key] ?? "");
        const row = sheet.addRow(values);
        row.height = 16;
        const par = idx % 2 === 0;
        row.eachCell(cell => {
            cell.font = { size: 8 };
            cell.alignment = { vertical: "middle" };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: par ? C.grisClaro : C.blanco } };
            cell.border = bordes("hair", "FFCCCCCC");
        });
        startRow++;
    });

    return startRow + 1; // espacio entre secciones
};

const bordes = (style, color) => ({
    top: { style, color: { argb: color } },
    bottom: { style, color: { argb: color } },
    left: { style, color: { argb: color } },
    right: { style, color: { argb: color } },
});

// ── Endpoints ─────────────────────────────────────────────────────────────────
const URL_ESTADISTICAS  = "/api/reportes/visitas/estadisticas";
const URL_ATENCIONES    = "/api/reportes/especialidades/atenciones";
const URL_PROCEDENCIA   = "/api/reportes/pacientes/procedencia";
const URL_GENERO        = "/api/reportes/pacientes/genero";
const URL_EDADES        = "/api/reportes/pacientes/edades";

// ── Columnas por hoja ─────────────────────────────────────────────────────────
const COLS_ESTADISTICAS = [
    { key: "concepto",       label: "Concepto",         w: 26 },
    { key: "cantidad",       label: "Cantidad",          w: 14 },
    { key: "porcentaje",     label: "(%)",               w: 12 },
];
const COLS_ATENCIONES = [
    { key: "especialidadNombre", label: "Especialidad",   w: 28 },
    { key: "totalAsignadas",     label: "Asignadas",      w: 14 },
    { key: "totalAtendidas",     label: "Atendidas",      w: 14 },
    { key: "totalPaso",          label: "Pasó",           w: 12 },
    { key: "totalNoPaso",        label: "No pasó",        w: 12 },
    { key: "totalPendiente",     label: "Pendientes",     w: 14 },
];
const COLS_PROCEDENCIA = [
    { key: "procedencia", label: "Procedencia", w: 32 },
    { key: "cantidad",    label: "Cantidad",    w: 14 },
];
const COLS_GENERO = [
    { key: "genero",     label: "Género",  w: 20 },
    { key: "total",      label: "Total",   w: 12 },
    { key: "porcentaje", label: "(%)",     w: 12 },
];
const COLS_EDADES = [
    { key: "rango",       label: "Rango",       w: 14 },
    { key: "descripcion", label: "Descripción", w: 20 },
    { key: "cantidad",    label: "Cantidad",    w: 14 },
    { key: "porcentaje",  label: "(%)",         w: 12 },
];

// ── Normalizar respuestas ─────────────────────────────────────────────────────
// { totalGeneradas, totalAbiertas, totalCerradas, totalAnuladas }
const normEstadisticas = (res) => {
    if (Array.isArray(res)) return res;
    const total = res.totalGeneradas || 0;
    const filas = [
        { concepto: "Total generadas", cantidad: res.totalGeneradas  ?? 0 },
        { concepto: "Abiertas",        cantidad: res.totalAbiertas   ?? 0 },
        { concepto: "Cerradas",        cantidad: res.totalCerradas   ?? 0 },
        { concepto: "Anuladas",        cantidad: res.totalAnuladas   ?? 0 },
    ];
    return filas.map(f => ({
        ...f,
        porcentaje: total ? `${((f.cantidad / total) * 100).toFixed(1)}%` : "0%",
    }));
};

// { masculino, femenino, total }
const normGenero = (res) => {
    if (Array.isArray(res)) return res;
    const total = res.total ?? (res.masculino + res.femenino) ?? 0;
    const pct = (n) => total ? `${((n / total) * 100).toFixed(1)}%` : "0%";
    return [
        { genero: "Masculino", total: res.masculino ?? 0, porcentaje: pct(res.masculino ?? 0) },
        { genero: "Femenino",  total: res.femenino  ?? 0, porcentaje: pct(res.femenino  ?? 0) },
        { genero: "TOTAL",     total,                     porcentaje: "100%" },
    ];
};

// [{ rango, descripcion, cantidad }]
const normEdades = (res) => {
    const lista = Array.isArray(res) ? res : [];
    const total = lista.reduce((s, e) => s + (e.cantidad || 0), 0);
    return lista.map(e => ({
        ...e,
        porcentaje: total ? `${((e.cantidad / total) * 100).toFixed(1)}%` : "0%",
    }));
};

// ── Generador principal ───────────────────────────────────────────────────────
const generarDashboard = async (datos, fechaInicio, fechaFin) => {
    const { estadisticas, atenciones, procedencia, genero, edades } = datos;
    const periodo = `${fechaInicio} al ${fechaFin}`;

    const wb = new ExcelJS.Workbook();
    wb.creator = "Horizonte Medic";
    wb.created = new Date();

    // ════════════════════════════════════════════════════════
    // HOJA 1: RESUMEN
    // ════════════════════════════════════════════════════════
    const shResumen = wb.addWorksheet("📊 RESUMEN");
    shResumen.columns = Array(6).fill({ width: 22 });

    // Gran título
    shResumen.mergeCells("A1:F1");
    const gt = shResumen.getCell("A1");
    gt.value = `DASHBOARD DE CAMPAÑA DE SALUD  |  ${periodo}`;
    gt.font = { bold: true, size: 14, color: { argb: C.blanco } };
    gt.alignment = { horizontal: "center", vertical: "middle" };
    gt.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.azulOscuro } };
    shResumen.getRow(1).height = 32;
    shResumen.addRow([]);

    let fila = 3;

    fila = seccionResumen(shResumen, fila, "VISITAS POR ESTADO",       COLS_ESTADISTICAS, estadisticas);
    fila = seccionResumen(shResumen, fila, "ATENCIONES POR ESPECIALIDAD", COLS_ATENCIONES, atenciones);
    fila = seccionResumen(shResumen, fila, "DISTRIBUCIÓN POR GÉNERO",  COLS_GENERO,      genero);
    fila = seccionResumen(shResumen, fila, "RANGOS DE EDAD",           COLS_EDADES,      edades);
    fila = seccionResumen(shResumen, fila, "PACIENTES POR PROCEDENCIA",COLS_PROCEDENCIA, procedencia);

    // ════════════════════════════════════════════════════════
    // HOJA 2: ESTADÍSTICAS
    // ════════════════════════════════════════════════════════
    const shEst = wb.addWorksheet("📈 Visitas por Estado");
    titulo(shEst, "VISITAS POR ESTADO", COLS_ESTADISTICAS.length, periodo);
    headers(shEst, COLS_ESTADISTICAS);
    filas(shEst, estadisticas, COLS_ESTADISTICAS);
    totalRow(shEst, COLS_ESTADISTICAS.length, estadisticas.length);

    // ════════════════════════════════════════════════════════
    // HOJA 3: ATENCIONES
    // ════════════════════════════════════════════════════════
    const shAten = wb.addWorksheet("🩺 Atenciones");
    titulo(shAten, "ATENCIONES POR ESPECIALIDAD", COLS_ATENCIONES.length, periodo);
    headers(shAten, COLS_ATENCIONES);
    filas(shAten, atenciones, COLS_ATENCIONES);
    totalRow(shAten, COLS_ATENCIONES.length, atenciones.length);

    // ════════════════════════════════════════════════════════
    // HOJA 4: PROCEDENCIA
    // ════════════════════════════════════════════════════════
    const shProc = wb.addWorksheet("📍 Procedencia");
    titulo(shProc, "PACIENTES POR PROCEDENCIA (CASERÍO)", COLS_PROCEDENCIA.length, periodo);
    headers(shProc, COLS_PROCEDENCIA);
    filas(shProc, procedencia, COLS_PROCEDENCIA);
    totalRow(shProc, COLS_PROCEDENCIA.length, procedencia.length);

    // ════════════════════════════════════════════════════════
    // HOJA 5: GÉNERO
    // ════════════════════════════════════════════════════════
    const shGen = wb.addWorksheet("👥 Género");
    titulo(shGen, "DISTRIBUCIÓN POR GÉNERO", COLS_GENERO.length, periodo);
    headers(shGen, COLS_GENERO);
    filas(shGen, genero, COLS_GENERO);

    // ════════════════════════════════════════════════════════
    // HOJA 6: EDADES
    // ════════════════════════════════════════════════════════
    const shEd = wb.addWorksheet("📅 Rangos de Edad");
    titulo(shEd, "DISTRIBUCIÓN POR RANGOS DE EDAD", COLS_EDADES.length, periodo);
    headers(shEd, COLS_EDADES);
    filas(shEd, edades, COLS_EDADES);

    const buffer = await wb.xlsx.writeBuffer();
    Swal.fire("Generado", "Dashboard generado correctamente", "success");
    saveAs(new Blob([buffer]), `Dashboard_Salud_${fechaInicio}_${fechaFin}.xlsx`);
};

// ── Componente ────────────────────────────────────────────────────────────────
const ReporteDashboard = ({ onClose, token }) => {
    const today = getToday();
    const [form, setForm] = useState({ fechaInicio: today, fechaFin: today });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const GetReporte = async () => {
        setLoading(true);
        LoadingDefault("Consultando datos...");
        const q = `fechaDesde=${form.fechaInicio}&fechaHasta=${form.fechaFin}`;

        try {
            const [resEst, resAten, resProc, resGen, resEd] = await Promise.all([
                getFetch(`${URL_ESTADISTICAS}?${q}`,  token),
                getFetch(`${URL_ATENCIONES}?${q}`,    token),
                getFetch(`${URL_PROCEDENCIA}?${q}`,   token),
                getFetch(`${URL_GENERO}?${q}`,        token),
                getFetch(`${URL_EDADES}?${q}`,        token),
            ]);

            const raw = (r) => r?.resultado ?? r ?? [];
            const datos = {
                estadisticas: normEstadisticas(raw(resEst)),
                atenciones:   Array.isArray(raw(resAten)) ? raw(resAten) : [],
                procedencia:  Array.isArray(raw(resProc)) ? raw(resProc) : [],
                genero:       normGenero(raw(resGen)),
                edades:       normEdades(raw(resEd)),
            };

            await generarDashboard(datos, form.fechaInicio, form.fechaFin);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Hubo un error al consultar los datos", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-auto max-w-[80%] max-h-[90vh] flex flex-col p-6 gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-blue-600 text-xl font-semibold">Dashboard — Reporte de Campaña</h2>
                    <FontAwesomeIcon icon={faTimes} className="cursor-pointer text-black" style={{ fontSize: 14 }} onClick={onClose} />
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col flex-grow">
                        <p className="font-semibold mb-1">Fecha Inicio</p>
                        <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleChange}
                            className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none" />
                    </div>
                    <div className="flex flex-col flex-grow">
                        <p className="font-semibold mb-1">Fecha Fin</p>
                        <input type="date" name="fechaFin" value={form.fechaFin} onChange={handleChange}
                            className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none" />
                    </div>
                </div>

                <p className="text-xs text-gray-500">
                    Genera un Excel con 6 hojas: Resumen general, Visitas por estado, Atenciones por especialidad, Procedencia, Género y Rangos de edad.
                </p>

                <div className="flex justify-center">
                    <button
                        onClick={GetReporte}
                        disabled={loading}
                        className="verde-btn px-6 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? "Generando..." : "Generar Dashboard"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReporteDashboard;
