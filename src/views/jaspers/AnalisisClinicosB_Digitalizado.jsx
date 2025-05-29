import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default function AnalisisClinicosB_Digitalizado(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  // Offset para bajar el contenido después del header
  let y = 60;

  // Título BIOQUIMICA
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text("BIOQUIMICA", 105, y, { align: "center" });
  y += 15;

  // Sección MUESTRA
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text("MUESTRA", 20, y);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.txtmuestra || ''}`, 50, y);
  y += 12;

  // Tabla de resultados
  autoTable(doc, {
    startY: y,
    head: [[
      { content: "PRUEBA", styles: { halign: "center", fontStyle: "bold" } },
      { content: "RESULTADO", styles: { halign: "center", fontStyle: "bold" } },
      { content: "VALORES NORMALES", styles: { halign: "center", fontStyle: "bold" } }
    ]],
    body: [
      [
        `${datos.txtprueba || ''}`,
        `${datos.txtresultado || ''}`,
        `${datos.txtvaloresn || ''}`
      ]
    ],
    theme: 'grid',
    styles: { fontSize: 11, cellPadding: 4, valign: 'middle', halign: 'center', lineColor: [180,180,180], lineWidth: 0.5 },
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontSize: 12, fontStyle: 'bold' },
    bodyStyles: { textColor: [60, 60, 60] },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 50 },
      2: { cellWidth: 60 }
    }
  });

  // Pie de página con sede y fecha
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.sede || ''} - ${datos.fecha || ''}`, 105, 270, { align: "center" });

  // Footer (si se requiere)
  // footer(doc, datos);

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