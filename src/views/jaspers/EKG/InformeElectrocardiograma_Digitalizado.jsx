import jsPDF from "jspdf";
import HeaderInformeElectrocardiograma from "./Header/header_InformeElectrocardiograma_Digitalizado.jsx";

export default function InformeElectrocardiograma_Digitalizado(data = {}) {
  // Datos de prueba por defecto
  const dataPrueba = {
    ritmo: "120",
    frecuencia: "1 x min",
    pr: "1",
    qrs: "1",
    qtc: "N/E",
    eje: "1°",
    hallazgo: "BRADICARDIA SINUSAL ASINTOMATICA.",
    recomendaciones: "EVALUACION ANUAL.",
    digitalizacion: []
  };

  // Combinar datos de prueba con datos reales
  const datosFinales = { ...dataPrueba, ...data };

  const doc = new jsPDF();
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 80;

  // 1) Header
  HeaderInformeElectrocardiograma(doc, datosFinales);

  // Función para obtener datos con valor por defecto
  const obtener = (name, defaultValue = "") => {
    return datosFinales[name] ?? defaultValue;
  };

  // -------------------------------
  // Función genérica para dibujar filas tipo "Label : Valor"
  function dibujarFilas(doc, rows, startX, startY, espaciado = 8) {
    const colLabelX = startX;
    const colPuntosX = startX + 35;  // columna fija para los ':'
    const colValueX = startX + 45;   // columna fija para los valores

    let y = startY;

    rows.forEach((row) => {
      // Label en negrita
      doc.setFont("helvetica", "bold").setFontSize(9);
      doc.text(row.label, colLabelX, y, { baseline: "top" });

      // Dos puntos
      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.text(":", colPuntosX, y, { baseline: "top" });

      // Valor
      doc.text(row.value, colValueX, y, { baseline: "top" });

      y += espaciado;
    });

    return y; // devuelve la Y final
  }

  // -------------------------------
  // 2) Línea divisoria después del header
  y = y + 10;
  const lineaDivisoriaY = y;
  const lineaDivisoriaW = pageW - 2 * (margin + 25);
  const lineaDivisoriaX = margin + 25;
  
  doc.setLineWidth(0.3);
  doc.line(lineaDivisoriaX, lineaDivisoriaY, lineaDivisoriaX + lineaDivisoriaW, lineaDivisoriaY);
  y += 8;

  // -------------------------------
  // 3) Parámetros EKG
  const parametrosEKG = [
    { label: "RITMO", value: obtener("ritmo", "120") },
    { label: "F.C.", value: obtener("frecuencia", "1 x min") },
    { label: "P.R.", value: obtener("pr", "1") },
    { label: "Q.R.S.", value: obtener("qrs", "1") },
    { label: "Q.T.C.", value: obtener("qtc", "N/E") },
    { label: "EJE", value: obtener("eje", "1°") }
  ];
  y = dibujarFilas(doc, parametrosEKG, margin + 25, y);

  // -------------------------------
  // 4) Hallazgo y Recomendaciones
  y += 8; // Espacio después de los parámetros EKG
  
  // Función para dibujar sección con label y valor multilínea
  function dibujarSeccion(doc, label, value, startX, startY, maxWidth, isList = false) {
    let currentY = startY;
    
    // Label en negrita
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(label, startX, currentY, { baseline: "top" });
    
    // Dos puntos alineados con los otros parámetros
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(":", startX + 35, currentY, { baseline: "top" });
    
    // Valor en normal
    doc.setFont("helvetica", "normal").setFontSize(9);
    const valueX = startX + 45; // Posición X para el valor
    
    if (value) {
              if (isList) {
          // Para recomendaciones: procesar como lista
          const items = procesarRecomendaciones(value);
          items.forEach((item, index) => {
            // Viñeta
            doc.text("•", valueX - 5, currentY + (index * 3), { baseline: "top" });
            // Texto del item
            const lines = doc.splitTextToSize(item, maxWidth - 5); // Restar espacio de la viñeta
            lines.forEach((line, lineIndex) => {
              doc.text(line, valueX, currentY + (index * 3) + (lineIndex * 3), { baseline: "top" });
            });
            currentY += (lines.length * 3);
          });
          return currentY + 5; // 5 puntos de separación
      } else {
        // Para hallazgos: texto normal
        const lines = doc.splitTextToSize(value, maxWidth);
        lines.forEach((line, index) => {
          doc.text(line, valueX, currentY + (index * 3.5), { baseline: "top" });
        });
        
        // Retornar la posición Y final
        return currentY + (lines.length * 3.5) + 5; // 5 puntos de separación
      }
    }
    
    return currentY + 8;
  }
  
  // Función para procesar recomendaciones y convertirlas en lista
  function procesarRecomendaciones(texto) {
    if (!texto) return [];
    
    // Dividir por puntos y limpiar
    let items = texto
      .split('.') // Dividir por puntos
      .map(item => item.trim()) // Limpiar espacios
      .filter(item => item.length > 0) // Eliminar items vacíos
      .map(item => item + '.'); // Agregar punto al final de cada item
    
    // Si no hay items, crear uno con el texto original
    if (items.length === 0) {
      items = [texto];
    }
    
    return items;
  }
  
  // Dibujar HALLAZGO
  const hallazgoValue = obtener("hallazgo");
  const hallazgoMaxWidth = pageW - (margin + 25 + 45) - margin - 10;
  y = dibujarSeccion(doc, "HALLAZGO", hallazgoValue, margin + 25, y, hallazgoMaxWidth);
  
  // Dibujar RECOMENDACIONES
  const recomendacionesValue = obtener("recomendaciones");
  y = dibujarSeccion(doc, "RECOMENDACIONES", recomendacionesValue, margin + 25, y, hallazgoMaxWidth, true);

  // -------------------------------
  // 5) Sello Profesional
  y += 20; // Espacio después de las recomendaciones
  
  // Agregar sello profesional centrado
  const selloY = y;
  const selloW = 60;// Ancho del sello
  const selloH = 30; // Alto del sello
  const selloX = pageW / 2 - selloW / 2; // Centrar horizontalmente
  
  try {
    doc.addImage("./img/firmas_sellos_prueba/SELLOPRUEBA.png", "PNG", selloX, selloY, selloW, selloH);
  } catch (error) {
    console.error("Error al cargar el sello:", error);
    // Fallback: dibujar un rectángulo con texto
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(selloX, selloY, selloW, selloH);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("SELLO", selloX + selloW/2, selloY + selloH/2, {
      align: "center",
      baseline: "middle"
    });
  }

  // -------------------------------
  // 6) Footer con línea divisoria
  y += selloH + 15; // Espacio después del sello
  

  // Footer con información usando footerTR
  footerTR(doc, datosFinales);

  // Imprimir directamente sin esperar firmas
  imprimir(doc);
}

