import jsPDF from "jspdf";
import headerEvaluacionMuscoloEsqueletica from "./Headers/Header_EvaluacionMuscoloEsqueletica2021_Digitalizado_boro.jsx";
import footerTR from "../components/footerTR.jsx";

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
      }
  };

  // Usar datos reales o datos de prueba
  const datosFinales = data && Object.keys(data).length > 0 ? data : datosPrueba;

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
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.observacionesAptitudEspalda || "", xObservacionesAptitud, yObservacionesAptitud, { maxWidth: 60 });

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
  doc.text(datosFinales.observacionesRangosArticulares || "", xObservacionesRangos, yObservacionesRangos, { maxWidth: 60 });

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

    // === 2) FOOTER EN PÁGINA 2 ===
    footerTR(doc, data);

  // === 2) Generar blob y abrir en iframe para imprimir automáticamente ===
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}
