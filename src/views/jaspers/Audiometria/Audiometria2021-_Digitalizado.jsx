import jsPDF from 'jspdf';
import header_Audiometria2021_Digitalizado from './headers/header_Audiometria2021-_Digitalizado.jsx';

/**
 * Genera el cuerpo completo del PDF:
 * 2.- Síntomas Actuales
 * 3.- Antecedentes Médicos de importancia
 * 4.- Exposición Ocupacional
 * @param {jsPDF} doc
 */
const body_Audiometria2021_Digitalizado = (doc) => {
  // Header
  header_Audiometria2021_Digitalizado(doc);

  // Variables iniciales
  let y = 55;
  const margin = 16;
  const cellW = 4.2;
  const cellH = 4.2;
  const tableSpacing = 32;
  const secrecionSpacing = 15;

  // =====================
  // 2.- Síntomas Actuales
  // =====================
  doc.setFont('helvetica','bold').setFontSize(8);
  doc.text('2.- Síntomas Actuales:', margin, y);
  doc.setFont('helvetica','normal');
  y += 6;

  // Sordera / Acúfenos
  const sx1 = margin + 18;
  doc.setFontSize(8);
  doc.text('Sordera', margin + 2,       y + cellH * 0.8);
  doc.text('Acúfenos', margin + 2,      y + cellH * 1.8 + 0.5);
  doc.text('Si',     sx1 + cellW/2,     y, { align:'center' });
  doc.text('No',     sx1 + 1.5*cellW,    y, { align:'center' });
  // cuadros y X (Sordera)
  doc.rect(sx1,        y+1, cellW, cellH);
  doc.rect(sx1+cellW,  y+1, cellW, cellH);
  doc.setFont('helvetica','bold').text('X', sx1+cellW+cellW/2, y+1+cellH*0.75, { align:'center' });
  // cuadros y X (Acúfenos)
  doc.setFont('helvetica','normal');
  doc.rect(sx1,        y+cellH+1, cellW, cellH);
  doc.rect(sx1+cellW,  y+cellH+1, cellW, cellH);
  doc.setFont('helvetica','bold').text('X', sx1+cellW+cellW/2, y+cellH+1+cellH*0.75, { align:'center' });

  // Vértigo / Otalgia
  const sx2 = sx1 + tableSpacing;
  doc.setFont('helvetica','normal').setFontSize(8);
  doc.text('Vértigo', sx2 - 13,      y + cellH * 0.8);
  doc.text('Otalgia', sx2 - 13,      y + cellH * 1.8 + 0.5);
  doc.text('Si',      sx2 + cellW/2, y, { align:'center' });
  doc.text('No',      sx2 + 1.5*cellW, y, { align:'center' });
  // cuadros y X (Vértigo)
  doc.rect(sx2,        y+1, cellW, cellH);
  doc.rect(sx2+cellW,  y+1, cellW, cellH);
  doc.setFont('helvetica','bold').text('X', sx2+cellW+cellW/2, y+1+cellH*0.75, { align:'center' });
  // cuadros y X (Otalgia)
  doc.setFont('helvetica','normal');
  doc.rect(sx2,        y+cellH+1, cellW, cellH);
  doc.rect(sx2+cellW,  y+cellH+1, cellW, cellH);
  doc.setFont('helvetica','bold').text('X', sx2+cellW+cellW/2, y+cellH+1+cellH*0.75, { align:'center' });

  // Secreción Ótica
  const sx3 = sx2 + secrecionSpacing;
  doc.setFont('helvetica','normal').setFontSize(8);
  doc.text('Secreción Ótica', sx3, y + cellH * 0.8);
  const sx3b = sx3 + 24;
  doc.text('Si', sx3b + cellW/2,      y, { align:'center' });
  doc.text('No', sx3b + 1.5*cellW,     y, { align:'center' });
  doc.rect(sx3b,       y+1, cellW, cellH);
  doc.rect(sx3b+cellW,  y+1, cellW, cellH);
  doc.setFont('helvetica','bold').text('X', sx3b+cellW+cellW/2, y+1+cellH*0.75, { align:'center' });

  // =====================
  // 3.- Antecedentes Médicos de importancia
  // =====================
  y += cellH * 2.5 + 7;
  doc.setFont('helvetica','bold').setFontSize(8);
  doc.text('3.- Antecedentes Médicos de importancia:', margin, y);
  doc.setFont('helvetica','normal');
  y += 5.5;

  // Bloque 1
  const b1x = margin;
  const b1  = ['Rinitis','Sinusitis','Otitis Media Crónica','Medicamentos Ototóxicos'];
  const off1 = 43;
  doc.text('Si', b1x + off1 + cellW/2,   y, { align:'center' });
  doc.text('No', b1x + off1 + 1.5*cellW, y, { align:'center' });
  for (let i = 0; i < b1.length; i++) {
    doc.text(b1[i], b1x+2, y + cellH*(i+0.8));
    doc.rect(b1x+off1,        y+cellH*i+1, cellW, cellH);
    doc.rect(b1x+off1+cellW,  y+cellH*i+1, cellW, cellH);
    doc.setFont('helvetica','bold').text('X', b1x+off1+cellW+cellW/2, y+cellH*i+1+cellH*0.75, { align:'center' });
    doc.setFont('helvetica','normal');
  }

  // Bloque 2
  const b2x = b1x + 60;
  const b2  = ['Meningitis','TEC','Sordera'];
  doc.text('Si', b2x + 22 + cellW/2,   y, { align:'center' });
  doc.text('No', b2x + 22 + 1.5*cellW, y, { align:'center' });
  for (let i = 0; i < b2.length; i++) {
    doc.text(b2[i], b2x+2, y + cellH*(i+0.8));
    doc.rect(b2x+22,        y+cellH*i+1, cellW, cellH);
    doc.rect(b2x+22+cellW,  y+cellH*i+1, cellW, cellH);
    doc.setFont('helvetica','bold').text('X', b2x+22+cellW+cellW/2, y+cellH*i+1+cellH*0.75, { align:'center' });
    doc.setFont('helvetica','normal');
  }
  const cualesY = y + cellH * 4.2;
  doc.text('Cuáles:', b2x+2, cualesY);
  doc.line(b2x+15, cualesY-0.1, b2x+50, cualesY-0.1);

  // Bloque 3
  const b3x = b2x + 60;
  const b3  = ['Parotiditis','Sarampión','TBC'];
  doc.text('Si', b3x + 22 + cellW/2,   y, { align:'center' });
  doc.text('No', b3x + 22 + 1.5*cellW, y, { align:'center' });
  for (let i = 0; i < b3.length; i++) {
    doc.text(b3[i], b3x+2, y + cellH*(i+0.8));
    doc.rect(b3x+22,       y+cellH*i+1, cellW, cellH);
    doc.rect(b3x+22+cellW, y+cellH*i+1, cellW, cellH);
    doc.setFont('helvetica','bold').text('X', b3x+22+cellW+cellW/2, y+cellH*i+1+cellH*0.75, { align:'center' });
    doc.setFont('helvetica','normal');
  }

   // —— Separación antes de la sección 4 ——
   y += (b3.length * cellH) + 6 + 8;

   // =====================
   // 4.- Exposición Ocupacional
   // =====================
   doc.setFont('helvetica','bold').setFontSize(8);
   doc.text('4.- Exposición Ocupacional:', margin, y);
   y += 4;
 
   // Parámetros de la mini-tabla
   const tx = margin;
   const ty = y;
   const colW = [40, 15, 15, 40, 45];  // Agregamos columna 5
   const rowH = cellH;
   const H = rowH * 2;
 
   // Contorno exterior
   doc.rect(tx, ty, colW.reduce((a, b) => a + b, 0), H);
 
   // Líneas verticales
   let accX = tx;
   for (let i = 0; i < colW.length - 1; i++) {
     accX += colW[i];
     doc.line(accX, ty, accX, ty + H);
   }
 
   // Línea horizontal media (divide filas)
   doc.line(tx, ty + rowH, tx + colW.reduce((a, b) => a + b, 0), ty + rowH);
 
   // Fila 1 (encabezados y opciones)
   doc.setFontSize(8).setFont('helvetica', 'normal');
   doc.text('Exposición a ruido', tx + 2, ty + rowH / 2 + 1, { align: 'left' });
   doc.text('si', tx + colW[0] + colW[1] / 2, ty + rowH / 2 + 1, { align: 'center' });
   doc.text('no', tx + colW[0] + colW[1] + colW[2] / 2, ty + rowH / 2 + 1, { align: 'center' });
   doc.text('texto', tx + colW[0] + colW[1] + colW[2] + colW[3] / 2, ty + rowH / 2 + 1, { align: 'center' });
 
   // Columna 5 - fila 1 (dividida en dos líneas)
   const col5x = tx + colW[0] + colW[1] + colW[2] + colW[3];
   doc.text('tiempo de exposición (', col5x + 2, ty + 3.5, { align: 'left' });
   doc.text('promedio de horas)', col5x + 2, ty + 6.5, { align: 'left' });
   doc.text('0 a 2', col5x + colW[4] / 2, ty + 10.5, { align: 'center' });
 
   // Columna 5 - fila 2
   doc.text('años de exposición (', col5x + 2, ty + rowH + 3.5, { align: 'left' });
   doc.text('aprox )', col5x + 2, ty + rowH + 6.5, { align: 'left' });
   doc.text('años', col5x + colW[4] / 2, ty + rowH + 10.5, { align: 'center' });
 
   // Avanzar Y para continuar con el siguiente bloque (si es necesario)
   y += H + 5;
 
};

/**
 * Componente React que dispara la generación del PDF.
 */
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
      <button onClick={handleShowPDF}>
        Ver PDF – Síntomas, Antecedentes y Exposición Ocupacional
      </button>
    </div>
  );
};

export default Audiometria2021_Digitalizado;
