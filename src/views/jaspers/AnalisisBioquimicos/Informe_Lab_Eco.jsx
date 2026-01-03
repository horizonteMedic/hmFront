// src/views/jaspers/AnalisisBioquimicos/Informe_Lab_Eco.jsx
import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { dibujarFirmas } from '../../utils/dibujarFirmas.js';

// --- Configuración Centralizada ---
const config = {
  margin: 15,
  fontSize: {
    title: 14,
    header: 9,
    body: 9,
  },
  font: 'helvetica',
  lineHeight: 7,
};

// --- Componente Principal ---

export default async function Informe_Lab_Eco(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  await drawHeader(doc, datos);

  // === TÍTULO ===
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("ANALISIS BIOQUIMICOS", pageW / 2, 38, { align: "center" });
  doc.setFont(config.font, "bold").setFontSize(12);
  doc.text("EXAMEN COMPLETO DE ORINA", pageW / 2, 44, { align: "center" });

  // === DATOS DEL PACIENTE ===
  drawPatientData(doc, datos);

  let y = 100;
  const colData = 55;

  // === EXAMEN MACROSCÓPICO DE LA ORINA ===
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("Examen Macroscópico de la orina", config.margin, y);
  y += config.lineHeight;

  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  const macroscopico = [
    ["Color", datos.txtColor || datos.colorUrina || ""],
    ["Aspecto", datos.txtAspecto || datos.aspecto || ""],
    ["Densidad", datos.txtDensidad || datos.densidad || ""],
    ["pH", datos.txtPh || datos.ph || ""],
    ["Glucosa", datos.txtGlucosa || datos.glucosa || ""],
    ["Urobilinógeno", datos.txtUrobilinogeno || datos.urobilinogeno || ""],
    ["Bilirrubinas", datos.txtBilirrubinas || datos.bilirrubina || ""],
    ["Proteínas", datos.txtProteinas || datos.proteinas || ""],
    ["Nitritos", datos.txtNitritos || datos.nitritos || ""],
    ["Cetonas", datos.txtCetonas || datos.cetonas || ""],
    ["Ácido ascórbico", datos.txtAcidoAscorbico || datos.acAscorbico || ""],
    ["Sangre", datos.txtSangre || datos.sangre || ""],
    ["Leucocitos", datos.txtLeucocitos || datos.leucocitosEq || ""],
  ];

  macroscopico.forEach(([lbl, value]) => {
    doc.text(lbl, config.margin, y);
    doc.text(":", colData - 5, y);
    doc.text(String(value), colData, y);
    y += 5;
  });

  y += 4;

  // === SEDIMENTO URINARIO ===
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("Sedimento urinario", config.margin, y);
  y += config.lineHeight;

  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  const sedimento = [
    ["Células epiteliales", datos.txtCelulasEpiteliales || datos.celulasEpiteliales || ""],
    ["Leucocitos", datos.txtLeuocitosSedimento || datos.leucocitosSu || ""],
    ["Hematíes", datos.txtHematiesSedimento || datos.hematiesSu || ""],
    ["Cristales", datos.txtCristales || datos.cristales || ""],
    ["Cilindros", datos.txtCilindros || datos.cilindros || ""],
    ["Bacterias", datos.txtBacterias || datos.bacterias || ""],
    ["Gram S/C", datos.txtGramSC || datos.gramSC || ""],
    ["Otros", datos.txtOtros || datos.otros || ""],
  ];

  sedimento.forEach(([lbl, value]) => {
    doc.text(lbl, config.margin, y);
    doc.text(":", colData - 5, y);
    doc.text(String(value), colData, y);
    y += 5;
  });

  // === TOXICOLOGÍA ===
  if (datos.cocaina || datos.marihuana) {
    y += 4;
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text("Toxicología", config.margin, y);
    y += config.lineHeight;

    doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
    if (datos.cocaina) {
      doc.text("Cocaína:", config.margin, y);
      doc.text(String(datos.cocaina), colData, y);
      y += 5;
    }
    if (datos.marihuana) {
      doc.text("Marihuana:", config.margin, y);
      doc.text(String(datos.marihuana), colData, y);
      y += 5;
    }
  }

  // === OBSERVACIONES ===
  if (datos.observaciones) {
    y += 4;
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text("Observaciones:", config.margin, y);
    y += config.lineHeight;
    doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
    const observacionesLines = doc.splitTextToSize(datos.observaciones, pageW - (config.margin * 2));
    observacionesLines.forEach(line => {
      doc.text(line, config.margin, y);
      y += 4;
    });
  }

  // === FIRMAS ===
  const yFirmas = 210; // Posición para las firmas (abajo)
  await dibujarFirmas({ doc, datos: datos, y: yFirmas, pageW });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });

  // === IMPRIMIR ===
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}

// --- Funciones de Ayuda ---

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha;
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

// Header con datos de ficha, sede y fecha
const drawHeader = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 20);

  const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || datos.fechaLab || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);

  doc.text("Pag. 01", pageW - 30, 10);

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
  let yPos = 46;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const sexo = datos.sexoPaciente === 'F' ? 'FEMENINO' : datos.sexoPaciente === 'M' ? 'MASCULINO' : datos.sexo === 'F' ? 'FEMENINO' : datos.sexo === 'M' ? 'MASCULINO' : '';

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nombres || datos.nombreCompleto || '', tablaInicioX + 40, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.dni || ''), tablaInicioX + 12, yPos + 3.5);
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
  doc.text("Lugar de Nacimiento:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.lugarNacimientoPaciente || datos.lugarNacimiento || '', tablaInicioX + 38, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Estado Civil:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.estadoCivilPaciente || datos.estadoCivil || '', tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("T. Examen:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nombreExamen || '', tablaInicioX + 25, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha Nac.:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(toDDMMYYYY(datos.fechaNacimientoPaciente || datos.fechaNacimiento || ''), tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Nivel de Estudio:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nivelEstudioPaciente || datos.nivelEstudios || '', tablaInicioX + 32, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Ocupación:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.ocupacionPaciente || datos.ocupacion || '', tablaInicioX + 25, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Cargo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.cargoPaciente || datos.cargo || '', tablaInicioX + 18, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Área:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.areaPaciente || datos.area || '', tablaInicioX + 15, yPos + 3.5);
  yPos += filaAltura;

  return yPos;
};
