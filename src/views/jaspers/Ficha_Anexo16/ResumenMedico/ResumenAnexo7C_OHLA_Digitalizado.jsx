import jsPDF from "jspdf";
import drawColorBox from '../../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import { getSign, convertirGenero } from "../../../utils/helpers.js";
import footerTR from '../../components/footerTR.jsx';

export default function ResumenAnexo7C_OHLA_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Normalizador único de datos de entrada
  function buildDatosFinales(raw) {
    const datosReales = {
      apellidosNombres: String((((raw?.apellidosPaciente ?? '') + ' ' + (raw?.nombresPaciente ?? '')).trim())),
      fechaExamen: formatearFechaCorta(raw?.fechaEntrevista ?? ''), 
      tipoExamen: String(raw?.nombreExamen ?? ''),
      sexo: convertirGenero(raw?.sexoPaciente ?? ''),
      documentoIdentidad: String(raw?.dniPaciente ?? ''),
      edad: String(raw?.edadPaciente ?? ''),
      fechaNacimiento: formatearFechaCorta(raw?.fechaNacimientoPaciente ?? ''),
      domicilio: String(raw?.direccionPaciente ?? ''),
      areaTrabajo: String(raw?.areaPaciente ?? ''),
      puestoTrabajo: String(raw?.cargoPaciente ?? ''),
      empresa: String(raw?.empresa ?? ''),
      contrata: String(raw?.contrata ?? ''),
      sede: String(raw?.sede ?? ''),
      numeroFicha: String(raw?.norden ?? ""),
      color: Number(raw?.color ?? 0),
      codigoColor: String(raw?.codigoColor ?? ''),
      textoColor: String(raw?.textoColor ?? ''),
      apto: (typeof raw?.aprobo === 'boolean') ? raw.aprobo : false,
      // Mapeo de antecedentes médicos
      antecedentesPersonales: String(raw?.antecedentesPersonales ?? raw?.antecedentesPersonalesDescripcion ?? '-'),
      antecedentesPatologicos: String(raw?.antecedentesPatologicos ?? raw?.antecedentesPatologicosDescripcion ?? '-'),
      antecedentesFamiliares: String(raw?.antecedentesFamiliares ?? raw?.antecedentesFamiliaresDescripcion ?? '-'),
      // Mapeo de signos vitales
      fc: String(raw?.frecuenciaCardiaca ?? ''),
      fr: String(raw?.frecuenciaRespiratoriaTriaje_f_respiratoria ?? ''),
      pa: String((raw?.sistolica ?? '') + "/" + (raw?.diastolica ?? '')),
      talla: String(raw?.tallaTriaje ?? ''),
      peso: String(raw?.pesoTriaje ?? ''),
      imc: String(raw?.imcTriaje ?? ''),
      satO2: String(raw?.saturacionOxigeno ?? ''),
      // Mapeo de exámenes complementarios
      estadoNutricional: String(raw?.estadoNutricional ?? ''),
      medicina: String(raw?.medicina ?? ''),
      examenOftalmologico: String(raw?.examenOftalmologico ?? ''),
      examenOdontologico: String(raw?.examenOdontologico ?? ''),
      evaluacionPsicologica: String(raw?.evaluacionPsicologica ?? ''),
      audiometria: String(raw?.audiometria ?? ''),
      radiografiaTorax: String(raw?.radiografiaTorax ?? ''),
      electrocardiograma: String(raw?.electrocardiograma ?? ''),
      espirometria: String(raw?.espirometria ?? ''),
      // Mapeo de exámenes de laboratorio
      grupoFactorSanguineo: String(raw?.grupoFactorSanguineo ?? ''),
      hemograma: String(raw?.hemograma ?? ''),
      hemoglobina: String(raw?.hemoglobina ?? ''),
      hematocrito: String(raw?.hematocrito ?? ''),
      colesterol: String(raw?.colesterol ?? ''),
      trigliceridos: String(raw?.trigliceridos ?? ''),
      examenOrina: String(raw?.examenOrina ?? ''),
      glucosa: String(raw?.glucosa ?? ''),
      colinesterasaSerica: String(raw?.colinesterasaSerica ?? ''),
      // Mapeo de hallazgos
      hallazgos: String(raw?.hallazgos ?? raw?.hallazgosDescripcion ?? ''),
      // Mapeo de recomendaciones
      recomendaciones: String(raw?.recomendaciones ?? raw?.recomendacionesDescripcion ?? ''),
      // Mapeo de nota
      nota: String(raw?.nota ?? raw?.notaDescripcion ?? '-')
    };

    const datosPrueba = {
      apellidosNombres: 'MARTÍNEZ RODRÍGUEZ, CARLOS ALBERTO',
      fechaExamen: '20/11/2025',
      tipoExamen: 'PRE-OCUPACIONAL',
      sexo: 'Masculino',
      documentoIdentidad: '12345678',
      edad: '35',
      fechaNacimiento: '15/08/1990',
      domicilio: 'Av. Los Olivos 123 - Lima',
      areaTrabajo: 'Minería',
      puestoTrabajo: 'Supervisor de Operaciones',
      empresa: 'OHLA PERÚ S.A.C.',
      contrata: 'CONSTRUCCIONES INTEGRALES S.R.L.',
      sede: 'Lima - San Isidro',
      numeroFicha: '000789',
      color: 2,
      codigoColor: '#2196F3',
      textoColor: 'O',
      apto: true,
      // Datos de antecedentes médicos
      antecedentesPersonales: '-',
      antecedentesPatologicos: '-',
      antecedentesFamiliares: '-',
      // Datos de signos vitales
      fc: '72',
      fr: '16',
      pa: '120/80',
      talla: '175',
      peso: '70',
      imc: '22.86',
      satO2: '98',
      // Datos de exámenes complementarios
      estadoNutricional: 'OBESIDAD I',
      medicina: 'APTO CON RESTRICCIÓN',
      examenOftalmologico: 'PTERIGIÓN BILATERAL GRADO I',
      examenOdontologico: '4 CARIES DENTAL SIMPLES (PZAS. 24-26-36-47) - TRATAMIENTO SUGERIDO:',
      evaluacionPsicologica: 'CUMPLE CON EL PERFIL DEL PUESTO',
      audiometria: 'HIPOACUSIA MIXTA MODERADA OÍDO DERECHO Y NEUROSENSORIAL LEVE OÍDO IZQUIERDO',
      radiografiaTorax: 'NORMAL',
      electrocardiograma: 'DENTRO DE PARÁMETROS NORMALES',
      espirometria: 'ESPIROMETRÍA NORMAL',
      // Datos de exámenes de laboratorio
      grupoFactorSanguineo: 'O - +',
      hemograma: 'NORMAL',
      hemoglobina: '14.5 gr %',
      hematocrito: '45',
      colesterol: '199.5',
      trigliceridos: '280.6',
      examenOrina: 'NORMAL',
      glucosa: '109.0 mg/dl',
      colinesterasaSerica: '8,500 U/L',
      // Datos de hallazgos
      hallazgos: '1. PTERIGIÓN BILATERAL GRADO I en el examen oftalmológico.\n2. CARIES DENTAL SIMPLES en piezas 24, 26, 36 y 47 que requieren tratamiento odontológico.\n3. HIPOACUSIA MIXTA MODERADA en oído derecho y neurosensorial leve en oído izquierdo según audiometría.\n4. OBESIDAD GRADO I según evaluación nutricional.\n5. Todos los demás exámenes complementarios y de laboratorio se encuentran dentro de parámetros normales.',
      // Datos de recomendaciones
      recomendaciones: '1. TOMAR FENOFIBRATO 160 MG 01 TAB C/24H POR 1 MES. DIETA HIPOCALORICA, HIPOGRASA Y EJERCICIOS. EVALUACION EN 03 MESES CON PERFIL LIPIDICO.\n2. TOMAR OMEGA 3 01 TAB VO C/24H POR 3 MESES. NO HACER TRABAJOS SOBRE 1.8 M.S.N. PISO. CAMBIO DE ESTILO DE VIDA: DIETA HIPOCALORICA Y EJERCICIOS 3 VECES X SEMANA. CONTROL DE PESO MENSUAL.\n3. TRATAMIENTO SUGERIDO: RESTAURACIONES SIMPLES.\n4. USO DE EPP AUDITIVO ANTE EXPOSICION A RUIDO >=85 DB. EVALUACION AUDIOMETRICA SEMESTRAL.\n5. SE SUGIERE USO DE LENTES CON PROTECCION UV. EVALUACION ANUAL POR OFTALMOLOGIA.',
      // Datos de nota
      nota: 'SE SUGIERE EL CUMPLIMIENTO DE LOS PROTOCOLOS DE PREVENCIÓN PARA COVID 19 SEGÚN NORMATIVA VIGENTE.'
    };

    const selected = (raw && (raw.norden)) ? datosReales : datosPrueba;
    return selected;
  }

  const datosFinales = buildDatosFinales(data);

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Títulos
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("INFORME MÉDICO", pageW / 2, 34, { align: "center" });

    // Número de Ficha, Sede, Fecha y Página
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("Nro de ficha: ", pageW - 70, 15);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 50, 16);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosFinales.sede, pageW - 70, 20);
    doc.text("Fecha de examen: " + (datosFinales.fechaExamen || ""), pageW - 70, 25);
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
    const fontSize = doc.internal.getFontSize();
    let yPos = y;

    // Dividir por saltos de línea explícitos (\n)
    const lineas = texto.split('\n');
    
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
    const tablaInicioX = 7.5;
    const tablaAncho = 195;

    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // Dibujar fondo gris más oscuro
    doc.setFillColor(160, 160, 160);
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
  drawHeader(numeroPagina);

  // === SECCIÓN 1: DATOS DE FILIACIÓN ===
  const tablaInicioX = 7.5;
  const tablaAncho = 195;
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

  // Cuarta fila: Área de Trabajo, Puesto de Trabajo (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Empresa (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Sexta fila: Contratista (fila completa)
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
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 1.5, 70);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.tipoExamen, tablaInicioX + 155, yTexto + 1.5, 50);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.edad + " Años", tablaInicioX + 58, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.sexo, tablaInicioX + 105, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.fechaNacimiento, tablaInicioX + 165, yTexto + 1.5);
  yTexto += filaAltura;

  // Tercera fila: Domicilio
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.domicilio, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Cuarta fila: Área de Trabajo, Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo, tablaInicioX + 30, yTexto + 1.5, 50);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Puesto de Trabajo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo, tablaInicioX + 122, yTexto + 1.5, 65);
  yTexto += filaAltura;

  // Quinta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 25);
  yTexto += filaAltura;

  // Sexta fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.contrata, tablaInicioX + 25, yTexto + 1.5, tablaAncho - 30);
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
    doc.setFillColor(173, 216, 230); // Color celeste claro
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
    let lineas = 0;
    
    // Dividir por saltos de línea explícitos (\n)
    const lineasTexto = texto.split('\n');
    
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
    let lineas = 0;
    
    // Dividir por saltos de línea explícitos (\n)
    const lineasTexto = texto.split('\n');
    
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
  const alturaAntecedentesPersonales = calcularAlturaTexto(datosFinales.antecedentesPersonales, tablaAncho - 9);
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaAntecedentesPersonales);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaAntecedentesPersonales);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaAntecedentesPersonales, tablaInicioX + tablaAncho, yPos + alturaAntecedentesPersonales);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.antecedentesPersonales, tablaInicioX + 3, yPos + 6, tablaAncho - 4);
  yPos += alturaAntecedentesPersonales;

  // Subheader celeste: Antecedentes Patológicos Importantes
  yPos = dibujarSubHeaderCeleste("Antecedentes Patológicos Importantes", yPos, filaAltura);

  // Fila de Antecedentes Patológicos (creciente)
  const alturaAntecedentesPatologicos = calcularAlturaTexto(datosFinales.antecedentesPatologicos, tablaAncho - 9);
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaAntecedentesPatologicos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaAntecedentesPatologicos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaAntecedentesPatologicos, tablaInicioX + tablaAncho, yPos + alturaAntecedentesPatologicos);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.antecedentesPatologicos, tablaInicioX + 3, yPos + 6, tablaAncho - 4);
  yPos += alturaAntecedentesPatologicos;

  // Subheader celeste: Antecedentes Familiares Importantes
  yPos = dibujarSubHeaderCeleste("Antecedentes Familiares Importantes", yPos, filaAltura);

  // Fila de Antecedentes Familiares (creciente)
  const alturaAntecedentesFamiliares = calcularAlturaTexto(datosFinales.antecedentesFamiliares, tablaAncho - 9);
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaAntecedentesFamiliares);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaAntecedentesFamiliares);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaAntecedentesFamiliares, tablaInicioX + tablaAncho, yPos + alturaAntecedentesFamiliares);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.antecedentesFamiliares, tablaInicioX + 3, yPos + 6, tablaAncho - 4);
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
  doc.text(datosFinales.fc + " lpm", tablaInicioX + 10, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FR :", tablaInicioX + 28, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fr + " rpm", tablaInicioX + 35, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("PA :", tablaInicioX + 52, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.pa + " mmHg", tablaInicioX + 59, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Talla :", tablaInicioX + 88, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.talla + " cm", tablaInicioX + 96, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Peso :", tablaInicioX + 114, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.peso + " kg", tablaInicioX + 124, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("IMC :", tablaInicioX + 138, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.imc + " kg/m²", tablaInicioX + 148, yPos + 3);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("SAT O2 :", tablaInicioX + 170, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.satO2 + " %", tablaInicioX + 184, yPos + 3);

  yPos += alturaFilaSignos;

  // === SECCIÓN: EXÁMENES COMPLEMENTARIOS ===
  // Fila gris: Exámenes Complementarios
  yPos = dibujarHeaderSeccion("EXÁMENES COMPLEMENTARIOS", yPos, filaAltura);

  // Función para dibujar una fila de examen
  const dibujarFilaExamen = (titulo, valor, yPos) => {
    const alturaFilaExamen = 4.5;
    
    // Dibujar líneas de la fila con división vertical (15mm hacia la izquierda del centro)
    const posicionDivision = tablaInicioX + tablaAncho/2 - 55; // 15mm hacia la izquierda del centro
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaExamen); // Línea izquierda
    doc.line(posicionDivision, yPos, posicionDivision, yPos + alturaFilaExamen); // Línea divisoria vertical
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaExamen); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFilaExamen, tablaInicioX + tablaAncho, yPos + alturaFilaExamen); // Línea inferior

    // Contenido de la fila
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo + ":", tablaInicioX + 2, yPos + 3);
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(valor, posicionDivision + 2, yPos + 3, tablaAncho - posicionDivision - 4);

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
  const valorGlucosaConReferencia = datosFinales.glucosa + espaciosSeparacion + "(Valores de referencia: 70.00 - 110.00 mg/dl)";
  yPos = dibujarFilaExamen("Glucosa", valorGlucosaConReferencia, yPos);

  // === SECCIÓN: COLINESTERASA SÉRICA ===
  // Fila celeste: Colinesterasa Sérica
  yPos = dibujarSubHeaderCeleste("Colinesterasa Sérica:", yPos, filaAltura);

  // Fila de datos creciente para Colinesterasa Sérica
  const alturaColinesterasa = calcularAlturaTexto(datosFinales.colinesterasaSerica, tablaAncho - 4);
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaColinesterasa);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaColinesterasa);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaColinesterasa, tablaInicioX + tablaAncho, yPos + alturaColinesterasa);

  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.colinesterasaSerica, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
  yPos += alturaColinesterasa;

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
    "-MUJERES DE 18-41 AÑOS embarazadas o tomando anticonceptivos orales: (3800 - 9500) U/L"
  ];
  
  let yTextoInstructivo = yPos + 7;
  valoresReferencia.forEach(linea => {
    dibujarTextoConSaltoLinea(linea, tablaInicioX + 2, yTextoInstructivo, tablaAncho - 4);
    yTextoInstructivo += 3; // Espaciado entre líneas
  });
  
  yPos += alturaFilaInstructiva;

  // === FOOTER PÁGINA 1 ===
  footerTR(doc, { footerOffsetY: 5 });

  // === PÁGINA 2 ===
  // Verificar si necesitamos nueva página
  if (yPos > 250) { // Si el contenido excede el límite de la página
    doc.addPage();
    numeroPagina = 2;
    drawHeader(numeroPagina);
    yPos = 35; // Resetear posición Y para la nueva página
  }

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
  doc.setFont("helvetica", "normal").setFontSize(7);
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
  footerTR(doc, { footerOffsetY: 5 });

  // Imprimir
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
