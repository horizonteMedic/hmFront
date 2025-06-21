import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "../components/header";
import footer from "../components/footer";

export default function LHepatitisB_Digitalizado(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  let y = 58;

  // Título principal
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.text('INMUNOLOGÍA', 105, y, { align: 'center' });
  doc.setFontSize(11);

  // Muestra y método
  y += 8;
  autoTable(doc, {
    startY: y,
    body: [
      [{ content: 'MUESTRA : SUERO', styles: { fontStyle: 'bold' } }],
      [{ content: 'MÉTODO : INMUNOENSA... CROMATOGRÁFICO', styles: { fontStyle: 'bold' } }]
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
      { content: 'PRUEBA CUALITATIVO', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: 'RESULTADO', styles: { halign: 'center', fontStyle: 'bold' } }
    ]],
    body: [
      [
        `HEPATITIS B (HBsAg) - ${datos.txtmarca || ''}`,
        datos.txthepatitisb || ''
      ]
    ],
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 2 },
    margin: { left: 15, right: 15 },
    tableWidth: 180
  });

  // Recuadros de imagen
  const imgY = doc.lastAutoTable.finalY + 10;
  doc.setDrawColor(200);
  doc.rect(50, imgY, 40, 40);
  doc.rect(110, imgY, 40, 40);

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