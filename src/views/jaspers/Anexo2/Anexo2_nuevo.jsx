import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { convertirGenero } from "../../utils/helpers.js";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function InformePsicologico_Anexo02_Nuevo(data = {}) {
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
    alergias_si: data.alergias_si || false,
    asma_si: data.asma_si || false,
    bronquitis_si: data.bronquitis_si || false,
    quemaduras_si: data.quemaduras_si || false,
    cirugias_si: data.cirugias_si || false,
    tbc_si: data.tbc_si || false,
    its_si: data.its_si || false,
    convulciones_si: data.convulciones_si || false,
    neoplasia_si: data.neoplasia_si || false,
    intoxicaciones_si: data.intoxicaciones_si || false,
    hepatitis_si: data.hepatitis_si || false,
    tifoidea_si: data.tifoidea_si || false,
    hta_si: data.hta_si || false,
    diabetes_si: data.diabetes_si || false,
    otros_si: data.otros_si || false,
    // Hábitos nocivos
    alcohol_si: data.alcohol_si || false,
    alcohol_tipo: data.alcohol_tipo || '',
    alcohol_cantidad_frecuencia: data.alcohol_cantidad_frecuencia || '',
    tabaco_si: data.tabaco_si || false,
    tabaco_tipo: data.tabaco_tipo || '',
    tabaco_cantidad_frecuencia: data.tabaco_cantidad_frecuencia || '',
    drogas_si: data.drogas_si || false,
    drogas_tipo: data.drogas_tipo || '',
    drogas_cantidad_frecuencia: data.drogas_cantidad_frecuencia || '',
    medicamento_si: data.medicamento_si || false,
     medicamento_tipo: data.medicamento_tipo || '',
     medicamento_cantidad_frecuencia: data.medicamento_cantidad_frecuencia || '',
     // Antecedentes familiares
     padre_antecedentes: data.padre_antecedentes || '',
     madre_antecedentes: data.madre_antecedentes || '',
     hermanos_antecedentes: data.hermanos_antecedentes || '',
     esposo_antecedentes: data.esposo_antecedentes || '',
     hijos_vivos: data.hijos_vivos || '',
     numero_hijos: data.numero_hijos || '',
     absentismo_enfermedades: data.absentismo_enfermedades || '',
     // Enfermedades y accidentes
     enfermedad_accidente_1: data.enfermedad_accidente_1 || '',
     asociado_trabajo_1: data.asociado_trabajo_1 || false,
     año_1: data.año_1 || '',
     dias_descanso_1: data.dias_descanso_1 || '',
     enfermedad_accidente_2: data.enfermedad_accidente_2 || '',
     asociado_trabajo_2: data.asociado_trabajo_2 || false,
     año_2: data.año_2 || '',
     dias_descanso_2: data.dias_descanso_2 || '',
     enfermedad_accidente_3: data.enfermedad_accidente_3 || '',
     asociado_trabajo_3: data.asociado_trabajo_3 || false,
     año_3: data.año_3 || '',
     dias_descanso_3: data.dias_descanso_3 || '',
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
  };

  // Usar solo datos reales
  const datosFinales = datosReales;

  // Lista de antecedentes
  const antecedentes = [
    { name: 'Alergias', si: datosFinales.alergias_si },
    { name: 'Asma', si: datosFinales.asma_si },
    { name: 'Bronquitis', si: datosFinales.bronquitis_si },
    { name: 'Quemaduras', si: datosFinales.quemaduras_si },
    { name: 'Cirugias', si: datosFinales.cirugias_si },
    { name: 'TBC', si: datosFinales.tbc_si },
    { name: 'ITS', si: datosFinales.its_si },
    { name: 'Convulciones', si: datosFinales.convulciones_si },
    { name: 'Neoplasia', si: datosFinales.neoplasia_si },
    { name: 'Intoxicaciones', si: datosFinales.intoxicaciones_si },
    { name: 'Hepatitis', si: datosFinales.hepatitis_si },
    { name: 'Tifoidea', si: datosFinales.tifoidea_si },
    { name: 'HTA', si: datosFinales.hta_si },
    { name: 'Diabetes', si: datosFinales.diabetes_si },
    { name: 'Otros', si: datosFinales.otros_si }
  ];

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
      doc.text("ANEXO 02", pageW / 2, 32, { align: "center" });
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
    const tablaInicioX = 10;
    const tablaAncho = 190;
    
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

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 10;
  const tablaAncho = 190;
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

  // Fila: Departamento, Provincia, Distrito (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
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

  // Nueva Fila: Reside en el lugar de trabajo | tiempo de residencia (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Nueva Fila: ESSALUD | X | EPS | X | OTRO | X | SCRT | X | OTRO | X | (5 columnas)
  const colWidth = 38;
  let colX = tablaInicioX;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  for (let i = 0; i < 4; i++) { // 4 divisiones internas para 5 columnas
    colX += colWidth;
    doc.line(colX, yPos, colX, yPos + filaAltura);
  }
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Nueva Fila: Correo electrónico (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Nueva Fila: Estado civil | N° total de hijos | N° Dependientes (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
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

  // Departamento, Provincia, Distrito
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Departamento:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.departamento || "", tablaInicioX + 25, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Provincia:", tablaInicioX + 62, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.provincia || "", tablaInicioX + 80, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Distrito:", tablaInicioX + 122, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.distrito || "", tablaInicioX + 140, yTexto + 1);
  yTexto += filaAltura;

  // Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.direccionPaciente || "", tablaInicioX + 25, yTexto + 1);
  yTexto += filaAltura;

  // Nueva: Reside en el lugar de trabajo | tiempo de residencia
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Reside en el lugar de trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.resideEnLugarTrabajo || "", tablaInicioX + 45, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Tiempo de residencia:", tablaInicioX + 102, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.tiempoResidencia || "", tablaInicioX + 130, yTexto + 1);
  yTexto += filaAltura;

  // Nueva: ESSALUD | X | EPS | X | OTRO | X | SCRT | X | OTRO | X |
  const opcionesSeguro = [
    { label: 'ESSALUD', field: 'essalud' },
    { label: 'EPS', field: 'eps' },
    { label: 'OTRO', field: 'otro1' },
    { label: 'SCRT', field: 'scrt' },
    { label: 'OTRO', field: 'otro2' }
  ];
  let xCol = tablaInicioX;
  doc.setFont("helvetica", "bold").setFontSize(8);
  for (let i = 0; i < opcionesSeguro.length; i++) {
    const opcion = opcionesSeguro[i];
    doc.text(opcion.label + ':', xCol + 2, yTexto + 1);
    // Colocar X si está seleccionado
    if (datosFinales[opcion.field]) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text('X', xCol + 25, yTexto + 3);
      doc.setFont("helvetica", "bold").setFontSize(8);
    }
    xCol += colWidth;
  }
  yTexto += filaAltura;

  // Nueva: Correo electrónico
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Correo electrónico:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.correoElectronico || "", tablaInicioX + 25, yTexto + 1);
  yTexto += filaAltura;

  // Nueva: Estado civil | N° total de hijos | N° Dependientes
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Estado civil:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.estadoCivil || "", tablaInicioX + 25, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("N° total de hijos:", tablaInicioX + 62, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.numTotalHijos || "", tablaInicioX + 85, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("N° Dependientes:", tablaInicioX + 122, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.numDependientes || "", tablaInicioX + 145, yTexto + 1);
  yTexto += filaAltura;

  // === SECCIÓN 2: DATOS DE LA EMPRESA ===
  yPos = dibujarHeaderSeccion("2. DATOS DE LA EMPRESA", yPos, filaAltura);
  yTexto = yPos + 2.5;

  // Fila: Empresa (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.empresa || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Fila: Contratista (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contrata || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // Fila: Actividad Económica (completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido Actividad Económica
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Actividad Económica:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.actividadEconomica || "", tablaInicioX + 25, yTexto + 1);
  yTexto += filaAltura;

  // Fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido Puesto de Trabajo, Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.puestoTrabajo || "", tablaInicioX + 30, yTexto + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.areaTrabajo || "", tablaInicioX + 118, yTexto + 1);
  yTexto += filaAltura;

  // === SECCIÓN 3: ANTECEDENTES PATOLÓGICOS PERSONALES ===
  yPos = dibujarHeaderSeccion("3. ANTECEDENTES PATOLÓGICOS PERSONALES", yPos, filaAltura);

  // Configuración de columnas para la tabla de antecedentes
  const colAnteWidth = 49;
  const colSiNoWidth = 7;
  const groupWidth = 63;
  const verticalLinesAnte = [10, 59, 66, 73, 122, 129, 136, 185, 192, 200];

  // Fila de encabezado de columnas
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // inferior
  verticalLinesAnte.forEach(x => {
    doc.line(x, yPos, x, yPos + filaAltura);
  });

  // Textos de encabezado centrados
  doc.setFont("helvetica", "bold").setFontSize(8);
  let currentX = tablaInicioX;
  for (let g = 0; g < 3; g++) {
    // Centrar "ANTECEDENTE" en la columna de nombre (ancho 49mm, centro en +24.5)
    doc.text("ANTECEDENTE", currentX + 24.5, yPos + 3, { align: "center" });
    // Centrar "SI" en su columna (ancho 7mm, centro en +3.5 desde inicio de columna)
    doc.text("SI", currentX + colAnteWidth + 3.5, yPos + 3, { align: "center" });
    // Centrar "NO" en su columna
    doc.text("NO", currentX + colAnteWidth + colSiNoWidth + 3.5, yPos + 3, { align: "center" });
    currentX += groupWidth;
  }
  yPos += filaAltura;

  // Filas de datos
  const numRows = 5;
  for (let row = 0; row < numRows; row++) {
    const startIdx = row * 3;

    // Líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
    verticalLinesAnte.forEach(x => {
      doc.line(x, yPos, x, yPos + filaAltura);
    });

    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);
    currentX = tablaInicioX;
    for (let g = 0; g < 3; g++) {
      const idx = startIdx + g;
      if (idx < antecedentes.length) {
        const ant = antecedentes[idx];
        doc.text(ant.name, currentX + 1, yPos + 3);
        const xSi = currentX + colAnteWidth + 3.5;
        const xNo = currentX + colAnteWidth + colSiNoWidth + 3.5;
        if (ant.si) {
          doc.setFont("helvetica", "bold").setFontSize(10);
          doc.text('X', xSi, yPos + 3, { align: "center" });
          doc.setFont("helvetica", "normal").setFontSize(8);
        } else {
          doc.setFont("helvetica", "bold").setFontSize(10);
          doc.text('X', xNo, yPos + 3, { align: "center" });
          doc.setFont("helvetica", "normal").setFontSize(8);
        }
      }
      currentX += groupWidth;
    }
    yPos += filaAltura;
  }

  // === FILA CELESTE: HÁBITOS NOCIVOS ===
  // Dibujar fondo celeste
  doc.setFillColor(173, 216, 230); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  
  // Dibujar líneas de la fila celeste
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Texto de la fila celeste
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("HÁBITOS NOCIVOS", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // Configuración de columnas para la tabla de hábitos
  const colHabNameWidth = 60;
  const colSiWidth = 8;
  const colNoWidth = 8;
  const colTipoWidth = 55;
  const colCantWidth = 59;
  const verticalLinesHab = [
    10, // left
    70, // after name
    78, // after Si
    86, // after No
    141, // after Tipo
    200 // right (tablaAncho + 10 = 200)
  ];

  // Fila de encabezado
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  verticalLinesHab.forEach(x => {
    doc.line(x, yPos, x, yPos + filaAltura);
  });

  // Textos de encabezado centrados
  doc.setFont("helvetica", "bold").setFontSize(8);
  // Centrar "HÁBITOS NOCIVOS" en columna name (ancho 60mm, centro 40)
  doc.text("HÁBITOS NOCIVOS", tablaInicioX + 40, yPos + 3, { align: "center" });
  // Centrar "SI"
  doc.text("SI", 74, yPos + 3, { align: "center" });
  // Centrar "NO"
  doc.text("NO", 82, yPos + 3, { align: "center" });
  // Centrar "TIPO" (ancho 55mm, centro 113.5)
  doc.text("TIPO", 113.5, yPos + 3, { align: "center" });
  // Centrar "CANTIDAD - FRECUENCIA" (ancho 59mm, centro 170.5)
  doc.text("CANTIDAD - FRECUENCIA", 170.5, yPos + 3, { align: "center" });
  yPos += filaAltura;

  // Filas de hábitos
  habitosNocivos.forEach((habito) => {
    // Líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
    verticalLinesHab.forEach(x => {
      doc.line(x, yPos, x, yPos + filaAltura);
    });

    // Contenido
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(habito.name, tablaInicioX + 1, yPos + 3);
    const xSi = 74;
    const xNo = 82;
    if (habito.si) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text('X', xSi, yPos + 3, { align: "center" });
    } else {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text('X', xNo, yPos + 3, { align: "center" });
    }
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(habito.tipo || '', 87, yPos + 3);
    doc.text(habito.cantidad || '', 142, yPos + 3);
     yPos += filaAltura;
   });

  // === SECCIÓN 4: ANTECEDENTES PATOLÓGICOS FAMILIARES ===
  yPos = dibujarHeaderSeccion("4. ANTECEDENTES PATOLÓGICOS FAMILIARES", yPos, filaAltura);

  // Primera fila: Padre | Madre | Hermanos
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Segunda fila: Espos(a) | N° de hijos vivos | N° Hijos
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido de la primera fila
  let yTextoFamilia = yPos - (filaAltura * 2) + 2.5;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Padre:", tablaInicioX + 2, yTextoFamilia + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.padre_antecedentes || "", tablaInicioX + 15, yTextoFamilia + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Madre:", tablaInicioX + 62, yTextoFamilia + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.madre_antecedentes || "", tablaInicioX + 75, yTextoFamilia + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hermanos:", tablaInicioX + 122, yTextoFamilia + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.hermanos_antecedentes || "", tablaInicioX + 135, yTextoFamilia + 1);
  yTextoFamilia += filaAltura;

  // Contenido de la segunda fila
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Espos(a):", tablaInicioX + 2, yTextoFamilia + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.esposo_antecedentes || "", tablaInicioX + 20, yTextoFamilia + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("N° de hijos vivos:", tablaInicioX + 62, yTextoFamilia + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.hijos_vivos || "", tablaInicioX + 90, yTextoFamilia + 1);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("N° Hijos:", tablaInicioX + 122, yTextoFamilia + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.numero_hijos || "", tablaInicioX + 140, yTextoFamilia + 1);
  yTextoFamilia += filaAltura;

  // === FILA CELESTE: ABSENTISMO ===
  // Dibujar fondo celeste
  doc.setFillColor(173, 216, 230); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  
  // Dibujar líneas de la fila celeste
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Texto de la fila celeste
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Absentismo: Enfermedades y Accidentes (Asociados a trabajos o no)", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.absentismo_enfermedades || "", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // === TABLA DE ENFERMEDADES Y ACCIDENTES ===
  // Configuración de columnas ajustada para span
  const verticalLinesEnfermedad = [10, 90, 110, 130, 155, 200];

  // Header de la tabla (dos filas de altura)
  let yHeader1 = yPos;
  doc.line(10, yHeader1, 200, yHeader1); // top
  const verticalsHeader1 = [10, 90, 130, 155, 200];
  verticalsHeader1.forEach(x => doc.line(x, yHeader1, x, yHeader1 + filaAltura));

  let yHeader2 = yPos + filaAltura;
  // Línea horizontal solo debajo de "Asociado al Trabajo" (desde columna 90 hasta 130)
  doc.line(90, yHeader2, 130, yHeader2); // middle - solo para "Asociado al Trabajo"
  const verticalsHeader2 = [10, 90, 110, 130, 155, 200];
  verticalsHeader2.forEach(x => doc.line(x, yHeader2, x, yHeader2 + filaAltura));

  let yHeaderBottom = yPos + 2 * filaAltura;
  doc.line(10, yHeaderBottom, 200, yHeaderBottom); // bottom

  // Textos del header - primera fila
  doc.setFont("helvetica", "bold").setFontSize(8);
  // Centrar "Asociado al Trabajo" en su columna (ancho 20mm, centro en 110)
  doc.text("Asociado al Trabajo", 110, yHeader1 + 3, { align: "center" });
  // Centrar "Año" en su columna (ancho 25mm, centro en 142.5) - misma altura que ENFERMEDAD. ACCIDENTE
  doc.text("Año", 142.5, yHeader2 + 1, { align: "center" });
  // Centrar "Días de descanso" en su columna (ancho 45mm, centro en 177.5) - misma altura que ENFERMEDAD. ACCIDENTE
  doc.text("Días de descanso", 177.5, yHeader2 + 1, { align: "center" });

  // Textos del header - segunda fila
  // Centrar "ENFERMEDAD. ACCIDENTE" en su columna (ancho 80mm, centro en 50) y justo encima de la línea horizontal
  doc.text("ENFERMEDAD. ACCIDENTE", 50, yHeader2 + 1, { align: "center" });
  // Centrar "SI" en su columna (ancho 10mm, centro en 100) y justo encima de la línea
  doc.text("SI", 100, yHeader2 + 3, { align: "center" });
  // Centrar "NO" en su columna (ancho 10mm, centro en 120) y justo encima de la línea
  doc.text("NO", 120, yHeader2 + 3, { align: "center" });

  yPos += 2 * filaAltura;

  // Filas de datos (3 filas)
  const enfermedadesAccidentes = [
    {
      enfermedad: datosFinales.enfermedad_accidente_1 || '',
      asociado: datosFinales.asociado_trabajo_1 || false,
      año: datosFinales.año_1 || '',
      dias: datosFinales.dias_descanso_1 || ''
    },
    {
      enfermedad: datosFinales.enfermedad_accidente_2 || '',
      asociado: datosFinales.asociado_trabajo_2 || false,
      año: datosFinales.año_2 || '',
      dias: datosFinales.dias_descanso_2 || ''
    },
    {
      enfermedad: datosFinales.enfermedad_accidente_3 || '',
      asociado: datosFinales.asociado_trabajo_3 || false,
      año: datosFinales.año_3 || '',
      dias: datosFinales.dias_descanso_3 || ''
    }
  ];

  enfermedadesAccidentes.forEach((item) => {
    // Líneas de la fila
    doc.line(10, yPos, 200, yPos);
    doc.line(10, yPos + filaAltura, 200, yPos + filaAltura);
    verticalLinesEnfermedad.forEach(x => {
      doc.line(x, yPos, x, yPos + filaAltura);
    });

    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(item.enfermedad, 12, yPos + 2.5, 78);
    
    // Marcar SI o NO según el valor
    if (item.asociado) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text('X', 100, yPos + 3, { align: "center" });
    } else {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text('X', 120, yPos + 3, { align: "center" });
    }
    
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(item.año, 142.5, yPos + 3, { align: "center" });
    doc.text(item.dias, 177.5, yPos + 3, { align: "center" });
    yPos += filaAltura;
  });

  // === SECCIÓN 5: EVALUACIÓN MÉDICA ===
  yPos = dibujarHeaderSeccion("5. EVALUACIÓN MÉDICA", yPos, filaAltura);

  // === FILA CELESTE: ANAMNESIS ===
  // Dibujar fondo celeste
  doc.setFillColor(173, 216, 230); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  
  // Dibujar líneas de la fila celeste
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Texto de la fila celeste
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("ANAMNESIS", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // === FILA DE DATOS CRECIENTES ===
  // Esta fila se expandirá según los datos disponibles
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Contenido de datos crecientes (se puede expandir dinámicamente)
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Datos de anamnesis del paciente...", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // === FILA CELESTE: EXAMEN CLÍNICO ===
  // Dibujar fondo celeste
  doc.setFillColor(173, 216, 230); // Color celeste claro
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  
  // Dibujar líneas de la fila celeste
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Texto de la fila celeste
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("EXAMEN CLÍNICO", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  // === FILA DE VITALES (TALLA, PESO, IMC, etc.) ===
  // Configuración de columnas para vitales
  const colVitalWidth = 23.75; // 190mm / 8 columnas
  const verticalLinesVitales = [10, 33.75, 57.5, 81.25, 105, 128.75, 152.5, 176.25, 200];

  // Dibujar líneas de la fila de vitales
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  verticalLinesVitales.forEach(x => {
    doc.line(x, yPos, x, yPos + filaAltura);
  });

  // Contenido de vitales
  doc.setFont("helvetica", "bold").setFontSize(8);
  const vitales = [
    { label: "Talla:", value: "1.90" },
    { label: "Peso(Kg):", value: "90" },
    { label: "IMC:", value: "24.93" },
    { label: "P.:", value: "90" },
    { label: "F.Resp.:", value: "2" },
    { label: "F.Card.:", value: "90" },
    { label: "PA:", value: "120/120" },
    { label: "Temp:", value: "36" }
  ];

  let xVital = tablaInicioX;
  vitales.forEach((vital, index) => {
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(vital.label, xVital + 1, yPos + 3.5);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.setTextColor(0, 150, 150); // Color teal/azul-verde
    doc.text(vital.value, xVital + 1, yPos + 3.5);
    doc.setTextColor(0, 0, 0); // Volver al color negro
    xVital += colVitalWidth;
  });
  yPos += filaAltura;

  // === FILA OTROS DATOS ===
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Contenido de otros datos
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Otros datos del examen clínico...", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

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