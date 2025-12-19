import jsPDF from "jspdf";
import CabeceraLogo from "../components/CabeceraLogo.jsx";
import footerTR from "../components/footerTR.jsx";
import drawColorBox from "../components/ColorBox.jsx";
import { dibujarFirmas } from "../../utils/dibujarFirmas.js";

// --- Configuración Centralizada ---
const config = {
  margin: 15,
  col1X: 15,
  col2X: 85,
  col3X: 140,
  fontSize: {
    title: 13,
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

// --- Componente Principal ---
export default async function pcualitativaantigeno(datos = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === HEADER ===
  const drawHeader = async () => {
    await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

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

  await drawHeader();

  // === TÍTULO ===
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("COVID-19", pageW / 2, 34, { align: "center" });

  // Título principal debajo de COVID-19
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("PRUEBA CUALITATIVA DE ANTIGENOS", pageW / 2, 38, { align: "center" });

  // === DATOS DEL PACIENTE ===
  const finalYPos = drawPatientData(doc, datos);

  // === CUERPO ===
  let y = finalYPos + 10;

  // MARCA debajo del título
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text(`MARCA: ${datos.cboMarca || '-'}`, config.margin, y);
  y += config.lineHeight * 2;

  // 3) ENCABEZADOS DE TABLA
  doc.setFont(config.font, "bold")
    .setFontSize(config.fontSize.header);
  doc.text("PRUEBA", config.col1X, y);
  doc.text("RESULTADOS", config.col2X, y);
  doc.text("VALORES DE REFERENCIA", config.col3X, y);
  y += 3;
  doc.setLineWidth(0.4)
    .line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // 4) FILA DE RESULTADO
  doc.setFont(config.font, "normal")
    .setFontSize(config.fontSize.body)
    .text("Antígenos virales SARS-CoV-2", config.col1X, y);

  const reactivo = datos.chkIgmReactivo === true;
  const textoResultado = reactivo ? "Reactivo" : "No reactivo";
  doc.text(textoResultado, config.col2X, y);

  const refLines = doc.splitTextToSize(
    "Método: Inmunocromatografia \n" +
    "Sensibilidad: 94.55% \n" +
    "Especificidad: 100%",
    pageW - config.col3X - config.margin
  );
  doc.text(refLines, config.col3X, y);

  y += Math.max(refLines.length, 1) * config.lineHeight + config.lineHeight;

  // 5) COMENTARIOS
  doc.setFont(config.font, "bold")
    .setFontSize(config.fontSize.body)
    .text("COMENTARIOS:", config.margin, y);
  y += config.lineHeight;

  const textoCom = reactivo
    ? "Presenta antígenos virales SARS-CoV-2"
    : "No presenta antígenos virales SARS-CoV-2";
  const comLines = doc.splitTextToSize(
    textoCom,
    pageW - 2 * config.margin
  );
  doc.setFont(config.font, "normal")
    .text(comLines, config.margin, y);
  y += comLines.length * config.lineHeight + config.lineHeight;

  // 6) SINTOMATOLOGÍA
  doc.setFont(config.font, "bold")
    .setFontSize(config.fontSize.body)
    .text("SINTOMATOLOGIA", config.margin, y);
  y += config.lineHeight;

  const obs = datos.txtObservaciones;
  const sintoma = !obs || obs.trim() === ""
    ? "Paciente declara no tener síntomas"
    : `Paciente declara tener:\n\n${obs}`;
  const sintLines = doc.splitTextToSize(
    sintoma,
    pageW - 2 * config.margin
  );
  doc.setFont(config.font, "normal")
    .text(sintLines, config.margin, y);
  y += sintLines.length * config.lineHeight + config.lineHeight * 2;

  // Firma y huella digital usando dibujarFirmas
  const firmaY = 210;

  // Usar helper para dibujar firmas
  dibujarFirmas({ doc, datos, y: firmaY, pageW }).then(() => {
    // === FOOTER ===
    footerTR(doc, datos);

    // Mostrar PDF
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
  }).catch(err => {
    console.error(err);
    alert('Error generando PDF: ' + err);
  });


}
