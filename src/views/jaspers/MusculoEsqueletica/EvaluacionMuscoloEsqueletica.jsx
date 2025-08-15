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
          derecha: { grado: "R" }    // N = Normal, R = Reducido, M = Marcado
        },
        extension: {
          izquierda: { grado: "M" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "N" }    // N = Normal, R = Reducido, M = Marcado
        },
        abduccion: {
          izquierda: { grado: "R" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "M" }    // N = Normal, R = Reducido, M = Marcado
        },
        aduccion: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "R" }    // N = Normal, R = Reducido, M = Marcado
        },
        rotacionInterna: {
          izquierda: { grado: "M" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "N" }    // N = Normal, R = Reducido, M = Marcado
        },
        rotacionExterna: {
          izquierda: { grado: "R" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "M" }    // N = Normal, R = Reducido, M = Marcado
        }
      },
      brazo: {
        flexion: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "R" }    // N = Normal, R = Reducido, M = Marcado
        },
        extension: {
          izquierda: { grado: "M" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "R" }    // N = Normal, R = Reducido, M = Marcado
        }
      },
      antebrazo: {
        pronacion: {
          izquierda: { grado: "R" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "M" }    // N = Normal, R = Reducido, M = Marcado
        },
        supinacion: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "M" }    // N = Normal, R = Reducido, M = Marcado
        }
      },
      muneca: {
        flexion: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "R" }    // N = Normal, R = Reducido, M = Marcado
        },
        extension: {
          izquierda: { grado: "M" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "N" }    // N = Normal, R = Reducido, M = Marcado
        },
        desviacionCubital: {
          izquierda: { grado: "R" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "M" }    // N = Normal, R = Reducido, M = Marcado
        },
        desviacionRadial: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "R" }    // N = Normal, R = Reducido, M = Marcado
        }
      },
      // Signos especiales de muñeca (solo SI/NO - lado izquierdo)
      signoPhallen: {
        izquierda: true // true = SI, false = NO
      },
      signoTinel: {
        izquierda: false // true = SI, false = NO
      },
      torax: {
        flexion: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "R" }    // N = Normal, R = Reducido, M = Marcado
        },
        extension: {
          izquierda: { grado: "M" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "N" }    // N = Normal, R = Reducido, M = Marcado
        },
        rotacion: {
          izquierda: { grado: "R" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "M" }    // N = Normal, R = Reducido, M = Marcado
        }
      },
      caderas: {
        flexion: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "R" }    // N = Normal, R = Reducido, M = Marcado
        },
        extension: {
          izquierda: { grado: "M" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "N" }    // N = Normal, R = Reducido, M = Marcado
        },
        abduccion: {
          izquierda: { grado: "R" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "M" }    // N = Normal, R = Reducido, M = Marcado
        },
        aduccion: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "R" }    // N = Normal, R = Reducido, M = Marcado
        },
        rotacionInterna: {
          izquierda: { grado: "M" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "N" }    // N = Normal, R = Reducido, M = Marcado
        },
        rotacionExterna: {
          izquierda: { grado: "R" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "M" }    // N = Normal, R = Reducido, M = Marcado
        }
      },
      pierna: {
        flexion: {
          izquierda: { grado: "R" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "N" }    // N = Normal, R = Reducido, M = Marcado
        },
        extension: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "M" }    // N = Normal, R = Reducido, M = Marcado
        }
      },
      rodilla: {
        flexion: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "R" }    // N = Normal, R = Reducido, M = Marcado
        },
        extension: {
          izquierda: { grado: "M" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "N" }    // N = Normal, R = Reducido, M = Marcado
        },
        rotacionInterna: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "R" }    // N = Normal, R = Reducido, M = Marcado
        },
        rotacionExterna: {
          izquierda: { grado: "M" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "N" }    // N = Normal, R = Reducido, M = Marcado
        }
      },
      tobillo: {
        flexion: {
          izquierda: { grado: "N" }, // N = Normal, R = Reducido, M = Marcado
          derecha: { grado: "R" }    // N = Normal, R = Reducido, M = Marcado
        },
        extension: {
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
  const xHombroIzquierdaN = margin + 28.4; // Posición X para grado N (Normal) - Izquierda
  const xHombroIzquierdaR = margin + 45.4; // Posición X para grado R (Reducido) - Izquierda
  const xHombroIzquierdaM = margin + 63.2; // Posición X para grado M (Marcado) - Izquierda
  
  // DERECHA
  const xHombroDerechaN = margin + 141; // Posición X para grado N (Normal) - Derecha
  const xHombroDerechaR = margin + 160; // Posición X para grado R (Reducido) - Derecha
  const xHombroDerechaM = margin + 178.5; // Posición X para grado M (Marcado) - Derecha
  
  // Posiciones Y individuales para cada lado del hombro
  const yHombroFlexionIzquierda = margin + 109.2; // Posición Y para flexión izquierda del hombro
  const yHombroFlexionDerecha = margin + 109.2; // Posición Y para flexión derecha del hombro
 
  const yHombroExtensionIzquierda = margin + 115; // Posición Y para extensión izquierda del hombro
  const yHombroExtensionDerecha = margin + 115; // Posición Y para extensión derecha del hombro

  const yHombroAbduccionIzquierda = margin + 120.5; // Posición Y para abducción izquierda del hombro
  const yHombroAbduccionDerecha = margin + 120.5; // Posición Y para abducción derecha del hombro

  const yHombroAduccionIzquierda = margin + 126.2; // Posición Y para aducción izquierda del hombro
  const yHombroAduccionDerecha = margin + 126.2; // Posición Y para aducción derecha del hombro

  const yHombroRotacionInternaIzquierda = margin + 132; // Posición Y para rotación interna izquierda del hombro
  const yHombroRotacionInternaDerecha = margin + 132; // Posición Y para rotación interna derecha del hombro
 
  const yHombroRotacionExternaIzquierda = margin + 137.5; // Posición Y para rotación externa izquierda del hombro
  const yHombroRotacionExternaDerecha = margin + 137.5; // Posición Y para rotación externa derecha del hombro
  
  // === SECCIÓN: BRAZO ===
  // Posiciones X individuales para cada lado del brazo
  // IZQUIERDA
  const xBrazoIzquierdaN = margin + 28.4; // Posición X para grado N (Normal) - Izquierda
  const xBrazoIzquierdaR = margin + 45.4; // Posición X para grado R (Reducido) - Izquierda
  const xBrazoIzquierdaM = margin + 63.2; // Posición X para grado M (Marcado) - Izquierda
  
  // DERECHA
  const xBrazoDerechaN = margin + 141; // Posición X para grado N (Normal) - Derecha
  const xBrazoDerechaR = margin + 160; // Posición X para grado R (Reducido) - Derecha
  const xBrazoDerechaM = margin + 178.5; // Posición X para grado M (Marcado) - Derecha
  
  // Posiciones Y individuales para cada lado del brazo
  const yBrazoFlexionIzquierda = margin + 149.8; // Posición Y para flexión izquierda del brazo
  const yBrazoFlexionDerecha = margin + 149.8; // Posición Y para flexión derecha del brazo
  const yBrazoExtensionIzquierda = margin + 155.5; // Posición Y para extensión izquierda del brazo
  const yBrazoExtensionDerecha = margin + 155.5; // Posición Y para extensión derecha del brazo

  // === SECCIÓN: ANTEBRAZO ===
  // Posiciones X individuales para cada lado del antebrazo
  // IZQUIERDA
  const xAntebrazoIzquierdaN = margin + 28.4; // Posición X para grado N (Normal) - Izquierda
  const xAntebrazoIzquierdaR = margin + 45.4; // Posición X para grado R (Reducido) - Izquierda
  const xAntebrazoIzquierdaM = margin + 63.2; // Posición X para grado M (Marcado) - Izquierda
  
  // DERECHA
  const xAntebrazoDerechaN = margin + 141; // Posición X para grado N (Normal) - Derecha
  const xAntebrazoDerechaR = margin + 160; // Posición X para grado R (Reducido) - Derecha
  const xAntebrazoDerechaM = margin + 178.5; // Posición X para grado M (Marcado) - Derecha
  
  // Posiciones Y individuales para cada lado del antebrazo
  const yAntebrazoPronacionIzquierda = margin + 166.8; // Posición Y para pronación izquierda del antebrazo
  const yAntebrazoPronacionDerecha = margin + 166.8; // Posición Y para pronación derecha del antebrazo
  const yAntebrazoSupinacionIzquierda = margin + 172.5; // Posición Y para supinación izquierda del antebrazo
  const yAntebrazoSupinacionDerecha = margin + 172.5; // Posición Y para supinación derecha del antebrazo

  // === SECCIÓN: MUÑECA ===
  // Posiciones X individuales para cada lado de la muñeca
  // IZQUIERDA
  const xMunecaIzquierdaN = margin + 28.4; // Posición X para grado N (Normal) - Izquierda
  const xMunecaIzquierdaR = margin + 45.4; // Posición X para grado R (Reducido) - Izquierda
  const xMunecaIzquierdaM = margin + 63.2; // Posición X para grado M (Marcado) - Izquierda
  
  // DERECHA
  const xMunecaDerechaN = margin + 141; // Posición X para grado N (Normal) - Derecha
  const xMunecaDerechaR = margin + 160; // Posición X para grado R (Reducido) - Derecha
  const xMunecaDerechaM = margin + 178.5; // Posición X para grado M (Marcado) - Derecha
  
  // Posiciones Y individuales para cada lado de la muñeca
  const yMunecaFlexionIzquierda = margin + 183.8; // Posición Y para flexión izquierda de la muñeca
  const yMunecaFlexionDerecha = margin + 183.8; // Posición Y para flexión derecha de la muñeca
  const yMunecaExtensionIzquierda = margin + 189.4; // Posición Y para extensión izquierda de la muñeca
  const yMunecaExtensionDerecha = margin + 189.4; // Posición Y para extensión derecha de la muñeca
  const yMunecaDesviacionCubitalIzquierda = margin + 194.6; // Posición Y para desviación cubital izquierda de la muñeca
  const yMunecaDesviacionCubitalDerecha = margin + 194.6; // Posición Y para desviación cubital derecha de la muñeca
  const yMunecaDesviacionRadialIzquierda = margin + 200.2; // Posición Y para desviación radial izquierda de la muñeca
  const yMunecaDesviacionRadialDerecha = margin + 200.2; // Posición Y para desviación radial derecha de la muñeca

  // === SIGNOS ESPECIALES DE MUÑECA ===
  // Posiciones X para SI/NO de Phallen y Tinel
  const xSignoPhallenSI = margin + 45.4; // Posición X para SI en Phallen
  const xSignoPhallenNO = margin + 63.2; // Posición X para NO en Phallen
  const xSignoTinelSI = margin + 45.4; // Posición X para SI en Tinel
  const xSignoTinelNO = margin + 63.2; // Posición X para NO en Tinel
  
  // Posiciones Y para Phallen y Tinel
  const ySignoPhallen = margin + 206.4; // Posición Y para signo de Phallen
  const ySignoTinel = margin + 211.5; // Posición Y para signo de Tinel

  // === SECCIÓN: TÓRAX ===
  // Posiciones X individuales para cada lado del tórax
  // IZQUIERDA
  const xToraxIzquierdaN = margin + 28.4; // Posición X para grado N (Normal) - Izquierda
  const xToraxIzquierdaR = margin + 45.4; // Posición X para grado R (Reducido) - Izquierda
  const xToraxIzquierdaM = margin + 63.2; // Posición X para grado M (Marcado) - Izquierda
  
  // DERECHA
  const xToraxDerechaN = margin + 141; // Posición X para grado N (Normal) - Derecha
  const xToraxDerechaR = margin + 160; // Posición X para grado R (Reducido) - Derecha
  const xToraxDerechaM = margin + 178.5; // Posición X para grado M (Marcado) - Derecha
  
  // Posiciones Y individuales para cada lado del tórax
  const yToraxFlexionIzquierda = margin + 223.1; // Posición Y para flexión izquierda del tórax
  const yToraxFlexionDerecha = margin + 223.1; // Posición Y para flexión derecha del tórax
  const yToraxExtensionIzquierda = margin + 228.4; // Posición Y para extensión izquierda del tórax
  const yToraxExtensionDerecha = margin + 228.4; // Posición Y para extensión derecha del tórax
  const yToraxRotacionIzquierda = margin + 233.5; // Posición Y para rotación izquierda del tórax
  const yToraxRotacionDerecha = margin + 233.5; // Posición Y para rotación derecha del tórax

  // === SECCIÓN: CADERAS (MIEMBROS INFERIORES) ===
  // Posiciones X individuales para cada lado de las caderas
  // IZQUIERDA
  const xCaderasIzquierdaN = margin + 28.4; // Posición X para grado N (Normal) - Izquierda
  const xCaderasIzquierdaR = margin + 45.4; // Posición X para grado R (Reducido) - Izquierda
  const xCaderasIzquierdaM = margin + 63.2; // Posición X para grado M (Marcado) - Izquierda
  
  // DERECHA
  const xCaderasDerechaN = margin + 141; // Posición X para grado N (Normal) - Derecha
  const xCaderasDerechaR = margin + 160; // Posición X para grado R (Reducido) - Derecha
  const xCaderasDerechaM = margin + 178.5; // Posición X para grado M (Marcado) - Derecha
  
  // Posiciones Y individuales para cada lado de las caderas
  const yCaderasFlexionIzquierda = margin + 249.5; // Posición Y para flexión izquierda de las caderas
  const yCaderasFlexionDerecha = margin + 249.5; // Posición Y para flexión derecha de las caderas
  
  const yCaderasExtensionIzquierda = margin + 254.5; // Posición Y para extensión izquierda de las caderas
  const yCaderasExtensionDerecha = margin + 254.5; // Posición Y para extensión derecha de las caderas
  
  const yCaderasAbduccionIzquierda = margin + 259.8; // Posición Y para abducción izquierda de las caderas
  const yCaderasAbduccionDerecha = margin + 259.8; // Posición Y para abducción derecha de las caderas
  
  const yCaderasAduccionIzquierda = margin + 265; // Posición Y para aducción izquierda de las caderas
  const yCaderasAduccionDerecha = margin + 265; // Posición Y para aducción derecha de las caderas
  
  const yCaderasRotacionInternaIzquierda = margin + 270; // Posición Y para rotación interna izquierda de las caderas
  const yCaderasRotacionInternaDerecha = margin + 270; // Posición Y para rotación interna derecha de las caderas
  
  const yCaderasRotacionExternaIzquierda = margin + 275.4; // Posición Y para rotación externa izquierda de las caderas
  const yCaderasRotacionExternaDerecha = margin + 275.4; // Posición Y para rotación externa derecha de las caderas
  
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

  // === SECCIÓN: BRAZO ===
  
  // Datos del brazo - Flexión
  if (datosFinales.examenFisico?.brazo?.flexion) {
    const flexionBrazo = datosFinales.examenFisico.brazo.flexion;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (flexionBrazo.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionBrazo.izquierda.grado === "N") {
        doc.text("X", xBrazoIzquierdaN, yBrazoFlexionIzquierda); // X en N (Normal) - Izquierda
      } else if (flexionBrazo.izquierda.grado === "R") {
        doc.text("X", xBrazoIzquierdaR, yBrazoFlexionIzquierda); // X en R (Reducido) - Izquierda
      } else if (flexionBrazo.izquierda.grado === "M") {
        doc.text("X", xBrazoIzquierdaM, yBrazoFlexionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (flexionBrazo.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionBrazo.derecha.grado === "N") {
        doc.text("X", xBrazoDerechaN, yBrazoFlexionDerecha); // X en N (Normal) - Derecha
      } else if (flexionBrazo.derecha.grado === "R") {
        doc.text("X", xBrazoDerechaR, yBrazoFlexionDerecha); // X en R (Reducido) - Derecha
      } else if (flexionBrazo.derecha.grado === "M") {
        doc.text("X", xBrazoDerechaM, yBrazoFlexionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos del brazo - Extensión
  if (datosFinales.examenFisico?.brazo?.extension) {
    const extensionBrazo = datosFinales.examenFisico.brazo.extension;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (extensionBrazo.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionBrazo.izquierda.grado === "N") {
        doc.text("X", xBrazoIzquierdaN, yBrazoExtensionIzquierda); // X en N (Normal) - Izquierda
      } else if (extensionBrazo.izquierda.grado === "R") {
        doc.text("X", xBrazoIzquierdaR, yBrazoExtensionIzquierda); // X en R (Reducido) - Izquierda
      } else if (extensionBrazo.izquierda.grado === "M") {
        doc.text("X", xBrazoIzquierdaM, yBrazoExtensionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (extensionBrazo.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionBrazo.derecha.grado === "N") {
        doc.text("X", xBrazoDerechaN, yBrazoExtensionDerecha); // X en N (Normal) - Derecha
      } else if (extensionBrazo.derecha.grado === "R") {
        doc.text("X", xBrazoDerechaR, yBrazoExtensionDerecha); // X en R (Reducido) - Derecha
      } else if (extensionBrazo.derecha.grado === "M") {
        doc.text("X", xBrazoDerechaM, yBrazoExtensionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: ANTEBRAZO ===
  
  // Datos del antebrazo - Pronación
  if (datosFinales.examenFisico?.antebrazo?.pronacion) {
    const pronacionAntebrazo = datosFinales.examenFisico.antebrazo.pronacion;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (pronacionAntebrazo.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (pronacionAntebrazo.izquierda.grado === "N") {
        doc.text("X", xAntebrazoIzquierdaN, yAntebrazoPronacionIzquierda); // X en N (Normal) - Izquierda
      } else if (pronacionAntebrazo.izquierda.grado === "R") {
        doc.text("X", xAntebrazoIzquierdaR, yAntebrazoPronacionIzquierda); // X en R (Reducido) - Izquierda
      } else if (pronacionAntebrazo.izquierda.grado === "M") {
        doc.text("X", xAntebrazoIzquierdaM, yAntebrazoPronacionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (pronacionAntebrazo.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (pronacionAntebrazo.derecha.grado === "N") {
        doc.text("X", xAntebrazoDerechaN, yAntebrazoPronacionDerecha); // X en N (Normal) - Derecha
      } else if (pronacionAntebrazo.derecha.grado === "R") {
        doc.text("X", xAntebrazoDerechaR, yAntebrazoPronacionDerecha); // X en R (Reducido) - Derecha
      } else if (pronacionAntebrazo.derecha.grado === "M") {
        doc.text("X", xAntebrazoDerechaM, yAntebrazoPronacionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos del antebrazo - Supinación
  if (datosFinales.examenFisico?.antebrazo?.supinacion) {
    const supinacionAntebrazo = datosFinales.examenFisico.antebrazo.supinacion;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (supinacionAntebrazo.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (supinacionAntebrazo.izquierda.grado === "N") {
        doc.text("X", xAntebrazoIzquierdaN, yAntebrazoSupinacionIzquierda); // X en N (Normal) - Izquierda
      } else if (supinacionAntebrazo.izquierda.grado === "R") {
        doc.text("X", xAntebrazoIzquierdaR, yAntebrazoSupinacionIzquierda); // X en R (Reducido) - Izquierda
      } else if (supinacionAntebrazo.izquierda.grado === "M") {
        doc.text("X", xAntebrazoIzquierdaM, yAntebrazoSupinacionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (supinacionAntebrazo.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (supinacionAntebrazo.derecha.grado === "N") {
        doc.text("X", xAntebrazoDerechaN, yAntebrazoSupinacionDerecha); // X en N (Normal) - Derecha
      } else if (supinacionAntebrazo.derecha.grado === "R") {
        doc.text("X", xAntebrazoDerechaR, yAntebrazoSupinacionDerecha); // X en R (Reducido) - Derecha
      } else if (supinacionAntebrazo.derecha.grado === "M") {
        doc.text("X", xAntebrazoDerechaM, yAntebrazoSupinacionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: MUÑECA ===
  
  // Datos de la muñeca - Flexión
  if (datosFinales.examenFisico?.muneca?.flexion) {
    const flexionMuneca = datosFinales.examenFisico.muneca.flexion;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (flexionMuneca.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionMuneca.izquierda.grado === "N") {
        doc.text("X", xMunecaIzquierdaN, yMunecaFlexionIzquierda); // X en N (Normal) - Izquierda
      } else if (flexionMuneca.izquierda.grado === "R") {
        doc.text("X", xMunecaIzquierdaR, yMunecaFlexionIzquierda); // X en R (Reducido) - Izquierda
      } else if (flexionMuneca.izquierda.grado === "M") {
        doc.text("X", xMunecaIzquierdaM, yMunecaFlexionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (flexionMuneca.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionMuneca.derecha.grado === "N") {
        doc.text("X", xMunecaDerechaN, yMunecaFlexionDerecha); // X en N (Normal) - Derecha
      } else if (flexionMuneca.derecha.grado === "R") {
        doc.text("X", xMunecaDerechaR, yMunecaFlexionDerecha); // X en R (Reducido) - Derecha
      } else if (flexionMuneca.derecha.grado === "M") {
        doc.text("X", xMunecaDerechaM, yMunecaFlexionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos de la muñeca - Extensión
  if (datosFinales.examenFisico?.muneca?.extension) {
    const extensionMuneca = datosFinales.examenFisico.muneca.extension;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (extensionMuneca.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionMuneca.izquierda.grado === "N") {
        doc.text("X", xMunecaIzquierdaN, yMunecaExtensionIzquierda); // X en N (Normal) - Izquierda
      } else if (extensionMuneca.izquierda.grado === "R") {
        doc.text("X", xMunecaIzquierdaR, yMunecaExtensionIzquierda); // X en R (Reducido) - Izquierda
      } else if (extensionMuneca.izquierda.grado === "M") {
        doc.text("X", xMunecaIzquierdaM, yMunecaExtensionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (extensionMuneca.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionMuneca.derecha.grado === "N") {
        doc.text("X", xMunecaDerechaN, yMunecaExtensionDerecha); // X en N (Normal) - Derecha
      } else if (extensionMuneca.derecha.grado === "R") {
        doc.text("X", xMunecaDerechaR, yMunecaExtensionDerecha); // X en R (Reducido) - Derecha
      } else if (extensionMuneca.derecha.grado === "M") {
        doc.text("X", xMunecaDerechaM, yMunecaExtensionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos de la muñeca - Desviación Cubital
  if (datosFinales.examenFisico?.muneca?.desviacionCubital) {
    const desviacionCubitalMuneca = datosFinales.examenFisico.muneca.desviacionCubital;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (desviacionCubitalMuneca.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (desviacionCubitalMuneca.izquierda.grado === "N") {
        doc.text("X", xMunecaIzquierdaN, yMunecaDesviacionCubitalIzquierda); // X en N (Normal) - Izquierda
      } else if (desviacionCubitalMuneca.izquierda.grado === "R") {
        doc.text("X", xMunecaIzquierdaR, yMunecaDesviacionCubitalIzquierda); // X en R (Reducido) - Izquierda
      } else if (desviacionCubitalMuneca.izquierda.grado === "M") {
        doc.text("X", xMunecaIzquierdaM, yMunecaDesviacionCubitalIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (desviacionCubitalMuneca.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (desviacionCubitalMuneca.derecha.grado === "N") {
        doc.text("X", xMunecaDerechaN, yMunecaDesviacionCubitalDerecha); // X en N (Normal) - Derecha
      } else if (desviacionCubitalMuneca.derecha.grado === "R") {
        doc.text("X", xMunecaDerechaR, yMunecaDesviacionCubitalDerecha); // X en R (Reducido) - Derecha
      } else if (desviacionCubitalMuneca.derecha.grado === "M") {
        doc.text("X", xMunecaDerechaM, yMunecaDesviacionCubitalDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos de la muñeca - Desviación Radial
  if (datosFinales.examenFisico?.muneca?.desviacionRadial) {
    const desviacionRadialMuneca = datosFinales.examenFisico.muneca.desviacionRadial;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (desviacionRadialMuneca.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (desviacionRadialMuneca.izquierda.grado === "N") {
        doc.text("X", xMunecaIzquierdaN, yMunecaDesviacionRadialIzquierda); // X en N (Normal) - Izquierda
      } else if (desviacionRadialMuneca.izquierda.grado === "R") {
        doc.text("X", xMunecaIzquierdaR, yMunecaDesviacionRadialIzquierda); // X en R (Reducido) - Izquierda
      } else if (desviacionRadialMuneca.izquierda.grado === "M") {
        doc.text("X", xMunecaIzquierdaM, yMunecaDesviacionRadialIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (desviacionRadialMuneca.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (desviacionRadialMuneca.derecha.grado === "N") {
        doc.text("X", xMunecaDerechaN, yMunecaDesviacionRadialDerecha); // X en N (Normal) - Derecha
      } else if (desviacionRadialMuneca.derecha.grado === "R") {
        doc.text("X", xMunecaDerechaR, yMunecaDesviacionRadialDerecha); // X en R (Reducido) - Derecha
      } else if (desviacionRadialMuneca.derecha.grado === "M") {
        doc.text("X", xMunecaDerechaM, yMunecaDesviacionRadialDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 255); // Color azul para las X
  }

  // === SIGNOS ESPECIALES DE MUÑECA ===
  
  // Signo de Phallen (solo lado izquierdo)
  if (datosFinales.examenFisico?.signoPhallen?.izquierda !== undefined) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(11);
    
    if (datosFinales.examenFisico.signoPhallen.izquierda) {
      doc.text("X", xSignoPhallenSI, ySignoPhallen); // X en SI
    } else {
      doc.text("X", xSignoPhallenNO, ySignoPhallen); // X en NO
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Signo de Tinel (solo lado izquierdo)
  if (datosFinales.examenFisico?.signoTinel?.izquierda !== undefined) {
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(11);
    
    if (datosFinales.examenFisico.signoTinel.izquierda) {
      doc.text("X", xSignoTinelSI, ySignoTinel); // X en SI
    } else {
      doc.text("X", xSignoTinelNO, ySignoTinel); // X en NO
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: TÓRAX ===
  
  // Datos del tórax - Flexión
  if (datosFinales.examenFisico?.torax?.flexion) {
    const flexionTorax = datosFinales.examenFisico.torax.flexion;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (flexionTorax.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionTorax.izquierda.grado === "N") {
        doc.text("X", xToraxIzquierdaN, yToraxFlexionIzquierda); // X en N (Normal) - Izquierda
      } else if (flexionTorax.izquierda.grado === "R") {
        doc.text("X", xToraxIzquierdaR, yToraxFlexionIzquierda); // X en R (Reducido) - Izquierda
      } else if (flexionTorax.izquierda.grado === "M") {
        doc.text("X", xToraxIzquierdaM, yToraxFlexionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (flexionTorax.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionTorax.derecha.grado === "N") {
        doc.text("X", xToraxDerechaN, yToraxFlexionDerecha); // X en N (Normal) - Derecha
      } else if (flexionTorax.derecha.grado === "R") {
        doc.text("X", xToraxDerechaR, yToraxFlexionDerecha); // X en R (Reducido) - Derecha
      } else if (flexionTorax.derecha.grado === "M") {
        doc.text("X", xToraxDerechaM, yToraxFlexionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos del tórax - Extensión
  if (datosFinales.examenFisico?.torax?.extension) {
    const extensionTorax = datosFinales.examenFisico.torax.extension;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (extensionTorax.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionTorax.izquierda.grado === "N") {
        doc.text("X", xToraxIzquierdaN, yToraxExtensionIzquierda); // X en N (Normal) - Izquierda
      } else if (extensionTorax.izquierda.grado === "R") {
        doc.text("X", xToraxIzquierdaR, yToraxExtensionIzquierda); // X en R (Reducido) - Izquierda
      } else if (extensionTorax.izquierda.grado === "M") {
        doc.text("X", xToraxIzquierdaM, yToraxExtensionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (extensionTorax.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionTorax.derecha.grado === "N") {
        doc.text("X", xToraxDerechaN, yToraxExtensionDerecha); // X en N (Normal) - Derecha
      } else if (extensionTorax.derecha.grado === "R") {
        doc.text("X", xToraxDerechaR, yToraxExtensionDerecha); // X en R (Reducido) - Derecha
      } else if (extensionTorax.derecha.grado === "M") {
        doc.text("X", xToraxDerechaM, yToraxExtensionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos del tórax - Rotación
  if (datosFinales.examenFisico?.torax?.rotacion) {
    const rotacionTorax = datosFinales.examenFisico.torax.rotacion;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (rotacionTorax.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (rotacionTorax.izquierda.grado === "N") {
        doc.text("X", xToraxIzquierdaN, yToraxRotacionIzquierda); // X en N (Normal) - Izquierda
      } else if (rotacionTorax.izquierda.grado === "R") {
        doc.text("X", xToraxIzquierdaR, yToraxRotacionIzquierda); // X en R (Reducido) - Izquierda
      } else if (rotacionTorax.izquierda.grado === "M") {
        doc.text("X", xToraxIzquierdaM, yToraxRotacionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (rotacionTorax.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (rotacionTorax.derecha.grado === "N") {
        doc.text("X", xToraxDerechaN, yToraxRotacionDerecha); // X en N (Normal) - Derecha
      } else if (rotacionTorax.derecha.grado === "R") {
        doc.text("X", xToraxDerechaR, yToraxRotacionDerecha); // X en R (Reducido) - Derecha
      } else if (rotacionTorax.derecha.grado === "M") {
        doc.text("X", xToraxDerechaM, yToraxRotacionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: CADERAS (MIEMBROS INFERIORES) ===
  
  // Datos de las caderas - Flexión
  if (datosFinales.examenFisico?.caderas?.flexion) {
    const flexionCaderas = datosFinales.examenFisico.caderas.flexion;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (flexionCaderas.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionCaderas.izquierda.grado === "N") {
        doc.text("X", xCaderasIzquierdaN, yCaderasFlexionIzquierda); // X en N (Normal) - Izquierda
      } else if (flexionCaderas.izquierda.grado === "R") {
        doc.text("X", xCaderasIzquierdaR, yCaderasFlexionIzquierda); // X en R (Reducido) - Izquierda
      } else if (flexionCaderas.izquierda.grado === "M") {
        doc.text("X", xCaderasIzquierdaM, yCaderasFlexionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (flexionCaderas.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionCaderas.derecha.grado === "N") {
        doc.text("X", xCaderasDerechaN, yCaderasFlexionDerecha); // X en N (Normal) - Derecha
      } else if (flexionCaderas.derecha.grado === "R") {
        doc.text("X", xCaderasDerechaR, yCaderasFlexionDerecha); // X en R (Reducido) - Derecha
      } else if (flexionCaderas.derecha.grado === "M") {
        doc.text("X", xCaderasDerechaM, yCaderasFlexionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos de las caderas - Extensión
  if (datosFinales.examenFisico?.caderas?.extension) {
    const extensionCaderas = datosFinales.examenFisico.caderas.extension;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (extensionCaderas.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionCaderas.izquierda.grado === "N") {
        doc.text("X", xCaderasIzquierdaN, yCaderasExtensionIzquierda); // X en N (Normal) - Izquierda
      } else if (extensionCaderas.izquierda.grado === "R") {
        doc.text("X", xCaderasIzquierdaR, yCaderasExtensionIzquierda); // X en R (Reducido) - Izquierda
      } else if (extensionCaderas.izquierda.grado === "M") {
        doc.text("X", xCaderasIzquierdaM, yCaderasExtensionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (extensionCaderas.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionCaderas.derecha.grado === "N") {
        doc.text("X", xCaderasDerechaN, yCaderasExtensionDerecha); // X en N (Normal) - Derecha
      } else if (extensionCaderas.derecha.grado === "R") {
        doc.text("X", xCaderasDerechaR, yCaderasExtensionDerecha); // X en R (Reducido) - Derecha
      } else if (extensionCaderas.derecha.grado === "M") {
        doc.text("X", xCaderasDerechaM, yCaderasExtensionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos de las caderas - Abducción
  if (datosFinales.examenFisico?.caderas?.abduccion) {
    const abduccionCaderas = datosFinales.examenFisico.caderas.abduccion;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (abduccionCaderas.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (abduccionCaderas.izquierda.grado === "N") {
        doc.text("X", xCaderasIzquierdaN, yCaderasAbduccionIzquierda); // X en N (Normal) - Izquierda
      } else if (abduccionCaderas.izquierda.grado === "R") {
        doc.text("X", xCaderasIzquierdaR, yCaderasAbduccionIzquierda); // X en R (Reducido) - Izquierda
      } else if (abduccionCaderas.izquierda.grado === "M") {
        doc.text("X", xCaderasIzquierdaM, yCaderasAbduccionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (abduccionCaderas.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (abduccionCaderas.derecha.grado === "N") {
        doc.text("X", xCaderasDerechaN, yCaderasAbduccionDerecha); // X en N (Normal) - Derecha
      } else if (abduccionCaderas.derecha.grado === "R") {
        doc.text("X", xCaderasDerechaR, yCaderasAbduccionDerecha); // X en R (Reducido) - Derecha
      } else if (abduccionCaderas.derecha.grado === "M") {
        doc.text("X", xCaderasDerechaM, yCaderasAbduccionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos de las caderas - Aducción
  if (datosFinales.examenFisico?.caderas?.aduccion) {
    const aduccionCaderas = datosFinales.examenFisico.caderas.aduccion;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (aduccionCaderas.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (aduccionCaderas.izquierda.grado === "N") {
        doc.text("X", xCaderasIzquierdaN, yCaderasAduccionIzquierda); // X en N (Normal) - Izquierda
      } else if (aduccionCaderas.izquierda.grado === "R") {
        doc.text("X", xCaderasIzquierdaR, yCaderasAduccionIzquierda); // X en R (Reducido) - Izquierda
      } else if (aduccionCaderas.izquierda.grado === "M") {
        doc.text("X", xCaderasIzquierdaM, yCaderasAduccionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (aduccionCaderas.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (aduccionCaderas.derecha.grado === "N") {
        doc.text("X", xCaderasDerechaN, yCaderasAduccionDerecha); // X en N (Normal) - Derecha
      } else if (aduccionCaderas.derecha.grado === "R") {
        doc.text("X", xCaderasDerechaR, yCaderasAduccionDerecha); // X en R (Reducido) - Derecha
      } else if (aduccionCaderas.derecha.grado === "M") {
        doc.text("X", xCaderasDerechaM, yCaderasAduccionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos de las caderas - Rotación Interna
  if (datosFinales.examenFisico?.caderas?.rotacionInterna) {
    const rotacionInternaCaderas = datosFinales.examenFisico.caderas.rotacionInterna;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (rotacionInternaCaderas.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (rotacionInternaCaderas.izquierda.grado === "N") {
        doc.text("X", xCaderasIzquierdaN, yCaderasRotacionInternaIzquierda); // X en N (Normal) - Izquierda
      } else if (rotacionInternaCaderas.izquierda.grado === "R") {
        doc.text("X", xCaderasIzquierdaR, yCaderasRotacionInternaIzquierda); // X en R (Reducido) - Izquierda
      } else if (rotacionInternaCaderas.izquierda.grado === "M") {
        doc.text("X", xCaderasIzquierdaM, yCaderasRotacionInternaIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (rotacionInternaCaderas.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (rotacionInternaCaderas.derecha.grado === "N") {
        doc.text("X", xCaderasDerechaN, yCaderasRotacionInternaDerecha); // X en N (Normal) - Derecha
      } else if (rotacionInternaCaderas.derecha.grado === "R") {
        doc.text("X", xCaderasDerechaR, yCaderasRotacionInternaDerecha); // X en R (Reducido) - Derecha
      } else if (rotacionInternaCaderas.derecha.grado === "M") {
        doc.text("X", xCaderasDerechaM, yCaderasRotacionInternaDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos de las caderas - Rotación Externa
  if (datosFinales.examenFisico?.caderas?.rotacionExterna) {
    const rotacionExternaCaderas = datosFinales.examenFisico.caderas.rotacionExterna;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (rotacionExternaCaderas.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (rotacionExternaCaderas.izquierda.grado === "N") {
        doc.text("X", xCaderasIzquierdaN, yCaderasRotacionExternaIzquierda); // X en N (Normal) - Izquierda
      } else if (rotacionExternaCaderas.izquierda.grado === "R") {
        doc.text("X", xCaderasIzquierdaR, yCaderasRotacionExternaIzquierda); // X en R (Reducido) - Izquierda
      } else if (rotacionExternaCaderas.izquierda.grado === "M") {
        doc.text("X", xCaderasIzquierdaM, yCaderasRotacionExternaIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (rotacionExternaCaderas.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (rotacionExternaCaderas.derecha.grado === "N") {
        doc.text("X", xCaderasDerechaN, yCaderasRotacionExternaDerecha); // X en N (Normal) - Derecha
      } else if (rotacionExternaCaderas.derecha.grado === "R") {
        doc.text("X", xCaderasDerechaR, yCaderasRotacionExternaDerecha); // X en R (Reducido) - Derecha
      } else if (rotacionExternaCaderas.derecha.grado === "M") {
        doc.text("X", xCaderasDerechaM, yCaderasRotacionExternaDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === PÁGINA 2 ===
  doc.addPage();
  
  // === SECCIÓN: PIERNA (MIEMBROS INFERIORES) ===
  // Posiciones X individuales para cada lado de la pierna
  // IZQUIERDA
  const xPiernaIzquierdaN = margin + 28.4; // Posición X para grado N (Normal) - Izquierda
  const xPiernaIzquierdaR = margin + 45.4; // Posición X para grado R (Reducido) - Izquierda
  const xPiernaIzquierdaM = margin + 63.2; // Posición X para grado M (Marcado) - Izquierda
  
  // DERECHA
  const xPiernaDerechaN = margin + 141; // Posición X para grado N (Normal) - Derecha
  const xPiernaDerechaR = margin + 160; // Posición X para grado R (Reducido) - Derecha
  const xPiernaDerechaM = margin + 178.5; // Posición X para grado M (Marcado) - Derecha
  
  // Posiciones Y individuales para cada lado de la pierna
  const yPiernaFlexionIzquierda = margin + 21; // Posición Y para flexión izquierda de la pierna
  const yPiernaFlexionDerecha = margin + 21; // Posición Y para flexión derecha de la pierna
  const yPiernaExtensionIzquierda = margin + 26.4; // Posición Y para extensión izquierda de la pierna
  const yPiernaExtensionDerecha = margin + 26.4; // Posición Y para extensión derecha de la pierna

  // === SECCIÓN: RODILLA (MIEMBROS INFERIORES) ===
  // Posiciones X individuales para cada lado de la rodilla
  // IZQUIERDA
  const xRodillaIzquierdaN = margin + 28.4; // Posición X para grado N (Normal) - Izquierda
  const xRodillaIzquierdaR = margin + 45.4; // Posición X para grado R (Reducido) - Izquierda
  const xRodillaIzquierdaM = margin + 63.2; // Posición X para grado M (Marcado) - Izquierda
  
  // DERECHA
  const xRodillaDerechaN = margin + 141; // Posición X para grado N (Normal) - Derecha
  const xRodillaDerechaR = margin + 160; // Posición X para grado R (Reducido) - Derecha
  const xRodillaDerechaM = margin + 178.5; // Posición X para grado M (Marcado) - Derecha
  
  // Posiciones Y individuales para cada lado de la rodilla
  const yRodillaFlexionIzquierda = margin + 38; // Posición Y para flexión izquierda de la rodilla
  const yRodillaFlexionDerecha = margin + 38; // Posición Y para flexión derecha de la rodilla
  const yRodillaExtensionIzquierda = margin + 43.4; // Posición Y para extensión izquierda de la rodilla
  const yRodillaExtensionDerecha = margin + 43.4; // Posición Y para extensión derecha de la rodilla
  const yRodillaRotacionInternaIzquierda = margin + 48.8; // Posición Y para rotación interna izquierda de la rodilla
  const yRodillaRotacionInternaDerecha = margin + 48.8; // Posición Y para rotación interna derecha de la rodilla
  const yRodillaRotacionExternaIzquierda = margin + 54; // Posición Y para rotación externa izquierda de la rodilla
  const yRodillaRotacionExternaDerecha = margin + 54; // Posición Y para rotación externa derecha de la rodilla

  // === SECCIÓN: TOBILLO (MIEMBROS INFERIORES) ===
  // Posiciones X individuales para cada lado del tobillo
  // IZQUIERDA
  const xTobilloIzquierdaN = margin + 28.4; // Posición X para grado N (Normal) - Izquierda
  const xTobilloIzquierdaR = margin + 45.4; // Posición X para grado R (Reducido) - Izquierda
  const xTobilloIzquierdaM = margin + 63.2; // Posición X para grado M (Marcado) - Izquierda
  
  // DERECHA
  const xTobilloDerechaN = margin + 141; // Posición X para grado N (Normal) - Derecha
  const xTobilloDerechaR = margin + 160; // Posición X para grado R (Reducido) - Derecha
  const xTobilloDerechaM = margin + 178.5; // Posición X para grado M (Marcado) - Derecha
  
  // Posiciones Y individuales para cada lado del tobillo
  const yTobilloFlexionIzquierda = margin + 67; // Posición Y para flexión izquierda del tobillo
  const yTobilloFlexionDerecha = margin + 67; // Posición Y para flexión derecha del tobillo
  const yTobilloExtensionIzquierda = margin + 72.4; // Posición Y para extensión izquierda del tobillo
  const yTobilloExtensionDerecha = margin + 72.4; // Posición Y para extensión derecha del tobillo

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

  // === SECCIÓN: PIERNA (MIEMBROS INFERIORES) ===
  
  // Datos de la pierna - Flexión
  if (datosFinales.examenFisico?.pierna?.flexion) {
    const flexionPierna = datosFinales.examenFisico.pierna.flexion;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (flexionPierna.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionPierna.izquierda.grado === "N") {
        doc.text("X", xPiernaIzquierdaN, yPiernaFlexionIzquierda); // X en N (Normal) - Izquierda
      } else if (flexionPierna.izquierda.grado === "R") {
        doc.text("X", xPiernaIzquierdaR, yPiernaFlexionIzquierda); // X en R (Reducido) - Izquierda
      } else if (flexionPierna.izquierda.grado === "M") {
        doc.text("X", xPiernaIzquierdaM, yPiernaFlexionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (flexionPierna.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionPierna.derecha.grado === "N") {
        doc.text("X", xPiernaDerechaN, yPiernaFlexionDerecha); // X en N (Normal) - Derecha
      } else if (flexionPierna.derecha.grado === "R") {
        doc.text("X", xPiernaDerechaR, yPiernaFlexionDerecha); // X en R (Reducido) - Derecha
      } else if (flexionPierna.derecha.grado === "M") {
        doc.text("X", xPiernaDerechaM, yPiernaFlexionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos de la pierna - Extensión
  if (datosFinales.examenFisico?.pierna?.extension) {
    const extensionPierna = datosFinales.examenFisico.pierna.extension;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (extensionPierna.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionPierna.izquierda.grado === "N") {
        doc.text("X", xPiernaIzquierdaN, yPiernaExtensionIzquierda); // X en N (Normal) - Izquierda
      } else if (extensionPierna.izquierda.grado === "R") {
        doc.text("X", xPiernaIzquierdaR, yPiernaExtensionIzquierda); // X en R (Reducido) - Izquierda
      } else if (extensionPierna.izquierda.grado === "M") {
        doc.text("X", xPiernaIzquierdaM, yPiernaExtensionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (extensionPierna.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionPierna.derecha.grado === "N") {
        doc.text("X", xPiernaDerechaN, yPiernaExtensionDerecha); // X en N (Normal) - Derecha
      } else if (extensionPierna.derecha.grado === "R") {
        doc.text("X", xPiernaDerechaR, yPiernaExtensionDerecha); // X en R (Reducido) - Derecha
      } else if (extensionPierna.derecha.grado === "M") {
        doc.text("X", xPiernaDerechaM, yPiernaExtensionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: RODILLA (MIEMBROS INFERIORES) ===
  
  // Datos de la rodilla - Flexión
  if (datosFinales.examenFisico?.rodilla?.flexion) {
    const flexionRodilla = datosFinales.examenFisico.rodilla.flexion;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (flexionRodilla.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionRodilla.izquierda.grado === "N") {
        doc.text("X", xRodillaIzquierdaN, yRodillaFlexionIzquierda); // X en N (Normal) - Izquierda
      } else if (flexionRodilla.izquierda.grado === "R") {
        doc.text("X", xRodillaIzquierdaR, yRodillaFlexionIzquierda); // X en R (Reducido) - Izquierda
      } else if (flexionRodilla.izquierda.grado === "M") {
        doc.text("X", xRodillaIzquierdaM, yRodillaFlexionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (flexionRodilla.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionRodilla.derecha.grado === "N") {
        doc.text("X", xRodillaDerechaN, yRodillaFlexionDerecha); // X en N (Normal) - Derecha
      } else if (flexionRodilla.derecha.grado === "R") {
        doc.text("X", xRodillaDerechaR, yRodillaFlexionDerecha); // X en R (Reducido) - Derecha
      } else if (flexionRodilla.derecha.grado === "M") {
        doc.text("X", xRodillaDerechaM, yRodillaFlexionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos de la rodilla - Extensión
  if (datosFinales.examenFisico?.rodilla?.extension) {
    const extensionRodilla = datosFinales.examenFisico.rodilla.extension;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (extensionRodilla.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionRodilla.izquierda.grado === "N") {
        doc.text("X", xRodillaIzquierdaN, yRodillaExtensionIzquierda); // X en N (Normal) - Izquierda
      } else if (extensionRodilla.izquierda.grado === "R") {
        doc.text("X", xRodillaIzquierdaR, yRodillaExtensionIzquierda); // X en R (Reducido) - Izquierda
      } else if (extensionRodilla.izquierda.grado === "M") {
        doc.text("X", xRodillaIzquierdaM, yRodillaExtensionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (extensionRodilla.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionRodilla.derecha.grado === "N") {
        doc.text("X", xRodillaDerechaN, yRodillaExtensionDerecha); // X en N (Normal) - Derecha
      } else if (extensionRodilla.derecha.grado === "M") {
        doc.text("X", xRodillaDerechaM, yRodillaExtensionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos de la rodilla - Rotación Interna
  if (datosFinales.examenFisico?.rodilla?.rotacionInterna) {
    const rotacionInternaRodilla = datosFinales.examenFisico.rodilla.rotacionInterna;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (rotacionInternaRodilla.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (rotacionInternaRodilla.izquierda.grado === "N") {
        doc.text("X", xRodillaIzquierdaN, yRodillaRotacionInternaIzquierda); // X en N (Normal) - Izquierda
      } else if (rotacionInternaRodilla.izquierda.grado === "R") {
        doc.text("X", xRodillaIzquierdaR, yRodillaRotacionInternaIzquierda); // X en R (Reducido) - Izquierda
      } else if (rotacionInternaRodilla.izquierda.grado === "M") {
        doc.text("X", xRodillaIzquierdaM, yRodillaRotacionInternaIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (rotacionInternaRodilla.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (rotacionInternaRodilla.derecha.grado === "N") {
        doc.text("X", xRodillaDerechaN, yRodillaRotacionInternaDerecha); // X en N (Normal) - Derecha
      } else if (rotacionInternaRodilla.derecha.grado === "R") {
        doc.text("X", xRodillaDerechaR, yRodillaRotacionInternaDerecha); // X en R (Reducido) - Derecha
      } else if (rotacionInternaRodilla.derecha.grado === "M") {
        doc.text("X", xRodillaDerechaM, yRodillaRotacionInternaDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos de la rodilla - Rotación Externa
  if (datosFinales.examenFisico?.rodilla?.rotacionExterna) {
    const rotacionExternaRodilla = datosFinales.examenFisico.rodilla.rotacionExterna;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (rotacionExternaRodilla.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (rotacionExternaRodilla.izquierda.grado === "N") {
        doc.text("X", xRodillaIzquierdaN, yRodillaRotacionExternaIzquierda); // X en N (Normal) - Izquierda
      } else if (rotacionExternaRodilla.izquierda.grado === "R") {
        doc.text("X", xRodillaIzquierdaR, yRodillaRotacionExternaIzquierda); // X en R (Reducido) - Izquierda
      } else if (rotacionExternaRodilla.izquierda.grado === "M") {
        doc.text("X", xRodillaIzquierdaM, yRodillaRotacionExternaIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (rotacionExternaRodilla.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (rotacionExternaRodilla.derecha.grado === "N") {
        doc.text("X", xRodillaDerechaN, yRodillaRotacionExternaDerecha); // X en N (Normal) - Derecha
      } else if (rotacionExternaRodilla.derecha.grado === "R") {
        doc.text("X", xRodillaDerechaR, yRodillaRotacionExternaDerecha); // X en R (Reducido) - Derecha
      } else if (rotacionExternaRodilla.derecha.grado === "M") {
        doc.text("X", xRodillaDerechaM, yRodillaRotacionExternaDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }

  // === SECCIÓN: TOBILLO (MIEMBROS INFERIORES) ===
  
  // Datos del tobillo - Flexión
  if (datosFinales.examenFisico?.tobillo?.flexion) {
    const flexionTobillo = datosFinales.examenFisico.tobillo.flexion;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (flexionTobillo.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionTobillo.izquierda.grado === "N") {
        doc.text("X", xTobilloIzquierdaN, yTobilloFlexionIzquierda); // X en N (Normal) - Izquierda
      } else if (flexionTobillo.izquierda.grado === "R") {
        doc.text("X", xTobilloIzquierdaR, yTobilloFlexionIzquierda); // X en R (Reducido) - Izquierda
      } else if (flexionTobillo.izquierda.grado === "M") {
        doc.text("X", xTobilloIzquierdaM, yTobilloFlexionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (flexionTobillo.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (flexionTobillo.derecha.grado === "N") {
        doc.text("X", xTobilloDerechaN, yTobilloFlexionDerecha); // X en N (Normal) - Derecha
      } else if (flexionTobillo.derecha.grado === "R") {
        doc.text("X", xTobilloDerechaR, yTobilloFlexionDerecha); // X en R (Reducido) - Derecha
      } else if (flexionTobillo.derecha.grado === "M") {
        doc.text("X", xTobilloDerechaM, yTobilloFlexionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos del tobillo - Extensión
  if (datosFinales.examenFisico?.tobillo?.extension) {
    const extensionTobillo = datosFinales.examenFisico.tobillo.extension;
    
    // Marcar X en el grado correspondiente para IZQUIERDA
    if (extensionTobillo.izquierda) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionTobillo.izquierda.grado === "N") {
        doc.text("X", xTobilloIzquierdaN, yTobilloExtensionIzquierda); // X en N (Normal) - Izquierda
      } else if (extensionTobillo.izquierda.grado === "R") {
        doc.text("X", xTobilloIzquierdaR, yTobilloExtensionIzquierda); // X en R (Reducido) - Izquierda
      } else if (extensionTobillo.izquierda.grado === "M") {
        doc.text("X", xTobilloIzquierdaM, yTobilloExtensionIzquierda); // X en M (Marcado) - Izquierda
      }
    }
    
    // Marcar X en el grado correspondiente para DERECHA
    if (extensionTobillo.derecha) {
      doc.setTextColor(0, 0, 255); // Color azul para las X
      doc.setFont("helvetica", "bold").setFontSize(11);
      
      if (extensionTobillo.derecha.grado === "N") {
        doc.text("X", xTobilloDerechaM, yTobilloExtensionDerecha); // X en N (Normal) - Derecha
      } else if (extensionTobillo.derecha.grado === "R") {
        doc.text("X", xTobilloDerechaR, yTobilloExtensionDerecha); // X en R (Reducido) - Derecha
      } else if (extensionTobillo.derecha.grado === "M") {
        doc.text("X", xTobilloDerechaM, yTobilloExtensionDerecha); // X en M (Marcado) - Derecha
      }
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
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
