import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils";
import { convertirGenero } from "../../../utils/helpers";
import { dibujarTextoEnFilaCreciente, calcularAlturaTextoCreciente } from "../../../utils/formatoParaTextoCrecienteFila.js";
import drawColorBox from '../../components/ColorBox.jsx';
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';

export default async function InformePsicologico_Anexo02_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente) + " " + (data.nombresPaciente)).trim(),
    fechaExamen: formatearFechaCorta(data.fechaExamen_fecha),
    tipoExamen: String(data.nombreExamen),
    sexo: convertirGenero(data.sexoPaciente),
    documentoIdentidad: String(data.dniPaciente),
    edad: String(data.edadPaciente),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente),
    areaTrabajo: data.areaPaciente,
    puestoTrabajo: data.cargoPaciente,
    empresa: data.empresa,
    contrata: data.contrata,
    // Datos de color
    color: data.color,
    codigoColor: data.codigoColor,
    textoColor: data.textoColor,
    // Datos adicionales para header
    numeroFicha: String(data.norden),
    sede: data.sede || data.nombreSede,
    direccionPaciente: String(data.direccionPaciente),
    // Datos específicos del informe psicológico
    motivoEvaluacion: data.motivoEvaluacion_motivo_eval,
    examenMental: {
      presentacion: {
        adecuado: data.presentacionAdecuado_rb_adecuado || false,
        inadecuado: data.presentacionInadecuado_rb_inadecuado || false
      },
      postura: {
        erguida: data.posturaErguida_rb_erguida || false,
        encorvada: data.posturaEncorvada_rb_encorvada || false
      },
      ritmo: {
        lento: data.ritmoLento_rb_lento || false,
        rapido: data.ritmoRapido_rb_rapido || false,
        fluido: data.ritmoFluido_rb_fluido || false
      },
      tono: {
        bajo: data.tonoBajo_rb_bajo || false,
        moderado: data.tonoModerado_rb_moderado || false,
        alto: data.tonoAlto_rb_alto || false
      },
      orientacion: {
        tiempo: {
          orientado: data.tiempoOrientado_rb_tiempo_orientado || false,
          desorientado: data.tiempoDesorientado_rb_tiempo_desorientado || false
        },
        espacio: {
          orientado: data.espacioOrientado_rb_espacio_orientado || false,
          desorientado: data.espacioDesorientado_rb_espacio_desorientado || false
        },
        persona: {
          orientado: data.personaOrientado_rb_persona_orientado || false,
          desorientado: data.personaDesorientado_rb_persona_desorientado || false
        }
      },
      articulacion: {
        conDificultad: data.articulacionConDificultad_rb_condificultad || false,
        sinDificultad: data.articulacionSinDificultad_rb_sindificultad || false,
      }
    },
    // Datos de resultados de evaluación
    nivelIntelectual: data.nivelIntelectual_resul_nivel_intelectual,
    coordinacionVisomotriz: data.coordinacionVisomotriz_resul_coordinacion_visomotriz,
    nivelMemoria: data.nivelMemoria_resul_nivel_memoria,
    personalidad: data.personalidad_resul_personalidad,
    afectividad: data.efectividad_resul_efectividad,
    // Datos de conclusiones y recomendaciones
    areaCognitiva: data.areaCognitiva_areacognitiva,
    areaEmocional: data.areaEmocional_areaemocional,
    recomendaciones: data.recomendaciones_recomendaciones,
    // Datos de evaluación final
    cumplePerfil: data.apto_apto,
    // Flag para OHLA
    esOhla: Boolean(data.esOhla ?? false)
  };

  // Usar solo datos reales
  // Función para convertir texto a formato gramaticalmente correcto (primera letra mayúscula, resto minúsculas)
  const formatearTextoGramatical = (texto) => {
    if (!texto || typeof texto !== 'string') return texto;

    // Dividir por líneas para manejar listas con viñetas
    const lineas = texto.split('\n');
    const lineasFormateadas = lineas.map(linea => {
      if (!linea.trim()) return linea; // Mantener líneas vacías

      // Si la línea empieza con "- " (viñeta), formatear después del guión
      if (linea.trim().startsWith('- ')) {
        const contenido = linea.trim().substring(2); // Quitar "- "
        return '- ' + contenido.charAt(0).toUpperCase() + contenido.slice(1).toLowerCase();
      }

      // Si la línea empieza con ". " (punto), formatear después del punto
      if (linea.trim().startsWith('. ')) {
        const contenido = linea.trim().substring(2); // Quitar ". "
        return '. ' + contenido.charAt(0).toUpperCase() + contenido.slice(1).toLowerCase();
      }

      // Para líneas normales, formatear toda la línea
      return linea.charAt(0).toUpperCase() + linea.slice(1).toLowerCase();
    });

    return lineasFormateadas.join('\n');
  };

  const datosFinales = datosReales;

  // Header reutilizable
  const drawHeader = async (pageNumber) => {
    // Logo y membrete
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.text("INFORME PSICOLÓGICO OCUPACIONAL - ANEXO 02", pageW / 2, 32, { align: "center" });
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

  // === DIBUJAR HEADER ===
  await drawHeader(numeroPagina);

  // === VARIABLES DE TABLA ===
  const tablaInicioX = 5;
  const tablaAncho = 200;

  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    // Validar que el texto no sea undefined, null o vacío
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
          yPos += fontSize * 0.35; // salto real entre líneas
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

    return yPos; // Devuelve la nueva posición final
  };



  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    // Usar las variables del scope principal en lugar de valores hardcodeados
    // const tablaInicioX = 5;
    // const tablaAncho = 200;

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

  // Función para dibujar subheader con color celeste
  const dibujarSubHeaderCeleste = (titulo, yPos, alturaHeader = 5) => {
    // Usar las variables del scope principal en lugar de valores hardcodeados
    // const tablaInicioX = 10;
    // const tablaAncho = 190;

    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // Dibujar fondo celeste
    doc.setFillColor(199, 241, 255); // Color celeste claro
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');

    // Dibujar líneas del subheader
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);

    // Dibujar texto del subtítulo
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);

    return yPos + alturaHeader;
  };

  // === SECCIÓN 1: DATOS PERSONALES ===
  let yPos = 35.5;
  const filaAltura = 4.8;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);

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

  // Fila: Empresa (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
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

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 35.5 + filaAltura + 2.5; // Ajustar para el header

  // Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Ajustar ancho para la nueva división (hasta x = tablaInicioX + 140)
  doc.text(datosFinales.apellidosNombres || "", tablaInicioX + 35, yTexto + 1);

  // Columna derecha: Tipo de examen
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.tipoExamen || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad || "", tablaInicioX + 12, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.edad ? (datosFinales.edad + " AÑOS") : ""), tablaInicioX + 58, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.sexo || "").toUpperCase(), tablaInicioX + 105, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.direccionPaciente || "", tablaInicioX + 25, yTexto + 1);
  yTexto += filaAltura;

  // Puesto de Trabajo, Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.puestoTrabajo || "", tablaInicioX + 30, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.areaTrabajo || "", tablaInicioX + 118, yTexto + 1);
  yTexto += filaAltura;

  // Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.empresa || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contrata || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // === SECCIÓN II: MOTIVO DE EVALUACIÓN ===
  yPos = dibujarHeaderSeccion("2. MOTIVO DE EVALUACIÓN", yPos, filaAltura);

  // Fila creciente para motivo de evaluación (altura inicial 10mm)
  const motivoFormateado = formatearTextoGramatical(datosFinales.motivoEvaluacion || "");
  yPos = dibujarTextoEnFilaCreciente(doc, motivoFormateado, tablaInicioX, tablaAncho, yPos, 5, 4, 8);

  // === SECCIÓN III: OBSERVACIÓN DE CONDUCTAS ===
  yPos = dibujarHeaderSeccion("3. OBSERVACIÓN DE CONDUCTAS", yPos, filaAltura);

  // === TABLA DE OBSERVACIÓN DE CONDUCTAS ===
  const examenMental = datosFinales.examenMental || {};

  const observacionesConductas = [
    {
      titulo: "Presentación:",
      opciones: ["Adecuado", "Inadecuado"],
      valores: [examenMental.presentacion?.adecuado || false, examenMental.presentacion?.inadecuado || false]
    },
    {
      titulo: "Postura:",
      opciones: ["Erguida", "Encorvada"],
      valores: [examenMental.postura?.erguida || false, examenMental.postura?.encorvada || false]
    }
  ];

  // Subcategorías de Postura (Ritmo y Tono)
  const posturas = [
    {
      subtitulo: "Ritmo:",
      opciones: ["lento", "rapido", "fluido"],
      valores: [examenMental.ritmo?.lento || false, examenMental.ritmo?.rapido || false, examenMental.ritmo?.fluido || false]
    },
    {
      subtitulo: "Tono:",
      opciones: ["Bajo", "Moderado", "Alto"],
      valores: [examenMental.tono?.bajo || false, examenMental.tono?.moderado || false, examenMental.tono?.alto || false]
    }
  ];


  // Articulación después de Discurso
  const articulacion = {
    titulo: "Articulación:",
    opciones: ["con dificultad", "sin dificultad"],
    valores: [examenMental.articulacion?.conDificultad || false, examenMental.articulacion?.sinDificultad || false]
  };

  const filaObservacionAltura = 5;
  const anchoTablaCompleta = tablaAncho; // Usar todo el ancho de la tabla

  observacionesConductas.forEach((observacion) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaObservacionAltura);
    doc.line(tablaInicioX + anchoTablaCompleta, yPos, tablaInicioX + anchoTablaCompleta, yPos + filaObservacionAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + anchoTablaCompleta, yPos);
    doc.line(tablaInicioX, yPos + filaObservacionAltura, tablaInicioX + anchoTablaCompleta, yPos + filaObservacionAltura);

    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(observacion.titulo, tablaInicioX + 1, yPos + 3.5);

    // Dibujar opciones con X marcada
    const espacioTitulo = 25;
    const anchoOpcion = (anchoTablaCompleta - espacioTitulo) / observacion.opciones.length;

    observacion.opciones.forEach((opcion, opcionIndex) => {
      const xOpcion = tablaInicioX + espacioTitulo + (opcionIndex * anchoOpcion);

      // Dibujar línea vertical para separar opciones
      doc.line(xOpcion, yPos, xOpcion, yPos + filaObservacionAltura);

      // Dibujar texto de la opción
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(opcion, xOpcion + 1, yPos + 3.5);

      // Crear cajoncito para la X: dibujar línea vertical antes de la X
      const xPosicionX = xOpcion + anchoOpcion - 8; // Posición donde se dibujará la línea
      doc.line(xPosicionX, yPos, xPosicionX, yPos + filaObservacionAltura);

      // Dibujar X centrada en el cajoncito si está seleccionado
      if (observacion.valores[opcionIndex]) {
        const anchoCajoncito = (xOpcion + anchoOpcion) - xPosicionX;
        const centroCajoncito = xPosicionX + (anchoCajoncito / 2);
        doc.setFont("helvetica", "bold").setFontSize(10);
        doc.text("X", centroCajoncito, yPos + 3.5, { align: "center" });
      }
    });

    // Dibujar línea vertical final para cerrar la última columna
    const xFinal = tablaInicioX + espacioTitulo + (observacion.opciones.length * anchoOpcion);
    doc.line(xFinal, yPos, xFinal, yPos + filaObservacionAltura);

    yPos += filaObservacionAltura;
  });

  // === DISCURSO (fila celeste simple) ===
  // Dibujar fila de Discurso (celeste, solo título)
  // Dibujar fondo celeste
  doc.setFillColor(199, 241, 255); // Color celeste claro
  doc.rect(tablaInicioX, yPos, anchoTablaCompleta, filaObservacionAltura, 'F');

  // Dibujar líneas de la fila (sin división vertical interna)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaObservacionAltura);
  doc.line(tablaInicioX + anchoTablaCompleta, yPos, tablaInicioX + anchoTablaCompleta, yPos + filaObservacionAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + anchoTablaCompleta, yPos);
  doc.line(tablaInicioX, yPos + filaObservacionAltura, tablaInicioX + anchoTablaCompleta, yPos + filaObservacionAltura);

  // Dibujar título "Discurso:"
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Discurso:", tablaInicioX + 1, yPos + 3.5);

  yPos += filaObservacionAltura;

  // === SECCIÓN ESPECIAL: POSTURA (Ritmo y Tono) ===
  const espacioTituloPostura = 25;
  posturas.forEach((postura) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaObservacionAltura);
    doc.line(tablaInicioX + anchoTablaCompleta, yPos, tablaInicioX + anchoTablaCompleta, yPos + filaObservacionAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + anchoTablaCompleta, yPos);
    doc.line(tablaInicioX, yPos + filaObservacionAltura, tablaInicioX + anchoTablaCompleta, yPos + filaObservacionAltura);

    // Dibujar subtítulo (Ritmo:, Tono:)
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(postura.subtitulo, tablaInicioX + 1, yPos + 3.5);

    // Dibujar línea vertical después del subtítulo
    doc.line(tablaInicioX + espacioTituloPostura, yPos, tablaInicioX + espacioTituloPostura, yPos + filaObservacionAltura);

    // Dibujar opciones
    const anchoOpcionPostura = (anchoTablaCompleta - espacioTituloPostura) / postura.opciones.length;

    postura.opciones.forEach((opcion, opcionIndex) => {
      const xOpcion = tablaInicioX + espacioTituloPostura + (opcionIndex * anchoOpcionPostura);

      // Dibujar línea vertical para separar opciones
      doc.line(xOpcion, yPos, xOpcion, yPos + filaObservacionAltura);

      // Dibujar texto de la opción
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(opcion, xOpcion + 1, yPos + 3.5);

      // Crear cajoncito para la X: dibujar línea vertical antes de la X
      const xPosicionXPostura = xOpcion + anchoOpcionPostura - 8; // Posición donde se dibujará la línea
      doc.line(xPosicionXPostura, yPos, xPosicionXPostura, yPos + filaObservacionAltura);

      // Dibujar X centrada en el cajoncito si está seleccionado
      if (postura.valores[opcionIndex]) {
        const anchoCajoncitoPostura = (xOpcion + anchoOpcionPostura) - xPosicionXPostura;
        const centroCajoncitoPostura = xPosicionXPostura + (anchoCajoncitoPostura / 2);
        doc.setFont("helvetica", "bold").setFontSize(10);
        doc.text("X", centroCajoncitoPostura, yPos + 3.5, { align: "center" });
      }
    });

    // Dibujar línea vertical final para cerrar la última columna
    const xFinalPostura = tablaInicioX + espacioTituloPostura + (postura.opciones.length * anchoOpcionPostura);
    doc.line(xFinalPostura, yPos, xFinalPostura, yPos + filaObservacionAltura);

    yPos += filaObservacionAltura;
  });

  // === ARTICULACIÓN DESPUÉS DE TONO ===
  // Dibujar fila de Articulación
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaObservacionAltura);
  doc.line(tablaInicioX + anchoTablaCompleta, yPos, tablaInicioX + anchoTablaCompleta, yPos + filaObservacionAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + anchoTablaCompleta, yPos);
  doc.line(tablaInicioX, yPos + filaObservacionAltura, tablaInicioX + anchoTablaCompleta, yPos + filaObservacionAltura);

  // Dibujar título "Articulación:"
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(articulacion.titulo, tablaInicioX + 1, yPos + 3.5);

  // Dibujar opciones
  const espacioTituloArticulacion = 25;
  const anchoOpcionArticulacion = (anchoTablaCompleta - espacioTituloArticulacion) / articulacion.opciones.length;

  articulacion.opciones.forEach((opcion, opcionIndex) => {
    const xOpcion = tablaInicioX + espacioTituloArticulacion + (opcionIndex * anchoOpcionArticulacion);

    // Dibujar línea vertical para separar opciones
    doc.line(xOpcion, yPos, xOpcion, yPos + filaObservacionAltura);

    // Dibujar texto de la opción
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(opcion, xOpcion + 1, yPos + 3.5);

    // Crear cajoncito para la X: dibujar línea vertical antes de la X
    const xPosicionXArticulacion = xOpcion + anchoOpcionArticulacion - 8; // Posición donde se dibujará la línea
    doc.line(xPosicionXArticulacion, yPos, xPosicionXArticulacion, yPos + filaObservacionAltura);

    // Dibujar X centrada en el cajoncito si está seleccionado
    if (articulacion.valores[opcionIndex]) {
      const anchoCajoncitoArticulacion = (xOpcion + anchoOpcionArticulacion) - xPosicionXArticulacion;
      const centroCajoncitoArticulacion = xPosicionXArticulacion + (anchoCajoncitoArticulacion / 2);
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", centroCajoncitoArticulacion, yPos + 3.5, { align: "center" });
    }
  });

  // Dibujar línea vertical final para cerrar la última columna
  const xFinalArticulacion = tablaInicioX + espacioTituloArticulacion + (articulacion.opciones.length * anchoOpcionArticulacion);
  doc.line(xFinalArticulacion, yPos, xFinalArticulacion, yPos + filaObservacionAltura);

  yPos += filaObservacionAltura;

  // === SECCIÓN ESPECIAL: ORIENTACIÓN ===
  const orientaciones = [
    {
      subtitulo: "Tiempo:",
      opciones: ["Orientado", "Desorientado"],
      valores: [examenMental.orientacion?.tiempo?.orientado || false, examenMental.orientacion?.tiempo?.desorientado || false]
    },
    {
      subtitulo: "Espacio:",
      opciones: ["Orientado", "Desorientado"],
      valores: [examenMental.orientacion?.espacio?.orientado || false, examenMental.orientacion?.espacio?.desorientado || false]
    },
    {
      subtitulo: "Persona:",
      opciones: ["Orientado", "Desorientado"],
      valores: [examenMental.orientacion?.persona?.orientado || false, examenMental.orientacion?.persona?.desorientado || false]
    }
  ];

  // Dibujar fila principal de Orientación (celeste, sin división)
  // Dibujar fondo celeste
  doc.setFillColor(199, 241, 255); // Color celeste claro
  doc.rect(tablaInicioX, yPos, anchoTablaCompleta, filaObservacionAltura, 'F');

  // Dibujar líneas de la fila (sin división vertical interna)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaObservacionAltura);
  doc.line(tablaInicioX + anchoTablaCompleta, yPos, tablaInicioX + anchoTablaCompleta, yPos + filaObservacionAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + anchoTablaCompleta, yPos);
  doc.line(tablaInicioX, yPos + filaObservacionAltura, tablaInicioX + anchoTablaCompleta, yPos + filaObservacionAltura);

  // Dibujar título "Orientación:"
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Orientación:", tablaInicioX + 1, yPos + 3.5);

  yPos += filaObservacionAltura;

  // Dibujar subcategorías de orientación
  const espacioTituloOrientacion = 25;
  orientaciones.forEach((orientacion) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaObservacionAltura);
    doc.line(tablaInicioX + anchoTablaCompleta, yPos, tablaInicioX + anchoTablaCompleta, yPos + filaObservacionAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + anchoTablaCompleta, yPos);
    doc.line(tablaInicioX, yPos + filaObservacionAltura, tablaInicioX + anchoTablaCompleta, yPos + filaObservacionAltura);

    // Dibujar subtítulo (Tiempo:, Espacio:, Persona:)
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(orientacion.subtitulo, tablaInicioX + 1, yPos + 3.5);

    // Dibujar línea vertical después del subtítulo
    doc.line(tablaInicioX + espacioTituloOrientacion, yPos, tablaInicioX + espacioTituloOrientacion, yPos + filaObservacionAltura);

    // Dibujar opciones
    const anchoOpcionOrientacion = (anchoTablaCompleta - espacioTituloOrientacion) / orientacion.opciones.length;

    orientacion.opciones.forEach((opcion, opcionIndex) => {
      const xOpcion = tablaInicioX + espacioTituloOrientacion + (opcionIndex * anchoOpcionOrientacion);

      // Dibujar línea vertical para separar opciones
      doc.line(xOpcion, yPos, xOpcion, yPos + filaObservacionAltura);

      // Dibujar texto de la opción
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(opcion, xOpcion + 1, yPos + 3.5);

      // Crear cajoncito para la X: dibujar línea vertical antes de la X
      const xPosicionXOrientacion = xOpcion + anchoOpcionOrientacion - 8; // Posición donde se dibujará la línea
      doc.line(xPosicionXOrientacion, yPos, xPosicionXOrientacion, yPos + filaObservacionAltura);

      // Dibujar X centrada en el cajoncito si está seleccionado
      if (orientacion.valores[opcionIndex]) {
        const anchoCajoncitoOrientacion = (xOpcion + anchoOpcionOrientacion) - xPosicionXOrientacion;
        const centroCajoncitoOrientacion = xPosicionXOrientacion + (anchoCajoncitoOrientacion / 2);
        doc.setFont("helvetica", "bold").setFontSize(10);
        doc.text("X", centroCajoncitoOrientacion, yPos + 3.5, { align: "center" });
      }
    });

    // Dibujar línea vertical final para cerrar la última columna
    const xFinalOrientacion = tablaInicioX + espacioTituloOrientacion + (orientacion.opciones.length * anchoOpcionOrientacion);
    doc.line(xFinalOrientacion, yPos, xFinalOrientacion, yPos + filaObservacionAltura);

    yPos += filaObservacionAltura;
  });

  // === SECCIÓN IV: RESULTADOS DE EVALUACIÓN ===
  yPos = dibujarHeaderSeccion("4. RESULTADOS DE EVALUACIÓN", yPos, filaAltura);

  // === FILAS DE RESULTADOS ===
  const resultadosEvaluacion = [
    {
      titulo: "Nivel Intelectual:",
      valor: datosFinales.nivelIntelectual || ""
    },
    {
      titulo: "Coordinación Visomotriz:",
      valor: datosFinales.coordinacionVisomotriz || ""
    },
    {
      titulo: "Nivel de Memoria:",
      valor: datosFinales.nivelMemoria || ""
    },
    {
      titulo: "Personalidad:",
      valor: datosFinales.personalidad || ""
    },
    {
      titulo: "Afectividad:",
      valor: datosFinales.afectividad || ""
    }
  ];

  // Filtrar "Nivel Intelectual" si esOhla es true
  const resultadosFiltrados = datosFinales.esOhla
    ? resultadosEvaluacion.filter(r => r.titulo !== "Nivel Intelectual:")
    : resultadosEvaluacion;

  resultadosFiltrados.forEach((resultado) => {
    // Calcular altura dinámica para el valor del resultado
    const valorFormateado = formatearTextoGramatical(resultado.valor);
    const espacioTitulo = 60; // Espacio para el título
    const anchoValor = tablaAncho - espacioTitulo - 4; // Ancho disponible para el valor

    const alturaValor = calcularAlturaTextoCreciente(doc, valorFormateado, anchoValor, 8);
    const alturaFilaNecesaria = valorFormateado ? Math.max(5, alturaValor + 2) : filaAltura;

    // Dibujar líneas de la fila con altura dinámica
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaNecesaria);
    doc.line(tablaInicioX + espacioTitulo, yPos, tablaInicioX + espacioTitulo, yPos + alturaFilaNecesaria);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaNecesaria);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaNecesaria, tablaInicioX + tablaAncho, yPos + alturaFilaNecesaria);

    // Dibujar título
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(resultado.titulo, tablaInicioX + 2, yPos + 3.5);

    // Dibujar valor con texto con salto de línea
    doc.setFont("helvetica", "normal").setFontSize(8);
    if (valorFormateado) {
      dibujarTextoConSaltoLinea(valorFormateado, tablaInicioX + espacioTitulo + 2, yPos + 3.5, anchoValor);
    }

    yPos += alturaFilaNecesaria;
  });

  // === SECCIÓN V: CONCLUSIONES ===
  yPos = dibujarHeaderSeccion("5. CONCLUSIONES", yPos, filaAltura);

  // === SUBSECCIÓN: ÁREA COGNITIVA ===
  // Solo mostrar si NO es OHLA
  if (!datosFinales.esOhla) {
    // Header celeste "Área Cognitiva"
    yPos = dibujarSubHeaderCeleste("Área Cognitiva:", yPos, filaAltura);

    // Fila creciente para área cognitiva (altura inicial 10mm)
    const areaCognitivaFormateada = formatearTextoGramatical(datosFinales.areaCognitiva || "");
    yPos = dibujarTextoEnFilaCreciente(doc, areaCognitivaFormateada, tablaInicioX, tablaAncho, yPos, 7, 4, 8);
  }

  // === SUBSECCIÓN: ÁREA EMOCIONAL ===
  // Si es OHLA, no mostrar el header pero sí el contenido
  if (!datosFinales.esOhla) {
    // Header celeste "Área Emocional"
    yPos = dibujarSubHeaderCeleste("Área Emocional:", yPos, filaAltura);
  }

  // Fila creciente para área emocional (altura inicial 10mm) - siempre se muestra
  const areaEmocionalFormateada = formatearTextoGramatical(datosFinales.areaEmocional || "");
  yPos = dibujarTextoEnFilaCreciente(doc, areaEmocionalFormateada, tablaInicioX, tablaAncho, yPos, 7, 4, 8);

  // === SECCIÓN VI: RECOMENDACIONES ===
  yPos = dibujarHeaderSeccion("6. RECOMENDACIONES", yPos, filaAltura);

  // Fila creciente para recomendaciones (altura inicial 10mm)
  const recomendacionesFormateadas = formatearTextoGramatical(datosFinales.recomendaciones || "");
  yPos = dibujarTextoEnFilaCreciente(doc, recomendacionesFormateadas, tablaInicioX, tablaAncho, yPos, 7, 4, 8);

  // === SECCIÓN DE EVALUACIÓN FINAL ===
  // Fila: CUMPLE CON EL PERFIL | X | NO CUMPLE CON EL PERFIL | X |
  const columna1Ancho = 80; // CUMPLE CON EL PERFIL
  const columna2Ancho = 15; // X
  const columna3Ancho = 80; // NO CUMPLE CON EL PERFIL
  const columna4Ancho = 15; // X

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + columna1Ancho, yPos, tablaInicioX + columna1Ancho, yPos + filaAltura); // División 1
  doc.line(tablaInicioX + columna1Ancho + columna2Ancho, yPos, tablaInicioX + columna1Ancho + columna2Ancho, yPos + filaAltura); // División 2
  doc.line(tablaInicioX + columna1Ancho + columna2Ancho + columna3Ancho, yPos, tablaInicioX + columna1Ancho + columna2Ancho + columna3Ancho, yPos + filaAltura); // División 3
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido de la fila de evaluación final
  // CUMPLE CON EL PERFIL
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("CUMPLE CON EL PERFIL", tablaInicioX + 2, yPos + 3.5);

  // Marcar X en CUMPLE CON EL PERFIL si cumple
  if (datosFinales.cumplePerfil === true) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + columna1Ancho + (columna2Ancho / 2), yPos + 3.5, { align: "center" });
  }

  // NO CUMPLE CON EL PERFIL
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("NO CUMPLE CON EL PERFIL", tablaInicioX + columna1Ancho + columna2Ancho + 2, yPos + 3.5);

  // Marcar X en NO CUMPLE CON EL PERFIL si no cumple
  if (datosFinales.cumplePerfil === false) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + columna1Ancho + columna2Ancho + columna3Ancho + (columna4Ancho / 2), yPos + 3.5, { align: "center" });
  }

  yPos += filaAltura;

  // === SECCIÓN DE FIRMAS ===
  const yFirmas = yPos; // Continuar directamente desde la sección anterior
  const alturaSeccionFirmas = 30; // Altura para la sección de firmas

  // Dibujar las líneas de la sección de firmas (una sola columna centrada)
  doc.line(tablaInicioX, yFirmas, tablaInicioX, yFirmas + alturaSeccionFirmas); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea derecha
  doc.line(tablaInicioX, yFirmas, tablaInicioX + tablaAncho, yFirmas); // Línea superior
  doc.line(tablaInicioX, yFirmas + alturaSeccionFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea inferior

  // === FIRMA DEL MÉDICO CENTRADA ===
  const firmaMedicoY = yFirmas + 3;

  // Función para obtener URL de digitalización por nombre
  const getDigitalizacionUrl = (digitalizaciones, nombre) => {
    if (!digitalizaciones || !Array.isArray(digitalizaciones)) return null;
    const item = digitalizaciones.find(d => d.nombreDigitalizacion === nombre);
    return item ? item.url : null;
  };

  // Calcular centro de la fila para centrar la firma
  const centroFilaX = tablaInicioX + (tablaAncho / 2);

  // Agregar firma y sello médico centrada
  let firmaMedicoUrl = getDigitalizacionUrl(data.digitalizacion, "SELLOFIRMA");

  if (firmaMedicoUrl) {
    try {
      const imgWidth = 45;
      const imgHeight = 20;
      const x = centroFilaX - (imgWidth / 2); // Centrar horizontalmente
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Sello y Firma del Psicólogo", centroFilaX, yFirmas + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroFilaX, yFirmas + 28.5, { align: "center" });

  yPos += alturaSeccionFirmas;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 13.5 });

  // === Imprimir ===
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

