import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { convertirGenero } from "../../utils/helpers.js";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function Aptitud_Poderosa_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Datos de prueba por defecto
  const datosPrueba = {
    apellidosNombres: "CASTILLO PLASENCIA HADY KATHERINE",
    fechaExamen: "04/11/2024",
    tipoExamen: "APTITUD PODEROSA",
    sexo: "Femenino",
    documentoIdentidad: "72384273",
    edad: "31",
    fechaNacimiento: "01/01/1993",
    areaTrabajo: "MINERÍA",
    puestoTrabajo: "DAD",
    empresa: "MINERA BOROO MISQUICHILCA S.A.",
    contrata: "CONTRATA EJEMPLO S.A.C.",
    vitalSigns: {
      fc: "64",
      fr: "19",
      pa: "120/60",
      satO2: "99",
      imc: "23.48",
      temperatura: "36.5",
      peso: "70",
      talla: "1.75"
    },
    // Datos de color
    color: 1,
    codigoColor: "#008f39",
    textoColor: "F",
    // Datos adicionales para header
    numeroFicha: "99164",
    sede: "Trujillo-Pierola",
    horaSalida: "9:33:43 PM",
    // Datos para tipo de trabajo
    tipoTrabajo: "subsuelo", // "superficie", "planta", "subsuelo"
    // Datos para resultado de evaluación
    resultadoEvaluacion: "noApto", // "apto", "aptoConRestriccion", "noAptoTemporal", "noApto"
    // Datos para observaciones
    observaciones: "El trabajador presenta condiciones adecuadas para realizar trabajos en altura.\nSe recomienda seguimiento médico periódico.\nCumple con los requisitos de seguridad establecidos.",
    // Datos para fechas
    fechaCaducidad: "13/10/2026"
  };

  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente || "") + " " + (data.nombresPaciente || "")).trim(),
    fechaExamen: formatearFechaCorta(data.fechaExamen || ""),
    tipoExamen: String(data.nombreExamen || "APTITUD PODEROSA"),
    sexo: convertirGenero(data.sexoPaciente) || "",
    documentoIdentidad: String(data.dniPaciente || ""),
    edad: String(data.edadPaciente ?? ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente || data.fechaNacimiento || ""),
    areaTrabajo: data.areaPaciente || "",
    puestoTrabajo: data.cargoPaciente || "",
    empresa: data.empresa || "",
    contrata: data.contrata || "",
    vitalSigns: {
      fc: String(data.frecuenciaCardiaca || ""),
      fr: String(data.frecuenciaRespiratoriaTriaje || ""),
      pa: String(data.sistolica || "") + "/" + String(data.diastolica || ""),
      satO2: String(data.saturacionOxigenoTriaje || ""),
      imc: String(data.imcTriaje || ""),
      temperatura: String(data.temperatura || ""),
      peso: String(data.peso || ""),
      talla: String(data.tallaTriaje || "")
    },
    // Datos de color
    color: data.color || 1,
    codigoColor: data.codigoColor || "#008f39",
    textoColor: data.textoColor || "F",
    // Datos adicionales para header
    numeroFicha: String(data.norden || ""),
    sede: data.sede || data.nombreSede || "",
    horaSalida: String(data.horaSalida || ""),
    direccionPaciente: String(data.direccionPaciente || ""),
    // Datos para tipo de trabajo
    tipoTrabajo: data.tipoTrabajo || "superficie", // "superficie", "planta", "subsuelo"
    // Datos para resultado de evaluación
    resultadoEvaluacion: (() => {
      if (data.apto) return "apto";
      if (data.aptoRestriccion) return "aptoConRestriccion";
      if (data.aptoTemporal) return "noAptoTemporal";
      return "noApto";
    })(),
    // Datos para observaciones
    observaciones: data.observaciones || "",
    // Datos para fechas
    fechaCaducidad: formatearFechaCorta(data.fechaHasta || "")
  };

  // Usar datos reales si existen, sino usar datos de prueba
  const datosFinales = data && data.norden ? datosReales : datosPrueba;

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.text("CERTIFICADO DE APTITUD PARA TRABAJOS EN ALTURA MAYOR A 1.8 M", pageW / 2, 40, { align: "center" });
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
  drawHeader(numeroPagina);

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

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 45 + filaAltura + 2.5; // Ajustar para el header

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
  doc.text((datosFinales.edad ? (datosFinales.edad + " Años") : ""), tablaInicioX + 58, yTexto + 1);

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

  // Fila adicional: Superficie, X, PLANTA, SUBSUELO (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 40, yPos, tablaInicioX + 40, yPos + filaAltura); // División 1
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura); // División 2
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura); // División 3
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura); // División 4
  doc.line(tablaInicioX + 170, yPos, tablaInicioX + 170, yPos + filaAltura); // División 5

  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido de la fila adicional
  let yTexto2 = yPos - filaAltura + 2.5;

  // Superficie
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Superficie", tablaInicioX + 2, yTexto2 + 1);
  
  // Marcar X en Superficie si es el tipo seleccionado
  if (datosFinales.tipoTrabajo === "superficie") {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 49, yTexto2 + 1);
  }

  // PLANTA (centrado en la tercera columna)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Planta", tablaInicioX + 63, yTexto2 + 1);
  
  // Marcar X en Planta si es el tipo seleccionado
  if (datosFinales.tipoTrabajo === "planta") {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 109, yTexto2 + 1);
  }

  // SUBSUELO (centrado en la cuarta columna)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Subsuelo", tablaInicioX + 130, yTexto2 + 1);
  
  // Marcar X en Subsuelo si es el tipo seleccionado
  if (datosFinales.tipoTrabajo === "subsuelo") {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 178.5, yTexto2 + 1);
  }

  // === SECCIÓN 2: RESULTADO DE LA EVALUACIÓN ===
  yPos = dibujarHeaderSeccion("2. RESULTADO DE LA EVALUACIÓN", yPos, filaAltura);

  // Fila: Condición
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: APTO | X | APTO CON RESTRICCIÓN | | NO APTO TEMPORAL | | NO APTO | |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 15, yPos, tablaInicioX + 15, yPos + filaAltura); // División 1
  doc.line(tablaInicioX + 35, yPos, tablaInicioX + 35, yPos + filaAltura); // División 2
  doc.line(tablaInicioX + 75, yPos, tablaInicioX + 75, yPos + filaAltura); // División 3
  doc.line(tablaInicioX + 95, yPos, tablaInicioX + 95, yPos + filaAltura); // División 4
  doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + filaAltura); // División 5
  doc.line(tablaInicioX + 150, yPos, tablaInicioX + 150, yPos + filaAltura); // División 6
  doc.line(tablaInicioX + 170, yPos, tablaInicioX + 170, yPos + filaAltura); // División 7

  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido de las filas de resultado
  let yTexto3 = yPos - (filaAltura * 2) + 2.5;

  // Fila: Condición
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("CONDICIÓN", tablaInicioX + 2, yTexto3 + 1);
  yTexto3 += filaAltura;

  // Fila: APTO | X | APTO CON RESTRICCIÓN | | NO APTO TEMPORAL | | NO APTO | |
  // APTO
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("APTO", tablaInicioX + 2, yTexto3 + 1);
  
  // Marcar X en APTO si es la condición seleccionada
  if (datosFinales.resultadoEvaluacion === "apto") {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 25, yTexto3 + 1, { align: "center" });
  }

  // APTO CON RESTRICCIÓN
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("APTO CON RESTRICCIÓN", tablaInicioX + 37, yTexto3 + 1);
  
  // Marcar X en APTO CON RESTRICCIÓN si es la condición seleccionada
  if (datosFinales.resultadoEvaluacion === "aptoConRestriccion") {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 85, yTexto3 + 1, { align: "center" });
  }

  // NO APTO TEMPORAL
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("NO APTO TEMPORAL", tablaInicioX + 98, yTexto3 + 1);
  
  // Marcar X en NO APTO TEMPORAL si es la condición seleccionada
  if (datosFinales.resultadoEvaluacion === "noAptoTemporal") {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 140, yTexto3 + 1, { align: "center" });
  }

  // NO APTO
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("NO APTO", tablaInicioX + 152, yTexto3 + 1);
  
  // Marcar X en NO APTO si es la condición seleccionada
  if (datosFinales.resultadoEvaluacion === "noApto") {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 179.5, yTexto3 + 1, { align: "center" });
  }

  // === SECCIÓN 3: OBSERVACIONES ===
  yPos = dibujarHeaderSeccion("3. OBSERVACIONES", yPos, filaAltura);

  // Fila de observaciones con altura dinámica
  const observacionesTexto = datosFinales.observaciones || "";
  const anchoMaximoObservaciones = tablaAncho - 4;
  
  // Función para calcular altura dinámica de observaciones
  const calcularAlturaObservaciones = (texto, anchoMaximo) => {
    if (!texto || texto.trim() === "") return 20; // Altura fija mínima si no hay texto
    
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
    
    // Altura fija mínima de 20mm, altura por línea de 3mm
    const alturaCalculada = lineas * 3 + 2;
    return Math.max(alturaCalculada, 100); // Altura fija mínima de 20mm
  };

  const alturaFilaObservaciones = calcularAlturaObservaciones(observacionesTexto, anchoMaximoObservaciones);

  // Dibujar líneas de la fila de observaciones
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaObservaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaObservaciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaObservaciones, tablaInicioX + tablaAncho, yPos + alturaFilaObservaciones);

  // Contenido de la fila de observaciones
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Dividir el texto en líneas y agregar guión a cada una
  const lineasObservaciones = observacionesTexto.split('\n').filter(linea => linea.trim() !== '');
  let yTextoObservaciones = yPos + 5;
  
  if (lineasObservaciones.length > 0) {
    lineasObservaciones.forEach(linea => {
      const textoConGuion = `${linea.trim()}`;
      yTextoObservaciones = dibujarTextoConSaltoLinea(textoConGuion, tablaInicioX + 2, yTextoObservaciones, anchoMaximoObservaciones);
      yTextoObservaciones += 3; // Espaciado entre líneas
    });
  } else {
    // Si no hay observaciones, mostrar texto por defecto
    doc.text("- Sin observaciones registradas", tablaInicioX + 2, yTextoObservaciones);
  }
  
  yPos += alturaFilaObservaciones;

  // === FILA DE FECHAS ===
  // Fila: Fecha Examen | Fecha Caducidad (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + (tablaAncho / 2), yPos, tablaInicioX + (tablaAncho / 2), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido de la fila de fechas
  let yTexto4 = yPos - filaAltura + 2.5;

  // Fecha Examen
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Examen :", tablaInicioX + 2, yTexto4 + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaExamen || "", tablaInicioX + 30, yTexto4 + 1);

  // Fecha Caducidad
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Caducidad :", tablaInicioX + (tablaAncho / 2) + 2, yTexto4 + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaCaducidad || "", tablaInicioX + (tablaAncho / 2) + 35, yTexto4 + 1);

  // === SECCIÓN DE FIRMAS ===
  const yFirmas = yPos; // Continuar directamente desde la sección anterior
  const alturaSeccionFirmas = 30; // Altura para la sección de firmas

  // Dibujar las líneas de la sección de firmas (2 columnas)
  doc.line(tablaInicioX, yFirmas, tablaInicioX, yFirmas + alturaSeccionFirmas); // Línea izquierda
  doc.line(tablaInicioX + 95, yFirmas, tablaInicioX + 95, yFirmas + alturaSeccionFirmas); // División central
  doc.line(tablaInicioX + tablaAncho, yFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea derecha
  doc.line(tablaInicioX, yFirmas, tablaInicioX + tablaAncho, yFirmas); // Línea superior
  doc.line(tablaInicioX, yFirmas + alturaSeccionFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea inferior

  // === COLUMNA 1: FIRMA Y HUELLA DEL TRABAJADOR ===
  const firmaTrabajadorY = yFirmas + 3;
  
  // Calcular centro de la columna 1 para centrar las imágenes
  const centroColumna1X = tablaInicioX + (95 / 2); // Centro de la columna 1
  
  // Función para obtener URL de digitalización por nombre
  const getDigitalizacionUrl = (digitalizaciones, nombre) => {
    if (!digitalizaciones || !Array.isArray(digitalizaciones)) return null;
    const item = digitalizaciones.find(d => d.nombreDigitalizacion === nombre);
    return item ? item.url : null;
  };

  // Agregar firma del trabajador (lado izquierdo)
  let firmaTrabajadorUrl = getDigitalizacionUrl(data.digitalizacion, "FIRMAP");
  if (firmaTrabajadorUrl) {
    try {
      const imgWidth = 30;
      const imgHeight = 20;
      const x = centroColumna1X - 20;
      const y = firmaTrabajadorY;
      doc.addImage(firmaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del trabajador:", error);
    }
  }

  // Agregar huella del trabajador (lado derecho, vertical)
  let huellaTrabajadorUrl = getDigitalizacionUrl(data.digitalizacion, "HUELLA");
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

  // === COLUMNA 2: SELLO Y FIRMA DEL MÉDICO ===
  const firmaMedicoX = tablaInicioX + 127;
  const firmaMedicoY = yFirmas + 3;
  
  // Agregar firma y sello médico
  let firmaMedicoUrl = getDigitalizacionUrl(data.digitalizacion, "SELLOFIRMA");
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 45;
      const imgHeight = 20;
      const x = firmaMedicoX;
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(7);
  const centroColumna2 = tablaInicioX + 95 + ((tablaAncho - 95) / 2);
  doc.text("Sello y Firma del Médico", centroColumna2, yFirmas + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumna2, yFirmas + 28.5, { align: "center" });

  yPos += alturaSeccionFirmas;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8});

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