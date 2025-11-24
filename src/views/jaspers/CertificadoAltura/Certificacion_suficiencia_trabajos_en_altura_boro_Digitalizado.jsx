import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { normalizeList } from "../../utils/listUtils";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { getSign } from '../../utils/helpers.js';

export default function Certificacion_suficiencia_trabajos_en_altura_boro_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Datos de prueba por defecto
  const datosPrueba = {
    numeroHistoria: "96639",
    tipoExamen: "PRE-OCUPACIONAL",
    apellidosNombres: "TASILLA RAMIREZ RAFAEL",
    documentoIdentidad: "48512123",
    genero: "MASCULINO",
    edad: "36",
    fechaNacimiento: "07/10/1988",
    domicilio: "ARICA 172",
    puestoTrabajo: "AYUDANTE",
    areaTrabajo: "PRODUCCION",
    empresa: "INGENIERIA Y SERVICIOS E.I.R.L",
    contratista: "N/A",
    anosExperiencia: "5",
    primeraAptitud: true,
    revalidacion: false,
    fechaExamen: "08/04/2025",
    // Datos de color
    color: 1,
    codigoColor: "#008f39",
    textoColor: "F",
    // Datos adicionales para header
    numeroFicha: "99164",
    sede: "Trujillo-Pierola",
    // Detalle información
    detalleInformacion: "Información adicional del examen médico ocupacional para certificación de conducción de vehículos motorizados.  ocupacional para certificación de conducción de vehículos motorizados",
    // Observaciones
    observaciones: "El paciente presenta aptitud médica para conducción de vehículos según evaluación realizada.",
    // Observaciones y Recomendaciones
    observacionesRecomendaciones: "El paciente cumple con todos los requisitos médicos para la conducción de vehículos motorizados. Se recomienda seguimiento médico anual y evaluación de la presión arterial cada 6 meses.",
    // Detalle pruebas complementarias
    detallePruebasComplementarias: "Resultados de laboratorio dentro de parámetros normales según valores de referencia establecidos.",
    // Datos del examen físico
    fc: "60",
    fr: "60",
    pa: "50/60",
    talla: "170",
    peso: "65",
    imc: "0.00",
    perimetroCuello: "44",
    perimetroCintura: "75",
    perimetroCadera: "80",
    icc: "0.85",
    ptInspiracion: "95",
    ptAspiracion: "90",
    // Conclusión de la evaluación (demo)
    conclusionDesde: "04/11/2000",
    conclusionHasta: "04/11/2025",
    conclusionApto: true,
    conclusionNoApto: false,
    conclusionObservado: false,
    // Detalle nueva sección
    detalleNuevaSeccion: "Información adicional de la nueva sección del examen médico."
  };

  // Datos reales mapeados desde la estructura de ficha_antecedente_patologico_Digitalizado.jsx
  const datosReales = {
    numeroHistoria: String(data.norden ?? ""),
    tipoExamen: String(data.nombreExamen ?? ""),
    apellidosNombres: String((data.apellidosPaciente ?? "") + " " + (data.nombresPaciente ?? "")).trim(),
    documentoIdentidad: String(data.dniPaciente ?? ""),
    genero: data.sexoPaciente === "M" ? "MASCULINO" : data.sexoPaciente === "F" ? "FEMENINO" : String(data.sexoPaciente ?? ""),
    edad: String(data.edadPaciente ?? ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente ?? ""),
    domicilio: String(data.direccionPaciente ?? ""),
    puestoTrabajo: String(data.cargoPaciente ?? ""),
    areaTrabajo: String(data.areaPaciente ?? ""),
    empresa: String(data.empresa ?? ""),
    contratista: String(data.contrata ?? ""),
    anosExperiencia: String(data.tiempoExperiencia_t_experiencia ?? ""),
    primeraAptitud: Boolean(data.primeraAptitud_chk_primera ?? false),
    revalidacion: Boolean(data.revalidacion_chk_revalidacion ?? false),
    fechaExamen: formatearFechaCorta(data.fechaExamen_f_examen ?? ""),
    // Datos de color
    color: data.color || 1,
    codigoColor: data.codigoColor || "#008f39",
    textoColor: data.textoColor || "F",
    // Datos adicionales para header
    numeroFicha: String(data.norden ?? ""),
    sede: data.sede || data.nombreSede || "",
    // Detalle información
    detalleInformacion: String(data.detalleInformacion_d_informacion ?? ""),
    // Observaciones
    observaciones: String(data.observacionesRecomendaciones_b_c_observaciones ?? ""), //revisar - podría ser otro campo
    // Observaciones y Recomendaciones
    observacionesRecomendaciones: String(data.observacionesRecomendaciones_b_c_observaciones ?? ""),
    // Detalle pruebas complementarias
    detallePruebasComplementarias: String(data.detalleMedicina_d_medicina ?? ""), //revisar - mapeo incierto
    // Datos del examen físico - Signos vitales
    fc: String(data.frecuenciaCardiaca ?? ""),
    fr: String(data.frecuenciaRespiratoriaTriaje_f_respiratoria ?? ""),
    pa: String((data.sistolica ?? "") + "/" + (data.diastolica ?? "")),
    talla: String(data.tallaTriaje ?? ""),
    peso: String(data.pesoTriaje ?? ""),
    imc: String(data.imcTriaje ?? ""),
    perimetroCuello: String(data.perimetroCuelloTriaje ?? ""),
    perimetroCintura: String(data.cinturaTriaje ?? ""),
    perimetroCadera: String(data.caderaTriaje ?? ""),
    icc: String(data.iccTriaje ?? ""),
    ptInspiracion: String(data.maximaInspiracionPtoracico_p_max_inspiracion ?? ""),
    ptAspiracion: String(data.forazadaPtoracico_p_ex_forzada ?? ""),
    // Conclusión evaluación
    conclusionDesde: formatearFechaCorta(data.fechaDesde_f_desde ?? ""),
    conclusionHasta: formatearFechaCorta(data.fechaHasta_f_hasta ?? ""),
    conclusionApto: Boolean(data.apto_chk_si ?? false),
    conclusionNoApto: Boolean(data.noApto_chk_no_apto ?? false),
    conclusionObservado: Boolean(data.observado_chk_observado ?? false),
    conclusionAptoConRestriccion: Boolean(data.aptoConRestriccion_chk_apto_r ?? false),
    // Detalle nueva sección
    detalleNuevaSeccion: String(data.antecedentesComentariosDetalles_comentariosdetalleantecedent ?? ""), //revisar - mapeo incierto
    // Campos adicionales específicos del certificado de altura
    codigoCertificado: String(data.codigoCertificado_cod_certificado ?? ""),
    temperatura: String(data.temperatura ?? ""),
    saturacionOxigeno: String(data.saturacionOxigenoTriaje_sat_02 ?? ""),
    conclusionTriaje: String(data.conclusionTriaje ?? ""),
    // Antecedentes médicos - checkboxes
    antecedentesTodasEnfermedadesSi: Boolean(data.antecedentesTodasEnfermedadesSi_chk_1_si ?? false),
    antecedentesTodasEnfermedadesNo: Boolean(data.antecedentesTodasEnfermedadesNo_chk_1_no ?? false),
    antecedentesAlcoholismoCronicoSi: Boolean(data.antecedentesAlcoholismoCronicoSi_chk_2_si ?? false),
    antecedentesAlcoholismoCronicoNo: Boolean(data.antecedentesAlcoholismoCronicoNo_chk_2_no ?? false),
    antecedentesEnfermedadesInvoluntariosSi: Boolean(data.antecedentesEnfermedadesInvoluntariosSi_chk_3_si ?? false),
    antecedentesEnfermedadesInvoluntariosNo: Boolean(data.antecedentesEnfermedadesInvoluntariosNo_chk_3_no ?? false),
    antecedentesPerdidaConcienciaSi: Boolean(data.antecedentesPerdidaConcienciaSi_chk_4_si ?? false),
    antecedentesPerdidaConcienciaNo: Boolean(data.antecedentesPerdidaConcienciaNo_chk_4_no ?? false),
    chk5Si: Boolean(data.chk5Si_chk_5_si ?? false),
    chk5No: Boolean(data.chk5No_chk_5_no ?? false),
    antecedentesConsumeSustanciasSiAltereSi: Boolean(data.antecedentesConsumeSustanciasSiAltereSi_chk_7_si ?? false),
    antecedentesConsumeSustanciasSiAltereNo: Boolean(data.antecedentesConsumeSustanciasSiAltereNo_chk_7_no ?? false),
    antecedentesConsumeSustanciasNoAltereSi: Boolean(data.antecedentesConsumeSustanciasNoAltereSi_chk_8_si ?? false),
    antecedentesConsumeSustanciasNoAltereNo: Boolean(data.antecedentesConsumeSustanciasNoAltereNo_chk_8_no ?? false),
    antecedentesVariosEfectosSi: Boolean(data.antecedentesVariosEfectosSi_chk_9_si ?? false),
    antecedentesVariosEfectosNo: Boolean(data.antecedentesVariosEfectosNo_chk_9_no ?? false),
    antecedentesApneaSi: Boolean(data.antecedentesApneaSi_chk_10_si ?? false),
    antecedentesApneaNo: Boolean(data.antecedentesApneaNo_chk_10_no ?? false),
    antecedentesObesidadSi: Boolean(data.antecedentesObesidadSi_chk_11_si ?? false),
    antecedentesObesidadNo: Boolean(data.antecedentesObesidadNo_chk_11_no ?? false),
    antecedentesDiabetesMellitusSi: Boolean(data.antecedentesDiabetesMellitusSi_chk_29_si ?? false),
    antecedentesDiabetesMellitusNo: Boolean(data.antecedentesDiabetesMellitusNo_chk_29_no ?? false),
    chk30Si: Boolean(data.chk30Si_chk_30_si ?? false),
    chk30No: Boolean(data.chk30No_chk_30_no ?? false),
    // Pruebas complementarias - checkboxes
    pcomplementariasHipoacusiaSi: Boolean(data.pcomplementariasHipoacusiaSi_chk_13_si ?? false),
    pcomplementariasHipoacusiaNo: Boolean(data.pcomplementariasHipoacusiaNo_chk_13_no ?? false),
    pcomplementariasAlteracionAgudezaVisualSi: Boolean(data.pcomplementariasAlteracionAgudezaVisualSi_chk_14_si ?? false),
    pcomplementariasAlteracionAgudezaVisualNo: Boolean(data.pcomplementariasAlteracionAgudezaVisualNo_chk_14_no ?? false),
    pcomplementariasTemorAlturasSi: Boolean(data.pcomplementariasTemorAlturasSi_chk_15_si ?? false),
    pcomplementariasTemorAlturasNo: Boolean(data.pcomplementariasTemorAlturasNo_chk_15_no ?? false),
    pcomplementariasResfriadoSi: Boolean(data.pcomplementariasResfriadoSi_chk_16_si ?? false),
    pcomplementariasResfriadoNo: Boolean(data.pcomplementariasResfriadoNo_chk_16_no ?? false),
    pcomplementariasVertigoSi: Boolean(data.pcomplementariasVertigoSi_chk_17_si ?? false),
    pcomplementariasVertigoNo: Boolean(data.pcomplementariasVertigoNo_chk_17_no ?? false),
    pcomplementariaCampimetriaSi: Boolean(data.pcomplementariaCampimetriaSi_chk_18_si ?? false),
    pcomplementariaCampimetriaNo: Boolean(data.pcomplementariaCampimetriaNo_chk_18_no ?? false),
    // Examen físico - checkboxes
    examenFisicoLimitacionFuerzaSi: Boolean(data.examenFisicoLimitacionFuerzaSi_chk_19_si ?? false),
    examenFisicoLimitacionFuerzaNo: Boolean(data.examenFisicoLimitacionFuerzaNo_chk_19_no ?? false),
    examenFisicoAlteracionEquilibrioSi: Boolean(data.examenFisicoAlteracionEquilibrioSi_chk_20_si ?? false),
    examenFisicoAlteracionEquilibrioNo: Boolean(data.examenFisicoAlteracionEquilibrioNo_chk_20_no ?? false),
    examenFisicoAnormalidadMarchaSi: Boolean(data.examenFisicoAnormalidadMarchaSi_chk_21_si ?? false),
    examenFisicoAnormalidadMarchaNo: Boolean(data.examenFisicoAnormalidadMarchaNo_chk_21_no ?? false),
    examenFisicoAlteracionCoordinacionSi: Boolean(data.examenFisicoAlteracionCoordinacionSi_chk_22_si ?? false),
    examenFisicoAlteracionCoordinacionNo: Boolean(data.examenFisicoAlteracionCoordinacionNo_chk_22_no ?? false),
    examenFisicoAsimetriaFacialSi: Boolean(data.examenFisicoAsimetriaFacialSi_chk_23_si ?? false),
    examenFisicoAsimetriaFacialNo: Boolean(data.examenFisicoAsimetriaFacialNo_chk_23_no ?? false),
    exameFisicoNistagmusSi: Boolean(data.exameFisicoNistagmusSi_chk_24_si ?? false),
    exameFisicoNistagmusNo: Boolean(data.exameFisicoNistagmusNo_chk_24_no ?? false),
    examenFisicoAnormalidadMovimientoSi: Boolean(data.examenFisicoAnormalidadMovimientoSi_chk_25_si ?? false),
    examenFisicoAnormalidadMovimientoNo: Boolean(data.examenFisicoAnormalidadMovimientoNo_chk_25_no ?? false),
    examenFisicoCirlaSi: Boolean(data.examenFisicoCirlaSi_chk_26_si ?? false),
    examenFisicoCirlaNo: Boolean(data.examenFisicoCirlaNo_chk_26_no ?? false),
    examenFisicoAnormalidadLenguajeSi: Boolean(data.examenFisicoAnormalidadLenguajeSi_chk_27_si ?? false),
    examenFisicoAnormalidadLenguajeNo: Boolean(data.examenFisicoAnormalidadLenguajeNo_chk_27_no ?? false),
    examenFisicoMovimientoInvoluntarioSi: Boolean(data.examenFisicoMovimientoInvoluntarioSi_chk_28_si ?? false),
    examenFisicoMovimientoInvoluntarioNo: Boolean(data.examenFisicoMovimientoInvoluntarioNo_chk_28_no ?? false),
    examenFisicoSustentacionPie: Boolean(data.examenFisicoSustentacionPie_suste_pie_15 ?? false),
    // Función respiratoria
    fvcFuncionRespiratoria: String(data.fvcFuncionRespiratoria_fvc ?? ""),
    fev1FuncionRespiratoria: String(data.fev1FuncionRespiratoria_fev1 ?? ""),
    fev1FvcFuncionRespiratoria: String(data.fev1FvcFuncionRespiratoria_fev1fvc ?? ""),
    fef2575FuncionRespiratoria: String(data.fef2575FuncionRespiratoria_fef25_75 ?? ""),
    // Ficha SAS
    grado3FichaSas: Boolean(data.grado3FichaSas_chkgradoiii ?? false),
    grado4FichaSas: Boolean(data.grado4FichaSas_chkgradoiiii ?? false),
    aptoCriterioESiFichaSas: Boolean(data.aptoCriterioESiFichaSas_chk1_apto_sie ?? false),
    tiempoLicenciaBsas: String(data.tiempoLicenciaBsas_t_licencia ?? ""),
    // Presiones torácicas
    maximaInspiracionPtoracico: String(data.maximaInspiracionPtoracico_p_max_inspiracion ?? ""),
    forazadaPtoracico: String(data.forazadaPtoracico_p_ex_forzada ?? ""),
    // Oftalmología
    visioncercasincorregirod: String(data.visioncercasincorregirod_v_cerca_s_od ?? ""),
    visioncercasincorregiroi: String(data.visioncercasincorregiroi_v_cerca_s_oi ?? ""),
    oftalodccmologia: String(data.oftalodccmologia_odcc ?? ""),
    oiccoftalmologia: String(data.oiccoftalmologia_oicc ?? ""),
    visionlejossincorregirod: String(data.visionlejossincorregirod_v_lejos_s_od ?? ""),
    visionlejossincorregiroi: String(data.visionlejossincorregiroi_v_lejos_s_oi ?? ""),
    odlcoftalmologia: String(data.odlcoftalmologia_odlc ?? ""),
    oilcoftalmologia: String(data.oilcoftalmologia_oilc ?? ""),
    vcoftalmologia: String(data.vcoftalmologia_vc ?? ""),
    vboftalmologia: String(data.vboftalmologia_vb ?? ""),
    rpoftalmologia: String(data.rpoftalmologia_rp ?? ""),
    enfermedadesocularesoftalmo: String(data.enfermedadesocularesoftalmo_e_oculares ?? ""),
    // Audiometría
    oidoDerecho500Audiometria: String(data.oidoDerecho500Audiometria_o_d_500 ?? ""),
    oidoDerecho1000Audiometria: String(data.oidoDerecho1000Audiometria_o_d_1000 ?? ""),
    oidoDerecho2000Audiometria: String(data.oidoDerecho2000Audiometria_o_d_2000 ?? ""),
    oidoIzquierdo500Audiometria: String(data.oidoIzquierdo500Audiometria_o_i_500 ?? ""),
    oidoIzquierdo1000Audiometria: String(data.oidoIzquierdo1000Audiometria_o_i_1000 ?? ""),
    oidoIzquierdo2000Audiometria: String(data.oidoIzquierdo2000Audiometria_o_i_2000 ?? ""),
    // Aptitud con restricción
    aptoConRestriccion: Boolean(data.aptoConRestriccion_chk_apto_r ?? false),

  };

  // Usar datos reales si existen, sino usar datos de prueba
  const datosFinales = data && data.norden ? datosReales : datosPrueba;

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete - Subido 3.5 puntos
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 6.5 }); // 10 - 3.5 = 6.5

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("CERTIFICACION DE SUFICIENCIA MEDICA PARA TRABAJOS EN ALTURA", pageW / 2, 28, { align: "center" });
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("(encima de los 1.8 metros)", pageW / 2, 32, { align: "center" });
    }

    // Número de Ficha y Página (alineación automática mejorada)
    doc.setFont("helvetica", "normal").setFontSize(8);

    doc.text("Nro de ficha: ", pageW - 80, 13);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 60, 13);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 30, 8);
    doc.text("Sede: " + datosFinales.sede, pageW - 80, 18);
    doc.text("Fecha de examen: " + datosFinales.fechaExamen, pageW - 80, 23);

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

  // === DIBUJAR HEADER ===
  drawHeader(numeroPagina);

  // === TABLA DE DATOS PERSONALES ===
  const tablaInicioX = 10;
  const tablaInicioY = 33.5; // Ajustado para dar espacio al subtítulo
  const tablaAncho = 190;
  let yPos = tablaInicioY;

  // Altura general para todas las filas
  const filaAltura = 5;

  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    // Dibujar fondo gris más oscuro
    doc.setFillColor(196, 196, 196); // Gris más oscuro
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');

    // Dibujar líneas del header
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);

    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo, tablaInicioX + 2, yPos + 3);

    return yPos + alturaHeader; // Retorna la nueva posición Y
  };

  // Primera fila: AFILIACION usando función general
  yPos = dibujarHeaderSeccion("1. AFILIACION (a partir del registro médico)", yPos, filaAltura);

  // Segunda fila: Apellidos y Nombres (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Tercera fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura); // Primera división
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura); // Segunda división
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura); // Tercera división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Cuarta fila: Domicilio (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Quinta fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura); // División central
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Sexta fila: Empresa (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Séptima fila: Contrata (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Octava fila: Años de experiencia, Primera aptitud, Revalidación (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Primera división
  doc.line(tablaInicioX + 140, yPos, tablaInicioX + 140, yPos + filaAltura); // Segunda división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = tablaInicioY + 2.5;

  // Primera fila: AFILIACION (ya dibujada por dibujarHeaderSeccion)
  yTexto += filaAltura;

  // Segunda fila: Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 35, yTexto + 1, 130);
  yTexto += filaAltura;

  // Tercera fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.edad + " Años", tablaInicioX + 58, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.genero, tablaInicioX + 105, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento, tablaInicioX + 165, yTexto + 1);
  yTexto += filaAltura;

  // Cuarta fila: Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.domicilio, tablaInicioX + 25, yTexto + 1, 150);
  yTexto += filaAltura;

  // Quinta fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.puestoTrabajo, tablaInicioX + 30, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.areaTrabajo, tablaInicioX + 118, yTexto + 1);
  yTexto += filaAltura;

  // Sexta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 24, yTexto + 1, 160);
  yTexto += filaAltura;

  // Séptima fila: Contrata
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contratista, tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Octava fila: Años de experiencia, Primera aptitud, Revalidación (3 columnas)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Años de experiencia:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosFinales.anosExperiencia, tablaInicioX + 34, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Primera aptitud:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("(", tablaInicioX + 125, yTexto + 1);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(datosFinales.primeraAptitud ? "X" : "   ", tablaInicioX + 127, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(")", tablaInicioX + 130, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Revalidación:", tablaInicioX + 152, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("(", tablaInicioX + 175, yTexto + 1);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(datosFinales.revalidacion ? "X" : "   ", tablaInicioX + 177, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(")", tablaInicioX + 180, yTexto + 1);
  yTexto += filaAltura;


  // === SECCIÓN DE ANTECEDENTES ===
  yPos = dibujarHeaderSeccion("2.- ANTECEDENTES (Llenado por el médico, implicando nivel sospecha)", yPos, filaAltura);

  // Segunda fila: Opciones Si/No con divisiones de tabla (altura reducida)
  const alturaFilaAntecedentes = 3.5; // Altura reducida para esta fila específica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaAntecedentes); // Línea izquierda
  doc.line(tablaInicioX + 85, yPos, tablaInicioX + 85, yPos + alturaFilaAntecedentes); // Primera división
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + alturaFilaAntecedentes); // Primera división
  doc.line(tablaInicioX + 95, yPos, tablaInicioX + 95, yPos + alturaFilaAntecedentes); // Primera división
  doc.line(tablaInicioX + 180, yPos, tablaInicioX + 180, yPos + alturaFilaAntecedentes); // Segunda división
  doc.line(tablaInicioX + 185, yPos, tablaInicioX + 185, yPos + alturaFilaAntecedentes); // Tercera división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaAntecedentes); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaAntecedentes, tablaInicioX + tablaAncho, yPos + alturaFilaAntecedentes); // Línea inferior

  // Contenido de las celdas
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Si", tablaInicioX + 86.3, yPos + 2.5);
  doc.text("No", tablaInicioX + 91, yPos + 2.5);
  doc.text("Si", tablaInicioX + 181.3, yPos + 2.5);
  doc.text("No", tablaInicioX + 186, yPos + 2.5);

  yPos += alturaFilaAntecedentes;

  // Función para calcular posición Y centrada para texto corto
  const calcularPosicionYCentrada = (alturaFila) => {
    return alturaFila / 2 + 0.5; // Centrado vertical con pequeño ajuste
  };

  // === CONFIGURACIÓN DE FILAS ===
  // Aquí puedes cambiar fácilmente cada fila
  const configuracionFilas = [
    {
      numero: 1,
      textoIzquierdo: "Todas las enfermedades que produzcan alteración de la consciencia sin importar su causa e independiente de su tratamiento",
      textoDerecho: "Personas que consumen sustancias estupefacientes o psicotrópicas en niveles que alteren su capacidad o trabajar como controlar un vehículo.",
      alturaFila: 6,    // Altura exacta en mm que quieres para esta fila
      posicionY: 2.5        // Posición vertical del texto
    },
    {
      numero: 2,
      textoIzquierdo: "Alcoholismo crónico y en general todas aquellas enfermedades que produzcan incapacidad de efectuar movimientos voluntarios y/o que limiten la capacidad de trabajo como conducción, manejo o control físico de un vehículo motorizado, subir y bajar escaleras, etc.",
      textoDerecho: "Personas que consumen sustancias estupefacientes o psicotrópicas en niveles que no alteren su capacidad de trabajar, pero que se encuentran sin tratamiento o en tratamiento sin prescripción médica.",
      alturaFila: 11,    // Altura exacta en mm
      posicionY: 2.5
    },
    {
      numero: 3,
      textoIzquierdo: "Todas aquellas enfermedades que se caractericen por movimientos involuntarios y que interfieran seriamente su capacidad de trabajar, independiente de su tratamiento farmacológico.",
      textoDerecho: "Personas que como consecuencia de una enfermedad o su tratamiento, sufran uno o varios de los siguientes efectos: alteración del estado de consciencia, alteración del equilibrio, en la percepción, en la habilidad motriz, en la estabilidad emocional y en el juicio.",
      alturaFila: 11,    // Altura exacta en mm
      posicionY: 2.5
    },
    {
      numero: 4,
      textoIzquierdo: "Perdida recurrente de la consciencia, independiente de su tratamiento, tales como narcolepsia, epilepsia, etc.",
      textoDerecho: "Síndrome Apnea Obstructiva del sueño.",
      alturaFila: 5.5,    // Altura exacta en mm
      posicionY: 2.5
    },
    {
      numero: 5,
      textoIzquierdo: "Diabetes mellitus o hipoglicemia no controlada",
      textoDerecho: "Obesidad (IMC > o igual a 30)",
      alturaFila: 5,    // Altura exacta en mm (normal)
      posicionY: 2.5
    },
    {
      numero: 6,
      textoIzquierdo: "Insuficiencia renal crónica grado IV",
      textoDerecho: "Anemia de cualquier grado, según criterios OMS 2011.",
      alturaFila: 5,    // Altura exacta en mm (normal)
      posicionY: 2.5
    }
  ];

  // Función para dibujar una fila completa
  const dibujarFila = (config, yPos) => {
    // Usar la altura exacta que especificaste
    const alturaFila = config.alturaFila;

    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila);
    doc.line(tablaInicioX + 85, yPos, tablaInicioX + 85, yPos + alturaFila);
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + alturaFila);
    doc.line(tablaInicioX + 95, yPos, tablaInicioX + 95, yPos + alturaFila);
    doc.line(tablaInicioX + 180, yPos, tablaInicioX + 180, yPos + alturaFila);
    doc.line(tablaInicioX + 185, yPos, tablaInicioX + 185, yPos + alturaFila);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFila, tablaInicioX + tablaAncho, yPos + alturaFila);

    // Calcular ancho máximo disponible para cada texto
    const posicionTextoIzquierdo = tablaInicioX + 2;
    const posicionLineaDivisoriaIzquierda = tablaInicioX + 85;
    const maxWidthIzquierdo = posicionLineaDivisoriaIzquierda - posicionTextoIzquierdo - 2; // 81mm

    const posicionTextoDerecho = tablaInicioX + 97;
    const posicionLineaDivisoriaDerecha = tablaInicioX + 180;
    const maxWidthDerecho = posicionLineaDivisoriaDerecha - posicionTextoDerecho - 2; // 81mm

    // Contenido texto izquierdo
    doc.setFont("helvetica", "normal").setFontSize(7);
    dibujarTextoConSaltoLinea(config.textoIzquierdo, posicionTextoIzquierdo, yPos + config.posicionY, maxWidthIzquierdo);

    // Marca X izquierda - usar variables si están disponibles
    doc.setFont("helvetica", "normal").setFontSize(8);
    const siIzquierdo = config.siIzquierdo !== undefined ? config.siIzquierdo : false;
    const noIzquierdo = config.noIzquierdo !== undefined ? config.noIzquierdo : true;
    doc.text(siIzquierdo ? "X" : "", tablaInicioX + 86.3, yPos + alturaFila / 2 + 1);
    doc.text(noIzquierdo ? "X" : "", tablaInicioX + 91.5, yPos + alturaFila / 2 + 1);

    // Contenido texto derecho
    doc.setFont("helvetica", "normal").setFontSize(7);
    // Para texto corto, centrarlo verticalmente
    const esTextoDerechoCorto = config.textoDerecho.length < 50; // Si tiene menos de 50 caracteres
    const posYTextoDerecho = esTextoDerechoCorto ? yPos + calcularPosicionYCentrada(alturaFila, 6) : yPos + config.posicionY;
    dibujarTextoConSaltoLinea(config.textoDerecho, posicionTextoDerecho, posYTextoDerecho, maxWidthDerecho);

    // Marca X derecha - usar variables si están disponibles
    doc.setFont("helvetica", "normal").setFontSize(8);
    const siDerecho = config.siDerecho !== undefined ? config.siDerecho : false;
    const noDerecho = config.noDerecho !== undefined ? config.noDerecho : true;
    doc.text(siDerecho ? "X" : "", tablaInicioX + 181.3, yPos + alturaFila / 2 + 1);
    doc.text(noDerecho ? "X" : "", tablaInicioX + 186.5, yPos + alturaFila / 2 + 1);

    return alturaFila;
  };

  // === DIBUJAR TODAS LAS FILAS ===
  // Ahora es súper fácil cambiar cualquier fila
  configuracionFilas.forEach((config) => {
    const alturaFila = dibujarFila(config, yPos);
    yPos += alturaFila;
  });

  // Función para calcular altura dinámica para el texto de detalle
  const calcularAlturaDetalle = (texto, anchoMaximo, fontSize) => {
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

    // Altura mínima de 4mm, altura máxima de 12mm (3 líneas)
    return Math.max(lineas * fontSize * 0.35 + 1.5, 4);
  };

  // === FILA DE DETALLE INFORMACIÓN ===
  // Fila sin divisiones para información adicional
  if (datosFinales.detalleInformacion && datosFinales.detalleInformacion.trim() !== "") {
    const textoDetalle = "Detalle información: " + datosFinales.detalleInformacion;
    const anchoMaximoDetalle = tablaAncho - 4; // Ancho total menos márgenes
    const alturaFilaDetalle = calcularAlturaDetalle(textoDetalle, anchoMaximoDetalle, 7);

    // Dibujar líneas de la fila de detalle (sin divisiones internas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaDetalle); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaDetalle); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaDetalle, tablaInicioX + tablaAncho, yPos + alturaFilaDetalle); // Línea inferior

    // Contenido de la fila de detalle
    doc.setFont("helvetica", "normal").setFontSize(7);
    dibujarTextoConSaltoLinea(textoDetalle, tablaInicioX + 2, yPos + 2.5, anchoMaximoDetalle);

    yPos += alturaFilaDetalle;
  }

  // === SECCIÓN 3: PRUEBAS COMPLEMENTARIAS ===
  // Continuar directamente después del detalle información

  // Título de la sección 3 usando función general
  const filaAltura3 = 4;
  yPos = dibujarHeaderSeccion("3.- PRUEBAS COMPLEMENTARIAS (Llenado por el médico)", yPos, filaAltura3);

  // === ENCABEZADOS SI/NO PARA SECCIÓN 3 ===
  // Usar las mismas posiciones exactas que la sección 2
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaAntecedentes); // Línea izquierda
  doc.line(tablaInicioX + 85, yPos, tablaInicioX + 85, yPos + alturaFilaAntecedentes); // Primera división
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + alturaFilaAntecedentes); // Primera división
  doc.line(tablaInicioX + 95, yPos, tablaInicioX + 95, yPos + alturaFilaAntecedentes); // Primera división
  doc.line(tablaInicioX + 180, yPos, tablaInicioX + 180, yPos + alturaFilaAntecedentes); // Segunda división
  doc.line(tablaInicioX + 185, yPos, tablaInicioX + 185, yPos + alturaFilaAntecedentes); // Tercera división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaAntecedentes); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaAntecedentes, tablaInicioX + tablaAncho, yPos + alturaFilaAntecedentes); // Línea inferior

  // Contenido de las celdas (mismas posiciones que sección 2)
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Si", tablaInicioX + 86.3, yPos + 2.5);
  doc.text("No", tablaInicioX + 91, yPos + 2.5);
  doc.text("Si", tablaInicioX + 181.3, yPos + 2.5);
  doc.text("No", tablaInicioX + 186, yPos + 2.5);

  yPos += alturaFilaAntecedentes;

  // Configuración de filas para pruebas complementarias
  const configuracionFilasPruebas = [
    {
      numero: 1,
      textoIzquierdo: "Se encuentra usted resfriado o con algún cuadro respiratorio",
      textoDerecho: "Hipoacusia con compromiso de frecuencias conversacionales con promedio mayor de 40 dB uni o bilateral (no incluye audífonos).",
      alturaFila: 8.5,
      posicionY: 2.5,
      // Variables para checkbox izquierdo (resfriado)
      siIzquierdo: datosFinales.pcomplementariasResfriadoSi,
      noIzquierdo: datosFinales.pcomplementariasResfriadoNo,
      // Variables para checkbox derecho (hipoacusia)
      siDerecho: datosFinales.pcomplementariasHipoacusiaSi,
      noDerecho: datosFinales.pcomplementariasHipoacusiaNo
    },
    {
      numero: 2,
      textoIzquierdo: "Sufre de vértigo o mareos.",
      textoDerecho: "Alteración de la agudeza visual (de lejos diferente a 20/30 en cada ojo) y/o de la visión de profundidad incluso con lentes correctores.",
      alturaFila: 8.5,
      posicionY: 2.5,
      // Variables para checkbox izquierdo (vértigo)
      siIzquierdo: datosFinales.pcomplementariasVertigoSi,
      noIzquierdo: datosFinales.pcomplementariasVertigoNo,
      // Variables para checkbox derecho (alteración agudeza visual)
      siDerecho: datosFinales.pcomplementariasAlteracionAgudezaVisualSi,
      noDerecho: datosFinales.pcomplementariasAlteracionAgudezaVisualNo
    },
    {
      numero: 3,
      textoIzquierdo: "Temor a las alturas.",
      textoDerecho: "Campimetría Anormal (Test de confrontación alterada)",
      alturaFila: 5,
      posicionY: 2.5,
      // Variables para checkbox izquierdo (temor alturas)
      siIzquierdo: datosFinales.pcomplementariasTemorAlturasSi,
      noIzquierdo: datosFinales.pcomplementariasTemorAlturasNo,
      // Variables para checkbox derecho (campimetría)
      siDerecho: datosFinales.pcomplementariaCampimetriaSi,
      noDerecho: datosFinales.pcomplementariaCampimetriaNo
    },
    {
      numero: 4,
      textoIzquierdo: "Test de SAS : Anormal",
      textoDerecho: "Campimetría Anormal (Test de confrontación alterada)",
      alturaFila: 5,
      posicionY: 2.5,
      // Variables para checkbox izquierdo (SAS - no hay variable específica, usar false por defecto)
      siIzquierdo: false,
      noIzquierdo: true,
      // Variables para checkbox derecho (campimetría)
      siDerecho: datosFinales.pcomplementariaCampimetriaSi,
      noDerecho: datosFinales.pcomplementariaCampimetriaNo
    },

  ];

  // Dibujar todas las filas de pruebas complementarias
  configuracionFilasPruebas.forEach((config) => {
    const alturaFila = dibujarFila(config, yPos);
    yPos += alturaFila;
  });

  // === FILA DE DETALLE PARA PRUEBAS COMPLEMENTARIAS ===
  if (datosFinales.detallePruebasComplementarias && datosFinales.detallePruebasComplementarias.trim() !== "") {
    const textoDetallePruebas = "Detalle información: " + datosFinales.detallePruebasComplementarias;
    const anchoMaximoDetalle = tablaAncho - 4;
    const alturaFilaDetallePruebas = calcularAlturaDetalle(textoDetallePruebas, anchoMaximoDetalle, 6);

    // Dibujar líneas de la fila de detalle (sin divisiones internas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaDetallePruebas); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaDetallePruebas); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaDetallePruebas, tablaInicioX + tablaAncho, yPos + alturaFilaDetallePruebas); // Línea inferior

    // Contenido de la fila de detalle
    doc.setFont("helvetica", "normal").setFontSize(7);
    dibujarTextoConSaltoLinea(textoDetallePruebas, tablaInicioX + 2, yPos + 2.5, anchoMaximoDetalle);

    yPos += alturaFilaDetallePruebas;
  }

  // === SECCIÓN 4: EXAMEN FISICO ===
  // Continuar directamente después del detalle información de la sección 3

  // Título de la sección 4 usando función general
  const filaAltura4 = 4;
  yPos = dibujarHeaderSeccion("4.- EXAMEN FISICO (actual)", yPos, filaAltura4);

  // === FILA 1: SIGNOS VITALES (7 divisiones) ===
  const alturaFilaSignos = 4;

  // Dibujar líneas de la fila con 7 divisiones
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaSignos); // Línea izquierda
  doc.line(tablaInicioX + 24, yPos, tablaInicioX + 24, yPos + alturaFilaSignos); // División 1
  doc.line(tablaInicioX + 47.5, yPos, tablaInicioX + 47.5, yPos + alturaFilaSignos); // División 2
  doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + alturaFilaSignos); // División 3
  doc.line(tablaInicioX + 108, yPos, tablaInicioX + 108, yPos + alturaFilaSignos); // División 4
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + alturaFilaSignos); // División 5
  doc.line(tablaInicioX + 162, yPos, tablaInicioX + 162, yPos + alturaFilaSignos); // División 6
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaSignos); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaSignos, tablaInicioX + tablaAncho, yPos + alturaFilaSignos); // Línea inferior

  // Contenido de la fila de signos vitales
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FC :", tablaInicioX + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fc ? (datosFinales.fc + " lpm") : "", tablaInicioX + 8, yPos + 3);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FR :", tablaInicioX + 25, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fr ? (datosFinales.fr + " rpm") : "", tablaInicioX + 32, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("PA :", tablaInicioX + 49.5, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.pa ? (datosFinales.pa + " mmHg") : "", tablaInicioX + 56.5, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Talla :", tablaInicioX + 82, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.talla ? (datosFinales.talla + " cm") : "", tablaInicioX + 92, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Peso :", tablaInicioX + 110, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.peso ? (datosFinales.peso + " kg") : "", tablaInicioX + 120, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("IMC :", tablaInicioX + 137, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.imc ? (datosFinales.imc + " kg/m²") : "", tablaInicioX + 145, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("P. Cuello :", tablaInicioX + 164, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.perimetroCuello ? (datosFinales.perimetroCuello + " cm") : "", tablaInicioX + 178, yPos + 3);

  yPos += alturaFilaSignos;

  // === FILA 2: PERÍMETROS E ICC (5 divisiones) ===
  const alturaFilaPerimetros = 4;

  // Dibujar líneas de la fila con 5 divisiones
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaPerimetros); // Línea izquierda
  doc.line(tablaInicioX + 40, yPos, tablaInicioX + 40, yPos + alturaFilaPerimetros); // División 1
  doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + alturaFilaPerimetros); // División 2
  doc.line(tablaInicioX + 110, yPos, tablaInicioX + 110, yPos + alturaFilaPerimetros); // División 3
  doc.line(tablaInicioX + 148, yPos, tablaInicioX + 148, yPos + alturaFilaPerimetros); // División 4
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaPerimetros); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaPerimetros, tablaInicioX + tablaAncho, yPos + alturaFilaPerimetros); // Línea inferior

  // Contenido de la fila con todos los campos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("P. Cintura:", tablaInicioX + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.perimetroCintura ? (datosFinales.perimetroCintura + " cm") : "", tablaInicioX + 20, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("P. Cadera:", tablaInicioX + 42, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.perimetroCadera ? (datosFinales.perimetroCadera + " cm") : "", tablaInicioX + 60, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("ICC:", tablaInicioX + 82, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.icc || "", tablaInicioX + 95, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("P.T Inspiración:", tablaInicioX + 113, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.ptInspiracion ? (datosFinales.ptInspiracion + " cm") : "", tablaInicioX + 135, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("P.T Espiración:", tablaInicioX + 150, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.ptAspiracion ? (datosFinales.ptAspiracion + " cm") : "", tablaInicioX + 175, yPos + 3);

  yPos += alturaFilaPerimetros;

  // === SECCIÓN 5: NUEVA SECCIÓN ===
  // Continuar directamente después de las filas de perímetros

  // === ENCABEZADOS SI/NO PARA SECCIÓN 5 ===
  // Usar las mismas posiciones exactas que las secciones anteriores
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaAntecedentes); // Línea izquierda
  doc.line(tablaInicioX + 85, yPos, tablaInicioX + 85, yPos + alturaFilaAntecedentes); // Primera división
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + alturaFilaAntecedentes); // Primera división
  doc.line(tablaInicioX + 95, yPos, tablaInicioX + 95, yPos + alturaFilaAntecedentes); // Primera división
  doc.line(tablaInicioX + 180, yPos, tablaInicioX + 180, yPos + alturaFilaAntecedentes); // Segunda división
  doc.line(tablaInicioX + 185, yPos, tablaInicioX + 185, yPos + alturaFilaAntecedentes); // Tercera división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaAntecedentes); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaAntecedentes, tablaInicioX + tablaAncho, yPos + alturaFilaAntecedentes); // Línea inferior

  // Contenido de las celdas (mismas posiciones que secciones anteriores)
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Si", tablaInicioX + 86.3, yPos + 2.5);
  doc.text("No", tablaInicioX + 91, yPos + 2.5);
  doc.text("Si", tablaInicioX + 181.3, yPos + 2.5);
  doc.text("No", tablaInicioX + 186, yPos + 2.5);

  yPos += alturaFilaAntecedentes;

  // Configuración de filas para la nueva sección
  const configuracionFilasNuevaSeccion = [
    {
      numero: 1,
      textoIzquierdo: "Limitación en fuerza y/o movilidad de extremidades (Mayor a 5Kg / fuerza cada mano )",
      textoDerecho: "Presencia de nistagmus",
      alturaFila: 5.5,
      posicionY: 2.5
    },
    {
      numero: 2,
      textoIzquierdo: "Alteración presente del equilibrio. (Romberg).",
      textoDerecho: "Anormalidad en movimientos oculares",
      alturaFila: 4.0,
      posicionY: 2.5
    },
    {
      numero: 3,
      textoIzquierdo: "Anormalidad en la marcha.",
      textoDerecho: "Pupilas no CIRLA",
      alturaFila: 4.0,
      posicionY: 2.5
    },
    {
      numero: 4,
      textoIzquierdo: "Alteración de la coordinación (dedo índice nariz)",
      textoDerecho: "Anormalidad del lenguaje",
      alturaFila: 4.0,
      posicionY: 2.5
    },
    {
      numero: 5,
      textoIzquierdo: "Sustentación en 1 pie > 15",
      textoDerecho: "Movimientos involuntarios y/o Asimetría facial.",
      alturaFila: 4.0,
      posicionY: 2.5
    }
  ];

  // Dibujar todas las filas de la nueva sección
  configuracionFilasNuevaSeccion.forEach((config) => {
    const alturaFila = dibujarFila(config, yPos);
    yPos += alturaFila;
  });

  // === FILA DE DETALLE PARA NUEVA SECCIÓN ===
  if (datosFinales.detalleNuevaSeccion && datosFinales.detalleNuevaSeccion.trim() !== "") {
    const textoDetalleNuevaSeccion = "Detalle información: " + datosFinales.detalleNuevaSeccion;
    const anchoMaximoDetalle = tablaAncho - 4;
    const alturaFilaDetalleNuevaSeccion = calcularAlturaDetalle(textoDetalleNuevaSeccion, anchoMaximoDetalle, 6);

    // Dibujar líneas de la fila de detalle (sin divisiones internas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaDetalleNuevaSeccion); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaDetalleNuevaSeccion); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaDetalleNuevaSeccion, tablaInicioX + tablaAncho, yPos + alturaFilaDetalleNuevaSeccion); // Línea inferior

    // Contenido de la fila de detalle
    doc.setFont("helvetica", "normal").setFontSize(7);
    dibujarTextoConSaltoLinea(textoDetalleNuevaSeccion, tablaInicioX + 2, yPos + 2.5, anchoMaximoDetalle);

    yPos += alturaFilaDetalleNuevaSeccion;
  }

  // === SECCIÓN 5: CONCLUSIÓN DE LA PRESENTE EVALUACIÓN ===
  const alturaHeaderConclusion = 4;
  yPos = dibujarHeaderSeccion("5.- CONCLUSIÓN DE LA PRESENTE EVALUACIÓN", yPos, alturaHeaderConclusion);

  // === Fila única: Fechas + Opciones de Aptitud (6 columnas con anchos variables) ===
  const alturaFilaCombinada = 4.5;
  
  // Definir anchos de columnas proporcionales al contenido
  const anchoDesde = 35;      // "Desde:" + fecha
  const anchoHasta = 35;      // "Hasta:" + fecha  
  const anchoApto = 25;       // "Apto" (más estrecho)
  const anchoObservado = 30;   // "Observado"
  const anchoNoApto = 25;     // "No Apto"
  
  // Calcular posiciones de las divisiones
  const posDesde = tablaInicioX;
  const posHasta = posDesde + anchoDesde;
  const posApto = posHasta + anchoHasta;
  const posObservado = posApto + anchoApto;
  const posNoApto = posObservado + anchoObservado;
  const posRestriccion = posNoApto + anchoNoApto;
  
  // Líneas verticales para la fila combinada
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaCombinada); // izquierda
  doc.line(posHasta, yPos, posHasta, yPos + alturaFilaCombinada); // división 1
  doc.line(posApto, yPos, posApto, yPos + alturaFilaCombinada); // división 2
  doc.line(posObservado, yPos, posObservado, yPos + alturaFilaCombinada); // división 3
  doc.line(posNoApto, yPos, posNoApto, yPos + alturaFilaCombinada); // división 4
  doc.line(posRestriccion, yPos, posRestriccion, yPos + alturaFilaCombinada); // división 5
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaCombinada); // derecha
  
  // Líneas horizontales para la fila combinada
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // superior
  doc.line(tablaInicioX, yPos + alturaFilaCombinada, tablaInicioX + tablaAncho, yPos + alturaFilaCombinada); // inferior

  // Contenido de la fila combinada
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Columna 1: Desde
  doc.text("Desde:", posDesde + 2, yPos + 3);
  doc.text(datosFinales.conclusionDesde || "", posDesde + 15, yPos + 3);
  
  // Columna 2: Hasta
  doc.text("Hasta:", posHasta + 2, yPos + 3);
  doc.text(datosFinales.conclusionHasta || "", posHasta + 15, yPos + 3);
  
  // Columna 3: Apto (más estrecho)
  doc.text("Apto", posApto + 3, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("(", posApto + 15, yPos + 3);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(datosFinales.conclusionApto ? "X" : "   ", posApto + 17, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(")", posApto + 20, yPos + 3);
  
  // Columna 4: Observado
  doc.text("Observado", posObservado + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("(", posObservado + 20, yPos + 3);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(datosFinales.conclusionObservado ? "X" : "   ", posObservado + 22, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(")", posObservado + 25, yPos + 3);
  
  // Columna 5: No Apto
  doc.text("No Apto", posNoApto + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("(", posNoApto + 16, yPos + 3);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(datosFinales.conclusionNoApto ? "X" : "   ", posNoApto + 18, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(")", posNoApto + 21, yPos + 3);
  
  // Columna 6: Apto con Restricción (más ancho)
  doc.text("Apto c/Restricción", posRestriccion + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("(", posRestriccion + 30, yPos + 3);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(datosFinales.conclusionAptoConRestriccion ? "X" : "   ", posRestriccion + 32, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(")", posRestriccion + 35, yPos + 3);

  yPos += alturaFilaCombinada;

  // === SECCIÓN 6: OBSERVACIONES Y RECOMENDACIONES ===
  const alturaHeaderObservaciones = 4;
  yPos = dibujarHeaderSeccion("6.- OBSERVACIONES Y RECOMENDACIONES", yPos, alturaHeaderObservaciones);

  // Procesar observaciones usando normalizeList
  let observacionesLista = normalizeList(datosFinales.observacionesRecomendaciones);
  
  // Si no hay observaciones, usar observación por defecto
  if (observacionesLista.length === 0) {
    observacionesLista = ["Sin observaciones adicionales"];
  }
  
  // Crear texto con formato de lista (cada item en una línea)
  const observacionesTexto = observacionesLista.map(item => `${item}`).join('\n');

  // Calcular altura dinámica para la lista de observaciones
  // Contar las líneas del texto (cada observación es una línea)
  const lineasObservaciones = observacionesLista.length;
  const alturaPorLinea = 2.5; // Altura por línea en mm (reducida para fuente 6)
  const alturaFilaObservaciones = Math.max(lineasObservaciones * alturaPorLinea + 2, 8); // Mínimo 8mm

  // Dibujar la fila de observaciones con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaObservaciones); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaObservaciones); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaObservaciones, tablaInicioX + tablaAncho, yPos + alturaFilaObservaciones); // Línea inferior

  // Dibujar el texto de las observaciones en formato de lista con fuente 6
  doc.setFont("helvetica", "normal").setFontSize(6);
  
  // Función específica para dibujar texto con fuente 6 y interlineado correcto
  const dibujarTextoConSaltoLineaFuente6 = (texto, x, y, anchoMaximo) => {
    // Primero dividir por saltos de línea para manejar cada línea numerada por separado
    const lineasBase = texto.split('\n');
    let yPos = y;

    lineasBase.forEach(linea => {
      if (linea.trim() === '') {
        yPos += 2.5; // Espacio para línea vacía
        return;
      }

      const palabras = linea.split(' ');
      let lineaActual = '';

      palabras.forEach(palabra => {
        const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
        const anchoTexto = doc.getTextWidth(textoPrueba);

        if (anchoTexto <= anchoMaximo) {
          lineaActual = textoPrueba;
        } else {
          if (lineaActual) {
            doc.text(lineaActual, x, yPos);
            yPos += 2.5; // Interlineado específico para fuente 6
            lineaActual = palabra;
          } else {
            doc.text(palabra, x, yPos);
            yPos += 2.5;
          }
        }
      });

      if (lineaActual) {
        doc.text(lineaActual, x, yPos);
        yPos += 2.5; // Interlineado después de cada línea
      }
    });

    return yPos;
  };
  
  dibujarTextoConSaltoLineaFuente6(observacionesTexto, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
  
  yPos += alturaFilaObservaciones;


  // === NOTA AL PIE ===
  const yNotaAlPie = yPos;
  const alturaNotaAlPie = 5; // Altura fija compacta

  // Dibujar fondo naranja personalizado
  doc.setFillColor(245, 174, 103); // #f5ae67 - Naranja personalizado
  doc.rect(tablaInicioX, yNotaAlPie, tablaAncho, alturaNotaAlPie, 'F');

  // Dibujar texto de nota al pie
  doc.setFont("helvetica", "normal").setFontSize(6);
  doc.setTextColor(0, 0, 0);
  const textoNotaAlPie = "NOTA AL PIE: La presente certificación tiene una validez igual a la señalada en CONCLUSION. La aparición de alguna enfermedad NUEVA durante la duración de esta certificación invalida este permiso y deberá ser reevaluado medicamente. Antes de continuar conduciendo u operando algún tipo de vehículo.";
  dibujarTextoConSaltoLinea(textoNotaAlPie, tablaInicioX + 2, yNotaAlPie + 2, tablaAncho - 4);

  yPos += alturaNotaAlPie;

  // === SECCIÓN DE DECLARACIÓN, FIRMA Y HUELLA DEL TRABAJADOR ===
  const yDeclaracion = yPos; // Continuar directamente desde la nota al pie
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
  doc.text("Firma y Huella del trabajador", centroColumna2, yDeclaracion + 26, { align: "center" });

  // === COLUMNA 3: SELLO Y FIRMA DEL MÉDICO ===
  const firmaMedicoX = tablaInicioX + 125;
  const firmaMedicoY = yDeclaracion + 3;
  
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
  doc.text("Sello y Firma del Médico", centroColumna3, yDeclaracion + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumna3, yDeclaracion + 28.5, { align: "center" });

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
