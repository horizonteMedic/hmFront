import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { etiquetaMedicamento, hoyISO, limpiarTexto, normalizarTexto, parsearFechaVencimiento } from "../../../Compartido/inventarioUtils";
import { claveLote } from "../controllerIngresoStock";

const HOJA_INGRESO = "INGRESO_STOCK";
const HOJA_INSTRUCCIONES = "INSTRUCCIONES";
// Filas en blanco que la plantilla deja listas (con sus validaciones) debajo de los medicamentos, para
// cuando se duplican filas por tener varios lotes.
const FILAS_EXTRA = 300;

// Columnas del Excel. `fijo`: las trae el sistema y no se modifican. `opcional`: la columna puede no estar
// en el archivo. `alias`: otros encabezados que también se reconocen.
const columnas = [
    { campo: "id", etiqueta: "ID", ancho: 9, fijo: true },
    { campo: "nombre", etiqueta: "NOMBRE", ancho: 42, fijo: true, opcional: true },
    { campo: "presentacion", etiqueta: "PRESENTACION", ancho: 22, fijo: true, opcional: true },
    { campo: "numeroLote", etiqueta: "NUMERO LOTE", alias: ["LOTE", "N LOTE", "NRO LOTE"], ancho: 18 },
    { campo: "vencimiento", etiqueta: "VENCIMIENTO", alias: ["FECHA VENCIMIENTO", "FECHA DE VENCIMIENTO"], ancho: 18 },
    { campo: "cantidad", etiqueta: "CANTIDAD", ancho: 12 },
];

const COLUMNA_VENCIMIENTO = columnas.findIndex((columna) => columna.campo === "vencimiento") + 1;
const COLUMNA_CANTIDAD = columnas.findIndex((columna) => columna.campo === "cantidad") + 1;

// Error con un mensaje pensado para el usuario (archivo mal armado); cualquier otro fallo de lectura se
// reemplaza por un texto genérico.
class ErrorArchivo extends Error {}

const rellenar = (argb) => ({ type: "pattern", pattern: "solid", fgColor: { argb } });

const estiloEncabezado = (celda, fijo) => {
    celda.font = { bold: true, color: { argb: "FFFFFFFF" } };
    celda.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    celda.fill = rellenar(fijo ? "FF7F7F7F" : "FF233245");
};

const generarPlantilla = async (medicamentos) => {
    const libro = new ExcelJS.Workbook();

    // ── Hoja de datos: un renglón por medicamento activo; ID, NOMBRE y PRESENTACION en gris ──
    const hoja = libro.addWorksheet(HOJA_INGRESO);
    hoja.addRow(columnas.map((columna) => columna.etiqueta));
    hoja.getRow(1).height = 22;
    hoja.getRow(1).eachCell((celda, numero) => estiloEncabezado(celda, columnas[numero - 1].fijo));
    columnas.forEach((columna, i) => {
        hoja.getColumn(i + 1).width = columna.ancho;
    });

    medicamentos.forEach((medicamento) => {
        const fila = hoja.addRow([medicamento.id, medicamento.nombre, medicamento.presentacion, null, null, null]);
        columnas.forEach((columna, i) => {
            if (columna.fijo) fila.getCell(i + 1).fill = rellenar("FFEDEDED");
        });
    });

    // VENCIMIENTO en formato texto: así "06/2027" queda tal cual y se interpreta como mes/año (con formato
    // de fecha Excel lo convertiría al día 1 de junio). También se deja la validación de CANTIDAD.
    const ultimaFila = medicamentos.length + 1 + FILAS_EXTRA;
    for (let fila = 2; fila <= ultimaFila; fila++) {
        hoja.getCell(fila, COLUMNA_VENCIMIENTO).numFmt = "@";
        hoja.getCell(fila, COLUMNA_CANTIDAD).dataValidation = {
            type: "whole",
            operator: "greaterThanOrEqual",
            allowBlank: true,
            formulae: [1],
            showErrorMessage: true,
            errorTitle: "Cantidad no válida",
            error: "Ingrese un número entero (1 o más).",
        };
    }
    hoja.views = [{ state: "frozen", ySplit: 1 }];
    hoja.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columnas.length } };

    // ── Hoja de instrucciones ──
    const ayuda = libro.addWorksheet(HOJA_INSTRUCCIONES);
    const instrucciones = [
        "Cada fila es un lote. Si un medicamento llega en varios lotes o con distintos vencimientos, copie la fila completa (con ID y NOMBRE) y péguela debajo.",
        "No modifique ID, NOMBRE ni PRESENTACION (columnas grises): el sistema comprueba que correspondan al mismo medicamento.",
        "Complete NUMERO LOTE (opcional), VENCIMIENTO y CANTIDAD solo en los medicamentos que va a ingresar. Las filas sin datos se ignoran.",
        "VENCIMIENTO: día/mes/año (15/03/2027) o solo mes y año (06/2027); con mes y año se toma el último día del mes.",
        "CANTIDAD: número entero de 1 o más.",
        "No se admiten medicamentos ya vencidos ni dos filas con el mismo medicamento, lote y vencimiento.",
        "El usuario y la fecha y hora del ingreso los asigna el sistema. El stock entra al inventario elegido en la pantalla.",
    ];
    instrucciones.forEach((texto, i) => {
        ayuda.getCell(`A${i + 1}`).value = texto;
    });
    ayuda.getColumn(1).width = 140;

    const buffer = await libro.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Plantilla_IngresoStock_Asistencial.xlsx");
};

