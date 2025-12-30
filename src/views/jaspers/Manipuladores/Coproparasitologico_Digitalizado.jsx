// src/views/jaspers/AnalisisBioquimicos/Coproparasitologico_Digitalizado.jsx
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
const drawHeader = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Nro de ficha: ", pageW - 80, 8);
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 20);

  // Fecha de examen
  const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || datos.fechaLab || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);

  // Página
  doc.text("Pag. 01", pageW - 30, 3);

  // Bloque de color
  drawColorBox(doc, {
    color: datos.codigoColor,
    text: datos.textoColor,
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

export default async function Coproparasitologico_Digitalizado(datos = {}) {
  // === MAPEO DE DATOS ===
  const datosReales = {
    // Datos del paciente
    nombres: String(datos.nombres || datos.nombresPaciente || ""),
    nombresPaciente: String(datos.nombres || datos.nombresPaciente || ""),
    edad: datos.edad || datos.edadPaciente || "",
    edadPaciente: datos.edad || datos.edadPaciente || "",
    dni: datos.dni || datos.dniPaciente || "",
    dniPaciente: datos.dni || datos.dniPaciente || "",
    fecha: datos.fecha || datos.fechaExamen || datos.fechaLab || "",

    // Datos adicionales del paciente
    sexoPaciente: datos.sexoPaciente || "",
    lugarNacimientoPaciente: datos.lugarNacimientoPaciente || "",
    estadoCivilPaciente: datos.estadoCivilPaciente || "",
    fechaNacimientoPaciente: datos.fechaNacimientoPaciente || "",
    nivelEstudioPaciente: datos.nivelEstudioPaciente || "",
    ocupacionPaciente: datos.ocupacionPaciente || "",
    cargoPaciente: datos.cargoPaciente || "",
    areaPaciente: datos.areaPaciente || "",
    empresa: datos.empresa || "",
    contrata: datos.contrata || "",
    nombreExamen: datos.nombreExamen || "",

    // Datos de ficha
    norden: String(datos.norden || datos.numeroFicha || ""),
    numeroFicha: String(datos.norden || datos.numeroFicha || ""),
    sede: datos.sede || datos.nombreSede || "",
    nombreSede: datos.sede || datos.nombreSede || "",

    // Datos de color
    codigoColor: datos.codigoColor,
    textoColor: datos.textoColor,
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
  ]).then(async ([s1, s2]) => {
    // HEADER
    await drawHeader(doc, datosFinales);

    // === TÍTULO ===
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.text("COPROPARASITOLÓGICO", pageW / 2, 38, { align: "center" });

    // === DATOS DEL PACIENTE ===
    const finalYPos = drawPatientData(doc, datosFinales);

    let y = finalYPos + 10;
    const xLeft = margin * 2;

    // === RESULTADOS ===
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("RESULTADOS:", xLeft, y);
    y += 8;

    // MUESTRA I
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

    // Centrar los sellos en la hoja - Mismo tamaño fijo para ambos
    const sigW = 48;
    const sigH = 20;
    const sigY = y + 12;
    const gap = 16;
    const lineY = sigY + sigH + 3;

    // Función auxiliar para agregar sello al PDF
    const agregarSello = (img, xPos, yPos, width, height) => {
      if (!img) return;
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      doc.addImage(selloBase64, 'PNG', xPos, yPos, width, height);
    };

    // Función auxiliar para dibujar línea y texto debajo del sello
    const dibujarLineaYTexto = (centroX, lineY, tipoSello) => {
      doc.setLineWidth(0.2);
      doc.line(centroX - 25, lineY, centroX + 25, lineY);
      doc.setFont('helvetica', 'normal').setFontSize(9);
      if (tipoSello === 'SELLOFIRMA') {
        // SELLOFIRMA: Firma y Sello del Profesional / Responsable de la Evaluación
        doc.text("Firma y Sello del Profesional", centroX, lineY + 5, { align: "center" });
        doc.text("Responsable de la Evaluación", centroX, lineY + 8, { align: "center" });
      } else if (tipoSello === 'SELLOFIRMADOCASIG') {
        // SELLOFIRMADOCASIG: Firma y Sello Médico Asignado
        doc.text("Firma y Sello Médico Asignado", centroX, lineY + 5, { align: "center" });
      } else {
        doc.text("Firma y Sello", centroX, lineY + 5, { align: "center" });
      }
    };

    if (s1 && s2) {
      const totalWidth = sigW * 2 + gap;
      const startX = (pageW - totalWidth) / 2;

      agregarSello(s1, startX, sigY, sigW, sigH);
      agregarSello(s2, startX + sigW + gap, sigY, sigW, sigH);

      const centroSello1X = startX + sigW / 2;
      const centroSello2X = startX + sigW + gap + sigW / 2;
      dibujarLineaYTexto(centroSello1X, lineY, 'SELLOFIRMA');
      dibujarLineaYTexto(centroSello2X, lineY, 'SELLOFIRMADOCASIG');
    } else if (s1) {
      const imgX = (pageW - sigW) / 2;
      agregarSello(s1, imgX, sigY, sigW, sigH);
      dibujarLineaYTexto(pageW / 2, lineY, 'SELLOFIRMA');
    } else if (s2) {
      const imgX = (pageW - sigW) / 2;
      agregarSello(s2, imgX, sigY, sigW, sigH);
      dibujarLineaYTexto(pageW / 2, lineY, 'SELLOFIRMADOCASIG');
    }

    // FOOTER
    footerTR(doc, { ...datosFinales, footerOffsetY: 8 });

    // PRINT
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
  })

}
