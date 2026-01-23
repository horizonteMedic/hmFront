import jsPDF from "jspdf";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import drawColorBox from '../../components/ColorBox.jsx';
import footerTR from '../../components/footerTR.jsx';
import { formatearFechaCorta } from '../../../utils/formatDateUtils';
import { dibujarFirmas } from '../../../utils/dibujarFirmas.js';

// Header con logo, color box y título
const drawHeader = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false, yOffset: 10 });

  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(7);
  const sedeValue = datos.sede || datos.nombreSede || "";
  doc.text("Sede: " + sedeValue, pageW - 80, 20);

  // Fecha de examen
  const fechaExamen = formatearFechaCorta(datos.fechaExamen || datos.fechaRegistro || datos.fecha || datos.fechaOf || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);

  // Página
  doc.text("Pag. 01", pageW - 30, 10);

  // Bloque de color
  if (datos.color && datos.textoColor) {
    drawColorBox(doc, {
      color: datos.codigoColor || "#008f39",
      text: datos.textoColor,
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  }
};

// Función para dibujar texto con salto de línea
const dibujarTextoConSaltoLinea = (doc, texto, x, y, anchoMaximo) => {
  const fontSize = doc.internal.getFontSize();
  const palabras = String(texto || "").split(' ');
  let lineaActual = '';
  let yActual = y;
  palabras.forEach(palabra => {
    const prueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
    const w = doc.getTextWidth(prueba);
    if (w <= anchoMaximo) {
      lineaActual = prueba;
    } else {
      if (lineaActual) {
        doc.text(lineaActual, x, yActual);
        yActual += fontSize * 0.35;
        lineaActual = palabra;
      } else {
        doc.text(palabra, x, yActual);
        yActual += fontSize * 0.35;
      }
    }
  });
  if (lineaActual) doc.text(lineaActual, x, yActual);
  return yActual;
};

// Divide texto en líneas según el ancho disponible (mejor para tablas/celdas)
const obtenerLineasTexto = (doc, texto, anchoMaximo) => {
  const t = String(texto ?? "");
  if (!t.trim()) return [""];
  return doc.splitTextToSize(t, anchoMaximo);
};

// Dibuja texto envuelto y centrado verticalmente dentro de una celda
const dibujarTextoCentradoVertical = (doc, texto, x, yTop, altoCelda, anchoMaximo) => {
  const fontSize = doc.internal.getFontSize(); // pt
  const lineHeight = fontSize * 0.35; // mm aprox (coincide con el resto del layout de este reporte)

  const lineas = obtenerLineasTexto(doc, texto, anchoMaximo);
  const n = Math.max(1, lineas.length);
  const blockH = (n - 1) * lineHeight;

  // baseline del primer renglón para que el bloque quede centrado
  let yFirst = yTop + altoCelda / 2 - blockH / 2 + 1;
  // evita pegarse al borde superior
  yFirst = Math.max(yTop + 2.5, yFirst);

  let y = yFirst;
  for (const ln of lineas) {
    doc.text(String(ln ?? ""), x, y);
    y += lineHeight;
  }
};

// Función para dibujar datos personales
const drawPatientData = (doc, datos = {}) => {
  // Parámetros de tabla
  const tablaInicioX = 5;
  const tablaInicioY = 35;
  const tablaAncho = 200;
  const filaAltura = 5;
  let yPos = tablaInicioY;

  // Header de sección filiación (datos personales)
  const dibujarHeaderSeccion = (titulo, yPosLocal, alturaHeader = 4) => {
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPosLocal, tablaAncho, alturaHeader, 'F');
    doc.line(tablaInicioX, yPosLocal, tablaInicioX + tablaAncho, yPosLocal);
    doc.line(tablaInicioX, yPosLocal + alturaHeader, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.line(tablaInicioX, yPosLocal, tablaInicioX, yPosLocal + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPosLocal, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(titulo, tablaInicioX + 2, yPosLocal + 3);
    return yPosLocal + alturaHeader;
  };

  // Preparar datos
  const nombre = String(datos.nombre || "");
  const apellido = String(datos.apellido || "");
  const nombresCompletos = `${nombre} ${apellido}`.trim();
  const dni = String(datos.dni || "");
  const edad = String(datos.edad || "").replace(" años", "").trim();
  const sexo = datos.sexo === 'F' || datos.sexo === 'Femenino' ? 'FEMENINO' : datos.sexo === 'M' || datos.sexo === 'Masculino' ? 'MASCULINO' : '';
  const fechaNacimiento = formatearFechaCorta(datos.fechaNac || datos.fechaNacimiento || "");
  const puestoTrabajo = String(datos.ocupacion || datos.cargo || datos.cargoPaciente || datos.puestoTrabajo || "");
  const areaTrabajo = String(datos.areaO || datos.area || datos.areaPaciente || datos.areaTrabajo || "");
  const empresa = String(datos.empresa || "");
  const contrata = String(datos.contrata || "");

  // Sección: 1. DATOS DE FILIACIÓN
  yPos = dibujarHeaderSeccion("1. DATOS DE FILIACIÓN", yPos, filaAltura);

  // Fila: Apellidos y Nombres (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
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

  // Fila: Puesto de Trabajo (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Área de Trabajo (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
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

  // Contenido de la tabla (ubicar texto debajo del header gris)
  let yTexto = tablaInicioY + filaAltura + 2.5;

  // Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  dibujarTextoConSaltoLinea(doc, nombresCompletos, tablaInicioX + 35, yTexto + 1, 150);
  yTexto += filaAltura;

  // DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(dni, tablaInicioX + 12, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text((edad ? edad + " Años" : ""), tablaInicioX + 58, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(sexo, tablaInicioX + 105, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(fechaNacimiento || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  dibujarTextoConSaltoLinea(doc, puestoTrabajo, tablaInicioX + 30, yTexto + 1, 160);
  yTexto += filaAltura;

  // Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  dibujarTextoConSaltoLinea(doc, areaTrabajo, tablaInicioX + 30, yTexto + 1, 160);
  yTexto += filaAltura;

  // Empresa
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  dibujarTextoConSaltoLinea(doc, empresa, tablaInicioX + 24, yTexto + 1, 160);
  yTexto += filaAltura;

  // Contratista
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  dibujarTextoConSaltoLinea(doc, contrata, tablaInicioX + 24, yTexto + 1, 160);
  yTexto += filaAltura;

  return yPos;
};

// Función para dibujar X (checkbox marcado)
const dibujarX = (doc, x, y) => {
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("X", x, y, { align: "center" });
};

// Función para dibujar Evaluación Oftalmológica (campos de texto)
const drawEvaluacionOftalmologica = (doc, datos = {}, yInicio) => {
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 5;
  let yPos = yInicio;

  // Header de sección
  const dibujarHeaderSeccion = (titulo, yPosLocal, alturaHeader = 4) => {
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPosLocal, tablaAncho, alturaHeader, 'F');
    doc.line(tablaInicioX, yPosLocal, tablaInicioX + tablaAncho, yPosLocal);
    doc.line(tablaInicioX, yPosLocal + alturaHeader, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.line(tablaInicioX, yPosLocal, tablaInicioX, yPosLocal + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPosLocal, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(titulo, tablaInicioX + 2, yPosLocal + 3);
    return yPosLocal + alturaHeader;
  };

  // Sección: EVALUACIÓN OFTALMOLÓGICA
  yPos = dibujarHeaderSeccion("EVALUACIÓN OFTALMOLÓGICA", yPos, filaAltura);

  const anchoColumna = tablaAncho / 2;

  // Fila 1: Párpados y Anexos | Cornea
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + anchoColumna, yPos, tablaInicioX + anchoColumna, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentro1 = yPos + filaAltura / 2 + 1;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Párpados y Anexos:", tablaInicioX + 2, yCentro1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datos.txtParpaAnex || "", tablaInicioX + 50, yCentro1);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Cornea:", tablaInicioX + anchoColumna + 2, yCentro1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datos.txtCorneas || "", tablaInicioX + anchoColumna + 50, yCentro1);
  yPos += filaAltura;

  // Fila 2: Cristalino | Conjuntivas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + anchoColumna, yPos, tablaInicioX + anchoColumna, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentro2 = yPos + filaAltura / 2 + 1;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Cristalino:", tablaInicioX + 2, yCentro2);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datos.txtCristalino || "", tablaInicioX + 50, yCentro2);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Conjuntivas:", tablaInicioX + anchoColumna + 2, yCentro2);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datos.txtConjuntivas || "", tablaInicioX + anchoColumna + 50, yCentro2);
  yPos += filaAltura;

  // Fila 3: Otros Hallazgos (fila completa, sin división de columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentro3 = yPos + filaAltura / 2 + 1;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Otros Hallazgos:", tablaInicioX + 2, yCentro3);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datos.txtOtrosHallaz || "", tablaInicioX + 50, yCentro3);
  yPos += filaAltura;

  return yPos;
};

// Función para dibujar Antecedentes
const drawAntecedentes = (doc, datos = {}, yInicio) => {
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 5;
  let yPos = yInicio;

  // Header de sección
  const dibujarHeaderSeccion = (titulo, yPosLocal, alturaHeader = 4) => {
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPosLocal, tablaAncho, alturaHeader, 'F');
    doc.line(tablaInicioX, yPosLocal, tablaInicioX + tablaAncho, yPosLocal);
    doc.line(tablaInicioX, yPosLocal + alturaHeader, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.line(tablaInicioX, yPosLocal, tablaInicioX, yPosLocal + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPosLocal, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(titulo, tablaInicioX + 2, yPosLocal + 3);
    return yPosLocal + alturaHeader;
  };

  // Sección: ANTECEDENTES
  yPos = dibujarHeaderSeccion("ANTECEDENTES", yPos, filaAltura);

  // Antecedentes Personales Importantes
  const antPers = String(datos.txtAntPersImp || "");
  const calcularAlturaTexto = (texto, anchoMaximo) => {
    doc.setFont("helvetica", "normal").setFontSize(7);
    const lineas = obtenerLineasTexto(doc, texto, anchoMaximo);
    const n = Math.max(1, lineas.length);
    return Math.max(filaAltura, n * 3.5 + 2);
  };
  
  const alturaAntecedentesPers = calcularAlturaTexto(antPers, 130);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaAntecedentesPers);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaAntecedentesPers);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaAntecedentesPers, tablaInicioX + tablaAncho, yPos + alturaAntecedentesPers);

  const yCentroAntecedentes = yPos + alturaAntecedentesPers / 2 + 1;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Antecedentes Personales Importantes:", tablaInicioX + 2, yCentroAntecedentes);
  doc.setFont("helvetica", "normal").setFontSize(7);
  dibujarTextoCentradoVertical(doc, antPers, tablaInicioX + 60, yPos, alturaAntecedentesPers, 130);
  yPos += alturaAntecedentesPers;

  // Antecedentes Familiares Importantes
  const antFam = String(datos.txtFamImp || "");
  const alturaAntecedentesFam = calcularAlturaTexto(antFam, 130);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaAntecedentesFam);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaAntecedentesFam);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaAntecedentesFam, tablaInicioX + tablaAncho, yPos + alturaAntecedentesFam);

  const yCentroFamiliares = yPos + alturaAntecedentesFam / 2 + 1;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Antecedentes Familiares Importantes:", tablaInicioX + 2, yCentroFamiliares);
  doc.setFont("helvetica", "normal").setFontSize(7);
  dibujarTextoCentradoVertical(doc, antFam, tablaInicioX + 60, yPos, alturaAntecedentesFam, 130);
  yPos += alturaAntecedentesFam;

  return yPos;
};

