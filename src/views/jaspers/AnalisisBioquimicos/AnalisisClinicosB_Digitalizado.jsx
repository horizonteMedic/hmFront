import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';

//ACIDO URICO
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

export default function AnalisisClinicosB_Digitalizado(datos = {}) {
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

  let y = 70;

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("BIOQUÍMICA", pageW / 2, y, { align: "center" });
  y += config.lineHeight.normal * 1.5;

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.subtitle);
  doc.text(`MUESTRA :`, config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text(datos.txtMuestra || "SUERO", config.margin + 20, y);
  y += config.lineHeight.normal * 1.5;

  const tableCols = {
    col1: config.margin,
    col2: pageW / 2,
    col3: pageW - config.margin,
  };

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", tableCols.col1, y);
  doc.text("RESULTADO", tableCols.col2, y, { align: "center" });
  doc.text("VALORES NORMALES", tableCols.col3, y, { align: "right" });
  y += 3;
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight.normal;

  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text(datos.txtPrueba, tableCols.col1, y);
  doc.text(String(datos.txtResultado  || ''), tableCols.col2, y, { align: "center" });
  
  const valoresNormales = ["Mujeres : 2.5 - 6.8 mg/dl", "Hombres : 3.6 - 7.7 mg/dl"];
  let tempY = y;
  valoresNormales.forEach((line, index) => {
      doc.text(line, tableCols.col3, tempY, { align: "right" });
      if(index < valoresNormales.length - 1) {
          tempY += config.lineHeight.small;
      }
  });

  // Posiciona la fecha justo debajo de la sección "Valores Normales".
  const dateYPosition = tempY + config.lineHeight.normal * 2;
  // Mostrar la fecha en formato '01 de junio de 2025'
  let fechaFormateada = '';
  if (datos.fecha) {
    const date = new Date(`${datos.fecha}T00:00:00`);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();
    fechaFormateada = `${day} de ${month} de ${year}`;
  }
  doc.setFontSize(10).setFont(config.font, 'normal');
  doc.text(fechaFormateada, pageW - config.margin, dateYPosition, { align: 'right' });

  // Centrar los sellos en la hoja - Mismo tamaño fijo para ambos
  const sigW = 53; // Tamaño fijo width
  const sigH = 23; // Tamaño fijo height
  const sigY = dateYPosition + 45; // Bajado 25mm (de 20 a 45)
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

    // === Imprimir ===
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