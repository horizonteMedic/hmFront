import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerConsentimiento from "./header/headerConsentimiento.jsx";
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
    let fechaStr = datos.fecha || '';
    if (datos.fecha) {
      const [anio, mes, dia] = datos.fecha.split('-');
      fechaStr = `${dia}/${mes}/${anio}`;
    }
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
        cellPadding: 0.5,
        lineWidth: 0.1,
        lineColor: [0,0,0],
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [255,255,255],
        textColor: [0,0,0],
        fontStyle: 'bold',
        lineWidth: 0.1,
        lineColor: [0,0,0],
      },
      bodyStyles: {
        fillColor: [255,255,255],
        textColor: [0,0,0],
        lineWidth: 0.1,
        lineColor: [0,0,0],
      },
      tableLineWidth: 0.1,
      tableLineColor: [0,0,0],
      margin: { left: (pageW - 150) / 2, right: (pageW - 150) / 2 }, // Centrado, ancho aprox 150
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
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
      { text: 'Yo  ', bold: false },
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
      doc.text('¿Cuál (es):', margin + 130, y);
      doc.text(`${datos.critCualAlgunaEnfermedad || ''}`, margin + 150, y);
    }
    y += 5;
    // Medicamento
    doc.text('- ¿Consume regularmente algún medicamento?', margin, y);
    doc.text(`SI ( ${datos.antBoroAlgunMedicamento ? 'X' : ' '} )`, margin + 92, y);
    doc.text(`NO ( ${!datos.antBoroAlgunMedicamento ? 'X' : ' '} )`, margin + 110, y);
    if (datos.antBoroAlgunMedicamento) {
      doc.text('¿Cuál (es):', margin + 130, y);
      doc.text(`${datos.critCualAlgunMedicamento || ''}`, margin + 150, y);
    }
    y += 5;
    // Mate de coca
    doc.text('- ¿Consume regularmente mate de coca?', margin, y);
    doc.text(`SI ( ${datos.antBoroConsumenMateCoca ? 'X' : ' '} )`, margin + 92, y);
    doc.text(`NO ( ${!datos.antBoroConsumenMateCoca ? 'X' : ' '} )`, margin + 110, y);
    y += 5;
    if (datos.antBoroConsumenMateCoca) {
      let fechaMate = datos.critFechaConsumoMateCoca || '';
      if (fechaMate && !isNaN(Date.parse(fechaMate))) {
        const f = new Date(fechaMate);
        const dia = String(f.getDate()).padStart(2, '0');
        const mes = String(f.getMonth() + 1).padStart(2, '0');
        const anio = f.getFullYear();
        fechaMate = `${datos.antBoroConsumenMateCoca}`;
      }
      const textoCompleto = `Si la respuesta es SI: ¿Cuándo consumió por última vez?     Fecha:   ${datos.critFechaConsumoMateCoca}`;
      doc.text(textoCompleto, margin, y);
      y += 7;
    } else {
      y += 2;
    }
    // Hoja de coca
    doc.text('- ¿Consume o mastica hoja de coca?', margin, y);
    doc.text(`SI ( ${datos.masticaHojaCoca ? 'X' : ' '} )`, margin + 92, y);
    doc.text(`NO ( ${!datos.masticaHojaCoca ? 'X' : ' '} )`, margin + 110, y);
    if (datos.masticaHojaCoca && datos.fechaConsumoHojaCoca) {
      doc.text('Cuando:', margin + 130, y);
      let fechaHoja = datos.fechaConsumoHojaCoca;
      if (fechaHoja && !isNaN(Date.parse(fechaHoja))) {
        const f = new Date(fechaHoja);
        const dia = String(f.getDate()).padStart(2, '0');
        const mes = String(f.getMonth() + 1).padStart(2, '0');
        const anio = f.getFullYear();
        fechaHoja = `${datos.fechaConsumoHojaCoca}`;
      }
      doc.text(`${fechaHoja}`, margin + 150, y);
    }
    y += 5;
    // Texto justificado para la pregunta larga
    const hojaMsg = 'Si la respuesta es SI, se procederá a reprogramar la toma de la muestra en 5 días, caso contrario se tomará la muestra bajo responsabilidad del paciente.';
    const hojaLines = doc.splitTextToSize(hojaMsg, pageW - 2 * margin - 4);
    hojaLines.forEach(line => {
      doc.text(line, margin, y);
      y += 6;
    });
    y += 1;
    // Espacio extra entre preguntas largas
    y += 5;
    // Tratamiento quirúrgico/dental
    doc.text('- ¿Se realizó algún tratamiento quirúrgico o dental en las últimas 48 horas?', margin, y);
    doc.text(`SI ( ${datos.antBoroTratQuirugODental ? 'X' : ' '} )`, margin + 139, y);
    doc.text(`NO ( ${!datos.antBoroTratQuirugODental ? 'X' : ' '} )`, margin + 155, y); 
    y += 5;
    // Texto justificado para la pregunta larga
    const tratMsg = 'Si la respuesta es SI, indicar qué tratamiento se realizó, cual es nombre del cirujano, donde y cuando se realizó dicho procedimiento o tratamiento';
    const tratLines = doc.splitTextToSize(tratMsg, pageW - 2 * margin - 4);
    tratLines.forEach(line => {
      doc.text(line, margin, y);
      y += 6;
    });
    y += 1;
    // Mostrar bloque con etiquetas y respuestas pegadas y alineadas a la derecha, todo en negrita
    let yCampos = y;
    const rightX = pageW - margin;
    const etiquetaX = rightX - 40;
    const respuestaX = etiquetaX + 5;
    doc.setFont('helvetica', 'bold');
    doc.text('CUAL', etiquetaX, yCampos, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(':', etiquetaX + 2, yCampos);
    doc.text(`${datos.critCualTratQuirugODental || ''}`, respuestaX, yCampos);

    yCampos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('DONDE', etiquetaX, yCampos, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(':', etiquetaX + 2, yCampos);
    doc.text(`${datos.critDondeTratQuirugODental || ''}`, respuestaX, yCampos);

    yCampos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('CUANDO', etiquetaX, yCampos, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(':', etiquetaX + 2, yCampos);
    doc.text(`${datos.critCuandoTratQuirugODental || ''}`, respuestaX, yCampos);
    y = yCampos + 2;

    // Fecha del examen en la parte inferior
    y += 10;
    doc.setFont('helvetica', 'normal');
    
    y += 2;

    // Más espacio antes de la firma y huella
    y +=2;

    // Línea horizontal antes del texto de firma
    const firmaText = 'Firma y Huella del trabajador / paciente evaluado';
    const firmaTextWidth = doc.getTextWidth(firmaText);
    const lineX1P = 18;
    const lineX2P = 18 + firmaTextWidth;
    const lineYP = y - 4;
    const centerXP = (lineX1P + lineX2P) / 2;
    doc.setDrawColor(100);
    doc.line(lineX1P, lineYP, lineX2P, lineYP);
    doc.setFont(undefined, 'bold');
    doc.text(firmaText, centerXP, y, { align: 'center' });

    // Firma paciente centrada sobre la línea
    if (firmap) {
      const sigW = 70;
      const sigH = 30;
      const sigX = centerXP - sigW / 2;
      const sigY = lineYP - sigH;

      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;
      let imgW = firmap.width;
      let imgH = firmap.height;
      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1);
      imgW *= scale;
      imgH *= scale;
      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = firmap.width;
      canvas.height = firmap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(firmap, 0, 0);
      const firmaBase64 = canvas.toDataURL('image/png');
      doc.addImage(firmaBase64, 'PNG', imgX, imgY, imgW, imgH);
    }

    // Huella (sin cambios)
    if (huellap) {
      const huellaW = 16;
      const huellaH = (huellap.height / huellap.width) * huellaW;
      const huellaX = 18 + firmaTextWidth * 0.75 - huellaW / 2;
      const huellaY = lineYP - huellaH - 2;

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
    // Definir variables para nombre y DNI del testigo
    const nombreTestigo = datos.usuarioRegistrado || '______________________________';
    const dniTestigo = String(datos.dniUsuario) || '__________';
    // Mostrar solo Nombre Completo y DNI debajo de la firma del testigo
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    // Nombre Completo
    doc.text(`Nombre Completo:`, 100, y + 4);
    doc.line(125, y + 4.5, 175, y + 4.5); // Línea para el nombre
    doc.text(nombreTestigo, 127, y + 3.8); // El valor encima de la línea

    // DNI
    doc.text(`DNI:`, 100, y + 9);
    doc.line(110, y + 9.5, 140, y + 9.5); // Línea para el DNI
    doc.text(dniTestigo, 112, y + 8.8); // El valor encima de la línea
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