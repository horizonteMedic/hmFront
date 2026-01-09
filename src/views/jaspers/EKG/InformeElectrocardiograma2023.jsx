import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { getSign, convertirGenero } from "../../utils/helpers";
import CabeceraLogo from "../components/CabeceraLogo.jsx";
import drawColorBox from "../components/ColorBox.jsx";
import footerTR from "../components/footerTR.jsx";

export default async function InformeElectrocardiograma2023(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  console.log("jaseper 2023");
  // Datos reales mapeados
  const datosFinales = {
    ritmo: String(data.mensajeRitmo ?? ""),
    frecuencia: data.mensajeFC ? `${String(data.mensajeFC)} x min` : "",
    eje: data.mensajeEje ? `${String(data.mensajeEje)} °` : "",
    ondaP: data.mensajeOndaP ? `${String(data.mensajeOndaP)} ms` : "",
    segmentoPR: data.mensajePr ? `${String(data.mensajePr)} ms` : "",
    ondaQRS: data.mensajeQrs ? `${String(data.mensajeQrs)} ms` : "",
    segmentoST: String(data.mensajeSt ?? ""),
    ondaT: String(data.mensajeOndaT ?? ""),
    segmentoQT: data.mensajeQtC ? `${String(data.mensajeQtC)} ms` : "",
    observaciones: String(data.hallazgo ?? ""),
    conclusion: String(data.conclusion ?? ""),
    recomendaciones: String(data.recomendaciones ?? ""),
    // Datos personales
    nombres: String(data.nombres ?? ""),
    dni: String(data.dni ?? ""),
    edad: String(data.edad ?? ""),
    sexo: convertirGenero(data.sexo ?? ""),
    fechaNac: formatearFechaCorta(data.fechaNac ?? ""),
    procedencia: String(data.procedencia ?? ""),
    empresa: String(data.empresa ?? ""),
    contrata: String(data.contrata ?? ""),
    presionArterial: String(data.presionArterial ?? ""),
    // Datos para header
    numeroFicha: String(data.norden ?? data.n_orden ?? data.norden_n_orden ?? ""),
    sede: data.sede || data.nombreSede || "",
    fechaExamen: formatearFechaCorta(data.fechaExamen ?? data.fechaInforme ?? data.fechaApertura_fecha_apertura_po ?? ""),
    color: data.color || data.informacionSede?.color || 1,
    codigoColor: data.codigoColor || data.informacionSede?.codigoColor || "#008f39",
    textoColor: data.textoColor || data.informacionSede?.textoColor || "F",
  };

  // Header reutilizable
  const drawHeader = async (pageNumber) => {
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("INFORME DE ELECTROCARDIOGRAMA", pageW / 2, 32.5, { align: "center" });

    // Número de Ficha y Página
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha || "", pageW - 60, 16);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + (datosFinales.sede || ""), pageW - 80, 20);
    doc.text("Fecha de examen: " + (datosFinales.fechaExamen || ""), pageW - 80, 25);

    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 30, 10);

    // Bloque de color
    drawColorBox(doc, {
      color: datosFinales.codigoColor,
      text: datosFinales.textoColor,
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  };

  // === DIBUJAR HEADER ===
  await drawHeader(1);

  // === FUNCIONES AUXILIARES ===
  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;

    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // Dibujar fondo gris
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');

    // Dibujar líneas del header
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);

    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);

    return yPos + alturaHeader;
  };

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 40; // Posición inicial después del título
  const filaAltura = 5; // Altura fija de 5mm para datos personales

  // Header de datos personales
  yPos = await dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido - centrado verticalmente en fila de 5mm
  const textoY = yPos + (filaAltura / 2) + (8 * 0.35) / 2; // Centrado vertical
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, textoY);
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (datosFinales.nombres) {
    const lineasNombres = doc.splitTextToSize(datosFinales.nombres.toUpperCase(), tablaAncho - 45);
    doc.text(lineasNombres, tablaInicioX + 40, textoY);
  }
  yPos += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido - centrado verticalmente
  const textoY2 = yPos + (filaAltura / 2) + (8 * 0.35) / 2;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, textoY2);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.dni, tablaInicioX + 12, textoY2);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, textoY2);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.edad ? `${datosFinales.edad} AÑOS` : "", tablaInicioX + 58, textoY2);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, textoY2);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.sexo ? datosFinales.sexo.toUpperCase() : "", tablaInicioX + 105, textoY2);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, textoY2);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNac, tablaInicioX + 155, textoY2);
  yPos += filaAltura;

  // Tercera fila: Procedencia (si existe)
  if (datosFinales.procedencia) {
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    // Contenido - centrado verticalmente
    const textoY3 = yPos + (filaAltura / 2) + (8 * 0.35) / 2;
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Procedencia:", tablaInicioX + 2, textoY3);
    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineasProcedencia = doc.splitTextToSize(datosFinales.procedencia.toUpperCase(), tablaAncho - 35);
    doc.text(lineasProcedencia, tablaInicioX + 30, textoY3);
    yPos += filaAltura;
  }

  // Cuarta fila: Empresa (si existe)
  if (datosFinales.empresa) {
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    // Contenido - centrado verticalmente
    const textoY4 = yPos + (filaAltura / 2) + (8 * 0.35) / 2;
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Empresa:", tablaInicioX + 2, textoY4);
    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineasEmpresa = doc.splitTextToSize(datosFinales.empresa.toUpperCase(), tablaAncho - 30);
    doc.text(lineasEmpresa, tablaInicioX + 24, textoY4);
    yPos += filaAltura;
  }

  // Quinta fila: Contratista (si existe)
  if (datosFinales.contrata) {
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    // Contenido - centrado verticalmente
    const textoY5 = yPos + (filaAltura / 2) + (8 * 0.35) / 2;
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Contratista:", tablaInicioX + 2, textoY5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineasContrata = doc.splitTextToSize(datosFinales.contrata.toUpperCase(), tablaAncho - 30);
    doc.text(lineasContrata, tablaInicioX + 24, textoY5);
    yPos += filaAltura;
  }

  // Sexta fila: Presión Arterial (si existe)
  if (datosFinales.presionArterial) {
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    // Contenido - centrado verticalmente
    const textoY6 = yPos + (filaAltura / 2) + (8 * 0.35) / 2;
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Presión Arterial:", tablaInicioX + 2, textoY6);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.presionArterial, tablaInicioX + 35, textoY6);
    yPos += filaAltura;
  }

  // === SECCIÓN 2: PARÁMETROS EKG ===
  yPos = dibujarHeaderSeccion("2. PARÁMETROS ELECTROCARDIOGRÁFICOS", yPos, 5);

  // Función para dibujar una fila de parámetro EKG
  const dibujarFilaParametroEKG = (label, valor) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura); // División label/valor
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    // Contenido de la fila
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(label + ":", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(valor || "", tablaInicioX + 65, yPos + 3.5);

    yPos += filaAltura;
  };

  // Dibujar filas de parámetros EKG
  dibujarFilaParametroEKG("RITMO", datosFinales.ritmo);
  dibujarFilaParametroEKG("FRECUENCIA", datosFinales.frecuencia);
  dibujarFilaParametroEKG("EJE", datosFinales.eje);
  dibujarFilaParametroEKG("ONDA P", datosFinales.ondaP);
  dibujarFilaParametroEKG("SEGMENTO PR", datosFinales.segmentoPR);
  dibujarFilaParametroEKG("ONDA QRS", datosFinales.ondaQRS);
  dibujarFilaParametroEKG("SEGMENTO ST", datosFinales.segmentoST);
  dibujarFilaParametroEKG("ONDA T", datosFinales.ondaT);
  dibujarFilaParametroEKG("SEGMENTO QTC", datosFinales.segmentoQT);

  // === SECCIÓN 3: HALLAZGOS ===
  yPos = dibujarHeaderSeccion("3. HALLAZGOS", yPos, 5);

  // Calcular altura dinámica para hallazgos (mínimo 20mm)
  const alturaMinimaHallazgos = 20;
  const calcularAlturaHallazgos = (texto, anchoMaximo) => {
    if (!texto) return alturaMinimaHallazgos;
    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineas = doc.splitTextToSize(texto, anchoMaximo);
    return Math.max(alturaMinimaHallazgos, lineas.length * 3.5 + 3);
  };

  const anchoDisponibleHallazgos = tablaAncho - 4;
  const alturaHallazgos = calcularAlturaHallazgos(datosFinales.observaciones, anchoDisponibleHallazgos);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHallazgos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHallazgos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaHallazgos, tablaInicioX + tablaAncho, yPos + alturaHallazgos);

  // Contenido de hallazgos
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (datosFinales.observaciones) {
    const lineasHallazgos = doc.splitTextToSize(datosFinales.observaciones, anchoDisponibleHallazgos);
    doc.text(lineasHallazgos, tablaInicioX + 2, yPos + 3.5);
  }
  yPos += alturaHallazgos;

  // === SECCIÓN 4: CONCLUSIÓN ===
  yPos = dibujarHeaderSeccion("4. CONCLUSIÓN", yPos, 5);

  // Calcular altura dinámica para conclusión
  const alturaConclusion = calcularAlturaHallazgos(datosFinales.conclusion, anchoDisponibleHallazgos);

  // Dibujar líneas de la fila dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaConclusion);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaConclusion);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaConclusion, tablaInicioX + tablaAncho, yPos + alturaConclusion);

  // Contenido de conclusión
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (datosFinales.conclusion) {
    const lineasConclusion = doc.splitTextToSize(datosFinales.conclusion, anchoDisponibleHallazgos);
    doc.text(lineasConclusion, tablaInicioX + 2, yPos + 3.5);
  }
  yPos += alturaConclusion;

  // === SECCIÓN 5: RECOMENDACIONES ===
  if (datosFinales.recomendaciones) {
    yPos = dibujarHeaderSeccion("5. RECOMENDACIONES", yPos, 5);

    // Procesar recomendaciones
    const items = procesarRecomendaciones(datosFinales.recomendaciones);

    // Calcular altura necesaria para todas las recomendaciones (mínimo 20mm)
    const alturaMinimaRecomendaciones = 20;
    let alturaTotalRecomendaciones = 0;
    items.forEach(item => {
      const lineas = doc.splitTextToSize(item, anchoDisponibleHallazgos - 5);
      alturaTotalRecomendaciones += Math.max(alturaMinimaRecomendaciones, lineas.length * 3.5 + 2);
    });

    const alturaRecomendaciones = Math.max(alturaMinimaRecomendaciones, alturaTotalRecomendaciones);

    // Dibujar líneas de la fila dinámica
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaRecomendaciones);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaRecomendaciones);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaRecomendaciones, tablaInicioX + tablaAncho, yPos + alturaRecomendaciones);

    // Contenido de recomendaciones
    doc.setFont("helvetica", "normal").setFontSize(8);
    let yActualRecomendaciones = yPos + 3.5;
    items.forEach((item) => {
      // Viñeta
      doc.text("-", tablaInicioX + 2, yActualRecomendaciones);

      // Texto del item (puede ser multilínea)
      const lineas = doc.splitTextToSize(item, anchoDisponibleHallazgos - 5);
      lineas.forEach((line, lineIndex) => {
        doc.text(line, tablaInicioX + 7, yActualRecomendaciones + lineIndex * 3.5);
      });

      yActualRecomendaciones += Math.max(alturaMinimaRecomendaciones - 3.5, lineas.length * 3.5);
    });

    yPos += alturaRecomendaciones;
  }

  // === SECCIÓN 6: FIRMA Y SELLO DEL MÉDICO ===
  const alturaSeccionFirma = 30; // Altura para la sección de firma
  const yFirmas = yPos;

  // Dibujar líneas de la sección de firma (bordes)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yFirmas, tablaInicioX, yFirmas + alturaSeccionFirma); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirma); // Línea derecha
  doc.line(tablaInicioX, yFirmas, tablaInicioX + tablaAncho, yFirmas); // Línea superior
  doc.line(tablaInicioX, yFirmas + alturaSeccionFirma, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirma); // Línea inferior

  // === SELLO Y FIRMA DEL MÉDICO (CENTRADO) ===
  const firmaMedicoY = yFirmas + 3;
  const centroX = tablaInicioX + tablaAncho / 2; // Centro de la tabla

  // Agregar firma y sello médico
  const firmaMedicoUrl = getSign(data, "SELLOFIRMA");
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 45;
      const imgHeight = 20;
      const x = centroX - (imgWidth / 2); // Centrar horizontalmente
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }

  // Texto debajo de la firma
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Sello y Firma del Médico", centroX, yFirmas + 26, { align: "center" });

  yPos += alturaSeccionFirma;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });
  // === Imprimir ===
  if (docExistente) {
    return doc;
  } else {
    imprimir(doc);
  }
}


// -------------------------------
// Helpers
function procesarRecomendaciones(texto) {
  if (!texto) return [];

  // Dividir por saltos de línea y limpiar
  let items = texto
    .split("\n") // Dividir por saltos de línea
    .map((item) => item.trim()) // Limpiar espacios
    .filter((item) => item.length > 0) // Eliminar items vacíos
    .map((item) => (item.endsWith(".") ? item : item + ".")); // Agregar punto si no lo tiene

  // Si no hay items, crear uno con el texto original
  if (items.length === 0) {
    items = [texto];
  }

  return items;
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
