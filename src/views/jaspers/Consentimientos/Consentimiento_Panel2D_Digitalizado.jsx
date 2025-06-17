import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerConsentimiento from "../components/headerConsentimiento";
import footer from "../components/footer";

export default function Consentimiento_Panel2D_Digitalizado(datos) {
  const doc = new jsPDF();
  headerConsentimiento(doc, datos);

  const huella = datos.digitalizacion.find(d => d.nombreDigitalizacion === "HUELLA");
  const firma = datos.digitalizacion.find(d => d.nombreDigitalizacion === "FIRMAP");
  const sello = datos.digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const isValidUrl = url => url && url !== "Sin registro";

  const loadImg = src =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'anonymous';
      img.onload = () => res(img);
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });
  Promise.all([
    isValidUrl(huella?.url) ? loadImg(huella.url) : Promise.resolve(null),
    isValidUrl(firma?.url) ? loadImg(firma.url) : Promise.resolve(null),
    isValidUrl(sello?.url) ? loadImg(sello.url) : Promise.resolve(null)
  ])
   .then(([huellap, firmap, sellop]) => {
    let y = 44;
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;

    // Título subrayado y negrita
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DOSAJE DE', pageW / 2, y, { align: 'center' });
    y += 6;
    doc.text('MARIHUANA Y COCAÍNA', pageW / 2, y, { align: 'center' });
    doc.line(20, y + 2, 190, y + 2); // Línea horizontal debajo del título
    doc.setFontSize(11);

    // Cuerpo del consentimiento con campos en negrita
    y += 10;
    const bloqueNormal1 = 'Yo ';
    const bloqueNegrita1 = String(datos.nombres || '_________________________');
    const bloqueNormal2 = ' , de ';
    const bloqueNegrita2 = String(datos.edad || '___');
    const bloqueNormal3 = ' años de edad, identificado con DNI nº ';
    const bloqueNegrita3 = String(datos.dni || '__________');
    const bloqueNormal4 = '; habiendo recibido consejería e información acerca de la prueba para Marihuana en orina; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post - Test y mis resultados.';

    const fullText = bloqueNormal1 + bloqueNegrita1 + bloqueNormal2 + bloqueNegrita2 + bloqueNormal3 + bloqueNegrita3 + bloqueNormal4;
    const lines = doc.splitTextToSize(fullText, pageW - 2 * margin - 4);
    let yBloque = y;
    lines.forEach(line => {
      let x = margin;
      // Detectar y renderizar los campos en negrita en cada línea
      let idx = 0;
      while (idx < line.length) {
        if (line.startsWith(bloqueNormal1, idx)) {
          doc.setFont('helvetica', 'normal');
          doc.text(bloqueNormal1, x, yBloque, { baseline: 'top' });
          x += doc.getTextWidth(bloqueNormal1);
          idx += bloqueNormal1.length;
        } else if (line.startsWith(bloqueNegrita1, idx)) {
          doc.setFont('helvetica', 'bold');
          doc.text(bloqueNegrita1, x, yBloque, { baseline: 'top' });
          x += doc.getTextWidth(bloqueNegrita1);
          idx += bloqueNegrita1.length;
        } else if (line.startsWith(bloqueNormal2, idx)) {
          doc.setFont('helvetica', 'normal');
          doc.text(bloqueNormal2, x, yBloque, { baseline: 'top' });
          x += doc.getTextWidth(bloqueNormal2);
          idx += bloqueNormal2.length;
        } else if (line.startsWith(bloqueNegrita2, idx)) {
          doc.setFont('helvetica', 'bold');
          doc.text(bloqueNegrita2, x, yBloque, { baseline: 'top' });
          x += doc.getTextWidth(bloqueNegrita2);
          idx += bloqueNegrita2.length;
        } else if (line.startsWith(bloqueNormal3, idx)) {
          doc.setFont('helvetica', 'normal');
          doc.text(bloqueNormal3, x, yBloque, { baseline: 'top' });
          x += doc.getTextWidth(bloqueNormal3);
          idx += bloqueNormal3.length;
        } else if (line.startsWith(bloqueNegrita3, idx)) {
          doc.setFont('helvetica', 'bold');
          doc.text(bloqueNegrita3, x, yBloque, { baseline: 'top' });
          x += doc.getTextWidth(bloqueNegrita3);
          idx += bloqueNegrita3.length;
        } else if (line.startsWith(bloqueNormal4, idx)) {
          doc.setFont('helvetica', 'normal');
          doc.text(line.substring(idx), x, yBloque, { baseline: 'top' });
          break;
        } else {
          // Si hay texto que no coincide, lo renderizamos normal
          let nextIdx = idx + 1;
          while (nextIdx < line.length && ![bloqueNormal1, bloqueNegrita1, bloqueNormal2, bloqueNegrita2, bloqueNormal3, bloqueNegrita3, bloqueNormal4].some(b => line.startsWith(b, nextIdx))) {
            nextIdx++;
          }
          const fragment = line.substring(idx, nextIdx);
          doc.setFont('helvetica', 'normal');
          doc.text(fragment, x, yBloque, { baseline: 'top' });
          x += doc.getTextWidth(fragment);
          idx = nextIdx;
        }
      }
      yBloque += 7;
    });
    y += lines.length * 7 + 10;

    // Antecedentes
    let antY = y + 12;
    doc.setFont(undefined, 'bold');
    doc.text('ANTECEDENTES:', 15, antY);
    antY += 6;
    doc.setFont(undefined, 'normal');
    autoTable(doc, {
      startY: antY,
      body: [
        ['CONSUME MARIHUANA', `NO ( ${!datos.antConsumeMarih ? "X" : " "} )`, `SI ( ${datos.antConsumeMarih ? "X" : " "} )`, datos.antConsumeMarih ? `CUANDO: ${datos.fechaConsumoMarihuana || ''}` : ''],
        ['CONSUMIO HOJA DE COCA EN LOS 7 DIAS PREVIOS', `NO ( ${!datos.antConsumeHojaCoca ? "X" : " "} )`, `SI ( ${datos.antConsumeHojaCoca ? "X" : " "} )`, datos.antConsumeHojaCoca ? `CUANDO: ${datos.fechaConsumoHojaCoca || ''}` : ''],
        ['CONSUME COCAÍNA', `NO ( ${!datos.antConsumeCocacina ? "X" : " "} )`, `SI ( ${datos.antConsumeCocacina ? "X" : " "} )`, datos.antConsumeCocacina ? `CUANDO: ${datos.fechaConsumoCocaina || ''}` : ''],
      ],
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 1 },
      columnStyles: { 
        0: { cellWidth: 80 }, 
        1: { cellWidth: 30 }, 
        2: { cellWidth: 30 },
        3: { cellWidth: 60 }
      },
      margin: { left: 15 },
      didDrawPage: () => {}
    });

    // Fecha del examen en la parte inferior
    y = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Fecha del examen: ${datos.fecha || ''}`, pageW / 2, y, { align: "center" });
    y += 12;

    // Recuadros de firmas y huella
    const baseY = y + 10;

    // Firma primero, luego huella
    doc.line(65, baseY + 32, 115, baseY + 32);
    doc.text('Firma del Paciente', 90, baseY + 38, { align: 'center' });
    if (firmap) {
      const firmaW = 40;
      const firmaH = (firmap.height / firmap.width) * firmaW;
      const firmaX = 70 + (50 - firmaW) / 2;
      const firmaY = baseY + 32 - firmaH - 2;
      const canvas = document.createElement('canvas');
      canvas.width = firmap.width;
      canvas.height = firmap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(firmap, 0, 0);
      const firmaBase64 = canvas.toDataURL('image/png');
      doc.addImage(firmaBase64, 'PNG', firmaX, firmaY, firmaW, firmaH);
    }

    // Huella
    doc.rect(25, baseY, 28, 32);
    doc.setFontSize(10);
    doc.text('Huella', 39, baseY + 38, { align: 'center' });
    if (huellap) {
      const maxW = 28;
      const maxH = 32;
      let huellaW = maxW;
      let huellaH = (huellap.height / huellap.width) * huellaW;

      // Si excede la altura máxima, reajustar proporciones
      if (huellaH > maxH) {
        huellaH = maxH;
        huellaW = (huellap.width / huellap.height) * huellaH;
      }

      const huellaX = 25 + (maxW - huellaW) / 2;
      const huellaY = baseY + (maxH - huellaH) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = huellap.width;
      canvas.height = huellap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(huellap, 0, 0);
      const huellaBase64 = canvas.toDataURL('image/png');

      doc.addImage(huellaBase64, 'PNG', huellaX, huellaY, huellaW, huellaH);
    }

    // Firma consejero
    doc.line(135, baseY + 32, 185, baseY + 32);
    doc.text('Firma y sello del Consejero', 160, baseY + 38, { align: 'center' });
    if (sellop) {
      const selloW = 35;
      const selloH = (sellop.height / sellop.width) * selloW;
      const selloX = 135 + (50 - selloW) / 2;
      const selloY = baseY + 32 - selloH - 2;
      const canvas = document.createElement('canvas');
      canvas.width = sellop.width;
      canvas.height = sellop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(sellop, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      doc.addImage(selloBase64, 'PNG', selloX, selloY, selloW, selloH);
    }
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
   })
  
} 