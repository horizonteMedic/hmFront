import jsPDF from "jspdf";
import { formatearFechaCorta, formatearFechaLarga } from "../../../utils/formatDateUtils.js";
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from "../../../utils/dibujarFirmas.js";
import { compressImage } from "../../../utils/helpers.js";

export default async function ConsentAdmisionExamenMedicoPeru(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Preparar datos
  const datosFinales = {
    apellidosNombres: String(((data?.apellidosPaciente ?? '') + ' ' + (data?.nombresPaciente ?? '')).trim()),
    fechaExamen: formatearFechaCorta(data?.fechaRegistro ?? ''),
    documentoIdentidad: String(data?.dniPaciente ?? ''),
    domicilio: String(data?.direccionPaciente || ''),
    distrito: String(data?.distrito || ''),
    provincia: String(data?.provincia || ''),
    sede: String(data?.sede ?? data?.nombreSede ?? ''),
    numeroFicha: String(data?.norden ?? ''),
    codigoColor: String(data?.codigoColor ?? ''),
    textoColor: String(data?.textoColor ?? ''),
  };

  // Función para obtener día y mes de la fecha
  const obtenerDiaYMes = (fechaStr) => {
    if (!fechaStr) return { dia: '', mes: '' };
    try {
      const fechaLarga = formatearFechaLarga(fechaStr);
      // formatearFechaLarga devuelve: "28 de enero de 2025"
      const partes = fechaLarga.split(' de ');
      if (partes.length >= 2) {
        return { dia: partes[0], mes: partes[1] };
      }
      return { dia: '', mes: '' };
    } catch (error) {
      return { dia: '', mes: '' };
    }
  };

  const { dia, mes } = obtenerDiaYMes(data?.fechaRegistro);
  const anio = new Date(data?.fechaRegistro).getFullYear() || '';

  // Header específico de Confipetrol
  const drawHeader = async () => {
    const margin = 15;
    const yStart = 10;
    const headerHeight = 35;
    const headerWidth = pageW - (2 * margin);

    // Configurar líneas delgadas
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // Dibujar borde del header
    doc.rect(margin, yStart, headerWidth, headerHeight);

    // Calcular posiciones de las divisiones verticales (3 columnas)
    // Columna izquierda y derecha más estrechas, columna central más ancha
    const col1Width = headerWidth * 0.25; // Columna izquierda (25%)
    const col2Width = headerWidth * 0.50; // Columna central (50%) - más ancha
    const col3Width = headerWidth * 0.25; // Columna derecha (25%)

    const div1X = margin + col1Width; // Línea entre columna 1 y 2
    const div2X = margin + col1Width + col2Width; // Línea entre columna 2 y 3

    // Dibujar líneas verticales divisorias
    doc.line(div1X, yStart, div1X, yStart + headerHeight);
    doc.line(div2X, yStart, div2X, yStart + headerHeight);

    // Línea horizontal en la columna central (divide en 2 filas)
    const centerDivY = yStart + (headerHeight / 2);
    doc.line(margin + col1Width, centerDivY, margin + col1Width + col2Width, centerDivY);

    // === SECCIÓN IZQUIERDA ===
    const leftColCenterX = margin + (col1Width / 2); // Centro de la columna izquierda
    let leftY = yStart + 5;

    // Logo Confipetrol (más grande, centrado)
    try {
      const imgPath = "/img/ConsentimientosAdmision/confipetrol.png";
      const imgCompressed = await compressImage(imgPath);
      const logoWidth = 28;
      const logoHeight = 17;
      const logoX = leftColCenterX - (logoWidth / 2); // Centrar el logo
      doc.addImage(imgCompressed, "PNG", logoX, leftY, logoWidth, logoHeight);
      leftY += 19;
    } catch (error) {
      console.log("Error cargando logo Confipetrol:", error);
    }

    // "CONFIPETROL" centrado
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(0, 51, 102); // Azul oscuro
    const textoConfipetrol = "CONFIPETROL";
    doc.text(textoConfipetrol, leftColCenterX, leftY, { align: "center" });
    leftY += 5;

    // RUC en negrita, centrado
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text("RUC: 20357259976", leftColCenterX, leftY, { align: "center" });

    // === SECCIÓN MEDIA (CENTRO) - FILA SUPERIOR ===
    const centerX = margin + col1Width + (col2Width / 2);
    let centerY = yStart + 12;

    // "CONFIPETROL" centrado en negrita (fila superior)
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("CONFIPETROL", centerX, centerY, { align: "center" });

    // === SECCIÓN MEDIA (CENTRO) - FILA INFERIOR ===
    centerY = centerDivY + 6;

    // Título del documento en múltiples líneas (fila inferior)
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("RECEPCION DE EXAMEN MEDICO Y", centerX, centerY, { align: "center" });
    centerY += 4;
    doc.text("CUMPLIMIENTO DE RECOMENDACIONES", centerX, centerY, { align: "center" });
    centerY += 4;
    doc.text("MÉDICAS PERU", centerX, centerY, { align: "center" });

    // === SECCIÓN DERECHA ===
    const rightX = margin + col1Width + col2Width + col3Width - 5;
    let rightY = yStart + 8;

    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.setTextColor(0, 0, 0);

    // Código
    doc.text("Código: HSEQ-S&SO1-F-107", rightX, rightY, { align: "right" });
    rightY += 4;

    // Versión
    doc.text("Versión: 0", rightX, rightY, { align: "right" });
    rightY += 4;

    // Fecha
    const fechaFormato = datosFinales.fechaExamen || "27-09-2016";
    doc.text(`Fecha: ${fechaFormato}`, rightX, rightY, { align: "right" });
    rightY += 4;

    // Página
    doc.text("Página: 1 de 1", rightX, rightY, { align: "right" });
  };

  await drawHeader();

  // === CONTENIDO DEL DOCUMENTO ===
  let yPos = 60; // Después del header de Confipetrol con separación adecuada (10 + 35 + 15)
  const margin = 15;
  const anchoTexto = pageW - (2 * margin);
  const lineHeight = 5;

  // Función para justificar texto con partes en negrita
  const justificarTextoConNegritas = (partesTexto, x, y, anchoMaximo, interlineado) => {
    // Construir lista de palabras con su formato (negrita o no)
    const palabrasConFormato = [];
    
    partesTexto.forEach(parte => {
      const palabras = parte.texto.split(' ').filter(p => p.length > 0);
      palabras.forEach(palabra => {
        palabrasConFormato.push({ texto: palabra, negrita: parte.negrita });
      });
    });

    // Construir líneas manualmente palabra por palabra
    const lineas = [];
    let lineaActual = [];
    let anchoLineaActual = 0;

    palabrasConFormato.forEach((palabraObj, idx) => {
      const palabra = palabraObj.texto;
      doc.setFont("helvetica", palabraObj.negrita ? "bold" : "normal");
      const anchoPalabra = doc.getTextWidth(palabra);
      const espacio = idx > 0 ? doc.getTextWidth(' ') : 0;
      const anchoTotal = anchoLineaActual + espacio + anchoPalabra;

      if (anchoTotal <= anchoMaximo || lineaActual.length === 0) {
        // Agregar palabra a la línea actual
        lineaActual.push(palabraObj);
        anchoLineaActual = anchoTotal;
      } else {
        // Nueva línea
        lineas.push(lineaActual);
        lineaActual = [palabraObj];
        anchoLineaActual = anchoPalabra;
      }
    });

    // Agregar última línea
    if (lineaActual.length > 0) {
      lineas.push(lineaActual);
    }

    // Dibujar líneas justificadas
    let yActual = y;

    lineas.forEach((linea, index) => {
      const esUltimaLinea = index === lineas.length - 1;
      const numPalabras = linea.length;

      if (!esUltimaLinea && numPalabras > 1) {
        // Justificar línea
        // Calcular ancho total de la línea
        let anchoTotalLinea = 0;
        linea.forEach((palabraObj, i) => {
          doc.setFont("helvetica", palabraObj.negrita ? "bold" : "normal");
          anchoTotalLinea += doc.getTextWidth(palabraObj.texto);
          if (i < numPalabras - 1) {
            anchoTotalLinea += doc.getTextWidth(' ');
          }
        });

        const espacioExtra = (anchoMaximo - anchoTotalLinea) / (numPalabras - 1);
        let xActual = x;

        linea.forEach((palabraObj, i) => {
          doc.setFont("helvetica", palabraObj.negrita ? "bold" : "normal");
          doc.text(palabraObj.texto, xActual, yActual);

          if (i < numPalabras - 1) {
            const anchoPalabra = doc.getTextWidth(palabraObj.texto);
            xActual += anchoPalabra + doc.getTextWidth(' ') + espacioExtra;
          }
        });
      } else {
        // Última línea, no justificar
        let xActual = x;

        linea.forEach((palabraObj, i) => {
          doc.setFont("helvetica", palabraObj.negrita ? "bold" : "normal");
          doc.text(palabraObj.texto, xActual, yActual);

          if (i < numPalabras - 1) {
            xActual += doc.getTextWidth(palabraObj.texto + ' ');
          }
        });
      }
      yActual += interlineado;
    });

    return yActual;
  };

  // Texto completo del párrafo (un solo bloque) - dividido en partes normal/negrita
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  
  const partesTexto = [
    { texto: "Yo, ", negrita: false },
    { texto: datosFinales.apellidosNombres, negrita: true },
    { texto: " identificado con DNI N° ", negrita: false },
    { texto: datosFinales.documentoIdentidad, negrita: true },
    { texto: " Con domicilio en ", negrita: false },
    { texto: datosFinales.domicilio, negrita: true },
    { texto: " distrito de ", negrita: false },
    { texto: datosFinales.distrito, negrita: true },
    { texto: " Provincia y departamento de ", negrita: false },
    { texto: datosFinales.provincia, negrita: true },
    { texto: " en mi calidad de trabajador de Confipetrol Andina, declaro bajo juramento que he sido informado de las razones para los exámenes de salud ocupacional así como de los riesgos para la seguridad y salud en mi puesto de trabajo, además declaro haber recibido oportunamente los resultados de mi examen médico, de manera confidencial, conforme a lo establecido en el artículo 71° literal b) de la Ley N° 29783, Ley de Seguridad y Salud en el Trabajo¹. Teniendo conocimiento de mis resultados, me comprometo a cumplir con las recomendaciones de carácter médico, indicadas por el médico tratante y/o médico ocupacional, así como ingresar al programa de vigilancia médica según lo establecido en el RM 312-2011-MINSA².", negrita: false }
  ];
  
  yPos = justificarTextoConNegritas(partesTexto, margin, yPos, anchoTexto, lineHeight);
  yPos += 5;

  // Segundo párrafo - JUSTIFICADO
  doc.setFont("helvetica", "normal");
  const textoConsentimiento2 = `En ese sentido, manifiesto que tengo conocimiento que al no cumplir con las recomendaciones médicas indicadas cualquier dolencia o malestar que presente queda bajo mi responsabilidad.`;
  
  // Función simple para justificar texto normal
  const justificarTexto = (texto, x, y, anchoMaximo, interlineado) => {
    const lineas = doc.splitTextToSize(texto, anchoMaximo);
    let yActual = y;

    lineas.forEach((linea, index) => {
      if (index < lineas.length - 1 && linea.includes(' ')) {
        const palabras = linea.split(' ');
        if (palabras.length > 1) {
          doc.setFont("helvetica", "normal");
          const anchoTexto = doc.getTextWidth(linea);
          const espacioDisponible = anchoMaximo - anchoTexto;
          const espaciosEntrePalabras = palabras.length - 1;
          const espacioExtra = espacioDisponible / espaciosEntrePalabras;

          let xActual = x;
          palabras.forEach((palabra, i) => {
            doc.text(palabra, xActual, yActual);
            if (i < palabras.length - 1) {
              const anchoPalabra = doc.getTextWidth(palabra);
              xActual += anchoPalabra + (doc.getTextWidth(' ') + espacioExtra);
            }
          });
        } else {
          doc.text(linea, x, yActual);
        }
      } else {
        doc.text(linea, x, yActual);
      }
      yActual += interlineado;
    });

    return yActual;
  };
  
  yPos = justificarTexto(textoConsentimiento2, margin, yPos, anchoTexto, lineHeight);
  yPos += 15;

  // Fecha al final: "a los [día] días de [mes] del [año]"
  doc.setFont("helvetica", "normal");
  const textoFecha = `a los ${dia} días de ${mes} del ${anio}`;
  doc.text(textoFecha, pageW - margin, yPos, { align: "right" });
  yPos += 20;

  // === FIRMA Y HUELLA DEL PACIENTE (usando dibujarFirmas, bajada 15mm) ===
  yPos += 15;
  
  // Usar la función dibujarFirmas del utils
  const yPosFinalFirmas = await dibujarFirmas({
    doc,
    datos: data,
    y: yPos,
    pageW: pageW
  });

  // Agregar DNI debajo de la firma y huella
  const centroX = pageW / 2;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(`DNI: ${datosFinales.documentoIdentidad}`, centroX, yPosFinalFirmas + 1.5, { align: "center" });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 7, fontSize: 7 });

  // === Imprimir ===
  if (!docExistente) {
    imprimir(doc);
  }

  return doc;
}

function imprimir(doc) {
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}

