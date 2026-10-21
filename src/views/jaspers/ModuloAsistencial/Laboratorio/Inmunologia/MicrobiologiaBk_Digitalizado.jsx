import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de BK - Baciloscopia (Microbiología) del módulo asistencial. Mismo cuerpo que la rama BK de
// jaspers/Inmunologia/Microbiologia_Digitalizado.jsx (ocupacional): título MICROBIOLOGÍA, MUESTRA y la
// tabla PRUEBA / RESULTADO con las dos baciloscopias, pero con la cabecera y los datos personales
// estándar del módulo asistencial (N° Ticket / N° Historia Clínica) y sin datos laborales (Tipo Examen,
// Ocupación, Cargo, Área, Empresa, Contrata). El examen directo (KOH) tiene su propia plantilla
// (Koh_Digitalizado.jsx).
//
// Recibe el reporte de GET /asistencial/laboratorio/microbiologia/obtenerReporte?esJasper=true (campos
// planos del DTO: muestra1, muestra2, koh, fechaExamen, digitalizacion...; BK y KOH son la misma fila). El
// controller completa numeroTicket, nombres (apellidos primero), numeroHistoriaClinica, sede y sellos. El
// DTO no trae la muestra: se imprime la del ocupacional.

// --- Configuración (la del ocupacional) ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 115,
  fontSize: {
    header: 9,
    body: 9,
  },
  font: "helvetica",
  lineHeight: 7,
};

export default async function MicrobiologiaBk(datos = {}, docExistente = null) {
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
    { pagina: 1, titulo: "MICROBIOLOGÍA", etiquetaFecha: "Fecha de examen" }
  );

  // ===== Datos personales (sin datos laborales) =====
  const finalYPos = DatosPersonalesAsistencial(
    doc,
    { ...datos, nombreCompleto: datos.nombres || datos.nombreCompleto },
    { x: 15, y: yContenido, ancho: 180, laborales: false }
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
  doc.text(datos.muestra || "ESPUTO", colData, y);
  y += config.lineHeight * 2;

  // ===== Encabezado de la tabla =====
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", config.col1X, y);
  doc.text("RESULTADO", config.col2X, y, { align: "center" });
  y += 3;
  doc.setLineWidth(0.4);
  doc.line(config.margin, y, pageW - config.margin, y);

  y += config.lineHeight;
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);

  // ===== Pruebas =====
  doc.text("Examen de BK - BACILOSCOPIA 1° Muestra", config.col1X, y);
  doc.text(String(datos.muestra1 || "N/A"), config.col2X, y, { align: "center" });
  y += config.lineHeight;
  doc.text("Examen de BK - BACILOSCOPIA 2° Muestra", config.col1X, y);
  doc.text(String(datos.muestra2 || "N/A"), config.col2X, y, { align: "center" });

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
