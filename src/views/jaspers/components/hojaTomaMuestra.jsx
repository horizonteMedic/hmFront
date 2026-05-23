const hojaTomaMuestra = (doc, datos, config = {}) => {

    const defaultConfig = {
        defaultColor: "#008f39", //defaults de Reporte Examen 1 - retiro
        defaultText: "F",
    }
    const finalConfig = { ...defaultConfig, ...config };

    // Función interna para formatear fecha de YYYY-MM-DD a DD/MM/YYYY
    const formatearFecha = (fecha) => {
        if (!fecha) return "";
        if (typeof fecha === "string" && fecha.includes("-")) {
            const [year, month, day] = fecha.split("-");
            return `${day}/${month}/${year}`;
        }
        return fecha;
    };

    const marginL = 7;
    let currentY = 7;

    // Dibujar borde exterior delgado
    doc.setLineWidth(0.1);
    doc.setDrawColor(0);
    doc.rect(marginL - 2, 3, 200, 285);
    doc.setLineWidth(0.2);

    // --- CABECERA ---
    try {
        const logoImg = "/img/logo-color.png";
        doc.addImage(logoImg, "PNG", marginL + 5, 8, 45, 12);
    } catch (e) {
        console.error("Error cargando logo", e);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("MUESTRA:", marginL + 54, 10);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("SANGRE", marginL + 54, 14);
    doc.rect(marginL + 67, 11.5, 4, 3); // Checkbox Sangre
    doc.text("ORINA", marginL + 54, 18);
    doc.rect(marginL + 67, 15.5, 4, 3); // Checkbox Orina
    doc.text("HECES", marginL + 54, 22);
    doc.rect(marginL + 67, 19.5, 4, 3); // Checkbox Heces

    // Cuadro de tiempos
    doc.setLineWidth(0.2);
    doc.rect(marginL + 73, 10, 48, 15);
    doc.line(marginL + 73, 15, marginL + 121, 15);
    doc.line(marginL + 73, 20, marginL + 121, 20);
    doc.line(marginL + 108, 10, marginL + 108, 25);

    doc.setFontSize(5.5);
    doc.text("HORA DE TOMA DE MUESTRA", marginL + 74, 13);
    doc.text("HORA DE INICIO DE PROCESO", marginL + 74, 18);
    doc.text("HORA DE TERMINO DE PROCESO", marginL + 74, 23);

    // Código
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("CÓDIGO", marginL + 123, 17);
    doc.setLineWidth(0.5);
    doc.rect(marginL + 137, 11, 26, 11);
    doc.setFontSize(20);
    doc.text(String(datos.orden || ""), marginL + 138, 18);

    // Dynamic BM Box (Top Right)
    const displayColor = (datos.codigoColor?.trim() ? datos.codigoColor.trim() : finalConfig.defaultColor);
    const displayText = (datos.textoColor?.trim() ? datos.textoColor.trim().toUpperCase() : finalConfig.defaultText);

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
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");

    doc.text("T. EXAMEN:", marginL + 5, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(String(datos.examen || ""), marginL + 24, currentY);
    doc.line(marginL + 24, currentY + 0.5, marginL + 55, currentY + 0.5);

    const lineHeight = 4;
    // ================= NOMBRES Y APELLIDOS =================
    //currentY += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("NOMBRES Y APELLIDOS:", marginL + 57, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);


    const nombresTexto = String(datos.nombres || "NOMBRE NO ESPECIFICADO");
    const nombresMaxWidth = 93;

    let nombresLines;

    // Si excede de 2 líneas, ampliar solo la primera
    if (doc.splitTextToSize(nombresTexto, nombresMaxWidth).length > 2) {

        const primeraLinea = doc.splitTextToSize(nombresTexto, 95)[0];

        const restoTexto = nombresTexto
            .substring(primeraLinea.length)
            .trim();

        const restoLineas = doc.splitTextToSize(
            restoTexto,
            nombresMaxWidth
        );

        nombresLines = [primeraLinea, ...restoLineas];

    } else {

        nombresLines = doc.splitTextToSize(
            nombresTexto,
            nombresMaxWidth
        );

    }

    const nombresX = marginL + 57 + 40;
    const nombresY = currentY;

    // Reducir fuente si tiene muchas líneas
    if (nombresLines.length > 2) {
        doc.setFontSize(7.5);
    }

    const nombresExtraLines = nombresLines.length - 1;

    nombresLines.forEach((line, index) => {

        const lineY = nombresY + (index * lineHeight);

        doc.text(line, nombresX, lineY);

        doc.line(
            nombresX,
            lineY + 0.5,
            nombresX + nombresMaxWidth,
            lineY + 0.5
        );

    });

    // Ajustar currentY para lo que siga debajo
    currentY += nombresExtraLines * lineHeight;



    // ================= EMPRESA =================
    currentY += 5;
    const baseY = currentY; // <- posición fija de toda la fila

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("EMPRESA:", marginL + 5, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);

    const empresaTexto = String(datos.empresa || "EMPRESA NO ESPECIFICADA");
    const empresaMaxWidth = 165; // Ancho máximo para empresa
    let empresaLines = doc.splitTextToSize(empresaTexto, empresaMaxWidth);

    const empresaX = marginL + 25; // Posición X específica para empresa (movida a la izquierda)
    const empresaY = currentY;

    // Reducir fuente si pasa de 3 líneas
    if (empresaLines.length > 2) {
        doc.setFontSize(7.5); // Reducir de 9 a 8
    }

    empresaLines.forEach((line, index) => {
        // Calcular Y para que la última línea esté en empresaY y las anteriores arriba
        const lineY = empresaY + (index * lineHeight);
        doc.text(line, empresaX, lineY);
        doc.line(empresaX, lineY + 1, empresaX + empresaMaxWidth, lineY + 1);
    });

    // CUÁNTO CRECIÓ EMPRESA
    const empresaHeight = (empresaLines.length - 1) * lineHeight;

    // MOVER currentY
    currentY += empresaHeight;


    // ================= CONTRATA ================= 
    currentY += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("CONTRATA:", marginL + 5, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);

    const contrataTexto = String(datos.contrata || "N/A");
    const contrataMaxWidth = 165;

    let contrataLines = doc.splitTextToSize(contrataTexto, contrataMaxWidth);

    const contrataX = marginL + 25;
    const contrataY = currentY;

    if (contrataLines.length > 2) {
        doc.setFontSize(7.5);
    }

    contrataLines.forEach((line, index) => {
        const lineY = contrataY + (index * lineHeight);
        doc.text(line, contrataX, lineY);
        doc.line(contrataX, lineY + 1, contrataX + contrataMaxWidth, lineY + 1);
    });

    // CRECER currentY
    const contrataHeight = (contrataLines.length - 1) * lineHeight;

    currentY += contrataHeight;

    // const maxExtraLines = Math.max(
    //     empresaHeight,
    //     contrataHeight
    // );

    // currentY += maxExtraLines * lineHeight;

    currentY += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("CARGO:", marginL + 5, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(String(datos.cargo || ""), marginL + 19, currentY);
    doc.line(marginL + 19, currentY + 0.5, marginL + 120, currentY + 0.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("EDAD:", marginL + 122, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(String(datos.edad || ""), marginL + 133, currentY);
    doc.text("Años", marginL + 140, currentY);
    doc.line(marginL + 133, currentY + 0.5, marginL + 138, currentY + 0.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("FECHA:", marginL + 158, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(formatearFecha(datos.fecha) || "", marginL + 173, currentY);
    doc.line(marginL + 173, currentY + 0.5, marginL + 190, currentY + 0.5);

 
    // Checkboxes (T.ALTURA, PSICO, etc.)
    currentY += 5;
    const cbXStart = marginL + 5;
    const cbLabels = ["T.ALTURA", "PSICO", "M. A.", "MET. P.", "Pb", "T. CAL"];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    let x = cbXStart;

    cbLabels.forEach((label, i) => {
        doc.text(label, x, currentY);
        const textWidth = doc.getTextWidth(label);
        const boxX = x + textWidth + 2;
        doc.rect(boxX, currentY - 3, 5, 4);

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
            doc.text("X", boxX + 1.5, currentY - 0.2);
            doc.setTextColor(0);
        }

        x = boxX + 10;
    });

    // --- TABLAS DE RESULTADOS ---
    currentY += 7;
    const tableTop = currentY;
    const col1Width = 100;
    const col2Width = 90;

    // Columna Izquierda
    doc.setFillColor(253, 233, 174); // Light orange/yellow for header
    doc.rect(marginL + 5, currentY, col1Width - 5, 5, 'FD');
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("PRUEBA", marginL + 13, currentY + 3.5);
    doc.line(marginL + 33, currentY, marginL + 33, currentY + 5);
    doc.text("RESULTADOS DE ANALISIS CLÍNICOS", marginL + 38, currentY + 3.5);

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
        doc.setLineWidth(0.3);
        doc.rect(marginL + 5, yL, 28, row.h);
        doc.rect(marginL + 33, yL, col1Width - 33, row.h);

        const lines = doc.splitTextToSize(row.label, 28);
        doc.text(lines, marginL + 19, yL + (row.h / 2), { align: "center", baseline: "middle" });

        if (row.sub) {
            if (row.label === "Hb y Hto") {
                doc.text(row.sub[0], marginL + 36, yL + 4);
                doc.line(marginL + 64, yL, marginL + 64, yL + 6);
                doc.text(row.sub[1], marginL + 65, yL + 4);
            } else if (row.label === "RECUENTO\nDIFERENCIAL") {
                doc.text(row.sub[0], marginL + 34, yL + 4);
                doc.text(row.sub[1], marginL + 56, yL + 4);
                doc.text(row.sub[2], marginL + 76, yL + 4);
                doc.text(row.sub[3], marginL + 34, yL + 10);
                doc.text(row.sub[4], marginL + 54, yL + 10);
                doc.text(row.sub[5], marginL + 71, yL + 10);
                doc.text(row.sub[6], marginL + 86, yL + 10);

                doc.line(marginL + 55, yL, marginL + 55, yL + 6);       //NEUT
                doc.line(marginL + 75, yL, marginL + 75, yL + 6);
                doc.line(marginL + 33, yL + 6, marginL + 100, yL + 6);
                doc.line(marginL + 53, yL + 6, marginL + 53, yL + 12);  //MON
                doc.line(marginL + 70, yL + 6, marginL + 70, yL + 12);  //EOS
                doc.line(marginL + 85, yL + 6, marginL + 85, yL + 12);  //BAS
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
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(label, marginL + 106, yR + 4);
        yR += 6;
    });

    // P. HEPATICO
    doc.rect(marginL + 105, yR, col2Width - 5, 11);
    doc.setLineWidth(0.3);
    doc.line(marginL + 140, yR, marginL + 140, yR + 11);
    doc.text("D:", marginL + 141, yR + 3.5);
    doc.text("Ph:", marginL + 165, yR + 3.5);

    doc.setFont("helvetica", "bold");
    doc.text("P. HEPÁTICO", marginL + 106, yR + 8);
    doc.line(marginL + 164, yR + 5, marginL + 164, yR + 11);
    doc.text("GGT:", marginL + 165, yR + 8.5);
    doc.line(marginL + 105, yR + 5, marginL + 190, yR + 5);

    // --- COMENTARIOS ---
    currentY = yL + 3;
    doc.setLineWidth(0.4);
    doc.rect(marginL + 5, currentY, 185, 30);
    // doc.roundedRect(marginL + 5, currentY, 190, 30, 1.5, 1.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("COMENTARIOS", marginL + 8, currentY + 5);
    doc.setLineWidth(0.3);
    doc.line(marginL + 8, currentY + 6, marginL + 30, currentY + 6);

    doc.setLineWidth(0.4);
    doc.text("• FAM. DIABÉTICO :", marginL + 8, currentY + 11);
    doc.line(marginL + 38, currentY + 11.5, marginL + 100, currentY + 11.5);
    doc.text("• MEDICAMENTO :", marginL + 8, currentY + 18);
    doc.line(marginL + 38, currentY + 18.5, marginL + 100, currentY + 18.5);
    doc.text("• P. MENSTRUAL :", marginL + 8, currentY + 25);
    doc.line(marginL + 38, currentY + 25.5, marginL + 100, currentY + 25.5);

    doc.rect(marginL + 105, currentY + 2, 83, 26);
    doc.text("• L       :", marginL + 108, currentY + 9);
    doc.line(marginL + 120, currentY + 9.5, marginL + 148, currentY + 9.5);
    doc.text("• CEL  :", marginL + 108, currentY + 14);
    doc.line(marginL + 120, currentY + 14.5, marginL + 148, currentY + 14.5);
    doc.text("• CRIST   :", marginL + 108, currentY + 19);
    doc.line(marginL + 124, currentY + 19.5, marginL + 186, currentY + 19.5);
    doc.text("• OTROS :", marginL + 108, currentY + 24);
    doc.line(marginL + 124, currentY + 24.5, marginL + 186, currentY + 24.5);

    doc.text("• H      :", marginL + 152, currentY + 9);
    doc.line(marginL + 163, currentY + 9.5, marginL + 186, currentY + 9.5);
    doc.text("• BAC :", marginL + 152, currentY + 14);
    doc.line(marginL + 163, currentY + 14.5, marginL + 186, currentY + 14.5);


    // --- FIRMAS ---
    currentY += 35;
    doc.setLineWidth(0.8);
    doc.setDrawColor(0, 51, 102); // Dark blue for the signature box
    doc.rect(marginL + 5, currentY, 185, 35);
    doc.setDrawColor(0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("FIRMA:", marginL + 10, currentY + 5);
    doc.text("FIRMA:", marginL + 105, currentY + 5);

    doc.setLineWidth(0.4);
    doc.line(marginL + 24, currentY + 28, marginL + 86, currentY + 28);
    doc.text("RESPONSABLE DE TOMA DE MUESTRA", marginL + 24, currentY + 32);

    doc.line(marginL + 115, currentY + 28, marginL + 175, currentY + 28);
    doc.text("RESPONSABLE DE PROCESO", marginL + 121, currentY + 32);
};

export default hojaTomaMuestra;
