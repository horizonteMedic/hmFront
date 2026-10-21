import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import SeccionEtiquetaValorAsistencial from "../../../components/seccionEtiquetaValorAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe Coproparasitológico (Manipuladores) del módulo asistencial. Reemplaza a los dos reportes ocupacionales
// (jaspers/Manipuladores/Coproparasitologico_Digitalizado.jsx y ParasitologiaSeriado_Digitalizado.jsx): imprime una
// muestra si el examen es simple (`tipoCoproparasitologico`), dos si falta la tercera (`sinHecesTres`) o las tres
// del seriado; cada una con su examen macroscópico y microscópico. Usa la cabecera y los datos personales
// estándar del módulo asistencial (N° Ticket / N° Historia Clínica, sin datos laborales).
//
// Recibe el reporte de GET /asistencial/laboratorio/coproparasitologico/obtenerReporte?esJasper=true (campos
// planos del DTO: color1, aspecto1... lugol3, fechaExamen, digitalizacion...). El controller completa
// numeroTicket, nombres (apellidos primero), numeroHistoriaClinica, sede y sellos.

const SEPARACION = 3;
const ROMANOS = ["I", "II", "III"];

// Etiqueta del reporte y campo del DTO (sin el número de muestra).
const MACROSCOPICO = [
  ["Color", "color"],
  ["Aspecto", "aspecto"],
  ["Moco fecal", "mocoFecal"],
  ["Sangre visible", "sangreVisible"],
  ["Restos alimenticios", "restosAlimenticios"],
  ["Grasa", "grasa"],
];
const MICROSCOPICO = [
  ["Leucocitos", "leucocitos"],
  ["Hematíes", "hematies"],
  ["Investigación de parásitos", "lugol"],
];

// Filas de una sección de la muestra `n` (1, 2 o 3), de dos en dos para que las tres muestras quepan en la hoja.
const filasMuestra = (datos, campos, n) => {
  const celdas = campos.map(([etiqueta, campo]) => [etiqueta, datos[`${campo}${n}`]]);
  return Array.from({ length: Math.ceil(celdas.length / 2) }, (_, i) => celdas.slice(i * 2, i * 2 + 2));
};

export default async function Coproparasitologico(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const muestras = datos.tipoCoproparasitologico ? 1 : datos.sinHecesTres ? 2 : 3;

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
    { pagina: 1, titulo: datos.tipoCoproparasitologico ? "COPROPARASITOLÓGICO" : "COPROPARASITOLÓGICO SERIADO", etiquetaFecha: "Fecha de examen" }
  );

  // ===== Datos personales (sin datos laborales) =====
  let y = DatosPersonalesAsistencial(
    doc,
    { ...datos, nombreCompleto: datos.nombres || datos.nombreCompleto },
    { x: 15, y: yContenido, ancho: 180, laborales: false }
  ) + SEPARACION * 2;

  // ===== Muestras =====
  for (let n = 1; n <= muestras; n++) {
    const romano = ROMANOS[n - 1];
    y = SeccionEtiquetaValorAsistencial(doc, `Muestra: heces ${romano} – Examen macroscópico`, filasMuestra(datos, MACROSCOPICO, n), { y, valorX: 50 });
    y = SeccionEtiquetaValorAsistencial(doc, `Muestra: heces ${romano} – Examen microscópico`, filasMuestra(datos, MICROSCOPICO, n), { y, valorX: 50 }) + SEPARACION;
  }

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
