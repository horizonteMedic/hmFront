import jsPDF from "jspdf";
import header_PCualitativoAntigenoMarsa from "./header/header_PCualitativoAntigenoMarsa";
import footer from "../components/footer";

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

export default function pcualitativaantigenoMarsa(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  header_PCualitativoAntigenoMarsa(doc, datos);

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
  let y = 90;
  // Título
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  // Bajo el título y MARCA un poco más
  y = 80;
  doc.text("PRUEBA CUALITATIVA DE ANTIGENOS", config.margin, y);
  y += config.lineHeight + 2;

  // MARCA
  const marca = datos.marca || "Test";
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.subtitle);
  doc.text(`MARCA: ${marca}`, config.margin, y);
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
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text("Antigenos virales SARS-CoV-2", config.col1X, y);
  doc.setFont(config.font, "bold");
  doc.text("REACTIVO", config.col2X, y);
  doc.setFont(config.font, "normal");
  const refLines = [
    "Metodo: Inmunocromatografia",
    "SENSIBILIDAD: 94.55%",
    "ESPECIFICIDAD: 100%"
  ];
  refLines.forEach((line, i) => {
    doc.text(line, config.col3X, y + i * config.lineHeight);
  });
  y += Math.max(refLines.length, 1) * config.lineHeight + config.lineHeight;

  // Subo la sección de comentarios y lo que sigue
  y -= 15;

  // Comentarios
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("COMENTARIOS:", config.margin, y);
  y += config.lineHeight;
  doc.setFont(config.font, "normal");
  doc.text("Presenta antigenos virales SARS-CoV-2", config.margin, y);
  y += config.lineHeight * 2;

  // Sintomatología
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("SINTOMATOLOGIA", config.margin, y);
  y += config.lineHeight;
  doc.setFont(config.font, "normal");
  doc.text("Paciente declara tener desde", config.margin, y);
  y += config.lineHeight;
  // Lista de síntomas
  const sintomas = [
    "- Dolor de garganta",
    "- Congestion nasal",
    "- Dificultad respiratoria"
  ];
  sintomas.forEach(s => {
    doc.text(s, config.margin, y);
    y += config.lineHeight;
  });
  y += config.lineHeight;
  doc.text("Firmo en conformidad de lo anteriormente declarado.", config.margin, y);
  y += config.lineHeight * 2;

  // Firma y huella digital (solo baja la línea y DNI, huella queda igual)
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

  // Footer
  footer(doc, datos);

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
  })
}
