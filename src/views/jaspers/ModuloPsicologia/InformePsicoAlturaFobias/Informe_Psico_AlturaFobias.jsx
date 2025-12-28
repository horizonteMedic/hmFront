import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import { convertirGenero } from "../../../utils/helpers.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import drawColorBox from '../../components/ColorBox.jsx';

export default async function Informe_Psico_AlturaFobias(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Función auxiliar para obtener el valor seleccionado de los criterios intelectuales
  const obtenerValorCriterio = (data, prefijo) => {
    if (data[`${prefijo}I`]) return "I";
    if (data[`${prefijo}NPI`]) return "NPI";
    if (data[`${prefijo}NP`]) return "NP";
    if (data[`${prefijo}NPS`]) return "NPS";
    if (data[`${prefijo}S`]) return "S";
    return "";
  };

  // Consolidar todos los datos en un solo objeto 'datos'
  const datos = {
    // Datos personales
    apellidosNombres: String(`${data.apellidosPaciente ?? ""} ${data.nombresPaciente ?? ""}`).trim(),
    fechaExamen: formatearFechaCorta(data.fecha ?? data.fechaRegistro ?? ""),
    tipoExamen: String(data.nombreExamen ?? ""),
    nombreExamenPsicologico: String(data.nombreExamenPsicologico ?? ""),
    sexo: convertirGenero(data.sexoPaciente) || "",
    documentoIdentidad: String(data.dniPaciente ?? ""),
    edad: String(data.edadPaciente ?? ""),
    areaTrabajo: String(data.areaPaciente ?? ""),
    puestoTrabajo: String(data.cargoPaciente ?? ""),
    empresa: String(data.empresa ?? ""),
    contrata: String(data.contrata ?? ""),
    numeroFicha: String(data.norden ?? ""),
    sede: String(data.sede ?? data.nombreSede ?? ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente ?? ""),
    codigoColor: String(data.codigoColor ?? ""),
    textoColor: String(data.textoColor ?? ""),
    // Aspecto Intelectual
    razonamiento: obtenerValorCriterio(data, "razonamiento"),
    memoria: obtenerValorCriterio(data, "memoria"),
    atencionConcentracion: obtenerValorCriterio(data, "atencion"),
    coordinacionVisoMotora: obtenerValorCriterio(data, "coordinacion"),
    orientacionEspacial: obtenerValorCriterio(data, "orientacion"),
    // Aspectos Personalidad
    estabilidadEmocional: data.estabilidadInestable ? "Inestable" : (data.estabilidadEstable ? "Estable" : ""),
    nivelAnsiedad: data.nivelAnsiedadCaso ? "Caso" : (data.nivelAnsiedadNoCaso ? "No Caso" : ""),
    consumoAlcohol: data.consumoAlcoholCaso ? "Caso" : (data.consumoAlcoholNoCaso ? "No Caso" : ""),
    fobiaAltura: data.fobiaAlturaNada ? "Nada" :
      data.fobiaAlturaLigeramente ? "Ligeramente" :
        data.fobiaAlturaModeradamente ? "Moderadamente" :
          data.fobiaAlturaMarcadamente ? "Marcadamente" :
            data.fobiaAlturaMiedoExtremo ? "Miedo Extremo" : "",
    // Análisis y Resultados
    analisisResultados: String(data.analisis ?? data.analisisResultados ?? ""),
    recomendaciones: String(data.recomendacion ?? data.recomendaciones ?? ""),
    // Conclusiones
    apto: data.apto ?? false,
    noApto: data.noApto ?? false,
    // Datos originales para firma
    digitalizacion: data.digitalizacion ?? [],
    usuarioFirma: data.usuarioFirma ?? "",
  };

  // === HEADER / CABECERA ===
  await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

  // Número de Ficha y Página
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(datos.numeroFicha, pageW - 60, 16);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + datos.sede, pageW - 80, 20);
  doc.text("Fecha de examen: " + datos.fechaExamen, pageW - 80, 25);

  // === COLOR BOX ===
  drawColorBox(doc, {
    color: datos.codigoColor,
    text: datos.textoColor,
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
  doc.text(datos.nombreExamenPsicologico, pageW / 2, 35, { align: "center" });

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
  doc.text(datos.apellidosNombres || "", tablaInicioX + 40, yPos + 4);
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
  doc.text(datos.documentoIdentidad || "", tablaInicioX + 12, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + col1W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datos.edad || "") + " años", tablaInicioX + col1W + 14, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + col1W + col2W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.sexo || "", tablaInicioX + col1W + col2W + 14, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + col1W + col2W + col3W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.fechaNacimiento || "", tablaInicioX + col1W + col2W + col3W + 22, yPos + 4);
  yPos += filaAltura;

  // Fila 3: Puesto de Trabajo y Área de Trabajo (2 columnas)
  const col2MitadW = 95;
  doc.rect(tablaInicioX, yPos, col2MitadW, filaAltura, 'S');
  doc.rect(tablaInicioX + col2MitadW, yPos, col2MitadW, filaAltura, 'S');

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.puestoTrabajo || "", tablaInicioX + 32, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + col2MitadW + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.areaTrabajo || "", tablaInicioX + col2MitadW + 30, yPos + 4);
  yPos += filaAltura;

  // Fila 4: Empresa
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.empresa || "", tablaInicioX + 20, yPos + 4);
  yPos += filaAltura;

  // Fila 5: Contrata
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.contrata || "", tablaInicioX + 22, yPos + 4);
  yPos += filaAltura;

  // === SECCIÓN: CRITERIOS PSICOLÓGICOS ===
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("II. CRITERIOS PSICOLÓGICOS", tablaInicioX + 2, yPos + 4);
  yPos += filaAltura;

  // === Aspecto Intelectual ===
  const colCriterio = 70; // Reducido para dar más espacio a las opciones
  const colOpciones = (tablaAncho - colCriterio) / 5; // 5 columnas: I, NPI, NP, NPS, S

  // Header de Aspecto Intelectual con opciones
  doc.setFillColor(220, 220, 220);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  
  // Dibujar líneas verticales
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + colCriterio, yPos, tablaInicioX + colCriterio, yPos + filaAltura);
  doc.line(tablaInicioX + colCriterio + colOpciones, yPos, tablaInicioX + colCriterio + colOpciones, yPos + filaAltura);
  doc.line(tablaInicioX + colCriterio + colOpciones * 2, yPos, tablaInicioX + colCriterio + colOpciones * 2, yPos + filaAltura);
  doc.line(tablaInicioX + colCriterio + colOpciones * 3, yPos, tablaInicioX + colCriterio + colOpciones * 3, yPos + filaAltura);
  doc.line(tablaInicioX + colCriterio + colOpciones * 4, yPos, tablaInicioX + colCriterio + colOpciones * 4, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Aspecto Intelectual", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("I", tablaInicioX + colCriterio + colOpciones / 2, yPos + filaAltura / 2 + 1, { align: "center" });
  doc.text("NPI", tablaInicioX + colCriterio + colOpciones + colOpciones / 2, yPos + filaAltura / 2 + 1, { align: "center" });
  doc.text("NP", tablaInicioX + colCriterio + colOpciones * 2 + colOpciones / 2, yPos + filaAltura / 2 + 1, { align: "center" });
  doc.text("NPS", tablaInicioX + colCriterio + colOpciones * 3 + colOpciones / 2, yPos + filaAltura / 2 + 1, { align: "center" });
  doc.text("S", tablaInicioX + colCriterio + colOpciones * 4 + colOpciones / 2, yPos + filaAltura / 2 + 1, { align: "center" });
  yPos += filaAltura;

  // Función para dibujar checkbox marcado
  const dibujarCheckbox = (x, y, marcado, alturaFila = filaAltura) => {
    if (marcado) {
      doc.setFont("helvetica", "bold").setFontSize(11.3);
      doc.setTextColor(0, 51, 204); // #0033cc
      doc.text("X", x, y + alturaFila / 2 + 1, { align: "center" });
      doc.setTextColor(0, 0, 0); // Volver a negro
    }
  };

  // Función para dibujar fila de criterio intelectual
  const dibujarFilaCriterioIntelectual = (texto, valor) => {
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + colCriterio, yPos, tablaInicioX + colCriterio, yPos + filaAltura);
    doc.line(tablaInicioX + colCriterio + colOpciones, yPos, tablaInicioX + colCriterio + colOpciones, yPos + filaAltura);
    doc.line(tablaInicioX + colCriterio + colOpciones * 2, yPos, tablaInicioX + colCriterio + colOpciones * 2, yPos + filaAltura);
    doc.line(tablaInicioX + colCriterio + colOpciones * 3, yPos, tablaInicioX + colCriterio + colOpciones * 3, yPos + filaAltura);
    doc.line(tablaInicioX + colCriterio + colOpciones * 4, yPos, tablaInicioX + colCriterio + colOpciones * 4, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(texto, tablaInicioX + 2, yPos + filaAltura / 2 + 1);
    
    if (valor === "I") {
      dibujarCheckbox(tablaInicioX + colCriterio + colOpciones / 2, yPos, true, filaAltura);
    } else if (valor === "NPI") {
      dibujarCheckbox(tablaInicioX + colCriterio + colOpciones + colOpciones / 2, yPos, true, filaAltura);
    } else if (valor === "NP") {
      dibujarCheckbox(tablaInicioX + colCriterio + colOpciones * 2 + colOpciones / 2, yPos, true, filaAltura);
    } else if (valor === "NPS") {
      dibujarCheckbox(tablaInicioX + colCriterio + colOpciones * 3 + colOpciones / 2, yPos, true, filaAltura);
    } else if (valor === "S") {
      dibujarCheckbox(tablaInicioX + colCriterio + colOpciones * 4 + colOpciones / 2, yPos, true, filaAltura);
    }
    
    yPos += filaAltura;
  };

  // Dibujar criterios intelectuales
  dibujarFilaCriterioIntelectual("Razonamiento", datos.razonamiento);
  dibujarFilaCriterioIntelectual("Memoria", datos.memoria);
  dibujarFilaCriterioIntelectual("Atencion y Concentración", datos.atencionConcentracion);
  dibujarFilaCriterioIntelectual("Coordinación viso-motora", datos.coordinacionVisoMotora);
  dibujarFilaCriterioIntelectual("Orientación Espacial", datos.orientacionEspacial);

  // Línea inferior del bloque de Aspecto Intelectual
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

  // === Aspectos Personalidad ===
  doc.setFillColor(220, 220, 220);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Aspectos Personalidad", tablaInicioX + 2, yPos + 4);
  yPos += filaAltura;

  // === FUNCIÓN MEJORADA PARA CENTRADO PERFECTO ===
  const dibujarFilaCriterioPersonalidad = (texto, opciones, valor) => {
    const numOpciones = opciones.length;
    const anchoDisponible = tablaAncho - colCriterio;
    // Cada opción tiene solo una columna (sin columna de X separada)
    const colOpcion = anchoDisponible / numOpciones;

    // Línea superior
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

    // Líneas verticales
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + colCriterio, yPos, tablaInicioX + colCriterio, yPos + filaAltura);

    let xActual = tablaInicioX + colCriterio;
    for (let i = 0; i < numOpciones; i++) {
      xActual += colOpcion;
      doc.line(xActual, yPos, xActual, yPos + filaAltura);
    }
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);

    // Texto del criterio (izquierda) - centrado verticalmente
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(texto, tablaInicioX + 2, yPos + filaAltura / 2 + 2);

    // Dibujar opciones (con X encima del texto si está seleccionada)
    xActual = tablaInicioX + colCriterio;
    opciones.forEach((opcion) => {
      const xCentro = xActual + colOpcion / 2;

      doc.setFont("helvetica", "normal").setFontSize(7);
      const lineas = doc.splitTextToSize(opcion, colOpcion - 4);
      const alturaTotalTexto = lineas.length * 3; // ~3mm por línea

      // Cálculo preciso del Y para centrar verticalmente el texto
      const yTextoInicio = yPos + (filaAltura - alturaTotalTexto) / 2 + 2.5;

      // Dibujar texto de la opción
      lineas.forEach((linea, idx) => {
        doc.text(linea, xCentro, yTextoInicio + idx * 3, { align: "center" });
      });

      // Dibujar X encima del texto si está seleccionada
      if (valor && opcion.toLowerCase().includes(valor.toLowerCase())) {
        // La X va encima del texto, centrada en la misma columna
        dibujarCheckbox(xCentro, yPos, true, filaAltura);
      }

      xActual += colOpcion;
    });

    yPos += filaAltura;
  };

  // Criterios de personalidad (ahora con centrado perfecto)
  dibujarFilaCriterioPersonalidad("Estabilidad emocional", ["Inestable", "Estable"], datos.estabilidadEmocional);
  dibujarFilaCriterioPersonalidad("Nivel de ansiedad y Tendencias", ["Caso", "No Caso"], datos.nivelAnsiedad);
  dibujarFilaCriterioPersonalidad("Consumo de Alcohol", ["Caso", "No Caso"], datos.consumoAlcohol);
  dibujarFilaCriterioPersonalidad("Fobia a la altura", ["Nada", "Ligeramente", "Moderadamente", "Marcadamente", "Miedo Extremo"], datos.fobiaAltura);

  // Línea inferior del bloque de Aspectos Personalidad
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

  // === ANÁLISIS Y RESULTADOS ===
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("ANÁLISIS Y RESULTADOS:", tablaInicioX + 2, yPos + 4);
  yPos += filaAltura;

  const alturaMinima = 20;
  const padding = 3;
  doc.setFont("helvetica", "normal").setFontSize(8);

  let alturaAnalisis = alturaMinima;
  if (datos.analisisResultados) {
    const lineas = doc.splitTextToSize(datos.analisisResultados, tablaAncho - 4);
    const alturaTexto = lineas.length * 3.5 + padding * 2;
    alturaAnalisis = Math.max(alturaMinima, alturaTexto);
  }

  doc.rect(tablaInicioX, yPos, tablaAncho, alturaAnalisis, 'S');

  if (datos.analisisResultados) {
    const lineas = doc.splitTextToSize(datos.analisisResultados, tablaAncho - 4);
    lineas.forEach((linea, idx) => {
      doc.text(linea, tablaInicioX + 2, yPos + padding + 2 + (idx * 3.5));
    });
  }
  yPos += alturaAnalisis;

  // === RECOMENDACIONES ===
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("RECOMENDACIONES:", tablaInicioX + 2, yPos + 4);
  yPos += filaAltura;

  const anchoFirma = 60;
  const anchoRecomendaciones = tablaAncho - anchoFirma - 2;

  let alturaRecomendaciones = alturaMinima;
  if (datos.recomendaciones) {
    const lineas = doc.splitTextToSize(datos.recomendaciones, anchoRecomendaciones - 4);
    const alturaTexto = lineas.length * 3.5 + padding * 2;
    alturaRecomendaciones = Math.max(alturaMinima, alturaTexto);
  }

  const alturaMinimaFirma = 25;
  alturaRecomendaciones = Math.max(alturaRecomendaciones, alturaMinimaFirma);

  doc.rect(tablaInicioX, yPos, tablaAncho, alturaRecomendaciones, 'S');
  doc.line(tablaInicioX + anchoRecomendaciones, yPos, tablaInicioX + anchoRecomendaciones, yPos + alturaRecomendaciones);

  doc.setFont("helvetica", "normal").setFontSize(8);
  if (datos.recomendaciones) {
    const lineas = doc.splitTextToSize(datos.recomendaciones, anchoRecomendaciones - 4);
    lineas.forEach((linea, idx) => {
      doc.text(linea, tablaInicioX + 2, yPos + padding + 2 + (idx * 3.5));
    });
  }

  // Firma
  const digitalizacion = data.digitalizacion || [];
  const sello1 = digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const sello2 = digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMADOCASIG");
  const isValidUrl = url => url && url !== "Sin registro";

  const loadImg = src =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        res(compressedDataUrl);
      };
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });

  try {
    const [s1, s2] = await Promise.all([
      isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
      isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
    ]);

    const sigW = 48;
    const sigH = 20;
    const sigY = yPos + (alturaRecomendaciones / 2) - (sigH / 2);
    const gap = 16;
    const xInicioFirma = tablaInicioX + anchoRecomendaciones + 2;
    const centroXFirma = xInicioFirma + (anchoFirma / 2);

    if (s1 && s2) {
      const totalWidth = sigW * 2 + gap;
      const startX = centroXFirma - totalWidth / 2;
      doc.addImage(s1, 'JPEG', startX, sigY, sigW, sigH);
      doc.addImage(s2, 'JPEG', startX + sigW + gap, sigY, sigW, sigH);
    } else if (s1) {
      doc.addImage(s1, 'JPEG', centroXFirma - sigW / 2, sigY, sigW, sigH);
    } else if (s2) {
      doc.addImage(s2, 'JPEG', centroXFirma - sigW / 2, sigY, sigW, sigH);
    }

    if (s1 || s2) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      const nombreProfesional = data.usuarioFirma || "";
      const lineasNombre = doc.splitTextToSize(nombreProfesional, anchoFirma - 4);
      const yNombre = yPos + alturaRecomendaciones - (lineasNombre.length * 3) - 2;
      lineasNombre.forEach((linea, idx) => {
        doc.text(linea, centroXFirma, yNombre + (idx * 3), { align: "center" });
      });
    }
  } catch (error) {
    console.log("Error cargando firma:", error);
  }

  yPos += alturaRecomendaciones;

  // === CONCLUSIONES ===
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CONCLUSIONES", tablaInicioX + 2, yPos + 4);
  yPos += filaAltura;

  const colCumpleW = 95;
  doc.rect(tablaInicioX, yPos, colCumpleW, filaAltura, 'S');
  doc.rect(tablaInicioX + colCumpleW, yPos, colCumpleW, filaAltura, 'S');

  const esApto = datos.apto ?? false;

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("APTO", tablaInicioX + colCumpleW / 2, yPos + 4, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(esApto ? "X" : "", tablaInicioX + colCumpleW + colCumpleW / 2, yPos + 4, { align: "center" });
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("NO APTO", tablaInicioX + colCumpleW * 2 + colCumpleW / 2, yPos + 4, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(!esApto ? "X" : "", tablaInicioX + colCumpleW * 3 + colCumpleW / 2, yPos + 4, { align: "center" });
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
