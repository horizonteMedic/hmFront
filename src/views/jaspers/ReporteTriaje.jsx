import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default function ReporteTriaje(datos) {
    const doc = new jsPDF();
    header(doc);

    // --- Offset para bajar el contenido ---
    const offsetY = 25;

    // --- Título grande y en mayúsculas ---
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("INFORME TRIAJE", 105, 38 + offsetY, { align: "center" });

    // --- Labels de ficha y fecha en negrita ---
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(`N° Ficha :`, 155, 32 + offsetY);
    doc.text(`Fecha Triaje :`, 155, 38 + offsetY);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(13);
    doc.text(`${datos.nroFicha || ''}`, 180, 32 + offsetY, { align: "right" });
    doc.setFontSize(9);
    doc.text(`${datos.fechaTriaje || ''}`, 180, 38 + offsetY, { align: "right" });

    // --- Datos principales en negrita ---
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(`Nombres :`, 20, 48 + offsetY);
    doc.text(`Sexo :`, 90, 48 + offsetY);
    doc.text(`Nacimiento:`, 140, 48 + offsetY);
    doc.setFont(undefined, 'normal');
    doc.text(`${datos.nombres || ''}`, 45, 48 + offsetY);
    doc.text(`${datos.sexo || ''}`, 110, 48 + offsetY);
    doc.text(`${datos.nacimiento || ''}`, 170, 48 + offsetY);

    // --- Cuadro de signos vitales mejor alineado y más angosto ---
    const cuadroW = 80;
    const cuadroH = 88;
    const cuadroX = 65;
    const cuadroY = 55 + offsetY;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.rect(cuadroX, cuadroY, cuadroW, cuadroH, 'S');
    let y = cuadroY + 8;
    const salto = 7;
    const labelX = cuadroX + 4;
    const valueX = cuadroX + cuadroW - 4;
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
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("Diagnóstico:", 20, cuadroY + cuadroH + 15);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    let diagY = cuadroY + cuadroH + 21;
    const diagnosticos = (datos.diagnostico || "").split("\n");
    diagnosticos.forEach(linea => {
        doc.text(`- ${linea}`, 25, diagY);
        diagY += 6;
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