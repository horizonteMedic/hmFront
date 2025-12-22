import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from "../../../utils/dibujarFirmas.js";

export default async function ConsentAdmisionDeclaracionAntecePatologicos(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Datos de prueba por defecto
  const datosPrueba = {
    apellidosPaciente: "CASTILLO PLASENCIA",
    nombresPaciente: "HADY KATHERINE",
    dniPaciente: "72384273",
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

  // Header
  const drawHeader = () => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Título
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("DECLARACIÓN JURADA DE ANTECEDENTES PERSONALES Y", pageW / 2, 40, { align: "center" });
    doc.text("FAMILIARES", pageW / 2, 46, { align: "center" });

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
  const anchoTexto = pageW - (2 * margin);
  const lineHeight = 5;

  // Texto de la declaración
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  // "Señores: Corporación Peruana de Centros Médicos SAC – HORIZONTE MEDIC"
  doc.setFont("helvetica", "normal");
  doc.text("Señores: Corporación Peruana de Centros Médicos SAC – HORIZONTE MEDIC", margin, yPos);
  yPos += lineHeight + 2;

  // "Presente. -"
  doc.text("Presente. -", margin, yPos);
  yPos += lineHeight + 3;

  // "Estimados Señores:"
  doc.text("Estimados Señores:", margin, yPos);
  yPos += lineHeight + 5;

  // Unificar todos los datos personales en una línea continua
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

  // " Con DNI "
  doc.setFont("helvetica", "normal");
  const textoDni = " Con DNI ";
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

  // " Postulante al cargo de "
  doc.setFont("helvetica", "normal");
  const textoCargo = " Postulante al cargo de ";
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

  // " De la empresa "
  doc.setFont("helvetica", "normal");
  const textoEmpresa = " De la empresa ";
  const textoEmpresaWidth = doc.getTextWidth(textoEmpresa);
  if (xActual + textoEmpresaWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(textoEmpresa, xActual, yActual);
  xActual += textoEmpresaWidth;

  // Empresa en negrita
  doc.setFont("helvetica", "bold");
  const empresaWidth = doc.getTextWidth(datosFinales.empresa);
  if (xActual + empresaWidth > pageW - margin) {
    yActual += lineHeight;
    xActual = margin;
  }
  doc.text(datosFinales.empresa, xActual, yActual);
  
  yPos = yActual + lineHeight + 5;

  // "Declaro bajo juramento: Existen antecedentes personales y familiares:"
  doc.setFont("helvetica", "normal");
  const textoDeclaracion = "Declaro bajo juramento: Existen antecedentes personales y familiares:";
  doc.text(textoDeclaracion, margin, yPos);
  yPos += lineHeight + 3;

  // Casillas SI/NO
  doc.setFont("helvetica", "normal");
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  
  // "SI" con casilla
  doc.text("SI", margin, yPos);
  const casillaSize = 4;
  const xCasillaSI = margin + doc.getTextWidth("SI ") + 2;
  doc.rect(xCasillaSI, yPos - 3, casillaSize, casillaSize);
  
  // "NO" con casilla
  const xNO = xCasillaSI + casillaSize + 8;
  doc.text("NO", xNO, yPos);
  const xCasillaNO = xNO + doc.getTextWidth("NO ") + 2;
  doc.rect(xCasillaNO, yPos - 3, casillaSize, casillaSize);
  
  yPos += lineHeight + 2;

  // Texto entre paréntesis
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("(De marcar SI, detallar que antecedentes existen, considerar los antecedentes de la madre, padre, abuelo y abuela)", margin, yPos);
  yPos += lineHeight + 5;

  // "Detalle:" con líneas para escribir
  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.text("Detalle:", margin, yPos);
  yPos += lineHeight + 2;

  // Dibujar líneas para el detalle (7 líneas)
  const anchoLinea = anchoTexto;
  const alturaLinea = 4;
  const numLineas = 7;
  
  for (let i = 0; i < numLineas; i++) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.1);
    doc.line(margin, yPos, margin + anchoLinea, yPos);
    yPos += alturaLinea;
  }

  yPos += lineHeight + 5;

  // "Se suscribe la presente declaración jurada en conformidad de lo antes expuesto."
  doc.setFont("helvetica", "normal").setFontSize(11);
  const textoFinal = "Se suscribe la presente declaración jurada en conformidad de lo antes expuesto.";
  doc.text(textoFinal, margin, yPos);
  yPos += lineHeight + 5;

  // "Fecha:"
  doc.text("Fecha:", margin, yPos);
  yPos += lineHeight + 10;

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

