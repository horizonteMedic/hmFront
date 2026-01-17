import jsPDF from "jspdf";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import drawColorBox from '../../components/ColorBox.jsx';
import footerTR from '../../components/footerTR.jsx';
import { formatearFechaCorta } from '../../../utils/formatDateUtils';

// Header con logo, color box y título
const drawHeader = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false, yOffset: 10 });

  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8);
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

// Función para dibujar datos personales
const drawPatientData = (doc, datos = {}) => {
  // Parámetros de tabla
  const tablaInicioX = 10;
  const tablaInicioY = 40;
  const tablaAncho = 190;
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
    doc.setFont("helvetica", "bold").setFontSize(8);
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
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(doc, nombresCompletos, tablaInicioX + 35, yTexto + 1, 150);
  yTexto += filaAltura;

  // DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(dni, tablaInicioX + 12, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((edad ? edad + " Años" : ""), tablaInicioX + 58, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(sexo, tablaInicioX + 105, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(fechaNacimiento || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(doc, puestoTrabajo, tablaInicioX + 30, yTexto + 1, 160);
  yTexto += filaAltura;

  // Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(doc, areaTrabajo, tablaInicioX + 30, yTexto + 1, 160);
  yTexto += filaAltura;

  // Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(doc, empresa, tablaInicioX + 24, yTexto + 1, 160);
  yTexto += filaAltura;

  // Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(doc, contrata, tablaInicioX + 24, yTexto + 1, 160);
  yTexto += filaAltura;

  return yPos;
};

// Función para dibujar X (checkbox marcado)
const dibujarX = (doc, x, y) => {
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("X", x, y);
};

// Función para dibujar examen clínico externo
const drawExamenClinicoExterno = (doc, datos = {}, yInicio) => {
  // Parámetros de tabla
  const tablaInicioX = 10;
  const tablaAncho = 190;
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
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo, tablaInicioX + 2, yPosLocal + 3);
    return yPosLocal + alturaHeader;
  };

  // Sección: 2. EXAMEN CLÍNICO EXTERNO
  yPos = dibujarHeaderSeccion("2. EXAMEN CLÍNICO EXTERNO", yPos, filaAltura);

  // Lista de condiciones
  const condiciones = [
    { nombre: "Ptosis Palpebral", od: datos.rbecPtosisOd, oi: datos.rbecPtosisOi },
    { nombre: "Estrabismo", od: datos.rbecEstrabismoOd, oi: datos.rbecEstrabismoOi },
    { nombre: "Conjuntivitis", od: datos.rbecConjuntivitisOd, oi: datos.rbecConjuntivitisOi },
    { nombre: "Cataratas", od: datos.rbecCataratasOd, oi: datos.rbecCataratasOi },
    { nombre: "Pterigion (grado)", od: datos.rbecPterigionOd, oi: datos.rbecPterigionOi },
    { nombre: "Pinguécula", od: datos.rbecPingueculaOd, oi: datos.rbecPingueculaOi },
    { nombre: "Chalazion", od: datos.rbecClalacionOd, oi: datos.rbecClalacionOi },
    { nombre: "Otros", od: datos.rbecOtrosOd, oi: datos.rbecOtrosOi }
  ];

  // Configuración de columnas múltiples
  const numColumnas = 4;
  const anchoColumna = tablaAncho / numColumnas;
  const anchoCondicion = anchoColumna * 0.5;
  const anchoOD = anchoColumna * 0.25;
  const anchoOI = anchoColumna * 0.25;

  // Dibujar header con múltiples columnas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 0; i <= numColumnas; i++) {
    const x = tablaInicioX + (i * anchoColumna);
    doc.line(x, yPos, x, yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Calcular posición Y centrada para el texto (centro de la celda)
  const yCentro = yPos + filaAltura / 2 + 1;

  // Dibujar headers de cada columna
  doc.setFont("helvetica", "bold").setFontSize(7);
  for (let i = 0; i < numColumnas; i++) {
    const xInicio = tablaInicioX + (i * anchoColumna);
    const xCondicion = xInicio;
    const xOD = xInicio + anchoCondicion;
    const xOI = xOD + anchoOD;

    // Líneas verticales dentro de cada columna
    doc.line(xOD, yPos, xOD, yPos + filaAltura);
    doc.line(xOI, yPos, xOI, yPos + filaAltura);

    doc.text("Condición", xCondicion + 1, yCentro);
    doc.text("OD", xOD + anchoOD / 2, yCentro, { align: "center" });
    doc.text("OI", xOI + anchoOI / 2, yCentro, { align: "center" });
  }
  yPos += filaAltura;

  // Dibujar condiciones distribuidas en columnas (2 condiciones por columna)
  const condicionesPorColumna = 2;
  let indiceCondicion = 0;

  for (let fila = 0; fila < condicionesPorColumna; fila++) {
    // Calcular posición Y centrada para esta fila
    const yCentroFila = yPos + filaAltura / 2 + 1;

    // Líneas horizontales
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    for (let col = 0; col < numColumnas && indiceCondicion < condiciones.length; col++) {
      const condicion = condiciones[indiceCondicion];
      const xInicio = tablaInicioX + (col * anchoColumna);
      const xCondicion = xInicio;
      const xOD = xInicio + anchoCondicion;
      const xOI = xOD + anchoOD;

      // Líneas verticales
      doc.line(xInicio, yPos, xInicio, yPos + filaAltura);
      doc.line(xOD, yPos, xOD, yPos + filaAltura);
      doc.line(xOI, yPos, xOI, yPos + filaAltura);

      // Texto de la condición
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text(condicion.nombre, xCondicion + 1, yCentroFila);

      // Marcar X si está seleccionado
      if (condicion.od === true) {
        dibujarX(doc, xOD + anchoOD / 2, yCentroFila);
      }
      if (condicion.oi === true) {
        dibujarX(doc, xOI + anchoOI / 2, yCentroFila);
      }

      indiceCondicion++;
    }

    // Línea vertical final
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    yPos += filaAltura;
  }

  // Fila de Hallazgos
  const alturaHallazgos = filaAltura * 2;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHallazgos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHallazgos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaHallazgos, tablaInicioX + tablaAncho, yPos + alturaHallazgos);

  const yCentroHallazgos = yPos + alturaHallazgos / 2 + 1;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hallazgos (Describir):", tablaInicioX + 2, yCentroHallazgos);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const hallazgos = String(datos.txtecHallazgos || "");
  dibujarTextoConSaltoLinea(doc, hallazgos, tablaInicioX + 35, yCentroHallazgos, 150);
  yPos += alturaHallazgos;

  return yPos;
};

// Función principal del jasper
export default async function EvaluacionOftalmologica2021_Digitalizado(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // 1) Header con logo, color box y datos
  await drawHeader(doc, datos);

  // 2) Título principal
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("EVALUACIÓN OFTALMOLÓGICA", pageW / 2, 32, { align: "center" });

  // 3) Datos personales
  const yDespuesDatos = drawPatientData(doc, datos);

  // 4) Examen clínico externo
  drawExamenClinicoExterno(doc, datos, yDespuesDatos + 3);

  // 5) Footer
  footerTR(doc, { footerOffsetY: 8, fontSize: 8 });

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
