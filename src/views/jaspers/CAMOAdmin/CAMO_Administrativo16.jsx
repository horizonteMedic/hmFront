import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { getSign } from "../../utils/helpers.js";
import drawColorBox from '../components/ColorBox.jsx';
// import footerTR from '../components/footerTR.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';

export default async function CAMO_Administrativo16(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  let numeroPagina = 1;
  const esBoro = String(data.empresa) === "MINERA BOROO MISQUICHILCA S.A."
  const Recomendaciones = esBoro && data.recomendaciones ? data.recomendaciones.split('\n').filter(rec => rec.trim() !== '') : []

  const Recomendaciones2 = data.recomendaciones ? data.recomendaciones.split('\n').filter(rec => rec.trim() !== '') : []


  const datosFinales = {
    numeroHistoria: String(data.norden ?? ""), //revisar - podría ser norden del JSON
    tipoExamen: String(data.nombreExamen ?? ""),
    apellidosNombres: String((data.apellidosPaciente ?? "") + " " + (data.nombresPaciente ?? "")).trim(),
    documentoIdentidad: String(data.dniPaciente ?? ""),
    genero: data.sexoPaciente === "M" ? "MASCULINO" : data.sexoPaciente === "F" ? "FEMENINO" : String(data.sexoPaciente ?? ""),
    edad: String(`${data.edadPaciente ?? ""} AÑOS`),
    grupoSanguineo: String(data.grupoSanguineo ?? ""),
    empresa: String(data.empresa ?? ""),
    contratista: String(data.contrata ?? ""),
    puestoPostula: String(data.cargoPaciente ?? ""),
    ocupacionActual: String(data.ocupacionPaciente ?? ""),
    fechaExamen: formatearFechaCorta(data.fechaDesde ?? ""), //revisar - podría ser fechaHasta
    // Datos de color
    color: data.color || 1,
    codigoColor: data.codigoColor || "",
    textoColor: data.textoColor || "",
    // Datos adicionales para header
    numeroFicha: String(data.norden ?? ""), //revisar - usando norden como numeroFicha
    sede: data.sede || data.nombreSede || "",
    // Datos de conclusiones - eliminar duplicados
    conclusiones: [],
    // Datos de aptitud
    apto: data.apto ? "APTO" : data?.noApto ? "NO APTO" : data.aptoConRestriccion ? "APTO CON RESTRICCIÓN" : data.conObservacion ? "CON OBSERVACION" : data.evaluado ? "EVALUADO" : "", //revisar - el JSON tiene boolean, necesita conversión
    restricciones: data.restriccionesDescripcion || "",
    recomendaciones: Recomendaciones,
    fechaDesde: formatearFechaCorta(data.fechaDesde ?? ""),
    fechaHasta: formatearFechaCorta(data.fechaHasta ?? ""),
    //NEUVA HOJA
    tipoExamenPreocupacional: data.nombreExamen === "PRE-OCUPACIONAL",
    tipoExamenPeriodico: data.nombreExamen === "ANUAL",
    tipoExamenRetiroCese: data.nombreExamen === "RETIRO",
    tipoExamenReubicacion: data.nombreExamen === "REUBICACION",
    tipoExamenReincorporacion: data.nombreExamen === "REINCORPORACION",
  };


  // Función para determinar qué checkbox está marcado
  const getAptitudCheckbox = (apto) => {
    switch (apto) {
      case "APTO":
        return { apto: true, aptoConRestriccion: false, noApto: false, conObservacion: false, evaluado: false };
      case "APTO CON RESTRICCIÓN":
        return { apto: false, aptoConRestriccion: true, noApto: false, conObservacion: false, evaluado: false };
      case "NO APTO":
        return { apto: false, aptoConRestriccion: false, noApto: true, conObservacion: false, evaluado: false };
      case "CON OBSERVACION":
        return { apto: false, aptoConRestriccion: false, noApto: false, conObservacion: true, evaluado: false };
      case "EVALUADO":
        return { apto: false, aptoConRestriccion: false, noApto: false, conObservacion: false, evaluado: true };
      default:
        return { apto: false, aptoConRestriccion: false, noApto: false, conObservacion: false, evaluado: false };
    }
  };

  const aptitudCheckboxes = getAptitudCheckbox(datosFinales.apto);


  // Header reutilizable (mejorado basado en formatPsicologia)
  const drawHeader = async (pageNumber) => {
    // Logo y membrete
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal
    doc.setFont("helvetica", "bold").setFontSize(14);

    doc.text(pageNumber == 1 ? "CERTIFICADO DE APTITUD MEDICO OCUPACIONAL" : "INFORME MÉDICO", pageW / 2, 36, { align: "center" });

    // Número de Ficha y Página (alineación automática mejorada)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 50, 16);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosFinales.sede, pageW - 80, 20);
    // Fecha de examen (alineado como SAS/Altura/Conduccion)
    doc.text("Fecha de examen: " + (datosFinales.fechaExamen || ""), pageW - 80, 25);

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

  // === HEADER ===
  await drawHeader(numeroPagina);

  // === TABLA PRINCIPAL ===
  const tablaInicioX = 15;
  const tablaInicioY = 40;
  const tablaAncho = 180;
  const filaAltura = 6;

  // Función para calcular altura dinámica de texto
  const calcularAlturaTexto = (texto, anchoMaximo, fontSize = 9) => {
    if (!texto || texto.trim() === '') return filaAltura;

    doc.setFontSize(fontSize);
    const lineHeight = fontSize * 0.5; // Altura de línea aproximada (igual que dibujarTextoConSaltoLinea)
    const palabras = texto.split(' ');
    let lineas = 1;
    let lineaActual = '';

    for (let palabra of palabras) {
      const textoPrueba = lineaActual + (lineaActual ? ' ' : '') + palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);

      if (anchoTexto > anchoMaximo) {
        if (lineaActual) {
          lineas++;
          lineaActual = palabra;
        } else {
          // Si una palabra sola es muy larga, cuenta como una línea
          lineas++;
          lineaActual = '';
        }
      } else {
        lineaActual = textoPrueba;
      }
    }

    // Calcular altura mínima necesaria
    const alturaNecesaria = lineas * lineHeight + 1; // Reducir padding de 4 a 1
    return Math.max(filaAltura, alturaNecesaria); // Mínimo la altura base
  };

  // Función para dibujar texto con salto de línea automático
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    if (!texto || texto.trim() === '') return;

    // No cambiar el fontSize, usar el que ya está establecido
    const fontSize = doc.internal.getFontSize();
    const lineHeight = fontSize * 0.5;
    const palabras = texto.split(' ');
    let lineaActual = '';
    let yActual = y;

    for (let palabra of palabras) {
      const textoPrueba = lineaActual + (lineaActual ? ' ' : '') + palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);

      if (anchoTexto > anchoMaximo) {
        if (lineaActual) {
          // Dibujar la línea actual y pasar a la siguiente
          doc.text(lineaActual, x, yActual);
          yActual += lineHeight;
          lineaActual = palabra;
        } else {
          // Si una palabra sola es muy larga, dibujarla de todas formas
          doc.text(palabra, x, yActual);
          yActual += lineHeight;
          lineaActual = '';
        }
      } else {
        lineaActual = textoPrueba;
      }
    }

    // Dibujar la última línea
    if (lineaActual) {
      doc.text(lineaActual, x, yActual);
    }
  };

  // Función para dibujar texto pegado sin espacios extra
  const dibujarTextoPegado = (texto, x, y, anchoMaximo) => {
    if (!texto || texto.trim() === '') return y;

    // No cambiar el fontSize, usar el que ya está establecido
    const fontSize = doc.internal.getFontSize();
    const palabras = texto.split(' ');
    let linea = '';
    let yActual = y;
    const lineHeight = fontSize * 0.5;

    palabras.forEach((palabra, i) => {
      const prueba = linea + (linea ? ' ' : '') + palabra;
      if (doc.getTextWidth(prueba) > anchoMaximo) {
        if (linea) {
          doc.text(linea, x, yActual);
          yActual += lineHeight;
          linea = palabra;
        } else {
          // Si una palabra sola es muy larga, dibujarla de todas formas
          doc.text(palabra, x, yActual);
          yActual += lineHeight;
          linea = '';
        }
      } else {
        linea = prueba;
      }
      if (i === palabras.length - 1 && linea) {
        doc.text(linea, x, yActual);
      }
    });

    return yActual + lineHeight; // Retorna posición final
  };

  // Función para simular dibujarTextoPegado sin dibujar (para calcular altura)
  const simularDibujarTextoPegado = (texto, y, anchoMaximo) => {
    if (!texto || texto.trim() === '') return y;

    // No cambiar el fontSize, usar el que ya está establecido
    const fontSize = doc.internal.getFontSize();
    const palabras = texto.split(' ');
    let linea = '';
    let yActual = y;
    const lineHeight = fontSize * 0.5;

    palabras.forEach((palabra, i) => {
      const prueba = linea + (linea ? ' ' : '') + palabra;
      if (doc.getTextWidth(prueba) > anchoMaximo) {
        if (linea) {
          yActual += lineHeight;
          linea = palabra;
        } else {
          // Si una palabra sola es muy larga, cuenta como línea
          yActual += lineHeight;
          linea = '';
        }
      } else {
        linea = prueba;
      }
      if (i === palabras.length - 1 && linea) {
        // No dibujar, solo contar la línea
      }
    });

    return yActual + lineHeight; // Retorna posición final
  };

  // Calcular alturas dinámicas para cada fila
  const alturaFila1 = filaAltura; // Primera fila fija (N° Historia, Tipo de Examen)
  const alturaFila2 = filaAltura; // Segunda fila fija (CERTIFICA)
  const alturaFila3 = filaAltura; // NOMBRES Y APELLIDOS (ancho disponible después de "NOMBRES Y APELLIDOS:")
  const alturaFila4 = filaAltura; // Cuarta fila fija (DNI, GÉNERO, EDAD)
  // Nueva distribución: EMPRESA (fila 5) y CONTRATISTA (fila 6) ocupan cada una una fila completa
  const alturaFila5 = calcularAlturaTexto(datosFinales.empresa, 160); // EMPRESA a todo el ancho
  const alturaFila6 = calcularAlturaTexto(datosFinales.contratista, 160); // CONTRATISTA a todo el ancho
  // PUESTO y OCUPACIÓN: cada uno en fila completa
  const alturaFila7 = calcularAlturaTexto(datosFinales.puestoPostula, 160); // PUESTO a todo el ancho
  const alturaFila8 = calcularAlturaTexto(datosFinales.ocupacionActual, 160); // OCUPACIÓN a todo el ancho

  // Dibujar líneas de la tabla con alturas dinámicas
  let yActual = tablaInicioY;

  // Línea superior
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);
  yActual += alturaFila1;

  // Línea después de fila 1
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);
  yActual += alturaFila2;

  // Línea después de fila 2
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);
  yActual += alturaFila3;

  // Línea después de fila 3
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);
  yActual += alturaFila4;

  // Línea después de fila 4
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);
  yActual += alturaFila5;

  // Línea después de fila 5
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);
  yActual += alturaFila6;

  // Línea después de fila 6
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);
  yActual += alturaFila7;

  // Línea después de fila 7
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);
  yActual += alturaFila8;

  // Línea inferior
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);

  // Líneas verticales con alturas dinámicas
  let yPos = tablaInicioY;

  // Primera fila (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila1); // Línea izquierda
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + alturaFila1); // Primera división
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + alturaFila1); // Tercera división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila1); // Línea derecha
  yPos += alturaFila1;

  // Segunda fila (CERTIFICA) - sin división vertical
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila2); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila2); // Línea derecha
  yPos += alturaFila2;

  // Tercera fila (NOMBRES Y APELLIDOS) - con división en 50mm
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila3); // Línea izquierda
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + alturaFila3); // División central
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila3); // Línea derecha
  yPos += alturaFila3;

  // Cuarta fila (DNI, GÉNERO, EDAD, GRUPO SANGUÍNEO) - 4 columnas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila4); // Línea izquierda
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + alturaFila4); // Primera división
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + alturaFila4); // Segunda división
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + alturaFila4); // Tercera división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila4); // Línea derecha
  yPos += alturaFila4;

  // Quinta fila (EMPRESA) - sin división vertical
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila5); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila5); // Línea derecha
  yPos += alturaFila5;

  // Sexta fila (CONTRATISTA) - sin división vertical
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila6); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila6); // Línea derecha
  yPos += alturaFila6;

  // Séptima fila (PUESTO) - sin división vertical
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila7); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila7); // Línea derecha
  yPos += alturaFila7;

  // Octava fila (OCUPACIÓN) - sin división vertical
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila8); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila8); // Línea derecha

  // === CONTENIDO DE LA TABLA ===

  // Calcular posiciones Y dinámicas
  let yTexto = tablaInicioY;

  // Primera fila: N° Historia Clínica y Tipo de Examen
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("N° HISTORIA CLINICA :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text(datosFinales.numeroHistoria, tablaInicioX + 47, yTexto + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("TIPO DE EXAMEN :", tablaInicioX + 92, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.tipoExamen, tablaInicioX + 137, yTexto + 4);
  yTexto += alturaFila1;

  // Segunda fila: Certifica que el Sr.(a) - ocupa toda la fila
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("CERTIFICA que el Sr.(a)", tablaInicioX + tablaAncho / 2, yTexto + 4, { align: "center" });
  yTexto += alturaFila2;

  // Tercera fila: Nombres y Apellidos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("NOMBRES Y APELLIDOS:", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 55, yTexto + 4, 130);
  yTexto += alturaFila3;

  // Cuarta fila: DNI, Género, Edad, Grupo Sanguíneo (4 columnas)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("GENERO :", tablaInicioX + 47, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.genero, tablaInicioX + 65, yTexto + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("EDAD :", tablaInicioX + 92, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.edad, tablaInicioX + 105, yTexto + 4);

  doc.setFont("helvetica", "bold").setFontSize(7);
  // Calcular posición del valor después del label para evitar superposición
  const anchoLabelGrupo = doc.getTextWidth("GRUPO SANGUÍNEO :");
  doc.text("GRUPO SANGUÍNEO :", tablaInicioX + 137, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Calcular posición X del valor, asegurándose de que quepa dentro de la columna
  const xValorGrupo = tablaInicioX + 137 + anchoLabelGrupo + 2;
  const anchoDisponibleGrupo = (tablaInicioX + tablaAncho) - xValorGrupo - 2; // Margen de 2mm del borde
  // Si el valor es muy largo, usar splitTextToSize para que se ajuste
  const grupoSanguineoTexto = datosFinales.grupoSanguineo && datosFinales.grupoSanguineo.trim()
    ? datosFinales.grupoSanguineo
    : "(No Aplica)";
  // Si es "(No Aplica)", usar fuente más pequeña para que quepa en una línea
  if (grupoSanguineoTexto === "(No Aplica)") {
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(grupoSanguineoTexto, xValorGrupo, yTexto + 4);
  } else {
    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineasGrupo = doc.splitTextToSize(grupoSanguineoTexto, anchoDisponibleGrupo);
    doc.text(lineasGrupo, xValorGrupo, yTexto + 4);
  }
  yTexto += alturaFila4;

  // Quinta fila: Empresa (fila completa)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("EMPRESA :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 20, yTexto + 4, 160);
  yTexto += alturaFila5;

  // Sexta fila: Contratista (fila completa)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("CONTRATISTA :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.contratista, tablaInicioX + 27, yTexto + 4, 160);
  yTexto += alturaFila6;

  // Séptima fila: Puesto al que Postula (fila completa)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("PUESTO POSTULA :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.puestoPostula, tablaInicioX + 35, yTexto + 4, 160);
  yTexto += alturaFila7;

  // Octava fila: Ocupación Actual (fila completa)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("OCUPACIÓN :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.ocupacionActual, tablaInicioX + 27, yTexto + 4, 160);
  yTexto += alturaFila8;


  yTexto += 4; // Espacio después de la fecha

  // === TÍTULO PRINCIPAL ===
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("HE PASADO EXAMEN MÉDICO EN POLICLÍNICO HORIZONTE MEDIC, TENIENDO COMO:", 15, yTexto);
  yTexto += 2;

  // === SECCIÓN DE CONCLUSIONES ===
  const marcoInicioX = 15;
  const marcoInicioY = yTexto;
  const marcoAncho = 180;
  const alturaMinimaConclusiones = 65; // Altura mínima definida (65mm)

  // Primero dibujar el subtítulo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("CONCLUSIONES:", marcoInicioX + 2, yTexto + 5);
  let yPosConclusiones = yTexto + 10;

  // Dibujar cada conclusión y calcular la posición final real
  if (datosFinales.conclusiones && datosFinales.conclusiones.length > 0) {
    datosFinales.conclusiones.forEach((conclusion) => {
      doc.setFont("helvetica", "normal").setFontSize(7);
      yPosConclusiones = dibujarTextoPegado(conclusion, marcoInicioX + 2, yPosConclusiones, 170);
    });
  } else {
    // Si no hay conclusiones, mostrar texto vacío pero mantener la altura mínima
    doc.setFont("helvetica", "normal").setFontSize(7);
    yPosConclusiones = dibujarTextoPegado("", marcoInicioX + 2, yPosConclusiones, 170);
  }

  // Calcular altura total basada en la posición real del texto + 1mm de padding
  const alturaContenido = (yPosConclusiones - yTexto) + 1;

  // Usar la altura mayor entre la mínima definida y el contenido real
  const alturaTotalConclusiones = Math.max(alturaMinimaConclusiones, alturaContenido);

  // Dibujar marco
  doc.rect(marcoInicioX, marcoInicioY, marcoAncho, alturaTotalConclusiones);

  // Actualizar yTexto con la posición final del marco
  yTexto = marcoInicioY + alturaTotalConclusiones;

  // === TABLA DE APTITUD ===
  yTexto += 3; // Pequeño espacio para no solaparse con el marco de conclusiones

  const tablaAptitudInicioX = 15;
  const tablaAptitudInicioY = yTexto;
  const tablaAptitudAncho = 180;
  const filaAptitudAltura = 6; // Altura reducida

  // Calcular altura necesaria para recomendaciones en la fila 4 - dinámico con altura mínima
  const alturaMinimaRecomendaciones = 40; // Altura mínima para recomendaciones
  let alturaRecomendaciones = filaAptitudAltura; // Altura base de la fila
  if (datosFinales.recomendaciones && datosFinales.recomendaciones.length > 0) {
    let recomendacionesArray = Array.isArray(datosFinales.recomendaciones)
      ? datosFinales.recomendaciones
      : [datosFinales.recomendaciones];
    recomendacionesArray = recomendacionesArray.slice(0, 10);

    // Simular el dibujo para calcular la posición real final
    let yPosicionSimulada = 0; // Posición simulada
    const anchoMaximoRecomendaciones = 85;
    recomendacionesArray.forEach((recomendacion, index) => {
      if (recomendacion && recomendacion.trim()) {
        const textoRecomendacion = recomendacionesArray.length > 1
          ? `${index + 1}. ${recomendacion.trim()}`
          : recomendacion.trim();
        // Simular dibujarTextoPegado para obtener la posición final real
        yPosicionSimulada = simularDibujarTextoPegado(textoRecomendacion, yPosicionSimulada, anchoMaximoRecomendaciones);
      }
    });
    // Altura real = posición final + 1mm de padding
    const alturaContenidoRecomendaciones = yPosicionSimulada + 1;
    alturaRecomendaciones = Math.max(alturaMinimaRecomendaciones, alturaContenidoRecomendaciones);
  } else {
    // Si no hay recomendaciones, usar altura mínima
    alturaRecomendaciones = alturaMinimaRecomendaciones;
  }

  // Calcular altura dinámica para la sección de RESTRICCIONES (lado derecho) - con altura mínima
  const xRestriccionesDyn = tablaAptitudInicioX + 98;
  const anchoRestriccionesDyn = (tablaAptitudInicioX + tablaAptitudAncho) - xRestriccionesDyn - 5;
  const alturaMinimaRestricciones = 40; // Altura mínima para restricciones
  let alturaRestricciones = 4; // incluye el título "RESTRICCIONES:" - reducido

  // Procesar restricciones una sola vez
  const restriccionesProcesadas = datosFinales.restricciones && datosFinales.restricciones !== "NINGUNO."
    ? datosFinales.restricciones.split('\n').filter(r => r.trim())
    : [];

  if (datosFinales.apto === "APTO") {
    alturaRestricciones += calcularAlturaTexto("SIN RESTRICCIONES", anchoRestriccionesDyn, 6);
  } else if (restriccionesProcesadas.length > 0) {
    // Calcular altura total de todas las restricciones
    let alturaTotal = 0;
    restriccionesProcesadas.forEach(r => {
      alturaTotal += calcularAlturaTexto(r.trim(), anchoRestriccionesDyn, 6);
    });
    alturaRestricciones += alturaTotal; // Quitar espacio extra
  } else {
    alturaRestricciones += calcularAlturaTexto("NINGUNO", anchoRestriccionesDyn, 6);
  }

  // Aplicar altura mínima a restricciones
  alturaRestricciones = Math.max(alturaMinimaRestricciones, alturaRestricciones);

  // === VARIABLES DE FIRMA (declarar antes de usar) ===
  const firmaAncho = 50; // Ancho fijo para la firma
  const firmaAlto = 18;  // Alto fijo para la firma (aumentado de 12 a 18)

  // Altura real del bloque superior (izquierda fija 6 filas vs restricciones dinámicas)
  // La fila 6 incluye las recomendaciones, así que usamos su altura específica
  const alturaFila6Aptitud = alturaRecomendaciones; // Usar altura exacta de recomendaciones
  const alturaBloqueSuperior = Math.max((5 * filaAptitudAltura) + alturaFila6Aptitud, alturaRestricciones);

  // Calcular altura de la tabla de aptitud (incluyendo firma)
  const alturaFirma = firmaAlto; // Solo alto de la firma, sin espacio extra
  const alturaTablaAptitud = alturaBloqueSuperior + alturaFirma + filaAptitudAltura; // bloque superior + firma + fila de fecha

  // Dibujar marco de la tabla de aptitud
  doc.rect(tablaAptitudInicioX, tablaAptitudInicioY, tablaAptitudAncho, alturaTablaAptitud);

  // Líneas verticales
  doc.line(tablaAptitudInicioX + 85, tablaAptitudInicioY, tablaAptitudInicioX + 85, tablaAptitudInicioY + (5 * filaAptitudAltura)); // División principal hasta la quinta fila
  doc.line(tablaAptitudInicioX + 95, tablaAptitudInicioY, tablaAptitudInicioX + 95, tablaAptitudInicioY + alturaBloqueSuperior + alturaFirma); // División para checkboxes hasta la línea de fecha




  // Líneas horizontales
  for (let i = 1; i <= 2; i++) {
    const y = tablaAptitudInicioY + (i * filaAptitudAltura);
    // Primeras 2 líneas horizontales solo hasta la mitad (división vertical principal)
    doc.line(tablaAptitudInicioX, y, tablaAptitudInicioX + 95, y);
  }

  // Tercera línea horizontal (debajo de NO APTO) que llega hasta la división vertical
  const yTerceraFila = tablaAptitudInicioY + (3 * filaAptitudAltura);
  doc.line(tablaAptitudInicioX, yTerceraFila, tablaAptitudInicioX + 95, yTerceraFila);

  // Cuarta línea horizontal (debajo de CON OBSERVACION) que llega hasta la división vertical
  const yCuartaFila = tablaAptitudInicioY + (4 * filaAptitudAltura);
  doc.line(tablaAptitudInicioX, yCuartaFila, tablaAptitudInicioX + 95, yCuartaFila);

  // Quinta línea horizontal (debajo de EVALUADO) que llega hasta la división vertical
  const yQuintaFila = tablaAptitudInicioY + (5 * filaAptitudAltura);
  doc.line(tablaAptitudInicioX, yQuintaFila, tablaAptitudInicioX + 95, yQuintaFila);

  // Línea horizontal "mitad" - base para restricciones (se mueve dinámicamente según altura de restricciones)
  const yMitad = tablaAptitudInicioY + alturaRestricciones;
  doc.line(tablaAptitudInicioX + tablaAptitudAncho - 85, yMitad, tablaAptitudInicioX + tablaAptitudAncho, yMitad);

  // === FIRMA SIN RECUADRO (DESPUÉS de la línea mitad) ===
  const firmaX = tablaAptitudInicioX + tablaAptitudAncho - firmaAncho - 15; // Posición X (derecha - 5 puntos más a la izquierda)

  // Calcular altura de conclusiones para ajustar posición de firma
  let alturaConclusiones = 0;
  // Calcular altura real de las conclusiones
  let yPosConclusionesSimulada = 10; // espacio del subtítulo
  if (datosFinales.conclusiones && datosFinales.conclusiones.length > 0) {
    datosFinales.conclusiones.forEach((conclusion) => {
      yPosConclusionesSimulada = simularDibujarTextoPegado(conclusion, 0, yPosConclusionesSimulada, 170);
    });
  }
  alturaConclusiones = Math.max(65, yPosConclusionesSimulada + 1); // Usar altura mínima de 65mm

  // Ajustar posición Y de la firma: base + 5mm si las conclusiones crecen
  const firmaY = yMitad + (alturaConclusiones > 20 ? 15 : 2); // +5mm si las conclusiones son altas, +2mm si son normales

  // Sin recuadro para la firma

  // Sin línea horizontal debajo de recomendaciones

  // Línea horizontal de separación para FECHA DE EXAMEN (después de la firma)
  const yLineaFecha = tablaAptitudInicioY + alturaBloqueSuperior + alturaFirma;
  doc.line(tablaAptitudInicioX, yLineaFecha, tablaAptitudInicioX + tablaAptitudAncho, yLineaFecha);

  // Contenido de la tabla de aptitud
  let yAptitud = tablaAptitudInicioY;

  // Primera fila: APTO (para el puesto en el que trabaja)
  if (aptitudCheckboxes.apto) {
    // Si es APTO, usar color azul y texto en negrita con fuente más grande
    doc.setTextColor(0, 0, 255); // Color azul
    doc.setFont("helvetica", "bold").setFontSize(8); // 7 + 1.5 = 8.5
    doc.text("APTO (para el puesto en el que trabaja)", tablaAptitudInicioX + 2, yAptitud + 4);
    doc.setFont("helvetica", "bold").setFontSize(12); // 8.5 + 1.5 = 10
    doc.text("X", tablaAptitudInicioX + 89, yAptitud + 4); // Checkbox marcado
    doc.setTextColor(0, 0, 0); // Restaurar color negro
  } else {
    // Si no es APTO, usar estilo normal
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("APTO (para el puesto en el que trabaja)", tablaAptitudInicioX + 2, yAptitud + 4);
  }
  yAptitud += filaAptitudAltura;

  // Segunda fila: APTO CON RESTRICCIÓN (para el puesto en el que trabaja)
  if (aptitudCheckboxes.aptoConRestriccion) {
    // Si es APTO CON RESTRICCIÓN, usar color verde y texto en negrita con fuente más grande
    doc.setTextColor(51, 166, 82); // Color verde #33a652
    doc.setFont("helvetica", "bold").setFontSize(8); // 7 + 1.5 = 8.5
    doc.text("APTO CON RESTRICCIÓN (para el puesto en el que trabaja)", tablaAptitudInicioX + 2, yAptitud + 4);
    doc.setFont("helvetica", "bold").setFontSize(12); // 8.5 + 1.5 = 10
    doc.text("X", tablaAptitudInicioX + 89, yAptitud + 4); // Checkbox marcado
    doc.setTextColor(0, 0, 0); // Restaurar color negro
  } else {
    // Si no es APTO CON RESTRICCIÓN, usar estilo normal
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("APTO CON RESTRICCIÓN (para el puesto en el que trabaja)", tablaAptitudInicioX + 2, yAptitud + 4);
  }
  yAptitud += filaAptitudAltura;

  // Tercera fila: NO APTO (para el puesto en el que trabaja o postula)
  if (aptitudCheckboxes.noApto) {
    // Si es NO APTO, usar color rojo y texto en negrita con fuente más grande
    doc.setTextColor(255, 0, 0); // Color rojo
    doc.setFont("helvetica", "bold").setFontSize(8); // 7 + 1.5 = 8.5
    doc.text("NO APTO (para el puesto en el que trabaja o postula)", tablaAptitudInicioX + 2, yAptitud + 4);
    doc.setFont("helvetica", "bold").setFontSize(12); // 8.5 + 1.5 = 10
    doc.text("X", tablaAptitudInicioX + 89, yAptitud + 4); // Checkbox marcado
    doc.setTextColor(0, 0, 0); // Restaurar color negro
  } else {
    // Si no es NO APTO, usar estilo normal
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("NO APTO (para el puesto en el que trabaja o postula)", tablaAptitudInicioX + 2, yAptitud + 4);
  }
  yAptitud += filaAptitudAltura;

  // Cuarta fila: CON OBSERVACION
  if (aptitudCheckboxes.conObservacion) {
    // Si es CON OBSERVACION, usar color naranja y texto en negrita con fuente más grande
    doc.setTextColor(255, 165, 0); // Color naranja
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("CON OBSERVACION", tablaAptitudInicioX + 2, yAptitud + 4);
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("X", tablaAptitudInicioX + 89, yAptitud + 4); // Checkbox marcado
    doc.setTextColor(0, 0, 0); // Restaurar color negro
  } else {
    // Si no es CON OBSERVACION, usar estilo normal
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("CON OBSERVACION", tablaAptitudInicioX + 2, yAptitud + 4);
  }
  yAptitud += filaAptitudAltura;

  // Quinta fila: EVALUADO
  if (aptitudCheckboxes.evaluado) {
    // Si es EVALUADO, usar color morado y texto en negrita con fuente más grande
    doc.setTextColor(128, 0, 128); // Color morado
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("EVALUADO", tablaAptitudInicioX + 2, yAptitud + 4);
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("X", tablaAptitudInicioX + 89, yAptitud + 4); // Checkbox marcado
    doc.setTextColor(0, 0, 0); // Restaurar color negro
  } else {
    // Si no es EVALUADO, usar estilo normal
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("EVALUADO", tablaAptitudInicioX + 2, yAptitud + 4);
  }
  yAptitud += filaAptitudAltura;

  // Sexta fila: RECOMENDACIONES
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("RECOMENDACIONES:", tablaAptitudInicioX + 2, yAptitud + 4);

  // Mostrar recomendaciones dinámicamente si existen
  if (datosFinales.recomendaciones && datosFinales.recomendaciones.length > 0) {
    doc.setFont("helvetica", "normal").setFontSize(7);

    // Ya está procesado como array en datosReales
    let recomendacionesArray = datosFinales.recomendaciones;

    // Limitar a 10 recomendaciones máximo
    recomendacionesArray = recomendacionesArray.slice(0, 10);

    let yPosicion = yAptitud + 10;
    const anchoMaximoRecomendaciones = 85; // MaxWidth para recomendaciones
    recomendacionesArray.forEach((recomendacion) => {
      if (recomendacion && recomendacion.trim()) {
        // Mostrar recomendación sin numeración ni guiones
        const textoRecomendacion = recomendacion.trim();

        // Dibujar cada recomendación con maxWidth y obtener nueva posición
        yPosicion = dibujarTextoPegado(textoRecomendacion, tablaAptitudInicioX + 2, yPosicion, anchoMaximoRecomendaciones);

        // Incrementar posición para la siguiente fila
        yPosicion += 0; // Sin espaciado extra entre filas
      }
    });
  }
  yAptitud += alturaFila6Aptitud; // Usar altura dinámica de la fila 6


  // Sección de RESTRICCIONES (en la parte derecha) - alineado con APTO y crecimiento dinámico
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("RESTRICCIONES:", tablaAptitudInicioX + 98, tablaAptitudInicioY + 3);
  doc.setFont("helvetica", "normal").setFontSize(7);

  // Mostrar restricciones dinámicamente
  const xRestricciones = tablaAptitudInicioX + 98;
  const yRestriccionesInicio = tablaAptitudInicioY + 8;
  const anchoRestricciones = (tablaAptitudInicioX + tablaAptitudAncho) - xRestricciones - 5; // max width con margen

  if (datosFinales.apto === "APTO") {
    // Si es APTO, mostrar "SIN RESTRICCIONES" sin guión
    dibujarTextoPegado("SIN RESTRICCIONES", xRestricciones, yRestriccionesInicio, anchoRestricciones);
  } else if (restriccionesProcesadas.length > 0) {
    // Si hay restricciones, mostrarlas sin guiones
    let yRestricciones = yRestriccionesInicio;
    restriccionesProcesadas.forEach((restriccion) => {
      yRestricciones = dibujarTextoPegado(restriccion.trim(), xRestricciones, yRestricciones, anchoRestricciones);
    });
  } else {
    // Si no hay restricciones o es "NINGUNO", mostrar "NINGUNO" sin guión
    dibujarTextoPegado("NINGUNO", xRestricciones, yRestriccionesInicio, anchoRestricciones);
  }



  // Fila de FECHA DE EXAMEN (después de la firma) - 3 columnas
  const yFechaTexto = tablaAptitudInicioY + alturaBloqueSuperior + alturaFirma;

  // Primera columna: Fecha desde
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha desde :", tablaAptitudInicioX + 2, yFechaTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaDesde || "", tablaAptitudInicioX + 25, yFechaTexto + 4);

  // Segunda columna: Fecha hasta
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha hasta :", tablaAptitudInicioX + 50, yFechaTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaHasta || "", tablaAptitudInicioX + 70, yFechaTexto + 4);

  // Tercera columna: Sello y firma
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("SELLO Y FIRMA DE MEDICO QUE CERTIFICA", tablaAptitudInicioX + 105, yFechaTexto + 4);

  try {
    const firmaMedicoImg = getSign(data, "SELLOFIRMA");
    doc.addImage(firmaMedicoImg, 'PNG', firmaX, firmaY, 50 * 0.7, 30 * 0.7);
  } catch (e) {
    // Error al agregar la firma
  }

  yTexto += alturaTablaAptitud; // Sin espacio extra después de la tabla

  // === FOOTER ===
  // Llamar al footer (los datos de prueba están dentro del componente)
  footerTR(doc);
  if (datosFinales.empresa === "MINERA AURIFERA RETAMAS S.A.") {
    // === PÁGINA 2 ===
    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);

    let yPos2 = 40;
    const x2 = 15;
    const ancho2 = 180;
    const filaDP = 6;
    const altHeaderGris = 5; // <-- agregar aquí

    // --- DATOS PERSONALES: encabezado gris ---
    const altDatosHeader = 5;
    doc.setFillColor(196, 196, 196);
    doc.rect(x2, yPos2, ancho2, altDatosHeader, 'FD');
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("I. DATOS PERSONALES", x2 + 2, yPos2 + 3.5);
    yPos2 += altDatosHeader;

    // --- Apellidos y Nombres ---
    doc.rect(x2, yPos2, ancho2, filaDP);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Apellidos y Nombres:", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, x2 + 42, yPos2 + 4, 135);
    yPos2 += filaDP;

    // --- DNI | Edad | Sexo ---
    const divCol = x2 + 90;
    doc.rect(x2, yPos2, ancho2, filaDP);
    doc.line(x2 + 45, yPos2, x2 + 45, yPos2 + filaDP);
    doc.line(divCol, yPos2, divCol, yPos2 + filaDP);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("DNI:", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.documentoIdentidad || "", x2 + 14, yPos2 + 4);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Edad:", x2 + 47, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.edad ? `${datosFinales.edad}` : "", x2 + 58, yPos2 + 4);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Sexo:", divCol + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    const sexoTexto = data.sexoPaciente === 'F' ? 'FEMENINO' : data.sexoPaciente === 'M' ? 'MASCULINO' : (data.sexoPaciente || "");
    doc.text(sexoTexto, divCol + 16, yPos2 + 4);
    yPos2 += filaDP;

    // --- Lugar de Nacimiento | Estado Civil ---
    doc.rect(x2, yPos2, ancho2, filaDP);
    doc.line(divCol, yPos2, divCol, yPos2 + filaDP);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Lugar de Nacimiento:", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.lugarNacimientoPaciente || "", x2 + 42, yPos2 + 4);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Estado Civil:", divCol + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.estadoCivilPaciente || "", divCol + 26, yPos2 + 4);
    yPos2 += filaDP;

    // --- Tipo Examen | Fecha Nac. ---
    doc.rect(x2, yPos2, ancho2, filaDP);
    doc.line(divCol, yPos2, divCol, yPos2 + filaDP);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Tipo Examen:", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.tipoExamen || "", x2 + 30, yPos2 + 4);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Fecha Nac.:", divCol + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.fechaNacimientoPaciente || "", divCol + 24, yPos2 + 4);
    yPos2 += filaDP;

    // --- Nivel de Estudio | Ocupación ---
    doc.rect(x2, yPos2, ancho2, filaDP);
    doc.line(divCol, yPos2, divCol, yPos2 + filaDP);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Nivel de Estudio:", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.nivelEstudioPaciente || "", x2 + 36, yPos2 + 4);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Ocupación:", divCol + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.ocupacionPaciente || "", divCol + 22, yPos2 + 4);
    yPos2 += filaDP;

    // --- Cargo (fila completa) ---
    doc.rect(x2, yPos2, ancho2, filaDP);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Cargo:", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.cargoPaciente || "", x2 + 18, yPos2 + 4);
    yPos2 += filaDP;

    // --- Área (fila completa) ---
    doc.rect(x2, yPos2, ancho2, filaDP);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Área:", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.areaPaciente || "", x2 + 14, yPos2 + 4);
    yPos2 += filaDP;

    // --- Empresa (fila completa) ---
    doc.rect(x2, yPos2, ancho2, filaDP);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Empresa:", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.empresa || "", x2 + 22, yPos2 + 4);
    yPos2 += filaDP;

    // --- Contrata (fila completa) ---
    doc.rect(x2, yPos2, ancho2, filaDP);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Contrata:", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.contrata || "", x2 + 22, yPos2 + 4);
    yPos2 += filaDP;

    yPos2 += 3;

    // --- DATOS DEL PACIENTE ---
    const altDatosPacHeader = 5;
    doc.setFillColor(196, 196, 196);
    doc.rect(x2, yPos2, ancho2, altDatosPacHeader, 'FD');
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("II. DATOS DEL PACIENTE", x2 + 2, yPos2 + 3.5);
    yPos2 += altDatosPacHeader;

    // --- Tipo de Examen: checkboxes ---
    const altCheckboxes = 7;
    doc.rect(x2, yPos2, ancho2, altCheckboxes);

    const checkSize = 3;
    const checkY = yPos2 + (altCheckboxes - checkSize) / 2;

    const tipoExamenOpciones = [
      { label: "Preocupacional", key: "tipoExamenPreocupacional" },
      { label: "Periódico", key: "tipoExamenPeriodico" },
      { label: "Retiro/ Cese", key: "tipoExamenRetiroCese" },
      { label: "Reubicación", key: "tipoExamenReubicacion" },
      { label: "Reincorporacion", key: "tipoExamenReincorporacion" },
    ];

    const espacioTotal = ancho2;
    const espacioPorItem = espacioTotal / tipoExamenOpciones.length;

    tipoExamenOpciones.forEach((opcion, i) => {
      const xItem = x2 + i * espacioPorItem;
      doc.setFont("helvetica", "normal").setFontSize(7);
      const labelWidth = doc.getTextWidth(opcion.label);
      const xLabel = xItem + (espacioPorItem - labelWidth - checkSize - 2) / 2;
      doc.text(opcion.label, xLabel, yPos2 + 4.8);
      const xBox = xLabel + labelWidth + 2;
      doc.rect(xBox, checkY, checkSize, checkSize);
      if (datosFinales[opcion.key]) {
        doc.setFont("helvetica", "bold").setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.text("X", xBox + 0.5, checkY + 2.5);
        doc.setFont("helvetica", "normal");
      }
    });
    yPos2 += altCheckboxes;

    // --- Puesto al que postula ---
    doc.rect(x2, yPos2, ancho2, filaDP);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Puesto al que postula:", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.cargoPaciente || "", x2 + 46, yPos2 + 4);
    yPos2 += filaDP;

    // --- Puesto actual ---
    doc.rect(x2, yPos2, ancho2, filaDP);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Puesto actual:", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.cargoPaciente || "", x2 + 32, yPos2 + 4);
    yPos2 += filaDP;

    // --- Antecedentes Personales ---
    const antecedentesPersonales = String(data.antecedentesPersonales ?? "");
    const alturaAntPersonales = Math.max(filaAltura * 1.5, calcularAlturaTexto(antecedentesPersonales || " ", 174, 8) + 5);
    doc.rect(x2, yPos2, ancho2, alturaAntPersonales);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Antecedentes Personales", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    if (antecedentesPersonales) dibujarTextoConSaltoLinea(antecedentesPersonales, x2 + 4, yPos2 + 9, 174);
    yPos2 += alturaAntPersonales;

    // --- Antecedentes Familiares ---
    const antecedentesFamiliares = String(data.antecedentesFamiliares ?? "");
    const alturaAntFamiliares = Math.max(filaAltura * 1.5, calcularAlturaTexto(antecedentesFamiliares || " ", 174, 8) + 5);
    doc.rect(x2, yPos2, ancho2, alturaAntFamiliares);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Antecedentes Familiares", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    if (antecedentesFamiliares) dibujarTextoConSaltoLinea(antecedentesFamiliares, x2 + 4, yPos2 + 9, 174);
    yPos2 += alturaAntFamiliares;

    // --- Talla | Peso | Índice de masa corporal ---
    const altTallaPeso = 6;
    doc.rect(x2, yPos2, ancho2, altTallaPeso);
    doc.line(x2 + 60, yPos2, x2 + 60, yPos2 + altTallaPeso);
    doc.line(x2 + 90, yPos2, x2 + 90, yPos2 + altTallaPeso);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Talla:", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.triajeTalla ? `${data.triajeTalla} mts.` : "", x2 + 14, yPos2 + 4);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Peso:", x2 + 62, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.triajePeso ? `${data.triajePeso} Kg.` : "", x2 + 74, yPos2 + 4);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Índice de masa corporal:", x2 + 92, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.triajeImc ? `${data.triajeImc} Kg/mt2` : "", x2 + 148, yPos2 + 4);
    yPos2 += altTallaPeso;

    // --- Temperatura | Cintura/Cadera ---
    const altTemp = 6;
    doc.rect(x2, yPos2, ancho2, altTemp);
    doc.line(x2 + 90, yPos2, x2 + 90, yPos2 + altTemp);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Temperatura:", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.triajeTemperatura ? `${data.triajeTemperatura} °C.` : "", x2 + 30, yPos2 + 4);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Cintura/ Cadera:", x2 + 92, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.triajeIcc ? `${data.triajeIcc} cm` : "", x2 + 130, yPos2 + 4);
    yPos2 += altTemp;

    // --- Reacciones Serológicas | Hemoglobina / Hematocrito ---
    const altSerologia = 6;
    doc.rect(x2, yPos2, ancho2, altSerologia);
    doc.line(x2 + 90, yPos2, x2 + 90, yPos2 + altSerologia);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Reacciones Serológicas a lues:", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.prpPositivo ? "POSTIVO" : "NEGATIVO", x2 + 60, yPos2 + 4);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Hemoglobina / Hematocrito", x2 + 92, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    const hemoVal = data.hemoglobinaTxthemoglobina ? `${data.hemoglobinaTxthemoglobina} g/dL` : "";
    const hemtoVal = data.hematocritoLabClinicoTxthematocrito ? `${data.hematocritoLabClinicoTxthematocrito} %` : "";
    const separador = (hemoVal || hemtoVal) ? " / " : "";
    doc.text(`${hemoVal}${separador}${hemtoVal}`, x2 + 150, yPos2 + 4);
    yPos2 += altSerologia;

    // --- Grupo Sanguíneo | Factor RH ---
    const altGrupoRH = 6;
    doc.rect(x2, yPos2, ancho2, altGrupoRH);
    doc.line(x2 + 90, yPos2, x2 + 90, yPos2 + altGrupoRH);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Grupo Sanguíneo:", x2 + 2, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.grupoSanguineo || "", x2 + 38, yPos2 + 4);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Factor RH:", x2 + 92, yPos2 + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.factorSanguineo ?? "", x2 + 115, yPos2 + 4);
    yPos2 += altGrupoRH;

    // --- Orina: encabezado ---
    const altOrinaHeader = 5;
    doc.rect(x2, yPos2, ancho2, altOrinaHeader);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Orina:", x2 + 2, yPos2 + 3.5);
    yPos2 += altOrinaHeader;

    // --- Orina: detalle (5 columnas, 4 filas) ---
    const altOrinaDetalle = 22;
    doc.rect(x2, yPos2, ancho2, altOrinaDetalle);
    doc.line(x2 + 36, yPos2, x2 + 36, yPos2 + altOrinaDetalle);
    doc.line(x2 + 72, yPos2, x2 + 72, yPos2 + altOrinaDetalle);
    doc.line(x2 + 108, yPos2, x2 + 108, yPos2 + altOrinaDetalle);
    doc.line(x2 + 144, yPos2, x2 + 144, yPos2 + altOrinaDetalle);

    const filaOrina = 5.5;
    const orinaRows = [
      ["Color :", data.orinaColor ?? "", "Leu :", data.orinaLeucocitosSedimento ?? "", "Densidad :", data.orinaDensidad ?? "", "Bili Ori :", data.orinaBilirrubina ?? "", "Nitritos :", data.orinaNitritos ?? ""],
      ["Aspecto :", data.orinaAspecto ?? "", "Herm :", data.orinaHematies ?? "", "Prot Ori :", data.orinaProteinas ?? "", "Uro Ori :", data.orinaUrobilinogeno ?? "", "", ""],
      ["Cel Epi :", data.orinaCelEpiteliales ?? "", "Cristales :", data.orinaCristales ?? "", "Glu Ori :", data.orinaGlucosa ?? "", "Hem Ori :", data.orinaSangre ?? "", "", ""],
      ["Ger :", data.orinaBacterias ?? "", "PH :", data.orinaPh ?? "", "Cue Ceto :", data.orinaCetonas ?? "", "Est Leu :", data.orinaLeucocitosQuimico ?? "", "", ""],
    ];

    orinaRows.forEach((fila, idx) => {
      const yFila = yPos2 + 1 + idx * filaOrina;
      doc.setFont("helvetica", "bold").setFontSize(7);
      doc.text(fila[0], x2 + 1, yFila + 3.5);
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(String(fila[1]), x2 + 13, yFila + 3.5);
      doc.setFont("helvetica", "bold").setFontSize(7);
      doc.text(fila[2], x2 + 37, yFila + 3.5);
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(String(fila[3]), x2 + 50, yFila + 3.5);
      doc.setFont("helvetica", "bold").setFontSize(7);
      doc.text(fila[4], x2 + 73, yFila + 3.5);
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(String(fila[5]), x2 + 88, yFila + 3.5);
      doc.setFont("helvetica", "bold").setFontSize(7);
      doc.text(fila[6], x2 + 109, yFila + 3.5);
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(String(fila[7]), x2 + 122, yFila + 3.5);
      doc.setFont("helvetica", "bold").setFontSize(7);
      doc.text(fila[8], x2 + 145, yFila + 3.5);
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(String(fila[9]), x2 + 158, yFila + 3.5);
    });
    yPos2 += altOrinaDetalle;

    yPos2 += 3;

    const calcularAlturaTextoReal = (doc, texto, maxWidth, fontSize, lineHeight = null) => {
      if (!texto) return 0;
      doc.setFont("helvetica", "normal").setFontSize(fontSize);
      const lh = lineHeight || fontSize * 0.4; // ~factor de línea en mm

      // Separar por saltos de línea explícitos primero
      const parrafos = String(texto).split("\n");
      let totalLineas = 0;

      parrafos.forEach(parrafo => {
        if (parrafo.trim() === "") {
          totalLineas += 1; // línea vacía cuenta como 1
        } else {
          const lines = doc.splitTextToSize(parrafo, maxWidth);
          totalLineas += lines.length;
        }
      });

      return totalLineas * lh;
    };

    // Dibuja texto con saltos de línea Y wrap automático correctamente
    const dibujarTextoCompleto = (doc, texto, x, y, maxWidth, fontSize, lineHeight = null) => {
      if (!texto) return y;
      doc.setFont("helvetica", "normal").setFontSize(fontSize);
      const lh = lineHeight || fontSize * 0.4;

      let yPos = y;
      const parrafos = String(texto).split("\n");

      parrafos.forEach(parrafo => {
        if (parrafo.trim() === "") {
          yPos += lh;
        } else {
          const lines = doc.splitTextToSize(parrafo, maxWidth);
          lines.forEach(line => {
            doc.text(line, x, yPos);
            yPos += lh;
          });
        }
      });

      return yPos;
    };

    // Dibuja una sección completa: header gris + cuerpo con altura dinámica
    const dibujarSeccionPaginada = async (doc, titulo, texto, x, y, ancho, drawHeader, numeroPaginaRef, altMinima = 18) => {
      const fontSize = 8;
      const lineHeight = 4;
      const contentMaxWidth = ancho - 8;
      const paddingTop = 5;
      const paddingBottom = 3;
      const altHeaderGris = 5;
      const pageHeight = doc.internal.pageSize.getHeight();
      const margenInferior = 25; // espacio para footer

      let yPos = y;

      // Header gris inicial
      doc.setFillColor(196, 196, 196);
      doc.rect(x, yPos, ancho, altHeaderGris, 'FD');
      doc.setFont("helvetica", "bold").setFontSize(9);
      doc.text(titulo, x + 2, yPos + 3.5);
      yPos += altHeaderGris;

      const textoFinal = String(texto ?? "").trim();

      if (!textoFinal) {
        const altura = Math.max(altMinima, lineHeight + paddingTop + paddingBottom);
        doc.rect(x, yPos, ancho, altura);
        yPos += altura;
        return yPos;
      }

      // Generar todas las líneas (separando por \n y aplicando wrap)
      doc.setFont("helvetica", "normal").setFontSize(fontSize);
      const parrafos = textoFinal.split("\n");
      const todasLasLineas = [];
      parrafos.forEach(parrafo => {
        if (parrafo.trim() === "") {
          todasLasLineas.push(""); // línea vacía
        } else {
          const lines = doc.splitTextToSize(parrafo, contentMaxWidth);
          lines.forEach(l => todasLasLineas.push(l));
        }
      });

      // Dibujar líneas, paginando cuando sea necesario
      let lineIndex = 0;
      let primerBloque = true;

      while (lineIndex < todasLasLineas.length) {
        // Espacio disponible en la página actual
        const espacioDisponible = pageHeight - margenInferior - yPos - paddingTop - paddingBottom;
        const maxLineasEnBloque = Math.max(1, Math.floor(espacioDisponible / lineHeight));

        const lineasRestantes = todasLasLineas.length - lineIndex;
        const lineasEnEsteBloque = Math.min(maxLineasEnBloque, lineasRestantes);

        const hayMas = (lineIndex + lineasEnEsteBloque) < todasLasLineas.length;

        // Altura del cuerpo de este bloque
        const alturaContenido = lineasEnEsteBloque * lineHeight;
        const alturaCuerpo = primerBloque
          ? Math.max(altMinima, alturaContenido + paddingTop + paddingBottom)
          : alturaContenido + paddingTop + paddingBottom;

        // Dibujar rectángulo del cuerpo
        doc.rect(x, yPos, ancho, alturaCuerpo);

        // Dibujar las líneas de este bloque
        doc.setFont("helvetica", "normal").setFontSize(fontSize);
        let yTexto = yPos + paddingTop;
        for (let i = 0; i < lineasEnEsteBloque; i++) {
          doc.text(todasLasLineas[lineIndex + i], x + 4, yTexto);
          yTexto += lineHeight;
        }

        yPos += alturaCuerpo;
        lineIndex += lineasEnEsteBloque;
        primerBloque = false;

        // Si quedan más líneas, hacer salto de página
        if (hayMas) {
          doc.addPage();
          numeroPaginaRef.value++;
          await drawHeader(numeroPaginaRef.value);
          yPos = 40; // posición inicial estándar en nueva página

          // Header gris de continuación
          doc.setFillColor(196, 196, 196);
          doc.rect(x, yPos, ancho, altHeaderGris, 'FD');
          doc.setFont("helvetica", "bold").setFontSize(9);
          doc.text(titulo + " (CONTINUACIÓN)", x + 2, yPos + 3.5);
          yPos += altHeaderGris;
        }
      }

      return yPos;
    };
    const numeroPaginaRef = { value: numeroPagina };
    const paginaAntesObs = numeroPaginaRef.value;
    // --- Observaciones ---
    yPos2 = await dibujarSeccionPaginada(
      doc,
      "III. OBSERVACIONES",
      "",
      x2, yPos2, ancho2,
      drawHeader,
      numeroPaginaRef,
      50
    );
    const cambioPagina = numeroPaginaRef.value > paginaAntesObs;
    numeroPagina = numeroPaginaRef.value;

    // === FOOTER PÁGINA 2 ===
    let yPos3;

    if (cambioPagina) {
      // Observaciones ya generó una nueva página (página 3) y dejó yPos2 con la posición correcta
      // Continuar en esa misma página, sin footer de página 2 ni addPage nuevo
      yPos3 = yPos2;
    } else {
      // Observaciones cupo en página 2, footer normal y nueva página para recomendaciones
      footerTR(doc, { footerData: data });

      doc.addPage();
      numeroPagina++;
      await drawHeader(numeroPagina);
      yPos3 = 40;
    }

    // --- Recomendaciones ---
    const recomendacionesPag3 = Recomendaciones2.join('\n');
    const numeroPaginaRef3 = { value: numeroPagina };

    yPos3 = await dibujarSeccionPaginada(doc, "IV. RECOMENDACIONES", recomendacionesPag3, x2, yPos3, ancho2, drawHeader, numeroPaginaRef3);
    numeroPagina = numeroPaginaRef3.value;

    yPos3 += 3;

    // --- Restricciones ---
    const restricciones = String(data.restriccionesDescripcion ?? "");
    const numeroPaginaRef4 = { value: numeroPagina };

    yPos3 = await dibujarSeccionPaginada(doc, "V. RESTRICCIONES", "", x2, yPos3, ancho2, drawHeader, numeroPaginaRef4);
    numeroPagina = numeroPaginaRef4.value;
    yPos3 += 3;

    // --- Otros examenes ---
    const otrosExamenes = String(data.otrosExamenesRx ?? "");
    const numeroPaginaRef5 = { value: numeroPagina };
    yPos3 = await dibujarSeccionPaginada(doc, "VI. OTROS EXÁMENES", "", x2, yPos3, ancho2, drawHeader, numeroPaginaRef5);
    numeroPagina = numeroPaginaRef5.value;
    yPos3 += 3;

    // --- Apto para trabajar ---
    const altApto = filaDP;
    doc.setFillColor(196, 196, 196);
    doc.rect(x2, yPos3, ancho2, altHeaderGris, 'FD');
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("VII. APTO PARA TRABAJAR", x2 + 2, yPos3 + 3.5);
    yPos3 += altHeaderGris;

    doc.rect(x2, yPos3, ancho2, altApto);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(data.apto ? "APTO" : data.aptoConRestriccion ? "APTO CON RESTRICCION" : data.noApto ? "NO APTO" : "", x2 + 2, yPos3 + 4);
    yPos3 += altApto;

    yPos3 += 3;

    // --- Bloque FIRMAS ---
    doc.setFillColor(196, 196, 196);
    doc.rect(x2, yPos3, ancho2, altHeaderGris, 'FD');
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("VIII. FIRMAS", x2 + 2, yPos3 + 3.5);
    yPos3 += altHeaderGris;

    const altFirma = 45;
    doc.rect(x2, yPos3, ancho2, altFirma);
    const firmaLineaY = yPos3 + 30;
    const firmaLineaX1 = x2 + (ancho2 / 2) - 25;
    const firmaLineaX2 = x2 + (ancho2 / 2) + 25;

    // Colocar firma SOBRE la línea (antes de dibujar la línea para que no la tape)
    const firmaUrl = getSign(data, "SELLOFIRMA");
    if (firmaUrl && firmaUrl !== "Sin registro") {
      try {
        const imgW = 40;
        const imgH = 16;
        const imgX = x2 + (ancho2 / 2) - (imgW / 2); // centrado horizontalmente
        const imgY = firmaLineaY - imgH - 1;          // justo encima de la línea

        doc.addImage(firmaUrl, "PNG", imgX, imgY, imgW, imgH);
      } catch (e) {
        console.error("Error adding signature image", e);
      }
    }

    // Dibujar la línea (encima de la firma si se solapa, queda mejor)
    doc.line(firmaLineaX1, firmaLineaY, firmaLineaX2, firmaLineaY);
    doc.setFont("helvetica", "bold").setFontSize(8);
    //doc.text("Nombre:", firmaLineaX1, firmaLineaY + 5);
    //doc.setFont("helvetica", "normal").setFontSize(8);
    //doc.text(data.nombreMedico || "", firmaLineaX1 + 18, firmaLineaY + 5);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Firma del Médico", x2 + ancho2 / 2, firmaLineaY + 10, { align: "center" });
    yPos3 += altFirma;

    // === FOOTER PÁGINA 3 ===
    footerTR(doc, { footerData: data });
  }

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

