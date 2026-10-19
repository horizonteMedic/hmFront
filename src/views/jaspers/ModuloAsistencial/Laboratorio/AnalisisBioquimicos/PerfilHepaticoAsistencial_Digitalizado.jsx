import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de Perfil Hepático (Análisis Bioquímicos) del módulo asistencial. Mismo cuerpo que
// jaspers/AnalisisBioquimicos/PerfilHepatico_Digitalizado.jsx (ocupacional): título BIOQUÍMICA,
// MUESTRA / PERFIL HEPÁTICO y la lista PRUEBA / RESULTADO / RANGO REFERENCIAL, pero con la cabecera y
// los datos personales estándar del módulo asistencial (N° Ticket / N° Historia Clínica) y sin datos
// laborales (Tipo Examen, Ocupación, Cargo, Área, Empresa, Contrata).
//
// Recibe el reporte de GET /asistencial/laboratorio/perfil-hepatico/obtenerReporte?esJasper=true (campos
// planos del DTO: txtrTgo, txtrTgp, txtrGgt..., fechaExamen, digitalizacion...). El controller completa
// numeroTicket, nombres (apellidos primero), numeroHistoriaClinica, sede y sellos.

// --- Configuración (la del ocupacional) ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 105,
  col3X: 155,
  fontSize: {
    subtitle: 9,
    header: 9,
    body: 9,
  },
  font: "helvetica",
  lineHeight: 7,
};

const PRUEBAS = [
  { label: "FOSFATASA ALCALINA", key: "txtrFosfalcalina", ref: "Hasta 300 U/L" },
  { label: "GGT", key: "txtrGgt", ref: ["Hombres  10 - 50 U/L", "Mujeres  8 - 35 U/L"] },
  { label: "TGP", key: "txtrTgp", ref: ["Hombres  Hasta 40 U/L", "Mujeres  Hasta 35 U/L"] },
  { label: "TGO", key: "txtrTgo", ref: "Hasta 31 U/L" },
  { label: "BILIRRUBINA TOTAL", key: "txtrBilirrTotal", ref: "0.2 - 1.20 mg/dL" },
  { label: "BILIRRUBINA DIRECTA", key: "txtrBilirrDirecta", ref: "Hasta 0.25 mg/dL" },
  { label: "BILIRRUBINA INDIRECTA", key: "txtrBilirrIndirecta", ref: "0.1 - 1 mg/dL" },
  { label: "PROTEÍNAS TOTALES", key: "txtrProteTotales", ref: "6.6 - 8.3 g/dL" },
  { label: "ALBÚMINA", key: "txtrAlbumina", ref: "3.5 - 5.5 g/dL" },
  { label: "GLOBULINA SÉRICA", key: "txtrGlobulina", ref: "2.3 - 3.5 g/dL" },
];

// Dibuja una prueba y devuelve la Y de la siguiente fila.
const drawRow = (doc, y, test, datos) => {
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text(test.label, config.col1X, y);

  const result = datos[test.key] != null ? String(datos[test.key]) : "0";
  doc.text(result, config.col2X, y, { align: "center" });

  if (Array.isArray(test.ref)) {
    let tempY = y;
    test.ref.forEach((line, index) => {
      doc.text(line, config.col3X, tempY, { align: "left" });
      if (index < test.ref.length - 1) {
        tempY += 5;
      }
    });
    return Math.max(y + config.lineHeight, tempY + 7);
  }
  doc.text(test.ref, config.col3X, y, { align: "left" });
  return y + config.lineHeight;
};

export default async function PerfilHepatico(datos = {}, docExistente = null) {
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

  // ===== Muestra y título del perfil =====
  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.subtitle);
  doc.text(`MUESTRA: ${datos.muestra || "SUERO"}`, config.margin, y);
  y += config.lineHeight;
  doc.text("PERFIL HEPÁTICO", config.margin, y);
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
  PRUEBAS.forEach((test) => {
    y = drawRow(doc, y, test, datos);
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
