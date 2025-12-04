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
  const tablaInicioX = 15;
  const tablaAncho = 180;
  const filaAltura = 5;
  let yPos = 43;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const sexo = datos.sexoPaciente === 'F' ? 'FEMENINO' : datos.sexoPaciente === 'M' ? 'MASCULINO' : '';

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Nombres y Apellidos:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nombres || datos.nombresPaciente || '', tablaInicioX + 40, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.dni || datos.dniPaciente || ''), tablaInicioX + 12, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Edad:", tablaInicioX + 47, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text((datos.edad || datos.edadPaciente || '') + " AÑOS", tablaInicioX + 58, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Sexo:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(sexo, tablaInicioX + 105, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Lugar de Nacimiento:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.lugarNacimientoPaciente || '', tablaInicioX + 38, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Estado Civil:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.estadoCivilPaciente || '', tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Tipo Examen:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nombreExamen || '', tablaInicioX + 28, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha Nac.:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(toDDMMYYYY(datos.fechaNacimientoPaciente || ''), tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Nivel de Estudio:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nivelEstudioPaciente || '', tablaInicioX + 32, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Ocupación:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.ocupacionPaciente || '', tablaInicioX + 25, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Cargo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.cargoPaciente || '', tablaInicioX + 18, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Área:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.areaPaciente || '', tablaInicioX + 15, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Empresa:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.empresa || '', tablaInicioX + 20, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Contrata:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.contrata || '', tablaInicioX + 22, yPos + 3.5);
  yPos += filaAltura;

  return yPos;
};

export default function LHepatitisB_Digitalizado(datos) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  
  // === HEADER ===
  drawHeader(doc, datos);
  
  // === TÍTULO ===
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("INMUNOLOGÍA", pageW / 2, 38, { align: "center" });
  
  // === DATOS DEL PACIENTE ===
  const finalYPos = drawPatientData(doc, datos);

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

    let y = finalYPos + 10; // Posición inicial después de la tabla de datos con espacio adicional

  // Muestra y método
  autoTable(doc, {
    startY: y,
    body: [
      [{ content: 'MUESTRA : SUERO', styles: { fontStyle: 'bold' } }],
      [{ content: 'MÉTODO : INMUNOENSAYO CROMATOGRÁFICO', styles: { fontStyle: 'bold' } }]
    ],
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1 },
    margin: { left: 15, right: 15 },
    tableWidth: 180
  });

  // Tabla de resultado
  let yTable = doc.lastAutoTable.finalY + 8;
  // Encabezados
  doc.setFont('helvetica', 'bold');
  doc.text('PRUEBA CUALITATIVO', 15, yTable);
  doc.text('RESULTADO', 105 + 40, yTable, { align: 'left' });
  yTable += 3;
  doc.setLineWidth(0.3);
  doc.line(15, yTable, doc.internal.pageSize.getWidth() - 15, yTable);
  doc.setLineWidth(0.2);
  yTable += 8;
  // Fila de datos
  doc.setFont('helvetica', 'normal');
  doc.text(`HEPATITIS B (HBsAg) - ${datos.txtMarca || ''}`, 15, yTable);
  doc.text(datos.txtHepatitisb || '', 105 + 40, yTable, { align: 'left' });

  // Centrar los sellos en la hoja - Mismo tamaño fijo para ambos
  const pageW = doc.internal.pageSize.getWidth();
  const sigW = 53; // Tamaño fijo width
  const sigH = 23; // Tamaño fijo height
  const sigY = 210;
  const gap = 16; // Espacio entre sellos (reducido 4mm: 20 - 4 = 16)
  
  if (s1 && s2) {
    // Si hay dos sellos, centrarlos juntos
    const totalWidth = sigW * 2 + gap;
    const startX = (pageW - totalWidth) / 2;
    
    // Sello 1 (izquierda) - Tamaño fijo
    const canvas1 = document.createElement('canvas');
    canvas1.width = s1.width;
    canvas1.height = s1.height;
    const ctx1 = canvas1.getContext('2d');
    ctx1.drawImage(s1, 0, 0);
    const selloBase64_1 = canvas1.toDataURL('image/png');
    
    // Usar tamaño fijo para ambos sellos
    const imgX1 = startX;
    const imgY1 = sigY;
    doc.addImage(selloBase64_1, 'PNG', imgX1, imgY1, sigW, sigH);
    
    // Sello 2 (derecha) - Mismo tamaño fijo
    const canvas2 = document.createElement('canvas');
    canvas2.width = s2.width;
    canvas2.height = s2.height;
    const ctx2 = canvas2.getContext('2d');
    ctx2.drawImage(s2, 0, 0);
    const selloBase64_2 = canvas2.toDataURL('image/png');
    
    const sigX2 = startX + sigW + gap;
    const imgX2 = sigX2;
    const imgY2 = sigY;
    doc.addImage(selloBase64_2, 'PNG', imgX2, imgY2, sigW, sigH);
  } else if (s1) {
    // Si solo hay un sello, centrarlo con tamaño fijo
    const canvas = document.createElement('canvas');
    canvas.width = s1.width;
    canvas.height = s1.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(s1, 0, 0);
    const selloBase64 = canvas.toDataURL('image/png');
    
    const sigX = (pageW - sigW) / 2;
    const imgX = sigX;
    const imgY = sigY;
    doc.addImage(selloBase64, 'PNG', imgX, imgY, sigW, sigH);
  } else if (s2) {
    // Si solo hay el segundo sello, centrarlo con tamaño fijo
    const canvas = document.createElement('canvas');
    canvas.width = s2.width;
    canvas.height = s2.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(s2, 0, 0);
    const selloBase64 = canvas.toDataURL('image/png');
    
    const sigX = (pageW - sigW) / 2;
    const imgX = sigX;
    const imgY = sigY;
    doc.addImage(selloBase64, 'PNG', imgX, imgY, sigW, sigH);
  }

  footerTR(doc, { ...datos, footerOffsetY: 8 });

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