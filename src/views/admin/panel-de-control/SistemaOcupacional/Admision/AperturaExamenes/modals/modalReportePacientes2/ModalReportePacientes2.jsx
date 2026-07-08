import { faFileExcel, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { getToday } from "../../../../../../../utils/helpers";
import { getFetch, SubmitData } from "../../../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../../../utils/functionUtils";

const urlSubmit = "/api/v01/ct/clientes/completo"
const GetExamenesComplementarios = '/api/v01/ct/campana/obtenerEstados'

const ReportePacientes2 = ({ onClose, sede, token }) => {
    const today = getToday();
    const [form, setForm] = useState({
        fechaInicio: today,
        fechaFin: today,
        empresa: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((f) => {
            const upper = value.toUpperCase();
            return { ...f, [name]: upper };
        });
    };

    const GetReporte = () => {
        LoadingDefault("Generando Reporte");
        getFetch(urlSubmit + `?fechaInicio=${form.fechaInicio}&fechaFin=${form.fechaFin}&empresa=${form.empresa}&sede=${sede}`, token)
            .then((res) => {
                console.log(res)
                const lista = res?.resultado || res || [];
                generarExcelReporteExamenes(lista, form.fechaInicio, form.fechaFin);
            })
            .catch(() => {
                Swal.fire("Error", "Hubo un error en la consulta", "error")
            })
    }

    const generarExcelReporteExamenes = async (data, fechaInicio, fechaFin) => {
        if (!data || data.length === 0) {
            Swal.fire("Sin datos", "No hay registros para exportar", "info");
            return;
        }

        const examenKeys = Object.keys(data[0]?.examenes || {});
        const examenLabels = {
            triaje: "TRIAJE", audiometria: "AUDIOMETRÍA", rayos_x: "RAYOS X",
            espirometria: "ESPIROMETRÍA", oftalmologia: "OFTALMOLOGÍA", laboratorio: "LABORATORIO",
            conduccion: "CONDUCCIÓN", altura: "ALTURA", psicologia: "PSICOLOGÍA",
            odontologia: "ODONTOLOGÍA", ekg: "EKG",
        };

        const colLetter = (n) => {
            let s = "";
            while (n > 0) { s = String.fromCharCode(((n - 1) % 26) + 65) + s; n = Math.floor((n - 1) / 26); }
            return s;
        };

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("REPORTE EXÁMENES");

        const headersFijos = [
            { key: "norden", label: "N° ORDEN", width: 14, seccion: "general" },
            { key: "dni", label: "DNI", width: 14, seccion: "general" },
            { key: "apellidos", label: "APELLIDOS", width: 28, seccion: "general" },
            { key: "nombres", label: "NOMBRES", width: 24, seccion: "general" },
            { key: "edad", label: "EDAD", width: 8, seccion: "general" },
            { key: "empresa", label: "EMPRESA", width: 30, seccion: "general" },
            { key: "protocolo", label: "PERFIL", width: 24, seccion: "general" },
            { key: "fechaApertura", label: "FECHA", width: 14, seccion: "general" },
        ];

        const headersExamenes = examenKeys.map(key => ({
            key,
            label: examenLabels[key] || key.toUpperCase().replace(/_/g, " "),
            width: 14,
            seccion: "examen",
        }));

        // ── 4 columnas de complementos pre-registro ───────────────────
        const preRegistroMap = [
            { key: "comp_toma_muestras", backendKey: "TOMA_MUESTRAS", label: "TOMA DE MUESTRAS", width: 16 },
            { key: "comp_examen_medico", backendKey: "EXAMEN_MEDICO", label: "EXAMEN MÉDICO", width: 16 },
            { key: "COMP_RADIOGRAFIA", backendKey: "COMP_RADIOGRAFIA", label: "RADIOGRAFÍA", width: 14 },
            { key: "COMP_EKG", backendKey: "COMP_EKG", label: "EKG", width: 10 },
        ];
        const headersComplemento = preRegistroMap.map(({ key, label, width }) => ({
            key, label, width, seccion: "complemento",
        }));

        const headers = [...headersFijos, ...headersExamenes, ...headersComplemento];
        const totalCols = headers.length;
        const lastCol = colLetter(totalCols);
        const examenStart = headersFijos.length + 1;
        const compStart = headersFijos.length + headersExamenes.length + 1;
        const examenEndL = colLetter(compStart - 1);
        const compStartL = colLetter(compStart);

        // ── Fila 1: Título ────────────────────────────────────────────
        sheet.mergeCells(`A1:${lastCol}1`);
        const titleCell = sheet.getCell("A1");
        titleCell.value = `REPORTE DE EXÁMENES | ${fechaInicio} al ${fechaFin}`;
        titleCell.font = { bold: true, size: 13, color: { argb: "FFFFFFFF" } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
        sheet.getRow(1).height = 25;

        // ── Fila 2: Secciones ─────────────────────────────────────────
        const applySeccionCell = (cellRef, label, color) => {
            const cell = sheet.getCell(cellRef);
            cell.value = label;
            cell.font = { bold: true, size: 9, color: { argb: "FFFFFFFF" } };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };
        };

        sheet.mergeCells(`A2:${colLetter(examenStart - 1)}2`);
        applySeccionCell("A2", "DATOS GENERALES", "FF2E75B6");

        sheet.mergeCells(`${colLetter(examenStart)}2:${examenEndL}2`);
        applySeccionCell(`${colLetter(examenStart)}2`, "EXÁMENES REQUERIDOS", "FF1D6B5E");

        sheet.mergeCells(`${compStartL}2:${lastCol}2`);
        applySeccionCell(`${compStartL}2`, "COMPLEMENTOS PRE-REGISTRO", "FF6B4C9A");
        sheet.getRow(2).height = 18;

        // ── Fila 3: Headers de columnas ───────────────────────────────
        const headerRow = sheet.addRow(headers.map(h => h.label));
        headerRow.height = 22;

        const colorHeader = { general: "FF2E75B6", examen: "FF1D6B5E", complemento: "FF9B72CF" };
        headerRow.eachCell((cell, colNumber) => {
            const h = headers[colNumber - 1];
            cell.font = { bold: true, size: 9, color: { argb: "FFFFFFFF" } };
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colorHeader[h?.seccion] ?? "FF2E75B6" } };
            cell.border = {
                top: { style: "thin", color: { argb: "FFFFFFFF" } }, bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
                left: { style: "thin", color: { argb: "FFFFFFFF" } }, right: { style: "thin", color: { argb: "FFFFFFFF" } },
            };
        });

        sheet.columns = headers.map(h => ({ width: h.width }));

        // ── Filas de datos ────────────────────────────────────────────
        data.forEach((item, rowIdx) => {
            const preReg = item.examenesPreRegistro ?? {};

            const values = headers.map(h => {
                if (h.seccion === "examen") return item.examenes?.[h.key] ?? "";
                if (h.seccion === "complemento") {
                    const bk = preRegistroMap.find(p => p.key === h.key)?.backendKey;
                    return preReg[bk] === "PASÓ" ? "SÍ" : "NO";
                }
                return item[h.key] ?? "";
            });

            const dataRow = sheet.addRow(values);
            dataRow.height = 18;
            const esPar = rowIdx % 2 === 0;

            dataRow.eachCell((cell, colNumber) => {
                const h = headers[colNumber - 1];
                const val = cell.value;
                let fillColor;

                if (h?.seccion === "examen") {
                    if (val === "SI") fillColor = esPar ? "FFB7E1CD" : "FFD4EDDA";
                    else if (val === "NO") fillColor = esPar ? "FFF5C6CB" : "FFF8D7DA";
                    else fillColor = esPar ? "FFEEEEEE" : "FFFFFFFF";
                } else if (h?.seccion === "complemento") {
                    fillColor = val === "SÍ"
                        ? (esPar ? "FFD8F3DC" : "FFB7E4C7")
                        : (esPar ? "FFFFD6CC" : "FFFFB4A2");
                } else {
                    fillColor = esPar ? "FFF2F2F2" : "FFFFFFFF";
                }

                cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
                cell.font = {
                    size: 9,
                    bold: h?.seccion !== "general",
                    color: {
                        argb: h?.seccion === "complemento"
                            ? (val === "SÍ" ? "FF2D6A4F" : "FF9B2226")
                            : "FF000000"
                    }
                };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fillColor } };
                cell.border = {
                    top: { style: "hair", color: { argb: "FFCCCCCC" } }, bottom: { style: "hair", color: { argb: "FFCCCCCC" } },
                    left: { style: "hair", color: { argb: "FFCCCCCC" } }, right: { style: "hair", color: { argb: "FFCCCCCC" } },
                };
            });
        });

        // ── Exportar ──────────────────────────────────────────────────
        const buffer = await workbook.xlsx.writeBuffer();
        Swal.fire("Generado", "Reporte generado correctamente", "success");
        saveAs(new Blob([buffer]), `Reporte_Examenes_${fechaInicio}_${fechaFin}.xlsx`);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
                <div className="bg-white rounded-lg w-auto max-w-[80%]  max-h-[90vh] flex flex-col p-6 ">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-blue-600 text-xl font-semibold">
                            Buscar Reporte
                        </h2>
                        <FontAwesomeIcon icon={faTimes} className="cursor-pointer text-black" style={{ fontSize: '14px' }} onClick={onClose} />
                    </div>
                    <div className="flex items-center justify-between gap-8 ">
                        <div className="flex flex-col flex-grow ">
                            <p className="font-semibold">Fecha Inicio</p>
                            <input
                                type="date"
                                id="fechaInicio"
                                name="fechaInicio"
                                value={form.fechaInicio}
                                onChange={handleChange}
                                className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col flex-grow">
                            <p className="font-semibold">Fecha Fin</p>
                            <input
                                type="date"
                                id="fechaFin"
                                name="fechaFin"
                                value={form.fechaFin}
                                onChange={handleChange}
                                className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex mt-4 justify-center">
                        <button onClick={() => { GetReporte() }} className='verde-btn px-4 py-1 rounded flex items-center mr-3'>Generar Reporte</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReportePacientes2