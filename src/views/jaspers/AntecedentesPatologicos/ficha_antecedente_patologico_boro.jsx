import jsPDF from "jspdf";

export default function FichaAntecedentePatologicoBoro(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  
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
    puestoTrabajo: "OPERADOR DE MAQUINARIA PESADA",
    tiempoExperiencia: "5 años",
    empresa: "MINERA BOROO MISQUICHILCA S.A.",
    contrata: "CONTRATA",
    sede: "Trujillo-Pierola",
    // Datos de accidentes
    accidenteTrabajo: false,
    fechaAccidente: "04/09/2025",
    tiempoPerdido: false,
    tiempoIncapacidad: "5 MESES(meses)",
    causaBasica: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
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
    tiempoExperiencia: data.tiempoExperiencia || datosPrueba.tiempoExperiencia,
    empresa: data.empresa || datosPrueba.empresa,
    contrata: data.contrata || datosPrueba.contrata,
    numeroFicha: data.numeroFicha || "99164",
    sede: data.sede || datosPrueba.sede,
    // Datos de accidentes
    accidenteTrabajo: data.accidenteTrabajo !== undefined ? data.accidenteTrabajo : datosPrueba.accidenteTrabajo,
    fechaAccidente: data.fechaAccidente || datosPrueba.fechaAccidente,
    tiempoPerdido: data.tiempoPerdido !== undefined ? data.tiempoPerdido : datosPrueba.tiempoPerdido,
    tiempoIncapacidad: data.tiempoIncapacidad || datosPrueba.tiempoIncapacidad,
    causaBasica: data.causaBasica || datosPrueba.causaBasica
  } : {
    ...datosPrueba,
    numeroFicha: "99164"
  };

  // === HEADER ===
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("DECLARACIÓN JURADA DE DATOS MÉDICOS", pageW / 2, 26, { align: "center" });
  doc.text("Y ANTECEDENTES", pageW / 2, 32, { align: "center" });

  // Número de Ficha y Página - Página 1 (tipo lista)
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Nro de ficha: ", pageW - 50, 20);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(datosFinales.numeroFicha, pageW - 30, 20);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Sede: " + datosFinales.sede, pageW - 50, 25);
  doc.text("Pag. " + numeroPagina.toString().padStart(2, '0'), pageW - 50, 30);

  // === EMPRESA Y FECHA ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("EMPRESA: " + datosFinales.empresa, 20, 45);
  doc.text("FECHA: " + datosFinales.fechaExamen, pageW - 50, 45);

  // === DECLARACIÓN JURADA ===
  const declaracionY = 55;
  doc.setFont("helvetica", "normal").setFontSize(9);
  const declaracionTexto = `Yo; ${datosFinales.apellidosNombres} de ${datosFinales.edad} de edad, con DNI/CE/PASAPORTE ${datosFinales.documentoIdentidad}, declaro que toda la información proporcionada en esta declaración jurada es verdadera no habiendo omitido ningún dato personal ni laboral relevante de forma voluntaria.`;
  doc.text(declaracionTexto, 20, declaracionY, { maxWidth: pageW - 40 });

  // === ANTECEDENTES PATOLÓGICOS PERSONALES ===
  const antecedentesY = declaracionY + 15;
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("1. ANTECEDENTES PATOLÓGICOS PERSONALES:", 20, antecedentesY);

  // Puesto al que Postula
  const puestoY = antecedentesY + 8;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Puesto al que Postula: ", 20, puestoY);
  doc.text(datosFinales.puestoTrabajo, 58, puestoY);

  // Tiempo de Experiencia
  doc.text("Tiempo de Experiencia: " + datosFinales.tiempoExperiencia, 20, puestoY + 6);

  // Pregunta sobre accidentes de trabajo - TODO EN UNA LÍNEA
  const accidenteY = puestoY + 12;
  
  // Pregunta
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Ha sufrido algún accidente relacionado al trabajo:", 20, accidenteY);
  
  // Checkboxes SI/NO en la misma línea
  const checkboxSiX = 97;
  const checkboxNoX = 112;
  
  // Checkbox SI con paréntesis - ANCHO FIJO
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("SI (", checkboxSiX, accidenteY);
  if (datosFinales.accidenteTrabajo) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0); // rojo
    // X del SI - coordenadas individuales
    const xSiX = checkboxSiX + 6.5;
    const xSiY = accidenteY + 0.5;
    doc.text("X", xSiX, xSiY);
    doc.setTextColor(0, 0, 0); // reset
  } else {
    // Espacio fijo para mantener el ancho
    doc.text("  ", checkboxSiX + 7, accidenteY);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxSiX + 10, accidenteY);
  
  // Checkbox NO con paréntesis - ANCHO MÁS GRANDE
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("NO (", checkboxNoX, accidenteY);
  if (!datosFinales.accidenteTrabajo) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0); // rojo
    // X del NO - coordenadas individuales
    const xNoX = checkboxNoX + 8;
    const xNoY = accidenteY + 0.5;
    doc.text("X", xNoX, xNoY);
    doc.setTextColor(0, 0, 0); // reset
  } else {
    // Espacio más grande para paréntesis más anchos
    doc.text("    ", checkboxNoX + 7, accidenteY);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxNoX + 12, accidenteY);

  // Fecha del Accidente en la misma línea
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Fecha del Accidente(s): " + datosFinales.fechaAccidente, 128, accidenteY);

  // Instrucción
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Si la Respuesta es SI, responder las líneas inferiores", 30, accidenteY + 5);

  // Tiempo perdido - TODO EN UNA LÍNEA
  const tiempoPerdidoY = accidenteY + 10;
  
  // Pregunta
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Hubo tiempo perdido (descanso médico)", 30, tiempoPerdidoY);
  
  // Checkboxes SI/NO en la misma línea
  const checkboxTiempoSiX = 97;
  const checkboxTiempoNoX = 112;
  
  // Checkbox SI para tiempo perdido con paréntesis - ANCHO FIJO
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("SI (", checkboxTiempoSiX, tiempoPerdidoY);
  if (datosFinales.tiempoPerdido) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0); // rojo
    // X del SI tiempo perdido - coordenadas individuales
    const xTiempoSiX = checkboxTiempoSiX + 6.5;
    const xTiempoSiY = tiempoPerdidoY + 0.5;
    doc.text("X", xTiempoSiX, xTiempoSiY);
    doc.setTextColor(0, 0, 0); // reset
  } else {
    // Espacio fijo para mantener el ancho
    doc.text("  ", checkboxTiempoSiX + 7, tiempoPerdidoY);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxTiempoSiX + 10, tiempoPerdidoY);
  
  // Checkbox NO para tiempo perdido con paréntesis - ANCHO MÁS GRANDE
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("NO (", checkboxTiempoNoX, tiempoPerdidoY);
  if (!datosFinales.tiempoPerdido) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(255, 0, 0); // rojo
    // X del NO tiempo perdido - coordenadas individuales
    const xTiempoNoX = checkboxTiempoNoX + 8;
    const xTiempoNoY = tiempoPerdidoY + 0.5;
    doc.text("X", xTiempoNoX, xTiempoNoY);
    doc.setTextColor(0, 0, 0); // reset
  } else {
    // Espacio más grande para paréntesis más anchos
    doc.text("    ", checkboxTiempoNoX + 7, tiempoPerdidoY);
  }
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(")", checkboxTiempoNoX + 12, tiempoPerdidoY);

  // Tiempo de Incapacidad en la misma línea
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Tiempo de Incapacidad: " + datosFinales.tiempoIncapacidad, 128, tiempoPerdidoY);

  // Causa básica - con ajuste automático de texto
  const causaBasicaY = tiempoPerdidoY + 5;
  
  // Solo dibujar el texto completo con ajuste automático y justificado
  const textoCompleto = "Especifique la causa básica (o describa el evento): " + datosFinales.causaBasica;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(textoCompleto, 30, causaBasicaY, { maxWidth: pageW - 50, align: "justify" });

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
