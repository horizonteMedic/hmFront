import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { getSign, convertirGenero } from "../../utils/helpers";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';
import autoTable from "jspdf-autotable";

export default async function Ficha_interconsulta_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const datosReales = {
    apellidosNombres: String(`${data.apellidosPaciente ?? ""} ${data.nombresPaciente ?? ""}`).trim(),
    fechaExamen: formatearFechaCorta(data.fechaExamen ?? ""),
    tipoExamen: String(data.nombreExamen ?? ""),
    sexo: convertirGenero(data.sexoPaciente) || "",
    documentoIdentidad: String(data.dniPaciente ?? ""),
    edad: String(data.edadPaciente ?? ""),
    areaTrabajo: String(data.areaPaciente ?? ""),
    puestoTrabajo: String(data.cargoPaciente ?? ""),
    empresa: String(data.empresa ?? ""),
    contrata: String(data.contrata ?? ""),
    vitalSigns: {
      fc: String(data.frecuenciaCardiaca ?? ""),
      fr: String(data.frecuenciaRespiratoriaTriaje ?? ""),
      pa: [data.sistolica, data.diastolica].some(v => v !== undefined && v !== null)
        ? `${data.sistolica ?? ""}/${data.diastolica ?? ""}`
        : "",
      satO2: String(data.saturacionOxigenoTriaje ?? ""),
      imc: String(data.imcTriaje ?? ""),
      temperatura: String(data.temperatura ?? ""),
      peso: String(data.peso ?? ""),
      talla: String(data.tallaTriaje ?? "")
    },
    // Datos de color
    color: Number(data.color ?? 0),
    codigoColor: String(data.codigoColor ?? ""),
    textoColor: String(data.textoColor ?? ""),
    // Datos adicionales para header
    numeroFicha: String(data.norden ?? ""),
    sede: String(data.sede ?? data.nombreSede ?? ""),
    // Datos específicos de interconsulta
    codigoFichaInterconsulta: String(data.codigoFichaInterconsulta ?? ""),
    especialidad: String(data.especialidad ?? ""),
    esOftalmologia: Boolean(data.esOftalmologia ?? false),
    motivoInterconsulta: String(data.motivo ?? ""),
    fechaAtencion: formatearFechaCorta(data.fechaApertura ?? ""),
    hallazgosRelevantes: String(data.hallazgo ?? ""),
    diagnostico: String(data.diagnostico ?? ""),
    tratamientoRecomendaciones: String(data.tratamiento ?? ""),
    // Conclusión evaluación
    conclusionApto: Boolean(data.apto),
    conclusionNoApto: Boolean(data.noApto),
    // Datos oftalmológicos
    agudezaVisualCercaOD: String(data.visioncercasincorregirod_v_cerca_s_od ?? ""),
    agudezaVisualCercaOI: String(data.visioncercasincorregiroi_v_cerca_s_oi ?? ""),
    agudezaVisualCercaConOD: String(data.oftalodccmologia_odcc ?? ""),
    agudezaVisualCercaConOI: String(data.oiccoftalmologia_oicc ?? ""),
    agudezaVisualLejosOD: String(data.visionlejossincorregirod_v_lejos_s_od ?? ""),
    agudezaVisualLejosOI: String(data.visionlejossincorregiroi_v_lejos_s_oi ?? ""),
    agudezaVisualLejosConOD: String(data.odlcoftalmologia_odlc ?? ""),
    agudezaVisualLejosConOI: String(data.oilcoftalmologia_oilc ?? ""),
    testIshihara: String(data.vcoftalmologia_vc ?? ""),
    refPupilares: String(data.rpoftalmologia_rp ?? ""),
    enfermedadesOculares: String(data.enfermedadesocularesoftalmo_e_oculares ?? ""),
    // Datos del usuario médico
    nombreUsuario: String(data.nombreUsuario ?? ""),
    apellidoUsuario: String(data.apellidoUsuario ?? ""),
    cmpUsuario: String(data.cmpUsuario ?? ""),
    dniUsuario: String(data.dniUsuario ?? ""),
    // Datos de digitalización
    digitalizacion: Array.isArray(data.digitalizacion) ? data.digitalizacion : [],
    horaSalida: String(data.horaSalida ?? ""),
    direccionPaciente: String(data.direccionPaciente ?? ""),
    telefonoPaciente: String(data.celularPaciente ?? data.telefonoPaciente ?? "")
  };

  const datosFinales = datosReales;

  // Header reutilizable (similar a Anexo16ABoro_Digitalizado.jsx)
  const drawHeader = async (pageNumber) => {
    // Logo y membrete
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("FICHA DE INTERCONSULTA", pageW / 2, 33, { align: "center" }); // Reducido de 35 a 33
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
  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
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
          yPos += fontSize * 0.3; // Reducido de 0.35 a 0.3 para más compacto
          lineaActual = palabra;
        } else {
          doc.text(palabra, x, yPos);
          yPos += fontSize * 0.3;
        }
      }
    });

    if (lineaActual) {
      doc.text(lineaActual, x, yPos);
      yPos += fontSize * 0.3;
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
    doc.setFont("helvetica", "bold").setFontSize(8); // Reducido de 9 a 8
    doc.text(titulo, tablaInicioX + 2, yPos + 3); // Ajustado de 3.5 a 3

    return yPos + alturaHeader;
  };

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 10;
  const tablaAncho = 190;
  let yPos = 38; // Reducido de 40 a 38 para empezar más arriba
  const filaAltura = 5;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("HORA SALIDA:", tablaInicioX + 130, yPos - 1.5)
  doc.setFont("helvetica", "normal").setFontSize(8);
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

  // === Fila 1: Apellidos y Nombres ===
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.apellidosNombres || "", tablaInicioX + 40, yPos + 4);
  yPos += filaAltura;

  // === Fila 2: DNI, Edad, Sexo (3 columnas) ===
  const col1W = 63.33;
  const col2W = 63.33;
  const col3W = 63.34;

  doc.rect(tablaInicioX, yPos, col1W, filaAltura, 'S');
  doc.rect(tablaInicioX + col1W, yPos, col2W, filaAltura, 'S');
  doc.rect(tablaInicioX + col1W + col2W, yPos, col3W, filaAltura, 'S');

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI / CE / NIE:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad || "", tablaInicioX + 29, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + col1W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.edad || "") + " Años", tablaInicioX + col1W + 14, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Género:", tablaInicioX + col1W + col2W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.sexo || "", tablaInicioX + col1W + col2W + 14, yPos + 4);
  yPos += filaAltura;

  // === Fila 3: Área de Trabajo, Puesto de Trabajo (2 columnas) ===
  const anchoCol1 = 95;
  const anchoCol2 = 95;

  doc.rect(tablaInicioX, yPos, anchoCol1, filaAltura, 'S');
  doc.rect(tablaInicioX + anchoCol1, yPos, anchoCol2, filaAltura, 'S');

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.areaTrabajo || "", tablaInicioX + 30, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + anchoCol1 + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.puestoTrabajo || "", tablaInicioX + anchoCol1 + 30, yPos + 4);
  yPos += filaAltura;

  // === Fila 4: Empresa (con altura dinámica) ===
  doc.setFont("helvetica", "normal").setFontSize(8);
  const textoEmpresa = datosFinales.empresa || "";
  const lineasEmpresa = doc.splitTextToSize(textoEmpresa, tablaAncho - 25);
  const alturaEmpresa = Math.max(filaAltura, lineasEmpresa.length * 3.5 + 1);

  doc.rect(tablaInicioX, yPos, tablaAncho, alturaEmpresa, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (lineasEmpresa.length === 1) {
    doc.text(lineasEmpresa[0], tablaInicioX + 25, yPos + 4);
  } else {
    lineasEmpresa.forEach((linea, lineIdx) => {
      doc.text(linea, tablaInicioX + 25, yPos + 3.5 + (lineIdx * 3.5));
    });
  }
  yPos += alturaEmpresa;

  // === Fila 5: Contratista ===
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contrata || "", tablaInicioX + 25, yPos + 4);
  yPos += filaAltura;

  // === Fila 6: Dirección y Tel (2 columnas) ===
  const anchoDir = 140;
  const anchoTel = 50;

  doc.rect(tablaInicioX, yPos, anchoDir, filaAltura, 'S');
  doc.rect(tablaInicioX + anchoDir, yPos, anchoTel, filaAltura, 'S');

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Dirección:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.direccionPaciente || "", tablaInicioX + 25, yPos + 4);

  if (datosFinales.telefonoPaciente) {
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Tel:", tablaInicioX + anchoDir + 2, yPos + 4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.telefonoPaciente, tablaInicioX + anchoDir + 12, yPos + 4);
  }
  yPos += filaAltura;

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
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FC:", tablaInicioX + 2, yPrimeraFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.fc + " x min", tablaInicioX + 8, yPrimeraFila + 3);

  // FR (Frecuencia Respiratoria)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FR:", tablaInicioX + 40, yPrimeraFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.fr + " x min", tablaInicioX + 46, yPrimeraFila + 3);

  // PA (Presión Arterial)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("PA:", tablaInicioX + 78, yPrimeraFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.pa + " mmHg", tablaInicioX + 84, yPrimeraFila + 3);

  // Sat. O2 (Saturación de Oxígeno)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sat. O2:", tablaInicioX + 116, yPrimeraFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.satO2 + " %", tablaInicioX + 130, yPrimeraFila + 3);

  // IMC (Índice de Masa Corporal)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("IMC:", tablaInicioX + 154, yPrimeraFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.imc + " kg/m2", tablaInicioX + 162, yPrimeraFila + 3);

  // Segunda fila: T°, Peso, Talla
  const ySegundaFila = yPos; // La segunda fila está en la posición actual de yPos

  // Temperatura
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("T°:", tablaInicioX + 2, ySegundaFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.temperatura + " °C", tablaInicioX + 8, ySegundaFila + 3);

  // Peso
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Peso:", tablaInicioX + 65, ySegundaFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.peso + " kg", tablaInicioX + 75, ySegundaFila + 3);

  // Talla
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Talla:", tablaInicioX + 128, ySegundaFila + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.talla + " cm", tablaInicioX + 140, ySegundaFila + 3);

  yPos += filaAltura;

  // === SECCIÓN 3: EVALUACIÓN OFTALMOLÓGICA ===
  // Solo mostrar si es oftalmología o agudeza visual
  const mostrarSeccionOftalmologia = datosFinales.esOftalmologia ||
    datosFinales.especialidad.toUpperCase() === "OFTALMO" ||
    datosFinales.especialidad.toUpperCase() === "AGUDEZA VISUAL";

  if (mostrarSeccionOftalmologia) {
    // Header de evaluación oftalmológica
    yPos = dibujarHeaderSeccion("3. EVALUACIÓN OFTALMOLÓGICA", yPos, filaAltura);

    // Línea divisoria después del título
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

    // Configuración de la tabla manual
    const alturaFilaHeader = filaAltura; // Usar filaAltura (5mm)
    const anchoCol1 = 30; // Agudeza Visual
    const anchoCol2 = 35; // Sin correctores
    const anchoCol3 = 35; // Con correctores
    const anchoCol4 = 50; // V. Binocular
    const anchoCol5 = 40; // E. Oculares

    // Preparar textos para calcular altura dinámica
    doc.setFont("helvetica", "normal").setFontSize(8);
    const textosBinocularCerca = `Test de Ishihara: ${datosFinales.testIshihara || ""}`;
    const textosBinocularLejos = `Ref. Pupilares: ${datosFinales.refPupilares || ""}`;

    // Calcular altura necesaria para cada fila basada en el contenido más largo
    const calcularAlturaTexto = (texto, anchoMaximo) => {
      if (!texto) return filaAltura;
      const lineas = doc.splitTextToSize(texto, anchoMaximo);
      return Math.max(filaAltura, lineas.length * 3 + 2);
    };

    const alturaBinocularCerca = calcularAlturaTexto(textosBinocularCerca, anchoCol4 - 4);
    const alturaBinocularLejos = calcularAlturaTexto(textosBinocularLejos, anchoCol4 - 4);
    // Todas las filas usan la misma altura (la máxima necesaria)
    const alturaFilaComun = Math.max(filaAltura, alturaBinocularCerca, alturaBinocularLejos);
    const alturaTotal = alturaFilaHeader + (alturaFilaComun * 2);

    // Dibujar líneas del header
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior

    // Dibujar columnas verticales
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaTotal); // Línea izquierda
    doc.line(tablaInicioX + anchoCol1, yPos, tablaInicioX + anchoCol1, yPos + alturaTotal); // Col 1
    doc.line(tablaInicioX + anchoCol1 + anchoCol2, yPos, tablaInicioX + anchoCol1 + anchoCol2, yPos + alturaTotal); // Col 2
    doc.line(tablaInicioX + anchoCol1 + anchoCol2 + anchoCol3, yPos, tablaInicioX + anchoCol1 + anchoCol2 + anchoCol3, yPos + alturaTotal); // Col 3
    doc.line(tablaInicioX + anchoCol1 + anchoCol2 + anchoCol3 + anchoCol4, yPos, tablaInicioX + anchoCol1 + anchoCol2 + anchoCol3 + anchoCol4, yPos + alturaTotal); // Col 4
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaTotal); // Línea derecha

    // Posición de E. Oculares
    const xEOculares = tablaInicioX + anchoCol1 + anchoCol2 + anchoCol3 + anchoCol4;

    // Dibujar líneas horizontales principales
    doc.line(tablaInicioX, yPos + alturaFilaHeader, tablaInicioX + tablaAncho, yPos + alturaFilaHeader); // Después del header (incluyendo E. Oculares)
    doc.line(tablaInicioX, yPos + alturaFilaHeader + alturaFilaComun, tablaInicioX + tablaAncho, yPos + alturaFilaHeader + alturaFilaComun); // Después de Cerca (incluyendo E. Oculares)
    doc.line(tablaInicioX, yPos + alturaTotal, tablaInicioX + tablaAncho, yPos + alturaTotal); // Línea inferior completa

    // HEADER - Textos de las columnas (títulos en bold, tamaño normal)
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Agudeza Visual", tablaInicioX + anchoCol1 / 2, yPos + alturaFilaHeader / 2 + 1.5, { align: "center" });
    doc.text("Sin correctores", tablaInicioX + anchoCol1 + anchoCol2 / 2, yPos + alturaFilaHeader / 2 + 1.5, { align: "center" });
    doc.text("Con correctores", tablaInicioX + anchoCol1 + anchoCol2 + anchoCol3 / 2, yPos + alturaFilaHeader / 2 + 1.5, { align: "center" });
    doc.text("V. Binocular", tablaInicioX + anchoCol1 + anchoCol2 + anchoCol3 + anchoCol4 / 2, yPos + alturaFilaHeader / 2 + 1.5, { align: "center" });
    doc.text("E. Oculares", tablaInicioX + anchoCol1 + anchoCol2 + anchoCol3 + anchoCol4 + anchoCol5 / 2, yPos + alturaFilaHeader / 2 + 1.5, { align: "center" });

    // Línea divisoria debajo del título "V. Binocular" (dentro de la celda del header)
    const xVBinocular = tablaInicioX + anchoCol1 + anchoCol2 + anchoCol3;
    doc.line(xVBinocular, yPos + alturaFilaHeader / 2 + 2.5, xVBinocular + anchoCol4, yPos + alturaFilaHeader / 2 + 2.5);

    // Línea divisoria debajo del título "E. Oculares" (dentro de la celda del header)
    doc.line(xEOculares, yPos + alturaFilaHeader / 2 + 2.5, xEOculares + anchoCol5, yPos + alturaFilaHeader / 2 + 2.5);

    // FILA 1: CERCA
    let yFila1 = yPos + alturaFilaHeader;
    const mitadFila1 = yFila1 + alturaFilaComun / 2;

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Cerca", tablaInicioX + anchoCol1 / 2, mitadFila1 + 1, { align: "center" });

    doc.setFont("helvetica", "normal").setFontSize(8);

    // Sin correctores - con línea divisoria
    const xSinCorrectores = tablaInicioX + anchoCol1;
    doc.line(xSinCorrectores, yFila1, xSinCorrectores + anchoCol2, yFila1); // Línea superior celda
    doc.line(xSinCorrectores, mitadFila1, xSinCorrectores + anchoCol2, mitadFila1); // Línea divisoria OD/OI
    doc.line(xSinCorrectores, yFila1 + alturaFilaComun, xSinCorrectores + anchoCol2, yFila1 + alturaFilaComun); // Línea inferior celda
    doc.text(`OD: ${datosFinales.agudezaVisualCercaOD || ""}`, xSinCorrectores + 2, yFila1 + alturaFilaComun / 4 + 1);
    doc.text(`OI: ${datosFinales.agudezaVisualCercaOI || ""}`, xSinCorrectores + 2, mitadFila1 + alturaFilaComun / 4 + 1);

    // Con correctores - con línea divisoria
    const xConCorrectores = tablaInicioX + anchoCol1 + anchoCol2;
    doc.line(xConCorrectores, yFila1, xConCorrectores + anchoCol3, yFila1); // Línea superior celda
    doc.line(xConCorrectores, mitadFila1, xConCorrectores + anchoCol3, mitadFila1); // Línea divisoria OD/OI
    doc.line(xConCorrectores, yFila1 + alturaFilaComun, xConCorrectores + anchoCol3, yFila1 + alturaFilaComun); // Línea inferior celda
    doc.text(`OD: ${datosFinales.agudezaVisualCercaConOD || ""}`, xConCorrectores + 2, yFila1 + alturaFilaComun / 4 + 1);
    doc.text(`OI: ${datosFinales.agudezaVisualCercaConOI || ""}`, xConCorrectores + 2, mitadFila1 + alturaFilaComun / 4 + 1);

    // V. Binocular - Cerca
    doc.text(textosBinocularCerca, tablaInicioX + anchoCol1 + anchoCol2 + anchoCol3 + 2, yFila1 + 3.5, { maxWidth: anchoCol4 - 4, align: "left" });

    // E. Oculares - Fila 1 (Cerca)
    const enfermedadesOculares = datosFinales.enfermedadesOculares || "";
    if (enfermedadesOculares && enfermedadesOculares.trim() !== "") {
      const maxAnchoEOculares = anchoCol5 - 4;
      const lineasEOculares1 = doc.splitTextToSize(enfermedadesOculares, maxAnchoEOculares);
      let yEOculares1 = yFila1 + 3.5;
      const limiteSuperiorY = yFila1 + alturaFilaComun - 1;
      lineasEOculares1.forEach((linea) => {
        if (yEOculares1 < limiteSuperiorY && xEOculares + 2 + maxAnchoEOculares <= tablaInicioX + tablaAncho) {
          doc.text(linea, xEOculares + 2, yEOculares1, { maxWidth: maxAnchoEOculares, align: "left" });
          yEOculares1 += 3; // Espaciado entre líneas
        }
      });
    }

    // FILA 2: LEJOS
    let yFila2 = yPos + alturaFilaHeader + alturaFilaComun;
    const mitadFila2 = yFila2 + alturaFilaComun / 2;

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Lejos", tablaInicioX + anchoCol1 / 2, mitadFila2 + 1, { align: "center" });

    doc.setFont("helvetica", "normal").setFontSize(8);

    // Sin correctores - con línea divisoria
    doc.line(xSinCorrectores, yFila2, xSinCorrectores + anchoCol2, yFila2); // Línea superior celda
    doc.line(xSinCorrectores, mitadFila2, xSinCorrectores + anchoCol2, mitadFila2); // Línea divisoria OD/OI
    doc.line(xSinCorrectores, yFila2 + alturaFilaComun, xSinCorrectores + anchoCol2, yFila2 + alturaFilaComun); // Línea inferior celda
    doc.text(`OD: ${datosFinales.agudezaVisualLejosOD || ""}`, xSinCorrectores + 2, yFila2 + alturaFilaComun / 4 + 1);
    doc.text(`OI: ${datosFinales.agudezaVisualLejosOI || ""}`, xSinCorrectores + 2, mitadFila2 + alturaFilaComun / 4 + 1);

    // Con correctores - con línea divisoria
    doc.line(xConCorrectores, yFila2, xConCorrectores + anchoCol3, yFila2); // Línea superior celda
    doc.line(xConCorrectores, mitadFila2, xConCorrectores + anchoCol3, mitadFila2); // Línea divisoria OD/OI
    doc.line(xConCorrectores, yFila2 + alturaFilaComun, xConCorrectores + anchoCol3, yFila2 + alturaFilaComun); // Línea inferior celda
    doc.text(`OD: ${datosFinales.agudezaVisualLejosConOD || ""}`, xConCorrectores + 2, yFila2 + alturaFilaComun / 4 + 1);
    doc.text(`OI: ${datosFinales.agudezaVisualLejosConOI || ""}`, xConCorrectores + 2, mitadFila2 + alturaFilaComun / 4 + 1);

    // V. Binocular - Lejos
    doc.text(textosBinocularLejos, tablaInicioX + anchoCol1 + anchoCol2 + anchoCol3 + 2, yFila2 + 3.5, { maxWidth: anchoCol4 - 4, align: "left" });

    // E. Oculares - Fila 2 (Lejos)
    if (enfermedadesOculares && enfermedadesOculares.trim() !== "") {
      const maxAnchoEOculares = anchoCol5 - 4;
      const lineasEOculares2 = doc.splitTextToSize(enfermedadesOculares, maxAnchoEOculares);
      let yEOculares2 = yFila2 + 3.5;
      const limiteSuperiorY = yFila2 + alturaFilaComun - 1;
      lineasEOculares2.forEach((linea) => {
        if (yEOculares2 < limiteSuperiorY && xEOculares + 2 + maxAnchoEOculares <= tablaInicioX + tablaAncho) {
          doc.text(linea, xEOculares + 2, yEOculares2, { maxWidth: maxAnchoEOculares, align: "left" });
          yEOculares2 += 3; // Espaciado entre líneas
        }
      });
    }

    yPos = yPos + alturaTotal;
  }

  // === FUNCIÓN PARA CALCULAR ALTURA DINÁMICA ===
  const calcularAlturaHallazgos = (texto, anchoMaximo) => {
    if (!texto || texto.trim() === "") return 24; // Reducido de 20 a 15

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

    // Altura por línea de 2.5mm (reducido de 3mm)
    const alturaCalculada = lineas * 2.5 + 2;
    return Math.max(alturaCalculada, 24); // Altura mínima reducida de 20 a 15
  };

  // === SECCIÓN 4: MOTIVO DE INTERCONSULTA ===
  // Header de motivo de interconsulta
  yPos = dibujarHeaderSeccion("4. MOTIVO DE INTERCONSULTA", yPos, filaAltura);

  // Fila "Motivo de Interconsulta:" (fila celeste)
  doc.setFillColor(199, 241, 255); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Motivo de Interconsulta:", tablaInicioX + 2, yPos + 3);
  yPos += filaAltura;

  // Fila de contenido del motivo (2 columnas: motivo y firma del médico)
  const motivoTexto = datosFinales.motivoInterconsulta || "";
  const anchoColumnaMotivo = 150;
  const anchoColumnaFirma = tablaAncho - anchoColumnaMotivo;

  // Calcular altura considerando el texto con saltos de línea
  doc.setFont("helvetica", "normal").setFontSize(8);
  const lineasMotivo = motivoTexto.split('\n').filter(linea => linea.trim() !== '');
  let alturaTotalTexto = 0;
  const anchoMaximoTexto = anchoColumnaMotivo - 6; // Ancho de la primera columna menos padding (más margen para evitar overflow)

  lineasMotivo.forEach((linea) => {
    const lineaTrim = linea.trim();
    const textoFinal = lineaTrim.startsWith('-') ? lineaTrim : `- ${lineaTrim}`;
    const lineasTexto = doc.splitTextToSize(textoFinal, anchoMaximoTexto);
    alturaTotalTexto += lineasTexto.length * 2.5 + 0.5;
  });

  const alturaFilaMotivo = Math.max(15, alturaTotalTexto + 2);

  // Dibujar líneas de la fila con dos columnas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaMotivo);
  doc.line(tablaInicioX + anchoColumnaMotivo, yPos, tablaInicioX + anchoColumnaMotivo, yPos + alturaFilaMotivo);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaMotivo);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaMotivo, tablaInicioX + tablaAncho, yPos + alturaFilaMotivo);

  // Dibujar el texto del motivo en la primera columna
  let yTextoMotivo = yPos + 3;

  lineasMotivo.forEach((linea) => {
    const lineaTrim = linea.trim();
    // Si la línea ya empieza con guión, mantenerlo; si no, agregarlo
    const textoFinal = lineaTrim.startsWith('-') ? lineaTrim : `- ${lineaTrim}`;

    // Usar splitTextToSize para garantizar que el texto no exceda el ancho de la columna
    const lineasWrapped = doc.splitTextToSize(textoFinal, anchoMaximoTexto);
    lineasWrapped.forEach((lineaWrapped) => {
      doc.text(lineaWrapped, tablaInicioX + 2, yTextoMotivo);
      yTextoMotivo += 2.5; // Espaciado entre líneas
    });
    yTextoMotivo += 0.5; // Espaciado extra entre items
  });


  // Agregar sello y firma del médico en la segunda columna
  let firmaMedicoMotivo = getSign(datosFinales, "SELLOFIRMA");
  if (firmaMedicoMotivo) {
    try {
      const imgWidth = 35;
      const imgHeight = 13;
      const xFirmaMotivo = tablaInicioX + anchoColumnaMotivo + (anchoColumnaFirma / 2) - (imgWidth / 2); // Centrado en la segunda columna
      const yFirmaMotivo = yPos + (alturaFilaMotivo / 2) - (imgHeight / 2); // Centrado verticalmente
      doc.addImage(firmaMedicoMotivo, 'PNG', xFirmaMotivo, yFirmaMotivo, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico en motivo:", error);
    }
  }

  yPos += alturaFilaMotivo;

  // Fila "EVALUACIÓN DE ESPECIALISTA (medicina interna)" (fila gris)
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(`EVALUACIÓN DE ESPECIALISTA: ${datosFinales.especialidad} `, tablaInicioX + tablaAncho / 2, yPos + 3, { align: "center" });
  yPos += filaAltura;

  // Fila "Fecha atención" (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha atención:", tablaInicioX + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);

  yPos += filaAltura;

  // Fila "Hallazgos relevantes:" (fila celeste)
  doc.setFillColor(199, 241, 255); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
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
  let yTextoHallazgos = yPos + 3; // Reducido de 5 a 3

  lineasHallazgos.forEach(linea => {
    const textoConGuion = `- ${linea.trim()}`;
    yTextoHallazgos = dibujarTextoConSaltoLinea(textoConGuion, tablaInicioX + 2, yTextoHallazgos, anchoMaximoHallazgos);
    yTextoHallazgos += 2; // Reducido de 3 a 2
  });

  yPos += alturaFilaHallazgos;

  // Fila "Diagnóstico:" (fila celeste)
  doc.setFillColor(199, 241, 255); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
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
  let yTextoDiagnostico = yPos + 3; // Reducido de 5 a 3

  lineasDiagnostico.forEach(linea => {
    const textoConGuion = `- ${linea.trim()}`;
    yTextoDiagnostico = dibujarTextoConSaltoLinea(textoConGuion, tablaInicioX + 2, yTextoDiagnostico, anchoMaximoHallazgos);
    yTextoDiagnostico += 2; // Reducido de 3 a 2
  });

  yPos += alturaFilaDiagnostico;

  // Fila "Tratamiento y recomendaciones vinculadas a la actividad laboral:" (fila celeste)
  doc.setFillColor(199, 241, 255); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
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
  let yTextoTratamiento = yPos + 3; // Reducido de 5 a 3

  lineasTratamiento.forEach(linea => {
    const textoConGuion = `- ${linea.trim()}`;
    yTextoTratamiento = dibujarTextoConSaltoLinea(textoConGuion, tablaInicioX + 2, yTextoTratamiento, anchoMaximoHallazgos);
    yTextoTratamiento += 2; // Reducido de 3 a 2
  });

  yPos += alturaFilaTratamiento;

  // === SECCIÓN DE FIRMAS ===
  const yFirmas = yPos; // Continuar directamente desde la sección anterior
  const alturaSeccionFirmas = 26; // Reducido de 28 a 22 para más compacto

  // Dibujar las líneas de la sección de firmas (solo columna del trabajador)
  doc.line(tablaInicioX, yFirmas, tablaInicioX, yFirmas + alturaSeccionFirmas); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea derecha
  doc.line(tablaInicioX, yFirmas, tablaInicioX + tablaAncho, yFirmas); // Línea superior
  doc.line(tablaInicioX, yFirmas + alturaSeccionFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea inferior

  // === FIRMA Y HUELLA DEL TRABAJADOR ===
  const firmaTrabajadorY = yFirmas + 2; // Reducido de 3 a 2

  // Calcular centro de la columna 1 para centrar las imágenes
  const centroColumna1X = tablaInicioX + (70 / 2); // Centro de la columna 1

  // Agregar firma del trabajador (lado izquierdo)
  let firmaTrabajadorUrl = await getSign(datosFinales, "FIRMAP");
  if (firmaTrabajadorUrl) {
    try {
      const imgWidth = 28; // Reducido de 30 a 28
      const imgHeight = 18; // Reducido de 20 a 18
      const x = centroColumna1X - 18; // Ajustado
      const y = firmaTrabajadorY;
      doc.addImage(firmaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del trabajador:", error);
    }
  }

  // Agregar huella del trabajador (lado derecho, vertical)
  let huellaTrabajadorUrl = await getSign(datosFinales, "HUELLA");
  if (huellaTrabajadorUrl) {
    try {
      const imgWidth = 11; // Reducido de 12 a 11
      const imgHeight = 18; // Reducido de 20 a 18
      const x = centroColumna1X + 10; // Ajustado
      const y = firmaTrabajadorY;
      doc.addImage(huellaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando huella del trabajador:", error);
    }
  }

  // === COLUMNA 2: SELLO Y FIRMA DEL MÉDICO ===
  const centroColumna2 = tablaInicioX + 95 + ((tablaAncho - 95) / 2);
  const firmaMedicoY = yFirmas + 2; // Posición más arriba



  // Texto del trabajador - más cerca de las imágenes
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Firma y Huella del trabajador", 50, yFirmas + 20, { align: "center" }); // Reducido de 26 a 20

  doc.text("Firma del Médico", 150, yFirmas + 20, { align: "center" }); // Reducido de 26 a 20

  // Solo mostrar APTO/NO APTO si la empresa NO es CONSORCIO COPTOS ni HIDRANDINA
  const empresaUpper = (datosFinales.empresa || "").toUpperCase().trim();
  const ocultarAptoNoApto = empresaUpper === "CONSORCIO COPTOS" ||
    empresaUpper === "EMPRESA REGIONAL DE SERVICIO PUBLICO DE ELECTRICIDAD ELECTRONORTEMEDIO SOCIEDAD ANONIMA - HIDRANDINA";

  if (!ocultarAptoNoApto) {
    autoTable(doc, {
      startY: yFirmas + alturaSeccionFirmas + 2, // Reducido espacio después de firmas
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
  }


  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });

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
