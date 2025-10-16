import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { getSign, convertirGenero } from "../../utils/helpers";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';
import autoTable from "jspdf-autotable";

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
    sede: "Trujillo-Pierola",
    horaSalida: "9:33:43 PM"
  };

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
    fechaAtencion: formatearFechaCorta(data.fechaApertura || ""),
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
    digitalizacion: data.digitalizacion || [],
    horaSalida: String(data.horaSalida || ""),
    direccionPaciente: String(data.direccionPaciente || "")
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
      doc.text("FICHA DE INTERCONSULTA", pageW / 2, 35, { align: "center" });
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
    doc.setFillColor(160, 160, 160);
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
  let yPos = 40;
  const filaAltura = 5;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);
  doc.text("HORA SALIDA:", tablaInicioX + 130, yPos - 1.5)
  doc.setFont("helvetica", "normal").setFontSize(9);
  let horaFormateada = datosFinales.horaSalida;
  if (datosFinales.horaSalida) {
    const partes = datosFinales.horaSalida.split(":");
    const hora = parseInt(partes[0], 10);

    if (!isNaN(hora)) {
      const sufijo = hora >= 12 ? "PM" : "AM";
      horaFormateada = `${datosFinales.horaSalida} ${sufijo}`;
    }
  }

  doc.text(horaFormateada, tablaInicioX + 155, yPos - 1.5)
  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

 // Primera fila: Apellidos y Nombres (fila completa) 
   doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); 
   doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); 
   doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); 
   doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); yPos += filaAltura;

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

  // 🔹 Nueva cuarta fila: Centro de Trabajo (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Empresa (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Sexta fila: Contrata (2 columnas, la segunda más pequeña)
  const anchoPrimeraCol = 140; // Ancho columna grande
  const anchoSegundaCol = tablaAncho - anchoPrimeraCol; // Columna pequeña

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + anchoPrimeraCol, yPos, tablaInicioX + anchoPrimeraCol, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 40 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 2, tablaAncho - 40);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DNI / CE / NIE:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 29, yTexto + 2);

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

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Dirección:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.direccionPaciente, tablaInicioX + 25, yTexto + 2, tablaAncho - 30);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Cel:", tablaInicioX + 146, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea("963164925", tablaInicioX + 155, yTexto + 2, tablaAncho - 30);
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

  // Datos para la fila "Cerca" - usando datos reales
  const datosCerca = {
    agudezaVisual: "Cerca",
    sinCorrectores: `OD: ${datosFinales.agudezaVisualCercaOD || ""}  OI: ${datosFinales.agudezaVisualCercaOI || ""}`,
    conCorrectores: `OD: ${datosFinales.agudezaVisualCercaConOD || ""}  OI: ${datosFinales.agudezaVisualCercaConOI || ""}`,
    binocular: `Test de Ishihara: ${datosFinales.testIshihara || ""}`
  };

  // Datos para la fila "Lejos" - usando datos reales
  const datosLejos = {
    agudezaVisual: "Lejos",
    sinCorrectores: `OD: ${datosFinales.agudezaVisualLejosOD || ""}  OI: ${datosFinales.agudezaVisualLejosOI || ""}`,
    conCorrectores: `OD: ${datosFinales.agudezaVisualLejosConOD || ""}  OI: ${datosFinales.agudezaVisualLejosConOI || ""}`,
    binocular: `Ref. Pupilares: ${datosFinales.refPupilares || ""}`
  };

  autoTable(doc, {
    startY: yPos,
    margin: { left: tablaInicioX, right: doc.internal.pageSize.getWidth() - (tablaInicioX + tablaAncho) },
    body: [
      [
        { content: "Agudeza Visual", styles: { valign: "middle", fontStyle: "bold", halign: "center" } },
        { content: "Sin correctores", styles: { valign: "middle", fontStyle: "bold", halign: "center" } },
        { content: "Con correctores", styles: { valign: "middle", fontStyle: "bold", halign: "center" } },
        { content: "V. Binocular", styles: { valign: "middle", fontStyle: "bold", halign: "center" } },
        { content: "E. Oculares", styles: { valign: "middle", fontStyle: "bold", halign: "center" } },
      ],
      [
        { content: "Cerca", styles: { valign: "middle", fontStyle: "bold" } },
        { content: `${datosCerca.sinCorrectores}`, styles: { valign: "middle" } },
        { content: `${datosLejos.sinCorrectores}`, styles: { valign: "middle" } },
        { content: `${datosCerca.binocular}`, styles: { valign: "middle" } },
        { content: `${datosFinales.enfermedadesOculares}`, rowSpan:2, styles: { valign: "middle", halign: "center" } },
      ],
      [
        { content: "Lejos", styles: { valign: "middle", fontStyle: "bold" } },
        { content: `${datosCerca.conCorrectores}`, styles: { valign: "middle" } },
        { content: `${datosLejos.conCorrectores}`, styles: { valign: "middle" } },
        { content: `${datosLejos.binocular}`, styles: { valign: "middle" } },
      ],
    ],
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 1,
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0], // 🔹 líneas negras
      lineWidth: 0.2,       // 🔹 grosor de línea
    },
    tableLineColor: [0, 0, 0], // 🔹 bordes externos negros
    tableLineWidth: 0.2,
  });
  

  yPos = doc.lastAutoTable.finalY;

  // === FUNCIÓN PARA CALCULAR ALTURA DINÁMICA ===
  const calcularAlturaHallazgos = (texto, anchoMaximo) => {
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
    
    // Altura fija mínima de 25mm, altura por línea de 3mm
    const alturaCalculada = lineas * 3 + 2;
    return Math.max(alturaCalculada, 20); // Altura fija mínima de 25mm
  };

  // === SECCIÓN 4: MOTIVO DE INTERCONSULTA ===
  // Header de motivo de interconsulta
  yPos = dibujarHeaderSeccion("4. MOTIVO DE INTERCONSULTA", yPos, filaAltura);

  // Fila "Motivo de Interconsulta:" (fila celeste)
  doc.setFillColor(173, 216, 230); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Motivo de Interconsulta:", tablaInicioX + 2, yPos + 3);
  yPos += filaAltura;

  // Fila de contenido del motivo (fila completa con altura dinámica)
  const motivoTexto = datosFinales.motivoInterconsulta || "";
  const alturaFilaMotivo = calcularAlturaHallazgos(motivoTexto, tablaAncho - 4);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaMotivo);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaMotivo);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaMotivo, tablaInicioX + tablaAncho, yPos + alturaFilaMotivo);

  // === COLUMNA 2: SELLO Y FIRMA DEL MÉDICO ===
  const firmaMedicoX = tablaInicioX + 127 ;
  const firmaMedicoY = yPos ;
  
  // Agregar firma y sello médico
  let firmaMedicoUrl = getSign(datosFinales, "SELLOFIRMA");
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

  doc.setFont("helvetica", "normal").setFontSize(8);
  // Dividir el texto en líneas y agregar guión a cada una
  const lineasMotivo = motivoTexto.split('\n').filter(linea => linea.trim() !== '');
  let yTextoMotivo = yPos + 5;
  
  lineasMotivo.forEach(linea => {
  const textoConGuion = `- ${linea.trim()}`;
  yTextoMotivo = dibujarTextoConSaltoLinea(textoConGuion, tablaInicioX + 2, yTextoMotivo, tablaAncho - 4);
  yTextoMotivo += 1; // pequeño margen entre párrafos (opcional)
});
  console.log(lineasMotivo)
  yPos += alturaFilaMotivo;

  // Fila "EVALUACIÓN DE ESPECIALISTA (medicina interna)" (fila gris)
  doc.setFillColor(160, 160, 160);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text(`EVALUACIÓN DE ESPECIALISTA: ${datosFinales.especialidad} `, tablaInicioX + tablaAncho/2, yPos + 3, { align: "center" });
  yPos += filaAltura;

  // Fila "Fecha atención" (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Fecha atención:", tablaInicioX + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaAtencion, tablaInicioX + 30, yPos + 3);
  yPos += filaAltura;

  // Fila "Hallazgos relevantes:" (fila celeste)
  doc.setFillColor(173, 216, 230); // Color celeste claro
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

  const anchoMaximoHallazgos = tablaAncho - 4;
  const alturaFilaHallazgos = calcularAlturaHallazgos(hallazgosTexto, anchoMaximoHallazgos);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaHallazgos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaHallazgos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaHallazgos, tablaInicioX + tablaAncho, yPos + alturaFilaHallazgos);

  doc.setFont("helvetica", "normal").setFontSize(8);
  // Dividir el texto en líneas y agregar guión a cada una
  const lineasHallazgos = hallazgosTexto.split('\n').filter(linea => linea.trim() !== '');
  let yTextoHallazgos = yPos + 5;
  
  lineasHallazgos.forEach(linea => {
    const textoConGuion = `- ${linea.trim()}`;
    dibujarTextoConSaltoLinea(textoConGuion, tablaInicioX + 2, yTextoHallazgos, anchoMaximoHallazgos);
    yTextoHallazgos += 3; // Espaciado entre líneas
  });
  
  yPos += alturaFilaHallazgos;

  // Fila "Diagnóstico:" (fila celeste)
  doc.setFillColor(173, 216, 230); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Diagnóstico:", tablaInicioX + 2, yPos + 3);
  yPos += filaAltura;

  // Fila de diagnóstico (fila completa con altura dinámica)
  const diagnosticoTexto = datosFinales.diagnostico || "";
  const alturaFilaDiagnostico = calcularAlturaHallazgos(diagnosticoTexto, anchoMaximoHallazgos);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaDiagnostico);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaDiagnostico);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaDiagnostico, tablaInicioX + tablaAncho, yPos + alturaFilaDiagnostico);

  doc.setFont("helvetica", "normal").setFontSize(8);
  // Dividir el texto en líneas y agregar guión a cada una
  const lineasDiagnostico = diagnosticoTexto.split('\n').filter(linea => linea.trim() !== '');
  let yTextoDiagnostico = yPos + 5;
  
  lineasDiagnostico.forEach(linea => {
    const textoConGuion = `- ${linea.trim()}`;
    dibujarTextoConSaltoLinea(textoConGuion, tablaInicioX + 2, yTextoDiagnostico, anchoMaximoHallazgos);
    yTextoDiagnostico += 3; // Espaciado entre líneas
  });
  
  yPos += alturaFilaDiagnostico;

  // Fila "Tratamiento y recomendaciones vinculadas a la actividad laboral:" (fila celeste)
  doc.setFillColor(173, 216, 230); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Tratamiento y recomendaciones vinculadas a la actividad laboral:", tablaInicioX + 2, yPos + 3);
  yPos += filaAltura;

  // Fila de tratamiento y recomendaciones (fila completa con altura dinámica)
  const tratamientoTexto = datosFinales.tratamientoRecomendaciones || "";
  const alturaFilaTratamiento = calcularAlturaHallazgos(tratamientoTexto, anchoMaximoHallazgos);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaTratamiento);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaTratamiento);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaTratamiento, tablaInicioX + tablaAncho, yPos + alturaFilaTratamiento);

  doc.setFont("helvetica", "normal").setFontSize(8);
  // Dividir el texto en líneas y agregar guión a cada una
  const lineasTratamiento = tratamientoTexto.split('\n').filter(linea => linea.trim() !== '');
  let yTextoTratamiento = yPos + 5;
  
  lineasTratamiento.forEach(linea => {
    const textoConGuion = `- ${linea.trim()}`;
    dibujarTextoConSaltoLinea(textoConGuion, tablaInicioX + 2, yTextoTratamiento, anchoMaximoHallazgos);
    yTextoTratamiento += 3; // Espaciado entre líneas
  });
  
  yPos += alturaFilaTratamiento;

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
  
  // Agregar firma del trabajador (lado izquierdo)
  let firmaTrabajadorUrl = getSign(datosFinales, "FIRMAP");
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

  
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  const centroColumna2 = tablaInicioX + 95 + ((tablaAncho - 95) / 2);
  doc.text("Sello y Firma del Médico", centroColumna2, yFirmas + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumna2, yFirmas + 28.5, { align: "center" });

   autoTable(doc, {
    startY: yFirmas + 32,
    margin: { left: 80, right: 80 },
    body: [
      [
        { content: "Apto:", styles: { valign: "middle", fontStyle: "bold", halign: "center" } },
        { content: `${datosFinales.conclusionApto ? "" : ""}`, styles: { valign: "middle", fontStyle: "bold", halign: "center" } },
        { content: "No Apto:", styles: { valign: "middle", fontStyle: "bold", halign: "center" } },
        { content: `${datosFinales.conclusionNoApto ? "" : ""}`, styles: { valign: "middle", fontStyle: "bold", halign: "center" } }
      ]
    ],
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 1,
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0], // 🔹 líneas negras
      lineWidth: 0.2,       // 🔹 grosor de línea
    },
    tableLineColor: [0, 0, 0], // 🔹 bordes externos negros
    tableLineWidth: 0.2,
  });


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
