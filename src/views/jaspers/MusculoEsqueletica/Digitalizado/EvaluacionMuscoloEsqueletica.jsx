import jsPDF from "jspdf";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import drawColorBox from '../../components/ColorBox.jsx';
import footerTR from '../../components/footerTR.jsx';
import { formatearFechaCorta } from '../../../utils/formatDateUtils';
import { dibujarFirmas } from "../../../utils/dibujarFirmas";

// Header con logo, color box y título (reutilizable para todas las páginas)
const drawHeader = async (doc, datos = {}, numeroPagina = 1) => {
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

  // Página (dinámico)
  doc.text("Pag. " + numeroPagina.toString().padStart(2, '0'), pageW - 30, 10);

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
/* eslint-disable-next-line no-unused-vars */
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
  const filaAltura = 4.5;
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

  const mitadTabla = tablaInicioX + tablaAncho / 2;
  const tercioTabla = tablaAncho / 3;

  // Fila 1: Apellidos y Nombres | Tiempo de Servicio
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(mitadTabla, yPos, mitadTabla, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 2: DNI | Edad | Sexo (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tercioTabla, yPos, tablaInicioX + tercioTabla, yPos + filaAltura);
  doc.line(tablaInicioX + tercioTabla * 2, yPos, tablaInicioX + tercioTabla * 2, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 3: Empresa | Área de Trabajo
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(mitadTabla, yPos, mitadTabla, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido de la tabla
  let yTexto = tablaInicioY + filaAltura + 2.5;

  // Fila 1: Apellidos y Nombres | Tiempo de Servicio
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(nombres, tablaInicioX + 36, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Tiempo de Servicio:", mitadTabla + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(tiempoServicio, mitadTabla + 36, yTexto + 1);
  yTexto += filaAltura;

  // Fila 2: DNI | Edad | Sexo
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(dni, tablaInicioX + 12, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Edad:", tablaInicioX + tercioTabla + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text((edad ? edad + " Años" : ""), tablaInicioX + tercioTabla + 12, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Sexo:", tablaInicioX + tercioTabla * 2 + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(sexo, tablaInicioX + tercioTabla * 2 + 12, yTexto + 1);
  yTexto += filaAltura;

  // Fila 3: Empresa | Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(empresa, tablaInicioX + 20, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Área de Trabajo:", mitadTabla + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(areaTrabajo, mitadTabla + 30, yTexto + 1);
  yTexto += filaAltura;

  return yTexto;
};

// Función para dibujar X en las columnas (formato como psicolaboral)
const dibujarX = (doc, x, y) => {
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.setTextColor(0, 0, 255); // Azul para la X
  doc.text("X", x, y, { align: "center" });
  doc.setTextColor(0, 0, 0); // Resetear a negro
};

// Función para dibujar sección de Síntomas y preguntas SI/NO
const drawSintomasYPreguntas = (doc, datos = {}, yInicio) => {
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 4.5;
  let yPos = yInicio;

  // Función para dibujar fila con SI/NO y campo de texto opcional
  const dibujarFilaSINO = (label, siMarcado, noMarcado, textoOpcional = null) => {
    // Layout: Label | SI | [X] | NO | [X] | Cuales: texto
    const anchoLabel = 100;
    const anchoTextoSINO = 10; // Ancho para "SI" o "NO"
    const anchoCeldaX = 8; // Ancho de celda para X

    const xLabel = tablaInicioX;
    const xSI = xLabel + anchoLabel;
    const xCeldaSI = xSI + anchoTextoSINO;
    const xNO = xCeldaSI + anchoCeldaX;
    const xCeldaNO = xNO + anchoTextoSINO;
    const xTexto = xCeldaNO + anchoCeldaX;

    // Líneas verticales: Label | SI | [X] | NO | [X] | Texto(opcional)
    doc.line(xLabel, yPos, xLabel, yPos + filaAltura);
    doc.line(xSI, yPos, xSI, yPos + filaAltura);
    doc.line(xCeldaSI, yPos, xCeldaSI, yPos + filaAltura);
    doc.line(xNO, yPos, xNO, yPos + filaAltura);
    doc.line(xCeldaNO, yPos, xCeldaNO, yPos + filaAltura);
    if (textoOpcional !== null) {
      doc.line(xTexto, yPos, xTexto, yPos + filaAltura);
    }
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    // Líneas horizontales
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    const yCentro = yPos + filaAltura / 2 + 1.2;

    // Label
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(label, xLabel + 2, yCentro);

    // SI (sin negrita)
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("SI", xSI + 2, yCentro);
    // X centrada en la celda entre xCeldaSI y xNO
    if (siMarcado) {
      dibujarX(doc, xCeldaSI + anchoCeldaX / 2, yCentro);
    }

    // NO (sin negrita)
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text("NO", xNO + 2, yCentro);
    // X centrada en la celda entre xCeldaNO y xTexto
    if (noMarcado) {
      dibujarX(doc, xCeldaNO + anchoCeldaX / 2, yCentro);
    }

    // Texto opcional (Cuales)
    if (textoOpcional !== null) {
      doc.setFont("helvetica", "normal").setFontSize(7);
      doc.text("Cuales:", xTexto + 2, yCentro);
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
const drawExamenFisico = async (doc, datos = {}, yInicio, numeroPaginaInicial = 1) => {
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 4.5;
  const pageW = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margenInferior = 25;
  let yPos = yInicio;
  let numeroPagina = numeroPaginaInicial;

  // Función para verificar si necesita nueva página
  const verificarSaltoPagina = async (alturaRequerida = filaAltura) => {
    if (yPos + alturaRequerida > pageHeight - margenInferior) {
      // Cerrar página actual con footer antes de crear la siguiente
      footerTR(doc, { footerOffsetY: 12, fontSize: 8 });
      doc.addPage();
      numeroPagina++;
      yPos = 20;
      await drawHeader(doc, datos, numeroPagina);
      // Después del header, ajustar yPos para continuar el contenido
      yPos = 35;
      return true;
    }
    return false;
  };

  // Header de sección
  const dibujarHeaderSeccion = async (titulo, alturaHeader = 4) => {
    await verificarSaltoPagina(alturaHeader);
    // Usar yPos después de verificar salto de página
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(titulo, tablaInicioX + 2, yPos + 3);
    yPos += alturaHeader;
  };

  // Título centrado con borde (sin relleno) para bloques finales
  const dibujarTituloCentrado = async (titulo) => {
    await verificarSaltoPagina(filaAltura);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(titulo, tablaInicioX + tablaAncho / 2, yPos + 3.2, { align: "center" });
    yPos += filaAltura;
  };


  // Header: Examen Físico
  await dibujarHeaderSeccion("EXAMEN FÍSICO", filaAltura);

  // Layout: Grado (izq) | Movimiento (centro) | Grado (der) - para secciones con dos columnas
  const anchoGradoColumna = 50; // Ancho de cada columna de Grado
  const xGradoIzq = tablaInicioX;
  const xMovimiento = tablaInicioX + anchoGradoColumna;
  const xGradoDer = tablaInicioX + tablaAncho - anchoGradoColumna;
  const anchoMovimiento = xGradoDer - xMovimiento;
  const anchoN = anchoGradoColumna / 3;
  const anchoR = anchoGradoColumna / 3;
  const anchoM = anchoGradoColumna / 3;

  // Función para dibujar fila de movimiento con una columna de Grado (para Cabeza y Cuello)
  const dibujarFilaMovimiento = async (label, valor, nMarcado, rMarcado, mMarcado, xMovimientoCol, anchoMovimientoCol, xGradoCol) => {
    await verificarSaltoPagina();
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(xGradoCol, yPos, xGradoCol, yPos + filaAltura);
    // Divisiones dentro de la columna de Grado
    doc.line(xGradoCol + anchoN, yPos, xGradoCol + anchoN, yPos + filaAltura);
    doc.line(xGradoCol + anchoN + anchoR, yPos, xGradoCol + anchoN + anchoR, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    const yCentro = yPos + filaAltura / 2 + 1.2;

    // Movimiento
    doc.setFont("helvetica", "normal").setFontSize(7);
    const textoCompleto = valor ? `${label}: ${valor}` : label;
    doc.text(textoCompleto, xMovimientoCol + anchoMovimientoCol / 2, yCentro, { align: "center" });

    // Grado - Solo X si está marcado (N, R, M están en el header)
    if (nMarcado) {
      dibujarX(doc, xGradoCol + anchoN / 2, yCentro);
    }
    if (rMarcado) {
      dibujarX(doc, xGradoCol + anchoN + anchoR / 2, yCentro);
    }
    if (mMarcado) {
      dibujarX(doc, xGradoCol + anchoN + anchoR + anchoM / 2, yCentro);
    }

    yPos += filaAltura;
  };

  // Función para dibujar fila de movimiento con dos columnas de Grado (izquierda y derecha)
  const dibujarFilaMovimientoDoble = async (label, valor,
    nIzq, rIzq, mIzq, // Grado izquierdo
    nDer, rDer, mDer  // Grado derecho
  ) => {
    await verificarSaltoPagina();
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
    doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
    // Divisiones dentro de cada columna de Grado
    doc.line(xGradoIzq + anchoN, yPos, xGradoIzq + anchoN, yPos + filaAltura);
    doc.line(xGradoIzq + anchoN + anchoR, yPos, xGradoIzq + anchoN + anchoR, yPos + filaAltura);
    doc.line(xGradoDer + anchoN, yPos, xGradoDer + anchoN, yPos + filaAltura);
    doc.line(xGradoDer + anchoN + anchoR, yPos, xGradoDer + anchoN + anchoR, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    const yCentro = yPos + filaAltura / 2 + 1.2;

    // Movimiento (centro)
    doc.setFont("helvetica", "normal").setFontSize(7);
    const textoCompleto = valor ? `${label}: ${valor}` : label;
    doc.text(textoCompleto, xMovimiento + anchoMovimiento / 2, yCentro, { align: "center" });

    // Grado Izquierdo - Solo X si está marcado (N, R, M están en el header)
    if (nIzq) {
      dibujarX(doc, xGradoIzq + anchoN / 2, yCentro);
    }
    if (rIzq) {
      dibujarX(doc, xGradoIzq + anchoN + anchoR / 2, yCentro);
    }
    if (mIzq) {
      dibujarX(doc, xGradoIzq + anchoN + anchoR + anchoM / 2, yCentro);
    }

    // Grado Derecho - Solo X si está marcado (N, R, M están en el header)
    if (nDer) {
      dibujarX(doc, xGradoDer + anchoN / 2, yCentro);
    }
    if (rDer) {
      dibujarX(doc, xGradoDer + anchoN + anchoR / 2, yCentro);
    }
    if (mDer) {
      dibujarX(doc, xGradoDer + anchoN + anchoR + anchoM / 2, yCentro);
    }

    yPos += filaAltura;
  };

  // === 1. CABEZA Y CUELLO ===
  await dibujarHeaderSeccion("1. CABEZA Y CUELLO", filaAltura);

  // Layout para Cabeza y Cuello: Movimiento (todo el ancho menos Grado) | N R M
  const xMovimientoCabeza = tablaInicioX;
  const xGradoCabeza = tablaInicioX + tablaAncho - anchoGradoColumna;
  const anchoMovimientoCabeza = xGradoCabeza - xMovimientoCabeza;

  // Header única fila: Movimiento | N R M
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGradoCabeza, yPos, xGradoCabeza, yPos + filaAltura);
  doc.line(xGradoCabeza + anchoN, yPos, xGradoCabeza + anchoN, yPos + filaAltura);
  doc.line(xGradoCabeza + anchoN + anchoR, yPos, xGradoCabeza + anchoN + anchoR, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderCabeza = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimientoCabeza + anchoMovimientoCabeza / 2, yCentroHeaderCabeza, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("N", xGradoCabeza + anchoN / 2, yCentroHeaderCabeza, { align: "center" });
  doc.text("R", xGradoCabeza + anchoN + anchoR / 2, yCentroHeaderCabeza, { align: "center" });
  doc.text("M", xGradoCabeza + anchoN + anchoR + anchoM / 2, yCentroHeaderCabeza, { align: "center" });
  yPos += filaAltura;

  // Fila: Extensión
  const extensionValor = datos.extencionCabeza || "";
  await dibujarFilaMovimiento(
    "Extensión",
    extensionValor,
    datos.extensionCabezaN === true,
    datos.extensionCabezaR === true,
    datos.extensionCabezaM === true,
    xMovimientoCabeza,
    anchoMovimientoCabeza,
    xGradoCabeza
  );

  // Fila: Flexión
  const flexionValor = datos.flexionCabeza || "";
  await dibujarFilaMovimiento(
    "Flexión",
    flexionValor,
    datos.flexionCabezaN === true,
    datos.flexionCabezaR === true,
    datos.flexionCabezaM === true,
    xMovimientoCabeza,
    anchoMovimientoCabeza,
    xGradoCabeza
  );

  // === 2. MIEMBROS SUPERIORES ===
  await dibujarHeaderSeccion("2. MIEMBROS SUPERIORES", filaAltura);

  // === a) HOMBRO ===
  await dibujarHeaderSeccion("a) HOMBRO", filaAltura);

  // Header única fila: N R M | Movimiento | N R M
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN, yPos, xGradoIzq + anchoN, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN + anchoR, yPos, xGradoIzq + anchoN + anchoR, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(xGradoDer + anchoN, yPos, xGradoDer + anchoN, yPos + filaAltura);
  doc.line(xGradoDer + anchoN + anchoR, yPos, xGradoDer + anchoN + anchoR, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderHombro = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderHombro, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(7);
  // Grado Izquierdo
  doc.text("N", xGradoIzq + anchoN / 2, yCentroHeaderHombro, { align: "center" });
  doc.text("R", xGradoIzq + anchoN + anchoR / 2, yCentroHeaderHombro, { align: "center" });
  doc.text("M", xGradoIzq + anchoN + anchoR + anchoM / 2, yCentroHeaderHombro, { align: "center" });
  // Grado Derecho
  doc.text("N", xGradoDer + anchoN / 2, yCentroHeaderHombro, { align: "center" });
  doc.text("R", xGradoDer + anchoN + anchoR / 2, yCentroHeaderHombro, { align: "center" });
  doc.text("M", xGradoDer + anchoN + anchoR + anchoM / 2, yCentroHeaderHombro, { align: "center" });
  yPos += filaAltura;

  // Movimientos de Hombro
  await dibujarFilaMovimientoDoble(
    "Flexión", "",
    datos.flexionHombroN1 === true, datos.flexionHombroR1 === true, datos.flexionHombroM1 === true,
    datos.flexionHombroN === true, datos.flexionHombroR === true, datos.flexionHombroM === true
  );
  await dibujarFilaMovimientoDoble(
    "Extensión", "",
    datos.extensionHombroN1 === true, datos.extensionHombroR1 === true, datos.extensionHombroM1 === true,
    datos.extensionHombroN === true, datos.extensionHombroR === true, datos.extensionHombroM === true
  );
  await dibujarFilaMovimientoDoble(
    "Abducción", "",
    datos.abduccionHombroN1 === true, datos.abduccionHombroR1 === true, datos.abduccionHombroM1 === true,
    datos.abduccionHombroN === true, datos.abduccionHombroR === true, datos.abduccionHombroM === true
  );
  await dibujarFilaMovimientoDoble(
    "Aducción", "",
    datos.aduccionHombroN1 === true, datos.aduccionHombroR1 === true, datos.aduccionHombroM1 === true,
    datos.aduccionHombroN === true, datos.aduccionHombroR === true, datos.aduccionHombroM === true
  );
  await dibujarFilaMovimientoDoble(
    "Rotación Interna", "",
    datos.rotacionInternaHombroN1 === true, datos.rotacionInternaHombroR1 === true, datos.rotacionInternaHombroM1 === true,
    datos.rotacionInternaHombroN === true, datos.rotacionInternaHombroR === true, datos.rotacionInternaHombroM === true
  );
  await dibujarFilaMovimientoDoble(
    "Rotación Externa", "",
    datos.rotacionExternaHombroN1 === true, datos.rotacionExternaHombroR1 === true, datos.rotacionExternaHombroM1 === true,
    datos.rotacionExternaHombroN === true, datos.rotacionExternaHombroR === true, datos.rotacionExternaHombroM === true
  );

  // === b) BRAZO ===
  await dibujarHeaderSeccion("b) BRAZO", filaAltura);

  // Header única fila: N R M | Movimiento | N R M
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN, yPos, xGradoIzq + anchoN, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN + anchoR, yPos, xGradoIzq + anchoN + anchoR, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(xGradoDer + anchoN, yPos, xGradoDer + anchoN, yPos + filaAltura);
  doc.line(xGradoDer + anchoN + anchoR, yPos, xGradoDer + anchoN + anchoR, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderBrazo = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderBrazo, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("N", xGradoIzq + anchoN / 2, yCentroHeaderBrazo, { align: "center" });
  doc.text("R", xGradoIzq + anchoN + anchoR / 2, yCentroHeaderBrazo, { align: "center" });
  doc.text("M", xGradoIzq + anchoN + anchoR + anchoM / 2, yCentroHeaderBrazo, { align: "center" });
  doc.text("N", xGradoDer + anchoN / 2, yCentroHeaderBrazo, { align: "center" });
  doc.text("R", xGradoDer + anchoN + anchoR / 2, yCentroHeaderBrazo, { align: "center" });
  doc.text("M", xGradoDer + anchoN + anchoR + anchoM / 2, yCentroHeaderBrazo, { align: "center" });
  yPos += filaAltura;

  await dibujarFilaMovimientoDoble(
    "Flexión", "",
    datos.flexionBrazoN1 === true, datos.flexionBrazoR1 === true, datos.flexionBrazoM1 === true,
    datos.flexionBrazoN === true, datos.flexionBrazoR === true, datos.flexionBrazoM === true
  );
  await dibujarFilaMovimientoDoble(
    "Extensión", "",
    datos.extensionBrazoN1 === true, datos.extensionBrazoR1 === true, datos.extensionBrazoM1 === true,
    datos.extensionBrazoN === true, datos.extensionBrazoR === true, datos.extensionBrazoM === true
  );

  // === c) ANTEBRAZO ===
  await dibujarHeaderSeccion("c) ANTEBRAZO", filaAltura);

  // Header única fila: N R M | Movimiento | N R M
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN, yPos, xGradoIzq + anchoN, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN + anchoR, yPos, xGradoIzq + anchoN + anchoR, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(xGradoDer + anchoN, yPos, xGradoDer + anchoN, yPos + filaAltura);
  doc.line(xGradoDer + anchoN + anchoR, yPos, xGradoDer + anchoN + anchoR, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderAntebrazo = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderAntebrazo, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("N", xGradoIzq + anchoN / 2, yCentroHeaderAntebrazo, { align: "center" });
  doc.text("R", xGradoIzq + anchoN + anchoR / 2, yCentroHeaderAntebrazo, { align: "center" });
  doc.text("M", xGradoIzq + anchoN + anchoR + anchoM / 2, yCentroHeaderAntebrazo, { align: "center" });
  doc.text("N", xGradoDer + anchoN / 2, yCentroHeaderAntebrazo, { align: "center" });
  doc.text("R", xGradoDer + anchoN + anchoR / 2, yCentroHeaderAntebrazo, { align: "center" });
  doc.text("M", xGradoDer + anchoN + anchoR + anchoM / 2, yCentroHeaderAntebrazo, { align: "center" });
  yPos += filaAltura;

  await dibujarFilaMovimientoDoble(
    "Pronación", "",
    datos.pronacionAntebrazoN1 === true, datos.pronacionAntebrazoR1 === true, datos.pronacionAntebrazoM1 === true,
    datos.pronacionAntebrazoN === true, datos.pronacionAntebrazoR === true, datos.pronacionAntebrazoM === true
  );
  await dibujarFilaMovimientoDoble(
    "Supinación", "",
    datos.supinacionAntebrazoN1 === true, datos.supinacionAntebrazoR1 === true, datos.supinacionAntebrazoM1 === true,
    datos.supinacionAntebrazoN === true, datos.supinacionAntebrazoR === true, datos.supinacionAntebrazoM === true
  );

  // === d) MUÑECA ===
  await dibujarHeaderSeccion("d) MUÑECA", filaAltura);

  // Header única fila: N R M | Movimiento | N R M
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN, yPos, xGradoIzq + anchoN, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN + anchoR, yPos, xGradoIzq + anchoN + anchoR, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(xGradoDer + anchoN, yPos, xGradoDer + anchoN, yPos + filaAltura);
  doc.line(xGradoDer + anchoN + anchoR, yPos, xGradoDer + anchoN + anchoR, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderMuneca = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderMuneca, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("N", xGradoIzq + anchoN / 2, yCentroHeaderMuneca, { align: "center" });
  doc.text("R", xGradoIzq + anchoN + anchoR / 2, yCentroHeaderMuneca, { align: "center" });
  doc.text("M", xGradoIzq + anchoN + anchoR + anchoM / 2, yCentroHeaderMuneca, { align: "center" });
  doc.text("N", xGradoDer + anchoN / 2, yCentroHeaderMuneca, { align: "center" });
  doc.text("R", xGradoDer + anchoN + anchoR / 2, yCentroHeaderMuneca, { align: "center" });
  doc.text("M", xGradoDer + anchoN + anchoR + anchoM / 2, yCentroHeaderMuneca, { align: "center" });
  yPos += filaAltura;

  await dibujarFilaMovimientoDoble(
    "Flexión", "",
    datos.flexionMuniecaN1 === true, datos.flexionMuniecaR1 === true, datos.flexionMuniecaM1 === true,
    datos.flexionMuniecaN === true, datos.flexionMuniecaR === true, datos.flexionMuniecaM === true
  );
  await dibujarFilaMovimientoDoble(
    "Extensión", "",
    datos.extensionMuniecaN1 === true, datos.extensionMuniecaR1 === true, datos.extensionMuniecaM1 === true,
    datos.extensionMuniecaN === true, datos.extensionMuniecaR === true, datos.extensionMuniecaM === true
  );
  await dibujarFilaMovimientoDoble(
    "Desviación Cubital", "",
    datos.desviacionCubitalMuniecaN1 === true, datos.desviacionCubitalMuniecaR1 === true, datos.desviacionCubitalMuniecaM1 === true,
    datos.desviacionCubitalMuniecaN === true, datos.desviacionCubitalMuniecaR === true, datos.desviacionCubitalMuniecaM === true
  );
  await dibujarFilaMovimientoDoble(
    "Desviación Radial", "",
    datos.desiacionRadialMuniecaN1 === true, datos.desiacionRadialMuniecaR1 === true, datos.desiacionRadialMuniecaM1 === true,
    datos.desiacionRadialMuniecaN === true, datos.desiacionRadialMuniecaR === true, datos.desiacionRadialMuniecaM === true
  );

  // S. de Phallen y S. Tinel (con SI/NO solo en columna izquierda)
  const dibujarFilaSINO = async (label, siMarcado, noMarcado) => {
    await verificarSaltoPagina();
    // Layout con celdas: Grado Izq (SI/NO) | Movimiento | Grado Der (vacío)
    const anchoTextoSINO = 10;
    const anchoCeldaX = 8;

    const xSI = xGradoIzq;
    const xCeldaSI = xSI + anchoTextoSINO;
    const xNO = xCeldaSI + anchoCeldaX;
    const xCeldaNO = xNO + anchoTextoSINO;

    // Líneas verticales
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(xSI, yPos, xSI, yPos + filaAltura);
    doc.line(xCeldaSI, yPos, xCeldaSI, yPos + filaAltura);
    doc.line(xNO, yPos, xNO, yPos + filaAltura);
    doc.line(xCeldaNO, yPos, xCeldaNO, yPos + filaAltura);
    doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
    doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    const yCentro = yPos + filaAltura / 2 + 1.2;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(label, xMovimiento + anchoMovimiento / 2, yCentro, { align: "center" });

    // Izquierdo: SI | [X] | NO | [X]
    doc.text("SI", xSI + 2, yCentro);
    if (siMarcado) {
      dibujarX(doc, xCeldaSI + anchoCeldaX / 2, yCentro);
    }
    doc.text("NO", xNO + 2, yCentro);
    if (noMarcado) {
      dibujarX(doc, xCeldaNO + anchoCeldaX / 2, yCentro);
    }

    // Derecho: vacío (sin SI/NO)

    yPos += filaAltura;
  };

  await dibujarFilaSINO(
    "S. de Phallen",
    datos.phallenSi === true,
    datos.phallenNo === true
  );
  await dibujarFilaSINO(
    "S. Tinel",
    datos.tinelSi === true,
    datos.tinelNo === true
  );

  // === 3. TÓRAX ===
  await dibujarHeaderSeccion("3. TÓRAX", filaAltura);

  // Header única fila: N R M | Movimiento | N R M
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN, yPos, xGradoIzq + anchoN, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN + anchoR, yPos, xGradoIzq + anchoN + anchoR, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(xGradoDer + anchoN, yPos, xGradoDer + anchoN, yPos + filaAltura);
  doc.line(xGradoDer + anchoN + anchoR, yPos, xGradoDer + anchoN + anchoR, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderTorax = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderTorax, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("N", xGradoIzq + anchoN / 2, yCentroHeaderTorax, { align: "center" });
  doc.text("R", xGradoIzq + anchoN + anchoR / 2, yCentroHeaderTorax, { align: "center" });
  doc.text("M", xGradoIzq + anchoN + anchoR + anchoM / 2, yCentroHeaderTorax, { align: "center" });
  doc.text("N", xGradoDer + anchoN / 2, yCentroHeaderTorax, { align: "center" });
  doc.text("R", xGradoDer + anchoN + anchoR / 2, yCentroHeaderTorax, { align: "center" });
  doc.text("M", xGradoDer + anchoN + anchoR + anchoM / 2, yCentroHeaderTorax, { align: "center" });
  yPos += filaAltura;

  await dibujarFilaMovimientoDoble(
    "Flexión", "",
    datos.flexionToraxN1 === true, datos.flexionToraxR1 === true, datos.flexionToraxM1 === true,
    datos.flexionToraxN === true, datos.flexionToraxR === true, datos.flexionToraxM === true
  );
  await dibujarFilaMovimientoDoble(
    "Extensión", "",
    datos.extensionToraxN1 === true, datos.extensionToraxR1 === true, datos.extensionToraxM1 === true,
    datos.extensionToraxN === true, datos.extensionToraxR === true, datos.extensionToraxM === true
  );
  await dibujarFilaMovimientoDoble(
    "Rotación", "",
    datos.rotacionToraxN1 === true, datos.rotacionToraxR1 === true, datos.rotacionToraxM1 === true,
    datos.rotacionToraxN === true, datos.rotacionToraxR === true, datos.rotacionToraxM === true
  );

  // === 4. MIEMBROS INFERIORES ===
  await dibujarHeaderSeccion("4. MIEMBROS INFERIORES", filaAltura);

  // === a) CADERAS ===
  await dibujarHeaderSeccion("a) CADERAS", filaAltura);

  // Header única fila: N R M | Movimiento | N R M
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN, yPos, xGradoIzq + anchoN, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN + anchoR, yPos, xGradoIzq + anchoN + anchoR, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(xGradoDer + anchoN, yPos, xGradoDer + anchoN, yPos + filaAltura);
  doc.line(xGradoDer + anchoN + anchoR, yPos, xGradoDer + anchoN + anchoR, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderCadera = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderCadera, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("N", xGradoIzq + anchoN / 2, yCentroHeaderCadera, { align: "center" });
  doc.text("R", xGradoIzq + anchoN + anchoR / 2, yCentroHeaderCadera, { align: "center" });
  doc.text("M", xGradoIzq + anchoN + anchoR + anchoM / 2, yCentroHeaderCadera, { align: "center" });
  doc.text("N", xGradoDer + anchoN / 2, yCentroHeaderCadera, { align: "center" });
  doc.text("R", xGradoDer + anchoN + anchoR / 2, yCentroHeaderCadera, { align: "center" });
  doc.text("M", xGradoDer + anchoN + anchoR + anchoM / 2, yCentroHeaderCadera, { align: "center" });
  yPos += filaAltura;

  await dibujarFilaMovimientoDoble(
    "Flexión", "",
    datos.flexionCaderaN1 === true, datos.flexionCaderaR1 === true, datos.flexionCaderaM1 === true,
    datos.flexionCaderaN === true, datos.flexionCaderaR === true, datos.flexionCaderaM === true
  );
  await dibujarFilaMovimientoDoble(
    "Extensión", "",
    datos.extensionCaderaN1 === true, datos.extensionCaderaR1 === true, datos.extensionCaderaM1 === true,
    datos.extensionCaderaN === true, datos.extensionCaderaR === true, datos.extensionCaderaM === true
  );
  await dibujarFilaMovimientoDoble(
    "Abducción", "",
    datos.abduccionCaderaN1 === true, datos.abduccionCaderaR1 === true, datos.abduccionCaderaM1 === true,
    datos.abduccionCaderaN === true, datos.abduccionCaderaR === true, datos.abduccionCaderaM === true
  );
  await dibujarFilaMovimientoDoble(
    "Aducción", "",
    datos.aduccionCaderaN1 === true, datos.aduccionCaderaR1 === true, datos.aduccionCaderaM1 === true,
    datos.aduccionCaderaN === true, datos.aduccionCaderaR === true, datos.aduccionCaderaM === true
  );
  await dibujarFilaMovimientoDoble(
    "Rotación Interna", "",
    datos.rotacionInternaCaderaN1 === true, datos.rotacionInternaCaderaR1 === true, datos.rotacionInternaCaderaM1 === true,
    datos.rotacionInternaCaderaN === true, datos.rotacionInternaCaderaR === true, datos.rotacionInternaCaderaM === true
  );
  await dibujarFilaMovimientoDoble(
    "Rotación Externa", "",
    datos.rotacionExternaCaderaN1 === true, datos.rotacionExternaCaderaR1 === true, datos.rotacionExternaCaderaM1 === true,
    datos.rotacionExternaCaderaN === true, datos.rotacionExternaCaderaR === true, datos.rotacionExternaCaderaM === true
  );

  // === b) PIERNA ===
  await dibujarHeaderSeccion("b) PIERNA", filaAltura);

  // Header única fila: N R M | Movimiento | N R M
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN, yPos, xGradoIzq + anchoN, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN + anchoR, yPos, xGradoIzq + anchoN + anchoR, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(xGradoDer + anchoN, yPos, xGradoDer + anchoN, yPos + filaAltura);
  doc.line(xGradoDer + anchoN + anchoR, yPos, xGradoDer + anchoN + anchoR, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderPierna = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderPierna, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("N", xGradoIzq + anchoN / 2, yCentroHeaderPierna, { align: "center" });
  doc.text("R", xGradoIzq + anchoN + anchoR / 2, yCentroHeaderPierna, { align: "center" });
  doc.text("M", xGradoIzq + anchoN + anchoR + anchoM / 2, yCentroHeaderPierna, { align: "center" });
  doc.text("N", xGradoDer + anchoN / 2, yCentroHeaderPierna, { align: "center" });
  doc.text("R", xGradoDer + anchoN + anchoR / 2, yCentroHeaderPierna, { align: "center" });
  doc.text("M", xGradoDer + anchoN + anchoR + anchoM / 2, yCentroHeaderPierna, { align: "center" });
  yPos += filaAltura;

  await dibujarFilaMovimientoDoble(
    "Flexión", "",
    datos.flexionPiernaN1 === true, datos.flexionPiernaR1 === true, datos.flexionPiernaM1 === true,
    datos.flexionPiernaN === true, datos.flexionPiernaR === true, datos.flexionPiernaM === true
  );
  await dibujarFilaMovimientoDoble(
    "Extensión", "",
    datos.extensionPiernaN1 === true, datos.extensionPiernaR1 === true, datos.extensionPiernaM1 === true,
    datos.extensionPiernaN === true, datos.extensionPiernaR === true, datos.extensionPiernaM === true
  );

  // === c) RODILLA ===
  await dibujarHeaderSeccion("c) RODILLA", filaAltura);

  // Header única fila: N R M | Movimiento | N R M
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN, yPos, xGradoIzq + anchoN, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN + anchoR, yPos, xGradoIzq + anchoN + anchoR, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(xGradoDer + anchoN, yPos, xGradoDer + anchoN, yPos + filaAltura);
  doc.line(xGradoDer + anchoN + anchoR, yPos, xGradoDer + anchoN + anchoR, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderRodilla = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderRodilla, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("N", xGradoIzq + anchoN / 2, yCentroHeaderRodilla, { align: "center" });
  doc.text("R", xGradoIzq + anchoN + anchoR / 2, yCentroHeaderRodilla, { align: "center" });
  doc.text("M", xGradoIzq + anchoN + anchoR + anchoM / 2, yCentroHeaderRodilla, { align: "center" });
  doc.text("N", xGradoDer + anchoN / 2, yCentroHeaderRodilla, { align: "center" });
  doc.text("R", xGradoDer + anchoN + anchoR / 2, yCentroHeaderRodilla, { align: "center" });
  doc.text("M", xGradoDer + anchoN + anchoR + anchoM / 2, yCentroHeaderRodilla, { align: "center" });
  yPos += filaAltura;

  await dibujarFilaMovimientoDoble(
    "Flexión", "",
    datos.flexionRodillaN1 === true, datos.flexionRodillaR1 === true, datos.flexionRodillaM1 === true,
    datos.flexionRodillaN === true, datos.flexionRodillaR === true, datos.flexionRodillaM === true
  );
  await dibujarFilaMovimientoDoble(
    "Extensión", "",
    datos.extensionRodillaN1 === true, datos.extensionRodillaR1 === true, datos.extensionRodillaM1 === true,
    datos.extensionRodillaN === true, datos.extensionRodillaR === true, datos.extensionRodillaM === true
  );
  await dibujarFilaMovimientoDoble(
    "Rotación Interna", "",
    datos.rotacionInternaRodillaN1 === true, datos.rotacionInternaRodillaR1 === true, datos.rotacionInternaRodillaM1 === true,
    datos.rotacionInternaRodillaN === true, datos.rotacionInternaRodillaR === true, datos.rotacionInternaRodillaM === true
  );
  await dibujarFilaMovimientoDoble(
    "Rotación Externa", "",
    datos.rotacionExternaRodillaN1 === true, datos.rotacionExternaRodillaR1 === true, datos.rotacionExternaRodillaM1 === true,
    datos.rotacionExternaRodillaN === true, datos.rotacionExternaRodillaR === true, datos.rotacionExternaRodillaM === true
  );

  // === d) TOBILLO ===
  await dibujarHeaderSeccion("d) TOBILLO", filaAltura);

  // Header única fila: N R M | Movimiento | N R M
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN, yPos, xGradoIzq + anchoN, yPos + filaAltura);
  doc.line(xGradoIzq + anchoN + anchoR, yPos, xGradoIzq + anchoN + anchoR, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(xGradoDer + anchoN, yPos, xGradoDer + anchoN, yPos + filaAltura);
  doc.line(xGradoDer + anchoN + anchoR, yPos, xGradoDer + anchoN + anchoR, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderTobillo = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderTobillo, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("N", xGradoIzq + anchoN / 2, yCentroHeaderTobillo, { align: "center" });
  doc.text("R", xGradoIzq + anchoN + anchoR / 2, yCentroHeaderTobillo, { align: "center" });
  doc.text("M", xGradoIzq + anchoN + anchoR + anchoM / 2, yCentroHeaderTobillo, { align: "center" });
  doc.text("N", xGradoDer + anchoN / 2, yCentroHeaderTobillo, { align: "center" });
  doc.text("R", xGradoDer + anchoN + anchoR / 2, yCentroHeaderTobillo, { align: "center" });
  doc.text("M", xGradoDer + anchoN + anchoR + anchoM / 2, yCentroHeaderTobillo, { align: "center" });
  yPos += filaAltura;

  await dibujarFilaMovimientoDoble(
    "Flexión", "",
    datos.flexionTobilloN1 === true, datos.flexionTobilloR1 === true, datos.flexionTobilloM1 === true,
    datos.flexionTobilloN === true, datos.flexionTobilloR === true, datos.flexionTobilloM === true
  );
  await dibujarFilaMovimientoDoble(
    "Extensión", "",
    datos.extensionTobilloN1 === true, datos.extensionTobilloR1 === true, datos.extensionTobilloM1 === true,
    datos.extensionTobilloN === true, datos.extensionTobilloR === true, datos.extensionTobilloM === true
  );

  // === FUERZA MUSCULAR (GRADO) ===
  await verificarSaltoPagina(filaAltura * 2);
  const fmColLabelW = 70;
  const fmColW = (tablaAncho - fmColLabelW) / 5;

  // Fila 1: títulos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + fmColLabelW, yPos, tablaInicioX + fmColLabelW, yPos + filaAltura);
  for (let i = 1; i < 5; i++) {
    doc.line(tablaInicioX + fmColLabelW + fmColW * i, yPos, tablaInicioX + fmColLabelW + fmColW * i, yPos + filaAltura);
  }
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Fuerza Muscular ( Grado )", tablaInicioX + 2, yPos + 3.2);
  doc.setFont("helvetica", "bold").setFontSize(7);
  for (let i = 0; i < 5; i++) {
    doc.text(String(i + 1), tablaInicioX + fmColLabelW + fmColW * i + fmColW / 2, yPos + 3.2, { align: "center" });
  }
  yPos += filaAltura;

  // Fila 2: marcas
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + fmColLabelW, yPos, tablaInicioX + fmColLabelW, yPos + filaAltura);
  for (let i = 1; i < 5; i++) {
    doc.line(tablaInicioX + fmColLabelW + fmColW * i, yPos, tablaInicioX + fmColLabelW + fmColW * i, yPos + filaAltura);
  }
  const yCentroFM = yPos + filaAltura / 2 + 1.2;
  const fmFlags = [
    datos.fuerzaMuscularGrado1 === true,
    datos.fuerzaMuscularGrado2 === true,
    datos.fuerzaMuscularGrado3 === true,
    datos.fuerzaMuscularGrado4 === true,
    datos.fuerzaMuscularGrado5 === true
  ];
  fmFlags.forEach((flag, idx) => {
    if (flag) {
      dibujarX(doc, tablaInicioX + fmColLabelW + fmColW * idx + fmColW / 2, yCentroFM);
    }
  });
  yPos += filaAltura;

  // === 5. COLUMNA VERTEBRAL ===
  await dibujarTituloCentrado("5. COLUMNA VERTEBRAL");
  const halfW = tablaAncho / 2;
  const xLeft = tablaInicioX;
  const xRight = tablaInicioX + halfW;
  const rowH = 5;

  // Bloque 5.1 / 5.2 (6 filas: titulo, cabecera, 4 filas de data)
  await verificarSaltoPagina(rowH * 6);
  doc.rect(tablaInicioX, yPos, tablaAncho, rowH * 6);
  doc.line(xRight, yPos, xRight, yPos + rowH * 6);

  // Row 1: títulos
  doc.line(tablaInicioX, yPos + rowH, tablaInicioX + tablaAncho, yPos + rowH);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("5.1. Desviación de eje :", xLeft + 2, yPos + 3.3);
  doc.text("5.2. Desviación de Columna :", xRight + 2, yPos + 3.3);

  // Row 2: headers
  doc.line(tablaInicioX, yPos + rowH * 2, tablaInicioX + tablaAncho, yPos + rowH * 2);
  const ejeLabelW = 28;
  const ejeOptW = (halfW - ejeLabelW) / 3;
  // Calcular variables para 5.2 antes de usarlas
  const desvLabelW = 52;
  const xDesvLabelEnd = xRight + desvLabelW;
  const desvOptW = (halfW - desvLabelW) / 2;

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Normal", xLeft + ejeLabelW + ejeOptW / 2, yPos + rowH + 3.3, { align: "center" });
  doc.text("Derecha", xLeft + ejeLabelW + ejeOptW * 1.5, yPos + rowH + 3.3, { align: "center" });
  doc.text("Concavidad Izquierda", xLeft + ejeLabelW + ejeOptW * 2.5, yPos + rowH + 3.3, { align: "center" });
  doc.text("SI", xDesvLabelEnd + desvOptW / 2, yPos + rowH + 3.3, { align: "center" });
  doc.text("NO", xDesvLabelEnd + desvOptW * 1.5, yPos + rowH + 3.3, { align: "center" });

  // Líneas verticales internas (5.1)
  doc.line(xLeft + ejeLabelW, yPos + rowH, xLeft + ejeLabelW, yPos + rowH * 6);
  doc.line(xLeft + ejeLabelW + ejeOptW, yPos + rowH, xLeft + ejeLabelW + ejeOptW, yPos + rowH * 6);
  doc.line(xLeft + ejeLabelW + ejeOptW * 2, yPos + rowH, xLeft + ejeLabelW + ejeOptW * 2, yPos + rowH * 6);
  // Líneas verticales internas (5.2)
  doc.line(xDesvLabelEnd, yPos + rowH, xDesvLabelEnd, yPos + rowH * 6);
  doc.line(xDesvLabelEnd + desvOptW, yPos + rowH, xDesvLabelEnd + desvOptW, yPos + rowH * 6);

  // Filas de data (4 filas para alinear con 5.2)
  for (let i = 0; i < 4; i++) {
    doc.line(tablaInicioX, yPos + rowH * (3 + i), tablaInicioX + tablaAncho, yPos + rowH * (3 + i));
  }

  const filasEje = [
    { label: "Cervical :", n: datos.columaVertebralEjeCervicalNormal, d: datos.columaVertebralEjeCervicalDerecha, i: datos.columaVertebralEjeCervicalIzquierda },
    { label: "Dorsal :", n: datos.columaVertebralEjeDorsalNormal, d: datos.columaVertebralEjeDorsalDerecha, i: datos.columaVertebralEjeDorsalIzquierda },
    { label: "Lumbar :", n: datos.columaVertebralEjeLumbarNormal, d: datos.columaVertebralEjeLumbarDerecha, i: datos.columaVertebralEjeLumbarIzquierda },
    { label: "", n: false, d: false, i: false }
  ];

  const filasDesv = [
    { label: "Cifosis :", si: datos.columaVertebralDesviacionCifosisSi, no: datos.columaVertebralDesviacionCifosisNo },
    { label: "Escoliosis :", si: datos.columaVertebralDesviacionEscoliosisSi, no: datos.columaVertebralDesviacionEscoliosisNo },
    { label: "Lordosis :", si: datos.columaVertebralDesviacionLordosisSi, no: datos.columaVertebralDesviacionLordosisNo },
    { label: "Mixta :", si: datos.columaVertebralDesviacionMixtaSi, no: datos.columaVertebralDesviacionMixtaNo }
  ];

  filasEje.forEach((fila, idx) => {
    const yRowTop = yPos + rowH * (2 + idx);
    const yTexto = yRowTop + rowH / 2 + 1.2;
    doc.setFont("helvetica", "normal").setFontSize(7);
    if (fila.label) doc.text(fila.label, xLeft + 2, yTexto);
    // Celdas con X centrada
    if (fila.n === true) {
      dibujarX(doc, xLeft + ejeLabelW + ejeOptW / 2, yTexto);
    }
    if (fila.d === true) {
      dibujarX(doc, xLeft + ejeLabelW + ejeOptW * 1.5, yTexto);
    }
    if (fila.i === true) {
      dibujarX(doc, xLeft + ejeLabelW + ejeOptW * 2.5, yTexto);
    }
  });

  filasDesv.forEach((fila, idx) => {
    const yRowTop = yPos + rowH * (2 + idx);
    const yTexto = yRowTop + rowH / 2 + 1.2;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(fila.label, xRight + 2, yTexto);
    // Celdas con X centrada
    if (fila.si === true) {
      dibujarX(doc, xDesvLabelEnd + desvOptW / 2, yTexto);
    }
    if (fila.no === true) {
      dibujarX(doc, xDesvLabelEnd + desvOptW * 1.5, yTexto);
    }
  });

  yPos += rowH * 6;

  // Bloque 5.3 / 5.4 (5 filas: títulos, cabecera, 3 filas data)
  await verificarSaltoPagina(rowH * 5);
  doc.rect(tablaInicioX, yPos, tablaAncho, rowH * 5);
  doc.line(xRight, yPos, xRight, yPos + rowH * 5);
  doc.line(tablaInicioX, yPos + rowH, tablaInicioX + tablaAncho, yPos + rowH);
  doc.line(tablaInicioX, yPos + rowH * 2, tablaInicioX + tablaAncho, yPos + rowH * 2);
  doc.line(tablaInicioX, yPos + rowH * 3, tablaInicioX + tablaAncho, yPos + rowH * 3);
  doc.line(tablaInicioX, yPos + rowH * 4, tablaInicioX + tablaAncho, yPos + rowH * 4);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("5.3. Palpación :      DOLOR", xLeft + 2, yPos + 3.3);
  doc.text("5.4. Exploración :      Signo de Lasague", xRight + 2, yPos + 3.3);

  // Headers SI/NO
  const palLabelW = 42;
  const palOptW = (halfW - palLabelW) / 2;
  const palXLabelEnd = xLeft + palLabelW;
  doc.line(palXLabelEnd, yPos + rowH, palXLabelEnd, yPos + rowH * 5);
  doc.line(palXLabelEnd + palOptW, yPos + rowH, palXLabelEnd + palOptW, yPos + rowH * 5);

  const lasLabelW = 52;
  const lasOptW = (halfW - lasLabelW) / 2;
  const lasXLabelEnd = xRight + lasLabelW;
  doc.line(lasXLabelEnd, yPos + rowH, lasXLabelEnd, yPos + rowH * 5);
  doc.line(lasXLabelEnd + lasOptW, yPos + rowH, lasXLabelEnd + lasOptW, yPos + rowH * 5);

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("SI", palXLabelEnd + palOptW / 2, yPos + rowH + 3.3, { align: "center" });
  doc.text("NO", palXLabelEnd + palOptW * 1.5, yPos + rowH + 3.3, { align: "center" });
  doc.text("SI", lasXLabelEnd + lasOptW / 2, yPos + rowH + 3.3, { align: "center" });
  doc.text("NO", lasXLabelEnd + lasOptW * 1.5, yPos + rowH + 3.3, { align: "center" });

  // Palpación rows
  const palpRows = [
    { label: "Cervical :", si: datos.columaVertebralPalpacionCervicalSi, no: datos.columaVertebralPalpacionCervicalNo },
    { label: "Dorsal :", si: datos.columaVertebralPalpacionDorsalSi, no: datos.columaVertebralPalpacionDorsalNo },
    { label: "Lumbar :", si: datos.columaVertebralPalpacionLumbarSi, no: datos.columaVertebralPalpacionLumbarNo }
  ];
  palpRows.forEach((fila, idx) => {
    const yRowTop = yPos + rowH * (2 + idx);
    const yTexto = yRowTop + rowH / 2 + 1.2;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(fila.label, xLeft + 2, yTexto);
    // Celdas con X centrada
    if (fila.si === true) {
      dibujarX(doc, palXLabelEnd + palOptW / 2, yTexto);
    }
    if (fila.no === true) {
      dibujarX(doc, palXLabelEnd + palOptW * 1.5, yTexto);
    }
  });

  // Lasague rows (2 filas) - empezar desde fila 3 para alinear con las últimas 2 filas de Palpación
  const lasRows = [
    { label: "Derecho :", si: datos.columaVertebralExploracionLesagueDerechoSi, no: datos.columaVertebralExploracionLesagueDerechoNo },
    { label: "Izquierdo :", si: datos.columaVertebralExploracionLesagueIzquierdoSi, no: datos.columaVertebralExploracionLesagueIzquierdoNo }
  ];
  lasRows.forEach((fila, idx) => {
    const yRowTop = yPos + rowH * (3 + idx); // Empezar en fila 3 (después de header)
    const yTexto = yRowTop + rowH / 2 + 1.2;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(fila.label, xRight + 2, yTexto);
    // Celdas con X centrada
    if (fila.si === true) {
      dibujarX(doc, lasXLabelEnd + lasOptW / 2, yTexto);
    }
    if (fila.no === true) {
      dibujarX(doc, lasXLabelEnd + lasOptW * 1.5, yTexto);
    }
  });

  yPos += rowH * 5;

  // === VIII. DIAGNÓSTICO ===
  await verificarSaltoPagina(10);
  doc.rect(tablaInicioX, yPos, tablaAncho, 10);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("VIII. Diagnóstico :", tablaInicioX + 2, yPos + 3.3);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(String(datos.diagnostico || "").toUpperCase(), tablaInicioX + 35, yPos + 3.3);
  yPos += 10;

  // === IX. RECOMENDACIONES Y PLAN DE ACCIÓN ===
  await verificarSaltoPagina(25);
  doc.rect(tablaInicioX, yPos, tablaAncho, 25);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("IX. Recomendaciones y plan de acción :", tablaInicioX + 2, yPos + 3.3);
  const rec = String(datos.recomendaciones || "").trim();
  const recTxt = rec ? rec.toUpperCase() : "-";
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(recTxt, tablaInicioX + tablaAncho / 2, yPos + 13, { align: "center", maxWidth: tablaAncho - 10 });
  yPos += 25;

  // === X. TRATAMIENTO ===
  await verificarSaltoPagina(filaAltura);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  // Líneas verticales para celdas
  const xTratLabel = tablaInicioX + 50;
  const xTratSi = xTratLabel + 15;
  const xTratNo = xTratSi + 20;
  doc.line(xTratLabel, yPos, xTratLabel, yPos + filaAltura);
  doc.line(xTratSi, yPos, xTratSi, yPos + filaAltura);
  doc.line(xTratNo, yPos, xTratNo, yPos + filaAltura);
  const yCentroTrat = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("X. Tratamiento :", tablaInicioX + 2, yCentroTrat);
  doc.text("SI", xTratLabel + 2, yCentroTrat);
  if (datos.tratamientoSi === true) {
    dibujarX(doc, xTratSi + 10, yCentroTrat);
  }
  doc.text("NO", xTratNo + 2, yCentroTrat);
  if (datos.tratamientoNo === true) {
    dibujarX(doc, xTratNo + 10, yCentroTrat);
  }
  yPos += filaAltura;

  // === XI. CONCLUSIONES ASINTOMÁTICO ===
  await verificarSaltoPagina(filaAltura);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  // Líneas verticales para celdas
  const xConLabel = tablaInicioX + 68;
  const xConSi = xConLabel + 15;
  const xConNo = xConSi + 20;
  doc.line(xConLabel, yPos, xConLabel, yPos + filaAltura);
  doc.line(xConSi, yPos, xConSi, yPos + filaAltura);
  doc.line(xConNo, yPos, xConNo, yPos + filaAltura);
  const yCentroCon = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("XI. Conclusiones Asintomático :", tablaInicioX + 2, yCentroCon);
  doc.text("SI", xConLabel + 2, yCentroCon);
  if (datos.conclusionAsintomaticoSi === true) {
    dibujarX(doc, xConSi + 10, yCentroCon);
  }
  doc.text("NO", xConNo + 2, yCentroCon);
  if (datos.conclusionAsintomaticoNo === true) {
    dibujarX(doc, xConNo + 10, yCentroCon);
  }
  yPos += filaAltura;

  // === FIRMAS (Paciente + Médico) ===
  const alturaSeccionFirma = 30;
  await verificarSaltoPagina(alturaSeccionFirma + 8);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaSeccionFirma);

  const yFirmas = yPos + 3;
  await dibujarFirmas({ doc, datos: { ...datos, ...datos.informacionSede }, y: yFirmas, pageW, mostrarFirmaPaciente: true });

  yPos += alturaSeccionFirma;

  return yPos;
};

// Función principal del jasper
export default async function EvaluacionMuscoloEsqueletica(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  let numeroPagina = 1;

  // 1) Header con logo, color box y datos
  await drawHeader(doc, datos, numeroPagina);

  // 2) Título principal (solo en página 1)
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("EVALUACIÓN MÚSCULO ESQUELÉTICA", pageW / 2, 32, { align: "center" });

  // 3) Datos personales
  const yDespuesDatos = drawPatientData(doc, datos);

  // 4) Síntomas y preguntas SI/NO
  const yDespuesSintomas = drawSintomasYPreguntas(doc, datos, yDespuesDatos);

  // 5) Examen Físico
  await drawExamenFisico(doc, datos, yDespuesSintomas, numeroPagina);

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
