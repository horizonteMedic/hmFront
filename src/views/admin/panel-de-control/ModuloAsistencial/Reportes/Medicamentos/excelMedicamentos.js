import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Estilos comunes de los Excel de medicamentos (mismos colores que el Excel de Tickets).
const COLOR_TITULO = "FF233245";
const COLOR_CABECERA = "FFFC6B03";
const COLOR_FILA_PAR = "FFF2F2F2";
const COLOR_FILA_IMPAR = "FFFFFFFF";
const FORMATO_ENTERO = "#,##0";

const relleno = (argb) => ({ type: "pattern", pattern: "solid", fgColor: { argb } });
const bordes = (estilo, argb) => ({
    top: { style: estilo, color: { argb } },
    bottom: { style: estilo, color: { argb } },
    left: { style: estilo, color: { argb } },
    right: { style: estilo, color: { argb } },
});

export const nuevoLibro = () => new ExcelJS.Workbook();

// Agrega una hoja con título, líneas informativas, tabla y (opcional) fila de totales.
//   columnas:   [{ key, label, width, numero? }]  (`numero` = alineada a la derecha y con separador de miles)
//   filas:      [{ [key]: valor }]
//   subtitulos: líneas de texto bajo el título (inventario, rango, totales...)
//   totales:    { etiqueta, valores: { [key]: número } }
export const agregarHojaTabla = (libro, { nombre, titulo, subtitulos = [], columnas, filas, totales }) => {
    const hoja = libro.addWorksheet(nombre);
    const totalColumnas = columnas.length;
    hoja.columns = columnas.map((columna) => ({ width: columna.width }));

    hoja.mergeCells(1, 1, 1, totalColumnas);
    const celdaTitulo = hoja.getCell(1, 1);
    celdaTitulo.value = titulo;
    celdaTitulo.font = { bold: true, size: 13, color: { argb: "FFFFFFFF" } };
    celdaTitulo.alignment = { horizontal: "center", vertical: "middle" };
    celdaTitulo.fill = relleno(COLOR_TITULO);
    hoja.getRow(1).height = 25;

    subtitulos.forEach((texto, i) => {
        const numeroFila = 2 + i;
        hoja.mergeCells(numeroFila, 1, numeroFila, totalColumnas);
        const celda = hoja.getCell(numeroFila, 1);
        celda.value = texto;
        celda.font = { bold: true, size: 10, color: { argb: COLOR_TITULO } };
        celda.alignment = { horizontal: "left", vertical: "middle" };
    });

    const filaCabecera = hoja.addRow([]);
    columnas.forEach((columna, i) => {
        const celda = filaCabecera.getCell(i + 1);
        celda.value = columna.label;
        celda.font = { bold: true, size: 9, color: { argb: "FFFFFFFF" } };
        celda.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        celda.fill = relleno(COLOR_CABECERA);
        celda.border = bordes("thin", "FFFFFFFF");
    });
    filaCabecera.height = 22;

    filas.forEach((fila, indice) => {
        const filaExcel = hoja.addRow(columnas.map((columna) => fila[columna.key] ?? ""));
        filaExcel.height = 18;
        columnas.forEach((columna, i) => {
            const celda = filaExcel.getCell(i + 1);
            celda.font = { size: 9 };
            celda.alignment = { vertical: "middle", horizontal: columna.numero ? "right" : "left", wrapText: true };
            celda.fill = relleno(indice % 2 === 0 ? COLOR_FILA_PAR : COLOR_FILA_IMPAR);
            celda.border = bordes("hair", "FFCCCCCC");
            if (columna.numero) celda.numFmt = FORMATO_ENTERO;
        });
    });

    if (totales) {
        const filaTotales = hoja.addRow(columnas.map((columna) => totales.valores?.[columna.key] ?? ""));
        filaTotales.height = 20;
        filaTotales.getCell(1).value = totales.etiqueta;
        columnas.forEach((columna, i) => {
            const celda = filaTotales.getCell(i + 1);
            celda.font = { bold: true, size: 10, color: { argb: "FFFFFFFF" } };
            celda.alignment = { vertical: "middle", horizontal: columna.numero ? "right" : "left" };
            celda.fill = relleno(COLOR_TITULO);
            if (columna.numero) celda.numFmt = FORMATO_ENTERO;
        });
    }

    // Cabecera siempre visible y filtros para buscar por medicamento, lote, usuario...
    hoja.views = [{ state: "frozen", ySplit: filaCabecera.number }];
    hoja.autoFilter = {
        from: { row: filaCabecera.number, column: 1 },
        to: { row: filaCabecera.number, column: totalColumnas },
    };

    return hoja;
};

export const descargarLibro = async (libro, nombreArchivo) => {
    const buffer = await libro.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), nombreArchivo);
};
