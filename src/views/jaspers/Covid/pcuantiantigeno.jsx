import jsPDF from "jspdf";
import CabeceraLogo from "../components/CabeceraLogo.jsx";
import footerTR from "../components/footerTR.jsx";
import drawColorBox from "../components/ColorBox.jsx";
import { getSign } from "../../utils/helpers.js";

// --- Configuración Centralizada ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 80,
  col3X: 140,
  fontSize: {
    title: 14,
    header: 11,
    body: 11,
  },
  font: "helvetica",
  lineHeight: 8,
};

// --- Funciones de Ayuda ---
const drawUnderlinedTitle = (doc, text, y) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc
    .setFont(config.font, "bold")
    .setFontSize(config.fontSize.title)
    .text(text, pageW / 2, y, { align: "center" });
};

const drawReferenceValues = (doc, y) => {
  // Ya imprimimos el encabezado en la tabla, así que aquí solo ponemos los valores:
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text("Negativo: 0.0 - 0.04 mIU/mL", config.col3X, y);
  y += config.lineHeight;
  doc.text("Positivo: >= 0.04 mIU/mL", config.col3X, y);
  return y;
};

// --- Función para formatear fecha a DD/MM/YYYY ---
const toDDMMYYYY = (fecha) => {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha; // ya está en formato correcto
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

// --- Componente Principal ---
export default function pcuantiantigeno(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  const drawHeader = () => {
    CabeceraLogo(doc, { ...datos, tieneMembrete: false });
    
    // Número de Ficha
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);
    doc.setFont("helvetica", "bold").setFontSize(18);
    doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);
    
    // Sede
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 20);
    
    // Fecha de examen
    const fechaExamen = toDDMMYYYY(datos.fechaExamen || datos.fecha_examen || datos.fecha || "");
    doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);
    
    // Página
    doc.text("Pag. 01", pageW - 30, 10);

    // Bloque de color
    drawColorBox(doc, {
      color: datos.codigoColor || "#008f39",
      text: datos.textoColor || "F",
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });

    // Datos del paciente (debajo del logo)
    let dataY = 48;
    const patientDataX = config.margin;
    const lineHeight = 6;

    const drawPatientDataRow = (label, value) => {
      doc.setFontSize(11).setFont("helvetica", "bold");
      doc.text(label, patientDataX, dataY);
      doc.setFont("helvetica", "normal");
      const labelWidth = doc.getTextWidth(label);
      const extraSpace = label === "Apellidos y Nombres :" ? 8 : 2;
      doc.text(
        String(value || "").toUpperCase(),
        patientDataX + labelWidth + extraSpace,
        dataY
      );
      dataY += lineHeight;
    };

    drawPatientDataRow("Apellidos y Nombres :", datos.nombres);
    drawPatientDataRow("Edad :", datos.edad ? `${datos.edad} AÑOS` : "");
    drawPatientDataRow("DNI :", String(datos.dni || ""));
    doc.setFontSize(11).setFont("helvetica", "bold");
    const fechaLabel = "Fecha :";
    doc.text(fechaLabel, patientDataX, dataY);
    doc.setFont("helvetica", "normal");
    const fechaLabelWidth = doc.getTextWidth(fechaLabel);
    doc.text(fechaExamen, patientDataX + fechaLabelWidth + 2, dataY);
  };

  drawHeader();
  
  // === CUERPO ===
  let y = 75;

    // Título principal
    drawUnderlinedTitle(doc, "PRUEBA CUANTITATIVA DE ANTÍGENOS", y);
    y += config.lineHeight * 2;

    // Marca
    doc
      .setFont(config.font, "bold")
      .setFontSize(config.fontSize.body)
      .text("MARCA:", config.margin, y);
    doc
      .setFont(config.font, "normal")
      .text(String(datos.cboMarca || ""), config.margin + 25, y);
    y += config.lineHeight * 2;

    // Encabezados de tabla
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text("PRUEBA", config.col1X, y);
    doc.text("RESULTADOS", config.col2X, y);
    doc.text("VALORES DE REFERENCIA", config.col3X, y);
    y += 3;
    doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
    y += config.lineHeight;

    // Fila de resultado
    doc
      .setFont(config.font, "bold")
      .setFontSize(config.fontSize.body)
      .text("COVID-19 ANTÍGENO", config.col1X, y);
    doc
      .setFont(config.font, "normal")
      .text(String(datos.valorIgm || ""), config.col2X, y);

    // Valores de referencia (sin repetir el título)
    y = drawReferenceValues(doc, y);
    y += config.lineHeight * 2;

    // Resultado destacado
    doc.setFont(config.font, "bold").setFontSize(12);
    doc.text(String(datos.resultado || ""), config.margin, y);
    y += config.lineHeight * 2;

    // Observaciones o texto libre
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
    doc.text("Método: Inmunofluorescencia\nSensibilidad: 95.00%\nEspecificidad: 95.00%", config.margin, y, {
      maxWidth: pageW - 2 * config.margin,
    });

  // Firma y huella digital (centrado, sin cuadros, solo imágenes y textos)
  y += 13; // Subido 7mm para no chocar con el footer (original y += 20, ahora y += 13)
  const centroX = pageW / 2;
  const firmaY = y;
  
  // Obtener URLs de firma y huella
  const firmaUrl = getSign(datos, "FIRMAP");
  const huellaUrl = getSign(datos, "HUELLA");
  
  // Agregar firma del paciente (izquierda del centro)
  if (firmaUrl) {
    try {
      const imgWidth = 30;
      const imgHeight = 20;
      const x = centroX - 25; // A la izquierda del centro
      doc.addImage(firmaUrl, 'PNG', x, firmaY, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del paciente:", error);
    }
  }
  
  // Agregar huella del paciente (derecha de la firma)
  if (huellaUrl) {
    try {
      const imgWidth = 12;
      const imgHeight = 20;
      const x = centroX + 5; // A la derecha de la firma
      doc.addImage(huellaUrl, 'PNG', x, firmaY, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando huella del paciente:", error);
    }
  }
  
  // Línea de firma debajo de las imágenes
  const lineY = firmaY + 22;
  doc.setLineWidth(0.2);
  doc.line(centroX - 30, lineY, centroX + 30, lineY);
  
  // Texto "Firma y Huella del Paciente" centrado
  doc.setFont(config.font, "normal").setFontSize(9);
  doc.text("Firma y Huella del Paciente", centroX, lineY + 6, { align: "center" });
  
  // DNI debajo del texto
  if (datos.dni) {
    doc.setFont(config.font, "normal").setFontSize(8);
    doc.text("DNI:", centroX - 15, lineY + 12);
    doc.setFont(config.font, "bold").setFontSize(9);
    doc.text(String(datos.dni || ""), centroX - 8, lineY + 12);
  }

  // === FOOTER ===
  footerTR(doc, datos);

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
