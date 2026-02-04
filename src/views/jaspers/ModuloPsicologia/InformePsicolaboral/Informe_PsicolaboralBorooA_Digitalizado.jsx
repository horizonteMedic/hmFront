import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils";
import { convertirGenero } from "../../../utils/helpers";
import drawColorBox from '../../components/ColorBox.jsx';
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from '../../../utils/dibujarFirmas.js';

export default async function Informe_PsicolaboralBorooA_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente) + " " + (data.nombresPaciente)).trim(),
    fechaExamen: formatearFechaCorta(data.fecha || data.fechaExamen || data.fechaRegistro || ""),
    tipoExamen: String(data.nombreExamen || data.tipoExamen || ""),
    sexo: convertirGenero(data.sexoPaciente),
    documentoIdentidad: String(data.dniPaciente || data.dni || ""),
    edad: String(data.edadPaciente || data.edad || ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente || data.fechaNacimiento || ""),
    areaTrabajo: data.areaPaciente || data.area || "",
    puestoTrabajo: data.cargoPaciente || data.cargo || "",
    empresa: data.empresa || "",
    contrata: data.contrata || "",
    // Datos de color
    color: data.color,
    codigoColor: data.codigoColor,
    textoColor: data.textoColor,
    // Datos adicionales para header
    numeroFicha: String(data.norden || data.numeroFicha || ""),
    sede: data.sede || data.nombreSede || "",
    horaSalida: String(data.horaSalida || ""),
    direccionPaciente: String(data.direccionPaciente || ""),
    // Datos para Aspectos Conductuales
    nivelAlertaRiesgo: data.nivelAlerta || data.nivelAlertaRiesgo || data.nivelAlertaAnteRiesgo || "-",
    tipoHostigamientoSexual: data.hostigamientoSexual || data.tipoHostigamientoSexual || "-",
    tipoConsecuenciaEncontrada: data.consecuencia || data.tipoConsecuenciaEncontrada || "-",
    // Datos para Observaciones, Recomendaciones y Conclusiones
    observaciones: data.observaciones || data.observacion || "",
    recomendaciones: data.recomendaciones || data.recomendacion || data.recomenda || "",
    conclusiones: data.conclusiones || data.conclusion || "",
    cumplePerfil: (typeof data.cumplePerfil === 'boolean') ? data.cumplePerfil : (data.apto === true || data.cumplePerfil === true)
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
      doc.text("INFORME PSICOLABORAL", pageW / 2, 32, { align: "center" });
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

  // Función para dibujar X en las columnas
  const dibujarX = (x, y) => {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(0, 0, 255); // Azul para la X
    doc.text("X", x, y, { align: "center" });
    doc.setTextColor(0, 0, 0); // Resetear a negro
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

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 35;
  const filaAltura = 5;

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

  // === SECCIÓN: CRITERIOS PSICOLÓGICOS ===
  // Fila gris: Título CRITERIOS PSICOLÓGICOS
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Dibujar fondo gris
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  // Dibujar líneas del borde
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Texto del título (centrado)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CRITERIOS PSICOLÓGICOS", tablaInicioX + tablaAncho / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // Constantes para las columnas
  const colNumero = 8;
  const colAspecto = 60;
  const col1Total = colNumero + colAspecto;
  const anchoColumnaEvaluacion = (tablaAncho - col1Total) / 5;
  const col2 = anchoColumnaEvaluacion;
  const col3 = anchoColumnaEvaluacion;
  const col4 = anchoColumnaEvaluacion;
  const col5 = anchoColumnaEvaluacion;

  // === SECCIÓN: ASPECTOS DE PERSONALIDAD ===
  // Fila celeste: Aspectos de Personalidad
  const colNumeroPersonalidad = colNumero;
  const col1TotalPersonalidad = col1Total;
  const anchoColumnaEvaluacionPersonalidad = anchoColumnaEvaluacion;
  const col2Personalidad = col2;
  const col3Personalidad = col3;
  const col4Personalidad = col4;
  const col5Personalidad = col5;

  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPersonalidad, yPos, tablaInicioX + col1TotalPersonalidad, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Aspectos de Personalidad", tablaInicioX + col1TotalPersonalidad / 2, yPos + 3.5, { align: "center" });
  doc.text("Bajo", tablaInicioX + col1TotalPersonalidad + col2Personalidad / 2, yPos + 3.5, { align: "center" });
  doc.text("Promedio Bajo", tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad / 2, yPos + 3.5, { align: "center" });
  doc.text("Promedio", tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad / 2, yPos + 3.5, { align: "center" });
  doc.text("Promedio Alto", tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad / 2, yPos + 3.5, { align: "center" });
  doc.text("Alto", tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad + anchoColumnaEvaluacionPersonalidad / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // === FILAS DE ASPECTOS DE PERSONALIDAD ===
  const aspectosPersonalidad = [
    "Estabilidad emocional",
    "Tolerancia a la frustración",
    "Autoestima",
    "Asertividad"
  ];

  aspectosPersonalidad.forEach((aspecto, index) => {
    const numero = index + 1;
    const aspectoNum = numero;

    const bajo = data[`aspectoPersonalidad${aspectoNum}B`];
    const promedioBajo = data[`aspectoPersonalidad${aspectoNum}NPB`];
    const promedio = data[`aspectoPersonalidad${aspectoNum}NP`];
    const promedioAlto = data[`aspectoPersonalidad${aspectoNum}NPA`];
    const alto = data[`aspectoPersonalidad${aspectoNum}A`];

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + colNumeroPersonalidad, yPos, tablaInicioX + colNumeroPersonalidad, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPersonalidad, yPos, tablaInicioX + col1TotalPersonalidad, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(String(numero), tablaInicioX + 2, yPos + 3.5);
    doc.text(aspecto, tablaInicioX + colNumeroPersonalidad + 2, yPos + 3.5);

    const centroY = yPos + filaAltura / 2 + 1.2;
    if (bajo) {
      dibujarX(tablaInicioX + col1TotalPersonalidad + col2Personalidad / 2, centroY);
    } else if (promedioBajo) {
      dibujarX(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad / 2, centroY);
    } else if (promedio) {
      dibujarX(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad / 2, centroY);
    } else if (promedioAlto) {
      dibujarX(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad / 2, centroY);
    } else if (alto) {
      dibujarX(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad + anchoColumnaEvaluacionPersonalidad / 2, centroY);
    }

    yPos += filaAltura;
  });

  // === SECCIÓN: ASPECTOS CONDUCTUALES ===
  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Aspectos Conductuales", tablaInicioX + tablaAncho / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  const colNumeroConductual = 8;
  const colDescripcionConductual = 60;

  const aspectosConductuales = [
    {
      descripcion: "Nivel de alerta ante el riesgo",
      valor: datosFinales.nivelAlertaRiesgo || "-"
    },
    {
      descripcion: "Tipo de hostigamiento sexual",
      valor: datosFinales.tipoHostigamientoSexual || "-"
    },
    {
      descripcion: "Tipo de consecuencia encontrada",
      valor: datosFinales.tipoConsecuenciaEncontrada || "-"
    }
  ];

  for (let index = 0; index < aspectosConductuales.length; index++) {
    const aspecto = aspectosConductuales[index];
    const numero = index + 1;

    if (yPos + filaAltura > pageHeight - 20) {
      doc.addPage();
      numeroPagina++;
      yPos = 45;
      await drawHeader(numeroPagina);
    }

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + colNumeroConductual, yPos, tablaInicioX + colNumeroConductual, yPos + filaAltura);
    doc.line(tablaInicioX + colNumeroConductual + colDescripcionConductual, yPos, tablaInicioX + colNumeroConductual + colDescripcionConductual, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(String(numero), tablaInicioX + 2, yPos + 3.5);
    doc.text(aspecto.descripcion, tablaInicioX + colNumeroConductual + 2, yPos + 3.5);

    const anchoColumnaValor = tablaAncho - (colNumeroConductual + colDescripcionConductual) - 4;
    const xValor = tablaInicioX + colNumeroConductual + colDescripcionConductual + 2;
    const yInicioValor = yPos + 3;

    doc.setFont("helvetica", "normal").setFontSize(8);
    let yFinalValor = dibujarTextoConSaltoLinea(String(aspecto.valor), xValor, yInicioValor, anchoColumnaValor);

    const alturaMaximaValor = pageHeight - yPos - 25;
    if (yFinalValor - yPos > alturaMaximaValor) {
      doc.addPage();
      numeroPagina++;
      yPos = 45;
      await drawHeader(numeroPagina);

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.2);
      doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
      doc.line(tablaInicioX + colNumeroConductual, yPos, tablaInicioX + colNumeroConductual, yPos + filaAltura);
      doc.line(tablaInicioX + colNumeroConductual + colDescripcionConductual, yPos, tablaInicioX + colNumeroConductual + colDescripcionConductual, yPos + filaAltura);
      doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
      doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(String(numero), tablaInicioX + 2, yPos + 3.5);
      doc.text(aspecto.descripcion, tablaInicioX + colNumeroConductual + 2, yPos + 3.5);

      doc.setFont("helvetica", "normal").setFontSize(8);
      yFinalValor = dibujarTextoConSaltoLinea(String(aspecto.valor), xValor, yPos + 3, anchoColumnaValor);
    }

    // Calcular altura necesaria con mínimo de filaAltura (5)
    const alturaNecesaria = Math.max(filaAltura, yFinalValor - yPos + 2);
    
    // Redibujar líneas verticales con la altura correcta
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaNecesaria);
    doc.line(tablaInicioX + colNumeroConductual, yPos, tablaInicioX + colNumeroConductual, yPos + alturaNecesaria);
    doc.line(tablaInicioX + colNumeroConductual + colDescripcionConductual, yPos, tablaInicioX + colNumeroConductual + colDescripcionConductual, yPos + alturaNecesaria);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaNecesaria);
    doc.line(tablaInicioX, yPos + alturaNecesaria, tablaInicioX + tablaAncho, yPos + alturaNecesaria);

    yPos += alturaNecesaria;
  }

  // === SECCIÓN: ASPECTOS PSICOLABORALES ===
  const colNumeroPsicolaboral = colNumero;
  const col1TotalPsicolaboral = col1Total;
  const anchoColumnaEvaluacionPsicolaboral = anchoColumnaEvaluacion;
  const col2Psicolaboral = anchoColumnaEvaluacionPsicolaboral;
  const col3Psicolaboral = anchoColumnaEvaluacionPsicolaboral;
  const col4Psicolaboral = anchoColumnaEvaluacionPsicolaboral;
  const col5Psicolaboral = anchoColumnaEvaluacionPsicolaboral;

  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPsicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Aspectos Psicolaborales", tablaInicioX + col1TotalPsicolaboral / 2, yPos + 3.5, { align: "center" });
  doc.text("Poco desarrollado", tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral / 2, yPos + 3.5, { align: "center" });
  doc.text("Necesita mejorar", tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral / 2, yPos + 3.5, { align: "center" });
  doc.text("Adecuado", tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral / 2, yPos + 3.5, { align: "center" });
  doc.text("Destacado", tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral / 2, yPos + 3.5, { align: "center" });
  doc.text("Excepcional", tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral + anchoColumnaEvaluacionPsicolaboral / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  const aspectosPsicolaborales = [
    "Capacidad de influencia",
    "Adaptacion a los cambios",
    "Trabajo en equipo y colaboración",
    "Orientación a la acción y mejora de procesos",
    "Autonomia y proactividad",
    "Toma de decisiones",
    "Crecimiento personal",
    "Motivación"
  ];

  aspectosPsicolaborales.forEach((aspecto, index) => {
    const numero = index + 1;
    const aspectoNum = numero;

    const pocoDesarrollado = data[`aspectosPsicolaborales${aspectoNum}PD`];
    const necesitaMejorar = data[`aspectosPsicolaborales${aspectoNum}NM`];
    const adecuado = data[`aspectosPsicolaborales${aspectoNum}A`];
    const destacado = data[`aspectosPsicolaborales${aspectoNum}D`];
    const excepcional = data[`aspectosPsicolaborales${aspectoNum}E`] || data[`aspectosPsicolaborales${aspectoNum}NA`];

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + colNumeroPsicolaboral, yPos, tablaInicioX + colNumeroPsicolaboral, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPsicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(String(numero), tablaInicioX + 2, yPos + 3.5);
    doc.text(aspecto, tablaInicioX + colNumeroPsicolaboral + 2, yPos + 3.5);

    const centroY = yPos + filaAltura / 2 + 1.2;
    if (pocoDesarrollado) {
      dibujarX(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral / 2, centroY);
    } else if (necesitaMejorar) {
      dibujarX(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral / 2, centroY);
    } else if (adecuado) {
      dibujarX(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral / 2, centroY);
    } else if (destacado) {
      dibujarX(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral / 2, centroY);
    } else if (excepcional) {
      dibujarX(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral + anchoColumnaEvaluacionPsicolaboral / 2, centroY);
    }

    yPos += filaAltura;
  });

  // === SECCIÓN: OBSERVACIONES (CON HEADER GRIS) ===
  const espacioMinimo = 15;

  if (yPos + espacioMinimo > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
  }

  // Header gris: OBSERVACIONES
  yPos = dibujarHeaderSeccion("OBSERVACIONES:", yPos, filaAltura);

  // Fila con altura dinámica (mínimo 5)
  const textoObservaciones = (datosFinales.observaciones || "-").toUpperCase();

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

  doc.setFont("helvetica", "normal").setFontSize(7);
  let yFinalObservaciones = dibujarTextoConSaltoLinea(textoObservaciones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);

  const alturaMaximaObs = pageHeight - yPos - 25;
  let alturaNecesariaObservaciones = Math.max(filaAltura, yFinalObservaciones - yPos + 2);
  
  // Si el contenido no cabe, dividirlo en múltiples páginas
  if (alturaNecesariaObservaciones > alturaMaximaObs) {
    // Dibujar líneas de la primera página con la altura máxima disponible
    const alturaPrimeraPagina = alturaMaximaObs;
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
    const lineasTexto = dividirTextoConSaltosLinea(textoObservaciones, tablaAncho - 4);
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
    alturaNecesariaObservaciones = Math.max(filaAltura, yTextoActual - yPos + 2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaNecesariaObservaciones);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaNecesariaObservaciones);
    doc.line(tablaInicioX, yPos + alturaNecesariaObservaciones, tablaInicioX + tablaAncho, yPos + alturaNecesariaObservaciones);
  } else {
    // Si cabe en una página, dibujar las líneas finales
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaNecesariaObservaciones);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaNecesariaObservaciones);
    doc.line(tablaInicioX, yPos + alturaNecesariaObservaciones, tablaInicioX + tablaAncho, yPos + alturaNecesariaObservaciones);
  }

  yPos += alturaNecesariaObservaciones;

  // === SECCIÓN: RECOMENDACIONES (CON HEADER GRIS) ===
  if (yPos + espacioMinimo > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
  }

  // Header gris: RECOMENDACIONES
  yPos = dibujarHeaderSeccion("RECOMENDACIONES:", yPos, filaAltura);

  // Fila con altura dinámica (mínimo 5)
  const textoRecomendaciones = (datosFinales.recomendaciones || "-").toUpperCase();

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

  doc.setFont("helvetica", "normal").setFontSize(7);
  let yFinalRecomendaciones = dibujarTextoConSaltoLinea(textoRecomendaciones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);

  const alturaMaximaRec = pageHeight - yPos - 25;
  let alturaNecesariaRecomendaciones = Math.max(filaAltura, yFinalRecomendaciones - yPos + 2);
  
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
    alturaNecesariaRecomendaciones = Math.max(filaAltura, yTextoActual - yPos + 2);
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

  // === SECCIÓN: CONCLUSIONES (CON HEADER GRIS) ===
  if (yPos + espacioMinimo > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
  }

  // Header gris: CONCLUSIONES
  yPos = dibujarHeaderSeccion("CONCLUSIONES", yPos, filaAltura);

  // Fila con dos columnas: CUMPLE CON EL PERFIL | NO CUMPLE CON EL PERFIL
  const anchoColumna = tablaAncho / 2;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  doc.line(tablaInicioX + anchoColumna, yPos, tablaInicioX + anchoColumna, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // === COLUMNA IZQUIERDA: CUMPLE CON EL PERFIL ===
  const miniCeldaSize = 6;
  const divisionCumpleX = tablaInicioX + anchoColumna - miniCeldaSize;
  doc.line(divisionCumpleX, yPos, divisionCumpleX, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CUMPLE CON EL PERFIL", tablaInicioX + 2, yPos + 3.5);

  const miniCeldaXCumple = divisionCumpleX;
  const miniCeldaYCumple = yPos;

  if (datosFinales.cumplePerfil === true) {
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 255);
    doc.text("X", miniCeldaXCumple + miniCeldaSize / 2, miniCeldaYCumple + filaAltura / 2 + 1.2, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  // === COLUMNA DERECHA: NO CUMPLE CON EL PERFIL ===
  const divisionNoCumpleX = tablaInicioX + tablaAncho - miniCeldaSize;
  doc.line(divisionNoCumpleX, yPos, divisionNoCumpleX, yPos + filaAltura);

  const xTextoNoCumple = tablaInicioX + anchoColumna + 2;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("NO CUMPLE CON EL PERFIL", xTextoNoCumple, yPos + 3.5);

  const miniCeldaXNoCumple = divisionNoCumpleX;
  const miniCeldaYNoCumple = yPos;

  if (datosFinales.cumplePerfil === false) {
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 255);
    doc.text("X", miniCeldaXNoCumple + miniCeldaSize / 2, miniCeldaYNoCumple + filaAltura / 2 + 1.2, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  yPos += filaAltura;

  // === SECCIÓN DE FIRMA ===
  if (yPos + 30 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
  }

  const alturaSeccionFirma = 30;
  const yFirmas = yPos;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yFirmas, tablaAncho, alturaSeccionFirma, 'S');

  // Usar dibujarFirmas en lugar de getSign
  await dibujarFirmas({ doc, datos: data, y: yFirmas + 2, pageW });

  yPos += alturaSeccionFirma;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 12, fontSize: 7 });

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

