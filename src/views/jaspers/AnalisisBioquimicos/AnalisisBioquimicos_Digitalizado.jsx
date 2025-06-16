// src/views/jaspers/AnalisisBioquimicos/AnalisisBioquimicos_Digitalizado.jsx
import jsPDF from "jspdf";
import headerAnalisisBioquimicos from "./Header/headerAnalisisBioquimicos";
import footer from "../components/footer";

export default function AnalisisBioquimicos_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  console.log(datos)
  // ==== HEADER ====
  headerAnalisisBioquimicos(doc, datos);
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
  ])
   .then(([sello1, sello2]) => {
    console.log(sello1)
    console.log(sello2)
    // ==== TÍTULOS ====
    let y = 50;  // <-- antes era 40, ahora bajamos todo 10 mm más
    doc.setFont("helvetica", "bold").setFontSize(16);
    doc.text("LABORATORIO CLÍNICO", pageW / 2, y, { align: "center" });
    y += 8;
    doc.setFontSize(14);
    doc.text("ANÁLISIS BIOQUÍMICOS", pageW / 2, y, { align: "center" });
    const titleW = doc.getTextWidth("ANÁLISIS BIOQUÍMICOS");
    doc.setLineWidth(0.5);
    doc.line((pageW - titleW) / 2, y + 1.5, (pageW + titleW) / 2, y + 1.5);
    y += 12;

    // ==== TABLA ====
    const tests = [
      { label: "CREATININA", key: "txtCreatinina", range: "(V.N. 0.8 - 1.4 mg/dl)" },
      { label: "COLESTEROL TOTAL", key: "txtColesterol", range: "(V.N. < 200 mg/dl)" },
      { label: "L.D.L. COLESTEROL", key: "txtLdlColesterol", range: "(V.N. < 129 mg/dl)" },
      { label: "H.D.L. COLESTEROL", key: "txtHdlColesterol", range: "(V.N. 40 - 60 mg/dl)" },
      { label: "V.L.D.L. COLESTEROL", key: "txtVldlColesterol", range: "(V.N. < 30 mg/dl)" },
      { label: "TRIGLICÉRIDOS", key: "txtTrigliseridos", range: "(V.N. < 150 mg/dl)" },
    ];
    const tableW = pageW - margin * 4;
    const tableX = (pageW - tableW) / 2;
    const rowH = 8;
    const totalRows = 2 + tests.length; 
    const tableH = totalRows * rowH;

    // contorno
    doc.setLineWidth(0.3);
    doc.roundedRect(tableX, y, tableW, tableH, 2, 2);
    // líneas horizontales delgadas
    for (let i = 1; i <= totalRows; i++) {
      const yy = y + i * rowH;
      doc.line(tableX, yy, tableX + tableW, yy);
    }

    // contenido de la tabla
    doc.setFontSize(11);
    let textY = y + rowH - 2;
    // Paciente
    doc.setFont("helvetica", "bold").text("PACIENTE", tableX + 2, textY);
    doc.text(":", tableX + 40, textY);
    doc.setFont("helvetica", "normal").text(datos.nombres || "", tableX + 44, textY);
    // Fecha
    textY += rowH;
    doc.setFont("helvetica", "bold").text("FECHA", tableX + 2, textY);
    doc.text(":", tableX + 40, textY);
    doc.setFont("helvetica", "normal").text(datos.fecha || "", tableX + 44, textY);

    // Tests
    let currentY = y + rowH * 2 - 2;
    tests.forEach(({ label, key, range }) => {
      currentY += rowH;
      doc.setFont("helvetica", "bold").text(label, tableX + 2, currentY);
      doc.text(":", tableX + 40, currentY);
      doc.setFont("helvetica", "normal")
        .text(datos[key] != null ? String(datos[key]) : "-", tableX + tableW * 0.45, currentY, { align: "left" });
      doc.text(range, tableX + tableW - 2, currentY, { align: "right" });
    });

    // ==== FIRMA ====
    const sigW = 70, sigH = 30, sigX = tableX, sigY = y + tableH + 10;
    doc.setLineWidth(0.3).roundedRect(sigX, sigY, sigW, sigH, 2, 2);
    
    if (sello1) {
      const canvas = document.createElement('canvas');
      canvas.width = sello1.width;
      canvas.height = sello1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(sello1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');

      // Tamaño máximo permitido dentro del cuadro
      const maxImgW = sigW - 10; // margen horizontal dentro del cuadro
      const maxImgH = sigH - 10; // margen vertical dentro del cuadro

      let imgW = sello1.width;
      let imgH = sello1.height;

      // Escalado proporcional si la imagen es más grande que el área
      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1); // máximo 1 para no escalar de más

      imgW *= scale;
      imgH *= scale;

      // Centramos dentro del rectángulo
      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;

      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    }

    if (sello2) {
      const canvas = document.createElement('canvas');
      canvas.width = sello2.width;
      canvas.height = sello2.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(sello2, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');

      // Tamaño máximo deseado
      const maxImgW = 60;
      const maxImgH = 30;

      // Calcular dimensiones proporcionales
      let imgW = maxImgW;
      let imgH = (sello2.height / sello2.width) * imgW;

      if (imgH > maxImgH) {
        imgH = maxImgH;
        imgW = (sello2.width / sello2.height) * imgH;
      }

      // Posicionar la imagen con el centro en (sigX + 120, sigY + 35)
      const imgX = sigX + 120 - imgW / 2;
      const imgY = sigY + 35 - imgH / 2;

      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    }
    // ==== FOOTER ====
    footer(doc, datos);

    // ==== IMPRIMIR ====
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => { iframe.contentWindow.focus(); iframe.contentWindow.print(); };

   })
  
}
