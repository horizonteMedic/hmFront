import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import { convertirGenero } from "../../../utils/helpers.js";
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from '../../../utils/dibujarFirmas.js';

export default async function formatPsicologia_SuficienciaEspaciosC(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  // Contador de páginas dinámico
  let numeroPagina = 1;

  function buildDatosFinales(raw) {
    return {
      // Datos personales
      apellidosNombres: String((((raw?.apellidosPaciente ?? '') + ' ' + (raw?.nombresPaciente ?? '')).trim())),
      fechaExamen: formatearFechaCorta(raw?.fecha ?? raw?.fechaExamen ?? raw?.fechaEntrevista ?? ''),
      tipoExamen: String(raw?.nombreExamen ?? raw?.tipoExamen ?? ''),
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

      // Resultados y conclusiones
      apto: (typeof raw?.apto === 'boolean') ? raw.apto : false,
      analisisResultados: String(raw?.analisis ?? raw?.analisisResultados ?? ''),
      recomendaciones: String(raw?.recomendacion ?? raw?.recomendaciones ?? ''),
      conclusiones: String(raw?.conclusiones ?? '')
    };
  }

  const datosFinales = buildDatosFinales(data);
  // Flag para identificar reportes de la empresa OHLA y ocultar secciones específicas
  const esOhla = Boolean(data?.esOhla || (datosFinales.empresa || '').toUpperCase().includes('OHLA'));

  // Header reutilizable
  const drawHeader = async (pageNumber) => {
    // Logo y membrete
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Títulos
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("EVALUACIÓN PSICOLÓGICA PARA ESPACIOS CONFINADOS", pageW / 2, 35, { align: "center" });

    // Número de Ficha, Sede, Fecha y Página
    doc.setFont("helvetica", "normal").setFontSize(8);
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

  // Función para calcular altura dinámica de texto
  const calcularAlturaTexto = (texto, anchoMaximo) => {
    const palabras = texto.split(' ');
    let lineaActual = '';
    let lineas = 1;

    palabras.forEach(palabra => {
      const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);

      if (anchoTexto <= anchoMaximo) {
        lineaActual = textoPrueba;
      } else {
        if (lineaActual) {
          lineas++;
          lineaActual = palabra;
        } else {
          lineas++;
        }
      }
    });

    // Altura mínima de 15mm, altura por línea de 3mm
    const alturaCalculada = lineas * 3 + 2;
    return Math.max(alturaCalculada, 20);
  };

  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;

    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // Dibujar fondo gris más oscuro
    doc.setFillColor(196, 196, 196);
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

  // === PÁGINA 1 ===
  await drawHeader(numeroPagina);

  // === SECCIÓN 1: DATOS DE FILIACIÓN ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
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

  // Cuarta fila: Área de Trabajo (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Puesto de Trabajo (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Sexta fila: Empresa (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Séptima fila: Contratista (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 40 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres | Tipo de Examen
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 1.5, 70);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.tipoExamen, tablaInicioX + 155, yTexto + 1.5, 50);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
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
  doc.text(datosFinales.fechaNacimiento, tablaInicioX + 165, yTexto + 1.5);
  yTexto += filaAltura;

  // Tercera fila: Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.domicilio, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Cuarta fila: Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo, tablaInicioX + 30, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Quinta fila: Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo, tablaInicioX + 35, yTexto + 1.5, tablaAncho - 35);
  yTexto += filaAltura;

  // Sexta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 25);
  yTexto += filaAltura;

  // Séptima fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.contrata, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // === SECCIÓN 2: CRITERIOS PSICOLÓGICOS ===
  if (!esOhla) {
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
    doc.text("I", posicionesColumnas[1] + anchoColumnaEvaluacion / 2, yTexto + 3.5, { align: "center" });
    doc.text("NPI", posicionesColumnas[2] + anchoColumnaEvaluacion / 2, yTexto + 3.5, { align: "center" });
    doc.text("NP", posicionesColumnas[3] + anchoColumnaEvaluacion / 2, yTexto + 3.5, { align: "center" });
    doc.text("NPS", posicionesColumnas[4] + anchoColumnaEvaluacion / 2, yTexto + 3.5, { align: "center" });
    doc.text("S", posicionesColumnas[5] + anchoColumnaEvaluacion / 2, yTexto + 3.5, { align: "center" });
    yTexto += filaAltura;

    // Función para obtener evaluación desde data
    const getEvaluacion = (prefix) => {
      // Manejar caso especial de "atencion" que puede venir como "atencio" (sin 'n')
      if (prefix === "atencion") {
        if (data[`atencionI`]) return "I";
        if (data[`atencioNPI`] || data[`atencionNPI`]) return "NPI"; // Manejar ambos casos
        if (data[`atencionNP`]) return "NP";
        if (data[`atencionNPS`]) return "NPS";
        if (data[`atencionS`]) return "S";
        return "";
      }
      // Para otros prefijos
      if (data[`${prefix}I`]) return "I";
      if (data[`${prefix}NPI`]) return "NPI";
      if (data[`${prefix}NP`]) return "NP";
      if (data[`${prefix}NPS`]) return "NPS";
      if (data[`${prefix}S`]) return "S";
      return "";
    };

    // Datos de aspectos psicológicos desde data (solo 5)
    const aspectosPsicologicos = [
      { numero: 1, aspecto: "Razonamiento y Resolucion de problemas", evaluacion: getEvaluacion("razonamiento") },
      { numero: 2, aspecto: "Memoria", evaluacion: getEvaluacion("memoria") },
      { numero: 3, aspecto: "Atencion y Concentración", evaluacion: getEvaluacion("atencion") },
      { numero: 4, aspecto: "Coordinación viso-motora", evaluacion: getEvaluacion("visoMotora") },
      { numero: 5, aspecto: "Orientación Espacial", evaluacion: getEvaluacion("orientacionEspacial") }
    ];

    // Dibujar filas de datos
    aspectosPsicologicos.forEach((aspecto) => {
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
          doc.text("X", posicionesColumnas[evalIndex + 1] + anchoColumnaEvaluacion / 2, yTexto + 3.5, { align: "center" });
          doc.setFont("helvetica", "normal").setFontSize(8);
        }
      });

      yTexto += filaAltura;
    });

    // Espacio antes de la nueva sección
    yTexto += 3;
  } else {
    // Si es OHLA, no se muestra la tabla de criterios psicológicos
    // y solo se deja un pequeño espacio antes de la siguiente sección
    yTexto += 3;
  }

  // === SECCIÓN 3: ASPECTOS PERSONALIDAD ===

  // Título de la sección
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("ASPECTOS PERSONALIDAD", pageW / 2, yTexto + 3, { align: "center" });
  yTexto += 6; // Espacio después del título

  // Datos de aspectos de personalidad desde data
  const getEstabilidadEmocional = () => {
    if (data.estabilidadEmocionalInestable) return "Inestable";
    if (data.estabilidadEmocionalEstable) return "Estable";
    return "";
  };

  const getAnsiedadGeneral = () => {
    if (data.ansiedadGeneralCaso) return "Caso";
    if (data.ansiedadGeneralNoCaso) return "No Caso";
    return "";
  };

  const getAnsiedadEspacios = () => {
    if (data.ansiedadEspaciosConfinadosNada) return "Nada";
    if (data.ansiedadEspaciosConfinadosPoca) return "Poca ansiedad";
    if (data.ansiedadEspaciosConfinadosModerada) return "Moderadamente ansioso";
    if (data.ansiedadEspaciosConfinadosElevada) return "Elevadamente ansioso";
    return "";
  };

  const aspectosPersonalidad = [
    {
      aspecto: "Estabilidad emocional",
      opciones: ["Inestable", "Estable"],
      seleccionado: getEstabilidadEmocional()
    },
    {
      aspecto: "Nivel de ansiedad general",
      opciones: ["Caso", "No Caso"],
      seleccionado: getAnsiedadGeneral()
    },
    {
      aspecto: "Ansiedad a espacios confinados",
      opciones: ["Nada", "Poca ansiedad", "Moderadamente ansioso", "Elevadamente ansioso"],
      seleccionado: getAnsiedadEspacios()
    }
  ];

  // Ancho fijo para todas las columnas de X (igual para todas las filas)
  const anchoColumnaX_Fijo = 5; // Ancho fijo y consistente para todas las celdas de X

  // Dibujar cada fila de aspecto de personalidad
  aspectosPersonalidad.forEach((aspecto, index) => {
    const anchoColumnaAspecto = 50; // Ancho para el nombre del aspecto
    const numOpciones = aspecto.opciones.length;

    // Anchos personalizados para la tercera fila (Ansiedad a espacios confinados)
    const anchosPersonalizadosFila3 = [
      { texto: 20 },  // "Nada"
      { texto: 30 },  // "Poca ansiedad"
      { texto: 40 },  // "Moderadamente ansioso"
      { texto: 40 }   // "Elevadamente ansioso"
    ];

    // Calcular posiciones de las columnas
    const posicionesCols = [tablaInicioX]; // Inicio (columna del aspecto)
    posicionesCols.push(tablaInicioX + anchoColumnaAspecto); // División después del aspecto

    let posicionActual = tablaInicioX + anchoColumnaAspecto;

    if (index === 2) {
      // Tercera fila: usar anchos personalizados para texto, pero X fijo
      anchosPersonalizadosFila3.forEach((ancho) => {
        posicionActual += ancho.texto;
        posicionesCols.push(posicionActual); // Fin de columna de texto
        posicionActual += anchoColumnaX_Fijo;
        posicionesCols.push(posicionActual); // Fin de columna de X
      });
    } else {
      // Otras filas: usar cálculo uniforme
      const anchoRestante = tablaAncho - anchoColumnaAspecto - (numOpciones * anchoColumnaX_Fijo);
      const anchoColumnaOpcion = anchoRestante / numOpciones; // Ancho para cada opción (distribución uniforme)

      for (let i = 0; i < numOpciones; i++) {
        posicionActual += anchoColumnaOpcion;
        posicionesCols.push(posicionActual); // Fin de columna de texto
        posicionActual += anchoColumnaX_Fijo;
        posicionesCols.push(posicionActual); // Fin de columna de X
      }
    }

    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yTexto, tablaInicioX, yTexto + filaAltura); // Línea izquierda
    posicionesCols.forEach((pos, posIndex) => {
      if (posIndex > 0 && posIndex < posicionesCols.length - 1) {
        doc.line(pos, yTexto, pos, yTexto + filaAltura); // Líneas verticales
      }
    });
    doc.line(tablaInicioX + tablaAncho, yTexto, tablaInicioX + tablaAncho, yTexto + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yTexto, tablaInicioX + tablaAncho, yTexto); // Línea superior
    doc.line(tablaInicioX, yTexto + filaAltura, tablaInicioX + tablaAncho, yTexto + filaAltura); // Línea inferior

    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);

    // Nombre del aspecto (alineado a la izquierda como en CRITERIOS PSICOLÓGICOS)
    doc.text(aspecto.aspecto, tablaInicioX + 2, yTexto + 3.5);

    // Opciones: texto en una columna, X en la siguiente si está seleccionada
    let posicionOpcion = tablaInicioX + anchoColumnaAspecto;

    aspecto.opciones.forEach((opcion, opcIndex) => {
      let anchoTextoOpcion;

      if (index === 2) {
        // Tercera fila: usar anchos personalizados para texto
        anchoTextoOpcion = anchosPersonalizadosFila3[opcIndex].texto;
      } else {
        // Otras filas: usar cálculo uniforme
        const anchoRestante = tablaAncho - anchoColumnaAspecto - (numOpciones * anchoColumnaX_Fijo);
        anchoTextoOpcion = anchoRestante / numOpciones;
      }

      const inicioOpcion = posicionOpcion;
      const centroColumnaX = inicioOpcion + anchoTextoOpcion + (anchoColumnaX_Fijo / 2);

      // Mostrar el texto de la opción alineado a la izquierda (como en CRITERIOS PSICOLÓGICOS)
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(opcion, inicioOpcion + 2, yTexto + 3.5);

      // Marcar con X si está seleccionada (centrada en su columna)
      if (aspecto.seleccionado === opcion) {
        doc.setFont("helvetica", "bold").setFontSize(10);
        doc.text("X", centroColumnaX, yTexto + 3.5, { align: "center" });
        doc.setFont("helvetica", "normal").setFontSize(8);
      }

      // Actualizar posición para la siguiente opción
      posicionOpcion += anchoTextoOpcion + anchoColumnaX_Fijo;
    });

    yTexto += filaAltura;
  });

  // === SECCIÓN 4: ANÁLISIS Y RESULTADOS ===
  yTexto = dibujarHeaderSeccion("ANÁLISIS Y RESULTADOS:", yTexto, filaAltura);

  // Fila de Análisis y Resultados (creciente)
  const alturaAnalisis = calcularAlturaTexto(datosFinales.analisisResultados, tablaAncho - 4);

  doc.line(tablaInicioX, yTexto, tablaInicioX, yTexto + alturaAnalisis);
  doc.line(tablaInicioX + tablaAncho, yTexto, tablaInicioX + tablaAncho, yTexto + alturaAnalisis);
  doc.line(tablaInicioX, yTexto, tablaInicioX + tablaAncho, yTexto);
  doc.line(tablaInicioX, yTexto + alturaAnalisis, tablaInicioX + tablaAncho, yTexto + alturaAnalisis);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.analisisResultados, tablaInicioX + 2, yTexto + 3, tablaAncho - 4);
  yTexto += alturaAnalisis;

  // === SECCIÓN 5: RECOMENDACIONES ===
  yTexto = dibujarHeaderSeccion("RECOMENDACIONES:", yTexto, filaAltura);

  // Fila de Recomendaciones (creciente)
  const alturaRecomendaciones = calcularAlturaTexto(datosFinales.recomendaciones, tablaAncho - 4);

  doc.line(tablaInicioX, yTexto, tablaInicioX, yTexto + alturaRecomendaciones);
  doc.line(tablaInicioX + tablaAncho, yTexto, tablaInicioX + tablaAncho, yTexto + alturaRecomendaciones);
  doc.line(tablaInicioX, yTexto, tablaInicioX + tablaAncho, yTexto);
  doc.line(tablaInicioX, yTexto + alturaRecomendaciones, tablaInicioX + tablaAncho, yTexto + alturaRecomendaciones);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.recomendaciones, tablaInicioX + 2, yTexto + 3, tablaAncho - 4);
  yTexto += alturaRecomendaciones;

  // === SECCIÓN 6: CONCLUSIONES ===
  yTexto = dibujarHeaderSeccion("CONCLUSIONES", yTexto, filaAltura);

  // Fila con: APTO | (columna X) | NO APTO | (columna X)
  const anchoColumnaX = 5; // Ancho fijo para las columnas de X
  const anchoRestante = tablaAncho - (2 * anchoColumnaX);
  const anchoColumnaApto = anchoRestante / 2; // Dividir el espacio restante entre APTO y NO APTO

  // Calcular posiciones de las columnas
  const posicionesConclusiones = [
    tablaInicioX,
    tablaInicioX + anchoColumnaApto,
    tablaInicioX + anchoColumnaApto + anchoColumnaX,
    tablaInicioX + anchoColumnaApto + anchoColumnaX + anchoColumnaApto,
    tablaInicioX + anchoColumnaApto + anchoColumnaX + anchoColumnaApto + anchoColumnaX,
    tablaInicioX + tablaAncho
  ];

  // Dibujar líneas de la fila
  doc.line(tablaInicioX, yTexto, tablaInicioX, yTexto + filaAltura);
  posicionesConclusiones.forEach((pos, posIndex) => {
    if (posIndex > 0 && posIndex < posicionesConclusiones.length - 1) {
      doc.line(pos, yTexto, pos, yTexto + filaAltura);
    }
  });
  doc.line(tablaInicioX + tablaAncho, yTexto, tablaInicioX + tablaAncho, yTexto + filaAltura);
  doc.line(tablaInicioX, yTexto, tablaInicioX + tablaAncho, yTexto);
  doc.line(tablaInicioX, yTexto + filaAltura, tablaInicioX + tablaAncho, yTexto + filaAltura);

  // Contenido de la fila
  doc.setFont("helvetica", "normal").setFontSize(8);

  // APTO
  const centroApto = tablaInicioX + (anchoColumnaApto / 2);
  doc.text("APTO", centroApto, yTexto + 3.5, { align: "center" });

  // X para APTO
  const centroColumnaXApto = tablaInicioX + anchoColumnaApto + (anchoColumnaX / 2);

  // NO APTO
  const inicioNoApto = tablaInicioX + anchoColumnaApto + anchoColumnaX;
  const centroNoApto = inicioNoApto + (anchoColumnaApto / 2);
  doc.text("NO APTO", centroNoApto, yTexto + 3.5, { align: "center" });

  // X para NO APTO
  const centroColumnaXNoApto = inicioNoApto + anchoColumnaApto + (anchoColumnaX / 2);

  // Marcar X según si está apto o no apto
  if (datosFinales.apto) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", centroColumnaXApto, yTexto + 3.5, { align: "center" });
  } else {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", centroColumnaXNoApto, yTexto + 3.5, { align: "center" });
  }

  yTexto += filaAltura;

  // === SECCIÓN DE FIRMAS ===
  const yFirmas = yTexto;
  const alturaSeccionFirmas = 30; // Altura para la sección de firmas

  // Dibujar las líneas de la sección de firmas (1 columna completa)
  doc.line(tablaInicioX, yFirmas, tablaInicioX, yFirmas + alturaSeccionFirmas); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea derecha
  doc.line(tablaInicioX, yFirmas, tablaInicioX + tablaAncho, yFirmas); // Línea superior
  doc.line(tablaInicioX, yFirmas + alturaSeccionFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea inferior

  // Usar helper para dibujar firmas dentro de la fila
  await dibujarFirmas({ doc, datos: data, y: yFirmas + 2, pageW });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 5 });

  if (docExistente) {
    return doc;
  } else {
    imprimir(doc);
  }
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
