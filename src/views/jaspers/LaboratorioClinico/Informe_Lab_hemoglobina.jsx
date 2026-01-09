// src/views/jaspers/LaboratorioClinico/Informe_Lab_hemoglobina.jsx
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

export default async function Hemoglobina(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  await drawHeader(doc, datos);
  drawUnderlinedTitle(doc, "LABORATORIO CLINICO", 35);
  doc.setFont(config.font, "bold").setFontSize(12);
  doc.text("HEMOGLOBINA", pageW / 2, 42, { align: "center" });
  drawPatientData(doc, datos);

  let y = 98;

  // === TABLA DE RESULTADOS ===
  const colPrueba = config.margin;
  const colResultado = config.margin + 60;
  const colValores = config.margin + 120;

  // Header de la tabla
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", colPrueba, y);
  doc.text("RESULTADO", colResultado, y);
  doc.text("VALORES NORMALES / ANOTACIONES", colValores, y);
  y += 2;

  // Línea debajo del header
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // GRUPO SANGUÍNEO
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text("GRUPO SANGUÍNEO", colPrueba, y);
  // Mapear los datos del formulario
  const grupoSanguineo = datos.chko ? "O" : datos.chka ? "A" : datos.chkb ? "B" : datos.chkab ? "AB" : datos.txtGrupoSanguineo || "";
  doc.text(grupoSanguineo, colResultado, y);
  // Marcar el grupo correspondiente
  const grupo = grupoSanguineo.toUpperCase();
  const grupoO = grupo === "O" ? "✓" : "O";
  const grupoA = grupo === "A" ? "✓" : "A";
  const grupoB = grupo === "B" ? "✓" : "B";
  const grupoAB = grupo === "AB" ? "✓" : "AB";
  const grupoTexto = `(${grupoO} / ${grupoA} / ${grupoB} / ${grupoAB})`;
  doc.text(grupoTexto, colValores, y);
  y += config.lineHeight;

  // FACTOR (RH)
  doc.text("FACTOR (RH)", colPrueba, y);
  const factorRh = datos.rbrhpositivo ? "POSITIVO" : datos.rbrhnegativo ? "NEGATIVO" : datos.txtFactorRh || "";
  doc.text(factorRh, colResultado, y);
  // Marcar + o - según el resultado
  const esPositivo = factorRh.toUpperCase().includes("POSITIVO") || factorRh === "+";
  doc.text(esPositivo ? "(+)" : "(-)", colValores, y);
  y += config.lineHeight;

  // HEMATOCRITO
  doc.text("HEMATOCRITO", colPrueba, y);
  doc.text(datos.txtHematocrito || datos.hematocrito || "", colResultado, y);
  doc.text("Mujeres 36 – 50 %", colValores, y);
  y += 4;
  doc.text("Hombres 40 – 55 %", colValores, y);
  y += config.lineHeight;

  // HEMOGLOBINA
  doc.text("HEMOGLOBINA", colPrueba, y);
  doc.text(datos.txtHemoglobina || datos.hemoglobina || "", colResultado, y);
  doc.text("Mujeres 12 – 16 g/dl", colValores, y);
  y += 4;
  doc.text("Hombres 13 – 18 g/dl", colValores, y);

  // === FIRMAS ===
  const yFirmas = 210; // Posición para las firmas (abajo como estaba antes)
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

const drawUnderlinedTitle = (doc, text, y) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text(text, pageW / 2, y, { align: "center" });
};

const toDDMMYYYY = (fecha) => {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha;
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

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

const drawPatientData = (doc, datos = {}) => {
  const tablaInicioX = 15;
  const tablaAncho = 180;
  const filaAltura = 5;
  let yPos = 46;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const sexo = (datos.sexoPaciente || datos.sexo) === 'F' ? 'FEMENINO' : (datos.sexoPaciente || datos.sexo) === 'M' ? 'MASCULINO' : '';

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  const nombreCompleto = datos.nombreCompleto || (datos.nombres && datos.apellidos ? `${datos.nombres} ${datos.apellidos}`.trim() : datos.nombres || '');
  doc.text(nombreCompleto, tablaInicioX + 40, yPos + 3.5);
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
  doc.text("Tipo Examen:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nombreExamen || '', tablaInicioX + 28, yPos + 3.5);
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
