import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { getSignCompressed } from "../../utils/helpers.js";

// --- Configuración Centralizada ---
const config = {
  margin: 10,
  col1X: 10,
  tablaAncho: 190,
  fontSize: {
    title: 16,
    header: 9,
    body: 8.5,
    small: 7,
  },
  font: 'helvetica',
  lineHeight: 5,
};

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha;
  const parts = fecha.split('-');
  if (parts.length !== 3) return fecha;
  const [anio, mes, dia] = parts;
  return `${dia}/${mes}/${anio}`;
};

// Header con datos de ficha, sede y fecha
const drawHeader = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Pag. 01", pageW - 30, 10);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "normal").setFontSize(22);
  doc.text(String(datos.norden || ""), pageW - 55, 16);

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 20);

  // Fecha de examen
  const fechaExamen = toDDMMYYYY(datos.fechaExamen || datos.fechaApertura || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);

  // Bloque de color
  drawColorBox(doc, {
    color: datos.codigoColor,
    text: datos.textoColor,
    x: pageW - 35,
    y: 10,
    size: 22,
    showLine: true,
    fontSize: 35,
    textPosition: 0.9
  });
};

const drawPatientData = (doc, datos = {}) => {
  const tablaInicioX = config.margin;
  const tablaAncho = config.tablaAncho;
  const filaAltura = 5;
  let yPos = 40;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(204, 204, 204); // #cccccc
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Fila: Apellidos y Nombres
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(config.fontSize.body);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.nombreCompletoPaciente || datos.nombresPaciente + " " + datos.apellidosPaciente || ""), tablaInicioX + 35, yPos + 3.5);
  yPos += filaAltura;

  // Fila: DNI, Edad, Sexo
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 140, yPos, tablaInicioX + 140, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.dniPaciente || ""), tablaInicioX + 10, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Edad:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.edadPaciente || "") + " AÑOS", tablaInicioX + 105, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Sexo:", tablaInicioX + 142, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.sexoPaciente === 'M' ? 'MASCULINO' : 'FEMENINO', tablaInicioX + 155, yPos + 3.5);
  yPos += filaAltura;

  // Fila: Lugar de Nacimiento, Estado Civil
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Lugar de Nacimiento:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.lugarNacimientoPaciente || ""), tablaInicioX + 35, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Estado Civil:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.estadoCivilPaciente || ""), tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  // Fila: Tipo Examen, Fecha Nac.
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Tipo Examen:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.tipoExamen || ""), tablaInicioX + 25, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha Nac.:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(toDDMMYYYY(datos.fechaNacimientoPaciente || ""), tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  // Fila: Nivel de Estudio
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Nivel de Estudio:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.nivelEstudioPaciente || ""), tablaInicioX + 30, yPos + 3.5);
  yPos += filaAltura;

  // Fila: Ocupación
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Ocupación:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.ocupacionPaciente || ""), tablaInicioX + 22, yPos + 3.5);
  yPos += filaAltura;

  // Fila: Cargo
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Cargo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.cargoPaciente || ""), tablaInicioX + 15, yPos + 3.5);
  yPos += filaAltura;

  // Fila: Área
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Área:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.areaPaciente || ""), tablaInicioX + 15, yPos + 3.5);
  yPos += filaAltura;

  // Fila: Empresa
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Empresa:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.empresa || ""), tablaInicioX + 20, yPos + 3.5);
  yPos += filaAltura;

  // Fila: Contrata
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Contrata:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.contrata || ""), tablaInicioX + 20, yPos + 3.5);
  yPos += filaAltura;

  return yPos;
};

