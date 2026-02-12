import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { convertirGenero } from "../../utils/helpers.js";
import { dibujarTextoEnFilaCreciente, calcularAlturaTextoCreciente } from "../../utils/formatoParaTextoCrecienteFila.js";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default async function CertificadoAlturaPoderosa_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;


  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente) + " " + (data.nombresPaciente)).trim(),
    fechaExamen: formatearFechaCorta(data.fechaExamen_f_examen),
    tipoExamen: String(data.nombreExamen),
    sexo: convertirGenero(data.sexoPaciente),
    documentoIdentidad: String(data.dniPaciente),
    edad: String(data.edadPaciente),
    areaTrabajo: data.areaPaciente,
    puestoTrabajo: data.cargoPaciente,
    empresa: data.empresa,
    contrata: data.contrata,
    // Datos de color
    color: data.color,
    codigoColor: data.codigoColor,
    textoColor: data.textoColor,
    // Datos adicionales para header
    numeroFicha: String(data.norden),
    sede: data.sede,
    // Datos específicos
    direccionPaciente: String(data.direccionPaciente),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente),
    // Datos adicionales para nueva fila
    lugar: data.lugarExperiencia_lugar_expe,
    anosExperiencia: data.tiempoExperiencia_t_experiencia,
    altura: data.altura_txtaltura,
    // Datos de digitalización
    digitalizacion: data.digitalizacion,
    // Datos para secciones 2 y 3
    accidentesTrabajo: data.accidentesTrabajo_txtaccidentes_trab,
    antecedentesFamiliares: data.antecedentesFamiliares_txtantecedente_familiares,
    // Datos para antecedentes psiconeurológicos
    antecedentesPsiconeurologicos: [
      {
        condicion: "TEC MODERADO A GRAVE",
        si: data.tecModeradoSi_chk_psico_si1,
        no: data.tecModeradoNo_chk_psico_no1,
        descripcion: data.tecModeradoDescripcion_txt_antecpsico_1
      },
      {
        condicion: "COLVULSIONES",
        si: data.convulsionesSi_chk_psico_si2,
        no: data.convulsionesNo_chk_psico_no2,
        descripcion: data.convulsionesDescripcion_txt_antecpsico_2
      },
      {
        condicion: "MAREOS, MIOCLONIAS, ACATISIA",
        si: data.mareosSi_chk_psico_si3,
        no: data.mareosNo_chk_psico_no3,
        descripcion: data.mareosDescripcion_txt_antecpsico_3
      },
      {
        condicion: "PROBLEMAS DE LA AUDICIÓN",
        si: data.problemasAuditivosSi_chk_psico_si4,
        no: data.problemasAuditivosNo_chk_psico_no4,
        descripcion: data.problemasAuditivosDescripcion_txt_antecpsico_4
      },
      {
        condicion: "PROBLEMAS DEL EQUILIBRIO (MENIER, LABERINTITIS)",
        si: data.problemasEquilibrioSi_chk_psico_si5,
        no: data.problemasEquilibrioNo_chk_psico_no5,
        descripcion: data.problemasEquilibrioDescripcion_txt_antecpsico_5
      },
      {
        condicion: "ACROFOBIA",
        si: data.acrofobiaSi_chk_psico_si6,
        no: data.acrofobiaNo_chk_psico_no6,
        descripcion: data.acrofobiaDescripcion_txt_antecpsico_6
      },
      {
        condicion: "AGORAFOBIA",
        si: data.agarofobiaSi_chk_psico_si7,
        no: data.agarofobiaNo_chk_psico_no7,
        descripcion: data.agarofobiaDescripcion_txt_antecpsico_7
      }
    ],
    // Datos para hábitos (sección 5)
    habitos: [
      {
        tipo: "TABACO",
        cantidad: data.tabacoCantidad_txt_tabaco_cantiad,
        frecuencia: data.tabacoFrecuencia_txt_tabaco_frecuencia
      },
      {
        tipo: "ALCOHOL",
        cantidad: data.alcoholCantidad_txt_alcohol_cantiad,
        frecuencia: data.alcoholFrecuencia_txt_alcohol_frecuencia
      },
      {
        tipo: "DROGAS",
        cantidad: data.drogasCantidad_txt_drogas_cantiad,
        frecuencia: data.drogasFrecuencia_txt_drogas_frecuencia
      },
      {
        tipo: "HOJA DE COCA",
        cantidad: data.hojaCocaCantidad_txt_hojacoca_cantiad,
        frecuencia: data.hojaCocaFrecuencia_txt_hojacoca_frecuencia
      },
      {
        tipo: "CAFÉ",
        cantidad: data.cafeCantidad_txt_cafe_cantiad,
        frecuencia: data.cafeFrecuencia_txt_cafe_frecuencia
      }
    ],
    // Datos para TEST CAGE (sección 6)
    cageTest: [
      {
        pregunta: "¿Le gusta salir a divertirse?",
        si: data.gustaDivertirseSi_chktest_si1,
        no: data.gustaDivertirseNo_chktest_no1,
        puntaje: data.gustaDivertirsePuntaje_txttest_p1
      },
      {
        pregunta: "¿Se molesta si llega tarde a algún compromiso?",
        si: data.tardeCompromisoSi_chktest_si2,
        no: data.tardeCompromisoNo_chktest_no2,
        puntaje: data.tardeCompromisoPuntaje_txttest_p2
      },
      {
        pregunta: "¿Le ha molestado alguna vez la gente que le critica su forma de beber?",
        si: data.criticaFormaBeberSi_chktest_si3,
        no: data.criticaFormaBeberNo_chktest_no3,
        puntaje: data.criticaFormaBeberPuntaje_txttest_p3
      },
      {
        pregunta: "¿Ha sentido que estar en una reunión divirtiéndose, lo reanima?",
        si: data.reunionDivertirseReanimaSi_chktest_si4,
        no: data.reunionDivertirseReanimaNo_chktest_no4,
        puntaje: data.reunionDivertirseReanimaPuntaje_txttest_p4
      },
      {
        pregunta: "¿Ha tenido usted alguna vez la impresión de que debería beber menos?",
        si: data.impresionBeberMenosSi_chktest_si5,
        no: data.impresionBeberMenosNo_chktest_no5,
        puntaje: data.impresionBeberMenosPuntaje_txttest_p5
      },
      {
        pregunta: "¿Duerme bien?",
        si: data.duermeBienSi_chktest_si6,
        no: data.duermeBienNo_chktest_no6,
        puntaje: data.duermeBienPuntaje_txttest_p6
      },
      {
        pregunta: "¿Se ha sentido alguna vez mal o culpable por su consumo de beber?",
        si: data.costumbreBeberSi_chktest_si7,
        no: data.costumbreBeberNo_chktest_no7,
        puntaje: data.costumbreBeberPuntaje_txttest_p7
      },
      {
        pregunta: "¿Se pone nervioso a menudo?",
        si: data.nerviosoAMenudoSi_chktest_si8,
        no: data.nerviosoAMenudoNo_chktest_no8,
        puntaje: data.nerviosoAMenudoPuntaje_txttest_p8
      },
      {
        pregunta: "¿Alguna vez lo primero que ha hecho por la mañana ha sido beber para calmar sus nervios o librarse de una resaca?",
        si: data.beberCalmarNerviosSi_chktest_si9,
        no: data.beberCalmarNerviosNo_chktest_no9,
        puntaje: data.beberCalmarNerviosPuntaje_txttest_p9
      },
      {
        pregunta: "¿Sufre de dolores en la espalda al levantarse?",
        si: data.doloresEspaldaSi_chktest_si10,
        no: data.doloresEspaldaNo_chktest_no10,
        puntaje: data.doloresEspaldaPuntaje_txttest_p10
      }
    ],
    // Datos para examen físico
    examenFisico: [
      {
        categoria: "SIGNOS VITALES",
        datos: `PRESION ARTERIAL: ${data.sistolicatriaje_sistolica}/${data.diastolicatriaje_diastolica} mmHg  |  PULSO: ${data.frecuenciacardiacatriaje_f_cardiaca} x min  |  FR: ${data.frecuenciarespiratoriatriaje_f_respiratoria} x min`
      },
      {
        categoria: "ANTROPOMETRIA",
        datos: `PESO: ${data.pesotriaje_peso} kg  |  TALLA: ${data.tallatriaje_talla} m  |  IMC: ${data.imctriaje_imc}  |  P. CUELLO: ${data.perimetrocuellotriaje_perimetro_cuello} cm`
      },
      {
        categoria: "APRECIACION GENERAL",
        datos: data.apreciacionGeneral_txtapresiaciongeneral
      },
      {
        categoria: "CABEZA",
        datos: data.cabeza_txtcabeza
      },
      {
        categoria: "PIEL",
        datos: data.piel_txtpiel
      }
    ]
  };

  // Función para convertir texto a mayúsculas
  const formatearTextoGramatical = (texto) => {
    if (!texto || typeof texto !== 'string') return '';
    return texto.toUpperCase();
  };

  // Función para formatear datos del examen físico preservando unidades en minúsculas
  const formatearDatosExamenFisico = (texto) => {
    if (!texto || typeof texto !== 'string') return texto;
    // Convertir todo a mayúsculas primero
    let textoMayusculas = texto.toUpperCase();
    // Preservar unidades en minúsculas dentro de paréntesis: (mmHg), (kg), (m), (cm)
    textoMayusculas = textoMayusculas.replace(/\(MMHG\)/gi, '(mmHg)');
    textoMayusculas = textoMayusculas.replace(/\(KG\)/gi, '(kg)');
    textoMayusculas = textoMayusculas.replace(/\(M\)/gi, '(m)');
    textoMayusculas = textoMayusculas.replace(/\(CM\)/gi, '(cm)');
    // Preservar "x min" en minúsculas
    textoMayusculas = textoMayusculas.replace(/ X MIN/gi, ' x min');
    // Preservar "EN cm" en minúsculas
    textoMayusculas = textoMayusculas.replace(/ EN CM/gi, ' EN cm');
    // Preservar terminaciones después de valores: " kg", " m", " cm", "mmHg", "x min"
    // Buscar patrones como " 67.3 KG" o " 1.54 M" seguidos de espacio, fin de línea o |
    textoMayusculas = textoMayusculas.replace(/(\d+(?:\.\d+)?)\s+KG(\s|$|\|)/gi, '$1 kg$2');
    // Para "M" evitar coincidir con "IMC", buscar solo cuando está después de un número y antes de espacio, | o fin
    textoMayusculas = textoMayusculas.replace(/(\d+(?:\.\d+)?)\s+M(\s|$|\|)/gi, '$1 m$2');
    textoMayusculas = textoMayusculas.replace(/(\d+(?:\.\d+)?)\s+CM(\s|$|\|)/gi, '$1 cm$2');
    // Preservar "mmHg" después de valores (formato: "118/79 mmHg")
    textoMayusculas = textoMayusculas.replace(/(\d+\/\d+)\s+MMHG(\s|$|\|)/gi, '$1 mmHg$2');
    // Preservar "x min" después de valores (formato: "67 x min")
    textoMayusculas = textoMayusculas.replace(/(\d+(?:\.\d+)?)\s+X\s+MIN(\s|$|\|)/gi, '$1 x min$2');
    return textoMayusculas;
  };


  // Usar solo datos reales proporcionados
  const datosFinales = datosReales;

  // Header reutilizable
  const drawHeader = async (pageNumber) => {
    // Logo y membrete
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (en todas las páginas)
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("EXAMEN MÉDICO OCUPACIONAL PARA TRABAJOS EN ALTURA", pageW / 2, 32.5, { align: "center" });
    doc.text("MAYOR A 1.8 METROS", pageW / 2, 36.5, { align: "center" });

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
    // Manejar valores null o undefined
    if (!texto || typeof texto !== 'string') {
      return y;
    }

    const fontSize = doc.internal.getFontSize();
    let yPos = y;

    // Primero dividir por saltos de línea explícitos (\n)
    const lineas = texto.split('\n');

    lineas.forEach((linea, indexLinea) => {
      if (linea.trim() === '') {
        // Si la línea está vacía, solo avanzar un poco
        if (indexLinea < lineas.length - 1) {
          yPos += fontSize * 0.35;
        }
        return;
      }

      // Procesar cada línea dividiendo por espacios
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
        // Solo avanzar si no es la última línea o si hay más líneas después
        if (indexLinea < lineas.length - 1 || palabras.length > 0) {
          yPos += fontSize * 0.35;
        }
      }
    });

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

  // Primera fila: Apellidos y Nombres con división para Tipo de examen
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura); // División para Tipo de examen
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

  // Cuarta fila: Puesto de Trabajo (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Área de Trabajo (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

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

  // Octava fila: Lugar, Años de experiencia, Altura (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 66, yPos, tablaInicioX + 66, yPos + filaAltura); // División 1
  doc.line(tablaInicioX + 132, yPos, tablaInicioX + 132, yPos + filaAltura); // División 2
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 40 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres con Tipo de examen
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Ajustar ancho para la nueva división (hasta x = tablaInicioX + 140)
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 35, yTexto + 1.5, 95);

  // Columna derecha: Tipo de examen
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosFinales.tipoExamen), tablaInicioX + 155, yTexto + 1.5);
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
  doc.text(formatearTextoGramatical(datosFinales.sexo), tablaInicioX + 105, yTexto + 1.5);

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

  // Cuarta fila: Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosFinales.puestoTrabajo), tablaInicioX + 30, yTexto + 1.5);
  yTexto += filaAltura;

  // Quinta fila: Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosFinales.areaTrabajo), tablaInicioX + 30, yTexto + 1.5);
  yTexto += filaAltura;

  // Sexta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(formatearTextoGramatical(datosFinales.empresa), tablaInicioX + 24, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Séptima fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosFinales.contrata), tablaInicioX + 24, yTexto + 1.5);
  yTexto += filaAltura;

  // Octava fila: Lugar, Años de experiencia, Altura
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Lugar:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.lugar || "", tablaInicioX + 15, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Años de experiencia:", tablaInicioX + 68, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.anosExperiencia || ""), tablaInicioX + 100, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Altura:", tablaInicioX + 134, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.altura || "", tablaInicioX + 150, yTexto + 1.5);
  yTexto += filaAltura;

  // === SECCIÓN 2: ACCIDENTES DE TRABAJO O ENFERMEDADES PROFESIONALES ===
  yPos = dibujarHeaderSeccion("2. ACCIDENTES DE TRABAJO O ENFERMEDADES PROFESIONALES", yPos, filaAltura);

  // Fila creciente para accidentes (altura inicial 10mm)
  yPos = dibujarTextoEnFilaCreciente(doc, formatearTextoGramatical(datosFinales.accidentesTrabajo), tablaInicioX, tablaAncho, yPos, 10, 4, 8);

  // === SECCIÓN 3: ANTECEDENTES FAMILIARES ===
  yPos = dibujarHeaderSeccion("3. ANTECEDENTES FAMILIARES", yPos, filaAltura);

  // Fila creciente para antecedentes familiares (altura inicial 10mm)
  yPos = dibujarTextoEnFilaCreciente(doc, formatearTextoGramatical(datosFinales.antecedentesFamiliares), tablaInicioX, tablaAncho, yPos, 10, 4, 8);

  // === SECCIÓN 4: ANTECEDENTES PERSONALES ===
  yPos = dibujarHeaderSeccion("4. ANTECEDENTES PERSONALES (ver ficha de antecedentes patológicos)", yPos, filaAltura);


  // Crear tabla de antecedentes psiconeurológicos
  const filaAlturaTabla = 5;
  const col1Ancho = 80; // ANTECEDENTES PSICONEUROLÓGICOS
  const col2Ancho = 15; // SI
  const col3Ancho = 15; // NO
  const col4Ancho = 90; // DESCRIPCIÓN

  // Dibujar header de la tabla
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaTabla);
  doc.line(tablaInicioX + col1Ancho, yPos, tablaInicioX + col1Ancho, yPos + filaAlturaTabla);
  doc.line(tablaInicioX + col1Ancho + col2Ancho, yPos, tablaInicioX + col1Ancho + col2Ancho, yPos + filaAlturaTabla);
  doc.line(tablaInicioX + col1Ancho + col2Ancho + col3Ancho, yPos, tablaInicioX + col1Ancho + col2Ancho + col3Ancho, yPos + filaAlturaTabla);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaTabla);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaTabla, tablaInicioX + tablaAncho, yPos + filaAlturaTabla);

  // Contenido del header
  doc.setFont("helvetica", "bold").setFontSize(8);

  // Centrar "ANTECEDENTES PSICONEUROLÓGICOS"
  const textoAntecedentes = "ANTECEDENTES PSICONEUROLÓGICOS";
  const anchoAntecedentes = doc.getTextWidth(textoAntecedentes);
  doc.text(textoAntecedentes, tablaInicioX + (col1Ancho - anchoAntecedentes) / 2, yPos + 3.5);

  // Centrar "SI"
  const textoSi = "SI";
  const anchoSi = doc.getTextWidth(textoSi);
  doc.text(textoSi, tablaInicioX + col1Ancho + (col2Ancho - anchoSi) / 2, yPos + 3.5);

  // Centrar "NO"
  const textoNo = "NO";
  const anchoNo = doc.getTextWidth(textoNo);
  doc.text(textoNo, tablaInicioX + col1Ancho + col2Ancho + (col3Ancho - anchoNo) / 2, yPos + 3.5);

  // Centrar "DESCRIPCIÓN"
  const textoDescripcion = "DESCRIPCIÓN";
  const anchoDescripcion = doc.getTextWidth(textoDescripcion);
  doc.text(textoDescripcion, tablaInicioX + col1Ancho + col2Ancho + col3Ancho + (col4Ancho - anchoDescripcion) / 2, yPos + 3.5);
  yPos += filaAlturaTabla;

  // Dibujar filas de datos
  datosFinales.antecedentesPsiconeurologicos.forEach((antecedente) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaTabla);
    doc.line(tablaInicioX + col1Ancho, yPos, tablaInicioX + col1Ancho, yPos + filaAlturaTabla);
    doc.line(tablaInicioX + col1Ancho + col2Ancho, yPos, tablaInicioX + col1Ancho + col2Ancho, yPos + filaAlturaTabla);
    doc.line(tablaInicioX + col1Ancho + col2Ancho + col3Ancho, yPos, tablaInicioX + col1Ancho + col2Ancho + col3Ancho, yPos + filaAlturaTabla);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaTabla);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAlturaTabla, tablaInicioX + tablaAncho, yPos + filaAlturaTabla);

    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(formatearTextoGramatical(antecedente.condicion), tablaInicioX + 2, yPos + 3.5, col1Ancho - 4);

    // Marcar X en SI o NO según corresponda (centradas)
    if (antecedente.si) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      const textoX = "X";
      const anchoX = doc.getTextWidth(textoX);
      doc.text(textoX, tablaInicioX + col1Ancho + (col2Ancho - anchoX) / 2, yPos + 3.5);
    }
    if (antecedente.no) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      const textoX = "X";
      const anchoX = doc.getTextWidth(textoX);
      doc.text(textoX, tablaInicioX + col1Ancho + col2Ancho + (col3Ancho - anchoX) / 2, yPos + 3.5);
    }

    // Descripción
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(formatearTextoGramatical(antecedente.descripcion), tablaInicioX + col1Ancho + col2Ancho + col3Ancho + 2, yPos + 3.5, col4Ancho - 4);

    yPos += filaAlturaTabla;
  });

  // === SECCIÓN 5: HÁBITOS ===
  yPos = dibujarHeaderSeccion("5. HÁBITOS", yPos, filaAltura);

  // Crear tabla de hábitos
  const filaAlturaHabitos = 5;
  const colTipoAncho = 70; // TIPO
  const colCantidadAncho = 65; // CANTIDAD

  // Dibujar header de la tabla de hábitos
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaHabitos);
  doc.line(tablaInicioX + colTipoAncho, yPos, tablaInicioX + colTipoAncho, yPos + filaAlturaHabitos);
  doc.line(tablaInicioX + colTipoAncho + colCantidadAncho, yPos, tablaInicioX + colTipoAncho + colCantidadAncho, yPos + filaAlturaHabitos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaHabitos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaHabitos, tablaInicioX + tablaAncho, yPos + filaAlturaHabitos);

  // Contenido del header
  doc.setFont("helvetica", "bold").setFontSize(8);

  // Centrar "TIPO"
  const textoTipo = "TIPO";
  const anchoTipo = doc.getTextWidth(textoTipo);
  doc.text(textoTipo, tablaInicioX + (colTipoAncho - anchoTipo) / 2, yPos + 3.5);

  // Centrar "CANTIDAD"
  const textoCantidad = "CANTIDAD";
  const anchoCantidad = doc.getTextWidth(textoCantidad);
  doc.text(textoCantidad, tablaInicioX + colTipoAncho + (colCantidadAncho - anchoCantidad) / 2, yPos + 3.5);

  // Centrar "FRECUENCIA"
  const textoFrecuencia = "FRECUENCIA";
  const anchoFrecuencia = doc.getTextWidth(textoFrecuencia);
  const colFrecuenciaHabitosAncho = tablaAncho - colTipoAncho - colCantidadAncho;
  doc.text(textoFrecuencia, tablaInicioX + colTipoAncho + colCantidadAncho + (colFrecuenciaHabitosAncho - anchoFrecuencia) / 2, yPos + 3.5);
  yPos += filaAlturaHabitos;

  // Dibujar filas de datos para hábitos
  datosFinales.habitos.forEach((habito) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaHabitos);
    doc.line(tablaInicioX + colTipoAncho, yPos, tablaInicioX + colTipoAncho, yPos + filaAlturaHabitos);
    doc.line(tablaInicioX + colTipoAncho + colCantidadAncho, yPos, tablaInicioX + colTipoAncho + colCantidadAncho, yPos + filaAlturaHabitos);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaHabitos);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAlturaHabitos, tablaInicioX + tablaAncho, yPos + filaAlturaHabitos);

    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(formatearTextoGramatical(habito.tipo), tablaInicioX + 2, yPos + 3.5);

    // Centrar CANTIDAD
    const textoCantidadData = formatearTextoGramatical(habito.cantidad || "");
    const anchoCantidadData = doc.getTextWidth(textoCantidadData);
    doc.text(textoCantidadData, tablaInicioX + colTipoAncho + (colCantidadAncho - anchoCantidadData) / 2, yPos + 3.5);

    // Centrar FRECUENCIA
    const textoFrecuenciaData = formatearTextoGramatical(habito.frecuencia || "");
    const anchoFrecuenciaData = doc.getTextWidth(textoFrecuenciaData);
    const colFrecuenciaHabitosAncho = tablaAncho - colTipoAncho - colCantidadAncho;
    doc.text(textoFrecuenciaData, tablaInicioX + colTipoAncho + colCantidadAncho + (colFrecuenciaHabitosAncho - anchoFrecuenciaData) / 2, yPos + 3.5);

    yPos += filaAlturaHabitos;
  });

  // === SECCIÓN 6: TEST CAGE ===
  yPos = dibujarHeaderSeccion("6. TEST CAGE", yPos, filaAltura);

  // Crear tabla de TEST CAGE
  const filaAlturaCage = 4.5; // Altura reducida
  const colNumAncho = 8; // #
  const colPregAncho = 150; // Preguntas
  const colSiAncho = 10; // SI
  const colNoAncho = 10; // NO

  // Posiciones de columnas
  let xNum = tablaInicioX;
  let xPreg = xNum + colNumAncho;
  let xSi = xPreg + colPregAncho;
  let xNo = xSi + colSiAncho;
  let xPunt = xNo + colNoAncho;

  // Dibujar header de la tabla de CAGE
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaCage);
  doc.line(xNum, yPos, xNum, yPos + filaAlturaCage);
  doc.line(xPreg, yPos, xPreg, yPos + filaAlturaCage);
  doc.line(xSi, yPos, xSi, yPos + filaAlturaCage);
  doc.line(xNo, yPos, xNo, yPos + filaAlturaCage);
  doc.line(xPunt, yPos, xPunt, yPos + filaAlturaCage);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaCage);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaCage, tablaInicioX + tablaAncho, yPos + filaAlturaCage);

  // Contenido del header
  doc.setFont("helvetica", "bold").setFontSize(8);

  // Calcular anchos de columnas asumiendo posiciones como bordes izquierdos
  var widthNum = xPreg - xNum;
  var widthPreg = xSi - xPreg;
  var widthSi = xNo - xSi;
  var widthNo = xPunt - xNo;
  // Calcular el ancho real de la columna Puntaje
  var widthPunt = (tablaInicioX + tablaAncho) - xPunt;

  // Centrar "#"
  var numText = "#";
  var numTW = doc.getTextWidth(numText);
  doc.text(numText, xNum + (widthNum - numTW) / 2, yPos + 3);

  // Centrar "Preguntas"
  var pregText = "Preguntas";
  var pregTW = doc.getTextWidth(pregText);
  doc.text(pregText, xPreg + (widthPreg - pregTW) / 2, yPos + 3);

  // Centrar "SI"
  var siText = "SI";
  var siTW = doc.getTextWidth(siText);
  doc.text(siText, xSi + (widthSi - siTW) / 2, yPos + 3);

  // Centrar "NO"
  var noText = "NO";
  var noTW = doc.getTextWidth(noText);
  doc.text(noText, xNo + (widthNo - noTW) / 2, yPos + 3);

  // Centrar "Puntaje"
  var puntText = "Puntaje";
  var puntTW = doc.getTextWidth(puntText);
  doc.text(puntText, xPunt + (widthPunt - puntTW) / 2, yPos + 3);

  yPos += filaAlturaCage;

  // Dibujar filas de datos para TEST CAGE
  datosFinales.cageTest.forEach((item, index) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaCage);
    doc.line(xNum, yPos, xNum, yPos + filaAlturaCage);
    doc.line(xPreg, yPos, xPreg, yPos + filaAlturaCage);
    doc.line(xSi, yPos, xSi, yPos + filaAlturaCage);
    doc.line(xNo, yPos, xNo, yPos + filaAlturaCage);
    doc.line(xPunt, yPos, xPunt, yPos + filaAlturaCage);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaCage);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAlturaCage, tablaInicioX + tablaAncho, yPos + filaAlturaCage);

    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);

    // Centrar número de la columna #
    const numeroTexto = (index + 1).toString();
    const anchoNumero = doc.getTextWidth(numeroTexto);
    const colNumAncho = xPreg - xNum;
    doc.text(numeroTexto, xNum + (colNumAncho - anchoNumero) / 2, yPos + 3);
    dibujarTextoConSaltoLinea(item.pregunta, xPreg + 2, yPos + 3, colPregAncho - 4);

    // Marcar X en SI o NO (centradas)
    if (item.si) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      const textoX = "X";
      const anchoX = doc.getTextWidth(textoX);
      doc.text(textoX, xSi + (colSiAncho - anchoX) / 2, yPos + 3);
    }
    if (item.no) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      const textoX = "X";
      const anchoX = doc.getTextWidth(textoX);
      doc.text(textoX, xNo + (colNoAncho - anchoX) / 2, yPos + 3);
    }

    // puntaje centrado
    if (item.puntaje > 0) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      const textoPuntaje = item.puntaje.toString();
      const anchoPuntaje = doc.getTextWidth(textoPuntaje);
      const colPuntajeAncho = (tablaInicioX + tablaAncho) - xPunt;
      doc.text(textoPuntaje, xPunt + (colPuntajeAncho - anchoPuntaje) / 2, yPos + 3);
    }

    yPos += filaAlturaCage;
  });

  // === SECCIÓN 7: ANAMNESIS ===
  yPos = dibujarHeaderSeccion("7. ANAMNESIS", yPos, filaAltura);

  // Fila de datos de anamnesis con altura de 15mm
  const filaAlturaAnamnesis = 15;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAnamnesis);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAnamnesis);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaAnamnesis, tablaInicioX + tablaAncho, yPos + filaAlturaAnamnesis);

  // Contenido de anamnesis
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(formatearTextoGramatical(data.anamnesis_txtanamnesis), tablaInicioX + 2, yPos + 4, tablaAncho - 4);

  yPos += filaAlturaAnamnesis;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });

  // === PÁGINA 2 ===
  doc.addPage();
  numeroPagina = 2;

  // Dibujar header para página 2
  await drawHeader(numeroPagina);

  // Resetear posición Y para página 2
  yPos = 40;

  // === SECCIÓN 8: EXAMEN FISICO ===
  yPos = dibujarHeaderSeccion("8. EXAMEN FISICO", yPos, filaAltura);

  // Crear tabla de examen físico con filas crecientes
  const colCategoriaAncho = 60; // Categoría
  const colDatosAncho = 140; // Datos

  // Dibujar filas de datos para examen físico con altura dinámica
  datosFinales.examenFisico.forEach((item) => {
    // Preparar datos formateados para cálculos
    const datosParaCalculo = (item.categoria === "SIGNOS VITALES" || item.categoria === "ANTROPOMETRIA")
      ? formatearDatosExamenFisico(item.datos)
      : formatearTextoGramatical(item.datos);
    // Calcular altura necesaria para el texto de datos
    const alturaTextoDatos = calcularAlturaTextoCreciente(doc, datosParaCalculo, colDatosAncho - 4, 8);
    const alturaFilaNecesaria = Math.max(5, alturaTextoDatos + 2); // Altura mínima de 5mm

    // Dibujar líneas de la fila con altura dinámica
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaNecesaria);
    doc.line(tablaInicioX + colCategoriaAncho, yPos, tablaInicioX + colCategoriaAncho, yPos + alturaFilaNecesaria);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaNecesaria);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaFilaNecesaria, tablaInicioX + tablaAncho, yPos + alturaFilaNecesaria);

    // Contenido de la fila
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(formatearTextoGramatical(item.categoria), tablaInicioX + 2, yPos + 3.5);

    doc.setFont("helvetica", "normal").setFontSize(8);
    // Usar datos ya formateados anteriormente
    dibujarTextoConSaltoLinea(datosParaCalculo, tablaInicioX + colCategoriaAncho + 2, yPos + 3.5, colDatosAncho - 4);

    yPos += alturaFilaNecesaria;
  });

  // Fila 199, 241, 255ste para OJOS
  doc.setFillColor(199, 241, 255); // Color 199, 241, 255ste
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido de la fila OJOS
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("OÍDOS:", tablaInicioX + 2, yPos + 3.5);

  yPos += filaAltura;

  // Fila para Motilidad con altura dinámica
  const motilidadData = data.motilidadOcular_txtmotilidadocular;
  const alturaMotilidad = motilidadData ? calcularAlturaTextoCreciente(doc, motilidadData, tablaAncho - 30, 8) : 0;
  const alturaFilaMotilidad = motilidadData ? Math.max(5, alturaMotilidad + 2) : filaAltura;

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaMotilidad);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaMotilidad);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaMotilidad, tablaInicioX + tablaAncho, yPos + alturaFilaMotilidad);

  // Contenido de la fila Motilidad
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("MOTILIDAD:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (motilidadData) {
    dibujarTextoConSaltoLinea(formatearTextoGramatical(motilidadData), tablaInicioX + 25, yPos + 3.5, tablaAncho - 30);
  }

  yPos += alturaFilaMotilidad;

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

  // Centrar "OBSERVACIONES"
  const textoObservaciones = "OBSERVACIONES";
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

  // Calcular altura dinámica para Visión de Cerca
  const observacionesCerca = formatearTextoGramatical(data.enfermedadesocularesoftalmo_e_oculares1 || "");
  const alturaObservacionesCerca = calcularAlturaTextoCreciente(doc, observacionesCerca, colObservacionesAncho - 4, 8);
  const alturaFilaCerca = Math.max(filaAlturaAgudeza, alturaObservacionesCerca + 2);

  // Dibujar fila de datos para Visión de Cerca
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaCerca);
  doc.line(xSinCorregir, yPos, xSinCorregir, yPos + alturaFilaCerca);
  doc.line(xCorregida, yPos, xCorregida, yPos + alturaFilaCerca);
  doc.line(xObservaciones, yPos, xObservaciones, yPos + alturaFilaCerca);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaCerca);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaCerca, tablaInicioX + tablaAncho, yPos + alturaFilaCerca);

  // Dibujar líneas verticales para dividir O.D y O.I en la fila de datos
  doc.line(mitadSinCorregir, yPos, mitadSinCorregir, yPos + alturaFilaCerca);
  doc.line(mitadCorregida, yPos, mitadCorregida, yPos + alturaFilaCerca);

  // Contenido de la fila Visión de Cerca
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Visión de Cerca :", xAgudeza + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Centrar datos O.D y O.I en SIN CORREGIR
  const odSinCorregir = data.visioncercasincorregirod_v_cerca_s_od || "";
  const oiSinCorregir = data.visioncercasincorregiroi_v_cerca_s_oi || "";
  const anchoOdSinCorregir = doc.getTextWidth(odSinCorregir);
  const anchoOiSinCorregir = doc.getTextWidth(oiSinCorregir);
  doc.text(odSinCorregir, xSinCorregir + (colSinCorregirAncho / 2 - anchoOdSinCorregir) / 2, yPos + 3.5);
  doc.text(oiSinCorregir, mitadSinCorregir + (colSinCorregirAncho / 2 - anchoOiSinCorregir) / 2, yPos + 3.5);

  // Centrar datos O.D y O.I en CORREGIDA
  const odCorregida = data.odcc_odcc || "";
  const oiCorregida = data.oicc_oicc || "";
  const anchoOdCorregida = doc.getTextWidth(odCorregida);
  const anchoOiCorregida = doc.getTextWidth(oiCorregida);
  doc.text(odCorregida, xCorregida + (colCorregidaAncho / 2 - anchoOdCorregida) / 2, yPos + 3.5);
  doc.text(oiCorregida, mitadCorregida + (colCorregidaAncho / 2 - anchoOiCorregida) / 2, yPos + 3.5);

  dibujarTextoConSaltoLinea(observacionesCerca, xObservaciones + 2, yPos + 3.5, colObservacionesAncho - 4);
  yPos += alturaFilaCerca;

  // Calcular altura dinámica para Visión de Lejos
  // Si tiene \n, solo tomar la primera parte (antes del salto de línea)
  const observacionesLejosRaw = data.enfermedadesocularesoftalmo_e_oculares || "";
  const observacionesLejos = formatearTextoGramatical(
    observacionesLejosRaw.includes('\n') 
      ? observacionesLejosRaw.split('\n')[0] 
      : observacionesLejosRaw
  );
  const alturaObservacionesLejos = calcularAlturaTextoCreciente(doc, observacionesLejos, colObservacionesAncho - 4, 8);
  const alturaFilaLejos = Math.max(filaAlturaAgudeza, alturaObservacionesLejos + 2);

  // Dibujar fila de datos para Visión de Lejos
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaLejos);
  doc.line(xSinCorregir, yPos, xSinCorregir, yPos + alturaFilaLejos);
  doc.line(xCorregida, yPos, xCorregida, yPos + alturaFilaLejos);
  doc.line(xObservaciones, yPos, xObservaciones, yPos + alturaFilaLejos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaLejos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaLejos, tablaInicioX + tablaAncho, yPos + alturaFilaLejos);

  // Dibujar líneas verticales para dividir O.D y O.I en la fila de datos
  doc.line(mitadSinCorregir, yPos, mitadSinCorregir, yPos + alturaFilaLejos);
  doc.line(mitadCorregida, yPos, mitadCorregida, yPos + alturaFilaLejos);

  // Contenido de la fila Visión de Lejos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Visión de Lejos :", xAgudeza + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Centrar datos O.D y O.I en SIN CORREGIR
  const odLejosSinCorregir = data.visionlejossincorregirod_v_lejos_s_od || "";
  const oiLejosSinCorregir = data.visionlejossincorregiroi_v_lejos_s_oi || "";
  const anchoOdLejosSinCorregir = doc.getTextWidth(odLejosSinCorregir);
  const anchoOiLejosSinCorregir = doc.getTextWidth(oiLejosSinCorregir);
  doc.text(odLejosSinCorregir, xSinCorregir + (colSinCorregirAncho / 2 - anchoOdLejosSinCorregir) / 2, yPos + 3.5);
  doc.text(oiLejosSinCorregir, mitadSinCorregir + (colSinCorregirAncho / 2 - anchoOiLejosSinCorregir) / 2, yPos + 3.5);

  // Centrar datos O.D y O.I en CORREGIDA
  const odLejosCorregida = data.odlc_odlc || "";
  const oiLejosCorregida = data.oilc_oilc || "";
  const anchoOdLejosCorregida = doc.getTextWidth(odLejosCorregida);
  const anchoOiLejosCorregida = doc.getTextWidth(oiLejosCorregida);
  doc.text(odLejosCorregida, xCorregida + (colCorregidaAncho / 2 - anchoOdLejosCorregida) / 2, yPos + 3.5);
  doc.text(oiLejosCorregida, mitadCorregida + (colCorregidaAncho / 2 - anchoOiLejosCorregida) / 2, yPos + 3.5);

  dibujarTextoConSaltoLinea(observacionesLejos, xObservaciones + 2, yPos + 3.5, colObservacionesAncho - 4);
  yPos += alturaFilaLejos;

  // Dibujar fila de datos para Visión Crómatica (una sola fila sin divisiones)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaAgudeza, tablaInicioX + tablaAncho, yPos + filaAlturaAgudeza);

  // Contenido de la fila Visión Crómatica
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Visión Crómatica :", xAgudeza + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.vc_vc, xAgudeza + 30, yPos + 3.5);

  yPos += filaAlturaAgudeza;

  // === TABLA DE EXAMEN FÍSICO DETALLADO ===
  const filaAlturaExamenDetallado = 5;
  const colSistemaAncho = 60; // SISTEMA
  const colHallazgosAncho = 140; // HALLAZGOS

  // Dibujar fila para OÍDOS con altura dinámica
  const odData = data.otoscopiaOd_txtotoscopiaod;
  const oiData = data.otoscopiaOi_txtotoscopiaoi;
  // Preparar texto con divisiones para cálculo de altura
  const textoOidosCompleto = `OTOSCOPIA  |  O.D: ${odData || ''}  |  O.I: ${oiData || ''}`;
  const alturaOjos = (odData || oiData) ? calcularAlturaTextoCreciente(doc, formatearTextoGramatical(textoOidosCompleto), colHallazgosAncho - 4, 8) : 0;
  const alturaFilaOjos = (odData || oiData) ? Math.max(5, alturaOjos + 2) : filaAlturaExamenDetallado;

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaOjos);
  doc.line(tablaInicioX + colSistemaAncho, yPos, tablaInicioX + colSistemaAncho, yPos + alturaFilaOjos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaOjos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaOjos, tablaInicioX + tablaAncho, yPos + alturaFilaOjos);

  // Contenido de la fila OÍDOS
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("OÍDOS:", tablaInicioX + 2, yPos + 3.5);

  // Dibujar cada parte con su formato correspondiente
  if (odData || oiData) {
    let xActual = tablaInicioX + colSistemaAncho + 2;
    let yActual = yPos + 3.5;

    // OTOSCOPIA en negrita
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("OTOSCOPIA", xActual, yActual);
    xActual += doc.getTextWidth("OTOSCOPIA") + 3;

    // División
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("|", xActual, yActual);
    xActual += doc.getTextWidth("|") + 3;

    // O.D: en negrita
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("O.D:", xActual, yActual);
    xActual += doc.getTextWidth("O.D:") + 2;

    // Datos O.D en normal (con posible salto de línea)
    doc.setFont("helvetica", "normal").setFontSize(8);
    const odTexto = formatearTextoGramatical(odData || '');
    const anchoDisponibleOD = colHallazgosAncho - (xActual - tablaInicioX - colSistemaAncho) - 30; // Reservar espacio para O.I
    const lineasOD = doc.splitTextToSize(odTexto, Math.max(anchoDisponibleOD, 30));
    let yODActual = yActual;
    lineasOD.forEach((linea, index) => {
      doc.text(linea, xActual, yODActual);
      if (index < lineasOD.length - 1) {
        yODActual += doc.internal.getFontSize() * 0.35;
      }
    });

    // Guardar Y inicial para alinear O.I con la primera línea
    const yOIInicial = yPos + 3.5;

    // Calcular posición X para O.I (aproximadamente mitad)
    xActual = tablaInicioX + colSistemaAncho + colHallazgosAncho / 2;

    // División (alinear con primera línea de O.D)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("|", xActual, yOIInicial);
    xActual += doc.getTextWidth("|") + 3;

    // O.I: en negrita (alinear con primera línea de O.D)
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("O.I:", xActual, yOIInicial);
    xActual += doc.getTextWidth("O.I:") + 2;

    // Datos O.I en normal (con posible salto de línea)
    doc.setFont("helvetica", "normal").setFontSize(8);
    const oiTexto = formatearTextoGramatical(oiData || '');
    const anchoDisponibleOI = colHallazgosAncho - (xActual - tablaInicioX - colSistemaAncho) - 4;
    dibujarTextoConSaltoLinea(oiTexto, xActual, yOIInicial, Math.max(anchoDisponibleOI, 30));
  }

  yPos += alturaFilaOjos;

  // Dibujar fila para NARIZ con altura dinámica
  const narizData = data.nariz_txtnariz;
  const alturaNariz = narizData ? calcularAlturaTextoCreciente(doc, formatearTextoGramatical(narizData), colHallazgosAncho - 4, 8) : 0;
  const alturaFilaNariz = narizData ? Math.max(5, alturaNariz + 2) : filaAlturaExamenDetallado;

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaNariz);
  doc.line(tablaInicioX + colSistemaAncho, yPos, tablaInicioX + colSistemaAncho, yPos + alturaFilaNariz);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaNariz);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaNariz, tablaInicioX + tablaAncho, yPos + alturaFilaNariz);

  // Contenido de la fila NARIZ
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("NARIZ:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (narizData) {
    dibujarTextoConSaltoLinea(formatearTextoGramatical(narizData), tablaInicioX + colSistemaAncho + 2, yPos + 3.5, colHallazgosAncho - 4);
  }

  yPos += alturaFilaNariz;

  // Dibujar fila para AP. RESPIRATORIO con altura dinámica
  const respiratorioData = data.apRespiratorio_txtaprespiratorio;
  const alturaRespiratorio = respiratorioData ? calcularAlturaTextoCreciente(doc, formatearTextoGramatical(respiratorioData), colHallazgosAncho - 4, 8) : 0;
  const alturaFilaRespiratorio = respiratorioData ? Math.max(5, alturaRespiratorio + 2) : filaAlturaExamenDetallado;

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaRespiratorio);
  doc.line(tablaInicioX + colSistemaAncho, yPos, tablaInicioX + colSistemaAncho, yPos + alturaFilaRespiratorio);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaRespiratorio);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaRespiratorio, tablaInicioX + tablaAncho, yPos + alturaFilaRespiratorio);

  // Contenido de la fila AP. RESPIRATORIO
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("AP. RESPIRATORIO:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (respiratorioData) {
    dibujarTextoConSaltoLinea(formatearTextoGramatical(respiratorioData), tablaInicioX + colSistemaAncho + 2, yPos + 3.5, colHallazgosAncho - 4);
  }

  yPos += alturaFilaRespiratorio;

  // Dibujar fila para AP. CARDIOVASCULAR con altura dinámica
  const cardiovascularData = data.apCardiovascular_txtapcardiovascuar;
  const alturaCardiovascular = cardiovascularData ? calcularAlturaTextoCreciente(doc, formatearTextoGramatical(cardiovascularData), colHallazgosAncho - 4, 8) : 0;
  const alturaFilaCardiovascular = cardiovascularData ? Math.max(5, alturaCardiovascular + 2) : filaAlturaExamenDetallado;

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaCardiovascular);
  doc.line(tablaInicioX + colSistemaAncho, yPos, tablaInicioX + colSistemaAncho, yPos + alturaFilaCardiovascular);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaCardiovascular);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaCardiovascular, tablaInicioX + tablaAncho, yPos + alturaFilaCardiovascular);

  // Contenido de la fila AP. CARDIOVASCULAR
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("AP. CARDIOVASCULAR:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (cardiovascularData) {
    dibujarTextoConSaltoLinea(formatearTextoGramatical(cardiovascularData), tablaInicioX + colSistemaAncho + 2, yPos + 3.5, colHallazgosAncho - 4);
  }

  yPos += alturaFilaCardiovascular;

  // Dibujar fila para ABDOMEN con altura dinámica
  const abdomenData = data.abdomen_txtabdomen;
  const alturaAbdomen = abdomenData ? calcularAlturaTextoCreciente(doc, formatearTextoGramatical(abdomenData), colHallazgosAncho - 4, 8) : 0;
  const alturaFilaAbdomen = abdomenData ? Math.max(5, alturaAbdomen + 2) : filaAlturaExamenDetallado;

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaAbdomen);
  doc.line(tablaInicioX + colSistemaAncho, yPos, tablaInicioX + colSistemaAncho, yPos + alturaFilaAbdomen);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaAbdomen);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaAbdomen, tablaInicioX + tablaAncho, yPos + alturaFilaAbdomen);

  // Contenido de la fila ABDOMEN
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("ABDOMEN:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (abdomenData) {
    dibujarTextoConSaltoLinea(formatearTextoGramatical(abdomenData), tablaInicioX + colSistemaAncho + 2, yPos + 3.5, colHallazgosAncho - 4);
  }

  yPos += alturaFilaAbdomen;

  // Dibujar fila para MUSCULO ESQUELETICO con altura dinámica
  const musculoEsqueleticoData = data.musculoEsqueletico_txtmusculoesqueletico;
  const alturaMusculoEsqueletico = musculoEsqueleticoData ? calcularAlturaTextoCreciente(doc, musculoEsqueleticoData, colHallazgosAncho - 4, 8) : 0;
  const alturaFilaMusculoEsqueletico = musculoEsqueleticoData ? Math.max(5, alturaMusculoEsqueletico + 2) : filaAlturaExamenDetallado;

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaMusculoEsqueletico);
  doc.line(tablaInicioX + colSistemaAncho, yPos, tablaInicioX + colSistemaAncho, yPos + alturaFilaMusculoEsqueletico);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaMusculoEsqueletico);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaMusculoEsqueletico, tablaInicioX + tablaAncho, yPos + alturaFilaMusculoEsqueletico);

  // Contenido de la fila MUSCULO ESQUELETICO
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("MUSCULO ESQUELETICO:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (musculoEsqueleticoData) {
    dibujarTextoConSaltoLinea(formatearTextoGramatical(musculoEsqueleticoData), tablaInicioX + colSistemaAncho + 2, yPos + 3.5, colHallazgosAncho - 4);
  }

  yPos += alturaFilaMusculoEsqueletico;

  // Dibujar fila para COLUMNA con altura dinámica
  const columnaData = data.columna_txtcolumna;
  const alturaColumna = columnaData ? calcularAlturaTextoCreciente(doc, columnaData, colHallazgosAncho - 4, 8) : 0;
  const alturaFilaColumna = columnaData ? Math.max(5, alturaColumna + 2) : filaAlturaExamenDetallado;

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaColumna);
  doc.line(tablaInicioX + colSistemaAncho, yPos, tablaInicioX + colSistemaAncho, yPos + alturaFilaColumna);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaColumna);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaColumna, tablaInicioX + tablaAncho, yPos + alturaFilaColumna);

  // Contenido de la fila COLUMNA
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("COLUMNA:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (columnaData) {
    dibujarTextoConSaltoLinea(formatearTextoGramatical(columnaData), tablaInicioX + colSistemaAncho + 2, yPos + 3.5, colHallazgosAncho - 4);
  }

  yPos += alturaFilaColumna;

  // === SECCIÓN NEUROLÓGICO ===
  // Fila para el título NEUROLÓGICO (color 199, 241, 255ste)
  doc.setFillColor(199, 241, 255); // Color 199, 241, 255ste
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("NEUROLÓGICO", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Fila para REFLEJOS
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido de la fila REFLEJOS
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("REFLEJOS:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const reflejosData = data.reflejos_txtreflejos;
  doc.text(formatearTextoGramatical(reflejosData), tablaInicioX + 25, yPos + 3.5);

  yPos += filaAltura;

  // === TABLA DE COORDINACIÓN - EQUILIBRIO - MARCHA ===
  const filaAlturaNeurologico = 4;
  const colPruebasAncho = 100; // PRUEBAS
  const colNegativoAncho = 50; // NEGATIVO

  // Posiciones de columnas
  let xPruebas = tablaInicioX;
  let xNegativo = xPruebas + colPruebasAncho;
  let xPositivo = xNegativo + colNegativoAncho;

  // Dibujar header de la tabla neurológica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaNeurologico);
  doc.line(xNegativo, yPos, xNegativo, yPos + filaAlturaNeurologico);
  doc.line(xPositivo, yPos, xPositivo, yPos + filaAlturaNeurologico);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaNeurologico);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaNeurologico, tablaInicioX + tablaAncho, yPos + filaAlturaNeurologico);

  // Contenido del header
  doc.setFont("helvetica", "bold").setFontSize(8);

  // Centrar "COORDINACION - EQUILIBRIO - MARCHA"
  const textoCoordinacion = "COORDINACION - EQUILIBRIO - MARCHA";
  const anchoCoordinacion = doc.getTextWidth(textoCoordinacion);
  const colPruebasNeurologicasAncho = xNegativo - xPruebas;
  doc.text(textoCoordinacion, xPruebas + (colPruebasNeurologicasAncho - anchoCoordinacion) / 2, yPos + 3);

  // Centrar "NEGATIVO"
  const textoNegativo = "NEGATIVO";
  const anchoNegativo = doc.getTextWidth(textoNegativo);
  const colNegativoNeurologicasAncho = xPositivo - xNegativo;
  doc.text(textoNegativo, xNegativo + (colNegativoNeurologicasAncho - anchoNegativo) / 2, yPos + 3);

  // Centrar "POSITIVO"
  const textoPositivo = "POSITIVO";
  const anchoPositivo = doc.getTextWidth(textoPositivo);
  const colPositivoNeurologicasAncho = (tablaInicioX + tablaAncho) - xPositivo;
  doc.text(textoPositivo, xPositivo + (colPositivoNeurologicasAncho - anchoPositivo) / 2, yPos + 3);
  yPos += filaAlturaNeurologico;

  // Lista de pruebas neurológicas con datos reales
  const pruebasNeurologicas = [
    {
      nombre: "DEDO-NARIZ:",
      negativo: data.dedoNarizNegativo_chkneuro_neg1,
      positivo: data.dedoNarizPositivo_chkneuro_pos1
    },
    {
      nombre: "INDICE DE BARANY:",
      negativo: data.indiceBaranyNegativo_chkneuro_neg2,
      positivo: data.indiceBaranyPositivo_chkneuro_pos2
    },
    {
      nombre: "DIADOCOCINESIA:",
      negativo: data.diadococinesiaNegativo_chkneuro_neg3,
      positivo: data.diadococinesiaPositivo_chkneuro_pos3
    },
    {
      nombre: "ROMBERG",
      negativo: data.rombergSimpleNegativo_chkneuro_neg4,
      positivo: data.rombergSimplePositivo_chkneuro_pos4
    },
    {
      nombre: "ROMBERG SENSIBILIZADO:",
      negativo: data.rombergSensibilizadoNegativo_chkneuro_neg5,
      positivo: data.rombergSensibilizadoPositivo_chkneuro_pos5
    },
    {
      nombre: "MARCHA EN TANDEM:",
      negativo: data.marchaTandemNegativo_chkneuro_neg6,
      positivo: data.marchaTandemPositivo_chkneuro_pos6
    },
    {
      nombre: "UNTERBERG:",
      negativo: data.unterbergNegativo_chkneuro_neg7,
      positivo: data.unterbergPositivo_chkneuro_pos7
    },
    {
      nombre: "BABINSKI - WEIL:",
      negativo: data.babinskiNegativo_chkneuro_neg8,
      positivo: data.babinskiPositivo_chkneuro_pos8
    },
    {
      nombre: "DIX - HALLPIKE:",
      negativo: data.dixNegativo_chkneuro_neg9,
      positivo: data.dixPositivo_chkneuro_pos9
    },
    {
      nombre: "MARCHA:",
      negativo: data.marchaNegativo_chkneuro_neg10,
      positivo: data.marchaPositivo_chkneuro_pos10
    }
  ];

  // Dibujar filas de datos para pruebas neurológicas
  pruebasNeurologicas.forEach((prueba) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaNeurologico);
    doc.line(xNegativo, yPos, xNegativo, yPos + filaAlturaNeurologico);
    doc.line(xPositivo, yPos, xPositivo, yPos + filaAlturaNeurologico);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaNeurologico);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAlturaNeurologico, tablaInicioX + tablaAncho, yPos + filaAlturaNeurologico);

    // Contenido de la fila
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(formatearTextoGramatical(prueba.nombre), xPruebas + 2, yPos + 3);

    // Marcar X según el resultado - centrada
    doc.setFont("helvetica", "normal").setFontSize(10);
    const textoX = "X";
    const anchoX = doc.getTextWidth(textoX);

    if (prueba.negativo) {
      doc.text(textoX, xNegativo + (colNegativoNeurologicasAncho - anchoX) / 2, yPos + 3);
    }
    if (prueba.positivo) {
      doc.text(textoX, xPositivo + (colPositivoNeurologicasAncho - anchoX) / 2, yPos + 3);
    }

    yPos += filaAlturaNeurologico;
  });

  // === SECCIÓN EXAMENES COMPLEMENTARIOS ===
  // Fila para el título AUDIOMETRÍA (color 199, 241, 255ste)
  doc.setFillColor(199, 241, 255); // Color 199, 241, 255ste
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("AUDIOMETRÍA", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // === TABLA DE AUDIOMETRÍA ===
  const filaAlturaAudiometria = 4.5;
  const colOidoAncho = 20; // OD/OI
  const colFrecuenciaAncho = 25; // Cada frecuencia

  // Posiciones de columnas
  let xOido = tablaInicioX;
  let x500 = xOido + colOidoAncho;
  let x1000 = x500 + colFrecuenciaAncho;
  let x2000 = x1000 + colFrecuenciaAncho;
  let x3000 = x2000 + colFrecuenciaAncho;
  let x4000 = x3000 + colFrecuenciaAncho;
  let x6000 = x4000 + colFrecuenciaAncho;
  let x8000 = x6000 + colFrecuenciaAncho;

  // Dibujar header de frecuencias
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAudiometria);
  doc.line(x500, yPos, x500, yPos + filaAlturaAudiometria);
  doc.line(x1000, yPos, x1000, yPos + filaAlturaAudiometria);
  doc.line(x2000, yPos, x2000, yPos + filaAlturaAudiometria);
  doc.line(x3000, yPos, x3000, yPos + filaAlturaAudiometria);
  doc.line(x4000, yPos, x4000, yPos + filaAlturaAudiometria);
  doc.line(x6000, yPos, x6000, yPos + filaAlturaAudiometria);
  doc.line(x8000, yPos, x8000, yPos + filaAlturaAudiometria);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAudiometria);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaAudiometria, tablaInicioX + tablaAncho, yPos + filaAlturaAudiometria);

  // Contenido del header de frecuencias (centrados)
  doc.setFont("helvetica", "bold").setFontSize(8);

  // Centrar cada frecuencia en su columna
  const frecuencias = ["500", "1000", "2000", "3000", "4000", "6000", "8000"];
  const posicionesX = [x500, x1000, x2000, x3000, x4000, x6000, x8000];

  frecuencias.forEach((freq, index) => {
    const anchoTexto = doc.getTextWidth(freq);
    const anchoColumna = colFrecuenciaAncho;
    doc.text(freq, posicionesX[index] + (anchoColumna - anchoTexto) / 2, yPos + 3);
  });
  yPos += filaAlturaAudiometria;

  // Dibujar fila para OD
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAudiometria);
  doc.line(x500, yPos, x500, yPos + filaAlturaAudiometria);
  doc.line(x1000, yPos, x1000, yPos + filaAlturaAudiometria);
  doc.line(x2000, yPos, x2000, yPos + filaAlturaAudiometria);
  doc.line(x3000, yPos, x3000, yPos + filaAlturaAudiometria);
  doc.line(x4000, yPos, x4000, yPos + filaAlturaAudiometria);
  doc.line(x6000, yPos, x6000, yPos + filaAlturaAudiometria);
  doc.line(x8000, yPos, x8000, yPos + filaAlturaAudiometria);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAudiometria);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaAudiometria, tablaInicioX + tablaAncho, yPos + filaAlturaAudiometria);

  // Contenido fila OD
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("OD", xOido + 2, yPos + 3);

  // Valores de audiometría para OD (oído derecho) - centrados
  doc.setFont("helvetica", "normal").setFontSize(8);

  const valoresOD = [
    data.oidoDerecho500Audiometria_o_d_500 || "",
    data.oidoDerecho1000Audiometria_o_d_1000 || "",
    data.oidoDerecho2000Audiometria_o_d_2000 || "",
    data.oidoDerecho3000Audiometria_o_d_3000 || "",
    data.oidoDerecho4000Audiometria_o_d_4000 || "",
    data.oidoDerecho6000Audiometria_o_d_6000 || "",
    data.oidoDerecho8000Audiometria_o_d_8000 || ""
  ];

  valoresOD.forEach((valor, index) => {
    const valorFormateado = formatearTextoGramatical(valor);
    const anchoTexto = doc.getTextWidth(valorFormateado);
    const anchoColumna = colFrecuenciaAncho;
    doc.text(valorFormateado, posicionesX[index] + (anchoColumna - anchoTexto) / 2, yPos + 3);
  });

  yPos += filaAlturaAudiometria;

  // Dibujar fila para OI
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAudiometria);
  doc.line(x500, yPos, x500, yPos + filaAlturaAudiometria);
  doc.line(x1000, yPos, x1000, yPos + filaAlturaAudiometria);
  doc.line(x2000, yPos, x2000, yPos + filaAlturaAudiometria);
  doc.line(x3000, yPos, x3000, yPos + filaAlturaAudiometria);
  doc.line(x4000, yPos, x4000, yPos + filaAlturaAudiometria);
  doc.line(x6000, yPos, x6000, yPos + filaAlturaAudiometria);
  doc.line(x8000, yPos, x8000, yPos + filaAlturaAudiometria);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAudiometria);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaAudiometria, tablaInicioX + tablaAncho, yPos + filaAlturaAudiometria);

  // Contenido fila OI
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("OI", xOido + 2, yPos + 3);

  // Valores de audiometría para OI (oído izquierdo) - centrados
  doc.setFont("helvetica", "normal").setFontSize(8);

  const valoresOI = [
    data.oidoIzquierdo500Audiometria_o_i_500 || "",
    data.oidoIzquierdo1000Audiometria_o_i_1000 || "",
    data.oidoIzquierdo2000Audiometria_o_i_2000 || "",
    data.oidoIzquierdo3000Audiometria_o_i_3000 || "",
    data.oidoIzquierdo4000Audiometria_o_i_4000 || "",
    data.oidoIzquierdo6000Audiometria_o_i_6000 || "",
    data.oidoIzquierdo8000Audiometria_o_i_8000 || ""
  ];

  valoresOI.forEach((valor, index) => {
    const valorFormateado = formatearTextoGramatical(valor);
    const anchoTexto = doc.getTextWidth(valorFormateado);
    const anchoColumna = colFrecuenciaAncho;
    doc.text(valorFormateado, posicionesX[index] + (anchoColumna - anchoTexto) / 2, yPos + 3);
  });

  yPos += filaAlturaAudiometria;

  // Fila de diagnóstico audiométrico
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAudiometria);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAudiometria);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaAudiometria, tablaInicioX + tablaAncho, yPos + filaAlturaAudiometria);

  // Contenido de la fila de diagnóstico audiométrico
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DIAGNÓSTICO AUDIOMÉTRICO:", tablaInicioX + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.diagnosticoAudiometricoCompleto_diagnostico || "", tablaInicioX + 60, yPos + 3);

  yPos += filaAlturaAudiometria;

  // === SECCIÓN LABORATORIO ===
  // Fila para el título LABORATORIO (color 199, 241, 255ste)
  doc.setFillColor(199, 241, 255); // Color 199, 241, 255ste
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("LABORATORIO", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Primera fila: HEMATOCRITO, HEMOGLOBINA, GLUCOSA (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 66, yPos, tablaInicioX + 66, yPos + filaAltura); // División 1
  doc.line(tablaInicioX + 132, yPos, tablaInicioX + 132, yPos + filaAltura); // División 2
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido primera fila
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("HEMATOCRITO:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.hematocritoLaboratorioClinico_txthematocrito + " %", tablaInicioX + 25, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("HEMOGLOBINA:", tablaInicioX + 68, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.hemoglobinaLaboratorioClinico_txthemoglobina + " g/dl", tablaInicioX + 95, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("GLUCOSA:", tablaInicioX + 134, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.glucosaLaboratorioClinico_txtglucosabio + " mg/dl", tablaInicioX + 155, yPos + 3.5);
  yPos += filaAltura;

  // Fila 199, 241, 255ste: PERFIL LIPIDICO
  doc.setFillColor(199, 241, 255); // Color 199, 241, 255ste
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("PERFIL LIPIDICO", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Tercera fila: Colesterol, Triglicéridos, HDL-col, VLDL, LDL-col (5 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 40, yPos, tablaInicioX + 40, yPos + filaAltura); // División 1
  doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura); // División 2
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura); // División 3
  doc.line(tablaInicioX + 160, yPos, tablaInicioX + 160, yPos + filaAltura); // División 4
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido tercera fila
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Coles. Total:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.colesterolAnalisisBioquimico_txtcolesterol + " mg/dl", tablaInicioX + 20, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Triglicéridos:", tablaInicioX + 42, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.trigliseridosAnalisisBioquimico_txttrigliseridos + " mg/dl", tablaInicioX + 61, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Coles. HDL:", tablaInicioX + 82, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.hdlcolesterolAnalisisBioquimico_txthdlcolesterol + " mg/dl", tablaInicioX + 100, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Coles. VLDL:", tablaInicioX + 122, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.vldlcolesterolAnalisisBioquimico_txtvldlcolesterol + " mg/dl", tablaInicioX + 140, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Coles. LDL:", tablaInicioX + 162, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.ldlcolesterolAnalisisBioquimico_txtldlcolesterol + " mg/dl", tablaInicioX + 180, yPos + 3.5);
  yPos += filaAltura;


  // === FOOTER PÁGINA 2 ===
  footerTR(doc, { footerOffsetY: 8 });

  // === PÁGINA 3 ===
  doc.addPage();
  numeroPagina = 3;

  // Dibujar header para página 3
  await drawHeader(numeroPagina);

  // Resetear posición Y para página 3
  yPos = 40;

  // === TEST DE EPWORTH ===
  // Fila para el título TEST DE EPWORTH (color 199, 241, 255ste)
  doc.setFillColor(199, 241, 255); // Color 199, 241, 255ste
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("TEST DE EPWORTH:", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Fila creciente para TEST DE EPWORTH (altura inicial 10mm)
  yPos = dibujarTextoEnFilaCreciente(doc, formatearTextoGramatical(data.tesEpworth_txttesepworth), tablaInicioX, tablaAncho, yPos, 10, 4, 8);

  // === DIAGNÓSTICO ===
  // Fila para el título DIAGNÓSTICO (color 199, 241, 255ste)
  doc.setFillColor(199, 241, 255); // Color 199, 241, 255ste
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DIAGNÓSTICO:", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Fila creciente: DIAGNÓSTICO (altura inicial 10mm)
  yPos = dibujarTextoEnFilaCreciente(doc, formatearTextoGramatical(data.diagnostico_txtdiagnostico), tablaInicioX, tablaAncho, yPos, 10, 4, 8);

  // === SECCIÓN OTROS ===
  // Fila 199, 241, 255ste: Otros
  doc.setFillColor(199, 241, 255); // Color 199, 241, 255ste
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Otros:", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Fila creciente: Otros (altura inicial 10mm)
  yPos = dibujarTextoEnFilaCreciente(doc, formatearTextoGramatical(data.otrosExamenesLaboratorio_txtotrosexamlab), tablaInicioX, tablaAncho, yPos, 10, 4, 8);

  // Fila: CONCLUSIONES / RECOMENDACIONES / RESTRICCIONES (color gris)
  doc.setFillColor(196, 196, 196); // Color gris
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("9. CONCLUSIONES / RECOMENDACIONES / RESTRICCIONES:", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Fila creciente: CONCLUSIONES / RECOMENDACIONES / RESTRICCIONES
  yPos = dibujarTextoEnFilaCreciente(doc, formatearTextoGramatical(data.conclusiones_atxtobservaciones), tablaInicioX, tablaAncho, yPos, 90, 4, 8);

  // === FILA CONDICIÓN (una sola fila) ===
  const alturaFilaCondicion = 5;
  const colCondicionAncho = 50; // CONDICIÓN
  const colAptoAncho = 30; // APTO
  const colNoAptoAncho = 30; // NO APTO

  // Posiciones de columnas
  let xCondicion = tablaInicioX;
  let xApto = xCondicion + colCondicionAncho;
  let xNoApto = xApto + colAptoAncho;
  let xNoAptoTemporal = xNoApto + colNoAptoAncho;

  // Dibujar fila de condición (una sola fila)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaCondicion);
  doc.line(xApto, yPos, xApto, yPos + alturaFilaCondicion);
  doc.line(xNoApto, yPos, xNoApto, yPos + alturaFilaCondicion);
  doc.line(xNoAptoTemporal, yPos, xNoAptoTemporal, yPos + alturaFilaCondicion);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaCondicion);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaCondicion, tablaInicioX + tablaAncho, yPos + alturaFilaCondicion);

  // Contenido de la fila de condición
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("CONDICIÓN", xCondicion + 2, yPos + 3.5);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("APTO", xApto + 2, yPos + 3.5);
  if (data.apto_chk_apto) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", xApto + 15, yPos + 3.5);
  }

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NO APTO", xNoApto + 2, yPos + 3.5);
  if (data.noApto_chk_no_apto) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", xNoApto + 20, yPos + 3.5);
  }

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NO APTO TEMPORAL", xNoAptoTemporal + 2, yPos + 3.5);
  if (data.aptoRestriccion_chk_apto_r) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", xNoAptoTemporal + 30, yPos + 3.5);
  }

  yPos += alturaFilaCondicion;

  // === SECCIÓN DE DECLARACIÓN, FIRMA Y HUELLA DEL TRABAJADOR ===
  const yDeclaracion = yPos;
  const alturaSeccionDeclaracion = 30;

  // Dibujar las líneas de la sección de declaración (3 columnas)
  doc.line(tablaInicioX, yDeclaracion, tablaInicioX, yDeclaracion + alturaSeccionDeclaracion);
  doc.line(tablaInicioX + 60, yDeclaracion, tablaInicioX + 60, yDeclaracion + alturaSeccionDeclaracion);
  doc.line(tablaInicioX + 120, yDeclaracion, tablaInicioX + 120, yDeclaracion + alturaSeccionDeclaracion);
  doc.line(tablaInicioX + tablaAncho, yDeclaracion, tablaInicioX + tablaAncho, yDeclaracion + alturaSeccionDeclaracion);
  doc.line(tablaInicioX, yDeclaracion, tablaInicioX + tablaAncho, yDeclaracion);
  doc.line(tablaInicioX, yDeclaracion + alturaSeccionDeclaracion, tablaInicioX + tablaAncho, yDeclaracion + alturaSeccionDeclaracion);

  // === COLUMNA 1: DECLARACIÓN ===
  doc.setFont("helvetica", "normal").setFontSize(6);
  const textoDeclaracion = "Declaro que las respuestas son ciertas según mi leal saber y entender. En caso de ser requeridos, los resultados del examen médico pueden ser revelados, en términos generales, al departamento de salud Ocupacional de la compañía. Los resultados pueden ser enviados a mi médico particular de ser considerado necesario.";

  // Función para justificar texto
  const justificarTexto = (texto, x, y, anchoMaximo, interlineado) => {
    const lineas = doc.splitTextToSize(texto, anchoMaximo);
    let yActual = y;

    lineas.forEach((linea, index) => {
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
  const centroColumna2X = tablaInicioX + 60 + (60 / 2);

  // Agregar firma del trabajador (lado izquierdo)
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
      const x = centroColumna2X - 20;
      const y = firmaTrabajadorY;
      doc.addImage(firmaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del trabajador:", error);
    }
  }

  // Agregar huella del trabajador (lado derecho, vertical)
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
  doc.text("Firma y Huella del trabajador", centroColumna2X, yDeclaracion + 26, { align: "center" });

  // === COLUMNA 3: SELLO Y FIRMA DEL MÉDICO ===
  const firmaMedicoX = tablaInicioX + 125;
  const firmaMedicoY = yDeclaracion + 3;

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

  // === FOOTER PÁGINA 3 ===
  footerTR(doc, { footerOffsetY: 8 });

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