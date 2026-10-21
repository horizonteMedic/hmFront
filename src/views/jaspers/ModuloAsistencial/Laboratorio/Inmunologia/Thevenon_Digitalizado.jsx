import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de la Prueba de Thevenon (sangre oculta en heces) del módulo asistencial. Mismo cuerpo que
// jaspers/Inmunologia/Informe_Lab_Thevenon.jsx (ocupacional): título PRUEBA DE THEVENON / SANGRE OCULTA EN
// HECES, MUESTRA, Color, Aspecto, Sangre visible y RESULTADO, pero con la cabecera y los datos personales
// estándar del módulo asistencial (N° Ticket / N° Historia Clínica) y sin datos laborales (Tipo Examen,
// Ocupación, Cargo, Área, Empresa, Contrata).
//
// Recibe el reporte de GET /asistencial/laboratorio/thevenon/obtenerReporte?esJasper=true (campos planos
// del DTO: muestra, colorExamen, aspecto, sangreVisible, resultado, fechaExamen, digitalizacion...). El
// controller completa numeroTicket, nombres (apellidos primero), numeroHistoriaClinica, sede y sellos.

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

export default async function Thevenon(datos = {}, docExistente = null) {
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
    { pagina: 1, titulo: "PRUEBA DE THEVENON", etiquetaFecha: "Fecha de examen" }
  );
  doc.setFont(config.font, "bold").setFontSize(12);
  doc.text("SANGRE OCULTA EN HECES", pageW / 2, 45, { align: "center" });

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
  doc.text(texto(datos.muestra) || "Heces", colData, y);
  y += config.lineHeight * 2;

  // ===== Prueba de Thevenon =====
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA DE THEVENON", config.margin, y);
  y += config.lineHeight;

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("SANGRE OCULTA EN HECES", config.margin, y);
  y += config.lineHeight * 1.5;

  // Datos
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  const thevenonData = [
    ["Color", texto(datos.colorExamen)],
    ["Aspecto", texto(datos.aspecto)],
    ["Sangre visible", texto(datos.sangreVisible)],
  ];
  thevenonData.forEach(([etiqueta, valor]) => {
    doc.text(etiqueta, config.margin, y);
    doc.text(":", colData - 5, y);
    doc.text(valor, colData, y);
    y += config.lineHeight;
  });

  y += config.lineHeight;

  // ===== Resultado =====
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("RESULTADO", config.margin, y);
  doc.text(":", colData - 5, y);
  doc.setFont(config.font, "normal");
  doc.text(texto(datos.resultado), colData, y);

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
