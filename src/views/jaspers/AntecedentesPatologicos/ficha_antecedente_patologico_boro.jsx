import jsPDF from "jspdf";

export default function FichaAntecedentePatologicoBoro(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  
  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Datos de prueba por defecto
  const datosPrueba = {
    apellidosNombres: "CASTILLO PLASENCIA HADY KATHERINE",
    fechaExamen: "04/11/2024",
    sexo: "F",
    documentoIdentidad: "72384273",
    edad: "31 años",
    areaTrabajo: "MINERÍA",
    puestoTrabajo: "OPERADOR DE MAQUINARIA PESADA",
    tiempoExperiencia: "5 años",
    empresa: "MINERA BOROO MISQUICHILCA S.A.",
    contrata: "CONTRATA",
    sede: "Trujillo-Pierola",
    // Datos de accidentes
    accidenteTrabajo: false,
    fechaAccidente: "04/09/2025",
    tiempoPerdido: false,
    tiempoIncapacidad: "5 MESES(meses)",
    causaBasica: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    // Datos de enfermedad profesional
    enfermedadProfesional: true,
    evaluacionEnfermedad: false,
    fechaEvaluacion: "03/09/2010",
    especifiqueCual: "Enfermedad pulmonar ocupacional por exposición a polvo de sílice",
    // Datos de factores de riesgo - mapeo completo
    factoresRiesgo: {
      ruido: true,
      polvo: true,
      cargas: true,
      metales: false,
      vibraciones: true,
      alturaEstructura: true,
      alturaGeografica: false,
      temperatura: true,
      cancerigenos: false,
      biologicos: false,
      quimicos: false,
      posturas: true,
      electricos: false,
      otros: "Exposición a radiación solar y condiciones climáticas extremas"
    },
    // Datos de patologías - mapeo completo
    patologias: {
      ima: false,
      hta: false,
      acv: false,
      tbc: false,
      ets: false,
      vih: false,
      tec: false,
      fobias: false,
      alergias: false,
      asma: false,
      bronquitis: false,
      diabetes: false,
      hepatitis: false,
      hernias: false,
      vertigos: false,
      tifoidea: false,
      neoplasias: false,
      quemaduras: false,
      discopatias: false,
      columna: false,
      convulsiones: false,
      gastritis: false,
      ulceras: false,
      migranas: false,
      enfPsiquiatricas: false,
      enfCardiovasculares: false,
      enfOculares: true, // Marcado como en la imagen
      enfReumatica: false,
      enfPulmonares: false,
      enfPiel: false,
      tendinitis: false,
      onicomicosis: false,
      fracturas: false,
      anemia: false,
      obesidad: false,
      dislipidemia: false,
      intoxicaciones: false,
      amputacion: false,
      sordera: false,
      otros: "Problemas de visión y migrañas ocasionales"
    }
  };

  // Usar datos reales si existen, sino usar datos de prueba
  const datosFinales = data && data.norden ? {
    apellidosNombres: data.nombres || datosPrueba.apellidosNombres,
    fechaExamen: data.fechaExamen || datosPrueba.fechaExamen,
    sexo: data.sexo || datosPrueba.sexo,
    documentoIdentidad: data.dni || datosPrueba.documentoIdentidad,
    edad: data.edad || datosPrueba.edad,
    areaTrabajo: data.areaTrabajo || datosPrueba.areaTrabajo,
    puestoTrabajo: data.puestoTrabajo || datosPrueba.puestoTrabajo,
    tiempoExperiencia: data.tiempoExperiencia || datosPrueba.tiempoExperiencia,
    empresa: data.empresa || datosPrueba.empresa,
    contrata: data.contrata || datosPrueba.contrata,
    numeroFicha: data.numeroFicha || "99164",
    sede: data.sede || datosPrueba.sede,
    // Datos de accidentes
    accidenteTrabajo: data.accidenteTrabajo !== undefined ? data.accidenteTrabajo : datosPrueba.accidenteTrabajo,
    fechaAccidente: data.fechaAccidente || datosPrueba.fechaAccidente,
    tiempoPerdido: data.tiempoPerdido !== undefined ? data.tiempoPerdido : datosPrueba.tiempoPerdido,
    tiempoIncapacidad: data.tiempoIncapacidad || datosPrueba.tiempoIncapacidad,
    causaBasica: data.causaBasica || datosPrueba.causaBasica,
    // Datos de enfermedad profesional
    enfermedadProfesional: data.enfermedadProfesional !== undefined ? data.enfermedadProfesional : datosPrueba.enfermedadProfesional,
    evaluacionEnfermedad: data.evaluacionEnfermedad !== undefined ? data.evaluacionEnfermedad : datosPrueba.evaluacionEnfermedad,
    fechaEvaluacion: data.fechaEvaluacion || datosPrueba.fechaEvaluacion,
    especifiqueCual: data.especifiqueCual || datosPrueba.especifiqueCual,
    // Datos de factores de riesgo - mapeo completo
    factoresRiesgo: data.factoresRiesgo || datosPrueba.factoresRiesgo,
    // Datos de patologías - mapeo completo
    patologias: data.patologias || datosPrueba.patologias
  } : {
    ...datosPrueba,
    numeroFicha: "99164"
  };

  // === HEADER ===
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("DECLARACIÓN JURADA DE DATOS MÉDICOS", pageW / 2, 26, { align: "center" });
  doc.text("Y ANTECEDENTES", pageW / 2, 32, { align: "center" });

  // Número de Ficha y Página - Página 1 (tipo lista)
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Nro de ficha: ", pageW - 50, 20);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(datosFinales.numeroFicha, pageW - 30, 20);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Sede: " + datosFinales.sede, pageW - 50, 25);
  doc.text("Pag. " + numeroPagina.toString().padStart(2, '0'), pageW - 50, 30);

  // === EMPRESA Y FECHA ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("EMPRESA: " + datosFinales.empresa, 20, 45);
  doc.text("FECHA: " + datosFinales.fechaExamen, pageW - 50, 45);

  // === DECLARACIÓN JURADA ===
  const declaracionY = 55;
  doc.setFont("helvetica", "normal").setFontSize(9);
  const declaracionTexto = `Yo; ${datosFinales.apellidosNombres} de ${datosFinales.edad} de edad, con DNI/CE/PASAPORTE ${datosFinales.documentoIdentidad}, declaro que toda la información proporcionada en esta declaración jurada es verdadera no habiendo omitido ningún dato personal ni laboral relevante de forma voluntaria.`;
  doc.text(declaracionTexto, 20, declaracionY, { maxWidth: pageW - 40 });

  // === ANTECEDENTES PATOLÓGICOS PERSONALES ===
  const antecedentesY = declaracionY + 15;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("1. ANTECEDENTES PATOLÓGICOS PERSONALES:", 20, antecedentesY);

  // Puesto al que Postula
  const puestoY = antecedentesY + 8;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Puesto al que Postula: ", 20, puestoY);
  doc.text(datosFinales.puestoTrabajo, 58, puestoY);

  // Tiempo de Experiencia
  doc.text("Tiempo de Experiencia: " + datosFinales.tiempoExperiencia, 20, puestoY + 6);

  // Pregunta sobre accidentes de trabajo - TODO EN UNA LÍNEA
  const accidenteY = puestoY + 12;
  
  // Pregunta
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Ha sufrido algún accidente relacionado al trabajo:", 20, accidenteY);
  
  // Checkboxes SI/NO en la misma línea
  const checkboxSiX = 97;
  const checkboxNoX = 112;
  
  // Checkbox SI con paréntesis - ANCHO FIJO
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("SI (", checkboxSiX, accidenteY);
  if (datosFinales.accidenteTrabajo) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0); // rojo
    // X del SI - coordenadas individuales
    const xSiX = checkboxSiX + 6.5;
    const xSiY = accidenteY + 0.5;
    doc.text("X", xSiX, xSiY);
    doc.setTextColor(0, 0, 0); // reset
  } else {
    // Espacio fijo para mantener el ancho
    doc.text("  ", checkboxSiX + 7, accidenteY);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxSiX + 10, accidenteY);
  
  // Checkbox NO con paréntesis - ANCHO MÁS GRANDE
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("NO (", checkboxNoX, accidenteY);
  if (!datosFinales.accidenteTrabajo) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0); // rojo
    // X del NO - coordenadas individuales
    const xNoX = checkboxNoX + 8;
    const xNoY = accidenteY + 0.5;
    doc.text("X", xNoX, xNoY);
    doc.setTextColor(0, 0, 0); // reset
  } else {
    // Espacio más grande para paréntesis más anchos
    doc.text("    ", checkboxNoX + 7, accidenteY);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxNoX + 12, accidenteY);

  // Fecha del Accidente en la misma línea
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Fecha del Accidente(s): " + datosFinales.fechaAccidente, 128, accidenteY);

  // Instrucción
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Si la Respuesta es SI, responder las líneas inferiores", 30, accidenteY + 5);

  // Tiempo perdido - TODO EN UNA LÍNEA
  const tiempoPerdidoY = accidenteY + 10;
  
  // Pregunta
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Hubo tiempo perdido (descanso médico)", 30, tiempoPerdidoY);
  
  // Checkboxes SI/NO en la misma línea
  const checkboxTiempoSiX = 97;
  const checkboxTiempoNoX = 112;
  
  // Checkbox SI para tiempo perdido con paréntesis - ANCHO FIJO
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("SI (", checkboxTiempoSiX, tiempoPerdidoY);
  if (datosFinales.tiempoPerdido) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0); // rojo
    // X del SI tiempo perdido - coordenadas individuales
    const xTiempoSiX = checkboxTiempoSiX + 6.5;
    const xTiempoSiY = tiempoPerdidoY + 0.5;
    doc.text("X", xTiempoSiX, xTiempoSiY);
    doc.setTextColor(0, 0, 0); // reset
  } else {
    // Espacio fijo para mantener el ancho
    doc.text("  ", checkboxTiempoSiX + 7, tiempoPerdidoY);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxTiempoSiX + 10, tiempoPerdidoY);
  
  // Checkbox NO para tiempo perdido con paréntesis - ANCHO MÁS GRANDE
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("NO (", checkboxTiempoNoX, tiempoPerdidoY);
  if (!datosFinales.tiempoPerdido) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0); // rojo
    // X del NO tiempo perdido - coordenadas individuales
    const xTiempoNoX = checkboxTiempoNoX + 8;
    const xTiempoNoY = tiempoPerdidoY + 0.5;
    doc.text("X", xTiempoNoX, xTiempoNoY);
    doc.setTextColor(0, 0, 0); // reset
  } else {
    // Espacio más grande para paréntesis más anchos
    doc.text("    ", checkboxTiempoNoX + 7, tiempoPerdidoY);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxTiempoNoX + 12, tiempoPerdidoY);

  // Tiempo de Incapacidad en la misma línea
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Tiempo de Incapacidad: " + datosFinales.tiempoIncapacidad, 128, tiempoPerdidoY);

  // Causa básica - con ajuste automático de texto
  const causaBasicaY = tiempoPerdidoY + 5;
  
  // Solo dibujar el texto completo con ajuste automático y justificado
  const textoCompleto = "Especifique la causa básica (o describa el evento): " + datosFinales.causaBasica;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(textoCompleto, 30, causaBasicaY, { maxWidth: pageW - 50, align: "justify" });

  // === NUEVA SECCIÓN: ENFERMEDAD PROFESIONAL ===
  const enfermedadY = causaBasicaY + 12; // Espacio después de la sección anterior
  
  // Pregunta sobre enfermedad profesional - TODO EN UNA LÍNEA
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Ha sido declarado con alguna enfermedad profesional o relacionada al trabajo:", 20, enfermedadY);
  
  // Checkboxes SI/NO para enfermedad profesional - EN LA MISMA LÍNEA
  const checkboxEnfermedadSiX = 145;
  const checkboxEnfermedadNoX = 160;
  
  // Checkbox SI para enfermedad profesional con paréntesis - ANCHO FIJO
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("SI (", checkboxEnfermedadSiX, enfermedadY);
  if (datosFinales.enfermedadProfesional) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0); // rojo
    // X del SI enfermedad profesional - coordenadas individuales
    const xEnfermedadSiX = checkboxEnfermedadSiX + 6;
    const xEnfermedadSiY = enfermedadY + 0.5;
    doc.text("X", xEnfermedadSiX, xEnfermedadSiY);
    doc.setTextColor(0, 0, 0); // reset
  } else {
    // Espacio fijo para mantener el ancho
    doc.text("  ", checkboxEnfermedadSiX + 6, enfermedadY);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxEnfermedadSiX + 10, enfermedadY);
  
  // Checkbox NO para enfermedad profesional con paréntesis - ANCHO MÁS GRANDE
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("NO (", checkboxEnfermedadNoX, enfermedadY);
  if (!datosFinales.enfermedadProfesional) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0); // rojo
    // X del NO enfermedad profesional - coordenadas individuales
    const xEnfermedadNoX = checkboxEnfermedadNoX + 8;
    const xEnfermedadNoY = enfermedadY + 0.5;
    doc.text("X", xEnfermedadNoX, xEnfermedadNoY);
    doc.setTextColor(0, 0, 0); // reset
  } else {
    // Espacio más grande para paréntesis más anchos
    doc.text("    ", checkboxEnfermedadNoX + 8, enfermedadY);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxEnfermedadNoX + 12, enfermedadY);

  // Instrucción
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Si la Respuesta es SI, responder las líneas inferiores", 30, enfermedadY + 5);

  // === SEGUNDA PREGUNTA: EVALUACIÓN DE ENFERMEDAD LABORAL ===
  const evaluacionY = enfermedadY + 10;
  
  // Pregunta sobre evaluación de enfermedad laboral - TODO EN UNA LÍNEA
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Ha sido evaluado para calificación de enfermedad laboral", 30, evaluacionY);
  
  // Checkboxes SI/NO para evaluación - EN LA MISMA LÍNEA
  const checkboxEvaluacionSiX = 115;
  const checkboxEvaluacionNoX = 130;
  
  // Checkbox SI para evaluación con paréntesis - ANCHO FIJO
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("SI (", checkboxEvaluacionSiX, evaluacionY);
  if (datosFinales.evaluacionEnfermedad) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0); // rojo
    // X del SI evaluación - coordenadas individuales
    const xEvaluacionSiX = checkboxEvaluacionSiX + 6;
    const xEvaluacionSiY = evaluacionY + 0.5;
    doc.text("X", xEvaluacionSiX, xEvaluacionSiY);
    doc.setTextColor(0, 0, 0); // reset
  } else {
    // Espacio fijo para mantener el ancho
    doc.text("  ", checkboxEvaluacionSiX + 6, evaluacionY);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxEvaluacionSiX + 10, evaluacionY);
  
  // Checkbox NO para evaluación con paréntesis - ANCHO MÁS GRANDE
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("NO (", checkboxEvaluacionNoX, evaluacionY);
  if (!datosFinales.evaluacionEnfermedad) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0); // rojo
    // X del NO evaluación - coordenadas individuales
    const xEvaluacionNoX = checkboxEvaluacionNoX + 8;
    const xEvaluacionNoY = evaluacionY + 0.5;
    doc.text("X", xEvaluacionNoX, xEvaluacionNoY);
    doc.setTextColor(0, 0, 0); // reset
  } else {
    // Espacio más grande para paréntesis más anchos
    doc.text("    ", checkboxEvaluacionNoX + 7, evaluacionY);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxEvaluacionNoX + 12, evaluacionY);

  // Fecha de evaluación en la misma línea
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Fecha de evaluación: " + datosFinales.fechaEvaluacion, 145, evaluacionY);

  // Texto de prueba
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("ESTO ES UNA PRUEBA EFEEEEEEEE", 30, evaluacionY + 6);

  // Especifique cual
  const especifiqueY = evaluacionY + 12;
  const textoEspecifique = "Especifique cual: " + datosFinales.especifiqueCual;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(textoEspecifique, 30, especifiqueY, { maxWidth: pageW - 50, align: "justify" });

  // === NUEVA SECCIÓN: FACTORES DE RIESGO ===
  const factoresY = especifiqueY + 7;
  
  // Título de la sección
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Que factores de Riesgos ha estado expuesto durante su historia ocupacional:", 20, factoresY);

  // Definir los factores de riesgo en 4 columnas - mapeo dinámico
  const factoresRiesgo = [
    // Columna 1
    { nombre: "Ruido", marcado: datosFinales.factoresRiesgo.ruido, x: 25, y: factoresY + 8, checkboxX: 20, checkboxY: factoresY + 5 },
    { nombre: "Polvo", marcado: datosFinales.factoresRiesgo.polvo, x: 25, y: factoresY + 14, checkboxX: 20, checkboxY: factoresY + 11 },
    { nombre: "Cargas", marcado: datosFinales.factoresRiesgo.cargas, x: 25, y: factoresY + 20, checkboxX: 20, checkboxY: factoresY + 17 },
    { nombre: "Metales", marcado: datosFinales.factoresRiesgo.metales, x: 25, y: factoresY + 26, checkboxX: 20, checkboxY: factoresY + 23 },
    
    // Columna 2
    { nombre: "Vibraciones", marcado: datosFinales.factoresRiesgo.vibraciones, x: 80, y: factoresY + 8, checkboxX: 75, checkboxY: factoresY + 5 },
    { nombre: "Altura Estructura", marcado: datosFinales.factoresRiesgo.alturaEstructura, x: 80, y: factoresY + 14, checkboxX: 75, checkboxY: factoresY + 11 },
    { nombre: "Altura Geografica", marcado: datosFinales.factoresRiesgo.alturaGeografica, x: 80, y: factoresY + 20, checkboxX: 75, checkboxY: factoresY + 17 },
    { nombre: "Otros:", marcado: false, x: 50, y: factoresY + 26, checkboxX: null, checkboxY: null },
    
    // Columna 3
    { nombre: "Temperatura", marcado: datosFinales.factoresRiesgo.temperatura, x: 120, y: factoresY + 8, checkboxX: 115, checkboxY: factoresY + 5 },
    { nombre: "Cancerigenos", marcado: datosFinales.factoresRiesgo.cancerigenos, x: 120, y: factoresY + 14, checkboxX: 115, checkboxY: factoresY + 11 },
    { nombre: "Biologicos", marcado: datosFinales.factoresRiesgo.biologicos, x: 120, y: factoresY + 20, checkboxX: 115, checkboxY: factoresY + 17 },
    
    // Columna 4
    { nombre: "Quimicos", marcado: datosFinales.factoresRiesgo.quimicos, x: 165, y: factoresY + 8, checkboxX: 160, checkboxY: factoresY + 5 },
    { nombre: "Posturas", marcado: datosFinales.factoresRiesgo.posturas, x: 165, y: factoresY + 14, checkboxX: 160, checkboxY: factoresY + 11 },
    { nombre: "Electricos", marcado: datosFinales.factoresRiesgo.electricos, x: 165, y: factoresY + 20, checkboxX: 160, checkboxY: factoresY + 17 }
  ];

  // Dibujar los factores de riesgo con checkboxes
  factoresRiesgo.forEach(factor => {
    // Solo dibujar checkbox si no es "OTROS"
    if (factor.nombre !== "OTROS:") {
      // Dibujar el checkbox cuadrado (a la izquierda) - coordenadas individuales
      doc.rect(factor.checkboxX, factor.checkboxY, 4, 4);
      
      // Si está marcado, dibujar la X
      if (factor.marcado) {
        doc.setFont("helvetica", "bold").setFontSize(12);
        doc.setTextColor(255, 0, 0); // rojo
        // Coordenadas individuales para cada X
        const xFactorX = factor.checkboxX + 0.5;
        const xFactorY = factor.checkboxY + 3.5;
        doc.text("X", xFactorX, xFactorY);
        doc.setTextColor(0, 0, 0); // reset
      }
    }
    
    // Dibujar el nombre del factor (a la derecha del checkbox)
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(factor.nombre, factor.x, factor.y);
  });

  // Campo de texto para "OTROS" - siempre visible
  const otrosY = factoresY + 26;
  doc.setFont("helvetica", "normal").setFontSize(9);

  
  // Si hay texto para "OTROS", mostrarlo
  if (datosFinales.factoresRiesgo.otros) {
    doc.text(datosFinales.factoresRiesgo.otros, 62, otrosY);
  }

  // === NUEVA SECCIÓN: ANTECEDENTES PATOLÓGICOS PERSONALES ===
  const antecedentesPatologicosY = otrosY + 10;
  
  // Título de la sección
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("2- ANTECEDENTES PATOLÓGICOS PERSONALES:", 20, antecedentesPatologicosY);
  
  // Instrucción
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Marque \"X\" si posee o tuvo alguna enfermedad diagnosticada con o sin tratamiento:", 20, antecedentesPatologicosY + 6);

  // Definir las patologías en 4 columnas - mapeo dinámico
  const patologias = [
    // Columna 1
    { nombre: "IMA (Infarto agudo al miocardio)", marcado: datosFinales.patologias.ima, x: 25, y: antecedentesPatologicosY + 11, checkboxX: 20, checkboxY: antecedentesPatologicosY + 8.5 },
    { nombre: "HTA (Hipertensión Arterial)", marcado: datosFinales.patologias.hta, x: 25, y: antecedentesPatologicosY + 16, checkboxX: 20, checkboxY: antecedentesPatologicosY + 13.5 },
    { nombre: "ACV (Acc. Cerebro Vascular)", marcado: datosFinales.patologias.acv, x: 25, y: antecedentesPatologicosY + 21, checkboxX: 20, checkboxY: antecedentesPatologicosY + 18.5 },
    { nombre: "TBC (Tuberculosis)", marcado: datosFinales.patologias.tbc, x: 25, y: antecedentesPatologicosY + 26, checkboxX: 20, checkboxY: antecedentesPatologicosY + 23.5 },
    { nombre: "ETS (Enf de Transmisión sexual)", marcado: datosFinales.patologias.ets, x: 25, y: antecedentesPatologicosY + 31, checkboxX: 20, checkboxY: antecedentesPatologicosY + 28.5 },
    { nombre: "VIH", marcado: datosFinales.patologias.vih, x: 25, y: antecedentesPatologicosY + 36, checkboxX: 20, checkboxY: antecedentesPatologicosY + 33.5 },
    { nombre: "TEC (Traumatismo Encefálico)", marcado: datosFinales.patologias.tec, x: 25, y: antecedentesPatologicosY + 41, checkboxX: 20, checkboxY: antecedentesPatologicosY + 38.5 },
    { nombre: "Fobias", marcado: datosFinales.patologias.fobias, x: 25, y: antecedentesPatologicosY + 46, checkboxX: 20, checkboxY: antecedentesPatologicosY + 43.5 },
    { nombre: "Alergias", marcado: datosFinales.patologias.alergias, x: 25, y: antecedentesPatologicosY + 51, checkboxX: 20, checkboxY: antecedentesPatologicosY + 48.5 },
    { nombre: "Asma", marcado: datosFinales.patologias.asma, x: 25, y: antecedentesPatologicosY + 56, checkboxX: 20, checkboxY: antecedentesPatologicosY + 53.5 },
    
    // Columna 2
    { nombre: "Bronquitis", marcado: datosFinales.patologias.bronquitis, x: 80, y: antecedentesPatologicosY + 11, checkboxX: 75, checkboxY: antecedentesPatologicosY + 8.5 },
    { nombre: "Diabetes", marcado: datosFinales.patologias.diabetes, x: 80, y: antecedentesPatologicosY + 16, checkboxX: 75, checkboxY: antecedentesPatologicosY + 13.5 },
    { nombre: "Hepatitis", marcado: datosFinales.patologias.hepatitis, x: 80, y: antecedentesPatologicosY + 21, checkboxX: 75, checkboxY: antecedentesPatologicosY + 18.5 },
    { nombre: "Hernias", marcado: datosFinales.patologias.hernias, x: 80, y: antecedentesPatologicosY + 26, checkboxX: 75, checkboxY: antecedentesPatologicosY + 23.5 },
    { nombre: "Vértigos", marcado: datosFinales.patologias.vertigos, x: 80, y: antecedentesPatologicosY + 31, checkboxX: 75, checkboxY: antecedentesPatologicosY + 28.5 },
    { nombre: "Tifoidea", marcado: datosFinales.patologias.tifoidea, x: 80, y: antecedentesPatologicosY + 36, checkboxX: 75, checkboxY: antecedentesPatologicosY + 33.5 },
    { nombre: "Neoplasias", marcado: datosFinales.patologias.neoplasias, x: 80, y: antecedentesPatologicosY + 41, checkboxX: 75, checkboxY: antecedentesPatologicosY + 38.5 },
    { nombre: "Quemaduras", marcado: datosFinales.patologias.quemaduras, x: 80, y: antecedentesPatologicosY + 46, checkboxX: 75, checkboxY: antecedentesPatologicosY + 43.5 },
    { nombre: "Discopatías", marcado: datosFinales.patologias.discopatias, x: 80, y: antecedentesPatologicosY + 51, checkboxX: 75, checkboxY: antecedentesPatologicosY + 48.5 },
    { nombre: "Columna", marcado: datosFinales.patologias.columna, x: 80, y: antecedentesPatologicosY + 56, checkboxX: 75, checkboxY: antecedentesPatologicosY + 53.5 },
    
    // Columna 3
    { nombre: "Convulsiones", marcado: datosFinales.patologias.convulsiones, x: 120, y: antecedentesPatologicosY + 11, checkboxX: 115, checkboxY: antecedentesPatologicosY + 8.5 },
    { nombre: "Gastritis", marcado: datosFinales.patologias.gastritis, x: 120, y: antecedentesPatologicosY + 16, checkboxX: 115, checkboxY: antecedentesPatologicosY + 13.5 },
    { nombre: "Úlceras", marcado: datosFinales.patologias.ulceras, x: 120, y: antecedentesPatologicosY + 21, checkboxX: 115, checkboxY: antecedentesPatologicosY + 18.5 },
    { nombre: "Migrañas", marcado: datosFinales.patologias.migranas, x: 120, y: antecedentesPatologicosY + 26, checkboxX: 115, checkboxY: antecedentesPatologicosY + 23.5 },
    { nombre: "Enf Psiquiátricas", marcado: datosFinales.patologias.enfPsiquiatricas, x: 120, y: antecedentesPatologicosY + 31, checkboxX: 115, checkboxY: antecedentesPatologicosY + 28.5 },
    { nombre: "Enf Cardiovasculares", marcado: datosFinales.patologias.enfCardiovasculares, x: 120, y: antecedentesPatologicosY + 36, checkboxX: 115, checkboxY: antecedentesPatologicosY + 33.5 },
    { nombre: "Enf Oculares", marcado: datosFinales.patologias.enfOculares, x: 120, y: antecedentesPatologicosY + 41, checkboxX: 115, checkboxY: antecedentesPatologicosY + 38.5 },
    { nombre: "Enf Reumática", marcado: datosFinales.patologias.enfReumatica, x: 120, y: antecedentesPatologicosY + 46, checkboxX: 115, checkboxY: antecedentesPatologicosY + 43.5 },
    { nombre: "Enf Pulmonares", marcado: datosFinales.patologias.enfPulmonares, x: 120, y: antecedentesPatologicosY + 51, checkboxX: 115, checkboxY: antecedentesPatologicosY + 48.5 },
    { nombre: "Enf de la Piel", marcado: datosFinales.patologias.enfPiel, x: 120, y: antecedentesPatologicosY + 56, checkboxX: 115, checkboxY: antecedentesPatologicosY + 53.5 },
    
    // Columna 4
    { nombre: "Tendinitis", marcado: datosFinales.patologias.tendinitis, x: 165, y: antecedentesPatologicosY + 11, checkboxX: 160, checkboxY: antecedentesPatologicosY + 8.5 },
    { nombre: "Onicomicosis", marcado: datosFinales.patologias.onicomicosis, x: 165, y: antecedentesPatologicosY + 16, checkboxX: 160, checkboxY: antecedentesPatologicosY + 13.5 },
    { nombre: "Fracturas", marcado: datosFinales.patologias.fracturas, x: 165, y: antecedentesPatologicosY + 21, checkboxX: 160, checkboxY: antecedentesPatologicosY + 18.5 },
    { nombre: "Anemia", marcado: datosFinales.patologias.anemia, x: 165, y: antecedentesPatologicosY + 26, checkboxX: 160, checkboxY: antecedentesPatologicosY + 23.5 },
    { nombre: "Obesidad", marcado: datosFinales.patologias.obesidad, x: 165, y: antecedentesPatologicosY + 31, checkboxX: 160, checkboxY: antecedentesPatologicosY + 28.5 },
    { nombre: "Dislipidemia", marcado: datosFinales.patologias.dislipidemia, x: 165, y: antecedentesPatologicosY + 36, checkboxX: 160, checkboxY: antecedentesPatologicosY + 33.5 },
    { nombre: "Intoxicaciones", marcado: datosFinales.patologias.intoxicaciones, x: 165, y: antecedentesPatologicosY + 41, checkboxX: 160, checkboxY: antecedentesPatologicosY + 38.5 },
    { nombre: "Amputación", marcado: datosFinales.patologias.amputacion, x: 165, y: antecedentesPatologicosY + 46, checkboxX: 160, checkboxY: antecedentesPatologicosY + 43.5 },
    { nombre: "Sordera", marcado: datosFinales.patologias.sordera, x: 165, y: antecedentesPatologicosY + 51, checkboxX: 160, checkboxY: antecedentesPatologicosY + 48.5 }
  ];

  // Dibujar las patologías con checkboxes
  patologias.forEach(patologia => {
    // Dibujar el checkbox cuadrado (a la izquierda)
    doc.rect(patologia.checkboxX, patologia.checkboxY, 4, 3);
    
    // Si está marcado, dibujar la X
    if (patologia.marcado) {
      doc.setFont("helvetica", "bold").setFontSize(11);
      doc.setTextColor(255, 0, 0); // rojo
      // Coordenadas individuales para cada X
      const xPatologiaX = patologia.checkboxX + 0.7;
      const xPatologiaY = patologia.checkboxY + 2.88;
      doc.text("X", xPatologiaX, xPatologiaY);
      doc.setTextColor(0, 0, 0); // reset
    }
    
    // Dibujar el nombre de la patología (a la derecha del checkbox)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(patologia.nombre, patologia.x, patologia.y);
  });

  // Campo de texto para "Otros Patologías"
  const otrosPatologiasY = antecedentesPatologicosY + 72;
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Otros Patologías", 20, otrosPatologiasY);
  doc.text("________________________", 50, otrosPatologiasY);
  
  // Si hay texto para "Otros Patologías", mostrarlo
  if (datosFinales.patologias.otros) {
    doc.text(datosFinales.patologias.otros, 50, otrosPatologiasY);
  }

  // Texto de prueba
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("ESTO ES UNA PRUEBA EFEEEEEEEE", 60, otrosPatologiasY + 6);

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
