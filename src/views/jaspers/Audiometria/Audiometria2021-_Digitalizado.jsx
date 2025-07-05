import jsPDF from 'jspdf';
import header_Audiometria2021_Digitalizado from './headers/header_Audiometria2021-_Digitalizado.jsx';

/**
 * Título, dos mini-tablas (Sordera/Acúfenos y Vértigo/Otalgia), y Secreción Ótica con un solo par de cuadros, todo alineado y compacto.
 * @param {jsPDF} doc - Instancia de jsPDF
 */
const body_Audiometria2021_Digitalizado = (doc) => {
  // Llamar header al inicio
  header_Audiometria2021_Digitalizado(doc);
  let y = 55; // posición inicial
  const margin = 16;
  const cellW = 4.2;
  const cellH = 4.2;
  const tableSpacing = 32; // separación horizontal entre los dos primeros bloques
  const secrecionSpacing = 15; // separación horizontal para Secreción Ótica

  // =====================
  // 2.- Síntomas Actuales
  // =====================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('2.- Síntomas Actuales:', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 6;

  // Primera tabla: Sordera/Acúfenos
  doc.setFontSize(8);
  doc.text('Sordera', margin + 2, y + cellH * 0.8);
  doc.text('Acúfenos', margin + 2, y + cellH * 1.8 + 0.5);
  // Encabezado Si/No
  const tableX1 = margin + 18;
  doc.setFontSize(8);
  doc.text('Si', tableX1 + cellW / 2, y, { align: 'center' });
  doc.text('No', tableX1 + 1.5 * cellW, y, { align: 'center' });
  // Cuadros y X
  // Sordera
  doc.rect(tableX1, y + 1, cellW, cellH);
  doc.rect(tableX1 + cellW, y + 1, cellW, cellH);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('X', tableX1 + cellW + cellW / 2, y + 1 + cellH * 0.75, { align: 'center' });
  // Acúfenos
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.rect(tableX1, y + cellH + 1, cellW, cellH);
  doc.rect(tableX1 + cellW, y + cellH + 1, cellW, cellH);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('X', tableX1 + cellW + cellW / 2, y + cellH + 1 + cellH * 0.75, { align: 'center' });

  // Segunda tabla: Vértigo/Otalgia
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const tableX2 = tableX1 + tableSpacing;
  doc.text('Vértigo', tableX2 - 13, y + cellH * 0.8);
  doc.text('Otalgia', tableX2 - 13, y + cellH * 1.8 + 0.5);
  doc.setFontSize(8);
  doc.text('Si', tableX2 + cellW / 2, y, { align: 'center' });
  doc.text('No', tableX2 + 1.5 * cellW, y, { align: 'center' });
  // Cuadros y X
  // Vértigo
  doc.rect(tableX2, y + 1, cellW, cellH);
  doc.rect(tableX2 + cellW, y + 1, cellW, cellH);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('X', tableX2 + cellW + cellW / 2, y + 1 + cellH * 0.75, { align: 'center' });
  // Otalgia
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.rect(tableX2, y + cellH + 1, cellW, cellH);
  doc.rect(tableX2 + cellW, y + cellH + 1, cellW, cellH);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('X', tableX2 + cellW + cellW / 2, y + cellH + 1 + cellH * 0.75, { align: 'center' });

  // Secreción Ótica: solo una fila, etiqueta a la izquierda, cuadros a la derecha
  const secrecionX = tableX2 + secrecionSpacing;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Secreción Ótica', secrecionX, y + cellH * 0.8);
  doc.setFontSize(8);
  const cuadrosX = secrecionX + 24; // más espacio para evitar colisión
  doc.text('Si', cuadrosX + cellW / 2, y, { align: 'center' });
  doc.text('No', cuadrosX + 1.5 * cellW, y, { align: 'center' });
  doc.rect(cuadrosX, y + 1, cellW, cellH);
  doc.rect(cuadrosX + cellW, y + 1, cellW, cellH);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('X', cuadrosX + cellW + cellW / 2, y + 1 + cellH * 0.75, { align: 'center' });

  // =====================
  // 3.- Antecedentes Médicos de importancia
  // =====================
  y += cellH * 2.5 + 7; // Espacio después de síntomas
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('3.- Antecedentes Médicos de importancia:', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 5.5;

  // --- Primer bloque (izquierda) ---
  const block1X = margin;
  const block1Labels = [
    'Rinitis',
    'Sinusitis',
    'Otitis Media Crónica',
    'Medicamentos Ototóxicos'
  ];
  doc.setFontSize(8);
  const block1BoxOffset = 43; // antes 32
  doc.text('Si', block1X + block1BoxOffset + cellW / 2, y, { align: 'center' });
  doc.text('No', block1X + block1BoxOffset + 1.5 * cellW, y, { align: 'center' });
  for (let i = 0; i < block1Labels.length; i++) {
    doc.text(block1Labels[i], block1X + 2, y + cellH * (i + 0.8));
    doc.rect(block1X + block1BoxOffset, y + cellH * i + 1, cellW, cellH);
    doc.rect(block1X + block1BoxOffset + cellW, y + cellH * i + 1, cellW, cellH);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('X', block1X + block1BoxOffset + cellW + cellW / 2, y + cellH * i + 1 + cellH * 0.75, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
  }

  // --- Segundo bloque (centro) ---
  const block2X = block1X + 60;
  const block2Labels = [
    'Meningitis',
    'TEC',
    'Sordera'
  ];
  doc.text('Si', block2X + 22 + cellW / 2, y, { align: 'center' });
  doc.text('No', block2X + 22 + 1.5 * cellW, y, { align: 'center' });
  for (let i = 0; i < block2Labels.length; i++) {
    doc.text(block2Labels[i], block2X + 2, y + cellH * (i + 0.8));
    doc.rect(block2X + 22, y + cellH * i + 1, cellW, cellH);
    doc.rect(block2X + 22 + cellW, y + cellH * i + 1, cellW, cellH);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('X', block2X + 22 + cellW + cellW / 2, y + cellH * i + 1 + cellH * 0.75, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
  }
  // Línea para "Cuáles:" más abajo, alineada con la base del último cuadro
  const cualesY = y + cellH * 4.2; // antes 3.2
  doc.text('Cuáles:', block2X + 2, cualesY);
  doc.line(block2X + 15, cualesY - 0.1, block2X + 50, cualesY - 0.1);

  // --- Tercer bloque (derecha) ---
  const block3X = block2X + 60;
  const block3Labels = [
    'Parotiditis',
    'Sarampión',
    'TBC'
  ];
  doc.text('Si', block3X + 22 + cellW / 2, y, { align: 'center' });
  doc.text('No', block3X + 22 + 1.5 * cellW, y, { align: 'center' });
  for (let i = 0; i < block3Labels.length; i++) {
    doc.text(block3Labels[i], block3X + 2, y + cellH * (i + 0.8));
    doc.rect(block3X + 22, y + cellH * i + 1, cellW, cellH);
    doc.rect(block3X + 22 + cellW, y + cellH * i + 1, cellW, cellH);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('X', block3X + 22 + cellW + cellW / 2, y + cellH * i + 1 + cellH * 0.75, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
  }

  // =====================
  // 4.- Exposición Ocupacional (solo Exposición a ruido, institucional)
  // =====================
  y += cellH * 4.5 + 10; // Espacio después de antecedentes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('4.- Exposición Ocupacional', margin, y);
  doc.setFont('helvetica', 'normal');

  // --- Parámetros de tabla ---
  const tableY = y + 2.5;
  const tableX = margin;
  const rowH = 7.5;
  const colLabelW = 38;
  const colSiNoW = 8;
  // Definir anchos de columnas de rangos (ajustados a la referencia)
  const colRangosW = [18, 18, 18, 18, 18, 18, 18, 18, 14, 14, 14]; // 8 rangos + 3 celdas finales
  const cellFont = 7.2;

  // --- Dibujar marco principal ---
  doc.setLineWidth(0.7);
  // Marco general
  let totalW = colLabelW + colSiNoW * 2 + colRangosW.reduce((a, b) => a + b, 0);
  doc.rect(tableX, tableY, totalW, rowH * 3);
  // Líneas verticales para Si/No
  doc.line(tableX + colLabelW, tableY, tableX + colLabelW, tableY + rowH * 3);
  doc.line(tableX + colLabelW + colSiNoW, tableY, tableX + colLabelW + colSiNoW, tableY + rowH * 3);
  // Línea horizontal para separar filas
  doc.line(tableX, tableY + rowH, tableX + totalW, tableY + rowH);
  doc.line(tableX, tableY + rowH * 2, tableX + totalW, tableY + rowH * 2);
  // Líneas verticales para celdas de rangos
  let xCursor = tableX + colLabelW + colSiNoW * 2;
  for (let i = 0; i < colRangosW.length; i++) {
    xCursor += colRangosW[i];
    doc.line(xCursor, tableY, xCursor, tableY + rowH * 3);
  }
  doc.setLineWidth(0.2);

  // --- Etiquetas y contenido ---
  doc.setFontSize(cellFont);
  // Fila 1: Exposición a ruido
  doc.text('Exposición a ruido', tableX + 2, tableY + rowH * 0.7);
  doc.text('Sí', tableX + colLabelW + 2, tableY + rowH * 0.5);
  doc.text('No', tableX + colLabelW + colSiNoW + 2, tableY + rowH * 0.5);
  doc.rect(tableX + colLabelW, tableY + 2, colSiNoW, colSiNoW);
  doc.rect(tableX + colLabelW + colSiNoW, tableY + 2, colSiNoW, colSiNoW);
  doc.setFont('helvetica', 'bold');
  doc.text('X', tableX + colLabelW + 3 + colSiNoW / 2, tableY + 2 + colSiNoW * 0.7, { align: 'center' });
  doc.setFont('helvetica', 'normal');

  // --- Bloque de exposición ---
  // Fila 1: Título
  let xBlock = tableX + colLabelW + colSiNoW * 2;
  doc.setFontSize(7);
  doc.text('Tiempo de exposición', xBlock + colRangosW.slice(0, 8).reduce((a, b) => a + b, 0) / 2, tableY + rowH * 0.7, { align: 'center' });
  doc.setFontSize(6);
  doc.text('(Promedio de horas por día)', xBlock + colRangosW.slice(0, 8).reduce((a, b) => a + b, 0) / 2, tableY + rowH * 0.7 + 3, { align: 'center' });
  doc.setFontSize(7);
  doc.text('Años de Exposición', xBlock + colRangosW.slice(8).reduce((a, b) => a + b, 0) / 2 + xBlock + colRangosW.slice(0, 8).reduce((a, b) => a + b, 0), tableY + rowH * 1.7, { align: 'center' });
  doc.setFontSize(6);
  doc.text('(Aprox.)', xBlock + colRangosW.slice(8).reduce((a, b) => a + b, 0) / 2 + xBlock + colRangosW.slice(0, 8).reduce((a, b) => a + b, 0), tableY + rowH * 1.7 + 3, { align: 'center' });
  doc.setFontSize(cellFont);

  // Fila 2: Rangos de horas
  const colRangos = [ '0 a 2', '2 a 4', '4 a 6', '6 a 8', '8 a 10', '10 a 12', '> 12', 'Eventual' ];
  let xR = xBlock;
  for (let i = 0; i < colRangos.length; i++) {
    doc.text(colRangos[i], xR + colRangosW[i] / 2, tableY + rowH * 1.7, { align: 'center' });
    xR += colRangosW[i];
  }
  // Fila 3: Rangos de años y celdas finales
  const colAnios = [ '8 a 10', '10 a 12', '> 12', 'Eventual', 'años', 'meses' ];
  xR = xBlock + colRangosW[0] + colRangosW[1]; // empieza en la 3ra celda
  for (let i = 0; i < colAnios.length; i++) {
    doc.text(colAnios[i], xR + colRangosW[i + 2] / 2, tableY + rowH * 2.7, { align: 'center' });
    xR += colRangosW[i + 2];
  }
};

// Componente React que genera el PDF al hacer click
const Audiometria2021_Digitalizado = () => {
  const handleShowPDF = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    body_Audiometria2021_Digitalizado(doc);
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };
  return (
    <div>
      <button onClick={handleShowPDF}>Ver PDF - Síntomas y Antecedentes</button>
    </div>
  );
};

export default Audiometria2021_Digitalizado;
