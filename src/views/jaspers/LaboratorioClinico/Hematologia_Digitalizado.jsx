import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { convertirGenero } from "../../utils/helpers.js";

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha;
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

export default function Hematologia_Digitalizado_nuevo(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // === MAPEO DE DATOS ===
  const datosReales = {
    // Datos Personales del Paciente
    apellidosNombres: String(data.nombres || data.nombresPaciente || ""),
    documentoIdentidad: String(data.dniPaciente || data.dni || ""),
    edad: String(data.edadPaciente || data.edad || ""),
    sexo: convertirGenero(data.sexoPaciente || ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente || ""),
    lugarNacimiento: String(data.lugarNacimientoPaciente || ""),
    estadoCivil: String(data.estadoCivilPaciente || ""),
    nivelEstudio: String(data.nivelEstudioPaciente || ""),
    ocupacion: String(data.ocupacionPaciente || ""),
    // Datos Laborales
    cargo: String(data.cargoPaciente || ""),
    areaTrabajo: String(data.areaPaciente || ""),
    empresa: String(data.empresa || ""),
    contrata: String(data.contrata || ""),
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

  // Header reutilizable
  const drawHeader = () => {
    CabeceraLogo(doc, { ...datosReales, tieneMembrete: false });

    // Número de Ficha y Página
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosReales.numeroFicha, pageW - 50, 16);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosReales.sede, pageW - 80, 20);
    doc.text("Fecha de examen: " + datosReales.fechaExamen, pageW - 80, 25);
    doc.text("Código Clínica: " + datosReales.codigoClinica, pageW - 80, 30);
    doc.text("Pag. 01", pageW - 30, 10);

    // Bloque de color
    drawColorBox(doc, {
      color: datosReales.codigoColor,
      text: datosReales.textoColor,
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
    doc.text(datos.nombres || datos.nombresPaciente || '', tablaInicioX + 40, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(String(datos.dniPaciente || datos.dni || ''), tablaInicioX + 12, yPos + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text("Edad:", tablaInicioX + 47, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text((datos.edadPaciente || datos.edad || '') + " AÑOS", tablaInicioX + 58, yPos + 3.5);
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
    doc.text(toDDMMYYYY(datos.fechaNacimiento || datos.fechaNacimientoPaciente || ''), tablaInicioX + 115, yPos + 3.5);
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
  drawHeader();

  // === TÍTULO ===
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("BIOQUÍMICA", pageW / 2, 38, { align: "center" });

  // === DATOS DEL PACIENTE ===
  const finalYPos = drawPatientData(doc, {
    nombres: datosReales.apellidosNombres,
    nombresPaciente: datosReales.apellidosNombres,
    dni: datosReales.documentoIdentidad,
    dniPaciente: datosReales.documentoIdentidad,
    edad: datosReales.edad,
    edadPaciente: datosReales.edad,
    sexoPaciente: data.sexoPaciente,
    lugarNacimientoPaciente: datosReales.lugarNacimiento,
    estadoCivilPaciente: datosReales.estadoCivil,
    nombreExamen: datosReales.nombreExamen,
    fechaNacimientoPaciente: data.fechaNacimientoPaciente,
    nivelEstudioPaciente: datosReales.nivelEstudio,
    ocupacionPaciente: datosReales.ocupacion,
    cargoPaciente: datosReales.cargo,
    areaPaciente: datosReales.areaTrabajo,
    empresa: datosReales.empresa,
    contrata: datosReales.contrata
  });

  let yPos = finalYPos + 10;

  // === SECCIÓN 2: HEMOGRAMA ===
  // Título del hemograma
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("HEMOGRAMA AUTOMATIZADO", pageW / 2, yPos, { align: "center" });
  yPos += 8;

  const margin = 15;
  const col1X = margin;
  const col2X = 100;
  const col3X = 150;

  // Encabezados
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("PRUEBA", col1X, yPos);
  doc.text("RESULTADO", col2X, yPos, { align: "center" });
  doc.text("VALORES NORMALES", col3X, yPos);
  yPos += 5;

  // Datos del hemograma
  doc.setFontSize(9);
  const lineHeight = 6;

  const hemogramaData = [
    { prueba: "HEMOGLOBINA", resultado: data.txtHemoglobina || "", normal: "Mujeres 12 - 16 g/dL\nHombres 14 - 18 g/dL", bold: true },
    { prueba: "HEMATOCRITO", resultado: data.txtHematocrito || "", normal: "Mujeres 38 - 50 %\nHombres 40 - 54 %", bold: true },
    { prueba: "HEMATÍES", resultado: data.txtHematies || "", normal: "4.0 - 5.5 x 10^6/mm³", bold: true },
    { prueba: "Volumen Corpuscular Medio", resultado: data.txtVolumen || "", normal: "80 - 100 fL", bold: false },
    { prueba: "Hemoglobina Corpuscular Media", resultado: data.txtHemocorpuscular || "", normal: "26 - 34 pg", bold: false },
    { prueba: "Concentración de la Hemoglobina Corpuscular Media", resultado: data.txtConcentracion || "", normal: "31 - 37 g/dl", bold: false },
    { prueba: "LEUCOCITOS", resultado: data.txtLeucocitos || "", normal: "4 - 10 x 10^3/mm³", bold: true },
    { prueba: "PLAQUETAS", resultado: data.txtPlaquetas || "", normal: "1.5 - 4.5 x 10^5/mm³", bold: true },
    { prueba: "RECUENTO DIFERENCIAL", resultado: "", normal: "", bold: true, isHeader: true },
    { prueba: "NEUTRÓFILOS (%)", resultado: data.txtNeutrofilos || "", normal: "55-65 %", bold: true, indent: true },
    { prueba: "ABASTONADOS (%)", resultado: data.txtAbastonados || "", normal: "0 - 5 %", bold: true, indent: true },
    { prueba: "SEGMENTADOS (%)", resultado: data.txtSegmentados || "", normal: "55 - 65 %", bold: true, indent: true },
    { prueba: "MONOCITOS (%)", resultado: data.txtMonocitos || "", normal: "4 - 8 %", bold: true, indent: true },
    { prueba: "EOSINÓFILOS (%)", resultado: data.txtEosinofios || "", normal: "0 - 4 %", bold: true, indent: true },
    { prueba: "BASÓFILOS (%)", resultado: data.txtBasofilos || "", normal: "0 - 1 %", bold: true, indent: true },
    { prueba: "LINFOCITOS (%)", resultado: data.txtLinfocitos || "", normal: "20 - 40 %", bold: true, indent: true },
  ];

  hemogramaData.forEach((item) => {
    // Prueba
    doc.setFont("helvetica", item.bold ? "bold" : "normal");
    const pruebaX = (item.bold && !item.indent) ? col1X : col1X + 4;
    doc.text(item.prueba, pruebaX, yPos);

    // Resultado
    doc.setFont("helvetica", "normal");
    doc.text(item.resultado, col2X, yPos, { align: "center" });

    // Valores normales
    if (item.normal.includes('\n')) {
      const normalLines = item.normal.split('\n');
      normalLines.forEach((line, idx) => {
        if (line.includes('^')) {
          drawTextWithSuperscript(line, col3X, yPos + (idx * 3.5));
        } else {
          doc.text(line, col3X, yPos + (idx * 3.5));
        }
      });
      yPos += lineHeight + 2;
    } else {
      if (item.normal.includes('^')) {
        drawTextWithSuperscript(item.normal, col3X, yPos);
      } else {
        doc.text(item.normal, col3X, yPos);
      }
      yPos += lineHeight;
    }
  });

  // === SECCIÓN 3: FIRMA ===
  const sello1 = data.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
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
    }

    // === FOOTER ===
    footerTR(doc, { ...data, footerOffsetY: 7 });

    // === IMPRIMIR ===
    imprimir(doc);
  });
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
