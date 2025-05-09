// src/views/admin/panel-de-control/RegistroDePacientes/ConsentimientoDigitalizacion/PdfGenerado.jsx

import { jsPDF } from 'jspdf';

/**
 * Genera y descarga un PDF con la declaración jurada.
 *
 * @param {{ nombre: string, edad: string|number, dni: string, orderNumber: string }} datos
 */
export function generatePdf({ nombre, edad, dni, orderNumber, FirmaP, HuellaP, jasper }) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 50;
  const lineHeight = 18;
  const paraSpacing = 24;
  const lineHeightFactor = 1.2;
  let y = margin;

  //DATOS JASPER
  

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

  Promise.all([
    loadImg(logoUrl),
    HuellaP.id === 1 ? loadImg(HuellaP.url) : Promise.resolve(null),
    FirmaP.id === 1 ? loadImg(FirmaP.url) : Promise.resolve(null)
  ])
    .then(([logoImg, huellaImg, firmaImg]) => {
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
      const edadText   = jasper.edad   != null ? `${jasper.edad}` : '......';
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

      const boxSize       = 80;
      const colGap        = 120;
      const textOffset    = lineHeight;
      const extraLines    = 3;       // firma + DNI + fecha
      const vertGapSigHue = 80;
      const blockWidth    = boxSize * 2 + colGap;
      const startX        = (pageW - blockWidth) / 2;
      const col2X         = startX + boxSize + colGap;
      let sectionY        = y+35;

      // Centros de columna
      const center1 = startX + boxSize / 2;
      const center2 = col2X  + boxSize / 2;

      // Líneas de firma
      doc.setLineWidth(1);
      // Firma Manuscrita
      doc.line(startX -20 , sectionY, startX+ 20 + boxSize, sectionY);
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
      doc.line(col2X-20, sectionY, col2X+ 20 + boxSize, sectionY);
      const labelSig2 = 'Firma Electrónica del Paciente';
      const wSig2     = doc.getTextWidth(labelSig2);
      doc.text(labelSig2, center2 - wSig2 / 2, sectionY + textOffset);
      if (firmaImg) {
        const firmaW = boxSize + 40;
        const firmaH = (firmaImg.height / firmaImg.width) * firmaW;
        const firmaX = col2X - 20;
        const firmaY = sectionY - firmaH - 1;
      
        const canvas = document.createElement('canvas');
        canvas.width = firmaImg.width;
        canvas.height = firmaImg.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(firmaImg, 0, 0);
        const firmaBase64 = canvas.toDataURL('image/png');
        doc.addImage(firmaBase64, 'PNG', firmaX, firmaY, firmaW, firmaH);
      }
      // DNI y Fecha bajo Firma Electrónica
      const wDni2  = doc.getTextWidth(dniLine);
      const wDate2 = doc.getTextWidth(dateLine);
      doc.text(dniLine,  center2 - wDni2  / 2, sectionY + textOffset * 2);
      doc.text(dateLine, center2 - wDate2 / 2, sectionY + textOffset * 3);

      // Avanzar a huellas
      sectionY += textOffset * extraLines + 30; // Menos espacio vertical

      // Cuadro rectangular para huellas
      const hueW = boxSize + 10;
      const hueH = boxSize + 40;
      doc.rect(startX, sectionY, hueW, hueH);
      const labelHue1 = 'Huella Manuscrita del Paciente';
      const wHue1     = doc.getTextWidth(labelHue1);
      doc.text(labelHue1, center1 - wHue1 / 2, sectionY + hueH + textOffset);

      doc.rect(col2X, sectionY, hueW, hueH);
      if (huellaImg) {
        const canvas = document.createElement('canvas');
        canvas.width = huellaImg.width;
        canvas.height = huellaImg.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(huellaImg, 0, 0);
        const huellaBase64 = canvas.toDataURL('image/png');
        // Imagen rectangular, ocupa casi todo el cuadro
        doc.addImage(huellaBase64, 'PNG', col2X + 5, sectionY + 5, hueW - 10, hueH - 10);
      }
      const labelHue2 = 'Huella Electrónica del Paciente';
      const wHue2     = doc.getTextWidth(labelHue2);
      doc.text(labelHue2, center2 - wHue2 / 2, sectionY + hueH + textOffset);

      // Actualiza Y para el footer
      y = sectionY + boxSize + paraSpacing;

      // ----------- FOOTER CENTRADO -----------
      const footerY = pageH - margin - 10;
      doc.setDrawColor(128, 0, 128).setLineWidth(1);
      doc.line(margin, footerY, pageW - margin, footerY);

      doc.setFont('helvetica', 'normal').setFontSize(8);
      const footerLines = [
        `${jasper.dir_tru_pierola}, Cel. ${jasper.cel_trujillo_pie} Telf. ${jasper.telf_tru_pierola} ${jasper.email_tru_pierola}.`,
        `${jasper.dir_trujillo}  Telf. ${jasper.telf_trujillo}`,
        `${jasper.dir_huamachuco}  Cel. ${jasper.cel_huamachuco}  ${jasper.email_huamachuco}  Telf. ${jasper.telf_huamachuco}`,
        `${jasper.dir_huancayo}  ${jasper.email_huancayo}  Telf. ${jasper.telf_huancayo}`
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
      const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Crear un iframe invisible para imprimir directamente
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = pdfUrl;
        document.body.appendChild(iframe);

        iframe.onload = function () {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        };
    })
    .catch(err => {
      console.error(err);
      alert('Error generando PDF: ' + err);
    });
}
