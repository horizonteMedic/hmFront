import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { getSignCompressed } from "../../utils/helpers";

// --- Configuración Centralizada ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 105,
  col3X: 155,
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

  // Código AB (codAb)
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Cod. AB: " + (datos.codAb || ""), pageW - 80, 20);

  // Sede
  doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 25);

  // Fecha de examen
  const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 30);

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

export default async function AnalisisBioquimicos_Digitalizado(datos = {}, docExistente = null) {

  const doc = docExistente || new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  await drawHeader(doc, datos);

  // === TÍTULO ===
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("BIOQUÍMICA", pageW / 2, 38, { align: "center" });

  // === DATOS DEL PACIENTE ===
  const finalYPos = drawPatientData(doc, datos);

  // Obtener firmas comprimidas
  const s1 = await getSignCompressed(datos, "SELLOFIRMA");
  const s2 = await getSignCompressed(datos, "SELLOFIRMADOCASIG");

  let y = finalYPos + 10; // Posición inicial después de la tabla de datos

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("ANÁLISIS BIOQUÍMICOS", config.margin, y);
  y += config.lineHeight * 1.5;

  // === ENCABEZADO DE TABLA ===
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", config.col1X, y);
  doc.text("RESULTADO", config.col2X, y, { align: "center" });
  doc.text("RANGO REFERENCIAL", config.col3X, y, { align: "left" });
  y += 3;
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // === PRUEBAS ===
  const tests = [
    // { label: "CREATININA", key: "txtCreatinina", ref: "0.8 - 1.4 mg/dL" }, // Comentado por el momento
    { label: "COLESTEROL TOTAL", key: "txtColesterol", ref: "< 200 mg/dL" },
    { label: "TRIGLICÉRIDOS", key: "txtTrigliseridos", ref: "< 150 mg/dL" },
    { label: "H.D.L. COLESTEROL", key: "txtHdlColesterol", ref: "40 - 60 mg/dL" },
    { label: "L.D.L. COLESTEROL", key: "txtLdlColesterol", ref: "< 129 mg/dL" },
    { label: "V.L.D.L. COLESTEROL", key: "txtVldlColesterol", ref: "< 30 mg/dL" },
  ];

  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  tests.forEach(({ label, key, ref }) => {
    const val = datos[key] != null ? String(datos[key]) : "-";
    doc.text(label, config.col1X, y);
    doc.text(val, config.col2X, y, { align: "center" });
    doc.text(ref, config.col3X, y, { align: "left" });
    y += config.lineHeight;
  });

  // Centrar los sellos en la hoja - Mismo tamaño fijo para ambos
  const sigW = 48;
  const sigH = 20;
  const sigY = y + 12;
  const gap = 16;
  const lineY = sigY + sigH + 3;

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

    doc.addImage(s1, 'JPEG', startX, sigY, sigW, sigH);
    doc.addImage(s2, 'JPEG', startX + sigW + gap, sigY, sigW, sigH);

    const centroSello1X = startX + sigW / 2;
    const centroSello2X = startX + sigW + gap + sigW / 2;
    dibujarLineaYTexto(centroSello1X, lineY, 'SELLOFIRMA');
    dibujarLineaYTexto(centroSello2X, lineY, 'SELLOFIRMADOCASIG');
  } else if (s1) {
    const imgX = (pageW - sigW) / 2;
    doc.addImage(s1, 'JPEG', imgX, sigY, sigW, sigH);
    dibujarLineaYTexto(pageW / 2, lineY, 'SELLOFIRMA');
  } else if (s2) {
    const imgX = (pageW - sigW) / 2;
    doc.addImage(s2, 'JPEG', imgX, sigY, sigW, sigH);
    dibujarLineaYTexto(pageW / 2, lineY, 'SELLOFIRMADOCASIG');
  }

  // === FOOTER ===
  footerTR(doc, datos);

  // === Imprimir ===
  if (docExistente) {
    return doc;
  } else {
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
  }
}
