import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { convertirGenero } from "../../utils/helpers";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function Anexo7C_Nuevo(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente) + " " + (data.nombresPaciente)).trim(),
    fechaExamen: formatearFechaCorta(data.fechaExamen_fecha),
    tipoExamen: String(data.nombreExamen),
    sexo: convertirGenero(data.sexoPaciente),
    documentoIdentidad: String(data.dniPaciente),
    edad: String(data.edadPaciente),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente),
    areaTrabajo: data.areaPaciente,
    puestoTrabajo: data.cargoPaciente,
    empresa: data.empresa,
    contrata: data.contrata,
    actividadEconomica: data.actividadEconomica || '',
    resideEnLugarTrabajo: data.resideEnLugarTrabajo ? 'SI' : 'NO',
    tiempoResidencia: data.tiempoResidencia || '',
    correoElectronico: data.correoElectronico || '',
    estadoCivil: data.estadoCivil || '',
    numTotalHijos: data.numTotalHijos || '',
    numDependientes: data.numDependientes || '',
    essalud: data.essalud || false,
    eps: data.eps || false,
    otro1: data.otro1 || false,
    scrt: data.scrt || false,
    otro2: data.otro2 || false,
    // Datos adicionales para header
    numeroFicha: String(data.norden),
    sede: data.sede || data.nombreSede,
    direccionPaciente: String(data.direccionPaciente),
    departamento: data.departamentoPaciente,
    provincia: data.provinciaPaciente,
    distrito: data.distritoPaciente,
    // Datos de color
    color: data.color,
    codigoColor: data.codigoColor,
    textoColor: data.textoColor,
    // Nuevos campos agregados
    gradoEstudios: data.gradoEstudios || '',
    mineralesExplotados: data.mineralesExplotados || '',
    reubicacion: data.reubicacion || '',
    explotacion: data.explotacion || '',
    alturaLabor: data.alturaLabor || '',
    // Campos para antecedentes ocupacionales
    antecedentesPersonales: data.antecedentesPersonales || '',
    antecedentesFamiliares: data.antecedentesFamiliares || '',
    tetano: data.tetano || false,
    hepatitisB: data.hepatitisB || false,
    fiebreAmarilla: data.fiebreAmarilla || false,
    numeroHijosVivos: data.numeroHijosVivos || '',
    numeroHijosMuertos: data.numeroHijosMuertos || '',
    // Hábitos nocivos
    alcohol_si: data.alcohol_si || false,
    alcohol_tipo: data.alcohol_tipo || '',
    alcohol_cantidad_frecuencia: data.alcohol_cantidad_frecuencia || '',
    alcohol_frecuencia: data.alcohol_frecuencia || 'nada', // nada, poco, habitual, excesivo
    tabaco_si: data.tabaco_si || false,
    tabaco_tipo: data.tabaco_tipo || '',
    tabaco_cantidad_frecuencia: data.tabaco_cantidad_frecuencia || '',
    tabaco_frecuencia: data.tabaco_frecuencia || 'nada', // nada, poco, habitual, excesivo
    drogas_si: data.drogas_si || false,
    drogas_tipo: data.drogas_tipo || '',
    drogas_cantidad_frecuencia: data.drogas_cantidad_frecuencia || '',
    drogas_frecuencia: data.drogas_frecuencia || 'nada', // nada, poco, habitual, excesivo
    medicamento_si: data.medicamento_si || false,
    medicamento_tipo: data.medicamento_tipo || '',
    medicamento_cantidad_frecuencia: data.medicamento_cantidad_frecuencia || '',
  };

  // Usar solo datos reales
  const datosFinales = datosReales;

  // Lista de hábitos nocivos
  const habitosNocivos = [
    { name: 'Alcohol', si: datosFinales.alcohol_si, tipo: datosFinales.alcohol_tipo, cantidad: datosFinales.alcohol_cantidad_frecuencia },
    { name: 'Tabaco', si: datosFinales.tabaco_si, tipo: datosFinales.tabaco_tipo, cantidad: datosFinales.tabaco_cantidad_frecuencia },
    { name: 'Drogas', si: datosFinales.drogas_si, tipo: datosFinales.drogas_tipo, cantidad: datosFinales.drogas_cantidad_frecuencia },
    { name: 'Medicamento', si: datosFinales.medicamento_si, tipo: datosFinales.medicamento_tipo, cantidad: datosFinales.medicamento_cantidad_frecuencia }
  ];

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.text("ANEXO 7C", pageW / 2, 32, { align: "center" });
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
  drawHeader(numeroPagina);

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

  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;
    
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

  // Función para dibujar fila con división de dos columnas y títulos
  const dibujarFilaConDosColumnas = (tituloCol1, tituloCol2, yPos, alturaFila = 5) => {
    const tablaInicioX = 5;
    const tablaAncho = 200;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho / 2, yPos, tablaInicioX + tablaAncho / 2, yPos + alturaFila); // División central
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + alturaFila, tablaInicioX + tablaAncho, yPos + alturaFila); // Línea inferior

    // Dibujar títulos de las columnas
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(tituloCol1, tablaInicioX + 2, yPos + 3.5);
    doc.text(tituloCol2, tablaInicioX + tablaAncho / 2 + 2, yPos + 3.5);

    return yPos + alturaFila; // Retorna la nueva posición Y
  };

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 35.5;
  const filaAltura = 5;

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

  // Fila: Estado Civil, Grado de Estudios (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Minerales explotados o procesados, Reubicación (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Explotación, Altura de la labor (MSNM) (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 35.5 + filaAltura + 2.5; // Ajustar para el header

  // Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Ajustar ancho para la nueva división (hasta x = tablaInicioX + 140)
  doc.text(datosFinales.apellidosNombres || "", tablaInicioX + 35, yTexto + 1);

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
  doc.text(datosFinales.direccionPaciente || "", tablaInicioX + 25, yTexto + 1);
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
  doc.text(datosFinales.empresa || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contrata || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Estado Civil, Grado de Estudios
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Estado Civil:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.estadoCivil || "", tablaInicioX + 25, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Grado de Estudios:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.gradoEstudios || "", tablaInicioX + 118, yTexto + 1);
  yTexto += filaAltura;

  // Minerales explotados o procesados, Reubicación
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Minerales explotados o procesados:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.mineralesExplotados || "", tablaInicioX + 35, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Reubicación:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.reubicacion || "", tablaInicioX + 115, yTexto + 1);
  yTexto += filaAltura;

  // Explotación, Altura de la labor (MSNM)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Explotación:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.explotacion || "", tablaInicioX + 25, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Altura de la labor (MSNM):", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.alturaLabor || "", tablaInicioX + 125, yTexto + 1);
  yTexto += filaAltura;

  // === SECCIÓN DE FACTORES DE RIESGO OCUPACIONALES ===
  yPos = dibujarHeaderSeccion("FACTORES DE RIESGO OCUPACIONALES", yPos, filaAltura);

  // Calcular divisiones para 8 columnas (4 factores + 4 espacios para X)
  const colWidth = tablaAncho / 8; // Ancho de cada columna
  const colPositions = [];
  for (let i = 0; i <= 8; i++) {
    colPositions.push(tablaInicioX + (i * colWidth));
  }

  // Fila 1: Ruido | | Cancerigenos | | temperatura | | carga | |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < 8; i++) {
    doc.line(colPositions[i], yPos, colPositions[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 2: polvo | | mutagenos | | biologicos | | mov. repet. | |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < 8; i++) {
    doc.line(colPositions[i], yPos, colPositions[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 3: vib segmentario | | solventes | | posturas | | PVD | |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < 8; i++) {
    doc.line(colPositions[i], yPos, colPositions[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 4: vib total | | metales | | turno | | otros | |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 1; i < 8; i++) {
    doc.line(colPositions[i], yPos, colPositions[i], yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE FACTORES DE RIESGO ===
  let yTextoFactores = yPos - (4 * filaAltura) + 2.5;

  // Fila 1: Ruido, Cancerigenos, temperatura, carga
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Ruido", colPositions[0] + 2, yTextoFactores + 1);
  doc.text("Cancerigenos", colPositions[2] + 2, yTextoFactores + 1);
  doc.text("temperatura", colPositions[4] + 2, yTextoFactores + 1);
  doc.text("carga", colPositions[6] + 2, yTextoFactores + 1);
  yTextoFactores += filaAltura;

  // Fila 2: polvo, mutagenos, biologicos, mov. repet.
  doc.text("polvo", colPositions[0] + 2, yTextoFactores + 1);
  doc.text("mutagenos", colPositions[2] + 2, yTextoFactores + 1);
  doc.text("biologicos", colPositions[4] + 2, yTextoFactores + 1);
  doc.text("mov. repet.", colPositions[6] + 2, yTextoFactores + 1);
  yTextoFactores += filaAltura;

  // Fila 3: vib segmentario, solventes, posturas, PVD
  doc.text("vib segmentario", colPositions[0] + 2, yTextoFactores + 1);
  doc.text("solventes", colPositions[2] + 2, yTextoFactores + 1);
  doc.text("posturas", colPositions[4] + 2, yTextoFactores + 1);
  doc.text("PVD", colPositions[6] + 2, yTextoFactores + 1);
  yTextoFactores += filaAltura;

  // Fila 4: vib total, metales, turno, otros
  doc.text("vib total", colPositions[0] + 2, yTextoFactores + 1);
  doc.text("metales", colPositions[2] + 2, yTextoFactores + 1);
  doc.text("turno", colPositions[4] + 2, yTextoFactores + 1);
  doc.text("otros", colPositions[6] + 2, yTextoFactores + 1);
  yTextoFactores += filaAltura;

  // === SECCIÓN 2: ANTECEDENTES OCUPACIONALES ===
  yPos = dibujarHeaderSeccion("2. ANTECEDENTES OCUPACIONALES", yPos, filaAltura);

  // Fila: Antecedentes personales (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Antecedentes familiares (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Inmunizaciones | Tetano | X | Hepatitis-B | X | Fiebre amarilla | X |
  const colInmunizacionWidth = 40;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura); // División después de "Inmunizaciones"
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura); // División después de Tetano
  doc.line(tablaInicioX + 130, yPos, tablaInicioX + 130, yPos + filaAltura); // División después de Hepatitis-B
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila: Número de hijos | Vivos: {data} | Muertos: {data} |
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura); // División después de "Número de hijos"
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura); // División después de "Vivos"
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA SECCIÓN ANTECEDENTES OCUPACIONALES ===
  let yTextoAntecedentes = yPos - (4 * filaAltura) + 2.5; // Ajustar para el header

  // Antecedentes personales
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Antecedentes personales:", tablaInicioX + 2, yTextoAntecedentes + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.antecedentesPersonales || "", tablaInicioX + 35, yTextoAntecedentes + 1);
  yTextoAntecedentes += filaAltura;

  // Antecedentes familiares
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Antecedentes familiares:", tablaInicioX + 2, yTextoAntecedentes + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.antecedentesFamiliares || "", tablaInicioX + 35, yTextoAntecedentes + 1);
  yTextoAntecedentes += filaAltura;

  // Inmunizaciones
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Inmunizaciones:", tablaInicioX + 2, yTextoAntecedentes + 1);

  // Tetano
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Tetano:", tablaInicioX + 52, yTextoAntecedentes + 1);
  if (datosFinales.tetano) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 75, yTextoAntecedentes + 1);
  }

  // Hepatitis-B
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Hepatitis-B:", tablaInicioX + 92, yTextoAntecedentes + 1);
  if (datosFinales.hepatitisB) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 115, yTextoAntecedentes + 1);
  }

  // Fiebre amarilla
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Fiebre amarilla:", tablaInicioX + 132, yTextoAntecedentes + 1);
  if (datosFinales.fiebreAmarilla) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("X", tablaInicioX + 155, yTextoAntecedentes + 1);
  }
  yTextoAntecedentes += filaAltura;

  // Número de hijos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Número de hijos:", tablaInicioX + 2, yTextoAntecedentes + 1);

  // Vivos
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Vivos:", tablaInicioX + 52, yTextoAntecedentes + 1);
  doc.text(datosFinales.numeroHijosVivos || "", tablaInicioX + 65, yTextoAntecedentes + 1);

  // Muertos
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Muertos:", tablaInicioX + 122, yTextoAntecedentes + 1);
  doc.text(datosFinales.numeroHijosMuertos || "", tablaInicioX + 135, yTextoAntecedentes + 1);
  yTextoAntecedentes += filaAltura;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });

  // === IMPRIMIR ===
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