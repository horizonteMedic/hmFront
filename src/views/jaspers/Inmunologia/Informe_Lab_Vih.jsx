// src/views/jaspers/Inmunologia/Informe_Lab_Vih.jsx
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

export default async function Informe_Lab_Vih(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  await drawHeader(doc, datos);
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("INMUNOLOGÍA", pageW / 2, 36, { align: "center" });
  doc.setFont(config.font, "bold").setFontSize(12);
  doc.text("VIH", pageW / 2, 40, { align: "center" });
  const finalYPos = drawPatientData(doc, datos);

  let y = finalYPos + 10;
  const colData = 55;

  // MUESTRA
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("MUESTRA", config.margin, y);
  doc.text(":", colData - 5, y);
  doc.setFont(config.font, "normal");
  doc.text(datos.muestra || "SUERO", colData, y);
  y += config.lineHeight;

  // Examen solicitado
  doc.setFont(config.font, "bold");
  doc.text("Examen solicitado", config.margin, y);
  doc.text(":", colData - 5, y);
  doc.setFont(config.font, "normal");
  doc.text("VIH", colData, y);
  y += config.lineHeight * 2;

  // Tabla de resultados
  const colPrueba = config.margin;
  const colResultado = config.margin + 140;

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", colPrueba, y);
  doc.text("RESULTADO", colResultado, y);
  y += 2;
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // Fila 1
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text("HIV ANTÍGENO-ANTICUERPO RAPID TEST (MONTEST-HIV)", colPrueba, y);
  doc.text(datos.txtHivRapid || datos.vih || "NEGATIVO", colResultado, y);
  y += config.lineHeight;

  // Fila 2
  doc.text("ANTICUERPOS anti-VIH-1 y anti-VIH-2 (IgG, IgM, IgA)", colPrueba, y);
  doc.text(datos.txtAnticuerposVih || "", colResultado, y);

  // === FIRMAS ===
  const yFirmas = 210; // Posición para las firmas (abajo)
  await dibujarFirmas({ doc, datos: datos, y: yFirmas, pageW });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });
  
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


// --- Funciones de Ayuda ---

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
  doc.text("Fecha de examen: " + toDDMMYYYY(datos.fecha || datos.fechaExamen || ""), pageW - 80, 25);
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
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const sexo = datos.sexoPaciente === 'F' ? 'FEMENINO' : datos.sexoPaciente === 'M' ? 'MASCULINO' : '';

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nombres || datos.nombresPaciente || datos.nombreCompleto || '', tablaInicioX + 40, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.dni || datos.dniPaciente || ''), tablaInicioX + 12, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Edad:", tablaInicioX + 47, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text((datos.edad || datos.edadPaciente || '') + " AÑOS", tablaInicioX + 58, yPos + 3.5);
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
  doc.text(datos.nombreExamen || datos.tipoExamen || '', tablaInicioX + 25, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha Nac.:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(toDDMMYYYY(datos.fechaNacimientoPaciente || datos.fechaNacimiento || ''), tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Nivel de Estudio:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nivelEstudioPaciente || datos.nivelEstudio || '', tablaInicioX + 32, yPos + 3.5);
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

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Empresa:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.empresa || '', tablaInicioX + 20, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Contrata:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.contrata || '', tablaInicioX + 22, yPos + 3.5);
  yPos += filaAltura;

  return yPos;
};
