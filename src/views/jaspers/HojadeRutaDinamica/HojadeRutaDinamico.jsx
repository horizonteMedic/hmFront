import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "../components/headerHR";
import drawBox from "../components/drawBox";
import drawC from "../components/drawC";
import footer from "../components/footer";

export default async function HojadeRutaDinamico(datos = {}) {

    // ==========================================
    // 1. DEFINICIÓN DE EXÁMENES (AGRUPACIÓN DINÁMICA)
    // ==========================================

    // Lista de prueba solicitada por el usuario
    const testExams = [
        { nombreExamen: "Sin Examenes", nombreArea: "Sin Area" },
    ];

    const getCategorizedExams = (d) => {
        if (!Array.isArray(d?.areas)) return [];

        return d.areas.map((area) => {
            const examenesNormales = (area.examenes || []).map(ex => ({
                nombre: ex.nombre,
                subExamenes: (ex.subExamenes || []).map(se => se.nombre)
            }));

            const examenesAdicionales = (area.examenesAdicionales || []).map(ex => ({
                nombre: ex.nombre,
                subExamenes: (ex.subExamenes || []).map(se => se.nombre)
            }));

            return {
                area: area.nombre.toUpperCase(),
                examenes: [...examenesNormales, ...examenesAdicionales]
            };
        }).filter(g => g.examenes.length > 0); // 👈 elimina áreas vacías
    };

    const baseAdicionales = [
        { nombre: "INFORME PSICOLOGICO / TRABAJOS EN ESPECIFICOS", flag: false },
        { nombre: "FICHA OFTALMOLOGICA", flag: false },
        { nombre: "TEST DE FATIGA Y SOMNOLENCIA", flag: false },
        { nombre: "RADIOGRAFIA DE TORAX", flag: false },
        { nombre: "EXAMEN DE ODONTOLOGIA", flag: false },
    ];

    // ==========================================
    // 2. GENERACIÓN DE TABLA ÚNICA POR CATEGORÍAS
    // ==========================================
    const drawTable = async (doc, startY, categories, adicionales) => {
        const tableBody = [];
        console.log("categories", categories);
        // 1. ITERAR CATEGORÍAS Y CREAR FILAS
        await categories.forEach(cat => {
            const activeExams = cat.examenes
            console.log("activeExams", activeExams);
            if (activeExams.length > 0) {
                // Usar viñetas más estéticas (•) en lugar de asteriscos (*)
                const examList = activeExams.map(e => `• ${e.nombre}`).join("\n");
                console.log("examList", examList);
                tableBody.push([
                    // Agregar salto de línea simple para separar el título del área de los exámenes
                    { content: cat.area + "\n" + examList, styles: { halign: 'left' } },
                    { content: "", styles: { minCellHeight: 10 } }
                ]);
            }
        });

        // 2. ADICIONALES (COMO UNA FILA MÁS)
        if (adicionales && adicionales.length > 0) {
            const adicList = adicionales.map(a => `• ${a.nombre}`).join("\n");
            tableBody.push([
                { content: "EXÁMENES ADICIONALES\n" + adicList, styles: { halign: 'left' } },
                { content: "", styles: { minCellHeight: 20 } }
            ]);
        }

        // 3. DIBUJAR TABLA ÚNICA
        autoTable(doc, {
            startY: startY,
            head: [['EVALUACIÓN / EXÁMENES', 'PRUEBAS REALIZADAS POR:', 'OBSERVACIONES:']],
            body: tableBody,
            theme: 'grid',
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
                halign: 'center'
            },
            styles: {
                fontSize: 8,
                cellPadding: { top: 1, right: 1, bottom: 0, left: 1 },
                // Color de línea gris suave para un diseño más limpio
                lineColor: [200, 200, 200],
                lineWidth: 0.1,
                textColor: [0, 0, 0],
                valign: 'middle'
            },
            columnStyles: {
                0: { cellWidth: 70 }, // Exámenes
                1: { cellWidth: 60 }, // Firmas
                2: { cellWidth: 'auto' } // Observaciones
            },
            margin: { left: 10, right: 10 }
        });

        return doc.lastAutoTable.finalY;
    };

    // ==========================================
    // 3. INICIALIZACIÓN DEL PDF
    // ==========================================
    const doc = new jsPDF();

    await headerHR(doc, datos);

    const startY = 70;

    doc.setFillColor(245, 245, 245);
    doc.rect(10, startY, 190, 18, 'F');

    doc.setTextColor(200, 0, 0);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("INDICACIONES:", 12, startY + 5);

    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");
    const indicacionesTexto =
        "- DEJAR UNA COPIA A COLOR DE SU DNI VIGENTE\n" +
        "- DEJAR COPIA A COLOR DE SU LICENCIA DE CONDUCIR VIGENTE, SI VA A CONDUCIR VEHICULO\nY/O SE REALIZARÁ EXAMEN PSICOSENSOMETRICO";

    doc.text(indicacionesTexto, 12, startY + 10);

    const categorizedExams = getCategorizedExams(datos);

    await drawTable(doc, startY + 25, categorizedExams, baseAdicionales);

    const pageHeight = doc.internal.pageSize.getHeight();

    footer(doc, datos);

    // ==========================================
    // 4. SEGUNDA PÁGINA
    // ==========================================
    doc.addPage();

    const pageW = doc.internal.pageSize.getWidth();
    const marginPage2 = 15;
    const yOffset = 0;

    const color = (datos.codigoColor?.trim() && datos.codigoColor.trim() !== "" ? datos.codigoColor.trim() : "#008f39");
    const boxText = (datos.textoColor?.trim() && datos.textoColor.trim() !== "" ? datos.textoColor.trim().toUpperCase() : "F");
    const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 500;

    if (colorValido) {
        const boxSize = 15;
        const boxX = pageW - marginPage2 - boxSize + 7;
        const boxY = yOffset + 2;

        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);

        doc.setDrawColor(color);
        doc.setLineWidth(2);
        doc.setLineCap('round');
        doc.line(boxX + boxSize + 3, boxY, boxX + boxSize + 3, boxY + boxSize);
        doc.setLineCap('butt');

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(color);
        doc.text(boxText, boxX + boxSize / 2, boxY + (boxSize / 2), {
            align: "center",
            baseline: "middle",
            maxWidth: boxSize - 1
        });

        doc.setDrawColor(0);
        doc.setTextColor(0);
    }

    try {
        const imgPath = "./img/pag2_hojaderuta.png";
        const margin = 0.53;
        const imgW = pageW - (2 * margin);
        const imgH = (pageHeight / 2) - margin;

        doc.addImage(imgPath, 'PNG', margin, margin, imgW, imgH);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text(String(datos.orden || "148055"), 131, 12);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        doc.setFontSize(8.5);
        const abreviarExamenPagina2 = (examen) => {
            if (!examen) return "EXAMEN";
            const examenLower = examen.toLowerCase();
            if (examenLower.includes("psicosensometria") || examenLower.includes("psicosensometría")) return "PSICO";
            if (examenLower.includes("anexo16-a") || examenLower.includes("anexo 16-a")) return "ANX16-A";
            if (examenLower.includes("anexo16a") || examenLower.includes("anexo 16a")) return "ANX16A";
            if (examenLower.includes("anexo16") || examenLower.includes("anexo 16")) return "ANX16";
            if (examenLower.includes("anual")) return "ANUAL";
            if (examenLower.includes("pre-ocupacional") || examenLower.includes("preocupacional")) return "PRE-OC";
            if (examenLower.includes("ocupacional")) return "OCUP";
            if (examenLower.includes("periodico") || examenLower.includes("periódico")) return "PER";
            if (examenLower.includes("retiro")) return "RETIRO";
            if (examenLower.includes("reingreso")) return "REING";
            if (examenLower.includes("post-ocupacional")) return "POST-OC";
            return examen.substring(0, 7).toUpperCase();
        };

        if (datos.examen) {
            doc.text(abreviarExamenPagina2(datos.examen), 30, 25.3);
        } else {
            doc.text("PRE-OC", 31, 25.5);
        }

        doc.setFontSize(9);

        const empresaTexto = String(datos.empresa || "EMPRESA NO ESPECIFICADA ");
        const empresaMaxWidth = 62;
        let empresaLines;
        if (doc.splitTextToSize(empresaTexto, empresaMaxWidth).length > 2) {
            const primeraLinea = doc.splitTextToSize(empresaTexto, 80)[0];
            const restoTexto = empresaTexto.substring(primeraLinea.length).trim();
            const restoLineas = doc.splitTextToSize(restoTexto, empresaMaxWidth);
            empresaLines = [primeraLinea, ...restoLineas];
        } else {
            empresaLines = doc.splitTextToSize(empresaTexto, empresaMaxWidth);
        }

        const empresaX = 64;
        const empresaY = 25.5;
        if (empresaLines.length > 2) doc.setFontSize(8);

        empresaLines.forEach((line, index) => {
            const lineY = empresaY - ((empresaLines.length - 1 - index) * 3);
            doc.text(line, empresaX, lineY);
        });

        doc.setFontSize(9);

        const contrataTexto = String(datos.contrata || "CONTRATA NO ESPECIFICADA");
        const contrataMaxWidth = 62;
        const contrataLines = doc.splitTextToSize(contrataTexto, contrataMaxWidth);
        const contrataY = 25.5;
        if (contrataLines.length > 2) doc.setFontSize(8);

        contrataLines.forEach((line, index) => {
            const lineY = contrataY - ((contrataLines.length - 1 - index) * 3);
            doc.text(line, 143, lineY);
        });

        doc.setFontSize(9);
        doc.setFontSize(10);
        doc.text(String(datos.nombres || "NOMBRE DE PRUEBA PACIENTE"), 53.5, 31);
        doc.setFontSize(9);
        doc.setFontSize(10.5);
        doc.text(datos.edad ? `${String(datos.edad)}` : "30", 140, 31);
        doc.setFontSize(9);
        doc.setFontSize(10.5);
        doc.text(String(formatearFecha(datos.fecha) || "23/08/2025"), 175, 31);
        doc.setFontSize(9);

        const cargoTexto = String(datos.cargo || "CARGO NO ESPECIFICADO");
        const cargoMaxWidth = 45;
        const cargoLines = doc.splitTextToSize(cargoTexto, cargoMaxWidth);
        const cargoY = 37.8;
        cargoLines.forEach((line, index) => {
            const lineY = cargoY - ((cargoLines.length - 1 - index) * 3);
            doc.text(line, 24.5, lineY);
        });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(255, 0, 0);

        if (!(!datos.testaltura ? true : !datos.cerificadoaltura && !datos.b_certialtura ? false : true)) {
            doc.text("X", 89, 37.3);
        }
        if (!(!datos.altaps ? true : datos.psicosen ? true : false)) {
            doc.text("X", 111, 37.3);
        }
        if (!(!datos.altamanipalim ? true : datos.manipalimen ? true : false)) {
            doc.text("X", 130.5, 37.3);
        }
        if (!(!datos.aplomo || !datos.amercurio ? true : !datos.plomos || !datos.mercurioo ? true : false)) {
            doc.text("X", 154.2, 37.3);
        }
        if (!(!datos.aplomo ? true : datos.plomos ? true : false)) {
            doc.text("X", 171, 37.3);
        }
        if (!(!datos.altatc ? true : datos.trabcalientes ? true : false)) {
            doc.text("X", 194, 37.3);
        }

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

    } catch (error) {
        console.error("No se pudo cargar la imagen de la hoja de ruta:", error);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("HOJA DE RUTA", 80, 100, { align: "center" });
    }

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);
    iframe.onload = function () {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    }
}

const formatearFecha = (fecha) => {
    if (!fecha) return "";
    if (typeof fecha === "string" && fecha.includes("-")) {
        const [year, month, day] = fecha.split("-");
        return `${day}/${month}/${year}`;
    }
    return fecha;
};

function obtenerPrimeraPalabra(nombreCompleto) {
    if (typeof nombreCompleto !== "string") return "";
    const limpio = nombreCompleto.trim();
    if (limpio === "") return "";
    return limpio.split(/\s+/)[0];
}