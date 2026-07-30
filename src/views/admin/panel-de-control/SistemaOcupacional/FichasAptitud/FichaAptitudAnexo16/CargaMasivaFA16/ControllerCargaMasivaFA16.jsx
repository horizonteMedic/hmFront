import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { SubmitData, getFetch } from "../../../../../../utils/apiHelpers";
import { getHoraActual } from "../../../../../../utils/helpers";
import { GetInfoServicio } from "../controllerFichaAptitudAnexo16";
import { getFA16InitialFormState } from "../FA16FormDefaults";

const urlRegistroMasivo = "/api/v01/ct/anexos/fichaAnexo16/registrarActualizarMasivoFichaAnexo16";
const tabla = "certificado_aptitud_medico_ocupacional";

export const descargarPlantillaFA16 = async () => {
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
    saveAs(new Blob([buffer]), "Plantilla_CargaMasivaFichaAptitud16.xlsx");
};

const normalizarNorden = (valor) => {
    if (valor === null || valor === undefined) return "";
    return String(valor).trim();
};

export const handleSubirExcelFA16 = async (setData) => {
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

// await directo sobre GetInfoServicio: cuando resuelve, fakeSet ya corrió con los datos del reporte.
const obtenerDatosPacienteFA16 = async (norden, { token, userlogued, userName, fecha }) => {
    let state = {
        ...getFA16InitialFormState({ today: fecha, userlogued, userName }),
        norden,
    };
    const fakeSet = (updater) => {
        state = typeof updater === "function" ? updater(state) : { ...state, ...updater };
    };

    await GetInfoServicio(norden, tabla, fakeSet, token);

    return state;
};

// Arma el body de FA16 a partir del state, igual que SubmitDataService de controllerFichaAptitudAnexo16.
const construirBodyFA16 = (state, userlogued, medicoNombre, medicoUsername) => ({
    norden: state.norden,
    dni: state.dni,
    fecha: state.fechaValido,
    nombreMedico: medicoNombre,
    apto: state.apto === "APTO",
    aptoRestriccion: state.apto === "APTO CON RESTRICCION",
    noApto: state.apto === "NO APTO",
    conObservacion: state.apto === "CON OBSERVACION",
    evaluado: state.apto === "EVALUADO",
    restriccionesDescripcion: state.restricciones,
    horaSalida: getHoraActual(),
    fechaHasta: state.fechaVencimiento,
    recomendaciones: state.recomendaciones,
    conclusiones: state.conclusiones,
    usuarioRegistro: userlogued,
    usuarioFirma: medicoUsername,
});

// Fase 1: verifica existencia de cada norden.
//   - id=1 → ya tiene registro, se omite.
//   - id=2 → requisito previo no cumplido, se omite con el mensaje del backend.
//   - id=0 → nuevo, obtiene datos del paciente y arma el body.
// Fase 2: envía todos los nuevos en un único lote al endpoint urlRegistroMasivo.
// Parsea la respuesta { exitosos, fallidos, errores:[{motivo, registro:{norden}}] }.
export const guardarCargaMasivaFA16 = async (
    data,
    { token, userlogued, userName, fecha, medicoNombre, medicoUsername, sede },
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

            const state = await obtenerDatosPacienteFA16(norden, {
                token, userlogued, userName, fecha,
            });

            if (!state.dni && !state.nombres) {
                const resultado = { norden, ok: false, mensaje: "No se encontró información para este N° de Orden" };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }

            const body = construirBodyFA16(state, userlogued, medicoNombre, medicoUsername);
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

export const exportarResultadosFA16 = async (resultados) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("RESULTADO");

    sheet.addRow(["N° ORDEN", "ESTADO", "MENSAJE"]);
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
    saveAs(new Blob([buffer]), `Resultado_CargaMasivaFichaAptitud16_${fecha}.xlsx`);
};
