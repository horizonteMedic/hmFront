import jsPDF from "jspdf";

export default function FichaAntecedentePatologico(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Datos de prueba por defecto
  const datosPrueba = {
    apellidosNombres: "CASTILLO PLASENCIA HADY KATHERINE",
    fechaExamen: "04/11/2024",
    sexo: "F",
    documentoIdentidad: "72384273",
    edad: "31 años",
    areaTrabajo: "MINERÍA",
    puestoTrabajo: "DAD",
    empresa: "MINERA BOROO MISQUICHILCA S.A.",
    contrata: "CONTRATA"
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
    empresa: data.empresa || datosPrueba.empresa,
    contrata: data.contrata || datosPrueba.contrata,
    antecedentesQuirurgicos: data.antecedentesQuirurgicos || []
  } : datosPrueba;

  // === HEADER ===
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("FICHA DE ANTECEDENTES PATOLOGICOS", pageW / 2, 26, { align: "center" });

  // === FECHA DE EXAMEN ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Fecha Examen: " + datosFinales.fechaExamen, 15, 30);

  // === DATOS PERSONALES ===
  const datosPersonales = [
    { label: "Apellidos y Nombres:", value: datosFinales.apellidosNombres, x: 15, y: 40 },
    { label: "Fecha de Examen:", value: datosFinales.fechaExamen, x: 15, y: 45 },
    { label: "Sexo:", value: datosFinales.sexo, x: 15, y: 50 },
    { label: "DNI:", value: datosFinales.documentoIdentidad, x: 15, y: 55 },
    { label: "Edad:", value: datosFinales.edad, x: 15, y: 60 },
    { label: "Área de Trabajo:", value: datosFinales.areaTrabajo, x: 15, y: 65 },
    { label: "Puesto de Trabajo:", value: datosFinales.puestoTrabajo, x: 15, y: 70 },
    { label: "Empresa:", value: datosFinales.empresa, x: 15, y: 75 },
    { label: "Contrata:", value: datosFinales.contrata, x: 15, y: 80 }
  ];

  datosPersonales.forEach(item => {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(item.label, item.x, item.y);
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(item.value, item.x + 60, item.y);
  });

  // === ANTECEDENTES PATOLÓGICOS PERSONALES ===
  // Marco único para toda la sección
  const marcoInicioY = 92;
  const marcoFinY = 182;
  const marcoInicioX = 15;
  const marcoFinX = 200;
  
  // Marco rectangular principal que encierra todo
  doc.rect(marcoInicioX, marcoInicioY, marcoFinX - marcoInicioX, marcoFinY - marcoInicioY);
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("1. Antecedentes Patologicos Personales:", 15, 90);
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Marcar con una X las Enfermedades que han tenido o tienen:", 20, 95);

  // Listas de enfermedades por columna
  const col1 = [
    { texto: "Alergias", campo: "alergias" },
    { texto: "Amigdalitis Crónica", campo: "amigdalitisCronica" },
    { texto: "Arritmias Cardiacas", campo: "arritmiasCardiacas" },
    { texto: "Asma", campo: "asma" },
    { texto: "Bocio", campo: "bocio" },
    { texto: "Bronconeumonia", campo: "bronconeumonia" },
    { texto: "Bronquitis a Repeticion", campo: "bronquitisRepeticion" },
    { texto: "Caries o Gingivitis", campo: "cariesGingivitis" },
    { texto: "Colecistitis", campo: "colecistitis" },
    { texto: "Dermatitis", campo: "dermatitis" },
    { texto: "Diabetes", campo: "diabetes" },
    { texto: "Disenteria", campo: "disenteria" },
    { texto: "Enfermedades del corazon", campo: "enfermedadesCorazon" },
    { texto: "Enf. Oculares", campo: "enfermedadesOculares" },
    { texto: "Epilepsia o convulsiones", campo: "epilepsiaConvulsiones" },
    { texto: "Faringitis crónica", campo: "faringitisCronica" },
    { texto: "Fiebre Alta", campo: "fiebreAlta" },
    { texto: "Fiebre Tifoidea", campo: "fiebreTifoidea" },
    { texto: "Fiebre Reumatica", campo: "fiebreReumatica" },
    { texto: "Forunculosis", campo: "forunculosis" },
    { texto: "COVID 19", campo: "covid19" }
  ];

  const col2 = [
    { texto: "Gastritis Cronica", campo: "gastritisCronica" },
    { texto: "Gonorrea", campo: "gonorrea" },
    { texto: "Gota", campo: "gota" },
    { texto: "Hemorroides", campo: "hemorroides" },
    { texto: "Hepatitis", campo: "hepatitis" },
    { texto: "Hernias", campo: "hernias" },
    { texto: "Hipertensión Arterial", campo: "hipertensionArterial" },
    { texto: "Inf. Urinarias repetidas", campo: "infeccionesUrinarias" },
    { texto: "Intoxicaciones", campo: "intoxicaciones" },
    { texto: "Insuficiencia Cardiaca", campo: "insuficienciaCardiaca" },
    { texto: "Insuficiencia Coronaria Crónica", campo: "insuficienciaCoronaria" },
    { texto: "Insuficiencia Renal Crónica", campo: "insuficienciaRenal" },
    { texto: "Litiasis Urinaria", campo: "litiasisUrinaria" },
    { texto: "Meningitis", campo: "meningitis" },
    { texto: "Neuritis a Repeticion", campo: "neuritisRepeticion" },
    { texto: "Otitis Media", campo: "otitisMedia" },
    { texto: "Presion Alta o Baja", campo: "presionAltaBaja" },
    { texto: "Paludismo o Malaria", campo: "paludismoMalaria" },
    { texto: "Parasitosis Intestinal", campo: "parasitosisIntestinal" },
    { texto: "Parotiditis", campo: "parotiditis" }
  ];

  const col3 = [
    { texto: "Pleuresía", campo: "pleuresia" },
    { texto: "Plunbismo", campo: "plunbismo" },
    { texto: "Poliomielitis", campo: "poliomielitis" },
    { texto: "Portador de Marcapaso", campo: "portadorMarcapaso" },
    { texto: "Prótesis Cardiacas Valvulares", campo: "protesisCardiacas" },
    { texto: "Resfríos Frecuentes", campo: "resfriosFrecuentes" },
    { texto: "Reumatismo a Repetición", campo: "reumatismoRepeticion" },
    { texto: "Sarampion", campo: "sarampion" },
    { texto: "Sífilis", campo: "sifilis" },
    { texto: "Silicosis", campo: "silicosis" },
    { texto: "Sinusitis Crónica", campo: "sinusitisCronica" },
    { texto: "Tos Convulsiva", campo: "tosConvulsiva" },
    { texto: "Transtorno Nerviosos", campo: "transtornoNerviosos" },
    { texto: "Traumatismo Encefalocraneano", campo: "traumatismoEncefalocraneano" },
    { texto: "Tuberculosis", campo: "tuberculosis" },
    { texto: "Tumores_Quistes", campo: "tumoresQuistes" },
    { texto: "Úlcera Peptica", campo: "ulceraPeptica" },
    { texto: "Varicela", campo: "varicela" },
    { texto: "Várices", campo: "varices" },
    { texto: "Varicoceles", campo: "varicoceles" }
  ];

  // Configuración de posiciones
  const startY = 100;
  const stepY = 4;
  const posicionesX = [20, 80, 140]; // 3 columnas

  // Generar lista con coordenadas automáticas
  const enfermedades = [];
  [col1, col2, col3].forEach((col, colIndex) => {
    col.forEach((enfermedad, i) => {
      enfermedades.push({
        ...enfermedad,
        x: posicionesX[colIndex],
        y: startY + i * stepY
      });
    });
  });

  // Datos de prueba para algunas enfermedades marcadas
  const enfermedadesMarcadas = {
    hepatitis: true,
    meningitis: true,
    covid19: true
  };

  // Datos de severidad para COVID 19
  const severidadCovid = {
    leve: true,
    moderado: true,
    severo: true
  };

  // Datos de prueba para hábitos nocivos
  const habitosNosivosMarcados = {
    fumar: true,
    numeroCigarrillos: "20 cigarrillos diarios",
    licor: true,
    tipoLicor: "Cerveza y Whisky",
    frecuenciaLicor: "3-4 veces por semana",
    drogas: true,
    tipoDrogas: "Marihuana y Cocaína",
    frecuenciaDrogas: "Ocasionalmente (fines de semana)",
    otros: false,
    tipoOtros: "—",
    frecuenciaOtros: "—"
  };

  // Renderizar en PDF
  enfermedades.forEach(enfermedad => {
    // Texto
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(enfermedad.texto, enfermedad.x, enfermedad.y);

    // Checkbox
    const checkboxX = enfermedad.x + 50;
    const checkboxY = enfermedad.y - 2;
    doc.rect(checkboxX, checkboxY, 3, 3);

    // Marcar si corresponde
    if (enfermedadesMarcadas[enfermedad.campo]) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.setTextColor(255, 0, 0); // rojo
      doc.text("X", checkboxX + 0.4, checkboxY + 2.73);
      doc.setTextColor(0, 0, 0);   // reset
    }
  });
