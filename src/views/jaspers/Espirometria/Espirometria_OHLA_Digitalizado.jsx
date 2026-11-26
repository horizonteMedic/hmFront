import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { dibujarFirmas } from '../../utils/dibujarFirmas.js';
import { CRITERIOS_PROFESIONAL, PREGUNTAS_ENTREVISTADOS_GENERAL } from '../../utils/espirometriaCuestionarioUtils.js';

const toDDMMYYYY = (fecha) => {
  if (!fecha) return "";
  if (fecha.includes("/")) return fecha; // ya está en formato correcto
  const [anio, mes, dia] = fecha.split("-");
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

const RESULTADO_PRUEBA_OPCIONES = [
  { value: "COMPLETA", label: "Prueba completa" },
  { value: "INCOMPLETA_NO_ENTENDIO", label: "Incompleta: no entendió las instrucciones" },
  { value: "INCOMPLETA_EXCLUIDO_MEDICO", label: "Incompleta: excluido por razones médicas (no elegible)" },
  { value: "INCOMPLETA_NO_CAPAZ", label: "Incompleta: no fue capaz de realizar la prueba (otras razones)" },
  { value: "INCOMPLETA_RECHAZO", label: "Incompleta: rechazó" },
];

// Preguntas de exclusión: mismos textos y campos que el formulario de Espirometría (Cuestionario Platino).
// Con OHLA son 6 preguntas y el pulso va como 7.
const PREGUNTAS_EXCLUSION_OHLA = [
  { texto: "¿Tuvo alguna cirugía (operación) en su pulmón, en su tórax o en su abdomen, en los últimos 3 meses?", campo: "ohlaCirugiaPulmonToraxAbdomen" },
  { texto: "¿Tuvo un ataque cardiaco o infarto al corazón, en los últimos 3 meses?", campo: "ohlaInfartoCorazon" },
  { texto: "¿Tuvo desprendimiento de la retina o una operación (cirugía) de los ojos, en los últimos 3 meses?", campo: "ohlaDesprendimientoRetina" },
  { texto: "¿Estuvo hospitalizado por cualquier otro problema del corazón, en los últimos 3 meses?", campo: "ohlaHospitalizadoCorazon" },
  { texto: "¿Está usando medicamentos para la tuberculosis, en este momento?", campo: "ohlaMedicamentoTuberculosis" },
  { texto: "¿Está embarazada, en este momento?", campo: "ohlaEmbarazada" },
];

// Sin OHLA el formulario junta en la pregunta 1 el desprendimiento de retina y la cirugía de ojos, tórax o abdomen
// (misma respuesta `ohlaCirugiaPulmonToraxAbdomen`) y no muestra la pregunta de retina por separado: 5 preguntas y sin pulso.
const PREGUNTAS_EXCLUSION_GENERAL = [
  { texto: "¿Tuvo desprendimiento de la retina o una operación (cirugía) de los ojos, tórax o abdomen, en los últimos 3 meses?", campo: "ohlaCirugiaPulmonToraxAbdomen" },
  { texto: "¿Tuvo un ataque cardiaco o infarto al corazón, en los últimos 3 meses?", campo: "ohlaInfartoCorazon" },
  { texto: "¿Estuvo hospitalizado por cualquier otro problema del corazón, en los últimos 3 meses?", campo: "ohlaHospitalizadoCorazon" },
  { texto: "¿Está usando medicamentos para la tuberculosis, en este momento?", campo: "ohlaMedicamentoTuberculosis" },
  { texto: "¿Está embarazada, en este momento?", campo: "ohlaEmbarazada" },
];

// Header con datos de ficha, sede y fecha
const drawHeader = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(String(datos.norden || ""), pageW - 50, 16);

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + (datos.sede || datos.sedeDescripcion || ""), pageW - 80, 20);

  // Fecha de examen
  const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaAbs || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);

  // Página
  doc.text("Pag. 01", pageW - 30, 10);

  // Bloque de color
  drawColorBox(doc, {
    color: datos.codigoColor,
    text: datos.textoColor,
    x: pageW - 30,
    y: 10,
    size: 22,
    showLine: true,
    fontSize: 30,
  });
};

