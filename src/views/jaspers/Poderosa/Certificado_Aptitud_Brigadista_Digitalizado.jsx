import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { convertirGenero, getSign } from "../../utils/helpers.js";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default async function Certificado_Aptitud_Brigadista_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const datosFinales = {
    apellidosNombres: String((data.apellidosPaciente || "") + " " + (data.nombresPaciente || "")).trim() || data.nombreCompletoPaciente || "",
    dniPaciente: String(data.dniPaciente || ""),
    edadPaciente: String(data.edadPaciente || ""),
    sexoPaciente: data.sexoPaciente || "",
    estadoCivilPaciente: data.estadoCivilPaciente || "",
    tipoExamen: data.tipoExamen || "",
    fechaNacimientoPaciente: formatearFechaCorta(data.fechaNacimientoPaciente),
    lugarNacimientoPaciente: data.lugarNacimientoPaciente || "",
    nivelEstudioPaciente: data.nivelEstudioPaciente || "",
    ocupacionPaciente: data.ocupacionPaciente || "",
    cargoPaciente: data.cargoPaciente || "",
    areaPaciente: data.areaPaciente || "",
    empresa: data.empresa || "",
    contrata: data.contrata || "",
    conclusiones: data.conclusiones || "",
    apto: data.apto || false,
    noApto: data.noApto || false,
    restricciones: data.restricciones || "",
    recomendaciones: data.recomendaciones || "",
    norden: String(data.norden || ""),
    sede: data.sede || data.nombreSede || "",
    fechaExamen: formatearFechaCorta(data.fechaExamen),
    textoColor: data.textoColor || "",
    codigoColor: data.codigoColor || "",
    digitalizacion: data.digitalizacion || []
  };

  // Header reutilizable
  const drawHeader = async (pageNumber) => {
    // Logo y membrete (CabeceraLogo maneja el logo HM y los datos de la clínica)
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal
    doc.setFont("helvetica", "bold").setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("CERTIFICADO DE APTITUD BRIGADISTA", pageW / 2, 45, { align: "center" });

    // Información de cabecera a la derecha
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 25, 10);

    doc.text("Nro de ficha: ", pageW - 85, 15);
    doc.setFont("helvetica", "bold").setFontSize(24);
    doc.text(datosFinales.norden, pageW - 65, 16);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosFinales.sede, pageW - 85, 22);
    doc.text("Fecha de examen: " + datosFinales.fechaExamen, pageW - 85, 27);

    // Bloque de color (posición mejorada)
    if (datosFinales.textoColor) {
      drawColorBox(doc, {
        color: datosFinales.codigoColor || "#008137",
        text: datosFinales.textoColor,
        x: pageW - 35,
        y: 10,
        size: 25,
        showLine: true,
        fontSize: 38,
        textPosition: 0.8
      });
    }
  };

  // === DIBUJAR HEADER ===
  await drawHeader(numeroPagina);

  // === FUNCIONES AUXILIARES ===
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 5) => {
    const tablaInicioX = 10;
    const tablaAncho = 190;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.setFillColor(204, 204, 204); // #CCCCCC
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'D');
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);
    return yPos + alturaHeader;
  };

  const drawRow = (y, heights, cols) => {
    const x = 10;
    const width = 190;
    const height = Math.max(...heights);

    doc.rect(x, y, width, height, 'D');

    let currentX = x;
    cols.forEach((col, i) => {
      if (i > 0) {
        doc.line(currentX, y, currentX, y + height);
      }

      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text(col.label + ":", currentX + 2, y + 3.5);

      doc.setFont("helvetica", "normal").setFontSize(8);
      const textX = currentX + 2 + doc.getTextWidth(col.label + ": ");
      const maxWidth = (cols[i + 1]?.x || (x + width)) - textX - 2;

      if (col.value) {
        const splitText = doc.splitTextToSize(String(col.value).toUpperCase(), col.width || 50);
        doc.text(splitText, textX, y + 3.5);
      }

      currentX += col.colWidth;
    });

    return y + height;
  };

  // === SECCIÓN: DATOS PERSONALES ===
  let yPos = 55;
  yPos = dibujarHeaderSeccion("DATOS PERSONALES", yPos);

  // Fila 1: Apellidos y Nombres
  doc.rect(10, yPos, 190, 6, 'D');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("APELLIDOS Y NOMBRES:", 12, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.apellidosNombres.toUpperCase(), 50, yPos + 4);
  yPos += 6;

  // Fila 2: DNI, Edad, Sexo
  doc.rect(10, yPos, 190, 6, 'D');
  doc.line(73, yPos, 73, yPos + 6);
  doc.line(136, yPos, 136, yPos + 6);

  doc.setFont("helvetica", "bold");
  doc.text("DNI:", 12, yPos + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datosFinales.dniPaciente, 20, yPos + 4);

  doc.setFont("helvetica", "bold");
  doc.text("EDAD:", 75, yPos + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datosFinales.edadPaciente + " AÑOS", 88, yPos + 4);

  doc.setFont("helvetica", "bold");
  doc.text("SEXO:", 138, yPos + 4);
  doc.setFont("helvetica", "normal");
  doc.text(convertirGenero(datosFinales.sexoPaciente), 150, yPos + 4);
  yPos += 6;

  // Fila 3: Estado Civil, Tipo Examen, Fecha Nacimiento
  doc.rect(10, yPos, 190, 6, 'D');
  doc.line(73, yPos, 73, yPos + 6);
  doc.line(136, yPos, 136, yPos + 6);

  doc.setFont("helvetica", "bold");
  doc.text("ESTADO CIVIL:", 12, yPos + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datosFinales.estadoCivilPaciente.toUpperCase(), 35, yPos + 4);

  doc.setFont("helvetica", "bold");
  doc.text("TIPO EXAMEN:", 75, yPos + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datosFinales.tipoExamen.toUpperCase(), 100, yPos + 4);

  doc.setFont("helvetica", "bold");
  doc.text("FECHA NACIMIENTO:", 138, yPos + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datosFinales.fechaNacimientoPaciente, 172, yPos + 4);
  yPos += 6;

  // Fila 4: Lugar de Nacimiento, Nivel de Estudio
  doc.rect(10, yPos, 190, 6, 'D');
  doc.line(136, yPos, 136, yPos + 6);

  doc.setFont("helvetica", "bold");
  doc.text("LUGAR DE NACIMIENTO:", 12, yPos + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datosFinales.lugarNacimientoPaciente.toUpperCase(), 50, yPos + 4);

  doc.setFont("helvetica", "bold");
  doc.text("NIVEL DE ESTUDIO:", 138, yPos + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datosFinales.nivelEstudioPaciente.toUpperCase(), 170, yPos + 4);
  yPos += 6;

  // Fila 5: Ocupación
  doc.rect(10, yPos, 190, 6, 'D');
  doc.setFont("helvetica", "bold");
  doc.text("OCUPACIÓN:", 12, yPos + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datosFinales.ocupacionPaciente.toUpperCase(), 35, yPos + 4);
  yPos += 6;

  // Fila 6: Cargo
  doc.rect(10, yPos, 190, 6, 'D');
  doc.setFont("helvetica", "bold");
  doc.text("CARGO:", 12, yPos + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datosFinales.cargoPaciente.toUpperCase(), 25, yPos + 4);
  yPos += 6;

  // Fila 7: Área
  doc.rect(10, yPos, 190, 6, 'D');
  doc.setFont("helvetica", "bold");
  doc.text("ÁREA:", 12, yPos + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datosFinales.areaPaciente.toUpperCase(), 22, yPos + 4);
  yPos += 6;

  // Fila 8: Empresa
  doc.rect(10, yPos, 190, 6, 'D');
  doc.setFont("helvetica", "bold");
  doc.text("EMPRESA:", 12, yPos + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datosFinales.empresa.toUpperCase(), 30, yPos + 4);
  yPos += 6;

  // Fila 9: Contrata
  doc.rect(10, yPos, 190, 6, 'D');
  doc.setFont("helvetica", "bold");
  doc.text("CONTRATA:", 12, yPos + 4);
  doc.setFont("helvetica", "normal");
  doc.text(datosFinales.contrata.toUpperCase(), 32, yPos + 4);
  yPos += 10;

  // === SECCIÓN: CONCLUSIONES ===
  yPos = dibujarHeaderSeccion("CONCLUSIONES:", yPos);
  doc.setFont("helvetica", "normal").setFontSize(6);
  const splitConclusiones = doc.splitTextToSize(datosFinales.conclusiones, 185);
  const conclusionesMinHeight = 30;
  const lineSpacing = 2.5;
  const calculatedConclusionesHeight = (splitConclusiones.length * lineSpacing) + 5;
  const conclusionesHeight = Math.max(conclusionesMinHeight, calculatedConclusionesHeight);

  doc.rect(10, yPos, 190, conclusionesHeight, 'D');
  doc.text(splitConclusiones, 12, yPos + 4);
  yPos += conclusionesHeight + 5;

  // === SECCIÓN: RESULTADO (APTO / NO APTO / RESTRICCIONES / RECOMENDACIONES) ===
  const resY = yPos;
  const col1W = 80;
  const col2W = 30;
  const col3W = 80;

  // Tabla de Aptitud (Izquierda Superior)
  doc.setLineWidth(0.2);
  doc.rect(10, resY, col1W + col2W, 10, 'D');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("APTO", 12, resY + 6.5);
  doc.line(col1W + 10, resY, col1W + 10, resY + 10);
  if (datosFinales.apto) doc.text("X", col1W + 20, resY + 6.5, { align: "center" });

  doc.rect(10, resY + 10, col1W + col2W, 10, 'D');
  doc.text("NO APTO", 12, resY + 16.5);
  doc.line(col1W + 10, resY + 10, col1W + 10, resY + 20);
  if (datosFinales.noApto) doc.text("X", col1W + 20, resY + 16.5, { align: "center" });

  // Calcular alturas dinámicas para Recomendaciones y Restricciones
  doc.setFont("helvetica", "normal").setFontSize(6);
  const splitRecs = doc.splitTextToSize(datosFinales.recomendaciones, col1W + col2W - 4);
  const splitRest = doc.splitTextToSize(datosFinales.restricciones, col3W - 4);

  const recsContentHeight = (splitRecs.length * lineSpacing) + 15;
  const restTextHeight = (splitRest.length * lineSpacing);
  const firmaAreaHeight = 35; // Espacio reservado para la firma y sello

  const minBottomBoxHeight = 70;
  // El cuadro de restricciones (derecha) debe contener: 
  // margen superior (8mm) + altura del texto + pequeño margen (2mm) + área de firma (35mm)
  const restRequiredHeight = 8 + restTextHeight + 2 + firmaAreaHeight;

  // El finalBottomHeight será el máximo entre el mínimo, lo que pide el lado izquierdo (recs) y lo que pide el derecho (rest + firma)
  const finalBottomHeight = Math.max(minBottomBoxHeight, recsContentHeight + 20, restRequiredHeight);

  // Dibujar Recomendaciones (Izquierda Inferior)
  doc.rect(10, resY + 20, col1W + col2W, finalBottomHeight - 20, 'D');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("RECOMENDACIONES:", 12, resY + 25);
  doc.setFont("helvetica", "normal").setFontSize(6);
  doc.text(splitRecs, 12, resY + 28);

  // Columna Derecha: Restricciones y Firma
  const rightX = 10 + col1W + col2W;
  doc.rect(rightX, resY, col3W, finalBottomHeight, 'D');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("RESTRICCIONES:", rightX + 2, resY + 5);
  doc.setFont("helvetica", "normal").setFontSize(6);
  doc.text(splitRest, rightX + 2, resY + 8);

  // Firma y Sello (Posicionados dinámicamente al final del cuadro derecho)
  const firmaY = resY + finalBottomHeight - firmaAreaHeight;

  // Línea divisoria entre texto de restricciones y área de firma
  doc.line(rightX, firmaY, rightX + col3W, firmaY);

  doc.line(rightX + 10, resY + finalBottomHeight - 10, rightX + col3W - 10, resY + finalBottomHeight - 10);
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("SELLO Y FIRMA DE MEDICO QUE CERTIFICA", rightX + col3W / 2, resY + finalBottomHeight - 6, { align: "center" });

  // Colocar firma si existe
  const firmaUrl = getSign(datosFinales, "SELLOFIRMA");
  if (firmaUrl && firmaUrl !== "Sin registro") {
    try {
      doc.addImage(firmaUrl, "PNG", rightX + 15, firmaY + 5, 50, 20);
    } catch (e) {
      console.error("Error adding signature image", e);
    }
  }

  // === FOOTER ===
  await footerTR(doc, { footerOffsetY: 10 });


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
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}
