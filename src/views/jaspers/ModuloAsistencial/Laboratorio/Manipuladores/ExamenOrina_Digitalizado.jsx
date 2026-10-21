import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import SeccionEtiquetaValorAsistencial from "../../../components/seccionEtiquetaValorAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de Examen de Orina (Manipuladores) del módulo asistencial: examen físico, químico y sedimento urinario,
// con la misma distribución del examen de orina del Laboratorio Clínico asistencial, la cabecera y los datos
// personales estándar del módulo (N° Ticket / N° Historia Clínica, sin datos laborales).
//
// Recibe el reporte de GET /asistencial/laboratorio/clinico/obtenerReporteOrina?esJasper=true (campos planos del
// DTO: colorUrina, aspecto, nitritos, leucocitosEq, gramSC, fechaLab, digitalizacion...). El controller completa
// numeroTicket, nombres (apellidos primero), numeroHistoriaClinica, sede y sellos.

const SEPARACION = 3;

const valor = (dato) => String(dato ?? "").trim() || "N/A";
// "x campo" solo si hay un valor (los resultados "N/A" se imprimen tal cual).
const porCampo = (dato) => (String(dato ?? "").trim() && dato !== "N/A" ? `${dato} X CAMPO` : "N/A");

export default async function ExamenOrina(datos = {}, docExistente = null) {
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
      fecha: datos.fechaLab || datos.fecha,
      codigoColor: datos.codigoColor,
      textoColor: datos.textoColor,
    },
    { pagina: 1, titulo: "EXAMEN DE ORINA", etiquetaFecha: "Fecha de examen" }
  );

  // ===== Datos personales (sin datos laborales) =====
  let y = DatosPersonalesAsistencial(
    doc,
    { ...datos, nombreCompleto: datos.nombres || datos.nombreCompleto },
    { x: 15, y: yContenido, ancho: 180, laborales: false }
  ) + SEPARACION;

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("MUESTRA: ORINA", pageW / 2, y + 4, { align: "center" });
  y += SEPARACION * 3;

  // ===== Resultados =====
  const secciones = [
    ["Examen físico", [
      [["Color", valor(datos.colorUrina)], ["Aspecto", valor(datos.aspecto)]],
      [["Densidad", valor(datos.densidad)], ["PH", valor(datos.ph)]],
    ]],
    ["Examen químico", [
      [["Nitritos", valor(datos.nitritos)], ["Urobilinógeno", valor(datos.urobilinogeno)]],
      [["Proteínas", valor(datos.proteinas)], ["Bilirrubina", valor(datos.bilirrubina)]],
      [["Cetonas", valor(datos.cetonas)], ["Glucosa", valor(datos.glucosa)]],
      [["Leucocitos", valor(datos.leucocitosEq)], ["Sangre", valor(datos.sangre)]],
      [["Ác. ascórbico", valor(datos.acAscorbico)], ["", ""]],
    ]],
    ["Sedimento urinario", [
      [["Cel. epiteliales", valor(datos.celulasEpiteliales)], ["Cilindros", valor(datos.cilindros)]],
      [["Leucocitos", porCampo(datos.leucocitosSu)], ["Bacterias", valor(datos.bacterias)]],
      [["Hematíes", porCampo(datos.hematiesSu)], ["Gram S/C", valor(datos.gramSC)]],
      [["Cristales", valor(datos.cristales)], ["Almidón", valor(datos.almidon)]],
      [["Levadura", valor(datos.levadura)], ["Otros", valor(datos.otros)]],
    ]],
  ];
  secciones.forEach(([titulo, filas]) => {
    y = SeccionEtiquetaValorAsistencial(doc, titulo, filas, { y, valorX: 42 }) + SEPARACION;
  });

  // ===== Firmas =====
  // Sello del especialista y del doctor asignado (sin firma/huella del paciente: no existen por ticket). Si una
  // imagen no se puede cargar, el informe se imprime igual (sin ese sello).
  doc.setLineWidth(0.2);
  try {
    await dibujarFirmas({ doc, datos, y: y + 8, pageW, mostrarFirmaPaciente: false });
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
