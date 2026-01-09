import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import { convertirGenero, getSign } from "../../../utils/helpers.js";
import drawColorBox from '../../components/ColorBox.jsx';
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';

export default async function ResumenAnexo7CP_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const formatearPresionArterial = (sistolica, diastolica) => {
    const s = sistolica ?? "";
    const d = diastolica ?? "";
    if (!s && !d) return "";
    if (!s) return String(d);
    if (!d) return String(s);
    return `${s}/${d}`;
  };

  const datosReales = {
    apellidosNombres: String(`${data.apellidosPaciente ?? ""} ${data.nombresPaciente ?? ""}`).trim(),
    fechaExamen: formatearFechaCorta(data.fechaFichaAnexo16_fecha ?? ""),
    tipoExamen: String(data.nombreExamen ?? ""),
    sexo: convertirGenero(data.sexoPaciente) || "",
    documentoIdentidad: String(data.dniPaciente ?? ""),
    edad: String(data.edadPaciente ?? ""),
    areaTrabajo: String(data.areaPaciente ?? ""),
    puestoTrabajo: String(data.cargoPaciente ?? ""),
    empresa: String(data.empresa ?? ""),
    contrata: String(data.contrata ?? ""),
    // Datos de color
    color: Number(data.color ?? 0),
    codigoColor: String(data.codigoColor ?? ""),
    textoColor: String(data.textoColor ?? ""),
    // Datos adicionales para header
    numeroFicha: String(data.norden ?? ""),
    sede: String(data.sede ?? data.nombreSede ?? ""),
    // Datos específicos
    direccionPaciente: String(data.direccionPaciente ?? ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente ?? ""),
    // Datos de digitalización
    digitalizacion: Array.isArray(data.digitalizacion) ? data.digitalizacion : [],
    // Signos vitales
    vitalSigns: {
      fc: String(data.frecuenciaCardiacaTriaje_f_cardiaca ?? ""),
      fr: String(data.frecuenciaRespiratoriaTriaje_f_respiratoria ?? ""),
      pa: formatearPresionArterial(data.sistolicatriaje_sistolica, data.diastolicatriaje_diastolica),
      satO2: String(data.saturacionoxigenotriaje_sat_02 ?? ""),
      imc: String(data.imctriaje_imc ?? ""),
      peso: String(data.pesotriaje_peso ?? ""),
      talla: String(data.tallatriaje_talla ?? "")
    },
    // Datos médicos específicos
    antecedentesFamiliares: String(data.antecedentesFamiliaresAnexo7c_txtantecedentesfamiliares ?? ""),
    antecedentesPatologicos: String(data.antecedentesPatologicos_ante_patologicos ?? ""),
    antecedentesPersonales: String(data.antecedentesPersonales2Anexo7c_txtantecedentespersonales2 ?? ""),
    aptitud: String(data.aptitud ?? ""),
    fechaVencimiento: formatearFechaCorta(data.fechaHastaFichaAnexo16_fecha_hasta ?? ""),
    // Evaluaciones médicas
    evaluaciones: {
      oftalmologica: String(data.enfermedadesocularesoftalmo_e_oculares ?? ""),
      auditiva: String(data.diagnosticoAudiometria_diagnostico ?? ""),
      radiografia: String(data.conclusionesRadiograficas ?? ""),
      espirometria: String(data.conclusionAnexo7c_txtconclusion || data.txtconclusion || "N/A"),
      electrocardiograma: String(data.hallazgosInformeElectroCardiograma_hallazgo ?? ""),
      dental: String(data.observacionesOdontograma_txtobservaciones ?? ""),
      psicologico: data.aptoEvaluacionPsicoPoderosa_rbapto ? "CUMPLE CON EL PERFIL DEL PUESTO" : String(data.observacionPsicologica ?? ""),
      trabajosAltura: String(data.observacionTrabajosAltura_obsvaltura ?? ""),
      trabajosCaliente: String(data.observacionAptitudCaliente_obsvtencaliente ?? ""),
      conduccion: String(data.observacionAptitudConducir_obsvlicencia ?? "")
    },
    // Laboratorio
    laboratorio: {
      grupoSanguineo: String(data.grupoFactorSanguineo_grupofactor ?? ""),
      hemoglobina: String(data.hemoglobinaLaboratorioClinico_txthemoglobina ?? ""),
      hematies: String(data.hematiesematologiaLabClinico_txthematiesematologia ?? ""),
      glucosa: String(data.glucosaLaboratorioClinico_txtglucosabio ?? ""),
      cocaina: String(data.cocainaLaboratorioClinico_txtcocaina ?? ""),
      marihuana: String(data.marihuanaLaboratorioClinico_txtmarihuana ?? ""),
      examenOrina: "NORMAL",
      vdrl: data.positivoLaboratorioClinico_chkpositivo === true
        ? "REACTIVO"
        : data.positivoLaboratorioClinico_chkpositivo === false
          ? "NO REACTIVO"
          : "",
      vsg: String(data.vsgLaboratorioClinico_txtvsg ?? ""),
      colesterol: String(data.colesterolAnalisisBioquimico_txtcolesterol ?? ""),
      trigliceridos: String(data.trigliseridosAnalisisBioquimico_txttrigliseridos ?? "")
    },
    // Conclusiones y recomendaciones
    conclusion: String(data.conclusionAnexo7c_txtconclusion ?? ""),
    recomendaciones: String(data.recomendacionesAnalisisBioquimico_txtrecomendaciones ?? ""),
    restricciones: String(data.restriccionesAnalisisBioquimico_atxtrestricciones ?? ""),
    observaciones: String(data.observacionesFichaMedicaAnexo7c_txtobservacionesfm ?? ""),
    observacionesFichaMedicaAnexo7c_txtobservacionesfm: String(data.observacionesFichaMedicaAnexo7c_txtobservacionesfm ?? "")
  };

  const datosFinales = datosReales;

  // Header reutilizable
  const drawHeader = async (pageNumber) => {
    // Logo y membrete
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("RESUMEN MÉDICO PODEROSA", pageW / 2, 30, { align: "center" });
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
      // Si la palabra sola es más larga que el ancho máximo, dividirla por caracteres
      const anchoPalabra = doc.getTextWidth(palabra);
      if (anchoPalabra > anchoMaximo) {
        // Si hay una línea actual, dibujarla primero
        if (lineaActual) {
          doc.text(lineaActual, x, yPos);
          yPos += fontSize * 0.35;
          lineaActual = '';
        }
        // Dividir la palabra larga por caracteres
        let palabraActual = '';
        for (let i = 0; i < palabra.length; i++) {
          const char = palabra[i];
          const textoPrueba = palabraActual + char;
          const anchoTexto = doc.getTextWidth(textoPrueba);

          if (anchoTexto <= anchoMaximo) {
            palabraActual = textoPrueba;
          } else {
            if (palabraActual) {
              doc.text(palabraActual, x, yPos);
              yPos += fontSize * 0.35;
            }
            palabraActual = char;
          }
        }
        if (palabraActual) {
          lineaActual = palabraActual;
        }
      } else {
        // Palabra normal
        const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
        const anchoTexto = doc.getTextWidth(textoPrueba);

        if (anchoTexto <= anchoMaximo) {
          lineaActual = textoPrueba;
        } else {
          if (lineaActual) {
            doc.text(lineaActual, x, yPos);
            yPos += fontSize * 0.35;
            lineaActual = palabra;
          } else {
            doc.text(palabra, x, yPos);
            yPos += fontSize * 0.35;
          }
        }
      }
    });

    if (lineaActual) {
      doc.text(lineaActual, x, yPos);
      // Siempre agregar espacio después de dibujar texto
      yPos += fontSize * 0.35;
    }

    return yPos;
  };

  // Función para procesar texto con saltos de línea numerados
  const procesarTextoConSaltosLinea = (texto) => {
    if (!texto) return [];

    // Dividir por saltos de línea reales (\n, \r\n) y otros separadores
    const partes = texto.split(/\r\n|\r|\n|\\n|\/n/g);

    // Procesar cada parte y mantener el formato original
    return partes
      .map(parte => parte.trim())
      .filter(parte => parte.length > 0);
  };

  // Función mejorada para manejar textos con saltos de línea numerados
  const dibujarTextoConSaltosLinea = (texto, x, y, anchoMaximo) => {
    // Validar que el texto no sea undefined, null o vacío
    if (!texto || texto === null || texto === undefined) {
      return y;
    }

    const fontSize = doc.internal.getFontSize();
    let yPos = y;

    // Procesar el texto manteniendo el formato original
    const lineasProcesadas = procesarTextoConSaltosLinea(texto);

    lineasProcesadas.forEach((linea, index) => {
      // Verificar si es una línea numerada (empieza con número seguido de punto)
      const anchoLinea = doc.getTextWidth(linea);
      const esLineaNumerada = /^\d+\./.test(linea);

      // Usar un margen de seguridad (95% del ancho máximo) para asegurar que el texto no se salga
      const anchoMaximoConMargen = anchoMaximo * 0.95;

      // Si la línea es muy larga o está cerca del límite, usar la función de salto de línea por palabras
      if (anchoLinea > anchoMaximoConMargen) {
        const yPosAntes = yPos;
        yPos = dibujarTextoConSaltoLinea(linea, x, yPos, anchoMaximoConMargen);

        // Si la función no agregó espacio al final, agregarlo
        if (yPos === yPosAntes) {
          yPos += fontSize * 0.35;
        }

        // Espacio moderado después de una línea numerada que hizo salto
        if (esLineaNumerada) {
          yPos += fontSize * 0.25; // Espacio moderado después de línea numerada con salto
        }

        // Si hay una siguiente línea numerada, agregar espacio adicional moderado
        if (index < lineasProcesadas.length - 1) {
          const siguienteLinea = lineasProcesadas[index + 1];
          if (/^\d+\./.test(siguienteLinea)) {
            yPos += fontSize * 0.2; // Espacio moderado antes de la siguiente línea numerada
          }
        }
      } else {
        // Si la línea cabe, dibujarla directamente
        doc.text(linea, x, yPos);

        // Espaciado equilibrado para líneas numeradas
        if (esLineaNumerada) {
          yPos += fontSize * 0.4; // Espacio equilibrado para líneas numeradas
        } else {
          yPos += fontSize * 0.35; // Espacio normal
        }
      }

      // Espacio adicional entre líneas numeradas consecutivas (solo si no hizo salto)
      if (index < lineasProcesadas.length - 1 && anchoLinea <= anchoMaximoConMargen) {
        const siguienteLinea = lineasProcesadas[index + 1];
        if (esLineaNumerada && /^\d+\./.test(siguienteLinea)) {
          yPos += fontSize * 0.15; // Espacio moderado entre líneas numeradas
        }
      }
    });

    return yPos;
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
  let yPos = 35; // Subido 5mm (era 40, ahora 35)
  const filaAltura = 5;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres (fila completa) 
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Tercera fila: Domicilio (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Cuarta fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Cuarta fila: Empresa (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Contrata (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 35 + 2; // Ajustar para el header (subido 5mm)

  // Primera fila: Apellidos y Nombres
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres || "", tablaInicioX + 40, yTexto + 1.5, tablaAncho - 40);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad || "", tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.edad || "") + " Años", tablaInicioX + 58, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.sexo || "", tablaInicioX + 105, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento || "", tablaInicioX + 155, yTexto + 1.5);
  yTexto += filaAltura;

  // Tercera fila: Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.direccionPaciente || "", tablaInicioX + 25, yTexto + 1.5, 160);
  yTexto += filaAltura;

  // Cuarta fila: Puesto de Trabajo, Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.puestoTrabajo || "", tablaInicioX + 30, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.areaTrabajo || "", tablaInicioX + 118, yTexto + 1.5);
  yTexto += filaAltura;

  // Quinta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa || "", tablaInicioX + 24, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Sexta fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contrata || "", tablaInicioX + 24, yTexto + 1.5);
  yTexto += filaAltura;

  // Séptima fila: Carta (fila completa con altura mayor)
  const alturaFilaCarta = 10; // Altura mayor para el texto de la carta
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaCarta);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaCarta);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaCarta, tablaInicioX + tablaAncho, yPos + alturaFilaCarta);
  yPos += alturaFilaCarta;

  // Contenido de la carta con formato específico
  doc.setFont("helvetica", "normal").setFontSize(8);

  // Primera línea
  doc.text("Estimados Señores de: ", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(`${datosFinales.empresa || ""}`, tablaInicioX + 2 + doc.getTextWidth("Estimados Señores de: "), yTexto + 2);

  // Segunda línea - usando todo el ancho disponible
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Enviamos el informe: ", tablaInicioX + 2, yTexto + 5.5);

  // Calcular posición del nombre en negrita
  const posicionNombre = tablaInicioX + 2 + doc.getTextWidth("Enviamos el informe: ");
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(`${datosFinales.apellidosNombres || ""}`, posicionNombre, yTexto + 5.5);

  // Calcular posición del texto final usando el ancho del nombre en negrita
  const anchoNombreNegrita = doc.getTextWidth(`${datosFinales.apellidosNombres || ""}`);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(" , en condiciones médicas que se detallan a continuación:", posicionNombre + anchoNombreNegrita, yTexto + 5.5);
  yTexto += alturaFilaCarta;

  // === SECCIÓN 2: SIGNOS VITALES ===
  // Header de signos vitales
  yPos = dibujarHeaderSeccion("2. SIGNOS VITALES", yPos, filaAltura);

  // Una sola fila con 7 columnas - Divisiones en milímetros para fácil ajuste
  const col1 = 24;  // FC
  const col2 = 47;  // FR  
  const col3 = 76;  // PA
  const col4 = 100; // Sat. O2
  const col5 = 135; // IMC
  const col6 = 165; // Peso
  // col7 = hasta el final (Talla)

  // Dibujar líneas de la fila única
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + col1, yPos, tablaInicioX + col1, yPos + filaAltura); // División 1
  doc.line(tablaInicioX + col2, yPos, tablaInicioX + col2, yPos + filaAltura); // División 2
  doc.line(tablaInicioX + col3, yPos, tablaInicioX + col3, yPos + filaAltura); // División 3
  doc.line(tablaInicioX + col4, yPos, tablaInicioX + col4, yPos + filaAltura); // División 4
  doc.line(tablaInicioX + col5, yPos, tablaInicioX + col5, yPos + filaAltura); // División 5
  doc.line(tablaInicioX + col6, yPos, tablaInicioX + col6, yPos + filaAltura); // División 6
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior

  // === CONTENIDO DE SIGNOS VITALES ===
  // FC (Frecuencia Cardíaca)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FC:", tablaInicioX + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.vitalSigns.fc || "") + " x min", tablaInicioX + 8, yPos + 3);

  // FR (Frecuencia Respiratoria)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FR:", tablaInicioX + col1 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.vitalSigns.fr || "") + " x min", tablaInicioX + col1 + 8, yPos + 3);

  // PA (Presión Arterial)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("PA:", tablaInicioX + col2 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.vitalSigns.pa || "") + " mmHg", tablaInicioX + col2 + 8, yPos + 3);

  // Sat. O2 (Saturación de Oxígeno)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sat. O2:", tablaInicioX + col3 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.vitalSigns.satO2 || "") + " %", tablaInicioX + col3 + 15, yPos + 3);

  // IMC (Índice de Masa Corporal)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("IMC:", tablaInicioX + col4 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.vitalSigns.imc || "") + " kg/m2", tablaInicioX + col4 + 10, yPos + 3);

  // Peso
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Peso:", tablaInicioX + col5 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.vitalSigns.peso || "") + " kg", tablaInicioX + col5 + 10, yPos + 3);

  // Talla
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Talla:", tablaInicioX + col6 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.vitalSigns.talla || "") + " cm", tablaInicioX + col6 + 10, yPos + 3);

  yPos += filaAltura;

  // === SECCIÓN 3: EVALUACIONES MÉDICAS ===
  // Header de evaluaciones médicas
  yPos = dibujarHeaderSeccion("3. EVALUACIONES MÉDICAS", yPos, filaAltura);

  // Función para dibujar fila dinámica
  const dibujarFilaDinamica = (label, valor, yInicio) => {
    doc.setFont("helvetica", "normal").setFontSize(8);
    const anchoDisponible = tablaAncho - 54; // Ancho para el valor
    const texto = valor || "";

    // Calcular altura necesaria
    let alturaFila = filaAltura;
    if (texto && doc.getTextWidth(texto) > anchoDisponible) {
      const lineas = doc.splitTextToSize(texto, anchoDisponible);
      alturaFila = Math.max(filaAltura, lineas.length * 3.5 + 2);
    }

    // Dibujar bordes
    doc.line(tablaInicioX, yInicio, tablaInicioX, yInicio + alturaFila);
    doc.line(tablaInicioX + tablaAncho, yInicio, tablaInicioX + tablaAncho, yInicio + alturaFila);
    doc.line(tablaInicioX, yInicio, tablaInicioX + tablaAncho, yInicio);
    doc.line(tablaInicioX, yInicio + alturaFila, tablaInicioX + tablaAncho, yInicio + alturaFila);

    // Dibujar contenido
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(label, tablaInicioX + 2, yInicio + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(8);

    if (texto && doc.getTextWidth(texto) > anchoDisponible) {
      const lineas = doc.splitTextToSize(texto, anchoDisponible);
      lineas.forEach((linea, idx) => {
        doc.text(linea, tablaInicioX + 52, yInicio + 3.5 + (idx * 3.5));
      });
    } else {
      doc.text(texto, tablaInicioX + 52, yInicio + 3.5);
    }

    return yInicio + alturaFila;
  };

  // Dibujar todas las filas dinámicamente
  yPos = dibujarFilaDinamica("EVALUACIÓN OFTALMOLÓGICA:", datosFinales.evaluaciones.oftalmologica, yPos);
  yPos = dibujarFilaDinamica("EXAMEN AUDITIVA:", datosFinales.evaluaciones.auditiva, yPos);
  yPos = dibujarFilaDinamica("RADIOGRAFÍA DE TÓRAX:", datosFinales.evaluaciones.radiografia, yPos);
  yPos = dibujarFilaDinamica("ESPIROMETRÍA:", datosFinales.evaluaciones.espirometria, yPos);
  yPos = dibujarFilaDinamica("ELECTROCARDIOGRAMA:", datosFinales.evaluaciones.electrocardiograma, yPos);
  yPos = dibujarFilaDinamica("EVALUACIÓN DENTAL:", datosFinales.evaluaciones.dental, yPos);
  yPos = dibujarFilaDinamica("TEST PSICOLÓGICO:", datosFinales.evaluaciones.psicologico, yPos);
  yPos = dibujarFilaDinamica("ANTECEDENTES DE IMPORTANCIA:", datosFinales.antecedentesPersonales, yPos);
  yPos = dibujarFilaDinamica("TRABAJOS EN ALTURA:", datosFinales.evaluaciones.trabajosAltura, yPos);
  yPos = dibujarFilaDinamica("TRABAJOS EN CALIENTE:", datosFinales.evaluaciones.trabajosCaliente, yPos);
  yPos = dibujarFilaDinamica("FICHA DE CONDUCCIÓN:", datosFinales.evaluaciones.conduccion, yPos);

  // === SECCIÓN 4: EXAMENES DE LABORATORIO ===
  // Header de exámenes de laboratorio
  yPos = dibujarHeaderSeccion("4. EXAMENES DE LABORATORIO", yPos, filaAltura);

  // Fila 1: Grupo sanguíneo y Hemoglobina
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 2: Hematíes y Glucosa
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 3: Drogas en Orina y Examen de Orina
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 4: VDRL y VSG
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE EXAMENES DE LABORATORIO ===
  let yTextoLab = yPos - (4 * filaAltura) + 2; // Posición inicial para el texto

  // Fila 1: Grupo sanguíneo y Hemoglobina
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Grupo sanguíneo:", tablaInicioX + 2, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.laboratorio.grupoSanguineo || "N/A", tablaInicioX + 30, yTextoLab + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hemoglobina:", tablaInicioX + 102, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.laboratorio.hemoglobina || "") + " gr %", tablaInicioX + 150, yTextoLab + 1.5);
  yTextoLab += filaAltura;

  // Fila 2: Hematíes y Glucosa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hematíes:", tablaInicioX + 2, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.laboratorio.hematies || "") + " x mm³", tablaInicioX + 30, yTextoLab + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Glucosa:", tablaInicioX + 102, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.laboratorio.glucosa || "") + " mg/dl", tablaInicioX + 150, yTextoLab + 1.5);
  yTextoLab += filaAltura;

  // Fila 3: Drogas en Orina y Examen de Orina
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Drogas en Orina:", tablaInicioX + 2, yTextoLab + 1.5);

  // Dibujar "Cocaina" en negrita
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Cocaina :   ", tablaInicioX + 30, yTextoLab + 1.5);

  // Dibujar valor de cocaína en normal
  doc.setFont("helvetica", "normal").setFontSize(8);
  const cocainaValue = datosFinales.laboratorio.cocaina || "N/A";
  doc.text(cocainaValue, tablaInicioX + 30 + doc.getTextWidth("Cocaina :   "), yTextoLab + 1.5);

  // Dibujar "Marihuana" en negrita
  doc.setFont("helvetica", "bold").setFontSize(8);
  const posicionMarihuana = tablaInicioX + 30 + doc.getTextWidth("Cocaina :   ") + doc.getTextWidth(cocainaValue) + 5;
  doc.text("Marihuana :   ", posicionMarihuana, yTextoLab + 1.5);

  // Dibujar valor de marihuana en normal
  doc.setFont("helvetica", "normal").setFontSize(8);
  const marihuanaValue = datosFinales.laboratorio.marihuana || "N/A";
  doc.text(marihuanaValue, posicionMarihuana + doc.getTextWidth("Marihuana :   "), yTextoLab + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Examen de Orina:", tablaInicioX + 102, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.laboratorio.examenOrina || "", tablaInicioX + 150, yTextoLab + 1.5);
  yTextoLab += filaAltura;

  // Fila 4: VDRL y VSG
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("VDRL:", tablaInicioX + 2, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.laboratorio.vdrl || "N/A", tablaInicioX + 30, yTextoLab + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("VSG:", tablaInicioX + 102, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.laboratorio.vsg || "") + " mm", tablaInicioX + 150, yTextoLab + 1.5);

  // === SECCIÓN 5: CONCLUSION Y RECOMENDACIONES ===
  // Header gris: CONCLUSION Y RECOMENDACIONES
  yPos = dibujarHeaderSeccion("5. CONCLUSION Y RECOMENDACIONES", yPos, filaAltura);

  // === CONTENIDO DE CONCLUSION Y RECOMENDACIONES ===
  // Guardar la posición inicial del header para dibujar los bordes después
  const yPosInicioConclusion = yPos;

  doc.setFont("helvetica", "normal").setFontSize(7);
  const textoConclusion = datosFinales.observacionesFichaMedicaAnexo7c_txtobservacionesfm || "";

  // Configuración de padding
  const alturaMinima = 15; // Altura mínima de la fila
  const paddingSuperior = 4; // Padding superior 
  const paddingInferior = 2; // Padding inferior
  const paddingLateral = 2; // Padding lateral
  const yTextoInicio = yPos + paddingSuperior;
  const xTextoInicio = tablaInicioX + paddingLateral;
  // Calcular ancho máximo disponible: ancho de tabla menos padding lateral izquierdo y derecho
  const anchoMaximoDisponible = tablaAncho - (paddingLateral * 2);

  // Dibujar el texto primero para obtener la posición final real
  const yPosFinalTexto = dibujarTextoConSaltosLinea(textoConclusion, xTextoInicio, yTextoInicio, anchoMaximoDisponible);

  // Calcular la altura final de la fila basándose en la posición real del texto
  const alturaTextoUsada = yPosFinalTexto - yTextoInicio;
  const alturaFilaFinal = Math.max(alturaMinima, alturaTextoUsada + paddingSuperior + paddingInferior);

  // Dibujar los bordes de la fila basándose en la altura real calculada
  doc.line(tablaInicioX, yPosInicioConclusion, tablaInicioX, yPosInicioConclusion + alturaFilaFinal);
  doc.line(tablaInicioX + tablaAncho, yPosInicioConclusion, tablaInicioX + tablaAncho, yPosInicioConclusion + alturaFilaFinal);
  doc.line(tablaInicioX, yPosInicioConclusion, tablaInicioX + tablaAncho, yPosInicioConclusion);
  doc.line(tablaInicioX, yPosInicioConclusion + alturaFilaFinal, tablaInicioX + tablaAncho, yPosInicioConclusion + alturaFilaFinal);

  yPos = yPosInicioConclusion + alturaFilaFinal;

  // === SECCIÓN 6: RESTRICCIONES ===
  // Header gris: RESTRICCIONES
  yPos = dibujarHeaderSeccion("6. RESTRICCIONES", yPos, filaAltura);

  // === CONTENIDO DE RESTRICCIONES ===
  // Guardar la posición inicial del header para dibujar los bordes después
  const yPosInicioRestricciones = yPos;

  doc.setFont("helvetica", "normal").setFontSize(7);
  const textoRestricciones = datosFinales.restricciones || "";

  // Configuración de padding
  const alturaMinimaRestricciones = 15; // Altura mínima de la fila
  const paddingSuperiorRestricciones = 4; // Padding superior 
  const paddingInferiorRestricciones = 2; // Padding inferior
  const paddingLateralRestricciones = 2; // Padding lateral
  const yTextoInicioRestricciones = yPos + paddingSuperiorRestricciones;
  const xTextoInicioRestricciones = tablaInicioX + paddingLateralRestricciones;
  // Calcular ancho máximo disponible: ancho de tabla menos padding lateral izquierdo y derecho
  const anchoMaximoDisponibleRestricciones = tablaAncho - (paddingLateralRestricciones * 2);

  // Dibujar el texto primero para obtener la posición final real
  const yPosFinalTextoRestricciones = dibujarTextoConSaltosLinea(textoRestricciones, xTextoInicioRestricciones, yTextoInicioRestricciones, anchoMaximoDisponibleRestricciones);

  // Calcular la altura final de la fila basándose en la posición real del texto
  const alturaTextoRestriccionesUsada = yPosFinalTextoRestricciones - yTextoInicioRestricciones;
  const alturaFilaRestriccionesFinal = Math.max(alturaMinimaRestricciones, alturaTextoRestriccionesUsada + paddingSuperiorRestricciones + paddingInferiorRestricciones);

  // Dibujar los bordes de la fila basándose en la altura real calculada
  doc.line(tablaInicioX, yPosInicioRestricciones, tablaInicioX, yPosInicioRestricciones + alturaFilaRestriccionesFinal);
  doc.line(tablaInicioX + tablaAncho, yPosInicioRestricciones, tablaInicioX + tablaAncho, yPosInicioRestricciones + alturaFilaRestriccionesFinal);
  doc.line(tablaInicioX, yPosInicioRestricciones, tablaInicioX + tablaAncho, yPosInicioRestricciones);
  doc.line(tablaInicioX, yPosInicioRestricciones + alturaFilaRestriccionesFinal, tablaInicioX + tablaAncho, yPosInicioRestricciones + alturaFilaRestriccionesFinal);

  yPos = yPosInicioRestricciones + alturaFilaRestriccionesFinal;

  // === SECCIÓN 7: APTITUD LABORAL ===
  // Fila: APTITUD LABORAL y FECHA DE VENCIMIENTO (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE APTITUD LABORAL ===
  // Posición del texto centrado dentro de la fila
  let yTextoAptitud = yPos - filaAltura + 3.5; // Centrado verticalmente en la fila

  // Primera columna: APTITUD LABORAL
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("APTITUD LABORAL:", tablaInicioX + 2, yTextoAptitud);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.aptitud || "", tablaInicioX + 35, yTextoAptitud);

  // Segunda columna: FECHA DE VENCIMIENTO
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FECHA DE VENCIMIENTO:", tablaInicioX + 102, yTextoAptitud);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaVencimiento || "", tablaInicioX + 155, yTextoAptitud);

  // === SECCIÓN DE FIRMAS ===
  const yFirmas = yPos; // Sin separación después de la fila de aptitud
  const alturaSeccionFirmas = 30; // Altura para la sección de firmas

  // Dibujar las líneas de la sección de firmas (1 columna completa)
  doc.line(tablaInicioX, yFirmas, tablaInicioX, yFirmas + alturaSeccionFirmas); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea derecha
  doc.line(tablaInicioX, yFirmas, tablaInicioX + tablaAncho, yFirmas); // Línea superior
  doc.line(tablaInicioX, yFirmas + alturaSeccionFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirmas); // Línea inferior

  // === FIRMA DEL MÉDICO ===
  const firmaMedicoX = tablaInicioX + 80; // Centrado en la columna
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
  const centroColumna = tablaInicioX + (tablaAncho / 2);
  doc.text("Sello y Firma del Médico", centroColumna, yFirmas + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumna, yFirmas + 28.5, { align: "center" });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 12 });

  // === Imprimir ===
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
