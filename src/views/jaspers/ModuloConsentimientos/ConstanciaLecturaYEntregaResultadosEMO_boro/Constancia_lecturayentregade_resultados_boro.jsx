import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';

export default async function ConstanciaLecturaYEntregaResultadosEMO(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Preparar datos según los campos del backend
  const datosFinales = {
    apellidosNombres: String(((data?.apellidosPaciente ?? '') + ' ' + (data?.nombresPaciente ?? '')).trim()),
    fechaExamen: formatearFechaCorta(data?.fechaEmo ?? data?.fecha ?? data?.fechaRegistro ?? ''),
    documentoIdentidad: String(data?.dniPaciente ?? ''),
    puestoTrabajo: String(data?.puestoTrabajo ?? data?.cargo ?? data?.cargoPaciente ?? ''),
    empresa: String(data?.empresa ?? ''),
    sede: String(data?.sede ?? data?.nombreSede ?? ''),
    numeroFicha: String(data?.norden ?? ''),
    codigoColor: String(data?.codigoColor ?? ''),
    textoColor: String(data?.textoColor ?? ''),
    tipoExamen: String(data?.tipoEmo ?? data?.tipoExamen ?? data?.nombreExamen ?? ''),
    responsableRegistro: String(data?.responsableRegistro ?? data?.usuarioFirma ?? ''),
    fechaEntrega: formatearFechaCorta(data?.fechaEntrega ?? data?.fecha ?? data?.fechaRegistro ?? ''),
  };

  // Header
  const drawHeader = () => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Título
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("CONSTANCIA DE LECTURA Y ENTREGA DE RESULTADOS", pageW / 2, 50, { align: "center" });
    doc.text("DE EXÁMENES MÉDICOS OCUPACIONALES", pageW / 2, 57, { align: "center" });

    // Número de Ficha, Sede, Fecha y Página
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 70, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 50, 16);

    // Calcular ancho disponible para la sede (evitar que se pise con el ColorBox)
    const xInicioSede = pageW - 70;
    const xFinColorBox = pageW - 5;
    const anchoDisponibleSede = xFinColorBox - xInicioSede - 5;

    doc.setFont("helvetica", "normal").setFontSize(8);
    const textoSede = "Sede: " + datosFinales.sede;
    const lineasSede = doc.splitTextToSize(textoSede, anchoDisponibleSede);
    lineasSede.forEach((linea, idx) => {
      doc.text(linea, xInicioSede, 20 + (idx * 3.5));
    });
    
    const yFechaExamen = lineasSede.length === 1 ? 25 : 20 + (lineasSede.length * 3.5) + 2;
    doc.text("Fecha de examen: " + (datosFinales.fechaExamen || ""), pageW - 70, yFechaExamen);
    doc.text("Pag. 01", pageW - 25, 8);

    // Bloque de color
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

  drawHeader();

  // === CONTENIDO DEL DOCUMENTO ===
  let yPos = 70;
  const margin = 15;
  const anchoTexto = pageW - (2 * margin);
  const lineHeight = 5;
  const filaAltura = 8;

  // Función para dibujar tabla con bordes
  const dibujarTabla = (x, y, ancho, altura, columnas) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar borde exterior
    doc.rect(x, y, ancho, altura);
    
    // Dibujar líneas verticales
    let xActual = x;
    columnas.forEach((col) => {
      xActual += col.ancho;
      if (xActual < x + ancho) {
        doc.line(xActual, y, xActual, y + altura);
      }
    });
    
    // Dibujar línea horizontal del header
    doc.line(x, y + filaAltura, x + ancho, y + filaAltura);
  };

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

  // Función para justificar texto con partes en negrita
  const justificarTextoConNegritas = (partesTexto, x, y, anchoMaximo, interlineado) => {
    const palabrasConFormato = [];
    
    partesTexto.forEach(parte => {
      const palabras = parte.texto.split(' ').filter(p => p.length > 0);
      palabras.forEach(palabra => {
        palabrasConFormato.push({ texto: palabra, negrita: parte.negrita });
      });
    });

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
        lineaActual.push(palabraObj);
        anchoLineaActual = anchoTotal;
      } else {
        lineas.push(lineaActual);
        lineaActual = [palabraObj];
        anchoLineaActual = anchoPalabra;
      }
    });

    if (lineaActual.length > 0) {
      lineas.push(lineaActual);
    }

    let yActual = y;

    lineas.forEach((linea, index) => {
      const esUltimaLinea = index === lineas.length - 1;
      const numPalabras = linea.length;

      if (!esUltimaLinea && numPalabras > 1) {
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

  // === TABLA SUPERIOR: Fecha de EMO, Tipo de EMO, Responsable del Registro ===
  const tablaInicioX = margin;
  const tablaAncho = anchoTexto;
  const alturaTabla = filaAltura * 2;

  const columnas = [
    { nombre: "Fecha de EMO", ancho: tablaAncho / 3, valor: datosFinales.fechaExamen },
    { nombre: "Tipo de EMO", ancho: tablaAncho / 3, valor: datosFinales.tipoExamen },
    { nombre: "Responsable del Registro", ancho: tablaAncho / 3, valor: datosFinales.responsableRegistro }
  ];

  dibujarTabla(tablaInicioX, yPos, tablaAncho, alturaTabla, columnas);

  // Header de la tabla
  doc.setFont("helvetica", "bold").setFontSize(8);
  let xCol = tablaInicioX;
  columnas.forEach((col) => {
    doc.text(col.nombre, xCol + col.ancho / 2, yPos + 4, { align: "center" });
    xCol += col.ancho;
  });

  // Datos de la tabla
  doc.setFont("helvetica", "normal").setFontSize(8);
  xCol = tablaInicioX;
  columnas.forEach((col) => {
    const valor = col.valor || '';
    doc.text(valor, xCol + col.ancho / 2, yPos + filaAltura + 4, { align: "center" });
    xCol += col.ancho;
  });

  yPos += alturaTabla + 10;

  // === PRIMER PÁRRAFO - JUSTIFICADO ===
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  
  const partesTexto1 = [
    { texto: "Mediante el presente dejo constancia que el Médico Ocupacional representante de la empresa ", negrita: false },
    { texto: datosFinales.empresa, negrita: true },
    { texto: " me ha entregado, informado y explicado de manera presencial o por medios digitales los resultados del Examen Médico Ocupacional que se me ha realizado.", negrita: false }
  ];
  
  yPos = justificarTextoConNegritas(partesTexto1, margin, yPos, anchoTexto, lineHeight);
  yPos += 8;

  // === SEGUNDO PÁRRAFO - JUSTIFICADO ===
  const texto2 = "Así mismo me comprometo a cumplir con las indicaciones y recomendaciones recibidas por parte del médico ocupacional.";
  yPos = justificarTexto(texto2, margin, yPos, anchoTexto, lineHeight);
  yPos += 10;

  // === TEXTO DE CONFORMIDAD ===
  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.text("Doy conformidad de lo indicado mediante mi firma y/o huella digital:", margin, yPos);
  yPos += 8;

  // === TABLA DE DATOS PERSONALES ===
  const alturaTablaDatos = filaAltura * 4;
  const colEtiquetaAncho = tablaAncho * 0.35; // 35% para etiquetas
  
  // Dibujar borde exterior de la tabla
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaTablaDatos);
  
  // Línea vertical separadora
  doc.line(tablaInicioX + colEtiquetaAncho, yPos, tablaInicioX + colEtiquetaAncho, yPos + alturaTablaDatos);
  
  // Líneas horizontales entre filas
  for (let i = 1; i < 4; i++) {
    doc.line(tablaInicioX, yPos + filaAltura * i, tablaInicioX + tablaAncho, yPos + filaAltura * i);
  }

  // Fila 1: Apellidos y Nombres
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + filaAltura / 2 + 2);
  doc.text(datosFinales.apellidosNombres, tablaInicioX + colEtiquetaAncho + 2, yPos + filaAltura / 2 + 2);

  // Fila 2: DNI
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("DNI N°", tablaInicioX + 2, yPos + filaAltura + filaAltura / 2 + 2);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + colEtiquetaAncho + 2, yPos + filaAltura + filaAltura / 2 + 2);

  // Fila 3: Puesto de trabajo
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Puesto de trabajo:", tablaInicioX + 2, yPos + filaAltura * 2 + filaAltura / 2 + 2);
  doc.text(datosFinales.puestoTrabajo, tablaInicioX + colEtiquetaAncho + 2, yPos + filaAltura * 2 + filaAltura / 2 + 2);

  // Fila 4: Fecha de entrega
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Fecha de entrega:", tablaInicioX + 2, yPos + filaAltura * 3 + filaAltura / 2 + 2);
  doc.text(datosFinales.fechaEntrega, tablaInicioX + colEtiquetaAncho + 2, yPos + filaAltura * 3 + filaAltura / 2 + 2);

  // Continuar directamente con la sección de firmas (sin espacio)
  yPos += alturaTablaDatos;

  // === SECCIÓN DE FIRMA Y HUELLA DEL COLABORADOR ===
  const alturaSeccionFirmas = 25;
  const col1Ancho = tablaAncho * 0.25; // Columna 1: texto "Firma de conformidad..."
  const col2Ancho = tablaAncho * 0.25; // Columna 2: vacía (para firma)
  const col3Ancho = tablaAncho * 0.25; // Columna 3: texto "Huella digital..."
  const col4Ancho = tablaAncho * 0.25; // Columna 4: vacía (para huella)

  // Dibujar bordes de la tabla de firmas
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  
  // Borde exterior
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaSeccionFirmas);
  
  // Líneas verticales separadoras
  doc.line(tablaInicioX + col1Ancho, yPos, tablaInicioX + col1Ancho, yPos + alturaSeccionFirmas);
  doc.line(tablaInicioX + col1Ancho + col2Ancho, yPos, tablaInicioX + col1Ancho + col2Ancho, yPos + alturaSeccionFirmas);
  doc.line(tablaInicioX + col1Ancho + col2Ancho + col3Ancho, yPos, tablaInicioX + col1Ancho + col2Ancho + col3Ancho, yPos + alturaSeccionFirmas);

  // Columna 1: Texto "Firma de conformidad del colaborador"
  doc.setFont("helvetica", "normal").setFontSize(8);
  const textoFirma = "Firma de conformidad del colaborador";
  const lineasFirma = doc.splitTextToSize(textoFirma, col1Ancho - 4);
  const centroCol1X = tablaInicioX + col1Ancho / 2;
  const centroCol1Y = yPos + alturaSeccionFirmas / 2;
  lineasFirma.forEach((linea, idx) => {
    doc.text(linea, centroCol1X, centroCol1Y - (lineasFirma.length - 1) * 2 + (idx * 4), { align: "center" });
  });

  // Columna 2: Vacía (para firma)
  // Aquí se dibujará la firma si existe
  const digitalizacion = data?.digitalizacion || [];
  const firmaPaciente = digitalizacion.find(d => d.nombreDigitalizacion === "FIRMAP");
  
  if (firmaPaciente?.url && firmaPaciente.url !== "Sin registro") {
    try {
      const img = await new Promise((resolve, reject) => {
        const imgObj = new Image();
        imgObj.crossOrigin = "anonymous";
        imgObj.onload = () => resolve(imgObj);
        imgObj.onerror = () => reject(`No se pudo cargar ${firmaPaciente.url}`);
        imgObj.src = firmaPaciente.url;
      });
      
      const imgWidth = 30;
      const imgHeight = 20;
      const x = tablaInicioX + col1Ancho + col2Ancho / 2 - imgWidth / 2;
      const y = yPos + 2;
      doc.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma:", error);
    }
  }

  // Columna 3: Texto "Huella digital: (indice derecho) (OPCIONAL)"
  doc.setFont("helvetica", "normal").setFontSize(8);
  const textoHuella = "Huella digital: (indice derecho) (OPCIONAL)";
  const lineasHuella = doc.splitTextToSize(textoHuella, col3Ancho - 4);
  const centroCol3X = tablaInicioX + col1Ancho + col2Ancho + col3Ancho / 2;
  const centroCol3Y = yPos + alturaSeccionFirmas / 2;
  lineasHuella.forEach((linea, idx) => {
    doc.text(linea, centroCol3X, centroCol3Y - (lineasHuella.length - 1) * 2 + (idx * 4), { align: "center" });
  });

  // Columna 4: Vacía (para huella)
  // Aquí se dibujará la huella si existe
  const huellaPaciente = digitalizacion.find(d => d.nombreDigitalizacion === "HUELLA");
  
  if (huellaPaciente?.url && huellaPaciente.url !== "Sin registro") {
    try {
      const img = await new Promise((resolve, reject) => {
        const imgObj = new Image();
        imgObj.crossOrigin = "anonymous";
        imgObj.onload = () => resolve(imgObj);
        imgObj.onerror = () => reject(`No se pudo cargar ${huellaPaciente.url}`);
        imgObj.src = huellaPaciente.url;
      });
      
      const imgWidth = 12;
      const imgHeight = 20;
      const x = tablaInicioX + col1Ancho + col2Ancho + col3Ancho + col4Ancho / 2 - imgWidth / 2;
      const y = yPos + 2;
      doc.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando huella:", error);
    }
  }

  yPos += alturaSeccionFirmas + 10;

  // === SECCIÓN DE SELLO Y FIRMA DEL MÉDICO ===
  const alturaSeccionMedico = 30;
  const sello1 = digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const sello2 = digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMADOCASIG");
  
  const tieneSello = (sello1?.url && sello1.url !== "Sin registro") || (sello2?.url && sello2.url !== "Sin registro");
  
  if (tieneSello) {
    const sigW = 48;
    const sigH = 20;
    const sigY = yPos + 2;
    const gap = 16;
    const centroMedicoX = pageW / 2;

    // Función para cargar imagen
    const loadImg = (url) => {
      return new Promise((resolve, reject) => {
        const imgObj = new Image();
        imgObj.crossOrigin = "anonymous";
        imgObj.onload = () => resolve(imgObj);
        imgObj.onerror = () => reject(`No se pudo cargar ${url}`);
        imgObj.src = url;
      });
    };

    // Función para dibujar línea y texto
    const dibujarLineaYTexto = (centroX, lineY, tipoSello) => {
      doc.setLineWidth(0.2);
      let texto1, texto2;
      if (tipoSello === 'SELLOFIRMA') {
        texto1 = "Firma y Sello del Profesional";
        texto2 = "Responsable de la Evaluación";
      } else if (tipoSello === 'SELLOFIRMADOCASIG') {
        texto1 = "Firma y Sello Médico Asignado";
        texto2 = null;
      } else {
        texto1 = "Firma y Sello";
        texto2 = null;
      }

      const textoWidth = doc.getTextWidth(texto1);
      const anchoLinea = Math.max(textoWidth, texto2 ? doc.getTextWidth(texto2) : 0);

      doc.line(centroX - anchoLinea / 2, lineY, centroX + anchoLinea / 2, lineY);
      doc.setFont('helvetica', 'normal').setFontSize(9);
      doc.text(texto1, centroX, lineY + 3, { align: "center" });
      if (texto2) {
        doc.text(texto2, centroX, lineY + 6, { align: "center" });
      }
    };

    // Cargar y dibujar sellos
    const promises = [];
    if (sello1?.url && sello1.url !== "Sin registro") {
      promises.push(loadImg(sello1.url).then(img => ({ img, tipo: 'SELLOFIRMA' })).catch(() => null));
    } else {
      promises.push(Promise.resolve(null));
    }
    
    if (sello2?.url && sello2.url !== "Sin registro") {
      promises.push(loadImg(sello2.url).then(img => ({ img, tipo: 'SELLOFIRMADOCASIG' })).catch(() => null));
    } else {
      promises.push(Promise.resolve(null));
    }

    const [s1, s2] = await Promise.all(promises);

    if (s1 && s2) {
      // Dos sellos lado a lado
      const totalWidth = sigW * 2 + gap;
      const startX = centroMedicoX - totalWidth / 2;

      doc.addImage(s1.img, 'JPEG', startX, sigY, sigW, sigH);
      doc.addImage(s2.img, 'JPEG', startX + sigW + gap, sigY, sigW, sigH);

      const centroSello1X = startX + sigW / 2;
      const centroSello2X = startX + sigW + gap + sigW / 2;
      const lineY = sigY + sigH + 3;
      dibujarLineaYTexto(centroSello1X, lineY, 'SELLOFIRMA');
      dibujarLineaYTexto(centroSello2X, lineY, 'SELLOFIRMADOCASIG');
      yPos += alturaSeccionMedico;
    } else if (s1) {
      // Un solo sello centrado
      const imgX = centroMedicoX - sigW / 2;
      doc.addImage(s1.img, 'JPEG', imgX, sigY, sigW, sigH);
      const lineY = sigY + sigH + 3;
      dibujarLineaYTexto(centroMedicoX, lineY, 'SELLOFIRMA');
      yPos += alturaSeccionMedico;
    } else if (s2) {
      // Un solo sello centrado
      const imgX = centroMedicoX - sigW / 2;
      doc.addImage(s2.img, 'JPEG', imgX, sigY, sigW, sigH);
      const lineY = sigY + sigH + 3;
      dibujarLineaYTexto(centroMedicoX, lineY, 'SELLOFIRMADOCASIG');
      yPos += alturaSeccionMedico;
    }
  }

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8, fontSize: 8 });

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
