import { faFileExcel, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { getToday } from "../../../../../../../utils/helpers";
import { SubmitData } from "../../../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../../../utils/functionUtils";
import { textoDocumento } from "../../../../../../../utils/documentoPaciente";

const URL_SUBMIT = "/api/v01/st/registros/atenciones-admision";

// Las columnas salen de las claves de la respuesta (el backend ya las manda con su título, en el
// orden del reporte). Aquí solo se afina el ancho de las que necesitan más espacio y cuáles son
// fechas, documentos o resultados de exámenes complementarios (PASÓ / NO PASÓ).
const ANCHO_POR_DEFECTO = 16;
const ANCHOS = {
    "N DE ORDEN": 12,
    "FECHA DEL EMO": 14,
    "NOMBRES COMPLETOS": 34,
    DNI: 14,
    SEXO: 8,
    "FECHA DE NACIMIENTO": 16,
    EDAD: 8,
    "DIRECCIÓN": 28,
    CELULAR: 14,
    CARGO: 22,
    CONTRATA: 28,
    EMPRESA: 26,
    "TIPO DE EXAMEN": 18,
    PROTOCOLO: 32,
    USUARIO: 34,
    SEDE: 24,
};
const COLUMNA_DOCUMENTO = "DNI";
const COLUMNAS_RESULTADO = ["TEST DE ALTURA", "VISUAL COMPLEMENTARIO", "EKG"];

const BORDE_BLANCO = { style: "thin", color: { argb: "FFFFFFFF" } };
const BORDE_TENUE = { style: "hair", color: { argb: "FFCCCCCC" } };
const relleno = (argb) => ({ type: "pattern", pattern: "solid", fgColor: { argb } });

// Letra de columna de Excel (1 = A, 27 = AA)
const letraColumna = (n) => {
    let letra = "";
    while (n > 0) {
        letra = String.fromCharCode(((n - 1) % 26) + 65) + letra;
        n = Math.floor((n - 1) / 26);
    }
    return letra;
};

const colorResultado = (valor, esPar) => {
    if (valor === "PASÓ") return { fondo: esPar ? "FFB7E1CD" : "FFD4EDDA", texto: "FF1E5C00" };
    if (valor === "NO PASÓ") return { fondo: esPar ? "FFF5C6CB" : "FFF8D7DA", texto: "FF9B2226" };
    return null;
};

const ModalAtencionesAdmision = ({ onClose, sede, token }) => {
    const today = getToday();
    const [form, setForm] = useState({ fechaInicio: today, fechaFinal: today });
    const [generando, setGenerando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const getReporte = async () => {
        if (!form.fechaInicio || !form.fechaFinal) {
            Swal.fire("Error", "Seleccione el rango de fechas", "error");
            return;
        }
        if (form.fechaInicio > form.fechaFinal) {
            Swal.fire("Error", "La fecha de inicio no puede ser mayor a la fecha final", "error");
            return;
        }

        setGenerando(true);
        LoadingDefault("Generando Reporte");
        try {
            const res = await SubmitData({ fechaInicio: form.fechaInicio, fechaFinal: form.fechaFinal, sede }, URL_SUBMIT, token);
            // El backend responde la lista directa (o envuelta en { resultado }); un error HTTP llega sin lista.
            const lista = Array.isArray(res) ? res : res?.resultado;
            if (!Array.isArray(lista)) throw new Error("respuesta inválida");
            await generarExcel(lista);
        } catch {
            Swal.fire("Error", "Hubo un error al generar el reporte", "error");
        } finally {
            setGenerando(false);
        }
    };

    const generarExcel = async (data) => {
        if (data.length === 0) {
            Swal.fire("Sin datos", "No hay registros para exportar", "info");
            return;
        }

        const columnas = Object.keys(data[0]);
        const lastCol = letraColumna(columnas.length);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("ATENCIONES ADMISIÓN");

        // ── Fila 1: Título ──────────────────────────────────────────────
        sheet.mergeCells(`A1:${lastCol}1`);
        const titleCell = sheet.getCell("A1");
        titleCell.value = `REPORTE ATENCIONES - ADMISIÓN | ${form.fechaInicio} al ${form.fechaFinal}`;
        titleCell.font = { bold: true, size: 13, color: { argb: "FFFFFFFF" } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        titleCell.fill = relleno("FF1F4E79");
        sheet.getRow(1).height = 25;

        // ── Fila 2: Encabezados ─────────────────────────────────────────
        const headerRow = sheet.addRow(columnas);
        headerRow.height = 30;
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, size: 9, color: { argb: "FFFFFFFF" } };
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
            cell.fill = relleno("FF2E75B6");
            cell.border = { top: BORDE_BLANCO, bottom: BORDE_BLANCO, left: BORDE_BLANCO, right: BORDE_BLANCO };
        });

        sheet.columns = columnas.map((c) => ({ width: ANCHOS[c] ?? ANCHO_POR_DEFECTO }));

        // ── Filas de datos ──────────────────────────────────────────────
        data.forEach((item, rowIdx) => {
            const row = sheet.addRow(columnas.map((c) => (c === COLUMNA_DOCUMENTO ? textoDocumento(item[c]) : item[c] ?? "")));
            row.height = 18;
            const esPar = rowIdx % 2 === 0;

            row.eachCell((cell, colNumber) => {
                const columna = columnas[colNumber - 1];
                const resultado = COLUMNAS_RESULTADO.includes(columna) ? colorResultado(cell.value, esPar) : null;

                cell.alignment = {
                    horizontal: typeof cell.value === "number" || COLUMNAS_RESULTADO.includes(columna) ? "center" : "left",
                    vertical: "middle",
                    wrapText: true,
                };
                cell.font = { size: 9, bold: Boolean(resultado), color: { argb: resultado?.texto ?? "FF000000" } };
                cell.fill = relleno(resultado?.fondo ?? (esPar ? "FFF2F2F2" : "FFFFFFFF"));
                cell.border = { top: BORDE_TENUE, bottom: BORDE_TENUE, left: BORDE_TENUE, right: BORDE_TENUE };
            });
        });

        // Encabezados siempre visibles al desplazarse por un reporte largo
        sheet.views = [{ state: "frozen", ySplit: 2 }];

        // ── Exportar ────────────────────────────────────────────────────
        const buffer = await workbook.xlsx.writeBuffer();
        Swal.fire("Generado", "Reporte generado correctamente", "success");
        saveAs(new Blob([buffer]), `Reporte_Atenciones_Admision_${form.fechaInicio}_${form.fechaFinal}.xlsx`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-auto max-w-[90%] max-h-[90vh] flex flex-col p-6">
                <div className="flex justify-between items-center mb-4 gap-6">
                    <h2 className="text-blue-600 text-xl font-semibold">Reporte Atenciones - Admisión</h2>
                    <FontAwesomeIcon icon={faTimes} className="cursor-pointer text-black" style={{ fontSize: "14px" }} onClick={onClose} />
                </div>

                <div className="flex items-end gap-4 flex-wrap">
                    <div className="flex flex-col flex-grow min-w-[140px]">
                        <p className="font-semibold text-sm mb-1">Fecha Inicio</p>
                        <input
                            type="date"
                            name="fechaInicio"
                            value={form.fechaInicio}
                            onChange={handleChange}
                            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none text-sm"
                        />
                    </div>
                    <div className="flex flex-col flex-grow min-w-[140px]">
                        <p className="font-semibold text-sm mb-1">Fecha Fin</p>
                        <input
                            type="date"
                            name="fechaFinal"
                            value={form.fechaFinal}
                            onChange={handleChange}
                            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none text-sm"
                        />
                    </div>
                </div>

                <div className="flex mt-5 justify-center">
                    <button
                        onClick={getReporte}
                        disabled={generando}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded text-sm font-semibold"
                    >
                        <FontAwesomeIcon icon={faFileExcel} />
                        Exportar Excel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAtencionesAdmision;
