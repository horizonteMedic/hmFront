// src/views/jaspers/AnalisisBioquimicos/AnalisisBioquimicos_Digitalizado.jsx
import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import footerTR from '../components/footerTR.jsx';

export default function AnalisisBioquimicos_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();

  // ==== HEADER ====
  const drawHeader = () => {
    // Logo y membrete
    CabeceraLogo(doc, { tieneMembrete: false, yOffset: 12 });

    // Número de Ficha
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("Nro de ficha: ", pageW - 70, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(String(datos.norden || ""), pageW - 50, 16);

    // Código AB (codAb)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Cod. AB: " + (datos.codAb || ""), pageW - 70, 20);

    // Sede
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + (datos.sede || ""), pageW - 70, 25);

    // Fecha de examen
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Fecha de examen: " + formatearFechaCorta(datos.fecha || ""), pageW - 70, 30);

    // Bloque de color
    drawColorBox(doc, {
      color: datos.codigoColor || "#008f39",
      text: datos.textoColor || "F",
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  };

  drawHeader();

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

    // ==== TÍTULOS ====
    let y = 50;
    doc.setFont("helvetica", "bold").setFontSize(16);
    doc.text("LABORATORIO CLÍNICO", pageW / 2, y, { align: "center" });
    y += 8;
    doc.setFontSize(14);
    doc.text("ANÁLISIS BIOQUÍMICOS", pageW / 2, y, { align: "center" });
    const titleW = doc.getTextWidth("ANÁLISIS BIOQUÍMICOS");
    doc.setLineWidth(0.5)
       .line((pageW - titleW) / 2, y + 1.5, (pageW + titleW) / 2, y + 1.5);
    y += 12;

    // ==== TABLA ====
    const tests = [
      { label: "CREATININA", key: "txtCreatinina", range: "(V.N. 0.8 - 1.4 mg/dl)" },
      { label: "COLESTEROL TOTAL", key: "txtColesterol", range: "(V.N. < 200 mg/dl)" },
      { label: "TRIGLICÉRIDOS", key: "txtTrigliseridos", range: "(V.N. < 150 mg/dl)" },
      { label: "H.D.L. COLESTEROL", key: "txtHdlColesterol", range: "(V.N. 40 - 60 mg/dl)" },
      { label: "L.D.L. COLESTEROL", key: "txtLdlColesterol", range: "(V.N. < 129 mg/dl)" },
      { label: "V.L.D.L. COLESTEROL", key: "txtVldlColesterol", range: "(V.N. < 30 mg/dl)" },
    ];

    // ancho total de tabla
    const tableW = pageW * 0.75;
    const tableX = (pageW - tableW) / 2;
    const rowH = 8;
    const totalRows = 2 + tests.length;
    const tableH = totalRows * rowH;

    // contorno y líneas horizontales
    doc.setLineWidth(0.3).roundedRect(tableX, y, tableW, tableH, 2, 2);
    for (let i = 1; i <= totalRows; i++) {
      const yy = y + i * rowH;
      doc.line(tableX, yy, tableX + tableW, yy);
    }

    // columnas
    const labelX = tableX + 3;
    const colonX = tableX + tableW * 0.35;   // ahora el ":" está al 30% del ancho de la tabla
    const valueX = tableX + tableW * 0.45;
    const rangeX = tableX + tableW - 3;

    doc.setFontSize(11);

    // —— PACIENTE ——
    let textY = y + rowH - 2;
    doc.setFont("helvetica", "bold")
       .text("PACIENTE", labelX, textY, { align: "left" });
    doc.setFont("helvetica", "normal")
       .text(":", colonX, textY, { align: "center" });
    doc.text(datos.nombres || "-", valueX, textY, { align: "left" });

    // —— FECHA ——
    textY += rowH;
    doc.setFont("helvetica", "bold")
       .text("FECHA", labelX, textY, { align: "left" });
    doc.setFont("helvetica", "normal")
       .text(":", colonX, textY, { align: "center" });
    // Formato de fecha dd/mm/yyyy
    const formatDateToShort = (dateString) => {
      if (!dateString) return '';
      const date = new Date(`${dateString}T00:00:00`);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    doc.text(formatDateToShort(datos.fecha), valueX, textY, { align: "left" });

    // —— TESTS ——
    let currentY = y + rowH * 2 - 2;
    tests.forEach(({ label, key, range }) => {
      currentY += rowH;
      const val = datos[key] != null ? String(datos[key]) : "-";
      doc.setFont("helvetica", "bold")
         .text(label, labelX, currentY, { align: "left" });
      doc.setFont("helvetica", "normal")
         .text(":", colonX, currentY, { align: "center" });
      doc.text(val, valueX, currentY, { align: "left" });
      doc.text(range, rangeX, currentY, { align: "right" });
    });

    // ==== FIRMA ====
    const recW = 150, recH = 30;
    const recX = (pageW - recW) / 2;
    const recY = y + tableH + 30; // más abajo

    doc.setLineWidth(0.3).roundedRect(recX, recY, recW, recH, 2, 2);

    const imgW = 60, imgH = 25;
    const smallW = 30, smallH = 25;
    const marginInterno = 10;
    if (s1 && s2) {
      // Dos firmas, una a la izquierda (normal) y otra a la derecha (más pequeña) dentro del recuadro
      // Primera firma (sello1) - tamaño normal
      const canvas1 = document.createElement('canvas');
      canvas1.width = s1.width;
      canvas1.height = s1.height;
      const ctx1 = canvas1.getContext('2d');
      ctx1.drawImage(s1, 0, 0);
      const selloBase64_1 = canvas1.toDataURL('image/png');
      const imgX1 = recX + marginInterno;
      const imgY1 = recY + (recH - imgH) / 2;
      doc.addImage(selloBase64_1, 'PNG', imgX1, imgY1, imgW, imgH);

      // Segunda firma (sello2) - más pequeña
      const canvas2 = document.createElement('canvas');
      canvas2.width = s2.width;
      canvas2.height = s2.height;
      const ctx2 = canvas2.getContext('2d');
      ctx2.drawImage(s2, 0, 0);
      const selloBase64_2 = canvas2.toDataURL('image/png');
      const imgX2 = recX + recW - marginInterno - smallW;
      const imgY2 = recY + (recH - smallH) / 2;
      doc.addImage(selloBase64_2, 'PNG', imgX2, imgY2, smallW, smallH);
    } else if (s1) {
      // Solo una firma, centrada en el recuadro
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const imgX = recX + (recW - imgW) / 2;
      const imgY = recY + (recH - imgH) / 2;
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    } else if (s2) {
      // Solo la segunda firma, centrada y más pequeña
      const canvas = document.createElement('canvas');
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const imgX = recX + (recW - smallW) / 2;
      const imgY = recY + (recH - smallH) / 2;
      doc.addImage(selloBase64, 'PNG', imgX, imgY, smallW, smallH);
    }

    // ==== FOOTER ====
    footerTR(doc, { footerOffsetY: 10 });

    // ==== IMPRIMIR ====
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
  });
}
