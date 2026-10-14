import ExcelJS from "exceljs";
import { mensajeDeError } from "../../../utils/apiSalud";
import { descargarLibro } from "../../../utils/descargarLibro";
import { nombreSeguro } from "../../../utils/excelReporte";
import { normalizar } from "../../../utils/filtrarPorTexto";
import { aFormulario, ajustarStock, editarMedicamento } from "../controllerProductosEnInventario";
import { leerFilas, numero, texto } from "./celdasExcel";
import {
    claveMedicamento,
    errorDeFila,
    estilarEncabezado,
    exportarResultados,
    guardarCargaMasivaMedicamentos,
} from "./ControllerCargaMasivaMedicamentos";

const FILAS_EN_BLANCO = 50; // filas preparadas al final de la hoja para agregar medicamentos nuevos
const COLOR_REFERENCIA = "FFE7E6E6";
const COLOR_A_LLENAR = "FFFFF2CC";

// Columnas de la hoja INVENTARIO. `tipo`: "referencia" (solo informativa, no se lee al subir el archivo) o
// "ajuste" (la llena el usuario para cambiar el stock). `nota` es el comentario del encabezado.
const columnas = [
    { campo: "id", etiqueta: "ID", ancho: 8, tipo: "referencia", nota: "No lo modifiques: identifica al medicamento. Déjalo vacío en los medicamentos nuevos." },
    { campo: "nombre", etiqueta: "NOMBRE", alias: ["DETALLE"], ancho: 34 },
    { campo: "presentacion", etiqueta: "PRESENTACION", ancho: 22 },
    { campo: "uso", etiqueta: "USO", ancho: 30 },
    { campo: "precioUnitario", etiqueta: "PRECIO UNITARIO", alias: ["PRECIO", "P. UNITARIO"], ancho: 16 },
    {
        campo: "stockActual",
        etiqueta: "STOCK ACTUAL",
        ancho: 14,
        tipo: "referencia",
        nota: "Solo informativo: cambiarlo aquí no tiene efecto. Para cambiar el stock usa las dos columnas de la derecha.",
    },
    { campo: "accion", etiqueta: "AJUSTE DE STOCK", ancho: 18, tipo: "ajuste", nota: "MANTENER (el stock queda igual), AUMENTAR o DISMINUIR." },
    {
        campo: "cantidad",
        etiqueta: "CANTIDAD",
        ancho: 12,
        tipo: "ajuste",
        nota: "Cuántas unidades aumentar o disminuir (número entero mayor a 0). En un medicamento nuevo es su stock inicial.",
    },
];

const ACCIONES = ["MANTENER", "AUMENTAR", "DISMINUIR"];
const SIGNO = { "": 0, mantener: 0, aumentar: 1, disminuir: -1 }; // por acción, ya normalizada
const MENSAJE_ACCION = "AJUSTE DE STOCK debe ser MANTENER, AUMENTAR o DISMINUIR";

const instrucciones = (campania) => [
    `Edición de inventario · ${campania.nombre} (${campania.codigo})`,
    "",
    "Cómo usar la hoja INVENTARIO:",
    "• Cambiar datos de un medicamento: modifica NOMBRE, PRESENTACION, USO o PRECIO UNITARIO en su fila.",
    "• Aumentar o disminuir el stock: en AJUSTE DE STOCK elige AUMENTAR o DISMINUIR y escribe en CANTIDAD cuántas unidades. Con MANTENER (o vacío) el stock queda como está.",
    "• Agregar medicamentos nuevos: usa las filas en blanco del final, deja el ID vacío y llena NOMBRE y PRESENTACION. Si ya tiene stock, escríbelo en CANTIDAD.",
    "• No modifiques el ID ni los encabezados. STOCK ACTUAL es solo informativo.",
    "• Las filas que borres no eliminan medicamentos del inventario.",
    "• Cada cambio de stock queda registrado como un ajuste, con tu usuario y el motivo que escribas al subir el archivo.",
];

const rellenar = (celda, argb) => {
    celda.fill = { type: "pattern", pattern: "solid", fgColor: { argb } };
};

