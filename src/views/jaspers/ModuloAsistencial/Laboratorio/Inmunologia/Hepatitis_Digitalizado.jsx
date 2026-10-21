import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../../components/datosPersonalesAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { dibujarFirmas } from "../../../../utils/dibujarFirmas.js";

// Informe de Hepatitis A / B / C (Inmunología) del módulo asistencial. Los tres ocupacionales
// (jaspers/Inmunologia/LHepatitisA|B|C_Digitalizado.jsx) tienen el mismo cuerpo (título INMUNOLOGÍA,
// MUESTRA, MÉTODO y la tabla PRUEBA CUALITATIVO / RESULTADO) y solo difieren en el texto de la prueba y
// en el campo del resultado; aquí es una sola plantilla que elige por `datos.tipoHepatitis` ("A" | "B" |
// "C"). Usa la cabecera y los datos personales estándar del módulo asistencial (N° Ticket / N° Historia
// Clínica) y no lleva datos laborales (Tipo Examen, Ocupación, Cargo, Área, Empresa, Contrata).
//
// Recibe el reporte de GET /asistencial/laboratorio/hepatitis[-b|-c]/obtenerReporte?esJasper=true (campos
// planos del DTO: marca, hepatitisA (tipo A) o resultado (tipos B y C), fechaExamen, digitalizacion...). El
// controller completa numeroTicket, nombres (apellidos primero), numeroHistoriaClinica, sede, sellos y
// `tipoHepatitis`.

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

// Hepatitis C se imprime como "Positivo" / "Negativo" (el ocupacional normaliza solo ese tipo); A y B
// imprimen el valor tal cual (POSITIVO / NEGATIVO).
const normalizarPositivoNegativo = (valor) => {
  const texto = String(valor ?? "").trim();
  const minuscula = texto.toLowerCase();
  if (minuscula.includes("positivo") || minuscula === "pos" || minuscula === "+") return "Positivo";
  if (minuscula.includes("negativo") || minuscula === "neg" || minuscula === "-") return "Negativo";
  return texto;
};

// Texto de la prueba y resultado de cada tipo.
const TIPOS = {
  A: {
    prueba: (marca) => `HEPATITIS A (HAV) - ${marca || "RAPID TEST - MONTEST"}`,
    resultado: (datos) => String(datos.hepatitisA ?? ""),
  },
  B: {
    prueba: (marca) => `HEPATITIS B (HBsAg) - ${marca || ""}`,
    resultado: (datos) => String(datos.resultado ?? ""),
  },
  C: {
    prueba: (marca) => `Hepatitis C (VHC) - ${marca || ""}`,
    resultado: (datos) => normalizarPositivoNegativo(datos.resultado),
  },
};

export default async function Hepatitis(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const tipo = TIPOS[datos.tipoHepatitis] ?? TIPOS.A;

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
    { pagina: 1, titulo: "INMUNOLOGÍA", etiquetaFecha: "Fecha de examen" }
  );

  // ===== Datos personales (sin datos laborales) =====
  const finalYPos = DatosPersonalesAsistencial(
    doc,
    { ...datos, nombreCompleto: datos.nombres || datos.nombreCompleto },
    { x: 15, y: yContenido, ancho: 180, laborales: false }
  );

  let y = finalYPos + 10;

  // ===== Muestra y método =====
  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("MUESTRA :", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text("SUERO", config.margin + 30, y);
  y += config.lineHeight;

  doc.setFont(config.font, "bold");
  doc.text("MÉTODO :", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text("INMUNOENSAYO CROMATOGRÁFICO", config.margin + 30, y);
  y += config.lineHeight * 2;

  // ===== Encabezado de la tabla =====
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA CUALITATIVO", config.margin, y);
  const resultColX = pageW / 2 + 40;
  doc.text("RESULTADO", resultColX, y, { align: "left" });

  y += 3;
  doc.setLineWidth(0.3);
  doc.line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // ===== Prueba =====
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text(tipo.prueba(datos.marca), config.margin, y);
  doc.text(tipo.resultado(datos), resultColX, y, { align: "left" });

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
