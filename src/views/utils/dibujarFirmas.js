import { getSignCompressed } from "./helpers";

/**
 * Helper para dibujar firmas y sellos en documentos PDF
 * Maneja la carga de imágenes y el dibujo de firmas del paciente y profesional
 * 
 * @param {Object} params - Parámetros de configuración
 * @param {Object} params.doc - Instancia de jsPDF
 * @param {Object} params.datos - Objeto con datos del paciente, debe incluir digitalizacion[]
 * @param {number} params.y - Posición Y inicial donde comenzar a dibujar las firmas
 * @param {number} params.pageW - Ancho de la página en mm
 * @param {boolean} params.mostrarFirmaPaciente - Si es true, muestra firma y huella del paciente (default: true)
 * @returns {Promise<number>} - Retorna la posición Y final después de dibujar las firmas
 */
export async function dibujarFirmas({ doc, datos, y, pageW, mostrarFirmaPaciente = true }) {
  // Cargar imágenes de digitalizaciones
  const firmap = await getSignCompressed(datos, "FIRMAP");
  const huellap = await getSignCompressed(datos, "HUELLA");
  const s1 = await getSignCompressed(datos, "SELLOFIRMA");
  const s2 = await getSignCompressed(datos, "SELLOFIRMADOCASIG");
  const s3 = await getSignCompressed(datos, "SELLOFIRMADOCASIG-EXTRA");


  // Verificar qué firmas tenemos
  const tieneFirmaPaciente = mostrarFirmaPaciente && ((firmap !== null && firmap !== "") || (huellap !== null & huellap !== ""));
  const tieneSelloProfesional = (s1 !== null && s1 !== "") || (s2 !== null & s2 !== "") || (s3 !== null & s3 !== "");

  // Contar sellos disponibles
  const sellos = [];
  if (s1) sellos.push({ data: s1, tipo: 'SELLOFIRMA' });
  if (s2) sellos.push({ data: s2, tipo: 'SELLOFIRMADOCASIG' });
  if (s3) sellos.push({ data: s3, tipo: 'SELLOFIRMADOCASIG-EXTRA' });
  const numSellos = sellos.length;

  // Verificar casos especiales de distribución en columnas iguales
  const tiene4Firmas = tieneFirmaPaciente && numSellos === 3;
  const tiene2Firmas = tieneFirmaPaciente && numSellos === 1;
  const tiene3Firmas = tieneFirmaPaciente && numSellos === 2;
  const tiene1Firma = (tieneFirmaPaciente && numSellos === 0) || (!tieneFirmaPaciente && numSellos === 1);

  // Firma y Huella del Paciente (solo si mostrarFirmaPaciente es true)
  const firmaPacienteY = y;
  
  // Calcular posición del paciente según el número de firmas
  let centroPacienteX;
  if (tiene4Firmas) {
    // Columna 1 de 4 (centro de la primera columna)
    centroPacienteX = pageW / 8; // pageW / 4 / 2 = pageW / 8
  } else if (tiene3Firmas) {
    // Columna 1 de 3 (centro de la primera columna)
    centroPacienteX = pageW / 6; // pageW / 3 / 2 = pageW / 6
  } else if (tiene2Firmas) {
    // Columna 1 de 2 (centro de la primera columna)
    centroPacienteX = pageW / 4; // pageW / 2 / 2 = pageW / 4
  } else if (tiene1Firma) {
    // Solo 1 firma, centrado
    centroPacienteX = pageW / 2;
  } else if (tieneSelloProfesional && tieneFirmaPaciente) {
    // Distribución normal: paciente a la izquierda
    centroPacienteX = pageW / 4;
  } else {
    // Sin sellos, centrado
    centroPacienteX = pageW / 2;
  }

  // Agregar firma del paciente (ya viene comprimida como data URL)
  if (mostrarFirmaPaciente && firmap) {
    try {
      const imgWidth = 30;
      const imgHeight = 20;
      // Si hay distribución en columnas, centrar mejor en la columna
      const x = (tiene4Firmas || tiene3Firmas || tiene2Firmas) ? centroPacienteX - imgWidth / 2 : centroPacienteX - 22;
      const yPos = firmaPacienteY;
      doc.addImage(firmap, 'JPEG', x, yPos, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del paciente:", error);
    }
  }

  // Agregar huella del paciente (ya viene comprimida como data URL)
  if (mostrarFirmaPaciente && huellap) {
    try {
      const imgWidth = 12;
      const imgHeight = 20;
      // Si hay distribución en columnas, posicionar la huella justo después de la firma, centrado en la columna
      const x = (tiene4Firmas || tiene3Firmas || tiene2Firmas) ? centroPacienteX + 15 : centroPacienteX + 10;
      const yPos = firmaPacienteY;
      doc.addImage(huellap, 'JPEG', x, yPos, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando huella del paciente:", error);
    }
  }


  // Línea y texto debajo de firma y huella del paciente (solo si hay firma o huella)
  if (tieneFirmaPaciente) {
    const lineYPaciente = firmaPacienteY + 23;
    const textoPaciente = "Firma y Huella del Paciente";
    const textoPacienteWidth = doc.getTextWidth(textoPaciente);
    doc.setLineWidth(0.2);
    doc.line(centroPacienteX - textoPacienteWidth / 2, lineYPaciente, centroPacienteX + textoPacienteWidth / 2, lineYPaciente);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(textoPaciente, centroPacienteX, lineYPaciente + 5, { align: "center" });
  }

  // Firma y Sello del Profesional (solo si existe)
  let lineY = 0;

  if (tieneSelloProfesional) {
    const sigY = y;
    lineY = sigY + 20 + 1; // Línea más cerca de la firma

    // Función auxiliar para agregar sello al PDF (ya viene comprimido como data URL)
    const agregarSello = (dataUrl, xPos, yPos, width, height) => {
      if (!dataUrl) return;
      doc.addImage(dataUrl, 'JPEG', xPos, yPos, width, height);
    };

    // Función auxiliar para dibujar línea y texto debajo del sello
    const dibujarLineaYTexto = (centroX, lineY, tipoSello) => {
      doc.setLineWidth(0.2);
      let texto1, texto2;
      if (tipoSello === 'SELLOFIRMA') {
        // SELLOFIRMA: Firma y Sello del Profesional / Responsable de la Evaluación
        texto1 = "Firma y Sello del Profesional";
        texto2 = "Responsable de la Evaluación";
      } else if (tipoSello === 'SELLOFIRMADOCASIG' || tipoSello == "SELLOFIRMADOCASIG-EXTRA") {
        // SELLOFIRMADOCASIG: Firma y Sello Médico Asignado
        texto1 = "Firma y Sello Médico Asignado";
        texto2 = null;
      } else {
        texto1 = "Firma y Sello";
        texto2 = null;
      }

      // Calcular ancho del texto más largo para la línea
      const textoWidth = doc.getTextWidth(texto1);
      const anchoLinea = Math.max(textoWidth, texto2 ? doc.getTextWidth(texto2) : 0);

      // Dibujar línea
      doc.line(centroX - anchoLinea / 2, lineY, centroX + anchoLinea / 2, lineY);

      // Dibujar texto (con más espacio después de la línea)
      doc.setFont('helvetica', 'normal').setFontSize(7);
      doc.text(texto1, centroX, lineY + 2.5, { align: "center" });
      if (texto2) {
        doc.text(texto2, centroX, lineY + 4.5, { align: "center" });
      }
    };

    if (numSellos === 0) {
      // No hay sellos, no hacer nada
    } else if (tiene4Firmas) {
      // CASO ESPECIAL: 4 firmas (paciente + 3 sellos) - Distribuir en 4 columnas iguales
      const anchoColumna = pageW / 4;
      const sigW = 40;
      const sigH = 20;
      
      // Dibujar sellos en columnas 2, 3 y 4
      sellos.forEach((sello, index) => {
        // Columna 2, 3, 4 (index 0, 1, 2 de sellos)
        const columnaIndex = index + 1; // Columna 2, 3, 4
        const centroColumnaX = (columnaIndex + 0.5) * anchoColumna; // Centro de cada columna
        const xPos = centroColumnaX - sigW / 2; // Centrar el sello en la columna
        
        agregarSello(sello.data, xPos, sigY, sigW, sigH);
        dibujarLineaYTexto(centroColumnaX, lineY, sello.tipo);
      });
    } else if (tiene3Firmas) {
      // CASO ESPECIAL: 3 firmas (paciente + 2 sellos) - Distribuir en 3 columnas iguales
      const anchoColumna = pageW / 3;
      const sigW = 42;
      const sigH = 20;
      
      // Dibujar sellos en columnas 2 y 3
      sellos.forEach((sello, index) => {
        // Columna 2, 3 (index 0, 1 de sellos)
        const columnaIndex = index + 1; // Columna 2, 3
        const centroColumnaX = (columnaIndex + 0.5) * anchoColumna; // Centro de cada columna
        const xPos = centroColumnaX - sigW / 2; // Centrar el sello en la columna
        
        agregarSello(sello.data, xPos, sigY, sigW, sigH);
        dibujarLineaYTexto(centroColumnaX, lineY, sello.tipo);
      });
    } else if (tiene2Firmas) {
      // CASO ESPECIAL: 2 firmas (paciente + 1 sello) - Distribuir en 2 columnas iguales
      const anchoColumna = pageW / 2;
      const sigW = 45;
      const sigH = 20;
      
      // Dibujar sello en columna 2
      sellos.forEach((sello) => {
        // Columna 2 (centro de la segunda columna)
        const centroColumnaX = 1.5 * anchoColumna; // Centro de la columna 2
        const xPos = centroColumnaX - sigW / 2; // Centrar el sello en la columna
        
        agregarSello(sello.data, xPos, sigY, sigW, sigH);
        dibujarLineaYTexto(centroColumnaX, lineY, sello.tipo);
      });
    } else if (tiene1Firma && !tieneFirmaPaciente) {
      // CASO ESPECIAL: Solo 1 sello (sin paciente) - Centrado
      const sigW = 48;
      const sigH = 20;
      const centroX = pageW / 2;
      const xPos = centroX - sigW / 2;
      
      sellos.forEach((sello) => {
        agregarSello(sello.data, xPos, sigY, sigW, sigH);
        dibujarLineaYTexto(centroX, lineY, sello.tipo);
      });
    } else {
      // Distribución normal (no 4 firmas)
      // Calcular espacio disponible
      const margin = 10; // Margen lateral
      let espacioDisponible;
      let startX;

      if (tieneFirmaPaciente) {
        // Paciente a la izquierda, sellos a la derecha
        // Calcular el espacio que ocupa el paciente (firma + huella + margen)
        const anchoPaciente = 30 + 12 + 10; // firma + huella + espacio
        const finPaciente = centroPacienteX + anchoPaciente / 2;
        startX = finPaciente + 10; // 10mm de separación (aumentado para mejor espaciado)
        espacioDisponible = pageW - startX - margin;
      } else {
        // Sin paciente, centrar sellos
        espacioDisponible = pageW - 2 * margin;
        startX = margin;
      }

      // Calcular tamaño y gap dinámicamente
      let sigW, sigH, gap;
      if (numSellos === 1) {
        // Un solo sello: usar tamaño estándar pero asegurar que quepa
        sigW = Math.min(48, espacioDisponible - 10);
        sigH = 20;
        gap = 0;
      } else if (numSellos === 2) {
        // Dos sellos: gap fijo de 12mm, tamaño estándar, centrados
        sigW = 45;
        sigH = 20;
        gap = 12;
      } else if (numSellos === 3) {
        // Tres sellos: ajustar para que quepan bien
        const gapMin = 6; // Gap mínimo para 3 sellos
        const sigWMax = 40; // Ancho máximo por sello
        const sigWMin = 32; // Ancho mínimo por sello
        
        const anchoTotalNecesario = 3 * sigWMax + 2 * gapMin;
        if (anchoTotalNecesario <= espacioDisponible) {
          sigW = sigWMax;
          gap = gapMin;
        } else {
          const espacioParaSellos = espacioDisponible - 2 * gapMin;
          sigW = Math.max(sigWMin, Math.floor(espacioParaSellos / 3));
          gap = gapMin;
          
          if (sigW * 3 + gap * 2 > espacioDisponible) {
            const espacioRestante = espacioDisponible - sigW * 3;
            gap = Math.max(4, Math.floor(espacioRestante / 2));
          }
        }
        sigH = 20;
      } else {
        // Múltiples sellos (4+): ajustar tamaño y gap para que quepan
        const gapMin = 5; // Gap mínimo para 4+ sellos
        const sigWMax = 38; // Ancho máximo por sello
        const sigWMin = 30; // Ancho mínimo por sello

        // Calcular ancho total necesario
        const anchoTotalNecesario = numSellos * sigWMax + (numSellos - 1) * gapMin;

        if (anchoTotalNecesario <= espacioDisponible) {
          // Cabe con tamaño máximo
          sigW = sigWMax;
          gap = gapMin;
        } else {
          // Reducir tamaño y/o gap
          const espacioParaSellos = espacioDisponible - (numSellos - 1) * gapMin;
          sigW = Math.max(sigWMin, Math.floor(espacioParaSellos / numSellos));
          gap = gapMin;

          // Si aún no cabe, reducir gap también
          if (sigW * numSellos + gap * (numSellos - 1) > espacioDisponible) {
            const espacioRestante = espacioDisponible - sigW * numSellos;
            gap = Math.max(4, Math.floor(espacioRestante / (numSellos - 1)));
          }
        }
        sigH = 20;
      }

      // Centrar los sellos
      if (numSellos === 1) {
        // Un solo sello centrado
        if (tieneFirmaPaciente) {
          const centroProfesionalX = startX + espacioDisponible / 2;
          startX = centroProfesionalX - sigW / 2;
        } else {
          startX = (pageW - sigW) / 2;
        }
      } else {
        // Múltiples sellos: centrar el grupo
        const totalWidth = sigW * numSellos + gap * (numSellos - 1);
        if (tieneFirmaPaciente) {
          const centroProfesionalX = startX + espacioDisponible / 2;
          startX = centroProfesionalX - totalWidth / 2;
        } else {
          startX = (pageW - totalWidth) / 2;
        }
      }

      // Dibujar sellos
      sellos.forEach((sello, index) => {
        const xPos = startX + index * (sigW + gap);
        agregarSello(sello.data, xPos, sigY, sigW, sigH);

        const centroSelloX = xPos + sigW / 2;
        dibujarLineaYTexto(centroSelloX, lineY, sello.tipo);
      });
    }
  }

  // Retornar posición Y final (ajustado para texto más junto)
  const lineYPaciente = tieneFirmaPaciente ? firmaPacienteY + 23 : 0;
  if (tieneSelloProfesional) {
    return tieneFirmaPaciente
      ? Math.max(lineYPaciente + 10, lineY + 9)
      : lineY + 9;
  } else {
    return tieneFirmaPaciente ? lineYPaciente + 10 : y + 10;
  }

}