function footerTR(doc, datos) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  // Aumenta el margen inferior si hace falta (ej. 30 en lugar de 20)
  const marginBottom = 15; // default sin cambios
  // Posición base para el footer
  const offsetY = Number((datos && typeof datos === 'object' ? datos.footerOffsetY : 0) ?? 0); // opcional
  const baseY = pageHeight - marginBottom + offsetY;

  // Calcular el ancho total del contenido del footer para centrarlo
  const contenidoAncho = 180; // Ancho aproximado del contenido
  const inicioX = (pageWidth - contenidoAncho) / 2; // Centrar el contenido

  // Línea divisora púrpura antes del footer (centrada)
  const lineY = baseY - 3.6; // 5mm antes del contenido del footer
  doc.setDrawColor(52, 2, 153); // Color #340299 en RGB
  doc.setLineWidth(0.5); // Grosor de la línea
  doc.line(inicioX, lineY, inicioX + contenidoAncho, lineY); // Línea horizontal centrada

  // Datos de prueba para el footer (si no se pasan datos)
  const defaultFooter = {
    dir_tru_pierola: "- Sede Trujillo: Av. Nicolas de Piérola N°1106 Urb. San Fernando",
    dir_huamachuco: "- Sede Huamachuco: Jr. Leoncio Prado N°786",
    dir_huancayo: "- Sede Huancayo: Av. Huancavelica N°2225 - Distrito El Tambo",
    dir_trujillo: "Cl.Guillermo Prescott N°127 Urb. Sto. Dominguito",
    cel_trujillo_pie: "964385075",
    cel_huamachuco: "990094744-969603777",
    email_tru_pierola: "admision@horizontemedic.com",
    email_huancayo: "admision.huancayo@horizontemedic.com",
    telf_tru_pierola: "044-666120",
    telf_huamachuco: "044-348070",
    telf_huancayo: "064-659554"
  };
  const datosFooter = {
    ...defaultFooter,
    ...(datos && typeof datos === 'object' && datos.footerData ? datos.footerData : {})
  };

  // Ajustamos la fuente a normal (no negrita) y color a negro
  const fontSize = (datos && typeof datos === 'object' && datos.fontSize) ? datos.fontSize : 7;
  doc.setFont("helvetica", "normal").setFontSize(fontSize);
  doc.setTextColor(0, 0, 0);

  // Crear líneas de texto centradas
  const lineas = [
    `${datosFooter?.dir_tru_pierola || ""} Cel. ${datosFooter?.cel_trujillo_pie || ""} ${datosFooter?.email_tru_pierola || ""} Telf. ${datosFooter?.telf_tru_pierola || ""}`,
    `${datosFooter?.dir_huamachuco || ""} Cel. ${datosFooter?.cel_huamachuco || ""} ${datosFooter?.email_huancayo || ""} Telf. ${datosFooter?.telf_huamachuco || ""}`,
    `${datosFooter?.dir_huancayo || ""} Telf. ${datosFooter?.telf_huancayo || ""}`,
    `${datosFooter?.dir_trujillo || ""} Telf. 044-767608`
  ];

  // Dibujar cada línea centrada
  let yPos = baseY;
  lineas.forEach((linea) => {
    if (linea.trim()) {
      doc.text(linea, pageWidth / 2, yPos, { align: "center" });
      yPos += 3;
    }
  });
}