const drawExamsTable = (doc, datos = {}, startY) => {
  const tablaInicioX = config.margin;
  const tablaAncho = config.tablaAncho;
  let yPos = startY + 5;

  // Headers
  doc.setFillColor(204, 204, 204);
  doc.rect(tablaInicioX, yPos, 80, 5, 'FD');
  doc.rect(tablaInicioX + 80, yPos, 50, 5, 'FD');
  doc.rect(tablaInicioX + 130, yPos, 60, 5, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("EXÁMENES", tablaInicioX + 40, yPos + 3.5, { align: "center" });
  doc.text("PRUEBAS REALIZADAS POR", tablaInicioX + 105, yPos + 3.5, { align: "center" });
  doc.text("OBSERVACIONES", tablaInicioX + 160, yPos + 3.5, { align: "center" });
  yPos += 5;

  // TRIAJE
  doc.setFont("helvetica", "bold").setFontSize(config.fontSize.body);

  const triajeTitle = "TRIAJE";
  const triajeUser = String(datos.usuarioTriaje || "");
  const triajeObs = String(datos.observacionesTriaje || "");

  doc.setFontSize(7);
  const triajeUserLines = doc.splitTextToSize(triajeUser, 46);
  doc.setFontSize(5);
  const triajeObsLines = doc.splitTextToSize(triajeObs, 56);

  const maxTriajeLinesHeight = Math.max(1, triajeUserLines.length * 2.8, triajeObsLines.length * 2);
  const triajeRowH = Math.max(5, maxTriajeLinesHeight + 2);

  doc.rect(tablaInicioX, yPos, 80, triajeRowH);
  doc.rect(tablaInicioX + 80, yPos, 50, triajeRowH);
  doc.rect(tablaInicioX + 130, yPos, 60, triajeRowH);

  doc.setFont("helvetica", "bold").setFontSize(config.fontSize.body);
  doc.text(triajeTitle, tablaInicioX + 2, yPos + 3.5);

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(triajeUserLines, tablaInicioX + 82, yPos + 3.5);

  doc.setFontSize(5);
  doc.text(triajeObsLines, tablaInicioX + 132, yPos + 3.5);
  yPos += triajeRowH;

  // SIGNOS VITALES
  const colW = tablaAncho / 9;
  for (let i = 0; i < 9; i++) {
    doc.rect(tablaInicioX + i * colW, yPos, colW, 5);
  }
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("PESO: ", tablaInicioX + 1, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.peso || ""), tablaInicioX + 9, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("TALLA: ", tablaInicioX + colW + 1, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.talla || ""), tablaInicioX + colW + 10, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("P/A: ", tablaInicioX + colW * 2 + 1, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.pa || ""), tablaInicioX + colW * 2 + 7, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("SAT O2: ", tablaInicioX + colW * 3 + 1, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.sat02 || ""), tablaInicioX + colW * 3 + 11, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("CINTURA: ", tablaInicioX + colW * 4 + 1, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.cintura || ""), tablaInicioX + colW * 4 + 13, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("CADERA: ", tablaInicioX + colW * 5 + 1, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.cadera || ""), tablaInicioX + colW * 5 + 13, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("FC: ", tablaInicioX + colW * 6 + 1, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.fc || ""), tablaInicioX + colW * 6 + 6, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("FR: ", tablaInicioX + colW * 7 + 1, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.fr || ""), tablaInicioX + colW * 7 + 6, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("CUELLO: ", tablaInicioX + colW * 8 + 1, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.cuello || ""), tablaInicioX + colW * 8 + 12, yPos + 3.5);
  yPos += 5;

  const exams = [
    { title: "MEDICINA", sub: "*Evaluación médica", user: datos.usuarioEvaluacionMedica, obs: datos.observacionesEvaluacionMedica },
    { title: "EVALUACIÓN PSICOLÓGICA", sub: "*Informe Psicológico Brigadista", user: datos.usuarioInformeBrigadista, obs: datos.observacionInformeBrigadista },
    { title: "EVALUACIÓN VISUAL", sub: "*Evaluación Oftalmológica\n*Agudeza visual", user: datos.usuarioEvaluacionOftalmologica, obs: datos.observacionesEvaluacionVisual },
    { title: "EVALUACIÓN AUDIOMETRÍA", sub: "*Audiometría", user: datos.usuarioAudiometria, obs: datos.observacionAudiometria },
    { title: "EVALUACIÓN ESPIROMETRÍA", sub: "*Cuestionario de Espiometría", user: datos.usuarioEspirometria, obs: datos.observacionEspirometria },
    { title: "EVALUACIÓN RADIOGRAFÍA DE TÓRAX", sub: "*Tórax Convencional\n*Tórax OIT", user: datos.usuarioToraxConvencional, obs: datos.observacionRadiografiaTorax },
    { title: "CARDIOLOGÍA", sub: "*Electrocardiograma", user: datos.usuarioElectrocardiograma, obs: datos.observacionesElectrocardiograma },
    { title: "EXÁMENES DE LABORATORIO", sub: "", user: datos.usuarioExamenLaboratorio, obs: datos.observacionesExamenLaboratorio },
    { title: "BRIGADISTA", sub: "*Examen Médico Brigadista\n*Certificado De Aptitud Brigadista\n*Hoja de Consulta Externa - Bri", user: datos.usuarioCertificadoAptitudBrigadista, obs: datos.observacionBrigadista },
  ];

  exams.forEach(exam => {
    // Calculamos las líneas de cada columna
    doc.setFontSize(7);
    const userLines = doc.splitTextToSize(String(exam.user || ""), 46);
    doc.setFontSize(5);
    const obsLines = doc.splitTextToSize(String(exam.obs || ""), 56);

    // Calculamos la altura de la columna de Examen (que tiene título y subtítulo)
    let examHeight = 5; // Altura base para el título
    if (exam.sub) {
      const subLines = exam.sub.split('\n');
      examHeight += (subLines.length * 3.5);
    }

    // Calculamos la altura necesaria según el contenido más largo
    const maxContentLinesHeight = Math.max(userLines.length * 2.8, obsLines.length * 2);
    const contentHeight = maxContentLinesHeight + 2;

    // Altura final de la fila (mínimo 8)
    const rowH = Math.max(8, examHeight, contentHeight);

    doc.rect(tablaInicioX, yPos, 80, rowH);
    doc.rect(tablaInicioX + 80, yPos, 50, rowH);
    doc.rect(tablaInicioX + 130, yPos, 60, rowH);

    // Dibujamos columna 1: Examen
    doc.setFont("helvetica", "bold").setFontSize(config.fontSize.body).setTextColor(0, 0, 0);
    doc.text(exam.title, tablaInicioX + 2, yPos + 3.5);
    if (exam.sub) {
      doc.setFont("helvetica", "italic").setFontSize(7).setTextColor(68, 68, 68);
      const subLines = exam.sub.split('\n');
      subLines.forEach((line, i) => {
        doc.text(line, tablaInicioX + 2, yPos + 7 + (i * 3.5));
      });
    }

    // Dibujamos columna 2: Usuario (Pruebas realizadas por)
    doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(0, 0, 0);
    doc.text(userLines, tablaInicioX + 82, yPos + 3.5);

    // Dibujamos columna 3: Observaciones
    doc.setFontSize(5);
    doc.text(obsLines, tablaInicioX + 132, yPos + 3.5);

    yPos += rowH;
  });

  return yPos;
};

