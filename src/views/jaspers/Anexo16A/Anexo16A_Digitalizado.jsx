import jsPDF from "jspdf";

export default function Anexo16A_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

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
    contrata: "CONTRATA EJEMPLO S.A.C.",
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
      embarazo: true,
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
    fur: "15/08/2024", // Fecha de última regla
    observaciones: [
      "USO DE LENTES CORRECTORES",
      "ALERGIA A PENICILINA",
     
    ],
    medico: {
      nombres: "SANCHEZ QUIÑONES JOSE ALEJANDRO",
      direccion: "Av. Nicolas de Piérola N°1106 Urb. San Fernando",
      cmp: "80135",
      fecha: "04/11/2024"
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
    empresa: data.empresa || datosPrueba.empresa,
    contrata: data.contrata || datosPrueba.contrata,
    apto: data.apto !== undefined ? data.apto : true,
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
    fur: data.fur || "",
    observaciones: data.observaciones || "",
    medico: {
      nombres: data.medicoNombres || datosPrueba.medico.nombres,
      direccion: data.medicoDireccion || datosPrueba.medico.direccion,
      cmp: data.medicoCmp || datosPrueba.medico.cmp,
      fecha: data.medicoFecha || datosPrueba.medico.fecha
    }
  } : datosPrueba;

  // === HEADER ===
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("ANEXO N° 16 - A", pageW / 2, 26, { align: "center" });
  
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("EVALUACION MÉDICA PARA ASCENSO A GRANDES ALTITUDES", pageW / 2, 30, { align: "center" });
  doc.text("(mayor de 2,500 m.s.n.m.)", pageW / 2, 34, { align: "center" });


  // === SECCIÓN 1: DATOS PERSONALES ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("1. Datos Personales", 15, 40);

  // Datos personales
  const datosPersonales = [
    { label: "Apellidos y Nombres:", value: datosFinales.apellidosNombres, x: 15, y: 45 },
    { label: "Fecha de Examen:", value: datosFinales.fechaExamen, x: 15, y: 50 },
    { label: "Sexo:", value: datosFinales.sexo, x: 15, y: 55 },
    { label: "DNI:", value: datosFinales.documentoIdentidad, x: 15, y: 60 },
    { label: "Edad:", value: datosFinales.edad, x: 15, y: 65 },
    { label: "Área de Trabajo:", value: datosFinales.areaTrabajo, x: 15, y: 70 },
    { label: "Puesto de Trabajo:", value: datosFinales.puestoTrabajo, x: 15, y: 75 },
    { label: "Empresa:", value: datosFinales.empresa, x: 15, y: 80 },
    { label: "Contrata:", value: datosFinales.contrata, x: 15, y: 85 }
  ];

  datosPersonales.forEach(item => {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(item.label, item.x, item.y);
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(item.value, item.x + 50, item.y);
  });

  // === SECCIÓN 2: FUNCIONES VITALES ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("2. Funciones Vitales:", 15, 93.5);

  // Signos vitales en fila
  const signosVitales = [
    { label: "FC:", value: datosFinales.vitalSigns.fc + " x min", x: 60, y: 91 },
    { label: "FR:", value: datosFinales.vitalSigns.fr + " x min", x: 100, y: 91 },
    { label: "PA:", value: datosFinales.vitalSigns.pa + " mmHg", x: 130, y: 91 },
    { label: "Sat. O2:", value: datosFinales.vitalSigns.satO2 + " %", x: 60, y: 95 },
    { label: "IMC:", value: datosFinales.vitalSigns.imc + " kg/m2", x: 100, y: 95 }
  ];

  signosVitales.forEach((signo) => {
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
  doc.text("3. El / La presenta o ha presentado en los últimos 6 meses:", 15, 100);
  
  // Encabezados SI y NO
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("SI", 130.5, 100);
  doc.text("NO", 144.5, 100);

  // Lista de condiciones médicas
  const condiciones = [
    { texto: "Cirugía mayor reciente", campo: "cirugiaMayor", x: 30, y: 105 },
    { texto: "Desórdenes de la coagulación, trombosis, etc.", campo: "desordenesCoagulacion", x: 30, y: 110 },
    { texto: "Diabetes Mellitus", campo: "diabetes", x: 30, y: 115 },
    { texto: "Hipertensión Arterial", campo: "hipertension", x: 30, y: 120 },
    { texto: "Embarazo", campo: "embarazo", x: 30, y: 125 },
    { texto: "Problemas neurológicos: epilepsia, vértigo, etc.", campo: "problemasNeurologicos", x: 30, y: 130 },
    { texto: "Infecciones recientes (especialmente oídos, nariz, garganta)", campo: "infeccionesRecientes", x: 30, y: 135 },
    { texto: "Obesidad Mórbida (IMC mayor a 35 m/kg2)", campo: "obesidadMorbida", x: 30, y: 140 },
    { texto: "Problemas Cardíacos: marcapasos, coronariopatía, etc.", campo: "problemasCardiacos", x: 30, y: 145 },
    { texto: "Problemas Respiratorios: asma, EPOC, etc.", campo: "problemasRespiratorios", x: 30, y: 150 },
    { texto: "Problemas Oftalmológicos: retinopatía, glaucoma, etc.", campo: "problemasOftalmologicos", x: 30, y: 155 },
    { texto: "Problemas Digestivos: úlcera péptica, hepatitis, etc.", campo: "problemasDigestivos", x: 30, y: 160 },
    { texto: "Apnea del Sueño", campo: "apneaSueño", x: 30, y: 165 },
    { texto: "Alergias", campo: "alergias", x: 30, y: 170 },
    { texto: "Otra condición médica importante", campo: "otraCondicion", x: 30, y: 175 }
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
    
    // Si es embarazo y está marcado como SI, mostrar campo FUR en la misma línea
    if (condicion.campo === "embarazo" && datosFinales.condiciones[condicion.campo]) {
      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.text("FUR:", 160, 126); // Posición X e Y específica para FUR
      doc.text(datosFinales.fur || "00/00/0000", 170, 126);
    }
  });

  // === USO DE MEDICACIÓN ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Uso de medicación Actual:", 30, 180);
  
  // Texto con guiones para simular línea
  doc.setFont("helvetica", "normal").setFontSize(9);
  if (datosFinales.medicacionActual) {
    doc.text(datosFinales.medicacionActual, 84, 180);
  }

  // === DECLARACIÓN ===
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Declaro que las respuestas dadas en el presente documento son verdaderas y estoy consciente que el ocultar o falsear información me puede causar daño por lo que asumo total responsabilidad de ello.", 15, 185, { maxWidth: 180 });

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
    doc.addImage(firmaImg, "PNG", startX, 190, 45, 25); // Imagen arriba
  } catch (e) {
    doc.text("[Firma]", startX + 5, 240);
  }
  doc.line(startX, 214, startX + firmaWidth, 214); // Línea debajo de la imagen
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("firma", startX + 15, 217); // Texto centrado debajo de la línea
  
  // Huella dactilar (lado derecho) - recuadro, texto abajo
  const huellaX = startX + firmaWidth + gap;
  doc.rect(huellaX, 190, 25, 25); // Recuadro
  try {
    const huellaImg = "/img/firmas_sellos_prueba/HUELLA_DIGITAL.png";
    doc.addImage(huellaImg, "PNG", huellaX + 3, 190, 18, 25); // Huella dentro del recuadro
  } catch (e) {
    doc.text("[Huella]", huellaX + 5, 245);
  }
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("huella paciente", huellaX + 2, 217.2); // Texto centrado debajo del recuadro

  


  // === CERTIFICACIÓN MÉDICA ===
  doc.setFont("helvetica", "normal").setFontSize(9);
  const estadoApto = datosFinales.apto !== undefined ? datosFinales.apto : true; // Default true si no se especifica
  const estadoTexto = estadoApto ? "APTO" : "NO APTO";
  
  // Texto antes del estado
  const textoAntes = "Conforme a la declaración del / de la paciente y las pruebas complementarias, certifico que se encuentra ";
  const textoDespues = " para ascender a grandes altitudes (mayor a 2,500 m.s.n.m); sin embargo, no aseguro el desempeño durante el ascenso durante su permanencia.";
  
  // Dividir el texto en líneas
  const certificacionLineas = doc.splitTextToSize(textoAntes + estadoTexto + textoDespues, 175);
  let yPos = 222;
  
  certificacionLineas.forEach(linea => {
    // Verificar si la línea contiene el estado
    if (linea.includes(estadoTexto)) {
      // Dividir la línea en partes para poder hacer bold solo el estado
      const partes = linea.split(estadoTexto);
      
      // Escribir la primera parte
      if (partes[0]) {
        doc.setFont("helvetica", "normal").setFontSize(9);
        doc.text(partes[0], 15, yPos);
      }
      
      // Escribir el estado en bold con espacio
      const xPosEstado = 15 + doc.getTextWidth(partes[0]);
      doc.setFont("helvetica", "bold").setFontSize(9);
      doc.text(" " + estadoTexto + " ", xPosEstado, yPos);
      
      // Escribir la última parte
      if (partes[1]) {
        const xPosFinal = xPosEstado + doc.getTextWidth(" " + estadoTexto + " ");
        doc.setFont("helvetica", "normal").setFontSize(9);
        doc.text(partes[1], xPosFinal, yPos);
      }
    } else {
      // Línea normal sin estado
      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.text(linea, 15, yPos);
    }
    yPos += 3.5;
  });

  // === OBSERVACIONES MÉDICAS ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Observaciones:", 15, 234);
  
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
  let observacionY = 239;
  observacionesLista.forEach((observacion) => {
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(`- ${observacion}`, 15, observacionY);
    observacionY += 4; // Espacio entre observaciones
  });

  // Calcular posición Y final de observaciones para ajustar secciones siguientes
  const observacionesFinalY = observacionY  - 3; // Espacio adicional después de la última observación

  // === DATOS DEL MÉDICO ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Datos del Médico:", 15, observacionesFinalY + 5);

  const datosMedico = [
    { label: "Apellidos y Nombres:", value: datosFinales.medico.nombres, x: 15, y: observacionesFinalY + 10 },
    { label: "Dirección:", value: datosFinales.medico.direccion, x: 15, y: observacionesFinalY + 15 },
    { label: "CMP:", value: datosFinales.medico.cmp, x: 15, y: observacionesFinalY + 20 },
    { label: "Fecha (dd/mm/aa):", value: datosFinales.medico.fecha, x: 15, y: observacionesFinalY + 25 }
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
