// src/views/jaspers/AnalisisBioquimicos/AnalisisBioquimicos_Digitalizado.jsx
import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha; // ya está en formato correcto
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

// Función para formatear fecha larga
const formatDateToLong = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return toDDMMYYYY(dateString) || '';
  }
};

// Header con datos de ficha, sede y fecha
const drawHeader = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  
  CabeceraLogo(doc, { ...datos, tieneMembrete: false });
  
  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);
  
  // Código AB (codAb)
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Cod. AB: " + (datos.codAb || ""), pageW - 80, 20);
  
  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 25);
  
  // Fecha de examen
  const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 30);
  
  // Página
  doc.text("Pag. 01", pageW - 30, 10);

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

export default function AnalisisBioquimicos_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  drawHeader(doc, datos);

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

    // ==== DATOS PERSONALES ====
    const margin = 26; // Márgenes laterales aumentados
    const lineHeight = 7;
    const startX = margin;
    
   
    
    // Apellidos y Nombres
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text("Apellidos y Nombres :", startX, y);
    doc.setFont('helvetica', 'normal');
    const nombresX = startX + 50;
    doc.text(String(datos.nombres || datos.nombresPaciente || '').toUpperCase(), nombresX, y);
    y += lineHeight;
    
    // Fecha
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text("Fecha :", startX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDateToLong(datos.fechaExamen || datos.fecha || '').toUpperCase(), nombresX, y);
    y += lineHeight + 3;
    
    // Línea divisoria
    doc.setLineWidth(0.3);
    doc.line(startX, y, pageW - margin, y);
    y += lineHeight + 2;

    // ==== RESULTADOS ====
    // Título "RESULTADOS:"
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text("RESULTADOS:", startX, y);
    y += lineHeight + 2;

    // ==== PRUEBAS (texto ordenado, sin tabla) ====
    const tests = [
      { label: "CREATININA", key: "txtCreatinina", range: "(V.N. 0.8 - 1.4 mg/dl)" },
      { label: "COLESTEROL TOTAL", key: "txtColesterol", range: "(V.N. < 200 mg/dl)" },
      { label: "TRIGLICÉRIDOS", key: "txtTrigliseridos", range: "(V.N. < 150 mg/dl)" },
      { label: "H.D.L. COLESTEROL", key: "txtHdlColesterol", range: "(V.N. 40 - 60 mg/dl)" },
      { label: "L.D.L. COLESTEROL", key: "txtLdlColesterol", range: "(V.N. < 129 mg/dl)" },
      { label: "V.L.D.L. COLESTEROL", key: "txtVldlColesterol", range: "(V.N. < 30 mg/dl)" },
    ];

    // Posiciones para alinear el texto
    const labelX = startX;
    const colonX = startX + 60;
    const valueX = startX + 70;
    const rangeX = pageW - margin;

    doc.setFontSize(11);

    // Dibujar pruebas como texto ordenado
    tests.forEach(({ label, key, range }) => {
      const val = datos[key] != null ? String(datos[key]) : "-";
      doc.setFont("helvetica", "bold")
         .text(label, labelX, y, { align: "left" });
      doc.setFont("helvetica", "normal")
         .text(":", colonX, y, { align: "left" });
      doc.text(val, valueX, y, { align: "left" });
      doc.text(range, rangeX, y, { align: "right" });
      y += lineHeight;
    });

    // Centrar los sellos en la hoja - Mismo tamaño fijo para ambos (sin recuadro)
    const sigW = 53; // Tamaño fijo width
    const sigH = 23; // Tamaño fijo height
    const sigY = y + 20; // Espacio después de las pruebas
    const gap = 16; // Espacio entre sellos (reducido 4mm: 20 - 4 = 16)
    
    if (s1 && s2) {
      // Si hay dos sellos, centrarlos juntos
      const totalWidth = sigW * 2 + gap;
      const startX = (pageW - totalWidth) / 2;
      
      const addSello = (img, xPos) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const selloBase64 = canvas.toDataURL('image/png');
        doc.addImage(selloBase64, 'PNG', xPos, sigY + (sigH - sigH) / 2, sigW, sigH);
      };
      addSello(s1, startX);
      addSello(s2, startX + sigW + gap);
    } else if (s1) {
      // Si solo hay un sello, centrarlo con tamaño fijo
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const imgX = (pageW - sigW) / 2; // Center single stamp
      doc.addImage(selloBase64, 'PNG', imgX, sigY + (sigH - sigH) / 2, sigW, sigH);
    } else if (s2) {
      // Si solo hay el segundo sello, centrarlo con tamaño fijo
      const canvas = document.createElement('canvas');
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const imgX = (pageW - sigW) / 2; // Center single stamp
      doc.addImage(selloBase64, 'PNG', imgX, sigY + (sigH - sigH) / 2, sigW, sigH);
    }

    // === FOOTER ===
    footerTR(doc, datos);

    // ==== Imprimir ====
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
