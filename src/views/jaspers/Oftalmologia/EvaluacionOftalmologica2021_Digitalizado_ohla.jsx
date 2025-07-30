import jsPDF from "jspdf";
import header_EvaluacionOftalmologica2021_Digitalizado_ohla from "./headers/header_EvaluacionOftalmologica2021_Digitalizado_ohla.jsx";

export default function EvaluacionOftalmologica2021_Digitalizado_ohla(data = {}) {
  const doc = new jsPDF();
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 32;

  // 1) Header
  header_EvaluacionOftalmologica2021_Digitalizado_ohla(doc, data);

  // const datos = {
  //   // Evaluación Oftalmológica
  //   parpadosAnexos: "NORMAL",
  //   cornea: "NORMAL", 
  //   otrosHallazgos: "NINGUNO",
  //   conjuntivas: "NORMAL",
  //   cristalino: "TRANSPARENTE",
  //   
  //   // Antecedentes
  //   antecedentesPersonales: "NO REFIERE",
  //   antecedentesFamiliares: "NO REFIERE",
  //   ptirigionOD: false, // false = no marcado, true = marcado con X
  //   ptirigionOI: true,  // true = marcado con X
  //   ptirigionNO: false, // false = no marcado, true = marcado con X
  //   hallazgos: "NINGUNO"
  // };

  const obtener = (name) => {
    return data[name] || "";
  };

  // Datos de prueba (descomentados para ver sobre el frame)
  const datosPrueba = {
    // Evaluación Oftalmológica
    parpadosAnexos: "NORMAL",
    cornea: "NORMAL", 
    otrosHallazgos: "NINGUNO",
    conjuntivas: "NORMAL",
    cristalino: "TRANSPARENTE",
    
    // Antecedentes
    antecedentesPersonales: "NO REFIERE",
    antecedentesFamiliares: "NO REFIERE",
    ptirigionOD: false, // false = no marcado, true = marcado con X
    ptirigionOI: true,  // true = marcado con X
    ptirigionNO: false, // false = no marcado, true = marcado con X
    hallazgos: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    
    // AGUDEZA VISUAL
    correctoresOcularesSI: true, // true = marcado con X
    correctoresOcularesNO: false, // false = no marcado
    
    // Agudeza Visual Sin Correctores
    sinCorrectoresCercaOD: "60",
    sinCorrectoresCercaOI: "60",
    sinCorrectoresLejosOD: "90",
    sinCorrectoresLejosOI: "90",
    sinCorrectoresBinocular: "10",
    
    // Agudeza Visual Con Correctores
    conCorrectoresCercaOD: "40",
    conCorrectoresCercaOI: "40",
    conCorrectoresLejosOD: "30",
    conCorrectoresLejosOI: "30",
    conCorrectoresBinocular: "10",
    
    // Agudeza Visual Con Agujero Estenopeico
    conAgujeroCercaOD: "50",
    conAgujeroCercaOI: "50",
    conAgujeroLejosOD: "70",
    conAgujeroLejosOI: "70",
    conAgujeroBinocularOD: "",
    conAgujeroBinocularOI: "",
    
    // TEST DE EVALUACIÓN COMPLEMENTARIA
    testIshiharaNormal: true, // true = marcado con X
    testIshiharaAnormal: false,
    testIshiharaNC: false,
    
    testColoresNormal: true, // true = marcado con X
    testColoresAnormal: false,
    testColoresNC: false,
    
    estereopsiaNormal: true, // true = marcado con X
    estereopsiaAnormal: false,
    estereopsiaNC: false,
    estereopsiaSegundos: "seg.", // valor en segundos
    
    // REFRACCIÓN
    refraccionAplica: false, // false = no marcado
    refraccionNoAplica: true, // true = marcado con X
    
    // REFRACCIÓN DE LEJOS
    refraccionLejosODSF: "-2.50",
    refraccionLejosODCIL: "-1.00",
    refraccionLejosODEJE: "90",
    refraccionLejosODDIP: "2.50",
    refraccionLejosOISF: "-2.25",
    refraccionLejosOICIL: "-0.75",
    refraccionLejosOIEJE: "85",
    refraccionLejosOIDIP: "2.25",
    
    // REFRACCIÓN DE CERCA
    refraccionCercaODSF: "+1.50",
    refraccionCercaODCIL: "-0.50",
    refraccionCercaODEJE: "180",
    refraccionCercaODDIP: "1.50",
    refraccionCercaOISF: "+1.25",
    refraccionCercaOICIL: "-0.25",
    refraccionCercaOIEJE: "175",
    refraccionCercaOIDIP: "1.25",
    
    // DIAGNÓSTICO
    diagnostico: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    
    // INDICADORES
    // Indicadores Generales
    indicadoresNinguna: true,
    indicadoresUsoCorrectores: true,
    indicadoresUsoCorrectoresLejos: true,
    indicadoresUsoCorrectoresCerca: true,
    indicadoresControlOftalmologia: true,
    indicadoresLentesCorrectores: true,
    indicadoresLentesCorrectoresCerca: true,
    indicadoresLentesCorrectoresLejos: true,
    indicadoresCambioLunas: true,
    indicadoresPterigion: true,
    indicadoresOtras: true,
    
    // Indicadores Entorno Laboral
    indicadoresNoRestringe: true,
    indicadoresNoRestringeLejos: true,
    indicadoresNoRestringeCerca: true,
    indicadoresUsoCorrectoresLaboral: true,
    indicadoresNoCablesElectricos: true,
    indicadoresNoConduccion: true
  };

  // const datos = {
  //   // Evaluación Oftalmológica
  //   parpadosAnexos: obtener("parpadosAnexos"),
  //   cornea: obtener("cornea"), 
  //   otrosHallazgos: obtener("otrosHallazgos"),
  //   conjuntivas: obtener("conjuntivas"),
  //   cristalino: obtener("cristalino"),
  //   
  //   // Antecedentes
  //   antecedentesPersonales: obtener("antecedentesPersonales"),
  //   antecedentesFamiliares: obtener("antecedentesFamiliares"),
  //   ptirigionOD: data.ptirigionOD,
  //   ptirigionOI: data.ptirigionOI,
  //   ptirigionNO: data.ptirigionNO, // Campo "NO" para ptirigion
  //   hallazgos: obtener("hallazgos")
  // };

  // Usar solo datos de prueba para ver sobre el frame
  const datosFinales = datosPrueba;

  // 2) Título
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("EVALUACIÓN OFTALMOLÓGICA", pageW / 2, y, { align: "center" });
  y += 6;

  // === NUEVO: Usar imagen de fondo para la evaluación oftalmológica ===
  const fondoImg = "/img/Frame_EvaluacionOft_digi_ohla.png";
  const fondoH = 210; // altura aproximada del frame en mm (ajusta si es necesario)
  let yHeader = 60;
  try {
    doc.addImage(fondoImg, "PNG", 0, yHeader, pageW, fondoH);
  } catch (e) {
    doc.text("Imagen de evaluación oftalmológica no disponible", margin, yHeader + 10);
  }

  // === 2) Datos de evaluación (cada uno con su propia posición para moverlos individualmente) ===
  // Puedes ajustar cada x/y a tu gusto
  doc.setFont("helvetica", "normal").setFontSize(9);

  // === AGUDEZA VISUAL ===
  // Correctores Oculares
  const xCorrectoresSI = margin + 77;
  const xCorrectoresNO = margin + 178;
  const yCorrectores = margin + 96.5;
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("X", xCorrectoresSI, yCorrectores);
  doc.text("X", xCorrectoresNO, yCorrectores);
  doc.setFont("helvetica", "normal").setFontSize(9);

  // NTXC y NTCL (Cerca y Lejos)
  const xNTXCCerca = margin + 95;
  const xNTXCLlejos = margin + 110;
  const yNTXC = margin + 96.5;
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("X", xNTXCCerca, yNTXC);
  doc.text("X", xNTXCLlejos, yNTXC);
  doc.setFont("helvetica", "normal").setFontSize(9);

  // NTCC y NCTL
  const xNTCC = margin + 131;
  const xNCTL = margin + 145.5;
  const yNTCC = margin + 96.5;
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("X", xNTCC, yNTCC);
  doc.text("X", xNCTL, yNTCC);
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Agudeza Visual - De Cerca (todos alineados horizontalmente)
  const yDeCerca = margin + 108.5; // Misma altura para todos
  
  // Sin Correctores
  const xSinCorrectoresCercaOD = margin + 55;
  const xSinCorrectoresCercaOI = margin + 75;
  doc.text(String(datosFinales.sinCorrectoresCercaOD || ""), xSinCorrectoresCercaOD, yDeCerca);
  doc.text(String(datosFinales.sinCorrectoresCercaOI || ""), xSinCorrectoresCercaOI, yDeCerca);

  // Con Correctores
  const xConCorrectoresCercaOD = margin + 98;
  const xConCorrectoresCercaOI = margin + 120;
  doc.text(String(datosFinales.conCorrectoresCercaOD || ""), xConCorrectoresCercaOD, yDeCerca);
  doc.text(String(datosFinales.conCorrectoresCercaOI || ""), xConCorrectoresCercaOI, yDeCerca);

  // Con Agujero Estenopeico
  const xConAgujeroCercaOD = margin + 142 ;
  const xConAgujeroCercaOI = margin + 162 ;
  doc.text(String(datosFinales.conAgujeroCercaOD || ""), xConAgujeroCercaOD, yDeCerca);
  doc.text(String(datosFinales.conAgujeroCercaOI || ""), xConAgujeroCercaOI, yDeCerca);

  // Agudeza Visual - De Lejos (todos alineados horizontalmente)
  const yDeLejos = margin + 112.5; // Bajando un poco de De Cerca
  
  // Sin Correctores
  doc.text(String(datosFinales.sinCorrectoresLejosOD || ""), xSinCorrectoresCercaOD, yDeLejos);
  doc.text(String(datosFinales.sinCorrectoresLejosOI || ""), xSinCorrectoresCercaOI, yDeLejos);

  // Con Correctores
  doc.text(String(datosFinales.conCorrectoresLejosOD || ""), xConCorrectoresCercaOD, yDeLejos);
  doc.text(String(datosFinales.conCorrectoresLejosOI || ""), xConCorrectoresCercaOI, yDeLejos);

  // Con Agujero Estenopeico
  doc.text(String(datosFinales.conAgujeroLejosOD || ""), xConAgujeroCercaOD, yDeLejos);
  doc.text(String(datosFinales.conAgujeroLejosOI || ""), xConAgujeroCercaOI, yDeLejos);

  // Agudeza Visual - Binocular (Reev.) (solo un valor por sección)
  const yBinocular = margin + 116; // Bajando un poco más de De Lejos
  
  // Sin Correctores
  const xBinocularSinCorrectores = margin + 65.5; // Posición central
  doc.text(String(datosFinales.sinCorrectoresBinocular || ""), xBinocularSinCorrectores, yBinocular);

  // Con Correctores
  const xBinocularConCorrectores = margin + 108.5; // Posición central
  doc.text(String(datosFinales.conCorrectoresBinocular || ""), xBinocularConCorrectores, yBinocular);

  // Con Agujero Estenopeico (vacío)
  const xBinocularConAgujero = margin + 152; // Posición central
  doc.text(String(datosFinales.conAgujeroBinocularOD || ""), xBinocularConAgujero, yBinocular);

  // === EVALUACIÓN OFTALMOLÓGICA (sección izquierda) ===
  const xEvaluacion = margin + 15;
  let yEvaluacion = margin + 62.5;

  doc.text(String(datosFinales.parpadosAnexos || ""), xEvaluacion + 30, yEvaluacion);
  yEvaluacion += 4.8;
  doc.text(String(datosFinales.cornea || ""), xEvaluacion + 30, yEvaluacion);
  yEvaluacion += 4.8;
  doc.text(String(datosFinales.otrosHallazgos || ""), xEvaluacion + 30, yEvaluacion);
  yEvaluacion += 4.7;
  doc.text(String(datosFinales.conjuntivas || ""), xEvaluacion + 30, yEvaluacion);
  yEvaluacion += 5.65;
  doc.text(String(datosFinales.cristalino || ""), xEvaluacion + 30, yEvaluacion);

  // === ANTECEDENTES (sección derecha) ===
  const xAntecedentes = margin + 55;
  let yAntecedentes = margin +  63;

  doc.text(String(datosFinales.antecedentesPersonales || ""), xAntecedentes + 45, yAntecedentes);
  yAntecedentes += 7;
  doc.text(String(datosFinales.antecedentesFamiliares || ""), xAntecedentes + 45, yAntecedentes);
  yAntecedentes += 7;

  // Ptirigion (marcar X en casillas)
  const xPtirigionOD = margin + 129.5;
  const xPtirigionOI = margin + 135.5;
  const xPtirigionNO = margin + 166; // Campo "NO" para ptirigion
  const yPtirigion = margin + 79.2;
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("X", xPtirigionOD, yPtirigion);
  doc.text("X", xPtirigionOI, yPtirigion);
  doc.text("X", xPtirigionNO, yPtirigion);
  doc.setFont("helvetica", "normal").setFontSize(9);

  yAntecedentes += 7;
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(String(datosFinales.hallazgos || ""), xAntecedentes + 72, yAntecedentes, { maxWidth: 60 });
  doc.setFont("helvetica", "normal").setFontSize(9);

  // === TEST DE EVALUACIÓN COMPLEMENTARIA ===
  // Test de Ishihara
  const xTestIshiharaNormal = margin + 106;
  const xTestIshiharaAnormal = margin + 135;
  const xTestIshiharaNC = margin + 164;
  const yTestIshihara = margin + 125.3;
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("A", xTestIshiharaNormal, yTestIshihara);
  doc.text("A", xTestIshiharaAnormal, yTestIshihara);
  doc.text("A", xTestIshiharaNC, yTestIshihara);
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Test de Colores Puros (coordenadas independientes)
  const xTestColoresNormal = margin + 106;
  const xTestColoresAnormal = margin + 135;
  const xTestColoresNC = margin + 164;
  const yTestColores = margin + 130;
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("B", xTestColoresNormal, yTestColores);
  doc.text("B", xTestColoresAnormal, yTestColores);
  doc.text("B", xTestColoresNC, yTestColores);
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Estereopsia (coordenadas independientes)
  const xEstereopsiaNormal = margin + 106;
  const xEstereopsiaAnormal = margin + 135;
  const xEstereopsiaNC = margin + 164;
  const yEstereopsia = margin + 134.5;
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("C", xEstereopsiaNormal, yEstereopsia);
  doc.text("C", xEstereopsiaAnormal, yEstereopsia);
  doc.text("C", xEstereopsiaNC, yEstereopsia);
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Valor de Estereopsia en segundos
  const xEstereopsiaSegundos = margin + 65;
  doc.text(String(datosFinales.estereopsiaSegundos || ""), xEstereopsiaSegundos, yEstereopsia);

  // === REFRACCIÓN ===
  const xRefraccionAplica = margin + 55.5;
  const xRefraccionNoAplica = margin + 91.5;
  const yRefraccion = margin + 140.35;
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("X", xRefraccionAplica, yRefraccion);
  doc.text("X", xRefraccionNoAplica, yRefraccion);
  doc.setFont("helvetica", "normal").setFontSize(9);

  // === REFRACCIÓN DE LEJOS ===
  const yRefraccionLejos = margin + 151;
  
  // OD (Ojo Derecho)
  const xRefraccionLejosODSF = margin + 33;
  const xRefraccionLejosODCIL = margin + 48.3;
  const xRefraccionLejosODEJE = margin + 65;
  const xRefraccionLejosODDIP = margin + 80;
  
  doc.text(String(datosFinales.refraccionLejosODSF || ""), xRefraccionLejosODSF, yRefraccionLejos);
  doc.text(String(datosFinales.refraccionLejosODCIL || ""), xRefraccionLejosODCIL, yRefraccionLejos);
  doc.text(String(datosFinales.refraccionLejosODEJE || ""), xRefraccionLejosODEJE, yRefraccionLejos);
  doc.text(String(datosFinales.refraccionLejosODDIP || ""), xRefraccionLejosODDIP, yRefraccionLejos);
  
  // OI (Ojo Izquierdo)
  const yRefraccionLejosOI = margin + 155;
  doc.text(String(datosFinales.refraccionLejosOISF || ""), xRefraccionLejosODSF, yRefraccionLejosOI);
  doc.text(String(datosFinales.refraccionLejosOICIL || ""), xRefraccionLejosODCIL, yRefraccionLejosOI);
  doc.text(String(datosFinales.refraccionLejosOIEJE || ""), xRefraccionLejosODEJE, yRefraccionLejosOI);
  doc.text(String(datosFinales.refraccionLejosOIDIP || ""), xRefraccionLejosODDIP, yRefraccionLejosOI);

  // === REFRACCIÓN DE CERCA ===
  const yRefraccionCerca = margin + 151;
  
  // OD (Ojo Derecho)
  const xRefraccionCercaODSF = margin + 120;
  const xRefraccionCercaODCIL = margin + 137;
  const xRefraccionCercaODEJE = margin + 149;
  const xRefraccionCercaODDIP = margin + 163;
  
  doc.text(String(datosFinales.refraccionCercaODSF || ""), xRefraccionCercaODSF, yRefraccionCerca);
  doc.text(String(datosFinales.refraccionCercaODCIL || ""), xRefraccionCercaODCIL, yRefraccionCerca);
  doc.text(String(datosFinales.refraccionCercaODEJE || ""), xRefraccionCercaODEJE, yRefraccionCerca);
  doc.text(String(datosFinales.refraccionCercaODDIP || ""), xRefraccionCercaODDIP, yRefraccionCerca);
  
  // OI (Ojo Izquierdo)
  const yRefraccionCercaOI = margin + 155;
  doc.text(String(datosFinales.refraccionCercaOISF || ""), xRefraccionCercaODSF, yRefraccionCercaOI);
  doc.text(String(datosFinales.refraccionCercaOICIL || ""), xRefraccionCercaODCIL, yRefraccionCercaOI);
  doc.text(String(datosFinales.refraccionCercaOIEJE || ""), xRefraccionCercaODEJE, yRefraccionCercaOI);
  doc.text(String(datosFinales.refraccionCercaOIDIP || ""), xRefraccionCercaODDIP, yRefraccionCercaOI);

  // === DIAGNÓSTICO ===
  const xDiagnostico = margin + 34.5;
  const yDiagnostico = margin + 174;
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(String(datosFinales.diagnostico || ""), xDiagnostico, yDiagnostico, { maxWidth: 150 });

  // === INDICADORES ===
  // Indicadores Generales
  const yIndicadoresGenerales = margin + 188;
  
  // Ninguna
  const xIndicadoresNinguna = margin + 41;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("X", xIndicadoresNinguna, yIndicadoresGenerales);
  
  // Uso de Correctores Oculares
  const yIndicadoresUsoCorrectores = margin + 192.5;
  doc.text("X", xIndicadoresNinguna, yIndicadoresUsoCorrectores);
  
  // Control complementario por Oftalmología
  const yIndicadoresControl = margin + 197;
  doc.text("X", xIndicadoresNinguna, yIndicadoresControl);
  
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Generar blob y abrir en iframe para imprimir automáticamente
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