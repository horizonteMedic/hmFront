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
const drawHeader = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

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
    color: datos.codigoColor,
    text: datos.textoColor,
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

export default async function Hematologia_Digitalizado(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  await drawHeader(doc, datos);

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

    // Márgenes y estilos
    const margin = 15;
    let y = 70; // Posición inicial más cerca de los datos del paciente
    const lineHeight = 6;
    const lineHeightSmall = 5;
    const col1 = margin;
    const col2 = margin + 75;
    const col3 = margin + 120;
    const indent = 8;

    // Título principal
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text("HEMOGRAMA AUTOMATIZADO", doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y += lineHeight + 2;

    // Encabezados
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("PRUEBA", col1, y);
    doc.text("RESULTADO", col2 + 17.5, y, { align: 'center' });
    doc.text("VALORES NORMALES", col3, y);
    y += lineHeight + 1;

    // --- BLOQUE 1 ---
    doc.setFont('helvetica', 'bold');
    doc.text("HEMOGLOBINA", col1, y); doc.setFont('helvetica', 'normal');
    doc.text(`${datos.txtHemoglobina}`, col2 + 17.5, y, { align: 'center' }); doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text("Mujeres 12 - 16 g/dL", col3, y);
    y += lineHeightSmall;
    doc.text("Hombres 14 - 18 g/dL", col3, y);
    y += lineHeight + 1;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("HEMATOCRITO", col1, y); doc.setFont('helvetica', 'normal');
    doc.text(`${datos.txtHematocrito}`, col2 + 17.5, y, { align: 'center' }); doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text("Mujeres 38 - 50 %", col3, y);
    y += lineHeightSmall;
    doc.text("Hombres 40 - 54 %", col3, y);
    y += lineHeight + 1;

    // --- BLOQUE 2 ---
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("HEMATÍES", col1, y); doc.setFont('helvetica', 'normal');
    doc.text(`${datos.txtHematies}`, col2 + 17.5, y, { align: 'center' }); doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text("4.0 - 5.5 x 10^6/mm³", col3, y);
    y += lineHeight;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("Volumen Corpuscular Medio", col1 + indent, y);
    doc.text(`${datos.txtVolumen}`, col2 + 17.5, y, { align: 'center' }); doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text("80 - 100 fL", col3, y);
    y += lineHeight;
    doc.setFontSize(10);
    doc.text("Hemoglobina Corpuscular Media", col1 + indent, y);
    doc.text(`${datos.txtHemocorpuscular}`, col2 + 17.5, y, { align: 'center' }); doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text("26 - 34 pg", col3, y);
    y += lineHeight;
    doc.setFontSize(10);
    doc.text("Concentración de la Hemoglobina", col1 + indent, y);
    y += lineHeightSmall;
    doc.text("Corpuscular Media", col1 + indent, y);
    doc.text(`${datos.txtConcentracion}`, col2 + 17.5, y, { align: 'center' }); doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text("31 - 37 g/dl", col3, y - lineHeightSmall);
    y += lineHeight + 1;

    // --- BLOQUE 3 ---
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("LEUCOCITOS", col1, y); doc.setFont('helvetica', 'normal');
    doc.text(`${datos.txtLeucocitos}`, col2 + 17.5, y, { align: 'center' }); doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text("4 - 10 x 10^3/mm³", col3, y);
    y += lineHeight + 1;

    // --- BLOQUE 4 ---
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("RECUENTO DIFERENCIAL", col1, y);
    y += lineHeight;
    // Subgrupos
    const subgrupos = [
      { label: "NEUTRÓFILOS (%)", key: "txtNeutrofilos", normal: "55 - 65 %" },
      { label: "ABASTONADOS (%)", key: "txtAbastonados", normal: "0 - 5 %" },
      { label: "SEGMENTADOS (%)", key: "txtSegmentados", normal: "55 - 65 %" },
      { label: "MONOCITOS (%)", key: "txtMonocitos", normal: "4 - 8 %" },
      { label: "EOSINÓFILOS (%)", key: "txtEosinofios", normal: "0 - 4 %" },
      { label: "BASÓFILOS (%)", key: "txtBasofilos", normal: "0 - 1 %" },
      { label: "LINFOCITOS (%)", key: "txtLinfocitos", normal: "20 - 40 %" },
    ];
    subgrupos.forEach(({ label, normal, key }) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, col1 + indent, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      // Muestra el valor desde datos, si no existe muestra "-"
      const value = datos[key] ?? "-";
      doc.text(String(value), col2 + 17.5, y, { align: 'center' });  // Valor centrado
      doc.text(normal, col3, y);         // Rango normal

      doc.setFontSize(10);
      y += lineHeight;
    });
    y += 1;

    // --- BLOQUE 5 ---
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("PLAQUETAS", col1, y); doc.setFont('helvetica', 'normal');
    doc.text(`${datos.txtPlaquetas}`, col2 + 17.5, y, { align: 'center' }); doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text("1.5 - 4.5 x 10^5/mm³", col3, y);
    y += lineHeight;

    // Centrar los sellos en la hoja - Mismo tamaño fijo para ambos
    const sigW = 53; // Tamaño fijo width
    const sigH = 23; // Tamaño fijo height
    const sigY = y + 8; // Reducido de 20 a 8 para acercar la firma
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