// -------------------------------
// Helpers
function footerTR(doc, datos) {
  const pageHeight = doc.internal.pageSize.getHeight();
  // Aumenta el margen inferior si hace falta (ej. 30 en lugar de 20)
  const marginBottom = 25;
  // Posición base para el footer
  const baseY = pageHeight - marginBottom;
  const col1X = 15;
  const col2X = 70;
  const col3X = 120;
  const col4X = 175;

  // Ajustamos la fuente a 8 y color a negro
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);

  //       COLUMNA 1
  let col1Y = baseY;
  doc.text(`${datos?.dirTruPierola || ""}`, col1X, col1Y);
  col1Y += 4;
  doc.text(`${datos?.dirHuamachuco || ""}`, col1X, col1Y);
  col1Y += 4;
  doc.text(`${datos?.dirHuancayo || ""}`, col1X, col1Y);
  col1Y += 4;
  doc.text(`${datos?.dirTrujillo || ""}`, col1X, col1Y);

  //       COLUMNA 2
  let col2Y = baseY;
  doc.text(`Cel. ${datos?.celTrujilloPie || ""}`, col2X+29, col2Y);
  col2Y += 4;
  doc.text(`Cel. ${datos?.celHuamachuco || ""}`, col2X+10, col2Y);

  //       COLUMNA 3
  let col3Y = baseY;
  doc.text(`${datos?.emailTruPierola || ""}`, col3X+7, col3Y);
  col3Y += 4;
  doc.text(`${datos?.emailHuancayo || ""}`, col3X, col3Y);

  //       COLUMNA 4
  let col4Y = baseY;
  doc.text(`Telf. ${datos?.telfTruPierola || ""}`, col4X, col4Y);
  col4Y += 4;
  doc.text(`Telf. ${datos?.telfHuamachuco || ""}`, col4X, col4Y);
  col4Y += 4;
  doc.text(`Telf. ${datos?.telfHuancayo || ""}`, col4X, col4Y);
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