// Función para dibujar Pterigion (Grado) con checkboxes
const drawPterigionGrado = (doc, datos = {}, yInicio) => {
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 5;
  let yPos = yInicio;

  // Dibujar fila de Pterigion (Grado)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura);
  doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentro = yPos + filaAltura / 2 + 1;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Pterigion (Grado)", tablaInicioX + 2, yCentro);
  
  // Checkbox OD
  doc.text("OD", tablaInicioX + 62, yCentro);
  if (datos.rbecPterigionOd === true) {
    dibujarX(doc, tablaInicioX + 70, yCentro);
  }
  
  // Checkbox OI
  doc.text("OI", tablaInicioX + 82, yCentro);
  if (datos.rbecPterigionOi === true) {
    dibujarX(doc, tablaInicioX + 90, yCentro);
  }
  
  // Checkbox NO
  doc.text("NO", tablaInicioX + 102, yCentro);
  if (datos.rbecPterigionOd !== true && datos.rbecPterigionOi !== true) {
    // Solo marcar NO si ninguno está marcado
  }

  yPos += filaAltura;

  // Fila de Hallazgos
  const hallazgos = String(datos.txtecHallazgos || "");
  const calcularAlturaHallazgos = (texto, anchoMaximo) => {
    if (!texto || texto.trim() === "") return filaAltura;
    const palabras = texto.split(' ');
    let lineas = 1;
    let lineaActual = '';
    palabras.forEach(palabra => {
      const prueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
      doc.setFont("helvetica", "normal").setFontSize(7);
      const w = doc.getTextWidth(prueba);
      if (w <= anchoMaximo) {
        lineaActual = prueba;
      } else {
        if (lineaActual) {
          lineas++;
          lineaActual = palabra;
        } else {
          lineas++;
        }
      }
    });
    return Math.max(filaAltura, lineas * 3.5 + 2);
  };
  
  const alturaHallazgos = calcularAlturaHallazgos(hallazgos, 150);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHallazgos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHallazgos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaHallazgos, tablaInicioX + tablaAncho, yPos + alturaHallazgos);

  const yCentroHallazgos = yPos + alturaHallazgos / 2 + 1;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Hallazgos(describir):", tablaInicioX + 2, yCentroHallazgos);
  doc.setFont("helvetica", "normal").setFontSize(7);
  dibujarTextoConSaltoLinea(doc, hallazgos, tablaInicioX + 35, yPos + 2.5, 150);
  yPos += alturaHallazgos;

  return yPos;
};

