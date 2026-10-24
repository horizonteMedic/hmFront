import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de Tiempo de Coagulación y Sangría del módulo asistencial. Mismo cuerpo que
// jaspers/LaboratorioClinico/Coagulacion.jsx (ocupacional): título LABORATORIO CLINICO, subtítulo y la
// tabla PRUEBA / RESULTADO / VALORES NORMALES (solo las pruebas con resultado), pero con la cabecera y
// los datos personales estándar del módulo asistencial (N° Ticket / N° Historia Clínica) y sin datos
// laborales (Tipo Examen, Ocupación, Cargo, Área, Empresa, Contrata).
//
// Recibe el reporte de GET /asistencial/laboratorio/tiempo-coagulacion-sangria/obtenerReporte?esJasper=true
// (campos planos del DTO: tiempoCoagulacionResultado, tiempoSangriaResultado, fechaExamen,
// digitalizacion...). El controller completa numeroTicket, nombres (apellidos primero),
// numeroHistoriaClinica, sede y sellos.

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

// "Sin dato": vacío, en blanco o un centinela del backend.
const tieneDato = (v) => {
  const s = String(v ?? "").trim();
  return s !== "" && !["null", "undefined", "-", "--", "s/d", "n/a"].includes(s.toLowerCase());
};

export default async function Coagulacion(datos = {}, docExistente = null) {
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
    { pagina: 1, titulo: "LABORATORIO CLINICO", etiquetaFecha: "Fecha de examen" }
  );
  doc.setFont(config.font, "bold").setFontSize(12);
  doc.text("TIEMPO DE COAGULACIÓN Y SANGRÍA", pageW / 2, 45, { align: "center" });

  // ===== Datos personales (sin datos laborales) =====
  const finalYPos = DatosPersonalesAsistencial(
    doc,
    { ...datos, nombreCompleto: datos.nombres || datos.nombreCompleto },
    { x: 15, y: 49, ancho: 180, laborales: false }
  );

  let y = finalYPos + 10;

  // ===== Tabla de resultados =====
  const colPrueba = config.margin;
  const colResultado = config.margin + 70;
  const colValores = config.margin + 120;

  const pruebas = [
    { prueba: "TIEMPO DE COAGULACIÓN", resultado: String(datos.tiempoCoagulacionResultado ?? "").trim(), normal: "5 - 12 min." },
    { prueba: "TIEMPO DE SANGRÍA", resultado: String(datos.tiempoSangriaResultado ?? "").trim(), normal: "1 - 5 min." },
  ];

  // Encabezado de la tabla (siempre visible)
  doc.setTextColor(0, 0, 0);
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", colPrueba, y);
  doc.text("RESULTADO", colResultado, y, { align: "center" });
  doc.text("VALORES NORMALES", colValores, y);
  y += 2;

  // Línea debajo del encabezado
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // Solo se dibujan las filas que tienen resultado
  pruebas
    .filter((item) => tieneDato(item.resultado))
    .forEach((item) => {
      doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
      doc.text(item.prueba, colPrueba, y);
      doc.setFont(config.font, "normal");
      doc.text(item.resultado, colResultado, y, { align: "center" });
      doc.text(item.normal, colValores, y);
      y += config.lineHeight;
    });

  // ===== Firmas =====
  // Sello del especialista y del doctor asignado (sin firma/huella del paciente: no existen por ticket).
  // Misma posición que el ocupacional. Si una imagen no se puede cargar, el informe se imprime igual
  // (sin ese sello).
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
