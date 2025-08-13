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
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [255, 255, 255], textColor: 0, lineWidth: 0.5 },
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
          content: `
Nombre: ${datos.nombre || ""}
Edad en años cumplidos: ${datos.edad || ""}
Fecha: ${datos.fecha || ""}
Género:   Masculino [${datos.genero === "M" ? "X" : " "}]   
Femenino [${datos.genero === "F" ? "X" : " "}]
Cuantos años y meses ha estado Ud. haciendo el presente tipo de trabajo:
Años: ${datos.anios || ""}   Meses: ${datos.meses || ""}
En promedio cuántas horas a la semana trabaja?: ${datos.horasSemana || ""}
Es Ud.: Diestro [${datos.diesto ? "X" : " "}]   Zurdo [${datos.zurdo ? "X" : " "}]
          `,
          styles: { valign: "top", cellWidth: 130 },
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
        { content: `¿Cómo responder el cuestionario?\n
En este dibujo Ud. puede ver la posición aproximada de las partes del cuerpo referidos en el cuestionario.
Ud. debe decidir cuál parte tiene o ha tenido molestias/problema (si lo ha tenido).
Por favor responda poniendo una X en el respectivo recuadro para cada pregunta.`, styles: {valign: "middle", halign: "center"}}
      ]
    ],
    didDrawCell: (data) => {
      // Dibuja imagen en la segunda columna
      if (data.row.index === 1 && data.column.index === 1) {
        const imgWidth = 40;
        const imgHeight = 50;
        const x = data.cell.x + (data.cell.width - imgWidth) / 2;
        const y = data.cell.y + (data.cell.height - imgHeight) / 2;
        doc.addImage("img/Nordico/nordico.png", "PNG", x, y, imgWidth, imgHeight);
      }
    },
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