import jsPDF from "jspdf";
import { getFetch } from "../../utils/apiHelpers";
import { reportesMap } from "./reportesMap";

export default async function FolioJasper(nro, token, ListaExamenes = [], onProgress = null) {
    const pdfFinal = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

    const reportesConHorizontal = [
        "historia_oc_info"
    ];

    const examenesFiltrados = ListaExamenes.filter(ex => ex.resultado === true);
    const totalReportes = examenesFiltrados.length;

    for (let i = 0; i < examenesFiltrados.length; i++) {
        const examen = examenesFiltrados[i];
        const apiUrl = examen.esJasper
            ? `${examen.url}?nOrden=${nro}&nameService=${examen.tabla}&esJasper=true`
            : `${examen.url}?nOrden=${nro}&nameService=${examen.tabla}`;

        try {
            const data = await getFetch(apiUrl, token);
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

            // Reportar progreso
            const porcentaje = Math.round(((i + 1) / totalReportes) * 100);
            if (onProgress) {
                onProgress(i + 1, totalReportes, porcentaje, examen.nombre);
            }

        } catch (err) {
            console.error("Error cargando:", examen.nombre, err);
        }
    }
    imprimir(pdfFinal);
    pdfFinal.save(`Folio_${nro}.pdf`);
}

function imprimir(doc) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
}