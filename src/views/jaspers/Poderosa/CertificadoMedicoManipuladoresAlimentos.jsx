import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { formatDateLongEs } from "../../utils/formatDateLongEs";
import { convertirGenero } from "../../utils/helpers";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function CertificadoMedicoManipuladoresAlimentos(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Datos de prueba por defecto
  const datosPrueba = {
    apellidosNombres: "MIGUEL ÁNGEL ALVARADO NIETO",
    fechaExamen: "04/11/2024",
    tipoExamen: "CERTIFICADO MÉDICO MANIPULADORES DE ALIMENTOS",
    sexo: "Masculino",
    documentoIdentidad: "60920672",
    edad: "35",
    fechaNacimiento: "15/03/1989",
    areaTrabajo: "ALIMENTOS",
    puestoTrabajo: "AYUDANTE DE COCINA",
    empresa: "CIA. MINERA ARESA S.A.",
    contrata: "HORIZONTE MEDIC S.A.C",
    // Datos de color
    color: 1,
    codigoColor: "#008f39",
    textoColor: "A",
    // Datos adicionales para header
    numeroFicha: "12345",
    sede: "Trujillo-Pierola",
    horaSalida: "9:33:43 PM",
    // Datos específicos del certificado
    resultadoEvaluacion: "APTO",
    observaciones: "Los parámetros obtenidos en los exámenes de laboratorio clínico y Evaluación Médica General han sido considerados compatibles con el buen estado de salud del paciente."
  };

  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente || "") + " " + (data.nombresPaciente || "")).trim(),
    fechaExamen: formatearFechaCorta(data.fechaExamen),
    tipoExamen: String(data.nombreExamen || "CERTIFICADO MÉDICO MANIPULADORES DE ALIMENTOS"),
    sexo: convertirGenero(data.sexoPaciente),
    documentoIdentidad: String(data.dniPaciente),
    edad: String(data.edadPaciente),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente || data.fechaNacimiento),
    areaTrabajo: data.areaPaciente || "ALIMENTOS",
    puestoTrabajo: data.cargoPaciente,
    empresa: data.empresa,
    contrata: data.contrata || "HORIZONTE MEDIC S.A.C",
    // Datos de color
    color: data.color,
    codigoColor: data.codigoColor,
    textoColor: data.textoColor,
    // Datos adicionales para header
    numeroFicha: String(data.norden),
    sede: data.sede || data.nombreSede,
    horaSalida: String(data.horaSalida),
    direccionPaciente: String(data.direccionPaciente),
    // Datos específicos del certificado
    resultadoEvaluacion: data.noApto ? "NO APTO" : data.apto ? "APTO" : "APTO",
    observaciones: data.observaciones || "Los parámetros obtenidos en los exámenes de laboratorio clínico y Evaluación Médica General han sido considerados compatibles con el buen estado de salud del paciente."
  };

  // Usar datos reales si existen, sino usar datos de prueba
  const datosFinales = data && data.norden ? datosReales : datosPrueba;

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("CERTIFICADO MÉDICO DE BUENA SALUD", pageW / 2, 40, { align: "center" });
      doc.setFont("helvetica", "bold").setFontSize(14);
      doc.text("PARA MANIPULADORES DE ALIMENTOS", pageW / 2, 46, { align: "center" });
    }

    // Número de Ficha y Página (alineación automática mejorada)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 60, 16);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosFinales.sede, pageW - 80, 20);
    doc.text("Fecha de examen: " + datosFinales.fechaExamen, pageW - 80, 25);

    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 30, 10);

    // Bloque de color (posición mejorada)
    drawColorBox(doc, {
      color: datosFinales.codigoColor,
      text: datosFinales.textoColor,
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  };

  // Función para parsear el template en unidades atómicas (palabras)
  const parseTemplate = (textoBase, datos, doc) => {
    const segments = [];
    const regex = /\{([^}]+)\}/g;
    let i = 0;
    let match;
    while ((match = regex.exec(textoBase)) !== null) {
      const start = match.index;
      if (start > i) {
        segments.push({ type: 'text', content: textoBase.substring(i, start) });
      }
      segments.push({ type: 'data', key: match[1] });
      i = regex.lastIndex;
    }
    if (i < textoBase.length) {
      segments.push({ type: 'text', content: textoBase.substring(i) });
    }

    // Construir unidades atómicas (palabras)
    const atomicUnits = [];
    segments.forEach((seg) => {
      let content;
      let isBold = false;
      if (seg.type === 'text') {
        content = seg.content;
      } else {
        content = datos[seg.key] || '';
        isBold = true;
      }
      
      if (content) {
        const words = content.match(/(\S+)/g) || [];
        words.forEach((word) => {
          let width;
          const prevFont = doc.getFont();
          if (isBold) {
            doc.setFont("helvetica", "bold");
          }
          width = doc.getTextWidth(word);
          doc.setFont(prevFont.fontName, prevFont.fontStyle);
          
          atomicUnits.push({
            type: 'word',
            text: word,
            isBold: isBold,
            width: width
          });
        });
      }
    });

    return atomicUnits;
  };

  // Función para dibujar texto justificado con datos en negrita
  const dibujarTextoJustificadoConBold = (textoBase, datos, xStart, yStart, maxWidth, justified = true) => {
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const atomicUnits = parseTemplate(textoBase, datos, doc);
    if (atomicUnits.length === 0) return yStart;

    const spaceWidth = doc.getTextWidth(' ');
    const interlineado = 5.0; // Interlineado aumentado un poco más
    const punctRegex = /^[.,;:!?\)\]\}"]/;

    // Construir líneas
    const lines = [];
    let currentLine = [];
    let currentWidth = 0;

    atomicUnits.forEach((unit) => {
      let addedSpace = 0;
      if (currentLine.length > 0) {
        addedSpace = punctRegex.test(unit.text.charAt(0)) ? 0 : spaceWidth;
      }
      const addedWidth = addedSpace + unit.width;

      if (currentWidth + addedWidth > maxWidth && currentLine.length > 0) {
        lines.push([...currentLine]);
        currentLine = [unit];
        currentWidth = unit.width;
      } else {
        currentLine.push(unit);
        currentWidth += addedWidth;
      }
    });

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    // Dibujar líneas
    let yActual = yStart;

    lines.forEach((line) => {
      if (line.length === 0) return;

      // Calcular totalTextWidth
      let totalTextWidth = 0;
      for (let idx = 0; idx < line.length; idx++) {
        totalTextWidth += line[idx].width;
        if (idx < line.length - 1) {
          const nextText = line[idx + 1].text;
          const baseGap = punctRegex.test(nextText.charAt(0)) ? 0 : spaceWidth;
          totalTextWidth += baseGap;
        }
      }

      // Contar gaps flexibles (donde se distribuye extra)
      let numFlexGaps = 0;
      for (let idx = 0; idx < line.length - 1; idx++) {
        const nextText = line[idx + 1].text;
        if (!punctRegex.test(nextText.charAt(0))) {
          numFlexGaps++;
        }
      }

      let extraPerFlex = 0;
      if (numFlexGaps > 0 && justified) {
        const extra = maxWidth - totalTextWidth;
        extraPerFlex = extra / numFlexGaps;
      }

      // Dibujar
      let xCurrent = xStart;
      line.forEach((unit, idx) => {
        if (unit.isBold) {
          doc.setFont("helvetica", "bold");
        } else {
          doc.setFont("helvetica", "normal");
        }
        doc.text(unit.text, xCurrent, yActual);

        if (idx < line.length - 1) {
          const nextText = line[idx + 1].text;
          const isPunctNext = punctRegex.test(nextText.charAt(0));
          const baseGap = isPunctNext ? 0 : spaceWidth;
          const thisExtra = isPunctNext ? 0 : (justified ? extraPerFlex : 0);
          xCurrent += unit.width + baseGap + thisExtra;
        }
      });

      yActual += interlineado;
    });

    return yActual;
  };

  // === DIBUJAR HEADER ===
  drawHeader(numeroPagina);

  // === CONTENIDO PRINCIPAL ===
  let yPos = 60;

  // Texto de certificación (no justificado, con partes en negrita)
  const textoCertificacion = `El que suscribe en representación de {corporacion} MEDIC S.A.C con RUC {ruc}, Certifica que:`;
  const boldDatosCert = {
    corporacion: "Corporación Peruana de Centros Médicos HORIZONTE",
    ruc: "2047176561"
  };
  
  yPos = dibujarTextoJustificadoConBold(textoCertificacion, boldDatosCert, 20, yPos, pageW - 40, false);
  yPos += 5; // Espacio adicional antes del siguiente párrafo

  // Texto con datos en negrita y justificado (nuevo contenido)
  const textoConDatos = `Don (a): {apellidosNombres} identificado con DNI: {documentoIdentidad}, postulante al cargo de {puestoTrabajo}, colaborador de la empresa {empresa} para el cargo que postula ha sido declarado {resultadoEvaluacion} de acuerdo a los resultados obtenidos en los exámenes de laboratorio clínico y Evaluación Médica General realizado en el POLICLINICO HORIZONTE MEDIC.`;
  
  yPos = dibujarTextoJustificadoConBold(textoConDatos, datosFinales, 20, yPos, pageW - 40, true);
  yPos += 8;

  // Línea adicional
  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Se anexan los resultados al final del presente documento.", 20, yPos, { maxWidth: pageW - 40 });
  yPos += 10;

  // Considerandolo (a): APTO en la misma línea
  doc.setFont("helvetica", "normal").setFontSize(11);
  const labelConsiderando = "Considerandolo (a): ";
  const labelWidth = doc.getTextWidth(labelConsiderando);
  doc.text(labelConsiderando, 20, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.resultadoEvaluacion, 20 + labelWidth, yPos);
  yPos += 8;

  // Recomendaciones
  doc.setFont("helvetica", "bold").setFontSize(11);
  const labelRecomendaciones = "Recomendaciones : ";
  doc.setFont("helvetica", "normal");
  doc.text(labelRecomendaciones, 20, yPos);
  yPos += 5;

  // Observaciones justificado
  yPos = dibujarTextoJustificadoConBold(datosFinales.observaciones, {}, 20, yPos, pageW - 40, true);
  yPos += 70;

  // === SECCIÓN DE FIRMA DEL MÉDICO ===
  const yFirmas = yPos;
  const centroPagina = pageW / 2;

  // Función para obtener URL de digitalización por nombre
  const getDigitalizacionUrl = (digitalizaciones, nombre) => {
    if (!digitalizaciones || !Array.isArray(digitalizaciones)) return null;
    const item = digitalizaciones.find(d => d.nombreDigitalizacion === nombre);
    return item ? item.url : null;
  };

  // === FIRMA DEL MÉDICO (CENTRADA) ===
  const firmaMedicoY = yFirmas + 3;
  
  // Fecha arriba de la firma, 15mm a la derecha
  const fechaFormateada = formatDateLongEs(data.fechaExamen || new Date().toISOString().split('T')[0]);
  const fechaX = centroPagina + 40;
  const fechaY = yFirmas - 5;
  
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(fechaFormateada, fechaX, fechaY);
  
  // Agregar firma y sello médico
  let firmaMedicoUrl = getDigitalizacionUrl(data.digitalizacion, "SELLOFIRMA");
  
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 50;
      const imgHeight = 25;
      const x = centroPagina - (imgWidth / 2);
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }

  // Línea horizontal arriba del texto
  const lineaInicioX = centroPagina - 30;
  const lineaFinX = centroPagina + 30;
  const lineaY = yFirmas + 25;
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(lineaInicioX, lineaY, lineaFinX, lineaY);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sello y Firma del Médico", centroPagina, yFirmas + 30, { align: "center" });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 2});

  // === IMPRIMIR ===
  imprimir(doc);
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