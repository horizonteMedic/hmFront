import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default function LtestAltura_digitalizado(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  let y = 58;

  // Título principal
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.text('TEST ALTURA', 105, y, { align: 'center' });
  doc.setFontSize(11);

  y += 6;
  autoTable(doc, {
    startY: y,
    head: [[
      { content: 'PRUEBA', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: 'RESULTADO', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: 'VALORES NORMALES', styles: { halign: 'center', fontStyle: 'bold' } }
    ]],
    body: [
      ['GRUPO SANGUINEO', datos.txtgrupo_sang || '', ''],
      ['FACTOR (RH)', datos.txtfactor || '', ''],
      ['HEMATOCRITO', datos.txthematocrito || '', 'Mujeres 38 - 50 %\nHombres 40 - 55 %'],
      ['HEMOGLOBINA', datos.txthemoglobina || '', 'Mujeres 12 - 16 g/dL\nHombres 13 - 18 g/dL'],
      ['GLUCOSA', datos.txtglucosa || '', '70 - 110 mg/dl']
    ],
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 65 },
      1: { cellWidth: 35 },
      2: { cellWidth: 60 }
    },
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