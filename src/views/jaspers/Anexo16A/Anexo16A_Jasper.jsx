import jsPDF from "jspdf";

export default function Anexo16A_Jasper(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 0;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Datos de prueba por defecto
  const datosPrueba = {
    numeroFicha: "96639",
    apellidosNombres: "CASTILLO PLASENCIA HADY KATHERINE",
    documentoIdentidad: "72384273",
    fechaNacimiento: "23/01/1994",
    edad: "31 años",
    direccion: "SAC1 URB PARQUE INDUSTRIAL MZ D LT 3",
    empleador: "MINERA BOROO MISQUICHILCA S.A.",
    actividadRealizar: "DAD",
    vitalSigns: {
      fc: "64",
      fr: "19",
      pa: "120/60",
      satO2: "99",
      imc: "23.48"
    },
    condiciones: {
      cirugiaMayor: false,
      desordenesCoagulacion: false,
      diabetes: false,
      hipertension: false,
      embarazo: false,
      problemasNeurologicos: false,
      infeccionesRecientes: true,
      obesidadMorbida: false,
      problemasCardiacos: false,
      problemasRespiratorios: false,
      problemasOftalmologicos: true,
      problemasDigestivos: false,
      apneaSueño: false,
      alergias: false,
      otraCondicion: false
    },
    medicacionActual: "Paracetamol 500mg cada 8 horas",
    observaciones: [
      "USO DE LENTES CORRECTORES",
      "ALERGIA A PENICILINA",
     
    ]
  };

  // Usar datos reales si existen, sino usar datos de prueba
  const datosFinales = data && data.norden ? {
    numeroFicha: data.norden || datosPrueba.numeroFicha,
    apellidosNombres: data.nombres || datosPrueba.apellidosNombres,
    documentoIdentidad: data.dni || datosPrueba.documentoIdentidad,
    fechaNacimiento: data.fechaNac || datosPrueba.fechaNacimiento,
    edad: data.edad || datosPrueba.edad,
    direccion: data.direccion || datosPrueba.direccion,
    empleador: data.empresa || datosPrueba.empleador,
    actividadRealizar: data.actividadRealizar || datosPrueba.actividadRealizar,
    vitalSigns: {
      fc: data.fc || datosPrueba.vitalSigns.fc,
      fr: data.fr || datosPrueba.vitalSigns.fr,
      pa: data.pa || datosPrueba.vitalSigns.pa,
      satO2: data.satO2 || datosPrueba.vitalSigns.satO2,
      imc: data.imc || datosPrueba.vitalSigns.imc
    },
    condiciones: {
      cirugiaMayor: data.cirugiaMayor || false,
      desordenesCoagulacion: data.desordenesCoagulacion || false,
      diabetes: data.diabetes || false,
      hipertension: data.hipertension || false,
      embarazo: data.embarazo || false,
      problemasNeurologicos: data.problemasNeurologicos || false,
      infeccionesRecientes: data.infeccionesRecientes || true,
      obesidadMorbida: data.obesidadMorbida || false,
      problemasCardiacos: data.problemasCardiacos || false,
      problemasRespiratorios: data.problemasRespiratorios || false,
      problemasOftalmologicos: data.problemasOftalmologicos || true,
      problemasDigestivos: data.problemasDigestivos || false,
      apneaSueño: data.apneaSueño || false,
      alergias: data.alergias || false,
      otraCondicion: data.otraCondicion || false
    },
    medicacionActual: data.medicacionActual || "",
    observaciones: data.observaciones || ""
  } : datosPrueba;

  // === HEADER ===
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("ANEXO N° 16 - A", pageW / 2, 26, { align: "center" });
  
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("EVALUACION MÉDICA PARA ASCENSO A GRANDES ALTITUDES", pageW / 2, 30, { align: "center" });
  doc.text("(mayor de 2,500 m.s.n.m.)", pageW / 2, 34, { align: "center" });

  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.rect(pageW - 35, 15, 30, 8);
  doc.text("Nº Ficha : " + datosFinales.numeroFicha, pageW - 32, 20);

  // === SECCIÓN 1: DATOS PERSONALES ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("1. Datos Personales", 15, 40);

  // Datos personales
  const datosPersonales = [
    { label: "Apellidos y Nombres:", value: datosFinales.apellidosNombres, x: 15, y: 45 },
    { label: "Documento de identidad:", value: datosFinales.documentoIdentidad, x: 15, y: 50 },
    { label: "Fecha Nacimiento(dd/mm/aa):", value: datosFinales.fechaNacimiento, x: 15, y: 55},
    { label: "Edad:", value: datosFinales.edad, x: 15, y: 60 },
    { label: "Dirección:", value: datosFinales.direccion, x: 15, y: 65 },
    { label: "Empleador:", value: datosFinales.empleador, x: 15, y: 70},
    { label: "Actividad a Realizar:", value: datosFinales.actividadRealizar, x: 15, y: 75 }
  ];

  datosPersonales.forEach(item => {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(item.label, item.x, item.y);
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(item.value, item.x + 60, item.y);
  });

  // === SECCIÓN 2: FUNCIONES VITALES ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("2. Funciones Vitales:", 15, 83.5);

  // Signos vitales en fila
  const signosVitales = [
    { label: "FC:", value: datosFinales.vitalSigns.fc + " x min", x: 60, y: 81 },
    { label: "FR:", value: datosFinales.vitalSigns.fr + " x min", x: 100, y: 81 },
    { label: "PA:", value: datosFinales.vitalSigns.pa + " mmHg", x: 130, y: 81 },
    { label: "Sat. O2:", value: datosFinales.vitalSigns.satO2 + " %", x: 60, y: 85 },
    { label: "IMC:", value: datosFinales.vitalSigns.imc + " kg/m2", x: 100, y: 85 }
  ];

  signosVitales.forEach((signo, index) => {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(signo.label, signo.x, signo.y);
    doc.setFont("helvetica", "normal").setFontSize(9);
    
    // Ajustar espaciado solo para Sat. O2
    let valueX = signo.x + 8;
    if (signo.label === "Sat. O2:") {
      valueX = signo.x + 14; // Más espacio para Sat. O2
    }
    
    doc.text(signo.value, valueX, signo.y);
  });

  // === SECCIÓN 3: CONDICIONES MÉDICAS ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("3. El / La presenta o ha presentado en los últimos 6 meses:", 15, 90);
  
  // Encabezados SI y NO
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("SI", 130.5, 90);
  doc.text("NO", 144.5, 90);

  // Lista de condiciones médicas
  const condiciones = [
    { texto: "Cirugía mayor reciente", campo: "cirugiaMayor", x: 30, y: 95 },
    { texto: "Desórdenes de la coagulación, trombosis, etc.", campo: "desordenesCoagulacion", x: 30, y: 100 },
    { texto: "Diabetes Mellitus", campo: "diabetes", x: 30, y: 105 },
    { texto: "Hipertensión Arterial", campo: "hipertension", x: 30, y: 110 },
    { texto: "Embarazo", campo: "embarazo", x: 30, y: 115 },
    { texto: "Problemas neurológicos: epilepsia, vértigo, etc.", campo: "problemasNeurologicos", x: 30, y: 120 },
    { texto: "Infecciones recientes (especialmente oídos, nariz, garganta)", campo: "infeccionesRecientes", x: 30, y: 125 },
    { texto: "Obesidad Mórbida (IMC mayor a 35 m/kg2)", campo: "obesidadMorbida", x: 30, y: 130 },
    { texto: "Problemas Cardíacos: marcapasos, coronariopatía, etc.", campo: "problemasCardiacos", x: 30, y: 135 },
    { texto: "Problemas Respiratorios: asma, EPOC, etc.", campo: "problemasRespiratorios", x: 30, y: 140 },
    { texto: "Problemas Oftalmológicos: retinopatía, glaucoma, etc.", campo: "problemasOftalmologicos", x: 30, y: 145 },
    { texto: "Problemas Digestivos: úlcera péptica, hepatitis, etc.", campo: "problemasDigestivos", x: 30, y: 150 },
    { texto: "Apnea del Sueño", campo: "apneaSueño", x: 30, y: 155 },
    { texto: "Alergias", campo: "alergias", x: 30, y: 160 },
    { texto: "Otra condición médica importante", campo: "otraCondicion", x: 30, y: 165 }
  ];

  condiciones.forEach(condicion => {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(condicion.texto, condicion.x, condicion.y);
    
    // Checkboxes SI/NO
    const siX = condicion.x + 100;
    const noX = condicion.x + 115;
    const checkboxY = condicion.y - 2;
    
    // Dibujar checkbox SI
    doc.rect(siX, checkboxY, 4, 4);
    if (datosFinales.condiciones[condicion.campo]) {
      doc.setFont("helvetica", "bold").setFontSize(12);
      doc.setTextColor(255, 0, 0); // Color rojo
      doc.text("X", siX + 0.5, checkboxY + 3.5);
      doc.setTextColor(0, 0, 0); // Resetear a negro
    }
    
    // Dibujar checkbox NO
    doc.rect(noX, checkboxY, 4, 4);
    if (!datosFinales.condiciones[condicion.campo]) {
      doc.setFont("helvetica", "bold").setFontSize(12);
      doc.setTextColor(255, 0, 0); // Color rojo
      doc.text("X", noX + 0.5, checkboxY + 3.5);
      doc.setTextColor(0, 0, 0); // Resetear a negro
    }
  });

  // === USO DE MEDICACIÓN ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Uso de medicación Actual:", 30, 170);
  
  // Texto con guiones para simular línea
  doc.setFont("helvetica", "normal").setFontSize(9);
  if (datosFinales.medicacionActual) {
    doc.text(datosFinales.medicacionActual, 84, 170);
  }

  // === DECLARACIÓN ===
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Declaro que las respuestas dadas en el presente documento son verdaderas y estoy consciente que el ocultar o falsear información me puede causar daño por lo que asumo total responsabilidad de ello.", 15, 175, { maxWidth: 180 });

  // === FIRMA Y HUELLA DIGITAL ===
  // Centrar horizontalmente en la página (A4 = 210mm)
  const pageWidth = 210;
  const firmaWidth = 45; // Ancho del bloque de firma
  const huellaWidth = 25; // Ancho del bloque de huella
  const gap = 30; // Espacio entre bloques
  const totalWidth = firmaWidth + gap + huellaWidth;
  const startX = (pageWidth - totalWidth) / 2; // Centrar el conjunto
  
  // Firma del paciente (lado izquierdo) - imagen arriba, línea, texto abajo
  try {
    const firmaImg = "/img/firmas_sellos_prueba/firma_de_prueba_jaspers.png";
    doc.addImage(firmaImg, "PNG", startX, 180, 45, 25); // Imagen arriba
  } catch (e) {
    doc.text("[Firma]", startX + 5, 230);
  }
  doc.line(startX, 204, startX + firmaWidth, 204); // Línea debajo de la imagen
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("firma", startX + 15, 207); // Texto centrado debajo de la línea
  
  // Huella dactilar (lado derecho) - recuadro, texto abajo
  const huellaX = startX + firmaWidth + gap;
  doc.rect(huellaX, 180, 25, 25); // Recuadro
  try {
    const huellaImg = "/img/firmas_sellos_prueba/HUELLA_DIGITAL.png";
    doc.addImage(huellaImg, "PNG", huellaX + 3, 180, 18, 25); // Huella dentro del recuadro
  } catch (e) {
    doc.text("[Huella]", huellaX + 5, 235);
  }
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("huella paciente", huellaX + 2, 207.2); // Texto centrado debajo del recuadro

  

  // === SECCIÓN LABORATORIO ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Laboratorio:", 15,212);
  
  // Datos de laboratorio
  const datosLaboratorio = [
    { label: "Hemoglobina:", value: "13 g%", x: 40, y: 212 },
    { label: "Hematocrito:", value: "62%", x: 80, y: 212 },
    { label: "Glucosa:", value: "N/A mg/dL", x: 118, y: 212 },
    { label: "EKG (>= 45años):", value: "Normal", x: 155, y: 212 }
  ];

  datosLaboratorio.forEach((item, index) => {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(item.label, item.x, item.y);
    doc.setFont("helvetica", "normal").setFontSize(9);
    
    // Ajustar espaciado para cada elemento
    let valueX = item.x + 22;
    if (item.label === "Hemoglobina:") {
      valueX = item.x + 24; // Espacio para Hemoglobina
    } else if (item.label === "Hematocrito:") {
      valueX = item.x + 22; // Espacio para Hematocrito
    } else if (item.label === "Glucosa:") {
      valueX = item.x + 15; // Espacio para Glucosa
    } else if (item.label === "EKG (>= 45años):") {
      valueX = item.x + 28; // Espacio para EKG
    }
    
    doc.text(item.value, valueX, item.y);
  });

  // === CERTIFICACIÓN MÉDICA ===
  doc.setFont("helvetica", "normal").setFontSize(9);
  const certificacionTexto = "Conforme a la declaración del / de la paciente y las pruebas complementarias, certifico que se encuentra APTO para ascender a grandes altitudes (mayor a 2,500 m.s.n.m); sin embargo, no aseguro el desempeño durante el ascenso durante su permanencia.";
  
  // Dividir el texto en líneas
  const certificacionLineas = doc.splitTextToSize(certificacionTexto, 175);
  let yPos = 218;
  
  certificacionLineas.forEach(linea => {
    doc.text(linea, 15, yPos);
    yPos += 3.5;
  });

  // === OBSERVACIONES MÉDICAS ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Observaciones:", 15, 230);
  
  // Observaciones dinámicas - puede recibir array o string
  let observacionesLista = [];
  if (datosFinales.observaciones) {
    if (Array.isArray(datosFinales.observaciones)) {
      observacionesLista = datosFinales.observaciones;
    } else {
      // Si es string, dividir por saltos de línea o comas
      observacionesLista = datosFinales.observaciones.split(/[\n,;]/).map(obs => obs.trim()).filter(obs => obs);
    }
  }
  
  // Si no hay observaciones en los datos, usar la observación por defecto
  if (observacionesLista.length === 0) {
    observacionesLista = ["USO DE LENTES CORRECTORES"];
  }
  
  // Dibujar cada observación
  let observacionY = 235;
  observacionesLista.forEach((observacion, index) => {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(`- ${observacion}`, 15, observacionY);
    observacionY += 5; // Espacio entre observaciones
  });

  // Calcular posición Y final de observaciones para ajustar secciones siguientes
  const observacionesFinalY = observacionY  - 3; // Espacio adicional después de la última observación

  // === DATOS DEL MÉDICO ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Datos del Médico:", 15, observacionesFinalY + 5);

  const datosMedico = [
    { label: "Apellidos y Nombres:", value: "SANCHEZ QUIÑONES JOSE ALEJANDRO", x: 15, y: observacionesFinalY + 10 },
    { label: "Dirección:", value: "Av. Nicolas de Piérola N°1106 Urb. San Fernando", x: 15, y: observacionesFinalY + 15 },
    { label: "CMP:", value: "80135", x: 15, y: observacionesFinalY + 20 },
    { label: "Fecha (dd/mm/aa):", value: "04/11/2024", x: 15, y: observacionesFinalY + 25 }
  ];

  datosMedico.forEach(item => {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(item.label, item.x, item.y);
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(item.value, item.x + 35, item.y);
  });

  // === FIRMA Y SELLO DEL MÉDICO ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Firma y sello de Médico", 150, observacionesFinalY + 30);

  // Firma del médico (lado derecho)
  const firmaMedicoX = pageW - 68;
  const firmaMedicoY = observacionesFinalY + 5;
  
  try {
    const firmaMedicoImg = "/img/firmas_sellos_prueba/firma_de_prueba_jaspers.png";
    doc.addImage(firmaMedicoImg, "PNG", firmaMedicoX, firmaMedicoY, 50, 20);
  } catch (e) {
    doc.text("[Firma Dr. Sanchez]", firmaMedicoX + 5, firmaMedicoY + 15);
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
