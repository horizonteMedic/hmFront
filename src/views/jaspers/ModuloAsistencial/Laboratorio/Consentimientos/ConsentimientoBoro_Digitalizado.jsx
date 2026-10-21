import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import parrafoJustificado from "../../../components/parrafoJustificado.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";

// Autorización de examen de drogas (Consentimiento Boro) del módulo asistencial. Mismo diseño que
// jaspers/Consentimientos/Consentimiento_Boro_Digitalizado.jsx (ocupacional): título subrayado, tabla Fecha / Hora /
// Ciudad, párrafo de autorización con los datos del paciente en negrita, declaración (SI / NO + detalle), notas y
// firmas; pero con la cabecera estándar del módulo asistencial (N° Ticket / N° Historia Clínica).
//
// Recibe el reporte de GET /asistencial/laboratorio/consentimiento-boro/obtenerReporte?esJasper=true y
// `datos.autorizacion` ([{ texto, negrita }], el párrafo ya con los datos del paciente), que arma el controller.

const FONT = "helvetica";
const MARGIN = 18;
const ANCHO_TEXTO = 210 - 2 * MARGIN - 4;

const fecha = (valor) => formatearFechaCorta(valor) || valor || "";

// Marca "SI ( X )" / "NO (   )" de una pregunta, en las columnas xSi y xNo (mm desde el margen).
const marcas = (doc, marcado, y, xSi = 92, xNo = 110) => {
  doc.text(`SI ( ${marcado ? "X" : " "} )`, MARGIN + xSi, y);
  doc.text(`NO ( ${!marcado ? "X" : " "} )`, MARGIN + xNo, y);
};

// Texto partido en líneas del ancho disponible; devuelve la Y siguiente.
const parrafo = (doc, texto, y, interlineado) => {
  doc.splitTextToSize(texto, ANCHO_TEXTO).forEach((linea) => {
    doc.text(linea, MARGIN, y);
    y += interlineado;
  });
  return y;
};

// Pregunta con su respuesta y, si se marcó, un detalle ("¿Cuál (es):" / "Cuando:") a la derecha.
const pregunta = (doc, etiqueta, marcado, y, { detalle = "", etiquetaDetalle = "¿Cuál (es):" } = {}) => {
  doc.text(etiqueta, MARGIN, y);
  marcas(doc, marcado, y);
  if (marcado && detalle) {
    doc.text(etiquetaDetalle, MARGIN + 130, y);
    doc.text(String(detalle), MARGIN + 150, y);
  }
};

// "CUAL : texto" con la etiqueta en negrita.
const campo = (doc, etiqueta, valor, y) => {
  doc.setFont(FONT, "bold");
  doc.text(etiqueta, MARGIN, y);
  doc.setFont(FONT, "normal");
  doc.text(":", MARGIN + 20, y);
  doc.text(String(valor || ""), MARGIN + 35, y);
};

