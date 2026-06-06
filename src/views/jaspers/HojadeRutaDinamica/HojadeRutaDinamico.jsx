import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "../components/headerHR";
import drawBox from "../components/drawBox";
import drawC from "../components/drawC";
import footer from "../components/footer";

export default async function HojadeRutaDinamico(datos = {}) {

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
        }).filter(g => g.examenes.length > 0);
    }

    // ==========================================
    // 2. GENERACIÓN DE TABLA ÚNICA POR CATEGORÍAS
    // ==========================================
    const drawTable = async (doc, startY, categories, adicionales) => {
        const tableBody = [];

        categories.forEach(cat => {
            if (cat.examenes.length === 0) return;

            const examList = cat.examenes
                .map(e => {
                    let texto = `• ${e.nombre?.toUpperCase()}`;
                    if (e.subExamenes?.length > 0) {
                        texto += "\n" + e.subExamenes.map(se => `    - ${se}`).join("\n");
                    }
                    return texto;
                })
                .join("\n");

            tableBody.push([
                {
                    content: cat.area + "\n" + examList,
                    styles: { halign: 'left', minCellHeight: 20 }
                },
                { content: "", styles: { minCellHeight: 20 } },
                { content: "", styles: { minCellHeight: 20 } }
            ]);
        });

        if (adicionales?.length > 0) {
            const adicList = adicionales.map(a => `• ${a.nombre}`).join("\n");
            tableBody.push([
                {
                    content: "EXÁMENES ADICIONALES\n" + adicList,
                    styles: { halign: 'left', minCellHeight: 20 }
                },
                { content: "", styles: { minCellHeight: 20 } },
                { content: "", styles: { minCellHeight: 20 } }
            ]);
        }

        autoTable(doc, {
            startY,
            head: [['EVALUACIÓN / EXÁMENES', 'PRUEBAS REALIZADAS POR:', 'OBSERVACIONES:']],
            body: tableBody,
            theme: 'grid',
            headStyles: {
                fillColor: [220, 220, 220],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineWidth: 0.3,
                lineColor: [150, 150, 150],
                halign: 'center',
                fontSize: 8.5,
                cellPadding: { top: 3, right: 4, bottom: 3, left: 4 }
            },
            styles: {
                fontSize: 8.5,
                fontStyle: 'normal',
                cellPadding: { top: 4, right: 4, bottom: 4, left: 4 },
                lineColor: [180, 180, 180],
                lineWidth: 0.2,
                textColor: [0, 0, 0],
                valign: 'top',
            },
            columnStyles: {
                0: { cellWidth: 70 },
                1: { cellWidth: 60 },
                2: { cellWidth: 'auto' }
            },
            margin: { left: 10, right: 10 },
            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 0) {
                    const content = String(data.cell.raw?.content || "");
                    const lines = content.split("\n");
                    // Primera línea en negrita, resto normal
                    // autoTable no soporta mixed styles inline, 
                    // así que ponemos bold solo si es solo el título
                    if (lines.length === 1) {
                        data.cell.styles.fontStyle = 'bold';
                    } else {
                        data.cell.styles.fontStyle = 'normal';
                    }
                }
            },
            // ← SIN didDrawCell, era el causante del texto doble
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
    doc.rect(10, startY, 130, 24, 'F');

    doc.setTextColor(200, 0, 0);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("INDICACIONES:", 12, startY + 5);

    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");
    const indicacionesTexto =
        "- DEJAR UNA COPIA A COLOR DE SU DNI VIGENTE\n" +
        "- DEJAR COPIA A COLOR DE SU LICENCIA DE CONDUCIR VIGENTE, SI VA A CONDUCIR VEHICULO\nY/O SE REALIZARÁ EXAMEN PSICOSENSOMETRICO";

    doc.text(indicacionesTexto, 12, startY + 9, { maxWidth: 126, lineHeightFactor: 1.4 });

    const categorizedExams = getCategorizedExams(datos);

    await drawTable(doc, startY + 26, categorizedExams, []);

    footer(doc, datos);



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