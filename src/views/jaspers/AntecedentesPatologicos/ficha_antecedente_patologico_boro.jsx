import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { convertirGenero } from "../../utils/helpers.js";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function ficha_antecedente_patologico_boro_nuevo(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  const datosReales = {
    apellidosNombres: String((data.apellidos_apellidos_pa || "") + " " + (data.nombres_nombres_pa || "")).trim(),
    fechaExamen: formatearFechaCorta(data.fechaAntecedentesPatologicos_fecha_ap || ""),
    sexo: convertirGenero(data.sexo_sexo_pa || ""),
    documentoIdentidad: String(data.dni_cod_pa || ""),
    edad: String(data.edad_edad || ""),
    areaTrabajo: data.area_area_o || "",
    puestoTrabajo: data.cargo_cargo_de || "",
    empresa: data.empresa_razon_empresa || "",
    contrata: data.contrata_razon_contrata || "",
    // Datos de color
    color: data.color || "",
    codigoColor: data.codigoColor || "",
    textoColor: data.textoColor || "",
    // Datos adicionales para header
    numeroFicha: String(data.n_orden || ""),
    sede: data.sede || "",
    // Datos específicos
    direccionPaciente: String(data.direccionpaciente_direccion_pa || ""),
    domicilio: String(data.direccionpaciente_direccion_pa || ""), // Alias para compatibilidad
    fechaNacimiento: formatearFechaCorta(data.fechanacimientopaciente_fecha_nacimiento_pa || ""),
    // Datos adicionales para nueva fila
    anosExperiencia: data.tiempoExperiencia || null,
    // Datos de digitalización
    digitalizacion: data.digitalizacion || [],
    // Datos para accidente
    hasAccident: data.accidenteTrabajoBoro_accitrabajo || false,
    accidentDate: formatearFechaCorta(data.accidenteTrabajoFechaBoro_accit_fecha || ""),
    tiempoIncapacidad: data.tiempoIncapacidadBoro_timeincapacidad || "",
    causaBasicaAccidente: data.causaBasicaAccidente || "",
    // Datos adicionales para accidentes laborales
    hasWorkAccident: data.accidenteTrabajoBoro_accitrabajo || false,
    hasLostTime: data.descansoMedicoBoro_accit_descanso || false,
    lostTimePeriod: data.descansoMedicoEspecifiqueBoro_accit_descanso_detal || "",
    accidentCause: data.descansoMedicoEspecifiqueBoro_accit_descanso_detal || "",
    // Datos para enfermedades profesionales
    hasProfessionalDisease: data.enfermedadesProfesionalesBoro_enfe_prof || false,
    hasLaborDiseaseEvaluation: data.enfermedadesLaboralesCalificacionBoro_enfe_lab_calif || false,
    evaluationDate: formatearFechaCorta(data.enfermedadesProfesionalesFechaBoro_enfe_profecha || ""),
    diseaseDescription: data.enfermedadesLaboralesEspecifiqueBoro_enfe_lab_califdetal || "",
    // Datos para factores de riesgo adicionales
    otrosFactoresRiesgo: data.otrosAnexo7c_chkotros ? "Otros factores de riesgo" : "",
  // Datos adicionales para nuevas filas
  otrosPatologias: data.otrosDescripcionAntecedentesPatologicos_txtotrosap || "",
  patologiasEspecificas: data.otrosDescripcionIndicarEnfermedades_txtotros1ap || "",
  especifiqueTratamiento: data.especifiqueTratamientoBoro_especifique_detalleenfermedades || "",
  alergiasMedicamentos: data.alergiasAlimentosBoro_alergias_medic_alim || false,
  alergiasAlimentos: data.alergiasAlimentosBoro_alergias_medic_alim || false,
  especifiqueAlergias: data.alergiasAlimentosEspecifiqueBoro_alergias_medic_alimdetall || "",
  // Datos para vacunas
  antitetanica: data.antitetanicaBoro_antitetanica || false,
  hepatitisB: data.hepatitisBBoro_hepatitisb || false,
  papilomaHumano: data.papilomaHumanoBoro_papiloma_humano || false,
  fiebreAmarilla: data.fiebreAmarillaBoro_fiebre_amarilla || false,
  gripeInfluenza: data.gripeInfluenzaBoro_gripe_influenza || false,
  influenza: data.influenzaBoro_influenza || false,
  neumococo: data.neumococoBoro_neumococo || false,
  rabia: data.rabiaBoro_rabia || false,
  hepatitisA: data.hepatitisABoro_hepatitisa || false,
  covid19: data.covid_chkcovid || false,
  // COVID-19 para sección de vacunas
  covidVacunas: data.covidAntecedentePatologicoBoro_covid_antepatologico || false,
  dosisVacunas: String(data.dosisVacunas_txtdosis || ""),
  // Datos para antecedentes quirúrgicos
  antecedentesQuirurgicos: data.antecedentesPatologicosQuirurjicos || [],
  fechaQuirurgica: data.fechaAntecedentesPatologicosQuirurgicos || "",
  // Datos para hábitos
  alcoholSi: data.licorSi_rblicorsi || false,
  alcoholNo: data.licorNo_rblicorno || false,
  alcoholEspecifique: data.licorTipoFrecuente_txtlicortipofrecuente || "",
  tabacoSi: data.fumarSi_rbfumarsi || false,
  tabacoNo: data.fumarNo_rbfumarno || false,
  tabacoEspecifique: data.numeroCigarrillos_txtncigarrillos || "",
  drogasSi: data.drogasSi_rbdrogassi || false,
  drogasNo: data.drogasNo_rbdrogasno || false,
  drogasEspecifique: data.drogasTipo_txtdrogastipo || "",
  medicamentosSi: data.medicamentoBoro_medicamento || false,
  medicamentosNo: !data.medicamentoBoro_medicamento || false,
  medicamentosEspecifique: data.medicamentoEspecifiqueBoro_medicamento_detal || "",
  actividadFisicaSi: data.actividadFisicaBoro_activ_fisic || false,
  actividadFisicaNo: !data.actividadFisicaBoro_activ_fisic || false,
  actividadFisicaEspecifique: data.actividadFisicaEspecifiqueBoro_activ_fisic_detal || "",
  // Datos para antecedentes familiares
  padreEspecifique: data.padreEspecifiqueBoro_padre_detall || "",
  madreEspecifique: data.madreEspecifiqueBoro_madre_detall || "",
  hermanosEspecifique: data.hermanosEspecifiqueBoro_hermanos_detall || "",
  hijosEspecifique: data.hijosEspecifiqueBoro_hijos_detall || "",
  esposaConyugeEspecifique: data.esposConyEspecifiqueBoro_espos_cony_detall || "",
  // Datos para condición médica especial
  carnetConadis: data.conadisEspecifiqueBoro_conadisdetalle || "",
  // Datos para declaración
  fechaDeclaracion: data.fechaAntecedentesPatologicos_fecha_ap || "",
  // Página 3: campos adicionales del Digitalizado
  observacionesAntecedentes: String(data.otrosDescripcionAntecedentesPatologicos_txtotrosap || ""),
  antecedentesReproduccion: {
    damas: {
      inicioMenstruacion: String(data.inicioMestruacionDamas_txtdiniciomestruacion || ""),
      inicioVidaSexual: String(data.inicioVidaSexualDamas_txtdiniciovidasexual || ""),
      numeroParejas: String(data.numeroParejasSexActualidadDamas_txtdnumparejassexactualidad || ""),
      hijosVivos: String(data.hijosVivosDamas_txtdhijosvivos || ""),
      hijosFallecidos: String(data.hijosFallecidosDamas_txtdhijosfallecidos || ""),
      numeroAbortos: String(data.numerosDeAbortosDamas_txtdnumerosdeabortos || ""),
      causasAbortos: String(data.precisarCausasDamas_txtdcausas || "")
    },
    varones: {
      hijosVivos: String(data.hijosVivosVarones_txtvhijosvivos || ""),
      hijosFallecidos: String(data.hijosFallecidosVarones_txtvhijosfallecidos || ""),
      abortosParejas: String(data.abortosParejasVarones_txtvnabortosparejas || ""),
      causasAbortos: String(data.precisarCausasVarones_txtvcausas || "")
    }
  },
  enfermedades: {
    alergias: Boolean(data.alergias_chk1 || false),
    amigdalitisCronica: Boolean(data.amigdalitisCronica_chk2 || false),
    arritmiasCardiacas: Boolean(data.arritmiasCardiacas_chk3 || false),
    asma: Boolean(data.asma_chk4 || false),
    bocio: Boolean(data.bocio_chk5 || false),
    bronconeumonia: Boolean(data.bronconeumonia_chk6 || false),
    bronquitisRepeticion: Boolean(data.bronquitisARepeticion_chk7 || false),
    cariesGingivitis: Boolean(data.cariesOGingivitis_chk8 || false),
    colecistitis: Boolean(data.colecistitis_chk9 || false),
    dermatitis: Boolean(data.dermatitis_chk10 || false),
    diabetes: Boolean(data.diabetes_chk11 || false),
    disenteria: Boolean(data.disenteria_chk12 || false),
    enfermedadesCorazon: Boolean(data.enfermedadesCorazon_chk13 || false),
    enfermedadesOculares: Boolean(data.enfermedadesOculares_chk14 || false),
    epilepsiaConvulsiones: Boolean(data.epilsepsiaOConvulsiones_chk15 || false),
    faringitisCronica: Boolean(data.faringitisCronica_chk16 || false),
    fiebreAlta: Boolean(data.fiebreMalta_chk17 || false),
    fiebreTifoidea: Boolean(data.fiebreTifoidea_chk18 || false),
    fiebreReumatica: Boolean(data.fiebreReumatica_chk19 || false),
    forunculosis: Boolean(data.foruncolois_chk20 || false),
    gastritisCronica: Boolean(data.gastritisCronica_chk21 || false),
    gonorrea: Boolean(data.gonorrea_chk22 || false),
    gota: Boolean(data.gota_chk23 || false),
    hemorroides: Boolean(data.hemorroides_chk24 || false),
    hepatitis: Boolean(data.hepatitis_chk25 || false),
    hernias: Boolean(data.hernias_chk26 || false),
    hipertensionArterial: Boolean(data.hipertencionArterial_chk27 || false),
    infeccionesUrinarias: Boolean(data.urinariasRepetidas_chk28 || false),
    intoxicaciones: Boolean(data.intoxicaciones_chk29 || false),
    insuficienciaCardiaca: Boolean(data.insuficienciaCardiaca_chk30 || false),
    insuficienciaCoronaria: Boolean(data.insuficienciaCoronariaCronica_chk31 || false),
    insuficienciaRenal: Boolean(data.insuficienciaRenalCronica_chk32 || false),
    litiasisUrinaria: Boolean(data.litiasisUrinaria_chk33 || false),
    meningitis: Boolean(data.meningitis_chk34 || false),
    neuritisRepeticion: Boolean(data.neuritis_chk35 || false),
    otitisMedia: Boolean(data.otitisMedia_chk36 || false),
    presionAltaBaja: Boolean(data.presionAltaOBaja_chk37 || false),
    paludismoMalaria: Boolean(data.paludismoOMalaria_chk38 || false),
    parasitosisIntestinal: Boolean(data.parasitosisIntestinal_chk39 || false),
    parotiditis: Boolean(data.paratiditis_chk40 || false),
    pleuresia: Boolean(data.pleuresia_chk41 || false),
    plunbismo: Boolean(data.plumbismo_chk42 || false),
    poliomielitis: Boolean(data.poliomielitis_chk43 || false),
    portadorMarcapaso: Boolean(data.portadorMarcapasos_chk44 || false),
    protesisCardiacas: Boolean(data.protesisCardiacasValvulares_chk45 || false),
    resfriosFrecuentes: Boolean(data.resfriosFrecuentes_chk46 || false),
    reumatismoRepeticion: Boolean(data.reumatismo_chk47 || false),
    sarampion: Boolean(data.sarampion_chk48 || false),
    sifilis: Boolean(data.sifilis_chk49 || false),
    silicosis: Boolean(data.silicosis_chk50 || false),
    sinusitisCronica: Boolean(data.sinusitisCronica_chk51 || false),
    tosConvulsiva: Boolean(data.tosConvulsiva_chk52 || false),
    transtornoNerviosos: Boolean(data.transtornosNerviosos_chk53 || false),
    traumatismoEncefalocraneano: Boolean(data.traumatismoEncefalocraneano_chk54 || false),
    tuberculosis: Boolean(data.tuberculosis_chk55 || false),
    tumoresQuistes: Boolean(data.tumoresQuistes_chk56 || false),
    ulceraPeptica: Boolean(data.ulceraPeptica_chk57 || false),
    varicela: Boolean(data.varicela_chk58 || false),
    varices: Boolean(data.varices_chk59 || false),
    varicoceles: Boolean(data.varicocele_chk60 || false),
    covid19: Boolean(data.covid_chkcovid || false)
  },
  sintomas: {
    perdidaMemoria: Boolean(data.perdidaMemoria_chk61 || false),
    preocupacionesAngustia: Boolean(data.preocupacionesAngustia_chk62 || false),
    doloresArticulares: Boolean(data.doloresArticulares_chk63 || false),
    aumentoDisminucionPeso: Boolean(data.aumentoDisminucionPeso_chk64 || false),
    dolorCabeza: Boolean(data.dolorCabeza_chk65 || false),
    diarrea: Boolean(data.diarrea_chk66 || false),
    agitacionEjercicios: Boolean(data.agitacionEjercicio_chk67 || false),
    dolorOcular: Boolean(data.dolorOcular_chk68 || false),
    dolorOpresivoTorax: Boolean(data.dolorOpresivoTorax_chk69 || false),
    hinchazonPiesManos: Boolean(data.hinchazonPiesOManos_chk70 || false),
    estrenimiento: Boolean(data.estrenimiento_chk71 || false),
    vomitosSangre: Boolean(data.vomitosConSangre_chk72 || false),
    sangradoOrina: Boolean(data.sangradoPorOrina_chk73 || false),
    tosSangre: Boolean(data.tosConSangre_chk74 || false),
    coloracionAmarilla: Boolean(data.coloracionAmarrillaPiel_chk75 || false),
    indigestionFrecuente: Boolean(data.indigestionFrecuente_chk76 || false),
    insomnio: Boolean(data.insomnio_chk77 || false),
    lumbalgias: Boolean(data.lumbalgiaODolorCintura_chk78 || false),
    mareosDesmayos: Boolean(data.mareos_chk79 || false),
    hecesNegras: Boolean(data.hecesNegras_chk80 || false),
    orinaDolorArdor: Boolean(data.orinaConDolor_chk81 || false),
    orinaInvoluntaria: Boolean(data.orinaInvoluntaria_chk82 || false),
    dolorOido: Boolean(data.dolorOido_chk83 || false),
    secrecionesOido: Boolean(data.secrecionesOido_chk84 || false),
    palpitaciones: Boolean(data.palpitaciones_chk85 || false),
    adormecimiento: Boolean(data.adormecimientos_chk86 || false),
    pesadillas: Boolean(data.pesadillasFrecuentes_chk87 || false),
    doloresMusculares: Boolean(data.doloresMusculares_chk88 || false),
    tosCronica: Boolean(data.tosCronica_chk89 || false),
    sangradoEncias: Boolean(data.sangradoEncias_chk90 || false)
  },
  habitos: {
    fumar: Boolean(data.fumarSi_rbfumarsi || false),
    numeroCigarrillos: String(data.numeroCigarrillos_txtncigarrillos || ""),
    licor: Boolean(data.licorSi_rblicorsi || false),
    tipoLicor: String(data.licorTipoFrecuente_txtlicortipofrecuente || ""),
    frecuenciaLicor: String(data.licorFrecuencia_txtlicorfrecuencia || ""),
    drogas: Boolean(data.drogasSi_rbdrogassi || false),
    tipoDrogas: String(data.drogasTipo_txtdrogastipo || ""),
    frecuenciaDrogas: String(data.drogasFrecuencia_txtdrogasfrecuencia || ""),
    otros: Boolean(data.otrosSiIndicarEnfermedades_rbotrossi || false),
    tipoOtros: String(data.otrosTipoIndicarEnfermedades_txtotros || ""),
    frecuenciaOtros: String(data.otrosFrecuenciaIndicarEnfermedades_txtotrosfrecuencia || "")
  },
  severidadCovid: {
    covid19: Boolean(data.covid_chkcovid || false),
    fechaExamen: formatearFechaCorta(data.fechaCovid_fechacovid || ""),
    dosis: String(data.dosisVacunas_txtdosis || ""),
    leve: Boolean(data.covidLevel_chkcovidl || false),
    moderado: Boolean(data.covidModerado_chkcovidm || false),
    severo: Boolean(data.covidSevero_chkcovids || false)
  }
  };

  // Usar solo datos reales proporcionados
  const datosFinales = datosReales;

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (en todas las páginas)
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("DECLARACIÓN JURADA DE DATOS MÉDICOS", pageW / 2, 32.5, { align: "center" });
    doc.text("Y ANTECEDENTES PATOLÓGICOS", pageW / 2, 36.5, { align: "center" });

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
  drawHeader(1);

  // === FUNCIONES AUXILIARES ===
  // Función para capitalizar texto (primera letra mayúscula, resto minúsculas)
  const capitalizarTexto = (texto) => {
    if (!texto || typeof texto !== 'string') return '';
    
    // Si el texto está completamente en mayúsculas, aplicar capitalización palabra por palabra
    if (texto === texto.toUpperCase() && texto.length > 1) {
      return texto.split(' ').map(palabra => {
        if (palabra.length === 0) return palabra;
        // Preservar mayúsculas si la palabra es muy corta (como siglas)
        if (palabra.length <= 2 && /^[A-Z]+$/.test(palabra)) {
          return palabra;
        }
        // Capitalizar primera letra, resto minúsculas, pero preservar la letra original
        const primera = palabra.charAt(0).toUpperCase();
        // Si la letra original era especial (ó, ñ, etc.), intentar preservarla
        const original = palabra.slice(1);
        const restoPreservado = original.split('').map((char) => {
          const lower = char.toLowerCase();
          const upper = char.toUpperCase();
          // Si el carácter original tiene mayúscula especial, intentar usarla
          if (upper !== lower && char === char.toUpperCase()) {
            return lower;
          }
          return lower;
        }).join('');
        return primera + restoPreservado;
      }).join(' ');
    }
    
    // Para textos normales, solo capitalizar la primera letra
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    if (!texto) return y;
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
    const tablaInicioX = 5;
    const tablaAncho = 200;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar fondo gris más oscuro
    doc.setFillColor(196, 196, 196); // #CACACA
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    
    // Dibujar líneas del header
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
    
    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(8);
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
    doc.setFillColor(199, 241, 255);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    
    // Dibujar líneas del header
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
    
    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo, tablaInicioX + 10, yPos + 3.5);
    
    return yPos + alturaHeader;
  };

  // Función específica para el header de ANTECEDENTES con texto más a la izquierda
  const dibujarHeaderAntecedentes = (titulo, yPos, alturaHeader = 4) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar fondo celeste
    doc.setFillColor(199, 241, 255);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    
    // Dibujar líneas del header
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
    
    // Dibujar texto del título más a la izquierda
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);
    
    return yPos + alturaHeader;
  };

  // Función para parsear el template en unidades atómicas (palabras)
  const parseTemplate = (textoBase, datos, doc) => {
    const segments = [];
    const regex = /\{([^}]+)\}/g;
    let i = 0;
    let match;
    while ((match = regex.exec(textoBase)) !== null) {
      const start = match.index;
      if (start > i) {
        segments.push({ type: 'text', content: textoBase.substring(i, start) });
      }
      segments.push({ type: 'data', key: match[1] });
      i = regex.lastIndex;
    }
    if (i < textoBase.length) {
      segments.push({ type: 'text', content: textoBase.substring(i) });
    }

    // Construir unidades atómicas (palabras)
    const atomicUnits = [];
    segments.forEach((seg) => {
      let content;
      let isBold = false;
      if (seg.type === 'text') {
        content = seg.content;
      } else {
        content = datos[seg.key] || '';
        isBold = true;
      }
      
      if (content) {
        const words = content.match(/(\S+)/g) || [];
        words.forEach((word) => {
          let width;
          const prevFont = doc.getFont();
          if (isBold) {
            doc.setFont("helvetica", "bold");
          }
          width = doc.getTextWidth(word);
          doc.setFont(prevFont.fontName, prevFont.fontStyle);
          
          atomicUnits.push({
            type: 'word',
            text: word,
            isBold: isBold,
            width: width
          });
        });
      }
    });

    return atomicUnits;
  };

  // Función para dibujar texto justificado con datos en negrita
  const dibujarTextoJustificadoConBold = (textoBase, datos, xStart, yStart, maxWidth, justified = true) => {
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const atomicUnits = parseTemplate(textoBase, datos, doc);
    if (atomicUnits.length === 0) return yStart;

    const spaceWidth = doc.getTextWidth(' ');
    const interlineado = 3.5; // Interlineado ajustado para fontSize 8
    const punctRegex = /^[.,;:!?)\]}"']/;

    // Construir líneas
    const lines = [];
    let currentLine = [];
    let currentWidth = 0;

    atomicUnits.forEach((unit) => {
      let addedSpace = 0;
      if (currentLine.length > 0) {
        addedSpace = punctRegex.test(unit.text.charAt(0)) ? 0 : spaceWidth;
      }
      const addedWidth = addedSpace + unit.width;

      if (currentWidth + addedWidth > maxWidth && currentLine.length > 0) {
        lines.push([...currentLine]);
        currentLine = [unit];
        currentWidth = unit.width;
      } else {
        currentLine.push(unit);
        currentWidth += addedWidth;
      }
    });

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    // Dibujar líneas
    let yActual = yStart;

    lines.forEach((line) => {
      if (line.length === 0) return;

      // Calcular totalTextWidth
      let totalTextWidth = 0;
      for (let idx = 0; idx < line.length; idx++) {
        totalTextWidth += line[idx].width;
        if (idx < line.length - 1) {
          const nextText = line[idx + 1].text;
          const baseGap = punctRegex.test(nextText.charAt(0)) ? 0 : spaceWidth;
          totalTextWidth += baseGap;
        }
      }

      // Contar gaps flexibles (donde se distribuye extra)
      let numFlexGaps = 0;
      for (let idx = 0; idx < line.length - 1; idx++) {
        const nextText = line[idx + 1].text;
        if (!punctRegex.test(nextText.charAt(0))) {
          numFlexGaps++;
        }
      }

      let extraPerFlex = 0;
      if (numFlexGaps > 0 && justified) {
        const extra = maxWidth - totalTextWidth;
        extraPerFlex = extra / numFlexGaps;
      }

      // Dibujar
      let xCurrent = xStart;
      line.forEach((unit, idx) => {
        if (unit.isBold) {
          doc.setFont("helvetica", "bold");
        } else {
          doc.setFont("helvetica", "normal");
        }
        doc.text(unit.text, xCurrent, yActual);

        if (idx < line.length - 1) {
          const nextText = line[idx + 1].text;
          const isPunctNext = punctRegex.test(nextText.charAt(0));
          const baseGap = isPunctNext ? 0 : spaceWidth;
          const thisExtra = isPunctNext ? 0 : (justified ? extraPerFlex : 0);
          xCurrent += unit.width + baseGap + thisExtra;
        }
      });

      yActual += interlineado;
    });

    return yActual;
  };

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 40; // Posición inicial después del título
  const filaAltura = 5;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); 
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); 
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); 
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); 
  yPos += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Tercera fila: Domicilio (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Cuarta fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
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

  // Sexta fila: Contrata (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Séptima fila: Años de experiencia
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 40 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 35, yTexto + 1.5, tablaAncho - 40);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.edad + " AÑOS", tablaInicioX + 58, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.sexo.toUpperCase()), tablaInicioX + 105, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento, tablaInicioX + 155, yTexto + 1.5);
  yTexto += filaAltura;

  // Tercera fila: Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.direccionPaciente, tablaInicioX + 25, yTexto + 1.5, 160);
  yTexto += filaAltura;

  // Cuarta fila: Puesto de Trabajo, Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.puestoTrabajo), tablaInicioX + 30, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.areaTrabajo), tablaInicioX + 118, yTexto + 1.5);
  yTexto += filaAltura;

  // Quinta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 24, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Sexta fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.contrata), tablaInicioX + 24, yTexto + 1.5);
  yTexto += filaAltura;

  // Séptima fila: Años de experiencia
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Años de experiencia:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.anosExperiencia || "") , tablaInicioX + 40, yTexto + 1.5);
  yTexto += filaAltura;

  // Octava fila: Declaración (fila completa, altura mayor)
  const filaAlturaDeclaracion = 12;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaDeclaracion);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaDeclaracion);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaDeclaracion, tablaInicioX + tablaAncho, yPos + filaAlturaDeclaracion);
  yPos += filaAlturaDeclaracion;

  // Contenido de la declaración usando el método justificado con bold
  const textoDeclaracion = "Yo; {apellidosNombres} de {edad} de edad, con DNI/CE/PASAPORTE:{documentoIdentidad}, declaro que toda la información proporcionada en esta declaración jurada es verdadera no habiendo omitido ningún dato personal ni laboral relevante de forma voluntaria.";
  yTexto = dibujarTextoJustificadoConBold(textoDeclaracion, datosFinales, tablaInicioX + 2, yTexto + 2, tablaAncho - 4, true);

  // === SECCIÓN 2: ANTECEDENTES PATOLÓGICOS PERSONALES ===
  // Header gris para la sección 2
  yPos = dibujarHeaderSeccion("2. ANTECEDENTES PATOLÓGICOS PERSONALES", yPos, filaAltura);

 

  // Fila: Ha sufrido algún accidente relacionado al trabajo
  // Dibujar líneas de la fila
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Pregunta a la izquierda
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Ha sufrido algún accidente relacionado al trabajo:", tablaInicioX + 2, yPos + 3.5);
  
  // Checkboxes SI/NO con tamaño consistente
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (datosFinales.hasAccident) {
    doc.text("SI (  X  )", tablaInicioX + 120, yPos + 3.5);
    doc.text("NO (      )", tablaInicioX + 135, yPos + 3.5);
    
    // Fecha alineada a la derecha (solo si es SI)
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Fecha:", tablaInicioX + 155, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.accidentDate, tablaInicioX + 170, yPos + 3.5);
  } else {
    doc.text("SI (      )", tablaInicioX + 120, yPos + 3.5);
    doc.text("NO (  X  )", tablaInicioX + 135, yPos + 3.5);
  }
  
  yPos += filaAltura;

  // Fila celeste: Si la Respuesta es SI, responder las líneas inferiores
  yPos = dibujarHeaderSeccionCeleste("Si la Respuesta es SI, responder las líneas inferiores", yPos, filaAltura);

  // Fila: Hubo tiempo perdido (descanso médico)
  // Dibujar líneas de la fila
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Pregunta a la izquierda
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hubo tiempo perdido (descanso médico):", tablaInicioX + 10, yPos + 3.5);
  
  // Checkboxes SI/NO con tamaño consistente
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (datosFinales.hasLostTime) {
    doc.text("SI (  X  )", tablaInicioX + 120, yPos + 3.5);
    doc.text("NO (      )", tablaInicioX + 135, yPos + 3.5);
    
    // Tiempo alineado a la derecha (solo si es SI)
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Tiempo:", tablaInicioX + 155, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(capitalizarTexto(datosFinales.lostTimePeriod), tablaInicioX + 170, yPos + 3.5);
  } else {
    doc.text("SI (      )", tablaInicioX + 120, yPos + 3.5);
    doc.text("NO (  X  )", tablaInicioX + 135, yPos + 3.5);
  }
  
  yPos += filaAltura;

  // Fila: Especifique la causa básica (texto creciente)
  const tituloCausaAccidente = "Especifique la causa básica (o describa el evento): ";
  const datoCausaAccidente = capitalizarTexto(datosFinales.accidentCause || "");
  const textoCausaAccidente = tituloCausaAccidente + datoCausaAccidente;
  const anchoDisponibleCausaAccidente = tablaAncho - 4;
  const lineasCausaAccidente = doc.splitTextToSize(textoCausaAccidente, anchoDisponibleCausaAccidente);
  const alturaDinamicaCausaAccidente = Math.max(filaAltura, lineasCausaAccidente.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaCausaAccidente);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaCausaAccidente);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaCausaAccidente, tablaInicioX + tablaAncho, yPos + alturaDinamicaCausaAccidente);

  // Contenido de la fila dinámica
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasCausaAccidente, tablaInicioX + 2, yPos + 3.5);
  
  yPos += alturaDinamicaCausaAccidente;

  // Fila: Ha sido declarado con alguna enfermedad profesional
  // Dibujar líneas de la fila
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Pregunta a la izquierda
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Ha sido declarado con alguna enfermedad profesional o relacionada al trabajo:", tablaInicioX + 2, yPos + 3.5);
  
  // Checkboxes SI/NO con tamaño consistente
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (datosFinales.hasProfessionalDisease) {
    doc.text("SI (  X  )", tablaInicioX + 120, yPos + 3.5);
    doc.text("NO (      )", tablaInicioX + 135, yPos + 3.5);
  } else {
    doc.text("SI (      )", tablaInicioX + 120, yPos + 3.5);
    doc.text("NO (  X  )", tablaInicioX + 135, yPos + 3.5);
  }
  
  yPos += filaAltura;

  // Fila celeste: Si la Respuesta es SÍ, responder las líneas inferiores
  yPos = dibujarHeaderSeccionCeleste("Si la Respuesta es SÍ, responder las líneas inferiores", yPos, filaAltura);

  // Fila: Ha sido evaluado para calificación de enfermedad laboral
  // Dibujar líneas de la fila
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Pregunta a la izquierda
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Ha sido evaluado para calificación de enfermedad laboral:", tablaInicioX + 10, yPos + 3.5);
  
  // Checkboxes SI/NO con tamaño consistente
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (datosFinales.hasLaborDiseaseEvaluation) {
    doc.text("SI (  X  )", tablaInicioX + 120, yPos + 3.5);
    doc.text("NO (      )", tablaInicioX + 135, yPos + 3.5);
    
    // Fecha alineada a la derecha (solo si es SI)
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Fecha:", tablaInicioX + 155, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.evaluationDate, tablaInicioX + 170, yPos + 3.5);
  } else {
    doc.text("SI (      )", tablaInicioX + 120, yPos + 3.5);
    doc.text("NO (  X  )", tablaInicioX + 135, yPos + 3.5);
  }
  
  yPos += filaAltura;

  // Fila: Especifique cual (texto creciente)
  const tituloEnfermedad = "Especifique cual: ";
  const datoEnfermedad = capitalizarTexto(datosFinales.diseaseDescription || "");
  const textoEnfermedad = tituloEnfermedad + datoEnfermedad;
  const anchoDisponibleEnfermedad = tablaAncho - 4;
  const lineasEnfermedad = doc.splitTextToSize(textoEnfermedad, anchoDisponibleEnfermedad);
  const alturaDinamicaEnfermedad = Math.max(filaAltura, lineasEnfermedad.length * 2.5 + 2);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDinamicaEnfermedad);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDinamicaEnfermedad);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaDinamicaEnfermedad, tablaInicioX + tablaAncho, yPos + alturaDinamicaEnfermedad);

  // Contenido de la fila dinámica
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lineasEnfermedad, tablaInicioX + 2, yPos + 3.5);
  
  yPos += alturaDinamicaEnfermedad;

  // Fila celeste: Que factores de Riesgos ha estado expuesto durante su historia ocupacional
  yPos = dibujarHeaderSeccionCeleste("Que factores de Riesgos ha estado expuesto durante su historia ocupacional:", yPos, filaAltura);

  // Fila: Factores de riesgo con checkboxes
  // Dibujar líneas de la fila
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura); // División Ruido
  
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura); // División Vibraciones
  doc.line(tablaInicioX + 150, yPos, tablaInicioX + 150, yPos + filaAltura); // División Temperatura
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Dibujar líneas internas para mini celdas de las X
  // Mini celda para Ruido
  doc.line(tablaInicioX + 35, yPos, tablaInicioX + 35, yPos + filaAltura);
  doc.line(tablaInicioX + 35, yPos, tablaInicioX + 50, yPos);
  doc.line(tablaInicioX + 35, yPos + filaAltura, tablaInicioX + 50, yPos + filaAltura);
  
  // Mini celda para Vibraciones
  doc.line(tablaInicioX + 85, yPos, tablaInicioX + 85, yPos + filaAltura);
  doc.line(tablaInicioX + 85, yPos, tablaInicioX + 100, yPos);
  doc.line(tablaInicioX + 85, yPos + filaAltura, tablaInicioX + 100, yPos + filaAltura);
  
  // Mini celda para Temperatura
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 150, yPos);
  doc.line(tablaInicioX + 135, yPos + filaAltura, tablaInicioX + 150, yPos + filaAltura);
  
  // Mini celda para Quimicos
  doc.line(tablaInicioX + 185, yPos, tablaInicioX + 185, yPos + filaAltura);
  doc.line(tablaInicioX + 185, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX + 185, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Contenido de la fila
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Ruido", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.ruidoAnexo7c_chkruido ? "X" : "", tablaInicioX + 42, yPos + 3.5);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Vibraciones", tablaInicioX + 52, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.vibracionesAnexo7c_vibraciones ? "X" : "", tablaInicioX + 92, yPos + 3.5);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Temperatura", tablaInicioX + 102, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.temperaturaAnexo7c_chktemperatura ? "X" : "", tablaInicioX + 142, yPos + 3.5);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Quimicos", tablaInicioX + 152, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.quimicosAnexo7c_quimicos ? "X" : "", tablaInicioX + 192, yPos + 3.5);
  
  yPos += filaAltura;

  // Segunda fila: Polvo, Altura Estructura, Cancerigenos, Posturas
  // Dibujar líneas de la fila
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura); // División Polvo
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura); // División Altura Estructura
  doc.line(tablaInicioX + 150, yPos, tablaInicioX + 150, yPos + filaAltura); // División Cancerigenos
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Dibujar líneas internas para mini celdas de las X
  // Mini celda para Polvo
  doc.line(tablaInicioX + 35, yPos, tablaInicioX + 35, yPos + filaAltura);
  doc.line(tablaInicioX + 35, yPos, tablaInicioX + 50, yPos);
  doc.line(tablaInicioX + 35, yPos + filaAltura, tablaInicioX + 50, yPos + filaAltura);
  
  // Mini celda para Altura Estructura
  doc.line(tablaInicioX + 85, yPos, tablaInicioX + 85, yPos + filaAltura);
  doc.line(tablaInicioX + 85, yPos, tablaInicioX + 100, yPos);
  doc.line(tablaInicioX + 85, yPos + filaAltura, tablaInicioX + 100, yPos + filaAltura);
  
  // Mini celda para Cancerigenos
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 150, yPos);
  doc.line(tablaInicioX + 135, yPos + filaAltura, tablaInicioX + 150, yPos + filaAltura);
  
  // Mini celda para Posturas
  doc.line(tablaInicioX + 185, yPos, tablaInicioX + 185, yPos + filaAltura);
  doc.line(tablaInicioX + 185, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX + 185, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Contenido de la segunda fila
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Polvo", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.polvoAnexo7c_chkpolvo ? "X" : "", tablaInicioX + 42, yPos + 3.5);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Altura Estructura", tablaInicioX + 52, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.alturaEstructuraAnexo7c_altura_estructura ? "X" : "", tablaInicioX + 92, yPos + 3.5);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cancerigenos", tablaInicioX + 102, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.cancerigenosAnexo7c_chkcancerigenos ? "X" : "", tablaInicioX + 142, yPos + 3.5);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Posturas", tablaInicioX + 152, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.posturasAnexo7c_chkposturas ? "X" : "", tablaInicioX + 192, yPos + 3.5);
  
  yPos += filaAltura;

  // Tercera fila: Cargas, Altura Geografica, Biologicos, Electricos
  // Dibujar líneas de la fila
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura); // División Cargas
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura); // División Altura Geografica
  doc.line(tablaInicioX + 150, yPos, tablaInicioX + 150, yPos + filaAltura); // División Biologicos
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Dibujar líneas internas para mini celdas de las X
  // Mini celda para Cargas
  doc.line(tablaInicioX + 35, yPos, tablaInicioX + 35, yPos + filaAltura);
  doc.line(tablaInicioX + 35, yPos, tablaInicioX + 50, yPos);
  doc.line(tablaInicioX + 35, yPos + filaAltura, tablaInicioX + 50, yPos + filaAltura);
  
  // Mini celda para Altura Geografica
  doc.line(tablaInicioX + 85, yPos, tablaInicioX + 85, yPos + filaAltura);
  doc.line(tablaInicioX + 85, yPos, tablaInicioX + 100, yPos);
  doc.line(tablaInicioX + 85, yPos + filaAltura, tablaInicioX + 100, yPos + filaAltura);
  
  // Mini celda para Biologicos
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 150, yPos);
  doc.line(tablaInicioX + 135, yPos + filaAltura, tablaInicioX + 150, yPos + filaAltura);
  
  // Mini celda para Electricos
  doc.line(tablaInicioX + 185, yPos, tablaInicioX + 185, yPos + filaAltura);
  doc.line(tablaInicioX + 185, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX + 185, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Contenido de la tercera fila
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cargas", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.cargasAnexo7c_chkcargas ? "X" : "", tablaInicioX + 42, yPos + 3.5);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Altura Geografica", tablaInicioX + 52, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.alturaGeograficaAnexo7c_altura_geog ? "X" : "", tablaInicioX + 92, yPos + 3.5);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Biologicos", tablaInicioX + 102, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.biologicosAnexo7c_chkbiologicos ? "X" : "", tablaInicioX + 142, yPos + 3.5);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Electricos", tablaInicioX + 152, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.electricosAnexo7c_electricos ? "X" : "", tablaInicioX + 192, yPos + 3.5);
  
  yPos += filaAltura;

  // Cuarta fila: Metales y otros
  // Dibujar líneas de la fila
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura); // División Metales
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Dibujar línea interna para mini celda de Metales
  doc.line(tablaInicioX + 35, yPos, tablaInicioX + 35, yPos + filaAltura);
  doc.line(tablaInicioX + 35, yPos, tablaInicioX + 50, yPos);
  doc.line(tablaInicioX + 35, yPos + filaAltura, tablaInicioX + 50, yPos + filaAltura);
  
  // Contenido de la cuarta fila
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Metales", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.metalesAnexo7c_chkmetales ? "X" : "", tablaInicioX + 42, yPos + 3.5);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Otros:", tablaInicioX + 52, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(capitalizarTexto(datosFinales.otrosFactoresRiesgo || ""), tablaInicioX + 70, yPos + 3.5);
  
  yPos += filaAltura;

  // === SECCIÓN 3: ANTECEDENTES PATOLÓGICOS PERSONALES ===
  // Header gris para la sección 3
  yPos = dibujarHeaderSeccion("2- ANTECEDENTES PATOLÓGICOS PERSONALES:", yPos, filaAltura);

  // Fila celeste: Marque "X" si posee o tuvo alguna enfermedad diagnosticada con o sin tratamiento
  yPos = dibujarHeaderAntecedentes("Marque \"X\" si posee o tuvo alguna enfermedad diagnosticada con o sin tratamiento:", yPos, filaAltura);

  // Función auxiliar para formatear fechas quirúrgicas que pueden venir en diferentes formatos
  const formatearFechaQuirurgica = (fechaStr) => {
    if (!fechaStr || fechaStr.trim() === "") return "";
    
    const fechaTrimmed = fechaStr.trim();
    
    // Si es solo un año (4 dígitos), devolverlo tal como está
    const soloAnoRegex = /^\d{4}$/;
    if (soloAnoRegex.test(fechaTrimmed)) {
      return fechaTrimmed;
    }
    
    // Si es un rango de años como "2020-2025" o "2020 - 2025", normalizar espacios
    const rangoAnosRegex = /^\d{4}\s*-\s*\d{4}$/;
    if (rangoAnosRegex.test(fechaTrimmed)) {
      // Normalizar: quitar espacios alrededor del guión
      return fechaTrimmed.replace(/\s*-\s*/, "-");
    }
    
    // Si es una fecha válida en formato yyyy-MM-dd, usar formatearFechaCorta
    try {
      const fechaFormateada = formatearFechaCorta(fechaTrimmed);
      // Si formatearFechaCorta devuelve string vacío, significa que no era una fecha válida
      if (fechaFormateada === "") {
        return fechaTrimmed; // Devolver el string original
      }
      return fechaFormateada;
    } catch (error) {
      // Si no se puede formatear, devolver el string original
      return fechaTrimmed;
    }
  };

  // Función auxiliar para dibujar una mini celda estandarizada
  const dibujarMiniCelda = (xInicio, yPos, filaAltura) => {
    const anchoMiniCelda = 6; // Ancho estándar de 6mm para todas las mini celdas
    doc.line(xInicio, yPos, xInicio, yPos + filaAltura); // Línea vertical izquierda
    doc.line(xInicio, yPos, xInicio + anchoMiniCelda, yPos); // Línea horizontal superior
    doc.line(xInicio, yPos + filaAltura, xInicio + anchoMiniCelda, yPos + filaAltura); // Línea horizontal inferior
    return xInicio + (anchoMiniCelda / 2); // Retorna la posición X centrada para la "X"
  };

  // Función auxiliar para dibujar una fila de vacunas
  const dibujarFilaVacunas = (vacuna1, vacuna2, vacuna3, vacuna4, valor1, valor2, valor3, valor4) => {
    // Determinar cuántas columnas realmente tenemos
    const columnas = [vacuna1, vacuna2, vacuna3, vacuna4].filter(v => v !== null && v !== undefined).length;
    
    // Calcular el ancho final de la fila según las columnas
    let anchoFinal = tablaAncho;
    if (columnas === 2) anchoFinal = 100; // 50 + 50
    else if (columnas === 3) anchoFinal = 150; // 50 + 50 + 50
    else if (columnas === 4) anchoFinal = 200; // 50 + 50 + 50 + 50
    
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    
    // Solo dibujar líneas divisorias donde hay contenido
    if (vacuna2) doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura);
    if (vacuna3) doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
    if (vacuna4) doc.line(tablaInicioX + 150, yPos, tablaInicioX + 150, yPos + filaAltura);
    
    // Línea derecha final según el número de columnas
    doc.line(tablaInicioX + anchoFinal, yPos, tablaInicioX + anchoFinal, yPos + filaAltura);
    // Líneas horizontales superior e inferior
    doc.line(tablaInicioX, yPos, tablaInicioX + anchoFinal, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + anchoFinal, yPos + filaAltura);
    
    // Dibujar líneas internas para mini celdas solo donde hay contenido
    const xCentrada1 = vacuna1 ? dibujarMiniCelda(tablaInicioX + 40, yPos, filaAltura) : 0;
    const xCentrada2 = vacuna2 ? dibujarMiniCelda(tablaInicioX + 90, yPos, filaAltura) : 0;
    const xCentrada3 = vacuna3 ? dibujarMiniCelda(tablaInicioX + 140, yPos, filaAltura) : 0;
    const xCentrada4 = vacuna4 ? dibujarMiniCelda(tablaInicioX + 190, yPos, filaAltura) : 0;
    
    // Contenido de la fila
    if (vacuna1) {
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text(vacuna1, tablaInicioX + 2, yPos + 3.5);
      doc.setFont("helvetica", "normal").setFontSize(8);
      if (valor1) doc.text("X", xCentrada1, yPos + 3.5);
    }
    
    if (vacuna2) {
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text(vacuna2, tablaInicioX + 52, yPos + 3.5);
      doc.setFont("helvetica", "normal").setFontSize(8);
      if (valor2) doc.text("X", xCentrada2, yPos + 3.5);
    }
    
    if (vacuna3) {
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text(vacuna3, tablaInicioX + 102, yPos + 3.5);
      doc.setFont("helvetica", "normal").setFontSize(8);
      if (valor3) doc.text("X", xCentrada3, yPos + 3.5);
    }
    
    if (vacuna4) {
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text(vacuna4, tablaInicioX + 152, yPos + 3.5);
      doc.setFont("helvetica", "normal").setFontSize(8);
      if (valor4) doc.text("X", xCentrada4, yPos + 3.5);
    }
    
    yPos += filaAltura;
  };

  // Función auxiliar para dibujar una fila de enfermedades
  const dibujarFilaEnfermedades = (enfermedad1, enfermedad2, enfermedad3, enfermedad4, valor1, valor2, valor3, valor4) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura);
    doc.line(tablaInicioX + 110, yPos, tablaInicioX + 110, yPos + filaAltura);
    doc.line(tablaInicioX + 160, yPos, tablaInicioX + 160, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
    
    // Dibujar líneas internas para mini celdas usando la función estandarizada
    const xCentrada1 = dibujarMiniCelda(tablaInicioX + 50, yPos, filaAltura);
    const xCentrada2 = dibujarMiniCelda(tablaInicioX + 100, yPos, filaAltura);
    const xCentrada3 = dibujarMiniCelda(tablaInicioX + 150, yPos, filaAltura);
    const xCentrada4 = dibujarMiniCelda(tablaInicioX + 190, yPos, filaAltura);
    
    // Contenido de la fila
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(enfermedad1, tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    if (valor1) doc.text("X", xCentrada1, yPos + 3.5);
    
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(enfermedad2, tablaInicioX + 62, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    if (valor2) doc.text("X", xCentrada2, yPos + 3.5);
    
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(enfermedad3, tablaInicioX + 112, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    if (valor3) doc.text("X", xCentrada3, yPos + 3.5);
    
    if (enfermedad4) {
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text(enfermedad4, tablaInicioX + 162, yPos + 3.5);
      doc.setFont("helvetica", "normal").setFontSize(8);
      if (valor4) doc.text("X", xCentrada4, yPos + 3.5);
    }
    
    yPos += filaAltura;
  };

  // Fila 1: IMA, Bronquitis, Convulsiones, Tendinitis
  dibujarFilaEnfermedades("IMA (Infarto agudo al miocardio)", "Bronquitis", "Convulsiones", "Tendinitis",
    data.imaBoro_ima, data.bronquitisARepeticion_chk7, data.epilsepsiaOConvulsiones_chk15, data.tendinitisBoro_tendinitis);

  // Fila 2: HTA, Diabetes, Gastritis, Onicomicosis
  dibujarFilaEnfermedades("HTA (Hipertensión Arterial)", "Diabetes", "Gastritis", "Onicomicosis",
    data.hipertencionArterial_chk27, data.diabetes_chk11, data.gastritisCronica_chk21, data.onicomicosisBoro_onicomicosis);

  // Fila 3: ACV, Hepatitis, Úlceras, Fracturas
  dibujarFilaEnfermedades("ACV (Acc. Cerebro Vascular)", "Hepatitis", "Úlceras", "Fracturas",
    data.acvBoro_acv, data.hepatitis_chk25, data.ulceraPeptica_chk57, data.fracturasBoro_fracturas);

  // Fila 4: TBC, Hernias, Migrañas, Anemia
  dibujarFilaEnfermedades("TBC (Tuberculosis)", "Hernias", "Migrañas", "Anemia",
    data.tbcBoro_tbc, data.hernias_chk26, data.migranaBoro_migrana, data.anemiaBoro_anemia);

  // Fila 5: ETS, Vértigos, Enf Psiquiátricas, Obesidad
  dibujarFilaEnfermedades("ETS (Enf de Transmisión sexual)", "Vértigos", "Enf Psiquiátricas", "Obesidad",
    data.etsBoro_ets, data.vertigosBoro_vertigos, data.enfermedadesPsiquiatricasBoro_enf_psiquiatricas, data.obesidadBoro_obesidad);

  // Fila 6: VIH, Tifoidea, Enf Cardiovasculares, Dislipidemia
  dibujarFilaEnfermedades("VIH", "Tifoidea", "Enf Cardiovasculares", "Dislipidemia",
    data.vihBoro_vih, data.tifoideaBoro_tifoidea, data.enfermedadesCorazon_chk13, data.dislipidemiaBoro_dislipidemia);

  // Fila 7: TEC, Neoplasias, Enf Oculares, Intoxicaciones
  dibujarFilaEnfermedades("TEC (Traumatismo Encefálico)", "Neoplasias", "Enf Oculares", "Intoxicaciones",
    data.traumatismoEncefalocraneano_chk54, data.neoplasiasBoro_neoplasias, data.enfermedadesOculares_chk14, data.intoxicacionesBoro_intoxicaciones);

  // Fila 8: Fobias, Quemaduras, Enf Reumática, Amputación
  dibujarFilaEnfermedades("Fobias", "Quemaduras", "Enf Reumática", "Amputación",
    data.fobiasBoro_fobias, data.quemadurasBoro_quemaduras, data.enfermedadesReumaticasBoro_enf_reumatica, data.amputacionBoro_amputacion);

  // Fila 9: Alergias, Discopatías, Enf Pulmonares, Sordera
  dibujarFilaEnfermedades("Alergias", "Discopatías", "Enf Pulmonares", "Sordera",
    data.alergias_chk1, data.discopatiasBoro_discopatias, data.enfermedadesPulmonaresBoro_enf_pulmonares, data.sorderaBoro_sordera);

  // Fila 10: Asma, Columna, Enf de la Piel (solo 3 columnas)
  dibujarFilaEnfermedades("Asma", "Columna", "Enf de la Piel", null,
    data.asma_chk4, data.columnaBoro_columna, data.enfermedadesPielBoro_enf_piel, null);

  // Fila adicional: Otros
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Otros:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(capitalizarTexto(datosFinales.otrosPatologias || ""), tablaInicioX + 15, yPos + 3.5);
  yPos += filaAltura;

  // Fila adicional: Especifique detalles de la patología o tratamiento marcada
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Especifique detalles de la patología o tratamiento marcada:", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Fila adicional: Especifique (tratamiento)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Especifique:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(capitalizarTexto(datosFinales.especifiqueTratamiento || ""), tablaInicioX + 25, yPos + 3.5);
  yPos += filaAltura;

  // Fila adicional: Alergias a Medicamentos / Alimentos SI/NO
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Alergias a Medicamentos / Alimentos", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Marcar SI si corresponde
  if (data.alergiasAlimentosBoro_alergias_medic_alim) {
    doc.text("SI (  X  )", tablaInicioX + 80, yPos + 3.5);
  } else {
    doc.text("SI (      )", tablaInicioX + 80, yPos + 3.5);
  }
  
  // Marcar NO si corresponde
  if (!data.alergiasAlimentosBoro_alergias_medic_alim) {
    doc.text("NO (  X  )", tablaInicioX + 95, yPos + 3.5);
  } else {
    doc.text("NO (      )", tablaInicioX + 95, yPos + 3.5);
  }
  yPos += filaAltura;

  // Fila adicional: Especifique
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Especifique:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(capitalizarTexto(datosFinales.especifiqueAlergias || ""), tablaInicioX + 25, yPos + 3.5);
  yPos += filaAltura;

  // === SECCIÓN 4: ANTECEDENTES INMUNOLÓGICOS / VACUNAS ===
  // Header gris para la sección 4
  yPos = dibujarHeaderSeccion("3- ANTECEDENTES INMUNOLÓGICOS / VACUNAS:", yPos, filaAltura);

  // Fila celeste: Marque "X" si ha recibido las siguientes vacunas
  yPos = dibujarHeaderAntecedentes("Marque \"X\" si ha recibido las siguientes vacunas:", yPos, filaAltura);

  // Fila 1: Antitetánica, Hepatitis B, Papiloma Humano, Fiebre Amarilla
  dibujarFilaVacunas("Antitetánica", "Hepatitis B", "Papiloma Humano", "Fiebre Amarilla",
    data.antitetanicaBoro_antitetanica, data.hepatitisBBoro_hepatitisb, data.papilomaHumanoBoro_papiloma_humano, data.fiebreAmarillaBoro_fiebre_amarilla);

  // Fila 2: Gripe/Influenza, Influenza, Neumococo, Rabia
  dibujarFilaVacunas("Gripe/Influenza", "Influenza", "Neumococo", "Rabia",
    data.gripeInfluenzaBoro_gripe_influenza, data.influenzaBoro_influenza, data.neumococoBoro_neumococo, data.rabiaBoro_rabia);

  // Fila 3: Hepatitis A, Covid-19
  const tieneCovidVacunas = datosFinales.covidVacunas || false;
  const dosisCovidVacunas = datosFinales.dosisVacunas || "";
  const tieneDosisVacunas = dosisCovidVacunas.trim() !== "";
  
  // Estructura: Columna 1 (50mm): Hepatitis A + mini celda | Columna 2 (50mm): Covid-19 + mini celda | Resto: Dosis
  const col1End = tablaInicioX + 50;  // Fin columna 1 (Hepatitis A con mini celda)
  const col2End = tablaInicioX + 100; // Fin columna 2 (Covid-19 con mini celda)
  
  // Dibujar líneas de la fila
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(col1End, yPos, col1End, yPos + filaAltura); // División entre columna 1 y 2
  // Si COVID está marcado, dibujar línea divisoria antes de la dosis
  if (tieneCovidVacunas) {
    doc.line(col2End, yPos, col2End, yPos + filaAltura); // División entre columna 2 y dosis
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Columna 1: Hepatitis A + mini celda (igual formato que otras vacunas)
  const xCentradaHepatitisA = dibujarMiniCelda(tablaInicioX + 40, yPos, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hepatitis A", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (data.hepatitisABoro_hepatitisa) doc.text("X", xCentradaHepatitisA, yPos + 3.5);
  
  // Columna 2: Covid-19 + mini celda (solo si está marcado)
  if (tieneCovidVacunas) {
    const xCentradaCovid = dibujarMiniCelda(tablaInicioX + 90, yPos, filaAltura);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Covid-19", tablaInicioX + 52, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("X", xCentradaCovid, yPos + 3.5);
    
    // Mostrar dosis después de la columna 2
    if (tieneDosisVacunas) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("Dosis: " + dosisCovidVacunas, col2End + 2, yPos + 3.5);
    }
  }
  
  yPos += filaAltura;

  // === NUEVA PÁGINA 2 ===
  doc.addPage();
  drawHeader(2);

  // Resetear posición para la nueva página
  yPos = 40;

  // === SECCIÓN 5: ANTECEDENTES QUIRÚRGICOS ===
  // Header gris para la sección 5
  yPos = dibujarHeaderSeccion("4. ANTECEDENTES QUIRÚRGICOS:", yPos, filaAltura);

  // Fila de encabezados de la tabla quirúrgica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 30, yPos, tablaInicioX + 30, yPos + filaAltura); // Fecha
  doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // Hospital
  doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + filaAltura); // Operación
  doc.line(tablaInicioX + 145, yPos, tablaInicioX + 145, yPos + filaAltura); // Días.H. (reducida)
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido de los encabezados
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha", tablaInicioX + 15, yPos + 3.5, { align: "center" }); // Centrado en columna de 30mm
  doc.text("Hospital (Nombre - Lugar)", tablaInicioX + 55, yPos + 3.5, { align: "center" }); // Centrado en columna de 50mm
  doc.text("Operación", tablaInicioX + 105, yPos + 3.5, { align: "center" }); // Centrado en columna de 50mm
  doc.text("Días.H.", tablaInicioX + 137.5, yPos + 3.5, { align: "center" }); // Centrado en columna de 15mm
  doc.text("Complicaciones", tablaInicioX + 177.5, yPos + 3.5, { align: "center" }); // Centrado en columna de 55mm
  yPos += filaAltura;

  // Función para dibujar una fila de antecedente quirúrgico con altura dinámica
  const dibujarFilaQuirurgico = (fecha, hospital, operacion, diasHospitalizacion, complicaciones) => {
    // Calcular altura necesaria para cada columna de texto
    doc.setFont("helvetica", "normal").setFontSize(8);
    
    const alturaMinima = 5; // Altura mínima de la fila
    const paddingSuperior = 3.5; // Padding superior aumentado
    const yTextoInicio = yPos + paddingSuperior;
    
    // Calcular altura necesaria para cada campo de texto
    let alturaMaxima = alturaMinima;
    
    // Calcular altura para hospital (columna más ancha)
    if (hospital) {
      const hospitalTexto = capitalizarTexto(hospital);
      const nuevaYHospital = dibujarTextoConSaltoLinea(hospitalTexto, tablaInicioX + 32, yTextoInicio, 48); // Sin margen derecho, ancho completo
      const alturaHospital = nuevaYHospital - yTextoInicio + paddingSuperior + 2;
      alturaMaxima = Math.max(alturaMaxima, alturaHospital);
    }
    
    // Calcular altura para operación (columna más ancha)
    if (operacion) {
      const operacionTexto = capitalizarTexto(operacion);
      const nuevaYOperacion = dibujarTextoConSaltoLinea(operacionTexto, tablaInicioX + 82, yTextoInicio, 48); // Sin margen derecho, ancho completo
      const alturaOperacion = nuevaYOperacion - yTextoInicio + paddingSuperior + 2;
      alturaMaxima = Math.max(alturaMaxima, alturaOperacion);
    }
    
    // Calcular altura para complicaciones (columna más ancha)
    if (complicaciones) {
      const complicacionesTexto = capitalizarTexto(complicaciones);
      const nuevaYComplicaciones = dibujarTextoConSaltoLinea(complicacionesTexto, tablaInicioX + 147, yTextoInicio, 55); // Ancho correcto: 200-145=55mm
      const alturaComplicaciones = nuevaYComplicaciones - yTextoInicio + paddingSuperior + 2;
      alturaMaxima = Math.max(alturaMaxima, alturaComplicaciones);
    }
    
    const alturaFilaFinal = Math.max(alturaMinima, alturaMaxima);

    // Dibujar líneas de la fila con altura calculada
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaFinal);
    doc.line(tablaInicioX + 30, yPos, tablaInicioX + 30, yPos + alturaFilaFinal);
    doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + alturaFilaFinal);
    doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + alturaFilaFinal);
    doc.line(tablaInicioX + 145, yPos, tablaInicioX + 145, yPos + alturaFilaFinal);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaFinal);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaFinal, tablaInicioX + tablaAncho, yPos + alturaFilaFinal);

    // Contenido de la fila con formato de texto correcto y márgenes
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(fecha || "", tablaInicioX + 2, yTextoInicio); // Margen mínimo izquierdo
    
    // Dibujar texto con salto de línea para campos largos con márgenes
    if (hospital) {
      doc.setFont("helvetica", "normal").setFontSize(8); // Asegurar fuente normal
      dibujarTextoConSaltoLinea(capitalizarTexto(hospital), tablaInicioX + 32, yTextoInicio, 48); // Sin margen derecho, ancho completo
    }
    
    if (operacion) {
      doc.setFont("helvetica", "normal").setFontSize(8); // Asegurar fuente normal
      dibujarTextoConSaltoLinea(capitalizarTexto(operacion), tablaInicioX + 82, yTextoInicio, 48); // Sin margen derecho, ancho completo
    }
    
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(diasHospitalizacion || "", tablaInicioX + 137.5, yTextoInicio, { align: "center" }); // Centrado en la celda
    
    if (complicaciones) {
      doc.setFont("helvetica", "normal").setFontSize(8); // Asegurar fuente normal
      const textoComplicaciones = capitalizarTexto(complicaciones);
      
      // Verificar si el texto cabe en una línea
      const anchoTexto = doc.getTextWidth(textoComplicaciones);
      if (anchoTexto <= 55) {
        // Si cabe, dibujarlo en una línea
        doc.text(textoComplicaciones, tablaInicioX + 147, yTextoInicio);
      } else {
        // Si no cabe, usar la función de salto de línea
        dibujarTextoConSaltoLinea(textoComplicaciones, tablaInicioX + 147, yTextoInicio, 55);
      }
    }
    
    yPos += alturaFilaFinal;
  };

       // Dibujar filas de antecedentes quirúrgicos
       if (datosFinales.antecedentesQuirurgicos && datosFinales.antecedentesQuirurgicos.length > 0) {
         datosFinales.antecedentesQuirurgicos.forEach(quirurgico => {
           dibujarFilaQuirurgico(
             formatearFechaQuirurgica(quirurgico.fecha || quirurgico.fechaAntecedentesPatologicosQuirurgicos || ""),
             quirurgico.hospitalOperacion || "",
             quirurgico.operacion || "",
             quirurgico.diasHospitalizado || "",
             quirurgico.complicaciones || ""
           );
         });
       } else if (datosFinales.fechaQuirurgica) {
         // Si hay fecha quirúrgica, crear una fila con esa fecha
         dibujarFilaQuirurgico(
           formatearFechaQuirurgica(datosFinales.fechaQuirurgica),
           "INFORMACIÓN NO DISPONIBLE",
           "INFORMACIÓN NO DISPONIBLE", 
           "",
           ""
         );
       }

  // === SECCIÓN 6: HÁBITOS ===
  // Header gris para la sección 6
  yPos = dibujarHeaderSeccion("5. HÁBITOS:", yPos, filaAltura);

  // Función para dibujar una fila de hábito
  const dibujarFilaHabito = (nombreHabito, si, no, tipo, frecuencia, especifique = null) => {
    // Calcular altura necesaria para el campo de frecuencia (si tiene texto largo)
    let alturaNecesaria = filaAltura;
    const yTextoInicio = yPos + 3.5;
    const xInicioFrecuencia = tablaInicioX + 130; // Posición X donde comienza el texto de frecuencia
    const anchoDisponibleFrecuencia = tablaAncho + tablaInicioX - xInicioFrecuencia - 2; // Ancho disponible: desde inicio hasta final menos margen
    
    // Calcular altura necesaria para frecuencia usando splitTextToSize
    let lineasFrecuencia = [];
    if (frecuencia) {
      const frecuenciaTexto = capitalizarTexto(frecuencia);
      doc.setFont("helvetica", "normal").setFontSize(8);
      lineasFrecuencia = doc.splitTextToSize(frecuenciaTexto, anchoDisponibleFrecuencia);
      const alturaFrecuencia = Math.max(filaAltura, lineasFrecuencia.length * 2.8 + 2);
      alturaNecesaria = Math.max(alturaNecesaria, alturaFrecuencia);
    }
    
    // Calcular altura necesaria para especifique (si existe y no hay tipo ni frecuencia)
    let lineasEspecifique = [];
    let textoEspecifiqueLimpio = "";
    if (!tipo && especifique) {
      // Limpiar el texto de especifique (remover "Especifique:" si ya está incluido)
      textoEspecifiqueLimpio = String(especifique).trim();
      if (textoEspecifiqueLimpio.toLowerCase().startsWith("especifique:")) {
        textoEspecifiqueLimpio = textoEspecifiqueLimpio.substring(12).trim();
      }
      
      if (textoEspecifiqueLimpio) {
        const textoCapitalizado = capitalizarTexto(textoEspecifiqueLimpio);
        const xInicioEspecifique = tablaInicioX + 80;
        const anchoDisponibleEspecifique = tablaAncho + tablaInicioX - xInicioEspecifique - 2;
        
        // Calcular altura necesaria para especifique usando splitTextToSize
        doc.setFont("helvetica", "normal").setFontSize(8);
        lineasEspecifique = doc.splitTextToSize(textoCapitalizado, anchoDisponibleEspecifique);
        const alturaEspecifique = Math.max(filaAltura, lineasEspecifique.length * 2.8 + 2);
        alturaNecesaria = Math.max(alturaNecesaria, alturaEspecifique);
      }
    }
    
    // Dibujar líneas de la fila con altura dinámica
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaNecesaria);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaNecesaria);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaNecesaria, tablaInicioX + tablaAncho, yPos + alturaNecesaria);

    // Contenido de la fila
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(nombreHabito + ":", tablaInicioX + 2, yPos + 3.5);
    
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("SI", tablaInicioX + 30, yPos + 3.5);
    doc.text("(", tablaInicioX + 35, yPos + 3.5);
    
    // Marcar X en SI si corresponde
    if (si) {
      doc.setFont("helvetica", "bold").setFontSize(9);
      doc.text("X", tablaInicioX + 37, yPos + 3.8); // Centrado horizontalmente y bajado verticalmente
    } else {
      doc.text(" ", tablaInicioX + 37, yPos + 3.8);
    }
    
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(")", tablaInicioX + 40, yPos + 3.5);
    doc.text("NO", tablaInicioX + 43, yPos + 3.5);
    doc.text("(", tablaInicioX + 48, yPos + 3.5);
    
    // Marcar X en NO si corresponde
    if (no) {
      doc.setFont("helvetica", "bold").setFontSize(9);
      doc.text("X", tablaInicioX + 50, yPos + 3.8); // Centrado horizontalmente y bajado verticalmente
    } else {
      doc.text(" ", tablaInicioX + 50, yPos + 3.8);
    }
    
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(")", tablaInicioX + 53, yPos + 3.5);
    
    // Tipo (si existe)
    if (tipo) {
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text("Tipo:", tablaInicioX + 60, yPos + 3.5);
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(capitalizarTexto(tipo), tablaInicioX + 75, yPos + 3.5);
    }
    
    // Frecuencia con salto de línea si es necesario
    if (frecuencia && lineasFrecuencia.length > 0) {
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text("Fr:", tablaInicioX + 120, yPos + 3.5);
      doc.setFont("helvetica", "normal").setFontSize(8);
      // Dibujar cada línea usando splitTextToSize
      lineasFrecuencia.forEach((linea, index) => {
        doc.text(linea, xInicioFrecuencia, yTextoInicio + (index * 2.8));
      });
    } else if (!tipo && especifique && textoEspecifiqueLimpio && lineasEspecifique.length > 0) {
      // Si no hay tipo ni frecuencia pero hay especifique, dibujar especifique con su valor
      // Dibujar "Especifique:" y el texto
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text("Especifique:", tablaInicioX + 60, yPos + 3.5);
      doc.setFont("helvetica", "normal").setFontSize(8);
      // Dibujar cada línea del texto de especifique
      const xInicioEspecifique = tablaInicioX + 80;
      lineasEspecifique.forEach((linea, index) => {
        doc.text(linea, xInicioEspecifique, yTextoInicio + (index * 2.8));
      });
    }
    
    yPos += alturaNecesaria;
  };

  // Dibujar filas de hábitos
  // Alcohol: usar tipoLicor y frecuenciaLicor si están disponibles, sino usar alcoholEspecifique
  const tipoAlcohol = datosFinales.habitos?.tipoLicor || "";
  const frecuenciaAlcohol = datosFinales.habitos?.frecuenciaLicor || "";
  dibujarFilaHabito("Alcohol", datosFinales.alcoholSi, datosFinales.alcoholNo, tipoAlcohol || null, frecuenciaAlcohol || null);
  
  // Tabaco: solo número de cigarrillos (sin tipo/frecuencia)
  dibujarFilaHabito("Tabaco", datosFinales.tabacoSi, datosFinales.tabacoNo, null, null);
  // Agregar número de cigarrillos después de la fila de Tabaco
  if (datosFinales.habitos?.numeroCigarrillos) {
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Número de Cigarrillos:", tablaInicioX + 60, yPos - filaAltura + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.habitos.numeroCigarrillos, tablaInicioX + 95, yPos - filaAltura + 3.5);
  }
  
  // Drogas: usar tipoDrogas y frecuenciaDrogas
  const tipoDrogas = datosFinales.habitos?.tipoDrogas || "";
  const frecuenciaDrogas = datosFinales.habitos?.frecuenciaDrogas || "";
  dibujarFilaHabito("Drogas", datosFinales.drogasSi, datosFinales.drogasNo, tipoDrogas || null, frecuenciaDrogas || null);
  
  // Medicamentos: usar medicamentosEspecifique (sin separar tipo/frecuencia)
  dibujarFilaHabito("Medicamentos", datosFinales.medicamentosSi, datosFinales.medicamentosNo, null, null, datosFinales.medicamentosEspecifique || null);
  
  // Actividad Física: usar actividadFisicaEspecifique (sin separar tipo/frecuencia)
  dibujarFilaHabito("Actividad Física", datosFinales.actividadFisicaSi, datosFinales.actividadFisicaNo, null, null, datosFinales.actividadFisicaEspecifique || null);
  
  // Otros: usar tipoOtros y frecuenciaOtros
  const tipoOtros = datosFinales.habitos?.tipoOtros || "";
  const frecuenciaOtros = datosFinales.habitos?.frecuenciaOtros || "";
  const otrosSi = datosFinales.habitos?.otros || false;
  const otrosNo = !otrosSi;
  dibujarFilaHabito("Otros", otrosSi, otrosNo, tipoOtros || null, frecuenciaOtros || null);

  // === SECCIÓN 7: ANTECEDENTES PATOLÓGICOS FAMILIARES ===
  // Header gris para la sección 7
  yPos = dibujarHeaderSeccion("6- ANTECEDENTES PATOLÓGICOS FAMILIARES:", yPos, filaAltura);

  // Fila celeste para el texto descriptivo
  doc.setFillColor(199, 241, 255); // Color celeste
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Detallar si el familiar posee alguna patología o enfermedad, si ha fallecido indique la causa:", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Función para dibujar una fila de familiar
  const dibujarFilaFamiliar = (nombreFamiliar, especifique) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    // Contenido de la fila
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(nombreFamiliar + ":", tablaInicioX + 2, yPos + 3.5);
    
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Especifique:", tablaInicioX + 30, yPos + 3.5);
    
    // Texto de especificación
    if (especifique) {
      doc.text(capitalizarTexto(especifique), tablaInicioX + 60, yPos + 3.5);
    }
    
    yPos += filaAltura;
  };

  // Dibujar filas de familiares
  dibujarFilaFamiliar("Padre", datosFinales.padreEspecifique);
  dibujarFilaFamiliar("Madre", datosFinales.madreEspecifique);
  dibujarFilaFamiliar("Hermanos", datosFinales.hermanosEspecifique);
  dibujarFilaFamiliar("Hijos", datosFinales.hijosEspecifique);
  dibujarFilaFamiliar("Esposa/ Cónyuge", datosFinales.esposaConyugeEspecifique);

  // === SECCIÓN 8: CONDICIÓN MÉDICA ESPECIAL ===
  // Header gris para la sección 8
  yPos = dibujarHeaderSeccion("7- ALGUNA CONDICIÓN MÉDICA ESPECIAL O DISCAPACIDAD:", yPos, filaAltura);

  // Fila para Carné de CONADIS
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Si posee Carné de CONADIS, especifique:", tablaInicioX + 2, yPos + 3.5);
  
  if (datosFinales.carnetConadis) {
    doc.text(capitalizarTexto(datosFinales.carnetConadis), tablaInicioX + 80, yPos + 3.5);
  }
  
  yPos += filaAltura;

  // === SECCIÓN 9: DECLARACIÓN ===
  // Banner de Declaración (igual que en Página 4)
  const declarY2 = yPos;
  const alturaDeclar2 = 15;
  
  doc.setFillColor(253, 208, 94); 
  doc.rect(tablaInicioX, declarY2, tablaAncho, alturaDeclar2, 'F');
  doc.line(tablaInicioX, declarY2, tablaInicioX, declarY2 + alturaDeclar2);
  doc.line(tablaInicioX + tablaAncho, declarY2, tablaInicioX + tablaAncho, declarY2 + alturaDeclar2);
  doc.line(tablaInicioX, declarY2, tablaInicioX + tablaAncho, declarY2);
  doc.line(tablaInicioX, declarY2 + alturaDeclar2, tablaInicioX + tablaAncho, declarY2 + alturaDeclar2);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("TODA LA INFORMACIÓN QUE HE PROPORCIONADO AL SERVICIO DE MEDICINA OCUPACIONAL,", tablaInicioX + tablaAncho/2, declarY2 + 4, { align: "center" });
  doc.text("ES VERDADERA NO HABIENDO OMITIDO NINGÚN DATO VOLUNTARIAMENTE.", tablaInicioX + tablaAncho/2, declarY2 + 7, { align: "center" });
  doc.text("FECHA: " + (datosFinales.fechaExamen || ""), tablaInicioX + tablaAncho/2, declarY2 + 11, { align: "center" });
  
  // Posición después del banner de declaración
  yPos = declarY2 + alturaDeclar2;

  // === SECCIÓN DE FIRMAS ===
  const alturaSeccionFirmas = 30;
  
  // Dibujar las líneas de la sección de firmas (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaSeccionFirmas);
  doc.line(tablaInicioX + tablaAncho/2, yPos, tablaInicioX + tablaAncho/2, yPos + alturaSeccionFirmas);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionFirmas);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaSeccionFirmas, tablaInicioX + tablaAncho, yPos + alturaSeccionFirmas);

  // === COLUMNA 1: FIRMA Y HUELLA DEL TRABAJADOR ===
  const centroColumna1X = tablaInicioX + (tablaAncho/2) / 2;
  
  // Agregar firma del trabajador
  let firmaTrabajadorUrl = null;
  let huellaTrabajadorUrl = null;
  
  if (data.digitalizacion && data.digitalizacion.length > 0) {
    const firmaData = data.digitalizacion.find(item => item.nombreDigitalizacion === "FIRMAP");
    const huellaData = data.digitalizacion.find(item => item.nombreDigitalizacion === "HUELLA");
    
    if (firmaData && firmaData.url) {
      firmaTrabajadorUrl = firmaData.url;
    }
    
    if (huellaData && huellaData.url) {
      huellaTrabajadorUrl = huellaData.url;
    }
  }
  
  if (firmaTrabajadorUrl) {
    try {
      const imgWidth = 30;
      const imgHeight = 20;
      const x = centroColumna1X - 20;
      const y = yPos + 3;
      doc.addImage(firmaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del trabajador:", error);
    }
  }
  
  // Agregar huella del trabajador
  if (huellaTrabajadorUrl) {
    try {
      const imgWidth = 12;
      const imgHeight = 20;
      const x = centroColumna1X + 8;
      const y = yPos + 3;
      doc.addImage(huellaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando huella del trabajador:", error);
    }
  }
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Firma y Huella del trabajador", centroColumna1X, yPos + 26, { align: "center" });

  // === COLUMNA 2: SELLO Y FIRMA DEL MÉDICO ===
  const centroColumna2X = tablaInicioX + tablaAncho/2 + (tablaAncho/2) / 2;
  
  // Agregar firma y sello médico
  let firmaMedicoUrl = null;
  
  if (data.digitalizacion && data.digitalizacion.length > 0) {
    const firmaMedicoData = data.digitalizacion.find(item => item.nombreDigitalizacion === "SELLOFIRMA");
    
    if (firmaMedicoData && firmaMedicoData.url) {
      firmaMedicoUrl = firmaMedicoData.url;
    }
  }
  
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 45;
      const imgHeight = 20;
      const x = centroColumna2X - 22.5;
      const y = yPos + 3;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Sello y Firma del Médico", centroColumna2X, yPos + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumna2X, yPos + 28.5, { align: "center" });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8});

  // === NUEVA PÁGINA 3: DATOS PERSONALES (ESTILO DIGITALIZADO) ===
  doc.addPage();
  
  // Contador de página actualizado
  const numeroPagina3 = 3;
  
  // Header para página 3
  const drawHeaderPagina3 = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título para página 3 (estilo Digitalizado)
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("FICHA DE ANTECEDENTES", pageW / 2, 32.5, { align: "center" });
    doc.text("PATOLÓGICOS", pageW / 2, 36.5, { align: "center" });

    // Número de Ficha y Página
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 60, 16);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosFinales.sede, pageW - 80, 20);
    doc.text("Fecha de examen: " + datosFinales.fechaExamen, pageW - 80, 25);

    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 30, 10);

    // Bloque de color
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

  drawHeaderPagina3(numeroPagina3);

  // Resetear posición para la página 3
  yPos = 40;
  const filaAltura3 = 5;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("DATOS PERSONALES", yPos, filaAltura3);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3); 
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3); 
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); 
  doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3); 
  yPos += filaAltura3;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac.
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura3);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura3);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura3);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3);
  yPos += filaAltura3;

  // Tercera fila: Domicilio
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3);
  yPos += filaAltura3;

  // Cuarta fila: Puesto de Trabajo, Área de Trabajo
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura3);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3);
  yPos += filaAltura3;

  // Quinta fila: Empresa
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3);
  yPos += filaAltura3;

  // Sexta fila: Contrata
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3);
  yPos += filaAltura3;

  // === CONTENIDO DE LA TABLA ===
  let yTexto3 = 40 + 2;

  // Primera fila: Apellidos y Nombres
  yTexto3 += filaAltura3;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto3 + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto3 + 1.5, tablaAncho - 40);
  yTexto3 += filaAltura3;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto3 + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto3 + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yTexto3 + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.edad + " AÑOS", tablaInicioX + 58, yTexto3 + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yTexto3 + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.sexo.toUpperCase(), tablaInicioX + 105, yTexto3 + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto3 + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento, tablaInicioX + 155, yTexto3 + 1.5);
  yTexto3 += filaAltura3;

  // Tercera fila: Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto3 + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.direccionPaciente, tablaInicioX + 25, yTexto3 + 1.5, 160);
  yTexto3 += filaAltura3;

  // Cuarta fila: Puesto de Trabajo, Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto3 + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.puestoTrabajo, tablaInicioX + 30, yTexto3 + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto3 + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.areaTrabajo, tablaInicioX + 118, yTexto3 + 1.5);
  yTexto3 += filaAltura3;

  // Quinta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto3 + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 24, yTexto3 + 1.5, tablaAncho - 30);
  yTexto3 += filaAltura3;

  // Sexta fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto3 + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contrata, tablaInicioX + 24, yTexto3 + 1.5);
  yTexto3 += filaAltura3;

  // === SECCIÓN 2: ANTECEDENTES PATOLÓGICOS PERSONALES (DIGITALIZADO) ===
  yPos = dibujarHeaderSeccion("2. ANTECEDENTES PATOLÓGICOS PERSONALES", yPos, filaAltura3);
  yPos = dibujarHeaderSeccionCeleste("Marque \"X\" si posee o tuvo alguna enfermedad diagnosticada con o sin tratamiento:", yPos, filaAltura3);

  // Función para dibujar fila de enfermedades con layout Digitalizado (4 columnas iguales)
  const dibujarFilaEnfermedadesD3 = (enf1, enf2, enf3, enf4, v1, v2, v3, v4) => {
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3);
    doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura3);
    doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura3);
    doc.line(tablaInicioX + 150, yPos, tablaInicioX + 150, yPos + filaAltura3);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3);

    const x1 = dibujarMiniCelda(tablaInicioX + 42, yPos, filaAltura3);
    const x2 = dibujarMiniCelda(tablaInicioX + 92, yPos, filaAltura3);
    const x3 = dibujarMiniCelda(tablaInicioX + 142, yPos, filaAltura3);
    const x4 = dibujarMiniCelda(tablaInicioX + 192, yPos, filaAltura3);

    if (enf1) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(enf1, tablaInicioX + 2, yPos + 3.5);
      if (v1) { doc.setFont("helvetica", "bold").setFontSize(9); doc.setTextColor(255,0,0); doc.text("X", x1, yPos + 3.5); doc.setTextColor(0,0,0); }
    }
    if (enf2) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(enf2, tablaInicioX + 52, yPos + 3.5);
      if (v2) { doc.setFont("helvetica", "bold").setFontSize(9); doc.setTextColor(255,0,0); doc.text("X", x2, yPos + 3.5); doc.setTextColor(0,0,0); }
    }
    if (enf3) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(enf3, tablaInicioX + 102, yPos + 3.5);
      if (v3) { doc.setFont("helvetica", "bold").setFontSize(9); doc.setTextColor(255,0,0); doc.text("X", x3, yPos + 3.5); doc.setTextColor(0,0,0); }
    }
    if (enf4) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(enf4, tablaInicioX + 152, yPos + 3.5);
      if (v4) { doc.setFont("helvetica", "bold").setFontSize(9); doc.setTextColor(255,0,0); doc.text("X", x4, yPos + 3.5); doc.setTextColor(0,0,0); }
    }

    yPos += filaAltura3;
  };

  const enf = datosFinales.enfermedades || {};
  dibujarFilaEnfermedadesD3("Alergias", "Amigdalitis Crónica", "Arritmias Cardiacas", "Asma", enf.alergias, enf.amigdalitisCronica, enf.arritmiasCardiacas, enf.asma);
  dibujarFilaEnfermedadesD3("Bocio", "Bronconeumonia", "Bronquitis a Repeticion", "Caries o Gingivitis", enf.bocio, enf.bronconeumonia, enf.bronquitisRepeticion, enf.cariesGingivitis);
  dibujarFilaEnfermedadesD3("Colecistitis", "Dermatitis", "Diabetes", "Disenteria", enf.colecistitis, enf.dermatitis, enf.diabetes, enf.disenteria);
  dibujarFilaEnfermedadesD3("Enfermedades del corazon", "Enf. Oculares", "Epilepsia o convulsiones", "Faringitis crónica", enf.enfermedadesCorazon, enf.enfermedadesOculares, enf.epilepsiaConvulsiones, enf.faringitisCronica);
  dibujarFilaEnfermedadesD3("Fiebre Alta", "Fiebre Tifoidea", "Fiebre Reumatica", "Forunculosis", enf.fiebreAlta, enf.fiebreTifoidea, enf.fiebreReumatica, enf.forunculosis);
  dibujarFilaEnfermedadesD3("Gastritis Cronica", "Gonorrea", "Gota", "Varicoceles", enf.gastritisCronica, enf.gonorrea, enf.gota, enf.varicoceles);
  dibujarFilaEnfermedadesD3("Hemorroides", "Hepatitis", "Hernias", "Hipertensión Arterial", enf.hemorroides, enf.hepatitis, enf.hernias, enf.hipertensionArterial);
  dibujarFilaEnfermedadesD3("Inf. Urinarias repetidas", "Intoxicaciones", "Insuficiencia Cardiaca", "Insuficiencia Coronaria Crónica", enf.infeccionesUrinarias, enf.intoxicaciones, enf.insuficienciaCardiaca, enf.insuficienciaCoronaria);
  dibujarFilaEnfermedadesD3("Insuficiencia Renal Crónica", "Litiasis Urinaria", "Meningitis", "Neuritis a Repeticion", enf.insuficienciaRenal, enf.litiasisUrinaria, enf.meningitis, enf.neuritisRepeticion);
  dibujarFilaEnfermedadesD3("Otitis Media", "Presion Alta o Baja", "Paludismo o Malaria", "Parasitosis Intestinal", enf.otitisMedia, enf.presionAltaBaja, enf.paludismoMalaria, enf.parasitosisIntestinal);
  dibujarFilaEnfermedadesD3("Parotiditis", "Pleuresía", "Plunbismo", "Poliomielitis", enf.parotiditis, enf.pleuresia, enf.plunbismo, enf.poliomielitis);
  dibujarFilaEnfermedadesD3("Portador de Marcapaso", "Prótesis Cardiacas Valvulares", "Resfríos Frecuentes", "Reumatismo a Repetición", enf.portadorMarcapaso, enf.protesisCardiacas, enf.resfriosFrecuentes, enf.reumatismoRepeticion);
  dibujarFilaEnfermedadesD3("Sarampion", "Sífilis", "Silicosis", "Sinusitis Crónica", enf.sarampion, enf.sifilis, enf.silicosis, enf.sinusitisCronica);
  dibujarFilaEnfermedadesD3("Tos Convulsiva", "Transtorno Nerviosos", "Traumatismo Encefalocraneano", "Tuberculosis", enf.tosConvulsiva, enf.transtornoNerviosos, enf.traumatismoEncefalocraneano, enf.tuberculosis);
  dibujarFilaEnfermedadesD3("Tumores_Quistes", "Úlcera Peptica", "Varicela", "Várices", enf.tumoresQuistes, enf.ulceraPeptica, enf.varicela, enf.varices);

  // Fila individual COVID-19
  const covidDataP3 = datosFinales.severidadCovid || {};
  const tieneCovidP3 = covidDataP3.covid19 || false;
  const tieneDosisP3 = covidDataP3.dosis && covidDataP3.dosis.trim() !== "";
  const tieneFechaP3 = covidDataP3.fechaExamen && covidDataP3.fechaExamen.trim() !== "";
  const tieneSeveridadP3 = covidDataP3.leve || covidDataP3.moderado || covidDataP3.severo;
  
  // Siempre mostrar la fila (incluso si COVID no está marcado)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("COVID 19", tablaInicioX + 2, yPos + 3.5);
  const xCovid = dibujarMiniCelda(tablaInicioX + 42, yPos, filaAltura3);
  
  // Cerrar la mini celda de COVID-19 (línea derecha)
  const anchoMiniCeldaP3 = 6;
  const xFinMiniCeldaP3 = tablaInicioX + 44 + anchoMiniCeldaP3;
  doc.line(xFinMiniCeldaP3, yPos, xFinMiniCeldaP3, yPos + filaAltura3);
  
  // Marcar X en la mini celda si COVID-19 está marcado
  if (tieneCovidP3) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(255, 0, 0);
    doc.text("X", xCovid, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
  }
  
  // Calcular posición X inicial para datos adicionales (después de la mini celda)
  let xActualP3 = xFinMiniCeldaP3 + 3;
  
  // Mostrar dosis SOLO si COVID-19 está marcado Y tiene dosis
  if (tieneCovidP3 && tieneDosisP3) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Dosis: " + covidDataP3.dosis, xActualP3, yPos + 3.5);
    xActualP3 += doc.getTextWidth("Dosis: " + covidDataP3.dosis) + 5;
  }
  
  // Mostrar fecha SOLO si COVID-19 está marcado Y tiene fecha
  if (tieneCovidP3 && tieneFechaP3) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Fecha: " + covidDataP3.fechaExamen, xActualP3, yPos + 3.5);
    xActualP3 += doc.getTextWidth("Fecha: " + covidDataP3.fechaExamen) + 5;
  }
  
  // Mostrar severidad SOLO si COVID-19 está marcado Y tiene severidad
  if (tieneCovidP3 && tieneSeveridadP3) {
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Severidad:", xActualP3, yPos + 3.5);
    xActualP3 += doc.getTextWidth("Severidad: ") + 2;
    doc.setFont("helvetica", "normal").setFontSize(8);
    let severidadTexto = "";
    if (covidDataP3.leve) {
      severidadTexto = "Leve";
    } else if (covidDataP3.moderado) {
      severidadTexto = "Moderada";
    } else if (covidDataP3.severo) {
      severidadTexto = "Severa";
    }
    if (severidadTexto) {
      doc.text(severidadTexto, xActualP3, yPos + 3.5);
    }
  }
  yPos += filaAltura3;

  // Observaciones dinámicas
  const calcularAlturaObservaciones = (texto, anchoMaximo) => {
    if (!texto) return filaAltura3;
    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineas = doc.splitTextToSize(texto, anchoMaximo);
    return Math.max(filaAltura3, lineas.length * 4 + 3);
  };
  const anchoObs = tablaAncho - 35;
  const alturaObs = calcularAlturaObservaciones(datosFinales.observacionesAntecedentes, anchoObs);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaObs);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaObs);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaObs, tablaInicioX + tablaAncho, yPos + alturaObs);
  doc.setFont("helvetica", "bold").setFontSize(8); doc.text("Observaciones:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8); doc.text(datosFinales.observacionesAntecedentes || "", tablaInicioX + 30, yPos + 3.5, { maxWidth: anchoObs });
  yPos += alturaObs;

  // Línea celeste para Síntomas frecuentes
  yPos = dibujarHeaderSeccionCeleste("Indicar las enfermedades que ha tenido o tiene, con mucha frecuencia:", yPos, filaAltura3);

  // Fila de síntomas (4 columnas)
  const dibujarFilaSintomasD3 = (s1, s2, s3, s4, v1, v2, v3, v4) => {
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3);
    doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura3);
    doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura3);
    doc.line(tablaInicioX + 150, yPos, tablaInicioX + 150, yPos + filaAltura3);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3);
    const cx1 = dibujarMiniCelda(tablaInicioX + 42, yPos, filaAltura3);
    const cx2 = dibujarMiniCelda(tablaInicioX + 92, yPos, filaAltura3);
    const cx3 = dibujarMiniCelda(tablaInicioX + 142, yPos, filaAltura3);
    const cx4 = dibujarMiniCelda(tablaInicioX + 192, yPos, filaAltura3);
    if (s1) { doc.setFont("helvetica", "normal").setFontSize(7); doc.text(s1, tablaInicioX + 2, yPos + 3.5); if (v1) { doc.setFont("helvetica", "bold").setFontSize(9); doc.setTextColor(255,0,0); doc.text("X", cx1, yPos + 3.5); doc.setTextColor(0,0,0);} }
    if (s2) { doc.setFont("helvetica", "normal").setFontSize(7); doc.text(s2, tablaInicioX + 52, yPos + 3.5); if (v2) { doc.setFont("helvetica", "bold").setFontSize(9); doc.setTextColor(255,0,0); doc.text("X", cx2, yPos + 3.5); doc.setTextColor(0,0,0);} }
    if (s3) { doc.setFont("helvetica", "normal").setFontSize(7); doc.text(s3, tablaInicioX + 102, yPos + 3.5); if (v3) { doc.setFont("helvetica", "bold").setFontSize(9); doc.setTextColor(255,0,0); doc.text("X", cx3, yPos + 3.5); doc.setTextColor(0,0,0);} }
    if (s4) { doc.setFont("helvetica", "normal").setFontSize(7); doc.text(s4, tablaInicioX + 152, yPos + 3.5); if (v4) { doc.setFont("helvetica", "bold").setFontSize(9); doc.setTextColor(255,0,0); doc.text("X", cx4, yPos + 3.5); doc.setTextColor(0,0,0);} }
    yPos += filaAltura3;
  };
  const s = datosFinales.sintomas || {};
  dibujarFilaSintomasD3("Pérdida de Memoria", "Preocupaciones o Angustia", "Dolores Articulares y/o Huesos", "Aumento o Disminución de Peso", s.perdidaMemoria, s.preocupacionesAngustia, s.doloresArticulares, s.aumentoDisminucionPeso);
  dibujarFilaSintomasD3("Dolor de Cabeza", "Diarrea", "Agitación al Hacer Ejercicios", "Dolor Ocular", s.dolorCabeza, s.diarrea, s.agitacionEjercicios, s.dolorOcular);
  dibujarFilaSintomasD3("Dolor opresivo Tórax", "Hinchazón de pies o manos", "Estreñimiento", "Vómitos con Sangre", s.dolorOpresivoTorax, s.hinchazonPiesManos, s.estrenimiento, s.vomitosSangre);
  dibujarFilaSintomasD3("Sangrado por Orina", "Tos con Sangre", "Coloración Amarilla de la Piel", "Indigestión Frecuente", s.sangradoOrina, s.tosSangre, s.coloracionAmarilla, s.indigestionFrecuente);
  dibujarFilaSintomasD3("Insomnio", "Lumbalgias o Dolor de Cintura", "Mareos - Desmayos - Vértigo", "Heces Negras", s.insomnio, s.lumbalgias, s.mareosDesmayos, s.hecesNegras);
  dibujarFilaSintomasD3("Orina con Dolor o Ardor", "Orina Involuntaria", "Dolor de Oído", "Secreciones por el Oído", s.orinaDolorArdor, s.orinaInvoluntaria, s.dolorOido, s.secrecionesOido);
  dibujarFilaSintomasD3("Palpitaciones", "Adormecimiento", "Pesadillas", "Dolores Musculares", s.palpitaciones, s.adormecimiento, s.pesadillas, s.doloresMusculares);
  dibujarFilaSintomasD3("Tos Crónica", "Sangrado por Encías", "", "", s.tosCronica, s.sangradoEncias, false, false);

  // === HÁBITOS NOCIVOS ===
  yPos = dibujarHeaderSeccion("HÁBITOS NOCIVOS", yPos, filaAltura3);
  const hab = datosFinales.habitos || {};
  // Fumar
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3); doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3); doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3);
  doc.setFont("helvetica", "normal").setFontSize(8); doc.text("Fumar", tablaInicioX + 2, yPos + 3.5);
  const fumarSiX = tablaInicioX + 25; const fumarNoX = tablaInicioX + 45;
  doc.text("SI (", fumarSiX, yPos + 3.5); 
  const anchoSIParentesis = doc.getTextWidth("SI ("); // Ancho de "SI ("
  doc.setFont("helvetica", "bold").setFontSize(9); 
  const anchoX = doc.getTextWidth("X"); 
  if (hab.fumar) { doc.setTextColor(255,0,0); doc.text("X", fumarSiX + anchoSIParentesis + (4 - anchoX), yPos + 3.5); doc.setTextColor(0,0,0);} 
  doc.setFont("helvetica", "normal").setFontSize(8); doc.text(")", fumarSiX + anchoSIParentesis + 6, yPos + 3.5);
  doc.text("NO (", fumarNoX, yPos + 3.5);
  const anchoNOParentesis = doc.getTextWidth("NO ("); // Ancho de "NO ("
  doc.setFont("helvetica", "bold").setFontSize(9);
  if (!hab.fumar) { doc.setTextColor(255,0,0); doc.text("X", fumarNoX + anchoNOParentesis + (4 - anchoX), yPos + 3.5); doc.setTextColor(0,0,0);} 
  doc.setFont("helvetica", "normal").setFontSize(8); doc.text(")", fumarNoX + anchoNOParentesis + 6, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8); doc.text("Número de Cigarrillos:", tablaInicioX + 70, yPos + 3.5); doc.setFont("helvetica", "normal").setFontSize(8); doc.text(hab.numeroCigarrillos || "", tablaInicioX + 110, yPos + 3.5);
  yPos += filaAltura3;
  // Licor
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3); doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3); doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3);
  doc.setFont("helvetica", "normal").setFontSize(8); doc.text("Licor", tablaInicioX + 2, yPos + 3.5);
  doc.text("SI (", fumarSiX, yPos + 3.5); 
  if (hab.licor) { doc.setFont("helvetica", "bold").setFontSize(9); doc.setTextColor(255,0,0); doc.text("X", fumarSiX + anchoSIParentesis + (4 - anchoX), yPos + 3.5); doc.setTextColor(0,0,0);} 
  doc.setFont("helvetica", "normal").setFontSize(8); doc.text(")", fumarSiX + anchoSIParentesis + 6, yPos + 3.5);
  doc.text("NO (", fumarNoX, yPos + 3.5);
  if (!hab.licor) { doc.setFont("helvetica", "bold").setFontSize(9); doc.setTextColor(255,0,0); doc.text("X", fumarNoX + anchoNOParentesis + (4 - anchoX), yPos + 3.5); doc.setTextColor(0,0,0);} 
  doc.setFont("helvetica", "normal").setFontSize(8); doc.text(")", fumarNoX + anchoNOParentesis + 6, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8); doc.text("Tipo:", tablaInicioX + 70, yPos + 3.5); doc.setFont("helvetica", "normal").setFontSize(8); doc.text(hab.tipoLicor || "", tablaInicioX + 85, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8); doc.text("Fr:", tablaInicioX + 130, yPos + 3.5); doc.setFont("helvetica", "normal").setFontSize(8); doc.text(hab.frecuenciaLicor || "", tablaInicioX + 140, yPos + 3.5);
  yPos += filaAltura3;
  // Drogas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3); doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3); doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3);
  doc.setFont("helvetica", "normal").setFontSize(8); doc.text("Drogas", tablaInicioX + 2, yPos + 3.5);
  doc.text("SI (", fumarSiX, yPos + 3.5); 
  if (hab.drogas) { doc.setFont("helvetica", "bold").setFontSize(9); doc.setTextColor(255,0,0); doc.text("X", fumarSiX + anchoSIParentesis + (4 - anchoX), yPos + 3.5); doc.setTextColor(0,0,0);} 
  doc.setFont("helvetica", "normal").setFontSize(8); doc.text(")", fumarSiX + anchoSIParentesis + 6, yPos + 3.5);
  doc.text("NO (", fumarNoX, yPos + 3.5);
  if (!hab.drogas) { doc.setFont("helvetica", "bold").setFontSize(9); doc.setTextColor(255,0,0); doc.text("X", fumarNoX + anchoNOParentesis + (4 - anchoX), yPos + 3.5); doc.setTextColor(0,0,0);} 
  doc.setFont("helvetica", "normal").setFontSize(8); doc.text(")", fumarNoX + anchoNOParentesis + 6, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8); doc.text("Tipo:", tablaInicioX + 70, yPos + 3.5); doc.setFont("helvetica", "normal").setFontSize(8); doc.text(hab.tipoDrogas || "", tablaInicioX + 85, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8); doc.text("Fr:", tablaInicioX + 130, yPos + 3.5); doc.setFont("helvetica", "normal").setFontSize(8); doc.text(hab.frecuenciaDrogas || "", tablaInicioX + 140, yPos + 3.5);
  yPos += filaAltura3;
  // Otros
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3); doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3); doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3);
  doc.setFont("helvetica", "normal").setFontSize(8); doc.text("Otros", tablaInicioX + 2, yPos + 3.5);
  doc.text("SI (", fumarSiX, yPos + 3.5); 
  if (hab.otros) { doc.setFont("helvetica", "bold").setFontSize(9); doc.setTextColor(255,0,0); doc.text("X", fumarSiX + anchoSIParentesis + (4 - anchoX), yPos + 3.5); doc.setTextColor(0,0,0);} 
  doc.setFont("helvetica", "normal").setFontSize(8); doc.text(")", fumarSiX + anchoSIParentesis + 6, yPos + 3.5);
  doc.text("NO (", fumarNoX, yPos + 3.5);
  if (!hab.otros) { doc.setFont("helvetica", "bold").setFontSize(9); doc.setTextColor(255,0,0); doc.text("X", fumarNoX + anchoNOParentesis + (4 - anchoX), yPos + 3.5); doc.setTextColor(0,0,0);} 
  doc.setFont("helvetica", "normal").setFontSize(8); doc.text(")", fumarNoX + anchoNOParentesis + 6, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8); doc.text("Tipo:", tablaInicioX + 70, yPos + 3.5); doc.setFont("helvetica", "normal").setFontSize(8); doc.text(hab.tipoOtros || "", tablaInicioX + 85, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8); doc.text("Fr:", tablaInicioX + 130, yPos + 3.5); doc.setFont("helvetica", "normal").setFontSize(8); doc.text(hab.frecuenciaOtros || "", tablaInicioX + 140, yPos + 3.5);
  yPos += filaAltura3;

  // === FOOTER PÁGINA 3 ===
  footerTR(doc, { footerOffsetY: 5});

  // === PÁGINA 4 ===
  doc.addPage();
  
  // Contador de página actualizado
  const numeroPagina4 = 4;
  
  // Header para página 4 (mismo estilo que página 3)
  drawHeaderPagina3(numeroPagina4);
  
  // Resetear posición
  yPos = 40;

  // ANTECEDENTES QUIRÚRGICOS (encabezado y tabla como Digitalizado)
  yPos = dibujarHeaderSeccion("ANTECEDENTES QUIRÚRGICOS:", yPos, filaAltura3);
  // Encabezados
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3);
  doc.line(tablaInicioX + 30, yPos, tablaInicioX + 30, yPos + filaAltura3);
  doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura3);
  doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + filaAltura3);
  doc.line(tablaInicioX + 145, yPos, tablaInicioX + 145, yPos + filaAltura3);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha", tablaInicioX + 15, yPos + 3.5, { align: "center" });
  doc.text("Hospital (Nombre - Lugar)", tablaInicioX + 55, yPos + 3.5, { align: "center" });
  doc.text("Operación", tablaInicioX + 105, yPos + 3.5, { align: "center" });
  doc.text("Días.H.", tablaInicioX + 137.5, yPos + 3.5, { align: "center" });
  doc.text("Complicaciones", tablaInicioX + 177.5, yPos + 3.5, { align: "center" });
  yPos += filaAltura3;

  const dibujarFilaQuirurgicoP4 = (fecha, hospital, operacion, diasH, complic) => {
    doc.setFont("helvetica", "normal").setFontSize(8);
    const alturaMin = 5; const padTop = 3.5; const yText = yPos + padTop;
    let alturaMax = alturaMin;
    const medida = (texto, x, ancho) => {
      if (!texto) return yText;
      const textoCapitalizado = capitalizarTexto(texto);
      const yNew = dibujarTextoConSaltoLinea(textoCapitalizado, x, yText, ancho);
      return yNew - yText + padTop + 2;
    };
    alturaMax = Math.max(alturaMax, medida(hospital, tablaInicioX + 32, 48));
    alturaMax = Math.max(alturaMax, medida(operacion, tablaInicioX + 82, 48));
    alturaMax = Math.max(alturaMax, medida(complic, tablaInicioX + 147, 55));
    const h = Math.max(alturaMin, alturaMax);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + h);
    doc.line(tablaInicioX + 30, yPos, tablaInicioX + 30, yPos + h);
    doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + h);
    doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + h);
    doc.line(tablaInicioX + 145, yPos, tablaInicioX + 145, yPos + h);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + h);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + h, tablaInicioX + tablaAncho, yPos + h);
    doc.text(fecha || "", tablaInicioX + 2, yText);
    if (hospital) dibujarTextoConSaltoLinea(capitalizarTexto(hospital), tablaInicioX + 32, yText, 48);
    if (operacion) dibujarTextoConSaltoLinea(capitalizarTexto(operacion), tablaInicioX + 82, yText, 48);
    doc.text(diasH || "", tablaInicioX + 137.5, yText, { align: "center" });
    if (complic) {
      const w = doc.getTextWidth(capitalizarTexto(complic));
      if (w <= 55) doc.text(capitalizarTexto(complic), tablaInicioX + 147, yText); else dibujarTextoConSaltoLinea(capitalizarTexto(complic), tablaInicioX + 147, yText, 55);
    }
    yPos += h;
  };

  if (datosFinales.antecedentesQuirurgicos && datosFinales.antecedentesQuirurgicos.length > 0) {
    datosFinales.antecedentesQuirurgicos.forEach(q => {
      dibujarFilaQuirurgicoP4(
        formatearFechaQuirurgica(q.fecha || q.fechaAntecedentesPatologicosQuirurgicos || ""),
        q.hospitalOperacion || "",
        q.operacion || "",
        q.diasHospitalizado || "",
        q.complicaciones || ""
      );
    });
  } else {
    const hMsg = 8;
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + hMsg);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + hMsg);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + hMsg, tablaInicioX + tablaAncho, yPos + hMsg);
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("No se registran antecedentes quirúrgicos", pageW / 2, yPos + 5, { align: "center" });
    yPos += hMsg;
  }

  // ANTECEDENTES DE REPRODUCCIÓN
  yPos = dibujarHeaderSeccion("ANTECEDENTES DE REPRODUCCIÓN", yPos, filaAltura3);
  yPos = dibujarHeaderSeccionCeleste("En caso de Damas:", yPos, filaAltura3);
  const camposDamasP4 = [
    { label: "Inicio de mestruación:", value: datosFinales.antecedentesReproduccion?.damas?.inicioMenstruacion },
    { label: "inicio de vida sexual:", value: datosFinales.antecedentesReproduccion?.damas?.inicioVidaSexual },
    { label: "Número de parejas sexual a la actualidad:", value: datosFinales.antecedentesReproduccion?.damas?.numeroParejas },
    { label: "Número de hijos vivos:", value: datosFinales.antecedentesReproduccion?.damas?.hijosVivos },
    { label: "Número de hijos fallecidos:", value: datosFinales.antecedentesReproduccion?.damas?.hijosFallecidos },
    { label: "Número de abortos:", value: datosFinales.antecedentesReproduccion?.damas?.numeroAbortos },
    { label: "Precisar Causas:", value: datosFinales.antecedentesReproduccion?.damas?.causasAbortos }
  ];
  camposDamasP4.forEach(c => { doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3); doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3); doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3); doc.setFont("helvetica", "bold").setFontSize(8); doc.text(c.label, tablaInicioX + 2, yPos + 3.5); if (c.value) { doc.setFont("helvetica", "normal").setFontSize(8); doc.text(capitalizarTexto(String(c.value)), tablaInicioX + 80, yPos + 3.5);} yPos += filaAltura3; });
  yPos = dibujarHeaderSeccionCeleste("En caso de Varones:", yPos, filaAltura3);
  const camposVaronesP4 = [
    { label: "Número de hijos vivos:", value: datosFinales.antecedentesReproduccion?.varones?.hijosVivos },
    { label: "Número de hijos fallecidos:", value: datosFinales.antecedentesReproduccion?.varones?.hijosFallecidos },
    { label: "Número de abortos en sus parejas:", value: datosFinales.antecedentesReproduccion?.varones?.abortosParejas },
    { label: "Precisar Causas:", value: datosFinales.antecedentesReproduccion?.varones?.causasAbortos }
  ];
  camposVaronesP4.forEach(c => { doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura3); doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura3); doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); doc.line(tablaInicioX, yPos + filaAltura3, tablaInicioX + tablaAncho, yPos + filaAltura3); doc.setFont("helvetica", "bold").setFontSize(8); doc.text(c.label, tablaInicioX + 2, yPos + 3.5); if (c.value) { doc.setFont("helvetica", "normal").setFontSize(8); doc.text(capitalizarTexto(String(c.value)), tablaInicioX + 80, yPos + 3.5);} yPos += filaAltura3; });

  // Banner de Declaración y Firmas (mismo estilo que Digitalizado p2)
  const declarY = yPos;
  const alturaDeclar = 15;
  doc.setFillColor(253, 208, 94) ; doc.rect(tablaInicioX, declarY, tablaAncho, alturaDeclar, 'F');
  doc.line(tablaInicioX, declarY, tablaInicioX, declarY + alturaDeclar); doc.line(tablaInicioX + tablaAncho, declarY, tablaInicioX + tablaAncho, declarY + alturaDeclar); doc.line(tablaInicioX, declarY, tablaInicioX + tablaAncho, declarY); doc.line(tablaInicioX, declarY + alturaDeclar, tablaInicioX + tablaAncho, declarY + alturaDeclar);
  doc.setFont("helvetica", "bold").setFontSize(8); doc.text("TODA LA INFORMACIÓN QUE HE PROPORCIONADO AL SERVICIO DE MEDICINA OCUPACIONAL,", tablaInicioX + tablaAncho/2, declarY + 4, { align: "center" }); doc.text("ES VERDADERA NO HABIENDO OMITIDO NINGÚN DATO VOLUNTARIAMENTE.", tablaInicioX + tablaAncho/2, declarY + 7, { align: "center" });
  doc.text("FECHA: " + (datosFinales.fechaExamen || ""), tablaInicioX + tablaAncho/2, declarY + 11, { align: "center" });

  const firmasY4 = declarY + alturaDeclar; const alturaFirmas4 = 32;
  doc.line(tablaInicioX, firmasY4, tablaInicioX, firmasY4 + alturaFirmas4); doc.line(tablaInicioX + tablaAncho/2, firmasY4, tablaInicioX + tablaAncho/2, firmasY4 + alturaFirmas4); doc.line(tablaInicioX + tablaAncho, firmasY4, tablaInicioX + tablaAncho, firmasY4 + alturaFirmas4); doc.line(tablaInicioX, firmasY4, tablaInicioX + tablaAncho, firmasY4); doc.line(tablaInicioX, firmasY4 + alturaFirmas4, tablaInicioX + tablaAncho, firmasY4 + alturaFirmas4);
  const centro1 = tablaInicioX + (tablaAncho/2)/2; const centro2 = tablaInicioX + tablaAncho/2 + (tablaAncho/2)/2;
  let firmaP = null, huellaP = null, firmaM = null;
  if (data.digitalizacion && data.digitalizacion.length > 0) {
    const f = data.digitalizacion.find(i => i.nombreDigitalizacion === "FIRMAP"); if (f && f.url) firmaP = f.url;
    const h = data.digitalizacion.find(i => i.nombreDigitalizacion === "HUELLA"); if (h && h.url) huellaP = h.url;
    const fm = data.digitalizacion.find(i => i.nombreDigitalizacion === "SELLOFIRMA"); if (fm && fm.url) firmaM = fm.url;
  }
  if (firmaP) { try { doc.addImage(firmaP, 'PNG', centro1 - 20, firmasY4 + 3, 30, 20); } catch(e) { console.log('Error cargando firma del paciente (p4):', e); } }
  if (huellaP) { try { doc.addImage(huellaP, 'PNG', centro1 + 8, firmasY4 + 3, 12, 20); } catch(e) { console.log('Error cargando huella del paciente (p4):', e); } }
  doc.setFont("helvetica", "normal").setFontSize(7); doc.text("Firma y Huella del Paciente", centro1, firmasY4 + 26, { align: "center" });
  if (firmaM) { try { doc.addImage(firmaM, 'PNG', centro2 - 22.5, firmasY4 + 3, 45, 20); } catch(e) { console.log('Error cargando firma del médico (p4):', e); } }
  doc.setFont("helvetica", "normal").setFontSize(7); doc.text("Firma del Médico", centro2, firmasY4 + 26, { align: "center" }); doc.text("Responsable de la Evaluación", centro2, firmasY4 + 28.5, { align: "center" });

  footerTR(doc, { footerOffsetY: 8});

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