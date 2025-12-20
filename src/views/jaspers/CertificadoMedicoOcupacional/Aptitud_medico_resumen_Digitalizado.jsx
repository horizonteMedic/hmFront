import jsPDF from "jspdf";
import PropTypes from "prop-types";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { getSign } from "../../utils/helpers";
import CabeceraLogo from "../components/CabeceraLogo.jsx";
import drawColorBox from "../components/ColorBox.jsx";
import footerTR from "../components/footerTR.jsx";

export default async function Aptitud_medico_resumen_Digitalizado(data = {}) {

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Datos reales mapeados
  const datosFinales = {
    numeroFicha: String(data.norden ?? data.n_orden ?? data.norden_n_orden ?? ""),
    sede: data.sede || data.nombreSede || "",
    fechaExamen: formatearFechaCorta(data.fechaDesde ?? data.fechaExamen ?? data.fechaAnexo16a_fecha_anexo ?? ""),
    apellidosNombres: String((data.apellidoPaciente ?? data.apellidosPaciente ?? data.apellidos_apellidos_pa ?? "") + " " + (data.nombrePaciente ?? data.nombresPaciente ?? data.nombres_nombres_pa ?? "")).trim(),
    documentoIdentidad: String(data.dniPaciente ?? data.dni_cod_pa ?? ""),
    genero: data.sexoPaciente === "M" ? "MASCULINO" : data.sexoPaciente === "F" ? "FEMENINO" : (data.sexo || data.sexo_sexo_pa || ""),
    edad: String(data.edadPaciente ?? data.edad_edad ?? ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente ?? data.fechaNacimiento ?? ""),
    domicilio: String(data.direccionPaciente ?? data.domicilio ?? ""),
    puestoTrabajo: String(data.cargoPaciente ?? data.puestoTrabajo ?? data.cargo_cargo_de ?? ""),
    areaTrabajo: String(data.areaPaciente ?? data.areaTrabajo ?? data.area_area_o ?? ""),
    empresa: String(data.empresa ?? data.empresa_razon_empresa ?? ""),
    contratista: String(data.contrata ?? data.contrata_razon_contrata ?? ""),
    tipoExamen: String(data.nombreExamen ?? data.tipoExamen ?? ""),
    examenesRealizados: String(data.conclusiones),
    resultadosResumen: String(
      data.resultadosResumen ?? data.resultados ?? data.resultado ?? ""
    ),
    color: data.color || data.informacionSede?.color || 1,
    codigoColor: data.codigoColor || data.informacionSede?.codigoColor || "#008f39",
    textoColor: data.textoColor || data.informacionSede?.textoColor || "F",
    // Datos específicos para aptitud
    apto: Boolean(data.apto ?? false),
    aptoconrestriccion: Boolean(data.aptoconrestriccion ?? false),
    noapto: Boolean(data.noapto ?? false),
    fechaDesde: data.fechaDesde || "",
    // Datos de digitalización
    digitalizacion: data.digitalizacion || []
  };

  // Header reutilizable
  const drawHeader = async (pageNumber) => {
    // Logo y membrete
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 6.5 });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("CONSTANCIA DE EXAMEN MEDICO OCUPACIONAL", pageW / 2, 40, { align: "center" });
    }

    // Número de Ficha y Página
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 13);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha || "", pageW - 60, 13);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Pag. " + "01", pageW - 30, 8);
    doc.text("Sede: " + (datosFinales.sede || ""), pageW - 80, 18);
    doc.text("Fecha de examen: " + (datosFinales.fechaExamen || ""), pageW - 80, 23);
    doc.text("Código clínica: " + (data.codigoClinica || ""), pageW - 80, 28);

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

  // Dibujar header
  await drawHeader(1);

  // Parámetros de tabla
  const tablaInicioX = 10;
  const tablaInicioY = 45;
  const tablaAncho = 190;
  const filaAltura = 5;
  let yPos = tablaInicioY;

  // Header de sección filiación (datos personales)
  const dibujarHeaderSeccion = (titulo, yPosLocal, alturaHeader = 4) => {
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPosLocal, tablaAncho, alturaHeader, 'F');
    doc.line(tablaInicioX, yPosLocal, tablaInicioX + tablaAncho, yPosLocal);
    doc.line(tablaInicioX, yPosLocal + alturaHeader, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.line(tablaInicioX, yPosLocal, tablaInicioX, yPosLocal + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPosLocal, tablaInicioX + tablaAncho, yPosLocal + alturaHeader);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo, tablaInicioX + 2, yPosLocal + 3);
    return yPosLocal + alturaHeader;
  };

  // Texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    const fontSize = doc.internal.getFontSize();
    const palabras = String(texto || "").split(' ');
    let lineaActual = '';
    let yActual = y;
    palabras.forEach(palabra => {
      const prueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
      const w = doc.getTextWidth(prueba);
      if (w <= anchoMaximo) {
        lineaActual = prueba;
      } else {
        if (lineaActual) {
          doc.text(lineaActual, x, yActual);
          yActual += fontSize * 0.35;
          lineaActual = palabra;
        } else {
          doc.text(palabra, x, yActual);
          yActual += fontSize * 0.35;
        }
      }
    });
    if (lineaActual) doc.text(lineaActual, x, yActual);
    return yActual;
  };

  // Sección: 1. DATOS PERSONALES (FILIACIÓN)
  yPos = dibujarHeaderSeccion("1. CERTIFICA que el Sr. (a)", yPos, filaAltura);

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

  // Fila: Puesto de Trabajo (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Área de Trabajo (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
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

  // Contenido de la tabla (ubicar texto debajo del header gris)
  let yTexto = tablaInicioY + filaAltura + 2.5;

  // Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Ajustar ancho para la nueva división (hasta x = tablaInicioX + 140)
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 35, yTexto + 1, 95);

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
  doc.text((datosFinales.edad ? (datosFinales.edad + " Años") : ""), tablaInicioX + 58, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.genero || datosFinales.sexo || "", tablaInicioX + 105, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento || "", tablaInicioX + 155, yTexto + 1);
  yTexto += filaAltura;

  // Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.domicilio || "", tablaInicioX + 25, yTexto + 1, 160);
  yTexto += filaAltura;

  // Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo || "", tablaInicioX + 30, yTexto + 1, 160);
  yTexto += filaAltura;

  // Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo || "", tablaInicioX + 30, yTexto + 1, 160);
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
  doc.text(datosFinales.contratista || datosFinales.contrata || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // ====================
  // 2. SECCIÓN DE EXÁMENES REALIZADOS
  // ====================
  // Header gris
  yPos = dibujarHeaderSeccion("2. HE PASADO EXAMEN MÉDICO EN POLICLÍNICO HORIZONTE MEDIC", yPos, filaAltura);

  // Fila: título "EXAMENES REALIZADOS"
  const alturaTituloExamenes = 4;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaTituloExamenes);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaTituloExamenes);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaTituloExamenes, tablaInicioX + tablaAncho, yPos + alturaTituloExamenes);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("EXAMENES REALIZADOS", tablaInicioX + 2, yPos + 3);
  yPos += alturaTituloExamenes;

  // Lista dinámica de exámenes - todos en una sola fila
  const examenesLista = datosFinales.examenesRealizados || "";

  // Crear texto con todos los exámenes con guiones y en uppercase
  const textoExamenes = examenesLista
    ? examenesLista
    : "- SIN EXÁMENES REGISTRADOS";

  // Calcular altura dinámica para el texto de exámenes
  const calcularAlturaExamenes = (texto, anchoMaximo) => {
    // Altura por defecto de 55mm
    const alturaPorDefecto = 70;

    // Si no hay texto o está vacío, usar altura por defecto
    if (!texto || texto.trim() === "") {
      return alturaPorDefecto;
    }

    // Primero dividir por saltos de línea para contar las líneas base
    const lineasBase = texto.split('\n');
    let totalLineas = 0;

    lineasBase.forEach(linea => {
      if (linea.trim() === '') {
        totalLineas += 1; // Línea vacía
        return;
      }

      const palabras = linea.split(' ');
      let lineaActual = '';
      let lineasEnEstaSeccion = 1;

      palabras.forEach(palabra => {
        const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
        const anchoTexto = doc.getTextWidth(textoPrueba);

        if (anchoTexto <= anchoMaximo) {
          lineaActual = textoPrueba;
        } else {
          if (lineaActual) {
            lineasEnEstaSeccion++;
            lineaActual = palabra;
          } else {
            lineasEnEstaSeccion++;
          }
        }
      });

      totalLineas += lineasEnEstaSeccion;
    });

    // Calcular altura necesaria con interlineado de 3.5mm para fuente 7
    const alturaCalculada = totalLineas * 3.5 + 4; // 3mm arriba + 1mm abajo de margen

    // Usar la altura mayor entre la por defecto (55mm) y la calculada
    return Math.max(alturaCalculada, alturaPorDefecto);
  };

  const anchoMaximoExamenes = tablaAncho - 4; // Ancho total menos márgenes
  const alturaFilaExamenes = calcularAlturaExamenes(textoExamenes, anchoMaximoExamenes);

  // Dibujar líneas de la fila de exámenes (sin divisiones internas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaExamenes); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaExamenes); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaExamenes, tablaInicioX + tablaAncho, yPos + alturaFilaExamenes); // Línea inferior

  // Contenido de la fila de exámenes
  doc.setFont("helvetica", "normal").setFontSize(8);

  // Función específica para dibujar texto con fuente 7 y interlineado correcto
  const dibujarTextoConSaltoLineaFuente7 = (texto, x, y, anchoMaximo) => {
    // Primero dividir por saltos de línea para manejar cada línea numerada por separado
    const lineasBase = texto.split('\n');
    let yPos = y;

    lineasBase.forEach(linea => {
      if (linea.trim() === '') {
        yPos += 2.5; // Espacio para línea vacía
        return;
      }

      const palabras = linea.split(' ');
      let lineaActual = '';

      palabras.forEach(palabra => {
        const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
        const anchoTexto = doc.getTextWidth(textoPrueba);

        if (anchoTexto <= anchoMaximo) {
          lineaActual = textoPrueba;
        } else {
          if (lineaActual) {
            doc.text(lineaActual, x, yPos);
            yPos += 3.5; // Interlineado específico para fuente 7
            lineaActual = palabra;
          } else {
            doc.text(palabra, x, yPos);
            yPos += 3.5;
          }
        }
      });

      if (lineaActual) {
        doc.text(lineaActual, x, yPos);
        yPos += 3.5; // Interlineado después de cada línea
      }
    });

    return yPos;
  };

  dibujarTextoConSaltoLineaFuente7(textoExamenes, tablaInicioX + 5, yPos + 5, anchoMaximoExamenes);

  yPos += alturaFilaExamenes;

  // Fila final: Resultados (header gris)
  yPos = dibujarHeaderSeccion("TERMINANDO COMO RESULTADOS", yPos, filaAltura);

  // Tabla de opciones de aptitud
  const alturaTotalTabla = 15; // 3 filas de 5mm cada una
  const mitadTabla = tablaAncho / 2;

  // Función para dibujar X
  const dibujarX = (x, y) => {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", x, y);
  };

  // Dibujar bordes de la tabla completa
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaTotalTabla); // Línea izquierda
  doc.line(tablaInicioX + mitadTabla, yPos, tablaInicioX + mitadTabla, yPos + alturaTotalTabla); // Línea divisoria vertical
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaTotalTabla); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaTotalTabla, tablaInicioX + tablaAncho, yPos + alturaTotalTabla); // Línea inferior

  // Dibujar líneas horizontales solo en la mitad izquierda
  doc.line(tablaInicioX, yPos + 5, tablaInicioX + mitadTabla, yPos + 5); // Línea después de fila 1
  doc.line(tablaInicioX, yPos + 10, tablaInicioX + mitadTabla, yPos + 10); // Línea después de fila 2

  // Dibujar división vertical para las X (columna de 20mm para las X)
  const columnaX = 10;
  doc.line(tablaInicioX + mitadTabla - columnaX, yPos, tablaInicioX + mitadTabla - columnaX, yPos + alturaTotalTabla);

  // Contenido de las 3 filas
  let yAptitud = yPos + 3.5;

  // Fila 1: APTO
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("APTO (para el puesto en el que trabaja o postula)", tablaInicioX + 2, yAptitud);
  // Marcar X solo si apto es true
  if (data.apto === true) {
    const centroX = tablaInicioX + mitadTabla - (columnaX / 2);
    dibujarX(centroX - 1, yAptitud);
  }
  yAptitud += 5;

  // Fila 2: APTO CON RESTRICCIÓN
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("APTO CON RESTRICCIÓN (para el puesto en el que trabaja", tablaInicioX + 2, yAptitud);
  // Marcar X solo si aptoconrestriccion es true
  if (data.aptoconrestriccion === true) {
    const centroX = tablaInicioX + mitadTabla - (columnaX / 2);
    dibujarX(centroX - 1, yAptitud);
  }
  yAptitud += 5;

  // Fila 3: NO APTO
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NO APTO (para el puesto en el que trabaja o postula)", tablaInicioX + 2, yAptitud);
  // Marcar X solo si noapto es true
  if (data.noapto === true) {
    const centroX = tablaInicioX + mitadTabla - (columnaX / 2);
    dibujarX(centroX - 1, yAptitud);
  }

  // Agregar "Fecha:" en el medio de la columna derecha usando fechaDesde
  const centroColumnaDerecha = tablaInicioX + mitadTabla + (mitadTabla / 2);
  const centroVerticalTabla = yPos + (alturaTotalTabla / 2);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Fecha:", centroColumnaDerecha - 15, centroVerticalTabla - 1);
  doc.setFont("helvetica", "bold").setFontSize(8);
  const fechaDesde = data.fechaDesde ? formatearFechaCorta(data.fechaDesde) : "";
  doc.text(fechaDesde, centroColumnaDerecha + 5, centroVerticalTabla - 1);

  yPos += alturaTotalTabla;

  // === SECCIÓN DE FIRMAS ===
  const yFirmas = yPos; // Sin separación después de la tabla de aptitud
  const alturaSeccionFirmas = 30; // Altura para la sección de firmas

  // Dibujar las líneas de la sección de firmas (2 columnas)
  doc.line(tablaInicioX, yFirmas, tablaInicioX, yFirmas + alturaSeccionFirmas); // Línea izquierda
  doc.line(tablaInicioX + 95, yFirmas, tablaInicioX + 95, yFirmas + alturaSeccionFirmas); // División central
  doc.line(tablaInicioX + tablaAncho, yFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea derecha
  doc.line(tablaInicioX, yFirmas, tablaInicioX + tablaAncho, yFirmas); // Línea superior
  doc.line(tablaInicioX, yFirmas + alturaSeccionFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea inferior

  // === COLUMNA 1: FIRMA Y HUELLA DEL TRABAJADOR ===
  const firmaTrabajadorY = yFirmas + 3;

  // Calcular centro de la columna 1 para centrar las imágenes
  const centroColumna1X = tablaInicioX + (95 / 2); // Centro de la columna 1

  // Agregar firma del trabajador (lado izquierdo)
  let firmaTrabajadorUrl = getSign(datosFinales, "FIRMAP");
  if (firmaTrabajadorUrl) {
    try {
      const imgWidth = 30;
      const imgHeight = 20;
      const x = centroColumna1X - 20;
      const y = firmaTrabajadorY;
      doc.addImage(firmaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del trabajador:", error);
    }
  }

  // Agregar huella del trabajador (lado derecho, vertical)
  let huellaTrabajadorUrl = getSign(datosFinales, "HUELLA");
  if (huellaTrabajadorUrl) {
    try {
      const imgWidth = 12;
      const imgHeight = 20;
      const x = centroColumna1X + 8;
      const y = firmaTrabajadorY;
      doc.addImage(huellaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando huella del trabajador:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Firma y Huella del trabajador", centroColumna1X, yFirmas + 26, { align: "center" });

  // === COLUMNA 2: SELLO Y FIRMA DEL MÉDICO ===
  const firmaMedicoX = tablaInicioX + 127;
  const firmaMedicoY = yFirmas + 3;

  // Agregar firma y sello médico
  let firmaMedicoUrl = getSign(datosFinales, "SELLOFIRMA");
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 45;
      const imgHeight = 20;
      const x = firmaMedicoX;
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(8);
  const centroColumna2 = tablaInicioX + 95 + ((tablaAncho - 95) / 2);
  doc.text("Sello y Firma del Médico", centroColumna2, yFirmas + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumna2, yFirmas + 28.5, { align: "center" });

  // Footer
  footerTR(doc, { footerOffsetY: 8 });

  // Imprimir
  imprimir(doc);

  return null;
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
Aptitud_medico_resumen_Digitalizado.propTypes = {
  data: PropTypes.object
};



