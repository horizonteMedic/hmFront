import jsPDF from "jspdf";
import HeaderAsistencial from "../../components/headerAsistencial.jsx";
import TituloSeccionAsistencial from "../../components/tituloSeccionAsistencial.jsx";
import FilaEtiquetaValorAsistencial from "../../components/filaEtiquetaValorAsistencial.jsx";
import footerTR from "../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../utils/dibujarFirmas.js";

// Descanso médico: constancia del descanso otorgado a un trabajador (diagnóstico, tipo de evento,
// fecha de inicio, cantidad de días y fecha fin), con el sello y la firma del médico.
//
// Cabecera y pie: los del módulo asistencial (HeaderAsistencial: N° Ticket, N° Historia Clínica, sede y
// fecha). Cuerpo: el formato de los reportes de laboratorio (GlucosaTolerancia): barras grises de sección
// (DATOS PERSONALES), filas de 9pt con la etiqueta en negrita y el valor a continuación, y el sello del
// médico al pie.
//
// Datos que recibe (objeto plano):
//   numeroTicket, numeroHistoriaClinica, sede, fecha (fecha de atención, yyyy-MM-dd), codigoColor, textoColor,
//   nombres, apellidos, dni, empresa, area, cargo,
//   diagnostico, tipoEvento,
//   fechaInicio, cantidadDias, fechaFin (yyyy-MM-dd; se imprime tal cual, no se calcula a partir de los días),
//   digitalizacion[] (SELLOFIRMA / SELLOFIRMADOCASIG...), footerData.

const X = 15;
const ANCHO = 180;
const VALOR_X = 40; // los valores de todas las filas arrancan en la misma columna, como en la hoja original
const SEPARACION_FIRMAS = 30;
const PIE_OFFSET_Y = 8;
const MESES = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SETIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
];

const texto = (v) => String(v ?? "").trim();

// 2026-09-08 -> "08 DE SETIEMBRE DEL 2026" (como se escribe en la hoja). Si no es una fecha válida, tal cual.
const fechaLarga = (v) => {
  const [, anio, mes, dia] = texto(v).match(/^(\d{4})-(\d{2})-(\d{2})/) ?? [];
  const nombreMes = MESES[Number(mes) - 1];
  return nombreMes ? `${dia} DE ${nombreMes} DEL ${anio}` : texto(v);
};

const cantidadDias = (v) => {
  const dias = texto(v);
  return /^\d+$/.test(dias) ? `${dias} ${Number(dias) === 1 ? "DÍA" : "DÍAS"}` : dias;
};

export default async function DescansoMedico(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // ===== Encabezado =====
  let y = await HeaderAsistencial(
    doc,
    {
      numeroTicket: data.numeroTicket,
      numeroHistoriaClinica: data.numeroHistoriaClinica,
      sede: data.sede,
      fecha: data.fecha,
      codigoColor: data.codigoColor,
      textoColor: data.textoColor,
    },
    { pagina: 1, titulo: "DESCANSO MÉDICO" }
  );

  // Fila "Etiqueta: valor" a todo el ancho; crece si el valor no cabe en una línea.
  const fila = (etiqueta, valor) => {
    y = FilaEtiquetaValorAsistencial(doc, [{ etiqueta, valor, ancho: ANCHO, valorX: VALOR_X }], { x: X, y });
  };
  const seccion = (titulo) => {
    y = TituloSeccionAsistencial(doc, titulo, { x: X, y, ancho: ANCHO });
  };

  // ===== Datos personales =====
  seccion("DATOS PERSONALES");
  fila("Nombres y apellidos:", `${texto(data.nombres)} ${texto(data.apellidos)}`.trim());
  fila("DNI:", data.dni);
  fila("Empresa:", data.empresa);
  fila("Área:", data.area);
  fila("Cargo:", data.cargo);

  // ===== Descanso =====
  seccion("DATOS DEL DESCANSO");
  fila("Diagnóstico:", data.diagnostico);
  fila("Tipo de evento:", data.tipoEvento);
  fila("Fecha de inicio:", fechaLarga(data.fechaInicio));
  fila("Cantidad de días:", cantidadDias(data.cantidadDias));
  fila("Fecha fin:", fechaLarga(data.fechaFin));

  // ===== Firma y sello del médico =====
  await dibujarFirmas({ doc, datos: data, y: y + SEPARACION_FIRMAS, pageW, mostrarFirmaPaciente: false });

  footerTR(doc, { footerData: data, footerOffsetY: PIE_OFFSET_Y });

  if (docExistente) return doc;
  imprimir(doc);
}

function imprimir(doc) {
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
