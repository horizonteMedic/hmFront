import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  drawPatientDataRow("DNI :", datos.dni || datos.dniPaciente || '');
  
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

export default function Hematologia_Digitalizado(datos) {
  const doc = new jsPDF();
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

  // Título principal
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.text('HEMOGRAMA AUTOMATIZADO', 105, y, { align: 'center' });
  doc.setFontSize(11);

  y += 6;
  autoTable(doc, {
    startY: y,
    head: [[
      { content: 'PRUEBA', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: 'RESULTADO', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: 'VALORES NORMALES', styles: { halign: 'center', fontStyle: 'bold' } }
    ]],
    body: [
      [
        { content: 'HEMOGLOBINA', styles: { fontStyle: 'bold' } },
        datos.txtHemoglobina || '',
        'Mujeres 12 - 16 g/dL\nHombres 14 - 18 g/dL'
      ],
      [
        { content: 'HEMATOCRITO', styles: { fontStyle: 'bold' } },
        datos.txtHematocrito || '',
        'Mujeres 38 - 50 %\nHombres 40 - 54 %'
      ],
      [
        { content: 'HEMATÍES', styles: { fontStyle: 'bold' } },
        datos.txtHematies || '',
        '4.0 - 5.5 x 10^6/mm³'
      ],
      ['Volumen Corpuscular Medio', datos.txtVolumen || '', '80 - 100 fL'],
      ['Hemoglobina Corpuscular Media', datos.txtHemocorpuscular || '', '26 - 34 pg'],
      ['Concentración de la Hemoglobina Corpuscular Media', datos.txtConcentracion || '', '31 - 37  g/dl'],
      [
        { content: 'LEUCOCITOS', styles: { fontStyle: 'bold' } },
        datos.txtLeucocitos || '',
        '4 - 10 x 10^3/mm³'
      ],
      [
        { content: 'RECUENTO DIFERENCIAL', styles: { fontStyle: 'bold' } },
        '',
        ''
      ],
      [
        { content: 'NEUTRÓFILOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtNeutrofilos || '',
        '55-65 %'
      ],
      [
        { content: 'ABASTONADOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtAbastonados || '',
        '0 - 5 %'
      ],
      [
        { content: 'SEGMENTADOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtSegmentados || '',
        '55 - 65 %'
      ],
      [
        { content: 'MONOCITOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtMonocitos || '',
        '4 - 8 %'
      ],
      [
        { content: 'EOSINÓFILOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtEosinofios || '',
        '0 - 4 %'
      ],
      [
        { content: 'BASÓFILOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtBasofilos || '',
        '0 - 1 %'
      ],
      [
        { content: 'LINFOCITOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtLinfocitos || '',
        '20 - 40 %'
      ],
      [
        { content: 'PLAQUETAS', styles: { fontStyle: 'bold' } },
        datos.txtPlaquetas || '',
        '1.5 - 4.5 x 10^5/mm³'
      ],
    ],
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 65 },
      1: { cellWidth: 35 },
      2: { cellWidth: 60 }
    },
    margin: { left: 15, right: 15 },
    tableWidth: 180,
    didDrawPage: () => {}
  });
    // Centrar los sellos en la hoja - Mismo tamaño fijo para ambos
    const sigW = 53; // Tamaño fijo width
    const sigH = 23; // Tamaño fijo height
    const sigY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 210;
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

  // Mostrar PDF
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = function () {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
  })
  
} 