// === SEVERIDAD Y FECHA ===
doc.setFont("helvetica", "bold").setFontSize(9);
doc.text("Fecha :", 80, 180);
doc.setFont("helvetica", "normal").setFontSize(9);
doc.text("15/12/2024", 95, 180);

// LEVE
doc.setFont("helvetica", "bold").setFontSize(9);
doc.text("LEVE (   )", 120, 180);
if (severidadCovid.leve) {
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.setTextColor(255, 0, 0);
  doc.text("X", 130.5, 180.2); // coordenada dentro del paréntesis
  doc.setTextColor(0, 0, 0);
}

// MODERADO
doc.setFont("helvetica", "bold").setFontSize(9);
doc.text("MODERADO (   )", 140, 180);
if (severidadCovid.moderado) {
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.setTextColor(255, 0, 0);
  doc.text("X",161, 180.2); // ajustar dentro del (   )
  doc.setTextColor(0, 0, 0);
}

// SEVERO
doc.setFont("helvetica", "bold").setFontSize(9);
doc.text("SEVERO (   )", 172, 180);
if (severidadCovid.severo) {
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.setTextColor(255, 0, 0);
  doc.text("X", 187.4, 180.2); // dentro del (   )
  doc.setTextColor(0, 0, 0);
}

  // === SÍNTOMAS FRECUENTES ===
  // Marco para la sección de síntomas
  const sintomasMarcoInicioY = 183.5;
  const sintomasMarcoFinY = 230;
  const sintomasMarcoInicioX = 15;
  const sintomasMarcoFinX = 200;
  
  // Marco rectangular para síntomas
  doc.rect(sintomasMarcoInicioX, sintomasMarcoInicioY, sintomasMarcoFinX - sintomasMarcoInicioX, sintomasMarcoFinY - sintomasMarcoInicioY);
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Indicar las enfermedades que ha tenido o tiene, con mucha frecuencia:", 20, 187);

