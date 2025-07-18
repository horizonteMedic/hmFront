import jsPDF from "jspdf";
import headerFicha from "./headers/header_FichaAudiologica1_Digitalizado.jsx";

export default function FichaAudiologica_Digitalizado(datos = {}) {
  const doc = new jsPDF();
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 32;

  // 1) Header
  headerFicha(doc, datos);

  // 2) Título
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("FICHA AUDIOLOGICA", pageW / 2, y, { align: "center" });
  y += 6;

  // --- Bloque superior (2 filas, 4 columnas) ---
  const x0 = margin;
  const wTotal = pageW - 2 * margin;
  const colW = [38, 38, 38, wTotal - 38 * 3]; // 4 columnas
  const rowH1 = 10, rowH2 = 13;
  // Fila 1
  doc.setLineWidth(0.4);
  doc.rect(x0, y, wTotal, rowH1);
  let x = x0;
  for (let i = 0; i < 3; i++) {
    x += colW[i];
    doc.line(x, y, x, y + rowH1);
  }
  // Fila 2
  doc.rect(x0, y + rowH1, wTotal, rowH2);
  x = x0;
  for (let i = 0; i < 3; i++) {
    x += colW[i];
    doc.line(x, y + rowH1, x, y + rowH1 + rowH2);
  }
  // Subdividir última celda derecha en 4 filas internas (Audiómetro)
  const audX = x0 + colW[0] + colW[1] + colW[2];
  const audW = colW[3];
  const audRowH = rowH1 / 4;
  for (let i = 1; i < 4; i++) {
    doc.line(audX, y + i * audRowH, audX + audW, y + i * audRowH);
  }
  // Etiquetas fila 1
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Historia Clínica", x0 + 2, y + 5.5);
  doc.text("Ficha Audiológica", x0 + colW[0] + 2, y + 5.5);
  doc.text("95877", x0 + colW[0] + colW[1] + 2, y + 5.5);
  // Audiómetro subdividido
  doc.setFont("helvetica", "bold").text("Marca", audX + 2, y + audRowH - 2.5);
  doc.setFont("helvetica", "normal").text("AMPLIVOX", audX + 22, y + audRowH - 2.5);
  doc.setFont("helvetica", "bold").text("Modelo", audX + 2, y + audRowH * 2 - 2.5);
  doc.setFont("helvetica", "normal").text("BELL PLUS", audX + 22, y + audRowH * 2 - 2.5);
  doc.setFont("helvetica", "bold").text("Calibración", audX + 2, y + audRowH * 3 - 2.5);
  doc.setFont("helvetica", "normal").text("01/07/2025", audX + 22, y + audRowH * 3 - 2.5);

  // Etiquetas fila 2
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Fecha del Examen", x0 + 2, y + rowH1 + 5);
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("01/07/2025", x0 + colW[0] / 2, y + rowH1 + 8, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("dd / mm / aa", x0 + colW[0] / 2, y + rowH1 + 12, { align: "center" });
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("EXAMEN", x0 + colW[0] + colW[1] / 2, y + rowH1 + 8, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Pre - Ocupacional ( )", x0 + colW[0] + colW[1] + 2, y + rowH1 + 4);
  doc.text("Periódica ( )", x0 + colW[0] + colW[1] + 2, y + rowH1 + 7);
  doc.text("Retiro( )", x0 + colW[0] + colW[1] + 2, y + rowH1 + 10);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Anual ( X )", x0 + colW[0] + colW[1] + 2, y + rowH1 + 13);

  // --- Bloque de datos personales (2 filas) ---
  let yDatos = y + rowH1 + rowH2;
  const rowH3 = 8, rowH4 = 8;
  // Fila 3
  // Proporciones para fila 3 (Apellidos, Edad, Sexo, Ocupación, Años de trabajo)
  const colW3 = [0.32, 0.10, 0.08, 0.32, 0.18].map(f => f * wTotal);
  let xCol3 = x0;
  doc.rect(x0, yDatos, wTotal, rowH3);
  for (let i = 0; i < colW3.length - 1; i++) {
    xCol3 += colW3[i];
    doc.line(xCol3, yDatos, xCol3, yDatos + rowH3);
  }
  // Etiquetas fila 3
  doc.setFont("helvetica", "normal").setFontSize(8);
  let xText = x0 + 2;
  doc.text("Apellidos y Nombres", xText, yDatos + 5);
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("ROJAS SIGUENZA JOSUE SPENCER", x0 + colW3[0] / 2 + x0, yDatos + 5, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  xText += colW3[0];
  doc.text("Edad", xText + 2, yDatos + 5);
  doc.setFont("helvetica", "bold").text("29 AÑOS", xText + colW3[1] / 2, yDatos + 5, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  xText += colW3[1];
  doc.text("Sexo", xText + 2, yDatos + 5);
  doc.setFont("helvetica", "bold").text("M", xText + colW3[2] / 2, yDatos + 5, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  xText += colW3[2];
  doc.text("Ocupación", xText + 2, yDatos + 5);
  doc.setFont("helvetica", "bold").text("ADMINISTRADOR", xText + colW3[3] / 2, yDatos + 5, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  xText += colW3[3];
  doc.text("Años de Trabajo", xText + 2, yDatos + 5);
  doc.setFont("helvetica", "bold").text("2", xText + colW3[4] / 2, yDatos + 5, { align: "center" });

  // Fila 4
  yDatos += rowH3;
  // Proporciones para fila 4 (Empresa Contratista, Empresa, Tiempo exposición)
  const colW4 = [0.38, 0.38, 0.24].map(f => f * wTotal);
  let xCol4 = x0;
  doc.rect(x0, yDatos, wTotal, rowH4);
  for (let i = 0; i < colW4.length - 1; i++) {
    xCol4 += colW4[i];
    doc.line(xCol4, yDatos, xCol4, yDatos + rowH4);
  }
  // Etiquetas fila 4
  xText = x0 + 2;
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Empresa Contratista", xText, yDatos + 5);
  doc.setFont("helvetica", "bold").text("CONSTRUCTORA E INMOBILIARIA JAMELY E.I. R.L.", xText + colW4[0] / 2, yDatos + 5, { align: "center" });
  xText += colW4[0];
  doc.setFont("helvetica", "normal").text("Empresa", xText + 2, yDatos + 5);
  doc.setFont("helvetica", "bold").text("OBRASCON HUARTE LAIN S.A", xText + colW4[1] / 2, yDatos + 5, { align: "center" });
  xText += colW4[1];
  // Tiempo de exposición en dos líneas y dato centrado debajo
  const tiempoExpoLabel1 = "Tiempo de";
  const tiempoExpoLabel2 = "exposición";
  const tiempoExpoDato = "5 H/D";
  // Label en dos líneas
  doc.setFont("helvetica", "normal").text(tiempoExpoLabel1, xText + colW4[2] / 2, yDatos + 3, { align: "center" });
  doc.text(tiempoExpoLabel2, xText + colW4[2] / 2, yDatos + 6, { align: "center" });
  // Dato centrado debajo
  doc.setFont("helvetica", "bold").text(tiempoExpoDato, xText + colW4[2] / 2, yDatos + 10, { align: "center" });

  // --- Uso de Protectores Auditivos y Apreciación del Ruido ---
  let yProtec = yDatos + rowH4;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.rect(x0, yProtec, 70, 8);
  doc.rect(x0 + 70, yProtec, wTotal - 70, 8);
  doc.text("Uso de Protectores Auditivos", x0 + 35, yProtec + 5, { align: "center" });
  doc.text("Apreciación del Ruido", x0 + 70 + (wTotal - 70) / 2, yProtec + 5, { align: "center" });
  yProtec += 8;
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.rect(x0, yProtec, 70, 7);
  doc.rect(x0 + 70, yProtec, wTotal - 70, 7);
  doc.text("Tapones ( X )    Orejeras ( )", x0 + 35, yProtec + 5, { align: "center" });
  doc.text("Ruido muy Intenso ( )    Ruido moderado ( )    Ruido no molesto ( )", x0 + 70 + (wTotal - 70) / 2, yProtec + 5, { align: "center" });

  // --- Tabla de antecedentes ---
  let yAnte = yProtec + 7;
  // Calcular columnas proporcionales al ancho total
  const colWAnte = [0.23, 0.07, 0.07, 0.23, 0.07, 0.07].map(f => f * wTotal);
  const tableWAnte = wTotal;
  const tableH = 7 * 6; // 6 filas + encabezado
  doc.rect(x0, yAnte, tableWAnte, tableH);
  let xCol = x0;
  for (let i = 0; i < colWAnte.length - 1; i++) {
    xCol += colWAnte[i];
    doc.line(xCol, yAnte, xCol, yAnte + tableH);
  }
  for (let i = 1; i < 7; i++) {
    doc.line(x0, yAnte + i * 6, x0 + tableWAnte, yAnte + i * 6);
  }
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("ANTECEDENTES relacionados", x0 + 2, yAnte + 4);
  doc.text("SI", x0 + colWAnte[0] + colWAnte[1] / 2, yAnte + 4, { align: "center" });
  doc.text("NO", x0 + colWAnte[0] + colWAnte[1] + colWAnte[2] / 2, yAnte + 4, { align: "center" });
  doc.text("SI", x0 + colWAnte[0] + colWAnte[1] + colWAnte[2] + colWAnte[3] + colWAnte[4] / 2, yAnte + 4, { align: "center" });
  doc.text("NO", x0 + colWAnte[0] + colWAnte[1] + colWAnte[2] + colWAnte[3] + colWAnte[4] + colWAnte[5] / 2, yAnte + 4, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  const antecedentes = [
    ["Consumo de Tabaco", "X", "", "Disminución de la audición", "", "X"],
    ["Servicio Militar", "X", "", "Dolor de oídos", "", "X"],
    ["Hobbies con exposición a ruido", "", "X", "Zumbido", "", "X"],
    ["Exposición laboral a químicos", "", "X", "Mareos", "", "X"],
    ["Infección al Oído", "", "X", "Infección al oído", "", "X"],
    ["Uso de Ototóxicos", "", "X", "Otros", "", "X"]
  ];
  for (let i = 0; i < antecedentes.length; i++) {
    const row = antecedentes[i];
    doc.text(row[0], x0 + 2, yAnte + 10 + i * 6);
    doc.setFont("helvetica", "bold").text(row[1], x0 + colWAnte[0] + colWAnte[1] / 2, yAnte + 10 + i * 6, { align: "center" });
    doc.setFont("helvetica", "normal").text(row[2], x0 + colWAnte[0] + colWAnte[1] + colWAnte[2] / 2, yAnte + 10 + i * 6, { align: "center" });
    doc.text(row[3], x0 + colWAnte[0] + colWAnte[1] + colWAnte[2] + 2, yAnte + 10 + i * 6);
    doc.setFont("helvetica", "bold").text(row[5], x0 + colWAnte[0] + colWAnte[1] + colWAnte[2] + colWAnte[3] + colWAnte[4] + colWAnte[5] / 2, yAnte + 10 + i * 6, { align: "center" });
    doc.setFont("helvetica", "normal").text(row[4], x0 + colWAnte[0] + colWAnte[1] + colWAnte[2] + colWAnte[3] + colWAnte[4] / 2, yAnte + 10 + i * 6, { align: "center" });
  }

  // --- Otoscopia ---
  let yOto = yAnte + tableH + 7;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("OTOSCOPIA:", x0, yOto);

  // --- NUEVO: Sección de dos columnas ---
  // Márgenes laterales más amplios
  const colGap = 8;
  const colH = 75; // más bajo para que las líneas estén más juntas
  const colY = yOto + 8;
  // Espacio para etiquetas dB
  const dbLabelW = 12;
  // Área útil total para el bloque inferior (gráfico + tablas)
  const usableW = pageW - 2 * margin - dbLabelW;
  // El ancho del gráfico será la mitad del área útil menos la separación
  const graphW = (usableW - colGap) / 2;
  const graphH = colH;
  const graphX = margin + dbLabelW;
  const graphY = colY;
  // La tabla empieza después del gráfico y el gap
  const tableX = graphX + graphW + colGap;
  const tableWRight = usableW - graphW - colGap;
  // Cuadrícula
  doc.setDrawColor(0);
  doc.setLineWidth(0.2); // líneas más delgadas
  // Fondo azul de 20 a 40 dB (ajustado a nueva escala)
  // Asegura el color azul claro justo antes de dibujar
  doc.setFillColor(180, 235, 255);
  const y20 = graphY + ((20 + 10) / 130) * graphH;
  const y40 = graphY + ((40 + 10) / 130) * graphH;
  doc.rect(graphX, y20, graphW, y40 - y20, 'F');
  // Líneas horizontales (cada 10 dB, de -10 a 120)
  for (let i = 0; i <= 13; i++) {
    const yLine = graphY + i * (graphH / 13);
    doc.line(graphX, yLine, graphX + graphW, yLine);
  }
  // Líneas verticales (frecuencias)
  for (let i = 0; i < 9; i++) {
    const xLine = graphX + i * (graphW / 8);
    doc.line(xLine, graphY, xLine, graphY + graphH);
  }
  // Etiquetas de frecuencia (Hz) - SOLO UNA FILA
  const freqs = [125, 250, 500, 1000, 2000, 3000, 4000, 6000, 8000];
  doc.setFont("helvetica", "normal").setFontSize(7);
  for (let i = 0; i < freqs.length; i++) {
    const xTick = graphX + i * (graphW / 8);
    doc.text(String(freqs[i]), xTick, graphY - 2, { align: "center" });
  }
  // Mover 'Hz' más a la derecha del último valor
  doc.text("Hz", graphX + graphW + 4, graphY - 2, { align: "left" });
  // Etiquetas dB
  for (let i = 0; i <= 13; i++) {
    const dB = -10 + i * 10;
    const yTick = graphY + i * (graphH / 13) + 2;
    doc.text(String(dB), graphX - 7, yTick, { align: "right" });
  }
  doc.text("dB", graphX - 10, graphY + graphH / 2, { align: "right" });

  // Graficar puntos de audiometría (ahora con círculos y X, y líneas conectando cada tipo)
  // Ejemplo de datos:
  const puntos = [
    { freq: 500, db: 40, color: 'red', tipo: 'circle' },
    { freq: 1000, db: 30, color: 'red', tipo: 'circle' },
    { freq: 2000, db: 60, color: 'red', tipo: 'circle' },
    { freq: 3000, db: 40, color: 'red', tipo: 'circle' },
    { freq: 4000, db: 50, color: 'red', tipo: 'circle' },
    { freq: 6000, db: 30, color: 'red', tipo: 'circle' },
    { freq: 8000, db: 40, color: 'red', tipo: 'circle' },
    { freq: 500, db: 30, color: 'blue', tipo: 'x' },
    { freq: 1000, db: 40, color: 'blue', tipo: 'x' },
    { freq: 2000, db: 35, color: 'blue', tipo: 'x' },
    { freq: 3000, db: 30, color: 'blue', tipo: 'x' },
    { freq: 4000, db: 40, color: 'blue', tipo: 'x' },
    { freq: 6000, db: 45, color: 'blue', tipo: 'x' },
    { freq: 8000, db: 35, color: 'blue', tipo: 'x' },
  ];
  // Agrupar por tipo y color
  const tipos = [
    { tipo: 'circle', color: 'red' },
    { tipo: 'x', color: 'blue' }
  ];
  const prevLineWidth = doc.getLineWidth();
  tipos.forEach(({ tipo, color }) => {
    // Filtrar puntos de este tipo y color, y ordenarlos por frecuencia
    const pts = puntos.filter(p => p.tipo === tipo && p.color === color)
      .sort((a, b) => a.freq - b.freq);
    if (pts.length < 2) return;
    // Dibujar línea conectando los puntos
    doc.setLineWidth(0.4);
    if (color === 'red') doc.setDrawColor(255, 0, 0);
    else if (color === 'blue') doc.setDrawColor(0, 0, 255);
    else doc.setDrawColor(0, 0, 0);
    doc.setLineCap(1);
    for (let i = 0; i < pts.length - 1; i++) {
      const freqIdx1 = freqs.indexOf(pts[i].freq);
      const freqIdx2 = freqs.indexOf(pts[i + 1].freq);
      if (freqIdx1 === -1 || freqIdx2 === -1) continue;
      const x1 = graphX + freqIdx1 * (graphW / 8);
      const y1 = graphY + ((pts[i].db + 10) / 120) * graphH;
      const x2 = graphX + freqIdx2 * (graphW / 8);
      const y2 = graphY + ((pts[i + 1].db + 10) / 120) * graphH;
      doc.line(x1, y1, x2, y2);
    }
  });
  // Dibujar los puntos (círculo o X)
  puntos.forEach(punto => {
    const freqIdx = freqs.indexOf(punto.freq);
    if (freqIdx === -1) return;
    const x = graphX + freqIdx * (graphW / 8);
    const yP = graphY + ((punto.db + 10) / 120) * graphH;
    if (punto.color === 'red') doc.setDrawColor(255, 0, 0);
    else if (punto.color === 'blue') doc.setDrawColor(0, 0, 255);
    else doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    if (punto.tipo === 'circle') {
      doc.circle(x, yP, 1.0);
    } else if (punto.tipo === 'x') {
      // Dibujar una X centrada en (x, yP)
      const size = 1.5;
      doc.line(x - size / 2, yP - size / 2, x + size / 2, yP + size / 2);
      doc.line(x - size / 2, yP + size / 2, x + size / 2, yP - size / 2);
    }
    doc.setDrawColor(0, 0, 0);
  });
  doc.setLineWidth(prevLineWidth);

  // Derecha: tablas
  // const tableX = graphX + graphW + colGap;
  // const tableWRight = pageW - margin - tableX;
  
  // --- Tabla DIAPASONES ---
  let tY = graphY;
  const tH = 28;
  const tRows = 5;
  const tCols = 3;
  const tRowH = tH / tRows;
  const tColW = tableWRight / tCols;
  doc.setLineWidth(0.4);
  doc.rect(tableX, tY, tableWRight, tH);
  // Filas
  for (let i = 1; i < tRows; i++) {
    doc.line(tableX, tY + i * tRowH, tableX + tableWRight, tY + i * tRowH);
  }
  // Primera fila: solo una celda, sin líneas internas
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DIAPASONES", tableX + tableWRight / 2, tY + tRowH / 2 + 1, { align: "center", baseline: "middle" });
  // Columnas SOLO desde la segunda fila
  for (let i = 1; i < tCols; i++) {
    doc.line(tableX + i * tColW, tY + tRowH, tableX + i * tColW, tY + tH);
  }
  // Encabezados de columna (segunda fila)
  doc.setFontSize(7);
  doc.text("OD", tableX + tColW / 2, tY + tRowH + tRowH / 2, { align: "center", baseline: "middle" });
  doc.text("RINNE Y WEBER", tableX + tColW + tColW / 2, tY + tRowH + tRowH / 2, { align: "center", baseline: "middle" });
  doc.text("OI", tableX + 2 * tColW + tColW / 2, tY + tRowH + tRowH / 2, { align: "center", baseline: "middle" });
  // Filas de frecuencias
  doc.setFont("helvetica", "normal").setFontSize(7);
  const diapasonRows = ["250 Hz.", "500 Hz.", "1000 Hz."];
  for (let i = 0; i < diapasonRows.length; i++) {
    doc.text(diapasonRows[i], tableX + tColW + 3, tY + (i + 2) * tRowH + tRowH / 2, { align: "left", baseline: "middle" });
  }

  // --- Tabla LOGOAUDIOMETRIA ---
  tY += tH + 8;
  const t2Rows = 5;
  const t2Cols = 3;
  const t2RowH = 9;
  const t2ColWArr = [tableWRight * 0.6, tableWRight * 0.2, tableWRight * 0.2];
  const t2H = t2Rows * t2RowH;
  // Dibujar marco exterior
  doc.rect(tableX, tY, tableWRight, t2H);
  // Filas
  for (let i = 1; i < t2Rows; i++) {
    doc.line(tableX, tY + i * t2RowH, tableX + tableWRight, tY + i * t2RowH);
  }
  // Primera fila: solo una celda, sin líneas internas
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("LOGOAUDIOMETRIA", tableX + tableWRight / 2, tY + t2RowH / 2, { align: "center", baseline: "middle" });
  // Columnas con anchos personalizados SOLO desde la segunda fila
  let t2X = tableX;
  for (let i = 0; i < t2Cols - 1; i++) {
    t2X += t2ColWArr[i];
    // Solo dibujar líneas verticales desde la segunda fila hacia abajo
    doc.line(t2X, tY + t2RowH, t2X, tY + t2H);
  }
  // Encabezados de columna (segunda fila)
  doc.setFontSize(7);
  doc.text("DERECHA", tableX + t2ColWArr[0] + t2ColWArr[1] / 2, tY + t2RowH + t2RowH / 2, { align: "center", baseline: "middle" });
  doc.text("IZQUIERDA", tableX + t2ColWArr[0] + t2ColWArr[1] + t2ColWArr[2] / 2, tY + t2RowH + t2RowH / 2, { align: "center", baseline: "middle" });
  // Filas de etiquetas centradas
  doc.setFont("helvetica", "normal").setFontSize(7);
  const logoRows = [
    "Umbral de discriminación",
    "% de discriminación",
    "Umbral de Confort MCL",
    "Umbral de disconfort UCL"
  ];
  for (let i = 0; i < logoRows.length; i++) {
    doc.text(logoRows[i], tableX + t2ColWArr[0] / 2, tY + (i + 2) * t2RowH - t2RowH / 2, { align: "center", baseline: "middle" });
  }

  // --- Tabla de conclusiones y firmas (a todo el ancho) ---
  const conclY = Math.max(graphY + graphH, tY + t2H) + 12;
  const conclH = 12;
  const conclRows = 3;
  const conclW = pageW - 2 * 8;
  const conclX = 8;
  const conclCol1W = conclW * 0.23;
  const conclCol2W = conclW * 0.57;
  const conclCol3W = conclW * 0.20;
  // Marco exterior
  doc.rect(conclX, conclY, conclW, conclH * conclRows);
  // Líneas horizontales
  for (let i = 1; i < conclRows; i++) {
    doc.line(conclX, conclY + i * conclH, conclX + conclW, conclY + i * conclH);
  }
  // Líneas verticales
  doc.line(conclX + conclCol1W, conclY, conclX + conclCol1W, conclY + conclH * conclRows);
  doc.line(conclX + conclCol1W + conclCol2W, conclY, conclX + conclCol1W + conclCol2W, conclY + conclH * conclRows);
  // Unificar tamaño de fuente
  doc.setFont("helvetica", "normal").setFontSize(9);
  // Fila 1
  doc.text("Conclusiones:", conclX + 3, conclY + conclH / 2 + 2, { align: "left", baseline: "middle" });
  doc.text("PRUEBA", conclX + conclCol1W + 3, conclY + conclH / 2 + 2, { align: "left", baseline: "middle" });
  doc.text("Sello y Firma", conclX + conclCol1W + conclCol2W + conclCol3W / 2, conclY + conclH / 2 + 2, { align: "center", baseline: "middle" });
  // Fila 2
  // Ajustar texto largo para que no se monte ni desborde
  const label2 = "Nombre del profesional que realiza la audiometría";
  const label2Lines = doc.splitTextToSize(label2, conclCol1W - 6);
  let label2Y = conclY + conclH + conclH / 2 + 1;
  if (label2Lines.length > 1) {
    // Si hay salto, centrar verticalmente
    label2Y = conclY + conclH + conclH / 2 - 2;
    doc.text(label2Lines, conclX + 3, label2Y, { align: "left", baseline: "middle" });
  } else {
    doc.text(label2, conclX + 3, conclY + conclH + conclH / 2 + 2, { align: "left", baseline: "middle" });
  }
  // Campo profesional: ajustar para que no se salga
  const profName = "SHIRLEY KATHERINE GUTIERREZ ARTEAGA";
  const profNameLines = doc.splitTextToSize(profName, conclCol2W - 6);
  let profNameY = conclY + conclH + conclH / 2 + 2;
  if (profNameLines.length > 1) {
    profNameY = conclY + conclH + conclH / 2 - 2;
    doc.text(profNameLines, conclX + conclCol1W + 3, profNameY, { align: "left", baseline: "middle" });
  } else {
    doc.text(profName, conclX + conclCol1W + 3, conclY + conclH + conclH / 2 + 2, { align: "left", baseline: "middle" });
  }
  doc.text("Sello y Firma", conclX + conclCol1W + conclCol2W + conclCol3W / 2, conclY + conclH + conclH / 2 + 2, { align: "center", baseline: "middle" });
  // Fila 3
  doc.text("Nombre del Medico", conclX + 3, conclY + 2 * conclH + conclH / 2 + 2, { align: "left", baseline: "middle" });
  doc.text("", conclX + conclCol1W + 3, conclY + 2 * conclH + conclH / 2 + 2, { align: "left", baseline: "middle" });
  doc.text("Sello y Firma", conclX + conclCol1W + conclCol2W + conclCol3W / 2, conclY + 2 * conclH + conclH / 2 + 2, { align: "center", baseline: "middle" });

  // 4) Imprimir automáticamente
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
}
