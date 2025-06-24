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
    doc.text(test.ref, cols.col3, y, { align: "right" });
    return y + config.lineHeight.normal;
  } else if (Array.isArray(test.ref)) {
    let tempY = y;
    test.ref.forEach((line, index) => {
      // Divide la línea en parte de etiqueta y parte de valor para alinearlas
      const parts = line.split(/(Hasta .*|10 - 50 U\/L|8 - 35 U\/L)/);
      const labelPart = parts[0] || '';
      const valuePart = parts[1] || '';
      const textRightAligned = labelPart.trim() + " " + valuePart.trim();

      doc.text(textRightAligned, cols.col3, tempY, { align: "right" });
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
      col2: pageW / 2,
      col3: pageW - config.margin,
    };

    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text("PRUEBA", tableCols.col1, y);
    doc.text("RESULTADO", tableCols.col2, y, { align: "center" });
    doc.text("RANGO REFERENCIAL", tableCols.col3, y, { align: "right" });
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
      const sigX = 80; // o cualquier X deseado
      const sigY = y + 20; // ⬅️ Aquí usas el Y actual + espacio deseado

      // Tamaño máximo dentro del área
      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;

      let imgW = s1.width;
      let imgH = s1.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1); // para no escalar de más

      imgW *= scale;
      imgH *= scale;

      // Centramos dentro del rectángulo
      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;

      // Dibujar el borde si quieres

      // Insertar la imagen del sello
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);

      // Actualiza Y si después quieres seguir dibujando debajo
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
      const sigX = 130; // o cualquier X deseado
      const sigY = y + 20; // ⬅️ Aquí usas el Y actual + espacio deseado

      // Tamaño máximo dentro del área
      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;

      let imgW = s2.width;
      let imgH = s2.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1); // para no escalar de más

      imgW *= scale;
      imgH *= scale;

      // Centramos dentro del rectángulo
      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;

      // Dibujar el borde si quieres

      // Insertar la imagen del sello
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);

      // Actualiza Y si después quieres seguir dibujando debajo
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
