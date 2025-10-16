import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import { normalizeList } from "../../../utils/listUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import { convertirGenero, getSign } from "../../../utils/helpers.js";
import footerTR from '../../components/footerTR.jsx';

export default function FichaPsicologicaOcupacional_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  // Contador de páginas dinámico
  let numeroPagina = 1;
  
  // Configuración global de la tabla
  const TABLA_INICIO_X = 5;
  const TABLA_ANCHO = 200;

  // Normalizador único de datos de entrada
  function buildDatosFinales(payload) {
    const datosReales = {
      apellidosNombres: String(((payload?.apellidosPaciente ?? '') + ' ' + (payload?.nombresPaciente ?? '')).trim()),
      fechaExamen: formatearFechaCorta(payload?.fechaExamen_fecha ?? ''),
      sexo: convertirGenero(payload?.sexoPaciente ?? ''),
      documentoIdentidad: String(payload?.dniPaciente ?? ''),
      edad: String(payload?.edadPaciente ?? ''),
      fechaNacimiento: formatearFechaCorta(payload?.fechaNacimientoPaciente ?? ''),
      domicilio: String(payload?.direccionPaciente ?? ''),
      evaluacion: String(payload?.nombreExamen ?? ''),
      estadoCivil: String(payload?.estadoCivilPaciente ?? ''),
      motivoEvaluacion: String(payload?.motivoEvaluacion_motivo_eval ?? ''),
      nombreEmpresa: String(payload?.empresa ?? ''),
      actividadEmpresa: String(payload?.mineralExp ?? ''),
      areaTrabajoEmpresa: String(payload?.areaPaciente ?? ''),
      superficie: String((String(payload?.explotacionEn ?? '').toUpperCase() === 'SUPERFICIE') ? 'X' : ''),
      subsuelo: String((String(payload?.explotacionEn ?? '').toUpperCase() === 'SUBSUELO') ? 'X' : ''),
      tiempoLaborando: String(payload?.tiempoTrabajo_timpo_trab ?? ''),
      puestoEmpresa: String(payload?.cargoPaciente ?? ''),
      principalesRiesgos: String(payload?.principalRiesgo_princ_riesgo ?? ''),
      medidasSeguridad: String(payload?.medidasSeguridad_med_seguridad ?? ''),
      anterioresEmpresas: payload?.detalles ?? [],
      areaTrabajo: String(payload?.areaPaciente ?? ''),
      puestoTrabajo: String(payload?.ocupacionPaciente ?? ''),
      empresa: String(payload?.empresa ?? ''),
      contrata: String(payload?.contrata ?? ''),
      sede: String(payload?.sede ?? payload?.nombreSede ?? ''),
      numeroFicha: String(payload?.norden ?? ''),
      codigoEntrevista: String(payload?.codigoAnexo_cod_anexo03 ?? ''),
      color: Number(payload?.color ?? 0),
      codigoColor: String(payload?.codigoColor ?? ''),
      textoColor: String(payload?.textoColor ?? ''),
      // Secciones libres de página 1
      historiaFamiliar: String(payload?.historialFamiliar_hist_familiar ?? ''),
      habitos: String(payload?.habitos_habitos ?? ''),
      otrasObservaciones: String(payload?.otrasObservaciones_otras_observ ?? ''),
      cuerpo: {
        areaIntelectual: payload?.cuerpo?.areaIntelectual,
        areaPersonalidad: payload?.cuerpo?.areaPersonalidad,
        areaOrganicidad: payload?.cuerpo?.areaOrganicidad,
        areaPsicomotricidad: payload?.cuerpo?.areaPsicomotricidad,
        recomendaciones: payload?.cuerpo?.recomendaciones
      },
      apto: true // Por defecto apto, se puede ajustar según lógica de negocio
    };

    // Mapear estructura de Examen Mental desde los campos planos recibidos
    const examenMental = {
      presentacion: {
        adecuado: Boolean(payload?.presentacionAdecuado_rb_adecuado),
        inadecuado: Boolean(payload?.presentacionIndecuado_rb_indecuado)
      },
      postura: {
        erguida: Boolean(payload?.posturaErguida_rb_erguida),
        encorvada: Boolean(payload?.posturaEncorvada_rb_encorvada)
      },
      ritmo: {
        lento: Boolean(payload?.ritmoLento_rb_lento),
        rapido: Boolean(payload?.ritmoRapido_rb_rapido),
        fluido: Boolean(payload?.ritmoFluido_rb_fluido)
      },
      tono: {
        bajo: Boolean(payload?.tonoBajo_rb_bajo),
        moderado: Boolean(payload?.tonoModerado_rb_moderado),
        alto: Boolean(payload?.tonoAlto_rb_alto)
      },
      articulacion: {
        conDificultad: Boolean(payload?.articulacionConDificultad_rb_condificultad),
        sinDificultad: Boolean(payload?.articulacionSinDificultad_rb_sindificultad)
      },
      orientacion: {
        tiempo: {
          orientado: Boolean(payload?.tiempoOrientado_rb_torientado),
          desorientado: Boolean(payload?.tiempoDesorientado_rb_tdesorientado)
        },
        espacio: {
          orientado: Boolean(payload?.espacioOrientado_rb_eorientado),
          desorientado: Boolean(payload?.espacioDesorientado_rb_edesorientado)
        },
        persona: {
          orientado: Boolean(payload?.personaOrientado_rb_porientado),
          desorientado: Boolean(payload?.personaDesorientado_rb_pdesorientado)
        }
      },
      procesosCognitivos: {
        lucidoAtento: String(payload?.lucido_lucido ?? ''),
        pensamiento: String(payload?.pensamiento_pensamiento ?? ''),
        percepcion: String(payload?.percepcion_percepcion ?? ''),
        memoria: {
          cortoPlazo: Boolean(payload?.memoriaCortoPlazo_rb_cortoplazo),
          medianoPlazo: Boolean(payload?.memoriaMedianoPlazo_rb_medianoplazo),
          largoPlazo: Boolean(payload?.memoriaLargoPlazo_rb_largoplazo)
        },
        inteligencia: {
          muySuperior: Boolean(payload?.inteligenciaMuySuperior_rb_muysuperior),
          superior: Boolean(payload?.inteligenciaSuperior_rb_superior),
          normalBrillante: Boolean(payload?.inteligenciaNormal_rb_normal),
          promedio: Boolean(payload?.inteligenciaPromedio_rb_promedio),
          nTorpe: Boolean(payload?.inteligenciaTorpe_rb_torpe),
          fronterizo: Boolean(payload?.inteligenciaFronterizo_rb_fronterizo),
          rmLeve: Boolean(payload?.inteligenciaRMLeve_rb_rleve),
          rmModerado: Boolean(payload?.inteligenciaRMModerado_rb_rmoderado),
          rmSevero: Boolean(payload?.inteligenciaRMSevero_rb_rsevero),
          rmProfundo: Boolean(payload?.inteligenciaRMProfundo_rb_rprofundo)
        }
      },
      evaluacionAdicional: {
        apetito: String(payload?.apetito_apetito ?? ''),
        sueno: String(payload?.sueno_sueno ?? ''),
        personalidad: String(payload?.personalidad_personalidad ?? ''),
        afectividad: String(payload?.afectividad_afectividad ?? ''),
        conductaSexual: String(payload?.conductaSexual_conducta_sexual ?? '')
      },
      inventarios: {
        'Inventario Millón de Estilos de Personalidad - MIPS': String(payload?.puntajeMips_puntaje1 ?? '').toUpperCase() === 'X',
        'Escala de Motivaciones Psicosociales - MPS': String(payload?.puntajeMps_puntaje2 ?? '').toUpperCase() === 'X',
        'Luria - DNA Diagnóstico neuropsicológico de Adultos': String(payload?.puntajeDna_puntaje3 ?? '').toUpperCase() === 'X',
        'Escala de Apreciación del Estrés EAE': String(payload?.puntajeEAE_puntaje4 ?? '').toUpperCase() === 'X',
        'Inventario de Burnout de Maslach': String(payload?.puntajeInventarioBormout_puntaje5 ?? '').toUpperCase() === 'X',
        'Clima laboral': String(payload?.puntajeClimaLaboral_puntaje6 ?? '').toUpperCase() === 'X',
        'Batería de Conductores': String(payload?.puntajeBacteriaConductores_puntaje7 ?? '').toUpperCase() === 'X',
        'WAIS': String(payload?.puntajeWais_puntaje8 ?? '').toUpperCase() === 'X',
        'Test BENTON': String(payload?.puntajeBenton_puntaje9 ?? '').toUpperCase() === 'X',
        'Test Bender': String(payload?.puntajeBender_puntaje10 ?? '').toUpperCase() === 'X',
        'Inventario de la ansiedad ZUNG': String(payload?.puntajeAnsiedadZung_puntaje11 ?? '').toUpperCase() === 'X',
        'Inventario de Depresión ZUNG': String(payload?.puntajeDepresionZung_puntaje12 ?? '').toUpperCase() === 'X',
        'Escala de Memoria de Wechsler': String(payload?.puntajeEscalaMemoriaWechsler_puntaje13 ?? '').toUpperCase() === 'X'
      },
      otrasPruebas: []
    };

    // Diagnóstico final
    examenMental.diagnosticoFinal = {
      areaCognitiva: String(payload?.areaCognitiva_area_cognitiva ?? ''),
      areaEmocional: String(payload?.areaEmocional_area_emocional ?? '')
    };

    datosReales.examenMental = examenMental;

    const selected = datosReales;
    // Asegurar que las secciones de cuerpo sean arrays listables
    selected.cuerpo = {
      areaIntelectual: normalizeList(selected.cuerpo.areaIntelectual),
      areaPersonalidad: normalizeList(selected.cuerpo.areaPersonalidad),
      areaOrganicidad: normalizeList(selected.cuerpo.areaOrganicidad),
      areaPsicomotricidad: normalizeList(selected.cuerpo.areaPsicomotricidad),
      recomendaciones: normalizeList(selected.cuerpo.recomendaciones)
    };
    return selected;
  }

  const datosFinales = buildDatosFinales(data);

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Títulos
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("ANEXO N° 03", pageW / 2, 28, { align: "center" });
    doc.text("FICHA PSICOLOGICA OCUPACIONAL", pageW / 2, 32, { align: "center" });

    // Número de Ficha, Sede, Fecha y Página
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 70, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 50, 16);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosFinales.sede, pageW - 70, 20);
    doc.text("Fecha de examen: " + (datosFinales.fechaExamen || ""), pageW - 70, 25);
    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 25, 8);

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

  // Función para calcular altura dinámica del texto
  const calcularAlturaTexto = (texto, anchoMaximo, alturaMinima = 10) => {
    if (!texto || texto.trim() === '') return alturaMinima;
    
    const fontSize = doc.internal.getFontSize();
    let lineas = 0;
    
    // Si el texto contiene saltos de línea (listas), procesar cada línea por separado
    if (texto.includes('\n')) {
      const lineasTexto = texto.split('\n');
      lineasTexto.forEach(linea => {
        if (linea.trim()) {
          const palabras = linea.split(' ');
          let lineaActual = '';
          
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
          
          if (lineaActual) {
            lineas++;
          }
        }
      });
    } else {
      // Texto normal sin saltos de línea
      const palabras = texto.split(' ');
      let lineaActual = '';
      
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
      
      if (lineaActual) {
        lineas++;
      }
    }
    
    // Calcular altura: padding superior + (líneas * altura por línea) + padding inferior
    const alturaCalculada = 3 + (lineas * fontSize * 0.35) + 3;
    return Math.max(alturaCalculada, alturaMinima);
  };

  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    const tablaInicioX = TABLA_INICIO_X;
    const tablaAncho = TABLA_ANCHO;
    
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
    
    // Dibujar texto del título con posición más baja
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);
    
    return yPos + alturaHeader;
  };

  // Función para dibujar subheader con color celeste
  const dibujarSubHeaderCeleste = (titulo, yPos, alturaHeader = 5) => {
    const tablaInicioX = TABLA_INICIO_X;
    const tablaAncho = TABLA_ANCHO;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar fondo celeste
    doc.setFillColor(173, 216, 230); // Color celeste claro
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    
    // Dibujar líneas del subheader
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
    
    // Dibujar texto del subtítulo
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);
    
    return yPos + alturaHeader;
  };

  // === PÁGINA 1 ===
  drawHeader(numeroPagina);

  // === SECCIÓN 1: DATOS DE FILIACIÓN ===
  const tablaInicioX = TABLA_INICIO_X;
  const tablaAncho = TABLA_ANCHO;
  let yPos = 35;
  const filaAltura = 5;

  // Header de datos de filiación
  yPos = dibujarHeaderSeccion("I. DATOS PERSONALES", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres, Tipo de Evaluación (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Estado Civil (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Tercera fila: Fecha Nacimiento, Domicilio (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Cuarta fila: Área de Trabajo, Puesto de Trabajo (2 columnas)
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

  // Sexta fila: Contratista (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 35 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres, Tipo de Evaluación
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 1.5, 70);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Evaluación:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.evaluacion, tablaInicioX + 160, yTexto + 1.5, 35);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Estado Civil
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 10, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.edad + " Años", tablaInicioX + 58, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.sexo, tablaInicioX + 105, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Estado Civil:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.estadoCivil, tablaInicioX + 160, yTexto + 1.5);
  yTexto += filaAltura;

  // Tercera fila: Fecha Nacimiento, Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento, tablaInicioX + 22, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.domicilio, tablaInicioX + 115, yTexto + 1.5, 65);
  yTexto += filaAltura;

  // Cuarta fila: Área de Trabajo, Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo, tablaInicioX + 30, yTexto + 1.5, 50);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo, tablaInicioX + 122, yTexto + 1.5, 65);
  yTexto += filaAltura;

  // Quinta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 25);
  yTexto += filaAltura;

  // Sexta fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.contrata, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // === SECCIÓN 2: MOTIVO DE EVALUACIÓN ===
  // Header de motivo de evaluación con texto más abajo
  
  // Configurar líneas con grosor consistente
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  
  // Dibujar fondo gris más oscuro
  doc.setFillColor(160, 160, 160);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  
  // Dibujar líneas del header
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Dibujar texto del título con posición más baja
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("II. MOTIVO DE EVALUACIÓN", tablaInicioX + 2, yPos + 3.5);
  
  yPos += filaAltura;

  // Calcular altura dinámica para el texto del motivo
  const motivoTexto = datosFinales.motivoEvaluacion || '';
  const anchoMaximoMotivo = tablaAncho - 4;
  const alturaMotivo = calcularAlturaTexto(motivoTexto, anchoMaximoMotivo, 10);

  // Dibujar fila de contenido con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaMotivo);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaMotivo);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaMotivo, tablaInicioX + tablaAncho, yPos + alturaMotivo);

  // Dibujar texto del motivo
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(motivoTexto, tablaInicioX + 2, yPos + 3.5, anchoMaximoMotivo);

  yPos += alturaMotivo;

  // === SECCIÓN 3: DATOS OCUPACIONALES ===
  // Header de datos ocupacionales
  yPos = dibujarHeaderSeccion("III. DATOS OCUPACIONALES", yPos, filaAltura);

  // Subheader de empresa actual
  yPos = dibujarSubHeaderCeleste("3.1. EMPRESA ACTUAL(postula, trabaja o trabajó)", yPos, filaAltura);

  // === CONTENIDO DE DATOS OCUPACIONALES ===
  
  // Primera fila: Nombre de la Empresa
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Nombre de la Empresa:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.nombreEmpresa, tablaInicioX + 40, yPos + 3.5, tablaAncho - 50);
  yPos += filaAltura;

  // Segunda fila: Actividad Empresa
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Actividad Empresa:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.actividadEmpresa, tablaInicioX + 40, yPos + 3.5, tablaAncho - 40);
  yPos += filaAltura;

  // Tercera fila: Área de Trabajo
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajoEmpresa, tablaInicioX + 40, yPos + 3.5, tablaAncho - 40);
  yPos += filaAltura;

  // Cuarta fila: Superficie | Subsuelo | Tiempo Total Laborando (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Superficie:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.superficie, tablaInicioX + 20, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Subsuelo:", tablaInicioX + 62, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.subsuelo, tablaInicioX + 80, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Tiempo Total Laborando:", tablaInicioX + 122, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.tiempoLaborando , tablaInicioX + 170, yPos + 3.5);
  yPos += filaAltura;

  // Quinta fila: Puesto
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.puestoEmpresa, tablaInicioX + 20, yPos + 3.5, tablaAncho - 20);
  yPos += filaAltura;

  // === SUBSECCIÓN: PRINCIPALES RIESGOS ===
  // Subheader de principales riesgos
  yPos = dibujarSubHeaderCeleste("Principales Riesgos:", yPos, filaAltura);

  // Calcular altura dinámica para el texto de riesgos
  const riesgosTexto = datosFinales.principalesRiesgos || '';
  const anchoMaximoRiesgos = tablaAncho - 4;
  const alturaRiesgos = calcularAlturaTexto(riesgosTexto, anchoMaximoRiesgos, 10);

  // Dibujar fila de contenido con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaRiesgos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaRiesgos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaRiesgos, tablaInicioX + tablaAncho, yPos + alturaRiesgos);

  // Dibujar texto de riesgos
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(riesgosTexto, tablaInicioX + 2, yPos + 3.5, anchoMaximoRiesgos);

  yPos += alturaRiesgos;

  // === SUBSECCIÓN: MEDIDAS DE SEGURIDAD ===
  // Subheader de medidas de seguridad
  yPos = dibujarSubHeaderCeleste("Medidas de Seguridad:", yPos, filaAltura);

  // Calcular altura dinámica para el texto de medidas
  const medidasTexto = datosFinales.medidasSeguridad || '';
  const anchoMaximoMedidas = tablaAncho - 4;
  const alturaMedidas = calcularAlturaTexto(medidasTexto, anchoMaximoMedidas, 10);

  // Dibujar fila de contenido con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaMedidas);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaMedidas);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaMedidas, tablaInicioX + tablaAncho, yPos + alturaMedidas);

  // Dibujar texto de medidas
  doc.setFont("helvetica", "normal").setFontSize(7);
  dibujarTextoConSaltoLinea(medidasTexto, tablaInicioX + 2, yPos + 3.5, anchoMaximoMedidas);

  yPos += alturaMedidas;

  // === SUBSECCIÓN: ANTERIORES EMPRESAS ===
  // Subheader de anteriores empresas
  yPos = dibujarSubHeaderCeleste("3.2. Anteriores Empresas:", yPos, filaAltura);

  // Crear tabla de anteriores empresas con 6 columnas principales
  const columnasAnterioresEmpresas = [
    { ancho: 25, titulo: "FECHA" },
    { ancho: 45, titulo: "NOMBRE DE LA EMPRESA" },
    { ancho: 30, titulo: "ACT. EMPRESA" },
    { ancho: 25, titulo: "PUESTO" },
    { ancho: 20, titulo: "TIEMPO" }, // Esta se dividirá en SUP/SUB
    { ancho: 45, titulo: "CAUSA DEL RETIRO" }
  ];

  // Dibujar header principal de la tabla (altura aumentada)
  const headerAltura = filaAltura + 2;
  let xPos = tablaInicioX;
  
  // Dibujar columnas principales
  columnasAnterioresEmpresas.forEach((columna, index) => {
    doc.line(xPos, yPos, xPos, yPos + headerAltura);
    // Solo dibujar línea derecha si no es la última columna
    if (index < columnasAnterioresEmpresas.length - 1) {
      doc.line(xPos + columna.ancho, yPos, xPos + columna.ancho, yPos + headerAltura);
    }
    
    // Dibujar texto del header
    doc.setFont("helvetica", "bold").setFontSize(7);
    
    if (index === 4) { // Columna TIEMPO
      // Centrar "TIEMPO" horizontalmente en la celda
      const tiempoTextoAncho = doc.getTextWidth("TIEMPO");
      const tiempoXCentrado = xPos + (columna.ancho - tiempoTextoAncho) / 2;
      doc.text("TIEMPO", tiempoXCentrado, yPos + 2.5);
      
      // Dibujar línea horizontal que toque completamente los bordes de la celda
      doc.setLineWidth(0.2);
      doc.line(xPos, yPos + 3.5, xPos + columna.ancho, yPos + 3.5);
      
      // Dibujar líneas verticales para dividir SUP/SUB
      doc.line(xPos + columna.ancho/2, yPos + 3.5, xPos + columna.ancho/2, yPos + headerAltura);
      
      // Dibujar SUP y SUB movidos un punto a la derecha
      doc.setFont("helvetica", "bold").setFontSize(7);
      doc.text("SUP", xPos + 2, yPos + 6);
      doc.text("SUB", xPos + columna.ancho/2 + 2, yPos + 6);
    } else {
      // Para las demás columnas, centrar texto horizontalmente
      const textoAncho = doc.getTextWidth(columna.titulo);
      const textoXCentrado = xPos + (columna.ancho - textoAncho) / 2;
      doc.text(columna.titulo, textoXCentrado, yPos + 4);
    }
    
    xPos += columna.ancho;
  });
  
  // Dibujar línea derecha final de la tabla
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + headerAltura);
  
  // Dibujar líneas horizontales del header principal
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + headerAltura, tablaInicioX + tablaAncho, yPos + headerAltura);
  
  // Dibujar línea doble en la parte inferior del header
  doc.setLineWidth(0.3);
  doc.line(tablaInicioX, yPos + headerAltura, tablaInicioX + tablaAncho, yPos + headerAltura);
  doc.setLineWidth(0.2);
  
  yPos += headerAltura;

  // === FILAS DE DATOS ===
  // Usar datos reales de anterioresEmpresas (detalles)
  const datosEjemplo = datosFinales.anterioresEmpresas || [];

  // Dibujar todas las filas de datos
  const filaDatosAltura = 8; // Altura suficiente para texto con salto de línea
  
  datosEjemplo.forEach((fila) => {
    // Dibujar líneas verticales de la fila
    let xPosDatos = tablaInicioX;
    columnasAnterioresEmpresas.forEach((columna, index) => {
      doc.line(xPosDatos, yPos, xPosDatos, yPos + filaDatosAltura);
      if (index < columnasAnterioresEmpresas.length - 1) {
        doc.line(xPosDatos + columna.ancho, yPos, xPosDatos + columna.ancho, yPos + filaDatosAltura);
      }
      xPosDatos += columna.ancho;
    });
    
    // Dibujar línea derecha final
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaDatosAltura);
    
    // Dibujar líneas horizontales
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaDatosAltura, tablaInicioX + tablaAncho, yPos + filaDatosAltura);
    
    // Dibujar líneas de la columna TIEMPO para dividir SUP/SUB
    const tiempoX = tablaInicioX + columnasAnterioresEmpresas[0].ancho + columnasAnterioresEmpresas[1].ancho + columnasAnterioresEmpresas[2].ancho + columnasAnterioresEmpresas[3].ancho;
    doc.line(tiempoX, yPos, tiempoX, yPos + filaDatosAltura);
    doc.line(tiempoX + columnasAnterioresEmpresas[4].ancho, yPos, tiempoX + columnasAnterioresEmpresas[4].ancho, yPos + filaDatosAltura);
    
    // Dibujar línea vertical del medio para dividir SUP/SUB
    doc.line(tiempoX + columnasAnterioresEmpresas[4].ancho/2, yPos, tiempoX + columnasAnterioresEmpresas[4].ancho/2, yPos + filaDatosAltura);
    
    // Dibujar contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(6.5);
    
    // Calcular posiciones X dinámicamente
    let xPosTexto = tablaInicioX;
    
    // FECHA (centrada)
    const fechaTextoAncho = doc.getTextWidth(fila.fecha || '');
    const fechaXCentrado = xPosTexto + (columnasAnterioresEmpresas[0].ancho - fechaTextoAncho) / 2;
    doc.text(fila.fecha || '', fechaXCentrado, yPos + 3);
    xPosTexto += columnasAnterioresEmpresas[0].ancho;
    
    // NOMBRE DE LA EMPRESA (con salto de línea)
    dibujarTextoConSaltoLinea(fila.empresa || '', xPosTexto + 1, yPos + 3, columnasAnterioresEmpresas[1].ancho - 2);
    xPosTexto += columnasAnterioresEmpresas[1].ancho;
    
    // ACT. EMPRESA (con salto de línea)
    dibujarTextoConSaltoLinea(fila.actividad || '', xPosTexto + 1, yPos + 3, columnasAnterioresEmpresas[2].ancho - 2);
    xPosTexto += columnasAnterioresEmpresas[2].ancho;
    
    // PUESTO (mostrar ocupación del detalle)
    dibujarTextoConSaltoLinea((fila.ocupacion || fila.puesto || ''), xPosTexto + 1, yPos + 3, columnasAnterioresEmpresas[3].ancho - 2);
    xPosTexto += columnasAnterioresEmpresas[3].ancho;
    
    // TIEMPO - SUP y SUB (con "años" y centrados)
    const tiempoSupTexto = (fila.tiempoSup || '0') + " años";
    const tiempoSubTexto = (fila.tiempoSub || '0') + " años";
    const tiempoColAncho = columnasAnterioresEmpresas[4].ancho;
    
    // SUP (centrado en su sub-celda)
    const supTextoAncho = doc.getTextWidth(tiempoSupTexto);
    const supXCentrado = xPosTexto + (tiempoColAncho / 2 - supTextoAncho) / 2;
    doc.text(tiempoSupTexto, supXCentrado, yPos + 3);
    
    // SUB (centrado en su sub-celda)
    const subTextoAncho = doc.getTextWidth(tiempoSubTexto);
    const subXCentrado = xPosTexto + tiempoColAncho / 2 + (tiempoColAncho / 2 - subTextoAncho) / 2;
    doc.text(tiempoSubTexto, subXCentrado, yPos + 3);
    
    xPosTexto += columnasAnterioresEmpresas[4].ancho;
    
    // CAUSA DEL RETIRO (con salto de línea)
    dibujarTextoConSaltoLinea(fila.causaRetiro || '', xPosTexto + 1, yPos + 3, columnasAnterioresEmpresas[5].ancho - 2);
    
    yPos += filaDatosAltura;
  });

  // === SECCIÓN 4: HISTORIA FAMILIAR ===
  // Header de historia familiar
  yPos = dibujarHeaderSeccion("IV. HISTORIA FAMILIAR", yPos, filaAltura);

  // Contenido de historia familiar con altura dinámica
  const historiaFamiliarTexto = datosFinales.historiaFamiliar || 'No se registra información ';
  const anchoMaximoHistoria = tablaAncho - 4;
  const alturaHistoria = calcularAlturaTexto(historiaFamiliarTexto, anchoMaximoHistoria, 10);

  // Dibujar fila de contenido con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHistoria);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHistoria);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaHistoria, tablaInicioX + tablaAncho, yPos + alturaHistoria);

  // Dibujar texto de historia familiar
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(historiaFamiliarTexto, tablaInicioX + 2, yPos + 3.5, anchoMaximoHistoria);

  yPos += alturaHistoria;

  // === SECCIÓN 5: HÁBITOS ===
  // Header de hábitos
  yPos = dibujarHeaderSeccion("V. HÁBITOS (pasatiempos, consumo de tabaco, alcohol y/o drogas)", yPos, filaAltura);

  // Contenido de hábitos con altura dinámica
  const habitosTexto = datosFinales.habitos || 'El paciente refiere tener hábitos saludables.';
  const anchoMaximoHabitos = tablaAncho - 4;
  const alturaHabitos = calcularAlturaTexto(habitosTexto, anchoMaximoHabitos, 10);

  // Dibujar fila de contenido con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHabitos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHabitos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaHabitos, tablaInicioX + tablaAncho, yPos + alturaHabitos);

  // Dibujar texto de hábitos
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(habitosTexto, tablaInicioX + 2, yPos + 3.5, anchoMaximoHabitos);

  yPos += alturaHabitos;

  // === SECCIÓN 6: OTRAS OBSERVACIONES ===
  // Header de otras observaciones
  yPos = dibujarHeaderSeccion("VI. OTRAS OBSERVACIONES", yPos, filaAltura);

  // Contenido de otras observaciones (puede ser texto o lista)
  const otrasObservacionesRaw = datosFinales.otrasObservaciones || 'El paciente presenta un perfil psicológico adecuado para el puesto solicitado / Se observa buena capacidad de concentración y atención durante la evaluación / Muestra actitud colaborativa y disposición para el trabajo en equipo / No se evidencian signos de ansiedad o estrés significativo / Se recomienda seguimiento psicológico periódico según protocolo de la empresa';
  
  // Procesar si viene como lista separada por "/"
  let otrasObservacionesTexto;
  if (typeof otrasObservacionesRaw === 'string' && otrasObservacionesRaw.includes('/')) {
    // Convertir lista separada por "/" en texto con viñetas
    const listaItems = otrasObservacionesRaw.split('/').map(item => item.trim()).filter(item => item);
    otrasObservacionesTexto = listaItems.map(item => `• ${item}`).join('\n');
  } else {
    otrasObservacionesTexto = otrasObservacionesRaw;
  }
  
  const anchoMaximoObservaciones = tablaAncho - 4;
  const alturaObservaciones = calcularAlturaTexto(otrasObservacionesTexto, anchoMaximoObservaciones, 10);

  // Dibujar fila de contenido con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaObservaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaObservaciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaObservaciones, tablaInicioX + tablaAncho, yPos + alturaObservaciones);

  // Dibujar texto de otras observaciones (manejar listas con viñetas)
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  if (otrasObservacionesTexto.includes('\n')) {
    // Es una lista con viñetas, dibujar línea por línea
    const lineas = otrasObservacionesTexto.split('\n');
    let yPosTexto = yPos + 3.5;
    
    lineas.forEach(linea => {
      if (linea.trim()) {
        dibujarTextoConSaltoLinea(linea, tablaInicioX + 2, yPosTexto, anchoMaximoObservaciones);
        yPosTexto += doc.internal.getFontSize() * 0.35;
      }
    });
  } else {
    // Es texto normal
    dibujarTextoConSaltoLinea(otrasObservacionesTexto, tablaInicioX + 2, yPos + 3.5, anchoMaximoObservaciones);
  }

  yPos += alturaObservaciones;

  // === FOOTER PÁGINA 1 ===
  footerTR(doc, { footerOffsetY: 5 });

  // === PÁGINA 2 ===
  doc.addPage();
  numeroPagina = 2;
  drawHeader(numeroPagina);

  // Resetear posición Y para la nueva página
  yPos = 35;

  // === SECCIÓN 6: EXAMEN MENTAL ===
  // Header de examen mental
  yPos = dibujarHeaderSeccion("VII. EXAMEN MENTAL", yPos, filaAltura);

  // === SUBSECCIÓN 7.1: OBSERVACIÓN DE CONDUCTAS ===
  // Fila celeste dividida más hacia la derecha
  const filaCelesteAltura = 5;
  const mitadAncho = tablaAncho * 0.60; // 60% para la izquierda, 40% para la derecha
  
  // Dibujar fondo celeste
  doc.setFillColor(173, 216, 230); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaCelesteAltura, 'F');
  
  // Dibujar líneas de la fila
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaCelesteAltura);
  doc.line(tablaInicioX + mitadAncho, yPos, tablaInicioX + mitadAncho, yPos + filaCelesteAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaCelesteAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaCelesteAltura, tablaInicioX + tablaAncho, yPos + filaCelesteAltura);
  
  // Dibujar texto "7.1. OBSERVACIÓN DE CONDUCTAS" en la mitad izquierda
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("7.1. OBSERVACIÓN DE CONDUCTAS", tablaInicioX + 2, yPos + 3.5);
  
  // Dibujar header "Nombre | ptje" en la mitad derecha
  const anchoTablaInventarios = tablaAncho - mitadAncho; // Usar el 40% restante
  const columnaNombreAncho = anchoTablaInventarios - 10; // Dejar 8mm para ptje (reducido de 15mm)
  doc.line(tablaInicioX + mitadAncho + columnaNombreAncho, yPos, tablaInicioX + mitadAncho + columnaNombreAncho, yPos + filaCelesteAltura);
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NOMBRE", tablaInicioX + mitadAncho + 1, yPos + 3.5);
  doc.text("PTJE", tablaInicioX + mitadAncho + columnaNombreAncho + 1.5, yPos + 3.5);
  
  yPos += filaCelesteAltura;

  // Guardar la posición para la tabla de inventarios (debe empezar inmediatamente después del header)
  const yPosInventarios = yPos;

  // === TABLA DE OBSERVACIÓN DE CONDUCTAS EN LA MITAD IZQUIERDA ===
  const examenMental = datosFinales.examenMental || {};
  
  const observacionesConductas = [
    {
      titulo: "Presentación:",
      opciones: ["Adecuado", "Inadecuado"],
      valores: [examenMental.presentacion?.adecuado || false, examenMental.presentacion?.inadecuado || false]
    },
    {
      titulo: "Postura:",
      opciones: ["Erguida", "Encorvada"],
      valores: [examenMental.postura?.erguida || false, examenMental.postura?.encorvada || false]
    }
  ];

  // Subcategorías de Postura (Ritmo y Tono)
  const posturas = [
    { 
      subtitulo: "Ritmo:", 
      opciones: ["lento", "rapido", "fluido"], 
      valores: [examenMental.ritmo?.lento || false, examenMental.ritmo?.rapido || false, examenMental.ritmo?.fluido || false]
    },
    { 
      subtitulo: "Tono:", 
      opciones: ["Bajo", "Moderado", "Alto"], 
      valores: [examenMental.tono?.bajo || false, examenMental.tono?.moderado || false, examenMental.tono?.alto || false]
    }
  ];

  // Articulación después de Tono
  const articulacion = {
    titulo: "Articulación:",
    opciones: ["con dificultad", "sin dificultad"],
    valores: [examenMental.articulacion?.conDificultad || false, examenMental.articulacion?.sinDificultad || false]
  };

  const filaObservacionAltura = 5;
  const anchoMitadIzquierda = mitadAncho; // Usar solo la mitad izquierda
  
  observacionesConductas.forEach((observacion) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaObservacionAltura);
    doc.line(tablaInicioX + anchoMitadIzquierda, yPos, tablaInicioX + anchoMitadIzquierda, yPos + filaObservacionAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + anchoMitadIzquierda, yPos);
    doc.line(tablaInicioX, yPos + filaObservacionAltura, tablaInicioX + anchoMitadIzquierda, yPos + filaObservacionAltura);
    
    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(observacion.titulo, tablaInicioX + 1, yPos + 3.5);
    
    // Dibujar opciones con X marcada (usar el mismo espacio que las demás filas)
    const espacioTitulo = 25; // Mismo espacio que orientación y articulación
    const anchoOpcion = (anchoMitadIzquierda - espacioTitulo) / observacion.opciones.length;
    
    observacion.opciones.forEach((opcion, opcionIndex) => {
      const xOpcion = tablaInicioX + espacioTitulo + (opcionIndex * anchoOpcion);
      
      // Dibujar línea vertical para separar opciones (incluyendo la primera)
      doc.line(xOpcion, yPos, xOpcion, yPos + filaObservacionAltura);
      
      // Dibujar texto de la opción
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(opcion, xOpcion + 1, yPos + 3.5);
      
      // Dibujar X si está seleccionado (usar valores booleanos)
      if (observacion.valores[opcionIndex]) {
        doc.setFont("helvetica", "bold").setFontSize(10);
        doc.text("X", xOpcion + anchoOpcion - 5, yPos + 3.5);
      }
    });
    
    // Dibujar línea vertical final para cerrar la última columna
    const xFinal = tablaInicioX + espacioTitulo + (observacion.opciones.length * anchoOpcion);
    doc.line(xFinal, yPos, xFinal, yPos + filaObservacionAltura);
    
    yPos += filaObservacionAltura;
  });

  // === SECCIÓN ESPECIAL: POSTURA (Ritmo y Tono) ===
  // Dibujar subcategorías de postura
  const espacioTituloPostura = 25;
  posturas.forEach((postura) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaObservacionAltura);
    doc.line(tablaInicioX + anchoMitadIzquierda, yPos, tablaInicioX + anchoMitadIzquierda, yPos + filaObservacionAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + anchoMitadIzquierda, yPos);
    doc.line(tablaInicioX, yPos + filaObservacionAltura, tablaInicioX + anchoMitadIzquierda, yPos + filaObservacionAltura);
    
    // Dibujar subtítulo (Ritmo:, Tono:)
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(postura.subtitulo, tablaInicioX + 1, yPos + 3.5);
    
    // Dibujar línea vertical después del subtítulo
    doc.line(tablaInicioX + espacioTituloPostura, yPos, tablaInicioX + espacioTituloPostura, yPos + filaObservacionAltura);
    
    // Dibujar opciones
    const anchoOpcionPostura = (anchoMitadIzquierda - espacioTituloPostura) / postura.opciones.length;
    
    postura.opciones.forEach((opcion, opcionIndex) => {
      const xOpcion = tablaInicioX + espacioTituloPostura + (opcionIndex * anchoOpcionPostura);
      
      // Dibujar línea vertical para separar opciones
      doc.line(xOpcion, yPos, xOpcion, yPos + filaObservacionAltura);
      
      // Dibujar texto de la opción
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(opcion, xOpcion + 1, yPos + 3.5);
      
      // Dibujar X si está seleccionado (usar valores booleanos)
      if (postura.valores[opcionIndex]) {
        doc.setFont("helvetica", "bold").setFontSize(10);
        doc.text("X", xOpcion + anchoOpcionPostura - 5, yPos + 3.5);
      }
    });
    
    // Dibujar línea vertical final para cerrar la última columna
    const xFinalPostura = tablaInicioX + espacioTituloPostura + (postura.opciones.length * anchoOpcionPostura);
    doc.line(xFinalPostura, yPos, xFinalPostura, yPos + filaObservacionAltura);
    
    yPos += filaObservacionAltura;
  });

  // === ARTICULACIÓN DESPUÉS DE TONO ===
  // Dibujar fila de Articulación
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaObservacionAltura);
  doc.line(tablaInicioX + anchoMitadIzquierda, yPos, tablaInicioX + anchoMitadIzquierda, yPos + filaObservacionAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + anchoMitadIzquierda, yPos);
  doc.line(tablaInicioX, yPos + filaObservacionAltura, tablaInicioX + anchoMitadIzquierda, yPos + filaObservacionAltura);
  
  // Dibujar título "Articulación:"
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(articulacion.titulo, tablaInicioX + 1, yPos + 3.5);
  
  // Dibujar opciones (usar el mismo espacio que las subcategorías de orientación)
  const espacioTituloArticulacion = 25; // Mismo espacio que orientación
  const anchoOpcionArticulacion = (anchoMitadIzquierda - espacioTituloArticulacion) / articulacion.opciones.length;
  
  articulacion.opciones.forEach((opcion, opcionIndex) => {
    const xOpcion = tablaInicioX + espacioTituloArticulacion + (opcionIndex * anchoOpcionArticulacion);
    
    // Dibujar línea vertical para separar opciones
    doc.line(xOpcion, yPos, xOpcion, yPos + filaObservacionAltura);
    
    // Dibujar texto de la opción
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(opcion, xOpcion + 1, yPos + 3.5);
    
    // Dibujar X si está seleccionado (usar valores booleanos)
    if (articulacion.valores[opcionIndex]) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", xOpcion + anchoOpcionArticulacion - 5, yPos + 3.5);
    }
  });
  
  // Dibujar línea vertical final para cerrar la última columna
  const xFinalArticulacion = tablaInicioX + espacioTituloArticulacion + (articulacion.opciones.length * anchoOpcionArticulacion);
  doc.line(xFinalArticulacion, yPos, xFinalArticulacion, yPos + filaObservacionAltura);
  
  yPos += filaObservacionAltura;

  // === SECCIÓN ESPECIAL: ORIENTACIÓN ===
  const orientaciones = [
    { 
      subtitulo: "Tiempo:", 
      opciones: ["Orientado", "Desorientado"], 
      valores: [examenMental.orientacion?.tiempo?.orientado || false, examenMental.orientacion?.tiempo?.desorientado || false]
    },
    { 
      subtitulo: "Espacio:", 
      opciones: ["Orientado", "Desorientado"], 
      valores: [examenMental.orientacion?.espacio?.orientado || false, examenMental.orientacion?.espacio?.desorientado || false]
    },
    { 
      subtitulo: "Persona:", 
      opciones: ["Orientado", "Desorientado"], 
      valores: [examenMental.orientacion?.persona?.orientado || false, examenMental.orientacion?.persona?.desorientado || false]
    }
  ];

  // Dibujar fila principal de Orientación (celeste, sin división)
  // Dibujar fondo celeste
  doc.setFillColor(173, 216, 230); // Color celeste claro
  doc.rect(tablaInicioX, yPos, anchoMitadIzquierda, filaObservacionAltura, 'F');
  
  // Dibujar líneas de la fila (sin división vertical interna)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaObservacionAltura);
  doc.line(tablaInicioX + anchoMitadIzquierda, yPos, tablaInicioX + anchoMitadIzquierda, yPos + filaObservacionAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + anchoMitadIzquierda, yPos);
  doc.line(tablaInicioX, yPos + filaObservacionAltura, tablaInicioX + anchoMitadIzquierda, yPos + filaObservacionAltura);
  
  // Dibujar título "Orientación:"
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Orientación:", tablaInicioX + 1, yPos + 3.5);
  
  yPos += filaObservacionAltura;

  // Dibujar subcategorías de orientación
  const espacioTituloOrientacion = 25; // Definir la variable que faltaba
  orientaciones.forEach((orientacion) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaObservacionAltura);
    doc.line(tablaInicioX + anchoMitadIzquierda, yPos, tablaInicioX + anchoMitadIzquierda, yPos + filaObservacionAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + anchoMitadIzquierda, yPos);
    doc.line(tablaInicioX, yPos + filaObservacionAltura, tablaInicioX + anchoMitadIzquierda, yPos + filaObservacionAltura);
    
    // Dibujar subtítulo (Tiempo:, Espacio:, Persona:)
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(orientacion.subtitulo, tablaInicioX + 1, yPos + 3.5);
    
    // Dibujar línea vertical después del subtítulo
    doc.line(tablaInicioX + espacioTituloOrientacion, yPos, tablaInicioX + espacioTituloOrientacion, yPos + filaObservacionAltura);
    
    // Dibujar opciones
    const anchoOpcionOrientacion = (anchoMitadIzquierda - espacioTituloOrientacion) / orientacion.opciones.length;
    
    orientacion.opciones.forEach((opcion, opcionIndex) => {
      const xOpcion = tablaInicioX + espacioTituloOrientacion + (opcionIndex * anchoOpcionOrientacion);
      
      // Dibujar línea vertical para separar opciones
      doc.line(xOpcion, yPos, xOpcion, yPos + filaObservacionAltura);
      
      // Dibujar texto de la opción
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(opcion, xOpcion + 1, yPos + 3.5);
      
      // Dibujar X si está seleccionado (usar valores booleanos)
      if (orientacion.valores[opcionIndex]) {
        doc.setFont("helvetica", "bold").setFontSize(10);
        doc.text("X", xOpcion + anchoOpcionOrientacion - 5, yPos + 3.5);
      }
    });
    
    // Dibujar línea vertical final para cerrar la última columna
    const xFinalOrientacion = tablaInicioX + espacioTituloOrientacion + (orientacion.opciones.length * anchoOpcionOrientacion);
    doc.line(xFinalOrientacion, yPos, xFinalOrientacion, yPos + filaObservacionAltura);
    
    yPos += filaObservacionAltura;
  });

  // === SECCIÓN 7.2: PROCESOS COGNITIVOS ===
  // Header de procesos cognitivos (solo hasta la mitad)
  
  // Dibujar fondo celeste solo en la mitad izquierda
  doc.setFillColor(173, 216, 230); // Color celeste claro
  doc.rect(tablaInicioX, yPos, anchoMitadIzquierda, filaAltura, 'F');
  
  // Dibujar líneas del header solo en la mitad izquierda
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + anchoMitadIzquierda, yPos, tablaInicioX + anchoMitadIzquierda, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + anchoMitadIzquierda, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + anchoMitadIzquierda, yPos + filaAltura);
  
  // Dibujar texto del título
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("7.2. PROCESOS COGNITIVOS", tablaInicioX + 2, yPos + 3.5);
  
  yPos += filaAltura;

  // === FILAS DE PROCESOS COGNITIVOS ===
  const procesosCognitivos = [
    {
      titulo: "Lucido, atento:",
      opciones: [],
      tipo: "texto",
      valor: examenMental.procesosCognitivos?.lucidoAtento || "Adecuado"
    },
    {
      titulo: "Pensamiento:",
      opciones: [],
      tipo: "texto",
      valor: examenMental.procesosCognitivos?.pensamiento || "Coherente y lógico"
    },
    {
      titulo: "Percepción:",
      opciones: [],
      tipo: "texto",
      valor: examenMental.procesosCognitivos?.percepcion || "Normal"
    },
    {
      titulo: "Memoria:",
      opciones: ["Corto plazo", "Mediano plazo", "Largo plazo"],
      tipo: "opciones",
      valores: [
        examenMental.procesosCognitivos?.memoria?.cortoPlazo || false,
        examenMental.procesosCognitivos?.memoria?.medianoPlazo || false,
        examenMental.procesosCognitivos?.memoria?.largoPlazo || false
      ]
    },
    {
      titulo: "Inteligencia:",
      opciones: ["Muy Superior", "Superior", "Normal Brillante"],
      tipo: "opciones",
      valores: [
        examenMental.procesosCognitivos?.inteligencia?.muySuperior || false,
        examenMental.procesosCognitivos?.inteligencia?.superior || false,
        examenMental.procesosCognitivos?.inteligencia?.normalBrillante || false
      ]
    },
    {
      titulo: "",
      opciones: ["Promedio", "N.Torpe", "Fronterizo", "RM Leve"],
      tipo: "opciones",
      valores: [
        examenMental.procesosCognitivos?.inteligencia?.promedio || false,
        examenMental.procesosCognitivos?.inteligencia?.nTorpe || false,
        examenMental.procesosCognitivos?.inteligencia?.fronterizo || false,
        examenMental.procesosCognitivos?.inteligencia?.rmLeve || false
      ]
    },
    {
      titulo: "",
      opciones: ["RM Moderado", "RM Severo", "RM Profundo"],
      tipo: "opciones",
      valores: [
        examenMental.procesosCognitivos?.inteligencia?.rmModerado || false,
        examenMental.procesosCognitivos?.inteligencia?.rmSevero || false,
        examenMental.procesosCognitivos?.inteligencia?.rmProfundo || false
      ]
    }
  ];

  procesosCognitivos.forEach((proceso) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaObservacionAltura);
    doc.line(tablaInicioX + anchoMitadIzquierda, yPos, tablaInicioX + anchoMitadIzquierda, yPos + filaObservacionAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + anchoMitadIzquierda, yPos);
    doc.line(tablaInicioX, yPos + filaObservacionAltura, tablaInicioX + anchoMitadIzquierda, yPos + filaObservacionAltura);
    
    // Dibujar título
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(proceso.titulo, tablaInicioX + 1, yPos + 3.5);
    
    // Dibujar línea vertical después del título (para todas las filas)
    const espacioTituloProceso = 25;
    doc.line(tablaInicioX + espacioTituloProceso, yPos, tablaInicioX + espacioTituloProceso, yPos + filaObservacionAltura);
    
    if (proceso.tipo === "opciones" && proceso.opciones.length > 0) {
      // Dibujar opciones
      const anchoOpcionProceso = (anchoMitadIzquierda - espacioTituloProceso) / proceso.opciones.length;
      
      proceso.opciones.forEach((opcion, opcionIndex) => {
        const xOpcion = tablaInicioX + espacioTituloProceso + (opcionIndex * anchoOpcionProceso);
        
        // Dibujar línea vertical para separar opciones
        doc.line(xOpcion, yPos, xOpcion, yPos + filaObservacionAltura);
        
        // Dibujar texto de la opción
        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text(opcion, xOpcion + 1, yPos + 3.5);
        
        // Dibujar X si está seleccionado (usar valores booleanos)
        if (proceso.valores[opcionIndex]) {
          doc.setFont("helvetica", "bold").setFontSize(10);
          doc.text("X", xOpcion + anchoOpcionProceso - 5, yPos + 3.5);
        }
      });
      
      // Dibujar línea vertical final para cerrar la última columna
      const xFinalProceso = tablaInicioX + espacioTituloProceso + (proceso.opciones.length * anchoOpcionProceso);
      doc.line(xFinalProceso, yPos, xFinalProceso, yPos + filaObservacionAltura);
    } else if (proceso.tipo === "texto") {
      // Dibujar valor de texto
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(proceso.valor, tablaInicioX + espacioTituloProceso + 1, yPos + 3.5);
    }
    
    yPos += filaObservacionAltura;
  });

  // === SECCIÓN 7.3: EVALUACIÓN ADICIONAL ===
  // Header de evaluación adicional (solo hasta la mitad)
  
  // Dibujar fondo celeste solo en la mitad izquierda
  doc.setFillColor(173, 216, 230); // Color celeste claro
  doc.rect(tablaInicioX, yPos, anchoMitadIzquierda, filaAltura, 'F');
  
  // Dibujar líneas del header solo en la mitad izquierda
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + anchoMitadIzquierda, yPos, tablaInicioX + anchoMitadIzquierda, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + anchoMitadIzquierda, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + anchoMitadIzquierda, yPos + filaAltura);
  
  // Dibujar texto del título
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("7.3. EVALUACIÓN ADICIONAL", tablaInicioX + 2, yPos + 3.5);
  
  yPos += filaAltura;

  // === FILAS DE EVALUACIÓN ADICIONAL ===
  const evaluacionAdicional = [
    {
      titulo: "Apetito:",
      opciones: [],
      tipo: "texto",
      valor: examenMental.evaluacionAdicional?.apetito || "ADECUADO"
    },
    {
      titulo: "Sueño:",
      opciones: [],
      tipo: "texto",
      valor: examenMental.evaluacionAdicional?.sueno || "SIN DIFICULTAD"
    },
    {
      titulo: "Personalidad:",
      opciones: [],
      tipo: "texto",
      valor: examenMental.evaluacionAdicional?.personalidad || "CUENTA CON RECURSOS PERSONALES"
    },
    {
      titulo: "Afectividad:",
      opciones: [],
      tipo: "texto",
      valor: examenMental.evaluacionAdicional?.afectividad || "EUTIMICO"
    },
    {
      titulo: "Conducta Sexual:",
      opciones: [],
      tipo: "texto",
      valor: examenMental.evaluacionAdicional?.conductaSexual || "NORMAL"
    }
  ];

  evaluacionAdicional.forEach((evaluacion) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaObservacionAltura);
    doc.line(tablaInicioX + anchoMitadIzquierda, yPos, tablaInicioX + anchoMitadIzquierda, yPos + filaObservacionAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + anchoMitadIzquierda, yPos);
    doc.line(tablaInicioX, yPos + filaObservacionAltura, tablaInicioX + anchoMitadIzquierda, yPos + filaObservacionAltura);
    
    // Dibujar título
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(evaluacion.titulo, tablaInicioX + 1, yPos + 3.5);
    
    // Dibujar línea vertical después del título
    const espacioTituloEvaluacion = 25;
    doc.line(tablaInicioX + espacioTituloEvaluacion, yPos, tablaInicioX + espacioTituloEvaluacion, yPos + filaObservacionAltura);
    
    // Dibujar valor
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(evaluacion.valor, tablaInicioX + espacioTituloEvaluacion + 1, yPos + 3.5);
    
    yPos += filaObservacionAltura;
  });

  // Restaurar la posición para la tabla de inventarios (debe empezar inmediatamente después del header)
  yPos = yPosInventarios;

  // === TABLA DE INVENTARIOS EN LA MITAD DERECHA ===
  const inventarios = [
    "Inventario Millón de Estilos de Personalidad - MIPS",
    "Escala de Motivaciones Psicosociales - MPS",
    "Luria - DNA Diagnóstico neuropsicológico de Adultos",
    "Escala de Apreciación del Estrés EAE",
    "Inventario de Burnout de Maslach",
    "Clima laboral",
    "Batería de Conductores",
    "WAIS",
    "Test BENTON",
    "Test Bender",
    "Inventario de la ansiedad ZUNG",
    "Inventario de Depresión ZUNG",
    "Escala de Memoria de Wechsler"
  ];
  
  // Obtener datos de inventarios del examen mental
  const inventariosData = examenMental.inventarios || {};

  const filaInventarioAltura = 5;
  const inicioXTabla = tablaInicioX + mitadAncho; // Empezar desde la nueva división
  // anchoTablaInventarios ya está definido arriba
  
  // Dibujar filas de inventarios (excepto "Otras Pruebas")
  inventarios.forEach((inventario) => {
    // Dibujar líneas de la fila
    doc.line(inicioXTabla, yPos, inicioXTabla, yPos + filaInventarioAltura);
    doc.line(inicioXTabla + anchoTablaInventarios, yPos, inicioXTabla + anchoTablaInventarios, yPos + filaInventarioAltura);
    doc.line(inicioXTabla, yPos, inicioXTabla + anchoTablaInventarios, yPos);
    doc.line(inicioXTabla, yPos + filaInventarioAltura, inicioXTabla + anchoTablaInventarios, yPos + filaInventarioAltura);
    
    // Dibujar línea vertical para separar "Nombre" y "ptje"
    doc.line(inicioXTabla + columnaNombreAncho, yPos, inicioXTabla + columnaNombreAncho, yPos + filaInventarioAltura);
    
    // Dibujar texto del inventario (centrado verticalmente)
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(inventario, inicioXTabla + 1, yPos + 3.5, columnaNombreAncho - 2);
    
    // Dibujar "X" en la columna ptje solo si está marcado en los datos
    if (inventariosData[inventario]) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", inicioXTabla + columnaNombreAncho + 3, yPos + 3.5);
    } 
    
    yPos += filaInventarioAltura;
  });

  // === FILA ESPECIAL: OTRAS PRUEBAS (campo de texto que llega hasta el final) ===
  // Calcular la altura necesaria para llegar hasta el final de la sección de conducta sexual
  // La sección de evaluación adicional termina después de todas sus filas
  const alturaOtrasPruebas = (evaluacionAdicional.length * filaObservacionAltura) + 20; // +2 para asegurar que llegue hasta el final
  
  // Dibujar líneas de la fila extendida (sin división interna)
  doc.line(inicioXTabla, yPos, inicioXTabla, yPos + alturaOtrasPruebas);
  doc.line(inicioXTabla + anchoTablaInventarios, yPos, inicioXTabla + anchoTablaInventarios, yPos + alturaOtrasPruebas);
  doc.line(inicioXTabla, yPos, inicioXTabla + anchoTablaInventarios, yPos);
  doc.line(inicioXTabla, yPos + alturaOtrasPruebas, inicioXTabla + anchoTablaInventarios, yPos + alturaOtrasPruebas);
  
  // Dibujar texto "Otras Pruebas" en la parte superior
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Otras Pruebas:", inicioXTabla + 1, yPos + 3.5);
  
  // Dibujar campo de texto para otras pruebas debajo del label (como lista)
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Usar otrasObservaciones_otras_observ del payload
  const otrasPruebasTexto = datosFinales.otrasObservaciones || '';
  
  // Procesar si viene como lista separada por "/"
  let itemsOtrasPruebas;
  if (typeof otrasPruebasTexto === 'string' && otrasPruebasTexto.includes('/')) {
    // Convertir lista separada por "/" en texto con viñetas
    const listaItems = otrasPruebasTexto.split('/').map(item => item.trim()).filter(item => item);
    itemsOtrasPruebas = listaItems.map(item => `• ${item}`);
  } else {
    // Es texto normal, convertir en lista de un solo item
    itemsOtrasPruebas = otrasPruebasTexto ? [`• ${otrasPruebasTexto}`] : [];
  }
  
  let yPosTexto = yPos + 8;
  itemsOtrasPruebas.forEach(item => {
    doc.text(item, inicioXTabla + 1, yPosTexto);
    yPosTexto += 4; // Espacio entre items
  });

  // === SECCIÓN IX: DIAGNÓSTICO FINAL ===
  // Ahora ocupamos todo el ancho de la página
  yPos += alturaOtrasPruebas;
  
  // Header gris "IX. DIAGNOSTICO FINAL"
  yPos = dibujarHeaderSeccion("IX. DIAGNOSTICO FINAL", yPos, filaAltura);
  
  // === SUBSECCIÓN: ÁREA COGNITIVA ===
  // Header celeste "Área Cognitiva"
  yPos = dibujarSubHeaderCeleste("Área Cognitiva:", yPos, filaAltura);
  
  // Contenido del área cognitiva usando datos mapeados
  const diagnosticoFinal = examenMental.diagnosticoFinal || {};
  const areaCognitivaTexto = diagnosticoFinal.areaCognitiva || "El paciente presenta capacidades cognitivas preservadas con atención y concentración adecuadas. Se observa memoria inmediata y diferida dentro de parámetros normales, funciones ejecutivas eficientes y procesamiento de información adecuado para las demandas del puesto.";
  const alturaAreaCognitiva = calcularAlturaTexto(areaCognitivaTexto, tablaAncho - 4, 15);
  
  // Dibujar fila de contenido con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaAreaCognitiva);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaAreaCognitiva);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaAreaCognitiva, tablaInicioX + tablaAncho, yPos + alturaAreaCognitiva);
  
  // Dibujar texto del área cognitiva
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(areaCognitivaTexto, tablaInicioX + 2, yPos + 3.5, tablaAncho - 4);
  
  yPos += alturaAreaCognitiva;
  
  // === SUBSECCIÓN: ÁREA EMOCIONAL ===
  // Header celeste "Área Emocional"
  yPos = dibujarSubHeaderCeleste("Área Emocional:", yPos, filaAltura);
  
  // Contenido del área emocional usando datos mapeados
  const areaEmocionalTexto = diagnosticoFinal.areaEmocional || "El paciente presenta un estado emocional estable con capacidad de regulación emocional adecuada. Se observa un nivel de ansiedad dentro de parámetros normales y habilidades sociales preservadas que le permiten mantener relaciones interpersonales satisfactorias.";
  const alturaAreaEmocional = calcularAlturaTexto(areaEmocionalTexto, tablaAncho - 4, 15);
  
  // Dibujar fila de contenido con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaAreaEmocional);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaAreaEmocional);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaAreaEmocional, tablaInicioX + tablaAncho, yPos + alturaAreaEmocional);
  
  // Dibujar texto del área emocional
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(areaEmocionalTexto, tablaInicioX + 2, yPos + 3.5, tablaAncho - 4);
  
  yPos += alturaAreaEmocional;

  // === SECCIÓN DE FIRMA DEL MÉDICO ===
  const alturaSeccionFirma = 25; // Altura para la sección de firma
  
  // Dibujar las líneas de la sección de firma (1 columna centrada)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaSeccionFirma); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionFirma); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaSeccionFirma, tablaInicioX + tablaAncho, yPos + alturaSeccionFirma); // Línea inferior

  // === FIRMA DEL MÉDICO CENTRADA ===
  const firmaMedicoY = yPos + 3;
  
  // Agregar firma y sello médico
  const firmaMedicoUrl = getSign(data, "SELLOFIRMA");
  console.log("Firma médico URL:", firmaMedicoUrl);
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 50;
      const imgHeight = 20;
      const x = tablaInicioX + (tablaAncho - imgWidth) / 2; // Centrar horizontalmente
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
      console.log("Firma médico agregada exitosamente");
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  } else {
    console.log("No se encontró URL de firma del médico");
  }
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  // Centrar el texto
  const centroX = tablaInicioX + tablaAncho / 2;
  doc.text("Sello y Firma del Médico", centroX, yPos + 20, { align: "center" });
  doc.text("Responsable de la Evaluación", centroX, yPos + 22.5, { align: "center" });

  yPos += alturaSeccionFirma;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 5 });

  // Imprimir
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
