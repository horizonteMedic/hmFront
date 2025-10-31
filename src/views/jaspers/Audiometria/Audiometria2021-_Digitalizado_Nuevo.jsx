import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { convertirGenero } from "../../utils/helpers";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function Audiometria2021_Digitalizado_Nuevo(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente) + " " + (data.nombresPaciente)).trim(),
    fechaExamen: formatearFechaCorta(data.fechaExamen),
    tipoExamen: String(data.nombreExamen),
    sexo: convertirGenero(data.sexoPaciente),
    documentoIdentidad: String(data.dniPaciente),
    edad: String(data.edadPaciente),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente || data.fechaNacimiento),
    areaTrabajo: data.areaPaciente,
    puestoTrabajo: data.cargoPaciente,
    empresa: data.empresa,
    contrata: data.contrata,
    // Datos de color
    color: data.color,
    codigoColor: data.codigoColor,
    textoColor: data.textoColor,
    // Datos adicionales para header
    numeroFicha: String(data.norden),
    sede: data.sede || data.nombreSede,
    direccionPaciente: String(data.direccionPaciente),
    // Nuevos datos para síntomas y antecedentes (asumiendo campos en data)
    sintomas: {
      sordera: data.sintomas_sordera ?? false,
      vertigo: data.sintomas_vertigo ?? false,
      secrecionOtica: data.sintomas_secrecion_otica ?? false,
      acufenos: data.sintomas_acufenos ?? false,
      otalgia: data.sintomas_otalgia ?? false,
      otrosORL: data.sintomas_otros_orl ?? ""
    },
    antecedentes: {
      rinitis: data.antecedentes_rinitis ?? false,
      meninguitis: data.antecedentes_meninguitis ?? false,
      parotiditis: data.antecedentes_parotiditis ?? false,
      sinusitis: data.antecedentes_sinusitis ?? false,
      tifoidea: data.antecedentes_tifoidea ?? false, // Asumiendo TEX = Tifoidea Exantemática
      sarampion: data.antecedentes_sarampion ?? false,
      otitisMediaCronica: data.antecedentes_otitis_media_cronica ?? false,
      tec: data.antecedentes_tec ?? false, // Trauma Encéfalo Craneal
      sordera: data.antecedentes_sordera ?? false,
      tbc: data.antecedentes_tbc ?? false,
      medicamentosOtotoxicos: data.antecedentes_medicamentos_ototoxicos ?? false,
      descripcionMedicamentos: data.antecedentes_medicamentos_descripcion ?? "" // Campo de texto si true
    }
  };

  // Usar solo datos reales
  const datosFinales = datosReales;

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("FICHA DE EVALUACIÓN AUDIOMETRÍA", pageW / 2, 32, { align: "center" });
    }

    // Número de Ficha y Página (alineación automática mejorada)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 60, 16);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosFinales.sede, pageW - 80, 20);
    doc.text("Fecha de examen: " + datosFinales.fechaExamen, pageW - 80, 25);

    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 30, 10);

    // Bloque de color (posición mejorada)
    drawColorBox(doc, {
      color: datosFinales.codigoColor,
      text: datosFinales.textoColor,
      x: pageW - 40,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  };

  // === DIBUJAR HEADER ===
  drawHeader(numeroPagina);

  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    // Validar que el texto no sea undefined, null o vacío
    if (!texto || texto === null || texto === undefined) {
      return y;
    }
    
    const fontSize = doc.internal.getFontSize();
    const palabras = String(texto).split(' ');
    let lineaActual = '';
    let yPos = y;
    
    palabras.forEach(palabra => {
      const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);
      
      if (anchoTexto <= anchoMaximo) {
        lineaActual = textoPrueba;
      } else {
        if (lineaActual) {
          doc.text(lineaActual, x, yPos);
          yPos += fontSize * 0.35; // salto real entre líneas
          lineaActual = palabra;
        } else {
          doc.text(palabra, x, yPos);
          yPos += fontSize * 0.35;
        }
      }
    });
    
    if (lineaActual) {
      doc.text(lineaActual, x, yPos);
      yPos += fontSize * 0.35;
    }
    
    return yPos; // Devuelve la nueva posición final
  };

  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar fondo gris más oscuro
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    
    // Dibujar líneas del header
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
    
    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);
    
    return yPos + alturaHeader;
  };

  // Función para dibujar una fila de 3 síntomas
  const dibujarFilaSintomas = (items, filaIndex, yPosFila, colWidth) => {
    const colPositions = [];
    for (let i = 0; i <= 3; i++) { // 3 columnas + bordes
      colPositions.push(tablaInicioX + (i * colWidth));
    }

    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPosFila, tablaInicioX, yPosFila + filaAltura);
    for (let i = 1; i < 3; i++) {
      doc.line(colPositions[i], yPosFila, colPositions[i], yPosFila + filaAltura);
    }
    doc.line(tablaInicioX + tablaAncho, yPosFila, tablaInicioX + tablaAncho, yPosFila + filaAltura);
    doc.line(tablaInicioX, yPosFila, tablaInicioX + tablaAncho, yPosFila);
    doc.line(tablaInicioX, yPosFila + filaAltura, tablaInicioX + tablaAncho, yPosFila + filaAltura);

    // Contenido de la fila
    let yTextoFila = yPosFila + 2.5;
    doc.setFont("helvetica", "normal").setFontSize(8);

    items.forEach((item, index) => {
      const colStart = index * colWidth + tablaInicioX;
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text(item.label + ":", colStart + 2, yTextoFila + 1);
      if (item.checked !== undefined && item.checked) {
        doc.setFont("helvetica", "normal").setFontSize(12);
        // X en rojo y 1mm más abajo
        doc.setTextColor(255, 0, 0);
        doc.text("X", colStart + colWidth / 2 - 2, yTextoFila + 2);
        doc.setTextColor(0, 0, 0);
      } else if (item.text !== undefined) {
        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text(item.text || "", colStart + 25, yTextoFila + 1);
      }
    });

    return yPosFila + filaAltura;
  };

  // Función para dibujar una fila de 4 antecedentes
  const dibujarFilaAntecedentes = (items, filaIndex, yPosFila, colWidth) => {
    const colPositions = [];
    for (let i = 0; i <= 4; i++) { // 4 columnas + bordes
      colPositions.push(tablaInicioX + (i * colWidth));
    }

    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPosFila, tablaInicioX, yPosFila + filaAltura);
    for (let i = 1; i < 4; i++) {
      doc.line(colPositions[i], yPosFila, colPositions[i], yPosFila + filaAltura);
    }
    doc.line(tablaInicioX + tablaAncho, yPosFila, tablaInicioX + tablaAncho, yPosFila + filaAltura);
    doc.line(tablaInicioX, yPosFila, tablaInicioX + tablaAncho, yPosFila);
    doc.line(tablaInicioX, yPosFila + filaAltura, tablaInicioX + tablaAncho, yPosFila + filaAltura);

    // Contenido de la fila
    let yTextoFila = yPosFila + 2.5;
    doc.setFont("helvetica", "normal").setFontSize(8); // Tamaño más legible con 4 por fila

    items.forEach((item, index) => {
      const colStart = index * colWidth + tablaInicioX;
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text(item.label + ":", colStart + 1, yTextoFila + 1);
      if (item.checked) {
        doc.setFont("helvetica", "normal").setFontSize(12);
        // X en rojo y 1mm más abajo
        doc.setTextColor(255, 0, 0);
        doc.text("X", colStart + colWidth / 2 - 2, yTextoFila + 2);
        doc.setTextColor(0, 0, 0);
      }
    });

    return yPosFila + filaAltura;
  };

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 35;
  const filaAltura = 4.5;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);

  // Fila: Apellidos y Nombres con división para Tipo de examen
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura); // División para Tipo de examen
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Domicilio (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Empresa (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Contrata (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 35 + filaAltura + 2.5; // Ajustar para el header

  // Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Ajustar ancho para la nueva división (hasta x = tablaInicioX + 140)
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres || "", tablaInicioX + 35, yTexto + 1, 95);

  // Columna derecha: Tipo de examen
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.tipoExamen || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad || "", tablaInicioX + 12, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.edad ? (datosFinales.edad + " Años") : ""), tablaInicioX + 58, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.sexo || "", tablaInicioX + 105, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.direccionPaciente || "", tablaInicioX + 25, yTexto + 1, 160);
  yTexto += filaAltura;

  // Puesto de Trabajo, Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.puestoTrabajo || "", tablaInicioX + 30, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.areaTrabajo || "", tablaInicioX + 118, yTexto + 1);
  yTexto += filaAltura;

  // Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa || "", tablaInicioX + 24, yTexto + 1, 160);
  yTexto += filaAltura;

  // Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contrata || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // === SECCIÓN 2: SÍNTOMAS ACTUALES ===
  yPos = yTexto; // Continuar desde yPos actualizado
  yPos = dibujarHeaderSeccion("2. SÍNTOMAS ACTUALES", yPos, filaAltura);

  // Preparar array de síntomas para 3 por fila
  const sintomasArray = [
    // Primera fila
    { label: "Sordera", checked: datosFinales.sintomas.sordera },
    { label: "Vértigo", checked: datosFinales.sintomas.vertigo },
    { label: "Secreción ótica", checked: datosFinales.sintomas.secrecionOtica },
    // Segunda fila
    { label: "Acúfenos", checked: datosFinales.sintomas.acufenos },
    { label: "Otalgia", checked: datosFinales.sintomas.otalgia },
    { text: datosFinales.sintomas.otrosORL || "", checked: undefined } // Campo de texto
  ];

  // Ancho de columna para 3 items
  const colWidthSintomas = tablaAncho / 3;

  // Dibujar filas de 3 items (2 filas)
  let yPosSintomas = yPos;
  // Primera fila: items 0-2
  yPosSintomas = dibujarFilaSintomas(sintomasArray.slice(0, 3), 0, yPosSintomas, colWidthSintomas);
  // Segunda fila: items 3-5
  yPosSintomas = dibujarFilaSintomas(sintomasArray.slice(3, 6), 1, yPosSintomas, colWidthSintomas);

  yPos = yPosSintomas;

  // === SECCIÓN 3: ANTECEDENTES MÉDICOS DE IMPORTANCIA ===
  yPos = dibujarHeaderSeccion("3. ANTECEDENTES MÉDICOS DE IMPORTANCIA", yPos, filaAltura);

  // Preparar array de antecedentes para 4 por fila
  const antecedentesArray = [
    { label: "Rinitis", checked: datosFinales.antecedentes.rinitis },
    { label: "Meningitis", checked: datosFinales.antecedentes.meninguitis },
    { label: "Parotiditis", checked: datosFinales.antecedentes.parotiditis },
    { label: "Sinusitis", checked: datosFinales.antecedentes.sinusitis },
    { label: "TEX", checked: datosFinales.antecedentes.tifoidea },
    { label: "Sarampión", checked: datosFinales.antecedentes.sarampion },
    { label: "Otitis media crónica", checked: datosFinales.antecedentes.otitisMediaCronica },
    { label: "TEC", checked: datosFinales.antecedentes.tec },
    { label: "Sordera", checked: datosFinales.antecedentes.sordera },
    { label: "TBC", checked: datosFinales.antecedentes.tbc },
    { label: "Medicamentos ototóxicos", checked: datosFinales.antecedentes.medicamentosOtotoxicos }
  ];

  // Ancho de columna para 4 items (más espacio)
  const colWidthAntecedentes = tablaAncho / 4;

  // Dibujar filas de 4 items (3 filas: 4 + 4 + 3)
  let yPosAntecedentes = yPos;
  // Primera fila: items 0-3
  yPosAntecedentes = dibujarFilaAntecedentes(antecedentesArray.slice(0, 4), 0, yPosAntecedentes, colWidthAntecedentes);
  // Segunda fila: items 4-7
  yPosAntecedentes = dibujarFilaAntecedentes(antecedentesArray.slice(4, 8), 1, yPosAntecedentes, colWidthAntecedentes);
  // Tercera fila: items 8-11 (solo 3)
  yPosAntecedentes = dibujarFilaAntecedentes(antecedentesArray.slice(8, 11), 2, yPosAntecedentes, colWidthAntecedentes);

  yPos = yPosAntecedentes;

  // Si medicamentos ototóxicos es true, agregar fila de texto completa
  if (datosFinales.antecedentes.medicamentosOtotoxicos && datosFinales.antecedentes.descripcionMedicamentos) {
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Descripción:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(datosFinales.antecedentes.descripcionMedicamentos.toUpperCase(), tablaInicioX + 25, yPos + 3.5, 160);
    yPos += filaAltura;
  }

  // === SECCIÓN 4: EXPOSICIÓN OCUPACIONAL ===
  yPos = dibujarHeaderSeccion("4. EXPOSICIÓN OCUPACIONAL", yPos, filaAltura);

  // Definir anchos de columnas (suma total debe ser 200)
  const colExposicionRuidoAncho = 40; // Exposición a ruido (más ancho para textos largos)
  const colSiNoAncho = 8; // Si y No (ligeramente más angostas)
  const colTiempoExpAncho = 34; // Tiempo de exposición / años de experiencia (ligera reducción)
  const colRangoAnchoTotal = 99; // Total para 7 rangos
  const colRangoAnchoIndividual = colRangoAnchoTotal / 7; // ~14.14 cada uno
  const colEventualAncho = 11; // eventual
  // Verificación: 40 + 8 + 8 + 34 + 99 + 11 = 200 ✓
  
  // Calcular posiciones
  let xExposicion = tablaInicioX;
  let xSi = xExposicion + colExposicionRuidoAncho;
  let xNo = xSi + colSiNoAncho;
  let xTiempoExp = xNo + colSiNoAncho;
  let xRangos = xTiempoExp + colTiempoExpAncho;
  
  // Posiciones de rangos
  const rangos = ["0 a 2", "2 a 4", "4 a 6", "6 a 8", "8 a 10", "10 a 12", ">12", "eventual"];
  const posicionesRangos = [];
  let xActual = xRangos;
  for (let i = 0; i < 7; i++) {
    posicionesRangos.push(xActual);
    xActual += colRangoAnchoIndividual;
  }
  // Último rango (eventual) con ancho diferente
  posicionesRangos.push(xActual);
  
  // === FILA 1: ENCABEZADOS ===
  // Dibujar todas las líneas verticales
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + (filaAltura * 2)); // Línea izquierda (2 filas)
  doc.line(xExposicion, yPos, xExposicion, yPos + (filaAltura * 2)); // Exposición a ruido (2 filas)
  doc.line(xSi, yPos, xSi, yPos + filaAltura);
  doc.line(xNo, yPos, xNo, yPos + filaAltura);
  doc.line(xTiempoExp, yPos, xTiempoExp, yPos + (filaAltura * 2)); // Tiempo de exposición (2 filas)
  
  // Líneas de rangos (solo primera fila para rangos normales, eventual se dibuja más abajo)
  for (let i = 0; i < 7; i++) {
    doc.line(posicionesRangos[i], yPos, posicionesRangos[i], yPos + filaAltura);
  }
  // Línea antes de eventual
  doc.line(posicionesRangos[7], yPos, posicionesRangos[7], yPos + filaAltura);
  
  // Líneas horizontales y externas
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Superior
  // Línea horizontal media: iniciar DESPUÉS de "No" para no cruzar Si/No
  doc.line(xTiempoExp, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos + (filaAltura * 2), tablaInicioX + tablaAncho, yPos + (filaAltura * 2)); // Inferior
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + (filaAltura * 2)); // Derecha
  
  // Contenido de la fila 1 (encabezados)
  doc.setFont("helvetica", "bold").setFontSize(7);
  
  // Exposición a ruido (centrada horizontal y mejor centrada verticalmente en la primera fila)
  const textoExposicion = "Exposición a ruido";
  const anchoExposicion = doc.getTextWidth(textoExposicion);
  doc.text(textoExposicion, xExposicion + (colExposicionRuidoAncho - anchoExposicion) / 2, yPos + 5.5);
  
  // Si (centrado)
  const anchoSi = doc.getTextWidth("Si");
  doc.text("Si", xSi + (colSiNoAncho - anchoSi) / 2, yPos + 5.5);
  
  // No (centrado)
  const anchoNo = doc.getTextWidth("No");
  doc.text("No", xNo + (colSiNoAncho - anchoNo) / 2, yPos + 5.5);
  
  // Tiempo de exposición (centrado horizontalmente; mantener por encima de la línea media)
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textoTiempoExp = "Tiempo de exposición";
  const anchoTiempoExp = doc.getTextWidth(textoTiempoExp);
  // Centrar horizontalmente en su celda: posición inicio celda + (ancho celda - ancho texto) / 2
  const xTiempoExpCentrado = xTiempoExp + (colTiempoExpAncho - anchoTiempoExp) / 2;
  // Colocar arriba (no cruzado por la línea media)
  const yTiempoExpCentrado = yPos + 3.5;
  doc.text(textoTiempoExp, xTiempoExpCentrado, yTiempoExpCentrado);
  
  // Rangos (centrados horizontalmente en sus celdas)
  doc.setFont("helvetica", "bold").setFontSize(7);
  rangos.forEach((rango, index) => {
    // Asegurar fuente y tamaño antes de calcular ancho
    doc.setFont("helvetica", "bold").setFontSize(7);
    const anchoRango = doc.getTextWidth(rango);
    const colAncho = index === 7 ? colEventualAncho : colRangoAnchoIndividual;
    const xRango = posicionesRangos[index];
    // Centrar horizontalmente en su celda: posición inicio celda + (ancho celda - ancho texto) / 2
    const xCentrado = xRango + (colAncho - anchoRango) / 2;
    doc.text(rango, xCentrado, yPos + 3.5);
  });
  
  // === FILA 2: DATOS ===
  // Dibujar líneas verticales adicionales para segunda fila
  // Mantener divisiones de Si/No; quitar divisiones internas de los rangos para esta fila
  doc.line(xSi, yPos + filaAltura, xSi, yPos + (filaAltura * 2));
  doc.line(xNo, yPos + filaAltura, xNo, yPos + (filaAltura * 2));
  // Agregar división interna en el bloque de "Años de experiencia" (mitad de la celda Tiempo de exposición)
  const xDivisionAnos = xTiempoExp + colTiempoExpAncho / 2;
  doc.line(xDivisionAnos, yPos + filaAltura, xDivisionAnos, yPos + (filaAltura * 2));
  // Agregar SOLO la línea de división entre "Tiempo de exposición" y el bloque de rangos
  doc.line(xRangos, yPos + filaAltura, xRangos, yPos + (filaAltura * 2));
  // Nota: NO dibujar las demás líneas de posicionesRangos[] en la segunda fila (pedido del usuario)
  
  // Contenido de la fila 2 (datos)
  doc.setFont("helvetica", "bold").setFontSize(7);
  
  // Años de experiencia (debajo de Tiempo de exposición)
  const textoAnosExp = "Años de experiencia";
  const anchoAnosExp = doc.getTextWidth(textoAnosExp);
  doc.text(textoAnosExp, xTiempoExp + (colTiempoExpAncho - anchoAnosExp) / 2, yPos + filaAltura + 3.5);
  
  // Datos de exposición a ruido (asumir campos genéricos - ajustar según estructura real)
  const exposicionRuidoSi = data.exposicionRuidoSi ?? data.exposicionRuido_si ?? false;
  const exposicionRuidoNo = data.exposicionRuidoNo ?? data.exposicionRuido_no ?? (!exposicionRuidoSi);
  const anosExperiencia = data.anosExperiencia ?? data.tiempoExposicionAnos ?? "";
  const mesesExperiencia = data.mesesExperiencia ?? data.tiempoExposicionMeses ?? "";
  
  // Marcar Si/No (ubicación en la PRIMERA fila, centrado verticalmente)
  doc.setFont("helvetica", "normal").setFontSize(12);
  
  const yMarcaPrimeraFila = yPos + 6; // misma altura visual que los rótulos Si/No
  if (exposicionRuidoSi) {
    const anchoX = doc.getTextWidth("X");
    doc.text("X", xSi + (colSiNoAncho - anchoX) / 2, yMarcaPrimeraFila);
  }
  if (exposicionRuidoNo) {
    const anchoX = doc.getTextWidth("X");
    doc.text("X", xNo + (colSiNoAncho - anchoX) / 2, yMarcaPrimeraFila);
  }
  
  // Datos de años y meses
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (anosExperiencia) {
    // Buscar en qué rango está el valor de años
    const anos = parseInt(anosExperiencia) || 0;
    let rangoIndex = -1;
    if (anos >= 0 && anos <= 2) rangoIndex = 0;
    else if (anos > 2 && anos <= 4) rangoIndex = 1;
    else if (anos > 4 && anos <= 6) rangoIndex = 2;
    else if (anos > 6 && anos <= 8) rangoIndex = 3;
    else if (anos > 8 && anos <= 10) rangoIndex = 4;
    else if (anos > 10 && anos <= 12) rangoIndex = 5;
    else if (anos > 12) rangoIndex = 6;
    
    if (rangoIndex >= 0) {
      // Marcar X en la cabecera del rango correspondiente (primera fila)
      const yMarcaRangos = yPos + 5.5; // mismo centrado que Si/No
      const xRangoInicio = posicionesRangos[rangoIndex];
      const colAnchoRango = colRangoAnchoIndividual;
      const xCentroRango = xRangoInicio + colAnchoRango / 2;
      const anchoX = doc.getTextWidth("X");
      doc.setFont("helvetica", "normal").setFontSize(12);
      doc.setTextColor(255, 0, 0);
      doc.text("X", xCentroRango - anchoX / 2, yMarcaRangos);
      doc.setTextColor(0, 0, 0);

      const xRango = posicionesRangos[rangoIndex];
      const textoAnos = `${anosExperiencia} años`;
      const anchoTexto = doc.getTextWidth(textoAnos);
      doc.text(textoAnos, xRango + (colRangoAnchoIndividual - anchoTexto) / 2, yPos + filaAltura + 3.5);
    }
  }
  
  // Meses (va en eventual si hay meses pero años están en rango o viceversa)
  if (mesesExperiencia) {
    // Marcar X en "eventual" en cabecera
    const yMarcaRangos = yPos + 5.5;
    const xEventualInicio = posicionesRangos[7];
    const xCentroEventual = xEventualInicio + colEventualAncho / 2;
    const anchoX = doc.getTextWidth("X");
    doc.setFont("helvetica", "normal").setFontSize(12);
    doc.setTextColor(255, 0, 0);
    doc.text("X", xCentroEventual - anchoX / 2, yMarcaRangos);
    doc.setTextColor(0, 0, 0);

    const textoMeses = `${mesesExperiencia} meses`;
    const anchoTexto = doc.getTextWidth(textoMeses);
    doc.text(textoMeses, xEventualInicio + (colEventualAncho - anchoTexto) / 2, yPos + filaAltura + 3.5);
  }
  
  yPos += filaAltura * 2;

  // === FILA: USO DE PROTECTORES AUDITIVOS ===
  // Líneas de la fila completa con mismas columnas que la tabla de exposición
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // izquierda
  doc.line(xSi, yPos, xSi, yPos + filaAltura); // después de etiqueta
  doc.line(xNo, yPos, xNo, yPos + filaAltura); // después de Si
  doc.line(xTiempoExp, yPos, xTiempoExp, yPos + filaAltura); // después de No
  doc.line(xRangos, yPos, xRangos, yPos + filaAltura); // después de "Tipo de exposición"
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // inferior

  // Contenido de la fila
  const yTextoUPA = yPos + 3.5;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Uso de Protectores Auditivos", tablaInicioX + 2, yTextoUPA);

  // Encabezados Si / No
  const anchoSiUPA = doc.getTextWidth("Si");
  doc.text("Si", xSi + (colSiNoAncho - anchoSiUPA) / 2, yTextoUPA);
  const anchoNoUPA = doc.getTextWidth("No");
  doc.text("No", xNo + (colSiNoAncho - anchoNoUPA) / 2, yTextoUPA);

  // "Tipo de exposición"
  const textoTipoExpo = "Tipo de exposición";
  const anchoTipoExpo = doc.getTextWidth(textoTipoExpo);
  doc.text(textoTipoExpo, xTiempoExp + (colTiempoExpAncho - anchoTipoExpo) / 2, yTextoUPA);

  // Datos (X en Si/No y textos de tapones/orejeras)
  const usoProtectoresSi = data.usoProtectoresSi ?? data.usoProtectores_si ?? false;
  const usoProtectoresNo = data.usoProtectoresNo ?? data.usoProtectores_no ?? (!usoProtectoresSi);
  const textoTapones = (data.tapones ?? data.usoTapones ?? data.protectoresTapones ?? "").toString();
  const textoOrejeras = (data.orejeras ?? data.usoOrejeras ?? data.protectoresOrejeras ?? "").toString();

  // Marcas X
  doc.setFont("helvetica", "normal").setFontSize(12);
  if (usoProtectoresSi) {
    const anchoX = doc.getTextWidth("X");
    doc.text("X", xSi + (colSiNoAncho - anchoX) / 2, yTextoUPA + 0.5);
  }
  if (usoProtectoresNo) {
    const anchoX = doc.getTextWidth("X");
    doc.text("X", xNo + (colSiNoAncho - anchoX) / 2, yTextoUPA + 0.5);
  }

  // Celda derecha: dividir en 2 mitades con línea vertical al centro
  const xDerechaInicio = xRangos;
  const xDerechaFin = tablaInicioX + tablaAncho;
  const anchoDerecha = xDerechaFin - xDerechaInicio;
  const xMitad = xDerechaInicio + anchoDerecha / 2;
  // Línea divisoria central
  doc.line(xMitad, yPos, xMitad, yPos + filaAltura);
  // Mitad izquierda: tapones
  doc.setFont("helvetica", "bold").setFontSize(7);
  const margen = 2;
  let xTexto = xDerechaInicio + margen;
  doc.text("tapones:", xTexto, yTextoUPA);
  xTexto += doc.getTextWidth("tapones:") + 2;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(textoTapones, xTexto, yTextoUPA);
  // Mitad derecha: orejeras
  doc.setFont("helvetica", "bold").setFontSize(7);
  xTexto = xMitad + margen;
  doc.text("orejeras:", xTexto, yTextoUPA);
  xTexto += doc.getTextWidth("orejeras:") + 2;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(textoOrejeras, xTexto, yTextoUPA);

  // Avanzar Y
  yPos += filaAltura;

  // === FILA: EXPOSICIÓN A SUSTANCIAS QUÍMICAS (con subtabla 3 filas) ===
  // Altura total: 3 filas internas
  const subFilaAltura = filaAltura; // mantener mismo alto base
  const alturaTotalQuimicos = subFilaAltura * 3;

  // Líneas contenedoras (etiqueta | Si | No | bloque subtabla | derecha)
  const xInicioSubtabla = xNo + colSiNoAncho; // después de No
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaTotalQuimicos);
  doc.line(xSi, yPos, xSi, yPos + alturaTotalQuimicos);
  doc.line(xNo, yPos, xNo, yPos + alturaTotalQuimicos);
  doc.line(xInicioSubtabla, yPos, xInicioSubtabla, yPos + alturaTotalQuimicos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaTotalQuimicos);
  // Horizontales del contenedor
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaTotalQuimicos, tablaInicioX + tablaAncho, yPos + alturaTotalQuimicos);

  // Subtabla interna: 3 filas dentro del bloque derecho
  const innerStartX = xInicioSubtabla;
  const innerEndX = tablaInicioX + tablaAncho;
  const innerWidth = innerEndX - innerStartX;
  const innerLabelColWidth = 20; // primera columna (vacía en header) para "horas" y "T. años"
  const innerChemCols = ["Plomo", "Mercurio", "Tolueno", "Xileno", "Plagio", "Organofos"];
  const innerChemColWidth = (innerWidth - innerLabelColWidth) / innerChemCols.length;

  // Dibujar líneas horizontales de subtabla (separando las 3 filas)
  doc.line(innerStartX, yPos + subFilaAltura, innerEndX, yPos + subFilaAltura);
  doc.line(innerStartX, yPos + subFilaAltura * 2, innerEndX, yPos + subFilaAltura * 2);

  // Dibujar líneas verticales de subtabla
  // Primera columna (label interna)
  doc.line(innerStartX + innerLabelColWidth, yPos, innerStartX + innerLabelColWidth, yPos + alturaTotalQuimicos);
  // Columnas por cada químico
  for (let i = 0; i < innerChemCols.length; i++) {
    const xCol = innerStartX + innerLabelColWidth + (i * innerChemColWidth);
    doc.line(xCol, yPos, xCol, yPos + alturaTotalQuimicos);
  }

  // Texto: etiqueta izquierda (con salto en 2 líneas)
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textoExpoQuimLinea1 = "Exposición a sustancias";
  const textoExpoQuimLinea2 = "químicas";
  const anchoLinea1 = doc.getTextWidth(textoExpoQuimLinea1);
  const anchoLinea2 = doc.getTextWidth(textoExpoQuimLinea2);
  const xLabelCentradoLinea1 = xExposicion + (colExposicionRuidoAncho - anchoLinea1) / 2;
  const xLabelCentradoLinea2 = xExposicion + (colExposicionRuidoAncho - anchoLinea2) / 2;
  // Posicionar en las dos primeras subfilas para buena distribución vertical
  doc.text(textoExpoQuimLinea1, xLabelCentradoLinea1, yPos + subFilaAltura - 1);
  doc.text(textoExpoQuimLinea2, xLabelCentradoLinea2, yPos + subFilaAltura * 2 - 1);

  // Si / No (centrados verticalmente en la altura total)
  const yCentroQuim = yPos + subFilaAltura * 1.5;
  const anchoSiQ = doc.getTextWidth("Si");
  doc.text("Si", xSi + (colSiNoAncho - anchoSiQ) / 2, yCentroQuim);
  const anchoNoQ = doc.getTextWidth("No");
  doc.text("No", xNo + (colSiNoAncho - anchoNoQ) / 2, yCentroQuim);

  // Marcar X si aplica
  const expQuimSi = data.expQuimSi ?? data.exposicionQuimicaSi ?? false;
  const expQuimNo = data.expQuimNo ?? data.exposicionQuimicaNo ?? (!expQuimSi);
  doc.setFont("helvetica", "normal").setFontSize(12);
  if (expQuimSi) {
    const anchoX = doc.getTextWidth("X");
    doc.text("X", xSi + (colSiNoAncho - anchoX) / 2, yCentroQuim + 0.5);
  }
  if (expQuimNo) {
    const anchoX = doc.getTextWidth("X");
    doc.text("X", xNo + (colSiNoAncho - anchoX) / 2, yCentroQuim + 0.5);
  }

  // Fila 1 (header interno): nombres químicos
  doc.setFont("helvetica", "bold").setFontSize(7);
  // Primera celda del header queda vacía
  for (let i = 0; i < innerChemCols.length; i++) {
    const label = innerChemCols[i];
    const xCellStart = innerStartX + innerLabelColWidth + i * innerChemColWidth;
    const anchoLabel = doc.getTextWidth(label);
    doc.text(label, xCellStart + (innerChemColWidth - anchoLabel) / 2, yPos + 3.5);
  }

  // Fila 2: "horas"
  doc.text("Horas", innerStartX + 2, yPos + subFilaAltura + 3.5);

  // Fila 3: "T. años"
  doc.text("T.años", innerStartX + 2, yPos + subFilaAltura * 2 + 3.5);

  // Avanzar Y después del bloque
  yPos += alturaTotalQuimicos;

  // === Fila: Otros ( detallar ) : {data} ===
  // Líneas de la fila completa
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido
  const yTextoOtros = yPos + 3.5;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Otros ( detallar ):", tablaInicioX + 2, yTextoOtros);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const otrosExtra = String(
    data.otrosExtraLaborales ??
    data.antecedentesExtraLaborales ??
    data.otrosDetallar ??
    ""
  );
  dibujarTextoConSaltoLinea(otrosExtra, tablaInicioX + 40, yTextoOtros, tablaAncho - 42);
  yPos += filaAltura;

  // === SECCIÓN (fila gris) DESPUÉS: 5. Antecendentes Extra-Laborales ===
  yPos = dibujarHeaderSeccion("5. Antecendentes Extra-Laborales", yPos, filaAltura);

  // === FILA: PRÁCTICA DE TIRO / WALKMAN / OTROS ===
  // Dividir en 3 columnas iguales
  const colTercio = tablaAncho / 3;
  const xCol1 = tablaInicioX;
  const xCol2 = tablaInicioX + colTercio;
  const xCol3 = tablaInicioX + colTercio * 2;

  // Dibujar líneas de la fila
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xCol2, yPos, xCol2, yPos + filaAltura);
  doc.line(xCol3, yPos, xCol3, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido: mapear booleanos a Si/No
  const mapSiNo = (val) => (val ? "Si" : "No");
  const practicaTiro = mapSiNo(!!(data.practicaTiro ?? data.practica_de_tiro ?? data.tiro));
  const usoWalkman = mapSiNo(!!(data.usoWalkman ?? data.walkman ?? data.uso_de_walkman));
  const otrosFlag = mapSiNo(!!(data.otrosFlag ?? data.otros_bool ?? data.otos));

  // Escribir textos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Practica tiro:", xCol1 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(practicaTiro, xCol1 + 28, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("uso de walkman:", xCol2 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(usoWalkman, xCol2 + 35, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Otos:", xCol3 + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(otrosFlag, xCol3 + 15, yPos + 3.5);

  yPos += filaAltura;

  // === FILA: DETALLAR ===
  // Líneas de la fila completa
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido
  const yTextoDetallar = yPos + 3.5;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Detallar:", tablaInicioX + 2, yTextoDetallar);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const textoDetallar = String(
    data.detallar ?? data.detalle ?? data.detallarTexto ?? ""
  );
  dibujarTextoConSaltoLinea(textoDetallar, tablaInicioX + 22, yTextoDetallar, tablaAncho - 24);
  yPos += filaAltura;

  // === SECCIÓN (fila gris) 6: OTOSCOPÍA ===
  yPos = dibujarHeaderSeccion("6. OTOSCOPÍA:", yPos, filaAltura);

  // === FILA: Oído derecho / Oído izquierdo ===
  // Dividir en 2 columnas iguales
  const colMitad = tablaAncho / 2;
  const xColOD = tablaInicioX;
  const xColOI = tablaInicioX + colMitad;

  // Líneas de la fila
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xColOI, yPos, xColOI, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido de la fila OD / OI
  const yTextoOto = yPos + 3.5;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Oído derecho:", xColOD + 2, yTextoOto);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const textoOD = String(
    data.otoscopiaOd ?? data.odoscopia_od ?? data.otoscopiaOd_txtotoscopiaod ?? ""
  );
  dibujarTextoConSaltoLinea(textoOD, xColOD + 28, yTextoOto, colMitad - 30);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Oído izquierdo:", xColOI + 2, yTextoOto);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const textoOI = String(
    data.otoscopiaOi ?? data.otoscopia_oi ?? data.otoscopiaOi_txtotoscopiaoi ?? ""
  );
  dibujarTextoConSaltoLinea(textoOI, xColOI + 32, yTextoOto, colMitad - 34);
  yPos += filaAltura;

  // === SECCIÓN (fila gris) 7. Audiometria ===
  yPos = dibujarHeaderSeccion("7. Audiometria", yPos, filaAltura);

  // === GRÁFICO DE AUDIOMETRÍA (tomado de plantilla base) ===
  // Configuración básica
  const pageW2 = doc.internal.pageSize.getWidth();
  const marginG = 10;
  const usableW = pageW2 - marginG * 2;
  let yGraf = yPos + 2;

  // Calcular mitad del ancho útil (reducir tamaño del gráfico y la leyenda)
  const halfW = usableW / 2;
  const legendW = halfW * 0.70;
  const legendH = 55;
  const graphW = halfW * 0.85;
  const graphH = 55;

  // Leyenda (mitad izquierda)
  try {
    const legendX = marginG + (halfW - legendW) / 2;
    doc.addImage("/img/leyenda_grafico.png", "PNG", legendX, yGraf + 2, legendW * 0.8, legendH * 0.8);
  } catch (e) {
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Leyenda no disponible", marginG, yGraf + 10);
  }

  // Gráfico dinámico (mitad derecha)
  const graphX = marginG + halfW + (halfW - graphW) / 2;
  const graphY = yGraf;
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  // Fondo azul 20-40 dB
  doc.setFillColor(180, 235, 255);
  doc.rect(graphX, graphY + 30, graphW, 20, "F");
  // Frecuencias
  const freqs = [125, 250, 500, 1000, 2000, 3000, 4000, 6000, 8000];
  // Líneas horizontales (cada 10 dB, de -10 a 120)
  for (let i = 0; i <= 13; i++) {
    const yLine = graphY + i * (graphH / 13);
    doc.line(graphX, yLine, graphX + graphW, yLine);
  }
  // Líneas verticales (frecuencias)
  for (let i = 0; i < freqs.length; i++) {
    const xLine = graphX + i * (graphW / (freqs.length - 1));
    doc.line(xLine, graphY, xLine, graphY + graphH);
  }
  // Ejes y etiquetas
  doc.setFont("helvetica", "normal").setFontSize(7);
  for (let i = 0; i < freqs.length; i++) {
    const xTick = graphX + i * (graphW / (freqs.length - 1));
    doc.text(String(freqs[i]), xTick, graphY - 2, { align: "center" });
  }
  doc.text("Hz", graphX + graphW + 4, graphY - 2, { align: "left" });
  for (let i = 0; i <= 13; i++) {
    const dB = -10 + i * 10;
    const yTick = graphY + i * (graphH / 13) + 0.5;
    doc.text(String(dB), graphX - 3, yTick, { align: "right" });
  }
  doc.text("dB", graphX - 10, graphY + graphH / 2 - 2, { align: "right" });

  // Construir puntos desde data (si no existen, caerá en null y se omite)
  const limpiarNumeroNuevo = (valor) => {
    if (valor === undefined || valor === null) return null;
    const v = String(valor).trim();
    if (v === "" || v === "N/A" || v === "-") return null;
    const esNumeroValido = /^-?\d+(\.\d+)?$/.test(v);
    return esNumeroValido ? Number(v) : null;
  };

  const puntos = [
    // Vía aérea OD (rojo círculo)
    { freq: 500, db: limpiarNumeroNuevo(data.od500), color: "red", tipo: "circle" },
    { freq: 1000, db: limpiarNumeroNuevo(data.od1000), color: "red", tipo: "circle" },
    { freq: 2000, db: limpiarNumeroNuevo(data.od2000), color: "red", tipo: "circle" },
    { freq: 3000, db: limpiarNumeroNuevo(data.od3000), color: "red", tipo: "circle" },
    { freq: 4000, db: limpiarNumeroNuevo(data.od4000), color: "red", tipo: "circle" },
    { freq: 6000, db: limpiarNumeroNuevo(data.od6000), color: "red", tipo: "circle" },
    { freq: 8000, db: limpiarNumeroNuevo(data.od8000), color: "red", tipo: "circle" },
    // Vía aérea OI (azul X)
    { freq: 500, db: limpiarNumeroNuevo(data.oi500), color: "blue", tipo: "x" },
    { freq: 1000, db: limpiarNumeroNuevo(data.oi1000), color: "blue", tipo: "x" },
    { freq: 2000, db: limpiarNumeroNuevo(data.oi2000), color: "blue", tipo: "x" },
    { freq: 3000, db: limpiarNumeroNuevo(data.oi3000), color: "blue", tipo: "x" },
    { freq: 4000, db: limpiarNumeroNuevo(data.oi4000), color: "blue", tipo: "x" },
    { freq: 6000, db: limpiarNumeroNuevo(data.oi6000), color: "blue", tipo: "x" },
    { freq: 8000, db: limpiarNumeroNuevo(data.oi8000), color: "blue", tipo: "x" },
  ];

  const tipos = [
    { tipo: "circle", color: "red" },
    { tipo: "x", color: "blue" },
  ];

  const prevLineWidth = doc.getLineWidth();

  const dibujarLineasConSeparacion = (pts, tipo, color) => {
    if (pts.length < 2) return;
    if (color === "red") {
      doc.setLineWidth(0.95);
      doc.setDrawColor(255, 0, 0);
    } else if (color === "blue") {
      doc.setLineWidth(0.4);
      doc.setDrawColor(0, 0, 255);
    } else {
      doc.setLineWidth(0.4);
      doc.setDrawColor(0, 0, 0);
    }
    doc.setLineCap(1);
    let prev = null;
    for (let i = 0; i < pts.length; i++) {
      const freqIdx = freqs.indexOf(pts[i].freq);
      if (freqIdx === -1) continue;
      let x = graphX + freqIdx * (graphW / (freqs.length - 1));
      let y = graphY + ((pts[i].db + 10) / 130) * graphH;
      const haySuperposicion = puntos.some(p => p.freq === pts[i].freq && p.db === pts[i].db && p.tipo !== pts[i].tipo && p.db !== null && p.db !== undefined);
      if (haySuperposicion) {
        if (tipo === "x") x += 1; else if (tipo === "circle") x -= 1;
      }
      if (prev) doc.line(prev.x, prev.y, x, y);
      prev = { x, y };
    }
  };

  tipos.forEach(({ tipo, color }) => {
    const pts = puntos.filter(p => p.tipo === tipo && p.color === color && p.db !== null && p.db !== undefined).sort((a, b) => a.freq - b.freq);
    dibujarLineasConSeparacion(pts, tipo, color);
  });

  puntos.forEach((punto) => {
    if (punto.db === null || punto.db === undefined) return;
    const freqIdx = freqs.indexOf(punto.freq);
    if (freqIdx === -1) return;
    const xP = graphX + freqIdx * (graphW / (freqs.length - 1));
    const yP = graphY + ((punto.db + 10) / 130) * graphH;
    if (punto.tipo === "circle") {
      doc.setDrawColor(255, 0, 0);
      doc.setLineWidth(0.4);
      doc.circle(xP, yP, 1.0);
    } else if (punto.tipo === "x") {
      doc.setDrawColor(0, 0, 255);
      doc.setLineWidth(0.4);
      const size = 2;
      doc.line(xP - size / 2, yP - size / 2, xP + size / 2, yP + size / 2);
      doc.line(xP - size / 2, yP + size / 2, xP + size / 2, yP - size / 2);
    }
    doc.setDrawColor(0, 0, 0);
  });
  doc.setLineWidth(prevLineWidth);

  // avanzar y debajo del gráfico
  yPos = Math.max(yPos, graphY + graphH + 8);

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8});

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