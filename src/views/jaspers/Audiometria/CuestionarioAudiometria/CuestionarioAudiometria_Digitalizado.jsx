import jsPDF from "jspdf";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import drawColorBox from '../../components/ColorBox.jsx';
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from '../../../utils/dibujarFirmas.js';

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return "";
  if (fecha.includes("/")) return fecha; // ya está en formato correcto
  const [anio, mes, dia] = fecha.split("-");
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

// Header con datos de ficha, sede y fecha
const drawHeader = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false, yOffset: 10 });

  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8);
  const sedeValue = datos.sede || "";
  doc.text("Sede: " + sedeValue, pageW - 80, 20);

  // Fecha de examen
  const fechaExamen = toDDMMYYYY(datos.fechaCuestionario || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);

  // Página
  doc.text("Pag. 01", pageW - 30, 10);

  // Bloque de color
  if (datos.color && datos.textoColor) {
    drawColorBox(doc, {
      color: datos.codigoColor || "#008f39",
      text: datos.textoColor,
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  }
};

// Función para dibujar datos del paciente en tabla
const drawPatientData = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const tablaAncho = 200;
  const tablaInicioX = (pageW - tablaAncho) / 2; // Centrar la tabla
  const filaAltura = 5;
  let yPos = 35;

  // Header DATOS PERSONALES
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const sexo = datos.sexo === 'F' ? 'FEMENINO' : datos.sexo === 'M' ? 'MASCULINO' : '';
  const fechaNac = toDDMMYYYY(datos.fechaNac || "");

  // Fila 1: Apellidos y Nombres
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.nombres || '', tablaInicioX + 40, yPos + 3.5);
  yPos += filaAltura;

  // Fila 2: DNI | Edad | Sexo | Fecha Nac.
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(String(datos.dni || ''), tablaInicioX + 12, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datos.edad ? datos.edad + " AÑOS" : ''), tablaInicioX + 58, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(sexo, tablaInicioX + 105, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(fechaNac, tablaInicioX + 165, yPos + 3.5);
  yPos += filaAltura;

  // Fila 3: Ocupación
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Ocupación:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.ocupacion || '', tablaInicioX + 24, yPos + 3.5);
  yPos += filaAltura;

  // Fila 4: Cargo | Empresa
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cargo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.cargo || '', tablaInicioX + 18, yPos + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.empresa || '', tablaInicioX + 110, yPos + 3.5);
  yPos += filaAltura;

  // Fila 5: Contrata
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contrata:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.contrata || '', tablaInicioX + 24, yPos + 3.5);
  yPos += filaAltura;

  return yPos;
};

