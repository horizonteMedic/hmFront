import jsPDF from "jspdf";
import { saveAs } from "file-saver";

// Utilidades comunes de los reportes en PDF (mismos colores que los Excel de los reportes): hoja A4 horizontal, franja de
// título, subtítulos y número de página en el pie. Las tablas se arman con jspdf-autotable en cada reporte.
export const COLOR_TITULO_PDF = [35, 50, 69];
export const COLOR_CABECERA_PDF = [252, 107, 3];
export const COLOR_FILA_PAR_PDF = [242, 242, 242];
export const MARGEN_PDF = 8;

const ALTO_FRANJA_TITULO = 9;
const ALTO_LINEA_SUBTITULO = 4.5;

export const nuevoPdf = () => new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

// Dibuja la franja de título y los subtítulos en la parte de arriba de la página actual. Devuelve la posición vertical (mm)
// donde puede empezar la tabla.
export const agregarTituloPdf = (doc, { titulo, subtitulos = [] }) => {
    const ancho = doc.internal.pageSize.getWidth() - 2 * MARGEN_PDF;

    doc.setFillColor(...COLOR_TITULO_PDF);
    doc.rect(MARGEN_PDF, MARGEN_PDF, ancho, ALTO_FRANJA_TITULO, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(titulo, MARGEN_PDF + ancho / 2, MARGEN_PDF + 6, { align: "center" });

    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_TITULO_PDF);
    subtitulos.forEach((texto, i) => doc.text(texto, MARGEN_PDF, MARGEN_PDF + ALTO_FRANJA_TITULO + 4.5 + i * ALTO_LINEA_SUBTITULO));

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    return MARGEN_PDF + ALTO_FRANJA_TITULO + 3 + subtitulos.length * ALTO_LINEA_SUBTITULO + 1.5;
};

// Escribe "texto | Página X de N" en el pie de todas las páginas; se llama al final, cuando ya se sabe cuántas hay.
export const agregarNumerosDePagina = (doc, texto) => {
    const total = doc.getNumberOfPages();
    const ancho = doc.internal.pageSize.getWidth();
    const alto = doc.internal.pageSize.getHeight();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    for (let pagina = 1; pagina <= total; pagina++) {
        doc.setPage(pagina);
        doc.text(`${texto}  |  Página ${pagina} de ${total}`, ancho / 2, alto - 4, { align: "center" });
    }
    doc.setTextColor(0, 0, 0);
};

export const descargarPdf = (doc, nombreArchivo) => {
    saveAs(doc.output("blob"), nombreArchivo);
};
