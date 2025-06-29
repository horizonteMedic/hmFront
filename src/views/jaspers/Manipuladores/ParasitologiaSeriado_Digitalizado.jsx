// src/views/jaspers/AnalisisBioquimicos/CoproparasitologicoSeriado_Digitalizado.jsx
import jsPDF from "jspdf";
import headerManipuladores from "./Header/header_ParasitologiaSeriado_Digitalizado";
import footer from "../components/footer";

export default function ParasitologiaSeriado_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const xLeft = margin * 2;
  const xRight = pageW - margin * 2;
  let y;

  // Definir columna para los datos
  const xDato = xLeft + 55;

  // === PRIMERA PÁGINA (con header) ===
  headerManipuladores(doc, datos, 0);
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

  y = 80;
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("COPROPARASITOLÓGICO SERIADO", pageW / 2, y, { align: "center" });
  y += 12;

  // MUESTRA I
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Muestra", xLeft, y);
  doc.setFont("helvetica", "normal");
  doc.text(":", xDato - 5, y);
  doc.text(datos.muestra1 || "MUESTRA FRESCA", xDato, y);
  y += 7;
  [
    ["Color", "txtcolor"],
    ["Consistencia", "txtaspecto"],
    ["Moco Fecal", "txtmocoFecal"],
    ["Grasa", "txtgrasa"],
    ["Sangre Visible", "txtsangrev"],
    ["Restos Alimenticios", "txtrestosa"]
  ].forEach(([lbl, key]) => {
    doc.text(lbl, xLeft, y);
    doc.text(":", xDato - 5, y);
    doc.text(datos[key] || "", xDato, y);
    y += 7;
  });

  // EXAMEN MICROSCÓPICO I
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Examen Microscópico I", xLeft, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  [
    ["Leucocitos", "txtleucocitos"],
    ["Hematíes", "txthematies"],
    ["Investigación de Parásitos", "txtlugol"]
  ].forEach(([lbl, key]) => {
    doc.text(lbl, xLeft, y);
    doc.text(":", xDato - 5, y);
    doc.text(datos[key] || "", xDato, y);
    y += 7;
  });

  // MUESTRA II
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Muestra", xLeft, y);
  doc.setFont("helvetica", "normal");
  doc.text(":", xDato - 5, y);
  doc.text(datos.muestra2 || "HECES II", xDato, y);
  y += 7;
  [
    ["Color", "txtcolor1"],
    ["Consistencia", "txtaspecto1"],
    ["Moco Fecal", "txtmocoFecal1"],
    ["Grasa", "txtgrasa1"],
    ["Sangre Visible", "txtsangrev1"],
    ["Restos Alimenticios", "txtrestosa1"]
  ].forEach(([lbl, key]) => {
    doc.text(lbl, xLeft, y);
    doc.text(":", xDato - 5, y);
    doc.text(datos[key] || "", xDato, y);
    y += 7;
  });

  // EXAMEN MICROSCÓPICO II
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Examen Microscópico II", xLeft, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  [
    ["Leucocitos", "txtleucocitos1"],
    ["Hematíes", "txthematies1"],
    ["Investigación de Parásitos", "txtlugol1"]
  ].forEach(([lbl, key]) => {
    doc.text(lbl, xLeft, y);
    doc.text(":", xDato - 5, y);
    doc.text(datos[key] || "", xDato, y);
    y += 7;
  });

  // === SEGUNDA PÁGINA (SIN header) ===
  doc.addPage();
  y = 20;
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Muestra", xLeft, y);
  doc.setFont("helvetica", "normal");
  doc.text(":", xDato - 5, y);
  doc.text(datos.muestra3 || "HECES III", xDato, y);
  y += 7;
  [
    ["Color", "txtcolor2"],
    ["Consistencia", "txtaspecto2"],
    ["Moco Fecal", "txtmocoFecal2"],
    ["Grasa", "txtgrasa2"],
    ["Sangre Visible", "txtsangrev2"],
    ["Restos Alimenticios", "txtrestosa2"]
  ].forEach(([lbl, key]) => {
    doc.text(lbl, xLeft, y);
    doc.text(":", xDato - 5, y);
    doc.text(datos[key] || "", xDato, y);
    y += 7;
  });
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Examen Microscópico III", xLeft, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  [
    ["Leucocitos", "txtleucocitos2"],
    ["Hematíes", "txthematies2"],
    ["Investigación de Parásitos", "txtlugol2"]
  ].forEach(([lbl, key]) => {
    doc.text(lbl, xLeft, y);
    doc.text(":", xDato - 5, y);
    doc.text(datos[key] || "", xDato, y);
    y += 7;
  });

  // Firma (sello) centrada justo después del contenido
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
    const sigX = (pageW - sigW) / 2;
    const sigY = y + 5;
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
    y = imgY + imgH + 5;
  }

  // Footer de segunda página
  footer(doc, datos);

  // Imprimir
  const pdfBlob = doc.output("blob");
  const pdfUrl  = URL.createObjectURL(pdfBlob);
  const iframe  = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
  });
 
}
