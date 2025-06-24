import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerConsentimiento from "../components/headerConsentimiento";
import footer from "../components/footer";

export default function Consentimiento_Panel10D_Digitalizado(datos) {
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
    const margin = 18;

    // Título principal en dos líneas, con subrayado y tamaño 14
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    // Primera línea del título
    doc.text('CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DROGAS PANEL 10D', pageW / 2, y, { align: 'center' });
    let wT1 = doc.getTextWidth('CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DROGAS PANEL 10D');
    let xT1 = (pageW - wT1) / 2;
    doc.setLineWidth(0.7);
    doc.line(xT1, y + 2, xT1 + wT1, y + 2);
    doc.setLineWidth(0.2);
    y += 10;
    // Segunda línea del título
    doc.text('(AMP-BAR-BZO-COC-MET-MTD-PCP-THC-OPI-TCA)', pageW / 2, y, { align: 'center' });
    let wT2 = doc.getTextWidth('(AMP-BAR-BZO-COC-MET-MTD-PCP-THC-OPI-TCA)');
    let xT2 = (pageW - wT2) / 2;
    doc.setLineWidth(0.7);
    doc.line(xT2, y + 2, xT2 + wT2, y + 2);
    doc.setLineWidth(0.2);
    y += 12;
    doc.setFontSize(11);

    // Bloque de datos personales y consentimiento con interlineado y justificado
    const nombre = String(datos.nombres || '_________________________');
    const edad = String(datos.edad || '___');
    const dni = String(datos.dni || '__________');
    const bloques = [
      { text: 'Yo ', bold: false },
      { text: nombre, bold: true },
      { text: ', de ', bold: false },
      { text: edad, bold: true },
      { text: ' años de edad, identificado con DNI nº ', bold: false },
      { text: dni, bold: true },
      { text: '; habiendo recibido consejería e información acerca de la prueba para el panel de 10D drogas en orina; y en pleno uso de mis facultades mentales ', bold: false },
      { text: 'AUTORIZO', bold: true },
      { text: ' se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post - Test y mis resultados.', bold: false },
    ];
    const maxWidth = pageW - 2 * margin - 4;
    const interlineado = 7;
    function armarLineas(bloques, maxWidth) {
      let lineas = [];
      let lineaActual = [];
      let anchoActual = 0;
      let espacio = doc.getTextWidth(' ');
      let i = 0;
      while (i < bloques.length) {
        let bloque = bloques[i];
        if (!bloque.bold && bloque.text.includes(' ')) {
          let palabras = bloque.text.split(/(\s+)/);
          for (let j = 0; j < palabras.length; j++) {
            let palabra = palabras[j];
            if (palabra === '') continue;
            let anchoPalabra = doc.getTextWidth(palabra);
            if (anchoActual + anchoPalabra > maxWidth && lineaActual.length > 0) {
              lineas.push(lineaActual);
              lineaActual = [];
              anchoActual = 0;
            }
            lineaActual.push({ text: palabra, bold: false });
            anchoActual += anchoPalabra;
          }
        } else {
          let anchoBloque = doc.getTextWidth(bloque.text);
          if (anchoActual + anchoBloque > maxWidth && lineaActual.length > 0) {
            lineas.push(lineaActual);
            lineaActual = [];
            anchoActual = 0;
          }
          lineaActual.push(bloque);
          anchoActual += anchoBloque;
        }
        i++;
      }
      if (lineaActual.length > 0) lineas.push(lineaActual);
      return lineas;
    }
    let yBloque = y;
    const lineas = armarLineas(bloques, maxWidth);
    lineas.forEach((linea, idx) => {
      const totalW = linea.reduce((sum, b) => sum + doc.getTextWidth(b.text), 0);
      const espacios = linea.filter(b => !b.bold && /^\s+$/.test(b.text)).length;
      const extraSpace = (idx < lineas.length - 1 && espacios > 0)
        ? (maxWidth - totalW) / espacios
        : 0;
      let x = margin;
      linea.forEach(b => {
        doc.setFont('helvetica', b.bold ? 'bold' : 'normal');
        doc.text(b.text, x, yBloque);
        let w = doc.getTextWidth(b.text);
        if (!b.bold && /^\s+$/.test(b.text) && extraSpace) {
          x += w + extraSpace;
        } else {
          x += w;
        }
      });
      yBloque += interlineado;
    });
    y = yBloque + 10;

    // Antecedentes (tabla) igual que Panel2D
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('ANTECEDENTES:', margin, y);
    doc.setFont(undefined, 'normal');
    y += 6;
    autoTable(doc, {
      startY: y,
      body: [
        [
          'CONSUME MARIHUANA (THC)',
          `NO (${!datos.antConsumeMarih ? "X" : "    "})`,
          `SI (${datos.antConsumeMarih ? "X" : "    "})`,
          datos.antConsumeMarih && datos.fechaConsumeMarih
            ? `Cuando: ${datos.fechaConsumeMarih}`
            : ''
        ],
        [
          'CONSUME COCAÍNA (COC)',
          `NO (${!datos.antConsumeCocacina ? "X" : "    "})`,
          `SI (${datos.antConsumeCocacina ? "X" : "    "})`,
          datos.antConsumeCocacina && datos.fechaConsumeCocacina
            ? `Cuando: ${datos.fechaConsumeCocacina}`
            : ''
        ],
        [
          'CONSUME HOJA DE COCA EN LOS 14 DÍAS PREVIOS',
          `NO (${!datos.antConsumeHojaCoca ? "X" : "    "})`,
          `SI (${datos.antConsumeHojaCoca ? "X" : "    "})`,
          datos.antConsumeHojaCoca && datos.fechaConsumoHojaCoca
            ? `Cuando: ${datos.fechaConsumoHojaCoca}`
            : ''
        ],
        [
          'CONSUME ANFETAMINAS (AMP)',
          `NO (${!datos.antConsumeAnfetaminaOExtasis ? "X" : "    "})`,
          `SI (${datos.antConsumeAnfetaminaOExtasis ? "X" : "    "})`,
          datos.antConsumeAnfetaminaOExtasis && datos.fechaConsumeAnfetamina
            ? `Cuando: ${datos.fechaConsumeAnfetamina}`
            : ''
        ],
        [
          'CONSUME METANFETAMINAS (MET)',
          `NO (${!datos.antConsumeMethanfetaminaOOpiaceos ? "X" : "    "})`,
          `SI (${datos.antConsumeMethanfetaminaOOpiaceos ? "X" : "    "})`,
          datos.antConsumeMethanfetaminaOOpiaceos && datos.fechaConsumeOpiacesos
            ? `Cuando: ${datos.fechaConsumeOpiacesos}`
            : ''
        ],
        [
          'CONSUME BENZODIAZEPINAS (BZO)',
          `NO (${!datos.antConsumeBenzodiacepinas ? "X" : "    "})`,
          `SI (${datos.antConsumeBenzodiacepinas ? "X" : "    "})`,
          datos.antConsumeBenzodiacepinas && datos.fechaConsumeBenzodiacepinas
            ? `Cuando: ${datos.fechaConsumeBenzodiacepinas}`
            : ''
        ],
        [
          'CONSUME OPIÁCEOS (OPI)',
          `NO (${!datos.antConsumeOpiacesos ? "X" : "    "})`,
          `SI (${datos.antConsumeOpiacesos ? "X" : "    "})`,
          datos.antConsumeOpiacesos && datos.fechaConsumeOpiacesos
            ? `Cuando: ${datos.fechaConsumeOpiacesos}`
            : ''
        ],
        [
          'CONSUME BARBITÚRICOS (BAR)',
          `NO (${!datos.antConsumeBarbituricos ? "X" : "    "})`,
          `SI (${datos.antConsumeBarbituricos ? "X" : "    "})`,
          datos.antConsumeBarbituricos && datos.fechaConsumeBarbituricos
            ? `Cuando: ${datos.fechaConsumeBarbituricos}`
            : ''
        ],
        [
          'CONSUME METADONA (MTD)',
          `NO (${!datos.antConsumeMetadona ? "X" : "    "})`,
          `SI (${datos.antConsumeMetadona ? "X" : "    "})`,
          datos.antConsumeMetadona && datos.fechaConsumeMetadona
            ? `Cuando: ${datos.fechaConsumeMetadona}`
            : ''
        ],
        [
          'CONSUME FENCICLIDINA (PCP)',
          `NO (${!datos.antConsumeFenciclidina ? "X" : "    "})`,
          `SI (${datos.antConsumeFenciclidina ? "X" : "    "})`,
          datos.antConsumeFenciclidina && datos.fechaConsumeFenciclidina
            ? `Cuando: ${datos.fechaConsumeFenciclidina}`
            : ''
        ],
        [
          'CONSUME ANTIDEPRESIVOS TRICÍCLICOS (TCA)',
          `NO (${!datos.antConsumeAntidepreTricicli ? "X" : "    "})`,
          `SI (${datos.antConsumeAntidepreTricicli ? "X" : "    "})`,
          datos.antConsumeAntidepreTricicli && datos.fechaConsumeAntidepreTricicli
            ? `Cuando: ${datos.fechaConsumeAntidepreTricicli}`
            : ''
        ],
      ],
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 1 },
      columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 20 }, 2: { cellWidth: 20 }, 3: { cellWidth: 50 } },
      margin: { left: 18 },
      didDrawPage: () => {}
    });

    // Fecha del examen alineada a la derecha y formato dd/mm/yyyy
    y = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    if (datos.fecha) {
      const f = new Date(datos.fecha);
      const dia = String(f.getDate()).padStart(2, '0');
      const mes = String(f.getMonth() + 1).padStart(2, '0');
      const anio = f.getFullYear();
      doc.text(`${dia}/${mes}/${anio}`, pageW - margin, y, { align: 'right' });
    }
    y += 12;

    // Recuadros de firmas y huella
    const baseY = doc.lastAutoTable.finalY + 20;
    // Huella
    doc.rect(25, baseY, 28, 32);
    doc.setFontSize(10);
    doc.text('Huella', 39, baseY + 38, { align: 'center' });
    if (huellap) {
      const boxW = 28;
      const boxH = 32;
      const imgRatio = huellap.width / huellap.height;
      let imgW = boxW;
      let imgH = boxW / imgRatio;

      if (imgH > boxH) {
        imgH = boxH;
        imgW = boxH * imgRatio;
      }
      const imgX = 25 + (boxW - imgW) / 2;
      const imgY = baseY + (boxH - imgH) / 2;
      const canvas = document.createElement('canvas');
      canvas.width = huellap.width;
      canvas.height = huellap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(huellap, 0, 0);
      const huellaBase64 = canvas.toDataURL('image/png');
      doc.addImage(huellaBase64, 'PNG', imgX, imgY, imgW, imgH);
    }
    // Firma paciente
    doc.line(65, baseY + 32, 115, baseY + 32);
    doc.text('Firma del Paciente', 90, baseY + 38, { align: 'center' });
    if (firmap) {
      const firmaW = 50;
      const firmaH = (firmap.height / firmap.width) * firmaW;
      const firmaX = 65;
      const firmaY = baseY + 32 - firmaH - 1;

      const canvas = document.createElement('canvas');
      canvas.width = firmap.width;
      canvas.height = firmap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(firmap, 0, 0);
      const firmaBase64 = canvas.toDataURL('image/png');

      doc.addImage(firmaBase64, 'PNG', firmaX, firmaY, firmaW, firmaH);
    }
    // Firma consejero
    doc.line(135, baseY + 32, 185, baseY + 32);
    doc.text('Firma y sello del Consejero', 160, baseY + 38, { align: 'center' });
    if (sellop) {
      const selloW = 35;
      const selloH = (sellop.height / sellop.width) * selloW;
      const selloX = 160 - selloW / 2;
      const selloY = baseY + 32 - selloH - 1;

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
  .catch(err => {
    console.error(err);
    alert('Error generando PDF: ' + err);
  });
  
} 