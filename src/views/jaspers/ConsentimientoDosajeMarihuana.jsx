import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default function ConsentimientoDosajeMarihuana(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  let y = 58;

  // Título subrayado y negrita
  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.text('CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DOSAJE DE MARIHUANA', 105, y, { align: 'center' });
  doc.setLineWidth(0.5);
  doc.line(15, y + 2, 195, y + 2);
  doc.setFontSize(11);

  // Cuerpo del consentimiento
  y += 10;
  let texto = `Yo......................................................................................., de ....... años de\nedad, identificado con DNI nº ...${datos.dni}.; habiendo recibido consejería e información\nacerca de la prueba para Marihuana en orina; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post - Test y mis resultados.`;

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
  doc.text('Fecha:', 140, y + 30);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.fecha_apertura_po || ''}`, 155, y + 30);

  // Antecedentes
  let antY = y + 38;
  doc.setFont(undefined, 'bold');
  doc.text('ANTECEDENTES:', 15, antY);
  antY += 6;
  doc.setFont(undefined, 'normal');
  doc.text('CONSUME MARIHUANA', 15, antY);
  doc.text(': NO (', 70, antY);
  doc.text(`${!datos.antConsumeMarih ? "X" : "  " }`, 85, antY);
  doc.text(')   SI (', 95, antY);
  doc.text(`${datos.antConsumeMarih ? "X" : "  "}`, 110, antY);
  doc.text(')', 120, antY);

  // Recuadros de firmas y huella
  const baseY = antY + 18;
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