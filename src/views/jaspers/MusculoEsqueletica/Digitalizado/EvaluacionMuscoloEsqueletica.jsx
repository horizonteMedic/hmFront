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

// Función para dibujar texto con X en azul
const dibujarTextoConXAzul = (doc, texto, x, y, options = {}) => {
  const colorNegro = [0, 0, 0];
  const colorAzul = [0, 0, 255];
  
  // Si el texto contiene "X", dividirlo en partes
  if (texto.includes("X")) {
    const partes = texto.split("X");
    const antesX = partes[0];
    const despuesX = partes[1];
    
    // Calcular anchos
    const anchoAntesX = doc.getTextWidth(antesX);
    const anchoX = doc.getTextWidth("X");
    const anchoDespuesX = doc.getTextWidth(despuesX);
    const anchoTotal = anchoAntesX + anchoX + anchoDespuesX;
    
    let xActual = x;
    
    // Si hay alineación center, ajustar
    if (options.align === "center") {
      xActual = x - anchoTotal / 2;
    }
    
    // Dibujar texto antes de X en negro
    doc.setTextColor(...colorNegro);
    doc.text(antesX, xActual, y);
    
    // Dibujar X en azul
    doc.setTextColor(...colorAzul);
    doc.text("X", xActual + anchoAntesX, y);
    
    // Dibujar texto después de X en negro
    doc.setTextColor(...colorNegro);
    doc.text(despuesX, xActual + anchoAntesX + anchoX, y);
  } else {
    // Si no hay X, dibujar normalmente en negro
    doc.setTextColor(...colorNegro);
    doc.text(texto, x, y, options);
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

  // Dibujar todas las filas como una tabla unificada
  const alturaTotal = filaAltura * 3;
  
  // Rectángulo exterior de toda la tabla (sin espacio, directamente después del header)
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaTotal, 'S');
  
  // Líneas horizontales entre filas (solo las internas, no la superior ni inferior)
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos + filaAltura * 2, tablaInicioX + tablaAncho, yPos + filaAltura * 2);
  
  // Fila 1: Línea vertical divisoria
  doc.line(mitadTabla, yPos, mitadTabla, yPos + filaAltura);
  
  // Fila 2: Líneas verticales divisorias (3 columnas)
  doc.line(tablaInicioX + tercioTabla, yPos + filaAltura, tablaInicioX + tercioTabla, yPos + filaAltura * 2);
  doc.line(tablaInicioX + tercioTabla * 2, yPos + filaAltura, tablaInicioX + tercioTabla * 2, yPos + filaAltura * 2);
  
  // Fila 3: Línea vertical divisoria
  doc.line(mitadTabla, yPos + filaAltura * 2, mitadTabla, yPos + alturaTotal);

  // Contenido de la tabla - alineado directamente con las filas dibujadas
  const yCentroFila = 3.2; // Offset vertical para centrar el texto en cada fila

  // Fila 1: Apellidos y Nombres | Tiempo de Servicio
  let yTexto = yPos + yCentroFila;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(nombres, tablaInicioX + 36, yTexto);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Tiempo de Servicio:", mitadTabla + 2, yTexto);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(tiempoServicio, mitadTabla + 36, yTexto);

  // Fila 2: DNI | Edad | Sexo
  yTexto = yPos + filaAltura + yCentroFila;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("DNI:", tablaInicioX + 2, yTexto);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(dni, tablaInicioX + 12, yTexto);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Edad:", tablaInicioX + tercioTabla + 2, yTexto);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text((edad ? edad + " Años" : ""), tablaInicioX + tercioTabla + 12, yTexto);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Sexo:", tablaInicioX + tercioTabla * 2 + 2, yTexto);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(sexo, tablaInicioX + tercioTabla * 2 + 12, yTexto);

  // Fila 3: Empresa | Área de Trabajo
  yTexto = yPos + filaAltura * 2 + yCentroFila;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Empresa:", tablaInicioX + 2, yTexto);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(empresa, tablaInicioX + 20, yTexto);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Área de Trabajo:", mitadTabla + 2, yTexto);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(areaTrabajo, mitadTabla + 30, yTexto);

  // Retornar la posición después de todas las filas
  yPos += alturaTotal;
  return yPos;
};

