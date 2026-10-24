import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de Etanol en Saliva del módulo asistencial. Mismo cuerpo que jaspers/Toxicologia/ETANOLSALIVA.jsx
// (ocupacional): MUESTRA y la tabla PRUEBA / RESULTADO con la prueba rápida en tira de alcohol en saliva,
// pero con la cabecera y los datos personales estándar del módulo asistencial (N° Ticket / N° Historia
// Clínica) y sin datos laborales (Tipo Examen, Ocupación, Cargo, Área, Empresa, Contrata).
//
// Recibe el reporte de GET /asistencial/laboratorio/etanol-saliva/obtenerReporte?esJasper=true (campos
// planos del DTO: muestra, resultado, fechaExamen, digitalizacion...). El controller completa numeroTicket,
// nombres (apellidos primero), numeroHistoriaClinica, sede y sellos.

// --- Configuración (la del ocupacional) ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 160,
  fontSize: {
    header: 9,
    body: 9,
  },
  font: "helvetica",
  lineHeight: 7,
};

const texto = (v) => (v === undefined || v === null ? "" : String(v).trim());

export default async function EtanolSaliva(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // ===== Encabezado =====
  // Cabecera compartida del módulo asistencial (el título queda en y = 38). El ocupacional rotula este
  // informe "BIOQUIMICA"; aquí se usa "TOXICOLÓGICO", como los paneles de drogas.
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
    { pagina: 1, titulo: "TOXICOLÓGICO", etiquetaFecha: "Fecha de examen" }
  );

  // ===== Datos personales (sin datos laborales) =====
  const finalYPos = DatosPersonalesAsistencial(
    doc,
    { ...datos, nombreCompleto: datos.nombres || datos.nombreCompleto },
    { x: 15, y: 43, ancho: 180, laborales: false }
  );

  // ===== Muestra =====
  let y = finalYPos + 10;
  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(config.fontSize.header).setFont(config.font, "bold");
  doc.text("MUESTRA:", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text(texto(datos.muestra), config.margin + 20, y);
  y += config.lineHeight;

  y += config.lineHeight * 1.5;

  // ===== Encabezado de la tabla =====
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", config.col1X, y);
  doc.text("RESULTADO", config.col2X, y, { align: "center" });
  y += 3;
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // ===== Fila de resultado =====
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text("PRUEBA RÁPIDA EN TIRA DE ALCOHOL EN SALIVA (MONTEST)", config.col1X, y + 6);
  doc.text(texto(datos.resultado), config.col2X, y + 6, { align: "center" });

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
