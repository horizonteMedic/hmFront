import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de Perfil Renal (Análisis Bioquímicos) del módulo asistencial. Mismo cuerpo que
// jaspers/AnalisisBioquimicos/LBioquimica_Digitalizado.jsx (ocupacional): título BIOQUÍMICA, subtítulo
// MUESTRA : SUERO y la lista PRUEBA / RESULTADO / VALORES NORMALES, pero con la cabecera y los datos
// personales estándar del módulo asistencial (N° Ticket / N° Historia Clínica) y sin datos laborales
// (Tipo Examen, Ocupación, Cargo, Área, Empresa, Contrata).
//
// Recibe el reporte de GET /asistencial/laboratorio/perfil-renal/obtenerReporte?esJasper=true (campos
// planos del DTO: txtCreatinina, txtUreaSerica, txtAcidoUrico, fechaExamen, digitalizacion...). El
// controller completa numeroTicket, nombres (apellidos primero), numeroHistoriaClinica, sede y sellos.

// --- Configuración (la del ocupacional) ---
const config = {
  margin: 15,
  fontSize: {
    subtitle: 11,
    header: 9,
    body: 9,
  },
  lineHeight: {
    normal: 7,
    small: 5,
  },
  font: "helvetica",
};

const tableCols = {
  col1: 15,
  col2: 100,
  col3: 153,
};

// Solo se imprimen las pruebas que traen resultado.
const PRUEBAS = [
  {
    prueba: "CREATININA SÉRICA",
    campo: "txtCreatinina",
    normales: "Adulto: 0.8 - 1.4 mg/dl\nNiño: 0.24 - 0.84 mg/dl",
  },
  {
    prueba: "UREA SÉRICA",
    campo: "txtUreaSerica",
    normales: "10 - 50 mg/dl",
  },
  {
    prueba: "ÁCIDO ÚRICO SÉRICO",
    campo: "txtAcidoUrico",
    normales: "Mujeres: 2.5 - 6.8 mg/dl\nHombres 3.6 - 7.7 mg/dl",
  },
];

export default async function PerfilRenal(datos = {}, docExistente = null) {
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
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.subtitle);
  doc.text("MUESTRA : SUERO", config.margin, y);
  y += config.lineHeight.normal * 1.5;

  // ===== Encabezado de la tabla =====
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", tableCols.col1, y);
  doc.text("RESULTADO", tableCols.col2, y, { align: "center" });
  doc.text("VALORES NORMALES", tableCols.col3, y, { align: "left" });
  y += 3;
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight.normal;

  // ===== Pruebas =====
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  PRUEBAS.filter(({ campo }) => datos[campo] != null && String(datos[campo]).trim() !== "").forEach(
    ({ prueba, campo, normales }) => {
      doc.text(prueba, tableCols.col1, y);
      doc.text(String(datos[campo]), tableCols.col2, y, { align: "center" });
      // Valores normales (pueden ser varias líneas)
      const lineasNormales = normales.split("\n");
      lineasNormales.forEach((linea, idx) => {
        doc.text(linea, tableCols.col3, y + idx * config.lineHeight.small, { align: "left" });
      });
      y += Math.max(config.lineHeight.normal, lineasNormales.length * config.lineHeight.small + 2);
    }
  );

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
