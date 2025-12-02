// src/views/jaspers/Toxicologia/Panel2d_Digitalizado.jsx
import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';

// --- Configuración Centralizada ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 100,
  col3X: 170,
  fontSize: {
    title: 14,
    header: 9,
    body: 9,
  },
  font: 'helvetica',
  lineHeight: 7,
};

// --- Funciones de Ayuda ---

const drawResultRow = (doc, y, label, result, units) => {
  doc.setFont(config.font, 'normal').setFontSize(config.fontSize.body);
  doc.text(label || "", config.col1X, y);
  doc.text(String(result || ""), config.col2X, y, { align: "center" });
  doc.text(String(units || ""), config.col3X, y, { align: "center" });
  return y + config.lineHeight;
};

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
    text: datos.textoColor ,
    x: pageW - 30,
    y: 10,
    size: 22,
    showLine: true,
    fontSize: 30,
    textPosition: 0.9
  });
};

// Función para dibujar datos del paciente en tabla
const drawPatientData = (doc, datos = {}) => {
  const tablaInicioX = 15;
  const tablaAncho = 180;
  const filaAltura = 5;
  let yPos = 43;

  // Header DATOS PERSONALES
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const sexo = datos.sexoPaciente === 'F' ? 'FEMENINO' : datos.sexoPaciente === 'M' ? 'MASCULINO' : '';

  // Fila 1: Nombres y Apellidos (fila completa)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Nombres y Apellidos:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nombres || datos.nombresPaciente || '', tablaInicioX + 40, yPos + 3.5);
  yPos += filaAltura;

  // Fila 2: DNI | Edad | Sexo
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.dni || ''), tablaInicioX + 12, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Edad:", tablaInicioX + 47, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text((datos.edad || '') + " AÑOS", tablaInicioX + 58, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Sexo:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(sexo, tablaInicioX + 105, yPos + 3.5);
  yPos += filaAltura;

  // Fila 3: Lugar Nacimiento | Estado Civil
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

  // Fila 4: Tipo Examen | Fecha Nac.
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

  // Fila 5: Nivel de Estudio (fila completa)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Nivel de Estudio:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nivelEstudioPaciente || '', tablaInicioX + 32, yPos + 3.5);
  yPos += filaAltura;

  // Fila 6: Ocupación (fila completa)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Ocupación:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.ocupacionPaciente || '', tablaInicioX + 25, yPos + 3.5);
  yPos += filaAltura;

  // Fila 7: Cargo (fila completa)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Cargo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.cargoPaciente || '', tablaInicioX + 18, yPos + 3.5);
  yPos += filaAltura;

  // Fila 8: Área (fila completa)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Área:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.areaPaciente || '', tablaInicioX + 15, yPos + 3.5);
  yPos += filaAltura;

  // Fila 9: Empresa (fila completa)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Empresa:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.empresa || '', tablaInicioX + 20, yPos + 3.5);
  yPos += filaAltura;

  // Fila 10: Contrata (fila completa)
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Contrata:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.contrata || '', tablaInicioX + 22, yPos + 3.5);
  yPos += filaAltura;

  return yPos;
};

// --- Componente Principal ---

export default function Panel2d_Digitalizado(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  drawHeader(doc, datos);
  
  // === TÍTULO ===
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("TOXICOLÓGICO", pageW / 2, 38, { align: "center" });
  
  // === DATOS DEL PACIENTE ===
  const finalYPos = drawPatientData(doc, datos);
  
  const sello1 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const sello2 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMADOCASIG");
  const isValidUrl = url => url && url !== "Sin registro" && url;
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
    let y = finalYPos + 10;

    // Muestra y Método
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
    doc.text("MUESTRA :", config.margin, y);
    doc.setFont(config.font, "normal");
    doc.text(datos.muestra || "ORINA", config.margin + 30, y);
    y += config.lineHeight;

    doc.setFont(config.font, "bold");
    doc.text("MÉTODO :", config.margin, y);
    doc.setFont(config.font, "normal");
    doc.text(datos.txtMetodo || "", config.margin + 30, y);
    y += config.lineHeight * 2;

    // Encabezado de tabla
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text("PRUEBA CUALITATIVO", config.col1X, y);
    doc.text("RESULTADOS", config.col2X, y, { align: 'center' });
    doc.text("UNIDADES", config.col3X, y, { align: 'center' });
    y += 3;

    // Línea
    doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
    y += config.lineHeight;

    // Título del Panel
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
    doc.text("PANEL DROGAS 2D", config.col1X, y);
    y += config.lineHeight;

    // Datos
    const tests = [
      { label: "Cocaína (COC)", key: "reCocaina" },
      { label: "Marihuana(THC)", key: "reMarihuana" },
    ];
    
    tests.forEach(({ label, key }) => {
      const value = datos[key] != null ? datos[key] : "NEGATIVO";
      y = drawResultRow(doc, y, label, value, "S/U");
    });
    
    // Centrar los sellos en la hoja - Mismo tamaño fijo para ambos
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

    // === FOOTER ===
    footerTR(doc, { footerOffsetY: 8 });

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
  }).catch(error => {
    console.error("Error al cargar imágenes:", error);
    // Continuar con la impresión aunque falle la carga de imágenes
    footerTR(doc, { footerOffsetY: 8 });
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
