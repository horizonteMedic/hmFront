import jsPDF from 'jspdf';
import header_Audiometria2021_Digitalizado from './headers/header_Audiometria2021-_Digitalizado_boro.jsx';

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

  // Insertar imagen cuerpo2-8.png en la parte superior
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;
  const usableW = pageW - margin * 2;
  let y = 40;
  try {
    doc.addImage('public/img/cuerpo2-8.png', 'PNG', margin, y, usableW, 40);
    y += 45;
  } catch (e) {
    doc.text('Imagen no disponible', margin, y + 10);
    y += 20;
  }

  // =====================
  // 7.- Audiometría
  // =====================
  y += 6;
  doc.setFont('helvetica','bold').setFontSize(8);
  doc.text('7.- Audiometría:', margin, y);
  doc.setFont('helvetica','normal').setFontSize(8);
  doc.text('(OD: Rojo, OI: Azul)', margin + 40, y);
  y += 4;

  // Calcular mitad del ancho útil
  const halfW = (pageW - margin * 2) / 2;
  const legendW = halfW;
  const legendH = 70;
  const graphW = halfW;
  const graphH = 70;

  // Leyenda (mitad izquierda)
  try {
    doc.addImage('public/img/leyenda_grafico.png', 'PNG', margin, y + 2, legendW, legendH);
  } catch (e) {
    doc.text('Leyenda no disponible', margin, y + 10);
  }

  // Gráfico dinámico (mitad derecha)
  const graphX = margin + halfW;
  const graphY = y;
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
  for (let i = 0; i <= 9; i++) {
    const xLine = graphX + i * (graphW / 9);
    doc.line(xLine, graphY, xLine, graphY + graphH);
  }
  // Ejes y etiquetas
  doc.setFont('helvetica', 'normal').setFontSize(7);
  const freqs = [125, 250, 500, 1000, 2000, 3000, 4000, 6000, 8000];
  for (let i = 0; i < freqs.length; i++) {
    const xTick = graphX + (i + 0.5) * (graphW / 9);
    doc.text(String(freqs[i]), xTick, graphY - 2, { align: 'center' });
  }
  doc.text('Hz', graphX + graphW, graphY - 2, { align: 'left' });
  for (let i = 0; i <= 12; i++) {
    const dB = -10 + i * 10;
    const yTick = graphY + i * (graphH / 12) + 2;
    doc.text(String(dB), graphX - 7, yTick, { align: 'right' });
  }
  doc.text('dB', graphX - 10, graphY + graphH / 2, { align: 'right' });

  y += legendH + 5;

  // =====================
  // 8.- Interpretación – Conclusiones
  // =====================
  doc.setFont('helvetica','bold').setFontSize(8);
  doc.text('8.- Interpretación – Conclusiones:', margin, y);
  y += 6;

  
 
};

export default function Audiometria2021_Digitalizado_boro(datos = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  body_Audiometria2021_Digitalizado(doc);
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}
