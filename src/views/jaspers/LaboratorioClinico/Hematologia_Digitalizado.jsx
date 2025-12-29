import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { convertirGenero } from "../../utils/helpers.js";

<<<<<<< HEAD
export default function Hematologia_Digitalizado_nuevo(data = {}) {
=======
// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha;
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

export default async function Hematologia_Digitalizado_nuevo(data = {}) {
>>>>>>> 26e624014566d7a1c94a7d61ccf7ba918c25e50a
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // === MAPEO DE DATOS ===
  const datosReales = {
    // Datos Personales del Paciente
    apellidosNombres: String(data.nombres || ""),
    documentoIdentidad: String(data.dni || ""),
    edad: String(data.edad || ""),
    sexo: convertirGenero(data.sexoPaciente || ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente || ""),
    lugarNacimiento: String(data.lugarNacimientoPaciente || ""),
    estadoCivil: String(data.estadoCivilPaciente || ""),
    nivelEstudio: String(data.nivelEstudioPaciente || ""),
    ocupacion: String(data.ocupacionPaciente || ""),
    // Datos Laborales
    cargo: String(data.cargoPaciente || ""),
    areaTrabajo: String(data.areaPaciente || ""),
    // Datos del Documento/Examen
    numeroFicha: String(data.norden || ""),
    codigoClinica: String(data.codigoClinica || ""),
    nombreExamen: String(data.nombreExamen || ""),
    fechaExamen: formatearFechaCorta(data.fechaExamen || ""),
    sede: String(data.sede || ""),
    // Datos de Color
    color: data.color || "",
    codigoColor: data.codigoColor || "",
    textoColor: data.textoColor || "",
    // Digitalización
    digitalizacion: data.digitalizacion || [],
  };

  // === FUNCIONES AUXILIARES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 6;

  // Header reutilizable
<<<<<<< HEAD
  const drawHeader = (pageNumber) => {
    CabeceraLogo(doc, { ...datosReales, tieneMembrete: false, yOffset: 13 });

    // Título principal
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("HEMOGRAMA AUTOMATIZADO", pageW / 2, 42, { align: "center" });
=======
  const drawHeader = async () => {
    await CabeceraLogo(doc, { ...datosReales, tieneMembrete: false });
>>>>>>> 26e624014566d7a1c94a7d61ccf7ba918c25e50a

    // Número de Ficha y Página
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("Nro de ficha: ", pageW - 80, 13);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosReales.numeroFicha, pageW - 60, 14);
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("Sede: " + datosReales.sede, pageW - 80, 18);
    doc.text("Fecha de examen: " + datosReales.fechaExamen, pageW - 80, 23);
    doc.text("Código Clínica: " + datosReales.codigoClinica, pageW - 80, 28);

    // Bloque de color
    drawColorBox(doc, {
      color: datosReales.codigoColor,
      text: datosReales.textoColor,
      x: pageW - 30,
      y: 8,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  };

  // Función para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);
    return yPos + alturaHeader;
  };

  // Función para dibujar texto con superíndices (ej: "10^6" -> "10" con "6" arriba)
  const drawTextWithSuperscript = (text, x, y) => {
    const parts = text.split(/(\^[0-9]+)/);
    let currentX = x;

    parts.forEach((part) => {
      if (part.startsWith('^')) {
        // Superíndice
        const superNum = part.substring(1);
        doc.setFontSize(6);
        doc.text(superNum, currentX, y - 1.5);
        currentX += doc.getTextWidth(superNum);
        doc.setFontSize(9);
      } else {
        doc.setFontSize(9);
        doc.text(part, currentX, y);
        currentX += doc.getTextWidth(part);
      }
    });
  };

  // === DIBUJAR HEADER ===
<<<<<<< HEAD
  drawHeader(1);
=======
  await drawHeader();
>>>>>>> 26e624014566d7a1c94a7d61ccf7ba918c25e50a

  // === SECCIÓN 1: DATOS PERSONALES ===
  let yPos = 46;

  yPos = dibujarHeaderSeccion("DATOS PERSONALES", yPos, filaAltura);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres | T. Examen (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosReales.apellidosNombres, tablaInicioX + 40, yPos + 3.5);
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("T. Examen:", tablaInicioX + 132, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosReales.nombreExamen, tablaInicioX + 152, yPos + 3.5);
  yPos += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.documentoIdentidad, tablaInicioX + 12, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("Edad:", tablaInicioX + 47, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.edad + " Años", tablaInicioX + 58, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("Sexo:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.sexo.toUpperCase(), tablaInicioX + 105, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("Fecha Nac.:", tablaInicioX + 137, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.fechaNacimiento, tablaInicioX + 155, yPos + 3.5);
  yPos += filaAltura;

  // Tercera fila: Lugar Nacimiento, Estado Civil (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold");
  doc.text("Lugar de Nacimiento:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.lugarNacimiento, tablaInicioX + 38, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("Estado Civil:", tablaInicioX + 102, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.estadoCivil, tablaInicioX + 125, yPos + 3.5);
  yPos += filaAltura;

  // Cuarta fila: Nivel de Estudio (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold");
  doc.text("Nivel de Estudio:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.nivelEstudio, tablaInicioX + 32, yPos + 3.5);
  yPos += filaAltura;

  // Quinta fila: Ocupación (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold");
  doc.text("Ocupación:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.ocupacion, tablaInicioX + 25, yPos + 3.5);
  yPos += filaAltura;

  // Sexta fila: Cargo (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold");
  doc.text("Cargo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.cargo, tablaInicioX + 18, yPos + 3.5);
  yPos += filaAltura;

  // Séptima fila: Área (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold");
  doc.text("Área:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.areaTrabajo, tablaInicioX + 15, yPos + 3.5);
  yPos += filaAltura;

  // Sexta fila: T. Examen (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold");
  doc.text("Tipo de Examen:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.nombreExamen, tablaInicioX + 32, yPos + 3.5);
  yPos += filaAltura;

  // === SECCIÓN 2: HEMOGRAMA (Tabla 3 columnas: PRUEBA | RESULTADO | VALORES NORMALES) ===
  const mitadTabla = tablaAncho / 2;

  // Header de la tabla
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("PRUEBA", tablaInicioX + 35, yPos + 3.5, { align: "center" });
  doc.text("RESULTADO", tablaInicioX + 95, yPos + 3.5, { align: "center" });
  doc.text("VALORES NORMALES", tablaInicioX + 155, yPos + 3.5, { align: "center" });
  
  // Líneas verticales del header
  doc.line(tablaInicioX + 70, yPos, tablaInicioX + 70, yPos + filaAltura);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
  yPos += filaAltura;

  // Datos del hemograma (3 columnas)
  const hemogramaData = [
    { prueba: "Hemoglobina", resultado: data.txtHemoglobina || "", normal: "Mujeres 12 - 16 g/dL\nHombres 14 - 18 g/dL", bold: true },
    { prueba: "Hematocrito", resultado: data.txtHematocrito || "", normal: "Mujeres 38 - 50 %\nHombres 40 - 54 %", bold: true },
    { prueba: "Hematíes", resultado: data.txtHematies || "", normal: "4.0 - 5.5 x 10^6/mm3", bold: true },
    { prueba: "Volumen Corpuscular Medio", resultado: data.txtVolumen || "", normal: "80 - 100 fL", bold: false },
    { prueba: "Hemoglobina Corpuscular Media", resultado: data.txtHemocorpuscular || "", normal: "26 - 34 pg", bold: false },
    { prueba: "Concentración de la Hemoglobina\nCorpuscular Media", resultado: data.txtConcentracion || "", normal: "31 - 37 g/dl", bold: false },
    { prueba: "Leucocitos", resultado: data.txtLeucocitos || "", normal: "4 - 10 x 10^3/mm3", bold: true },
    { prueba: "Plaquetas", resultado: data.txtPlaquetas || "", normal: "1.5 - 4.5 x 10^5/mm3", bold: true },
    { prueba: "Recuento Diferencial", resultado: "", normal: "", bold: true, isHeader: true, grayBg: true },
    { prueba: "Neutrófilos (%)", resultado: data.txtNeutrofilos || "", normal: "55-65 %", bold: true, indent: true },
    { prueba: "Abastonados (%)", resultado: data.txtAbastonados || "", normal: "0 - 5 %", bold: true, indent: true },
    { prueba: "Segmentados (%)", resultado: data.txtSegmentados || "", normal: "55 - 65 %", bold: true, indent: true },
    { prueba: "Monocitos (%)", resultado: data.txtMonocitos || "", normal: "4 - 8 %", bold: true, indent: true },
    { prueba: "Eosinófilos (%)", resultado: data.txtEosinofios || "", normal: "0 - 4 %", bold: true, indent: true },
    { prueba: "Basófilos (%)", resultado: data.txtBasofilos || "", normal: "0 - 1 %", bold: true, indent: true },
    { prueba: "Linfocitos (%)", resultado: data.txtLinfocitos || "", normal: "20 - 40 %", bold: true, indent: true },
  ];

  // Calcular altura de cada fila (algunas tienen 2 líneas)
  hemogramaData.forEach((item) => {
    const lines = item.prueba.split('\n').length;
    const normalLines = item.normal.split('\n').length;
    const maxLines = Math.max(lines, normalLines);
    const rowHeight = maxLines > 1 ? filaAltura * 1.8 : filaAltura;

    // Dibujar celda
    doc.setLineWidth(0.2);
    
    // Fondo gris para RECUENTO DIFERENCIAL
    if (item.grayBg) {
      doc.setFillColor(196, 196, 196);
      doc.rect(tablaInicioX, yPos, tablaAncho, rowHeight, 'FD');
    } else {
      doc.rect(tablaInicioX, yPos, tablaAncho, rowHeight);
    }
    
    doc.line(tablaInicioX + 70, yPos, tablaInicioX + 70, yPos + rowHeight);
    doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + rowHeight);

    // Contenido
    doc.setFontSize(9);
    
    // Calcular centrado vertical
    const textHeight = maxLines * 3.5;
    const centroY = yPos + (rowHeight - textHeight) / 2 + 3;
    
    // Prueba
    if (item.bold) {
      doc.setFont("helvetica", "bold");
    } else {
      doc.setFont("helvetica", "normal");
    }
    
    // Los textos no bold o con indent van 4mm más a la derecha
    const pruebaX = (!item.bold || item.indent) ? tablaInicioX + 6 : tablaInicioX + 2;
    
    if (item.prueba.includes('\n')) {
      const pruebaLines = item.prueba.split('\n');
      pruebaLines.forEach((line, idx) => {
        doc.text(line, pruebaX, centroY + (idx * 3.5));
      });
    } else {
      // Centrado vertical para filas de 1 línea en celdas altas
      const singleLineY = yPos + rowHeight / 2 + 1;
      doc.text(item.prueba, pruebaX, singleLineY);
    }

    // Resultado (centrado horizontal y vertical)
    doc.setFont("helvetica", "normal");
    const resultadoY = yPos + rowHeight / 2 + 1;
    doc.text(item.resultado, tablaInicioX + 95, resultadoY, { align: "center" });

    // Valores normales (centrado vertical)
    if (item.normal.includes('\n')) {
      const normalLinesArr = item.normal.split('\n');
      normalLinesArr.forEach((line, idx) => {
        if (line.includes('^')) {
          drawTextWithSuperscript(line, tablaInicioX + 126, centroY + (idx * 3.5));
        } else {
          doc.text(line, tablaInicioX + 126, centroY + (idx * 3.5));
        }
      });
    } else {
      const normalY = yPos + rowHeight / 2 + 1;
      if (item.normal.includes('^')) {
        drawTextWithSuperscript(item.normal, tablaInicioX + 126, normalY);
      } else {
        doc.text(item.normal, tablaInicioX + 126, normalY);
      }
    }

    yPos += rowHeight;
  });

  // === SECCIÓN 4: FIRMA ===
  const alturaFilaFirmas = 30;
  
  // Dibujar fila de firma (centrada)
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaFirmas);

  // Firma centrada en toda la fila
  const centroFirma = tablaInicioX + tablaAncho / 2;
  const sello1 = data.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
<<<<<<< HEAD
  if (sello1 && sello1.url && sello1.url !== "Sin registro") {
    try {
      doc.addImage(sello1.url, 'PNG', centroFirma - 22, yPos + 5, 45, 20);
    } catch (error) {
      console.log("Error cargando firma:", error);
=======
  const sello2 = data.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMADOCASIG");
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
    const sigW = 53;
    const sigH = 23;
    const sigY = yPos + 20;
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
>>>>>>> 26e624014566d7a1c94a7d61ccf7ba918c25e50a
    }
  }

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 7 });

  // === IMPRIMIR ===
  imprimir(doc);
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
