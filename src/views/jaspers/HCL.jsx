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
        doc.text("HISTORIA CLINICA", 90, headerwhite+15);
        doc.setFontSize(8)
        doc.text("N° HCL: _____   FECHA: ________", 150,headerwhite+18)
        doc.text("NOMBRES: _____________________________________________________________       EDAD: _____          SEXO: ____  ", 15, headerwhite + 25)
        doc.text("DNI: __________________     ESTADO CIVIL: _________________         DIRECCION: ________________________________________  ", 18, headerwhite + 33)
        doc.text("P/A: ____         P: ____          FC: ____             R: ____           T°: ____            SO2: _____           PESO: _____     TALLA: _________", 20, headerwhite + 41)
        
        autoTable(doc, {
          startY: 75,
          body: [
            [{ content: "Anamnesis:", colSpan: 1, rowSpan: 1, styles: { minCellHeight: 22,valign: "top" } }],
            
          ],
          theme: "grid",
          styles: { fontSize: 8, textColor: [0, 0, 0] },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
          
            // Primera columna en negrita
        });

        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10,
          body: [
            [{ content: "Examen Fisico:", colSpan: 1, rowSpan: 1, styles: { minCellHeight: 27,valign: "top" } }],
            
          ],
          theme: "grid",
          styles: { fontSize: 8, textColor: [0, 0, 0] },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
          
            // Primera columna en negrita
        });
        
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10, // Posiciona la nueva tabla debajo de la anterior
          body: [
              [
                  { content: "Diagnósticos:", styles: { fontStyle: "bold", halign: "center" } },
                  { content: "Exámenes Auxiliares:", styles: { fontStyle: "bold", halign: "center" } },
                  { content: "Tratamiento:", styles: { fontStyle: "bold", halign: "center" } }
              ],
              [
                  { content: "$F{h_diagnostico}", styles: { minCellHeight: 40, valign: "top" } },
                  { content: "$F{h_ex_auxiliares}", styles: { minCellHeight: 40, valign: "top" } },
                  { content: "$F{h_tratamiento}", styles: { minCellHeight: 40, valign: "top" } }
              ]
          ],
          theme: "grid",
          styles: { fontSize: 8, textColor: [0, 0, 0] },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        });

        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10,
          body: [
            [{ content: "CITA:", colSpan: 1, rowSpan: 1, styles: { minCellHeight: 22,valign: "top" } }],
            
          ],
          theme: "grid",
          styles: { fontSize: 8, textColor: [0, 0, 0] },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
          
            // Primera columna en negrita
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