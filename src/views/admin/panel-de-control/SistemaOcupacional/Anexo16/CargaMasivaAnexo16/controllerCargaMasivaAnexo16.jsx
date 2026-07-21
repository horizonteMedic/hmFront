import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { existeRegistro } from "../../../../../utils/functionUtils";
import { SubmitData } from "../../../../../utils/apiHelpers";
import {
    GetInfoServicio,
    GetInfoServicioEditar,
    construirBodyAnexo16,
    registrarUrl,
} from "../controllerAnexo16";
import { getAnexo16InitialFormState } from "../anexo16FormDefaults";

export const descargarPlantillaCargaMasivaAnexo16 = async () => {
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
    saveAs(new Blob([buffer]), "Plantilla_CargaMasivaAnexo16.xlsx");
};

const normalizarNorden = (valor) => {
    if (valor === null || valor === undefined) return "";
    return String(valor).trim();
};

export const handleSubirExcelCargaMasivaAnexo16 = async (setData) => {
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

// Reutiliza el mismo análisis de datos (observaciones generales, audiometría, etc.)
// que usa el formulario individual de Anexo 16, sin depender de React ni de useState.
// Devuelve también "tipo" (CREADO / EDITADO) según si ya existía un registro previo,
// para poder diferenciarlos en la tabla y en el reporte final.
const procesarNordenAnexo16 = (norden, { token, userlogued, userName, tabla, fecha }) =>
    new Promise((resolve) => {
        let state = {
            ...getAnexo16InitialFormState({ today: fecha, userlogued, userName }),
            norden,
        };
        const fakeSet = (updater) => {
            state = typeof updater === "function" ? updater(state) : { ...state, ...updater };
        };

        existeRegistro(norden, tabla, token).then((existe) => {
            const tipo = existe ? "EDITADO" : "CREADO";
            const onFinish = () => resolve({ state, tipo });
            if (existe) {
                GetInfoServicioEditar(norden, tabla, fakeSet, token, onFinish);
            } else {
                GetInfoServicio(norden, tabla, fakeSet, token, onFinish);
            }
        });
    });

// Procesa la lista de N° de Orden uno por uno: busca y analiza la info del paciente
// (diferenciando si ya tenía registro -> se EDITA con los datos nuevos, o si no -> se CREA),
// asigna la firma y fecha elegidas para todos, ignora la validación de exámenes
// requeridos y guarda el registro ya CERRADO y APTO.
export const guardarCargaMasivaAnexo16 = async (
    data,
    { token, userlogued, userName, tabla, fecha, medicoNombre, medicoUsername },
    onProgress = () => { }
) => {
    const resultados = [];

    for (const row of data) {
        const norden = row.norden;
        try {
            const { state, tipo } = await procesarNordenAnexo16(norden, {
                token,
                userlogued,
                userName,
                tabla,
                fecha,
            });

            if (!state.dni && !state.nombres) {
                const resultado = {
                    norden,
                    tipo,
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
            state.cerrado = true;
            state.aptoParaTrabajar = "SI";

            const body = construirBodyAnexo16(state, userlogued);
            const res = await SubmitData(body, registrarUrl, token);

            const ok = res?.id === 1 || res?.id === 0;
            const resultado = {
                norden,
                tipo,
                ok,
                mensaje: ok
                    ? (tipo === "EDITADO" ? "Editado y cerrado correctamente" : "Creado y cerrado correctamente")
                    : (res?.mensaje || "Error al registrar"),
            };
            resultados.push(resultado);
            onProgress(resultado);
        } catch (error) {
            console.error(`Error al procesar N° Orden ${norden}:`, error);
            const resultado = { norden, tipo: "", ok: false, mensaje: "Error interno al procesar" };
            resultados.push(resultado);
            onProgress(resultado);
        }
    }

    return resultados;
};

// Genera y descarga un Excel con el resultado final de la carga masiva:
// N° Orden, si se creó o editó, si se pudo guardar o no, y el mensaje.
export const exportarResultadosCargaMasivaAnexo16 = async (resultados) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("RESULTADO");

    const headers = ["N° ORDEN", "TIPO", "ESTADO", "MENSAJE"];
    sheet.addRow(headers);
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFCCFFCC" } };
    });

    resultados.forEach((r) => {
        sheet.addRow([
            r.norden,
            r.tipo || "",
            r.ok ? "OK" : "ERROR",
            r.mensaje || "",
        ]);
    });

    sheet.columns = [{ width: 14 }, { width: 12 }, { width: 10 }, { width: 60 }];

    const buffer = await workbook.xlsx.writeBuffer();
    const fecha = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    saveAs(new Blob([buffer]), `Resultado_CargaMasivaAnexo16_${fecha}.xlsx`);
};
