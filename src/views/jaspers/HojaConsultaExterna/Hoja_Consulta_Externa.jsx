import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { convertirGenero, getSign } from "../../utils/helpers";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default async function Hoja_Consulta_Externa(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;


  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente) + " " + (data.nombresPaciente)).trim(),
    fechaExamen: formatearFechaCorta(data.fechaExamen),
    tipoExamen: String(data.nombreExamen),
    sexo: convertirGenero(data.sexoPaciente),
    documentoIdentidad: String(data.dniPaciente),
    edad: String(data.edadPaciente),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente || data.fechaNacimiento),
    areaTrabajo: data.areaPaciente,
    puestoTrabajo: data.cargoPaciente,
    empresa: data.empresa,
    contrata: data.contrata,
    // Datos de ubicación
    ubicacion: data.postaVijus ? "POSTA" : data.cedro ? "CEDRO" : data.paraiso ? "PARAIS" : data.otros ? "OTROS" : "",
    otrosDescripcion: data.otrosDescripcion || "",
    // Datos adicionales
    observaciones: data.observaciones,
    // Datos de color
    color: data.color,
    codigoColor: data.codigoColor,
    textoColor: data.textoColor,
    // Datos adicionales para header
    numeroFicha: String(data.norden),
    sede: data.sede || data.nombreSede,
    horaSalida: String(data.horaSalida),
    direccionPaciente: String(data.direccionPaciente),
    digitalizacion: data.digitalizacion || [],
  };

  // Usar solo datos reales
  const datosFinales = datosReales;

  // Header reutilizable
  const drawHeader = async (pageNumber) => {
    // Logo y membrete
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("HOJA DE CONSULTA EXTERNA", pageW / 2, 40, { align: "center" });
    }

    // Número de Ficha y Página (alineación automática mejorada)
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.text("Nro de ficha: ", pageW - 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 60, 16);
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    doc.text("Sede: " + datosFinales.sede, pageW - 80, 20);
    doc.text("Fecha de examen: " + datosFinales.fechaExamen, pageW - 80, 25);
    doc.text("Hora: " + datosFinales.horaSalida, pageW - 80, 30);

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
          yPos += fontSize * 0.5; // salto mejorado entre líneas
          lineaActual = palabra;
        } else {
          doc.text(palabra, x, yPos);
          yPos += fontSize * 0.5;
        }
      }
    });

    if (lineaActual) {
      doc.text(lineaActual, x, yPos);
      yPos += fontSize * 0.5;
    }

    return yPos; // Devuelve la nueva posición final
  };

  // Función para procesar texto con saltos de línea numerados
  const procesarTextoConSaltosLinea = (texto) => {
    if (!texto) return [];

    // Dividir por saltos de línea reales (\n, \r\n) y otros separadores
    const partes = texto.split(/\r\n|\r|\n|\\n|\/n/g);

    // Procesar cada parte y mantener el formato original
    return partes
      .map(parte => parte.trim())
      .filter(parte => parte.length > 0);
  };

  // Función mejorada para manejar textos con saltos de línea numerados
  const dibujarTextoConSaltosLinea = (texto, x, y, anchoMaximo) => {
    const fontSize = doc.internal.getFontSize();
    let yPos = y;

    // Procesar el texto manteniendo el formato original
    const lineasProcesadas = procesarTextoConSaltosLinea(texto);

    lineasProcesadas.forEach((linea, index) => {
      // Verificar si es una línea numerada (empieza con número seguido de punto)
      const esLineaNumerada = /^\d+\./.test(linea);

      // Si la línea es muy larga, usar la función de salto de línea por palabras
      if (doc.getTextWidth(linea) > anchoMaximo) {
        yPos = dibujarTextoConSaltoLinea(linea, x, yPos, anchoMaximo);

        // Espacio mejorado después de una línea numerada que hizo salto
        if (esLineaNumerada) {
          yPos += fontSize * 0.4; // Espacio mejorado después de línea numerada con salto
        }

        // Si hay una siguiente línea numerada, agregar espacio adicional
        if (index < lineasProcesadas.length - 1) {
          const siguienteLinea = lineasProcesadas[index + 1];
          if (/^\d+\./.test(siguienteLinea)) {
            yPos += fontSize * 0.3; // Espacio mejorado antes de la siguiente línea numerada
          }
        }
      } else {
        // Si la línea cabe, dibujarla directamente
        doc.text(linea, x, yPos);

        // Espaciado mejorado para líneas numeradas
        if (esLineaNumerada) {
          yPos += fontSize * 0.6; // Espacio mejorado para líneas numeradas
        } else {
          yPos += fontSize * 0.5; // Espacio mejorado para líneas normales
        }
      }

      // Espacio adicional entre líneas numeradas consecutivas (solo si no hizo salto)
      if (index < lineasProcesadas.length - 1 && doc.getTextWidth(linea) <= anchoMaximo) {
        const siguienteLinea = lineasProcesadas[index + 1];
        if (esLineaNumerada && /^\d+\./.test(siguienteLinea)) {
          yPos += fontSize * 0.25; // Espacio mejorado entre líneas numeradas
        }
      }
    });

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
  const tablaInicioX = 10;
  const tablaAncho = 190;
  let yPos = 45;
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

  // Fila: Ubicación - POSTA | CEDRO | PARAIS | OTROS (4 columnas con espacios para X)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 40, yPos, tablaInicioX + 40, yPos + filaAltura); // División 1
  doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // División 2
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura); // División 3
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila para descripción de "Otros" (solo si se seleccionó Otros)
  if (datosFinales.ubicacion === "OTROS" && datosFinales.otrosDescripcion) {
    // Calcular altura necesaria para el texto de descripción
    const textoOtros = datosFinales.otrosDescripcion;
    const lineasProcesadasOtros = procesarTextoConSaltosLinea(textoOtros);
    let alturaSimuladaOtros = 0;
    const fontSizeOtros = 8;

    lineasProcesadasOtros.forEach((linea) => {
      if (doc.getTextWidth(linea) > (tablaAncho - 4)) {
        const palabras = linea.split(' ');
        let lineasNecesarias = 1;
        let lineaActual = '';

        palabras.forEach(palabra => {
          const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
          if (doc.getTextWidth(textoPrueba) > (tablaAncho - 4)) {
            lineasNecesarias++;
            lineaActual = palabra;
          } else {
            lineaActual = textoPrueba;
          }
        });

        alturaSimuladaOtros += lineasNecesarias * fontSizeOtros * 0.5; // Interlineado mejorado
      } else {
        alturaSimuladaOtros += fontSizeOtros * 0.5; // Interlineado mejorado
      }
    });

    const alturaFilaOtros = Math.max(filaAltura, alturaSimuladaOtros + 4);

    // Dibujar la fila para descripción de Otros
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaOtros);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaOtros);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaOtros, tablaInicioX + tablaAncho, yPos + alturaFilaOtros);
    yPos += alturaFilaOtros;
  }

  // Header para observaciones
  yPos = dibujarHeaderSeccion("2. OBSERVACIONES", yPos, filaAltura);

  // Fila creciente para datos adicionales con altura dinámica
  // Primero calcular la altura necesaria para el texto SIN dibujarlo
  doc.setFont("helvetica", "normal").setFontSize(7.5);
  const textoObservaciones = datosFinales.observaciones;

  // Calcular altura necesaria simulando el texto
  const alturaMinima = 150; // Altura mínima de la fila (100mm)
  const paddingSuperior = 4; // Padding superior 

  // Simular el texto para calcular altura sin dibujarlo
  const lineasProcesadas = procesarTextoConSaltosLinea(textoObservaciones);
  let alturaSimulada = 0;
  const fontSize = 8;

  lineasProcesadas.forEach((linea) => {
    const esLineaNumerada = /^\d+\./.test(linea);
    if (doc.getTextWidth(linea) > 160) {
      // Si necesita salto de línea, calcular altura aproximada
      const palabras = linea.split(' ');
      let lineasNecesarias = 1;
      let lineaActual = '';

      palabras.forEach(palabra => {
        const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
        if (doc.getTextWidth(textoPrueba) > 160) {
          lineasNecesarias++;
          lineaActual = palabra;
        } else {
          lineaActual = textoPrueba;
        }
      });

      alturaSimulada += lineasNecesarias * fontSize * 0.5; // Interlineado mejorado
      if (esLineaNumerada) alturaSimulada += fontSize * 0.1; // Espacio adicional para líneas numeradas
    } else {
      alturaSimulada += fontSize * 0.5; // Interlineado mejorado
      if (esLineaNumerada) alturaSimulada += fontSize * 0.1; // Espacio adicional para líneas numeradas
    }
  });

  const alturaFilaFinal = Math.max(alturaMinima, alturaSimulada + paddingSuperior + 5); // Incluir margen de 3mm

  // Dibujar la fila con la altura calculada
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaFinal);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaFinal);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaFinal, tablaInicioX + tablaAncho, yPos + alturaFilaFinal);

  // DIBUJAR EL TEXTO DE OBSERVACIONES INMEDIATAMENTE DESPUÉS DE DIBUJAR LA FILA
  const yObservaciones = yPos + 2.5; // Después del header de observaciones + margen
  doc.setFont("helvetica", "normal").setFontSize(6.5);
  dibujarTextoConSaltosLinea(datosFinales.observaciones, tablaInicioX + 2, yObservaciones + 1, 160);

  yPos += alturaFilaFinal;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 45 + filaAltura + 2.5; // Ajustar para el header

  // Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(7.5);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7.5);
  // Ajustar ancho para la nueva división (hasta x = tablaInicioX + 140)
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres || "", tablaInicioX + 35, yTexto + 1, 100);

  // Columna derecha: Tipo de examen
  doc.setFont("helvetica", "bold").setFontSize(7.5);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7.5);
  doc.text(datosFinales.tipoExamen || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(7.5);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7.5);
  doc.text(datosFinales.documentoIdentidad || "", tablaInicioX + 12, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7.5);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7.5);
  doc.text((datosFinales.edad ? (datosFinales.edad + " Años") : ""), tablaInicioX + 58, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7.5);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7.5);
  doc.text(datosFinales.sexo || "", tablaInicioX + 105, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7.5);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7.5);
  doc.text(datosFinales.fechaNacimiento || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // Domicilio
  doc.setFont("helvetica", "bold").setFontSize(7.5);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7.5);
  dibujarTextoConSaltoLinea(datosFinales.direccionPaciente || "", tablaInicioX + 25, yTexto + 1, tablaAncho - 30);
  yTexto += filaAltura;

  // Puesto de Trabajo, Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(7.5);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7.5);
  doc.text(datosFinales.puestoTrabajo || "", tablaInicioX + 30, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7.5);
  doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7.5);
  doc.text(datosFinales.areaTrabajo || "", tablaInicioX + 118, yTexto + 1);
  yTexto += filaAltura;

  // Empresa
  doc.setFont("helvetica", "bold").setFontSize(7.5);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7.5);
  dibujarTextoConSaltoLinea(datosFinales.empresa || "", tablaInicioX + 24, yTexto + 1, tablaAncho - 30);
  yTexto += filaAltura;

  // Contratista
  doc.setFont("helvetica", "bold").setFontSize(7.5);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7.5);
  doc.text(datosFinales.contrata || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Ubicación - POSTA | CEDRO | PARAIS | OTROS
  let yTexto2 = yTexto;

  // POSTA
  doc.setFont("helvetica", "bold").setFontSize(7.5);
  doc.text("POSTA", tablaInicioX + 2, yTexto2 + 1);

  // Marcar X en POSTA si es la ubicación seleccionada
  if (datosFinales.ubicacion === "POSTA") {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 35, yTexto2 + 1);
  }

  // CEDRO
  doc.setFont("helvetica", "bold").setFontSize(7.5);
  doc.text("CEDRO", tablaInicioX + 42, yTexto2 + 1);

  // Marcar X en CEDRO si es la ubicación seleccionada
  if (datosFinales.ubicacion === "CEDRO") {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 75, yTexto2 + 1);
  }

  // PARAIS
  doc.setFont("helvetica", "bold").setFontSize(7.5);
  doc.text("PARAIS", tablaInicioX + 82, yTexto2 + 1);

  // Marcar X en PARAIS si es la ubicación seleccionada
  if (datosFinales.ubicacion === "PARAIS") {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 115, yTexto2 + 1);
  }

  // OTROS
  doc.setFont("helvetica", "bold").setFontSize(7.5);
  doc.text("OTROS", tablaInicioX + 122, yTexto2 + 1);

  // Marcar X en OTROS si es la ubicación seleccionada
  if (datosFinales.ubicacion === "OTROS") {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 155, yTexto2 + 1);
  }
  yTexto += filaAltura;

  // Mostrar descripción de "Otros" si está seleccionado
  if (datosFinales.ubicacion === "OTROS" && datosFinales.otrosDescripcion) {
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    dibujarTextoConSaltosLinea(datosFinales.otrosDescripcion, tablaInicioX + 2, yTexto + 1, tablaAncho - 4);
    yTexto += filaAltura; // Incrementar para mantener consistencia
  }

  // === Calcular la posición base del cuadro de firmas ===
  const alturaSeccionFirmas = 30; // Altura fija de la sección de firmas
  const yFirmas = yPos - 30; // +5mm de espacio visual debajo de "Observaciones"
  console.log(yFirmas)
  // === Dibujar cuadro de firmas (dos columnas) ===
  doc.line(tablaInicioX, yFirmas, tablaInicioX, yFirmas + alturaSeccionFirmas); // Línea izquierda
  doc.line(tablaInicioX + 95, yFirmas, tablaInicioX + 95, yFirmas + alturaSeccionFirmas); // División central
  doc.line(tablaInicioX + tablaAncho, yFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea derecha
  doc.line(tablaInicioX, yFirmas, tablaInicioX + tablaAncho, yFirmas); // Línea superior
  doc.line(tablaInicioX, yFirmas + alturaSeccionFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea inferior

  // === COLUMNA 1: FIRMA Y HUELLA DEL TRABAJADOR ===
  const firmaTrabajadorY = yFirmas + 3;

  // Calcular centro de la columna 1 para centrar las imágenes
  const centroColumna1X = tablaInicioX + (95 / 2); // Centro de la columna 1

  // Agregar firma del trabajador (lado izquierdo)
  let firmaTrabajadorUrl = getSign(datosFinales, "FIRMAP");
  if (firmaTrabajadorUrl) {
    try {
      const imgWidth = 30;
      const imgHeight = 20;
      const x = centroColumna1X - 25;
      const y = firmaTrabajadorY;
      doc.addImage(firmaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del trabajador:", error);
    }
  }

  // Agregar huella del trabajador (lado derecho, vertical)
  let huellaTrabajadorUrl = getSign(datosFinales, "HUELLA");
  if (huellaTrabajadorUrl) {
    try {
      const imgWidth = 12;
      const imgHeight = 20;
      const x = centroColumna1X + 8;
      const y = firmaTrabajadorY;
      doc.addImage(huellaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando huella del trabajador:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Firma y Huella del trabajador", centroColumna1X, yFirmas + 26, { align: "center" });

  // === FIRMA DEL MÉDICO (DERECHA) ===
  const firmaMedicoY = yFirmas + 3;
  const centroColumnaDerechaX = tablaInicioX + (3 * tablaAncho / 4);
  let firmaMedicoUrl = await getSign(datosFinales, "SELLOFIRMA");
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 45;
      const imgHeight = 20;
      const x = centroColumnaDerechaX - (imgWidth / 2); // Centrar horizontalmente
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Sello y Firma del Médico", centroColumnaDerechaX, yFirmas + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumnaDerechaX, yFirmas + 28.5, { align: "center" });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });

  // === Imprimir ===
  if (docExistente) {
    return doc
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
