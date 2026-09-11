import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { getFetch } from "../../../../../utils/apiHelpers";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { LoadingDefault } from "../../../../../utils/functionUtils";

// ── Colores ───────────────────────────────────────────────────────────────────
const C = {
    azulOscuro: "FF1F4E79",
    azulMedio:  "FF2E75B6",
    grisClaro:  "FFF2F2F2",
    blanco:     "FFFFFFFF",
};

const bordes = (style, argb) => ({
    top:    { style, color: { argb } },
    left:   { style, color: { argb } },
    bottom: { style, color: { argb } },
    right:  { style, color: { argb } },
});

const COLUMNAS = [
    { label: "ID",            key: "id",           w: 8  },
    { label: "Nombre",        key: "nombre",        w: 42 },
    { label: "Presentación",  key: "presentacion",  w: 22 },
    { label: "Laboratorio",   key: "laboratorio",   w: 22 },
    { label: "Marca",         key: "marca",         w: 20 },
    { label: "Unidad Medida", key: "unidadMedida",  w: 16 },
    { label: "Stock Actual",  key: "stockActual",   w: 14 },
    { label: "Stock Mínimo",  key: "stockMinimo",   w: 14 },
    { label: "Activo",        key: "activo",        w: 10 },
];

async function generarExcel(medicamentos) {
    const wb   = new ExcelJS.Workbook();
    const sheet = wb.addWorksheet("Medicamentos");
    const fecha = new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
    const ncols = COLUMNAS.length;

    // ── Fila título ───────────────────────────────────────────────────────────
    const lastCol = String.fromCharCode(64 + ncols);
    sheet.mergeCells(`A1:${lastCol}1`);
    const titleCell = sheet.getCell("A1");
    titleCell.value = `Reporte de Medicamentos  |  ${fecha}`;
    titleCell.font      = { bold: true, size: 12, color: { argb: C.blanco } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: C.azulOscuro } };
    sheet.getRow(1).height = 26;

    // ── Fila headers ─────────────────────────────────────────────────────────
    const headerRow = sheet.addRow(COLUMNAS.map(c => c.label));
    headerRow.height = 20;
    headerRow.eachCell((cell) => {
        cell.font      = { bold: true, size: 9, color: { argb: C.blanco } };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: C.azulMedio } };
        cell.border    = bordes("thin", C.blanco);
    });
    sheet.columns = COLUMNAS.map(c => ({ width: c.w }));

    // ── Filas de datos ────────────────────────────────────────────────────────
    medicamentos.forEach((item, idx) => {
        const values = COLUMNAS.map(c => {
            if (c.key === "activo") return item.activo ? "Sí" : "No";
            return item[c.key] ?? "";
        });
        const row = sheet.addRow(values);
        row.height = 18;
        const par  = idx % 2 === 0;
        row.eachCell(cell => {
            cell.font      = { size: 9 };
            cell.alignment = { vertical: "middle", wrapText: true };
            cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: par ? C.grisClaro : C.blanco } };
            cell.border    = bordes("hair", "FFCCCCCC");
        });
    });

    // ── Fila total ────────────────────────────────────────────────────────────
    const totalRow = sheet.addRow(["", `Total: ${medicamentos.length} medicamentos`]);
    totalRow.getCell(2).font      = { bold: true, size: 9 };
    totalRow.getCell(2).alignment = { vertical: "middle" };

    const buf  = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `Medicamentos_${fecha.replace(/\//g, "-")}.xlsx`);
}

export default function ReportesInventario() {
    const { token } = useSessionData();
    const [cargando, setCargando] = useState(false);

    const handleExportar = async () => {
        setCargando(true);
        LoadingDefault("Generando Excel...");
        try {
            const data = await getFetch("/api/medicamentos", token);
            const lista = Array.isArray(data) ? data : [];
            if (lista.length === 0) {
                Swal.fire("Sin datos", "No se encontraron medicamentos para exportar", "info");
                return;
            }
            await generarExcel(lista);
            Swal.close();
        } catch {
            Swal.fire("Error", "No se pudo generar el reporte", "error");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[300px]">
            <button
                onClick={handleExportar}
                disabled={cargando}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-lg font-bold shadow-lg transition-colors disabled:opacity-60"
            >
                <FontAwesomeIcon icon={faFileExcel} className="text-2xl" />
                {cargando ? "Generando..." : "Exportar Medicamentos"}
            </button>
        </div>
    );
}
