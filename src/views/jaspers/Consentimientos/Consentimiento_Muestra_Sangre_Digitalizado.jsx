import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CabeceraLogo from "../components/CabeceraLogo.jsx";
import footerTR from "../components/footerTR.jsx";
import drawColorBox from "../components/ColorBox.jsx";

export default function Consentimiento_Muestra_Sangre_Digitalizado(datos) {
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
      color: datos.codigoColor,
      text: datos.textoColor,
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  };

  drawHeader();

  // Carga de imágenes (huella, firma, sello)
  const digitalizacion = datos.digitalizacion || [];
  const huella = digitalizacion.find(d => d.nombreDigitalizacion === "HUELLA");
  const firma  = digitalizacion.find(d => d.nombreDigitalizacion === "FIRMAP");
  const sello  = digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
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
      { text: 'Yo  ', bold: false },
      { text: nombre, bold: true },
      { text: ', de ', bold: false },
      { text: edad, bold: true },
      { text: ' años de edad, identificado con DNI N° ', bold: false },
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
      const f = new Date(datos.fecha);
      const dia = f.getDate();
      const mes = f.getMonth();
      const anio = f.getFullYear();
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const rightMargin = 20;
      doc.text(`${datos.fecha}`, pageW - rightMargin, y, { align: 'right' });
    }
    y += 15;

    // ─── 5) FIRMA Y HUELLA DEL PACIENTE, FIRMA Y SELLO DEL PROFESIONAL ────────────────────
    const baseY = y + 50;
    const firmaY = baseY + 3;

    // Verificar si hay sello del médico para decidir el layout
    const tieneSelloMedico = sellop !== null;

    if (tieneSelloMedico) {
      // === LAYOUT CON DOS COLUMNAS (Paciente y Médico) ===
      const anchoColumna = 60;
      const espacioEntreColumnas = 20;
      const totalAncho = (anchoColumna * 2) + espacioEntreColumnas;
      const inicioX = (pageW - totalAncho) / 2;
      
      // === COLUMNA 1: FIRMA Y HUELLA DEL PACIENTE ===
      const centroColumna1X = inicioX + (anchoColumna / 2);
      
      // Altura máxima para alinear ambas secciones (usar la del sello del médico)
      const alturaMaxima = 28;
      
      // Agregar firma del paciente (izquierda)
      if (firmap) {
        try {
          const imgWidth = 30;
          const imgHeight = 20;
          const x = centroColumna1X - 20;
          const canvas = document.createElement('canvas');
          canvas.width = firmap.width;
          canvas.height = firmap.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(firmap, 0, 0);
          const firmaBase64 = canvas.toDataURL('image/png');
          doc.addImage(firmaBase64, 'PNG', x, firmaY, imgWidth, imgHeight);
        } catch (error) {
          console.log("Error cargando firma del paciente:", error);
        }
      }
      
      // Agregar huella del paciente (derecha de la firma)
      if (huellap) {
        try {
          const imgWidth = 12;
          const imgHeight = 20;
          const x = centroColumna1X + 10;
          const canvas = document.createElement('canvas');
          canvas.width = huellap.width;
          canvas.height = huellap.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(huellap, 0, 0);
          const huellaBase64 = canvas.toDataURL('image/png');
          doc.addImage(huellaBase64, 'PNG', x, firmaY, imgWidth, imgHeight);
        } catch (error) {
          console.log("Error cargando huella del paciente:", error);
        }
      }
      
      // Línea de firma debajo de las imágenes (alineada con la del médico)
      const lineY = firmaY + alturaMaxima + 3; // Misma altura que la del médico
      doc.setLineWidth(0.2);
      doc.line(centroColumna1X - 30, lineY, centroColumna1X + 30, lineY);
      
      // Texto "Firma y Huella del Paciente" centrado
      doc.setFont('helvetica', 'normal').setFontSize(9);
      doc.text("Firma y Huella del Paciente", centroColumna1X, lineY + 6, { align: "center" });

      // === COLUMNA 2: FIRMA Y SELLO DEL PROFESIONAL ===
      const centroColumna2X = inicioX + anchoColumna + espacioEntreColumnas + (anchoColumna / 2);
      
      // Agregar sello y firma del profesional
      if (sellop) {
        try {
          const sigW = 55;
          const sigH = alturaMaxima;
          const sigX = centroColumna2X - sigW / 2;
          const sigY = firmaY;

          const maxImgW = sigW - 5;
          const maxImgH = sigH - 5;
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
        } catch (error) {
          console.log("Error cargando sello del profesional:", error);
        }
      }
      
      // Línea de firma debajo de la imagen (alineada con la del paciente)
      doc.setLineWidth(0.2);
      doc.line(centroColumna2X - 30, lineY, centroColumna2X + 30, lineY);
      
      // Texto "Sello y Firma del Médico" y "Responsable de la Evaluación"
      doc.setFont('helvetica', 'normal').setFontSize(9);
      doc.text("Sello y Firma del Médico", centroColumna2X, lineY + 6, { align: "center" });
      doc.text("Responsable de la Evaluación", centroColumna2X, lineY + 10, { align: "center" });
    } else {
      // === LAYOUT CON UNA SOLA COLUMNA CENTRADA (Solo Paciente) ===
      const centroColumnaX = pageW / 2;
      
      // Agregar firma del paciente (izquierda)
      if (firmap) {
        try {
          const imgWidth = 30;
          const imgHeight = 20;
          const x = centroColumnaX - 20;
          const canvas = document.createElement('canvas');
          canvas.width = firmap.width;
          canvas.height = firmap.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(firmap, 0, 0);
          const firmaBase64 = canvas.toDataURL('image/png');
          doc.addImage(firmaBase64, 'PNG', x, firmaY, imgWidth, imgHeight);
        } catch (error) {
          console.log("Error cargando firma del paciente:", error);
        }
      }
      
      // Agregar huella del paciente (derecha de la firma)
      if (huellap) {
        try {
          const imgWidth = 12;
          const imgHeight = 20;
          const x = centroColumnaX + 10;
          const canvas = document.createElement('canvas');
          canvas.width = huellap.width;
          canvas.height = huellap.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(huellap, 0, 0);
          const huellaBase64 = canvas.toDataURL('image/png');
          doc.addImage(huellaBase64, 'PNG', x, firmaY, imgWidth, imgHeight);
        } catch (error) {
          console.log("Error cargando huella del paciente:", error);
        }
      }
      
      // Línea de firma debajo de las imágenes
      const lineYP = firmaY + 22;
      doc.setLineWidth(0.2);
      doc.line(centroColumnaX - 30, lineYP, centroColumnaX + 30, lineYP);
      
      // Texto "Firma y Huella del Paciente" centrado
      doc.setFont('helvetica', 'normal').setFontSize(9);
      doc.text("Firma y Huella del Paciente", centroColumnaX, lineYP + 6, { align: "center" });
    }

    footerTR(doc, datos);

    // ─── 6) Imprimir ───────────────────────────────────
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
