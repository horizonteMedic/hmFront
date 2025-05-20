import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default function inmunologialab(datos) {
  const doc = new jsPDF();
  header(doc);

  // Offset para bajar el contenido
  const offsetY = 20;

  // Nro Orden
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text("Nro Orden :", 160, 25 + offsetY);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.n_orden || ''}`, 200, 25 + offsetY, { align: "right" });

  // Datos principales
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text("Apellidos y Nombres :", 15, 35 + offsetY);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.nombre || ''}`, 65, 35 + offsetY);

  doc.setFont(undefined, 'bold');
  doc.text("Edad :", 15, 43 + offsetY);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.fec_nac || ''} AÑOS`, 40, 43 + offsetY);

  doc.setFont(undefined, 'bold');
  doc.text("Fecha :", 15, 51 + offsetY);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.fecha || ''}`, 40, 51 + offsetY);

  // Título INMUNOLOGÍA
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text("INMUNOLOGÍA", 105, 65 + offsetY, { align: "center" });

  // Sección MUESTRA y MÉTODO
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text("MUESTRA : SUERO", 20, 80 + offsetY);
  doc.text("MÉTODO: AGLUTINACIÓN EN LÁMINA PORTAOBJETO", 20, 88 + offsetY);

  // Tabla de pruebas y resultados
  autoTable(doc, {
    startY: 98 + offsetY,
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
    styles: { fontSize: 11, cellPadding: 4, valign: 'middle', halign: 'center', lineColor: [180,180,180], lineWidth: 0.5 },
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