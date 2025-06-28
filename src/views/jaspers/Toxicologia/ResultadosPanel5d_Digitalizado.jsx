// src/views/jaspers/Toxicologia/Panel5d_Digitalizado.jsx
import jsPDF from "jspdf";
import header_Panel5d_Digitalizado from "./Header/header_Panel5d_Digitalizado";
import footer from "../components/footer";

// --- Configuración Centralizada ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 100,
  col3X: 170,
  fontSize: {
    title: 14,
    header: 11,
    body: 11,
  },
  font: 'helvetica',
  lineHeight: 8,
};

// --- Funciones de Ayuda ---

const drawUnderlinedTitle = (doc, text, y) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text(text, pageW / 2, y, { align: "center" });
};

const drawResultRow = (doc, y, label, result, units) => {
  doc.setFont(config.font, 'normal').setFontSize(config.fontSize.body);
  doc.text(label, config.col1X, y);
  doc.text(result, config.col2X, y, { align: "center" });
  doc.text(units, config.col3X, y, { align: "center" });
  return y + config.lineHeight;
};

// --- Componente Principal ---

export default function ResultadosPanel5d_Digitalizado(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  header_Panel5d_Digitalizado(doc, datos);
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
    let y = 80;

    // Título
    drawUnderlinedTitle(doc, "TOXICOLÓGICO", y);
    y += config.lineHeight * 1.5;

    // Muestra y Método
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
    doc.text("MUESTRA :", config.margin, y);
    doc.setFont(config.font, "normal");
    doc.text(datos.muestra || "ORINA", config.margin + 30, y);
    y += config.lineHeight;

    doc.setFont(config.font, "bold");
    doc.text("MÉTODO :", config.margin, y);
    doc.setFont(config.font, "normal");
    doc.text(datos.metodo || "INMUNOCROMATOGRÁFICO", config.margin + 30, y);
    y += config.lineHeight * 2;

    // Encabezado de tabla
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text("PRUEBA CUALITATIVO", config.col1X, y);
    doc.text("RESULTADOS", config.col2X, y, { align: 'center' });
    doc.text("UNIDADES", config.col3X, y, { align: 'center' });
    y += 3;

    // Línea
    doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
    y += config.lineHeight;

    // Título del Panel
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
    doc.text("PANEL DROGAS 5D", config.col1X, y);
    y += config.lineHeight;

    // Datos
    const tests = [
      { label: "Cocaína", key: "txtrCocaina" },
      { label: "Marihuana", key: "txtrMarihuana" },
      { label: "Anfetamina en Orina", key: "txtrAnfetamina" },
      { label: "Metanfetamina", key: "txtrMethanfetamina" },
      { label: "Benzodiacepina", key: "txtrBenzodiacepina" },
    ];
    
    tests.forEach(({ label, key }) => {
      const value = datos[key] != null ? datos[key] : "NEGATIVO";
      y = drawResultRow(doc, y, label, value.toUpperCase(), "S/U");
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
        const sigY = 210; // ⬅️ Aquí usas el Y actual + espacio deseado

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
        const sigX = (pageW - sigW) / 2 + 50; // Centrado horizontal
        const sigY = 210; // ⬅️ Aquí usas el Y actual + espacio deseado

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

    // === IMPRIMIR ===
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
