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
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");

    doc.text("T. EXAMEN:", marginL + 5, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(String(datos.examen || ""), marginL + 22, currentY);
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
};

export default hojaTomaMuestra;
