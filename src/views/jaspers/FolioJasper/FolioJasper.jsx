import jsPDF from "jspdf";
import { getFetch } from "../../utils/apiHelpers";
import { reportesMap } from "./reportesMap";
import { PDFDocument } from "pdf-lib";

export default async function FolioJasper(nro, token, ListaExamenes = [], onProgress = null) {
    const pdfFinal = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });

    const reportesConHorizontal = [
        "historia_oc_info"
    ];

    const examenesFiltrados = ListaExamenes.filter(ex => ex.resultado === true);
    const totalReportes = examenesFiltrados.length;

    // Array para almacenar estadísticas de peso
    const estadisticasPeso = [];

    // Encontrar el examen de Espirometría
    const espirometria = ListaExamenes.find(
        e => e.tabla === "ESPIROMETRIA" && e.resultado === true && e.url
    );

    // Variable para rastrear en qué página insertar Espirometría
    // Prioridad: EKG > Radiografía de Torax > OIT
    let paginaParaEspirometria = null;
    let examenReferencia = null;

    for (let i = 0; i < examenesFiltrados.length; i++) {
        const examen = examenesFiltrados[i];
        // ⚠️ ESPIROMETRIA NO SE CONSULTA
        if (examen.tabla === "ESPIROMETRIA") {
            continue;
        }


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

            if (generadorFinal) {
                await generadorFinal(data, pdfFinal);

            } else {
                console.warn("No existe generador para:", examen.tabla);
            }

            // 🫁 Marcar la posición para insertar Espirometría (con prioridad)
            // Prioridad: EKG > Radiografía > OIT
            if (examen.tabla === "informe_electrocardiograma") {
                paginaParaEspirometria = pdfFinal.internal.getNumberOfPages();
                examenReferencia = "Electrocardiograma";
                console.log(`📍 EKG termina en página ${paginaParaEspirometria} - PRIORIDAD ALTA para Espirometría`);
            } else if (examen.tabla === "radiografia_torax" && !examenReferencia) {
                paginaParaEspirometria = pdfFinal.internal.getNumberOfPages();
                examenReferencia = "Radiografía de Tórax";
                console.log(`📍 Radiografía termina en página ${paginaParaEspirometria} - Fallback para Espirometría`);
            } else if (examen.tabla === "oit" && !examenReferencia) {
                paginaParaEspirometria = pdfFinal.internal.getNumberOfPages();
                examenReferencia = "OIT";
                console.log(`📍 OIT termina en página ${paginaParaEspirometria} - Fallback secundario para Espirometría`);
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


    // Generar PDF final con Espirometría en la posición correcta
    let pdfFinalBytes;

    if (espirometria && paginaParaEspirometria !== null) {
        console.log(`🫁 Insertando PDF de Espirometría después de página ${paginaParaEspirometria} (después de ${examenReferencia})`);
        pdfFinalBytes = await insertarPdfEnPosicion(pdfFinal, espirometria.url, paginaParaEspirometria);
    } else if (espirometria) {
        // Si no se encontró ningún examen de referencia, agregar Espirometría al final
        console.log("🫁 Agregando PDF de Espirometría al final (no se encontró EKG, Radiografía ni OIT)");
        pdfFinalBytes = await agregarPdfAlFinal(pdfFinal, espirometria.url);
    } else {
        pdfFinalBytes = pdfFinal.output("arraybuffer");
    }

    // Descargar e imprimir el PDF
    descargarPdf(pdfFinalBytes, `Folio_${nro}.pdf`);
    imprimirBytes(pdfFinalBytes);
}

function descargarPdf(pdfBytes, nombreArchivo) {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();

    // Limpiar
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`📥 PDF descargado: ${nombreArchivo}`);
}

function imprimirBytes(pdfBytes) {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;

    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
}

async function insertarPdfEnPosicion(jsPdfDoc, pdfExternoUrl, paginaInsercion) {
    // Convertir jsPDF a PDFDocument
    const baseBytes = jsPdfDoc.output("arraybuffer");
    const basePdf = await PDFDocument.load(baseBytes);

    // Cargar el PDF externo
    const externoBytes = await fetch(pdfExternoUrl).then(r => r.arrayBuffer());
    const externoPdf = await PDFDocument.load(externoBytes);

    // Copiar todas las páginas del PDF externo
    const paginasExternas = await basePdf.copyPages(
        externoPdf,
        externoPdf.getPageIndices()
    );

    // Insertar las páginas externas en la posición deseada
    // Las páginas en pdf-lib son 0-indexed, pero paginaInsercion viene 1-indexed de jsPDF
    paginasExternas.forEach((pagina, index) => {
        basePdf.insertPage(paginaInsercion + index, pagina);
    });

    return await basePdf.save();
}

async function agregarPdfAlFinal(jsPdfDoc, pdfExternoUrl) {
    // Convertir jsPDF a PDFDocument
    const baseBytes = jsPdfDoc.output("arraybuffer");
    const basePdf = await PDFDocument.load(baseBytes);

    // Cargar el PDF externo
    const externoBytes = await fetch(pdfExternoUrl).then(r => r.arrayBuffer());
    const externoPdf = await PDFDocument.load(externoBytes);

    // Copiar todas las páginas del PDF externo
    const paginasExternas = await basePdf.copyPages(
        externoPdf,
        externoPdf.getPageIndices()
    );

    // Agregar las páginas al final
    paginasExternas.forEach(p => basePdf.addPage(p));

    return await basePdf.save();
}
