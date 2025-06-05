import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default function Consentimiento_Panel3D_Fogotalizado(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  let y = 58;

  // Título subrayado y negrita
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.text('CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DOSAJE DE MARIHUANA, COCAINA Y EXTASIS.', 105, y, { align: 'center' });
  doc.setLineWidth(0.5);
  doc.line(15, y + 2, 195, y + 2);
  doc.setFontSize(10);

  // Cuerpo del consentimiento
  y += 10;
  let texto = `Yo......................................................................................., de ....... años de\nedad, identificado con DNI nº ......................... ............................; habiendo recibido consejería e información\nacerca de la prueba para Marihuana y cocaína en orina; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post - Test y mis resultados.`;

  texto = texto
    .replace('.......................................................................................', datos.nombres || '_________________________')
    .replace('.......', datos.edad || '___')
    .replace('.......................... ............................', datos.cod_pa || '__________');

  // Caja del consentimiento
  doc.setFont(undefined, 'normal');
  doc.setDrawColor(180);
  doc.rect(15, y, 180, 22);
  doc.text(texto, 18, y + 6, { maxWidth: 176 });

  // Fecha apertura
  doc.setFont(undefined, 'bold');
  doc.text(`${datos.fecha_apertura_po || ''}`, 170, y + 30);

  // Antecedentes (tabla)
  let antY = y + 38;
  doc.setFont(undefined, 'bold');
  doc.text('ANTECEDENTES:', 15, antY);
  antY += 6;
  autoTable(doc, {
    startY: antY,
    body: [
      ['CONSUME MARIHUANA', ': NO (' + (datos.ant_marihuana_no || '') + ') SI (' + (datos.ant_marihuana_si || '') + ')'],
      ['CONSUMIO HOJA DE COCA EN LOS 7 DIAS PREVIOS', ': NO (' + (datos.ant_coca_no || '') + ') SI (' + (datos.ant_coca_si || '') + ')'],
      ['CONSUME COCAINA', ': NO (' + (datos.ant_cocaina_no || '') + ') SI (' + (datos.ant_cocaina_si || '') + ')'],
      ['CONSUME EXTASIS', ': NO (' + (datos.ant_extasis_no || '') + ') SI (' + (datos.ant_extasis_si || '') + ')'],
    ],
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1 },
    columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 80 } },
    margin: { left: 15 },
    didDrawPage: () => {}
  });

  // Recuadros de firmas y huella
  const baseY = doc.lastAutoTable.finalY + 10;
  // Huella
  doc.rect(25, baseY, 28, 32);
  doc.setFontSize(10);
  doc.text('Huella', 39, baseY + 38, { align: 'center' });
  // Firma paciente
  doc.line(65, baseY + 32, 115, baseY + 32);
  doc.text('Firma del Paciente', 90, baseY + 38, { align: 'center' });
  // Firma consejero
  doc.line(135, baseY + 32, 185, baseY + 32);
  doc.text('Firma y sello del Consejero', 160, baseY + 38, { align: 'center' });

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