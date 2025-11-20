// src/views/jaspers/Microbiologia/InmunologiaAglutinacion_Digitalizado.jsx
import jsPDF from "jspdf";
import header_InmunologiaLab_Digitalizado from "./Header/header_InmunologiaLab_Digitalizado";
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
};

const drawResultRow = (doc, y, label, value) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(config.font, 'normal').setFontSize(config.fontSize.body);
  doc.text(label, config.margin, y);
  doc.text(value, pageW - config.margin, y, { align: "right" });
  return y + config.lineHeight;
};

// --- Componente Principal ---

export default function InmunologiaLab_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  header_InmunologiaLab_Digitalizado(doc, datos);
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


    // === CUERPO ===
    let y = 90;

    // Título
    drawUnderlinedTitle(doc, "INMUNOLOGÍA", y);
    y += config.lineHeight * 1.5;

    // Muestra y Método
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
    doc.text("MUESTRA :", config.margin, y);
    doc.setFont(config.font, "normal");
    doc.text(datos.muestra || "SUERO", config.margin + 30, y);
    y += config.lineHeight;

    doc.setFont(config.font, "bold");
    doc.text("MÉTODO:", config.margin, y);
    doc.setFont(config.font, "normal");
    doc.text(
      datos.metodo || "AGLUTINACIÓN EN LÁMINA PORTAOBJETO",
      config.margin + 30,
      y
    );
    y += config.lineHeight * 2;

    // Encabezado de tabla
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    const colW = 60;
    const col1X = config.margin;
    const col2X = (pageW / 2) + colW;
    doc.text("PRUEBA CUALITATIVO", col1X, y);
    doc.text("RESULTADOS", col2X, y, { align: "center" });
    y += 3;
    // Línea
    doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
    y += config.lineHeight;
    // Datos
    const testsAglu = [
      { label: "TIFICO O", key: "txtTificoO" },
      { label: "TIFICO H", key: "txtTificoH" },
      { label: "PARATIFICO A", key: "txtParatificoA" },
      { label: "PARATIFICO B", key: "txtParatificoB" },
      { label: "Brucella abortus", key: "txtBrucella" },
    ];
    doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
    testsAglu.forEach(({ label, key }) => {
      const value = datos[key] != null ? datos[key] : "N/A";
      doc.text(label, col1X, y);
      doc.text(value, col2X, y, { align: "center" });
      y += config.lineHeight;
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
      const sigX = (pageW - sigW) / 2; // Centrado horizontal
      const sigY = 190; // Más arriba

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
      const sigX = (pageW - sigW) / 2; // Centrado horizontal
      const sigY = 190; // Más arriba

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

    // === FOOTER ===
    footer(doc, datos);

    // === Imprimir ===
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
  })
  
}
