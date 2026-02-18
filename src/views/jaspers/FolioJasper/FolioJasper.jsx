import jsPDF from "jspdf";
import { getFetch } from "../../utils/apiHelpers";
import { reportesMap } from "./reportesMap";
import { PDFDocument } from "pdf-lib";
// import * as pdfjsLib from "pdfjs-dist";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import pdfjsLib from "../../config/pdjfConfig";
import { colocarSellosEnPdf, getSign } from "../../utils/helpers";

export default async function FolioJasper(nro, token, ListaExamenes = [], onProgress = null, selectedListType, signal, nombres = "", apellidos = "", datosFooter) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");//para poder cancelar la gereracion

    const pdfFinal = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true, precision: 1 });

    const reportesConHorizontal = [
        "historia_oc_info",
        "odontograma"
    ];

    const archivos = [
        "ESPIROMETRIA",//SI FIRMA
        "RAYOS X TORAX",
        "INFORME RADIOGRAFICO",
        "INFORME RADIOGRAFICO 2",
        "ELECTROCARDIOGRAMA",
        "OFTALMOLOGIA VISION TESTER",//SI FIRMA
        "DECLARACION USO FIRMA",
        "PSICOSENSOMETRICO CERT-ALTURA",//SI FIRMA
        "PSICOSENSOMETRICO ALTU-POD",//SI FIRMA nuevo
        "PSICOSENSOMETRICO ALTURA 1-8",//SI FIRMA nuevo
        "PSICOSENSOMETRICO VEHI-FOLIO",//SI FIRMA
        "LABORATORIO MANIPULADORES",
        "INTERCONSULTA",
        "INTERCONSULTA 2",
        "INTERCONSULTA 3",
        "INTERCONSULTA 4",
    ];
    const coordenadasPSICOSENSO = {
        HUELLA: { x: 400, y: 680, width: 60, height: 60 },
        FIRMA: { x: 466, y: 680, width: 120, height: 60 },
        SELLOFIRMA: { x: 40, y: 680, width: 120, height: 80 },
    }
    const archivosConFirmas = {
        "ESPIROMETRIA": {
            FIRMA: { x: 40, y: 750, width: 120, height: 60 },
            HUELLA: { x: 180, y: 750, width: 60, height: 60 },
            SELLOFIRMA: { x: 220, y: 700, width: 100, height: 60 },
            SELLOFIRMADOCASIG: { x: 340, y: 700, width: 100, height: 60 },
            "SELLOFIRMADOCASIG-EXTRA": { x: 460, y: 700, width: 100, height: 60 },
        },

        "OFTALMOLOGIA VISION TESTER": {
            HUELLA: { x: 400, y: 680, width: 60, height: 60 },
            FIRMA: { x: 466, y: 680, width: 120, height: 60 },
            SELLOFIRMADOCASIG: { x: 40, y: 680, width: 120, height: 80 },
        },

        "PSICOSENSOMETRICO CERT-ALTURA": coordenadasPSICOSENSO,

        "PSICOSENSOMETRICO ALTU-POD": coordenadasPSICOSENSO,

        "PSICOSENSOMETRICO ALTURA 1-8": coordenadasPSICOSENSO,

        "PSICOSENSOMETRICO VEHI-FOLIO": coordenadasPSICOSENSO,
    }

    const jaspersConOpcionMultiple = [
        "informe_electrocardiograma",
        "resumen_medico_poderosa",
        "oftalmologia2021",
        "antecedentes_patologicos",
        "informe_psicolaboral",
        "certificado_aptitud_medico_ocupacional",
        "audiometria_2023",
        "informe_psicologico",
        "anexo16a",
        "microbiologia",//NUEVO 
        "lhepatitis", //NUEVO
        "ac_coproparasitologico",
        "examen_inmunologico" //NUEVO
    ]

    const examenesFiltrados = ListaExamenes.filter(ex => ex.resultado === true && ex.imprimir === true);

    //const examenesFiltrados = ListaExamenes; //SOLO ACTIVAR PARA PRUEBAS 
    const totalReportes = examenesFiltrados.length;

    // Array para almacenar estadísticas de peso
    const estadisticasPeso = [];

    // Array para rastrear exámenes con PDFs externos y sus posiciones
    const pdfsExternos = [];

    // Contador de exámenes GENERADOS (no externos)
    let examenesGenerados = 0;

    // Variable para rastrear la última página generada
    let ultimaPaginaGenerada = 0;

    // Ejecutar todas las consultas a los endpoints en paralelo
    const resultadosFetch = await Promise.all(
        examenesFiltrados.map(async (examen) => {
            if (archivos.includes(examen.tabla) && !Object.keys(archivosConFirmas).includes(examen.tabla)) {
                return null;
            }
            let apiUrl = ""
            if (examen.urlInfo) {
                apiUrl = `${examen.urlInfo}?nOrden=${nro}&nameService=${examen.tablaArchivo}&esJasper=true`
            } else {
                apiUrl = examen.esJasper
                    ? `${examen.url}?nOrden=${nro}&nameService=${examen.tabla}&esJasper=true`
                    : examen.nameConset ?
                        `${examen.url}?nOrden=${nro}&nameConset=${examen.tabla}`
                        : `${examen.url}?nOrden=${nro}&nameService=${examen.tabla}`;
            }
            try {
                const data = await getFetch(apiUrl, token, signal);
                return data ? { ...data, ...datosFooter } : null;
            } catch (err) {
                console.error("Error cargando:", examen.nombre, err);
                return null;
            }
        })
    );

    for (let i = 0; i < examenesFiltrados.length; i++) {
        if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
        const examen = examenesFiltrados[i];

        // ⚠️ Si el examen está en el array "archivos", NO se consulta - se insertará el PDF externo
        if (archivos.includes(examen.tabla)) {
            // Guardar referencia para insertar PDF externo después
            pdfsExternos.push({
                examen: examen,
                // La posición es después del último examen generado
                posicionInsercion: ultimaPaginaGenerada,
                indiceEnLista: i,
                data: resultadosFetch[i]
            });
            console.log(`📎 PDF Externo detectado: ${examen.nombre} - Se insertará después de página ${ultimaPaginaGenerada}`);
            continue;
        }

        const data = resultadosFetch[i];
        if (!data) {
            console.warn("No se recibieron datos para:", examen.nombre);
            continue;
        }

        try {
            // Medir tamaño ANTES de agregar el reporte
            const pesoAntes = pdfFinal.output('arraybuffer').byteLength;

            const isHorizontal = reportesConHorizontal.includes(examen.tabla);

            // Solo agregar página si NO es el primer examen GENERADO
            if (examenesGenerados > 0) {
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
            let generador = null;

            if (jaspersConOpcionMultiple.some(item => item == examen.tabla)) {
                generador = reportesMap[examen.tabla][data.nameJasper];
            } else {
                generador = reportesMap[examen.tabla];
            }
            console.log("data:", data);
            console.log("Generador:", generador);


            const generadorFinal = typeof generador === "function" && generador.length === 1
                ? generador(data)
                : generador;

            if (generadorFinal) {
                // pdfFinal.save("folio.pdf");
                await generadorFinal(data, pdfFinal);
            } else {
                console.warn("No existe generador para:", examen.tabla);
            }

            // 📍 Actualizar la última página generada
            ultimaPaginaGenerada = pdfFinal.internal.getNumberOfPages();
            examenesGenerados++;

            console.log(`✅ Examen generado: ${examen.nombre} - Termina en página ${ultimaPaginaGenerada}`);

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
            console.error("Error generando reporte para:", examen.nombre, err);
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


    // 📄 Generar PDF final con todos los PDFs externos en sus posiciones correctas
    let pdfFinalBytes;

    //VALIDACION OHLA
    console.log("pdfsExternos.length", pdfsExternos.length)
    if (selectedListType === "OHLA") {
        const existeOftalmo = pdfsExternos.some(pd => pd.examen.tabla === "OFTALMOLOGIA VISION TESTER");
        console.log("existeOftalmoexisteOftalmo:", existeOftalmo);
        const existePsico = pdfsExternos.some(pd => pd.examen.tabla === "PSICOSENSOMETRICO VEHI-FOLIO");
        console.log("existePsicoexistePsico:", existePsico)
        if (existeOftalmo && existePsico) {
            const indexOftalmo = pdfsExternos.findIndex(pd => pd.examen.tabla === "OFTALMOLOGIA VISION TESTER");
            if (indexOftalmo !== -1) {
                pdfsExternos.splice(indexOftalmo, 1);
            }
        }
    }
    console.log("pdfsExternos.length2", pdfsExternos.length)

    if (pdfsExternos.length > 0) {
        console.log(`📎 Insertando ${pdfsExternos.length} PDF(s) externo(s) en el orden correcto...`);

        // Convertir jsPDF a PDFDocument
        const baseBytes = pdfFinal.output("arraybuffer");
        let basePdf = await PDFDocument.load(baseBytes);

        //si es una pagina en blanco la elimina
        if (estadisticasPeso.length === 0) {
            const totalPages = basePdf.getPages().length;
            if (totalPages === 1) {
                basePdf.removePage(0);
            }
        }

        // Contador de páginas insertadas para ajustar posiciones
        let paginasInsertadasAcumuladas = 0;

        // Array para rastrear estadísticas de PDFs externos
        const estadisticasPdfsExternos = [];

        // Insertar PDFs externos en ORDEN NORMAL (del primero al último)
        // Ajustamos las posiciones considerando las inserciones previas
        for (let i = 0; i < pdfsExternos.length; i++) {
            if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
            const pdfExt = pdfsExternos[i];
            const { examen, posicionInsercion } = pdfExt;

            // Ajustar la posición según las páginas insertadas previamente
            const posicionAjustada = posicionInsercion + paginasInsertadasAcumuladas;

            console.log(`📌 Insertando ${examen.nombre} (${examen.tabla}) en posición ${posicionAjustada} (original: ${posicionInsercion}, ajuste: +${paginasInsertadasAcumuladas})`);

            // Cargar el PDF externo
            let externoBytes;
            let externoPdf;
            try {
                const response = await fetch(examen.url, { signal });
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                externoBytes = await response.arrayBuffer();



                // 🆕 APLICAR FIRMAS SI ESTÁ CONFIGURADO
                if (archivosConFirmas[examen.tabla] && pdfExt.data) {
                    try {
                        console.log(`🖋️ Aplicando firmas a ${examen.nombre}...`);
                        const data = pdfExt.data;
                        const coordenadas = archivosConFirmas[examen.tabla];

                        const sFirma = getSign(data, "FIRMAP");
                        const sHuella = getSign(data, "HUELLA");
                        const sSello = getSign(data, "SELLOFIRMA");
                        const sSello2 = getSign(data, "SELLOFIRMADOCASIG");
                        const sSello3 = getSign(data, "SELLOFIRMADOCASIG-EXTRA");

                        const sellos = {
                            FIRMA: sFirma,
                            HUELLA: sHuella,
                            SELLOFIRMA: sSello,
                            SELLOFIRMADOCASIG: sSello2,
                            "SELLOFIRMADOCASIG-EXTRA": sSello3,
                        };

                        const pdfUint8 = new Uint8Array(externoBytes);
                        externoBytes = await colocarSellosEnPdf(pdfUint8, sellos, coordenadas);
                        console.log("✅ Firmas aplicadas correctamente.");
                    } catch (err) {
                        console.error("❌ Error aplicando firmas:", err);
                        // No lanzamos error fatal, seguimos con el PDF original
                    }
                }

                // 📊 Mostrar tamaño del PDF externo
                const tamañoExternoKB = (externoBytes.byteLength / 1024).toFixed(2);
                const tamañoExternoMB = (externoBytes.byteLength / (1024 * 1024)).toFixed(3);
                console.log(`   📄 Tamaño del PDF externo: ${tamañoExternoKB} KB (${tamañoExternoMB} MB)`);

                // Guardar estadísticas del PDF externo
                estadisticasPdfsExternos.push({
                    nombre: examen.nombre,
                    tabla: examen.tabla,
                    pesoKB: tamañoExternoKB,
                    pesoMB: tamañoExternoMB,
                    pesoBytes: externoBytes.byteLength
                });

                externoPdf = await PDFDocument.load(externoBytes);
            } catch (error) {
                if (examen.tabla.includes("INTERCONSULTA")) {
                    console.warn(`⚠️ Error al procesar interconsulta ${examen.nombre}: ${error.message}. Se omitirá.`);
                    continue;
                }
                throw error;
            }

            // Copiar todas las páginas del PDF externo
            const paginasExternas = await basePdf.copyPages(
                externoPdf,
                externoPdf.getPageIndices()
            );

            // Insertar las páginas en la posición correcta
            paginasExternas.forEach((pagina, index) => {
                basePdf.insertPage(posicionAjustada + index, pagina);
            });

            // Actualizar el contador de páginas insertadas
            paginasInsertadasAcumuladas += paginasExternas.length;
            console.log(`   ✓ ${paginasExternas.length} página(s) insertada(s). Total acumulado: ${paginasInsertadasAcumuladas}`);
        }

        pdfFinalBytes = await basePdf.save({ useObjectStreams: true });
        console.log("✅ Todos los PDFs externos insertados correctamente");

        // Mostrar resumen de PDFs externos
        if (estadisticasPdfsExternos.length > 0) {
            console.log("\n📎 RESUMEN DE PDFs EXTERNOS:");
            console.log("═".repeat(80));

            estadisticasPdfsExternos.forEach((pdf, index) => {
                console.log(`📄 ${pdf.nombre} (${pdf.tabla})`);
                console.log(`   Tamaño: ${pdf.pesoKB} KB (${pdf.pesoMB} MB)`);
                console.log("─".repeat(80));
            });

            // Calcular peso total de PDFs externos
            const pesoTotalExterno = estadisticasPdfsExternos.reduce((sum, pdf) => sum + pdf.pesoBytes, 0);
            console.log(`\n📦 PESO TOTAL DE PDFs EXTERNOS: ${(pesoTotalExterno / 1024).toFixed(2)} KB (${(pesoTotalExterno / (1024 * 1024)).toFixed(2)} MB)`);
            console.log(`📄 Total de PDFs externos: ${estadisticasPdfsExternos.length}`);
            console.log("═".repeat(80) + "\n");
        }
    } else {
        pdfFinalBytes = pdfFinal.output("arraybuffer");
    }

    const baseBytes = pdfFinalBytes instanceof Uint8Array ? pdfFinalBytes : new Uint8Array(pdfFinalBytes);
    const rasterizedBytes = await rasterizeAndCompressPdf(baseBytes);

    const nombreArchivo = (nombres && apellidos)
        ? `${nro} - ${apellidos.toUpperCase()} ${nombres.toUpperCase()}.pdf`
        : `Folio_${nro}.pdf`;

    // descargarPdf(rasterizedBytes, nombreArchivo);
    imprimirBytes(rasterizedBytes, nombreArchivo);
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

function imprimirBytes(pdfBytes, nombreArchivo) {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;

    document.body.appendChild(iframe);
    iframe.onload = () => {
        const tituloOriginal = document.title;
        if (nombreArchivo) {
            document.title = nombreArchivo.replace(".pdf", "");
        }

        iframe.contentWindow.focus();
        iframe.contentWindow.print();

        if (nombreArchivo) {
            setTimeout(() => {
                document.title = tituloOriginal;
            }, 5000);
        }
    };
}

async function insertarPdfEnPosicion(jsPdfDoc, pdfExternoUrl, paginaInsercion) {
    // Convertir jsPDF a PDFDocument
    const baseBytes = jsPdfDoc.output("arraybuffer");
    const basePdf = await PDFDocument.load(baseBytes);

    // Cargar el PDF externo
    let externoBytes = await fetch(pdfExternoUrl).then(r => r.arrayBuffer());

    // 🫁 SOLO ESPEROMETRÍA → aplicar sello
    //externoBytes = await sellarEspirometria(externoBytes);

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

async function sellarEspirometria(pdfBytes) {
    // Cargar PDF externo
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Cargar imagen del sello (desde public)
    const selloBytes = await fetch("/img/sello/sello.jpeg").then(r => r.arrayBuffer());
    const selloImage = await pdfDoc.embedJpg(selloBytes);

    // Obtener última página
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];

    const { width, height } = lastPage.getSize();

    // Tamaño del sello
    const selloWidth = 120;
    const selloHeight = 120;

    // Posición (abajo a la derecha)
    const x = width - selloWidth - 27;
    const y = 37;

    // Dibujar sello
    lastPage.drawImage(selloImage, {
        x,
        y,
        width: selloWidth,
        height: selloHeight,
        opacity: 0.9
    });

    return await pdfDoc.save();
}

async function rasterizeAndCompressPdf(pdfBytes) {
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const pdf = await loadingTask.promise;

    const mmPerPt = 25.4 / 72;
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;
    const SCALE = 2.2;           // 🔥 DPI alto para texto nítido
    const JPEG_QUALITY = 0.65;   // 🔥 Compresión fuerte sin borrosidad

    let doc = null;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: SCALE });

        const pageWidthMm = viewport.width * mmPerPt;
        const pageHeightMm = viewport.height * mmPerPt;
        const orientation = pageWidthMm >= pageHeightMm ? "landscape" : "portrait";

        const targetWidthMm = orientation === "landscape" ? A4_HEIGHT_MM : A4_WIDTH_MM;
        const targetHeightMm = orientation === "landscape" ? A4_WIDTH_MM : A4_HEIGHT_MM;

        const scaleFactor = Math.min(
            targetWidthMm / pageWidthMm,
            targetHeightMm / pageHeightMm
        );

        const drawWidthMm = pageWidthMm * scaleFactor;
        const drawHeightMm = pageHeightMm * scaleFactor;

        const offsetX = (targetWidthMm - drawWidthMm) / 2;
        const offsetY = (targetHeightMm - drawHeightMm) / 2;

        if (!doc) {
            doc = new jsPDF({
                unit: "mm",
                format: "a4",
                orientation,
                compress: true,
                precision: 2
            });
        } else {
            doc.addPage("a4", orientation);
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        await page.render({
            canvasContext: ctx,
            viewport
        }).promise;

        const imgData = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

        // ❌ NO usar FAST → destruye texto
        doc.addImage(
            imgData,
            "JPEG",
            offsetX,
            offsetY,
            drawWidthMm,
            drawHeightMm
        );
    }

    return doc.output("arraybuffer");
}
