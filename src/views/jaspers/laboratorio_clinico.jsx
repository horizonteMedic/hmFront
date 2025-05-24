import jsPDF from "jspdf";
import HeaderLab from './components/HeaderLab';

export default function laboratorio_clinico(datos) {
  const doc = new jsPDF();
  let y = HeaderLab(doc, datos) + 8;
  const margin = 15;
  const pageW = doc.internal.pageSize.getWidth();
  const tableW = pageW - margin * 2;
  const lineHeight = 6;

  // === HEMATOLOGÍA ===
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('HEMATOLOGÍA', pageW / 2, y, { align: 'center' });
  y += 4;

  // Cuadro principal
  const boxH = 56;
  doc.setDrawColor(0);
  doc.setLineWidth(0.7);
  doc.rect(margin, y, tableW, boxH, 'S');

  // Línea vertical divisoria
  const midX = margin + tableW * 0.5;
  doc.line(midX, y, midX, y + boxH);

  // Línea horizontal divisoria superior
  doc.line(margin, y + 8, margin + tableW, y + 8);

  // Subtítulos
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Grupo Sanguíneo :', margin + 3, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.chko || ''}`, margin + 38, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.text('Factor Rh :', margin + 3, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.factor_rh || ''}`, margin + 38, y + 20);

  doc.setFont('helvetica', 'bold');
  doc.text('Hematocrito :', margin + 3, y + 26);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.hematocrito || ''}`, margin + 38, y + 26);

  doc.setFont('helvetica', 'bold');
  doc.text('Hemoglobina :', margin + 3, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.hemoglobina || ''}`, margin + 38, y + 32);

  doc.setFont('helvetica', 'bold');
  doc.text('Hematies :', margin + 3, y + 38);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.hematies || ''}`, margin + 38, y + 38);

  doc.setFont('helvetica', 'bold');
  doc.text('V.S.G :', margin + 3, y + 44);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.txtvsg || ''}`, margin + 38, y + 44);

  doc.setFont('helvetica', 'bold');
  doc.text('Plaquetas :', margin + 3, y + 50);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.plaquetas || ''}`, margin + 38, y + 50);

  // Lado derecho
  doc.setFont('helvetica', 'bold');
  doc.text('Leucocitos', midX + 3, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.leucocitos || ''}`, midX + 38, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.text('Neutrofilos', midX + 3, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.txtneutrofilos || ''}`, midX + 38, y + 20);

  doc.setFont('helvetica', 'bold');
  doc.text('Abastonados :', midX + 3, y + 26);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.txtabastonados || ''}`, midX + 38, y + 26);

  doc.setFont('helvetica', 'bold');
  doc.text('Segmentados', midX + 3, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.segmentados || ''}`, midX + 38, y + 32);

  doc.setFont('helvetica', 'bold');
  doc.text('Eosinofilos', midX + 3, y + 38);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.eosinofilos || ''}`, midX + 38, y + 38);

  doc.setFont('helvetica', 'bold');
  doc.text('Basofilos', midX + 3, y + 44);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.basofilos || ''}`, midX + 38, y + 44);

  doc.setFont('helvetica', 'bold');
  doc.text('Linfocitos', midX + 3, y + 50);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.linfocitos || ''}`, midX + 38, y + 50);

  doc.setFont('helvetica', 'bold');
  doc.text('Monocitos', midX + 3, y + 56);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.monocitos || ''}`, midX + 38, y + 56);

  y += boxH + 12;

  // === BIOQUÍMICA ===
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('BIOQUÍMICA', pageW / 2, y, { align: 'center' });
  y += 6;

  // Glucosa
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Glucosa', margin + 3, y);
  doc.setFont('helvetica', 'bold');
  doc.text(`${datos.glucosa || ''}`, margin + 32, y);
  doc.setFont('helvetica', 'normal');
  doc.text('Valores Normales 70 - 110 mg/dl', margin + 70, y);
  y += lineHeight;

  // Creatinina
  doc.setFont('helvetica', 'normal');
  doc.text('Creatinina', margin + 3, y);
  doc.setFont('helvetica', 'bold');
  doc.text(`${datos.creatinina || ''}`, margin + 32, y);
  doc.setFont('helvetica', 'normal');
  doc.text('Valores Normales 0.8 - 1.4 mg/dl', margin + 70, y);

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);

  iframe.onload = function () {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }
} 