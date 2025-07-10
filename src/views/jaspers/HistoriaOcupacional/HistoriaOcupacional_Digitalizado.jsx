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

// --- Componente Principal ---

export default function HistoriaOcupacional_Digitalizado(datos = {}, tabla = []) {
  const doc = new jsPDF({ unit: "mm", format: "letter", orientation: "landscape" });
  const pageW = doc.internal.pageSize.getWidth();
  console.log('wasa')
  const datoss = {
    detalles: [
    {
        "fecha": "2023-01-11",
        "empresa": "Minerales del Sur",
        "actividad": "Perforación y voladura",
        "areaEmpresa": "Superficie",
        "ocupacion": "Técnico de seguridad",
        "superficie": "Sí",
        "socavon": "No",
        "riesgo": "Polvo, gases",
        "proteccion": "Mascarilla, gafas de seguridad",
        "altitud": "2800 msnm"
    },
    {
        "fecha": "2021-03-16",
        "empresa": "Minera Andina Del Peru SAC",
        "actividad": "Extracción de minerales",
        "areaEmpresa": "Subterránea",
        "ocupacion": "Operador de maquinaria",
        "superficie": "No",
        "socavon": "Sí",
        "riesgo": "Ruido, vibraciones",
        "proteccion": "Casco, tapones auditivos",
        "altitud": "3000 msnm"
    },
    {
        "fecha": null,
        "empresa": null,
        "actividad": null,
        "areaEmpresa": null,
        "ocupacion": null,
        "superficie": null,
        "socavon": null,
        "riesgo": null,
        "proteccion": null,
        "altitud": null
    },
    {
        "fecha": null,
        "empresa": null,
        "actividad": null,
        "areaEmpresa": null,
        "ocupacion": null,
        "superficie": null,
        "socavon": null,
        "riesgo": null,
        "proteccion": null,
        "altitud": null
    },
    {
        "fecha": null,
        "empresa": null,
        "actividad": null,
        "areaEmpresa": null,
        "ocupacion": null,
        "superficie": null,
        "socavon": null,
        "riesgo": null,
        "proteccion": null,
        "altitud": null
    },
    {
        "fecha": null,
        "empresa": null,
        "actividad": null,
        "areaEmpresa": null,
        "ocupacion": null,
        "superficie": null,
        "socavon": null,
        "riesgo": null,
        "proteccion": null,
        "altitud": null
    }
]
  }
  // === HEADER ===
  header_HistoriaOcupacional(doc, datos);
  const firmap = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "FIRMAP");
  const huellap = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "HUELLA");
  const sellofirma = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
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
    isValidUrl(firmap?.url) ? loadImg(firmap.url) : Promise.resolve(null),
    isValidUrl(huellap?.url) ? loadImg(huellap.url) : Promise.resolve(null),
    isValidUrl(sellofirma?.url) ? loadImg(sellofirma.url) : Promise.resolve(null),
  ]).then(([s1, s2, s3]) => {

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
          { content: 'Tiempo de labor', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
          { content: 'Peligros/Agentes Ocupacionales', rowSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
          { content: 'Uso EPP Tipo EPP', rowSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
        ],
        [
          { content: 'Subsuelo', styles: { halign: 'center', fontStyle: 'bold' } },
          { content: 'Superficie', styles: { halign: 'center', fontStyle: 'bold' } },
        ]
      ],
      body: tabla?.map(d => [
        d.fecha || '',
        d.empresa || '',
        d.altitud || '',
        d.actividad || '',
        d.areaEmpresa || '',
        d.ocupacion || '',
        d.socavon || '',
        d.superficie || '',
        d.riesgo || '',
        d.proteccion || ''
      ]),
      theme: "grid",
      styles: {
        fontSize: 6,
        textColor: [0, 0, 0],
        cellPadding: 1,
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

    let finalY = doc.lastAutoTable.finalY; // ✅ usar let en vez de const
const signatureBlockHeight = 40; // espacio estimado total (firma + texto + margen)
const spacingAfterTable = 5;
const totalRequired = spacingAfterTable + signatureBlockHeight;

const pageHeight = doc.internal.pageSize.getHeight();

// Si no cabe el bloque de firmas, agrega página antes de imprimirlas
if ((pageHeight - finalY) < totalRequired) {
  doc.addPage();
  const newY = 20;  // o el valor que uses para nuevo contenido
  finalY = newY;    // ✅ se puede reasignar porque es let
}

const signatureTop = finalY + spacingAfterTable;
    doc.text(`Fecha: ${datos.fechaHo}`,15, signatureTop + 35)
    //FIRMA
    const lineY = signatureTop + 35; // 5px debajo de la imagen
    const lineX1 = 70;           // inicio de la línea
    const lineX2 = 150;    // fin de la línea

    // Dibujar línea
    doc.setLineWidth(0.2);
    doc.line(lineX1, lineY, lineX2, lineY);

    // Texto centrado debajo de la línea
    const label = 'Firma del Trabajador';
    const fontSize = 9;
    doc.setFontSize(fontSize);

    const textWidth = doc.getTextWidth(label);
    const textX = (lineX1 + lineX2) / 2 - textWidth / 2;
    const textY = lineY + 4.5; // Ajusta según altura visual
    const midX = (lineX1 + lineX2) / 2;
    const sigW = (lineX2 - lineX1) / 2; // 40 px
    const sigH = 35;
    const sigY = 110; // altura vertical para ambas
    doc.text(label, textX, textY);

    //SELLO
    const lineYS = lineY; // 5px debajo de la imagen
    const lineX1S = 190;           // inicio de la línea
    const lineX2S = 270;    // fin de la línea

    // Dibujar línea
    doc.setLineWidth(0.2);
    doc.line(lineX1S, lineYS, lineX2S, lineYS);

    // Texto centrado debajo de la línea
    const labelS = 'Firma y Sello';
    const fontSizeS = 9;
    doc.setFontSize(fontSizeS);

    const textWidthS = doc.getTextWidth(labelS);
    const textXS = (lineX1S + lineX2S) / 2 - textWidthS / 2;
    const textYS = lineYS + 4.5; // Ajusta según altura visual
    const selloW = lineX2S - lineX1S; // 80 px
    const selloH = 35;                // Alto reservado
    const selloY = 110;    
    doc.text(labelS, textXS, textYS);
    doc.text(`Medico: ${datos.medicoAsignado}`, textXS, textYS+2);
    if (s1) {
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');

      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;

      let imgW = s1.width;
      let imgH = s1.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1);

      imgW *= scale;
      imgH *= scale;

      const sigX1 = lineX1; // zona izquierda
      const imgX = sigX1 + (sigW - imgW) / 2;
      const imgY = signatureTop + (sigH - imgH) / 2;

      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    }

    if (s2) {
      const canvas = document.createElement('canvas');
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');

      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;

      let imgW = s2.width;
      let imgH = s2.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1);

      imgW *= scale;
      imgH *= scale;

      const sigX2 = midX; // zona derecha
      const imgX = sigX2 + (sigW - imgW) / 2;
      const imgY = signatureTop + (sigH - imgH) / 2;

      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    }

    if (s3) {
      const canvas = document.createElement('canvas');
      canvas.width = s3.width;
      canvas.height = s3.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s3, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');

      const maxImgW = selloW - 10; // margen interno
      const maxImgH = selloH - 10;

      let imgW = s3.width;
      let imgH = s3.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1); // evitar que crezca

      imgW *= scale;
      imgH *= scale;

      // Centrado dentro del área del sello (horizontal)
      const imgX = lineX1S + (selloW - imgW) / 2;
      const imgY = signatureTop + (selloH - imgH) / 2;

      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    }

    // === FOOTER ===

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
