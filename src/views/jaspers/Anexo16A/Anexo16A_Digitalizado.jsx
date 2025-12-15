import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { getSign, convertirGenero } from "../../utils/helpers";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function Anexo16A_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  const datosReales = {
    apellidosNombres: String((data.apellidos_apellidos_pa || "") + " " + (data.nombres_nombres_pa || "")),
    fechaExamen: formatearFechaCorta(data.fechaAnexo16a_fecha_anexo || ""),
    sexo: convertirGenero(data.sexo_sexo_pa || "") || "",
    documentoIdentidad: String(data.dni_cod_pa || ""),
    edad: data.edad_edad ? String(data.edad_edad) + " AÑOS" : "",
    areaTrabajo: data.area_area_o || "",
    puestoTrabajo: data.cargo_cargo_de || "",
    empresa: data.empresa_razon_empresa || "",
    contrata: data.contrata_razon_contrata || "",
    apto: data.aptoAnexo16a_apto !== undefined ? data.aptoAnexo16a_apto : true,
    vitalSigns: {
      fc: String(data.frecuenciaCardiacaTriaje_f_cardiaca || ""),
      fr: String(data.frecuenciaRespiratoriaTriaje_f_respiratoria || ""),
      pa: (data.sistolicaTriaje_sistolica || data.diastolicaTriaje_diastolica)
        ? String(data.sistolicaTriaje_sistolica || "") + "/" + String(data.diastolicaTriaje_diastolica || "")
        : "",
      satO2: String(data.saturacionOxigenoTriaje_sat_02 || ""),
      imc: String(data.imcTriaje_imc || "")
    },
    condiciones: {
      cirugiaMayor: data.cirujiaMayorRecienteSiAnexo16a_si1 || false,
      desordenesCoagulacion: data.desordenCoagulacionSiAnexo16a_si2 || false,
      diabetes: data.diabetesMellitusSiAnexo16a_si3 || false,
      hipertension: data.hipertensionArterialSiAnexo16a_si4 || false,
      embarazo: data.embarazoSiAnexo16a_si5 || false,
      problemasNeurologicos: data.problemaNeurologicoSiAnexo16a_si6 || false,
      infeccionesRecientes: data.infeccionRecienteSiAnexo16a_si7 || false,
      obesidadMorbida: data.obesidadMorbididadSiAnexo16a_si8 || false,
      problemasCardiacos: data.problemasCardiacoSiAnexo16a_si9 || false,
      problemasRespiratorios: data.problemasRespiratoriosSiAnexo16a_si10 || false,
      problemasOftalmologicos: data.problemasOftalmologicosSiAnexo16a_si11 || false,
      problemasDigestivos: data.problemasDigestivosSiAnexo16a_si12 || false,
      apneaSueño: data.apneaDelSuenoSiAnexo16a_si13 || false,
      alergias: data.alergiasSiAnexo16a_si15 || false,
      otraCondicion: data.otraCondicionMedicaSiAnexo16a_si14 || false
    },
    medicacionActual: data.medicacionActualAnexo16a_m_actual || "",
    fur: data.furDescripcionAnexo16a_txtfur || "",
    observaciones: data.observacionesAnexo16a_observaciones || "",
    medico: {
      nombres: String((data.apellidoUsuario_apellido_user || "") + " " + (data.nombreUsuario_nombre_user || "")),
      direccion: data.direccionSede || "",
      cmp: (() => {
        const nombreUsuario = String(data.nombreUsuario_nombre_user || "").toUpperCase().trim();
        if (nombreUsuario === "MARIBEL THALIA") {
          return "106250";
        }
        return data.cmpUsuario_cmp_user ? String(data.cmpUsuario_cmp_user) : "";
      })(),
      fecha: formatearFechaCorta(data.fechaAnexo16a_fecha_anexo || "")
    },
    // Datos de color
    color: data.color || data.informacionSede?.color || 1,
    codigoColor: data.codigoColor || data.informacionSede?.codigoColor || "#008f39",
    textoColor: data.textoColor || data.informacionSede?.textoColor || "F",
    // Datos adicionales para header
    numeroFicha: String(data.norden_n_orden || ""),
    sede: data.nombreSede || ""
  };

  // Usar datos reales
  const datosFinales = datosReales;

  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    if (!texto) return y;
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
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);

    return yPos + alturaHeader;
  };

  // === HEADER ===
  CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("ANEXO N° 16 - A", pageW / 2, 32.5, { align: "center" });

  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("EVALUACION MÉDICA PARA ASCENSO A GRANDES ALTITUDES", pageW / 2, 36.5, { align: "center" });
  doc.text("(mayor de 2,500 m.s.n.m.)", pageW / 2, 40.5, { align: "center" });

  // Número de Ficha y Página
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);

  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(datosFinales.numeroFicha, pageW - 60, 16);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + datosFinales.sede, pageW - 80, 20);
  doc.text("Fecha de examen: " + datosFinales.fechaExamen, pageW - 80, 25);

  doc.text("Pag. 01", pageW - 30, 10);

  // === BLOQUE DE COLOR ===
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

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 48; // Posición inicial después del título
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
  let yTexto = 48 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 35, yTexto + 1.5, tablaAncho - 40);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Género
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 62, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.edad || "", tablaInicioX + 75, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Género:", tablaInicioX + 122, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.sexo, tablaInicioX + 135, yTexto + 1.5);
  yTexto += filaAltura;

  // Tercera fila: Área de Trabajo, Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo, tablaInicioX + 30, yTexto + 1.5, 50);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo, tablaInicioX + 122, yTexto + 1.5, 65);
  yTexto += filaAltura;

  // Cuarta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 24, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Quinta fila: Contrata
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contrata:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.contrata || "N/A"), tablaInicioX + 24, yTexto + 1.5);
  yTexto += filaAltura;

  // === SECCIÓN 2: FUNCIONES VITALES ===
  // Header de funciones vitales
  yPos = dibujarHeaderSeccion("2. FUNCIONES VITALES", yPos, filaAltura);

  // Primera fila de funciones vitales con 5 columnas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 40, yPos, tablaInicioX + 40, yPos + filaAltura);
  doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
  doc.line(tablaInicioX + 160, yPos, tablaInicioX + 160, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  // Contenido de funciones vitales
  const yVitales = yPos;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FC:", tablaInicioX + 2, yVitales + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.vitalSigns.fc || "") + (datosFinales.vitalSigns.fc ? " x min" : ""), tablaInicioX + 10, yVitales + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FR:", tablaInicioX + 42, yVitales + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.vitalSigns.fr || "") + (datosFinales.vitalSigns.fr ? " x min" : ""), tablaInicioX + 50, yVitales + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("PA:", tablaInicioX + 82, yVitales + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.vitalSigns.pa || "") + (datosFinales.vitalSigns.pa ? " mmHg" : ""), tablaInicioX + 90, yVitales + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sat. O2:", tablaInicioX + 122, yVitales + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.vitalSigns.satO2 || "") + (datosFinales.vitalSigns.satO2 ? " %" : ""), tablaInicioX + 135, yVitales + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("IMC:", tablaInicioX + 162, yVitales + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.vitalSigns.imc || "") + (datosFinales.vitalSigns.imc ? " kg/m2" : ""), tablaInicioX + 170, yVitales + 3.5);

  yPos += filaAltura;

  // === SECCIÓN 3: CONDICIONES MÉDICAS ===
  // Función para dibujar header de condiciones médicas con columnas SI/NO
  const dibujarHeaderCondiciones = (titulo, yPos, alturaHeader = 5) => {
    const leftMargin = 5;
    const colTexto = 180;
    const colNo = 10;
    const colSi = 10;

    // Configurar líneas con grosor consistente
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // Dibujar fondo gris más oscuro
    doc.setFillColor(196, 196, 196);
    doc.rect(leftMargin, yPos, colTexto + colNo + colSi, alturaHeader, 'F');

    // Dibujar líneas del header
    doc.line(leftMargin, yPos, leftMargin + colTexto + colNo + colSi, yPos); // Superior
    doc.line(leftMargin, yPos + alturaHeader, leftMargin + colTexto + colNo + colSi, yPos + alturaHeader); // Inferior
    doc.line(leftMargin, yPos, leftMargin, yPos + alturaHeader); // Izquierda
    doc.line(leftMargin + colTexto, yPos, leftMargin + colTexto, yPos + alturaHeader); // División texto/opciones
    doc.line(leftMargin + colTexto + colNo, yPos, leftMargin + colTexto + colNo, yPos + alturaHeader); // División NO/SI
    doc.line(leftMargin + colTexto + colNo + colSi, yPos, leftMargin + colTexto + colNo + colSi, yPos + alturaHeader); // Derecha

    // Dibujar texto del título
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(titulo, leftMargin + 2, yPos + 3.5);
    doc.text("SI", leftMargin + colTexto + colNo / 2, yPos + 3.5, { align: "center" });
    doc.text("NO", leftMargin + colTexto + colNo + colSi / 2, yPos + 3.5, { align: "center" });

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

  const leftMargin = 5;
  const colTexto = 180;
  const colNo = 10;
  const colSi = 10;

  doc.setFont("helvetica", "normal").setFontSize(8);
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
      doc.text("X", leftMargin + colTexto + colNo + colSi / 2, yPos + altura / 2 + 1, { align: "center" });
      doc.setFont("helvetica", "normal").setFontSize(8);
    }

    // SI
    if (datosFinales.condiciones[condicion.campo] === true) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", leftMargin + colTexto + colNo / 2, yPos + altura / 2 + 1, { align: "center" });
      doc.setFont("helvetica", "normal").setFontSize(8);
    }

    // Si es embarazo y está marcado como SI, mostrar campo FUR en la misma línea
    if (condicion.campo === "embarazo" && datosFinales.condiciones[condicion.campo]) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("FUR:", leftMargin + colTexto + colNo + colSi + 5, yPos + 3);
      doc.text(datosFinales.fur || "", leftMargin + colTexto + colNo + colSi + 15, yPos + 3);
    }

    yPos += altura;
  });

  // === USO DE MEDICACIÓN ===
  // Header de medicación
  yPos = dibujarHeaderSeccion("Uso de medicación Actual:", yPos, filaAltura);

  // Calcular altura dinámica para la medicación
  const calcularAlturaMedicacion = (texto, anchoMaximo, fontSize) => {
    if (!texto) return filaAltura;
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

    return Math.max(lineas * fontSize * 0.35 + 1.5, filaAltura);
  };

  const textoMedicacion = datosFinales.medicacionActual || "";
  const anchoMaximoMedicacion = tablaAncho - 4;
  const alturaFilaMedicacion = calcularAlturaMedicacion(textoMedicacion, anchoMaximoMedicacion, 8);

  // Fila de medicación con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaMedicacion);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaMedicacion);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaMedicacion, tablaInicioX + tablaAncho, yPos + alturaFilaMedicacion);

  // Contenido de medicación
  if (textoMedicacion) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(textoMedicacion, tablaInicioX + 2, yPos + 3, anchoMaximoMedicacion);
  }

  yPos += alturaFilaMedicacion;

  // === OBSERVACIONES MÉDICAS ===
  // Header de observaciones
  yPos = dibujarHeaderSeccion("OBSERVACIONES", yPos, filaAltura);

  // Observaciones dinámicas - puede recibir array o string
  let observacionesLista = [];
  if (datosFinales.observaciones) {
    if (Array.isArray(datosFinales.observaciones)) {
      observacionesLista = datosFinales.observaciones;
    } else {
      // Si es string, dividir por saltos de línea o comas
      observacionesLista = datosFinales.observaciones.split(/[\n,;]/).map(obs => obs.trim()).filter(obs => obs);
    }
  }

  // Calcular altura dinámica para observaciones
  const calcularAlturaObservaciones = (lista, anchoMaximo) => {
    if (lista.length === 0) return filaAltura;
    let alturaTotal = 0;
    lista.forEach(obs => {
      const lineas = doc.splitTextToSize(obs, anchoMaximo);
      alturaTotal += lineas.length * 3.5 + 1;
    });
    return Math.max(alturaTotal + 2, filaAltura);
  };

  const anchoMaximoObservaciones = tablaAncho - 4;
  const alturaFilaObservaciones = calcularAlturaObservaciones(observacionesLista, anchoMaximoObservaciones);

  // Fila de observaciones con altura dinámica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaObservaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaObservaciones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaObservaciones, tablaInicioX + tablaAncho, yPos + alturaFilaObservaciones);

  // Dibujar cada observación
  let observacionY = yPos + 3;
  observacionesLista.forEach((observacion) => {
    doc.setFont("helvetica", "normal").setFontSize(7);
    const lineas = doc.splitTextToSize(observacion, anchoMaximoObservaciones);
    lineas.forEach((linea, index) => {
      doc.text(linea, tablaInicioX + 2, observacionY + (index * 3.5));
    });
    observacionY += lineas.length * 3.5 + 1;
  });

  yPos += alturaFilaObservaciones;

  // === DATOS DEL MÉDICO ===
  // Header de datos del médico
  yPos = dibujarHeaderSeccion("DATOS DEL MÉDICO", yPos, filaAltura);

  // Primera fila: Apellidos y Nombres
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.medico.nombres, tablaInicioX + 40, yPos + 3.5, tablaAncho - 45);
  yPos += filaAltura;

  // Segunda fila: Dirección
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Dirección:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.medico.direccion, tablaInicioX + 25, yPos + 3.5, tablaAncho - 30);
  yPos += filaAltura;

  // Tercera fila: CMP y Fecha (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("CMP:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.medico.cmp, tablaInicioX + 15, yPos + 3.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha de Examen:", tablaInicioX + 102, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.medico.fecha, tablaInicioX + 135, yPos + 3.5);
  yPos += filaAltura;

  // === CERTIFICACIÓN MÉDICA CON FONDO NARANJA ===
  const estadoApto = datosFinales.apto !== undefined ? datosFinales.apto : true;
  const estadoTexto = estadoApto ? "APTO" : "NO APTO";

  // Texto de certificación
  const textoCertificacion = "Conforme a la declaración del / de la paciente y las pruebas complementarias, certifico que se encuentra  ";
  const textoDespues = " para ascender a grandes altitudes (mayor a 2,500 m.s.n.m); sin embargo, no aseguro el desempeño durante el ascenso durante su permanencia.";

  // Combinar todo el texto
  const textoCompletoCertificacion = `${textoCertificacion}${estadoTexto}${textoDespues}`;

  // Calcular altura dinámica para la certificación
  const anchoMaximoCertificacion = tablaAncho - 8;

  // Dibujar fondo naranja para la certificación (altura inicial, se ajustará después)
  doc.setFillColor(245, 174, 103); // Color naranja

  // Dividir el texto en líneas usando splitTextToSize
  doc.setFont("helvetica", "normal").setFontSize(8);
  const certificacionLineas = doc.splitTextToSize(textoCompletoCertificacion, anchoMaximoCertificacion);

  // Calcular altura real basada en las líneas
  let alturaFilaCertificacion = Math.max(certificacionLineas.length * 3.5 + 2, filaAltura);

  // Dibujar rectángulo naranja
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaCertificacion, 'F');

  // Dibujar líneas de la certificación
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaCertificacion);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaCertificacion);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaCertificacion, tablaInicioX + tablaAncho, yPos + alturaFilaCertificacion);

  let yCertificacion = yPos + 3;
  const margenIzquierdo = tablaInicioX + 4;
  const margenDerecho = tablaInicioX + tablaAncho - 4;

  certificacionLineas.forEach((linea) => {
    // Verificar si la línea contiene el estado completo
    if (linea.includes(estadoTexto)) {
      // Dividir la línea en partes para poder hacer bold solo el estado
      const partes = linea.split(estadoTexto);
      let xActual = margenIzquierdo;

      // Escribir la primera parte
      if (partes[0] && partes[0].trim()) {
        doc.setFont("helvetica", "normal").setFontSize(8);
        const anchoParte1 = doc.getTextWidth(partes[0]);
        if (xActual + anchoParte1 <= margenDerecho) {
          doc.text(partes[0], xActual, yCertificacion);
          xActual += anchoParte1;
        }
      }

      // Escribir el estado en bold
      doc.setFont("helvetica", "bold").setFontSize(8);
      const anchoEstado = doc.getTextWidth(estadoTexto);
      if (xActual + anchoEstado <= margenDerecho) {
        doc.text(estadoTexto, xActual, yCertificacion);
        xActual += anchoEstado;
      }

      // Escribir la última parte si cabe
      if (partes[1] && partes[1].trim()) {
        doc.setFont("helvetica", "normal").setFontSize(8);
        const anchoDisponible = margenDerecho - xActual;
        if (anchoDisponible > 5) {
          const textoRestante = doc.splitTextToSize(partes[1], anchoDisponible);
          if (textoRestante.length > 0) {
            doc.text(textoRestante[0], xActual, yCertificacion);
          }
        }
      }
    } else {
      // Línea normal sin estado
      doc.setFont("helvetica", "normal").setFontSize(8);
      // Asegurar que el texto no se salga
      const anchoLinea = doc.getTextWidth(linea);
      if (anchoLinea <= anchoMaximoCertificacion) {
        doc.text(linea, margenIzquierdo, yCertificacion);
      } else {
        // Si se sale, usar solo la primera parte que quepa
        const lineasAjustadas = doc.splitTextToSize(linea, anchoMaximoCertificacion);
        doc.text(lineasAjustadas[0] || linea, margenIzquierdo, yCertificacion);
      }
    }
    yCertificacion += 3.5;
  });

  yPos += alturaFilaCertificacion;

  // === SECCIÓN DE DECLARACIÓN, FIRMA Y HUELLA DEL TRABAJADOR ===
  const alturaSeccionDeclaracion = 30; // Altura para la sección de declaración

  // Dibujar las líneas de la sección de declaración (3 columnas)
  // Columna 1: 60mm, Columna 2: 60mm, Columna 3: 80mm (total 200mm)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaSeccionDeclaracion);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + alturaSeccionDeclaracion);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + alturaSeccionDeclaracion);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionDeclaracion);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaSeccionDeclaracion, tablaInicioX + tablaAncho, yPos + alturaSeccionDeclaracion);

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
  const firmaTrabajadorY = yPos + 3;

  // Calcular centro de la columna 2 para centrar las imágenes
  const centroColumna2X = tablaInicioX + 60 + (60 / 2); // Centro de la columna 2

  // Agregar firma del trabajador (lado izquierdo)
  const firmaTrabajadorUrl = getSign(data, "FIRMAP");
  if (firmaTrabajadorUrl) {
    try {
      const imgWidth = 30; // Reducido para que quepa al lado de la huella
      const imgHeight = 20;
      const x = centroColumna2X - 20; // Posicionado a la izquierda del centro
      const y = firmaTrabajadorY;
      doc.addImage(firmaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del trabajador:", error);
    }
  }

  // Agregar huella del trabajador (lado derecho, vertical)
  const huellaTrabajadorUrl = getSign(data, "HUELLA");
  if (huellaTrabajadorUrl) {
    try {
      const imgWidth = 12; // Vertical
      const imgHeight = 20; // Ajustado para que coincida con la altura de la firma
      const x = centroColumna2X + 8; // Posicionado a la derecha del centro
      const y = firmaTrabajadorY;
      doc.addImage(huellaTrabajadorUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando huella del trabajador:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(7);
  // Centrar en la columna 2 (ancho de columna: 60mm, desde tablaInicioX + 60 hasta tablaInicioX + 120)
  const centroColumna2 = tablaInicioX + 60 + (60 / 2); // Centro de la columna 2
  doc.text("Firma y Huella del trabajador", centroColumna2, yPos + 26, { align: "center" }); // Texto debajo de las imágenes

  // === COLUMNA 3: SELLO Y FIRMA DEL MÉDICO ===
  const firmaMedicoY = yPos + 3;

  // Calcular centro de la columna 3 para centrar la imagen
  const centroColumna3 = tablaInicioX + 120 + (80 / 2); // Centro de la columna 3 (160mm desde tablaInicioX)

  // Agregar firma y sello médico
  const firmaMedicoUrl = getSign(data, "SELLOFIRMA");
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 50;
      const imgHeight = 20;
      // Centrar la imagen: centro de la columna menos la mitad del ancho de la imagen
      const x = centroColumna3 - (imgWidth / 2);
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Sello y Firma del Médico", centroColumna3, yPos + 26, { align: "center" }); // Texto debajo de la imagen
  doc.text("Responsable de la Evaluación", centroColumna3, yPos + 28.5, { align: "center" }); // Texto debajo de la imagen

  yPos += alturaSeccionDeclaracion;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });

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