// Tabla de datos del paciente / empresa
const drawPatientData = (doc, datos = {}) => {
  const tablaInicioX = 15;
  const tablaAncho = 180;
  const filaAltura = 5;
  const lineH = 4;
  let yPos = 36;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DATOS PERSONALES Y LABORALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const sexo = datos.sexoPaciente === 'F' ? 'FEMENINO' : datos.sexoPaciente === 'M' ? 'MASCULINO' : (datos.sexo || '');

  // Fila de una sola columna (label + valor) con salto de línea automático si el valor no cabe
  const drawWrapRow = (label, value, valueX) => {
    const texto = String(value || '');
    const availableWidth = tablaAncho - (valueX - tablaInicioX) - 10;
    const lines = texto ? doc.splitTextToSize(texto, availableWidth) : [''];
    const rowH = Math.max(filaAltura, lines.length * lineH + 1.5);

    doc.rect(tablaInicioX, yPos, tablaAncho, rowH);
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(label, tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    lines.forEach((line, i) => {
      doc.text(line, tablaInicioX + valueX, yPos + 3.5 + i * lineH);
    });
    yPos += rowH;
  };

  drawWrapRow("Apellidos y Nombres:", datos.apellidosPaciente + " " + datos.nombresPaciente, 40);

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.dniPaciente || datos.dni || ''), tablaInicioX + 12, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Edad:", tablaInicioX + 47, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text((datos.edad || '') + " AÑOS", tablaInicioX + 58, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Sexo:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(sexo, tablaInicioX + 105, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha Nacimiento:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(toDDMMYYYY(datos.fechaNacimientoPaciente || datos.fechaNacimiento || ''), tablaInicioX + 35, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Tipo Examen:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.tipoExamen || datos.nombreExamen || '', tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  drawWrapRow("Empresa:", datos.empresa, 20);
  drawWrapRow("Contrata:", datos.contrata, 20);
  drawWrapRow("Ocupación:", datos.ocupacionPaciente || datos.ocupacion, 25);
  drawWrapRow("Cargo:", datos.cargoPaciente || datos.cargoDesempenar, 18);

  return yPos;
};

