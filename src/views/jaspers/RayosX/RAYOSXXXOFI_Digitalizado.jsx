import jsPDF from "jspdf";
import HeaderRAYOSXXXOFI from "./Headers/header_RAYOSXXXOFI_Digitalizado.jsx";

export default function RAYOSXXXOFI_Digitalizado(data = {}) {
  const doc = new jsPDF();
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 50;

  // 1) Header
  HeaderRAYOSXXXOFI(doc, data);

  // Función para obtener datos con valor por defecto
  const obtener = (name) => {
    return data[name] || "";
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
    edad: obtener("edad")+ " años",
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
  doc.text("INFORME DE RADIOLOGIA", pageW / 2, y, { align: "center" });
  y += 15;

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

    // Valor a la derecha, alineado
    doc.text(item.value, valueX, y);

    y += 6;
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

  // Dividir el texto por puntos y crear lista
  const hallazgosItems = datos.hallazgos
    .split(".")
    .filter((item) => item.trim() !== "");

  hallazgosItems.forEach((item) => {
    const trimmedItem = item.trim();
    if (trimmedItem) {
      // Viñeta y texto
      doc.text("•", margin + 15, y);
      doc.text(trimmedItem, margin + 20, y);
      y += 6;
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

  y += 30;

  // 6) Sección de firma
  // Línea para firma
  const firmaY = y;
  const firmaW = 60;
  const firmaX = pageW / 2 - firmaW / 2; // Centrar la línea

  doc.setDrawColor(0);
  doc.setLineWidth(0.2);
  // doc.line(firmaX, firmaY, firmaX + firmaW, firmaY);

  // Información del médico
  y += 8; // Reducido de 12 a 8 para acercar más
  doc.setFont("helvetica", "bold").setFontSize(10); // Cambiado a negrita
  doc.text(datos.medico, pageW / 2, y, { align: "center" });
  y += 5;
  doc.text(datos.titulo, pageW / 2, y, { align: "center" });
  y += 5;
  doc.text(datos.licencias, pageW / 2, y, { align: "center" });

  const firmasAPintar = [{ nombre: "SELLOFIRMA", x: 95, y: 200, maxw: 120 }];
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
