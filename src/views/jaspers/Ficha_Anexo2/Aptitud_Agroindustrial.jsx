import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { getSign } from "../../utils/helpers";
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';

export default function Aptitud_AgroindustrialH(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  const datosFinales = {
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
    // Datos de conclusiones - eliminar duplicados
    conclusiones: data.conclusiones ? 
      [...new Set(data.conclusiones.split('\n').filter(rec => rec.trim() !== ''))] : [],
    // Datos de aptitud
    apto: data.apto ? "APTO" : data?.noApto ? "NO APTO" : data.aptoConRestriccion ? "APTO CON RESTRICCIÓN" : "", //revisar - el JSON tiene boolean, necesita conversión
    restricciones: data.restriccionesDescripcion ? 
      [...new Set(data.restriccionesDescripcion.split('\n').filter(rec => rec.trim() !== ''))].join('\n') : "",
    recomendaciones: data.recomendaciones ? 
      (Array.isArray(data.recomendaciones) ? 
        [...new Set(data.recomendaciones.filter(rec => rec && rec.trim() !== ''))] : 
        [...new Set(data.recomendaciones.split('\n').filter(rec => rec.trim() !== ''))]) : 
      [],
    fechaDesde: formatearFechaCorta(data.fechaDesde ?? ""),
    fechaHasta: formatearFechaCorta(data.fechaHasta ?? ""),
  };


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
        return { apto: false, aptoConRestriccion: false, noApto: false };
    }
  };

  const aptitudCheckboxes = getAptitudCheckbox(datosFinales.apto);

  // Debug: Verificar los valores
  console.log("Valor de apto:", datosFinales.apto);
  console.log("Checkboxes resultantes:", aptitudCheckboxes);
  console.log("Conclusiones:", datosFinales.conclusiones);
  console.log("Recomendaciones:", datosFinales.recomendaciones);

  // === LOGO ===
  // Prueba: Simulando hoja con membrete (logo se oculta)
  CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

  // === HEADER ===
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("CERTIFICADO DE APTITUD MEDICO OCUPACIONAL", pageW / 2, 32, { align: "center" });

  // Número de Ficha y Página
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Nro de ficha: ", pageW - 53, 15);

  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(datosFinales.numeroFicha, pageW - 33, 15);
  doc.setFont("helvetica", "normal").setFontSize(7);

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
  const tablaInicioY = 35;
  const tablaAncho = 180;
  const filaAltura = 5;

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
  const dibujarTextoPegado = (texto, x, y, anchoMaximo, fontSize = 9) => {
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

  // Función para simular dibujarTextoPegado sin dibujar (para calcular altura)
  const simularDibujarTextoPegado = (texto, y, anchoMaximo, fontSize = 9) => {
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
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("N° HISTORIA CLINICA :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.numeroHistoria, tablaInicioX + 47, yTexto + 4);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("TIPO DE EXAMEN :", tablaInicioX + 92, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.tipoExamen, tablaInicioX + 137, yTexto + 4);
  yTexto += alturaFila1;

  // Segunda fila: Certifica que el Sr.(a) - ocupa toda la fila
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("CERTIFICA que el Sr.(a)", tablaInicioX + tablaAncho / 2, yTexto + 4, { align: "center" });
  yTexto += alturaFila2;

  // Tercera fila: Nombres y Apellidos
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("NOMBRES Y APELLIDOS:", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(6);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 55, yTexto + 4, 130, 6);
  yTexto += alturaFila3;

  // Cuarta fila: DNI, Género, Edad (3 columnas iguales)
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("DNI :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 15, yTexto + 4);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("GENERO :", tablaInicioX + 62, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.genero, tablaInicioX + 80, yTexto + 4);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("EDAD :", tablaInicioX + 122, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.edad, tablaInicioX + 135, yTexto + 4);
  yTexto += alturaFila4;

  // Quinta fila: Empresa y Contratista
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("EMPRESA :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(6);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 20, yTexto + 4, 70, 6);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("CONTRATISTA :", tablaInicioX + 92, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(6);
  dibujarTextoConSaltoLinea(datosFinales.contratista, tablaInicioX + 117, yTexto + 4, 70, 6);
  yTexto += alturaFila5;

  // Sexta fila: Puesto al que Postula y Ocupación Actual
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("PUESTO POSTULA :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(6);
  dibujarTextoConSaltoLinea(datosFinales.puestoPostula, tablaInicioX + 35, yTexto + 4, 70, 6);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("OCUPACION :", tablaInicioX + 92, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(6);
  dibujarTextoConSaltoLinea(datosFinales.ocupacionActual, tablaInicioX + 117, yTexto + 4, 70, 6);
  yTexto += alturaFila6;


  yTexto += 4; // Espacio después de la fecha

  // === TÍTULO PRINCIPAL ===
  if (datosFinales.conclusiones && datosFinales.conclusiones.length > 0) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("HE PASADO EXAMEN MÉDICO EN POLICLÍNICO HORIZONTE MEDIC, TENIENDO COMO:", 15, yTexto);
    yTexto += 2;
  }

  // === SECCIÓN DE CONCLUSIONES ===
  if (datosFinales.conclusiones && datosFinales.conclusiones.length > 0) {
    const marcoInicioX = 15;
    const marcoInicioY = yTexto;
    const marcoAncho = 180;

    // Calcular altura total necesaria para todas las conclusiones
    const alturaSubtitulo = 10; // espacio que ocupa el subtítulo "CONCLUSIONES:"
    
    // Primero dibujar el subtítulo
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("CONCLUSIONES:", marcoInicioX + 2, yTexto + 5);
    let yPosConclusiones = yTexto + 10;
    
    // Dibujar cada conclusión y calcular la posición final real
    datosFinales.conclusiones.forEach((conclusion) => {
      doc.setFont("helvetica", "normal").setFontSize(6.5);
      yPosConclusiones = dibujarTextoPegado(conclusion, marcoInicioX + 2, yPosConclusiones, 170, 6.5);
    });
    
    // Calcular altura total basada en la posición real del texto + 1mm de padding
    const alturaTotalConclusiones = (yPosConclusiones - yTexto) + 1;

    // Dibujar marco
    doc.rect(marcoInicioX, marcoInicioY, marcoAncho, alturaTotalConclusiones);

    // Actualizar yTexto con la posición final del marco
    yTexto = marcoInicioY + alturaTotalConclusiones;
  }

  // === TABLA DE APTITUD ===
  yTexto += 3; // Pequeño espacio para no solaparse con el marco de conclusiones

  const tablaAptitudInicioX = 15;
  const tablaAptitudInicioY = yTexto;
  const tablaAptitudAncho = 180;
  const filaAptitudAltura = 6; // Altura reducida

  // Calcular altura necesaria para recomendaciones en la fila 4 - dinámico
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
        yPosicionSimulada = simularDibujarTextoPegado(textoRecomendacion, yPosicionSimulada, anchoMaximoRecomendaciones, 6);
      }
    });
    // Altura real = posición final + 1mm de padding
    alturaRecomendaciones = Math.max(filaAptitudAltura, yPosicionSimulada + 1);
  }

  // Calcular altura dinámica para la sección de RESTRICCIONES (lado derecho) - igual que conclusiones
  const xRestriccionesDyn = tablaAptitudInicioX + 98;
  const anchoRestriccionesDyn = (tablaAptitudInicioX + tablaAptitudAncho) - xRestriccionesDyn - 5;
  let alturaRestricciones = 4; // incluye el título "RESTRICCIONES:" - reducido
  
  // Procesar restricciones una sola vez
  const restriccionesProcesadas = datosFinales.restricciones && datosFinales.restricciones !== "NINGUNO." 
    ? datosFinales.restricciones.split('\n').filter(r => r.trim())
    : [];
  
  if (datosFinales.apto === "APTO") {
    alturaRestricciones += calcularAlturaTexto("- SIN RESTRICCIONES", anchoRestriccionesDyn, 6);
  } else if (restriccionesProcesadas.length > 0) {
    // Calcular altura total de todas las restricciones
    let alturaTotal = 0;
    restriccionesProcesadas.forEach(r => {
      alturaTotal += calcularAlturaTexto(`- ${r.trim()}`, anchoRestriccionesDyn, 6);
    });
    alturaRestricciones += alturaTotal; // Quitar espacio extra
  } else {
    alturaRestricciones += calcularAlturaTexto("- NINGUNO.", anchoRestriccionesDyn, 6);
  }

  // === VARIABLES DE FIRMA (declarar antes de usar) ===
  const firmaAncho = 50; // Ancho fijo para la firma
  const firmaAlto = 18;  // Alto fijo para la firma (aumentado de 12 a 18)

  // Altura real del bloque superior (izquierda fija 4 filas vs restricciones dinámicas)
  // La fila 4 incluye las recomendaciones, así que usamos su altura específica
  const alturaFila4Aptitud = alturaRecomendaciones; // Usar altura exacta de recomendaciones
  const alturaBloqueSuperior = Math.max((3 * filaAptitudAltura) + alturaFila4Aptitud, alturaRestricciones);

  // Calcular altura de la tabla de aptitud (incluyendo firma)
  const alturaFirma = firmaAlto; // Solo alto de la firma, sin espacio extra
  const alturaTablaAptitud = alturaBloqueSuperior + alturaFirma + filaAptitudAltura; // bloque superior + firma + fila de fecha

  // Dibujar marco de la tabla de aptitud
  doc.rect(tablaAptitudInicioX, tablaAptitudInicioY, tablaAptitudAncho, alturaTablaAptitud);

  // Líneas verticales
  doc.line(tablaAptitudInicioX + 85, tablaAptitudInicioY, tablaAptitudInicioX + 85, tablaAptitudInicioY + (3 * filaAptitudAltura)); // División principal solo hasta la tercera fila
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
  
  // Línea horizontal "mitad" - base para restricciones (se mueve dinámicamente según altura de restricciones)
  const yMitad = tablaAptitudInicioY + alturaRestricciones;
  doc.line(tablaAptitudInicioX + tablaAptitudAncho - 85, yMitad, tablaAptitudInicioX + tablaAptitudAncho, yMitad);

  // === FIRMA SIN RECUADRO (DESPUÉS de la línea mitad) ===
  const firmaX = tablaAptitudInicioX + tablaAptitudAncho - firmaAncho - 15; // Posición X (derecha - 5 puntos más a la izquierda)
  
  // Calcular altura de conclusiones para ajustar posición de firma
  let alturaConclusiones = 0;
  if (datosFinales.conclusiones && datosFinales.conclusiones.length > 0) {
    // Calcular altura real de las conclusiones
    let yPosConclusionesSimulada = 10; // espacio del subtítulo
    datosFinales.conclusiones.forEach((conclusion) => {
      yPosConclusionesSimulada = simularDibujarTextoPegado(conclusion, 0, yPosConclusionesSimulada, 170, 6);
    });
    alturaConclusiones = yPosConclusionesSimulada + 1; // +1mm de padding
  }
  
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
    console.log("Checkbox APTO marcado en azul");
  } else {
    // Si no es APTO, usar estilo normal
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("APTO (para el puesto en el que trabaja)", tablaAptitudInicioX + 2, yAptitud + 4);
  }
  console.log("Dibujando checkbox APTO:", aptitudCheckboxes.apto);
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
    console.log("Checkbox APTO CON RESTRICCIÓN marcado en verde");
  } else {
    // Si no es APTO CON RESTRICCIÓN, usar estilo normal
    doc.setFont("helvetica", "normal").setFontSize(7);
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
    console.log("Checkbox NO APTO marcado en rojo");
  } else {
    // Si no es NO APTO, usar estilo normal
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("NO APTO (para el puesto en el que trabaja o postula)", tablaAptitudInicioX + 2, yAptitud + 4);
  }
  yAptitud += filaAptitudAltura;

  // Cuarta fila: RECOMENDACIONES
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("RECOMENDACIONES:", tablaAptitudInicioX + 2, yAptitud + 4);

    // Mostrar recomendaciones dinámicamente si existen
    if (datosFinales.recomendaciones && datosFinales.recomendaciones.length > 0) {
      console.log("Dibujando recomendaciones:", datosFinales.recomendaciones);
      doc.setFont("helvetica", "normal").setFontSize(6);

    // Ya está procesado como array en datosReales
    let recomendacionesArray = datosFinales.recomendaciones;

    // Limitar a 10 recomendaciones máximo
    recomendacionesArray = recomendacionesArray.slice(0, 10);
    console.log("Array de recomendaciones para dibujar:", recomendacionesArray);

    let yPosicion = yAptitud + 10;
    const anchoMaximoRecomendaciones = 85; // MaxWidth para recomendaciones
    recomendacionesArray.forEach((recomendacion, index) => {
      if (recomendacion && recomendacion.trim()) {
        // Agregar numeración si hay más de una recomendación
        const textoRecomendacion = recomendacionesArray.length > 1
          ? `${index + 1}. ${recomendacion.trim()}`
          : recomendacion.trim();

        // Dibujar cada recomendación con maxWidth y obtener nueva posición
        yPosicion = dibujarTextoPegado(textoRecomendacion, tablaAptitudInicioX + 2, yPosicion, anchoMaximoRecomendaciones, 6);

        // Incrementar posición para la siguiente fila
        yPosicion += 0; // Sin espaciado extra entre filas
      }
    });
  }
  yAptitud += alturaFila4Aptitud; // Usar altura dinámica de la fila 4


  // Sección de RESTRICCIONES (en la parte derecha) - alineado con APTO y crecimiento dinámico
  doc.setFont("helvetica", "bold").setFontSize(6.5);
  doc.text("RESTRICCIONES:", tablaAptitudInicioX + 98, tablaAptitudInicioY + 3);
  doc.setFont("helvetica", "normal").setFontSize(6);

  // Mostrar restricciones dinámicamente
  const xRestricciones = tablaAptitudInicioX + 98;
  const yRestriccionesInicio = tablaAptitudInicioY + 8;
  const anchoRestricciones = (tablaAptitudInicioX + tablaAptitudAncho) - xRestricciones - 5; // max width con margen

  if (datosFinales.apto === "APTO") {
    // Si es APTO, mostrar "SIN RESTRICCIONES" con salto de línea si fuera necesario
    dibujarTextoPegado("- SIN RESTRICCIONES", xRestricciones, yRestriccionesInicio, anchoRestricciones, 6);
  } else if (restriccionesProcesadas.length > 0) {
    // Si hay restricciones, mostrarlas pegadas (usar las ya procesadas)
    let yRestricciones = yRestriccionesInicio;
    restriccionesProcesadas.forEach((restriccion) => {
      yRestricciones = dibujarTextoPegado(`- ${restriccion.trim()}`, xRestricciones, yRestricciones, anchoRestricciones, 6);
    });
  } else {
    // Si no hay restricciones o es "NINGUNO", mostrar "- NINGUNO." con ajuste de línea
    dibujarTextoPegado("- NINGUNO.", xRestricciones, yRestriccionesInicio, anchoRestricciones, 6);
  }



  // Fila de FECHA DE EXAMEN (después de la firma) - 3 columnas
  const yFechaTexto = tablaAptitudInicioY + alturaBloqueSuperior + alturaFirma;

  // Primera columna: Fecha desde
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Fecha desde :", tablaAptitudInicioX + 2, yFechaTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.fechaDesde || "", tablaAptitudInicioX + 25, yFechaTexto + 4);

  // Segunda columna: Fecha hasta
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Fecha hasta :", tablaAptitudInicioX + 50, yFechaTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.fechaHasta || "", tablaAptitudInicioX + 70, yFechaTexto + 4);

  // Tercera columna: Sello y firma
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("SELLO Y FIRMA DE MEDICO QUE CERTIFICA", tablaAptitudInicioX + 123, yFechaTexto + 4);

  try {
    const firmaMedicoImg = getSign(data, "SELLOFIRMA");
    doc.addImage(firmaMedicoImg, 'PNG', firmaX, firmaY, 50 * 0.7, 30 * 0.7);
  } catch (e) {
    console.log("Error al agregar la firma:", e);
  }

  yTexto += alturaTablaAptitud; // Sin espacio extra después de la tabla

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