export default async function ConsentimientoBoro(datos = {}, docExistente = null) {
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
    { pagina: 1, etiquetaFecha: "Fecha de examen" }
  );

  // ===== Título =====
  doc.setTextColor(0, 0, 0);
  let y = yContenido + 6;
  const titulo = "AUTORIZACIÓN DE EXAMEN DE DROGAS";
  doc.setFont(FONT, "bold").setFontSize(13);
  doc.text(titulo, pageW / 2, y, { align: "center" });
  const anchoTitulo = doc.getTextWidth(titulo);
  doc.setLineWidth(0.7);
  doc.line((pageW - anchoTitulo) / 2, y + 2, (pageW + anchoTitulo) / 2, y + 2);
  doc.setLineWidth(0.2);
  y += 12;

  // ===== Fecha / Hora / Ciudad =====
  const celda = (contenido) => ({ content: contenido, styles: { halign: "center" } });
  autoTable(doc, {
    startY: y,
    head: [[celda("Fecha"), celda("Hora"), celda("Ciudad")]],
    body: [[celda(fecha(datos.fecha)), celda(datos.horaExamen || ""), celda(datos.sede || datos.nombreSede || "")]],
    theme: "grid",
    styles: { font: FONT, fontSize: 10, cellPadding: 0.5, lineWidth: 0.1, lineColor: [0, 0, 0], valign: "middle" },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: "bold" },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 50 }, 2: { cellWidth: 50 } },
    margin: { left: (pageW - 150) / 2, right: (pageW - 150) / 2 },
  });
  y = doc.lastAutoTable.finalY + 7;

  // ===== Autorización =====
  y = parrafoJustificado(doc, datos.autorizacion ?? [], y, { margin: MARGIN, fontSize: 10, interlineado: 5 }) + 4;

  // ===== Declaración =====
  doc.setFont(FONT, "normal").setFontSize(10);
  y = parrafo(doc, "Además, declaro que la información que brindaré a continuación es verdadera:", y, 4) + 1;

  pregunta(doc, "- ¿Sufre alguna enfermedad?", datos.antBoroAlgunaEnfermedad, y, { detalle: datos.critCualAlgunaEnfermedad });
  y += 5;
  pregunta(doc, "- ¿Consume regularmente algún medicamento?", datos.antBoroAlgunMedicamento, y, { detalle: datos.critCualAlgunMedicamento });
  y += 5;

  doc.text("- ¿Consume regularmente mate de coca?", MARGIN, y);
  marcas(doc, datos.antBoroConsumenMateCoca, y);
  y += 5;
  if (datos.antBoroConsumenMateCoca) {
    doc.text(`Si la respuesta es SI: ¿Cuándo consumió por última vez?     Fecha:   ${fecha(datos.critFechaConsumoMateCoca)}`, MARGIN, y);
    y += 7;
  } else {
    y += 2;
  }

  pregunta(doc, "- ¿Consume o mastica hoja de coca?", datos.masticaHojaCoca, y, {
    detalle: fecha(datos.fechaConsumoHojaCoca),
    etiquetaDetalle: "Cuando:",
  });
  y += 5;
  y = parrafo(doc, "Si la respuesta es SI, se procederá a reprogramar la toma de la muestra en 5 días, caso contrario se tomará la muestra bajo responsabilidad del paciente.", y, 6) + 6;

  doc.text("- ¿Se realizó algún tratamiento quirúrgico o dental en las últimas 48 horas?", MARGIN, y);
  marcas(doc, datos.antBoroTratQuirugODental, y, 139, 155);
  y += 5;
  y = parrafo(doc, "Si la respuesta es SI, indicar qué tratamiento se realizó, cual es nombre del cirujano, donde y cuando se realizó dicho procedimiento o tratamiento", y, 6) + 1;

  campo(doc, "CUAL", datos.critCualTratQuirugODental, y);
  campo(doc, "DONDE", datos.critDondeTratQuirugODental, y + 8);
  campo(doc, "CUANDO", datos.critCuandoTratQuirugODental, y + 16);
  y += 28;

  // ===== Notas =====
  doc.setFont(FONT, "bold");
  doc.text("Notas:", MARGIN, y);
  doc.setFont(FONT, "normal");
  y = parrafo(doc, String(datos.notas || ""), y + 5, 5);

  // ===== Firmas =====
  // Firma y huella del paciente (si están registradas) y sello del especialista / doctor asignado. Si una imagen
  // no se puede cargar, el documento se imprime igual (sin ese elemento).
  doc.setLineWidth(0.2);
  try {
    const yFinalFirmas = await dibujarFirmas({ doc, datos, y: y + 10, pageW });

    // Nombre y DNI de quien registró, debajo del sello del responsable (lado derecho).
    const tieneSello = datos.digitalizacion?.some((d) => d.nombreDigitalizacion === "SELLOFIRMA" || d.nombreDigitalizacion === "SELLOFIRMADOCASIG");
    if (tieneSello) {
      const centroX = (pageW / 3) * 2;
      doc.setFont(FONT, "normal").setFontSize(7);
      doc.text(`Nombre Completo: ${datos.usuarioRegistrado || ""}`, centroX, yFinalFirmas - 3, { align: "center" });
      doc.text(`DNI: ${datos.dniUsuario || ""}`, centroX, yFinalFirmas + 1, { align: "center" });
    }
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
