import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import { getSign, convertirGenero } from "../../../utils/helpers.js";
import footerTR from '../../components/footerTR.jsx';

export default function InformePsicologico_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Normalizador único de datos de entrada
  function buildDatosFinales(raw) {
    const datosReales = {
      apellidosNombres: String((((raw?.apellidosPaciente ?? '') + ' ' + (raw?.nombresPaciente ?? '')).trim())),
      fechaExamen: formatearFechaCorta(raw?.fechaEntrevista ?? raw?.fechaExamen ?? ''),
      sexo: convertirGenero(raw?.sexoPaciente ?? ''),
      documentoIdentidad: String(raw?.dniPaciente ?? ''),
      edad: String(raw?.edadPaciente ?? ''),
      fechaNacimiento: formatearFechaCorta(raw?.fechaNacimientoPaciente ?? ''),
      domicilio: String(raw?.direccionPaciente ?? ''),
      areaTrabajo: String(raw?.areaPaciente ?? ''),
      puestoTrabajo: String(raw?.cargoPaciente ?? ''),
      empresa: String(raw?.empresa ?? ''),
      contrata: String(raw?.contrata ?? ''),
      sede: String(raw?.sede ?? raw?.nombreSede ?? ''),
      numeroFicha: String(raw?.norden ?? ""),
      color: Number(raw?.color ?? 0),
      codigoColor: String(raw?.codigoColor ?? ''),
      textoColor: String(raw?.textoColor ?? ''),
      // Criterios psicológicos
      criteriosInteligencia: raw?.criteriosInteligencia ?? [],
      criteriosPersonalidad: raw?.criteriosPersonalidad ?? [],
      // Análisis FODA
      fortalezasOportunidades: String(raw?.fortalezasOportunidades ?? ''),
      debilidadesAmenazas: String(raw?.amenazasDebilidades ?? raw?.debilidadesAmenazas ?? ''),
      // Observaciones y recomendaciones
      observaciones: String(raw?.observaciones ?? ''),
      recomendaciones: String(raw?.recomendacion ?? raw?.recomendaciones ?? ''),
      // Conclusiones
      apto: (typeof raw?.apto === 'boolean') ? raw.apto : false,
      aptoConObservacion: (typeof raw?.aptoConObservacion === 'boolean') ? raw.aptoConObservacion : false,
      noApto: (typeof raw?.noApto === 'boolean') ? raw.noApto : false
    };

    const datosPrueba = {
      apellidosNombres: 'GARCÍA LÓPEZ, MARÍA ELENA',
      fechaExamen: '25/11/2025',
      sexo: 'Femenino',
      documentoIdentidad: '87654321',
      edad: '32',
      fechaNacimiento: '15/06/1993',
      domicilio: 'Av. Industrial 456 - Lima',
      areaTrabajo: 'Operaciones',
      puestoTrabajo: 'Supervisora',
      empresa: 'MINERA S.A.C.',
      contrata: 'SERVICIOS E.I.R.L.',
      sede: 'Lima - San Isidro',
      numeroFicha: '000123',
      color: 1,
      codigoColor: '#4CAF50',
      textoColor: 'A',
      // Criterios psicológicos de prueba
      criteriosInteligencia: [
        { numero: 1, criterio: 'Coeficiente intelectual', evaluacion: 'NPS' },
        { numero: 2, criterio: 'Comprensión', evaluacion: 'NP' },
        { numero: 3, criterio: 'Nivel Atención / Concentración', evaluacion: 'NP' },
        { numero: 4, criterio: 'Memoria a corto, mediano y largo plazo', evaluacion: 'NP' },
        { numero: 5, criterio: 'Coordinación visio- motora', evaluacion: 'NP' },
        { numero: 6, criterio: 'Orientación espacial', evaluacion: 'NP' },
        { numero: 7, criterio: 'Capacidad para discriminar detalles', evaluacion: 'NP' },
        { numero: 8, criterio: 'Capacidad de aprendizaje', evaluacion: 'NP' },
        { numero: 9, criterio: 'Capacidad de Análisis y síntesis', evaluacion: 'NP' }
      ],
      criteriosPersonalidad: [
        { numero: 1, criterio: 'Estabilidad emocional', evaluacion: 'S' },
        { numero: 2, criterio: 'Afrontamiento al estrés', evaluacion: 'S' },
        { numero: 3, criterio: 'Afrontamiento al riesgo', evaluacion: 'S' },
        { numero: 4, criterio: 'Relaciones interpersonales / Adaptación al medio', evaluacion: 'S' },
        { numero: 5, criterio: 'Disposición para acatar normas y reglas', evaluacion: 'S' }
      ],
      // Análisis FODA de prueba
      fortalezasOportunidades: 'Buen nivel de concentración y atención. Capacidad de trabajo en equipo.',
      debilidadesAmenazas: 'Nivel de estrés moderado en situaciones de alta presión.',
      // Observaciones y recomendaciones de prueba
      observaciones: 'El paciente presenta un perfil psicológico adecuado para el puesto.',
      recomendaciones: 'Se recomienda seguimiento periódico y capacitación en manejo de estrés.',
      // Conclusiones de prueba
      apto: false,
      aptoConObservacion: true,
      noApto: false
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
    doc.text("INFORME PSICOLÓGICO", pageW / 2, 35, { align: "center" });

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

    // Dibujar fondo gris
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
  drawHeader(numeroPagina);

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

  // Primera fila: Apellidos y Nombres
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

  // Tercera fila: Domicilio
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Cuarta fila: Área de Trabajo, Puesto de Trabajo
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Empresa
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Sexta fila: Contratista
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 40 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 1.5, 160);
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

  // Cuarta fila: Área de Trabajo, Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo, tablaInicioX + 30, yTexto + 1.5, 50);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo, tablaInicioX + 122, yTexto + 1.5, 65);
  yTexto += filaAltura;

  // Quinta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 25);
  yTexto += filaAltura;

  // Sexta fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.contrata, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // === SECCIÓN 2: CRITERIOS PSICOLÓGICOS ===
  // Header de la sección (empieza justo donde termina la tabla anterior, usando yPos que marca el final de las líneas)
  yPos = dibujarHeaderSeccion("II. CRITERIOS PSICOLÓGICOS", yPos, filaAltura);
  yTexto = yPos; // Sincronizar yTexto con yPos para el contenido siguiente

  // Configurar dimensiones de la tabla de criterios
  const anchoColumnaNumero = 15;
  const anchoColumnaCriterio = 100;
  const anchoColumnaEvaluacion = (tablaAncho - anchoColumnaNumero - anchoColumnaCriterio) / 5; // 5 columnas: S, NPS, NP, NPI, I

  // Posiciones de las columnas
  const posicionesColumnas = [
    tablaInicioX, // Inicio
    tablaInicioX + anchoColumnaNumero, // Después del número
    tablaInicioX + anchoColumnaNumero + anchoColumnaCriterio, // Después del criterio
    tablaInicioX + anchoColumnaNumero + anchoColumnaCriterio + anchoColumnaEvaluacion, // S
    tablaInicioX + anchoColumnaNumero + anchoColumnaCriterio + anchoColumnaEvaluacion * 2, // NPS
    tablaInicioX + anchoColumnaNumero + anchoColumnaCriterio + anchoColumnaEvaluacion * 3, // NP
    tablaInicioX + anchoColumnaNumero + anchoColumnaCriterio + anchoColumnaEvaluacion * 4, // NPI
    tablaInicioX + anchoColumnaNumero + anchoColumnaCriterio + anchoColumnaEvaluacion * 5, // I
    tablaInicioX + tablaAncho // Final
  ];

  // Definir las evaluaciones disponibles
  const evaluaciones = ["S", "NPS", "NP", "NPI", "I"];

  // Función para dibujar una fila de criterio
  const dibujarFilaCriterio = (criterio) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yTexto, tablaInicioX, yTexto + filaAltura);
    posicionesColumnas.forEach((pos, posIndex) => {
      if (posIndex > 0 && posIndex < posicionesColumnas.length - 1) {
        doc.line(pos, yTexto, pos, yTexto + filaAltura);
      }
    });
    doc.line(tablaInicioX + tablaAncho, yTexto, tablaInicioX + tablaAncho, yTexto + filaAltura);
    doc.line(tablaInicioX, yTexto, tablaInicioX + tablaAncho, yTexto);
    doc.line(tablaInicioX, yTexto + filaAltura, tablaInicioX + tablaAncho, yTexto + filaAltura);

    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);
    
    // Número
    doc.text(criterio.numero.toString(), tablaInicioX + 2, yTexto + 3.5);
    
    // Criterio
    doc.text(criterio.criterio, tablaInicioX + anchoColumnaNumero + 2, yTexto + 3.5);
    
    // Marcar la evaluación correspondiente con X
    evaluaciones.forEach((evaluacion, evalIndex) => {
      if (criterio.evaluacion === evaluacion) {
        const centroColumna = posicionesColumnas[evalIndex + 3] + (anchoColumnaEvaluacion / 2);
        doc.setFont("helvetica", "bold").setFontSize(10);
        doc.text("X", centroColumna, yTexto + 3.5, { align: "center" });
        doc.setFont("helvetica", "normal").setFontSize(8);
      }
    });
    
    yTexto += filaAltura;
  };

  // Configuración para las filas de título (INTELIGENCIA y PERSONALIDAD)
  // Para estas filas, el título va directamente sin columna de número
  const anchoColumnaTitulo = anchoColumnaNumero + anchoColumnaCriterio; // Título ocupa número + criterio
  const anchoColumnaEvaluacionTitulo = (tablaAncho - anchoColumnaTitulo) / 5; // 5 columnas: S, NPS, NP, NPI, I
  
  // Posiciones de columnas para la fila de título (sin columna de número)
  const posicionesColumnasTitulo = [
    tablaInicioX, // Inicio
    tablaInicioX + anchoColumnaTitulo, // Después del título
    tablaInicioX + anchoColumnaTitulo + anchoColumnaEvaluacionTitulo, // S
    tablaInicioX + anchoColumnaTitulo + anchoColumnaEvaluacionTitulo * 2, // NPS
    tablaInicioX + anchoColumnaTitulo + anchoColumnaEvaluacionTitulo * 3, // NP
    tablaInicioX + anchoColumnaTitulo + anchoColumnaEvaluacionTitulo * 4, // NPI
    tablaInicioX + anchoColumnaTitulo + anchoColumnaEvaluacionTitulo * 5, // I
    tablaInicioX + tablaAncho // Final
  ];

  // Subsección INTELIGENCIA
  // Dibujar fila de subsección con INTELIGENCIA y las columnas de evaluación en la misma fila
  // Fondo celeste claro
  doc.setFillColor(199, 241, 255); // Celeste claro
  doc.rect(tablaInicioX, yTexto, tablaAncho, filaAltura, 'F');
  
  // Dibujar líneas de la tabla
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yTexto, tablaInicioX, yTexto + filaAltura);
  posicionesColumnasTitulo.forEach((pos, posIndex) => {
    if (posIndex > 0 && posIndex < posicionesColumnasTitulo.length - 1) {
      doc.line(pos, yTexto, pos, yTexto + filaAltura);
    }
  });
  doc.line(tablaInicioX + tablaAncho, yTexto, tablaInicioX + tablaAncho, yTexto + filaAltura);
  doc.line(tablaInicioX, yTexto, tablaInicioX + tablaAncho, yTexto);
  doc.line(tablaInicioX, yTexto + filaAltura, tablaInicioX + tablaAncho, yTexto + filaAltura);
  
  // Contenido de la fila INTELIGENCIA con las columnas de evaluación
  doc.setFont("helvetica", "bold").setFontSize(8);
  // Título directamente en la primera columna (sin columna de número)
  doc.text("INTELIGENCIA", tablaInicioX + 2, yTexto + 3.5);
  // Escribir las letras S, NPS, NP, NPI, I en sus respectivas columnas
  evaluaciones.forEach((evaluacion, index) => {
    const centroColumna = posicionesColumnasTitulo[index + 1] + (anchoColumnaEvaluacionTitulo / 2);
    doc.text(evaluacion, centroColumna, yTexto + 3.5, { align: "center" });
  });
  yTexto += filaAltura;

  // Dibujar criterios de inteligencia
  (datosFinales.criteriosInteligencia || []).forEach((criterio) => {
    dibujarFilaCriterio(criterio);
  });

  // Subsección PERSONALIDAD
  // Dibujar fila de subsección con PERSONALIDAD y las columnas de evaluación en la misma fila
  // Usar las mismas posiciones de columnas que INTELIGENCIA (sin columna de número)
  // Fondo celeste claro
  doc.setFillColor(199, 241, 255); // Celeste claro
  doc.rect(tablaInicioX, yTexto, tablaAncho, filaAltura, 'F');
  
  // Dibujar líneas de la tabla
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yTexto, tablaInicioX, yTexto + filaAltura);
  posicionesColumnasTitulo.forEach((pos, posIndex) => {
    if (posIndex > 0 && posIndex < posicionesColumnasTitulo.length - 1) {
      doc.line(pos, yTexto, pos, yTexto + filaAltura);
    }
  });
  doc.line(tablaInicioX + tablaAncho, yTexto, tablaInicioX + tablaAncho, yTexto + filaAltura);
  doc.line(tablaInicioX, yTexto, tablaInicioX + tablaAncho, yTexto);
  doc.line(tablaInicioX, yTexto + filaAltura, tablaInicioX + tablaAncho, yTexto + filaAltura);
  
  // Contenido de la fila PERSONALIDAD con las columnas de evaluación
  doc.setFont("helvetica", "bold").setFontSize(8);
  // Título directamente en la primera columna (sin columna de número)
  doc.text("PERSONALIDAD", tablaInicioX + 2, yTexto + 3.5);
  // Escribir las letras S, NPS, NP, NPI, I en sus respectivas columnas
  evaluaciones.forEach((evaluacion, index) => {
    const centroColumna = posicionesColumnasTitulo[index + 1] + (anchoColumnaEvaluacionTitulo / 2);
    doc.text(evaluacion, centroColumna, yTexto + 3.5, { align: "center" });
  });
  yTexto += filaAltura;

  // Dibujar criterios de personalidad
  (datosFinales.criteriosPersonalidad || []).forEach((criterio) => {
    dibujarFilaCriterio(criterio);
  });

  // Sincronizar yPos con yTexto después de los criterios
  yPos = yTexto;

  // === SECCIÓN 3: ANÁLISIS FODA ===
  // Header de análisis FODA
  yPos = dibujarHeaderSeccion("III. ANÁLISIS FODA", yPos, filaAltura);

  // Fila 1: Fortalezas / Oportunidades
  const alturaFila1 = calcularAlturaTexto(datosFinales.fortalezasOportunidades, tablaAncho - 4);
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila1);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila1);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila1, tablaInicioX + tablaAncho, yPos + alturaFila1);

  // Contenido de Fortalezas / Oportunidades
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fortalezas / Oportunidades:", tablaInicioX + 2, yPos + 3.5);
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.fortalezasOportunidades, tablaInicioX + 2, yPos + 7, tablaAncho - 4);
  yPos += alturaFila1;

  // Fila 2: Debilidades / Amenazas
  const alturaFila2 = calcularAlturaTexto(datosFinales.debilidadesAmenazas, tablaAncho - 4);
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila2);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila2);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila2, tablaInicioX + tablaAncho, yPos + alturaFila2);

  // Contenido de Debilidades / Amenazas
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Debilidades / Amenazas:", tablaInicioX + 2, yPos + 3.5);
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.debilidadesAmenazas, tablaInicioX + 2, yPos + 7, tablaAncho - 4);
  yPos += alturaFila2;

  // === SECCIÓN 4: OBSERVACIONES ===
  // Header de observaciones
  yPos = dibujarHeaderSeccion("IV. OBSERVACIONES", yPos, filaAltura);

  // Fila de Observaciones (creciente)
  const alturaObservaciones = calcularAlturaTexto(datosFinales.observaciones, tablaAncho - 4);
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaObservaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaObservaciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaObservaciones, tablaInicioX + tablaAncho, yPos + alturaObservaciones);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.observaciones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
  yPos += alturaObservaciones;

  // === SECCIÓN 5: RECOMENDACIONES ===
  // Header de recomendaciones
  yPos = dibujarHeaderSeccion("V. RECOMENDACIONES", yPos, filaAltura);

  // Dividir en dos columnas: texto (izquierda) y firma (derecha)
  const anchoColumnaTexto = tablaAncho * 0.65; // 65% para el texto
  const anchoColumnaFirma = tablaAncho * 0.35; // 35% para la firma
  const posicionDivision = tablaInicioX + anchoColumnaTexto;

  // Calcular altura considerando el ancho del texto (sin incluir el espacio de la firma)
  const alturaRecomendaciones = calcularAlturaTexto(datosFinales.recomendaciones, anchoColumnaTexto - 6);
  const alturaMinimaFirma = 30; // Altura mínima para la firma
  const alturaFinal = Math.max(alturaRecomendaciones, alturaMinimaFirma);
  
  // Dibujar líneas de la tabla con división
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFinal);
  doc.line(posicionDivision, yPos, posicionDivision, yPos + alturaFinal); // Línea divisoria
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFinal);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFinal, tablaInicioX + tablaAncho, yPos + alturaFinal);

  // Columna izquierda: Texto de recomendaciones
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.recomendaciones, tablaInicioX + 2, yPos + 3, anchoColumnaTexto - 6);

  // Columna derecha: Firma
  const centroColumnaFirma = posicionDivision + (anchoColumnaFirma / 2);
  const firmaY = yPos + 3;
  
  // Agregar firma y sello médico
  let firmaMedicoUrl = getSign(data, "SELLOFIRMA");
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 40;
      const imgHeight = 18;
      // Centrar la imagen en la columna de firma
      const firmaMedicoX = centroColumnaFirma - (imgWidth / 2);
      const x = firmaMedicoX;
      const y = firmaY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sello y Firma del Médico", centroColumnaFirma, yPos + alturaFinal - 8, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumnaFirma, yPos + alturaFinal - 5.5, { align: "center" });

  yPos += alturaFinal;

  // === SECCIÓN 6: CONCLUSIONES ===
  // Header de conclusiones
  yPos = dibujarHeaderSeccion("VI. CONCLUSIONES", yPos, filaAltura);

  // Fila con opciones: APTO | X | APTO CON OBSERVACION | | NO APTO | |
  // Dividir en 3 columnas principales
  const anchoColumnaConclusión = tablaAncho / 3;
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + anchoColumnaConclusión, yPos, tablaInicioX + anchoColumnaConclusión, yPos + filaAltura);
  doc.line(tablaInicioX + anchoColumnaConclusión * 2, yPos, tablaInicioX + anchoColumnaConclusión * 2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Subdividir cada columna en 2 (texto | X)
  const anchoSubColumna = anchoColumnaConclusión / 2;
  
  // Líneas verticales internas
  doc.line(tablaInicioX + anchoSubColumna, yPos, tablaInicioX + anchoSubColumna, yPos + filaAltura);
  doc.line(tablaInicioX + anchoColumnaConclusión + anchoSubColumna, yPos, tablaInicioX + anchoColumnaConclusión + anchoSubColumna, yPos + filaAltura);
  doc.line(tablaInicioX + anchoColumnaConclusión * 2 + anchoSubColumna, yPos, tablaInicioX + anchoColumnaConclusión * 2 + anchoSubColumna, yPos + filaAltura);

  // Contenido de las conclusiones
  doc.setFont("helvetica", "bold").setFontSize(8);
  
  // APTO
  doc.text("APTO", tablaInicioX + anchoSubColumna / 2, yPos + 3.5, { align: "center" });
  if (datosFinales.apto) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + anchoSubColumna + anchoSubColumna / 2, yPos + 3.5, { align: "center" });
  }
  
  // APTO CON OBSERVACION
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("APTO CON OBSERVACION", tablaInicioX + anchoColumnaConclusión + anchoSubColumna / 2, yPos + 3.5, { align: "center" });
  if (datosFinales.aptoConObservacion) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + anchoColumnaConclusión + anchoSubColumna + anchoSubColumna / 2, yPos + 3.5, { align: "center" });
  }
  
  // NO APTO
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("NO APTO", tablaInicioX + anchoColumnaConclusión * 2 + anchoSubColumna / 2, yPos + 3.5, { align: "center" });
  if (datosFinales.noApto) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + anchoColumnaConclusión * 2 + anchoSubColumna + anchoSubColumna / 2, yPos + 3.5, { align: "center" });
  }

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
