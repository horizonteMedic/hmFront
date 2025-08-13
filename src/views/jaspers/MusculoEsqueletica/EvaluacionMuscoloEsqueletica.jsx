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
  const xExamenFisico = margin + 30; // Posición X para examen físico
  const yExamenFisico = margin + 120; // Posición Y para examen físico
  
  // Posiciones para la tabla
  const xGrados = xExamenFisico + 60;
  const yInicioTabla = yExamenFisico + 10;
  
  // Datos de extensión
  const yExtension = yInicioTabla + 15;
  
  if (datosFinales.examenFisico?.cabezaCuello?.extension) {
    const extension = datosFinales.examenFisico.cabezaCuello.extension;
    
    // Mostrar texto de extensión
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(extension.texto || "", xGrados + 45, yExtension);
    
    // Marcar X en el grado correspondiente
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(10);
    
    if (extension.grado === "N") {
      doc.text("X", xGrados, yExtension); // X en N (Normal)
    } else if (extension.grado === "R") {
      doc.text("X", xGrados + 15, yExtension); // X en R (Reducido)
    } else if (extension.grado === "M") {
      doc.text("X", xGrados + 30, yExtension); // X en M (Marcado)
    }
    
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // Datos de flexión
  const yFlexion = yInicioTabla + 25;
  
  if (datosFinales.examenFisico?.cabezaCuello?.flexion) {
    const flexion = datosFinales.examenFisico.cabezaCuello.flexion;
    
    // Mostrar texto de flexión
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(flexion.texto || "", xGrados + 45, yFlexion);
    
    // Marcar X en el grado correspondiente
    doc.setTextColor(0, 0, 255); // Color azul para las X
    doc.setFont("helvetica", "bold").setFontSize(10);
    
    if (flexion.grado === "N") {
      doc.text("X", xGrados, yFlexion); // X en N (Normal)
    } else if (flexion.grado === "M") {
      doc.text("X", xGrados + 30, yFlexion); // X en M (Marcado)
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
