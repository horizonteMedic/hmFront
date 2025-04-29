import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";

const Psicosensometria = () => {

    const generatePDF = () => {
        const fecha = "02/45/5154"
        const doc = new jsPDF();
        //componente header
        headerHR(doc,datos)
        // Encabezado
        doc.setFontSize(9)
        const leftspace = 10
        const headspace = 50
        // 🟡 Función para dibujar cuadros y centrar texto

        // 🟡 Función para dibujar líneas
        const drawLine = (x1, y1, x2, y2) => {
            doc.line(x1, y1, x2, y2);
        };

        // 🟡 Dibujar cuadros del organigrama
        drawBox(doc,"ADMISION", 90, headspace, 30, 10,  4, datos.orden ? true : false);
        drawBox(doc,"TRIAJE", 90, headspace+15, 30, 10, 4,  datos.triaje ? true : false);
        drawLine(105, 60, 105, 65);

        drawBox(doc,"GRUPO SANGUINEO", leftspace, headspace+35, 40, 10, 4, datos.laboratorio ? true : false);
        drawBox(doc,"PSICOSENSOMETRIA", leftspace+45, headspace+35, 50, 10, 4, datos.fisttest ? true : datos.psicosen ? true : false);
        drawBox(doc,"TEST DE ALTURA", leftspace+100, headspace+35, 40, 10, 4, datos.examen === "FIST-TEST" ? true : datos.examen === "PSICOSENSOMETRIA" ? true : !datos.cerificadoaltura && !datos.b_certialtura ? false : true);
        drawBox(doc,"A. VISUAL", leftspace+150, headspace+35, 30, 10, 4, datos.oftalmologia ? true : false);

        drawLine(105, 75, 105, 80); // Línea desde "TRIAJE" hacia abajo
        drawLine(105, 80, 35, 80); // Conectar "GRUPO SANGUINEO"
        drawLine(105, 80, 145, 80); // Conectar "TEST DE ALTURA"
        drawLine(105, 80, 180, 80); // Conectar "A. VISUAL"
        
        // 🟡 Evaluación Médica y Audiometría
        drawBox(doc,"EVALUACIÓN MEDICA", leftspace+60, 100, 50, 10, 4, datos.anexo7c ? true : false);
        drawBox(doc,"AUDIOMETRIA", leftspace+150, 100, 30, 10, 4, datos.audiologia ? true : false);
        drawLine(35, 80, 35, 85);
        drawLine(80, 80, 80, 85);
        drawLine(130, 80, 130, 85);
        drawLine(180, 80, 180, 85);
        drawLine(90, 95, 90, 100);

        const pdfBlob = doc.output("blob");
          const pdfUrl = URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, "_blank");
    };
    return (
        <div>
            <button onClick={generatePDF}>Generar PDF</button>
        </div>
    );

}

export default Psicosensometria