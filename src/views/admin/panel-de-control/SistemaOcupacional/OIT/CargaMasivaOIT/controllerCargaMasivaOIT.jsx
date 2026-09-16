import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { getFetch } from "../../../../../utils/apiHelpers";
import { GetInfoPac } from "../controller/OIT_controller";
import { SubmitOITModel } from "../controller/model";
import {
    esComentarioOITNormal,
    getOITAnormalOverrides,
    getOITInitialFormState,
    TORAX_SIN_ALTERACIONES,
} from "../oitFormDefaults";

export const descargarPlantillaCargaMasivaOIT = async () => {
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
    saveAs(new Blob([buffer]), "Plantilla_CargaMasivaOIT.xlsx");
};

const normalizarNorden = (valor) => {
    if (valor === null || valor === undefined) return "";
    return String(valor).trim();
};

export const handleSubirExcelCargaMasivaOIT = async (setData) => {
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

// Obtiene los datos básicos del paciente para un N° de Orden, reutilizando el
// mismo análisis que usa el formulario individual (GetInfoPac): trae nombres,
// dni, edad y el comentario radiográfico existente (conclusionesRadiograficas).
const obtenerDatosPacienteOIT = (
    norden,
    { token, userlogued, userName, userDNI, fecha, sede }
) =>
    new Promise((resolve) => {
        let state = {
            ...getOITInitialFormState({ today: fecha, userlogued, userName, userDNI }),
            norden,
        };
        const fakeSet = (updater) => {
            state = typeof updater === "function" ? updater(state) : { ...state, ...updater };
        };

        GetInfoPac(norden, fakeSet, token, sede).then(() => resolve(state));
    });

// Procesa la lista de N° de Orden uno por uno:
//   - Si el paciente necesita pasar por Rayos X Torax antes (id=2) -> se omite,
//     no se crea el registro.
//   - Si ya tiene registro de OIT (id=1) y no se pidió reemplazar -> se omite.
//   - En cualquier otro caso -> se obtienen los datos del paciente y se registra
//     (o actualiza, si ya existía y se pidió reemplazar) usando la firma y fecha
//     elegidas para todos.
//   Si el dictado original (conclusionesRadiograficas) dice "NORMAL" (o viene
//   vacío), el COMENTARIO que se envía se reemplaza por "TÓRAX SIN
//   ALTERACIONES" y se conserva el formulario con todos sus valores por
//   defecto. Si dice cualquier otra cosa, se conserva el comentario tal cual
//   y solo se mantienen los valores por defecto de Calidad Radiográfica,
//   Causas, y los encabezados SI/NO de II, III y IV; el resto de casillas que
//   normalmente vienen marcadas por defecto se envían desmarcadas (ver
//   getOITAnormalOverrides).
export const guardarCargaMasivaOIT = async (
    data,
    { token, userlogued, userName, userDNI, tabla, fecha, medicoNombre, medicoUsername, sede, reemplazar },
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
            const idExistencia = existencia?.id ?? 0;

            if (idExistencia === 2) {
                const resultado = {
                    norden,
                    ok: false,
                    omitido: true,
                    mensaje: "El paciente necesita pasar por Rayos X Torax. No se creó el registro.",
                };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }

            const yaTeniaRegistro = idExistencia === 1;

            if (yaTeniaRegistro && !reemplazar) {
                const resultado = { norden, ok: false, omitido: true, mensaje: "Ya tiene registro, se omitió" };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }

            const state = await obtenerDatosPacienteOIT(norden, {
                token, userlogued, userName, userDNI, fecha, sede,
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

            const comentarioOriginal = (state.txtSComentarios || "").replace(/\n$/, "");
            const esNormal = esComentarioOITNormal(comentarioOriginal);
            const comentarioFinal = esNormal ? TORAX_SIN_ALTERACIONES : comentarioOriginal;

            state.flectura = fecha;
            state.fradiografia = fecha;
            state.nombre_medico = medicoNombre;
            state.user_medicoFirma = medicoUsername;
            state.txtSComentarios = comentarioFinal;

            if (!esNormal) {
                Object.assign(state, getOITAnormalOverrides());
            }

            const res = await SubmitOITModel(state, userlogued, token);

            const ok = res?.id === 1 || res?.id === 0;
            const resultado = {
                norden,
                ok,
                accion: yaTeniaRegistro ? "actualizado" : "creado",
                comentario: comentarioFinal,
                comentarioDiferente: !esNormal,
                mensaje: ok
                    ? `${yaTeniaRegistro ? "Actualizado" : "Creado"} correctamente${!esNormal ? " (comentario distinto a NORMAL)" : ""}`
                    : (res?.mensaje || "Error al registrar"),
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
// N° Orden, estado, si se creó o actualizó, si el dictado original es
// distinto de "NORMAL", el comentario final enviado, y el mensaje.
export const exportarResultadosCargaMasivaOIT = async (resultados) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("RESULTADO");

    const headers = ["N° ORDEN", "ESTADO", "ACCIÓN", "DISTINTO A NORMAL", "COMENTARIO ENVIADO", "MENSAJE"];
    sheet.addRow(headers);
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFCCFFCC" } };
    });

    resultados.forEach((r) => {
        const estado = r.omitido ? "OMITIDO" : r.ok ? "OK" : "ERROR";
        sheet.addRow([
            r.norden,
            estado,
            r.accion ? r.accion.toUpperCase() : "",
            r.comentarioDiferente ? "SI" : "NO",
            r.comentario || "",
            r.mensaje || "",
        ]);
    });

    sheet.columns = [{ width: 14 }, { width: 12 }, { width: 12 }, { width: 18 }, { width: 50 }, { width: 60 }];

    const buffer = await workbook.xlsx.writeBuffer();
    const fecha = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    saveAs(new Blob([buffer]), `Resultado_CargaMasivaOIT_${fecha}.xlsx`);
};
