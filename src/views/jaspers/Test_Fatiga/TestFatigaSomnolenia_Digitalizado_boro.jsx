import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header_TestFAtiga from "./Header_TestFatiga";
import footer_TestFatiga from "./Footer_TestFatiga";
export default function TestFatigaSomnolenia_Digitalizado_boro(datos = {}) {

  function drawXInBox(doc, x, y, width, height, color = [0, 0, 255], scale = 3) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    doc.setTextColor(...color);   // Color (por defecto azul)
    doc.setFontSize(Math.min(width, height) * scale); // Tamaño proporcional al cuadro
    doc.text("X", centerX, centerY, { align: "center", baseline: "middle" });

    // Resetear color a negro para no afectar el resto
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8)
  }

  function drawX(docInst, x, y, boxSize) {
    docInst.setTextColor(0, 0, 255); // Azul
    docInst.setFontSize(10);
    docInst.text("X", x + boxSize / 2, y + boxSize / 2 + 1.5, { align: "center" });
    doc.setTextColor(0, 0, 0);
    docInst.setFontSize(9)
  }

  function drawCircle(doc, x, y) {
    doc.setDrawColor(0);     // Color negro para el borde
    doc.setLineWidth(0.5);   // Grosor del borde
    doc.circle(x, y, 1.3, "S"); // "S" = solo borde (stroke)
  }

  function drawXInCircle(doc, cx, cy, r) {
    const offset = r * 0.8; // tamaño de la X en función del radio
    doc.setDrawColor(0, 0, 255); // azul para la X
    doc.setLineWidth(0.5);

    // Línea diagonal \
    doc.line(cx - offset, cy - offset, cx + offset, cy + offset);

    // Línea diagonal /
    doc.line(cx - offset, cy + offset, cx + offset, cy - offset);
    doc.setDrawColor(0, 0, 0);
  }

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 10;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 20;

  // 2) Encabezado (logo, campos, título)

  // 2) Encabezado (logo, campos, título)
  const sello1 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const sello2 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "FIRMAP");
  const sello3 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "HUELLA");
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
    isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
    isValidUrl(sello3?.url) ? loadImg(sello3.url) : Promise.resolve(null),
  ]).then(([s1,s2,s3]) => {
    // 2) Encabezado (logo, campos, título)
    header_TestFAtiga(doc, datos);
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("TEST DE FATIGA Y SOMNOLENCIA",pageW / 2, y, { align: "center" })

    doc.setFont("helvetica", "bold").setFontSize(9);  
    doc.text("Apellidos y Nombres:", 10, y + 10)
    doc.text("Edad:", 135, y + 10)
    doc.text("Sexo:", 170, y + 10)

    doc.text("Puesto de Trabajo:", 10, y + 15)
    doc.text("Fecha:", 130, y + 15)

    doc.text("Empresa:", 10, y + 20)
    
    doc.setFont("helvetica", "normal")
    doc.text(`${datos.nombres ? datos.nombres : "asd"}`, 47, y + 10)
    doc.text(`${datos.edad ? datos.edad + " AÑOS" : "asd"}`, 145, y + 10)
    doc.text(`${datos.sexoPa === "F" ? "FEMENINO" : datos.sexoPa === "M" ? "MASCULINO" : "asd"}`, 182, y + 10)

    doc.text(`${datos.areaO ? datos.areaO : "asd"}`, 42, y + 15)
    doc.text(`${datos.fexamen ? datos.fexamen : "15/04/2002"}`, 143, y + 15)

    doc.text(`${datos.razonEmpresa ? datos.razonEmpresa : "asd"}`, 30, y + 20)
    
    y += 24
    autoTable(doc, {
      startY: y,
      theme: "grid",
      margin: { left: margin, right: margin },
       styles: { 
        fontSize: 9, 
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],   // color de las líneas internas
        lineWidth: 0.5          // grosor de las líneas internas
      },
      tableLineColor: [0, 0, 0], // color del borde externo
      tableLineWidth: 0.5,       // grosor del borde externo
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.5,
      body: [
        [
          { content: `Que tan probable es que usted cabecee o se quede dormido en las siguientes situaciones?. Considere los últimos meses de sus actividades habituales. No se refiere a sentirse cansado debido a actividad física. Aunque no haya realizado últimamente las situaciones descritas, considere como le habrian afectado. Use la siguiente escala y marque con una "X" la opción mas apropiada para cada situación.`
            , styles: { cellPadding: 3, }
          }
        ],
        [
          { content: "", styles: {minCellHeight: 37}}
        ],
      ],
      didDrawCell: (data) => {
        // Detectar la segunda fila (index 1) y la primera columna (index 0)
        if (data.row.index === 1 && data.column.index === 0) {
          const cell = data.cell;
          const startX = cell.x + 40; // margen interno
          const startY = cell.y + 3;

          autoTable(doc, {
            startY: startY,
            margin: { left: startX, right: startX },
            theme: "grid",
            styles: { 
              fontSize: 7, 
              textColor: [0, 0, 0],
              lineColor: [0, 0, 0],
              lineWidth: 0.5 
            },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.5,
            body: [
              [
                { content: "Descripción", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
                { content: "Puntaje", styles: { valign: "middle", halign: "center", fontStyle: "bold" }}
              ],
              ["Nunca me quedaría dormido", { content: "0", styles: {valign: "middle", halign: "center" }}],
              ["Poca probabilidad de quedarme dormido", { content: "1", styles: {valign: "middle", halign: "center" }}],
              ["Moderada probabilidad de quedarme dormido", { content:"2", styles: {valign: "middle", halign: "center" }}],
              ["Alta probabilidad de quedarme dormido", { content:"3", styles: {valign: "middle", halign: "center" }}],
            ],
          });
        }
      }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      theme: "grid",
      margin: { left: margin, right: margin },
       styles: { 
        fontSize: 9, 
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],   // color de las líneas internas
        lineWidth: 0.5          // grosor de las líneas internas
      },
      tableLineColor: [0, 0, 0], // color del borde externo
      tableLineWidth: 0.5,       // grosor del borde externo
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.5,
      body: [
        [
          { content: `Situación`, colSpan: 2, rowSpan: 2, styles: { cellPadding: 3, valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: `Probabilidad de cabecear`, colSpan: 4, rowSpan: 1, styles: { valign: "middle", halign: "center", fontStyle: "bold" }}
        ],
        [
          { content: "Nunca", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "Poca", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "Moderada", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "Alta", styles: { valign: "middle", halign: "center", fontStyle: "bold" }}
        ],
        [
          { content: "1", styles: { valign: "middle", halign: "center"}},
          { content: "Sentado Leyendo"},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }}
        ],
        [
          { content: "2", styles: { valign: "middle", halign: "center"}},
          { content: "Viendo televisión"},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }}
        ],
        [
          { content: "3", styles: { valign: "middle", halign: "center"}},
          { content: "Sentado (por ejemplo en el teatro, en una reunión, en el cine, en una conferencia, escuchando misa o en el culto)"},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }}
        ],
        [
          { content: "4", styles: { valign: "middle", halign: "center"}},
          { content: "Como pasajero en un automóvil, ómnibus, micro o combi durante una hora o menos de recorrido"},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }}
        ],
        [
          { content: "5", styles: { valign: "middle", halign: "center"}},
          { content: "Recostado en la tarde si las circunstancias lo permiten"},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }}
        ],
        [
          { content: "6", styles: { valign: "middle", halign: "center"}},
          { content: "Sentado conversando con alguien"},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }}
        ],
        [
          { content: "7", styles: { valign: "middle", halign: "center"}},
          { content: "Sentado luego del almuerzo y sin haber bebido"},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }}
        ],
        [
          { content: "8", styles: { valign: "middle", halign: "center"}},
          { content: "Conduciendo el automóvil cuando se detiene algunos minutos por razones de tráfico"},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }}
        ],
        [
          { content: "9", styles: { valign: "middle", halign: "center"}},
          { content: "Parado y apoyándose o no en una pared o mueble",},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }},
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold" }}
        ],
        [
          { content: "Puntaje", styles: { valign: "middle", halign: "right", fontStyle: "bold"}, colSpan: 2 },
          { content: "", styles: { valign: "middle", halign: "center", fontStyle: "bold"}, colSpan: 4}
        ]
      ],
      columnStyles: {
        0: { cellWidth: 10 },   // 👈 Ancho fijo para el número
        1: { cellWidth: 115 },  // 👈 Ancho fijo para la descripción
      }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      theme: "grid",
      margin: { left: margin, right: margin },
       styles: { 
        fontSize: 10, 
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],   // color de las líneas internas
        lineWidth: 0.5          // grosor de las líneas internas
      },
      tableLineColor: [0, 0, 0], // color del borde externo
      tableLineWidth: 0.5,       // grosor del borde externo
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.5,
      body: [
        [
          { content: "", styles: {minCellHeight: 47}}
        ],
      ],
      didDrawCell: (data) => {
        // Detectar la segunda fila (index 1) y la primera columna (index 0)
        if (data.row.index === 0 && data.column.index === 0) {
          const cell = data.cell;
          const startX = cell.x + 50; // margen interno
          const startY = cell.y + 3;

          autoTable(doc, {
            startY: startY,
            margin: { left: startX, right: startX },
            theme: "grid",
            styles: { 
              fontSize: 9, 
              textColor: [0, 0, 0],
              lineColor: [0, 0, 0],
              lineWidth: 0.5 
            },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.5,
            body: [
              [
                { content: "", styles: { minCellHeight: 26 }},
              ]
            ],
            
          });
          doc.setFont("helvetica", "bold")
          doc.text("Pregunta Obligatoria", startX + 28, startY + 4)
          doc.setFont("helvetica", "normal").setFontSize(9);

          doc.text(`Usted maneja vehículos motorizados (auto, camioneta,\n                ómnibus, combi, montacarga, grúa, etc)?`, startX + 6, startY + 10)
          doc.setFont("helvetica", "bold").setFontSize(14);
          doc.text(`SI`, startX + 16, startY + 22)
          doc.rect(startX + 24, startY + 17, 6, 6); // Cuadro pequeño

          doc.text(`NO`, startX + 63, startY + 22)
          doc.rect(startX + 74, startY + 17, 6, 6); // Cuadro pequeño

          autoTable(doc, {
            startY: startY + 28,
            margin: { left: startX - 44, right: startX - 44 },
            theme: "grid",
            styles: { 
              fontSize: 9, 
              textColor: [0, 0, 0],
              lineColor: [0, 0, 0],
              lineWidth: 0.5 
            },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.5,
            body: [
              [
                { content: `Calificación: El puntaje total se obtiene sumando el puntaje de cada situación. Para personas que manejan vehículos motorizados, se suman los primeros ocho ítems. Para personas que no manejan vehículos motorizados, se suma los primeros siete ítems y el ítem nueve.`, },
              ]
            ],
            
          });
          doc.setFont("helvetica", "bold").setFontSize(9);
          const texto = "Puntaje mayor a 10, será considerado POSITIVO";
          const x = startX + 14;
          const y = startY + 40;
          doc.text(texto, x, y);

          // Medir ancho del texto
          const anchoTexto = doc.getTextWidth(texto);

          // Dibujar la línea debajo del texto (subrayado)
          doc.setLineWidth(0.3); // grosor de la línea
          doc.line(x, y + 1, x + anchoTexto, y + 1); 
        }
      }
    });

    footer_TestFatiga(doc, datos)


      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => iframe.contentWindow.print();

    })

    
}