// src/views/jaspers/AnalisisBioquimicos/coprocultivo_digitalizado.jsx
import jsPDF from "jspdf";
import headerCoprocultivoDigitalizado from "./Header/headerCoprocultivoDigitalizado";
import footer from "../components/footer";

export default function Coprocultivo_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  
  // === HEADER ===
  headerCoprocultivoDigitalizado(doc, datos);
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

    // Empezamos debajo del header
    let y = 80;
    const xLeft = margin * 2;            // 30 mm
    const xValue = pageW - margin * 2;   // pageW - 30 mm

    // === TÍTULO ===
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.text("COPROCULTIVO", pageW / 2, y, { align: "center" });
    y += 12;

    // --- COPROCULTIVO – MUESTRA ---
    doc.setFont("helvetica", "bold").setFontSize(11);
    doc.text("COPROCULTIVO – MUESTRA", xLeft, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    [
      ["Muestra", datos.txtmuestra ? ":  "+ datos.txtmuestra.toUpperCase() : "Heces"],
      ["Color", datos.txtcolor ? ":  "+ datos.txtcolor.toUpperCase() : ""],
      ["Consistencia", datos.txtconsistencia ? ":  "+ datos.txtconsistencia.toUpperCase() : ""],
      ["Moco Fecal", datos.txtmoco_fecal ? ":  "+ datos.txtmoco_fecal.toUpperCase() : ""],
      ["Sangre Visible", datos.txtsangrev ? ":  "+ datos.txtsangrev.toUpperCase() : ""],
      ["Restos Alimenticios", datos.txtrestosa ? ":  "+ datos.txtrestosa.toUpperCase() : ""],
    ].forEach(([label, val]) => {
      doc.text(label, xLeft, y);
      doc.text(val, xLeft + 45, y, { align: "left" });
      y += 7;
    });

    // --- COPROCULTIVO – EXAMEN MICROSCÓPICO ---
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text("COPROCULTIVO – EXAMEN MICROSCÓPICO", xLeft, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    [
      ["Leucocitos", datos.txtleucocitos ? ":  " + datos.txtleucocitos.toUpperCase() : ""],
      ["Hematíes", datos.txthematies ? ":  " + datos.txthematies.toUpperCase() : ""],
      ["Parásitos", datos.txtparasitos ? ":  " + datos.txtparasitos.toUpperCase() : ""],
      ["Gotas de grasa", datos.txtgotasg ? ":  " + datos.txtgotasg.toUpperCase() : ""],
      ["Levaduras", datos.txtlevaduras ? ":  " + datos.txtlevaduras.toUpperCase() : ""],
    ].forEach(([label, val]) => {
      doc.text(label, xLeft, y);
      doc.text(val, xLeft + 45, y, { align: "left" });
      y += 7;
    });

    // --- COPROCULTIVO – IDENTIFICACIÓN Y ANTIBIOGRAMA ---
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text("COPROCULTIVO – IDENTIFICACIÓN Y ANTIBIOGRAMA", xLeft, y);
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
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text("Identificación :", xLeft, y);
    doc.text(datos.txtidentificacion || "", xLeft + 45, y, { align: "left" });
    y += 7;
    doc.text("Flora Coliforme :", xLeft, y);
    doc.text(datos.txtflorac || "", xLeft + 45, y, { align: "left" });
    y += 8;

    // Comentario
    doc.setFont("helvetica", "italic");
    doc.text("Comentario: (*) Pertenece a la flora normal", xLeft, y);
    y += 12;

    // --- COPROCULTIVO – RESULTADO ---
    doc.setFont("helvetica", "bold");
    doc.text("COPROCULTIVO – RESULTADO", xLeft, y-2);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text("Resultado :", xLeft, y-2);
    doc.text("", xValue, y-2, { align: "right" });
    y += 8;

    // Mensajes fijos de resultados
    doc.text(
      datos.txtobservaciones ||" ",
      xLeft,
      y-2
    );

    

    // === FOOTER ===
    footer(doc, datos);

    // === IMPRIMIR ===
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();

  })
  
}
