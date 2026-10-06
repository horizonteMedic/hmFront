import ExcelJS from "exceljs";

const COLOR = {
    azulOscuro: "FF1F4E79",
    azulMedio: "FF2E75B6",
    dorado: "FFB8860B",
    grisClaro: "FFF2F2F2",
    blanco: "FFFFFFFF",
    negro: "FF000000",
    amarilloPar: "FFFFF3CD",
    amarilloImpar: "FFFEF9E7",
};

const ANCHO_POR_DEFECTO = 18;

const TITULO = {
    principal: { size: 14, alto: 32, horizontal: "center", fondo: COLOR.azulOscuro },
    hoja: { size: 13, alto: 26, horizontal: "center", fondo: COLOR.azulOscuro },
    seccion: { size: 10, alto: 20, horizontal: "left", fondo: COLOR.azulMedio },
};

const relleno = (argb) => ({ type: "pattern", pattern: "solid", fgColor: { argb } });

const bordes = (style, argb) => ({
    top: { style, color: { argb } },
    bottom: { style, color: { argb } },
    left: { style, color: { argb } },
    right: { style, color: { argb } },
});

export const crearLibro = () => {
    const libro = new ExcelJS.Workbook();
    libro.creator = "Horizonte Medic";
    libro.created = new Date();
    return libro;
};

// Fila de título combinada a todo el ancho de la tabla (`ncols` columnas, `anchoTotal` unidades de ancho).
// `tipo`: "principal" | "hoja" | "seccion". Si el texto no cabe en una línea, se parte y la fila crece.
export const agregarTitulo = (hoja, texto, ncols, anchoTotal, tipo = "hoja") => {
    const { size, alto, horizontal, fondo } = TITULO[tipo];
    const fila = hoja.addRow([texto]);
    hoja.mergeCells(fila.number, 1, fila.number, ncols);

    const celda = fila.getCell(1);
    celda.font = { bold: true, size, color: { argb: COLOR.blanco } };
    celda.alignment = { horizontal, vertical: "middle", wrapText: true };
    celda.fill = relleno(fondo);

    const caracteresPorLinea = Math.floor((anchoTotal * 10) / size);
    const lineas = Math.max(1, Math.ceil(texto.length / caracteresPorLinea));
    fila.height = alto + (lineas - 1) * size * 1.5;
};

const anchoDe = (columnas) => columnas.reduce((suma, c) => suma + (c.ancho ?? ANCHO_POR_DEFECTO), 0);

// Escribe una tabla al final de la hoja: título, encabezados, filas y, opcionalmente, fila de total.
// `columnas`: [{ key, label, ancho, destacado }] (las destacadas van en dorado/amarillo).
// `seccion: true` la presenta como una sección más de una hoja resumen (título discreto + espacio debajo).
export const agregarTabla = (hoja, { titulo, columnas, filas, conTotal = false, seccion = false }) => {
    const ncols = columnas.length;
    agregarTitulo(hoja, titulo, ncols, anchoDe(columnas), seccion ? "seccion" : "hoja");

    const encabezado = hoja.addRow(columnas.map((c) => c.label));
    encabezado.height = 20;
    encabezado.eachCell((celda, i) => {
        celda.font = { bold: true, size: 9, color: { argb: COLOR.blanco } };
        celda.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        celda.fill = relleno(columnas[i - 1].destacado ? COLOR.dorado : COLOR.azulMedio);
        celda.border = bordes("thin", COLOR.blanco);
    });

    filas.forEach((item, idx) => {
        const fila = hoja.addRow(columnas.map((c) => item[c.key] ?? ""));
        fila.height = 18;
        const par = idx % 2 === 0;
        fila.eachCell((celda, i) => {
            const destacado = Boolean(columnas[i - 1].destacado);
            celda.alignment = { vertical: "middle", wrapText: true };
            celda.font = { size: 9, bold: destacado, color: { argb: destacado ? COLOR.azulOscuro : COLOR.negro } };
            celda.fill = relleno(
                destacado ? (par ? COLOR.amarilloPar : COLOR.amarilloImpar) : par ? COLOR.grisClaro : COLOR.blanco
            );
            celda.border = bordes("hair", "FFCCCCCC");
        });
    });

    if (conTotal) {
        const total = hoja.addRow([`TOTAL: ${filas.length} registros`]);
        hoja.mergeCells(total.number, 1, total.number, ncols);
        const celda = total.getCell(1);
        celda.font = { bold: true, size: 9, color: { argb: COLOR.blanco } };
        celda.alignment = { horizontal: "right", vertical: "middle" };
        celda.fill = relleno(COLOR.azulOscuro);
        total.height = 18;
    }

    if (seccion) hoja.addRow([]);
};

// Hoja nueva con una sola tabla y el ancho de cada columna.
export const agregarHojaTabla = (libro, nombreHoja, config) => {
    const hoja = libro.addWorksheet(nombreHoja);
    agregarTabla(hoja, config);
    hoja.columns = config.columnas.map((c) => ({ width: c.ancho ?? ANCHO_POR_DEFECTO }));
    return hoja;
};

// Texto apto para un nombre de archivo (p. ej. el código de la campaña)
export const nombreSeguro = (texto) => String(texto).replace(/[^\w.-]+/g, "_");
