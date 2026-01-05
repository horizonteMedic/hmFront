import jsPDF from "jspdf";
import drawColorBox from '../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';
import { getSignCompressed } from "../../utils/helpers.js";

export default async function ficha_antecedente_patologico_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const datosReales = {
    // Datos personales básicos (mantener en mayúsculas)
    apellidosNombres: String((data.apellidos_apellidos_pa ?? "") + " " + (data.nombres_nombres_pa ?? "")).trim(),
    fechaExamen: formatearFechaCorta(data.fechaAntecedentesPatologicos_fecha_ap ?? ""),
    sexo: data.sexo_sexo_pa === "M" ? "MASCULINO" : data.sexo_sexo_pa === "F" ? "FEMENINO" : "",
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
    // Datos adicionales para nuevas filas
    otrosPatologias: String(data.otrosDescripcionAntecedentesPatologicos_txtotrosap ?? ""),
    especifiqueTratamiento: String(data.especifiqueTratamientoBoro_especifique_detalleenfermedades ?? ""),
    alergiasMedicamentos: Boolean(data.alergiasAlimentosBoro_alergias_medic_alim ?? false),
    especifiqueAlergias: String(data.alergiasAlimentosEspecifiqueBoro_alergias_medic_alimdetall ?? ""),

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
      hipertensionArterial: Boolean(data.hipertencionArterial_chk27 ?? false),
      infeccionesUrinarias: Boolean(data.urinariasRepetidas_chk28 ?? false),
      intoxicaciones: Boolean(data.intoxicaciones_chk29 ?? false),
      insuficienciaCardiaca: Boolean(data.insuficienciaCardiaca_chk30 ?? false),
      insuficienciaCoronaria: Boolean(data.insuficienciaCoronariaCronica_chk31 ?? false),
      insuficienciaRenal: Boolean(data.insuficienciaRenalCronica_chk32 ?? false),
      litiasisUrinaria: Boolean(data.litiasisUrinaria_chk33 ?? false),
      meningitis: Boolean(data.meningitis_chk34 ?? false),
      neuritisRepeticion: Boolean(data.neuritis_chk35 ?? false),
      otitisMedia: Boolean(data.otitisMedia_chk36 ?? false),
      presionAltaBaja: Boolean(data.presionAltaOBaja_chk37 ?? false),
      paludismoMalaria: Boolean(data.paludismoOMalaria_chk38 ?? false),
      parasitosisIntestinal: Boolean(data.parasitosisIntestinal_chk39 ?? false),
      parotiditis: Boolean(data.paratiditis_chk40 ?? false),
      pleuresia: Boolean(data.pleuresia_chk41 ?? false),
      plunbismo: Boolean(data.plumbismo_chk42 ?? false),
      poliomielitis: Boolean(data.poliomielitis_chk43 ?? false),
      portadorMarcapaso: Boolean(data.portadorMarcapasos_chk44 ?? false),
      protesisCardiacas: Boolean(data.protesisCardiacasValvulares_chk45 ?? false),
      resfriosFrecuentes: Boolean(data.resfriosFrecuentes_chk46 ?? false),
      reumatismoRepeticion: Boolean(data.reumatismo_chk47 ?? false),
      sarampion: Boolean(data.sarampion_chk48 ?? false),
      sifilis: Boolean(data.sifilis_chk49 ?? false),
      silicosis: Boolean(data.silicosis_chk50 ?? false),
      sinusitisCronica: Boolean(data.sinusitisCronica_chk51 ?? false),
      tosConvulsiva: Boolean(data.tosConvulsiva_chk52 ?? false),
      transtornoNerviosos: Boolean(data.transtornosNerviosos_chk53 ?? false),
      traumatismoEncefalocraneano: Boolean(data.traumatismoEncefalocraneano_chk54 ?? false),
      tuberculosis: Boolean(data.tuberculosis_chk55 ?? false),
      tumoresQuistes: Boolean(data.tumoresQuistes_chk56 ?? false),
      ulceraPeptica: Boolean(data.ulceraPeptica_chk57 ?? false),
      varicela: Boolean(data.varicela_chk58 ?? false),
      varices: Boolean(data.varices_chk59 ?? false),
      varicoceles: Boolean(data.varicocele_chk60 ?? false),
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
      fumar: Boolean(data.fumarSi_rbfumarsi),
      numeroCigarrillos: String(data.numeroCigarrillos_txtncigarrillos ?? ""),
      licor: Boolean(data.licorSi_rblicorsi),
      tipoLicor: String(data.licorTipoFrecuente_txtlicortipofrecuente ?? ""),
      frecuenciaLicor: String(data.licorFrecuencia_txtlicorfrecuencia ?? ""),
      drogas: Boolean(data.drogasSi_rbdrogassi),
      tipoDrogas: String(data.drogasTipo_txtdrogastipo ?? ""),
      frecuenciaDrogas: String(data.drogasFrecuencia_txtdrogasfrecuencia ?? ""),
      otros: Boolean(data.otrosSiIndicarEnfermedades_rbotrossi),
      tipoOtros: String(data.otrosTipoIndicarEnfermedades_txtotros ?? ""),
      frecuenciaOtros: String(data.otrosFrecuenciaIndicarEnfermedades_txtotrosfrecuencia ?? "")
    },

    // Mapeo de antecedentes quirúrgicos
    antecedentesQuirurgicos: (data.antecedentesPatologicosQuirurjicos || []).map(item => ({
      fecha: String(item.fecha ?? item.fechaAntecedentesPatologicosQuirurgicos ?? ""),
      fechaAntecedentesPatologicosQuirurgicos: String(item.fecha ?? item.fechaAntecedentesPatologicosQuirurgicos ?? ""),
      hospitalOperacion: String(item.hospitalOperacion ?? ""),
      operacion: String(item.operacion ?? ""),
      diasHospitalizado: String(item.diasHospitalizado ?? ""),
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
      covid19: Boolean(data.covid_chkcovid ?? false),
      fechaExamen: formatearFechaCorta(data.fechaCovid_fechacovid ?? ""),
      dosis: String(data.dosisVacunas_txtdosis ?? ""),
      leve: Boolean(data.covidLevel_chkcovidl ?? false),
      moderado: Boolean(data.covidModerado_chkcovidm ?? false),
      severo: Boolean(data.covidSevero_chkcovids ?? false)
    }
  };

  // Usar datos reales si existen, sino usar datos de prueba
  const datosFinales = datosReales;

  // Header reutilizable
  const drawHeader = async (pageNumber) => {
    // Logo y membrete
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (en todas las páginas)
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("FICHA DE ANTECEDENTES", pageW / 2, 32.5, { align: "center" });
    doc.text("PATOLÓGICOS", pageW / 2, 36.5, { align: "center" });

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

  // === HEADER PÁGINA 1 ===
  await drawHeader(numeroPagina);

  // === DATOS PERSONALES ===
  // Función para convertir texto a formato gramaticalmente correcto (primera letra mayúscula, resto minúsculas)
  const formatearTextoGramatical = (texto) => {
    if (!texto || typeof texto !== 'string') return texto;

    // Lista de textos que deben mantenerse en mayúsculas
    const textosMayusculas = ['N/A', 'O.D', 'O.I', 'RCRR', 'HRH', 'B/D', 'RHA(+)', 'COVID-19', 'VIH', 'SIDA', 'TAC', 'RMN', 'ECG', 'EEG'];

    // Dividir por líneas para manejar listas con viñetas
    const lineas = texto.split('\n');
    const lineasFormateadas = lineas.map(linea => {
      if (!linea.trim()) return linea; // Mantener líneas vacías

      // Si la línea empieza con "- " (viñeta), formatear después del guión
      if (linea.trim().startsWith('- ')) {
        const contenido = linea.trim().substring(2); // Quitar "- "
        return '- ' + contenido.charAt(0).toUpperCase() + contenido.slice(1).toLowerCase();
      }

      // Si la línea empieza con ". " (punto), formatear después del punto
      if (linea.trim().startsWith('. ')) {
        const contenido = linea.trim().substring(2); // Quitar ". "
        return '. ' + contenido.charAt(0).toUpperCase() + contenido.slice(1).toLowerCase();
      }

      // Para líneas normales, formatear palabra por palabra respetando textos específicos
      // Primero eliminar espacios al inicio y final, luego dividir por comas
      const lineaTrimmed = linea.trim();
      const segmentosComas = lineaTrimmed.split(',');
      const segmentosFormateados = segmentosComas.map((segmento) => {
        const palabras = segmento.trim().split(' ');
        const palabrasFormateadas = palabras.map((palabra) => {
          // Verificar si la palabra (sin puntuación) está en la lista de mayúsculas
          const palabraSinPuntuacion = palabra.replace(/[.,:;()[\]{}]/g, '');
          const debeSerMayuscula = textosMayusculas.some(texto =>
            texto.toLowerCase() === palabraSinPuntuacion.toLowerCase()
          );

          if (debeSerMayuscula) {
            // Mantener la palabra en mayúsculas
            return palabra.toUpperCase();
          } else if (palabra.trim()) {
            // Cada palabra no vacía: primera letra mayúscula, resto minúsculas
            return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
          } else {
            // Palabras vacías (espacios): mantener como están
            return palabra;
          }
        });

        return palabrasFormateadas.join(' ');
      });

      return segmentosFormateados.join(', ');
    });

    return lineasFormateadas.join('\n');
  };

  // Función para convertir textos específicos a mayúsculas
  const convertirTextosEspecificosAMayusculas = (texto) => {
    if (!texto || typeof texto !== 'string') return texto;

    // Lista de textos que deben estar en mayúsculas
    const textosMayusculas = [
      'n/a', 'n/a.', 'n/a,', 'n/a:', 'n/a;', 'n/a)', 'n/a]', 'n/a}', // N/A con diferentes puntuaciones
      'o.d', 'o.d.', 'o.d,', 'o.d:', 'o.d;', 'o.d)', 'o.d]', 'o.d}', // O.D con diferentes puntuaciones
      'o.i', 'o.i.', 'o.i,', 'o.i:', 'o.i;', 'o.i)', 'o.i]', 'o.i}', // O.I con diferentes puntuaciones
      'rcrr', 'rcrr.', 'rcrr,', 'rcrr:', 'rcrr;', 'rcrr)', 'rcrr]', 'rcrr}', // RCRR con diferentes puntuaciones
      'hrh', 'hrh.', 'hrh,', 'hrh:', 'hrh;', 'hrh)', 'hrh]', 'hrh}', // HRH con diferentes puntuaciones
      'b/d', 'b/d.', 'b/d,', 'b/d:', 'b/d;', 'b/d)', 'b/d]', 'b/d}', // B/D con diferentes puntuaciones
      'rha(+)', 'rha(+).', 'rha(+),', 'rha(+):', 'rha(+);', 'rha(+))', 'rha(+)]', 'rha(+)}' // RHA(+) con diferentes puntuaciones
    ];

    let textoFormateado = texto;

    // Reemplazar cada texto específico con su versión en mayúsculas
    textosMayusculas.forEach(textoEspecifico => {
      const regex = new RegExp('\\b' + textoEspecifico.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'); // Word boundary
      textoFormateado = textoFormateado.replace(regex, textoEspecifico.toUpperCase());
    });

    return textoFormateado;
  };

  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;

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
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);

    return yPos + alturaHeader;
  };

  // Función para texto con salto de línea
  // Función para calcular altura necesaria para un texto sin dibujarlo
  const calcularAlturaTexto = (texto, anchoMaximo, fontSize = 8) => {
    if (!texto) return filaAltura;
    doc.setFontSize(fontSize);
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

  // === SECCIÓN: DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 40; // Posición inicial después del header
  const filaAltura = 5;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("DATOS PERSONALES", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres (fila completa) 
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

  // Cuarta fila: Puesto de Trabajo (fila completa con altura dinámica)
  const alturaPuestoTrabajo = calcularAlturaTexto(datosFinales.puestoTrabajo || "", tablaAncho - 35, 8);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaPuestoTrabajo);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaPuestoTrabajo);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaPuestoTrabajo, tablaInicioX + tablaAncho, yPos + alturaPuestoTrabajo);
  yPos += alturaPuestoTrabajo;

  // Quinta fila: Área de Trabajo (fila completa con altura dinámica)
  const alturaAreaTrabajo = calcularAlturaTexto(datosFinales.areaTrabajo || "", tablaAncho - 35, 8);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaAreaTrabajo);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaAreaTrabajo);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaAreaTrabajo, tablaInicioX + tablaAncho, yPos + alturaAreaTrabajo);
  yPos += alturaAreaTrabajo;

  // Sexta fila: Empresa (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Séptima fila: Contrata (fila completa)
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
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 1.5, tablaAncho - 40);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.edad + " Años", tablaInicioX + 58, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.sexo, tablaInicioX + 105, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento, tablaInicioX + 155, yTexto + 1.5);
  yTexto += filaAltura;

  // Tercera fila: Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.domicilio, tablaInicioX + 25, yTexto + 1.5, 160);
  yTexto += filaAltura;

  // Cuarta fila: Puesto de Trabajo (fila completa)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo, tablaInicioX + 35, yTexto + 1.5, tablaAncho - 40);
  yTexto += alturaPuestoTrabajo;

  // Quinta fila: Área de Trabajo (fila completa)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo, tablaInicioX + 35, yTexto + 1.5, tablaAncho - 40);
  yTexto += alturaAreaTrabajo;

  // Sexta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 24, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Séptima fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contrata, tablaInicioX + 24, yTexto + 1.5);
  yTexto += filaAltura;

  // === SECCIÓN 2: ANTECEDENTES PATOLÓGICOS PERSONALES ===
  // Header gris para la sección 2
  yPos = dibujarHeaderSeccion("2. ANTECEDENTES PATOLÓGICOS PERSONALES", yPos, filaAltura);

  // Fila celeste: Marque "X" si posee o tuvo alguna enfermedad diagnosticada con o sin tratamiento
  yPos = dibujarHeaderSeccionCeleste("Marque \"X\" si posee o tuvo alguna enfermedad diagnosticada con o sin tratamiento:", yPos, filaAltura);



  // Función auxiliar para dibujar una mini celda estandarizada
  const dibujarMiniCelda = (xInicio, yPos, filaAltura) => {
    const anchoMiniCelda = 6; // Ancho reducido para miniceldas más compactas
    doc.line(xInicio, yPos, xInicio, yPos + filaAltura); // Línea vertical izquierda
    doc.line(xInicio, yPos, xInicio + anchoMiniCelda, yPos); // Línea horizontal superior
    doc.line(xInicio, yPos + filaAltura, xInicio + anchoMiniCelda, yPos + filaAltura); // Línea horizontal inferior
    return xInicio + (anchoMiniCelda / 2); // Retorna la posición X centrada para la "X"
  };

  // Función auxiliar para dibujar una fila de enfermedades
  const dibujarFilaEnfermedades = (enfermedad1, enfermedad2, enfermedad3, enfermedad4, valor1, valor2, valor3, valor4) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura);
    doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
    doc.line(tablaInicioX + 150, yPos, tablaInicioX + 150, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    // Dibujar líneas internas para mini celdas usando la función estandarizada
    const xCentrada1 = dibujarMiniCelda(tablaInicioX + 42, yPos, filaAltura);
    const xCentrada2 = dibujarMiniCelda(tablaInicioX + 92, yPos, filaAltura);
    const xCentrada3 = dibujarMiniCelda(tablaInicioX + 142, yPos, filaAltura);
    const xCentrada4 = dibujarMiniCelda(tablaInicioX + 192, yPos, filaAltura);

    // Contenido de la fila - validar que las enfermedades no sean null/undefined
    if (enfermedad1) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(enfermedad1, tablaInicioX + 2, yPos + 3.5);
      doc.setFont("helvetica", "bold").setFontSize(9);
      if (valor1) {
        doc.setTextColor(255, 0, 0); // Color rojo
        doc.text("X", xCentrada1, yPos + 3.5);
        doc.setTextColor(0, 0, 0); // Volver a color negro
      }
    }

    if (enfermedad2) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(enfermedad2, tablaInicioX + 52, yPos + 3.5);
      doc.setFont("helvetica", "bold").setFontSize(9);
      if (valor2) {
        doc.setTextColor(255, 0, 0); // Color rojo
        doc.text("X", xCentrada2, yPos + 3.5);
        doc.setTextColor(0, 0, 0); // Volver a color negro
      }
    }

    if (enfermedad3) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(enfermedad3, tablaInicioX + 102, yPos + 3.5);
      doc.setFont("helvetica", "bold").setFontSize(9);
      if (valor3) {
        doc.setTextColor(255, 0, 0); // Color rojo
        doc.text("X", xCentrada3, yPos + 3.5);
        doc.setTextColor(0, 0, 0); // Volver a color negro
      }
    }

    if (enfermedad4) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(enfermedad4, tablaInicioX + 152, yPos + 3.5);
      doc.setFont("helvetica", "bold").setFontSize(9);
      if (valor4) {
        doc.setTextColor(255, 0, 0); // Color rojo
        doc.text("X", xCentrada4, yPos + 3.5);
        doc.setTextColor(0, 0, 0); // Volver a color negro
      }
    }

    yPos += filaAltura;
  };

  // Usar datos reales mapeados
  const enfermedadesMarcadas = datosFinales.enfermedades || {};

  // Fila 1: Alergias, Amigdalitis Crónica, Arritmias Cardiacas, Asma
  dibujarFilaEnfermedades("Alergias", "Amigdalitis Crónica", "Arritmias Cardiacas", "Asma",
    enfermedadesMarcadas.alergias, enfermedadesMarcadas.amigdalitisCronica, enfermedadesMarcadas.arritmiasCardiacas, enfermedadesMarcadas.asma);

  // Fila 2: Bocio, Bronconeumonia, Bronquitis a Repeticion, Caries o Gingivitis
  dibujarFilaEnfermedades("Bocio", "Bronconeumonia", "Bronquitis a Repeticion", "Caries o Gingivitis",
    enfermedadesMarcadas.bocio, enfermedadesMarcadas.bronconeumonia, enfermedadesMarcadas.bronquitisRepeticion, enfermedadesMarcadas.cariesGingivitis);

  // Fila 3: Colecistitis, Dermatitis, Diabetes, Disenteria
  dibujarFilaEnfermedades("Colecistitis", "Dermatitis", "Diabetes", "Disenteria",
    enfermedadesMarcadas.colecistitis, enfermedadesMarcadas.dermatitis, enfermedadesMarcadas.diabetes, enfermedadesMarcadas.disenteria);

  // Fila 4: Enfermedades del corazon, Enf. Oculares, Epilepsia o convulsiones, Faringitis crónica
  dibujarFilaEnfermedades("Enfermedades del corazon", "Enf. Oculares", "Epilepsia o convulsiones", "Faringitis crónica",
    enfermedadesMarcadas.enfermedadesCorazon, enfermedadesMarcadas.enfermedadesOculares, enfermedadesMarcadas.epilepsiaConvulsiones, enfermedadesMarcadas.faringitisCronica);

  // Fila 5: Fiebre Alta, Fiebre Tifoidea, Fiebre Reumatica, Forunculosis
  dibujarFilaEnfermedades("Fiebre Alta", "Fiebre Tifoidea", "Fiebre Reumatica", "Forunculosis",
    enfermedadesMarcadas.fiebreAlta, enfermedadesMarcadas.fiebreTifoidea, enfermedadesMarcadas.fiebreReumatica, enfermedadesMarcadas.forunculosis);

  // Fila 6: Gastritis Cronica, Gonorrea, Gota (sin COVID-19)
  dibujarFilaEnfermedades("Gastritis Cronica", "Gonorrea", "Gota", "Varicoceles",
    enfermedadesMarcadas.gastritisCronica, enfermedadesMarcadas.gonorrea, enfermedadesMarcadas.gota, false);

  // Fila 7: Hemorroides, Hepatitis, Hernias, Hipertensión Arterial
  dibujarFilaEnfermedades("Hemorroides", "Hepatitis", "Hernias", "Hipertensión Arterial",
    enfermedadesMarcadas.hemorroides, enfermedadesMarcadas.hepatitis, enfermedadesMarcadas.hernias, enfermedadesMarcadas.hipertensionArterial);

  // Fila 8: Inf. Urinarias repetidas, Intoxicaciones, Insuficiencia Cardiaca, Insuficiencia Coronaria Crónica
  dibujarFilaEnfermedades("Inf. Urinarias repetidas", "Intoxicaciones", "Insuficiencia Cardiaca", "Insuficiencia Coronaria Crónica",
    enfermedadesMarcadas.infeccionesUrinarias, enfermedadesMarcadas.intoxicaciones, enfermedadesMarcadas.insuficienciaCardiaca, enfermedadesMarcadas.insuficienciaCoronaria);

  // Fila 9: Insuficiencia Renal Crónica, Litiasis Urinaria, Meningitis, Neuritis a Repeticion
  dibujarFilaEnfermedades("Insuficiencia Renal Crónica", "Litiasis Urinaria", "Meningitis", "Neuritis a Repeticion",
    enfermedadesMarcadas.insuficienciaRenal, enfermedadesMarcadas.litiasisUrinaria, enfermedadesMarcadas.meningitis, enfermedadesMarcadas.neuritisRepeticion);

  // Fila 10: Otitis Media, Presion Alta o Baja, Paludismo o Malaria, Parasitosis Intestinal
  dibujarFilaEnfermedades("Otitis Media", "Presion Alta o Baja", "Paludismo o Malaria", "Parasitosis Intestinal",
    enfermedadesMarcadas.otitisMedia, enfermedadesMarcadas.presionAltaBaja, enfermedadesMarcadas.paludismoMalaria, enfermedadesMarcadas.parasitosisIntestinal);

  // Fila 11: Parotiditis, Pleuresía, Plunbismo, Poliomielitis
  dibujarFilaEnfermedades("Parotiditis", "Pleuresía", "Plunbismo", "Poliomielitis",
    enfermedadesMarcadas.parotiditis, enfermedadesMarcadas.pleuresia, enfermedadesMarcadas.plunbismo, enfermedadesMarcadas.poliomielitis);

  // Fila 12: Portador de Marcapaso, Prótesis Cardiacas Valvulares, Resfríos Frecuentes, Reumatismo a Repetición
  dibujarFilaEnfermedades("Portador de Marcapaso", "Prótesis Cardiacas Valvulares", "Resfríos Frecuentes", "Reumatismo a Repetición",
    enfermedadesMarcadas.portadorMarcapaso, enfermedadesMarcadas.protesisCardiacas, enfermedadesMarcadas.resfriosFrecuentes, enfermedadesMarcadas.reumatismoRepeticion);

  // Fila 13: Sarampion, Sífilis, Silicosis, Sinusitis Crónica
  dibujarFilaEnfermedades("Sarampion", "Sífilis", "Silicosis", "Sinusitis Crónica",
    enfermedadesMarcadas.sarampion, enfermedadesMarcadas.sifilis, enfermedadesMarcadas.silicosis, enfermedadesMarcadas.sinusitisCronica);

  // Fila 14: Tos Convulsiva, Transtorno Nerviosos, Traumatismo Encefalocraneano, Tuberculosis
  dibujarFilaEnfermedades("Tos Convulsiva", "Transtorno Nerviosos", "Traumatismo Encefalocraneano", "Tuberculosis",
    enfermedadesMarcadas.tosConvulsiva, enfermedadesMarcadas.transtornoNerviosos, enfermedadesMarcadas.traumatismoEncefalocraneano, enfermedadesMarcadas.tuberculosis);

  // Fila 15: Tumores_Quistes, Úlcera Peptica, Varicela, Várices
  dibujarFilaEnfermedades("Tumores_Quistes", "Úlcera Peptica", "Varicela", "Várices",
    enfermedadesMarcadas.tumoresQuistes, enfermedadesMarcadas.ulceraPeptica, enfermedadesMarcadas.varicela, enfermedadesMarcadas.varices);

  // === FILA INDIVIDUAL COVID-19 ===

  // Obtener datos de COVID-19
  const covidData = datosFinales.severidadCovid || {};
  const tieneCovid = covidData.covid19 || false;
  const tieneFecha = covidData.fechaExamen && covidData.fechaExamen.trim() !== "";
  const tieneSeveridad = covidData.leve || covidData.moderado || covidData.severo;

  // Determinar qué mostrar: si hay fecha o severidad, o si COVID está marcado
  const debeMostrar = tieneCovid || tieneFecha || tieneSeveridad;

  if (debeMostrar) {
    // Dibujar líneas de la fila individual de COVID-19
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    // COVID-19 con mini celda
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("COVID 19", tablaInicioX + 2, yPos + 3.5);

    // Dibujar mini celda para COVID-19
    const xCentradaCovid = dibujarMiniCelda(tablaInicioX + 42, yPos, filaAltura);

    // Cerrar la mini celda de COVID-19 (línea derecha)
    const anchoMiniCelda = 6;
    const xFinMiniCelda = tablaInicioX + 44 + anchoMiniCelda;
    doc.line(xFinMiniCelda, yPos, xFinMiniCelda, yPos + filaAltura);

    // Marcar X en la mini celda si COVID-19 está marcado
    if (tieneCovid) {
      doc.setFont("helvetica", "bold").setFontSize(9);
      doc.setTextColor(255, 0, 0);
      doc.text("X", xCentradaCovid, yPos + 3.5);
      doc.setTextColor(0, 0, 0);
    }

    // Calcular posición X inicial para datos adicionales (después de la mini celda)
    let xActual = xFinMiniCelda + 3;

    // Mostrar fecha solo si COVID-19 está marcado y tiene fecha
    if (tieneCovid && tieneFecha) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("Fecha: " + covidData.fechaExamen, xActual, yPos + 3.5);
      xActual += doc.getTextWidth("Fecha: " + covidData.fechaExamen) + 5;
    }

    // Mostrar severidad solo si COVID-19 está marcado y tiene severidad
    if (tieneCovid && tieneSeveridad) {
      // Severidad: Leve
      if (covidData.leve) {
        doc.setFont("helvetica", "bold").setFontSize(8);
        doc.text("Leve (", xActual, yPos + 3.5);
        xActual += doc.getTextWidth("Leve (");
        doc.setFont("helvetica", "bold").setFontSize(9);
        doc.setTextColor(255, 0, 0);
        doc.text("X", xActual, yPos + 3.5);
        doc.setTextColor(0, 0, 0);
        xActual += doc.getTextWidth("X") + 1;
        doc.setFont("helvetica", "bold").setFontSize(8);
        doc.text(")", xActual, yPos + 3.5);
        xActual += doc.getTextWidth(")") + 3;
      }

      // Severidad: Moderado
      if (covidData.moderado) {
        doc.setFont("helvetica", "bold").setFontSize(8);
        doc.text("Moderado (", xActual, yPos + 3.5);
        xActual += doc.getTextWidth("Moderado (");
        doc.setFont("helvetica", "bold").setFontSize(9);
        doc.setTextColor(255, 0, 0);
        doc.text("X", xActual, yPos + 3.5);
        doc.setTextColor(0, 0, 0);
        xActual += doc.getTextWidth("X") + 1;
        doc.setFont("helvetica", "bold").setFontSize(8);
        doc.text(")", xActual, yPos + 3.5);
        xActual += doc.getTextWidth(")") + 3;
      }

      // Severidad: Severo
      if (covidData.severo) {
        doc.setFont("helvetica", "bold").setFontSize(8);
        doc.text("Severo (", xActual, yPos + 3.5);
        xActual += doc.getTextWidth("Severo (");
        doc.setFont("helvetica", "bold").setFontSize(9);
        doc.setTextColor(255, 0, 0);
        doc.text("X", xActual, yPos + 3.5);
        doc.setTextColor(0, 0, 0);
        xActual += doc.getTextWidth("X") + 1;
        doc.setFont("helvetica", "bold").setFontSize(8);
        doc.text(")", xActual, yPos + 3.5);
      }
    }

    yPos += filaAltura;
  }

  // === FILA ADICIONAL: OTROS ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Otros:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosFinales.otrosPatologias || ""), tablaInicioX + 15, yPos + 3.5);
  yPos += filaAltura;

  // === FILA ADICIONAL: ESPECIFIQUE DETALLES DE LA PATOLOGÍA O TRATAMIENTO MARCADA ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Especifique detalles de la patología o tratamiento marcada:", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // === FILA ADICIONAL: ESPECIFIQUE (TRATAMIENTO) ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Especifique:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosFinales.especifiqueTratamiento || ""), tablaInicioX + 25, yPos + 3.5);
  yPos += filaAltura;

  // === FILA ADICIONAL: ALERGIAS A MEDICAMENTOS / ALIMENTOS SI/NO ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Alergias a Medicamentos / Alimentos", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);

  // Marcar SI si corresponde
  if (datosFinales.alergiasMedicamentos) {
    doc.text("SI (  X  )", tablaInicioX + 80, yPos + 3.5);
  } else {
    doc.text("SI (      )", tablaInicioX + 80, yPos + 3.5);
  }

  // Marcar NO si corresponde
  if (!datosFinales.alergiasMedicamentos) {
    doc.text("NO (  X  )", tablaInicioX + 95, yPos + 3.5);
  } else {
    doc.text("NO (      )", tablaInicioX + 95, yPos + 3.5);
  }
  yPos += filaAltura;

  // === FILA ADICIONAL: ESPECIFIQUE (ALERGIAS) ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Especifique:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosFinales.especifiqueAlergias || ""), tablaInicioX + 25, yPos + 3.5);
  yPos += filaAltura;

  // === OBSERVACIONES ANTECEDENTES PATOLÓGICOS ===
  // Función para calcular altura dinámica de observaciones
  const calcularAlturaObservaciones = (texto, anchoMaximo, doc) => {
    if (!texto) return filaAltura; // Altura mínima si no hay texto

    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineas = doc.splitTextToSize(texto, anchoMaximo);
    const alturaTexto = lineas.length * 4; // 4mm por línea
    const margenSuperior = 1.5;
    const margenInferior = 1.5;

    return Math.max(filaAltura, alturaTexto + margenSuperior + margenInferior);
  };

  // Calcular altura dinámica para observaciones
  const anchoTextoObservaciones = tablaAncho - 35;
  const alturaObservaciones = calcularAlturaObservaciones(datosFinales.observacionesAntecedentes, anchoTextoObservaciones, doc);

  // Dibujar líneas de la fila de observaciones con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaObservaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaObservaciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaObservaciones, tablaInicioX + tablaAncho, yPos + alturaObservaciones);

  // Dibujar texto con altura dinámica
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Observaciones:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(convertirTextosEspecificosAMayusculas(formatearTextoGramatical(datosFinales.observacionesAntecedentes)), tablaInicioX + 30, yPos + 3.5, { maxWidth: anchoTextoObservaciones });

  yPos += alturaObservaciones;

  // === LÍNEA CELESTE PARA SÍNTOMAS FRECUENTES ===
  yPos = dibujarHeaderSeccionCeleste("Indicar las enfermedades que ha tenido o tiene, con mucha frecuencia:", yPos, filaAltura);

  // === SÍNTOMAS FRECUENTES ===
  // Función auxiliar para dibujar una fila de síntomas (similar a enfermedades)
  const dibujarFilaSintomas = (sintoma1, sintoma2, sintoma3, sintoma4, valor1, valor2, valor3, valor4) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura);
    doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
    doc.line(tablaInicioX + 150, yPos, tablaInicioX + 150, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    // Dibujar líneas internas para mini celdas usando la función estandarizada
    const xCentrada1 = dibujarMiniCelda(tablaInicioX + 42, yPos, filaAltura);
    const xCentrada2 = dibujarMiniCelda(tablaInicioX + 92, yPos, filaAltura);
    const xCentrada3 = dibujarMiniCelda(tablaInicioX + 142, yPos, filaAltura);
    const xCentrada4 = dibujarMiniCelda(tablaInicioX + 192, yPos, filaAltura);

    // Contenido de la fila - validar que los síntomas no sean null/undefined
    if (sintoma1) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(sintoma1, tablaInicioX + 2, yPos + 3.5);
      doc.setFont("helvetica", "bold").setFontSize(9);
      if (valor1) {
        doc.setTextColor(255, 0, 0); // Color rojo
        doc.text("X", xCentrada1, yPos + 3.5);
        doc.setTextColor(0, 0, 0); // Volver a color negro
      }
    }

    if (sintoma2) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(sintoma2, tablaInicioX + 52, yPos + 3.5);
      doc.setFont("helvetica", "bold").setFontSize(9);
      if (valor2) {
        doc.setTextColor(255, 0, 0); // Color rojo
        doc.text("X", xCentrada2, yPos + 3.5);
        doc.setTextColor(0, 0, 0); // Volver a color negro
      }
    }

    if (sintoma3) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(sintoma3, tablaInicioX + 102, yPos + 3.5);
      doc.setFont("helvetica", "bold").setFontSize(9);
      if (valor3) {
        doc.setTextColor(255, 0, 0); // Color rojo
        doc.text("X", xCentrada3, yPos + 3.5);
        doc.setTextColor(0, 0, 0); // Volver a color negro
      }
    }

    if (sintoma4) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(sintoma4, tablaInicioX + 152, yPos + 3.5);
      doc.setFont("helvetica", "bold").setFontSize(9);
      if (valor4) {
        doc.setTextColor(255, 0, 0); // Color rojo
        doc.text("X", xCentrada4, yPos + 3.5);
        doc.setTextColor(0, 0, 0); // Volver a color negro
      }
    }

    yPos += filaAltura;
  };

  // Usar datos reales de síntomas
  const sintomasMarcados = datosFinales.sintomas || {};
  const habitosNosivosMarcados = datosFinales.habitos || {};

  // Fila 1: Pérdida de Memoria, Preocupaciones o Angustia, Dolores Articulares, Aumento o Disminución de Peso
  dibujarFilaSintomas("Pérdida de Memoria", "Preocupaciones o Angustia", "Dolores Articulares y/o Huesos", "Aumento o Disminución de Peso",
    sintomasMarcados.perdidaMemoria, sintomasMarcados.preocupacionesAngustia, sintomasMarcados.doloresArticulares, sintomasMarcados.aumentoDisminucionPeso);

  // Fila 2: Dolor de Cabeza, Diarrea, Agitación al Hacer Ejercicios, Dolor Ocular
  dibujarFilaSintomas("Dolor de Cabeza", "Diarrea", "Agitación al Hacer Ejercicios", "Dolor Ocular",
    sintomasMarcados.dolorCabeza, sintomasMarcados.diarrea, sintomasMarcados.agitacionEjercicios, sintomasMarcados.dolorOcular);

  // Fila 3: Dolor opresivo Tórax, Hinchazón de pies o manos, Estreñimiento, Vómitos con Sangre
  dibujarFilaSintomas("Dolor opresivo Tórax", "Hinchazón de pies o manos", "Estreñimiento", "Vómitos con Sangre",
    sintomasMarcados.dolorOpresivoTorax, sintomasMarcados.hinchazonPiesManos, sintomasMarcados.estrenimiento, sintomasMarcados.vomitosSangre);

  // Fila 4: Sangrado por Orina, Tos con Sangre, Coloración Amarilla de la Piel, Indigestión Frecuente
  dibujarFilaSintomas("Sangrado por Orina", "Tos con Sangre", "Coloración Amarilla de la Piel", "Indigestión Frecuente",
    sintomasMarcados.sangradoOrina, sintomasMarcados.tosSangre, sintomasMarcados.coloracionAmarilla, sintomasMarcados.indigestionFrecuente);

  // Fila 5: Insomnio, Lumbalgias o Dolor de Cintura, Mareos - Desmayos - Vértigo, Heces Negras
  dibujarFilaSintomas("Insomnio", "Lumbalgias o Dolor de Cintura", "Mareos - Desmayos - Vértigo", "Heces Negras",
    sintomasMarcados.insomnio, sintomasMarcados.lumbalgias, sintomasMarcados.mareosDesmayos, sintomasMarcados.hecesNegras);

  // Fila 6: Orina con Dolor o Ardor, Orina Involuntaria, Dolor de Oído, Secreciones por el Oído
  dibujarFilaSintomas("Orina con Dolor o Ardor", "Orina Involuntaria", "Dolor de Oído", "Secreciones por el Oído",
    sintomasMarcados.orinaDolorArdor, sintomasMarcados.orinaInvoluntaria, sintomasMarcados.dolorOido, sintomasMarcados.secrecionesOido);

  // Fila 7: Palpitaciones, Adormecimiento, Pesadillas, Dolores Musculares
  dibujarFilaSintomas("Palpitaciones", "Adormecimiento", "Pesadillas", "Dolores Musculares",
    sintomasMarcados.palpitaciones, sintomasMarcados.adormecimiento, sintomasMarcados.pesadillas, sintomasMarcados.doloresMusculares);

  // Fila 8: Tos Crónica, Sangrado por Encías, "", ""
  dibujarFilaSintomas("Tos Crónica", "Sangrado por Encías", "", "",
    sintomasMarcados.tosCronica, sintomasMarcados.sangradoEncias, false, false);

  // === HÁBITOS NOCIVOS ===
  // Header gris para la sección de hábitos nocivos
  yPos = dibujarHeaderSeccion("HÁBITOS NOCIVOS", yPos, filaAltura);

  // Fila de Fumar
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Fumar", tablaInicioX + 2, yPos + 3.5);

  // SI/NO para Fumar con paréntesis del mismo ancho
  const fumarSiX = tablaInicioX + 25;
  const fumarNoX = tablaInicioX + 45;

  doc.text("SI (", fumarSiX, yPos + 3.5);
  if (habitosNosivosMarcados.fumar) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(255, 0, 0);
    doc.text("X", fumarSiX + 7, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
  } else {
    doc.text(" ", fumarSiX + 7, yPos + 3.5);
  }
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(")", fumarSiX + 10, yPos + 3.5);

  doc.text("NO (", fumarNoX, yPos + 3.5);
  if (!habitosNosivosMarcados.fumar) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(255, 0, 0);
    doc.text("X", fumarNoX + 7, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
  } else {
    doc.text(" ", fumarNoX + 7, yPos + 3.5);
  }
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(")", fumarNoX + 10, yPos + 3.5);

  // Número de cigarrillos (movido 10mm a la izquierda)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Número de Cigarrillos:", tablaInicioX + 70, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(habitosNosivosMarcados.numeroCigarrillos || ""), tablaInicioX + 110, yPos + 3.5);

  yPos += filaAltura;

  // Fila de Licor
  // Calcular altura necesaria para el campo de frecuencia (si tiene texto largo)
  let alturaNecesariaLicor = filaAltura;
  const yTextoInicioLicor = yPos + 3.5;
  const xInicioFrecuenciaLicor = tablaInicioX + 140; // Posición X donde comienza el texto de frecuencia
  const anchoDisponibleFrecuenciaLicor = tablaAncho + tablaInicioX - xInicioFrecuenciaLicor - 2; // Ancho disponible: desde inicio hasta final menos margen

  // Calcular altura necesaria para frecuencia usando splitTextToSize
  const frecuenciaLicorTexto = habitosNosivosMarcados.frecuenciaLicor ? formatearTextoGramatical(habitosNosivosMarcados.frecuenciaLicor) : "";
  if (frecuenciaLicorTexto) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineasFrecuenciaLicor = doc.splitTextToSize(frecuenciaLicorTexto, anchoDisponibleFrecuenciaLicor);
    const alturaFrecuenciaLicor = Math.max(filaAltura, lineasFrecuenciaLicor.length * 2.8 + 2);
    alturaNecesariaLicor = Math.max(alturaNecesariaLicor, alturaFrecuenciaLicor);
  }

  // Dibujar líneas de la fila con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaNecesariaLicor);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaNecesariaLicor);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaNecesariaLicor, tablaInicioX + tablaAncho, yPos + alturaNecesariaLicor);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Licor", tablaInicioX + 2, yPos + 3.5);

  // SI/NO para Licor con paréntesis del mismo ancho
  doc.text("SI (", fumarSiX, yPos + 3.5);
  if (habitosNosivosMarcados.licor) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(255, 0, 0);
    doc.text("X", fumarSiX + 7, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
  } else {
    doc.text(" ", fumarSiX + 7, yPos + 3.5);
  }
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(")", fumarSiX + 10, yPos + 3.5);

  doc.text("NO (", fumarNoX, yPos + 3.5);
  if (!habitosNosivosMarcados.licor) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(255, 0, 0);
    doc.text("X", fumarNoX + 7, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
  } else {
    doc.text(" ", fumarNoX + 7, yPos + 3.5);
  }
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(")", fumarNoX + 10, yPos + 3.5);

  // Tipo y frecuencia de licor (movidos 10mm a la izquierda)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Tipo:", tablaInicioX + 70, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(habitosNosivosMarcados.tipoLicor || ""), tablaInicioX + 85, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fr:", tablaInicioX + 130, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Frecuencia con salto de línea si es necesario
  if (frecuenciaLicorTexto) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineasFrecuenciaLicor = doc.splitTextToSize(frecuenciaLicorTexto, anchoDisponibleFrecuenciaLicor);
    lineasFrecuenciaLicor.forEach((linea, index) => {
      doc.text(linea, xInicioFrecuenciaLicor, yTextoInicioLicor + (index * 2.8));
    });
  }

  yPos += alturaNecesariaLicor;

  // Fila de Drogas
  // Calcular altura necesaria para el campo de frecuencia (si tiene texto largo)
  let alturaNecesariaDrogas = filaAltura;
  const yTextoInicioDrogas = yPos + 3.5;
  const xInicioFrecuenciaDrogas = tablaInicioX + 140; // Posición X donde comienza el texto de frecuencia
  const anchoDisponibleFrecuenciaDrogas = tablaAncho + tablaInicioX - xInicioFrecuenciaDrogas - 2; // Ancho disponible: desde inicio hasta final menos margen

  // Calcular altura necesaria para frecuencia usando splitTextToSize
  const frecuenciaDrogasTexto = habitosNosivosMarcados.frecuenciaDrogas ? formatearTextoGramatical(habitosNosivosMarcados.frecuenciaDrogas) : "";
  if (frecuenciaDrogasTexto) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineasFrecuenciaDrogas = doc.splitTextToSize(frecuenciaDrogasTexto, anchoDisponibleFrecuenciaDrogas);
    const alturaFrecuenciaDrogas = Math.max(filaAltura, lineasFrecuenciaDrogas.length * 2.8 + 2);
    alturaNecesariaDrogas = Math.max(alturaNecesariaDrogas, alturaFrecuenciaDrogas);
  }

  // Dibujar líneas de la fila con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaNecesariaDrogas);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaNecesariaDrogas);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaNecesariaDrogas, tablaInicioX + tablaAncho, yPos + alturaNecesariaDrogas);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Drogas", tablaInicioX + 2, yPos + 3.5);

  // SI/NO para Drogas con paréntesis del mismo ancho
  doc.text("SI (", fumarSiX, yPos + 3.5);
  if (habitosNosivosMarcados.drogas) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(255, 0, 0);
    doc.text("X", fumarSiX + 7, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
  } else {
    doc.text(" ", fumarSiX + 7, yPos + 3.5);
  }
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(")", fumarSiX + 10, yPos + 3.5);

  doc.text("NO (", fumarNoX, yPos + 3.5);
  if (!habitosNosivosMarcados.drogas) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(255, 0, 0);
    doc.text("X", fumarNoX + 7, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
  } else {
    doc.text(" ", fumarNoX + 7, yPos + 3.5);
  }
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(")", fumarNoX + 10, yPos + 3.5);

  // Tipo y frecuencia de drogas (movidos 10mm a la izquierda)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Tipo:", tablaInicioX + 70, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(habitosNosivosMarcados.tipoDrogas || ""), tablaInicioX + 85, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fr:", tablaInicioX + 130, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Frecuencia con salto de línea si es necesario
  if (frecuenciaDrogasTexto) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineasFrecuenciaDrogas = doc.splitTextToSize(frecuenciaDrogasTexto, anchoDisponibleFrecuenciaDrogas);
    lineasFrecuenciaDrogas.forEach((linea, index) => {
      doc.text(linea, xInicioFrecuenciaDrogas, yTextoInicioDrogas + (index * 2.8));
    });
  }

  yPos += alturaNecesariaDrogas;

  // Fila de Otros
  // Calcular altura necesaria para el campo de frecuencia (si tiene texto largo)
  let alturaNecesariaOtros = filaAltura;
  const yTextoInicioOtros = yPos + 3.5;
  const xInicioFrecuenciaOtros = tablaInicioX + 140; // Posición X donde comienza el texto de frecuencia
  const anchoDisponibleFrecuenciaOtros = tablaAncho + tablaInicioX - xInicioFrecuenciaOtros - 2; // Ancho disponible: desde inicio hasta final menos margen

  // Calcular altura necesaria para frecuencia usando splitTextToSize
  const frecuenciaOtrosTexto = habitosNosivosMarcados.frecuenciaOtros ? formatearTextoGramatical(habitosNosivosMarcados.frecuenciaOtros) : "";
  if (frecuenciaOtrosTexto) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineasFrecuenciaOtros = doc.splitTextToSize(frecuenciaOtrosTexto, anchoDisponibleFrecuenciaOtros);
    const alturaFrecuenciaOtros = Math.max(filaAltura, lineasFrecuenciaOtros.length * 2.8 + 2);
    alturaNecesariaOtros = Math.max(alturaNecesariaOtros, alturaFrecuenciaOtros);
  }

  // Dibujar líneas de la fila con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaNecesariaOtros);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaNecesariaOtros);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaNecesariaOtros, tablaInicioX + tablaAncho, yPos + alturaNecesariaOtros);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Otros", tablaInicioX + 2, yPos + 3.5);

  // SI/NO para Otros con paréntesis del mismo ancho
  doc.text("SI (", fumarSiX, yPos + 3.5);
  if (habitosNosivosMarcados.otros) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(255, 0, 0);
    doc.text("X", fumarSiX + 7, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
  } else {
    doc.text(" ", fumarSiX + 7, yPos + 3.5);
  }
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(")", fumarSiX + 10, yPos + 3.5);

  doc.text("NO (", fumarNoX, yPos + 3.5);
  if (!habitosNosivosMarcados.otros) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(255, 0, 0);
    doc.text("X", fumarNoX + 7, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
  } else {
    doc.text(" ", fumarNoX + 7, yPos + 3.5);
  }
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(")", fumarNoX + 10, yPos + 3.5);

  // Tipo y frecuencia de otros (movidos 10mm a la izquierda)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Tipo:", tablaInicioX + 70, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(habitosNosivosMarcados.tipoOtros || ""), tablaInicioX + 85, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fr:", tablaInicioX + 130, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Frecuencia con salto de línea si es necesario
  if (frecuenciaOtrosTexto) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineasFrecuenciaOtros = doc.splitTextToSize(frecuenciaOtrosTexto, anchoDisponibleFrecuenciaOtros);
    lineasFrecuenciaOtros.forEach((linea, index) => {
      doc.text(linea, xInicioFrecuenciaOtros, yTextoInicioOtros + (index * 2.8));
    });
  }

  yPos += alturaNecesariaOtros;

  // === FOOTER PÁGINA 1 ===
  footerTR(doc, { footerOffsetY: 5 });

  // === PÁGINA 2 ===
  doc.addPage();
  numeroPagina++; // Incrementar contador de página

  // === HEADER PÁGINA 2 ===
  await drawHeader(numeroPagina);

  // Resetear posición para la nueva página
  yPos = 40;

  // === SECCIÓN: ANTECEDENTES QUIRÚRGICOS ===
  // Header gris para la sección de antecedentes quirúrgicos
  yPos = dibujarHeaderSeccion("ANTECEDENTES QUIRÚRGICOS:", yPos, filaAltura);

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
      const hospitalTexto = formatearTextoGramatical(hospital);
      const nuevaYHospital = dibujarTextoConSaltoLinea(hospitalTexto, tablaInicioX + 32, yTextoInicio, 48); // Sin margen derecho, ancho completo
      const alturaHospital = nuevaYHospital - yTextoInicio + paddingSuperior + 2;
      alturaMaxima = Math.max(alturaMaxima, alturaHospital);
    }

    // Calcular altura para operación (columna más ancha)
    if (operacion) {
      const operacionTexto = formatearTextoGramatical(operacion);
      const nuevaYOperacion = dibujarTextoConSaltoLinea(operacionTexto, tablaInicioX + 82, yTextoInicio, 48); // Sin margen derecho, ancho completo
      const alturaOperacion = nuevaYOperacion - yTextoInicio + paddingSuperior + 2;
      alturaMaxima = Math.max(alturaMaxima, alturaOperacion);
    }

    // Calcular altura para complicaciones (columna más ancha)
    if (complicaciones) {
      const complicacionesTexto = formatearTextoGramatical(complicaciones);
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
      dibujarTextoConSaltoLinea(formatearTextoGramatical(hospital), tablaInicioX + 32, yTextoInicio, 48); // Sin margen derecho, ancho completo
    }

    if (operacion) {
      doc.setFont("helvetica", "normal").setFontSize(8); // Asegurar fuente normal
      dibujarTextoConSaltoLinea(formatearTextoGramatical(operacion), tablaInicioX + 82, yTextoInicio, 48); // Sin margen derecho, ancho completo
    }

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(diasHospitalizacion || "", tablaInicioX + 137.5, yTextoInicio, { align: "center" }); // Centrado en la celda

    if (complicaciones) {
      doc.setFont("helvetica", "normal").setFontSize(8); // Asegurar fuente normal
      const textoComplicaciones = formatearTextoGramatical(complicaciones);

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
  } else {
    // Si no hay datos, mostrar mensaje informativo
    const alturaFilaMensaje = 8; // Altura para el mensaje

    // Dibujar líneas de la fila del mensaje
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaMensaje);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaMensaje);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaMensaje, tablaInicioX + tablaAncho, yPos + alturaFilaMensaje);

    // Mensaje centrado en la fila en negrita
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("No se registran antecedentes quirúrgicos", pageW / 2, yPos + 5, { align: "center" });

    yPos += alturaFilaMensaje;
  }

  // === SECCIÓN: ANTECEDENTES DE REPRODUCCIÓN ===
  // Header gris: ANTECEDENTES DE REPRODUCCIÓN
  yPos = dibujarHeaderSeccion("ANTECEDENTES DE REPRODUCCIÓN", yPos, filaAltura);

  // Fila celeste: En caso de Damas
  yPos = dibujarHeaderSeccionCeleste("En caso de Damas:", yPos, filaAltura);

  // Campos para Damas con datos
  const camposDamas = [
    { label: "Inicio de mestruación:", value: datosFinales.antecedentesReproduccion.damas.inicioMenstruacion },
    { label: "Inicio de vida sexual:", value: datosFinales.antecedentesReproduccion.damas.inicioVidaSexual },
    { label: "Número de parejas sexual a la actualidad:", value: datosFinales.antecedentesReproduccion.damas.numeroParejas },
    { label: "Número de hijos vivos:", value: datosFinales.antecedentesReproduccion.damas.hijosVivos },
    { label: "Número de hijos fallecidos:", value: datosFinales.antecedentesReproduccion.damas.hijosFallecidos },
    { label: "Número de abortos:", value: datosFinales.antecedentesReproduccion.damas.numeroAbortos },
    { label: "Precisar Causas:", value: datosFinales.antecedentesReproduccion.damas.causasAbortos }
  ];

  camposDamas.forEach(campo => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    // Contenido de la fila
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(campo.label, tablaInicioX + 2, yPos + 3.5);

    // Mostrar valor si existe
    if (campo.value) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(campo.value, tablaInicioX + 80, yPos + 3.5);
    }

    yPos += filaAltura;
  });

  // Fila celeste: En caso de Varones
  yPos = dibujarHeaderSeccionCeleste("En caso de Varones:", yPos, filaAltura);

  // Campos para Varones con datos
  const camposVarones = [
    { label: "Número de hijos vivos:", value: datosFinales.antecedentesReproduccion.varones.hijosVivos },
    { label: "Número de hijos fallecidos:", value: datosFinales.antecedentesReproduccion.varones.hijosFallecidos },
    { label: "Número de abortos en sus parejas:", value: datosFinales.antecedentesReproduccion.varones.abortosParejas },
    { label: "Precisar Causas:", value: datosFinales.antecedentesReproduccion.varones.causasAbortos }
  ];

  camposVarones.forEach(campo => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    // Contenido de la fila
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(campo.label, tablaInicioX + 2, yPos + 3.5);

    // Mostrar valor si existe
    if (campo.value) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(campo.value, tablaInicioX + 80, yPos + 3.5);
    }

    yPos += filaAltura;
  });

  // === DECLARACIÓN Y FIRMAS ===
  const declaracionY = yPos; // Menos margen después de antecedentes de reproducción

  // Fila con fondo color #fcbd19 para la declaración
  const alturaDeclaracion = 15; // Más altura para incluir la fecha

  doc.setFillColor(252, 189, 25); // Color #fcbd19
  doc.rect(tablaInicioX, declaracionY, tablaAncho, alturaDeclaracion, 'F');
  doc.line(tablaInicioX, declaracionY, tablaInicioX, declaracionY + alturaDeclaracion);
  doc.line(tablaInicioX + tablaAncho, declaracionY, tablaInicioX + tablaAncho, declaracionY + alturaDeclaracion);
  doc.line(tablaInicioX, declaracionY, tablaInicioX + tablaAncho, declaracionY);
  doc.line(tablaInicioX, declaracionY + alturaDeclaracion, tablaInicioX + tablaAncho, declaracionY + alturaDeclaracion);

  // Texto de declaración centrado y en negrita con más margen superior
  doc.setFont("helvetica", "bold").setFontSize(8);
  const textoDeclaracionFinal = "TODA LA INFORMACIÓN QUE HE PROPORCIONADO AL SERVICIO DE MEDICINA OCUPACIONAL,";
  const textoDeclaracionFinal2 = "ES VERDADERA NO HABIENDO OMITIDO NINGÚN DATO VOLUNTARIAMENTE.";

  doc.text(textoDeclaracionFinal, tablaInicioX + tablaAncho / 2, declaracionY + 4, { align: "center" });
  doc.text(textoDeclaracionFinal2, tablaInicioX + tablaAncho / 2, declaracionY + 7, { align: "center" });

  // Fecha centrada dentro del mismo banner
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FECHA: " + (datosFinales.fechaExamen || ""), tablaInicioX + tablaAncho / 2, declaracionY + 11, { align: "center" });

  // === SECCIÓN DE FIRMAS ===
  const firmasY = declaracionY + alturaDeclaracion; // Posición después del banner

  // Fila de firmas con dos columnas
  const alturaFilaFirmas = 32;

  // Dibujar líneas de la fila de firmas (2 columnas)
  doc.line(tablaInicioX, firmasY, tablaInicioX, firmasY + alturaFilaFirmas);
  doc.line(tablaInicioX + tablaAncho / 2, firmasY, tablaInicioX + tablaAncho / 2, firmasY + alturaFilaFirmas);
  doc.line(tablaInicioX + tablaAncho, firmasY, tablaInicioX + tablaAncho, firmasY + alturaFilaFirmas);
  doc.line(tablaInicioX, firmasY, tablaInicioX + tablaAncho, firmasY);
  doc.line(tablaInicioX, firmasY + alturaFilaFirmas, tablaInicioX + tablaAncho, firmasY + alturaFilaFirmas);

  // === COLUMNA 1: FIRMA Y HUELLA DEL PACIENTE ===
  const centroColumna1X = tablaInicioX + (tablaAncho / 2) / 2;

  // Agregar firma del paciente
  let firmaPacienteUrl = null;
  let huellaPacienteUrl = null;

  if (data.digitalizacion && data.digitalizacion.length > 0) {
    const firmaData = data.digitalizacion.find(item => item.nombreDigitalizacion === "FIRMAP");
    const huellaData = data.digitalizacion.find(item => item.nombreDigitalizacion === "HUELLA");

    if (firmaData && firmaData.url) {
      firmaPacienteUrl = firmaData.url;
    }

    if (huellaData && huellaData.url) {
      huellaPacienteUrl = huellaData.url;
    }
  }

  if (firmaPacienteUrl) {
    try {
      const imgWidth = 30;
      const imgHeight = 20;
      const x = centroColumna1X - 20;
      const y = firmasY + 3;
      doc.addImage(firmaPacienteUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del paciente:", error);
    }
  }

  // Agregar huella del paciente
  if (huellaPacienteUrl) {
    try {
      const imgWidth = 12;
      const imgHeight = 20;
      const x = centroColumna1X + 8;
      const y = firmasY + 3;
      doc.addImage(huellaPacienteUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando huella del paciente:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Firma y Huella del Paciente", centroColumna1X, firmasY + 26, { align: "center" });

  // === COLUMNA 2: FIRMA DEL MÉDICO ===
  const centroColumna2X = tablaInicioX + tablaAncho / 2 + (tablaAncho / 2) / 2;

  // Agregar firma y sello médico
  let firmaMedicoUrl = await getSignCompressed(data, "SELLOFIRMA");


  if (firmaMedicoUrl) {
    try {
      const imgWidth = 45;
      const imgHeight = 20;
      const x = centroColumna2X - 22.5;
      const y = firmasY + 3;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Firma del Médico", centroColumna2X, firmasY + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumna2X, firmasY + 28.5, { align: "center" });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });

  // === Imprimir ===
  if (docExistente) {
    return doc;
  } else {
    imprimir(doc);
  }
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