export const DescargarPlantillaIngresoStock = async (medicamentos) => {
    if (!medicamentos || medicamentos.length === 0) {
        await Swal.fire("Error", "No hay medicamentos activos para armar la plantilla. Registre medicamentos primero.", "error");
        return;
    }

    try {
        await generarPlantilla(medicamentos);
    } catch (error) {
        console.error(error);
        await Swal.fire("Error", "No se pudo generar la plantilla.", "error");
    }
};

const textoDeCelda = (celda) => limpiarTexto(celda?.text ?? "");

// Vencimiento tal como lo guardó Excel: una fecha o un número de serie se entregan sin tocar; el resto
// (texto escrito a mano, o el resultado de una fórmula) se lee como texto.
const valorDeVencimiento = (celda) => {
    const valor = celda.value?.result ?? celda.value;
    return valor instanceof Date || typeof valor === "number" ? valor : textoDeCelda(celda);
};

// Posición (número de columna) de cada campo según los encabezados de la fila 1.
const ubicarColumnas = (hoja) => {
    const indices = {};
    hoja.getRow(1).eachCell((celda, numero) => {
        const encabezado = normalizarTexto(celda.text);
        const columna = columnas.find((c) => [c.etiqueta, ...(c.alias ?? [])].some((nombre) => normalizarTexto(nombre) === encabezado));
        if (columna && !indices[columna.campo]) indices[columna.campo] = numero;
    });

    const faltantes = columnas.filter((columna) => !columna.opcional && !indices[columna.campo]).map((columna) => columna.etiqueta);
    if (faltantes.length > 0) {
        throw new ErrorArchivo(`Al archivo le faltan las columnas: ${faltantes.join(", ")}. Use la plantilla tal como se descargó.`);
    }
    return indices;
};

// Primer problema de la fila, o "" si está completa. El duplicado se revisa aparte.
const errorDeFila = ({ idTexto, medicamento, nombreTexto, vencimiento, vencimientoVacio, cantidadTexto, cantidad }) => {
    if (!idTexto) return "Falta el ID del medicamento";
    if (!medicamento) return `El ID ${idTexto} no corresponde a un medicamento activo`;
    if (nombreTexto && normalizarTexto(nombreTexto) !== normalizarTexto(medicamento.nombre)) {
        return `El nombre no coincide con el ID ${idTexto} (corresponde a "${medicamento.nombre}")`;
    }
    if (vencimientoVacio) return "Falta la fecha de vencimiento";
    if (!vencimiento) return "Fecha de vencimiento no válida (use dd/mm/aaaa o mm/aaaa)";
    if (vencimiento < hoyISO()) return "El medicamento ya está vencido";
    if (!cantidadTexto) return "Falta la cantidad";
    if (!(Number.isInteger(cantidad) && cantidad >= 1)) return "La cantidad debe ser un número entero (1 o más)";
    return "";
};

