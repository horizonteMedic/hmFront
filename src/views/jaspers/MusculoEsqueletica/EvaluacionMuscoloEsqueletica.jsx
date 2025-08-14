import jsPDF from "jspdf";
import headerEvaluacionMuscoloEsqueletica from "./Headers/Header_EvaluacionMuscoloEsqueletica.jsx";

export default function EvaluacionMuscoloEsqueletica(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Datos de prueba para los campos de evaluación
  const datosPrueba = {
    // === SÍNTOMAS ===
    sintomas: {
      tieneSintomas: false, // true = SI, false = NO
      descripcion: "Dolor lumbar intermitente"
    },
    
    // === TIEMPO DE EXPERIENCIA ===
    tiempoExperiencia: "5 años",
    
    // === TÉCNICA DE LEVANTAMIENTO ===
    tecnicaLevantamiento: {
      adecuada: false // true = SI, false = NO
    },
    
    // === CAPACITACIÓN EN LEVANTAMIENTO ===
    capacitacionLevantamiento: {
      recibida: false // true = SI, false = NO
    },
    
    // === USO DE FAJA LUMBAR ===
    usoFajaLumbar: {
      utiliza: false // true = SI, false = NO
    },
    
    // === EXAMEN FÍSICO - CABEZA Y CUELLO ===
    examenFisico: {
      cabezaCuello: {
        extension: {
          texto: "45 grados",
          grado: "R" // N = Normal, R = Reducido, M = Marcado
        },
        flexion: {
          texto: "30 grados", 
          grado: "M" // N = Normal, R = Reducido, M = Marcado
        }
      },
      hombro: {
        flexion: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "N" }    // N = Normal, R = Reducido, M = Marcado
        },
        extension: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "N" }    // N = Normal, R = Reducido, M = Marcado
        },
        abduccion: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "N" }    // N = Normal, R = Reducido, M = Marcado
        },
        aduccion: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "N" }    // N = Normal, R = Reducido, M = Marcado
        },
        rotacionInterna: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "N" }    // N = Normal, R = Reducido, M = Marcado
        },
        rotacionExterna: {
          izquierda: { grado: "M" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "N" }    // N = Normal, R = Reducido, M = Marcado
        }
      }
    }
  };

  // Usar datos reales o datos de prueba
  const datosFinales = data && Object.keys(data).length > 0 ? data : datosPrueba;

  // === PÁGINA 1 ===
  // === 0) HEADER ===
  headerEvaluacionMuscoloEsqueletica(doc, data, true, 1);

  // === 1) Imagen de fondo para la evaluación músculo esquelética ===
  const fondoImg = "/img/EvaluacionMusculoEsqueletica_pag1.png";
  
  // Usar todo el ancho del documento pero no toda la altura
  const imgWidth = pageW; // Todo el ancho disponible
  const imgHeight = pageH * 0.842; // 83.5% de la altura para dejar espacio para ajustar

  // Posicionar desde abajo hacia arriba
  const xOffset = 0;
  const yOffset = pageH - imgHeight; // Posición original sin ajustes

  try {
    doc.addImage(fondoImg, "PNG", xOffset, yOffset, imgWidth, imgHeight);
  } catch (e) {
    doc.text("Imagen de evaluación músculo esquelética no disponible", margin, yOffset + 10);
  }

  // === 2) CAMPOS DE DATOS PERSONALIZABLES ===
  doc.setFont("helvetica", "bold").setFontSize(10);

  // === SECCIÓN: SÍNTOMAS ===
  const xSintomas = margin + 35.8; // Posición X para Síntomas
  const ySintomas = margin + 43.2; // Posición Y para Síntomas
  const xDescripcionSintomas = margin + 73; // Posición X para descripción
  const yDescripcionSintomas = margin + 43; // Posición Y para descripción
  
  if (datosFinales.sintomas && typeof datosFinales.sintomas.tieneSintomas === 'boolean') {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(11);
    
    // Marcar SI o NO según el valor
    if (datosFinales.sintomas.tieneSintomas) {
      doc.text("X", xSintomas, ySintomas); // X en SI
    } else {
      doc.text("X", xSintomas + 15.2, ySintomas); // X en NO
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro para la descripción
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(datosFinales.sintomas.descripcion || "", xDescripcionSintomas, yDescripcionSintomas, { maxWidth: 60 });
  }

  // === SECCIÓN: TIEMPO DE EXPERIENCIA ===
  const xTiempoExperiencia = margin + 38; // Posición X para tiempo de experiencia
  const yTiempoExperiencia = margin + 52.2; // Posición Y para tiempo de experiencia
  
  if (datosFinales.tiempoExperiencia) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(datosFinales.tiempoExperiencia, xTiempoExperiencia, yTiempoExperiencia);
  }

  // === SECCIÓN: TÉCNICA ADECUADA DE LEVANTAMIENTO ===
  const xTecnicaLevantamiento = margin + 83; // Posición X para técnica de levantamiento
  const yTecnicaLevantamiento = margin + 58.6; // Posición Y para técnica de levantamiento
  
  if (datosFinales.tecnicaLevantamiento && typeof datosFinales.tecnicaLevantamiento.adecuada === 'boolean') {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(10);
    
    if (datosFinales.tecnicaLevantamiento.adecuada) {
      doc.text("X", xTecnicaLevantamiento, yTecnicaLevantamiento); // X en SI
    } else {
      doc.text("X", xTecnicaLevantamiento + 15.2, yTecnicaLevantamiento); // X en NO
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: CAPACITACIÓN EN LEVANTAMIENTO ===
  const xCapacitacion = margin + 83; // Posición X para capacitación
  const yCapacitacion = margin + 64.4; // Posición Y para capacitación
  
  if (datosFinales.capacitacionLevantamiento && typeof datosFinales.capacitacionLevantamiento.recibida === 'boolean') {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(10);
    
    if (datosFinales.capacitacionLevantamiento.recibida) {
      doc.text("X", xCapacitacion, yCapacitacion); // X en SI
    } else {
      doc.text("X", xCapacitacion + 15.2, yCapacitacion); // X en NO
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: USO DE FAJA LUMBAR ===
  const xFajaLumbar = margin + 120.2; // Posición X para faja lumbar
  const yFajaLumbar = margin + 53.2; // Posición Y para faja lumbar
  
  if (datosFinales.usoFajaLumbar && typeof datosFinales.usoFajaLumbar.utiliza === 'boolean') {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(11);
    
    if (datosFinales.usoFajaLumbar.utiliza) {
      doc.text("X", xFajaLumbar, yFajaLumbar); // X en SI
    } else {
      doc.text("X", xFajaLumbar + 14.6, yFajaLumbar); // X en NO
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: EXAMEN FÍSICO - CABEZA Y CUELLO ===
  
  // Posiciones X individuales para cada elemento
  const xGradosN = margin + 109.6; // Posición X para grado N (Normal)
  const xGradosR = margin + 132.4; // Posición X para grado R (Reducido)
  const xGradosM = margin + 156.4; // Posición X para grado M (Marcado)
  const xTextoExtension = margin + 22; // Posición X para texto de extensión
  const xTextoFlexion = margin + 22; // Posición X para texto de flexión
  
  // Posiciones Y individuales para las X de cada grado
  const yExtensionN = margin + 87.8; // Posición Y para X de grado N en extensión
  const yExtensionR = margin + 87.8; // Posición Y para X de grado R en extensión
  const yExtensionM = margin + 87.8; // Posición Y para X de grado M en extensión
  const yFlexionN = margin + 93.5; // Posición Y para X de grado N en flexión
  const yFlexionR = margin + 93.5; // Posición Y para X de grado R en flexión
  const yFlexionM = margin + 93.5; // Posición Y para X de grado M en flexión
  
  // Datos de extensión
  const yExtension = margin + 87; // Posición Y para extensión
  
  if (datosFinales.examenFisico?.cabezaCuello?.extension) {
    const extension = datosFinales.examenFisico.cabezaCuello.extension;
    
    // Mostrar texto de extensión
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(extension.texto || "", xTextoExtension, yExtension);
    
    // Marcar X en el grado correspondiente
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(11);
    
    if (extension.grado === "N") {
      doc.text("X", xGradosN, yExtensionN); // X en N (Normal)
    } else if (extension.grado === "R") {
      doc.text("X", xGradosR, yExtensionR); // X en R (Reducido)
    } else if (extension.grado === "M") {
      doc.text("X", xGradosM, yExtensionM); // X en M (Marcado)
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos de flexión
  const yFlexion = margin + 92.5; // Posición Y para flexión
  
  if (datosFinales.examenFisico?.cabezaCuello?.flexion) {
    const flexion = datosFinales.examenFisico.cabezaCuello.flexion;
    
    // Mostrar texto de flexión
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(flexion.texto || "", xTextoFlexion, yFlexion);
    
    // Marcar X en el grado correspondiente
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(11);
    
    if (flexion.grado === "N") {
      doc.text("X", xGradosN, yFlexionN); // X en N (Normal)
    } else if (flexion.grado === "R") {
      doc.text("X", xGradosR, yFlexionR); // X en R (Reducido)
    } else if (flexion.grado === "M") {
      doc.text("X", xGradosM, yFlexionM); // X en M (Marcado)
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: MIEMBROS SUPERIORES - HOMBRO ===
  
  // Posiciones X individuales para cada lado del hombro
  // IZQUIERDA
  const xHombroIzquierdaN = margin + 109.6; // Posición X para grado N (Normal) - Izquierda
  const xHombroIzquierdaR = margin + 132.4; // Posición X para grado R (Reducido) - Izquierda
  const xHombroIzquierdaM = margin + 156.4; // Posición X para grado M (Marcado) - Izquierda
  
  // DERECHA
  const xHombroDerechaN = margin + 180; // Posición X para grado N (Normal) - Derecha
  const xHombroDerechaR = margin + 203; // Posición X para grado R (Reducido) - Derecha
  const xHombroDerechaM = margin + 227; // Posición X para grado M (Marcado) - Derecha
  
  // Posiciones Y individuales para cada lado del hombro
  const yHombroFlexionIzquierda = margin + 105; // Posición Y para flexión izquierda del hombro
  const yHombroFlexionDerecha = margin + 106; // Posición Y para flexión derecha del hombro
  const yHombroExtensionIzquierda = margin + 110; // Posición Y para extensión izquierda del hombro
  const yHombroExtensionDerecha = margin + 111; // Posición Y para extensión derecha del hombro
  const yHombroAbduccionIzquierda = margin + 115; // Posición Y para abducción izquierda del hombro
  const yHombroAbduccionDerecha = margin + 116; // Posición Y para abducción derecha del hombro
  const yHombroAduccionIzquierda = margin + 120; // Posición Y para aducción izquierda del hombro
  const yHombroAduccionDerecha = margin + 121; // Posición Y para aducción derecha del hombro
  const yHombroRotacionInternaIzquierda = margin + 125; // Posición Y para rotación interna izquierda del hombro
  const yHombroRotacionInternaDerecha = margin + 126; // Posición Y para rotación interna derecha del hombro
  const yHombroRotacionExternaIzquierda = margin + 130; // Posición Y para rotación externa izquierda del hombro
  const yHombroRotacionExternaDerecha = margin + 131; // Posición Y para rotación externa derecha del hombro
  

  
  // Datos del hombro - Flexión
  if (datosFinales.examenFisico?.hombro?.flexion) {
    const flexionHombro = datosFinales.examenFisico.hombro.flexion;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (flexionHombro.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionHombro.izquierda.grado === "N") {
        doc.text("X", xHombroIzquierdaN, yHombroFlexionIzquierda); // X en N (Normal) - Izquierda
      } else if (flexionHombro.izquierda.grado === "R") {
        doc.text("X", xHombroIzquierdaR, yHombroFlexionIzquierda); // X en R (Reducido) - Izquierda
      } else if (flexionHombro.izquierda.grado === "M") {
        doc.text("X", xHombroIzquierdaM, yHombroFlexionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (flexionHombro.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionHombro.derecha.grado === "N") {
        doc.text("X", xHombroDerechaN, yHombroFlexionDerecha); // X en N (Normal) - Derecha
      } else if (flexionHombro.derecha.grado === "R") {
        doc.text("X", xHombroDerechaR, yHombroFlexionDerecha); // X en R (Reducido) - Derecha
      } else if (flexionHombro.derecha.grado === "M") {
        doc.text("X", xHombroDerechaM, yHombroFlexionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos del hombro - Extensión
  if (datosFinales.examenFisico?.hombro?.extension) {
    const extensionHombro = datosFinales.examenFisico.hombro.extension;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (extensionHombro.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionHombro.izquierda.grado === "N") {
        doc.text("X", xHombroIzquierdaN, yHombroExtensionIzquierda); // X en N (Normal) - Izquierda
      } else if (extensionHombro.izquierda.grado === "R") {
        doc.text("X", xHombroIzquierdaR, yHombroExtensionIzquierda); // X en R (Reducido) - Izquierda
      } else if (extensionHombro.izquierda.grado === "M") {
        doc.text("X", xHombroIzquierdaM, yHombroExtensionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (extensionHombro.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionHombro.derecha.grado === "N") {
        doc.text("X", xHombroDerechaN, yHombroExtensionDerecha); // X en N (Normal) - Derecha
      } else if (extensionHombro.derecha.grado === "R") {
        doc.text("X", xHombroDerechaR, yHombroExtensionDerecha); // X en R (Reducido) - Derecha
      } else if (extensionHombro.derecha.grado === "M") {
        doc.text("X", xHombroDerechaM, yHombroExtensionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos del hombro - Abducción
  if (datosFinales.examenFisico?.hombro?.abduccion) {
    const abduccionHombro = datosFinales.examenFisico.hombro.abduccion;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (abduccionHombro.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (abduccionHombro.izquierda.grado === "N") {
        doc.text("X", xHombroIzquierdaN, yHombroAbduccionIzquierda); // X en N (Normal) - Izquierda
      } else if (abduccionHombro.izquierda.grado === "R") {
        doc.text("X", xHombroIzquierdaR, yHombroAbduccionIzquierda); // X en R (Reducido) - Izquierda
      } else if (abduccionHombro.izquierda.grado === "M") {
        doc.text("X", xHombroIzquierdaM, yHombroAbduccionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (abduccionHombro.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (abduccionHombro.derecha.grado === "N") {
        doc.text("X", xHombroDerechaN, yHombroAbduccionDerecha); // X en N (Normal) - Derecha
      } else if (abduccionHombro.derecha.grado === "R") {
        doc.text("X", xHombroDerechaR, yHombroAbduccionDerecha); // X en R (Reducido) - Derecha
      } else if (abduccionHombro.derecha.grado === "M") {
        doc.text("X", xHombroDerechaM, yHombroAbduccionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos del hombro - Aducción
  if (datosFinales.examenFisico?.hombro?.aduccion) {
    const aduccionHombro = datosFinales.examenFisico.hombro.aduccion;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (aduccionHombro.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (aduccionHombro.izquierda.grado === "N") {
        doc.text("X", xHombroIzquierdaN, yHombroAduccionIzquierda); // X en N (Normal) - Izquierda
      } else if (aduccionHombro.izquierda.grado === "R") {
        doc.text("X", xHombroIzquierdaR, yHombroAduccionIzquierda); // X en R (Reducido) - Izquierda
      } else if (aduccionHombro.izquierda.grado === "M") {
        doc.text("X", xHombroIzquierdaM, yHombroAduccionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (aduccionHombro.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (aduccionHombro.derecha.grado === "N") {
        doc.text("X", xHombroDerechaN, yHombroAduccionDerecha); // X en N (Normal) - Derecha
      } else if (aduccionHombro.derecha.grado === "R") {
        doc.text("X", xHombroDerechaR, yHombroAduccionDerecha); // X en R (Reducido) - Derecha
      } else if (aduccionHombro.derecha.grado === "M") {
        doc.text("X", xHombroDerechaM, yHombroAduccionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos del hombro - Rotación Interna
  if (datosFinales.examenFisico?.hombro?.rotacionInterna) {
    const rotacionInternaHombro = datosFinales.examenFisico.hombro.rotacionInterna;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (rotacionInternaHombro.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (rotacionInternaHombro.izquierda.grado === "N") {
        doc.text("X", xHombroIzquierdaN, yHombroRotacionInternaIzquierda); // X en N (Normal) - Izquierda
      } else if (rotacionInternaHombro.izquierda.grado === "R") {
        doc.text("X", xHombroIzquierdaR, yHombroRotacionInternaIzquierda); // X en R (Reducido) - Izquierda
      } else if (rotacionInternaHombro.izquierda.grado === "M") {
        doc.text("X", xHombroIzquierdaM, yHombroRotacionInternaIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (rotacionInternaHombro.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (rotacionInternaHombro.derecha.grado === "N") {
        doc.text("X", xHombroDerechaN, yHombroRotacionInternaDerecha); // X en N (Normal) - Derecha
      } else if (rotacionInternaHombro.derecha.grado === "R") {
        doc.text("X", xHombroDerechaR, yHombroRotacionInternaDerecha); // X en R (Reducido) - Derecha
      } else if (rotacionInternaHombro.derecha.grado === "M") {
        doc.text("X", xHombroDerechaM, yHombroRotacionInternaDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos del hombro - Rotación Externa
  if (datosFinales.examenFisico?.hombro?.rotacionExterna) {
    const rotacionExternaHombro = datosFinales.examenFisico.hombro.rotacionExterna;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (rotacionExternaHombro.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (rotacionExternaHombro.izquierda.grado === "N") {
        doc.text("X", xHombroIzquierdaN, yHombroRotacionExternaIzquierda); // X en N (Normal) - Izquierda
      } else if (rotacionExternaHombro.izquierda.grado === "R") {
        doc.text("X", xHombroIzquierdaR, yHombroRotacionExternaIzquierda); // X en R (Reducido) - Izquierda
      } else if (rotacionExternaHombro.izquierda.grado === "M") {
        doc.text("X", xHombroIzquierdaM, yHombroRotacionExternaIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (rotacionExternaHombro.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (rotacionExternaHombro.derecha.grado === "N") {
        doc.text("X", xHombroDerechaN, yHombroRotacionExternaDerecha); // X en N (Normal) - Derecha
      } else if (rotacionExternaHombro.derecha.grado === "R") {
        doc.text("X", xHombroDerechaR, yHombroRotacionExternaDerecha); // X en R (Reducido) - Derecha
      } else if (rotacionExternaHombro.derecha.grado === "M") {
        doc.text("X", xHombroDerechaM, yHombroRotacionExternaDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === PÁGINA 2 ===
  doc.addPage();
  
  // === 0) HEADER PÁGINA 2 (solo texto, sin imagen) ===
  headerEvaluacionMuscoloEsqueletica(doc, data, false, 2);

  // === 1) Imagen de fondo para la página 2 ===
  const fondoImgPag2 = "/img/EvaluacionMusculoEsqueletica_pag2.png";
  
  // Página 2 ocupa toda la hoja
  const imgWidthPag2 = pageW; // Todo el ancho disponible
  const imgHeightPag2 = pageH; // Toda la altura de la página

  // Posicionar desde arriba para ocupar toda la página
  const xOffsetPag2 = 0;
  const yOffsetPag2 = 0; // Desde la parte superior

  try {
    doc.addImage(fondoImgPag2, "PNG", xOffsetPag2, yOffsetPag2, imgWidthPag2, imgHeightPag2);
  } catch (e) {
    doc.text("Imagen de evaluación músculo esquelética página 2 no disponible", margin, yOffsetPag2 + 10);
  }

  // === GENERAR PDF Y ABRIR PARA IMPRESIÓN ===
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}
