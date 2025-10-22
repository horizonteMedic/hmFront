/**
 * Utilidades para manejar texto con saltos de línea en filas crecientes de PDF
 * Incluye funciones para procesar texto numerado y calcular alturas dinámicas
 */

/**
 * Función básica para texto con salto de línea por palabras
 * @param {Object} doc - Instancia de jsPDF
 * @param {string} texto - Texto a procesar
 * @param {number} x - Posición X inicial
 * @param {number} y - Posición Y inicial
 * @param {number} anchoMaximo - Ancho máximo permitido
 * @returns {number} Nueva posición Y final
 */
export const dibujarTextoConSaltoLinea = (doc, texto, x, y, anchoMaximo) => {
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

/**
 * Función para procesar texto con saltos de línea numerados
 * @param {string} texto - Texto a procesar
 * @returns {Array} Array de líneas procesadas
 */
export const procesarTextoConSaltosLinea = (texto) => {
  if (!texto) return [];
  
  // Dividir por saltos de línea reales (\n, \r\n) y otros separadores
  const partes = texto.split(/\r\n|\r|\n|\\n|\/n/g);
  
  // Procesar cada parte y mantener el formato original
  return partes
    .map(parte => parte.trim())
    .filter(parte => parte.length > 0);
};

/**
 * Función mejorada para manejar textos con saltos de línea numerados
 * @param {Object} doc - Instancia de jsPDF
 * @param {string} texto - Texto a procesar
 * @param {number} x - Posición X inicial
 * @param {number} y - Posición Y inicial
 * @param {number} anchoMaximo - Ancho máximo permitido
 * @returns {number} Nueva posición Y final
 */
export const dibujarTextoConSaltosLinea = (doc, texto, x, y, anchoMaximo) => {
  const fontSize = doc.internal.getFontSize();
  let yPos = y;
  
  // Procesar el texto manteniendo el formato original
  const lineasProcesadas = procesarTextoConSaltosLinea(texto);
  
  lineasProcesadas.forEach((linea, index) => {
    // Verificar si es una línea numerada (empieza con número seguido de punto)
    const esLineaNumerada = /^\d+\./.test(linea);
    
    // Si la línea es muy larga, usar la función de salto de línea por palabras
    if (doc.getTextWidth(linea) > anchoMaximo) {
      yPos = dibujarTextoConSaltoLinea(doc, linea, x, yPos, anchoMaximo);
      
      // Espacio moderado después de una línea numerada que hizo salto
      if (esLineaNumerada) {
        yPos += fontSize * 0.25; // Espacio moderado después de línea numerada con salto
      }
      
      // Si hay una siguiente línea numerada, agregar espacio adicional moderado
      if (index < lineasProcesadas.length - 1) {
        const siguienteLinea = lineasProcesadas[index + 1];
        if (/^\d+\./.test(siguienteLinea)) {
          yPos += fontSize * 0.2; // Espacio moderado antes de la siguiente línea numerada
        }
      }
    } else {
      // Si la línea cabe, dibujarla directamente
      doc.text(linea, x, yPos);
      
      // Espaciado equilibrado para líneas numeradas
      if (esLineaNumerada) {
        yPos += fontSize * 0.4; // Espacio equilibrado para líneas numeradas
      } else {
        yPos += fontSize * 0.35; // Espacio normal
      }
    }
    
    // Espacio adicional entre líneas numeradas consecutivas (solo si no hizo salto)
    if (index < lineasProcesadas.length - 1 && doc.getTextWidth(linea) <= anchoMaximo) {
      const siguienteLinea = lineasProcesadas[index + 1];
      if (esLineaNumerada && /^\d+\./.test(siguienteLinea)) {
        yPos += fontSize * 0.15; // Espacio moderado entre líneas numeradas
      }
    }
  });
  
  return yPos;
};

/**
 * Función para calcular la altura necesaria de una fila sin dibujar el texto
 * @param {Object} doc - Instancia de jsPDF
 * @param {string} texto - Texto a analizar
 * @param {number} anchoMaximo - Ancho máximo permitido
 * @param {number} fontSize - Tamaño de fuente
 * @returns {number} Altura calculada en mm
 */
export const calcularAlturaTextoCreciente = (doc, texto, anchoMaximo, fontSize = 8) => {
  if (!texto) return 0;
  
  // Simular el texto para calcular altura sin dibujarlo
  const lineasProcesadas = procesarTextoConSaltosLinea(texto);
  let alturaSimulada = 0;
  
  lineasProcesadas.forEach((linea) => {
    const esLineaNumerada = /^\d+\./.test(linea);
    if (doc.getTextWidth(linea) > anchoMaximo) {
      // Si necesita salto de línea, calcular altura aproximada
      const palabras = linea.split(' ');
      let lineasNecesarias = 1;
      let lineaActual = '';
      
      palabras.forEach(palabra => {
        const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
        if (doc.getTextWidth(textoPrueba) > anchoMaximo) {
          lineasNecesarias++;
          lineaActual = palabra;
        } else {
          lineaActual = textoPrueba;
        }
      });
      
      alturaSimulada += lineasNecesarias * fontSize * 0.35;
      if (esLineaNumerada) alturaSimulada += fontSize * 0.25;
    } else {
      alturaSimulada += fontSize * 0.35;
      if (esLineaNumerada) alturaSimulada += fontSize * 0.05;
    }
  });
  
  return alturaSimulada;
};

/**
 * Función para crear una fila con altura dinámica basada en el contenido del texto
 * @param {Object} doc - Instancia de jsPDF
 * @param {string} texto - Texto a procesar
 * @param {number} tablaInicioX - Posición X inicial de la tabla
 * @param {number} tablaAncho - Ancho de la tabla
 * @param {number} yPos - Posición Y actual
 * @param {number} alturaMinima - Altura mínima de la fila en mm
 * @param {number} paddingSuperior - Padding superior en mm
 * @param {number} fontSize - Tamaño de fuente
 * @returns {Object} Objeto con nueva posición Y y altura de la fila
 */
export const crearFilaConAlturaDinamica = (doc, texto, tablaInicioX, tablaAncho, yPos, alturaMinima = 20, paddingSuperior = 4, fontSize = 8) => {
  // Calcular altura necesaria simulando el texto
  const alturaTextoUsada = calcularAlturaTextoCreciente(doc, texto, tablaAncho - 4, fontSize);
  const alturaFilaFinal = Math.max(alturaMinima, alturaTextoUsada + paddingSuperior + 2);

  // Dibujar la fila con la altura calculada
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaFinal);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaFinal);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaFinal, tablaInicioX + tablaAncho, yPos + alturaFilaFinal);

  return {
    nuevaYPos: yPos + alturaFilaFinal,
    alturaFila: alturaFilaFinal
  };
};

