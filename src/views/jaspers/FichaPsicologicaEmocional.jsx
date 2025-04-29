import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
const FichaPsicologicaEmocional = () => {

  const generatePDF = () => {
    const fecha = "02/45/5154"
    const doc = new jsPDF();
    //componente header
    header(doc);
    // Encabezado
    const headerwhite = 30
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("FICHA PSICOLÓGICA OCUPACIONAL", 60, headerwhite+15);
    doc.setFontSize(10);
    doc.text("ANEXO N° 03", 90, headerwhite+25);
    doc.text(`Fecha Evaluación: ${fecha }`, 140, headerwhite+30);

    // Datos Generales
    autoTable(doc, {
      startY: 63,
      head: [["I. DATOS GENERALES", ""]],
      body: [
        ["Apellidos y Nombres", "__________________"],
        ["Edad", "____ AÑOS"],
        ["Fecha de Nacimiento", "________________"],
        ["Lugar de Nacimiento", "________________"],
        ["Estado Civil", "________________"],
        ["Grado de Instrucción", "________________"],
        ["Lugar de Residencia", "________________"],
        ["Evaluación", "Pre-Ocupacional: __  Ocupacional: __  Post-Ocupacional: __  Anual: __"],
      ],
      theme: "grid",
      styles: { textColor: [0, 0, 0] },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      
    });

    // Motivo de Evaluación
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["II. MOTIVO DE EVALUACIÓN"]],
      body: [["__________________________________________________"]],
      theme: "grid",
      styles: { textColor: [0, 0, 0] },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    });

    // Datos Ocupacionales
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["III. DATOS OCUPACIONALES",""]],
      body: [
        [{ content: "3.1 EMPRESA ACTUAL (postula, trabaja o trabajó)", colSpan: 2, styles: { fontStyle: "bold" } }],
        ["Nombre de la Empresa", "____________"],
        ["Actividad Empresa", "________________"],
        ["Área de Trabajo _______", "Pre-Ocupacional: __  Ocupacional: __  Post-Ocupacional: __  Anual: __"],
        ["Puesto", "________________"],
        ["Principales Riesgos", "________________"],
        ["Medidas de Seguridad", "________________"],
        ["Principales Riesgos","___________________________"],
        ["Medidas de Seguridad","___________________________"],
        [{ content: "3.2 ANTERIORES EMPRESAS", colSpan: 2, styles: { fontStyle: "bold" } }],
      ],
      theme: "grid",
      styles: { textColor: [0, 0, 0] },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY, // Ubica la tabla justo después de la anterior
      head: [["FECHA", "NOMBRE DE LA EMPRESA", "ACT. EMPRESA", "PUESTO", "TIEMPO SUP", "TIEMPO SUB", "CAUSA DEL RETIRO"]],
      body: [
        ["01/01/2020", "Empresa A", "Minería", "Ingeniero", "2 años", "1 año", "Renuncia"],
        ["15/06/2018", "Empresa B", "Construcción", "Técnico", "3 años", "0 años", "Terminación de contrato"]
      ],
      theme: "grid",
      styles: { textColor: [0, 0, 0] },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    });

    autoTable(doc , {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["IV. HISTORIA FAMILIAR"]],
      body: [["______"]],
      theme: "grid",
      styles: { textColor: [0, 0, 0] },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }
    })

    autoTable(doc , {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["V. HABITOS (pasatiempos, consumo de tabaco, alcohol y/o drogas)"]],
      body: [["______"]],
      theme: "grid",
      styles: { textColor: [0, 0, 0] },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }
    })

    autoTable(doc , {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["VI. OTRAS OBSERVACIONES"]],
      body: [["______"]],
      theme: "grid",
      styles: { textColor: [0, 0, 0] },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }
    })

    autoTable(doc , {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["VII. EXAMEN MENTAL","",""]],
      body: [
        ["7.1 OBSERVACIÓN DE CONDUCTAS","Ptje.","Nombre"],
        ["-PRESENTACIÓN:     Adecuado (   )    Inadecuado (   )","_","Invetario Millón de Estilos de Personalidad - MIPS"],
        ["-POSTURA:    Erguida (  )   Encorvada (  )","_","Escala de Motivaciones Psicosociales - MPS"],
        ["-POSTURA:  Ritmo:  Lento(  )   Rápido (  )  Fluido (  )","_","Luria - DNA Diagnostico neuropsicológico de Adultos"],
        ["Tono:  Bajo (  )  Moderado (  )  Alto  (  )","_","Escala de Apresiación del Estrés EAE"],
        ["-Articulación:  Con Dificultad (  )   Sin Dificultad (  )","_","Inventario de Bornout de Maslach"],
        ["-Orientación:  Tiempo: Orientado (  ) Desorientado (  )","_","Clima laboral"],
        ["-Espacio:  Orientado (  )  Desorientado (  )","_","Bateria de Conductores"],
        ["-Persona:  Orientado (  )  Desorientado (  )","_","WAIS"],
        ["7.2 PROCESOS COGNITIVOS","_","test BENTON"],
        ["-Lucido, atento: ___","_","Test Bender"],
        ["-Pensamiento: ___","_","Inventario de la ansiedad ZUNG"],
        ["-Percepción: ___","_","Inventario de Depresión ZUNG"],
        ["-Memoria:  Corto plazo__  Mediano Plazo__ Largo Plazo__","_","Escala de Memoria Wechsler"],
        ["Promedio( ) N.Torpe( ) Fronterizo( ) RM Leve( )",{ content: "", colSpan: 1, rowSpan: 6, styles: { valign: "top" } },{ content: "Otras Pruebas", colSpan: 1, rowSpan: 6, styles: { valign: "top" } }],
        ["-Apetito: ___","",""],
        ["-Sueño: ____","",""],
        ["-Personalidad: ___","",""],
        ["-Atectividad: ___","",""],
        ["-Conducta Sexual: ___","",""],
      ],
        
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 105 }, // Ajusta el ancho de la primera columna
        1: { cellWidth: 10 },  // Ajusta la columna del puntaje
        2: { cellWidth: 70 },  // Ajusta la columna del nombre
      },
      styles: { textColor: [0, 0, 0] },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }
    })

    autoTable(doc , {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["VIII. DIAGNOSTICO FINAL:"]],
      body: [[{ content: "Área Cognitiva",  rowSpan: 1, styles: { valign: "top", minCellHeight: 30 } }],
      [{ content: "Área Emocional",  rowSpan: 1, styles: { valign: "top", minCellHeight: 30 } }]],
      theme: "grid",
      styles: { textColor: [0, 0, 0] },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }
    })

    const firmaY = doc.lastAutoTable.finalY + 20; // Espacio después de la tabla

    const firmaImg = new Image();
    firmaImg.src = "/jaspers/Firma.png"; // Ruta de la imagen en public

    firmaImg.onload = function () {
      // Agregar la firma al PDF
      doc.addImage(firmaImg, "PNG", 150, firmaY - 15, 50, 20); // Ajustar posición y tamaño
      
      // Línea para la firma
      doc.line(140, firmaY, 200, firmaY); // Línea horizontal

      // Texto debajo de la línea
      doc.text("PSICÓLOGA / O", 160, firmaY + 5);

      // Generar PDF
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    };
  };

  

  return (
    <div>
      <button onClick={generatePDF}>Generar PDF</button>
    </div>
  );
};

export default FichaPsicologicaEmocional;