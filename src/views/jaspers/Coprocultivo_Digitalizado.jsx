import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default function Coprocultivo_Digitalizado(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  let y = 68;

  // Título principal centrado y muestra a la izquierda
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  // MUESTRA: HECES a la izquierda
  doc.text('MUESTRA:', 15, y, { align: 'left' });
  // Fondo verde para HECES
  const hecesText = (datos.txtmuestra || '').toUpperCase() === 'HECES' || !datos.txtmuestra ? 'HECES' : (datos.txtmuestra || '');
  doc.setFillColor(157, 250, 100); // #9dfa64
  doc.roundedRect(38, y - 5, doc.getTextWidth(hecesText) + 6, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0,0,0);
  doc.text(hecesText, 41, y, { align: 'left' });
  // Título centrado
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text("COPROCULTIVO", 105, y, { align: "center" });
  y += 10;

  // Sección: Coprocultivo - Muestra
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text("COPROCULTIVO – MUESTRA", 15, y, { align: "left" });
  y += 5;
  autoTable(doc, {
    startY: y,
    body: [
      ["Muestra", datos.txtmuestra || ''],
      ["Color", datos.txtcolor || ''],
      ["Consistencia", datos.txtconsistencia || ''],
      ["Moco Fecal", datos.txtmoco_fecal || ''],
      ["Sangre Visible", datos.txtsangrev || ''],
      ["Restos Alimenticios", datos.txtrestosa || '']
    ],
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2, textColor: [0,0,0], halign: 'left', valign: 'middle' },
    headStyles: { fillColor: [255,255,255], textColor: [0,0,0], fontStyle: 'bold', halign: 'left', fontSize: 11 },
    bodyStyles: { textColor: [0,0,0] },
    margin: { left: 30, right: 30 },
    tableWidth: 150,
  });
  y = doc.lastAutoTable.finalY + 8;

  // Sección: Coprocultivo - Examen Microscópico
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text("COPROCULTIVO – EXAMEN MICROSCÓPICO", 15, y, { align: "left" });
  y += 5;
  autoTable(doc, {
    startY: y,
    body: [
      ["Leucocitos", datos.txtleucocitos || ''],
      ["Hematíes", datos.txthematies || ''],
      ["Parásitos", datos.txtparasitos || ''],
      ["Gotas de grasa", datos.txtgotasg || ''],
      ["Levaduras", datos.txtlevaduras || '']
    ],
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2, textColor: [0,0,0], halign: 'left', valign: 'middle' },
    headStyles: { fillColor: [255,255,255], textColor: [0,0,0], fontStyle: 'bold', halign: 'left', fontSize: 11 },
    bodyStyles: { textColor: [0,0,0] },
    margin: { left: 30, right: 30 },
    tableWidth: 150,
  });
  y = doc.lastAutoTable.finalY + 8;

  // Sección: Coprocultivo - Identificación y antibiograma
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text("COPROCULTIVO – IDENTIFICACIÓN Y ANTIBIOGRAMA", 15, y, { align: "left" });
  y += 5;
  autoTable(doc, {
    startY: y,
    body: [
      ["Identificación", datos.txtidentificacion || ''],
      ["Flora Coliforme", datos.txtflorac || '']
    ],
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2, textColor: [0,0,0], halign: 'left', valign: 'middle' },
    headStyles: { fillColor: [255,255,255], textColor: [0,0,0], fontStyle: 'bold', halign: 'left', fontSize: 11 },
    bodyStyles: { textColor: [0,0,0] },
    margin: { left: 30, right: 30 },
    tableWidth: 150,
  });
  y = doc.lastAutoTable.finalY + 8;

  // Sección: Coprocultivo - Resultado
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text("COPROCULTIVO – RESULTADO", 15, y, { align: "left" });
  y += 5;
  autoTable(doc, {
    startY: y,
    body: [
      ["Resultado", datos.txtresultado || '']
    ],
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2, textColor: [0,0,0], halign: 'left', valign: 'middle' },
    headStyles: { fillColor: [255,255,255], textColor: [0,0,0], fontStyle: 'bold', halign: 'left', fontSize: 11 },
    bodyStyles: { textColor: [0,0,0] },
    margin: { left: 30, right: 30 },
    tableWidth: 150,
  });
  y = doc.lastAutoTable.finalY + 2;

  // Observaciones: texto y líneas
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('OBSERVACIONES:', 15, y + 8);
  doc.setDrawColor(180);
  doc.setLineWidth(0.3);
  let obsLineY = y + 12;
  for (let i = 0; i < 2; i++) {
    doc.line(15, obsLineY, 195, obsLineY);
    obsLineY += 7;
  }
  if (datos.txtobservaciones) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(datos.txtobservaciones, 18, y + 16, { maxWidth: 175 });
  }

  // Footer
  footer(doc, datos);

  // Mostrar PDF
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = function () {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
} 