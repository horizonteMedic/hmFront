import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de VIH (Inmunología) del módulo asistencial. Mismo cuerpo que
// jaspers/Inmunologia/Informe_Lab_Vih.jsx (ocupacional): título INMUNOLOGÍA / VIH, MUESTRA, Examen
// solicitado y la tabla PRUEBA / RESULTADO (HIV antígeno-anticuerpo rapid test y anticuerpos anti-VIH),
// pero con la cabecera y los datos personales estándar del módulo asistencial (N° Ticket / N° Historia
// Clínica) y sin datos laborales (Tipo Examen, Ocupación, Cargo, Área, Empresa, Contrata).
//
// Recibe el reporte de GET /asistencial/laboratorio/vih/obtenerReporte?esJasper=true (campos planos del
// DTO: muestra, resultado, fechaExamen, digitalizacion...). El controller completa numeroTicket, nombres
// (apellidos primero), numeroHistoriaClinica, sede y sellos. El DTO no trae el resultado de anticuerpos
// anti-VIH (la segunda fila): se imprime su rótulo, como el ocupacional, con el resultado vacío.

// --- Configuración (la del ocupacional) ---
const config = {
  margin: 15,
  fontSize: {
    header: 9,
    body: 9,
  },
  font: "helvetica",
  lineHeight: 7,
};

const texto = (v) => (v === undefined || v === null ? "" : String(v).trim());

export default async function Vih(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // ===== Encabezado =====
  // Cabecera compartida del módulo asistencial (el título queda en y = 38).
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  await HeaderAsistencial(
    doc,
    {
      numeroTicket: datos.numeroTicket,
      numeroHistoriaClinica: datos.numeroHistoriaClinica,
      sede: datos.sede || datos.nombreSede,
      fecha: datos.fechaExamen || datos.fecha,
      codigoColor: datos.codigoColor,
      textoColor: datos.textoColor,
    },
    { pagina: 1, titulo: "INMUNOLOGÍA", etiquetaFecha: "Fecha de examen" }
  );
  doc.setFont(config.font, "bold").setFontSize(12);
  doc.text("VIH", pageW / 2, 45, { align: "center" });

  // ===== Datos personales (sin datos laborales) =====
  const finalYPos = DatosPersonalesAsistencial(
    doc,
    { ...datos, nombreCompleto: datos.nombres || datos.nombreCompleto },
    { x: 15, y: 49, ancho: 180, laborales: false }
  );

  let y = finalYPos + 10;
  const colData = 55;

  // ===== Muestra =====
  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("MUESTRA", config.margin, y);
  doc.text(":", colData - 5, y);
  doc.setFont(config.font, "normal");
  doc.text(texto(datos.muestra) || "SUERO", colData, y);
  y += config.lineHeight;

  // ===== Examen solicitado =====
  doc.setFont(config.font, "bold");
  doc.text("Examen solicitado", config.margin, y);
  doc.text(":", colData - 5, y);
  doc.setFont(config.font, "normal");
  doc.text("VIH", colData, y);
  y += config.lineHeight * 2;

  // ===== Tabla de resultados =====
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
  doc.text(texto(datos.resultado) || "NEGATIVO", colResultado, y);
  y += config.lineHeight;

  // Fila 2
  doc.text("ANTICUERPOS anti-VIH-1 y anti-VIH-2 (IgG, IgM, IgA)", colPrueba, y);

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
