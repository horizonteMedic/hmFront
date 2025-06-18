import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerConsentimiento from "../components/headerConsentimiento";
import footer from "../components/footer";

export default function Consentimiento_Panel5D_Digitalizado(datos) {
  const doc = new jsPDF();
  headerConsentimiento(doc, datos);

  const huella = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "HUELLA");
  const firma = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "FIRMAP");
  const sello = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
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
   let y = 44; // Más espacio bajo el logo
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;

    // Título principal con línea horizontal
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(
      "CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DROGAS PANEL 5D",
      pageW / 2,
      y,
      { align: "center" }
    );
    doc.line(20, y + 2, 190, y + 2); // Línea horizontal debajo del título
    y += 6;
    doc.setFontSize(11);
    doc.text(
      "(COCAÍNA, MARIHUANA, ÉXTASIS, OPIÁCEOS Y BENZODIACEPINA)",
      pageW / 2,
      y,
      { align: "center" }
    );
    y += 11;

    // Bloque de datos personales y consentimiento en un solo párrafo justificado y con campos clave en negrita
    doc.setFontSize(11);
    const bloqueNormal1 = 'YO ';
    const bloqueNegrita1 = String(datos.nombres || '_________________________');
    const bloqueNormal2 = ' de ';
    const bloqueNegrita2 = String(datos.edad || '___');
    const bloqueNormal3 = ' años de edad, identificado con DNI N° ';
    const bloqueNegrita3 = String(datos.dni || '__________');
    const bloqueNormal4 = ', habiendo recibido consejería, e información acerca de la prueba para el panel de 5 drogas en orina; y en pleno uso de mis facultades mentales, AUTORIZO se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post-Test y mis resultados.';
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
    y += lines.length * 7 + 2;

    // Tabla de antecedentes
    autoTable(doc, {
      startY: y,
      body: [
        ['CONSUME MARIHUANA (THC)', `NO (${!datos.antConsumeMarih ? "X" : "    "})`, `SI (${datos.antConsumeMarih ? "X" : "    "})${datos.antConsumeMarih ? `  CUANDO: ${datos.fechaConsumeMarih || ''}` : ""}`],
        ['CONSUME COCAÍNA (COC)', `NO (${!datos.antConsumeCocacina ? "X" : "    "})`, `SI (${datos.antConsumeCocacina ? "X" : "    "})${datos.antConsumeCocacina ? `  CUANDO: ${datos.fechaConsumeCocacina || ''}` : ""}`],
        ['CONSUME HOJA DE COCA EN LOS 14 DÍAS PREVIOS', `NO (${!datos.antConsumeHojaCoca ? "X" : "    "})`, `SI (${datos.antConsumeHojaCoca ? "X" : "    "})${datos.antConsumeHojaCoca ? `  CUANDO: ${datos.fechaConsumoHojaCoca || ''}` : ""}`],
        ['CONSUME ÉXTASIS (EXT)', `NO (${!datos.antConsumeAnfetaminaOExtasis ? "X" : "    "})`, `SI (${datos.antConsumeAnfetaminaOExtasis ? "X" : "    "})${datos.antConsumeAnfetaminaOExtasis ? `  CUANDO: ${datos.fechaConsumeAnfetamina || ''}` : ""}`],
        ['CONSUME OPIÁCEOS (OPI)', `NO (${!datos.antConsumeOpiaceos ? "X" : "    "})`, `SI (${datos.antConsumeOpiaceos ? "X" : "    "})${datos.antConsumeOpiaceos ? `  CUANDO: ${datos.fechaConsumeOpiacesos || ''}` : ""}`],
        ['CONSUME BENZODIAZEPINAS (BZO)', `NO (${!datos.antConsumeBenzodiacepinas ? "X" : "    "})`, `SI (${datos.antConsumeBenzodiacepinas ? "X" : "    "})${datos.antConsumeBenzodiacepinas ? `  CUANDO: ${datos.fechaConsumeBenzodiacepinas || ''}` : ""}`],
      ],
      theme: 'plain',
      styles: { fontSize: 9, textColor: [0, 0, 0], cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 110 },
        1: { cellWidth: 25 },
        2: { cellWidth: 66 }
      },
      margin: { left: margin, right: margin }
    });
    y = doc.lastAutoTable.finalY + 5;

    // Fecha del examen en la parte inferior
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Fecha del examen: ${datos.fecha || ''}`, pageW / 2, y, { align: "center" });
    y += 12;

    // Firma y huella - centrado
    const firmasY = y;
    const blockWidth = 170;
    const blockX = (pageW - blockWidth) / 2;

    // Cuadro de huella digital a la izquierda
    doc.setDrawColor(0);
    doc.rect(blockX, firmasY, 40, 40);
    doc.setFontSize(11);
    doc.text("Huella", blockX + 20, firmasY + 45, { align: "center" });
    if (huellap) {
      const boxW = 40;
      const boxH = 40;
      const imgRatio = huellap.width / huellap.height;
      let imgW = boxW;
      let imgH = boxW / imgRatio;

      if (imgH > boxH) {
        imgH = boxH;
        imgW = boxH * imgRatio;
      }
      const imgX = blockX + (boxW - imgW) / 2;
      const imgY = firmasY + (boxH - imgH) / 2;
      const canvas = document.createElement('canvas');
      canvas.width = huellap.width;
      canvas.height = huellap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(huellap, 0, 0);
      const huellaBase64 = canvas.toDataURL('image/png');
      doc.addImage(huellaBase64, 'PNG', imgX, imgY, imgW, imgH);
    }
    // Firmas centradas
    const firma1X = blockX + 60;
    const firma2X = blockX + 111;
    const firmaLineWidth = 40;
    const firmaY = firmasY + 25;
    // Línea de firma del paciente
    doc.line(firma1X, firmaY, firma1X + firmaLineWidth, firmaY);
    doc.text("Firma del Paciente", firma1X + firmaLineWidth / 2, firmaY + 7, { align: "center" });
    if (firmap) {
      const firmaW = 40;
      const firmaH = (firmap.height / firmap.width) * firmaW;
      const firmaX = firma1X + (firmaLineWidth - firmaW) / 2;
      const firmaImgY = firmaY - firmaH - 1;

      const canvas = document.createElement('canvas');
      canvas.width = firmap.width;
      canvas.height = firmap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(firmap, 0, 0);
      const firmaBase64 = canvas.toDataURL('image/png');
      doc.addImage(firmaBase64, 'PNG', firmaX, firmaImgY, firmaW, firmaH);
    }
    // Línea de firma y sello del consejero
    doc.line(firma2X, firmaY, firma2X + firmaLineWidth, firmaY);
    doc.text("Firma y sello del Consejero", firma2X + firmaLineWidth / 2, firmaY + 7, { align: "center" });
    if (sellop) {
      const selloW = 35;
      const selloH = (sellop.height / sellop.width) * selloW;
      const selloX = firma2X + (firmaLineWidth - selloW) / 2;
      const selloY = firmaY - selloH - 1;

      const canvas = document.createElement('canvas');
      canvas.width = sellop.width;
      canvas.height = sellop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(sellop, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      doc.addImage(selloBase64, 'PNG', selloX, selloY, selloW, selloH);
    }

    // Footer
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