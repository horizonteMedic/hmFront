import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils.js";
import { convertirGenero } from "../../../../utils/helpers.js";

// Informe de Hemoglobina del módulo asistencial. El cuerpo es el mismo de
// jaspers/LaboratorioClinico/Informe_Lab_hemoglobina.jsx (ocupacional), pero con la cabecera estándar
// del módulo asistencial (N° Ticket / N° Historia Clínica) y sin datos de empresa (Tipo Examen, Cargo,
// Área).
//
// Recibe el reporte de GET /asistencial/laboratorio/clinico/obtenerReporteHemoglobina?esJasper=true
// (campos planos del DTO: hemoglobina, hematocrito, chko, nombres, dni, edad, sexo, digitalizacion...).
// El controller completa numeroTicket, nombres (apellidos primero), numeroHistoriaClinica, sede y sellos.

// --- Configuración ---
const config = {
  margin: 15,
  fontSize: {
    title: 14,
    header: 9,
    body: 9,
  },
  font: "helvetica",
  lineHeight: 7,
};

const texto = (v) => String(v ?? "").trim();

// Datos personales del paciente (sin Tipo Examen / Cargo / Área). Devuelve la Y donde termina.
const drawPatientData = (doc, datos, yInicio) => {
  const tablaInicioX = 15;
  const tablaAncho = 180;
  const filaAltura = 5;
  let yPos = yInicio;

  // Fila de una celda o varias: contorno exterior + divisiones verticales (distancia desde tablaInicioX).
  const fila = (divisiones = []) => {
    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    divisiones.forEach((dx) => doc.line(tablaInicioX + dx, yPos, tablaInicioX + dx, yPos + filaAltura));
  };

  // Celda "Etiqueta: valor" (etiqueta en negrita, valor normal) dentro de la fila actual.
  const celda = (etiqueta, valor, xEtiqueta, xValor) => {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(etiqueta, tablaInicioX + xEtiqueta, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(valor, tablaInicioX + xValor, yPos + 3.5);
  };

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, "FD");
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const edad = texto(datos.edad);

  fila();
  celda("Apellidos y Nombres:", texto(datos.nombres || datos.nombreCompleto), 2, 40);
  yPos += filaAltura;

  fila([45, 90]);
  celda("DNI:", texto(datos.dni), 2, 12);
  celda("Edad:", edad ? `${edad} AÑOS` : "", 47, 58);
  celda("Sexo:", convertirGenero(datos.sexo), 92, 105);
  yPos += filaAltura;

  fila([90]);
  celda("Lugar de Nacimiento:", texto(datos.lugarNacimiento), 2, 38);
  celda("Estado Civil:", texto(datos.estadoCivil), 92, 115);
  yPos += filaAltura;

  fila([90]);
  celda("Nivel de Estudio:", texto(datos.nivelEstudios), 2, 32);
  celda("Fecha Nac.:", formatearFechaCorta(datos.fechaNacimiento), 92, 115);
  yPos += filaAltura;

  fila();
  celda("Ocupación:", texto(datos.ocupacion), 2, 25);
  yPos += filaAltura;

  return yPos;
};

// --- Componente Principal ---

export default async function Hemoglobina(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  // Cabecera compartida del módulo asistencial (el título queda en y = 38).
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  await HeaderAsistencial(
    doc,
    {
      numeroTicket: datos.numeroTicket,
      numeroHistoriaClinica: datos.numeroHistoriaClinica,
      sede: datos.sede || datos.nombreSede,
      fecha: datos.fechaLab || datos.fechaExamen,
      codigoColor: datos.codigoColor,
      textoColor: datos.textoColor,
    },
    { pagina: 1, titulo: "LABORATORIO CLÍNICO", etiquetaFecha: "Fecha de examen" }
  );
  doc.setFont(config.font, "bold").setFontSize(12);
  doc.text("HEMOGLOBINA", pageW / 2, 45, { align: "center" });

  const yDatosFin = drawPatientData(doc, datos, 49);

  let y = yDatosFin + 7;

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

  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);

  // Mapear los datos del formulario
  const grupoSanguineo = datos.chko ? "O" : datos.chka ? "A" : datos.chkb ? "B" : datos.chkab ? "AB" : "";
  const factorRh = datos.rbrhpositivo ? "POSITIVO" : datos.rbrhnegativo ? "NEGATIVO" : "";
  const hematocrito = texto(datos.hematocrito);
  const hemoglobina = texto(datos.hemoglobina);

  // GRUPO SANGUÍNEO
  if (grupoSanguineo) {
    doc.text("GRUPO SANGUÍNEO", colPrueba, y);
    doc.text(grupoSanguineo, colResultado, y);
    // Marcar el grupo correspondiente. (El ocupacional lo marca con "✓", pero la fuente estándar del PDF
    // no lo tiene y sale como un carácter extraño; aquí se encierra entre corchetes.)
    const marcar = (grupo) => (grupoSanguineo === grupo ? `[${grupo}]` : grupo);
    doc.text(`(${["O", "A", "B", "AB"].map(marcar).join(" / ")})`, colValores, y);
    y += config.lineHeight;
  }

  // FACTOR (RH)
  if (factorRh) {
    doc.text("FACTOR (RH)", colPrueba, y);
    doc.text(factorRh, colResultado, y);
    // Marcar + o - según el resultado
    doc.text(factorRh === "POSITIVO" ? "(+)" : "(-)", colValores, y);
    y += config.lineHeight;
  }

  // HEMATOCRITO
  if (hematocrito) {
    doc.text("HEMATOCRITO", colPrueba, y);
    doc.text(hematocrito, colResultado, y);
    doc.text("Mujeres 36 – 50 %", colValores, y);
    y += 4;
    doc.text("Hombres 40 – 55 %", colValores, y);
    y += config.lineHeight;
  }

  // HEMOGLOBINA
  if (hemoglobina) {
    doc.text("HEMOGLOBINA", colPrueba, y);
    doc.text(hemoglobina, colResultado, y);
    doc.text("Mujeres 12 – 16 g/dl", colValores, y);
    y += 4;
    doc.text("Hombres 13 – 18 g/dl", colValores, y);
  }

  // === FIRMAS ===
  // Sello del especialista y del doctor asignado (sin firma/huella del paciente: no existen por ticket).
  // Si una imagen no se puede cargar, el informe se imprime igual (sin ese sello).
  try {
    await dibujarFirmas({ doc, datos, y: 210, pageW, mostrarFirmaPaciente: false });
  } catch (error) {
    console.error("Error dibujando firmas:", error);
  }

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });

  if (docExistente) {
    return doc;
  }
  imprimir(doc);
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
