import jsPDF from "jspdf";
import HeaderRagiografiaToraxPA from "./Headers/header_RagiografiaToraxPA_Digitalizado.jsx";

export default function RagiografiaToraxPA_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF();
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 100;

  // 1) Header
  HeaderRagiografiaToraxPA(doc, data);

  // Función para obtener datos con valor por defecto
  const obtener = (name, defaultValue = "") => {
    return data[name] ?? defaultValue;
  };

  // Datos del reporte
  const datos = {
    vertices: obtener("vertices", "").toUpperCase(),
    hilios: obtener("hilios", "").toUpperCase(),
    senosCostofrenicos: obtener("senosCostofrenicos", "").toUpperCase(),
    camposPulmonares: obtener("camposPulmonares", "").toUpperCase(),
    mediastinos: obtener("mediastinos", "").toUpperCase(),
    siluetaCardiovascular: obtener("siluetaCardiovascular", "").toUpperCase(),
    osteomuscular: obtener("osteomuscular", "").toUpperCase(),
    conclusionesRadiograficas: obtener(
      "conclusionesRadiograficas",
      ""
    ).toUpperCase(),
    observaciones: obtener("observacionesRadiografiaTorax", "").toUpperCase(),
  };

  // 2) Título del informe
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("INFORME", pageW / 2, y, { align: "center" });
  y += 10;

  // 3) Subtítulo
  doc.setFont("helvetica", "normal").setFontSize(10);
  const subtitulo =
    "LA RADIOGRAFÍA DE TÓRAX EN LA INCIDENCIA POSTERIOR-ANTERIOR MUESTRA";
  doc.text(subtitulo, pageW / 2, y, { align: "center" });
  y += 14;

  // 4) Tabla de hallazgos
  const tableX = margin + 10;
  const tableW = pageW - 2 * (margin + 10);
  const tableY = y;
  const rowHeight = 8;

  // Datos de la tabla
  const tablaDatos = [
    { categoria: "VÉRTICES", hallazgo: datos.vertices },
    { categoria: "HILIOS", hallazgo: datos.hilios },
    { categoria: "SENOS COSTOFRENICOS", hallazgo: datos.senosCostofrenicos },
    { categoria: "CAMPOS PULMONARES", hallazgo: datos.camposPulmonares },
    { categoria: "MEDIASTINOS", hallazgo: datos.mediastinos },
    {
      categoria: "SILUETA CARDIOVASCULAR",
      hallazgo: datos.siluetaCardiovascular,
    },
    { categoria: "OSTEOMUSCULAR", hallazgo: datos.osteomuscular },
    {
      categoria: "CONCLUSIONES RADIOGRÁFICAS",
      hallazgo: datos.conclusionesRadiograficas,
    },
    { categoria: "OBSERVACIONES", hallazgo: datos.observaciones },
  ];

  // Calcular la altura real de cada fila basada en el contenido
  const filasAlturas = [];
  let alturaTotal = 0;

  tablaDatos.forEach((fila) => {
    const hallazgoW = (tableW * 0.55) - 10; // Ancho de la columna derecha
    const maxWidth = hallazgoW * 0.95; // Aumentado de 0.9 a 0.95 para más ancho

    // Dividir texto en líneas
    const hallazgoLines = doc.splitTextToSize(fila.hallazgo, maxWidth);

    // Calcular altura dinámica para cada fila
    const lineHeight = 4; // Altura por línea
    const minHeight = rowHeight; // Altura mínima
    const dynamicHeight = Math.max(
      minHeight,
      hallazgoLines.length * lineHeight + 4
    );

    filasAlturas.push({
      ...fila,
      lines: hallazgoLines,
      height: dynamicHeight
    });

    alturaTotal += dynamicHeight;
  });

  // Dibujar borde de la tabla con la altura total calculada
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.roundedRect(tableX, tableY, tableW, alturaTotal, 2, 2);

  // Configuración de columnas
  const col1Width = tableW * 0.45; // Columna izquierda (categorías)

  // Dibujar línea vertical separadora
  doc.line(
    tableX + col1Width,
    tableY,
    tableX + col1Width,
    tableY + alturaTotal
  );

  // Dibujar filas y contenido con altura dinámica
  let currentY = tableY;

  filasAlturas.forEach((fila, index) => {
    // Dibujar línea horizontal si no es la primera fila
    if (index > 0) {
      doc.line(tableX, currentY, tableX + tableW, currentY);
    }

    // Categoría (columna izquierda) - CENTRADO VERTICAL PERFECTO
    doc.setFont("helvetica", "bold").setFontSize(9);

    // Calcular posición Y exacta para centrado - SUBIDO 2 PUNTOS
    const categoriaTextHeight = 4; // Altura aproximada del texto en 9pt
    const categoriaY = currentY + (fila.height / 2) - (categoriaTextHeight / 2) + 1; // Cambiado de +2 a +0 (subido 2 puntos)

    doc.text(fila.categoria + " :", tableX + 5, categoriaY, {
      align: "left",
      baseline: "top" // Usamos 'top' para mayor control
    });

    // Hallazgo (columna derecha)
    doc.setFont("helvetica", "normal").setFontSize(9);
    const hallazgoX = tableX + col1Width + 5;

    if (fila.lines.length === 1) {
      // Centrado vertical exacto para hallazgos de una línea - SUBIDO 2 PUNTOS
      const hallazgoTextHeight = 4;
      const hallazgoY = currentY + (fila.height / 2) - (hallazgoTextHeight / 2) + 1; // Cambiado de +2 a +0 (subido 2 puntos)
      doc.text(fila.lines[0], hallazgoX, hallazgoY, {
        align: "left",
        baseline: "top"
      });
    } else {
      // Múltiples líneas - alineado arriba con espaciado consistente - SUBIDO 2 PUNTOS
      let lineY = currentY + 2; // Cambiado de +4 a +2 (subido 2 puntos)
      fila.lines.forEach((line) => {
        doc.text(line, hallazgoX, lineY, {
          align: "left",
          baseline: "top"
        });
        lineY += 4.5; // Espaciado ligeramente mayor entre líneas
      });
    }

    // Actualizar la posición Y para la siguiente fila
    currentY += fila.height;
  });

  // 5) Sección de firmas (opcional) - BLOQUE COMPLETO QUE SE MUEVE JUNTO
  y = tableY + alturaTotal + 28; // Bajado 8 puntos (de 20 a 28)

  // Arreglo de firmas con posición Y dinámica - IMAGEN ARRIBA
  const firmasAPintar = [{
    nombre: "SELLOFIRMA",
    x: 80,
    y: y - 3, // Subido 2.5 puntos para mejor posicionamiento
    maxw: 50
  }];

  // Línea para firma centrada - DEBAJO DE LA IMAGEN
  const firmaY = y + 25; // 25 puntos debajo de la imagen para evitar superposición
  const firmaW = 60;
  const firmaX = pageW / 2 - firmaW / 2; // Centrar la línea

  doc.setDrawColor(0);
  doc.setLineWidth(0.2);
  doc.line(firmaX, firmaY, firmaX + firmaW, firmaY);

  // Texto "Firma del Médico" - DEBAJO DE LA LÍNEA
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Firma del Médico", pageW / 2, firmaY + 6.5, {
    align: "center",
  });

  agregarFirmas(doc, data.digitalizacion, firmasAPintar).then(() => {
    if (docExistente) {
      return doc;
    } else {
      imprimir(doc);
    }
  });
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

      // img.onload = () => {
      //   let sigW = maxw;
      //   const sigH = 35;
      //   const baseX = x;
      //   const baseY = y;
      //   const maxW = sigW - 10;
      //   const maxH = sigH - 10;
      //   let imgW = img.width;
      //   let imgH = img.height;
      //   const scale = Math.min(maxW / imgW, maxH / imgH, 1);
      //   imgW *= scale;
      //   imgH *= scale;
      //   const imgX = baseX + (sigW - imgW) / 2;
      //   const imgY = baseY + (sigH - imgH) / 2;
      //   doc.addImage(imagenUrl, "PNG", imgX, imgY, imgW, imgH);
      //   resolve();
      // };
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
