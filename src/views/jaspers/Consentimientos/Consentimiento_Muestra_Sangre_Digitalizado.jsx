import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerConsentimiento from "../components/headerConsentimiento";
import footer from "../components/footer";

export default function Consentimiento_Muestra_Sangre_Digitalizado(datos) {
  const doc = new jsPDF();
  headerConsentimiento(doc, datos);

  // Carga de imágenes (huella, firma, sello)
  const huella = datos.digitalizacion.find(d => d.nombreDigitalizacion === "HUELLA");
  const firma  = datos.digitalizacion.find(d => d.nombreDigitalizacion === "FIRMAP");
  const sello  = datos.digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const isValid = url => url && url !== "Sin registro";
  const loadImg = src =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src; img.crossOrigin = 'anonymous';
      img.onload  = () => res(img);
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });

  Promise.all([
    isValid(huella?.url) ? loadImg(huella.url) : Promise.resolve(null),
    isValid(firma?.url)  ? loadImg(firma.url)  : Promise.resolve(null),
    isValid(sello?.url)  ? loadImg(sello.url)  : Promise.resolve(null)
  ]).then(([huellap, firmap, sellop]) => {

    const pageW  = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y        = 44;

    // ─── 1) TÍTULO CON SUBRAYADO ─────────────────────────
    const titulo = 'CONSENTIMIENTO INFORMADO PARA LA TOMA DE MUESTRA DE SANGRE';
    doc.setFont('helvetica','bold').setFontSize(14);
    doc.text(titulo, pageW/2, y, { align:'center' });
    // Subrayado (línea recta debajo del título)
    const wT = doc.getTextWidth(titulo);
    const xT = (pageW - wT) / 2;
    doc.setLineWidth(0.7);
    doc.line(xT, y + 2, xT + wT, y + 2);
    doc.setLineWidth(0.2);

    y += 18;
    doc.setFontSize(11);

    // ─── 2) PREPARAR DATOS Y TEXTO ────────────────────
    const nombre  = String(datos.nombres  || '_________________________').trim();
    const edad    = String(datos.edad     || '___').trim();
    const dni     = String(datos.dni      || '__________').trim();
    const empresa = String(datos.empresa  || '_________________________').trim();

    // Construir bloques de texto (normales y negrita)
    const bloques = [
      { text: 'Yo ', bold: false },
      { text: nombre, bold: true },
      { text: ', de ', bold: false },
      { text: edad, bold: true },
      { text: ' años de edad, identificado con DNI nº ', bold: false },
      { text: dni, bold: true },
      { text: '; habiendo recibido consejería e información acerca de los exámenes en sangre que se me va a realizar según solicitud del protocolo médico de la empresa ', bold: false },
      { text: empresa, bold: true },
      { text: '; y en pleno uso de mis facultades mentales ', bold: false },
      { text: 'AUTORIZO', bold: true },
      { text: ' se me tome la muestra de sangre para cumplir con los exámenes pertinentes.', bold: false },
    ];
    const maxWidth = pageW - 2 * margin;
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
    let yL = y;
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
        doc.text(b.text, x, yL);
        let w = doc.getTextWidth(b.text);
        if (!b.bold && /^\s+$/.test(b.text) && extraSpace) {
          x += w + extraSpace;
        } else {
          x += w;
        }
      });
      yL += interlineado;
    });
    y = yL + 3;

    // ─── 4) FECHA ─────────────────────────────────────
    doc.setFont('helvetica','normal').setFontSize(10);
    if (datos.fecha) {
      const f   = new Date(datos.fecha);
      const dia = String(f.getDate()).padStart(2,'0');
      const mes = String(f.getMonth()+1).padStart(2,'0');
      const anio= f.getFullYear();
      doc.text(`${dia}/${mes}/${anio}`, pageW - margin, y, { align:'right' });
    }
    y += 15;

    // ─── 5) HUELLA, FIRMAS Y SELLO ────────────────────
    const baseY = y + 18;

    // Huella
    doc.rect(25, baseY, 28, 32)
       .setFontSize(10)
       .text('Huella', 39, baseY+38, { align:'center' });
    if (huellap) {
      const maxW=28, maxH=32;
      let hW=maxW, hH=(huellap.height/huellap.width)*hW;
      if (hH>maxH){hH=maxH;hW=(huellap.width/huellap.height)*hH;}
      const xH=25+(maxW-hW)/2, yH=baseY+(maxH-hH)/2;
      const cv= document.createElement('canvas');
      cv.width=huellap.width;cv.height=huellap.height;
      cv.getContext('2d').drawImage(huellap,0,0);
      doc.addImage(cv.toDataURL('image/png'),'PNG',xH,yH,hW,hH);
    }

    // Firma paciente
    doc.line(65, baseY+32,115,baseY+32)
       .text('Firma del Paciente',90,baseY+38,{align:'center'});
    if (firmap) {
      const fW=40, fH=(firmap.height/firmap.width)*fW;
      const xF=70+(50-fW)/2, yF=baseY+32-fH-2;
      const cvf=document.createElement('canvas');
      cvf.width=firmap.width;cvf.height=firmap.height;
      cvf.getContext('2d').drawImage(firmap,0,0);
      doc.addImage(cvf.toDataURL('image/png'),'PNG',xF,yF,fW,fH);
    }

    // Firma y sello consejero
    doc.line(135, baseY+32,185,baseY+32)
       .text('Firma y sello del Consejero',160,baseY+38,{align:'center'});
    if (sellop) {
      const sW=35, sH=(sellop.height/sellop.width)*sW;
      const xS=135+(50-sW)/2, yS=baseY+32-sH-2;
      const cvs=document.createElement('canvas');
      cvs.width=sellop.width;cvs.height=sellop.height;
      cvs.getContext('2d').drawImage(sellop,0,0);
      doc.addImage(cvs.toDataURL('image/png'),'PNG',xS,yS,sW,sH);
    }

    footer(doc, datos);

    // ─── 6) IMPRIMIR ───────────────────────────────────
    const blob = doc.output("blob");
    const url  = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    };

  });
}
