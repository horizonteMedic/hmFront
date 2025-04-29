import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";

const Hemograma = () => {

    const generatePDF = () => {
        const fecha = "02/45/5154"
        const doc = new jsPDF();
        //componente header
        header(doc);
        // Encabezado
        const headerwhite = 22
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8)
        doc.text("N° de HCL: _________ ", 175,headerwhite+18)
        doc.setFontSize(8)
        doc.text("NOMBRES: ______________________________", 40, headerwhite + 25)
        doc.text("EDAD: ______________________________", 40, headerwhite + 32)
        doc.text("MÉDICO: ______________________________", 40, headerwhite + 39)
        doc.text("FECHA: ______________________________",40, headerwhite + 46)
        doc.setFontSize(13);
        doc.text("HEMOGRAMA", 90, headerwhite+65);

        autoTable(doc, {
          startY: 95,
          head: [[
            "PRUEBA", "RESULTADO", "VALORES REFERENCIALES"
          ]],
          body: [
            ["LEUCOCITOS", "____", "5,000 - 10,000/mm3"],
            ["NEUTRÓFILOS", "____", "55 - 65 %"],
            ["ABASTONADOS", "____", "03 - 05 %"],
            ["SEGMENTADOS", "____", "45 - 65 %"],
            ["LINFOCITOS", "____", "25 - 45 %"],
            ["MONOCITOS", "____", "04 - 08 %"],
            ["EOSINÓFILOS", "____", "00 - 04 %"],
            ["BASÓFILOS", "____", "00 - 01 %"],
            ["PLAQUETAS", "____", "150 000 - 450 000 mm3"],
            ["HEMOGLOBINA", "____", "12.0 - 16.0 g/dl"],
            ["HEMATOCRITO", "____", "36.0 - 45.0 %"]
          ],
          theme: "grid",
          styles: { fontSize: 8, textColor: [0, 0, 0] },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            body: [
              [{ content: "Observaciones:", colSpan: 1, rowSpan: 1, styles: { minCellHeight: 22,valign: "top" } }],
              
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

export default Hemograma