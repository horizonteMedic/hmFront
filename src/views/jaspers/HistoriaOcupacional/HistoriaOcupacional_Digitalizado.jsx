// src/views/jaspers/Microbiologia/InmunologiaAglutinacion_Digitalizado.jsx
import jsPDF from "jspdf";
import header_HistoriaOcupacional from "./Header/HistoriaOcupacionalHeader";
import footer from "../components/footer";
import autoTable from "jspdf-autotable";
// --- Configuración Centralizada (Estándar) ---
const config = {
  margin: 15,
  fontSize: {
    title: 14,
    header: 11,
    body: 11,
  },
  font: 'helvetica',
  lineHeight: 8,
};

// --- Funciones de Ayuda (Estándar) ---

const drawUnderlinedTitle = (doc, text, y) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text(text, pageW / 2, y, { align: "center" });
};

const drawResultRow = (doc, y, label, value) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(config.font, 'normal').setFontSize(config.fontSize.body);
  doc.text(label, config.margin, y);
  doc.text(value, pageW - config.margin, y, { align: "right" });
  return y + config.lineHeight;
};

// --- Componente Principal ---

export default function InmunologiaLab_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter", orientation: "landscape" });
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  header_HistoriaOcupacional(doc, datos);
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


    // === CUERPO ===
    let y = 53;
    autoTable(doc, {
      startY: y,
      head: [
  [
    { content: 'Fecha', rowSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
    { content: 'Empresa', rowSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
    { content: 'Altitud', rowSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
    { content: 'Actividad', rowSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
    { content: 'Área de Trabajo', rowSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
    { content: 'Ocupación', rowSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
    { content: 'Tiempo de labor', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }, // Agrupa
    { content: 'Peligros/Agentes Ocupacionales', rowSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
    { content: 'Uso EPP Tipo EPP', rowSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
  ],
  [
    { content: 'Subsuelo', styles: { halign: 'center', fontStyle: 'bold' } },
    { content: 'Superficie', styles: { halign: 'center', fontStyle: 'bold' } },
  ]
]
,
      body: [
        
      ],
      theme: "grid",
      styles: {
        fontSize: 7,
        textColor: [0, 0, 0],
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        lineWidth: 0.1,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
    });
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
      const sigX = (pageW - sigW) / 2; // Centrado horizontal
      const sigY = 190; // Más arriba

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

    if (s2) {
      const canvas = document.createElement('canvas');
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');

      // Dimensiones del área del sello
      const sigW = 70;
      const sigH = 35;
      const sigX = (pageW - sigW) / 2; // Centrado horizontal
      const sigY = 190; // Más arriba

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
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);

      // Actualiza Y si después quieres seguir dibujando debajo
    }

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
