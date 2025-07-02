import jsPDF from "jspdf";
import header_PCualitativoAntigeno from "./header/header_PCualitativoAntigeno";
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

// --- Función de Título Subrayado ---
const drawUnderlinedTitle = (doc, text, y) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(config.font, "bold")
     .setFontSize(config.fontSize.title)
     .text(text, pageW / 2, y, { align: "center" });
  y += 2;
  doc.setLineWidth(0.5)
     .line(config.margin, y, pageW - config.margin, y);
};

// --- Componente Principal ---
export default function pcualitativaantigeno(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  header_PCualitativoAntigeno(doc, datos);

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
  let y = 90;  // <–– desplazado 10 puntos más abajo

  // 1) TÍTULO
  drawUnderlinedTitle(doc, "PRUEBA CUALITATIVA DE ANTÍGENOS", y);
  y += config.lineHeight * 2;

  // 2) MARCA
  doc.setFont(config.font, "bold")
     .setFontSize(config.fontSize.body)
     .text("MARCA:", config.margin, y);
  doc.setFont(config.font, "normal")
     .text(datos.cboMarca || "-", config.margin + 30, y);
  y += config.lineHeight * 2;

  // 3) ENCABEZADOS DE TABLA
  doc.setFont(config.font, "bold")
     .setFontSize(config.fontSize.header);
  doc.text("PRUEBA", config.col1X, y);
  doc.text("RESULTADOS", config.col2X, y);
  doc.text("VALORES DE REFERENCIA", config.col3X, y);
  y += 3;
  doc.setLineWidth(0.4)
     .line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // 4) FILA DE RESULTADO
  doc.setFont(config.font, "normal")
     .setFontSize(config.fontSize.body)
     .text("Antígenos virales SARS-CoV-2", config.col1X, y);

  const reactivo = datos.chkIgmReactivo === true;
  const textoResultado = reactivo ? "Reactivo" : "No reactivo";
  doc.text(textoResultado, config.col2X, y);

  const refLines = doc.splitTextToSize(
    datos.txtvrigm || "",
    pageW - config.col3X - config.margin
  );
  doc.text(refLines, config.col3X, y);

  y += Math.max(refLines.length, 1) * config.lineHeight + config.lineHeight;

  // 5) COMENTARIOS
  doc.setFont(config.font, "bold")
     .setFontSize(config.fontSize.body)
     .text("COMENTARIOS:", config.margin, y);
  y += config.lineHeight;

  const textoCom = reactivo
    ? "Presenta antígenos virales SARS-CoV-2"
    : "No presenta antígenos virales SARS-CoV-2";
  const comLines = doc.splitTextToSize(
    textoCom,
    pageW - 2 * config.margin
  );
  doc.setFont(config.font, "normal")
     .text(comLines, config.margin, y);
  y += comLines.length * config.lineHeight + config.lineHeight;

  // 6) SINTOMATOLOGÍA
  doc.setFont(config.font, "bold")
     .setFontSize(config.fontSize.body)
     .text("SINTOMATOLOGÍA", config.margin, y);
  y += config.lineHeight;

  const obs = datos.txtObservaciones;
  const sintoma = !obs || obs.trim() === ""
    ? "Paciente declara no tener síntomas"
    : `Paciente declara tener:\n\n${obs}`;
  const sintLines = doc.splitTextToSize(
    sintoma,
    pageW - 2 * config.margin
  );
  doc.setFont(config.font, "normal")
     .text(sintLines, config.margin, y);

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
      const sigY = y + 50;

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
      const sigY = y + 50;

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
  })

  
}