export default async function Espirometria_OHLA_Digitalizado(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const lineHTable = 4;
  const esOHLA = datos.esOHLA === true;
  // La versión general lleva 2 cuadros más (ítems 6–16 y 7 preguntas): filas más compactas para que todo entre en una
  // página junto con las firmas. Con OHLA se mantiene el espaciado de siempre.
  const paddingTop = esOHLA ? 1 : 0.5;
  const paddingBottom = esOHLA ? 1 : 0.5;
  const pageW = doc.internal.pageSize.getWidth();
  const tablaAncho = 180;
  const tablaInicioX = 15;

  // 1) Header
  await drawHeader(doc, datos);

  // 2) Título
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("CUESTIONARIO PLATINO - ESPIROMETRÍA", pageW / 2, 32, { align: "center" });

  // 3) Tabla de datos del paciente
  let y = drawPatientData(doc, datos);

  const colSiW = 15;
  const colNoW = 15;
  const colPreguntaW = tablaAncho - colSiW - colNoW;

  const drawSectionTitle = (texto) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, y, tablaAncho, 5, 'FD');
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(texto, tablaInicioX + 2, y + 3.5);
    y += 5;
  };

  const drawRow = (num, text, respuesta, notaLabel = "", notaBoldValue = null) => {
    doc.setFont("helvetica", "normal").setFontSize(8);
    const textoCompleto = `${num}. ${text}`;
    const lines = doc.splitTextToSize(textoCompleto, colPreguntaW - 4);
    let rowH = lines.length * lineHTable + paddingTop + paddingBottom;

    const notaTextCompleto = notaBoldValue ? `${notaLabel}${notaBoldValue}` : notaLabel;
    let notaLines = [];
    if (notaTextCompleto) {
      notaLines = doc.splitTextToSize(notaTextCompleto, colPreguntaW - 8);
      rowH += notaLines.length * lineHTable;
    }

    doc.rect(tablaInicioX, y, tablaAncho, rowH);
    doc.line(tablaInicioX + colPreguntaW, y, tablaInicioX + colPreguntaW, y + rowH);
    doc.line(tablaInicioX + colPreguntaW + colSiW, y, tablaInicioX + colPreguntaW + colSiW, y + rowH);

    lines.forEach((line, i) => {
      doc.text(line, tablaInicioX + 2, y + paddingTop + lineHTable - 1 + i * lineHTable);
    });

    if (notaTextCompleto) {
      doc.setFont("helvetica", "italic").setFontSize(7);
      const notaStartY = y + paddingTop + lines.length * lineHTable;
      const notaX = tablaInicioX + 6;

      if (notaBoldValue) {
        const lineY = notaStartY + lineHTable - 1;
        doc.text(notaLabel, notaX, lineY);
        const labelWidth = doc.getTextWidth(notaLabel);
        const valueX = notaX + labelWidth;

        doc.setFont("helvetica", "bold").setFontSize(7);
        doc.text(notaBoldValue, valueX, lineY);
        const valueWidth = doc.getTextWidth(notaBoldValue);
        doc.setLineWidth(0.2);
        doc.line(valueX, lineY + 0.5, valueX + valueWidth, lineY + 0.5);
      } else {
        notaLines.forEach((line, i) => {
          doc.text(line, notaX, notaStartY + lineHTable - 1 + i * lineHTable);
        });
      }
      doc.setFont("helvetica", "normal").setFontSize(8);
    }

    doc.text("SI ( " + (respuesta === true ? "X" : " ") + " )", tablaInicioX + colPreguntaW + 2, y + rowH / 2 + 1);
    doc.text("NO ( " + (respuesta === false ? "X" : " ") + " )", tablaInicioX + colPreguntaW + colSiW + 2, y + rowH / 2 + 1);

    y += rowH;
  };

  // Cuadro del profesional (ítems 6–16, solo versión general): 2 columnas como el formato en papel;
  // cada mitad = texto | SI | NO. La columna izquierda lleva los primeros ítems y la derecha el resto (la última celda queda vacía).
  const drawCriteriosProfesional = (items) => {
    const mitad = tablaAncho / 2;
    const colTexto = mitad - colSiW - colNoW;
    const filas = Math.ceil(items.length / 2);
    for (let f = 0; f < filas; f++) {
      const celdas = [items[f], items[f + filas]];
      doc.setFont("helvetica", "normal").setFontSize(8);
      const lineas = celdas.map((it) => (it ? doc.splitTextToSize(`${it.numero}. ${it.texto}`, colTexto - 4) : []));
      const rowH = Math.max(...lineas.map((l) => l.length), 1) * lineHTable + paddingTop + paddingBottom;

      doc.rect(tablaInicioX, y, tablaAncho, rowH);
      doc.line(tablaInicioX + mitad, y, tablaInicioX + mitad, y + rowH);
      celdas.forEach((it, c) => {
        if (!it) return;
        const x0 = tablaInicioX + c * mitad;
        doc.line(x0 + colTexto, y, x0 + colTexto, y + rowH);
        doc.line(x0 + colTexto + colSiW, y, x0 + colTexto + colSiW, y + rowH);
        lineas[c].forEach((linea, i) => {
          doc.text(linea, x0 + 2, y + paddingTop + lineHTable - 1 + i * lineHTable);
        });
        const respuesta = datos[it.campo];
        doc.text("SI ( " + (respuesta === true ? "X" : " ") + " )", x0 + colTexto + 2, y + rowH / 2 + 1);
        doc.text("NO ( " + (respuesta === false ? "X" : " ") + " )", x0 + colTexto + colSiW + 2, y + rowH / 2 + 1);
      });
      y += rowH;
    }
  };

  // I. Preguntas de Exclusión para la Espirometría (variante OHLA o general, igual que el formulario)
  const preguntasExclusion = esOHLA ? PREGUNTAS_EXCLUSION_OHLA : PREGUNTAS_EXCLUSION_GENERAL;
  drawSectionTitle("I. PREGUNTAS DE EXCLUSIÓN PARA LA ESPIROMETRÍA");
  preguntasExclusion.forEach(({ texto, campo }, i) => drawRow(i + 1, texto, datos[campo]));

  // Pulso: solo con OHLA (se numera 7, a continuación de sus 6 preguntas). La versión general no lo lleva, igual que su formulario.
  if (esOHLA) {
    doc.rect(tablaInicioX, y, tablaAncho, 6);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(`${preguntasExclusion.length + 1}. Pulso:`, tablaInicioX + 2, y + 4);
    doc.setFont("helvetica", "normal");
    doc.text(`${datos.pulso || ''} bpm`, tablaInicioX + 22, y + 4);
    y += 6;
  }

  // Versión general (sin OHLA): cuadro de los ítems 6–16, los llena el profesional que realiza la prueba
  if (!esOHLA) {
    drawSectionTitle("II. PARA SER LLENADO POR EL PROFESIONAL QUE REALIZA LA PRUEBA");
    drawCriteriosProfesional(CRITERIOS_PROFESIONAL);
  }

  // Preguntas para entrevistados sin criterios de exclusión (II con OHLA, III en la versión general)
  drawSectionTitle(`${esOHLA ? "II" : "III"}. PREGUNTAS PARA ENTREVISTADOS SIN CRITERIOS DE EXCLUSIÓN`);
  if (esOHLA) {
    drawRow(1, "¿Tuvo una infección respiratoria (resfriado), en las últimas 3 semanas?", datos.ohlaInfeccionRespiratoria);
    drawRow(2, "¿Usó cualquier remedio o medicamento para la respiración (aerosoles, sprays inhalados o nebulizaciones), en las últimas 3 horas?", datos.ohlaUsoMedicamentoRespiracion);
    drawRow(
      3,
      "¿Fumó cualquier tipo de cigarro (puro o pipa), en las últimas dos horas?",
      datos.ohlaFumoCigarro,
      datos.ohlaFumoCigarro ? "¿Cuántos? " : "",
      datos.ohlaFumoCigarro ? (datos.ohlaFumoCigarroCuantos || "") : null
    );
    drawRow(4, "¿Realizó algún ejercicio físico fuerte, como gimnasia, caminata o trotar, en la última hora?", datos.ohlaEjercicioFisico);
  } else {
    PREGUNTAS_ENTREVISTADOS_GENERAL.forEach(({ numero, campo, texto, campoCuantos }) => {
      const conCuantos = Boolean(campoCuantos && datos[campo]);
      drawRow(
        numero,
        texto,
        datos[campo],
        conCuantos ? "¿Cuántos? " : "",
        conCuantos ? (datos[campoCuantos] || "") : null
      );
    });
  }

  // Resultado de la prueba (5): solo con OHLA, igual que el formulario. La versión general no lo lleva.
  if (esOHLA) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    const resultadoLines = doc.splitTextToSize(`5. Resultado de la Prueba:`, tablaAncho - 4);
    const alturaOpciones = RESULTADO_PRUEBA_OPCIONES.length * lineHTable;
    const rowHResultado = resultadoLines.length * lineHTable + alturaOpciones + paddingTop + paddingBottom;

    doc.rect(tablaInicioX, y, tablaAncho, rowHResultado);
    doc.setFont("helvetica", "bold");
    resultadoLines.forEach((line, i) => {
      doc.text(line, tablaInicioX + 2, y + paddingTop + lineHTable - 1 + i * lineHTable);
    });

    let yOpcion = y + paddingTop + resultadoLines.length * lineHTable;
    doc.setFont("helvetica", "normal");
    RESULTADO_PRUEBA_OPCIONES.forEach((opcion) => {
      const marcado = datos.ohlaResultadoPrueba === opcion.value;
      doc.text(`( ${marcado ? "X" : " "} ) ${opcion.label}`, tablaInicioX + 6, yOpcion + lineHTable - 1);
      yOpcion += lineHTable;
    });
    y += rowHResultado;
  }

  // Firmas y Footer (solo SELLOFIRMA y SELLOFIRMADOCASIG, sin firma/huella del paciente)
  y += 10;
  const datosFirmas = {
    ...datos,
    digitalizacion: (datos.digitalizacion || []).filter((item) =>
      ["FIRMAP", "HUELLA","SELLOFIRMA"].includes(item.nombreDigitalizacion)
    ),
  };
  await dibujarFirmas({ doc, datos: datosFirmas, y: y - 7, pageW, mostrarFirmaPaciente: true });
  footerTR(doc, { footerOffsetY: 8, fontSize: 8 });

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
