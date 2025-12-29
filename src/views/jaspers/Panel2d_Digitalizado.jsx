import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default async function Panel2d_Digitalizado(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  let y = 58; // Más arriba para dejar espacio al header

  // Título principal
  doc.setFont(undefined, 'bold');
  doc.setFontSize(16);
  doc.text('TOXICOLÓGICO', 150, y, { align: 'center' });
  doc.setFontSize(11);

  // Muestra
  y += 10;
  doc.setFont(undefined, 'bold');
  doc.text('MUESTRA : ORINA', 15, y);

  // Método
  y += 7;
  doc.setFont(undefined, 'normal');
  if (datos.txtmetodo) doc.text(`${datos.txtmetodo}`, 15, y);

  // Tabla de resultados (encabezado y cuerpo juntos)
  y += 12;
  autoTable(doc, {
    startY: y,
    head: [[
      { content: 'PRUEBA CUALITATIVO', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: 'RESULTADOS', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: 'UNIDADES', styles: { halign: 'center', fontStyle: 'bold' } }
    ]],
    body: [
      [
        { content: 'PANEL DROGAS 3D', colSpan: 3, styles: { fontStyle: 'bold', halign: 'left' } }
      ],
      [
        { content: 'Cocaína (COC)', styles: { textColor: [0, 0, 0] } },
        `${datos.re_cocaina || 'S/U'}`,
        'S/U'
      ],
      [
        { content: 'Marihuana(THC)', styles: { textColor: [0, 0, 255] } },
        `${datos.re_marihuana || 'S/U'}`,
        'S/U'
      ]
    ],
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 2 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0, lineColor: 255 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 }
    },
    margin: { left: 15, right: 15 },
    didDrawPage: (data) => {
      // Nada aquí, imágenes van después
    }
  });

  // Cuadros para imágenes, justo debajo de la tabla
  const imgY = doc.lastAutoTable.finalY + 10;
  const imgW = 65, imgH = 45;
  const marginX = 15;
  // Imagen 1
  doc.setDrawColor(200);
  doc.rect(marginX + 10, imgY, imgW, imgH);
  doc.setFontSize(10);
  doc.setTextColor(180);
  doc.text('Detail 1', marginX + 10 + imgW / 2, imgY + imgH / 2, { align: 'center' });
  // Imagen 2
  doc.rect(marginX + 90, imgY, imgW, imgH);
  doc.text('Detail 2', marginX + 90 + imgW / 2, imgY + imgH / 2, { align: 'center' });

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