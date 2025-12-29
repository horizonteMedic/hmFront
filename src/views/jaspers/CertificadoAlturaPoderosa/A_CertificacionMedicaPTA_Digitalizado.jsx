import jsPDF from "jspdf";
import drawColorBox from '../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import { convertirGenero } from "../../utils/helpers.js";
import footerTR from '../components/footerTR.jsx';
import { dibujarFirmas } from "../../utils/dibujarFirmas.js";

export default function A_CertificacionMedicaPTA_Digitalizado(data = {}, docExistente = null) {
  // Si se está usando como componente React (sin docExistente y sin datos válidos), retornar JSX
  const tieneDatosValidos = data && (data.norden || data.dniPaciente || data.nombresPaciente);
  
  if (!docExistente && !tieneDatosValidos) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Simulador de Jasper - Certificación Médica Altura 1.8m</h2>
        <p>Esta función se llama desde el sistema de impresión de reportes.</p>
        <p>Para probar el reporte, usa la funcionalidad de impresión desde el módulo correspondiente.</p>
      </div>
    );
  }
  
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  if (!doc || !doc.internal) {
    return null;
  }
  const pageW = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Constantes para celdas SI/NO (disponibles en todo el scope)
  const colSi = 6;
  const colNo = 6;

  // Normalizador de datos de entrada
  function buildDatosFinales(raw) {
    const datosFinales = {
      apellidosNombres: String((((raw?.apellidosPaciente ?? '') + ' ' + (raw?.nombresPaciente ?? '')).trim())),
      fechaExamen: formatearFechaCorta(raw?.fechaCertificacion ?? ''),
      sexo: convertirGenero(raw?.sexoPaciente ?? ''),
      documentoIdentidad: String(raw?.dniPaciente ?? ''),
      edad: String(raw?.edadPaciente ?? ''),
      fechaNacimiento: formatearFechaCorta(raw?.fechaNacimientoPaciente ?? ''),
      domicilio: String(raw?.direccionPaciente ?? ''),
      areaTrabajo: String(raw?.areaPaciente ?? ''),
      puestoTrabajo: String(raw?.cargoPaciente ?? ''),
      empresa: String(raw?.empresa ?? ''),
      contrata: String(raw?.contrata ?? ''),
      labor: String(raw?.ocupacionPaciente ?? ''),
      primeraActitud: raw?.primeraActitud === true,
      revalidacion: raw?.revalidacion === true,
      sede: String(raw?.sede ?? ''),
      numeroFicha: String(raw?.norden ?? ""),
      tipoExamen: String(raw?.tipoExamen ?? ''),
      tiempoExperiencia: String(raw?.tiempoExperiencia ?? ''),
      // Antecedentes del Registro Médico - convertir Si/No a boolean
      tieneFobiaAlturas: raw?.tieneFobiaSi === true,
      tieneEpilepsia: raw?.epilepsiaSi === true,
      tieneAlcoholismo: raw?.alcoholismoSi === true,
      tieneEnfermedadPsiquiatrica: raw?.portadorPsiquiatricaSi === true,
      tieneDiabetes: raw?.diabetesMellitusSi === true,
      tieneMigrana: raw?.miagranaSi === true,
      tieneInsuficienciaCardiaca: raw?.insuficienciaCardiacaSi === true,
      tieneAsma: raw?.asmaBronquialSi === true,
      tieneHipertension: raw?.hipertensionArterialSi === true,
      tieneHipoacusia: raw?.hipoacusiaSeveraSi === true,
      tieneAlteracionVisual: raw?.alteracionAgudezaVisualSi === true,
      declaradoNoApto: raw?.declaroNoAptoSi === true,
      comentariosDetalle: String(raw?.comentarios ?? ''),
      // Antecedentes Entrevista
      tieneResfriado: raw?.resfriadoSi === true,
      tieneVertigo: raw?.vertigoMareoSi === true,
      consumioLicor: raw?.consumioLicorSi === true,
      frecuenciaCefaleas: raw?.frecuenciaCefaleasSi === true,
      detalleMedicinas: String(raw?.detalleMedicinas ?? ''),
      // Examen Físico - Signos Vitales
      frecuenciaCardiaca: String(raw?.frecuenciaCardiaca ?? ''),
      frecuenciaRespiratoria: String(raw?.frecuenciaRespiratoria ?? ''),
      presionArterial: String((raw?.sistolica ?? '') + '/' + (raw?.diastolica ?? '')),
      saturacionOxigeno: String(raw?.saturacionOxigeno ?? ''),
      // Examen Físico - Antropométricos
      talla: String(raw?.talla ?? ''),
      peso: String(raw?.peso ?? ''),
      imc: String(raw?.imc ?? ''),
      // Examen Físico - Hallazgos Columna 1
      hallazgosHombro: raw?.hallazgoAnormalHombroSi === true,
      hallazgosCodo: raw?.hallazgoAnormalCodoSi === true,
      hallazgosRodilla: raw?.hallazgoAnormalRodillaSi === true,
      hallazgosTobillo: raw?.hallazgoAnormalTobilloSi === true,
      otrosHallazgosMusculoEsqueleticos: raw?.otrosHallazgosSi === true,
      // Examen Físico - Hallazgos Columna 2
      limitacionFuerzaMovilidad: raw?.limitacionFuerzaSi === true,
      alteracionEquilibrio: raw?.alteracionEquilibrioSi === true,
      anormalidadMarcha: raw?.anormalidadMarchaSi === true,
      anormalidadFuerzaMiembros: raw?.anormalidadFuerzaSi === true,
      lenguajeAnormal: raw?.lenguajeAnormalSi === true,
      // Examen Físico - Hallazgos Columna 3
      alteracionCoordinacion: raw?.alteracionCoordinacionPresenteSi === true,
      presenciaNistagmus: raw?.presenciaNisfagmusSi === true,
      anormalidadMovimientosOculares: raw?.anormalidadMovimientosOcularesSi === true,
      pupilasCIRLA: raw?.pupilasCirlaSi === true,
      asimetriaFacial: raw?.asimetriaFacialSi === true,
      // Examen Físico - Descripción
      descripcionHallazgosArticulaciones: String(raw?.detalleinformacionactual ?? ''),
      // Conclusión
      apto18: raw?.aptoTrabajar18metrosSi === true,
      usoLentesCorrectores: raw?.usoLentesCorrectoresSi === true,
      usoAudifonos: raw?.usoAudifonosSi === true,
      otraRestriccion: String(raw?.otraRestriccion ?? ''),
      altura: String(raw?.altura ?? ''),
      observacionesRecomendaciones: String(raw?.observacionesRecomendaciones ?? raw?.observaciones ?? raw?.recomendaciones ?? ''),
      color: Number(raw?.color ?? 0),
      codigoColor: String(raw?.codigoColor ?? ''),
      textoColor: String(raw?.textoColor ?? ''),
    };
    return datosFinales;
  }

  const datosFinales = buildDatosFinales(data);

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete (subido más arriba para que no pise el título, yOffset de 7 a 2)
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 2 });

    // Título principal (subido 5mm, de 30 a 25)
    doc.setFont("helvetica", "bold").setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("CERTIFICACIÓN MEDICA PREVIA A TRABAJO DE ALTURA", pageW / 2, 25, { align: "center" });

    // Subtítulo (subido 5mm, de 36 a 31)
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text("(encima de los 1,8 metros)", pageW / 2, 29.7, { align: "center" });

    // Número de Ficha, Sede, Fecha y Página (subidos 5mm)
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("Nro de ficha: ", pageW - 70, 10);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 50, 11);

    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Sede: " + datosFinales.sede, pageW - 70, 15);
    doc.text("Fecha de examen: " + (datosFinales.fechaExamen || ""), pageW - 70, 20);
    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 25, 3);

    // Bloque de color (subido 5mm, de 10 a 5)
    drawColorBox(doc, {
      color: datosFinales.codigoColor,
      text: datosFinales.textoColor,
      x: pageW - 30,
      y: 5,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  };

  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    if (!texto || texto === null || texto === undefined) {
      return y;
    }
    
    const fontSize = doc.internal.getFontSize();
    const palabras = String(texto).split(' ');
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
      yPos += fontSize * 0.35;
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
    doc.setFillColor(196, 196, 196);
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

  // Función para dibujar X en celda
  const dibujarX = (x, y) => {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(0, 0, 255); // Azul para la X
    doc.text("X", x, y, { align: "center" });
    doc.setTextColor(0, 0, 0); // Resetear a negro
  };

  // Función para calcular altura necesaria sin dibujar
  const calcularAlturaFila = (pregunta, anchoColumna) => {
    const alturaFila = 4.5;
    const colSi = 6;
    const colNo = 6;
    const colPregunta = anchoColumna - colSi - colNo;
    doc.setFont("helvetica", "normal").setFontSize(7);
    const lineasPregunta = doc.splitTextToSize(pregunta, colPregunta - 4);
    return Math.max(alturaFila, lineasPregunta.length * 3 + 1);
  };

  // Función para dibujar fila con pregunta y celdas SI/NO (con altura fija opcional)
  const dibujarFilaAntecedente = (pregunta, valor, yPos, xInicio, anchoColumna, alturaFija = null) => {
    const alturaFila = 4.5;
    const colSi = 6; // Ancho para celda SI (más delgada)
    const colNo = 6; // Ancho para celda NO (más delgada)
    const colPregunta = anchoColumna - colSi - colNo; // Ancho para la pregunta
    
    // Dibujar pregunta
    doc.setFont("helvetica", "normal").setFontSize(7);
    const lineasPregunta = doc.splitTextToSize(pregunta, colPregunta - 4);
    const alturaNecesaria = alturaFija !== null ? alturaFija : Math.max(alturaFila, lineasPregunta.length * 3 + 1);
    
    // Dibujar líneas de la fila
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Línea izquierda (inicio de pregunta)
    doc.line(xInicio, yPos, xInicio, yPos + alturaNecesaria);
    // Línea divisoria entre pregunta y SI
    doc.line(xInicio + colPregunta, yPos, xInicio + colPregunta, yPos + alturaNecesaria);
    // Línea divisoria entre SI y NO
    doc.line(xInicio + colPregunta + colSi, yPos, xInicio + colPregunta + colSi, yPos + alturaNecesaria);
    // Línea derecha (fin de NO)
    doc.line(xInicio + anchoColumna, yPos, xInicio + anchoColumna, yPos + alturaNecesaria);
    // Línea superior
    doc.line(xInicio, yPos, xInicio + anchoColumna, yPos);
    // Línea inferior
    doc.line(xInicio, yPos + alturaNecesaria, xInicio + anchoColumna, yPos + alturaNecesaria);
    
    // Dibujar texto de la pregunta
    lineasPregunta.forEach((linea, idx) => {
      doc.text(linea, xInicio + 2, yPos + 2.5 + (idx * 3));
    });
    
    // Dibujar celda SI
    const xSi = xInicio + colPregunta;
    const yCentro = yPos + alturaNecesaria / 2;
    if (valor === true) {
      dibujarX(xSi + colSi / 2, yCentro + 0.5);
    }
    
    // Dibujar celda NO
    const xNo = xInicio + colPregunta + colSi;
    if (valor === false) {
      dibujarX(xNo + colNo / 2, yCentro + 0.5);
    }
    
    return yPos + alturaNecesaria;
  };

  // Función para dibujar sección de conclusión
  const dibujarSeccionConclusion = (yPos) => {
    // Verificar si necesitamos nueva página
    if (yPos + 20 > pageHeight - 20) {
      doc.addPage();
      numeroPagina++;
      yPos = 40;
      drawHeader(numeroPagina);
    }

    const alturaFila = 4.5;
    
    // 1. Fila gris con título
    yPos = dibujarHeaderSeccion("5.- CONCLUSIÓN DE LA PRESENTE EVALUACIÓN", yPos, filaAltura);

    // 2. Fila normal con tres columnas: APTO | DEBAJO | Para
    const anchoCol1 = tablaAncho * 0.35; // 35% para "APTO PARA TRABAJAR..."
    const anchoCol2 = tablaAncho * 0.22; // 22% para "DEBAJO"
    const anchoCol3 = tablaAncho * 0.30; // 30% restante para "Para"
    
    // Textos para cada columna
    const textoCol1 = "APTO PARA TRABAJAR ENCIMA DE LOS 1,8 METROS";
    
    // Construir textoCol2: verificar si ya contiene "DEBAJO"
    let textoCol2 = "";
    if (datosFinales.altura) {
      const alturaUpper = String(datosFinales.altura).toUpperCase().trim();
      if (alturaUpper.startsWith("DEBAJO")) {
        // Si ya contiene "DEBAJO", solo agregar "m.s.n.m"
        textoCol2 = `${datosFinales.altura} m.s.n.m`;
      } else {
        // Si no contiene "DEBAJO", agregar el prefijo
        textoCol2 = `DEBAJO : ${datosFinales.altura} m.s.n.m`;
      }
    }
    
    const textoCol3 = datosFinales.puestoTrabajo ? `Para: ${datosFinales.puestoTrabajo}` : "";
    
    // Calcular altura necesaria para cada columna
    doc.setFont("helvetica", "normal").setFontSize(7);
    const anchoDisponibleCol1 = anchoCol1 - 4;
    const anchoDisponibleCol2 = anchoCol2 - 4;
    const anchoDisponibleCol3 = anchoCol3 - 4;
    
    const lineasCol1 = doc.splitTextToSize(textoCol1, anchoDisponibleCol1);
    const lineasCol2 = textoCol2 ? doc.splitTextToSize(textoCol2, anchoDisponibleCol2) : [];
    const lineasCol3 = textoCol3 ? doc.splitTextToSize(textoCol3, anchoDisponibleCol3) : [];
    
    const maxLineas = Math.max(lineasCol1.length, lineasCol2.length, lineasCol3.length);
    const alturaNecesaria = Math.max(alturaFila, maxLineas * 3.5 + 1);
    
    // Dibujar líneas de la fila
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaNecesaria);
    doc.line(tablaInicioX + anchoCol1, yPos, tablaInicioX + anchoCol1, yPos + alturaNecesaria);
    doc.line(tablaInicioX + anchoCol1 + anchoCol2, yPos, tablaInicioX + anchoCol1 + anchoCol2, yPos + alturaNecesaria);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaNecesaria);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaNecesaria, tablaInicioX + tablaAncho, yPos + alturaNecesaria);
    
    // Calcular centro vertical
    const yCentro = yPos + alturaNecesaria / 2;
    
    // Dibujar texto en cada columna (centrado verticalmente)
    doc.setFont("helvetica", "normal").setFontSize(7);
    
    // Columna 1
    const alturaBloqueCol1 = (lineasCol1.length - 1) * 3.5;
    const yInicioCol1 = yCentro - alturaBloqueCol1 / 2 + 1;
    lineasCol1.forEach((linea, idx) => {
      doc.text(linea, tablaInicioX + 2, yInicioCol1 + (idx * 3.5));
    });
    
    // Columna 2
    if (lineasCol2.length > 0) {
      const alturaBloqueCol2 = (lineasCol2.length - 1) * 3.5;
      const yInicioCol2 = yCentro - alturaBloqueCol2 / 2 + 1;
      lineasCol2.forEach((linea, idx) => {
        doc.text(linea, tablaInicioX + anchoCol1 + 2, yInicioCol2 + (idx * 3.5));
      });
    }
    
    // Columna 3
    if (lineasCol3.length > 0) {
      const alturaBloqueCol3 = (lineasCol3.length - 1) * 3.5;
      const yInicioCol3 = yCentro - alturaBloqueCol3 / 2 + 1;
      lineasCol3.forEach((linea, idx) => {
        doc.text(linea, tablaInicioX + anchoCol1 + anchoCol2 + 2, yInicioCol3 + (idx * 3.5));
      });
    }
    
    yPos += alturaNecesaria;

    // 3. Fila celeste solo con "RESTRICCIONES" (sin ":")
    const alturaFilaRestricciones = 4.5;
    
    doc.setFillColor(199, 241, 255); // Celeste
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaRestricciones, 'F');
    
    // Dibujar líneas
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaRestricciones);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaRestricciones);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaRestricciones, tablaInicioX + tablaAncho, yPos + alturaFilaRestricciones);
    
    // Texto "RESTRICCIONES" (sin ":")
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("RESTRICCIONES", tablaInicioX + 2, yPos + 3.5);
    
    yPos += alturaFilaRestricciones;

    // 4. Tres filas separadas, cada una con texto y una celda SI/NO
    const alturaFilaRestriccion = 4.5;
    const anchoCeldaSiNo = 12; // Ancho para la celda única que muestra SI o NO
    const colTextoRestriccion = tablaAncho - anchoCeldaSiNo; // Ancho para el texto (todo menos la celda SI/NO)
    
    const restricciones = [
      { texto: "Apto para trabajar encima de los 1,8 metros", valor: datosFinales.apto18 },
      { texto: "Uso permanente de lentes correctores", valor: datosFinales.usoLentesCorrectores },
      { texto: "Uso permanente de audífonos", valor: datosFinales.usoAudifonos }
    ];
    
    // Dibujar cada restricción en su propia fila
    restricciones.forEach((restriccion) => {
      // Calcular altura necesaria para esta fila
      doc.setFont("helvetica", "normal").setFontSize(7);
      const lineas = doc.splitTextToSize(restriccion.texto, colTextoRestriccion - 4);
      const alturaNecesaria = Math.max(alturaFilaRestriccion, lineas.length * 3 + 1);
      
      // Dibujar líneas de la fila
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.2);
      
      // Líneas verticales
      doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaNecesaria);
      doc.line(tablaInicioX + colTextoRestriccion, yPos, tablaInicioX + colTextoRestriccion, yPos + alturaNecesaria);
      doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaNecesaria);
      
      // Líneas horizontales
      doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
      doc.line(tablaInicioX, yPos + alturaNecesaria, tablaInicioX + tablaAncho, yPos + alturaNecesaria);
      
      // Calcular centro vertical de la celda
      const yCentro = yPos + alturaNecesaria / 2;
      
      // Dibujar texto (centrado verticalmente)
      const alturaBloqueTexto = (lineas.length - 1) * 3;
      const yInicioTexto = yCentro - alturaBloqueTexto / 2 + 0.5;
      doc.setFont("helvetica", "normal").setFontSize(7);
      lineas.forEach((linea, idx) => {
        doc.text(linea, tablaInicioX + 2, yInicioTexto + (idx * 3));
      });
      
      // Dibujar SI/NO
      doc.setFont("helvetica", "normal").setFontSize(7);
      if (restriccion.valor === true) {
        doc.text("SI", tablaInicioX + colTextoRestriccion + anchoCeldaSiNo / 2, yCentro + 0.5, { align: "center" });
      } else if (restriccion.valor === false) {
        doc.text("NO", tablaInicioX + colTextoRestriccion + anchoCeldaSiNo / 2, yCentro + 0.5, { align: "center" });
      }
      
      yPos += alturaNecesaria;
    });

    // 5. Fila para "Otra Restricción : {data}"
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFila, tablaInicioX + tablaAncho, yPos + alturaFila);
    
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Otra Restricción : " + (datosFinales.otraRestriccion || ""), tablaInicioX + 2, yPos + 3.5);
    
    yPos += alturaFila;
    
    return yPos;
  };

  // Función para dibujar sección de observaciones/recomendaciones y firmas
  const dibujarSeccionObservacionesYFirmas = (yPos) => {
    // Fila gris: Observaciones / recomendaciones (sin dos puntos)
    yPos = dibujarHeaderSeccion("6.- Observaciones / recomendaciones", yPos, filaAltura);

    // Fila con texto (usando dibujarTextoCreciente con altura mínima de 15mm)
    // Si hay pocos datos, la altura será 15mm, si hay mucho texto crecerá automáticamente
    yPos = dibujarTextoCreciente(datosFinales.observacionesRecomendaciones, "", yPos, 6);

    // Sección de firmas
    const baseY = yPos;

    // Usar helper para dibujar firmas (sin borde)
    dibujarFirmas({ doc, datos: data, y: baseY + 2, pageW }).then(() => {
      // === FOOTER ===
      footerTR(doc, { footerOffsetY: 12, fontSize: 7 });

      // === Imprimir ===
      if (!docExistente) {
        imprimir(doc);
      }
    }).catch(err => {
      console.error("Error al dibujar firmas:", err);
      // === FOOTER ===
      footerTR(doc, { footerOffsetY: 12, fontSize: 7 });
      
      // === Imprimir ===
      if (!docExistente) {
        imprimir(doc);
      }
    });

    // Si hay docExistente, retornar el doc (las firmas se agregarán asíncronamente)
    // El footer se dibujará en el .then() o .catch() de dibujarFirmas
    if (docExistente) {
      return doc;
    }
  };

  // Función para dibujar texto creciente (similar a dibujarTextoJustificado)
  const dibujarTextoCreciente = (texto, titulo, yPos, alturaMinima = 10) => {
    // Determinar si hay título para agregar ":"
    const tieneTitulo = titulo && titulo.trim() !== '';
    const textoTitulo = tieneTitulo ? titulo + ": " : "";
    
    const padding = 2;
    const anchoDisponibleTexto = tablaAncho - 4;
    
    // Si no hay texto, dibujar solo el título
    if (!texto || texto.trim() === '') {
      const alturaFinal = Math.max(alturaMinima, 4.5);
      doc.rect(tablaInicioX, yPos, tablaAncho, alturaFinal, 'S');
      if (tieneTitulo) {
        doc.setFont("helvetica", "bold").setFontSize(7);
        doc.text(textoTitulo, tablaInicioX + 2, yPos + 3.5);
      }
      return yPos + alturaFinal;
    }
    
    // Combinar título y texto para dividir juntos
    doc.setFont("helvetica", "normal").setFontSize(7);
    const textoCompleto = tieneTitulo ? textoTitulo + String(texto) : String(texto);
    const lineasCompletas = doc.splitTextToSize(textoCompleto, anchoDisponibleTexto);
    
    // Calcular altura necesaria
    const alturaTexto = lineasCompletas.length * 3 + padding;
    const alturaFinal = Math.max(alturaMinima, alturaTexto + 2);
    
    // Dibujar borde
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaFinal, 'S');
    
    // Dibujar líneas: título en negrita solo en la primera línea si aplica
    lineasCompletas.forEach((linea, idx) => {
      if (idx === 0 && tieneTitulo && linea.startsWith(textoTitulo)) {
        // Primera línea: título en negrita, resto en normal
        doc.setFont("helvetica", "bold").setFontSize(7);
        const anchoTitulo = doc.getTextWidth(textoTitulo);
        doc.text(textoTitulo, tablaInicioX + 2, yPos + 3.5);
        doc.setFont("helvetica", "normal").setFontSize(7);
        const textoRestante = linea.substring(textoTitulo.length);
        if (textoRestante.trim()) {
          doc.text(textoRestante, tablaInicioX + 2 + anchoTitulo, yPos + 3.5);
        }
      } else {
        // Resto de líneas en normal
        doc.setFont("helvetica", "normal").setFontSize(7);
        doc.text(linea, tablaInicioX + 2, yPos + 3.5 + (idx * 3));
      }
    });
    
    return yPos + alturaFinal;
  };

  // === PÁGINA 1 ===
  drawHeader(numeroPagina);

  // === SECCIÓN: DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 32; // Ajustado para coincidir con header subido 5mm
  const filaAltura = 4.5;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);

  // === CONTENIDO DE LA TABLA ===
  let yTexto = yPos + 2.5; // Ajustar para el header

  // Fila: Apellidos y Nombres con división para Tipo de examen
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura); // División para Tipo de examen
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Domicilio (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Empresa y T. experiencia (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura); // División para T. experiencia
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Contrata (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Labor (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Primera Actitud y Revalidación (2 columnas con checkboxes)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura); // División entre Primera Actitud y Revalidación
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  // Líneas verticales para checkboxes (celdas de 6mm de ancho)
  doc.line(tablaInicioX + 94, yPos, tablaInicioX + 94, yPos + filaAltura); // Checkbox Primera Actitud (inicio)
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura); // División central
  doc.line(tablaInicioX + 194, yPos, tablaInicioX + 194, yPos + filaAltura); // Checkbox Revalidación (inicio)
  yPos += filaAltura;

  // Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres || "", tablaInicioX + 35, yTexto + 1, 95);

  // Columna derecha: Tipo de examen
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.tipoExamen || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.documentoIdentidad || "", tablaInicioX + 12, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text((datosFinales.edad ? (datosFinales.edad + " AÑOS") : ""), tablaInicioX + 58, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.sexo || "", tablaInicioX + 105, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.fechaNacimiento || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // Domicilio
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  dibujarTextoConSaltoLinea(datosFinales.domicilio || "", tablaInicioX + 25, yTexto + 1, 160);
  yTexto += filaAltura;

  // Puesto de Trabajo, Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.puestoTrabajo || "", tablaInicioX + 30, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.areaTrabajo || "", tablaInicioX + 118, yTexto + 1);
  yTexto += filaAltura;

  // Empresa y T. experiencia
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  dibujarTextoConSaltoLinea(datosFinales.empresa || "", tablaInicioX + 24, yTexto + 1, 70);

  // Columna derecha: T. experiencia
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("T. experiencia:", tablaInicioX + 102, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.tiempoExperiencia || "", tablaInicioX + 125, yTexto + 1);
  yTexto += filaAltura;

  // Contratista
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.contrata || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Labor
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Labor:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.labor || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Primera Actitud y Revalidación
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Primera Actitud:", tablaInicioX + 2, yTexto + 1);
  // Checkbox Primera Actitud (centrado en celda de 6mm, desde 94 hasta 100)
  if (datosFinales.primeraActitud === true) {
    dibujarX(tablaInicioX + 94 + 3, yTexto + 1.2);
  }
  
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Revalidación:", tablaInicioX + 102, yTexto + 1);
  // Checkbox Revalidación (centrado en celda de 6mm, desde 194 hasta 200)
  if (datosFinales.revalidacion === true) {
    dibujarX(tablaInicioX + 194 + 3, yTexto + 1.2);
  }
  yTexto += filaAltura;

  // === SECCIÓN 2: ANTECEDENTES (DEL REGISTRO MÉDICO) ===
  // Verificar si necesitamos nueva página
  if (yPos + 50 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 40;
    drawHeader(numeroPagina);
  }

  yPos = dibujarHeaderSeccion("2.- ANTECEDENTES (DEL REGISTRO MÉDICO)", yPos, filaAltura);

  // Constantes para celdas SI/NO
  const anchoColumna = tablaAncho / 2;
  const colPregunta = anchoColumna - colSi - colNo;

  // Header de columnas NO/SI con celdas
  
  // Header columna izquierda
  doc.setFillColor(199, 241, 255); // Celeste
  doc.rect(tablaInicioX, yPos, colPregunta, filaAltura, 'F');
  doc.rect(tablaInicioX + colPregunta, yPos, colSi, filaAltura, 'F');
  doc.rect(tablaInicioX + colPregunta + colSi, yPos, colNo, filaAltura, 'F');
  
  // Header columna derecha
  doc.rect(tablaInicioX + anchoColumna, yPos, colPregunta, filaAltura, 'F');
  doc.rect(tablaInicioX + anchoColumna + colPregunta, yPos, colSi, filaAltura, 'F');
  doc.rect(tablaInicioX + anchoColumna + colPregunta + colSi, yPos, colNo, filaAltura, 'F');
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + colPregunta, yPos, tablaInicioX + colPregunta, yPos + filaAltura);
  doc.line(tablaInicioX + colPregunta + colSi, yPos, tablaInicioX + colPregunta + colSi, yPos + filaAltura);
  doc.line(tablaInicioX + anchoColumna, yPos, tablaInicioX + anchoColumna, yPos + filaAltura);
  doc.line(tablaInicioX + anchoColumna + colPregunta, yPos, tablaInicioX + anchoColumna + colPregunta, yPos + filaAltura);
  doc.line(tablaInicioX + anchoColumna + colPregunta + colSi, yPos, tablaInicioX + anchoColumna + colPregunta + colSi, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Texto SI y NO en celdas del header
  doc.setFont("helvetica", "bold").setFontSize(7);
  // Columna izquierda
  doc.text("SI", tablaInicioX + colPregunta + colSi / 2, yPos + 3.5, { align: "center" });
  doc.text("NO", tablaInicioX + colPregunta + colSi + colNo / 2, yPos + 3.5, { align: "center" });
  // Columna derecha
  doc.text("SI", tablaInicioX + anchoColumna + colPregunta + colSi / 2, yPos + 3.5, { align: "center" });
  doc.text("NO", tablaInicioX + anchoColumna + colPregunta + colSi + colNo / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // Columna izquierda
  const xColumnaIzq = tablaInicioX;
  const xColumnaDer = tablaInicioX + anchoColumna;
  let yColumnaIzq = yPos;
  let yColumnaDer = yPos;
  const yInicioColumnas = yPos;
  
  // Definir pares de filas (izquierda, derecha)
  const paresFilas = [
    { izq: { pregunta: "Tiene fobia (miedo) a las alturas", valor: datosFinales.tieneFobiaAlturas }, der: { pregunta: "Insuficiencia cardiaca, enfermedad coronaria arritmias, porta marcapaso, prótesis valvular", valor: datosFinales.tieneInsuficienciaCardiaca } },
    { izq: { pregunta: "Epilepsia/convulsiones u otra enfermedad que condiciona pérdida de conciencia", valor: datosFinales.tieneEpilepsia }, der: { pregunta: "Asma bronquial - Patrón obstructivo moderado o severo", valor: datosFinales.tieneAsma } },
    { izq: { pregunta: "Alcoholismo o abuso de sustancias (adicción)", valor: datosFinales.tieneAlcoholismo }, der: { pregunta: "Hipertensión arterial no controlada", valor: datosFinales.tieneHipertension } },
    { izq: { pregunta: "Portador de enfermedad psiquiátrica o hallazgo psicológico como rasgos de ansiedad, trastornos impulsivos, compulsivos.", valor: datosFinales.tieneEnfermedadPsiquiatrica }, der: { pregunta: "Hipoacusia severa", valor: datosFinales.tieneHipoacusia } },
    { izq: { pregunta: "Diabetes mellitus o hipoglicemia no controlada", valor: datosFinales.tieneDiabetes }, der: { pregunta: "Alteración de la agudeza visual(de lejos)y/o estereopsia", valor: datosFinales.tieneAlteracionVisual } },
    { izq: { pregunta: "Migraña no controlada", valor: datosFinales.tieneMigrana }, der: { pregunta: "Declarado NO APTO para labor de altura en último examen ocupacional", valor: datosFinales.declaradoNoApto } }
  ];
  
  // Dibujar cada par de filas con la misma altura
  paresFilas.forEach(par => {
    // Calcular altura máxima del par
    const alturaIzq = calcularAlturaFila(par.izq.pregunta, anchoColumna);
    const alturaDer = calcularAlturaFila(par.der.pregunta, anchoColumna);
    const alturaMaxima = Math.max(alturaIzq, alturaDer);
    
    // Dibujar fila izquierda con altura fija
    yColumnaIzq = dibujarFilaAntecedente(par.izq.pregunta, par.izq.valor, yColumnaIzq, xColumnaIzq, anchoColumna, alturaMaxima);
    
    // Dibujar fila derecha con altura fija
    yColumnaDer = dibujarFilaAntecedente(par.der.pregunta, par.der.valor, yColumnaDer, xColumnaDer, anchoColumna, alturaMaxima);
  });

  // Ajustar yPos al máximo de ambas columnas (deberían ser iguales ahora)
  yPos = Math.max(yColumnaIzq, yColumnaDer);
  
  // Dibujar líneas verticales y horizontales que conectan ambas columnas
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yInicioColumnas, tablaInicioX, yPos); // Línea izquierda completa
  doc.line(tablaInicioX + tablaAncho / 2, yInicioColumnas, tablaInicioX + tablaAncho / 2, yPos); // Línea central
  doc.line(tablaInicioX + tablaAncho, yInicioColumnas, tablaInicioX + tablaAncho, yPos); // Línea derecha completa
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea horizontal inferior

  // Campo de texto creciente: Comentarios/detalle
  yPos = dibujarTextoCreciente(datosFinales.comentariosDetalle, "Comentarios/detalle", yPos, filaAltura);

  // === SECCIÓN 3: ANTECEDENTES (ENTREVISTA CON EL PACIENTE) ===
  // Verificar si necesitamos nueva página
  if (yPos + 30 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 40;
    drawHeader(numeroPagina);
  }

  yPos = dibujarHeaderSeccion("3.- ANTECEDENTES (ENTREVISTA CON EL PACIENTE)", yPos, filaAltura);

  // Header de columnas NO/SI con celdas
  // Header columna izquierda
  doc.setFillColor(199, 241, 255); // Celeste
  doc.rect(tablaInicioX, yPos, colPregunta, filaAltura, 'F');
  doc.rect(tablaInicioX + colPregunta, yPos, colSi, filaAltura, 'F');
  doc.rect(tablaInicioX + colPregunta + colSi, yPos, colNo, filaAltura, 'F');
  
  // Header columna derecha
  doc.rect(tablaInicioX + anchoColumna, yPos, colPregunta, filaAltura, 'F');
  doc.rect(tablaInicioX + anchoColumna + colPregunta, yPos, colSi, filaAltura, 'F');
  doc.rect(tablaInicioX + anchoColumna + colPregunta + colSi, yPos, colNo, filaAltura, 'F');
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + colPregunta, yPos, tablaInicioX + colPregunta, yPos + filaAltura);
  doc.line(tablaInicioX + colPregunta + colSi, yPos, tablaInicioX + colPregunta + colSi, yPos + filaAltura);
  doc.line(tablaInicioX + anchoColumna, yPos, tablaInicioX + anchoColumna, yPos + filaAltura);
  doc.line(tablaInicioX + anchoColumna + colPregunta, yPos, tablaInicioX + anchoColumna + colPregunta, yPos + filaAltura);
  doc.line(tablaInicioX + anchoColumna + colPregunta + colSi, yPos, tablaInicioX + anchoColumna + colPregunta + colSi, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Texto SI y NO en celdas del header
  doc.setFont("helvetica", "bold").setFontSize(7);
  // Columna izquierda
  doc.text("SI", tablaInicioX + colPregunta + colSi / 2, yPos + 3.5, { align: "center" });
  doc.text("NO", tablaInicioX + colPregunta + colSi + colNo / 2, yPos + 3.5, { align: "center" });
  // Columna derecha
  doc.text("SI", tablaInicioX + anchoColumna + colPregunta + colSi / 2, yPos + 3.5, { align: "center" });
  doc.text("NO", tablaInicioX + anchoColumna + colPregunta + colSi + colNo / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // Columna izquierda y derecha
  yColumnaIzq = yPos;
  yColumnaDer = yPos;
  const yInicioColumnas2 = yPos;
  
  // Definir pares de filas (izquierda, derecha)
  const paresFilas2 = [
    { izq: { pregunta: "Se encuentra resfriado o con algún cuadro respiratorio", valor: datosFinales.tieneResfriado }, der: { pregunta: "Consumió licor en la últimas 24 horas", valor: datosFinales.consumioLicor } },
    { izq: { pregunta: "Sufre de vértigo o mareos diagnosticados recientemente", valor: datosFinales.tieneVertigo }, der: { pregunta: "Frecuencia de cefaleas", valor: datosFinales.frecuenciaCefaleas } }
  ];
  
  // Dibujar cada par de filas con la misma altura
  paresFilas2.forEach(par => {
    // Calcular altura máxima del par
    const alturaIzq = calcularAlturaFila(par.izq.pregunta, anchoColumna);
    const alturaDer = calcularAlturaFila(par.der.pregunta, anchoColumna);
    const alturaMaxima = Math.max(alturaIzq, alturaDer);
    
    // Dibujar fila izquierda con altura fija
    yColumnaIzq = dibujarFilaAntecedente(par.izq.pregunta, par.izq.valor, yColumnaIzq, xColumnaIzq, anchoColumna, alturaMaxima);
    
    // Dibujar fila derecha con altura fija
    yColumnaDer = dibujarFilaAntecedente(par.der.pregunta, par.der.valor, yColumnaDer, xColumnaDer, anchoColumna, alturaMaxima);
  });

  // Ajustar yPos al máximo de ambas columnas (deberían ser iguales ahora)
  yPos = Math.max(yColumnaIzq, yColumnaDer);
  
  // Dibujar líneas verticales y horizontales que conectan ambas columnas
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yInicioColumnas2, tablaInicioX, yPos); // Línea izquierda completa
  doc.line(tablaInicioX + tablaAncho / 2, yInicioColumnas2, tablaInicioX + tablaAncho / 2, yPos); // Línea central
  doc.line(tablaInicioX + tablaAncho, yInicioColumnas2, tablaInicioX + tablaAncho, yPos); // Línea derecha completa
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea horizontal inferior

  // Campo de texto creciente: Detalle de las medicinas
  yPos = dibujarTextoCreciente(datosFinales.detalleMedicinas, "Detalle de las medicinas que está tomando", yPos, filaAltura);

  // === SECCIÓN 4: EXAMEN FÍSICO (actual) ===
  // Verificar si necesitamos nueva página
  if (yPos + 80 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 40;
    drawHeader(numeroPagina);
  }

  yPos = dibujarHeaderSeccion("4.- EXAMEN FÍSICO (actual)", yPos, filaAltura);

  // Fila de Signos Vitales y Antropométricos con divisiones
  const alturaFilaSignos = 5;
  const anchoTotalSignos = tablaAncho;
  const numColumnas = 7; // FC, FR, PA, Sat O2, Talla, Peso, IMC
  const anchoColumnaSignos = anchoTotalSignos / numColumnas;
  
  // Dibujar líneas de la fila
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaSignos);
  for (let i = 1; i <= numColumnas; i++) {
    doc.line(tablaInicioX + anchoColumnaSignos * i, yPos, tablaInicioX + anchoColumnaSignos * i, yPos + alturaFilaSignos);
  }
  doc.line(tablaInicioX, yPos, tablaInicioX + anchoTotalSignos, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaSignos, tablaInicioX + anchoTotalSignos, yPos + alturaFilaSignos);
  
  // Texto en cada celda
  doc.setFont("helvetica", "normal").setFontSize(7);
  let xActual = tablaInicioX;
  doc.text("FC: " + (datosFinales.frecuenciaCardiaca || "") + " x min", xActual + 2, yPos + 3.5);
  xActual += anchoColumnaSignos;
  doc.text("FR: " + (datosFinales.frecuenciaRespiratoria || "") + " x min", xActual + 2, yPos + 3.5);
  xActual += anchoColumnaSignos;
  doc.text("PA: " + (datosFinales.presionArterial || "") + " mmHg", xActual + 2, yPos + 3.5);
  xActual += anchoColumnaSignos;
  doc.text("Sat O2: " + (datosFinales.saturacionOxigeno || "") + "%", xActual + 2, yPos + 3.5);
  xActual += anchoColumnaSignos;
  doc.text("Talla: " + (datosFinales.talla || "") + " mts.", xActual + 2, yPos + 3.5);
  xActual += anchoColumnaSignos;
  doc.text("Peso: " + (datosFinales.peso || "") + " Kg.", xActual + 2, yPos + 3.5);
  xActual += anchoColumnaSignos;
  doc.text("IMC: " + (datosFinales.imc || "") + (datosFinales.imc ? " kg/m²" : ""), xActual + 2, yPos + 3.5);
  
  yPos += alturaFilaSignos; // Reducir espacio superior

  // Layout: Imagen a la izquierda, 3 columnas a la derecha
  const anchoImagen = 25; // Imagen más reducida
  const espacioEntre = 1.5; // Reducir espacio entre imagen y columnas
  
  const xImagen = tablaInicioX;
  const yImagen = yPos;
  const xCol1 = xImagen + anchoImagen + espacioEntre;
  // Calcular ancho disponible hasta el margen derecho (usar todo el ancho disponible)
  const xCol3Final = tablaInicioX + tablaAncho;
  const anchoColumnaHallazgos = (xCol3Final - xCol1) / 3; // Mismo ancho para las 3 columnas, llegando al margen
  const xCol2 = xCol1 + anchoColumnaHallazgos;
  const xCol3 = xCol2 + anchoColumnaHallazgos;
  let yTablas = yPos; // Empezar al mismo nivel que la imagen

  // Calcular altura total de las columnas antes de cargar la imagen
  const calcularAlturaColumnas = () => {
    const alturaHeaderHallazgos = 4;
    
    // Definir las filas de cada columna
    const filasCol1 = [
      { pregunta: "Hallazgos Anormales Hombro: Cirugías, Accidentes, Congénitos", valor: datosFinales.hallazgosHombro },
      { pregunta: "Hallazgos Anormales Codo: Cirugías, Accidentes, Congénitos.", valor: datosFinales.hallazgosCodo },
      { pregunta: "Hallazgos Anormales Rodilla: Cirugías, Accidentes, Congénitos.", valor: datosFinales.hallazgosRodilla },
      { pregunta: "Hallazgos Anormales Tobillo: Cirugías, Accidentes, Congénitos.", valor: datosFinales.hallazgosTobillo },
      { pregunta: "Otros Hallazgos Alteración Musculo- Esqueléticos.", valor: datosFinales.otrosHallazgosMusculoEsqueleticos }
    ];
    
    const filasCol2 = [
      { pregunta: "Limitación en Fuerza y/o movilidad de extremidades", valor: datosFinales.limitacionFuerzaMovilidad },
      { pregunta: "Alteración del equilibrio", valor: datosFinales.alteracionEquilibrio },
      { pregunta: "Anormalidad en la marcha", valor: datosFinales.anormalidadMarcha },
      { pregunta: "Anormalidad en la fuerza de los miembros", valor: datosFinales.anormalidadFuerzaMiembros },
      { pregunta: "Lenguaje anormal", valor: datosFinales.lenguajeAnormal }
    ];
    
    const filasCol3 = [
      { pregunta: "Alteración de la coordinación", valor: datosFinales.alteracionCoordinacion },
      { pregunta: "Presencia de nisfagmus", valor: datosFinales.presenciaNistagmus },
      { pregunta: "Anormalidad en movimientos oculares", valor: datosFinales.anormalidadMovimientosOculares },
      { pregunta: "Pupilas CIRLA", valor: datosFinales.pupilasCIRLA },
      { pregunta: "Asimetría facial", valor: datosFinales.asimetriaFacial }
    ];
    
    // Calcular alturas para cada fila
    const numFilas = Math.max(filasCol1.length, filasCol2.length, filasCol3.length);
    const alturasFilas = [];
    
    for (let i = 0; i < numFilas; i++) {
      let alturaMax = 0;
      if (i < filasCol1.length) {
        alturaMax = Math.max(alturaMax, calcularAlturaFila(filasCol1[i].pregunta, anchoColumnaHallazgos));
      }
      if (i < filasCol2.length) {
        alturaMax = Math.max(alturaMax, calcularAlturaFila(filasCol2[i].pregunta, anchoColumnaHallazgos));
      }
      if (i < filasCol3.length) {
        alturaMax = Math.max(alturaMax, calcularAlturaFila(filasCol3[i].pregunta, anchoColumnaHallazgos));
      }
      alturasFilas.push(alturaMax);
    }
    
    // Sumar todas las alturas
    const alturaTotalFilas = alturasFilas.reduce((sum, altura) => sum + altura, 0);
    return alturaHeaderHallazgos + alturaTotalFilas;
  };

  // Función para cargar y dibujar imagen del cuerpo
  const cargarImagenCuerpo = () => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      // Ruta desde public
      img.src = '/img/Altura18/cuerpo_jasper_18.png';
      
      img.onload = () => {
        const imgAncho = anchoImagen;
        // Calcular altura de las columnas y ajustar la imagen a esa altura
        const alturaColumnas = calcularAlturaColumnas();
        const imgAlto = alturaColumnas; // Usar la altura de las columnas en lugar de mantener proporción
        
        doc.addImage(img, 'PNG', xImagen, yImagen, imgAncho, imgAlto);
        resolve({ yFinal: yImagen + imgAlto, imgAlto });
      };
      
      img.onerror = () => {
        console.error("Error al cargar imagen del cuerpo");
        resolve({ yFinal: yPos, imgAlto: 0 }); // Continuar sin la imagen
      };
    });
  };

  // Función para continuar con las tablas después de cargar la imagen
  const continuarConTablas = (resultadoImagen) => {
    
    // Header para cada columna
    const alturaHeaderHallazgos = 4;
    doc.setFillColor(199, 241, 255);
    
    // Header Columna 1
    doc.rect(xCol1, yTablas, anchoColumnaHallazgos, alturaHeaderHallazgos, 'F');
    doc.rect(xCol1 + anchoColumnaHallazgos - colSi - colNo, yTablas, colSi, alturaHeaderHallazgos, 'F');
    doc.rect(xCol1 + anchoColumnaHallazgos - colNo, yTablas, colNo, alturaHeaderHallazgos, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(xCol1, yTablas, xCol1, yTablas + alturaHeaderHallazgos);
    doc.line(xCol1 + anchoColumnaHallazgos - colSi - colNo, yTablas, xCol1 + anchoColumnaHallazgos - colSi - colNo, yTablas + alturaHeaderHallazgos);
    doc.line(xCol1 + anchoColumnaHallazgos - colNo, yTablas, xCol1 + anchoColumnaHallazgos - colNo, yTablas + alturaHeaderHallazgos);
    doc.line(xCol1 + anchoColumnaHallazgos, yTablas, xCol1 + anchoColumnaHallazgos, yTablas + alturaHeaderHallazgos);
    doc.line(xCol1, yTablas, xCol1 + anchoColumnaHallazgos, yTablas);
    doc.line(xCol1, yTablas + alturaHeaderHallazgos, xCol1 + anchoColumnaHallazgos, yTablas + alturaHeaderHallazgos);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("SI", xCol1 + anchoColumnaHallazgos - colSi - colNo + colSi / 2, yTablas + 3, { align: "center" });
    doc.text("NO", xCol1 + anchoColumnaHallazgos - colNo + colNo / 2, yTablas + 3, { align: "center" });
    
    // Header Columna 2
    doc.setFillColor(199, 241, 255);
    doc.rect(xCol2, yTablas, anchoColumnaHallazgos, alturaHeaderHallazgos, 'F');
    doc.rect(xCol2 + anchoColumnaHallazgos - colSi - colNo, yTablas, colSi, alturaHeaderHallazgos, 'F');
    doc.rect(xCol2 + anchoColumnaHallazgos - colNo, yTablas, colNo, alturaHeaderHallazgos, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.line(xCol2, yTablas, xCol2, yTablas + alturaHeaderHallazgos);
    doc.line(xCol2 + anchoColumnaHallazgos - colSi - colNo, yTablas, xCol2 + anchoColumnaHallazgos - colSi - colNo, yTablas + alturaHeaderHallazgos);
    doc.line(xCol2 + anchoColumnaHallazgos - colNo, yTablas, xCol2 + anchoColumnaHallazgos - colNo, yTablas + alturaHeaderHallazgos);
    doc.line(xCol2 + anchoColumnaHallazgos, yTablas, xCol2 + anchoColumnaHallazgos, yTablas + alturaHeaderHallazgos);
    doc.line(xCol2, yTablas, xCol2 + anchoColumnaHallazgos, yTablas);
    doc.line(xCol2, yTablas + alturaHeaderHallazgos, xCol2 + anchoColumnaHallazgos, yTablas + alturaHeaderHallazgos);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("SI", xCol2 + anchoColumnaHallazgos - colSi - colNo + colSi / 2, yTablas + 3, { align: "center" });
    doc.text("NO", xCol2 + anchoColumnaHallazgos - colNo + colNo / 2, yTablas + 3, { align: "center" });
    
    // Header Columna 3
    doc.setFillColor(199, 241, 255);
    doc.rect(xCol3, yTablas, anchoColumnaHallazgos, alturaHeaderHallazgos, 'F');
    doc.rect(xCol3 + anchoColumnaHallazgos - colSi - colNo, yTablas, colSi, alturaHeaderHallazgos, 'F');
    doc.rect(xCol3 + anchoColumnaHallazgos - colNo, yTablas, colNo, alturaHeaderHallazgos, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.line(xCol3, yTablas, xCol3, yTablas + alturaHeaderHallazgos);
    doc.line(xCol3 + anchoColumnaHallazgos - colSi - colNo, yTablas, xCol3 + anchoColumnaHallazgos - colSi - colNo, yTablas + alturaHeaderHallazgos);
    doc.line(xCol3 + anchoColumnaHallazgos - colNo, yTablas, xCol3 + anchoColumnaHallazgos - colNo, yTablas + alturaHeaderHallazgos);
    doc.line(xCol3 + anchoColumnaHallazgos, yTablas, xCol3 + anchoColumnaHallazgos, yTablas + alturaHeaderHallazgos);
    doc.line(xCol3, yTablas, xCol3 + anchoColumnaHallazgos, yTablas);
    doc.line(xCol3, yTablas + alturaHeaderHallazgos, xCol3 + anchoColumnaHallazgos, yTablas + alturaHeaderHallazgos);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("SI", xCol3 + anchoColumnaHallazgos - colSi - colNo + colSi / 2, yTablas + 3, { align: "center" });
    doc.text("NO", xCol3 + anchoColumnaHallazgos - colNo + colNo / 2, yTablas + 3, { align: "center" });
    
    yTablas += alturaHeaderHallazgos;
    
    // Definir las filas de cada columna
    const filasCol1 = [
      { pregunta: "Hallazgos Anormales Hombro: Cirugías, Accidentes, Congénitos", valor: datosFinales.hallazgosHombro },
      { pregunta: "Hallazgos Anormales Codo: Cirugías, Accidentes, Congénitos.", valor: datosFinales.hallazgosCodo },
      { pregunta: "Hallazgos Anormales Rodilla: Cirugías, Accidentes, Congénitos.", valor: datosFinales.hallazgosRodilla },
      { pregunta: "Hallazgos Anormales Tobillo: Cirugías, Accidentes, Congénitos.", valor: datosFinales.hallazgosTobillo },
      { pregunta: "Otros Hallazgos Alteración Musculo- Esqueléticos.", valor: datosFinales.otrosHallazgosMusculoEsqueleticos }
    ];
    
    const filasCol2 = [
      { pregunta: "Limitación en Fuerza y/o movilidad de extremidades", valor: datosFinales.limitacionFuerzaMovilidad },
      { pregunta: "Alteración del equilibrio", valor: datosFinales.alteracionEquilibrio },
      { pregunta: "Anormalidad en la marcha", valor: datosFinales.anormalidadMarcha },
      { pregunta: "Anormalidad en la fuerza de los miembros", valor: datosFinales.anormalidadFuerzaMiembros },
      { pregunta: "Lenguaje anormal", valor: datosFinales.lenguajeAnormal }
    ];
    
    const filasCol3 = [
      { pregunta: "Alteración de la coordinación", valor: datosFinales.alteracionCoordinacion },
      { pregunta: "Presencia de nisfagmus", valor: datosFinales.presenciaNistagmus },
      { pregunta: "Anormalidad en movimientos oculares", valor: datosFinales.anormalidadMovimientosOculares },
      { pregunta: "Pupilas CIRLA", valor: datosFinales.pupilasCIRLA },
      { pregunta: "Asimetría facial", valor: datosFinales.asimetriaFacial }
    ];
    
    // Calcular alturas para cada fila lógica (tomando el máximo entre las 3 columnas)
    const numFilas = Math.max(filasCol1.length, filasCol2.length, filasCol3.length);
    const alturasFilas = [];
    
    for (let i = 0; i < numFilas; i++) {
      let alturaMax = 0;
      if (i < filasCol1.length) {
        alturaMax = Math.max(alturaMax, calcularAlturaFila(filasCol1[i].pregunta, anchoColumnaHallazgos));
      }
      if (i < filasCol2.length) {
        alturaMax = Math.max(alturaMax, calcularAlturaFila(filasCol2[i].pregunta, anchoColumnaHallazgos));
      }
      if (i < filasCol3.length) {
        alturaMax = Math.max(alturaMax, calcularAlturaFila(filasCol3[i].pregunta, anchoColumnaHallazgos));
      }
      alturasFilas.push(alturaMax);
    }
    
    // Dibujar todas las filas con la altura máxima calculada
    let yCol1 = yTablas;
    let yCol2 = yTablas;
    let yCol3 = yTablas;
    
    for (let i = 0; i < numFilas; i++) {
      const alturaFila = alturasFilas[i];
      
      // Dibujar fila en Columna 1
      if (i < filasCol1.length) {
        yCol1 = dibujarFilaAntecedente(filasCol1[i].pregunta, filasCol1[i].valor, yCol1, xCol1, anchoColumnaHallazgos, alturaFila);
      } else {
        // Si no hay fila en esta columna, dibujar celda vacía con la misma altura
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);
        doc.line(xCol1, yCol1, xCol1, yCol1 + alturaFila);
        doc.line(xCol1 + anchoColumnaHallazgos, yCol1, xCol1 + anchoColumnaHallazgos, yCol1 + alturaFila);
        doc.line(xCol1, yCol1, xCol1 + anchoColumnaHallazgos, yCol1);
        doc.line(xCol1, yCol1 + alturaFila, xCol1 + anchoColumnaHallazgos, yCol1 + alturaFila);
        yCol1 += alturaFila;
      }
      
      // Dibujar fila en Columna 2
      if (i < filasCol2.length) {
        yCol2 = dibujarFilaAntecedente(filasCol2[i].pregunta, filasCol2[i].valor, yCol2, xCol2, anchoColumnaHallazgos, alturaFila);
      } else {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);
        doc.line(xCol2, yCol2, xCol2, yCol2 + alturaFila);
        doc.line(xCol2 + anchoColumnaHallazgos, yCol2, xCol2 + anchoColumnaHallazgos, yCol2 + alturaFila);
        doc.line(xCol2, yCol2, xCol2 + anchoColumnaHallazgos, yCol2);
        doc.line(xCol2, yCol2 + alturaFila, xCol2 + anchoColumnaHallazgos, yCol2 + alturaFila);
        yCol2 += alturaFila;
      }
      
      // Dibujar fila en Columna 3
      if (i < filasCol3.length) {
        yCol3 = dibujarFilaAntecedente(filasCol3[i].pregunta, filasCol3[i].valor, yCol3, xCol3, anchoColumnaHallazgos, alturaFila);
      } else {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);
        doc.line(xCol3, yCol3, xCol3, yCol3 + alturaFila);
        doc.line(xCol3 + anchoColumnaHallazgos, yCol3, xCol3 + anchoColumnaHallazgos, yCol3 + alturaFila);
        doc.line(xCol3, yCol3, xCol3 + anchoColumnaHallazgos, yCol3);
        doc.line(xCol3, yCol3 + alturaFila, xCol3 + anchoColumnaHallazgos, yCol3 + alturaFila);
        yCol3 += alturaFila;
      }
    }
    
    // Ajustar yPos al máximo entre la imagen y las tres columnas
    yPos = Math.max(resultadoImagen.yFinal, yCol1, yCol2, yCol3);
    
    // === SECCIÓN 5: CONCLUSIÓN ===
    yPos = dibujarSeccionConclusion(yPos);
    
    // === SECCIÓN 6: OBSERVACIONES/RECOMENDACIONES Y FIRMAS ===
    dibujarSeccionObservacionesYFirmas(yPos);
  };
  
  // Cargar imagen y continuar
  cargarImagenCuerpo().then(continuarConTablas).catch((error) => {
    console.error("Error al cargar imagen:", error);
    // Continuar sin la imagen - dibujar tablas sin esperar imagen
    // Header para cada columna
    const alturaHeaderHallazgos = 4;
    doc.setFillColor(199, 241, 255);
    
    // Header Columna 1
    doc.rect(xCol1, yTablas, anchoColumnaHallazgos, alturaHeaderHallazgos, 'F');
    doc.rect(xCol1 + anchoColumnaHallazgos - colSi - colNo, yTablas, colSi, alturaHeaderHallazgos, 'F');
    doc.rect(xCol1 + anchoColumnaHallazgos - colNo, yTablas, colNo, alturaHeaderHallazgos, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(xCol1, yTablas, xCol1, yTablas + alturaHeaderHallazgos);
    doc.line(xCol1 + anchoColumnaHallazgos - colSi - colNo, yTablas, xCol1 + anchoColumnaHallazgos - colSi - colNo, yTablas + alturaHeaderHallazgos);
    doc.line(xCol1 + anchoColumnaHallazgos - colNo, yTablas, xCol1 + anchoColumnaHallazgos - colNo, yTablas + alturaHeaderHallazgos);
    doc.line(xCol1 + anchoColumnaHallazgos, yTablas, xCol1 + anchoColumnaHallazgos, yTablas + alturaHeaderHallazgos);
    doc.line(xCol1, yTablas, xCol1 + anchoColumnaHallazgos, yTablas);
    doc.line(xCol1, yTablas + alturaHeaderHallazgos, xCol1 + anchoColumnaHallazgos, yTablas + alturaHeaderHallazgos);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("SI", xCol1 + anchoColumnaHallazgos - colSi - colNo + colSi / 2, yTablas + 3, { align: "center" });
    doc.text("NO", xCol1 + anchoColumnaHallazgos - colNo + colNo / 2, yTablas + 3, { align: "center" });
    
    // Header Columna 2
    doc.setFillColor(199, 241, 255);
    doc.rect(xCol2, yTablas, anchoColumnaHallazgos, alturaHeaderHallazgos, 'F');
    doc.rect(xCol2 + anchoColumnaHallazgos - colSi - colNo, yTablas, colSi, alturaHeaderHallazgos, 'F');
    doc.rect(xCol2 + anchoColumnaHallazgos - colNo, yTablas, colNo, alturaHeaderHallazgos, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.line(xCol2, yTablas, xCol2, yTablas + alturaHeaderHallazgos);
    doc.line(xCol2 + anchoColumnaHallazgos - colSi - colNo, yTablas, xCol2 + anchoColumnaHallazgos - colSi - colNo, yTablas + alturaHeaderHallazgos);
    doc.line(xCol2 + anchoColumnaHallazgos - colNo, yTablas, xCol2 + anchoColumnaHallazgos - colNo, yTablas + alturaHeaderHallazgos);
    doc.line(xCol2 + anchoColumnaHallazgos, yTablas, xCol2 + anchoColumnaHallazgos, yTablas + alturaHeaderHallazgos);
    doc.line(xCol2, yTablas, xCol2 + anchoColumnaHallazgos, yTablas);
    doc.line(xCol2, yTablas + alturaHeaderHallazgos, xCol2 + anchoColumnaHallazgos, yTablas + alturaHeaderHallazgos);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("SI", xCol2 + anchoColumnaHallazgos - colSi - colNo + colSi / 2, yTablas + 3, { align: "center" });
    doc.text("NO", xCol2 + anchoColumnaHallazgos - colNo + colNo / 2, yTablas + 3, { align: "center" });
    
    // Header Columna 3
    doc.setFillColor(199, 241, 255);
    doc.rect(xCol3, yTablas, anchoColumnaHallazgos, alturaHeaderHallazgos, 'F');
    doc.rect(xCol3 + anchoColumnaHallazgos - colSi - colNo, yTablas, colSi, alturaHeaderHallazgos, 'F');
    doc.rect(xCol3 + anchoColumnaHallazgos - colNo, yTablas, colNo, alturaHeaderHallazgos, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.line(xCol3, yTablas, xCol3, yTablas + alturaHeaderHallazgos);
    doc.line(xCol3 + anchoColumnaHallazgos - colSi - colNo, yTablas, xCol3 + anchoColumnaHallazgos - colSi - colNo, yTablas + alturaHeaderHallazgos);
    doc.line(xCol3 + anchoColumnaHallazgos - colNo, yTablas, xCol3 + anchoColumnaHallazgos - colNo, yTablas + alturaHeaderHallazgos);
    doc.line(xCol3 + anchoColumnaHallazgos, yTablas, xCol3 + anchoColumnaHallazgos, yTablas + alturaHeaderHallazgos);
    doc.line(xCol3, yTablas, xCol3 + anchoColumnaHallazgos, yTablas);
    doc.line(xCol3, yTablas + alturaHeaderHallazgos, xCol3 + anchoColumnaHallazgos, yTablas + alturaHeaderHallazgos);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("SI", xCol3 + anchoColumnaHallazgos - colSi - colNo + colSi / 2, yTablas + 3, { align: "center" });
    doc.text("NO", xCol3 + anchoColumnaHallazgos - colNo + colNo / 2, yTablas + 3, { align: "center" });
    
    yTablas += alturaHeaderHallazgos;
    
    // Definir las filas de cada columna
    const filasCol1 = [
      { pregunta: "Hallazgos Anormales Hombro: Cirugías, Accidentes, Congénitos", valor: datosFinales.hallazgosHombro },
      { pregunta: "Hallazgos Anormales Codo: Cirugías, Accidentes, Congénitos.", valor: datosFinales.hallazgosCodo },
      { pregunta: "Hallazgos Anormales Rodilla: Cirugías, Accidentes, Congénitos.", valor: datosFinales.hallazgosRodilla },
      { pregunta: "Hallazgos Anormales Tobillo: Cirugías, Accidentes, Congénitos.", valor: datosFinales.hallazgosTobillo },
      { pregunta: "Otros Hallazgos Alteración Musculo- Esqueléticos.", valor: datosFinales.otrosHallazgosMusculoEsqueleticos }
    ];
    
    const filasCol2 = [
      { pregunta: "Limitación en Fuerza y/o movilidad de extremidades", valor: datosFinales.limitacionFuerzaMovilidad },
      { pregunta: "Alteración del equilibrio", valor: datosFinales.alteracionEquilibrio },
      { pregunta: "Anormalidad en la marcha", valor: datosFinales.anormalidadMarcha },
      { pregunta: "Anormalidad en la fuerza de los miembros", valor: datosFinales.anormalidadFuerzaMiembros },
      { pregunta: "Lenguaje anormal", valor: datosFinales.lenguajeAnormal }
    ];
    
    const filasCol3 = [
      { pregunta: "Alteración de la coordinación", valor: datosFinales.alteracionCoordinacion },
      { pregunta: "Presencia de nisfagmus", valor: datosFinales.presenciaNistagmus },
      { pregunta: "Anormalidad en movimientos oculares", valor: datosFinales.anormalidadMovimientosOculares },
      { pregunta: "Pupilas CIRLA", valor: datosFinales.pupilasCIRLA },
      { pregunta: "Asimetría facial", valor: datosFinales.asimetriaFacial }
    ];
    
    // Calcular alturas para cada fila lógica (tomando el máximo entre las 3 columnas)
    const numFilas = Math.max(filasCol1.length, filasCol2.length, filasCol3.length);
    const alturasFilas = [];
    
    for (let i = 0; i < numFilas; i++) {
      let alturaMax = 0;
      if (i < filasCol1.length) {
        alturaMax = Math.max(alturaMax, calcularAlturaFila(filasCol1[i].pregunta, anchoColumnaHallazgos));
      }
      if (i < filasCol2.length) {
        alturaMax = Math.max(alturaMax, calcularAlturaFila(filasCol2[i].pregunta, anchoColumnaHallazgos));
      }
      if (i < filasCol3.length) {
        alturaMax = Math.max(alturaMax, calcularAlturaFila(filasCol3[i].pregunta, anchoColumnaHallazgos));
      }
      alturasFilas.push(alturaMax);
    }
    
    // Dibujar todas las filas con la altura máxima calculada
    let yCol1 = yTablas;
    let yCol2 = yTablas;
    let yCol3 = yTablas;
    
    for (let i = 0; i < numFilas; i++) {
      const alturaFila = alturasFilas[i];
      
      // Dibujar fila en Columna 1
      if (i < filasCol1.length) {
        yCol1 = dibujarFilaAntecedente(filasCol1[i].pregunta, filasCol1[i].valor, yCol1, xCol1, anchoColumnaHallazgos, alturaFila);
      } else {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);
        doc.line(xCol1, yCol1, xCol1, yCol1 + alturaFila);
        doc.line(xCol1 + anchoColumnaHallazgos, yCol1, xCol1 + anchoColumnaHallazgos, yCol1 + alturaFila);
        doc.line(xCol1, yCol1, xCol1 + anchoColumnaHallazgos, yCol1);
        doc.line(xCol1, yCol1 + alturaFila, xCol1 + anchoColumnaHallazgos, yCol1 + alturaFila);
        yCol1 += alturaFila;
      }
      
      // Dibujar fila en Columna 2
      if (i < filasCol2.length) {
        yCol2 = dibujarFilaAntecedente(filasCol2[i].pregunta, filasCol2[i].valor, yCol2, xCol2, anchoColumnaHallazgos, alturaFila);
      } else {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);
        doc.line(xCol2, yCol2, xCol2, yCol2 + alturaFila);
        doc.line(xCol2 + anchoColumnaHallazgos, yCol2, xCol2 + anchoColumnaHallazgos, yCol2 + alturaFila);
        doc.line(xCol2, yCol2, xCol2 + anchoColumnaHallazgos, yCol2);
        doc.line(xCol2, yCol2 + alturaFila, xCol2 + anchoColumnaHallazgos, yCol2 + alturaFila);
        yCol2 += alturaFila;
      }
      
      // Dibujar fila en Columna 3
      if (i < filasCol3.length) {
        yCol3 = dibujarFilaAntecedente(filasCol3[i].pregunta, filasCol3[i].valor, yCol3, xCol3, anchoColumnaHallazgos, alturaFila);
      } else {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);
        doc.line(xCol3, yCol3, xCol3, yCol3 + alturaFila);
        doc.line(xCol3 + anchoColumnaHallazgos, yCol3, xCol3 + anchoColumnaHallazgos, yCol3 + alturaFila);
        doc.line(xCol3, yCol3, xCol3 + anchoColumnaHallazgos, yCol3);
        doc.line(xCol3, yCol3 + alturaFila, xCol3 + anchoColumnaHallazgos, yCol3 + alturaFila);
        yCol3 += alturaFila;
      }
    }
    
    yPos = Math.max(yCol1, yCol2, yCol3);
    
    // === SECCIÓN 5: CONCLUSIÓN ===
    yPos = dibujarSeccionConclusion(yPos);
    
    // === SECCIÓN 6: OBSERVACIONES/RECOMENDACIONES Y FIRMAS ===
    dibujarSeccionObservacionesYFirmas(yPos);
  });
  
  // Si es docExistente, retornar el doc inmediatamente
  // Las tablas se agregarán de forma asíncrona, pero el doc se modifica por referencia
  if (docExistente) {
    return doc;
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
