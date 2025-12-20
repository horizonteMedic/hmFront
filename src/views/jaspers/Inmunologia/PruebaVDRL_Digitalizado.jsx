import jsPDF from "jspdf";
import headerVDRLDigitalizado from "./Header/header_VDRL_Digitalizado";
import footer from "../components/footer";

// --- Configuración Centralizada (Estándar Inmunología) ---
const config = {
  margin: 15,
  fontSize: {
    title: 14,
    header: 11,
    body: 11,
  },
  font: 'helvetica',
  lineHeight: 8, // Valor estandarizado
};

// --- Funciones de Ayuda (Estándar Inmunología) ---

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

// --- Componente Principal ---

export default async function PruebaVDRL_Digitalizado(datos) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  headerVDRLDigitalizado(doc, datos);

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

    let y = 90;

    // === TÍTULO ===
    drawUnderlinedTitle(doc, 'INMUNOLOGÍA', y);
    y += config.lineHeight * 2;

    // === MUESTRA Y MÉTODO ===
    doc.setFontSize(config.fontSize.header);
    doc.setFont(config.font, 'bold');
    doc.text('MUESTRA :', config.margin, y);
    doc.setFont(config.font, 'normal');
    doc.text('SUERO', config.margin + 25, y);
    y += config.lineHeight;

    doc.setFont(config.font, 'bold');
    doc.text('EXAMEN SOLICITADO :', config.margin, y);
    doc.setFont(config.font, 'normal');
    doc.text('VDRL', config.margin + 45, y);
    y += config.lineHeight * 2;

    // === ENCABEZADO DE TABLA ===
    doc.setFont(config.font, 'bold');
    doc.setFontSize(config.fontSize.header);
    doc.text('EXAMEN', config.margin, y);
    const resultColX = pageW / 2 + 40;
    doc.text('RESULTADO', resultColX, y, { align: 'left' });

    y += 3;
    doc.setLineWidth(0.3);
    doc.line(config.margin, y, pageW - config.margin, y);
    y += config.lineHeight;

    // === CUERPO DE TABLA ===
    // Examen VDRL
    doc.setFont(config.font, 'normal');
    doc.setFontSize(config.fontSize.body);
    doc.text('VDRL (Método: Aglutinación de lípidos complejos)', config.margin, y + 6);

    // Resultado
    doc.setFont(config.font, 'bold');
    doc.text(datos.txtResultado || 'NO REACTIVO', resultColX, y + 6, { align: 'left' });

    // === FIRMAS ===
    const imgW = 60, imgH = 25;
    const marginInterno = 40;
    if (s1 && s2) {
      // Dos firmas, una a la izquierda (normal) y otra a la derecha (más pequeña)
      // Primera firma (sello1) - tamaño normal
      const canvas1 = document.createElement('canvas');
      canvas1.width = s1.width;
      canvas1.height = s1.height;
      const ctx1 = canvas1.getContext('2d');
      ctx1.drawImage(s1, 0, 0);
      const selloBase64_1 = canvas1.toDataURL('image/png');
      const imgX1 = marginInterno;
      const imgY1 = 210;
      doc.addImage(selloBase64_1, 'PNG', imgX1, imgY1, imgW, imgH);

      // Segunda firma (sello2) - ancho y alto fijos
      const smallW = 30; // ancho fijo en mm
      const smallH = 25; // alto fijo en mm
      const canvas2 = document.createElement('canvas');
      canvas2.width = s2.width;
      canvas2.height = s2.height;
      const ctx2 = canvas2.getContext('2d');
      ctx2.drawImage(s2, 0, 0);
      const selloBase64_2 = canvas2.toDataURL('image/png');
      const imgX2 = pageW - marginInterno - smallW;
      const imgY2 = 210;
      doc.addImage(selloBase64_2, 'PNG', imgX2, imgY2, smallW, smallH);
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
      // Solo la segunda firma, centrada y con tamaño pequeño
      const smallW = 30;
      const smallH = 25;
      const canvas = document.createElement('canvas');
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const imgX = (pageW - smallW) / 2;
      const imgY = 210;
      doc.addImage(selloBase64, 'PNG', imgX, imgY, smallW, smallH);
    }

    // === FOOTER ===
    footer(doc, datos);

    // === Imprimir ===
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
