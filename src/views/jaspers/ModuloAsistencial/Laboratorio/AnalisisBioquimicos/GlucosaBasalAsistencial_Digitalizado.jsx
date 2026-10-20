import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de Glucosa Basal (Análisis Bioquímicos) del módulo asistencial. Mismo cuerpo que
// jaspers/AnalisisBioquimicos/ExamenGlucosaBasal.jsx (ocupacional): título BIOQUIMICA, MUESTRA, la fila
// GLUCOSA BASAL y, si el examen es completo, el PERFIL LIPÍDICO; pero con la cabecera y los datos
// personales estándar del módulo asistencial (N° Ticket / N° Historia Clínica) y sin datos laborales
// (Tipo Examen, Ocupación, Cargo, Área, Empresa, Contrata).
//
// Recibe el reporte de GET /asistencial/laboratorio/analisis-bioquimico/obtenerReporteGlucosaBasal
// (campos planos del DTO: glucBasal, txtColesterol, txtLdlColesterol..., fecha, digitalizacion...). El
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

// Un resultado vacío (null / undefined / en blanco) no se imprime.
const texto = (v) => (v === undefined || v === null ? "" : String(v).trim());

export default async function GlucosaBasal(datos = {}, docExistente = null) {
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
    { pagina: 1, titulo: "BIOQUIMICA", etiquetaFecha: "Fecha de examen" }
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
  doc.text("MUESTRA :", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text(datos.muestra || "SUERO", config.margin + 30, y);
  y += config.lineHeight * 2;

  // ===== Tabla de resultados =====
  const colPrueba = config.margin;
  const colResultado = config.margin + 80;
  const colValores = config.margin + 140;

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", colPrueba, y);
  doc.text("RESULTADO", colResultado, y, { align: "center" });
  doc.text("VALORES NORMALES", colValores, y);
  y += 2;

  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // Glucosa basal
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text("GLUCOSA BASAL", colPrueba, y);
  doc.text(texto(datos.glucBasal), colResultado, y, { align: "center" });
  doc.text("70 - 110 mg/dl", colValores, y);
  y += config.lineHeight;

  // Perfil lipídico (solo si el examen es completo)
  if (texto(datos.txtColesterol) || texto(datos.txtTrigliseridos)) {
    doc.setLineWidth(0.2).line(config.margin, y, pageW - config.margin, y);
    y += config.lineHeight;

    doc.setFont(config.font, "bold").setFontSize(10);
    doc.text("PERFIL LIPÍDICO", colPrueba, y);
    y += config.lineHeight;

    const pruebasLipidico = [
      { label: "COLESTEROL TOTAL", valor: texto(datos.txtColesterol), valores: "< 200 mg/dl" },
      { label: "TRIGLICERIDOS", valor: texto(datos.txtTrigliseridos), valores: "< 150 mg/dl" },
      { label: "HDL COLESTEROL", valor: texto(datos.txtHdlColesterol), valores: "40 - 60 mg/dl" },
      { label: "LDL COLESTEROL", valor: texto(datos.txtLdlColesterol), valores: "< 130 mg/dl" },
      { label: "VLDL COLESTEROL", valor: texto(datos.txtVldlColesterol), valores: "< 30 mg/dl" },
    ];

    pruebasLipidico
      .filter(({ valor }) => valor !== "")
      .forEach(({ label, valor, valores }) => {
        doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
        doc.text(label, colPrueba, y);
        doc.text(valor, colResultado, y, { align: "center" });
        doc.text(valores, colValores, y);
        y += config.lineHeight;
      });
  }

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
