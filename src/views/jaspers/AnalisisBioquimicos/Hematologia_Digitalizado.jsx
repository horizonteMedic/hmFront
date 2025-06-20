import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "../components/header";
import footer from "../components/footer";

export default function Hematologia_Digitalizado(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  let y = 58;

  // Título principal
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.text('HEMOGRAMA AUTOMATIZADO', 105, y, { align: 'center' });
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
      [
        { content: 'HEMOGLOBINA', styles: { fontStyle: 'bold' } },
        datos.txthemoglobina || '',
        'Mujeres 12 - 16 g/dL\nHombres 14 - 18 g/dL'
      ],
      [
        { content: 'HEMATOCRITO', styles: { fontStyle: 'bold' } },
        datos.txthematocrito || '',
        'Mujeres 38 - 50 %\nHombres 40 - 54 %'
      ],
      [
        { content: 'HEMATÍES', styles: { fontStyle: 'bold' } },
        datos.txthematies || '',
        '4.0 - 5.5 x 10^6/mm³'
      ],
      ['Volumen Corpuscular Medio', datos.txtvolumen || '', '80 - 100 fL'],
      ['Hemoglobina Corpuscular Media', datos.txthemocorpuscular || '', '26 - 34 pg'],
      ['Concentración de la Hemoglobina Corpuscular Media', datos.txtconcentracion || '', '31 - 37  g/dl'],
      [
        { content: 'LEUCOCITOS', styles: { fontStyle: 'bold' } },
        datos.txtleucocitos || '',
        '4 - 10 x 10^3/mm³'
      ],
      [
        { content: 'RECUENTO DIFERENCIAL', styles: { fontStyle: 'bold' } },
        '',
        ''
      ],
      [
        { content: 'NEUTRÓFILOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtneutrofilos || '',
        '55-65 %'
      ],
      [
        { content: 'ABASTONADOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtabastonados || '',
        '0 - 5 %'
      ],
      [
        { content: 'SEGMENTADOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtsegmentados || '',
        '55 - 65 %'
      ],
      [
        { content: 'MONOCITOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtmonocitos || '',
        '4 - 8 %'
      ],
      [
        { content: 'EOSINÓFILOS (%)', styles: { fontStyle: 'bold' } },
        datos.txteosinofilos || '',
        '0 - 4 %'
      ],
      [
        { content: 'BASÓFILOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtbasofilos || '',
        '0 - 1 %'
      ],
      [
        { content: 'LINFOCITOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtlinfocitos || '',
        '20 - 40 %'
      ],
      [
        { content: 'PLAQUETAS', styles: { fontStyle: 'bold' } },
        datos.txtplaquetas || '',
        '1.5 - 4.5 x 10^5/mm³'
      ],
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