import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils";
import { convertirGenero } from "../../../utils/helpers";
import drawColorBox from '../../components/ColorBox.jsx';
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from '../../../utils/dibujarFirmas.js';

export default async function Informe_PsicolaboralBorooA_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente) + " " + (data.nombresPaciente)).trim(),
    fechaExamen: formatearFechaCorta(data.fecha || data.fechaExamen || data.fechaRegistro || ""),
    tipoExamen: String(data.nombreExamen || data.tipoExamen || ""),
    sexo: convertirGenero(data.sexoPaciente),
    documentoIdentidad: String(data.dniPaciente || data.dni || ""),
    edad: String(data.edadPaciente || data.edad || ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente || data.fechaNacimiento || ""),
    areaTrabajo: data.areaPaciente || data.area || "",
    puestoTrabajo: data.cargoPaciente || data.cargo || "",
    empresa: data.empresa || "",
    contrata: data.contrata || "",
    // Datos de color
    color: data.color,
    codigoColor: data.codigoColor,
    textoColor: data.textoColor,
    // Datos adicionales para header
    numeroFicha: String(data.norden || data.numeroFicha || ""),
    sede: data.sede || data.nombreSede || "",
    horaSalida: String(data.horaSalida || ""),
    direccionPaciente: String(data.direccionPaciente || ""),
    // Datos para Aspectos Conductuales
    nivelAlertaRiesgo: data.nivelAlerta || data.nivelAlertaRiesgo || data.nivelAlertaAnteRiesgo || "-",
    tipoHostigamientoSexual: data.hostigamientoSexual || data.tipoHostigamientoSexual || "-",
    tipoConsecuenciaEncontrada: data.consecuencia || data.tipoConsecuenciaEncontrada || "-",
    // Datos para Observaciones, Recomendaciones y Conclusiones
    observaciones: data.observaciones || data.observacion || "",
    recomendaciones: data.recomendaciones || data.recomendacion || data.recomenda || "",
    conclusiones: data.conclusiones || data.conclusion || "",
    cumplePerfil: (typeof data.cumplePerfil === 'boolean') ? data.cumplePerfil : (data.apto === true || data.cumplePerfil === true)
  };

  // Usar solo datos reales
  const datosFinales = datosReales;

  // Header reutilizable
  const drawHeader = async (pageNumber) => {
    // Logo y membrete
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.text("INFORME PSICOLABORAL", pageW / 2, 32, { align: "center" });
    }

    // Número de Ficha y Página (alineación automática mejorada)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 60, 16);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosFinales.sede, pageW - 80, 20);
    doc.text("Fecha de examen: " + datosFinales.fechaExamen, pageW - 80, 25);

    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 30, 10);

    // Bloque de color (posición mejorada)
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

  // === DIBUJAR HEADER ===
  await drawHeader(numeroPagina);

  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    // Validar que el texto no sea undefined, null o vacío
    if (!texto || texto === null || texto === undefined) {
      return y;
    }

    const fontSize = doc.internal.getFontSize();
    const palabras = String(texto).split(' ');
    let lineaActual = '';
    let yPos = y;

    palabras.forEach(palabra => {
      const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);

      if (anchoTexto <= anchoMaximo) {
        lineaActual = textoPrueba;
      } else {
        if (lineaActual) {
          doc.text(lineaActual, x, yPos);
          yPos += fontSize * 0.35; // salto real entre líneas
          lineaActual = palabra;
        } else {
          doc.text(palabra, x, yPos);
          yPos += fontSize * 0.35;
        }
      }
    });

    if (lineaActual) {
      doc.text(lineaActual, x, yPos);
      yPos += fontSize * 0.35;
    }

    return yPos; // Devuelve la nueva posición final
  };

  // Función para dibujar X en las columnas
  const dibujarX = (x, y) => {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(0, 0, 255); // Azul para la X
    doc.text("X", x, y, { align: "center" });
    doc.setTextColor(0, 0, 0); // Resetear a negro
  };

  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;

    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // Dibujar fondo gris más oscuro
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');

    // Dibujar líneas del header
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);

    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);

    return yPos + alturaHeader;
  };

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 35;
  const filaAltura = 4.5;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);

  // Fila: Apellidos y Nombres con división para Tipo de examen
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura); // División para Tipo de examen
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Domicilio (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Empresa (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Contrata (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 35 + filaAltura + 2.5; // Ajustar para el header

  // Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Ajustar ancho para la nueva división (hasta x = tablaInicioX + 140)
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres || "", tablaInicioX + 35, yTexto + 1, 95);

  // Columna derecha: Tipo de examen
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.tipoExamen || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad || "", tablaInicioX + 12, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.edad ? (datosFinales.edad + " AÑOS") : ""), tablaInicioX + 58, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.sexo || "", tablaInicioX + 105, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.direccionPaciente || "", tablaInicioX + 25, yTexto + 1, 160);
  yTexto += filaAltura;

  // Puesto de Trabajo, Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.puestoTrabajo || "", tablaInicioX + 30, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.areaTrabajo || "", tablaInicioX + 118, yTexto + 1);
  yTexto += filaAltura;

  // Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa || "", tablaInicioX + 24, yTexto + 1, 160);
  yTexto += filaAltura;

  // Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contrata || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // === SECCIÓN: CRITERIOS PSICOLÓGICOS ===
  // (Misma estructura que el archivo original)
  // ... (copiar toda la sección de CRITERIOS PSICOLÓGICOS del archivo original)
  // Fila gris: Título CRITERIOS PSICOLÓGICOS
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Dibujar fondo gris
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  // Dibujar líneas del borde
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Texto del título (centrado)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CRITERIOS PSICOLÓGICOS", tablaInicioX + tablaAncho / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // Fila celeste: Aspecto Intelectual | Inferior | Promedio Inferior | Promedio | Promedio superior | Superior
  const colNumero = 8;
  const colAspecto = 60;
  const col1Total = colNumero + colAspecto;
  const anchoColumnaEvaluacion = (tablaAncho - col1Total) / 5;
  const col2 = anchoColumnaEvaluacion;
  const col3 = anchoColumnaEvaluacion;
  const col4 = anchoColumnaEvaluacion;
  const col5 = anchoColumnaEvaluacion;

  // Dibujar fondo celeste
  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  // Dibujar líneas verticales para las columnas del header
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + col1Total, yPos, tablaInicioX + col1Total, yPos + filaAltura);
  doc.line(tablaInicioX + col1Total + col2, yPos, tablaInicioX + col1Total + col2, yPos + filaAltura);
  doc.line(tablaInicioX + col1Total + col2 + col3, yPos, tablaInicioX + col1Total + col2 + col3, yPos + filaAltura);
  doc.line(tablaInicioX + col1Total + col2 + col3 + col4, yPos, tablaInicioX + col1Total + col2 + col3 + col4, yPos + filaAltura);
  doc.line(tablaInicioX + col1Total + col2 + col3 + col4 + col5, yPos, tablaInicioX + col1Total + col2 + col3 + col4 + col5, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Texto de las columnas del header
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Aspecto Intelectual", tablaInicioX + col1Total / 2, yPos + 3.5, { align: "center" });
  doc.text("Inferior", tablaInicioX + col1Total + col2 / 2, yPos + 3.5, { align: "center" });
  doc.text("Promedio Inferior", tablaInicioX + col1Total + col2 + col3 / 2, yPos + 3.5, { align: "center" });
  doc.text("Promedio", tablaInicioX + col1Total + col2 + col3 + col4 / 2, yPos + 3.5, { align: "center" });
  doc.text("Promedio superior", tablaInicioX + col1Total + col2 + col3 + col4 + col5 / 2, yPos + 3.5, { align: "center" });
  doc.text("Superior", tablaInicioX + col1Total + col2 + col3 + col4 + col5 + anchoColumnaEvaluacion / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // === FILAS DE ASPECTOS INTELECTUALES ===
  const aspectos = [
    "Razonamiento y Resolucion de problemas",
    "Memoria",
    "Atencion y Concentración",
    "Coordinación viso-motora",
    "Orientación Espacial",
    "Comprensión verbal"
  ];

  aspectos.forEach((aspecto, index) => {
    const numero = index + 1;
    const aspectoNum = numero;

    const inferior = data[`aspectoIntelectual${aspectoNum}I`];
    const promedioInferior = data[`aspectoIntelectual${aspectoNum}NPI`];
    const promedio = data[`aspectoIntelectual${aspectoNum}NP`];
    const promedioSuperior = data[`aspectoIntelectual${aspectoNum}NPS`];
    const superior = data[`aspectoIntelectual${aspectoNum}S`];

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + colNumero, yPos, tablaInicioX + colNumero, yPos + filaAltura);
    doc.line(tablaInicioX + col1Total, yPos, tablaInicioX + col1Total, yPos + filaAltura);
    doc.line(tablaInicioX + col1Total + col2, yPos, tablaInicioX + col1Total + col2, yPos + filaAltura);
    doc.line(tablaInicioX + col1Total + col2 + col3, yPos, tablaInicioX + col1Total + col2 + col3, yPos + filaAltura);
    doc.line(tablaInicioX + col1Total + col2 + col3 + col4, yPos, tablaInicioX + col1Total + col2 + col3 + col4, yPos + filaAltura);
    doc.line(tablaInicioX + col1Total + col2 + col3 + col4 + col5, yPos, tablaInicioX + col1Total + col2 + col3 + col4 + col5, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(String(numero), tablaInicioX + 2, yPos + 3.5);
    doc.text(aspecto, tablaInicioX + colNumero + 2, yPos + 3.5);

    const centroY = yPos + filaAltura / 2 + 1.2;
    if (inferior) {
      dibujarX(tablaInicioX + col1Total + col2 / 2, centroY);
    } else if (promedioInferior) {
      dibujarX(tablaInicioX + col1Total + col2 + col3 / 2, centroY);
    } else if (promedio) {
      dibujarX(tablaInicioX + col1Total + col2 + col3 + col4 / 2, centroY);
    } else if (promedioSuperior) {
      dibujarX(tablaInicioX + col1Total + col2 + col3 + col4 + col5 / 2, centroY);
    } else if (superior) {
      dibujarX(tablaInicioX + col1Total + col2 + col3 + col4 + col5 + anchoColumnaEvaluacion / 2, centroY);
    }

    yPos += filaAltura;
  });

  // Fila celeste: Aspectos de Personalidad
  const colNumeroPersonalidad = colNumero;
  const col1TotalPersonalidad = col1Total;
  const anchoColumnaEvaluacionPersonalidad = anchoColumnaEvaluacion;
  const col2Personalidad = col2;
  const col3Personalidad = col3;
  const col4Personalidad = col4;
  const col5Personalidad = col5;

  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPersonalidad, yPos, tablaInicioX + col1TotalPersonalidad, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Aspectos de Personalidad", tablaInicioX + col1TotalPersonalidad / 2, yPos + 3.5, { align: "center" });
  doc.text("Bajo", tablaInicioX + col1TotalPersonalidad + col2Personalidad / 2, yPos + 3.5, { align: "center" });
  doc.text("Promedio Bajo", tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad / 2, yPos + 3.5, { align: "center" });
  doc.text("Promedio", tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad / 2, yPos + 3.5, { align: "center" });
  doc.text("Promedio Alto", tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad / 2, yPos + 3.5, { align: "center" });
  doc.text("Alto", tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad + anchoColumnaEvaluacionPersonalidad / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // === FILAS DE ASPECTOS DE PERSONALIDAD ===
  const aspectosPersonalidad = [
    "Estabilidad emocional",
    "Tolerancia a la frustración",
    "Autoestima",
    "Asertividad",
    "Ansiedad ESTADO",
    "Ansiedad RASGO"
  ];

  aspectosPersonalidad.forEach((aspecto, index) => {
    const numero = index + 1;
    const aspectoNum = numero;

    const bajo = data[`aspectoPersonalidad${aspectoNum}B`];
    const promedioBajo = data[`aspectoPersonalidad${aspectoNum}NPB`];
    const promedio = data[`aspectoPersonalidad${aspectoNum}NP`];
    const promedioAlto = data[`aspectoPersonalidad${aspectoNum}NPA`];
    const alto = data[`aspectoPersonalidad${aspectoNum}A`];

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + colNumeroPersonalidad, yPos, tablaInicioX + colNumeroPersonalidad, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPersonalidad, yPos, tablaInicioX + col1TotalPersonalidad, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(String(numero), tablaInicioX + 2, yPos + 3.5);
    doc.text(aspecto, tablaInicioX + colNumeroPersonalidad + 2, yPos + 3.5);

    const centroY = yPos + filaAltura / 2 + 1.2;
    if (bajo) {
      dibujarX(tablaInicioX + col1TotalPersonalidad + col2Personalidad / 2, centroY);
    } else if (promedioBajo) {
      dibujarX(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad / 2, centroY);
    } else if (promedio) {
      dibujarX(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad / 2, centroY);
    } else if (promedioAlto) {
      dibujarX(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad / 2, centroY);
    } else if (alto) {
      dibujarX(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad + anchoColumnaEvaluacionPersonalidad / 2, centroY);
    }

    yPos += filaAltura;
  });

  // === SECCIÓN: ASPECTOS CONDUCTUALES ===
  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Aspectos Conductuales", tablaInicioX + tablaAncho / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  const colNumeroConductual = 8;
  const colDescripcionConductual = 60;

  const aspectosConductuales = [
    {
      descripcion: "Nivel de alerta ante el riesgo",
      valor: datosFinales.nivelAlertaRiesgo || "-"
    },
    {
      descripcion: "Tipo de hostigamiento sexual",
      valor: datosFinales.tipoHostigamientoSexual || "-"
    },
    {
      descripcion: "Tipo de consecuencia encontrada",
      valor: datosFinales.tipoConsecuenciaEncontrada || "-"
    }
  ];

  for (let index = 0; index < aspectosConductuales.length; index++) {
    const aspecto = aspectosConductuales[index];
    const numero = index + 1;

    if (yPos + filaAltura > pageHeight - 20) {
      doc.addPage();
      numeroPagina++;
      yPos = 45;
      await drawHeader(numeroPagina);
    }

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + colNumeroConductual, yPos, tablaInicioX + colNumeroConductual, yPos + filaAltura);
    doc.line(tablaInicioX + colNumeroConductual + colDescripcionConductual, yPos, tablaInicioX + colNumeroConductual + colDescripcionConductual, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(String(numero), tablaInicioX + 2, yPos + 3.5);
    doc.text(aspecto.descripcion, tablaInicioX + colNumeroConductual + 2, yPos + 3.5);
    
    const anchoColumnaValor = tablaAncho - (colNumeroConductual + colDescripcionConductual) - 4;
    const xValor = tablaInicioX + colNumeroConductual + colDescripcionConductual + 2;
    const yInicioValor = yPos + 3;
    
    doc.setFont("helvetica", "normal").setFontSize(8);
    let yFinalValor = dibujarTextoConSaltoLinea(String(aspecto.valor), xValor, yInicioValor, anchoColumnaValor);

    const alturaMaximaValor = pageHeight - yPos - 25;
    if (yFinalValor - yPos > alturaMaximaValor) {
      doc.addPage();
      numeroPagina++;
      yPos = 45;
      await drawHeader(numeroPagina);
      
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.2);
      doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
      doc.line(tablaInicioX + colNumeroConductual, yPos, tablaInicioX + colNumeroConductual, yPos + filaAltura);
      doc.line(tablaInicioX + colNumeroConductual + colDescripcionConductual, yPos, tablaInicioX + colNumeroConductual + colDescripcionConductual, yPos + filaAltura);
      doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
      doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
      
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(String(numero), tablaInicioX + 2, yPos + 3.5);
      doc.text(aspecto.descripcion, tablaInicioX + colNumeroConductual + 2, yPos + 3.5);
      
      doc.setFont("helvetica", "normal").setFontSize(8);
      yFinalValor = dibujarTextoConSaltoLinea(String(aspecto.valor), xValor, yPos + 3, anchoColumnaValor);
    }

    const alturaNecesaria = yFinalValor - yPos;
    const alturaMinimaFila = filaAltura;
    const alturaRealFila = Math.max(alturaMinimaFila, alturaNecesaria + 2);

    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaRealFila);
    doc.line(tablaInicioX + colNumeroConductual, yPos, tablaInicioX + colNumeroConductual, yPos + alturaRealFila);
    doc.line(tablaInicioX + colNumeroConductual + colDescripcionConductual, yPos, tablaInicioX + colNumeroConductual + colDescripcionConductual, yPos + alturaRealFila);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaRealFila);
    doc.line(tablaInicioX, yPos + alturaRealFila, tablaInicioX + tablaAncho, yPos + alturaRealFila);

    yPos += alturaRealFila;
  }

  // === SECCIÓN: ASPECTOS PSICOLABORALES ===
  const colNumeroPsicolaboral = colNumero;
  const col1TotalPsicolaboral = col1Total;
  const anchoColumnaEvaluacionPsicolaboral = anchoColumnaEvaluacion;
  const col2Psicolaboral = anchoColumnaEvaluacionPsicolaboral;
  const col3Psicolaboral = anchoColumnaEvaluacionPsicolaboral;
  const col4Psicolaboral = anchoColumnaEvaluacionPsicolaboral;
  const col5Psicolaboral = anchoColumnaEvaluacionPsicolaboral;

  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPsicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral, yPos + filaAltura);
  doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Aspectos Psicolaborales", tablaInicioX + col1TotalPsicolaboral / 2, yPos + 3.5, { align: "center" });
  doc.text("Poco desarrollado", tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral / 2, yPos + 3.5, { align: "center" });
  doc.text("Necesita mejorar", tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral / 2, yPos + 3.5, { align: "center" });
  doc.text("Adecuado", tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral / 2, yPos + 3.5, { align: "center" });
  doc.text("Destacado", tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral / 2, yPos + 3.5, { align: "center" });
  doc.text("Excepcional", tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral + anchoColumnaEvaluacionPsicolaboral / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  const aspectosPsicolaborales = [
    "Capacidad de influencia",
    "Adaptacion a los cambios",
    "Trabajo en equipo y colaboración",
    "Orientación a la acción y mejora de procesos",
    "Autonomia y proactividad",
    "Toma de decisiones",
    "Crecimiento personal",
    "Motivación"
  ];

  aspectosPsicolaborales.forEach((aspecto, index) => {
    const numero = index + 1;
    const aspectoNum = numero;

    const pocoDesarrollado = data[`aspectosPsicolaborales${aspectoNum}PD`];
    const necesitaMejorar = data[`aspectosPsicolaborales${aspectoNum}NM`];
    const adecuado = data[`aspectosPsicolaborales${aspectoNum}A`];
    const destacado = data[`aspectosPsicolaborales${aspectoNum}D`];
    const excepcional = data[`aspectosPsicolaborales${aspectoNum}E`] || data[`aspectosPsicolaborales${aspectoNum}NA`];

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + colNumeroPsicolaboral, yPos, tablaInicioX + colNumeroPsicolaboral, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPsicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral, yPos + filaAltura);
    doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(String(numero), tablaInicioX + 2, yPos + 3.5);
    doc.text(aspecto, tablaInicioX + colNumeroPsicolaboral + 2, yPos + 3.5);

    const centroY = yPos + filaAltura / 2 + 1.2;
    if (pocoDesarrollado) {
      dibujarX(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral / 2, centroY);
    } else if (necesitaMejorar) {
      dibujarX(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral / 2, centroY);
    } else if (adecuado) {
      dibujarX(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral / 2, centroY);
    } else if (destacado) {
      dibujarX(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral / 2, centroY);
    } else if (excepcional) {
      dibujarX(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral + anchoColumnaEvaluacionPsicolaboral / 2, centroY);
    }

    yPos += filaAltura;
  });

  // === SECCIÓN: OBSERVACIONES (CON HEADER GRIS) ===
  const espacioMinimo = 15;

  if (yPos + espacioMinimo > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
  }

  // Header gris: OBSERVACIONES
  yPos = dibujarHeaderSeccion("OBSERVACIONES:", yPos, filaAltura);

  // Fila dinámica para contenido de observaciones
  const textoObservaciones = (datosFinales.observaciones || "-").toUpperCase();

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

  doc.setFont("helvetica", "normal").setFontSize(7);
  let yFinalObservaciones = dibujarTextoConSaltoLinea(textoObservaciones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);

  const alturaMaximaObs = pageHeight - yPos - 25;
  if (yFinalObservaciones - yPos > alturaMaximaObs) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
    doc.setFont("helvetica", "normal").setFontSize(7);
    yFinalObservaciones = dibujarTextoConSaltoLinea(textoObservaciones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
  }

  const alturaNecesariaObservaciones = yFinalObservaciones - yPos;
  const alturaMinimaFilaObs = filaAltura;
  const alturaRealObservaciones = Math.max(alturaMinimaFilaObs, alturaNecesariaObservaciones + 2);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaRealObservaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaRealObservaciones);
  doc.line(tablaInicioX, yPos + alturaRealObservaciones, tablaInicioX + tablaAncho, yPos + alturaRealObservaciones);

  yPos += alturaRealObservaciones;

  // === SECCIÓN: RECOMENDACIONES (CON HEADER GRIS) ===
  if (yPos + espacioMinimo > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
  }

  // Header gris: RECOMENDACIONES
  yPos = dibujarHeaderSeccion("RECOMENDACIONES:", yPos, filaAltura);

  // Fila dinámica para contenido de recomendaciones
  const textoRecomendaciones = (datosFinales.recomendaciones || "-").toUpperCase();

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

  doc.setFont("helvetica", "normal").setFontSize(7);
  let yFinalRecomendaciones = dibujarTextoConSaltoLinea(textoRecomendaciones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);

  const alturaMaximaRec = pageHeight - yPos - 25;
  if (yFinalRecomendaciones - yPos > alturaMaximaRec) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
    doc.setFont("helvetica", "normal").setFontSize(7);
    yFinalRecomendaciones = dibujarTextoConSaltoLinea(textoRecomendaciones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
  }

  const alturaNecesariaRecomendaciones = yFinalRecomendaciones - yPos;
  const alturaMinimaFilaRec = filaAltura;
  const alturaRealRecomendaciones = Math.max(alturaMinimaFilaRec, alturaNecesariaRecomendaciones + 2);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaRealRecomendaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaRealRecomendaciones);
  doc.line(tablaInicioX, yPos + alturaRealRecomendaciones, tablaInicioX + tablaAncho, yPos + alturaRealRecomendaciones);

  yPos += alturaRealRecomendaciones;

  // === SECCIÓN: CONCLUSIONES (CON HEADER GRIS) ===
  if (yPos + espacioMinimo > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
  }

  // Header gris: CONCLUSIONES
  yPos = dibujarHeaderSeccion("CONCLUSIONES:", yPos, filaAltura);

  // Fila dinámica para contenido de conclusiones
  const textoConclusiones = (datosFinales.conclusiones || "-").toUpperCase();

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);

  doc.setFont("helvetica", "normal").setFontSize(7);
  let yFinalConclusiones = dibujarTextoConSaltoLinea(textoConclusiones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);

  const alturaMaximaConcl = pageHeight - yPos - 25;
  if (yFinalConclusiones - yPos > alturaMaximaConcl) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
    doc.setFont("helvetica", "normal").setFontSize(7);
    yFinalConclusiones = dibujarTextoConSaltoLinea(textoConclusiones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
  }

  const alturaNecesariaConclusiones = yFinalConclusiones - yPos;
  const alturaMinimaFilaConcl = filaAltura;
  const alturaRealConclusiones = Math.max(alturaMinimaFilaConcl, alturaNecesariaConclusiones + 2);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaRealConclusiones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaRealConclusiones);
  doc.line(tablaInicioX, yPos + alturaRealConclusiones, tablaInicioX + tablaAncho, yPos + alturaRealConclusiones);

  yPos += alturaRealConclusiones;

  // === SECCIÓN: CUMPLE/NO CUMPLE CON EL PERFIL (CON HEADER GRIS) ===
  if (yPos + filaAltura + 5 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
  }

  // Header gris: CUMPLE CON EL PERFIL / NO CUMPLE CON EL PERFIL
  yPos = dibujarHeaderSeccion("CUMPLE CON EL PERFIL / NO CUMPLE CON EL PERFIL", yPos, filaAltura);

  // Fila con dos columnas iguales
  const anchoColumna = tablaAncho / 2;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  doc.line(tablaInicioX + anchoColumna, yPos, tablaInicioX + anchoColumna, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // === COLUMNA IZQUIERDA: CUMPLE CON EL PERFIL ===
  const miniCeldaSize = 6;
  const divisionCumpleX = tablaInicioX + anchoColumna - miniCeldaSize;
  doc.line(divisionCumpleX, yPos, divisionCumpleX, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CUMPLE CON EL PERFIL", tablaInicioX + 2, yPos + 3.5);

  const miniCeldaXCumple = divisionCumpleX;
  const miniCeldaYCumple = yPos;

  if (datosFinales.cumplePerfil === true) {
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 255);
    doc.text("X", miniCeldaXCumple + miniCeldaSize / 2, miniCeldaYCumple + filaAltura / 2 + 1.2, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  // === COLUMNA DERECHA: NO CUMPLE CON EL PERFIL ===
  const divisionNoCumpleX = tablaInicioX + tablaAncho - miniCeldaSize;
  doc.line(divisionNoCumpleX, yPos, divisionNoCumpleX, yPos + filaAltura);

  const xTextoNoCumple = tablaInicioX + anchoColumna + 2;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("NO CUMPLE CON EL PERFIL", xTextoNoCumple, yPos + 3.5);

  const miniCeldaXNoCumple = divisionNoCumpleX;
  const miniCeldaYNoCumple = yPos;

  if (datosFinales.cumplePerfil === false) {
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 255);
    doc.text("X", miniCeldaXNoCumple + miniCeldaSize / 2, miniCeldaYNoCumple + filaAltura / 2 + 1.2, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  yPos += filaAltura;

  // === SECCIÓN DE FIRMA ===
  if (yPos + 30 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    await drawHeader(numeroPagina);
  }

  const alturaSeccionFirma = 30;
  const yFirmas = yPos;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yFirmas, tablaAncho, alturaSeccionFirma, 'S');

  // Usar dibujarFirmas en lugar de getSign
  await dibujarFirmas({ doc, datos: data, y: yFirmas + 2, pageW });

  yPos += alturaSeccionFirma;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 12, fontSize: 7 });

  // === Imprimir ===
  imprimir(doc);
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

