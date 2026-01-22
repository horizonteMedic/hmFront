import jsPDF from "jspdf";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import drawColorBox from '../../components/ColorBox.jsx';
import footerTR from '../../components/footerTR.jsx';
import { formatearFechaCorta } from '../../../utils/formatDateUtils';

// Header con logo, color box y título
const drawHeader = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const informacionSede = datos.informacionSede || {};

  await CabeceraLogo(doc, { 
    ...datos, 
    sede: informacionSede.sede || datos.sede || "",
    tieneMembrete: false, 
    yOffset: 10 
  });

  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(7);
  const sedeValue = informacionSede.sede || datos.sede || datos.nombreSede || "";
  doc.text("Sede: " + sedeValue, pageW - 80, 20);

  // Fecha de examen
  const fechaExamen = formatearFechaCorta(datos.fechaExamen || datos.fechaRegistro || datos.fecha || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);

  // Página
  doc.text("Pag. 01", pageW - 30, 10);

  // Bloque de color
  if (informacionSede.color && informacionSede.textoColor) {
    drawColorBox(doc, {
      color: informacionSede.codigoColor || datos.codigoColor || "#008f39",
      text: informacionSede.textoColor || datos.textoColor,
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
  const paciente = datos.paciente || {};
  const tablaInicioX = 5;
  const tablaInicioY = 35;
  const tablaAncho = 200;
  const filaAltura = 5;
  let yPos = tablaInicioY;

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

  // Preparar datos
  const nombres = String(paciente.nombres || "");
  const dni = String(paciente.dni || "");
  const edad = String(paciente.edad || "").replace(" años", "").trim();
  const sexo = paciente.sexo === 'F' || paciente.sexo === 'Femenino' ? 'FEMENINO' : paciente.sexo === 'M' || paciente.sexo === 'Masculino' ? 'MASCULINO' : '';
  const empresa = String(paciente.empresa || datos.empresa || "");
  const areaTrabajo = String(paciente.areaTrabajo || datos.areaTrabajo || "");
  const tiempoServicio = String(datos.tipoServicio || "");

  // Sección: DATOS DE FILIACIÓN
  yPos = dibujarHeaderSeccion("DATOS DE FILIACIÓN", yPos, filaAltura);

  // Fila: Apellidos y Nombres (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: DNI, Edad, Sexo (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
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

  // Fila: Área de Trabajo (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Tiempo de Servicio (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido de la tabla
  let yTexto = tablaInicioY + filaAltura + 2.5;

  // Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  dibujarTextoConSaltoLinea(doc, nombres, tablaInicioX + 35, yTexto + 1, 150);
  yTexto += filaAltura;

  // DNI, Edad, Sexo
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(dni, tablaInicioX + 12, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Edad:", tablaInicioX + 52, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text((edad ? edad + " Años" : ""), tablaInicioX + 62, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Sexo:", tablaInicioX + 102, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(sexo, tablaInicioX + 112, yTexto + 1);
  yTexto += filaAltura;

  // Empresa
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  dibujarTextoConSaltoLinea(doc, empresa, tablaInicioX + 24, yTexto + 1, 160);
  yTexto += filaAltura;

  // Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  dibujarTextoConSaltoLinea(doc, areaTrabajo, tablaInicioX + 30, yTexto + 1, 160);
  yTexto += filaAltura;

  // Tiempo de Servicio
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Tiempo de Servicio:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(tiempoServicio, tablaInicioX + 35, yTexto + 1);
  yTexto += filaAltura;

  return yTexto;
};

// Función para dibujar checkbox con X
const dibujarCheckbox = (doc, x, y, marcado) => {
  doc.setFont("helvetica", "normal").setFontSize(7);
  if (marcado) {
    doc.text("( X )", x, y);
  } else {
    doc.text("(   )", x, y);
  }
};

// Función para dibujar sección de Síntomas y preguntas SI/NO
const drawSintomasYPreguntas = (doc, datos = {}, yInicio) => {
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 5;
  let yPos = yInicio;

  // Función para dibujar fila con SI/NO y campo de texto opcional
  const dibujarFilaSINO = (label, siMarcado, noMarcado, textoOpcional = null) => {
    // Dibujar estructura de fila
    const xLabel = tablaInicioX + 2;
    const xSI = tablaInicioX + 120;
    const xNO = tablaInicioX + 140;
    const xTexto = tablaInicioX + 160;
    
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(xSI, yPos, xSI, yPos + filaAltura);
    doc.line(xNO, yPos, xNO, yPos + filaAltura);
    if (textoOpcional !== null) {
      doc.line(xTexto, yPos, xTexto, yPos + filaAltura);
    }
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    const yCentro = yPos + filaAltura / 2 + 1.5;
    
    // Label
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(label, xLabel, yCentro);
    
    // SI
    doc.text("SI", xSI + 2, yCentro);
    dibujarCheckbox(doc, xSI + 8, yCentro, siMarcado);
    
    // NO
    doc.text("NO", xNO + 2, yCentro);
    dibujarCheckbox(doc, xNO + 8, yCentro, noMarcado);
    
    // Texto opcional (Cuales)
    if (textoOpcional !== null) {
      doc.setFont("helvetica", "bold").setFontSize(7);
      doc.text("Cuales:", xTexto + 2, yCentro);
      doc.setFont("helvetica", "normal").setFontSize(7);
      const texto = String(textoOpcional || "");
      if (texto) {
        doc.text(texto, xTexto + 15, yCentro);
      }
    }
    
    yPos += filaAltura;
  };

  // Fila: Síntomas
  dibujarFilaSINO(
    "Síntomas:",
    datos.sintomaSi === true,
    datos.sintomaNo === true,
    datos.sintomas || "",
    30
  );

  // Fila: Usa faja lumbar
  dibujarFilaSINO(
    "Usa faja lumbar:",
    datos.fajaSi === true,
    datos.fajaNo === true
  );

  // Fila: Adecuada Técnica de Levantamiento de Carga
  dibujarFilaSINO(
    "Adecuada Técnica de Levantamiento de Carga:",
    datos.adecuadaTecnicacargaSi === true,
    datos.adecuadaTecnicacargaNo === true
  );

  // Fila: Capacitación en Levantamiento de Carga
  dibujarFilaSINO(
    "Capacitación en Levantamiento de Carga:",
    datos.capacitacionLevantamientoCargaSi === true,
    datos.capacitacionLevantamientoCargaNo === true
  );

  return yPos;
};

// Función para dibujar Examen Físico con movimientos y grados
const drawExamenFisico = (doc, datos = {}, yInicio) => {
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

  // Header: Examen Físico
  yPos = dibujarHeaderSeccion("EXAMEN FÍSICO", yPos, filaAltura);

  // Fila header: Movimiento | Grado (sin divisiones internas)
  const xMovimiento = tablaInicioX + 2;
  const xGrado = tablaInicioX + 100;
  const anchoN = 30;
  const anchoR = 30;
  const anchoM = 30;
  
  // Header solo con dos columnas: Movimiento y Grado
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGrado, yPos, xGrado, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeader = yPos + filaAltura / 2 + 1.5;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento, yCentroHeader);
  doc.text("Grado", xGrado + (tablaAncho - (xGrado - tablaInicioX)) / 2, yCentroHeader, { align: "center" });
  yPos += filaAltura;

  // Función para dibujar fila de movimiento con una columna de Grado (para Cabeza y Cuello)
  const dibujarFilaMovimiento = (label, valor, nMarcado, rMarcado, mMarcado) => {
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(xGrado, yPos, xGrado, yPos + filaAltura);
    doc.line(xGrado + anchoN, yPos, xGrado + anchoN, yPos + filaAltura);
    doc.line(xGrado + anchoN + anchoR, yPos, xGrado + anchoN + anchoR, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    const yCentro = yPos + filaAltura / 2 + 1.5;
    
    // Label y valor
    doc.setFont("helvetica", "normal").setFontSize(7);
    const textoCompleto = valor ? `${label}: ${valor}` : label;
    doc.text(textoCompleto, xMovimiento, yCentro);
    
    // Checkboxes N, R, M con formato "N ( X )"
    doc.setFont("helvetica", "normal").setFontSize(7);
    const textoN = nMarcado ? "N ( X )" : "N (   )";
    const textoR = rMarcado ? "R ( X )" : "R (   )";
    const textoM = mMarcado ? "M ( X )" : "M (   )";
    
    doc.text(textoN, xGrado + anchoN / 2, yCentro, { align: "center" });
    doc.text(textoR, xGrado + anchoN + anchoR / 2, yCentro, { align: "center" });
    doc.text(textoM, xGrado + anchoN + anchoR + anchoM / 2, yCentro, { align: "center" });
    
    yPos += filaAltura;
  };

  // Función para dibujar fila de movimiento con dos columnas de Grado (izquierda y derecha)
  const dibujarFilaMovimientoDoble = (label, valor, 
    nDer, rDer, mDer, // Grado derecho
    nIzq, rIzq, mIzq  // Grado izquierdo
  ) => {
    const anchoGrado = (tablaAncho - (xGrado - tablaInicioX)) / 2; // Ancho de cada columna de Grado
    const xGradoDer = xGrado;
    const xGradoIzq = xGrado + anchoGrado;
    const anchoN = anchoGrado / 3;
    const anchoR = anchoGrado / 3;
    const anchoM = anchoGrado / 3;
    
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(xGrado, yPos, xGrado, yPos + filaAltura);
    doc.line(xGradoIzq, yPos, xGradoIzq, yPos + filaAltura);
    // Divisiones dentro de cada columna de Grado
    doc.line(xGradoDer + anchoN, yPos, xGradoDer + anchoN, yPos + filaAltura);
    doc.line(xGradoDer + anchoN + anchoR, yPos, xGradoDer + anchoN + anchoR, yPos + filaAltura);
    doc.line(xGradoIzq + anchoN, yPos, xGradoIzq + anchoN, yPos + filaAltura);
    doc.line(xGradoIzq + anchoN + anchoR, yPos, xGradoIzq + anchoN + anchoR, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    const yCentro = yPos + filaAltura / 2 + 1.5;
    
    // Label y valor (centrado en su celda)
    doc.setFont("helvetica", "normal").setFontSize(7);
    const textoCompleto = valor ? `${label}: ${valor}` : label;
    const anchoCeldaMovimiento = xGrado - tablaInicioX;
    doc.text(textoCompleto, tablaInicioX + anchoCeldaMovimiento / 2, yCentro, { align: "center" });
    
    // Grado Derecho
    doc.setFont("helvetica", "normal").setFontSize(7);
    const textoNDer = nDer ? "N ( X )" : "N (   )";
    const textoRDer = rDer ? "R ( X )" : "R (   )";
    const textoMDer = mDer ? "M ( X )" : "M (   )";
    
    doc.text(textoNDer, xGradoDer + anchoN / 2, yCentro, { align: "center" });
    doc.text(textoRDer, xGradoDer + anchoN + anchoR / 2, yCentro, { align: "center" });
    doc.text(textoMDer, xGradoDer + anchoN + anchoR + anchoM / 2, yCentro, { align: "center" });
    
    // Grado Izquierdo
    const textoNIzq = nIzq ? "N ( X )" : "N (   )";
    const textoRIzq = rIzq ? "R ( X )" : "R (   )";
    const textoMIzq = mIzq ? "M ( X )" : "M (   )";
    
    doc.text(textoNIzq, xGradoIzq + anchoN / 2, yCentro, { align: "center" });
    doc.text(textoRIzq, xGradoIzq + anchoN + anchoR / 2, yCentro, { align: "center" });
    doc.text(textoMIzq, xGradoIzq + anchoN + anchoR + anchoM / 2, yCentro, { align: "center" });
    
    yPos += filaAltura;
  };

  // === 1. CABEZA Y CUELLO ===
  yPos = dibujarHeaderSeccion("1. CABEZA Y CUELLO", yPos, filaAltura);
  
  // Fila header: Movimiento | Grado
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGrado, yPos, xGrado, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderCabeza = yPos + filaAltura / 2 + 1.5;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento, yCentroHeaderCabeza);
  doc.text("Grado", xGrado + (tablaAncho - (xGrado - tablaInicioX)) / 2, yCentroHeaderCabeza, { align: "center" });
  yPos += filaAltura;

  // Fila: Extensión
  const extensionValor = datos.extencionCabeza || "";
  dibujarFilaMovimiento(
    "Extensión",
    extensionValor,
    datos.extensionCabezaN === true,
    datos.extensionCabezaR === true,
    datos.extensionCabezaM === true
  );

  // Fila: Flexión
  const flexionValor = datos.flexionCabeza || "";
  dibujarFilaMovimiento(
    "Flexión",
    flexionValor,
    datos.flexionCabezaN === true,
    datos.flexionCabezaR === true,
    datos.flexionCabezaM === true
  );

  // === 2. MIEMBROS SUPERIORES ===
  yPos = dibujarHeaderSeccion("2. MIEMBROS SUPERIORES", yPos, filaAltura);
  
  // === a) HOMBRO ===
  yPos = dibujarHeaderSeccion("a) HOMBRO", yPos, filaAltura);
  
  // Header con dos columnas de Grado
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGrado, yPos, xGrado, yPos + filaAltura);
  doc.line(xGrado + (tablaAncho - (xGrado - tablaInicioX)) / 2, yPos, xGrado + (tablaAncho - (xGrado - tablaInicioX)) / 2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderHombro = yPos + filaAltura / 2 + 1.5;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento, yCentroHeaderHombro);
  const anchoGrado = (tablaAncho - (xGrado - tablaInicioX)) / 2;
  doc.text("Grado", xGrado + anchoGrado / 2, yCentroHeaderHombro, { align: "center" });
  doc.text("Grado", xGrado + anchoGrado + anchoGrado / 2, yCentroHeaderHombro, { align: "center" });
  yPos += filaAltura;

  // Movimientos de Hombro
  dibujarFilaMovimientoDoble(
    "Flexión", "",
    datos.flexionHombroN1 === true, datos.flexionHombroR1 === true, datos.flexionHombroM1 === true,
    datos.flexionHombroN === true, datos.flexionHombroR === true, datos.flexionHombroM === true
  );
  dibujarFilaMovimientoDoble(
    "Extensión", "",
    datos.extensionHombroN1 === true, datos.extensionHombroR1 === true, datos.extensionHombroM1 === true,
    datos.extensionHombroN === true, datos.extensionHombroR === true, datos.extensionHombroM === true
  );
  dibujarFilaMovimientoDoble(
    "Abducción", "",
    datos.abduccionHombroN1 === true, datos.abduccionHombroR1 === true, datos.abduccionHombroM1 === true,
    datos.abduccionHombroN === true, datos.abduccionHombroR === true, datos.abduccionHombroM === true
  );
  dibujarFilaMovimientoDoble(
    "Aducción", "",
    datos.aduccionHombroN1 === true, datos.aduccionHombroR1 === true, datos.aduccionHombroM1 === true,
    datos.aduccionHombroN === true, datos.aduccionHombroR === true, datos.aduccionHombroM === true
  );
  dibujarFilaMovimientoDoble(
    "Rotación Interna", "",
    datos.rotacionInternaHombroN1 === true, datos.rotacionInternaHombroR1 === true, datos.rotacionInternaHombroM1 === true,
    datos.rotacionInternaHombroN === true, datos.rotacionInternaHombroR === true, datos.rotacionInternaHombroM === true
  );
  dibujarFilaMovimientoDoble(
    "Rotación Externa", "",
    datos.rotacionExternaHombroN1 === true, datos.rotacionExternaHombroR1 === true, datos.rotacionExternaHombroM1 === true,
    datos.rotacionExternaHombroN === true, datos.rotacionExternaHombroR === true, datos.rotacionExternaHombroM === true
  );

  // === b) BRAZO ===
  yPos = dibujarHeaderSeccion("b) BRAZO", yPos, filaAltura);
  
  // Header con dos columnas de Grado
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGrado, yPos, xGrado, yPos + filaAltura);
  doc.line(xGrado + anchoGrado, yPos, xGrado + anchoGrado, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderBrazo = yPos + filaAltura / 2 + 1.5;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento, yCentroHeaderBrazo);
  doc.text("Grado", xGrado + anchoGrado / 2, yCentroHeaderBrazo, { align: "center" });
  doc.text("Grado", xGrado + anchoGrado + anchoGrado / 2, yCentroHeaderBrazo, { align: "center" });
  yPos += filaAltura;

  dibujarFilaMovimientoDoble(
    "Flexión", "",
    datos.flexionBrazoN1 === true, datos.flexionBrazoR1 === true, datos.flexionBrazoM1 === true,
    datos.flexionBrazoN === true, datos.flexionBrazoR === true, datos.flexionBrazoM === true
  );
  dibujarFilaMovimientoDoble(
    "Extensión", "",
    datos.extensionBrazoN1 === true, datos.extensionBrazoR1 === true, datos.extensionBrazoM1 === true,
    datos.extensionBrazoN === true, datos.extensionBrazoR === true, datos.extensionBrazoM === true
  );

  // === c) ANTEBRAZO ===
  yPos = dibujarHeaderSeccion("c) ANTEBRAZO", yPos, filaAltura);
  
  // Header con dos columnas de Grado
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGrado, yPos, xGrado, yPos + filaAltura);
  doc.line(xGrado + anchoGrado, yPos, xGrado + anchoGrado, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderAntebrazo = yPos + filaAltura / 2 + 1.5;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento, yCentroHeaderAntebrazo);
  doc.text("Grado", xGrado + anchoGrado / 2, yCentroHeaderAntebrazo, { align: "center" });
  doc.text("Grado", xGrado + anchoGrado + anchoGrado / 2, yCentroHeaderAntebrazo, { align: "center" });
  yPos += filaAltura;

  dibujarFilaMovimientoDoble(
    "Pronación", "",
    datos.pronacionAntebrazoN1 === true, datos.pronacionAntebrazoR1 === true, datos.pronacionAntebrazoM1 === true,
    datos.pronacionAntebrazoN === true, datos.pronacionAntebrazoR === true, datos.pronacionAntebrazoM === true
  );
  dibujarFilaMovimientoDoble(
    "Supinación", "",
    datos.supinacionAntebrazoN1 === true, datos.supinacionAntebrazoR1 === true, datos.supinacionAntebrazoM1 === true,
    datos.supinacionAntebrazoN === true, datos.supinacionAntebrazoR === true, datos.supinacionAntebrazoM === true
  );

  // === d) MUÑECA ===
  yPos = dibujarHeaderSeccion("d) MUÑECA", yPos, filaAltura);
  
  // Header con dos columnas de Grado
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGrado, yPos, xGrado, yPos + filaAltura);
  doc.line(xGrado + anchoGrado, yPos, xGrado + anchoGrado, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderMuneca = yPos + filaAltura / 2 + 1.5;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento, yCentroHeaderMuneca);
  doc.text("Grado", xGrado + anchoGrado / 2, yCentroHeaderMuneca, { align: "center" });
  doc.text("Grado", xGrado + anchoGrado + anchoGrado / 2, yCentroHeaderMuneca, { align: "center" });
  yPos += filaAltura;

  dibujarFilaMovimientoDoble(
    "Flexión", "",
    datos.flexionMuniecaN1 === true, datos.flexionMuniecaR1 === true, datos.flexionMuniecaM1 === true,
    datos.flexionMuniecaN === true, datos.flexionMuniecaR === true, datos.flexionMuniecaM === true
  );
  dibujarFilaMovimientoDoble(
    "Extensión", "",
    datos.extensionMuniecaN1 === true, datos.extensionMuniecaR1 === true, datos.extensionMuniecaM1 === true,
    datos.extensionMuniecaN === true, datos.extensionMuniecaR === true, datos.extensionMuniecaM === true
  );
  dibujarFilaMovimientoDoble(
    "Desviación Cubital", "",
    datos.desviacionCubitalMuniecaN1 === true, datos.desviacionCubitalMuniecaR1 === true, datos.desviacionCubitalMuniecaM1 === true,
    datos.desviacionCubitalMuniecaN === true, datos.desviacionCubitalMuniecaR === true, datos.desviacionCubitalMuniecaM === true
  );
  dibujarFilaMovimientoDoble(
    "Desviación Radial", "",
    datos.desiacionRadialMuniecaN1 === true, datos.desiacionRadialMuniecaR1 === true, datos.desiacionRadialMuniecaM1 === true,
    datos.desiacionRadialMuniecaN === true, datos.desiacionRadialMuniecaR === true, datos.desiacionRadialMuniecaM === true
  );

  // S. de Phallen y S. Tinel (con SI/NO)
  const dibujarFilaSINO = (label, siDer, noDer, siIzq, noIzq) => {
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(xGrado, yPos, xGrado, yPos + filaAltura);
    doc.line(xGrado + anchoGrado, yPos, xGrado + anchoGrado, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    const yCentro = yPos + filaAltura / 2 + 1.5;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(label, xMovimiento, yCentro);
    
    // Derecho: SI/NO
    doc.text("SI", xGrado + 5, yCentro);
    dibujarCheckbox(doc, xGrado + 12, yCentro, siDer);
    doc.text("NO", xGrado + 20, yCentro);
    dibujarCheckbox(doc, xGrado + 27, yCentro, noDer);
    
    // Izquierdo: SI/NO
    doc.text("SI", xGrado + anchoGrado + 5, yCentro);
    dibujarCheckbox(doc, xGrado + anchoGrado + 12, yCentro, siIzq);
    doc.text("NO", xGrado + anchoGrado + 20, yCentro);
    dibujarCheckbox(doc, xGrado + anchoGrado + 27, yCentro, noIzq);
    
    yPos += filaAltura;
  };

  dibujarFilaSINO(
    "S. de Phallen",
    datos.phallenSi === true,
    datos.phallenNo === true,
    datos.phallenSi === true,
    datos.phallenNo === true
  );
  dibujarFilaSINO(
    "S. Tinel",
    datos.tinelSi === true,
    datos.tinelNo === true,
    datos.tinelSi === true,
    datos.tinelNo === true
  );

  // === 3. TÓRAX ===
  yPos = dibujarHeaderSeccion("3. TÓRAX", yPos, filaAltura);
  
  // Header con dos columnas de Grado
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGrado, yPos, xGrado, yPos + filaAltura);
  doc.line(xGrado + anchoGrado, yPos, xGrado + anchoGrado, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderTorax = yPos + filaAltura / 2 + 1.5;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento, yCentroHeaderTorax);
  doc.text("Grado", xGrado + anchoGrado / 2, yCentroHeaderTorax, { align: "center" });
  doc.text("Grado", xGrado + anchoGrado + anchoGrado / 2, yCentroHeaderTorax, { align: "center" });
  yPos += filaAltura;

  dibujarFilaMovimientoDoble(
    "Flexión", "",
    datos.flexionToraxN1 === true, datos.flexionToraxR1 === true, datos.flexionToraxM1 === true,
    datos.flexionToraxN === true, datos.flexionToraxR === true, datos.flexionToraxM === true
  );
  dibujarFilaMovimientoDoble(
    "Extensión", "",
    datos.extensionToraxN1 === true, datos.extensionToraxR1 === true, datos.extensionToraxM1 === true,
    datos.extensionToraxN === true, datos.extensionToraxR === true, datos.extensionToraxM === true
  );
  dibujarFilaMovimientoDoble(
    "Rotación", "",
    datos.rotacionToraxN1 === true, datos.rotacionToraxR1 === true, datos.rotacionToraxM1 === true,
    datos.rotacionToraxN === true, datos.rotacionToraxR === true, datos.rotacionToraxM === true
  );

  // === 4. MIEMBROS INFERIORES ===
  yPos = dibujarHeaderSeccion("4. MIEMBROS INFERIORES", yPos, filaAltura);
  
  // === a) CADERAS ===
  yPos = dibujarHeaderSeccion("a) CADERAS", yPos, filaAltura);
  
  // Header con dos columnas de Grado
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGrado, yPos, xGrado, yPos + filaAltura);
  doc.line(xGrado + anchoGrado, yPos, xGrado + anchoGrado, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderCadera = yPos + filaAltura / 2 + 1.5;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento, yCentroHeaderCadera);
  doc.text("Grado", xGrado + anchoGrado / 2, yCentroHeaderCadera, { align: "center" });
  doc.text("Grado", xGrado + anchoGrado + anchoGrado / 2, yCentroHeaderCadera, { align: "center" });
  yPos += filaAltura;

  dibujarFilaMovimientoDoble(
    "Flexión", "",
    datos.flexionCaderaN1 === true, datos.flexionCaderaR1 === true, datos.flexionCaderaM1 === true,
    datos.flexionCaderaN === true, datos.flexionCaderaR === true, datos.flexionCaderaM === true
  );
  dibujarFilaMovimientoDoble(
    "Extensión", "",
    datos.extensionCaderaN1 === true, datos.extensionCaderaR1 === true, datos.extensionCaderaM1 === true,
    datos.extensionCaderaN === true, datos.extensionCaderaR === true, datos.extensionCaderaM === true
  );
  dibujarFilaMovimientoDoble(
    "Abducción", "",
    datos.abduccionCaderaN1 === true, datos.abduccionCaderaR1 === true, datos.abduccionCaderaM1 === true,
    datos.abduccionCaderaN === true, datos.abduccionCaderaR === true, datos.abduccionCaderaM === true
  );
  dibujarFilaMovimientoDoble(
    "Aducción", "",
    datos.aduccionCaderaN1 === true, datos.aduccionCaderaR1 === true, datos.aduccionCaderaM1 === true,
    datos.aduccionCaderaN === true, datos.aduccionCaderaR === true, datos.aduccionCaderaM === true
  );
  dibujarFilaMovimientoDoble(
    "Rotación Interna", "",
    datos.rotacionInternaCaderaN1 === true, datos.rotacionInternaCaderaR1 === true, datos.rotacionInternaCaderaM1 === true,
    datos.rotacionInternaCaderaN === true, datos.rotacionInternaCaderaR === true, datos.rotacionInternaCaderaM === true
  );
  dibujarFilaMovimientoDoble(
    "Rotación Externa", "",
    datos.rotacionExternaCaderaN1 === true, datos.rotacionExternaCaderaR1 === true, datos.rotacionExternaCaderaM1 === true,
    datos.rotacionExternaCaderaN === true, datos.rotacionExternaCaderaR === true, datos.rotacionExternaCaderaM === true
  );

  return yPos;
};

// Función principal del jasper
export default async function EvaluacionMuscoloEsqueletica(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // 1) Header con logo, color box y datos
  await drawHeader(doc, datos);

  // 2) Título principal
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("EVALUACIÓN MÚSCULO ESQUELÉTICA", pageW / 2, 32, { align: "center" });

  // 3) Datos personales
  const yDespuesDatos = drawPatientData(doc, datos);

  // 4) Síntomas y preguntas SI/NO
  const yDespuesSintomas = drawSintomasYPreguntas(doc, datos, yDespuesDatos);

  // 5) Examen Físico
  drawExamenFisico(doc, datos, yDespuesSintomas);

  // 6) Footer
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
