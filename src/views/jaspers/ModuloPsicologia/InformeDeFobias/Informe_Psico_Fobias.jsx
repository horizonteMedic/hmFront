import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import { convertirGenero } from "../../../utils/helpers.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import drawColorBox from '../../components/ColorBox.jsx';
import { dibujarFirmas } from '../../../utils/dibujarFirmas.js';

export default async function INFORME_ADICIONAL_DE_FOBIAS_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  const datosReales = {
    apellidosNombres: String(`${data.apellidosPaciente ?? ""} ${data.nombresPaciente ?? ""}`).trim(),
    fechaExamen: formatearFechaCorta(data.fechaRegistro ?? ""),
    tipoExamen: String(data.tipoExamen ?? ""),
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
  };

  // === HEADER / CABECERA ===
  await CabeceraLogo(doc, { ...datosReales, tieneMembrete: false });

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
  doc.text("INFORME PSICOLÓGICO - FOBIAS", pageW / 2, 35, { align: "center" });

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
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 4);
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

  // Fila 3: Puesto de Trabajo
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.puestoTrabajo || "", tablaInicioX + 32, yPos + 4);
  yPos += filaAltura;

  // Fila 4: Área de Trabajo
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.areaTrabajo || "", tablaInicioX + 30, yPos + 4);
  yPos += filaAltura;

  // Fila 5: Empresa
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.empresa || "", tablaInicioX + 20, yPos + 4);
  yPos += filaAltura;

  // Fila 6: Contrata
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.contrata || "", tablaInicioX + 22, yPos + 4);
  yPos += filaAltura;

  // Datos adicionales para las secciones - usando solo las claves exactas del JSON
  const datosAdicionales = {
    inteligencia: String(data.criterioInteligencia ?? ""),
    fobias: String(data.criterioFobias ?? ""),
    fortalezasOportunidades: String(data.analisisFodaFortalezasOportunidades ?? ""),
    amenazasDebilidades: String(data.analisisFodaAmenazasDebilidades ?? ""),
    observaciones: String(data.observaciones ?? ""),
    recomendaciones: String(data.recomendaciones ?? ""),
    apto: data.perfilApto ?? false,
  };

  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    if (!texto) return y;

    const lineas = doc.splitTextToSize(texto, anchoMaximo);
    const interlineado = 3.5;

    lineas.forEach((linea, index) => {
      doc.text(linea, x, y + (index * interlineado));
    });

    return y + (lineas.length * interlineado);
  };

  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 6) => {
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
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + 4);

    return yPos + alturaHeader;
  };

  // Función para calcular altura dinámica de texto
  const calcularAlturaTexto = (texto, anchoMaximo, alturaMinima = 30) => {
    if (!texto) return alturaMinima;

    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineas = doc.splitTextToSize(texto, anchoMaximo);
    const interlineado = 3.5;

    // Altura calculada + padding superior
    const alturaCalculada = lineas.length * interlineado + 2;
    return Math.max(alturaCalculada, alturaMinima);
  };

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // === SECCIÓN II: CRITERIOS PSICOLÓGICOS ===
  yPos = dibujarHeaderSeccion("II. CRITERIOS PSICOLÓGICOS", yPos, filaAltura);

  // Fila 1: INTELIGENCIA
  const alturaInteligencia = calcularAlturaTexto(datosAdicionales.inteligencia, tablaAncho - 60, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaInteligencia);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + alturaInteligencia);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaInteligencia);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaInteligencia, tablaInicioX + tablaAncho, yPos + alturaInteligencia);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("- INTELIGENCIA", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosAdicionales.inteligencia, tablaInicioX + 62, yPos + 3.5, tablaAncho - 64);
  yPos += alturaInteligencia;

  // Fila 2: FOBIAS
  const alturaFobias = calcularAlturaTexto(datosAdicionales.fobias, tablaAncho - 60, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFobias);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + alturaFobias);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFobias);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFobias, tablaInicioX + tablaAncho, yPos + alturaFobias);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("- FOBIAS", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosAdicionales.fobias, tablaInicioX + 62, yPos + 3.5, tablaAncho - 64);
  yPos += alturaFobias;

  // === SECCIÓN III: ANÁLISIS FODA ===
  yPos = dibujarHeaderSeccion("III. ANÁLISIS FODA", yPos, filaAltura);

  // Fila: FORTALEZAS / OPORTUNIDADES (con altura dinámica)
  const paddingVertical = 2; // Padding arriba y abajo
  const anchoLabel = 58;
  const anchoValor = tablaAncho - anchoLabel - 4;
  const textoFortalezas = datosAdicionales.fortalezasOportunidades || "-";
  doc.setFont("helvetica", "normal").setFontSize(9);
  const lineasFortalezas = doc.splitTextToSize(textoFortalezas, anchoValor);
  const alturaFortalezas = Math.max(filaAltura, lineasFortalezas.length * 3.5 + paddingVertical * 2);
  
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaFortalezas, 'S');
  doc.line(tablaInicioX + anchoLabel, yPos, tablaInicioX + anchoLabel, yPos + alturaFortalezas);
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("FORTALEZAS / OPORTUNIDADES:", tablaInicioX + 2, yPos + paddingVertical + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  if (lineasFortalezas.length === 1) {
    doc.text(lineasFortalezas[0], tablaInicioX + anchoLabel + 2, yPos + paddingVertical + 3.5);
  } else {
    const yInicioTexto = yPos + paddingVertical + 3.5;
    lineasFortalezas.forEach((linea, lineIdx) => {
      doc.text(linea, tablaInicioX + anchoLabel + 2, yInicioTexto + (lineIdx * 3.5));
    });
  }
  yPos += alturaFortalezas;

  // Fila: AMENAZAS / DEBILIDADES (con altura dinámica)
  const textoAmenazas = datosAdicionales.amenazasDebilidades || "-";
  doc.setFont("helvetica", "normal").setFontSize(9);
  const lineasAmenazas = doc.splitTextToSize(textoAmenazas, anchoValor);
  const alturaAmenazas = Math.max(filaAltura, lineasAmenazas.length * 3.5 + paddingVertical * 2);
  
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaAmenazas, 'S');
  doc.line(tablaInicioX + anchoLabel, yPos, tablaInicioX + anchoLabel, yPos + alturaAmenazas);
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("AMENAZAS / DEBILIDADES:", tablaInicioX + 2, yPos + paddingVertical + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  if (lineasAmenazas.length === 1) {
    doc.text(lineasAmenazas[0], tablaInicioX + anchoLabel + 2, yPos + paddingVertical + 3.5);
  } else {
    const yInicioTexto = yPos + paddingVertical + 3.5;
    lineasAmenazas.forEach((linea, lineIdx) => {
      doc.text(linea, tablaInicioX + anchoLabel + 2, yInicioTexto + (lineIdx * 3.5));
    });
  }
  yPos += alturaAmenazas;

  // === SECCIÓN IV: OBSERVACIONES ===
  yPos = dibujarHeaderSeccion("IV. OBSERVACIONES", yPos, filaAltura);

  // Fila de Observaciones (creciente)
  const alturaObservaciones = calcularAlturaTexto(datosAdicionales.observaciones, tablaAncho - 5);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaObservaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaObservaciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaObservaciones, tablaInicioX + tablaAncho, yPos + alturaObservaciones);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosAdicionales.observaciones, tablaInicioX + 2, yPos + 3.6, tablaAncho - 5);
  yPos += alturaObservaciones;

  // === SECCIÓN V: RECOMENDACIONES ===
  yPos = dibujarHeaderSeccion("V. RECOMENDACIONES", yPos, filaAltura);

  // Calcular altura necesaria (con padding igual que OBSERVACIONES)
  const padding = 3;
  let alturaRecomendaciones = 20;
  if (datosAdicionales.recomendaciones && datosAdicionales.recomendaciones.trim().length > 0) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineas = doc.splitTextToSize(datosAdicionales.recomendaciones, tablaAncho - 4);
    const alturaTexto = lineas.length * 3.5;
    alturaRecomendaciones = Math.max(20, alturaTexto + padding * 2); // padding arriba y abajo
  }
  
  // Dibujar borde
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaRecomendaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaRecomendaciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaRecomendaciones, tablaInicioX + tablaAncho, yPos + alturaRecomendaciones);
  
  // Dibujar recomendaciones (con padding arriba igual que OBSERVACIONES)
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosAdicionales.recomendaciones, tablaInicioX + 2, yPos + padding + 2, tablaAncho - 4);

  yPos += alturaRecomendaciones;

  // === SECCIÓN VI: CONCLUSIONES ===
  yPos = dibujarHeaderSeccion("VI. CONCLUSIONES", yPos, filaAltura);

  // Fila de APTO / NO APTO con checkboxes
  const colAptoW = 47.5;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + colAptoW, yPos, tablaInicioX + colAptoW, yPos + filaAltura);
  doc.line(tablaInicioX + colAptoW * 2, yPos, tablaInicioX + colAptoW * 2, yPos + filaAltura);
  doc.line(tablaInicioX + colAptoW * 3, yPos, tablaInicioX + colAptoW * 3, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("APTO", tablaInicioX + colAptoW / 2, yPos + 4, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosAdicionales.apto ? "X" : "", tablaInicioX + colAptoW + colAptoW / 2, yPos + 4, { align: "center" });
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("NO APTO", tablaInicioX + colAptoW * 2 + colAptoW / 2, yPos + 4, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(!datosAdicionales.apto ? "X" : "", tablaInicioX + colAptoW * 3 + colAptoW / 2, yPos + 4, { align: "center" });
  yPos += filaAltura;

  // === SECCIÓN VII: FIRMA ===
  const pageHeight = doc.internal.pageSize.getHeight();
  if (yPos + 30 > pageHeight - 20) {
    doc.addPage();
    yPos = 35;
  }

  // Dibujar sección de firma con borde
  const alturaSeccionFirma = 30;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaSeccionFirma, 'S');

  // Usar la función dibujarFirmas para dibujar las firmas
  await dibujarFirmas({ doc, datos: data, y: yPos + 2, pageW });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 5 });

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

