// src/views/jaspers/AnalisisBioquimicos/PerfilHepatico_Digitalizado.jsx
import jsPDF from "jspdf";
import headerPerfilHepatico from "./Header/headerPerfilHepatico";
import footer from "../components/footer";

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

const drawRow = (doc, y, test, datos, cols) => {
  doc.setFont(config.font, 'normal').setFontSize(config.fontSize.body);
  doc.text(test.label, cols.col1, y);
  
  const result = datos[test.key] != null ? String(datos[test.key]) : "0";
  doc.text(result, cols.col2, y, { align: "center" });

  if (typeof test.ref === "string") {
    doc.text(test.ref, cols.col3, y, { align: "left" });
    return y + config.lineHeight.normal;
  } else if (Array.isArray(test.ref)) {
    let tempY = y;
    test.ref.forEach((line, index) => {
      // Divide la línea en parte de etiqueta y parte de valor para alinearlas
      const parts = line.split(/(Hasta .*|10 - 50 U\/L|8 - 35 U\/L)/);
      const labelPart = parts[0] || '';
      const valuePart = parts[1] || '';
      const textRightAligned = labelPart.trim() + " " + valuePart.trim();

      doc.text(textRightAligned, cols.col3, tempY, { align: "left" });
      if (index < test.ref.length - 1) {
        tempY += config.lineHeight.small;
      }
    });
    // Devuelve la posición Y más baja alcanzada, más un pequeño espacio, 
    // o la altura de línea normal, lo que sea mayor, para evitar solapamientos.
    return Math.max(y + config.lineHeight.normal, tempY + config.lineHeight.small + 2);
  }
  return y + config.lineHeight.normal;
};

export default function PerfilHepatico_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();

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

    let y = 70; // Posición inicial después del header

    headerPerfilHepatico(doc, datos);

    doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
    doc.text("BIOQUÍMICA", pageW / 2, y, { align: "center" });
    y += config.lineHeight.normal * 1.5;

    doc.setFont(config.font, "bold").setFontSize(config.fontSize.subtitle);
    doc.text(`MUESTRA: ${datos.muestra || "SUERO"}`, config.margin, y);
    y += config.lineHeight.normal;
    doc.text("PERFIL HEPÁTICO", config.margin, y);
    y += config.lineHeight.normal * 1.5;

    const tableCols = {
      col1: config.margin,
      col2: 100,
      col3: 135,
    };

    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text("PRUEBA", tableCols.col1, y);
    doc.text("RESULTADO", tableCols.col2, y, { align: "center" });
    doc.text("RANGO REFERENCIAL", tableCols.col3, y, { align: "left" });
    y += 3;
    doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
    y += config.lineHeight.normal;

    const tests = [
      { label: "FOSFATASA ALCALINA", key: "txtrFosfalcalina", ref: "Hasta 300 U/L" },
      { label: "GGT", key: "txtrGgt", ref: ["Hombres  10 - 50 U/L", "Mujeres  8 - 35 U/L"] },
      { label: "TGP", key: "txtrTgp", ref: ["Hombres  Hasta 40 U/L", "Mujeres  Hasta 35 U/L"] },
      { label: "TGO", key: "txtrTgo", ref: "Hasta 31 U/L" },
      { label: "BILIRRUBINA TOTAL", key: "txtrBilirrTotal", ref: "0.2 - 1.20 mg/dL" },
      { label: "BILIRRUBINA DIRECTA", key: "txtrBilirrDirecta", ref: "Hasta 0.25 mg/dL" },
      { label: "BILIRRUBINA INDIRECTA", key: "txtrBilirrIndirecta", ref: "0.1 - 1 mg/dL" },
      { label: "PROTEÍNAS TOTALES", key: "txtrProteTotales", ref: "6.6 - 8.3 g/dL" },
      { label: "ALBÚMINA", key: "txtrAlbumina", ref: "3.5 - 5.5 g/dL" },
      { label: "GLOBULINA SÉRICA", key: "txtrGlobulina", ref: "2.3 - 3.5 g/dL" },
    ];

    tests.forEach(test => {
      y = drawRow(doc, y, test, datos, tableCols);
    });

    // Dimensiones fijas del área del sello
    const imgW = 60; // ancho fijo en mm
    const imgH = 25; // alto fijo en mm
    const sigY = y + 20;
    const firmaMargin = 40; // margen lateral personalizado para juntar más las firmas

    if (s1 && !s2) {
      // Solo un sello, centrado
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');

      // Centrado horizontal
      const imgX = (pageW - imgW) / 2;
      const imgY = sigY;
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    } else if (s1 && s2) {
      // Dos sellos, uno a la izquierda (normal) y otro a la derecha (más pequeño)
      // Primera firma (sello1) - tamaño normal
      const canvas1 = document.createElement('canvas');
      canvas1.width = s1.width;
      canvas1.height = s1.height;
      const ctx1 = canvas1.getContext('2d');
      ctx1.drawImage(s1, 0, 0);
      const selloBase64_1 = canvas1.toDataURL('image/png');
      const imgX1 = firmaMargin;
      const imgY1 = sigY;
      doc.addImage(selloBase64_1, 'PNG', imgX1, imgY1, imgW, imgH);

      // Segunda firma (sello2) - ancho y alto fijos en mm
      const smallW = 30; // ancho fijo en mm
      const smallH = 25; // alto fijo en mm
      const canvas2 = document.createElement('canvas');
      canvas2.width = s2.width;
      canvas2.height = s2.height;
      const ctx2 = canvas2.getContext('2d');
      ctx2.drawImage(s2, 0, 0);
      const selloBase64_2 = canvas2.toDataURL('image/png');
      const imgX2 = pageW - firmaMargin - smallW;
      const imgY2 = sigY + (imgH - smallH) / 2;
      doc.addImage(selloBase64_2, 'PNG', imgX2, imgY2, smallW, smallH);
    }

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
  })

  
}
