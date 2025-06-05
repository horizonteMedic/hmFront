import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default function ConsentimientoPanel10D(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  let y = 58;

  // Título subrayado y negrita
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.text('CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DROGAS PANEL 10 D (AMP-BAR-BZO-COC-MET-MTD-PCP-THC-OPI-TCA)', 105, y, { align: 'center' });
  doc.setLineWidth(0.5);
  doc.line(15, y + 2, 195, y + 2);
  doc.setFontSize(10);

  // Cuerpo del consentimiento
  y += 10;
  let texto = `Yo......................................................................................., de ....... años de\nedad, identificado con DNI nº ...${datos.dni}..; habiendo recibido consejería e información\nacerca de la prueba para el panel de 10D drogas en orina; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post - Test y mis resultados.`;

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
  doc.text(`${datos.fecha || ''}`, 155, y + 30);

  // Antecedentes (tabla)
  let antY = y + 38;
  doc.setFont(undefined, 'bold');
  doc.text('ANTECEDENTES:', 15, antY);
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