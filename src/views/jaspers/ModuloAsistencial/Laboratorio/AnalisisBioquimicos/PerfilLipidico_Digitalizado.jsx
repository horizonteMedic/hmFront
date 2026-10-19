import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de Perfil Lipídico (Análisis Bioquímicos) del módulo asistencial. Mismo cuerpo que
// jaspers/AnalisisBioquimicos/AnalisisBioquimicos_Digitalizado.jsx (ocupacional): título BIOQUÍMICA,
// subtítulo ANÁLISIS BIOQUÍMICOS y la lista PRUEBA / RESULTADO / RANGO REFERENCIAL, pero con la cabecera
// y los datos personales estándar del módulo asistencial (N° Ticket / N° Historia Clínica) y sin datos
// laborales (Tipo Examen, Ocupación, Cargo, Área, Empresa, Contrata).
//
// Recibe el reporte de GET /asistencial/laboratorio/analisis-bioquimico/obtenerReporte?esJasper=true
// (campos planos del DTO: txtColesterol, txtTrigliseridos, txtHdlColesterol, txtLdlColesterol,
// txtVldlColesterol, fecha, digitalizacion...). El controller completa numeroTicket, nombres (apellidos
// primero), numeroHistoriaClinica, sede y sellos.

// --- Configuración (la del ocupacional) ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 105,
  col3X: 155,
  fontSize: {
    header: 9,
    body: 9,
  },
  font: "helvetica",
  lineHeight: 7,
};

// Creatinina no se imprime (en el ocupacional también está comentada).
const PRUEBAS = [
  { label: "COLESTEROL TOTAL", key: "txtColesterol", ref: "< 200 mg/dL" },
  { label: "TRIGLICÉRIDOS", key: "txtTrigliseridos", ref: "< 150 mg/dL" },
  { label: "H.D.L. COLESTEROL", key: "txtHdlColesterol", ref: "40 - 60 mg/dL" },
  { label: "L.D.L. COLESTEROL", key: "txtLdlColesterol", ref: "< 129 mg/dL" },
  { label: "V.L.D.L. COLESTEROL", key: "txtVldlColesterol", ref: "< 30 mg/dL" },
];

export default async function PerfilLipidico(datos = {}, docExistente = null) {
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
      fecha: datos.fecha || datos.fechaExamen,
      codigoColor: datos.codigoColor,
      textoColor: datos.textoColor,
    },
    { pagina: 1, titulo: "BIOQUÍMICA", etiquetaFecha: "Fecha de examen" }
  );

  // ===== Datos personales (sin datos laborales) =====
  const finalYPos = DatosPersonalesAsistencial(
    doc,
    { ...datos, nombreCompleto: datos.nombres || datos.nombreCompleto },
    { x: 15, y: yContenido, ancho: 180, laborales: false }
  );

  let y = finalYPos + 10; // Posición inicial después de la tabla de datos

  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("ANÁLISIS BIOQUÍMICOS", config.margin, y);
  y += config.lineHeight * 1.5;

  // ===== Encabezado de la tabla =====
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", config.col1X, y);
  doc.text("RESULTADO", config.col2X, y, { align: "center" });
  doc.text("RANGO REFERENCIAL", config.col3X, y, { align: "left" });
  y += 3;
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // ===== Pruebas =====
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  PRUEBAS.forEach(({ label, key, ref }) => {
    const val = datos[key] != null ? String(datos[key]) : "-";
    doc.text(label, config.col1X, y);
    doc.text(val, config.col2X, y, { align: "center" });
    doc.text(ref, config.col3X, y, { align: "left" });
    y += config.lineHeight;
  });

  // ===== Firmas =====
  // Sello del especialista y del doctor asignado (sin firma/huella del paciente: no existen por ticket).
  // Si una imagen no se puede cargar, el informe se imprime igual (sin ese sello).
  doc.setLineWidth(0.2);
  try {
    await dibujarFirmas({ doc, datos, y: y + 12, pageW, mostrarFirmaPaciente: false });
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
