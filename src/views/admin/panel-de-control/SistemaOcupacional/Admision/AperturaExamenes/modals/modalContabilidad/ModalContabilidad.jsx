import { faFileExcel, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { getToday } from "../../../../../../../utils/helpers";
import { SubmitData } from "../../../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../../../utils/functionUtils";
import { useSessionData } from "../../../../../../../hooks/useSessionData";

const URL_SUBMIT = "/api/v01/st/registros/matrizOcupacional2026";

const BASIC_HEADERS = [
    { key: "item", label: "N° ORDEN", width: 14 },
    { key: "FECHAEMO", label: "FECHA EMO", width: 14 },
    { key: "NOMBRES", label: "NOMBRES", width: 28 },
    { key: "DNI", label: "DNI", width: 14 },
    { key: "SEXO", label: "SEXO", width: 8 },
    { key: "EDAD", label: "EDAD", width: 8 },
    { key: "CARGO", label: "CARGO", width: 22 },
    { key: "CONTRATA", label: "CONTRATA", width: 26 },
    { key: "EMPRESA", label: "EMPRESA", width: 28 },
    { key: "tipo de EXAMEN", label: "TIPO EXAMEN", width: 18 },
    { key: "PRECIO DE EXAMEN", label: "PRECIO", width: 12 },
];

const EXAM_HEADERS = [
    { key: "EXAMEN PSICOSENSOMETRICO", label: "PSICOSENSOMETRICO", width: 18 },
    { key: "EXAMEN TRAB. EN ALTURA", label: "TRAB. EN ALTURA", width: 16 },
    { key: "EXAMEN TRABAJOS EN CALIENTE", label: "TRAB. CALIENTE", width: 16 },
    { key: "EXAMEN PRUEBA DE ESFUERZO", label: "PRUEBA ESFUERZO", width: 16 },
    { key: "EXAMEN MANIPULADOR DE ALIMENTOS", label: "MANIP. ALIMENTOS", width: 16 },
    { key: "EXAMEN DE VIGIA", label: "VIGIA", width: 10 },
    { key: "EXAMEN DE HERRAMIENTAS MANUALES", label: "HERR. MANUALES", width: 16 },
    { key: "EXAMEN DE SANIDAD", label: "SANIDAD", width: 12 },
    { key: "EXAMEN TOXICOLOGICO", label: "TOXICOLOGICO", width: 14 },
    { key: "EXAMEN DE ESPACIOS CONFINADOS", label: "ESP. CONFINADOS", width: 16 },
    { key: "SEDE", label: "SEDE", width: 12 },
];

const ModalContabilidad = ({ onClose, sede, token }) => {
    const today = getToday();
    const { userCompleto } = useSessionData();
    const sedes = userCompleto?.sedes || [];
    const [form, setForm] = useState({
        fechaDesde: today,
        fechaHasta: today,
        empresa: "",
        sedeFilter: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const getReporte = () => {
        LoadingDefault("Generando Reporte");
        const data = {
            fechaDesde: form.fechaDesde,
            fechaHasta: form.fechaHasta,
            empresa: form.empresa,
            sede: form.sedeFilter,
        };
        SubmitData(data, URL_SUBMIT, token)
            .then((res) => {
                const lista = res?.resultado || res || [];
                generarExcel(lista);
            })
            .catch(() => {
                Swal.fire("Error", "Hubo un error al generar el reporte", "error");
            });
    };

    const generarExcel = async (data) => {
        if (!data || data.length === 0) {
            Swal.fire("Sin datos", "No hay registros para exportar", "info");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("CONTABILIDAD");

        const totalCols = BASIC_HEADERS.length + EXAM_HEADERS.length;
        const lastCol = String.fromCharCode(64 + totalCols);
        const examStartCol = BASIC_HEADERS.length + 1;
        const examEndCol = totalCols;
        const toColLetter = (n) => n <= 26 ? String.fromCharCode(64 + n) : "A" + String.fromCharCode(64 + n - 26);

        // ── Logo ────────────────────────────────────────────────────────
        try {
            const logoRes = await fetch("/img/Logo-FondoBlanco.jpeg");
            if (logoRes.ok) {
                const logoBuffer = await logoRes.arrayBuffer();
                const imageId = workbook.addImage({ buffer: logoBuffer, extension: "png" });
                sheet.addImage(imageId, {
                    tl: { col: 0, row: 0 },
                    ext: { width: 190, height: 84 },
                });
            }
        } catch { /* logo opcional, no bloquea */ }

        // ── Fila 1: Título ──────────────────────────────────────────────
        sheet.mergeCells(`A1:${lastCol}1`);
        const titleCell = sheet.getCell("A1");
        titleCell.value = `REPORTE DE CONTABILIDAD | ${form.fechaDesde} al ${form.fechaHasta}${form.empresa ? " | " + form.empresa.toUpperCase() : ""}`;
        titleCell.font = { bold: true, size: 13, color: { argb: "FFFFFFFF" } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
        sheet.getRow(1).height = 80;

        // ── Fila 2: Encabezado agrupado ─────────────────────────────────
        // Celdas básicas en blanco (se verán vacías, los sub-headers están en fila 3)
        for (let c = 1; c <= BASIC_HEADERS.length; c++) {
            sheet.mergeCells(`${toColLetter(c)}2:${toColLetter(c)}3`);
            const cell = sheet.getCell(`${toColLetter(c)}2`);
            cell.value = BASIC_HEADERS[c - 1].label;
            cell.font = { bold: true, size: 9, color: { argb: "FFFFFFFF" } };
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2E75B6" } };
            cell.border = { top: { style: "thin", color: { argb: "FFFFFFFF" } }, bottom: { style: "thin", color: { argb: "FFFFFFFF" } }, left: { style: "thin", color: { argb: "FFFFFFFF" } }, right: { style: "thin", color: { argb: "FFFFFFFF" } } };
        }

        // "EXAMENES COMPLEMENTARIOS" abarca todas las columnas de examen
        sheet.mergeCells(`${toColLetter(examStartCol)}2:${toColLetter(examEndCol)}2`);
        const groupCell = sheet.getCell(`${toColLetter(examStartCol)}2`);
        groupCell.value = "EXAMENES COMPLEMENTARIOS";
        groupCell.font = { bold: true, size: 10, color: { argb: "FFFFFFFF" } };
        groupCell.alignment = { horizontal: "center", vertical: "middle" };
        groupCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E5C00" } };
        groupCell.border = { top: { style: "thin", color: { argb: "FFFFFFFF" } }, bottom: { style: "thin", color: { argb: "FFFFFFFF" } }, left: { style: "thin", color: { argb: "FFFFFFFF" } }, right: { style: "thin", color: { argb: "FFFFFFFF" } } };
        sheet.getRow(2).height = 22;

        // ── Fila 3: Sub-headers de exámenes ────────────────────────────
        EXAM_HEADERS.forEach((h, i) => {
            const col = examStartCol + i;
            const cell = sheet.getCell(`${toColLetter(col)}3`);
            cell.value = h.label;
            cell.font = { bold: true, size: 8, color: { argb: "FFFFFFFF" } };
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4CAF50" } };
            cell.border = { top: { style: "thin", color: { argb: "FFFFFFFF" } }, bottom: { style: "thin", color: { argb: "FFFFFFFF" } }, left: { style: "thin", color: { argb: "FFFFFFFF" } }, right: { style: "thin", color: { argb: "FFFFFFFF" } } };
        });
        sheet.getRow(3).height = 36;

        // ── Anchos de columna ───────────────────────────────────────────
        sheet.columns = [
            ...BASIC_HEADERS.map(h => ({ width: h.width })),
            ...EXAM_HEADERS.map(h => ({ width: h.width })),
        ];

        // ── Filas de datos ──────────────────────────────────────────────
        data.forEach((item, rowIdx) => {
            const basicValues = BASIC_HEADERS.map(h => item[h.key] ?? "");
            const examValues = EXAM_HEADERS.map(h => {
                const v = item[h.key];
                if (typeof v === "boolean") return v ? "SI" : "";
                return v ?? "";
            });
            const row = sheet.addRow([...basicValues, ...examValues]);
            row.height = 18;

            const esPar = rowIdx % 2 === 0;

            row.eachCell((cell, colNumber) => {
                const isExam = colNumber > BASIC_HEADERS.length;
                cell.alignment = { horizontal: isExam ? "center" : "left", vertical: "middle", wrapText: true };
                cell.font = {
                    size: 9,
                    bold: isExam && cell.value === "SI",
                    color: { argb: isExam && cell.value === "SI" ? "FF1E5C00" : "FF000000" },
                };
                cell.fill = {
                    type: "pattern", pattern: "solid",
                    fgColor: {
                        argb: isExam
                            ? (esPar ? "FFE8F5E9" : "FFF1F8E9")
                            : (esPar ? "FFF2F2F2" : "FFFFFFFF"),
                    },
                };
                cell.border = {
                    top: { style: "hair", color: { argb: "FFCCCCCC" } },
                    bottom: { style: "hair", color: { argb: "FFCCCCCC" } },
                    left: { style: "hair", color: { argb: "FFCCCCCC" } },
                    right: { style: "hair", color: { argb: "FFCCCCCC" } },
                };
            });
        });

        // ── Exportar ────────────────────────────────────────────────────
        const buffer = await workbook.xlsx.writeBuffer();
        Swal.fire("Generado", "Reporte generado correctamente", "success");
        saveAs(new Blob([buffer]), `Reporte_Contabilidad_${form.fechaDesde}_${form.fechaHasta}.xlsx`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-auto max-w-[90%] max-h-[90vh] flex flex-col p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-blue-600 text-xl font-semibold">Reporte Contabilidad</h2>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="cursor-pointer text-black"
                        style={{ fontSize: "14px" }}
                        onClick={onClose}
                    />
                </div>

                <div className="flex items-end gap-4 flex-wrap">
                    <div className="flex flex-col flex-grow min-w-[140px]">
                        <p className="font-semibold text-sm mb-1">Fecha Inicio</p>
                        <input
                            type="date"
                            name="fechaDesde"
                            value={form.fechaDesde}
                            onChange={handleChange}
                            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none text-sm"
                        />
                    </div>
                    <div className="flex flex-col flex-grow min-w-[140px]">
                        <p className="font-semibold text-sm mb-1">Fecha Fin</p>
                        <input
                            type="date"
                            name="fechaHasta"
                            value={form.fechaHasta}
                            onChange={handleChange}
                            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none text-sm"
                        />
                    </div>
                    <div className="flex flex-col flex-grow min-w-[180px]">
                        <p className="font-semibold text-sm mb-1">Empresa <span className="text-gray-400 font-normal">(opcional)</span></p>
                        <input
                            type="text"
                            name="empresa"
                            value={form.empresa}
                            onChange={handleChange}
                            placeholder="Todas las empresas"
                            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none text-sm"
                        />
                    </div>
                    <div className="flex flex-col flex-grow min-w-[160px]">
                        <p className="font-semibold text-sm mb-1">Sede <span className="text-gray-400 font-normal">(opcional)</span></p>
                        <select
                            name="sedeFilter"
                            value={form.sedeFilter}
                            onChange={handleChange}
                            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none text-sm bg-white"
                        >
                            <option value="">Todas las sedes</option>
                            {sedes.map((s) => (
                                <option key={s.cod_sede} value={s.cod_sede}>{s.nombre_sede}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex mt-5 justify-center">
                    <button
                        onClick={getReporte}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-sm font-semibold"
                    >
                        <FontAwesomeIcon icon={faFileExcel} />
                        Exportar Excel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalContabilidad;