/**
 * Función completa para dibujar texto en una fila con altura dinámica
 * @param {Object} doc - Instancia de jsPDF
 * @param {string} texto - Texto a procesar
 * @param {number} tablaInicioX - Posición X inicial de la tabla
 * @param {number} tablaAncho - Ancho de la tabla
 * @param {number} yPos - Posición Y actual
 * @param {number} alturaMinima - Altura mínima de la fila en mm
 * @param {number} paddingSuperior - Padding superior en mm
 * @param {number} fontSize - Tamaño de fuente
 * @returns {number} Nueva posición Y final
 */
export const dibujarTextoEnFilaCreciente = (doc, texto, tablaInicioX, tablaAncho, yPos, alturaMinima = 20, paddingSuperior = 4, fontSize = 8) => {
  // Crear la fila con altura dinámica
  const { nuevaYPos } = crearFilaConAlturaDinamica(doc, texto, tablaInicioX, tablaAncho, yPos, alturaMinima, paddingSuperior, fontSize);
  
  // Dibujar el texto dentro de la fila
  doc.setFont("helvetica", "normal").setFontSize(fontSize);
  dibujarTextoConSaltosLinea(doc, texto, tablaInicioX + 2, yPos + paddingSuperior, tablaAncho - 4);
  
  return nuevaYPos;
};
