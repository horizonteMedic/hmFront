// // src/views/jaspers/AnalisisBioquimicos/CoproparasitologicoSeriado_Digitalizado.jsx
// import jsPDF from "jspdf";
// import headerManipuladores from "./Header/headerManipuladores";
// import footer from "../components/footer";

// export default function ParasitologiaSeriado_Digitalizado(datos = {}) {
//   const doc = new jsPDF({ unit: "mm", format: "letter" });
//   const pageW = doc.internal.pageSize.getWidth();
//   const margin = 15;
//   const xLeft = margin * 2;
//   const xRight = pageW - margin * 2;
//   let y;

//   // === PRIMERA PÁGINA (con header) ===
//   headerManipuladores(doc, datos);
//   y = 80;
//   doc.setFont("helvetica", "bold").setFontSize(14);
//   doc.text("COPROPARASITOLÓGICO SERIADO", pageW / 2, y, { align: "center" });
//   y += 12;

//   // MUESTRA I
//   doc.setFont("helvetica", "bold").setFontSize(11);
//   doc.text("MUESTRA: " + (datos.muestra1 || "HECES I"), xLeft, y);
//   y += 8;
//   doc.setFont("helvetica", "normal");
//   ["COLOR","ASPECTO","MOCO FECAL","GRASA","SANGRE VISIBLE","RESTOS ALIMENTICIOS"].forEach((lbl,i) => {
//     const key = ["txtcolor","txtaspecto","txtmocoFecal","txtgrasa","txtsangrev","txtrestosa"][i];
//     doc.text(lbl + " :", xLeft, y);
//     doc.text(datos[key] || "", xRight, y, { align: "right" });
//     y += 7;
//   });

//   // EXAMEN MICROSCÓPICO I
//   y += 6;
//   doc.setFont("helvetica", "bold").text("EXAMEN MICROSCÓPICO I", xLeft, y);
//   y += 6;
//   doc.setFont("helvetica", "normal");
//   ["LEUCOCITOS","HEMATÍES","INVESTIGACIÓN DE PARÁSITOS"].forEach((lbl,i) => {
//     const key = ["txtleucocitos","txthematies","txtlugol"][i];
//     doc.text(lbl + " :", xLeft, y);
//     doc.text(datos[key] || "", xRight, y, { align: "right" });
//     y += 7;
//   });

//   // MUESTRA II
//   y += 10;
//   doc.setFont("helvetica", "bold").text("MUESTRA: " + (datos.muestra2 || "HECES II"), xLeft, y);
//   y += 8;
//   doc.setFont("helvetica", "normal");
//   ["COLOR","ASPECTO","MOCO FECAL","GRASA","SANGRE VISIBLE","RESTOS ALIMENTICIOS"].forEach((lbl,i) => {
//     const key = ["txtcolor1","txtaspecto1","txtmocoFecal1","txtgrasa1","txtsangrev1","txtrestosa1"][i];
//     doc.text(lbl + " :", xLeft, y);
//     doc.text(datos[key] || "", xRight, y, { align: "right" });
//     y += 7;
//   });

//   // EXAMEN MICROSCÓPICO II
//   y += 6;
//   doc.setFont("helvetica", "bold").text("EXAMEN MICROSCÓPICO II", xLeft, y);
//   y += 6;
//   doc.setFont("helvetica", "normal");
//   ["LEUCOCITOS","HEMATÍES","INVESTIGACIÓN DE PARÁSITOS"].forEach((lbl,i) => {
//     const key = ["txtleucocitos1","txthematies1","txtlugol1"][i];
//     doc.text(lbl + " :", xLeft, y);
//     doc.text(datos[key] || "", xRight, y, { align: "right" });
//     y += 7;
//   });

//   // Footer de primera página
//   footer(doc, datos);

//   // === SEGUNDA PÁGINA (SIN header) ===
//   doc.addPage();
//   y = 80;
//   doc.setFont("helvetica", "bold").setFontSize(11);
//   doc.text("MUESTRA: " + (datos.muestra3 || "HECES III"), xLeft, y);
//   y += 8;
//   doc.setFont("helvetica", "normal");
//   ["COLOR","ASPECTO","MOCO FECAL","GRASA","SANGRE VISIBLE","RESTOS ALIMENTICIOS"].forEach((lbl,i) => {
//     const key = ["txtcolor2","txtaspecto2","txtmocoFecal2","txtgrasa2","txtsangrev2","txtrestosa2"][i];
//     doc.text(lbl + " :", xLeft, y);
//     doc.text(datos[key] || "", xRight, y, { align: "right" });
//     y += 7;
//   });
//   y += 6;
//   doc.setFont("helvetica", "bold").text("EXAMEN MICROSCÓPICO III", xLeft, y);
//   y += 6;
//   doc.setFont("helvetica", "normal");
//   ["LEUCOCITOS","HEMATÍES","INVESTIGACIÓN DE PARÁSITOS"].forEach((lbl,i) => {
//     const key = ["txtleucocitos2","txthematies2","txtlugol2"][i];
//     doc.text(lbl + " :", xLeft, y);
//     doc.text(datos[key] || "", xRight, y, { align: "right" });
//     y += 7;
//   });

