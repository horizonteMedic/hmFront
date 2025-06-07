import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerConsentimiento from "./components/headerConsentimiento";
import footer from "./components/footer";

export default function Consentimiento_Panel10D_Digitalizado(datos) {
  const doc = new jsPDF();
  headerConsentimiento(doc, datos);

  let y = 58;

  // Título principal en dos líneas, sin línea horizontal
  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.text('CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DROGAS PANEL 10 D', 105, y, { align: 'center' });
  y += 6;
  doc.setFontSize(11);
  doc.text('(AMP-BAR-BZO-COC-MET-MTD-PCP-THC-OPI-TCA)', 105, y, { align: 'center' });
  doc.setFontSize(10);

  // Fecha en la parte superior derecha
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`${datos.fecha || ''}`, 195, y, { align: 'right' });

  // Bloque de datos personales y consentimiento con interlineado y justificado
  y += 10;
  doc.setFont(undefined, 'normal');
  const bloque =
    `Yo ${datos.nombres || '_________________________'} , de ${datos.edad || '___'} años de edad, identificado con DNI nº ${datos.dni || '__________'}; habiendo recibido consejería e información acerca de la prueba para el panel de 10D drogas en orina; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post - Test y mis resultados.`;
  const lines = doc.splitTextToSize(bloque, 176);
  const altoLinea = 7;
  const altoCaja = lines.length * altoLinea + 6;
  doc.text(lines, 18, y + 6, { maxWidth: 176, lineHeightFactor: 1.5, align: 'left' });
  y += altoCaja + 4;

  // Antecedentes (tabla) centrados
  let antY = y;
  doc.setFont(undefined, 'bold');
  doc.text('ANTECEDENTES:', 105, antY, { align: 'center' });
  antY += 2;
  autoTable(doc, {
    startY: antY + 2,
    body: [
      ['CONSUME MARIHUANA (THC)', `NO (${!datos.antConsumeMarih ? "X" : "" || ''})`, `SI (${datos.antConsumeMarih ? "X" : " " })`],
      ['CONSUME COCAINA (COC)', `NO (${!datos.antConsumeCocacina ? "X" : "" || ''})`, `SI (${datos.antConsumeCocacina ? "X" : " " })`],
      ['CONSUME HOJA DE COCA EN LOS 14 DIAS PREVIOS', `NO (${!datos.antConsumeHojaCoca ? "X" : "" || ''})`, `SI (${datos.antConsumeHojaCoca ? "X" : " " })`],
      ['CONSUME ANFETAMINAS (AMP)', `NO (${!datos.antConsumeAnfetaminaOExtasis ? "X" : "" || ''})`, `SI (${datos.antConsumeAnfetaminaOExtasis ? "X" : " " })`],
      ['CONSUME METANFETAMINAS (MET)', `NO (${!datos.antConsumeMethanfetamina ? "X" : "" || ''})`, `SI (${datos.antConsumeMethanfetamina ? "X" : " " })`],
      ['CONSUME BENZODIAZEPINAS (BZO)', `NO (${!datos.antConsumeBenzodiacepinas ? "X" : "" || ''})`, `SI (${datos.antConsumeBenzodiacepinas ? "X" : " " })`],
      ['CONSUME OPIÁCEOS (OPI)', `NO (${!datos.antConsumeOpiacesos ? "X" : "" || ''})`, `SI (${datos.antConsumeOpiacesos ? "X" : " " })`],
      ['CONSUME BARBITÚRICOS (BAR)', `NO (${!datos.antConsumeBarbituricos ? "X" : "" || ''})`, `SI (${datos.antConsumeBarbituricos ? "X" : " " })`],
      ['CONSUME METADONA (MTD)', `NO (${!datos.antConsumeMetadona ? "X" : "" || ''})`, `SI (${datos.antConsumeMetadona ? "X" : " " })`],
      ['CONSUME FENCICLIDINA (PCP)', `NO (${!datos.antConsumeFenciclidina ? "X" : "" || ''})`, `SI (${datos.antConsumeFenciclidina ? "X" : " " })`],
      ['CONSUME ANTIDEPRESIVOS TRICÍCLICOS (TCA)', `NO (${!datos.antConsumeAntidepreTricicli ? "X" : "" || ''})`, `SI (${datos.antConsumeAntidepreTricicli ? "X" : " " })`],
    ],
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1 },
    columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 30 }, 2: { cellWidth: 30 } },
    margin: { left: 40 },
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