import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { getSign } from "../../utils/helpers.js";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';

export default async function CAMO_Administrativo16_MARSA(data = {}, docExistente = null, numeroPaginaInicial = 1) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  let numeroPagina = numeroPaginaInicial;

  const Recomendaciones2 = data.recomendaciones ? data.recomendaciones.split('\n').filter(rec => rec.trim() !== '') : [];

  const datosFinales = {
    numeroHistoria: String(data.norden ?? ""),
    tipoExamen: String(data.nombreExamen ?? ""),
    apellidosNombres: String((data.apellidosPaciente ?? "") + " " + (data.nombresPaciente ?? "")).trim(),
    documentoIdentidad: String(data.dniPaciente ?? ""),
    genero: data.sexoPaciente === "M" ? "MASCULINO" : data.sexoPaciente === "F" ? "FEMENINO" : String(data.sexoPaciente ?? ""),
    edad: String(`${data.edadPaciente ?? ""} AÑOS`),
    grupoSanguineo: String(data.grupoSanguineo ?? ""),
    empresa: String(data.empresa ?? ""),
    contratista: String(data.contrata ?? ""),
    puestoPostula: String(data.cargoPaciente ?? ""),
    ocupacionActual: String(data.ocupacionPaciente ?? ""),
    fechaExamen: formatearFechaCorta(data.fechaDesde ?? ""),
    color: data.color || 1,
    codigoColor: data.codigoColor || "",
    textoColor: data.textoColor || "",
    numeroFicha: String(data.norden ?? ""),
    sede: data.sede || data.nombreSede || "",
    fechaDesde: formatearFechaCorta(data.fechaDesde ?? ""),
    fechaHasta: formatearFechaCorta(data.fechaHasta ?? ""),
    tipoExamenPreocupacional: data.nombreExamen === "PRE-OCUPACIONAL",
    tipoExamenPeriodico: data.nombreExamen === "ANUAL",
    tipoExamenRetiroCese: data.nombreExamen === "RETIRO",
    tipoExamenReubicacion: data.nombreExamen === "REUBICACION",
    tipoExamenReincorporacion: data.nombreExamen === "REINCORPORACION",
  };

  // === HEADER reutilizable ===
  const drawHeader = async (pageNumber) => {
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.text("INFORME MÉDICO", pageW / 2, 36, { align: "center" });

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 50, 16);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosFinales.sede, pageW - 80, 20);
    doc.text("Fecha de examen: " + (datosFinales.fechaExamen || ""), pageW - 80, 25);

    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 30, 10);

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

  // === Helpers de texto ===
  const calcularAlturaTexto = (texto, anchoMaximo, fontSize = 9) => {
    const filaAltura = 6;
    if (!texto || texto.trim() === '') return filaAltura;

    doc.setFontSize(fontSize);
    const lineHeight = fontSize * 0.5;
    const palabras = texto.split(' ');
    let lineas = 1;
    let lineaActual = '';

    for (let palabra of palabras) {
      const textoPrueba = lineaActual + (lineaActual ? ' ' : '') + palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);

      if (anchoTexto > anchoMaximo) {
        if (lineaActual) {
          lineas++;
          lineaActual = palabra;
        } else {
          lineas++;
          lineaActual = '';
        }
      } else {
        lineaActual = textoPrueba;
      }
    }

    const alturaNecesaria = lineas * lineHeight + 1;
    return Math.max(filaAltura, alturaNecesaria);
  };

  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    if (!texto || texto.trim() === '') return;

    const fontSize = doc.internal.getFontSize();
    const lineHeight = fontSize * 0.5;
    const palabras = texto.split(' ');
    let lineaActual = '';
    let yActual = y;

    for (let palabra of palabras) {
      const textoPrueba = lineaActual + (lineaActual ? ' ' : '') + palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);

      if (anchoTexto > anchoMaximo) {
        if (lineaActual) {
          doc.text(lineaActual, x, yActual);
          yActual += lineHeight;
          lineaActual = palabra;
        } else {
          doc.text(palabra, x, yActual);
          yActual += lineHeight;
          lineaActual = '';
        }
      } else {
        lineaActual = textoPrueba;
      }
    }

    if (lineaActual) {
      doc.text(lineaActual, x, yActual);
    }
  };

  // === FUNCIONES DE PAGINACIÓN DE SECCIONES ===
  const calcularAlturaTextoReal = (doc, texto, maxWidth, fontSize, lineHeight = null) => {
    if (!texto) return 0;
    doc.setFont("helvetica", "normal").setFontSize(fontSize);
    const lh = lineHeight || fontSize * 0.4;

    const parrafos = String(texto).split("\n");
    let totalLineas = 0;

    parrafos.forEach(parrafo => {
      if (parrafo.trim() === "") {
        totalLineas += 1;
      } else {
        const lines = doc.splitTextToSize(parrafo, maxWidth);
        totalLineas += lines.length;
      }
    });

    return totalLineas * lh;
  };

  const dibujarTextoCompleto = (doc, texto, x, y, maxWidth, fontSize, lineHeight = null) => {
    if (!texto) return y;
    doc.setFont("helvetica", "normal").setFontSize(fontSize);
    const lh = lineHeight || fontSize * 0.4;

    let yPos = y;
    const parrafos = String(texto).split("\n");

    parrafos.forEach(parrafo => {
      if (parrafo.trim() === "") {
        yPos += lh;
      } else {
        const lines = doc.splitTextToSize(parrafo, maxWidth);
        lines.forEach(line => {
          doc.text(line, x, yPos);
          yPos += lh;
        });
      }
    });

    return yPos;
  };

  const dibujarSeccionPaginada = async (doc, titulo, texto, x, y, ancho, drawHeaderFn, numeroPaginaRef, altMinima = 18) => {
    const fontSize = 8;
    const lineHeight = 4;
    const contentMaxWidth = ancho - 8;
    const paddingTop = 5;
    const paddingBottom = 3;
    const altHeaderGris = 5;
    const pageHeight = doc.internal.pageSize.getHeight();
    const margenInferior = 25;

    let yPos = y;

    doc.setFillColor(196, 196, 196);
    doc.rect(x, yPos, ancho, altHeaderGris, 'FD');
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, x + 2, yPos + 3.5);
    yPos += altHeaderGris;

    const textoFinal = String(texto ?? "").trim();

    if (!textoFinal) {
      const altura = Math.max(altMinima, lineHeight + paddingTop + paddingBottom);
      doc.rect(x, yPos, ancho, altura);
      yPos += altura;
      return yPos;
    }

    doc.setFont("helvetica", "normal").setFontSize(fontSize);
    const parrafos = textoFinal.split("\n");
    const todasLasLineas = [];
    parrafos.forEach(parrafo => {
      if (parrafo.trim() === "") {
        todasLasLineas.push("");
      } else {
        const lines = doc.splitTextToSize(parrafo, contentMaxWidth);
        lines.forEach(l => todasLasLineas.push(l));
      }
    });

    let lineIndex = 0;
    let primerBloque = true;

    while (lineIndex < todasLasLineas.length) {
      const espacioDisponible = pageHeight - margenInferior - yPos - paddingTop - paddingBottom;
      const maxLineasEnBloque = Math.max(1, Math.floor(espacioDisponible / lineHeight));

      const lineasRestantes = todasLasLineas.length - lineIndex;
      const lineasEnEsteBloque = Math.min(maxLineasEnBloque, lineasRestantes);

      const hayMas = (lineIndex + lineasEnEsteBloque) < todasLasLineas.length;

      const alturaContenido = lineasEnEsteBloque * lineHeight;
      const alturaCuerpo = primerBloque
        ? Math.max(altMinima, alturaContenido + paddingTop + paddingBottom)
        : alturaContenido + paddingTop + paddingBottom;

      doc.rect(x, yPos, ancho, alturaCuerpo);

      doc.setFont("helvetica", "normal").setFontSize(fontSize);
      let yTexto = yPos + paddingTop;
      for (let i = 0; i < lineasEnEsteBloque; i++) {
        doc.text(todasLasLineas[lineIndex + i], x + 4, yTexto);
        yTexto += lineHeight;
      }

      yPos += alturaCuerpo;
      lineIndex += lineasEnEsteBloque;
      primerBloque = false;

      if (hayMas) {
        doc.addPage();
        numeroPaginaRef.value++;
        await drawHeaderFn(numeroPaginaRef.value);
        yPos = 40;

        doc.setFillColor(196, 196, 196);
        doc.rect(x, yPos, ancho, altHeaderGris, 'FD');
        doc.setFont("helvetica", "bold").setFontSize(9);
        doc.text(titulo + " (CONTINUACIÓN)", x + 2, yPos + 3.5);
        yPos += altHeaderGris;
      }
    }

    return yPos;
  };

  // === PÁGINA 2 ===
  if (numeroPagina == 2) {
    doc.addPage();
    numeroPagina++;
  }
  await drawHeader(numeroPagina);

  let yPos2 = 40;
  const x2 = 15;
  const ancho2 = 180;
  const filaDP = 6;
  const altHeaderGris = 5;

  // --- DATOS PERSONALES: encabezado gris ---
  const altDatosHeader = 5;
  doc.setFillColor(196, 196, 196);
  doc.rect(x2, yPos2, ancho2, altDatosHeader, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("I. DATOS PERSONALES", x2 + 2, yPos2 + 3.5);
  yPos2 += altDatosHeader;

  // --- Apellidos y Nombres ---
  doc.rect(x2, yPos2, ancho2, filaDP);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, x2 + 42, yPos2 + 4, 135);
  yPos2 += filaDP;

  // --- DNI | Edad | Sexo ---
  const divCol = x2 + 90;
  doc.rect(x2, yPos2, ancho2, filaDP);
  doc.line(x2 + 45, yPos2, x2 + 45, yPos2 + filaDP);
  doc.line(divCol, yPos2, divCol, yPos2 + filaDP);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad || "", x2 + 14, yPos2 + 4);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", x2 + 47, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.edad ? `${datosFinales.edad}` : "", x2 + 58, yPos2 + 4);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", divCol + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const sexoTexto = data.sexoPaciente === 'F' ? 'FEMENINO' : data.sexoPaciente === 'M' ? 'MASCULINO' : (data.sexoPaciente || "");
  doc.text(sexoTexto, divCol + 16, yPos2 + 4);
  yPos2 += filaDP;

  // --- Lugar de Nacimiento | Estado Civil ---
  doc.rect(x2, yPos2, ancho2, filaDP);
  doc.line(divCol, yPos2, divCol, yPos2 + filaDP);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Lugar de Nacimiento:", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.lugarNacimientoPaciente || "", x2 + 42, yPos2 + 4);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Estado Civil:", divCol + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.estadoCivilPaciente || "", divCol + 26, yPos2 + 4);
  yPos2 += filaDP;

  // --- Tipo Examen | Fecha Nac. ---
  doc.rect(x2, yPos2, ancho2, filaDP);
  doc.line(divCol, yPos2, divCol, yPos2 + filaDP);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Tipo Examen:", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.tipoExamen || "", x2 + 30, yPos2 + 4);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", divCol + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.fechaNacimientoPaciente || "", divCol + 24, yPos2 + 4);
  yPos2 += filaDP;

  // --- Nivel de Estudio | Ocupación ---
  doc.rect(x2, yPos2, ancho2, filaDP);
  doc.line(divCol, yPos2, divCol, yPos2 + filaDP);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Nivel de Estudio:", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.nivelEstudioPaciente || "", x2 + 36, yPos2 + 4);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Ocupación:", divCol + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.ocupacionPaciente || "", divCol + 22, yPos2 + 4);
  yPos2 += filaDP;

  // --- Cargo (fila completa) ---
  doc.rect(x2, yPos2, ancho2, filaDP);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cargo:", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.cargoPaciente || "", x2 + 18, yPos2 + 4);
  yPos2 += filaDP;

  // --- Área (fila completa) ---
  doc.rect(x2, yPos2, ancho2, filaDP);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área:", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.areaPaciente || "", x2 + 14, yPos2 + 4);
  yPos2 += filaDP;

  // --- Empresa (fila completa) ---
  doc.rect(x2, yPos2, ancho2, filaDP);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.empresa || "", x2 + 22, yPos2 + 4);
  yPos2 += filaDP;

  // --- Contrata (fila completa) ---
  doc.rect(x2, yPos2, ancho2, filaDP);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contrata:", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.contrata || "", x2 + 22, yPos2 + 4);
  yPos2 += filaDP;

  yPos2 += 3;

  // --- DATOS DEL PACIENTE ---
  const altDatosPacHeader = 5;
  doc.setFillColor(196, 196, 196);
  doc.rect(x2, yPos2, ancho2, altDatosPacHeader, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("II. DATOS DEL PACIENTE", x2 + 2, yPos2 + 3.5);
  yPos2 += altDatosPacHeader;

  // --- Tipo de Examen: checkboxes ---
  const altCheckboxes = 7;
  doc.rect(x2, yPos2, ancho2, altCheckboxes);

  const checkSize = 3;
  const checkY = yPos2 + (altCheckboxes - checkSize) / 2;

  const tipoExamenOpciones = [
    { label: "Preocupacional", key: "tipoExamenPreocupacional" },
    { label: "Periódico", key: "tipoExamenPeriodico" },
    { label: "Retiro/ Cese", key: "tipoExamenRetiroCese" },
    { label: "Reubicación", key: "tipoExamenReubicacion" },
    { label: "Reincorporacion", key: "tipoExamenReincorporacion" },
  ];

  const espacioTotal = ancho2;
  const espacioPorItem = espacioTotal / tipoExamenOpciones.length;

  tipoExamenOpciones.forEach((opcion, i) => {
    const xItem = x2 + i * espacioPorItem;
    doc.setFont("helvetica", "normal").setFontSize(7);
    const labelWidth = doc.getTextWidth(opcion.label);
    const xLabel = xItem + (espacioPorItem - labelWidth - checkSize - 2) / 2;
    doc.text(opcion.label, xLabel, yPos2 + 4.8);
    const xBox = xLabel + labelWidth + 2;
    doc.rect(xBox, checkY, checkSize, checkSize);
    if (datosFinales[opcion.key]) {
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text("X", xBox + 0.5, checkY + 2.5);
      doc.setFont("helvetica", "normal");
    }
  });
  yPos2 += altCheckboxes;

  // --- Puesto al que postula ---
  doc.rect(x2, yPos2, ancho2, filaDP);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto al que postula:", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.cargoPaciente || "", x2 + 46, yPos2 + 4);
  yPos2 += filaDP;

  // --- Puesto actual ---
  doc.rect(x2, yPos2, ancho2, filaDP);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto actual:", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.cargoPaciente || "", x2 + 32, yPos2 + 4);
  yPos2 += filaDP;

  // --- Antecedentes Personales ---
  const antecedentesPersonales = String(data.antecedentesPersonales ?? "");
  const alturaAntPersonales = Math.max(filaDP * 1.5, calcularAlturaTexto(antecedentesPersonales || " ", 174, 8) + 5);
  doc.rect(x2, yPos2, ancho2, alturaAntPersonales);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Antecedentes Personales", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (antecedentesPersonales) dibujarTextoConSaltoLinea(antecedentesPersonales, x2 + 4, yPos2 + 9, 174);
  yPos2 += alturaAntPersonales;

  // --- Antecedentes Familiares ---
  const antecedentesFamiliares = String(data.antecedentesFamiliares ?? "");
  const alturaAntFamiliares = Math.max(filaDP * 1.5, calcularAlturaTexto(antecedentesFamiliares || " ", 174, 8) + 5);
  doc.rect(x2, yPos2, ancho2, alturaAntFamiliares);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Antecedentes Familiares", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  if (antecedentesFamiliares) dibujarTextoConSaltoLinea(antecedentesFamiliares, x2 + 4, yPos2 + 9, 174);
  yPos2 += alturaAntFamiliares;

  // --- Talla | Peso | Índice de masa corporal ---
  const altTallaPeso = 6;
  doc.rect(x2, yPos2, ancho2, altTallaPeso);
  doc.line(x2 + 60, yPos2, x2 + 60, yPos2 + altTallaPeso);
  doc.line(x2 + 90, yPos2, x2 + 90, yPos2 + altTallaPeso);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Talla:", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.triajeTalla ? `${data.triajeTalla} mts.` : "", x2 + 14, yPos2 + 4);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Peso:", x2 + 62, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.triajePeso ? `${data.triajePeso} Kg.` : "", x2 + 74, yPos2 + 4);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Índice de masa corporal:", x2 + 92, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.triajeImc ? `${data.triajeImc} Kg/mt2` : "", x2 + 148, yPos2 + 4);
  yPos2 += altTallaPeso;

  // --- Temperatura | Cintura/Cadera ---
  const altTemp = 6;
  doc.rect(x2, yPos2, ancho2, altTemp);
  doc.line(x2 + 90, yPos2, x2 + 90, yPos2 + altTemp);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Temperatura:", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.triajeTemperatura ? `${data.triajeTemperatura} °C.` : "", x2 + 30, yPos2 + 4);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cintura/ Cadera:", x2 + 92, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.triajeIcc ? `${data.triajeIcc} cm` : "", x2 + 130, yPos2 + 4);
  yPos2 += altTemp;

  // --- Reacciones Serológicas | Hemoglobina / Hematocrito ---
  const altSerologia = 6;
  doc.rect(x2, yPos2, ancho2, altSerologia);
  doc.line(x2 + 90, yPos2, x2 + 90, yPos2 + altSerologia);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Reacciones Serológicas a lues:", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.prpPositivo ? "POSTIVO" : "NEGATIVO", x2 + 60, yPos2 + 4);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hemoglobina / Hematocrito", x2 + 92, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  const hemoVal = data.hemoglobinaTxthemoglobina ? `${data.hemoglobinaTxthemoglobina} g/dL` : "";
  const hemtoVal = data.hematocritoLabClinicoTxthematocrito ? `${data.hematocritoLabClinicoTxthematocrito} %` : "";
  const separador = (hemoVal || hemtoVal) ? " / " : "";
  doc.text(`${hemoVal}${separador}${hemtoVal}`, x2 + 150, yPos2 + 4);
  yPos2 += altSerologia;

  // --- Grupo Sanguíneo | Factor RH ---
  const altGrupoRH = 6;
  doc.rect(x2, yPos2, ancho2, altGrupoRH);
  doc.line(x2 + 90, yPos2, x2 + 90, yPos2 + altGrupoRH);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Grupo Sanguíneo:", x2 + 2, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.grupoSanguineo || "", x2 + 38, yPos2 + 4);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Factor RH:", x2 + 92, yPos2 + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.factorSanguineo ?? "", x2 + 115, yPos2 + 4);
  yPos2 += altGrupoRH;

  // --- Orina: encabezado ---
  const altOrinaHeader = 5;
  doc.rect(x2, yPos2, ancho2, altOrinaHeader);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Orina:", x2 + 2, yPos2 + 3.5);
  yPos2 += altOrinaHeader;

  // --- Orina: detalle (5 columnas, 4 filas) ---
  const altOrinaDetalle = 22;
  doc.rect(x2, yPos2, ancho2, altOrinaDetalle);
  doc.line(x2 + 36, yPos2, x2 + 36, yPos2 + altOrinaDetalle);
  doc.line(x2 + 72, yPos2, x2 + 72, yPos2 + altOrinaDetalle);
  doc.line(x2 + 108, yPos2, x2 + 108, yPos2 + altOrinaDetalle);
  doc.line(x2 + 144, yPos2, x2 + 144, yPos2 + altOrinaDetalle);

  const filaOrina = 5.5;
  const orinaRows = [
    ["Color :", data.orinaColor ?? "", "Leu :", data.orinaLeucocitosSedimento ?? "", "Densidad :", data.orinaDensidad ?? "", "Bili Ori :", data.orinaBilirrubina ?? "", "Nitritos :", data.orinaNitritos ?? ""],
    ["Aspecto :", data.orinaAspecto ?? "", "Herm :", data.orinaHematies ?? "", "Prot Ori :", data.orinaProteinas ?? "", "Uro Ori :", data.orinaUrobilinogeno ?? "", "", ""],
    ["Cel Epi :", data.orinaCelEpiteliales ?? "", "Cristales :", data.orinaCristales ?? "", "Glu Ori :", data.orinaGlucosa ?? "", "Hem Ori :", data.orinaSangre ?? "", "", ""],
    ["Ger :", data.orinaBacterias ?? "", "PH :", data.orinaPh ?? "", "Cue Ceto :", data.orinaCetonas ?? "", "Est Leu :", data.orinaLeucocitosQuimico ?? "", "", ""],
  ];

  orinaRows.forEach((fila, idx) => {
    const yFila = yPos2 + 1 + idx * filaOrina;
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(fila[0], x2 + 1, yFila + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(String(fila[1]), x2 + 13, yFila + 3.5);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(fila[2], x2 + 37, yFila + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(String(fila[3]), x2 + 50, yFila + 3.5);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(fila[4], x2 + 73, yFila + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(String(fila[5]), x2 + 88, yFila + 3.5);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(fila[6], x2 + 109, yFila + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(String(fila[7]), x2 + 122, yFila + 3.5);
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(fila[8], x2 + 145, yFila + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(String(fila[9]), x2 + 158, yFila + 3.5);
  });
  yPos2 += altOrinaDetalle;

  yPos2 += 3;

  const numeroPaginaRef = { value: numeroPagina };
  const paginaAntesObs = numeroPaginaRef.value;
  // --- Observaciones ---
  yPos2 = await dibujarSeccionPaginada(
    doc,
    "III. OBSERVACIONES",
    "",
    x2, yPos2, ancho2,
    drawHeader,
    numeroPaginaRef,
    50
  );
  const cambioPagina = numeroPaginaRef.value > paginaAntesObs;
  numeroPagina = numeroPaginaRef.value;

  // === FOOTER PÁGINA 2 ===
  let yPos3;

  if (cambioPagina) {
    // Observaciones ya generó una nueva página (página 3) y dejó yPos2 con la posición correcta
    yPos3 = yPos2;
  } else {
    // Observaciones cupo en página 2, footer normal y nueva página para recomendaciones
    footerTR(doc, { footerData: data });

    doc.addPage();
    numeroPagina++;
    await drawHeader(numeroPagina);
    yPos3 = 40;
  }

  // --- Recomendaciones ---
  const recomendacionesPag3 = Recomendaciones2.join('\n');
  const numeroPaginaRef3 = { value: numeroPagina };

  yPos3 = await dibujarSeccionPaginada(doc, "IV. RECOMENDACIONES", recomendacionesPag3, x2, yPos3, ancho2, drawHeader, numeroPaginaRef3);
  numeroPagina = numeroPaginaRef3.value;

  yPos3 += 3;

  // --- Restricciones ---
  const numeroPaginaRef4 = { value: numeroPagina };

  yPos3 = await dibujarSeccionPaginada(doc, "V. RESTRICCIONES", "", x2, yPos3, ancho2, drawHeader, numeroPaginaRef4);
  numeroPagina = numeroPaginaRef4.value;
  yPos3 += 3;

  // --- Otros examenes ---
  const numeroPaginaRef5 = { value: numeroPagina };
  yPos3 = await dibujarSeccionPaginada(doc, "VI. OTROS EXÁMENES", "", x2, yPos3, ancho2, drawHeader, numeroPaginaRef5);
  numeroPagina = numeroPaginaRef5.value;
  yPos3 += 3;

  // --- Apto para trabajar ---
  const altApto = filaDP;
  doc.setFillColor(196, 196, 196);
  doc.rect(x2, yPos3, ancho2, altHeaderGris, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("VII. APTO PARA TRABAJAR", x2 + 2, yPos3 + 3.5);
  yPos3 += altHeaderGris;

  doc.rect(x2, yPos3, ancho2, altApto);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(data.apto ? "APTO" : data.aptoConRestriccion ? "APTO CON RESTRICCION" : data.noApto ? "NO APTO" : "", x2 + 2, yPos3 + 4);
  yPos3 += altApto;

  yPos3 += 3;

  // --- Bloque FIRMAS ---
  doc.setFillColor(196, 196, 196);
  doc.rect(x2, yPos3, ancho2, altHeaderGris, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("VIII. FIRMAS", x2 + 2, yPos3 + 3.5);
  yPos3 += altHeaderGris;

  const altFirma = 45;
  doc.rect(x2, yPos3, ancho2, altFirma);
  const firmaLineaY = yPos3 + 30;
  const firmaLineaX1 = x2 + (ancho2 / 2) - 25;
  const firmaLineaX2 = x2 + (ancho2 / 2) + 25;

  // Colocar firma SOBRE la línea (antes de dibujar la línea para que no la tape)
  const firmaUrl = getSign(data, "SELLOFIRMA");
  if (firmaUrl && firmaUrl !== "Sin registro") {
    try {
      const imgW = 40;
      const imgH = 16;
      const imgX = x2 + (ancho2 / 2) - (imgW / 2);
      const imgY = firmaLineaY - imgH - 1;

      doc.addImage(firmaUrl, "PNG", imgX, imgY, imgW, imgH);
    } catch (e) {
      console.error("Error adding signature image", e);
    }
  }

  // Dibujar la línea (encima de la firma si se solapa, queda mejor)
  doc.line(firmaLineaX1, firmaLineaY, firmaLineaX2, firmaLineaY);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Firma del Médico", x2 + ancho2 / 2, firmaLineaY + 10, { align: "center" });
  yPos3 += altFirma;

  // === FOOTER PÁGINA 3 ===
  footerTR(doc, { footerData: data });

  // === Imprimir si se generó de forma standalone ===
  if (docExistente) {
    return doc;
  } else {
    imprimir(doc);
    return doc;
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

function footerTR(doc, datos) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginBottom = 15;
  const offsetY = Number((datos && typeof datos === 'object' ? datos.footerOffsetY : 0) ?? 0);
  const baseY = pageHeight - marginBottom + offsetY;

  const contenidoAncho = 180;
  const inicioX = (pageWidth - contenidoAncho) / 2;

  const lineY = baseY - 3.6;
  doc.setDrawColor(52, 2, 153);
  doc.setLineWidth(0.5);
  doc.line(inicioX, lineY, inicioX + contenidoAncho, lineY);

  const defaultFooter = {
    dir_tru_pierola: "- Sede Trujillo: Av. Nicolas de Piérola N°1106 Urb. San Fernando",
    dir_huamachuco: "- Sede Huamachuco: Jr. Leoncio Prado N°786",
    dir_huancayo: "- Sede Huancayo: Av. Huancavelica N°2225 - Distrito El Tambo",
    dir_trujillo: "Cl.Guillermo Prescott N°127 Urb. Sto. Dominguito",
    cel_trujillo_pie: "964385075",
    cel_huamachuco: "990094744-969603777",
    email_tru_pierola: "admision@horizontemedic.com",
    email_huancayo: "admision.huancayo@horizontemedic.com",
    telf_tru_pierola: "044-666120",
    telf_huamachuco: "044-348070",
    telf_huancayo: "064-659554"
  };
  const datosFooter = {
    ...defaultFooter,
    ...(datos && typeof datos === 'object' && datos.footerData ? datos.footerData : {})
  };

  const fontSize = (datos && typeof datos === 'object' && datos.fontSize) ? datos.fontSize : 7;
  doc.setFont("helvetica", "normal").setFontSize(fontSize);
  doc.setTextColor(0, 0, 0);

  const lineas = [
    `${datosFooter?.dir_tru_pierola || ""} Cel. ${datosFooter?.cel_trujillo_pie || ""} ${datosFooter?.email_tru_pierola || ""} Telf. ${datosFooter?.telf_tru_pierola || ""}`,
    `${datosFooter?.dir_huamachuco || ""} Cel. ${datosFooter?.cel_huamachuco || ""} ${datosFooter?.email_huancayo || ""} Telf. ${datosFooter?.telf_huamachuco || ""}`,
    `${datosFooter?.dir_huancayo || ""} Telf. ${datosFooter?.telf_huancayo || ""}`,
    `${datosFooter?.dir_trujillo || ""} Telf. 044-767608`
  ];

  let yPos = baseY;
  lineas.forEach((linea) => {
    if (linea.trim()) {
      doc.text(linea, pageWidth / 2, yPos, { align: "center" });
      yPos += 3;
    }
  });
}
