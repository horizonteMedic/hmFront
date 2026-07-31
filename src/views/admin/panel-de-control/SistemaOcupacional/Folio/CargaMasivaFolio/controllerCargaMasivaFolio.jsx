import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { getFetch, SubmitData } from "../../../../../utils/apiHelpers";
import FolioJasper from "../../../../../jaspers/FolioJasper/FolioJasper";
import { GetInfoPac, nombresExamen } from "../controllerFolio";
import { ListaPorPlantilla } from "../Folio";

const GetExamenExterno = "/api/v01/st/registros/detalleUrlArchivos";
const registrarPDF = "/api/v01/ct/archivos/archivoInterconsulta";

export const descargarPlantillaCargaMasivaFolio = async () => {
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
    saveAs(new Blob([buffer]), "Plantilla_CargaMasivaFolio.xlsx");
};

const normalizarNorden = (valor) => {
    if (valor === null || valor === undefined) return "";
    return String(valor).trim();
};

export const handleSubirExcelCargaMasivaFolio = async (setData) => {
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
                nomenclatura: "",
                mensaje: "",
            }))
        );
    };
    reader.readAsBinaryString(file);
};

const normalizeKey = (value) =>
    String(value ?? "")
        .trim()
        .toUpperCase()
        .replace(/[_\s]+/g, "-")
        .replace(/-+/g, "-");

// Misma lógica usada en Folio.jsx para elegir bajo qué nomenclatura se rotula
// y sube el folio: prioriza la plantilla seleccionada si coincide con una
// opción válida, luego el tipo de examen real del paciente, y ANUAL por defecto.
const determinarDestino = (selectedListType, nombreExamenPaciente) => {
    const opciones = Object.keys(nombresExamen);
    const nombreExamenNorm = normalizeKey(nombreExamenPaciente);
    const forcedDefaultKey = opciones.includes(selectedListType) ? selectedListType : null;
    const defaultKey =
        forcedDefaultKey ??
        opciones.find((key) => normalizeKey(key) === nombreExamenNorm) ??
        opciones.find((key) => nombreExamenNorm.includes(normalizeKey(key))) ??
        "ANUAL";
    return { defaultKey, nomenclature: nombresExamen[defaultKey] };
};

