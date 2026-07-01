import { faFileExcel, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { getToday } from "../../../../../../../utils/helpers";
import { SubmitData } from "../../../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../../../utils/functionUtils";

const urlSubmit = "/api/v01/st/registros/admision"

const ReportePacientes = ({ onClose, sede, token }) => {
    const today = getToday();
    const [form, setForm] = useState({
        fechaInicio: today,
        fechaFin: today
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
        const data = {
            "fechaInicio": form.fechaInicio,
            "fechaFinal": form.fechaFin,
            "sede": sede
        }
        SubmitData(data, urlSubmit, token)
            .then((res) => {
                const lista = res?.resultado || res || [];
                generarExcelReporte(lista, form.fechaInicio, form.fechaFin);
            })
            .catch(() => {
                Swal.fire("Error", "Hubo un error en la consulta", "error")
            })
    }

    const generarExcelReporte = async (data, fechaInicio, fechaFin) => {
        if (!data || data.length === 0) {
            Swal.fire("Sin datos", "No hay registros para exportar", "info");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("REPORTE");

        // ── Título ────────────────────────────────────────────────────
        sheet.mergeCells("A1:L1");
        const titleCell = sheet.getCell("A1");
        titleCell.value = `REPORTE DE ADMISIONES | ${fechaInicio} al ${fechaFin}`;
        titleCell.font = { bold: true, size: 13, color: { argb: "FFFFFFFF" } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
        sheet.getRow(1).height = 25;

        // ── Headers ───────────────────────────────────────────────────
        const headers = [
            { key: "item", label: "N°", width: 6, destacado: false },
            { key: "norden", label: "N° ORDEN", width: 14, destacado: false },
            { key: "dni", label: "DNI", width: 14, destacado: true },
            { key: "apellidos", label: "APELLIDOS", width: 28, destacado: true },
            { key: "nombres", label: "NOMBRES", width: 24, destacado: true },
            { key: "edad", label: "EDAD", width: 8, destacado: false },
            { key: "empresa", label: "EMPRESA", width: 30, destacado: true },
            { key: "contrata", label: "CONTRATA", width: 28, destacado: false },
            { key: "tipoExamen", label: "TIPO EXAMEN", width: 18, destacado: false },
            { key: "protocolo", label: "PROTOCOLO", width: 16, destacado: true },
            { key: "aptitud", label: "APTITUD", width: 16, destacado: true },
            { key: "fechaAdmision", label: "FECHA", width: 14, destacado: false },
            { key: "sede", label: "SEDE", width: 10, destacado: false },
        ];

        const headerRow = sheet.addRow(headers.map(h => h.label));
        headerRow.height = 20;

        headerRow.eachCell((cell, colNumber) => {
            const h = headers[colNumber - 1];
            const esDestacado = h?.destacado;

            cell.font = { bold: true, size: 9, color: { argb: "FFFFFFFF" } };
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
            cell.fill = {
                type: "pattern", pattern: "solid",
                fgColor: { argb: esDestacado ? "FFB8860B" : "FF2E75B6" }
            };
            cell.border = {
                top: { style: "thin", color: { argb: "FFFFFFFF" } },
                bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
                left: { style: "thin", color: { argb: "FFFFFFFF" } },
                right: { style: "thin", color: { argb: "FFFFFFFF" } },
            };
        });

        sheet.columns = headers.map(h => ({ width: h.width }));

        // ── Filas de datos ────────────────────────────────────────────
        const destacadosIdx = headers
            .map((h, i) => h.destacado ? i + 1 : null)
            .filter(Boolean); // columnas 1-based destacadas

        data.forEach((item, rowIdx) => {
            const values = headers.map(h => item[h.key] ?? "");
            const dataRow = sheet.addRow(values);
            dataRow.height = 18;

            const esPar = rowIdx % 2 === 0;

            dataRow.eachCell((cell, colNumber) => {
                const esDestacado = destacadosIdx.includes(colNumber);

                cell.alignment = { vertical: "middle", wrapText: true };
                cell.font = {
                    size: 9,
                    bold: esDestacado,
                    color: { argb: esDestacado ? "FF1F4E79" : "FF000000" }
                };
                cell.fill = {
                    type: "pattern", pattern: "solid",
                    fgColor: {
                        argb: esDestacado
                            ? (esPar ? "FFFFF3CD" : "FFFEF9E7")  // amarillo claro destacado
                            : (esPar ? "FFF2F2F2" : "FFFFFFFF")  // gris alterno normal
                    }
                };
                cell.border = {
                    top: { style: "hair", color: { argb: "FFCCCCCC" } },
                    bottom: { style: "hair", color: { argb: "FFCCCCCC" } },
                    left: { style: "hair", color: { argb: "FFCCCCCC" } },
                    right: { style: "hair", color: { argb: "FFCCCCCC" } },
                };
            });
        });

        // ── Fila total ────────────────────────────────────────────────
        const totalRow = sheet.addRow([`TOTAL: ${data.length} registros`, ...Array(11).fill("")]);
        sheet.mergeCells(`A${totalRow.number}:L${totalRow.number}`);
        const totalCell = sheet.getCell(`A${totalRow.number}`);
        totalCell.font = { bold: true, size: 9, color: { argb: "FFFFFFFF" } };
        totalCell.alignment = { horizontal: "right", vertical: "middle" };
        totalCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
        totalRow.height = 18;

        // ── Exportar ──────────────────────────────────────────────────
        const buffer = await workbook.xlsx.writeBuffer();
        Swal.fire("Generado", "Reporte generado correctamente", "success")
        saveAs(new Blob([buffer]), `Reporte_Admisiones_${fechaInicio}_${fechaFin}.xlsx`);
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

export default ReportePacientes