import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { SubmitHistoriaC, SubmitHistoriaCMasivo } from "../model/AdminHistoriaC";
import { getToday } from "../../../../../utils/helpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { getFetch, SubmitData } from "../../../../../utils/apiHelpers";

export const handleSubirExcel = async (setData, setTotalPages) => {
    const { value: file } = await Swal.fire({
        title: "Selecciona un archivo Excel",
        input: "file",
        inputAttributes: {
            accept: ".xlsx,.xls",
            "aria-label": "Sube tu Excel"
        },
        showCancelButton: true,
        confirmButtonText: "Procesar",
    });

    if (!file) return;
    setData([]);

    const reader = new FileReader();
    reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        const dataPreparada = prepararDataExcel(jsonData);
        setData(dataPreparada);
        setTotalPages(Math.ceil(dataPreparada.length / 50));
    };
    reader.readAsBinaryString(file);
};

const separarNombreApellido = (nombreCompleto) => {
    if (!nombreCompleto || typeof nombreCompleto !== "string") {
        return { apellidosPa: "", nombresPa: "" };
    }
    const partes = nombreCompleto.split(",");
    if (partes.length >= 2) {
        return {
            apellidosPa: partes[0].trim(),
            nombresPa: partes.slice(1).join(",").trim(),
        };
    }
    // Si no hay coma, todo va a apellidos
    return { apellidosPa: nombreCompleto.trim(), nombresPa: "" };
};

export const submitMasivo = async (data, sede, token) => {
    LoadingDefault("Subiendo Datos");
    try {
        const body = data.map(row => ({
            codPa: row.codPa || null,
            apellidosPa: row.apellidosPa || "",
            nombresPa: row.nombresPa || "",
            fechaNaciminetoPa: row.fechaNaciminetoPa || "",
            sexoPa: row.sexoPa || "",
            area: row.area || "",
            cargo: row.cargo || "",
        }));
        console.log(sede)
        console.log("Body a enviar:", body);

        const response = await SubmitData(
            body,
            `/api/v01/ct/registroPacientes/datosPacienteMasivo/${sede}`,
            token
        );

        console.log("Respuesta API:", response);

        const errores = response?.resultado?.errores || [];
        const camposIgnorar = new Set(["id"]);

        const sinVariables = (reg) => {
            const obj = {};
            Object.keys(reg)
                .filter(k => !camposIgnorar.has(k))
                .sort()
                .forEach(k => { obj[k] = reg[k]; });
            return JSON.stringify(obj);
        };

        const erroresSet = new Map(
            errores.map(err => [sinVariables(err.registro), err.motivo])
        );

        const resultados = body.map((registro, index) => {
            const key = sinVariables(registro);
            const motivo = erroresSet.get(key);
            return {
                ok: !motivo,
                error: motivo || null,
                row: data[index],
                registro
            };
        });

        Swal.close();
        return resultados;

    } catch (error) {
        Swal.close();
        console.error(error);
        throw error;
    }
};

const prepararDataExcel = (data) => {
    return data
        .map((row) => {
            const { apellidosPa, nombresPa } = separarNombreApellido(
                row["NombresYApellidos"] || row["NOMBRESYAPELLIDOS"] || ""
            );
            const rawSexo = String(row["sexoPa"] || row["SEXOPA"] || "").trim().toUpperCase();
            const sexoPa = rawSexo.startsWith("F") ? "F" : rawSexo.startsWith("M") ? "M" : rawSexo;

            return {
                codPa: String(row["codPa"] || row["CODPA"] || "").trim().toUpperCase(),
                apellidosPa: apellidosPa.toUpperCase(),
                nombresPa: nombresPa.toUpperCase(),
                fechaNaciminetoPa: convertirFecha(row["fechaNaciminetoPa"] || row["FECHANACIMINEOPA"] || ""),
                sexoPa,
                area: String(row["area"] || row["AREA"] || "").trim().toUpperCase(),
                cargo: String(row["cargo"] || row["CARGO"] || "").trim().toUpperCase(),
            };
        })
        .filter(row => !isRowEmpty(row));
};

export const descargarPlantillaExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("PLANTILLA");

    const headers = [
        "codPa",
        "NombresYApellidos",
        "fechaNaciminetoPa",
        "sexoPa",
        "area",
        "cargo"
    ];

    sheet.addRow(headers);

    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "CCFFCC" }
        };
    });

    // Filas base vacías
    for (let i = 0; i < 50; i++) {
        sheet.addRow(["", "", "", "", "", ""]);
    }

    sheet.columns = headers.map(() => ({ width: 30 }));

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Plantilla_Registro_Pacientes.xlsx");
};

const isRowEmpty = (row) => {
    return Object.values(row).every(value => {
        if (value === null || value === undefined) return true;
        if (typeof value === "string" && value.trim() === "") return true;
        return false;
    });
};

export const isRowValid = (row) => {
    return (
        row["DNI"]?.toString().trim() !== "" &&
        row["EMPRESA"]?.toString().trim() !== "" &&
        row["EXAMEN"]?.toString().trim() !== ""
    );
};

export const getRowStatus = (row, index, resultados) => {
    if (!isRowValid(row)) return "invalid";

    const result = resultados[index];

    if (!result) return "pending"; // aún no enviado

    return result.ok !== false ? "success" : "error";
};

const getFechaHoraActual = () => {

    const currentDate = new Date();

    // Hora
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const hora = `${hours}:${minutes}:${seconds}`;

    // Fecha YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const fechaFormateada = `${year}-${month}-${day}`;

    return {
        hora,
        fechaFormateada
    };

};

const convertirFecha = (fecha) => {
    if (!fecha) return "";
    const str = String(fecha).trim();

    // Si es número serial de Excel (ej: 37011)
    if (/^\d+$/.test(str)) {
        const serial = parseInt(str);
        // Excel cuenta desde 1900-01-01, pero tiene un bug con 1900 como bisiesto
        // por eso se resta desde 25569 (diferencia entre 1900-01-01 y 1970-01-01)
        const fecha = new Date((serial - 25569) * 86400 * 1000);
        const yyyy = fecha.getUTCFullYear();
        const mm = String(fecha.getUTCMonth() + 1).padStart(2, "0");
        const dd = String(fecha.getUTCDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }

    // Si ya viene en formato yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

    // Si viene dd/mm/yyyy o d/mm/yyyy
    if (str.includes("/")) {
        const partes = str.split("/");
        if (partes.length === 3) {
            const dd = partes[0].padStart(2, "0");
            const mm = partes[1].padStart(2, "0");
            const yyyy = partes[2];
            return `${yyyy}-${mm}-${dd}`;
        }
    }

    return str;
};