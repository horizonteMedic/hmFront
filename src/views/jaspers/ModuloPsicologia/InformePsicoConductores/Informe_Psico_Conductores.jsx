import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import { convertirGenero } from "../../../utils/helpers.js";
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from '../../../utils/dibujarFirmas.js';

export default function InformePsicoConductores(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Normalizador único de datos de entrada
  function buildDatosFinales(raw) {
    const datosFinales = {
      apellidosNombres: String((((raw?.apellidosPaciente ?? '') + ' ' + (raw?.nombresPaciente ?? '')).trim())),
      fechaExamen: formatearFechaCorta(raw?.fechaRegistro ?? ''),
      sexo: convertirGenero(raw?.sexoPaciente ?? ''),
      documentoIdentidad: String(raw?.dniPaciente ?? ''),
      edad: String(raw?.edadPaciente ?? ''),
      fechaNacimiento: formatearFechaCorta(raw?.fechaNacimientoPaciente ?? ''),
      domicilio: String(raw?.direccionPaciente ?? ''),
      areaTrabajo: String(raw?.areaPaciente ?? raw?.ocupacionPaciente ?? ''),
      puestoTrabajo: String(raw?.cargoPaciente ?? ''),
      empresa: String(raw?.empresa ?? ''),
      contrata: String(raw?.contrata ?? ''),
      sede: String(raw?.sede ?? raw?.nombreSede ?? ''),
      numeroFicha: String(raw?.norden ?? ""),
      tipoExamen: String(raw?.tipoExamen ?? ''),
      color: Number(raw?.color ?? 0),
      codigoColor: String(raw?.codigoColor ?? ''),
      textoColor: String(raw?.textoColor ?? ''),
      // Datos específicos para conductores - usando solo las variables de la data
      atencion: String(raw?.critAtencion ?? ''),
      concentracion: String(raw?.critConcentracion ?? ''),
      seguridadControlConducta: String(raw?.critSeguridadControlConduc ?? ''),
      fortalezasOportunidades: String(raw?.analisisFodaFortalezasOportunidades ?? ''),
      amenazasDebilidades: String(raw?.analisisFodaAmenazasDebilidades ?? ''),
      observaciones: String(raw?.observacion ?? ''),
      recomendaciones: String(raw?.recomendacion ?? ''),
      cumplePerfil: (typeof raw?.perfilCumple === 'boolean') ? raw.perfilCumple : (raw?.perfilCumple === true || raw?.perfilCumple === 'true' || raw?.perfilCumple === 1),
    };
    return datosFinales;
  }

  const datosFinales = buildDatosFinales(data);

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Títulos
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("INFORME PARA CONDUCTORES", pageW / 2, 30, { align: "center" });

    // Número de Ficha, Sede, Fecha y Página
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 70, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 50, 16);

    // Calcular ancho disponible para la sede (evitar que se pise con el ColorBox)
    // ColorBox está en x: pageW - 30, size: 22, showLine: true
    // rightEdge = pageW - 30 + 22 + 3 = pageW - 5
    const xInicioSede = pageW - 70;
    const xFinColorBox = pageW - 5;
    const anchoDisponibleSede = xFinColorBox - xInicioSede - 5; // 5mm de margen

    doc.setFont("helvetica", "normal").setFontSize(8);
    // Dividir el texto de la sede si es muy largo
    const textoSede = "Sede: " + datosFinales.sede;
    const lineasSede = doc.splitTextToSize(textoSede, anchoDisponibleSede);
    lineasSede.forEach((linea, idx) => {
      doc.text(linea, xInicioSede, 20 + (idx * 3.5));
    });
    
    // Ajustar posición de "Fecha de examen" según la cantidad de líneas de la sede
    const yFechaExamen = lineasSede.length === 1 ? 25 : 20 + (lineasSede.length * 3.5) + 2;
    doc.text("Fecha de examen: " + (datosFinales.fechaExamen || ""), pageW - 70, yFechaExamen);
    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 25, 8);

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

  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
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
          yPos += fontSize * 0.35;
          lineaActual = palabra;
        } else {
          doc.text(palabra, x, yPos);
          yPos += fontSize * 0.35;
        }
      }
    });

    if (lineaActual) {
      doc.text(lineaActual, x, yPos);
    }

    return yPos;
  };

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

    // Dibujar texto del título (centrado verticalmente)
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + alturaHeader / 2 + 1.2);

    return yPos + alturaHeader;
  };

  // Función para dibujar texto justificado
  const dibujarTextoJustificado = (texto, x, y, anchoMaximo, alturaMinima = 20) => {
    if (!texto || texto.trim() === '') {
      doc.rect(tablaInicioX, y, tablaAncho, alturaMinima, 'S');
      return y + alturaMinima;
    }

    const padding = 3;
    doc.setFont("helvetica", "normal").setFontSize(9);
    
    // Dividir texto en líneas
    const lineas = doc.splitTextToSize(String(texto), anchoMaximo - 4);
    const alturaTexto = lineas.length * 3.5 + padding * 2;
    const alturaFinal = Math.max(alturaMinima, alturaTexto);
    
    // Dibujar borde
    doc.rect(tablaInicioX, y, tablaAncho, alturaFinal, 'S');
    
    // Dibujar texto justificado
    lineas.forEach((linea, idx) => {
      doc.text(linea, x + 2, y + padding + 2 + (idx * 3.5), { align: "justify", maxWidth: anchoMaximo - 4 });
    });
    
    return y + alturaFinal;
  };

  // === PÁGINA 1 ===
  drawHeader(numeroPagina);

  // === SECCIÓN 1: DATOS DE FILIACIÓN ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 35;
  const filaAltura = 5;
  const paddingVertical = 2; // Padding vertical para secciones con texto dinámico

  // Header de datos de filiación
  yPos = dibujarHeaderSeccion("I. DATOS DE FILIACIÓN", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres con división para Tipo de examen
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Tercera fila: Domicilio
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Cuarta fila: Área de Trabajo
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Puesto de Trabajo
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Sexta fila: Empresa
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Séptima fila: Contratista
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 35 + 2;

  // Primera fila: Apellidos y Nombres
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 1.5, 95);

  // Columna derecha: Tipo de examen
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.tipoExamen || "", tablaInicioX + 155, yTexto + 1.5);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.edad + " Años", tablaInicioX + 58, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.sexo, tablaInicioX + 105, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.fechaNacimiento, tablaInicioX + 165, yTexto + 1.5);
  yTexto += filaAltura;

  // Tercera fila: Domicilio
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.domicilio, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Cuarta fila: Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo, tablaInicioX + 30, yTexto + 1.5, tablaAncho - 35);
  yTexto += filaAltura;

  // Quinta fila: Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo, tablaInicioX + 35, yTexto + 1.5, tablaAncho - 40);
  yTexto += filaAltura;

  // Sexta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 25);
  yTexto += filaAltura;

  // Séptima fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.contrata, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

 

  // Verificar si necesitamos nueva página
  if (yPos + 30 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 35;
    drawHeader(numeroPagina);
  }

  yPos = dibujarHeaderSeccion("II. CRITERIOS DE EVALUACIÓN", yPos, filaAltura);

  // Tabla de criterios de evaluación
  // Ancho fijo para la columna de criterios (suficiente para el más largo)
  const colCriterio = 85; // Ancho suficiente para "SEGURIDAD Y CONTROL DE CONDUCTA"

  // Definir criterios
  const criterios = [
    { nombre: "ATENCIÓN", valor: datosFinales.atencion || "" },
    { nombre: "CONCENTRACIÓN", valor: datosFinales.concentracion || "" },
    { nombre: "SEGURIDAD Y CONTROL DE CONDUCTA", valor: datosFinales.seguridadControlConducta || "" }
  ];

  // Dibujar filas de criterios
  criterios.forEach((criterio, idx) => {
    const yFila = yPos + (idx * filaAltura);
    
    // Calcular altura necesaria para el valor (si es largo)
    doc.setFont("helvetica", "normal").setFontSize(9);
    const anchoDisponibleValor = tablaAncho - colCriterio - 4;
    const lineasValor = doc.splitTextToSize(criterio.valor, anchoDisponibleValor);
    const alturaFila = Math.max(filaAltura, lineasValor.length * 3.5 + 1);
    
    // Dibujar rectángulo completo de la fila
    doc.rect(tablaInicioX, yFila, tablaAncho, alturaFila, 'S');
    
    // Línea divisoria entre criterio y resultado
    doc.line(tablaInicioX + colCriterio, yFila, tablaInicioX + colCriterio, yFila + alturaFila);

    // Texto del criterio
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(criterio.nombre, tablaInicioX + 2, yFila + 3.5);

    // Texto del resultado (justo después del label, sin mucho espacio)
    doc.setFont("helvetica", "normal").setFontSize(9);
    if (lineasValor.length === 1) {
      // Una sola línea, centrar verticalmente
      doc.text(lineasValor[0], tablaInicioX + colCriterio + 2, yFila + 3.5);
    } else {
      // Múltiples líneas, centrar verticalmente
      const yInicioTexto = yFila + alturaFila / 2 - ((lineasValor.length - 1) * 3.5) / 2;
      lineasValor.forEach((linea, lineIdx) => {
        doc.text(linea, tablaInicioX + colCriterio + 2, yInicioTexto + (lineIdx * 3.5));
      });
    }
  });

  // Ajustar yPos considerando la altura de todas las filas
  const alturaTotal = criterios.reduce((total, criterio) => {
    doc.setFont("helvetica", "normal").setFontSize(9);
    const anchoDisponibleValor = tablaAncho - colCriterio - 4;
    const lineasValor = doc.splitTextToSize(criterio.valor, anchoDisponibleValor);
    return total + Math.max(filaAltura, lineasValor.length * 3.5 + 1);
  }, 0);
  yPos += alturaTotal;

  // === SECCIÓN 3: ANÁLISIS FODA ===
  // Verificar si necesitamos nueva página
  if (yPos + 30 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 35;
    drawHeader(numeroPagina);
  }

  yPos = dibujarHeaderSeccion("III. ANÁLISIS FODA", yPos, filaAltura);

  // Fila: FORTALEZAS / OPORTUNIDADES (con altura dinámica)
  const anchoLabel = 58;
  const anchoValor = tablaAncho - anchoLabel - 4;
  const textoFortalezas = datosFinales.fortalezasOportunidades || "-";
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
  const textoAmenazas = datosFinales.amenazasDebilidades || "-";
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

  // === SECCIÓN 4: OBSERVACIONES ===
  // Verificar si necesitamos nueva página
  if (yPos + 30 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 35;
    drawHeader(numeroPagina);
  }

  yPos = dibujarHeaderSeccion("IV. OBSERVACIONES", yPos, filaAltura);

  // Fila creciente para observaciones
  yPos = dibujarTextoJustificado(datosFinales.observaciones, tablaInicioX, yPos, tablaAncho - 4, 20);

  // === SECCIÓN 5: RECOMENDACIONES ===
  // Verificar si necesitamos nueva página
  if (yPos + 30 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 35;
    drawHeader(numeroPagina);
  }

  yPos = dibujarHeaderSeccion("V. RECOMENDACIONES:", yPos, filaAltura);

  // Función para procesar recomendaciones (separar por líneas o guiones)
  const procesarRecomendaciones = (texto) => {
    if (!texto || texto.trim() === '') return [];
    
    // Si tiene saltos de línea, dividir por ellos
    if (texto.includes('\n')) {
      return texto.split('\n').filter(item => item.trim() !== '');
    }
    
    // Si tiene guiones al inicio, dividir por ellos
    if (texto.includes('-')) {
      const items = texto.split(/-/).filter(item => item.trim() !== '');
      return items.map(item => item.trim());
    }
    
    // Si no, devolver como un solo item
    return [texto];
  };

  // Procesar recomendaciones
  const itemsRecomendaciones = procesarRecomendaciones(datosFinales.recomendaciones);
  
  // Calcular altura necesaria con padding vertical
  let alturaRecomendaciones = 20;
  if (itemsRecomendaciones.length > 0) {
    let alturaTotal = 0;
    itemsRecomendaciones.forEach(item => {
      const lineas = doc.splitTextToSize(item, tablaAncho - 8);
      alturaTotal += lineas.length * 3.5 + 2;
    });
    alturaRecomendaciones = Math.max(20, alturaTotal + paddingVertical * 2 + 2);
  }
  
  // Dibujar borde
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaRecomendaciones, 'S');
  
  // Dibujar recomendaciones con texto justificado
  doc.setFont("helvetica", "normal").setFontSize(9);
  let yRecomendaciones = yPos + paddingVertical + 3;
  itemsRecomendaciones.forEach(item => {
    const textoItem = item.trim().startsWith('-') ? item.trim() : '- ' + item.trim();
    const lineas = doc.splitTextToSize(textoItem, tablaAncho - 8);
    lineas.forEach(linea => {
      doc.text(linea, tablaInicioX + 2, yRecomendaciones, { align: "justify", maxWidth: tablaAncho - 8 });
      yRecomendaciones += 3.5;
    });
  });

  // Guardar yPos para después de las recomendaciones
  const yPosDespuesRecomendaciones = yPos + alturaRecomendaciones;

  // === SECCIÓN 6: CUMPLE CON EL PERFIL ===
  // Verificar si necesitamos nueva página
  if (yPosDespuesRecomendaciones + 20 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 35;
    drawHeader(numeroPagina);
  } else {
    yPos = yPosDespuesRecomendaciones;
  }

  yPos = dibujarHeaderSeccion("VI. CUMPLE CON EL PERFIL PARA EL PUESTO QUE POSTULA", yPos, filaAltura);

  // Fila con 4 columnas: SI | (vacía) | NO | (vacía)
  const colTextoW = (tablaAncho - 30) / 2; // Ancho para columnas de texto
  const colVaciaW = 15; // Ancho para columnas vacías

  // Dibujar las 4 columnas
  doc.rect(tablaInicioX, yPos, colTextoW, filaAltura, 'S'); // Columna 1: SI
  doc.rect(tablaInicioX + colTextoW, yPos, colVaciaW, filaAltura, 'S'); // Columna 2: Vacía
  doc.rect(tablaInicioX + colTextoW + colVaciaW, yPos, colTextoW, filaAltura, 'S'); // Columna 3: NO
  doc.rect(tablaInicioX + colTextoW * 2 + colVaciaW, yPos, colVaciaW, filaAltura, 'S'); // Columna 4: Vacía

  // Texto en las columnas
  doc.setFont("helvetica", "bold").setFontSize(9);
  const centroVertical = yPos + filaAltura / 2 + 1; // Centro vertical de la celda
  doc.text("SI", tablaInicioX + colTextoW / 2, centroVertical, { align: "center" });
  doc.text("NO", tablaInicioX + colTextoW + colVaciaW + colTextoW / 2, centroVertical, { align: "center" });

  // Marcar X según cumplePerfil (en las columnas vacías)
  const cumplePerfil = datosFinales.cumplePerfil ?? true;
  doc.setFont("helvetica", "bold").setFontSize(12);
  if (cumplePerfil) {
    // Marcar X en la columna vacía después de SI (columna 2) - centrada vertical y horizontalmente
    doc.text("X", tablaInicioX + colTextoW + colVaciaW / 2, centroVertical, { align: "center" });
  } else {
    // Marcar X en la columna vacía después de NO (columna 4) - centrada vertical y horizontalmente
    doc.text("X", tablaInicioX + colTextoW * 2 + colVaciaW + colVaciaW / 2, centroVertical, { align: "center" });
  }

  yPos += filaAltura;

  // === SECCIÓN 7: FIRMA ===
  // Verificar si necesitamos nueva página
  if (yPos + 30 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 35;
    drawHeader(numeroPagina);
  }

  // Dibujar sección de firma con borde
  const alturaSeccionFirma = 30;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaSeccionFirma, 'S');

  // Usar la función dibujarFirmas para dibujar las firmas
  dibujarFirmas({ doc, datos: data, y: yPos + 2, pageW }).then(() => {
    // === FOOTER ===
    footerTR(doc, { footerOffsetY: 12, fontSize: 7 });

    // === Imprimir ===
    if (!docExistente) {
      imprimir(doc);
    }
  }).catch(err => {
    console.error("Error al cargar firmas:", err);
    
    // === FOOTER ===
    footerTR(doc, { footerOffsetY: 12, fontSize: 7 });
    
    // === Imprimir ===
    if (!docExistente) {
      imprimir(doc);
    }
  });

  // Si hay docExistente, retornar el doc (las firmas se agregarán asíncronamente)
  if (docExistente) {
    footerTR(doc, { footerOffsetY: 12, fontSize: 7 });
    return doc;
  }
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

