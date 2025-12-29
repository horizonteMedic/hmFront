import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import { convertirGenero } from "../../../utils/helpers.js";
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from '../../../utils/dibujarFirmas.js';

export default async function InformePsicologicoAdecoEstres_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Normalizador único de datos de entrada
  function buildDatosFinales(raw) {
    return {
      apellidosNombres: String((((raw?.apellidosPaciente ?? '') + ' ' + (raw?.nombresPaciente ?? '')).trim())),
      nombreExamen: String(raw?.nombreExamen ?? ''),
      tipoExamen: String(raw?.tipoExamen ?? ''),
      fechaExamen: formatearFechaCorta(raw?.fechaExamen ?? ''),
      sexo: convertirGenero(raw?.sexoPaciente ?? ''),
      documentoIdentidad: String(raw?.dniPaciente ?? ''),
      edad: String(raw?.edadPaciente ?? ''),
      fechaNacimiento: formatearFechaCorta(raw?.fechaNacimientoPaciente ?? ''),
      domicilio: String(raw?.direccionPaciente ?? ''),
      areaTrabajo: String(raw?.areaPaciente ?? ''),
      puestoTrabajo: String(raw?.cargoPaciente ?? ''),
      empresa: String(raw?.empresa ?? ''),
      contrata: String(raw?.contrata ?? ''),
      sede: String(raw?.nombreSede ?? raw?.sede ?? ''),
      numeroFicha: String(raw?.norden ?? ""),
      color: Number(raw?.color ?? 0),
      codigoColor: String(raw?.codigoColor ?? ''),
      textoColor: String(raw?.textoColor ?? ''),
      apto: (typeof raw?.apto === 'boolean') ? raw.apto : false,
      noApto: (typeof raw?.noApto === 'boolean') ? raw.noApto : false,
      // Resultados de pruebas
      resultados: [
        { numero: '1', prueba: 'Escala Sintomática de Estrés', resultado: String(raw?.escalaSintomatica ?? '') },
        { numero: '2', prueba: 'Somnolencia', resultado: String(raw?.somnolencia ?? '') },
        { numero: '3', prueba: 'Test de Fatiga', resultado: String(raw?.testFatiga ?? '') }
      ],
      // Análisis FODA
      fortalezasOportunidades: String(raw?.fortalezasOportunidades ?? ''),
      debilidadesAmenazas: String(raw?.amenazasDebilidades ?? ''),
      // Observaciones y recomendaciones
      observaciones: String(raw?.observaciones ?? ''),
      recomendaciones: String(raw?.recomendacion ?? ''),
      // Conclusiones
      conclusiones: String(raw?.conclusiones ?? '')
    };
  }

  const datosFinales = buildDatosFinales(data);

  // Header reutilizable
  const drawHeader = async (pageNumber) => {
    // Logo y membrete
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Títulos
    doc.setFont("helvetica", "bold").setFontSize(13);
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
  // Función única para obtener dimensiones de la tabla
  const getTablaDimensiones = () => ({
    tablaInicioX: 5,
    tablaAncho: 200
  });

  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    if (!texto) return y;

    const lineas = doc.splitTextToSize(texto, anchoMaximo);
    const interlineado = 3.5;

    lineas.forEach((linea, index) => {
      doc.text(linea, x, y + (index * interlineado));
    });

    return y + (lineas.length * interlineado);
  };

  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    const { tablaInicioX, tablaAncho } = getTablaDimensiones();

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

  // === PÁGINA 1 ===
  await drawHeader(numeroPagina);

  // === SECCIÓN 1: DATOS DE FILIACIÓN ===
  const { tablaInicioX, tablaAncho } = getTablaDimensiones();
  let yPos = 40;
  const filaAltura = 5;

  // Header de datos de filiación
  yPos = dibujarHeaderSeccion("I. DATOS DE FILIACIÓN", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres | T. Examen (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura); // División para T. Examen
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

  // Cuarta fila: Área de Trabajo (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Puesto de Trabajo (completa)
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

  // Primera fila: Apellidos y Nombres | T. Examen
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 1.5, 90); // Ajustar ancho para la división

  // Columna derecha: T. Examen
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.tipoExamen || "", tablaInicioX + 155, yTexto + 1.5);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.edad + " AÑOS", tablaInicioX + 58, yTexto + 1.5);

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

  // Cuarta fila: Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo, tablaInicioX + 30, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Quinta fila: Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo, tablaInicioX + 35, yTexto + 1.5, tablaAncho - 35);
  yTexto += filaAltura;

  // Sexta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 25);
  yTexto += filaAltura;

  // Séptima fila: Contratista
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
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido de la fila de headers
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("INTELIGENCIA", tablaInicioX + tablaAncho / 4, yPos + 3.5, { align: "center" });
  doc.text("RESULTADO", tablaInicioX + (tablaAncho / 2) + (tablaAncho / 4), yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // Fila con 3 divisiones: | 1 | Escala Sintomática de Estrés | BAJO |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 20, yPos, tablaInicioX + 20, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Renderizar resultados dinámicamente
  datosFinales.resultados.forEach((resultado, index) => {
    if (index > 0) {
      // Dibujar líneas de la fila
      doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
      doc.line(tablaInicioX + 20, yPos, tablaInicioX + 20, yPos + filaAltura);
      doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
      doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
      doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
      doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
    }

    // Contenido de la fila de datos
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(resultado.numero, tablaInicioX + 10, yPos + 3.5, { align: "center" });
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(resultado.prueba, tablaInicioX + 22, yPos + 3.5);
    doc.text(resultado.resultado, tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
    yPos += filaAltura;
  });

  // === SECCIÓN 3: ANÁLISIS FODA ===
  // Header de análisis FODA
  yPos = dibujarHeaderSeccion("III.- ANÁLISIS FODA", yPos, filaAltura);

  // Función para calcular altura dinámica de texto
  const calcularAlturaTexto = (texto, anchoMaximo, alturaMinima = 10) => {
    if (!texto) return alturaMinima;

    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineas = doc.splitTextToSize(texto, anchoMaximo);
    const interlineado = 3.5;

    // Altura calculada + padding superior
    const alturaCalculada = lineas.length * interlineado + 2;
    return Math.max(alturaCalculada, alturaMinima);
  };

  // Fila 1: Fortalezas / Oportunidades
  const alturaFila1 = calcularAlturaTexto(datosFinales.fortalezasOportunidades, tablaAncho - 4);

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
  const alturaFila2 = calcularAlturaTexto(datosFinales.debilidadesAmenazas, tablaAncho - 4);

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

  // === SECCIÓN 4: OBSERVACIONES ===
  // Header de observaciones
  yPos = dibujarHeaderSeccion("IV.- OBSERVACIONES", yPos, filaAltura);

  // Fila de Observaciones (creciente)
  const alturaObservaciones = calcularAlturaTexto(datosFinales.observaciones, tablaAncho - 5);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaObservaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaObservaciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaObservaciones, tablaInicioX + tablaAncho, yPos + alturaObservaciones);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.observaciones, tablaInicioX + 2, yPos + 3.6, tablaAncho - 5);
  yPos += alturaObservaciones;

  // === SECCIÓN 5: RECOMENDACIONES ===
  // Header de recomendaciones
  yPos = dibujarHeaderSeccion("V.- RECOMENDACIONES", yPos, filaAltura);

  // Fila de Recomendaciones (creciente)
  const alturaRecomendaciones = calcularAlturaTexto(datosFinales.recomendaciones, tablaAncho - 5);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaRecomendaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaRecomendaciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaRecomendaciones, tablaInicioX + tablaAncho, yPos + alturaRecomendaciones);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.recomendaciones, tablaInicioX + 2, yPos + 3.6, tablaAncho - 5);
  yPos += alturaRecomendaciones;

  // === SECCIÓN 6: CONCLUSIONES ===
  // Header de conclusiones
  yPos = dibujarHeaderSeccion("VI.- CONCLUSIONES", yPos, filaAltura);

  // Fila con APTO | X | NO APTO
  const anchoColumna = tablaAncho / 4; // Dividir en 4 columnas
  const alturaFilaApto = filaAltura;

  // Dibujar líneas de la fila
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaApto);
  doc.line(tablaInicioX + anchoColumna, yPos, tablaInicioX + anchoColumna, yPos + alturaFilaApto);
  doc.line(tablaInicioX + anchoColumna * 2, yPos, tablaInicioX + anchoColumna * 2, yPos + alturaFilaApto);
  doc.line(tablaInicioX + anchoColumna * 3, yPos, tablaInicioX + anchoColumna * 3, yPos + alturaFilaApto);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaApto);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaApto, tablaInicioX + tablaAncho, yPos + alturaFilaApto);

  // Contenido de la fila
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("APTO", tablaInicioX + anchoColumna / 2, yPos + 3.5, { align: "center" });
  
  // Dibujar X en APTO si es true
  if (datosFinales.apto === true) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(0, 51, 204); // #0033cc
    doc.text("X", tablaInicioX + anchoColumna + anchoColumna / 2, yPos + 3.5, { align: "center" });
    doc.setTextColor(0, 0, 0); // Volver a negro
  }
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NO APTO", tablaInicioX + anchoColumna * 2 + anchoColumna / 2, yPos + 3.5, { align: "center" });
  
  // Dibujar X en NO APTO si es true
  if (datosFinales.noApto === true) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(0, 51, 204); // #0033cc
    doc.text("X", tablaInicioX + anchoColumna * 3 + anchoColumna / 2, yPos + 3.5, { align: "center" });
    doc.setTextColor(0, 0, 0); // Volver a negro
  }

  yPos += alturaFilaApto;

  // === SECCIÓN DE FIRMAS ===
  const yFirmas = yPos;
  const alturaSeccionFirmas = 30; // Altura aumentada para la sección de firmas

  // Dibujar borde de la fila de firmas
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yFirmas, tablaInicioX, yFirmas + alturaSeccionFirmas);
  doc.line(tablaInicioX + tablaAncho, yFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas);
  doc.line(tablaInicioX, yFirmas, tablaInicioX + tablaAncho, yFirmas);
  doc.line(tablaInicioX, yFirmas + alturaSeccionFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas);

  // Usar helper para dibujar firmas dentro de la fila
  await dibujarFirmas({ doc, datos: data, y: yFirmas + 2, pageW });

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
