import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";

const Hematologia = () => {

    const generatePDF = () => {
        const fecha = "02/45/5154"
        const doc = new jsPDF();
        //componente header
        header(doc);
        // Encabezado
        const headerwhite = 22
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8)
        doc.text("Nro Orden: _________ ", 175,headerwhite+18)
        doc.setFontSize(8)
        doc.text("Apelidos y Nombres: ______________________________", 40, headerwhite + 25)
        doc.text("Edad: ______________________________", 40, headerwhite + 32)
        doc.text("DNI: ______________________________", 40, headerwhite + 39)
        doc.text("FECHA: ______________________________",40, headerwhite + 46)
        doc.text("Muestra: ______________________________", 40, headerwhite + 53)
        doc.setFontSize(13);
        doc.text("HEMOGRAMA AUTOMATIZADO", 70, headerwhite+65);

        autoTable(doc, {
          startY: 95,
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