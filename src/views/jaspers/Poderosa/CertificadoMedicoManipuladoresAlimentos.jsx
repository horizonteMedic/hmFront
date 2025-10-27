import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { convertirGenero } from "../../utils/helpers";
import { dibujarTextoEnFilaCreciente, calcularAlturaTextoCreciente } from "../../utils/formatoParaTextoCrecienteFila.js";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function ficha_antecedente_patologico_boro_nuevo(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  const datosReales = {
    apellidosNombres: String((data.apellidos_apellidos_pa || "CASTILLO PLASENCIA") + " " + (data.nombres_nombres_pa || "HADY KATHERINE")).trim(),
    fechaExamen: formatearFechaCorta(data.fechaExamen_f_examen || new Date()),
    tipoExamen: String(data.nombreExamen || "EXAMEN MEDICO OCUPACIONAL"),
    sexo: convertirGenero(data.sexo_sexo_pa || "F"),
    documentoIdentidad: String(data.dni_cod_pa || "72384273"),
    edad: String(data.edad_edad || "31"),
    areaTrabajo: data.area_area_o || "OPERACIONES",
    puestoTrabajo: data.cargo_cargo_de || "DAD",
    empresa: data.empresa_razon_empresa || "MINERA BOROO MISQUICHILCA S.A.",
    contrata: data.contrata_razon_contrata || "N/A",
    // Datos de color
    color: data.color || 1534,
    codigoColor: data.codigoColor || "",
    textoColor: data.textoColor || " ",
    // Datos adicionales para header
    numeroFicha: String(data.n_orden || "96639"),
    sede: data.sede || "TRUJILLO-NICOLAS DE PIEROLA",
    // Datos específicos
    direccionPaciente: String(data.direccionpaciente_direccion_pa || "SAC1 URB PARQUE INDUSTRIAL MZ D LT 3"),
    fechaNacimiento: formatearFechaCorta(data.fechanacimientopaciente_fecha_nacimiento_pa || "1994-01-23"),
    // Datos adicionales para nueva fila
    lugar: data.lugarExperiencia_lugar_expe || "",
    anosExperiencia: data.tiempoExperiencia || null,
    altura: data.altura_txtaltura || "",
    // Datos de digitalización
    digitalizacion: data.digitalizacion || [],
  };

  // Usar solo datos reales proporcionados
  const datosFinales = datosReales;

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (en todas las páginas)
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("DECLARACIÓN JURADA DE DATOS MÉDICOS", pageW / 2, 32.5, { align: "center" });
    doc.text("Y ANTECEDENTES PATOLÓGICOS", pageW / 2, 36.5, { align: "center" });

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

  // === DIBUJAR HEADER ===
  drawHeader(1);

  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    if (!texto) return y;
    const fontSize = doc.internal.getFontSize();
    const palabras = texto.split(' ');
    let lineaActual = '';
    let yPos = y;
    
    palabras.forEach(palabra => {
      const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);
      
      if (anchoTexto <= anchoMaximo) {
        lineaActual = textoPrueba;
      } else {
        if (lineaActual) {
          doc.text(lineaActual, x, yPos);
          yPos += fontSize * 0.35;
          lineaActual = palabra;
        } else {
          doc.text(palabra, x, yPos);
          yPos += fontSize * 0.35;
        }
      }
    });
    
    if (lineaActual) {
      doc.text(lineaActual, x, yPos);
    }
    
    return yPos;
  };

  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar fondo gris más oscuro
    doc.setFillColor(160, 160, 160);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    
    // Dibujar líneas del header
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
    
    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);
    
    return yPos + alturaHeader;
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
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const atomicUnits = parseTemplate(textoBase, datos, doc);
    if (atomicUnits.length === 0) return yStart;

    const spaceWidth = doc.getTextWidth(' ');
    const interlineado = 3.5; // Interlineado ajustado para fontSize 8
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

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 40; // Posición inicial después del título
  const filaAltura = 5;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres con división para Tipo de examen
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); 
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura); // División para Tipo de examen
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); 
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); 
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); 
  yPos += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Tercera fila: Domicilio (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Cuarta fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Empresa (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Sexta fila: Contrata (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Séptima fila: Lugar, Años de experiencia, Altura (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 66, yPos, tablaInicioX + 66, yPos + filaAltura); // División 1
  doc.line(tablaInicioX + 132, yPos, tablaInicioX + 132, yPos + filaAltura); // División 2
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 40 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres con Tipo de examen
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Ajustar ancho para la nueva división (hasta x = tablaInicioX + 140)
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 35, yTexto + 1.5, 95);

  // Columna derecha: Tipo de examen
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.tipoExamen, tablaInicioX + 155, yTexto + 1.5);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.edad + " Años", tablaInicioX + 58, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.sexo, tablaInicioX + 105, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento, tablaInicioX + 155, yTexto + 1.5);
  yTexto += filaAltura;

  // Tercera fila: Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.direccionPaciente, tablaInicioX + 25, yTexto + 1.5, 160);
  yTexto += filaAltura;

  // Cuarta fila: Puesto de Trabajo, Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.puestoTrabajo, tablaInicioX + 30, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.areaTrabajo, tablaInicioX + 118, yTexto + 1.5);
  yTexto += filaAltura;

  // Quinta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 24, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Sexta fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contrata, tablaInicioX + 24, yTexto + 1.5);
  yTexto += filaAltura;

  // Séptima fila: Lugar, Años de experiencia, Altura
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Lugar:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.lugar || "", tablaInicioX + 15, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Años de experiencia:", tablaInicioX + 68, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.anosExperiencia || "") , tablaInicioX + 100, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Altura:", tablaInicioX + 134, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.altura || "", tablaInicioX + 150, yTexto + 1.5);
  yTexto += filaAltura;

  // Octava fila: Declaración (fila completa, altura mayor)
  const filaAlturaDeclaracion = 20;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaDeclaracion);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaDeclaracion);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaDeclaracion, tablaInicioX + tablaAncho, yPos + filaAlturaDeclaracion);
  yPos += filaAlturaDeclaracion;

  // Contenido de la declaración usando el método justificado con bold
  const textoDeclaracion = "Yo; {apellidosNombres} de {edad} de edad, con DNI/CE/PASAPORTE:{documentoIdentidad}, declaro que toda la información proporcionada en esta declaración jurada es verdadera no habiendo omitido ningún dato personal ni laboral relevante de forma voluntaria.";
  yTexto = dibujarTextoJustificadoConBold(textoDeclaracion, datosFinales, tablaInicioX + 2, yTexto + 2, tablaAncho - 4, true);

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8});

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