//   // Footer de segunda página
//   footer(doc, datos);

//   // Imprimir
//   const pdfBlob = doc.output("blob");
//   const pdfUrl  = URL.createObjectURL(pdfBlob);
//   const iframe  = document.createElement("iframe");
//   iframe.style.display = "none";
//   iframe.src = pdfUrl;
//   document.body.appendChild(iframe);
//   iframe.onload = () => iframe.contentWindow.print();
// }

// src/views/jaspers/AnalisisBioquimicos/CoproparasitologicoSeriado_Digitalizado.jsx
import jsPDF from "jspdf";
import headerManipuladores from "./Header/headerManipuladores";
import footer from "../components/footer";

export default function ParasitologiaSeriado_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const xLeft = margin * 2;
  const xRight = pageW - margin * 2;
  let y;

  // === PRIMERA PÁGINA (con header) ===
  headerManipuladores(doc, datos);
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
  doc.text("MUESTRA: " + (datos.muestra1 || "HECES I"), xLeft, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  ["COLOR","ASPECTO","MOCO FECAL","GRASA","SANGRE VISIBLE","RESTOS ALIMENTICIOS"].forEach((lbl,i) => {
    const key = ["txtcolor","txtaspecto","txtmocoFecal","txtgrasa","txtsangrev","txtrestosa"][i];
    doc.text(lbl + " :", xLeft, y);
    doc.text(datos[key] || "", xRight, y, { align: "right" });
    y += 7;
  });

  // EXAMEN MICROSCÓPICO I
  y += 6;
  doc.setFont("helvetica", "bold").text("EXAMEN MICROSCÓPICO I", xLeft, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  ["LEUCOCITOS","HEMATÍES","INVESTIGACIÓN DE PARÁSITOS"].forEach((lbl,i) => {
    const key = ["txtleucocitos","txthematies","txtlugol"][i];
    doc.text(lbl + " :", xLeft, y);
    doc.text(datos[key] || "", xRight, y, { align: "right" });
    y += 7;
  });

  // MUESTRA II
  y += 10;
  doc.setFont("helvetica", "bold").text("MUESTRA: " + (datos.muestra2 || "HECES II"), xLeft, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  ["COLOR","ASPECTO","MOCO FECAL","GRASA","SANGRE VISIBLE","RESTOS ALIMENTICIOS"].forEach((lbl,i) => {
    const key = ["txtcolor1","txtaspecto1","txtmocoFecal1","txtgrasa1","txtsangrev1","txtrestosa1"][i];
    doc.text(lbl + " :", xLeft, y);
    doc.text(datos[key] || "", xRight, y, { align: "right" });
    y += 7;
  });

  // EXAMEN MICROSCÓPICO II
  y += 6;
  doc.setFont("helvetica", "bold").text("EXAMEN MICROSCÓPICO II", xLeft, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  ["LEUCOCITOS","HEMATÍES","INVESTIGACIÓN DE PARÁSITOS"].forEach((lbl,i) => {
    const key = ["txtleucocitos1","txthematies1","txtlugol1"][i];
    doc.text(lbl + " :", xLeft, y);
    doc.text(datos[key] || "", xRight, y, { align: "right" });
    y += 7;
  });
  

  // Footer de primera página
  footer(doc, datos);

  // === SEGUNDA PÁGINA (SIN header) ===
  doc.addPage();
  y = 80;
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
      const sigX = (pageW - sigW) / 2 + 60; // Centrado horizontal
      const sigY = y - 10; // ⬅️ Aquí usas el Y actual + espacio deseado

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
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("MUESTRA: " + (datos.muestra3 || "HECES III"), xLeft, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  ["COLOR","ASPECTO","MOCO FECAL","GRASA","SANGRE VISIBLE","RESTOS ALIMENTICIOS"].forEach((lbl,i) => {
    const key = ["txtcolor2","txtaspecto2","txtmocoFecal2","txtgrasa2","txtsangrev2","txtrestosa2"][i];
    doc.text(lbl + " :", xLeft, y);
    doc.text(datos[key] || "", xRight, y, { align: "right" });
    y += 7;
  });
  y += 6;
  doc.setFont("helvetica", "bold").text("EXAMEN MICROSCÓPICO III", xLeft, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  ["LEUCOCITOS","HEMATÍES","INVESTIGACIÓN DE PARÁSITOS"].forEach((lbl,i) => {
    const key = ["txtleucocitos2","txthematies2","txtlugol2"][i];
    doc.text(lbl + " :", xLeft, y);
    doc.text(datos[key] || "", xRight, y, { align: "right" });
    y += 7;
  });

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
