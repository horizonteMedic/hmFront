import jsPDF from "jspdf";
import headerFicha from "./headers/header_FichaAudiologica_Digitalizado.jsx";

export default function FichaAudiologica_Digitalizado(datos = {}) {
  const doc = new jsPDF();
  const margin = 10;
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
  doc.rect(x0, yDatos, wTotal, rowH3);
  doc.line(x0 + 38, yDatos, x0 + 38, yDatos + rowH3); // Apellidos
  doc.line(x0 + 38 + 22, yDatos, x0 + 38 + 22, yDatos + rowH3); // Edad
  doc.line(x0 + 38 + 22 + 12, yDatos, x0 + 38 + 22 + 12, yDatos + rowH3); // Sexo
  doc.line(x0 + 38 + 22 + 12 + 38, yDatos, x0 + 38 + 22 + 12 + 38, yDatos + rowH3); // Ocupación
  doc.line(x0 + 38 + 22 + 12 + 38 + 22, yDatos, x0 + 38 + 22 + 12 + 38 + 22, yDatos + rowH3); // Años trabajo
  // Etiquetas fila 3
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Apellidos y Nombres", x0 + 2, yDatos + 5);
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("ROJAS SIGUENZA JOSUE SPENCER", x0 + 40, yDatos + 5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Edad", x0 + 38 + 2, yDatos + 5);
  doc.setFont("helvetica", "bold").text("29 AÑOS", x0 + 38 + 10, yDatos + 5);
  doc.text("Sexo", x0 + 38 + 22 + 2, yDatos + 5);
  doc.setFont("helvetica", "bold").text("M", x0 + 38 + 22 + 8, yDatos + 5);
  doc.setFont("helvetica", "normal").text("Ocupación", x0 + 38 + 22 + 12 + 2, yDatos + 5);
  doc.setFont("helvetica", "bold").text("ADMINISTRADOR", x0 + 38 + 22 + 12 + 18, yDatos + 5);
  doc.setFont("helvetica", "normal").text("Años de Trabajo", x0 + 38 + 22 + 12 + 38 + 2, yDatos + 5);
  doc.setFont("helvetica", "bold").text("2", x0 + 38 + 22 + 12 + 38 + 12, yDatos + 5);

  // Fila 4
  yDatos += rowH3;
  doc.rect(x0, yDatos, wTotal, rowH4);
  doc.line(x0 + 38, yDatos, x0 + 38, yDatos + rowH4); // Empresa Contratista
  doc.line(x0 + 38 + 70, yDatos, x0 + 38 + 70, yDatos + rowH4); // Empresa
  doc.line(x0 + 38 + 70 + 54, yDatos, x0 + 38 + 70 + 54, yDatos + rowH4); // Tiempo exposición
  // Etiquetas fila 4
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Empresa Contratista", x0 + 2, yDatos + 5);
  doc.setFont("helvetica", "bold").text("CONSTRUCTORA E INMOBILIARIA JAMELY E.I. R.L.", x0 + 40, yDatos + 5);
  doc.setFont("helvetica", "normal").text("Empresa", x0 + 38 + 70 + 2, yDatos + 5);
  doc.setFont("helvetica", "bold").text("OBRASCON HUARTE LAIN S.A", x0 + 38 + 70 + 14, yDatos + 5);
  doc.setFont("helvetica", "normal").text("Tiempo de exposición", x0 + 38 + 70 + 54 + 2, yDatos + 5);
  doc.setFont("helvetica", "bold").text("5 H/D", x0 + 38 + 70 + 54 + 24, yDatos + 5);

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
  const colWAnte = [60, 10, 10, 60, 10, 10];
  const tableWAnte = colWAnte.reduce((a, b) => a + b, 0);
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
  const marginInterno = 18; // margen solo para la sección de gráfico y tablas
  const colH = 90;
  const colY = yOto + 8;
  // Izquierda: gráfico audiométrico
  const graphX = marginInterno;
  const graphY = colY;
  const graphW = 100; // reducir ancho
  const graphH = colH;
  // Cuadrícula
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  // Fondo azul 20-40 dB
  doc.setFillColor(180, 235, 255);
  doc.rect(graphX, graphY + 30, graphW, 20, 'F');
  // Líneas horizontales (cada 10 dB)
  for (let i = 0; i <= 12; i++) {
    const yLine = graphY + i * (graphH / 12);
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
  for (let i = 0; i <= 12; i++) {
    const dB = -10 + i * 10;
    const yTick = graphY + i * (graphH / 12) + 2;
    doc.text(String(dB), graphX - 7, yTick, { align: "right" });
  }
  doc.text("dB", graphX - 10, graphY + graphH / 2, { align: "right" });

  // Graficar puntos de audiometría (solo borde rojo, delgado, sin relleno, sin trazo negro)
  const puntos = [
    { freq: 500, db: 100, color: 'red' },
    { freq: 1000, db: 100, color: 'red' },
    { freq: 2000, db: 100, color: 'red' },
    { freq: 3000, db: 100, color: 'red' },
    { freq: 4000, db: 100, color: 'red' },
    { freq: 6000, db: 100, color: 'red' },
    { freq: 8000, db: 100, color: 'red' }
  ];
  const prevLineWidth = doc.getLineWidth();
  for (const punto of puntos) {
    const freqIdx = freqs.indexOf(punto.freq);
    if (freqIdx === -1) continue;
    const x = graphX + freqIdx * (graphW / 8);
    const yP = graphY + ((punto.db + 10) / 120) * graphH;
    // Guardar color de trazo actual (por defecto negro)
    // Cambiar a rojo solo para el círculo
    if (punto.color === 'red') doc.setDrawColor(255, 0, 0);
    else if (punto.color === 'blue') doc.setDrawColor(0, 0, 255);
    else doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.circle(x, yP, 1.1);
    // Restaurar color de trazo a negro para el resto del gráfico
    doc.setDrawColor(0, 0, 0);
  }
  doc.setLineWidth(prevLineWidth);

  // Derecha: tablas
  const tableX = graphX + graphW + colGap;
  const tableWRight = pageW - tableX - marginInterno;
  
  // --- Tabla DIAPASONES ---
  let tY = graphY;
  const tH = 28;
  doc.setLineWidth(0.4);
  doc.rect(tableX, tY, tableWRight, tH);
  // Filas
  for (let i = 1; i < 5; i++) {
    doc.line(tableX, tY + i * (tH / 5), tableX + tableWRight, tY + i * (tH / 5));
  }
  // Columnas
  doc.line(tableX + tableWRight / 3, tY, tableX + tableWRight / 3, tY + tH);
  doc.line(tableX + 2 * tableWRight / 3, tY, tableX + 2 * tableWRight / 3, tY + tH);
  // Encabezados
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DIAPASONES", tableX + tableWRight / 2, tY + 5, { align: "center" });
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("OD", tableX + tableWRight / 6, tY + 10, { align: "center" });
  doc.text("RINNE Y WEBER", tableX + tableWRight / 2, tY + 10, { align: "center" });
  doc.text("OI", tableX + 5 * tableWRight / 6, tY + 10, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(7);
  // Ajustar textos de filas a la izquierda de su celda
  const diapasonRows = [
    { text: "250 Hz.", row: 2 },
    { text: "500 Hz.", row: 3 },
    { text: "1000 Hz.", row: 4 }
  ];
  for (let i = 0; i < diapasonRows.length; i++) {
    doc.text(diapasonRows[i].text, tableX + tableWRight / 3 + 2, tY + 10 + (i + 1) * (tH / 5), { align: "left" });
  }

  // --- Tabla LOGOAUDIOMETRIA ---
  tY += tH + 8;
  const t2H = 32;
  doc.rect(tableX, tY, tableWRight, t2H);
  // Filas
  for (let i = 1; i < 5; i++) {
    doc.line(tableX, tY + i * (t2H / 5), tableX + tableWRight, tY + i * (t2H / 5));
  }
  // Columnas
  doc.line(tableX + tableWRight / 3, tY, tableX + tableWRight / 3, tY + t2H);
  doc.line(tableX + 2 * tableWRight / 3, tY, tableX + 2 * tableWRight / 3, tY + t2H);
  // Encabezados
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("LOGOAUDIOMETRIA", tableX + tableWRight / 2, tY + 5, { align: "center" });
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("DERECHA", tableX + tableWRight / 3 + tableWRight / 6, tY + 10, { align: "center" });
  doc.text("IZQUIERDA", tableX + 5 * tableWRight / 6, tY + 10, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(7);
  // Ajustar textos de filas a la izquierda de su celda
  const logoRows = [
    "Umbral de discriminación",
    "% de discriminación",
    "Umbral de Confort MCL",
    "Umbral de disconfort UCL"
  ];
  for (let i = 0; i < logoRows.length; i++) {
    doc.text(logoRows[i], tableX + 2, tY + 15 + i * (t2H / 5), { align: "left" });
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
