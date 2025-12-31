import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import { convertirGenero } from "../../../utils/helpers.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import drawColorBox from '../../components/ColorBox.jsx';

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

  // Fila 1: Fortalezas / Oportunidades
  const alturaFila1 = calcularAlturaTexto(datosAdicionales.fortalezasOportunidades, tablaAncho - 4);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila1);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila1);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila1, tablaInicioX + tablaAncho, yPos + alturaFila1);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Fortalezas / Oportunidades:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosAdicionales.fortalezasOportunidades, tablaInicioX + 2, yPos + 7, tablaAncho - 4);
  yPos += alturaFila1;

  // Fila 2: Amenazas / Debilidades
  const alturaFila2 = calcularAlturaTexto(datosAdicionales.amenazasDebilidades, tablaAncho - 4);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila2);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila2);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila2, tablaInicioX + tablaAncho, yPos + alturaFila2);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Amenazas / Debilidades:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosAdicionales.amenazasDebilidades, tablaInicioX + 2, yPos + 7, tablaAncho - 4);
  yPos += alturaFila2;

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

  // Ancho para la firma a la derecha
  const anchoFirma = 60;
  const anchoRecomendaciones = tablaAncho - anchoFirma - 2; // Ancho disponible para recomendaciones
  
  // Calcular altura necesaria (con padding igual que OBSERVACIONES)
  const padding = 3;
  let alturaRecomendaciones = 20;
  if (datosAdicionales.recomendaciones && datosAdicionales.recomendaciones.trim().length > 0) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineas = doc.splitTextToSize(datosAdicionales.recomendaciones, anchoRecomendaciones - 4);
    const alturaTexto = lineas.length * 3.5;
    alturaRecomendaciones = Math.max(20, alturaTexto + padding * 2); // padding arriba y abajo
  }
  
  // Asegurar altura mínima para la firma
  const alturaMinimaFirma = 25;
  alturaRecomendaciones = Math.max(alturaRecomendaciones, alturaMinimaFirma);
  
  // Dibujar borde
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaRecomendaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaRecomendaciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaRecomendaciones, tablaInicioX + tablaAncho, yPos + alturaRecomendaciones);
  
  // Línea divisoria entre recomendaciones y firma
  doc.line(tablaInicioX + anchoRecomendaciones, yPos, tablaInicioX + anchoRecomendaciones, yPos + alturaRecomendaciones);
  
  // Dibujar recomendaciones (con padding arriba igual que OBSERVACIONES)
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosAdicionales.recomendaciones, tablaInicioX + 2, yPos + padding + 2, anchoRecomendaciones - 4);

  // Guardar yPos para después de las recomendaciones
  const yPosDespuesRecomendaciones = yPos + alturaRecomendaciones;

  // Firma del médico - dentro de la misma fila, al lado derecho
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
    const sigY = yPos + (alturaRecomendaciones / 2) - (sigH / 2); // Centrar verticalmente
    const gap = 16;
    const xInicioFirma = tablaInicioX + anchoRecomendaciones + 2; // Posición X de la firma
    const centroXFirma = xInicioFirma + (anchoFirma / 2); // Centro de la columna de firma

    if (s1 && s2) {
      // Dos sellos lado a lado
      const totalWidth = sigW * 2 + gap;
      const startX = centroXFirma - totalWidth / 2;
      doc.addImage(s1, 'JPEG', startX, sigY, sigW, sigH);
      doc.addImage(s2, 'JPEG', startX + sigW + gap, sigY, sigW, sigH);
    } else if (s1) {
      // Un solo sello centrado
      const imgX = centroXFirma - sigW / 2;
      doc.addImage(s1, 'JPEG', imgX, sigY, sigW, sigH);
    } else if (s2) {
      // Un solo sello centrado
      const imgX = centroXFirma - sigW / 2;
      doc.addImage(s2, 'JPEG', imgX, sigY, sigW, sigH);
    }
  } catch (err) {
    console.error("Error al cargar firma del médico:", err);
  }

  yPos = yPosDespuesRecomendaciones;

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

