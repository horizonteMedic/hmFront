import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { getSign } from "../../utils/helpers.js";
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';

export default function Aptitud_AgroindustrialH(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Datos de prueba por defecto
  const datosPrueba = {
    numeroHistoria: "96639",
    tipoExamen: "PRE-OCUPACIONAL",
    apellidosNombres: "HADY KATHERINE CASTILLO PLASENCIA",
    documentoIdentidad: "72384273",
    genero: "FEMENINO",
    edad: "31 AÑOS",
    empresa: "MINERA BOROO MISQUICHILCA S.A.C",
    contratista: "LIMALA S.A.C MINERA BOROO MMINERA BOROO MMINERA",
    puestoPostula: "ASISTENTE ADMINISTRATIVA",
    ocupacionActual: "ADMINISTRACION",
    fechaExamen: "04/11/2024",
    // Datos de color
    color: 1,
    codigoColor: "#008f39",
    textoColor: "F",
    // Datos adicionales para header
    numeroFicha: "99164",
    sede: "Trujillo-Pierola Nicoldo de Pierola",
    // Datos de conclusiones
    conclusiones: [
      "INFORME RADIOGRAFICO: Radiografía de tórax realizada en proyección posteroanterior.",
      "CONCLUCIONES: RADIOAGRAFIA DE COLUMNA LUMBOSACRA AP-L",
      "ODONTOGRAMA: Paciente con varias piezas tratadas. Se recomienda seguimiento. prueba Campos claros, sin alteraciones pruebaHilios normales, sin adenopatíasSenos costofrénicos libresCampos pulmonares bien aireadosMediastinos sin desplazamientoSilueta cardiaca normalEstructuras óseas conservadasRadiografía de tórax sin hallazgos patológicos evidentes-RADIOGRAFIA: Paciente sin síntomas respiratorios al momento del examen",
    ],
    // Datos de aptitud
    apto: "APTO", // Caso APTO sin restricciones
    restricciones: "NINGUNO.", // No se usa cuando es APTO, se muestra "SIN RESTRICCIONES"
    recomendaciones: [
      "Se recomienda seguimiento médico cada 6 meses.",
      "Evitar exposición prolongada a ruidos superiores a 85 dB.",
      "Usar equipo de protección personal según protocolo de seguridad.",
      "Se recomienda seguimiento médico cada 6 meses.",
      "Evitar exposición prolongada a ruidos superiores a 85 dB.",
      "Usar equipo de protección personal según protocolo de seguridad.",
      "Se recomienda seguimiento médico cada 6 meses.",
      "Evitar exposición prolongada a ruidos superiores a 85 dB.",
      "Usar equipo de protección personal según protocolo de seguridad.",
    ]
  };

  const datosReales = {
    numeroHistoria: String(data.norden ?? ""), //revisar - podría ser norden del JSON
    tipoExamen: String(data.nombreExamen ?? ""),
    apellidosNombres: String((data.apellidosPaciente ?? "") + " " + (data.nombresPaciente ?? "")).trim(),
    documentoIdentidad: String(data.dniPaciente ?? ""),
    genero: String(data.sexoPaciente ?? ""),
    edad: String(data.edadPaciente ?? ""),
    empresa: String(data.empresa ?? ""),
    contratista: String(data.contrata ?? ""),
    puestoPostula: String(data.cargoPaciente ?? ""),
    ocupacionActual: String(data.ocupacionPaciente ?? ""),
    fechaExamen: formatearFechaCorta(data.fechaDesde ?? ""), //revisar - podría ser fechaHasta
    // Datos de color
    color: data.color || 1,
    codigoColor: data.codigoColor || "#008f39",
    textoColor: data.textoColor || "F",
    // Datos adicionales para header
    numeroFicha: String(data.norden ?? ""), //revisar - usando norden como numeroFicha
    sede: data.sede || data.nombreSede || "",
    // Datos de conclusiones
    conclusiones: data.conclusiones ? data.conclusiones.split('\n').filter(rec => rec.trim() !== '') : [],
    // Datos de aptitud
    apto: data.apto ? "APTO" : data?.noApto ? "NO APTO" : data.aptoConRestriccion ? "APTO CON RESTRICCIÓN" : "", //revisar - el JSON tiene boolean, necesita conversión
    restricciones: data.restriccionesDescripcion || "",
    recomendaciones: data.recomendaciones ? data.recomendaciones.split('\n').filter(rec => rec.trim() !== '') : [],
    fechaDesde: formatearFechaCorta(data.fechaDesde ?? ""),
    fechaHasta: formatearFechaCorta(data.fechaHasta ?? ""),
  };

  // Usar datos reales si existen, sino usar datos de prueba
  const datosFinales = data && data.norden ? datosReales : datosPrueba;

  // Función para determinar qué checkbox está marcado
  const getAptitudCheckbox = (apto) => {
    switch (apto) {
      case "APTO":
        return { apto: true, aptoConRestriccion: false, noApto: false };
      case "APTO CON RESTRICCIÓN":
        return { apto: false, aptoConRestriccion: true, noApto: false };
      case "NO APTO":
        return { apto: false, aptoConRestriccion: false, noApto: true };
      default:
        return { apto: false, aptoConRestriccion: true, noApto: false };
    }
  };

  const aptitudCheckboxes = getAptitudCheckbox(datosFinales.apto);

  // Debug: Verificar los valores
  console.log("Valor de apto:", datosFinales.apto);
  console.log("Checkboxes resultantes:", aptitudCheckboxes);

  // === LOGO ===
  // Prueba: Simulando hoja con membrete (logo se oculta)
  const logoY = CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

  // === HEADER ===
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("CERTIFICADO DE APTITUD MEDICO OCUPACIONAL", pageW / 2, 32, { align: "center" });

  // Número de Ficha y Página
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Nro de ficha: ", pageW - 53, 15);

  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(datosFinales.numeroFicha, pageW - 33, 15);
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Calcular ancho del texto de sede para ajustar posición
  const textoSede = "Sede: " + datosFinales.sede;
  const anchoTextoSede = doc.getTextWidth(textoSede);
  const posicionSede = Math.max(15, pageW - 16 - anchoTextoSede); // Termina justo antes del bloque de color (30mm del borde derecho)

  doc.text(textoSede, posicionSede, 20);
  doc.text("Pag. 01", pageW - 53, 25);

  // === BLOQUE DE COLOR ===
  drawColorBox(doc, {
    color: datosFinales.codigoColor,           // Color de la letra y línea
    text: datosFinales.textoColor,             // Letra a mostrar (ej: "F")
    x: pageW - 30,                             // Posición X (30mm del borde derecho)
    y: 10,                                     // Posición Y (alineado con header)
    size: 22,                                  // Tamaño del área total (22x22mm)
    showLine: true,                            // Mostrar línea de color
    fontSize: 30,                              // Tamaño de la letra
    textPosition: 0.9                          // Posición de la letra (0.9 = cerca de la línea)
  });

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
    const alturaNecesaria = lineas * lineHeight + 4;
    return Math.max(filaAltura, alturaNecesaria); // Mínimo la altura base
  };

  // Función para dibujar texto con salto de línea automático
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo, fontSize = 9) => {
    if (!texto || texto.trim() === '') return;

    doc.setFontSize(fontSize);
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
  const dibujarTextoPegado = (texto, x, y, anchoMaximo, fontSize = 7) => {
    if (!texto || texto.trim() === '') return y;

    doc.setFontSize(fontSize);
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

  // Calcular alturas dinámicas para cada fila
  const alturaFila1 = filaAltura; // Primera fila fija (N° Historia, Tipo de Examen)
  const alturaFila2 = filaAltura; // Segunda fila fija (CERTIFICA)
  const alturaFila3 = calcularAlturaTexto(datosFinales.apellidosNombres, 130); // NOMBRES Y APELLIDOS (ancho disponible después de "NOMBRES Y APELLIDOS:")
  const alturaFila4 = filaAltura; // Cuarta fila fija (DNI, GÉNERO, EDAD)
  const alturaFila5 = Math.max(
    calcularAlturaTexto(datosFinales.empresa, 70), // Ancho disponible para EMPRESA (desde posición 20 hasta 90)
    calcularAlturaTexto(datosFinales.contratista, 70) // Ancho disponible para CONTRATISTA (desde posición 110 hasta 180)
  ); // EMPRESA y CONTRATISTA
  const alturaFila6 = Math.max(
    calcularAlturaTexto(datosFinales.puestoPostula, 70), // Ancho disponible para PUESTO
    calcularAlturaTexto(datosFinales.ocupacionActual, 70) // Ancho disponible para OCUPACIÓN
  ) + 1; // PUESTO y OCUPACIÓN (con 1mm de espacio extra)

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

  // Cuarta fila (DNI, GÉNERO, EDAD) - 3 columnas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila4); // Línea izquierda
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + alturaFila4); // Primera división
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + alturaFila4); // Segunda división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila4); // Línea derecha
  yPos += alturaFila4;

  // Quinta fila (EMPRESA, CONTRATISTA) - 2 columnas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila5); // Línea izquierda
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + alturaFila5); // División central
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila5); // Línea derecha
  yPos += alturaFila5;

  // Sexta fila (PUESTO, OCUPACIÓN) - 2 columnas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila6); // Línea izquierda
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + alturaFila6); // División central
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila6); // Línea derecha

  // === CONTENIDO DE LA TABLA ===

  // Calcular posiciones Y dinámicas
  let yTexto = tablaInicioY;

  // Primera fila: N° Historia Clínica y Tipo de Examen
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("N° HISTORIA CLINICA :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.numeroHistoria, tablaInicioX + 47, yTexto + 4);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("TIPO DE EXAMEN :", tablaInicioX + 92, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.tipoExamen, tablaInicioX + 137, yTexto + 4);
  yTexto += alturaFila1;

  // Segunda fila: Certifica que el Sr.(a) - ocupa toda la fila
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CERTIFICA que el Sr.(a)", tablaInicioX + tablaAncho / 2, yTexto + 4, { align: "center" });
  yTexto += alturaFila2;

  // Tercera fila: Nombres y Apellidos
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("NOMBRES Y APELLIDOS:", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 55, yTexto + 4, 130);
  yTexto += alturaFila3;

  // Cuarta fila: DNI, Género, Edad (3 columnas iguales)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DNI :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 15, yTexto + 4);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("GENERO :", tablaInicioX + 62, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.genero, tablaInicioX + 80, yTexto + 4);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("EDAD :", tablaInicioX + 122, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.edad, tablaInicioX + 135, yTexto + 4);
  yTexto += alturaFila4;

  // Quinta fila: Empresa y Contratista
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("EMPRESA :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 20, yTexto + 4, 70);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CONTRATISTA :", tablaInicioX + 92, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.contratista, tablaInicioX + 117, yTexto + 4, 70);
  yTexto += alturaFila5;

  // Sexta fila: Puesto al que Postula y Ocupación Actual
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("PUESTO POSTULA :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.puestoPostula, tablaInicioX + 35, yTexto + 4, 70);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("OCUPACION :", tablaInicioX + 92, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.ocupacionActual, tablaInicioX + 117, yTexto + 4, 70);
  yTexto += alturaFila6;


  yTexto += 8; // Espacio después de la fecha

  // === TÍTULO PRINCIPAL ===
  if (datosFinales.conclusiones && datosFinales.conclusiones.length > 0) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("HE PASADO EXAMEN MÉDICO EN POLICLÍNICO HORIZONTE MEDIC, TENIENDO COMO:", 15, yTexto);
    yTexto += 2;
  }

  // === SECCIÓN DE CONCLUSIONES ===
  if (datosFinales.conclusiones && datosFinales.conclusiones.length > 0) {
    const marcoInicioX = 15;
    const marcoInicioY = yTexto;
    const marcoAncho = 180;

    // Calcular altura total necesaria para todas las conclusiones
    let alturaTotalConclusiones = 12; // Solo subtítulo
    datosFinales.conclusiones.forEach((conclusion) => {
      const alturaConclusion = calcularAlturaTexto(conclusion, 170, 9);
      alturaTotalConclusiones += alturaConclusion;
    });
    alturaTotalConclusiones += 10; // Espacio extra para el marco (aumentado)

    // Dibujar marco
    doc.rect(marcoInicioX, marcoInicioY, marcoAncho, alturaTotalConclusiones);

    // Subtítulo
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("CONCLUSIONES:", marcoInicioX + 5, yTexto + 6);
    yTexto += 12;

    // Dibujar cada conclusión pegada
    let yPosConclusiones = yTexto;
    datosFinales.conclusiones.forEach((conclusion) => {
      doc.setFont("helvetica", "normal").setFontSize(7);
      yPosConclusiones = dibujarTextoPegado(conclusion, marcoInicioX + 5, yPosConclusiones, 170, 7);
    });

    // Actualizar yTexto con la posición final del marco
    yTexto = marcoInicioY + alturaTotalConclusiones + 5; // Espacio después del marco
  }

  // === TABLA DE APTITUD ===
  yTexto -= 2; // Sin espacio antes de la tabla de aptitud (subida 5mm)

  const tablaAptitudInicioX = 15;
  const tablaAptitudInicioY = yTexto;
  const tablaAptitudAncho = 180;
  const filaAptitudAltura = 6; //revisaaaaaaaaaaaaaaaaaaaaaaaaaa

  // Calcular altura necesaria para recomendaciones
  let alturaRecomendaciones = filaAptitudAltura; // Altura base de la fila
  if (datosFinales.recomendaciones && datosFinales.recomendaciones.length > 0) {
    let recomendacionesArray = Array.isArray(datosFinales.recomendaciones)
      ? datosFinales.recomendaciones
      : [datosFinales.recomendaciones];
    // recomendacionesArray = recomendacionesArray.slice(0, 14);
    // Calcular altura basada en número de recomendaciones (6 puntos por recomendación)
    alturaRecomendaciones = Math.max(filaAptitudAltura, (recomendacionesArray.length * 3.5) + 2);
  }

  // Calcular altura de la tabla de aptitud (más compacta)
  const alturaTablaAptitud = (filaAptitudAltura * 4) + alturaRecomendaciones; // 4 filas fijas (incluyendo fecha) + fila de recomendaciones dinámica + espacio mínimo reducido

  // Dibujar marco de la tabla de aptitud
  doc.rect(tablaAptitudInicioX, tablaAptitudInicioY, tablaAptitudAncho, alturaTablaAptitud);

  // Líneas verticales
  doc.line(tablaAptitudInicioX + 85, tablaAptitudInicioY, tablaAptitudInicioX + 85, tablaAptitudInicioY + (filaAptitudAltura * 3)); // División principal solo hasta NO APTO
  doc.line(tablaAptitudInicioX + 95, tablaAptitudInicioY, tablaAptitudInicioX + 95, tablaAptitudInicioY + (filaAptitudAltura * 3)); // División para checkboxes solo hasta NO APTO

  // Línea vertical en el medio de la fila de recomendaciones
  const yRecomendaciones = tablaAptitudInicioY + (3 * filaAptitudAltura);
  doc.line(tablaAptitudInicioX + 120, yRecomendaciones, tablaAptitudInicioX + 120, tablaAptitudInicioY + alturaTablaAptitud);



  // Líneas horizontales
  for (let i = 1; i <= 3; i++) {
    const y = tablaAptitudInicioY + (i * filaAptitudAltura);
    // Primeras 3 líneas horizontales solo hasta la mitad (división vertical principal)
    doc.line(tablaAptitudInicioX, y, tablaAptitudInicioX + 95, y);
  }

  // Línea horizontal de separación para RECOMENDACIONES
  const yLineaRecomendaciones = tablaAptitudInicioY + (3 * filaAptitudAltura);
  doc.line(tablaAptitudInicioX, yLineaRecomendaciones, tablaAptitudInicioX + tablaAptitudAncho, yLineaRecomendaciones);

  // Línea horizontal de separación para FECHA DE EXAMEN
  const yLineaFecha = tablaAptitudInicioY + (3 * filaAptitudAltura) + alturaRecomendaciones;
  doc.line(tablaAptitudInicioX, yLineaFecha, tablaAptitudInicioX + tablaAptitudAncho, yLineaFecha);

  // Contenido de la tabla de aptitud
  let yAptitud = tablaAptitudInicioY;

  // Primera fila: APTO (para el puesto en el que trabaja)
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("APTO (para el puesto en el que trabaja)", tablaAptitudInicioX + 5, yAptitud + 4);
  console.log("Dibujando checkbox APTO:", aptitudCheckboxes.apto);
  if (aptitudCheckboxes.apto) {
    doc.setFont("helvetica", "bold").setFontSize(9); // Solo la X más grande y negrita
    doc.text("X", tablaAptitudInicioX + 89, yAptitud + 4); // Checkbox marcado
    console.log("Checkbox APTO marcado");
  }
  yAptitud += filaAptitudAltura;

  // Segunda fila: APTO CON RESTRICCIÓN (para el puesto en el que trabaja)
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("APTO CON RESTRICCIÓN (para el puesto en el que trabaja)", tablaAptitudInicioX + 5, yAptitud + 4);
  if (aptitudCheckboxes.aptoConRestriccion) {
    doc.setFont("helvetica", "bold").setFontSize(9); // Solo la X más grande y negrita
    doc.text("X", tablaAptitudInicioX + 89, yAptitud + 4); // Checkbox marcado
  }
  yAptitud += filaAptitudAltura;

  // Tercera fila: NO APTO (para el puesto en el que trabaja o postula)
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NO APTO (para el puesto en el que trabaja o postula)", tablaAptitudInicioX + 5, yAptitud + 4);
  if (aptitudCheckboxes.noApto) {
    doc.setFont("helvetica", "bold").setFontSize(9); // Solo la X más grande y negrita
    doc.text("X", tablaAptitudInicioX + 89, yAptitud + 4); // Checkbox marcado
  }
  yAptitud += filaAptitudAltura;


  // Cuarta fila: RECOMENDACIONES
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("RECOMENDACIONES:", tablaAptitudInicioX + 5, yRecomendaciones + 4);

  // Mostrar recomendaciones dinámicamente si existen
  if (datosFinales.recomendaciones && datosFinales.recomendaciones.length > 0) {
    doc.setFont("helvetica", "normal").setFontSize(6);

    // Convertir a array si es string
    let recomendacionesArray = Array.isArray(datosFinales.recomendaciones)
      ? datosFinales.recomendaciones
      : [datosFinales.recomendaciones];

    // Limitar a 10 recomendaciones máximo
    // recomendacionesArray = recomendacionesArray.slice(0, 14);

    let yPosicion = yRecomendaciones + 10;
    recomendacionesArray.forEach((recomendacion, index) => {
      if (recomendacion && recomendacion.trim()) {
        // Agregar numeración si hay más de una recomendación
        const textoRecomendacion = recomendacionesArray.length > 1
          ? `${index + 1}. ${recomendacion.trim()}`
          : recomendacion.trim();

        // Dibujar cada recomendación en su propia fila
        doc.text(textoRecomendacion, tablaAptitudInicioX + 5, yPosicion);

        // Incrementar posición para la siguiente fila
        yPosicion += 3; // Espaciado mayor entre filas para mejor legibilidad
      }
    });
  }

  // Sección de RESTRICCIONES (en la parte derecha) - alineado con APTO
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("RESTRICCIONES:", tablaAptitudInicioX + 98, tablaAptitudInicioY + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);

  // Mostrar restricciones dinámicamente
  if (datosFinales.apto === "APTO") {
    // Si es APTO, mostrar "SIN RESTRICCIONES"
    doc.text("- SIN RESTRICCIONES", tablaAptitudInicioX + 98, tablaAptitudInicioY + 9);
  } else if (datosFinales.restricciones && datosFinales.restricciones !== "NINGUNO.") {
    // Si hay restricciones, mostrarlas con salto de línea
    const restricciones = datosFinales.restricciones.split('\n');
    let yRestricciones = tablaAptitudInicioY + 9;
    restricciones.forEach((restriccion) => {
      if (restriccion.trim()) {
        doc.setFont("helvetica", "normal").setFontSize(5);
        doc.text(`- ${restriccion.trim()}`, tablaAptitudInicioX + 97, yRestricciones - 1);
        yRestricciones += 3; // Espacio entre líneas
        doc.setFont("helvetica", "normal").setFontSize(8);
      }
    });
  } else {
    // Si no hay restricciones o es "NINGUNO", mostrar "- NINGUNO."
    doc.text("- NINGUNO.", tablaAptitudInicioX + 98, tablaAptitudInicioY + 9);
  }

  // Agregar firma en la sección de restricciones si existe
  // const firmaUrl = getSign(data, "SELLOFIRMA");
  // if (firmaUrl) {
  //   try {
  //     // Obtener la imagen de la firma
  //     const img = new Image();
  //     img.onload = function () {
  //       // Calcular dimensiones para que la firma se ajuste al espacio disponible
  //       const maxWidth = 70; // Ancho máximo disponible en la columna derecha
  //       const maxHeight = 20; // Altura máxima
  //       let imgWidth = img.width;
  //       let imgHeight = img.height;

  //       // Calcular escala para mantener proporción
  //       const scaleX = maxWidth / imgWidth;
  //       const scaleY = maxHeight / imgHeight;
  //       const scale = Math.min(scaleX, scaleY);

  //       const finalWidth = imgWidth * scale;
  //       const finalHeight = imgHeight * scale;

  //       // Posicionar la firma en la parte inferior derecha de la sección de restricciones
  //       const xFirma = tablaAptitudInicioX + 98 + (maxWidth - finalWidth) / 2;
  //       const yFirma = tablaAptitudInicioY + alturaRecomendaciones - finalHeight - 2;

  //       doc.addImage(img, 'PNG', tablaAptitudInicioX + 123, yFechaTexto + 4, 50, 20);
  //     };
  //     img.src = firmaUrl;
  //   } catch (error) {
  //     console.error('Error al cargar la firma:', error);
  //   }
  // }


  // Fila de FECHA DE EXAMEN (después de recomendaciones) - 3 columnas
  const yFechaTexto = tablaAptitudInicioY + (3 * filaAptitudAltura) + alturaRecomendaciones;

  // Primera columna: Fecha desde
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha desde :", tablaAptitudInicioX + 5, yFechaTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaDesde, tablaAptitudInicioX + 25, yFechaTexto + 4);

  // Segunda columna: Fecha hasta
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha hasta :", tablaAptitudInicioX + 65, yFechaTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaHasta, tablaAptitudInicioX + 85, yFechaTexto + 4);

  // Tercera columna: Sello y firma
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("SELLO Y FIRMA DE MEDICO QUE CERTIFICA", tablaAptitudInicioX + 123, yFechaTexto + 4);

  try {
    const firmaMedicoImg = getSign(data, "SELLOFIRMA");
    doc.addImage(firmaMedicoImg, "PNG", tablaAptitudInicioX + 130, yFechaTexto - 40, 50 * 0.8, 40 * 0.8);
  } catch (e) {
    console.error('Error al cargar la firma:', e);
  }

  yTexto += alturaTablaAptitud + 3; // Espacio mínimo después de la tabla

  // === FOOTER ===
  // Llamar al footer (los datos de prueba están dentro del componente)
  footerTR(doc);

  // === IMPRIMIR ===
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
