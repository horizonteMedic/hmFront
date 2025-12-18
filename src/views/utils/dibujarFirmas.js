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
export function dibujarFirmas({ doc, datos, y, pageW }) {
  // Cargar imágenes de digitalizaciones
  const digitalizacion = datos.digitalizacion || [];
  const firmaPaciente = digitalizacion.find(d => d.nombreDigitalizacion === "FIRMAP");
  const huellaPaciente = digitalizacion.find(d => d.nombreDigitalizacion === "HUELLA");
  const sello1 = digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const sello2 = digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMADOCASIG");
  const isValidUrl = url => url && url !== "Sin registro";

  // Función mejorada para cargar y comprimir imágenes
  const loadImg = src =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Comprimir imagen antes de retornarla
        const canvas = document.createElement('canvas');
        const maxWidth = 800;
        let width = img.width;
        let height = img.height;

        // Redimensionar si es muy grande
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Rellenar fondo blanco
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a data URL comprimido (JPEG 60% calidad)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        res(compressedDataUrl);
      };
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });

  return Promise.all([
    isValidUrl(firmaPaciente?.url) ? loadImg(firmaPaciente.url) : Promise.resolve(null),
    isValidUrl(huellaPaciente?.url) ? loadImg(huellaPaciente.url) : Promise.resolve(null),
    isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
    isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
  ]).then(([firmap, huellap, s1, s2]) => {
    // Verificar si hay sello del profesional para decidir el layout
    const tieneSelloProfesional = s1 !== null || s2 !== null;

    // Firma y Huella del Paciente
    const firmaPacienteY = y;
    // Si hay sello profesional, paciente a la izquierda (1/3), si no, centrado
    const centroPacienteX = tieneSelloProfesional ? pageW / 3 : pageW / 2;

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

    // Línea y texto debajo de firma y huella del paciente
    const lineYPaciente = firmaPacienteY + 23;
    const textoPaciente = "Firma y Huella del Paciente";
    const textoPacienteWidth = doc.getTextWidth(textoPaciente);
    doc.setLineWidth(0.2);
    doc.line(centroPacienteX - textoPacienteWidth / 2, lineYPaciente, centroPacienteX + textoPacienteWidth / 2, lineYPaciente);
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(textoPaciente, centroPacienteX, lineYPaciente + 5, { align: "center" });

    // Firma y Sello del Profesional (solo si existe)
    let lineY = 0;

    if (tieneSelloProfesional) {
      const sigW = 48;
      const sigH = 20;
      const sigY = y;
      const gap = 16;
      lineY = sigY + sigH + 3;

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

        // Dibujar texto (más cerca de la firma)
        doc.setFont('helvetica', 'normal').setFontSize(9);
        doc.text(texto1, centroX, lineY + 3, { align: "center" });
        if (texto2) {
          doc.text(texto2, centroX, lineY + 6, { align: "center" });
        }
      };

      // Posición para los sellos del profesional (lado derecho - 2/3 de la página, más cerca del centro)
      const centroProfesionalX = (pageW / 3) * 2;

      if (s1 && s2) {
        // Dos sellos lado a lado
        const totalWidth = sigW * 2 + gap;
        const startX = centroProfesionalX - totalWidth / 2;

        agregarSello(s1, startX, sigY, sigW, sigH);
        agregarSello(s2, startX + sigW + gap, sigY, sigW, sigH);

        const centroSello1X = startX + sigW / 2;
        const centroSello2X = startX + sigW + gap + sigW / 2;
        dibujarLineaYTexto(centroSello1X, lineY, 'SELLOFIRMA');
        dibujarLineaYTexto(centroSello2X, lineY, 'SELLOFIRMADOCASIG');
      } else if (s1) {
        // Un solo sello centrado
        const imgX = centroProfesionalX - sigW / 2;
        agregarSello(s1, imgX, sigY, sigW, sigH);
        dibujarLineaYTexto(centroProfesionalX, lineY, 'SELLOFIRMA');
      } else if (s2) {
        // Un solo sello centrado
        const imgX = centroProfesionalX - sigW / 2;
        agregarSello(s2, imgX, sigY, sigW, sigH);
        dibujarLineaYTexto(centroProfesionalX, lineY, 'SELLOFIRMADOCASIG');
      }
    }

    // Retornar posición Y final (ajustado para texto más junto)
    return tieneSelloProfesional
      ? Math.max(lineYPaciente + 10, lineY + 9)
      : lineYPaciente + 10;
  });
}

