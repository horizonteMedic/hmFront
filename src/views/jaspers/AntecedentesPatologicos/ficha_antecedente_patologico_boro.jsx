import jsPDF from "jspdf";

export default function FichaAntecedentePatologicoBoro(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  
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
    causaBasica: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
    },
    // Datos de alergias
    alergiasMedicamentos: true,
    especifiqueAlergias: "ESTO ES UNA PRUEBA EFEEEEEEEE",
    // Datos de vacunas
    vacunas: {
      antitetanica: true,
      fiebreAmarilla: true,
      influenza: true,
      hepatitisA: true,
      hepatitisB: true,
      gripeInfluenza: true,
      neumococo: true,
      rabia: true,
      papilomaHumano: true,
      covid19: true
    },
    numeroDosisCovid: "10",
    // Datos de antecedentes quirúrgicos
    antecedentesQuirurgicos: [
      { 
        fecha: "2022", 
        hospital: "Hospital Nacional de Especialidades", 
        operacion: "Apendicectomían ", 
        diasHospitalizacion: "3", 
        complicaciones: "Ninguna" 
      },
      { 
        fecha: "2022", 
        hospital: "Hospital Nacional de Especialidades", 
        operacion: "Apendicectomía laparoscópica", 
        diasHospitalizacion: "3", 
        complicaciones: "Ninguna complicación postoperatoria" 
      },
      { 
        fecha: "2022", 
        hospital: "Hospital Nacional de Especialidades Médicas de Alta Complejidad y Centro de Investigación Clínica", 
        operacion: "Apendicectomía laparoscópica con resección de apéndice cecal y anastomosis ileocecal", 
        diasHospitalizacion: "3", 
        complicaciones: "Ninguna complicación postoperatoria, evolución satisfactoria, alta médica sin observaciones" 
      }
    ],
    // Datos de hábitos
    habitos: {
      alcohol: false,
      especifiqueAlcohol: "",
      tabaco: false,
      especifiqueTabaco: "",
      drogas: false,
      especifiqueDrogas: "",
      medicamentos: true,
      especifiqueMedicamentos: "ESTO ES UNA PRUEBA EFEEEEEEEE",
      actividadFisica: true,
      especifiqueActividadFisica: "ESTO ES UNA PRUEBA EFEEEEEEEE"
    },
    // Datos de antecedentes patológicos familiares
    antecedentesFamiliares: {
      padre: "ESTO ES UNA PRUEBA EFEEEEEEEE",
      madre: "ESTO ES UNA PRUEBA EFEEEEEEEE",
      hermanos: "ESTO ES UNA PRUEBA EFEEEEEEEE",
      hijos: "ESTO ES UNA PRUEBA EFEEEEEEEE",
      esposaConyuge: "ESTO ES UNA PRUEBA EFEEEEEEEE"
    },
    // Datos de condición médica especial o discapacidad
    condicionMedica: {
      carnetConadis: "ESTO ES UNA PRUEBA EFEEEEEEEE"
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
    patologias: data.patologias || datosPrueba.patologias,
    // Datos de alergias
    alergiasMedicamentos: data.alergiasMedicamentos !== undefined ? data.alergiasMedicamentos : datosPrueba.alergiasMedicamentos,
    especifiqueAlergias: data.especifiqueAlergias || datosPrueba.especifiqueAlergias,
    // Datos de vacunas
    vacunas: data.vacunas || datosPrueba.vacunas,
    numeroDosisCovid: data.numeroDosisCovid || datosPrueba.numeroDosisCovid,
    // Datos de antecedentes quirúrgicos
    antecedentesQuirurgicos: data.antecedentesQuirurgicos || datosPrueba.antecedentesQuirurgicos,
    // Datos de hábitos
    habitos: data.habitos || datosPrueba.habitos,
    // Datos de antecedentes patológicos familiares
    antecedentesFamiliares: data.antecedentesFamiliares || datosPrueba.antecedentesFamiliares,
    // Datos de condición médica especial o discapacidad
    condicionMedica: data.condicionMedica || datosPrueba.condicionMedica
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
  doc.text("Empresa:", 20, 40);
  let anchoEmpresa = doc.getTextWidth("EMPRESA: "); // espacio después de ": "

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.empresa, 20 + anchoEmpresa, 40);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Fecha:", pageW - 50, 40);
  let anchoFecha = doc.getTextWidth("FECHA: ");

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.fechaExamen, pageW - 50 + anchoFecha, 40);

  // === DECLARACIÓN JURADA ===
  const declaracionY = 45;
  doc.setFont("helvetica", "normal").setFontSize(9);
  const declaracionTexto = `Yo; ${datosFinales.apellidosNombres} de ${datosFinales.edad} de edad, con DNI/CE/PASAPORTE ${datosFinales.documentoIdentidad}, declaro que toda la información proporcionada en esta declaración jurada es verdadera no habiendo omitido ningún dato personal ni laboral relevante de forma voluntaria.`;
  doc.text(declaracionTexto, 20, declaracionY, { maxWidth: pageW - 40 });

  // === ANTECEDENTES PATOLÓGICOS PERSONALES ===
  const antecedentesY = declaracionY + 15;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("1. ANTECEDENTES PATOLÓGICOS PERSONALES:", 20, antecedentesY);

  // Puesto al que Postula
  const puestoY = antecedentesY + 5;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Puesto al que Postula: ", 20, puestoY);
  doc.text(datosFinales.puestoTrabajo, 58, puestoY);

  // Tiempo de Experiencia
  doc.text("Tiempo de Experiencia: " + datosFinales.tiempoExperiencia, 20, puestoY + 5);

  // Pregunta sobre accidentes de trabajo - TODO EN UNA LÍNEA
  const accidenteY = puestoY + 10;
  
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
  const causaBasicaLines = doc.getTextWidth(textoCompleto) / (pageW - 50);
  const causaBasicaHeight = Math.ceil(causaBasicaLines) * 4; // 4mm por línea
  doc.text(textoCompleto, 30, causaBasicaY, { maxWidth: pageW - 50, align: "justify" });

  // === NUEVA SECCIÓN: ENFERMEDAD PROFESIONAL ===
  const enfermedadY = causaBasicaY + causaBasicaHeight + 5; // Espacio dinámico basado en la altura del texto
  
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

  // Especifique cual
  const especifiqueY = evaluacionY + 5;
  const textoEspecifique = "Especifique cual: " + datosFinales.especifiqueCual;
  doc.setFont("helvetica", "normal").setFontSize(9);
  const especifiqueLines = doc.getTextWidth(textoEspecifique) / (pageW - 50);
  const especifiqueHeight = Math.ceil(especifiqueLines) * 4; // 4mm por línea
  doc.text(textoEspecifique, 30, especifiqueY, { maxWidth: pageW - 50, align: "justify" });

  // === NUEVA SECCIÓN: FACTORES DE RIESGO ===
  const factoresY = especifiqueY + especifiqueHeight + 5; // Espacio dinámico basado en la altura del texto
  
  // Título de la sección
  doc.setFont("helvetica", "bold").setFontSize(9);
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
  const antecedentesPatologicosY = otrosY + 8;
  
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

  // === SECCIÓN "OTROS" Y "PATOLOGÍAS" ===
  const otrosPatologiasY = antecedentesPatologicosY + 62; // Después de la última fila de patologías
  
  // Línea 1: "Otros: texto" en la misma línea
  doc.setFont("helvetica", "normal").setFontSize(9);
  const otrosTexto = "Otros: " + (datosFinales.factoresRiesgo.otros || "");
  doc.text(otrosTexto, 20, otrosPatologiasY);
  
  // Línea 2: "Patologías: texto" en la misma línea
  const patologiasY = otrosPatologiasY + 4;
  const patologiasTexto = "Patologías: " + (datosFinales.patologias.otros || "");
  doc.text(patologiasTexto, 20, patologiasY);

  // === SECCIÓN "ALERGIAS A MEDICAMENTOS / ALIMENTOS" ===
  const alergiasY = patologiasY + 5;
  
  // Título de la sección
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Alergias a Medicamentos / Alimentos", 20, alergiasY);
  
  // Checkboxes SI/NO en la misma línea
  const checkboxAlergiasSiX = 120;
  const checkboxAlergiasNoX = 135;
  
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("SI (", checkboxAlergiasSiX, alergiasY);
  if (datosFinales.alergiasMedicamentos) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0);
    const xAlergiasSiX = checkboxAlergiasSiX + 6.5;
    const xAlergiasSiY = alergiasY + 0.5;
    doc.text("X", xAlergiasSiX, xAlergiasSiY);
    doc.setTextColor(0, 0, 0);
  } else {
    doc.text("  ", checkboxAlergiasSiX + 7, alergiasY);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxAlergiasSiX + 10, alergiasY);

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("NO (", checkboxAlergiasNoX, alergiasY);
  if (!datosFinales.alergiasMedicamentos) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0);
    const xAlergiasNoX = checkboxAlergiasNoX + 8;
    const xAlergiasNoY = alergiasY + 0.5;
    doc.text("X", xAlergiasNoX, xAlergiasNoY);
    doc.setTextColor(0, 0, 0);
  } else {
    doc.text("    ", checkboxAlergiasNoX + 7, alergiasY);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxAlergiasNoX + 12, alergiasY);

  // Campo "Especifique:" en la línea siguiente
  const especifiqueAlergiasY = alergiasY + 6;
  doc.setFont("helvetica", "normal").setFontSize(9);
  const especifiqueAlergiasTexto = "Especifique: " + (datosFinales.especifiqueAlergias || "");
  doc.text(especifiqueAlergiasTexto, 20, especifiqueAlergiasY);

  // === SECCIÓN "ANTECEDENTES INMUNOLÓGICOS / VACUNAS" ===
  const vacunasY = especifiqueAlergiasY + 8;
  
  // Título de la sección
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("3- ANTECEDENTES INMUNOLÓGICOS / VACUNAS:", 20, vacunasY);
  
  // Instrucción
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Marque \"X\" si ha recibido las siguientes vacunas:", 20, vacunasY + 6);

  // Definir las vacunas en 3 columnas - mapeo dinámico
  const vacunas = [
    // Columna 1
    { nombre: "Antitetánica", marcado: datosFinales.vacunas.antitetanica, x: 25, y: vacunasY + 11, checkboxX: 20, checkboxY: vacunasY + 8.5 },
    { nombre: "Fiebre Amarilla", marcado: datosFinales.vacunas.fiebreAmarilla, x: 25, y: vacunasY + 17, checkboxX: 20, checkboxY: vacunasY + 14.5 },
    { nombre: "Influenza", marcado: datosFinales.vacunas.influenza, x: 25, y: vacunasY + 23, checkboxX: 20, checkboxY: vacunasY + 20.5 },
    { nombre: "Hepatitis A", marcado: datosFinales.vacunas.hepatitisA, x: 25, y: vacunasY + 29, checkboxX: 20, checkboxY: vacunasY + 26.5 },
    
    // Columna 2
    { nombre: "Hepatitis B", marcado: datosFinales.vacunas.hepatitisB, x: 80, y: vacunasY + 11, checkboxX: 75, checkboxY: vacunasY + 8.5 },
    { nombre: "Gripe/Influenza", marcado: datosFinales.vacunas.gripeInfluenza, x: 80, y: vacunasY + 17, checkboxX: 75, checkboxY: vacunasY + 14.5 },
    { nombre: "Neumococo", marcado: datosFinales.vacunas.neumococo, x: 80, y: vacunasY + 23, checkboxX: 75, checkboxY: vacunasY + 20.5 },
    { nombre: "Rabia", marcado: datosFinales.vacunas.rabia, x: 80, y: vacunasY + 29, checkboxX: 75, checkboxY: vacunasY + 26.5 },
    
    // Columna 3
    { nombre: "Papiloma Humano", marcado: datosFinales.vacunas.papilomaHumano, x: 120, y: vacunasY + 11, checkboxX: 115, checkboxY: vacunasY + 8.5 },
    { nombre: "Covid-19", marcado: datosFinales.vacunas.covid19, x: 120, y: vacunasY + 17, checkboxX: 115, checkboxY: vacunasY + 14.5 }
  ];

  // Dibujar las vacunas con checkboxes
  vacunas.forEach(vacuna => {
    // Dibujar el checkbox cuadrado (a la izquierda)
    doc.rect(vacuna.checkboxX, vacuna.checkboxY, 4, 3);
    
    // Si está marcado, dibujar la X
    if (vacuna.marcado) {
      doc.setFont("helvetica", "bold").setFontSize(11);
      doc.setTextColor(255, 0, 0); // rojo
      // Coordenadas individuales para cada X
      const xVacunaX = vacuna.checkboxX + 0.7;
      const xVacunaY = vacuna.checkboxY + 2.88;
      doc.text("X", xVacunaX, xVacunaY);
      doc.setTextColor(0, 0, 0); // reset
    }
    
    // Dibujar el nombre de la vacuna (a la derecha del checkbox)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(vacuna.nombre, vacuna.x, vacuna.y);
  });

  // Campo especial para "N° de Dosis" de COVID-19 (solo si está marcado)
  if (datosFinales.vacunas.covid19) {
    const dosisY = vacunasY + 17; // Misma línea que Covid-19
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("N° de Dosis:", 140, dosisY);
    
    // Número de dosis entre paréntesis
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text(datosFinales.numeroDosisCovid || "10", 160, dosisY);
    
  
  }



  // === PÁGINA 2 ===
  doc.addPage();
  numeroPagina++; // Incrementar contador de página
  
  // === HEADER PÁGINA 2 ===
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("DECLARACIÓN JURADA DE DATOS MÉDICOS", pageW / 2, 26, { align: "center" });
  doc.text("Y ANTECEDENTES", pageW / 2, 32, { align: "center" });

  // Número de Ficha y Página - Página 2 (tipo lista)
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Nro de ficha: ", pageW - 50, 20);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(datosFinales.numeroFicha, pageW - 30, 20);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Sede: " + datosFinales.sede, pageW - 50, 25);
  doc.text("Pag. " + numeroPagina.toString().padStart(2, '0'), pageW - 50, 30);

  // === ANTECEDENTES QUIRÚRGICOS ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("4. ANTECEDENTES QUIRÚRGICOS:", 15, 40);

  // Tabla de antecedentes quirúrgicos - con separación del título
  const tablaInicioY = 45; // Aumentado de 42 a 45 para mayor separación
  const tablaInicioX = 15;
  const colWidths = [20, 55, 40, 17, 53]; // Anchos de columnas ajustados
  const tablaAncho = colWidths.reduce((a, b) => a + b, 0);

  // Usar los datos de antecedentes quirúrgicos de datosFinales
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
    const margenInferior = 0.5; // 1.5mm margen inferior (aumentado para mejor visualización)
    return alturaContenido + margenSuperior + margenInferior;
  };

  // Calcular alturas de filas dinámicamente
  const alturasFilas = antecedentesConDatos.map(fila => calcularAlturaFila(fila, colWidths, doc));
  const alturaTotalFilas = alturasFilas.reduce((sum, altura) => sum + altura, 0);

  // Líneas horizontales para filas con alturas dinámicas
  let lineY = tablaInicioY + 2;
  doc.line(tablaInicioX, lineY, tablaInicioX + tablaAncho, lineY); // Línea superior (debajo de encabezados)
  
  // Dibujar líneas horizontales entre filas
  alturasFilas.forEach((alturaFila) => {
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
    const rowY = currentY + margenSuperior + 2; // 1.5mm margen + 1mm para centrar el texto
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
    
    // Actualizar currentY para la siguiente fila
    currentY += alturaFila;
  });

  // === SECCIÓN HÁBITOS ===
  const habitosY = currentY + 10; // Espacio después de la tabla
  
  // Título de la sección
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("5- HÁBITOS:", 15, habitosY);

  // Función para crear checkboxes SI/NO
  const crearCheckboxes = (x, y, marcado) => {
    // Checkbox SI - siempre con el mismo ancho
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("SI (", x, y);
    if (marcado) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.setTextColor(255, 0, 0);
      doc.text("X", x + 6.5, y + 0.5);
      doc.setTextColor(0, 0, 0);
    }
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(")", x + 10, y);
    
    // Checkbox NO - siempre con el mismo ancho
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("NO (", x + 20, y);
    if (!marcado) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.setTextColor(255, 0, 0);
      doc.text("X", x + 28.3, y + 0.5);
      doc.setTextColor(0, 0, 0);
    }
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(")", x + 32, y);
  };

  // Alcohol
  let currentHabitY = habitosY + 8;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Alcohol:", 15, currentHabitY);
  crearCheckboxes(40, currentHabitY, datosFinales.habitos.alcohol);
  doc.text("Especifique:", 75, currentHabitY);
  doc.text(datosFinales.habitos.especifiqueAlcohol || "", 95, currentHabitY);

  // Tabaco
  currentHabitY += 6;
  doc.text("Tabaco:", 15, currentHabitY);
  crearCheckboxes(40, currentHabitY, datosFinales.habitos.tabaco);
  doc.text("Especifique:", 75, currentHabitY);
  doc.text(datosFinales.habitos.especifiqueTabaco || "", 95, currentHabitY);

  // Drogas
  currentHabitY += 6;
  doc.text("Drogas:", 15, currentHabitY);
  crearCheckboxes(40, currentHabitY, datosFinales.habitos.drogas);
  doc.text("Especifique:", 75, currentHabitY);
  doc.text(datosFinales.habitos.especifiqueDrogas || "", 95, currentHabitY);

  // Medicamentos
  currentHabitY += 6;
  doc.text("Medicamentos:", 15, currentHabitY);
  crearCheckboxes(40, currentHabitY, datosFinales.habitos.medicamentos);
  doc.text("Especifique:", 75, currentHabitY);
  doc.text(datosFinales.habitos.especifiqueMedicamentos || "", 95, currentHabitY);

  // Actividad Física
  currentHabitY += 6;
  doc.text("Actividad Física:", 15, currentHabitY);
  crearCheckboxes(40, currentHabitY, datosFinales.habitos.actividadFisica);
  doc.text("Especifique:", 75, currentHabitY);
  doc.text(datosFinales.habitos.especifiqueActividadFisica || "", 95, currentHabitY);

  // === SECCIÓN 6: ANTECEDENTES PATOLÓGICOS FAMILIARES ===
  const familiaresY = currentHabitY + 10;
  
  // Título de la sección
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("6- ANTECEDENTES PATOLÓGICOS FAMILIARES:", 15, familiaresY);
  
  // Instrucción
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Detallar si el familiar posee alguna patología o enfermedad, si ha fallecido indique la causa:", 15, familiaresY + 6);

  // Padre
  let currentFamiliarY = familiaresY + 12;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Padre:", 15, currentFamiliarY);
  doc.text("Especifique:", 45, currentFamiliarY);
  doc.text(datosFinales.antecedentesFamiliares.padre || "", 65, currentFamiliarY);

  // Madre
  currentFamiliarY += 6;
  doc.text("Madre:", 15, currentFamiliarY);
  doc.text("Especifique:", 45, currentFamiliarY);
  doc.text(datosFinales.antecedentesFamiliares.madre || "", 65, currentFamiliarY);

  // Hermanos
  currentFamiliarY += 6;
  doc.text("Hermanos:", 15, currentFamiliarY);
  doc.text("Especifique:", 45, currentFamiliarY);
  doc.text(datosFinales.antecedentesFamiliares.hermanos || "", 65, currentFamiliarY);

  // Hijos
  currentFamiliarY += 6;
  doc.text("Hijos:", 15, currentFamiliarY);
  doc.text("Especifique:", 45, currentFamiliarY);
  doc.text(datosFinales.antecedentesFamiliares.hijos || "", 65, currentFamiliarY);

  // Esposa/Cónyuge
  currentFamiliarY += 6;
  doc.text("Esposa/ Cónyuge:", 15, currentFamiliarY);
  doc.text("Especifique:", 45, currentFamiliarY);
  doc.text(datosFinales.antecedentesFamiliares.esposaConyuge || "", 65, currentFamiliarY);

  // === SECCIÓN 7: CONDICIÓN MÉDICA ESPECIAL O DISCAPACIDAD ===
  const condicionY = currentFamiliarY + 10;
  
  // Título de la sección
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("7- ALGUNA CONDICION MÉDICA ESPECIAL O DISCAPACIDAD:", 15, condicionY);
  
  // Instrucción
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Si posee Carné de CONADIS, especifique:", 15, condicionY + 6);
  
  // Campo de especificación
  const condicionEspecifiqueY = condicionY + 12;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.condicionMedica.carnetConadis || "", 15, condicionEspecifiqueY);

  // === DECLARACIÓN Y FIRMAS ===
  const declaracionFirmasY = condicionEspecifiqueY + 15; // Espacio después de la sección 7
  
  // Texto de declaración centrado
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("TODA LA INFORMACIÓN QUE HE PROPORCIONADO AL SERVICIO DE MEDICINA OCUPACIONAL,", pageW / 2, declaracionFirmasY, { align: "center" });
  doc.text("ES VERDADERA NO HABIENDO OMITIDO NINGÚN DATO VOLUNTARIAMENTE.", pageW / 2, declaracionFirmasY + 4, { align: "center" });
  
  // Fecha centrada
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("FECHA: " + datosFinales.fechaExamen, pageW / 2, declaracionFirmasY + 10, { align: "center" });
  
  // Sección de firmas con más margen
  const firmasY = declaracionFirmasY + 23;
  
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
    doc.addImage(
      '/img/firmas_sellos_prueba/firma_de_prueba_jaspers.png',
      'PNG',
      firmaPacienteX - 30, firmasY - 8, 40, 25
    );
    
    // Huella digital - centrada
    // Tamaño: 15mm ancho x 21mm alto
    // Posición: X = firmaPacienteX + 5, Y = firmasY - 8
    doc.addImage(
      '/img/firmas_sellos_prueba/HUELLA_DIGITAL.png',
      'PNG',
      firmaPacienteX + 10, firmasY - 5, 15, 21
    );
    
    // Firma/sello del médico - centrada
    // Tamaño: 40mm ancho x 25mm alto
    // Posición: X = firmaMedicoX - 12, Y = firmasY - 8
    doc.addImage(
      '/img/firmas_sellos_prueba/firma_sello.png',
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
