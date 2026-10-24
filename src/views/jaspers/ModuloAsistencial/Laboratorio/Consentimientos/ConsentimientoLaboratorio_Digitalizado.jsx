import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import parrafoJustificado from "../../../components/parrafoJustificado.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";

// Consentimiento informado de Laboratorio del módulo asistencial (Muestra de Sangre, Panel 2D/3D/4D/5D/10D y
// Marihuana). Mismo diseño que jaspers/Consentimientos (ocupacional): título subrayado, texto justificado con
// los datos del paciente en negrita, tabla de ANTECEDENTES (NO/SI + fecha) y firma / huella del paciente con
// sello del especialista; pero con la cabecera estándar del módulo asistencial (N° Ticket / N° Historia Clínica).
//
// Un solo reporte sirve a todos: recibe `datos.consentimiento` ({ titulo: [líneas], parrafo: [{ texto,
// negrita }], nota, antecedentes: [{ label, si, fecha }] }), que arma el controller a partir del reporte de
// GET /asistencial/laboratorio/consentimiento/obtenerReporte?esJasper=true y la config del consentimiento.

const FONT = "helvetica";
const MARGIN = 18;
const INTERLINEADO = 7;
const CELDA_VACIA = "  ";
// Las firmas (23 mm + leyendas) deben terminar antes del pie.
const MAX_Y_FIRMAS = 235;

const checkBox = (marcado) => `(  ${marcado ? "X" : CELDA_VACIA}  )`;

// Título centrado y subrayado, una línea por elemento. Devuelve la Y siguiente.
const dibujarTitulo = (doc, lineas, y) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(FONT, "bold").setFontSize(lineas.some((linea) => linea.length > 62) ? 11 : 13);
  doc.setLineWidth(0.4);
  lineas.forEach((linea) => {
    doc.text(linea, pageW / 2, y, { align: "center" });
    const ancho = doc.getTextWidth(linea);
    doc.line((pageW - ancho) / 2, y + 1.2, (pageW + ancho) / 2, y + 1.2);
    y += 8;
  });
  return y + 3;
};

export default async function ConsentimientoLaboratorio(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const { titulo = [], parrafo = [], nota = "", antecedentes = [] } = datos.consentimiento ?? {};

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
    { pagina: 1, etiquetaFecha: "Fecha de examen" }
  );

  // ===== Título y texto =====
  doc.setTextColor(0, 0, 0);
  let y = dibujarTitulo(doc, titulo, yContenido + 6);
  y = parrafoJustificado(doc, parrafo, y + 6, { margin: MARGIN, interlineado: INTERLINEADO });

  // ===== Antecedentes =====
  if (antecedentes.length) {
    y += 5;
    if (nota) {
      doc.setFont(FONT, "normal").setFontSize(11);
      doc.text(nota, MARGIN, y);
      y += 8;
    }
    doc.setFont(FONT, "bold").setFontSize(11);
    doc.text("ANTECEDENTES:", MARGIN, y);

    autoTable(doc, {
      startY: y + 3,
      body: antecedentes.map(({ label, si, fecha }) => [
        label,
        `NO ${checkBox(!si)}`,
        `SI ${checkBox(si)}`,
        si && fecha ? `Cuando: ${formatearFechaCorta(fecha)}` : "",
      ]),
      theme: "plain",
      styles: { font: FONT, fontSize: 10, cellPadding: 1 },
      columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 20 }, 2: { cellWidth: 20 }, 3: { cellWidth: 40 } },
      margin: { left: MARGIN },
    });
    y = doc.lastAutoTable.finalY;
  }

  // ===== Firmas =====
  // Firma y huella del paciente (si están registradas) y sello del especialista / doctor asignado. Si una imagen
  // no se puede cargar, el documento se imprime igual (sin ese elemento).
  doc.setLineWidth(0.2);
  try {
    await dibujarFirmas({ doc, datos, y: Math.min(y + 40, MAX_Y_FIRMAS), pageW });
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