export default async function CuestionarioAudiometria_Digitalizado(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const lineHTable = 3.5;
  const paddingTop = 1.5;
  const paddingBottom = 1.5;
  let y = 50;

  // 1) Header con logo, datos y drawer colorbox
  await drawHeader(doc, datos);

  // 2) Título CUESTIONARIO AUDIOMETRÍA
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("CUESTIONARIO AUDIOMETRÍA", pageW / 2, 32, { align: "center" });

  // 3) Tabla de datos del paciente
  y = drawPatientData(doc, datos);
  // Sin espacio entre tablas

  // Continuar con el dibujado del cuestionario
  (async () => {
    // 4) Sección de preguntas 1–15
    const pageW = doc.internal.pageSize.getWidth();
    const tablaAncho = 200;
    const tablaInicioX = (pageW - tablaAncho) / 2; // Centrar la tabla igual que datos personales
    const colSiW = 6;
    const colNoW = 6;
    const colPreguntaW = tablaAncho - colSiW - colNoW;
    const tableX = tablaInicioX;
    let tableY = y;

    const preguntas = [
      {
        numero: 1,
        texto: "¿Tiene conocimiento de algún problema del oído y/o audición que haya tenido o haya sido diagnosticado y/o en estudio, así como: pérdida de audición, hipoacusia, otitis media agudo, crónico, supurativo externo, presencia de secreción purulenta y/o sanguinolenta con o sin mal olor, escucha sonidos como pititos, soplidos del viento, sonido del mar, acúfenos, tinnitus, mareos, vértigo, náuseas, rinitis alérgica, parálisis facial, adormecimiento de hemicorpo, tumores del sistema nervioso central.",
        tieneNota: true
      },
      {
        numero: 2,
        texto: "Ha realizado viaje o ha llegado de viaje en las 16 horas anteriores a esta entrevista y examen.",
        tieneNota: false
      },
      {
        numero: 3,
        texto: "Ha estado escuchando música con audífonos en las 16 horas anteriores a esta entrevista o examen.",
        tieneNota: false
      },
      {
        numero: 4,
        texto: "Se ha desplazado y/o movilizado en moto lineal y/o en vehículo con las ventanas abiertas.",
        tieneNota: false
      },
      {
        numero: 5,
        texto: "Ha trabajado expuesto a ruido y/o vibraciones en las 16 horas anteriores a esta entrevista y examen.",
        tieneNota: false
      },
      {
        numero: 6,
        texto: "Ha bebido bebidas alcohólicas y/o fumó cigarrillos en las 16 horas anteriores a esta entrevista y examen.",
        tieneNota: false
      },
      {
        numero: 7,
        texto: "Ha estado despierto o trabajando en turno de noche 16 horas anteriores a esta entrevista y examen.",
        tieneNota: false
      },
      {
        numero: 8,
        texto: "¿Está resfriado con tos, con dolor auricular, fiebre y/u otra enfermedad respiratoria aguda?",
        tieneNota: false
      },
      {
        numero: 9,
        texto: "¿Le han practicado cirugía de oído (timpanoplastía, mastoidectomía, estapediectomía)?",
        tieneNota: true
      },
      {
        numero: 10,
        texto: "¿Ha tenido traumatismo craneoencefálico, traumatismo en el oído?",
        tieneNota: true
      },
      {
        numero: 11,
        texto: "¿Ha consumido o consume medicamentos como: Cisplatino, aminoglucósidos (vancomicina y amikacina), aspirina, furosemida y/o antituberculosos?",
        tieneNota: true
      },
      {
        numero: 12,
        texto: "¿Ha estado expuesto a solventes orgánicos (tolueno, xileno, disulfuro de carbono, plomo, mercurio, monóxido de carbono), plaguicidas, organofosforados y piretroides?",
        tieneNota: true
      },
      {
        numero: 13,
        texto: "¿Ha estado expuesto a vibraciones continuas?",
        tieneNota: true
      },
      {
        numero: 14,
        texto: "¿Sufre de: hipertensión arterial, diabetes mellitus, hipotiroidismo, insuficiencia renal crónica, enfermedades autoinmunes?",
        tieneNota: true
      },
      {
        numero: 15,
        texto: "¿Consume cigarrillos?",
        tieneNota: true
      }
    ];

    // Calcular altura total de la tabla incluyendo espacios extra
    const headerHeight = 5; // Misma altura que "DATOS PERSONALES"
    let totalTableH = headerHeight; // encabezado
    doc.setFontSize(9);
    preguntas.forEach(p => {
      // Obtener texto de nota si existe con formato adecuado
      let notaText = "";
      if (p.tieneNota) {
        switch (p.numero) {
          case 1: {
            const partes1 = [];
            if (datos?.txtrcual1) partes1.push(`¿Cuál? ${datos.txtrcual1}`);
            if (datos?.txtrcuando1) partes1.push(`¿Cuándo? ${datos.txtrcuando1}`);
            if (datos?.txtrque1) partes1.push(`¿Qué Hizo? ${datos.txtrque1}`);
            notaText = partes1.join(" - ");
            break;
          }
          case 9: {
            const partes9 = [];
            if (datos?.txtrcual9) partes9.push(`¿Cuál? ${datos.txtrcual9}`);
            if (datos?.txtrdonde9) partes9.push(`¿Dónde lo diagnosticaron? ${datos.txtrdonde9}`);
            if (datos?.txtrque9) partes9.push(`¿Qué Hizo? ${datos.txtrque9}`);
            notaText = partes9.join(" - ");
            break;
          }
          case 10: {
            const partes10 = [];
            if (datos?.txtrcual10) partes10.push(`¿Cuál? ${datos.txtrcual10}`);
            if (datos?.txtrdonde10) partes10.push(`¿Dónde? ${datos.txtrdonde10}`);
            if (datos?.txtrque10) partes10.push(`¿Qué Hizo? ${datos.txtrque10}`);
            notaText = partes10.join(" - ");
            break;
          }
          case 11: {
            const partes11 = [];
            if (datos?.txtrcual11) partes11.push(`¿Cuál? ${datos.txtrcual11}`);
            if (datos?.txtrcuanto11) partes11.push(`¿Por cuanto tiempo? ${datos.txtrcuanto11}`);
            notaText = partes11.join(" - ");
            break;
          }
          case 12: {
            const partes12 = [];
            if (datos?.txtrcual12) partes12.push(`¿Cuál? ${datos.txtrcual12}`);
            if (datos?.txtrcuanto12) partes12.push(`¿Por cuanto tiempo? ${datos.txtrcuanto12}`);
            notaText = partes12.join(" - ");
            break;
          }
          case 13: {
            const partes13 = [];
            if (datos?.txtrcuanto13) partes13.push(`¿Cuánto tiempo? ${datos.txtrcuanto13}`);
            if (datos?.txtrcuando13) partes13.push(`¿Cuándo? ${datos.txtrcuando13}`);
            if (datos?.txtrdonde13) partes13.push(`¿Dónde? ${datos.txtrdonde13}`);
            notaText = partes13.join(" - ");
            break;
          }
          case 14: {
            const partes14 = [];
            if (datos?.txtrcual14) partes14.push(`¿Cuál? ${datos.txtrcual14}`);
            if (datos?.txtrdonde14) partes14.push(`¿Dónde lo diagnosticaron? ${datos.txtrdonde14}`);
            if (datos?.txtrque14) partes14.push(`¿Qué hizo? ${datos.txtrque14}`);
            notaText = partes14.join(" - ");
            break;
          }
          case 15: {
            if (datos?.txtrcuantos15) {
              notaText = `¿Cuántos por mes? ${datos.txtrcuantos15}`;
            }
            break;
          }
        }
      }

      const textoConNumero = `${p.numero}.- ${p.texto}`;
      const lines = doc.splitTextToSize(textoConNumero, colPreguntaW - 4);
      const contentH = lines.length * lineHTable;

      let notaH = 0;
      if (notaText) {
        doc.setFontSize(8);
        const notaLines = doc.splitTextToSize(notaText, colPreguntaW - 4);
        notaH = notaLines.length * lineHTable;
        doc.setFontSize(9);
      }

      const rowH = contentH + paddingTop + paddingBottom + notaH;
      totalTableH += rowH;
    });

    // Encabezado de tabla con fondo gris (misma altura que "DATOS PERSONALES")
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.setFillColor(196, 196, 196);
    doc.rect(tableX, tableY, tablaAncho, headerHeight, 'FD');

    // Líneas verticales del header (izquierda, división pregunta/SI, división SI/NO, derecha)
    doc.line(tableX, tableY, tableX, tableY + totalTableH);
    doc.line(tableX + colPreguntaW, tableY, tableX + colPreguntaW, tableY + totalTableH);
    doc.line(tableX + colPreguntaW + colSiW, tableY, tableX + colPreguntaW + colSiW, tableY + totalTableH);
    doc.line(tableX + tablaAncho, tableY, tableX + tablaAncho, tableY + totalTableH);
    // Línea inferior del header
    doc.line(tableX, tableY + headerHeight, tableX + tablaAncho, tableY + headerHeight);

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("II. PREGUNTAS", tableX + 2, tableY + 3.5);
    doc.text("SI", tableX + colPreguntaW + colSiW / 2, tableY + 3.5, { align: "center" });
    doc.text("NO", tableX + colPreguntaW + colSiW + colNoW / 2, tableY + 3.5, { align: "center" });
    tableY += headerHeight;
    doc.setFont("helvetica", "normal").setFontSize(9);

    // Filas de preguntas 1-15
    preguntas.forEach(p => {
      // Obtener texto de nota si existe con formato adecuado
      let notaText = "";
      if (p.tieneNota) {
        switch (p.numero) {
          case 1: {
            const partes1 = [];
            if (datos?.txtrcual1) partes1.push(`¿Cuál? ${datos.txtrcual1}`);
            if (datos?.txtrcuando1) partes1.push(`¿Cuándo? ${datos.txtrcuando1}`);
            if (datos?.txtrque1) partes1.push(`¿Qué Hizo? ${datos.txtrque1}`);
            notaText = partes1.join(" - ");
            break;
          }
          case 9: {
            const partes9 = [];
            if (datos?.txtrcual9) partes9.push(`¿Cuál? ${datos.txtrcual9}`);
            if (datos?.txtrdonde9) partes9.push(`¿Dónde lo diagnosticaron? ${datos.txtrdonde9}`);
            if (datos?.txtrque9) partes9.push(`¿Qué Hizo? ${datos.txtrque9}`);
            notaText = partes9.join(" - ");
            break;
          }
          case 10: {
            const partes10 = [];
            if (datos?.txtrcual10) partes10.push(`¿Cuál? ${datos.txtrcual10}`);
            if (datos?.txtrdonde10) partes10.push(`¿Dónde? ${datos.txtrdonde10}`);
            if (datos?.txtrque10) partes10.push(`¿Qué Hizo? ${datos.txtrque10}`);
            notaText = partes10.join(" - ");
            break;
          }
          case 11: {
            const partes11 = [];
            if (datos?.txtrcual11) partes11.push(`¿Cuál? ${datos.txtrcual11}`);
            if (datos?.txtrcuanto11) partes11.push(`¿Por cuanto tiempo? ${datos.txtrcuanto11}`);
            notaText = partes11.join(" - ");
            break;
          }
          case 12: {
            const partes12 = [];
            if (datos?.txtrcual12) partes12.push(`¿Cuál? ${datos.txtrcual12}`);
            if (datos?.txtrcuanto12) partes12.push(`¿Por cuanto tiempo? ${datos.txtrcuanto12}`);
            notaText = partes12.join(" - ");
            break;
          }
          case 13: {
            const partes13 = [];
            if (datos?.txtrcuanto13) partes13.push(`¿Cuánto tiempo? ${datos.txtrcuanto13}`);
            if (datos?.txtrcuando13) partes13.push(`¿Cuándo? ${datos.txtrcuando13}`);
            if (datos?.txtrdonde13) partes13.push(`¿Dónde? ${datos.txtrdonde13}`);
            notaText = partes13.join(" - ");
            break;
          }
          case 14: {
            const partes14 = [];
            if (datos?.txtrcual14) partes14.push(`¿Cuál? ${datos.txtrcual14}`);
            if (datos?.txtrdonde14) partes14.push(`¿Dónde lo diagnosticaron? ${datos.txtrdonde14}`);
            if (datos?.txtrque14) partes14.push(`¿Qué hizo? ${datos.txtrque14}`);
            notaText = partes14.join(" - ");
            break;
          }
          case 15: {
            if (datos?.txtrcuantos15) {
              notaText = `¿Cuántos por mes? ${datos.txtrcuantos15}`;
            }
            break;
          }
        }
      }

      // Calcular altura de contenido de pregunta (con número "1.-")
      doc.setFontSize(9);
      const textoConNumero = `${p.numero}.- ${p.texto}`;
      const lines = doc.splitTextToSize(textoConNumero, colPreguntaW - 4);
      const contentH = lines.length * lineHTable;

      // Calcular altura de nota si existe
      let notaH = 0;
      if (notaText) {
        doc.setFontSize(8);
        const notaLines = doc.splitTextToSize(notaText, colPreguntaW - 4);
        notaH = notaLines.length * lineHTable;
      }

      // Altura total de la fila: contenido + padding + nota
      const rowH = contentH + paddingTop + paddingBottom + notaH;

      // Texto de la pregunta con número y padding superior
      doc.setFontSize(9);
      lines.forEach((ln, i) => {
        doc.text(ln, tableX + 2, tableY + paddingTop + lineHTable - 1.2 + i * lineHTable);
      });

      // Mostrar notas adicionales dentro de la misma fila, justo después del texto de la pregunta
      if (notaText) {
        doc.setFontSize(8);
        const notaLines = doc.splitTextToSize(notaText, colPreguntaW - 4);
        // Posicionar la nota con más espacio después del contenido de la pregunta
        const notaStartY = tableY + paddingTop + contentH + 2;
        notaLines.forEach((ln, i) => {
          // Asegurar que la nota no se salga de la fila
          const notaY = notaStartY + i * lineHTable;
          if (notaY < tableY + rowH - paddingBottom) {
            doc.text(ln, tableX + 2, notaY);
          }
        });
        doc.setFontSize(9);
      }

      // Celdas SI/NO como parte de la tabla
      const siX = tableX + colPreguntaW;
      const noX = tableX + colPreguntaW + colSiW;
      const celdaY = tableY;
      const celdaH = rowH;

      // Marcar X en la celda correspondiente, centrada verticalmente
      const respuestaSi = datos[`chksi${p.numero}`];
      const celdaCenterY = celdaY + celdaH / 2;
      if (respuestaSi) {
        doc.text("X", siX + colSiW / 2, celdaCenterY, { align: "center" });
      } else {
        doc.text("X", noX + colNoW / 2, celdaCenterY, { align: "center" });
      }

      tableY += rowH;
      // Línea horizontal inferior de la fila
      doc.line(tableX, tableY, tableX + tablaAncho, tableY);
    });

    // Pregunta 16: Actividades con formato de dos columnas
    // Fila con el número y texto de la pregunta 16 (sin columnas SI/NO)
    const filaPregunta16H = lineHTable + paddingTop + paddingBottom;
    const pregunta16Y = tableY;

    // Línea horizontal superior
    doc.line(tableX, pregunta16Y, tableX + tablaAncho, pregunta16Y);

    // Líneas verticales para la fila de pregunta 16 (solo bordes izquierdo y derecho)
    doc.line(tableX, pregunta16Y, tableX, pregunta16Y + filaPregunta16H);
    doc.line(tableX + tablaAncho, pregunta16Y, tableX + tablaAncho, pregunta16Y + filaPregunta16H);

    doc.setFont("helvetica", "bold").setFontSize(9);
    const textoPregunta16 = `16.- ¿Ha realizado actividades de? ${datos?.txtrcual16 || ""} `;
    doc.text(textoPregunta16, tableX + 2, pregunta16Y + paddingTop + lineHTable - 1.2);

    // Línea horizontal inferior de la fila de pregunta
    doc.line(tableX, pregunta16Y + filaPregunta16H, tableX + tablaAncho, pregunta16Y + filaPregunta16H);

    tableY = pregunta16Y + filaPregunta16H;

    // Actividades para la pregunta 16 (agrupadas en pares para dos columnas)
    const actividades = [
      { nombre: "Caza", campo: "chkcaza16", tiempo: "txtcaza16" },
      { nombre: "Uso de auriculares", campo: "chkauriculares16", tiempo: "txtauriculares16" },
      { nombre: "Tiro al blanco", campo: "chktiro16", tiempo: "txttiro16" },
      { nombre: "Servicio militar", campo: "chkmilitar16", tiempo: "txtmilitar16" },
      { nombre: "Concurrencia frecuente a discotecas y/o bares", campo: "chkdiscoteca16", tiempo: "txtdiscoteca16" },
      { nombre: "Boxeo", campo: "chkboxeo16", tiempo: "txtboxeo16" }
    ];

    // Anchos de columnas: solo 2 columnas principales
    // Cada columna tiene: checkbox | texto + tiempo
    const colCheckboxW = 10;
    const colActividadTiempoW = (tablaAncho - colCheckboxW * 2) / 2; // Dos columnas iguales (menos 2 checkboxes)
    const filaActividadHMin = 5; // Altura mínima de fila
    const paddingActividad = 1; // Padding vertical para el texto

    // Calcular altura total primero
    let alturaTotal = 0;
    let alturasFilas = [];
    doc.setFont("helvetica", "normal").setFontSize(8);

    for (let i = 0; i < actividades.length; i += 2) {
      // Calcular altura de texto izquierdo
      const actividadIzq = actividades[i].nombre;
      const tiempoIzq = datos?.[actividades[i].tiempo] || "";
      const textoIzq = tiempoIzq ? `${actividadIzq} - Tiempo: ${tiempoIzq}` : actividadIzq;
      const linesIzq = doc.splitTextToSize(textoIzq, colActividadTiempoW - 4);
      const alturaIzq = linesIzq.length * lineHTable + paddingActividad * 2;

      // Calcular altura de texto derecho (si existe)
      let alturaDer = 0;
      if (i + 1 < actividades.length) {
        const actividadDer = actividades[i + 1].nombre;
        const tiempoDer = datos?.[actividades[i + 1].tiempo] || "";
        const textoDer = tiempoDer ? `${actividadDer} - Tiempo: ${tiempoDer}` : actividadDer;
        const linesDer = doc.splitTextToSize(textoDer, colActividadTiempoW - 4);
        alturaDer = linesDer.length * lineHTable + paddingActividad * 2;
      }

      // La altura de la fila es la máxima entre izquierda y derecha, con mínimo
      const alturaFila = Math.max(filaActividadHMin, Math.max(alturaIzq, alturaDer));
      alturasFilas.push(alturaFila);
      alturaTotal += alturaFila;
    }

    // Dibujar líneas verticales principales: solo 3 líneas (izquierda, división central, derecha)
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tableX, tableY, tableX, tableY + alturaTotal);
    doc.line(tableX + colCheckboxW + colActividadTiempoW, tableY, tableX + colCheckboxW + colActividadTiempoW, tableY + alturaTotal);
    doc.line(tableX + tablaAncho, tableY, tableX + tablaAncho, tableY + alturaTotal);

    // Dibujar filas de actividades (2 por fila)
    let yPosActual = tableY;
    for (let i = 0; i < actividades.length; i += 2) {
      const alturaFila = alturasFilas[i / 2];
      const filaY = yPosActual;

      // COLUMNA IZQUIERDA: | checkbox | texto - Tiempo: {data} |
      const colIzqX = tableX;
      // Línea vertical entre checkbox y texto
      doc.line(colIzqX + colCheckboxW, filaY, colIzqX + colCheckboxW, filaY + alturaFila);
      // Celda checkbox (centrada verticalmente)
      if (datos?.[actividades[i].campo]) {
        doc.text("X", colIzqX + colCheckboxW / 2, filaY + alturaFila / 2, { align: "center" });
      }
      // Actividad - Tiempo: {data} (puede ser multilínea)
      const actividadIzq = actividades[i].nombre;
      const tiempoIzq = datos?.[actividades[i].tiempo] || "";
      const textoIzq = tiempoIzq ? `${actividadIzq} - Tiempo: ${tiempoIzq}` : actividadIzq;
      const linesIzq = doc.splitTextToSize(textoIzq, colActividadTiempoW - 4);
      linesIzq.forEach((line, idx) => {
        doc.text(line, colIzqX + colCheckboxW + 2, filaY + paddingActividad + lineHTable - 1.2 + idx * lineHTable);
      });

      // COLUMNA DERECHA: | checkbox | texto - Tiempo: {data} | (si existe)
      if (i + 1 < actividades.length) {
        const colDerX = tableX + colCheckboxW + colActividadTiempoW;
        // Línea vertical entre checkbox y texto
        doc.line(colDerX + colCheckboxW, filaY, colDerX + colCheckboxW, filaY + alturaFila);
        // Celda checkbox (centrada verticalmente)
        if (datos?.[actividades[i + 1].campo]) {
          doc.text("X", colDerX + colCheckboxW / 2, filaY + alturaFila / 2, { align: "center" });
        }
        // Actividad - Tiempo: {data} (puede ser multilínea)
        const actividadDer = actividades[i + 1].nombre;
        const tiempoDer = datos?.[actividades[i + 1].tiempo] || "";
        const textoDer = tiempoDer ? `${actividadDer} - Tiempo: ${tiempoDer}` : actividadDer;
        const linesDer = doc.splitTextToSize(textoDer, colActividadTiempoW - 4);
        linesDer.forEach((line, idx) => {
          doc.text(line, colDerX + colCheckboxW + 2, filaY + paddingActividad + lineHTable - 1.2 + idx * lineHTable);
        });
      }

      // Línea horizontal inferior de la fila
      doc.line(tableX, filaY + alturaFila, tableX + tablaAncho, filaY + alturaFila);

      yPosActual += alturaFila;
    }

    tableY += alturaTotal;

    // Fila de advertencia con color de advertencia (#fc9c0a)
    const filaAdvertenciaH = 5;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.setFillColor(252, 156, 10); // #fc9c0a en RGB
    doc.rect(tableX, tableY, tablaAncho, filaAdvertenciaH, 'FD');

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Declaro que las respuestas son ciertas según mi leal saber y entender", tableX + 2, tableY + 3.5);
    tableY += filaAdvertenciaH;

    // Fila de firmas (sin marco/borde)
    // 5) Dibujar firmas usando dibujarFirmas
    dibujarFirmas({ doc, datos, y: tableY + 2, pageW }).then(() => {
      // 6) Footer
      footerTR(doc, { footerOffsetY: 8, fontSize: 8 });

      // 7) Generar blob y abrir en iframe para imprimir automáticamente
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
    }).catch(err => {
      console.error("Error al dibujar firmas:", err);
      // 6) Footer
      footerTR(doc, { footerOffsetY: 8, fontSize: 8 });

      // 7) Generar blob y abrir en iframe para imprimir automáticamente
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
    });
  })();
}
