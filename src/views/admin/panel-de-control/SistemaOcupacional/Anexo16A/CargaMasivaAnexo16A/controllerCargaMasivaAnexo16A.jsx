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
    GetInfoServicioEditar,
    construirBodyAnexo16A,
    registrarUrl,
} from "../Anexo16AController";
import { getAnexo16AInitialFormState } from "../anexo16aFormDefaults";

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

// Reutiliza el mismo análisis de datos (observaciones, evaluación de IMC, presión arterial, etc.)
// que usa el formulario individual de Anexo 16A, sin depender de React ni de useState.
// Devuelve también "tipo" (CREADO / EDITADO) según si ya existía un registro previo,
// para poder diferenciarlos en la tabla y en el reporte final.
//
// existenciaExamenes.id: 0 = sin registro, 1 = ya tiene Anexo 16A, 2 = aún no pasó Triaje.
// Los id 0 y 2 se tratan como creación: aunque no haya Triaje, la carga masiva debe
// registrar igual el Anexo 16A (a diferencia del flujo individual, que sí bloquea con
// "necesita Triaje").
const procesarNordenAnexo16A = (norden, { token, userlogued, userName, tabla, fecha, userDireccion, sede }) =>
    new Promise((resolve) => {
        let state = {
            ...getAnexo16AInitialFormState({ today: fecha, userlogued, userName, userDireccion }),
            norden,
        };
        const fakeSet = (updater) => {
            state = typeof updater === "function" ? updater(state) : { ...state, ...updater };
        };

        getFetch(
            `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${norden}&nomService=${tabla}`,
            token
        ).then(async (res) => {
            const idExistencia = res?.id ?? 0;
            const tieneRegistroPrevio = idExistencia === 1;
            const tipo = tieneRegistroPrevio ? "EDITADO" : "CREADO";

            const onFinish = async () => {
                // Si no se pudo obtener info del reporte (p.ej. porque el paciente aún no
                // pasó Triaje, id=2), se recurre a los datos básicos del paciente para
                // poder registrar el Anexo 16A de todas formas.
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
                resolve({ state, tipo });
            };

            if (tieneRegistroPrevio) {
                GetInfoServicioEditar(norden, tabla, fakeSet, token, onFinish);
            } else {
                GetInfoServicio(norden, tabla, fakeSet, token, onFinish);
            }
        });
    });

// Procesa la lista de N° de Orden uno por uno: busca y analiza la info del paciente
// (diferenciando si ya tenía registro -> se EDITA con los datos nuevos, o si no -> se CREA),
// asigna la firma y fecha elegidas para todos, y guarda el registro como APTO.
export const guardarCargaMasivaAnexo16A = async (
    data,
    { token, userlogued, userName, tabla, fecha, medicoNombre, medicoUsername, userDireccion, sede },
    onProgress = () => { }
) => {
    const resultados = [];

    for (const row of data) {
        const norden = row.norden;
        try {
            const { state, tipo } = await procesarNordenAnexo16A(norden, {
                token,
                userlogued,
                userName,
                tabla,
                fecha,
                userDireccion,
                sede,
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
            state.apto = true;

            const body = construirBodyAnexo16A(state, userlogued);
            const res = await SubmitData(body, registrarUrl, token);

            const ok = res?.id === 1 || !!res?.nOrden || res?.codigo == "201";
            const resultado = {
                norden,
                tipo,
                ok,
                mensaje: ok
                    ? (tipo === "EDITADO" ? "Editado y guardado como apto" : "Creado y guardado como apto")
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
export const exportarResultadosCargaMasivaAnexo16A = async (resultados) => {
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
    saveAs(new Blob([buffer]), `Resultado_CargaMasivaAnexo16A_${fecha}.xlsx`);
};
