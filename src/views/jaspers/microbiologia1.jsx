import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default function microbiologia1(datos) {
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

  // Título MICROBIOLOGÍA
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text("MICROBIOLOGÍA", 105, 65 + offsetY, { align: "center" });

  // Sección EXAMEN DIRECTO
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text("EXAMEN DIRECTO", 20, 78 + offsetY);

  // Muestra
  doc.setFont(undefined, 'bold');
  doc.text("MUESTRA:  RASPADO DE LECHO UNGUEAL", 20, 86 + offsetY);

  // Tabla de prueba cualitativo/resultado
  autoTable(doc, {
    startY: 94 + offsetY,
    tableWidth: 140, // ancho fijo para centrar
    margin: { left: (doc.internal.pageSize.getWidth() - 140) / 2 },
    head: [[
      { content: "PRUEBA CUALITATIVO", styles: { halign: "center", fontStyle: "bold" } },
      { content: "RESULTADO", styles: { halign: "center", fontStyle: "bold" } }
    ]],
    body: [
      [
        { content: "EXAMEN DIRECTO", styles: { fontStyle: "bold" } },
        ""
      ]
    ],
    theme: 'grid',
    styles: { fontSize: 11, cellPadding: 4, valign: 'middle', halign: 'center', lineColor: [180,180,180], lineWidth: 0.5 },
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontSize: 12, fontStyle: 'bold' },
    bodyStyles: { textColor: [60, 60, 60] },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 70 }
    }
  });

  // Campo KOH
  doc.setFont(undefined, 'bold');
  doc.text("KOH:", 25, doc.lastAutoTable.finalY + 12);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.txtkoh || ''}`, 50, doc.lastAutoTable.finalY + 12);

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