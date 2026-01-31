import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils";
import { convertirGenero, getSign } from "../../../utils/helpers";
import drawColorBox from '../../components/ColorBox.jsx';
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';

export default async function Informe_Riesgos_Psicosociales_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente || "") + " " + (data.nombresPaciente || "")).trim(),
    fechaExamen: formatearFechaCorta(data.fecha || data.fechaExamen || ""),
    tipoExamen: String(data.nombreExamen || ""),
    sexo: convertirGenero(data.sexoPaciente || ""),
    documentoIdentidad: String(data.dniPaciente || ""),
    edad: String(data.edadPaciente || ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente || data.fechaNacimiento || ""),
    areaTrabajo: data.areaPaciente || "",
    puestoTrabajo: data.cargoPaciente || "",
    empresa: data.empresa || "",
    contrata: data.contrata || "",
    gradoInstruccion: data.gradoInstruccion || data.gradoDeInstruccion || "",
    // Datos de color
    color: data.color,
    codigoColor: data.codigoColor,
    textoColor: data.textoColor,
    // Datos adicionales para header
    numeroFicha: String(data.norden || ""),
    sede: data.sede || data.nombreSede || "",
    direccionPaciente: String(data.direccionPaciente || ""),
    // Datos para Riesgos Psicosociales
    exigenciasPsicologicasFavorable: data.exigenciasPsicologicasFavorable || false,
    exigenciasPsicologicasPromedio: data.exigenciasPsicologicasPromedio || false,
    exigenciasPsicologicasDesfavorable: data.exigenciasPsicologicasDesfavorable || false,
    trabajoActivoFavorable: data.trabajoActivoFavorable || false,
    trabajoActivoPromedio: data.trabajoActivoPromedio || false,
    trabajoActivoDesfavorable: data.trabajoActivoDesfavorable || false,
    apoyoSocialFavorable: data.apoyoSocialFavorable || false,
    apoyoSocialPromedio: data.apoyoSocialPromedio || false,
    apoyoSocialDesfavorable: data.apoyoSocialDesfavorable || false,
    compensacionesFavorable: data.compensacionesFavorable || false,
    compensacionesPromedio: data.compensacionesPromedio || false,
    compensacionesDesfavorable: data.compensacionesDesfavorable || false,
    doblePresenciaFavorable: data.doblePresenciaFavorable || false,
    doblePresenciaPromedio: data.doblePresenciaPromedio || false,
    doblePresenciaDesfavorable: data.doblePresenciaDesfavorable || false,
    // Datos para Análisis, Recomendaciones y Conclusiones
    analisisResultados: data.analisisResultados || data.analisis || "",
    recomendaciones: data.recomendaciones || "",
    cumplePerfil: data.apto === true || data.cumplePerfil === true, // true si cumple, false si no cumple
  };

  // Usar solo datos reales
  const datosFinales = datosReales;

  // Header reutilizable
  const drawHeader = async (pageNumber) => {
    // Logo y membrete
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.text("INFORME DE RIESGOS PSICOSOCIALES", pageW / 2, 32, { align: "center" });
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

  // === FUNCIONES AUXILIARES ===
  // Función auxiliar para dividir texto respetando \n y luego hacer wrap
  const dividirTextoConSaltosLinea = (texto, anchoMaximo) => {
    if (!texto) return [];
    
    const textoStr = String(texto);
    const parrafos = textoStr.split('\n');
    const todasLasLineas = [];
    
    parrafos.forEach((parrafo) => {
      if (parrafo.trim() === '') {
        // Si el párrafo está vacío, agregar una línea vacía
        todasLasLineas.push('');
      } else {
        // Dividir cada párrafo por ancho máximo
        const lineasParrafo = doc.splitTextToSize(parrafo, anchoMaximo);
        todasLasLineas.push(...lineasParrafo);
      }
    });
    
    return todasLasLineas;
  };

  // Función para texto con salto de línea (respeta \n y hace wrap de palabras)
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    // Validar que el texto no sea undefined, null o vacío
    if (!texto || texto === null || texto === undefined) {
      return y;
    }

    const fontSize = doc.internal.getFontSize();
    const textoStr = String(texto);
    
    // Primero dividir por saltos de línea explícitos (\n)
    const parrafos = textoStr.split('\n');
    let yPos = y;

    parrafos.forEach((parrafo, parrafoIndex) => {
      // Si no es el primer párrafo, agregar espacio extra entre párrafos
      if (parrafoIndex > 0 && parrafo.trim() !== '') {
        yPos += fontSize * 0.35; // Espacio entre párrafos
      }

      // Si el párrafo está vacío, solo agregar un pequeño espacio
      if (parrafo.trim() === '') {
        yPos += fontSize * 0.35;
        return;
      }

      // Para cada párrafo, hacer wrap de palabras
      const palabras = parrafo.split(' ');
      let lineaActual = '';

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
            // Si la palabra sola es más larga que el ancho máximo, dividirla
            const lineasPalabra = doc.splitTextToSize(palabra, anchoMaximo);
            lineasPalabra.forEach((linea, idx) => {
              if (idx > 0) {
                yPos += fontSize * 0.35;
              }
              doc.text(linea, x, yPos);
            });
            yPos += fontSize * 0.35;
            lineaActual = '';
          }
        }
      });

      if (lineaActual) {
        doc.text(lineaActual, x, yPos);
        yPos += fontSize * 0.35;
      }
    });

    return yPos; // Devuelve la nueva posición final
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

  // Función para dibujar X en las columnas (centrada en X e Y)
  const dibujarX = (x, y, alturaFila) => {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(0, 0, 0); // Negro para la X
    // Centrar en X e Y dentro de la celda
    const centroY = y + alturaFila / 2 + 1.2;
    doc.text("X", x, centroY, { align: "center" });
  };

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 35;
  const filaAltura = 4.5;

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

  // Fila: Grado de Instrucción (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 35 + filaAltura + 2.5; // Ajustar para el header

  // Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Ajustar ancho para la nueva división (hasta x = tablaInicioX + 140)
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres || "", tablaInicioX + 35, yTexto + 1, 95);

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
  doc.text(datosFinales.sexo || "", tablaInicioX + 105, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.direccionPaciente || "", tablaInicioX + 25, yTexto + 1, 160);
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
  dibujarTextoConSaltoLinea(datosFinales.empresa || "", tablaInicioX + 24, yTexto + 1, 160);
  yTexto += filaAltura;

  // Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contrata || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Grado de Instrucción
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Grado de Instrucción:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.gradoInstruccion || "", tablaInicioX + 40, yTexto + 1);
  yTexto += filaAltura;

  // === SECCIÓN 2: RIESGOS PSICOSOCIALES ===
  // yPos ya está en la posición correcta después de la última fila de datos personales
  // No hay espacio entre tablas, el header de la siguiente sección comienza inmediatamente

  // Header de la sección
  yPos = dibujarHeaderSeccion("2. RIESGOS PSICOSOCIALES", yPos, filaAltura);

  // Definir anchos de columnas
  const colIndicadores = 100; // Columna de indicadores
  const anchoColumnaEvaluacion = (tablaAncho - colIndicadores) / 3; // 3 columnas: FAVORABLE, PROMEDIO, DESFAVORABLE
  const posFavorable = tablaInicioX + colIndicadores;
  const posPromedio = posFavorable + anchoColumnaEvaluacion;
  const posDesfavorable = posPromedio + anchoColumnaEvaluacion;

  // Fila celeste: Header de columnas
  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  // Dibujar líneas del header
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(posFavorable, yPos, posFavorable, yPos + filaAltura);
  doc.line(posPromedio, yPos, posPromedio, yPos + filaAltura);
  doc.line(posDesfavorable, yPos, posDesfavorable, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Texto de las columnas del header (centrados)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("INDICADORES", tablaInicioX + colIndicadores / 2, yPos + 3.5, { align: "center" });
  doc.text("FAVORABLE", posFavorable + anchoColumnaEvaluacion / 2, yPos + 3.5, { align: "center" });
  doc.text("PROMEDIO", posPromedio + anchoColumnaEvaluacion / 2, yPos + 3.5, { align: "center" });
  doc.text("DESFAVORABLE", posDesfavorable + anchoColumnaEvaluacion / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // Lista de indicadores
  const indicadores = [
    {
      nombre: "Exigencias psicológicas",
      favorable: datosFinales.exigenciasPsicologicasFavorable,
      promedio: datosFinales.exigenciasPsicologicasPromedio,
      desfavorable: datosFinales.exigenciasPsicologicasDesfavorable
    },
    {
      nombre: "Trabajo activo y posibilidades de desarrollo",
      favorable: datosFinales.trabajoActivoFavorable,
      promedio: datosFinales.trabajoActivoPromedio,
      desfavorable: datosFinales.trabajoActivoDesfavorable
    },
    {
      nombre: "Apoyo social",
      favorable: datosFinales.apoyoSocialFavorable,
      promedio: datosFinales.apoyoSocialPromedio,
      desfavorable: datosFinales.apoyoSocialDesfavorable
    },
    {
      nombre: "Compensaciones",
      favorable: datosFinales.compensacionesFavorable,
      promedio: datosFinales.compensacionesPromedio,
      desfavorable: datosFinales.compensacionesDesfavorable
    },
    {
      nombre: "Doble presencia",
      favorable: datosFinales.doblePresenciaFavorable,
      promedio: datosFinales.doblePresenciaPromedio,
      desfavorable: datosFinales.doblePresenciaDesfavorable
    }
  ];

  // Dibujar filas de indicadores
  indicadores.forEach((indicador, index) => {
    const numero = index + 1;

    // Dibujar líneas de la fila
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + 8, yPos, tablaInicioX + 8, yPos + filaAltura); // División número/descripción
    doc.line(posFavorable, yPos, posFavorable, yPos + filaAltura);
    doc.line(posPromedio, yPos, posPromedio, yPos + filaAltura);
    doc.line(posDesfavorable, yPos, posDesfavorable, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);
    // Número
    doc.text(String(numero), tablaInicioX + 2, yPos + 3.5);
    // Descripción del indicador
    doc.text(indicador.nombre, tablaInicioX + 10, yPos + 3.5);

    // Marcar X en la columna correspondiente (centrada en X e Y)
    if (indicador.favorable) {
      dibujarX(posFavorable + anchoColumnaEvaluacion / 2, yPos, filaAltura);
    } else if (indicador.promedio) {
      dibujarX(posPromedio + anchoColumnaEvaluacion / 2, yPos, filaAltura);
    } else if (indicador.desfavorable) {
      dibujarX(posDesfavorable + anchoColumnaEvaluacion / 2, yPos, filaAltura);
    }

    yPos += filaAltura;
  });

  // === SECCIÓN 3: ANÁLISIS Y RESULTADOS ===
  // Verificar si necesitamos nueva página
  const espacioMinimo = 15;
  if (yPos + espacioMinimo > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
  }

  // Fila gris: ANÁLISIS Y RESULTADOS
  yPos = dibujarHeaderSeccion("3. ANÁLISIS Y RESULTADOS", yPos, filaAltura);

  // Fila dinámica para contenido de análisis
  const textoAnalisis = (datosFinales.analisisResultados || "-").toUpperCase();

  // Dibujar borde superior y laterales de la fila (se redibujará con altura final)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + 35); // Altura mínima 35mm
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + 35); // Altura mínima 35mm
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

  // Dibujar texto con salto de línea
  doc.setFont("helvetica", "normal").setFontSize(7);
  let yFinalAnalisis = dibujarTextoConSaltoLinea(textoAnalisis, tablaInicioX + 2, yPos + 3, tablaAncho - 4);

  // Verificar si necesitamos nueva página durante el dibujado
  const alturaMaximaAnalisis = pageHeight - yPos - 25;
  let alturaNecesariaAnalisis = Math.max(35, yFinalAnalisis - yPos + 2);
  
  // Si el contenido no cabe, dividirlo en múltiples páginas
  if (alturaNecesariaAnalisis > alturaMaximaAnalisis) {
    // Dibujar líneas de la primera página con la altura máxima disponible
    const alturaPrimeraPagina = alturaMaximaAnalisis;
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaPrimeraPagina);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaPrimeraPagina);
    doc.line(tablaInicioX, yPos + alturaPrimeraPagina, tablaInicioX + tablaAncho, yPos + alturaPrimeraPagina);
    
    // Nueva página para el resto del contenido
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
    
    // Dibujar líneas de la nueva página
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    
    // Dibujar el texto restante usando dividirTextoConSaltosLinea para respetar \n
    const lineasTexto = dividirTextoConSaltosLinea(textoAnalisis, tablaAncho - 4);
    doc.setFont("helvetica", "normal").setFontSize(7);
    let yTextoActual = yPos + 3;
    
    // Calcular cuántas líneas ya se dibujaron en la primera página
    const lineasEnPrimeraPagina = Math.floor((alturaPrimeraPagina - 3) / 3.5);
    const lineasRestantes = lineasTexto.slice(lineasEnPrimeraPagina);
    
    for (let idx = 0; idx < lineasRestantes.length; idx++) {
      if (yTextoActual + 3.5 > pageHeight - 20) {
        doc.addPage();
        numeroPagina++;
        yPos = 45;
        await drawHeader(numeroPagina);
        yTextoActual = yPos + 3;
        // Redibujar líneas en la nueva página
        doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
        doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
        doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
      }
      // Si la línea está vacía (salto de párrafo), agregar espacio extra
      if (lineasRestantes[idx].trim() === '') {
        yTextoActual += 3.5; // Espacio extra para párrafo
      } else {
        doc.text(lineasRestantes[idx], tablaInicioX + 2, yTextoActual);
        yTextoActual += 3.5;
      }
    }
    
    // Calcular altura final
    alturaNecesariaAnalisis = Math.max(35, yTextoActual - yPos + 2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaNecesariaAnalisis);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaNecesariaAnalisis);
    doc.line(tablaInicioX, yPos + alturaNecesariaAnalisis, tablaInicioX + tablaAncho, yPos + alturaNecesariaAnalisis);
  } else {
    // Si cabe en una página, dibujar las líneas finales
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaNecesariaAnalisis);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaNecesariaAnalisis);
    doc.line(tablaInicioX, yPos + alturaNecesariaAnalisis, tablaInicioX + tablaAncho, yPos + alturaNecesariaAnalisis);
  }

  yPos += alturaNecesariaAnalisis;

  // === SECCIÓN 4: RECOMENDACIONES ===
  // Verificar si necesitamos nueva página
  if (yPos + espacioMinimo > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
  }

  // Fila gris: RECOMENDACIONES
  yPos = dibujarHeaderSeccion("4. RECOMENDACIONES:", yPos, filaAltura);

  // Fila dinámica para contenido de recomendaciones
  const textoRecomendaciones = (datosFinales.recomendaciones || "-").toUpperCase();

  // Dibujar borde superior y laterales de la fila (se redibujará con altura final)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + 35); // Altura mínima 35mm
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + 35); // Altura mínima 35mm
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

  // Dibujar texto con salto de línea
  doc.setFont("helvetica", "normal").setFontSize(7);
  let yFinalRecomendaciones = dibujarTextoConSaltoLinea(textoRecomendaciones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);

  // Verificar si necesitamos nueva página durante el dibujado
  const alturaMaximaRec = pageHeight - yPos - 25;
  let alturaNecesariaRecomendaciones = Math.max(35, yFinalRecomendaciones - yPos + 2);
  
  // Si el contenido no cabe, dividirlo en múltiples páginas
  if (alturaNecesariaRecomendaciones > alturaMaximaRec) {
    // Dibujar líneas de la primera página con la altura máxima disponible
    const alturaPrimeraPagina = alturaMaximaRec;
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaPrimeraPagina);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaPrimeraPagina);
    doc.line(tablaInicioX, yPos + alturaPrimeraPagina, tablaInicioX + tablaAncho, yPos + alturaPrimeraPagina);
    
    // Nueva página para el resto del contenido
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
    
    // Dibujar líneas de la nueva página
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    
    // Dibujar el texto restante usando dividirTextoConSaltosLinea para respetar \n
    const lineasTexto = dividirTextoConSaltosLinea(textoRecomendaciones, tablaAncho - 4);
    doc.setFont("helvetica", "normal").setFontSize(7);
    let yTextoActual = yPos + 3;
    
    // Calcular cuántas líneas ya se dibujaron en la primera página
    const lineasEnPrimeraPagina = Math.floor((alturaPrimeraPagina - 3) / 3.5);
    const lineasRestantes = lineasTexto.slice(lineasEnPrimeraPagina);
    
    for (let idx = 0; idx < lineasRestantes.length; idx++) {
      if (yTextoActual + 3.5 > pageHeight - 20) {
        doc.addPage();
        numeroPagina++;
        yPos = 45;
        await drawHeader(numeroPagina);
        yTextoActual = yPos + 3;
        // Redibujar líneas en la nueva página
        doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
        doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
        doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
      }
      // Si la línea está vacía (salto de párrafo), agregar espacio extra
      if (lineasRestantes[idx].trim() === '') {
        yTextoActual += 3.5; // Espacio extra para párrafo
      } else {
        doc.text(lineasRestantes[idx], tablaInicioX + 2, yTextoActual);
        yTextoActual += 3.5;
      }
    }
    
    // Calcular altura final
    alturaNecesariaRecomendaciones = Math.max(35, yTextoActual - yPos + 2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaNecesariaRecomendaciones);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaNecesariaRecomendaciones);
    doc.line(tablaInicioX, yPos + alturaNecesariaRecomendaciones, tablaInicioX + tablaAncho, yPos + alturaNecesariaRecomendaciones);
  } else {
    // Si cabe en una página, dibujar las líneas finales
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaNecesariaRecomendaciones);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaNecesariaRecomendaciones);
    doc.line(tablaInicioX, yPos + alturaNecesariaRecomendaciones, tablaInicioX + tablaAncho, yPos + alturaNecesariaRecomendaciones);
  }

  yPos += alturaNecesariaRecomendaciones;

  // === SECCIÓN 5: CONCLUSIÓN (CUMPLE/NO CUMPLE CON EL PERFIL) ===
  // Verificar si necesitamos nueva página antes de la conclusión
  if (yPos + filaAltura + 5 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
  }

  // Fila con dos columnas iguales
  const anchoColumna = tablaAncho / 2;

  // Dibujar bordes de la sección
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Línea vertical central
  doc.line(tablaInicioX + anchoColumna, yPos, tablaInicioX + anchoColumna, yPos + filaAltura);
  // Bordes externos
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // === COLUMNA IZQUIERDA: CUMPLE CON EL PERFIL ===
  // División vertical dentro de la columna izquierda (separando texto de mini celda)
  const miniCeldaSize = 6;
  const divisionCumpleX = tablaInicioX + anchoColumna - miniCeldaSize;
  doc.line(divisionCumpleX, yPos, divisionCumpleX, yPos + filaAltura);

  // Texto "CUMPLE CON EL PERFIL"
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CUMPLE CON EL PERFIL", tablaInicioX + 2, yPos + 3.5);

  // Mini celda integrada en la fila (a la derecha, antes de la línea central)
  const miniCeldaXCumple = divisionCumpleX;
  const miniCeldaYCumple = yPos;

  // Marcar con X si cumplePerfil es true (centrada en X e Y)
  if (datosFinales.cumplePerfil === true) {
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0); // Negro para la X
    const centroXCumple = miniCeldaXCumple + miniCeldaSize / 2;
    const centroYCumple = miniCeldaYCumple + filaAltura / 2 + 1.2;
    doc.text("X", centroXCumple, centroYCumple, { align: "center" });
  }

  // === COLUMNA DERECHA: NO CUMPLE CON EL PERFIL ===
  // División vertical dentro de la columna derecha (separando texto de mini celda)
  const divisionNoCumpleX = tablaInicioX + tablaAncho - miniCeldaSize;
  doc.line(divisionNoCumpleX, yPos, divisionNoCumpleX, yPos + filaAltura);

  // Texto "NO CUMPLE CON EL PERFIL"
  const xTextoNoCumple = tablaInicioX + anchoColumna + 2;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("NO CUMPLE CON EL PERFIL", xTextoNoCumple, yPos + 3.5);

  // Mini celda integrada en la fila (a la derecha)
  const miniCeldaXNoCumple = divisionNoCumpleX;
  const miniCeldaYNoCumple = yPos;

  // Marcar con X si cumplePerfil es false (centrada en X e Y)
  if (datosFinales.cumplePerfil === false) {
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0); // Negro para la X
    const centroXNoCumple = miniCeldaXNoCumple + miniCeldaSize / 2;
    const centroYNoCumple = miniCeldaYNoCumple + filaAltura / 2 + 1.2;
    doc.text("X", centroXNoCumple, centroYNoCumple, { align: "center" });
  }

  yPos += filaAltura;

  // === SECCIÓN DE FIRMA Y SELLO DEL MÉDICO ===
  // Verificar si necesitamos nueva página antes de la firma
  if (yPos + 30 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
  }

  const alturaSeccionFirma = 30; // Altura para la sección de firma
  const yFirmas = yPos;

  // Dibujar líneas de la sección de firma (bordes)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yFirmas, tablaInicioX, yFirmas + alturaSeccionFirma); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirma); // Línea derecha
  doc.line(tablaInicioX, yFirmas, tablaInicioX + tablaAncho, yFirmas); // Línea superior
  doc.line(tablaInicioX, yFirmas + alturaSeccionFirma, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirma); // Línea inferior

  // === SELLO Y FIRMA DEL MÉDICO (CENTRADO) ===
  const firmaMedicoY = yFirmas + 3;
  const centroX = tablaInicioX + tablaAncho / 2; // Centro de la página

  // Agregar firma y sello médico
  let firmaMedicoUrl = getSign(data, "SELLOFIRMA");
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 45;
      const imgHeight = 20;
      const x = centroX - (imgWidth / 2); // Centrar horizontalmente
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Sello y Firma del Médico", centroX, yFirmas + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroX, yFirmas + 28.5, { align: "center" });

  yPos += alturaSeccionFirma;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 12, fontSize: 7 });

  // === Imprimir ===
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
