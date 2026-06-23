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
        const data = {
            "fechaInicio": form.fechaInicio,
            "fechaFinal": form.fechaFin,
            "sede": sede
        }
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

        // Obtener keys de examenes dinámicamente del primer registro
        const examenKeys = Object.keys(data[0]?.examenes || {});
        const examenLabels = {
            triaje: "TRIAJE",
            audiometria: "AUDIOMETRÍA",
            rayos_x: "RAYOS X",
            espirometria: "ESPIROMETRÍA",
            oftalmologia: "OFTALMOLOGÍA",
            laboratorio: "LABORATORIO",
            conduccion: "CONDUCCIÓN",
            altura: "ALTURA",
            psicologia: "PSICOLOGÍA",
            odontologia: "ODONTOLOGÍA",
            ekg: "EKG",
        };

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("REPORTE EXÁMENES");

        // ── Headers base (fijos) ──────────────────────────────────────
        const headersFijos = [
            { key: "norden", label: "N° ORDEN", width: 14, destacado: false },
            { key: "dni", label: "DNI", width: 14, destacado: false },
            { key: "apellidos", label: "APELLIDOS", width: 28, destacado: false },
            { key: "nombres", label: "NOMBRES", width: 24, destacado: false },
            { key: "empresa", label: "EMPRESA", width: 30, destacado: false },
            { key: "fechaApertura", label: "FECHA", width: 30, destacado: false },
        ];

        // Headers dinámicos de exámenes (todos destacados)
        const headersExamenes = examenKeys.map(key => ({
            key,
            label: examenLabels[key] || key.toUpperCase().replace(/_/g, " "),
            width: 14,
            destacado: true,
            esExamen: true
        }));

        const headers = [...headersFijos, ...headersExamenes];
        const totalCols = headers.length;
        const colLetter = (n) => {
            let s = "";
            while (n > 0) { s = String.fromCharCode(((n - 1) % 26) + 65) + s; n = Math.floor((n - 1) / 26); }
            return s;
        };
        const lastCol = colLetter(totalCols);

        // ── Título ────────────────────────────────────────────────────
        sheet.mergeCells(`A1:${lastCol}1`);
        const titleCell = sheet.getCell("A1");
        titleCell.value = `REPORTE DE EXÁMENES | ${fechaInicio} al ${fechaFin}`;
        titleCell.font = { bold: true, size: 13, color: { argb: "FFFFFFFF" } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
        sheet.getRow(1).height = 25;

        // ── Fila de headers ───────────────────────────────────────────
        const headerRow = sheet.addRow(headers.map(h => h.label));
        headerRow.height = 22;

        headerRow.eachCell((cell, colNumber) => {
            const h = headers[colNumber - 1];
            cell.font = { bold: true, size: 9, color: { argb: "FFFFFFFF" } };
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
            cell.fill = {
                type: "pattern", pattern: "solid",
                fgColor: { argb: h?.esExamen ? "FF1D6B5E" : "FF2E75B6" }
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
        data.forEach((item, rowIdx) => {
            const valoresFijos = headersFijos.map(h => item[h.key] ?? "");
            const valoresExamenes = examenKeys.map(key => item.examenes?.[key] ?? "");
            const values = [...valoresFijos, ...valoresExamenes];

            const dataRow = sheet.addRow(values);
            dataRow.height = 18;
            const esPar = rowIdx % 2 === 0;

            dataRow.eachCell((cell, colNumber) => {
                const h = headers[colNumber - 1];
                const esExamen = h?.esExamen;
                const valorCell = cell.value;

                // Color especial para SI/NO en exámenes
                let fillColor;
                if (esExamen) {
                    if (valorCell === "SI") fillColor = esPar ? "FFB7E1CD" : "FFD4EDDA"; // verde
                    else if (valorCell === "NO") fillColor = esPar ? "FFF5C6CB" : "FFF8D7DA"; // rojo
                    else fillColor = esPar ? "FFEEEEEE" : "FFFFFFFF"; // neutro
                } else {
                    fillColor = esPar ? "FFF2F2F2" : "FFFFFFFF";
                }

                cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
                cell.font = { size: 9, bold: esExamen };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fillColor } };
                cell.border = {
                    top: { style: "hair", color: { argb: "FFCCCCCC" } },
                    bottom: { style: "hair", color: { argb: "FFCCCCCC" } },
                    left: { style: "hair", color: { argb: "FFCCCCCC" } },
                    right: { style: "hair", color: { argb: "FFCCCCCC" } },
                };
            });
        });

        // ── Fila total ────────────────────────────────────────────────
        const totalRow = sheet.addRow([`TOTAL: ${data.length} registros`, ...Array(totalCols - 1).fill("")]);
        sheet.mergeCells(`A${totalRow.number}:${lastCol}${totalRow.number}`);
        const totalCell = sheet.getCell(`A${totalRow.number}`);
        totalCell.font = { bold: true, size: 9, color: { argb: "FFFFFFFF" } };
        totalCell.alignment = { horizontal: "right", vertical: "middle" };
        totalCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
        totalRow.height = 18;

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