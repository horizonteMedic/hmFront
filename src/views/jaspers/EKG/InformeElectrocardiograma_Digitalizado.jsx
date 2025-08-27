import jsPDF from "jspdf";
import HeaderInformeElectrocardiograma from "./Header/header_InformeElectrocardiograma_Digitalizado.jsx";

export default function InformeElectrocardiograma_Digitalizado(data = {}) {
  // Datos de prueba por defecto
  const datosPrueba = {
    ritmo: "120",
    frecuencia: "1 x min",
    pr: "1",
    qrs: "1",
    qtc: "N/E",
    eje: "1°",
    hallazgo: "BRADICARDIA SINUSAL ASINTOMATICA.",
    recomendaciones: "EVALUACION ANUAL.",
    digitalizacion: [],
  };

  const datosReales = {
    ritmo: data.mensajeRitmo ?? "",
    frecuencia: data.mensajeFC ?? "",
    pr: data.mensajePr ?? "",
    qrs: data.mensajeQrs ?? "",
    qtc: data.mensajeQtC ?? "",
    eje: data.mensajeEje ?? "",
    hallazgo: data.hallazgo ?? "",
    recomendaciones: data.recomendaciones ?? "",
  };

  const datosFinales =
    data && Object.keys(data).length > 0 ? datosReales : datosPrueba;

  const doc = new jsPDF();
  const margin = 8;
  const leftMargin = margin + 25; // Margen izquierdo estándar
  const pageW = doc.internal.pageSize.getWidth();
  let y = 100;

  // 1) Header
  HeaderInformeElectrocardiograma(doc, data);

  // Función para obtener datos con valor por defecto
  const obtener = (name, defaultValue = "") => {
    return datosFinales[name] ?? defaultValue;
  };

  // -------------------------------
  // Función genérica para dibujar filas tipo "Label : Valor"
  function dibujarFilas(doc, rows, startX, startY, espaciado = 6) {
    const colLabelX = startX;
    const colPuntosX = startX + 35; // columna fija para los ':'
    const colValueX = startX + 45; // columna fija para los valores

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
  y = y + 8;
  const lineaDivisoriaY = y;
  const lineaDivisoriaW = pageW - 2 * leftMargin;
  const lineaDivisoriaX = leftMargin;

  doc.setLineWidth(0.3);
  doc.line(
    lineaDivisoriaX,
    lineaDivisoriaY,
    lineaDivisoriaX + lineaDivisoriaW,
    lineaDivisoriaY
  );
  y += 8;

  // -------------------------------
  // 3) Parámetros EKG
  const parametrosEKG = [
    { label: "RITMO", value: obtener("ritmo", "") },
    { label: "F.C.", value: obtener("frecuencia", "") },
    { label: "P.R.", value: obtener("pr", "") },
    { label: "Q.R.S.", value: obtener("qrs", "") },
    { label: "Q.T.C.", value: obtener("qtc", "") },
    { label: "EJE", value: obtener("eje", "") },
  ];
  y = dibujarFilas(doc, parametrosEKG, leftMargin, y);

  // -------------------------------
  // 4) Hallazgo y Recomendaciones
  y += 4; // Espacio después de los parámetros EKG

  // Función para dibujar sección con label y valor multilínea
  function dibujarSeccion(
    doc,
    label,
    value,
    startX,
    startY,
    maxWidth,
    isList = false
  ) {
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
          doc.text("•", valueX - 5, currentY + index * 3, { baseline: "top" });
          // Texto del item
          const lines = doc.splitTextToSize(item, maxWidth - 5); // Restar espacio de la viñeta
          lines.forEach((line, lineIndex) => {
            doc.text(line, valueX, currentY + index * 3 + lineIndex * 3, {
              baseline: "top",
            });
          });
          currentY += lines.length * 3;
        });
        return currentY + 3; // 3 puntos de separación
      } else {
        // Para hallazgos: texto normal
        const lines = doc.splitTextToSize(value, maxWidth);
        lines.forEach((line, index) => {
          doc.text(line, valueX, currentY + index * 3.5, { baseline: "top" });
        });

        // Retornar la posición Y final
        return currentY + lines.length * 3.5 + 3; // 3 puntos de separación
      }
    }

    return currentY + 4;
  }

  // Función para procesar recomendaciones y convertirlas en lista
  function procesarRecomendaciones(texto) {
    if (!texto) return [];

    // Dividir por puntos y limpiar
    let items = texto
      .split(".") // Dividir por puntos
      .map((item) => item.trim()) // Limpiar espacios
      .filter((item) => item.length > 0) // Eliminar items vacíos
      .map((item) => item + "."); // Agregar punto al final de cada item

    // Si no hay items, crear uno con el texto original
    if (items.length === 0) {
      items = [texto];
    }

    return items;
  }

  // Dibujar HALLAZGO
  const hallazgoValue = obtener("hallazgo");
  const hallazgoMaxWidth = pageW - (leftMargin + 45) - margin - 10;
  y = dibujarSeccion(
    doc,
    "HALLAZGO",
    hallazgoValue,
    leftMargin,
    y,
    hallazgoMaxWidth
  );

  // Dibujar RECOMENDACIONES
  const recomendacionesValue = obtener("recomendaciones");
  y = dibujarSeccion(
    doc,
    "RECOMENDACIONES",
    recomendacionesValue,
    leftMargin,
    y,
    hallazgoMaxWidth,
    true
  );

  // -------------------------------
  // 5) Sello Profesional
  y += 12; // Espacio después de las recomendaciones

  // Agregar sello profesional centrado
  const selloW = 60; // Ancho del sello
  const selloH = 30; // Alto del sello
  const selloX = pageW / 2 - selloW / 2; // Centrar horizontalmente

  // -------------------------------
  // 6) Footer con línea divisoria
  y += selloH + 8; // Espacio después del sello

  // Footer con información usando footerTR
  footerTR(doc, data);

  // Imprimir directamente sin esperar firmas
  const firmaSelloX = pageW - margin - 80; // Posición a la derecha
  const firmaSelloY = y - 20;

  const firmasAPintar = [
    {
      nombre: "SELLOFIRMA",
      x: selloX,
      y: firmaSelloY,
      maxw: 50,
    },
  ];

  // Validar que data.informacionSede exista antes de acceder a sus propiedades
  const digitalizacion = data?.digitalizacion || [];
  agregarFirmas(doc, digitalizacion, firmasAPintar).then(() => {
    imprimir(doc);
  });
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
  doc.text(`Cel. ${datos?.celTrujilloPie || ""}`, col2X + 29, col2Y);
  col2Y += 4;
  doc.text(`Cel. ${datos?.celHuamachuco || ""}`, col2X + 10, col2Y);

  //       COLUMNA 3
  let col3Y = baseY;
  doc.text(`${datos?.emailTruPierola || ""}`, col3X + 7, col3Y);
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

