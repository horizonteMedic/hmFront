import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import { convertirGenero, getSign } from "../../../utils/helpers.js";
import drawColorBox from '../../components/ColorBox.jsx';
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';

export default function ResumenAnexo7CP_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Datos de prueba por defecto
  const datosPrueba = {
    apellidosNombres: "CASTILLO PLASENCIA HADY KATHERINE",
    fechaExamen: "04/11/2024",
    tipoExamen: "PRE-OCUPACIONAL",
    sexo: "Femenino",
    documentoIdentidad: "72384273",
    edad: "31",
    areaTrabajo: "MINERÍA",
    puestoTrabajo: "DAD",
    empresa: "MINERA BOROO MISQUICHILCA S.A.",
    contrata: "CONTRATA EJEMPLO S.A.C.",
    // Datos de color
    color: 1,
    codigoColor: "#008f39",
    textoColor: "F",
    // Datos adicionales para header
    numeroFicha: "99164",
    sede: "Trujillo-Pierola",
    horaSalida: "9:33:43 PM",
    // Signos vitales de prueba
    vitalSigns: {
      fc: "64",
      fr: "19",
      pa: "120/60",
      satO2: "99",
      imc: "23.48",
      peso: "70",
      talla: "1.75"
    },
    // Evaluaciones médicas de prueba
    evaluaciones: {
      oftalmologica: "NORMAL",
      auditiva: "NORMAL",
      radiografia: "NORMAL",
      espirometria: "NORMAL",
      electrocardiograma: "NORMAL",
      dental: "NORMAL",
      psicologico: "CUMPLE CON EL PERFIL DEL PUESTO",
      trabajosAltura: "N/A",
      trabajosCaliente: "N/A",
      conduccion: "APTO PARA CONDUCCIÓN DE VEHICULOS Y OPERAR EQUIPOS"
    },
    // Laboratorio de prueba
    laboratorio: {
      grupoSanguineo: "O+",
      hemoglobina: "14.5",
      hematies: "4.5",
      glucosa: "85",
      cocaina: "NEGATIVO",
      marihuana: "NEGATIVO",
      vdrl: "NEGATIVO",
      vsg: "15",
      colesterol: "180",
      trigliceridos: "120"
    },
    // Datos adicionales de prueba
    antecedentesPersonales: "NORMAL",
    conclusion: "1. HIPOACUSIA NEUROSENSORIAL LEVE EN OIDO IZQUIERDO. USO DE EPP AUDITIVO ANTE EXPOSICION A RUIDO >=80 DB. EVALUACION ANUAL POR OTORRINOLARINGOLOGIA.\n2. SOBREPESO. DIETA HIPOCALORICA Y EJERCICIOS.\n3. ODONTOGRAMA : 1 CARIES DENTAL SIMPLE (PZA. 47). TRATAMIENTO SUGERIDO: RESTAURACION SIMPLE.\n4. ELECTROCARDIOGRAMA: BLOQUEO INCOMPLETO DE RAMA DERECHA. EVALUACION ANUAL.",
    restricciones: "1. EVITAR EXPOSICION A RUIDO >=80 DB SIN PROTECCION AUDITIVA.\n2. REALIZAR PAUSAS ACTIVAS DURANTE LA JORNADA LABORAL.\n3. MANTENER CONTROLES MEDICOS REGULARES.",
    recomendaciones: "Mantener controles médicos regulares.",
    observaciones: "Sin observaciones especiales.",
    aptitud: "APTO",
    fechaVencimiento: "04/11/2025",
    fechaNacimiento: "15/03/1993"
  };

  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente || "") + " " + (data.nombresPaciente || "")).trim(),
    fechaExamen: formatearFechaCorta(data.fechaFichaAnexo16_fecha),
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
    sede: data.sede || data.nombreSede,
    // Datos específicos
    direccionPaciente: String(data.direccionPaciente),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente),
    // Datos de digitalización
    digitalizacion: data.digitalizacion,
    // Signos vitales
    vitalSigns: {
      fc: String(data.frecuenciaCardiacaTriaje_f_cardiaca),
      fr: String(data.frecuenciaRespiratoriaTriaje_f_respiratoria),
      pa: String(data.sistolicatriaje_sistolica) + "/" + String(data.diastolicatriaje_diastolica),
      satO2: String(data.saturacionoxigenotriaje_sat_02),
      imc: String(data.imctriaje_imc),
      peso: String(data.pesotriaje_peso),
      talla: String(data.tallatriaje_talla)
    },
    // Datos médicos específicos
    antecedentesFamiliares: data.antecedentesFamiliaresAnexo7c_txtantecedentesfamiliares,
    antecedentesPatologicos: data.antecedentesPatologicos_ante_patologicos,
    antecedentesPersonales: data.antecedentesPersonales2Anexo7c_txtantecedentespersonales2,
    aptitud: data.aptitud,
    fechaVencimiento: formatearFechaCorta(data.fechaHastaFichaAnexo16_fecha_hasta),
    // Evaluaciones médicas
    evaluaciones: {
      oftalmologica: data.enfermedadesocularesoftalmo_e_oculares,
      auditiva: data.diagnosticoAudiometria_diagnostico,
      radiografia: data.conclusionesRadiograficas,
      espirometria: "NORMAL",
      electrocardiograma: data.hallazgosInformeElectroCardiograma_hallazgo,
      dental: data.observacionesOdontograma_txtobservaciones,
      psicologico: data.aptoEvaluacionPsicoPoderosa_rbapto ? "CUMPLE CON EL PERFIL DEL PUESTO" : "NO CUMPLE",
      trabajosAltura: data.observacionTrabajosAltura_obsvaltura,
      trabajosCaliente: data.observacionAptitudCaliente_obsvtencaliente,
      conduccion: data.observacionAptitudConducir_obsvlicencia
    },
    // Laboratorio
    laboratorio: {
      grupoSanguineo: data.grupoFactorSanguineo_grupofactor,
      hemoglobina: data.hemoglobinaLaboratorioClinico_txthemoglobina,
      hematies: data.hematiesematologiaLabClinico_txthematiesematologia,
      glucosa: data.glucosaLaboratorioClinico_txtglucosabio,
      cocaina: data.cocainaLaboratorioClinico_txtcocaina,
      marihuana: data.marihuanaLaboratorioClinico_txtmarihuana,
      vdrl: (data.positivoLaboratorioClinico_chkpositivo === true) ? "REACTIVO" : "NO REACTIVO",
      vsg: data.vsgLaboratorioClinico_txtvsg,
      colesterol: data.colesterolAnalisisBioquimico_txtcolesterol,
      trigliceridos: data.trigliseridosAnalisisBioquimico_txttrigliseridos
    },
    // Conclusiones y recomendaciones
    conclusion: data.conclusionAnexo7c_txtconclusion,
    recomendaciones: data.recomendacionesAnalisisBioquimico_txtrecomendaciones,
    restricciones: data.restriccionesAnalisisBioquimico_atxtrestricciones,
    observaciones: data.observacionesFichaMedicaAnexo7c_txtobservacionesfm,
    observacionesFichaMedicaAnexo7c_txtobservacionesfm: data.observacionesFichaMedicaAnexo7c_txtobservacionesfm
  };

  // Usar datos reales si existen, sino usar datos de prueba
  const datosFinales = data && data.norden ? datosReales : datosPrueba;

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("RESUMEN MÉDICO PODEROSA", pageW / 2, 30, { align: "center" });
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

  // Función para procesar texto con saltos de línea numerados
  const procesarTextoConSaltosLinea = (texto) => {
    if (!texto) return [];
    
    // Dividir por saltos de línea reales (\n, \r\n) y otros separadores
    const partes = texto.split(/\r\n|\r|\n|\\n|\/n/g);
    
    // Procesar cada parte y mantener el formato original
    return partes
      .map(parte => parte.trim())
      .filter(parte => parte.length > 0);
  };

  // Función mejorada para manejar textos con saltos de línea numerados
  const dibujarTextoConSaltosLinea = (texto, x, y, anchoMaximo) => {
    const fontSize = doc.internal.getFontSize();
    let yPos = y;
    
    // Procesar el texto manteniendo el formato original
    const lineasProcesadas = procesarTextoConSaltosLinea(texto);
    
    lineasProcesadas.forEach((linea, index) => {
      // Verificar si es una línea numerada (empieza con número seguido de punto)
      const esLineaNumerada = /^\d+\./.test(linea);
      
      // Si la línea es muy larga, usar la función de salto de línea por palabras
      if (doc.getTextWidth(linea) > anchoMaximo) {
        yPos = dibujarTextoConSaltoLinea(linea, x, yPos, anchoMaximo);
        
        // Espacio moderado después de una línea numerada que hizo salto
        if (esLineaNumerada) {
          yPos += fontSize * 0.25; // Espacio moderado después de línea numerada con salto
        }
        
        // Si hay una siguiente línea numerada, agregar espacio adicional moderado
        if (index < lineasProcesadas.length - 1) {
          const siguienteLinea = lineasProcesadas[index + 1];
          if (/^\d+\./.test(siguienteLinea)) {
            yPos += fontSize * 0.2; // Espacio moderado antes de la siguiente línea numerada
          }
        }
      } else {
        // Si la línea cabe, dibujarla directamente
        doc.text(linea, x, yPos);
        
        // Espaciado equilibrado para líneas numeradas
        if (esLineaNumerada) {
          yPos += fontSize * 0.4; // Espacio equilibrado para líneas numeradas
        } else {
          yPos += fontSize * 0.35; // Espacio normal
        }
      }
      
      // Espacio adicional entre líneas numeradas consecutivas (solo si no hizo salto)
      if (index < lineasProcesadas.length - 1 && doc.getTextWidth(linea) <= anchoMaximo) {
        const siguienteLinea = lineasProcesadas[index + 1];
        if (esLineaNumerada && /^\d+\./.test(siguienteLinea)) {
          yPos += fontSize * 0.15; // Espacio moderado entre líneas numeradas
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
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 35; // Subido 5mm (era 40, ahora 35)
  const filaAltura = 5;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);

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

  // Cuarta fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Cuarta fila: Empresa (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Contrata (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 35 + 2; // Ajustar para el header (subido 5mm)

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
  dibujarTextoConSaltoLinea(datosFinales.direccionPaciente, tablaInicioX + 25, yTexto + 1.5, 160);
  yTexto += filaAltura;

  // Cuarta fila: Puesto de Trabajo, Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.puestoTrabajo, tablaInicioX + 30, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.areaTrabajo, tablaInicioX + 118, yTexto + 1.5);
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
  doc.text(datosFinales.contrata, tablaInicioX + 24, yTexto + 1.5);
  yTexto += filaAltura;

  // Séptima fila: Carta (fila completa con altura mayor)
  const alturaFilaCarta = 10; // Altura mayor para el texto de la carta
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaCarta);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaCarta);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaCarta, tablaInicioX + tablaAncho, yPos + alturaFilaCarta);
  yPos += alturaFilaCarta;

  // Contenido de la carta con formato específico
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Primera línea
  doc.text("Estimados Señores de: ", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(`${datosFinales.empresa || ""}`, tablaInicioX + 2 + doc.getTextWidth("Estimados Señores de: "), yTexto + 2);
  
  // Segunda línea - usando todo el ancho disponible
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Enviamos el informe: ", tablaInicioX + 2, yTexto + 5.5);
  
  // Calcular posición del nombre en negrita
  const posicionNombre = tablaInicioX + 2 + doc.getTextWidth("Enviamos el informe: ");
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(`${datosFinales.apellidosNombres || ""}`, posicionNombre, yTexto + 5.5);
  
  // Calcular posición del texto final usando el ancho del nombre en negrita
  const anchoNombreNegrita = doc.getTextWidth(`${datosFinales.apellidosNombres || ""}`);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(" , en condiciones médicas que se detallan a continuación:", posicionNombre + anchoNombreNegrita, yTexto + 5.5);
  yTexto += alturaFilaCarta;

  // === SECCIÓN 2: SIGNOS VITALES ===
  // Header de signos vitales
  yPos = dibujarHeaderSeccion("2. SIGNOS VITALES", yPos, filaAltura);

  // Una sola fila con 7 columnas - Divisiones en milímetros para fácil ajuste
  const col1 = 24;  // FC
  const col2 = 47;  // FR  
  const col3 = 76;  // PA
  const col4 = 100; // Sat. O2
  const col5 = 135; // IMC
  const col6 = 165; // Peso
  // col7 = hasta el final (Talla)

  // Dibujar líneas de la fila única
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + col1, yPos, tablaInicioX + col1, yPos + filaAltura); // División 1
  doc.line(tablaInicioX + col2, yPos, tablaInicioX + col2, yPos + filaAltura); // División 2
  doc.line(tablaInicioX + col3, yPos, tablaInicioX + col3, yPos + filaAltura); // División 3
  doc.line(tablaInicioX + col4, yPos, tablaInicioX + col4, yPos + filaAltura); // División 4
  doc.line(tablaInicioX + col5, yPos, tablaInicioX + col5, yPos + filaAltura); // División 5
  doc.line(tablaInicioX + col6, yPos, tablaInicioX + col6, yPos + filaAltura); // División 6
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior

  // === CONTENIDO DE SIGNOS VITALES ===
  // FC (Frecuencia Cardíaca)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FC:", tablaInicioX + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.fc + " x min", tablaInicioX + 8, yPos + 3);

  // FR (Frecuencia Respiratoria)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FR:", tablaInicioX + col1 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.fr + " x min", tablaInicioX + col1 + 8, yPos + 3);

  // PA (Presión Arterial)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("PA:", tablaInicioX + col2 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.pa + " mmHg", tablaInicioX + col2 + 8, yPos + 3);

  // Sat. O2 (Saturación de Oxígeno)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sat. O2:", tablaInicioX + col3 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.satO2 + " %", tablaInicioX + col3 + 15, yPos + 3);

  // IMC (Índice de Masa Corporal)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("IMC:", tablaInicioX + col4 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.imc + " kg/m2", tablaInicioX + col4 + 10, yPos + 3);

  // Peso
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Peso:", tablaInicioX + col5 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.peso + " kg", tablaInicioX + col5 + 10, yPos + 3);

  // Talla
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Talla:", tablaInicioX + col6 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.talla + " cm", tablaInicioX + col6 + 10, yPos + 3);

  yPos += filaAltura;

  // === SECCIÓN 3: EVALUACIONES MÉDICAS ===
  // Header de evaluaciones médicas
  yPos = dibujarHeaderSeccion("3. EVALUACIONES MÉDICAS", yPos, filaAltura);

  // Fila 1: Evaluación Oftalmológica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 2: Examen Auditiva
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 3: Radiografía de Tórax
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 4: Espirometría
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 5: Electrocardiograma
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 6: Evaluación Dental
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 7: Test Psicológico
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 8: Antecedentes de Importancia
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 9: Trabajos en Altura
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 10: Trabajos en Caliente
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 11: Ficha de Conducción
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE EVALUACIONES MÉDICAS ===
  let yTextoEval = yPos - (11 * filaAltura) + 2; // Posición inicial para el texto

  // Fila 1: Evaluación Oftalmológica
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("EVALUACIÓN OFTALMOLÓGICA:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.evaluaciones.oftalmologica, tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 2: Examen Auditiva
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("EXAMEN AUDITIVA:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.evaluaciones.auditiva, tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 3: Radiografía de Tórax
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("RADIOGRAFÍA DE TÓRAX:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.evaluaciones.radiografia, tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 4: Espirometría
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("ESPIROMETRÍA:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.evaluaciones.espirometria, tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 5: Electrocardiograma
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("ELECTROCARDIOGRAMA:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.evaluaciones.electrocardiograma, tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 6: Evaluación Dental
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("EVALUACIÓN DENTAL:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.evaluaciones.dental, tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 7: Test Psicológico
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("TEST PSICOLÓGICO:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.evaluaciones.psicologico, tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 8: Antecedentes de Importancia
  // doc.setFont("helvetica", "bold").setFontSize(8);
  // doc.text("ANTECEDENTES DE IMPORTANCIA:", tablaInicioX + 2, yTextoEval + 1.5);
  // doc.setFont("helvetica", "normal").setFontSize(8);
  // doc.text(datosFinales.antecedentesPersonales, tablaInicioX + 52, yTextoEval + 1.5);
  // yTextoEval += filaAltura;

  // Fila 8: Antecedentes de Importancia
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("ANTECEDENTES DE IMPORTANCIA:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NORMAL", tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 9: Trabajos en Altura
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("TRABAJOS EN ALTURA:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.evaluaciones.trabajosAltura, tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 10: Trabajos en Caliente
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("TRABAJOS EN CALIENTE:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.evaluaciones.trabajosCaliente, tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 11: Ficha de Conducción
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FICHA DE CONDUCCIÓN:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.evaluaciones.conduccion, tablaInicioX + 52, yTextoEval + 1.5);

  // === SECCIÓN 4: EXAMENES DE LABORATORIO ===
  // Header de exámenes de laboratorio
  yPos = dibujarHeaderSeccion("4. EXAMENES DE LABORATORIO", yPos, filaAltura);

  // Fila 1: Grupo sanguíneo y Hemoglobina
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 2: Hematíes y Glucosa
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 3: Drogas en Orina y Examen de Orina
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 4: VDRL y VSG
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE EXAMENES DE LABORATORIO ===
  let yTextoLab = yPos - (4 * filaAltura) + 2; // Posición inicial para el texto

  // Fila 1: Grupo sanguíneo y Hemoglobina
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Grupo sanguíneo:", tablaInicioX + 2, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.laboratorio.grupoSanguineo, tablaInicioX + 30, yTextoLab + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hemoglobina:", tablaInicioX + 102, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.laboratorio.hemoglobina + " gr %", tablaInicioX + 150, yTextoLab + 1.5);
  yTextoLab += filaAltura;

  // Fila 2: Hematíes y Glucosa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hematíes:", tablaInicioX + 2, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.laboratorio.hematies + " x mm³", tablaInicioX + 30, yTextoLab + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Glucosa:", tablaInicioX + 102, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.laboratorio.glucosa + " mg/dl", tablaInicioX + 150, yTextoLab + 1.5);
  yTextoLab += filaAltura;

  // Fila 3: Drogas en Orina y Examen de Orina
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Drogas en Orina:", tablaInicioX + 2, yTextoLab + 1.5);
  
  // Dibujar "Cocaina" en negrita
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cocaina :   ", tablaInicioX + 30, yTextoLab + 1.5);
  
  // Dibujar valor de cocaína en normal
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.laboratorio.cocaina, tablaInicioX + 30 + doc.getTextWidth("Cocaina :   "), yTextoLab + 1.5);
  
  // Dibujar "Marihuana" en negrita
  doc.setFont("helvetica", "bold").setFontSize(8);
  const posicionMarihuana = tablaInicioX + 30 + doc.getTextWidth("Cocaina :   ") + doc.getTextWidth(datosFinales.laboratorio.cocaina) + 5;
  doc.text("Marihuana :   ", posicionMarihuana, yTextoLab + 1.5);
  
  // Dibujar valor de marihuana en normal
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.laboratorio.marihuana, posicionMarihuana + doc.getTextWidth("Marihuana :   "), yTextoLab + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Examen de Orina:", tablaInicioX + 102, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NORMAL", tablaInicioX + 150, yTextoLab + 1.5);
  yTextoLab += filaAltura;

  // Fila 4: VDRL y VSG
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("VDRL:", tablaInicioX + 2, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.laboratorio.vdrl, tablaInicioX + 30, yTextoLab + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("VSG:", tablaInicioX + 102, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.laboratorio.vsg + " mm", tablaInicioX + 150, yTextoLab + 1.5);

  // === SECCIÓN 5: CONCLUSION Y RECOMENDACIONES ===
  // Header gris: CONCLUSION Y RECOMENDACIONES
  yPos = dibujarHeaderSeccion("5. CONCLUSION Y RECOMENDACIONES", yPos, filaAltura);

  // === CONTENIDO DE CONCLUSION Y RECOMENDACIONES ===
  // Primero calcular la altura necesaria para el texto
  doc.setFont("helvetica", "normal").setFontSize(7);
  const textoConclusion = datosFinales.observacionesFichaMedicaAnexo7c_txtobservacionesfm;
  
  // Calcular altura necesaria simulando el texto
  const alturaMinima = 15; // Altura mínima de la fila
  const paddingSuperior = 4; // Padding superior 
  const yTextoInicio = yPos + paddingSuperior;
  const nuevaYPosConcl = dibujarTextoConSaltosLinea(textoConclusion, tablaInicioX + 2, yTextoInicio, tablaAncho - 4);
  const alturaTextoUsada = nuevaYPosConcl - yTextoInicio;
  const alturaFilaFinal = Math.max(alturaMinima, alturaTextoUsada + paddingSuperior + 2); // +padding superior + margen inferior

  // Dibujar la fila con la altura calculada
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaFinal);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaFinal);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaFinal, tablaInicioX + tablaAncho, yPos + alturaFilaFinal);
  
  yPos += alturaFilaFinal;

  // === SECCIÓN 6: RESTRICCIONES ===
  // Header gris: RESTRICCIONES
  yPos = dibujarHeaderSeccion("6. RESTRICCIONES", yPos, filaAltura);

  // === CONTENIDO DE RESTRICCIONES ===
  // Primero calcular la altura necesaria para el texto
  doc.setFont("helvetica", "normal").setFontSize(7);
  const textoRestricciones = datosFinales.restricciones;
  
  // Calcular altura necesaria simulando el texto
  const alturaMinimaRestricciones = 15; // Altura mínima de la fila
  const paddingSuperiorRestricciones = 4; // Padding superior 
  const yTextoInicioRestricciones = yPos + paddingSuperiorRestricciones;
  const nuevaYPosRestricciones = dibujarTextoConSaltosLinea(textoRestricciones, tablaInicioX + 2, yTextoInicioRestricciones, tablaAncho - 4);
  const alturaTextoRestriccionesUsada = nuevaYPosRestricciones - yTextoInicioRestricciones;
  const alturaFilaRestriccionesFinal = Math.max(alturaMinimaRestricciones, alturaTextoRestriccionesUsada + paddingSuperiorRestricciones + 2); // +padding superior + margen inferior

  // Dibujar la fila con la altura calculada
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaRestriccionesFinal);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaRestriccionesFinal);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaRestriccionesFinal, tablaInicioX + tablaAncho, yPos + alturaFilaRestriccionesFinal);
  
  yPos += alturaFilaRestriccionesFinal;

  // === SECCIÓN 7: APTITUD LABORAL ===
  // Fila: APTITUD LABORAL y FECHA DE VENCIMIENTO (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE APTITUD LABORAL ===
  // Posición del texto centrado dentro de la fila
  let yTextoAptitud = yPos - filaAltura + 3.5; // Centrado verticalmente en la fila

  // Primera columna: APTITUD LABORAL
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("APTITUD LABORAL:", tablaInicioX + 2, yTextoAptitud);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.aptitud, tablaInicioX + 35, yTextoAptitud);

  // Segunda columna: FECHA DE VENCIMIENTO
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FECHA DE VENCIMIENTO:", tablaInicioX + 102, yTextoAptitud);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaVencimiento, tablaInicioX + 155, yTextoAptitud);

  // === SECCIÓN DE FIRMAS ===
  const yFirmas = yPos; // Sin separación después de la fila de aptitud
  const alturaSeccionFirmas = 30; // Altura para la sección de firmas

  // Dibujar las líneas de la sección de firmas (1 columna completa)
  doc.line(tablaInicioX, yFirmas, tablaInicioX, yFirmas + alturaSeccionFirmas); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea derecha
  doc.line(tablaInicioX, yFirmas, tablaInicioX + tablaAncho, yFirmas); // Línea superior
  doc.line(tablaInicioX, yFirmas + alturaSeccionFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea inferior

  // === FIRMA DEL MÉDICO ===
  const firmaMedicoX = tablaInicioX + 80; // Centrado en la columna
  const firmaMedicoY = yFirmas + 3;
  
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
  const centroColumna = tablaInicioX + (tablaAncho / 2);
  doc.text("Sello y Firma del Médico", centroColumna, yFirmas + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumna, yFirmas + 28.5, { align: "center" });

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
