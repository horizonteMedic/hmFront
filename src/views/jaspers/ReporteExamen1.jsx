import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";
import footer from "./components/footer";
export default function ReporteExamen1 (datos){

        const fecha = "02/45/5154"
        const doc = new jsPDF();
        
        // Move drawLine function definition to the top
        const drawLine = (x1, y1, x2, y2) => {
            doc.line(x1, y1, x2, y2);
        };

        //componente header
        headerHR(doc,datos)
        // Encabezado
        doc.setFontSize(8)
        const leftspace = 10
        const headspace = 78  // Single definition of headspace
        
        // Define new positions for layout
        const indicacionesX = leftspace;
        const indicacionesTextX = indicacionesX + 3;
        const indicacionesWidth = 75; 
        const organigramX = indicacionesX + indicacionesWidth + 10; // organigram to the right of indications
        const organigramLineX = organigramX + 15; // Center of organigram boxes (width 30)

        // Add instructions box (now on the left)
        doc.setFillColor(240, 240, 240);
        doc.rect(indicacionesX, 68, indicacionesWidth, 25, 'F'); 
        
        doc.setTextColor(255, 0, 0);
        doc.setFontSize(8);
        doc.text("INDICACIONES:", indicacionesTextX, 73);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        // Texto dinámico y ajustado al ancho del recuadro
        const indicacionesTexto =
            "- DEJAR UNA COPIA A COLOR DE SU DNI VIGENTE\n" +
            "- DEJAR COPIA A COLOR DE SU LICENCIA DE CONDUCIR VIGENTE, SI VA A CONDUCIR VEHICULO Y/O SE REALIZARÁ EXAMEN PSICOSENSOMETRICO";
        const splittedIndicaciones = doc.splitTextToSize(indicacionesTexto, indicacionesWidth - 6);
        let yPosInd = 77;
        splittedIndicaciones.forEach(line => {
            doc.text(line, indicacionesTextX, yPosInd);
            yPosInd += 3.5;
        });

        // 🟡 Dibujar cuadros del organigrama (now on the right)
        drawBox(doc,"ADMISION", organigramX, 68, 30, 10,  4, datos.orden ? true : false);
        drawLine(organigramLineX, 78, organigramLineX, 83);
        drawBox(doc,"TRIAJE", organigramX, 83, 30, 10, 4, datos.triaje ? true : false);
        drawLine(organigramLineX, 93, organigramLineX, 98);
        drawBox(doc,"LABORATORIO", organigramX, 98, 30, 10, 4, datos.laboratorio ? true : false);
        drawLine(organigramLineX, 108, organigramLineX, 113);

        // Remove the second headspace definition and continue with the rest
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
            startY: headspace+136, // Increased from 140 to 150 to maintain spacing
            body: [
              [{ content: `HALLAZGOS: ${datos.hallazgos || ''}`, colSpan: 1, rowSpan: 1, styles: { valign: "top" } }],
              [{ content: `___________________________________________________________________________________________________________________`, colSpan: 1, rowSpan: 1, styles: { valign: "top" } }],
              [{ content: `___________________________________________________________________________________________________________________`, colSpan: 1, rowSpan: 1, styles: { valign: "top" } }],
              [{ content: `___________________________________________________________________________________________________________________`, colSpan: 1, rowSpan: 1, styles: { valign: "top" } }],
              [{ content: `___________________________________________________________________________________________________________________`, colSpan: 1, rowSpan: 1, styles: { valign: "top" } }],
              [{ content: `___________________________________________________________________________________________________________________`, colSpan: 1, rowSpan: 1, styles: { valign: "top" } }],
            ],
            theme: "plain",
            styles: { fontSize: 8, textColor: [0, 0, 0] },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        });

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(`Registrado por : ${datos.userRegistro || ""}`, 17, headspace+185);
        footer(doc,datos);
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
