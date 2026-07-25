import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { SubmitData, getFetch } from "../../../../../utils/apiHelpers";
import {
    GetInfoPac,
    construirBodyAntecedentesDeAltura,
    registrarUrl,
} from "../controllerAntecedentesDeAltura";
import { getAntecedentesDeAlturaInitialFormState } from "../antecedentesDeAlturaFormDefaults";

export const descargarPlantillaCargaMasivaAntecedentesDeAltura = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("PLANTILLA");

    sheet.addRow(["NORDEN"]);
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFCCFFCC" } };
    });

    for (let i = 0; i < 10; i++) {
        sheet.addRow([""]);
    }

    sheet.columns = [{ width: 18 }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Plantilla_CargaMasivaAntecedentesDeAltura.xlsx");
};

const normalizarNorden = (valor) => {
    if (valor === null || valor === undefined) return "";
    return String(valor).trim();
};

export const handleSubirExcelCargaMasivaAntecedentesDeAltura = async (setData) => {
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

        const nordenes = jsonData
            .map((row) => {
                const key = Object.keys(row).find((k) => k.toUpperCase().trim() === "NORDEN");
                return normalizarNorden(key ? row[key] : "");
            })
            .filter((norden) => norden !== "");

        const nordenesUnicos = [...new Set(nordenes)];

        setData(
            nordenesUnicos.map((norden) => ({
                norden,
                estado: "pendiente",
                mensaje: "",
            }))
        );
    };
    reader.readAsBinaryString(file);
};

// Obtiene los datos básicos del paciente para un norden nuevo (sin registro previo),
// reutilizando el mismo análisis que usa el formulario individual (GetInfoPac).
const obtenerDatosPacienteAntecedentesDeAltura = (
    norden,
    { token, userDNI, userCMP, userEmail, userDireccion, userName, userlogued, fecha, sede }
) =>
    new Promise((resolve) => {
        let state = {
            ...getAntecedentesDeAlturaInitialFormState({
                today: fecha,
                userlogued,
                userName,
                userDNI,
                userCMP,
                userEmail,
                userDireccion,
            }),
            norden,
        };
        const fakeSet = (updater) => {
            state = typeof updater === "function" ? updater(state) : { ...state, ...updater };
        };

        GetInfoPac(norden, fakeSet, token, sede).then(() => resolve(state));
    });

// Procesa la lista de N° de Orden uno por uno:
//   - Si ya tiene registro (id=1) -> se omite (no se sobreescribe).
//   - Si no -> obtiene los datos básicos del paciente (GetInfoPac), asigna la
//     firma y fecha elegidas para todos, y crea el registro como APTO.
export const guardarCargaMasivaAntecedentesDeAltura = async (
    data,
    { token, userlogued, userName, tabla, fecha, medicoNombre, medicoUsername, userDNI, userCMP, userEmail, userDireccion, sede },
    onProgress = () => { }
) => {
    const resultados = [];

    for (const row of data) {
        const norden = row.norden;
        try {
            const existencia = await getFetch(
                `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${norden}&nomService=${tabla}`,
                token
            );

            if ((existencia?.id ?? 0) === 1) {
                const resultado = { norden, ok: false, omitido: true, mensaje: "Ya tiene registro, se omitió" };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }

            const state = await obtenerDatosPacienteAntecedentesDeAltura(norden, {
                token, userDNI, userCMP, userEmail, userDireccion, userName, userlogued, fecha, sede,
            });

            if (!state.dni && !state.nombres) {
                const resultado = {
                    norden,
                    ok: false,
                    mensaje: "No se encontró información para este N° de Orden",
                };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }

            state.fechaExam = fecha;
            state.nombre_medico = medicoNombre;
            state.user_medicoFirma = medicoUsername;
            state.apto = true;

            const body = construirBodyAntecedentesDeAltura(state, userlogued);
            const res = await SubmitData(body, registrarUrl, token);

            const ok = res?.id === 1 || !!res?.nOrden || res?.codigo == "201";
            const resultado = {
                norden,
                ok,
                mensaje: ok ? "Creado y guardado como apto" : (res?.mensaje || "Error al registrar"),
            };
            resultados.push(resultado);
            onProgress(resultado);
        } catch (error) {
            console.error(`Error al procesar N° Orden ${norden}:`, error);
            const resultado = { norden, ok: false, mensaje: "Error interno al procesar" };
            resultados.push(resultado);
            onProgress(resultado);
        }
    }

    return resultados;
};

// Genera y descarga un Excel con el resultado final de la carga masiva:
// N° Orden, si se creó o editó, si se pudo guardar o no, y el mensaje.
export const exportarResultadosCargaMasivaAntecedentesDeAltura = async (resultados) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("RESULTADO");

    const headers = ["N° ORDEN", "ESTADO", "MENSAJE"];
    sheet.addRow(headers);
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFCCFFCC" } };
    });

    resultados.forEach((r) => {
        const estado = r.omitido ? "OMITIDO" : r.ok ? "OK" : "ERROR";
        sheet.addRow([r.norden, estado, r.mensaje || ""]);
    });

    sheet.columns = [{ width: 14 }, { width: 12 }, { width: 60 }];

    const buffer = await workbook.xlsx.writeBuffer();
    const fecha = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    saveAs(new Blob([buffer]), `Resultado_CargaMasivaAntecedentesDeAltura_${fecha}.xlsx`);
};
