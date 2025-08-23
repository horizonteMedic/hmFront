import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";
import footer from "./components/footer";
export default function ReporteExamen1 (datos){

        // Función para formatear fecha de YYYY-MM-DD a DD/MM/YYYY
        const formatearFecha = (fecha) => {
            if (!fecha) return "";
            if (typeof fecha === "string" && fecha.includes("-")) {
                const [year, month, day] = fecha.split("-");
                return `${day}/${month}/${year}`;
            }
            return fecha;
        };

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
        doc.text(`Registrado por : ${obtenerPrimeraPalabra(datos.userRegistro || "")}`, 17, headspace+185);
        footer(doc,datos);
        
        // === AGREGAR SEGUNDA PÁGINA ===
        doc.addPage();
        
        // Agregar la imagen de la hoja de ruta en la mitad superior de la página 2
        try {
            const imgPath = "./img/pag2_hojaderuta.png";
            const pageW = doc.internal.pageSize.getWidth();
            const pageH = doc.internal.pageSize.getHeight();
            
            // Definir márgenes de 1.5pt (convertir a mm: 1.5pt ≈ 0.53mm)
            const margin = 0.53;
            
            // Calcular dimensiones para que la imagen ocupe la mitad superior con márgenes
            const imgW = pageW - (2 * margin); // 100% del ancho menos márgenes laterales
            const imgH = (pageH / 2) - margin; // Mitad de la altura menos margen superior
            
            // Posicionar la imagen con márgenes
            const imgX = margin; // Margen izquierdo
            const imgY = margin; // Margen superior
            
            doc.addImage(imgPath, 'PNG', imgX, imgY, imgW, imgH);
            
            // === COLOCAR DATOS DE PRUEBA EN EL FRAME ===
            // Configuración de fuentes para los datos
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            
            // === COLOCAR DATOS REALES EN EL FRAME ===
            // MUESTRA - Checkbox SANGRE (siempre marcado por defecto)
            // doc.setFont("helvetica", "bold");
            // doc.text("X", 25, 25); // X: 25, Y: 25
            
            // CÓDIGO
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.text(String(datos.orden || "148055"), 176.5, 12); // X: 80, Y: 35 - Ajustado para ser más visible
            
            // Restaurar fuente normal para los campos siguientes
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            
            // TIPO DE EXAMEN
            doc.text(String(datos.examen || "EXAMEN OCUPACIONAL"), 31,25.3); // X: 35, Y: 60
            
            // EMPRESA
            doc.text(String(datos.empresa || "EMPRESA NO ESPECIFICADA"), 85.5, 25.3); // X: 35, Y: 68
            
            // CONTRATA
            doc.text(String(datos.contrata || "CONTRATA NO ESPECIFICADA"), 155, 25.3); // X: 35, Y: 76
            
            // NOMBRES Y APELLIDOS
            doc.text(String(datos.nombres || "JOSUE SPENCER ROJAS SIGUENZA"), 53.5, 31); // X: 35, Y: 84
            
            // EDAD
            doc.text(datos.edad ? `${String(datos.edad)}` : "30", 140, 31); // X: 120, Y: 84
            
            // FECHA
            doc.text(String(formatearFecha(datos.fecha) || "23/08/2025"), 175, 31); // X: 160, Y: 84
            
            // CARGO
            doc.text(String(datos.cargo || "ADMIN DEL BAHIA ROSA"), 25, 36.2); // X: 35, Y: 92
            
            // === CHECKBOXES DE EVALUACIONES ===
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(255, 0, 0); // Color rojo
            
            // T.ALTURA - Marcar si NO está hecho en página 1 (usar la misma lógica)
            if (!datos.testaltura ? true : !datos.cerificadoaltura && !datos.b_certialtura ? false : true) {
                // Si está marcado en página 1, NO marcar en página 2
            } else {
                doc.text("X", 89, 37.3); // Marcar si NO se hizo test altura
            }
            
            // PSICOSENSOMETRIA - Marcar si NO está hecho en página 1
            if (!datos.altaps ? true : datos.psicosen ? true : false) {
                // Si está marcado en página 1, NO marcar en página 2
            } else {
                doc.text("X", 111, 37.3); // Marcar si NO se hizo psicosensometría
            }
            
            // M. A. (Manipulador de Alimentos) - Marcar si NO está hecho en página 1
            if (!datos.altamanipalim ? true : datos.manipalimen ? true : false) {
                // Si está marcado en página 1, NO marcar en página 2
            } else {
                doc.text("X", 130.5, 37.3); // Marcar si NO se hizo manip. alimentos
            }
            
            // MET. P. (Metales Pesados) - Marcar si NO está hecho en página 1
            if (!datos.aplomo || !datos.amercurio ? true : !datos.plomos || !datos.mercurioo ? true : false) {
                // Si está marcado en página 1, NO marcar en página 2
            } else {
                doc.text("X", 154.2, 37.3); // Marcar si NO se hicieron metales pesados
            }
            
            // Pb (Plomo) - Marcar si NO está hecho en página 1
            if (!datos.aplomo ? true : datos.plomos ? true : false) {
                // Si está marcado en página 1, NO marcar en página 2
            } else {
                doc.text("X", 171, 37.3); // Marcar si NO se hizo plomo
            }
            
            // T. CAL (Trabajos Calientes) - Marcar si NO está hecho en página 1
            if (!datos.altatc ? true : datos.trabcalientes ? true : false) {
                // Si está marcado en página 1, NO marcar en página 2
            } else {
                doc.text("X", 194, 37.3); // Marcar si NO se hicieron trabajos calientes
            }
            
            // Restaurar fuente normal
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            
        } catch (error) {
            console.error("No se pudo cargar la imagen de la hoja de ruta:", error);
            // Si falla la imagen, agregar texto alternativo
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("HOJA DE RUTA", 80, 100, { align: "center" });
        }
        
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
function obtenerPrimeraPalabra(nombreCompleto) {
  if (typeof nombreCompleto !== "string") return "";
  const limpio = nombreCompleto.trim();      // Elimina espacios
  if (limpio === "") return "";              // Si está vacío, devuelve ""
  return limpio.split(/\s+/)[0];             // Si no, devuelve la primera palabra
}