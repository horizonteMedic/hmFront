import * as XLSX from "xlsx";
import { normalizar } from "../../../utils/filtrarPorTexto";

export const texto = (valor) => String(valor ?? "").trim();

// Número de una celda: vale un número de Excel o un texto como "2,5" o "S/ 2.50". Devuelve null si está
// vacía y, si no es un número, el texto tal cual (para poder mostrarlo en la fila inválida).
export const numero = (valor) => {
    if (typeof valor === "number") return valor;
    const celda = texto(valor);
    if (!celda) return null;
    const limpio = celda.replace(/[^\d.,-]/g, "").replace(",", ".");
    return /\d/.test(limpio) && !Number.isNaN(Number(limpio)) ? Number(limpio) : celda;
};

// Filas de la primera hoja del Excel como { campo: valor de la celda }. `columnas`: [{ campo, etiqueta, alias? }];
// cada encabezado se reconoce sin importar mayúsculas ni tildes, y también por sus `alias`. Las filas vacías se descartan.
export const leerFilas = async (archivo, columnas) => {
    const libro = XLSX.read(await archivo.arrayBuffer(), { type: "array" });
    const filas = XLSX.utils.sheet_to_json(libro.Sheets[libro.SheetNames[0]], { defval: "" });

    return filas
        .map((fila) => {
            const celdas = Object.fromEntries(Object.entries(fila).map(([clave, valor]) => [normalizar(clave).trim(), valor]));
            return Object.fromEntries(
                columnas.map(({ campo, etiqueta, alias = [] }) => {
                    const encabezado = [etiqueta, ...alias].map(normalizar).find((e) => e in celdas);
                    return [campo, celdas[encabezado]];
                })
            );
        })
        .filter((crudo) => Object.values(crudo).some((valor) => texto(valor) !== ""));
};
