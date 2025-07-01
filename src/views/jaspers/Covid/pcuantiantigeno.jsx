import jsPDF from "jspdf";
import header_PCuantiAntigeno from "./header/header_PCuantiAntigeno";
import footer from "../components/footer";

// --- Configuración Centralizada ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 80,
  col3X: 140,
  fontSize: {
    title: 14,
    header: 11,
    body: 11,
  },
  font: "helvetica",
  lineHeight: 8,
};

// --- Funciones de Ayuda ---
const drawUnderlinedTitle = (doc, text, y) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc
    .setFont(config.font, "bold")
    .setFontSize(config.fontSize.title)
    .text(text, pageW / 2, y, { align: "center" });
};

const drawReferenceValues = (doc, y) => {
  // Ya imprimimos el encabezado en la tabla, así que aquí solo ponemos los valores:
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text("Negativo: 0.0 - 0.04 mIU/mL", config.col3X, y);
  y += config.lineHeight;
  doc.text("Positivo: >= 0.04 mIU/mL", config.col3X, y);
  return y;
};

// --- Componente Principal ---
export default function pcuantiantigeno(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  console.log("Datos recibidos:", datos);

  // === HEADER ===
  header_PCuantiAntigeno(doc, datos);
  const sello1 = datos.digitalizacion?.find(
    (d) => d.nombreDigitalizacion === "FIRMAP"
  );
  const sello2 = datos.digitalizacion?.find(
    (d) => d.nombreDigitalizacion === "HUELLA"
  );
  const isValidUrl = (url) => url && url !== "Sin registro";
  const loadImg = (src) =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous";
      img.onload = () => res(img);
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });
  Promise.all([
    isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
    isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
  ]).then(([s1, s2]) => {
    // === CUERPO ===
    let y = 80; // <-- lo subimos de 70 a 80 para bajarlo aún más

    // Título principal
    drawUnderlinedTitle(doc, "PRUEBA CUANTITATIVA DE ANTÍGENOS", y);
    y += config.lineHeight * 2;

    // Marca
    doc
      .setFont(config.font, "bold")
      .setFontSize(config.fontSize.body)
      .text("MARCA:", config.margin, y);
    doc
      .setFont(config.font, "normal")
      .text(String(datos.cboMarca || ""), config.margin + 25, y);
    y += config.lineHeight * 2;

    // Encabezados de tabla
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text("PRUEBA", config.col1X, y);
    doc.text("RESULTADOS", config.col2X, y);
    doc.text("VALORES DE REFERENCIA", config.col3X, y);
    y += 3;
    doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
    y += config.lineHeight;

    // Fila de resultado
    doc
      .setFont(config.font, "bold")
      .setFontSize(config.fontSize.body)
      .text("COVID-19 ANTÍGENO", config.col1X, y);
    doc
      .setFont(config.font, "normal")
      .text(String(datos.valorIgm || ""), config.col2X, y);

    // Valores de referencia (sin repetir el título)
    y = drawReferenceValues(doc, y);
    y += config.lineHeight * 2;

    // Resultado destacado
    doc.setFont(config.font, "bold").setFontSize(12);
    doc.text(String(datos.resultado || ""), config.margin, y);
    y += config.lineHeight * 2;

    // Observaciones o texto libre
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
    doc.text("Método: Inmunofluorescencia\nSensibilidad: 95.00%\nEspecificidad: 95.00%", config.margin, y, {
      maxWidth: pageW - 2 * config.margin,
    });

    if (s1) {
      const canvas = document.createElement("canvas");
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL("image/png");

      // Dimensiones del área del sello - Primera firma (más pequeña)
      const sigW = 60;
      const sigH = 35;
      const sigX = (pageW - 160) / 2;
      const sigY = y + 70;

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
      doc.addImage(selloBase64, "PNG", imgX, imgY, imgW, imgH);

      // Actualiza Y si después quieres seguir dibujando debajo
    }

    if (s2) {
      const canvas = document.createElement("canvas");
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL("image/png");

      // Dimensiones del área del sello - Segunda firma (más ancha)
      const sigW = 100;
      const sigH = 35;
      const sigX = (pageW - 160) / 2 + 60;
      const sigY = y + 70;

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
      doc.addImage(selloBase64, "PNG", imgX, imgY, imgW, imgH);

      // Actualiza Y si después quieres seguir dibujando debajo
    }

    // === FOOTER ===
    footer(doc, datos);

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
  });
}
