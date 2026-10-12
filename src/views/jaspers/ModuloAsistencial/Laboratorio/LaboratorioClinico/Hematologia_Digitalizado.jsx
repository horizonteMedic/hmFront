import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils.js";
import { convertirGenero, getSignCompressed } from "../../../../utils/helpers.js";

// Informe de Hemograma automatizado del módulo asistencial. El cuerpo es el mismo de
// jaspers/LaboratorioClinico/Hematologia_Digitalizado.jsx (ocupacional), pero con la cabecera estándar
// del módulo asistencial (N° Ticket / N° Historia Clínica) y sin datos de empresa (Tipo Examen, Cargo,
// Área, Empresa, Contrata).
//
// Recibe el reporte de GET /asistencial/laboratorio/hemograma/obtenerReporte?esJasper=true (mismos
// nombres de campo del DTO: nombres, dni, edad, txtHemoglobina, digitalizacion...). El controller
// completa numeroTicket, numeroHistoriaClinica y sede si el reporte no los trae.

// Superíndices (ej: "10^6" -> "10" con "6" arriba)
const dibujarTextoConSuperindice = (doc, text, x, y) => {
  const parts = text.split(/(\^[0-9]+)/);
  let currentX = x;

  parts.forEach((part) => {
    if (part.startsWith("^")) {
      const superNum = part.substring(1);
      doc.setFontSize(6);
      doc.text(superNum, currentX, y - 1.5);
      currentX += doc.getTextWidth(superNum);
      doc.setFontSize(9);
    } else {
      doc.setFontSize(9);
      doc.text(part, currentX, y);
      currentX += doc.getTextWidth(part);
    }
  });
};

