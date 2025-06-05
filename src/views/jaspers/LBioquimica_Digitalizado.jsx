import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default function LBioquimica_Digitalizado(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  let y = 58;

  // Título principal
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.text('BIOQUÍMICA', 105, y, { align: 'center' });
  doc.setFontSize(11);

  // Muestra
  y += 8;
  autoTable(doc, {
    startY: y,
    body: [
      [{ content: 'MUESTRA : SUERO', styles: { fontStyle: 'bold' } }]
    ],
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 1 },
    margin: { left: 15, right: 15 },
    tableWidth: 180
  });

  // Tabla de resultado
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 2,
    head: [[
      { content: 'PRUEBA', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: 'RESULTADO', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: 'VALORES NORMALES', styles: { halign: 'center', fontStyle: 'bold' } }
    ]],
    body: [
      [
        { content: 'PERFIL RENAL', colSpan: 3, styles: { fontStyle: 'bold', halign: 'center', fillColor: [240,240,240] } }
      ],
      ['CREATININA SÉRICA', datos.txtcreatinina || '', 'Adulto: 0.8 - 1.4 mg/dl\nNiño: 0.24 - 0.84 mg/dl'],
      ['UREA SÉRICA', datos.txtureaserica || '', '10 - 50 mg/dl'],
      ['ÁCIDO ÚRICO SÉRICO', datos.txtacidourico || '', 'Mujeres: 2.5 - 6.8 mg/dl\nHombres 3.6 - 7.7 mg/dl']
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