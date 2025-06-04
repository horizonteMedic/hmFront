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
  let texto = `Yo......................................................................................., de ....... años de\nedad, identificado con DNI nº ......................... ............................; habiendo recibido consejería e información\nacerca de la prueba para el panel de 10D drogas en orina; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post - Test y mis resultados.`;

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

  // Antecedentes (tabla)
  let antY = y + 38;
  doc.setFont(undefined, 'bold');
  doc.text('ANTECEDENTES:', 15, antY);
  antY += 2;
  autoTable(doc, {
    startY: antY + 2,
    body: [
      ['CONSUME MARIHUANA (THC)', `NO (${datos.ant_thc_no || ''})`, `SI (${datos.ant_thc_si || ''})`],
      ['CONSUME COCAINA (COC)', `NO (${datos.ant_coc_no || ''})`, `SI (${datos.ant_coc_si || ''})`],
      ['CONSUME HOJA DE COCA EN LOS 14 DIAS PREVIOS', `NO (${datos.ant_coca_no || ''})`, `SI (${datos.ant_coca_si || ''})`],
      ['CONSUME ANFETAMINAS (AMP)', `NO (${datos.ant_amp_no || ''})`, `SI (${datos.ant_amp_si || ''})`],
      ['CONSUME METANFETAMINAS (MET)', `NO (${datos.ant_met_no || ''})`, `SI (${datos.ant_met_si || ''})`],
      ['CONSUME BENZODIAZEPINAS (BZO)', `NO (${datos.ant_bzo_no || ''})`, `SI (${datos.ant_bzo_si || ''})`],
      ['CONSUME OPIÁCEOS (OPI)', `NO (${datos.ant_opi_no || ''})`, `SI (${datos.ant_opi_si || ''})`],
      ['CONSUME BARBITÚRICOS (BAR)', `NO (${datos.ant_bar_no || ''})`, `SI (${datos.ant_bar_si || ''})`],
      ['CONSUME METADONA (MTD)', `NO (${datos.ant_mtd_no || ''})`, `SI (${datos.ant_mtd_si || ''})`],
      ['CONSUME FENCICLIDINA (PCP)', `NO (${datos.ant_pcp_no || ''})`, `SI (${datos.ant_pcp_si || ''})`],
      ['CONSUME ANTIDEPRESIVOS TRICÍCLICOS (TCA)', `NO (${datos.ant_tca_no || ''})`, `SI (${datos.ant_tca_si || ''})`],
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