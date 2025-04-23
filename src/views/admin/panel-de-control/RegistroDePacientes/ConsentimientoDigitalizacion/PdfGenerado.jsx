// src/views/admin/panel-de-control/RegistroDePacientes/ConsentimientoDigitalizacion/PdfGenerado.jsx

import { jsPDF } from 'jspdf';

/**
 * Genera y descarga un PDF con la declaración jurada.
 *
 * @param {{ nombre: string, edad: string|number, dni: string, orderNumber: string }} datos
 */
export function generatePdf({ nombre, edad, dni, orderNumber }) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const margin = 50;
  const lineHeight = 18;
  const paraSpacing = 24;
  const lineHeightFactor = 1.2;
  let y = margin;

  // Helper para cargar logo
  const loadImg = src =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'anonymous';
      img.onload = () => res(img);
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });

  const logoUrl = '/img/logo-color.png';

  loadImg(logoUrl)
    .then(logoImg => {
      // ----------- CABECERA -----------
      const logoW = 200;
      const logoH = (logoImg.height / logoImg.width) * logoW;
      doc.addImage(logoImg, 'PNG', margin, y, logoW, logoH);

      doc.setFont('helvetica', 'normal').setFontSize(10);
      const ordText = `Nro Orden: ${orderNumber || ''}`;
      const ordX = pageW - margin - doc.getTextWidth(ordText);
      const ordY = y + logoH / 2 + 4;
      doc.text(ordText, ordX, ordY);

      y += Math.max(logoH, 80) + 30;

      // ----------- TÍTULO CENTRADO -----------
      doc.setFont('helvetica', 'bold').setFontSize(14);
      const title = 'DECLARACIÓN JURADA PARA EL USO DE FIRMA ELECTRÓNICA';
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageW - titleWidth) / 2, y);
      y += paraSpacing;

      // ----------- PÁRRAFO 1 -----------
      doc.setFont('helvetica', 'normal').setFontSize(11);
      const nombreText = nombre || '.................................................................';
      const edadText   = edad   != null ? `${edad}` : '......';
      const dniText    = dni    || '..........................';
      const p1 =
        `Yo, ${nombreText}, de ${edadText} años de edad, identificado(a) con DNI N.° ${dniText}, ` +
        `autorizo el uso de mi firma electrónica y huella, exclusivamente para la impresión ` +
        `de informes médicos. Esta firma tendrá validez para los documentos necesarios implicados ` +
        `en este proceso.`;
      const linesP1 = doc.splitTextToSize(p1, pageW - margin * 2);
      doc.text(linesP1, margin, y, { lineHeightFactor });
      y += linesP1.length * lineHeight * lineHeightFactor + paraSpacing;

      // ----------- PÁRRAFO 2 -----------
      const p2 =
        'Asimismo, doy fe de que la información proporcionada es verídica, al igual que la información ' +
        'que brindaré durante los exámenes realizados en el centro médico Horizonte Medic.';
      const linesP2 = doc.splitTextToSize(p2, pageW - margin * 2);
      doc.text(linesP2, margin, y, { lineHeightFactor });
      y += linesP2.length * lineHeight * lineHeightFactor + paraSpacing;

      // ----------- PÁRRAFO 3 -----------
      const p3 =
        'También, autorizo el envío de información médica a los correos electrónicos y/o números de ' +
        'celular de la empresa contratista.';
      const linesP3 = doc.splitTextToSize(p3, pageW - margin * 2);
      doc.text(linesP3, margin, y, { lineHeightFactor });
      y += linesP3.length * lineHeight * lineHeightFactor + paraSpacing;

      // ----------- SECCIÓN: FIRMAS (líneas) CON DNI Y FECHA + HUELLAS -----------
      const formattedDate = new Intl.DateTimeFormat('es-PE', {
        day: 'numeric', month: 'long', year: 'numeric'
      }).format(new Date());

      const boxSize       = 60;
      const colGap        = 120;
      const textOffset    = lineHeight;
      const extraLines    = 3;       // firma + DNI + fecha
      const vertGapSigHue = 80;
      const blockWidth    = boxSize * 2 + colGap;
      const startX        = (pageW - blockWidth) / 2;
      const col2X         = startX + boxSize + colGap;
      let sectionY        = y;

      // Centros de columna
      const center1 = startX + boxSize / 2;
      const center2 = col2X  + boxSize / 2;

      // Líneas de firma
      doc.setLineWidth(1);
      // Firma Manuscrita
      doc.line(startX, sectionY, startX + boxSize, sectionY);
      const labelSig1 = 'Firma Manuscrita del Paciente';
      const wSig1     = doc.getTextWidth(labelSig1);
      doc.text(labelSig1, center1 - wSig1 / 2, sectionY + textOffset);

      // DNI y Fecha bajo Firma Manuscrita
      const dniLine  = `DNI: ${dni || ''}`;
      const dateLine = `Fecha: ${formattedDate}`;
      const wDni1    = doc.getTextWidth(dniLine);
      const wDate1   = doc.getTextWidth(dateLine);
      doc.text(dniLine,  center1 - wDni1 / 2,  sectionY + textOffset * 2);
      doc.text(dateLine, center1 - wDate1 / 2, sectionY + textOffset * 3);

      // Firma Electrónica
      doc.line(col2X, sectionY, col2X + boxSize, sectionY);
      const labelSig2 = 'Firma Electrónica del Paciente';
      const wSig2     = doc.getTextWidth(labelSig2);
      doc.text(labelSig2, center2 - wSig2 / 2, sectionY + textOffset);

      // DNI y Fecha bajo Firma Electrónica
      const wDni2  = doc.getTextWidth(dniLine);
      const wDate2 = doc.getTextWidth(dateLine);
      doc.text(dniLine,  center2 - wDni2  / 2, sectionY + textOffset * 2);
      doc.text(dateLine, center2 - wDate2 / 2, sectionY + textOffset * 3);

      // Avanzar a huellas
      sectionY += textOffset * extraLines + vertGapSigHue;

      // Huella Manuscrita
      doc.rect(startX, sectionY, boxSize, boxSize);
      const labelHue1 = 'Huella Manuscrita del Paciente';
      const wHue1     = doc.getTextWidth(labelHue1);
      doc.text(labelHue1, center1 - wHue1 / 2, sectionY + boxSize + textOffset);

      // Huella Electrónica
      doc.rect(col2X, sectionY, boxSize, boxSize);
      const labelHue2 = 'Huella Electrónica del Paciente';
      const wHue2     = doc.getTextWidth(labelHue2);
      doc.text(labelHue2, center2 - wHue2 / 2, sectionY + boxSize + textOffset);

      // Actualiza Y para el footer
      y = sectionY + boxSize + paraSpacing;

      // ----------- FOOTER CENTRADO -----------
      const footerY = pageH - margin - 10;
      doc.setDrawColor(128, 0, 128).setLineWidth(1);
      doc.line(margin, footerY, pageW - margin, footerY);

      doc.setFont('helvetica', 'normal').setFontSize(7);
      const footerLines = [
        'Sede Trujillo: Av. Nicolás de Piérola N°1106 Urb. San Fernando Cel. 964385075  Telf. 044-666120  Cl. Guillermo Prescott N°127 Urb. Sto. Dominguito  Telf. 044-767608',
        'Sede Huamachuco: Jr. Leoncio Prado N°786  Cel. 990094744-969603777  admision@horizontemedic.com  Telf. 044-348070',
        'Sede Huancayo: Av. Huancavelica N°2225 - Distrito El Tambo  admision.huancayo@horizontemedic.com  Telf. 064-659554'
      ];
      let ty = footerY + 12;
      footerLines.forEach(line => {
        const frags = doc.splitTextToSize(line, pageW - margin * 1);
        frags.forEach(txt => {
          const txtW = doc.getTextWidth(txt);
          doc.text(txt, (pageW - txtW) / 2, ty);
          ty += 7;
        });
        ty += 4;
      });

      // ----------- GUARDAR PDF -----------
      doc.save('Declaracion_Jurada_Firma_Electronica.pdf');
    })
    .catch(err => {
      console.error(err);
      alert('Error generando PDF: ' + err);
    });
}
