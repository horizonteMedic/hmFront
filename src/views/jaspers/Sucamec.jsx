import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";
import { getFetch } from "../admin/panel-de-control/getFetch/getFetch";

const Sucamec = ({orden,token, datos = {}}) => {
    {/*const [datos, setDatos] = useState({})
    useEffect(() => {
       getFetch(`/api/v01/ct/consentDigit/infoFormatoHojaRuta/${orden}`,token)
       .then((res) => {
        setDatos(res)
       }) 
    },[])*/}

    const generatePDF = () => {
        const fecha = "02/45/5154"
        const doc = new jsPDF();
        headerHR(doc,datos)
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

        drawBox(doc,"ADMISION", 90, 65, 30, 10, 4, datos.orden ? true : false);
        drawLine(105, 75, 105, 80); // Línea desde "TRIAJE" hacia abajo
        drawLine(90,80,120,80)
        drawLine(90,80,90,85)
        drawLine(120,80,120,85)

        drawC(doc,"PSIQUIATRIA",75,85,22,10)
        drawC(doc,"PSICOLOGIA",112,85,22,10, datos.psicologia ? true : false)
        drawLine(105, 80, 105, 105); // Línea desde "TRIAJE" hacia abajo
        drawC(doc,"EVALUACION MEDICA",86,105,35,10, datos.anexo7c ? true : false)

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

export default Sucamec