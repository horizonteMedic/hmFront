import jsPDF from "jspdf";
import header_EvaluacionOftalmologica2021_Digitalizado_ohla from "./headers/header_EvaluacionOftalmologica2021_Digitalizado_ohla.jsx";

export default function EvaluacionOftalmologica2021_Digitalizado_ohla(
  data = {}
) {
  const doc = new jsPDF();
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();

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

  // Datos de prueba (solo para desarrollo)
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
    ptirigionOD: false,
    ptirigionOI: false,
    ptirigionNO: false,
    hallazgos: "",

    // AGUDEZA VISUAL
    correctoresOcularesSI: false,
    correctoresOcularesNO: false,
    ntxcCerca: false,
    ntxcLejos: false,
    ntcc: false,
    nctl: false,

    // Agudeza Visual Sin Correctores
    sinCorrectoresCercaOD: "",
    sinCorrectoresCercaOI: "",
    sinCorrectoresLejosOD: "",
    sinCorrectoresLejosOI: "",
    sinCorrectoresBinocular: "",

    // Agudeza Visual Con Correctores
    conCorrectoresCercaOD: "",
    conCorrectoresCercaOI: "",
    conCorrectoresLejosOD: "",
    conCorrectoresLejosOI: "",
    conCorrectoresBinocular: "",

    // Agudeza Visual Con Agujero Estenopeico
    conAgujeroCercaOD: "",
    conAgujeroCercaOI: "",
    conAgujeroLejosOD: "",
    conAgujeroLejosOI: "",
    conAgujeroBinocularOD: "",
    conAgujeroBinocularOI: "",

    // TEST DE EVALUACIÓN COMPLEMENTARIA
    testIshiharaNormal: false,
    testIshiharaAnormal: false,
    testIshiharaNC: false,

    testColoresNormal: false,
    testColoresAnormal: false,
    testColoresNC: false,

    estereopsiaNormal: false,
    estereopsiaAnormal: false,
    estereopsiaNC: false,
    estereopsiaSegundos: "",

    // REFRACCIÓN
    refraccionAplica: false,
    refraccionNoAplica: false,

    // REFRACCIÓN DE LEJOS
    refraccionLejosODSF: "",
    refraccionLejosODCIL: "",
    refraccionLejosODEJE: "",
    refraccionLejosODDIP: "",
    refraccionLejosOISF: "",
    refraccionLejosOICIL: "",
    refraccionLejosOIEJE: "",
    refraccionLejosOIDIP: "",

    // REFRACCIÓN DE CERCA
    refraccionCercaODSF: "",
    refraccionCercaODCIL: "",
    refraccionCercaODEJE: "",
    refraccionCercaODDIP: "",
    refraccionCercaOISF: "",
    refraccionCercaOICIL: "",
    refraccionCercaOIEJE: "",
    refraccionCercaOIDIP: "",

    // DIAGNÓSTICO
    txtAvConRefraccionLejosOd: "",
    txtAvConRefraccionLejosOi: "",
    txtAvConRefraccionCercaOd: "",
    txtAvConRefraccionCercaOi: "",
    diagnostico: "",

    // INDICADORES
    // Indicadores Generales
    indicadoresNinguna: false,
    indicadoresUsoCorrectores: false,
    indicadoresControlOftalmologia: false,
    indicadoresLejos: false,
    indicadoresCerca: false,
    indicadoresLentesCorrectores: false,
    indicadoresLentesCorrectoresCerca: false,
    indicadoresLentesCorrectoresLejos: false,
    indicadoresCambioLunas: false,
    indicadoresPterigion: false,
    indicadoresOtras: false,

    // Indicadores Entorno Laboral
    indicadoresNoRestringe: false,
    indicadoresUsoCorrectoresLaboral: false,
    indicadoresNoCablesElectricos: false,
    indicadoresNoConduccion: false,
    indicadoresLejosLaboral: false,
    indicadoresCercaLaboral: false,
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
  const obtenerString = (nombre) => {
    return data[nombre] ?? "";
  };

  const datosReales = {
    // Evaluación Oftalmológica
    parpadosAnexos: obtenerString("txtParpaAnex"),
    cornea: obtenerString("txtCorneas"),
    otrosHallazgos: obtenerString("txtOtrosHallaz"),
    conjuntivas: obtenerString("txtConjuntivas"),
    cristalino: obtenerString("txtCristalino"),

    // Antecedentes
    antecedentesPersonales: obtenerString("txtAntPersImp"),
    antecedentesFamiliares: obtenerString("txtFamImp"),
    ptirigionOD: obtenerString("rbecPterigionOd"),
    ptirigionOI: obtenerString("rbecPterigionOi"),
    ptirigionNO:
      obtenerString("rbecPterigionOd") == "" &&
      obtenerString("rbecPterigionOi") == "",
    hallazgos: obtenerString("txtecHallazgos"),

    // AGUDEZA VISUAL
    correctoresOcularesSI: data.rbcOsi,
    correctoresOcularesNO: data.rbcOno,
    ntxcCerca: data.rbcOcerca,
    ntxcLejos: data.rbcOlejos,
    ntcc: data.chkNtcc,
    nctl: data.chkNtcl,

    // Agudeza Visual Sin Correctores
    sinCorrectoresCercaOD: obtenerString("txtCercaSinCorregirOd"),
    sinCorrectoresCercaOI: obtenerString("txtCercaSinCorregirOi"),
    sinCorrectoresLejosOD: obtenerString("txtLejosSinCorregirOd"),
    sinCorrectoresLejosOI: obtenerString("txtLejosSinCorregirOi"),
    sinCorrectoresBinocular: obtenerString("txtBinocularSinCorregir"),

    // Agudeza Visual Con Correctores
    conCorrectoresCercaOD: obtenerString("txtCercaCorregidaOd"),
    conCorrectoresCercaOI: obtenerString("txtCercaCorregidaOi"),
    conCorrectoresLejosOD: obtenerString("txtLejosCorregidaOd"),
    conCorrectoresLejosOI: obtenerString("txtLejosCorregidaOi"),
    conCorrectoresBinocular: obtenerString("txtBinocularCorregida"),

    // Agudeza Visual Con Agujero Estenopeico
    conAgujeroCercaOD: obtenerString("txtCercaAgujeroOd"),
    conAgujeroCercaOI: obtenerString("txtCercaAgujeroOi"),
    conAgujeroLejosOD: obtenerString("txtLejosAgujeroOd"),
    conAgujeroLejosOI: obtenerString("txtLejosAgujeroOi"),
    conAgujeroBinocularOD: "",
    conAgujeroBinocularOI: "",

    // TEST DE EVALUACIÓN COMPLEMENTARIA
    testIshiharaNormal: data.rbtEcIshiharaNormal,
    testIshiharaAnormal: data.rbtEcIshiharaAnormal,
    testIshiharaNC: data.rbtEcIshiharaNc,

    testColoresNormal: data.rbtEcColeresNormal,
    testColoresAnormal: data.rbtEcColeresAnormal,
    testColoresNC: data.rbtEcColeresNc,

    estereopsiaNormal: data.rbtEcEstereopsiaNormal,
    estereopsiaAnormal: data.rbtEcEstereopsiaAnormal,
    estereopsiaNC: data.rbtEcEstereopsiaNc,
    estereopsiaSegundos: obtenerString("txtTecEstereopsia"),

    // REFRACCIÓN
    refraccionAplica: data.chkRefraccionAplica,
    refraccionNoAplica: data.chkRefraccionNoAplica,

    // REFRACCIÓN DE LEJOS
    refraccionLejosODSF: obtenerString("txtLejosOdSf"),
    refraccionLejosODCIL: obtenerString("txtLejosOdCil"),
    refraccionLejosODEJE: obtenerString("txtLejosOdEje"),
    refraccionLejosODDIP: obtenerString("txtLejosOdDip"),
    refraccionLejosOISF: obtenerString("txtLejosOiSf"),
    refraccionLejosOICIL: obtenerString("txtLejosOiCil"),
    refraccionLejosOIEJE: obtenerString("txtLejosOiEje"),
    refraccionLejosOIDIP: "",

    // REFRACCIÓN DE CERCA
    refraccionCercaODSF: obtenerString("txtCercaOdSf"),
    refraccionCercaODCIL: obtenerString("txtCercaOdCil"),
    refraccionCercaODEJE: obtenerString("txtCercaOdEje"),
    refraccionCercaODDIP: obtenerString("txtCercaOdDip"),
    refraccionCercaOISF: obtenerString("txtCercaOiSf"),
    refraccionCercaOICIL: obtenerString("txtCercaOiCil"),
    refraccionCercaOIEJE: obtenerString("txtCercaOiEje"),
    refraccionCercaOIDIP: "",

    // DIAGNÓSTICO
    txtAvConRefraccionLejosOd: obtenerString("txtAvConRefraccionLejosOd"),
    txtAvConRefraccionLejosOi: obtenerString("txtAvConRefraccionLejosOi"),
    txtAvConRefraccionCercaOd: obtenerString("txtAvConRefraccionCercaOd"),
    txtAvConRefraccionCercaOi: obtenerString("txtAvConRefraccionCercaOi"),
    diagnostico: obtenerString("txtDiagnostico"),

    // INDICADORES
    // Indicadores Generales
    indicadoresNinguna: data.chkInNinguna,
    indicadoresUsoCorrectores: data.chkI2 || data.chkI3,
    indicadoresControlOftalmologia: data.chkI4Cerca || data.chkI4Lejos,
    indicadoresLejos: data.chkI3,
    indicadoresCerca: data.chkI2,
    indicadoresLentesCorrectores: data.chkI4Cerca || data.chkI4Lejos,
    indicadoresLentesCorrectoresCerca: data.chkI4Cerca,
    indicadoresLentesCorrectoresLejos: data.chkI4Lejos,
    indicadoresCambioLunas: data.chkI5,
    indicadoresPterigion: data.chkI6,
    indicadoresOtras: data.chkI7,

    // Indicadores Entorno Laboral
    indicadoresNoRestringe: data.chkR1,
    indicadoresUsoCorrectoresLaboral: data.chkR2Lejos || data.chkR2Cerca,
    indicadoresNoCablesElectricos: data.chkR3,
    indicadoresNoConduccion: data.chkR4,
    indicadoresLejosLaboral: data.chkR2Lejos,
    indicadoresCercaLaboral: data.chkR2Cerca,
  };

  // Usar datos reales o datos de prueba
  const datosFinales =
    data && Object.keys(data).length > 0 ? datosReales : datosPrueba;

  // === NUEVO: Usar imagen de fondo para la evaluación oftalmológica ===
  const fondoImg = "/img/frame_oftamo_ohla.png";
  const fondoH = 210; // altura aproximada del frame en mm (ajusta si es necesario)
  let yHeader = 60;
  try {
    doc.addImage(fondoImg, "PNG", 0, yHeader, pageW, fondoH);
  } catch (e) {
    doc.text(
      "Imagen de evaluación oftalmológica no disponible",
      margin,
      yHeader + 10
    );
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
  if (datosFinales.correctoresOcularesSI) {
    doc.text("X", xCorrectoresSI, yCorrectores);
  }
  if (datosFinales.correctoresOcularesNO) {
    doc.text("X", xCorrectoresNO, yCorrectores);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);

  // NTXC y NTCL (Cerca y Lejos)
  const xNTXCCerca = margin + 95;
  const xNTXCLlejos = margin + 110;
  const yNTXC = margin + 96.5;

  doc.setFont("helvetica", "bold").setFontSize(9);
  if (datosFinales.ntxcCerca) {
    doc.text("X", xNTXCCerca, yNTXC);
  }
  if (datosFinales.ntxcLejos) {
    doc.text("X", xNTXCLlejos, yNTXC);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);

  // NTCC y NCTL
  const xNTCC = margin + 131;
  const xNCTL = margin + 145.5;
  const yNTCC = margin + 96.5;

  doc.setFont("helvetica", "bold").setFontSize(9);
  if (datosFinales.ntcc) {
    doc.text("X", xNTCC, yNTCC);
  }
  if (datosFinales.nctl) {
    doc.text("X", xNCTL, yNTCC);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Agudeza Visual - De Cerca (todos alineados horizontalmente)
  const yDeCerca = margin + 108.5; // Misma altura para todos

  // Sin Correctores
  const xSinCorrectoresCercaOD = margin + 55;
  const xSinCorrectoresCercaOI = margin + 75;
  doc.text(
    String(datosFinales.sinCorrectoresCercaOD || ""),
    xSinCorrectoresCercaOD,
    yDeCerca
  );
  doc.text(
    String(datosFinales.sinCorrectoresCercaOI || ""),
    xSinCorrectoresCercaOI,
    yDeCerca
  );

  // Con Correctores
  const xConCorrectoresCercaOD = margin + 98;
  const xConCorrectoresCercaOI = margin + 120;
  doc.text(
    String(datosFinales.conCorrectoresCercaOD || ""),
    xConCorrectoresCercaOD,
    yDeCerca
  );
  doc.text(
    String(datosFinales.conCorrectoresCercaOI || ""),
    xConCorrectoresCercaOI,
    yDeCerca
  );

  // Con Agujero Estenopeico
  const xConAgujeroCercaOD = margin + 142;
  const xConAgujeroCercaOI = margin + 162;
  doc.text(
    String(datosFinales.conAgujeroCercaOD || ""),
    xConAgujeroCercaOD,
    yDeCerca
  );
  doc.text(
    String(datosFinales.conAgujeroCercaOI || ""),
    xConAgujeroCercaOI,
    yDeCerca
  );

  // Agudeza Visual - De Lejos (todos alineados horizontalmente)
  const yDeLejos = margin + 112.5; // Bajando un poco de De Cerca

  // Sin Correctores
  doc.text(
    String(datosFinales.sinCorrectoresLejosOD || ""),
    xSinCorrectoresCercaOD,
    yDeLejos
  );
  doc.text(
    String(datosFinales.sinCorrectoresLejosOI || ""),
    xSinCorrectoresCercaOI,
    yDeLejos
  );

  // Con Correctores
  doc.text(
    String(datosFinales.conCorrectoresLejosOD || ""),
    xConCorrectoresCercaOD,
    yDeLejos
  );
  doc.text(
    String(datosFinales.conCorrectoresLejosOI || ""),
    xConCorrectoresCercaOI,
    yDeLejos
  );

  // Con Agujero Estenopeico
  doc.text(
    String(datosFinales.conAgujeroLejosOD || ""),
    xConAgujeroCercaOD,
    yDeLejos
  );
  doc.text(
    String(datosFinales.conAgujeroLejosOI || ""),
    xConAgujeroCercaOI,
    yDeLejos
  );

  // Agudeza Visual - Binocular (Reev.) (solo un valor por sección)
  const yBinocular = margin + 116; // Bajando un poco más de De Lejos

  // Sin Correctores
  const xBinocularSinCorrectores = margin + 65.5; // Posición central
  doc.text(
    String(datosFinales.sinCorrectoresBinocular || ""),
    xBinocularSinCorrectores,
    yBinocular
  );

  // Con Correctores
  const xBinocularConCorrectores = margin + 108.5; // Posición central
  doc.text(
    String(datosFinales.conCorrectoresBinocular || ""),
    xBinocularConCorrectores,
    yBinocular
  );

  // Con Agujero Estenopeico (vacío)
  const xBinocularConAgujero = margin + 152; // Posición central
  doc.text(
    String(datosFinales.conAgujeroBinocularOD || ""),
    xBinocularConAgujero,
    yBinocular
  );

  // === EVALUACIÓN OFTALMOLÓGICA (sección izquierda) ===
  const xEvaluacion = margin + 15;
  let yEvaluacion = margin + 62.5;

  doc.text(
    String(datosFinales.parpadosAnexos || ""),
    xEvaluacion + 30,
    yEvaluacion
  );
  yEvaluacion += 4.8;
  doc.text(String(datosFinales.cornea || ""), xEvaluacion + 30, yEvaluacion);
  yEvaluacion += 4.8;
  doc.text(
    String(datosFinales.otrosHallazgos || ""),
    xEvaluacion + 30,
    yEvaluacion
  );
  yEvaluacion += 4.7;
  doc.text(
    String(datosFinales.conjuntivas || ""),
    xEvaluacion + 30,
    yEvaluacion
  );
  yEvaluacion += 5.65;
  doc.text(
    String(datosFinales.cristalino || ""),
    xEvaluacion + 30,
    yEvaluacion
  );

  // === ANTECEDENTES (sección derecha) ===
  const xAntecedentes = margin + 55;
  let yAntecedentes = margin + 63;

  doc.text(
    String(datosFinales.antecedentesPersonales || ""),
    xAntecedentes + 45,
    yAntecedentes
  );
  yAntecedentes += 7;
  doc.text(
    String(datosFinales.antecedentesFamiliares || ""),
    xAntecedentes + 45,
    yAntecedentes
  );
  yAntecedentes += 7;

  // Ptirigion (marcar X en casillas)
  const xPtirigionOD = margin + 129.5;
  const xPtirigionOI = margin + 135.5;
  const xPtirigionNO = margin + 166; // Campo "NO" para ptirigion
  const yPtirigion = margin + 79.2;

  doc.setFont("helvetica", "bold").setFontSize(9);
  if (datosFinales.ptirigionOD) {
    doc.text("X", xPtirigionOD, yPtirigion);
  }
  if (datosFinales.ptirigionOI) {
    doc.text("X", xPtirigionOI, yPtirigion);
  }
  if (datosFinales.ptirigionNO) {
    doc.text("X", xPtirigionNO, yPtirigion);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);

  yAntecedentes += 7;
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(
    String(datosFinales.hallazgos || ""),
    xAntecedentes + 72,
    yAntecedentes,
    { maxWidth: 60 }
  );
  doc.setFont("helvetica", "normal").setFontSize(9);

  // === TEST DE EVALUACIÓN COMPLEMENTARIA ===
  // Test de Ishihara
  const xTestIshiharaNormal = margin + 106;
  const xTestIshiharaAnormal = margin + 135;
  const xTestIshiharaNC = margin + 164;
  const yTestIshihara = margin + 125.3;

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text(
    datosFinales.testIshiharaNormal ? "X" : "",
    xTestIshiharaNormal,
    yTestIshihara
  );
  doc.text(
    datosFinales.testIshiharaAnormal ? "X" : "",
    xTestIshiharaAnormal,
    yTestIshihara
  );
  doc.text(datosFinales.testIshiharaNC ? "X" : "", xTestIshiharaNC, yTestIshihara);
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Test de Colores Puros (coordenadas independientes)
  const xTestColoresNormal = margin + 106;
  const xTestColoresAnormal = margin + 135;
  const xTestColoresNC = margin + 164;
  const yTestColores = margin + 130;

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text(datosFinales.testColoresNormal ? "X" : "", xTestColoresNormal, yTestColores);
  doc.text(
    datosFinales.testColoresAnormal ? "X" : "",
    xTestColoresAnormal,
    yTestColores
  );
  doc.text(datosFinales.testColoresNC ? "X" : "", xTestColoresNC, yTestColores);
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Estereopsia (coordenadas independientes)
  const xEstereopsiaNormal = margin + 106;
  const xEstereopsiaAnormal = margin + 135;
  const xEstereopsiaNC = margin + 164;
  const yEstereopsia = margin + 134.5;

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text(datosFinales.estereopsiaNormal ? "X" : "", xEstereopsiaNormal, yEstereopsia);
  doc.text(
    datosFinales.estereopsiaAnormal ? "X" : "",
    xEstereopsiaAnormal,
    yEstereopsia
  );
  doc.text(datosFinales.estereopsiaNC ? "X" : "", xEstereopsiaNC, yEstereopsia);
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Valor de Estereopsia en segundos
  const xEstereopsiaSegundos = margin + 65;
  doc.text(
    String(datosFinales.estereopsiaSegundos || ""),
    xEstereopsiaSegundos,
    yEstereopsia
  );

  // === REFRACCIÓN ===
  const xRefraccionAplica = margin + 55.5;
  const xRefraccionNoAplica = margin + 91.5;
  const yRefraccion = margin + 140.35;

  doc.setFont("helvetica", "bold").setFontSize(9);
  if (datosFinales.refraccionAplica) {
    doc.text("X", xRefraccionAplica, yRefraccion);
  }
  if (datosFinales.refraccionNoAplica) {
    doc.text("X", xRefraccionNoAplica, yRefraccion);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);

  // === REFRACCIÓN DE LEJOS ===
  const yRefraccionLejos = margin + 151;

  // OD (Ojo Derecho)
  const xRefraccionLejosODSF = margin + 33;
  const xRefraccionLejosODCIL = margin + 48.3;
  const xRefraccionLejosODEJE = margin + 65;
  const xRefraccionLejosODDIP = margin + 80;

  doc.text(
    String(datosFinales.refraccionLejosODSF || ""),
    xRefraccionLejosODSF,
    yRefraccionLejos
  );
  doc.text(
    String(datosFinales.refraccionLejosODCIL || ""),
    xRefraccionLejosODCIL,
    yRefraccionLejos
  );
  doc.text(
    String(datosFinales.refraccionLejosODEJE || ""),
    xRefraccionLejosODEJE,
    yRefraccionLejos
  );
  doc.text(
    String(datosFinales.refraccionLejosODDIP || ""),
    xRefraccionLejosODDIP,
    yRefraccionLejos
  );

  // OI (Ojo Izquierdo)
  const yRefraccionLejosOI = margin + 155;
  doc.text(
    String(datosFinales.refraccionLejosOISF || ""),
    xRefraccionLejosODSF,
    yRefraccionLejosOI
  );
  doc.text(
    String(datosFinales.refraccionLejosOICIL || ""),
    xRefraccionLejosODCIL,
    yRefraccionLejosOI
  );
  doc.text(
    String(datosFinales.refraccionLejosOIEJE || ""),
    xRefraccionLejosODEJE,
    yRefraccionLejosOI
  );
  doc.text(
    String(datosFinales.refraccionLejosOIDIP || ""),
    xRefraccionLejosODDIP,
    yRefraccionLejosOI
  );

  // === REFRACCIÓN DE CERCA ===
  const yRefraccionCerca = margin + 151;

  // OD (Ojo Derecho)
  const xRefraccionCercaODSF = margin + 120;
  const xRefraccionCercaODCIL = margin + 137;
  const xRefraccionCercaODEJE = margin + 149;
  const xRefraccionCercaODDIP = margin + 163;

  doc.text(
    String(datosFinales.refraccionCercaODSF || ""),
    xRefraccionCercaODSF,
    yRefraccionCerca
  );
  doc.text(
    String(datosFinales.refraccionCercaODCIL || ""),
    xRefraccionCercaODCIL,
    yRefraccionCerca
  );
  doc.text(
    String(datosFinales.refraccionCercaODEJE || ""),
    xRefraccionCercaODEJE,
    yRefraccionCerca
  );
  doc.text(
    String(datosFinales.refraccionCercaODDIP || ""),
    xRefraccionCercaODDIP,
    yRefraccionCerca
  );

  // OI (Ojo Izquierdo)
  const yRefraccionCercaOI = margin + 155;
  doc.text(
    String(datosFinales.refraccionCercaOISF || ""),
    xRefraccionCercaODSF,
    yRefraccionCercaOI
  );
  doc.text(
    String(datosFinales.refraccionCercaOICIL || ""),
    xRefraccionCercaODCIL,
    yRefraccionCercaOI
  );
  doc.text(
    String(datosFinales.refraccionCercaOIEJE || ""),
    xRefraccionCercaODEJE,
    yRefraccionCercaOI
  );
  doc.text(
    String(datosFinales.refraccionCercaOIDIP || ""),
    xRefraccionCercaODDIP,
    yRefraccionCercaOI
  );

  // === DIAGNÓSTICO ===
  const xDiagnostico = margin + 34.5;
  const yDiagnostico = margin + 174;

  doc.setFont("helvetica", "normal").setFontSize(8);

  doc.text(
    String(datosFinales.txtAvConRefraccionLejosOd ?? ""),
    xDiagnostico + 22,
    yDiagnostico - 5
  );
  doc.text(
    String(datosFinales.txtAvConRefraccionLejosOi ?? ""),
    xDiagnostico + 45,
    yDiagnostico - 5
  );
  doc.text(
    String(datosFinales.txtAvConRefraccionCercaOd ?? ""),
    xDiagnostico + 105,
    yDiagnostico - 5
  );
  doc.text(
    String(datosFinales.txtAvConRefraccionCercaOi ?? ""),
    xDiagnostico + 130,
    yDiagnostico - 5
  );
  doc.text(String(datosFinales.diagnostico || ""), xDiagnostico, yDiagnostico, {
    maxWidth: 150,
  });

  // === INDICADORES ===
  // Indicadores Generales
  const yIndicadoresGenerales = margin + 188;

  // Ninguna
  const xIndicadoresNinguna = margin + 41;
  doc.setFont("helvetica", "bold").setFontSize(9);
  if (datosFinales.indicadoresNinguna) {
    doc.text("X", xIndicadoresNinguna, yIndicadoresGenerales);
  }

  // Uso de Correctores Oculares
  const yIndicadoresUsoCorrectores = margin + 192.5;
  if (datosFinales.indicadoresUsoCorrectores) {
    doc.text("X", xIndicadoresNinguna, yIndicadoresUsoCorrectores);
  }

  // Control complementario por Oftalmología
  const yIndicadoresControl = margin + 197;
  if (datosFinales.indicadoresControlOftalmologia) {
    doc.text("X", xIndicadoresNinguna, yIndicadoresControl);
  }

  // Indicadores del lado derecho (Lejos y Cerca)
  // Variables para ajustar posición X e Y de cada indicador
  const xLejosGeneral = margin + 111.5; // AJUSTAR POSICIÓN X DE LEJOS AQUÍ
  const yLejosGeneral = margin + 192; // AJUSTAR ALTURA DE LEJOS AQUÍ
  const xCercaGeneral = margin + 141; // AJUSTAR POSICIÓN X DE CERCA AQUÍ
  const yCercaGeneral = margin + 192; // AJUSTAR ALTURA DE CERCA AQUÍ

  const xLentesCorrectores = margin + 120; // AJUSTAR POSICIÓN X DE LENTES CORRECTORES AQUÍ
  const yLentesCorrectores = margin + 197; // AJUSTAR ALTURA DE LENTES CORRECTORES AQUÍ

  const xLentesCerca = margin + 163.5; // AJUSTAR POSICIÓN X DE LENTES CERCA AQUÍ
  const yLentesCerca = margin + 197; // AJUSTAR ALTURA DE LENTES CERCA AQUÍ

  const xLentesLejos = margin + 178.5; // AJUSTAR POSICIÓN X DE LENTES LEJOS AQUÍ
  const yLentesLejos = margin + 197; // AJUSTAR ALTURA DE LENTES LEJOS AQUÍ

  const xCambioLunas = margin + 120; // AJUSTAR POSICIÓN X DE CAMBIO LUNAS AQUÍ
  const yCambioLunas = margin + 201.4; // AJUSTAR ALTURA DE CAMBIO LUNAS AQUÍ

  const xPterigion = margin + 120; // AJUSTAR POSICIÓN X DE PTERIGION AQUÍ
  const yPterigion = margin + 205.8; // AJUSTAR ALTURA DE PTERIGION AQUÍ

  const xOtras = margin + 120; // AJUSTAR POSICIÓN X DE OTRAS AQUÍ
  const yOtras = margin + 210; // AJUSTAR ALTURA DE OTRAS AQUÍ

  // Lejos
  if (datosFinales.indicadoresLejos) {
    doc.text("X", xLejosGeneral, yLejosGeneral);
  }

  // Cerca (Trabajo de Oficina)
  if (datosFinales.indicadoresCerca) {
    doc.text("X", xCercaGeneral, yCercaGeneral);
  }

  // Lentes Correctores
  if (datosFinales.indicadoresLentesCorrectores) {
    doc.text("X", xLentesCorrectores, yLentesCorrectores);
  }

  // Lentes Correctores - Cerca
  if (datosFinales.indicadoresLentesCorrectoresCerca) {
    doc.text("X", xLentesCerca, yLentesCerca);
  }

  // Lentes Correctores - Lejos
  if (datosFinales.indicadoresLentesCorrectoresLejos) {
    doc.text("X", xLentesLejos, yLentesLejos);
  }

  // Lentes: Cambio de Lunas
  if (datosFinales.indicadoresCambioLunas) {
    doc.text("X", xCambioLunas, yCambioLunas);
  }

  // Pterigion III° - IV°
  if (datosFinales.indicadoresPterigion) {
    doc.text("X", xPterigion, yPterigion);
  }

  // Otras
  if (datosFinales.indicadoresOtras) {
    doc.text("X", xOtras, yOtras);
  }

  doc.setFont("helvetica", "normal").setFontSize(9);

  // === INDICADORES DEL ENTORNO LABORAL ===
  // Indicadores del Entorno Laboral
  const yIndicadoresLaboral = margin + 220;

  // No restringe actividades laborales en el puesto de trabajo
  const xIndicadoresLaboralNinguna = margin + 41;
  if (datosFinales.indicadoresNoRestringe) {
    doc.text("X", xIndicadoresLaboralNinguna, yIndicadoresLaboral);
  }

  // Uso de Correctores Oculares
  const yIndicadoresLaboralCorrectores = margin + 228;
  if (datosFinales.indicadoresUsoCorrectoresLaboral) {
    doc.text("X", xIndicadoresLaboralNinguna, yIndicadoresLaboralCorrectores);
  }

  // No trabajos con cables eléctricos, ni fibra óptica
  const yIndicadoresLaboralCables = margin + 232.5;
  if (datosFinales.indicadoresNoCablesElectricos) {
    doc.text("X", xIndicadoresLaboralNinguna, yIndicadoresLaboralCables);
  }

  // No conducción Vehicular
  const yIndicadoresLaboralConduccion = margin + 236.5;
  if (datosFinales.indicadoresNoConduccion) {
    doc.text("X", xIndicadoresLaboralNinguna, yIndicadoresLaboralConduccion);
  }

  // Indicadores del lado derecho (Lejos y Cerca)
  // Variables para ajustar solo Lejos y Cerca
  const yLejos = margin + 220; // AJUSTAR ALTURA DE LEJOS AQUÍ
  const yCerca = margin + 224; // AJUSTAR ALTURA DE CERCA AQUÍ

  // Lejos
  const xIndicadoresLaboralLejos = margin + 120;
  if (datosFinales.indicadoresLejosLaboral) {
    doc.text("X", xIndicadoresLaboralLejos, yLejos);
  }

  // Cerca (Trabajos de Oficina)
  const xIndicadoresLaboralCerca = margin + 120;
  if (datosFinales.indicadoresCercaLaboral) {
    doc.text("X", xIndicadoresLaboralCerca, yCerca);
  }

  doc.setFont("helvetica", "normal").setFontSize(9);

  // Generar blob y abrir en iframe para imprimir automáticamente
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
  // Arreglo de firmas que quieres cargar
  const firmasAPintar = [
    { nombre: "FIRMAP", x: -23, y: 240, maxw: 120 },
    { nombre: "HUELLA", x: 10, y: 240, maxw: 100 },
    { nombre: "SELLOFIRMA", x: 50, y: 240, maxw: 120 },
    { nombre: "SELLOFIRMADOCASIG", x: 110, y: 240, maxw: 120 },
  ];
  agregarFirmas(doc, data.digitalizacion, firmasAPintar).then(() => {
    imprimir(doc);
  });
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
        let sigW = maxw;
        const sigH = 35;
        const baseX = x;
        const baseY = y;
        const maxW = sigW - 10;
        const maxH = sigH - 10;
        let imgW = img.width;
        let imgH = img.height;
        const scale = Math.min(maxW / imgW, maxH / imgH, 1);
        imgW *= scale;
        imgH *= scale;
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
