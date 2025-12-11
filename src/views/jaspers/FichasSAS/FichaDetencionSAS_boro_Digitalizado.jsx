import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { getSign } from '../../utils/helpers';

export default function B_FichaDetencionSAS2(data = {}) {

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const datosReales = {
    numeroHistoria: String(data.norden ?? ""),
    tipoExamen: String(data.nombreExamen ?? ""),
    apellidosNombres: String((data.apellidosPaciente ?? "") + " " + (data.nombresPaciente ?? "")).trim(),
    documentoIdentidad: String(data.dniPaciente ?? ""),
    genero: data.sexoPaciente === "M" ? "MASCULINO" : data.sexoPaciente === "F" ? "FEMENINO" : String(data.sexoPaciente ?? ""),
    edad: String(data.edadPaciente ?? ""),
    tipoLicencia: String(data.tipoLicencia_licencia_sas ?? ""),
    empresa: String(data.empresa ?? ""),
    contratista: String(data.contrata ?? ""),
    puestoTrabajo: String(data.puestoTrabajo ?? ""),
    trabajaNoche: Boolean(data.trabajaNocheSi_tbtrabajanochesi ?? false),
    diasTrabajo: String(data.diasTrabajo_txtdiastrabajo ?? "5"),
    diasDescanso: String(data.descanso_txtdescanso ?? "5"),
    anosTrabajoHorario: String(data.anosTrabajo_txtanostrabajo ?? "5"),
    fechaExamen: formatearFechaCorta(data.fechaSas_fecha_sas ?? ""),
    // Datos de color
    color: data.color || 1,
    codigoColor: data.codigoColor || "",
    textoColor: data.textoColor || "",
    // Datos adicionales para header
    numeroFicha: String(data.norden ?? ""),
    sede: data.sede || data.nombreSede || "",
    // Datos de checkboxes para SAS
    apneaSueno: {
      si: Boolean(data.apneaSi_rbapneasi ?? false),
      no: Boolean(data.apneaNo_rbapneano ?? false),
      aplica: false //revisar
    },
    hta: {
      si: Boolean(data.htaSi_rbhtasi ?? false),
      no: Boolean(data.htaNo_rbhtano ?? false),
      aplica: false //revisar
    },
    medicacionRiesgo: String(data.medicacionRiesgo_txtriesgo ?? ""),
    polisomnografia: {
      si: Boolean(data.polisomnografiaSi_rbpsgsi ?? false),
      no: Boolean(data.polisomnografiaNo_rbpsgno ?? false),
      fecha: formatearFechaCorta(data.fechaUltimaPolisomnografia_fechapsg ?? ""),
      aplica: false //revisar
    },
    choqueVehiculo: {
      enMina: {
        si: Boolean(data.enMinaSi_rbenminasi ?? false),
        no: Boolean(data.enMinaNo_rbenminano ?? false)
      },
      fueraMina: {
        si: Boolean(data.fueraMinaSi_rbfueraminasi ?? false),
        no: Boolean(data.fueraMinaNo_rbfueraminano ?? false)
      },
      aplica: false //revisar
    },
    // Detalle de choques
    detalleChoques: String(data.detalleChoques ?? ""), //revisar IMPORTANTE
    // Criterio 1
    criterio1: {
      cabeceoAccidente: Boolean(data.casoChoquePregunta1Si_chk1_sassi ?? false)
    },
    // Criterio 2 (2 o más es positivo)
    criterio2: {
      accidenteUltimas5Horas: Boolean(data.casoChoquePregunta2Si_chk2_sassi ?? false),
      ausenciaManiobraEvasiva: Boolean(data.casoChoquePregunta3Si_chk3_sassi ?? false),
      colisionFrontal: Boolean(data.casoChoquePregunta4Si_chk4_sassi ?? false),
      vehiculoInvadioCarril: Boolean(data.casoChoquePregunta5Si_chk5_sassi ?? false),
      conductorNoRecuerda: Boolean(data.casoChoquePregunta6Si_chk6_sassi ?? false),
      conductorTomoMedicacion: Boolean(data.casoChoquePregunta7Si_chk7_sassi ?? false),
      conductorHorasExtra: Boolean(data.casoChoquePregunta8Si_chk8_sassi ?? false)
    },
    // Clasificación de choques
    clasificacionChoques: {
      accidenteConfirmadoSomnolencia: Boolean(data.casoChoquePregunta9Si_chk9_sassi ?? false), //revisar
      accidenteAltaSospechaSomnolencia: Boolean(data.casoChoquePregunta10Si_chk10_sassi ?? false), //revisar
      accidenteEscasaEvidenciaSomnolencia: Boolean(data.casoChoquePregunta11Si_chk11_sassi ?? false), //revisar
      noDatosSuficientes: Boolean(data.casoChoquePregunta12Si_chk12_sassi ?? false), //revisar
      accidenteNoDebidoSomnolencia: Boolean(data.casoChoquePregunta13Si_chk13_sassi ?? false) //revisar
    },
    // Entrevista al paciente
    entrevistaPaciente: {
      parejaComentoRonca: Boolean(data.entrevistaPregunta1Si_chk1_esi ?? false), //revisar
      parejaComentoRuidosRespirar: Boolean(data.entrevistaPregunta2Si_chk2_esi ?? false), //revisar
      parejaComentoPausaRespiratoria: Boolean(data.entrevistaPregunta3Si_chk3_esi ?? false), //revisar
      masSueñoQueCompañeros: Boolean(data.entrevistaPregunta4Si_chk4_esi ?? false) //revisar
    },
    // Escala de Epworth
    escalaEpworth: {
      puntuacionTotal: Number(data.entrevistaPuntuacion_txtpuntuacion ?? 0)
    },
    // Datos de examen físico para página 2
    pesoPaciente: String(data.pesoTriaje ?? ""),
    tallaPaciente: String(data.tallaTriaje ?? ""),
    imcPaciente: String(data.imcTriaje ?? ""),
    circunferenciaCuello: String(data.perimetroCuelloTriaje ?? ""),
    circunferenciaVaronNormal: Boolean(data.examenFisicoVaronSi_chkvaronsi ?? false),
    circunferenciaMujerNormal: Boolean(data.examenFisicoMujerSi_chkmujersi ?? false),
    presionSistolica: String(data.sistolicaTriaje ?? ""),
    presionDiastolica: String(data.diastolicaTriaje ?? ""),
    htaNueva: (data.examenFisicoHtaNuevaSi_chkhtanuevasi === true) ? true : 
              (data.examenFisicoHtaNuevaNo_chkhtanuevano === true) ? false : false,
    // Grados de Mallampati
    mallampatiGradoI: Boolean(data.examenFisicoGradoI_chkgradoi ?? false),
    mallampatiGradoII: Boolean(data.examenFisicoGradoII_chkgradoii ?? false),
    mallampatiGradoIII: Boolean(data.examenFisicoGradoIII_chkgradoiii ?? false),
    mallampatiGradoIV: Boolean(data.examenFisicoGradoIV_chkgradoiiii ?? false),
    // Datos de conclusión de evaluación
    riesgoAlto: {
      criterioA: {
        si: Boolean(data.conclusionRequierePsgASi_chk1_psg_sia ?? false),
        no: Boolean(data.conclusionRequierePsgANo_chk1_psg_noa ?? false)
      },
      criterioB: {
        si: Boolean(data.conclusionRequierePsgBSi_chk1_psg_sib ?? false),
        no: Boolean(data.conclusionRequierePsgBNo_chk1_psg_nob ?? false)
      }
    },
    riesgoMedio: {
      criterioC: {
        si: Boolean(data.conclusionAptoCriterioCSi_chk1_apto_sic ?? false),
        no: Boolean(data.conclusionAptoCriterioCNo_chk1_apto_noc ?? false)
      },
      criterioD: {
        si: Boolean(data.conclusionAptoCriterioDSi_chk1_apto_sid ?? false),
        no: Boolean(data.conclusionAptoCriterioDNo_chk1_apto_nod ?? false),
        subcriterios: [
          { si: Boolean(data.conclusionAptoCriterioD1Si_chk1_apto_sid1 ?? false), no: Boolean(data.conclusionAptoCriterioD1No_chk1_apto_nod1 ?? false) },
          { si: Boolean(data.conclusionAptoCriterioD2Si_chk1_apto_sid2 ?? false), no: Boolean(data.conclusionAptoCriterioD2No_chk1_apto_nod2 ?? false) },
          { si: Boolean(data.conclusionAptoCriterioD3Si_chk1_apto_sid3 ?? false), no: Boolean(data.conclusionAptoCriterioD3No_chk1_apto_nod3 ?? false) },
          { si: Boolean(data.conclusionAptoCriterioD4Si_chk1_apto_sid4 ?? false), no: Boolean(data.conclusionAptoCriterioD4No_chk1_apto_nod4 ?? false) },
          { si: Boolean(data.conclusionAptoCriterioD5Si_chk1_apto_sid5 ?? false), no: Boolean(data.conclusionAptoCriterioD5No_chk1_apto_nod5 ?? false) },
          { si: Boolean(data.conclusionAptoCriterioD6Si_chk1_apto_sid6 ?? false), no: Boolean(data.conclusionAptoCriterioD6No_chk1_apto_nod6 ?? false) }
        ]
      },
      criterioE: {
        si: Boolean(data.conclusionAptoCriterioESi_chk1_apto_sie ?? false),
        no: Boolean(data.conclusionAptoCriterioENo_chk1_apto_noe ?? false)
      }
    },
    riesgoBajo: {
      si: Boolean(data.conclusionAptoBajoRiesgoSi_chkaptobajosi ?? false),
      no: Boolean(data.conclusionAptoBajoRiesgoNo_chkaptobajono ?? false)
    },
    // Observaciones/Recomendaciones
    observaciones: String(data.conclusionObservaciones_txtobservaciones ?? "")
  };

  console.log(datosReales)
  // Usar datos reales
  const datosFinales = datosReales;


  // Header reutilizable (igual que Aptitud_Agroindustrial.jsx)
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.text("FICHA DE DETECCIÓN DE SÍNDROME DE APNEA SUEÑO (S.A.S)", pageW / 2, 38, { align: "center" });

      // Subtítulo
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("(Conductores de maquinaria pesada, transporte de personal, transporte de materiales peligrosos)", pageW / 2, 43, { align: "center" });
    }

    // Número de Ficha y Página (alineación automática mejorada)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 50, 16);
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

  // Función para texto justificado
  const dibujarTextoJustificado = (texto, x, y, anchoMaximo) => {
    const fontSize = doc.internal.getFontSize();
    const palabras = texto.split(' ');
    let lineas = [];
    let lineaActual = '';

    // Dividir en líneas
    palabras.forEach(palabra => {
      const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);

      if (anchoTexto <= anchoMaximo) {
        lineaActual = textoPrueba;
      } else {
        if (lineaActual) {
          lineas.push(lineaActual);
          lineaActual = palabra;
        } else {
          lineas.push(palabra);
          lineaActual = '';
        }
      }
    });

    if (lineaActual) {
      lineas.push(lineaActual);
    }

    // Dibujar líneas justificadas
    let yPos = y;
    lineas.forEach((linea, index) => {
      if (index === lineas.length - 1) {
        // Última línea no se justifica
        doc.text(linea, x, yPos);
      } else {
        // Justificar línea
        const palabrasLinea = linea.split(' ');
        if (palabrasLinea.length > 1) {
          const anchoLinea = doc.getTextWidth(linea);
          const espacioExtra = anchoMaximo - anchoLinea;
          const espaciosEntrePalabras = espacioExtra / (palabrasLinea.length - 1);

          let xPos = x;
          palabrasLinea.forEach((palabra, i) => {
            doc.text(palabra, xPos, yPos);
            if (i < palabrasLinea.length - 1) {
              xPos += doc.getTextWidth(palabra + ' ') + espaciosEntrePalabras;
            }
          });
        } else {
          doc.text(linea, x, yPos);
        }
      }
      yPos += fontSize * 0.35;
    });

    return yPos;
  };

  // Función para calcular altura dinámica
  const calcularAlturaDinamica = (texto, anchoMaximo) => {
    doc.setFontSize(8);
    const palabras = texto.split(' ');
    let lineas = 1;
    let lineaActual = '';

    for (let palabra of palabras) {
      const textoPrueba = lineaActual + (lineaActual ? ' ' : '') + palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);

      if (anchoTexto > anchoMaximo) {
        if (lineaActual) {
          lineas++;
          lineaActual = palabra;
        } else {
          lineas++;
          lineaActual = '';
        }
      } else {
        lineaActual = textoPrueba;
      }
    }

    // Altura dinámica reducida: mínimo 1 fila, máximo según contenido con menos espacio
    return Math.max(filaAltura, lineas * 3.5 + 1.5); // 3mm por línea + 1mm de margen (reducido)
  };


  // Función para crear checkboxes con ancho fijo usando espacios
  const crearCheckboxFijo = (esSeleccionado, texto) => {
    const marca = esSeleccionado ? "X" : "   "; // Usar dos espacios para igualar el ancho de la X
    return `${texto} (${marca})`;
  };

  // Función para dibujar texto con criterio en negrita
  const dibujarTextoConCriterioNegrita = (texto, x, y, anchoMaximo) => {
    // Separar el criterio del resto del texto
    const match = texto.match(/^(Criterio [A-Z0-9]+:)(.*)$/);
    if (match) {
      const [, criterio, restoTexto] = match;

      // Dibujar criterio en negrita
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text(criterio, x, y);

      // Calcular posición para el resto del texto
      const anchoCriterio = doc.getTextWidth(criterio);
      const xResto = x + anchoCriterio;

      // Dibujar resto del texto en normal
      doc.setFont("helvetica", "normal").setFontSize(8);
      dibujarTextoConSaltoLinea(restoTexto.trim(), xResto, y, anchoMaximo - anchoCriterio);
    } else {
      // Si no coincide el patrón, dibujar texto normal
      doc.setFont("helvetica", "normal").setFontSize(8);
      dibujarTextoConSaltoLinea(texto, x, y, anchoMaximo);
    }
  };

  // === DIBUJAR HEADER ===
  drawHeader(numeroPagina);

  // === TABLA DE DATOS PERSONALES ===
  const tablaInicioX = 15;
  const tablaInicioY = 45; // Ajustado para dar espacio al subtítulo
  const tablaAncho = 180;
  let yPos = tablaInicioY;

  // Altura general para todas las filas (igual que Aptitud_Agroindustrial.jsx)
  const filaAltura = 5;

  // Primera fila: I.- FILIACION (fila completa)
  // Fondo gris solo para el header de sección
  doc.setFillColor(196, 196, 196); // Gris oscuro (igual que certificaciondeconduccion_Digitalizado.jsx)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Segunda fila: Apellidos y Nombres (fila completa)
  // Fondo blanco - no se aplica fondo
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Tercera fila: DNI, Género, Edad, Tipo de Licencia (4 columnas)
  // Fondo blanco - no se aplica fondo
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura); // Primera división
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura); // Segunda división
  doc.line(tablaInicioX + 132, yPos, tablaInicioX + 132, yPos + filaAltura); // Tercera división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Cuarta fila: Empresa (fila completa)
  // Fondo blanco - no se aplica fondo
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Quinta fila: Contratista (fila completa)
  // Fondo blanco - no se aplica fondo
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Sexta fila: Trabajo nocturno (4 columnas)
  // Fondo blanco para fila par (índice 5) - no se aplica fondo
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 40, yPos, tablaInicioX + 40, yPos + filaAltura); // Primera división
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura); // Segunda división
  doc.line(tablaInicioX + 132, yPos, tablaInicioX + 132, yPos + filaAltura); // Tercera división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Séptima fila: Años trabajando en dicho horario (2 columnas)
  // Fondo blanco - no se aplica fondo
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Octava fila: Puesto de Trabajo (fila completa)
  // Fondo blanco - no se aplica fondo
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Novena fila: II.- ANTECEDENTES PERSONALES (fila completa)
  // Fondo gris para el header de sección
  doc.setFillColor(196, 196, 196); // Gris oscuro (igual que certificaciondeconduccion_Digitalizado.jsx)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Novena fila: Apnea del sueño (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 40, yPos, tablaInicioX + 40, yPos + filaAltura); // Primera división
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura); // Segunda división
  doc.line(tablaInicioX + 132, yPos, tablaInicioX + 132, yPos + filaAltura); // Tercera división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Décima fila: HTA (4 columnas) - Divisiones independientes movidas 15 puntos a la izquierda
  const htaDiv1 = tablaInicioX + 15;  // 40 - 15 = 25
  const htaDiv2 = tablaInicioX + 40;  // 90 - 15 = 75
  const htaDiv3 = tablaInicioX + 80; // 132 - 15 = 117
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(htaDiv1, yPos, htaDiv1, yPos + filaAltura); // Primera división
  doc.line(htaDiv2, yPos, htaDiv2, yPos + filaAltura); // Segunda división
  doc.line(htaDiv3, yPos, htaDiv3, yPos + filaAltura); // Tercera división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Undécima fila: Polisomnografía (4 columnas con divisiones diferentes)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 63, yPos, tablaInicioX + 63, yPos + filaAltura); // Primera división (más ancha)
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura); // Segunda división
  doc.line(tablaInicioX + 140, yPos, tablaInicioX + 140, yPos + filaAltura); // Tercera división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Duodécima fila: Antecedente de Choque de vehículo (4 columnas con divisiones diferentes)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 63, yPos, tablaInicioX + 63, yPos + filaAltura); // Segunda división (más estrecha)
  doc.line(tablaInicioX + 140, yPos, tablaInicioX + 140, yPos + filaAltura); // Tercera división (más ancha)
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Decimotercera fila: Detalle de choques (fila completa con texto dinámico)
  // Calcular altura dinámica basada en el contenido
  const anchoDisponible = tablaAncho - 4; // Ancho disponible menos márgenes
  const textoDetalle = datosFinales.detalleChoques || "";

  // Calcular líneas necesarias
  doc.setFontSize(8);
  const palabras = textoDetalle.split(' ');
  let lineas = 1;
  let lineaActual = '';

  for (let palabra of palabras) {
    const textoPrueba = lineaActual + (lineaActual ? ' ' : '') + palabra;
    const anchoTexto = doc.getTextWidth(textoPrueba);

    if (anchoTexto > anchoDisponible) {
      if (lineaActual) {
        lineas++;
        lineaActual = palabra;
      } else {
        lineas++;
        lineaActual = '';
      }
    } else {
      lineaActual = textoPrueba;
    }
  }

  // Altura dinámica: mínimo 1 fila, máximo según contenido
  const alturaDetalle = Math.max(filaAltura, lineas * 4 + 2); // 4mm por línea + 2mm de margen

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaDetalle); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaDetalle); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaDetalle, tablaInicioX + tablaAncho, yPos + alturaDetalle); // Línea inferior
  yPos += alturaDetalle;

  // Decimocuarta fila: Nueva fila con pregunta y opciones SI/NO (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + filaAltura); // División para SI/NO
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + filaAltura); // División entre SI y NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Decimoquinta fila: Criterio 1 con opciones SI/NO (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + filaAltura); // División para SI/NO
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + filaAltura); // División entre SI y NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Decimosexta fila: Título Criterio 2 (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Decimoséptima fila: Accidente últimas 5 horas (3 columnas con altura dinámica)
  const textoCriterio2_1 = "Accidente ocurrido entre las últimas 5 horas de un turno nocturno o entre las 14 y 17 horas (tarde)";
  const alturaCriterio2_1 = calcularAlturaDinamica(textoCriterio2_1, 155);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaCriterio2_1); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + alturaCriterio2_1); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + alturaCriterio2_1); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaCriterio2_1); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaCriterio2_1, tablaInicioX + tablaAncho, yPos + alturaCriterio2_1); // Línea inferior
  yPos += alturaCriterio2_1;

  // Decimoctava fila: Ausencia de maniobra evasiva (3 columnas con altura dinámica)
  const textoCriterio2_2 = "AUSENCIA DE evidencia de maniobra evasiva del chofer para evitar la colisión";
  const alturaCriterio2_2 = calcularAlturaDinamica(textoCriterio2_2, 155);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaCriterio2_2); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + alturaCriterio2_2); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + alturaCriterio2_2); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaCriterio2_2); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaCriterio2_2, tablaInicioX + tablaAncho, yPos + alturaCriterio2_2); // Línea inferior
  yPos += alturaCriterio2_2;

  // Decimonovena fila: Colisión frontal (3 columnas con altura dinámica)
  const textoCriterio2_3 = "Colisión frontal del vehículo contra otro, cayó a un precipicio, río o chocó contra un poste, puente, edificio u otra estructura estática sin motivo aparente";
  const alturaCriterio2_3 = calcularAlturaDinamica(textoCriterio2_3, 155);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaCriterio2_3); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + alturaCriterio2_3); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + alturaCriterio2_3); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaCriterio2_3); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaCriterio2_3, tablaInicioX + tablaAncho, yPos + alturaCriterio2_3); // Línea inferior
  yPos += alturaCriterio2_3;

  // Vigésima fila: Vehículo invadió carril (3 columnas con altura dinámica)
  const textoCriterio2_4 = "Vehículo que invadió el otro carril o se desvió sin causa aparente";
  const alturaCriterio2_4 = calcularAlturaDinamica(textoCriterio2_4, 155);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaCriterio2_4); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + alturaCriterio2_4); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + alturaCriterio2_4); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaCriterio2_4); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaCriterio2_4, tablaInicioX + tablaAncho, yPos + alturaCriterio2_4); // Línea inferior
  yPos += alturaCriterio2_4;

  // Vigésima primera fila: Conductor no recuerda (3 columnas con altura dinámica)
  const textoCriterio2_5 = "El conductor no recuerda claramente lo ocurrido 10 segundos antes del impacto";
  const alturaCriterio2_5 = calcularAlturaDinamica(textoCriterio2_5, 155);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaCriterio2_5); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + alturaCriterio2_5); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + alturaCriterio2_5); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaCriterio2_5); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaCriterio2_5, tablaInicioX + tablaAncho, yPos + alturaCriterio2_5); // Línea inferior
  yPos += alturaCriterio2_5;

  // Vigésima segunda fila: Conductor tomó medicación (3 columnas con altura dinámica)
  const textoCriterio2_6 = "El conductor tomó alguna medicación o recientemente terminó un tratamiento con medicinas que causan somnolencia (benzodiacepinas, antihistamínicos, relajantes musculares o antidepresivos, etc)";
  const alturaCriterio2_6 = calcularAlturaDinamica(textoCriterio2_6, 155);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaCriterio2_6); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + alturaCriterio2_6); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + alturaCriterio2_6); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaCriterio2_6); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaCriterio2_6, tablaInicioX + tablaAncho, yPos + alturaCriterio2_6); // Línea inferior
  yPos += alturaCriterio2_6;

  // Vigésima tercera fila: Conductor en horas extra (3 columnas con altura dinámica)
  const textoCriterio2_7 = "El conductor se encontraba en horas extra (excediendo sus horas habituales de trabajo) o realizando días adicionales de trabajo (sobretiempo)";
  const alturaCriterio2_7 = calcularAlturaDinamica(textoCriterio2_7, 155);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaCriterio2_7); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + alturaCriterio2_7); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + alturaCriterio2_7); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaCriterio2_7); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaCriterio2_7, tablaInicioX + tablaAncho, yPos + alturaCriterio2_7); // Línea inferior
  yPos += alturaCriterio2_7;

  // Vigésima cuarta fila: Título Clasificación de choques (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Vigésima quinta fila: Accidente confirmado por Somnolencia (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + filaAltura); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + filaAltura); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Vigésima sexta fila: Accidente con alta sospecha de somnolencia (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + filaAltura); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + filaAltura); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Vigésima séptima fila: Accidente con escasa evidencia (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + filaAltura); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + filaAltura); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Vigésima octava fila: No se dispone de datos suficientes (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + filaAltura); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + filaAltura); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Vigésima novena fila: Accidente no debido a somnolencia (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + filaAltura); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + filaAltura); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Trigésima fila: Título Entrevista al paciente (fila completa)
  // Fondo gris para el header de sección
  doc.setFillColor(196, 196, 196); // Gris oscuro (igual que certificaciondeconduccion_Digitalizado.jsx)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Trigésima primera fila: Pareja comentó que ronca (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + filaAltura); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + filaAltura); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Trigésima segunda fila: Pareja comentó ruidos al respirar (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + filaAltura); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + filaAltura); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Trigésima tercera fila: Pareja comentó pausa respiratoria (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + filaAltura); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + filaAltura); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Trigésima cuarta fila: Más sueño que compañeros (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 155, yPos, tablaInicioX + 155, yPos + filaAltura); // División para SI
  doc.line(tablaInicioX + 167.5, yPos, tablaInicioX + 167.5, yPos + filaAltura); // División para NO
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  yPos += filaAltura;

  // Trigésima quinta fila: Puntuación de la Escala de Epworth (ESS) - Fila más alta
  const alturaFilaEpworth = filaAltura + 5; // Hacer la fila más alta

  // Fondo gris solo hasta la división (130mm)
  doc.setFillColor(196, 196, 196); // Gris oscuro
  doc.rect(tablaInicioX, yPos, 130, alturaFilaEpworth, 'F');

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaEpworth); // Línea izquierda
  doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + alturaFilaEpworth); // División para puntuación
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaEpworth); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaEpworth, tablaInicioX + tablaAncho, yPos + alturaFilaEpworth); // Línea inferior
  yPos += alturaFilaEpworth;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = tablaInicioY + 2;

  // Primera fila: I.- FILIACION
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("1.- FILIACION", tablaInicioX + 2, yTexto + 1);
  yTexto += filaAltura;

  // Segunda fila: Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 35, yTexto + 1, tablaAncho - 40);
  yTexto += filaAltura;

  // Tercera fila: DNI, Género, Edad, Tipo de Licencia (4 columnas)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI :", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Género :", tablaInicioX + 47, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.genero, tablaInicioX + 60, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad :", tablaInicioX + 94, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.edad + " Años", tablaInicioX + 105, yTexto + 1);


  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Tipo de licencia :", tablaInicioX + 135, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.tipoLicencia, tablaInicioX + 165, yTexto + 1);
  yTexto += filaAltura;

  // Cuarta fila: Empresa (fila completa)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa :", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 24, yTexto + 1, 160);
  yTexto += filaAltura;

  // Quinta fila: Contratista (fila completa)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista :", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.contratista, tablaInicioX + 24, yTexto + 1, 160);
  yTexto += filaAltura;

  // Sexta fila: Trabajo nocturno (4 columnas)
  // Primera columna: "Trabaja de noche"
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Trabaja de noche :", tablaInicioX + 2, yTexto + 1);

  // Segunda columna: Si/No checkboxes con paréntesis dinámicos
  doc.setFont("helvetica", "normal").setFontSize(8);
  const siTexto = crearCheckboxFijo(datosFinales.trabajaNoche, "Si");
  const noTexto = crearCheckboxFijo(!datosFinales.trabajaNoche, "No");
  doc.text(siTexto, tablaInicioX + 47, yTexto + 1);
  doc.text(noTexto, tablaInicioX + 70, yTexto + 1);

  // Tercera columna: # días trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Días de trabajo:", tablaInicioX + 94, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.diasTrabajo + " Días", tablaInicioX + 120, yTexto + 1);

  // Cuarta columna: # días descanso
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Días de descanso:", tablaInicioX + 135, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.diasDescanso + " Días", tablaInicioX + 165, yTexto + 1);
  yTexto += filaAltura;

  // Séptima fila: Años trabajando en dicho horario (2 columnas)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Años en que trabaja en dicho horario de trabajo :", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.anosTrabajoHorario + " Años", tablaInicioX + 70, yTexto + 1);
  yTexto += filaAltura;

  // Octava fila: Puesto de Trabajo (fila completa)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo :", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo, tablaInicioX + 30, yTexto + 1, 160);
  yTexto += filaAltura;

  // Novena fila: II.- ANTECEDENTES PERSONALES
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("2.- ANTECEDENTES PERSONALES", tablaInicioX + 2, yTexto + 1);
  yTexto += filaAltura;

  // Décima fila: Apnea del sueño (4 columnas)
  // Primera columna: "Apnea del sueño"
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apnea del sueño :", tablaInicioX + 2, yTexto + 1);

  // Segunda columna: Si/No checkboxes con paréntesis dinámicos
  doc.setFont("helvetica", "normal").setFontSize(8);
  const apneaSiTexto = crearCheckboxFijo(datosFinales.apneaSueno.si, "Si");
  const apneaNoTexto = crearCheckboxFijo(datosFinales.apneaSueno.no, "No");
  doc.text(apneaSiTexto, tablaInicioX + 47, yTexto + 1);
  doc.text(apneaNoTexto, tablaInicioX + 70, yTexto + 1);

  // Tercera columna: "Último control"
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Último control :", tablaInicioX + 94, yTexto + 1);

  // Cuarta columna: Aplica/No Aplica
  doc.setFont("helvetica", "normal").setFontSize(8);
  const apneaAplicaTexto = datosFinales.apneaSueno.aplica ? "APLICA" : "NO APLICA";
  doc.text(apneaAplicaTexto, tablaInicioX + 135, yTexto + 1);
  yTexto += filaAltura;

  // Undécima fila: HTA (4 columnas)
  // Primera columna: "HTA:"
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("HTA :", tablaInicioX + 2, yTexto + 1);

  // Segunda columna: Si/No checkboxes con paréntesis dinámicos
  doc.setFont("helvetica", "normal").setFontSize(8);
  const htaSiTexto = crearCheckboxFijo(datosFinales.hta.si, "Si");
  const htaNoTexto = crearCheckboxFijo(datosFinales.hta.no, "No");
  doc.text(htaSiTexto, htaDiv1 + 2, yTexto + 1);
  doc.text(htaNoTexto, htaDiv1 + 12, yTexto + 1);

  // Tercera columna: "Medicación:" con texto dinámico
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Medicación (Riesgo >2):", htaDiv2 + 2, yTexto + 1);

  // Cuarta columna: Texto de medicación de riesgo
  doc.setFont("helvetica", "normal").setFontSize(8);
  const medicacionRiesgoTexto = datosFinales.medicacionRiesgo || "";
  if (medicacionRiesgoTexto) {
    doc.text(medicacionRiesgoTexto, htaDiv3 + 2, yTexto + 1);
  }
  yTexto += filaAltura;

  // Duodécima fila: Polisomnografía (4 columnas con divisiones diferentes)
  // Primera columna: "Polisomnografía (PSG) realizada alguna vez:"
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Polisomnografía (PSG) realizada alguna vez :", tablaInicioX + 2, yTexto + 1);

  // Segunda columna: Si/No checkboxes con paréntesis dinámicos
  doc.setFont("helvetica", "normal").setFontSize(8);
  const polisomnografiaSiTexto = crearCheckboxFijo(datosFinales.polisomnografia.si, "Si");
  const polisomnografiaNoTexto = crearCheckboxFijo(datosFinales.polisomnografia.no, "No");
  doc.text(polisomnografiaSiTexto, tablaInicioX + 65, yTexto + 1);
  doc.text(polisomnografiaNoTexto, tablaInicioX + 80, yTexto + 1);

  // Tercera columna: "Fecha de última PSG"
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha de última PSG", tablaInicioX + 103, yTexto + 1);

  // Cuarta columna: Mostrar fecha real si polisomnografia.si es true, sino mostrar "NO APLICA"
  doc.setFont("helvetica", "normal").setFontSize(8);
  const fechaPolisomnografia = datosFinales.polisomnografia.si 
    ? datosFinales.polisomnografia.fecha 
    : "NO APLICA";
  doc.text(fechaPolisomnografia, tablaInicioX + 142.5, yTexto + 1);
  yTexto += filaAltura;

  // Decimotercera fila: Antecedente de Choque de vehículo (4 columnas con divisiones diferentes)
  // Primera columna: "Antecedente de Choque de vehículo"
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Antecedente de Choque de vehículo", tablaInicioX + 2, yTexto + 1);

  // Segunda columna: "En mina: Si/No checkboxes con paréntesis dinámicos"
  doc.setFont("helvetica", "bold").setFontSize(8);
  const enMinaSiTexto = `En mina: ${crearCheckboxFijo(datosFinales.choqueVehiculo.enMina.si, "Si")}`;
  const enMinaNoTexto = crearCheckboxFijo(datosFinales.choqueVehiculo.enMina.no, "No");
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(enMinaSiTexto, tablaInicioX + 65, yTexto + 1);
  doc.text(enMinaNoTexto, tablaInicioX + 85, yTexto + 1);

  // Tercera columna: "Fuera de mina: Si/No checkboxes con paréntesis dinámicos"
  doc.setFont("helvetica", "normboldal").setFontSize(8);
  const fueraMinaSiTexto = `Fuera de mina: ${crearCheckboxFijo(datosFinales.choqueVehiculo.fueraMina.si, "Si")}`;
  const fueraMinaNoTexto = crearCheckboxFijo(datosFinales.choqueVehiculo.fueraMina.no, "No");
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(fueraMinaSiTexto, tablaInicioX + 100, yTexto + 1);
  doc.text(fueraMinaNoTexto, tablaInicioX + 130, yTexto + 1);

  // Cuarta columna: Aplica/No Aplica o Pase a sección 3
  doc.setFont("helvetica", "normal").setFontSize(8);
  let choqueAplicaTexto;
  if (datosFinales.choqueVehiculo.fueraMina.no) {
    choqueAplicaTexto = "( Pase a la sección 3)";
  } else {
    choqueAplicaTexto = datosFinales.choqueVehiculo.aplica ? "APLICA" : "NO APLICA";
  }
  doc.text(choqueAplicaTexto, tablaInicioX + 142.5, yTexto + 1);
  yTexto += filaAltura;

  // Decimocuarta fila: Detalle de choques (fila completa con texto dinámico)
  // Label
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Detalle lo siguiente de los antecedentes de (los) choques (incidentes o accidentes):", tablaInicioX + 2, yTexto + 1);

  // Texto dinámico con salto de línea
  if (datosFinales.detalleChoques && datosFinales.detalleChoques.trim()) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    const anchoDisponible = tablaAncho - 4; // Ancho disponible menos márgenes
    dibujarTextoConSaltoLinea(datosFinales.detalleChoques, tablaInicioX + 2, yTexto + 5, anchoDisponible);
  }

  // Calcular la altura dinámica para el contenido también
  const anchoDisponibleContenido = tablaAncho - 4;
  const textoDetalleContenido = datosFinales.detalleChoques || "";

  // Calcular líneas necesarias para el contenido
  doc.setFontSize(8);
  const palabrasContenido = textoDetalleContenido.split(' ');
  let lineasContenido = 1;
  let lineaActualContenido = '';

  for (let palabra of palabrasContenido) {
    const textoPrueba = lineaActualContenido + (lineaActualContenido ? ' ' : '') + palabra;
    const anchoTexto = doc.getTextWidth(textoPrueba);

    if (anchoTexto > anchoDisponibleContenido) {
      if (lineaActualContenido) {
        lineasContenido++;
        lineaActualContenido = palabra;
      } else {
        lineasContenido++;
        lineaActualContenido = '';
      }
    } else {
      lineaActualContenido = textoPrueba;
    }
  }

  // Altura dinámica: mínimo 1 fila, máximo según contenido
  const alturaDetalleContenido = Math.max(filaAltura, lineasContenido * 4 + 2);
  yTexto += alturaDetalleContenido;

  // Decimoquinta fila: Nueva fila con pregunta y opciones SI/NO
  // Primera columna: Pregunta (área amplia)
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("¿Ha tenido algún accidente o incidente relacionado con somnolencia?", tablaInicioX + 2, yTexto + 1);

  // Segunda columna: SI
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("SI", tablaInicioX + 160, yTexto + 1);

  // Tercera columna: NO
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NO", tablaInicioX + 172, yTexto + 1);
  yTexto += filaAltura;

  // Decimosexta fila: Criterio 1 con opciones SI/NO
  // Primera columna: Criterio 1
  dibujarTextoConCriterioNegrita("Criterio 1: Se \"cabeceó\" y por ello le ocurrió un accidente (incidente) con un vehículo (alguna vez)", tablaInicioX + 2, yTexto + 1, 145);

  // Segunda columna: SI
  doc.setFont("helvetica", "normal").setFontSize(8);
  const criterio1SiTexto = datosFinales.criterio1.cabeceoAccidente ? "X" : "";
  doc.text(criterio1SiTexto, tablaInicioX + 160, yTexto + 1);

  // Tercera columna: NO
  doc.setFont("helvetica", "normal").setFontSize(8);
  const criterio1NoTexto = !datosFinales.criterio1.cabeceoAccidente ? "X" : "";
  doc.text(criterio1NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += filaAltura;

  // Decimoséptima fila: Título Criterio 2
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Criterio 2 (2 o más es positivo)", tablaInicioX + 2, yTexto + 1);
  yTexto += filaAltura;

  // Decimoctava fila: Accidente últimas 5 horas
  doc.setFont("helvetica", "normal").setFontSize(8);
  const anchoDisponibleCriterio2 = 145; // Ancho disponible para el texto
  dibujarTextoConSaltoLinea("Accidente ocurrido entre las últimas 5 horas de un turno nocturno o entre las 14 y 17 horas (tarde)", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const criterio2_1SiTexto = datosFinales.criterio2.accidenteUltimas5Horas ? "X" : "";
  const criterio2_1NoTexto = !datosFinales.criterio2.accidenteUltimas5Horas ? "X" : "";
  doc.text(criterio2_1SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(criterio2_1NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += alturaCriterio2_1;

  // Decimoctava fila: Ausencia de maniobra evasiva
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("AUSENCIA DE evidencia de maniobra evasiva del chofer para evitar la colisión", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const criterio2_2SiTexto = datosFinales.criterio2.ausenciaManiobraEvasiva ? "X" : "";
  const criterio2_2NoTexto = !datosFinales.criterio2.ausenciaManiobraEvasiva ? "X" : "";
  doc.text(criterio2_2SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(criterio2_2NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += alturaCriterio2_2;

  // Decimonovena fila: Colisión frontal
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("Colisión frontal del vehículo contra otro, cayó a un precipicio, río o chocó contra un poste, puente, edificio u otra estructura estática sin motivo aparente", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const criterio2_3SiTexto = datosFinales.criterio2.colisionFrontal ? "X" : "";
  const criterio2_3NoTexto = !datosFinales.criterio2.colisionFrontal ? "X" : "";
  doc.text(criterio2_3SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(criterio2_3NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += alturaCriterio2_3;

  // Vigésima fila: Vehículo invadió carril
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("Vehículo que invadió el otro carril o se desvió sin causa aparente", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const criterio2_4SiTexto = datosFinales.criterio2.vehiculoInvadioCarril ? "X" : "";
  const criterio2_4NoTexto = !datosFinales.criterio2.vehiculoInvadioCarril ? "X" : "";
  doc.text(criterio2_4SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(criterio2_4NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += alturaCriterio2_4;

  // Vigésima primera fila: Conductor no recuerda
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("El conductor no recuerda claramente lo ocurrido 10 segundos antes del impacto", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const criterio2_5SiTexto = datosFinales.criterio2.conductorNoRecuerda ? "X" : "";
  const criterio2_5NoTexto = !datosFinales.criterio2.conductorNoRecuerda ? "X" : "";
  doc.text(criterio2_5SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(criterio2_5NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += alturaCriterio2_5;

  // Vigésima segunda fila: Conductor tomó medicación
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("El conductor tomó alguna medicación o recientemente terminó un tratamiento con medicinas que causan somnolencia (benzodiacepinas, antihistamínicos, relajantes musculares o antidepresivos, etc)", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const criterio2_6SiTexto = datosFinales.criterio2.conductorTomoMedicacion ? "X" : "";
  const criterio2_6NoTexto = !datosFinales.criterio2.conductorTomoMedicacion ? "X" : "";
  doc.text(criterio2_6SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(criterio2_6NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += alturaCriterio2_6;

  // Vigésima tercera fila: Conductor en horas extra
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("El conductor se encontraba en horas extra (excediendo sus horas habituales de trabajo) o realizando días adicionales de trabajo (sobretiempo)", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const criterio2_7SiTexto = datosFinales.criterio2.conductorHorasExtra ? "X" : "";
  const criterio2_7NoTexto = !datosFinales.criterio2.conductorHorasExtra ? "X" : "";
  doc.text(criterio2_7SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(criterio2_7NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += alturaCriterio2_7;

  // Vigésima cuarta fila: Título Clasificación de choques
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Clasificación del (los) \"choques\" o accidentes vehiculares del postulante (marque solo una categoría)", tablaInicioX + 2, yTexto + 1);
  yTexto += filaAltura;

  // Vigésima quinta fila: Accidente confirmado por Somnolencia
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("Accidente confirmado por Somnolencia (Criterio 1 positivo)", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const clasificacion1SiTexto = datosFinales.clasificacionChoques.accidenteConfirmadoSomnolencia ? "X" : "";
  const clasificacion1NoTexto = !datosFinales.clasificacionChoques.accidenteConfirmadoSomnolencia ? "X" : "";
  doc.text(clasificacion1SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(clasificacion1NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += filaAltura;

  // Vigésima sexta fila: Accidente con alta sospecha de somnolencia
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("Accidente con alta sospecha de somnolencia (Criterio 2 positivo)", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const clasificacion2SiTexto = datosFinales.clasificacionChoques.accidenteAltaSospechaSomnolencia ? "X" : "";
  const clasificacion2NoTexto = !datosFinales.clasificacionChoques.accidenteAltaSospechaSomnolencia ? "X" : "";
  doc.text(clasificacion2SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(clasificacion2NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += filaAltura;

  // Vigésima séptima fila: Accidente con escasa evidencia
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("Accidente con escasa evidencia / sospecha por somnolencia (solo 1 item de Criterio 2)", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const clasificacion3SiTexto = datosFinales.clasificacionChoques.accidenteEscasaEvidenciaSomnolencia ? "X" : "";
  const clasificacion3NoTexto = !datosFinales.clasificacionChoques.accidenteEscasaEvidenciaSomnolencia ? "X" : "";
  doc.text(clasificacion3SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(clasificacion3NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += filaAltura;

  // Vigésima octava fila: No se dispone de datos suficientes
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("No se dispone de datos suficientes para clasificar el (los) incidentes", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const clasificacion4SiTexto = datosFinales.clasificacionChoques.noDatosSuficientes ? "X" : "";
  const clasificacion4NoTexto = !datosFinales.clasificacionChoques.noDatosSuficientes ? "X" : "";
  doc.text(clasificacion4SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(clasificacion4NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += filaAltura;

  // Vigésima novena fila: Accidente no debido a somnolencia
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("Accidente no debido a somnolencia (información suficiente que descarta somnolencia)", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const clasificacion5SiTexto = datosFinales.clasificacionChoques.accidenteNoDebidoSomnolencia ? "X" : "";
  const clasificacion5NoTexto = !datosFinales.clasificacionChoques.accidenteNoDebidoSomnolencia ? "X" : "";
  doc.text(clasificacion5SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(clasificacion5NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += filaAltura;

  // Trigésima fila: Título Entrevista al paciente
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("3.- ENTREVISTA AL PACIENTE :", tablaInicioX + 2, yTexto + 1);
  yTexto += filaAltura;

  // Trigésima primera fila: Pareja comentó que ronca
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("En los últimos años, su pareja o esposa le ha comentado que ronca al dormir", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const entrevista1SiTexto = datosFinales.entrevistaPaciente.parejaComentoRonca ? "X" : "";
  const entrevista1NoTexto = !datosFinales.entrevistaPaciente.parejaComentoRonca ? "X" : "";
  doc.text(entrevista1SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(entrevista1NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += filaAltura;

  // Trigésima segunda fila: Pareja comentó ruidos al respirar
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("En los últimos 5 años, su pareja o esposa le ha comentado que hace ruidos al respirar mientras duerme", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const entrevista2SiTexto = datosFinales.entrevistaPaciente.parejaComentoRuidosRespirar ? "X" : "";
  const entrevista2NoTexto = !datosFinales.entrevistaPaciente.parejaComentoRuidosRespirar ? "X" : "";
  doc.text(entrevista2SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(entrevista2NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += filaAltura;

  // Trigésima tercera fila: Pareja comentó pausa respiratoria
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("En los últimos 5 años, su pareja o esposa le ha comentado que deja de respirar cuando duerme (pausa respiratoria)", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const entrevista3SiTexto = datosFinales.entrevistaPaciente.parejaComentoPausaRespiratoria ? "X" : "";
  const entrevista3NoTexto = !datosFinales.entrevistaPaciente.parejaComentoPausaRespiratoria ? "X" : "";
  doc.text(entrevista3SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(entrevista3NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += filaAltura;

  // Trigésima cuarta fila: Más sueño que compañeros
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("Comparado con sus compañeros, usted siente que tiene más sueño o cansancio que ellos mientras trabaja", tablaInicioX + 7, yTexto + 1, anchoDisponibleCriterio2);
  const entrevista4SiTexto = datosFinales.entrevistaPaciente.masSueñoQueCompañeros ? "X" : "";
  const entrevista4NoTexto = !datosFinales.entrevistaPaciente.masSueñoQueCompañeros ? "X" : "";
  doc.text(entrevista4SiTexto, tablaInicioX + 160, yTexto + 1);
  doc.text(entrevista4NoTexto, tablaInicioX + 173, yTexto + 1);
  yTexto += filaAltura;

  // Trigésima quinta fila: Puntuación de la Escala de Epworth (ESS)
  // Columna 1: Título y leyenda
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("4.- PUNTUACION DE LA ESCALA DE EPWORTH (ESS)", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("(Nunca=0, Poca=1, Moderada=2, Alta=3)", tablaInicioX + 5, yTexto + 6);

  // Columna 2: Total de puntos y puntuación
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Total de Puntos Sumatoria >10***", tablaInicioX + 135, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(datosFinales.escalaEpworth.puntuacionTotal.toString(), tablaInicioX + 155, yTexto + 7);
  yTexto += filaAltura + 5; // Usar la altura aumentada

  // === SECCIÓN DE DECLARACIÓN, FIRMA Y HUELLA ===
  const alturaSeccionFirma = 20; // Altura para la sección de firma

  // Dibujar las líneas de la sección de firma (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaSeccionFirma); // Línea izquierda
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + alturaSeccionFirma); // Primera división
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + alturaSeccionFirma); // Segunda división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionFirma); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaSeccionFirma, tablaInicioX + tablaAncho, yPos + alturaSeccionFirma); // Línea inferior

  // Columna 1: Declaración
  doc.setFont("helvetica", "normal").setFontSize(6);
  const textoDeclaracion = "Declaro que las respuestas son ciertas según mi leal saber y entender. En caso de ser requeridos, los resultados del examen médico pueden ser revelados, en términos generales, al departamento de salud Ocupacional de la compañía. Los resultados pueden ser enviados a mi médico particular de ser considerado necesario.";
  dibujarTextoJustificado(textoDeclaracion, tablaInicioX + 2, yPos + 3, 55);

  // Columna 2: Firma
  try {
    const x = tablaInicioX + 65;
    const y = yPos + 2;
    const firmaPaciente = getSign(data, "FIRMAP")
    doc.addImage(
      firmaPaciente,
      'PNG',
      x + 7, y - 5, 34, 25
    );
  } catch (error) {
    console.log("Error cargando firma:", error);
  }



  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Firma del trabajador o postulante", tablaInicioX + 90, yPos + 16.5, { align: "center" });
  doc.text("DNI : " + datosFinales.documentoIdentidad, tablaInicioX + 90, yPos + 19, { align: "center" });

  // Columna 3: Huella digital
  try {
    const x = tablaInicioX + 125;
    const y = yPos + 2;
    const huellaDigital = getSign(data, "HUELLA")
    doc.addImage(
      huellaDigital,
      'PNG',
      x + 20, y - 5, 15, 21
    );
  } catch (error) {
    console.log("Error cargando huella:", error);
  }

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Indice Derecho", tablaInicioX + 155, yPos + 16.5, { align: "center" });

  yPos += alturaSeccionFirma;

  // === FOOTER PÁGINA 1 ===
  footerTR(doc, { footerOffsetY: 5 });

  // === NUEVA PÁGINA - EXÁMEN FÍSICO ===
  doc.addPage();
  numeroPagina++; // Incrementar contador de página

  // Header para página 2 (sin título)
  drawHeader(numeroPagina);

  // Resetear posición Y para nueva página
  yPos = 30;

  // === FILA DE TÍTULO 4. EXÁMEN FÍSICO ===
  // Fondo gris para el header de sección
  doc.setFillColor(196, 196, 196); // Gris oscuro (igual que certificaciondeconduccion_Digitalizado.jsx)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido del título
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("4.- EXÁMEN FÍSICO :", tablaInicioX + 2, yPos + 3);
  yPos += filaAltura;

  // === TABLA DE EXÁMEN FÍSICO ===
  const tablaExamenInicioX = tablaInicioX;
  const tablaExamenAncho = tablaAncho;
  let yExamen = yPos;

  // Primera fila: Peso, Talla, IMC
  doc.line(tablaExamenInicioX, yExamen, tablaExamenInicioX, yExamen + filaAltura);
  doc.line(tablaExamenInicioX + 50, yExamen, tablaExamenInicioX + 50, yExamen + filaAltura);
  doc.line(tablaExamenInicioX + 110, yExamen, tablaExamenInicioX + 110, yExamen + filaAltura);
  doc.line(tablaExamenInicioX + tablaExamenAncho, yExamen, tablaExamenInicioX + tablaExamenAncho, yExamen + filaAltura);
  doc.line(tablaExamenInicioX, yExamen, tablaExamenInicioX + tablaExamenAncho, yExamen);
  doc.line(tablaExamenInicioX, yExamen + filaAltura, tablaExamenInicioX + tablaExamenAncho, yExamen + filaAltura);
  yExamen += filaAltura;

  // Segunda fila: Circunferencia de cuello (3 columnas: título, VARÓN, MUJER)
  const alturaFilaCircunferencia = filaAltura + 4; // Hacer la fila más alta
  doc.line(tablaExamenInicioX, yExamen, tablaExamenInicioX, yExamen + alturaFilaCircunferencia);
  doc.line(tablaExamenInicioX + 50, yExamen, tablaExamenInicioX + 50, yExamen + alturaFilaCircunferencia); // División col1-col2
  doc.line(tablaExamenInicioX + 110, yExamen, tablaExamenInicioX + 110, yExamen + alturaFilaCircunferencia); // División col2-col3
  doc.line(tablaExamenInicioX + tablaExamenAncho, yExamen, tablaExamenInicioX + tablaExamenAncho, yExamen + alturaFilaCircunferencia);
  doc.line(tablaExamenInicioX, yExamen, tablaExamenInicioX + tablaExamenAncho, yExamen);
  doc.line(tablaExamenInicioX, yExamen + alturaFilaCircunferencia, tablaExamenInicioX + tablaExamenAncho, yExamen + alturaFilaCircunferencia);
  yExamen += alturaFilaCircunferencia;

  // Cuarta fila: Presión arterial
  doc.line(tablaExamenInicioX, yExamen, tablaExamenInicioX, yExamen + filaAltura);
  doc.line(tablaExamenInicioX + 50, yExamen, tablaExamenInicioX + 50, yExamen + filaAltura);
  doc.line(tablaExamenInicioX + 110, yExamen, tablaExamenInicioX + 110, yExamen + filaAltura);
  doc.line(tablaExamenInicioX + tablaExamenAncho, yExamen, tablaExamenInicioX + tablaExamenAncho, yExamen + filaAltura);
  doc.line(tablaExamenInicioX, yExamen, tablaExamenInicioX + tablaExamenAncho, yExamen);
  doc.line(tablaExamenInicioX, yExamen + filaAltura, tablaExamenInicioX + tablaExamenAncho, yExamen + filaAltura);
  yExamen += filaAltura;

  // === CONTENIDO DE LA TABLA DE EXÁMEN FÍSICO ===
  let yTextoExamen = yPos + 2;

  // Primera fila: Peso, Talla, IMC (con datos mapeados)
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Peso (Kg):", tablaExamenInicioX + 2, yTextoExamen + 1);
  doc.text(datosFinales.pesoPaciente, tablaExamenInicioX + 20, yTextoExamen + 1);

  doc.text("Talla (mts):", tablaExamenInicioX + 52, yTextoExamen + 1);
  doc.text(datosFinales.tallaPaciente, tablaExamenInicioX + 70, yTextoExamen + 1);

  doc.text("IMC (Kg/m2):", tablaExamenInicioX + 112, yTextoExamen + 1);
  doc.text(datosFinales.imcPaciente, tablaExamenInicioX + 135, yTextoExamen + 1);
  doc.text("(> 35 es de alto riesgo)", tablaExamenInicioX + 145, yTextoExamen + 1);
  yTextoExamen += filaAltura;

  // Segunda fila: Circunferencia de cuello (3 columnas: título, VARÓN, MUJER)
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Circunferencia de cuello :", tablaExamenInicioX + 2, yTextoExamen + 1);
  doc.text(datosFinales.circunferenciaCuello + " cm.", tablaExamenInicioX + 20, yTextoExamen + 5);

  // Columna 2: VARÓN con checkboxes (solo si es varón)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("VARÓN (menor de 43,2 cm, es normal)", tablaExamenInicioX + 52, yTextoExamen + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NORMAL:", tablaExamenInicioX + 52, yTextoExamen + 5);

  // Solo marcar si es varón
  if (datosFinales.genero === "MASCULINO") {
    const varonNormal = datosFinales.circunferenciaVaronNormal;
    const varonSiTexto = crearCheckboxFijo(varonNormal, "Si");
    const varonNoTexto = crearCheckboxFijo(!varonNormal, "No");
    doc.text(varonSiTexto, tablaExamenInicioX + 70, yTextoExamen + 5);
    doc.text(varonNoTexto, tablaExamenInicioX + 85, yTextoExamen + 5);
  } else {
    // Si no es varón, dejar vacío
    doc.text("Si (   )", tablaExamenInicioX + 70, yTextoExamen + 5);
    doc.text("No (   )", tablaExamenInicioX + 85, yTextoExamen + 5);
  }

  // Columna 3: MUJER con checkboxes (solo si es mujer)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("MUJER (menor de 40,6 cm, es normal)", tablaExamenInicioX + 112, yTextoExamen + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NORMAL:", tablaExamenInicioX + 112, yTextoExamen + 5);

  // Solo marcar si es mujer
  if (datosFinales.genero === "FEMENINO") {
    const mujerNormal = datosFinales.circunferenciaMujerNormal;
    const mujerSiTexto = crearCheckboxFijo(mujerNormal, "Si");
    const mujerNoTexto = crearCheckboxFijo(!mujerNormal, "No");
    doc.text(mujerSiTexto, tablaExamenInicioX + 135, yTextoExamen + 5);
    doc.text(mujerNoTexto, tablaExamenInicioX + 155, yTextoExamen + 5);
  } else {
    // Si no es mujer, dejar vacío
    doc.text("Si (   )", tablaExamenInicioX + 135, yTextoExamen + 5);
    doc.text("No (   )", tablaExamenInicioX + 155, yTextoExamen + 5);
  }

  yTextoExamen += alturaFilaCircunferencia;

  // Tercera fila: Presión arterial (mapeada)
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("P. Sistólica :", tablaExamenInicioX + 2, yTextoExamen + 1);
  doc.text(datosFinales.presionSistolica + " mmHg.", tablaExamenInicioX + 20, yTextoExamen + 1);

  doc.text("P. Diastólica :", tablaExamenInicioX + 52, yTextoExamen + 1);
  doc.text(datosFinales.presionDiastolica + " mmHg.", tablaExamenInicioX + 70, yTextoExamen + 1);

  doc.text("HTA NUEVA:", tablaExamenInicioX + 112, yTextoExamen + 1);
  const htaNueva = datosFinales.htaNueva;
  const htaNuevaSiTexto = crearCheckboxFijo(htaNueva, "Si");
  const htaNuevaNoTexto = crearCheckboxFijo(!htaNueva, "No");
  doc.text(htaNuevaSiTexto, tablaExamenInicioX + 135, yTextoExamen + 1);
  doc.text(htaNuevaNoTexto, tablaExamenInicioX + 155, yTextoExamen + 1);
  yTextoExamen += filaAltura;

  // Texto de evaluación Mallampati
  yTextoExamen += 2;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Evaluación de la vía aérea superior MALLAMPATI (marque con una X)", tablaExamenInicioX, yTextoExamen);

  // Imagen de grados de epiglotis centrada
  yTextoExamen += 2;

  // Checkboxes para grados de Mallampati (encima de la imagen)
  const imgWidth = 100; // Ancho de la imagen
  const imgHeight = 50; // Alto de la imagen
  const x = (pageW - imgWidth) / 2; // Centrar horizontalmente
  const y = yTextoExamen;

  // Primero dibujar la imagen
  try {
    // Usar ruta absoluta para producción
    const imageUrl = window.location.origin + '/img/FichasSAS/grado_epiglotis.png';
    doc.addImage(imageUrl, 'PNG', x, y, imgWidth, imgHeight);
  } catch (error) {
    console.log("Error cargando imagen de grados de epiglotis:", error);
    // Texto alternativo si no se puede cargar la imagen
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Grados de Mallampati: I, II, III, IV", pageW / 2, yTextoExamen + 20, { align: "center" });
  }

  // Luego dibujar las X superpuestas encima de la imagen
  const checkboxY = y + 32; // 2mm debajo del borde superior de la imagen (superpuesto)

  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.setTextColor(255, 0, 0); // Color verde

  // Grado I - posición independiente
  const gradoI = datosFinales.mallampatiGradoI ? "X" : " ";
  doc.text(gradoI, x + 16, checkboxY);

  // Grado II - posición independiente
  const gradoII = datosFinales.mallampatiGradoII ? "X" : " ";
  doc.text(gradoII, x + 42, checkboxY);

  // Grado III - posición independiente
  const gradoIII = datosFinales.mallampatiGradoIII ? "X" : " ";
  doc.text(gradoIII, x + 69, checkboxY);

  // Grado IV - posición independiente
  const gradoIV = datosFinales.mallampatiGradoIV ? "X" : " ";
  doc.text(gradoIV, x + 96, checkboxY);

  // Restaurar color negro para el resto del texto
  doc.setTextColor(0, 0, 0);

  // === SECCIÓN 5.- CONCLUSIÓN DE LA EVALUACIÓN ===
  yTextoExamen += imgHeight + 1; // Espacio después de la imagen

  // Fila de título "5.- CONCLUSIÓN DE LA EVALUACIÓN" con ampliación en la misma línea
  const alturaTituloConclusión = filaAltura;

  // Fondo gris para el header de sección
  doc.setFillColor(196, 196, 196); // Gris oscuro (igual que certificaciondeconduccion_Digitalizado.jsx)
  doc.rect(tablaExamenInicioX, yTextoExamen, tablaExamenAncho, alturaTituloConclusión, 'F');

  doc.line(tablaExamenInicioX, yTextoExamen, tablaExamenInicioX, yTextoExamen + alturaTituloConclusión);
  doc.line(tablaExamenInicioX + tablaExamenAncho, yTextoExamen, tablaExamenInicioX + tablaExamenAncho, yTextoExamen + alturaTituloConclusión);
  doc.line(tablaExamenInicioX, yTextoExamen, tablaExamenInicioX + tablaExamenAncho, yTextoExamen);
  doc.line(tablaExamenInicioX, yTextoExamen + alturaTituloConclusión, tablaExamenInicioX + tablaExamenAncho, yTextoExamen + alturaTituloConclusión);

  // Título y ampliación en la misma línea
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("5.- CONCLUSIÓN DE LA EVALUACIÓN", tablaExamenInicioX + 2, yTextoExamen + 3);

  // Nota con asterisco en la misma línea
  doc.setFont("helvetica", "normal").setFontSize(6);
  doc.text("- Ampliación: Oximetría, Polisomnografía, Seguimiento de tratamiento Y/O Interconsulto", tablaExamenInicioX + 80, yTextoExamen + 3);
  yTextoExamen += alturaTituloConclusión;

  // === TABLA DE CRITERIOS DE RIESGO ===
  const tablaCriteriosInicioX = tablaExamenInicioX;
  const tablaCriteriosAncho = tablaExamenAncho;
  let yCriterios = yTextoExamen;

  // Primera fila: RIESGO ALTO (Criterio A o B positivo) con SI/NO
  const alturaFilaRiesgoAlto = filaAltura; // Fila compacta

  // Fondo rojo para RIESGO ALTO
  doc.setFillColor(255, 200, 200); // Rojo claro
  doc.rect(tablaCriteriosInicioX, yCriterios, tablaCriteriosAncho, alturaFilaRiesgoAlto, 'F');

  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX, yCriterios + alturaFilaRiesgoAlto);
  doc.line(tablaCriteriosInicioX + 155, yCriterios, tablaCriteriosInicioX + 155, yCriterios + alturaFilaRiesgoAlto); // División para SI/NO
  doc.line(tablaCriteriosInicioX + 167.5, yCriterios, tablaCriteriosInicioX + 167.5, yCriterios + alturaFilaRiesgoAlto); // División entre SI y NO
  doc.line(tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaFilaRiesgoAlto);
  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios);
  doc.line(tablaCriteriosInicioX, yCriterios + alturaFilaRiesgoAlto, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaFilaRiesgoAlto);
  yCriterios += alturaFilaRiesgoAlto;

  // Segunda fila: Criterio A (con altura dinámica)
  const textoCriterioA = "Criterio A:  Excesiva somnolencia (Epworth > 15 o cabeceo presenciado durante espera). Incidente por somnolencia o con alta sospecha por somnolencia. (Último año)";
  const alturaCriterioA = calcularAlturaDinamica(textoCriterioA, 145);

  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX, yCriterios + alturaCriterioA);
  doc.line(tablaCriteriosInicioX + 155, yCriterios, tablaCriteriosInicioX + 155, yCriterios + alturaCriterioA); // División para SI/NO
  doc.line(tablaCriteriosInicioX + 167.5, yCriterios, tablaCriteriosInicioX + 167.5, yCriterios + alturaCriterioA); // División entre SI y NO
  doc.line(tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaCriterioA);
  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios);
  doc.line(tablaCriteriosInicioX, yCriterios + alturaCriterioA, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaCriterioA);
  yCriterios += alturaCriterioA;

  // Tercera fila: Criterio B (con altura dinámica)
  const textoCriterioB = "Criterio B:  Antecedentes de SAS sin control reciente o sin cumplimiento de tratamiento (con CPAP o cirugía)";
  const alturaCriterioB = calcularAlturaDinamica(textoCriterioB, 145);

  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX, yCriterios + alturaCriterioB);
  doc.line(tablaCriteriosInicioX + 155, yCriterios, tablaCriteriosInicioX + 155, yCriterios + alturaCriterioB); // División para SI/NO
  doc.line(tablaCriteriosInicioX + 167.5, yCriterios, tablaCriteriosInicioX + 167.5, yCriterios + alturaCriterioB); // División entre SI y NO
  doc.line(tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaCriterioB);
  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios);
  doc.line(tablaCriteriosInicioX, yCriterios + alturaCriterioB, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaCriterioB);
  yCriterios += alturaCriterioB;

  // === CONTENIDO DE LA TABLA DE CRITERIOS ===
  let yTextoCriterios = yTextoExamen + 2;

  // Primera fila: RIESGO ALTO (Criterio A o B positivo) con SI/NO
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("RIESGO ALTO (Criterio A o B positivo)", tablaCriteriosInicioX + 2, yTextoCriterios + 2);

  // Labels SI/NO
  doc.setFont("helvetica", "normal").setFontSize(8);

  doc.text("SI", tablaCriteriosInicioX + 160, yTextoCriterios + 2);
  doc.text("NO", tablaCriteriosInicioX + 172, yTextoCriterios + 2);
  yTextoCriterios += alturaFilaRiesgoAlto;

  // Segunda fila: Criterio A
  const anchoDisponibleCriterioA = 145; // Ancho disponible para el texto
  dibujarTextoConCriterioNegrita(textoCriterioA, tablaCriteriosInicioX + 2, yTextoCriterios + 1, anchoDisponibleCriterioA);

  // Checkboxes para Criterio A (usando datos mapeados)
  const criterioASi = datosFinales.riesgoAlto.criterioA.si;
  const criterioANo = datosFinales.riesgoAlto.criterioA.no;
  const criterioASiTexto = criterioASi ? "X" : "";
  const criterioANoTexto = criterioANo ? "X" : "";
  doc.text(criterioASiTexto, tablaCriteriosInicioX + 160, yTextoCriterios + 1);
  doc.text(criterioANoTexto, tablaCriteriosInicioX + 173, yTextoCriterios + 1);
  yTextoCriterios += alturaCriterioA;

  // Tercera fila: Criterio B
  const anchoDisponibleCriterioB = 145; // Ancho disponible para el texto
  dibujarTextoConCriterioNegrita(textoCriterioB, tablaCriteriosInicioX + 2, yTextoCriterios + 1, anchoDisponibleCriterioB);

  // Checkboxes para Criterio B (usando datos mapeados)
  const criterioBSi = datosFinales.riesgoAlto.criterioB.si;
  const criterioBNo = datosFinales.riesgoAlto.criterioB.no;
  const criterioBSiTexto = criterioBSi ? "X" : "";
  const criterioBNoTexto = criterioBNo ? "X" : "";
  doc.text(criterioBSiTexto, tablaCriteriosInicioX + 160, yTextoCriterios + 1);
  doc.text(criterioBNoTexto, tablaCriteriosInicioX + 173, yTextoCriterios + 1);
  yTextoCriterios += alturaCriterioB;

  // === CONTINUAR CON RIESGO MEDIO ===

  // Fila: Acción Requerida para Riesgo Alto
  const alturaAccionRiesgoAlto = filaAltura + 2;

  // Dibujar fondo naranja
  doc.setFillColor(255, 200, 200); // Naranja personalizado (#f5ae67)
  doc.rect(tablaCriteriosInicioX, yCriterios, tablaCriteriosAncho, alturaAccionRiesgoAlto, 'F');

  // Dibujar líneas de la tabla
  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX, yCriterios + alturaAccionRiesgoAlto);
  doc.line(tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaAccionRiesgoAlto);
  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios);
  doc.line(tablaCriteriosInicioX, yCriterios + alturaAccionRiesgoAlto, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaAccionRiesgoAlto);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Acción Requerida: En Riesgo Alto", tablaCriteriosInicioX + 2, yCriterios + 3);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("El paciente requiere pruebas ampliatorias (oximetría, PSG o certificación de cumplimiento de tratamiento de apnea del sueño).", tablaCriteriosInicioX + 2, yCriterios + 6);
  yCriterios += alturaAccionRiesgoAlto;
  yTextoCriterios += alturaAccionRiesgoAlto;

  // Fila: RIESGO MEDIO (Criterio C, D o E positivo)
  const alturaFilaRiesgoMedio = filaAltura;

  // Fondo amarillo para RIESGO MEDIO
  doc.setFillColor(255, 255, 200); // Amarillo claro
  doc.rect(tablaCriteriosInicioX, yCriterios, tablaCriteriosAncho, alturaFilaRiesgoMedio, 'F');

  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX, yCriterios + alturaFilaRiesgoMedio);
  doc.line(tablaCriteriosInicioX + 155, yCriterios, tablaCriteriosInicioX + 155, yCriterios + alturaFilaRiesgoMedio);
  doc.line(tablaCriteriosInicioX + 167.5, yCriterios, tablaCriteriosInicioX + 167.5, yCriterios + alturaFilaRiesgoMedio);
  doc.line(tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaFilaRiesgoMedio);
  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios);
  doc.line(tablaCriteriosInicioX, yCriterios + alturaFilaRiesgoMedio, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaFilaRiesgoMedio);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("RIESGO MEDIO (Criterio C, D o E positivo)", tablaCriteriosInicioX + 2, yCriterios + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("SI", tablaCriteriosInicioX + 160, yCriterios + 3.5);
  doc.text("NO", tablaCriteriosInicioX + 172, yCriterios + 3.5);
  yCriterios += alturaFilaRiesgoMedio;
  yTextoCriterios += alturaFilaRiesgoMedio;

  // Fila: Criterio C
  const textoCriterioC = "Criterio C: Historia de higiene de sueño sugiere SAS (ronquidos + pausas respiratorias + Epworth > 10)";
  const alturaCriterioC = calcularAlturaDinamica(textoCriterioC, 145);

  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX, yCriterios + alturaCriterioC);
  doc.line(tablaCriteriosInicioX + 155, yCriterios, tablaCriteriosInicioX + 155, yCriterios + alturaCriterioC);
  doc.line(tablaCriteriosInicioX + 167.5, yCriterios, tablaCriteriosInicioX + 167.5, yCriterios + alturaCriterioC);
  doc.line(tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaCriterioC);
  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios);
  doc.line(tablaCriteriosInicioX, yCriterios + alturaCriterioC, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaCriterioC);

  dibujarTextoConCriterioNegrita(textoCriterioC, tablaCriteriosInicioX + 2, yTextoCriterios + 1, 145);

  const criterioCSi = datosFinales.riesgoMedio?.criterioC?.si;
  const criterioCNo = datosFinales.riesgoMedio?.criterioC?.no;
  const criterioCSiTexto = criterioCSi ? "X" : "";
  const criterioCNoTexto = criterioCNo ? "X" : "";
  doc.text(criterioCSiTexto, tablaCriteriosInicioX + 160, yTextoCriterios + 1);
  doc.text(criterioCNoTexto, tablaCriteriosInicioX + 173, yTextoCriterios + 1);
  yCriterios += alturaCriterioC;
  yTextoCriterios += alturaCriterioC;

  // Fila: Criterio D - Título
  const textoCriterioD = "Criterio D: Cumple con 2 o más de los siguientes:";
  const alturaCriterioD = calcularAlturaDinamica(textoCriterioD, 145);

  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX, yCriterios + alturaCriterioD);
  doc.line(tablaCriteriosInicioX + 155, yCriterios, tablaCriteriosInicioX + 155, yCriterios + alturaCriterioD);
  doc.line(tablaCriteriosInicioX + 167.5, yCriterios, tablaCriteriosInicioX + 167.5, yCriterios + alturaCriterioD);
  doc.line(tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaCriterioD);
  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios);
  doc.line(tablaCriteriosInicioX, yCriterios + alturaCriterioD, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaCriterioD);

  dibujarTextoConCriterioNegrita(textoCriterioD, tablaCriteriosInicioX + 2, yTextoCriterios + 1, 145);

  const criterioDSi = datosFinales.riesgoMedio?.criterioD?.si;
  const criterioDNo = datosFinales.riesgoMedio?.criterioD?.no;
  const criterioDSiTexto = criterioDSi ? "X" : "";
  const criterioDNoTexto = criterioDNo ? "X" : "";
  doc.text(criterioDSiTexto, tablaCriteriosInicioX + 160, yTextoCriterios + 1);
  doc.text(criterioDNoTexto, tablaCriteriosInicioX + 173, yTextoCriterios + 1);
  yCriterios += alturaCriterioD;
  yTextoCriterios += alturaCriterioD;

  // Subcriterios del Criterio D (6 items)
  const subcriteriosD = [
    "IMC mayor o igual a 30",
    "Hipertensión Arterial (nueva, no controlada con una sola medicación)",
    "Circunferencia del cuello \"anormal\"",
    "Puntuación de Epworth mayor de 10 y menor de 16",
    "Antecedente de transtorno del sueño (diagnosticado) sin seguimiento",
    "Índice de ápnea-hipopnea (AHI) mayor de 5 y menor de 30"
  ];

  subcriteriosD.forEach((subcriterio, index) => {
    const alturaSubcriterio = calcularAlturaDinamica(subcriterio, 145);

    // No aplicar fondo gris - solo los headers de sección llevan fondo gris

    doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX, yCriterios + alturaSubcriterio);
    doc.line(tablaCriteriosInicioX + 155, yCriterios, tablaCriteriosInicioX + 155, yCriterios + alturaSubcriterio);
    doc.line(tablaCriteriosInicioX + 167.5, yCriterios, tablaCriteriosInicioX + 167.5, yCriterios + alturaSubcriterio);
    doc.line(tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaSubcriterio);
    doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios);
    doc.line(tablaCriteriosInicioX, yCriterios + alturaSubcriterio, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaSubcriterio);

    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(subcriterio, tablaCriteriosInicioX + 7, yTextoCriterios + 1, 145);

    const subcriterioSi = datosFinales.riesgoMedio?.criterioD?.subcriterios?.[index]?.si;
    const subcriterioNo = datosFinales.riesgoMedio?.criterioD?.subcriterios?.[index]?.no;
    const subcriterioSiTexto = subcriterioSi ? "X" : "";
    const subcriterioNoTexto = subcriterioNo ? "X" : "";
    doc.text(subcriterioSiTexto, tablaCriteriosInicioX + 160, yTextoCriterios + 1);
    doc.text(subcriterioNoTexto, tablaCriteriosInicioX + 173, yTextoCriterios + 1);

    yCriterios += alturaSubcriterio;
    yTextoCriterios += alturaSubcriterio;
  });

  // Fila: Criterio E
  const textoCriterioE = "Criterio E: Evaluación de vía aérea superior patológico (Mallampati III o IV)";
  const alturaCriterioE = calcularAlturaDinamica(textoCriterioE, 145);

  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX, yCriterios + alturaCriterioE);
  doc.line(tablaCriteriosInicioX + 155, yCriterios, tablaCriteriosInicioX + 155, yCriterios + alturaCriterioE);
  doc.line(tablaCriteriosInicioX + 167.5, yCriterios, tablaCriteriosInicioX + 167.5, yCriterios + alturaCriterioE);
  doc.line(tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaCriterioE);
  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios);
  doc.line(tablaCriteriosInicioX, yCriterios + alturaCriterioE, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaCriterioE);

  dibujarTextoConCriterioNegrita(textoCriterioE, tablaCriteriosInicioX + 7, yTextoCriterios + 1, 145);

  const criterioESi = datosFinales.riesgoMedio?.criterioE?.si;
  const criterioENo = datosFinales.riesgoMedio?.criterioE?.no;
  const criterioESiTexto = criterioESi ? "X" : "";
  const criterioENoTexto = criterioENo ? "X" : "";
  doc.text(criterioESiTexto, tablaCriteriosInicioX + 157, yTextoCriterios + 1);
  doc.text(criterioENoTexto, tablaCriteriosInicioX + 173, yTextoCriterios + 1);
  yCriterios += alturaCriterioE;
  yTextoCriterios += alturaCriterioE;

  // Fila: Acción Requerida para Riesgo Medio
  const anchoDisponibleCriterios = tablaCriteriosAncho - 4; // Ancho disponible menos márgenes

  // Calcular altura dinámica basada en el contenido (más compacta)
  const textoDescripcion = "El paciente TIENE 3 MESES de aptitud TEMPORAL. Requiere pruebas ampliatorias (oximetría, PSG o certificación de cumplimiento de tratamiento de apnea del sueño) antes de emitir aptitud por 12 meses.";
  doc.setFont("helvetica", "normal").setFontSize(6);
  const yFinalDescripcion = dibujarTextoConSaltoLinea(textoDescripcion, tablaCriteriosInicioX + 2, yCriterios + 6, anchoDisponibleCriterios);
  const alturaAccionRiesgoMedio = Math.max(filaAltura + 2, (yFinalDescripcion - yCriterios) + 1);

  // Dibujar fondo naranja
  doc.setFillColor(255, 255, 200); // Naranja personalizado (#f5ae67)
  doc.rect(tablaCriteriosInicioX, yCriterios, tablaCriteriosAncho, alturaAccionRiesgoMedio, 'F');

  // Dibujar líneas de la tabla con altura calculada dinámicamente
  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX, yCriterios + alturaAccionRiesgoMedio);
  doc.line(tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaAccionRiesgoMedio);
  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios);
  doc.line(tablaCriteriosInicioX, yCriterios + alturaAccionRiesgoMedio, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaAccionRiesgoMedio);

  // Dibujar texto DESPUÉS del fondo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Acción Requerida: En Riesgo Medio", tablaCriteriosInicioX + 2, yCriterios + 3);
  doc.setFont("helvetica", "normal").setFontSize(6);
  dibujarTextoConSaltoLinea(textoDescripcion, tablaCriteriosInicioX + 2, yCriterios + 6, anchoDisponibleCriterios);

  yCriterios += alturaAccionRiesgoMedio;
  yTextoCriterios += alturaAccionRiesgoMedio;

  // Fila: RIESGO BAJO
  const alturaFilaRiesgoBajo = filaAltura;

  // Fondo verde para RIESGO BAJO
  doc.setFillColor(200, 255, 200); // Verde claro
  doc.rect(tablaCriteriosInicioX, yCriterios, tablaCriteriosAncho, alturaFilaRiesgoBajo, 'F');

  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX, yCriterios + alturaFilaRiesgoBajo);
  doc.line(tablaCriteriosInicioX + 155, yCriterios, tablaCriteriosInicioX + 155, yCriterios + alturaFilaRiesgoBajo);
  doc.line(tablaCriteriosInicioX + 167.5, yCriterios, tablaCriteriosInicioX + 167.5, yCriterios + alturaFilaRiesgoBajo);
  doc.line(tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaFilaRiesgoBajo);
  doc.line(tablaCriteriosInicioX, yCriterios, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios);
  doc.line(tablaCriteriosInicioX, yCriterios + alturaFilaRiesgoBajo, tablaCriteriosInicioX + tablaCriteriosAncho, yCriterios + alturaFilaRiesgoBajo);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("RIESGO BAJO: APTO para conducir vehículos (ningún criterio positivo)", tablaCriteriosInicioX + 2, yCriterios + 3.5);

  const riesgoBajoSi = datosFinales.riesgoBajo?.si;
  const riesgoBajoNo = datosFinales.riesgoBajo?.no;
  const riesgoBajoSiTexto = riesgoBajoSi ? "X" : "";
  const riesgoBajoNoTexto = riesgoBajoNo ? "X" : "";
  doc.text(riesgoBajoSiTexto, tablaCriteriosInicioX + 157, yCriterios + 3.5);
  doc.text(riesgoBajoNoTexto, tablaCriteriosInicioX + 173, yCriterios + 3.5);
  yCriterios += alturaFilaRiesgoBajo;
  yTextoCriterios += alturaFilaRiesgoBajo;

  // === SECCIÓN DE FIRMA MÉDICA (CONTINUANDO DESDE RIESGO BAJO) ===
  const alturaSeccionFirmaMedica = 20; // Altura para la sección de firma médica (reducida 2 puntos)
  const yFirmaMedica = yCriterios; // Continuar directamente desde donde terminó RIESGO BAJO

  // Calcular altura total de la tabla (firma + observaciones)
  const textoObservacionesCompleto = `Observaciones: ${datosFinales.observaciones || ""}`;
  const alturaObservaciones = Math.max(6, calcularAlturaDinamica(textoObservacionesCompleto, tablaCriteriosAncho - 4));
  const alturaTotalTabla = alturaSeccionFirmaMedica + alturaObservaciones;

  // Dibujar tabla completa (una sola tabla con dos filas)
  // Líneas verticales
  doc.line(tablaCriteriosInicioX, yFirmaMedica, tablaCriteriosInicioX, yFirmaMedica + alturaTotalTabla);
  doc.line(tablaCriteriosInicioX + tablaCriteriosAncho / 2, yFirmaMedica, tablaCriteriosInicioX + tablaCriteriosAncho / 2, yFirmaMedica + alturaSeccionFirmaMedica); // Solo hasta la división de filas
  doc.line(tablaCriteriosInicioX + tablaCriteriosAncho, yFirmaMedica, tablaCriteriosInicioX + tablaCriteriosAncho, yFirmaMedica + alturaTotalTabla);

  // Líneas horizontales
  doc.line(tablaCriteriosInicioX, yFirmaMedica, tablaCriteriosInicioX + tablaCriteriosAncho, yFirmaMedica); // Superior
  doc.line(tablaCriteriosInicioX, yFirmaMedica + alturaSeccionFirmaMedica, tablaCriteriosInicioX + tablaCriteriosAncho, yFirmaMedica + alturaSeccionFirmaMedica); // División entre filas
  doc.line(tablaCriteriosInicioX, yFirmaMedica + alturaTotalTabla, tablaCriteriosInicioX + tablaCriteriosAncho, yFirmaMedica + alturaTotalTabla); // Inferior

  // Fila 1: Información del médico y firma (2 columnas)
  // Columna 1: Información del médico
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nombre y Apellidos del Médico - N° de Colegiatura", tablaCriteriosInicioX + 2, yFirmaMedica + 5);
  doc.text("Firma y Sello", tablaCriteriosInicioX + 2, yFirmaMedica + 9);
  doc.text("CMP", tablaCriteriosInicioX + 2, yFirmaMedica + 13);

  // Columna 2: Firma del médico
  try {
    const x = tablaCriteriosInicioX + tablaCriteriosAncho / 2 + 10;
    const y = yFirmaMedica + 2;
    const firmaMedicoUrl = getSign(data, "SELLOFIRMA")
    doc.addImage(
      firmaMedicoUrl,
      'PNG',
      x + 7, y - 5, 34, 25
    );
  } catch (error) {
    console.log("Error cargando firma del médico:", error);
  }

  // Fila 2: Observaciones/Recomendaciones (fila dinámica)
  const yObservaciones = yFirmaMedica + alturaSeccionFirmaMedica;

  // Dibujar texto de observaciones
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(textoObservacionesCompleto, tablaCriteriosInicioX + 2, yObservaciones + 4, tablaCriteriosAncho - 4);

  // === SECCIÓN DE DECLARACIÓN, FIRMA Y HUELLA (PÁGINA 2) ===
  const yDeclaracion = yFirmaMedica + alturaTotalTabla; // Sin espacio, continuar directamente
  const alturaSeccionDeclaracion = 20; // Altura para la sección de declaración

  // Dibujar las líneas de la sección de declaración (3 columnas)
  doc.line(tablaCriteriosInicioX, yDeclaracion, tablaCriteriosInicioX, yDeclaracion + alturaSeccionDeclaracion); // Línea izquierda
  doc.line(tablaCriteriosInicioX + 60, yDeclaracion, tablaCriteriosInicioX + 60, yDeclaracion + alturaSeccionDeclaracion); // Primera división
  doc.line(tablaCriteriosInicioX + 120, yDeclaracion, tablaCriteriosInicioX + 120, yDeclaracion + alturaSeccionDeclaracion); // Segunda división
  doc.line(tablaCriteriosInicioX + tablaCriteriosAncho, yDeclaracion, tablaCriteriosInicioX + tablaCriteriosAncho, yDeclaracion + alturaSeccionDeclaracion); // Línea derecha
  doc.line(tablaCriteriosInicioX, yDeclaracion, tablaCriteriosInicioX + tablaCriteriosAncho, yDeclaracion); // Línea superior
  doc.line(tablaCriteriosInicioX, yDeclaracion + alturaSeccionDeclaracion, tablaCriteriosInicioX + tablaCriteriosAncho, yDeclaracion + alturaSeccionDeclaracion); // Línea inferior

  // Columna 1: Declaración
  doc.setFont("helvetica", "normal").setFontSize(6);
  const textoDeclaracionP2 = "Declaro que las respuestas son ciertas según mi leal saber y entender. En caso de ser requeridos, los resultados del examen médico pueden ser revelados, en términos generales, al departamento de salud Ocupacional de la compañía. Los resultados pueden ser enviados a mi médico particular de ser considerado necesario.";
  dibujarTextoJustificado(textoDeclaracionP2, tablaCriteriosInicioX + 2, yDeclaracion + 3, 55);

  // Columna 2: Firma
  try {
    const x = tablaCriteriosInicioX + 65;
    const y = yDeclaracion + 2;
    const firmaPaciente = getSign(data, "FIRMAP")
    doc.addImage(
      firmaPaciente,
      'PNG',
      x + 7, y - 5, 34, 25
    );
  } catch (error) {
    console.log("Error cargando firma:", error);
  }



  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Firma del trabajador o postulante", tablaCriteriosInicioX + 90, yDeclaracion + 16.5, { align: "center" });
  doc.text("DNI : " + datosFinales.documentoIdentidad, tablaCriteriosInicioX + 90, yDeclaracion + 19, { align: "center" });

  // Columna 3: Huella digital
  try {
    const x = tablaCriteriosInicioX + 125;
    const y = yDeclaracion + 2;
    const huellaDigital = getSign(data, "HUELLA")
    doc.addImage(
      huellaDigital,
      'PNG',
      x + 20, y - 5, 15, 21
    );
  } catch (error) {
    console.log("Error cargando huella:", error);
  }



  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Indice Derecho", tablaCriteriosInicioX + 155, yDeclaracion + 16.5, { align: "center" });

  // === FOOTER ===
  // Llamar al footer (los datos de prueba están dentro del componente)
  footerTR(doc, { footerOffsetY: 5 });

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

