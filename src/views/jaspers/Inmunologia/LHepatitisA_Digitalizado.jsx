import jsPDF from "jspdf";
import headerHepatitisDigitalizado from "./Header/header_Hepatitis_Digitalizado";
import footer from "../components/footer";

// --- Configuración Centralizada (Estándar) ---
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

// --- Funciones de Ayuda (Estándar) ---

const drawUnderlinedTitle = (doc, text, y) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text(text, pageW / 2, y, { align: "center" });
  const textWidth = doc.getTextWidth(text);
  const x = (pageW - textWidth) / 2;
  doc.setLineWidth(0.5);
  doc.line(x, y + 1.5, x + textWidth, y + 1.5);
  doc.setLineWidth(0.2); // Reset
};

const drawResultRow = (doc, y, label, value) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(config.font, 'normal').setFontSize(config.fontSize.body);
  doc.text(label, config.margin, y);
  doc.text(value, pageW - config.margin, y, { align: "right" });
  return y + config.lineHeight;
};

// --- Componente Principal ---

export default function LHepatitisA_Digitalizado(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  headerHepatitisDigitalizado(doc, datos);
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

  let y = 90;

  Promise.all([
    isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
    isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
  ]).then(([s1, s2]) => {


    // === TÍTULO ===
    drawUnderlinedTitle(doc, 'INMUNOLOGÍA', y);
    y += config.lineHeight * 2;
    
    // === MUESTRA Y MÉTODO ===
    doc.setFontSize(config.fontSize.header);
    doc.setFont(config.font, 'bold');
    doc.text('MUESTRA :', config.margin, y);
    doc.setFont(config.font, 'normal');
    doc.text('SUERO', config.margin + 30, y);
    y += config.lineHeight;

    doc.setFont(config.font, 'bold');
    doc.text('MÉTODO :', config.margin, y);
    doc.setFont(config.font, 'normal');
    doc.text('INMUNOENSAYO CROMATOGRÁFICO', config.margin + 30, y);
    y += config.lineHeight * 2;

    // === ENCABEZADO DE TABLA ===
    doc.setFont(config.font, 'bold');
    doc.text('PRUEBA CUALITATIVO', config.margin, y);
    const resultColX = pageW / 2 + 40;
    doc.text('RESULTADO', resultColX, y, { align: 'left' });
    
    y += 3;
    doc.setLineWidth(0.3);
    doc.line(config.margin, y, pageW - config.margin, y);
    y += config.lineHeight;

    // === CUERPO DE TABLA ===
    doc.setFont(config.font, 'normal');
    doc.text('HEPATITIS A (HAV) - RAPID TEST - MONTEST', config.margin, y);
    doc.text(datos.txtHepatitisa || '', resultColX, y, { align: 'left' });

    const imgW = 60, imgH = 25;
    const marginInterno = 10;
    if (s1 && s2) {
      // Dos firmas, una a la izquierda y otra a la derecha
      const addSello = (img, left) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const selloBase64 = canvas.toDataURL('image/png');
        const imgX = left ? marginInterno : pageW - marginInterno - imgW;
        const imgY = 210;
        doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
      };
      addSello(s1, true);
      addSello(s2, false);
    } else if (s1) {
      // Solo una firma, centrada
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const imgX = (pageW - imgW) / 2;
      const imgY = 210;
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    } else if (s2) {
      // Solo la segunda firma, centrada
      const canvas = document.createElement('canvas');
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const imgX = (pageW - imgW) / 2;
      const imgY = 210;
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    }

    // === FOOTER ===
    footer(doc, datos);

    // === IMPRIMIR ===
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);
    iframe.onload = function () {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    };
  })
} 