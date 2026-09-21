import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";
import footer from "./components/footer";
import hojaTomaMuestra from "./components/hojaTomaMuestra";
export default async function ReporteExamen1(datos) {

    // Función para formatear fecha de YYYY-MM-DD a DD/MM/YYYY
    const formatearFecha = (fecha) => {
        if (!fecha) return "";
        if (typeof fecha === "string" && fecha.includes("-")) {
            const [year, month, day] = fecha.split("-");
            return `${day}/${month}/${year}`;
        }
        return fecha;
    };

    const doc = new jsPDF();

    // Move drawLine function definition to the top
    const drawLine = (x1, y1, x2, y2) => {
        doc.line(x1, y1, x2, y2);
    };

    //componente header
    headerHR(doc, datos)
    // Encabezado
    doc.setFontSize(8)
    const leftspace = 10
    const headspace = 78  // Single definition of headspace

    // Define new positions for layout
    const indicacionesX = leftspace;
    const indicacionesTextX = indicacionesX + 3;
    const indicacionesWidth = 75;
    const organigramX = indicacionesX + indicacionesWidth + 10; // organigram to the right of indications
    const organigramLineX = organigramX + 15; // Center of organigram boxes (width 30)

    // Add instructions box (now on the left)
    doc.setFillColor(240, 240, 240);
    doc.rect(indicacionesX, 68, indicacionesWidth, 25, 'F');

    doc.setTextColor(255, 0, 0);
    doc.setFontSize(8);
    doc.text("INDICACIONES:", indicacionesTextX, 73);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    // Texto dinámico y ajustado al ancho del recuadro
    const indicacionesTexto =
        "- DEJAR UNA COPIA A COLOR DE SU DNI VIGENTE\n" +
        "- DEJAR COPIA A COLOR DE SU LICENCIA DE CONDUCIR VIGENTE, SI VA A CONDUCIR VEHICULO Y/O SE REALIZARÁ EXAMEN PSICOSENSOMETRICO";
    const splittedIndicaciones = doc.splitTextToSize(indicacionesTexto, indicacionesWidth - 6);
    let yPosInd = 77;
    splittedIndicaciones.forEach(line => {
        doc.text(line, indicacionesTextX, yPosInd);
        yPosInd += 3.5;
    });

    // 🟡 Dibujar cuadros del organigrama (now on the right)
    drawBox(doc, "ADMISION", organigramX, 68, 30, 10, 4, datos.orden ? true : false);
    drawLine(organigramLineX, 78, organigramLineX, 83);
    drawBox(doc, "TRIAJE", organigramX, 83, 30, 10, 4, datos.triaje ? true : false);
    drawLine(organigramLineX, 93, organigramLineX, 98);
    drawBox(doc, "LABORATORIO", organigramX, 98, 30, 10, 4, datos.laboratorio ? true : false);
    drawLine(organigramLineX, 108, organigramLineX, 113);

    // Remove the second headspace definition and continue with the rest
    // Dibuja una fila de cajas visibles centradas horizontalmente, con líneas de conexión entre ellas
    const pageW = doc.internal.pageSize.getWidth();
    const drawPackedRow = (boxes, y, h, gap = 3) => {
        const visible = boxes.filter(b => !b.hide);
        if (!visible.length) return false;
        const totalW = visible.reduce((sum, b) => sum + b.w, 0) + (visible.length - 1) * gap;
        let x = (pageW - totalW) / 2;
        visible.forEach(({ label, w }, i) => {
            drawC(doc, label, x, y, w, h, false);
            if (i < visible.length - 1) {
                doc.line(x + w, y + h / 2, x + w + gap, y + h / 2);
            }
            x += w + gap;
        });
        return true;
    };

    const examRow1 = [
        { label: "AUDIOMETRIA", w: 25, hide: datos.audiologia ? true : false },
        { label: "EKG ( > 40 años)", w: 30, hide: datos.electrocardiograma ? true : false },
        { label: "ESPIROMETRIA", w: 25, hide: datos.espirometria ? true : false },
        { label: "A. VISUAL", w: 17, hide: datos.oftalmologia ? true : false },
        { label: "ODONTOLOGIA", w: 25, hide: datos.odontologia ? true : false },
        { label: "RAYOS X", w: 25, hide: datos.rayosx ? true : false },
        { label: "PSICOLOGIA", w: 25, hide: datos.psicologia ? true : false },
    ];
    const examRow2 = [
        { label: "TRABAJOS CALIENTES", w: 33, hide: !datos.altatc ? true : datos.trabcalientes ? true : false },
        { label: "PRUEBA DE ESFUERZO", w: 35, hide: !datos.pruebaEsfuerzo ? true : false },
        { label: "TEST ALTURA", w: 25, hide: !datos.testaltura ? true : (!datos.cerificadoaltura && !datos.b_certialtura ? false : true) },
        { label: "PSICOSENSOMETRIA", w: 35, hide: !datos.altaps ? true : datos.psicosen ? true : false },
        { label: "VISUAL COMPLEMENT", w: 35, hide: !datos.altaviscom ? true : datos.visulcompl ? true : false },
    ];
    const examRow3 = [
        { label: "EVALUACION MEDICA", w: 35, hide: datos.anexo7c ? true : false },
        { label: "MANIPULADOR DE\nALIMENTOS", w: 35, hide: !datos.altamanipalim ? true : datos.manipalimen ? true : false },
    ];
    const exAdd1 = [
        { label: "HERRAMIENTAS\nMANUALES", w: 28, hide: !datos.ahm ? true : datos.herr_ma ? true : false },
        { label: "RX COLUMNA\nDORSOLUMBAR F y L", w: 28, hide: !datos.adl ? true : datos.rxc_dorso ? true : false },
        { label: "RX COLUMNA\nLUMBAR F y L ", w: 28, hide: !datos.alba ? true : datos.rxc_lumba ? true : false },
        { label: "RX COLUMNA\nLUMBOSACRA F y L", w: 28, hide: !datos.albo ? true : datos.rxc_lumbo ? true : false },
        { label: "METALES PESADOS", w: 28, hide: !datos.aplomo || !datos.amercurio ? true : !datos.plomos || !datos.mercurioo ? true : false },
        { label: "EXAMEN VIGIA", w: 23, hide: !datos.examenVigia ? true : false },
    ];
    const exAdd2 = [
        { label: "ESPACIOS\nCONFINADOS", w: 28, hide: !datos.espaciosConfinados ? true : false },
        { label: "FIRST TEST", w: 22, hide: !datos.altaft ? true : datos.fisttest ? true : false },
        { label: "TEST\nCOCAINA", w: 22, hide: !datos.cocaina ? true : false },
        { label: "TEST\nMARIHUANA", w: 22, hide: !datos.marihuana ? true : false },
        { label: "PLOMO EN SANGRE", w: 28, hide: !datos.aplomo ? true : datos.plomos ? true : false },
        { label: "MERCURIO EN ORINA", w: 28, hide: !datos.amercurio ? true : datos.mercurioo ? true : false },
        { label: "EXAMEN SANIDAD", w: 28, hide: !datos.examenSanidad ? true : false },
    ];

    // Filas superiores: se apilan solo si tienen contenido
    let currentY = headspace + 35;
    doc.setFontSize(8);
    if (drawPackedRow(examRow1, currentY, 10)) currentY += 13;
    if (drawPackedRow(examRow2, currentY, 10)) currentY += 13;
    if (drawPackedRow(examRow3, currentY, 10)) currentY += 13;

    // Exámenes adicionales: solo aparece si hay al menos uno visible
    const hasAdditional = [...exAdd1, ...exAdd2].some(b => !b.hide);
    if (hasAdditional) {
        currentY += 3.8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("EXAMENES ADICIONALES:", pageW / 2, currentY, { align: "center" });
        doc.setFont("helvetica", "normal");
        currentY += 5;
        doc.setFontSize(6.5);
        if (drawPackedRow(exAdd1, currentY, 9)) currentY += 12;
        if (drawPackedRow(exAdd2, currentY, 9)) currentY += 12;
    }

    doc.setFontSize(8);

    const contenido = datos.hallazgoAnterior ? datos.hallazgoAnterior + ' - ' + datos.fechaAnteriorHallazgo : '';
    const lineas = doc.splitTextToSize(contenido, 180); // ancho en mm
    const textoHallazgos = [
        'HALLAZGOS:',
        ...(Array.isArray(lineas) ? lineas : [])
    ]
        .filter(Boolean) // elimina null/undefined
        .map(e => String(e)) // fuerza a string
        .join('\n');

    autoTable(doc, {
        startY: headspace + 136,
        body: [
            [
                {
                    content: textoHallazgos,
                    styles: {
                        minCellHeight: lineas.length * 4 + 23,
                        valign: "top",
                        fontSize: 8,
                        lineWidth: 0.5,
                        lineColor: [0, 0, 0]
                    }
                }
            ]
        ],
        theme: "grid",
        didParseCell: function (data) {
            if (data.row.index === 0 && data.column.index === 0) {
                const text = data.cell.text;

                if (Array.isArray(text) && text.length > 0) {
                    text[0] = 'HALLAZGOS:'; // aseguras string

                    data.cell.styles.fontStyle = 'normal';

                    // solo primera línea bold
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        }
    });



    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`Registrado por : ${obtenerPrimeraPalabra(datos.userRegistro || "")}`, 17, headspace + 185);
    footer(doc, datos);

    // === AGREGAR SEGUNDA PÁGINA ===
    doc.addPage();
    hojaTomaMuestra(doc, datos, {
        defaultColor: "#ADD8E6",
        defaultText: "BM",
    });

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Crear un iframe invisible para imprimir directamente
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);

    iframe.onload = function () {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    }
}
function obtenerPrimeraPalabra(nombreCompleto) {
    if (typeof nombreCompleto !== "string") return "";
    const limpio = nombreCompleto.trim();      // Elimina espacios
    if (limpio === "") return "";              // Si está vacío, devuelve ""
    return limpio.split(/\s+/)[0];             // Si no, devuelve la primera palabra
}
