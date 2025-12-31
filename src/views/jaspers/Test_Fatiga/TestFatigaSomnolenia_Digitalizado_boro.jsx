import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header_TestFAtiga from "./Header_TestFatiga";
import footer_TestFatiga from "./Footer_TestFatiga";
export default async function TestFatigaSomnolenia_Digitalizado_boro(datos = {}) {

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
  ]).then(([s1, s2, s3]) => {
    // 2) Encabezado (logo, campos, título)
    header_TestFAtiga(doc, datos);
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("TEST DE FATIGA Y SOMNOLENCIA", pageW / 2, y, { align: "center" })

    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("Apellidos y Nombres:", 10, y + 10)
    doc.text("Edad:", 135, y + 10)
    doc.text("Sexo:", 170, y + 10)

    doc.text("Puesto de Trabajo:", 10, y + 15)
    doc.text("Fecha:", 170, y + 15)

    doc.text("Empresa:", 10, y + 20)

    doc.setFont("helvetica", "normal")
    doc.rect(45, y + 6, 88, 5);
    doc.text(`${datos.nombres ? datos.nombres : "asd"}`, 47, y + 10)
    doc.rect(144, y + 6, 22, 5);
    doc.text(`${datos.edad ? datos.edad + " AÑOS" : "asd"}`, 145, y + 10)
    doc.rect(180, y + 6, 27, 5);
    doc.text(`${datos.sexoPa === "F" ? "FEMENINO" : datos.sexoPa === "M" ? "MASCULINO" : "asd"}`, 182, y + 10)

    doc.rect(40, y + 11, 126, 5); // Área
    doc.text(`${datos.areaO ? datos.areaO : "asd"}`, 42, y + 15)
    doc.rect(181, y + 11, 26, 5); // Fecha Examen
    doc.text(`${datos.fexamen ? datos.fexamen : "15/04/2002"}`, 184, y + 15)

    doc.rect(28, y + 17, 179, 5); // Empresa
    doc.text(`${datos.razonEmpresa ? datos.razonEmpresa : "asd"}`, 30, y + 21)

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
      body: [
        [
          {
            content: `                              es que usted                                                    en las siguientes situaciones?. Considere los últimos meses de sus actividades habituales. No se refiere a sentirse cansado debido a actividad física. Aunque no haya realizado últimamente las situaciones descritas, considere como le habrian afectado. Use la siguiente escala y marque con una "X" la opción mas apropiada para cada situación.`
            , styles: { cellPadding: 3, }
          }
        ],
        [
          { content: "", styles: { minCellHeight: 37 } }
        ],
      ],
      didDrawCell: (data) => {
        // Detectar la segunda fila (index 1) y la primera columna (index 0)
        if (data.row.index === 0 && data.column.index === 0) {
          const cell = data.cell;
          const startX = cell.x; // margen interno
          const startY = cell.y;
          doc.setFont("helvetica", "bold")
          doc.text("Que tan probable", startX + 2.8, startY + 5.8)
          doc.text("cabecee o se quede dormido", startX + 49, startY + 5.7)
          doc.setFont("helvetica", "normal")
        }

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
                { content: "Descripción", styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
                { content: "Puntaje", styles: { valign: "middle", halign: "center", fontStyle: "bold" } }
              ],
              ["Nunca me quedaría dormido", { content: "0", styles: { valign: "middle", halign: "center" } }],
              ["Poca probabilidad de quedarme dormido", { content: "1", styles: { valign: "middle", halign: "center" } }],
              ["Moderada probabilidad de quedarme dormido", { content: "2", styles: { valign: "middle", halign: "center" } }],
              ["Alta probabilidad de quedarme dormido", { content: "3", styles: { valign: "middle", halign: "center" } }],
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
      body: [
        [
          { content: `Situación`, colSpan: 2, rowSpan: 2, styles: { cellPadding: 3, valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `Probabilidad de cabecear`, colSpan: 4, rowSpan: 1, styles: { valign: "middle", halign: "center", fontStyle: "bold" } }
        ],
        [
          { content: "Nunca", styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: "Poca", styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: "Moderada", styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: "Alta", styles: { valign: "middle", halign: "center", fontStyle: "bold" } }
        ],
        [
          { content: "1", styles: { valign: "middle", halign: "center" } },
          { content: "Sentado Leyendo" },
          { content: `${datos.rbs1Nunca ? "0" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs1Poca ? "1" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs1Moderada ? "2" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs1Alta ? "3" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } }
        ],
        [
          { content: "2", styles: { valign: "middle", halign: "center" } },
          { content: "Viendo televisión" },
          { content: `${datos.rbs2Nunca ? "0" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs2Poca ? "1" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs2Moderada ? "2" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs2Alta ? "3" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } }
        ],
        [
          { content: "3", styles: { valign: "middle", halign: "center" } },
          { content: "Sentado (por ejemplo en el teatro, en una reunión, en el cine, en una conferencia, escuchando misa o en el culto)" },
          { content: `${datos.rbs3Nunca ? "0" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs3Poca ? "1" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs3Moderada ? "2" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs3Alta ? "3" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } }
        ],
        [
          { content: "4", styles: { valign: "middle", halign: "center" } },
          { content: "Como pasajero en un automóvil, ómnibus, micro o combi durante una hora o menos de recorrido" },
          { content: `${datos.rbs4Nunca ? "0" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs4Poca ? "1" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs4Moderada ? "2" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs4Alta ? "3" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } }
        ],
        [
          { content: "5", styles: { valign: "middle", halign: "center" } },
          { content: "Recostado en la tarde si las circunstancias lo permiten" },
          { content: `${datos.rbs5Nunca ? "0" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs5Poca ? "1" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs5Moderada ? "2" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs5Alta ? "3" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } }
        ],
        [
          { content: "6", styles: { valign: "middle", halign: "center" } },
          { content: "Sentado conversando con alguien" },
          { content: `${datos.rbs6Nunca ? "0" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs6Poca ? "1" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs6Moderada ? "2" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs6Alta ? "3" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } }
        ],
        [
          { content: "7", styles: { valign: "middle", halign: "center" } },
          { content: "Sentado luego del almuerzo y sin haber bebido" },
          { content: `${datos.rbs7Nunca ? "0" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs7Poca ? "1" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs7Moderada ? "2" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs7Alta ? "3" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } }
        ],
        [
          { content: "8", styles: { valign: "middle", halign: "center" } },
          { content: "Conduciendo el automóvil cuando se detiene algunos minutos por razones de tráfico" },
          { content: `${datos.rbs8Nunca ? "0" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs8Poca ? "1" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs8Moderada ? "2" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs8Alta ? "3" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } }
        ],
        [
          { content: "9", styles: { valign: "middle", halign: "center" } },
          { content: "Parado y apoyándose o no en una pared o mueble", },
          { content: `${datos.rbs9Nunca ? "0" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs9Poca ? "1" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs9Moderada ? "2" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } },
          { content: `${datos.rbs9Alta ? "3" : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" } }
        ],
        [
          { content: "Puntaje", styles: { valign: "middle", halign: "right", fontStyle: "bold" }, colSpan: 2 },
          { content: `${datos.txtPuntaje ? datos.txtPuntaje : ""}`, styles: { valign: "middle", halign: "center", fontStyle: "bold" }, colSpan: 4 }
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
      body: [
        [
          { content: "", styles: { minCellHeight: 47 } }
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
                { content: "", styles: { minCellHeight: 26 } },
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
          if (datos.rbSi === true) {
            drawXInBox(doc, startX + 24, startY + 17, 6, 5); // Cuadro Masculino
          } else if (datos.rbNo === true) {
            drawXInBox(doc, startX + 74, startY + 17, 6, 5); // Cuadro Femenino
          }

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

    function addScaledImage(doc, imgElement, maxImgW, maxImgH, centerX, baseY) {
      const canvas = document.createElement('canvas');
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgElement, 0, 0);
      const base64 = canvas.toDataURL('image/png');

      let imgW = imgElement.width;
      let imgH = imgElement.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1);

      imgW *= scale;
      imgH *= scale;

      const imgX = centerX - imgW / 2;
      const imgY = baseY - imgH - 2; // encima de la línea con 2px de margen

      doc.addImage(base64, 'PNG', imgX, imgY, imgW, imgH);
    }
    const FirmaY = doc.lastAutoTable.finalY + 25

    if (s1) {
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');

      // ===== Dimensiones máximas permitidas =====
      const maxImgW = 50; // ancho máximo del sello
      const maxImgH = 30; // alto máximo del sello

      // ===== Escalado proporcional =====
      let imgW = s1.width;
      let imgH = s1.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1);

      imgW *= scale;
      imgH *= scale;

      // ===== Línea de firma =====
      const lineStart = 130;
      const lineEnd = 180;
      const lineMid = (lineStart + lineEnd) / 2; // punto medio en X

      // ===== Posición de la imagen centrada en la línea =====
      const imgX = lineMid - imgW / 2;
      const imgY = FirmaY - imgH - 2; // 2 px de margen arriba de la línea

      // ===== Agregar el sello =====
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    }



    const lineStart = 20;
    const lineEnd = 80;
    const lineMid = (lineStart + lineEnd) / 2; // punto medio en X
    // ===== Tamaño máximo permitido =====
    const maxImgW = 25;
    const maxImgH = 25;

    doc.line(lineStart, FirmaY, lineEnd, FirmaY);
    doc.text("Firma del Trabajador Evaluado", 26, FirmaY + 4);

    doc.line(130, FirmaY, 180, FirmaY);
    doc.text("Firma y sello del Médico", 130 + 8, FirmaY + 4);

    if (s2) {
      const centerX = (lineStart + lineMid) / 2; // punto medio de la izquierda
      addScaledImage(doc, s2, maxImgW + 10, maxImgH + 10, centerX + 10, FirmaY);

    }

    // ===== Agregar s3 (derecha del medio) =====
    if (s3) {
      const centerX = (lineMid + lineEnd) / 2; // punto medio de la derecha
      addScaledImage(doc, s3, maxImgW, maxImgH, centerX + 20, FirmaY);
    }
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