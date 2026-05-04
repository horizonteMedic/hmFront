import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";
import footer from "./components/footer";
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
    drawC(doc, "AUDIOMETRIA", leftspace, headspace + 35, 25, 10, datos.audiologia ? true : false);
    drawC(doc, "EKG ( > 40 años)", leftspace + 28, headspace + 35, 30, 10, datos.electrocardiograma ? true : false);
    drawC(doc, "ESPIROMETRIA", leftspace + 61, headspace + 35, 25, 10, datos.espirometria ? true : false);
    drawC(doc, "A. VISUAL", leftspace + 90, headspace + 35, 17, 10, datos.oftalmologia ? true : false);
    drawC(doc, "ODONTOLOGIA", leftspace + 112, headspace + 35, 25, 10, datos.odontologia ? true : false);
    drawC(doc, "RAYOS X", leftspace + 142, headspace + 35, 25, 10, datos.rayosx ? true : false);
    drawC(doc, "PSICOLOGIA", leftspace + 170, headspace + 35, 25, 10, datos.psicologia ? true : false);

    drawLine(leftspace + 25, headspace + 40, leftspace + 28, headspace + 40);
    drawLine(leftspace + 58, headspace + 40, leftspace + 61, headspace + 40);
    drawLine(leftspace + 86, headspace + 40, leftspace + 90, headspace + 40);
    drawLine(leftspace + 107, headspace + 40, leftspace + 112, headspace + 40);
    drawLine(leftspace + 137, headspace + 40, leftspace + 142, headspace + 40);
    drawLine(leftspace + 167, headspace + 40, leftspace + 170, headspace + 40);

    // 🟡 Evaluación Médica y Audiometría

    drawLine(leftspace + 15, headspace + 45, leftspace + 15, headspace + 50);
    drawLine(leftspace + 40, headspace + 45, leftspace + 40, headspace + 50);
    drawLine(leftspace + 70, headspace + 45, leftspace + 70, headspace + 50);
    drawLine(leftspace + 100, headspace + 45, leftspace + 100, headspace + 50);
    drawLine(leftspace + 130, headspace + 45, leftspace + 130, headspace + 50);
    drawLine(leftspace + 160, headspace + 45, leftspace + 160, headspace + 50);
    drawLine(leftspace + 184, headspace + 45, leftspace + 184, headspace + 50);


    drawLine(leftspace + 15, headspace + 50, leftspace + 184, headspace + 50); // Conectar "GRUPO SANGUINEO"

    drawLine(leftspace + 28, headspace + 50, leftspace + 28, headspace + 55);
    drawLine(leftspace + 70, headspace + 50, leftspace + 70, headspace + 55);
    drawLine(leftspace + 92, headspace + 50, leftspace + 92, headspace + 55);
    drawLine(leftspace + 168, headspace + 50, leftspace + 168, headspace + 55);

    drawC(doc, "TRABAJOS CALIENTES", leftspace + 15, headspace + 55, 33, 10, !datos.altatc ? true : datos.trabcalientes ? true : false);
    drawC(doc, "FIST TEST", leftspace + 54, headspace + 55, 25, 10, !datos.altaft ? true : datos.fisttest ? true : false);
    drawC(doc, "TEST ALTURA", leftspace + 84, headspace + 55, 25, 10, !datos.testaltura ? true : !datos.cerificadoaltura && !datos.b_certialtura ? false : true);
    drawC(doc, "PSICOSENSOMETRIA", leftspace + 115, headspace + 55, 35, 10, !datos.altaps ? true : datos.psicosen ? true : false);
    drawC(doc, "VISUAL COMPLEMENT", leftspace + 155, headspace + 55, 35, 10, !datos.altaviscom ? true : datos.visulcompl ? true : false);

    drawLine(leftspace + 95, headspace + 65, leftspace + 95, headspace + 70);
    drawC(doc, "EVALUACION MEDICA", leftspace + 80, headspace + 70, 35, 10, datos.anexo7c ? true : false);

    drawLine(leftspace + 51, headspace + 50, leftspace + 51, headspace + 70);
    drawC(doc, "MANIPULADOR DE\nALIMENTOS", leftspace + 35, headspace + 70, 35, 10, !datos.altamanipalim ? true : datos.manipalimen ? true : false);

    doc.text("EXAMENES ADICIONALES:", 10, headspace + 93)

    drawC(doc, "HERRAMIENTAS\nMANUALES", leftspace, headspace + 97, 35, 10, !datos.ahm ? true : datos.herr_ma ? true : false);
    drawC(doc, "RX COLUMNA\nDORSOLUMBAR F y L", leftspace + 40, headspace + 97, 35, 10, !datos.adl ? true : datos.rxc_dorso ? true : false);
    drawC(doc, "RX COLUMNA\nLUMBAR F y L ", leftspace + 80, headspace + 97, 35, 10, !datos.alba ? true : datos.rxc_lumba ? true : false);
    drawC(doc, "RX COLUMNA\nLUMBOSACRA F y L", leftspace + 120, headspace + 97, 35, 10, !datos.albo ? true : datos.rxc_lumbo ? true : false);
    drawC(doc, "METALES PESADOS ", leftspace + 160, headspace + 97, 35, 10, !datos.aplomo || !datos.amercurio ? true : !datos.plomos || !datos.mercurioo ? true : false);

    drawC(doc, "ESPACIOS\nCONFINADOS", leftspace, headspace + 118, 35, 10, !datos.espaciosConfinados ? true : false);
    drawC(doc, "TEST\nCOCAINA", leftspace + 40, headspace + 118, 35, 10, !datos.cocaina ? true : false);
    drawC(doc, "TEST\nMARIHUANA", leftspace + 80, headspace + 118, 35, 10, !datos.marihuana ? true : false);

    drawLine(leftspace + 35, headspace + 102, leftspace + 40, headspace + 102);
    drawLine(leftspace + 75, headspace + 102, leftspace + 80, headspace + 102);
    drawLine(leftspace + 115, headspace + 102, leftspace + 120, headspace + 102);
    drawLine(leftspace + 155, headspace + 102, leftspace + 160, headspace + 102);

    drawLine(leftspace + 175, headspace + 107, leftspace + 175, headspace + 113);
    drawLine(leftspace + 148, headspace + 113, leftspace + 185, headspace + 113);
    drawLine(leftspace + 148, headspace + 113, leftspace + 148, headspace + 118);
    drawLine(leftspace + 185, headspace + 113, leftspace + 185, headspace + 118);

    drawC(doc, "PLOMO EN SANGRE", leftspace + 118, headspace + 118, 35, 10, !datos.aplomo ? true : datos.plomos ? true : false);
    drawC(doc, "MERCURIO EN ORINA", leftspace + 160, headspace + 118, 35, 10, !datos.amercurio ? true : datos.mercurioo ? true : false);

    const contenido = datos.hallazgoAnterior || '';
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

    // Mostrar código de color solo en la página 2, 10 puntos más arriba
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;
    const yOffset = 0; // 10 puntos más arriba (cambiado de 10 a 0)

    // Código de color usando datos reales
    // === DISEÑO DE LA SEGUNDA PÁGINA (LABORATORIO) ===
    const marginL = 7;
    let currentY = 7;

    // Dibujar borde exterior delgado
    doc.setLineWidth(0.1);
    doc.setDrawColor(0);
    doc.rect(marginL-2, 3, 200, 285);
    doc.setLineWidth(0.2);
    doc.rect(marginL, 5, 196, 157);

    // --- CABECERA ---
    try {
        const logoImg = "/img/logo-color.png";
        doc.addImage(logoImg, "PNG", marginL + 5, 8, 45, 12);
    } catch (e) {
        console.error("Error cargando logo", e);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("MUESTRA:", marginL + 55, 15);

    doc.setFont("helvetica", "normal");
    doc.text("SANGRE", marginL + 72, 14);
    doc.rect(marginL + 85, 11.5, 4, 3); // Checkbox Sangre
    doc.text("ORINA", marginL + 72, 18);
    doc.rect(marginL + 85, 15.5, 4, 3); // Checkbox Orina
    doc.text("HECES", marginL + 72, 22);
    doc.rect(marginL + 85, 19.5, 4, 3); // Checkbox Heces

    // Cuadro de tiempos
    doc.setLineWidth(0.2);
    doc.rect(marginL + 92, 10, 48, 15);
    doc.line(marginL + 92, 15, marginL + 140, 15);
    doc.line(marginL + 92, 20, marginL + 140, 20);
    doc.line(marginL + 125, 10, marginL + 125, 25);

    doc.setFontSize(5.5);
    doc.text("HORA DE TOMA DE MUESTRA", marginL + 93, 13);
    doc.text("HORA DE INICIO DE PROCESO", marginL + 93, 18);
    doc.text("HORA DE TERMINO DE PROCESO", marginL + 93, 23);

    // Código
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("CÓDIGO", marginL + 142, 17);
    doc.setLineWidth(0.5);
    doc.rect(marginL + 155, 11, 22, 10);
    doc.setFontSize(15);
    doc.text(String(datos.orden || ""), marginL + 157, 17);

    // Dynamic BM Box (Top Right)
    const displayColor = (datos.codigoColor?.trim() ? datos.codigoColor.trim() : "#ADD8E6");
    const displayText = (datos.textoColor?.trim() ? datos.textoColor.trim().toUpperCase() : "BM");

    doc.setDrawColor(0);
    doc.setLineWidth(0.6);
    doc.roundedRect(marginL + 180, 9, 12, 14, 1, 1);

    doc.setLineWidth(1.6);
    doc.setDrawColor(displayColor);
    doc.setLineCap('round');
    doc.line(marginL + 194, 9, marginL + 194, 23);
    doc.setLineCap('butt');

    doc.setTextColor(displayColor);
    doc.setFontSize(displayText.length > 1 ? 15 : 20);
    doc.text(displayText, marginL + 186, 16, { align: "center", baseline: "middle" });
    doc.setTextColor(0);
    doc.setDrawColor(0);


    // --- INFO PACIENTE ---
    doc.setLineWidth(0.3);
    currentY = 32;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");

    doc.text("T. EXAMEN:", marginL + 5, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(String(datos.examen || ""), marginL + 23, currentY);
    doc.line(marginL + 22, currentY + 0.5, marginL + 45, currentY + 0.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("EMPRESA:", marginL + 48, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(String(datos.empresa || ""), marginL + 64, currentY);
    doc.line(marginL + 63, currentY + 0.5, marginL + 130, currentY + 0.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("CONTRATA:", marginL + 132, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(String(datos.contrata || "N/A"), marginL + 150, currentY);
    doc.line(marginL + 149, currentY + 0.5, marginL + 192, currentY + 0.5);

    currentY += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("NOMBRES Y APELLIDOS:", marginL + 5, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(String(datos.nombres || ""), marginL + 42, currentY);
    doc.line(marginL + 41, currentY + 0.5, marginL + 130, currentY + 0.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("EDAD:", marginL + 132, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(String(datos.edad || ""), marginL + 143, currentY);
    doc.text("Años", marginL + 152, currentY);
    doc.line(marginL + 142, currentY + 0.5, marginL + 150, currentY + 0.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("FECHA:", marginL + 162, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(formatearFecha(datos.fecha) || "", marginL + 175, currentY);
    doc.line(marginL + 174, currentY + 0.5, marginL + 192, currentY + 0.5);

    currentY += 5;
    doc.setFont("helvetica", "bold");
    doc.text("CARGO:", marginL + 5, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(String(datos.cargo || ""), marginL + 18, currentY);
    doc.line(marginL + 17, currentY + 0.5, marginL + 57, currentY + 0.5);

    // Checkboxes (T.ALTURA, PSICO, etc.)
    const cbXStart = 65;
    const cbLabels = ["T.ALTURA", "PSICO", "M. A.", "MET. P.", "Pb", "T. CAL"];
    doc.setFont("helvetica", "bold");
    cbLabels.forEach((label, i) => {
        doc.text(label, cbXStart + (i * 22), currentY);
        doc.rect(cbXStart + (i * 22) + 13, currentY - 3, 5, 4);

        // Marcar automáticamente si corresponde según la lógica de la página 1
        let marked = false;
        if (label === "T.ALTURA") marked = !(!datos.testaltura ? true : !datos.cerificadoaltura && !datos.b_certialtura ? false : true);
        if (label === "PSICO") marked = !(!datos.altaps ? true : datos.psicosen ? true : false);
        if (label === "M. A.") marked = !(!datos.altamanipalim ? true : datos.manipalimen ? true : false);
        if (label === "MET. P.") marked = !(!datos.aplomo || !datos.amercurio ? true : !datos.plomos || !datos.mercurioo ? true : false);
        if (label === "Pb") marked = !(!datos.aplomo ? true : datos.plomos ? true : false);
        if (label === "T. CAL") marked = !(!datos.altatc ? true : datos.trabcalientes ? true : false);

        if (marked) {
            doc.setFontSize(9);
            doc.setTextColor(255, 0, 0);
            doc.text("X", cbXStart + (i * 22) + 14.5, currentY - 0.2);
            doc.setTextColor(0);
            doc.setFontSize(7.5);
        }
    });

    // --- TABLAS DE RESULTADOS ---
    currentY += 7;
    const tableTop = currentY;
    const col1Width = 100;
    const col2Width = 90;

    // Columna Izquierda
    doc.setFillColor(253, 233, 174); // Light orange/yellow for header
    doc.rect(marginL + 5, currentY, col1Width - 5, 5, 'FD');
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("PRUEBA", marginL + 10, currentY + 3.5);
    doc.line(marginL + 35, currentY, marginL + 35, currentY + 5);
    doc.text("RESULTADOS DE ANALISIS CLÍNICOS", marginL + 40, currentY + 3.5);

    const rowsLeft = [
        { label: "G.S Y FACT. Rh", h: 6 },
        { label: "Hb y Hto", h: 6, sub: ["Hb:", "Hto:"] },
        { label: "VSG", h: 6 },
        { label: "LEUCOCITOS", h: 6 },
        { label: "HEMATÍES", h: 6 },
        { label: "PLAQUETAS", h: 6 },
        { label: "RECUENTO\nDIFERENCIAL", h: 12, sub: ["NEUT:", "AB:", "SEG:", "MON:", "EOS:", "BAS:", "LIN:"] },
        { label: "GLUCOSA", h: 6 },
        { label: "CREATININA", h: 6 },
        { label: "ÚREA", h: 6 },
        { label: "ÁCIDO ÚRICO", h: 6 }
    ];

    let yL = currentY + 5;
    rowsLeft.forEach(row => {
        doc.setLineWidth(0.2);
        doc.rect(marginL + 5, yL, 30, row.h);
        doc.rect(marginL + 35, yL, col1Width - 35, row.h);
        doc.setFontSize(6.5);
        doc.setFont("helvetica", "bold");

        const lines = doc.splitTextToSize(row.label, 28);
        doc.text(lines, marginL + 20, yL + (row.h / 2), { align: "center", baseline: "middle" });

        if (row.sub) {
            doc.setFont("helvetica", "normal");
            if (row.label === "Hb y Hto") {
                doc.text(row.sub[0], marginL + 36, yL + 4);
                doc.line(marginL + 64, yL, marginL + 64, yL + 6);
                doc.text(row.sub[1], marginL + 65, yL + 4);
            } else if (row.label === "RECUENTO\nDIFERENCIAL") {
                doc.text(row.sub[0], marginL + 36, yL + 4);
                doc.text(row.sub[1], marginL + 51, yL + 4);
                doc.text(row.sub[2], marginL + 71, yL + 4);
                doc.text(row.sub[3], marginL + 36, yL + 10);
                doc.text(row.sub[4], marginL + 51, yL + 10);
                doc.text(row.sub[5], marginL + 71, yL + 10);
                doc.text(row.sub[6], marginL + 86, yL + 10);

                doc.line(marginL + 50, yL, marginL + 50, yL + 6);
                doc.line(marginL + 70, yL, marginL + 70, yL + 6);
                doc.line(marginL + 35, yL + 6, marginL + 100, yL + 6);
                doc.line(marginL + 50, yL + 6, marginL + 50, yL + 12);
                doc.line(marginL + 70, yL + 6, marginL + 70, yL + 12);
                doc.line(marginL + 85, yL + 6, marginL + 85, yL + 12);
            }
        }
        yL += row.h;
    });

    // Columna Derecha
    let yR = tableTop;
    const rowsRight = [
        "COLESTEROL", "TRIGLICÉRIDOS", "HDL", "LDL", "VLDL", "RPR O VDRL",
        "PREGNOSTICON", "COCAÍNA", "MARIHUANA", "PANEL 5D", "ECO"
    ];

    rowsRight.forEach(label => {
        doc.rect(marginL + 105, yR, 35, 6);
        doc.rect(marginL + 140, yR, col2Width - 40, 6);
        doc.setFontSize(6.5);
        doc.setFont("helvetica", "bold");
        doc.text(label, marginL + 106, yR + 4);
        yR += 6;
    });

    // P. HEPATICO
    doc.rect(marginL + 105, yR, col2Width - 5, 11);
    doc.setLineWidth(0.3);
    doc.line(marginL + 140, yR, marginL + 140, yR + 11);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text("D:", marginL + 141, yR + 3.5);
    doc.text("Ph:", marginL + 165, yR + 3.5);

    doc.setFont("helvetica", "bold");
    doc.text("P. HEPÁTICO", marginL + 106, yR + 8);
    doc.setLineWidth(0.2);
    doc.line(marginL + 164, yR + 5, marginL + 164, yR + 11);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text("GGT:", marginL + 165, yR + 8.5);
    doc.line(marginL + 105, yR + 5, marginL + 190, yR + 5);

    // --- COMENTARIOS ---
    currentY = yL + 3;
    doc.setLineWidth(0.4);
    doc.rect(marginL + 5, currentY, 185, 30);
    // doc.roundedRect(marginL + 5, currentY, 190, 30, 1.5, 1.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("COMENTARIOS", marginL + 8, currentY + 5);
    doc.setLineWidth(0.3);
    doc.line(marginL + 8, currentY + 6, marginL + 28, currentY + 6);

    doc.setLineWidth(0.4);
    doc.setFontSize(6.5);
    doc.text("• FAM. DIABÉTICO :", marginL + 8, currentY + 11);
    doc.line(marginL + 35, currentY + 11.5, marginL + 100, currentY + 11.5);
    doc.text("• MEDICAMENTO :", marginL + 8, currentY + 18);
    doc.line(marginL + 35, currentY + 18.5, marginL + 100, currentY + 18.5);
    doc.text("• P. MENSTRUAL :", marginL + 8, currentY + 25);
    doc.line(marginL + 35, currentY + 25.5, marginL + 100, currentY + 25.5);

    doc.rect(marginL + 105, currentY + 2, 83, 26);
    doc.text("• L      :", marginL + 108, currentY + 9);
    doc.line(marginL + 120, currentY + 9.5, marginL + 148, currentY + 9.5);
    doc.text("• CEL  :", marginL + 108, currentY + 14);
    doc.line(marginL + 120, currentY + 14.5, marginL + 148, currentY + 14.5);
    doc.text("• CRIST :", marginL + 108, currentY + 19);
    doc.line(marginL + 120, currentY + 19.5, marginL + 186, currentY + 19.5);
    doc.text("• OTROS :", marginL + 108, currentY + 24);
    doc.line(marginL + 120, currentY + 24.5, marginL + 186, currentY + 24.5);
 
    doc.text("• H     :", marginL + 152, currentY + 9);
    doc.line(marginL + 162, currentY + 9.5, marginL + 186, currentY + 9.5);
    doc.text("• BAC :", marginL + 152, currentY + 14);
    doc.line(marginL + 162, currentY + 14.5, marginL + 186, currentY + 14.5);



    // --- FIRMAS ---
    currentY += 35;
    doc.setLineWidth(0.8);
    doc.setDrawColor(0, 51, 102); // Dark blue for the signature box
    doc.rect(marginL, currentY, 196, 35);
    doc.setDrawColor(0);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.text("FIRMA:", marginL + 10, currentY + 5);
    doc.text("FIRMA:", marginL + 105, currentY + 5);

    doc.setLineWidth(0.4);
    doc.line(marginL + 25, currentY + 28, marginL + 85, currentY + 28);
    doc.text("RESPONSABLE DE TOMA DE MUESTRA", marginL + 30, currentY + 32);

    doc.line(marginL + 115, currentY + 28, marginL + 175, currentY + 28);
    doc.text("RESPONSABLE DE PROCESO", marginL + 125, currentY + 32);


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