import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";
import { getFetch } from "../admin/panel-de-control/getFetch/getFetch";
import footer from "./components/footer";
export default async function Sucamec(datos) {

    const fecha = "02/45/5154"
    const doc = new jsPDF();
    headerHR(doc, datos)
    //componente header

    // Encabezado
    doc.setFontSize(8)
    const leftspace = 10
    const headspace = 60
    // 🟡 Función para dibujar cuadros y centrar texto

    // 🟡 Función para dibujar líneas
    const drawLine = (x1, y1, x2, y2) => {
        doc.line(x1, y1, x2, y2);
    };

    // 🟡 Dibujar cuadros del organigrama

    drawBox(doc, "ADMISION", 90, 65, 30, 10, 4, datos.orden ? true : false);
    drawLine(105, 75, 105, 80); // Línea desde "TRIAJE" hacia abajo
    drawLine(90, 80, 120, 80)
    drawLine(90, 80, 90, 85)
    drawLine(120, 80, 120, 85)

    drawC(doc, "PSIQUIATRIA", 75, 85, 22, 10)
    drawC(doc, "PSICOLOGIA", 112, 85, 22, 10, datos.psicologia ? true : false)
    drawLine(105, 80, 105, 105); // Línea desde "TRIAJE" hacia abajo
    drawC(doc, "EVALUACION MEDICA", 86, 105, 35, 10, datos.anexo7c ? true : false)
    footer(doc, datos)
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

