import jsPDF from "jspdf";
import footer from "../components/footer";
import header_Perfil_Renal_Digitalizado from "./Header/header_Perfil_Renal_Digitalizado";

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

export default function LBioquimica_Digitalizado(datos) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  header_Perfil_Renal_Digitalizado(doc, datos);

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

    let y = 83;

    doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
    doc.text('BIOQUÍMICA', pageW / 2, y, { align: 'center' });
    y += config.lineHeight.normal * 1.5;

    doc.setFont(config.font, "bold").setFontSize(config.fontSize.subtitle);
    doc.text('MUESTRA : SUERO', config.margin, y);
    y += config.lineHeight.normal * 1.5;

    const tableCols = {
      col1: config.margin,
      col2: 100,
      col3: 135,
    };

    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text('PRUEBA', tableCols.col1, y);
    doc.text('RESULTADO', tableCols.col2, y, { align: 'center' });
    doc.text('VALORES NORMALES', tableCols.col3, y, { align: 'left' });
    y += 3;
    doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
    y += config.lineHeight.normal;

    const dataRows = [
      {
        prueba: 'CREATININA SÉRICA',
        resultado: datos.txtCreatinina  || '',
        normales: 'Adulto: 0.8 - 1.4 mg/dl\nNiño: 0.24 - 0.84 mg/dl'
      },
      {
        prueba: 'UREA SÉRICA',
        resultado: datos.txtUreaSerica || '',
        normales: '10 - 50 mg/dl'
      },
      {
        prueba: 'ÁCIDO ÚRICO SÉRICO',
        resultado: datos.txtAcidoUrico  || '',
        normales: 'Mujeres: 2.5 - 6.8 mg/dl\nHombres 3.6 - 7.7 mg/dl'
      }
    ];

    doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
    dataRows.forEach(row => {
      // Prueba
      doc.text(row.prueba, tableCols.col1, y);
      // Resultado centrado
      doc.text(String(row.resultado), tableCols.col2, y, { align: 'center' });
      // Valores normales (puede ser multilinea)
      const normalesLines = String(row.normales).split('\n');
      normalesLines.forEach((line, idx) => {
        doc.text(line, tableCols.col3, y + idx * config.lineHeight.small, { align: 'left' });
      });
      // Ajusta y para la siguiente fila
      y += Math.max(config.lineHeight.normal, normalesLines.length * config.lineHeight.small + 2);
    });

    // Dimensiones fijas del área del sello
    const imgW = 60; // ancho fijo en mm
    const imgH = 25; // alto fijo en mm
    const sigY = y + 20;
    const firmaMargin = 40; // margen lateral personalizado para juntar más las firmas

    if (s1) {
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');

      // Dimensiones del área del sello
      const sigW = 70;
      const sigH = 35;
      const sigX = (pageW - sigW) / 2; // Centrado horizontal
      const sigY = y + 20;

      // Tamaño máximo dentro del área
      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;

      let imgW = s1.width;
      let imgH = s1.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1);

      imgW *= scale;
      imgH *= scale;

      // Centramos dentro del rectángulo
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

      // Dimensiones del área del sello
      const sigW = 70;
      const sigH = 35;
      const sigX = (pageW - sigW) / 2 + 70; // Centrado horizontal
      const sigY = y + 20;

      // Tamaño máximo dentro del área
      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;

      let imgW = s2.width;
      let imgH = s2.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1);

      imgW *= scale;
      imgH *= scale;

      // Centramos dentro del rectángulo
      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;

      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    }

    footer(doc, datos, y);
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
  });
} 