import jsPDF from "jspdf";
import drawColorBox from '../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { normalizeList } from "../../utils/listUtils.js";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import { getSign, convertirGenero } from "../../utils/helpers.js";
import footerTR from '../components/footerTR.jsx';

export default function InformePsicologicoAdecoEstres_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Normalizador único de datos de entrada
  function buildDatosFinales(raw) {
    const datosReales = {
      apellidosNombres: String((((raw?.apellidosPaciente ?? '') + ' ' + (raw?.nombresPaciente ?? '')).trim())),
      fechaExamen: formatearFechaCorta(raw?.fechaEntrevista ?? ''), 
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
      apellidosNombres: 'VIVIANA DELGADO VEGA alias “LA FIERA”',
      fechaExamen: '15/10/2025',
      sexo: 'Femenino',
      documentoIdentidad: '66666666',
      edad: '28',
      fechaNacimiento: '22/03/1997',
      domicilio: 'Asentamiento Humano El Peligro - Zona Roja',
      areaTrabajo: 'Operaciones Nocturnas',
      puestoTrabajo: 'Jefa de Robos Selectivos',
      empresa: 'EXTORSIONES S.A.C.',
      contrata: 'Servicios Oscuros Integrales E.I.R.L.',
      sede: 'Arequipa - Cerro Verde',
      numeroFicha: '000456',
      color: 3,
      codigoColor: '#FF5722',
      textoColor: 'A',
      apto: true,
      // Datos de resultados
      resultados: [
        { numero: '1', prueba: 'Escala Sintomática de Estrés', resultado: 'BAJO' },
        { numero: '2', prueba: 'Escala de Fatiga', resultado: 'MEDIO' },
        { numero: '3', prueba: 'Escala de Somnolencia', resultado: 'ALTO' }
      ],
      // Datos de análisis FODA
      fortalezasOportunidades: 'El trabajador demuestra habilidades técnicas sólidas en su área de especialización, mostrando capacidad de adaptación a nuevas tecnologías y procesos. Presenta buena comunicación interpersonal y trabajo en equipo, lo que facilita la colaboración efectiva. Además, tiene experiencia previa en entornos industriales similares y muestra interés en el desarrollo profesional continuo.',
      debilidadesAmenazas: 'Se observa cierta tendencia al estrés en situaciones de alta presión laboral, especialmente cuando hay cambios inesperados en los procedimientos. Presenta dificultades ocasionales en la gestión del tiempo cuando las tareas son múltiples y simultáneas. También se identifica una necesidad de mejora en las técnicas de relajación y manejo del estrés para optimizar su rendimiento laboral.',
      // Datos de observaciones y recomendaciones
      observaciones: 'Durante la evaluación psicológica se observó que el trabajador presenta un perfil adecuado para el puesto de trabajo, mostrando habilidades técnicas sólidas y buena capacidad de adaptación. Sin embargo, se identificaron algunas áreas de mejora en el manejo del estrés y la gestión del tiempo. El trabajador demuestra compromiso con su desarrollo profesional y está dispuesto a implementar las recomendaciones sugeridas para optimizar su rendimiento laboral.',
      recomendaciones: 'Se recomienda implementar un programa de capacitación en técnicas de manejo del estrés y gestión del tiempo. Es importante establecer pausas activas durante la jornada laboral y promover un ambiente de trabajo colaborativo. Se sugiere realizar seguimientos periódicos para evaluar el progreso y ajustar las estrategias según sea necesario. Además, se recomienda fomentar la comunicación abierta entre el trabajador y su supervisor para identificar oportunamente cualquier dificultad.',
      conclusiones: 'El trabajador es APTO para el puesto de trabajo, considerando que presenta las competencias técnicas requeridas y demuestra potencial para el desarrollo de las habilidades identificadas como áreas de mejora. Con la implementación de las recomendaciones sugeridas, se espera un desempeño satisfactorio y un mejor bienestar laboral. Se recomienda un seguimiento a los 6 meses para evaluar el progreso y la efectividad de las medidas implementadas.'
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
    doc.text("INF. PSIC. – ESTRÉS/ FATIGA Y SOMNOLENCIA", pageW / 2, 35, { align: "center" });

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
    const tablaInicioX = 10;
    const tablaAncho = 190;

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
  const tablaInicioX = 10;
  const tablaAncho = 190;
  let yPos = 40;
  const filaAltura = 5;

  // Header de datos de filiación
  yPos = dibujarHeaderSeccion("I. DATOS DE FILIACIÓN", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
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

  // Primera fila: Apellidos y Nombres
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 1.5, tablaAncho - 40);
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

  // === SECCIÓN 2: RESULTADOS ===
  // Header de resultados
  yPos = dibujarHeaderSeccion("II.- RESULTADOS", yPos, filaAltura);

  // Fila con división media: INTELIGENCIA | RESULTADO
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido de la fila de headers
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("INTELIGENCIA", tablaInicioX + tablaAncho/4, yPos + 3.5, { align: "center" });
  doc.text("RESULTADO", tablaInicioX + (tablaAncho/2) + (tablaAncho/4), yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // Fila con 3 divisiones: | 1 | Escala Sintomática de Estrés | BAJO |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 20, yPos, tablaInicioX + 20, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Renderizar resultados dinámicamente
  datosFinales.resultados.forEach((resultado, index) => {
    if (index > 0) {
      // Dibujar líneas de la fila
      doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
      doc.line(tablaInicioX + 20, yPos, tablaInicioX + 20, yPos + filaAltura);
      doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + filaAltura);
      doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
      doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
      doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
    }

    // Contenido de la fila de datos
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(resultado.numero, tablaInicioX + 10, yPos + 3.5, { align: "center" });
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(resultado.prueba, tablaInicioX + 22, yPos + 3.5);
    doc.text(resultado.resultado, tablaInicioX + tablaAncho/2 + 2, yPos + 3.5);
    yPos += filaAltura;
  });

  // === SECCIÓN 3: ANÁLISIS FODA ===
  // Header de análisis FODA
  yPos = dibujarHeaderSeccion("III.- ANÁLISIS FODA", yPos, filaAltura);

  // Función para calcular altura dinámica de texto
  const calcularAlturaTexto = (texto, anchoMaximo, fontSize) => {
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

  // Fila 1: Fortalezas / Oportunidades
  const alturaFila1 = calcularAlturaTexto(datosFinales.fortalezasOportunidades, tablaAncho - 4, 8);
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila1);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila1);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila1, tablaInicioX + tablaAncho, yPos + alturaFila1);

  // Contenido de Fortalezas / Oportunidades
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Fortalezas / Oportunidades:", tablaInicioX + 2, yPos + 3.5);
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.fortalezasOportunidades, tablaInicioX + 2, yPos + 7, tablaAncho - 4);
  yPos += alturaFila1;

  // Fila 2: Debilidades / Amenazas
  const alturaFila2 = calcularAlturaTexto(datosFinales.debilidadesAmenazas, tablaAncho - 4, 8);
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila2);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila2);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila2, tablaInicioX + tablaAncho, yPos + alturaFila2);

  // Contenido de Debilidades / Amenazas
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Debilidades / Amenazas:", tablaInicioX + 2, yPos + 3.5);
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.debilidadesAmenazas, tablaInicioX + 2, yPos + 7, tablaAncho - 4);
  yPos += alturaFila2;

  // === SECCIÓN 4: OBSERVACIONES Y RECOMENDACIONES ===
  // Header de observaciones y recomendaciones
  yPos = dibujarHeaderSeccion("IV.- OBSERVACIONES Y RECOMENDACIONES", yPos, filaAltura);

  // Función para dibujar subheader con color celeste
  const dibujarSubHeaderCeleste = (titulo, yPos, alturaHeader = 5) => {
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // Dibujar fondo celeste
    doc.setFillColor(173, 216, 230); // Color celeste claro
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');

    // Dibujar líneas del subheader
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);

    // Dibujar texto del subtítulo
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);

    return yPos + alturaHeader;
  };

  // Fila de Observaciones (creciente)
  const alturaObservaciones = calcularAlturaTexto(datosFinales.observaciones, tablaAncho - 4, 8);
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaObservaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaObservaciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaObservaciones, tablaInicioX + tablaAncho, yPos + alturaObservaciones);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.observaciones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
  yPos += alturaObservaciones;

  // Subheader celeste: Recomendaciones
  yPos = dibujarSubHeaderCeleste("Recomendaciones", yPos, filaAltura);

  // Fila de Recomendaciones (creciente)
  const alturaRecomendaciones = calcularAlturaTexto(datosFinales.recomendaciones, tablaAncho - 4, 8);
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaRecomendaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaRecomendaciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaRecomendaciones, tablaInicioX + tablaAncho, yPos + alturaRecomendaciones);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.recomendaciones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
  yPos += alturaRecomendaciones;

  // Subheader celeste: Conclusiones
  yPos = dibujarSubHeaderCeleste("Conclusiones", yPos, filaAltura);

  // Fila de Conclusiones (creciente)
  const alturaConclusiones = calcularAlturaTexto(datosFinales.conclusiones, tablaAncho - 4, 8);
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaConclusiones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaConclusiones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaConclusiones, tablaInicioX + tablaAncho, yPos + alturaConclusiones);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.conclusiones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
  yPos += alturaConclusiones;

  // === SECCIÓN DE FIRMAS ===
  const yFirmas = yPos; // Sin separación después de la última sección
  const alturaSeccionFirmas = 30; // Altura para la sección de firmas

  // Dibujar las líneas de la sección de firmas (1 columna completa)
  doc.line(tablaInicioX, yFirmas, tablaInicioX, yFirmas + alturaSeccionFirmas); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea derecha
  doc.line(tablaInicioX, yFirmas, tablaInicioX + tablaAncho, yFirmas); // Línea superior
  doc.line(tablaInicioX, yFirmas + alturaSeccionFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea inferior

  // === FIRMA DEL MÉDICO ===
  const firmaMedicoX = tablaInicioX + 80; // Centrado en la columna
  const firmaMedicoY = yFirmas + 3;
  
  // Agregar firma y sello médico
  let firmaMedicoUrl = getSign(data, "SELLOFIRMA");
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 45;
      const imgHeight = 20;
      const x = firmaMedicoX;
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(8);
  const centroColumna = tablaInicioX + (tablaAncho / 2);
  doc.text("Sello y Firma del Médico", centroColumna, yFirmas + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumna, yFirmas + 28.5, { align: "center" });

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
