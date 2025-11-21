import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CabeceraLogo from "../components/CabeceraLogo.jsx";
import footerTR from "../components/footerTR.jsx";
import drawColorBox from "../components/ColorBox.jsx";

export default function Consentimiento_Panel2D_Digitalizado(datos) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // Función para formatear fecha a DD/MM/YYYY
  const toDDMMYYYY = (fecha) => {
    if (!fecha) return '';
    if (fecha.includes('/')) return fecha; // ya está en formato correcto
    const [anio, mes, dia] = fecha.split('-');
    if (!anio || !mes || !dia) return fecha;
    return `${dia}/${mes}/${anio}`;
  };

  // Header con datos de ficha, sede y fecha
  const drawHeader = () => {
    CabeceraLogo(doc, { ...datos, tieneMembrete: false });
    
    // Número de Ficha
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);
    
    // Sede
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 20);
    
    // Fecha de examen
    const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || "");
    doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);
    
    // Página
    doc.text("Pag. 01", pageW - 30, 10);

    // Bloque de color
    drawColorBox(doc, {
      color: datos.codigoColor || "#008f39",
      text: datos.textoColor || "F",
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  };

  drawHeader();

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
    const margin = 15;

    // Título subrayado y negrita
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    // Primera línea del título
    doc.text('CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DOSAJE DE', pageW / 2, y, { align: 'center' });
    let wT1 = doc.getTextWidth('CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DOSAJE DE');
    let xT1 = (pageW - wT1) / 2;
    doc.setLineWidth(0.7);
    doc.line(xT1, y + 2, xT1 + wT1, y + 2);
    doc.setLineWidth(0.2);
    y += 10;
    // Segunda línea del título
    doc.text('MARIHUANA Y COCAÍNA', pageW / 2, y, { align: 'center' });
    let wT2 = doc.getTextWidth('MARIHUANA Y COCAÍNA');
    let xT2 = (pageW - wT2) / 2;
    doc.setLineWidth(0.7);
    doc.line(xT2, y + 2, xT2 + wT2, y + 2);
    doc.setLineWidth(0.2);
    // Separación igual que en muestra de sangre
    y += 12;
    doc.setFontSize(11);

    // Cuerpo del consentimiento con campos en negrita
    y += 10;
    const nombre = String(datos.nombres || '_________________________');
    const edad = String(datos.edad || '___');
    const dni = String(datos.dni || '__________');
    // Construir bloques de texto (normales y negrita)
    const bloques = [
      { text: 'Yo' + '\u00A0\u00A0', bold: false },
      { text: nombre, bold: true },
      { text: ', de ', bold: false },
      { text: edad, bold: true },
      { text: ' años de edad, identificado con DNI Nº ', bold: false },
      { text: dni, bold: true },
      { text: '; habiendo recibido consejería e información acerca de la prueba para Marihuana y Cocaína en orina; y en pleno uso de mis facultades mentales ', bold: false },
      { text: 'AUTORIZO', bold: true },
      { text: ' se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post - Test y mis resultados.', bold: false },
    ];
    const maxWidth = pageW - 2 * margin - 4;
    const interlineado = 7;
    // Algoritmo para armar líneas respetando bloques
    function armarLineas(bloques, maxWidth) {
      let lineas = [];
      let lineaActual = [];
      let anchoActual = 0;
      let espacio = doc.getTextWidth(' ');
      let i = 0;
      while (i < bloques.length) {
        let bloque = bloques[i];
        // Si el bloque es largo, partirlo en palabras
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
          // Bloque negrita o bloque sin espacios
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
    // Renderizar líneas justificadas
    let yBloque = y;
    const lineas = armarLineas(bloques, maxWidth);
    lineas.forEach((linea, idx) => {
      // Calcular ancho total de la línea
      const totalW = linea.reduce((sum, b) => sum + doc.getTextWidth(b.text), 0);
      // Contar espacios para justificar
      const espacios = linea.filter(b => !b.bold && /^\s+$/.test(b.text)).length;
      // Espacio extra para justificar (no en la última línea)
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
    y += lineas.length * interlineado + 10;

    // Antecedentes
    let antY = y + 12;
    doc.setFont(undefined, 'bold');
    doc.text('ANTECEDENTES:', 15, antY);
    antY += 6;
    doc.setFont(undefined, 'normal');
    
    function checkBox(checked) {
      // Usar espacios duros para igualar el ancho visual
      const filler = '\u00A0';
      return `(  ${checked ? 'X' : filler + filler}  )`;
    }
    
    function formatFechaLarga(fechaStr) {
      if (!fechaStr) return '';
      const f = new Date(fechaStr);
      const dia = f.getDate();
      const mes = f.getMonth();
      const anio = f.getFullYear();
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      return `${dia} de ${meses[mes]} de ${anio}`;
    }

    function formatFechaCorta(fechaStr) {
      if (!fechaStr) return '';
      const [anio, mes, dia] = fechaStr.split('-');
      return `${dia}/${mes}/${anio}`;
    }
    
    autoTable(doc, {
      startY: antY,
      body: [
        [
          'CONSUME MARIHUANA',
          `NO ${checkBox(!datos.antConsumeMarih)}`,
          `SI ${checkBox(datos.antConsumeMarih)}`,
          datos.antConsumeMarih && datos.fechaConsumeMarih
            ? `Cuando: ${formatFechaCorta(datos.fechaConsumeMarih)}`
            : ''
        ],
        [
          'CONSUMIO HOJA DE COCA EN LOS 7 DIAS PREVIOS',
          `NO ${checkBox(!datos.antConsumeHojaCoca)}`,
          `SI ${checkBox(datos.antConsumeHojaCoca)}`,
          datos.antConsumeHojaCoca && datos.fechaConsumoHojaCoca
            ? `Cuando: ${formatFechaCorta(datos.fechaConsumoHojaCoca)}`
            : ''
        ],
        [
          'CONSUME COCAÍNA',
          `NO ${checkBox(!datos.antConsumeCocacina)}`,
          `SI ${checkBox(datos.antConsumeCocacina)}`,
          datos.antConsumeCocacina && datos.fechaConsumeCocacina
            ? `Cuando: ${formatFechaCorta(datos.fechaConsumeCocacina)}`
            : ''
        ],
      ],
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 1 },
      columnStyles: { 
        0: { cellWidth: 100 }, 
        1: { cellWidth: 20 }, 
        2: { cellWidth: 20 },
        3: { cellWidth: 50 }
      },
      margin: { left: 18 },
      didDrawPage: () => {}
    });

    // Fecha del examen en la parte inferior
    y = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    if (datos.fecha) {
      const f = new Date(datos.fecha);
      const dia = f.getDate();
      const mes = f.getMonth();
      const anio = f.getFullYear();
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const rightMargin = 20; // margen derecho aumentado
      doc.text(`${datos.fecha}`, pageW - rightMargin, y, { align: 'right' });
    }
    y += 12;

    // Recuadros de firmas y huella
    const baseY = y + 10;

    // Firma paciente
    const lineX1P = 65;
    const lineX2P = 115;
    const lineYP = baseY + 32;
    const centerXP = (lineX1P + lineX2P) / 2;
    doc.line(lineX1P, lineYP, lineX2P, lineYP);
    doc.text('Firma del Paciente', centerXP, lineYP + 6, { align: 'center' });
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
    const lineX1 = 135;
    const lineX2 = 185;
    const lineY = baseY + 32;
    const centerX = (lineX1 + lineX2) / 2;
    doc.line(lineX1, lineY, lineX2, lineY);
    doc.text('Firma y sello del Consejero', centerX, lineY + 6, { align: 'center' });
    if (sellop) {
      const sigW = 70;
      const sigH = 30;
      const sigX = centerX - sigW / 2;
      const sigY = lineY - sigH;

      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;
      let imgW = sellop.width;
      let imgH = sellop.height;
      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1);
      imgW *= scale;
      imgH *= scale;
      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = sellop.width;
      canvas.height = sellop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(sellop, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    }
    footerTR(doc, datos);

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