import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";

const HCAdulto = () => {

    const generatePDF = () => {
        const fecha = "02/45/5154"
        const doc = new jsPDF();
        //componente header
        const img = "./img/logo-color.png";
        doc.addImage(img, "PNG", 10, 10, 50, 20);
        doc.setFontSize(12)
        doc.text("HISTORIA CLINICA DE LA MUJER Y EL VARON ADULTO",60,10)
        // Encabezado
        const headerwhite = 22
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8)
        doc.text("N° Historia: _________ ", 160,headerwhite+15)
        doc.text("ESTABLECIMIENTO: POLICLINICO HORIZONTE MEDIC                                                         FECHA DE APERTUR HCL: _____", 15,headerwhite+20)

        autoTable(doc, {
          startY: 45,
          head: [[
            {content: "DATOS GENERALES",colSpan:4, rowSpan:1, styles: {halign: "center"} }
          ]],
          body: [
            ["APELLIDOS Y NOMBRES\n$APELLIDOS_______","DNI\n$DNI__", "SEXO\n$F__", "FECHA DE NACIMIENTO\n$FECHA______"],
            [{content: "DOMICILIO:  _______________________________                                         TELEFONO:  ___________________", colSpan:4,rowSpan:1}],
            [{content: "LUGAR DE NACIMIENTO:  _____________________________     RELIGIÓN:  ______________  GRUPO SANGUINEO:  ___________", colSpan:4,rowSpan:1}],
            [{content: "DOMICILIO: ______________________          ESTADO CIVIL:            SOLTERO: ___     CONVIVIENTE: ___     CASADO: ___", colSpan:4,rowSpan:1}],
            [{content: "ESTUDIA:        SI:           NO:              CENTRO EDUCATIVO: _________________     AÑO QUE CURSA:  ________________",colSpan:4,rowSpan:1}]
          ],
          theme: "striped",
          styles: { fontSize: 8, textColor: [0, 0, 0] },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        });
        
        doc.rect(40, doc.lastAutoTable.finalY - 5, 4, 4);  // Cuadrado para "SI"
        doc.rect(53, doc.lastAutoTable.finalY - 5, 4, 4); // Cuadrado para "NO"

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 1,
            head: [[
              {content: "ANTECEDENTES",colSpan:1, rowSpan:1, styles: {halign: "center"} }
            ]],
            body: [
              ["FECHA DE EVALUACIÓN:  ____________________________             EDAD:  ________ AÑOS"],
            ],
            theme: "striped",
            styles: { fontSize: 8, textColor: [0, 0, 0] },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
          });

          autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 1,
            head: [[
              {content: "PERSONALES",colSpan:2, rowSpan:1, styles:{cellWidth: 40}},{content: "FAMILIARES",colSpan:2, rowSpan:1, styles:{cellWidth: 40} },{content: "", colSpan:6, rowSpan:1}
            ]],
            body: [
              ["Diabetes",{content:"___", styles:{halign:"right"}}, "TBC:    ",{content:"___", styles:{halign:"right"}},{content: "VACUNAS", colSpan:1,rowSpan:2, styles: {cellPadding: 5, halign: "center", cellWidth: 23}},{content: "Dosis Fecha", colSpan: 5, rowSpan:1}],
              ["Asma Bronquial",{content:"___", styles:{halign:"right"}}, "Alergia a Medicamentos:    ",{content:"___", styles:{halign:"right"}},"1°","2°","3°","4°","5°"],
              ["Enferm Congénitas",{content:"___", styles:{halign:"right"}}, "Anomalias Congénitas:    ",{content:"___", styles:{halign:"right"}},{content: "DT", styles:{halign: "center"}},"__","__","__","__","__"],
              ["Epilepsia",{content:"___", styles:{halign:"right"}}, "Epilepsia:    ",{content:"___", styles:{halign:"right"}},{content: "OTRAS", colSpan:1,rowSpan:2, styles: {cellPadding: 5,halign: "center",}},"__","__","__","__","__"],
              ["Cardiopatia",{content:"___", styles:{halign:"right"}}, "Diabetes:    ",{content:"___", styles:{halign:"right"}},"__","__","__","__","__"],
              ["Alergia a Medicamentos",{content:"___", styles:{halign:"right"}}, "Hipertensión Arterial:    ",{content:"___", styles:{halign:"right"}},{content: "OBSERVACIONES:", colSpan: 6, rowSpan:4}],
              ["TBC",{content:"___", styles:{halign:"right"}}, "Asma Bronquial:    ",{content:"___", styles:{halign:"right"}}],
              ["Aborto",{content:"___", styles:{halign:"right"}}, "VIH / SIDA:    ",{content:"___", styles:{halign:"right"}}],
              ["Otros: ............................",{content:"", styles:{halign:"right"}}, "Consumo de Drogas:\nOtros: .........    ",{content:"___", styles:{halign:"right"}}],
            ],
            theme: "grid",
            styles: { fontSize: 8, textColor: [0, 0, 0] },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
          });

          autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 1,
            head: [[
              {content: "ANTECEDENTES PSICOSOCIALES",colSpan:1, rowSpan:1, styles: {halign: "center"} }
            ]],
            body: [
              [`VIVE\n\nPADRE   ___                         MADRE  ___                        HERMANOS   ____                      OTROS  ___    ESPECIFIQUEN
                \nCOMPARTE EL DORMITORIO          SI  ___                    NO  ____                Con quién........................`],
              [`USO DEL TIEMPO LIBRE\n\nDEPORTES   ___         GRUPO DE AMIGOS  ___         CLUB   ____          DISCOTECAS  ___       INTERNET  ____     OTROS .............`],
              [`PROTECCION EN SALUD\n\nESSALUD   ___         PRIVADO  ___         SIS   ____          NINGUNO  ___       OTROS .............`],
              [`RENDIMIENTO ESCOLAR\n\nBAJO RENDIMIENTO ESCOLAR   ___         DESERCION  ___         REPITENCIA   ____          POR QUE   .............`],
              [`EDAD DE INICIO DE TRABAJO    ______                              TIPO DE TRABAJO: .........................\n\nREMUNERACIÓN        SI  ___             NO  ___                            USO DINERO  .............`],
              [`HA SIDO VICTIMA DE VIOLENCIA           SI ____           NO ____\n\nQue tipo de violencia ............¿Por Quién?..............\nFISICA  ___                                                                          SEXUAL   ____                                             
                \nEMOCIONAL  ___                                                               POLITICA  ___                                                `],
              [`CONSUMO DROGAS                              SI ____                              NO ___\n\nPANDILLAJE                                            SI  ___                                NO  ___                                FRECUENCIA .........................................`],


            ],
            theme: "striped",
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

export default HCAdulto