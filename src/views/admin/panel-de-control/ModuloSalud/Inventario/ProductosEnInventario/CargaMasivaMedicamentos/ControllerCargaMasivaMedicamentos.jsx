import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { postJson } from "../../../utils/apiSalud";
import { descargarLibro } from "../../../utils/descargarLibro";
import { nombreSeguro } from "../../../utils/excelReporte";
import { normalizar } from "../../../utils/filtrarPorTexto";

const URL_MASIVO = "/api/medicamentos/masivo";

// Columnas del Excel (plantilla y resultado) y el campo del medicamento que corresponde a cada una
const columnas = [
    { campo: "nombre", etiqueta: "NOMBRE", ancho: 26 },
    { campo: "presentacion", etiqueta: "PRESENTACION", ancho: 22 },
    { campo: "uso", etiqueta: "USO", ancho: 40 },
    { campo: "laboratorio", etiqueta: "LABORATORIO", ancho: 20 },
    { campo: "marca", etiqueta: "MARCA", ancho: 20 },
    { campo: "unidadMedida", etiqueta: "UNIDAD DE MEDIDA", ancho: 20 },
    { campo: "stockMinimo", etiqueta: "STOCK MÍNIMO", ancho: 14 },
];

const ETIQUETA_ESTADO = { success: "REGISTRADO", error: "ERROR", invalida: "INVÁLIDA", pendiente: "PENDIENTE" };

const texto = (valor) => String(valor ?? "").trim();
const entero = (valor) => Math.max(0, Math.trunc(Number(valor) || 0));

// El backend no valida duplicados: con el mismo nombre y presentación crearía otra fila
const claveMedicamento = ({ nombre, presentacion }) => `${normalizar(nombre).trim()}|${normalizar(presentacion).trim()}`;

const estilarEncabezado = (hoja) =>
    hoja.getRow(1).eachCell((celda) => {
        celda.font = { bold: true };
        celda.alignment = { horizontal: "center", vertical: "middle" };
        celda.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFCCFFCC" } };
    });

export const descargarPlantillaMedicamentos = async () => {
    const libro = new ExcelJS.Workbook();
    const hoja = libro.addWorksheet("PLANTILLA");
    hoja.addRow(columnas.map((c) => c.etiqueta));
    hoja.addRow(["Paracetamol", "500 mg tableta", "Alivio del dolor leve a moderado y fiebre", "Genfar", "Genfar", "Tableta", 20]);
    estilarEncabezado(hoja);
    hoja.columns = columnas.map((c) => ({ width: c.ancho }));
    await descargarLibro(libro, "Plantilla_CargaMasivaMedicamentos.xlsx");
};

// Lee la primera hoja del Excel. Cada fila queda "pendiente" (lista para enviar) o "invalida" si le falta
// algo obligatorio (nombre o presentación); el `mensaje` avisa de posibles duplicados con `existentes`
// (los medicamentos que la campaña ya tiene) o con filas anteriores del mismo archivo.
export const leerExcelMedicamentos = async (archivo, existentes) => {
    const libro = XLSX.read(await archivo.arrayBuffer(), { type: "array" });
    const filas = XLSX.utils.sheet_to_json(libro.Sheets[libro.SheetNames[0]], { defval: "" });
    const vistos = new Set(existentes.map(claveMedicamento));

    return filas
        .map((fila) => {
            const celdas = Object.fromEntries(Object.entries(fila).map(([clave, valor]) => [normalizar(clave).trim(), valor]));
            return Object.fromEntries(
                columnas.map(({ campo, etiqueta }) => {
                    const valor = celdas[normalizar(etiqueta)];
                    return [campo, campo === "stockMinimo" ? entero(valor) : texto(valor)];
                })
            );
        })
        .filter((medicamento) => Object.values(medicamento).some((valor) => valor !== "" && valor !== 0))
        .map((medicamento) => {
            if (!medicamento.nombre) return { ...medicamento, estado: "invalida", mensaje: "Falta el nombre" };
            if (!medicamento.presentacion) return { ...medicamento, estado: "invalida", mensaje: "Falta la presentación" };

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
        .map(({ nombre, presentacion, uso, laboratorio, marca, unidadMedida, stockMinimo }) => ({
            nombre,
            presentacion,
            uso,
            laboratorio,
            marca,
            unidadMedida,
            stockMinimo,
            campaniaId,
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

export const exportarResultadosMedicamentos = async (resultados, codigoCampania) => {
    const libro = new ExcelJS.Workbook();
    const hoja = libro.addWorksheet("RESULTADO");
    hoja.addRow([...columnas.map((c) => c.etiqueta), "ESTADO", "MENSAJE"]);
    resultados.forEach((fila) =>
        hoja.addRow([...columnas.map((c) => fila[c.campo]), ETIQUETA_ESTADO[fila.estado], fila.mensaje || ""])
    );
    estilarEncabezado(hoja);
    hoja.columns = [...columnas.map((c) => ({ width: c.ancho })), { width: 14 }, { width: 50 }];

    const fecha = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    await descargarLibro(libro, `Resultado_CargaMasivaMedicamentos_${nombreSeguro(codigoCampania)}_${fecha}.xlsx`);
};
