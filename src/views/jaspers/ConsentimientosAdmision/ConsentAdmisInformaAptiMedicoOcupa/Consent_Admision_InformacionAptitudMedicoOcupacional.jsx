import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta, formatearFechaLarga } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from "../../../utils/dibujarFirmas.js";

export default async function ConsentAdmisionInformacionAptitudMedicoOcupacional(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Datos de prueba por defecto
  const datosPrueba = {
    apellidosPaciente: "CASTILLO PLASENCIA",
    nombresPaciente: "HADY KATHERINE",
    dniPaciente: "72384273",
    edadPaciente: "31",
    cargoPaciente: "OPERADOR DE MAQUINARIA",
    empresa: "OBRASCON HUARTE LAIN S.A.",
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
      fechaExamen: formatearFechaCorta(raw?.fechaRegistro ?? raw?.fecha ?? datosPrueba.fechaRegistro),
      documentoIdentidad: String(raw?.dniPaciente ?? raw?.dni ?? datosPrueba.dniPaciente),
      edad: String(raw?.edadPaciente ?? raw?.edad ?? datosPrueba.edadPaciente),
      puestoTrabajo: String(raw?.cargoPaciente ?? raw?.ocupacion ?? datosPrueba.cargoPaciente),
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
  const { dia, mes } = obtenerDiaYMes(data?.fechaRegistro ?? data?.fecha ?? fechaPrueba);

  // Header
  const drawHeader = () => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Título
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("DECLARACIÓN JURADA DE INFORMACIÓN DE APTITUD MÉDICO", pageW / 2, 40, { align: "center" });
    doc.text("OCUPACIONAL", pageW / 2, 46, { align: "center" });

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
  let yPos = 60;
  const margin = 15;
  const lineHeight = 5;

  // Texto de la declaración
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  // Texto principal con campos dinámicos en negrita
  let xActual = margin;
  let yActual = yPos;

  // "Yo, "
  doc.setFont("helvetica", "normal");
  doc.text("Yo,", xActual, yActual);
  xActual += doc.getTextWidth("Yo, ") + 2;

  // Nombre en negrita
  doc.setFont("helvetica", "bold");
  const nombreWidth = doc.getTextWidth(datosFinales.apellidosNombres);
  if (xActual + nombreWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(datosFinales.apellidosNombres, xActual, yActual);
  xActual += nombreWidth + 2;

  // ", de "
  doc.setFont("helvetica", "normal");
  const textoDe = ", de ";
  const textoDeWidth = doc.getTextWidth(textoDe);
  if (xActual + textoDeWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(textoDe, xActual, yActual);
  xActual += textoDeWidth;

  // Edad en negrita
  doc.setFont("helvetica", "bold");
  const edadWidth = doc.getTextWidth(datosFinales.edad);
  if (xActual + edadWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(datosFinales.edad, xActual, yActual);
  xActual += edadWidth + 2;

  // " años de edad, identificado(a) con DNI N°: "
  doc.setFont("helvetica", "normal");
  const textoDni = " años de edad, identificado(a) con DNI N°: ";
  const textoDniWidth = doc.getTextWidth(textoDni);
  if (xActual + textoDniWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(textoDni, xActual, yActual);
  xActual += textoDniWidth;

  // DNI en negrita
  doc.setFont("helvetica", "bold");
  const dniWidth = doc.getTextWidth(datosFinales.documentoIdentidad);
  if (xActual + dniWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(datosFinales.documentoIdentidad, xActual, yActual);
  xActual += dniWidth + 2;

  // ", postulante al cargo de "
  doc.setFont("helvetica", "normal");
  const textoCargo = ", postulante al cargo de ";
  const textoCargoWidth = doc.getTextWidth(textoCargo);
  if (xActual + textoCargoWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(textoCargo, xActual, yActual);
  xActual += textoCargoWidth;

  // Cargo en negrita
  doc.setFont("helvetica", "bold");
  const cargoWidth = doc.getTextWidth(datosFinales.puestoTrabajo);
  if (xActual + cargoWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(datosFinales.puestoTrabajo, xActual, yActual);
  xActual += cargoWidth + 2;

  // ", para la empresa "
  doc.setFont("helvetica", "normal");
  const textoEmpresa = ", para la empresa ";
  const textoEmpresaWidth = doc.getTextWidth(textoEmpresa);
  if (xActual + textoEmpresaWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(textoEmpresa, xActual, yActual);
  xActual += textoEmpresaWidth;

  // Empresa en negrita (OBRASCON HUARTE LAIN S.A.)
  doc.setFont("helvetica", "bold");
  const empresaWidth = doc.getTextWidth(datosFinales.empresa);
  if (xActual + empresaWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(datosFinales.empresa, xActual, yActual);
  xActual += empresaWidth + 2;

  // ", declaro haber sido informado sobre la APTITUD y RECOMENDACIONES de mi examen médico "
  doc.setFont("helvetica", "normal");
  const textoExamen = ", declaro haber sido informado sobre la APTITUD y RECOMENDACIONES de mi examen médico ";
  const textoExamenWidth = doc.getTextWidth(textoExamen);
  if (xActual + textoExamenWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(textoExamen, xActual, yActual);
  xActual += textoExamenWidth;

  // Fecha del examen en negrita
  doc.setFont("helvetica", "bold");
  const fechaExamenWidth = doc.getTextWidth(datosFinales.fechaExamen);
  if (xActual + fechaExamenWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(datosFinales.fechaExamen, xActual, yActual);
  xActual += fechaExamenWidth + 2;

  // " Realizado en el Policlínico Horizonte Medic de la ciudad de Trujillo."
  doc.setFont("helvetica", "normal");
  const textoFinal = " Realizado en el Policlínico Horizonte Medic de la ciudad de Trujillo.";
  const textoFinalWidth = doc.getTextWidth(textoFinal);
  if (xActual + textoFinalWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(textoFinal, xActual, yActual);
  
  yPos = yActual + lineHeight + 10;

  // "Firmo la presente declaración en conformidad a lo expuesto líneas arriba."
  doc.setFont("helvetica", "normal");
  const textoFirma = "Firmo la presente declaración en conformidad a lo expuesto líneas arriba.";
  doc.text(textoFirma, margin, yPos);
  yPos += lineHeight + 10;

  // Fecha: "Trujillo, [día] de [mes] 2025."
  doc.setFont("helvetica", "normal");
  const textoFecha = `Trujillo, ${dia} de ${mes} 2025.`;
  doc.text(textoFecha, margin, yPos);
  yPos += lineHeight + 15;

  // === FIRMA Y HUELLA DEL PACIENTE (usando dibujarFirmas) ===
  // Usar la función dibujarFirmas del utils
  const yPosFinalFirmas = await dibujarFirmas({
    doc,
    datos: data,
    y: yPos,
    pageW: pageW
  });

  // Agregar DNI debajo de la firma y huella
  const centroX = pageW / 2;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(`DNI: ${datosFinales.documentoIdentidad}`, centroX, yPosFinalFirmas + 3, { align: "center" });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 7, fontSize: 7 });

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

