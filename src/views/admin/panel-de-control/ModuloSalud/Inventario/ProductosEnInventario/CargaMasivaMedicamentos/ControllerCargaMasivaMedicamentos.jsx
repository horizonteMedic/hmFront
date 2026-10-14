import ExcelJS from "exceljs";
import { postJson } from "../../../utils/apiSalud";
import { descargarLibro } from "../../../utils/descargarLibro";
import { nombreSeguro } from "../../../utils/excelReporte";
import { normalizar } from "../../../utils/filtrarPorTexto";
import { leerFilas, numero, texto } from "./celdasExcel";

const URL_MASIVO = "/api/medicamentos/masivo";

// Columnas del Excel (plantilla y resultado) y el campo del medicamento que corresponde a cada una.
// `alias`: otros encabezados que también se reconocen (los que usa el backend o una planilla de inventario).
const columnas = [
    { campo: "nombre", etiqueta: "NOMBRE", alias: ["DETALLE"], ancho: 34 },
    { campo: "presentacion", etiqueta: "PRESENTACION", ancho: 22 },
    { campo: "uso", etiqueta: "USO", ancho: 30 },
    { campo: "unidades", etiqueta: "UNIDADES", alias: ["UND"], ancho: 12 },
    { campo: "precioUnitario", etiqueta: "PRECIO UNITARIO", alias: ["PRECIO", "P. UNITARIO"], ancho: 18 },
];

const ETIQUETA_ESTADO = {
    error: "ERROR",
    invalida: "INVÁLIDA",
    pendiente: "PENDIENTE",
    sinCambios: "SIN CAMBIOS",
};

// Mensaje del primer dato inválido de la fila, o "" si está completa. Unidades y precio son opcionales.
export const errorDeFila = ({ nombre, presentacion, unidades, precioUnitario }) => {
    if (!nombre) return "Falta el nombre";
    if (!presentacion) return "Falta la presentación";
    if (unidades !== null && !(Number.isInteger(unidades) && unidades >= 0)) return "Las unidades deben ser un número entero (0 o más)";
    if (precioUnitario !== null && !(precioUnitario >= 0)) return "El precio unitario debe ser un número (0 o más)";
    return "";
};

// El backend no valida duplicados: con el mismo nombre y presentación crearía otra fila
export const claveMedicamento = ({ nombre, presentacion }) => `${normalizar(nombre).trim()}|${normalizar(presentacion).trim()}`;

export const estilarEncabezado = (hoja) =>
    hoja.getRow(1).eachCell((celda) => {
        celda.font = { bold: true };
        celda.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        celda.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFCCFFCC" } };
    });

export const descargarPlantillaMedicamentos = async () => {
    const libro = new ExcelJS.Workbook();
    const hoja = libro.addWorksheet("PLANTILLA");
    hoja.addRow(columnas.map((c) => c.etiqueta));
    hoja.addRow(["CIPROFLOXACINO 500MG, CJA X 100", "TABLETA", "ANTIBIÓTICO", 200, 2.5]);
    estilarEncabezado(hoja);
    hoja.columns = columnas.map((c) => ({ width: c.ancho }));
    await descargarLibro(libro, "Plantilla_CargaMasivaMedicamentos.xlsx");
};

// Lee la primera hoja del Excel. Cada fila queda "pendiente" (lista para enviar) o "invalida" si le falta
// algo obligatorio (nombre o presentación) o trae unidades o precio que no son números válidos; el `mensaje`
// avisa de posibles duplicados con `existentes` (los medicamentos que la campaña ya tiene) o con filas
// anteriores del mismo archivo.
export const leerExcelMedicamentos = async (archivo, existentes) => {
    const vistos = new Set(existentes.map(claveMedicamento));

    return (await leerFilas(archivo, columnas)).map((crudo) => {
        const medicamento = {
            nombre: texto(crudo.nombre),
            presentacion: texto(crudo.presentacion),
            uso: texto(crudo.uso),
            unidades: numero(crudo.unidades),
            precioUnitario: numero(crudo.precioUnitario),
        };
        const error = errorDeFila(medicamento);
        if (error) return { ...medicamento, estado: "invalida", mensaje: error };

        const clave = claveMedicamento(medicamento);
        const repetido = vistos.has(clave);
        vistos.add(clave);
        return {
            ...medicamento,
            estado: "pendiente",
            mensaje: repetido ? "Posible duplicado: ya existe en la campaña o se repite en el archivo" : "",
        };
    });
};

