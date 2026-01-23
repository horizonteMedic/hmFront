import jsPDF from "jspdf";
import header_EvaluacionOftalmologica2021_Digitalizado_boro from "../headers/header_EvaluacionOftalmologica2021_Digitalizado_boro.jsx";

export default async function EvaluacionOftalmologica2021_Digitalizado_boro(
  data = {}, docExistente = null
) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();

  // 1) Header específico para Boro
  header_EvaluacionOftalmologica2021_Digitalizado_boro(doc, data);

  // Datos de prueba (solo para desarrollo)
  const datosPrueba = {
    // EXAMEN CLÍNICO EXTERNO (8 'X's IZQ)
    ptosisPalpebralOD: true,
    ptosisPalpebralOI: true,
    estrabismoOD: true,
    estrabismoOI: true,
    conjuntivitisOD: true,
    conjuntivitisOI: true,
    cataratasOD: true,
    cataratasOI: true,
    pterigionOD: true,
    pterigionOI: true,
    pingueculaOD: true,
    pingueculaOI: true,
    chalazionOD: true,
    chalazionOI: true,
    otrosOD: true,
    otrosOI: true,
    hallazgosExternos: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",

    // FONDO DE OJO (4 'X's DER)
    fondoNormalOD: true,
    fondoNormalOI: true,
    fondoAnormalOD: true,
    fondoAnormalOI: true,
    hallazgosFondo: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",

    // PIO (Presión Intraocular) (4 'X's DER)
    pioOD: "",
    pioOI: "",
    pioNoAplica: "",
    pioNormal: false,

    // AGUDEZA VISUAL
    correctoresOcularesSI: true,
    correctoresOcularesNO: true,
    ntxcCerca: true,
    ntxcLejos: true,
    ntcc: true,
    nctl: true,

    // Agudeza Visual Sin Correctores
    sinCorrectoresCercaOD: "20/40",
    sinCorrectoresCercaOI: "20/30",
    sinCorrectoresLejosOD: "20/50",
    sinCorrectoresLejosOI: "20/40",
    sinCorrectoresBinocular: "20/30",

    // Agudeza Visual Con Correctores
    conCorrectoresCercaOD: "20/20",
    conCorrectoresCercaOI: "20/20",
    conCorrectoresLejosOD: "20/25",
    conCorrectoresLejosOI: "20/25",
    conCorrectoresBinocular: "20/20",

    // Agudeza Visual Con Agujero Estenopeico
    conAgujeroCercaOD: "20/25",
    conAgujeroCercaOI: "20/25",
    conAgujeroLejosOD: "20/30",
    conAgujeroLejosOI: "20/30",
    conAgujeroBinocularOD: "20/25",
    conAgujeroBinocularOI: "20/25",

    // TEST DE EVALUACIÓN COMPLEMENTARIA
    testIshiharaNormal: true,
    testIshiharaAnormal: true,
    testIshiharaNC: true,

    testColoresNormal: true,
    testColoresAnormal: true,
    testColoresNC: true,

    estereopsiaNormal: true,
    estereopsiaAnormal: true,
    estereopsiaNC: true,
    estereopsiaSegundos: "40",

    // REFRACCIÓN
    refraccionAplica: true,
    refraccionNoAplica: true,

    // REFRACCIÓN DE LEJOS
    refraccionLejosODSF: "-1.50",
    refraccionLejosODCIL: "-0.75",
    refraccionLejosODEJE: "90",
    refraccionLejosODDIP: "1.50",
    refraccionLejosOISF: "-1.25",
    refraccionLejosOICIL: "-0.50",
    refraccionLejosOIEJE: "85",

    // REFRACCIÓN DE CERCA
    refraccionCercaODSF: "+1.00",
    refraccionCercaODCIL: "-0.25",
    refraccionCercaODEJE: "90",
    refraccionCercaODDIP: "1.00",
    refraccionCercaOISF: "+0.75",
    refraccionCercaOICIL: "-0.25",
    refraccionCercaOIEJE: "85",

    // DIAGNÓSTICO
    diagnostico:
      "MIOPÍA LEVE BILATERAL, PTERIGION GRADO 2 OD, CATARATA INICIAL OI",

    // INDICADORES
    // Indicadores Generales
    indicadoresNinguna: true,
    indicadoresUsoCorrectores: true,
    indicadoresControlOftalmologia: true,
    indicadoresLejos: true,
    indicadoresCerca: true,
    indicadoresLentesCorrectores: true,
    indicadoresLentesCorrectoresCerca: true,
    indicadoresLentesCorrectoresLejos: true,
    indicadoresCambioLunas: true,
    indicadoresPterigion: true,
    indicadoresOtras: true,

    // Indicadores Entorno Laboral
    indicadoresNoRestringe: true,
    indicadoresUsoCorrectoresLaboral: true,
    indicadoresNoCablesElectricos: true,
    indicadoresNoConduccion: true,
    indicadoresLejosLaboral: true,
    indicadoresCercaLaboral: true,
  };
  const obtenerString = (nombre) => {
    return data[nombre] ?? "";
  };

  const datosReales = {
    ptosisPalpebralOD: data.rbecPtosisOd,
    ptosisPalpebralOI: data.rbecPtosisOi,
    estrabismoOD: data.rbecEstrabismoOd,
    estrabismoOI: data.rbecEstrabismoOi,
    conjuntivitisOD: data.rbecConjuntivitisOd,
    conjuntivitisOI: data.rbecConjuntivitisOi,
    cataratasOD: data.rbecCataratasOd,
    cataratasOI: data.rbecCataratasOi,
    pterigionOD: data.rbecPterigionOd,
    pterigionOI: data.rbecPterigionOi,
    pingueculaOD: data.rbecPingueculaOd,
    pingueculaOI: data.rbecPingueculaOi,
    chalazionOD: data.rbecClalacionOd,
    chalazionOI: data.rbecClalacionOi,
    otrosOD: data.rbecOtrosOd,
    otrosOI: data.rbecOtrosOi,
    hallazgosExternos: obtenerString("txtecHallazgos"),

    // FONDO DE OJO (4 'X's DER)
    fondoNormalOD: data.rbfONormalOd,
    fondoNormalOI: data.rbfONormalOi,
    fondoAnormalOD: data.rbfOAnormalOd,
    fondoAnormalOI: data.rbfOAnormalOi,
    hallazgosFondo: data.txtFoHallazgos,

    // PIO (Presión Intraocular) (4 'X's DER)
    pioOD: obtenerString("txtPioOd"),
    pioOI: obtenerString("txtPioOi"),
    pioNoAplica: obtenerString("txtPioNa"),
    pioNormal: false,

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

    // REFRACCIÓN DE CERCA
    refraccionCercaODSF: obtenerString("txtCercaOdSf"),
    refraccionCercaODCIL: obtenerString("txtCercaOdCil"),
    refraccionCercaODEJE: obtenerString("txtCercaOdEje"),
    refraccionCercaODDIP: obtenerString("txtCercaOdDip"),
    refraccionCercaOISF: obtenerString("txtCercaOiSf"),
    refraccionCercaOICIL: obtenerString("txtCercaOiCil"),
    refraccionCercaOIEJE: obtenerString("txtCercaOiEje"),

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
  const fondoImg = "/img/Oftamo_digitalizado.png";
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
  const yCorrectores = margin + 102; // BAJADO 7.5 PUNTOS

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
  const yNTXC = margin + 102; // BAJADO 7.5 PUNTOS

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
  const yNTCC = margin + 102; // BAJADO 7.5 PUNTOS

  doc.setFont("helvetica", "bold").setFontSize(9);
  if (datosFinales.ntcc) {
    doc.text("X", xNTCC, yNTCC);
  }
  if (datosFinales.nctl) {
    doc.text("X", xNCTL, yNTCC);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Agudeza Visual - De Cerca (todos alineados horizontalmente)
  const yDeCerca = margin + 113.8; // BAJADO 7.5 PUNTOS

  // Sin Correctores
  const xSinCorrectoresCercaOD = margin + 55;
  const xSinCorrectoresCercaOI = margin + 75;
  doc.text(
    String(datosFinales.sinCorrectoresCercaOD ?? ""),
    xSinCorrectoresCercaOD,
    yDeCerca
  );
  doc.text(
    String(datosFinales.sinCorrectoresCercaOI ?? ""),
    xSinCorrectoresCercaOI,
    yDeCerca
  );

  // Con Correctores
  const xConCorrectoresCercaOD = margin + 98;
  const xConCorrectoresCercaOI = margin + 120;
  doc.text(
    String(datosFinales.conCorrectoresCercaOD ?? ""),
    xConCorrectoresCercaOD,
    yDeCerca
  );
  doc.text(
    String(datosFinales.conCorrectoresCercaOI ?? ""),
    xConCorrectoresCercaOI,
    yDeCerca
  );

  // Con Agujero Estenopeico
  const xConAgujeroCercaOD = margin + 142;
  const xConAgujeroCercaOI = margin + 162;
  doc.text(
    String(datosFinales.conAgujeroCercaOD ?? ""),
    xConAgujeroCercaOD,
    yDeCerca
  );
  doc.text(
    String(datosFinales.conAgujeroCercaOI ?? ""),
    xConAgujeroCercaOI,
    yDeCerca
  );

  // Agudeza Visual - De Lejos (todos alineados horizontalmente)
  const yDeLejos = margin + 117.5; // BAJADO 7.5 PUNTOS

  // Sin Correctores
  doc.text(
    String(datosFinales.sinCorrectoresLejosOD ?? ""),
    xSinCorrectoresCercaOD,
    yDeLejos
  );
  doc.text(
    String(datosFinales.sinCorrectoresLejosOI ?? ""),
    xSinCorrectoresCercaOI,
    yDeLejos
  );

  // Con Correctores
  doc.text(
    String(datosFinales.conCorrectoresLejosOD ?? ""),
    xConCorrectoresCercaOD,
    yDeLejos
  );
  doc.text(
    String(datosFinales.conCorrectoresLejosOI ?? ""),
    xConCorrectoresCercaOI,
    yDeLejos
  );

  // Con Agujero Estenopeico
  doc.text(
    String(datosFinales.conAgujeroLejosOD ?? ""),
    xConAgujeroCercaOD,
    yDeLejos
  );
  doc.text(
    String(datosFinales.conAgujeroLejosOI ?? ""),
    xConAgujeroCercaOI,
    yDeLejos
  );

  // Agudeza Visual - Binocular (Reev.) (solo un valor por sección)
  const yBinocular = margin + 120.8; // BAJADO 7.5 PUNTOS

  // Sin Correctores
  const xBinocularSinCorrectores = margin + 65.5; // Posición central
  doc.text(
    String(datosFinales.sinCorrectoresBinocular ?? ""),
    xBinocularSinCorrectores,
    yBinocular
  );

  // Con Correctores
  const xBinocularConCorrectores = margin + 108.5; // Posición central
  doc.text(
    String(datosFinales.conCorrectoresBinocular ?? ""),
    xBinocularConCorrectores,
    yBinocular
  );

  // Con Agujero Estenopeico (vacío)
  const xBinocularConAgujero = margin + 152; // Posición central
  doc.text(
    String(datosFinales.conAgujeroBinocularOD ?? ""),
    xBinocularConAgujero,
    yBinocular
  );

  // === EXAMEN CLÍNICO EXTERNO ===
  const xExamenExterno = margin + 15;

  // Variables independientes para cada 'X' - IZQUIERDA (8 'X's)
  // Ptosis Palpebral
  const xPtosisOD = margin + 44; // AJUSTAR POSICIÓN X DE PTOSIS OD AQUÍ
  const yPtosisOD = margin + 66; // AJUSTAR ALTURA DE PTOSIS OD AQUÍ
  const xPtosisOI = margin + 52; // AJUSTAR POSICIÓN X DE PTOSIS OI AQUÍ
  const yPtosisOI = margin + 66; // AJUSTAR ALTURA DE PTOSIS OI AQUÍ

  // Estrabismo
  const xEstrabismoOD = margin + 44; // AJUSTAR POSICIÓN X DE ESTRABISMO OD AQUÍ
  const yEstrabismoOD = margin + 70; // AJUSTAR ALTURA DE ESTRABISMO OD AQUÍ
  const xEstrabismoOI = margin + 52; // AJUSTAR POSICIÓN X DE ESTRABISMO OI AQUÍ
  const yEstrabismoOI = margin + 70; // AJUSTAR ALTURA DE ESTRABISMO OI AQUÍ

  // Conjuntivitis
  const xConjuntivitisOD = margin + 44; // AJUSTAR POSICIÓN X DE CONJUNTIVITIS OD AQUÍ
  const yConjuntivitisOD = margin + 73.6; // AJUSTAR ALTURA DE CONJUNTIVITIS OD AQUÍ
  const xConjuntivitisOI = margin + 52; // AJUSTAR POSICIÓN X DE CONJUNTIVITIS OI AQUÍ
  const yConjuntivitisOI = margin + 73.6; // AJUSTAR ALTURA DE CONJUNTIVITIS OI AQUÍ

  // Cataratas
  const xCataratasOD = margin + 44; // AJUSTAR POSICIÓN X DE CATARATAS OD AQUÍ
  const yCataratasOD = margin + 77.5; // AJUSTAR ALTURA DE CATARATAS OD AQUÍ
  const xCataratasOI = margin + 52; // AJUSTAR POSICIÓN X DE CATARATAS OI AQUÍ - CAMBIAR ESTE VALOR
  const yCataratasOI = margin + 77.5; // AJUSTAR ALTURA DE CATARATAS OI AQUÍ - CAMBIAR ESTE VALOR

  // Pterigion
  const xPterigionOD = margin + 96; // AJUSTAR POSICIÓN X DE PTERIGION OD AQUÍ
  const yPterigionOD = margin + 66; // AJUSTAR ALTURA DE PTERIGION OD AQUÍ
  const xPterigionOI = margin + 104; // AJUSTAR POSICIÓN X DE PTERIGION OI AQUÍ
  const yPterigionOI = margin + 66; // AJUSTAR ALTURA DE PTERIGION OI AQUÍ

  // Pinguécula
  const xPingueculaOD = margin + 96; // AJUSTAR POSICIÓN X DE PINGUECULA OD AQUÍ
  const yPingueculaOD = margin + 70; // AJUSTAR ALTURA DE PINGUECULA OD AQUÍ
  const xPingueculaOI = margin + 104; // AJUSTAR POSICIÓN X DE PINGUECULA OI AQUÍ
  const yPingueculaOI = margin + 70; // AJUSTAR ALTURA DE PINGUECULA OI AQUÍ

  // Chalazion
  const xChalazionOD = margin + 96; // AJUSTAR POSICIÓN X DE CHALAZION OD AQUÍ
  const yChalazionOD = margin + 73.5; // AJUSTAR ALTURA DE CHALAZION OD AQUÍ
  const xChalazionOI = margin + 104; // AJUSTAR POSICIÓN X DE CHALAZION OI AQUÍ
  const yChalazionOI = margin + 73.5; // AJUSTAR ALTURA DE CHALAZION OI AQUÍ

  // Otros
  const xOtrosOD = margin + 96; // AJUSTAR POSICIÓN X DE OTROS OD AQUÍ
  const yOtrosOD = margin + 77.5; // AJUSTAR ALTURA DE OTROS OD AQUÍ
  const xOtrosOI = margin + 104; // AJUSTAR POSICIÓN X DE OTROS OI AQUÍ
  const yOtrosOI = margin + 77.5; // AJUSTAR ALTURA DE OTROS OI AQUÍ

  // Renderizar 'X's de la IZQUIERDA
  doc.setFont("helvetica", "bold").setFontSize(9);
  if (datosFinales.ptosisPalpebralOD) {
    doc.text("X", xPtosisOD, yPtosisOD);
  }
  if (datosFinales.ptosisPalpebralOI) {
    doc.text("X", xPtosisOI, yPtosisOI);
  }
  if (datosFinales.estrabismoOD) {
    doc.text("X", xEstrabismoOD, yEstrabismoOD);
  }
  if (datosFinales.estrabismoOI) {
    doc.text("X", xEstrabismoOI, yEstrabismoOI);
  }
  if (datosFinales.conjuntivitisOD) {
    doc.text("X", xConjuntivitisOD, yConjuntivitisOD);
  }
  if (datosFinales.conjuntivitisOI) {
    doc.text("X", xConjuntivitisOI, yConjuntivitisOI);
  }
  if (datosFinales.cataratasOD) {
    doc.text("X", xCataratasOD, yCataratasOD);
  }
  if (datosFinales.cataratasOI) {
    doc.text("X", xCataratasOI, yCataratasOI);
  }
  if (datosFinales.pterigionOD) {
    doc.text("X", xPterigionOD, yPterigionOD);
  }
  if (datosFinales.pterigionOI) {
    doc.text("X", xPterigionOI, yPterigionOI);
  }
  if (datosFinales.pingueculaOD) {
    doc.text("X", xPingueculaOD, yPingueculaOD);
  }
  if (datosFinales.pingueculaOI) {
    doc.text("X", xPingueculaOI, yPingueculaOI);
  }
  if (datosFinales.chalazionOD) {
    doc.text("X", xChalazionOD, yChalazionOD);
  }
  if (datosFinales.chalazionOI) {
    doc.text("X", xChalazionOI, yChalazionOI);
  }
  if (datosFinales.otrosOD) {
    doc.text("X", xOtrosOD, yOtrosOD);
  }
  if (datosFinales.otrosOI) {
    doc.text("X", xOtrosOI, yOtrosOI);
  }
  doc.setFont("helvetica", "normal").setFontSize(8);

  // Hallazgos Externos
  const yHallazgosExternos = margin + 83.5;
  doc.text(
    String(datosFinales.hallazgosExternos ?? ""),
    xExamenExterno + 28,
    yHallazgosExternos,
    { maxWidth: 75 }
  );

  // === FONDO DE OJO Y PIO ===
  // Variables independientes para cada 'X' - DERECHA (8 'X's)

  // FONDO DE OJO
  // Normal
  const xFondoNormalOD = margin + 173; // AJUSTAR POSICIÓN X DE FONDO NORMAL OD AQUÍ
  const yFondoNormalOD = margin + 65.8; // AJUSTAR ALTURA DE FONDO NORMAL OD AQUÍ
  const xFondoNormalOI = margin + 180; // AJUSTAR POSICIÓN X DE FONDO NORMAL OI AQUÍ
  const yFondoNormalOI = margin + 65.8; // AJUSTAR ALTURA DE FONDO NORMAL OI AQUÍ

  // Anormal
  const xFondoAnormalOD = margin + 173; // AJUSTAR POSICIÓN X DE FONDO ANORMAL OD AQUÍ
  const yFondoAnormalOD = margin + 69.5; // AJUSTAR ALTURA DE FONDO ANORMAL OD AQUÍ
  const xFondoAnormalOI = margin + 180; // AJUSTAR POSICIÓN X DE FONDO ANORMAL OI AQUÍ
  const yFondoAnormalOI = margin + 69.5; // AJUSTAR ALTURA DE FONDO ANORMAL OI AQUÍ

  // PIO (Presión Intraocular)
  const xPioOD = margin + 150; // AJUSTAR POSICIÓN X DE PIO OD AQUÍ
  const yPioOD = margin + 90; // AJUSTAR ALTURA DE PIO OD AQUÍ
  const xPioOI = margin + 165; // AJUSTAR POSICIÓN X DE PIO OI AQUÍ
  const yPioOI = margin + 90; // AJUSTAR ALTURA DE PIO OI AQUÍ
  const xPioNoAplica = margin + 174; // AJUSTAR POSICIÓN X DE PIO NO APLICA AQUÍ
  const yPioNoAplica = margin + 90; // AJUSTAR ALTURA DE PIO NO APLICA AQUÍ
  const xPioNormal = margin + 115; // AJUSTAR POSICIÓN X DE PIO NORMAL AQUÍ
  const yPioNormal = margin + 90; // AJUSTAR ALTURA DE PIO NORMAL AQUÍ

  // Agregar texto OD, OI, APLICA en la primera fila
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("OD", xPioOD, yPioOD - 6);
  doc.text("OI", xPioOI, yPioOI - 6);
  doc.text("No Aplica", xPioNoAplica, yPioNoAplica - 6);

  // Renderizar 'X's de la DERECHA
  doc.setFont("helvetica", "bold").setFontSize(9);
  if (datosFinales.fondoNormalOD) {
    doc.text("X", xFondoNormalOD, yFondoNormalOD);
  }
  if (datosFinales.fondoNormalOI) {
    doc.text("X", xFondoNormalOI, yFondoNormalOI);
  }
  if (datosFinales.fondoAnormalOD) {
    doc.text("X", xFondoAnormalOD, yFondoAnormalOD);
  }
  if (datosFinales.fondoAnormalOI) {
    doc.text("X", xFondoAnormalOI, yFondoAnormalOI);
  }

  doc.setFont("helvetica", "normal").setFontSize(6);
  doc.text(`${datosFinales.pioOD ?? ""}`, xPioOD, yPioOD);
  doc.text(`${datosFinales.pioOI ?? ""}`, xPioOI, yPioOI);
  doc.text(`${datosFinales.pioNoAplica ?? ""}`, xPioNoAplica, yPioNoAplica);
  doc.setFont("helvetica", "normal").setFontSize(8);

  // Hallazgos Fondo
  const yHallazgosFondo = margin + 75.5;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(
    String(datosFinales.hallazgosFondo ?? ""),
    margin + 141.8,
    yHallazgosFondo,
    { maxWidth: 42 }
  );

  // === TEST DE EVALUACIÓN COMPLEMENTARIA ===
  // Test de Ishihara (Colores)
  const xTestIshiharaNormal = margin + 106;
  const xTestIshiharaAnormal = margin + 135;
  const xTestIshiharaNC = margin + 164;
  const yTestIshihara = margin + 130;

  doc.setFont("helvetica", "bold").setFontSize(9);
  if (datosFinales.testIshiharaNormal) {
    doc.text("X", xTestIshiharaNormal, yTestIshihara);
  }
  if (datosFinales.testIshiharaAnormal) {
    doc.text("X", xTestIshiharaAnormal, yTestIshihara);
  }
  if (datosFinales.testIshiharaNC) {
    doc.text("X", xTestIshiharaNC, yTestIshihara);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Test de Colores Puros (Rojo-Amarillo-Verde)
  const xTestColoresNormal = margin + 106;
  const xTestColoresAnormal = margin + 135;
  const xTestColoresNC = margin + 164;
  const yTestColores = margin + 134.5;

  doc.setFont("helvetica", "bold").setFontSize(9);
  if (datosFinales.testColoresNormal) {
    doc.text("X", xTestColoresNormal, yTestColores);
  }
  if (datosFinales.testColoresAnormal) {
    doc.text("X", xTestColoresAnormal, yTestColores);
  }
  if (datosFinales.testColoresNC) {
    doc.text("X", xTestColoresNC, yTestColores);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Estereopsia (Test Profundidad)
  const xEstereopsiaNormal = margin + 106;
  const xEstereopsiaAnormal = margin + 135;
  const xEstereopsiaNC = margin + 164;
  const yEstereopsia = margin + 139;

  doc.setFont("helvetica", "bold").setFontSize(9);
  if (datosFinales.estereopsiaNormal) {
    doc.text("X", xEstereopsiaNormal, yEstereopsia);
  }
  if (datosFinales.estereopsiaAnormal) {
    doc.text("X", xEstereopsiaAnormal, yEstereopsia);
  }
  if (datosFinales.estereopsiaNC) {
    doc.text("X", xEstereopsiaNC, yEstereopsia);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Valor de Estereopsia en segundos
  const xEstereopsiaSegundos = margin + 63;
  doc.text(
    String(datosFinales.estereopsiaSegundos ?? ""),
    xEstereopsiaSegundos,
    yEstereopsia - 1
  );

  // === REFRACCIÓN ===
  const xRefraccionAplica = margin + 55.5;
  const xRefraccionNoAplica = margin + 91.5;
  const yRefraccion = margin + 144.35;

  doc.setFont("helvetica", "bold").setFontSize(9);
  if (datosFinales.refraccionAplica) {
    doc.text("X", xRefraccionAplica, yRefraccion);
  }
  if (datosFinales.refraccionNoAplica) {
    doc.text("X", xRefraccionNoAplica, yRefraccion);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);

  // === REFRACCIÓN DE LEJOS ===
  const yRefraccionLejos = margin + 155;

  // OD (Ojo Derecho)
  const xRefraccionLejosODSF = margin + 33;
  const xRefraccionLejosODCIL = margin + 48.3;
  const xRefraccionLejosODEJE = margin + 65;
  const xRefraccionLejosODDIP = margin + 78;
  const yRefraccionLejosODDIP = margin + 156; // Posición Y específica para DIP

  doc.text(
    String(datosFinales.refraccionLejosODSF ?? ""),
    xRefraccionLejosODSF,
    yRefraccionLejos
  );
  doc.text(
    String(datosFinales.refraccionLejosODCIL ?? ""),
    xRefraccionLejosODCIL,
    yRefraccionLejos
  );
  doc.text(
    String(datosFinales.refraccionLejosODEJE ?? ""),
    xRefraccionLejosODEJE,
    yRefraccionLejos
  );
  doc.text(
    String(datosFinales.refraccionLejosODDIP ?? ""),
    xRefraccionLejosODDIP,
    yRefraccionLejosODDIP,
    { textAlign: 'center' }
  );

  // OI (Ojo Izquierdo)
  const yRefraccionLejosOI = margin + 158.3;
  doc.text(
    String(datosFinales.refraccionLejosOISF ?? ""),
    xRefraccionLejosODSF,
    yRefraccionLejosOI
  );
  doc.text(
    String(datosFinales.refraccionLejosOICIL ?? ""),
    xRefraccionLejosODCIL,
    yRefraccionLejosOI
  );
  doc.text(
    String(datosFinales.refraccionLejosOIEJE ?? ""),
    xRefraccionLejosODEJE,
    yRefraccionLejosOI
  );

  // === REFRACCIÓN DE CERCA ===
  const yRefraccionCerca = margin + 155;

  // OD (Ojo Derecho)
  const xRefraccionCercaODSF = margin + 120;
  const xRefraccionCercaODCIL = margin + 137;
  const xRefraccionCercaODEJE = margin + 149;
  const xRefraccionCercaODDIP = margin + 165;
  const yRefraccionCercaODDIP = margin + 156; // Posición Y específica para DIP

  doc.text(
    String(datosFinales.refraccionCercaODSF ?? ""),
    xRefraccionCercaODSF,
    yRefraccionCerca
  );
  doc.text(
    String(datosFinales.refraccionCercaODCIL ?? ""),
    xRefraccionCercaODCIL,
    yRefraccionCerca
  );
  doc.text(
    String(datosFinales.refraccionCercaODEJE ?? ""),
    xRefraccionCercaODEJE,
    yRefraccionCerca
  );
  doc.text(
    String(datosFinales.refraccionCercaODDIP ?? ""),
    xRefraccionCercaODDIP,
    yRefraccionCercaODDIP,
    { textAlign: 'center' }
  );

  // OI (Ojo Izquierdo)
  const yRefraccionCercaOI = margin + 158.3;
  doc.text(
    String(datosFinales.refraccionCercaOISF ?? ""),
    xRefraccionCercaODSF,
    yRefraccionCercaOI
  );
  doc.text(
    String(datosFinales.refraccionCercaOICIL ?? ""),
    xRefraccionCercaODCIL,
    yRefraccionCercaOI
  );
  doc.text(
    String(datosFinales.refraccionCercaOIEJE ?? ""),
    xRefraccionCercaODEJE,
    yRefraccionCercaOI
  );

  // === DIAGNÓSTICO ===
  const xDiagnostico = margin + 34.5;
  const yDiagnostico = margin + 177.5;

  doc.setFont("helvetica", "normal").setFontSize(8);

  doc.text(
    String(datosFinales.txtAvConRefraccionLejosOd ?? ""),
    xDiagnostico + 21,
    yDiagnostico - 7
  );
  doc.text(
    String(datosFinales.txtAvConRefraccionLejosOi ?? ""),
    xDiagnostico + 43,
    yDiagnostico - 7
  );
  doc.text(
    String(datosFinales.txtAvConRefraccionCercaOd ?? ""),
    xDiagnostico + 105,
    yDiagnostico - 7
  );
  doc.text(
    String(datosFinales.txtAvConRefraccionCercaOi ?? ""),
    xDiagnostico + 128,
    yDiagnostico - 7
  );
  doc.text(String(datosFinales.diagnostico ?? ""), xDiagnostico, yDiagnostico, {
    maxWidth: 150,
  });

  // === INDICADORES ===
  // Indicadores Generales
  const yIndicadoresGenerales = margin + 190;

  // Ninguna
  const xIndicadoresNinguna = margin + 41;
  doc.setFont("helvetica", "bold").setFontSize(9);
  if (datosFinales.indicadoresNinguna) {
    doc.text("X", xIndicadoresNinguna, yIndicadoresGenerales);
  }

  // Uso de Correctores Oculares
  const yIndicadoresUsoCorrectores = margin + 194.5;
  if (datosFinales.indicadoresUsoCorrectores) {
    doc.text("X", xIndicadoresNinguna, yIndicadoresUsoCorrectores);
  }

  // Control complementario por Oftalmología
  const yIndicadoresControl = margin + 199;
  if (datosFinales.indicadoresControlOftalmologia) {
    doc.text("X", xIndicadoresNinguna, yIndicadoresControl);
  }

  // Indicadores del lado derecho (Lejos y Cerca)
  // Variables para ajustar posición X e Y de cada indicador
  const xLejosGeneral = margin + 111.5; // AJUSTAR POSICIÓN X DE LEJOS AQUÍ
  const yLejosGeneral = margin + 194; // AJUSTAR ALTURA DE LEJOS AQUÍ
  const xCercaGeneral = margin + 141; // AJUSTAR POSICIÓN X DE CERCA AQUÍ
  const yCercaGeneral = margin + 194; // AJUSTAR ALTURA DE CERCA AQUÍ

  const xLentesCorrectores = margin + 120; // AJUSTAR POSICIÓN X DE LENTES CORRECTORES AQUÍ
  const yLentesCorrectores = margin + 199; // AJUSTAR ALTURA DE LENTES CORRECTORES AQUÍ

  const xLentesCerca = margin + 163.5; // AJUSTAR POSICIÓN X DE LENTES CERCA AQUÍ
  const yLentesCerca = margin + 199; // AJUSTAR ALTURA DE LENTES CERCA AQUÍ

  const xLentesLejos = margin + 178.5; // AJUSTAR POSICIÓN X DE LENTES LEJOS AQUÍ
  const yLentesLejos = margin + 199; // AJUSTAR ALTURA DE LENTES LEJOS AQUÍ

  const xCambioLunas = margin + 120; // AJUSTAR POSICIÓN X DE CAMBIO LUNAS AQUÍ
  const yCambioLunas = margin + 203.4; // AJUSTAR ALTURA DE CAMBIO LUNAS AQUÍ

  const xPterigion = margin + 120; // AJUSTAR POSICIÓN X DE PTERIGION AQUÍ
  const yPterigion = margin + 207.8; // AJUSTAR ALTURA DE PTERIGION AQUÍ

  const xOtras = margin + 120; // AJUSTAR POSICIÓN X DE OTRAS AQUÍ
  const yOtras = margin + 212; // AJUSTAR ALTURA DE OTRAS AQUÍ

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

  doc.setFont("helvetica", "bold").setFontSize(9);

  // === INDICADORES DEL ENTORNO LABORAL ===
  // Indicadores del Entorno Laboral
  const yIndicadoresLaboral = margin + 221;

  // No restringe actividades laborales en el puesto de trabajo
  const xIndicadoresLaboralNinguna = margin + 41.5;
  if (datosFinales.indicadoresNoRestringe) {
    doc.text("X", xIndicadoresLaboralNinguna, yIndicadoresLaboral);
  }

  // Uso de Correctores Oculares
  const yIndicadoresLaboralCorrectores = margin + 226;
  if (datosFinales.indicadoresUsoCorrectoresLaboral) {
    doc.text("X", xIndicadoresLaboralNinguna, yIndicadoresLaboralCorrectores);
  }

  // No trabajos con cables eléctricos, ni fibra óptica
  const yIndicadoresLaboralCables = margin + 234.5;
  if (datosFinales.indicadoresNoCablesElectricos) {
    doc.text("X", xIndicadoresLaboralNinguna, yIndicadoresLaboralCables);
  }

  // No conducción Vehicular
  const yIndicadoresLaboralConduccion = margin + 238.5;
  if (datosFinales.indicadoresNoConduccion) {
    doc.text("X", xIndicadoresLaboralNinguna, yIndicadoresLaboralConduccion);
  }

  // Indicadores del lado derecho (Lejos y Cerca)
  // Variables para ajustar solo Lejos y Cerca
  const yLejos = margin + 226; // AJUSTAR ALTURA DE LEJOS AQUÍ
  const yCerca = margin + 230; // AJUSTAR ALTURA DE CERCA AQUÍ

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
  const firmasAPintar = [
    { nombre: "FIRMAP", x: -23, y: 235, maxw: 120 },
    { nombre: "HUELLA", x: 10, y: 235, maxw: 100 },
    { nombre: "SELLOFIRMA", x: 40, y: 235, maxw: 120 },
    { nombre: "SELLOFIRMADOCASIG", x: 100, y: 235, maxw: 150 },
  ];
  await agregarFirmas(doc, data.digitalizacion, firmasAPintar)

  if (docExistente) {
    return doc;
  } else {
    imprimir(doc);
  }
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