// Función para dibujar sección de Síntomas y preguntas SI/NO
const drawSintomasYPreguntas = (doc, datos = {}, yInicio) => {
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 4.5;
  let yPos = yInicio;

  // Fila 1: Usa faja lumbar | SI/NO | Adecuada Técnica | SI/NO | Capacitación | SI/NO
  // Anchos personalizados para cada columna
  const anchoFaja = 35;
  const anchoSINO1 = 15;
  const anchoTecnica = 65;
  const anchoSINO2 = 15;
  const anchoCapacitacion = 50;
  const anchoSINO3 = 20;
  
  // Dibujar rectángulo de la fila
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  
  // Líneas verticales divisorias
  let xActual = tablaInicioX;
  xActual += anchoFaja;
  doc.line(xActual, yPos, xActual, yPos + filaAltura);
  xActual += anchoSINO1;
  doc.line(xActual, yPos, xActual, yPos + filaAltura);
  xActual += anchoTecnica;
  doc.line(xActual, yPos, xActual, yPos + filaAltura);
  xActual += anchoSINO2;
  doc.line(xActual, yPos, xActual, yPos + filaAltura);
  xActual += anchoCapacitacion;
  doc.line(xActual, yPos, xActual, yPos + filaAltura);
  
  const yCentro = yPos + filaAltura / 2 + 1.2;
  
  // Columna 1: "Usa faja lumbar:"
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Usa faja lumbar:", tablaInicioX + 2, yCentro);
  
  // Columna 2: SI/NO (mostrar texto según booleano)
  const fajaValor = datos.fajaSi === true ? "SI" : (datos.fajaNo === true ? "NO" : "");
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(fajaValor, tablaInicioX + anchoFaja + anchoSINO1 / 2, yCentro, { align: "center" });
  
  // Columna 3: "Adecuada Técnica de Levantamiento de Carga:"
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Adecuada Técnica de Levantamiento de Carga:", tablaInicioX + anchoFaja + anchoSINO1 + 2, yCentro);
  
  // Columna 4: SI/NO
  const tecnicaValor = datos.adecuadaTecnicacargaSi === true ? "SI" : (datos.adecuadaTecnicacargaNo === true ? "NO" : "");
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(tecnicaValor, tablaInicioX + anchoFaja + anchoSINO1 + anchoTecnica + anchoSINO2 / 2, yCentro, { align: "center" });
  
  // Columna 5: "Capacitación en Levantamiento de Carga:"
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Capacitación en Levantamiento de Carga:", tablaInicioX + anchoFaja + anchoSINO1 + anchoTecnica + anchoSINO2 + 2, yCentro);
  
  // Columna 6: SI/NO
  const capacitacionValor = datos.capacitacionLevantamientoCargaSi === true ? "SI" : (datos.capacitacionLevantamientoCargaNo === true ? "NO" : "");
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(capacitacionValor, tablaInicioX + anchoFaja + anchoSINO1 + anchoTecnica + anchoSINO2 + anchoCapacitacion + anchoSINO3 / 2, yCentro, { align: "center" });
  
  yPos += filaAltura;

  // Fila 2: Síntomas | SI/NO | Cuales: | texto
  // Anchos personalizados para cada columna
  const anchoSintomas = 25;
  const anchoSINOSintomas = 15;
  const anchoCuales = 20;
  
  // Dibujar rectángulo de la fila
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  
  // Líneas verticales divisorias
  let xActual2 = tablaInicioX;
  xActual2 += anchoSintomas;
  doc.line(xActual2, yPos, xActual2, yPos + filaAltura);
  xActual2 += anchoSINOSintomas;
  doc.line(xActual2, yPos, xActual2, yPos + filaAltura);
  xActual2 += anchoCuales;
  doc.line(xActual2, yPos, xActual2, yPos + filaAltura);
  
  const yCentro2 = yPos + filaAltura / 2 + 1.2;
  
  // Columna 1: "Síntomas:"
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Síntomas:", tablaInicioX + 2, yCentro2);
  
  // Columna 2: SI/NO
  const sintomaValor = datos.sintomaSi === true ? "SI" : (datos.sintomaNo === true ? "NO" : "");
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(sintomaValor, tablaInicioX + anchoSintomas + anchoSINOSintomas / 2, yCentro2, { align: "center" });
  
  // Columna 3: "Cuales:"
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Cuales:", tablaInicioX + anchoSintomas + anchoSINOSintomas + 2, yCentro2);
  
  // Columna 4: Texto de síntomas
  const sintomasTexto = String(datos.sintomas || "");
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(sintomasTexto, tablaInicioX + anchoSintomas + anchoSINOSintomas + anchoCuales + 2, yCentro2);
  
  yPos += filaAltura;

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
    // PRIMERO: Dibujar fondo gris
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    // DESPUÉS: Dibujar líneas encima del fondo gris
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'S'); // Borde del rectángulo
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(titulo, tablaInicioX + 2, yPos + 3);
    yPos += alturaHeader;
  };

  // Título centrado con borde (sin relleno) para bloques finales
  const dibujarTituloCentrado = async (titulo) => {
    await verificarSaltoPagina(filaAltura);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    // Fondo gris para "5. COLUMNA VERTEBRAL"
    if (titulo === "5. COLUMNA VERTEBRAL") {
      doc.setFillColor(196, 196, 196);
      doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD'); // 'FD' = Fill + Draw (borde)
    } else {
      doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    }
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

  // Función para dibujar fila de movimiento con dos columnas de Grado (izquierda y derecha)
  const dibujarFilaMovimientoDoble = async (label, valor,
    nIzq, rIzq, mIzq, // Grado izquierdo
    nDer, rDer, mDer  // Grado derecho
  ) => {
    await verificarSaltoPagina();
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
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

    // Grado Izquierdo - Mostrar "N ( X )" si está marcado, "N (  )" si no está marcado
    doc.setFont("helvetica", "normal").setFontSize(7);
    const textoNIzq = nIzq ? "N ( X )" : "N (  )";
    dibujarTextoConXAzul(doc, textoNIzq, xGradoIzq + anchoN / 2, yCentro, { align: "center" });
    const textoRIzq = rIzq ? "R ( X )" : "R (  )";
    dibujarTextoConXAzul(doc, textoRIzq, xGradoIzq + anchoN + anchoR / 2, yCentro, { align: "center" });
    const textoMIzq = mIzq ? "M ( X )" : "M (  )";
    dibujarTextoConXAzul(doc, textoMIzq, xGradoIzq + anchoN + anchoR + anchoM / 2, yCentro, { align: "center" });

    // Grado Derecho - Mostrar "N ( X )" si está marcado, "N (  )" si no está marcado
    const textoNDer = nDer ? "N ( X )" : "N (  )";
    dibujarTextoConXAzul(doc, textoNDer, xGradoDer + anchoN / 2, yCentro, { align: "center" });
    const textoRDer = rDer ? "R ( X )" : "R (  )";
    dibujarTextoConXAzul(doc, textoRDer, xGradoDer + anchoN + anchoR / 2, yCentro, { align: "center" });
    const textoMDer = mDer ? "M ( X )" : "M (  )";
    dibujarTextoConXAzul(doc, textoMDer, xGradoDer + anchoN + anchoR + anchoM / 2, yCentro, { align: "center" });

    yPos += filaAltura;
  };

  // === 1. CABEZA Y CUELLO ===
  await dibujarHeaderSeccion("1. CABEZA Y CUELLO", filaAltura);

  // Layout para Cabeza y Cuello: Extensión | N R M | Flexión | N R M
  // Dividir el ancho en 4 columnas principales (cada una de 50mm)
  const anchoColumnaMovimiento = 50; // Ancho para "Extensión" y "Flexión"
  const anchoColumnaGrado = 50; // Ancho para cada columna de grado (N R M)
  
  // Posiciones de las columnas
  const xExtensión = tablaInicioX;
  const xGradoExt = xExtensión + anchoColumnaMovimiento;
  const xFlexion = xGradoExt + anchoColumnaGrado;
  const xGradoFlex = xFlexion + anchoColumnaMovimiento;
  
  // Anchos para N, R, M dentro de cada columna de grado
  const anchoNCabeza = anchoColumnaGrado / 3;
  const anchoRCabeza = anchoColumnaGrado / 3;
  const anchoMCabeza = anchoColumnaGrado / 3;

  // Fila única: Extensión | N ( ) R ( ) M ( ) | Flexión | N ( ) R ( ) M ( )
  await verificarSaltoPagina();
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xGradoExt, yPos, xGradoExt, yPos + filaAltura);
  doc.line(xGradoExt + anchoNCabeza, yPos, xGradoExt + anchoNCabeza, yPos + filaAltura);
  doc.line(xGradoExt + anchoNCabeza + anchoRCabeza, yPos, xGradoExt + anchoNCabeza + anchoRCabeza, yPos + filaAltura);
  doc.line(xFlexion, yPos, xFlexion, yPos + filaAltura);
  doc.line(xGradoFlex, yPos, xGradoFlex, yPos + filaAltura);
  doc.line(xGradoFlex + anchoNCabeza, yPos, xGradoFlex + anchoNCabeza, yPos + filaAltura);
  doc.line(xGradoFlex + anchoNCabeza + anchoRCabeza, yPos, xGradoFlex + anchoNCabeza + anchoRCabeza, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentro = yPos + filaAltura / 2 + 1.2;
  
  // Extensión (centro de su columna)
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Extensión", xExtensión + anchoColumnaMovimiento / 2, yCentro, { align: "center" });
  
  // Grado para Extensión: N ( ) R ( ) M ( )
  const textoNExt = datos.extensionCabezaN === true ? "N ( X )" : "N (  )";
  dibujarTextoConXAzul(doc, textoNExt, xGradoExt + anchoNCabeza / 2, yCentro, { align: "center" });
  const textoRExt = datos.extensionCabezaR === true ? "R ( X )" : "R (  )";
  dibujarTextoConXAzul(doc, textoRExt, xGradoExt + anchoNCabeza + anchoRCabeza / 2, yCentro, { align: "center" });
  const textoMExt = datos.extensionCabezaM === true ? "M ( X )" : "M (  )";
  dibujarTextoConXAzul(doc, textoMExt, xGradoExt + anchoNCabeza + anchoRCabeza + anchoMCabeza / 2, yCentro, { align: "center" });
  
  // Flexión (centro de su columna)
  doc.text("Flexión", xFlexion + anchoColumnaMovimiento / 2, yCentro, { align: "center" });
  
  // Grado para Flexión: N ( ) R ( ) M ( )
  const textoNFlex = datos.flexionCabezaN === true ? "N ( X )" : "N (  )";
  dibujarTextoConXAzul(doc, textoNFlex, xGradoFlex + anchoNCabeza / 2, yCentro, { align: "center" });
  const textoRFlex = datos.flexionCabezaR === true ? "R ( X )" : "R (  )";
  dibujarTextoConXAzul(doc, textoRFlex, xGradoFlex + anchoNCabeza + anchoRCabeza / 2, yCentro, { align: "center" });
  const textoMFlex = datos.flexionCabezaM === true ? "M ( X )" : "M (  )";
  dibujarTextoConXAzul(doc, textoMFlex, xGradoFlex + anchoNCabeza + anchoRCabeza + anchoMCabeza / 2, yCentro, { align: "center" });
  
  yPos += filaAltura;

  // === 2. MIEMBROS SUPERIORES ===
  await dibujarHeaderSeccion("2. MIEMBROS SUPERIORES", filaAltura);

  // === a) HOMBRO ===
  await dibujarHeaderSeccion("a) HOMBRO", filaAltura);

  // Header única fila: Grado (Izquierdo) | Movimiento | Grado (Derecho)
  // Celdas limpias sin divisiones internas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderHombro = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  // Grado (Izquierdo) - centrado sobre las columnas N R M
  doc.text("Grado (Izquierdo)", xGradoIzq + anchoGradoColumna / 2, yCentroHeaderHombro, { align: "center" });
  // Movimiento
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderHombro, { align: "center" });
  // Grado (Derecho) - centrado sobre las columnas N R M
  doc.text("Grado (Derecho)", xGradoDer + anchoGradoColumna / 2, yCentroHeaderHombro, { align: "center" });
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

  // Header única fila: Grado (Izquierdo) | Movimiento | Grado (Derecho)
  // Celdas limpias sin divisiones internas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderBrazo = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Grado (Izquierdo)", xGradoIzq + anchoGradoColumna / 2, yCentroHeaderBrazo, { align: "center" });
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderBrazo, { align: "center" });
  doc.text("Grado (Derecho)", xGradoDer + anchoGradoColumna / 2, yCentroHeaderBrazo, { align: "center" });
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

  // Header única fila: Grado (Izquierdo) | Movimiento | Grado (Derecho)
  // Celdas limpias sin divisiones internas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderAntebrazo = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Grado (Izquierdo)", xGradoIzq + anchoGradoColumna / 2, yCentroHeaderAntebrazo, { align: "center" });
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderAntebrazo, { align: "center" });
  doc.text("Grado (Derecho)", xGradoDer + anchoGradoColumna / 2, yCentroHeaderAntebrazo, { align: "center" });
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

  // Header única fila: Grado (Izquierdo) | Movimiento | Grado (Derecho)
  // Celdas limpias sin divisiones internas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderMuneca = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Grado (Izquierdo)", xGradoIzq + anchoGradoColumna / 2, yCentroHeaderMuneca, { align: "center" });
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderMuneca, { align: "center" });
  doc.text("Grado (Derecho)", xGradoDer + anchoGradoColumna / 2, yCentroHeaderMuneca, { align: "center" });
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

  // S. de Phallen y S. Tinel (con SI/NO en columna derecha)
  const dibujarFilaSINO = async (label, siMarcado, noMarcado) => {
    await verificarSaltoPagina();
    // Layout con celdas: Grado Izq (vacío) | Movimiento | Grado Der (SI/NO a la derecha)
    // Ancho para texto "SI ( X )" o "NO ( X )"
    const anchoCeldaSINO = 18; // Ancho suficiente para "SI ( X )" o "NO ( X )"

    // Calcular posiciones desde la derecha (pegadas al final)
    const xNO = tablaInicioX + tablaAncho - anchoCeldaSINO; // Última celda al final
    const xSI = xNO - anchoCeldaSINO;

    // Líneas verticales
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(xGradoIzq, yPos, xGradoIzq, yPos + filaAltura);
    doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
    doc.line(xSI, yPos, xSI, yPos + filaAltura);
    doc.line(xNO, yPos, xNO, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    const yCentro = yPos + filaAltura / 2 + 1.2;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(label, xMovimiento + anchoMovimiento / 2, yCentro, { align: "center" });

    // Derecho: SI ( X ) | NO ( X ) (pegadas a la derecha)
    const textoSI = siMarcado ? "SI ( X )" : "SI (  )";
    const textoNO = noMarcado ? "NO ( X )" : "NO (  )";
    doc.text(textoSI, xSI + anchoCeldaSINO / 2, yCentro, { align: "center" });
    doc.text(textoNO, xNO + anchoCeldaSINO / 2, yCentro, { align: "center" });

    // Izquierdo: vacío (sin SI/NO)

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

  // Header única fila: Grado (Izquierdo) | Movimiento | Grado (Derecho)
  // Celdas limpias sin divisiones internas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderTorax = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Grado (Izquierdo)", xGradoIzq + anchoGradoColumna / 2, yCentroHeaderTorax, { align: "center" });
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderTorax, { align: "center" });
  doc.text("Grado (Derecho)", xGradoDer + anchoGradoColumna / 2, yCentroHeaderTorax, { align: "center" });
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

  // Header única fila: Grado (Izquierdo) | Movimiento | Grado (Derecho)
  // Celdas limpias sin divisiones internas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderCadera = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Grado (Izquierdo)", xGradoIzq + anchoGradoColumna / 2, yCentroHeaderCadera, { align: "center" });
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderCadera, { align: "center" });
  doc.text("Grado (Derecho)", xGradoDer + anchoGradoColumna / 2, yCentroHeaderCadera, { align: "center" });
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

  // Header única fila: Grado (Izquierdo) | Movimiento | Grado (Derecho)
  // Celdas limpias sin divisiones internas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderPierna = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Grado (Izquierdo)", xGradoIzq + anchoGradoColumna / 2, yCentroHeaderPierna, { align: "center" });
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderPierna, { align: "center" });
  doc.text("Grado (Derecho)", xGradoDer + anchoGradoColumna / 2, yCentroHeaderPierna, { align: "center" });
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

  // Header única fila: Grado (Izquierdo) | Movimiento | Grado (Derecho)
  // Celdas limpias sin divisiones internas
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderRodilla = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Grado (Izquierdo)", xGradoIzq + anchoGradoColumna / 2, yCentroHeaderRodilla, { align: "center" });
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderRodilla, { align: "center" });
  doc.text("Grado (Derecho)", xGradoDer + anchoGradoColumna / 2, yCentroHeaderRodilla, { align: "center" });
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

  // Header única fila: Grado (Izquierdo) | Movimiento | Grado (Derecho)
  // Celdas limpias sin divisiones internas
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(xMovimiento, yPos, xMovimiento, yPos + filaAltura);
  doc.line(xGradoDer, yPos, xGradoDer, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  const yCentroHeaderTobillo = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Grado (Izquierdo)", xGradoIzq + anchoGradoColumna / 2, yCentroHeaderTobillo, { align: "center" });
  doc.text("Movimiento", xMovimiento + anchoMovimiento / 2, yCentroHeaderTobillo, { align: "center" });
  doc.text("Grado (Derecho)", xGradoDer + anchoGradoColumna / 2, yCentroHeaderTobillo, { align: "center" });
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
  
  // Estructura: Celda grande (abarca 2 filas) | Columna 1 | Columna 2 | Columna 3 | Columna 4 | Columna 5
  const fmColW = tablaAncho / 6; // Ancho de cada columna (6 columnas: 1 celda grande + 5 números)
  const fmCeldaGrandeW = fmColW; // Celda grande ocupa 1 columna
  const xFinCeldaGrande = tablaInicioX + fmCeldaGrandeW;
  
  // PRIMERO: Dibujar fondo gris para las columnas de números (1-5) en la fila 1
  doc.setFillColor(196, 196, 196);
  doc.rect(xFinCeldaGrande, yPos, fmColW * 5, filaAltura, 'F');
  
  // DESPUÉS: Dibujar todas las líneas encima del fondo gris
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  // Rectángulo exterior (2 filas)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura * 2, 'S');
  // Líneas verticales: después de la celda grande, y entre las columnas 1, 2, 3, 4, 5
  doc.line(xFinCeldaGrande, yPos, xFinCeldaGrande, yPos + filaAltura * 2); // Después de celda grande
  doc.line(xFinCeldaGrande + fmColW, yPos, xFinCeldaGrande + fmColW, yPos + filaAltura * 2); // Entre 1 y 2
  doc.line(xFinCeldaGrande + fmColW * 2, yPos, xFinCeldaGrande + fmColW * 2, yPos + filaAltura * 2); // Entre 2 y 3
  doc.line(xFinCeldaGrande + fmColW * 3, yPos, xFinCeldaGrande + fmColW * 3, yPos + filaAltura * 2); // Entre 3 y 4
  doc.line(xFinCeldaGrande + fmColW * 4, yPos, xFinCeldaGrande + fmColW * 4, yPos + filaAltura * 2); // Entre 4 y 5
  // Línea horizontal entre fila 1 y fila 2 (solo en las columnas de números, no en la celda grande)
  doc.line(xFinCeldaGrande, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Texto en celda grande (centrado verticalmente en las 2 filas)
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Fuerza Muscular ( Grado )", tablaInicioX + fmCeldaGrandeW / 2, yPos + filaAltura + 1.2, { align: "center" });
  
  // Números 1, 2, 3, 4, 5 centrados en sus columnas (fila 1)
  doc.text("1", xFinCeldaGrande + fmColW / 2, yPos + 3.2, { align: "center" });
  doc.text("2", xFinCeldaGrande + fmColW + fmColW / 2, yPos + 3.2, { align: "center" });
  doc.text("3", xFinCeldaGrande + fmColW * 2 + fmColW / 2, yPos + 3.2, { align: "center" });
  doc.text("4", xFinCeldaGrande + fmColW * 3 + fmColW / 2, yPos + 3.2, { align: "center" });
  doc.text("5", xFinCeldaGrande + fmColW * 4 + fmColW / 2, yPos + 3.2, { align: "center" });
  
  yPos += filaAltura;
  
  // Fila 2: Marcas X dentro de paréntesis
  const yCentroFM = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "normal").setFontSize(7);
  
  // Mapear los datos y dibujar "( X )" o "(  )" en cada columna
  const fmFlags = [
    datos.fuerzaMuscularGrado1 === true,
    datos.fuerzaMuscularGrado2 === true,
    datos.fuerzaMuscularGrado3 === true,
    datos.fuerzaMuscularGrado4 === true,
    datos.fuerzaMuscularGrado5 === true
  ];
  
  fmFlags.forEach((flag, idx) => {
    const textoFM = flag ? "( X )" : "(  )";
    dibujarTextoConXAzul(doc, textoFM, xFinCeldaGrande + fmColW * idx + fmColW / 2, yCentroFM, { align: "center" });
  });
  
  yPos += filaAltura;

  // === 5. COLUMNA VERTEBRAL ===
  await dibujarTituloCentrado("5. COLUMNA VERTEBRAL");
  const halfW = tablaAncho / 2;
  const xLeft = tablaInicioX;
  const xRight = tablaInicioX + halfW;
  const rowH = 5;

  // Bloque 5.1 / 5.2 (5 filas: titulo + 4 filas de data, sin headers)
  await verificarSaltoPagina(rowH * 5);
  
  // PRIMERO: Dibujar fondo gris de la fila 1
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, rowH, 'F');
  
  // DESPUÉS: Dibujar todas las líneas (horizontales y verticales)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  // Rectángulo exterior
  doc.rect(tablaInicioX, yPos, tablaAncho, rowH * 5, 'S'); // 'S' = Stroke only
  // Línea horizontal después de la fila 1 (sin divisiones verticales en la fila 1 porque ahí va texto)
  doc.line(tablaInicioX, yPos + rowH, tablaInicioX + tablaAncho, yPos + rowH);
  // Línea vertical divisoria (empieza después de la fila 1, no pasa por ella)
  doc.line(xRight, yPos + rowH, xRight, yPos + rowH * 5);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("5.1. Desviación de eje :", xLeft + 2, yPos + 3.3);
  doc.text("5.2. Desviación de Columna :", xRight + 2, yPos + 3.3);

  const ejeLabelW = 28;
  const ejeOptW = (halfW - ejeLabelW) / 3;
  // Calcular variables para 5.2 antes de usarlas
  const desvLabelW = 52;
  const xDesvLabelEnd = xRight + desvLabelW;
  const desvOptW = (halfW - desvLabelW) / 2;

  // Líneas verticales internas (5.1) - empiezan después de la fila 1
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(xLeft + ejeLabelW, yPos + rowH, xLeft + ejeLabelW, yPos + rowH * 5);
  doc.line(xLeft + ejeLabelW + ejeOptW, yPos + rowH, xLeft + ejeLabelW + ejeOptW, yPos + rowH * 5);
  doc.line(xLeft + ejeLabelW + ejeOptW * 2, yPos + rowH, xLeft + ejeLabelW + ejeOptW * 2, yPos + rowH * 5);
  // Líneas verticales internas (5.2) - empiezan después de la fila 1
  doc.line(xDesvLabelEnd, yPos + rowH, xDesvLabelEnd, yPos + rowH * 5);
  doc.line(xDesvLabelEnd + desvOptW, yPos + rowH, xDesvLabelEnd + desvOptW, yPos + rowH * 5);

  // Filas de data (4 filas: después de cada fila de datos)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  for (let i = 0; i < 3; i++) {
    doc.line(tablaInicioX, yPos + rowH * (2 + i), tablaInicioX + tablaAncho, yPos + rowH * (2 + i));
  }
  // La línea inferior del rectángulo exterior (yPos + rowH * 5) ya está dibujada por el rectángulo

  const filasEje = [
    { label: "Cervical :", n: datos.columaVertebralEjeCervicalNormal, d: datos.columaVertebralEjeCervicalDerecha, i: datos.columaVertebralEjeCervicalIzquierda },
    { label: "Dorsal :", n: datos.columaVertebralEjeDorsalNormal, d: datos.columaVertebralEjeDorsalDerecha, i: datos.columaVertebralEjeDorsalIzquierda },
    { label: "Lumbar :", n: datos.columaVertebralEjeLumbarNormal, d: datos.columaVertebralEjeLumbarDerecha, i: datos.columaVertebralEjeLumbarIzquierda }
  ];

  const filasDesv = [
    { label: "Cifosis :", si: datos.columaVertebralDesviacionCifosisSi, no: datos.columaVertebralDesviacionCifosisNo },
    { label: "Escoliosis :", si: datos.columaVertebralDesviacionEscoliosisSi, no: datos.columaVertebralDesviacionEscoliosisNo },
    { label: "Lordosis :", si: datos.columaVertebralDesviacionLordosisSi, no: datos.columaVertebralDesviacionLordosisNo },
    { label: "Mixta :", si: datos.columaVertebralDesviacionMixtaSi, no: datos.columaVertebralDesviacionMixtaNo }
  ];

  filasEje.forEach((fila, idx) => {
    const yRowTop = yPos + rowH * (1 + idx);
    const yTexto = yRowTop + rowH / 2 + 1.2;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(fila.label, xLeft + 2, yTexto);
    // Mostrar texto con paréntesis: "Normal ( X )" o "Normal (  )"
    const textoNormal = fila.n === true ? "Normal ( X )" : "Normal (  )";
    const textoDerecha = fila.d === true ? "Derecha ( X )" : "Derecha (  )";
    const textoIzquierda = fila.i === true ? "Concavidad Izq. ( X )" : "Concavidad Izq. (  )";
    dibujarTextoConXAzul(doc, textoNormal, xLeft + ejeLabelW + ejeOptW / 2, yTexto, { align: "center" });
    dibujarTextoConXAzul(doc, textoDerecha, xLeft + ejeLabelW + ejeOptW * 1.5, yTexto, { align: "center" });
    dibujarTextoConXAzul(doc, textoIzquierda, xLeft + ejeLabelW + ejeOptW * 2.5, yTexto, { align: "center" });
  });

  filasDesv.forEach((fila, idx) => {
    const yRowTop = yPos + rowH * (1 + idx);
    const yTexto = yRowTop + rowH / 2 + 1.2;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(fila.label, xRight + 2, yTexto);
    // Mostrar texto con paréntesis: "SI ( X )" o "SI (  )"
    const textoSI = fila.si === true ? "SI ( X )" : "SI (  )";
    const textoNO = fila.no === true ? "NO ( X )" : "NO (  )";
    dibujarTextoConXAzul(doc, textoSI, xDesvLabelEnd + desvOptW / 2, yTexto, { align: "center" });
    dibujarTextoConXAzul(doc, textoNO, xDesvLabelEnd + desvOptW * 1.5, yTexto, { align: "center" });
  });

  yPos += rowH * 5;

  // Bloque 5.3 / 5.4 (4 filas: títulos + 3 filas data, sin headers)
  await verificarSaltoPagina(rowH * 4);
  
  // PRIMERO: Dibujar fondo gris de la fila 1
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, rowH, 'F');
  
  // DESPUÉS: Dibujar todas las líneas (horizontales y verticales)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  // Rectángulo exterior
  doc.rect(tablaInicioX, yPos, tablaAncho, rowH * 4, 'S'); // 'S' = Stroke only
  // Líneas horizontales
  doc.line(tablaInicioX, yPos + rowH, tablaInicioX + tablaAncho, yPos + rowH);
  doc.line(tablaInicioX, yPos + rowH * 2, tablaInicioX + tablaAncho, yPos + rowH * 2);
  doc.line(tablaInicioX, yPos + rowH * 3, tablaInicioX + tablaAncho, yPos + rowH * 3);
  // Línea vertical divisoria (empieza después de la fila 1, no pasa por ella porque ahí va texto)
  doc.line(xRight, yPos + rowH, xRight, yPos + rowH * 4);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("5.3. Palpación :      DOLOR", xLeft + 2, yPos + 3.3);
  doc.text("5.4. Exploración :      Signo de Lasague", xRight + 2, yPos + 3.3);

  // Líneas verticales empiezan después de la fila 1 (sin divisiones en la fila de títulos)
  const palLabelW = 42;
  const palOptW = (halfW - palLabelW) / 2;
  const palXLabelEnd = xLeft + palLabelW;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(palXLabelEnd, yPos + rowH, palXLabelEnd, yPos + rowH * 4);
  doc.line(palXLabelEnd + palOptW, yPos + rowH, palXLabelEnd + palOptW, yPos + rowH * 4);

  const lasLabelW = 52;
  const lasOptW = (halfW - lasLabelW) / 2;
  const lasXLabelEnd = xRight + lasLabelW;
  doc.line(lasXLabelEnd, yPos + rowH, lasXLabelEnd, yPos + rowH * 4);
  doc.line(lasXLabelEnd + lasOptW, yPos + rowH, lasXLabelEnd + lasOptW, yPos + rowH * 4);

  // Palpación rows
  const palpRows = [
    { label: "Cervical :", si: datos.columaVertebralPalpacionCervicalSi, no: datos.columaVertebralPalpacionCervicalNo },
    { label: "Dorsal :", si: datos.columaVertebralPalpacionDorsalSi, no: datos.columaVertebralPalpacionDorsalNo },
    { label: "Lumbar :", si: datos.columaVertebralPalpacionLumbarSi, no: datos.columaVertebralPalpacionLumbarNo }
  ];
  palpRows.forEach((fila, idx) => {
    const yRowTop = yPos + rowH * (1 + idx);
    const yTexto = yRowTop + rowH / 2 + 1.2;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(fila.label, xLeft + 2, yTexto);
    // Mostrar texto con paréntesis: "SI ( X )" o "SI (  )"
    const textoSI = fila.si === true ? "SI ( X )" : "SI (  )";
    const textoNO = fila.no === true ? "NO ( X )" : "NO (  )";
    dibujarTextoConXAzul(doc, textoSI, palXLabelEnd + palOptW / 2, yTexto, { align: "center" });
    dibujarTextoConXAzul(doc, textoNO, palXLabelEnd + palOptW * 1.5, yTexto, { align: "center" });
  });

  // Lasague rows (2 filas) - alineadas con las últimas 2 filas de Palpación
  const lasRows = [
    { label: "Derecho :", si: datos.columaVertebralExploracionLesagueDerechoSi, no: datos.columaVertebralExploracionLesagueDerechoNo },
    { label: "Izquierdo :", si: datos.columaVertebralExploracionLesagueIzquierdoSi, no: datos.columaVertebralExploracionLesagueIzquierdoNo }
  ];
  lasRows.forEach((fila, idx) => {
    const yRowTop = yPos + rowH * (1 + idx); // Empezar después de la fila 1
    const yTexto = yRowTop + rowH / 2 + 1.2;
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(fila.label, xRight + 2, yTexto);
    // Mostrar texto con paréntesis: "SI ( X )" o "SI (  )"
    const textoSI = fila.si === true ? "SI ( X )" : "SI (  )";
    const textoNO = fila.no === true ? "NO ( X )" : "NO (  )";
    dibujarTextoConXAzul(doc, textoSI, lasXLabelEnd + lasOptW / 2, yTexto, { align: "center" });
    dibujarTextoConXAzul(doc, textoNO, lasXLabelEnd + lasOptW * 1.5, yTexto, { align: "center" });
  });

  yPos += rowH * 4;

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

  // Anchos fijos para las celdas de SI/NO (con paréntesis)
  const anchoCeldaSINO = 18; // Ancho suficiente para "SI ( X )" o "NO ( X )"
  
  // Calcular posiciones desde la derecha (pegadas al final)
  const xNO = tablaInicioX + tablaAncho - anchoCeldaSINO; // Última celda al final
  const xSI = xNO - anchoCeldaSINO;
  
  // Labels
  doc.setFont("helvetica", "normal").setFontSize(7);
  const labelTratamiento = "X. Tratamiento :";
  const labelConclusiones = "XI. Conclusiones Asintomático :";
  
  const xLabel = tablaInicioX;
  
  // === X. TRATAMIENTO ===
  await verificarSaltoPagina(filaAltura);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  
  // Líneas verticales para celdas (solo 2 celdas: SI y NO)
  doc.line(xSI, yPos, xSI, yPos + filaAltura);
  doc.line(xNO, yPos, xNO, yPos + filaAltura);
  
  const yCentroTrat = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(labelTratamiento, xLabel + 2, yCentroTrat);
  const textoSITrat = datos.tratamientoSi === true ? "SI ( X )" : "SI (  )";
  const textoNOTrat = datos.tratamientoNo === true ? "NO ( X )" : "NO (  )";
  dibujarTextoConXAzul(doc, textoSITrat, xSI + anchoCeldaSINO / 2, yCentroTrat, { align: "center" });
  dibujarTextoConXAzul(doc, textoNOTrat, xNO + anchoCeldaSINO / 2, yCentroTrat, { align: "center" });
  yPos += filaAltura;

  // === XI. CONCLUSIONES ASINTOMÁTICO ===
  await verificarSaltoPagina(filaAltura);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  
  // Líneas verticales para celdas (mismas posiciones)
  doc.line(xSI, yPos, xSI, yPos + filaAltura);
  doc.line(xNO, yPos, xNO, yPos + filaAltura);
  
  const yCentroCon = yPos + filaAltura / 2 + 1.2;
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(labelConclusiones, xLabel + 2, yCentroCon);
  const textoSICon = datos.conclusionAsintomaticoSi === true ? "SI ( X )" : "SI (  )";
  const textoNOCon = datos.conclusionAsintomaticoNo === true ? "NO ( X )" : "NO (  )";
  dibujarTextoConXAzul(doc, textoSICon, xSI + anchoCeldaSINO / 2, yCentroCon, { align: "center" });
  dibujarTextoConXAzul(doc, textoNOCon, xNO + anchoCeldaSINO / 2, yCentroCon, { align: "center" });
  yPos += filaAltura;

  // === FIRMAS (Paciente + Médico) ===
  const alturaSeccionFirma = 30;
  await verificarSaltoPagina(alturaSeccionFirma + 8);
  // Sin celdas/rectángulo, solo dibujar las firmas
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
