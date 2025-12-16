import jsPDF from "jspdf";
import CabeceraLogo from "../components/CabeceraLogo.jsx";
import footerTR from "../components/footerTR.jsx";
import drawColorBox from "../components/ColorBox.jsx";
import { getSign } from "../../utils/helpers.js";

const config = {
  margin: 15,
  col1X: 15,
  col2X: 85,
  col3X: 140,
  fontSize: {
    title: 13,
    subtitle: 12,
    header: 11,
    body: 11,
  },
  font: "helvetica",
  lineHeight: 8,
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
      color: datos.codigoColor || "#008f39",
      text: datos.textoColor || "F",
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });

    // Datos del paciente (debajo del logo)
    let dataY = 40;
    const labelX = config.margin;
    const valueX = labelX + 35;
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text("PACIENTE:", labelX, dataY);
    doc.setFont('helvetica', 'normal');
    doc.text(String(datos.nombre || datos.nombres || ''), valueX, dataY);
    dataY += 8;
    doc.setFont('helvetica', 'bold');
    doc.text("EDAD :", labelX, dataY);
    doc.setFont('helvetica', 'normal');
    doc.text(datos.edad ? `${datos.edad} años` : '', valueX, dataY);
    dataY += 8;
    doc.setFont('helvetica', 'bold');
    doc.text("DNI:", labelX, dataY);
    doc.setFont('helvetica', 'normal');
    doc.text(String(datos.dni || datos.cod_pa || ''), valueX, dataY);
    dataY += 8;
    doc.setFont('helvetica', 'bold');
    doc.text("FECHA :", labelX, dataY);
    doc.setFont('helvetica', 'normal');
    doc.text(fechaExamen, valueX, dataY);
  };

  drawHeader();

  // === CUERPO ===
  let y = 75;
  doc.text("PRUEBA CUALITATIVA DE ANTIGENOS", config.margin, y);
  y += config.lineHeight + 2;

  // MARCA
  const marca = datos.marca || "Test";
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.subtitle);
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

  // Firma y huella digital (centrado, sin cuadros, solo imágenes y textos)
  y += 3; // Subido 7mm para no chocar con el footer (original y += 10, ahora y += 3)
  const centroX = pageW / 2;
  const firmaY = y;
  
  // Obtener URLs de firma y huella
  const firmaUrl = getSign(datos, "FIRMAP");
  const huellaUrl = getSign(datos, "HUELLA");
  
  // Agregar firma del paciente (izquierda del centro)
  if (firmaUrl) {
    try {
      const imgWidth = 30;
      const imgHeight = 20;
      const x = centroX - 25; // A la izquierda del centro
      doc.addImage(firmaUrl, 'PNG', x, firmaY, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del paciente:", error);
    }
  }
  
  // Agregar huella del paciente (derecha de la firma)
  if (huellaUrl) {
    try {
      const imgWidth = 12;
      const imgHeight = 20;
      const x = centroX + 5; // A la derecha de la firma
      doc.addImage(huellaUrl, 'PNG', x, firmaY, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando huella del paciente:", error);
    }
  }
  
  // Línea de firma debajo de las imágenes
  const lineY = firmaY + 22;
  doc.setLineWidth(0.2);
  doc.line(centroX - 30, lineY, centroX + 30, lineY);
  
  // Texto "Firma y Huella del Paciente" centrado
  doc.setFont(config.font, "normal").setFontSize(9);
  doc.text("Firma y Huella del Paciente", centroX, lineY + 6, { align: "center" });
  
  // DNI debajo del texto
  if (datos.dni) {
    doc.setFont(config.font, "normal").setFontSize(8);
    doc.text("DNI:", centroX - 15, lineY + 12);
    doc.setFont(config.font, "bold").setFontSize(9);
    doc.text(String(datos.dni || ""), centroX - 8, lineY + 12);
  }

  // Footer
  footerTR(doc, datos);

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
