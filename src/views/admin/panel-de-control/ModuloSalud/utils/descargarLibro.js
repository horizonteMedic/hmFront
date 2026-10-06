import { saveAs } from "file-saver";

// Descarga un libro de ExcelJS (ver excelReporte.js) con el nombre indicado.
export const descargarLibro = async (libro, nombreArchivo) => {
    saveAs(new Blob([await libro.xlsx.writeBuffer()]), nombreArchivo);
};
