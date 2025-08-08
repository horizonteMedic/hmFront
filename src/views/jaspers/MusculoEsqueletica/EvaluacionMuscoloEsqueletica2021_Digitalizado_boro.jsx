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
    observacionesRangosArticulares: "Rangos articulares dentro de parámetros normales, sin dolor significativo."
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
