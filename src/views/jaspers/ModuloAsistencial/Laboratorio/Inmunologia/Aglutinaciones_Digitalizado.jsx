import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de Aglutinaciones (Inmunología) del módulo asistencial. Mismo cuerpo que
// jaspers/Inmunologia/InmunologiaLab_Digitalizado.jsx (ocupacional): título INMUNOLOGÍA, MUESTRA, MÉTODO y
// la tabla PRUEBA CUALITATIVO / RESULTADOS (Tífico O y H, Paratífico A y B, Brucella abortus), pero con la
// cabecera y los datos personales estándar del módulo asistencial (N° Ticket / N° Historia Clínica) y sin
// datos laborales (Tipo Examen, Ocupación, Cargo, Área, Empresa, Contrata).
//
// Recibe el reporte de GET /asistencial/laboratorio/inmunologia/obtenerReporte?esJasper=true (campos
// planos del DTO: tificoO, tificoH, paratificoA, paratificoB, brucella, fechaExamen, digitalizacion...). El
// controller completa numeroTicket, nombres (apellidos primero), numeroHistoriaClinica, sede y sellos. El
// DTO no trae muestra ni método: se imprimen los del ocupacional.

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

const PRUEBAS = [
  { label: "TIFICO O", key: "tificoO" },
  { label: "TIFICO H", key: "tificoH" },
  { label: "PARATIFICO A", key: "paratificoA" },
  { label: "PARATIFICO B", key: "paratificoB" },
  { label: "Brucella abortus", key: "brucella" },
];

const texto = (v) => (v === undefined || v === null ? "" : String(v).trim());

export default async function Aglutinaciones(datos = {}, docExistente = null) {
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

  // ===== Muestra y método =====
  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("MUESTRA :", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text(datos.muestra || "SUERO", config.margin + 30, y);
  y += config.lineHeight;

  doc.setFont(config.font, "bold");
  doc.text("MÉTODO:", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text(datos.metodo || "AGLUTINACIÓN EN LÁMINA PORTAOBJETO", config.margin + 30, y);
  y += config.lineHeight * 2;

  // ===== Encabezado de la tabla =====
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  const col1X = config.margin;
  const col2X = pageW / 2 + 60;
  doc.text("PRUEBA CUALITATIVO", col1X, y);
  doc.text("RESULTADOS", col2X, y, { align: "center" });
  y += 3;
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // ===== Pruebas =====
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  PRUEBAS.forEach(({ label, key }) => {
    doc.text(label, col1X, y);
    doc.text(texto(datos[key]) || "N/A", col2X, y, { align: "center" });
    y += config.lineHeight;
  });

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
