import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";

export default function ReporteExamen1 (datos){

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
        drawBox(doc,"ADMISION", 90, 50, 30, 10,  4, datos.orden ? true : false);
        drawLine(105, 60, 105, 65);
        drawBox(doc,"TRIAJE", 90, 65, 30, 10, 4, datos.triaje ? true : false);
        drawLine(105, 75, 105, 80); // Línea desde "TRIAJE" hacia abajo
        drawBox(doc,"LABORATORIO", 90, 80, 30, 10, 4, datos.laboratorio ? true : false);
        drawLine(105, 90, 105, 95); // Línea desde "TRIAJE" hacia abajo

        drawC(doc,"AUDIOMETRIA", leftspace, headspace+35, 25, 10, datos.audiologia ? true : false);
        drawC(doc,"EKG ( > 40 años)", leftspace+28, headspace+35, 30, 10, datos.electrocardiograma ? true : false);
        drawC(doc,"ESPIROMETRIA", leftspace+61, headspace+35, 25, 10, datos.espirometria ? true : false);
        drawC(doc,"A. VISUAL", leftspace+90, headspace+35, 17, 10, datos.oftalmologia ? true : false);
        drawC(doc,"ODONTOLOGIA", leftspace+112, headspace+35, 25, 10, datos.odontologia ? true : false);
        drawC(doc,"RAYOS X", leftspace+142, headspace+35, 25, 10, datos.rayosx ? true : false);
        drawC(doc,"PSICOLOGIA", leftspace+170, headspace+35, 25, 10, datos.psicologia ? true : false);

        drawLine(leftspace+25, headspace+40, leftspace+28, headspace+40); 
        drawLine(leftspace+58, headspace+40, leftspace+61, headspace+40); 
        drawLine(leftspace+86, headspace+40, leftspace+90, headspace+40); 
        drawLine(leftspace+107, headspace+40, leftspace+112, headspace+40); 
        drawLine(leftspace+137, headspace+40, leftspace+142, headspace+40); 
        drawLine(leftspace+167, headspace+40, leftspace+170, headspace+40); 

        // 🟡 Evaluación Médica y Audiometría
        
        drawLine(leftspace+15, headspace+45, leftspace+15, headspace+50);
        drawLine(leftspace+40, headspace+45, leftspace+40, headspace+50);
        drawLine(leftspace+70, headspace+45, leftspace+70, headspace+50);
        drawLine(leftspace+100, headspace+45, leftspace+100, headspace+50);
        drawLine(leftspace+130, headspace+45, leftspace+130, headspace+50);
        drawLine(leftspace+160, headspace+45, leftspace+160, headspace+50);
        drawLine(leftspace+184, headspace+45, leftspace+184, headspace+50);


        drawLine(leftspace+15, headspace+50, leftspace+184, headspace+50); // Conectar "GRUPO SANGUINEO"
        
        drawLine(leftspace+28, headspace+50, leftspace+28, headspace+55);
        drawLine(leftspace+70, headspace+50, leftspace+70, headspace+55);
        drawLine(leftspace+92, headspace+50, leftspace+92, headspace+55);
        drawLine(leftspace+168, headspace+50, leftspace+168, headspace+55);

        drawC(doc,"TRABAJOS CALIENTES", leftspace+15, headspace+55, 33, 10, !datos.altatc ? true : datos.trabcalientes ? true : false);
        drawC(doc,"FIST TEST", leftspace+54, headspace+55, 25, 10, !datos.altaft ? true : datos.fisttest ? true : false);
        drawC(doc,"TEST ALTURA", leftspace+84, headspace+55, 25, 10, !datos.testaltura ? true : !datos.cerificadoaltura && !datos.b_certialtura ? false : true);
        drawC(doc,"PSICOSENSOMETRIA", leftspace+115, headspace+55, 35, 10, !datos.altaps ? true : datos.psicosen ? true : false);
        drawC(doc,"VISUAL COMPLEMENT", leftspace+155, headspace+55, 35, 10, !datos.altaviscom ? true : datos.visulcompl ? true : false);

        drawLine(leftspace+95, headspace+65, leftspace+95, headspace+70);
        drawC(doc,"EVALUACION MEDICA", leftspace+80, headspace+70, 35, 10, datos.anexo7c ? true : false);

        drawLine(leftspace+51, headspace+50, leftspace+51, headspace+70);
        drawC(doc,"MANIPULADOR DE\nALIMENTOS", leftspace+35, headspace+70, 35, 10, !datos.altamanipalim ? true : datos.manipalimen ? true : false);

        doc.text("EXAMENES ADICIONALES:",10,headspace+93)

        drawC(doc,"HERRAMIENTAS\nMANUALES", leftspace, headspace+97, 35, 10, !datos.ahm ? true : datos.herr_ma ? true : false);
        drawC(doc,"RX COLUMNA\nDORSOLUMBAR F y L", leftspace+40, headspace+97, 35, 10, !datos.adl ? true : datos.rxc_dorso ? true : false);
        drawC(doc,"RX COLUMNA\nLUMBAR F y L ", leftspace+80, headspace+97, 35, 10, !datos.alba ? true : datos.rxc_lumba ? true : false);
        drawC(doc,"RX COLUMNA\nLUMBOSACRA F y L", leftspace+120, headspace+97, 35, 10, !datos.albo ? true : datos.rxc_lumbo ? true : false);
        drawC(doc,"METALES PESADOS ", leftspace+160, headspace+97, 35, 10, !datos.aplomo || !datos.amercurio ? true : !datos.plomos || !datos.mercurioo ? true : false);

        drawLine(leftspace+35, headspace+102, leftspace+40, headspace+102);
        drawLine(leftspace+75, headspace+102, leftspace+80, headspace+102);
        drawLine(leftspace+115, headspace+102, leftspace+120, headspace+102);
        drawLine(leftspace+155, headspace+102, leftspace+160, headspace+102);

        drawLine(leftspace+175, headspace+107, leftspace+175, headspace+113);
        drawLine(leftspace+148, headspace+113, leftspace+185, headspace+113);
        drawLine(leftspace+148, headspace+113, leftspace+148, headspace+118);
        drawLine(leftspace+185, headspace+113, leftspace+185, headspace+118);

        drawC(doc,"PLOMO EN SANGRE", leftspace+118, headspace+118, 35, 10, !datos.aplomo ? true : datos.plomos ? true : false);
        drawC(doc,"MERCURIO EN ORINA", leftspace+160, headspace+118, 35, 10, !datos.amercurio ? true : datos.mercurioo ? true : false);

        autoTable(doc, {
            startY: headspace+140,
            body: [
              [{ content: "HALLAZGOS:", colSpan: 1, rowSpan: 1, styles: { minCellHeight: 60,valign: "top" } }],
              
            ],
            theme: "grid",
            styles: { fontSize: 8, textColor: [0, 0, 0] },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        });

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
