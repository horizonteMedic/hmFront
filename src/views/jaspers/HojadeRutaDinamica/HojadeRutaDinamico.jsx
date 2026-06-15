import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "../components/headerHR";
import drawBox from "../components/drawBox";
import drawC from "../components/drawC";
import footer from "../components/footer";
import hojaTomaMuestra from "../components/hojaTomaMuestra";

const ORDEN_AREAS = [
    "LABORATORIO",
    "TRIAJE",
    "OFTALMOLOGIA",
    "PSICOLOGIA",
    "EKG",
    "AUDIOMETRIA",
    "ESPIROMETRIA",
    "RADIOGRAFIA",
    "CERTIFICADO EXPOSICION AL CALOR",
    "TEST DE ESTRES",
    "TEST DE ALTURA",
    "BK EN ESPUTO",
    "AGLUTINACIONES EN SANGRE",
    "HEPATITIS A",
    "PARASITOLOGICO EN HECES",
    "MEDICINA GENERAL OCUPACIONAL",
];

export default async function HojadeRutaDinamico(datos = {}) {
    console.log(datos)
    const getCategorizedExams = (d) => {
        if (!Array.isArray(d?.areas)) return [];

        const edad = parseInt(d?.edad) || 0;

        const mapped = d.areas.map((area) => {
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
        }).filter(g => {
            if (g.examenes.length === 0) return false;

            // EKG solo aparece si el paciente tiene 45 o más años
            if (g.area.includes("EKG") && edad < 50) return false;

            return true;
        });

        return mapped.sort((a, b) => {
            const idxA = ORDEN_AREAS.findIndex(o => a.area.includes(o) || o.includes(a.area));
            const idxB = ORDEN_AREAS.findIndex(o => b.area.includes(o) || o.includes(b.area));
            const posA = idxA === -1 ? 999 : idxA;
            const posB = idxB === -1 ? 999 : idxB;
            return posA - posB;
        });
    };

    // ==========================================
    // 2. GENERACIÓN DE TABLA ÚNICA POR CATEGORÍAS
    // ==========================================
    const drawTable = async (doc, startY, categories, adicionales) => {
        const tableBody = [];

        const protocolo = String(datos.protocoloNombre || "").toUpperCase();
        const sexo = String(datos.sexo || datos.sexoPa || "").toUpperCase();

        const esPerfil4 = protocolo.includes("PERFIL 4");
        const esPerfil12 = protocolo.includes("PERFIL 12");
        const esMasculino = sexo === "M" || sexo === "MASCULINO";

        categories.forEach(cat => {
            if (cat.examenes.length === 0) return;

            const areaNorm = cat.area.toUpperCase();

            // Perfil 12: omitir ALTURA y TEST DE ESTRES si no es masculino
            if (esPerfil12 && !esMasculino) {
                if (areaNorm.includes("ALTURA") || areaNorm.includes("TEST DE ESTRES")) return;
            }

            let examList = cat.examenes
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
                    styles: { halign: 'left', minCellHeight: 16 }
                },
                { content: "", styles: { minCellHeight: 16 } },
                { content: "", styles: { minCellHeight: 16 } }
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
                fontSize: 7,
                cellPadding: { top: 3, right: 4, bottom: 3, left: 4 }
            },
            styles: {
                fontSize: 7.5,
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

                    if (lines.length === 1) {
                        data.cell.styles.fontStyle = 'bold';
                    } else {
                        data.cell.styles.fontStyle = 'normal';
                    }
                }
            },
            didDrawCell: (data) => {
                if (data.section === 'body' && data.column.index === 0) {
                    const content = String(data.cell.raw?.content || "");
                    const lines = content.split("\n");

                    // Buscar líneas que empiecen con * y redibujarlas más pequeñas
                    lines.forEach((line, i) => {
                        if (line.startsWith("*")) {
                            // Calcular posición Y aproximada de esa línea
                            const lineHeight = 3.5;
                            const offsetY = data.cell.padding('top') + (i * lineHeight);

                            // Tapar con fondo blanco esa línea
                            doc.setFillColor(255, 255, 255);
                            doc.rect(
                                data.cell.x + 1,
                                data.cell.y + offsetY - 0.5,
                                data.cell.width - 2,
                                lineHeight + 0.5,
                                'F'
                            );

                            // Redibujar en tamaño pequeño e itálica
                            doc.setFont("helvetica", "italic");
                            doc.setFontSize(5.5);
                            doc.setTextColor(80, 80, 80);
                            doc.text(
                                line,
                                data.cell.x + data.cell.padding('left'),
                                data.cell.y + offsetY + lineHeight - 0.5
                            );
                            doc.setFont("helvetica", "normal");
                            doc.setFontSize(7.5);
                            doc.setTextColor(0, 0, 0);
                        }
                    });
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

    const startY = 62;

    doc.setFillColor(245, 245, 245);
    doc.rect(10, startY, 120, 18, 'F');

    doc.setTextColor(200, 0, 0);
    doc.setFontSize(6.8);
    doc.setFont("helvetica", "bold");
    doc.text("INDICACIONES:", 12, startY + 5);

    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");
    const indicacionesTexto =
        "- DEJAR UNA COPIA A COLOR DE SU DNI VIGENTE\n" +
        "- DEJAR COPIA A COLOR DE SU LICENCIA DE CONDUCIR VIGENTE, SI VA A CONDUCIR VEHICULO\nY/O SE REALIZARÁ EXAMEN PSICOSENSOMETRICO";

    doc.text(indicacionesTexto, 12, startY + 9, { maxWidth: 126, lineHeightFactor: 1.4 });

    const categorizedExams = getCategorizedExams(datos);

    await drawTable(doc, startY + 20, categorizedExams, []);


    const pageHeight = doc.internal.pageSize.getHeight();

    // === AGREGAR SEGUNDA PÁGINA ===
    doc.addPage();
    hojaTomaMuestra(doc, datos, {
        defaultColor: "#ADD8E6",
        defaultText: "BM",
    });

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