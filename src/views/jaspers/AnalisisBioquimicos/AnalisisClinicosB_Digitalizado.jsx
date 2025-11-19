import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { getSign } from "../../utils/helpers.js";
import footerTR from '../components/footerTR.jsx';

//ACIDO URICO
const config = {
  margin: 15,
  fontSize: {
    title: 14,
    subtitle: 11,
    header: 11,
    body: 10,
  },
  lineHeight: {
    normal: 7,
    small: 5,
  },
  font: 'helvetica',
};

export default function AnalisisClinicosB_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  let y = 70;

  // ==== HEADER ====
  const drawHeader = () => {
    // Logo y membrete
    CabeceraLogo(doc, { tieneMembrete: false, yOffset: 12 });

    // Número de Ficha
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("Nro de ficha: ", pageW - 70, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(String(datos.norden || ""), pageW - 50, 16);

    // Sede
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + (datos.sede || ""), pageW - 70, 20);

    // Fecha de examen
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Fecha de examen: " + formatearFechaCorta(datos.fecha || ""), pageW - 70, 25);

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
  };

  drawHeader();

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("BIOQUÍMICA", pageW / 2, y, { align: "center" });
  y += config.lineHeight.normal * 1.5;

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.subtitle);
  doc.text(`MUESTRA :`, config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text(datos.txtMuestra || "SUERO", config.margin + 20, y);
  y += config.lineHeight.normal * 1.5;

  const tableCols = {
    col1: config.margin,
    col2: pageW / 2,
    col3: pageW - config.margin,
  };

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", tableCols.col1, y);
  doc.text("RESULTADO", tableCols.col2, y, { align: "center" });
  doc.text("VALORES NORMALES", tableCols.col3, y, { align: "right" });
  y += 3;
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight.normal;

  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text(datos.txtPrueba, tableCols.col1, y);
  doc.text(String(datos.txtResultado  || ''), tableCols.col2, y, { align: "center" });
  
  const valoresNormales = ["Mujeres : 2.5 - 6.8 mg/dl", "Hombres : 3.6 - 7.7 mg/dl"];
  let tempY = y;
  valoresNormales.forEach((line, index) => {
      doc.text(line, tableCols.col3, tempY, { align: "right" });
      if(index < valoresNormales.length - 1) {
          tempY += config.lineHeight.small;
      }
  });

  // Posiciona la fecha justo debajo de la sección "Valores Normales".
  const dateYPosition = tempY + config.lineHeight.normal * 2;
  // Mostrar la fecha en formato '01 de junio de 2025'
  let fechaFormateada = '';
  if (datos.fecha) {
    const date = new Date(`${datos.fecha}T00:00:00`);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();
    fechaFormateada = `${day} de ${month} de ${year}`;
  }
  doc.setFontSize(10).setFont(config.font, 'normal');
  doc.text(fechaFormateada, pageW - config.margin, dateYPosition, { align: 'right' });

  // === FIRMA CENTRADA ===
  const firmaY = dateYPosition + 55; // Bajada 20mm (de 25 a 45)
  const firmaMedicoUrl = getSign(datos, "SELLOFIRMA");
  
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 60;
      const imgHeight = 25;
      const x = (pageW - imgWidth) / 2; // Centrar horizontalmente
      doc.addImage(firmaMedicoUrl, 'PNG', x, firmaY, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }

  // El footer estándar con las firmas va al final de la página.
  footerTR(doc, { footerOffsetY: 10 });

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
} 