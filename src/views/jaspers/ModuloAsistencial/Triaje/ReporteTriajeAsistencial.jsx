import jsPDF from "jspdf";
import HeaderAsistencial from "../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../components/datosPersonalesAsistencial.jsx";
import TituloSeccionAsistencial, { FUENTE_CUERPO } from "../../components/tituloSeccionAsistencial.jsx";
import FilaEtiquetaValorAsistencial from "../../components/filaEtiquetaValorAsistencial.jsx";
import footerTR from "../../components/footerTR.jsx";
import dibujarCuadroTextoDinamico from "../../components/CuadroTextoDinamico.jsx";
import { dibujarFirmas } from "../../../utils/dibujarFirmas";
import { getSign } from "../../../utils/helpers";

// Informe de Triaje del módulo asistencial. Mismo contenido que el de Triaje Ocupacional
// (jaspers/Triaje/ReporteTriaje.jsx): datos personales, signos vitales y observaciones (aquí, el
// diagnóstico), pero con la cabecera y las tablas estándar del módulo asistencial.
//
// Recibe el objeto plano que arma `construirDatosImpresion` (controller del formulario), con los
// mismos nombres de campo del formulario (talla, peso, fCardiaca, sat02...) + los datos del pie
// (datosFooter) + `digitalizacion` con el sello del médico asignado (SELLOFIRMADOCASIG).

const X = 10;
const ANCHO = 190;
const ANCHO_ETIQUETA = 80;
const PIE_OFFSET_Y = 8;
// Y donde empieza la línea del pie (ver footerTR.jsx) menos un respiro: el contenido no debe pasar
// de aquí.
const Y_LIMITE_CONTENIDO = 297 - 25 + PIE_OFFSET_Y - 3.6 - 2;
// Bloque de firma (ver dibujarFirmas): sello de 20 mm + línea + 2 renglones de texto. Va fijo justo
// encima del pie; si hay sello, el cuadro de diagnóstico se detiene antes.
const ALTO_FIRMAS = 27;
const Y_FIRMAS = Y_LIMITE_CONTENIDO - ALTO_FIRMAS;

const texto = (v) => String(v ?? "").trim();

// Etiqueta impresa, campo del formulario y unidad. La talla del Triaje asistencial se guarda en
// metros (la pantalla convierte los cm tecleados), a diferencia del ocupacional que la imprime en cm.
const SIGNOS_VITALES = [
  ["Talla", "talla", "m"],
  ["Peso", "peso", "kg"],
  ["IMC", "imc", "kg/m²"],
  ["ICC", "icc", ""],
  ["Perímetro cuello", "perimetroCuello", "cm"],
  ["Cintura", "cintura", "cm"],
  ["Cadera", "cadera", "cm"],
  ["Temperatura", "temperatura", "°C"],
  ["Frecuencia cardiaca", "fCardiaca", "x'"],
  ["SatO2", "sat02", "%"],
  ["Sistólica", "sistolica", "mmHg"],
  ["Diastólica", "diastolica", "mmHg"],
  ["Frec. respiratoria", "fRespiratoria", "x'"],
];

const conUnidad = (valor, unidad) => (texto(valor) ? `${texto(valor)} ${unidad}`.trim() : "");

export default async function ReporteTriajeAsistencial(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // ===== Encabezado =====
  // Cabecera compartida del módulo asistencial (con N° Ticket y N° Historia Clínica). Devuelve la Y
  // donde empieza el contenido.
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  let y = await HeaderAsistencial(
    doc,
    {
      numeroTicket: data.numeroTicket,
      numeroHistoriaClinica: data.numeroHistoriaClinica,
      sede: data.sede,
      fecha: data.fecha,
    },
    { pagina: 1, titulo: "INFORME TRIAJE ASISTENCIAL", etiquetaFecha: "Fecha de examen" }
  );

  // ===== Datos personales =====
  y = DatosPersonalesAsistencial(
    doc,
    {
      ...data,
      nombreCompleto: `${texto(data.apellidos)} ${texto(data.nombres)}`.trim(),
      dni: data.numeroDocumento,
    },
    { x: X, y, ancho: ANCHO }
  );

  // ===== Signos vitales =====
  y = TituloSeccionAsistencial(doc, "SIGNOS VITALES", { x: X, y, ancho: ANCHO });
  SIGNOS_VITALES.forEach(([etiqueta, campo, unidad]) => {
    y = FilaEtiquetaValorAsistencial(
      doc,
      [
        { etiqueta: `${etiqueta}:`, ancho: ANCHO_ETIQUETA },
        { valor: conUnidad(data[campo], unidad), ancho: ANCHO - ANCHO_ETIQUETA },
      ],
      { x: X, y }
    );
  });

  const tieneSelloMedico = Boolean(getSign(data, "SELLOFIRMADOCASIG"));
  const yLimiteDiagnostico = tieneSelloMedico ? Y_FIRMAS - 2 : Y_LIMITE_CONTENIDO;

  // ===== Diagnóstico =====
  // Igual que las "Observaciones" del ocupacional: solo se imprime si hay texto. Si es muy largo se
  // achica la letra para que el cuadro no pise la firma ni el pie de página.
  if (texto(data.diagnostico)) {
    y = TituloSeccionAsistencial(doc, "DIAGNÓSTICO", { x: X, y, ancho: ANCHO });

    const lineHeight = 4;
    const paddingTop = 4.5;
    const paddingBottom = 2;
    const disponible = yLimiteDiagnostico - y;

    dibujarCuadroTextoDinamico(doc, {
      x: X,
      y,
      ancho: ANCHO,
      texto: data.diagnostico,
      fontSize: FUENTE_CUERPO,
      lineHeight,
      paddingTop,
      paddingBottom,
      minHeight: Math.min(50, disponible),
      maxLineas: Math.max(1, Math.floor((disponible - paddingTop - paddingBottom) / lineHeight)),
    });
  }

  // ===== Firma del médico asignado =====
  // Si la imagen del sello no se puede cargar, se imprime el informe igual (sin sello).
  if (tieneSelloMedico) {
    doc.setDrawColor(0, 0, 0);
    doc.setTextColor(0, 0, 0);
    try {
      await dibujarFirmas({
        doc,
        datos: data,
        y: Y_FIRMAS,
        pageW: doc.internal.pageSize.getWidth(),
        mostrarFirmaPaciente: false,
      });
    } catch (error) {
      console.error("No se pudo dibujar el sello del médico:", error);
    }
  }

  // ===== Pie =====
  footerTR(doc, { footerData: data, footerOffsetY: PIE_OFFSET_Y });

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
