import jsPDF from "jspdf";
import HeaderRagiografiaToraxPA from "./Headers/header_RagiografiaToraxPA_Digitalizado.jsx";

export default function RagiografiaToraxPA_Digitalizado(data = {}) {
  const doc = new jsPDF();
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
  y += 8;

  // 3) Subtítulo
  doc.setFont("helvetica", "normal").setFontSize(10);
  const subtitulo =
    "LA RADIOGRAFÍA DE TÓRAX EN LA INCIDENCIA POSTERO-ANTERIOR MUESTRA";
  doc.text(subtitulo, pageW / 2, y, { align: "center" });
  y += 12;

  // 4) Tabla de hallazgos
  const tableX = margin + 10;
  const tableW = pageW - 2 * (margin + 10);
  const tableY = y;
  const rowHeight = 8;
  const totalRows = 9;
  const tableH = totalRows * rowHeight + rowHeight; // Extra height for observaciones row

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

  // Calcular la altura real de la tabla basada en el contenido de observaciones
  const observacionesRow = tablaDatos.find(
    (fila) => fila.categoria === "OBSERVACIONES"
  );
  const observacionesLines = observacionesRow
    ? doc.splitTextToSize(
        observacionesRow.hallazgo,
        (pageW - 2 * (margin + 10)) * 0.55 * 0.9
      )
    : [];
  const observacionesExtraHeight = Math.max(
    0,
    (observacionesLines.length - 2) * 4
  ); // Extra height for observaciones
  const actualTableH = tableH + observacionesExtraHeight;

  // Dibujar borde de la tabla con la altura real
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.roundedRect(tableX, tableY, tableW, actualTableH, 2, 2);

  // Configuración de columnas
  const col1Width = tableW * 0.45; // Columna izquierda (categorías)
  const col2Width = tableW * 0.55; // Columna derecha (hallazgos)

  // Dibujar línea vertical separadora con la altura real
  doc.line(
    tableX + col1Width,
    tableY,
    tableX + col1Width,
    tableY + actualTableH
  );

  // Dibujar filas y contenido
  tablaDatos.forEach((fila, index) => {
    const rowY = tableY + index * rowHeight;

    // Dibujar línea horizontal si no es la primera fila
    if (index > 0) {
      doc.line(tableX, rowY, tableX + tableW, rowY);
    }

    // Categoría (columna izquierda)
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(fila.categoria + " :", tableX + 5, rowY + rowHeight / 2 + 2, {
      align: "left",
      baseline: "middle",
    });

    // Hallazgo (columna derecha)
    doc.setFont("helvetica", "normal").setFontSize(9);
    const hallazgoX = tableX + col1Width + 5;
    const hallazgoW = col2Width - 10;

    // Dividir texto si es muy largo
    const maxWidth =
      fila.categoria === "OBSERVACIONES" ? hallazgoW * 0.9 : hallazgoW; // Max-width para observaciones
    const hallazgoLines = doc.splitTextToSize(fila.hallazgo, maxWidth);

    // Para OBSERVACIONES, altura dinámica basada en el contenido
    if (fila.categoria === "OBSERVACIONES") {
      // Calcular altura dinámica basada en el número de líneas
      const lineHeight = 4; // Altura por línea
      const minHeight = rowHeight * 2; // Altura mínima
      const dynamicHeight = Math.max(
        minHeight,
        hallazgoLines.length * lineHeight + 4
      );

      if (hallazgoLines.length === 1) {
        // Una sola línea
        doc.text(hallazgoLines[0], hallazgoX, rowY + dynamicHeight / 2 + 3.5, {
          align: "left",
          baseline: "middle",
        });
      } else {
        // Múltiples líneas para observaciones - sin límite de líneas
        let lineY = rowY + 4; // Bajado 1.5 puntos
        hallazgoLines.forEach((line) => {
          doc.text(line, hallazgoX, lineY, {
            align: "left",
          });
          lineY += lineHeight;
        });
      }
    } else {
      // Para otras filas, comportamiento normal
      if (hallazgoLines.length === 1) {
        // Una sola línea
        doc.text(hallazgoLines[0], hallazgoX, rowY + rowHeight / 2 + 2, {
          align: "left",
          baseline: "middle",
        });
      } else {
        // Múltiples líneas
        let lineY = rowY + 2;
        hallazgoLines.forEach((line, lineIndex) => {
          if (lineIndex < 2) {
            // Máximo 2 líneas por fila
            doc.text(line, hallazgoX, lineY, {
              align: "left",
            });
            lineY += 4;
          }
        });
      }
    }
  });

  // 5) Sección de firmas (opcional)
  y = tableY + actualTableH + 28; // Bajado 8 puntos (de 20 a 28)

  // Línea para firma centrada
  const firmaY = y;
  const firmaW = 60;
  const firmaX = pageW / 2 - firmaW / 2; // Centrar la línea

  doc.setDrawColor(0);
  doc.setLineWidth(0.2);
  doc.line(firmaX, firmaY, firmaX + firmaW, firmaY);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Firma del Médico", pageW / 2, firmaY + 8, {
    align: "center",
  });

  // Arreglo de firmas que quieres cargar
  const firmasAPintar = [{ nombre: "SELLOFIRMA", x: 80, y: 200, maxw: 50 }];
  agregarFirmas(doc, data.digitalizacion, firmasAPintar).then(() => {
    imprimir(doc);
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
