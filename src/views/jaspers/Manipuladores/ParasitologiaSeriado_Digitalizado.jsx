// src/views/jaspers/AnalisisBioquimicos/CoproparasitologicoSeriado_Digitalizado.jsx
import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha;
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
  
  CabeceraLogo(doc, { ...datos, tieneMembrete: false, yOffset: 3 });
  
  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Nro de ficha: ", pageW - 80, 8);
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 9);
  
  // Sede
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 13);
  
  // Fecha de examen
  const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || datos.fechaLab || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 18);
  
  // Página
  doc.text("Pag. 01", pageW - 30, 3);

  // Bloque de color
  drawColorBox(doc, {
    color: datos.codigoColor || "#008f39",
    text: datos.textoColor || "F",
    x: pageW - 30,
    y: 3,
    size: 22,
    showLine: true,
    fontSize: 30,
    textPosition: 0.9
  });
};

// Función para dibujar datos del paciente (alineados con xLeft para coincidir con "MUESTRA")
const drawPatientData = (doc, datos = {}, xLeft, yStart = 28) => {
  let y = yStart;
  const lineHeight = 5.5;
  const patientDataX = xLeft; // Alineado con la "M" de "MUESTRA"
  
  const drawPatientDataRow = (label, value) => {
    const labelWithColon = label.endsWith(':') ? label : label + ' :';
    doc.setFontSize(9).setFont('helvetica', 'bold');
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
  
  // Solo mostrar Edad si está presente
  if (datos.edad || datos.edadPaciente) {
    drawPatientDataRow("Edad :", `${datos.edad || datos.edadPaciente} AÑOS`);
  }
  
  // Solo mostrar DNI si está presente
  if (datos.dni || datos.dniPaciente) {
    drawPatientDataRow("DNI :", datos.dni || datos.dniPaciente);
  }
  
  // Fecha
  doc.setFontSize(9).setFont('helvetica', 'bold');
  const fechaLabel = "Fecha :";
  doc.text(fechaLabel, patientDataX, y);
  doc.setFont('helvetica', 'normal');
  const fechaLabelWidth = doc.getTextWidth(fechaLabel);
  doc.text(formatDateToLong(datos.fechaExamen || datos.fecha || datos.fechaLab || ''), patientDataX + fechaLabelWidth + 2, y);
  y += lineHeight;
  
  // Línea divisoria
  y += 2;
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.line(margin * 2, y, pageW - margin * 2, y);
  y += 4;
  
  // Reseteo
  doc.setFont('helvetica', 'normal').setFontSize(9).setLineWidth(0.2);
  
  return y;
};

export default function ParasitologiaSeriado_Digitalizado(datos = {}) {
  // === MAPEO DE DATOS ===
  const datosReales = {
    // Datos del paciente
    nombres: String(datos.nombres || datos.nombresPaciente || ""),
    edad: datos.edad || datos.edadPaciente || "",
    dni: datos.dni || datos.dniPaciente || "",
    fecha: datos.fecha || datos.fechaExamen || datos.fechaLab || "",
    
    // Datos de ficha
    norden: String(datos.norden || datos.numeroFicha || ""),
    sede: datos.sede || datos.nombreSede || "",
    
    // Datos de color
    codigoColor: datos.codigoColor || "#008f39",
    textoColor: datos.textoColor || "F",
    color: datos.color || 1,
    
    // Muestra I - Examen Macroscópico
    muestra1: {
      color: String(datos.txtcolor || ""),
      aspecto: String(datos.txtaspecto || ""),
      mocoFecal: String(datos.txtmocoFecal || ""),
      sangreVisible: String(datos.txtsangrev || ""),
      restosAlimenticios: String(datos.txtrestosa || ""),
      grasa: String(datos.txtgrasa || "")
    },
    
    // Muestra I - Examen Microscópico
    microscopico1: {
      leucocitos: String(datos.txtleucocitos || ""),
      hematies: String(datos.txthematies || ""),
      parasitos: String(datos.txtlugol || "")
    },
    
    // Muestra II - Examen Macroscópico
    muestra2: {
      color: String(datos.txtcolor1 || ""),
      aspecto: String(datos.txtaspecto1 || ""),
      mocoFecal: String(datos.txtmocoFecal1 || ""),
      sangreVisible: String(datos.txtsangrev1 || ""),
      restosAlimenticios: String(datos.txtrestosa1 || ""),
      grasa: String(datos.txtgrasa1 || "")
    },
    
    // Muestra II - Examen Microscópico
    microscopico2: {
      leucocitos: String(datos.txtleucocitos1 || ""),
      hematies: String(datos.txthematies1 || ""),
      parasitos: String(datos.txtlugol1 || "")
    },
    
    // Muestra III - Examen Macroscópico
    muestra3: {
      color: String(datos.txtcolor2 || ""),
      aspecto: String(datos.txtaspecto2 || ""),
      mocoFecal: String(datos.txtmocoFecal2 || ""),
      sangreVisible: String(datos.txtsangrev2 || ""),
      restosAlimenticios: String(datos.txtrestosa2 || ""),
      grasa: String(datos.txtgrasa2 || "")
    },
    
    // Muestra III - Examen Microscópico
    microscopico3: {
      leucocitos: String(datos.txtleucocitos2 || ""),
      hematies: String(datos.txthematies2 || ""),
      parasitos: String(datos.txtlugol2 || "")
    },
    
    // Digitalizaciones
    digitalizacion: datos.digitalizacion || []
  };

  // Usar datos reales
  const datosFinales = datosReales;

  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const xLeft = margin * 2;

  // Definir columna para los datos
  const xDato = xLeft + 65;

  const sello1 = datosFinales.digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const sello2 = datosFinales.digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMADOCASIG");
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
    // === PRIMERA PÁGINA (con header) ===
    drawHeader(doc, datosFinales);
    
    // === TÍTULO ===
    let y = 28;
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.text("COPROPARASITOLÓGICO SERIADO", pageW / 2, y, { align: "center" });
    y += 12; // Aumentado de 10 a 12 para más separación
    
    // === DATOS DEL PACIENTE ===
    y = drawPatientData(doc, datosFinales, xLeft, y);
    
    // === RESULTADOS ===
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("RESULTADOS:", xLeft, y);
    y += 8;

  // MUESTRA: HECES I
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("MUESTRA: HECES I", xLeft, y);
  y += 7;
  // EXAMEN MACROSCÓPICO I
  doc.setFont("helvetica", "bold");
  doc.text("EXAMEN MACROSCÓPICO I", xLeft, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  [
    ["COLOR", datosFinales.muestra1.color],
    ["ASPECTO", datosFinales.muestra1.aspecto],
    ["MOCO FECAL", datosFinales.muestra1.mocoFecal],
    ["SANGRE VISIBLE", datosFinales.muestra1.sangreVisible],
    ["RESTOS ALIMENTICIOS", datosFinales.muestra1.restosAlimenticios],
    ["GRASA", datosFinales.muestra1.grasa]
  ].forEach(([lbl, value]) => {
    doc.text(lbl, xLeft, y);
    doc.text(":", xDato, y);
    doc.text(value != null && value !== "" ? String(value) : "", xDato + 4, y);
    y += 7;
  });

  // EXAMEN MICROSCÓPICO I
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("EXAMEN MICROSCÓPICO I", xLeft, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  [
    ["LEUCOCITOS", datosFinales.microscopico1.leucocitos],
    ["HEMATÍES", datosFinales.microscopico1.hematies],
    ["INVESTIGACIÓN DE PARÁSITOS", datosFinales.microscopico1.parasitos]
  ].forEach(([lbl, value]) => {
    doc.text(lbl, xLeft, y);
    doc.text(":", xDato, y);
    doc.text(value != null && value !== "" ? String(value) : "", xDato + 4, y);
    y += 7;
  });

  // MUESTRA: HECES II
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("MUESTRA: HECES II", xLeft, y);
  y += 7;
  // EXAMEN MACROSCÓPICO II
  doc.setFont("helvetica", "bold");
  doc.text("EXAMEN MACROSCÓPICO II", xLeft, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  [
    ["COLOR", datosFinales.muestra2.color],
    ["ASPECTO", datosFinales.muestra2.aspecto],
    ["MOCO FECAL", datosFinales.muestra2.mocoFecal],
    ["SANGRE VISIBLE", datosFinales.muestra2.sangreVisible],
    ["RESTOS ALIMENTICIOS", datosFinales.muestra2.restosAlimenticios],
    ["GRASA", datosFinales.muestra2.grasa]
  ].forEach(([lbl, value]) => {
    doc.text(lbl, xLeft, y);
    doc.text(":", xDato, y);
    doc.text(value != null && value !== "" ? String(value) : "", xDato + 4, y);
    y += 7;
  });
   // Centrar los sellos en la hoja - Mismo tamaño fijo para ambos
    const sigW = 53;
    const sigH = 23;
    const sigY = y + 2;
    const gap = 16;
    
    if (s1 && s2) {
      const totalWidth = sigW * 2 + gap;
      const startX = (pageW - totalWidth) / 2;
      
      const addSello = (img, xPos) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const selloBase64 = canvas.toDataURL('image/png');
        doc.addImage(selloBase64, 'PNG', xPos, sigY, sigW, sigH);
      };
      addSello(s1, startX);
      addSello(s2, startX + sigW + gap);
    } else if (s1) {
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const imgX = (pageW - sigW) / 2;
      doc.addImage(selloBase64, 'PNG', imgX, sigY, sigW, sigH);
    } else if (s2) {
      const canvas = document.createElement('canvas');
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const imgX = (pageW - sigW) / 2;
      doc.addImage(selloBase64, 'PNG', imgX, sigY, sigW, sigH);
    }
    
    // === FOOTER PRIMERA PÁGINA ===
    footerTR(doc, { ...datosFinales, footerOffsetY: 16 });

  // === SEGUNDA PÁGINA (SIN header) ===
  doc.addPage();
  // Header en la página 2
  drawHeader(doc, datosFinales);
  
  // === TÍTULO ===
  y = 28;
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("COPROPARASITOLÓGICO SERIADO", pageW / 2, y, { align: "center" });
  y += 12; // Aumentado de 10 a 12 para más separación
  
  // === DATOS DEL PACIENTE ===
  y = drawPatientData(doc, datosFinales, xLeft, y);
  
  // === RESULTADOS ===
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("RESULTADOS:", xLeft, y);
  y += 8;
  // EXAMEN MICROSCÓPICO II (igual que en la página 1)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("EXAMEN MICROSCÓPICO II", xLeft, y);
  y += 7;
  doc.setFont("helvetica", "normal").setFontSize(9);
  [
    ["LEUCOCITOS", datosFinales.microscopico2.leucocitos],
    ["HEMATÍES", datosFinales.microscopico2.hematies],
    ["INVESTIGACIÓN DE PARÁSITOS", datosFinales.microscopico2.parasitos]
  ].forEach(([lbl, value]) => {
    doc.text(lbl, xLeft, y);
    doc.text(":", xDato, y);
    doc.text(value != null && value !== "" ? String(value) : "", xDato + 4, y);
    y += 7;
  });
  y += 10;
  // MUESTRA: HECES III
  doc.setFont("helvetica", "bold");
  doc.text("MUESTRA: HECES III", xLeft, y);
  y += 7;
  // EXAMEN MACROSCÓPICO III
  doc.setFont("helvetica", "bold");
  doc.text("EXAMEN MACROSCÓPICO III", xLeft, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  [
    ["COLOR", datosFinales.muestra3.color],
    ["ASPECTO", datosFinales.muestra3.aspecto],
    ["MOCO FECAL", datosFinales.muestra3.mocoFecal],
    ["SANGRE VISIBLE", datosFinales.muestra3.sangreVisible],
    ["RESTOS ALIMENTICIOS", datosFinales.muestra3.restosAlimenticios],
    ["GRASA", datosFinales.muestra3.grasa]
  ].forEach(([lbl, value]) => {
    doc.text(lbl, xLeft, y);
    doc.text(":", xDato, y);
    doc.text(value != null && value !== "" ? String(value) : "", xDato + 4, y);
    y += 7;
  });
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("EXAMEN MICROSCÓPICO III", xLeft, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  [
    ["LEUCOCITOS", datosFinales.microscopico3.leucocitos],
    ["HEMATÍES", datosFinales.microscopico3.hematies],
    ["INVESTIGACIÓN DE PARÁSITOS", datosFinales.microscopico3.parasitos]
  ].forEach(([lbl, value]) => {
    doc.text(lbl, xLeft, y);
    doc.text(":", xDato, y);
    doc.text(value != null && value !== "" ? String(value) : "", xDato + 4, y);
    y += 7;
  });

  // Centrar los sellos en la hoja - Mismo tamaño fijo para ambos
    const sigW2 = 53;
    const sigH2 = 23;
    const sigY2 = y + 2;
    const gap2 = 16;
    
    if (s1 && s2) {
      const totalWidth = sigW2 * 2 + gap2;
      const startX = (pageW - totalWidth) / 2;
      
      const addSello = (img, xPos) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const selloBase64 = canvas.toDataURL('image/png');
        doc.addImage(selloBase64, 'PNG', xPos, sigY2, sigW2, sigH2);
      };
      addSello(s1, startX);
      addSello(s2, startX + sigW2 + gap2);
    } else if (s1) {
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const imgX = (pageW - sigW2) / 2;
      doc.addImage(selloBase64, 'PNG', imgX, sigY2, sigW2, sigH2);
    } else if (s2) {
      const canvas = document.createElement('canvas');
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const imgX = (pageW - sigW2) / 2;
      doc.addImage(selloBase64, 'PNG', imgX, sigY2, sigW2, sigH2);
    }

  // Footer de segunda página
  footerTR(doc, { ...datosFinales, footerOffsetY: 16 });

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