// Listas de síntomas por columna
const sintomasCol1 = [
  { texto: "Pérdida de Memoria", campo: "perdidaMemoria" },
  { texto: "Preocupaciones o Angustia", campo: "preocupacionesAngustia" },
  { texto: "Dolores Articulares y/o Huesos", campo: "doloresArticulares" },
  { texto: "Aumento o Disminución de Peso", campo: "aumentoDisminucionPeso" },
  { texto: "Dolor de Cabeza", campo: "dolorCabeza" },
  { texto: "Diarrea", campo: "diarrea" },
  { texto: "Agitación al Hacer Ejercicios", campo: "agitacionEjercicios" },
  { texto: "Dolor Ocular", campo: "dolorOcular" },
  { texto: "Dolor opresivo Tórax", campo: "dolorOpresivoTorax" },
  { texto: "Hinchazón de pies o manos", campo: "hinchazonPiesManos" },
];

const sintomasCol2 = [
  { texto: "Estreñimiento", campo: "estrenimiento" },
  { texto: "Vómitos con Sangre", campo: "vomitosSangre" },
  { texto: "Sangrado por Orina", campo: "sangradoOrina" },
  { texto: "Tos con Sangre", campo: "tosSangre" },
  { texto: "Coloración Amarilla de la Piel", campo: "coloracionAmarilla" },
  { texto: "Indigestión Frecuente", campo: "indigestionFrecuente" },
  { texto: "Insomnio", campo: "insomnio" },
  { texto: "Lumbalgias o Dolor de Cintura", campo: "lumbalgias" },
  { texto: "Mareos - Desmayos - Vértigo", campo: "mareosDesmayos" },
  { texto: "Heces Negras", campo: "hecesNegras" },
];

