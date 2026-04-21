import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { dibujarFirmas } from '../../utils/dibujarFirmas.js';

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

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 20);

  // Fecha de examen
  const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || "");
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
    textPosition: 0.9
  });
};

// Función para dibujar datos del paciente en tabla
const drawPatientData = (doc, datos = {}) => {
  const tablaInicioX = 15;
  const tablaAncho = 180;
  const filaAltura = 5;
  let yPos = 43-7;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const sexo = datos.sexoPaciente === 'F' ? 'FEMENINO' : datos.sexoPaciente === 'M' ? 'MASCULINO' : (datos.sexo || '');

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text((datos.apellidos || '') + " " + (datos.nombres || ''), tablaInicioX + 40, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
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
  doc.text("Estado Civil:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.estadoCivilPaciente || datos.estadoCivil || '', tablaInicioX + 25, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Tipo Examen:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nomExamen || datos.tipoExamen || '', tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha Nacimiento:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(toDDMMYYYY(datos.fechaNacimientoPaciente || datos.fechaNacimiento || ''), tablaInicioX + 35, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Lugar de Nacimiento:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.lugarNacimientoPaciente || datos.lugarNacimiento || '', tablaInicioX + 128, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Nivel de Estudio:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nivelEstudioPaciente || datos.nivelEstudios || '', tablaInicioX + 32, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Ocupación:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.ocupacionPaciente || datos.ocupacion || '', tablaInicioX + 25, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Cargo:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.cargoDe || datos.cargoPaciente || datos.cargoDesempenar || '', tablaInicioX + 108, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Área:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.areaO || datos.areaPaciente || datos.area || '', tablaInicioX + 15, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Empresa:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.razonEmpresa || datos.empresa || '', tablaInicioX + 20, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Contrata:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.razonContrata || datos.contrata || '', tablaInicioX + 22, yPos + 3.5);
  yPos += filaAltura;

  return yPos;
};

export default async function TamizajeDermatologico(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const lineHTable = 4;
  const paddingTop = 1;
  const paddingBottom = 1;
  const pageW = doc.internal.pageSize.getWidth();
  const tablaAncho = 180;
  const tablaInicioX = 15;

  // 1) Header
  await drawHeader(doc, datos);

  // 2) Título TAMIZAJE DERMATOLÓGICO
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("TAMIZAJE DERMATOLÓGICO", pageW / 2, 32, { align: "center" });

  // 3) Tabla de datos del paciente
  let y = drawPatientData(doc, datos);

  // 4) Sección TRABAJADOR (Preguntas)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, y, tablaAncho, 5, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("TRABAJADOR", tablaInicioX + 2, y + 3.5);
  y += 5;

  const colSiW = 15;
  const colNoW = 15;
  const colPreguntaW = tablaAncho - colSiW - colNoW;

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

    // Dibujar rectángulo de la fila
    doc.rect(tablaInicioX, y, tablaAncho, rowH);
    doc.line(tablaInicioX + colPreguntaW, y, tablaInicioX + colPreguntaW, y + rowH);
    doc.line(tablaInicioX + colPreguntaW + colSiW, y, tablaInicioX + colPreguntaW + colSiW, y + rowH);

    // Texto de la pregunta
    lines.forEach((line, i) => {
      doc.text(line, tablaInicioX + 2, y + paddingTop + lineHTable - 1 + i * lineHTable);
    });

    // Texto de la nota
    if (notaText) {
      doc.setFont("helvetica", "italic").setFontSize(7);
      const notaStartY = y + paddingTop + lines.length * lineHTable;
      notaLines.forEach((line, i) => {
        doc.text(line, tablaInicioX + 6, notaStartY + lineHTable - 1 + i * lineHTable);
      });
      doc.setFont("helvetica", "normal").setFontSize(8);
    }

    // SI / NO
    doc.text("SI ( " + (respuesta === true ? "X" : " ") + " )", tablaInicioX + colPreguntaW + 2, y + rowH / 2 + 1);
    doc.text("NO ( " + (respuesta === false ? "X" : " ") + " )", tablaInicioX + colPreguntaW + colSiW + 2, y + rowH / 2 + 1);

    y += rowH;
  };

  // Preguntas Sección I
  drawRow(1, "¿Sufre Ud. alguna enfermedad de la piel?", datos.tieneEnfermedadPiel, datos.tieneEnfermedadPiel ? `Si respondió sí, ¿Qué diagnóstico tiene? ${datos.diagnosticoEnfermedad || ""}` : "");
  drawRow(2, "Actualmente, ¿Tiene alguna lesión?", datos.tieneLesionActual, datos.tieneLesionActual ? `Si respondió sí, ¿Dónde se localiza? ${datos.localizacionLesion || ""} - ¿Desde cuándo tiene la lesión? ${datos.tiempoLesion || ""}` : "");
  drawRow(3, "¿Presenta algún cambio de coloración de la piel?", datos.cambioColoracionPiel);
  drawRow(4, "¿Estas lesiones se repiten varias veces al año?", datos.lesionesRecurrentesAnuales);
  drawRow(5, "¿Usted tiene enrojecimiento de alguna zona del cuerpo?", datos.tieneEnrojecimiento, datos.tieneEnrojecimiento ? `Si respondió sí, ¿Dónde se localiza? ${datos.localizacionEnrojecimiento || ""}` : "");
  drawRow(6, "¿Tiene comezón?", datos.tieneComezon, datos.tieneComezon ? `Si respondió sí, ¿Dónde se localiza? ${datos.localizacionComezon || ""}` : "");
  drawRow(7, "¿Presenta hinchazón en parte de su cuerpo?", datos.tieneHinchazon, datos.tieneHinchazon ? `Si respondió sí, ¿Dónde se localiza? ${datos.localizacionHinchazon || ""}` : "");
  drawRow(8, "¿Sufre de Rinitis Alérgica o ASMA?", datos.tieneRinitisOAsma);
  drawRow(9, "¿Usa EPP?", datos.usaEpp, datos.usaEpp ? `Si respondió sí, ¿Qué tipo de protección usa? ${datos.tipoEpp || ""}` : "");
  drawRow(10, "¿Presenta cambios en las uñas?", datos.cambiosEnUnas);
  drawRow(11, "¿Está tomando alguna medicación?", datos.tomaMedicacion);



  // II. COMENTARIOS
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, y, tablaAncho, 5, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("II. COMENTARIOS", tablaInicioX + 2, y + 3.5);
  y += 5;

  doc.setFont("helvetica", "normal").setFontSize(7);
  const comentariosLines = doc.splitTextToSize(datos.comentarios || "", tablaAncho - 4);
  const lineH = 3.5;
  const rectH = Math.max(20, (comentariosLines.length * lineH) + 2);

  doc.rect(tablaInicioX, y, tablaAncho, rectH);
  comentariosLines.forEach((line, i) => {
    doc.text(line, tablaInicioX + 2, y + 3 + i * lineH);
  });
  y += rectH;



  // III. PARA EL MÉDICO
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, y, tablaAncho, 5, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("III. PARA EL MÉDICO", tablaInicioX + 2, y + 3.5);
  y += 5;

  drawRow(1, "El paciente, al examen físico, ¿presenta alguna lesión sugerente a Dermatopatía?", datos.hallazgoSugerenteDermatopatia);
  drawRow(2, "El paciente necesita ser evaluado por médico dermatológico para la realización de las siguientes pruebas: De sensibilidad subcutánea, luz de Wood y Maniobra de Nikolsky", datos.requiereEvaluacionDermatologica);
  drawRow(3, "El paciente, ¿Necesita interconsulta con la especialidad de Dermatología?", datos.requiereInterconsultaEspecialidad);

  // Signatures and Footer
  y += 10;
  await dibujarFirmas({ doc, datos, y: y-7, pageW });
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
