import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default function ConsentimientoMuestraSangre(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  let y = 58;

  // Título subrayado y negrita
  doc.setFont(undefined, 'bold');
  doc.setFontSize(13);
  doc.text('CONSENTIMIENTO INFORMADO PARA LA TOMA DE MUESTRA DE SANGRE', 105, y, { align: 'center' });
  doc.setLineWidth(0.5);
  doc.line(15, y + 2, 195, y + 2);
  doc.setFontSize(11);

  // Cuerpo del consentimiento
  y += 10;
  let texto = `Yo......................................................................................., de ....... años de\nedad, identificado con DNI nº ......................... ............................; habiendo recibido consejería e información\nacerca de los exámenes en sangre que se me va ha realizar según solicitud del protocolo médico de la empresa .....................................................\ny en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra de sangre para cumplir con los exámenes pertinentes.`;

  // Reemplazo de campos dinámicos
  texto = texto
    .replace('.......................................................................................', datos.nombres || '_________________________')
    .replace('.......', datos.edad || '___')
    .replace('.......................... ............................', datos.cod_pa || '__________')
    .replace('......................................................', datos.razon_empresa || '_________________________');

  // Caja del consentimiento
  doc.setFont(undefined, 'normal');
  doc.setDrawColor(180);
  doc.rect(15, y, 180, 22);
  doc.text(texto, 18, y + 6, { maxWidth: 176 });

  // Recuadros de firmas y huella
  const baseY = y + 40;
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