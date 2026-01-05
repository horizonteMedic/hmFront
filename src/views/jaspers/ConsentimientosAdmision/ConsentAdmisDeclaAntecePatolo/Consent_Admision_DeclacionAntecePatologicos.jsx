import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta, formatearFechaLarga } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from "../../../utils/dibujarFirmas.js";

export default async function ConsentAdmisionDeclacionAntecePatologicos(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Datos de prueba por defecto
  const datosPrueba = {
    apellidosPaciente: "CASTILLO PLASENCIA",
    nombresPaciente: "HADY KATHERINE",
    dniPaciente: "72384273",
    edadPaciente: "31",
    cargoPaciente: "OPERADOR DE MAQUINARIA",
    empresa: "MINERA PODEROSA S.A.",
    sede: "TRUJILLO",
    norden: "96639",
    fechaRegistro: "2025-01-28",
    codigoColor: "#00FF00",
    textoColor: "AB",
  };

  // Normalizador de datos de entrada
  function buildDatosFinales(raw) {
    const datosFinales = {
      apellidosNombres: String(((raw?.apellidosPaciente ?? datosPrueba.apellidosPaciente) + ' ' + (raw?.nombresPaciente ?? datosPrueba.nombresPaciente)).trim()),
      fechaExamen: formatearFechaCorta(raw?.fechaRegistro ?? datosPrueba.fechaRegistro),
      documentoIdentidad: String(raw?.dniPaciente ?? datosPrueba.dniPaciente),
      edad: String(raw?.edadPaciente ?? datosPrueba.edadPaciente),
      puestoTrabajo: String(raw?.cargoPaciente ?? datosPrueba.cargoPaciente),
      empresa: String(raw?.empresa ?? datosPrueba.empresa),
      sede: String(raw?.sede ?? raw?.nombreSede ?? datosPrueba.sede),
      numeroFicha: String(raw?.norden ?? datosPrueba.norden),
      codigoColor: String(raw?.codigoColor ?? datosPrueba.codigoColor),
      textoColor: String(raw?.textoColor ?? datosPrueba.textoColor),
    };
    return datosFinales;
  }

  const datosFinales = buildDatosFinales(data);

  // Función para obtener día y mes de la fecha
  const obtenerDiaYMes = (fechaStr) => {
    if (!fechaStr) return { dia: '', mes: '' };
    try {
      const fechaLarga = formatearFechaLarga(fechaStr);
      // formatearFechaLarga devuelve: "28 de enero de 2025"
      const partes = fechaLarga.split(' de ');
      if (partes.length >= 2) {
        return { dia: partes[0], mes: partes[1] };
      }
      return { dia: '', mes: '' };
    } catch (error) {
      return { dia: '', mes: '' };
    }
  };

  const fechaPrueba = datosPrueba.fechaRegistro;
  const { dia, mes } = obtenerDiaYMes(data?.fechaRegistro ?? fechaPrueba);

  // Header
  const drawHeader = () => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Título
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("DECLARACIÓN DE ANTECEDENTES PATOLÓGICOS", pageW / 2, 35, { align: "center" });

    // Número de Ficha, Sede, Fecha y Página
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 70, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 50, 16);

    // Calcular ancho disponible para la sede (evitar que se pise con el ColorBox)
    const xInicioSede = pageW - 70;
    const xFinColorBox = pageW - 5;
    const anchoDisponibleSede = xFinColorBox - xInicioSede - 5;

    doc.setFont("helvetica", "normal").setFontSize(8);
    const textoSede = "Sede: " + datosFinales.sede;
    const lineasSede = doc.splitTextToSize(textoSede, anchoDisponibleSede);
    lineasSede.forEach((linea, idx) => {
      doc.text(linea, xInicioSede, 20 + (idx * 3.5));
    });
    
    const yFechaExamen = lineasSede.length === 1 ? 25 : 20 + (lineasSede.length * 3.5) + 2;
    doc.text("Fecha de examen: " + (datosFinales.fechaExamen || ""), pageW - 70, yFechaExamen);
    doc.text("Pag. 01", pageW - 25, 8);

    // Bloque de color
    drawColorBox(doc, {
      color: datosFinales.codigoColor,
      text: datosFinales.textoColor,
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  };

  drawHeader();

  // === CONTENIDO DEL DOCUMENTO ===
  let yPos = 50;
  const margin = 15;
  const anchoTexto = pageW - (2 * margin);
  const lineHeight = 5;

  // Texto de la declaración
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  // Primera línea: "Yo: [nombre]"
  let xActual = margin;
  let yActual = yPos;

  // "Yo: "
  doc.setFont("helvetica", "normal");
  doc.text("Yo: ", xActual, yActual);
  xActual += doc.getTextWidth("Yo: ");

  // Nombre en negrita
  doc.setFont("helvetica", "bold");
  const nombreWidth = doc.getTextWidth(datosFinales.apellidosNombres);
  if (xActual + nombreWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(datosFinales.apellidosNombres, xActual, yActual);
  
  yPos = yActual + lineHeight + 8;

  // Segunda línea: "Identificado con DNI: [dni]"
  xActual = margin;
  yActual = yPos;

  // "Identificado con DNI: "
  doc.setFont("helvetica", "normal");
  doc.text("Identificado con DNI: ", xActual, yActual);
  xActual += doc.getTextWidth("Identificado con DNI: ");

  // DNI en negrita
  doc.setFont("helvetica", "bold");
  const dniWidth = doc.getTextWidth(datosFinales.documentoIdentidad);
  if (xActual + dniWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(datosFinales.documentoIdentidad, xActual, yActual);
  
  yPos = yActual + lineHeight + 8;

  // Tercera línea: "Con ocupación laboral de: [cargo]"
  xActual = margin;
  yActual = yPos;

  // "Con ocupación laboral de: "
  doc.setFont("helvetica", "normal");
  doc.text("Con ocupación laboral de: ", xActual, yActual);
  xActual += doc.getTextWidth("Con ocupación laboral de: ");

  // Cargo en negrita
  doc.setFont("helvetica", "bold");
  const cargoWidth = doc.getTextWidth(datosFinales.puestoTrabajo);
  if (xActual + cargoWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(datosFinales.puestoTrabajo, xActual, yActual);
  
  yPos = yActual + lineHeight + 8;

  // Cuarta línea: "Para la Empresa: [empresa]"
  xActual = margin;
  yActual = yPos;

  // "Para la Empresa: "
  doc.setFont("helvetica", "normal");
  doc.text("Para la Empresa: ", xActual, yActual);
  xActual += doc.getTextWidth("Para la Empresa: ");

  // Empresa en negrita
  doc.setFont("helvetica", "bold");
  const empresaWidth = doc.getTextWidth(datosFinales.empresa);
  if (xActual + empresaWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(datosFinales.empresa, xActual, yActual);
  
  yPos = yActual + lineHeight + 10;

  // Quinta línea: "Por lo tanto..."
  doc.setFont("helvetica", "normal");
  const textoDeclaracion = "Por lo tanto, en forma consciente y voluntaria, declaro que no presento cefalea, dolor de garganta, tos, fiebre, malestar general ni dificultad para respirar.";
  const lineasDeclaracion = doc.splitTextToSize(textoDeclaracion, anchoTexto);
  lineasDeclaracion.forEach((linea, idx) => {
    doc.text(linea, margin, yPos + (idx * lineHeight));
  });
  yPos += lineasDeclaracion.length * lineHeight + 10;

  // Tercera línea: "Trujillo, [día] de [mes] de 2025." (bajada 15mm)
  yPos += 15;
  doc.setFont("helvetica", "normal");
  const texto3 = `Trujillo, ${dia} de ${mes} 2025.`;
  doc.text(texto3, margin, yPos);
  yPos += 20;

  // === FIRMA Y HUELLA DEL PACIENTE (usando dibujarFirmas, bajada 15mm) ===
  yPos += 15;
  
  // Usar la función dibujarFirmas del utils
  await dibujarFirmas({
    doc,
    datos: data,
    y: yPos,
    pageW: pageW
  });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 12, fontSize: 7 });

  // === Imprimir ===
  if (!docExistente) {
    imprimir(doc);
  }

  return doc;
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
