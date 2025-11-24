import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { getSign, convertirGenero } from "../../utils/helpers";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function GenerarDatosPaciente(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  const datosReales = {
    apellidosNombres: String((data.apellidos || "") + " " + (data.nombres || "")).trim(),
    documentoIdentidad: String(data.dni || ""),
    genero: convertirGenero(data.sexo || "") || "",
    edad: data.edad ? String(data.edad) + " AÑOS" : "",
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente || ""),
    direccionPaciente: String(data.direccionPaciente || ""),
    puestoTrabajo: String(data.cargo || ""),
    areaTrabajo: String(data.area || ""),
    empresa: String(data.empresa || ""),
    contratista: String(data.contrata || ""),
    fechaExamen: formatearFechaCorta(data.antecedentes?.fechaAntecedente || ""),
    // Datos de color
    color: data.color || data.informacionSede?.color || 1,
    codigoColor: data.codigoColor || data.informacionSede?.codigoColor || "#008f39",
    textoColor: data.textoColor || data.informacionSede?.textoColor || "F",
    // Datos adicionales para header
    numeroFicha: String(data.norden || ""),
    sede: data.sede || data.codigoSede || "",
    // Datos de antecedentes
    antecedentes: [
      { texto: "Accidente cerebrovascular", 
        si: Boolean(data?.antecedentes?.accidenteCerebroVascularSi ?? false),
        no: Boolean(data?.antecedentes?.accidenteCerebroVascularNo ?? false) },
      { texto: "Angina inestable", 
        si: Boolean(data?.antecedentes?.anginaInestableSi ?? false),
        no: Boolean(data?.antecedentes?.anginaInestableNo ?? false) },
      { texto: "Antecedente de Bypass arterial coronario/AngioplastÍa/Stent", 
        si: Boolean(data?.antecedentes?.antecedenteBypassArterialSi ?? false),
        no: Boolean(data?.antecedentes?.antecedenteBypassArterialNo ?? false) },
      { texto: "Antecedente de edema cerebral de altura", 
        si: Boolean(data?.antecedentes?.antecedenteEdemaCerebralSi ?? false),
        no: Boolean(data?.antecedentes?.antecedenteEdemaCerebralNo ?? false) },
      { texto: "Antecendente de edema pulmonar de altura", 
        si: Boolean(data?.antecedentes?.antecedenteEdemaPulmonarSi ?? false),
        no: Boolean(data?.antecedentes?.antecedenteEdemaPulmonarNo ?? false) },
      { texto: "Antecedente de Neumotórax en los ultimos 6 meses", 
        si: Boolean(data?.antecedentes?.antecedenteNeumotoraxSi ?? false),
        no: Boolean(data?.antecedentes?.antecedenteNeumotoraxNo ?? false) },
      { texto: "Arritmia cardiaca no controlada", 
        si: Boolean(data?.antecedentes?.arritmiaCardiacaSi ?? false),
        no: Boolean(data?.antecedentes?.arritmiaCardiacaNo ?? false) },
      { texto: "Cardiomiopatía hipertrófica idiopática", 
        si: Boolean(data?.antecedentes?.cardiomiopatiaSi ?? false),
        no: Boolean(data?.antecedentes?.cardiomiopatiaNo ?? false) },
      { texto: "Cirugía mayor en los últimos 30 días", 
        si: Boolean(data?.antecedentes?.cirujiaMayorSi ?? false),
        no: Boolean(data?.antecedentes?.cirujiaMayorNo ?? false) },
      { texto: "Cualquier insuficiencia en la válvula aórtica", 
        si: Boolean(data?.antecedentes?.cualquierInsuficienciaSi ?? false),
        no: Boolean(data?.antecedentes?.cualquierInsuficienciaNo ?? false) },
      { texto: "Diabetes Mellitus", 
        si: Boolean(data?.antecedentes?.diabetesMellitusSi ?? false),
        no: Boolean(data?.antecedentes?.diabetesMellitusNo ?? false) },
      { texto: "Embarazo", 
        si: Boolean(data?.antecedentes?.embarazoSi ?? false),
        no: Boolean(data?.antecedentes?.embarazoNo ?? false) },
      { texto: "Epilepsia", 
        si: Boolean(data?.antecedentes?.epilepsiaSi ?? false),
        no: Boolean(data?.antecedentes?.epilepsiaNo ?? false) },
      { texto: "EPOC - Enfermedad pulmonar obstructiva crónica confirmada", 
        si: Boolean(data?.antecedentes?.epocSi ?? false),
        no: Boolean(data?.antecedentes?.epocNo ?? false) },
      { texto: "Eritrocitosis excesiva (mal de montaña crónico)", 
        si: Boolean(data?.antecedentes?.eritrocitosisSi ?? false),
        no: Boolean(data?.antecedentes?.eritrocitosisNo ?? false) },
      { texto: "Hipertensión arterial", 
        si: Boolean(data?.antecedentes?.hipertensionArterialSi ?? false),
        no: Boolean(data?.antecedentes?.hipertensionArterialNo ?? false) },
      { texto: "Hipertensión pulmonar", 
        si: Boolean(data?.antecedentes?.hipertensionPulmonarSi ?? false),
        no: Boolean(data?.antecedentes?.hipertensionPulmonarNo ?? false) },
      { texto: "Infarto al miocardio en los últimos 6 meses", 
        si: Boolean(data?.antecedentes?.infartoMiocardioSi ?? false),
        no: Boolean(data?.antecedentes?.infartoMiocardioNo ?? false) },
      { texto: "Insuficiencia cardíaca congestiva", 
        si: Boolean(data?.antecedentes?.insuficienciaCardiacaSi ?? false),
        no: Boolean(data?.antecedentes?.insuficienciaCardiacaNo ?? false) },
      { texto: "Patología hemorrágica de retina", 
        si: Boolean(data?.antecedentes?.patologiaHemorragicaSi ?? false),
        no: Boolean(data?.antecedentes?.patologiaHemorragicaNo ?? false) },
      { texto: "Patología Valvular Cardiáca en tratamiento", 
        si: Boolean(data?.antecedentes?.patologiaValvularSi ?? false),
        no: Boolean(data?.antecedentes?.patologiaValvularNo ?? false) },
      { texto: "Presencia de marcapasos", 
        si: Boolean(data?.antecedentes?.presenciaMarcaPasosSi ?? false),
        no: Boolean(data?.antecedentes?.presenciaMarcaPasosNo ?? false) },
      { texto: "Presencia de riesgo cardiovascular alto", 
        si: Boolean(data?.antecedentes?.presenciaRiesgoCardioSi ?? false),
        no: Boolean(data?.antecedentes?.presenciaRiesgoCardioNo ?? false) },
      { texto: "Trastornos de la coagulación", 
        si: Boolean(data?.antecedentes?.transtornoCoagulacionSi ?? false),
        no: Boolean(data?.antecedentes?.transtornoCoagulacionNo ?? false) },
      { texto: "Trombosis venosa cerebral", 
        si: Boolean(data?.antecedentes?.trombosisSi ?? false),
        no: Boolean(data?.antecedentes?.trombosisNo ?? false) },
      { texto: "Otros", 
        si: Boolean(data?.antecedentes?.otrosSi ?? false),
        no: Boolean(data?.antecedentes?.otrosNo ?? false) },
    ],
    observaciones: String(data?.antecedentes?.observaciones ?? ""),
    esApto: Boolean(data?.antecedentes?.esApto ?? false),
    otrosDescripcion: String(data?.antecedentes?.otrosDescripcion ?? ""),
    // Datos del médico
    medico: {
      apellidos: String(data.apellidosUsuario || ""),
      nombres: String(data.nombresUsuario || ""),
      cmp: String(data.cmpUsuario || ""),
      direccion: String(data.direccionSede || "")
    }
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

  doc.setFont("helvetica", "normal").setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text("ENFERMEDADES QUE PUEDEN AGRAVARSE EN ALTITUD GEOGRÁFICA", pageW / 2, 33, { align: "center" });

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

  // === TABLA DE DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 37; // Posición inicial después del título
  const filaAltura = 5;

  // Primera fila: AFILIACION usando función general
  yPos = dibujarHeaderSeccion("1. AFILIACION (a partir del registro médico)", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Segunda fila: Apellidos y Nombres (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Tercera fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + 150, yPos, tablaInicioX + 150, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Cuarta fila: Domicilio (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Quinta fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
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

  // Séptima fila: Contrata (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 37 + 2; // Ajustar para el header

  // Primera fila: AFILIACION (ya dibujada por dibujarHeaderSeccion)
  yTexto += filaAltura;

  // Segunda fila: Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 1.5, tablaAncho - 45);
  yTexto += filaAltura;

  // Tercera fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 52, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.edad || "", tablaInicioX + 65, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 102, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.genero, tablaInicioX + 115, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 152, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento || "", tablaInicioX + 175, yTexto + 1.5);
  yTexto += filaAltura;

  // Cuarta fila: Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.direccionPaciente || "", tablaInicioX + 25, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Quinta fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.puestoTrabajo || "", tablaInicioX + 35, yTexto + 1.5, 60);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 102, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.areaTrabajo || "", tablaInicioX + 135, yTexto + 1.5, 60);
  yTexto += filaAltura;

  // Sexta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 24, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Séptima fila: Contrata
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contrata:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contratista || "", tablaInicioX + 24, yTexto + 1.5);
  yTexto += filaAltura;

  // === CUADRO INFORMATIVO NARANJA ===
  const cuadroWidth = 200;
  const cuadroHeight = 12;
  const cuadroX = 5;
  const cuadroY = yPos;

  // Usar el mismo estilo de líneas que el resto del documento
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  
  // Dibujar fondo naranja personalizado para el cuadro de texto
  doc.setFillColor(245, 174, 103); // #f5ae67 - Naranja personalizado
  doc.rect(cuadroX, cuadroY, cuadroWidth, cuadroHeight, 'F');
  
  // Dibujar líneas individuales
  doc.line(cuadroX, cuadroY, cuadroX + cuadroWidth, cuadroY); // Superior
  doc.line(cuadroX, cuadroY + cuadroHeight, cuadroX + cuadroWidth, cuadroY + cuadroHeight); // Inferior
  doc.line(cuadroX, cuadroY, cuadroX, cuadroY + cuadroHeight); // Izquierda
  doc.line(cuadroX + cuadroWidth, cuadroY, cuadroX + cuadroWidth, cuadroY + cuadroHeight); // Derecha

  // Texto dentro del cuadro
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.setTextColor(0, 0, 0);
  
  const textoCuadro = "El presente listado de patologías deberá ser precisado por la persona que accederá a una operación minera en altitud geográfica. El Médico evaluador deberá evaluar los antecedentes y condición actual del paciente para determinar si es procedente o no el acceso del paciente a altitud geográfica. De ser necesario, el médico evaluador deberá solicitar las pruebas e interconsultas complementarias para evaluar el caso antes de emitir su conclusión.";
  
  doc.text(textoCuadro, cuadroX + 2, cuadroY + 3, {
    align: "justify",
    maxWidth: cuadroWidth - 4
  });

  yPos += cuadroHeight;

  // ===== TABLA ANTECEDENTES PATOLÓGICOS =====
  const leftMargin = 5;
  const colTexto = 180;
  const colNo = 10;
  const colSi = 10;
   
  // Función para dibujar header de antecedentes con columnas NO/SI
  const dibujarHeaderAntecedentes = (titulo, yPos, alturaHeader = 5) => {
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
    doc.text("NO", leftMargin + colTexto + colNo/2, yPos + 3.5, { align: "center" });
    doc.text("SI", leftMargin + colTexto + colNo + colSi/2, yPos + 3.5, { align: "center" });
    
    return yPos + alturaHeader;
  };

  // Header de antecedentes usando función organizada
  yPos = dibujarHeaderAntecedentes("2. ANTECEDENTES PATOLÓGICOS", yPos, 5);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.setLineWidth(0.2);
  
  datosFinales.antecedentes.forEach((item) => {
    let textoDividido = doc.splitTextToSize(item.texto, colTexto - 4);
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
    if (item.no === true) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", leftMargin + colTexto + colNo/2, yPos + altura/2 + 1, { align: "center" });
      doc.setFont("helvetica", "normal").setFontSize(8);
    }

    // SI
    if (item.si === true) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", leftMargin + colTexto + colNo + colSi/2, yPos + altura/2 + 1, { align: "center" });
      doc.setFont("helvetica", "normal").setFontSize(8);
    }

    yPos += altura;
  });

  // ===== COMENTARIOS DEL MÉDICO =====
  // Usar función general para header
  yPos = dibujarHeaderSeccion("3. Comentarios del Médico", yPos, filaAltura);

  // === Fila de comentarios del médico (sin divisiones internas) ===
  const textoComentarios = `Comentarios: ${datosFinales.otrosDescripcion || ""}`;
  const textoObservaciones = `Observaciones: ${datosFinales.observaciones || ""}`;
  
  // Combinar ambos textos en un solo párrafo
  const textoCompleto = `${textoComentarios} ${textoObservaciones}`.trim();
  
  // Calcular altura dinámica para el texto
  const calcularAlturaComentarios = (texto, anchoMaximo, fontSize) => {
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

  const anchoMaximoComentarios = tablaAncho - 4;
  const alturaFilaComentarios = calcularAlturaComentarios(textoCompleto, anchoMaximoComentarios, 8);

  // Dibujar líneas de la fila de comentarios
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaComentarios);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaComentarios);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaComentarios, tablaInicioX + tablaAncho, yPos + alturaFilaComentarios);

  // Contenido de la fila de comentarios
  if (textoCompleto) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(textoCompleto, tablaInicioX + 2, yPos + 3, anchoMaximoComentarios);
  }

  yPos += alturaFilaComentarios;

  // ===== 4. CONCLUSIONES =====
  // Usar función general para header
  yPos = dibujarHeaderSeccion("4. CONCLUSIONES", yPos, filaAltura);

  // === Fila de conclusiones (sin divisiones internas) ===
  const textoCertificacion = "Revisados los antecedentes y examen médico según Anexo 16 y 16-A, por el presente documento certifico que él/la trabajador(a)/postulante; se encuentra";
  const textoApto = `APTO (${datosFinales.esApto ? "X" : " "})`;
  const textoNoApto = `NO APTO (${!datosFinales.esApto ? "X" : " "})`;
  const textoFinal = " para ascender a emplazamientos ubicados en Gran Altitud Geográfica (Gran Altitud)";
  
  // Combinar todo el texto en un solo párrafo
  const textoCompletoConclusiones = `${textoCertificacion} ${textoApto}, ${textoNoApto}${textoFinal}`;
  
  // Calcular altura dinámica para el texto de conclusiones
  const calcularAlturaConclusiones = (texto, anchoMaximo, fontSize) => {
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
    
    return Math.max(lineas * fontSize * 0.35 + 1.5, 8);
  };

  const anchoMaximoConclusiones = tablaAncho - 4;
  const alturaFilaConclusiones = calcularAlturaConclusiones(textoCompletoConclusiones, anchoMaximoConclusiones, 8);

  // Dibujar líneas de la fila de conclusiones
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaConclusiones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaConclusiones);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaConclusiones, tablaInicioX + tablaAncho, yPos + alturaFilaConclusiones);

  // Contenido de la fila de conclusiones
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(textoCompletoConclusiones, tablaInicioX + 2, yPos + 3, anchoMaximoConclusiones);

  yPos += alturaFilaConclusiones;

  // ===== SECCIÓN DE LUGAR/FECHA, FIRMA TRABAJADOR Y FIRMA MÉDICO =====
  const alturaSeccionFirmas = 30;
  
  // Dibujar las líneas de la sección (3 columnas)
  // Columna 1: 60mm, Columna 2: 60mm, Columna 3: 80mm (total 200mm)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaSeccionFirmas);
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + alturaSeccionFirmas);
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + alturaSeccionFirmas);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionFirmas);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaSeccionFirmas, tablaInicioX + tablaAncho, yPos + alturaSeccionFirmas);

  // === COLUMNA 1: LUGAR Y FECHA ===
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Lugar:", tablaInicioX + 2, yPos + 5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Usar dibujarTextoConSaltoLinea para el lugar
  const anchoColumnaLugar = 60 - 15 - 2;
  dibujarTextoConSaltoLinea(datosFinales.sede || "", tablaInicioX + 12, yPos + 5, anchoColumnaLugar);
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Fecha:", tablaInicioX + 2, yPos + 15);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaExamen || "", tablaInicioX + 12, yPos + 15);

  // === COLUMNA 2: FIRMA Y HUELLA DEL TRABAJADOR ===
  const col2Left = tablaInicioX + 60;
  const col2Width = 60;
  const firmaTrabajadorUrl = getSign(data, "FIRMAP");
  const huellaTrabajadorUrl = getSign(data, "HUELLA");

  // Dimensiones y separación
  const firmaW = 36;
  const firmaH = 20;
  const huellaW = 14;
  const huellaH = 22;
  const gap = 4;

  // Calcular posición inicial para centrar el conjunto dentro de la celda
  const groupWidth = firmaW + gap + huellaW;
  const startXCol2 = col2Left + (col2Width - groupWidth) / 2;
  const imageY = yPos + Math.max(2, (alturaSeccionFirmas - Math.max(firmaH, huellaH)) / 2 - 1);

  // Render de firma (izquierda del bloque)
  if (firmaTrabajadorUrl) {
    try {
      doc.addImage(firmaTrabajadorUrl, 'PNG', startXCol2, imageY, firmaW, firmaH);
    } catch (error) {
      console.log("Error cargando firma del trabajador:", error);
    }
  }

  // Render de huella (derecha del bloque)
  if (huellaTrabajadorUrl) {
    try {
      const huellaX = startXCol2 + firmaW + gap;
      doc.addImage(huellaTrabajadorUrl, 'PNG', huellaX, imageY, huellaW, huellaH);
    } catch (error) {
      console.log("Error cargando huella del trabajador:", error);
    }
  }

  doc.setFont("helvetica", "normal").setFontSize(7);
  // Centrar leyenda de la columna 2
  const centroColumna2 = col2Left + (col2Width / 2);
  doc.text("Firma y Huella del trabajador", centroColumna2, yPos + 26, { align: "center" });

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
  doc.text("Sello y Firma del Médico", centroColumna3, yPos + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroColumna3, yPos + 28.5, { align: "center" });

  yPos += alturaSeccionFirmas;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8});

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
