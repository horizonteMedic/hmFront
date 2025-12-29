// src/views/jaspers/Microbiologia/InmunologiaRapida_Digitalizado.jsx
import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';

const config = {
  margin: 15,
  fontSize: {
    title: 14,
    header: 11,
    body: 11,
  },
  font: 'helvetica',
  lineHeight: 8,
};

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha; // ya está en formato correcto
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

// Función para formatear fecha larga
const formatDateToLong = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return toDDMMYYYY(dateString) || '';
  }
};

// Header con datos de ficha, sede y fecha
const drawHeader = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();

<<<<<<< HEAD
  CabeceraLogo(doc, { ...datos, tieneMembrete: false });
=======
  await CabeceraLogo(doc, { ...datos, tieneMembrete: false });
>>>>>>> 26e624014566d7a1c94a7d61ccf7ba918c25e50a

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

// Función para dibujar datos del paciente
const drawPatientData = (doc, datos = {}) => {
  const margin = 15;
  let y = 40;
  const lineHeight = 6;
  const patientDataX = margin;

  const drawPatientDataRow = (label, value) => {
    const labelWithColon = label.endsWith(':') ? label : label + ' :';
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text(labelWithColon, patientDataX, y);
    let valueX = patientDataX + doc.getTextWidth(labelWithColon) + 2;
    if (label.toLowerCase().includes('apellidos y nombres')) {
      const minGap = 23;
      if (doc.getTextWidth(labelWithColon) < minGap) valueX = patientDataX + minGap;
    }
    doc.setFont('helvetica', 'normal');
    doc.text(String(value || '').toUpperCase(), valueX, y);
    y += lineHeight;
  };

  drawPatientDataRow("Apellidos y Nombres :", datos.nombres || datos.nombresPaciente || '');
  drawPatientDataRow("Edad :", datos.edad || datos.edadPaciente ? `${datos.edad || datos.edadPaciente} AÑOS` : '');

  // Fecha
  doc.setFontSize(11).setFont('helvetica', 'bold');
  const fechaLabel = "Fecha :";
  doc.text(fechaLabel, patientDataX, y);
  doc.setFont('helvetica', 'normal');
  const fechaLabelWidth = doc.getTextWidth(fechaLabel);
  doc.text(formatDateToLong(datos.fechaExamen || datos.fecha || ''), patientDataX + fechaLabelWidth + 2, y);

  // Reseteo
  doc.setFont('helvetica', 'normal').setFontSize(10).setLineWidth(0.2);

  return y + lineHeight;
};

export default async function InmunologiaLab1_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
<<<<<<< HEAD
  drawHeader(doc, datos);
=======
  await drawHeader(doc, datos);

  // === TÍTULO ===
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("INMUNOLOGÍA", pageW / 2, 38, { align: "center" });
>>>>>>> 26e624014566d7a1c94a7d61ccf7ba918c25e50a

  // === DATOS DEL PACIENTE ===
  drawPatientData(doc, datos);

  // === CUERPO ===
  let y = 90; // Posición Y inicial después del nuevo header

  // Título
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("INMUNOLOGÍA", pageW / 2, y, { align: "center" });
  y += 10;

  // Encabezado de tabla
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  const colW = 60;
  const col1X = config.margin;
  const col2X = (pageW / 2) + colW;
  doc.text("PRUEBA", col1X, y);
  doc.text("RESULTADO", col2X, y, { align: "center" });
  y += 2;

  // Línea
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += 10;

  // Datos de la prueba (con etiqueta de 2 líneas)
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);

  const testLabel1 = "Prueba Rápida";
  const testLabel2 = "HEPATITIS A";
  const testValue = datos.hepatitisA != null ? datos.hepatitisA : "N/A";

  // Dibujar etiquetas de prueba alineadas a la izquierda
  doc.text(testLabel1, col1X, y);
  y += 5;
  doc.text(testLabel2, col1X, y);

  // Dibujar el resultado centrado
  const resultY = y - 2.5;
  doc.text(testValue, col2X, resultY, { align: "center" });

  // === FOOTER ===
  footerTR(doc, datos);

  // === Imprimir ===
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
