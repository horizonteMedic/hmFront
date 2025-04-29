import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
const FormatPsicologia = () => {

    const generatePDF = () => {
        const fecha = "02/45/5154"
        const doc = new jsPDF();
        //componente header
        header(doc);
        // Encabezado
        const headerwhite = 20
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("NOMBRE DEL EXAMEN", 80, headerwhite+15);

        autoTable(doc, {
          startY: 40,
          body: [
            ["Apellidos y Nombres", "__________________"],
            ["Empresa", "____"],
            ["Contrata", "________________"],
            ["Cargo", "________________"],
            ["Edad", "________________"],
            ["Grado de Instrucción", "________________"],
          ],
          theme: "plain",
          styles: { fontSize: 8, textColor: [0, 0, 0] },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
          columnStyles: { 
            0: { fontStyle: "bold", cellWidth: 40 } ,
            1: { cellWidth: 150}}
            // Primera columna en negrita
        });

        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10,
          head: [[{ content: "CRITERIOS PSICOLÓGICOS", colSpan: 7, styles: { halign: "center", fontStyle: "bold" } }]],
          body: [
            [{ content: "Aspecto intelectual", colSpan: 2, rowSpan: 1, styles: { valign: "top" } }, "I", "NPI", "NP", "NPS", "S"],
            ["1", "Razonamiento", "__", "__","__","__","__"],
            ["2", "Memoria", "__", "__","__","__","__"],
            ["3", "Atencion y Concentración", "__", "__","__","__","__"],
            ["4", "Coordinación viso-motora", "__", "__","__","__","__"],
            ["5", "Orientación Espacial", "__", "__","__","__","__"],
            [{ content: "Aspectos Personalidad", colSpan: 7, rowSpan: 1, styles: { halign: "center",valign: "top" } }],
            [{ content: "1", colSpan: 1, rowSpan: 2, styles: { valign: "top" } }, { content: "Estabilidad emocional", colSpan: 1, rowSpan: 2, styles: { valign: "top" } }, "Inestable", "Estable", { content: "", colSpan: 3, rowSpan: 6, styles: { valign: "top" } }],
            ["__","__"],
            [{ content: "2", colSpan: 1, rowSpan: 2, styles: { valign: "top" } }, { content: "Nivel de ansiedad y Tendencias", colSpan: 1, rowSpan: 2, styles: { valign: "top" } }, "Caso", "No Caso"],
            ["__","__"],
            [{ content: "3", colSpan: 1, rowSpan: 2, styles: { valign: "top" } }, { content: "Consumo de Alcohol", colSpan: 1, rowSpan: 2, styles: { valign: "top" } }, "Caso", "No Caso"],
            ["__","__"],
            [{ content: "4", colSpan: 1, rowSpan: 2, styles: { valign: "top" } }, { content: "Fobia a la altura", colSpan: 1, rowSpan: 2, styles: { valign: "top" } }, "Nada", "Ligeramente", "Moderadamente", "Marcadamente", "Miedo Extremo"],
            ["__", "__", "__", "__", "__"],
            [{ content: "ANALISIS Y RESULTADOS:", colSpan: 7, rowSpan: 1, styles: { minCellHeight: 25,valign: "top" } }],
            [{ content: "RECOMENDACIONES:", colSpan: 7, rowSpan: 1, styles: { minCellHeight: 20,valign: "top" } }],
            [{ content: "CONCLUSIONES", colSpan: 2, rowSpan: 2, styles: { valign: "top" } }, "APTO", "NO APTO", { content: "", colSpan: 7, rowSpan: 2, styles: { valign: "top" } }],
            ["__","__"]
          ],
          theme: "grid",
          styles: { textColor: [0, 0, 0] },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], halign: "center" }
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

export default FormatPsicologia