// Excel con los medicamentos actuales de la campaña, listo para editarlos y volver a subirlo.
export const descargarHojaInventario = async (medicamentos, campania) => {
    const libro = new ExcelJS.Workbook();
    const hoja = libro.addWorksheet("INVENTARIO");
    hoja.addRow(columnas.map((c) => c.etiqueta));
    estilarEncabezado(hoja);
    columnas.forEach((c, i) => {
        if (c.nota) hoja.getCell(1, i + 1).note = c.nota;
    });
    medicamentos.forEach((m) =>
        hoja.addRow([m.id, m.nombre, m.presentacion, m.uso ?? "", m.precioUnitario ?? null, m.stockActual ?? 0, ACCIONES[0], null])
    );

    const columnaDe = (campo) => columnas.findIndex((c) => c.campo === campo) + 1;
    const ultimaFila = 1 + medicamentos.length + FILAS_EN_BLANCO;
    for (let fila = 2; fila <= ultimaFila; fila++) {
        columnas.forEach((c, i) => {
            if (c.tipo === "referencia") rellenar(hoja.getCell(fila, i + 1), COLOR_REFERENCIA);
            if (c.tipo === "ajuste") rellenar(hoja.getCell(fila, i + 1), COLOR_A_LLENAR);
        });
        hoja.getCell(fila, columnaDe("accion")).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [`"${ACCIONES.join(",")}"`],
            showErrorMessage: true,
            errorTitle: "Opción no válida",
            error: `Elige ${ACCIONES.join(", ")}`,
        };
        hoja.getCell(fila, columnaDe("cantidad")).dataValidation = {
            type: "whole",
            operator: "greaterThanOrEqual",
            allowBlank: true,
            formulae: [0],
            showErrorMessage: true,
            errorTitle: "Cantidad no válida",
            error: "Escribe un número entero (0 o más)",
        };
    }
    hoja.columns = columnas.map((c) => ({ width: c.ancho }));
    hoja.views = [{ state: "frozen", ySplit: 1 }];

    const ayuda = libro.addWorksheet("INSTRUCCIONES");
    ayuda.getColumn(1).width = 120;
    instrucciones(campania).forEach((linea, i) => {
        const celda = ayuda.getCell(i + 1, 1);
        celda.value = linea;
        celda.alignment = { wrapText: true, vertical: "top" };
    });
    ayuda.getCell(1, 1).font = { bold: true, size: 13 };

    await descargarLibro(libro, `Inventario_${nombreSeguro(campania.codigo)}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

const ETIQUETA_DATO = { nombre: "nombre", presentacion: "presentación", uso: "uso", precioUnitario: "precio" };

// Datos del medicamento que la fila cambia respecto a lo que tiene la campaña
const datosCambiados = (fila, original) => {
    const precioAnterior = original.precioUnitario == null ? null : Number(original.precioUnitario);
    return Object.keys(ETIQUETA_DATO).filter((campo) =>
        campo === "precioUnitario" ? fila.precioUnitario !== precioAnterior : fila[campo] !== texto(original[campo])
    );
};

// Error del ajuste de stock pedido para un medicamento que ya existe, o "" si es válido.
const errorDeAjuste = (accion, cantidad, stock) => {
    if (!(accion in SIGNO)) return MENSAJE_ACCION;
    if (!SIGNO[accion]) return cantidad ? "Escribiste una cantidad pero el ajuste es MANTENER: elige AUMENTAR o DISMINUIR" : "";
    if (!(Number.isInteger(cantidad) && cantidad > 0)) {
        return `Indica en CANTIDAD cuántas unidades vas a ${accion === "aumentar" ? "aumentar" : "disminuir"} (entero mayor a 0)`;
    }
    return SIGNO[accion] < 0 && cantidad > stock ? `No se puede disminuir ${cantidad}: el stock actual es ${stock}` : "";
};

// Error del stock inicial de un medicamento nuevo (va en CANTIDAD), o "" si es válido.
const errorDeStockInicial = (accion, cantidad) => {
    if (!(accion in SIGNO)) return MENSAJE_ACCION;
    if (accion === "disminuir") return "Un medicamento nuevo no se puede disminuir: escribe su stock en CANTIDAD";
    if (accion === "mantener" && cantidad) return "Para dar un stock inicial deja AJUSTE DE STOCK vacío o elige AUMENTAR";
    if (cantidad !== null && !(Number.isInteger(cantidad) && cantidad >= 0)) return "CANTIDAD debe ser un número entero (0 o más)";
    return "";
};

const invalida = (fila, mensaje) => ({ ...fila, estado: "invalida", mensaje });

// Qué hará la carga con una fila: edita un medicamento de la campaña (id conocido) o registra uno nuevo (sin id).
const clasificarFila = (crudo, { porId, vistosId, vistosNombre }) => {
    const accion = normalizar(texto(crudo.accion));
    const cantidad = numero(crudo.cantidad);
    const datos = {
        nombre: texto(crudo.nombre),
        presentacion: texto(crudo.presentacion),
        uso: texto(crudo.uso),
        precioUnitario: numero(crudo.precioUnitario),
    };
    const base = { ...datos, accion: accion.toUpperCase(), cantidad, unidades: null };
    const id = texto(crudo.id);

    if (!id) {
        const fila = { ...base, tipo: "nuevo", id: null, stockActual: null, diferencia: 0, datos: [] };
        const error = errorDeFila({ ...datos, unidades: null }) || errorDeStockInicial(accion, cantidad);
        if (error) return invalida(fila, error);

        const stockInicial = cantidad ?? 0;
        const clave = claveMedicamento(datos);
        const repetido = vistosNombre.has(clave);
        vistosNombre.add(clave);
        return {
            ...fila,
            unidades: stockInicial,
            estado: "pendiente",
            mensaje: `Nuevo medicamento${stockInicial ? ` · stock inicial ${stockInicial}` : ""}${
                repetido ? " · Posible duplicado: ya existe en la campaña o se repite en el archivo" : ""
            }`,
        };
    }

    const original = porId.get(id);
    const fila = { ...base, tipo: "existente", id: Number(id), stockActual: original?.stockActual ?? 0, diferencia: 0, datos: [], original };
    if (!original) return invalida(fila, "El ID no existe en esta campaña: descarga la hoja de inventario de nuevo");
    if (vistosId.has(id)) return invalida(fila, "El ID se repite en el archivo");
    vistosId.add(id);

    const error = errorDeFila({ ...datos, unidades: null }) || errorDeAjuste(accion, cantidad, fila.stockActual);
    if (error) return invalida(fila, error);

    const cambios = datosCambiados(datos, original);
    const diferencia = SIGNO[accion] * (cantidad ?? 0);
    const acciones = [
        cambios.length && `Editar ${cambios.map((campo) => ETIQUETA_DATO[campo]).join(", ")}`,
        diferencia && `${diferencia > 0 ? "Aumentar" : "Disminuir"} stock en ${Math.abs(diferencia)}`,
    ].filter(Boolean);

    return {
        ...fila,
        datos: cambios,
        diferencia,
        estado: acciones.length ? "pendiente" : "sinCambios",
        mensaje: acciones.join(" · ") || "Sin cambios",
    };
};

// Lee la primera hoja del Excel editado y deja cada fila en un estado: "pendiente" (tiene algo que aplicar),
// "sinCambios" o "invalida" (con su motivo en `mensaje`). `existentes` son los medicamentos de la campaña.
export const leerExcelInventario = async (archivo, existentes) => {
    const contexto = {
        porId: new Map(existentes.map((m) => [String(m.id), m])),
        vistosId: new Set(),
        vistosNombre: new Set(existentes.map(claveMedicamento)),
    };
    return (await leerFilas(archivo, columnas)).map((crudo) => clasificarFila(crudo, contexto));
};

// Hace una parte del cambio de una fila: devuelve `hecho` si salió bien o el error en texto si falló.
const intentar = async (accion, hecho, etiqueta) => {
    try {
        await accion();
        return hecho;
    } catch (error) {
        console.error(error);
        return `Error en ${etiqueta}: ${mensajeDeError(error, "no se pudo aplicar")}`;
    }
};

// Aplica las filas "pendiente": edita datos (PUT) y ajusta stock (con el `motivo` indicado) de los medicamentos
// existentes, uno por uno, y registra los nuevos en UNA sola petición. Cada fila queda "success" o "error"; los
// fallos de los nuevos que no se puedan asociar a ninguna fila vuelven en `sinFila`.
export const aplicarEdicionInventario = async (filas, { campaniaId, motivo, usuario, token }) => {
    const resultados = [...filas];
    const pendientes = (tipo) => filas.map((fila, i) => [fila, i]).filter(([fila]) => fila.estado === "pendiente" && fila.tipo === tipo);

    for (const [fila, i] of pendientes("existente")) {
        const partes = [];
        if (fila.datos.length) {
            const formulario = {
                ...aFormulario(fila.original),
                nombre: fila.nombre,
                presentacion: fila.presentacion,
                uso: fila.uso,
                precioUnitario: fila.precioUnitario === null ? "" : String(fila.precioUnitario),
            };
            partes.push(await intentar(() => editarMedicamento(fila.id, formulario, token), "Datos editados", "los datos"));
        }
        if (fila.diferencia) {
            partes.push(await intentar(() => ajustarStock(fila.id, { diferencia: fila.diferencia, motivo }, usuario, token), "Stock ajustado", "el stock"));
        }
        const fallo = partes.some((parte) => parte.startsWith("Error"));
        resultados[i] = { ...fila, estado: fallo ? "error" : "success", mensaje: partes.join(" · ") };
    }

    const nuevos = pendientes("nuevo");
    let sinFila = [];
    if (nuevos.length) {
        try {
            const respuesta = await guardarCargaMasivaMedicamentos(nuevos.map(([fila]) => fila), campaniaId, token);
            respuesta.resultados.forEach((fila, k) => {
                resultados[nuevos[k][1]] = fila;
            });
            sinFila = respuesta.sinFila;
        } catch (error) {
            console.error(error);
            const mensaje = mensajeDeError(error, "No se pudieron registrar los medicamentos nuevos");
            nuevos.forEach(([fila, i]) => {
                resultados[i] = { ...fila, estado: "error", mensaje };
            });
        }
    }

    return { resultados, sinFila };
};

export const exportarResultadosInventario = (resultados, codigoCampania) =>
    exportarResultados(columnas, resultados, "Resultado_EdicionInventario", codigoCampania, "APLICADO");
