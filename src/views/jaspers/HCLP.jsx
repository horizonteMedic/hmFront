import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";

const HCL = () => {

    const generatePDF = () => {
        const fecha = "02/45/5154"
        const doc = new jsPDF();
        //componente header
        header(doc);
        // Encabezado
        const headerwhite = 22
        doc.setFontSize(13);
        doc.setTextColor(0, 0, 0);
        doc.text("HISTORIA CLINICA PSICOLOGICO", 70, headerwhite+15);
        doc.setFontSize(8)
        doc.text("HcPS N°: _________ ", 175,headerwhite+18)
        doc.setFontSize(8)
        doc.text("NOMBRES: ______________________________", 40, headerwhite + 25)
        doc.text("DNI: ______________________________", 40, headerwhite + 32)
        doc.text("EDAD: ______________________________", 40, headerwhite + 39)
        doc.text("FECHA DE NACIMIENTO: ______________________________",40, headerwhite + 46)
        doc.text("DIRECCIÓN: ______________________________", 40, headerwhite + 53)
        doc.text("APODERADO: ______________________________", 40, headerwhite + 60)
        doc.text("FECHA: ______________________________", 40, headerwhite + 67)
        
        autoTable(doc, {
          startY: 95,
          body: [
            [{ content: "Motivo de Consulta:", colSpan: 1, rowSpan: 1, styles: { minCellHeight: 22,valign: "top" } }],
            
          ],
          theme: "grid",
          styles: { fontSize: 8, textColor: [0, 0, 0] },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            body: [
              [{ content: "Antecedentes Relevantes:", colSpan: 1, rowSpan: 1, styles: { minCellHeight: 22,valign: "top" } }],
              
            ],
            theme: "grid",
            styles: { fontSize: 8, textColor: [0, 0, 0] },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            body: [
              [{ content: "Bateria de Pruebas:", colSpan: 1, rowSpan: 1, styles: { minCellHeight: 22,valign: "top" } }],
              
            ],
            theme: "grid",
            styles: { fontSize: 8, textColor: [0, 0, 0] },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            body: [
              [{ content: "Diagnostico Presuntivo:", colSpan: 1, rowSpan: 1, styles: { minCellHeight: 22,valign: "top" } }],
              
            ],
            theme: "grid",
            styles: { fontSize: 8, textColor: [0, 0, 0] },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            body: [
              [{ content: "Recomendaciones:", colSpan: 1, rowSpan: 1, styles: { minCellHeight: 22,valign: "top" } }],
              
            ],
            theme: "grid",
            styles: { fontSize: 8, textColor: [0, 0, 0] },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            body: [
              [{ content: "Seguimientos:", colSpan: 1, rowSpan: 1, styles: { minCellHeight: 22,valign: "top" } }],
              
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

export default HCL