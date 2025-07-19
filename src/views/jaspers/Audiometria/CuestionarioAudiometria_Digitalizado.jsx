import jsPDF from "jspdf";
import headerFicha from "./headers/header_CuestionarioAudiometria_Digitalizado.jsx";
import footer from "../components/footer.jsx";

/**
 * Genera y muestra la FICHA AUDIOLÓGICA con todas las preguntas (1–16),
 * casillas SI/NO sin líneas verticales, todo más compacto con letra tamaño 9,
 * y con margen interior de 0.5pt arriba y 1pt abajo en cada fila.
 *
 * @param {object} datos
 *   datos.preguntas = [
 *     { numero: 1, valor: "SI"|"NO" }, …, { numero: 16, valor: "" }
 *   ];
 *   datos.nroficha? – para el pie de página
 */
export default function CuestionarioAudiometria_Digitalizado(datos) {
  const doc = new jsPDF();
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const boxSize = 5;
  const lineHTable = 5;
  const paddingTop = 0.5;
  const paddingBottom = 1;
  const lineH = 4;
  const startY = 50;
  let y = startY;

  // 1) Header maqueta
  headerFicha(doc, datos);

  // 2) Carga de imágenes (firma, huella, sello)
  const firmas = (datos.digitalizacion || []).reduce((acc, d) => ({
    ...acc,
    [d.nombreDigitalizacion]: d.url
  }), {});
  const isValidUrl = url => url && url !== "Sin registro";
  const loadImg = src => new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => res(img);
    img.onerror = () => rej(`No se pudo cargar ${src}`);
  });

  Promise.all([
    isValidUrl(firmas.FIRMAP) ? loadImg(firmas.FIRMAP) : Promise.resolve(null),
    isValidUrl(firmas.HUELLA) ? loadImg(firmas.HUELLA) : Promise.resolve(null),
    isValidUrl(firmas.SELLOFIRMA) ? loadImg(firmas.SELLOFIRMA) : Promise.resolve(null),
  ]).then(([s1, s2, s3]) => {
    // 3) Sección de preguntas 1–15
    const colSiW = 8;
    const colNoW = 8;
    const colPreguntaW = pageW - 2 * margin - colSiW - colNoW;
    const tableX = margin;
    let tableY = y;

    const preguntas = [
      { numero: 1, texto: "1.- Tiene conocimiento de algún problema del oído y/o audición que haya tenido o haya sido diagnosticado y/o en estudio, así como: pérdida de audición, hipoacusia, otitis media agudo, crónico, supurativo externo, presencia de secreción purulenta y/o sanguinolenta con o sin mal olor, escucha sonidos como pititos, soplidos del viento, sonido del mar, acúfenos, tinnitus, mareos, vértigo, náuseas, rinitis alérgica, parálisis facial, adormecimiento de hemicorpo, tumores del sistema nervioso central." },
      { numero: 2, texto: "2.- Ha realizado viaje o ha llegado de viaje en las 16 horas anteriores a esta entrevista y examen." },
      { numero: 3, texto: "3.- Ha estado escuchando música con audífonos en las 16 horas anteriores a esta entrevista o examen." },
      { numero: 4, texto: "4.- Se ha desplazado y/o movilizado en moto lineal y/o en vehículo con las ventanas abiertas." },
      { numero: 5, texto: "5.- Ha trabajado expuesto a ruido y/o vibraciones en las 16 horas anteriores a esta entrevista y examen." },
      { numero: 6, texto: "6.- Ha bebido bebidas alcohólicas y/o fumó cigarrillos en las 16 horas anteriores a esta entrevista y examen." },
      { numero: 7, texto: "7.- Ha estado despierto o trabajando en turno de noche 16 horas anteriores a esta entrevista y examen." },
      { numero: 8, texto: "8.- ¿Está resfriado con tos, con dolor auricular, fiebre y/u otra enfermedad respiratoria aguda?" },
      { numero: 9, texto: "9.- ¿Le han practicado cirugía de oído (timpanoplastía, mastoidectomía, estapediectomía)?" },
      { numero: 10, texto: "10.- ¿Ha tenido traumatismo craneoencefálico, traumatismo en el oído?" },
      { numero: 11, texto: "11.- ¿Ha consumido o consume medicamentos como: Cisplatino, aminoglucósidos (vancomicina y amikacina), aspirina, furosemida y/o antituberculosos?" },
      { numero: 12, texto: "12.- ¿Ha estado expuesto a solventes orgánicos (tolueno, xileno, disulfuro de carbono, plomo, mercurio, monóxido de carbono), plaguicidas, organofosforados y piretroides?" },
      { numero: 13, texto: "13.- ¿Ha estado expuesto a vibraciones continuas?" },
      { numero: 14, texto: "14.- ¿Sufre de: hipertensión arterial, diabetes mellitus, hipotiroidismo, insuficiencia renal crónica, enfermedades autoinmunes?" },
      { numero: 15, texto: "15.- ¿Consume cigarrillos?" }
    ];

    // --- NUEVO: calcular altura total de la tabla incluyendo espacios extra ---
    let totalTableH = lineHTable * 2; // encabezado
    preguntas.forEach(p => {
      const lines = doc.splitTextToSize(p.texto, colPreguntaW - 4);
      const contentH = lines.length * lineHTable;
      const extraSpace = [1,9,10,11,12,13,14,15].includes(p.numero) ? lineHTable : 0;
      const rowH = contentH + paddingTop + paddingBottom + extraSpace;
      totalTableH += rowH;
    });
    // pregunta 16
    const rowH16sMarco = [
      lineH + 2, // Caza
      lineH + 2, // Tiro al blanco
      // Calcular altura real para la opción larga, sin padding inferior
      (() => {
        const lines = "Concurrencia frecuente a\ndiscotecas y/o bares".split("\n");
        return lines.length * lineHTable - 1; // aún más pegado
      })()
    ];
    totalTableH += lineHTable; // encabezado de la 16
    rowH16sMarco.forEach(h => { totalTableH += h; });
    // --- FIN NUEVO ---

    // --- NUEVO: calcular altura bloque firmas y sumar ---
    const blockH1 = 10; // altura declaración (más compacto)
    const blockH2 = 10; // altura firmas (más compacto)
    const blockH3 = 5;  // altura DNI/índice/firma responsable (aún más compacto)
    const blockFirmasH = blockH1 + blockH2 + blockH3;
    // --- FIN NUEVO ---

    // Marco exterior: ahora abarca todo
    doc.rect(tableX, y, colPreguntaW + colSiW + colNoW, totalTableH + blockFirmasH);

    // encabezado de tabla
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.line(tableX, tableY, tableX + colPreguntaW + colSiW + colNoW, tableY);
    doc.text("PREGUNTAS", tableX + 2, tableY + lineHTable - 1.2);
    doc.text("SI", tableX + colPreguntaW + colSiW / 2, tableY + lineHTable - 1.2, { align: "center" });
    doc.text("NO", tableX + colPreguntaW + colSiW + colNoW / 2, tableY + lineHTable - 1.2, { align: "center" });
    tableY += lineHTable;
    doc.line(tableX, tableY, tableX + colPreguntaW + colSiW + colNoW, tableY);
    doc.setFont("helvetica", "normal").setFontSize(9);

    // filas de preguntas 1-15
    preguntas.forEach(p => {
      const resp = datos.preguntas?.find(q => q.numero === p.numero)?.valor || "";
      const lines = doc.splitTextToSize(p.texto, colPreguntaW - 4);
      const contentH = lines.length * lineHTable;
      // Si la pregunta es 1, 9, 10, 11, 12, 13, 14 o 15, agrego espacio extra
      const extraSpace = [1,9,10,11,12,13,14,15].includes(p.numero) ? lineHTable : 0;
      const rowH = contentH + paddingTop + paddingBottom + extraSpace;

      // texto con padding superior
      lines.forEach((ln, i) => {
        doc.text(ln, tableX + 2, tableY + paddingTop + lineHTable - 1.2 + i * lineHTable);
      });
      let nuevoYParaTexto=tableY + paddingTop + lineHTable - 1.2;
      switch(p.numero){
        case 1:
          nuevoYParaTexto += 25; // Ajuste para la pregunta 1
          doc.text(datos?.txtrcual1||"", tableX + 2, nuevoYParaTexto) 
          doc.text(datos?.txtrcuando1||"", tableX + 67, nuevoYParaTexto) 
          doc.text(datos?.txtrque1||"", tableX + 132, nuevoYParaTexto) 
          break;
        case 9:  
          nuevoYParaTexto += 5; // Ajuste para la pregunta 9 
          doc.text(datos?.txtrcual9||"", tableX + 2, nuevoYParaTexto) 
          doc.text(datos?.txtrdonde9||"", tableX + 67, nuevoYParaTexto) 
          doc.text(datos?.txtrque9||"", tableX + 132, nuevoYParaTexto) 
          break;
        case 10: 
          nuevoYParaTexto += 5; // Ajuste para la pregunta 10
          doc.text(datos?.txtrcual10||"", tableX + 2, nuevoYParaTexto) 
          doc.text(datos?.txtrdonde10||"", tableX + 67, nuevoYParaTexto) 
          doc.text(datos?.txtrque10||"", tableX + 132, nuevoYParaTexto) 
          break;
        case 11:    
          nuevoYParaTexto += 10; // Ajuste para la pregunta 11
          doc.text(datos?.txtrcual11||"", tableX + 2, nuevoYParaTexto)
          doc.text(datos?.txtrcuanto11||"", tableX + 97, nuevoYParaTexto)
          break;
        case 12: 
          nuevoYParaTexto += 10; // Ajuste para la pregunta 12
          doc.text(datos?.txtrcual12||"", tableX + 2, nuevoYParaTexto)
          doc.text(datos?.txtrcuanto12||"", tableX + 97, nuevoYParaTexto)
          break;
        case 13: 
          nuevoYParaTexto += 5; // Ajuste para la pregunta 13
          doc.text(datos?.txtrcuanto13||"", tableX + 2, nuevoYParaTexto) 
          doc.text(datos?.txtrcuando13||"", tableX + 67, nuevoYParaTexto) 
          doc.text(datos?.txtrdonde13||"", tableX + 132, nuevoYParaTexto) 
          break;
        case 14: 
          nuevoYParaTexto += 10; // Ajuste para la pregunta 14
          doc.text(datos?.txtrcual14||"", tableX + 2, nuevoYParaTexto) 
          doc.text(datos?.txtrdonde14||"", tableX + 67, nuevoYParaTexto) 
          doc.text(datos?.txtrque14||"", tableX + 132, nuevoYParaTexto) 
          break;
        case 15: 
          nuevoYParaTexto += 5; // Ajuste para la pregunta 15
          doc.text(datos?.txtrcuantos15||"", tableX + 2, nuevoYParaTexto) 
          break;
      }


      

      // casillas
      const siX = tableX + colPreguntaW + (colSiW - boxSize) / 2;
      const noX = tableX + colPreguntaW + colSiW + (colNoW - boxSize) / 2;
      const boxY = tableY + paddingTop + contentH / 2 - boxSize / 2;
      doc.rect(siX, boxY, boxSize, boxSize);
      doc.rect(noX, boxY, boxSize, boxSize);
      if (datos[`chksi${p.numero}`]) doc.text("X", siX + boxSize / 2, boxY + boxSize / 2 + 1.2, { align: "center" });
      else doc.text("X", noX + boxSize / 2, boxY + boxSize / 2 + 1.2, { align: "center" });

      tableY += rowH;
      doc.line(tableX, tableY, tableX + colPreguntaW + colSiW + colNoW, tableY);
    });

    // --- NUEVO: pregunta 16 dentro del mismo marco ---
    // encabezado pregunta 16
    doc.setFont("helvetica", "normal").setFontSize(9);
    const lbl16 = "16.- ¿Ha realizado actividades de?";
    doc.text(lbl16, tableX + 2, tableY + lineHTable - 1.2);
    doc.text("¿Cuánto tiempo?", tableX + colPreguntaW / 2-12, tableY + lineHTable - 1.2, { align: "center" });
    doc.text("¿Cuánto tiempo?", tableX + colPreguntaW + colSiW + colNoW - 2-20, tableY + lineHTable - 1.2, { align: "right" });
    tableY += lineHTable;
    // Quitar la línea horizontal debajo del encabezado de la 16
    // doc.line(tableX, tableY, tableX + colPreguntaW + colSiW + colNoW, tableY);

    // Ajuste: opción larga con salto de línea y mayor altura de bloque
    const left16 = [
      { label: "Caza", key: "chkcaza16", tiempo: "txtcaza16" },
      { label: "Tiro al blanco", key: "chktiro16", tiempo: "txttiro16" },
      { label: "Concurrencia frecuente a\ndiscotecas y/o bares", key: "chkdiscoteca16", tiempo: "txtdiscoteca16" }
    ];
    const right16 = [
      { label: "Uso de auriculares", key: "chkauriculares16", tiempo: "txtauriculares16" },
      { label: "Servicio militar", key: "chkmilitar16", tiempo: "txtmilitar16" },
      { label: "Boxeo", key: "chkboxeo16", tiempo: "txtboxeo16" }
    ];
    // Altura de fila: la última fila será más alta por el salto de línea (calculada según líneas reales)
    const rowH16sContent = [
      lineH + 2,
      lineH + 2,
      (() => {
        const lines = left16[2].label.split("\n");
        return lines.length * lineHTable - 1; // aún más pegado
      })()
    ];
    let rowY = tableY;
    for (let i = 0; i < 3; i++) {
      // izquierda
      doc.rect(tableX + 2, rowY + 2, boxSize, boxSize);
      doc.text(datos[left16[i].key] ? "X" : "", tableX + 2 + 1.5, rowY + 2 + 3.5);
      // Salto de línea para la última opción
      if (i === 2) {
        const lines = left16[i].label.split("\n");
        doc.text(lines[0], tableX + 2 + boxSize + 4, rowY + 2 + 3.5);
        doc.text(lines[1], tableX + 2 + boxSize + 4, rowY + 2 + 3.5 + lineHTable);
      } else {
        doc.text(left16[i].label, tableX + 2 + boxSize + 4, rowY + 2 + 3.5);
      }
      doc.text(datos[left16[i].tiempo] || "", tableX + colPreguntaW / 2-18, rowY + 2 + 3.5, { align: "center" });
      // derecha alineada verticalmente con la izquierda
      const rightY = (i === 2) ? rowY + 2 + lineHTable / 2 : rowY + 2;
      doc.rect(tableX + colPreguntaW / 2 + colSiW + 10, rightY, boxSize, boxSize);
      doc.text(datos[right16[i].key] ? "X" : "", tableX + colPreguntaW / 2 + colSiW + 11.5, rightY + 3.5);
      doc.text(right16[i].label, tableX + colPreguntaW / 2 + colSiW + 10 + boxSize + 4, rightY + 3.5, { maxWidth: colPreguntaW / 2 - boxSize - 10 });
      doc.text(datos[right16[i].tiempo] || "", tableX + colPreguntaW + colSiW + colNoW / 2-40, rightY + 3.5, { align: "center" });
      rowY += rowH16sContent[i];
    }
    tableY = rowY;
    // Línea horizontal al final de la tabla de preguntas (bajo la 16, bajada 3 puntos)
    doc.line(tableX, tableY + 3, tableX + colPreguntaW + colSiW + colNoW, tableY + 3);
    // --- FIN NUEVO ---

    // --- BLOQUE: Declaración y firmas con línea vertical hasta el borde superior ---
    const blockW = colPreguntaW + colSiW + colNoW;
    const blockX = tableX;
    let blockY = tableY + 5;

    const colW = blockW / 3;
    // Línea horizontal debajo de la declaración SOLO hasta la división de la última columna
    doc.line(blockX, blockY + blockH1-5, blockX + 2 * colW, blockY + blockH1-5);
    // Línea horizontal bajo firmas (toda la tabla)
    doc.line(blockX, blockY + blockH1 + blockH2, blockX + blockW, blockY + blockH1 + blockH2);
    // Línea vertical de la última columna (desde el borde superior del recuadro exterior)
    doc.line(blockX + 2 * colW, blockY-2, blockX + 2 * colW, blockY + blockH1 + blockH2 + blockH3); 
    //linea vertical parte firmas
    doc.line(blockX + 2 * colW-60, blockY+5, blockX + 2 * colW-60, blockY + blockH1 + blockH2 + blockH3);  

    // Declaración: columna 1, alineado a la izquierda
    doc.setFontSize(8).setFont('helvetica', 'normal');
    doc.text('Declaro que las respuestas son ciertas según mi leal saber y entender', blockX + 5, blockY + blockH1 / 2 -2.7);

    // Fila 2: Firma trabajador (columna 1), columna 2 vacía
    doc.text('Firma del trabajador o postulante', blockX + 14, blockY + blockH1 + blockH2 / 2 + 4);

    // Fila 3: tres columnas, alineaciones distintas
    const dni = datos.dni || '70101010';
    doc.setFont('helvetica', 'bold');
    doc.text(`DNI ${dni}`, blockX + 25, blockY + blockH1 + blockH2 + blockH3 / 2 +1, { align: 'left' });
    doc.setFont('helvetica', 'normal');
    doc.text('Índice Derecho', blockX + colW + colW / 2, blockY + blockH1 + blockH2 + blockH3 / 2 + 1, { align: 'center' });
    doc.text('Firma Responsable', blockX + 2 * colW + colW / 2, blockY + blockH1 + blockH2 + blockH3 / 2 + 1, { align: 'center' });
    // --- FIN BLOQUE ---

    // 5) Inserción de imágenes de firma/huella/sello
    const placeImage = (img, xOffset, yOffset) => {
      const sigW = 100;
      const sigH = 35;
      const baseX = (pageW - 160) / 2 + xOffset;
      const baseY = y + 40 + yOffset;
      const maxW = sigW - 10;
      const maxH = sigH - 10;
      let imgW = img.width;
      let imgH = img.height;
      const scale = Math.min(maxW / imgW, maxH / imgH, 1);
      imgW *= scale;
      imgH *= scale;
      const imgX = baseX + (sigW - imgW) / 2;
      const imgY = baseY + (sigH - imgH) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const data = canvas.toDataURL("image/png");
      doc.addImage(data, "PNG", imgX, imgY, imgW, imgH);
    };

    if (s1) placeImage(s1, -32, 158);
    if (s2) placeImage(s2, 31, 158);
    if (s3) placeImage(s3, 98, 158);

    // 6) Footer e impresión
   
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    };
  });
}
