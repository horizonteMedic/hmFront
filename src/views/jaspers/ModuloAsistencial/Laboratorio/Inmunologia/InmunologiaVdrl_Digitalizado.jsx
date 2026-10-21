import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de VDRL (Inmunología) del módulo asistencial. Mismo cuerpo que
// jaspers/Inmunologia/Informe_Lab_VRDL.jsx (ocupacional): título INMUNOLOGÍA, MUESTRA, Examen solicitado y
// la tabla EXAMEN / RESULTADO ("VDRL (Método: ...)"), pero con la cabecera y los datos personales estándar
// del módulo asistencial (N° Ticket / N° Historia Clínica) y sin datos laborales (Tipo Examen, Ocupación,
// Cargo, Área, Empresa, Contrata).
//
// Recibe el reporte de GET /asistencial/laboratorio/inmunologia-vdrl/obtenerReporte?esJasper=true (campos
// planos del DTO: muestra, examen, metodo, resultado, fechaExamen, digitalizacion...). El controller
// completa numeroTicket, nombres (apellidos primero), numeroHistoriaClinica, sede y sellos.

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

export default async function Vdrl(datos = {}, docExistente = null) {
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
    { pagina: 1, titulo: "INMUNOLOGÍA", etiquetaFecha: "Fecha de examen" }
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
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("MUESTRA:", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text(texto(datos.muestra) || "SUERO", config.margin + 30, y);
  y += config.lineHeight;

  // ===== Examen solicitado =====
  doc.setFont(config.font, "bold");
  doc.text("Examen solicitado:", config.margin, y);
  doc.setFont(config.font, "normal");
  const examen = texto(datos.examen);
  const examenSolicitado = examen ? examen.replace(/\(.*?\)/g, "").trim() : "VDRL";
  doc.text(examenSolicitado, config.margin + 45, y);
  y += config.lineHeight * 2;

  // ===== Tabla de resultados =====
  const colPrueba = config.margin;
  const colResultado = config.margin + 120;

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("EXAMEN", colPrueba, y);
  doc.text("RESULTADO", colResultado, y);
  y += 2;

  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // Fila de datos: "VDRL (Método: [método])" incluyendo el método en el texto del examen
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  const metodo = texto(datos.metodo);
  doc.text(metodo ? `VDRL (Método: ${metodo.toLowerCase()})` : "VDRL", colPrueba, y);
  doc.text(texto(datos.resultado), colResultado, y);

  // ===== Firmas =====
  // Sello del especialista y del doctor asignado (sin firma/huella del paciente: no existen por ticket).
  // Misma posición que el ocupacional (55 mm bajo la fila de datos). Si una imagen no se puede cargar, el
  // informe se imprime igual (sin ese sello).
  doc.setLineWidth(0.2);
  try {
    await dibujarFirmas({ doc, datos, y: y + 55, pageW, mostrarFirmaPaciente: false });
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