export default async function Hematologia_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // === MAPEO DE DATOS ===
  const datosReales = {
    nombres: String(data.nombres || data.nombresPaciente || ""),
    dni: String(data.dniPaciente || data.dni || ""),
    edad: String(data.edadPaciente || data.edad || ""),
    sexo: convertirGenero(data.sexoPaciente || ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente || ""),
    lugarNacimiento: String(data.lugarNacimientoPaciente || ""),
    estadoCivil: String(data.estadoCivilPaciente || ""),
    nivelEstudio: String(data.nivelEstudioPaciente || ""),
    ocupacion: String(data.ocupacionPaciente || ""),
  };

  // === HEADER ===
  // Cabecera compartida del módulo asistencial. Devuelve la Y donde empieza el contenido.
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  let yPos = await HeaderAsistencial(
    doc,
    {
      numeroTicket: data.numeroTicket,
      numeroHistoriaClinica: data.numeroHistoriaClinica,
      sede: data.sede,
      fecha: data.fechaExamen,
      codigoColor: data.codigoColor,
      textoColor: data.textoColor,
    },
    { pagina: 1, titulo: "HEMATOLOGÍA", etiquetaFecha: "Fecha de examen" }
  );

  // === DATOS DEL PACIENTE ===
  const tablaInicioX = 15;
  const tablaAncho = 180;
  const filaAltura = 5;

  // Fila de una celda o varias: contorno exterior + divisiones verticales (distancia desde tablaInicioX).
  const dibujarFilaCeldas = (y, divisiones = []) => {
    doc.rect(tablaInicioX, y, tablaAncho, filaAltura);
    divisiones.forEach((dx) => doc.line(tablaInicioX + dx, y, tablaInicioX + dx, y + filaAltura));
  };

  // Celda "Etiqueta: valor" (etiqueta en negrita, valor normal) dentro de la fila que empieza en y.
  const dibujarEtiquetaValor = (etiqueta, valor, xEtiqueta, xValor, y) => {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(etiqueta, tablaInicioX + xEtiqueta, y + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(valor, tablaInicioX + xValor, y + 3.5);
  };

  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, "FD");
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  dibujarFilaCeldas(yPos);
  dibujarEtiquetaValor("Nombres y Apellidos:", datosReales.nombres, 2, 40, yPos);
  yPos += filaAltura;

  dibujarFilaCeldas(yPos, [45, 90]);
  dibujarEtiquetaValor("DNI:", datosReales.dni, 2, 12, yPos);
  dibujarEtiquetaValor("Edad:", datosReales.edad ? datosReales.edad + " AÑOS" : "", 47, 58, yPos);
  dibujarEtiquetaValor("Sexo:", datosReales.sexo, 92, 105, yPos);
  yPos += filaAltura;

  dibujarFilaCeldas(yPos, [90]);
  dibujarEtiquetaValor("Lugar de Nacimiento:", datosReales.lugarNacimiento, 2, 38, yPos);
  dibujarEtiquetaValor("Estado Civil:", datosReales.estadoCivil, 92, 115, yPos);
  yPos += filaAltura;

  dibujarFilaCeldas(yPos, [90]);
  dibujarEtiquetaValor("Nivel de Estudio:", datosReales.nivelEstudio, 2, 32, yPos);
  dibujarEtiquetaValor("Fecha Nac.:", datosReales.fechaNacimiento, 92, 115, yPos);
  yPos += filaAltura;

  dibujarFilaCeldas(yPos);
  dibujarEtiquetaValor("Ocupación:", datosReales.ocupacion, 2, 25, yPos);
  yPos += filaAltura;

  yPos += 10;

  // === SECCIÓN: HEMOGRAMA ===
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("HEMOGRAMA AUTOMATIZADO", pageW / 2, yPos, { align: "center" });
  yPos += 8;

  const margin = 15;
  const col1X = margin;
  const col2X = 100;
  const col3X = 150;

  // Encabezados
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("PRUEBA", col1X, yPos);
  doc.text("RESULTADO", col2X, yPos, { align: "center" });
  doc.text("VALORES NORMALES", col3X, yPos);
  yPos += 5;

  // Datos del hemograma
  doc.setFontSize(9);
  const lineHeight = 6;

  const hemogramaData = [
    { prueba: "HEMOGLOBINA", resultado: data.txtHemoglobina || "", normal: "Mujeres 12 - 16 g/dL\nHombres 14 - 18 g/dL", bold: true },
    { prueba: "HEMATOCRITO", resultado: data.txtHematocrito || "", normal: "Mujeres 38 - 50 %\nHombres 40 - 54 %", bold: true },
    { prueba: "HEMATÍES", resultado: data.txtHematies || "", normal: "4.0 - 5.5 x 10^6/mm³", bold: true },
    { prueba: "Volumen Corpuscular Medio", resultado: data.txtVolumen || "", normal: "80 - 100 fL", bold: false },
    { prueba: "Hemoglobina Corpuscular Media", resultado: data.txtHemocorpuscular || "", normal: "26 - 34 pg", bold: false },
    { prueba: "Concentración de la Hemoglobina Corpuscular Media", resultado: data.txtConcentracion || "", normal: "31 - 37 g/dl", bold: false },
    { prueba: "LEUCOCITOS", resultado: data.txtLeucocitos || "", normal: "4 - 10 x 10^3/mm³", bold: true },
    { prueba: "PLAQUETAS", resultado: data.txtPlaquetas || "", normal: "1.5 - 4.5 x 10^5/mm³", bold: true },
    { prueba: "RECUENTO DIFERENCIAL", resultado: "", normal: "", bold: true },
    { prueba: "NEUTRÓFILOS (%)", resultado: data.txtNeutrofilos || "", normal: "55-65 %", bold: true, indent: true },
    { prueba: "ABASTONADOS (%)", resultado: data.txtAbastonados || "", normal: "0 - 5 %", bold: true, indent: true },
    { prueba: "SEGMENTADOS (%)", resultado: data.txtSegmentados || "", normal: "55 - 65 %", bold: true, indent: true },
    { prueba: "MONOCITOS (%)", resultado: data.txtMonocitos || "", normal: "4 - 8 %", bold: true, indent: true },
    { prueba: "EOSINÓFILOS (%)", resultado: data.txtEosinofios || "", normal: "0 - 4 %", bold: true, indent: true },
    { prueba: "BASÓFILOS (%)", resultado: data.txtBasofilos || "", normal: "0 - 1 %", bold: true, indent: true },
    { prueba: "LINFOCITOS (%)", resultado: data.txtLinfocitos || "", normal: "20 - 40 %", bold: true, indent: true },
  ];

  hemogramaData.forEach((item) => {
    // Prueba
    doc.setFont("helvetica", item.bold ? "bold" : "normal");
    const pruebaX = item.bold && !item.indent ? col1X : col1X + 4;
    doc.text(item.prueba, pruebaX, yPos);

    // Resultado
    doc.setFont("helvetica", "normal");
    doc.text(item.resultado, col2X, yPos, { align: "center" });

    // Valores normales
    if (item.normal.includes("\n")) {
      item.normal.split("\n").forEach((line, idx) => {
        if (line.includes("^")) {
          dibujarTextoConSuperindice(doc, line, col3X, yPos + idx * 3.5);
        } else {
          doc.text(line, col3X, yPos + idx * 3.5);
        }
      });
      yPos += lineHeight + 2;
    } else {
      if (item.normal.includes("^")) {
        dibujarTextoConSuperindice(doc, item.normal, col3X, yPos);
      } else {
        doc.text(item.normal, col3X, yPos);
      }
      yPos += lineHeight;
    }
  });

  // === FIRMAS ===
  // Sello del especialista y del doctor asignado, centrados. Si una imagen no se puede cargar, el
  // informe se imprime igual (sin ese sello).
  try {
    const sello1 = await getSignCompressed(data, "SELLOFIRMA");
    const sello2 = await getSignCompressed(data, "SELLOFIRMADOCASIG");

    const sigW = 53;
    const sigH = 23;
    const sigY = yPos + 20;
    const gap = 16;

    if (sello1 && sello2) {
      const startX = (pageW - (sigW * 2 + gap)) / 2;
      doc.addImage(sello1, "JPEG", startX, sigY, sigW, sigH);
      doc.addImage(sello2, "JPEG", startX + sigW + gap, sigY, sigW, sigH);
    } else if (sello1 || sello2) {
      doc.addImage(sello1 || sello2, "JPEG", (pageW - sigW) / 2, sigY, sigW, sigH);
    }
  } catch (err) {
    console.error("Error dibujando firmas:", err);
  }

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 7 });

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
  iframe.onload = () => iframe.contentWindow.print();
}
