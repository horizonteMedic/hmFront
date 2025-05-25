import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerTriaje from "./components/headerTriaje";
import footer from "./components/footer";

export default function ReporteTriaje(datos) {
    const doc = new jsPDF();
    headerTriaje(doc, datos);
    console.log(datos)
    // --- Offset para bajar el contenido ---
    const offsetY = 45;

    // --- Cuadro de signos vitales mejor alineado y más angosto ---
    const cuadroW = 100;
    const cuadroH = 130;
    const cuadroX = 55;
    const cuadroY = 25 + offsetY;
    doc.setFontSize(14);

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
    drawRow("Perímetro Cuello :", `${datos.perimetro_cuello || ''} cm`);
    drawRow("Cintura :", `${datos.cintura || ''} cm`);
    drawRow("Cadera :", `${datos.cadera || ''} cm`);
    drawRow("Temperatura :", `${datos.temperatura || ''} °C`);
    drawRow("Frecuencia cardiaca :", `${datos.f_cardiaca || ''} x'`);
    drawRow("SatO2 :", `${datos.sat_02 || ''} %`);
    drawRow("Sistólica :", `${datos.sistolica || ''}`);
    drawRow("Diastólica :", `${datos.diastolica || ''}`);
    drawRow("Frec. Respiratoria :", `${datos.f_respiratoria || ''} x'`);

    // --- Diagnóstico ---
    doc.setFontSize(11);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text("Diagnóstico:", 20, cuadroY + cuadroH + 15);
    doc.setFont(undefined, 'normal');

    // Líneas de diagnóstico que cubren todo el ancho útil
    const diagStartY = cuadroY + cuadroH + 21;
    
    autoTable(doc, {
        startY: diagStartY,
        body: [
            [{ content: `Observaciones: \n\n${datos.conclusion}`, colSpan: 1, rowSpan: 1, styles: { minCellHeight: 22,valign: "top" } }],
            
        ],
        theme: "grid",
        styles: { fontSize: 12, textColor: [0, 0, 0] },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    });

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