import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de Colinesterasa (Análisis Bioquímicos) del módulo asistencial. Mismo cuerpo que
// jaspers/AnalisisBioquimicos/COLINESTERASA.jsx (ocupacional): título ANÁLISIS CLÍNICOS, MUESTRA y la
// tabla PRUEBA / RESULTADO / VALORES NORMALES (con la lista de rangos por grupo), pero con la cabecera y
// los datos personales estándar del módulo asistencial (N° Ticket / N° Historia Clínica) y sin datos
// laborales (Tipo Examen, Ocupación, Cargo, Área, Empresa, Contrata).
//
// Recibe el reporte de GET /asistencial/laboratorio/colinesterasa/obtenerReporte?esJasper=true (campos
// planos del DTO: muestra, resultado, fechaExamen, digitalizacion...). El controller completa
// numeroTicket, nombres (apellidos primero), numeroHistoriaClinica, sede y sellos.

// --- Configuración (la del ocupacional) ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 100,
  col3X: 135,
  fontSize: {
    header: 9,
    body: 9,
    small: 8,
  },
  font: "helvetica",
  lineHeight: 7,
};

export default async function Colinesterasa(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // ===== Encabezado =====
  // Cabecera compartida del módulo asistencial. Devuelve la Y donde empieza el contenido.
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  const yContenido = await HeaderAsistencial(
    doc,
    {
      numeroTicket: datos.numeroTicket,
      numeroHistoriaClinica: datos.numeroHistoriaClinica,
      sede: datos.sede || datos.nombreSede,
      fecha: datos.fechaExamen || datos.fecha,
      codigoColor: datos.codigoColor,
      textoColor: datos.textoColor,
    },
    { pagina: 1, titulo: "ANÁLISIS CLÍNICOS", etiquetaFecha: "Fecha de examen" }
  );

  // ===== Datos personales (sin datos laborales) =====
  const finalYPos = DatosPersonalesAsistencial(
    doc,
    { ...datos, nombreCompleto: datos.nombres || datos.nombreCompleto },
    { x: 15, y: yContenido, ancho: 180, laborales: false }
  );

  let y = finalYPos + 10;

  // ===== Muestra =====
  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(config.fontSize.header).setFont(config.font, "bold");
  doc.text("MUESTRA :", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text(datos.muestra || "SUERO", config.margin + 20, y);
  y += config.lineHeight * 2;

  // ===== Encabezado de la tabla =====
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", config.col1X, y);
  doc.text("RESULTADO", config.col2X, y, { align: "center" });
  doc.text("VALORES NORMALES", config.col3X, y, { align: "left" });

  y += 3;
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // ===== Prueba =====
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("COLINESTERASA SÉRICA", config.col1X, y + 10);

  doc.setFont(config.font, "normal");
  doc.text(String(datos.resultado ?? ""), config.col2X, y + 10, { align: "center" });

  // Valores normales (lista de rangos por grupo)
  doc.setFontSize(config.fontSize.small);

  let valY = y + 5;
  const labelsX = config.col3X - 15;
  const dotsX = labelsX + 45; // Posición de los dos puntos
  const valuesX = dotsX + 2;

  doc.text("Niños, hombres", labelsX, valY);
  doc.text(":", dotsX, valY);
  doc.text("3 500 – 13 400 U/l", valuesX, valY);
  valY += 5;

  doc.text("Mujeres > de 40 años", labelsX, valY);
  doc.text(":", dotsX, valY);
  doc.text("3 500 – 13 400 U/l", valuesX, valY);
  valY += 5;

  doc.text("Mujeres de 16 a 39 años", labelsX, valY);
  valY += 4;
  doc.text("No embarazadas, sin ACO", labelsX, valY);
  doc.text(":", dotsX, valY);
  doc.text("4 400 – 11 700 U/l", valuesX, valY);
  valY += 5;

  doc.text("Mujeres de 18 a 41 años", labelsX, valY);
  valY += 4;
  doc.text("Embarazadas, con ACO", labelsX, valY);
  doc.text(":", dotsX, valY);
  doc.text("3 800 – 9 500 U/l", valuesX, valY);

  // ===== Firmas =====
  // Sello del especialista y del doctor asignado (sin firma/huella del paciente: no existen por ticket).
  // Misma posición que el ocupacional (y = 210). Si una imagen no se puede cargar, el informe se imprime
  // igual (sin ese sello).
  doc.setLineWidth(0.2);
  try {
    await dibujarFirmas({ doc, datos, y: 210, pageW, mostrarFirmaPaciente: false });
  } catch (error) {
    console.error("Error dibujando firmas:", error);
  }

  // ===== Pie =====
  footerTR(doc, { footerOffsetY: 8 });

  // Si se recibió un documento existente (folio), solo se dibuja en él y se retorna.
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
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}
