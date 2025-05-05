import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";
import footer from "./components/footer";
export default function ReporteExamenR (datos) {

        const fecha = "02/45/5154"
        const doc = new jsPDF();
        //componente header
        headerHR(doc,datos)
        // Encabezado
        doc.setFontSize(9)
        const leftspace = 10
        const headspace = 60
        // 🟡 Función para dibujar cuadros y centrar texto

        // 🟡 Función para dibujar líneas
        const drawLine = (x1, y1, x2, y2) => {
            doc.line(x1, y1, x2, y2);
        };

        // 🟡 Dibujar cuadros del organigrama
        drawBox(doc,"ADMISION", 90, 50, 30, 10,  4, datos.orden ? true : false);
        drawLine(105, 60, 105, 65);
        drawBox(doc,"TRIAJE", 90, 65, 30, 10, 4, datos.triaje ? true : false);
        drawLine(105, 75, 105, 80); // Línea desde "TRIAJE" hacia abajo
        drawBox(doc,"LABORATORIO", 90, 80, 30, 10, 4, datos.laboratorio ? true : false);
        drawLine(105, 90, 105, 95); // Línea desde "TRIAJE" hacia abajo

        drawC(doc,"AUDIOMETRIA", leftspace, headspace+35, 25, 10, datos.audiologia ? true : false);
        drawC(doc,"EKG ( > 40 años)", leftspace+28, headspace+35, 30, 10, datos.electrocardiograma ? true : false);
        drawC(doc,"ESPIROMETRIA", leftspace+61, headspace+35, 25, 10, datos.espirometria ? true : false);
        drawC(doc,"A. VISUAL", leftspace+90, headspace+35, 25, 10, datos.oftalmologia ? true : false);
        drawC(doc,"ODONTOLOGIA", leftspace+120, headspace+35, 25, 10, datos.odontologia ? true : false);
        drawC(doc,"RAYOS X", leftspace+150, headspace+35, 25, 10, datos.rayosx ? true : false);

        drawLine(leftspace+25, headspace+40, leftspace+28, headspace+40); 
        drawLine(leftspace+58, headspace+40, leftspace+61, headspace+40); 
        drawLine(leftspace+86, headspace+40, leftspace+90, headspace+40); 
        drawLine(leftspace+115, headspace+40, leftspace+120, headspace+40); 
        drawLine(leftspace+145, headspace+40, leftspace+150, headspace+40); 

        // 🟡 Evaluación Médica y Audiometría
        
        drawLine(leftspace+15, headspace+45, leftspace+15, headspace+50);
        drawLine(leftspace+40, headspace+45, leftspace+40, headspace+50);
        drawLine(leftspace+70, headspace+45, leftspace+70, headspace+50);
        drawLine(leftspace+100, headspace+45, leftspace+100, headspace+50);
        drawLine(leftspace+130, headspace+45, leftspace+130, headspace+50);
        drawLine(leftspace+160, headspace+45, leftspace+160, headspace+50);


        drawLine(leftspace+15, headspace+50, leftspace+160, headspace+50); // Conectar "GRUPO SANGUINEO"
        
        drawLine(leftspace+28, headspace+50, leftspace+28, headspace+55);
        drawLine(leftspace+85, headspace+50, leftspace+85, headspace+55);
        drawLine(leftspace+145, headspace+50, leftspace+145, headspace+55);

        drawC(doc,"FIRST TEST", leftspace+15, headspace+55, 25, 10, !datos.altaft ? true : datos.fisttest ? true : false);
        drawC(doc,"TEST ALTURA", leftspace+70, headspace+55, 25, 10, !datos.testaltura ? true : !datos.cerificadoaltura && !datos.b_certialtura ? false : true);
        drawC(doc,"PSICOSENSOMETRIA", leftspace+130, headspace+55, 35, 10, datos.altaps ? true : datos.psicosen ? true : false);
        drawLine(leftspace+85, headspace+65, leftspace+85, headspace+70);
        drawC(doc,"EVALUACION MEDICA", leftspace+70, headspace+70, 35, 10, datos.anexo7c ? true : false);

        footer(doc,datos)
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