function agregarFirmas(doc, digitalizacion = [], firmasAPintar = []) {
  const addSello = (imagenUrl, x, y, maxw = 100) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imagenUrl;
      img.onload = () => {
        const sigH = 35; // alto máximo
        const maxW = maxw; // ancho máximo como parámetro
        const baseX = x;
        const baseY = y;

        let imgW = img.width;
        let imgH = img.height;

        // Escala proporcional en base a ancho y alto máximos
        const scale = Math.min(maxW / imgW, sigH / imgH, 1);
        imgW *= scale;
        imgH *= scale;

        // Ahora el ancho se adapta
        const sigW = imgW;

        // Centrar la imagen
        const imgX = baseX + (sigW - imgW) / 2;
        const imgY = baseY + (sigH - imgH) / 2;

        doc.addImage(imagenUrl, "PNG", imgX, imgY, imgW, imgH);
        resolve();
      };
      img.onerror = (e) => {
        console.error("Error al cargar la imagen:", e);
        resolve();
      };
    });
  };

  const firmas = digitalizacion.reduce(
    (acc, d) => ({ ...acc, [d.nombreDigitalizacion]: d.url }),
    {}
  );

  const promesasFirmas = firmasAPintar
    .filter((f) => firmas[f.nombre])
    .map((f) => addSello(firmas[f.nombre], f.x, f.y, f.maxw));

  return Promise.all(promesasFirmas);
}
