import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { GetInfoPacDefault } from "../../../../../utils/functionUtils";
import { SubmitData, getFetch } from "../../../../../utils/apiHelpers";
import { convertirGenero } from "../../../../../utils/helpers";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import {
    GetInfoServicio,
    construirBodyAnexo16A,
} from "../Anexo16AController";
import { getAnexo16AInitialFormState } from "../anexo16aFormDefaults";

const urlRegistroMasivo = "/api/v01/ct/anexos/anexo16a/registrarLote"

export const descargarPlantillaCargaMasivaAnexo16A = async () => {
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
    saveAs(new Blob([buffer]), "Plantilla_CargaMasivaAnexo16A.xlsx");
};

const normalizarNorden = (valor) => {
    if (valor === null || valor === undefined) return "";
    return String(valor).trim();
};

export const handleSubirExcelCargaMasivaAnexo16A = async (setData) => {
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

// Obtiene los datos del paciente para un norden (sin verificar existencia).
// Usa GetInfoServicio para traer datos del triaje/paciente; si no hay, intenta GetInfoPacDefault.
const obtenerDatosPacienteAnexo16A = (norden, { token, userlogued, userName, tabla, fecha, userDireccion, sede }) =>
    new Promise((resolve) => {
        let state = {
            ...getAnexo16AInitialFormState({ today: fecha, userlogued, userName, userDireccion }),
            norden,
        };
        const fakeSet = (updater) => {
            state = typeof updater === "function" ? updater(state) : { ...state, ...updater };
        };

        const onFinish = async () => {
            if (!state.dni && !state.nombres) {
                const pac = await GetInfoPacDefault(norden, token, sede).catch(() => null);
                if (pac) {
                    state = {
                        ...state,
                        dni: pac.dni ?? "",
                        nombres: pac.nombresApellidos ?? "",
                        sexo: convertirGenero(pac.genero ?? ""),
                        fechaNac: formatearFechaCorta(pac.fechaNac ?? ""),
                        edad: pac.edad ?? "",
                        actividadRealizar: pac.cargo ?? "",
                        contrata: pac.contrata ?? "",
                        empresa: pac.empresa ?? "",
                    };
                }
            }
            resolve(state);
        };

        GetInfoServicio(norden, tabla, fakeSet, token, onFinish);
    });

// Fase 1: verifica existencia de cada norden.
//   - Si ya tiene registro (id=1) → se omite (no se sobreescribe).
//   - Si no → obtiene datos del paciente y arma el body.
// Fase 2: envía todos los nuevos en un único lote al endpoint urlRegistroMasivo.
// Parsea la respuesta { exitosos, fallidos, errores:[{motivo, registro:{norden}}] }.
export const guardarCargaMasivaAnexo16A = async (
    data,
    { token, userlogued, userName, tabla, fecha, medicoNombre, medicoUsername, userDireccion, sede },
    onProgress = () => { }
) => {
    const resultados = [];
    const lote = []; // { norden, body }

    // Fase 1: verificar existencia y preparar cuerpos
    for (const row of data) {
        const norden = row.norden;
        try {
            const existencia = await getFetch(
                `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${norden}&nomService=${tabla}`,
                token
            );

            const idExistencia = existencia?.id ?? 0;

            if (idExistencia === 1) {
                const resultado = { norden, ok: false, omitido: true, mensaje: "Ya tiene registro, se omitió" };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }

            if (idExistencia === 2) {
                const resultado = { norden, ok: false, omitido: true, mensaje: existencia?.mensaje ?? "Requisito previo no cumplido" };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }

            const state = await obtenerDatosPacienteAnexo16A(norden, {
                token, userlogued, userName, tabla, fecha, userDireccion, sede,
            });

            if (!state.dni && !state.nombres) {
                const resultado = { norden, ok: false, mensaje: "No se encontró información para este N° de Orden" };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }

            state.fechaExam = fecha;
            state.nombre_medico = medicoNombre;
            state.user_medicoFirma = medicoUsername;
            state.apto = true;

            const body = construirBodyAnexo16A(state, userlogued);
            lote.push({ norden, body });

        } catch (error) {
            console.error(`Error al procesar N° Orden ${norden}:`, error);
            const resultado = { norden, ok: false, mensaje: "Error interno al procesar" };
            resultados.push(resultado);
            onProgress(resultado);
        }
    }

    if (lote.length === 0) return resultados;

    // Fase 2: enviar todo el lote en una sola llamada
    Swal.fire({ title: "Enviando lote al servidor...", didOpen: () => Swal.showLoading() });
    const res = await SubmitData(lote.map((l) => l.body), urlRegistroMasivo, token);
    Swal.close();

    // Indexar errores por norden para lookup O(1)
    const erroresMap = new Map(
        (res?.errores ?? []).map((e) => [String(e.registro?.norden), e.motivo])
    );

    for (const { norden } of lote) {
        const motivo = erroresMap.get(String(norden));
        const resultado = {
            norden,
            ok: !motivo,
            mensaje: motivo ?? "Creado y guardado como apto",
        };
        resultados.push(resultado);
        onProgress(resultado);
    }

    return resultados;
};

export const exportarResultadosCargaMasivaAnexo16A = async (resultados) => {
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
    saveAs(new Blob([buffer]), `Resultado_CargaMasivaAnexo16A_${fecha}.xlsx`);
};
