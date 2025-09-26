import jsPDF from "jspdf";

export default function FichaAntecedentePatologico(data = {}) {
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
    puestoTrabajo: "DAD",
    empresa: "MINERA BOROO MISQUICHILCA S.A.",
    contrata: "CONTRATA",
    sede: "Trujillo-Pierola"
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
    antecedentesQuirurgicos: data.antecedentesQuirurgicos || [],
    numeroFicha: data.numeroFicha || "99164",
    sede: data.sede || datosPrueba.sede
  } : {
    ...datosPrueba,
    numeroFicha: "99164"
  };

  // === HEADER ===
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("FICHA DE ANTECEDENTES PATOLOGICOS", pageW / 2, 26, { align: "center" });

  // Número de Ficha y Página - Página 1 (tipo lista)
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Nro de ficha: ", pageW - 50, 20);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(datosFinales.numeroFicha, pageW - 30, 20);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Sede: " + datosFinales.sede, pageW - 50, 25);
  doc.text("Pag. " + numeroPagina.toString().padStart(2, '0'), pageW - 50, 30);


  // === FECHA DE EXAMEN ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Fecha Examen: " + datosFinales.fechaExamen, 15, 35);

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
  numeroPagina++; // Incrementar contador de página
  
  // === HEADER PÁGINA 2 ===
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("FICHA DE ANTECEDENTES PATOLOGICOS", pageW / 2, 26, { align: "center" });

  // Número de Ficha y Página (tipo lista)
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Nro de ficha: ", pageW - 50, 20);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(datosFinales.numeroFicha, pageW - 30, 20);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Sede: " + datosFinales.sede, pageW - 50, 25);
  doc.text("Pag. " + numeroPagina.toString().padStart(2, '0'), pageW - 50, 30);

  // === ANTECEDENTES QUIRÚRGICOS ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Antecedentes Quirúrgicos:", 15, 40);

  // Tabla de antecedentes quirúrgicos - con separación del título
  const tablaInicioY = 45; // Aumentado de 42 a 45 para mayor separación
  const tablaInicioX = 15;
  const colWidths = [20, 55, 40, 17, 53]; // Anchos de columnas ajustados
  const tablaAncho = colWidths.reduce((a, b) => a + b, 0);

  // Datos de antecedentes quirúrgicos (dinámicos) - solo los que tienen datos
  const antecedentesQuirurgicos = datosFinales.antecedentesQuirurgicos || [
    { 
      fecha: "2022", 
      hospital: "Hospital Nacional de Especialidades Médicas de Alta Complejidad y Centro de Investigación Clínica", 
      operacion: "Apendicectomía laparoscópica con resección de apéndice cecal y anastomosis ileocecal", 
      diasHospitalizacion: "3", 
      complicaciones: "Ninguna complicación postoperatoria, evolución satisfactoria, alta médica sin observaciones" 
    },
    { 
      fecha: "2022", 
      hospital: "Hospital Nacional de Especialidades Médicas de Alta Complejidad y Centro de Investigación Clínica", 
      operacion: "Apendicectomía laparoscópica con resección de apéndice cecal y anastomosis ileocecal", 
      diasHospitalizacion: "3", 
      complicaciones: "Ninguna complicación postoperatoria, evolución satisfactoria, alta médica sin observaciones" 
    },
    { 
      fecha: "2022", 
      hospital: "Hospital Nacional de Especialidades Médicas de Alta Complejidad y Centro de Investigación Clínica", 
      operacion: "Apendicectomía laparoscópica con resección de apéndice cecal y anastomosis ileocecal", 
      diasHospitalizacion: "3", 
      complicaciones: "Ninguna complicación postoperatoria, evolución satisfactoria, alta médica sin observaciones" 
    }
  ];
  
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
  
  // Líneas verticales - se dibujarán después de calcular las alturas dinámicas


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
    const margenInferior = 0.5; // 0.5mm margen inferior
    return alturaContenido + margenSuperior + margenInferior;
  };

  // Calcular alturas de filas dinámicamente
  const alturasFilas = antecedentesConDatos.map(fila => calcularAlturaFila(fila, colWidths, doc));
  const alturaTotalFilas = alturasFilas.reduce((sum, altura) => sum + altura, 0);

  // Líneas horizontales para filas con alturas dinámicas
  let lineY = tablaInicioY + 2;
  doc.line(tablaInicioX, lineY, tablaInicioX + tablaAncho, lineY); // Línea superior
  
  alturasFilas.forEach((alturaFila, index) => {
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
    const rowY = currentY + margenSuperior + 2; // 1.5mm margen + 2mm para centrar el texto
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
    
    currentY += alturaFila;
  });

  // === ANTECEDENTES DE REPRODUCCIÓN ===
  const reproY = tablaInicioY + 2 + alturaTotalFilas + 10;
  
  // Datos de prueba para antecedentes de reproducción
  const datosReproduccion = {
    damas: {
      inicioMenstruacion: "12 años",
      inicioVidaSexual: "18 años", 
      numeroParejas: "2",
      hijosVivos: "1",
      hijosFallecidos: "0",
      numeroAbortos: "1",
      causasAbortos: "Complicaciones médicas"
    },
    varones: {
      hijosVivos: "2",
      hijosFallecidos: "0", 
      abortosParejas: "1",
      causasAbortos: "Complicaciones médicas"
    }
  };

  // Calcular altura total de la sección
  const alturaSeccionDamas = 7 * 5 + 10; // 7 campos * 5mm + margen
  const alturaSeccionVarones = 4 * 5 + 10; // 4 campos * 5mm + margen
  const alturaTotalRepro = alturaSeccionDamas + alturaSeccionVarones + 20; // +20 para títulos y espaciado

  // Marco para Antecedentes de Reproducción
  const marcoReproInicioX = 15;
  const marcoReproFinX = 200;
  const marcoReproInicioY = reproY - 5;
  const marcoReproFinY = reproY + alturaTotalRepro;

  // Dibujar marco rectangular
  doc.rect(marcoReproInicioX, marcoReproInicioY, marcoReproFinX - marcoReproInicioX, marcoReproFinY - marcoReproInicioY);
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Antecedentes de Reproducción:", 16, reproY);

  // En caso de Damas
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("En caso de Damas:", 20, reproY + 8);

  const camposDamas = [
    { label: "Inicio de mestruación:", value: datosReproduccion.damas.inicioMenstruacion, y: reproY + 15 },
    { label: "Inicio de vida sexual:", value: datosReproduccion.damas.inicioVidaSexual, y: reproY + 20 },
    { label: "Número de parejas sexual a la actualidad:", value: datosReproduccion.damas.numeroParejas, y: reproY + 25 },
    { label: "Número de hijos vivos:", value: datosReproduccion.damas.hijosVivos, y: reproY + 30 },
    { label: "Número de hijos fallecidos:", value: datosReproduccion.damas.hijosFallecidos, y: reproY + 35 },
    { label: "Número de abortos:", value: datosReproduccion.damas.numeroAbortos, y: reproY + 40 },
    { label: "Precisar Causas:", value: datosReproduccion.damas.causasAbortos, y: reproY + 45 }
  ];

  camposDamas.forEach((campo) => {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(campo.label, 25, campo.y);
    doc.text(campo.value, 25 + 80, campo.y); // Valor a 80mm del inicio
  });

  // En caso de Varones
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("En caso de Varones:", 20, reproY + 55);

  const camposVarones = [
    { label: "Número de hijos vivos:", value: datosReproduccion.varones.hijosVivos, y: reproY + 62 },
    { label: "Número de hijos fallecidos:", value: datosReproduccion.varones.hijosFallecidos, y: reproY + 67 },
    { label: "Número de abortos en sus parejas:", value: datosReproduccion.varones.abortosParejas, y: reproY + 72 },
    { label: "Precisar Causas:", value: datosReproduccion.varones.causasAbortos, y: reproY + 77 }
  ];

  camposVarones.forEach((campo) => {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(campo.label, 25, campo.y);
    doc.text(campo.value, 25 + 80, campo.y); // Valor a 80mm del inicio
  });

  // === DECLARACIÓN Y FIRMAS ===
  const declaracionY = reproY + alturaTotalRepro + 8; // Más margen
  
  // Texto de declaración centrado
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("TODA LA INFORMACIÓN QUE HE PROPORCIONADO AL SERVICIO DE MEDICINA OCUPACIONAL,", pageW / 2, declaracionY, { align: "center" });
  doc.text("ES VERDADERA NO HABIENDO OMITIDO NINGÚN DATO VOLUNTARIAMENTE.", pageW / 2, declaracionY + 4, { align: "center" });
  
  // Fecha centrada
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("FECHA: " + datosFinales.fechaExamen, pageW / 2, declaracionY + 10, { align: "center" });
  
  // Sección de firmas con más margen
  const firmasY = declaracionY + 23;
  
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
  