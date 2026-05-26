
import jsPDF from "jspdf";
import { formatearFechaCorta, formatearHora } from "../../utils/formatDateUtils.js";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import { dibujarFirmas } from '../../utils/dibujarFirmas.js';

export default async function CertificadoExposicionAlCalor(data = {}, docExistente = null) {
    const d = data;
    const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // DATOS DEL FORMULARIO
    const datosFinales = {
        numeroFicha: String(d.norden ?? ""),
        tipoExamen: String(d.nombreExamen ?? ""),
        apellidosNombres: String((d.apellidosPaciente ?? "") + " " + (d.nombres ?? "")).trim(),
        documentoIdentidad: String(d.dni ?? ""),
        genero: d.sexo === "M" ? "MASCULINO" : d.sexo === "F" ? "FEMENINO" : String(d.sexo ?? ""),
        edad: String(d.edad ?? ""),
        grupoSanguineo: String(d.grupoFactor ?? ""),
        empresa: String(d.empresa ?? ""),
        contratista: String(d.contrata ?? ""),
        puestoPostula: String(d.cargoDesempenar ?? ""),
        ocupacionActual: String(d.ocupacion ?? ""),
        areaTrabajo: String(d.areaPaciente ?? ""),
        fechaExamen: formatearFechaCorta(d.fecha ?? ""),
        sede: d.sede || d.nombreSede || "",
        codigoColor: d.codigoColor || "",
        textoColor: d.textoColor || "",
        cmp: d.cmpUsuario || "",
        medicoEvaluador: d.nombre_medico || "",
        lugar: d.lugar || "",
        hora: formatearHora(d.hora || ""),
        esApto: d.esApto ?? false,
        aptoRestriccion: d.aptoRestriccion ?? false,
        noEsApto: d.noEsApto ?? false,
        observaciones: d.observaciones || "",
        restricciones: d.restricciones || "",
        estadoCivil: String(d.estadoCivilPaciente || d.estadoCivil || ""),
        lugarNacimiento: String(d.lugarNacimientoPaciente || d.lugarNacimiento || ""),
        fechaNacimiento: formatearFechaCorta(d.fechaNacimientoPaciente || d.fechaNacimiento || ""),
        nivelEstudio: String(d.nivelEstudioPaciente || d.nivelEstudios || ""),

        signosVitalesResultados: d.signosVitalesResultados || "",
        signosVitalesObservaciones: d.signosVitalesObservaciones || "",
        sistemaCardiovascularResultados: d.sistemaCardiovascularResultados || "",
        sistemaCardiovascularObservaciones: d.sistemaCardiovascularObservaciones || "",
        sistemaRespiratorioResultados: d.sistemaRespiratorioResultados || "",
        sistemaRespiratorioObservaciones: d.sistemaRespiratorioObservaciones || "",
        estadoNeurologicoResultados: d.estadoNeurologicoResultados || "",
        estadoNeurologicoObservaciones: d.estadoNeurologicoObservaciones || "",
        estadoHidratacionResultados: d.estadoHidratacionResultados || "",
        estadoHidratacionObservaciones: d.estadoHidratacionObservaciones || "",
        toleranciaCalorResultados: d.toleranciaCalorResultados || "",
        toleranciaCalorObservaciones: d.toleranciaCalorObservaciones || "",
        sudoracionResultados: d.sudoracionResultados || "",
        sudoracionObservaciones: d.sudoracionObservaciones || "",
    };

    // VARIABLES DE CONTROL DE PÁGINAS
    let numeroPagina = 1;

    const getFooterOffset = () => {
        return numeroPagina === 1 ? 13 : 8;
    };

    const dibujarFooterEnPaginaActual = () => {
        footerTR(doc, { footerOffsetY: getFooterOffset() });
    };

    const crearNuevaPagina = async () => {
        doc.addPage();
        numeroPagina++;
        await drawHeader(numeroPagina);
        return 38;
    };

    // FUNCIÓN HEADER
    const drawHeader = async (pagNum) => {
        await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

        doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(0, 0, 0);
        doc.text("Nro de ficha: ", pageW - 80, 15);
        doc.setFont("helvetica", "normal").setFontSize(18);
        doc.text(datosFinales.numeroFicha, pageW - 50, 16);
        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text("Sede: " + datosFinales.sede, pageW - 80, 20);
        doc.text("Fecha de examen: " + (datosFinales.fechaExamen || ""), pageW - 80, 25);
        doc.text(`Pag. ${pagNum.toString().padStart(2, '0')}`, pageW - 30, 10);

        drawColorBox(doc, {
            color: datosFinales.codigoColor,
            text: datosFinales.textoColor,
            x: pageW - 30,
            y: 10,
            size: 22,
            showLine: true,
            fontSize: 30,
            textPosition: 0.9,
        });
    };

    //DIBUJAR HEADER INICIAL
    await drawHeader(numeroPagina);

    // CONFIGURACIÓN DE TABLA
    const TX = 15;
    const TW = pageW - 30;
    const FH = 5.2;
    const LW = 0.3;
    const FST = 8.5;
    const ESPACIADO_TEXTO = 3.5;
    const PADDING_CELDA = 2.5;

    //ALTURAS MÍNIMAS POR FILA DE EVALUACIÓN

    const ALTURAS_EVAL = [28, 22, 18, 30, 15, FH, FH];

    const getYCentrado = (yRow) => yRow + (FH / 2) + 1.2;

    const drawCell = (label, value, x, w, yRow, divider = false) => {
        if (divider) {
            doc.setDrawColor(0, 0, 0).setLineWidth(LW);
            doc.line(x, yRow, x, yRow + FH);
        }
        const yCentrado = getYCentrado(yRow);
        doc.setFont("helvetica", "bold").setFontSize(FST);
        const labelWidth = doc.getTextWidth(label);
        doc.text(label, x + 2, yCentrado);

        doc.setFont("helvetica", "normal").setFontSize(FST);
        if (value) {
            doc.text(String(value), x + 2 + labelWidth + 2, yCentrado);
        }
    };

    const drawFullRow = (label, value, x, w, yRow) => {
        doc.rect(x, yRow, w, FH);
        const yCentrado = getYCentrado(yRow);
        doc.setFont("helvetica", "bold").setFontSize(FST);
        const labelWidth = doc.getTextWidth(label);
        doc.text(label, x + 2, yCentrado);

        doc.setFont("helvetica", "normal").setFontSize(FST);
        if (value) {
            doc.text(String(value), x + 2 + labelWidth + 2, yCentrado);
        }
    };

    const drawRowWithTwoValues = (labelLeft, valueLeft, labelRight, valueRight, x, w, yRow, col3X) => {
        doc.rect(x, yRow, w, FH);
        doc.line(col3X - 2, yRow, col3X - 2, yRow + FH);

        const yCentrado = getYCentrado(yRow);

        doc.setFont("helvetica", "bold").setFontSize(FST);
        const labelLeftWidth = doc.getTextWidth(labelLeft);
        doc.text(labelLeft, x + 2, yCentrado);

        doc.setFont("helvetica", "normal").setFontSize(FST);
        if (valueLeft) {
            doc.text(String(valueLeft), x + 2 + labelLeftWidth + 2, yCentrado);
        }

        doc.setFont("helvetica", "bold").setFontSize(FST);
        const labelRightWidth = doc.getTextWidth(labelRight);
        doc.text(labelRight, col3X, yCentrado);

        doc.setFont("helvetica", "normal").setFontSize(FST);
        if (valueRight) {
            doc.text(String(valueRight), col3X + labelRightWidth + 2, yCentrado);
        }
    };

    const dibujarTextoDesdeArriba = (texto, x, y, anchoMaximo, interlineado = 3.5) => {
        if (!texto || texto.trim() === "") return y;

        const lineas = doc.splitTextToSize(texto, anchoMaximo - 4);
        let yActual = y + 3;

        lineas.forEach((linea) => {
            doc.text(linea, x + 2, yActual);
            yActual += interlineado;
        });

        return yActual;
    };

    const calcularAlturaTexto = (texto, anchoMaximo, interlineado = 3.5) => {
        if (!texto || texto.trim() === "") return FH;
        const lineas = doc.splitTextToSize(texto, anchoMaximo - 4);
        return Math.max(FH, lineas.length * interlineado + 4);
    };

    const drawFullRowDynamic = (label, value, x, w, yRow) => {
        const texto = String(value || "");

        doc.setFont("helvetica", "bold").setFontSize(FST);
        const labelWidth = doc.getTextWidth(label);

        const anchoDisponible = w - (labelWidth + 8);

        doc.setFont("helvetica", "normal").setFontSize(FST);

        const lineas = doc.splitTextToSize(texto, anchoDisponible);

        const alturaTexto = lineas.length * ESPACIADO_TEXTO + 4;

        const alturaFila = Math.max(FH, alturaTexto);

        doc.rect(x, yRow, w, alturaFila);

        const yTexto = yRow + 4;

        // LABEL
        doc.setFont("helvetica", "bold").setFontSize(FST);
        doc.text(label, x + 2, yTexto);

        // VALUE
        doc.setFont("helvetica", "normal").setFontSize(FST);

        let yLine = yTexto;

        lineas.forEach((linea) => {
            doc.text(linea, x + 2 + labelWidth + 2, yLine);
            yLine += ESPACIADO_TEXTO;
        });

        return alturaFila;
    };

    let y = 38;

    // TÍTULO 
    doc.setFont("helvetica", "bold").setFontSize(14).setTextColor(0, 0, 0);
    doc.text("CERTIFICADO DE SUFICIENCIA MÉDICA", pageW / 2, y, { align: "center" });
    y += 6;
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("TRABAJOS EN ÁREAS CON EXPOSICIÓN AL CALOR Y VAPOR", pageW / 2, y, { align: "center" });
    y += 4;

    // I. DATOS PERSONALES
    doc.setFillColor(196, 196, 196);
    doc.setDrawColor(0, 0, 0).setLineWidth(LW);
    doc.rect(TX, y, TW, FH, "FD");
    doc.setFont("helvetica", "bold").setFontSize(FST);
    doc.text("I.- DATOS PERSONALES", TX + 2, getYCentrado(y));
    y += FH;

    drawFullRow("Apellidos y Nombres:", datosFinales.apellidosNombres, TX, TW, y);
    y += FH;

    const c1w = TW / 3, c2w = TW / 3, c3w = TW / 3;
    doc.rect(TX, y, TW, FH);
    doc.line(TX + c1w, y, TX + c1w, y + FH);
    doc.line(TX + c1w + c2w, y, TX + c1w + c2w, y + FH);
    drawCell("DNI:", datosFinales.documentoIdentidad, TX, c1w, y);
    drawCell("Edad:", datosFinales.edad + " AÑOS", TX + c1w, c2w, y, true);
    drawCell("Sexo:", datosFinales.genero, TX + c1w + c2w, c3w, y, true);
    y += FH;

    doc.rect(TX, y, TW, FH);
    doc.line(TX + c1w, y, TX + c1w, y + FH);
    doc.line(TX + c1w + c2w, y, TX + c1w + c2w, y + FH);
    drawCell("Estado Civil:", datosFinales.estadoCivil, TX, c1w, y);
    drawCell("Tipo Examen:", datosFinales.tipoExamen, TX + c1w, c2w, y, true);
    drawCell("Fecha Nacimiento:", datosFinales.fechaNacimiento, TX + c1w + c2w, c3w, y, true);
    y += FH;

    const lnw = (TW / 3) * 2;
    doc.rect(TX, y, TW, FH);
    doc.line(TX + lnw, y, TX + lnw, y + FH);
    drawCell("Lugar de Nacimiento:", datosFinales.lugarNacimiento, TX, lnw, y);
    drawCell("Nivel de Estudio:", datosFinales.nivelEstudio, TX + lnw, TW / 3, y, true);
    y += FH;

    drawFullRow("Ocupación:", datosFinales.ocupacionActual, TX, TW, y);
    y += FH;

    drawFullRow("Cargo:", datosFinales.puestoPostula, TX, TW, y);
    y += FH;

    drawFullRow("Área:", datosFinales.areaTrabajo, TX, TW, y);
    y += FH;

    // drawFullRow("Empresa:", datosFinales.empresa, TX, TW, y);
    // y += FH;

    // drawFullRow("Contrata:", datosFinales.contratista, TX, TW, y);
    // y += FH;

    const alturaEmpresa = drawFullRowDynamic(
        "Empresa:",
        datosFinales.empresa,
        TX,
        TW,
        y
    );

    y += alturaEmpresa;

    const alturaContrata = drawFullRowDynamic(
        "Contrata:",
        datosFinales.contratista,
        TX,
        TW,
        y
    );

    y += alturaContrata;


    const col3X = TX + c1w + c2w + 6;

    drawFullRow("Médico Evaluador:", datosFinales.medicoEvaluador, TX, TW, y);
    y += FH;

    drawRowWithTwoValues("CMP:", datosFinales.cmp, "Hora:", datosFinales.hora, TX, TW, y, col3X);
    y += FH + 4;

    // II. EVALUACIÓN CLÍNICA Y OCUPACIONAL

    const structuraBase = [
        "Signos Vitales",
        "Sistema Cardiovascular",
        "Sistema Respiratorio",
        "Estado Neurológico",
        "Estado de Hidratación",
        "Tolerancia al Calor",
        "Sudoración / Termorregulación"
    ];

    // Combina estructura fija con datos del endpoint
    const evalItems = [
        {
            name: "Signos Vitales",
            resultado: d.signosVitalesResultados || "",
            observaciones: d.signosVitalesObservaciones || "",
            simple: false
        },
        {
            name: "Sistema Cardiovascular",
            resultado: d.sistemaCardiovascularResultados || "",
            observaciones: d.sistemaCardiovascularObservaciones || "",
            simple: false
        },
        {
            name: "Sistema Respiratorio",
            resultado: d.sistemaRespiratorioResultados || "",
            observaciones: d.sistemaRespiratorioObservaciones || "",
            simple: false
        },
        {
            name: "Estado Neurológico",
            resultado: d.estadoNeurologicoResultados || "",
            observaciones: d.estadoNeurologicoObservaciones || "",
            simple: false
        },
        {
            name: "Estado de Hidratación",
            resultado: d.estadoHidratacionResultados || "",
            observaciones: d.estadoHidratacionObservaciones || "",
            simple: false
        },
        {
            name: "Tolerancia al Calor",
            resultado: d.toleranciaCalorResultados || "",
            observaciones: d.toleranciaCalorObservaciones || "",
            simple: false
        },
        {
            name: "Sudoración / Termorregulación",
            resultado: d.sudoracionResultados || "",
            observaciones: d.sudoracionObservaciones || "",
            simple: false
        }
    ];

    const evCol1 = TW * 0.45;
    const evCol2 = TW * 0.25;
    const evCol3 = TW - evCol1 - evCol2;

    const calcularAlturaDinamica = (texto, anchoMaximo, esSimple = false) => {
        if (esSimple) return FH;
        if (!texto || texto.trim() === "") return FH;
        doc.setFont("helvetica", "normal").setFontSize(FST);
        const lineas = doc.splitTextToSize(texto, anchoMaximo - 4);
        const alturaTexto = lineas.length * ESPACIADO_TEXTO;
        return Math.max(FH, alturaTexto + PADDING_CELDA * 2);
    };

    doc.setFillColor(196, 196, 196);
    doc.setDrawColor(0, 0, 0).setLineWidth(LW);
    doc.rect(TX, y, TW, FH, "FD");
    doc.setFont("helvetica", "bold").setFontSize(FST);
    doc.text("II. EVALUACIÓN CLÍNICA Y OCUPACIONAL", TX + 2, getYCentrado(y));
    y += FH;

    doc.rect(TX, y, TW, FH);
    doc.line(TX + evCol1, y, TX + evCol1, y + FH);
    doc.line(TX + evCol1 + evCol2, y, TX + evCol1 + evCol2, y + FH);
    doc.setFont("helvetica", "bold").setFontSize(FST);
    doc.text("Evaluación", TX + 2, getYCentrado(y));
    doc.text("Resultado", TX + evCol1 + 2, getYCentrado(y));
    doc.text("Observaciones", TX + evCol1 + evCol2 + 2, getYCentrado(y));
    y += FH;

    for (let index = 0; index < evalItems.length; index++) {
        const item = evalItems[index];

        const alturaResultado = calcularAlturaDinamica(item.resultado, evCol2, item.simple);
        const alturaObservaciones = calcularAlturaDinamica(item.observaciones, evCol3, item.simple);
        // Aca es pa la altura mínima definida por fila, pq crece si el texto lo requiere oki?
        const alturaMinima = ALTURAS_EVAL[index];
        const alturaFila = Math.max(alturaMinima, alturaResultado, alturaObservaciones);

        doc.rect(TX, y, TW, alturaFila);
        doc.line(TX + evCol1, y, TX + evCol1, y + alturaFila);
        doc.line(TX + evCol1 + evCol2, y, TX + evCol1 + evCol2, y + alturaFila);

        doc.setFont("helvetica", "normal").setFontSize(FST);
        doc.text(item.name, TX + 2, y + alturaFila / 2 + 1.5);

        dibujarTextoDesdeArriba(item.resultado, TX + evCol1, y, evCol2, ESPACIADO_TEXTO);
        dibujarTextoDesdeArriba(item.observaciones, TX + evCol1 + evCol2, y, evCol3, ESPACIADO_TEXTO);

        y += alturaFila;
    }

    y += 6;

    // FOOTER DE PÁGINA 1
    dibujarFooterEnPaginaActual();

    // CREAR PÁGINA 2 PARA CONCLUSIONES Y RECOMENDACIONES
    y = await crearNuevaPagina();

    //CONCLUSIÓN DE APTITUD

    const conclusiones = [
        { label: "APTO", desc: "Puede realizar trabajos con exposición al calor.", key: "esApto" },
        { label: "APTO CON RESTRICCIONES", desc: "Debe cumplir medidas preventivas específicas.", key: "aptoRestriccion" },
        { label: "NO APTO", desc: "No apto para trabajos con exposición al calor y vapor.", key: "noEsApto" },
    ];

    doc.setFillColor(196, 196, 196);
    doc.setDrawColor(0, 0, 0).setLineWidth(LW);
    doc.rect(TX, y, TW, FH, "FD");
    doc.setFont("helvetica", "bold").setFontSize(FST);
    doc.text("III. CONCLUSIÓN DE APTITUD", TX + 2, getYCentrado(y));
    y += FH;

    doc.rect(TX, y, TW, FH);
    doc.setFont("helvetica", "normal").setFontSize(FST);
    doc.text("Luego de la evaluación médica ocupacional realizada, el trabajador es declarado:", TX + 2, getYCentrado(y));
    y += FH;

    const cbColW = TW * 0.35;
    const descColW = TW - cbColW;
    const cbSz = 3.5;

    conclusiones.forEach(item => {
        const alturaDesc = calcularAlturaTexto(item.desc, descColW, 4);
        const alturaFila = Math.max(FH, alturaDesc);

        doc.rect(TX, y, TW, alturaFila);
        doc.line(TX + cbColW, y, TX + cbColW, y + alturaFila);

        const checkX = TX + 2;
        const checkY = y + (alturaFila - cbSz) / 2;
        doc.rect(checkX, checkY, cbSz, cbSz);

        if (datosFinales[item.key]) {
            doc.setFont("helvetica", "bold").setFontSize(7);
            const xCentered = checkX + (cbSz / 2) - (doc.getTextWidth("X") / 2);
            const yCentered = checkY + (cbSz / 2) + 1;
            doc.text("X", xCentered, yCentered);
        }

        doc.setFont("helvetica", "bold").setFontSize(FST);
        doc.text(item.label, TX + 2 + cbSz + 2, y + alturaFila / 2 + 1.5);

        doc.setFont("helvetica", "normal").setFontSize(FST);
        const descLines = doc.splitTextToSize(item.desc, descColW - 4);
        const descStartY = y + (alturaFila - descLines.length * 4) / 2 + 3.5;
        descLines.forEach((line, i) => {
            doc.text(line, TX + cbColW + 2, descStartY + i * 4);
        });

        y += alturaFila;
    });

    // OBSERVACIONES
    const textoObservaciones = datosFinales.observaciones || "";
    const lineasObs = doc.splitTextToSize(textoObservaciones, TW - 4);
    const alturaObsTexto = lineasObs.length * 4 + 8;
    const alturaFilaObs = Math.max(FH * 2, alturaObsTexto);

    doc.rect(TX, y, TW, alturaFilaObs);
    doc.setFont("helvetica", "bold").setFontSize(FST);
    doc.text("Observaciones:", TX + 2, y + 4);

    doc.setFont("helvetica", "normal").setFontSize(FST);
    let yObs = y + 8;
    lineasObs.forEach(line => {
        doc.text(line, TX + 2, yObs);
        yObs += 4;
    });

    y += alturaFilaObs + 8;

    // IV. RECOMENDACIONES

    doc.setFillColor(196, 196, 196);
    doc.setDrawColor(0, 0, 0).setLineWidth(LW);
    doc.rect(TX, y, TW, FH, "FD");
    doc.setFont("helvetica", "bold").setFontSize(FST);
    doc.text("IV. RECOMENDACIONES", TX + 2, getYCentrado(y));
    y += FH;

    const recomendaciones = [
        "- Mantener adecuada hidratación antes, durante y después de la jornada laboral.",
        "- Realizar pausas activas y descansos programados.",
        "- Uso obligatorio de EPP adecuado.",
        "- Monitoreo periódico de signos de fatiga térmica.",
        "- Capacitación en prevención de estrés térmico."
    ];

    let alturaRecomendaciones = 0;
    recomendaciones.forEach(rec => {
        const lineas = doc.splitTextToSize(rec, TW - 8);
        alturaRecomendaciones += lineas.length * 4;
    });
    alturaRecomendaciones += 4;

    const alturaFilaRecomendaciones = Math.max(FH * 2, alturaRecomendaciones);

    doc.rect(TX, y, TW, alturaFilaRecomendaciones);
    let yRec = y + 4;
    recomendaciones.forEach(rec => {
        const lineas = doc.splitTextToSize(rec, TW - 8);
        lineas.forEach(linea => {
            doc.setFont("helvetica", "normal").setFontSize(FST);
            doc.text(linea, TX + 4, yRec);
            yRec += 4;
        });
    });
    y += alturaFilaRecomendaciones + 8;

    // V. RESTRICCIONES
    doc.setFillColor(196, 196, 196);
    doc.setDrawColor(0, 0, 0).setLineWidth(LW);
    doc.rect(TX, y, TW, FH, "FD");
    doc.setFont("helvetica", "bold").setFontSize(FST);
    doc.text("V. RESTRICCIONES", TX + 2, getYCentrado(y));
    y += FH;


    // const alturaFilaRestricciones = FH * 4;
    // doc.rect(TX, y, TW, alturaFilaRestricciones);
    // y += alturaFilaRestricciones + 12;

    const textoRestricciones = datosFinales.restricciones || "";

    const lineasRestricciones = doc.splitTextToSize(
        textoRestricciones,
        TW - 4
    );

    const alturaRestriccionesTexto =
        lineasRestricciones.length * 4 + 8;

    const alturaFilaRestricciones = Math.max(
        FH * 4,
        alturaRestriccionesTexto
    );

    doc.rect(TX, y, TW, alturaFilaRestricciones);

    doc.setFont("helvetica", "normal").setFontSize(FST);

    let yRestric = y + 8;

    lineasRestricciones.forEach(line => {
        doc.text(line, TX + 2, yRestric);
        yRestric += 4;
    });

    y += alturaFilaRestricciones + 12;

    // VI. FIRMAS
    if (y + 40 > pageH - 25) {
        dibujarFooterEnPaginaActual();
        y = await crearNuevaPagina();
    }

    doc.setFillColor(196, 196, 196);
    doc.setDrawColor(0, 0, 0).setLineWidth(LW);
    y += FH + 4;

    await dibujarFirmas({
        doc,
        datos: d,
        y,
        pageW,
        mostrarFirmaPaciente: true,
    });

    // FOOTER PÁGINA 2
    dibujarFooterEnPaginaActual();

    // SALIDA
    // ✅ CORRECCIÓN 3: Usar docExistente directamente, igual que Thevenon
    if (docExistente) {
        return doc;
    } else {
        imprimir(doc);
    }
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