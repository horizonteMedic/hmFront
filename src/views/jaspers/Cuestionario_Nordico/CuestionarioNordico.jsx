import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header_Cuestionario from "./Header_CuestionarioN";

export default function CuestionarioNordico(datos = {}, docExistente = null) {

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

  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4" });
  const margin = 5;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 26;

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
  return Promise.all([
    isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
    isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
    isValidUrl(sello3?.url) ? loadImg(sello3.url) : Promise.resolve(null),
  ]).then(([s1, s2, s3]) => {
    // 2) Encabezado (logo, campos, título)
    header_Cuestionario(doc, datos);
    doc.setFont("helvetica", "bold").setFontSize(11);
    doc.text("CUESTIONARIO NÓRDICO DE SIGNOS Y SÍNTOMAS OSTEOMUSCULARES", pageW / 2, y, { align: "center" })

    autoTable(doc, {
      startY: y + 3,
      theme: "grid",
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, textColor: [0, 0, 0] },
      headStyles: { lineWidth: 0.5, lineHeight: 1.5 },
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
          { content: "2.- PROBLEMAS CON LOS ORGANOS DE LA LOCOMOCIÓN", styles: { fontStyle: "bold" } }
        ],
        [
          {
            content: `¿Cómo responder el cuestionario?
    En este dibujo Ud. puede ver la posición aproximada de las partes del cuerpo referidos en el cuestionario. Ud. debe decidir cuál parte tiene o ha tenido molestias/problema (si lo ha tenido). Por favor responda poniendo una X en el respectivo recuadro para cada pregunta.`, styles: { valign: "middle", halign: "center" }
          }
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
          const boxSize = 4;
          const textX = data.cell.x + 2; // margen interno izquierdo
          const textY = data.cell.y + 4; // margen superior
          doc.setFontSize(9);
          doc.text(`Nombre: ${datos.nombres}`, textX, textY);
          doc.text(`Edad en años cumplidos: ${datos.edad} AÑOS`, textX, textY + 5);
          doc.text(`Fecha: ${datos.fechaCuestionario}`, textX + 98, textY + 5);

          doc.text(`Género:`, textX, textY + 10);
          doc.text(`Masculino:                        Femenino:`, textX + 30, textY + 10);

          doc.text(`Cuantos años y meses ha estado Ud. haciendo el presente tipo de trabajo:`, textX, textY + 15);
          doc.text(`Años:                                Meses:`, textX + 32, textY + 20);

          doc.text(`En promedio cuántas horas a la semana trabaja?`, textX, textY + 25);
          if (datos.horasTrabajadas) {
            doc.setFontSize(11)
            doc.text(`${datos.horasTrabajadas} hrs`, textX + 75, textY + 25);
            doc.setFontSize(9)
          }
          doc.text(`Es Ud: `, textX, textY + 30);
          doc.text(`Diestro:                              Zurdo:`, textX + 31, textY + 30);
          //GENERO Mascuilo - Femenino
          doc.setDrawColor(0); // Negro
          doc.setLineWidth(0.5);
          doc.rect(textX + 48, textY + 7, 6, 5); // Cuadro pequeño
          doc.rect(textX + 85, textY + 7, 6, 5); // Cuadro pequeño
          //X Genero
          if (datos.sexo === "M") {
            drawXInBox(doc, textX + 48, textY + 7, 6, 5); // Cuadro Masculino
          } else if (datos.sexo === "F") {
            drawXInBox(doc, textX + 85, textY + 7, 6, 5); // Cuadro Femenino
          }

          //Años y Meses
          doc.rect(textX + 48, textY + 17, 6, 5); // Cuadro pequeño
          if (datos.anios) {
            doc.setFontSize(11)
            const centerX = textX + 48 + 6 / 2;   // centro en X
            const centerY = textY + 17 + 5 / 2;   // centro en Y
            doc.text(`${datos.anios}`, centerX, centerY + 1.5, { align: "center" });
          }
          doc.rect(textX + 85, textY + 17, 6, 5); // Cuadro pequeño
          if (datos.meses) {
            doc.setFontSize(11)
            const centerX = textX + 85 + 6 / 2;
            const centerY = textY + 17 + 5 / 2;
            doc.text(`${datos.meses}`, centerX, centerY + 1.5, { align: "center" });
          }
          //Diestro o Zurdo
          doc.rect(textX + 48, textY + 27, 6, 5); // Cuadro pequeño
          doc.rect(textX + 85, textY + 27, 6, 5); // Cuadro pequeño
          //X
          if (datos.esDiestro === true) {
            drawXInBox(doc, textX + 48, textY + 27, 6, 5); // Cuadro Masculino
          } else if (datos.esZurdo === true) {
            drawXInBox(doc, textX + 85, textY + 27, 6, 5); // Cuadro Femenino
          }
        }
      },
    });



    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      theme: "grid",
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, textColor: [0, 0, 0] },
      headStyles: { lineWidth: 0.5, lineHeight: 1.5 },
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
            styles: { cellWidth: 60, valign: "middle", halign: "center" }
          },
          {
            content: "",
            styles: { cellWidth: 50, valign: "middle", halign: "center" }
          }
        ],
        [
          {
            content: `Hombros:`,
            styles: { fontStyle: "bold", valign: "top", minCellHeight: 18 }
          },
          {
            content: "",
            styles: { cellWidth: 65, valign: "middle", halign: "center" }
          },
          {
            content: "",
            styles: { cellWidth: 50, valign: "middle", halign: "center" }
          }
        ],
        [
          {
            content: `Codos:`,
            styles: { fontStyle: "bold", valign: "top", minCellHeight: 18 }
          },
          {
            content: "",
            styles: { cellWidth: 65, valign: "middle", halign: "center" }
          },
          {
            content: "",
            styles: { cellWidth: 50, valign: "middle", halign: "center" }
          }
        ],
        [
          {
            content: `Muñeca:`,
            styles: { fontStyle: "bold", valign: "top", minCellHeight: 18 }
          },
          {
            content: "",
            styles: { cellWidth: 65, valign: "middle", halign: "center" }
          },
          {
            content: "",
            styles: { cellWidth: 50, valign: "middle", halign: "center" }
          }
        ],
      ],
      didDrawCell: (data) => {
        // Para las columnas de "Sí" y "No"
        if (data.section === "body" && data.row.index >= 2 && data.row.index <= 5 && (data.column.index === 1 || data.column.index === 2)) {
          const docInst = data.doc;
          const { x, y, height } = data.cell;

          // Posiciones para "No" y "Sí"
          const boxSize = 4; // Tamaño del cuadro
          const gap = 12; // Separación entre "No" y "Sí"
          doc.setDrawColor(0); // Negro
          doc.setLineWidth(0.5);


          // === Mapeo para columna 1 ===
          const col1Map = {
            2: { no: "pregunta1CuelloNo", si: "pregunta1CuelloSi" },
            3: { no: "pregunta1HombrosNo", si: "pregunta1HombrosSi" },
            4: { no: "pregunta1CodosNo", si: "pregunta1CodosSi" },
            5: { no: "pregunta1MunecasNo", si: "pregunta1MunecasSi" },
          };

          // === Mapeo para columna 2 ===
          const col2Map = {
            2: { no: "pregunta2CuelloNo", si: "pregunta2CuelloSi" },
            3: { no: "pregunta2HombrosNo", si: "pregunta2HombrosSi" },
            4: { no: "pregunta2CodosNo", si: "pregunta2CodosSi" },
            5: { no: "pregunta2MunecasNo", si: "pregunta2MunecasSi" },
          };

          const map = data.column.index === 1 ? col1Map : col2Map;
          const { no, si } = map[data.row.index];

          // Dibujar "No"
          docInst.text("No", x + 10, y + height / 2 + 1);
          const noX = x + 18;
          const noY = y + height / 2 - boxSize / 2;
          docInst.rect(noX, noY, boxSize, boxSize);
          if (datos[no]) drawX(docInst, noX, noY, boxSize);

          // Dibujar "Sí"
          docInst.text("Si", x + 22 + gap, y + height / 2 + 1);
          const siX = x + 30 + gap;
          const siY = y + height / 2 - boxSize / 2;
          docInst.rect(siX, siY, boxSize, boxSize);
          if (datos[si]) drawX(docInst, siX, siY, boxSize);

        }
        if (data.section === "body" && data.row.index === 2 && data.column.index === 0) {
          const docInst = data.doc;
          const { x, y, height } = data.cell;

          // Posiciones para "No" y "Sí"
          const boxSize = 4; // Tamaño del cuadro
          const gap = 12; // Separación entre "No" y "Sí"
          doc.setDrawColor(0); // Negro
          doc.setLineWidth(0.5);

          const col1Map = {
            2: { no: "cuelloNo", si: "cuelloSi" },
          };
          const map = data.column.index === 0 && col1Map;
          const { no, si } = map[data.row.index];

          // Dibujar "No"
          docInst.text("No", x + 30, y + height / 2 + 1);
          const noX = x + 38;
          const noY = y + height / 2 - boxSize / 2;
          docInst.rect(noX, noY, boxSize, boxSize);
          if (datos[no]) drawX(docInst, noX, noY, boxSize);

          // Dibujar "Sí"
          docInst.text("Si", x + 42 + gap, y + height / 2 + 1);
          const siX = x + 50 + gap;
          const siY = y + height / 2 - boxSize / 2;
          docInst.rect(siX, siY, boxSize, boxSize);
          if (datos[si]) drawX(docInst, siX, siY, boxSize);
        }
        if (data.section === "body" && data.row.index >= 3 && data.row.index <= 5 && data.column.index === 0) {
          const docInst = data.doc;
          const { x, y, height } = data.cell;

          // Posiciones para "No" y "Sí"
          const circleR = 1.3; // radio del círculo
          const lineHeight = 4; // separación entre opciones

          // Mapeo de opciones por fila
          const opcionesMap = {
            3: [
              { key: "hombrosNo", label: "NO" },
              { key: "hombroDerechoSi", label: "Si, en el hombro derecho" },
              { key: "hombroIzquierdoSi", label: "Si, en el hombro izquierdo" },
              { key: "ambosHombrosSi", label: "Si, en ambos hombros" },
            ],
            4: [
              { key: "codosNo", label: "NO" },
              { key: "codoDerechoSi", label: "Si, en el codo derecho" },
              { key: "codoIzquierdoNo", label: "Si, en el codo izquierdo" },
              { key: "ambosCodosSi", label: "Si, en ambos codos" },
            ],
            5: [
              { key: "munecaNo", label: "NO" },
              { key: "munecaDerechaSi", label: "Si, en la muñeca derecha" },
              { key: "munecaIzquierdaSi", label: "Si, en la muñeca izquierda" },
              { key: "ambasMunecasSi", label: "Si, en ambas muñecas" },
            ],
          };

          const opciones = opcionesMap[data.row.index];

          // Dibujar cada opción en columna 0
          opciones.forEach((op, i) => {
            const cx = x + 30; // posición X del círculo
            const cy = y + (i * lineHeight) + 3; // posición Y
            docInst.setLineWidth(0.5);
            docInst.circle(cx, cy, circleR); // círculo vacío
            docInst.setLineWidth(0.2);
            docInst.text(op.label, cx + 6, cy + 1.5); // texto al lado
            docInst.setTextColor(0, 0, 255); // Azul
            if (datos[op.key]) {
              docInst.setFontSize(10);
              docInst.text("X", cx, cy, { align: "center", baseline: "middle" });
            }
            docInst.setTextColor(0, 0, 0);
          });
        }
      }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      theme: "grid",
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, textColor: [0, 0, 0] },
      headStyles: { lineWidth: 0.5, lineHeight: 1.5 },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.5,
      bodyStyles: { fontSize: 7 },
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
            styles: { cellWidth: 50, valign: "middle", halign: "center" }
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
            styles: { cellWidth: 50, valign: "middle", halign: "center" }
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
            styles: { cellWidth: 50, valign: "middle", halign: "center" }
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
            styles: { cellWidth: 50, valign: "middle", halign: "center" }
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
            styles: { cellWidth: 50, valign: "middle", halign: "center" }
          }
        ],
      ],
      didDrawCell: (data) => {
        //PRIMERA COLUMNA
        if (data.section === "body" && data.row.index >= 0 && data.row.index <= 4 && data.column.index === 0) {
          const docInst = data.doc;
          const { x, y, height } = data.cell;

          // Posiciones para "No" y "Sí"
          const boxSize = 4; // Tamaño del cuadro
          const gap = 12; // Separación entre "No" y "Sí"
          doc.setDrawColor(0); // Negro
          doc.setLineWidth(0.5);

          const col1Map = {
            0: { no: "espaldaAltaToraxNo", si: "espaldaAltaToraxSi" },
            1: { no: "espaldaBajaLumbarNo", si: "espaldaBajaLumbarSi" },
            2: { no: "caderasOMuslosNo", si: "caderasOMuslosSi" },
            3: { no: "rodillasNo", si: "rodillasSi" },
            4: { no: "tobillosOPiesNo", si: "tobillosOPiesSi" },
          };

          const map = data.column.index === 0 && col1Map;
          const { no, si } = map[data.row.index];
          docInst.setFontSize(7)
          // Dibujar "No"
          docInst.text("No", x + 53, y + height / 2 + 1);
          const noX = x + 59;
          const noY = y + height / 2 - boxSize / 2;
          docInst.rect(noX, noY, boxSize, boxSize);
          if (datos[no]) drawX(docInst, noX, noY, boxSize);
          docInst.setFontSize(7)
          // Dibujar "Sí"
          docInst.text("Si", x + 60 + gap, y + height / 2 + 1);
          const siX = x + 67 + gap;
          const siY = y + height / 2 - boxSize / 2;
          docInst.rect(siX, siY, boxSize, boxSize);
          if (datos[si]) drawX(docInst, siX, siY, boxSize);

        }
        if (data.section === "body" && data.row.index >= 0 && data.row.index <= 4 && (data.column.index === 1 || data.column.index === 2)) {
          const docInst = data.doc;
          const { x, y, height } = data.cell;

          // Posiciones para "No" y "Sí"
          const boxSize = 4; // Tamaño del cuadro
          const gap = 12; // Separación entre "No" y "Sí"
          doc.setDrawColor(0); // Negro
          doc.setLineWidth(0.5);

          const col1Map = {
            0: { no: "pregunta1EspaldaAltaToraxNo", si: "pregunta1EspaldaAltaToraxSi" },
            1: { no: "pregunta1EspaldaBajaLumbarNo", si: "pregunta1EspaldaBajaLumbarSi" },
            2: { no: "pregunta1CaderasOMuslosNo", si: "pregunta1CaderasOMuslosSi" },
            3: { no: "pregunta1RodillasNo", si: "pregunta1RodillasSi" },
            4: { no: "pregunta1TobillosOPiesNo", si: "pregunta1TobillosOPiesSi" },
          };

          const col2Map = {
            0: { no: "pregunta2EspaldaAltaToraxNo", si: "pregunta2EspaldaAltaToraxSi" },
            1: { no: "pregunta2EspaldaBajaLumbarNo", si: "pregunta2EspaldaBajaLumbarSi" },
            2: { no: "pregunta2CaderasOMuslosNo", si: "pregunta2CaderasOMuslosSi" },
            3: { no: "pregunta2RodillasNo", si: "pregunta2RodillasSi" },
            4: { no: "pregunta2TobillosOPiesNo", si: "pregunta2TobillosOPiesSi" },
          };

          const map = data.column.index === 1 ? col1Map : col2Map;
          const { no, si } = map[data.row.index];
          docInst.setFontSize(7)
          // Dibujar "No"
          docInst.text("No", x + 10, y + height / 2 + 1);
          const noX = x + 18;
          const noY = y + height / 2 - boxSize / 2;
          docInst.rect(noX, noY, boxSize, boxSize);
          if (datos[no]) drawX(docInst, noX, noY, boxSize);

          docInst.setFontSize(7)
          // Dibujar "Sí"
          docInst.text("Si", x + 22 + gap, y + height / 2 + 1);
          const siX = x + 30 + gap;
          const siY = y + height / 2 - boxSize / 2;
          docInst.rect(siX, siY, boxSize, boxSize);
          if (datos[si]) drawX(docInst, siX, siY, boxSize);
        }
      }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      theme: "grid",
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, textColor: [0, 0, 0] },
      headStyles: { lineWidth: 0.5, lineHeight: 1.5 },
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
            styles: { valign: "middle", halign: "center", cellWidth: 170, fontSize: 7 }
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
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, textColor: [0, 0, 0] },
      headStyles: { lineWidth: 0.5, lineHeight: 1.5 },
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
          const circleR = 1.3;
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
          if (datos.pregunta1EspaldaBajaNo === true) {
            drawXInBox(doc, textX + 168, textY - 2, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta1EspaldaBajaSi === true) {
            drawXInBox(doc, textX + 188, textY - 2, boxSize, boxSize); // Cuadro Femenino
          }
          doc.setFont("helvetica", "bold");
          doc.text(`Si Ud. respondió NO a la pregunta 1, no responda las preguntas de la 2 a la 8.`, textX, textY + 4);
          doc.setFont("helvetica", "normal");

          doc.text(`2.- Ud. ha estado hospitalizado por problemas de espalda baja?`, textX, textY + 8);
          doc.text(`No`, textX + 160, textY + 6);
          doc.rect(textX + 168, textY + 4, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 6);
          doc.rect(textX + 188, textY + 4, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta2EspaldaBajaNo === true) {
            drawXInBox(doc, textX + 168, textY + 4, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta2EspaldaBajaSi === true) {
            drawXInBox(doc, textX + 188, textY + 4, boxSize, boxSize); // Cuadro Femenino
          }

          doc.text(`3.- Ud. ha tenido cambios de trabajo o actividad por problemas de esplada baja?`, textX, textY + 12);
          doc.text(`No`, textX + 160, textY + 12);
          doc.rect(textX + 168, textY + 10, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 12);
          doc.rect(textX + 188, textY + 10, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta3EspaldaBajaNo === true) {
            drawXInBox(doc, textX + 168, textY + 10, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta3EspaldaBajaSi === true) {
            drawXInBox(doc, textX + 188, textY + 10, boxSize, boxSize); // Cuadro Femenino
          }

          doc.text(`4.- Cuál es la duración total del tiempo en que ha tenido problemas de espalda baja durante los ultimos 12 meses?:`, textX, textY + 16);
          drawCircle(doc, textX + 12, textY + 18.8)
          doc.text(`0 Días`, textX + 15, textY + 20);
          if (datos.pregunta4AEspaldaBaja === true) {
            drawXInCircle(doc, textX + 12, textY + 18.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 32, textY + 18.8)
          doc.text(`1-7 Días`, textX + 35, textY + 20);
          if (datos.pregunta4BEspaldaBaja === true) {
            drawXInCircle(doc, textX + 32, textY + 18.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 52, textY + 18.8)
          doc.text(`8-30 Días`, textX + 55, textY + 20);
          if (datos.pregunta4CEspaldaBaja === true) {
            drawXInCircle(doc, textX + 52, textY + 18.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 72, textY + 18.8)
          doc.text(`Más de 30 Días`, textX + 75, textY + 20);
          if (datos.pregunta4DEspaldaBaja === true) {
            drawXInCircle(doc, textX + 72, textY + 18.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 107, textY + 18.8)
          doc.text(`Todos los Días`, textX + 110, textY + 20);
          if (datos.pregunta4EEspaldaBaja === true) {
            drawXInCircle(doc, textX + 107, textY + 18.8, circleR); // Cuadro Masculino
          }

          doc.text(`Si Ud. respondió 0 días a la pregunta 4, No responda las preguntas 5 a la 8`, textX, textY + 24);

          doc.text(`5.- Los problemas de espalda baja han causado a Ud. reducción de su actividad física durante los ultimos 12 meses?`, textX, textY + 28);
          doc.text(`a. Actividades de trabajo (en el trabajo o la casa)`, textX + 8, textY + 32);
          doc.text(`No`, textX + 160, textY + 31);
          doc.rect(textX + 168, textY + 28, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 31);
          doc.rect(textX + 188, textY + 28, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta5AEspaldaBajaNo === true) {
            drawXInBox(doc, textX + 168, textY + 28, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta5AEspaldaBajaSi === true) {
            drawXInBox(doc, textX + 188, textY + 28, boxSize, boxSize); // Cuadro Femenino
          }

          doc.text(`b. Actividades recreativas`, textX + 8, textY + 36);
          doc.text(`No`, textX + 160, textY + 36);
          doc.rect(textX + 168, textY + 34, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 36);
          doc.rect(textX + 188, textY + 34, boxSize, boxSize); // Cuadro pequeño
          console.log(datos.pregunta5BEspaldaBajaNo, datos.pregunta5BEspaldaBajaSi)
          if (datos.pregunta5BEspaldaBajaNo === true) {
            drawXInBox(doc, textX + 168, textY + 34, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta5BEspaldaBajaSi === true) {
            drawXInBox(doc, textX + 188, textY + 34, boxSize, boxSize); // Cuadro Femenino
          }
        }
      }
    });

    // ====== TABLA 2: PROBLEMAS CON ÓRGANOS DE LA LOCOMOCIÓN ======
    doc.addPage();
    let startY = 20; // margen superior de la nueva página
    doc.setFont("helvetica", "bold").setFontSize(11);
    doc.text("CUESTIONARIO NÓRDICO DE SIGNOS Y SÍNTOMAS OSTEOMUSCULARES", pageW / 2, startY, { align: "center" })

    autoTable(doc, {
      startY: startY + 3,
      theme: "grid",
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, textColor: [0, 0, 0] },
      headStyles: { lineWidth: 0.5, lineHeight: 1.5 },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.5,
      body: [
        [
          {
            content: " ",
            styles: { minCellHeight: 28 },
          }
        ]
      ],
      didDrawCell: (data) => {
        // Fila 1, columna 1 (contando desde 0) -> la celda de la imagen
        if (data.row.index === 0 && data.column.index === 0) {
          const boxSize = 4;
          const circleR = 1.3;
          const textX = data.cell.x + 2; // margen interno izquierdo
          const textY = data.cell.y + 4; // margen superior
          doc.setFontSize(8);
          doc.setDrawColor(0); // Negro
          doc.setLineWidth(0.5);

          doc.text(`6.- Cuál es la duración total de tiempo que los problemas de espalda baja le han impedido hacer sus rutinas de trabajo (en el trabajo o en casa)\ndurante los últimos 12 meses?`, textX, textY);
          drawCircle(doc, textX + 12, textY + 6.8)
          doc.text(`0 Días`, textX + 15, textY + 8);
          if (datos.pregunta6AEspaldaBaja === true) {
            drawXInCircle(doc, textX + 12, textY + 6.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 32, textY + 6.8)
          doc.text(`1-7 Días`, textX + 35, textY + 8);
          if (datos.pregunta6BEspaldaBaja === true) {
            drawXInCircle(doc, textX + 32, textY + 6.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 52, textY + 6.8)
          doc.text(`8-30 Días`, textX + 55, textY + 8);
          if (datos.pregunta6CEspaldaBaja === true) {
            drawXInCircle(doc, textX + 52, textY + 6.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 72, textY + 6.8)
          doc.text(`Más de 30 Días`, textX + 75, textY + 8);
          if (datos.pregunta6DEspaldaBaja === true) {
            drawXInCircle(doc, textX + 72, textY + 6.8, circleR); // Cuadro Masculino
          }

          doc.text(`7.- Ha sido visto por un médico, fisioterapista, quirópractico y otra persona de área debido a problemas de espalda\ndurantelos últimos 12 meses?`, textX, textY + 12);
          doc.text(`No`, textX + 160, textY + 12);
          doc.rect(textX + 168, textY + 9, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 12);
          doc.rect(textX + 188, textY + 9, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta7EspaldaBajaNo === true) {
            drawXInBox(doc, textX + 168, textY + 9, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta7EspaldaBajaSi === true) {
            drawXInBox(doc, textX + 188, textY + 9, boxSize, boxSize); // Cuadro Femenino
          }

          doc.text(`8.- Ha tenido problemas de espalda baja en algún momento durante los últimos 7 dias?`, textX, textY + 20);
          doc.text(`No`, textX + 160, textY + 20);
          doc.rect(textX + 168, textY + 17, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 20);
          doc.rect(textX + 188, textY + 17, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta8EspaldaBajaNo === true) {
            drawXInBox(doc, textX + 168, textY + 17, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta8EspaldaBajaSi === true) {
            drawXInBox(doc, textX + 188, textY + 17, boxSize, boxSize); // Cuadro Femenino
          }


        }
      }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      theme: "grid",
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, textColor: [0, 0, 0] },
      headStyles: { lineWidth: 0.5, lineHeight: 1.5 },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.5,
      body: [
        [
          {
            content: "     4.- PROBLEMAS CON LOS HOMBROS",
            styles: { fontStyle: "bold", cellWidth: 170 },
          },
          {
            content: " ",
            rowSpan: 2
          }
        ],
        [
          {
            content: "¿Cómo responder el cuestionario?\nProblemas de los hombros significa molestias. dolor o disconforten el área indicada. Por favor concéntrese en ésta área. ignorando cualquier problema que usted.  pueda haber tenido en partes adyacentes a ésta. Existe un cuestionario separado para cuello. Por favor responda poniendo una x en el respectivo recuadro para cada pregunta.",
            styles: { valign: "middle", halign: "center", cellWidth: 170, fontSize: 7 }
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
          doc.addImage("img/Nordico/hombros.png", "PNG", x, y, imgWidth, imgHeight);
        }
      }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      theme: "grid",
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, textColor: [0, 0, 0] },
      headStyles: { lineWidth: 0.5, lineHeight: 1.5 },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.5,
      body: [
        [
          {
            content: " ",
            styles: { minCellHeight: 100 },
          }
        ]
      ],
      didDrawCell: (data) => {
        // Fila 1, columna 1 (contando desde 0) -> la celda de la imagen
        if (data.row.index === 0 && data.column.index === 0) {
          const boxSize = 4;
          const circleR = 1.3;
          const textX = data.cell.x + 2; // margen interno izquierdo
          const textY = data.cell.y + 4; // margen superior
          doc.setFontSize(8);
          doc.setDrawColor(0); // Negro
          doc.setLineWidth(0.5);

          doc.text(`9.- Ud. ha tenido problema de hombros (molestias, dolor o disconfort)?`, textX, textY);
          doc.text(`No`, textX + 160, textY);
          doc.rect(textX + 168, textY - 3, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY);
          doc.rect(textX + 188, textY - 3, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta1ProblemasHombrosNo === true) {
            drawXInBox(doc, textX + 168, textY - 3, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta1ProblemasHombrosSi === true) {
            drawXInBox(doc, textX + 188, textY - 3, boxSize, boxSize); // Cuadro Femenino
          }

          doc.setFont("helvetica", "bold");
          doc.text(`Si Ud. respondió NO a la pregunta 9, no responda a las preguntas 10 a 17.`, textX, textY + 4);
          doc.setFont("helvetica", "normal");

          doc.text(`10.- Ud. ha tenido lesiones en sus hombros en un accidente ?`, textX, textY + 8);
          doc.text(`No`, textX + 18, textY + 13);
          doc.rect(textX + 12, textY + 10, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta2ProblemasHombrosNo === true) {
            drawXInBox(doc, textX + 12, textY + 10, boxSize, boxSize); // Cuadro Masculino
          }

          doc.text(`Si, en mi hombro izquierdo`, textX + 64, textY + 13);
          doc.rect(textX + 58, textY + 10, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta2ProblemasHombroIzquierdoSi === true) {
            drawXInBox(doc, textX + 58, textY + 10, boxSize, boxSize); // Cuadro Masculino
          }
          //Abajo
          doc.text(`Si, en mi hombro derecho`, textX + 18, textY + 18);
          doc.rect(textX + 12, textY + 15, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta2ProblemasHombroDerechoSi === true) {
            drawXInBox(doc, textX + 12, textY + 15, boxSize, boxSize); // Cuadro Masculino
          }

          doc.text(`Si, en ambos hombros`, textX + 64, textY + 18);
          doc.rect(textX + 58, textY + 15, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta2ProblemasAmbosHombros === true) {
            drawXInBox(doc, textX + 58, textY + 15, boxSize, boxSize); // Cuadro Masculino
          }

          doc.text(`11.- Ud. ha tenido un cambio de trabajo o actividad por problemas de hombros?`, textX, textY + 23);
          doc.text(`No`, textX + 160, textY + 23);
          doc.rect(textX + 168, textY + 20, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 23);
          doc.rect(textX + 188, textY + 20, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta3ProblemasHombrosNo === true) {
            drawXInBox(doc, textX + 168, textY + 20, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta3ProblemasHombrosSi === true) {
            drawXInBox(doc, textX + 188, textY + 20, boxSize, boxSize); // Cuadro Femenino
          }

          doc.text(`12.- Ud. ha tenido problemas en los hombros durante los últimos 12 meses?`, textX, textY + 27);
          doc.text(`No`, textX + 18, textY + 32);
          doc.rect(textX + 12, textY + 29, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta4ProblemasHombrosNo === true) {
            drawXInBox(doc, textX + 12, textY + 29, boxSize, boxSize); // Cuadro Masculino
          }

          doc.text(`Si, en mi hombro izquierdo`, textX + 64, textY + 32);
          doc.rect(textX + 58, textY + 29, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta4ProblemasHombroIzquierdoSi === true) {
            drawXInBox(doc, textX + 58, textY + 29, boxSize, boxSize); // Cuadro Masculino
          }
          //Abajo
          doc.text(`Si, en mi hombro derecho`, textX + 18, textY + 37);
          doc.rect(textX + 12, textY + 34, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta4ProblemasHombroDerechoSi === true) {
            drawXInBox(doc, textX + 12, textY + 34, boxSize, boxSize); // Cuadro Masculino
          }

          doc.text(`Si, en ambos hombros`, textX + 64, textY + 37);
          doc.rect(textX + 58, textY + 34, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta4ProblemasAmbosHombros === true) {
            drawXInBox(doc, textX + 58, textY + 34, boxSize, boxSize); // Cuadro Masculino
          }

          //ITEMS ABAJO
          doc.text(`13.- Cuál es la duración total del tiempo en que Ud. Ha tenido problemas en los últimos 12 meses`, textX, textY + 42);
          drawCircle(doc, textX + 12, textY + 44.8)
          doc.text(`0 Días`, textX + 15, textY + 46);
          if (datos.pregunta5AProblemasHombros === true) {
            drawXInCircle(doc, textX + 12, textY + 44.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 32, textY + 44.8)
          doc.text(`1-7 Días`, textX + 35, textY + 46);
          if (datos.pregunta5BProblemasHombros === true) {
            drawXInCircle(doc, textX + 32, textY + 44.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 52, textY + 44.8)
          doc.text(`8-30 Días`, textX + 55, textY + 46);
          if (datos.pregunta5CProblemasHombros === true) {
            drawXInCircle(doc, textX + 52, textY + 44.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 72, textY + 44.8)
          doc.text(`Más de 30 Días`, textX + 75, textY + 46);
          if (datos.pregunta5DProblemasHombros === true) {
            drawXInCircle(doc, textX + 72, textY + 44.8, circleR); // Cuadro Masculino
          }

          //FIN ITEMS
          doc.text(`14.- El problema en sus hombros le han causado una disminución de su actividad durante los últimos  12 meses?`, textX, textY + 50);
          doc.text(`a. Actividades de trabajo (en el trabajo o la casa)`, textX + 8, textY + 54);
          doc.text(`No`, textX + 160, textY + 53);
          doc.rect(textX + 168, textY + 50, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 53);
          doc.rect(textX + 188, textY + 50, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta6AProblemasHombrosNo === true) {
            drawXInBox(doc, textX + 168, textY + 50, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta6AProblemasHombrosSi === true) {
            drawXInBox(doc, textX + 188, textY + 50, boxSize, boxSize); // Cuadro Femenino
          }

          doc.text(`b. Actividades recreativas`, textX + 8, textY + 58);
          doc.text(`No`, textX + 160, textY + 58);
          doc.rect(textX + 168, textY + 55, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 58);
          doc.rect(textX + 188, textY + 55, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta6BProblemasHombrosNo === true) {
            drawXInBox(doc, textX + 168, textY + 55, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta6BProblemasHombrosSi === true) {
            drawXInBox(doc, textX + 188, textY + 55, boxSize, boxSize); // Cuadro Femenino
          }

          //ITEMS ABAJO
          doc.text(`15.- Cuál es la duración total de tiempo que el problema en sus hombros le han impedido hacer sus rutinas\nde trabajo (en el trabajo o en casa) durante los últimos 12 meses`, textX, textY + 62);
          drawCircle(doc, textX + 12, textY + 68.8)
          doc.text(`0 Días`, textX + 15, textY + 70);
          if (datos.pregunta7AProblemasHombros === true) {
            drawXInCircle(doc, textX + 12, textY + 68.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 32, textY + 68.8)
          doc.text(`1-7 Días`, textX + 35, textY + 70);
          if (datos.pregunta7BProblemasHombros === true) {
            drawXInCircle(doc, textX + 32, textY + 68.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 52, textY + 68.8)
          doc.text(`8-30 Días`, textX + 55, textY + 70);
          if (datos.pregunta7CProblemasHombros === true) {
            drawXInCircle(doc, textX + 52, textY + 68.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 72, textY + 68.8)
          doc.text(`Más de 30 Días`, textX + 75, textY + 70);
          if (datos.pregunta7DProblemasHombros === true) {
            drawXInCircle(doc, textX + 72, textY + 68.8, circleR); // Cuadro Masculino
          }


          //FIN ITEMS
          doc.text(`16-Ha sido visto por un médico,fisioterapista, quiropráctico u otra persona del área debido a problemas en los hombros\ndurante los últimos 12 meses ? `, textX, textY + 74);
          doc.text(`No`, textX + 160, textY + 74);
          doc.rect(textX + 168, textY + 71, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 74);
          doc.rect(textX + 188, textY + 71, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta8ProblemasHombrosNo === true) {
            drawXInBox(doc, textX + 168, textY + 71, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta8ProblemasHombrosSi === true) {
            drawXInBox(doc, textX + 188, textY + 71, boxSize, boxSize); // Cuadro Femenino
          }

          doc.text(`17.- Ha tenido problemas de los hombros en algún momento durante los últimos 7 días ?`, textX, textY + 82);
          doc.text(`No`, textX + 18, textY + 87);
          doc.rect(textX + 12, textY + 84, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta9ProblemasHombrosNo === true) {
            drawXInBox(doc, textX + 12, textY + 84, boxSize, boxSize); // Cuadro Masculino
          }

          doc.text(`Si, en mi hombro izquierdo`, textX + 64, textY + 87);
          doc.rect(textX + 58, textY + 84, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta9ProblemasHombroIzquierdoSi === true) {
            drawXInBox(doc, textX + 58, textY + 84, boxSize, boxSize); // Cuadro Masculino
          }
          //Abajo
          doc.text(`Si, en mi hombro derecho`, textX + 18, textY + 92);
          doc.rect(textX + 12, textY + 89, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta9ProblemasHombroDerechoSi === true) {
            drawXInBox(doc, textX + 12, textY + 89, boxSize, boxSize); // Cuadro Masculino
          }

          doc.text(`Si, en ambos hombros`, textX + 64, textY + 92);
          doc.rect(textX + 58, textY + 89, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta9ProblemasAmbosHombros === true) {
            drawXInBox(doc, textX + 58, textY + 89, boxSize, boxSize); // Cuadro Masculino
          }

        }
      }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      theme: "grid",
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, textColor: [0, 0, 0] },
      headStyles: { lineWidth: 0.5, lineHeight: 1.5 },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.5,
      body: [
        [
          {
            content: "     5.- PROBLEMAS CON EL CUELLO",
            styles: { fontStyle: "bold", cellWidth: 170 },
          },
          {
            content: " ",
            rowSpan: 2
          }
        ],
        [
          {
            content: "¿Cómo responder el cuestionario?\nProblemas de cuello significa molestias. dolor o disconforten el área indicada. Por favor concéntrese en ésta área. ignorando cualquier problema que usted.  pueda haber tenido en partes adyacentes a ésta. Por favor responda poniendo una x en el respectivo recuadro para cada pregunta..",
            styles: { valign: "middle", halign: "center", cellWidth: 170, fontSize: 7 }
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
          doc.addImage("img/Nordico/cuello.png", "PNG", x, y, imgWidth, imgHeight);
        }
      }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      theme: "grid",
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, textColor: [0, 0, 0] },
      headStyles: { lineWidth: 0.5, lineHeight: 1.5 },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.5,
      body: [
        [
          {
            content: " ",
            styles: { minCellHeight: 68 },
          }
        ]
      ],
      didDrawCell: (data) => {
        // Fila 1, columna 1 (contando desde 0) -> la celda de la imagen
        if (data.row.index === 0 && data.column.index === 0) {
          const boxSize = 4;
          const circleR = 1.3;
          const textX = data.cell.x + 2; // margen interno izquierdo
          const textY = data.cell.y + 4; // margen superior
          doc.setFontSize(8);
          doc.setDrawColor(0); // Negro
          doc.setLineWidth(0.5);

          doc.text(`1.- Ud. ha tenido problemas en el cuello (molestias, dolor o disconfort)?`, textX, textY);
          doc.text(`No`, textX + 160, textY);
          doc.rect(textX + 168, textY - 3, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY);
          doc.rect(textX + 188, textY - 3, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta1ProblemasCuelloNo === true) {
            drawXInBox(doc, textX + 168, textY - 3, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta1ProblemasCuelloSi === true) {
            drawXInBox(doc, textX + 188, textY - 3, boxSize, boxSize); // Cuadro Femenino
          }

          doc.setFont("helvetica", "bold");
          doc.text(`Si Ud. respondió NO a la pregunta 1, no responda a las preguntas 2 a la 8.`, textX, textY + 4);
          doc.setFont("helvetica", "normal");

          doc.text(`2.- Ud. ha sido lesionado en su cuello en un accidente?`, textX, textY + 8);
          doc.text(`No`, textX + 160, textY + 8);
          doc.rect(textX + 168, textY + 4, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 8);
          doc.rect(textX + 188, textY + 4, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta2ProblemasCuelloNo === true) {
            drawXInBox(doc, textX + 168, textY + 4, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta2ProblemasCuelloSi === true) {
            drawXInBox(doc, textX + 188, textY + 4, boxSize, boxSize); // Cuadro Femenino
          }

          doc.text(`3.- Ud. ha tenido cambios de trabajo o actividad por problemas en el cuello?`, textX, textY + 12);
          doc.text(`No`, textX + 160, textY + 12);
          doc.rect(textX + 168, textY + 9, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 12);
          doc.rect(textX + 188, textY + 9, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta3ProblemasCuelloNo === true) {
            drawXInBox(doc, textX + 168, textY + 9, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta3ProblemasCuelloSi === true) {
            drawXInBox(doc, textX + 188, textY + 9, boxSize, boxSize); // Cuadro Femenino
          }

          //ITEMS ABAJO
          doc.text(`4.- Cuál es la duración total del tiempo en que ha tenido problemas en el cuello durante los últimos 12 meses?`, textX, textY + 16);
          drawCircle(doc, textX + 12, textY + 18.8)
          doc.text(`0 Días`, textX + 15, textY + 20);
          if (datos.pregunta4AProblemasCuello === true) {
            drawXInCircle(doc, textX + 12, textY + 18.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 32, textY + 18.8)
          doc.text(`1-7 Días`, textX + 35, textY + 20);
          if (datos.pregunta4BProblemasCuello === true) {
            drawXInCircle(doc, textX + 32, textY + 18.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 52, textY + 18.8)
          doc.text(`8-30 Días`, textX + 55, textY + 20);
          if (datos.pregunta4CProblemasCuello === true) {
            drawXInCircle(doc, textX + 52, textY + 18.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 72, textY + 18.8)
          doc.text(`Más de 30 Días`, textX + 75, textY + 20);
          if (datos.pregunta4DProblemasCuello === true) {
            drawXInCircle(doc, textX + 72, textY + 18.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 107, textY + 18.8)
          doc.text(`Todos los Días`, textX + 110, textY + 20);
          if (datos.pregunta4EProblemasCuello === true) {
            drawXInCircle(doc, textX + 107, textY + 18.8, circleR); // Cuadro Masculino
          }

          doc.setFont("helvetica", "bold");
          doc.text(`Si Ud. respondió 0 Días a la pregunta 4, no responda a las preguntas de la 5 a la 8.`, textX, textY + 24);
          doc.setFont("helvetica", "normal");
          //Inicio items 2

          doc.text(`5- Los problemas de su cuello han causado a Ud. reducción de actividad física durante los últimos 12 meses?`, textX, textY + 28);
          doc.text(`a. Actividades de trabajo (en el trabajo o la casa)`, textX + 8, textY + 32);
          doc.text(`No`, textX + 160, textY + 31);
          doc.rect(textX + 168, textY + 28, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 31);
          doc.rect(textX + 188, textY + 28, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta5AProblemasCuelloNo === true) {
            drawXInBox(doc, textX + 168, textY + 28, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta5AProblemasCuelloSi === true) {
            drawXInBox(doc, textX + 188, textY + 28, boxSize, boxSize); // Cuadro Femenino
          }

          doc.text(`b. Actividades recreativas`, textX + 8, textY + 36);
          doc.text(`No`, textX + 160, textY + 36);
          doc.rect(textX + 168, textY + 33, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 36);
          doc.rect(textX + 188, textY + 33, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta5BProblemasCuelloNo === true) {
            drawXInBox(doc, textX + 168, textY + 33, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta5BProblemasCuelloSi === true) {
            drawXInBox(doc, textX + 188, textY + 33, boxSize, boxSize); // Cuadro Femenino
          }


          doc.text(`6- Cuál es la duracción total de tiempo que los problemas de su cuello la han impedido hacer sus rutinas de trabajo\n(en el trabajo o en casa) durante los últimos 12 meses ?`, textX, textY + 40);
          drawCircle(doc, textX + 12, textY + 46.8)
          doc.text(`0 Días`, textX + 15, textY + 48);
          if (datos.pregunta6AProblemasCuello === true) {
            drawXInCircle(doc, textX + 12, textY + 46.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 32, textY + 46.8)
          doc.text(`1-7 Días`, textX + 35, textY + 48);
          if (datos.pregunta6BProblemasCuello === true) {
            drawXInCircle(doc, textX + 32, textY + 46.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 52, textY + 46.8)
          doc.text(`8-30 Días`, textX + 55, textY + 48);
          if (datos.pregunta6CProblemasCuello === true) {
            drawXInCircle(doc, textX + 52, textY + 46.8, circleR); // Cuadro Masculino
          }

          drawCircle(doc, textX + 72, textY + 46.8)
          doc.text(`Más de 30 Días`, textX + 75, textY + 48);
          if (datos.pregunta6DProblemasCuello === true) {
            drawXInCircle(doc, textX + 72, textY + 46.8, circleR); // Cuadro Masculino
          }

          //FIN ITEMS
          doc.text(`7-Ha sido visto por un médico,fisioterapista, quiropráctico u otra persona del área debido a problemas en su\ncuello durante los últimos 12 meses?`, textX, textY + 52);
          doc.text(`No`, textX + 160, textY + 52);
          doc.rect(textX + 168, textY + 49, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 52);
          doc.rect(textX + 188, textY + 49, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta7ProblemasCuelloNo === true) {
            drawXInBox(doc, textX + 168, textY + 49, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta7ProblemasCuelloSi === true) {
            drawXInBox(doc, textX + 188, textY + 49, boxSize, boxSize); // Cuadro Femenino
          }

          doc.text(`8- Ha tenido problemas en su cuello en algún momento durante los últimos 7 días ?`, textX, textY + 60);
          doc.text(`No`, textX + 160, textY + 60);
          doc.rect(textX + 168, textY + 57, boxSize, boxSize); // Cuadro pequeño
          doc.text(`Si`, textX + 180, textY + 60);
          doc.rect(textX + 188, textY + 57, boxSize, boxSize); // Cuadro pequeño
          if (datos.pregunta8ProblemasCuelloNo === true) {
            drawXInBox(doc, textX + 168, textY + 57, boxSize, boxSize); // Cuadro Masculino
          } else if (datos.pregunta8ProblemasCuelloSi === true) {
            drawXInBox(doc, textX + 188, textY + 57, boxSize, boxSize); // Cuadro Femenino
          }
        }
      }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      theme: "grid",
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, textColor: [0, 0, 0] },
      headStyles: { lineWidth: 0.5, lineHeight: 1.5 },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.5,
      body: [
        [
          {
            content: " ",
            styles: { minCellHeight: 22 },
          }
        ]
      ],
      didDrawCell: (data) => {
        // Fila 1, columna 1 (contando desde 0) -> la celda de la imagen
        if (data.row.index === 0 && data.column.index === 0) {
          const boxSize = 4;
          const circleR = 1.3;
          const textX = data.cell.x + 2; // margen interno izquierdo
          const textY = data.cell.y + 4; // margen superior
          doc.setFontSize(8);
          doc.setDrawColor(0); // Negro
          doc.setLineWidth(0.5);

          // ====== BLOQUE DE FIRMAS =====

          // Línea y texto Médico
          doc.line(20, textY + 10, 70, textY + 10);
          doc.text("Firma y sello del Médico", 30, textY + 14, { align: "left" });
          if (s1) {
            const canvas = document.createElement('canvas');
            canvas.width = s1.width;
            canvas.height = s1.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(s1, 0, 0);
            const selloBase64 = canvas.toDataURL('image/png');

            // ===== Dimensiones máximas permitidas =====
            const maxImgW = 30; // ancho máximo del sello
            const maxImgH = 20; // alto máximo del sello

            // ===== Escalado proporcional =====
            let imgW = s1.width;
            let imgH = s1.height;

            const scaleW = maxImgW / imgW;
            const scaleH = maxImgH / imgH;
            const scale = Math.min(scaleW, scaleH, 1);

            imgW *= scale;
            imgH *= scale;

            // ===== Línea de firma =====
            const lineStart = 20;
            const lineEnd = 70;
            const lineMid = (lineStart + lineEnd) / 2; // punto medio en X

            doc.line(lineStart, textY + 10, lineEnd, textY + 10);
            // doc.text("Firma y huella del paciente", 30, textY + 14);

            // ===== Posición de la imagen centrada en la línea =====
            const imgX = lineMid - imgW / 2;
            const imgY = textY + 10 - imgH - 2; // 2 px de margen arriba de la línea

            // ===== Agregar el sello =====
            doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
          }



          // Línea y texto Postulante
          doc.line(90, textY + 10, 140, textY + 10);
          doc.text("Firma y huella del paciente", 98, textY + 14, { align: "left" });

          doc.text("Gracias por su colaboración", 165, textY + 10)
          // ===== Función para escalar y dibujar imagen =====
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

          // ===== Coordenadas de la línea =====
          const lineStart = 90;
          const lineEnd = 140;
          const lineMid = (lineStart + lineEnd) / 2;

          // ===== Tamaño máximo permitido =====
          const maxImgW = 20;
          const maxImgH = 20;

          // ===== Agregar s2 (izquierda del medio) =====
          if (s2) {
            const centerX = (lineStart + lineMid) / 2; // punto medio de la izquierda
            addScaledImage(doc, s2, maxImgW, maxImgH, centerX, textY + 10);
          }

          // ===== Agregar s3 (derecha del medio) =====
          if (s3) {
            const centerX = (lineMid + lineEnd) / 2; // punto medio de la derecha
            addScaledImage(doc, s3, maxImgW, maxImgH, centerX, textY + 10);
          }


        }
      }
    });


    console.log(docExistente);
    if (!docExistente) {
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => iframe.contentWindow.print();
    }
    return doc;
  })


}