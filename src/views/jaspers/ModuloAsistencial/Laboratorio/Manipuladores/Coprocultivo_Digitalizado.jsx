import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import SeccionEtiquetaValorAsistencial from "../../../components/seccionEtiquetaValorAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de Coprocultivo (Manipuladores) del módulo asistencial. Mismo contenido que
// jaspers/Manipuladores/coprocultivo_digitalizado.jsx (ocupacional): muestra, examen microscópico, identificación
// y antibiograma, resultado y observaciones; pero con la cabecera y los datos personales estándar del módulo
// asistencial (N° Ticket / N° Historia Clínica, sin datos laborales).
//
// Recibe el reporte de GET /asistencial/laboratorio/coprocultivo/obtenerReporte?esJasper=true (campos planos del
// DTO: muestra, colorExamen, flora, resultado, observaciones, fechaExamen, digitalizacion...). El controller
// completa numeroTicket, nombres (apellidos primero), numeroHistoriaClinica, sede y sellos.

const FONT = "helvetica";
const MARGIN = 15;
const SEPARACION = 3;
const Y_FIRMAS = 205;

export default async function Coprocultivo(datos = {}, docExistente = null) {
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
    { pagina: 1, titulo: "COPROCULTIVO", etiquetaFecha: "Fecha de examen" }
  );

  // ===== Datos personales (sin datos laborales) =====
  let y = DatosPersonalesAsistencial(
    doc,
    { ...datos, nombreCompleto: datos.nombres || datos.nombreCompleto },
    { x: MARGIN, y: yContenido, ancho: 180, laborales: false }
  ) + SEPARACION * 2;

  // ===== Resultados =====
  const resultados = [
    ["COPROCULTIVO – Muestra", [
      ["Muestra", datos.muestra],
      ["Color", datos.colorExamen],
      ["Consistencia", datos.consistencia],
      ["Moco fecal", datos.mocoFecal],
      ["Sangre visible", datos.sangreVisible],
      ["Restos alimenticios", datos.restosAlimenticios],
    ]],
    ["COPROCULTIVO – Examen microscópico", [
      ["Leucocitos", datos.leucocitos],
      ["Hematíes", datos.hematies],
      ["Parásitos", datos.parasitos],
      ["Gotas de grasa", datos.gotasGrasa],
      ["Levaduras", datos.levaduras],
    ]],
    ["COPROCULTIVO – Identificación y antibiograma", [
      ["Identificación", datos.identificacion],
      ["Flora coliforme", datos.flora],
    ]],
  ];
  resultados.forEach(([titulo, filas]) => {
    y = SeccionEtiquetaValorAsistencial(
      doc,
      titulo,
      filas.map(([etiqueta, valor]) => [etiqueta, String(valor ?? "").toUpperCase()]),
      { y }
    ) + SEPARACION;
  });

  doc.setFont(FONT, "italic").setFontSize(9);
  doc.text("Comentario: (*) Pertenece a la flora normal", MARGIN, y + 1);
  y += SEPARACION * 3;

  y = SeccionEtiquetaValorAsistencial(doc, "COPROCULTIVO – Resultado", [["Resultado", String(datos.resultado ?? "").toUpperCase()]], { y });

  // ===== Observaciones =====
  doc.setFont(FONT, "normal").setFontSize(9);
  y += 6;
  doc.splitTextToSize(String(datos.observaciones ?? ""), 180).forEach((linea) => {
    doc.text(linea, MARGIN, y);
    y += 5;
  });

  // ===== Firmas =====
  // Sello del especialista y del doctor asignado (sin firma/huella del paciente: no existen por ticket). Si una
  // imagen no se puede cargar, el informe se imprime igual (sin ese sello).
  doc.setLineWidth(0.2);
  try {
    await dibujarFirmas({ doc, datos, y: Math.max(y + 8, Y_FIRMAS), pageW, mostrarFirmaPaciente: false });
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
