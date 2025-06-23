import jsPDF from "jspdf";
import header_Acido_Urico_Digitalizado from "./Header/header_Acido_Urico_Digitalizado";
import footer from "../components/footer";
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

const formatDateForFooter = (dateString) => {
    if (!dateString) return 'Trujillo';
    const date = new Date(`${dateString}T00:00:00`);
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
    const formattedDate = date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    return `Trujillo, ${dayName} ${formattedDate}`;
};


export default function AnalisisClinicosB_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  let y = 70;

  header_Acido_Urico_Digitalizado(doc, datos);

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
  doc.text(String(datos.txtResultado + ' mg/dL' || ''), tableCols.col2, y, { align: "center" });
  
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
  const footerDate = String(datos.fecha);
  doc.setFontSize(10).setFont(config.font, 'normal');
  doc.text(footerDate, pageW - config.margin, dateYPosition, { align: 'right' });

  // El footer estándar con las firmas va al final de la página.
  footer(doc, datos);

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