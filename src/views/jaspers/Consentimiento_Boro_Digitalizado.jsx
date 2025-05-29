import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerConsentimiento from "./components/headerConsentimiento";
import footer from "./components/footer";

export default function Consentimiento_Boro_Digitalizado(datos) {
  const doc = new jsPDF();
  headerConsentimiento(doc);

  let y = 44;
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  // Título principal
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text("AUTORIZACION DE EXAMEN DE DROGAS", pageW / 2, y, { align: "center" });
  y += 8;

  // Tabla de datos personales (Fecha, Hora, Ciudad)
  autoTable(doc, {
    startY: y,
    body: [
      [
        { content: "Fecha:", styles: { fontStyle: 'bold', halign: 'right' } },
        datos.fecha || '',
        { content: "Hora:", styles: { fontStyle: 'bold', halign: 'right' } },
        datos.hora || '',
        { content: "Ciudad:", styles: { fontStyle: 'bold', halign: 'right' } },
        datos.ciudad || ''
      ]
    ],
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 32 },
      2: { cellWidth: 15 },
      3: { cellWidth: 25 },
      4: { cellWidth: 18 },
      5: { cellWidth: 40 }
    },
    margin: { left: margin, right: margin }
  });
  y = doc.lastAutoTable.finalY + 2;

  // Tabla de datos personales (Nombre, Edad, DNI, Empresa)
  autoTable(doc, {
    startY: y,
    body: [
      [
        { content: "Nombre:", styles: { fontStyle: 'bold', halign: 'right' } },
        datos.nombre || '',
        { content: "Edad:", styles: { fontStyle: 'bold', halign: 'right' } },
        datos.edad || '',
        { content: "DNI:", styles: { fontStyle: 'bold', halign: 'right' } },
        datos.dni || ''
      ],
      [
        { content: "Empresa:", styles: { fontStyle: 'bold', halign: 'right' } },
        { content: datos.empresa || '', colSpan: 5 }
      ]
    ],
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 60 },
      2: { cellWidth: 15 },
      3: { cellWidth: 18 },
      4: { cellWidth: 15 },
      5: { cellWidth: 32 }
    },
    margin: { left: margin, right: margin }
  });
  y = doc.lastAutoTable.finalY + 2;

  // Texto de autorización
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const texto =
    "Autorizo al POLICLINICO HORIZONTE MEDIC, para que se me realice el examen toxicológico de drogas en orina y/o saliva, según los protocolos establecidos y que los resultados se entreguen directamente a la empresa.";
  const lines = doc.splitTextToSize(texto, pageW - 2 * margin);
  doc.text(lines, margin, y);
  y += lines.length * 4 + 2;

  // Declaración
  doc.setFont('helvetica', 'bold');
  doc.text("Además, declaro que la información que brindaré a continuación es verdadera:", margin, y);
  y += 6;

  // Preguntas tipo formulario
  autoTable(doc, {
    startY: y,
    body: [
      [
        { content: "¿Sufre alguna enfermedad?", styles: { fontStyle: 'bold' } },
        `SI (${datos.enfermedad_si === 'SI' ? 'X' : ' '})`,
        `NO (${datos.enfermedad_si === 'NO' ? 'X' : ' '})`,
        { content: datos.enfermedad_cual ? `¿Cuál?: ${datos.enfermedad_cual}` : '', colSpan: 2 }
      ],
      [
        { content: "¿Consume regularmente algún medicamento?", styles: { fontStyle: 'bold' } },
        `SI (${datos.medicamento_si === 'SI' ? 'X' : ' '})`,
        `NO (${datos.medicamento_si === 'NO' ? 'X' : ' '})`,
        { content: datos.medicamento_cual ? `¿Cuál?: ${datos.medicamento_cual}` : '', colSpan: 2 }
      ],
      [
        { content: "¿Chaccha o mastica hoja de coca?", styles: { fontStyle: 'bold' } },
        `SI (${datos.coca_si === 'SI' ? 'X' : ' '})`,
        `NO (${datos.coca_si === 'NO' ? 'X' : ' '})`,
        { content: datos.coca_fecha ? `Fecha: ${datos.coca_fecha}` : '', colSpan: 2 }
      ],
      [
        { content: "¿En las últimas 48 horas, se realizó algún tratamiento quirúrgico o dental?", styles: { fontStyle: 'bold' } },
        `SI (${datos.tratamiento_si === 'SI' ? 'X' : ' '})`,
        `NO (${datos.tratamiento_si === 'NO' ? 'X' : ' '})`,
        { content: datos.tratamiento_cual ? `¿Cuál?: ${datos.tratamiento_cual}` : '', colSpan: 2 }
      ],
      [
        { content: '', colSpan: 1 }, '', '',
        { content: datos.tratamiento_cuando ? `¿Cuándo?: ${datos.tratamiento_cuando}` : '', colSpan: 2 }
      ],
      [
        { content: '', colSpan: 1 }, '', '',
        { content: datos.tratamiento_donde ? `¿Dónde?: ${datos.tratamiento_donde}` : '', colSpan: 2 }
      ]
    ],
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 18 },
      2: { cellWidth: 18 },
      3: { cellWidth: 40 },
      4: { cellWidth: 40 }
    },
    margin: { left: margin, right: margin }
  });
  y = doc.lastAutoTable.finalY + 6;

  // Notas
  doc.setFont('helvetica', 'bold');
  doc.text('Notas:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.notas || '', margin + 20, y);
  y += 10;

  // Bloque de firmas y huella
  const firmasY = y;
  const blockWidth = 170;
  const blockX = (pageW - blockWidth) / 2;
  // Firma del paciente
  doc.line(blockX, firmasY + 20, blockX + 50, firmasY + 20);
  doc.text('Firma del Paciente', blockX + 25, firmasY + 25, { align: 'center' });
  // Cuadro de huella
  doc.setDrawColor(0);
  doc.rect(blockX + 60, firmasY, 40, 40);
  doc.text('Huella', blockX + 80, firmasY + 45, { align: 'center' });
  // Firma responsable/testigo (solo línea arriba, no cuadro)
  const testigoX = blockX + 110;
  const testigoY = firmasY;
  const testigoWidth = 60;
  // Línea para firma
  doc.line(testigoX, testigoY + 8, testigoX + testigoWidth, testigoY + 8);
  // Texto debajo de la línea
  doc.setFont('helvetica', 'bold');
  doc.text('Firma del testigo o responsable de la toma de muestra', testigoX + testigoWidth / 2, testigoY + 14, { align: 'center', maxWidth: testigoWidth - 4 });
  doc.setFont('helvetica', 'normal');
  doc.text('Nombre Completo:', testigoX + 2, testigoY + 21);
  doc.text('DNI:', testigoX + 2, testigoY + 28);

  y = firmasY + 50;
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