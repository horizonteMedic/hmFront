import jsPDF from "jspdf";
import { getFetch } from "../../utils/apiHelpers";
import { reportesMap } from "./reportesMap";

export default async function FolioJasper(nro, token, ListaExamenes = []) {
    const pdfFinal = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

    const reportesConHorizontal = [
        "historia_oc_info"
    ];
    console.log(ListaExamenes);
    const examenesFiltrados = ListaExamenes.filter(ex => ex.resultado === true);
    console.log(examenesFiltrados);
    for (let i = 0; i < examenesFiltrados.length; i++) {
        const examen = examenesFiltrados[i];
        console.log(examen);
        const apiUrl = examen.esJasper
            ? `${examen.url}?nOrden=${nro}&nameService=${examen.tabla}&esJasper=true`
            : `${examen.url}?nOrden=${nro}&nameService=${examen.tabla}`;

        try {
            const data = await getFetch(apiUrl, token);
            console.log(data);
            if (!data) continue;

            const isHorizontal = reportesConHorizontal.includes(examen.tabla);

            // Solo agregar página si NO es el primer examen
            if (i > 0) {
                if (isHorizontal) {
                    pdfFinal.addPage("letter", "landscape");
                } else {
                    pdfFinal.addPage("a4", "portrait");
                }
            } else {
                // Si el primer examen es horizontal, ajustar la primera página
                if (isHorizontal) {
                    // No eliminar, solo cambiar orientación de la página actual
                    pdfFinal.internal.pageSize.width = 279.4;  // letter width en mm
                    pdfFinal.internal.pageSize.height = 215.9; // letter height en mm
                }
            }

            const generarReporte = reportesMap[examen.tabla];
            if (generarReporte) {
                await generarReporte(data, pdfFinal);
            } else {
                console.warn("No existe generador para:", examen.tabla);
            }
            console.log(`Procesando examen ${i + 1}/${examenesFiltrados.length}: ${examen.tabla}`);
            console.log(`Páginas actuales: ${pdfFinal.getNumberOfPages()}`);
            console.log(`Página actual: ${pdfFinal.internal.getCurrentPageInfo().pageNumber}`);

        } catch (err) {
            console.error("Error cargando:", examen.nombre, err);
        }
    }

    pdfFinal.save(`Folio_${nro}.pdf`);
}
