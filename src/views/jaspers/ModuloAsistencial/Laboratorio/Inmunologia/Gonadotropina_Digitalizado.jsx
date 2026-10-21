import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de Gonadotropina Coriónica (Inmunología) del módulo asistencial. Mismo cuerpo que
// jaspers/Inmunologia/LGonadotropina_Digitalizado.jsx (ocupacional): título INMUNOLOGÍA, MUESTRA, MÉTODO
// y la tabla PRUEBA CUALITATIVO / RESULTADO (con la imagen del nombre de la prueba), pero con la
// cabecera y los datos personales estándar del módulo asistencial (N° Ticket / N° Historia Clínica) y
// sin datos laborales (Tipo Examen, Ocupación, Cargo, Área, Empresa, Contrata).
//
// Recibe el reporte de GET /asistencial/laboratorio/lgonadotropina/obtenerReporte?esJasper=true (campos
// planos del DTO: resultado, fechaExamen, digitalizacion...). El controller completa numeroTicket,
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

export default async function Gonadotropina(datos = {}, docExistente = null) {
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
  doc.setFontSize(config.fontSize.header).setFont(config.font, "bold");
  doc.text("MUESTRA:", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text("SUERO", config.margin + 20, y);
  y += config.lineHeight;

  doc.setFont(config.font, "bold");
  doc.text("MÉTODO:", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text("INMUNOCROMATOGRÁFICO", config.margin + 18, y);
  y += config.lineHeight * 1.5;

  // ===== Encabezado de la tabla =====
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA CUALITATIVO", config.col1X, y);
  doc.text("RESULTADO", config.col2X, y, { align: "center" });
  y += 3;
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // ===== Prueba =====
  // El nombre de la prueba se inserta como imagen (igual que el ocupacional). Si no se puede cargar, el
  // informe se imprime igual (con el resultado).
  try {
    doc.addImage("./img/textogonabeta.png", "PNG", config.margin, y - 2, 100, 15);
  } catch (error) {
    console.error("No se pudo cargar la imagen de la prueba:", error);
  }

  // Resultado
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text(String(datos.resultado ?? ""), config.col2X, y + 6, { align: "center" });

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
