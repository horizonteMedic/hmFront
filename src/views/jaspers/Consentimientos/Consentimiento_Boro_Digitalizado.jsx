import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CabeceraLogo from "../components/CabeceraLogo.jsx";
import footerTR from "../components/footerTR.jsx";
import drawColorBox from "../components/ColorBox.jsx";
import { dibujarFirmas } from "../../utils/dibujarFirmas.js";

export default async function Consentimiento_Boro_Digitalizado(datos) {
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
  const drawHeader = async () => {
    await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

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

  await drawHeader();

  // Función para dibujar texto con salto de línea automático (similar a Aptitud_medico_ocupacional_11.jsx)
  const dibujarTextoPegado = (texto, x, y, anchoMaximo) => {
    if (!texto || texto.trim() === '') return y;

    const fontSize = doc.internal.getFontSize();
    const palabras = texto.split(' ');
    let linea = '';
    let yActual = y;
    const lineHeight = fontSize * 0.5;

    palabras.forEach((palabra, i) => {
      const prueba = linea + (linea ? ' ' : '') + palabra;
      if (doc.getTextWidth(prueba) > anchoMaximo) {
        if (linea) {
          doc.text(linea, x, yActual);
          yActual += lineHeight;
          linea = palabra;
        } else {
          doc.text(palabra, x, yActual);
          yActual += lineHeight;
          linea = '';
        }
      } else {
        linea = prueba;
      }
      if (i === palabras.length - 1 && linea) {
        doc.text(linea, x, yActual);
      }
    });

    return yActual + lineHeight;
  };

  let y = 44;
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
    fechaStr = toDDMMYYYY(datos.fecha);
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
      lineColor: [0, 0, 0],
      halign: 'center',
      valign: 'middle',
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
    },
    tableLineWidth: 0.1,
    tableLineColor: [0, 0, 0],
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
    fechaMate = toDDMMYYYY(fechaMate);
    const textoCompleto = `Si la respuesta es SI: ¿Cuándo consumió por última vez?     Fecha:   ${fechaMate}`;
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
    fechaHoja = toDDMMYYYY(fechaHoja);
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
  // Mostrar bloque con etiquetas y respuestas alineadas a la izquierda
  let yCampos = y;
  const etiquetaX = margin;
  const respuestaX = margin + 35;
  doc.setFont('helvetica', 'bold');
  doc.text('CUAL', etiquetaX, yCampos);
  doc.setFont('helvetica', 'normal');
  doc.text(':', etiquetaX + 20, yCampos);
  doc.text(`${datos.critCualTratQuirugODental || ''}`, respuestaX, yCampos);

  yCampos += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('DONDE', etiquetaX, yCampos);
  doc.setFont('helvetica', 'normal');
  doc.text(':', etiquetaX + 20, yCampos);
  doc.text(`${datos.critDondeTratQuirugODental || ''}`, respuestaX, yCampos);

  yCampos += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('CUANDO', etiquetaX, yCampos);
  doc.setFont('helvetica', 'normal');
  doc.text(':', etiquetaX + 20, yCampos);
  doc.text(`${datos.critCuandoTratQuirugODental || ''}`, respuestaX, yCampos);
  y = yCampos + 2;

  // Fecha del examen en la parte inferior
  y += 10;
  doc.setFont('helvetica', 'normal');

  y += 2;

  // Espacio antes de las notas
  y += 5;

  // Notas como texto dinámico (sin caja)
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.text('Notas:', margin, y);

  const notas = datos.notas || '';
  const notasInicioY = y + 5;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  // Ancho máximo para notas: desde el margen izquierdo hasta el margen derecho
  const anchoMaximoNotas = pageW - 2 * margin - 10;
  const notasFinalY = dibujarTextoPegado(notas, margin, notasInicioY, anchoMaximoNotas);

  // Usar helper para dibujar firmas
  dibujarFirmas({ doc, datos, y: notasFinalY + 10, pageW }).then((yFinalFirmas) => {
    // Agregar campos de nombre completo y DNI debajo de la firma del responsable
    const tieneSelloProfesional = datos.digitalizacion?.some(d =>
      d.nombreDigitalizacion === "SELLOFIRMA" || d.nombreDigitalizacion === "SELLOFIRMADOCASIG"
    );

    if (tieneSelloProfesional) {
      // Posición del responsable (lado derecho - 2/3 de la página)
      const centroProfesionalX = (pageW / 3) * 2;
      const yCamposResponsable = yFinalFirmas - 3; // Justo debajo del texto "Responsable de la Evaluación"

      // Nombre Completo
      const nombreCompleto = String(datos.usuarioRegistrado || '');
      doc.setFont('helvetica', 'normal').setFontSize(7);
      doc.text('Nombre Completo: ' + nombreCompleto, centroProfesionalX, yCamposResponsable, { align: "center" });

      // DNI
      const dniResponsable = String(datos.dniUsuario || '');
      doc.text('DNI: ' + dniResponsable, centroProfesionalX, yCamposResponsable + 4, { align: "center" });
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
  }).catch(err => {
    console.error(err);
    alert('Error generando PDF: ' + err);
  });
} 