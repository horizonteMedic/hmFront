import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { SubmitData, getFetch } from "../../../../../../utils/apiHelpers";
import { getHoraActual } from "../../../../../../utils/helpers";
import { GetInfoServicio } from "../controllerFichaAptitudAnexo16";
import { getFA16InitialFormState } from "../FA16FormDefaults";
import Swal from "sweetalert2";

const urlRegistroMasivo = "/api/v01/ct/anexos/fichaAnexo16/registrarActualizarMasivoFichaAnexo16";
const tabla = "certificado_aptitud_medico_ocupacional";

const formatearFechaDDMMYYYY = (date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
};

export const descargarPlantillaFA16 = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("PLANTILLA");

    sheet.addRow(["NORDEN", "FECHA (DD/MM/AAAA)"]);
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFCCFFCC" } };
    });

    const ejemploFecha = formatearFechaDDMMYYYY(new Date());
    for (let i = 0; i < 10; i++) {
        sheet.addRow(["", ejemploFecha]);
    }

    sheet.columns = [{ width: 18 }, { width: 20 }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Plantilla_CargaMasivaFichaAptitud16.xlsx");
};

const normalizarNorden = (valor) => {
    if (valor === null || valor === undefined) return "";
    return String(valor).trim();
};

// Valida y convierte la fecha de una fila del Excel (formato DD/MM/AAAA o
// número de serie de Excel) a YYYY-MM-DD para uso interno.
// Devuelve valido=true y valor="" cuando la celda viene vacía, para que se
// use la fecha por defecto seleccionada en el modal.
const normalizarFechaFilaFA16 = (valor) => {
    if (valor === null || valor === undefined || String(valor).trim() === "") {
        return { valor: "", valido: true };
    }

    // Número serial de fecha de Excel (ej: 46215)
    if (typeof valor === "number") {
        const fecha = new Date(Math.round((valor - 25569) * 86400 * 1000));
        if (isNaN(fecha.getTime())) return { valor: "", valido: false };
        const y = fecha.getUTCFullYear();
        const m = String(fecha.getUTCMonth() + 1).padStart(2, "0");
        const d = String(fecha.getUTCDate()).padStart(2, "0");
        return { valor: `${y}-${m}-${d}`, valido: true };
    }

    const str = String(valor).trim();
    const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(str);
    if (!match) return { valor: "", valido: false };

    const dia = Number(match[1]);
    const mes = Number(match[2]);
    const anio = Number(match[3]);
    const fecha = new Date(anio, mes - 1, dia);
    const esValida =
        fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;

    if (!esValida) return { valor: "", valido: false };

    return {
        valor: `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`,
        valido: true,
    };
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

        const filas = jsonData
            .map((row) => {
                const keyNorden = Object.keys(row).find((k) => k.toUpperCase().trim() === "NORDEN");
                const keyFecha = Object.keys(row).find((k) => k.toUpperCase().trim().startsWith("FECHA"));

                const norden = normalizarNorden(keyNorden ? row[keyNorden] : "");
                const { valor: fecha, valido: fechaValida } = normalizarFechaFilaFA16(
                    keyFecha ? row[keyFecha] : ""
                );

                return { norden, fecha, fechaValida };
            })
            .filter((row) => row.norden !== "");

        const vistos = new Set();
        const filasUnicas = filas.filter((row) => {
            if (vistos.has(row.norden)) return false;
            vistos.add(row.norden);
            return true;
        });

        setData(
            filasUnicas.map(({ norden, fecha, fechaValida }) => ({
                norden,
                fecha,
                estado: fechaValida ? "pendiente" : "error",
                mensaje: fechaValida ? "" : "Fecha formato incorrecto",
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

    // silent=true: evita el Swal de error cuando el N° de Orden no existe;
    // la fila se marca como error más abajo al no traer dni/nombres.
    await GetInfoServicio(norden, tabla, fakeSet, token, () => { }, true);

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
//   - id=1 → ya tiene registro, se procesa igual (el backend actualiza) — se marca editado=true.
//   - id=2 → requisito previo no cumplido, se omite con el mensaje del backend.
//   - id=0 → nuevo, obtiene datos del paciente y arma el body.
// Fase 2: envía todos en un único lote al endpoint urlRegistroMasivo.
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

        // Fila ya marcada como inválida al leer el Excel (p.ej. fecha con formato incorrecto)
        if (row.estado === "error" && row.mensaje) {
            const resultado = { norden, ok: false, mensaje: row.mensaje };
            resultados.push(resultado);
            onProgress(resultado);
            continue;
        }

        const fechaFila = row.fecha || fecha;

        try {
            const existencia = await getFetch(
                `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${norden}&nomService=${tabla}`,
                token
            );

            const idExistencia = existencia?.id ?? 0;

            if (idExistencia === 2) {
                const resultado = { norden, ok: false, omitido: true, mensaje: existencia?.mensaje ?? "Requisito previo no cumplido" };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }

            const editado = idExistencia === 1;

            const state = await obtenerDatosPacienteFA16(norden, {
                token, userlogued, userName, fecha: fechaFila,
            });

            if (!state.dni && !state.nombres) {
                const resultado = { norden, ok: false, mensaje: "No se encontró información para este N° de Orden" };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }

            const body = construirBodyFA16(state, userlogued, medicoNombre, medicoUsername);
            lote.push({ norden, body, editado });

        } catch (error) {
            console.error(`Error al procesar N° Orden ${norden}:`, error);
            const resultado = { norden, ok: false, mensaje: "Error interno al procesar" };
            resultados.push(resultado);
            onProgress(resultado);
        }
    }

    if (lote.length === 0) return resultados;

    // Fase 2: enviar todo el lote en una sola llamada
    const res = await SubmitData(lote.map((l) => l.body), urlRegistroMasivo, token);

    // Indexar errores por norden para lookup O(1)
    const erroresMap = new Map(
        (res?.errores ?? []).map((e) => [String(e.registro?.norden), e.motivo])
    );

    for (const { norden, editado } of lote) {
        const motivo = erroresMap.get(String(norden));
        const resultado = {
            norden,
            ok: !motivo,
            editado: !motivo && editado,
            mensaje: motivo ?? (editado ? "Registro actualizado correctamente" : "Creado y guardado como apto"),
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
