import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default function inmunologia1(datos) {
  const doc = new jsPDF();
  header(doc);

  // Offset para bajar el contenido
  const offsetY = 20;

  // Datos principales
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text("NOMBRE :", 15, 30 + offsetY);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.nombre || ''}`, 45, 30 + offsetY);

  doc.setFont(undefined, 'bold');
  doc.text("EDAD :", 15, 38 + offsetY);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.edad || ''} años`, 45, 38 + offsetY);

  doc.setFont(undefined, 'bold');
  doc.text("FECHA :", 15, 46 + offsetY);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.fecha || ''}`, 45, 46 + offsetY);

  // Prueba rápida y marca
  doc.setFont(undefined, 'bold');
  doc.text(`Prueba rápida ${datos.cbomarca || ''}`, 15, 58 + offsetY);
  doc.text("MARCA:", 15, 66 + offsetY);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.cbomarca || ''}`, 35, 66 + offsetY);

  // Tabla de resultados con autoTable
  autoTable(doc, {
    startY: 78 + offsetY,
    head: [[
      { content: "PRUEBA", styles: { halign: "center", fontStyle: "bold" } },
      { content: "RESULTADOS", styles: { halign: "center", fontStyle: "bold" } },
      { content: "VALORES DE REFERENCIA", styles: { halign: "center", fontStyle: "bold" } }
    ]],
    body: [
      [
        { content: "IgM anti-COVID-19", styles: { fontStyle: "bold" } },
        `${datos.chkinvalido || ''}`,
        `${datos.txtvrigm || ''}`
      ],
      [
        { content: "IgG anti-COVID-19", styles: { fontStyle: "bold" } },
        `${datos.chkinvalido || ''}`,
        `${datos.txtvrigg || ''}`
      ]
    ],
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 50 },
      2: { cellWidth: 80 }
    }
  });

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