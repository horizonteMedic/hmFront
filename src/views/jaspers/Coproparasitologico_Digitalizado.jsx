import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default function Coproparasitologico_Digitalizado(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  let y = 58;

  // Título principal
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.text('COPROPARASITOLÓGICO', 105, y, { align: 'center' });
  doc.setFontSize(11);

  // Muestra
  y += 8;
  autoTable(doc, {
    startY: y,
    body: [
      [
        { content: 'MUESTRA: HECES I', styles: { fontStyle: 'bold', fontSize: 11 } }
      ]
    ],
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 1 },
    margin: { left: 15, right: 15 },
    tableWidth: 180,
    didDrawPage: () => {}
  });

  // Examen macroscópico
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 2,
    body: [
      [
        { content: 'EXAMEN MACROSCÓPICO I', styles: { fontStyle: 'bold', fontSize: 11 } }
      ]
    ],
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 1 },
    margin: { left: 15, right: 15 },
    tableWidth: 180,
    didDrawPage: () => {}
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY,
    body: [
      ['COLOR', `: ${datos.txtcolor || ''}`],
      ['ASPECTO', `: ${datos.txtaspecto || ''}`],
      ['MOCO FECAL', `: ${datos.txtmoco_fecal || ''}`],
      ['GRASA', `: ${datos.txtgrasa || ''}`],
      ['SANGRE VISIBLE', `: ${datos.txtsangrev || ''}`],
      ['RESTOS ALIMENTICIOS', `: ${datos.txtrestosa || ''}`],
    ],
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 1 },
    columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 110 } },
    margin: { left: 15, right: 15 },
    tableWidth: 180,
    didDrawPage: () => {}
  });

  // Examen microscópico
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 2,
    body: [
      [
        { content: 'EXAMEN MICROSCÓPICO I', styles: { fontStyle: 'bold', fontSize: 11 } }
      ]
    ],
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 1 },
    margin: { left: 15, right: 15 },
    tableWidth: 180,
    didDrawPage: () => {}
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY,
    body: [
      ['LEUCOCITOS', `: ${datos.txtleucocitos || ''}`],
      ['HEMATÍES', `: ${datos.txthematies || ''}`],
      ['INVESTIGACIÓN DE PARÁSITOS', `: ${datos.txtlugol || ''}`],
    ],
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 1 },
    columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 110 } },
    margin: { left: 15, right: 15 },
    tableWidth: 180,
    didDrawPage: () => {}
  });

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