import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { getSign, convertirGenero } from "../../utils/helpers";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function Ficha_interconsulta_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Datos de prueba por defecto
  const datosPrueba = {
    apellidosNombres: "CASTILLO PLASENCIA HADY KATHERINE",
    fechaExamen: "04/11/2024",
    tipoExamen: "INTERCONSULTA",
    sexo: "Femenino",
    documentoIdentidad: "72384273",
    edad: "31",
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
    sede: "Trujillo-Pierola"
  };
  console.log('jasper',data)
  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente || "") + " " + (data.nombresPaciente || "")).trim(),
    fechaExamen: formatearFechaCorta(data.fechaExamen || ""),
    tipoExamen: String(data.nombreExamen || "INTERCONSULTA"),
    sexo: convertirGenero(data.sexoPaciente) || "",
    documentoIdentidad: String(data.dniPaciente || ""),
    edad: String(data.edadPaciente ?? ""),
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
    // Datos específicos de interconsulta
    codigoFichaInterconsulta: String(data.codigoFichaInterconsulta || ""),
    especialidad: String(data.especialidad || ""),
    motivoInterconsulta: String(data.motivo || ""),
    fechaAtencion: formatearFechaCorta(data.fechaExamen || ""),
    hallazgosRelevantes: String(data.hallazgo || ""),
    diagnostico: String(data.diagnostico || ""),
    tratamientoRecomendaciones: String(data.tratamiento || ""),
    // Conclusión evaluación
    conclusionApto: Boolean(data.apto || false),
    conclusionNoApto: Boolean(data.noApto || false),
    // Datos oftalmológicos
    agudezaVisualCercaOD: String(data.visioncercasincorregirod_v_cerca_s_od || ""),
    agudezaVisualCercaOI: String(data.visioncercasincorregiroi_v_cerca_s_oi || ""),
    agudezaVisualCercaConOD: String(data.oftalodccmologia_odcc || ""),
    agudezaVisualCercaConOI: String(data.oiccoftalmologia_oicc || ""),
    agudezaVisualLejosOD: String(data.visionlejossincorregirod_v_lejos_s_od || ""),
    agudezaVisualLejosOI: String(data.visionlejossincorregiroi_v_lejos_s_oi || ""),
    agudezaVisualLejosConOD: String(data.odlcoftalmologia_odlc || ""),
    agudezaVisualLejosConOI: String(data.oilcoftalmologia_oilc || ""),
    testIshihara: String(data.vcoftalmologia_vc || ""),
    refPupilares: String(data.rpoftalmologia_rp || ""),
    enfermedadesOculares: String(data.enfermedadesocularesoftalmo_e_oculares || ""),
    // Datos del usuario médico
    nombreUsuario: String(data.nombreUsuario || ""),
    apellidoUsuario: String(data.apellidoUsuario || ""),
    cmpUsuario: String(data.cmpUsuario || ""),
    dniUsuario: String(data.dniUsuario || ""),
    // Datos de digitalización
    digitalizacion: data.digitalizacion || []
  };

  // Usar datos reales si existen, sino usar datos de prueba
  const datosFinales = data && data.norden ? datosReales : datosPrueba;

  // Header reutilizable (similar a Anexo16ABoro_Digitalizado.jsx)
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("FICHA DE INTERCONSULTA", pageW / 2, 30, { align: "center" });
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
    const fontSize = doc.internal.getFontSize();
    const palabras = texto.split(' ');
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
    }
    
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
    doc.setFillColor(160, 160, 160);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    
    // Dibujar líneas del header
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
    
    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + 3);
    
    return yPos + alturaHeader;
  };

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 10;
  const tablaAncho = 190;
  let yPos = 45;
  const filaAltura = 5;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Segunda fila: DNI, Edad, Sexo (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Tercera fila: Área de Trabajo, Puesto de Trabajo (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Cuarta fila: Empresa (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Contrata (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 45 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 2, tablaAncho - 40);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 2);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Edad:", tablaInicioX + 62, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.edad + " Años", tablaInicioX + 75, yTexto + 2);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Género:", tablaInicioX + 122, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.sexo, tablaInicioX + 135, yTexto + 2);
  yTexto += filaAltura;

  // Tercera fila: Área de Trabajo, Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo, tablaInicioX + 30, yTexto + 2, 50);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Puesto de Trabajo:", tablaInicioX + 92, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo, tablaInicioX + 122, yTexto + 2, 65);
  yTexto += filaAltura;

  // Cuarta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 25, yTexto + 2, tablaAncho - 25);
  yTexto += filaAltura;

  // Quinta fila: Contrata
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.contrata, tablaInicioX + 25, yTexto + 2, tablaAncho - 30);
  yTexto += filaAltura;

  // === SECCIÓN 2: FUNCIONES VITALES ===
  // Header de funciones vitales (solo título)
  yPos = dibujarHeaderSeccion("2. SIGNOS VITALES", yPos, filaAltura);

  // Primera fila de funciones vitales con 5 columnas (datos van aquí)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 38, yPos, tablaInicioX + 38, yPos + filaAltura); // Primera división
  doc.line(tablaInicioX + 76, yPos, tablaInicioX + 76, yPos + filaAltura); // Segunda división
  doc.line(tablaInicioX + 114, yPos, tablaInicioX + 114, yPos + filaAltura); // Tercera división
  doc.line(tablaInicioX + 152, yPos, tablaInicioX + 152, yPos + filaAltura); // Cuarta división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Segunda fila de funciones vitales con 3 columnas (Temperatura, Peso, Talla)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 63, yPos, tablaInicioX + 63, yPos + filaAltura); // Primera división
  doc.line(tablaInicioX + 126, yPos, tablaInicioX + 126, yPos + filaAltura); // Segunda división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior

  // === CONTENIDO DE FUNCIONES VITALES ===
  // Primera fila: FC, FR, PA, Sat. O2, IMC
  const yPrimeraFila = yPos - filaAltura; // Ajustar para la primera fila
  
  // FC (Frecuencia Cardíaca)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("FC:", tablaInicioX + 2, yPrimeraFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.vitalSigns.fc + " x min", tablaInicioX + 8, yPrimeraFila + 3);

  // FR (Frecuencia Respiratoria)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("FR:", tablaInicioX + 40, yPrimeraFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.vitalSigns.fr + " x min", tablaInicioX + 46, yPrimeraFila + 3);

  // PA (Presión Arterial)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("PA:", tablaInicioX + 78, yPrimeraFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.vitalSigns.pa + " mmHg", tablaInicioX + 84, yPrimeraFila + 3);

  // Sat. O2 (Saturación de Oxígeno)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Sat. O2:", tablaInicioX + 116, yPrimeraFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.vitalSigns.satO2 + " %", tablaInicioX + 130, yPrimeraFila + 3);

  // IMC (Índice de Masa Corporal)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("IMC:", tablaInicioX + 154, yPrimeraFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.vitalSigns.imc + " kg/m2", tablaInicioX + 162, yPrimeraFila + 3);

  // Segunda fila: T°, Peso, Talla
  const ySegundaFila = yPos; // La segunda fila está en la posición actual de yPos
  
  // Temperatura
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("T°:", tablaInicioX + 2, ySegundaFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.vitalSigns.temperatura + " °C", tablaInicioX + 8, ySegundaFila + 3);

  // Peso
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Peso:", tablaInicioX + 65, ySegundaFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.vitalSigns.peso + " kg", tablaInicioX + 75, ySegundaFila + 3);

  // Talla
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Talla:", tablaInicioX + 128, ySegundaFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.vitalSigns.talla + " cm", tablaInicioX + 140, ySegundaFila + 3);

  yPos += filaAltura;

  // === SECCIÓN 3: EVALUACIÓN OFTALMOLÓGICA ===
  // Header de evaluación oftalmológica
  yPos = dibujarHeaderSeccion("3. EVALUACIÓN OFTALMOLÓGICA", yPos, filaAltura);

  // Crear tabla de evaluación oftalmológica con 4 columnas - POSICIONES ESPECÍFICAS
  const oftalmoInicioX = 10;
  const oftalmoAncho = 190;
  const oftalmoAlturaFila = 5;
  
  // Posiciones específicas para las divisiones (como en filiación)
  const oftalmoDiv1 = oftalmoInicioX + 30;  // Primera división
  const oftalmoDiv2 = oftalmoInicioX + 75;  // Segunda división  
  const oftalmoDiv3 = oftalmoInicioX + 120; // Tercera división

  // Header de la tabla oftalmológica
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Líneas verticales del header
  doc.line(oftalmoInicioX, yPos, oftalmoInicioX, yPos + oftalmoAlturaFila); // Línea izquierda
  doc.line(oftalmoDiv1, yPos, oftalmoDiv1, yPos + oftalmoAlturaFila); // Primera división
  doc.line(oftalmoDiv2, yPos, oftalmoDiv2, yPos + oftalmoAlturaFila); // Segunda división
  doc.line(oftalmoDiv3, yPos, oftalmoDiv3, yPos + oftalmoAlturaFila); // Tercera división
  doc.line(oftalmoInicioX + oftalmoAncho, yPos, oftalmoInicioX + oftalmoAncho, yPos + oftalmoAlturaFila); // Línea derecha

  // Líneas horizontales
  doc.line(oftalmoInicioX, yPos, oftalmoInicioX + oftalmoAncho, yPos); // Superior
  doc.line(oftalmoInicioX, yPos + oftalmoAlturaFila, oftalmoInicioX + oftalmoAncho, yPos + oftalmoAlturaFila); // Inferior

  // Textos del header - SOLO TÍTULOS (4 columnas)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Agudeza Visual", oftalmoInicioX + 2, yPos + 3);
  doc.text("Sin correctores", oftalmoDiv1 + 2, yPos + 3);
  doc.text("Con correctores", oftalmoDiv2 + 2, yPos + 3);
  doc.text("V. Binocular", oftalmoDiv3 + 2, yPos + 3);

  // Fila de datos "Cerca"
  const yCerca = yPos + oftalmoAlturaFila;
  
  // Líneas de la fila de datos
  doc.line(oftalmoInicioX, yCerca, oftalmoInicioX, yCerca + oftalmoAlturaFila); // Línea izquierda
  doc.line(oftalmoDiv1, yCerca, oftalmoDiv1, yCerca + oftalmoAlturaFila); // Primera división
  doc.line(oftalmoDiv2, yCerca, oftalmoDiv2, yCerca + oftalmoAlturaFila); // Segunda división
  doc.line(oftalmoDiv3, yCerca, oftalmoDiv3, yCerca + oftalmoAlturaFila); // Tercera división
  doc.line(oftalmoInicioX + oftalmoAncho, yCerca, oftalmoInicioX + oftalmoAncho, yCerca + oftalmoAlturaFila); // Línea derecha
  doc.line(oftalmoInicioX, yCerca, oftalmoInicioX + oftalmoAncho, yCerca); // Superior
  doc.line(oftalmoInicioX, yCerca + oftalmoAlturaFila, oftalmoInicioX + oftalmoAncho, yCerca + oftalmoAlturaFila); // Inferior

  // Datos para la fila "Cerca" - usando datos reales
  const datosCerca = {
    agudezaVisual: "Cerca",
    sinCorrectores: `OD: ${datosFinales.agudezaVisualCercaOD || ""}  OI: ${datosFinales.agudezaVisualCercaOI || ""}`,
    conCorrectores: `OD: ${datosFinales.agudezaVisualCercaConOD || ""}  OI: ${datosFinales.agudezaVisualCercaConOI || ""}`,
    binocular: `Test de Ishihara: ${datosFinales.testIshihara || ""}`
  };

  // Contenido de la fila "Cerca"
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text(datosCerca.agudezaVisual, oftalmoInicioX + 2, yCerca + 3);
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosCerca.sinCorrectores, oftalmoDiv1 + 2, yCerca + 3);
  doc.text(datosCerca.conCorrectores, oftalmoDiv2 + 2, yCerca + 3);
  doc.text(datosCerca.binocular, oftalmoDiv3 + 2, yCerca + 3);

  // Fila de datos "Lejos"
  const yLejos = yCerca + oftalmoAlturaFila;
  
  // Líneas de la fila de datos "Lejos"
  doc.line(oftalmoInicioX, yLejos, oftalmoInicioX, yLejos + oftalmoAlturaFila); // Línea izquierda
  doc.line(oftalmoDiv1, yLejos, oftalmoDiv1, yLejos + oftalmoAlturaFila); // Primera división
  doc.line(oftalmoDiv2, yLejos, oftalmoDiv2, yLejos + oftalmoAlturaFila); // Segunda división
  doc.line(oftalmoDiv3, yLejos, oftalmoDiv3, yLejos + oftalmoAlturaFila); // Tercera división
  doc.line(oftalmoInicioX + oftalmoAncho, yLejos, oftalmoInicioX + oftalmoAncho, yLejos + oftalmoAlturaFila); // Línea derecha
  doc.line(oftalmoInicioX, yLejos, oftalmoInicioX + oftalmoAncho, yLejos); // Superior
  doc.line(oftalmoInicioX, yLejos + oftalmoAlturaFila, oftalmoInicioX + oftalmoAncho, yLejos + oftalmoAlturaFila); // Inferior

  // Datos para la fila "Lejos" - usando datos reales
  const datosLejos = {
    agudezaVisual: "Lejos",
    sinCorrectores: `OD: ${datosFinales.agudezaVisualLejosOD || ""}  OI: ${datosFinales.agudezaVisualLejosOI || ""}`,
    conCorrectores: `OD: ${datosFinales.agudezaVisualLejosConOD || ""}  OI: ${datosFinales.agudezaVisualLejosConOI || ""}`,
    binocular: `Ref. Pupilares: ${datosFinales.refPupilares || ""}`
  };

  // Contenido de la fila "Lejos"
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text(datosLejos.agudezaVisual, oftalmoInicioX + 2, yLejos + 3);
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosLejos.sinCorrectores, oftalmoDiv1 + 2, yLejos + 3);
  doc.text(datosLejos.conCorrectores, oftalmoDiv2 + 2, yLejos + 3);
  doc.text(datosLejos.binocular, oftalmoDiv3 + 2, yLejos + 3);

  // Fila de enfermedades oculares (fila completa)
  const yEnfermedades = yLejos + oftalmoAlturaFila;
  
  // Líneas de la fila de enfermedades oculares
  doc.line(oftalmoInicioX, yEnfermedades, oftalmoInicioX, yEnfermedades + oftalmoAlturaFila); // Línea izquierda
  doc.line(oftalmoInicioX + oftalmoAncho, yEnfermedades, oftalmoInicioX + oftalmoAncho, yEnfermedades + oftalmoAlturaFila); // Línea derecha
  doc.line(oftalmoInicioX, yEnfermedades, oftalmoInicioX + oftalmoAncho, yEnfermedades); // Superior
  doc.line(oftalmoInicioX, yEnfermedades + oftalmoAlturaFila, oftalmoInicioX + oftalmoAncho, yEnfermedades + oftalmoAlturaFila); // Inferior

  // Contenido de la fila de enfermedades oculares
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Enfermedades oculares:", oftalmoInicioX + 2, yEnfermedades + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.enfermedadesOculares || "", oftalmoInicioX + 50, yEnfermedades + 3);

  yPos += oftalmoAlturaFila * 4;

  // === SECCIÓN 4: MOTIVO DE INTERCONSULTA ===
  // Header de motivo de interconsulta
  yPos = dibujarHeaderSeccion("4. MOTIVO DE INTERCONSULTA", yPos, filaAltura);

  // Fila "Motivo de Interconsulta:" (fila completa)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Motivo de Interconsulta:", tablaInicioX + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.motivoInterconsulta || "", tablaInicioX + 50, yPos + 3);
  yPos += filaAltura;

  // Fila "EVALUACIÓN DE ESPECIALISTA (medicina interna)" (fila gris)
  doc.setFillColor(160, 160, 160);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("EVALUACIÓN DE ESPECIALISTA (medicina interna)", tablaInicioX + 2, yPos + 3);
  yPos += filaAltura;

  // Fila "Fecha atención" (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Fecha atención:", tablaInicioX + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  //doc.text(formatearFechaCorta(datosFinales.fechaAtencion || ""), tablaInicioX + 30, yPos + 3);
  yPos += filaAltura;

  // Fila "Hallazgos relevantes:" (fila gris)
  doc.setFillColor(160, 160, 160);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Hallazgos relevantes:", tablaInicioX + 2, yPos + 3);
  yPos += filaAltura;

  // Fila de hallazgos relevantes (fila completa con altura dinámica)
  const hallazgosTexto = datosFinales.hallazgosRelevantes || "";
  const calcularAlturaHallazgos = (texto, anchoMaximo, fontSize) => {
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
    
    return Math.max(lineas * fontSize * 0.35 + 1.5, filaAltura);
  };

  const anchoMaximoHallazgos = tablaAncho - 4;
  const alturaFilaHallazgos = calcularAlturaHallazgos(hallazgosTexto, anchoMaximoHallazgos, 8);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaHallazgos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaHallazgos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaHallazgos, tablaInicioX + tablaAncho, yPos + alturaFilaHallazgos);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(hallazgosTexto, tablaInicioX + 2, yPos + 3, anchoMaximoHallazgos);
  yPos += alturaFilaHallazgos;

  // Fila "Diagnóstico:" (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Diagnóstico:", tablaInicioX + 2, yPos + 3);
  yPos += filaAltura;

  // Fila de diagnóstico (fila completa con altura dinámica)
  const diagnosticoTexto = datosFinales.diagnostico || "";
  const alturaFilaDiagnostico = calcularAlturaHallazgos(diagnosticoTexto, anchoMaximoHallazgos, 8);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaDiagnostico);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaDiagnostico);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaDiagnostico, tablaInicioX + tablaAncho, yPos + alturaFilaDiagnostico);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(diagnosticoTexto, tablaInicioX + 2, yPos + 3, anchoMaximoHallazgos);
  yPos += alturaFilaDiagnostico;

  // Fila "Tratamiento y recomendaciones vinculadas a la actividad laboral:" (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Tratamiento y recomendaciones vinculadas a la actividad laboral:", tablaInicioX + 2, yPos + 3);
  yPos += filaAltura;

  // Fila de tratamiento y recomendaciones (fila completa con altura dinámica)
  const tratamientoTexto = datosFinales.tratamientoRecomendaciones || "";
  const alturaFilaTratamiento = calcularAlturaHallazgos(tratamientoTexto, anchoMaximoHallazgos, 8);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaTratamiento);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaTratamiento);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaTratamiento, tablaInicioX + tablaAncho, yPos + alturaFilaTratamiento);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(tratamientoTexto, tablaInicioX + 2, yPos + 3, anchoMaximoHallazgos);
  yPos += alturaFilaTratamiento;

  // === SECCIÓN DE DECLARACIÓN, FIRMA Y HUELLA DEL TRABAJADOR ===
  const yDeclaracion = yPos; // Continuar directamente desde la sección anterior
  const alturaSeccionDeclaracion = 30; // Altura para la sección de declaración

  // Dibujar las líneas de la sección de declaración (3 columnas)
  doc.line(tablaInicioX, yDeclaracion, tablaInicioX, yDeclaracion + alturaSeccionDeclaracion); // Línea izquierda
  doc.line(tablaInicioX + 60, yDeclaracion, tablaInicioX + 60, yDeclaracion + alturaSeccionDeclaracion); // Primera división
  doc.line(tablaInicioX + 120, yDeclaracion, tablaInicioX + 120, yDeclaracion + alturaSeccionDeclaracion); // Segunda división
  doc.line(tablaInicioX + tablaAncho, yDeclaracion, tablaInicioX + tablaAncho, yDeclaracion + alturaSeccionDeclaracion); // Línea derecha
  doc.line(tablaInicioX, yDeclaracion, tablaInicioX + tablaAncho, yDeclaracion); // Línea superior
  doc.line(tablaInicioX, yDeclaracion + alturaSeccionDeclaracion, tablaInicioX + tablaAncho, yDeclaracion + alturaSeccionDeclaracion); // Línea inferior

  // === COLUMNA 1: DECLARACIÓN ===
  doc.setFont("helvetica", "normal").setFontSize(6);
  const textoDeclaracion = "Declaro que las respuestas son ciertas según mi leal saber y entender. En caso de ser requeridos, los resultados del examen médico pueden ser revelados, en términos generales, al departamento de salud Ocupacional de la compañía. Los resultados pueden ser enviados a mi médico particular de ser considerado necesario.";
  
  // Función para justificar texto
  const justificarTexto = (texto, x, y, anchoMaximo, interlineado) => {
    const lineas = doc.splitTextToSize(texto, anchoMaximo);
    let yActual = y;
    
    lineas.forEach((linea, index) => {
      // Solo justificar si no es la última línea y tiene más de una palabra
      if (index < lineas.length - 1 && linea.includes(' ')) {
        const palabras = linea.split(' ');
        if (palabras.length > 1) {
          const anchoTexto = doc.getTextWidth(linea);
          const espacioDisponible = anchoMaximo - anchoTexto;
          const espaciosEntrePalabras = palabras.length - 1;
          const espacioExtra = espacioDisponible / espaciosEntrePalabras;
          
          let xActual = x;
          palabras.forEach((palabra, i) => {
            doc.text(palabra, xActual, yActual);
            if (i < palabras.length - 1) {
              const anchoPalabra = doc.getTextWidth(palabra);
              xActual += anchoPalabra + (doc.getTextWidth(' ') + espacioExtra);
            }
          });
        } else {
          doc.text(linea, x, yActual);
        }
      } else {
        doc.text(linea, x, yActual);
      }
      yActual += interlineado;
    });
  };
  
  // Dibujar texto justificado
  justificarTexto(textoDeclaracion, tablaInicioX + 2, yDeclaracion + 3, 55, 2.5);

  // === COLUMNA 2: FIRMA Y HUELLA DEL TRABAJADOR ===
  const firmaTrabajadorY = yDeclaracion + 3;
  
  // Calcular centro de la columna 2 para centrar las imágenes
  const centroColumna2X = tablaInicioX + 60 + (60 / 2); // Centro de la columna 2
  
  // Agregar firma del trabajador (lado izquierdo)
  let firmaTrabajadorUrl = getSign(datosFinales, "FIRMAP");
  if (firmaTrabajadorUrl) {
    try {
      const imgWidth = 30;
      const imgHeight = 20;
      const x = centroColumna2X - 20;
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
      const x = centroColumna2X + 8;
      const y = firmaTrabajadorY;
      doc.addImage(huellaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando huella del trabajador:", error);
    }
  }
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  const centroColumna2 = tablaInicioX + 60 + (60 / 2);
  doc.text("Firma y Huella del trabajador", centroColumna2, yDeclaracion + 26, { align: "center" });

  // === COLUMNA 3: SELLO Y FIRMA DEL MÉDICO ===
  const firmaMedicoX = tablaInicioX + 125;
  const firmaMedicoY = yDeclaracion + 3;
  
  // Agregar firma y sello médico
  let firmaMedicoUrl = getSign(datosFinales, "SELLOFIRMA");
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 45;
      const imgHeight = 20;
      const x = firmaMedicoX + 10;
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  const centroColumna3 = tablaInicioX + 120 + (70 / 2);
  doc.text("Sello y Firma del Médico", centroColumna3, yDeclaracion + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumna3, yDeclaracion + 28.5, { align: "center" });

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
