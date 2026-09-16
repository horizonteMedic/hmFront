import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { SubmitData, getFetch } from "../../../../../utils/apiHelpers";
import {
    GetInfoServicio,
    GetInfoServicioEditar,
    construirBody,
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
// reutilizando el mismo análisis que usa el formulario individual (GetInfoServicio).
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

        GetInfoServicio(norden, fakeSet, token, sede).then(() => resolve(state));
    });

// Obtiene el código y los datos demográficos de un registro YA EXISTENTE
// (reutilizando GetInfoServicioEditar, el mismo análisis que usa el formulario
// individual al editar), para poder reemplazarlo sin perder su identificador.
const obtenerDatosServicioExistenteAntecedentesDeAltura = (norden, { token, tabla }) =>
    new Promise((resolve) => {
        let state = {};
        const fakeSet = (updater) => {
            state = typeof updater === "function" ? updater(state) : { ...state, ...updater };
        };
        GetInfoServicioEditar(norden, tabla, fakeSet, token).then(() => resolve(state));
    });

// Procesa la lista de N° de Orden uno por uno:
//   - Si ya tiene registro (id=1) y no se pidió reemplazar -> se omite.
//   - Si ya tiene registro y se pidió reemplazar -> se recupera su código e
//     información demográfica y se sobreescribe con los antecedentes
//     patológicos por defecto (todos en NO), la firma y la fecha elegidas.
//   - Si no tiene registro -> obtiene los datos básicos del paciente
//     (GetInfoServicio), asigna la firma y fecha elegidas para todos, y crea el
//     registro como APTO.
export const guardarCargaMasivaAntecedentesDeAltura = async (
    data,
    { token, userlogued, userName, tabla, fecha, medicoNombre, medicoUsername, userDNI, userCMP, userEmail, userDireccion, sede, reemplazar },
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
            const yaTeniaRegistro = (existencia?.id ?? 0) === 1;

            if (yaTeniaRegistro && !reemplazar) {
                const resultado = { norden, ok: false, omitido: true, mensaje: "Ya tiene registro, se omitió" };
                resultados.push(resultado);
                onProgress(resultado);
                continue;
            }

            let state;
            if (yaTeniaRegistro) {
                const servicioState = await obtenerDatosServicioExistenteAntecedentesDeAltura(norden, { token, tabla });

                if (!servicioState.codigoAntecedentesAltura && !servicioState.norden) {
                    const resultado = {
                        norden,
                        ok: false,
                        mensaje: "No se pudo recuperar el registro existente para reemplazarlo",
                    };
                    resultados.push(resultado);
                    onProgress(resultado);
                    continue;
                }

                state = {
                    ...getAntecedentesDeAlturaInitialFormState({
                        today: fecha, userlogued, userName, userDNI, userCMP, userEmail, userDireccion,
                    }),
                    norden,
                    codigoAntecedentesAltura: servicioState.codigoAntecedentesAltura ?? null,
                    nombres: servicioState.nombres ?? "",
                    dni: servicioState.dni ?? "",
                    edad: servicioState.edad ?? "",
                    sexo: servicioState.sexo ?? "",
                    cargo: servicioState.cargo ?? "",
                    ocupacion: servicioState.ocupacion ?? "",
                    cargoDesempenar: servicioState.cargoDesempenar ?? "",
                    empresa: servicioState.empresa ?? "",
                    contrata: servicioState.contrata ?? "",
                    fechaNacimiento: servicioState.fechaNacimiento ?? "",
                    lugarNacimiento: servicioState.lugarNacimiento ?? "",
                    estadoCivil: servicioState.estadoCivil ?? "",
                    nivelEstudios: servicioState.nivelEstudios ?? "",
                };
            } else {
                state = await obtenerDatosPacienteAntecedentesDeAltura(norden, {
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
            }

            state.fechaExam = fecha;
            state.nombre_medico = medicoNombre;
            state.user_medicoFirma = medicoUsername;
            state.apto = true;

            const body = construirBody(state, userlogued, false);
            const res = await SubmitData(body, registrarUrl, token);

            const ok = res?.id === 1 || !!res?.nOrden || res?.codigo == "201";
            const resultado = {
                norden,
                ok,
                accion: yaTeniaRegistro ? "actualizado" : "creado",
                mensaje: ok
                    ? `${yaTeniaRegistro ? "Actualizado" : "Creado"} y guardado como apto`
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
// N° Orden, si se creó o editó, si se pudo guardar o no, y el mensaje.
export const exportarResultadosCargaMasivaAntecedentesDeAltura = async (resultados) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("RESULTADO");

    const headers = ["N° ORDEN", "ESTADO", "ACCIÓN", "MENSAJE"];
    sheet.addRow(headers);
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFCCFFCC" } };
    });

    resultados.forEach((r) => {
        const estado = r.omitido ? "OMITIDO" : r.ok ? "OK" : "ERROR";
        sheet.addRow([r.norden, estado, r.accion ? r.accion.toUpperCase() : "", r.mensaje || ""]);
    });

    sheet.columns = [{ width: 14 }, { width: 12 }, { width: 12 }, { width: 60 }];

    const buffer = await workbook.xlsx.writeBuffer();
    const fecha = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    saveAs(new Blob([buffer]), `Resultado_CargaMasivaAntecedentesDeAltura_${fecha}.xlsx`);
};
