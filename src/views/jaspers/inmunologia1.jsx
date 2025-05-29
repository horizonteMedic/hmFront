import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default function inmunologia1(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  // Offset para bajar el contenido después del header
  let y = 60;

  // Prueba rápida y marca
  doc.setFont(undefined, 'bold');
  doc.text(`Prueba rápida ${datos.cbomarca || ''}`, 15, y + 18);
  doc.text("MARCA:", 15, y + 26);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.cbomarca || ''}`, 35, y + 26);

  // Tabla de resultados con autoTable
  autoTable(doc, {
    startY: y + 38,
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