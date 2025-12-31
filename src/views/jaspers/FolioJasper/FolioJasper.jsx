import jsPDF from "jspdf";
import { getFetch } from "../../utils/apiHelpers";
import { reportesMap } from "./reportesMap";

export default async function FolioJasper(nro, token, ListaExamenes = [], onProgress = null) {
    const pdfFinal = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });

    const reportesConHorizontal = [
        "historia_oc_info"
    ];

    const examenesFiltrados = ListaExamenes.filter(ex => ex.resultado === true);
    const totalReportes = examenesFiltrados.length;

    // Array para almacenar estadísticas de peso
    const estadisticasPeso = [];

    for (let i = 0; i < examenesFiltrados.length; i++) {
        const examen = examenesFiltrados[i];
        const apiUrl = examen.esJasper
            ? `${examen.url}?nOrden=${nro}&nameService=${examen.tabla}&esJasper=true`
            : `${examen.url}?nOrden=${nro}&nameService=${examen.tabla}`;

        try {
            const data = await getFetch(apiUrl, token);
            if (!data) continue;

            // Medir tamaño ANTES de agregar el reporte
            const pesoAntes = pdfFinal.output('arraybuffer').byteLength;

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

            //const generarReporte = reportesMap[examen.tabla];
            const generador = reportesMap[examen.tabla];
            const generadorFinal = typeof generador === "function" && generador.length === 1
                ? generador(data)
                : generador;

            if (!generador) {
                console.warn("No existe generador para:", examen.tabla);
                continue;
            }
            if (generadorFinal) {
                await generadorFinal(data, pdfFinal);
            } else {
                console.warn("No existe generador para:", examen.tabla);
            }

            // Medir tamaño DESPUÉS de agregar el reporte
            const pesoDespues = pdfFinal.output('arraybuffer').byteLength;
            const pesoReporte = pesoDespues - pesoAntes;

            // Guardar estadísticas
            estadisticasPeso.push({
                nombre: examen.nombre,
                tabla: examen.tabla,
                pesoKB: (pesoReporte / 1024).toFixed(2),
                pesoMB: (pesoReporte / (1024 * 1024)).toFixed(3)
            });

            // Reportar progreso
            const porcentaje = Math.round(((i + 1) / totalReportes) * 100);
            if (onProgress) {
                onProgress(i + 1, totalReportes, porcentaje, examen.nombre);
            }

        } catch (err) {
            console.error("Error cargando:", examen.nombre, err);
        }
    }

    // Mostrar estadísticas de peso
    console.log("\n📊 ESTADÍSTICAS DE PESO POR REPORTE:");
    console.log("═".repeat(80));

    // Ordenar por peso (mayor a menor)
    const reportesOrdenados = [...estadisticasPeso].sort((a, b) => parseFloat(b.pesoKB) - parseFloat(a.pesoKB));

    reportesOrdenados.forEach((reporte, index) => {
        const emoji = index === 0 ? "🔴" : index === 1 ? "🟡" : "🟢";
        console.log(`${emoji} ${reporte.nombre}`);
        console.log(`   Tabla: ${reporte.tabla}`);
        console.log(`   Peso: ${reporte.pesoKB} KB (${reporte.pesoMB} MB)`);
        console.log("─".repeat(80));
    });

    // Calcular peso total
    const pesoTotal = pdfFinal.output('arraybuffer').byteLength;
    console.log(`\n📦 PESO TOTAL DEL FOLIO: ${(pesoTotal / 1024).toFixed(2)} KB (${(pesoTotal / (1024 * 1024)).toFixed(2)} MB)`);
    console.log(`📄 Total de reportes: ${estadisticasPeso.length}`);
    console.log(`📈 Promedio por reporte: ${(pesoTotal / estadisticasPeso.length / 1024).toFixed(2)} KB`);
    console.log("═".repeat(80) + "\n");
    pdfFinal.save(`Folio_${nro}.pdf`);
    imprimir(pdfFinal);
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