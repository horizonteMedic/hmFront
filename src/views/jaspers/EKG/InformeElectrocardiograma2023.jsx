import jsPDF from "jspdf";
import HeaderInformeElectrocardiogramaPoderosa from "./Header/header_InformeElectrocardiograma_DigitalizadoPoderosa.jsx";

export default function InformeElectrocardiograma2023(data = {}) {
  // Datos de prueba por defecto
  const datosPrueba = {
    ritmo: "2",
    frecuencia: "2 x min",
    eje: "2°",
    ondaP: "2 ms",
    segmentoPR: "2ms",
    ondaQRS: "2ms",
    segmentoST: "2",
    ondaT: "2",
    segmentoQT: "N/E2ms",
    observaciones: "BRADICARDIA SINUSAL ASINTOMATICA.",
    conclusion: "",
    recomendaciones: "EVALUACION ANUAL.\nEVALUACION EN 6 MESES.",
  };
  const datosReales = {
    ritmo: data.mensajeRitmo ?? "",
    frecuencia: `${data.mensajeFC ?? ""} x min`,
    eje: `${data.mensajeEje ?? ""} °`,
    ondaP: `${data.mensajeOndaP ?? ""} ms`,
    segmentoPR: `${data.mensajePr ?? ""} ms`,
    ondaQRS: `${data.mensajeQrs ?? ""} ms`,
    segmentoST: data.mensajeSt ?? "",
    ondaT: data.mensajeOndaT ?? "",
    segmentoQT: `${data.mensajeQtC ?? ""} ms`,
    observaciones: data.hallazgo ?? "",
    conclusion: data.conclusion ?? "",
    recomendaciones: data.recomendaciones ?? "",
  };

  // Combinar datos de prueba con datos reales
  const datosFinales =
    data && Object.keys(data).length > 0 ? datosReales : datosPrueba;

  const doc = new jsPDF();
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 80;

  // 1) Header
  HeaderInformeElectrocardiogramaPoderosa(doc, data);

  // Función para obtener datos con valor por defecto
  const obtener = (name, defaultValue = "") => {
    return datosFinales[name] ?? defaultValue;
  };

  // -------------------------------
  // Función genérica para dibujar filas tipo "Label : Valor"
  function dibujarFilas(doc, rows, startX, startY, espaciado = 5) {
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
  y = y + 30;
  // const lineaDivisoriaY = y;
  // const lineaDivisoriaW = pageW - 2 * (margin + 25);
  // const lineaDivisoriaX = margin + 25;

  // doc.setLineWidth(0.3);
  // doc.line(lineaDivisoriaX, lineaDivisoriaY, lineaDivisoriaX + lineaDivisoriaW, lineaDivisoriaY);
  // y += 10;

  // -------------------------------
  // 3) Parámetros EKG
  const parametrosEKG = [
    { label: "RITMO", value: obtener("ritmo", "") },
    { label: "FRECUENCIA", value: obtener("frecuencia", "") },
    { label: "EJE", value: obtener("eje", "") },
    { label: "ONDA P", value: obtener("ondaP", "") },
    { label: "SEGMENTO PR", value: obtener("segmentoPR", "") },
    { label: "ONDA QRS", value: obtener("ondaQRS", "") },
    { label: "SEGMENTO ST", value: obtener("segmentoST", "") },
    { label: "ONDA T", value: obtener("ondaT", "") },
    { label: "SEGMENTO QTC", value: obtener("segmentoQT", "") },
  ];
  y = dibujarFilas(doc, parametrosEKG, margin + 25, y);

  // -------------------------------
  // 4) Línea divisoria después de parámetros EKG
  y += 5;
  const lineaParametrosY = y;
  const lineaDivisoriaX = margin + 25;
  const lineaDivisoriaW = pageW - 2 * (margin + 25);
  doc.setLineWidth(0.3);
  doc.line(
    lineaDivisoriaX,
    lineaParametrosY,
    lineaDivisoriaX + lineaDivisoriaW,
    lineaParametrosY
  );
  y += 5;

  // -------------------------------
  // 5) Hallazgos
  const hallazgosValue = obtener("observaciones");

  // Label en negrita
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("HALLAZGOS", margin + 25, y, { baseline: "top" });

  // Dos puntos alineados
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(":", margin + 25 + 35, y, { baseline: "top" });

  // Valor
  const hallazgosX = margin + 25 + 45;
  const hallazgosMaxWidth = pageW - hallazgosX - margin - 10;

  if (hallazgosValue) {
    const lines = doc.splitTextToSize(hallazgosValue, hallazgosMaxWidth);

    lines.forEach((line, index) => {
      doc.text(line, hallazgosX, y + index * 3, { baseline: "top" });
    });

    y += lines.length * 3 + 5;
  } else {
    y += 5;
  }

  // -------------------------------
  // 6) Línea divisoria después de observaciones
  const lineaObservacionesY = y;
  doc.setLineWidth(0.3);
  doc.line(
    lineaDivisoriaX,
    lineaObservacionesY,
    lineaDivisoriaX + lineaDivisoriaW,
    lineaObservacionesY
  );
  y += 5;

  // -------------------------------
  // 7) Conclusión
  const conclusionValue = obtener("conclusion");

  // Label en negrita
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CONCLUSION", margin + 25, y, { baseline: "top" });

  // Dos puntos alineados
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(":", margin + 25 + 35, y, { baseline: "top" });

  // Valor
  const conclusionX = margin + 25 + 45;
  const conclusionMaxWidth = pageW - conclusionX - margin - 10;

  if (conclusionValue) {
    const lines = doc.splitTextToSize(conclusionValue, conclusionMaxWidth);

    lines.forEach((line, index) => {
      doc.text(line, conclusionX, y + index * 3, { baseline: "top" });
    });

    y += lines.length * 3 + 5;
  } else {
    y += 5;
  }

  // -------------------------------
  // 8) Línea divisoria después de conclusión
  const lineaConclusionY = y;
  doc.setLineWidth(0.3);
  doc.line(
    lineaDivisoriaX,
    lineaConclusionY,
    lineaDivisoriaX + lineaDivisoriaW,
    lineaConclusionY
  );
  y += 5;

  // -------------------------------
  // 9) Recomendaciones
  const recomendacionesValue = obtener("recomendaciones");
  if (recomendacionesValue) {
    // Label en negrita
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("RECOMENDACIONES:", margin + 25, y, { baseline: "top" });

    // Procesar recomendaciones como lista
    const items = procesarRecomendaciones(recomendacionesValue);
    const recomendacionesX = margin + 25 + 45;
    const recomendacionesMaxWidth = pageW - recomendacionesX - margin - 10;

    items.forEach((item, index) => {
      // Viñeta
      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.text("-", recomendacionesX - 5, y + index * 3, { baseline: "top" });

      // Texto del item
      const lines = doc.splitTextToSize(item, recomendacionesMaxWidth - 5);
      lines.forEach((line, lineIndex) => {
        doc.text(line, recomendacionesX, y + index * 3 + lineIndex * 2.5, {
          baseline: "top",
        });
      });

      y += lines.length * 2.5;
    });

    y += 5;
  }

  // -------------------------------
  // 10) Línea divisoria después de recomendaciones
  const lineaRecomendacionesY = y;
  doc.setLineWidth(0.3);
  doc.line(
    lineaDivisoriaX,
    lineaRecomendacionesY,
    lineaDivisoriaX + lineaDivisoriaW,
    lineaRecomendacionesY
  );
  y += 10;

  // -------------------------------
  // 11) Firma y Sello del Evaluador
  const firmaSelloX = pageW - margin - 80; // Posición a la derecha
  const firmaSelloY = y;

  const firmasAPintar = [
    {
      nombre: "SELLOFIRMA",
      x: firmaSelloX,
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
function procesarRecomendaciones(texto) {
  if (!texto) return [];

  // Dividir por saltos de línea y limpiar
  let items = texto
    .split("\n") // Dividir por saltos de línea
    .map((item) => item.trim()) // Limpiar espacios
    .filter((item) => item.length > 0) // Eliminar items vacíos
    .map((item) => (item.endsWith(".") ? item : item + ".")); // Agregar punto si no lo tiene

  // Si no hay items, crear uno con el texto original
  if (items.length === 0) {
    items = [texto];
  }

  return items;
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
