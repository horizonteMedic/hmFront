import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import { getSign, convertirGenero } from "../../../utils/helpers.js";
import footerTR from '../../components/footerTR.jsx';

export default async function ResumenAnexo7C_OHLA_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Función para convertir texto a formato gramaticalmente correcto (primera letra mayúscula, resto minúsculas)
  const formatearTextoGramatical = (texto) => {
    if (!texto || typeof texto !== 'string' || texto === 'undefined' || texto === 'null') return '';

    // Lista de textos que deben mantenerse en mayúsculas
    const textosMayusculas = ['N/A', 'O.D', 'O.I', 'RCRR', 'HRH', 'B/D', 'RHA(+)'];

    // Dividir por líneas para manejar listas con viñetas
    const lineas = texto.split('\n');
    const lineasFormateadas = lineas.map(linea => {
      if (!linea.trim()) return linea; // Mantener líneas vacías

      // Si la línea empieza con "- " (viñeta), formatear después del guión
      if (linea.trim().startsWith('- ')) {
        const contenido = linea.trim().substring(2); // Quitar "- "
        return '- ' + contenido.charAt(0).toUpperCase() + contenido.slice(1).toLowerCase();
      }

      // Si la línea empieza con ". " (punto), formatear después del punto
      if (linea.trim().startsWith('. ')) {
        const contenido = linea.trim().substring(2); // Quitar ". "
        return '. ' + contenido.charAt(0).toUpperCase() + contenido.slice(1).toLowerCase();
      }

      // Para líneas normales, formatear palabra por palabra respetando textos específicos
      const palabras = linea.split(' ');
      const palabrasFormateadas = palabras.map((palabra, index) => {
        // Verificar si la palabra (sin puntuación) está en la lista de mayúsculas
        const palabraSinPuntuacion = palabra.replace(/[.,:;()[\]{}]/g, '');
        const debeSerMayuscula = textosMayusculas.some(texto =>
          texto.toLowerCase() === palabraSinPuntuacion.toLowerCase()
        );

        if (debeSerMayuscula) {
          // Mantener la palabra en mayúsculas
          return palabra.toUpperCase();
        } else if (index === 0) {
          // Primera palabra: primera letra mayúscula, resto minúsculas
          return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
        } else {
          // Palabras siguientes: minúsculas
          return palabra.toLowerCase();
        }
      });

      return palabrasFormateadas.join(' ');
    });

    return lineasFormateadas.join('\n');
  };

  // Función para formatear con terminaciones médicas
  const formatearConTerminacion = (valor, terminacion) => {
    if (!valor || valor === 'undefined' || valor === 'null') return '';
    return formatearTextoGramatical(String(valor)) + terminacion;
  };

  // Normalizador único de datos de entrada
  function buildDatosFinales(raw) {
    const datosReales = {
      apellidosNombres: String((((raw?.apellidosPaciente ?? '') + ' ' + (raw?.nombresPaciente ?? '')).trim())),
      fechaExamen: formatearFechaCorta(raw?.fechaFichaAnexo16_fecha),
      tipoExamen: String(raw?.nombreExamen),
      sexo: convertirGenero(raw?.sexoPaciente),
      documentoIdentidad: String(raw?.dniPaciente),
      edad: String(raw?.edadPaciente),
      fechaNacimiento: formatearFechaCorta(raw?.fechaNacimientoPaciente),
      domicilio: String(raw?.direccionPaciente),
      areaTrabajo: String(raw?.areaPaciente),
      puestoTrabajo: String(raw?.cargoPaciente),
      empresa: String(raw?.empresa),
      contrata: String(raw?.contrata),
      sede: String(raw?.sede),
      numeroFicha: String(raw?.norden),
      color: Number(raw?.color),
      codigoColor: String(raw?.codigoColor),
      textoColor: String(raw?.textoColor),
      // Mapeo de antecedentes médicos - usando los campos correctos
      antecedentesPersonales: String(raw?.antecedentesPersonales2Anexo7c_txtantecedentespersonales2 || ''),
      antecedentesPatologicos: String(raw?.antecedentesPatologicos_ante_patologicos || ''),
      antecedentesFamiliares: String(raw?.antecedentesFamiliaresAnexo7c_txtantecedentesfamiliares || ''),
      // Mapeo de signos vitales - usando los campos correctos
      fc: String(raw?.frecuenciaCardiacaTriaje_f_cardiaca),
      fr: String(raw?.frecuenciaRespiratoriaTriaje_f_respiratoria),
      pa: String((raw?.sistolicatriaje_sistolica) + "/" + (raw?.diastolicatriaje_diastolica)),
      talla: String(raw?.tallatriaje_talla),
      peso: String(raw?.pesotriaje_peso),
      imc: String(raw?.imctriaje_imc),
      satO2: String(raw?.saturacionoxigenotriaje_sat_02),
      // Mapeo de exámenes complementarios - usando los campos correctos
      estadoNutricional: String(raw?.conclusionImc || ''),
      medicina: String(raw?.aptitud || ''),
      examenOftalmologico: String(raw?.enfermedadesocularesoftalmo_e_oculares || ''),
      examenOdontologico: String(raw?.observacionesOdontograma_txtobservaciones || ''),
      evaluacionPsicologica: String(raw?.aproboPsicologico_aprobo_inf || ''),
      audiometria: String(raw?.diagnosticoAudiometria_diagnostico || ''),
      radiografiaTorax: String(raw?.conclusionesRadiograficas || ''),
      electrocardiograma: String(raw?.hallazgosInformeElectroCardiograma_hallazgo || ''),
      espirometria: String(raw?.conclusionAnexo7c_txtconclusion || ''),
      // Mapeo de exámenes de laboratorio - usando los campos correctos
      grupoFactorSanguineo: String(raw?.grupoFactorSanguineo_grupofactor || ''),
      hemograma: "NORMAL",
      hemoglobina: (raw?.hemoglobinaLaboratorioClinico_txthemoglobina || '') + " g/dl",
      hematocrito: (raw?.hematocritoLaboratorioClinico_txthematocrito || '') + " % ",
      colesterol: (raw?.colesterolAnalisisBioquimico_txtcolesterol || '') + " mg/dl",
      trigliceridos: (raw?.trigliseridosAnalisisBioquimico_txttrigliseridos || '') + " mg/dl",
      examenOrina: "NORMAL",
      glucosa: (raw?.glucosaLaboratorioClinico_txtglucosabio || '') + " mg/dl",
      colinesterasaSerica: "-",
      // Mapeo de hallazgos y recomendaciones - usando los campos correctos
      hallazgos: String(raw?.observacionesFichaMedicaAnexo7c_txtobservacionesfm || ''),
      recomendaciones: String(raw?.recomendacionesAnalisisBioquimico_txtrecomendaciones || ''),
      // Mapeo de nota - texto fijo
      nota: "SE SUGIERE EL CUMPLIMIENTO DE LOS PROTOCOLOS DE PREVENCIÓN PARA COVID-19 SEGÚN NORMATIVA VIGENTE."
    };

    return datosReales;
  }

  const datosFinales = buildDatosFinales(data);

  // Header reutilizable
  const drawHeader = async (pageNumber) => {
    // Logo y membrete
    await CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Títulos
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("RESUMEN MÉDICO", pageW / 2, 34, { align: "center" });

    // Número de Ficha, Sede, Fecha y Página
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("Nro de ficha: ", pageW - 70, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha || "", pageW - 50, 16);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + (datosFinales.sede || ""), pageW - 70, 20);
    doc.text("Fecha de examen: " + (formatearFechaCorta(data?.fechaFichaAnexo16_fecha) || ""), pageW - 70, 25);
    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 25, 8);

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

  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea mejorada para listas numeradas
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    // Validar que el texto no sea undefined, null o vacío
    if (!texto || texto === null || texto === undefined) {
      return y;
    }

    const fontSize = doc.internal.getFontSize();
    let yPos = y;

    // Dividir por saltos de línea explícitos (\n)
    const lineas = String(texto).split('\n');

    lineas.forEach((linea, index) => {
      // Verificar si la línea comienza con un número seguido de punto (lista numerada)
      const esListaNumerada = /^\d+\./.test(linea.trim());

      if (esListaNumerada) {
        // Agregar espacio extra antes de cada elemento de lista (excepto el primero)
        if (index > 0) {
          yPos += fontSize * 0.2; // Espacio adicional entre elementos
        }

        // Para listas numeradas, mantener el número en la misma línea
        const palabras = linea.split(' ');
        let lineaActual = '';

        palabras.forEach((palabra, palabraIndex) => {
          const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
          const anchoTexto = doc.getTextWidth(textoPrueba);

          if (anchoTexto <= anchoMaximo) {
            lineaActual = textoPrueba;
          } else {
            if (lineaActual) {
              doc.text(lineaActual, x, yPos);
              yPos += fontSize * 0.35;
              // Si es el primer elemento de la lista, agregar indentación
              lineaActual = palabraIndex === 0 ? palabra : '   ' + palabra;
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
      } else {
        // Para texto normal, usar el método original
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
              yPos += fontSize * 0.35;
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

  // === PÁGINA 1 ===
  await drawHeader(numeroPagina);

  // === SECCIÓN 1: DATOS DE FILIACIÓN ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 35;
  const filaAltura = 5;

  // Header de datos de filiación
  yPos = dibujarHeaderSeccion("I. DATOS DE FILIACIÓN", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres | Tipo de Examen (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura);
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

  // Cuarta fila: Área de Trabajo (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Puesto de Trabajo (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Sexta fila: Empresa (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Séptima fila: Contratista (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 35 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres | Tipo de Examen
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres || "", tablaInicioX + 40, yTexto + 1.5, 70);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.tipoExamen || "", tablaInicioX + 155, yTexto + 1.5, 50);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.documentoIdentidad || "", tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text((datosFinales.edad || "") + " Años", tablaInicioX + 58, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.sexo || "", tablaInicioX + 105, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.fechaNacimiento || "", tablaInicioX + 165, yTexto + 1.5);
  yTexto += filaAltura;

  // Tercera fila: Domicilio
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.domicilio || "", tablaInicioX + 25, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Cuarta fila: Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo || "", tablaInicioX + 30, yTexto + 1.5, tablaAncho - 35);
  yTexto += filaAltura;

  // Quinta fila: Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo || "", tablaInicioX + 35, yTexto + 1.5, tablaAncho - 40);
  yTexto += filaAltura;

  // Sexta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.empresa || "", tablaInicioX + 25, yTexto + 1.5, tablaAncho - 25);
  yTexto += filaAltura;

  // Séptima fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.contrata || "", tablaInicioX + 25, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // === SECCIÓN: RESULTADOS DE EVALUACIÓN MÉDICA ===
  // Fila gris: A continuación le informamos los resultados de su evaluación médica
  yPos = dibujarHeaderSeccion("A continuación le informamos los resultados de su evaluación médica", yPos, filaAltura);

  // Función para dibujar subheader con color celeste
  const dibujarSubHeaderCeleste = (titulo, yPos, alturaHeader = 5) => {
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // Dibujar fondo celeste
    doc.setFillColor(199, 241, 255); // Color celeste claro
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');

    // Dibujar líneas del subheader
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);

    // Dibujar texto del subtítulo
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);

    return yPos + alturaHeader;
  };

  // Función para calcular altura dinámica de texto mejorada para listas numeradas
  const calcularAlturaTexto = (texto, anchoMaximo) => {
    // Validar que el texto no sea undefined, null o vacío
    if (!texto || texto === null || texto === undefined) {
      return 15; // Altura mínima
    }

    let lineas = 0;

    // Dividir por saltos de línea explícitos (\n)
    const lineasTexto = String(texto).split('\n');

    lineasTexto.forEach((linea, index) => {
      // Verificar si la línea comienza con un número seguido de punto (lista numerada)
      const esListaNumerada = /^\d+\./.test(linea.trim());

      if (esListaNumerada) {
        // Agregar espacio extra entre elementos de lista (excepto el primero)
        if (index > 0) {
          lineas += 0.2; // Espacio adicional entre elementos
        }

        // Para listas numeradas, calcular líneas considerando el ancho
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

        lineas += lineasEnEstaSeccion;
      } else {
        // Para texto normal, usar el método original
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

        lineas += lineasEnEstaSeccion;
      }
    });

    // Altura mínima de 15mm, altura por línea de 3mm
    const alturaCalculada = lineas * 3 + 2;
    return Math.max(alturaCalculada, 15);
  };

  // Función específica para calcular altura de hallazgos y recomendaciones con altura mínima de 55mm
  const calcularAlturaTextoEspecial = (texto, anchoMaximo) => {
    // Validar que el texto no sea undefined, null o vacío
    if (!texto || texto === null || texto === undefined) {
      return 55; // Altura mínima
    }

    let lineas = 0;

    // Dividir por saltos de línea explícitos (\n)
    const lineasTexto = String(texto).split('\n');

    lineasTexto.forEach((linea, index) => {
      // Verificar si la línea comienza con un número seguido de punto (lista numerada)
      const esListaNumerada = /^\d+\./.test(linea.trim());

      if (esListaNumerada) {
        // Agregar espacio extra entre elementos de lista (excepto el primero)
        if (index > 0) {
          lineas += 0.2; // Espacio adicional entre elementos
        }

        // Para listas numeradas, calcular líneas considerando el ancho
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

        lineas += lineasEnEstaSeccion;
      } else {
        // Para texto normal, usar el método original
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

        lineas += lineasEnEstaSeccion;
      }
    });

    // Altura mínima de 55mm para hallazgos y recomendaciones, altura por línea de 3mm
    const alturaCalculada = lineas * 3 + 2;
    return Math.max(alturaCalculada, 55);
  };

  // Subheader celeste: Antecedentes Personales Importantes
  yPos = dibujarSubHeaderCeleste("Antecedentes Personales Importantes", yPos, filaAltura);

  // Fila de Antecedentes Personales (creciente)
  const antecedentesPersonalesTexto = datosFinales.antecedentesPersonales || "";
  const alturaAntecedentesPersonales = calcularAlturaTexto(antecedentesPersonalesTexto, tablaAncho - 9);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaAntecedentesPersonales);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaAntecedentesPersonales);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaAntecedentesPersonales, tablaInicioX + tablaAncho, yPos + alturaAntecedentesPersonales);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(antecedentesPersonalesTexto, tablaInicioX + 3, yPos + 6, tablaAncho - 4);
  yPos += alturaAntecedentesPersonales;

  // Subheader celeste: Antecedentes Patológicos Importantes
  yPos = dibujarSubHeaderCeleste("Antecedentes Patológicos Importantes", yPos, filaAltura);

  // Fila de Antecedentes Patológicos (creciente)
  const antecedentesPatologicosTexto = datosFinales.antecedentesPatologicos || "";
  const alturaAntecedentesPatologicos = calcularAlturaTexto(antecedentesPatologicosTexto, tablaAncho - 12);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaAntecedentesPatologicos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaAntecedentesPatologicos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaAntecedentesPatologicos, tablaInicioX + tablaAncho, yPos + alturaAntecedentesPatologicos);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(antecedentesPatologicosTexto, tablaInicioX + 3, yPos + 6, tablaAncho - 7);
  yPos += alturaAntecedentesPatologicos;

  // Subheader celeste: Antecedentes Familiares Importantes
  yPos = dibujarSubHeaderCeleste("Antecedentes Familiares Importantes", yPos, filaAltura);

  // Fila de Antecedentes Familiares (creciente)
  const antecedentesFamiliaresTexto = datosFinales.antecedentesFamiliares || "";
  const alturaAntecedentesFamiliares = calcularAlturaTexto(antecedentesFamiliaresTexto, tablaAncho - 9);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaAntecedentesFamiliares);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaAntecedentesFamiliares);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaAntecedentesFamiliares, tablaInicioX + tablaAncho, yPos + alturaAntecedentesFamiliares);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(antecedentesFamiliaresTexto, tablaInicioX + 3, yPos + 6, tablaAncho - 4);
  yPos += alturaAntecedentesFamiliares;

  // === SECCIÓN: EXAMEN FÍSICO ===
  // Fila gris: Examen Físico
  yPos = dibujarHeaderSeccion("EXAMEN CLÍNICO", yPos, filaAltura);

  // === FILA 1: SIGNOS VITALES (7 divisiones) ===
  const alturaFilaSignos = 4;

  // Dibujar líneas de la fila con 7 divisiones
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaSignos); // Línea izquierda
  doc.line(tablaInicioX + 25, yPos, tablaInicioX + 25, yPos + alturaFilaSignos); // División 1
  doc.line(tablaInicioX + 51, yPos, tablaInicioX + 51, yPos + alturaFilaSignos); // División 2
  doc.line(tablaInicioX + 85, yPos, tablaInicioX + 85, yPos + alturaFilaSignos); // División 3
  doc.line(tablaInicioX + 111, yPos, tablaInicioX + 111, yPos + alturaFilaSignos); // División 4
  doc.line(tablaInicioX + 137, yPos, tablaInicioX + 137, yPos + alturaFilaSignos); // División 5
  doc.line(tablaInicioX + 167, yPos, tablaInicioX + 167, yPos + alturaFilaSignos); // División 6

  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaSignos); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaSignos, tablaInicioX + tablaAncho, yPos + alturaFilaSignos); // Línea inferior

  // Contenido de la fila de signos vitales
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FC :", tablaInicioX + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.fc || "") + " lpm", tablaInicioX + 10, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FR :", tablaInicioX + 28, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.fr || "") + " rpm", tablaInicioX + 35, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("PA :", tablaInicioX + 52, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.pa || "") + " mmHg", tablaInicioX + 59, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Talla :", tablaInicioX + 88, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.talla || "") + " cm", tablaInicioX + 96, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Peso :", tablaInicioX + 114, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.peso || "") + " kg", tablaInicioX + 124, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("IMC :", tablaInicioX + 138, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.imc || "") + " kg/m²", tablaInicioX + 148, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("SAT O2 :", tablaInicioX + 170, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.satO2 || "") + " %", tablaInicioX + 184, yPos + 3);

  yPos += alturaFilaSignos;

  // === SECCIÓN: EXÁMENES COMPLEMENTARIOS ===
  // Fila gris: Exámenes Complementarios
  yPos = dibujarHeaderSeccion("EXÁMENES COMPLEMENTARIOS", yPos, filaAltura);

  // Función para calcular altura de filas de examen (con altura mínima menor)
  const calcularAlturaFilaExamen = (texto, anchoMaximo) => {
    // Validar que el texto no sea undefined, null o vacío
    if (!texto || texto === null || texto === undefined || texto === '') {
      return 4.5; // Altura mínima para filas vacías
    }

    let lineas = 0;

    // Dividir por saltos de línea explícitos (\n)
    const lineasTexto = String(texto).split('\n');

    lineasTexto.forEach((linea, index) => {
      // Verificar si la línea comienza con un número seguido de punto (lista numerada)
      const esListaNumerada = /^\d+\./.test(linea.trim());

      if (esListaNumerada) {
        // Agregar espacio extra entre elementos de lista (excepto el primero)
        if (index > 0) {
          lineas += 0.2; // Espacio adicional entre elementos
        }

        // Para listas numeradas, calcular líneas considerando el ancho
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

        lineas += lineasEnEstaSeccion;
      } else {
        // Para texto normal, usar el método original
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

        lineas += lineasEnEstaSeccion;
      }
    });

    // Altura mínima de 4.5mm, altura por línea de 3mm
    const alturaCalculada = lineas * 3 + 2;
    return Math.max(alturaCalculada, 4.5);
  };

  // Función para dibujar una fila de examen con altura dinámica
  const dibujarFilaExamen = (titulo, valor, yPos) => {
    // Calcular altura dinámica basada en el contenido
    const posicionDivision = tablaInicioX + tablaAncho / 2 - 55; // 15mm hacia la izquierda del centro
    const anchoMaximoTexto = tablaAncho - posicionDivision - 4;

    // Calcular altura necesaria para el texto
    const textoValor = valor || "";
    const alturaFilaExamen = calcularAlturaFilaExamen(textoValor, anchoMaximoTexto);

    // Dibujar líneas de la fila con división vertical (15mm hacia la izquierda del centro)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaExamen); // Línea izquierda
    doc.line(posicionDivision, yPos, posicionDivision, yPos + alturaFilaExamen); // Línea divisoria vertical
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaExamen); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaExamen, tablaInicioX + tablaAncho, yPos + alturaFilaExamen); // Línea inferior

    // Contenido de la fila
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo + ":", tablaInicioX + 2, yPos + 3);
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(textoValor, posicionDivision + 2, yPos + 3, anchoMaximoTexto);

    return yPos + alturaFilaExamen;
  };

  // Filas de exámenes complementarios
  yPos = dibujarFilaExamen("Estado nutricional", datosFinales.estadoNutricional, yPos);
  yPos = dibujarFilaExamen("Medicina", datosFinales.medicina, yPos);
  yPos = dibujarFilaExamen("Examen oftalmológico", datosFinales.examenOftalmologico, yPos);
  yPos = dibujarFilaExamen("Examen odontológico", datosFinales.examenOdontologico, yPos);
  yPos = dibujarFilaExamen("Evaluación psicológica", datosFinales.evaluacionPsicologica, yPos);
  yPos = dibujarFilaExamen("Audiometría", datosFinales.audiometria, yPos);
  yPos = dibujarFilaExamen("Radiografía Tórax", datosFinales.radiografiaTorax, yPos);
  yPos = dibujarFilaExamen("Electrocardiograma", datosFinales.electrocardiograma, yPos);
  yPos = dibujarFilaExamen("Espirometría", datosFinales.espirometria, yPos);

  // === SECCIÓN: EXÁMENES DE LABORATORIO ===
  // Fila gris: Exámenes de Laboratorio
  yPos = dibujarHeaderSeccion("EXÁMENES DE LABORATORIO:", yPos, filaAltura);

  // Filas de exámenes de laboratorio
  yPos = dibujarFilaExamen("Grupo y Factor Sanguíneo", datosFinales.grupoFactorSanguineo, yPos);
  yPos = dibujarFilaExamen("Hemograma", datosFinales.hemograma, yPos);
  yPos = dibujarFilaExamen("Hemoglobina", datosFinales.hemoglobina, yPos);
  yPos = dibujarFilaExamen("Hematocrito", datosFinales.hematocrito, yPos);
  yPos = dibujarFilaExamen("Colesterol", datosFinales.colesterol, yPos);
  yPos = dibujarFilaExamen("Triglicéridos", datosFinales.trigliceridos, yPos);
  yPos = dibujarFilaExamen("Examen de Orina", datosFinales.examenOrina, yPos);

  // Fila de Glucosa con valores de referencia fijos
  const separacionGlucosa = 80; // mm de separación (puedes cambiar este valor)
  const espaciosSeparacion = " ".repeat(separacionGlucosa); // Convierte mm a espacios
  const valorGlucosaConReferencia = (datosFinales.glucosa || "") + espaciosSeparacion + "(Valores de referencia: 70.00 - 110.00 mg/dl)";
  yPos = dibujarFilaExamen("Glucosa", valorGlucosaConReferencia, yPos);

  // === SECCIÓN: COLINESTERASA SÉRICA ===
  // Fila celeste: Colinesterasa Sérica
  yPos = dibujarSubHeaderCeleste("Colinesterasa Sérica:", yPos, filaAltura);

  // Fila de datos creciente para Colinesterasa Sérica
  const colinesterasaTexto = datosFinales.colinesterasaSerica || "";
  const alturaColinesterasa = calcularAlturaTexto(colinesterasaTexto, tablaAncho - 4);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaColinesterasa);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaColinesterasa);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaColinesterasa, tablaInicioX + tablaAncho, yPos + alturaColinesterasa);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(colinesterasaTexto, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
  yPos += alturaColinesterasa;

  // === FOOTER PÁGINA 1 ===
  footerTR(doc, { footerOffsetY: 5 });

  // === PÁGINA 2 ===
  // Verificar si necesitamos nueva página
  if (yPos > 250) { // Si el contenido excede el límite de la página
    doc.addPage();
    numeroPagina = 2;
    await drawHeader(numeroPagina);
    yPos = 35; // Resetear posición Y para la nueva página
  }

  // === SECCIÓN: VALORES DE REFERENCIA COLINESTERASA SÉRICA ===
  // Fila instructiva con valores de referencia (color #f5ae67)
  const alturaFilaInstructiva = 20; // Altura fija para la fila instructiva

  // Dibujar fondo color #f5ae67
  doc.setFillColor(245, 174, 103); // Color #f5ae67
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaInstructiva, 'F');

  // Dibujar líneas de la fila instructiva
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaInstructiva);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaInstructiva);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaInstructiva, tablaInicioX + tablaAncho, yPos + alturaFilaInstructiva);

  // Contenido de la fila instructiva
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Valores de referencia:", tablaInicioX + 2, yPos + 4);

  doc.setFont("helvetica", "normal").setFontSize(7);
  const valoresReferencia = [
    "-HOMBRES: (5500 - 13400) U/L",
    "-MUJERES DE MÁS DE 40 AÑOS: (5500 - 13400) U/L",
    "-MUJERES DE 16-39 AÑOS no embarazadas o tomando anticonceptivos orales: (4400 - 11700) U/L",
    "-MUJERES DE 18-41 AÑOS embarazadas"
  ];

  let yTextoInstructivo = yPos + 7;
  valoresReferencia.forEach(linea => {
    dibujarTextoConSaltoLinea(linea, tablaInicioX + 2, yTextoInstructivo, tablaAncho - 4);
    yTextoInstructivo += 3; // Espaciado entre líneas
  });

  yPos += alturaFilaInstructiva;

  // === SECCIÓN: HALLAZGOS ===
  // Fila gris: HALLAZGOS
  yPos = dibujarHeaderSeccion("HALLAZGOS", yPos, filaAltura);

  // Fila descriptiva: "En la presente evaluación médica se encontró lo siguiente:"
  const alturaFilaDescriptiva = 4;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaDescriptiva);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaDescriptiva);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaDescriptiva, tablaInicioX + tablaAncho, yPos + alturaFilaDescriptiva);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("En la presente evaluación médica se encontró lo siguiente:", tablaInicioX + 2, yPos + 3);
  yPos += alturaFilaDescriptiva;

  // Fila de datos creciente para Hallazgos
  const hallazgosTexto = datosFinales.hallazgos || "-";
  const alturaHallazgos = calcularAlturaTextoEspecial(hallazgosTexto, tablaAncho - 9);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHallazgos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHallazgos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaHallazgos, tablaInicioX + tablaAncho, yPos + alturaHallazgos);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(hallazgosTexto, tablaInicioX + 3, yPos + 6, tablaAncho - 4);
  yPos += alturaHallazgos;

  // === SECCIÓN: RECOMENDACIONES ===
  // Fila gris: RECOMENDACIONES
  yPos = dibujarHeaderSeccion("RECOMENDACIONES", yPos, filaAltura);

  // Fila descriptiva: "Las recomendaciones al respecto son las siguientes:"
  const alturaFilaDescriptivaRecomendaciones = 4;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaDescriptivaRecomendaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaDescriptivaRecomendaciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaDescriptivaRecomendaciones, tablaInicioX + tablaAncho, yPos + alturaFilaDescriptivaRecomendaciones);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Las recomendaciones al respecto son las siguientes:", tablaInicioX + 2, yPos + 3);
  yPos += alturaFilaDescriptivaRecomendaciones;

  // Fila de datos creciente para Recomendaciones
  const recomendacionesTexto = datosFinales.recomendaciones || "-";
  const alturaRecomendaciones = calcularAlturaTextoEspecial(recomendacionesTexto, tablaAncho - 9);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaRecomendaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaRecomendaciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaRecomendaciones, tablaInicioX + tablaAncho, yPos + alturaRecomendaciones);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(recomendacionesTexto, tablaInicioX + 3, yPos + 6, tablaAncho - 4);
  yPos += alturaRecomendaciones;

  // === SECCIÓN: NOTA ===
  // Fila celeste: NOTA
  yPos = dibujarSubHeaderCeleste("NOTA:", yPos, filaAltura);

  // Fila creciente con altura de 10mm
  const alturaFilaNota = 10;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaNota);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaNota);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaNota, tablaInicioX + tablaAncho, yPos + alturaFilaNota);

  // Contenido de la fila NOTA
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.nota, tablaInicioX + 3, yPos + 6, tablaAncho - 4);
  yPos += alturaFilaNota;

  // Fila instructiva con información de contacto
  const alturaFilaInstructivaNota = 8;

  // Dibujar fondo color #f5ae67
  doc.setFillColor(245, 174, 103); // Color #f5ae67
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaInstructivaNota, 'F');

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaInstructivaNota);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaInstructivaNota);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaInstructivaNota, tablaInicioX + tablaAncho, yPos + alturaFilaInstructivaNota);

  // Contenido de la fila instructiva
  doc.setFont("helvetica", "normal").setFontSize(8);
  const textoInstructivo = "Si deseara alguna aclaración o información adicional con respecto al presente informe, no dude en llamarnos al teléfono 044-767608 de 8:00 - 1:00 p.m. y 3:00 – 6:00 p.m.";
  dibujarTextoConSaltoLinea(textoInstructivo, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
  yPos += alturaFilaInstructivaNota;

  // === SECCIÓN DE FIRMAS ===
  const yFirmas = yPos; // Sin separación después de la última sección
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
  let firmaMedicoUrl = getSign(data, "SELLOFIRMA");
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
