// src/views/jaspers/AnalisisBioquimicos/coprocultivo_digitalizado.jsx
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

// Función para dibujar datos del paciente (alineados con xLeft para coincidir con el contenido)
const drawPatientData = (doc, datos = {}, xLeft, yStart = 28) => {
  let y = yStart;
  const lineHeight = 5.5;
  const patientDataX = xLeft; // Alineado con el contenido
  
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

export default function Coprocultivo_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

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
    // === HEADER ===
    drawHeader(doc, datos);
    
    // === TÍTULO ===
    let y = 28;
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.text("COPROCULTIVO", pageW / 2, y, { align: "center" });
    y += 12; // Aumentado de 10 a 12 para más separación
    
    // === DATOS DEL PACIENTE ===
    const xLeft = margin * 2;
    y = drawPatientData(doc, datos, xLeft, y);
    
    // === RESULTADOS ===
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("RESULTADOS:", xLeft, y);
    y += 8;

    // --- COPROCULTIVO – MUESTRA ---
    doc.setFont("helvetica", "bold").setFontSize(10);
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
    doc.text(datos.txtresultado, xLeft + 85, y-2, { align: "right" });
    y += 8;

    // Mensajes fijos de resultados
    doc.text(
      datos.txtobservaciones ||" ",
      xLeft,
      y-2
    );

    

    // === FOOTER ===
    footerTR(doc, { ...datos, footerOffsetY: 16 });

    // === Imprimir ===
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();

  })
  
}
