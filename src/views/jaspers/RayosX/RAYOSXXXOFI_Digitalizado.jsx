import jsPDF from "jspdf";
import HeaderRAYOSXXXOFI from "./Headers/header_RAYOSXXXOFI_Digitalizado.jsx";
import { getSignCompressed } from "../../utils/helpers.js";

export default async function RAYOSXXXOFI_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 60;

  // 1) Header
  await HeaderRAYOSXXXOFI(doc, data);

  // Datos de prueba para demostrar el manejo de texto largo
  const datosPrueba = {
    nombres: "JOSUE SPENCER ROJAS SIGUENZA",
    empresa: "SERVICIOS INDUSTRIALES MMJ EMPRESA INDIVIDUAL DE RESPONSABILIDAD LIMITADA CON RUC 20123456789",
    cargo: "ADMINISTRADOR GENERAL DE OPERACIONES",
    edad: "30",
    tipoRadio: "LUMBAR",
    fechaExamen: "2025-08-11",
    informacionGeneral: "Cuerpos vertebrales muestran morfología normal. Sacro no muestra lesiones evidentes. Espacios intervertebrales conservados. Densidad ósea adecuada. Lordosis lumbar normal. Canal raquídeo con amplitud normal. No se observan fracturas ni luxaciones. Los discos intervertebrales mantienen su altura normal.",
    conclusiones: "Estudio radiográfico de columna lumbar normal. No se evidencian alteraciones patológicas significativas. Se recomienda control clínico según evolución del paciente."
  };

  // Combinar datos de prueba con los datos reales (los datos reales tienen prioridad)
  const datosFinales = { ...datosPrueba, ...data };

  // Función para obtener datos con valor por defecto
  const obtener = (name) => {
    return datosFinales[name] || "";
  };
  function formatearFecha(fechaStr) {
    if (!fechaStr) return ""; // Si está vacío

    const [anio, mes, dia] = fechaStr.split("-").map(Number);
    const fecha = new Date(anio, mes - 1, dia); // Fecha local

    const diasSemana = [
      "DOMINGO", "LUNES", "MARTES", "MIÉRCOLES",
      "JUEVES", "VIERNES", "SÁBADO"
    ];

    const meses = [
      "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
      "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
    ];

    const diaSemana = diasSemana[fecha.getDay()];
    const diaMes = fecha.getDate();
    const nombreMes = meses[fecha.getMonth()];

    return `${diaSemana} ${diaMes} DE ${nombreMes} DEL ${anio}`;
  }


  // Datos del reporte
  const datos = {
    apellidosNombres: obtener("nombres").toUpperCase(),
    empresa: obtener("empresa").toUpperCase(),
    cargo: obtener("cargo").toUpperCase(),
    edad: obtener("edad") + " AÑOS",
    examen: "RADIOAGRAFIA DE COLUMNA " + obtener("tipoRadio").toUpperCase(),
    fechaEvaluacion: formatearFecha(obtener("fechaExamen")),
    hallazgos: obtener("informacionGeneral").toUpperCase(),
    // "Cuerpos vertebrales muestran morfología normal. Sacro no muestra lesiones evidentes. Espacios intervertebrales conservados. Densidad ósea adecuada. Lordosis lumbar normal. Canal raquídeo con amplitud normal.",
    conclusion: obtener("conclusiones").toUpperCase(),
    medico: "",
    titulo: "",
    licencias: "",
  };

  // 2) Título del informe
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("INFORME DE RADIOLOGÍA", pageW / 2, y - 10, { align: "center" });
  y += 5;

  // 3) Sección I: DATOS DE AFILIACIÓN
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("I. DATOS DE AFILIACIÓN", margin + 10, y);
  y += 8;

  // Datos de afiliación
  const afiliacionData = [
    { label: "APELLIDOS Y NOMBRES", value: datos.apellidosNombres },
    { label: "EMPRESA", value: datos.empresa },
    { label: "CARGO", value: datos.cargo },
    { label: "EDAD", value: datos.edad },
    { label: "EXAMEN", value: datos.examen },
    { label: "FECHA DE EVALUACIÓN", value: datos.fechaEvaluacion },
  ];

  // Calcular el ancho máximo de los labels para alineación
  const labelWidth = Math.max(
    ...afiliacionData.map((item) => doc.getTextWidth(item.label))
  );
  const colonX = margin + 15 + labelWidth + 2; // Posición fija para los dos puntos
  const valueX = colonX + 5; // 5 puntos de separación después de los dos puntos

  afiliacionData.forEach((item) => {
    doc.setFont("helvetica", "normal").setFontSize(10);

    // Label a la izquierda
    doc.text(item.label, margin + 15, y);

    // Dos puntos en posición fija
    doc.text(":", colonX, y);

    // Valor a la derecha, con manejo de texto largo
    const maxValueWidth = pageW - valueX - margin - 10; // Ancho máximo disponible para el valor
    const valueLines = doc.splitTextToSize(item.value, maxValueWidth);

    valueLines.forEach((line, index) => {
      doc.text(line, valueX, y + (index * 5));
    });

    // Ajustar el incremento de Y basado en el número de líneas del valor
    y += Math.max(6, valueLines.length * 5);
  });

  y += 8;

  // 4) Sección II: HALLAZGOS
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("II. HALLAZGOS:", margin + 10, y);
  y += 8;

  // Texto introductorio
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text(
    "El estudio radiografico representado en incidencia frontal y lateral muestra :",
    margin + 15,
    y
  );
  y += 8;

  // Hallazgos específicos como lista
  doc.setFont("helvetica", "normal").setFontSize(10);

  // Dividir el texto por saltos de línea y crear lista
  const hallazgosItems = datos.hallazgos
    .split("\n")
    .filter((item) => item.trim() !== "");

  hallazgosItems.forEach((item) => {
    const trimmedItem = item.trim();
    if (trimmedItem) {
      // Verificar si el texto es muy largo y necesita múltiples líneas
      const maxWidth = pageW - 2 * (margin + 20);
      const textLines = doc.splitTextToSize(trimmedItem, maxWidth);

      textLines.forEach((line) => {
        // Todas las líneas con sangría, sin viñeta
        doc.text(line, margin + 20, y);
        y += 6;
      });
    }
  });

  y += 8;

  // 5) Sección III: CONCLUSIÓN
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("III. CONCLUSIÓN:", margin + 10, y);
  y += 8;

  // Conclusión
  doc.setFont("helvetica", "normal").setFontSize(10);
  const conclusionLines = doc.splitTextToSize(
    datos.conclusion,
    pageW - 2 * (margin + 15)
  );
  conclusionLines.forEach((line) => {
    doc.text(line, margin + 15, y);
    y += 5;
  });

  // Posición de la firma justo 4 puntos debajo de las conclusiones
  const firmaY = y + 4; // Solo 4 puntos debajo del texto de conclusiones
  //const firmasAPintar = [{ nombre: "SELLOFIRMA", x: 95, y: firmaY, maxw: 120 }];
  const s1 = await getSignCompressed(data, "SELLOFIRMA");
  if (s1) {
    try {
      const imgWidth = 50;
      const imgHeight = 25;
      // Centrar la imagen: centro de la columna menos la mitad del ancho de la imagen
      const x = 95;
      const y = firmaY;
      doc.addImage(s1, 'JPEG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }


  //await agregarFirmas(doc, data.digitalizacion, firmasAPintar);

  if (docExistente) {
    return doc;
  } else {
    imprimir(doc);
  }
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
        let sigW = maxw;
        const sigH = 35;
        const baseX = x;
        const baseY = y;
        const maxW = sigW - 10;
        const maxH = sigH - 10;
        let imgW = img.width;
        let imgH = img.height;
        const scale = Math.min(maxW / imgW, maxH / imgH, 1);
        imgW *= scale;
        imgH *= scale;
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
