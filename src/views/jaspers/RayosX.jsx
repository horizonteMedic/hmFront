import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";

const RayosX = () => {

    const generatePDF = () => {
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

        drawBox(doc,"Rayos X", 90, headspace+35, 30, 10, 4, datos.rayosx ? true : false);
        



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

export default RayosX