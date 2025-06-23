import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header_Hematologia from "./header/header_Hematologia";

const Hematologia = () => {

    const generatePDF = () => {
        // Datos de ejemplo, reemplazar por datos reales en integración
        const datos = {
            norden: '96639',
            sede: 'Trujillo-Planta',
            nombres: 'HADY KATHERINE CASTILLO PLASENCIA',
            edad: 31,
            dni: '72384273',
            fecha: '2024-11-04',
            muestra: 'SANGRE TOTAL  C/ EDTA'
        };
        const doc = new jsPDF();
        // Nuevo header profesional
        header_Hematologia(doc, datos);
        // Título del examen
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text("HEMOGRAMA AUTOMATIZADO", 70, 70);
        // Tabla de resultados
        autoTable(doc, {
          startY: 80,
          head: [[
            "PRUEBA", "RESULTADO", "VALORES NORMALES"
          ]],
          body: [
            ["HEMOGLOBINA", "____", "Mujeres 12 - 16 g/dL\nHombres 14 - 18 g/dL"],
            ["HEMATOCRITO", "____", "Mujeres 38 - 50 %\nHombres 40 - 50 %"],
            ["HEMATÍES", "____", "4.0 - 5.5 x"],
            ["Volumen Corpuscular Medico", "____", "80 - 100 fL"],
            ["Concentración de la Hemoglobina\nCorpuscular Media", "____", "31 - 37 g/dl"],
            ["LEUCOCITOS", "____", "4 - 10"],
            [{content: "RECUENTO DIFERENCIAL", colSpan: 3, rowSpan: 1, }],
            ["NEUTRÓFILOS (%)", "____", "55 - 65 %"],
            ["ABASTONADOS (%)", "____", "0 - 5 %"],
            ["SEGMENTADOS (%)", "____", "55 - 65 %"],
            ["MONOCITOS (%)", "____", "4 - 8 %"],
            ["EOSINÓFILOS (%)", "____", "0 - 4 %"],
            ["BASÓFILOS (%)", "____", "0 - 1 %"],
            ["LINFOCITOS (%)", "____", "20 - 40 %"],
            ["PLAQUETAS", "____", "1.5 - 4.5"]
          ],
          theme: "grid",
          styles: { fontSize: 8, textColor: [0, 0, 0] },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        });
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

export default Hematologia