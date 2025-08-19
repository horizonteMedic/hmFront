import jsPDF from "jspdf";
import headerEvaluacionMuscoloEsqueletica from "./Headers/Header_EvaluacionMuscoloEsqueletica2021_Digitalizado_boro.jsx";

export default function EvaluacionMuscoloEsqueletica2021_Digitalizado_boro(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Datos de prueba para los campos de evaluación
  const datosPrueba = {
    // === APTITUD ESPALDA ===
    puntosAbdomen: "2",
    puntosCadera: "1", 
    puntosMuslo: "3",
    puntosAbdomenLateral: "2",
    totalAptitudEspalda: "8",
    observacionesAptitudEspalda: "Paciente presenta buena flexibilidad en general, con limitaciones moderadas en muslo.",
    
    // === RANGOS ARTICULARES ===
    puntosAbduccionNormal: "1",
    puntosAbduccion60: "2", 
    puntosRotacionExterna: "1",
    puntosRotacionInterna: "2",
    totalRangosArticulares: "6",
    // dolorContraResistencia ahora será un objeto con múltiples evaluaciones
    dolorContraResistencia: {
      evaluacion1: "NO",
      evaluacion2: "SI", 
      evaluacion3: "NO",
      evaluacion4: "SI",
      evaluacion5: "NO"
    },
    observacionesRangosArticulares: "Rangos articulares dentro de parámetros normales, sin dolor significativo.",
    
         // === COLUMNA VERTEBRAL - HALLAZGOS ===
     desviacionEje: {
       hallazgo: true, // true = Si, false = No
       descripcion: "Desviación leve hacia la derecha en nivel L3-L4"
     },
     testAdams: {
       hallazgo: false, // true = (+), false = (-)
       descripcion: "Test negativo, sin escoliosis aparente"
     },
     dandy: {
       hallazgo: true, // true = (+), false = (-)
       descripcion: "Positivo en miembro inferior derecho"
     },
     lasegue: {
       hallazgo: false, // true = (+), false = (-)
       descripcion: "Test negativo, sin radiculopatía"
     },
     contracturaMuscular: {
       hallazgo: true, // true = Si, false = No
       descripcion: "Contractura en músculos paravertebrales lumbares"
     },
     cicatrizPostOperatoria: {
       hallazgo: false, // true = Si, false = No
       descripcion: "Sin cicatrices post-operatorias evidentes"
     },
     
           // === TESTS DE MIEMBROS SUPERIORES ===
      testJobe: {
        der: true, // true = Si (no hay limitación), false = No (hay limitación)
        izq: false // true = Si (no hay limitación), false = No (hay limitación)
      },
      testPatte: {
        der: false, // true = Si (no hay limitación), false = No (hay limitación)
        izq: true // true = Si (no hay limitación), false = No (hay limitación)
      },
      testGerber: {
        der: true, // true = Si (no hay limitación), false = No (hay limitación)
        izq: true // true = Si (no hay limitación), false = No (hay limitación)
      },
      pullUpTest: {
        der: false, // true = Si (no hay limitación), false = No (hay limitación)
        izq: false // true = Si (no hay limitación), false = No (hay limitación)
      },
      
      // === TESTS DE PÁGINA 2 ===
      epicondilitis: {
        der: false, // true = Si (no hay dolor), false = No (hay dolor)
        izq: false // true = Si (no hay dolor), false = No (hay dolor)
      },
      epitrocleitis: {
        der: false, // true = Si (no hay dolor), false = No (hay dolor)
        izq: false // true = Si (no hay dolor), false = No (hay dolor)
      },
      phalen: {
        der: false, // true = Si (no hay parestesias), false = No (hay parestesias)
        izq: false // true = Si (no hay parestesias), false = No (hay parestesias)
      },
      phalenInvertido: {
        der: false, // true = Si (no hay parestesias), false = No (hay parestesias)
        izq: false // true = Si (no hay parestesias), false = No (hay parestesias)
      },
      tinel: {
        der: false, // true = Si (no hay parestesias), false = No (hay parestesias)
        izq: false // true = Si (no hay parestesias), false = No (hay parestesias)
      },
      finkelstein: {
        der: false, // true = Si (no hay dolor), false = No (hay dolor)
        izq: false // true = Si (no hay dolor), false = No (hay dolor)
      },
      
      // === EVALUACIÓN MÚSCULO ESQUELÉTICA DE CADERA Y MIEMBROS INFERIORES ===
      caderaDerecha: {
        abduccion: "45",
        aduccion: "30",
        flexion: "120",
        extension: "15",
        rotacionInterna: "35",
        rotacionExterna: "45",
        irradiacion: "0",
        altMasaMuscular: "0"
      },
      caderaIzquierda: {
        abduccion: "42",
        aduccion: "28",
        flexion: "118",
        extension: "12",
        rotacionInterna: "32",
        rotacionExterna: "42",
        irradiacion: "0",
        altMasaMuscular: "0"
      },
      rodillaDerecha: {
        flexion: "135",
        extension: "0",
        rotacionInterna: "0",
        rotacionExterna: "0",
        irradiacion: "0",
        altMasaMuscular: "0"
      },
      rodillaIzquierda: {
        flexion: "132",
        extension: "0",
        rotacionInterna: "0",
        rotacionExterna: "0",
        irradiacion: "0",
        altMasaMuscular: "0"
      },
      tobilloDerecho: {
        abduccion: "50",
        aduccion: "20",
        flexion: "35",
        extension: "25",
        rotacionExterna: "15",
        rotacionInterna: "12",
        irradiacion: "0",
        altMasaMuscular: "0"
      },
      tobilloIzquierdo: {
        abduccion: "48",
        aduccion: "18",
        flexion: "32",
        extension: "22",
        rotacionExterna: "14",
        rotacionInterna: "10",
        irradiacion: "0",
        altMasaMuscular: "0"
      },
      
      // === CONCLUSIONES Y RECOMENDACIONES ===
      conclusiones: "Paciente presenta limitaciones moderadas en rangos articulares de hombro derecho, con dolor a la contraresistencia. Aptitud espalda dentro de parámetros normales.",
      cie10: "M25.51 - Dolor en hombro derecho",
      recomendaciones: "1. Evitar movimientos repetitivos por encima del hombro\n2. Ejercicios de fortalecimiento progresivo\n3. Control en 4 semanas\n4. Evaluación ergonómica del puesto"
  };
  const leerBoolSINO = (res, name) => {
    if (res[name + "Si"]) {
      return "SI";
    }
    if (res[name + "No"]) {
      return "NO";
    }
    return "";
  };

   const datosReales = {
    // === APTITUD ESPALDA ===
    puntosAbdomen: data.aptitudEspaldaAbdomen ?? "",
    puntosCadera: data.aptitudEspaldaCadera ?? "",
    puntosMuslo: data.aptitudEspaldaMuslo ?? "",
    puntosAbdomenLateral: data.aptitudEspaldaAbdomenL ?? "",
    totalAptitudEspalda: data.totalPuntosAptitudEspalda ?? "",
    observacionesAptitudEspalda: data.observacionAptitudEspalda ?? "",
    
    // === RANGOS ARTICULARES ===
    puntosAbduccionNormal: data.rangosArticularesAbduccion180 ?? "",
    puntosAbduccion60: data.rangosArticularesAbduccion60 ?? "", 
    puntosRotacionExterna: data.rangosArticularesRotacion90 ?? "",
    puntosRotacionInterna: data.rangosArticularesRotacionInterna ?? "",
    totalRangosArticulares: data.totalPuntosRangosArticulares ?? "",
    // dolorContraResistencia ahora será un objeto con múltiples evaluaciones
    dolorContraResistencia: {
      evaluacion1: leerBoolSINO(data,"rangosArticularesAbduccion180"),
      evaluacion2: leerBoolSINO(data,"rangosArticularesAbduccion60"),
      evaluacion3: leerBoolSINO(data,"rangosArticularesRotacion90"),
      evaluacion4: leerBoolSINO(data,"rangosArticularesRotacionInterna"),
      evaluacion5: "",
    },
    observacionesRangosArticulares: data.observacionRangosArticulares??"",
    
         // === COLUMNA VERTEBRAL - HALLAZGOS ===
     desviacionEje: {
       hallazgo: data.columnaVertebralDesviacionSi, // true = Si, false = No
       descripcion: data.columnaVertebralDesviacionDescripcion??""
     },
     testAdams: {
       hallazgo: data.columnaVertebralAdamsPositivo, // true = (+), false = (-)
       descripcion: data.columnaVertebralAdamsDescripcion ?? "",
     },
     dandy: {
       hallazgo: data.columnaVertebralDandyPositivo, // true = (+), false = (-)
       descripcion: data.columnaVertebralDandyDescripcion??""
     },
     lasegue: {
       hallazgo: data.columnaVertebralLaseguePositivo, // true = (+), false = (-)
       descripcion: data.columnaVertebralLasegueDescripcion ?? "",
     },
     contracturaMuscular: {
       hallazgo: data.columnaVertebralContracturaSi, // true = Si, false = No
       descripcion: data.columnaVertebralContracturaDescripcion ?? ""
     },
     cicatrizPostOperatoria: {
       hallazgo: data.columnaVertebralCicatrizSi, // true = Si, false = No
       descripcion: data.columnaVertebralCicatrizDescripcion ?? ""
     },
     
           // === TESTS DE MIEMBROS SUPERIORES ===
      testJobe: {
        der: data.testJobederechaSi, // true = Si (no hay limitación), false = No (hay limitación)
        izq: data.testJobeizquierdaSi // true = Si (no hay limitación), false = No (hay limitación)
      },
      testPatte: {
        der: data.testPateDerechaSi, // true = Si (no hay limitación), false = No (hay limitación)
        izq: data.testPateIzquierdaSi // true = Si (no hay limitación), false = No (hay limitación)
      },
      testGerber: {
        der: data.testGerberDerechaSi, // true = Si (no hay limitación), false = No (hay limitación)
        izq: data.testGerberIzquierdaSi // true = Si (no hay limitación), false = No (hay limitación)
      },
      pullUpTest: {
        der: data.testPulmDerechaSi, // true = Si (no hay limitación), false = No (hay limitación)
        izq: data.testPulmIzquierdaSi // true = Si (no hay limitación), false = No (hay limitación)
      },
      
      // === TESTS DE PÁGINA 2 ===
      epicondilitis: {
        der: data.epiconDilitisDerechaSi, // true = Si (no hay dolor), false = No (hay dolor)
        izq: data.epiconDilitisizquierdaSi // true = Si (no hay dolor), false = No (hay dolor)
      },
      epitrocleitis: {
        der: data.epitroCleitisDerechaSi, // true = Si (no hay dolor), false = No (hay dolor)
        izq: data.epitroCleitisIzquierdaSi // true = Si (no hay dolor), false = No (hay dolor)
      },
      phalen: {
        der: data.phalenDerechaSi, // true = Si (no hay parestesias), false = No (hay parestesias)
        izq: data.phalenIzquierdaSi // true = Si (no hay parestesias), false = No (hay parestesias)
      },
      phalenInvertido: {
        der: data.phalenInvertidoDerechaSi, // true = Si (no hay parestesias), false = No (hay parestesias)
        izq: data.phalenInvertidoIzquierdaSi // true = Si (no hay parestesias), false = No (hay parestesias)
      },
      tinel: {
        der: data.tinnelDerechaSi, // true = Si (no hay parestesias), false = No (hay parestesias)
        izq: data.tinnelIzquierdaSi // true = Si (no hay parestesias), false = No (hay parestesias)
      },
      finkelstein: {
        der: data.finkelsTeinDerechaSi, // true = Si (no hay dolor), false = No (hay dolor)
        izq: data.finkelsTeinIzquierdaSi // true = Si (no hay dolor), false = No (hay dolor)
      },
      
      // === EVALUACIÓN MÚSCULO ESQUELÉTICA DE CADERA Y MIEMBROS INFERIORES ===
      caderaDerecha: {
        abduccion: data.caderaDerechaAbduccion ?? "",
        aduccion: data.caderaDerechaAduccion ?? "",
        flexion: data.caderaDerechaFlexion ?? "",
        extension: data.caderaDerechaExtension ?? "",
        rotacionInterna: data.caderaDerechaRotInterna ?? "",
        rotacionExterna: data.caderaDerechaRotExterna ?? "",
        irradiacion: data.caderaDerechaIrradiacion ?? "",
        altMasaMuscular: data.caderaDerechaMasaMuscular ?? "",
      },
      caderaIzquierda: {
        abduccion: data.caderaIzquierdaAbduccion ?? "",
        aduccion: data.caderaIzquierdaAduccion ?? "",
        flexion: data.caderaIzquierdaFlexion ?? "",
        extension: data.caderaIzquierdaExtension ?? "",
        rotacionInterna: data.caderaIzquierdaRotInterna ?? "",
        rotacionExterna: data.caderaIzquierdaRotExterna ?? "",
        irradiacion: data.caderaIzquierdaIrradiacion ?? "",
        altMasaMuscular: data.caderaIzquierdaMasaMuscular ?? "",
      },
      rodillaDerecha: {
        abduccion:  "",
        aduccion:  "",
        flexion: data.rodillaDerechaFlexion ?? "",
        extension: data.rodillaDerechaExtension ?? "",
        rotacionInterna: data.rodillaDerechaRotInterna ?? "",
        rotacionExterna: data.rodillaDerechaRotExterna ?? "",
        irradiacion: data.rodillaDerechaIrradiacion ?? "",
        altMasaMuscular: data.rodillaDerechaMasaMuscular ?? "",
      },
      rodillaIzquierda: {
        abduccion:  "",
        aduccion:  "",
        flexion: data.rodillaIzquierdaFlexion ?? "",
        extension: data.rodillaIzquierdaExtension ?? "",
        rotacionInterna: data.rodillaIzquierdaRotInterna ?? "",
        rotacionExterna: data.rodillaIzquierdaRotExterna ?? "",
        irradiacion: data.rodillaIzquierdaIrradiacion ?? "",
        altMasaMuscular: data.rodillaIzquierdaMasaMuscular ?? "",
      },
      tobilloDerecho: {
        abduccion: data.tobilloDerechoAbduccion ?? "",
        aduccion: data.tobilloDerechoAduccion ?? "",
        flexion: data.tobilloDerechoFlexion ?? "",
        extension: data.tobilloDerechoExtension ?? "",
        rotacionInterna: data.tobilloDerechoRotInterna ?? "",
        rotacionExterna: data.tobilloDerechoRotExterna ?? "",
        irradiacion: data.tobilloDerechoIrradiacion ?? "",
        altMasaMuscular: data.tobilloDerechoMasaMuscular ?? "",
      },
      tobilloIzquierdo: {
        abduccion: data.tobilloIzquierdoAbduccion ?? "",
        aduccion: data.tobilloIzquierdoAduccion ?? "",
        flexion: data.tobilloIzquierdoFlexion ?? "",
        extension: data.tobilloIzquierdoExtension ?? "",
        rotacionInterna: data.tobilloIzquierdoRotInterna ?? "",
        rotacionExterna: data.tobilloIzquierdoRotExterna ?? "",
        irradiacion: data.tobilloIzquierdoIrradiacion ?? "",
        altMasaMuscular: data.tobilloIzquierdoMasaMuscular ?? "",
      },
      
      // === CONCLUSIONES Y RECOMENDACIONES ===
      conclusiones: data.conclusiones||"",
      cie10: data.cie10||"",
      recomendaciones: data.recomendaciones||"",
  };


  // Usar datos reales o datos de prueba
  const datosFinales = data && Object.keys(data).length > 0 ? datosReales : datosPrueba;

  // === PÁGINA 1 ===
  // === 0) HEADER ===
  headerEvaluacionMuscoloEsqueletica(doc, data, true, 1);

  // === 1) Imagen de fondo para la evaluación músculo esquelética ===
  const fondoImg = "/img/Pagina1_EvaluacionMusculoEsqueletica_boro.png";
  
  // Usar todo el ancho del documento pero no toda la altura
  const imgWidth = pageW; // Todo el ancho disponible
  const imgHeight = pageH * 0.85; // 85% de la altura para dejar espacio para ajustar

  // Posicionar desde abajo hacia arriba
  const xOffset = 0;
  const yOffset = pageH - imgHeight; // Posicionar desde la parte inferior

  try {
    doc.addImage(fondoImg, "PNG", xOffset, yOffset, imgWidth, imgHeight);
  } catch (e) {
    doc.text("Imagen de evaluación músculo esquelética no disponible", margin, yOffset + 10);
  }

  // === 2) CAMPOS DE DATOS PARA EVALUACIÓN MÚSCULO ESQUELÉTICA ===
  doc.setFont("helvetica", "bold").setFontSize(10);

  // === SECCIÓN: APTITUD ESPALDA ===
  
  // Puntos para cada ejercicio
  const xPuntosAptitud = margin + 106; // Ajustar posición X de la columna Puntos
  
  // ABDOMEN
  const yPuntosAbdomen = margin + 56.5;
  doc.text(datosFinales.puntosAbdomen || "", xPuntosAptitud, yPuntosAbdomen);
  
  // CADERA  
  const yPuntosCadera = margin + 69.5;
  doc.text(datosFinales.puntosCadera || "", xPuntosAptitud, yPuntosCadera);
  
  // MUSLO
  const yPuntosMuslo = margin + 82.5;
  doc.text(datosFinales.puntosMuslo || "", xPuntosAptitud, yPuntosMuslo);
  
  // ABDOMEN LATERAL
  const yPuntosAbdomenLateral = margin + 95.5;
  doc.text(datosFinales.puntosAbdomenLateral || "", xPuntosAptitud, yPuntosAbdomenLateral);
  
  // TOTAL APTITUD ESPALDA
  const yTotalAptitud = margin + 106.8;
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.totalAptitudEspalda || "", xPuntosAptitud, yTotalAptitud);
  
  // Observaciones APTITUD ESPALDA
  const xObservacionesAptitud = margin + 114;
  const yObservacionesAptitud = margin + 56.5;
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.observacionesAptitudEspalda || "", xObservacionesAptitud, yObservacionesAptitud, { maxWidth: 55, align: "justify" });

  // === SECCIÓN: RANGOS ARTICULARES ===
  
  // Puntos para cada rango articular
  const xPuntosRangos = margin + 97; // Ajustar posición X de la columna Puntos
  
  // Abducción de hombro (Normal 0°-180°)
  const yPuntosAbduccionNormal = margin + 122.5;
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text(datosFinales.puntosAbduccionNormal || "", xPuntosRangos, yPuntosAbduccionNormal);
  
  // Abducción de hombro (0°-60°)
  const yPuntosAbduccion60 = margin + 133.5;
  doc.text(datosFinales.puntosAbduccion60 || "", xPuntosRangos, yPuntosAbduccion60);
  
  // Rotación externa (0°-90°)
  const yPuntosRotacionExterna = margin + 144.5;
  doc.text(datosFinales.puntosRotacionExterna || "", xPuntosRangos, yPuntosRotacionExterna);
  
  // Rotación externa de hombro (interna)
  const yPuntosRotacionInterna = margin + 155.5;
  doc.text(datosFinales.puntosRotacionInterna || "", xPuntosRangos, yPuntosRotacionInterna);
  
  // TOTAL RANGOS ARTICULARES
  const yTotalRangos = margin + 161.5;
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.totalRangosArticulares || "", xPuntosRangos, yTotalRangos);
  
  // Dolor contra resistencia - Posiciones específicas para cada evaluación
  const xDolorResistencia = margin + 107; // Posición X común para todas las evaluaciones
  doc.setFont("helvetica", "bold").setFontSize(9);
  
  // Renderizar cada evaluación de dolor contra resistencia con posiciones específicas
  if (datosFinales.dolorContraResistencia && typeof datosFinales.dolorContraResistencia === 'object') {
    // Evaluación 1 - Abducción Normal
    const yDolorResistencia1 = margin + 122.5;
    doc.text(datosFinales.dolorContraResistencia.evaluacion1 || "", xDolorResistencia, yDolorResistencia1);
    
    // Evaluación 2 - Abducción 60°
    const yDolorResistencia2 = margin + 133.5;
    doc.text(datosFinales.dolorContraResistencia.evaluacion2 || "", xDolorResistencia, yDolorResistencia2);
    
    // Evaluación 3 - Rotación Externa
    const yDolorResistencia3 = margin + 144.5;
    doc.text(datosFinales.dolorContraResistencia.evaluacion3 || "", xDolorResistencia, yDolorResistencia3);
    
    // Evaluación 4 - Rotación Interna
    const yDolorResistencia4 = margin + 155.5;
    doc.text(datosFinales.dolorContraResistencia.evaluacion4 || "", xDolorResistencia, yDolorResistencia4);
    
    // Evaluación 5 - Total (si existe)
    const yDolorResistencia5 = margin + 161.5;
    doc.text(datosFinales.dolorContraResistencia.evaluacion5 || "", xDolorResistencia, yDolorResistencia5);
  }
  
  // Observaciones RANGOS ARTICULARES
  const xObservacionesRangos = margin + 121;
  const yObservacionesRangos = margin + 122.5;
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.observacionesRangosArticulares || "", xObservacionesRangos, yObservacionesRangos, { maxWidth: 51, align: "justify" });

  // === SECCIÓN: COLUMNA VERTEBRAL - HALLAZGOS ===
  doc.setFont("helvetica", "bold").setFontSize(10);
  
  // === DESVIACIÓN DEL EJE ===
  const xDesviacionEje = margin + 65.5; // Posición X editable para Desviación del Eje
  const yDesviacionEje = margin + 176.4; // Posición Y editable para Desviación del Eje
  const xDescripcionDesviacion = margin + 95; // Posición X editable para descripción
  const yDescripcionDesviacion = margin + 176.4; // Posición Y editable para descripción
  
     if (datosFinales.desviacionEje && typeof datosFinales.desviacionEje.hallazgo === 'boolean') {
     doc.setTextColor(0, 0, 255); // Color azul para las X
     doc.setFont("helvetica", "normal").setFontSize(10);
     doc.text("X", xDesviacionEje + (datosFinales.desviacionEje.hallazgo ? 0 : 17.3), yDesviacionEje);
     doc.setTextColor(0, 0, 0); // Resetear a negro para las descripciones
     doc.setFont("helvetica", "normal").setFontSize(8);
     doc.text(datosFinales.desviacionEje.descripcion || "", xDescripcionDesviacion, yDescripcionDesviacion, { maxWidth: 85 });
   }
   
   // === TEST DE ADAMS ===
   const xTestAdams = margin + 65.5; // Posición X editable para Test de Adams
   const yTestAdams = margin + 181; // Posición Y editable para Test de Adams
   const xDescripcionTestAdams = margin + 95; // Posición X editable para descripción
   const yDescripcionTestAdams = margin + 181; // Posición Y editable para descripción
   
   if (datosFinales.testAdams && typeof datosFinales.testAdams.hallazgo === 'boolean') {
     doc.setTextColor(0, 0, 255); // Color azul para las X
     doc.setFont("helvetica", "normal").setFontSize(10);
     doc.text("X", xTestAdams + (datosFinales.testAdams.hallazgo ? 0 : 17.3), yTestAdams);
     doc.setTextColor(0, 0, 0); // Resetear a negro para las descripciones
     doc.setFont("helvetica", "normal").setFontSize(8);
     doc.text(datosFinales.testAdams.descripcion || "", xDescripcionTestAdams, yDescripcionTestAdams, { maxWidth: 85 });
   }
   
   // === DANDY ===
   const xDandy = margin + 65.5; // Posición X editable para Dandy
   const yDandy = margin + 185.8; // Posición Y editable para Dandy
   const xDescripcionDandy = margin + 95; // Posición X editable para descripción
   const yDescripcionDandy = margin + 185.5; // Posición Y editable para descripción
   
   if (datosFinales.dandy && typeof datosFinales.dandy.hallazgo === 'boolean') {
     doc.setTextColor(0, 0, 255); // Color azul para las X
     doc.setFont("helvetica", "normal").setFontSize(10);
     doc.text("X", xDandy + (datosFinales.dandy.hallazgo ? 0 : 17.3), yDandy);
     doc.setTextColor(0, 0, 0); // Resetear a negro para las descripciones
     doc.setFont("helvetica", "normal").setFontSize(8);
     doc.text(datosFinales.dandy.descripcion || "", xDescripcionDandy, yDescripcionDandy, { maxWidth: 85 });
   }
   
   // === LASEGUE ===
   const xLasegue = margin + 65.5; // Posición X editable para Lasegue
   const yLasegue = margin + 190.4; // Posición Y editable para Lasegue
   const xDescripcionLasegue = margin + 95; // Posición X editable para descripción
   const yDescripcionLasegue = margin + 190.4; // Posición Y editable para descripción
   
   if (datosFinales.lasegue && typeof datosFinales.lasegue.hallazgo === 'boolean') {
     doc.setTextColor(0, 0, 255); // Color azul para las X
     doc.setFont("helvetica", "normal").setFontSize(10);
     doc.text("X", xLasegue + (datosFinales.lasegue.hallazgo ? 0 : 17.3), yLasegue);
     doc.setTextColor(0, 0, 0); // Resetear a negro para las descripciones
     doc.setFont("helvetica", "normal").setFontSize(8);
     doc.text(datosFinales.lasegue.descripcion || "", xDescripcionLasegue, yDescripcionLasegue, { maxWidth: 85 });
   }
   
   // === CONTRACTURA MUSCULAR ===
   const xContracturaMuscular = margin + 65.5; // Posición X editable para Contractura Muscular
   const yContracturaMuscular = margin + 195; // Posición Y editable para Contractura Muscular
   const xDescripcionContractura = margin + 95; // Posición X editable para descripción
   const yDescripcionContractura = margin + 195; // Posición Y editable para descripción
   
   if (datosFinales.contracturaMuscular && typeof datosFinales.contracturaMuscular.hallazgo === 'boolean') {
     doc.setTextColor(0, 0, 255); // Color azul para las X
     doc.setFont("helvetica", "normal").setFontSize(10);
     doc.text("X", xContracturaMuscular + (datosFinales.contracturaMuscular.hallazgo ? 0 : 17.3), yContracturaMuscular);
     doc.setTextColor(0, 0, 0); // Resetear a negro para las descripciones
     doc.setFont("helvetica", "normal").setFontSize(8);
     doc.text(datosFinales.contracturaMuscular.descripcion || "", xDescripcionContractura, yDescripcionContractura, { maxWidth: 85 });
   }
   
       // === CICATRIZ POST-OPERATORIA ===
    const xCicatrizPostOperatoria = margin + 65.5; // Posición X editable para Cicatriz Post-Operatoria
    const yCicatrizPostOperatoria = margin + 199.5; // Posición Y editable para Cicatriz Post-Operatoria
    const xDescripcionCicatriz = margin + 95; // Posición X editable para descripción
    const yDescripcionCicatriz = margin + 199.5; // Posición Y editable para descripción
    
         if (datosFinales.cicatrizPostOperatoria && typeof datosFinales.cicatrizPostOperatoria.hallazgo === 'boolean') {
       doc.setTextColor(0, 0, 255); // Color azul para las X
       doc.setFont("helvetica", "normal").setFontSize(10);
       doc.text("X", xCicatrizPostOperatoria + (datosFinales.cicatrizPostOperatoria.hallazgo ? 0 : 17.3), yCicatrizPostOperatoria);
       doc.setTextColor(0, 0, 0); // Resetear a negro para las descripciones
       doc.setFont("helvetica", "normal").setFontSize(8);
       doc.text(datosFinales.cicatrizPostOperatoria.descripcion || "", xDescripcionCicatriz, yDescripcionCicatriz, { maxWidth: 85 });
     }

   // === SECCIÓN: TESTS DE MIEMBROS SUPERIORES ===
   doc.setFont("helvetica", "bold").setFontSize(10);
   
   // === TEST DE JOBE ===
   const xJobeDolor = margin + 72; // Posición X para dolor Jobe
   const yJobeDolor = margin + 227.5; // Posición Y para dolor Jobe
   const xJobeLimitacion = margin + 72.3; // Posición X para limitación Jobe
   const yJobeLimitacion = margin + 234; // Posición Y para limitación Jobe
   
                               if (datosFinales.testJobe) {
        // Dolor Jobe - SI/NO (cada lado independiente)
        if (typeof datosFinales.testJobe.der === 'boolean' && typeof datosFinales.testJobe.izq === 'boolean') {
          doc.setTextColor(0, 0, 0); // Color negro para SI/NO
          doc.setFont("helvetica", "bold").setFontSize(10);
          
          // Lado derecho
          const textoDer = datosFinales.testJobe.der ? "SI" : "NO";
          doc.text(textoDer, xJobeDolor, yJobeDolor);
          
          // Lado izquierdo
          const textoIzq = datosFinales.testJobe.izq ? "SI" : "NO";
          doc.text(textoIzq, xJobeDolor + 13, yJobeDolor);
        }
        
        // Limitación Jobe - X en Der/Izq (solo si el lado correspondiente = false)
        if (typeof datosFinales.testJobe.der === 'boolean' && typeof datosFinales.testJobe.izq === 'boolean') {
          doc.setTextColor(0, 0, 255); // Color azul para las X
          doc.setFont("helvetica", "bold").setFontSize(10);
          
          // X en lado derecho (solo si der = false)
          if (!datosFinales.testJobe.der) {
            doc.text("X", xJobeLimitacion, yJobeLimitacion);
          }
          
          // X en lado izquierdo (solo si izq = false)
          if (!datosFinales.testJobe.izq) {
            doc.text("X", xJobeLimitacion + 13, yJobeLimitacion);
          }
          
          doc.setTextColor(0, 0, 0); // Resetear a negro
        }
      }
   
   // === TEST DE PATTE ===
   const xPatteDolor = margin + 152; // Posición X para dolor Patte
   const yPatteDolor = margin + 227.5; // Posición Y para dolor Patte
   const xPatteLimitacion = margin + 153; // Posición X para limitación Patte
   const yPatteLimitacion = margin + 234; // Posición Y para limitación Patte
   
                               if (datosFinales.testPatte) {
        // Dolor Patte - SI/NO (cada lado independiente)
        if (typeof datosFinales.testPatte.der === 'boolean' && typeof datosFinales.testPatte.izq === 'boolean') {
          doc.setTextColor(0, 0, 0); // Color negro para SI/NO
          doc.setFont("helvetica", "bold").setFontSize(10);
          
          // Lado derecho
          const textoDer = datosFinales.testPatte.der ? "SI" : "NO";
          doc.text(textoDer, xPatteDolor, yPatteDolor);
          
          // Lado izquierdo
          const textoIzq = datosFinales.testPatte.izq ? "SI" : "NO";
          doc.text(textoIzq, xPatteDolor + 13, yPatteDolor);
        }
        
        // Limitación Patte - X en Der/Izq (solo si el lado correspondiente = false)
        if (typeof datosFinales.testPatte.der === 'boolean' && typeof datosFinales.testPatte.izq === 'boolean') {
          doc.setTextColor(0, 0, 255); // Color azul para las X
          doc.setFont("helvetica", "bold").setFontSize(10);
          
          // X en lado derecho (solo si der = false)
          if (!datosFinales.testPatte.der) {
            doc.text("X", xPatteLimitacion, yPatteLimitacion);
          }
          
          // X en lado izquierdo (solo si izq = false)
          if (!datosFinales.testPatte.izq) {
            doc.text("X", xPatteLimitacion + 13, yPatteLimitacion);
          }
          
          doc.setTextColor(0, 0, 0); // Resetear a negro
        }
      }
   
   // === TEST DE GERBER ===
   const xGerberDolor = margin + 72; // Posición X para dolor Gerber
   const yGerberDolor = margin + 258.5; // Posición Y para dolor Gerber
   const xGerberLimitacion = margin + 72.3; // Posición X para limitación Gerber
   const yGerberLimitacion = margin + 265; // Posición Y para limitación Gerber
   
                               if (datosFinales.testGerber) {
        // Dolor Gerber - SI/NO (cada lado independiente)
        if (typeof datosFinales.testGerber.der === 'boolean' && typeof datosFinales.testGerber.izq === 'boolean') {
          doc.setTextColor(0, 0, 0); // Color negro para SI/NO
          doc.setFont("helvetica", "bold").setFontSize(10);
          
          // Lado derecho
          const textoDer = datosFinales.testGerber.der ? "SI" : "NO";
          doc.text(textoDer, xGerberDolor, yGerberDolor);
          
          // Lado izquierdo
          const textoIzq = datosFinales.testGerber.izq ? "SI" : "NO";
          doc.text(textoIzq, xGerberDolor + 13, yGerberDolor);
        }
        
        // Limitación Gerber - X en Der/Izq (solo si el lado correspondiente = false)
        if (typeof datosFinales.testGerber.der === 'boolean' && typeof datosFinales.testGerber.izq === 'boolean') {
          doc.setTextColor(0, 0, 255); // Color azul para las X
          doc.setFont("helvetica", "bold").setFontSize(10);
          
          // X en lado derecho (solo si der = false)
          if (!datosFinales.testGerber.der) {
            doc.text("X", xGerberLimitacion, yGerberLimitacion);
          }
          
          // X en lado izquierdo (solo si izq = false)
          if (!datosFinales.testGerber.izq) {
            doc.text("X", xGerberLimitacion + 13, yGerberLimitacion);
          }
          
          doc.setTextColor(0, 0, 0); // Resetear a negro
        }
      }
   
   // === PULL UP TEST ===
   const xPullUpDolor = margin + 152; // Posición X para dolor Pull Up
   const yPullUpDolor = margin + 258.5; // Posición Y para dolor Pull Up
   const xPullUpLimitacion = margin + 153; // Posición X para limitación Pull Up
   const yPullUpLimitacion = margin + 265; // Posición Y para limitación Pull Up
   
                               if (datosFinales.pullUpTest) {
        // Dolor Pull Up - SI/NO (cada lado independiente)
        if (typeof datosFinales.pullUpTest.der === 'boolean' && typeof datosFinales.pullUpTest.izq === 'boolean') {
          doc.setTextColor(0, 0, 0); // Color negro para SI/NO
          doc.setFont("helvetica", "bold").setFontSize(10);
          
          // Lado derecho
          const textoDer = datosFinales.pullUpTest.der ? "SI" : "NO";
          doc.text(textoDer, xPullUpDolor, yPullUpDolor);
          
          // Lado izquierdo
          const textoIzq = datosFinales.pullUpTest.izq ? "SI" : "NO";
          doc.text(textoIzq, xPullUpDolor + 13, yPullUpDolor);
        }
        
        // Limitación Pull Up - X en Der/Izq (solo si el lado correspondiente = false)
        if (typeof datosFinales.pullUpTest.der === 'boolean' && typeof datosFinales.pullUpTest.izq === 'boolean') {
          doc.setTextColor(0, 0, 255); // Color azul para las X
          doc.setFont("helvetica", "bold").setFontSize(10);
          
          // X en lado derecho (solo si der = false)
          if (!datosFinales.pullUpTest.der) {
            doc.text("X", xPullUpLimitacion, yPullUpLimitacion);
          }
          
          // X en lado izquierdo (solo si izq = false)
          if (!datosFinales.pullUpTest.izq) {
            doc.text("X", xPullUpLimitacion + 13, yPullUpLimitacion);
          }
          
          doc.setTextColor(0, 0, 0); // Resetear a negro
        }
      }

  // === PÁGINA 2 ===
  doc.addPage();
  
  // === 0) HEADER PÁGINA 2 (sin frame) ===
  headerEvaluacionMuscoloEsqueletica(doc, data, false, 2);

  // === 1) Imagen de fondo para la página 2 ===
  const fondoImg2 = "/img/Pagina2_EvaluacionMusculoEsqueletica_boro.png";
  
  // Usar toda la página sin desbordarse
  const imgWidth2 = pageW; // Todo el ancho disponible
  const imgHeight2 = pageH; // Toda la altura disponible

  // Posicionar desde el inicio de la página
  const xOffset2 = 0;
  const yOffset2 = 0; // Desde la parte superior

  try {
    doc.addImage(fondoImg2, "PNG", xOffset2, yOffset2, imgWidth2, imgHeight2);
  } catch (e) {
    doc.text("Imagen de página 2 no disponible", margin, margin + 10);
  }

    // === 2) TESTS DE PÁGINA 2 ===
    doc.setFont("helvetica", "bold").setFontSize(10);
    
    // === EPICONDILITIS ===
    const xEpicondilitisDolor = margin + 72.5; // Posición X para dolor Epicondilitis
    const yEpicondilitisDolor = margin + 32; // Posición Y para dolor Epicondilitis
    const xEpicondilitisLimitacion = margin + 73; // Posición X para limitación Epicondilitis
    const yEpicondilitisLimitacion = margin + 38.5; // Posición Y para limitación Epicondilitis
    
    if (datosFinales.epicondilitis) {
      // Dolor Epicondilitis - SI/NO (cada lado independiente)
      if (typeof datosFinales.epicondilitis.der === 'boolean' && typeof datosFinales.epicondilitis.izq === 'boolean') {
        doc.setTextColor(0, 0, 0); // Color negro para SI/NO
        doc.setFont("helvetica", "bold").setFontSize(10);
        
        // Lado derecho
        const textoDer = datosFinales.epicondilitis.der ? "SI" : "NO";
        doc.text(textoDer, xEpicondilitisDolor, yEpicondilitisDolor);
        
        // Lado izquierdo
        const textoIzq = datosFinales.epicondilitis.izq ? "SI" : "NO";
        doc.text(textoIzq, xEpicondilitisDolor + 13, yEpicondilitisDolor);
      }
      
      // Limitación Epicondilitis - X en Der/Izq (solo si el lado correspondiente = false)
      if (typeof datosFinales.epicondilitis.der === 'boolean' && typeof datosFinales.epicondilitis.izq === 'boolean') {
        doc.setTextColor(0, 0, 255); // Color azul para las X
        doc.setFont("helvetica", "bold").setFontSize(10);
        
        // X en lado derecho (solo si der = false)
        if (!datosFinales.epicondilitis.der) {
          doc.text("X", xEpicondilitisLimitacion, yEpicondilitisLimitacion);
        }
        
        // X en lado izquierdo (solo si izq = false)
        if (!datosFinales.epicondilitis.izq) {
          doc.text("X", xEpicondilitisLimitacion + 13, yEpicondilitisLimitacion);
        }
        
        doc.setTextColor(0, 0, 0); // Resetear a negro
      }
    }
    
    // === EPITROCLEITIS ===
    const xEpitrocleitisDolor = margin + 153; // Posición X para dolor Epitrocleitis
    const yEpitrocleitisDolor = margin + 32; // Posición Y para dolor Epitrocleitis
    const xEpitrocleitisLimitacion = margin + 154; // Posición X para limitación Epitrocleitis
    const yEpitrocleitisLimitacion = margin + 38.5; // Posición Y para limitación Epitrocleitis
    
    if (datosFinales.epitrocleitis) {
      // Dolor Epitrocleitis - SI/NO (cada lado independiente)
      if (typeof datosFinales.epitrocleitis.der === 'boolean' && typeof datosFinales.epitrocleitis.izq === 'boolean') {
        doc.setTextColor(0, 0, 0); // Color negro para SI/NO
        doc.setFont("helvetica", "bold").setFontSize(10);
        
        // Lado derecho
        const textoDer = datosFinales.epitrocleitis.der ? "SI" : "NO";
        doc.text(textoDer, xEpitrocleitisDolor, yEpitrocleitisDolor);
        
        // Lado izquierdo
        const textoIzq = datosFinales.epitrocleitis.izq ? "SI" : "NO";
        doc.text(textoIzq, xEpitrocleitisDolor + 13, yEpitrocleitisDolor);
      }
      
      // Limitación Epitrocleitis - X en Der/Izq (solo si el lado correspondiente = false)
      if (typeof datosFinales.epitrocleitis.der === 'boolean' && typeof datosFinales.epitrocleitis.izq === 'boolean') {
        doc.setTextColor(0, 0, 255); // Color azul para las X
        doc.setFont("helvetica", "bold").setFontSize(10);
        
        // X en lado derecho (solo si der = false)
        if (!datosFinales.epitrocleitis.der) {
          doc.text("X", xEpitrocleitisLimitacion, yEpitrocleitisLimitacion);
        }
        
        // X en lado izquierdo (solo si izq = false)
        if (!datosFinales.epitrocleitis.izq) {
          doc.text("X", xEpitrocleitisLimitacion + 13, yEpitrocleitisLimitacion);
        }
        
        doc.setTextColor(0, 0, 0); // Resetear a negro
      }
    }
    
    // === PHALEN ===
    const xPhalenDolor = margin + 72; // Posición X para dolor Phalen
    const yPhalenDolor = margin + 61.6; // Posición Y para dolor Phalen
    const xPhalenLimitacion = margin + 73; // Posición X para limitación Phalen
    const yPhalenLimitacion = margin + 68; // Posición Y para limitación Phalen
    
    if (datosFinales.phalen) {
      // Dolor Phalen - SI/NO (cada lado independiente)
      if (typeof datosFinales.phalen.der === 'boolean' && typeof datosFinales.phalen.izq === 'boolean') {
        doc.setTextColor(0, 0, 0); // Color negro para SI/NO
        doc.setFont("helvetica", "bold").setFontSize(10);
        
        // Lado derecho
        const textoDer = datosFinales.phalen.der ? "SI" : "NO";
        doc.text(textoDer, xPhalenDolor, yPhalenDolor);
        
        // Lado izquierdo
        const textoIzq = datosFinales.phalen.izq ? "SI" : "NO";
        doc.text(textoIzq, xPhalenDolor + 13, yPhalenDolor);
      }
      
      // Limitación Phalen - X en Der/Izq (solo si el lado correspondiente = false)
      if (typeof datosFinales.phalen.der === 'boolean' && typeof datosFinales.phalen.izq === 'boolean') {
        doc.setTextColor(0, 0, 255); // Color azul para las X
        doc.setFont("helvetica", "bold").setFontSize(10);
        
        // X en lado derecho (solo si der = false)
        if (!datosFinales.phalen.der) {
          doc.text("X", xPhalenLimitacion, yPhalenLimitacion);
        }
        
        // X en lado izquierdo (solo si izq = false)
        if (!datosFinales.phalen.izq) {
          doc.text("X", xPhalenLimitacion + 13, yPhalenLimitacion);
        }
        
        doc.setTextColor(0, 0, 0); // Resetear a negro
      }
    }
    
    // === PHALEN INVERTIDO ===
    const xPhalenInvertidoDolor = margin + 153; // Posición X para dolor Phalen Invertido
    const yPhalenInvertidoDolor = margin + 61.6; // Posición Y para dolor Phalen Invertido
    const xPhalenInvertidoLimitacion = margin + 154; // Posición X para limitación Phalen Invertido
    const yPhalenInvertidoLimitacion = margin + 68; // Posición Y para limitación Phalen Invertido
    
    if (datosFinales.phalenInvertido) {
      // Dolor Phalen Invertido - SI/NO (cada lado independiente)
      if (typeof datosFinales.phalenInvertido.der === 'boolean' && typeof datosFinales.phalenInvertido.izq === 'boolean') {
        doc.setTextColor(0, 0, 0); // Color negro para SI/NO
        doc.setFont("helvetica", "bold").setFontSize(10);
        
        // Lado derecho
        const textoDer = datosFinales.phalenInvertido.der ? "SI" : "NO";
        doc.text(textoDer, xPhalenInvertidoDolor, yPhalenInvertidoDolor);
        
        // Lado izquierdo
        const textoIzq = datosFinales.phalenInvertido.izq ? "SI" : "NO";
        doc.text(textoIzq, xPhalenInvertidoDolor + 13, yPhalenInvertidoDolor);
      }
      
      // Limitación Phalen Invertido - X en Der/Izq (solo si el lado correspondiente = false)
      if (typeof datosFinales.phalenInvertido.der === 'boolean' && typeof datosFinales.phalenInvertido.izq === 'boolean') {
        doc.setTextColor(0, 0, 255); // Color azul para las X
        doc.setFont("helvetica", "bold").setFontSize(10);
        
        // X en lado derecho (solo si der = false)
        if (!datosFinales.phalenInvertido.der) {
          doc.text("X", xPhalenInvertidoLimitacion, yPhalenInvertidoLimitacion);
        }
        
        // X en lado izquierdo (solo si izq = false)
        if (!datosFinales.phalenInvertido.izq) {
          doc.text("X", xPhalenInvertidoLimitacion + 13, yPhalenInvertidoLimitacion);
        }
        
        doc.setTextColor(0, 0, 0); // Resetear a negro
      }
    }
    
    // === TINNEL ===
    const xTinelDolor = margin + 72; // Posición X para dolor Tinel
    const yTinelDolor = margin + 91.5; // Posición Y para dolor Tinel
    const xTinelLimitacion = margin + 73; // Posición X para limitación Tinel
    const yTinelLimitacion = margin + 97.8; // Posición Y para limitación Tinel
    
    if (datosFinales.tinel) {
      // Dolor Tinel - SI/NO (cada lado independiente)
      if (typeof datosFinales.tinel.der === 'boolean' && typeof datosFinales.tinel.izq === 'boolean') {
        doc.setTextColor(0, 0, 0); // Color negro para SI/NO
        doc.setFont("helvetica", "bold").setFontSize(10);
        
        // Lado derecho
        const textoDer = datosFinales.tinel.der ? "SI" : "NO";
        doc.text(textoDer, xTinelDolor, yTinelDolor);
        
        // Lado izquierdo
        const textoIzq = datosFinales.tinel.izq ? "SI" : "NO";
        doc.text(textoIzq, xTinelDolor + 13, yTinelDolor);
      }
      
      // Limitación Tinel - X en Der/Izq (solo si el lado correspondiente = false)
      if (typeof datosFinales.tinel.der === 'boolean' && typeof datosFinales.tinel.izq === 'boolean') {
        doc.setTextColor(0, 0, 255); // Color azul para las X
        doc.setFont("helvetica", "bold").setFontSize(10);
        
        // X en lado derecho (solo si der = false)
        if (!datosFinales.tinel.der) {
          doc.text("X", xTinelLimitacion, yTinelLimitacion);
        }
        
        // X en lado izquierdo (solo si izq = false)
        if (!datosFinales.tinel.izq) {
          doc.text("X", xTinelLimitacion + 13, yTinelLimitacion);
        }
        
        doc.setTextColor(0, 0, 0); // Resetear a negro
      }
    }
    
    // === FINKELS-TEIN ===
    const xFinkelsteinDolor = margin + 153; // Posición X para dolor Finkelstein
    const yFinkelsteinDolor = margin + 90; // Posición Y para dolor Finkelstein
    const xFinkelsteinLimitacion = margin + 154; // Posición X para limitación Finkelstein
    const yFinkelsteinLimitacion = margin + 96; // Posición Y para limitación Finkelstein
    
    if (datosFinales.finkelstein) {
      // Dolor Finkelstein - SI/NO (cada lado independiente)
      if (typeof datosFinales.finkelstein.der === 'boolean' && typeof datosFinales.finkelstein.izq === 'boolean') {
        doc.setTextColor(0, 0, 0); // Color negro para SI/NO
        doc.setFont("helvetica", "bold").setFontSize(10);
        
        // Lado derecho
        const textoDer = datosFinales.finkelstein.der ? "SI" : "NO";
        doc.text(textoDer, xFinkelsteinDolor, yFinkelsteinDolor);
        
        // Lado izquierdo
        const textoIzq = datosFinales.finkelstein.izq ? "SI" : "NO";
        doc.text(textoIzq, xFinkelsteinDolor + 13, yFinkelsteinDolor);
      }
      
      // Limitación Finkelstein - X en Der/Izq (solo si el lado correspondiente = false)
      if (typeof datosFinales.finkelstein.der === 'boolean' && typeof datosFinales.finkelstein.izq === 'boolean') {
        doc.setTextColor(0, 0, 255); // Color azul para las X
        doc.setFont("helvetica", "bold").setFontSize(10);
        
        // X en lado derecho (solo si der = false)
        if (!datosFinales.finkelstein.der) {
          doc.text("X", xFinkelsteinLimitacion, yFinkelsteinLimitacion);
        }
        
        // X en lado izquierdo (solo si izq = false)
        if (!datosFinales.finkelstein.izq) {
          doc.text("X", xFinkelsteinLimitacion + 13, yFinkelsteinLimitacion);
        }
        
        doc.setTextColor(0, 0, 0); // Resetear a negro
      }
         }

     // === 3) EVALUACIÓN MÚSCULO ESQUELÉTICA DE CADERA Y MIEMBROS INFERIORES ===
     doc.setFont("helvetica", "bold").setFontSize(10);
     
     // Posiciones base para la tabla de evaluación
     const xBase = margin + 20; // Posición X base para la columna izquierda
     const yBase = margin + 130; // Posición Y base para empezar la tabla
     
     // === CADERA ===
     const yCadera = yBase + 15;
     doc.setFont("helvetica", "bold").setFontSize(9);
     
     // Datos de Cadera Derecha horizontalmente con coordenadas individuales
     const datosCaderaDerecha = [
       {
         valor: datosFinales.caderaDerecha?.abduccion || "0",
         x: xBase + 28,
         y: yCadera - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.caderaDerecha?.aduccion || "0",
         x: xBase + 47,
         y: yCadera - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.caderaDerecha?.flexion || "0",
         x: xBase + 65,
         y: yCadera - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.caderaDerecha?.extension || "0",
         x: xBase + 83.5,
         y: yCadera - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.caderaDerecha?.rotacionExterna || "0",
         x: xBase + 103,
         y: yCadera - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.caderaDerecha?.rotacionInterna || "0",
         x: xBase + 124.5,
         y: yCadera - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.caderaDerecha?.irradiacion || "0",
         x: xBase + 145,
         y: yCadera - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.caderaDerecha?.altMasaMuscular || "0",
         x: xBase + 165,
         y: yCadera - 23,
         espaciado: 15
       }
     ];
     
     // Datos de Cadera Izquierda horizontalmente con coordenadas individuales
     const datosCaderaIzquierda = [
       {
         valor: datosFinales.caderaIzquierda?.abduccion || "0",
         x: xBase + 28,
         y: yCadera - 19.5,
         espaciado: 5
       },
       {
         valor: datosFinales.caderaIzquierda?.aduccion || "0",
         x: xBase + 47,
         y: yCadera - 19.5,
         espaciado: 5
       },
       {
         valor: datosFinales.caderaIzquierda?.flexion || "0",
         x: xBase + 65,
         y: yCadera - 19.5,
         espaciado: 5
       },
       {
         valor: datosFinales.caderaIzquierda?.extension || "0",
         x: xBase + 83.5,
         y: yCadera - 19.5,
         espaciado: 5
       },
       {
         valor: datosFinales.caderaIzquierda?.rotacionExterna || "0",
         x: xBase + 103,
         y: yCadera - 19.5,
         espaciado: 5
       },
       {
         valor: datosFinales.caderaIzquierda?.rotacionInterna || "0",
         x: xBase + 124.5,
         y: yCadera - 19.5,
         espaciado: 5
       },
       {
         valor: datosFinales.caderaIzquierda?.irradiacion || "0",
         x: xBase + 145,
         y: yCadera - 19.5,
         espaciado: 5
       },
       {
         valor: datosFinales.caderaIzquierda?.altMasaMuscular || "0",
         x: xBase + 165,
         y: yCadera - 19.5,
         espaciado: 5
       }
     ];
     
     // Mostrar datos de Cadera Derecha horizontalmente
     datosCaderaDerecha.forEach((dato) => {
       doc.setFont("helvetica", "bold").setFontSize(9);
       doc.text(dato.valor, dato.x, dato.y, { align: "center" });
     });
     
     // Mostrar datos de Cadera Izquierda horizontalmente
     datosCaderaIzquierda.forEach((dato) => {
       doc.setFont("helvetica", "bold").setFontSize(9);
       doc.text(dato.valor, dato.x, dato.y, { align: "center" });
     });
     
     // === RODILLA ===
     const yRodilla = yBase + 22;
     doc.setFont("helvetica", "bold").setFontSize(9);
     
     // Datos de Rodilla Derecha horizontalmente con coordenadas individuales
     const datosRodillaDerecha = [
       {
         valor: datosFinales.rodillaDerecha?.flexion || "0",
         x: xBase + 65,
         y: yRodilla - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.rodillaDerecha?.extension || "0",
         x: xBase + 83.5,
         y: yRodilla - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.rodillaDerecha?.rotacionExterna || "0",
         x: xBase + 103,
         y: yRodilla - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.rodillaDerecha?.rotacionInterna || "0",
         x: xBase + 124.5,
         y: yRodilla - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.rodillaDerecha?.irradiacion || "0",
         x: xBase + 145,
         y: yRodilla - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.rodillaDerecha?.altMasaMuscular || "0",
         x: xBase + 165,
         y: yRodilla - 23,
         espaciado: 15
       }
     ];
     
     // Datos de Rodilla Izquierda horizontalmente con coordenadas individuales
     const datosRodillaIzquierda = [
       {
         valor: datosFinales.rodillaIzquierda?.flexion || "0",
         x: xBase + 65,
         y: yRodilla - 19.2,
         espaciado: 5
       },
       {
         valor: datosFinales.rodillaIzquierda?.extension || "0",
         x: xBase + 83.5,
         y: yRodilla - 19.2,
         espaciado: 5
       },
       {
         valor: datosFinales.rodillaIzquierda?.rotacionExterna || "0",
         x: xBase + 103,
         y: yRodilla - 19.2,
         espaciado: 5
       },
       {
         valor: datosFinales.rodillaIzquierda?.rotacionInterna || "0",
         x: xBase + 124.5,
         y: yRodilla - 19.2,
         espaciado: 5
       },
       {
         valor: datosFinales.rodillaIzquierda?.irradiacion || "0",
         x: xBase + 145,
         y: yRodilla - 19.2,
         espaciado: 5
       },
       {
         valor: datosFinales.rodillaIzquierda?.altMasaMuscular || "0",
         x: xBase + 165,
         y: yRodilla - 19.2,
         espaciado: 5
       }
     ];
     
     // Mostrar datos de Rodilla Derecha horizontalmente
     datosRodillaDerecha.forEach((dato) => {
       doc.setFont("helvetica", "bold").setFontSize(9);
       doc.text(dato.valor, dato.x, dato.y, { align: "center" });
     });
     
     // Mostrar datos de Rodilla Izquierda horizontalmente
     datosRodillaIzquierda.forEach((dato) => {
       doc.setFont("helvetica", "bold").setFontSize(9);
       doc.text(dato.valor, dato.x, dato.y, { align: "center" });
     });
     
     // === TOBILLO ===
     const yTobillo = yBase + 29;
     doc.setFont("helvetica", "bold").setFontSize(9);
     
     // Datos de Tobillo Derecho horizontalmente con coordenadas individuales
     const datosTobilloDerecho = [
       {
         valor: datosFinales.tobilloDerecho?.abduccion || "0",
         x: xBase + 28,
         y: yTobillo - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.tobilloDerecho?.aduccion || "0",
         x: xBase + 47,
         y: yTobillo - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.tobilloDerecho?.flexion || "0",
         x: xBase + 65,
         y: yTobillo - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.tobilloDerecho?.extension || "0",
         x: xBase + 83.5,
         y: yTobillo - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.tobilloDerecho?.rotacionExterna || "0",
         x: xBase + 103,
         y: yTobillo - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.tobilloDerecho?.rotacionInterna || "0",
         x: xBase + 124.5,
         y: yTobillo - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.tobilloDerecho?.irradiacion || "0",
         x: xBase + 145,
         y: yTobillo - 23,
         espaciado: 15
       },
       {
         valor: datosFinales.tobilloDerecho?.altMasaMuscular || "0",
         x: xBase + 165,
         y: yTobillo - 23,
         espaciado: 15
       }
     ];
     
     // Datos de Tobillo Izquierdo horizontalmente con coordenadas individuales
     const datosTobilloIzquierdo = [
       {
         valor: datosFinales.tobilloIzquierdo?.abduccion || "0",
         x: xBase + 28,
         y: yTobillo - 19,
         espaciado: 5
       },
       {
         valor: datosFinales.tobilloIzquierdo?.aduccion || "0",
         x: xBase + 47,
         y: yTobillo - 19,
         espaciado: 5
       },
       {
         valor: datosFinales.tobilloIzquierdo?.flexion || "0",
         x: xBase + 65,
         y: yTobillo - 19,
         espaciado: 5
       },
       {
         valor: datosFinales.tobilloIzquierdo?.extension || "0",
         x: xBase + 83.5,
         y: yTobillo - 19,
         espaciado: 5
       },
       {
         valor: datosFinales.tobilloIzquierdo?.rotacionExterna || "0",
         x: xBase + 103,
         y: yTobillo - 19,
         espaciado: 5
       },
       {
         valor: datosFinales.tobilloIzquierdo?.rotacionInterna || "0",
         x: xBase + 124.5,
         y: yTobillo - 19,
         espaciado: 5
       },
       {
         valor: datosFinales.tobilloIzquierdo?.irradiacion || "0",
         x: xBase + 145,
         y: yTobillo - 19,
         espaciado: 5
       },
       {
         valor: datosFinales.tobilloIzquierdo?.altMasaMuscular || "0",
         x: xBase + 165,
         y: yTobillo - 19,
         espaciado: 5
       }
     ];
     
     // Mostrar datos de Tobillo Derecho horizontalmente
     datosTobilloDerecho.forEach((dato) => {
       doc.setFont("helvetica", "bold").setFontSize(9);
       doc.text(dato.valor, dato.x, dato.y, { align: "center" });
     });
     
           // Mostrar datos de Tobillo Izquierdo horizontalmente
      datosTobilloIzquierdo.forEach((dato) => {
        doc.setFont("helvetica", "bold").setFontSize(9);
        doc.text(dato.valor, dato.x, dato.y, { align: "center" });
      });

                             // === SECCIÓN XI: CONCLUSIONES Y RECOMENDACIONES ===
            
                                 // Coordenadas para las columnas de conclusiones y recomendaciones
                 const conclusionesX = margin + 16;
                 const conclusionesY = margin + 180;
                 const conclusionesMaxWidth = 65;
                 
                 // CIE 10 centrado en su columna (columna 2)
                 const cie10ColumnaInicio = margin + 87; // Inicio de la columna CIE 10
                 const cie10ColumnaFin = margin + 107; // Fin de la columna CIE 10
                 const cie10X = cie10ColumnaInicio + (cie10ColumnaFin - cie10ColumnaInicio) / 2; // Centro de la columna
                 const cie10Y = margin + 180;
                 const cie10MaxWidth = 20;
                 
                 const recomendacionesX = margin + 120;
                 const recomendacionesY = margin + 180;
                 const recomendacionesMaxWidth = 65;
            
                // Renderizar solo los datos sin tabla ni títulos
                doc.setFont("helvetica", "normal").setFontSize(8);
                doc.setTextColor(0, 0, 0);
                
                                 // Columna 1: CONCLUSIONES
                 doc.text(datosFinales.conclusiones || "", conclusionesX, conclusionesY, { maxWidth: conclusionesMaxWidth, align: "justify" });
                 
                 // Columna 2: CIE 10
                 doc.text(datosFinales.cie10 || "", cie10X, cie10Y, { maxWidth: cie10MaxWidth, align: "center" });
                 
                 // Columna 3: RECOMENDACIONES - RESTRICCIONES
                 doc.text(datosFinales.recomendaciones || "", recomendacionesX, recomendacionesY, { maxWidth: recomendacionesMaxWidth, align: "justify" });

      // === SECCIÓN XII: FIRMAS DE PRUEBA ===
      
     // === FIRMA DEL POSTULANTE ===
     // Posiciones para la firma del postulante
    //  const xFirmaPostulante = margin + 22;  // Posición X para la firma del postulante
    //  const yFirmaPostulante = margin + 225;   // Posición Y para la firma del postulante
    
      
    //  // === FIRMA DEL MÉDICO ===
    //  // Posiciones para la firma del médico
    //  const xFirmaMedico = margin + 118.5;       // Posición X para la firma del médico
    //  const yFirmaMedico = margin + 225;       // Posición Y para la firma del médico
    
     // === 4) FOOTER EN PÁGINA 2 ===
  footerTR(doc, data);

  // === 2) Generar blob y abrir en iframe para imprimir automáticamente ===
  // const blob = doc.output("blob");
  // const url = URL.createObjectURL(blob);
  // const iframe = document.createElement("iframe");
  // iframe.style.display = "none";
  // iframe.src = url;
  // document.body.appendChild(iframe);
  // iframe.onload = () => {
  //   iframe.contentWindow.focus();
  //   iframe.contentWindow.print();
  // };
    const firmasAPintar = [
    { 
      nombre: "FIRMAP", x: margin + 25, y:  margin + 215, maxw: 50 
    },
    { 
      nombre: "HUELLA", x: margin + 80, y:  margin + 215, maxw: 15 
    },
    { 
      nombre: "SELLOFIRMA", x: margin + 120, y:  margin + 215, maxw: 50 
    }
  ];
  
  // Validar que data.informacionSede exista antes de acceder a sus propiedades
  const digitalizacion = data?.digitalizacion || [];
  agregarFirmas(doc, digitalizacion, firmasAPintar).then(() => {
    imprimir(doc);
  });
}
 function footerTR(doc,datos) {
   const pageHeight = doc.internal.pageSize.getHeight();
   // Aumenta el margen inferior si hace falta (ej. 30 en lugar de 20)
   const marginBottom = 25;
   // Posición base para el footer
   const baseY = pageHeight - marginBottom;
   const col1X = 15;
   const col2X = 70;
   const col3X = 120;
   const col4X = 175;
 
   // Línea de color #1e3b8a arriba del footer
   const lineY = baseY - 5; // 2mm arriba del footer
   const lineX1 = 10; // Inicio de la línea (margen izquierdo)
   const lineX2 = 200; // Fin de la línea (margen derecho)
   
   // Configurar color y grosor de la línea
   doc.setDrawColor(30, 59, 138); // #1e3b8a en RGB
   doc.setLineWidth(0.5);
   
   // Dibujar la línea
   doc.line(lineX1, lineY, lineX2, lineY);
 
   // Ajustamos la fuente a 8 y color a negro
   doc.setFontSize(7);
   doc.setTextColor(0, 0, 0);
 
   //       COLUMNA 1
   let col1Y = baseY;
   doc.text(`${datos?.dirTruPierola || ""}`, col1X, col1Y);
   col1Y += 4;
   doc.text(`${datos?.dirHuamachuco || ""}`, col1X, col1Y);
   col1Y += 4;
   doc.text(`${datos?.dirHuancayo || ""}`, col1X, col1Y);
   col1Y += 4;
   doc.text(`${datos?.dirTrujillo || ""}`, col1X, col1Y);

   //       COLUMNA 2
   let col2Y = baseY;
   doc.text(`Cel. ${datos?.celTrujilloPie || ""}`, col2X+29, col2Y);
   col2Y += 4;
   doc.text(`Cel. ${datos?.celHuamachuco || ""}`, col2X+10, col2Y);
 
   //       COLUMNA 3
   let col3Y = baseY;
   doc.text(`${datos?.emailTruPierola || ""}`, col3X+7, col3Y);
   col3Y += 4;
   doc.text(`${datos?.emailHuancayo || ""}`, col3X, col3Y);
 
   //       COLUMNA 4
   let col4Y = baseY;
   doc.text(`Telf. ${datos?.telfTruPierola || ""}`, col4X, col4Y);
   col4Y += 4;
   doc.text(`Telf. ${datos?.telfHuamachuco || ""}`, col4X, col4Y);
   col4Y += 4;
   doc.text(`Telf. ${datos?.telfHuancayo || ""}`, col4X, col4Y);
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

function agregarFirmas(doc, digitalizacion = [], firmasAPintar = []) {
  const addSello = (imagenUrl, x, y, maxw = 100) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imagenUrl;
      img.onload = () => {
        const sigH = 35; // alto máximo
        const maxW = maxw; // ancho máximo como parámetro
        const baseX = x;
        const baseY = y;

        let imgW = img.width;
        let imgH = img.height;

        // Escala proporcional en base a ancho y alto máximos
        const scale = Math.min(maxW / imgW, sigH / imgH, 1);
        imgW *= scale;
        imgH *= scale;

        // Ahora el ancho se adapta
        const sigW = imgW;

        // Centrar la imagen
        const imgX = baseX + (sigW - imgW) / 2;
        const imgY = baseY + (sigH - imgH) / 2;

        doc.addImage(imagenUrl, "PNG", imgX, imgY, imgW, imgH);
        resolve();
      };
      img.onerror = (e) => {
        console.error("Error al cargar la imagen:", e);
        resolve();
      };
    });
  };

  const firmas = digitalizacion.reduce(
    (acc, d) => ({ ...acc, [d.nombreDigitalizacion]: d.url }),
    {}
  );

  const promesasFirmas = firmasAPintar
    .filter((f) => firmas[f.nombre])
    .map((f) => addSello(firmas[f.nombre], f.x, f.y, f.maxw));

  return Promise.all(promesasFirmas);
}