import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default async function inmunologialab(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  // Offset para bajar el contenido después del header
  let y = 60;

  // Título INMUNOLOGÍA
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text("INMUNOLOGÍA", 105, y, { align: "center" });
  y += 15;

  // Sección MUESTRA y MÉTODO
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text("MUESTRA : SUERO", 20, y);
  doc.text("MÉTODO: AGLUTINACIÓN EN LÁMINA PORTAOBJETO", 20, y + 8);

  // Tabla de pruebas y resultados
  autoTable(doc, {
    startY: y + 18,
    tableWidth: 160,
    margin: { left: (doc.internal.pageSize.getWidth() - 160) / 2 },
    head: [[
      { content: "PRUEBA CUALITATIVO", styles: { halign: "center", fontStyle: "bold" } },
      { content: "RESULTADOS", styles: { halign: "center", fontStyle: "bold" } }
    ]],
    body: [
      [
        { content: "TIFICO O", styles: { fontStyle: "bold" } },
        `${datos.txttifico_o || ''}`
      ],
      [
        { content: "TIFICO H", styles: { fontStyle: "bold" } },
        `${datos.txttifico_h || ''}`
      ],
      [
        { content: "PARATIFICO A", styles: { fontStyle: "bold" } },
        `${datos.txtparatifico_a || ''}`
      ],
      [
        { content: "PARATIFICO B", styles: { fontStyle: "bold" } },
        `${datos.txtparatifico_b || ''}`
      ],
      [
        { content: "Brucella abortus", styles: { fontStyle: "italic" } },
        `${datos.txtbrucella || ''}`
      ]
    ],
    theme: 'grid',
    styles: { fontSize: 11, cellPadding: 4, valign: 'middle', halign: 'center', lineColor: [180, 180, 180], lineWidth: 0.5 },
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontSize: 12, fontStyle: 'bold' },
    bodyStyles: { textColor: [60, 60, 60] },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 60 }
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