const sintomasCol3 = [
  { texto: "Orina con Dolor o Ardor", campo: "orinaDolorArdor" },
  { texto: "Orina Involuntaria", campo: "orinaInvoluntaria" },
  { texto: "Dolor de Oído", campo: "dolorOido" },
  { texto: "Secreciones por el Oído", campo: "secrecionesOido" },
  { texto: "Palpitaciones", campo: "palpitaciones" },
  { texto: "Adormecimiento", campo: "adormecimiento" },
  { texto: "Pesadillas", campo: "pesadillas" },
  { texto: "Dolores Musculares", campo: "doloresMusculares" },
  { texto: "Tos Crónica", campo: "tosCronica" },
  { texto: "Sangrado por Encías", campo: "sangradoEncias" },
];

// Configuración de posiciones para síntomas
const sintomasStartY = 192;
const sintomasStepY = 4;
const sintomasPosicionesX = [20, 80, 140]; // 3 columnas

// Generar lista con coordenadas automáticas
const sintomasFrecuentes = [];
[sintomasCol1, sintomasCol2, sintomasCol3].forEach((col, colIndex) => {
  col.forEach((sintoma, i) => {
    sintomasFrecuentes.push({
      ...sintoma,
      x: sintomasPosicionesX[colIndex],
      y: sintomasStartY + i * sintomasStepY
    });
  });
});

// Datos de prueba para algunos síntomas marcados
const sintomasMarcados = {
  dolorCabeza: true,
  lumbalgias: true,
  insomnio: true
};

// Renderizar en PDF
sintomasFrecuentes.forEach(sintoma => {
  // Texto
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(sintoma.texto, sintoma.x, sintoma.y);

  // Checkbox
  const checkboxX = sintoma.x + 50;
  const checkboxY = sintoma.y - 2;
  doc.rect(checkboxX, checkboxY, 3, 3);

  // Marcar si corresponde
  if (sintomasMarcados[sintoma.campo]) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0); // rojo
    doc.text("X", checkboxX + 0.4, checkboxY + 2.73);
    doc.setTextColor(0, 0, 0);   // reset
  }
});


  // === HABITOS NOSIVOS ===
  // Marco para la sección de hábitos nocivos
  const habitosMarcoInicioY = 231.5;
  const habitosMarcoFinY = 290;
  const habitosMarcoInicioX = 15;
  const habitosMarcoFinX = 200;
  
  // Marco rectangular para hábitos nocivos
  doc.rect(habitosMarcoInicioX, habitosMarcoInicioY, habitosMarcoFinX - habitosMarcoInicioX, habitosMarcoFinY - habitosMarcoInicioY);
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Habitos Nosivos:", 20, 235);

