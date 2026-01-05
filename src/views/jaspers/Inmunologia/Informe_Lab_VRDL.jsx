// src/views/jaspers/Inmunologia/Informe_Lab_VRDL.jsx
import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { dibujarFirmas } from '../../utils/dibujarFirmas.js';

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

const drawUnderlinedTitle = (doc, text, y) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text(text, pageW / 2, y, { align: "center" });
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
  doc.text(datos.norden, pageW - 50, 16);

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + datos.sede, pageW - 80, 20);

  // Fecha de examen
  const fechaExamen = toDDMMYYYY(datos.fechaExamen);
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
  let yPos = 41;

  // Header DATOS PERSONALES
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Fila 1: Apellidos y Nombres
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.apellidosNombres, tablaInicioX + 40, yPos + 3.5);
  yPos += filaAltura;

  // Fila 2: DNI | Edad | Sexo
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.dni, tablaInicioX + 12, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Edad:", tablaInicioX + 47, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text((datos.edad ? datos.edad + " AÑOS" : ''), tablaInicioX + 58, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Sexo:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.sexo, tablaInicioX + 105, yPos + 3.5);
  yPos += filaAltura;

  // Fila 3: Lugar Nacimiento | Estado Civil
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Lugar de Nacimiento:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.lugarNacimiento, tablaInicioX + 38, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Estado Civil:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.estadoCivil, tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  // Fila 4: Tipo Examen | Fecha Nac.
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Tipo Examen:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.tipoExamen, tablaInicioX + 28, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha Nac.:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(toDDMMYYYY(datos.fechaNacimiento), tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  // Fila 5: Nivel de Estudio
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Nivel de Estudio:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nivelEstudio, tablaInicioX + 32, yPos + 3.5);
  yPos += filaAltura;

  // Fila 6: Ocupación
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Ocupación:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.ocupacion, tablaInicioX + 25, yPos + 3.5);
  yPos += filaAltura;

  // Fila 7: Cargo
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Cargo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.cargo, tablaInicioX + 18, yPos + 3.5);
  yPos += filaAltura;

  // Fila 8: Área
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Área:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.area, tablaInicioX + 15, yPos + 3.5);
  yPos += filaAltura;

  return yPos;
};

// --- Componente Principal ---

export default async function Informe_Lab_VRDL(data = {}) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // === NORMALIZACIÓN DE DATOS ===
  const datosReales = {
    // Datos del paciente
    apellidosNombres: (data.nombresPaciente && data.apellidosPaciente)
      ? `${data.nombresPaciente} ${data.apellidosPaciente}`
      : data.nombreCompleto || '',
    dni: String(data.dniPaciente || ''),
    edad: String(data.edadPaciente || ''),
    sexo: data.sexoPaciente === 'F' ? 'FEMENINO' : data.sexoPaciente === 'M' ? 'MASCULINO' : '',
    lugarNacimiento: data.lugarNacimiento || data.lugarNacimientoPaciente || '',
    estadoCivil: data.estadoCivil || data.estadoCivilPaciente || '',
    fechaNacimiento: data.fechaNacimientoPaciente || '',
    nivelEstudio: data.nivelEstudio || data.nivelEstudioPaciente || '',
    ocupacion: data.ocupacion || data.ocupacionPaciente || '',
    cargo: data.cargoPaciente || '',
    area: data.areaPaciente || '',
    tipoExamen: data.tipoExamen || '',
    // Datos del header
    norden: String(data.norden || ''),
    sede: data.sede || data.nombreSede || '',
    fechaExamen: data.fechaExamen || data.fechaRegistro || '',
    codigoColor: data.codigoColor || '',
    textoColor: data.textoColor || '',
    color: data.color,
    // Datos del examen
    muestra: data.muestra || "SUERO",
    examen: data.examen || '',
    metodo: data.metodo || '',
    resultado: data.vdrl || '',
    // Digitalización
    digitalizacion: data.digitalizacion || []
  };

  // Usar solo datos normalizados
  const datosFinales = datosReales;

  // === HEADER ===
  await drawHeader(doc, datosFinales);

  // === TÍTULO ===
  drawUnderlinedTitle(doc, "INMUNOLOGÍA", 38);

  // === DATOS DEL PACIENTE ===
  drawPatientData(doc, datosFinales);

  // === CUERPO ===
  let y = 95;

  // Muestra
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("MUESTRA:", config.margin, y);
  doc.setFont(config.font, "normal");
  doc.text(datosFinales.muestra, config.margin + 30, y);
  y += config.lineHeight;

  // Examen solicitado
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("Examen solicitado:", config.margin, y);
  doc.setFont(config.font, "normal");
  const examenSolicitado = datosFinales.examen ? datosFinales.examen.replace(/\(.*?\)/g, '').trim() : "VDRL";
  doc.text(examenSolicitado, config.margin + 45, y);
  y += config.lineHeight * 2;

  // === TABLA DE RESULTADOS ===
  const colPrueba = config.margin;
  const colResultado = config.margin + 120;

  // Header de la tabla
  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("EXAMEN", colPrueba, y);
  doc.text("RESULTADO", colResultado, y);
  y += 2;

  // Línea debajo del header
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  // Fila de datos VDRL
  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  // Mostrar "VDRL (Método: [método])" incluyendo el método en el texto del examen
  const examenTexto = datosFinales.metodo 
    ? `VDRL (Método: ${datosFinales.metodo.toLowerCase()})`
    : "VDRL";
  doc.text(examenTexto, colPrueba, y);
  doc.text(datosFinales.resultado, colResultado, y);

  // === FIRMAS ===
  const yFirmas = y + 55; // Posición para las firmas (más abajo como en los anteriores)
  await dibujarFirmas({ doc, datos: data, y: yFirmas, pageW });

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
}

