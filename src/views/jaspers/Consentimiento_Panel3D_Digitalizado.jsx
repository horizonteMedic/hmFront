import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerConsentimiento from "./components/headerConsentimiento";
import footer from "./components/footer";

export default function Consentimiento_Panel3D_Digitalizado(datos) {
  const doc = new jsPDF();
  headerConsentimiento(doc, datos);

  // Margen superior reducido
  let y = 44;

  // Título subrayado y negrita
  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.text(
    'CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DOSAJE DE MARIHUANA, COCAINA Y EXTASIS.',
    105,
    y,
    { align: 'center', maxWidth: 180 }
  );
  doc.setFontSize(10);

  // Cuerpo del consentimiento
  y += 12;
  let texto =
    `Yo ${datos.nombres || '_________________________'} de ${datos.edad || '___'} años de edad, identificado con DNI nº ${datos.dni || '__________'}; habiendo recibido consejería e información acerca de la prueba para Marihuana y cocaína en orina; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post - Test y mis resultados.`;

  // Calcular líneas y altura dinámica para la caja
  const textoLineas = doc.splitTextToSize(texto, 176);
  const altoLinea = 5.5; // altura aproximada de línea en jsPDF
  const altoCaja = textoLineas.length * altoLinea + 6; // margen superior e inferior

  // Bloque de consentimiento sin cuadro, con interlineado
  doc.setFont(undefined, 'normal');
  doc.text(textoLineas, 18, y + 7, { maxWidth: 176, lineHeightFactor: 1.5 });

  // Fecha apertura
  doc.setFont(undefined, 'bold');
  doc.text(`${datos.fecha_apertura_po || ''}`, 170, y + altoCaja + 4);

  // Antecedentes (tabla)
  let antY = y + altoCaja + 12;
  doc.setFont(undefined, 'bold');
  doc.text('ANTECEDENTES:', 15, antY);
  antY += 6;
  autoTable(doc, {
    startY: antY,
    body: [
      ['CONSUME MARIHUANA (THC)', `NO (${!datos.antConsumeMarih ? "X" : ""})`, `SI (${datos.antConsumeMarih ? "X" : " " })`],
      ['CONSUMIO HOJA DE COCA EN LOS 7 DIAS PREVIOS', `NO (${!datos.antConsumeHojaCoca ? "X" : ""})`, `SI (${datos.antConsumeHojaCoca ? "X" : " " })`],
      ['CONSUME COCAINA', `NO (${!datos.antConsumeCocacina ? "X" : ""})`, `SI (${datos.antConsumeCocacina ? "X" : " " })`],
      ['CONSUME EXTASIS', `NO (${!datos.antConsumeAnfetaminaOExtasis ? "X" : ""})`, `SI (${datos.antConsumeAnfetaminaOExtasis ? "X" : " " })`],
    ],
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1 },
    columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 40 }, 2: { cellWidth: 40 } },
    margin: { left: 15 },
    didDrawPage: () => {}
  });

  // Recuadros de firmas y huella
  const baseY = doc.lastAutoTable.finalY + 12;
  // Huella
  doc.rect(25, baseY, 28, 32);
  doc.setFontSize(10);
  doc.text('Huella', 39, baseY + 38, { align: 'center' });
  // Firma paciente
  doc.line(70, baseY + 32, 120, baseY + 32);
  doc.text('Firma del Paciente', 95, baseY + 38, { align: 'center' });
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