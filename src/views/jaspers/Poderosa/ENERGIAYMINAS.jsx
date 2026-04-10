import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { getSignCompressed } from "../../utils/helpers.js";
import autoTable from "jspdf-autotable";

// --- Configuración Centralizada ---
const config = {
    margin: 15,
    col1X: 15,
    col2X: 130,
    col3X: 160,
    fontSize: {
        title: 14,
        header: 9,
        body: 9,
    },
    font: 'helvetica',
    lineHeight: 7,
};

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
    if (!fecha) return '';
    if (fecha.includes('/')) return fecha;
    const [anio, mes, dia] = fecha.split('-');
    if (!anio || !mes || !dia) return fecha;
    return `${dia}/${mes}/${anio}`;
};

// Header con datos de ficha, sede y fecha
const drawHeader = async (doc, datos = {}) => {
    const pageW = doc.internal.pageSize.getWidth();

    await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

    // Número de Ficha
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);

    // Sede
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 20);

    // Fecha de examen
    const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || "");
    doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);

    // Página
    doc.text("Pag. 01", pageW - 30, 10);

    // Bloque de color
    drawColorBox(doc, {
        color: datos.codigoColor,
        text: datos.textoColor,
        x: pageW - 30,
        y: 10,
        size: 22,
        showLine: true,
        fontSize: 30,
        textPosition: 0.9
    });
};

