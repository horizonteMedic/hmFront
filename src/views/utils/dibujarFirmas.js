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
 * @returns {Promise<number>} - Retorna la posición Y final después de dibujar las firmas
 */
export async function dibujarFirmas({ doc, datos, y, pageW }) {
  // Cargar imágenes de digitalizaciones
  const firmap = await getSignCompressed(datos, "FIRMAP");
  const huellap = await getSignCompressed(datos, "HUELLA");
  const s1 = await getSignCompressed(datos, "SELLOFIRMA");
  const s2 = await getSignCompressed(datos, "SELLOFIRMADOCASIG");


  // Verificar qué firmas tenemos
  const tieneFirmaPaciente = firmap !== null || huellap !== null;
  const tieneSelloProfesional = s1 !== null || s2 !== null;

  // Firma y Huella del Paciente
  const firmaPacienteY = y;
  // Si hay sello profesional Y paciente, paciente a la izquierda (1/3), si no, centrado
  const centroPacienteX = (tieneSelloProfesional && tieneFirmaPaciente) ? pageW / 3 : pageW / 2;

  // Agregar firma del paciente (ya viene comprimida como data URL)
  if (firmap) {
    try {
      const imgWidth = 30;
      const imgHeight = 20;
      const x = centroPacienteX - 22;
      const yPos = firmaPacienteY;
      doc.addImage(firmap, 'JPEG', x, yPos, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del paciente:", error);
    }
  }

  // Agregar huella del paciente (ya viene comprimida como data URL)
  if (huellap) {
    try {
      const imgWidth = 12;
      const imgHeight = 20;
      const x = centroPacienteX + 10;
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
      } else if (tipoSello === 'SELLOFIRMADOCASIG') {
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

    // Contar sellos disponibles
    const sellos = [];
    if (s1) sellos.push({ data: s1, tipo: 'SELLOFIRMA' });
    if (s2) sellos.push({ data: s2, tipo: 'SELLOFIRMADOCASIG' });
    const numSellos = sellos.length;

    if (numSellos === 0) {
      // No hay sellos, no hacer nada
    } else {
      // Calcular espacio disponible
      const margin = 10; // Margen lateral
      let espacioDisponible;
      let startX;

      if (tieneFirmaPaciente) {
        // Paciente a la izquierda, sellos a la derecha
        // Paciente ocupa aproximadamente hasta pageW/3 + 20mm
        const finPaciente = pageW / 3 + 20;
        startX = finPaciente + 5; // 5mm de separación
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
        // Dos sellos: gap fijo de 15mm, tamaño estándar, centrados
        sigW = 48;
        sigH = 20;
        gap = 15;
      } else {
        // Múltiples sellos (3+): ajustar tamaño y gap para que quepan
        const gapMin = 8; // Gap mínimo
        const sigWMax = 45; // Ancho máximo por sello
        const sigWMin = 35; // Ancho mínimo por sello
        
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

