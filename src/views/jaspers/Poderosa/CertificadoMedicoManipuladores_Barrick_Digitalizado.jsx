import jsPDF from "jspdf";
import { formatearFechaCorta, formatearFechaLargaConDia } from "../../utils/formatDateUtils.js";
import { convertirGenero, getSign } from "../../utils/helpers.js";
import { calcularAlturaTextoCreciente } from "../../utils/formatoParaTextoCrecienteFila.js";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function ficha_antecedente_patologico_boro_nuevo(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente || "CASTILLO PLASENCIA") + " " + (data.nombresPaciente || "HADY KATHERINE")).trim(),
    fechaExamen: formatearFechaCorta(data.fechaExamen || new Date().toISOString().split('T')[0]),
    fechaExamenCompleta: formatearFechaLargaConDia(data.fechaExamen || new Date().toISOString().split('T')[0]),
    tipoExamen: String(data.nombreExamen || "EXAMEN MEDICO OCUPACIONAL"),
    sexo: convertirGenero(data.sexoPaciente || "F"),
    documentoIdentidad: String(data.dniPaciente || "72384273"),
    edad: String(data.edadPaciente || "31"),
    areaTrabajo: data.areaPaciente || "OPERACIONES",
    puestoTrabajo: data.cargoPaciente || "DAD",
    empresa: data.empresa || "MINERA BOROO MISQUICHILCA S.A.",
    contrata: data.contrata || "N/A",
    // Datos de color
    color: data.color || 1534,
    codigoColor: data.codigoColor || "",
    textoColor: data.textoColor || " ",
    // Datos adicionales para header
    numeroFicha: String(data.norden || "96639"),
    sede: data.sede || data.nombreSede || "TRUJILLO-NICOLAS DE PIEROLA",
    // Datos específicos
    direccionPaciente: String(data.direccionPaciente || "SAC1 URB PARQUE INDUSTRIAL MZ D LT 3"),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente || "1994-01-23"),
    // Datos adicionales para nueva fila
    lugar: data.lugarExperiencia_lugar_expe || "",
    anosExperiencia: data.tiempoExperiencia || null,
    altura: data.altura_txtaltura || "",
    // Datos de digitalización
    digitalizacion: data.digitalizacion || [],
    // Datos del certificado
    aptitud: data.noApto ? "NO APTO" : (data.apto ? "APTO" : "APTO"),
    consideracion: data.consideracion || "",
    observaciones: data.observaciones || "",
    recomendaciones: data.recomendaciones || "",
  };

  // Usar solo datos reales proporcionados
  const datosFinales = datosReales;

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (en todas las páginas)
    doc.setFont("helvetica", "bold").setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("CERTIFICADO MEDICO DE BUENA SALUD PARA", pageW / 2, 41, { align: "center" });
    doc.text("MANIPULADORES DE ALIMENTOS - PROTOCOLO BARRICK", pageW / 2, 46.5, { align: "center" });

    // Número de Ficha y Página (alineación automática mejorada)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 60, 16);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosFinales.sede, pageW - 80, 20);
    doc.text("Fecha de examen: " + datosFinales.fechaExamen, pageW - 80, 25);

    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 30, 10);

    // Bloque de color (posición mejorada)
    drawColorBox(doc, {
      color: datosFinales.codigoColor,
      text: datosFinales.textoColor,
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  };

  // === DIBUJAR HEADER ===
  drawHeader(1);

  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea y datos en negrita
  const dibujarTextoConSaltoLineaYBold = (textoBase, datos, x, y, anchoMaximo, fontSize = 11) => {
    if (!textoBase) return y;
    doc.setFontSize(fontSize);
    const interlineado = fontSize * 0.4;
    let yPos = y;
    
    // Dividir el texto en partes: texto normal y datos (que van en negrita)
    const partes = [];
    const regex = /\{([^}]+)\}/g;
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(textoBase)) !== null) {
      if (match.index > lastIndex) {
        partes.push({ tipo: 'texto', contenido: textoBase.substring(lastIndex, match.index) });
      }
      partes.push({ tipo: 'dato', contenido: datos[match[1]] || '' });
      lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < textoBase.length) {
      partes.push({ tipo: 'texto', contenido: textoBase.substring(lastIndex) });
    }
    
    // Si no hay marcadores, usar el texto completo como texto normal
    if (partes.length === 0) {
      partes.push({ tipo: 'texto', contenido: textoBase });
    }
    
    // Construir líneas con datos en negrita
    let lineaActual = [];
    let anchoLineaActual = 0;
    const espacioAncho = doc.getTextWidth(' ');
    
    partes.forEach(parte => {
      const esDato = parte.tipo === 'dato';
      const palabras = parte.contenido.split(' ');
      
      palabras.forEach(palabra => {
        doc.setFont("helvetica", esDato ? "bold" : "normal");
        const anchoPalabra = doc.getTextWidth(palabra);
        const espacioNecesario = lineaActual.length > 0 ? espacioAncho : 0;
        const anchoTotal = anchoLineaActual + espacioNecesario + anchoPalabra;
        
        // Si la palabra sola es más larga que el ancho máximo, dividirla
        if (anchoPalabra > anchoMaximo) {
          // Dibujar línea actual si hay contenido
          if (lineaActual.length > 0) {
            let xActual = x;
            lineaActual.forEach(item => {
              doc.setFont("helvetica", item.esDato ? "bold" : "normal");
              doc.text(item.texto, xActual, yPos);
              xActual += doc.getTextWidth(item.texto) + espacioAncho;
            });
            yPos += interlineado;
            lineaActual = [];
            anchoLineaActual = 0;
          }
          // Dividir palabra en caracteres
          let palabraRestante = palabra;
          while (palabraRestante.length > 0) {
            let caracteres = '';
            for (let i = 0; i < palabraRestante.length; i++) {
              const testCaracteres = caracteres + palabraRestante[i];
              if (doc.getTextWidth(testCaracteres) <= anchoMaximo) {
                caracteres = testCaracteres;
              } else {
                break;
              }
            }
            if (caracteres.length === 0) {
              caracteres = palabraRestante[0];
            }
            doc.setFont("helvetica", esDato ? "bold" : "normal");
            doc.text(caracteres, x, yPos);
            yPos += interlineado;
            palabraRestante = palabraRestante.substring(caracteres.length);
          }
        } else if (anchoTotal <= anchoMaximo) {
          lineaActual.push({ texto: palabra, esDato: esDato });
          anchoLineaActual = anchoTotal;
        } else {
          // Dibujar línea actual
          if (lineaActual.length > 0) {
            let xActual = x;
            lineaActual.forEach(item => {
              doc.setFont("helvetica", item.esDato ? "bold" : "normal");
              doc.text(item.texto, xActual, yPos);
              xActual += doc.getTextWidth(item.texto) + espacioAncho;
            });
            yPos += interlineado;
          }
          // Nueva línea con esta palabra
          lineaActual = [{ texto: palabra, esDato: esDato }];
          anchoLineaActual = anchoPalabra;
        }
      });
    });
    
    // Dibujar última línea
    if (lineaActual.length > 0) {
      let xActual = x;
      lineaActual.forEach(item => {
        doc.setFont("helvetica", item.esDato ? "bold" : "normal");
        doc.text(item.texto, xActual, yPos);
        xActual += doc.getTextWidth(item.texto) + espacioAncho;
      });
    }
    
    return yPos;
  };

  // Función para texto con salto de línea (sin negrita)
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo, fontSize = 10) => {
    if (!texto) return y;
    // Asegurar que el tamaño de fuente esté configurado
    doc.setFontSize(fontSize);
    const palabras = texto.split(' ');
    let lineaActual = '';
    let yPos = y;
    const interlineado = fontSize * 0.4;
    
    palabras.forEach(palabra => {
      const anchoPalabra = doc.getTextWidth(palabra);
      
      // Si la palabra sola es más larga que el ancho máximo, dividirla
      if (anchoPalabra > anchoMaximo) {
        // Dibujar línea actual si hay contenido
        if (lineaActual) {
          doc.text(lineaActual, x, yPos);
          yPos += interlineado;
          lineaActual = '';
        }
        // Dividir palabra en caracteres
        let palabraRestante = palabra;
        while (palabraRestante.length > 0) {
          let caracteres = '';
          for (let i = 0; i < palabraRestante.length; i++) {
            const testCaracteres = caracteres + palabraRestante[i];
            if (doc.getTextWidth(testCaracteres) <= anchoMaximo) {
              caracteres = testCaracteres;
            } else {
              break;
            }
          }
          if (caracteres.length === 0) {
            caracteres = palabraRestante[0];
          }
          doc.text(caracteres, x, yPos);
          yPos += interlineado;
          palabraRestante = palabraRestante.substring(caracteres.length);
        }
      } else {
        const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
        const anchoTexto = doc.getTextWidth(textoPrueba);
        
        if (anchoTexto <= anchoMaximo) {
          lineaActual = textoPrueba;
        } else {
          if (lineaActual) {
            doc.text(lineaActual, x, yPos);
            yPos += interlineado;
            lineaActual = palabra;
          } else {
            doc.text(palabra, x, yPos);
            yPos += interlineado;
          }
        }
      }
    });
    
    if (lineaActual) {
      doc.text(lineaActual, x, yPos);
    }
    
    return yPos;
  };

  // Función para texto justificado
  const dibujarTextoJustificado = (texto, x, y, anchoMaximo, fontSize = 10) => {
    if (!texto) return y;
    doc.setFontSize(fontSize);
    const interlineado = fontSize * 0.4;
    const palabras = texto.split(' ');
    let lineas = [];
    let lineaActual = '';
    
    // Dividir en líneas
    palabras.forEach(palabra => {
      const anchoPalabra = doc.getTextWidth(palabra);
      
      // Si la palabra sola es más larga que el ancho máximo, dividirla
      if (anchoPalabra > anchoMaximo) {
        // Guardar línea actual si hay contenido
        if (lineaActual) {
          lineas.push(lineaActual);
          lineaActual = '';
        }
        // Dividir palabra en caracteres
        let palabraRestante = palabra;
        while (palabraRestante.length > 0) {
          let caracteres = '';
          for (let i = 0; i < palabraRestante.length; i++) {
            const testCaracteres = caracteres + palabraRestante[i];
            if (doc.getTextWidth(testCaracteres) <= anchoMaximo) {
              caracteres = testCaracteres;
            } else {
              break;
            }
          }
          if (caracteres.length === 0) {
            caracteres = palabraRestante[0];
          }
          lineas.push(caracteres);
          palabraRestante = palabraRestante.substring(caracteres.length);
        }
      } else {
        const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
        const anchoTexto = doc.getTextWidth(textoPrueba);
        
        if (anchoTexto <= anchoMaximo) {
          lineaActual = textoPrueba;
        } else {
          if (lineaActual) {
            lineas.push(lineaActual);
            lineaActual = palabra;
          } else {
            lineas.push(palabra);
            lineaActual = '';
          }
        }
      }
    });
    
    if (lineaActual) {
      lineas.push(lineaActual);
    }
    
    // Dibujar líneas justificadas
    let yPos = y;
    lineas.forEach((linea, index) => {
      if (index === lineas.length - 1) {
        // Última línea no se justifica
        doc.text(linea, x, yPos);
      } else {
        // Justificar línea
        const palabrasLinea = linea.split(' ');
        if (palabrasLinea.length > 1) {
          const anchoLinea = doc.getTextWidth(linea);
          const espacioExtra = anchoMaximo - anchoLinea;
          const espaciosEntrePalabras = espacioExtra / (palabrasLinea.length - 1);
          
          let xPos = x;
          palabrasLinea.forEach((palabra, i) => {
            doc.text(palabra, xPos, yPos);
            if (i < palabrasLinea.length - 1) {
              xPos += doc.getTextWidth(palabra + ' ') + espaciosEntrePalabras;
            }
          });
        } else {
          doc.text(linea, x, yPos);
        }
      }
      yPos += interlineado;
    });
    
    return yPos;
  };

  // === CONTENIDO DEL CERTIFICADO ===
  const tablaInicioX = 25;
  const tablaAncho = 165;
  let yPos = 65; // Posición inicial después del título

  // Texto completo del párrafo (todo en uno para mantener interlineado consistente)
  doc.setFont("helvetica", "normal").setFontSize(11);
  const textoCompleto = "El que suscribe en representación de Corporación Peruana de Centros Médicos S.A.C. con RUC 20477167561, Certifica que: Sr.(a): {apellidosNombres} identificado con DNI: {documentoIdentidad}, postulante al cargo de {puestoTrabajo} colaborador de la empresa {empresa} para el cargo que postula ha sido declarado {aptitud} de acuerdo a los resultados obtenidos en los examenes de laboratorio clínico y Evaluación Médica General realizado en el POLICLINICO HORIZONTE MEDIC.";
  yPos = dibujarTextoConSaltoLineaYBold(textoCompleto, datosFinales, tablaInicioX, yPos, tablaAncho, 11);
  yPos += 10; // Separación antes de "Se anexan los resultados..."

  // Se anexan los resultados
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("Se anexan los resultados al final del presente documento.", tablaInicioX, yPos);
  yPos += 10; // Separación antes de "Considerandolo(a)"

  // Considerandolo(a)
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("Considerandolo(a): ", tablaInicioX, yPos);
  if (datosFinales.consideracion) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    // Usar función de texto justificado
    yPos = dibujarTextoJustificado(datosFinales.consideracion, tablaInicioX + 35, yPos, tablaAncho - 35, 10);
  } else {
    yPos += 2;
  }
  yPos += 10; // Separación de 10mm antes de OBSERVACIONES

  // Observaciones con texto creciente
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("OBSERVACIONES:", tablaInicioX, yPos);
  yPos += 1;
  
  if (datosFinales.observaciones) {
    // Establecer fontSize 10 antes de calcular altura
    doc.setFontSize(9);
    const alturaObservaciones = calcularAlturaTextoCreciente(doc, datosFinales.observaciones, tablaAncho - 4, 9);
    const alturaMinimaObs = Math.max(15, alturaObservaciones + 4);
    
    // Dibujar texto de observaciones en normal y justificado
    doc.setFont("helvetica", "normal").setFontSize(9);
    // Usar función de texto justificado
    dibujarTextoJustificado(datosFinales.observaciones, tablaInicioX, yPos + 4, tablaAncho - 4, 9); 
    // Restaurar tamaño de fuente después de dibujar
    doc.setFontSize(9);
    yPos += alturaMinimaObs;
  } else {
    const alturaMinimaObs = 15;
    yPos += alturaMinimaObs;
  }
  yPos += 10; // Separación de 10mm antes de RECOMENDACIONES

  // Recomendaciones con texto creciente
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("RECOMENDACIONES:", tablaInicioX, yPos);
  yPos += 1;
  
  if (datosFinales.recomendaciones) {
    // Establecer fontSize 10 antes de calcular altura
    doc.setFontSize(9);
    const alturaRecomendaciones = calcularAlturaTextoCreciente(doc, datosFinales.recomendaciones, tablaAncho - 4, 9);
    const alturaMinimaRec = Math.max(15, alturaRecomendaciones + 4);
    
    // Dibujar texto de recomendaciones en normal y justificado
    doc.setFont("helvetica", "normal").setFontSize(9);
    // Usar función de texto justificado
    dibujarTextoJustificado(datosFinales.recomendaciones, tablaInicioX, yPos + 4, tablaAncho - 4, 9);
    // Restaurar tamaño de fuente después de dibujar
    doc.setFontSize(9);
    yPos += alturaMinimaRec;
        } else {
    const alturaMinimaRec = 15;
    yPos += alturaMinimaRec;
  }
  yPos += 8;

  // Fecha al lado derecho (bajada 30mm y movida más a la izquierda)
  yPos += 30; // Bajar la fecha 30mm más
  const fechaTexto = datosFinales.fechaExamenCompleta || datosFinales.fechaExamen;
  doc.setFont("helvetica", "normal").setFontSize(10);
  // Mover la fecha más a la izquierda para aprovechar el margen de 165mm
  doc.text(`(${fechaTexto})`, tablaInicioX + tablaAncho - 10, yPos, { align: "right" });
  yPos += 10;

  // Firma y sello del médico (bajado 30mm más desde donde estaba)
  yPos += 15; // Bajar el bloque 30mm más (ya estaba 15mm abajo, ahora 30mm más = 45mm total)
  
  // Dibujar la firma primero (subida 1.5mm)
  const firmaMedicoY = yPos - 1.5; // Subir la firma 1.5mm
  let firmaMedicoUrl = getSign(data, "SELLOFIRMA");
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 50;
      const imgHeight = 25;
      const x = tablaInicioX + (tablaAncho / 2) - (imgWidth / 2);
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }
  
  // Posición para la línea y el texto
  const lineaY = yPos + 22;
  const textoY = lineaY + 4; // Bajado 1mm más (de 3 a 4)
  
  // Dibujar línea horizontal arriba del texto (ancho reducido)
  const lineaInicioX = tablaInicioX + (tablaAncho / 2) - 30; // Reducido de 40 a 30
  const lineaFinX = tablaInicioX + (tablaAncho / 2) + 30; // Reducido de 40 a 30
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(lineaInicioX, lineaY, lineaFinX, lineaY);
  
  // Dibujar texto debajo de la línea
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("Firma y sello del médico", tablaInicioX + (tablaAncho / 2), textoY, { align: "center" });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8});

  // === IMPRIMIR ===
  imprimir(doc);
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