// Función para dibujar agudeza visual (formato como plantilla: grupos OD/OI)
const drawAgudezaVisual = (doc, datos = {}, yInicio) => {
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 5;
  let yPos = yInicio;

  const getValor = (...keys) => {
    for (const k of keys) {
      const v = datos?.[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
    }
    return "";
  };

  // Layout: [Agudeza Visual] | (Sin Correctores: OD OI) | (Con Correctores: OD OI) | (Con Agujero Estenopeico: OD OI)
  const anchoLabel = 35;
  const anchoCol = (tablaAncho - anchoLabel) / 6; // 6 subcolumnas (OD/OI por cada grupo)

  const x0 = tablaInicioX;
  const xLabelEnd = x0 + anchoLabel;
  const x1 = xLabelEnd + anchoCol * 1;
  const x2 = xLabelEnd + anchoCol * 2; // fin grupo 1
  const x3 = xLabelEnd + anchoCol * 3;
  const x4 = xLabelEnd + anchoCol * 4; // fin grupo 2
  const x5 = xLabelEnd + anchoCol * 5;
  const x6 = xLabelEnd + anchoCol * 6; // fin grupo 3 = tabla fin

  // Header doble (2 filas)
  const headerH = filaAltura * 2;

  // Fondo gris solo para la primera fila del header (EXCEPTO la celda "Agudeza Visual")
  doc.setFillColor(196, 196, 196);
  doc.rect(xLabelEnd, yPos, tablaAncho - anchoLabel, filaAltura, "F");

  // Borde exterior del header (2 filas)
  doc.rect(tablaInicioX, yPos, tablaAncho, headerH);

  // Líneas verticales principales (label + separadores de grupo) en todo el header
  doc.line(xLabelEnd, yPos, xLabelEnd, yPos + headerH);
  doc.line(x2, yPos, x2, yPos + headerH);
  doc.line(x4, yPos, x4, yPos + headerH);

  // Líneas OD/OI (solo en la 2da fila del header)
  doc.line(x1, yPos + filaAltura, x1, yPos + headerH);
  doc.line(x3, yPos + filaAltura, x3, yPos + headerH);
  doc.line(x5, yPos + filaAltura, x5, yPos + headerH);

  // Separador horizontal entre fila 1 y 2 (solo desde grupos, para dejar "Agudeza Visual" como celda combinada)
  doc.line(xLabelEnd, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yHeader1 = yPos + filaAltura / 2 + 1;
  const yHeader2 = yPos + filaAltura + filaAltura / 2 + 1;
  const yLabelMerged = yPos + headerH / 2 + 1;

  // Textos del header
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Agudeza Visual", x0 + anchoLabel / 2, yLabelMerged, { align: "center" });
  doc.text("Sin Correctores", xLabelEnd + (x2 - xLabelEnd) / 2, yHeader1, { align: "center" });
  doc.text("Con Correctores", x2 + (x4 - x2) / 2, yHeader1, { align: "center" });
  doc.text("Con Agujero Estenopeico", x4 + (x6 - x4) / 2, yHeader1, { align: "center" });

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("O. D.", xLabelEnd + anchoCol / 2, yHeader2, { align: "center" });
  doc.text("O. I.", xLabelEnd + anchoCol * 1.5, yHeader2, { align: "center" });
  doc.text("O. D.", x2 + anchoCol / 2, yHeader2, { align: "center" });
  doc.text("O. I.", x2 + anchoCol * 1.5, yHeader2, { align: "center" });
  doc.text("O. D.", x4 + anchoCol / 2, yHeader2, { align: "center" });
  doc.text("O. I.", x4 + anchoCol * 1.5, yHeader2, { align: "center" });

  yPos += headerH;

  // 2 filas de valores: De Cerca / De Lejos (como plantilla)
  const filas = [
    {
      label: "De Cerca",
      scOD: ["txtCercaSinCorregirOd", "txtAvSinCorrectoresCercaOd", "avSinCorrectoresCercaOd", "avScCercaOd"],
      scOI: ["txtCercaSinCorregirOi", "txtAvSinCorrectoresCercaOi", "avSinCorrectoresCercaOi", "avScCercaOi"],
      ccOD: ["txtCercaCorregidaOd", "txtAvConCorrectoresCercaOd", "avConCorrectoresCercaOd", "avCcCercaOd"],
      ccOI: ["txtCercaCorregidaOi", "txtAvConCorrectoresCercaOi", "avConCorrectoresCercaOi", "avCcCercaOi"],
      aeOD: ["txtCercaAgujeroOd", "txtAvAgujeroEstenopeicoCercaOd", "avAgujeroEstenopeicoCercaOd", "avAeCercaOd"],
      aeOI: ["txtCercaAgujeroOi", "txtAvAgujeroEstenopeicoCercaOi", "avAgujeroEstenopeicoCercaOi", "avAeCercaOi"],
    },
    {
      label: "De Lejos",
      scOD: ["txtLejosSinCorregirOd", "txtAvSinCorrectoresLejosOd", "avSinCorrectoresLejosOd", "avScLejosOd"],
      scOI: ["txtLejosSinCorregirOi", "txtAvSinCorrectoresLejosOi", "avSinCorrectoresLejosOi", "avScLejosOi"],
      ccOD: ["txtLejosCorregidaOd", "txtAvConCorrectoresLejosOd", "avConCorrectoresLejosOd", "avCcLejosOd"],
      ccOI: ["txtLejosCorregidaOi", "txtAvConCorrectoresLejosOi", "avConCorrectoresLejosOi", "avCcLejosOi"],
      aeOD: ["txtLejosAgujeroOd", "txtAvAgujeroEstenopeicoLejosOd", "avAgujeroEstenopeicoLejosOd", "avAeLejosOd"],
      aeOI: ["txtLejosAgujeroOi", "txtAvAgujeroEstenopeicoLejosOi", "avAgujeroEstenopeicoLejosOi", "avAeLejosOi"],
    },
  ];

  doc.setFont("helvetica", "normal").setFontSize(7);

  for (const fila of filas) {
    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.line(xLabelEnd, yPos, xLabelEnd, yPos + filaAltura);
    doc.line(x1, yPos, x1, yPos + filaAltura);
    doc.line(x2, yPos, x2, yPos + filaAltura);
    doc.line(x3, yPos, x3, yPos + filaAltura);
    doc.line(x4, yPos, x4, yPos + filaAltura);
    doc.line(x5, yPos, x5, yPos + filaAltura);

    const yValor = yPos + filaAltura / 2 + 1;
    doc.text(fila.label, x0 + 2, yValor);

    const scOD = getValor(...fila.scOD);
    const scOI = getValor(...fila.scOI);
    const ccOD = getValor(...fila.ccOD);
    const ccOI = getValor(...fila.ccOI);
    const aeOD = getValor(...fila.aeOD);
    const aeOI = getValor(...fila.aeOI);

    doc.text(scOD, xLabelEnd + anchoCol / 2, yValor, { align: "center" });
    doc.text(scOI, xLabelEnd + anchoCol * 1.5, yValor, { align: "center" });
    doc.text(ccOD, x2 + anchoCol / 2, yValor, { align: "center" });
    doc.text(ccOI, x2 + anchoCol * 1.5, yValor, { align: "center" });
    doc.text(aeOD, x4 + anchoCol / 2, yValor, { align: "center" });
    doc.text(aeOI, x4 + anchoCol * 1.5, yValor, { align: "center" });

    yPos += filaAltura;
  }

  // Fila: Binocular (Reev.) - divisiones por grupo (sin OD/OI)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(xLabelEnd, yPos, xLabelEnd, yPos + filaAltura);
  doc.line(x2, yPos, x2, yPos + filaAltura);
  doc.line(x4, yPos, x4, yPos + filaAltura);

  const yBin = yPos + filaAltura / 2 + 1;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Binocular (Reev.)", x0 + 2, yBin);

  const binSC = getValor("txtBinocularSinCorregir", "txtAvBinocularSinCorrectores", "avBinocularSinCorrectores", "binocularSinCorrectores", "avBinSc");
  const binCC = getValor("txtBinocularCorregida", "txtAvBinocularConCorrectores", "avBinocularConCorrectores", "binocularConCorrectores", "avBinCc");
  const binAE = getValor("txtAvBinocularAgujeroEstenopeico", "avBinocularAgujeroEstenopeico", "binocularAgujeroEstenopeico", "avBinAe");

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text(binSC, xLabelEnd + (x2 - xLabelEnd) / 2, yBin, { align: "center" });
  doc.text(binCC, x2 + (x4 - x2) / 2, yBin, { align: "center" });
  doc.text(binAE, x4 + (x6 - x4) / 2, yBin, { align: "center" });

  yPos += filaAltura;

  return yPos;
};

// Función para dibujar Test de Evaluación Complementaria
const drawTestEvaluacionComplementaria = (doc, datos = {}, yInicio) => {
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 5;
  let yPos = yInicio;

  const getValor = (...keys) => {
    for (const k of keys) {
      const v = datos?.[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
    }
    return "";
  };

  const getBool = (...keys) => {
    for (const k of keys) {
      const v = datos?.[k];
      if (v === true) return true;
      if (v === false) return false;
      if (v === 1 || v === "1") return true;
      if (v === 0 || v === "0") return false;
      if (typeof v === "string") {
        const s = v.trim().toLowerCase();
        if (s === "true" || s === "si" || s === "sí" || s === "x") return true;
        if (s === "false" || s === "no") return false;
      }
    }
    return false;
  };

  const drawXInCell = (x, w, yMid, marcado) => {
    if (!marcado) return;
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", x + w / 2, yMid, { align: "center" });
  };

  // Header gris
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, "F");
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("TEST DE EVALUACIÓN COMPLEMENTARIA", tablaInicioX + 2, yPos + filaAltura / 2 + 1);
  yPos += filaAltura;

  const wX = 8;
  const wTxt = 22;
  const wEtiqueta = tablaAncho - 3 * (wX + wTxt);

  const x0 = tablaInicioX;
  const xEtiquetaEnd = x0 + wEtiqueta;
  const xN_X = xEtiquetaEnd;
  const xN_T = xN_X + wX;
  const xA_X = xN_T + wTxt;
  const xA_T = xA_X + wX;
  const xNC_X = xA_T + wTxt;
  const xNC_T = xNC_X + wX;

  const drawFila = ({ label, normalKeys = [], anormalKeys = [], ncKeys = [], labelRightText = "" }) => {
    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.line(xEtiquetaEnd, yPos, xEtiquetaEnd, yPos + filaAltura);
    doc.line(xN_T, yPos, xN_T, yPos + filaAltura);
    doc.line(xA_X, yPos, xA_X, yPos + filaAltura);
    doc.line(xA_T, yPos, xA_T, yPos + filaAltura);
    doc.line(xNC_X, yPos, xNC_X, yPos + filaAltura);
    doc.line(xNC_T, yPos, xNC_T, yPos + filaAltura);

    const yC = yPos + filaAltura / 2 + 1;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(label, tablaInicioX + 2, yC);
    if (labelRightText) {
      doc.text(labelRightText, xEtiquetaEnd - 2, yC, { align: "right" });
    }

    const marcadoNormal = getBool(...normalKeys);
    const marcadoAnormal = getBool(...anormalKeys);
    const marcadoNC = getBool(...ncKeys);

    drawXInCell(xN_X, wX, yC, marcadoNormal);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("Normal", xN_T + 2, yC);

    drawXInCell(xA_X, wX, yC, marcadoAnormal);
    doc.text("Anormal", xA_T + 2, yC);

    drawXInCell(xNC_X, wX, yC, marcadoNC);
    doc.text("N.C.", xNC_T + 2, yC);

    yPos += filaAltura;
  };

  drawFila({
    label: "Test de Ishihara (Colores)",
    normalKeys: ["rbtEcIshiharaNormal", "ishiharaNormal", "rbIshiharaNormal", "chkIshiharaNormal"],
    anormalKeys: ["rbtEcIshiharaAnormal", "ishiharaAnormal", "rbIshiharaAnormal", "chkIshiharaAnormal"],
    ncKeys: ["rbtEcIshiharaNc", "ishiharaNc", "ishiharaNC", "rbIshihiharaNc", "rbIshiharaNc", "chkIshiharaNc"],
  });

  drawFila({
    label: "Test de Colores Puros (Rojo-Amarillo-Verde)",
    normalKeys: ["rbtEcColeresNormal", "rbtEcColoresNormal", "coloresPurosNormal", "rbColoresPurosNormal", "chkColoresPurosNormal"],
    anormalKeys: ["rbtEcColeresAnormal", "rbtEcColoresAnormal", "coloresPurosAnormal", "rbColoresPurosAnormal", "chkColoresPurosAnormal"],
    ncKeys: ["rbtEcColeresNc", "rbtEcColoresNc", "coloresPurosNc", "coloresPurosNC", "rbColoresPurosNc", "chkColoresPurosNc"],
  });

  const estSeg = getValor("txtTecEstereopsia", "estereopsiaSeg", "estereopsiaSegundos", "txtEstereopsiaSeg", "estereopsia");
  drawFila({
    label: "Estereopsia (Test Profundidad)",
    normalKeys: ["rbtEcEstereopsiaNormal", "estereopsiaNormal", "rbEstereopsiaNormal", "chkEstereopsiaNormal"],
    anormalKeys: ["rbtEcEstereopsiaAnormal", "estereopsiaAnormal", "rbEstereopsiaAnormal", "chkEstereopsiaAnormal"],
    ncKeys: ["rbtEcEstereopsiaNc", "estereopsiaNc", "estereopsiaNC", "rbEstereopsiaNc", "chkEstereopsiaNc"],
    labelRightText: estSeg ? `${estSeg} seg.` : "",
  });

  return yPos;
};

// Función para dibujar Refracción + tablas (Lejos/Cerca) + Agudeza Visual Final
const drawRefraccion = (doc, datos = {}, yInicio) => {
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 5;
  let yPos = yInicio;

  const getValor = (...keys) => {
    for (const k of keys) {
      const v = datos?.[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
    }
    return "";
  };

  const getBool = (...keys) => {
    for (const k of keys) {
      const v = datos?.[k];
      if (v === true) return true;
      if (v === false) return false;
      if (v === 1 || v === "1") return true;
      if (v === 0 || v === "0") return false;
      if (typeof v === "string") {
        const s = v.trim().toLowerCase();
        if (s === "true" || s === "si" || s === "sí" || s === "x") return true;
        if (s === "false" || s === "no") return false;
      }
    }
    return false;
  };

  const wRef = 45;
  const wX = 10;
  const wAplica = 55;
  const x0 = tablaInicioX;
  const xRefEnd = x0 + wRef;
  const xX1End = xRefEnd + wX;
  const xAplicaEnd = xX1End + wAplica;
  const xX2End = xAplicaEnd + wX;

  const aplica = getBool("refraccionAplica", "rbRefraccionAplica", "chkRefraccionAplica");
  const noAplica = getBool("refraccionNoAplica", "rbRefraccionNoAplica", "chkRefraccionNoAplica");

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(xRefEnd, yPos, xRefEnd, yPos + filaAltura);
  doc.line(xX1End, yPos, xX1End, yPos + filaAltura);
  doc.line(xAplicaEnd, yPos, xAplicaEnd, yPos + filaAltura);
  doc.line(xX2End, yPos, xX2End, yPos + filaAltura);
  const yC = yPos + filaAltura / 2 + 1;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("REFRACCIÓN", x0 + 2, yC);

  doc.setFont("helvetica", "normal").setFontSize(7);
  if (aplica) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", xRefEnd + wX / 2, yC, { align: "center" });
  }
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Aplica", xX1End + 2, yC);

  if (noAplica) {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("X", xAplicaEnd + wX / 2, yC, { align: "center" });
  }
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("No Aplica", xX2End + 2, yC);
  yPos += filaAltura;

  const gap = 0;
  const tableW = (tablaAncho - gap) / 2;
  const titleH = 5;
  const headerH = 5;
  const dataH = 5;

  const wRowLabel = 12;
  const wData = (tableW - wRowLabel) / 4;

  const drawTablaRefraccion = (x, titulo, prefKey) => {
    doc.setFillColor(196, 196, 196);
    doc.rect(x, yPos, tableW, titleH, "F");
    doc.rect(x, yPos, tableW, titleH);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(titulo, x + tableW / 2, yPos + titleH / 2 + 1, { align: "center" });
    let y = yPos + titleH;

    doc.rect(x, y, tableW, headerH);
    const xRowEnd = x + wRowLabel;
    const xSfEnd = xRowEnd + wData;
    const xCilEnd = xSfEnd + wData;
    const xEjeEnd = xCilEnd + wData;
    doc.line(xRowEnd, y, xRowEnd, y + headerH);
    doc.line(xSfEnd, y, xSfEnd, y + headerH);
    doc.line(xCilEnd, y, xCilEnd, y + headerH);
    doc.line(xEjeEnd, y, xEjeEnd, y + headerH);

    const yH = y + headerH / 2 + 1;
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("SF", xRowEnd + wData / 2, yH, { align: "center" });
    doc.text("CIL.", xSfEnd + wData / 2, yH, { align: "center" });
    doc.text("EJE", xCilEnd + wData / 2, yH, { align: "center" });
    doc.text("DIP", xEjeEnd + wData / 2, yH, { align: "center" });

    y += headerH;

    const drawDataRow = (label, ojoKey) => {
      doc.rect(x, y, tableW, dataH);
      doc.line(xRowEnd, y, xRowEnd, y + dataH);
      doc.line(xSfEnd, y, xSfEnd, y + dataH);
      doc.line(xCilEnd, y, xCilEnd, y + dataH);
      doc.line(xEjeEnd, y, xEjeEnd, y + dataH);
      const yD = y + dataH / 2 + 1;
      doc.setFont("helvetica", "bold").setFontSize(7);
      doc.text(label, x + 3, yD);

      doc.setFont("helvetica", "normal").setFontSize(7);
      const prefTxt = prefKey === "refraccionLejos" ? "txtLejos" : prefKey === "refraccionCerca" ? "txtCerca" : null;
      const txtOjo = ojoKey;
      const sf = getValor(prefTxt ? `${prefTxt}${txtOjo}Sf` : null, `${prefKey}${ojoKey}Sf`, `${prefKey}${ojoKey}SF`, `${prefKey}${ojoKey}_sf`);
      const cil = getValor(prefTxt ? `${prefTxt}${txtOjo}Cil` : null, `${prefKey}${ojoKey}Cil`, `${prefKey}${ojoKey}CIL`, `${prefKey}${ojoKey}_cil`);
      const eje = getValor(prefTxt ? `${prefTxt}${txtOjo}Eje` : null, `${prefKey}${ojoKey}Eje`, `${prefKey}${ojoKey}EJE`, `${prefKey}${ojoKey}_eje`);
      const dip = getValor(prefTxt ? `${prefTxt}${txtOjo}Dip` : null, `${prefKey}${ojoKey}Dip`, `${prefKey}${ojoKey}DIP`, `${prefKey}${ojoKey}_dip`);

      doc.text(sf, xRowEnd + wData / 2, yD, { align: "center" });
      doc.text(cil, xSfEnd + wData / 2, yD, { align: "center" });
      doc.text(eje, xCilEnd + wData / 2, yD, { align: "center" });
      doc.text(dip, xEjeEnd + wData / 2, yD, { align: "center" });

      y += dataH;
    };

    drawDataRow("OD", "Od");
    drawDataRow("OI", "Oi");

    return y;
  };

  const xLejos = tablaInicioX;
  const xCerca = tablaInicioX + tableW + gap;

  const yFinLejos = drawTablaRefraccion(xLejos, "DE LEJOS", "refraccionLejos");
  const yFinCerca = drawTablaRefraccion(xCerca, "DE CERCA", "refraccionCerca");
  yPos = Math.max(yFinLejos, yFinCerca);

  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, "F");
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("AGUDEZA VISUAL FINAL (CON REFRACCIÓN)", tablaInicioX + 2, yPos + filaAltura / 2 + 1);
  yPos += filaAltura;

  const drawMiniAV = (x, filaLabel, odKeys, oiKeys) => {
    const w = tableW;
    const h = filaAltura;
    const wLbl = 35;
    const wOD = (w - wLbl) / 2;
    const wOI = wOD;
    const xLblEnd = x + wLbl;
    const xODEnd = xLblEnd + wOD;

    doc.rect(x, yPos, w, h);
    doc.line(xLblEnd, yPos, xLblEnd, yPos + h);
    doc.line(xODEnd, yPos, xODEnd, yPos + h);
    const yH = yPos + h / 2 + 1;
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text("Agudeza Visual", x + 2, yH);
    doc.text("O.D.", xLblEnd + wOD / 2, yH, { align: "center" });
    doc.text("O.I.", xODEnd + wOI / 2, yH, { align: "center" });

    doc.rect(x, yPos + h, w, h);
    doc.line(xLblEnd, yPos + h, xLblEnd, yPos + h + h);
    doc.line(xODEnd, yPos + h, xODEnd, yPos + h + h);
    const yD = yPos + h + h / 2 + 1;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(filaLabel, x + 2, yD);
    const od = getValor(...odKeys);
    const oi = getValor(...oiKeys);
    doc.text(od, xLblEnd + wOD / 2, yD, { align: "center" });
    doc.text(oi, xODEnd + wOI / 2, yD, { align: "center" });
  };

  drawMiniAV(xLejos, "De Lejos", ["txtAvConRefraccionLejosOd", "avFinalLejosOd", "txtAvFinalLejosOd", "agudezaVisualFinalLejosOd"], ["txtAvConRefraccionLejosOi", "avFinalLejosOi", "txtAvFinalLejosOi", "agudezaVisualFinalLejosOi"]);
  drawMiniAV(xCerca, "De Cerca", ["txtAvConRefraccionCercaOd", "avFinalCercaOd", "txtAvFinalCercaOd", "agudezaVisualFinalCercaOd"], ["txtAvConRefraccionCercaOi", "avFinalCercaOi", "txtAvFinalCercaOi", "agudezaVisualFinalCercaOi"]);

  yPos += filaAltura * 2;
  return yPos;
};

// Función para dibujar Indicadores y Restricciones
const drawIndicadoresRestricciones = (doc, datos = {}, yInicio) => {
  const x = 5;
  const w = 200;
  const filaAltura = 5;
  let y = yInicio;

  const getBool = (...keys) => {
    for (const k of keys) {
      const v = datos?.[k];
      if (v === true) return true;
      if (v === false) return false;
      if (v === 1 || v === "1") return true;
      if (v === 0 || v === "0") return false;
      if (typeof v === "string") {
        const s = v.trim().toLowerCase();
        if (s === "true" || s === "si" || s === "sí" || s === "x") return true;
        if (s === "false" || s === "no") return false;
      }
    }
    return false;
  };

  const drawXCell = (cellX, cellW, yMid, marcado) => {
    if (!marcado) return;
    const xMid = cellX + cellW / 2;
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("X", xMid, yMid, { align: "center" });
  };

  doc.setFillColor(196, 196, 196);
  doc.rect(x, y, w, filaAltura, "F");
  doc.rect(x, y, w, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("INDICADORES", x + 2, y + filaAltura / 2 + 1);
  y += filaAltura;

  const wL1 = 55;
  const wC1 = 10;
  const wL2 = 55;
  const wC2 = 10;
  const wLCerca = 20;
  const wCCerca = 10;
  const wLLejos = 20;
  const wCLejos = 10;

  const x1 = x + wL1;
  const x2 = x1 + wC1;
  const x3 = x2 + wL2;
  const x4 = x3 + wC2;
  const x5 = x4 + wLCerca;
  const x6 = x5 + wCCerca;
  const x7 = x6 + wLLejos;

  const drawIndicadoresRow = (cells) => {
    doc.rect(x, y, w, filaAltura);
    doc.line(x1, y, x1, y + filaAltura);
    doc.line(x2, y, x2, y + filaAltura);
    doc.line(x3, y, x3, y + filaAltura);
    doc.line(x4, y, x4, y + filaAltura);
    doc.line(x5, y, x5, y + filaAltura);
    doc.line(x6, y, x6, y + filaAltura);
    doc.line(x7, y, x7, y + filaAltura);

    const yMid = y + filaAltura / 2 + 1.5;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(cells.label1, x + 2, yMid);
    drawXCell(x1, wC1, yMid, cells.check1);
    doc.text(cells.label2, x2 + 2, yMid);
    drawXCell(x3, wC2, yMid, cells.check2);
    doc.text("Cerca", x4 + wLCerca / 2, yMid, { align: "center" });
    drawXCell(x5, wCCerca, yMid, cells.cerca);
    doc.text("Lejos", x6 + wLLejos / 2, yMid, { align: "center" });
    drawXCell(x7, wCLejos, yMid, cells.lejos);
    y += filaAltura;
  };

  drawIndicadoresRow({
    label1: "Ninguna",
    check1: getBool("chkInNinguna", "indNinguna", "indicadoresNinguna", "indicadores_none"),
    label2: "Uso de Correct. Oculares",
    check2: getBool("chkI2", "indUsoCorrectores", "indicadoresUsoCorrectores", "usoCorrectoresOculares"),
    cerca: getBool("chkI4Cerca", "indCerca", "indCercaOficina", "indicadoresCerca", "usoCercaOficina"),
    lejos: getBool("chkI4Lejos", "indLejos", "indicadoresLejos", "usoLejos"),
  });

  drawIndicadoresRow({
    label1: "Control compl. por oftalmología",
    check1: getBool("chkI3", "indControlOftalmo", "indicadoresControlOftalmo", "controlComplementarioOftalmologia"),
    label2: "Lentes correctores",
    check2: getBool("chkI5", "indLentesCorrectores", "lentesCorrectores", "usoLentesCorrectores"),
    cerca: getBool("chkI4Cerca", "indLentesCerca", "lentesCorrectoresCerca", "indCerca", "usoCercaOficina"),
    lejos: getBool("chkI4Lejos", "indLentesLejos", "lentesCorrectoresLejos", "indLejos", "usoLejos"),
  });

  const drawIndicadoresRow3 = (cells) => {
    const wC = 10;
    const wL1 = 55;
    const wL2 = 55;
    // Ajuste para que el último separador llegue exactamente al borde derecho (evita celdas extra)
    const wL3 = w - (wL1 + wC + wL2 + wC + wC); // label3 ocupa el resto, luego check3

    const xA1 = x + wL1;          // inicio check1
    const xA2 = xA1 + wC;         // inicio label2
    const xB1 = xA2 + wL2;        // inicio check2
    const xB2 = xB1 + wC;         // inicio label3
    const xC1 = xB2 + wL3;        // inicio check3
    const xEnd = x + w;           // borde derecho real

    doc.rect(x, y, w, filaAltura);
    doc.line(xA1, y, xA1, y + filaAltura);
    doc.line(xA2, y, xA2, y + filaAltura);
    doc.line(xB1, y, xB1, y + filaAltura);
    doc.line(xB2, y, xB2, y + filaAltura);
    doc.line(xC1, y, xC1, y + filaAltura);
    // No dibujar línea extra antes del borde; el rect ya define el borde derecho
    doc.line(xEnd, y, xEnd, y + filaAltura);

    const yMid = y + filaAltura / 2 + 1.5;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(cells.label1, x + 2, yMid);
    drawXCell(xA1, wC, yMid, cells.check1);
    doc.text(cells.label2, xA2 + 2, yMid);
    drawXCell(xB1, wC, yMid, cells.check2);
    doc.text(cells.label3, xB2 + 2, yMid);
    drawXCell(xC1, wC, yMid, cells.check3);
    y += filaAltura;
  };

  drawIndicadoresRow3({
    label1: "Lentes: Cambio de Lunas",
    check1: getBool("chkI6", "indCambioLunas", "cambioLunas", "lentesCambioLunas"),
    label2: "Pterigion III° - IV°",
    check2: getBool("chkI7", "indPterigion", "pterigionIIIIV", "indicadoresPterigion"),
    label3: "Otras",
    check3: getBool("indOtras", "indicadoresOtras", "otrasIndicaciones"),
  });

  doc.setFillColor(196, 196, 196);
  doc.rect(x, y, w, filaAltura, "F");
  doc.rect(x, y, w, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("RESTRICCIONES (Aplican al entorno laboral)", x + 2, y + filaAltura / 2 + 1);
  y += filaAltura;

  const drawRestrRow1 = (label, marcado) => {
    const wLabel = w - 12;
    const wCheck = 12;
    const xLabelEnd = x + wLabel;
    doc.rect(x, y, w, filaAltura);
    doc.line(xLabelEnd, y, xLabelEnd, y + filaAltura);
    const yMid = y + filaAltura / 2 + 1.5;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(label, x + 2, yMid);
    drawXCell(xLabelEnd, wCheck, yMid, marcado);
    y += filaAltura;
  };

  const drawRestrRow2 = (a, b) => {
    const wLabel = (w - 20) / 2;
    const wCheck = 10;
    const xA1 = x + wLabel;
    const xA2 = xA1 + wCheck;
    const xB1 = xA2 + wLabel;
    const xB2 = xB1 + wCheck;
    doc.rect(x, y, w, filaAltura);
    doc.line(xA1, y, xA1, y + filaAltura);
    doc.line(xA2, y, xA2, y + filaAltura);
    doc.line(xB1, y, xB1, y + filaAltura);
    doc.line(xB2, y, xB2, y + filaAltura);
    const yMid = y + filaAltura / 2 + 1.5;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(a.label, x + 2, yMid);
    drawXCell(xA1, wCheck, yMid, a.check);
    doc.text(b.label, xA2 + 2, yMid);
    drawXCell(xB1, wCheck, yMid, b.check);
    y += filaAltura;
  };

  const drawRestrRow3 = (a, b, c, boldA = false) => {
    const wCheck = 10;
    // Layout: [label A][X][label B][X][label C][X] sin “celdas fantasma”
    const wLabelA = 55;
    const wLabelB = 25; // "Lejos"
    const wLabelC = w - (wLabelA + wCheck + wLabelB + wCheck + wCheck); // resto para "Cerca (Trabajos de Oficina)"

    const xA1 = x + wLabelA;        // inicio check A
    const xA2 = xA1 + wCheck;       // inicio label B
    const xB1 = xA2 + wLabelB;      // inicio check B
    const xB2 = xB1 + wCheck;       // inicio label C
    const xC1 = xB2 + wLabelC;      // inicio check C
    const xEnd = x + w;             // borde derecho real
    doc.rect(x, y, w, filaAltura);
    doc.line(xA1, y, xA1, y + filaAltura);
    doc.line(xA2, y, xA2, y + filaAltura);
    doc.line(xB1, y, xB1, y + filaAltura);
    doc.line(xB2, y, xB2, y + filaAltura);
    doc.line(xC1, y, xC1, y + filaAltura);
    // Evitar crear una celda adicional antes del borde
    doc.line(xEnd, y, xEnd, y + filaAltura);
    const yMid = y + filaAltura / 2 + 1.5;
    doc.setFont("helvetica", boldA ? "bold" : "normal").setFontSize(7);
    doc.text(a.label, x + 2, yMid);
    drawXCell(xA1, wCheck, yMid, a.check);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(b.label, xA2 + 2, yMid);
    drawXCell(xB1, wCheck, yMid, b.check);
    doc.text(c.label, xB2 + 2, yMid);
    drawXCell(xC1, wCheck, yMid, c.check);
    y += filaAltura;
  };

  drawRestrRow1("No restringe actividades laborales en el puesto de trabajo", getBool("chkR1", "resNoRestringe", "restriccionesNoRestringe", "noRestringe"));
  drawRestrRow2({ label: "No trabajos con cables eléctricos, ni fibra óptica", check: getBool("chkR3", "resNoCables", "restriccionesNoCablesFibra", "noCablesFibra") }, { label: "No conducción Vehicular", check: getBool("chkR4", "resNoConduccion", "restriccionesNoConduccion", "noConduccionVehicular") });
  drawRestrRow3({ label: "Uso de Correctores Oculares", check: getBool("chkR2", "chkR2Lejos", "chkR2Cerca", "resUsoCorrectores", "restriccionesUsoCorrectores", "usoCorrectoresRestriccion") }, { label: "Lejos", check: getBool("chkR2Lejos", "resLejos", "restriccionesLejos", "usoLejosRestriccion") }, { label: "Cerca (Trabajos de Oficina)", check: getBool("chkR2Cerca", "resCerca", "resCercaOficina", "restriccionesCerca", "usoCercaRestriccion") }, true);

  return y;
};

// Función principal del jasper
export default async function EvaluacionOftalmologica2021_Digitalizado_ohla(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // 1) Header con logo, color box y datos
  await drawHeader(doc, datos);

  // 2) Título principal
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("EVALUACIÓN OFTALMOLÓGICA", pageW / 2, 32, { align: "center" });

  // 3) Datos personales
  const yDespuesDatos = drawPatientData(doc, datos);

  // 4) Evaluación Oftalmológica
  const yDespuesEvaluacion = drawEvaluacionOftalmologica(doc, datos, yDespuesDatos);

  // 5) Antecedentes
  const yDespuesAntecedentes = drawAntecedentes(doc, datos, yDespuesEvaluacion);

  // 6) Pterigion (Grado)
  const yDespuesPterigion = drawPterigionGrado(doc, datos, yDespuesAntecedentes);

  // 7) Agudeza Visual
  const yDespuesAgudeza = drawAgudezaVisual(doc, datos, yDespuesPterigion);

  // 8) Test de Evaluación Complementaria
  const yDespuesTest = drawTestEvaluacionComplementaria(doc, datos, yDespuesAgudeza);

  // 9) Refracción
  const yDespuesRefraccion = drawRefraccion(doc, datos, yDespuesTest);

  // 10) Indicadores y Restricciones
  const yDespuesIndicadores = drawIndicadoresRestricciones(doc, datos, yDespuesRefraccion);

  // 11) Firmas
  const yFirmas = yDespuesIndicadores;
  await dibujarFirmas({ doc, datos, y: yFirmas + 2, pageW });

  // 5) Footer
  footerTR(doc, { footerOffsetY: 12, fontSize: 8 });

  if (docExistente) {
    return doc;
  } else {
    imprimir(doc);
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