const habitosNosivosItems = [
  { label: "Fumar", campo: "fumar", y: 240, subFields: [
    { label: "Numeros de Cigarrillos", campo: "numeroCigarrillos", x: 80, y: 240, valorX: 125, valorY: 240 }
  ]},
  { label: "Licor", campo: "licor", y: 247, subFields: [
    { label: "Tipo mas Frecuente", campo: "tipoLicor", x: 80, y: 247, valorX: 125, valorY: 247 },
    { label: "Frecuencia", campo: "frecuenciaLicor", x: 80, y: 252, valorX: 125, valorY: 252 }
  ]},
  { label: "Drogas", campo: "drogas", y: 258, subFields: [
    { label: "Tipo Probado o que Usa", campo: "tipoDrogas", x: 80, y: 258, valorX: 125, valorY: 258 },
    { label: "Frecuencia", campo: "frecuenciaDrogas", x: 80, y: 263, valorX: 125, valorY: 263 }
  ]},
  { label: "Otros", campo: "otros", y: 269, subFields: [
    { label: "Tipo", campo: "tipoOtros", x: 80, y: 269, valorX: 125, valorY: 269 },
    { label: "Frecuencia", campo: "frecuenciaOtros", x: 80, y: 274, valorX: 125, valorY: 274 }
  ]}
];

