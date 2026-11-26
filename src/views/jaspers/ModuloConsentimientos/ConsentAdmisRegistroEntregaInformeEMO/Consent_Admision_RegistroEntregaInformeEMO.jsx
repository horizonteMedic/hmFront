import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta, formatearFechaLarga } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from "../../../utils/dibujarFirmas.js";

export default async function ConsentAdmisionRegistroEntregaInformeEMO(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Fecha de entrega del informe (yyyy-MM-dd); fechaRegistro viene como fecha-hora, por eso se recorta.
  const fechaEntrega = String(data?.fechaEntrega ?? data?.fechaEmo ?? data?.fechaRegistro ?? "").slice(0, 10);

  // Preparar datos
  const datosFinales = {
    apellidosNombres: String(((data?.apellidos ?? data?.apellidosPaciente ?? '') + ' ' + (data?.nombres ?? data?.nombresPaciente ?? '')).trim()),
    fechaExamen: formatearFechaCorta(fechaEntrega),
    documentoIdentidad: String(data?.codPa ?? data?.dniPaciente ?? ''),
    empresa: String(data?.empresa ?? ''),
    sede: String(data?.sede ?? data?.nombreSede ?? ''),
    numeroFicha: String(data?.norden ?? data?.nOrden ?? ''),
    codigoColor: String(data?.codigoColor ?? ''),
    textoColor: String(data?.textoColor ?? ''),
  };

  // Día, mes y año de la fecha (formatearFechaLarga devuelve: "28 de enero de 2025")
  const obtenerDiaMesAnio = (fechaStr) => {
    if (!fechaStr) return { dia: '', mes: '', anio: '' };
    try {
      const partes = formatearFechaLarga(fechaStr).split(' de ');
      if (partes.length >= 3) return { dia: partes[0], mes: partes[1], anio: partes[2] };
    } catch (error) {
      // se deja vacío
    }
    return { dia: '', mes: '', anio: '' };
  };

  const { dia, mes, anio } = obtenerDiaMesAnio(fechaEntrega);

  // Header
  const drawHeader = async () => {
    // Logo y membrete (CabeceraLogo es async: hay que esperarlo o el PDF se genera sin logo)
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Título (dos líneas)
    doc.setFont("helvetica", "bold").setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("REGISTRO DE ENTREGA E INFORME DE RESULTADOS DEL", pageW / 2, 50, { align: "center" });
    doc.text("EXAMEN MÉDICO OCUPACIONAL", pageW / 2, 57, { align: "center" });

    // Número de Ficha, Sede, Fecha y Página
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 70, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 50, 16);

    // Ancho disponible para la sede (evitar que se pise con el ColorBox)
    const xInicioSede = pageW - 70;
    const xFinColorBox = pageW - 5;
    const anchoDisponibleSede = xFinColorBox - xInicioSede - 5;

    doc.setFont("helvetica", "normal").setFontSize(8);
    const lineasSede = doc.splitTextToSize("Sede: " + datosFinales.sede, anchoDisponibleSede);
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

  await drawHeader();

  // === CONTENIDO DEL DOCUMENTO ===
  let yPos = 72;
  const margin = 15;
  const anchoTexto = pageW - (2 * margin);
  const lineHeight = 6;

  // Justifica texto con partes en negrita (misma lógica que el resto de consentimientos de admisión)
  const justificarTextoConNegritas = (partesTexto, x, y, anchoMaximo, interlineado) => {
    const palabrasConFormato = [];
    partesTexto.forEach(parte => {
      parte.texto.split(' ').filter(p => p.length > 0).forEach(palabra => {
        palabrasConFormato.push({ texto: palabra, negrita: parte.negrita });
      });
    });

    const lineas = [];
    let lineaActual = [];
    let anchoLineaActual = 0;

    palabrasConFormato.forEach((palabraObj, idx) => {
      doc.setFont("helvetica", palabraObj.negrita ? "bold" : "normal");
      const anchoPalabra = doc.getTextWidth(palabraObj.texto);
      const espacio = idx > 0 ? doc.getTextWidth(' ') : 0;
      const anchoTotal = anchoLineaActual + espacio + anchoPalabra;

      if (anchoTotal <= anchoMaximo || lineaActual.length === 0) {
        lineaActual.push(palabraObj);
        anchoLineaActual = anchoTotal;
      } else {
        lineas.push(lineaActual);
        lineaActual = [palabraObj];
        anchoLineaActual = anchoPalabra;
      }
    });
    if (lineaActual.length > 0) lineas.push(lineaActual);

    let yActual = y;
    lineas.forEach((linea, index) => {
      const esUltimaLinea = index === lineas.length - 1;
      const numPalabras = linea.length;
      let espacioExtra = 0;

      if (!esUltimaLinea && numPalabras > 1) {
        let anchoTotalLinea = 0;
        linea.forEach((palabraObj, i) => {
          doc.setFont("helvetica", palabraObj.negrita ? "bold" : "normal");
          anchoTotalLinea += doc.getTextWidth(palabraObj.texto);
          if (i < numPalabras - 1) anchoTotalLinea += doc.getTextWidth(' ');
        });
        espacioExtra = (anchoMaximo - anchoTotalLinea) / (numPalabras - 1);
      }

      let xActual = x;
      linea.forEach((palabraObj, i) => {
        doc.setFont("helvetica", palabraObj.negrita ? "bold" : "normal");
        doc.text(palabraObj.texto, xActual, yActual);
        if (i < numPalabras - 1) {
          xActual += doc.getTextWidth(palabraObj.texto) + doc.getTextWidth(' ') + espacioExtra;
        }
      });
      yActual += interlineado;
    });

    return yActual;
  };

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  // Párrafo 1
  const partesTexto1 = [
    { texto: "Yo ", negrita: false },
    { texto: datosFinales.apellidosNombres, negrita: true },
    { texto: " identificado(a) con DNI/CE N° ", negrita: false },
    { texto: datosFinales.documentoIdentidad, negrita: true },
    { texto: " dejo constancia que he sido ", negrita: false },
    { texto: "informado(a)", negrita: true },
    { texto: " acerca de los resultados del Examen Médico Ocupacional [*] que la empresa ", negrita: false },
    { texto: datosFinales.empresa, negrita: true },
    { texto: " me realizó en conformidad con la ", negrita: false },
    { texto: "Ley Nro. 29783 (Artículo 49, inciso d)", negrita: true },
    { texto: " a través del Servicio de Apoyo al Médico Ocupacional (SAMO) en la Clínica Ocupacional ", negrita: false },
    { texto: datosFinales.sede, negrita: true },
    { texto: " el día ", negrita: false },
    { texto: dia || "__", negrita: true },
    { texto: " del mes ", negrita: false },
    { texto: mes || "__", negrita: true },
    { texto: " del año ", negrita: false },
    { texto: anio || "202_", negrita: true },
    { texto: " los mismos que fueron entregados.", negrita: false },
  ];
  yPos = justificarTextoConNegritas(partesTexto1, margin, yPos, anchoTexto, lineHeight);
  yPos += 12;

  // Párrafo 2
  yPos = justificarTextoConNegritas([
    { texto: "Asimismo, asumo el compromiso de cumplir con las recomendaciones e indicaciones propuestas por el médico ocupacional.", negrita: false }
  ], margin, yPos, anchoTexto, lineHeight);

  // === FIRMA Y HUELLA DEL PACIENTE ===
  yPos += 40;
  const yPosFinalFirmas = await dibujarFirmas({ doc, datos: data, y: yPos, pageW });

  // DNI y fecha debajo de la firma
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(`DNI/CE/PASAPORTE: ${datosFinales.documentoIdentidad}`, margin + 20, yPosFinalFirmas + 1.5);
  doc.text(`FECHA: ${datosFinales.fechaExamen}`, margin + 20, yPosFinalFirmas + 6);

  // === NOTA AL PIE ===
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("[*]", margin, 268);
  doc.setFont("helvetica", "normal");
  doc.text("Acorde a ley N° 29783 (Artículo 71, inciso b)", margin + 5, 268);

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8, fontSize: 8 });

  if (docExistente) {
    return doc;
  } else {
    imprimir(doc);
  }
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
