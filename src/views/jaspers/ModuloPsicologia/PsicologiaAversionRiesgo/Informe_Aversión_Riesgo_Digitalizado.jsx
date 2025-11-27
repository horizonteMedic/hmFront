import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import { convertirGenero, getSign } from "../../../utils/helpers.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import drawColorBox from '../../components/ColorBox.jsx';

export default function Informe_Aversion_Riesgo_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // DATOS DE PRUEBA (remover en producción)
  const datosPrueba = {
    apellidosPaciente: "GARCÍA MENDOZA",
    nombresPaciente: "JUAN CARLOS",
    fechaFichaAnexo16_fecha: "2024-01-15",
    sexoPaciente: "M",
    dniPaciente: "12345678",
    edadPaciente: "35",
    areaPaciente: "OPERACIONES MINA",
    cargoPaciente: "OPERADOR DE EQUIPO PESADO",
    empresa: "COMPAÑÍA MINERA PODEROSA S.A.",
    contrata: "CONTRATISTA EJEMPLO S.A.C.",
    norden: "00123456",
    sede: "TRUJILLO",
    fechaNacimientoPaciente: "1989-05-20",
    color: 1,
    codigoColor: "#00FF00",
    textoColor: "AT",
    // Aspectos Intelectuales
    practicaFuncional: "Alto",
    recursividad: "Alto",
    capacidadAtencionConcentracion: "Alto",
    // Aspectos Emocionales
    estabilidadEmocional: "Alto",
    flexibilidadManejoEmociones: "Alto",
    controlImpulsos: "Alto",
    // Competencias Específicas de Conducta Segura
    capacidadSubordinacion: "Alto",
    adecuacionNormas: "Alto",
    consideracionTerceros: "Alto",
    autonomiaTrabajo: "Alto",
    proactividad: "Alto",
    capacidadTrabajoPresion: "Alto",
    capacidadEvaluarRiesgos: "Alto",
    motivacionCargo: "Alto",
    // Análisis y Resultados
    analisisResultados: "CONTENIDO DE PRUEBA 1",
    recomendaciones: "CONTENIDO DE PRUEBA 2",
  };

  // Usar datos de prueba si no hay data real
  const dataFinal = Object.keys(data).length > 0 ? data : datosPrueba;

  const datosReales = {
    apellidosNombres: String(`${dataFinal.apellidosPaciente ?? ""} ${dataFinal.nombresPaciente ?? ""}`).trim(),
    fechaExamen: formatearFechaCorta(dataFinal.fechaFichaAnexo16_fecha ?? ""),
    tipoExamen: String(dataFinal.nombreExamen ?? ""),
    sexo: convertirGenero(dataFinal.sexoPaciente) || "",
    documentoIdentidad: String(dataFinal.dniPaciente ?? ""),
    edad: String(dataFinal.edadPaciente ?? ""),
    areaTrabajo: String(dataFinal.areaPaciente ?? ""),
    puestoTrabajo: String(dataFinal.cargoPaciente ?? ""),
    empresa: String(dataFinal.empresa ?? ""),
    contrata: String(dataFinal.contrata ?? ""),
    numeroFicha: String(dataFinal.norden ?? ""),
    sede: String(dataFinal.sede ?? dataFinal.nombreSede ?? ""),
    fechaNacimiento: formatearFechaCorta(dataFinal.fechaNacimientoPaciente ?? ""),
    codigoColor: String(dataFinal.codigoColor ?? ""),
    textoColor: String(dataFinal.textoColor ?? ""),
  };

  // === HEADER / CABECERA ===
  CabeceraLogo(doc, { ...datosReales, tieneMembrete: false });

  // Número de Ficha y Página
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(datosReales.numeroFicha, pageW - 60, 16);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + datosReales.sede, pageW - 80, 20);
  doc.text("Fecha de examen: " + datosReales.fechaExamen, pageW - 80, 25);

  // === COLOR BOX ===
  drawColorBox(doc, {
    color: datosReales.codigoColor,
    text: datosReales.textoColor,
    x: pageW - 30,
    y: 10,
    size: 22,
    showLine: true,
    fontSize: 30,
    textPosition: 0.9
  });

  // === TÍTULO PRINCIPAL ===
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("INFORME PSICOLÓGICO - AVERSIÓN AL RIESGO", pageW / 2, 35, { align: "center" });

  // === SECCIÓN: DATOS PERSONALES ===
  const tablaInicioX = 10;
  const tablaAncho = 190;
  let yPos = 38;
  const filaAltura = 6;

  // Header de datos personales
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("I. DATOS PERSONALES", tablaInicioX + 2, yPos + 4);
  yPos += filaAltura;

  // Fila 1: Apellidos y Nombres
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.apellidosNombres || "", tablaInicioX + 40, yPos + 4);
  yPos += filaAltura;

  // Fila 2: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  const col1W = 47.5;
  const col2W = 47.5;
  const col3W = 47.5;
  const col4W = 47.5;

  doc.rect(tablaInicioX, yPos, col1W, filaAltura, 'S');
  doc.rect(tablaInicioX + col1W, yPos, col2W, filaAltura, 'S');
  doc.rect(tablaInicioX + col1W + col2W, yPos, col3W, filaAltura, 'S');
  doc.rect(tablaInicioX + col1W + col2W + col3W, yPos, col4W, filaAltura, 'S');

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.documentoIdentidad || "", tablaInicioX + 12, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + col1W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosReales.edad || "") + " años", tablaInicioX + col1W + 14, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + col1W + col2W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.sexo || "", tablaInicioX + col1W + col2W + 14, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + col1W + col2W + col3W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.fechaNacimiento || "", tablaInicioX + col1W + col2W + col3W + 22, yPos + 4);
  yPos += filaAltura;

  // Fila 3: Puesto de Trabajo y Área de Trabajo (2 columnas)
  const col2MitadW = 95;
  doc.rect(tablaInicioX, yPos, col2MitadW, filaAltura, 'S');
  doc.rect(tablaInicioX + col2MitadW, yPos, col2MitadW, filaAltura, 'S');

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.puestoTrabajo || "", tablaInicioX + 32, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + col2MitadW + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.areaTrabajo || "", tablaInicioX + col2MitadW + 30, yPos + 4);
  yPos += filaAltura;

  // Fila 4: Empresa
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.empresa || "", tablaInicioX + 20, yPos + 4);
  yPos += filaAltura;

  // Fila 5: Contrata
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.contrata || "", tablaInicioX + 22, yPos + 4);
  yPos += filaAltura;

  // Datos adicionales para las secciones
  const datosAdicionales = {
    // Aspectos Intelectuales
    practicaFuncional: String(dataFinal.practicaFuncional ?? ""),
    recursividad: String(dataFinal.recursividad ?? ""),
    capacidadAtencionConcentracion: String(dataFinal.capacidadAtencionConcentracion ?? ""),
    // Aspectos Emocionales
    estabilidadEmocional: String(dataFinal.estabilidadEmocional ?? ""),
    flexibilidadManejoEmociones: String(dataFinal.flexibilidadManejoEmociones ?? ""),
    controlImpulsos: String(dataFinal.controlImpulsos ?? ""),
    // Competencias Específicas de Conducta Segura
    capacidadSubordinacion: String(dataFinal.capacidadSubordinacion ?? ""),
    adecuacionNormas: String(dataFinal.adecuacionNormas ?? ""),
    consideracionTerceros: String(dataFinal.consideracionTerceros ?? ""),
    autonomiaTrabajo: String(dataFinal.autonomiaTrabajo ?? ""),
    proactividad: String(dataFinal.proactividad ?? ""),
    capacidadTrabajoPresion: String(dataFinal.capacidadTrabajoPresion ?? ""),
    capacidadEvaluarRiesgos: String(dataFinal.capacidadEvaluarRiesgos ?? ""),
    motivacionCargo: String(dataFinal.motivacionCargo ?? ""),
    // Análisis y Resultados
    analisisResultados: String(dataFinal.analisisResultados ?? ""),
    recomendaciones: String(dataFinal.recomendaciones ?? ""),
  };

  // === TABLA DE ASPECTOS EVALUADOS ===
  // Header de la tabla
  const colCategoria = 30;
  const colAspecto = 75;
  const colBajo = 28;
  const colMedio = 28;
  const colAlto = 29;

  // Fila header con colores
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, colCategoria + colAspecto, filaAltura, 'F');
  doc.rect(tablaInicioX, yPos, colCategoria + colAspecto, filaAltura, 'S');
  
  // Columnas de colores
  doc.setFillColor(255, 0, 0); // Rojo - Bajo
  doc.rect(tablaInicioX + colCategoria + colAspecto, yPos, colBajo, filaAltura, 'F');
  doc.rect(tablaInicioX + colCategoria + colAspecto, yPos, colBajo, filaAltura, 'S');
  
  doc.setFillColor(255, 255, 0); // Amarillo - Medio
  doc.rect(tablaInicioX + colCategoria + colAspecto + colBajo, yPos, colMedio, filaAltura, 'F');
  doc.rect(tablaInicioX + colCategoria + colAspecto + colBajo, yPos, colMedio, filaAltura, 'S');
  
  doc.setFillColor(0, 255, 0); // Verde - Alto
  doc.rect(tablaInicioX + colCategoria + colAspecto + colBajo + colMedio, yPos, colAlto, filaAltura, 'F');
  doc.rect(tablaInicioX + colCategoria + colAspecto + colBajo + colMedio, yPos, colAlto, filaAltura, 'S');

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("Aspectos Evaluados", tablaInicioX + (colCategoria + colAspecto) / 2, yPos + 4, { align: "center" });
  doc.text("Bajo", tablaInicioX + colCategoria + colAspecto + colBajo / 2, yPos + 4, { align: "center" });
  doc.text("Medio", tablaInicioX + colCategoria + colAspecto + colBajo + colMedio / 2, yPos + 4, { align: "center" });
  doc.text("Alto", tablaInicioX + colCategoria + colAspecto + colBajo + colMedio + colAlto / 2, yPos + 4, { align: "center" });
  yPos += filaAltura;

  // Función para dibujar fila de aspecto evaluado
  const dibujarFilaAspecto = (categoria, aspecto, valor, y, rowSpan = 1, isFirstRow = true) => {
    // Celda categoría (solo si es primera fila del grupo)
    if (isFirstRow && rowSpan > 0) {
      doc.rect(tablaInicioX, y, colCategoria, filaAltura * rowSpan, 'S');
      doc.setFont("helvetica", "bold").setFontSize(7);
      // Centrar verticalmente el texto de categoría
      const lineas = doc.splitTextToSize(categoria, colCategoria - 2);
      const yTexto = y + (filaAltura * rowSpan) / 2 - (lineas.length * 2.5) / 2 + 2;
      lineas.forEach((linea, idx) => {
        doc.text(linea, tablaInicioX + colCategoria / 2, yTexto + idx * 3, { align: "center" });
      });
    }
    
    // Celda aspecto
    doc.rect(tablaInicioX + colCategoria, y, colAspecto, filaAltura, 'S');
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(aspecto, tablaInicioX + colCategoria + 2, y + 4);
    
    // Celdas Bajo, Medio, Alto
    doc.rect(tablaInicioX + colCategoria + colAspecto, y, colBajo, filaAltura, 'S');
    doc.rect(tablaInicioX + colCategoria + colAspecto + colBajo, y, colMedio, filaAltura, 'S');
    doc.rect(tablaInicioX + colCategoria + colAspecto + colBajo + colMedio, y, colAlto, filaAltura, 'S');
    
    // Marcar X según valor
    const valorLower = valor.toLowerCase();
    if (valorLower === "bajo") {
      doc.text("X", tablaInicioX + colCategoria + colAspecto + colBajo / 2, y + 4, { align: "center" });
    } else if (valorLower === "medio") {
      doc.text("X", tablaInicioX + colCategoria + colAspecto + colBajo + colMedio / 2, y + 4, { align: "center" });
    } else if (valorLower === "alto") {
      doc.text("X", tablaInicioX + colCategoria + colAspecto + colBajo + colMedio + colAlto / 2, y + 4, { align: "center" });
    }
    
    return y + filaAltura;
  };

  // Aspectos Intelectuales (3 filas)
  yPos = dibujarFilaAspecto("Aspectos\nIntelectuales", "Practica y Funcional", datosAdicionales.practicaFuncional, yPos, 3, true);
  yPos = dibujarFilaAspecto("", "Recursividad", datosAdicionales.recursividad, yPos, 0, false);
  yPos = dibujarFilaAspecto("", "Capacidad de atención y concentración", datosAdicionales.capacidadAtencionConcentracion, yPos, 0, false);

  // Aspectos Emocionales (3 filas)
  yPos = dibujarFilaAspecto("Aspectos\nEmocionales", "Estabilidad emocional - madurez", datosAdicionales.estabilidadEmocional, yPos, 3, true);
  yPos = dibujarFilaAspecto("", "Flexibilidad en el manejo de las emociones", datosAdicionales.flexibilidadManejoEmociones, yPos, 0, false);
  yPos = dibujarFilaAspecto("", "Control de impulsos", datosAdicionales.controlImpulsos, yPos, 0, false);

  // Competencias Específicas de Conducta Segura (8 filas)
  yPos = dibujarFilaAspecto("Competencias\nEspecíficas de\nConducta Segura", "Capacidad de subordinación", datosAdicionales.capacidadSubordinacion, yPos, 8, true);
  yPos = dibujarFilaAspecto("", "Adecuación a las normas y procedimientos", datosAdicionales.adecuacionNormas, yPos, 0, false);
  yPos = dibujarFilaAspecto("", "Consideración de terceros", datosAdicionales.consideracionTerceros, yPos, 0, false);
  yPos = dibujarFilaAspecto("", "Autonomía para trabajar", datosAdicionales.autonomiaTrabajo, yPos, 0, false);
  yPos = dibujarFilaAspecto("", "Proactividad", datosAdicionales.proactividad, yPos, 0, false);
  yPos = dibujarFilaAspecto("", "Capacidad para trabajar bajo presión", datosAdicionales.capacidadTrabajoPresion, yPos, 0, false);
  yPos = dibujarFilaAspecto("", "Capacidad para evaluar riesgos", datosAdicionales.capacidadEvaluarRiesgos, yPos, 0, false);
  yPos = dibujarFilaAspecto("", "Motivación por el cargo", datosAdicionales.motivacionCargo, yPos, 0, false);

  // === ANÁLISIS Y RESULTADOS ===
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("ANÁLISIS Y RESULTADOS", tablaInicioX + 2, yPos + 4);
  yPos += filaAltura;

  // Fila creciente para análisis
  const alturaMinima = 20;
  const padding = 3;
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  let alturaAnalisis = alturaMinima;
  if (datosAdicionales.analisisResultados && doc.getTextWidth(datosAdicionales.analisisResultados) > tablaAncho - 4) {
    const lineas = doc.splitTextToSize(datosAdicionales.analisisResultados, tablaAncho - 4);
    const alturaTexto = lineas.length * 3.5 + padding * 2;
    alturaAnalisis = Math.max(alturaMinima, alturaTexto);
  }
  
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaAnalisis, 'S');
  
  if (datosAdicionales.analisisResultados) {
    if (doc.getTextWidth(datosAdicionales.analisisResultados) > tablaAncho - 4) {
      const lineas = doc.splitTextToSize(datosAdicionales.analisisResultados, tablaAncho - 4);
      lineas.forEach((linea, idx) => {
        doc.text(linea, tablaInicioX + 2, yPos + padding + 2 + (idx * 3.5));
      });
    } else {
      doc.text(datosAdicionales.analisisResultados, tablaInicioX + 2, yPos + padding + 2);
    }
  }
  yPos += alturaAnalisis;

  // === RECOMENDACIONES ===
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("RECOMENDACIONES:", tablaInicioX + 2, yPos + 4);
  yPos += filaAltura;

  // Fila creciente para recomendaciones
  let alturaRecomendaciones = alturaMinima;
  if (datosAdicionales.recomendaciones && doc.getTextWidth(datosAdicionales.recomendaciones) > tablaAncho - 4) {
    const lineas = doc.splitTextToSize(datosAdicionales.recomendaciones, tablaAncho - 4);
    const alturaTexto = lineas.length * 3.5 + padding * 2;
    alturaRecomendaciones = Math.max(alturaMinima, alturaTexto);
  }
  
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaRecomendaciones, 'S');
  
  if (datosAdicionales.recomendaciones) {
    if (doc.getTextWidth(datosAdicionales.recomendaciones) > tablaAncho - 4) {
      const lineas = doc.splitTextToSize(datosAdicionales.recomendaciones, tablaAncho - 4);
      lineas.forEach((linea, idx) => {
        doc.text(linea, tablaInicioX + 2, yPos + padding + 2 + (idx * 3.5));
      });
    } else {
      doc.text(datosAdicionales.recomendaciones, tablaInicioX + 2, yPos + padding + 2);
    }
  }
  yPos += alturaRecomendaciones;

  // === FILA DE FIRMA DEL PSICÓLOGO ===
  const alturaFirma = 25;
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaFirma, 'S');
  
  // Agregar firma del psicólogo (imagen)
  let firmaPsicologoUrl = getSign(dataFinal, "SELLOFIRMA");
  if (firmaPsicologoUrl) {
    try {
      const imgWidth = 45;
      const imgHeight = 20;
      const x = tablaInicioX + (tablaAncho / 2) - (imgWidth / 2);
      const y = yPos + 2;
      doc.addImage(firmaPsicologoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del psicólogo:", error);
    }
  }
  yPos += alturaFirma;

  // === CONCLUSIONES ===
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CONCLUSIONES", tablaInicioX + 2, yPos + 4);
  yPos += filaAltura;

  // Fila de CUMPLE / NO CUMPLE CON EL PERFIL
  const colCumpleW = 47.5;
  doc.rect(tablaInicioX, yPos, colCumpleW, filaAltura, 'S');
  doc.rect(tablaInicioX + colCumpleW, yPos, colCumpleW, filaAltura, 'S');
  doc.rect(tablaInicioX + colCumpleW * 2, yPos, colCumpleW, filaAltura, 'S');
  doc.rect(tablaInicioX + colCumpleW * 3, yPos, colCumpleW, filaAltura, 'S');

  const cumplePerfil = dataFinal.cumplePerfil ?? true;
  
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("CUMPLE CON EL PERFIL", tablaInicioX + colCumpleW / 2, yPos + 4, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(cumplePerfil ? "X" : "", tablaInicioX + colCumpleW + colCumpleW / 2, yPos + 4, { align: "center" });
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("NO CUMPLE CON EL PERFIL", tablaInicioX + colCumpleW * 2 + colCumpleW / 2, yPos + 4, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(!cumplePerfil ? "X" : "", tablaInicioX + colCumpleW * 3 + colCumpleW / 2, yPos + 4, { align: "center" });
  yPos += filaAltura;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });

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

