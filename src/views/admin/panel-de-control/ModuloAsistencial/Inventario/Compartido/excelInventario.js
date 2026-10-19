import { saveAs } from "file-saver";
import Swal from "sweetalert2";

// Utilidades comunes para los Excel del Inventario Asistencial (lista de vencidos, relación de retirados, alertas...),
// para que todos tengan el mismo aspecto: fila de título, encabezados naranja y filas con borde fino.

const rellenar = (argb) => ({ type: "pattern", pattern: "solid", fgColor: { argb } });

// Nombre apto para un archivo: sin tildes ni símbolos ("Central / Trujillo" -> "Central_Trujillo").
export const nombreSeguro = (texto) =>
    String(texto ?? "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^A-Za-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

// Agrega una hoja con una fila de título, los encabezados y una fila por elemento de `filas`.
// `columnas`: [{ etiqueta, ancho, valor(fila, indice) }]. La hoja queda con el encabezado inmovilizado.
export const agregarHoja = (libro, nombre, titulo, columnas, filas) => {
    const hoja = libro.addWorksheet(nombre);

    hoja.mergeCells(1, 1, 1, columnas.length);
    const celdaTitulo = hoja.getCell(1, 1);
    celdaTitulo.value = titulo;
    celdaTitulo.font = { bold: true, size: 13, color: { argb: "FFFFFFFF" } };
    celdaTitulo.alignment = { horizontal: "center", vertical: "middle" };
    celdaTitulo.fill = rellenar("FF233245");
    hoja.getRow(1).height = 25;

    const encabezado = hoja.addRow(columnas.map((columna) => columna.etiqueta));
    encabezado.height = 22;
    encabezado.eachCell((celda) => {
        celda.font = { bold: true, size: 10, color: { argb: "FFFFFFFF" } };
        celda.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        celda.fill = rellenar("FFFC6B03");
    });
    columnas.forEach((columna, i) => {
        hoja.getColumn(i + 1).width = columna.ancho;
    });

    filas.forEach((fila, indice) => {
        const nueva = hoja.addRow(columnas.map((columna) => columna.valor(fila, indice)));
        nueva.eachCell((celda) => {
            celda.alignment = { vertical: "middle", wrapText: true };
            celda.border = {
                top: { style: "hair", color: { argb: "FFCCCCCC" } },
                bottom: { style: "hair", color: { argb: "FFCCCCCC" } },
                left: { style: "hair", color: { argb: "FFCCCCCC" } },
                right: { style: "hair", color: { argb: "FFCCCCCC" } },
            };
        });
    });

    hoja.views = [{ state: "frozen", ySplit: 2 }];
    return hoja;
};

// Genera el archivo y lo descarga; si falla, avisa en vez de dejar la acción sin respuesta.
export const descargarLibro = async (libro, nombreArchivo) => {
    try {
        const buffer = await libro.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), nombreArchivo);
    } catch (error) {
        console.error(error);
        await Swal.fire("Error", "No se pudo generar el archivo de Excel.", "error");
    }
};