const drawFooterSection = (doc, datos = {}, startY) => {
  const tablaInicioX = config.margin;
  let yPos = startY + 5;

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Observaciones", tablaInicioX, yPos + 3.5);

  const obsText = String(datos.observacionesGenerales || "");
  doc.setFont("helvetica", "normal").setFontSize(8);
  const obsLines = doc.splitTextToSize(obsText, 160);
  const rectH = Math.max(8, obsLines.length * 3.5 + 2);

  doc.setFillColor(242, 242, 242);
  doc.rect(tablaInicioX + 25, yPos, 165, rectH, 'FD');
  doc.text(obsLines, tablaInicioX + 27, yPos + 3.5);

  yPos += rectH + 4;

  doc.setFont("helvetica", "bold");
  doc.text("Hora de entrada: ", tablaInicioX, yPos);
  doc.setFont("helvetica", "normal").setTextColor(0, 0, 128);
  doc.text(String(datos.horaEntrada || ""), tablaInicioX + 30, yPos);

  doc.setFont("helvetica", "bold").setTextColor(0, 0, 0);
  doc.text("Hora de salida: ", config.tablaAncho - 20, yPos, { align: "right" });
  doc.setFont("helvetica", "normal").setTextColor(0, 0, 128);
  doc.text(String(datos.horaSalida || ""), config.tablaAncho + 10, yPos, { align: "right" });

  return yPos + 10;
};

const drawSignature = async (doc, datos = {}, startY) => {
  const pageW = doc.internal.pageSize.getWidth();
  const sigW = 50;
  const sigH = 20;
  const sigY = startY + 5;
  const sigX = (pageW - sigW) / 2;

  const s1 = await getSignCompressed(datos, "SELLOFIRMA");
  const s2 = await getSignCompressed(datos, "SELLOFIRMADOCASIG");

  const addSello = (url, x) => {
    return new Promise((resolve) => {
      if (!url) return resolve();
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          doc.addImage(img, 'PNG', x, sigY, sigW, sigH);
          resolve();
        } catch (e) {
          console.error("Error adding signature image", e);
          resolve();
        }
      };
      img.onerror = () => resolve();
      img.src = url;
    });
  };

  if (s2) {
    await addSello(s2, sigX);
  } else if (s1) {
    await addSello(s1, sigX);
  }

  doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(0, 0, 0);
  doc.line(sigX, sigY + sigH, sigX + sigW, sigY + sigH);
  doc.text("FIRMA Y SELLO MÉDICO", pageW / 2, sigY + sigH + 4, { align: "center" });
};

export default async function HojaDeRutaEmo_Digitalizado(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  await drawHeader(doc, datos);
  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.text("HOJA DE RUTA PARA EMO", doc.internal.pageSize.getWidth() / 2, 35, { align: "center" });

  const yAfterPatient = drawPatientData(doc, datos);
  const yAfterExams = drawExamsTable(doc, datos, yAfterPatient);
  const yAfterFooter = drawFooterSection(doc, datos, yAfterExams);
  await drawSignature(doc, datos, yAfterFooter);

  footerTR(doc, datos);

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
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}
