import jsPDF from "jspdf";
import drawColorBox from '../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import { getSign, convertirGenero } from "../../utils/helpers.js";
import footerTR from '../components/footerTR.jsx';

export default function formatPsicologia_SuficienciaEspaciosC(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Normalizador único de datos de entrada
  function buildDatosFinales(raw) {
    const datosReales = {
      apellidosNombres: String((((raw?.apellidosPaciente ?? '') + ' ' + (raw?.nombresPaciente ?? '')).trim())),
      fechaExamen: formatearFechaCorta(raw?.fechaEntrevista ?? ''), 
      tipoExamen: String(raw?.nombreExamen ?? ''),
      sexo: convertirGenero(raw?.sexoPaciente ?? ''),
      documentoIdentidad: String(raw?.dniPaciente ?? ''),
      edad: String(raw?.edadPaciente ?? ''),
      fechaNacimiento: formatearFechaCorta(raw?.fechaNacimientoPaciente ?? ''),
      domicilio: String(raw?.direccionPaciente ?? ''),
      areaTrabajo: String(raw?.areaPaciente ?? ''),
      puestoTrabajo: String(raw?.cargoPaciente ?? ''),
      empresa: String(raw?.empresa ?? ''),
      contrata: String(raw?.contrata ?? ''),
      sede: String(raw?.sede ?? ''),
      numeroFicha: String(raw?.norden ?? ""),
      color: Number(raw?.color ?? 0),
      codigoColor: String(raw?.codigoColor ?? ''),
      textoColor: String(raw?.textoColor ?? ''),
      apto: (typeof raw?.aprobo === 'boolean') ? raw.aprobo : false
    };

    const datosPrueba = {
      apellidosNombres: 'GARCÍA LÓPEZ, MARÍA ELENA',
      fechaExamen: '25/11/2025',
      tipoExamen: 'PRE-OCUPACIONAL',
      sexo: 'Femenino',
      documentoIdentidad: '87654321',
      edad: '32',
      fechaNacimiento: '15/06/1993',
      domicilio: 'Av. Industrial 456 - Lima',
      areaTrabajo: 'Operaciones Mineras',
      puestoTrabajo: 'Supervisora de Espacios Confinados',
      empresa: 'MINERA CONFINADA S.A.C.',
      contrata: 'SERVICIOS ESPECIALIZADOS E.I.R.L.',
      sede: 'Lima - San Isidro',
      numeroFicha: '000123',
      color: 1,
      codigoColor: '#4CAF50',
      textoColor: 'A',
      apto: true
    };

    const selected = (raw && (raw.norden)) ? datosReales : datosPrueba;
    return selected;
  }

  const datosFinales = buildDatosFinales(data);

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Títulos
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("EVALUACIÓN PSICOLÓGICA PARA ESPACIOS CONFINADOS", pageW / 2, 35, { align: "center" });

    // Número de Ficha, Sede, Fecha y Página
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("Nro de ficha: ", pageW - 70, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 50, 16);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosFinales.sede, pageW - 70, 20);
    doc.text("Fecha de examen: " + (datosFinales.fechaExamen || ""), pageW - 70, 25);
    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 25, 8);

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

  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
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
    const tablaInicioX = 7.5;
    const tablaAncho = 195;

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
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);

    return yPos + alturaHeader;
  };

  // === PÁGINA 1 ===
  drawHeader(numeroPagina);

  // === SECCIÓN 1: DATOS DE FILIACIÓN ===
  const tablaInicioX = 7.5;
  const tablaAncho = 195;
  let yPos = 40;
  const filaAltura = 5;

  // Header de datos de filiación
  yPos = dibujarHeaderSeccion("I. DATOS DE FILIACIÓN", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres | Tipo de Examen (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
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

  // Cuarta fila: Área de Trabajo, Puesto de Trabajo (2 columnas)
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

  // Sexta fila: Contratista (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 40 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres | Tipo de Examen
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 1.5, 70);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.tipoExamen, tablaInicioX + 155, yTexto + 1.5, 50);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.edad + " Años", tablaInicioX + 58, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.sexo, tablaInicioX + 105, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.fechaNacimiento, tablaInicioX + 165, yTexto + 1.5);
  yTexto += filaAltura;

  // Tercera fila: Domicilio
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.domicilio, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Cuarta fila: Área de Trabajo, Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo, tablaInicioX + 30, yTexto + 1.5, 50);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Puesto de Trabajo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo, tablaInicioX + 122, yTexto + 1.5, 65);
  yTexto += filaAltura;

  // Quinta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 25);
  yTexto += filaAltura;

  // Sexta fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.contrata, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // === SECCIÓN 2: CRITERIOS PSICOLÓGICOS ===
  // Fila de texto centrado sin color de fondo
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("CRITERIOS PSICOLÓGICOS", pageW / 2, yTexto + 3, { align: "center" });
  yTexto += 6; // Espacio después del título

  // Fila con 5 divisiones: Aspecto Intelectual (más ancho) | I | NPI | NP | NPS | S
  const anchoAspectoIntelectual = 80; // Columna más ancha para el aspecto
  const anchoColumnaEvaluacion = (tablaAncho - anchoAspectoIntelectual) / 5; // Las 5 columnas de evaluación
  
  const posicionesColumnas = [
    tablaInicioX, // Aspecto Intelectual
    tablaInicioX + anchoAspectoIntelectual, // I
    tablaInicioX + anchoAspectoIntelectual + anchoColumnaEvaluacion, // NPI
    tablaInicioX + anchoAspectoIntelectual + anchoColumnaEvaluacion * 2, // NP
    tablaInicioX + anchoAspectoIntelectual + anchoColumnaEvaluacion * 3, // NPS
    tablaInicioX + anchoAspectoIntelectual + anchoColumnaEvaluacion * 4, // S
    tablaInicioX + tablaAncho // Final
  ];

  // Dibujar líneas de la tabla de criterios
  doc.line(tablaInicioX, yTexto, tablaInicioX, yTexto + filaAltura); // Línea izquierda
  posicionesColumnas.forEach((pos, index) => {
    if (index > 0) {
      doc.line(pos, yTexto, pos, yTexto + filaAltura); // Líneas verticales
    }
  });
  doc.line(tablaInicioX, yTexto, tablaInicioX + tablaAncho, yTexto); // Línea superior
  doc.line(tablaInicioX, yTexto + filaAltura, tablaInicioX + tablaAncho, yTexto + filaAltura); // Línea inferior

  // Contenido de los headers
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Aspecto Intelectual", tablaInicioX + 2, yTexto + 3.5);
  doc.text("I", posicionesColumnas[1] + anchoColumnaEvaluacion/2, yTexto + 3.5, { align: "center" });
  doc.text("NPI", posicionesColumnas[2] + anchoColumnaEvaluacion/2, yTexto + 3.5, { align: "center" });
  doc.text("NP", posicionesColumnas[3] + anchoColumnaEvaluacion/2, yTexto + 3.5, { align: "center" });
  doc.text("NPS", posicionesColumnas[4] + anchoColumnaEvaluacion/2, yTexto + 3.5, { align: "center" });
  doc.text("S", posicionesColumnas[5] + anchoColumnaEvaluacion/2, yTexto + 3.5, { align: "center" });
  yTexto += filaAltura;

  // Datos de aspectos psicológicos
  const aspectosPsicologicos = [
    { numero: 1, aspecto: "Razonamiento", evaluacion: "I" },
    { numero: 2, aspecto: "Memoria", evaluacion: "NPI" },
    { numero: 3, aspecto: "Atención", evaluacion: "NP" },
    { numero: 4, aspecto: "Concentración", evaluacion: "NPS" },
    { numero: 5, aspecto: "Percepción", evaluacion: "S" }
  ];

  // Dibujar filas de datos
  aspectosPsicologicos.forEach((aspecto, index) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yTexto, tablaInicioX, yTexto + filaAltura); // Línea izquierda
    posicionesColumnas.forEach((pos, posIndex) => {
      if (posIndex > 0) {
        doc.line(pos, yTexto, pos, yTexto + filaAltura); // Líneas verticales
      }
    });
    doc.line(tablaInicioX, yTexto, tablaInicioX + tablaAncho, yTexto); // Línea superior
    doc.line(tablaInicioX, yTexto + filaAltura, tablaInicioX + tablaAncho, yTexto + filaAltura); // Línea inferior

    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);
    
    // Número
    doc.text(aspecto.numero.toString(), tablaInicioX + 2, yTexto + 3.5);
    
    // Aspecto psicológico
    doc.text(aspecto.aspecto, tablaInicioX + 12, yTexto + 3.5);
    
    // Marcar la evaluación correspondiente con X
    const evaluaciones = ["I", "NPI", "NP", "NPS", "S"];
    evaluaciones.forEach((evaluacion, evalIndex) => {
      if (aspecto.evaluacion === evaluacion) {
        doc.setFont("helvetica", "bold").setFontSize(10);
        doc.text("X", posicionesColumnas[evalIndex + 1] + anchoColumnaEvaluacion/2, yTexto + 3.5, { align: "center" });
        doc.setFont("helvetica", "normal").setFontSize(8);
      }
    });
    
    yTexto += filaAltura;
  });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 5 });

  // Imprimir
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