const sanitizeNombreArchivo = (value) =>
    String(value ?? "")
        .replace(/[\\/:*?"<>|]/g, "-")
        .replace(/\s+/g, " ")
        .trim();

const buildNombreArchivo = (form, nomenclatura) => {
    const apellidos = (form?.apellidos ?? "").trim();
    const nombres = (form?.nombres ?? "").trim();
    const nombreArchivo = `${form?.norden}-${nomenclatura}-${apellidos}${apellidos && nombres ? " " : ""}${nombres}.pdf`;
    return sanitizeNombreArchivo(nombreArchivo);
};

// Variante silenciosa de subirArchivoFolio (controllerFolio.jsx): no muestra
// Swal por registro, ya que en un lote de varios nordenes bloquearía el ciclo
// hasta que el usuario cierre cada alerta.
const subirArchivoFolioSilencioso = async (archivoData, { form, nomenclature, selectedSede, userlogued, token }) => {
    const blob = archivoData instanceof Blob
        ? archivoData
        : new Blob([archivoData], { type: "application/pdf" });

    const reader = new FileReader();
    const pdfBase64Final = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

    const nombreArchivo = buildNombreArchivo(form, nomenclature);

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);

    const datos = {
        rutaArchivo: null,
        dni: null,
        historiaClinica: null,
        servidor: "azure",
        estado: true,
        fechaRegistro: `${year}-${month}-${day}`,
        userRegistro: userlogued,
        fechaActualizacion: null,
        userActualizacion: null,
        id_tipo_archivo: null,
        nombreArchivo,
        codigoSede: selectedSede,
        fileBase64: pdfBase64Final,
        nomenclatura_tipo_archivo: nomenclature,
        orden: form?.norden,
        indice_carga_masiva: undefined,
    };

    const result = await SubmitData(datos, registrarPDF, token);

    if (result?.id === 1 || result?.id === "1") {
        return { ok: true };
    }
    throw new Error(result?.mensaje || "Error desconocido al subir el folio");
};

// Obtiene los datos del paciente y su lista de exámenes (con resultado/imprimir
// ya resueltos) para un N° de Orden, reutilizando el mismo análisis que usa el
// formulario individual (GetInfoPac de controllerFolio.jsx).
const obtenerDatosPacienteFolio = (norden, { token, selectedSede, currentList }) =>
    new Promise((resolve) => {
        let state = { norden, listaExamenes: currentList };
        const fakeSet = (updater) => {
            state = typeof updater === "function" ? updater(state) : { ...state, ...updater };
        };
        GetInfoPac(norden, fakeSet, token, selectedSede, currentList).then(() => resolve(state));
    });

// Procesa la lista de N° de Orden uno por uno: genera el folio completo con la
// plantilla seleccionada, determina la nomenclatura de destino (rotula) y lo
// sube al sistema. Si un norden falla, se registra el error y se continúa con
// el siguiente (no se corta la generación del resto del lote).
export const procesarCargaMasivaFolio = async (
    data,
    {
        token,
        userlogued,
        selectedSede,
        datosFooter,
        selectedListType,
        comprimidoz,
        urlType,
        sobrescribir,
        signal,
    },
    onProgress = () => { },
    onBatchProgress = () => { }
) => {
    const resultados = [];
    const currentList = ListaPorPlantilla[selectedListType] || ListaPorPlantilla["COMPLETO"];
    const totalNordenes = data.length;

    for (let index = 0; index < data.length; index++) {
        const row = data[index];
        const norden = row.norden;

        if (signal?.aborted) {
            const resultado = { norden, ok: false, omitido: true, mensaje: "Cancelado por el usuario" };
            resultados.push(resultado);
            onProgress(resultado);
            continue;
        }

        onBatchProgress({ index, totalNordenes, norden, current: 0, total: 0, percentage: 0, reportName: "Preparando..." });

        try {
            const state = await obtenerDatosPacienteFolio(norden, { token, selectedSede, currentList });

            if (!state.nombres && !state.apellidos) {
                const resultado = { norden, ok: false, mensaje: "No se encontró información para este N° de Orden" };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }

            const examenesAImprimir = (state.listaExamenes ?? []).filter((e) => e.resultado && e.imprimir);
            if (examenesAImprimir.length === 0) {
                const resultado = { norden, ok: false, mensaje: "No tiene exámenes aprobados para generar el folio" };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }

            const { defaultKey, nomenclature } = determinarDestino(selectedListType, state.nombreExamen);

            if (!sobrescribir) {
                const existencia = await getFetch(`${GetExamenExterno}/${norden}/${nomenclature}`, token);
                if (existencia?.id === 1) {
                    const resultado = {
                        norden,
                        ok: false,
                        omitido: true,
                        nomenclatura: nomenclature,
                        mensaje: `Ya existe un folio subido como ${defaultKey} (${nomenclature}), se omitió`,
                    };
                    resultados.push(resultado);
                    onProgress(resultado);
                    continue;
                }
            }

            const archivoGenerado = await FolioJasper(
                norden,
                token,
                state.listaExamenes,
                (current, total, percentage, reportName) =>
                    onBatchProgress({ index, totalNordenes, norden, current, total, percentage, reportName }),
                selectedListType,
                signal,
                state.nombres,
                state.apellidos,
                datosFooter,
                comprimidoz,
                urlType,
                "",
                "",
                true // omitirImpresion: no abrir/imprimir el folio durante la carga masiva
            );

            await subirArchivoFolioSilencioso(archivoGenerado, {
                form: { norden, nombres: state.nombres, apellidos: state.apellidos },
                nomenclature,
                selectedSede,
                userlogued,
                token,
            });

            const resultado = {
                norden,
                ok: true,
                nomenclatura: nomenclature,
                mensaje: `Folio generado y subido como ${defaultKey} (${nomenclature})`,
            };
            resultados.push(resultado);
            onProgress(resultado);
        } catch (error) {
            if (error?.name === "AbortError") {
                const resultado = { norden, ok: false, omitido: true, mensaje: "Cancelado por el usuario" };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }
            console.error(`Error al procesar N° Orden ${norden}:`, error);
            const resultado = { norden, ok: false, mensaje: error?.message || "Error interno al procesar" };
            resultados.push(resultado);
            onProgress(resultado);
        }
    }

    return resultados;
};

// Genera y descarga un Excel con el resultado final de la carga masiva:
// N° Orden, estado, nomenclatura de destino y el mensaje.
export const exportarResultadosCargaMasivaFolio = async (resultados) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("RESULTADO");

    const headers = ["N° ORDEN", "ESTADO", "NOMENCLATURA", "MENSAJE"];
    sheet.addRow(headers);
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFCCFFCC" } };
    });

    resultados.forEach((r) => {
        const estado = r.omitido ? "OMITIDO" : r.ok ? "OK" : "ERROR";
        sheet.addRow([r.norden, estado, r.nomenclatura || "", r.mensaje || ""]);
    });

    sheet.columns = [{ width: 14 }, { width: 12 }, { width: 20 }, { width: 60 }];

    const buffer = await workbook.xlsx.writeBuffer();
    const fecha = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    saveAs(new Blob([buffer]), `Resultado_CargaMasivaFolio_${fecha}.xlsx`);
};
