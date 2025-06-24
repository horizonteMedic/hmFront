import jsPDF from "jspdf";
import headerMicrobiologia1Digitalizado from "./Header/header_Microbiologia1_Digitalizado";
import footer from "../components/footer";

// --- Configuración Centralizada ---
const config = {
  margin: 15,
  fontSize: {
    title: 14,
    header: 11,
    body: 11,
  },
  font: 'helvetica',
  lineHeight: 8,
};

// --- Funciones de Ayuda ---
const drawResultRow = (doc, y, label, value) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.text(label, config.margin, y);
  doc.text(value, pageW - config.margin, y, { align: "right" });
  return y + config.lineHeight;
};

const drawUnderlinedTitle = (doc, text, y, fontSize) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(config.font, "bold").setFontSize(fontSize);
  doc.text(text, pageW / 2, y, { align: "center" });
  const textWidth = doc.getTextWidth(text);
  const x = (pageW - textWidth) / 2;
  doc.setLineWidth(0.5);
  doc.line(x, y + 1.5, x + textWidth, y + 1.5);
  doc.setLineWidth(0.2);
};

export default function Microbiologia1_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();

  // HEADER
  headerMicrobiologia1Digitalizado(doc, datos);

  const sello1 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const sello2 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMADOCASIG");
  const isValidUrl = url => url && url !== "Sin registro";
  const loadImg = src =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'anonymous';
      img.onload = () => res(img);
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });
  Promise.all([
    isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
    isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
  ]).then(([s1, s2]) => {
    let y = 65;
    // TÍTULO
    drawUnderlinedTitle(doc, "MICROBIOLOGÍA", y, config.fontSize.title);
    y += config.lineHeight * 2;
    // MUESTRA
    doc.setFontSize(config.fontSize.header).setFont(config.font, "bold");
    doc.text("MUESTRA :", config.margin, y);
    doc.setFont(config.font, "normal");
    doc.text(datos.muestra || "ESPUTO", config.margin + 25, y);
    y += config.lineHeight * 2;
    // ENCABEZADO DE TABLA
    doc.setFont(config.font, "bold");
    doc.text("PRUEBA", config.margin, y);
    doc.text("RESULTADO", pageW - config.margin, y, { align: "right" });
    y += 4;
    doc.setLineWidth(0.5);
    doc.line(config.margin, y, pageW - config.margin, y);
    doc.setLineWidth(0.2);
    y += config.lineHeight;
    doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
    // DATOS DE PRUEBAS
    drawResultRow(
      doc,
      y,
      "EXAMEN DIRECTO (KOH)",
      datos.txtKoh ?? "N/A"
    );
    
    if (s1) {
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const sigW = 70;
      const sigH = 35;
      const sigX = 80;
      const sigY = 210;
      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;
      let imgW = s1.width;
      let imgH = s1.height;
      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1);
      imgW *= scale;
      imgH *= scale;
      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    }
    if (s2) {
      const canvas = document.createElement('canvas');
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const sigW = 70;
      const sigH = 35;
      const sigX = 130;
      const sigY = 210;
      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;
      let imgW = s2.width;
      let imgH = s2.height;
      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1);
      imgW *= scale;
      imgH *= scale;
      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    }
    footer(doc, datos);
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        alert("Error al intentar imprimir: " + e.message);
      }
    };
  });
}
