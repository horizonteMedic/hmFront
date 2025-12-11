import jsPDF from "jspdf";
import CabeceraLogo from "../components/CabeceraLogo.jsx";
import footerTR from "../components/footerTR.jsx";
import drawColorBox from "../components/ColorBox.jsx";
import { dibujarFirmas } from "../../utils/dibujarFirmas.js";

const config = {
  margin: 15,
  col1X: 15,
  col2X: 85,
  col3X: 140,
  fontSize: {
    title: 14,
    subtitle: 12,
    header: 9,
    body: 9,
  },
  font: "helvetica",
  lineHeight: 7,
};

// --- Función para formatear fecha a DD/MM/YYYY ---
const toDDMMYYYY = (fecha) => {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha; // ya está en formato correcto
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

export default function pcualitativaantigenoMarsa(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  const drawHeader = () => {
    CabeceraLogo(doc, { ...datos, tieneMembrete: false });
    
    // Número de Ficha
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);
    doc.setFont("helvetica", "bold").setFontSize(18);
    doc.text(String(datos.norden || datos.numeroFicha || datos.numero || ""), pageW - 50, 16);
    
    // Sede
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 20);
    
    // Fecha de examen
    const fechaExamen = toDDMMYYYY(datos.fecha_examen || datos.fechaExamen || datos.fecha || "");
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
    doc.text(datos.nombres || datos.nombresPaciente || datos.nombre || '', tablaInicioX + 40, yPos + 3.5);
    yPos += filaAltura;

    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
    doc.setFont("helvetica", "bold");
    doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(String(datos.dniPaciente || datos.dni || datos.cod_pa || ''), tablaInicioX + 12, yPos + 3.5);
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

  drawHeader();

  // === TÍTULO ===
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("COVID-19", pageW / 2, 38, { align: "center" });

  // === DATOS DEL PACIENTE ===
  const finalYPos = drawPatientData(doc, datos);

  // === CUERPO ===
  let y = finalYPos + 10;
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("PRUEBA CUALITATIVA DE ANTIGENOS", config.margin, y);
  y += config.lineHeight + 2;

  // MARCA
  const marca = datos.marca || datos.cboMarca || "Test";
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text(`MARCA: ${marca}`, config.margin, y);
  y += config.lineHeight * 2;

  // Encabezados de tabla
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", config.col1X, y);
  doc.text("RESULTADOS", config.col2X, y);
  doc.text("VALORES DE REFERENCIA", config.col3X, y);
  y += 3;
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // Fila de resultado
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text("Antigenos virales SARS-CoV-2", config.col1X, y);
  doc.setFont(config.font, "bold");
  doc.text("REACTIVO", config.col2X, y);
  doc.setFont(config.font, "normal");
  const refLines = [
    "Metodo: Inmunocromatografia",
    "SENSIBILIDAD: 94.55%",
    "ESPECIFICIDAD: 100%"
  ];
  refLines.forEach((line, i) => {
    doc.text(line, config.col3X, y + i * config.lineHeight);
  });
  y += Math.max(refLines.length, 1) * config.lineHeight + config.lineHeight;

  // Subo la sección de comentarios y lo que sigue
  y -= 15;

  // Comentarios
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("COMENTARIOS:", config.margin, y);
  y += config.lineHeight;
  doc.setFont(config.font, "normal");
  doc.text("Presenta antigenos virales SARS-CoV-2", config.margin, y);
  y += config.lineHeight * 2;

  // Sintomatología
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("SINTOMATOLOGIA", config.margin, y);
  y += config.lineHeight;
  doc.setFont(config.font, "normal");
  doc.text("Paciente declara tener desde", config.margin, y);
  y += config.lineHeight;
  // Lista de síntomas
  const sintomas = [
    "- Dolor de garganta",
    "- Congestion nasal",
    "- Dificultad respiratoria"
  ];
  sintomas.forEach(s => {
    doc.text(s, config.margin, y);
    y += config.lineHeight;
  });
  y += config.lineHeight;
  doc.text("Firmo en conformidad de lo anteriormente declarado.", config.margin, y);
  y += config.lineHeight * 2;

  // Firma y huella digital usando dibujarFirmas
  const firmaY = 210;

  // Usar helper para dibujar firmas
  dibujarFirmas({ doc, datos, y: firmaY, pageW }).then(() => {
    // Footer
    footerTR(doc, datos);

    // Mostrar PDF
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
  }).catch(err => {
    console.error(err);
    alert('Error generando PDF: ' + err);
  });
}
