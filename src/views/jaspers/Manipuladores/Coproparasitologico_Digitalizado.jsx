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
  const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || datos.fechaLab || "");
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
    codigocolor: datos.codigoColor,
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
