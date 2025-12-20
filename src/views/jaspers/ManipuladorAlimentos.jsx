import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";
import footer from "./components/footer";
export default async function ManAlimentos(datos) {
    const fecha = "02/45/5154"
    const doc = new jsPDF();
    const drawLine = (x1, y1, x2, y2) => {
        doc.line(x1, y1, x2, y2);
    };

    headerHR(doc, datos)
    doc.setFontSize(9)
    const leftspace = 10
    const headspace = 75  // Increased for lower positioning

    // Center position calculation
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = 105;  // Fixed position instead of center
    const boxWidth = 30;
    const boxX = centerX - (boxWidth / 2);

    // Boxes and lines
    drawBox(doc, "ADMISION", boxX, 80, boxWidth, 10, 4, datos.orden ? true : false);
    drawLine(centerX, 90, centerX, 95);
    drawBox(doc, "TRIAJE", boxX, 95, boxWidth, 10, 4, datos.triaje ? true : false);
    drawLine(centerX, 105, centerX, 110);
    drawBox(doc, "LABORATORIO", boxX, 110, boxWidth, 10, 4, datos.laboratorio ? true : false);
    drawLine(centerX, 120, centerX, 125);
    drawBox(doc, "EVALUACION MEDICA", boxX - 10, 125, 50, 10, 4, datos.anexo7c ? true : false);

    // Add instructions to the right side with red title and background
    doc.setFillColor(240, 240, 240); // Light gray background
    doc.rect(135, 80, 70, 35, 'F'); // Increased width of background rectangle

    doc.setTextColor(255, 0, 0);
    doc.setFontSize(10);
    doc.text("INDICACIONES:", 140, 85);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    const instructions = [
        "- Si ud. es conductor y/o operador dejar una",
        "  copia a color de DNI y licencia de conducir.",
        "- Si ud. no es conductor dejar una copia a",
        "  color de su DNI.",
        "- Si ud. va a pasar examen psicosensométrico",
        "  para conducir debe dejar una copia a color",
        "  de su DNI."
    ];

    let yPos = 90;
    instructions.forEach(line => {
        doc.text(line, 140, yPos);
        yPos += 4; // Reduced spacing between lines
    });

    footer(doc, datos);
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

