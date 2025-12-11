import jsPDF from "jspdf";
import CabeceraLogo from "../components/CabeceraLogo.jsx";
import footerTR from "../components/footerTR.jsx";
import drawColorBox from "../components/ColorBox.jsx";
import { dibujarFirmas } from "../../utils/dibujarFirmas.js";

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

  // Contenido del documento

    const margin = 15;
    let y        = 44;
    // ─── 1) TÍTULO CON SUBRAYADO (más fino y más compacto) ─────
    doc.setFont('helvetica', 'bold').setFontSize(13);

    // Primera línea del título
    const titulo1 = 'CONSENTIMIENTO INFORMADO PARA LA';
    doc.text(titulo1, pageW / 2, y, { align: 'center' });

    const wT1 = doc.getTextWidth(titulo1);
    const xT1 = (pageW - wT1) / 2;

    // Línea muy fina (0.4 pt) y muy cerca del texto
    doc.setLineWidth(0.4);
    doc.line(xT1, y + 1, xT1 + wT1, y + 1);   // solo 1 mm debajo del texto

    y += 8;   // menos espacio entre las dos líneas del título

    // Segunda línea del título
    const titulo2 = 'TOMA DE MUESTRA DE SANGRE';
    doc.text(titulo2, pageW / 2, y, { align: 'center' });

    const wT2 = doc.getTextWidth(titulo2);
    const xT2 = (pageW - wT2) / 2;

    doc.setLineWidth(0.4);                     // línea fina también aquí
    doc.line(xT2, y + 1, xT2 + wT2, y + 1);   // pegada al texto

    // Espacio final mucho más reducido antes del siguiente bloque
    y += 20;   // antes tenías 18, ahora solo 12 (ajusta a gusto: 10-14 queda bien)

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
    // doc.setFont('helvetica','normal').setFontSize(10);
    // if (datos.fecha) {
    //   const rightMargin = 20;
    //   doc.text(`${datos.fecha}`, pageW - rightMargin, y, { align: 'right' });
    // }
    // y += 15;

    // ─── 5) FIRMA Y HUELLA DEL PACIENTE, FIRMA Y SELLO DEL PROFESIONAL ────────────────────
    const baseY = y + 70;

    // Usar helper para dibujar firmas
    dibujarFirmas({ doc, datos, y: baseY, pageW }).then(() => {
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
    }).catch(err => {
      console.error(err);
      alert('Error generando PDF: ' + err);
    });
}
