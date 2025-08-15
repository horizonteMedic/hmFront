import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header_Cuestionario from "./Header_CuestionarioN";

export default function CuestionarioNordico(datos = {}) {

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 26;

  // 2) Encabezado (logo, campos, título)

  // 2) Encabezado (logo, campos, título)
  const sello1 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const isValidUrl = url => url && url !== "Sin registro";
  const loadImg = src =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'anonymous';
      img.onload = () => res(img);
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });
  Promise.all([
    isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
  ]).then(([s1]) => {
    // 2) Encabezado (logo, campos, título)
    header_Cuestionario(doc, datos);
    doc.setFont("helvetica", "bold").setFontSize(11);
      doc.text("CUESTIONARIO NÓRDICO DE SIGNOS Y SÍNTOMAS OSTEOMUSCULARES",pageW / 2, y, { align: "center" })

  autoTable(doc, {
    startY: y + 3,
    theme: "grid",
    margin: { left: 2, right: 2 },
    styles: { fontSize: 9, textColor: [0, 0, 0]},
    headStyles: {   lineWidth: 0.5,  lineHeight: 1.5 },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.5,
    body: [
      [
        {
          content: "1. DATOS PERSONALES",
          colSpan: 2,
          styles: { fontStyle: "bold" },
        },
      ],
      [
        {
      content: "",
              styles: { valign: "top", cellWidth: 150, minCellHeight: 38 },
            },
            {
              content: " ", // Aquí va la imagen
              styles: { halign: "center", valign: "middle" },
              rowSpan: 3
            },
          ],
          [
            { content: "2.- PROBLEMAS CON LOS ORGANOS DE LA LOCOMOCIÓN", styles: {fontStyle: "bold"}}
          ],
          [
            { content: `¿Cómo responder el cuestionario?
    En este dibujo Ud. puede ver la posición aproximada de las partes del cuerpo referidos en el cuestionario. Ud. debe decidir cuál parte tiene o ha tenido molestias/problema (si lo ha tenido). Por favor responda poniendo una X en el respectivo recuadro para cada pregunta.`, styles: {valign: "middle", halign: "center"}}
          ]
        ],
    didDrawCell: (data) => {
      // Dibuja imagen en la segunda columna
      if (data.row.index === 1 && data.column.index === 1) {
        const imgWidth = 40;
        const imgHeight = 55;
        const x = data.cell.x + (data.cell.width - imgWidth) / 2;
        const y = data.cell.y + (data.cell.height - imgHeight) / 2;
        doc.addImage("img/Nordico/nordico.png", "PNG", x, y, imgWidth, imgHeight);
      }
      // Texto alineado dentro del cuadro vacío (fila 1, col 0)
      if (data.row.index === 1 && data.column.index === 0) {
        const boxSize = 5;
        const textX = data.cell.x + 2; // margen interno izquierdo
        const textY = data.cell.y + 4; // margen superior
        doc.setFontSize(9);
        doc.text(`Nombre: ${datos.nombres}`, textX, textY);
        doc.text(`Edad en años cumplidos: ${datos.edad}`, textX, textY + 5);
        doc.text(`Fecha: ${datos.edad}`, textX + 98, textY + 5);

        doc.text(`Género:`, textX, textY + 10);
        doc.text(`Masculino:                        Femenino:`, textX + 30, textY + 10);

        doc.text(`Cuantos años y meses ha estado Ud. haciendo el presente tipo de trabajo:`, textX, textY + 15);
        doc.text(`Años:                                Meses:`, textX + 32, textY + 20);

        doc.text(`En promedio cuántas horas a la semana trabaja?`, textX, textY + 25);
        doc.text(`Es Ud: `, textX, textY + 30);
        doc.text(`Diestro:                              Zurdo:`, textX+31, textY + 30);
        //GENERO
        doc.setDrawColor(0); // Negro
        doc.setLineWidth(0.5);
        doc.rect(textX + 48, textY + 7 , boxSize, boxSize); // Cuadro pequeño
        doc.rect(textX + 85, textY + 7 , boxSize, boxSize); // Cuadro pequeño
        //Años y Meses
        doc.rect(textX + 48, textY + 17 , boxSize, boxSize); // Cuadro pequeño
        doc.rect(textX + 85, textY + 17 , boxSize, boxSize); // Cuadro pequeño
        //Diestro o Zurdo
        doc.rect(textX + 48, textY + 27 , boxSize, boxSize); // Cuadro pequeño
        doc.rect(textX + 85, textY + 27 , boxSize, boxSize); // Cuadro pequeño
      }
    },
  });



  autoTable(doc, {
    startY: doc.lastAutoTable.finalY,
    theme: "grid",
    margin: { left: 2, right: 2 },
    styles: { fontSize: 9, textColor: [0, 0, 0]},
    headStyles: {   lineWidth: 0.5,  lineHeight: 1.5 },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.5,
    body: [
      [
        {
          content: "               Para ser respondido por todos",
          styles: { fontStyle: "bold", cellWidth: 85 },
        },
        {
          content: "       Para ser respondido únicamente por quienes han tenido problemas",
          styles: { fontStyle: "bold" }, colSpan: 2
        },
      ],
      [
        {
          content: "Ha tenido Ud. durante cualquier tiempo en los últimos 12 meses problemas (molestias, dolor o disconfort) en:"
        },
        {
          content: "Ha estado impedido en cualquier tiempo durante los pasados 12 meses para hacer sus rutinas habituales en el trabajo o su casa por este problema?",
          styles: { cellWidth: 65 }
        },
        {
          content: "Ud. Ha tenido problemas durante los últimos 7 días?",
        }
      ],
      [
        {
          content: "Cuello:                                   ",
          styles: { fontStyle: "bold", valign: "middle" }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        }
      ],
      [
        {
          content: `Hombros:             O NO
                              O Si, en el hombro derecho
                              O Si, en el hombro izquierdo
                              O Si, en ambos hombros`,
          styles: { fontStyle: "bold", valign: "middle" }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        }
      ],
      [
        {
          content: `Codos:                 O NO
                              O Si, en el codo derecho
                              O Si, en el codo izquierdo
                              O Si, en ambos codos`,
          styles: { fontStyle: "bold", valign: "middle" }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        }
      ],
      [
        {
          content: `Muñeca:               O NO
                              O Si, en la muñeca/mano derecha
                              O Si, en la muñeca/mano izquierda
                              O Si, en el ambas muñecas/manos`,
          styles: { fontStyle: "bold", valign: "middle" }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        }
      ],
    ],
      didDrawCell: (data) => {
      // Para las columnas de "Sí" y "No"
      if (data.section === "body" &&  data.row.index >= 2 && data.row.index <= 5 &&  (data.column.index === 1 || data.column.index === 2)) {
        const docInst = data.doc;
        const { x, y, height } = data.cell;

        // Posiciones para "No" y "Sí"
        const boxSize = 4; // Tamaño del cuadro
        const gap = 12; // Separación entre "No" y "Sí"
        doc.setDrawColor(0); // Negro
        doc.setLineWidth(0.5);
        // Texto "No"
        docInst.text("No", x + 10, y + height / 2 + 1);
        docInst.rect(x + 18, y + height / 2 - boxSize / 2, boxSize, boxSize);

        // Texto "Si"
        docInst.text("Si", x + 22 + gap, y + height / 2 + 1);
        docInst.rect(x + 30 + gap, y + height / 2 - boxSize / 2, boxSize, boxSize);
      }
      if (data.section === "body" &&  data.row.index === 2 && data.column.index === 0) {
        const docInst = data.doc;
        const { x, y, height } = data.cell;

        // Posiciones para "No" y "Sí"
        const boxSize = 4; // Tamaño del cuadro
        const gap = 12; // Separación entre "No" y "Sí"
        doc.setDrawColor(0); // Negro
        doc.setLineWidth(0.5);
        // Texto "No"
        docInst.text("No", x + 30, y + height / 2 + 1);
        docInst.rect(x + 38, y + height / 2 - boxSize / 2, boxSize, boxSize);

        // Texto "Si"
        docInst.text("Si", x + 42 + gap, y + height / 2 + 1);
        docInst.rect(x + 50 + gap, y + height / 2 - boxSize / 2, boxSize, boxSize);
      }
      
    }
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY,
    theme: "grid",
    margin: { left: 2, right: 2 },
    styles: { fontSize: 9, textColor: [0, 0, 0]},
    headStyles: {   lineWidth: 0.5,  lineHeight: 1.5 },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.5,
    bodyStyles: {fontSize: 7},
    body: [
      [
        {
          content: "Espalda Alta (Tórax):",
          styles: { fontStyle: "bold", valign: "middle", cellWidth: 85 }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        }
      ],
      [
        {
          content: "Espalda Baja (Región Lumbar):",
          styles: { fontStyle: "bold", valign: "middle", cellWidth: 85 }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        }
      ],
      [
        {
          content: "Una o ambas caderas/muslos:",
          styles: { fontStyle: "bold", valign: "middle", cellWidth: 85 }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        }
      ],
      [
        {
          content: "Una o ambas rodillas:",
          styles: { fontStyle: "bold", valign: "middle", cellWidth: 85 }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        }
      ],
      [
        {
          content: "Una o ambos tobillos/pies:",
          styles: { fontStyle: "bold", valign: "middle", cellWidth: 85 }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        },
        {
          content: "",
          styles: { cellWidth: 65, valign: "middle", halign: "center" }
        }
      ],
    ],
    didDrawCell: (data) => {
      //PRIMERA COLUMNA
      if (data.section === "body" &&  data.row.index >= 0 && data.row.index <= 4 && data.column.index === 0) {
        const docInst = data.doc;
        const { x, y, height } = data.cell;

        // Posiciones para "No" y "Sí"
        const boxSize = 4; // Tamaño del cuadro
        const gap = 12; // Separación entre "No" y "Sí"
        doc.setDrawColor(0); // Negro
        doc.setLineWidth(0.5);
        // Texto "No"
        docInst.text("No", x + 53, y + height / 2 + 1);
        docInst.rect(x + 59, y + height / 2 - boxSize / 2, boxSize, boxSize);

        // Texto "Si"
        docInst.text("Si", x + 60 + gap, y + height / 2 + 1);
        docInst.rect(x + 67 + gap, y + height / 2 - boxSize / 2, boxSize, boxSize);
      }
      if (data.section === "body" &&  data.row.index >= 0 && data.row.index <= 4 &&  (data.column.index === 1 || data.column.index === 2)) {
        const docInst = data.doc;
        const { x, y, height } = data.cell;

        // Posiciones para "No" y "Sí"
        const boxSize = 4; // Tamaño del cuadro
        const gap = 12; // Separación entre "No" y "Sí"
        doc.setDrawColor(0); // Negro
        doc.setLineWidth(0.5);
        // Texto "No"
        docInst.text("No", x + 10, y + height / 2 + 1);
        docInst.rect(x + 18, y + height / 2 - boxSize / 2, boxSize, boxSize);

        // Texto "Si"
        docInst.text("Si", x + 22 + gap, y + height / 2 + 1);
        docInst.rect(x + 30 + gap, y + height / 2 - boxSize / 2, boxSize, boxSize);
      }
    }
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY,
    theme: "grid",
    margin: { left: 2, right: 2 },
    styles: { fontSize: 9, textColor: [0, 0, 0]},
    headStyles: {   lineWidth: 0.5,  lineHeight: 1.5 },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.5,
    body: [
      [
        {
          content: "     2.- PROBLEMAS CON LA ESPALDA BAJA",
          styles: { fontStyle: "bold", cellWidth: 170 },
        },
        {
          content: " ",
          rowSpan: 2
        }
      ],
      [
        {
          content: "¿Cómo responder el cuestionario?\n En este dibujo Ud. puede ver la Parte del cuerpo referida en el cuestionario. problemas de espalda baja significan molestias. dolor o disconfort en el área indicada con irradiación o no hacia una o ambas piernas (ciática). Por favor responda poniendo una x en el respectivo recuadro para cada pregunta.", 
          styles: {valign: "middle", halign: "center", cellWidth: 170, fontSize: 7}
        }
      ]
    ],
      didDrawCell: (data) => {
      // Fila 1, columna 1 (contando desde 0) -> la celda de la imagen
        if (data.row.index === 0 && data.column.index === 1) {
          const imgWidth = 24;
          const imgHeight = 20;
          const x = data.cell.x + (data.cell.width - imgWidth) / 2;
          const y = data.cell.y + (data.cell.height - imgHeight) / 2;
          doc.addImage("img/Nordico/Espaldabaja.png", "PNG", x, y, imgWidth, imgHeight);
        }
    }
    });

    autoTable(doc, {
    startY: doc.lastAutoTable.finalY,
    theme: "grid",
    margin: { left: 2, right: 2 },
    styles: { fontSize: 9, textColor: [0, 0, 0]},
    headStyles: {   lineWidth: 0.5,  lineHeight: 1.5 },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.5,
    body: [
      [
        {
          content: " ",
          styles: { minCellHeight: 43 },
        }
      ]
    ],
    didDrawCell: (data) => {
      // Fila 1, columna 1 (contando desde 0) -> la celda de la imagen
        if (data.row.index === 0 && data.column.index === 0) {
        const boxSize = 4;
        const textX = data.cell.x + 2; // margen interno izquierdo
        const textY = data.cell.y + 4; // margen superior
        doc.setFontSize(8);
        doc.setDrawColor(0); // Negro
        doc.setLineWidth(0.5);

        doc.text(`1.- Ud ha tenido problemas en la espalda baja (molestias, dolor o disconfort) ?`, textX, textY);
        doc.text(`No`, textX + 160, textY);
        doc.rect(textX + 168, textY - 2, boxSize, boxSize); // Cuadro pequeño
        doc.text(`Si`, textX + 180, textY);
        doc.rect(textX + 188, textY - 2, boxSize, boxSize); // Cuadro pequeño
        doc.setFont("helvetica", "bold");
        doc.text(`Si Ud. respondió NO a la pregunta 1, no responda las preguntas de la 2 a la 8.`, textX, textY + 4);
        doc.setFont("helvetica", "normal");

        doc.text(`2.- Ud. ha estado hospitalizado por problemas de espalda baja?`, textX , textY + 8);
        doc.text(`No`, textX + 160, textY + 6);
        doc.rect(textX + 168, textY + 4, boxSize, boxSize); // Cuadro pequeño
        doc.text(`Si`, textX + 180, textY + 6);
        doc.rect(textX + 188, textY + 4, boxSize, boxSize); // Cuadro pequeño

        doc.text(`3.- Ud. ha tenido cambios de trabajo o actividad por problemas de esplada baja?`, textX, textY + 12);
        doc.text(`No`, textX + 160, textY + 12);
        doc.rect(textX + 168, textY + 10, boxSize, boxSize); // Cuadro pequeño
        doc.text(`Si`, textX + 180, textY + 12);
        doc.rect(textX + 188, textY + 10, boxSize, boxSize); // Cuadro pequeño

        doc.text(`4.- Cuál es la duración total del tiempo en que ha tenido problemas de espalda baja durante los ultimos 12 meses?:`, textX, textY + 16);
        doc.text(`0 Días`, textX + 15, textY + 20);
        doc.text(`1-7 Días`, textX + 35, textY + 20);
        doc.text(`8-30 Días`, textX + 55, textY + 20);
        doc.text(`Más de 30 Días`, textX + 75, textY + 20);
        doc.text(`Todos los Días`, textX + 95, textY + 20);

        doc.text(`Si Ud. respondió 0 días a la pregunta 4, No responda las preguntas 5 a la 8`, textX, textY + 24);
        
        doc.text(`5.- Los problemas de espalda baja han causado a Ud. reducción de su actividad física durante los ultimos 12 meses?`, textX, textY + 28);
        doc.text(`a. Actividades de trabajo (en el trabajo o la casa)`, textX+8, textY + 32);
        doc.text(`No`, textX + 160, textY + 31);
        doc.rect(textX + 168, textY + 28, boxSize, boxSize); // Cuadro pequeño
        doc.text(`Si`, textX + 180, textY +31);
        doc.rect(textX + 188, textY + 28, boxSize, boxSize); // Cuadro pequeño
        
        doc.text(`b. Actividades recreativas`, textX +8, textY + 36);
        doc.text(`No`, textX + 160, textY + 36);
        doc.rect(textX + 168, textY + 34, boxSize, boxSize); // Cuadro pequeño
        doc.text(`Si`, textX + 180, textY + 36);
        doc.rect(textX + 188, textY + 34, boxSize, boxSize); // Cuadro pequeño
        
      }
      }
    });

  // ====== TABLA 2: PROBLEMAS CON ÓRGANOS DE LA LOCOMOCIÓN ======
  

      

      if (s1) {
  const canvas = document.createElement('canvas');
  canvas.width = s1.width;
  canvas.height = s1.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(s1, 0, 0);
  const selloBase64 = canvas.toDataURL('image/png');

  // Dimensiones deseadas del sello
  const sigW = 40; // ancho del sello
  const sigH = 40; // alto del sello

  const pageW = doc.internal.pageSize.getWidth();
  const marginRight = 18;

  // Posición del sello: derecha del cuadro de comentarios
  const sigX = pageW - marginRight - sigW;
  const sigY = doc.lastAutoTable.finalY - 30; // ajusta según se vea

  // Escalado proporcional
  const maxImgW = sigW - 5;
  const maxImgH = sigH - 5;

  let imgW = s1.width;
  let imgH = s1.height;

  const scaleW = maxImgW / imgW;
  const scaleH = maxImgH / imgH;
  const scale = Math.min(scaleW, scaleH, 1);

  imgW *= scale;
  imgH *= scale;

  const imgX = sigX + (sigW - imgW) / 2;
  const imgY = sigY + (sigH - imgH) / 2;

  doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
}


      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => iframe.contentWindow.print();

    })

    
}