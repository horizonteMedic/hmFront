import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { dibujarFirmas } from '../../utils/dibujarFirmas.js';

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
  doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 20);

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
    const availableWidth = tablaAncho - (valueX - tablaInicioX) - 4;
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

  drawWrapRow("Apellidos y Nombres:", datos.nombres, 40);

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
  drawWrapRow("Contrata:", datos.contrata, 22);
  drawWrapRow("Ocupación:", datos.ocupacionPaciente || datos.ocupacion, 25);
  drawWrapRow("Cargo:", datos.cargoPaciente || datos.cargoDesempenar, 18);

  return yPos;
};

export default async function Espirometria_OHLA_Digitalizado(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const lineHTable = 4;
  const paddingTop = 1;
  const paddingBottom = 1;
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

  const drawRow = (num, text, respuesta, notaText = "") => {
    doc.setFont("helvetica", "normal").setFontSize(8);
    const textoCompleto = `${num}. ${text}`;
    const lines = doc.splitTextToSize(textoCompleto, colPreguntaW - 4);
    let rowH = lines.length * lineHTable + paddingTop + paddingBottom;

    let notaLines = [];
    if (notaText) {
      notaLines = doc.splitTextToSize(notaText, colPreguntaW - 8);
      rowH += notaLines.length * lineHTable;
    }

    doc.rect(tablaInicioX, y, tablaAncho, rowH);
    doc.line(tablaInicioX + colPreguntaW, y, tablaInicioX + colPreguntaW, y + rowH);
    doc.line(tablaInicioX + colPreguntaW + colSiW, y, tablaInicioX + colPreguntaW + colSiW, y + rowH);

    lines.forEach((line, i) => {
      doc.text(line, tablaInicioX + 2, y + paddingTop + lineHTable - 1 + i * lineHTable);
    });

    if (notaText) {
      doc.setFont("helvetica", "italic").setFontSize(7);
      const notaStartY = y + paddingTop + lines.length * lineHTable;
      notaLines.forEach((line, i) => {
        doc.text(line, tablaInicioX + 6, notaStartY + lineHTable - 1 + i * lineHTable);
      });
      doc.setFont("helvetica", "normal").setFontSize(8);
    }

    doc.text("SI ( " + (respuesta === true ? "X" : " ") + " )", tablaInicioX + colPreguntaW + 2, y + rowH / 2 + 1);
    doc.text("NO ( " + (respuesta === false ? "X" : " ") + " )", tablaInicioX + colPreguntaW + colSiW + 2, y + rowH / 2 + 1);

    y += rowH;
  };

  // I. Preguntas de Exclusión para la Espirometría
  drawSectionTitle("I. PREGUNTAS DE EXCLUSIÓN PARA LA ESPIROMETRÍA");
  drawRow(1, "¿Tuvo alguna cirugía (operación) en su pulmón, en su tórax o en su abdomen, en los últimos 3 meses?", datos.ohlaCirugiaPulmonToraxAbdomen);
  drawRow(2, "¿Tuvo un ataque cardiaco o infarto al corazón, en los últimos 3 meses?", datos.ohlaInfartoCorazon);
  drawRow(3, "¿Tuvo desprendimiento de la retina o una operación (cirugía) de los ojos, en los últimos 3 meses?", datos.ohlaDesprendimientoRetina);
  drawRow(4, "¿Estuvo hospitalizado por cualquier otro problema del corazón, en los últimos 3 meses?", datos.ohlaHospitalizadoCorazon);
  drawRow(5, "¿Está usando medicamentos para la tuberculosis, en este momento?", datos.ohlaMedicamentoTuberculosis);
  drawRow(6, "¿Está embarazada, en este momento?", datos.ohlaEmbarazada);

  // Pulso
  doc.rect(tablaInicioX, y, tablaAncho, 6);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("7. Pulso:", tablaInicioX + 2, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.ohlaPulso || ''} bpm`, tablaInicioX + 22, y + 4);
  y += 6;

  // II. Preguntas para entrevistados sin criterios de exclusión
  drawSectionTitle("II. PREGUNTAS PARA ENTREVISTADOS SIN CRITERIOS DE EXCLUSIÓN");
  drawRow(1, "¿Tuvo una infección respiratoria (resfriado), en las últimas 3 semanas?", datos.ohlaInfeccionRespiratoria);
  drawRow(2, "¿Usó cualquier remedio o medicamento para la respiración (aerosoles, sprays inhalados o nebulizaciones), en las últimas 3 horas?", datos.ohlaUsoMedicamentoRespiracion);
  drawRow(3, "¿Fumó cualquier tipo de cigarro (puro o pipa), en las últimas dos horas?", datos.ohlaFumoCigarro, datos.ohlaFumoCigarro ? `¿Cuántos? ${datos.ohlaFumoCigarroCuantos || ""}` : "");
  drawRow(4, "¿Realizó algún ejercicio físico fuerte, como gimnasia, caminata o trotar, en la última hora?", datos.ohlaEjercicioFisico);

  // 5. Resultado de la prueba
  doc.setFont("helvetica", "normal").setFontSize(8);
  const resultadoLines = doc.splitTextToSize("5. Resultado de la Prueba:", tablaAncho - 4);
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

  // Firmas y Footer (solo SELLOFIRMA y SELLOFIRMADOCASIG, sin firma/huella del paciente)
  y += 10;
  const datosFirmas = {
    ...datos,
    digitalizacion: (datos.digitalizacion || []).filter((item) =>
      ["SELLOFIRMA", "SELLOFIRMADOCASIG"].includes(item.nombreDigitalizacion)
    ),
  };
  await dibujarFirmas({ doc, datos: datosFirmas, y: y - 7, pageW, mostrarFirmaPaciente: false });
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
