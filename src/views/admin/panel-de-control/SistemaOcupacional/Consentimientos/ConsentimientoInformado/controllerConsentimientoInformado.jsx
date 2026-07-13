import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../utils/functionUtils";
import { getHoraActual } from "../../../../../utils/helpers";
import { SubmitData } from "../../../../../utils/apiHelpers";

const obtenerReporteUrl = "/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoInformado";
const registrarUrl = "/api/v01/ct/anexos/anexo16/registrarActualizarConsentimientoInformado";
const registroMasivo = "/api/v01/ct/anexos/anexo16/registrarActualizarMasivoConsentimientoInformado"

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            norden: res.norden ?? prev.norden ?? "",
            fecha: res.fecha ?? prev.fecha ?? "",
            nombres: res.nombres ?? prev.nombres ?? "",
            dni: res.dni ?? prev.dni ?? "",
            ocupacion: res.ocupacion ?? prev.ocupacion ?? "",
            empresa: res.empresa ?? prev.empresa ?? "",
            // Preservar los textos estáticos si no vienen del backend
            textoConsentimiento: res.textoConsentimiento ?? prev.textoConsentimiento ?? "",
            textoFinalConsentimiento: res.textoFinalConsentimiento ?? prev.textoFinalConsentimiento ?? "",
        }));
    }
};

export const SubmitDataService = async (form, token, user, limpiar, tabla, datosFooter) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }

    const body = {
        norden: form.norden,
        fecha: form.fecha,
        hora: getHoraActual(),
        userRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/ConsentimientoInformado/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/ConsentimientoInformado"
    );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            //Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Consentimiento Informado.",
                    "warning"
                );
            });
        }
    );
};

const GetInfoPac = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            nombres: res.nombresApellidos ?? prev.nombres ?? "",
            ocupacion: res.cargo ?? prev.ocupacion ?? "",
            dni: res.dni ?? prev.dni ?? "",
            empresa: res.empresa ?? prev.empresa ?? "",
            // Preservar los textos estáticos
            textoConsentimiento: prev.textoConsentimiento ?? "",
            textoFinalConsentimiento: prev.textoFinalConsentimiento ?? "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};

export const descargarPlantillaExcel = async () => {
    const today = new Date().toISOString().split("T")[0];
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("PLANTILLA");

    const headers = ["NORDEN", "FECHA"];
    sheet.addRow(headers);

    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFCCFFCC" } };
    });

    for (let i = 0; i < 10; i++) {
        sheet.addRow(["", today]);
    }

    sheet.columns = [{ width: 18 }, { width: 18 }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Plantilla_ConsentimientoInformado.xlsx");
};

// Convierte cualquier formato de fecha de Excel a YYYY-MM-DD
const normalizarFecha = (valor) => {
    if (!valor && valor !== 0) return "";

    // Número serial de Excel (ej: 46215)
    if (typeof valor === "number") {
        const fecha = new Date(Math.round((valor - 25569) * 86400 * 1000));
        const y = fecha.getUTCFullYear();
        const m = String(fecha.getUTCMonth() + 1).padStart(2, "0");
        const d = String(fecha.getUTCDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }

    const str = String(valor).trim();

    // DD/MM/YYYY → YYYY-MM-DD
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
        const [d, m, y] = str.split("/");
        return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    // Ya está en YYYY-MM-DD
    return str;
};

const prepararDataExcel = (data) => {
    return data
        .map((row) => {
            const newRow = {};
            Object.keys(row).forEach((key) => {
                const keyNorm = key.toUpperCase().trim();
                const value = row[key];
                newRow[keyNorm] = keyNorm === "FECHA"
                    ? normalizarFecha(value)
                    : typeof value === "string" ? value.trim() : value;
            });
            return newRow;
        })
        .filter((row) => {
            return Object.values(row).some((v) => v !== null && v !== undefined && String(v).trim() !== "");
        });
};

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
    setData([])
    const reader = new FileReader();

    reader.onload = (e) => {
        const binaryStr = e.target.result;

        const workbook = XLSX.read(binaryStr, { type: "binary" });

        const sheetName = workbook.SheetNames[0]; // primera hoja
        const sheet = workbook.Sheets[sheetName];

        // convierte a JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const dataPreparada = prepararDataExcel(jsonData);

        setData(dataPreparada);
        setTotalPages(Math.ceil(dataPreparada.length / 50));
    };

    reader.readAsBinaryString(file);
};

export const submitMasivo = async (data, token, userlogued) => {
    LoadingDefault("Subiendo Datos");
    try {
        const now = new Date();

        const body = data.map(row => ({
            norden: Number(row["NORDEN"]),
            fecha: row["FECHA"] || now.toISOString().split("T")[0],
            hora: getHoraActual(),
            userRegistro: userlogued,
        }));

        const response = await SubmitData(body, registroMasivo, token);

        // { mensaje, cantidadExitosos, registrosFallidos: [{error, norden}] }
        const fallidos = response?.registrosFallidos ?? [];
        const fallidosSet = new Set(fallidos.map(f => Number(f.norden)));

        const resultados = data.map((row) => {
            const norden = Number(row["NORDEN"]);
            const fallido = fallidos.find(f => Number(f.norden) === norden);
            return {
                ok: !fallidosSet.has(norden),
                error: fallido?.error ?? null,
                norden,
            };
        });

        Swal.close();
        return { resultados, response };

    } catch (error) {
        Swal.close();
        console.error(error);
        throw error;
    }
};