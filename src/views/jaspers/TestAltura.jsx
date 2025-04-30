import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";

export default function TestAltura  (datos)  {
        const fecha = "02/45/5154"
        const doc = new jsPDF();
        //componente header
        headerHR(doc,datos)
        // Encabezado
        doc.setFontSize(8)
        const leftspace = 10
        const headspace = 60
        // 🟡 Función para dibujar líneas
        const drawLine = (x1, y1, x2, y2) => {
            doc.line(x1, y1, x2, y2);
        };

        // 🟡 Dibujar cuadros del organigrama

        drawBox(doc,"ADMISION", 90, 65, 30, 10, 4, datos.orden ? true : false);
        drawLine(105, 75, 105, 80); // Línea desde "TRIAJE" hacia abajo
        drawBox(doc,"TRIAJE", 90, 80, 30, 10, 4, datos.triaje ? true : false);
        drawLine(105, 90, 105, 95); // Línea desde "TRIAJE" hacia abajo

        drawC(doc,"LABORATORIO\n(HTO-HB)", leftspace, headspace+35, 25, 10, datos.laboratorio ? true : false);
        drawC(doc,"A. VISUAL", leftspace+28, headspace+35, 30, 10, !datos.oftalmologia ? false : true);
        drawC(doc,"EKG ( > 40 años )", leftspace+61, headspace+35, 25, 10, !datos.electrocardiograma ? false : true);
        drawC(doc,"PSICOLOGIA", leftspace+90, headspace+35, 20, 10, !datos.psicologia ? false : true);
        drawC(doc,"PSICOSENSOMETRICO\nPARA ALTURA", leftspace+120, headspace+35, 35, 10, datos.psicosen ? false : true);
        drawC(doc,"AUDIOMETRIA", leftspace+160, headspace+35, 25, 10, !datos.audiologia ? false : true);

        drawLine(leftspace+25, headspace+40, leftspace+28, headspace+40); 
        drawLine(leftspace+58, headspace+40, leftspace+61, headspace+40); 
        drawLine(leftspace+86, headspace+40, leftspace+90, headspace+40); 
        drawLine(leftspace+110, headspace+40, leftspace+120, headspace+40); 

        // 🟡 Evaluación Médica y Audiometría
        
        drawLine(leftspace+15, headspace+45, leftspace+15, headspace+50);
        drawLine(leftspace+40, headspace+45, leftspace+40, headspace+50);
        drawLine(leftspace+70, headspace+45, leftspace+70, headspace+50);
        drawLine(leftspace+100, headspace+45, leftspace+100, headspace+50);
        drawLine(leftspace+130, headspace+45, leftspace+130, headspace+50);


        drawLine(leftspace+15, headspace+50, leftspace+130, headspace+50); // Conectar "GRUPO SANGUINEO"
       

        drawC(doc,"EVALUACIÓN MEDICA", leftspace+60, headspace+55, 33, 10, datos.anexo7c ? true : false);
        drawLine(leftspace+70, headspace+50, leftspace+70, headspace+55);

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
        };
}

