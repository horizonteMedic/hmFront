import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { convertirGenero, getSign } from "../../utils/helpers";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function Anexo7C_Nuevo(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente) + " " + (data.nombresPaciente)).trim(),
    fechaExamen: formatearFechaCorta(data.fechaExamen_fecha),
    tipoExamen: String(data.nombreExamen),
    sexo: convertirGenero(data.sexoPaciente),
    documentoIdentidad: String(data.dniPaciente),
    edad: String(data.edadPaciente),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente),
    areaTrabajo: data.areaPaciente,
    puestoTrabajo: data.cargoPaciente,
    empresa: data.empresa,
    contrata: data.contrata,
    actividadEconomica: data.actividadEconomica || '',
    resideEnLugarTrabajo: data.resideEnLugarTrabajo ? 'SI' : 'NO',
    tiempoResidencia: data.tiempoResidencia || '',
    correoElectronico: data.correoElectronico || '',
    estadoCivil: data.estadoCivil || '',
    numTotalHijos: data.numTotalHijos || '',
    numDependientes: data.numDependientes || '',
    essalud: data.essalud || false,
    eps: data.eps || false,
    otro1: data.otro1 || false,
    scrt: data.scrt || false,
    otro2: data.otro2 || false,
    // Datos adicionales para header
    numeroFicha: String(data.norden),
    sede: data.sede || data.nombreSede,
    direccionPaciente: String(data.direccionPaciente),
    departamento: data.departamentoPaciente,
    provincia: data.provinciaPaciente,
    distrito: data.distritoPaciente,
    // Datos de color
    color: data.color,
    codigoColor: data.codigoColor,
    textoColor: data.textoColor,
    // Nuevos campos agregados
    gradoEstudios: data.gradoEstudios || '',
    mineralesExplotados: data.mineralesExplotados || '',
    reubicacion: data.reubicacion || '',
    explotacion: data.explotacion || '',
    alturaLabor: data.alturaLabor || '',
    // Campos para antecedentes ocupacionales
    antecedentesPersonales: data.antecedentesPersonales || '',
    antecedentesFamiliares: data.antecedentesFamiliares || '',
    tetano: data.tetano || false,
    hepatitisB: data.hepatitisB || false,
    fiebreAmarilla: data.fiebreAmarilla || false,
    numeroHijosVivos: data.numeroHijosVivos || '',
    numeroHijosMuertos: data.numeroHijosMuertos || '',
    // Hábitos nocivos
    alcohol_si: data.alcohol_si || false,
    alcohol_tipo: data.alcohol_tipo || '',
    alcohol_cantidad_frecuencia: data.alcohol_cantidad_frecuencia || '',
    alcohol_frecuencia: data.alcohol_frecuencia || 'nada', // nada, poco, habitual, excesivo
    tabaco_si: data.tabaco_si || false,
    tabaco_tipo: data.tabaco_tipo || '',
    tabaco_cantidad_frecuencia: data.tabaco_cantidad_frecuencia || '',
    tabaco_frecuencia: data.tabaco_frecuencia || 'nada', // nada, poco, habitual, excesivo
    drogas_si: data.drogas_si || false,
    drogas_tipo: data.drogas_tipo || '',
    drogas_cantidad_frecuencia: data.drogas_cantidad_frecuencia || '',
    drogas_frecuencia: data.drogas_frecuencia || 'nada', // nada, poco, habitual, excesivo
    medicamento_si: data.medicamento_si || false,
    medicamento_tipo: data.medicamento_tipo || '',
    medicamento_cantidad_frecuencia: data.medicamento_cantidad_frecuencia || '',
    // Nuevos campos para espirometría y antropometría
    fvc: data.fvc || '',
    fev1fvc: data.fev1fvc || '',
    fev1: data.fev1 || '',
    fef: data.fef || '',
    conclusionEspirometria: data.conclusionEspirometria || '',
    temp: data.temp || '',
    cintura: data.cintura || '',
    cadera: data.cadera || '',
    icc: data.icc || '',
    talla: data.talla || '',
    peso: data.peso || '',
    imc: data.imc || '',
    // Oídos (audiometría)
    oidoDerecho500: data.oidoDerecho500 || '',
    oidoDerecho1000: data.oidoDerecho1000 || '',
    oidoDerecho2000: data.oidoDerecho2000 || '',
    oidoDerecho3000: data.oidoDerecho3000 || '',
    oidoDerecho4000: data.oidoDerecho4000 || '',
    oidoDerecho5000: data.oidoDerecho5000 || '',
    oidoDerecho8000: data.oidoDerecho8000 || '',
    oidoIzquierdo500: data.oidoIzquierdo500 || '',
    oidoIzquierdo1000: data.oidoIzquierdo1000 || '',
    oidoIzquierdo2000: data.oidoIzquierdo2000 || '',
    oidoIzquierdo3000: data.oidoIzquierdo3000 || '',
    oidoIzquierdo4000: data.oidoIzquierdo4000 || '',
    oidoIzquierdo5000: data.oidoIzquierdo5000 || '',
    oidoIzquierdo8000: data.oidoIzquierdo8000 || '',
    // Otoscopia y Cardiovascular
    otoscopiaOD: data.otoscopiaOD || '',
    otoscopiaOI: data.otoscopiaOI || '',
    cardiovascular: data.cardiovascular || '',
    // Signos vitales adicionales
    fRespiratoria: data.fRespiratoria || '',
    fCardiaca: data.fCardiaca || '',
    satO2: data.satO2 || '',
    presionSistolica: data.presionSistolica || '',
    presionDiastolica: data.presionDiastolica || '',
    // Datos para PULMONES
    pulmonesNormal: data.pulmonesNormal || false,
    pulmonesAnormal: data.pulmonesAnormal || false,
    pulmonesDescripcion: data.pulmonesDescripcion || '',
    // Datos para PIEL
    pielNormal: data.pielNormal || false,
    pielAnormal: data.pielAnormal || false,
    pielDescripcion: data.pielDescripcion || '',
    // Datos para página 2 - Examen físico
    miembrosSuperiores: data.miembrosSuperiores || '',
    miembrosInferiores: data.miembrosInferiores || '',
    reflejosOsteotendinosos: data.reflejosOsteotendinosos || '',
    marcha: data.marcha || '',
    columnaVertebral: data.columnaVertebral || '',
    abdomen: data.abdomen || '',
    tactoRectal: data.tactoRectal || '',
    anillosInguinales: data.anillosInguinales || '',
    hernias: data.hernias || '',
    varices: data.varices || '',
    organosGenitales: data.organosGenitales || '',
    gangliosLinfaticos: data.gangliosLinfaticos || '',
    // Datos para evaluación mental y radiología
    lenguajeAtencionMemoria: data.lenguajeAtencionMemoria || '',
    anamnesis: data.anamnesis || '',
    estadoMental: data.estadoMental || '',
    nroRx: data.nroRx || '',
    fechaRx: data.fechaRx || '',
    calidadRx: data.calidadRx || '',
    simbolosRx: data.simbolosRx || '',
    vertices: data.vertices || '',
    camposPulmonares: data.camposPulmonares || '',
    mediastinos: data.mediastinos || '',
    helios: data.helios || '',
    senos: data.senos || '',
    siluetaCardiovascular: data.siluetaCardiovascular || '',
    conclusionesRadiograficas: data.conclusionesRadiograficas || '',
    // Nuevos campos para neumoconiosis y serología (agregados para página 2)
    neumoconiosisCategoria: data.neumoconiosisCategoria || '', // e.g., '1/1', 'A', etc.
    sinNeumoconiosis: data.sinNeumoconiosis || '',
    imagenRadiograficaExposicionPolvo: data.imagenRadiograficaExposicionPolvo || '',
    conNeumoconiosis: data.conNeumoconiosis || '',
    reaccionesSerologicasLues: data.reaccionesSerologicasLues || '',
    // Campos para exámenes de laboratorio
    vsg: data.vsg || '',
    glucosa: data.glucosa || '',
    urea: data.urea || '',
    creatinina: data.creatinina || '',
    ldl: data.ldl || '',
    hdl: data.hdl || '',
    vldl: data.vldl || '',
    trigliceridos: data.trigliceridos || '',
    colesterolTotal: data.colesterolTotal || '',
    cocaina: data.cocaina || '',
    marihuana: data.marihuana || '',
    mercurio: data.mercurio || '',
    plomo: data.plomo || '',
    grupoSanguineo: data.grupoSanguineo || '',
    factorRh: data.factorRh || '',
    hemoglobinaHematocrito: data.hemoglobinaHematocrito || '',
    aptoParaTrabajar: data.aptoParaTrabajar || '',
    otrosExamenes: data.otrosExamenes || '',
    conclusiones: data.conclusiones || '',
    recomendacionesRestricciones: data.recomendacionesRestricciones || '',
  };

  // Usar solo datos reales
  const datosFinales = datosReales;

  // Lista de hábitos nocivos
  const habitosNocivos = [
    { name: 'Alcohol', si: datosFinales.alcohol_si, tipo: datosFinales.alcohol_tipo, cantidad: datosFinales.alcohol_cantidad_frecuencia },
    { name: 'Tabaco', si: datosFinales.tabaco_si, tipo: datosFinales.tabaco_tipo, cantidad: datosFinales.tabaco_cantidad_frecuencia },
    { name: 'Drogas', si: datosFinales.drogas_si, tipo: datosFinales.drogas_tipo, cantidad: datosFinales.drogas_cantidad_frecuencia },
    { name: 'Medicamento', si: datosFinales.medicamento_si, tipo: datosFinales.medicamento_tipo, cantidad: datosFinales.medicamento_cantidad_frecuencia }
  ];

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.text("ANEXO 16", pageW / 2, 28, { align: "center" });
      doc.text("FICHA MEDICA Ocupacional", pageW / 2, 32, { align: "center" });
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
    const tablaInicioX = 5;
    const tablaAncho = 200;
    
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

  // Función para dibujar header de sección con fondo celeste (azul claro)
  const dibujarHeaderSeccionCeleste = (titulo, yPos, alturaHeader = 4) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar fondo celeste
    doc.setFillColor(173, 216, 230);
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

  // Función para dibujar fila con división de dos columnas y títulos
  const dibujarFilaConDosColumnas = (tituloCol1, tituloCol2, yPos, alturaFila = 5) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + alturaFila); // División central
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFila, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior

    // Dibujar títulos de las columnas
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(tituloCol1, tablaInicioX + 2, yPos + 3.5);
    doc.text(tituloCol2, tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);

    return yPos + alturaFila; // Retorna la nueva posición Y
  };

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 35.5;
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

  // Fila: Estado Civil, Grado de Estudios (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Minerales explotados o procesados, Reubicación (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Explotación, Altura de la labor (MSNM) (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 35.5 + filaAltura + 2.5; // Ajustar para el header

  // Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Ajustar ancho para la nueva división (hasta x = tablaInicioX + 140)
  doc.text(datosFinales.apellidosNombres || "", tablaInicioX + 35, yTexto + 1);

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
  doc.text(datosFinales.direccionPaciente || "", tablaInicioX + 25, yTexto + 1);
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
  doc.text(datosFinales.empresa || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contrata || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Estado Civil, Grado de Estudios
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Estado Civil:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.estadoCivil || "", tablaInicioX + 25, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Grado de Estudios:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.gradoEstudios || "", tablaInicioX + 118, yTexto + 1);
  yTexto += filaAltura;

  // Minerales explotados o procesados, Reubicación
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Minerales explotados o procesados:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.mineralesExplotados || "", tablaInicioX + 35, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Reubicación:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.reubicacion || "", tablaInicioX + 115, yTexto + 1);
  yTexto += filaAltura;

  // Explotación, Altura de la labor (MSNM)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Explotación:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.explotacion || "", tablaInicioX + 25, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Altura de la labor (MSNM):", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.alturaLabor || "", tablaInicioX + 125, yTexto + 1);
  yTexto += filaAltura;

  // === SECCIÓN DE FACTORES DE RIESGO OCUPACIONALES ===
  yPos = dibujarHeaderSeccion("FACTORES DE RIESGO OCUPACIONALES", yPos, filaAltura);

  // Calcular divisiones para 8 columnas (4 factores + 4 espacios para X)
  const colWidth = tablaAncho / 8; // Ancho de cada columna
  const colPositions = [];
  for (let i = 0; i <= 8; i++) {
    colPositions.push(tablaInicioX + (i * colWidth));
  }

  // Fila 1: Ruido | | Cancerigenos | | temperatura | | carga | |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < 8; i++) {
    doc.line(colPositions[i], yPos, colPositions[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 2: polvo | | mutagenos | | biologicos | | mov. repet. | |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < 8; i++) {
    doc.line(colPositions[i], yPos, colPositions[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 3: vib segmentario | | solventes | | posturas | | PVD | |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < 8; i++) {
    doc.line(colPositions[i], yPos, colPositions[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 4: vib total | | metales | | turno | | otros | |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < 8; i++) {
    doc.line(colPositions[i], yPos, colPositions[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE FACTORES DE RIESGO ===
  let yTextoFactores = yPos - (4 * filaAltura) + 2.5;

  // Fila 1: Ruido, Cancerigenos, temperatura, carga
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Ruido", colPositions[0] + 2, yTextoFactores + 1);
  doc.text("Cancerigenos", colPositions[2] + 2, yTextoFactores + 1);
  doc.text("temperatura", colPositions[4] + 2, yTextoFactores + 1);
  doc.text("carga", colPositions[6] + 2, yTextoFactores + 1);
  yTextoFactores += filaAltura;

  // Fila 2: polvo, mutagenos, biologicos, mov. repet.
  doc.text("polvo", colPositions[0] + 2, yTextoFactores + 1);
  doc.text("mutagenos", colPositions[2] + 2, yTextoFactores + 1);
  doc.text("biologicos", colPositions[4] + 2, yTextoFactores + 1);
  doc.text("mov. repet.", colPositions[6] + 2, yTextoFactores + 1);
  yTextoFactores += filaAltura;

  // Fila 3: vib segmentario, solventes, posturas, PVD
  doc.text("vib segmentario", colPositions[0] + 2, yTextoFactores + 1);
  doc.text("solventes", colPositions[2] + 2, yTextoFactores + 1);
  doc.text("posturas", colPositions[4] + 2, yTextoFactores + 1);
  doc.text("PVD", colPositions[6] + 2, yTextoFactores + 1);
  yTextoFactores += filaAltura;

  // Fila 4: vib total, metales, turno, otros
  doc.text("vib total", colPositions[0] + 2, yTextoFactores + 1);
  doc.text("metales", colPositions[2] + 2, yTextoFactores + 1);
  doc.text("turno", colPositions[4] + 2, yTextoFactores + 1);
  doc.text("otros", colPositions[6] + 2, yTextoFactores + 1);
  yTextoFactores += filaAltura;

  // === SECCIÓN 2: ANTECEDENTES OCUPACIONALES ===
  yPos = dibujarHeaderSeccion("2. ANTECEDENTES OCUPACIONALES", yPos, filaAltura);

  // Fila: Antecedentes personales (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Antecedentes familiares (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Inmunizaciones | Tetano | X | Hepatitis-B | X | Fiebre amarilla | X |
  const colInmunizacionWidth = 40;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura); // División después de "Inmunizaciones"
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura); // División después de Tetano
  doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + filaAltura); // División después de Hepatitis-B
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Número de hijos | Vivos: {data} | Muertos: {data} |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura); // División después de "Número de hijos"
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura); // División después de "Vivos"
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA SECCIÓN ANTECEDENTES OCUPACIONALES ===
  let yTextoAntecedentes = yPos - (4 * filaAltura) + 2.5; // Ajustar para el header

  // Antecedentes personales
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Antecedentes personales:", tablaInicioX + 2, yTextoAntecedentes + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.antecedentesPersonales || "", tablaInicioX + 35, yTextoAntecedentes + 1);
  yTextoAntecedentes += filaAltura;

  // Antecedentes familiares
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Antecedentes familiares:", tablaInicioX + 2, yTextoAntecedentes + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.antecedentesFamiliares || "", tablaInicioX + 35, yTextoAntecedentes + 1);
  yTextoAntecedentes += filaAltura;

  // Inmunizaciones
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Inmunizaciones:", tablaInicioX + 2, yTextoAntecedentes + 1);

  // Tetano
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Tetano:", tablaInicioX + 52, yTextoAntecedentes + 1);
  if (datosFinales.tetano) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 75, yTextoAntecedentes + 1);
  }

  // Hepatitis-B
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Hepatitis-B:", tablaInicioX + 92, yTextoAntecedentes + 1);
  if (datosFinales.hepatitisB) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 115, yTextoAntecedentes + 1);
  }

  // Fiebre amarilla
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Fiebre amarilla:", tablaInicioX + 132, yTextoAntecedentes + 1);
  if (datosFinales.fiebreAmarilla) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 155, yTextoAntecedentes + 1);
  }
  yTextoAntecedentes += filaAltura;

  // Número de hijos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Número de hijos:", tablaInicioX + 2, yTextoAntecedentes + 1);

  // Vivos
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Vivos:", tablaInicioX + 52, yTextoAntecedentes + 1);
  doc.text(datosFinales.numeroHijosVivos || "", tablaInicioX + 65, yTextoAntecedentes + 1);

  // Muertos
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Muertos:", tablaInicioX + 122, yTextoAntecedentes + 1);
  doc.text(datosFinales.numeroHijosMuertos || "", tablaInicioX + 135, yTextoAntecedentes + 1);
  yTextoAntecedentes += filaAltura;

  // === SECCIÓN 3: HÁBITOS NOCIVOS ===
  yPos = dibujarHeaderSeccion("3. HÁBITOS NOCIVOS", yPos, filaAltura);

  // Fila: Tabaco: {data} | alcohol: {data} | Drogas: {data}
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 3, yPos, tablaInicioX + tablaAncho / 3, yPos + filaAltura); // División 1/3
  doc.line(tablaInicioX + (2 * tablaAncho / 3), yPos, tablaInicioX + (2 * tablaAncho / 3), yPos + filaAltura); // División 2/3
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE HÁBITOS NOCIVOS ===
  let yTextoHabitos = yPos - filaAltura + 2.5;

  // Tabaco
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Tabaco:", tablaInicioX + 2, yTextoHabitos + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.tabaco_frecuencia || "", tablaInicioX + 20, yTextoHabitos + 1);

  // Alcohol
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Alcohol:", tablaInicioX + tablaAncho / 3 + 2, yTextoHabitos + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.alcohol_frecuencia || "", tablaInicioX + tablaAncho / 3 + 20, yTextoHabitos + 1);

  // Drogas
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Drogas:", tablaInicioX + (2 * tablaAncho / 3) + 2, yTextoHabitos + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.drogas_frecuencia || "", tablaInicioX + (2 * tablaAncho / 3) + 20, yTextoHabitos + 1);
  yTextoHabitos += filaAltura;

  // === SECCIÓN 4: ESPIROMETRÍA ===
  yPos = dibujarHeaderSeccion("4. ESPIROMETRÍA", yPos, filaAltura);

  // Fila para datos de espirometría (8 columnas: label | data | label | data | etc.)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < 8; i++) {
    doc.line(colPositions[i], yPos, colPositions[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila para conclusión (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE ESPIROMETRÍA ===
  let yTextoEspirometria = yPos - (2 * filaAltura) + 2.5;

  // Fila de datos: FVC | {data} | FVE1/FVC | {data} | FVE1 | {data} | FEF | {data}
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("FVC", colPositions[0] + 2, yTextoEspirometria + 1);
  doc.text(datosFinales.fvc || "", colPositions[1] + 2, yTextoEspirometria + 1);
  doc.text("FVE1/FVC", colPositions[2] + 2, yTextoEspirometria + 1);
  doc.text(datosFinales.fev1fvc || "", colPositions[3] + 2, yTextoEspirometria + 1);
  doc.text("FVE1", colPositions[4] + 2, yTextoEspirometria + 1);
  doc.text(datosFinales.fev1 || "", colPositions[5] + 2, yTextoEspirometria + 1);
  doc.text("FEF", colPositions[6] + 2, yTextoEspirometria + 1);
  doc.text(datosFinales.fef || "", colPositions[7] + 2, yTextoEspirometria + 1);
  yTextoEspirometria += filaAltura;

  // Conclusión
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Conclusión:", tablaInicioX + 2, yTextoEspirometria + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.conclusionEspirometria || "", tablaInicioX + 25, yTextoEspirometria + 1);
  yTextoEspirometria += filaAltura;


  // === SECCIÓN 5: SIGNOS VITALES Y MEDICIONES CORPORALES ===
  yPos = dibujarHeaderSeccion("5. SIGNOS VITALES Y MEDICIONES CORPORALES", yPos, filaAltura);

  // Fila 1: Temperatura | Talla | Peso (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 3, yPos, tablaInicioX + tablaAncho / 3, yPos + filaAltura); // División 1/3
  doc.line(tablaInicioX + (2 * tablaAncho / 3), yPos, tablaInicioX + (2 * tablaAncho / 3), yPos + filaAltura); // División 2/3
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 2: Cintura | Cadera (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 3: ICC | IMC (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE SIGNOS VITALES Y MEDICIONES ===
  let yTextoMediciones = yPos - (3 * filaAltura) + 2.5;

  // Fila 1: Temperatura | Talla | Peso
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Temperatura:", tablaInicioX + 2, yTextoMediciones + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.temp || "", tablaInicioX + 30, yTextoMediciones + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Talla:", tablaInicioX + tablaAncho / 3 + 2, yTextoMediciones + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.talla || "", tablaInicioX + tablaAncho / 3 + 20, yTextoMediciones + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Peso:", tablaInicioX + (2 * tablaAncho / 3) + 2, yTextoMediciones + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.peso || "", tablaInicioX + (2 * tablaAncho / 3) + 20, yTextoMediciones + 1);
  yTextoMediciones += filaAltura;

  // Fila 2: Cintura | Cadera
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cintura:", tablaInicioX + 2, yTextoMediciones + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.cintura || "", tablaInicioX + 25, yTextoMediciones + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cadera:", tablaInicioX + tablaAncho / 2 + 2, yTextoMediciones + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.cadera || "", tablaInicioX + tablaAncho / 2 + 25, yTextoMediciones + 1);
  yTextoMediciones += filaAltura;

  // Fila 3: ICC | IMC
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Índice Cintura-Cadera (ICC):", tablaInicioX + 2, yTextoMediciones + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.icc || "", tablaInicioX + 60, yTextoMediciones + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Índice de Masa Corporal (IMC):", tablaInicioX + tablaAncho / 2 + 2, yTextoMediciones + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.imc || "", tablaInicioX + tablaAncho / 2 + 60, yTextoMediciones + 1);
  yTextoMediciones += filaAltura;

  // === SECCIÓN 6: EXAMEN FÍSICO DETALLADO ===
  yPos = dibujarHeaderSeccion("6. EXAMEN FÍSICO DETALLADO", yPos, filaAltura);

  // Fila 1: Cabeza | Perímetro Cuello | Cuello | Nariz (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 4, yPos, tablaInicioX + tablaAncho / 4, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + (3 * tablaAncho / 4), yPos, tablaInicioX + (3 * tablaAncho / 4), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 2: Boca | Amígdalas | Faringe | Laringe (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 4, yPos, tablaInicioX + tablaAncho / 4, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + (3 * tablaAncho / 4), yPos, tablaInicioX + (3 * tablaAncho / 4), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 3: Dentadura | Piezas en mal estado | Piezas faltantes (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 3, yPos, tablaInicioX + tablaAncho / 3, yPos + filaAltura);
  doc.line(tablaInicioX + (2 * tablaAncho / 3), yPos, tablaInicioX + (2 * tablaAncho / 3), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE EXAMEN FÍSICO DETALLADO ===
  let yTextoExamenDetallado = yPos - (3 * filaAltura) + 2.5;

  // Fila 1: Cabeza | Perímetro Cuello | Cuello | Nariz
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cabeza:", tablaInicioX + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.cabeza || "", tablaInicioX + 20, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Perímetro Cuello:", tablaInicioX + tablaAncho / 4 + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.perimetroCuello || "", tablaInicioX + tablaAncho / 4 + 30, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cuello:", tablaInicioX + tablaAncho / 2 + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.cuello || "", tablaInicioX + tablaAncho / 2 + 20, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Nariz:", tablaInicioX + (3 * tablaAncho / 4) + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.nariz || "", tablaInicioX + (3 * tablaAncho / 4) + 20, yTextoExamenDetallado + 1);
  yTextoExamenDetallado += filaAltura;

  // Fila 2: Boca | Amígdalas | Faringe | Laringe
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Boca:", tablaInicioX + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.boca || "", tablaInicioX + 15, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Amígdalas:", tablaInicioX + tablaAncho / 4 + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.amigdalas || "", tablaInicioX + tablaAncho / 4 + 25, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Faringe:", tablaInicioX + tablaAncho / 2 + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.faringe || "", tablaInicioX + tablaAncho / 2 + 20, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Laringe:", tablaInicioX + (3 * tablaAncho / 4) + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.laringe || "", tablaInicioX + (3 * tablaAncho / 4) + 20, yTextoExamenDetallado + 1);
  yTextoExamenDetallado += filaAltura;

  // Fila 3: Dentadura | Piezas en mal estado | Piezas faltantes
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Dentadura:", tablaInicioX + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.dentadura || "", tablaInicioX + 25, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Piezas en mal estado:", tablaInicioX + tablaAncho / 3 + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.piezasMalEstado || "", tablaInicioX + tablaAncho / 3 + 40, yTextoExamenDetallado + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Piezas faltantes:", tablaInicioX + (2 * tablaAncho / 3) + 2, yTextoExamenDetallado + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.piezasFaltantes || "", tablaInicioX + (2 * tablaAncho / 3) + 35, yTextoExamenDetallado + 1);
  yTextoExamenDetallado += filaAltura;

  // === SECCIÓN OJOS ===
  // Fila gris: OJOS
  doc.setFillColor(160, 160, 160); // Color gris
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("OJOS", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // === TABLA DE AGUDEZA VISUAL ===
  const filaAlturaAgudeza = 4.5;
  const colAgudezaAncho = 30; // AGUDEZA VISUAL
  const colSinCorregirAncho = 30; // SIN CORREGIR
  const colCorregidaAncho = 30; // CORREGIDA
  const colObservacionesAncho = 95; // OBSERVACIONES
  
  // Posiciones de columnas
  let xAgudeza = tablaInicioX;
  let xSinCorregir = xAgudeza + colAgudezaAncho;
  let xCorregida = xSinCorregir + colSinCorregirAncho;
  let xObservaciones = xCorregida + colCorregidaAncho;
  
  // Dibujar header de la tabla de agudeza visual
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAgudeza);
  doc.line(xSinCorregir, yPos, xSinCorregir, yPos + filaAlturaAgudeza);
  doc.line(xCorregida, yPos, xCorregida, yPos + filaAlturaAgudeza);
  doc.line(xObservaciones, yPos, xObservaciones, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaAgudeza, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  
  // Contenido del header
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("AGUDEZA VISUAL", xAgudeza + 2, yPos + 3.5);
  
  // Centrar "SIN CORREGIR"
  const textoSinCorregir = "SIN CORREGIR";
  const anchoSinCorregir = doc.getTextWidth(textoSinCorregir);
  doc.text(textoSinCorregir, xSinCorregir + (colSinCorregirAncho - anchoSinCorregir) / 2, yPos + 3.5);
  
  // Centrar "CORREGIDA"
  const textoCorregida = "CORREGIDA";
  const anchoCorregida = doc.getTextWidth(textoCorregida);
  doc.text(textoCorregida, xCorregida + (colCorregidaAncho - anchoCorregida) / 2, yPos + 3.5);
  
  // Centrar "ENFERMEDADES OCULARES"
  const textoObservaciones = "ENFERMEDADES OCULARES";
  const anchoObservaciones = doc.getTextWidth(textoObservaciones);
  doc.text(textoObservaciones, xObservaciones + (colObservacionesAncho - anchoObservaciones) / 2, yPos + 3.5);
  yPos += filaAlturaAgudeza;
  
  // Dibujar subheader con O.D y O.I
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAgudeza);
  doc.line(xSinCorregir, yPos, xSinCorregir, yPos + filaAlturaAgudeza);
  doc.line(xCorregida, yPos, xCorregida, yPos + filaAlturaAgudeza);
  doc.line(xObservaciones, yPos, xObservaciones, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaAgudeza, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  
  // Dibujar líneas verticales para dividir O.D y O.I
  const mitadSinCorregir = xSinCorregir + (colSinCorregirAncho / 2);
  const mitadCorregida = xCorregida + (colCorregidaAncho / 2);
  doc.line(mitadSinCorregir, yPos, mitadSinCorregir, yPos + filaAlturaAgudeza);
  doc.line(mitadCorregida, yPos, mitadCorregida, yPos + filaAlturaAgudeza);
  
  // Contenido del subheader
  doc.setFont("helvetica", "bold").setFontSize(8);
  
  // Centrar "O.D" en la primera celda de SIN CORREGIR
  const textoOD1 = "O.D";
  const anchoOD1 = doc.getTextWidth(textoOD1);
  doc.text(textoOD1, xSinCorregir + (colSinCorregirAncho / 2 - anchoOD1) / 2, yPos + 3.5);
  
  // Centrar "O.I" en la segunda celda de SIN CORREGIR
  const textoOI1 = "O.I";
  const anchoOI1 = doc.getTextWidth(textoOI1);
  doc.text(textoOI1, mitadSinCorregir + (colSinCorregirAncho / 2 - anchoOI1) / 2, yPos + 3.5);
  
  // Centrar "O.D" en la primera celda de CORREGIDA
  const textoOD2 = "O.D";
  const anchoOD2 = doc.getTextWidth(textoOD2);
  doc.text(textoOD2, xCorregida + (colCorregidaAncho / 2 - anchoOD2) / 2, yPos + 3.5);
  
  // Centrar "O.I" en la segunda celda de CORREGIDA
  const textoOI2 = "O.I";
  const anchoOI2 = doc.getTextWidth(textoOI2);
  doc.text(textoOI2, mitadCorregida + (colCorregidaAncho / 2 - anchoOI2) / 2, yPos + 3.5);
  yPos += filaAlturaAgudeza;
  
  // Dibujar fila de datos para Visión de Cerca
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAgudeza);
  doc.line(xSinCorregir, yPos, xSinCorregir, yPos + filaAlturaAgudeza);
  doc.line(xCorregida, yPos, xCorregida, yPos + filaAlturaAgudeza);
  doc.line(xObservaciones, yPos, xObservaciones, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  // Línea horizontal inferior solo hasta la mitad
  doc.line(tablaInicioX, yPos + filaAlturaAgudeza, tablaInicioX + tablaAncho / 2, yPos + filaAlturaAgudeza);
  
  // Dibujar líneas verticales para dividir O.D y O.I en la fila de datos
  doc.line(mitadSinCorregir, yPos, mitadSinCorregir, yPos + filaAlturaAgudeza);
  doc.line(mitadCorregida, yPos, mitadCorregida, yPos + filaAlturaAgudeza);
  
  // Contenido de la fila Visión de Cerca
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Visión de Cerca:", xAgudeza + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Centrar datos O.D y O.I en SIN CORREGIR
  const odSinCorregir = datosFinales.visionCercaSinCorregirOD || "";
  const oiSinCorregir = datosFinales.visionCercaSinCorregirOI || "";
  const anchoOdSinCorregir = doc.getTextWidth(odSinCorregir);
  const anchoOiSinCorregir = doc.getTextWidth(oiSinCorregir);
  doc.text(odSinCorregir, xSinCorregir + (colSinCorregirAncho / 2 - anchoOdSinCorregir) / 2, yPos + 3.5);
  doc.text(oiSinCorregir, mitadSinCorregir + (colSinCorregirAncho / 2 - anchoOiSinCorregir) / 2, yPos + 3.5);
  
  // Centrar datos O.D y O.I en CORREGIDA
  const odCorregida = datosFinales.visionCercaCorregidaOD || "";
  const oiCorregida = datosFinales.visionCercaCorregidaOI || "";
  const anchoOdCorregida = doc.getTextWidth(odCorregida);
  const anchoOiCorregida = doc.getTextWidth(oiCorregida);
  doc.text(odCorregida, xCorregida + (colCorregidaAncho / 2 - anchoOdCorregida) / 2, yPos + 3.5);
  doc.text(oiCorregida, mitadCorregida + (colCorregidaAncho / 2 - anchoOiCorregida) / 2, yPos + 3.5);
  
  doc.text(datosFinales.observacionesOjos || "", xObservaciones + 2, yPos + 3.5);
  
  yPos += filaAlturaAgudeza;

  // Dibujar fila de datos para Visión de Lejos
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAgudeza);
  doc.line(xSinCorregir, yPos, xSinCorregir, yPos + filaAlturaAgudeza);
  doc.line(xCorregida, yPos, xCorregida, yPos + filaAlturaAgudeza);
  doc.line(xObservaciones, yPos, xObservaciones, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  // Línea horizontal inferior solo hasta la mitad
  doc.line(tablaInicioX, yPos + filaAlturaAgudeza, tablaInicioX + tablaAncho / 2, yPos + filaAlturaAgudeza);
  
  // Dibujar líneas verticales para dividir O.D y O.I en la fila de datos
  doc.line(mitadSinCorregir, yPos, mitadSinCorregir, yPos + filaAlturaAgudeza);
  doc.line(mitadCorregida, yPos, mitadCorregida, yPos + filaAlturaAgudeza);
  
  // Contenido de la fila Visión de Lejos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Visión de Lejos:", xAgudeza + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Centrar datos O.D y O.I en SIN CORREGIR
  const odLejosSinCorregir = datosFinales.visionLejosSinCorregirOD || "";
  const oiLejosSinCorregir = datosFinales.visionLejosSinCorregirOI || "";
  const anchoOdLejosSinCorregir = doc.getTextWidth(odLejosSinCorregir);
  const anchoOiLejosSinCorregir = doc.getTextWidth(oiLejosSinCorregir);
  doc.text(odLejosSinCorregir, xSinCorregir + (colSinCorregirAncho / 2 - anchoOdLejosSinCorregir) / 2, yPos + 3.5);
  doc.text(oiLejosSinCorregir, mitadSinCorregir + (colSinCorregirAncho / 2 - anchoOiLejosSinCorregir) / 2, yPos + 3.5);
  
  // Centrar datos O.D y O.I en CORREGIDA
  const odLejosCorregida = datosFinales.visionLejosCorregidaOD || "";
  const oiLejosCorregida = datosFinales.visionLejosCorregidaOI || "";
  const anchoOdLejosCorregida = doc.getTextWidth(odLejosCorregida);
  const anchoOiLejosCorregida = doc.getTextWidth(oiLejosCorregida);
  doc.text(odLejosCorregida, xCorregida + (colCorregidaAncho / 2 - anchoOdLejosCorregida) / 2, yPos + 3.5);
  doc.text(oiLejosCorregida, mitadCorregida + (colCorregidaAncho / 2 - anchoOiLejosCorregida) / 2, yPos + 3.5);
  
  // Contenido de observaciones oculares
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("ENFERMEDADES OCULARES:", xObservaciones + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.enfermedadesOculares || "", xObservaciones + 45, yPos + 3.5);
  
  yPos += filaAlturaAgudeza;

  // Dibujar fila adicional para REFLEJOS PUPILARES (sin líneas divisoras)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaAgudeza, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  
  // Contenido de la fila REFLEJOS PUPILARES
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("REFLEJOS PUPILARES:", xAgudeza + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.reflejosPupilares || "", xObservaciones + 2, yPos + 3.5);
  
  yPos += filaAlturaAgudeza;

  // === FILA: VISIÓN DE COLORES ===
  // Fila: Visión de colores | Test de Ishihara | Test de colores puros | Test de profundidad (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 4, yPos, tablaInicioX + tablaAncho / 4, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + (3 * tablaAncho / 4), yPos, tablaInicioX + (3 * tablaAncho / 4), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Contenido de la fila Visión de Colores
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Visión de colores:", tablaInicioX + 2, yPos + 3.5);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Test de Ishihara:", tablaInicioX + tablaAncho / 4 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.testIshihara || "", tablaInicioX + tablaAncho / 4 + 35, yPos + 3.5);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Test de colores puros:", tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.testColoresPuros || "", tablaInicioX + tablaAncho / 2 + 40, yPos + 3.5);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Test de profundidad:", tablaInicioX + (3 * tablaAncho / 4) + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.testProfundidad || "", tablaInicioX + (3 * tablaAncho / 4) + 40, yPos + 3.5);
  
  yPos += filaAltura;

  // === SECCIÓN 8: OÍDOS ===
  // Fila gris: 8. OÍDOS
  doc.setFillColor(160, 160, 160); // Color gris
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("8. OÍDOS", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Fila títulos: Oído derecho | Oído izquierdo
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const textoOidoDerecho = "OÍDO DERECHO";
  const anchoOidoDerecho = doc.getTextWidth(textoOidoDerecho);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(textoOidoDerecho, tablaInicioX + (tablaAncho / 2 - anchoOidoDerecho) / 2, yPos + 3.5);

  const textoOidoIzquierdo = "OÍDO IZQUIERDO";
  const anchoOidoIzquierdo = doc.getTextWidth(textoOidoIzquierdo);
  doc.text(textoOidoIzquierdo, tablaInicioX + tablaAncho / 2 + (tablaAncho / 2 - anchoOidoIzquierdo) / 2, yPos + 3.5);
  yPos += filaAltura;

  // Fila frecuencias
  const numColsPerEarOidos = 8;
  const colWidthOidos = (tablaAncho / 2) / numColsPerEarOidos;
  const frequencies = [500, 1000, 2000, 3000, 4000, 5000, 8000];

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Líneas verticales para ambos lados
  for (let side = 0; side < 2; side++) {
    const startX = side * (tablaAncho / 2) + tablaInicioX;
    for (let j = 0; j <= numColsPerEarOidos; j++) {
      const x = startX + j * colWidthOidos;
      doc.line(x, yPos, x, yPos + filaAltura);
    }
  }
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Etiqueta Hz en columna 0 y frecuencias en columnas 1-7
  doc.setFont("helvetica", "bold").setFontSize(7);
  for (let side = 0; side < 2; side++) {
    const startX = side * (tablaAncho / 2) + tablaInicioX;
    // Hz en col 0
    const textoHz = "Hz";
    const anchoHz = doc.getTextWidth(textoHz);
    doc.text(textoHz, startX + (colWidthOidos - anchoHz) / 2, yPos + 3.5);
    // Frecuencias
    for (let k = 0; k < frequencies.length; k++) {
      const colIndex = k + 1;
      const x = startX + colIndex * colWidthOidos;
      const textoFreq = frequencies[k].toString();
      const anchoFreq = doc.getTextWidth(textoFreq);
      doc.text(textoFreq, x + (colWidthOidos - anchoFreq) / 2, yPos + 3.5);
    }
  }
  yPos += filaAltura;

  // Fila de datos
  // Líneas verticales para ambos lados
  for (let side = 0; side < 2; side++) {
    const startX = side * (tablaAncho / 2) + tablaInicioX;
    for (let j = 0; j <= numColsPerEarOidos; j++) {
      const x = startX + j * colWidthOidos;
      doc.line(x, yPos, x, yPos + filaAltura);
    }
  }
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Etiquetas dB(A) en columna 0 y datos en 1-7
  doc.setFont("helvetica", "bold").setFontSize(8);
  for (let side = 0; side < 2; side++) {
    const startX = side * (tablaAncho / 2) + tablaInicioX;
    const textoDb = "dB(A)";
    const anchoDb = doc.getTextWidth(textoDb);
    doc.text(textoDb, startX + (colWidthOidos - anchoDb) / 2, yPos + 3.5);
  }
  doc.setFont("helvetica", "normal").setFontSize(8);

  // Datos para oídos
  const rightFreqData = {
    500: datosFinales.oidoDerecho500,
    1000: datosFinales.oidoDerecho1000,
    2000: datosFinales.oidoDerecho2000,
    3000: datosFinales.oidoDerecho3000,
    4000: datosFinales.oidoDerecho4000,
    5000: datosFinales.oidoDerecho5000,
    8000: datosFinales.oidoDerecho8000
  };
  const leftFreqData = {
    500: datosFinales.oidoIzquierdo500,
    1000: datosFinales.oidoIzquierdo1000,
    2000: datosFinales.oidoIzquierdo2000,
    3000: datosFinales.oidoIzquierdo3000,
    4000: datosFinales.oidoIzquierdo4000,
    5000: datosFinales.oidoIzquierdo5000,
    8000: datosFinales.oidoIzquierdo8000
  };
  const allData = [rightFreqData, leftFreqData];

  for (let side = 0; side < 2; side++) {
    const startX = side * (tablaAncho / 2) + tablaInicioX;
    const freqData = allData[side];
    for (let k = 0; k < frequencies.length; k++) {
      const freq = frequencies[k];
      const dataVal = freqData[freq] || "";
      const colIndex = k + 1;
      const x = startX + colIndex * colWidthOidos;
      const anchoData = doc.getTextWidth(dataVal);
      doc.text(dataVal, x + (colWidthOidos - anchoData) / 2, yPos + 3.5);
    }
  }
  yPos += filaAltura;

  // === FILA: OTOSCOPIA Y CARDIOVASCULAR ===
  const col1Width = 50; // OTOSCOPIA
  const col2Width = 30; // O.D
  const col3Width = 30; // O.I
  const col4Width = 50; // CARDIOVASCULAR
  const col5Width = 40; // data

  let x1 = tablaInicioX + col1Width;
  let x2 = x1 + col2Width;
  let x3 = x2 + col3Width;
  let x4 = x3 + col4Width;

  // Dibujar líneas de la fila
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(x1, yPos, x1, yPos + filaAltura);
  doc.line(x2, yPos, x2, yPos + filaAltura);
  doc.line(x3, yPos, x3, yPos + filaAltura);
  doc.line(x4, yPos, x4, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("OTOSCOPIA", tablaInicioX + 2, yPos + 3.5);
  doc.text("O.D:", x1 + 2, yPos + 3.5);
  doc.text("O.I:", x2 + 2, yPos + 3.5);
  doc.text("CARDIOVASCULAR", x3 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.otoscopiaOD || "", x1 + 15, yPos + 3.5);
  doc.text(datosFinales.otoscopiaOI || "", x2 + 15, yPos + 3.5);
  doc.text(datosFinales.cardiovascular || "", x4 + 2, yPos + 3.5);
  yPos += filaAltura;


  // === FOOTER PÁGINA 1 ===
  footerTR(doc, { footerOffsetY: 8 });

  // === CREAR PÁGINA 2 ===
  // Forzar creación de segunda página para PULMONES y PIEL
  doc.addPage();
  numeroPagina = 2;
  yPos = 35.5; // Posición inicial de la nueva página

  // Dibujar header en la nueva página
  drawHeader(numeroPagina);

  // === SECCIÓN: SIGNOS VITALES ===
  yPos = dibujarHeaderSeccion("SIGNOS VITALES", yPos, filaAltura);

  // Fila: F. Respiratoria | F. Cardiaca | SatO2 (3 columnas)
  const colVitalWidth = tablaAncho / 3;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + colVitalWidth, yPos, tablaInicioX + colVitalWidth, yPos + filaAltura);
  doc.line(tablaInicioX + (2 * colVitalWidth), yPos, tablaInicioX + (2 * colVitalWidth), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("F. Respiratoria:", tablaInicioX + 2, yPos + 3.5);
  doc.text("F. Cardiaca:", tablaInicioX + colVitalWidth + 2, yPos + 3.5);
  doc.text("SatO2:", tablaInicioX + (2 * colVitalWidth) + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fRespiratoria || "", tablaInicioX + 35, yPos + 3.5);
  doc.text(datosFinales.fCardiaca || "", tablaInicioX + colVitalWidth + 35, yPos + 3.5);
  doc.text(datosFinales.satO2 || "", tablaInicioX + (2 * colVitalWidth) + 20, yPos + 3.5);
  yPos += filaAltura;

  // Fila: PRESION ARTERIAL | Sistólica | Diastólica (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + colVitalWidth, yPos, tablaInicioX + colVitalWidth, yPos + filaAltura);
  doc.line(tablaInicioX + (2 * colVitalWidth), yPos, tablaInicioX + (2 * colVitalWidth), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("PRESIÓN ARTERIAL", tablaInicioX + 2, yPos + 3.5);
  doc.text("Sistólica:", tablaInicioX + colVitalWidth + 2, yPos + 3.5);
  doc.text("Diastólica:", tablaInicioX + (2 * colVitalWidth) + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.presionSistolica || "", tablaInicioX + colVitalWidth + 35, yPos + 3.5);
  doc.text(datosFinales.presionDiastolica || "", tablaInicioX + (2 * colVitalWidth) + 35, yPos + 3.5);
  yPos += filaAltura;

  // === PÁGINA 2: PULMONES Y PIEL ===
  // === SECCIÓN PULMONES ===
  yPos = dibujarHeaderSeccion("PULMONES", yPos, filaAltura);

    // Fila: PULMONES | Normal | | Anormal | X | PIEL | Normal | X | Anormal | |
    const colPulmonesWidth = 30; // PULMONES
    const colNormalWidth = 20;   // Normal
    const colCheckWidth = 10;    // Checkbox
    const colAnormalWidth = 20;  // Anormal
    const colCheck2Width = 10;   // Checkbox
    const colPielWidth = 30;     // PIEL
    const colNormal2Width = 20;  // Normal
    const colCheck3Width = 10;   // Checkbox
    const colAnormal2Width = 20; // Anormal
    let xPulmones = tablaInicioX;
    let xNormal = xPulmones + colPulmonesWidth;
    let xCheck1 = xNormal + colNormalWidth;
    let xAnormal = xCheck1 + colCheckWidth;
    let xCheck2 = xAnormal + colAnormalWidth;
    let xPiel = xCheck2 + colCheck2Width;
    let xNormal2 = xPiel + colPielWidth;
    let xCheck3 = xNormal2 + colNormal2Width;
    let xAnormal2 = xCheck3 + colCheck3Width;
    let xCheck4 = xAnormal2 + colAnormal2Width;

    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(xNormal, yPos, xNormal, yPos + filaAltura);
    doc.line(xCheck1, yPos, xCheck1, yPos + filaAltura);
    doc.line(xAnormal, yPos, xAnormal, yPos + filaAltura);
    doc.line(xCheck2, yPos, xCheck2, yPos + filaAltura);
    doc.line(xPiel, yPos, xPiel, yPos + filaAltura);
    doc.line(xNormal2, yPos, xNormal2, yPos + filaAltura);
    doc.line(xCheck3, yPos, xCheck3, yPos + filaAltura);
    doc.line(xAnormal2, yPos, xAnormal2, yPos + filaAltura);
    doc.line(xCheck4, yPos, xCheck4, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    // Contenido de la fila
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("PULMONES", xPulmones + 2, yPos + 3.5);
    doc.text("Normal", xNormal + 2, yPos + 3.5);
    doc.text("Anormal", xAnormal + 2, yPos + 3.5);
    doc.text("PIEL", xPiel + 2, yPos + 3.5);
    doc.text("Normal", xNormal2 + 2, yPos + 3.5);
    doc.text("Anormal", xAnormal2 + 2, yPos + 3.5);

    // Marcar checkboxes según los datos
    if (datosFinales.pulmonesNormal) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", xCheck1 + 3, yPos + 3.5);
    }
    if (datosFinales.pulmonesAnormal) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", xCheck2 + 3, yPos + 3.5);
    }
    if (datosFinales.pielNormal) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", xCheck3 + 3, yPos + 3.5);
    }
    if (datosFinales.pielAnormal) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", xCheck4 + 3, yPos + 3.5);
    }
    yPos += filaAltura;

    // Fila de descripciones con altura dinámica
    const textoPulmones = "Descripción: " + (datosFinales.pulmonesDescripcion || "");
    const textoPiel = "Descripción: " + (datosFinales.pielDescripcion || "");
    
    // Calcular altura dinámica para cada columna
    const anchoDisponiblePulmones = xPiel - xPulmones - 4; // Ancho disponible para pulmones
    const anchoDisponiblePiel = tablaAncho - xPiel - 4; // Ancho disponible para piel
    
    const lineasPulmones = doc.splitTextToSize(textoPulmones, anchoDisponiblePulmones);
    const lineasPiel = doc.splitTextToSize(textoPiel, anchoDisponiblePiel);
    
    // Usar la altura de la columna con más líneas
    const maxLineas = Math.max(lineasPulmones.length, lineasPiel.length);
    const alturaDinamicaDescripcion = Math.max(filaAltura, maxLineas * 2.5 + 2);

    // Dibujar líneas de la fila dinámica
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaDescripcion);
    doc.line(xPiel, yPos, xPiel, yPos + alturaDinamicaDescripcion);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaDescripcion);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaDinamicaDescripcion, tablaInicioX + tablaAncho, yPos + alturaDinamicaDescripcion);

    // Contenido de descripciones con salto de línea
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(lineasPulmones, xPulmones + 2, yPos + 3.5);
    doc.text(lineasPiel, xPiel + 2, yPos + 3.5);
    
    yPos += alturaDinamicaDescripcion;

  // === SECCIÓN MIEMBROS SUPERIORES ===
  yPos = dibujarHeaderSeccion("MIEMBROS SUPERIORES", yPos, filaAltura);

  // Fila de Miembros Superiores con altura dinámica
  const textoMiembrosSuperiores = "Miembros Superiores: " + (datosFinales.miembrosSuperiores || "");
  const anchoDisponibleMiembrosSuperiores = tablaAncho - 4;
  const lineasMiembrosSuperiores = doc.splitTextToSize(textoMiembrosSuperiores, anchoDisponibleMiembrosSuperiores);
  const alturaDinamicaMiembrosSuperiores = Math.max(filaAltura, lineasMiembrosSuperiores.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaMiembrosSuperiores);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaMiembrosSuperiores);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaMiembrosSuperiores, tablaInicioX + tablaAncho, yPos + alturaDinamicaMiembrosSuperiores);

  // Contenido
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasMiembrosSuperiores, tablaInicioX + 2, yPos + 3.5);
  yPos += alturaDinamicaMiembrosSuperiores;

  // === SECCIÓN MIEMBROS INFERIORES ===
  yPos = dibujarHeaderSeccion("MIEMBROS INFERIORES", yPos, filaAltura);

  // Fila de Miembros Inferiores con altura dinámica
  const textoMiembrosInferiores = "Miembros Inferiores: " + (datosFinales.miembrosInferiores || "");
  const anchoDisponibleMiembrosInferiores = tablaAncho - 4;
  const lineasMiembrosInferiores = doc.splitTextToSize(textoMiembrosInferiores, anchoDisponibleMiembrosInferiores);
  const alturaDinamicaMiembrosInferiores = Math.max(filaAltura, lineasMiembrosInferiores.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaMiembrosInferiores);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaMiembrosInferiores);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaMiembrosInferiores, tablaInicioX + tablaAncho, yPos + alturaDinamicaMiembrosInferiores);

  // Contenido
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasMiembrosInferiores, tablaInicioX + 2, yPos + 3.5);
  yPos += alturaDinamicaMiembrosInferiores;

  // === FILA: REFLEJOS OSTEO-TENDINOSOS Y MARCHA ===
  const textoReflejos = "Reflejos Osteotendinosos: " + (datosFinales.reflejosOsteotendinosos || "");
  const textoMarcha = "Marcha: " + (datosFinales.marcha || "");
  
  // Calcular altura dinámica para cada columna
  const anchoDisponibleReflejos = tablaAncho / 2 - 4;
  const anchoDisponibleMarcha = tablaAncho / 2 - 4;
  
  const lineasReflejos = doc.splitTextToSize(textoReflejos, anchoDisponibleReflejos);
  const lineasMarcha = doc.splitTextToSize(textoMarcha, anchoDisponibleMarcha);
  
  // Usar la altura de la columna con más líneas
  const maxLineasReflejosMarcha = Math.max(lineasReflejos.length, lineasMarcha.length);
  const alturaDinamicaReflejosMarcha = Math.max(filaAltura, maxLineasReflejosMarcha * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaReflejosMarcha);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + alturaDinamicaReflejosMarcha);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaReflejosMarcha);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaReflejosMarcha, tablaInicioX + tablaAncho, yPos + alturaDinamicaReflejosMarcha);

  // Contenido
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasReflejos, tablaInicioX + 2, yPos + 3.5);
  doc.text(lineasMarcha, tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  yPos += alturaDinamicaReflejosMarcha;

  // === FILA: COLUMNA VERTEBRAL ===
  const textoColumna = "Columna Vertebral: " + (datosFinales.columnaVertebral || "");
  const anchoDisponibleColumna = tablaAncho - 4;
  const lineasColumna = doc.splitTextToSize(textoColumna, anchoDisponibleColumna);
  const alturaDinamicaColumna = Math.max(filaAltura, lineasColumna.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaColumna);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaColumna);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaColumna, tablaInicioX + tablaAncho, yPos + alturaDinamicaColumna);

  // Contenido
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasColumna, tablaInicioX + 2, yPos + 3.5);
  yPos += alturaDinamicaColumna;

  // === FILA: ABDOMEN Y TACTO RECTAL ===
  const textoAbdomen = "Abdomen: " + (datosFinales.abdomen || "");
  const textoTactoRectal = "Tacto Rectal: " + (datosFinales.tactoRectal || "");
  
  // Calcular altura dinámica para cada columna
  const anchoDisponibleAbdomen = tablaAncho / 2 - 4;
  const anchoDisponibleTactoRectal = tablaAncho / 2 - 4;
  
  const lineasAbdomen = doc.splitTextToSize(textoAbdomen, anchoDisponibleAbdomen);
  const lineasTactoRectal = doc.splitTextToSize(textoTactoRectal, anchoDisponibleTactoRectal);
  
  // Usar la altura de la columna con más líneas
  const maxLineasAbdomenTacto = Math.max(lineasAbdomen.length, lineasTactoRectal.length);
  const alturaDinamicaAbdomenTacto = Math.max(filaAltura, maxLineasAbdomenTacto * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaAbdomenTacto);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + alturaDinamicaAbdomenTacto);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaAbdomenTacto);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaAbdomenTacto, tablaInicioX + tablaAncho, yPos + alturaDinamicaAbdomenTacto);

  // Contenido
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasAbdomen, tablaInicioX + 2, yPos + 3.5);
  doc.text(lineasTactoRectal, tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  yPos += alturaDinamicaAbdomenTacto;

  // === FILA: ANILLOS INGUINALES, HERNIAS Y VARICES ===
  const textoAnillos = "Anillos Inguinales: " + (datosFinales.anillosInguinales || "");
  const textoHernias = "Hernias: " + (datosFinales.hernias || "");
  const textoVarices = "Varices: " + (datosFinales.varices || "");
  
  // Calcular altura dinámica para cada columna (3 columnas)
  const anchoDisponibleAnillos = tablaAncho / 3 - 4;
  const anchoDisponibleHernias = tablaAncho / 3 - 4;
  const anchoDisponibleVarices = tablaAncho / 3 - 4;
  
  const lineasAnillos = doc.splitTextToSize(textoAnillos, anchoDisponibleAnillos);
  const lineasHernias = doc.splitTextToSize(textoHernias, anchoDisponibleHernias);
  const lineasVarices = doc.splitTextToSize(textoVarices, anchoDisponibleVarices);
  
  // Usar la altura de la columna con más líneas
  const maxLineasAnillosHerniasVarices = Math.max(lineasAnillos.length, lineasHernias.length, lineasVarices.length);
  const alturaDinamicaAnillosHerniasVarices = Math.max(filaAltura, maxLineasAnillosHerniasVarices * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaAnillosHerniasVarices);
  doc.line(tablaInicioX + tablaAncho / 3, yPos, tablaInicioX + tablaAncho / 3, yPos + alturaDinamicaAnillosHerniasVarices);
  doc.line(tablaInicioX + (2 * tablaAncho / 3), yPos, tablaInicioX + (2 * tablaAncho / 3), yPos + alturaDinamicaAnillosHerniasVarices);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaAnillosHerniasVarices);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaAnillosHerniasVarices, tablaInicioX + tablaAncho, yPos + alturaDinamicaAnillosHerniasVarices);

  // Contenido
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasAnillos, tablaInicioX + 2, yPos + 3.5);
  doc.text(lineasHernias, tablaInicioX + tablaAncho / 3 + 2, yPos + 3.5);
  doc.text(lineasVarices, tablaInicioX + (2 * tablaAncho / 3) + 2, yPos + 3.5);
  yPos += alturaDinamicaAnillosHerniasVarices;

  // === FILA: ÓRGANOS GENITALES Y GANGLIOS LINFÁTICOS ===
  const textoOrganos = "Órganos Genitales: " + (datosFinales.organosGenitales || "");
  const textoGanglios = "Ganglios Linfáticos: " + (datosFinales.gangliosLinfaticos || "");
  
  // Calcular altura dinámica para cada columna
  const anchoDisponibleOrganos = tablaAncho / 2 - 4;
  const anchoDisponibleGanglios = tablaAncho / 2 - 4;
  
  const lineasOrganos = doc.splitTextToSize(textoOrganos, anchoDisponibleOrganos);
  const lineasGanglios = doc.splitTextToSize(textoGanglios, anchoDisponibleGanglios);
  
  // Usar la altura de la columna con más líneas
  const maxLineasOrganosGanglios = Math.max(lineasOrganos.length, lineasGanglios.length);
  const alturaDinamicaOrganosGanglios = Math.max(filaAltura, maxLineasOrganosGanglios * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaOrganosGanglios);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + alturaDinamicaOrganosGanglios);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaOrganosGanglios);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaOrganosGanglios, tablaInicioX + tablaAncho, yPos + alturaDinamicaOrganosGanglios);

  // Contenido
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasOrganos, tablaInicioX + 2, yPos + 3.5);
  doc.text(lineasGanglios, tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  yPos += alturaDinamicaOrganosGanglios;

  // === FILA: LENGUAJE, ATENCIÓN, MEMORIA, INTELIGENCIA, ORIENTACIÓN, AFECTIVIDAD ===
  const textoLenguaje = "Lenguaje, Atención, Memoria, Inteligencia, Orientación, Afectividad: " + (datosFinales.lenguajeAtencionMemoria || "");
  const anchoDisponibleLenguaje = tablaAncho - 4;
  const lineasLenguaje = doc.splitTextToSize(textoLenguaje, anchoDisponibleLenguaje);
  const alturaDinamicaLenguaje = Math.max(filaAltura, lineasLenguaje.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaLenguaje);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaLenguaje);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaLenguaje, tablaInicioX + tablaAncho, yPos + alturaDinamicaLenguaje);

  // Contenido
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasLenguaje, tablaInicioX + 2, yPos + 3.5);
  yPos += alturaDinamicaLenguaje;

  // === FILA: ANAMNESIS ===
  const textoAnamnesis = "Anamnesis: " + (datosFinales.anamnesis || "");
  const anchoDisponibleAnamnesis = tablaAncho - 4;
  const lineasAnamnesis = doc.splitTextToSize(textoAnamnesis, anchoDisponibleAnamnesis);
  const alturaDinamicaAnamnesis = Math.max(filaAltura, lineasAnamnesis.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaAnamnesis);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaAnamnesis);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaAnamnesis, tablaInicioX + tablaAncho, yPos + alturaDinamicaAnamnesis);

  // Contenido
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasAnamnesis, tablaInicioX + 2, yPos + 3.5);
  yPos += alturaDinamicaAnamnesis;

  // === FILA: ESTADO MENTAL ===
  const textoEstadoMental = "Estado Mental: " + (datosFinales.estadoMental || "");
  const anchoDisponibleEstadoMental = tablaAncho - 4;
  const lineasEstadoMental = doc.splitTextToSize(textoEstadoMental, anchoDisponibleEstadoMental);
  const alturaDinamicaEstadoMental = Math.max(filaAltura, lineasEstadoMental.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaEstadoMental);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaEstadoMental);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaEstadoMental, tablaInicioX + tablaAncho, yPos + alturaDinamicaEstadoMental);

  // Contenido
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasEstadoMental, tablaInicioX + 2, yPos + 3.5);
  yPos += alturaDinamicaEstadoMental;

  // === FILA: NRO RX, FECHA, CALIDAD, SÍMBOLOS ===
  const textoNroRx = "Nro Rx: " + (datosFinales.nroRx || "");
  const textoFechaRx = "Fecha: " + (datosFinales.fechaRx || "");
  const textoCalidadRx = "Calidad: " + (datosFinales.calidadRx || "");
  const textoSimbolosRx = "Símbolos: " + (datosFinales.simbolosRx || "");
  
  // Calcular altura dinámica para cada columna (4 columnas)
  const anchoDisponibleNroRx = tablaAncho / 4 - 4;
  const anchoDisponibleFechaRx = tablaAncho / 4 - 4;
  const anchoDisponibleCalidadRx = tablaAncho / 4 - 4;
  const anchoDisponibleSimbolosRx = tablaAncho / 4 - 4;
  
  const lineasNroRx = doc.splitTextToSize(textoNroRx, anchoDisponibleNroRx);
  const lineasFechaRx = doc.splitTextToSize(textoFechaRx, anchoDisponibleFechaRx);
  const lineasCalidadRx = doc.splitTextToSize(textoCalidadRx, anchoDisponibleCalidadRx);
  const lineasSimbolosRx = doc.splitTextToSize(textoSimbolosRx, anchoDisponibleSimbolosRx);
  
  // Usar la altura de la columna con más líneas
  const maxLineasRx = Math.max(lineasNroRx.length, lineasFechaRx.length, lineasCalidadRx.length, lineasSimbolosRx.length);
  const alturaDinamicaRx = Math.max(filaAltura, maxLineasRx * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaRx);
  doc.line(tablaInicioX + tablaAncho / 4, yPos, tablaInicioX + tablaAncho / 4, yPos + alturaDinamicaRx);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + alturaDinamicaRx);
  doc.line(tablaInicioX + (3 * tablaAncho / 4), yPos, tablaInicioX + (3 * tablaAncho / 4), yPos + alturaDinamicaRx);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaRx);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaRx, tablaInicioX + tablaAncho, yPos + alturaDinamicaRx);

  // Contenido
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasNroRx, tablaInicioX + 2, yPos + 3.5);
  doc.text(lineasFechaRx, tablaInicioX + tablaAncho / 4 + 2, yPos + 3.5);
  doc.text(lineasCalidadRx, tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  doc.text(lineasSimbolosRx, tablaInicioX + (3 * tablaAncho / 4) + 2, yPos + 3.5);
  yPos += alturaDinamicaRx;

  // === FILA: VÉRTICES ===
  const textoVertices = "Vértices: " + (datosFinales.vertices || "");
  const anchoDisponibleVertices = tablaAncho - 4;
  const lineasVertices = doc.splitTextToSize(textoVertices, anchoDisponibleVertices);
  const alturaDinamicaVertices = Math.max(filaAltura, lineasVertices.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaVertices);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaVertices);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaVertices, tablaInicioX + tablaAncho, yPos + alturaDinamicaVertices);

  // Contenido
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasVertices, tablaInicioX + 2, yPos + 3.5);
  yPos += alturaDinamicaVertices;

  // === FILA: CAMPOS PULMONARES, MEDIASTINOS, HELIOS, SENOS ===
  const textoCamposPulmonares = "Campos Pulmonares: " + (datosFinales.camposPulmonares || "");
  const textoMediastinos = "Mediastinos: " + (datosFinales.mediastinos || "");
  const textoHelios = "Helios: " + (datosFinales.helios || "");
  const textoSenos = "Senos: " + (datosFinales.senos || "");
  
  // Calcular altura dinámica para cada columna (4 columnas)
  const anchoDisponibleCamposPulmonares = tablaAncho / 4 - 4;
  const anchoDisponibleMediastinos = tablaAncho / 4 - 4;
  const anchoDisponibleHelios = tablaAncho / 4 - 4;
  const anchoDisponibleSenos = tablaAncho / 4 - 4;
  
  const lineasCamposPulmonares = doc.splitTextToSize(textoCamposPulmonares, anchoDisponibleCamposPulmonares);
  const lineasMediastinos = doc.splitTextToSize(textoMediastinos, anchoDisponibleMediastinos);
  const lineasHelios = doc.splitTextToSize(textoHelios, anchoDisponibleHelios);
  const lineasSenos = doc.splitTextToSize(textoSenos, anchoDisponibleSenos);
  
  // Usar la altura de la columna con más líneas
  const maxLineasCampos = Math.max(lineasCamposPulmonares.length, lineasMediastinos.length, lineasHelios.length, lineasSenos.length);
  const alturaDinamicaCampos = Math.max(filaAltura, maxLineasCampos * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaCampos);
  doc.line(tablaInicioX + tablaAncho / 4, yPos, tablaInicioX + tablaAncho / 4, yPos + alturaDinamicaCampos);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + alturaDinamicaCampos);
  doc.line(tablaInicioX + (3 * tablaAncho / 4), yPos, tablaInicioX + (3 * tablaAncho / 4), yPos + alturaDinamicaCampos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaCampos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaCampos, tablaInicioX + tablaAncho, yPos + alturaDinamicaCampos);

  // Contenido
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasCamposPulmonares, tablaInicioX + 2, yPos + 3.5);
  doc.text(lineasMediastinos, tablaInicioX + tablaAncho / 4 + 2, yPos + 3.5);
  doc.text(lineasHelios, tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  doc.text(lineasSenos, tablaInicioX + (3 * tablaAncho / 4) + 2, yPos + 3.5);
  yPos += alturaDinamicaCampos;

  // === FILA: SILUETA CARDIOVASCULAR ===
  const textoSilueta = "Silueta Cardiovascular: " + (datosFinales.siluetaCardiovascular || "");
  const anchoDisponibleSilueta = tablaAncho - 4;
  const lineasSilueta = doc.splitTextToSize(textoSilueta, anchoDisponibleSilueta);
  const alturaDinamicaSilueta = Math.max(filaAltura, lineasSilueta.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaSilueta);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaSilueta);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaSilueta, tablaInicioX + tablaAncho, yPos + alturaDinamicaSilueta);

  // Contenido
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasSilueta, tablaInicioX + 2, yPos + 3.5);
  yPos += alturaDinamicaSilueta;

  // === FILA: CONCLUSIONES RADIOGRÁFICAS ===
  const textoConclusiones = "Conclusiones Radiográficas: " + (datosFinales.conclusionesRadiograficas || "");
  const anchoDisponibleConclusiones = tablaAncho - 4;
  const lineasConclusiones = doc.splitTextToSize(textoConclusiones, anchoDisponibleConclusiones);
  const alturaDinamicaConclusiones = Math.max(filaAltura, lineasConclusiones.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaConclusiones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaConclusiones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaConclusiones, tablaInicioX + tablaAncho, yPos + alturaDinamicaConclusiones);

  // Contenido
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasConclusiones, tablaInicioX + 2, yPos + 3.5);
  yPos += alturaDinamicaConclusiones;

  // === NUEVA SECCIÓN PARA CLASIFICACIÓN ILO NEUMOCONIOSIS (AGREGADA PARA PÁGINA 2) ===
  yPos = dibujarHeaderSeccion("CLASIFICACIÓN ILO NEUMOCONIOSIS", yPos, filaAltura);

  // Definir columnas para la tabla ILO (7 columnas basadas en la descripción)
  const numColsILO = 7;
  const colWidthILO = tablaAncho / numColsILO;
  const colPositionsILO = [];
  for (let i = 0; i <= numColsILO; i++) {
    colPositionsILO.push(tablaInicioX + (i * colWidthILO));
  }

  // Fila 1: Espacio para X (fila superior para marcar la categoría)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < numColsILO; i++) {
    doc.line(colPositionsILO[i], yPos, colPositionsILO[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Agregar división en el medio de la tercera celda (índice 2)
  const terceraCeldaMitad = colPositionsILO[2] + (colWidthILO / 2);
  doc.line(terceraCeldaMitad, yPos, terceraCeldaMitad, yPos + filaAltura);

  // Agregar dos divisiones en la cuarta celda (índice 3)
  const cuartaCeldaTercio1 = colPositionsILO[3] + (colWidthILO / 3);
  const cuartaCeldaTercio2 = colPositionsILO[3] + (2 * colWidthILO / 3);
  doc.line(cuartaCeldaTercio1, yPos, cuartaCeldaTercio1, yPos + filaAltura);
  doc.line(cuartaCeldaTercio2, yPos, cuartaCeldaTercio2, yPos + filaAltura);

  // Agregar dos divisiones en la quinta celda (índice 4) para "3/2 3/3 3/+"
  const quintaCeldaTercio1 = colPositionsILO[4] + (colWidthILO / 3);
  const quintaCeldaTercio2 = colPositionsILO[4] + (2 * colWidthILO / 3);
  doc.line(quintaCeldaTercio1, yPos, quintaCeldaTercio1, yPos + filaAltura);
  doc.line(quintaCeldaTercio2, yPos, quintaCeldaTercio2, yPos + filaAltura);

  // Colocar X en la columna correspondiente según datosFinales.neumoconiosisCategoria
  let xPosILO = 0;
  if (datosFinales.neumoconiosisCategoria) {
    const catMap = {
      '0/0': 0,
      '1/0': 1,
      '1/1': 2, '1/2': 2,
      '2/1': 3, '2/2': 3, '2/3': 3,
      '3/2': 4, '3/3': 4, '3/+': 4,
      'A': 5, 'B': 5, 'C': 5,
      'ST': 6
    };
    const colIndexILO = catMap[datosFinales.neumoconiosisCategoria] !== undefined ? catMap[datosFinales.neumoconiosisCategoria] : 0;
    xPosILO = colPositionsILO[colIndexILO] + (colWidthILO / 2);
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("X", xPosILO, yPos + 3, { align: "center" });
  }
  yPos += filaAltura;

  // Fila 2: Etiquetas de categorías (0/0 | 1/0 | 1/1 1/2 | 2/1 2/2 2/3 | 3/2 3/3 3/+ | A,B,C | ST)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < numColsILO; i++) {
    doc.line(colPositionsILO[i], yPos, colPositionsILO[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "normal").setFontSize(7);
  const catLabels = ['0/0', '1/0', '1/1 1/2', '2/1 2/2 2/3', '3/2 3/3 3/+', 'A B C', 'ST'];
  for (let i = 0; i < numColsILO; i++) {
    const label = catLabels[i];
    const anchoLabel = doc.getTextWidth(label);
    
    if (i === 2) {
      // Para la tercera celda (1/1 1/2), centrar cada parte en su subdivisión
      const texto1 = "1/1";
      const texto2 = "1/2";
      const anchoTexto1 = doc.getTextWidth(texto1);
      const anchoTexto2 = doc.getTextWidth(texto2);
      
      // Centrar "1/1" en la primera mitad
      doc.text(texto1, colPositionsILO[i] + ((colWidthILO / 2 - anchoTexto1) / 2), yPos + 3.5);
      // Centrar "1/2" en la segunda mitad
      doc.text(texto2, terceraCeldaMitad + ((colWidthILO / 2 - anchoTexto2) / 2), yPos + 3.5);
    } else if (i === 3) {
      // Para la cuarta celda (2/1 2/2 2/3), centrar cada parte en su subdivisión
      const texto1 = "2/1";
      const texto2 = "2/2";
      const texto3 = "2/3";
      const anchoTexto1 = doc.getTextWidth(texto1);
      const anchoTexto2 = doc.getTextWidth(texto2);
      const anchoTexto3 = doc.getTextWidth(texto3);
      
      // Centrar "2/1" en la primera tercera parte
      doc.text(texto1, colPositionsILO[i] + ((colWidthILO / 3 - anchoTexto1) / 2), yPos + 3.5);
      // Centrar "2/2" en la segunda tercera parte
      doc.text(texto2, cuartaCeldaTercio1 + ((colWidthILO / 3 - anchoTexto2) / 2), yPos + 3.5);
      // Centrar "2/3" en la tercera parte
      doc.text(texto3, cuartaCeldaTercio2 + ((colWidthILO / 3 - anchoTexto3) / 2), yPos + 3.5);
    } else if (i === 4) {
      // Para la quinta celda (3/2 3/3 3/+), centrar cada parte en su subdivisión
      const texto1 = "3/2";
      const texto2 = "3/3";
      const texto3 = "3/+";
      const anchoTexto1 = doc.getTextWidth(texto1);
      const anchoTexto2 = doc.getTextWidth(texto2);
      const anchoTexto3 = doc.getTextWidth(texto3);
      
      // Centrar "3/2" en la primera tercera parte
      doc.text(texto1, colPositionsILO[i] + ((colWidthILO / 3 - anchoTexto1) / 2), yPos + 3.5);
      // Centrar "3/3" en la segunda tercera parte
      doc.text(texto2, quintaCeldaTercio1 + ((colWidthILO / 3 - anchoTexto2) / 2), yPos + 3.5);
      // Centrar "3/+" en la tercera parte
      doc.text(texto3, quintaCeldaTercio2 + ((colWidthILO / 3 - anchoTexto3) / 2), yPos + 3.5);
    } else {
      // Para las demás celdas, centrar normalmente
      doc.text(label, colPositionsILO[i] + ((colWidthILO - anchoLabel) / 2), yPos + 3.5);
    }
  }
  yPos += filaAltura;

  // Fila 3: Etiquetas de profusión (cero | 1/0 | uno | dos | tres | cuatro | -)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < numColsILO; i++) {
    doc.line(colPositionsILO[i], yPos, colPositionsILO[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const profLabels = ['cero', '1/0', 'uno', 'dos', 'tres', 'cuatro', '-'];
  for (let i = 0; i < numColsILO; i++) {
    const label = profLabels[i];
    const anchoLabel = doc.getTextWidth(label);
    doc.text(label, colPositionsILO[i] + ((colWidthILO - anchoLabel) / 2), yPos + 3.5);
  }
  yPos += filaAltura;

  // === SECCIÓN ADICIONAL: OTROS HALLAZGOS RADIOGRÁFICOS ===
  yPos = dibujarHeaderSeccion("OTROS HALLAZGOS RADIOGRÁFICOS", yPos, filaAltura);

  // Fila para "Sin neumoconiosis" y "Imagen Radiográfica de exposición de polvo" (2 columnas)
  const colWidthOther = tablaAncho / 2;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + colWidthOther, yPos, tablaInicioX + colWidthOther, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sin neumoconiosis:", tablaInicioX + 2, yPos + 3.5);
  doc.text("Imagen Radiográfica de exposición de polvo:", tablaInicioX + colWidthOther + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const yTextoOther1 = dibujarTextoConSaltoLinea(datosFinales.sinNeumoconiosis, tablaInicioX + 40, yPos + 1, colWidthOther - 40);
  dibujarTextoConSaltoLinea(datosFinales.imagenRadiograficaExposicionPolvo, tablaInicioX + colWidthOther + 60, yPos + 1, colWidthOther - 60);
  yPos += filaAltura;

  // Fila para "Con neumoconiosis" (columna completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Con neumoconiosis:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const yTextoOther2 = dibujarTextoConSaltoLinea(datosFinales.conNeumoconiosis, tablaInicioX + 50, yPos + 1, tablaAncho - 50);
  yPos += Math.max(filaAltura, yTextoOther2 - yPos + 1); // Ajustar altura dinámica si es necesario

  // Fila para "Reacciones serológicas LUES-no LUES" (columna completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Reacciones serológicas LUES-no LUES:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const yTextoOther3 = dibujarTextoConSaltoLinea(datosFinales.reaccionesSerologicasLues, tablaInicioX + 70, yPos + 1, tablaAncho - 70);
  yPos += Math.max(filaAltura, yTextoOther3 - yPos + 1); // Ajustar altura dinámica si es necesario

  // === SECCIÓN: EXAMENES DE LABORATORIO ===
  yPos = dibujarHeaderSeccion("EXAMENES DE LABORATORIO", yPos, filaAltura);

  // Fila celeste: Hemograma completo
  yPos = dibujarHeaderSeccionCeleste("Hemograma completo", yPos, filaAltura);

  // Fila: VSG | Glucosa | Urea | Creatinina (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 4, yPos, tablaInicioX + tablaAncho / 4, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + (3 * tablaAncho / 4), yPos, tablaInicioX + (3 * tablaAncho / 4), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido VSG, Glucosa, Urea, Creatinina
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("VSG:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vsg || "", tablaInicioX + 15, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Glucosa:", tablaInicioX + tablaAncho / 4 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.glucosa || "", tablaInicioX + tablaAncho / 4 + 25, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Urea:", tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.urea || "", tablaInicioX + tablaAncho / 2 + 20, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Creatinina:", tablaInicioX + (3 * tablaAncho / 4) + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.creatinina || "", tablaInicioX + (3 * tablaAncho / 4) + 30, yPos + 3.5);
  yPos += filaAltura;

  // Fila celeste: Perfil lipídico completo
  yPos = dibujarHeaderSeccionCeleste("Perfil lipídico completo", yPos, filaAltura);

  // Fila: L.DL | H.D.L | V.L.D.L | Triglicéridos | Colesterol total (5 columnas)
  const colWidthLipidico = tablaAncho / 5;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + colWidthLipidico, yPos, tablaInicioX + colWidthLipidico, yPos + filaAltura);
  doc.line(tablaInicioX + (2 * colWidthLipidico), yPos, tablaInicioX + (2 * colWidthLipidico), yPos + filaAltura);
  doc.line(tablaInicioX + (3 * colWidthLipidico), yPos, tablaInicioX + (3 * colWidthLipidico), yPos + filaAltura);
  doc.line(tablaInicioX + (4 * colWidthLipidico), yPos, tablaInicioX + (4 * colWidthLipidico), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido perfil lipídico
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("L.DL:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.ldl || "", tablaInicioX + 15, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("H.D.L:", tablaInicioX + colWidthLipidico + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.hdl || "", tablaInicioX + colWidthLipidico + 20, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("V.L.D.L:", tablaInicioX + (2 * colWidthLipidico) + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vldl || "", tablaInicioX + (2 * colWidthLipidico) + 25, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Triglicéridos:", tablaInicioX + (3 * colWidthLipidico) + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.trigliceridos || "", tablaInicioX + (3 * colWidthLipidico) + 35, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Colesterol total:", tablaInicioX + (4 * colWidthLipidico) + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.colesterolTotal || "", tablaInicioX + (4 * colWidthLipidico) + 40, yPos + 3.5);
  yPos += filaAltura;

  // Fila celeste: Examen completo de orina
  yPos = dibujarHeaderSeccionCeleste("Examen completo de orina", yPos, filaAltura);

  // Fila: Cocaína | Marihuana | Mercurio | Plomo (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 4, yPos, tablaInicioX + tablaAncho / 4, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + filaAltura);
  doc.line(tablaInicioX + (3 * tablaAncho / 4), yPos, tablaInicioX + (3 * tablaAncho / 4), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido examen de orina
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cocaína:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.cocaina || "", tablaInicioX + 25, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Marihuana:", tablaInicioX + tablaAncho / 4 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.marihuana || "", tablaInicioX + tablaAncho / 4 + 30, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Mercurio:", tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.mercurio || "", tablaInicioX + tablaAncho / 2 + 30, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Plomo:", tablaInicioX + (3 * tablaAncho / 4) + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.plomo || "", tablaInicioX + (3 * tablaAncho / 4) + 25, yPos + 3.5);
  yPos += filaAltura;

  // Fila: Grupo sanguíneo | Factor | Hemoglobina/Hematocrito (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho / 3, yPos, tablaInicioX + tablaAncho / 3, yPos + filaAltura);
  doc.line(tablaInicioX + (2 * tablaAncho / 3), yPos, tablaInicioX + (2 * tablaAncho / 3), yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido grupo sanguíneo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Grupo sanguíneo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.grupoSanguineo || "", tablaInicioX + 40, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Factor:", tablaInicioX + tablaAncho / 3 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.factorRh || "", tablaInicioX + tablaAncho / 3 + 25, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hemoglobina/Hematocrito:", tablaInicioX + (2 * tablaAncho / 3) + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.hemoglobinaHematocrito || "", tablaInicioX + (2 * tablaAncho / 3) + 60, yPos + 3.5);
  yPos += filaAltura;

  // Fila: APTO PARA TRABAJAR (columna completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("APTO PARA TRABAJAR:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.aptoParaTrabajar || "", tablaInicioX + 50, yPos + 3.5);
  yPos += filaAltura;

  // === FOOTER PÁGINA 2 ===
  footerTR(doc, { footerOffsetY: 8 });

  // === CREAR PÁGINA 3 ===
  doc.addPage();
  numeroPagina = 3;
  yPos = 35.5; // Posición inicial de la nueva página

  // Dibujar header en la nueva página
  drawHeader(numeroPagina);

  // === SECCIÓN: OTROS EXAMENES ===
  yPos = dibujarHeaderSeccion("OTROS EXAMENES", yPos, filaAltura);

  // Fila creciente con altura por defecto de 35mm
  const alturaFilaCrecientePag3 = 35; // 35mm por defecto
  const textoOtrosExamenesPag3 = datosFinales.otrosExamenes || "";
  const anchoDisponibleOtrosExamenesPag3 = tablaAncho - 4;
  const lineasOtrosExamenesPag3 = doc.splitTextToSize(textoOtrosExamenesPag3, anchoDisponibleOtrosExamenesPag3);
  
  // Calcular altura dinámica basada en el contenido, pero mínimo 35mm
  const alturaDinamicaOtrosExamenesPag3 = Math.max(alturaFilaCrecientePag3, lineasOtrosExamenesPag3.length * 2.5 + 2);

  // Dibujar líneas de la fila creciente
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaOtrosExamenesPag3);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaOtrosExamenesPag3);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaOtrosExamenesPag3, tablaInicioX + tablaAncho, yPos + alturaDinamicaOtrosExamenesPag3);

  // Contenido de la fila creciente
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasOtrosExamenesPag3, tablaInicioX + 2, yPos + 3.5);
  yPos += alturaDinamicaOtrosExamenesPag3;

  // === SECCIÓN: CONCLUSIONES ===
  yPos = dibujarHeaderSeccion("CONCLUSIONES", yPos, filaAltura);

  // Fila creciente para conclusiones
  const textoConclusionesPag3 = datosFinales.conclusiones || "";
  const anchoDisponibleConclusionesPag3 = tablaAncho - 4;
  const lineasConclusionesPag3 = doc.splitTextToSize(textoConclusionesPag3, anchoDisponibleConclusionesPag3);
  
  // Calcular altura dinámica basada en el contenido, mínimo 35mm
  const alturaDinamicaConclusionesPag3 = Math.max(35, lineasConclusionesPag3.length * 2.5 + 2);

  // Dibujar líneas de la fila creciente
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaConclusionesPag3);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaConclusionesPag3);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaConclusionesPag3, tablaInicioX + tablaAncho, yPos + alturaDinamicaConclusionesPag3);

  // Contenido de la fila creciente
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasConclusionesPag3, tablaInicioX + 2, yPos + 3.5);
  yPos += alturaDinamicaConclusionesPag3;

  // === SECCIÓN: RECOMENDACIONES / RESTRICCIONES ===
  yPos = dibujarHeaderSeccion("RECOMENDACIONES / RESTRICCIONES", yPos, filaAltura);

  // Fila creciente para recomendaciones
  const textoRecomendacionesPag3 = datosFinales.recomendacionesRestricciones || "";
  const anchoDisponibleRecomendacionesPag3 = tablaAncho - 4;
  const lineasRecomendacionesPag3 = doc.splitTextToSize(textoRecomendacionesPag3, anchoDisponibleRecomendacionesPag3);
  
  // Calcular altura dinámica basada en el contenido, mínimo 35mm
  const alturaDinamicaRecomendacionesPag3 = Math.max(35, lineasRecomendacionesPag3.length * 2.5 + 2);

  // Dibujar líneas de la fila creciente
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaRecomendacionesPag3);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaRecomendacionesPag3);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaRecomendacionesPag3, tablaInicioX + tablaAncho, yPos + alturaDinamicaRecomendacionesPag3);

  // Contenido de la fila creciente
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasRecomendacionesPag3, tablaInicioX + 2, yPos + 3.5);
  yPos += alturaDinamicaRecomendacionesPag3;

  // === SECCIÓN DE DECLARACIÓN, FIRMA Y HUELLA DEL TRABAJADOR ===
  const alturaSeccionDeclaracion = 30; // Altura para la sección de declaración

  // Dibujar las líneas de la sección de declaración (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaSeccionDeclaracion); // Línea izquierda
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + alturaSeccionDeclaracion); // Primera división
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + alturaSeccionDeclaracion); // Segunda división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionDeclaracion); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaSeccionDeclaracion, tablaInicioX + tablaAncho, yPos + alturaSeccionDeclaracion); // Línea inferior

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
  justificarTexto(textoDeclaracion, tablaInicioX + 2, yPos + 3, 55, 2.5);

  // === COLUMNA 2: FIRMA Y HUELLA DEL TRABAJADOR ===
  const firmaTrabajadorY = yPos + 3;
  
  // Calcular centro de la columna 2 para centrar las imágenes
  const centroColumna2X = tablaInicioX + 60 + (60 / 2); // Centro de la columna 2
  
  // Agregar firma del trabajador (lado izquierdo)
  let firmaTrabajadorUrl = getSign(data, "FIRMAP");
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
  let huellaTrabajadorUrl = getSign(data, "HUELLA");
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
  doc.text("Firma y Huella del trabajador", centroColumna2, yPos + 26, { align: "center" });

  // === COLUMNA 3: SELLO Y FIRMA DEL MÉDICO ===
  const firmaMedicoX = tablaInicioX + 125;
  const firmaMedicoY = yPos + 3;
  
  // Agregar firma y sello médico
  let firmaMedicoUrl = getSign(data, "SELLOFIRMA");
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
  doc.text("Sello y Firma del Médico", centroColumna3, yPos + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumna3, yPos + 28.5, { align: "center" });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });

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