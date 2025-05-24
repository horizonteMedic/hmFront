import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerTriaje from "./components/headerTriaje";
import footer from "./components/footer";

export default function ReporteTriaje(datos) {
    const doc = new jsPDF();
    headerTriaje(doc, datos);

    // --- Offset para bajar el contenido ---
    const offsetY = 45;

    // --- Cuadro de signos vitales mejor alineado y más angosto ---
    const cuadroW = 100;
    const cuadroH = 130;
    const cuadroX = 55;
    const cuadroY = 25 + offsetY;
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.rect(cuadroX, cuadroY, cuadroW, cuadroH, 'S');
    let y = cuadroY + 16;
    const salto = 10;
    const labelX = cuadroX + 10;
    const valueX = cuadroX + cuadroW - 10;
    const drawRow = (label, value) => {
        doc.setFont(undefined, 'normal');
        doc.text(label, labelX, y);
        doc.setFont(undefined, 'bold');
        doc.text(value, valueX, y, { align: "right" });
        y += salto;
    };
    drawRow("Talla :", `${datos.talla || ''} cm`);
    drawRow("Peso :", `${datos.peso || ''} kg`);
    drawRow("IMC :", `${datos.imc || ''} %`);
    drawRow("Perímetro Cuello :", `${datos.perimetroCuello || ''} cm`);
    drawRow("Cintura :", `${datos.cintura || ''} cm`);
    drawRow("Cadera :", `${datos.cadera || ''} cm`);
    drawRow("Temperatura :", `${datos.temperatura || ''} °C`);
    drawRow("Frecuencia cardiaca :", `${datos.fc || ''} x'`);
    drawRow("SatO2 :", `${datos.sat02 || ''} %`);
    drawRow("Sistólica :", `${datos.sistolica || ''}`);
    drawRow("Diastólica :", `${datos.diastolica || ''}`);
    drawRow("Frec. Respiratoria :", `${datos.fr || ''} x'`);

    // --- Diagnóstico ---
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text("Diagnóstico:", 20, cuadroY + cuadroH + 15);
    doc.setFont(undefined, 'normal');

    // Líneas de diagnóstico que cubren todo el ancho útil
    const diagStartY = cuadroY + cuadroH + 21;
    const leftMargin = 20;
    const rightMargin = 195;
    const lineHeight = 7;
    let currentY = diagStartY;
    for (let i = 0; i < 3; i++) {
        doc.line(leftMargin, currentY, rightMargin, currentY);
        currentY += lineHeight;
    }

    // --- Footer ---
    footer(doc, datos);

    // --- Imprimir ---
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