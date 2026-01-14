import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta, formatearFechaLarga } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from "../../../utils/dibujarFirmas.js";

export default async function ConsentAdmisionInformacionAptitudMedicoOcupacional(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Preparar datos
  const datosFinales = {
    apellidosNombres: String(((data?.apellidosPaciente ?? '') + ' ' + (data?.nombresPaciente ?? '')).trim()),
    fechaExamen: formatearFechaCorta(data?.fechaRegistro ?? ''),
    documentoIdentidad: String(data?.dniPaciente ?? ''),
    edad: String(data?.edadPaciente ?? ''),
    puestoTrabajo: String(data?.cargoPaciente ?? ''),
    empresa: String(data?.empresa ?? ''),
    sede: String(data?.sede ?? data?.nombreSede ?? ''),
    numeroFicha: String(data?.norden ?? ''),
    codigoColor: String(data?.codigoColor ?? ''),
    textoColor: String(data?.textoColor ?? ''),
    tipoExamen: String(data?.tipoExamen ?? ''),
  };

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

  const { dia, mes } = obtenerDiaYMes(data?.fechaRegistro);
  const anio = new Date(data?.fechaRegistro).getFullYear() || '';

  // Header
  const drawHeader = () => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Título (dividido en dos líneas, bajado más)
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("DECLARACIÓN JURADA DE INFORMACIÓN DE", pageW / 2, 50, { align: "center" });
    doc.text("APTITUD MÉDICO OCUPACIONAL", pageW / 2, 57, { align: "center" });

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
  let yPos = 70; // Bajado más
  const margin = 15;
  const anchoTexto = pageW - (2 * margin);
  const lineHeight = 5;

  // Función para justificar texto con partes en negrita (igual que en Consent_Admision_ExamenMedicoPeru)
  const justificarTextoConNegritas = (partesTexto, x, y, anchoMaximo, interlineado) => {
    // Construir lista de palabras con su formato (negrita o no)
    const palabrasConFormato = [];
    
    partesTexto.forEach(parte => {
      const palabras = parte.texto.split(' ').filter(p => p.length > 0);
      palabras.forEach(palabra => {
        palabrasConFormato.push({ texto: palabra, negrita: parte.negrita });
      });
    });

    // Construir líneas manualmente palabra por palabra
    const lineas = [];
    let lineaActual = [];
    let anchoLineaActual = 0;

    palabrasConFormato.forEach((palabraObj, idx) => {
      const palabra = palabraObj.texto;
      doc.setFont("helvetica", palabraObj.negrita ? "bold" : "normal");
      const anchoPalabra = doc.getTextWidth(palabra);
      const espacio = idx > 0 ? doc.getTextWidth(' ') : 0;
      const anchoTotal = anchoLineaActual + espacio + anchoPalabra;

      if (anchoTotal <= anchoMaximo || lineaActual.length === 0) {
        // Agregar palabra a la línea actual
        lineaActual.push(palabraObj);
        anchoLineaActual = anchoTotal;
      } else {
        // Nueva línea
        lineas.push(lineaActual);
        lineaActual = [palabraObj];
        anchoLineaActual = anchoPalabra;
      }
    });

    // Agregar última línea
    if (lineaActual.length > 0) {
      lineas.push(lineaActual);
    }

    // Dibujar líneas justificadas
    let yActual = y;

    lineas.forEach((linea, index) => {
      const esUltimaLinea = index === lineas.length - 1;
      const numPalabras = linea.length;

      if (!esUltimaLinea && numPalabras > 1) {
        // Justificar línea
        // Calcular ancho total de la línea
        let anchoTotalLinea = 0;
        linea.forEach((palabraObj, i) => {
          doc.setFont("helvetica", palabraObj.negrita ? "bold" : "normal");
          anchoTotalLinea += doc.getTextWidth(palabraObj.texto);
          if (i < numPalabras - 1) {
            anchoTotalLinea += doc.getTextWidth(' ');
          }
        });

        const espacioExtra = (anchoMaximo - anchoTotalLinea) / (numPalabras - 1);
        let xActual = x;

        linea.forEach((palabraObj, i) => {
          doc.setFont("helvetica", palabraObj.negrita ? "bold" : "normal");
          doc.text(palabraObj.texto, xActual, yActual);

          if (i < numPalabras - 1) {
            const anchoPalabra = doc.getTextWidth(palabraObj.texto);
            xActual += anchoPalabra + doc.getTextWidth(' ') + espacioExtra;
          }
        });
      } else {
        // Última línea, no justificar
        let xActual = x;

        linea.forEach((palabraObj, i) => {
          doc.setFont("helvetica", palabraObj.negrita ? "bold" : "normal");
          doc.text(palabraObj.texto, xActual, yActual);

          if (i < numPalabras - 1) {
            xActual += doc.getTextWidth(palabraObj.texto + ' ');
          }
        });
      }
      yActual += interlineado;
    });

    return yActual;
  };

  // Función simple para justificar texto normal
  const justificarTexto = (texto, x, y, anchoMaximo, interlineado) => {
    const lineas = doc.splitTextToSize(texto, anchoMaximo);
    let yActual = y;

    lineas.forEach((linea, index) => {
      if (index < lineas.length - 1 && linea.includes(' ')) {
        const palabras = linea.split(' ');
        if (palabras.length > 1) {
          doc.setFont("helvetica", "normal");
          const anchoTexto = doc.getTextWidth(linea);
          const espacioDisponible = anchoMaximo - anchoTexto;
          const espaciosEntrePalabras = palabras.length - 1;
          const espacioExtra = espacioDisponible / espaciosEntrePalabras;

          let xActual = x;
          palabras.forEach((palabra, i) => {
            doc.text(palabra, xActual, yActual);
            if (i < palabras.length - 1) {
              const anchoPalabra = doc.getTextWidth(palabra);
              xActual += anchoPalabra + (doc.getTextWidth(' ') + espacioExtra);
            }
          });
        } else {
          doc.text(linea, x, yActual);
        }
      } else {
        doc.text(linea, x, yActual);
      }
      yActual += interlineado;
    });

    return yActual;
  };

  // Texto de la declaración
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  // Primera línea: "Yo, [nombre], de [edad] años de edad..." - JUSTIFICADO
  const partesTexto1 = [
    { texto: "Yo, ", negrita: false },
    { texto: datosFinales.apellidosNombres, negrita: true },
    { texto: ", de ", negrita: false },
    { texto: datosFinales.edad, negrita: true },
    { texto: " años de edad, identificado(a) con DNI N°: ", negrita: false },
    { texto: datosFinales.documentoIdentidad, negrita: true },
    { texto: ", postulante al cargo de ", negrita: false },
    { texto: datosFinales.puestoTrabajo, negrita: true },
    { texto: ", para la empresa ", negrita: false },
    { texto: datosFinales.empresa, negrita: true }
  ];
  
  yPos = justificarTextoConNegritas(partesTexto1, margin, yPos, anchoTexto, lineHeight);
  yPos += 5;

  // Segunda línea: "declaro haber sido informado sobre la APTITUD y RECOMENDACIONES..." - JUSTIFICADO
  const partesTexto2 = [
    { texto: "Declaro haber sido informado sobre la ", negrita: false },
    { texto: "APTITUD y RECOMENDACIONES", negrita: true },
    { texto: " de mi examen médico ", negrita: false },
    { texto: datosFinales.tipoExamen, negrita: true },
    { texto: " Realizado en el Policlínico Horizonte Medic de la ciudad de Trujillo.", negrita: false }
  ];
  
  yPos = justificarTextoConNegritas(partesTexto2, margin, yPos, anchoTexto, lineHeight);
  yPos += 5;

  // Tercera línea: "Firmo la presente declaración en conformidad a lo expuesto líneas arriba." - JUSTIFICADO
  const textoFirmo = "Firmo la presente declaración en conformidad a lo expuesto líneas arriba.";
  yPos = justificarTexto(textoFirmo, margin, yPos, anchoTexto, lineHeight);
  yPos += 10;

  // Cuarta línea: "Trujillo, [día] de [mes] 2025."
  doc.setFont("helvetica", "normal");
  const textoFecha = `Trujillo, ${dia} de ${mes} ${anio}.`;
  doc.text(textoFecha, margin, yPos);
  yPos += 20;

  // === FIRMA Y HUELLA DEL PACIENTE (usando dibujarFirmas, bajada 55mm) ===
  yPos += 55;
  
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
  doc.text(`DNI: ${datosFinales.documentoIdentidad}`, centroX, yPosFinalFirmas + 1.5, { align: "center" });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8, fontSize: 8 });

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
