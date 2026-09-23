import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { SubmitData } from "../../../../../../utils/apiHelpers";
import Swal from "sweetalert2";

const urlMasivo = "/api/medicamentos/masivo";

const HEADERS = [
    { key: "nombre", label: "NOMBRE" },
    { key: "presentacion", label: "PRESENTACION" },
    { key: "uso", label: "USO" },
    { key: "laboratorio", label: "LABORATORIO" },
    { key: "marca", label: "MARCA" },
    { key: "unidadMedida", label: "UNIDAD DE MEDIDA" },
    { key: "stockMinimo", label: "STOCK MÍNIMO" },
];

const normalizarTexto = (texto) =>
    (texto ?? "")
        .toString()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .trim();

export const descargarPlantillaMedicamentos = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("PLANTILLA");

    sheet.addRow(HEADERS.map((h) => h.label));
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFCCFFCC" } };
    });

    sheet.addRow(["Paracetamol", "500 mg tableta", "Alivio del dolor leve a moderado y fiebre", "Genfar", "Genfar", "Tableta", 20]);

    sheet.columns = [
        { width: 26 }, { width: 22 }, { width: 40 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 14 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Plantilla_CargaMasivaMedicamentos.xlsx");
};

export const handleSubirExcelMedicamentos = async (setData) => {
    const { value: file } = await Swal.fire({
        title: "Selecciona un archivo Excel",
        input: "file",
        inputAttributes: {
            accept: ".xlsx,.xls",
            "aria-label": "Sube tu Excel",
        },
        showCancelButton: true,
        confirmButtonText: "Procesar",
        cancelButtonText: "Cancelar",
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

        const filas = jsonData
            .map((row) => {
                const keys = Object.keys(row);
                const findKey = (label) => keys.find((k) => normalizarTexto(k) === normalizarTexto(label));

                const nombre = String(row[findKey("NOMBRE")] ?? "").trim();
                const presentacion = String(row[findKey("PRESENTACION")] ?? "").trim();
                const uso = String(row[findKey("USO")] ?? "").trim();
                const laboratorio = String(row[findKey("LABORATORIO")] ?? "").trim();
                const marca = String(row[findKey("MARCA")] ?? "").trim();
                const unidadMedida = String(row[findKey("UNIDAD DE MEDIDA")] ?? "").trim();
                const stockCelda = row[findKey("STOCK MÍNIMO")];
                const stockMinimo =
                    stockCelda === "" || stockCelda === null || stockCelda === undefined
                        ? 0
                        : Number(stockCelda) || 0;

                return { nombre, presentacion, uso, laboratorio, marca, unidadMedida, stockMinimo };
            })
            // Descarta filas completamente vacías (p.ej. filas sobrantes de la plantilla)
            .filter((row) =>
                row.nombre || row.presentacion || row.uso || row.laboratorio || row.marca || row.unidadMedida || row.stockMinimo
            );

        setData(filas.map((row) => ({ ...row, estado: "pendiente", mensaje: "" })));
    };
    reader.readAsBinaryString(file);
};

// El endpoint recibe la lista completa en un solo POST y procesa cada ítem de forma
// secuencial en el backend: los que fallan (falta nombre/presentación, error de BD, etc.)
// se reportan en medicamentosFallidos sin detener el resto del lote.
// Como no procesamos fila por fila desde el front, emparejamos cada fallo reportado con
// su fila original por nombre+presentación (en orden, por si hay duplicados) para marcar
// el estado correspondiente en la tabla de resultados.
export const guardarCargaMasivaMedicamentos = async (data, token) => {
    const body = data.map(({ nombre, presentacion, uso, laboratorio, marca, unidadMedida, stockMinimo }) => ({
        nombre,
        presentacion,
        uso,
        laboratorio,
        marca,
        unidadMedida,
        stockMinimo,
    }));

    const res = await SubmitData(body, urlMasivo, token);

    // SubmitData devuelve el Response crudo (sin parsear) cuando la petición no fue ok
    if (!res || res instanceof Response) {
        throw new Error("La solicitud al servidor no se pudo completar");
    }

    const fallidos = Array.isArray(res?.medicamentosFallidos) ? res.medicamentosFallidos : [];

    const colaFallidos = new Map();
    fallidos.forEach((f) => {
        const key = `${normalizarTexto(f?.nombre)}|${normalizarTexto(f?.presentacion)}`;
        const mensaje = f?.motivo || f?.mensaje || f?.error || f?.detalle || "No se pudo registrar";
        if (!colaFallidos.has(key)) colaFallidos.set(key, []);
        colaFallidos.get(key).push(mensaje);
    });

    const resultados = data.map((row) => {
        const key = `${normalizarTexto(row.nombre)}|${normalizarTexto(row.presentacion)}`;
        const cola = colaFallidos.get(key);
        if (cola && cola.length > 0) {
            const mensaje = cola.shift();
            return { ...row, estado: "error", mensaje };
        }
        return { ...row, estado: "success", mensaje: "Registrado correctamente" };
    });

    return { resultados, raw: res };
};

export const exportarResultadosMedicamentos = async (resultados) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("RESULTADO");

    sheet.addRow(["NOMBRE", "PRESENTACION", "USO", "LABORATORIO", "MARCA", "UNIDAD DE MEDIDA", "STOCK MÍNIMO", "ESTADO", "MENSAJE"]);
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFCCFFCC" } };
    });

    resultados.forEach((r) => {
        const estado = r.estado === "success" ? "REGISTRADO" : r.estado === "error" ? "ERROR" : "PENDIENTE";
        sheet.addRow([r.nombre, r.presentacion, r.uso, r.laboratorio, r.marca, r.unidadMedida, r.stockMinimo, estado, r.mensaje || ""]);
    });

    sheet.columns = [
        { width: 26 }, { width: 22 }, { width: 40 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 14 }, { width: 14 }, { width: 50 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    const fecha = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    saveAs(new Blob([buffer]), `Resultado_CargaMasivaMedicamentos_${fecha}.xlsx`);
};
