import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { getSign } from "../../utils/helpers";
import { normalizeList } from "../../utils/listUtils";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function Anexo16ABoro_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Datos de prueba por defecto
  const datosPrueba = {
    apellidosNombres: "CASTILLO PLASENCIA HADY KATHERINE",
    fechaExamen: "04/11/2024",
    sexo: "F",
    documentoIdentidad: "72384273",
    edad: "31 años",
    areaTrabajo: "MINERÍA",
    puestoTrabajo: "DAD",
    empresa: "MINERA BOROO MISQUICHILCA S.A.",
    contrata: "CONTRATA EJEMPLO S.A.C.",
    vitalSigns: {
      fc: "64",
      fr: "19",
      pa: "120/60",
      satO2: "99",
      imc: "23.48"
    },
    condiciones: {
      cirugiaMayor: false,
      desordenesCoagulacion: false,
      diabetes: false,
      hipertension: false,
      embarazo: false,
      problemasNeurologicos: false,
      infeccionesRecientes: true,
      obesidadMorbida: false,
      problemasCardiacos: false,
      problemasRespiratorios: false,
      problemasOftalmologicos: true,
      problemasDigestivos: false,
      apneaSueño: false,
      alergias: false,
      otraCondicion: false
    },
    medicacionActual: "Paracetamol 500mg cada 8 horas",
    fur: "15/08/2024", // Fecha de última regla
    observaciones: [
      "USO DE LENTES CORRECTORES",
      "ALERGIA A PENICILINA",
      "SE RECOMIENDA SEGUIMIENTO MÉDICO CADA 6 MESES"
    ],
    medico: {
      nombres: "SANCHEZ QUIÑONES JOSE ALEJANDRO",
      direccion: "Av. Nicolas de Piérola N°1106 Urb. San Fernando",
      cmp: "80135",
      fecha: "04/11/2024"
    },
    // Datos de color
    color: 1,
    codigoColor: "#008f39",
    textoColor: "F",
    // Datos adicionales para header
    numeroFicha: "99164",
    sede: "Trujillo-Pierola"
  };
  const datosReales = {
    apellidosNombres: String((data.apellidos_apellidos_pa || "") + " " + (data.nombres_nombres_pa || "")),
    fechaExamen: formatearFechaCorta(data.fechaAnexo16a_fecha_anexo || ""),
    sexo: data.sexo_sexo_pa || "",
    documentoIdentidad: String(data.dni_cod_pa || ""),
    edad: `${String(data.edad_edad ?? "")} AÑOS`,
    areaTrabajo: data.area_area_o || "",
    puestoTrabajo: data.cargo_cargo_de || "",
    empresa: data.empresa_razon_empresa || "",
    contrata: data.contrata_razon_contrata || "",
    apto: data.aptoAnexo16a_apto !== undefined ? data.aptoAnexo16a_apto : true,
    vitalSigns: {
      fc: String(data.frecuenciaCardiacaTriaje_f_cardiaca || ""),
      fr: String(data.frecuenciaRespiratoriaTriaje_f_respiratoria || ""),
      pa: String(data.sistolicaTriaje_sistolica || "") + "/" + String(data.diastolicaTriaje_diastolica || ""), //revisar - combinación de sistólica y diastólica
      satO2: String(data.saturacionOxigenoTriaje_sat_02 || ""),
      imc: String(data.imcTriaje_imc || "")
    },
    condiciones: {
      cirugiaMayor: data.cirujiaMayorRecienteSiAnexo16a_si1 === true,
      desordenesCoagulacion: data.desordenCoagulacionSiAnexo16a_si2 === true,
      diabetes: data.diabetesMellitusSiAnexo16a_si3 === true,
      hipertension: data.hipertensionArterialSiAnexo16a_si4 === true,
      embarazo: data.embarazoSiAnexo16a_si5 === true,
      problemasNeurologicos: data.problemaNeurologicoSiAnexo16a_si6 === true,
      infeccionesRecientes: data.infeccionRecienteSiAnexo16a_si7 === true,
      obesidadMorbida: data.obesidadMorbididadSiAnexo16a_si8 === true,
      problemasCardiacos: data.problemasCardiacoSiAnexo16a_si9 === true,
      problemasRespiratorios: data.problemasRespiratoriosSiAnexo16a_si10 === true,
      problemasOftalmologicos: data.problemasOftalmologicosSiAnexo16a_si11 === true,
      problemasDigestivos: data.problemasDigestivosSiAnexo16a_si12 === true,
      apneaSueño: data.apneaDelSuenoSiAnexo16a_si13 === true,
      alergias: data.alergiasSiAnexo16a_si15 === true,
      otraCondicion: data.otraCondicionMedicaSiAnexo16a_si14 === true
    },
    medicacionActual: data.medicacionActualAnexo16a_m_actual || "",
    fur: data.furDescripcionAnexo16a_txtfur || "",
    observaciones: data.observacionesAnexo16a_observaciones || "",
    medico: {
      nombres: String((data.apellidoUsuario_apellido_user || "") + " " + (data.nombreUsuario_nombre_user || "")),
      direccion: data.direccionSede || "",
      cmp: data.cmpUsuario_cmp_user || "",
      fecha: formatearFechaCorta(data.fechaAnexo16a_fecha_anexo || "")
    },
    laboratorio: {
      hemoglobina: String(data.hemoglobinaLaboratorioClinico_txthemoglobina ?? "") + " g/dl",
      hematocrito: String(data.hematocritoLaboratorioClinico_txthematocrito ?? "") + "%",
      glucosa: String(data.glucosaLaboratorioClinico_txtglucosabio ?? "") + " mg/dl",
      ekg: String(data.hallazgosInformeElectroCardiograma_hallazgo ?? "N/A")
    },

    // Datos de color
    color: data.color || data.informacionSede?.color || 1,
    codigoColor: data.codigoColor || data.informacionSede?.codigoColor || "#008f39",
    textoColor: data.textoColor || data.informacionSede?.textoColor || "F",
    // Datos adicionales para header
    numeroFicha: String(data.norden_n_orden || ""),
    sede: data.nombreSede || ""
  };

  // Usar datos reales si existen, sino usar datos de prueba
  const datosFinales = data && data.norden_n_orden ? datosReales : datosPrueba;

  // === HEADER ===
  // Logo y membrete
  CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

  // Título principal
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("ANEXO N° 16 - A", pageW / 2, 30, { align: "center" });

  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("EVALUACION MÉDICA PARA ASCENSO A GRANDES ALTITUDES", pageW / 2, 34, { align: "center" });
  doc.text("(mayor de 2,500 m.s.n.m.)", pageW / 2, 38, { align: "center" });

  // Número de Ficha y Página
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Nro de ficha: ", pageW - 53, 15);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(datosFinales.numeroFicha, pageW - 33, 15);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Sede: " + datosFinales.sede, pageW - 53, 20);
  doc.text("Pag. 01", pageW - 53, 25);

  // === BLOQUE DE COLOR ===
  drawColorBox(doc, {
    color: datosFinales.codigoColor,           // Color de la letra y línea
    text: datosFinales.textoColor,             // Letra a mostrar (ej: "F")
    x: pageW - 30,                             // Posición X (30mm del borde derecho)
    y: 10,                                     // Posición Y (alineado con header)
    size: 22,                                  // Tamaño del área total (22x22mm)
    showLine: true,                            // Mostrar línea de color
    fontSize: 30,                              // Tamaño de la letra
    textPosition: 0.9                          // Posición de la letra (0.9 = cerca de la línea)
  });

  // === FECHA DE EXAMEN ===
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Fecha Examen: " + datosFinales.fechaExamen, 10, 40);

  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    const fontSize = doc.internal.getFontSize();
    const palabras = texto.split(' ');
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
    }
    
    return yPos;
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
    doc.text(titulo, tablaInicioX + 2, yPos + 3);
    
    return yPos + alturaHeader;
  };

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 10;
  const tablaAncho = 190;
  let yPos = 45;
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

  // Segunda fila: DNI, Edad, Sexo (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Tercera fila: Área de Trabajo, Puesto de Trabajo (2 columnas)
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
  let yTexto = 45 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres
  yTexto += filaAltura;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 35, yTexto + 2, tablaAncho - 60);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 2);

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Edad:", tablaInicioX + 62, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.edad, tablaInicioX + 75, yTexto + 2);

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Sexo:", tablaInicioX + 122, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.sexo, tablaInicioX + 135, yTexto + 2);
  yTexto += filaAltura;

  // Tercera fila: Área de Trabajo, Puesto de Trabajo
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo, tablaInicioX + 27, yTexto + 2, 50);

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Puesto de Trabajo:", tablaInicioX + 92, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo, tablaInicioX + 122, yTexto + 2, 65);
  yTexto += filaAltura;

  // Cuarta fila: Empresa
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 20, yTexto + 2, tablaAncho - 25);
  yTexto += filaAltura;

  // Quinta fila: Contrata
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Contrata:", tablaInicioX + 2, yTexto + 2);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.contrata, tablaInicioX + 20, yTexto + 2, tablaAncho - 30);
  yTexto += filaAltura;

  // === SECCIÓN 2: FUNCIONES VITALES ===
  // Header de funciones vitales (solo título)
  yPos = dibujarHeaderSeccion("2. FUNCIONES VITALES", yPos, filaAltura);

  // Fila de funciones vitales con 5 columnas (datos van aquí)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 38, yPos, tablaInicioX + 38, yPos + filaAltura); // Primera división
  doc.line(tablaInicioX + 76, yPos, tablaInicioX + 76, yPos + filaAltura); // Segunda división
  doc.line(tablaInicioX + 114, yPos, tablaInicioX + 114, yPos + filaAltura); // Tercera división
  doc.line(tablaInicioX + 152, yPos, tablaInicioX + 152, yPos + filaAltura); // Cuarta división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior

  // === CONTENIDO DE FUNCIONES VITALES ===
  // FC (Frecuencia Cardíaca)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("FC:", tablaInicioX + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.vitalSigns.fc + " x min", tablaInicioX + 8, yPos + 3);

  // FR (Frecuencia Respiratoria)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("FR:", tablaInicioX + 40, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.vitalSigns.fr + " x min", tablaInicioX + 46, yPos + 3);

  // PA (Presión Arterial)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("PA:", tablaInicioX + 78, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.vitalSigns.pa + " mmHg", tablaInicioX + 84, yPos + 3);

  // Sat. O2 (Saturación de Oxígeno)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Sat. O2:", tablaInicioX + 116, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.vitalSigns.satO2 + " %", tablaInicioX + 130, yPos + 3);

  // IMC (Índice de Masa Corporal)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("IMC:", tablaInicioX + 154, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.vitalSigns.imc + " kg/m2", tablaInicioX + 162, yPos + 3);

  yPos += filaAltura;

  // === SECCIÓN 3: CONDICIONES MÉDICAS ===
  // Función para dibujar header de condiciones médicas con columnas SI/NO
  const dibujarHeaderCondiciones = (titulo, yPos, alturaHeader = 5) => {
    const leftMargin = 10;
    const colTexto = 170;
    const colNo = 10;
    const colSi = 10;
    
    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar fondo gris más oscuro
    doc.setFillColor(160, 160, 160);
    doc.rect(leftMargin, yPos, colTexto + colNo + colSi, alturaHeader, 'F');
    
    // Dibujar líneas del header
    doc.line(leftMargin, yPos, leftMargin + colTexto + colNo + colSi, yPos); // Superior
    doc.line(leftMargin, yPos + alturaHeader, leftMargin + colTexto + colNo + colSi, yPos + alturaHeader); // Inferior
    doc.line(leftMargin, yPos, leftMargin, yPos + alturaHeader); // Izquierda
    doc.line(leftMargin + colTexto, yPos, leftMargin + colTexto, yPos + alturaHeader); // División texto/opciones
    doc.line(leftMargin + colTexto + colNo, yPos, leftMargin + colTexto + colNo, yPos + alturaHeader); // División NO/SI
    doc.line(leftMargin + colTexto + colNo + colSi, yPos, leftMargin + colTexto + colNo + colSi, yPos + alturaHeader); // Derecha
    
    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(titulo, leftMargin + 2, yPos + 3);
    doc.text("SI", leftMargin + colTexto + colNo/2, yPos + 3, { align: "center" });
    doc.text("NO", leftMargin + colTexto + colNo + colSi/2, yPos + 3, { align: "center" });
    
    return yPos + alturaHeader;
  };

  // Header de condiciones médicas
  yPos = dibujarHeaderCondiciones("3. El / La presenta o ha presentado en los últimos 6 meses:", yPos, 5);

  // Lista de condiciones médicas
  const condiciones = [
    { texto: "Cirugía mayor reciente", campo: "cirugiaMayor" },
    { texto: "Desórdenes de la coagulación, trombosis, etc.", campo: "desordenesCoagulacion" },
    { texto: "Diabetes Mellitus", campo: "diabetes" },
    { texto: "Hipertensión Arterial", campo: "hipertension" },
    { texto: "Embarazo", campo: "embarazo" },
    { texto: "Problemas neurológicos: epilepsia, vértigo, etc.", campo: "problemasNeurologicos" },
    { texto: "Infecciones recientes (especialmente oídos, nariz, garganta)", campo: "infeccionesRecientes" },
    { texto: "Obesidad Mórbida (IMC mayor a 35 m/kg2)", campo: "obesidadMorbida" },
    { texto: "Problemas Cardíacos: marcapasos, coronariopatía, etc.", campo: "problemasCardiacos" },
    { texto: "Problemas Respiratorios: asma, EPOC, etc.", campo: "problemasRespiratorios" },
    { texto: "Problemas Oftalmológicos: retinopatía, glaucoma, etc.", campo: "problemasOftalmologicos" },
    { texto: "Problemas Digestivos: úlcera péptica, hepatitis, etc.", campo: "problemasDigestivos" },
    { texto: "Apnea del Sueño", campo: "apneaSueño" },
    { texto: "Alergias", campo: "alergias" },
    { texto: "Otra condición médica importante", campo: "otraCondicion" }
  ];

  const leftMargin = 10;
  const colTexto = 170;
  const colNo = 10;
  const colSi = 10;

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.setLineWidth(0.2);
  
  condiciones.forEach((condicion) => {
    let textoDividido = doc.splitTextToSize(condicion.texto, colTexto - 4);
    let altura = textoDividido.length * 3 + 2;

    // Líneas de la fila
    doc.line(leftMargin, yPos, leftMargin + colTexto + colNo + colSi, yPos); // Superior
    doc.line(leftMargin, yPos + altura, leftMargin + colTexto + colNo + colSi, yPos + altura); // Inferior
    doc.line(leftMargin, yPos, leftMargin, yPos + altura); // Izquierda
    doc.line(leftMargin + colTexto, yPos, leftMargin + colTexto, yPos + altura); // División texto/opciones
    doc.line(leftMargin + colTexto + colNo, yPos, leftMargin + colTexto + colNo, yPos + altura); // División NO/SI
    doc.line(leftMargin + colTexto + colNo + colSi, yPos, leftMargin + colTexto + colNo + colSi, yPos + altura); // Derecha

    // Texto
    doc.setTextColor(0, 0, 0);
    doc.text(textoDividido, leftMargin + 2, yPos + 3);

    // NO
    if (datosFinales.condiciones[condicion.campo] === false) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", leftMargin + colTexto + colNo + colSi/2, yPos + altura/2 + 1, { align: "center" });
      doc.setFont("helvetica", "normal").setFontSize(9);
    }

    // SI
    if (datosFinales.condiciones[condicion.campo] === true) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", leftMargin + colTexto + colNo/2, yPos + altura/2 + 1, { align: "center" });
      doc.setFont("helvetica", "normal").setFontSize(9);
    }

    // Si es embarazo y está marcado como SI, mostrar campo FUR en la misma línea
    if (condicion.campo === "embarazo" && datosFinales.condiciones[condicion.campo]) {
      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.text("FUR:", leftMargin + colTexto + colNo + colSi + 5, yPos + 3);
      doc.text(datosFinales.fur || "00/00/0000", leftMargin + colTexto + colNo + colSi + 15, yPos + 3);
    }

    yPos += altura;
  });

  // === USO DE MEDICACIÓN ===
  // Header de medicación
  yPos = dibujarHeaderSeccion("Uso de medicación Actual:", yPos, filaAltura);

  // Calcular altura dinámica para la medicación
  const calcularAlturaMedicacion = (texto, anchoMaximo, fontSize) => {
    const palabras = texto.split(' ');
    let lineaActual = '';
    let lineas = 1;
    
    palabras.forEach(palabra => {
      const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);
      
      if (anchoTexto <= anchoMaximo) {
        lineaActual = textoPrueba;
      } else {
        if (lineaActual) {
          lineas++;
          lineaActual = palabra;
        } else {
          lineas++;
        }
      }
    });
    
    // Altura mínima de 5mm, altura máxima de 20mm (5 líneas)
    return Math.max(lineas * fontSize * 0.35 + 1.5, 5);
  };

  const textoMedicacion = datosFinales.medicacionActual || "Sin medicación actual";
  const anchoMaximoMedicacion = tablaAncho - 4;
  const alturaFilaMedicacion = calcularAlturaMedicacion(textoMedicacion, anchoMaximoMedicacion, 8);

  // Fila de medicación con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaMedicacion); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaMedicacion); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaMedicacion, tablaInicioX + tablaAncho, yPos + alturaFilaMedicacion); // Línea inferior

  // Contenido de medicación
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(textoMedicacion, tablaInicioX + 2, yPos + 3, anchoMaximoMedicacion);

  yPos += alturaFilaMedicacion;

  // === SECCIÓN 4: LABORATORIO ===
  // Header de laboratorio
  yPos = dibujarHeaderSeccion("4. LABORATORIO", yPos, filaAltura);

  // Fila de laboratorio con 4 columnas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + 47.5, yPos, tablaInicioX + 47.5, yPos + filaAltura); // Primera división
  doc.line(tablaInicioX + 95, yPos, tablaInicioX + 95, yPos + filaAltura); // Segunda división
  doc.line(tablaInicioX + 142.5, yPos, tablaInicioX + 142.5, yPos + filaAltura); // Tercera división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior

  // === CONTENIDO DE LABORATORIO ===
  // Verificar si existe laboratorio, sino usar valores por defecto
  const laboratorio = datosFinales.laboratorio || {
    hemoglobina: "N/A",
    hematocrito: "N/A", 
    glucosa: "N/A",
    ekg: "N/A"
  };

  // Hemoglobina
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Hemoglobina:", tablaInicioX + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(laboratorio.hemoglobina, tablaInicioX + 25, yPos + 3);

  // Hematocrito
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Hematocrito:", tablaInicioX + 49.5, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(laboratorio.hematocrito, tablaInicioX + 72.5, yPos + 3);

  // Glucosa
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Glucosa:", tablaInicioX + 97, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(laboratorio.glucosa, tablaInicioX + 115, yPos + 3);

  // EKG
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("EKG (>= 45años):", tablaInicioX + 144.5, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(laboratorio.ekg, tablaInicioX + 172, yPos + 3);

  yPos += filaAltura;

  // === SECCIÓN 5: OBSERVACIONES Y RECOMENDACIONES ===
  // Header de observaciones
  yPos = dibujarHeaderSeccion("5. OBSERVACIONES Y RECOMENDACIONES", yPos, filaAltura);


     // Procesar observaciones usando normalizeList
     let observacionesLista = normalizeList(datosFinales.observaciones);
     
     // Si no hay observaciones, usar observación por defecto
     if (observacionesLista.length === 0) {
       observacionesLista = ["Sin observaciones adicionales"];
     }
     
     // Crear texto con formato de lista (cada item en una línea con guión)
     const observacionesTexto = observacionesLista.map(item => `${item}`).join('\n');

     // Calcular altura dinámica para la lista de observaciones
     // Contar las líneas del texto (cada observación es una línea)
     const lineasObservaciones = observacionesLista.length;
     const alturaPorLinea = 3.5; // Altura por línea en mm
     const alturaFilaObservaciones = Math.max(lineasObservaciones * alturaPorLinea + 2, 8); // Mínimo 8mm

     // Dibujar la fila de observaciones con altura dinámica
     doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaObservaciones); // Línea izquierda
     doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaObservaciones); // Línea derecha
     doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
     doc.line(tablaInicioX, yPos + alturaFilaObservaciones, tablaInicioX + tablaAncho, yPos + alturaFilaObservaciones); // Línea inferior

     // Dibujar el texto de las observaciones en formato de lista
     doc.setFont("helvetica", "normal").setFontSize(8);
     dibujarTextoConSaltoLinea(observacionesTexto, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
     
     yPos += alturaFilaObservaciones;

  // === CERTIFICACIÓN MÉDICA CON FONDO NARANJA ===
  const estadoApto = datosFinales.apto !== undefined ? datosFinales.apto : false;
  const estadoTexto = estadoApto ? "APTO" : "NO APTO";

  // Texto de certificación
  const textoCertificacion = "Conforme a la declaración del / de la paciente y las pruebas complementarias, certifico que se encuentra  ";
  const textoDespues = " para ascender a grandes altitudes (mayor a 2,500 m.s.n.m); sin embargo, no aseguro el desempeño durante el ascenso durante su permanencia.";

  // Combinar todo el texto
  const textoCompletoCertificacion = `${textoCertificacion}${estadoTexto}${textoDespues}`;
  
  // Calcular altura dinámica para la certificación
  const calcularAlturaCertificacion = (texto, anchoMaximo, fontSize) => {
    const palabras = texto.split(' ');
    let lineaActual = '';
    let lineas = 1;
    
    palabras.forEach(palabra => {
      const textoPrueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);
      
      if (anchoTexto <= anchoMaximo) {
        lineaActual = textoPrueba;
      } else {
        if (lineaActual) {
          lineas++;
          lineaActual = palabra;
        } else {
          lineas++;
        }
      }
    });
    
    // Altura mínima de 8mm, altura máxima de 25mm (6 líneas)
    return Math.max(lineas * fontSize * 0.35 + 1.5, 8);
  };

  const anchoMaximoCertificacion = tablaAncho - 8; // Reducido de 4 a 8 para más margen
  const alturaFilaCertificacion = calcularAlturaCertificacion(textoCompletoCertificacion, anchoMaximoCertificacion, 8);

  // Dibujar fondo naranja para la certificación
  doc.setFillColor(245, 174, 103); // Color naranja
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaCertificacion, 'F');

  // Dibujar líneas de la certificación
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaCertificacion); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaCertificacion); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaCertificacion, tablaInicioX + tablaAncho, yPos + alturaFilaCertificacion); // Línea inferior

  // Dividir el texto en líneas para poder hacer bold solo el estado
  const certificacionLineas = doc.splitTextToSize(textoCompletoCertificacion, anchoMaximoCertificacion);
  let yCertificacion = yPos;

  certificacionLineas.forEach(linea => {
    // Verificar si la línea contiene el estado
    if (linea.includes(estadoTexto)) {
      // Dividir la línea en partes para poder hacer bold solo el estado
      const partes = linea.split(estadoTexto);

      // Escribir la primera parte
      if (partes[0]) {
        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text(partes[0], tablaInicioX + 4, yCertificacion + 3);
      }

      // Escribir el estado en bold
      const xPosEstado = tablaInicioX + 4 + doc.getTextWidth(partes[0]);
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text(estadoTexto, xPosEstado, yCertificacion + 3);

      // Escribir la última parte
      if (partes[1]) {
        const xPosFinal = xPosEstado + doc.getTextWidth(estadoTexto);
        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text(partes[1], xPosFinal, yCertificacion + 3);
      }
    } else {
      // Línea normal sin estado
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(linea, tablaInicioX + 4, yCertificacion + 3);
    }
    yCertificacion += 3.5;
  });

  yPos += alturaFilaCertificacion;

  // === SECCIÓN DE DECLARACIÓN, FIRMA Y HUELLA DEL TRABAJADOR ===
  const alturaSeccionDeclaracion = 30; // Altura para la sección de declaración (aumentada a 30 para más espacio)
  
  // Dibujar las líneas de la sección de declaración (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaSeccionDeclaracion); // Línea izquierda
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + alturaSeccionDeclaracion); // Primera división
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + alturaSeccionDeclaracion); // Segunda división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionDeclaracion); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaSeccionDeclaracion, tablaInicioX + tablaAncho, yPos + alturaSeccionDeclaracion); // Línea inferior

  // === COLUMNA 1: DECLARACIÓN ===
  doc.setFont("helvetica", "normal").setFontSize(6);
  const textoDeclaracion = "Declaro que las respuestas son ciertas según mi leal saber y entender. En caso de ser requeridos, los resultados del examen médico pueden ser revelados, en términos generales, al departamento de salud Ocupacional de la compañía. Los resultados pueden ser enviados a mi médico particular de ser considerado necesario.";
  
  // Función para justificar texto
  const justificarTexto = (texto, x, y, anchoMaximo, interlineado) => {
    const lineas = doc.splitTextToSize(texto, anchoMaximo);
    let yActual = y;
    
    lineas.forEach((linea, index) => {
      // Solo justificar si no es la última línea y tiene más de una palabra
      if (index < lineas.length - 1 && linea.includes(' ')) {
        const palabras = linea.split(' ');
        if (palabras.length > 1) {
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
  };
  
  // Dibujar texto justificado
  justificarTexto(textoDeclaracion, tablaInicioX + 2, yPos + 3, 55, 2.5);

  // === COLUMNA 2: FIRMA Y HUELLA DEL TRABAJADOR ===
  const firmaTrabajadorY = yPos + 3; // Subido 5 puntos más arriba
  
  // Calcular centro de la columna 2 para centrar las imágenes
  const centroColumna2X = tablaInicioX + 60 + (60 / 2); // Centro de la columna 2
  
  // Agregar firma del trabajador (lado izquierdo)
  const firmaTrabajadorUrl = getSign(data, "FIRMAP");
  console.log("Firma trabajador URL:", firmaTrabajadorUrl);
  if (firmaTrabajadorUrl) {
    try {
      const imgWidth = 30; // Reducido para que quepa al lado de la huella
      const imgHeight = 20;
      const x = centroColumna2X - 20; // Posicionado a la izquierda del centro
      const y = firmaTrabajadorY;
      doc.addImage(firmaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
      console.log("Firma trabajador agregada exitosamente");
    } catch (error) {
      console.log("Error cargando firma del trabajador:", error);
    }
  } else {
    console.log("No se encontró URL de firma del trabajador");
  }

  // Agregar huella del trabajador (lado derecho, vertical)
  const huellaTrabajadorUrl = getSign(data, "HUELLA");
  console.log("Huella trabajador URL:", huellaTrabajadorUrl);
  if (huellaTrabajadorUrl) {
    try {
      const imgWidth = 12; // Vertical
      const imgHeight = 20; // Ajustado para que coincida con la altura de la firma
      const x = centroColumna2X + 8; // Posicionado a la derecha del centro
      const y = firmaTrabajadorY;
      doc.addImage(huellaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
      console.log("Huella trabajador agregada exitosamente");
    } catch (error) {
      console.log("Error cargando huella del trabajador:", error);
    }
  } else {
    console.log("No se encontró URL de huella del trabajador");
  }
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  // Centrar en la columna 2 (ancho de columna: 60px, desde tablaInicioX + 60 hasta tablaInicioX + 120)
  const centroColumna2 = tablaInicioX + 60 + (60 / 2); // Centro de la columna 2
  doc.text("Firma y Huella del trabajador", centroColumna2, yPos + 26, { align: "center" }); // Texto debajo de las imágenes

  // === COLUMNA 3: SELLO Y FIRMA DEL MÉDICO ===
  const firmaMedicoX = tablaInicioX + 125;
  const firmaMedicoY = yPos + 3; // Subido 5 puntos más arriba
  
  // Agregar firma y sello médico
  const firmaMedicoUrl = getSign(data, "SELLOFIRMA");
  console.log("Firma médico URL:", firmaMedicoUrl);
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 50;
      const imgHeight = 20;
      const x = firmaMedicoX;
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
      console.log("Firma médico agregada exitosamente");
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  } else {
    console.log("No se encontró URL de firma del médico");
  }
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  // Centrar en la columna 3 (ancho de columna: 70px, desde tablaInicioX + 120 hasta tablaInicioX + 190)
  const centroColumna3 = tablaInicioX + 120 + (70 / 2); // Centro de la columna 3
  doc.text("Sello y Firma del Médico", centroColumna3, yPos + 26, { align: "center" }); // Texto debajo de la imagen
  doc.text("Responsable de la Evaluación", centroColumna3, yPos + 28.5, { align: "center" }); // Texto debajo de la imagen

  yPos += alturaSeccionDeclaracion;







  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 7});

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