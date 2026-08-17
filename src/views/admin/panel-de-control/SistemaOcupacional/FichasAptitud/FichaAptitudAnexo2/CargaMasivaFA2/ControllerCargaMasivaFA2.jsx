import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { SubmitData, getFetch } from "../../../../../../utils/apiHelpers";
import { getHoraActual } from "../../../../../../utils/helpers";
import { GetInfoServicio } from "../controllerFichaAptitudAnexo2";
import { getFA2InitialFormState } from "../FA2FormDefaults";
import Swal from "sweetalert2";

const urlRegistroIndividual = "/api/v01/ct/anexos/fichaAnexo2/registrarActualizarFichaAnexo2";
const tabla = "aptitud_medico_ocupacional_agro";

const urlReporteAnexo2Completo = "/api/v01/ct/anexos/anexo2/obtenerReporteAnexo2Completo";
const tablaAnexo2 = "anexo_agroindustrial";

const formatearFechaDDMMYYYY = (date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
};

export const descargarPlantillaFA2 = async () => {
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
    saveAs(new Blob([buffer]), "Plantilla_CargaMasivaFichaAptitud2.xlsx");
};

const normalizarNorden = (valor) => {
    if (valor === null || valor === undefined) return "";
    return String(valor).trim();
};

// Valida y convierte la fecha de una fila del Excel (formato DD/MM/AAAA o
// número de serie de Excel) a YYYY-MM-DD para uso interno.
// Devuelve valido=true y valor="" cuando la celda viene vacía → se usa la fecha por defecto.
const normalizarFechaFila = (valor) => {
    if (valor === null || valor === undefined || String(valor).trim() === "") {
        return { valor: "", valido: true };
    }

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

export const handleSubirExcelFA2 = async (setData) => {
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
                const { valor: fecha, valido: fechaValida } = normalizarFechaFila(
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
                mensaje: fechaValida ? "" : "Fecha con formato incorrecto (usar DD/MM/AAAA)",
            }))
        );
    };
    reader.readAsBinaryString(file);
};

// await directo sobre GetInfoServicio: cuando resuelve, fakeSet ya corrió con los datos del reporte.
const obtenerDatosPacienteFA2 = async (norden, { token, userlogued, userName, fecha }) => {
    let state = {
        ...getFA2InitialFormState({ today: fecha, userlogued, userName }),
        norden,
    };
    const fakeSet = (updater) => {
        state = typeof updater === "function" ? updater(state) : { ...state, ...updater };
    };

    await GetInfoServicio(norden, tabla, fakeSet, token, () => { });

    return state;
};

// Traduce la aptitud registrada en el Anexo 2 (examen origen, tabla anexo_agroindustrial)
// al valor de "apto" que usa la Ficha Aptitud. Se usa solo al actualizar un registro ya
// existente, para que la Ficha Aptitud refleje la aptitud vigente del Anexo 2 en vez de
// la que traía por defecto. Devuelve null si el Anexo 2 no tiene aptitud registrada,
// caso en el que no corresponde certificar y la fila debe omitirse.
const obtenerAptitudAnexo2 = async (norden, token) => {
    const res = await getFetch(
        `${urlReporteAnexo2Completo}?nOrden=${norden}&nameService=${tablaAnexo2}&esJasper=false`,
        token
    );
    if (res?.esApto_apto_si) return "APTO";
    if (res?.noEsApto_apto_no) return "NO APTO";
    if (res?.aptoRestriccion_apto_re) return "APTO CON RESTRICCION";
    if (res?.esEvaluado) return "EVALUADO";
    return null;
};

// Arma el body de FA2 a partir del state. Campos alineados con SubmitDataService de controllerFichaAptitudAnexo2.
const construirBodyFA2 = (state, userlogued, medicoNombre, medicoUsername) => ({
    norden: state.norden,
    dni: state.dni,
    fecha: state.fechaValido,
    nombreMedico: medicoNombre,
    apto: state.apto === "APTO",
    aptoConRestriccion: state.apto === "APTO CON RESTRICCION",
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

// Procesa cada N° de Orden uno por uno (sin endpoint masivo):
//   - id=2 → requisito previo no cumplido, se omite con el mensaje del backend.
//   - id=1 → ya tiene registro: se omite si no se pidió reemplazar; si se pidió,
//     se procesa igual y el backend actualiza (se marca editado=true), tomando la
//     aptitud vigente en el Anexo 2.
//   - id=0 → nuevo, se obtienen los datos del paciente y se registra.
// Cada fila se envía individualmente al endpoint urlRegistroIndividual.
export const guardarCargaMasivaFA2 = async (
    data,
    { token, userlogued, userName, fecha, medicoNombre, medicoUsername, reemplazar },
    onProgress = () => { }
) => {
    const resultados = [];

    for (const row of data) {
        const norden = row.norden;

        // Fila ya marcada como inválida al leer el Excel (fecha con formato incorrecto)
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

            const yaTeniaRegistro = idExistencia === 1;

            if (yaTeniaRegistro && !reemplazar) {
                const resultado = { norden, ok: false, omitido: true, mensaje: "Ya tiene registro, se omitió" };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }

            const state = await obtenerDatosPacienteFA2(norden, {
                token, userlogued, userName, fecha: fechaFila,
            });

            if (!state.dni && !state.nombres) {
                const resultado = { norden, ok: false, mensaje: "No se encontró información para este N° de Orden" };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }

            // Al actualizar un registro existente, la aptitud se toma del Anexo 2
            // (examen origen) en lugar de la que trae por defecto obtenerDatosPacienteFA2.
            if (yaTeniaRegistro) {
                const aptitudAnexo2 = await obtenerAptitudAnexo2(norden, token);
                if (!aptitudAnexo2) {
                    const resultado = {
                        norden,
                        ok: false,
                        omitido: true,
                        mensaje: "El Anexo 2 no tiene aptitud registrada; no se actualizó la Ficha Aptitud",
                    };
                    resultados.push(resultado);
                    onProgress(resultado);
                    continue;
                }
                state.apto = aptitudAnexo2;
            }

            const body = construirBodyFA2(state, userlogued, medicoNombre, medicoUsername);
            const res = await SubmitData(body, urlRegistroIndividual, token);

            const ok = res?.id === 1 || !!res?.nOrden || res?.codigo == "201";
            const resultado = {
                norden,
                ok,
                editado: ok && yaTeniaRegistro,
                mensaje: ok
                    ? (res?.mensaje || (yaTeniaRegistro ? "Registro actualizado correctamente" : "Creado y guardado como apto"))
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

export const exportarResultadosFA2 = async (resultados) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("RESULTADO");

    sheet.addRow(["N° ORDEN", "FECHA", "ESTADO", "MENSAJE"]);
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFCCFFCC" } };
    });

    resultados.forEach((r) => {
        const estado = r.omitido ? "OMITIDO" : r.ok ? (r.editado ? "ACTUALIZADO" : "CREADO") : "ERROR";
        sheet.addRow([r.norden, r.fecha || "", estado, r.mensaje || ""]);
    });

    sheet.columns = [{ width: 14 }, { width: 16 }, { width: 12 }, { width: 60 }];

    const buffer = await workbook.xlsx.writeBuffer();
    const fecha = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    saveAs(new Blob([buffer]), `Resultado_CargaMasivaFichaAptitud2_${fecha}.xlsx`);
};
