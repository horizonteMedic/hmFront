// src/views/jaspers/AnalisisBioquimicos/PerfilHepatico_Digitalizado.jsx
import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';

const config = {
  margin: 15,
  fontSize: {
    title: 14,
    subtitle: 11,
    header: 11,
    body: 10,
  },
  lineHeight: {
    normal: 7,
    small: 5,
  },
  font: 'helvetica',
};

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
  
  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 20);
  
  // Fecha de examen
  const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);
  
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

// Función para dibujar datos del paciente
const drawPatientData = (doc, datos = {}) => {
  const margin = 15;
  let y = 40;
  const lineHeight = 6;
  const patientDataX = margin;
  
  const drawPatientDataRow = (label, value) => {
    const labelWithColon = label.endsWith(':') ? label : label + ' :';
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text(labelWithColon, patientDataX, y);
    let valueX = patientDataX + doc.getTextWidth(labelWithColon) + 2;
    if (label.toLowerCase().includes('apellidos y nombres')) {
      const minGap = 23;
      if (doc.getTextWidth(labelWithColon) < minGap) valueX = patientDataX + minGap;
    }
    doc.setFont('helvetica', 'normal');
    doc.text(String(value || '').toUpperCase(), valueX, y);
    y += lineHeight;
  };
  
  drawPatientDataRow("Apellidos y Nombres :", datos.nombres || datos.nombresPaciente || '');
  drawPatientDataRow("Edad :", datos.edad || datos.edadPaciente ? `${datos.edad || datos.edadPaciente} AÑOS` : '');
  
  // Fecha
  doc.setFontSize(11).setFont('helvetica', 'bold');
  const fechaLabel = "Fecha :";
  doc.text(fechaLabel, patientDataX, y);
  doc.setFont('helvetica', 'normal');
  const fechaLabelWidth = doc.getTextWidth(fechaLabel);
  doc.text(formatDateToLong(datos.fechaExamen || datos.fecha || ''), patientDataX + fechaLabelWidth + 2, y);
  
  // Reseteo
  doc.setFont('helvetica', 'normal').setFontSize(10).setLineWidth(0.2);
  
  return y + lineHeight;
};

const drawRow = (doc, y, test, datos, cols) => {
  doc.setFont(config.font, 'normal').setFontSize(config.fontSize.body);
  doc.text(test.label, cols.col1, y);
  
  const result = datos[test.key] != null ? String(datos[test.key]) : "0";
  doc.text(result, cols.col2, y, { align: "center" });

  if (typeof test.ref === "string") {
    doc.text(test.ref, cols.col3, y, { align: "left" });
    return y + config.lineHeight.normal;
  } else if (Array.isArray(test.ref)) {
    let tempY = y;
    test.ref.forEach((line, index) => {
      // Divide la línea en parte de etiqueta y parte de valor para alinearlas
      const parts = line.split(/(Hasta .*|10 - 50 U\/L|8 - 35 U\/L)/);
      const labelPart = parts[0] || '';
      const valuePart = parts[1] || '';
      const textRightAligned = labelPart.trim() + " " + valuePart.trim();

      doc.text(textRightAligned, cols.col3, tempY, { align: "left" });
      if (index < test.ref.length - 1) {
        tempY += config.lineHeight.small;
      }
    });
    // Devuelve la posición Y más baja alcanzada, más un pequeño espacio, 
    // o la altura de línea normal, lo que sea mayor, para evitar solapamientos.
    return Math.max(y + config.lineHeight.normal, tempY + config.lineHeight.small + 2);
  }
  return y + config.lineHeight.normal;
};

export default function PerfilHepatico_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  drawHeader(doc, datos);
  
  // === DATOS DEL PACIENTE ===
  drawPatientData(doc, datos);

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

    let y = 70; // Posición inicial después del header

    doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
    doc.text("BIOQUÍMICA", pageW / 2, y, { align: "center" });
    y += config.lineHeight.normal * 1.5;

    doc.setFont(config.font, "bold").setFontSize(config.fontSize.subtitle);
    doc.text(`MUESTRA: ${datos.muestra || "SUERO"}`, config.margin, y);
    y += config.lineHeight.normal;
    doc.text("PERFIL HEPÁTICO", config.margin, y);
    y += config.lineHeight.normal * 1.5;

    const tableCols = {
      col1: config.margin,
      col2: 100,
      col3: 135,
    };

    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text("PRUEBA", tableCols.col1, y);
    doc.text("RESULTADO", tableCols.col2, y, { align: "center" });
    doc.text("RANGO REFERENCIAL", tableCols.col3, y, { align: "left" });
    y += 3;
    doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
    y += config.lineHeight.normal;

    const tests = [
      { label: "FOSFATASA ALCALINA", key: "txtrFosfalcalina", ref: "Hasta 300 U/L" },
      { label: "GGT", key: "txtrGgt", ref: ["Hombres  10 - 50 U/L", "Mujeres  8 - 35 U/L"] },
      { label: "TGP", key: "txtrTgp", ref: ["Hombres  Hasta 40 U/L", "Mujeres  Hasta 35 U/L"] },
      { label: "TGO", key: "txtrTgo", ref: "Hasta 31 U/L" },
      { label: "BILIRRUBINA TOTAL", key: "txtrBilirrTotal", ref: "0.2 - 1.20 mg/dL" },
      { label: "BILIRRUBINA DIRECTA", key: "txtrBilirrDirecta", ref: "Hasta 0.25 mg/dL" },
      { label: "BILIRRUBINA INDIRECTA", key: "txtrBilirrIndirecta", ref: "0.1 - 1 mg/dL" },
      { label: "PROTEÍNAS TOTALES", key: "txtrProteTotales", ref: "6.6 - 8.3 g/dL" },
      { label: "ALBÚMINA", key: "txtrAlbumina", ref: "3.5 - 5.5 g/dL" },
      { label: "GLOBULINA SÉRICA", key: "txtrGlobulina", ref: "2.3 - 3.5 g/dL" },
    ];

    tests.forEach(test => {
      y = drawRow(doc, y, test, datos, tableCols);
    });

    // Centrar los sellos en la hoja - Mismo tamaño fijo para ambos
    const sigW = 53; // Tamaño fijo width
    const sigH = 23; // Tamaño fijo height
    const sigY = y + 20;
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
  })

  
}