// Lee la hoja INGRESO_STOCK (o la primera) y devuelve { ok, filas } o { ok: false, mensaje }. Las filas del
// catálogo sin lote, vencimiento ni cantidad se ignoran (la plantilla trae todos los medicamentos y solo se
// completan los que ingresan). Cada fila trae `error` con lo que impide registrarla; el ID manda sobre el
// nombre, y el nombre del Excel solo se compara para detectar filas alteradas.
export const LeerExcelIngresoStock = async (archivo, medicamentos) => {
    try {
        if (!/\.xlsx$/i.test(archivo.name)) {
            throw new ErrorArchivo("El archivo debe ser un Excel .xlsx. Descargue la plantilla y complétela.");
        }

        const libro = new ExcelJS.Workbook();
        await libro.xlsx.load(await archivo.arrayBuffer());
        const hoja = libro.getWorksheet(HOJA_INGRESO) ?? libro.worksheets[0];
        if (!hoja) throw new ErrorArchivo("El archivo no tiene hojas.");

        const indices = ubicarColumnas(hoja);
        const porId = new Map(medicamentos.map((medicamento) => [String(medicamento.id), medicamento]));
        const vistos = new Map(); // clave del lote -> N° de la fila del Excel donde apareció primero
        const filas = [];

        hoja.eachRow((fila, numero) => {
            if (numero === 1) return;

            const numeroLote = textoDeCelda(fila.getCell(indices.numeroLote)).toUpperCase();
            const vencimientoTexto = textoDeCelda(fila.getCell(indices.vencimiento));
            const cantidadTexto = textoDeCelda(fila.getCell(indices.cantidad));
            if (!numeroLote && !vencimientoTexto && !cantidadTexto) return;

            const idTexto = textoDeCelda(fila.getCell(indices.id));
            const nombreTexto = indices.nombre ? textoDeCelda(fila.getCell(indices.nombre)) : "";
            const medicamento = porId.get(idTexto) ?? null;
            const vencimiento = parsearFechaVencimiento(valorDeVencimiento(fila.getCell(indices.vencimiento)));
            // "abc" o "2.5" quedan como inválidos; vacío se reporta aparte en errorDeFila.
            const cantidad = cantidadTexto ? Number(cantidadTexto.replace(",", ".")) : 0;

            let error = errorDeFila({
                idTexto,
                medicamento,
                nombreTexto,
                vencimiento,
                vencimientoVacio: !vencimientoTexto,
                cantidadTexto,
                cantidad,
            });
            if (!error) {
                const clave = claveLote(medicamento.id, numeroLote, vencimiento);
                if (vistos.has(clave)) {
                    error = `Repetido: mismo lote y vencimiento que la fila ${vistos.get(clave)}. Sume las cantidades en una sola fila`;
                } else {
                    vistos.set(clave, numero);
                }
            }

            filas.push({
                fila: numero,
                medicamentoId: medicamento?.id ?? null,
                nombre: medicamento?.nombre ?? nombreTexto,
                medicamento: medicamento ? etiquetaMedicamento(medicamento) : nombreTexto || idTexto,
                numeroLote,
                fechaVencimiento: vencimiento,
                // Un vencimiento que no se pudo leer se muestra como lo escribió el usuario.
                vencimientoTexto,
                // Una cantidad vacía o ilegible ("abc") se muestra tal cual en vez de 0 o "NaN".
                cantidad: cantidadTexto && Number.isFinite(cantidad) ? cantidad : cantidadTexto,
                error,
            });
        });

        if (filas.length === 0) {
            throw new ErrorArchivo("El archivo no tiene filas con datos. Complete NUMERO LOTE, VENCIMIENTO y CANTIDAD en los medicamentos a ingresar.");
        }
        return { ok: true, filas };
    } catch (error) {
        if (!(error instanceof ErrorArchivo)) console.error(error);
        return {
            ok: false,
            mensaje: error instanceof ErrorArchivo ? error.message : "No se pudo leer el archivo. Verifique que sea un Excel (.xlsx) válido.",
        };
    }
};
