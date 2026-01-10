import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta, formatearFechaLarga } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from "../../../utils/dibujarFirmas.js";

export default async function ConstanciaSuficienciaBrigadista(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Preparar datos según los campos del backend
  const datosFinales = {
    apellidosNombres: String(((data?.apellidosPaciente ?? '') + ' ' + (data?.nombresPaciente ?? '')).trim()),
    fechaExamen: formatearFechaCorta(data?.fecha ?? data?.fechaRegistro ?? ''),
    documentoIdentidad: String(data?.dniPaciente ?? ''),
    empresa: String(data?.empresa ?? ''),
    puestoTrabajo: String(data?.cargo ?? data?.cargoPaciente ?? ''),
    sede: String(data?.sede ?? data?.nombreSede ?? ''),
    numeroFicha: String(data?.norden ?? ''),
    codigoColor: String(data?.codigoColor ?? ''),
    textoColor: String(data?.textoColor ?? ''),
    estadoApto: data?.esActivo === true ? 'apto' : (data?.esActivo === false ? 'no apto' : 'apto'),
    vigencia: data?.vigencia ?? data?.fecha ?? data?.fechaRegistro ?? '',
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

  const fechaBase = data?.fecha ?? data?.fechaRegistro ?? '';
  const { dia, mes } = obtenerDiaYMes(fechaBase);
  const anio = new Date(fechaBase).getFullYear() || '';

  // Función para obtener fecha de vigencia
  const { dia: diaVigencia, mes: mesVigencia } = obtenerDiaYMes(datosFinales.vigencia);
  const anioVigencia = new Date(datosFinales.vigencia).getFullYear() || '';

  // Header
  const drawHeader = () => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Título
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("CONSTANCIA DE SUFICIENCIA MÉDICA PARA BRIGADISTAS", pageW / 2, 50, { align: "center" });

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
  let yPos = 65;
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

  // Texto de la constancia
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  // Primer párrafo completo: "Se hace constar que el Señor(a): [nombre] identificado con DNI N° [dni] de la empresa [empresa], con el cargo de [cargo] ha sido evaluado de la normativa vigente, estando [apto/no apto] para efectuar trabajos o actividades como brigadistas." - JUSTIFICADO
  const partesTexto1 = [
    { texto: "Se hace constar que el Señor(a): ", negrita: false },
    { texto: datosFinales.apellidosNombres, negrita: true },
    { texto: " identificado con DNI N° ", negrita: false },
    { texto: datosFinales.documentoIdentidad, negrita: true },
    { texto: " de la empresa ", negrita: false },
    { texto: datosFinales.empresa, negrita: true },
    { texto: ", con el cargo de ", negrita: false },
    { texto: datosFinales.puestoTrabajo, negrita: true },
    { texto: " ha sido evaluado de la normativa vigente, estando ", negrita: false },
    { texto: datosFinales.estadoApto.toUpperCase(), negrita: true },
    { texto: " para efectuar trabajos o actividades como brigadistas.", negrita: false }
  ];
  
  yPos = justificarTextoConNegritas(partesTexto1, margin, yPos, anchoTexto, lineHeight);
  yPos += 8;

  // Segundo párrafo: "La vigencia de esta constancia es del [fecha]" - JUSTIFICADO
  const textoVigencia = diaVigencia && mesVigencia && anioVigencia 
    ? `${diaVigencia} de ${mesVigencia} de ${anioVigencia}`
    : '';
  const partesTexto2 = [
    { texto: "La vigencia de esta constancia es del ", negrita: false },
    { texto: textoVigencia, negrita: true }
  ];
  
  yPos = justificarTextoConNegritas(partesTexto2, margin, yPos, anchoTexto, lineHeight);
  yPos += 8;

  // Texto sobre información de resultados médicos - JUSTIFICADO
  const textoInformacion = "A su vez se hace constar que se le ha informado al colaborador sobre los resultados Médicos Ocupacionales que se le practicaron en la fecha.";
  yPos = justificarTexto(textoInformacion, margin, yPos, anchoTexto, lineHeight);
  yPos += 15;

  // Fecha al final: "Fecha: [día] de [mes] de [año]"
  doc.setFont("helvetica", "normal");
  const textoFecha = `Fecha: ${dia} de ${mes} de ${anio}`;
  doc.text(textoFecha, margin, yPos);
  yPos += 20;

  // === FIRMA Y HUELLA DEL PACIENTE (usando dibujarFirmas) ===
  yPos += 10;
  
  // Usar la función dibujarFirmas del utils
  await dibujarFirmas({
    doc,
    datos: data,
    y: yPos,
    pageW: pageW
  });

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
