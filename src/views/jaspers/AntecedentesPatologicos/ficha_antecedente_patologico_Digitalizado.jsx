import jsPDF from "jspdf";
import drawColorBox from '../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { getSign } from "../../utils/helpers.js";

export default function ficha_antecedente_patologico_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Datos de prueba por defecto
  const datosPrueba = {
    apellidosNombres: "CASTILLO PLASENCIA HADY KATHERINE",
    fechaExamen: "04/11/2024",
    sexo: "Femenino",
    documentoIdentidad: "72384273",
    edad: "31 años",
    fechaNacimiento: "15/03/1993",
    domicilio: "Av. Los Olivos 123, Urbanización San Miguel, Trujillo",
    areaTrabajo: "MINERÍA",
    puestoTrabajo: "INGENIERO DE SEGURIDAD",
    empresa: "MINERA BOROO MISQUICHILCA S.A.",
    contrata: "CONTRATA",
    sede: "Trujillo-Pierola",
    numeroFicha: "99164",
    // Mapeo de observaciones para cada sección
    observacionesAntecedentes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    observacionesSintomas: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    observacionesHabitos: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    // Mapeo de datos de color
    color: 1,
    codigoColor: "#008f39",
    textoColor: "F"
  };
  const datosReales = {
    // Datos personales básicos
    apellidosNombres: String((data.apellidos_apellidos_pa ?? "") + " " + (data.nombres_nombres_pa ?? "")).trim(),
    fechaExamen: formatearFechaCorta(data.fechaAntecedentesPatologicos_fecha_ap ?? ""), 
    sexo: String(data.sexo_sexo_pa ?? ""),
    documentoIdentidad: String(data.dni_cod_pa ?? ""),
    edad: String(data.edad_edad ?? ""),
    fechaNacimiento: formatearFechaCorta(data.fechanacimientopaciente_fecha_nacimiento_pa ?? ""), 
    domicilio: String(data.direccionpaciente_direccion_pa ?? ""),
    areaTrabajo: String(data.area_area_o ?? ""),
    puestoTrabajo: String(data.cargo_cargo_de ?? ""),
    empresa: String(data.empresa_razon_empresa ?? ""),
    contrata: String(data.contrata_razon_contrata ?? ""),
    sede: String(data.sede ?? ""),
    numeroFicha: String(data.n_orden ?? ""),
    
    // Mapeo de observaciones para cada sección
    observacionesAntecedentes: String(data.otrosDescripcionAntecedentesPatologicos_txtotrosap ?? ""),
    observacionesSintomas: String(data.otrosDescripcionIndicarEnfermedades_txtotros1ap ?? ""),
    observacionesHabitos: String(data.otrosTipoIndicarEnfermedades_txtotros ?? ""),
    
    // Mapeo de datos de color
    color: Number(data.color ?? 0),
    codigoColor: String(data.codigoColor ?? ""),
    textoColor: String(data.textoColor ?? ""),
    
    // Mapeo completo de enfermedades/antecedentes patológicos
    enfermedades: {
      alergias: Boolean(data.alergias_chk1 ?? false),
      amigdalitisCronica: Boolean(data.amigdalitisCronica_chk2 ?? false),
      arritmiasCardiacas: Boolean(data.arritmiasCardiacas_chk3 ?? false),
      asma: Boolean(data.asma_chk4 ?? false),
      bocio: Boolean(data.bocio_chk5 ?? false),
      bronconeumonia: Boolean(data.bronconeumonia_chk6 ?? false),
      bronquitisRepeticion: Boolean(data.bronquitisARepeticion_chk7 ?? false),
      cariesGingivitis: Boolean(data.cariesOGingivitis_chk8 ?? false),
      colecistitis: Boolean(data.colecistitis_chk9 ?? false),
      dermatitis: Boolean(data.dermatitis_chk10 ?? false),
      diabetes: Boolean(data.diabetes_chk11 ?? false),
      disenteria: Boolean(data.disenteria_chk12 ?? false),
      enfermedadesCorazon: Boolean(data.enfermedadesCorazon_chk13 ?? false),
      enfermedadesOculares: Boolean(data.enfermedadesOculares_chk14 ?? false),
      epilepsiaConvulsiones: Boolean(data.epilsepsiaOConvulsiones_chk15 ?? false),
      faringitisCronica: Boolean(data.faringitisCronica_chk16 ?? false),
      fiebreAlta: Boolean(data.fiebreMalta_chk17 ?? false),
      fiebreTifoidea: Boolean(data.fiebreTifoidea_chk18 ?? false),
      fiebreReumatica: Boolean(data.fiebreReumatica_chk19 ?? false),
      forunculosis: Boolean(data.foruncolois_chk20 ?? false),
      // Enfermedades adicionales del JSON que no estaban mapeadas
      gastritisCronica: Boolean(data.gastritisCronica_chk21 ?? false),
      gonorrea: Boolean(data.gonorrea_chk22 ?? false),
      gota: Boolean(data.gota_chk23 ?? false),
      hemorroides: Boolean(data.hemorroides_chk24 ?? false),
      hepatitis: Boolean(data.hepatitis_chk25 ?? false),
      hernias: Boolean(data.hernias_chk26 ?? false),
      hipertencionArterial: Boolean(data.hipertencionArterial_chk27 ?? false),
      urinariasRepetidas: Boolean(data.urinariasRepetidas_chk28 ?? false),
      intoxicaciones: Boolean(data.intoxicaciones_chk29 ?? false),
      insuficienciaCardiaca: Boolean(data.insuficienciaCardiaca_chk30 ?? false),
      insuficienciaCoronariaCronica: Boolean(data.insuficienciaCoronariaCronica_chk31 ?? false),
      insuficienciaRenalCronica: Boolean(data.insuficienciaRenalCronica_chk32 ?? false),
      litiasisUrinaria: Boolean(data.litiasisUrinaria_chk33 ?? false),
      meningitis: Boolean(data.meningitis_chk34 ?? false),
      neuritis: Boolean(data.neuritis_chk35 ?? false),
      otitisMedia: Boolean(data.otitisMedia_chk36 ?? false),
      presionAltaOBaja: Boolean(data.presionAltaOBaja_chk37 ?? false),
      paludismoOMalaria: Boolean(data.paludismoOMalaria_chk38 ?? false),
      parasitosisIntestinal: Boolean(data.parasitosisIntestinal_chk39 ?? false),
      paratiditis: Boolean(data.paratiditis_chk40 ?? false),
      pleuresia: Boolean(data.pleuresia_chk41 ?? false),
      plumbismo: Boolean(data.plumbismo_chk42 ?? false),
      poliomielitis: Boolean(data.poliomielitis_chk43 ?? false),
      portadorMarcapasos: Boolean(data.portadorMarcapasos_chk44 ?? false),
      protesisCardiacasValvulares: Boolean(data.protesisCardiacasValvulares_chk45 ?? false),
      resfriosFrecuentes: Boolean(data.resfriosFrecuentes_chk46 ?? false),
      reumatismo: Boolean(data.reumatismo_chk47 ?? false),
      sarampion: Boolean(data.sarampion_chk48 ?? false),
      sifilis: Boolean(data.sifilis_chk49 ?? false),
      silicosis: Boolean(data.silicosis_chk50 ?? false),
      sinusitisCronica: Boolean(data.sinusitisCronica_chk51 ?? false),
      tosConvulsiva: Boolean(data.tosConvulsiva_chk52 ?? false),
      transtornosNerviosos: Boolean(data.transtornosNerviosos_chk53 ?? false),
      traumatismoEncefalocraneano: Boolean(data.traumatismoEncefalocraneano_chk54 ?? false),
      tuberculosis: Boolean(data.tuberculosis_chk55 ?? false),
      tumoresQuistes: Boolean(data.tumoresQuistes_chk56 ?? false),
      ulceraPeptica: Boolean(data.ulceraPeptica_chk57 ?? false),
      varicela: Boolean(data.varicela_chk58 ?? false),
      varices: Boolean(data.varices_chk59 ?? false),
      varicocele: Boolean(data.varicocele_chk60 ?? false),
      covid19: Boolean(data.covid_chkcovid ?? false)
    },
    
    // Mapeo de síntomas frecuentes
    sintomas: {
      perdidaMemoria: Boolean(data.perdidaMemoria_chk61 ?? false),
      preocupacionesAngustia: Boolean(data.preocupacionesAngustia_chk62 ?? false),
      doloresArticulares: Boolean(data.doloresArticulares_chk63 ?? false),
      aumentoDisminucionPeso: Boolean(data.aumentoDisminucionPeso_chk64 ?? false),
      dolorCabeza: Boolean(data.dolorCabeza_chk65 ?? false),
      diarrea: Boolean(data.diarrea_chk66 ?? false),
      agitacionEjercicios: Boolean(data.agitacionEjercicio_chk67 ?? false),
      dolorOcular: Boolean(data.dolorOcular_chk68 ?? false),
      dolorOpresivoTorax: Boolean(data.dolorOpresivoTorax_chk69 ?? false),
      hinchazonPiesManos: Boolean(data.hinchazonPiesOManos_chk70 ?? false),
      estrenimiento: Boolean(data.estrenimiento_chk71 ?? false),
      vomitosSangre: Boolean(data.vomitosConSangre_chk72 ?? false),
      sangradoOrina: Boolean(data.sangradoPorOrina_chk73 ?? false),
      tosSangre: Boolean(data.tosConSangre_chk74 ?? false),
      coloracionAmarilla: Boolean(data.coloracionAmarrillaPiel_chk75 ?? false),
      indigestionFrecuente: Boolean(data.indigestionFrecuente_chk76 ?? false),
      insomnio: Boolean(data.insomnio_chk77 ?? false),
      lumbalgias: Boolean(data.lumbalgiaODolorCintura_chk78 ?? false),
      mareosDesmayos: Boolean(data.mareos_chk79 ?? false),
      hecesNegras: Boolean(data.hecesNegras_chk80 ?? false),
      orinaDolorArdor: Boolean(data.orinaConDolor_chk81 ?? false),
      orinaInvoluntaria: Boolean(data.orinaInvoluntaria_chk82 ?? false),
      dolorOido: Boolean(data.dolorOido_chk83 ?? false),
      secrecionesOido: Boolean(data.secrecionesOido_chk84 ?? false),
      palpitaciones: Boolean(data.palpitaciones_chk85 ?? false),
      adormecimiento: Boolean(data.adormecimientos_chk86 ?? false),
      pesadillas: Boolean(data.pesadillasFrecuentes_chk87 ?? false),
      doloresMusculares: Boolean(data.doloresMusculares_chk88 ?? false),
      tosCronica: Boolean(data.tosCronica_chk89 ?? false),
      sangradoEncias: Boolean(data.sangradoEncias_chk90 ?? false)
    },
    
    // Mapeo de hábitos nocivos
    habitos: {
      fumar: Boolean(data.fumarSi_rbfumarsi ?? false),
      numeroCigarrillos: String(data.numeroCigarrillos_txtncigarrillos ?? ""),
      licor: Boolean(data.licorSi_rblicorsi ?? false),
      tipoLicor: String(data.licorTipoFrecuente_txtlicortipofrecuente ?? ""),
      frecuenciaLicor: String(data.licorFrecuencia_txtlicorfrecuencia ?? ""),
      drogas: Boolean(data.drogasSi_rbdrogassi ?? false),
      tipoDrogas: String(data.drogasTipo_txtdrogastipo ?? ""),
      frecuenciaDrogas: String(data.drogasFrecuencia_txtdrogasfrecuencia ?? ""),
      otros: Boolean(data.otrosSiIndicarEnfermedades_rbotrossi ?? false), //revisar - campo no claro en el mapeo original
      tipoOtros: String(data.otrosTipoIndicarEnfermedades_txtotros ?? ""),
      frecuenciaOtros: String(data.otrosFrecuenciaIndicarEnfermedades_txtotrosfrecuencia ?? "")
    },
    
    // Mapeo de antecedentes quirúrgicos
    antecedentesQuirurgicos: (data.antecedentesPatologicosQuirurjicos || []).map(item => ({
      fecha: String(item.fechaAntecedentesPatologicosQuirurgicos ?? ""),
      hospital: String(item.hospitalOperacion ?? ""),
      operacion: String(item.operacion ?? ""),
      diasHospitalizacion: String(item.diasHospitalizado ?? ""),
      complicaciones: String(item.complicaciones ?? "")
    })),
    
    // Mapeo de antecedentes de reproducción
    antecedentesReproduccion: {
      damas: {
        inicioMenstruacion: String(data.inicioMestruacionDamas_txtdiniciomestruacion ?? ""),
        inicioVidaSexual: String(data.inicioVidaSexualDamas_txtdiniciovidasexual ?? ""),
        numeroParejas: String(data.numeroParejasSexActualidadDamas_txtdnumparejassexactualidad ?? ""),
        hijosVivos: String(data.hijosVivosDamas_txtdhijosvivos ?? ""),
        hijosFallecidos: String(data.hijosFallecidosDamas_txtdhijosfallecidos ?? ""),
        numeroAbortos: String(data.numerosDeAbortosDamas_txtdnumerosdeabortos ?? ""),
        causasAbortos: String(data.precisarCausasDamas_txtdcausas ?? "")
      },
      varones: {
        hijosVivos: String(data.hijosVivosVarones_txtvhijosvivos ?? ""),
        hijosFallecidos: String(data.hijosFallecidosVarones_txtvhijosfallecidos ?? ""),
        abortosParejas: String(data.abortosParejasVarones_txtvnabortosparejas ?? ""),
        causasAbortos: String(data.precisarCausasVarones_txtvcausas ?? "")
      }
    },
    
    // Mapeo de severidad COVID-19
    severidadCovid: {
      leve: Boolean(data.covidLevel_chkcovidl ?? false),
      moderado: Boolean(data.covidModerado_chkcovidm ?? false),
      severo: Boolean(data.covidSevero_chkcovids ?? false)
    }
  };

  // Usar datos reales si existen, sino usar datos de prueba
  const datosFinales = data && data.n_orden ? datosReales : datosPrueba;

  // === HEADER ===
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("FICHA DE ANTECEDENTES PATOLOGICOS", pageW / 2, 26, { align: "center" });

  // Número de Ficha y Página - Página 1 (tipo lista)
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Nro de ficha: ", pageW - 53, 20);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(datosFinales.numeroFicha, pageW - 33, 20);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Sede: " + datosFinales.sede, pageW - 53, 25);
  doc.text("Pag. " + numeroPagina.toString().padStart(2, '0'), pageW - 53, 30);

  // === BLOQUE DE COLOR ===
  drawColorBox(doc, {
    color: datosFinales.codigoColor,           // Color de la letra y línea
    text: datosFinales.textoColor,             // Letra a mostrar (ej: "F")
    x: pageW - 30,                             // Posición X (30mm del borde derecho)
    y: 15,                                     // Posición Y (alineado con header)
    size: 22,                                  // Tamaño del área total (22x22mm)
    showLine: true,                            // Mostrar línea de color
    fontSize: 30,                              // Tamaño de la letra
    textPosition: 0.9                          // Posición de la letra (0.9 = cerca de la línea)
  });


  // === FECHA DE EXAMEN ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Fecha Examen: " + datosFinales.fechaExamen, 15, 35);

  // === DATOS PERSONALES ===
  // Configuración individual y editable para cada campo
  const datosPersonales = [
    {
      label: "Apellidos y Nombres:",
      value: datosFinales.apellidosNombres,
      x: 15,
      y: 40,
      labelOffset: 0,
      valueOffset: 35
    },
    {
      label: "DNI:",
      value: datosFinales.documentoIdentidad,
      x: 130,
      y: 40,
      labelOffset: 0,
      valueOffset: 8
    },
    {
      label: "Sexo:",
      value: datosFinales.sexo,
      x: 163,
      y: 45,
      labelOffset: 0,
      valueOffset: 10
    },
    {
      label: "Edad:",
      value: datosFinales.edad,
      x: 130,
      y: 45,
      labelOffset: 0,
      valueOffset: 10
    },
    {
      label: "Fecha Nac.:",
      value: datosFinales.fechaNacimiento,
      x: 163,
      y: 40,
      labelOffset: 0,
      valueOffset: 20
    },
    {
      label: "Domicilio:",
      value: datosFinales.domicilio,
      x: 15,
      y: 45,
      labelOffset: 0,
      valueOffset: 20
    },
    {
      label: "Área de Trabajo:",
      value: datosFinales.areaTrabajo,
      x: 130,
      y: 50,
      labelOffset: 0,
      valueOffset: 27
    },
    {
      label: "Puesto de Trabajo:",
      value: datosFinales.puestoTrabajo,
      x: 15,
      y: 50,
      labelOffset: 0,
      valueOffset: 30
    },
    {
      label: "Empresa:",
      value: datosFinales.empresa,
      x: 15,
      y: 55,
      labelOffset: 0,
      valueOffset: 20
    },
    {
      label: "Contrata:",
      value: datosFinales.contrata,
      x: 15,
      y: 60,
      labelOffset: 0,
      valueOffset: 20
    }
  ];

  // Renderizar datos personales con configuración individual
  datosPersonales.forEach(item => {
    // Label
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(item.label, item.x + item.labelOffset, item.y);

    // Valor
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(item.value || "", item.x + item.valueOffset, item.y);
  });

  // === ANTECEDENTES PATOLÓGICOS PERSONALES ===
  // Marco único para toda la sección
  const marcoInicioY = 72;
  const marcoFinY = 171;
  const marcoInicioX = 15;
  const marcoFinX = 200;

  // Marco rectangular principal que encierra todo
  doc.rect(marcoInicioX, marcoInicioY, marcoFinX - marcoInicioX, marcoFinY - marcoInicioY);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("1. Antecedentes Patologicos Personales:", 15, 70);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Marcar con una X las Enfermedades que han tenido o tienen:", 20, 75);

  // Listas de enfermedades por columna
  const col1 = [
    { texto: "Alergias", campo: "alergias" },
    { texto: "Amigdalitis Crónica", campo: "amigdalitisCronica" },
    { texto: "Arritmias Cardiacas", campo: "arritmiasCardiacas" },
    { texto: "Asma", campo: "asma" },
    { texto: "Bocio", campo: "bocio" },
    { texto: "Bronconeumonia", campo: "bronconeumonia" },
    { texto: "Bronquitis a Repeticion", campo: "bronquitisRepeticion" },
    { texto: "Caries o Gingivitis", campo: "cariesGingivitis" },
    { texto: "Colecistitis", campo: "colecistitis" },
    { texto: "Dermatitis", campo: "dermatitis" },
    { texto: "Diabetes", campo: "diabetes" },
    { texto: "Disenteria", campo: "disenteria" },
    { texto: "Enfermedades del corazon", campo: "enfermedadesCorazon" },
    { texto: "Enf. Oculares", campo: "enfermedadesOculares" },
    { texto: "Epilepsia o convulsiones", campo: "epilepsiaConvulsiones" },
    { texto: "Faringitis crónica", campo: "faringitisCronica" },
    { texto: "Fiebre Alta", campo: "fiebreAlta" },
    { texto: "Fiebre Tifoidea", campo: "fiebreTifoidea" },
    { texto: "Fiebre Reumatica", campo: "fiebreReumatica" },
    { texto: "Forunculosis", campo: "forunculosis" },
    { texto: "COVID 19", campo: "covid19" }
  ];

  const col2 = [
    { texto: "Gastritis Cronica", campo: "gastritisCronica" },
    { texto: "Gonorrea", campo: "gonorrea" },
    { texto: "Gota", campo: "gota" },
    { texto: "Hemorroides", campo: "hemorroides" },
    { texto: "Hepatitis", campo: "hepatitis" },
    { texto: "Hernias", campo: "hernias" },
    { texto: "Hipertensión Arterial", campo: "hipertensionArterial" },
    { texto: "Inf. Urinarias repetidas", campo: "infeccionesUrinarias" },
    { texto: "Intoxicaciones", campo: "intoxicaciones" },
    { texto: "Insuficiencia Cardiaca", campo: "insuficienciaCardiaca" },
    { texto: "Insuficiencia Coronaria Crónica", campo: "insuficienciaCoronaria" },
    { texto: "Insuficiencia Renal Crónica", campo: "insuficienciaRenal" },
    { texto: "Litiasis Urinaria", campo: "litiasisUrinaria" },
    { texto: "Meningitis", campo: "meningitis" },
    { texto: "Neuritis a Repeticion", campo: "neuritisRepeticion" },
    { texto: "Otitis Media", campo: "otitisMedia" },
    { texto: "Presion Alta o Baja", campo: "presionAltaBaja" },
    { texto: "Paludismo o Malaria", campo: "paludismoMalaria" },
    { texto: "Parasitosis Intestinal", campo: "parasitosisIntestinal" },
    { texto: "Parotiditis", campo: "parotiditis" }
  ];

  const col3 = [
    { texto: "Pleuresía", campo: "pleuresia" },
    { texto: "Plunbismo", campo: "plunbismo" },
    { texto: "Poliomielitis", campo: "poliomielitis" },
    { texto: "Portador de Marcapaso", campo: "portadorMarcapaso" },
    { texto: "Prótesis Cardiacas Valvulares", campo: "protesisCardiacas" },
    { texto: "Resfríos Frecuentes", campo: "resfriosFrecuentes" },
    { texto: "Reumatismo a Repetición", campo: "reumatismoRepeticion" },
    { texto: "Sarampion", campo: "sarampion" },
    { texto: "Sífilis", campo: "sifilis" },
    { texto: "Silicosis", campo: "silicosis" },
    { texto: "Sinusitis Crónica", campo: "sinusitisCronica" },
    { texto: "Tos Convulsiva", campo: "tosConvulsiva" },
    { texto: "Transtorno Nerviosos", campo: "transtornoNerviosos" },
    { texto: "Traumatismo Encefalocraneano", campo: "traumatismoEncefalocraneano" },
    { texto: "Tuberculosis", campo: "tuberculosis" },
    { texto: "Tumores_Quistes", campo: "tumoresQuistes" },
    { texto: "Úlcera Peptica", campo: "ulceraPeptica" },
    { texto: "Varicela", campo: "varicela" },
    { texto: "Várices", campo: "varices" },
    { texto: "Varicoceles", campo: "varicoceles" }
  ];

  // Configuración de posiciones
  const startY = 80;
  const stepY = 4;
  const posicionesX = [20, 80, 140]; // 3 columnas

  // Generar lista con coordenadas automáticas
  const enfermedades = [];
  [col1, col2, col3].forEach((col, colIndex) => {
    col.forEach((enfermedad, i) => {
      enfermedades.push({
        ...enfermedad,
        x: posicionesX[colIndex],
        y: startY + i * stepY
      });
    });
  });

  // Usar datos reales mapeados
  const enfermedadesMarcadas = datosFinales.enfermedades || {};
  const severidadCovid = datosFinales.severidadCovid || {};
  const habitosNosivosMarcados = datosFinales.habitos || {};

  // Renderizar en PDF
  enfermedades.forEach(enfermedad => {
    // Texto
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(enfermedad.texto, enfermedad.x, enfermedad.y);

    // Checkbox
    const checkboxX = enfermedad.x + 50;
    const checkboxY = enfermedad.y - 2;
    doc.rect(checkboxX, checkboxY, 3, 3);

    // Marcar si corresponde
    if (enfermedadesMarcadas[enfermedad.campo]) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.setTextColor(255, 0, 0); // rojo
      doc.text("X", checkboxX + 0.4, checkboxY + 2.73);
      doc.setTextColor(0, 0, 0);   // reset
    }
  });
  // === SEVERIDAD Y FECHA ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Fecha :", 80, 160);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.fechaExamen || "", 95, 160);

  // LEVE
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("LEVE (   )", 120, 160);
  if (severidadCovid.leve) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(255, 0, 0);
    doc.text("X", 130.5, 160.2); // coordenada dentro del paréntesis
    doc.setTextColor(0, 0, 0);
  }

  // MODERADO
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("MODERADO (   )", 140, 160);
  if (severidadCovid.moderado) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(255, 0, 0);
    doc.text("X", 161, 160.2); // ajustar dentro del (   )
    doc.setTextColor(0, 0, 0);
  }

  // SEVERO
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("SEVERO (   )", 172, 160);
  if (severidadCovid.severo) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(255, 0, 0);
    doc.text("X", 187.4, 160.2); // dentro del (   )
    doc.setTextColor(0, 0, 0);
  }

  // === OBSERVACIONES ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Observaciones:", 20, 165);

  // Texto de observaciones (comienza después de "Observaciones:" en la misma línea)
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.observacionesAntecedentes, 45, 165, { maxWidth: 155 });

  // === SÍNTOMAS FRECUENTES ===
  // Marco para la sección de síntomas
  const sintomasMarcoInicioY = 173;
  const sintomasMarcoFinY = 230;
  const sintomasMarcoInicioX = 15;
  const sintomasMarcoFinX = 200;

  // Marco rectangular para síntomas
  doc.rect(sintomasMarcoInicioX, sintomasMarcoInicioY, sintomasMarcoFinX - sintomasMarcoInicioX, sintomasMarcoFinY - sintomasMarcoInicioY);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Indicar las enfermedades que ha tenido o tiene, con mucha frecuencia:", 20, 178);

  // Listas de síntomas por columna
  const sintomasCol1 = [
    { texto: "Pérdida de Memoria", campo: "perdidaMemoria" },
    { texto: "Preocupaciones o Angustia", campo: "preocupacionesAngustia" },
    { texto: "Dolores Articulares y/o Huesos", campo: "doloresArticulares" },
    { texto: "Aumento o Disminución de Peso", campo: "aumentoDisminucionPeso" },
    { texto: "Dolor de Cabeza", campo: "dolorCabeza" },
    { texto: "Diarrea", campo: "diarrea" },
    { texto: "Agitación al Hacer Ejercicios", campo: "agitacionEjercicios" },
    { texto: "Dolor Ocular", campo: "dolorOcular" },
    { texto: "Dolor opresivo Tórax", campo: "dolorOpresivoTorax" },
    { texto: "Hinchazón de pies o manos", campo: "hinchazonPiesManos" },
  ];

  const sintomasCol2 = [
    { texto: "Estreñimiento", campo: "estrenimiento" },
    { texto: "Vómitos con Sangre", campo: "vomitosSangre" },
    { texto: "Sangrado por Orina", campo: "sangradoOrina" },
    { texto: "Tos con Sangre", campo: "tosSangre" },
    { texto: "Coloración Amarilla de la Piel", campo: "coloracionAmarilla" },
    { texto: "Indigestión Frecuente", campo: "indigestionFrecuente" },
    { texto: "Insomnio", campo: "insomnio" },
    { texto: "Lumbalgias o Dolor de Cintura", campo: "lumbalgias" },
    { texto: "Mareos - Desmayos - Vértigo", campo: "mareosDesmayos" },
    { texto: "Heces Negras", campo: "hecesNegras" },
  ];

  const sintomasCol3 = [
    { texto: "Orina con Dolor o Ardor", campo: "orinaDolorArdor" },
    { texto: "Orina Involuntaria", campo: "orinaInvoluntaria" },
    { texto: "Dolor de Oído", campo: "dolorOido" },
    { texto: "Secreciones por el Oído", campo: "secrecionesOido" },
    { texto: "Palpitaciones", campo: "palpitaciones" },
    { texto: "Adormecimiento", campo: "adormecimiento" },
    { texto: "Pesadillas", campo: "pesadillas" },
    { texto: "Dolores Musculares", campo: "doloresMusculares" },
    { texto: "Tos Crónica", campo: "tosCronica" },
    { texto: "Sangrado por Encías", campo: "sangradoEncias" },
  ];

  // Configuración de posiciones para síntomas
  const sintomasStartY = 183;
  const sintomasStepY = 4;
  const sintomasPosicionesX = [20, 80, 140]; // 3 columnas

  // Generar lista con coordenadas automáticas
  const sintomasFrecuentes = [];
  [sintomasCol1, sintomasCol2, sintomasCol3].forEach((col, colIndex) => {
    col.forEach((sintoma, i) => {
      sintomasFrecuentes.push({
        ...sintoma,
        x: sintomasPosicionesX[colIndex],
        y: sintomasStartY + i * sintomasStepY
      });
    });
  });

  // Usar datos reales de síntomas
  const sintomasMarcados = datosFinales.sintomas || {};

  // Renderizar en PDF
  sintomasFrecuentes.forEach(sintoma => {
    // Texto
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(sintoma.texto, sintoma.x, sintoma.y);

    // Checkbox
    const checkboxX = sintoma.x + 50;
    const checkboxY = sintoma.y - 2;
    doc.rect(checkboxX, checkboxY, 3, 3);

    // Marcar si corresponde
    if (sintomasMarcados[sintoma.campo]) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.setTextColor(255, 0, 0); // rojo
      doc.text("X", checkboxX + 0.4, checkboxY + 2.73);
      doc.setTextColor(0, 0, 0);   // reset
    }
  });

  // === OBSERVACIONES SÍNTOMAS ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Observaciones:", 20, 223);

  // Texto de observaciones de síntomas
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.observacionesSintomas, 45, 223, { maxWidth: 155 });

  // === HABITOS NOSIVOS ===
  // Marco para la sección de hábitos nocivos
  const habitosMarcoInicioY = 232;
  const habitosMarcoFinY = 289;
  const habitosMarcoInicioX = 15;
  const habitosMarcoFinX = 200;

  // Marco rectangular para hábitos nocivos
  doc.rect(habitosMarcoInicioX, habitosMarcoInicioY, habitosMarcoFinX - habitosMarcoInicioX, habitosMarcoFinY - habitosMarcoInicioY);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Habitos Nosivos:", 20, 235.5);

  const habitosNosivosItems = [
    {
      label: "Fumar", campo: "fumar", y: 240.5, subFields: [
        { label: "Numeros de Cigarrillos", campo: "numeroCigarrillos", x: 80, y: 240.5, valorX: 125, valorY: 240.5 }
      ]
    },
    {
      label: "Licor", campo: "licor", y: 247.5, subFields: [
        { label: "Tipo mas Frecuente", campo: "tipoLicor", x: 80, y: 247.5, valorX: 125, valorY: 247.5 },
        { label: "Frecuencia", campo: "frecuenciaLicor", x: 80, y: 252.5, valorX: 125, valorY: 252.5 }
      ]
    },
    {
      label: "Drogas", campo: "drogas", y: 258.5, subFields: [
        { label: "Tipo Probado o que Usa", campo: "tipoDrogas", x: 80, y: 258.5, valorX: 125, valorY: 258.5 },
        { label: "Frecuencia", campo: "frecuenciaDrogas", x: 80, y: 263.5, valorX: 125, valorY: 263.5 }
      ]
    },
    {
      label: "Otros", campo: "otros", y: 269.5, subFields: [
        { label: "Tipo", campo: "tipoOtros", x: 80, y: 269.5, valorX: 125, valorY: 269.5 },
        { label: "Frecuencia", campo: "frecuenciaOtros", x: 80, y: 274.5, valorX: 125, valorY: 274.5 }
      ]
    }
  ];

  habitosNosivosItems.forEach(item => {
    const labelX = 20;
    const checkboxSiX = labelX + 20;
    const checkboxNoX = labelX + 40;
    const checkboxY = item.y - 2.5;

    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(item.label, labelX, item.y);

    // SI con paréntesis de ancho fijo
    doc.text("SI (", checkboxSiX, item.y);
    if (habitosNosivosMarcados[item.campo]) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.setTextColor(255, 0, 0);
      doc.text("X", checkboxSiX + 7.2, item.y + 0.5);
      doc.setTextColor(0, 0, 0);
    } else {
      // Espacio vacío para mantener el ancho
      doc.text(" ", checkboxSiX + 7.2, item.y + 0.5);
    }
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(")", checkboxSiX + 12, item.y);

    // NO con paréntesis de ancho fijo
    doc.text("NO (", checkboxNoX, item.y);
    if (!habitosNosivosMarcados[item.campo]) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.setTextColor(255, 0, 0);
      doc.text("X", checkboxNoX + 8, item.y + 0.5);
      doc.setTextColor(0, 0, 0);
    } else {
      // Espacio vacío para mantener el ancho
      doc.text(" ", checkboxNoX + 7.2, item.y + 0.5);
    }
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(")", checkboxNoX + 12, item.y);

    // Sub-campos (aquí ya NO hay líneas, solo texto de prueba)
    item.subFields.forEach(subField => {
      doc.setFont("helvetica", "bold").setFontSize(9);
      doc.text(subField.label + ":", subField.x, subField.y);
      doc.setFont("helvetica", "normal").setFontSize(9);

      // Mostrar el valor del campo correspondiente en sus coordenadas independientes
      let valor = habitosNosivosMarcados[subField.campo] || "";
      if (!valor) valor = "—";
      doc.text(valor, subField.valorX, subField.valorY);
    });
  });

  // === OBSERVACIONES HÁBITOS NOCIVOS ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Observaciones:", 20, 280);

  // Texto de observaciones de hábitos nocivos
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.observacionesHabitos, 45, 280, { maxWidth: 155 });

  // === PÁGINA 2 ===
  doc.addPage();
  numeroPagina++; // Incrementar contador de página

  // === HEADER PÁGINA 2 ===
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("FICHA DE ANTECEDENTES PATOLOGICOS", pageW / 2, 26, { align: "center" });

  // Número de Ficha y Página (tipo lista)
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Nro de ficha: ", pageW - 53, 20);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(datosFinales.numeroFicha, pageW - 33, 20);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Sede: " + datosFinales.sede, pageW - 53, 25);
  doc.text("Pag. " + numeroPagina.toString().padStart(2, '0'), pageW - 53, 30);

  // === BLOQUE DE COLOR PÁGINA 2 ===
  drawColorBox(doc, {
    color: datosFinales.codigoColor,           // Color de la letra y línea
    text: datosFinales.textoColor,             // Letra a mostrar (ej: "F")
    x: pageW - 30,                             // Posición X (30mm del borde derecho)
    y: 15,                                     // Posición Y (alineado con header)
    size: 22,                                  // Tamaño del área total (22x22mm)
    showLine: true,                            // Mostrar línea de color
    fontSize: 30,                              // Tamaño de la letra
    textPosition: 0.9                          // Posición de la letra (0.9 = cerca de la línea)
  });

  // === ANTECEDENTES QUIRÚRGICOS ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Antecedentes Quirúrgicos:", 15, 40);

  // Tabla de antecedentes quirúrgicos - con separación del título
  const tablaInicioY = 45; // Aumentado de 42 a 45 para mayor separación
  const tablaInicioX = 15;
  const colWidths = [20, 55, 40, 17, 53]; // Anchos de columnas ajustados
  const tablaAncho = colWidths.reduce((a, b) => a + b, 0);

  // Usar datos reales de antecedentes quirúrgicos
  const antecedentesQuirurgicos = datosFinales.antecedentesQuirurgicos || [];

  // Filtrar solo los registros que tienen al menos un campo con datos
  const antecedentesConDatos = antecedentesQuirurgicos.filter(antecedente =>
    antecedente.fecha || antecedente.hospital || antecedente.operacion ||
    antecedente.diasHospitalizacion || antecedente.complicaciones
  );


  // Encabezados de la tabla con coordenadas individuales
  const encabezados = [
    { texto: "Fecha", x: 21, y: 46 },
    { texto: "Hospital (Nombre - Lugar)", x: 44, y: 46 },
    { texto: "Operación", x: 103, y: 46 },
    { texto: "Días.H.", x: 133, y: 46 },
    { texto: "Complicaciones", x: 164, y: 46 }
  ];

  // Dibujar encabezados
  encabezados.forEach((encabezado) => {
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(encabezado.texto, encabezado.x, encabezado.y);
  });

  // Dibujar líneas de la tabla
  // Línea horizontal superior (arriba de los encabezados)
  doc.line(tablaInicioX, tablaInicioY - 2, tablaInicioX + tablaAncho, tablaInicioY - 2);

  // Líneas verticales - se dibujarán después de calcular las alturas dinámicas


  // Función para calcular la altura necesaria de una fila
  const calcularAlturaFila = (fila, colWidths, doc) => {
    let maxLineas = 1;

    // Calcular líneas necesarias para cada campo
    const campos = [
      { texto: fila.fecha || "", ancho: colWidths[0] - 2 },
      { texto: fila.hospital || "", ancho: colWidths[1] - 2 },
      { texto: fila.operacion || "", ancho: colWidths[2] - 2 },
      { texto: fila.diasHospitalizacion || "", ancho: colWidths[3] - 2 },
      { texto: fila.complicaciones || "", ancho: colWidths[4] - 2 }
    ];

    campos.forEach(campo => {
      if (campo.texto) {
        const lineas = doc.getTextWidth(campo.texto) / campo.ancho;
        const lineasNecesarias = Math.ceil(lineas);
        maxLineas = Math.max(maxLineas, lineasNecesarias);
      }
    });

    // Altura completamente dinámica basada en el contenido real + márgenes superior e inferior
    const alturaContenido = maxLineas * 4; // 4mm por línea
    const margenSuperior = 1.5; // 1.5mm margen superior (aumentado para mejor visualización)
    const margenInferior = 0.5; // 0.5mm margen inferior
    return alturaContenido + margenSuperior + margenInferior;
  };

  // Calcular alturas de filas dinámicamente
  const alturasFilas = antecedentesConDatos.map(fila => calcularAlturaFila(fila, colWidths, doc));
  const alturaTotalFilas = alturasFilas.reduce((sum, altura) => sum + altura, 0);

  // Líneas horizontales para filas con alturas dinámicas
  let lineY = tablaInicioY + 2;
  doc.line(tablaInicioX, lineY, tablaInicioX + tablaAncho, lineY); // Línea superior

  alturasFilas.forEach((alturaFila, index) => {
    lineY += alturaFila;
    doc.line(tablaInicioX, lineY, tablaInicioX + tablaAncho, lineY); // Línea inferior de cada fila
  });

  // Líneas verticales dinámicas - se extienden hasta el final de la tabla
  const alturaTotalTabla = alturaTotalFilas + 2; // +2 para el espacio de los encabezados
  let currentX = tablaInicioX;
  for (let i = 0; i <= encabezados.length; i++) {
    doc.line(currentX, tablaInicioY - 2, currentX, tablaInicioY + alturaTotalTabla);
    if (i < encabezados.length) {
      currentX += colWidths[i];
    }
  }

  // Llenar datos en la tabla con alturas dinámicas
  let currentY = tablaInicioY + 2;
  antecedentesConDatos.forEach((fila, rowIndex) => {
    const alturaFila = alturasFilas[rowIndex];
    // Posición Y con margen superior de 1.5mm desde el inicio de la fila
    const margenSuperior = 1.5;
    const rowY = currentY + margenSuperior + 2; // 1.5mm margen + 2mm para centrar el texto
    let colX = tablaInicioX + 2;

    // Fecha
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(fila.fecha || "", colX, rowY, { maxWidth: colWidths[0] - 2 });
    colX += colWidths[0];

    // Hospital
    doc.text(fila.hospital || "", colX, rowY, { maxWidth: colWidths[1] - 2 });
    colX += colWidths[1];

    // Operación
    doc.text(fila.operacion || "", colX, rowY, { maxWidth: colWidths[2] - 2 });
    colX += colWidths[2];

    // Días Hospitalización
    doc.text(fila.diasHospitalizacion || "", colX, rowY, { maxWidth: colWidths[3] - 2 });
    colX += colWidths[3];

    // Complicaciones
    doc.text(fila.complicaciones || "", colX, rowY, { maxWidth: colWidths[4] - 2 });

    currentY += alturaFila;
  });

  // === ANTECEDENTES DE REPRODUCCIÓN ===
  const reproY = tablaInicioY + 2 + alturaTotalFilas + 10;

  // Usar datos reales de antecedentes de reproducción
  const datosReproduccion = datosFinales.antecedentesReproduccion || {
    damas: {
      inicioMenstruacion: "",
      inicioVidaSexual: "",
      numeroParejas: "",
      hijosVivos: "",
      hijosFallecidos: "",
      numeroAbortos: "",
      causasAbortos: ""
    },
    varones: {
      hijosVivos: "",
      hijosFallecidos: "",
      abortosParejas: "",
      causasAbortos: ""
    }
  };

  // Calcular altura total de la sección
  const alturaSeccionDamas = 7 * 5 + 10; // 7 campos * 5mm + margen
  const alturaSeccionVarones = 4 * 5 + 10; // 4 campos * 5mm + margen
  const alturaTotalRepro = alturaSeccionDamas + alturaSeccionVarones + 20; // +20 para títulos y espaciado

  // Marco para Antecedentes de Reproducción
  const marcoReproInicioX = 15;
  const marcoReproFinX = 200;
  const marcoReproInicioY = reproY - 5;
  const marcoReproFinY = reproY + alturaTotalRepro;

  // Dibujar marco rectangular
  doc.rect(marcoReproInicioX, marcoReproInicioY, marcoReproFinX - marcoReproInicioX, marcoReproFinY - marcoReproInicioY);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Antecedentes de Reproducción:", 16, reproY);

  // En caso de Damas
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("En caso de Damas:", 20, reproY + 8);

  const camposDamas = [
    { label: "Inicio de mestruación:", value: datosReproduccion.damas.inicioMenstruacion, y: reproY + 15 },
    { label: "Inicio de vida sexual:", value: datosReproduccion.damas.inicioVidaSexual, y: reproY + 20 },
    { label: "Número de parejas sexual a la actualidad:", value: datosReproduccion.damas.numeroParejas, y: reproY + 25 },
    { label: "Número de hijos vivos:", value: datosReproduccion.damas.hijosVivos, y: reproY + 30 },
    { label: "Número de hijos fallecidos:", value: datosReproduccion.damas.hijosFallecidos, y: reproY + 35 },
    { label: "Número de abortos:", value: datosReproduccion.damas.numeroAbortos, y: reproY + 40 },
    { label: "Precisar Causas:", value: datosReproduccion.damas.causasAbortos, y: reproY + 45 }
  ];

  camposDamas.forEach((campo) => {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(campo.label, 25, campo.y);
    doc.text(campo.value, 25 + 80, campo.y); // Valor a 80mm del inicio
  });

  // En caso de Varones
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("En caso de Varones:", 20, reproY + 55);

  const camposVarones = [
    { label: "Número de hijos vivos:", value: datosReproduccion.varones.hijosVivos, y: reproY + 62 },
    { label: "Número de hijos fallecidos:", value: datosReproduccion.varones.hijosFallecidos, y: reproY + 67 },
    { label: "Número de abortos en sus parejas:", value: datosReproduccion.varones.abortosParejas, y: reproY + 72 },
    { label: "Precisar Causas:", value: datosReproduccion.varones.causasAbortos, y: reproY + 77 }
  ];

  camposVarones.forEach((campo) => {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(campo.label, 25, campo.y);
    doc.text(campo.value, 25 + 80, campo.y); // Valor a 80mm del inicio
  });

  // === DECLARACIÓN Y FIRMAS ===
  const declaracionY = reproY + alturaTotalRepro + 8; // Más margen

  // Texto de declaración centrado
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("TODA LA INFORMACIÓN QUE HE PROPORCIONADO AL SERVICIO DE MEDICINA OCUPACIONAL,", pageW / 2, declaracionY, { align: "center" });
  doc.text("ES VERDADERA NO HABIENDO OMITIDO NINGÚN DATO VOLUNTARIAMENTE.", pageW / 2, declaracionY + 4, { align: "center" });

  // Fecha centrada
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("FECHA: " + datosFinales.fechaExamen, pageW / 2, declaracionY + 10, { align: "center" });

  // Sección de firmas con más margen
  const firmasY = declaracionY + 23;

  // Firma del paciente - CENTRADA con coordenadas individuales
  const firmaPacienteX = pageW / 4; // 1/4 del ancho de página
  const firmaPacienteTextoY = firmasY + 22; // Bajar el texto 40mm
  const firmaPacienteLineaY = firmaPacienteTextoY - 5; // Línea 5mm ANTES del texto

  // Línea para firma del paciente (ARRIBA del texto)
  doc.line(firmaPacienteX - 30, firmaPacienteLineaY, firmaPacienteX + 30, firmaPacienteLineaY);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("FIRMA DEL POSTULANTE", firmaPacienteX, firmaPacienteTextoY, { align: "center" });

  // Firma del médico - CENTRADA con coordenadas individuales
  const firmaMedicoX = (pageW / 4) * 3; // 3/4 del ancho de página
  const firmaMedicoTextoY = firmasY + 22; // Bajar el texto 40mm
  const firmaMedicoLineaY = firmaMedicoTextoY - 5; // Línea 5mm ANTES del texto

  // Línea para firma del médico (ARRIBA del texto)
  doc.line(firmaMedicoX - 30, firmaMedicoLineaY, firmaMedicoX + 30, firmaMedicoLineaY);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("MÉDICO MEDICINA OCUPACIONAL", firmaMedicoX, firmaMedicoTextoY, { align: "center" });

  // Agregar imágenes de firmas y huella
  try {
    // Firma del paciente - centrada
    // Tamaño: 40mm ancho x 25mm alto
    // Posición: X = firmaPacienteX - 12, Y = firmasY - 8
    const firmaPaciente = getSign(data, "FIRMAP")
    doc.addImage(
      firmaPaciente,
      'PNG',
      firmaPacienteX - 30, firmasY - 8, 40, 25
    );

    // Huella digital - centrada
    // Tamaño: 15mm ancho x 21mm alto
    // Posición: X = firmaPacienteX + 5, Y = firmasY - 8
    const huellaDigital = getSign(data, "HUELLA")
    doc.addImage(
      huellaDigital,
      'PNG',
      firmaPacienteX + 10, firmasY - 5, 15, 21
    );

    // Firma/sello del médico - centrada
    // Tamaño: 40mm ancho x 25mm alto
    // Posición: X = firmaMedicoX - 12, Y = firmasY - 8
    const firmaMedico = getSign(data, "SELLOFIRMA")
    doc.addImage(
      firmaMedico,
      'PNG',
      firmaMedicoX - 19, firmasY - 8, 40, 25
    );
  } catch (error) {
    console.log("Error al cargar las imágenes:", error);
    // Si hay error, mostrar texto alternativo centrado
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("[FIRMA PACIENTE]", firmaPacienteX - 10, firmasY - 2);
    doc.text("[HUELLA]", firmaPacienteX + 5, firmasY - 2);
    doc.text("[FIRMA MÉDICO]", firmaMedicoX - 10, firmasY - 2);
  }

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
