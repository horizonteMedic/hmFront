import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerConsentimiento from "../components/headerConsentimiento";
import footer from "../components/footer";

export default function Consentimiento_Boro_Digitalizado(datos) {
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

    // Título principal subrayado
    doc.setFont(undefined, 'bold');
    doc.setFontSize(13);
    // Primera línea del título
    doc.text('AUTORIZACIÓN DE EXAMEN DE DROGAS', pageW / 2, y, { align: 'center' });
    let wT1 = doc.getTextWidth('AUTORIZACIÓN DE EXAMEN DE DROGAS');
    let xT1 = (pageW - wT1) / 2;
    doc.setLineWidth(0.7);
    doc.line(xT1, y + 2, xT1 + wT1, y + 2);
    doc.setLineWidth(0.2);
    y += 10;
  

    // Encabezado de datos principales
    y += 2;
    // Tabla centrada para Fecha, Hora, Ciudad
    const fechaStr = datos.fecha || '';
    const horaStr = datos.horaExamen || '';
    const ciudadStr = datos.sede || '';
    autoTable(doc, {
      startY: y,
      head: [[
        { content: 'Fecha', styles: { halign: 'center', fontStyle: 'bold' } },
        { content: 'Hora', styles: { halign: 'center', fontStyle: 'bold' } },
        { content: 'Ciudad', styles: { halign: 'center', fontStyle: 'bold' } }
      ]],
      body: [[
        { content: fechaStr, styles: { halign: 'center' } },
        { content: horaStr, styles: { halign: 'center' } },
        { content: ciudadStr, styles: { halign: 'center' } }
      ]],
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        lineWidth: 0.2,
        lineColor: [180,180,180],
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [255,255,255],
        textColor: [0,0,0],
        fontStyle: 'bold',
        lineWidth: 0.5,
        lineColor: [180,180,180],
      },
      bodyStyles: {
        fillColor: [255,255,255],
        textColor: [0,0,0],
        lineWidth: 0.2,
        lineColor: [180,180,180],
      },
      tableLineWidth: 0.2,
      tableLineColor: [180,180,180],
      margin: { left: (pageW - 120) / 2, right: (pageW - 120) / 2 }, // Centrado, ancho aprox 120
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
      },
      didDrawPage: (data) => {
        y = data.cursor.y + 2;
      }
    });
    y += 4;

    // Nombre y datos personales en negrita
    y += 1;
    // Bloques dinámicos en negrita y justificado
    doc.setFontSize(10);  // Establecemos 10pt como tamaño base para todo el documento
    const nombre = String(datos.nombres || '_________________________');
    const edad = String(datos.edad || '___');
    const dni = String(datos.dni || '__________');
    const empresa = String(datos.empresa || '_________________________');
    const trabajador = datos.trabajador ? 'X' : ' ';
    const postulante = datos.postulante ? 'X' : ' ';
    const bloques = [
      { text: 'Yo ', bold: false },
      { text: nombre, bold: true },
      { text: ' de ', bold: false },
      { text: edad, bold: true },
      { text: ' años de edad, con documento de identidad N° ', bold: false },
      { text: dni, bold: true },
      { text: ' trabajador ( ', bold: false },
      { text: trabajador, bold: true },
      { text: ' ) o postulante ( ', bold: false },
      { text: postulante, bold: true },
      { text: ' ), de la empresa ', bold: false },
      { text: empresa, bold: true },
      { text: ', autorizo al POLICLINICO HORIZONTE MEDIC, para que se me realice el examen toxicológico de drogas en orina y/o saliva, según los protocolos establecidos y que los resultados se entreguen directamente a la empresa.', bold: false },
    ];
    const maxWidth = pageW - 2 * margin - 4;
    const interlineado = 5;
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
    y = yBloque + 4;

    // Preguntas
    doc.setFont(undefined, 'normal');
    // Texto justificado para la introducción de preguntas
    const introPreg = 'Además, declaro que la información que brindaré a continuación es verdadera:';
    const introPregLines = doc.splitTextToSize(introPreg, pageW - 2 * margin - 4);
    introPregLines.forEach(line => {
      doc.text(line, margin, y);
      y += 4;
    });
    y += 1;
    // Enfermedad
    doc.text('- ¿Sufre alguna enfermedad?', margin, y);
    doc.text(`SI ( ${datos.antBoroAlgunaEnfermedad ? 'X' : ' '} )`, margin + 92, y);
    doc.text(`NO ( ${!datos.antBoroAlgunaEnfermedad ? 'X' : ' '} )`, margin + 110, y);
    if (datos.antBoroAlgunaEnfermedad) {
      doc.text('¿Cuál (es):', margin + 145, y);
      doc.text(`${datos.critCualAlgunaEnfermedad || ''}`, margin + 168, y);
    }
    y += 5;
    // Medicamento
    doc.text('- ¿Consume regularmente algún medicamento?', margin, y);
    doc.text(`SI ( ${datos.antBoroAlgunMedicamento ? 'X' : ' '} )`, margin + 92, y);
    doc.text(`NO ( ${!datos.antBoroAlgunMedicamento ? 'X' : ' '} )`, margin + 110, y);
    if (datos.antBoroAlgunMedicamento) {
      doc.text('¿Cuál (es):', margin + 145, y);
      doc.text(`${datos.critCualAlgunMedicamento || ''}`, margin + 168, y);
    }
    y += 5;
    // Mate de coca
    doc.text('- ¿Consume regularmente mate de coca?', margin, y);
    doc.text(`SI ( ${datos.antBoroConsumenMateCoca ? 'X' : ' '} )`, margin + 92, y);
    doc.text(`NO ( ${!datos.antBoroConsumenMateCoca ? 'X' : ' '} )`, margin + 110, y);
    y += 5;
    // Texto justificado para la pregunta larga
    const mateMsg = 'Si la respuesta es SI: ¿Cuándo consumió por última vez?';
    const mateLines = doc.splitTextToSize(mateMsg, pageW - 2 * margin - 4);
    mateLines.forEach(line => {
      doc.text(line, margin, y);
      y += 4;
    });
    if (datos.antBoroConsumenMateCoca) {
      doc.text('CUANDO:', margin + 7, y);
      doc.text(`${datos.critFechaConsumoMateCoca || ''}`, margin + 32, y);
      y += 7;
    } else {
      y += 2;
    }
    // Hoja de coca
    doc.text('- ¿Consume o mastica hoja de coca?', margin, y);
    doc.text(`SI ( ${datos.masticaHojaCoca ? 'X' : ' '} )`, margin + 92, y);
    doc.text(`NO ( ${!datos.masticaHojaCoca ? 'X' : ' '} )`, margin + 110, y);
    if (datos.masticaHojaCoca && datos.fechaConsumoHojaCoca) {
      doc.text(`CUANDO: ${datos.fechaConsumoHojaCoca}`, margin + 145, y);
    }
    y += 5;
    // Texto justificado para la pregunta larga
    const hojaMsg = 'Si la respuesta es SI, se procederá a reprogramar la toma de la muestra en 5 días, caso contrario se tomará la muestra bajo responsabilidad del paciente.';
    const hojaLines = doc.splitTextToSize(hojaMsg, pageW - 2 * margin - 4);
    hojaLines.forEach(line => {
      doc.text(line, margin, y);
      y += 4;
    });
    y += 1;
    // Tratamiento quirúrgico/dental
    doc.text('- ¿Se realizó algún tratamiento quirúrgico o dental en las últimas 48 horas?', margin, y);
    doc.text(`SI ( ${datos.antBoroTratQuirugODental ? 'X' : ' '} )`, margin + 142, y);
    doc.text(`NO ( ${!datos.antBoroTratQuirugODental ? 'X' : ' '} )`, margin + 160, y);
    y += 5;
    // Texto justificado para la pregunta larga
    const tratMsg = 'Si la respuesta es SI, indicar qué tratamiento se realizó, cual es nombre del cirujano, donde y cuando se realizó dicho procedimiento o tratamiento';
    const tratLines = doc.splitTextToSize(tratMsg, pageW - 2 * margin - 4);
    tratLines.forEach(line => {
      doc.text(line, margin, y);
      y += 4;
    });
    y += 1;
    // Mostrar bloque apilado a la derecha para Cual, Donde, Cuando
    const rightMargin = pageW - margin;
    let yCampos = y;
    // Cual
    doc.setFont('helvetica', 'normal');
    doc.text('Cual:', rightMargin - 60, yCampos, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(`${datos.critCualTratQuirugODental || ''}`, rightMargin, yCampos, { align: 'right' });
    yCampos += 5;
    // Donde
    const dondeValue = `${datos.critDondeTratQuirugODental || ''}`;
    doc.setFont('helvetica', 'normal');
    doc.text('Donde:', rightMargin - 60, yCampos, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(dondeValue, rightMargin, yCampos, { align: 'right' });
    yCampos += 5;
    // Cuando
    doc.setFont('helvetica', 'normal');
    doc.text('Cuando:', rightMargin - 60, yCampos, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(`${datos.critCuandoTratQuirugODental || ''}`, rightMargin, yCampos, { align: 'right' });
    y = yCampos + 2;

    // Fecha del examen en la parte inferior
    y += 10;
    doc.setFont('helvetica', 'normal');
    if (datos.fecha) {
      const f = new Date(datos.fecha);
      const dia = String(f.getDate()).padStart(2, '0');
      const mes = String(f.getMonth() + 1).padStart(2, '0');
      const anio = f.getFullYear();
      doc.text(`${dia}/${mes}/${anio}`, pageW - margin, y, { align: 'right' });
    }
    y += 2;

    // Más espacio antes de la firma y huella
    y +=2;

    // Línea horizontal antes del texto de firma
    const firmaText = 'Firma y Huella del trabajador / paciente evaluado';
    const firmaTextWidth = doc.getTextWidth(firmaText);
    const lineaBaseY = y - 4;
    doc.setDrawColor(100);
    doc.line(18, lineaBaseY, 18 + firmaTextWidth, lineaBaseY);
    doc.setFont(undefined, 'bold');
    doc.text(firmaText, 18, y);

    // Firma primero, luego huella
    if (firmap) {
      const firmaW = 26;
      const firmaH = (firmap.height / firmap.width) * firmaW;
      const firmaX = 18 + firmaTextWidth * 0.25 - firmaW / 2;
      const firmaY = lineaBaseY - firmaH - 2;

      const canvas = document.createElement('canvas');
      canvas.width = firmap.width;
      canvas.height = firmap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(firmap, 0, 0);
      const firmaBase64 = canvas.toDataURL('image/png');
      doc.addImage(firmaBase64, 'PNG', firmaX, firmaY, firmaW, firmaH);
    }

    if (huellap) {
      const huellaW = 16;
      const huellaH = (huellap.height / huellap.width) * huellaW;
      const huellaX = 18 + firmaTextWidth * 0.75 - huellaW / 2;
      const huellaY = lineaBaseY - huellaH - 2;

      const canvas = document.createElement('canvas');
      canvas.width = huellap.width;
      canvas.height = huellap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(huellap, 0, 0);
      const huellaBase64 = canvas.toDataURL('image/png');
      doc.addImage(huellaBase64, 'PNG', huellaX, huellaY, huellaW, huellaH);
    }

    // Notas como cuadro
    y += 10;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);  // Aseguramos que las notas también estén en 10pt
    doc.text('Notas:', 18, y);
    const notas = datos.notas || '';
    const notasLines = doc.splitTextToSize(notas, 170);
    doc.setDrawColor(100);
    doc.rect(35, y - 5, 160, notasLines.length * 6 + 5);
    doc.text(notasLines, 40, y, { maxWidth: 150, align: 'justify' });

    //sello
    y += 31
    const SelloText = 'Firma del testigo o responsable de la toma de muestra';
    const SelloTextWidth = doc.getTextWidth(SelloText);
    const SellolineaBaseY = y - 4;
    doc.setDrawColor(100);
    doc.line(100, SellolineaBaseY, 100 + SelloTextWidth, SellolineaBaseY);
    doc.setFont(undefined, 'bold');
    doc.text(SelloText, 100, y);
    if (sellop) {
      const selloW = 50;
      const selloH = (sellop.height / sellop.width) * selloW;
      const selloX = 100 + (SelloTextWidth - selloW) / 2;
      const selloY = SellolineaBaseY - selloH - 2;

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