// Función para dibujar datos del paciente en tabla
const drawPatientData = (doc, datos = {}) => {
    const tablaInicioX = 15;
    const tablaAncho = 180;
    const filaAltura = 5;
    let yPos = 43;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
    yPos += filaAltura;

    const sexo = datos.sexoPaciente === 'F' ? 'FEMENINO' : datos.sexoPaciente === 'M' ? 'MASCULINO' : '';

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("Nombres y Apellidos:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.nombreCompletoPaciente || datos.nombresPaciente || '', tablaInicioX + 40, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(String(datos.dniPaciente || ''), tablaInicioX + 12, yPos + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text("Edad:", tablaInicioX + 47, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text((datos.edad || '') + " AÑOS", tablaInicioX + 58, yPos + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text("Sexo:", tablaInicioX + 92, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(sexo, tablaInicioX + 105, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("Lugar de Nacimiento:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.lugarNacimientoPaciente || '', tablaInicioX + 38, yPos + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text("Estado Civil:", tablaInicioX + 92, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.estadoCivilPaciente || '', tablaInicioX + 115, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("Tipo Examen:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.tipoExamen || '', tablaInicioX + 28, yPos + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text("Fecha Nac.:", tablaInicioX + 92, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(toDDMMYYYY(datos.fechaNacimientoPaciente || ''), tablaInicioX + 115, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("Nivel de Estudio:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.nivelEstudioPaciente || '', tablaInicioX + 32, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("Ocupación:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.ocupacionPaciente || '', tablaInicioX + 25, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("Cargo:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.cargoPaciente || '', tablaInicioX + 18, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("Área:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.areaPaciente || '', tablaInicioX + 15, yPos + 3.5);
    yPos += filaAltura;

    return yPos;
};

const drawPatientData2 = (doc, datos = {}, y) => {
    const tablaInicioX = 15;
    const tablaAncho = 180;
    const filaAltura = 5;
    let yPos = y;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("DATOS PACIENTES", tablaInicioX + 2, yPos + 3.5);
    yPos += filaAltura;


    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("Peso:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(String(datos.peso || ''), tablaInicioX + 12, yPos + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text("Talla:", tablaInicioX + 47, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(String(datos.talla || ''), tablaInicioX + 58, yPos + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text("Color de Piel:", tablaInicioX + 92, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(String(datos.colorPiel), tablaInicioX + 125, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("Color de Ojos:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.colorOjos || '', tablaInicioX + 38, yPos + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text("Cabello:", tablaInicioX + 92, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(datos.cabello || '', tablaInicioX + 115, yPos + 3.5);
    yPos += filaAltura;

    return yPos;
};

const drawHereditaryFactors = (doc, datos = {}, y) => {
    const tablaInicioX = 15;
    const tablaAncho = 180;
    const filaAltura = 4;
    let yPos = y;

    // ── Geometría de columnas ─────────────────────────────────────
    const sideColW = 8;
    const siNoW = 6;
    const halfW = tablaAncho / 2;
    const dataStartX = tablaInicioX + sideColW;

    const leftZoneW = halfW - sideColW;
    const leftLabelW = leftZoneW - siNoW * 2;
    const leftSiX = dataStartX + leftLabelW;
    const leftNoX = leftSiX + siNoW;

    const rightZoneW = halfW;
    const rightLabelW = rightZoneW - siNoW * 2;
    const rightSiX = tablaInicioX + halfW + rightLabelW;
    const rightNoX = rightSiX + siNoW;

    // ── Items ─────────────────────────────────────────────────────
    const tbcItems = [
        { num: "1.-", label: "Asma", key: "asma" },
        { num: "2.-", label: "Alergias", key: "alergias" },
        { num: "3.-", label: "Bronquitis", key: "bronquitis" },
        { num: "4.-", label: "Pleuresía", key: "pleuresia" },
        { num: "5.-", label: "Neumonía", key: "neumonia" },
        { num: "6.-", label: "Respiración", key: "respiracion" },
        { num: "7.-", label: "Sangre en la Saliva", key: "sangreSaliva" },
        { num: "8.-", label: "Respiración Breve", key: "respiracionBreve" },
        { num: "9.-", label: "Problemas Nasales", key: "problemasNasales" },
        { num: "10.-", label: "T.B.C.", key: "tbc" },
    ];

    const cancerItems = [
        { num: "11.-", label: "Palpitaciones", key: "palpitaciones" },
        { num: "12.-", label: "Ritmo Cardiaco Irregular", key: "ritmoCardiacoIrregular" },
        { num: "13.-", label: "Fallas Cardiacas", key: "fallasCardiacas" },
        { num: "14.-", label: "Desmayos", key: "desmayos" },
        { num: "15.-", label: "Tobillos Hinchados", key: "tobillosHinchados" },
        { num: "16.-", label: "Moretones Anormales", key: "moretonesAnormales" },
        { num: "17.-", label: "Presión Alta", key: "presionAlta" },
        { num: "18.-", label: "Heridas del pecho", key: "heridasPecho" },
        { num: "19.-", label: "Otras enfermedades", key: "otrasEnfermedades" },
    ];

    // ── Helpers ───────────────────────────────────────────────────
    const markSiNo = (val, siX, noX, rowY) => {
        doc.setFont("helvetica", "normal").setFontSize(6.5);
        const cx = val ? siX + siNoW / 2 : noX + siNoW / 2;
        doc.text("X", cx, rowY + filaAltura / 2 + 1, { align: "center" });
    };

    const drawDividers = (rowY, h) => {
        doc.line(leftSiX, rowY, leftSiX, rowY + h);
        doc.line(leftNoX, rowY, leftNoX, rowY + h);
        doc.line(rightSiX, rowY, rightSiX, rowY + h);
        doc.line(rightNoX, rowY, rightNoX, rowY + h);
    };

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // ── Encabezado ────────────────────────────────────────────────
    doc.setFillColor(196, 196, 196);
    doc.rect(dataStartX, yPos, leftZoneW, filaAltura, "FD");
    doc.rect(tablaInicioX + halfW, yPos, rightZoneW, filaAltura, "FD");

    doc.setFont("helvetica", "bold").setFontSize(6.5);
    const hMid = yPos + filaAltura / 2 + 1;
    doc.text("T.B.C.", dataStartX + 1, hMid);
    doc.text("SI", leftSiX + siNoW / 2, hMid, { align: "center" });
    doc.text("NO", leftNoX + siNoW / 2, hMid, { align: "center" });
    doc.text("CANCER PULMONAR", tablaInicioX + halfW + 1, hMid);
    doc.text("SI", rightSiX + siNoW / 2, hMid, { align: "center" });
    doc.text("NO", rightNoX + siNoW / 2, hMid, { align: "center" });

    drawDividers(yPos, filaAltura);
    yPos += filaAltura;

    // ── Columna lateral: solo el rectángulo primero ───────────────
    const maxRows = Math.max(tbcItems.length, cancerItems.length);
    const totalHeight = maxRows * filaAltura;

    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, sideColW, totalHeight, "FD");

    // ── Filas de datos ────────────────────────────────────────────
    for (let i = 0; i < maxRows; i++) {
        const rowY = yPos + i * filaAltura;
        const tbcItem = tbcItems[i];
        const cancerItem = cancerItems[i];

        doc.setFillColor(255, 255, 255);
        doc.rect(dataStartX, rowY, leftZoneW, filaAltura);
        doc.rect(tablaInicioX + halfW, rowY, rightZoneW, filaAltura);
        drawDividers(rowY, filaAltura);

        doc.setFont("helvetica", "normal").setFontSize(6.5);
        if (tbcItem) {
            doc.text(
                tbcItem.num + " " + tbcItem.label,
                dataStartX + 1,
                rowY + filaAltura / 2 + 1
            );
            markSiNo(datos[tbcItem.key], leftSiX, leftNoX, rowY);
        }
        if (cancerItem) {
            doc.text(
                cancerItem.num + " " + cancerItem.label,
                tablaInicioX + halfW + 1,
                rowY + filaAltura / 2 + 1
            );
            markSiNo(datos[cancerItem.key], rightSiX, rightNoX, rowY);
        }
    }

    // ── Texto lateral AL FINAL (encima de todo) ───────────────────
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(
        "FACTORES HEREDITARIOS",
        tablaInicioX + sideColW / 2 + 17,
        yPos + totalHeight / 2 + 16,
        { angle: 90, align: "center" }
    );

    yPos += totalHeight;

    // ── Fila inferior: SITUACIÓN ACTUAL / TOMA ALGUNA MEDICINA ───
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, halfW, filaAltura, "FD");
    doc.rect(tablaInicioX + halfW, yPos, rightZoneW, filaAltura, "FD");

    doc.setFont("helvetica", "bold").setFontSize(6.5);
    const fMid = yPos + filaAltura / 2 + 1;
    doc.text("SITUACIÓN ACTUAL", tablaInicioX + 1, fMid);
    doc.text("FUMA", tablaInicioX + 30, fMid);
    doc.text("TOMA ALGUNA MEDICINA", tablaInicioX + halfW + 1, fMid);

    drawDividers(yPos, filaAltura);
    markSiNo(datos.fuma, leftSiX, leftNoX, yPos);
    markSiNo(datos.tomaAlgunaMedicina, rightSiX, rightNoX, yPos);

    yPos += filaAltura;
    return yPos;
};

const drawDetalles = (doc, datos = {}, y, s1) => {
    const margenX = 15;
    const anchoDoc = 180;
    const colMid = margenX + anchoDoc / 2;
    const maxY = doc.internal.pageSize.getHeight() - 30;
    let yPos = y;

    const lineH = 4;
    const secGap = 2;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // ── Helpers ───────────────────────────────────────────────────
    const bold = (txt, x, y2) => { doc.setFont("helvetica", "bold").setFontSize(7); doc.text(txt, x, y2); };
    const normal = (txt, x, y2) => { doc.setFont("helvetica", "normal").setFontSize(7); doc.text(txt, x, y2); };
    const row = (label, value, x, y2) => {
        bold(label, x, y2);
        normal(String(value ?? ''), x + doc.getTextWidth(label) + 1, y2);
    };
    const writeWrapped = (label, value, x, y2, maxWidth) => {
        bold(label, x, y2);
        doc.setFont("helvetica", "normal").setFontSize(7);
        const labelW = doc.getTextWidth(label) + 3;
        const lines = doc.splitTextToSize(String(value ?? ''), maxWidth - labelW);
        lines.forEach((line, i) => doc.text(line, x + labelW, y2 + i * lineH));
        return lines.length;
    };

    // ── Título DETALLES ───────────────────────────────────────────
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("DETALLES", margenX + anchoDoc / 2, yPos, { align: "center" });
    yPos += lineH;

    // ── EXAMEN MEDICO FECHA ───────────────────────────────────────
    doc.setFont("helvetica", "bold").setFontSize(7.5);
    doc.text("EXAMEN MEDICO FECHA:", margenX, yPos);
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.text(toDDMMYYYY(datos.fechaExamen || ''), margenX + 40, yPos);
    yPos += 1;
    doc.line(margenX, yPos, margenX + anchoDoc, yPos);
    yPos += lineH;

    // ── Columnas izquierda + derecha ──────────────────────────────
    let yLeft = yPos;
    let yRight = yPos;
    let nLines;

    // ── IZQUIERDA ─────────────────────────────────────────────────
    row("1.- Pulso en reposo:", `${datos.pulsoReposo}   B.P.: ${datos.pulsoReposoBp}`, margenX, yLeft);
    yLeft += lineH;

    normal(`Después de 30 flexiones en 60 seg:  ${datos.pulso30flexiones}`, margenX + 3, yLeft);
    yLeft += lineH;

    row("2.- Respiración en reposo:", datos.respiracionReposo, margenX, yLeft);
    yLeft += lineH;

    normal(`Después de 30 flexiones en 60 seg:  ${datos.respiracion30flexiones}`, margenX + 3, yLeft);
    yLeft += lineH;

    row("3.- Obstrucción Nasal:", datos.obstruccionNasal ? "SI [ X ]  NO [   ]" : "SI [   ]  NO [ X ]", margenX, yLeft);
    yLeft += lineH;

    nLines = writeWrapped("4.- Forma del pecho:", datos.formaPecho, margenX, yLeft, anchoDoc / 2);
    yLeft += lineH * nLines;

    nLines = writeWrapped("5.- Expansión del pecho Normal:", datos.expansionPecho, margenX, yLeft, anchoDoc / 2);
    yLeft += lineH * nLines;

    // ── DERECHA ───────────────────────────────────────────────────
    nLines = writeWrapped("6.- Pulmones:", datos.pulmones, colMid, yRight, anchoDoc / 2);
    yRight += lineH * nLines;

    nLines = writeWrapped("7.- Corazón:", datos.corazon, colMid, yRight, anchoDoc / 2);
    yRight += lineH * nLines;

    nLines = writeWrapped("8.- Enfermedades Crónicas:", datos.enfermedadesCronicas, colMid, yRight, anchoDoc / 2);
    yRight += lineH * nLines;

    nLines = writeWrapped("9.- Función pulmonar:", datos.funcionPulmonar, colMid, yRight, anchoDoc / 2);
    yRight += lineH * nLines;

    normal(`a.- FVC: ${datos.fvc}   FEV1: ${datos.fevl}`, colMid + 3, yRight);
    yRight += lineH;

    normal(`b.- Otros:  ${datos.otros}`, colMid + 3, yRight);
    yRight += lineH;

    row("10.-", datos.enForma
        ? "En forma: [ X ]   Fuera de forma: [   ]"
        : "En forma: [   ]   Fuera de forma: [ X ]",
        colMid, yRight);
    yRight += lineH;

    yPos = Math.max(yLeft, yRight) + secGap;

    // ── RAYOS X ───────────────────────────────────────────────────
    doc.line(margenX, yPos, margenX + anchoDoc, yPos);
    yPos += lineH - 1;

    doc.setFont("helvetica", "bold").setFontSize(7.5);
    doc.text("RAYOS X", margenX, yPos);
    yPos += lineH;

    row("Fecha de la placa:", toDDMMYYYY(datos.fechaPlaca || ''), margenX, yPos);
    yPos += lineH;

    let yRXL = yPos;
    let yRXR = yPos;

    // Izquierda RX
    nLines = writeWrapped("1.- Pecho Normal:", datos.pechoNormal, margenX, yRXL, anchoDoc / 2);
    yRXL += lineH * nLines;

    nLines = writeWrapped("2.- T.B.C:", datos.tbcRayosX, margenX, yRXL, anchoDoc / 2);
    yRXL += lineH * nLines;

    nLines = writeWrapped("3.- Pneumoconiosis:", datos.pneumoconiosis, margenX, yRXL, anchoDoc / 2);
    yRXL += lineH * nLines;

    nLines = writeWrapped(`Clasificación de la OIT (1980):`, datos.clasificacionOit, margenX + 3, yRXL, anchoDoc / 2 - 3);
    yRXL += lineH * nLines;

    normal(`Film N° de la placa:  ${datos.filmNumeroPlaca || ''}`, margenX + 3, yRXL);
    yRXL += lineH;

    // Derecha RX
    nLines = writeWrapped("4.- Corazón:", datos.corazonRayosX, colMid, yRXR, anchoDoc / 2);
    yRXR += lineH * nLines;

    nLines = writeWrapped("5.- Otros cambios:", datos.otrosCambios, colMid, yRXR, anchoDoc / 2);
    yRXR += lineH * nLines;

    nLines = writeWrapped("6.- Examen de saliva:", datos.examenSaliva, colMid, yRXR, anchoDoc / 2);
    yRXR += lineH * nLines;

    yPos = Math.max(yRXL, yRXR) + secGap;

    // ── Bloque conclusión ─────────────────────────────────────────
    doc.line(margenX, yPos, margenX + anchoDoc, yPos);
    yPos += lineH;

    nLines = writeWrapped("Pecho Normal:", datos.pechoNormal, margenX, yPos, anchoDoc);
    yPos += lineH * nLines;

    nLines = writeWrapped("Hallazgos anormales:", datos.hallazgosAnormales, margenX, yPos, anchoDoc);
    yPos += lineH * nLines;

    nLines = writeWrapped("Clasificación de la OIT (1980):", datos.clasificacionOit, margenX, yPos, anchoDoc);
    yPos += lineH * nLines;

    nLines = writeWrapped("OPINION CLINICA:", datos.opinionClinica, margenX, yPos, anchoDoc);
    yPos += lineH * nLines + secGap;

    // ── Línea de firma ────────────────────────────────────────────
    const firmaY = Math.min(yPos, maxY - lineH * 2);
    const firmaX = margenX + anchoDoc - 70;
    const firmaAncho = 65;
    const centerXFirma = firmaX + firmaAncho / 2;

    if (s1) {
        const imgW = 30;
        const imgH = 12;
        const imgX = centerXFirma - imgW / 2;
        const imgY = firmaY - imgH - 2;
        doc.addImage(s1, "JPEG", imgX, imgY, imgW, imgH);
    }

    doc.line(firmaX, firmaY, firmaX + firmaAncho, firmaY);
    doc.setFont("helvetica", "bold").setFontSize(6.5);
    doc.text("Firma y Sello del Profesional", centerXFirma, firmaY + lineH - 1, { align: "center" });
    doc.text("Responsable de la Evaluación", centerXFirma, firmaY + lineH * 2 - 1, { align: "center" });

    return firmaY + lineH * 2;
};

// --- Componente Principal ---

export default async function ENERGIAYMINAS(datos = {}, docExistente = null) {
    const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = doc.internal.pageSize.getWidth();

    // === HEADER ===
    await drawHeader(doc, datos);

    // === TÍTULO ===
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
    doc.text("MINISTERIO DE ENERGIA Y MINAS", pageW / 2, 38, { align: "center" });

    // === DATOS DEL PACIENTE ===
    const finalYPos = drawPatientData(doc, datos);
    const s1 = await getSignCompressed(datos, "SELLOFIRMADOCASIG");
    const finalTpos2 = drawPatientData2(doc, datos, finalYPos + 3);


    // === CUERPO ===
    const finalYHereditarios = drawHereditaryFactors(doc, datos, finalTpos2 + 3);
    let y = finalYHereditarios + 10;
    const finalYDetalles = drawDetalles(doc, datos, y, s1);





    // === FOOTER ===
    footerTR(doc, datos);

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