// ¿Es este fallo el de esta fila? El backend informa el medicamento por su nombre (`nombresPa`).
const coincide = (nombreFallo, nombre) => {
    const fallo = normalizar(nombreFallo).trim();
    const fila = normalizar(nombre).trim();
    return Boolean(fallo && fila) && (fallo === fila || fallo.includes(fila) || fila.includes(fallo));
};

// Envía las filas "pendiente" en UNA sola petición, todas a la campaña `campaniaId`. El backend procesa
// cada una por separado: las que fallan vuelven en `medicamentosFallidos` ({ nombresPa, motivoFallo }) sin
// detener el resto. Cada fallo se asigna, en orden, a la fila con ese nombre; los que no se puedan asociar
// a ninguna fila se devuelven en `sinFila` para que no pasen desapercibidos.
export const guardarCargaMasivaMedicamentos = async (filas, campaniaId, token) => {
    const cuerpo = filas
        .filter((fila) => fila.estado === "pendiente")
        .map(({ nombre, presentacion, uso, unidades, precioUnitario }) => ({
            campaniaId,
            nombre,
            presentacion,
            uso,
            unidades: unidades ?? 0,
            precioUnitario,
        }));

    const respuesta = await postJson(URL_MASIVO, cuerpo, token, "No se pudo procesar la carga masiva");

    const sinFila = [...(Array.isArray(respuesta?.medicamentosFallidos) ? respuesta.medicamentosFallidos : [])];
    const resultados = filas.map((fila) => {
        if (fila.estado !== "pendiente") return fila;

        const i = sinFila.findIndex((fallo) => coincide(fallo.nombresPa, fila.nombre));
        if (i === -1) return { ...fila, estado: "success", mensaje: "Registrado correctamente" };

        const [fallo] = sinFila.splice(i, 1);
        return { ...fila, estado: "error", mensaje: fallo.motivoFallo || "No se pudo registrar" };
    });

    return { resultados, sinFila, respuesta };
};

// Excel con el resultado de una carga: las `columnas` de cada fila más su estado y su mensaje.
// `etiquetaExito` es cómo se llama el estado de las filas que salieron bien.
export const exportarResultados = async (columnasDeFila, resultados, prefijoArchivo, codigoCampania, etiquetaExito = "REGISTRADO") => {
    const libro = new ExcelJS.Workbook();
    const hoja = libro.addWorksheet("RESULTADO");
    hoja.addRow([...columnasDeFila.map((c) => c.etiqueta), "ESTADO", "MENSAJE"]);
    resultados.forEach((fila) =>
        hoja.addRow([
            ...columnasDeFila.map((c) => fila[c.campo]),
            fila.estado === "success" ? etiquetaExito : ETIQUETA_ESTADO[fila.estado],
            fila.mensaje || "",
        ])
    );
    estilarEncabezado(hoja);
    hoja.columns = [...columnasDeFila.map((c) => ({ width: c.ancho })), { width: 14 }, { width: 50 }];

    const fecha = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    await descargarLibro(libro, `${prefijoArchivo}_${nombreSeguro(codigoCampania)}_${fecha}.xlsx`);
};

export const exportarResultadosMedicamentos = (resultados, codigoCampania) =>
    exportarResultados(columnas, resultados, "Resultado_CargaMasivaMedicamentos", codigoCampania);
