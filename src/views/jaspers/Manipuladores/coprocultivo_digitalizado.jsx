// src/views/jaspers/Manipuladores/coprocultivo_digitalizado.jsx
import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';

// --- Configuración Centralizada ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 115,
  fontSize: {
    title: 14,
    header: 9,
    body: 9,
  },
  font: 'helvetica',
  lineHeight: 7,
};

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha;
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
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

// Función para dibujar datos del paciente en tabla
const drawPatientData = (doc, datos = {}) => {
  const tablaInicioX = 15;
  const tablaAncho = 180;
  const filaAltura = 5;
  let yPos = 43;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const sexo = datos.sexoPaciente === 'F' ? 'FEMENINO' : datos.sexoPaciente === 'M' ? 'MASCULINO' : '';

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Nombres y Apellidos:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nombres || '', tablaInicioX + 40, yPos + 3.5);
  yPos += filaAltura;

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
  doc.text("T. Examen:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nombreExamen || '', tablaInicioX + 25, yPos + 3.5);
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

export default async function Coprocultivo_Digitalizado(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  await drawHeader(doc, datos);

  // === TÍTULO ===
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("COPROCULTIVO", pageW / 2, 38, { align: "center" });

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

  await Promise.all([
    isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
    isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
  ]).then(([s1, s2]) => {

    let y = finalYPos + 10; // Posición inicial después de la tabla de datos con espacio adicional

    // --- COPROCULTIVO – MUESTRA ---
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text("COPROCULTIVO – MUESTRA", config.margin, y);
    y += config.lineHeight;

    doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
    const colData = 55; // Posición fija para los datos (alineados)
    const muestraData = [
      ["Muestra", datos.txtmuestra || ""],
      ["Color", datos.txtcolor || ""],
      ["Consistencia", datos.txtconsistencia || ""],
      ["Moco Fecal", datos.txtmoco_fecal || ""],
      ["Sangre Visible", datos.txtsangrev || ""],
      ["Restos Alimenticios", datos.txtrestosa || ""],
    ];
    muestraData.forEach(([label, val]) => {
      doc.text(label, config.margin, y);
      doc.text(":", colData - 5, y);
      doc.text(String(val).toUpperCase(), colData, y);
      y += config.lineHeight;
    });

    // --- COPROCULTIVO – EXAMEN MICROSCÓPICO ---
    y += 3;
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text("COPROCULTIVO – EXAMEN MICROSCÓPICO", config.margin, y);
    y += config.lineHeight;

    doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
    const microscopicoData = [
      ["Leucocitos", datos.txtleucocitos || ""],
      ["Hematíes", datos.txthematies || ""],
      ["Parásitos", datos.txtparasitos || ""],
      ["Gotas de grasa", datos.txtgotasg || ""],
      ["Levaduras", datos.txtlevaduras || ""],
    ];
    microscopicoData.forEach(([label, val]) => {
      doc.text(label, config.margin, y);
      doc.text(":", colData - 5, y);
      doc.text(String(val).toUpperCase(), colData, y);
      y += config.lineHeight;
    });

    // --- COPROCULTIVO – IDENTIFICACIÓN Y ANTIBIOGRAMA ---
    y += 3;
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text("COPROCULTIVO – IDENTIFICACIÓN Y ANTIBIOGRAMA", config.margin, y);
    y += config.lineHeight;

    doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
    doc.text("Identificación", config.margin, y);
    doc.text(":", colData - 5, y);
    doc.text(datos.txtidentificacion || "", colData, y);
    y += config.lineHeight;
    doc.text("Flora Coliforme", config.margin, y);
    doc.text(":", colData - 5, y);
    doc.text(datos.txtflorac || "", colData, y);
    y += config.lineHeight;

    // Comentario
    doc.setFont(config.font, "italic").setFontSize(config.fontSize.body);
    doc.text("Comentario: (*) Pertenece a la flora normal", config.margin, y);
    y += config.lineHeight * 1.5;

    // --- COPROCULTIVO – RESULTADO ---
    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text("COPROCULTIVO – RESULTADO", config.margin, y);
    y += config.lineHeight;

    doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
    doc.text("Resultado", config.margin, y);
    doc.text(":", colData - 5, y);
    doc.text(datos.txtresultado || "", colData, y);
    y += config.lineHeight;

    // Observaciones (con salto de línea)
    if (datos.txtobservaciones) {
      const lineas = datos.txtobservaciones.split('\n');
      lineas.forEach(linea => {
        doc.text(linea, config.margin, y);
        y += config.lineHeight;
      });
    }

    // Sellos
    const sigW = 53;
    const sigH = 23;
    const sigY = 205;
    const gap = 8;
    const sigX = pageW / 2 + 20;

    const addSelloVertical = (img, xPos, yPos) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const selloBase64 = canvas.toDataURL('image/png');
        doc.addImage(selloBase64, 'PNG', xPos, yPos, sigW, sigH);
    };

    if (s1 && s2) {
      addSelloVertical(s1, sigX, sigY);
      addSelloVertical(s2, sigX, sigY + sigH + gap);
    } else if (s1) {
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      doc.addImage(selloBase64, 'PNG', sigX, sigY, sigW, sigH);
    } else if (s2) {
      const canvas = document.createElement('canvas');
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      doc.addImage(selloBase64, 'PNG', sigX, sigY, sigW, sigH);
    }

    // === FOOTER ===
    footerTR(doc, datos);
  });
  
  if (docExistente) {
    return doc;
  } else {
    imprimir(doc);
  }
}
function imprimir(doc) {
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}

