// src/views/jaspers/AnalisisBioquimicos/Coproparasitologico_Digitalizado.jsx
import jsPDF from "jspdf";
import headerManipuladores from "./Header/header_ParasitologiaSeriado_Digitalizado";
// import headerManipuladores from "./Header/headerManipuladores";
import footer from "../components/footer";

export default function Coproparasitologico_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const xLeft = margin * 2;
  const xRight = pageW - margin * 2;
  let y;

  // Definir columna para los datos
  const xDato = xLeft + 65;

  // HEADER
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

      // BODY
      y = 80;
      doc.setFont("helvetica", "bold").setFontSize(14);
      doc.text("COPROPARASITOLÓGICO", pageW / 2, y, { align: "center" });
      y += 12;

      // MUESTRA I
      doc.setFont("helvetica", "bold").setFontSize(11);
      doc.text("MUESTRA: HECES I", xLeft, y);
      y += 7;

      // EXAMEN MACROSCÓPICO I
      doc.setFont("helvetica", "bold");
      doc.text("EXAMEN MACROSCÓPICO I", xLeft, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      [
        ["COLOR", "txtcolor"],
        ["ASPECTO", "txtaspecto"],
        ["MOCO FECAL", "txtmocoFecal"],
        ["SANGRE VISIBLE", "txtsangrev"],
        ["RESTOS ALIMENTICIOS", "txtrestosa"],
        ["GRASA", "txtgrasa"]
      ].forEach(([lbl, key]) => {
        doc.text(lbl, xLeft, y);
        doc.text(":", xDato, y);
        doc.text(datos[key] || "", xDato + 4, y);
        y += 7;
      });

      // EXAMEN MICROSCÓPICO I
      y += 6;
      doc.setFont("helvetica", "bold");
      doc.text("EXAMEN MICROSCÓPICO I", xLeft, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      [
        ["LEUCOCITOS", "txtleucocitos"],
        ["HEMATÍES", "txthematies"],
        ["INVESTIGACIÓN DE PARÁSITOS", "txtlugol"]
      ].forEach(([lbl, key]) => {
        doc.text(lbl, xLeft, y);
        doc.text(":", xDato, y);
        doc.text(datos[key] || "", xDato + 4, y);
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

      // FOOTER
      footer(doc, datos);

      // PRINT
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => iframe.contentWindow.print();
  })
  
}
