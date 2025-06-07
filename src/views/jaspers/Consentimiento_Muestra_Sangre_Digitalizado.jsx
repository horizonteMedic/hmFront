import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerConsentimiento from "./components/headerConsentimiento";
import footer from "./components/footer";

export default function Consentimiento_Muestra_Sangre_Digitalizado(datos) {
  const doc = new jsPDF();
  headerConsentimiento(doc, datos);

  let y = 44;

  // Título subrayado y negrita con salto de línea
  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.text('CONSENTIMIENTO INFORMADO PARA LA TOMA DE', 105, y, { align: 'center' });
  y += 6;
  doc.text('MUESTRA DE SANGRE', 105, y, { align: 'center' });
  doc.setFontSize(11);

  // Cuerpo del consentimiento
  y += 10;
  doc.setFont(undefined, 'normal');
  const bloque =
    `Yo ${datos.nombres || '_________________________'} , de ${datos.edad || '___'} años de edad, identificado con DNI nº ${datos.dni || '__________'}; habiendo recibido consejería e información acerca de los exámenes en sangre que se me va ha realizar según solicitud del protocolo médico de la empresa ${datos.razon_empresa || '_________________________'}; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra de sangre para cumplir con los exámenes pertinentes.`;
  const lines = doc.splitTextToSize(bloque, 176);
  doc.text(lines, 18, y + 6, { maxWidth: 176, lineHeightFactor: 1.5 });
  y += lines.length * 7 + 10;

  // Fecha apertura
  doc.setFont(undefined, 'bold');
  doc.text('Fecha:', 140, y);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.fecha_apertura_po || ''}`, 155, y);

  // Espacio extra antes de las firmas y huella
  const baseY = y + 30;

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