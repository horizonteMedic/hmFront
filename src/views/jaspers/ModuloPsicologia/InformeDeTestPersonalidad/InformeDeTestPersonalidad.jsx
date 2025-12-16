import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import { convertirGenero } from "../../../utils/helpers.js";
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from "../../../utils/dibujarFirmas.js";

export default function InformeDeTestPersonalidad(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Normalizador único de datos de entrada
  function buildDatosFinales(raw) {
    const datosFinales = {
      apellidosNombres: String((((raw?.apellidosPaciente ?? '') + ' ' + (raw?.nombresPaciente ?? '')).trim())),
      fechaExamen: formatearFechaCorta(raw?.fechaEntrevista ?? raw?.fechaExamen ?? ''),
      sexo: convertirGenero(raw?.sexoPaciente ?? ''),
      documentoIdentidad: String(raw?.dniPaciente ?? ''),
      edad: String(raw?.edadPaciente ?? ''),
      fechaNacimiento: formatearFechaCorta(raw?.fechaNacimientoPaciente ?? ''),
      domicilio: String(raw?.direccionPaciente ?? ''),
      areaTrabajo: String(raw?.areaPaciente ?? ''),
      puestoTrabajo: String(raw?.cargoPaciente ?? ''),
      empresa: String(raw?.empresa ?? ''),
      contrata: String(raw?.contrata ?? ''),
      sede: String(raw?.sede ?? raw?.nombreSede ?? ''),
      numeroFicha: String(raw?.norden ?? ""),
      tipoExamen: String(raw?.nombreExamen ?? ''),
      color: Number(raw?.color ?? 0),
      codigoColor: String(raw?.codigoColor ?? ''),
      textoColor: String(raw?.textoColor ?? ''),
      analisisResultados: String(raw?.analisisResultados ?? ''),
      recomendaciones: String(raw?.recomendaciones ?? ''),
      cumplePerfil: (typeof raw?.cumplePerfil === 'boolean') ? raw.cumplePerfil : (raw?.cumplePerfil === true || raw?.cumplePerfil === 'true' || raw?.cumplePerfil === 1),
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
    doc.text("INFORME DE TEST DE PERSONALIDAD", pageW / 2, 30, { align: "center" });

    // Número de Ficha, Sede, Fecha y Página
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("Nro de ficha: ", pageW - 70, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 50, 16);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosFinales.sede, pageW - 70, 20);
    doc.text("Fecha de examen: " + (datosFinales.fechaExamen || ""), pageW - 70, 25);
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
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4, infoAdicional = null) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;

    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // Dibujar fondo gris más oscuro
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');

    // Si hay información adicional, dibujar división
    if (infoAdicional) {
      doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + alturaHeader);
    }

    // Dibujar líneas del header
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);

    // Dibujar texto del título (centrado verticalmente)
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + alturaHeader / 2 + 1.2);

    // Dibujar información adicional a la derecha si existe
    if (infoAdicional) {
      doc.setFont("helvetica", "bold").setFontSize(9);
      doc.text(infoAdicional.label + ":", tablaInicioX + 137, yPos + alturaHeader / 2 + 1.2);
      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.text(infoAdicional.valor || "", tablaInicioX + 175, yPos + alturaHeader / 2 + 1.2);
    }

    return yPos + alturaHeader;
  };

  // === PÁGINA 1 ===
  drawHeader(numeroPagina);

  // === SECCIÓN 1: DATOS DE FILIACIÓN ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 35;
  const filaAltura = 5;

  // Header de datos de filiación
  yPos = dibujarHeaderSeccion("I. DATOS DE FILIACIÓN", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres con división para Tipo de examen
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura); // División para Tipo de examen
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

  // Tercera fila: Domicilio (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Cuarta fila: Área de Trabajo (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Puesto de Trabajo (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Sexta fila: Empresa (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Séptima fila: Contratista (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 35 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  // Ajustar ancho para la nueva división (hasta x = tablaInicioX + 135)
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 1.5, 95);

  // Columna derecha: Tipo de examen
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.tipoExamen || "", tablaInicioX + 155, yTexto + 1.5);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
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

  // === SECCIÓN 2: ASPECTOS EVALUADOS ===

  // Configuración de columnas de la tabla
  const colGrupo = 30; // Columna para GRUPO A, B, C
  const colAspecto = 90; // Columna para los aspectos evaluados
  const colBajo = 28;
  const colMedio = 28;
  const colAlto = 24;

  // Header de la tabla con colores
  // Columna "ASPECTOS EVALUADOS" (abarca grupo + aspecto)
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, colGrupo + colAspecto, filaAltura, 'F');
  doc.rect(tablaInicioX, yPos, colGrupo + colAspecto, filaAltura, 'S');
  
  // Columna Bajo (Rojo)
  doc.setFillColor(255, 0, 0);
  doc.rect(tablaInicioX + colGrupo + colAspecto, yPos, colBajo, filaAltura, 'F');
  doc.rect(tablaInicioX + colGrupo + colAspecto, yPos, colBajo, filaAltura, 'S');
  
  // Columna Medio (Amarillo)
  doc.setFillColor(255, 255, 0);
  doc.rect(tablaInicioX + colGrupo + colAspecto + colBajo, yPos, colMedio, filaAltura, 'F');
  doc.rect(tablaInicioX + colGrupo + colAspecto + colBajo, yPos, colMedio, filaAltura, 'S');
  
  // Columna Alto (Verde)
  doc.setFillColor(0, 255, 0);
  doc.rect(tablaInicioX + colGrupo + colAspecto + colBajo + colMedio, yPos, colAlto, filaAltura, 'F');
  doc.rect(tablaInicioX + colGrupo + colAspecto + colBajo + colMedio, yPos, colAlto, filaAltura, 'S');

  // Textos del header
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("ASPECTOS EVALUADOS", tablaInicioX + (colGrupo + colAspecto) / 2, yPos + 4, { align: "center" });
  doc.text("Bajo", tablaInicioX + colGrupo + colAspecto + colBajo / 2, yPos + 4, { align: "center" });
  doc.text("Medio", tablaInicioX + colGrupo + colAspecto + colBajo + colMedio / 2, yPos + 4, { align: "center" });
  doc.text("Alto", tablaInicioX + colGrupo + colAspecto + colBajo + colMedio + colAlto / 2, yPos + 4, { align: "center" });
  yPos += filaAltura;

  // Función para dibujar grupo con título que se extiende verticalmente
  const dibujarGrupo = (tituloGrupo, aspectos, y) => {
    const numFilas = aspectos.length;
    const alturaGrupo = filaAltura * numFilas;
    
    // Celda del grupo que se extiende verticalmente
    doc.rect(tablaInicioX, y, colGrupo, alturaGrupo, 'S');
    doc.setFont("helvetica", "bold").setFontSize(8);
    // Centrar verticalmente el texto del grupo
    const lineas = doc.splitTextToSize(tituloGrupo, colGrupo - 2);
    const yTexto = y + alturaGrupo / 2 - (lineas.length * 2.5) / 2 + 2;
    lineas.forEach((linea, idx) => {
      doc.text(linea, tablaInicioX + colGrupo / 2, yTexto + idx * 3, { align: "center" });
    });
    
      // Dibujar cada aspecto del grupo
      let currentY = y;
      aspectos.forEach((aspecto) => {
      // Celda aspecto
      doc.rect(tablaInicioX + colGrupo, currentY, colAspecto, filaAltura, 'S');
      doc.setFont("helvetica", "normal").setFontSize(8);
      // Manejar texto largo que puede necesitar múltiples líneas
      const textoAspecto = aspecto.nombre;
      const lineasAspecto = doc.splitTextToSize(textoAspecto, colAspecto - 4);
      if (lineasAspecto.length === 1) {
        doc.text(textoAspecto, tablaInicioX + colGrupo + 2, currentY + 4);
      } else {
        lineasAspecto.forEach((linea, idx) => {
          doc.text(linea, tablaInicioX + colGrupo + 2, currentY + 2 + (idx * 3));
        });
      }
      
      // Celdas Bajo, Medio, Alto
      doc.rect(tablaInicioX + colGrupo + colAspecto, currentY, colBajo, filaAltura, 'S');
      doc.rect(tablaInicioX + colGrupo + colAspecto + colBajo, currentY, colMedio, filaAltura, 'S');
      doc.rect(tablaInicioX + colGrupo + colAspecto + colBajo + colMedio, currentY, colAlto, filaAltura, 'S');
      
      // Marcar X según valor
      const valor = data[aspecto.campo] || '';
      const valorLower = String(valor).toLowerCase();
      if (valorLower === "bajo") {
        doc.text("X", tablaInicioX + colGrupo + colAspecto + colBajo / 2, currentY + 4, { align: "center" });
      } else if (valorLower === "medio") {
        doc.text("X", tablaInicioX + colGrupo + colAspecto + colBajo + colMedio / 2, currentY + 4, { align: "center" });
      } else if (valorLower === "alto") {
        doc.text("X", tablaInicioX + colGrupo + colAspecto + colBajo + colMedio + colAlto / 2, currentY + 4, { align: "center" });
      }
      
      currentY += filaAltura;
    });
    
    return currentY;
  };

  // GRUPO A
  yPos = dibujarGrupo("GRUPO A", [
    { nombre: "PARANOIDE", campo: "paranoide" },
    { nombre: "ESQUIZOIDE", campo: "esquizoide" },
    { nombre: "ESQUIZOTÍPICO", campo: "esquizotipico" }
  ], yPos);

  // GRUPO B
  yPos = dibujarGrupo("GRUPO B", [
    { nombre: "HISTRIÓNICO", campo: "histrionico" },
    { nombre: "ANTISOCIAL", campo: "antisocial" },
    { nombre: "NARCICISTA", campo: "narcicista" },
    { nombre: "T. INESTABILIDAD EMOCIONAL SUBTIPO IMPULSIVO", campo: "inestabilidadEmocionalImpulsivo" },
    { nombre: "T. INTESTABILIDAD EMOCIONAL SUBTIPO LÍMITE", campo: "inestabilidadEmocionalLimite" }
  ], yPos);

  // GRUPO C
  yPos = dibujarGrupo("GRUPO C", [
    { nombre: "ANANCÁSTICO", campo: "anancastico" },
    { nombre: "DEPENDIENTE", campo: "dependiente" },
    { nombre: "ANSIOSO", campo: "ansioso" }
  ], yPos);

  
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("ANÁLISIS Y RESULTADOS", tablaInicioX + 2, yPos + 4);
  yPos += filaAltura;

  // Función para dibujar texto justificado
  const dibujarTextoJustificado = (texto, x, y, anchoMaximo, alturaMinima = 20) => {
    if (!texto || texto.trim() === '') {
      doc.rect(tablaInicioX, yPos, tablaAncho, alturaMinima, 'S');
      return yPos + alturaMinima;
    }

    const padding = 3;
    doc.setFont("helvetica", "normal").setFontSize(8);
    
    // Dividir texto en líneas
    const lineas = doc.splitTextToSize(String(texto), anchoMaximo - 4);
    const alturaTexto = lineas.length * 3.5 + padding * 2;
    const alturaFinal = Math.max(alturaMinima, alturaTexto);
    
    // Dibujar borde
    doc.rect(tablaInicioX, y, tablaAncho, alturaFinal, 'S');
    
    // Dibujar texto
    lineas.forEach((linea, idx) => {
      doc.text(linea, x + 2, y + padding + 2 + (idx * 3.5));
    });
    
    return y + alturaFinal;
  };

  // Fila creciente para análisis
  yPos = dibujarTextoJustificado(datosFinales.analisisResultados, tablaInicioX, yPos, tablaAncho - 4, 20);

  // === SECCIÓN 4: RECOMENDACIONES ===
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("RECOMENDACIONES:", tablaInicioX + 2, yPos + 4);
  yPos += filaAltura;

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
  
  // Calcular altura necesaria
  let alturaRecomendaciones = 20;
  if (itemsRecomendaciones.length > 0) {
    let alturaTotal = 0;
    itemsRecomendaciones.forEach(item => {
      const lineas = doc.splitTextToSize(item, tablaAncho - 8);
      alturaTotal += lineas.length * 3.5 + 2;
    });
    alturaRecomendaciones = Math.max(20, alturaTotal + 4);
  }
  
  // Dibujar borde
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaRecomendaciones, 'S');
  
  // Dibujar recomendaciones
  doc.setFont("helvetica", "normal").setFontSize(8);
  let yRecomendaciones = yPos + 3;
  itemsRecomendaciones.forEach(item => {
    const textoItem = item.trim().startsWith('-') ? item.trim() : '- ' + item.trim();
    const lineas = doc.splitTextToSize(textoItem, tablaAncho - 8);
    lineas.forEach(linea => {
      doc.text(linea, tablaInicioX + 2, yRecomendaciones);
      yRecomendaciones += 3.5;
    });
  });
  yPos += alturaRecomendaciones;

  // === SECCIÓN 5: CONCLUSIONES ===
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CONCLUSIONES", tablaInicioX + 2, yPos + 4);
  yPos += filaAltura;

  // Fila de CUMPLE / NO CUMPLE CON EL PERFIL (4 columnas)
  // Estructura: CUMPLE CON EL PERFIL | (vacía) | NO CUMPLE CON EL PERFIL | X
  const colXW = 15; // Ancho para columna de X
  const colVaciaW = 15; // Ancho para columna vacía
  const colTextoW = (tablaAncho - colVaciaW - colXW) / 2; // Ancho para columnas de texto
  
  // Dibujar las 4 columnas
  doc.rect(tablaInicioX, yPos, colTextoW, filaAltura, 'S'); // Columna 1: CUMPLE CON EL PERFIL
  doc.rect(tablaInicioX + colTextoW, yPos, colVaciaW, filaAltura, 'S'); // Columna 2: Vacía
  doc.rect(tablaInicioX + colTextoW + colVaciaW, yPos, colTextoW, filaAltura, 'S'); // Columna 3: NO CUMPLE CON EL PERFIL
  doc.rect(tablaInicioX + colTextoW * 2 + colVaciaW, yPos, colXW, filaAltura, 'S'); // Columna 4: X

  const cumplePerfil = datosFinales.cumplePerfil ?? true;
  
  // Columna 1: CUMPLE CON EL PERFIL
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("CUMPLE CON EL PERFIL", tablaInicioX + colTextoW / 2, yPos + 4, { align: "center" });
  
  // Columna 2: Vacía
  
  // Columna 3: NO CUMPLE CON EL PERFIL
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("NO CUMPLE CON EL PERFIL", tablaInicioX + colTextoW + colVaciaW + colTextoW / 2, yPos + 4, { align: "center" });
  
  // Columna 4: X (si NO cumple)
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text(!cumplePerfil ? "X" : "", tablaInicioX + colTextoW * 2 + colVaciaW + colXW / 2, yPos + 4, { align: "center" });
  
  yPos += filaAltura;

  // === SECCIÓN 6: FIRMAS ===
  const alturaSeccionFirmas = 32; // Altura ajustada para que quepa el texto completo dentro
  const baseY = yPos;

  // Dibujar los bordes de la fila de firmas
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, baseY, tablaAncho, alturaSeccionFirmas);

  // Usar helper para dibujar firmas (ajustar Y para que queden dentro de la fila)
  dibujarFirmas({ doc, datos: data, y: baseY + 2, pageW }).then(() => {
    // === FOOTER ===
    footerTR(doc, { footerOffsetY: 10 });

    // Imprimir
    if (!docExistente) {
      imprimir(doc);
    }
  }).catch(err => {
    console.error(err);
    // === FOOTER ===
    footerTR(doc, { footerOffsetY: 10 });
    
    if (!docExistente) {
      imprimir(doc);
    }
  });

  // Si hay docExistente, retornar el doc (las firmas se agregarán asíncronamente)
  if (docExistente) {
    footerTR(doc, { footerOffsetY: 10 });
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