habitosNosivosItems.forEach(item => {
  const labelX = 20;
  const checkboxSiX = labelX + 20;
  const checkboxNoX = labelX + 40;
  const checkboxY = item.y - 2.5;

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(item.label, labelX, item.y);

  // SI con paréntesis de ancho fijo
  doc.text("SI (", checkboxSiX, item.y);
  if (habitosNosivosMarcados[item.campo]) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0);
    doc.text("X", checkboxSiX + 7.2, item.y + 0.5);
    doc.setTextColor(0, 0, 0);
  } else {
    // Espacio vacío para mantener el ancho
    doc.text(" ", checkboxSiX + 7.2, item.y + 0.5);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxSiX + 12, item.y);

  // NO con paréntesis de ancho fijo
  doc.text("NO (", checkboxNoX, item.y);
  if (!habitosNosivosMarcados[item.campo]) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0);
    doc.text("X", checkboxNoX + 8, item.y + 0.5);
    doc.setTextColor(0, 0, 0);
  } else {
    // Espacio vacío para mantener el ancho
    doc.text(" ", checkboxNoX + 7.2, item.y + 0.5);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxNoX + 12, item.y);

  // Sub-campos (aquí ya NO hay líneas, solo texto de prueba)
  item.subFields.forEach(subField => {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(subField.label + ":", subField.x, subField.y);
    doc.setFont("helvetica", "normal").setFontSize(9);

    // Mostrar el valor del campo correspondiente en sus coordenadas independientes
    let valor = habitosNosivosMarcados[subField.campo] || "—";
    doc.text(valor, subField.valorX, subField.valorY);
  });
});


  // === PÁGINA 2 ===
  doc.addPage();
  
  // === HEADER PÁGINA 2 ===
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("FICHA DE ANTECEDENTES PATOLOGICOS", pageW / 2, 26, { align: "center" });

  // Número de Ficha y Página
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Nº Ficha: " + datosFinales.numeroFicha, pageW - 40, 20);
  doc.text("Pag. 02", pageW - 20, 20);
  
  // Sede
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Sede: Trujillo-Pierola", 15, 30);

  // === ANTECEDENTES QUIRÚRGICOS ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("ANTECEDENTES QUIRÚRGICOS", 15, 40);

  // Tabla de antecedentes quirúrgicos
  const tablaInicioY = 45;
  const tablaInicioX = 15;
  const colWidths = [20, 50, 40, 25, 25]; // Anchos de columnas ajustados
  const rowHeight = 6;
  const numRows = 8;
  const tablaAncho = colWidths.reduce((a, b) => a + b, 0);

  // Datos de antecedentes quirúrgicos (dinámicos)
  const antecedentesQuirurgicos = datosFinales.antecedentesQuirurgicos || [
    { fecha: "", hospital: "", operacion: "", diasHospitalizacion: "", complicaciones: "" },
    { fecha: "", hospital: "", operacion: "", diasHospitalizacion: "", complicaciones: "" },
    { fecha: "", hospital: "", operacion: "", diasHospitalizacion: "", complicaciones: "" },
    { fecha: "", hospital: "", operacion: "", diasHospitalizacion: "", complicaciones: "" },
    { fecha: "", hospital: "", operacion: "", diasHospitalizacion: "", complicaciones: "" },
    { fecha: "", hospital: "", operacion: "", diasHospitalizacion: "", complicaciones: "" },
    { fecha: "", hospital: "", operacion: "", diasHospitalizacion: "", complicaciones: "" },
    { fecha: "", hospital: "", operacion: "", diasHospitalizacion: "", complicaciones: "" }
  ];

  // Encabezados de la tabla
  const encabezados = [
    "Fecha",
    "Hospital (Nombre - Lugar)",
    "Operación",
    "Días Hospitalización",
    "Complicaciones"
  ];

  // Dibujar encabezados
  let currentX = tablaInicioX;
  encabezados.forEach((encabezado, index) => {
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(encabezado, currentX, tablaInicioY);
    currentX += colWidths[index];
  });

  // Dibujar líneas de la tabla
  // Línea horizontal superior
  doc.line(tablaInicioX, tablaInicioY + 2, tablaInicioX + tablaAncho, tablaInicioY + 2);
  
  // Líneas verticales
  currentX = tablaInicioX;
  for (let i = 0; i <= encabezados.length; i++) {
    doc.line(currentX, tablaInicioY - 2, currentX, tablaInicioY + 2 + (numRows * rowHeight));
    if (i < encabezados.length) {
      currentX += colWidths[i];
    }
  }

  // Líneas horizontales para filas
  for (let i = 0; i <= numRows; i++) {
    const y = tablaInicioY + 2 + (i * rowHeight);
    doc.line(tablaInicioX, y, tablaInicioX + tablaAncho, y);
  }

  // Llenar datos en la tabla
  antecedentesQuirurgicos.forEach((fila, rowIndex) => {
    if (rowIndex < numRows) {
      const rowY = tablaInicioY + 2 + ((rowIndex + 1) * rowHeight) - 1;
      let colX = tablaInicioX + 2;
      
      // Fecha
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(fila.fecha || "", colX, rowY);
      colX += colWidths[0];
      
      // Hospital
      doc.text(fila.hospital || "", colX, rowY);
      colX += colWidths[1];
      
      // Operación
      doc.text(fila.operacion || "", colX, rowY);
      colX += colWidths[2];
      
      // Días Hospitalización
      doc.text(fila.diasHospitalizacion || "", colX, rowY);
      colX += colWidths[3];
      
      // Complicaciones
      doc.text(fila.complicaciones || "", colX, rowY);
    }
  });

  // === ANTECEDENTES DE REPRODUCCIÓN ===
  const reproY = tablaInicioY + 2 + (numRows * rowHeight) + 10;
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("ANTECEDENTES DE REPRODUCCIÓN", 15, reproY);

  // En caso de Damas
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("En caso de Damas:", 15, reproY + 8);

  const camposDamas = [
    "Inicio de mestruación:",
    "Inicio de vida sexual:",
    "Número de parejas sexual a la actualidad:",
    "Número de hijos vivos:",
    "Número de hijos fallecidos:",
    "Número de abortos:",
    "Precisar Causas:"
  ];

  camposDamas.forEach((campo, index) => {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(campo, 20, reproY + 15 + (index * 5));
  });

  // En caso de Varones
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("En caso de Varones:", 15, reproY + 55);

  const camposVarones = [
    "Número de hijos vivos:",
    "Número de hijos fallecidos:",
    "Número de abortos en sus parejas:",
    "Precisar Causas:"
  ];

  camposVarones.forEach((campo, index) => {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(campo, 20, reproY + 62 + (index * 5));
  });

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
  