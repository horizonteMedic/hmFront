import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta, formatearFechaLarga } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from "../../../utils/dibujarFirmas.js";

export default async function ConsentAdmisionEvaluacionMedica(data = {}, docExistente = null) {
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
  const anio = new Date(data?.fechaRegistro ?? data?.fecha ?? fechaPrueba).getFullYear() || '2025';

  // Header
  const drawHeader = () => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Título
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("CONSENTIMIENTO INFORMADO DE EVALUACIÓN MÉDICA", pageW / 2, 40, { align: "center" });

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
  let yPos = 60; // Bajado 10mm
  const margin = 15;
  const anchoTexto = pageW - (2 * margin);
  const lineHeight = 5;

  // Texto de la declaración
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  // Primera línea: "Yo, [nombre], identificado con el DNI [dni]"
  let xActual = margin;
  let yActual = yPos;

  // "Yo, "
  doc.setFont("helvetica", "normal");
  doc.text("Yo, ", xActual, yActual);
  xActual += doc.getTextWidth("Yo, ");

  // Nombre en negrita
  doc.setFont("helvetica", "bold");
  const nombreWidth = doc.getTextWidth(datosFinales.apellidosNombres);
  if (xActual + nombreWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(datosFinales.apellidosNombres, xActual, yActual);
  xActual += nombreWidth;

  // ", identificado con el DNI "
  doc.setFont("helvetica", "normal");
  const textoDni = ", identificado con el DNI ";
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
  
  yPos = yActual + lineHeight + 10;

  // "Certifico haber sido informado que:"
  doc.setFont("helvetica", "bold");
  doc.text("Certifico haber sido informado que:", margin, yPos);
  yPos += lineHeight + 5;

  // Texto del consentimiento (entre comillas)
  doc.setFont("helvetica", "normal");
  const textoConsentimiento = `"De acuerdo con lo dispuesto en la Ley 29733 (Ley de Protección de Datos Personales), declaro haber tomado conocimiento que los exámenes médicos efectuados por el Centro Médico Evaluador y la información contenida en los mismos, a fin de evaluar mi condición médica para postular a un puesto de trabajo en el campamento minero es registrada por la Compañía Minera y/o la Compañía Aseguradora que tenga a su cargo la cobertura del Seguro Complementario de Trabajo de Riesgo o la que esta designe para los efectos de control de dicho seguro. En ese sentido, mediante la suscripción del presente documento, otorgo consentimiento expreso e inequívoco para que la Compañía Minera efectúe el tratamiento de los datos personales facilitados y los transfiera a la Compañía Aseguradora a fin de la evaluación y otorgamiento de la Cobertura del Seguro Complementario de Trabajo de Riesgo, pudiendo esta última informar a la Compañía Minera, Contratistas o Corredor de Seguros de ambos el estado de la cobertura del Seguro Complementario de Trabajo de Riesgo. Esta declaración autoriza al Centro Médico Evaluador la transferencia al empleador y/o Compañía Aseguradora de la información de la historia clínica y exámenes médicos confidenciales de conformidad con la Ley 26842 (Ley General de Salud), y de la Ley 29783 (Ley de Seguridad y Salud en el Trabajo) y su Reglamento aprobado por Decreto Supremo 005-2012-TR."`;
  
  const lineasConsentimiento = doc.splitTextToSize(textoConsentimiento, anchoTexto);
  lineasConsentimiento.forEach((linea, idx) => {
    doc.text(linea, margin, yPos + (idx * lineHeight));
  });
  yPos += lineasConsentimiento.length * lineHeight + 15;

  // Fecha al final (alineada a la derecha): "de [día] de [mes] del [año]"
  doc.setFont("helvetica", "normal");
  const textoFecha = `de ${dia} de ${mes} del ${anio}`;
  const textoFechaWidth = doc.getTextWidth(textoFecha);
  doc.text(textoFecha, pageW - margin, yPos, { align: "right" });
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

