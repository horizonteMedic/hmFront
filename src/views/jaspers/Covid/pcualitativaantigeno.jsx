import jsPDF from "jspdf";
import header_PCualitativoAntigeno from "./header/header_PCualitativoAntigeno";
import footer from "../components/footer";

// --- Configuración Centralizada ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 85,
  col3X: 140,
  fontSize: {
    title: 13,
    subtitle: 12,
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
  let y = 80;
  // TÍTULO alineado a la izquierda
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("PRUEBA CUALITATIVA DE ANTIGENOS", config.margin, y);
  y += config.lineHeight + 2;

  // MARCA debajo del título
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.subtitle);
  doc.text(`MARCA: ${datos.cboMarca || '-'}`, config.margin, y);
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
     .text("SINTOMATOLOGIA", config.margin, y);
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
  y += sintLines.length * config.lineHeight + config.lineHeight * 2;

  // Firma y huella digital (idéntico a Marsa)
  doc.setLineWidth(0.2);
  const firmaW = 60;
  const firmaH = 18;
  const huellaW = 30;
  const huellaH = 30;
  const gap = 18;
  const totalBlockW = firmaW + gap + huellaW;
  const startX = pageW - config.margin - totalBlockW;
  // Offset solo para la línea y DNI
  const blockYOffset = 20;
  const blockY = y + blockYOffset;
  // Línea de firma (más larga)
  const lineY = blockY + 8;
  doc.line(startX, lineY, startX + firmaW, lineY);
  // 'DNI:' alineado a la izquierda debajo de la línea
  const dniY = lineY + 8;
  doc.setFont(config.font, "normal").setFontSize(10);
  doc.text("DNI :", startX, dniY);
  // Número de DNI en negrita y subrayado con puntos
  if (datos.dni) {
    doc.setFont(config.font, "bold").setFontSize(11);
    const dniNumX = startX + 18;
    doc.text(`${datos.dni}`, dniNumX, dniY);
    // Subrayado con puntos
    const dniWidth = doc.getTextWidth(`${datos.dni}`);
    const dots = ".".repeat(22);
    doc.setFont(config.font, "normal").setFontSize(10);
    doc.text(dots, dniNumX + dniWidth + 2, dniY + 0.5);
  }
  // HUELLA DIGITAL (derecha, sin offset)
  const huellaX = startX + firmaW + gap;
  doc.rect(huellaX, y, huellaW, huellaH); // Cuadro
  doc.setFont(config.font, "normal").setFontSize(11);
  doc.text("Huella Digital", huellaX + huellaW / 2, y + huellaH + 6, { align: "center" });

  // Firma
  if (s1) {
    const canvas = document.createElement("canvas");
    canvas.width = s1.width;
    canvas.height = s1.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(s1, 0, 0);
    const selloBase64 = canvas.toDataURL("image/png");
    // Área del rectángulo donde irá la firma
    const sigX = startX;
    const sigY = y;
    const sigW = firmaW;
    const sigH = firmaH;
    const maxImgW = sigW - 4;
    const maxImgH = sigH - 4;
    let imgW = s1.width;
    let imgH = s1.height;
    const scaleW = maxImgW / imgW;
    const scaleH = maxImgH / imgH;
    const scale = Math.min(scaleW, scaleH, 1);
    imgW *= scale;
    imgH *= scale;
    const imgX = sigX + (sigW - imgW) / 2;
    const imgY = sigY + (sigH - imgH) / 2;
    doc.addImage(selloBase64, "PNG", imgX, imgY, imgW, imgH);
  }
  // Huella
  if (s2) {
    const canvas = document.createElement("canvas");
    canvas.width = s2.width;
    canvas.height = s2.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(s2, 0, 0);
    const selloBase64 = canvas.toDataURL("image/png");
    const sigX = startX + firmaW + gap;
    const sigY = y;
    const sigW = huellaW;
    const sigH = huellaH;
    const maxImgW = sigW - 4;
    const maxImgH = sigH - 4;
    let imgW = s2.width;
    let imgH = s2.height;
    const scaleW = maxImgW / imgW;
    const scaleH = maxImgH / imgH;
    const scale = Math.min(scaleW, scaleH, 1);
    imgW *= scale;
    imgH *= scale;
    const imgX = sigX + (sigW - imgW) / 2;
    const imgY = sigY + (sigH - imgH) / 2;
    doc.addImage(selloBase64, "PNG", imgX, imgY, imgW, imgH);
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
