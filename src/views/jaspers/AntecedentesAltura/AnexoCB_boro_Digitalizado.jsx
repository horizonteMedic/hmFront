import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { getSign } from '../../utils/helpers';

export default function GenerarDatosPacienteBoro(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  
  // Contador de páginas dinámico
  let numeroPagina = 1;

    // Datos de prueba por defecto
    const datosPrueba = {
      numeroHistoria: "96639",
      tipoExamen: "PRE-OCUPACIONAL",
      apellidosNombres: "HADY KATHERINE CASTILLO PLASENCIA",
      documentoIdentidad: "72384273",
      genero: "FEMENINO",
      edad: "31 AÑOS",
      tipoLicencia: "A1",
      empresa: "MINERA BOROO MISQUICHILCA S.A.C",
      contratista: "LIMALA S.A.C",
      trabajaNoche: true,
      diasTrabajo: "5",
      diasDescanso: "2",
      anosTrabajoHorario: "3 AÑOS",
      fechaExamen: "04/11/2024",
      // Nuevos campos para la estructura de tabla mejorada
      direccionPaciente: "URB. COVIRT MZ. W LT. 5",
      puestoTrabajo: "OPERARIO ELECTRICISTA",
      areaTrabajo: "MANTENIMIENTO",
      anosExperiencia: "5",
      primeraAptitud: true,
      revalidacion: false,
      // Datos de color
      color: 1,
      codigoColor: "#008f39",
      textoColor: "F",
      // Datos adicionales para header
      numeroFicha: "99164",
      sede: "Trujillo-Pierola",
      // Datos de antecedentes
      antecedentes: [
        { texto: "Accidente cerebrovascular", 
          si: false, no: true },
        { texto: "Angina inestable", 
          si: false, no: true },
        { texto: "Antecedente de Bypass arterial coronario/AngioplastÍa/Stent", 
          si: false, no: true },
        { texto: "Antecedente de edema cerebral de altura", 
          si: false, no: true },
        { texto: "Antecendente de edema pulmonar de altura", 
          si: false, no: true },
        { texto: "Antecedente de Neumotórax en los ultimos 6 meses", 
          si: false, no: true },
        { texto: "Arritmia cardiaca no controlada", 
          si: false, no: true },
        { texto: "Cardiomiopatía hipertrófica idiopática", 
          si: false, no: true },
        { texto: "Cirugía mayor en los últimos 30 días", 
          si: false, no: true },
        { texto: "Cualquier insuficiencia en la válvula aórtica", 
          si: false, no: true },
        { texto: "Diabetes Mellitus", 
          si: false, no: true },
        { texto: "Embarazo", 
          si: false, no: true },
        { texto: "Epilepsia", 
          si: false, no: true },
        { texto: "EPOC - Enfermedad pulmonar obstructiva crónica confirmada", 
          si: false, no: true },
        { texto: "Eritrocitosis excesiva (mal de montaña crónico)", 
          si: false, no: true },
        { texto: "Hipertensión arterial", 
          si: false, no: true },
        { texto: "Hipertensión pulmonar", 
          si: false, no: true },
        { texto: "Infarto al miocardio en los últimos 6 meses", 
          si: false, no: true },
        { texto: "Insuficiencia cardíaca congestiva", 
          si: false, no: true },
        { texto: "Patología hemorrágica de retina", 
          si: false, no: true },
        { texto: "Patología Valvular Cardiáca en tratamiento", 
          si: false, no: true },
        { texto: "Presencia de marcapasos", 
          si: false, no: true },
        { texto: "Presencia de riesgo cardiovascular alto", 
          si: false, no: true },
        { texto: "Trastornos de la coagulación", 
          si: false, no: true },
        { texto: "Trombosis venosa cerebral", 
          si: false, no: true },
        { texto: "Otros", 
          si: false, no: true },
      ],
      observaciones: "El paciente presenta factores de riesgo moderados para acceso a altitud geográfica.",
      esApto: true,
      otrosDescripcion: "Sin observaciones adicionales"
    };

    const datosReales = {
      numeroHistoria: String(data.norden ?? ""),
      tipoExamen: String(data.nombreExamen ?? ""),
      apellidosNombres: String((data.apellidos ?? "") + " " + (data.nombres ?? "")).trim(),
      documentoIdentidad: String(data.dni ?? ""),
      genero: data.sexo === "M" ? "MASCULINO" : data.sexo === "F" ? "FEMENINO" : String(data.sexo ?? ""),
      edad: String(data.edad ?? ""),
      tipoLicencia: String(data.tipoLicencia ?? ""),
      empresa: String(data.empresa ?? ""),
      contratista: String(data.contrata ?? ""),
      trabajaNoche: Boolean(data.trabajaNoche ?? false),
      diasTrabajo: String(data.diasTrabajo ?? "5"),
      diasDescanso: String(data.diasDescanso ?? "5"),
      anosTrabajoHorario: String(data.anosTrabajoHorario ?? "5 AÑOS"),
      fechaExamen: formatearFechaCorta(data.antecedentes?.fechaAntecedente ?? ""),
      // Nuevos campos para la estructura de tabla mejorada
      direccionPaciente: String(data.direccionPaciente ?? ""),
      puestoTrabajo: String(data.cargo ?? ""),
      areaTrabajo: String(data.area ?? ""),
      anosExperiencia: String(data.anosExperiencia ?? ""),
      primeraAptitud: Boolean(data.primeraAptitud ?? false),
      revalidacion: Boolean(data.revalidacion ?? false),
      // Datos de color
      color: data.color || 1,
      codigoColor: data.codigoColor || "#008f39",
      textoColor: data.textoColor || "F",
      // Datos adicionales para header
      numeroFicha: String(data.norden ?? ""),
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
      otrosDescripcion: String(data?.antecedentes?.otrosDescripcion ?? "")
    };

    // Usar datos reales si existen, sino usar datos de prueba
    const datosFinales = data && data.norden ? datosReales : datosPrueba;

    // Header reutilizable (igual que FichaDetencionSAS_boro_Digitalizado.jsx)
    const drawHeader = (pageNumber) => {
      // Logo y membrete
      CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

      // Título principal (solo en página 1)
      if (pageNumber === 1) {
        doc.setFont("helvetica", "normal").setFontSize(13);
        doc.setTextColor(0, 0, 0);
        doc.text("ENFERMEDADES QUE PUEDEN AGRAVARSE EN ALTITUD GEOGRÁFICA", pageW / 2, 33, { align: "center" });
      }

      // Número de Ficha y Página (alineación automática mejorada)
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("Nro de ficha: ", pageW - 80, 15);

      doc.setFont("helvetica", "normal").setFontSize(18);
      doc.text(datosFinales.numeroFicha, pageW - 50, 16);
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("Sede: " + datosFinales.sede, pageW - 80, 20);
      
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

    // === DIBUJAR HEADER ===
    drawHeader(numeroPagina);

    // === TABLA DE DATOS PERSONALES ===
    const tablaInicioX = 10;
    const tablaInicioY = 35; // Ajustado para dar espacio al subtítulo
    const tablaAncho = 190;
    let yPos = tablaInicioY;

    // Altura general para todas las filas
    const filaAltura = 5;

    // Función general para dibujar header de sección con fondo gris
    const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
      // Configurar líneas con grosor consistente
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.2); // Líneas un poco más gruesas para headers
      
      // Dibujar fondo gris más oscuro
      doc.setFillColor(196, 196, 196); // Gris más oscuro
      doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
      
      // Dibujar líneas del header
      doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
      doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
      doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
      doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
      
      // Dibujar texto del título
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text(titulo, tablaInicioX + 2, yPos + 3);
      
      return yPos + alturaHeader; // Retorna la nueva posición Y
    };

    // Primera fila: AFILIACION usando función general
    yPos = dibujarHeaderSeccion("1. AFILIACION (a partir del registro médico)", yPos, filaAltura);

    // Configurar líneas para filas de datos
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2); // Mismo grosor que headers para consistencia

    // Segunda fila: Apellidos y Nombres (fila completa)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Tercera fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura); // Primera división
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura); // Segunda división
    doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura); // Tercera división
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Cuarta fila: Domicilio (fila completa)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Quinta fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura); // División central
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Sexta fila: Empresa (fila completa)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;

    // Séptima fila: Contrata (fila completa)
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    yPos += filaAltura;


    // === CONTENIDO DE LA TABLA ===
    let yTexto = tablaInicioY + 2;

    // Primera fila: AFILIACION (ya dibujada por dibujarHeaderSeccion)
    yTexto += filaAltura;

    // Segunda fila: Apellidos y Nombres
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.apellidosNombres, tablaInicioX + 55, yTexto + 1);
    yTexto += filaAltura;

    // Tercera fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("DNI:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Edad:", tablaInicioX + 47, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.edad, tablaInicioX + 58, yTexto + 1);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sexo:", tablaInicioX + 92, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.genero, tablaInicioX + 105, yTexto + 1);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.fechaExamen, tablaInicioX + 165, yTexto + 1);
    yTexto += filaAltura;

    // Cuarta fila: Domicilio
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.direccionPaciente || "No especificado", tablaInicioX + 25, yTexto + 1);
    yTexto += filaAltura;

    // Quinta fila: Puesto de Trabajo, Área de Trabajo (2 columnas)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.puestoTrabajo || "No especificado", tablaInicioX + 40, yTexto + 1);

    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.areaTrabajo || "No especificado", tablaInicioX + 125, yTexto + 1);
    yTexto += filaAltura;

    // Sexta fila: Empresa
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Empresa:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.empresa, tablaInicioX + 20, yTexto + 1);
    yTexto += filaAltura;

    // Séptima fila: Contrata
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Contrata:", tablaInicioX + 2, yTexto + 1);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datosFinales.contratista, tablaInicioX + 25, yTexto + 1);
    yTexto += filaAltura;


   

    const cuadroWidth = 190;
    const cuadroHeight = 12; // Aumentado de 8 a 12 para más espaciado
    const cuadroX = 10;
    const cuadroY = yPos;

    // Usar el mismo estilo de líneas que el resto del documento
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Dibujar fondo naranja personalizado para el cuadro de texto
    doc.setFillColor(245, 174, 103); // #f5ae67 - Naranja personalizado
    doc.rect(cuadroX, cuadroY, cuadroWidth, cuadroHeight, 'F');
    
    // Dibujar líneas individuales (igual que AFILIACION)
    doc.line(cuadroX, cuadroY, cuadroX + cuadroWidth, cuadroY); // Superior
    doc.line(cuadroX, cuadroY + cuadroHeight, cuadroX + cuadroWidth, cuadroY + cuadroHeight); // Inferior
    doc.line(cuadroX, cuadroY, cuadroX, cuadroY + cuadroHeight); // Izquierda
    doc.line(cuadroX + cuadroWidth, cuadroY, cuadroX + cuadroWidth, cuadroY + cuadroHeight); // Derecha

    // Texto dentro del cuadro
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.setTextColor(0, 0, 0);
    
    const textoCuadro = "El presente listado de patologías deberá ser precisado por la persona que accederá a una operación minera en altitud geográfica. El Médico evaluador deberá evaluar los antecedentes y condición actual del paciente para determinar si es procedente o no el acceso del paciente a altitud geográfica. De ser necesario, el médico evaluador deberá solicitar las pruebas e interconsultas complementarias para evaluar el caso antes de emitir su conclusión.";
    
    doc.text(textoCuadro, cuadroX + 2, cuadroY + 3, { // Ajustado de +2 a +3 para mejor centrado vertical
      align: "justify",
      maxWidth: cuadroWidth - 10
    });

    yPos += cuadroHeight;
  
  const leftMargin = 10;

  // ===== TABLA ANTECEDENTES PATOLÓGICOS =====
  const colTexto = 170, colNo = 10, colSi = 10;
   
   // Función para dibujar header de antecedentes con columnas NO/SI
   const dibujarHeaderAntecedentes = (titulo, yPos, alturaHeader = 5) => {
     // Configurar líneas con grosor consistente
     doc.setDrawColor(0, 0, 0);
     doc.setLineWidth(0.2); // Líneas más gruesas para headers
     
     // Dibujar fondo gris más oscuro
     doc.setFillColor(196, 196, 196); // Gris más oscuro
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
     doc.text(titulo, leftMargin + 2, yPos + 3);
     doc.text("NO", leftMargin + colTexto + colNo/2, yPos + 3, { align: "center" });
     doc.text("SI", leftMargin + colTexto + colNo + colSi/2, yPos + 3, { align: "center" });
     
     return yPos + alturaHeader; // Retorna la nueva posición Y
   };

   // Header de antecedentes usando función organizada
   yPos = dibujarHeaderAntecedentes("2. ANTECEDENTES PATOLÓGICOS", yPos, 5);

   doc.setFont("helvetica", "normal").setFontSize(8);
   doc.setLineWidth(0.2); // Mismo grosor que el resto del documento
   
   datosFinales.antecedentes.forEach((item) => {
    let textoDividido = doc.splitTextToSize(item.texto, colTexto - 4);
     let altura = textoDividido.length * 3 + 2; // Reducido de 3.5 a 2.5 y de +2 a +1.5

     // Líneas de la fila (igual que datos personales)
     doc.line(leftMargin, yPos, leftMargin + colTexto + colNo + colSi, yPos); // Superior
     doc.line(leftMargin, yPos + altura, leftMargin + colTexto + colNo + colSi, yPos + altura); // Inferior
     doc.line(leftMargin, yPos, leftMargin, yPos + altura); // Izquierda
     doc.line(leftMargin + colTexto, yPos, leftMargin + colTexto, yPos + altura); // División texto/opciones
     doc.line(leftMargin + colTexto + colNo, yPos, leftMargin + colTexto + colNo, yPos + altura); // División NO/SI
     doc.line(leftMargin + colTexto + colNo + colSi, yPos, leftMargin + colTexto + colNo + colSi, yPos + altura); // Derecha

    // Texto
     doc.setTextColor(0, 0, 0);
     doc.text(textoDividido, leftMargin + 2, yPos + 3); // Ajustado de 3 a 2.5

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
  // Usar función general para header (igual que AFILIACION)
  yPos = dibujarHeaderSeccion("3. Comentarios del Médico", yPos, filaAltura);

  // === Fila de comentarios del médico (sin divisiones internas) ===
  const textoComentarios = `Comentarios: ${datosFinales.otrosDescripcion || "Sin comentarios adicionales"}`;
  const textoObservaciones = `Observaciones: ${datosFinales.observaciones || "Sin observaciones adicionales"}`;
  
  // Combinar ambos textos en un solo párrafo
  const textoCompleto = `${textoComentarios} ${textoObservaciones}`;
  
  // Calcular altura dinámica para el texto
  const calcularAlturaComentarios = (texto, anchoMaximo, fontSize) => {
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
    
    // Altura mínima de 6mm, altura máxima de 15mm (4 líneas)
    return Math.max(lineas * fontSize * 0.35 + 1.5, 6);
  };

  const anchoMaximoComentarios = tablaAncho - 4; // Ancho total menos márgenes
  const alturaFilaComentarios = calcularAlturaComentarios(textoCompleto, anchoMaximoComentarios, 8);

  // Dibujar líneas de la fila de comentarios (sin divisiones internas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaComentarios); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaComentarios); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaComentarios, tablaInicioX + tablaAncho, yPos + alturaFilaComentarios); // Línea inferior

  // Contenido de la fila de comentarios
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(textoCompleto, tablaInicioX + 2, yPos + 3, anchoMaximoComentarios);

  yPos += alturaFilaComentarios;
  
  
 

  // ===== 4. CONCLUSIONES =====
  // Usar función general para header (igual que las otras secciones)
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
    
    // Altura mínima de 8mm, altura máxima de 20mm (5 líneas)
    return Math.max(lineas * fontSize * 0.35 + 1.5, 8);
  };

  const anchoMaximoConclusiones = tablaAncho - 4; // Ancho total menos márgenes
  const alturaFilaConclusiones = calcularAlturaConclusiones(textoCompletoConclusiones, anchoMaximoConclusiones, 8);

  // Dibujar líneas de la fila de conclusiones (sin divisiones internas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaConclusiones); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaConclusiones); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaFilaConclusiones, tablaInicioX + tablaAncho, yPos + alturaFilaConclusiones); // Línea inferior

  // Contenido de la fila de conclusiones
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(textoCompletoConclusiones, tablaInicioX + 2, yPos + 3, anchoMaximoConclusiones);

  yPos += alturaFilaConclusiones;

  // ===== SECCIÓN DE LUGAR/FECHA, FIRMA TRABAJADOR Y FIRMA MÉDICO =====
  const alturaSeccionFirmas = 30; // Altura aumentada en 5pts para mejor espaciado
  
  // Dibujar las líneas de la sección (3 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaSeccionFirmas); // Línea izquierda
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + alturaSeccionFirmas); // Primera división
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + alturaSeccionFirmas); // Segunda división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaSeccionFirmas); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + alturaSeccionFirmas, tablaInicioX + tablaAncho, yPos + alturaSeccionFirmas); // Línea inferior

  // === COLUMNA 1: LUGAR Y FECHA ===
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Lugar:", tablaInicioX + 2, yPos + 5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  
  // Usar dibujarTextoConSaltoLinea para el lugar (ancho de columna: 60px)
  const anchoColumnaLugar = 60 - 15 - 2; // Ancho total menos "Lugar:" y margen
  dibujarTextoConSaltoLinea(datosFinales.sede || "No especificado", tablaInicioX + 12, yPos + 5, anchoColumnaLugar);
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Fecha:", tablaInicioX + 2, yPos + 15);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaExamen || "No especificado", tablaInicioX + 12, yPos + 15);

  // === COLUMNA 2: FIRMA Y HUELLA DEL TRABAJADOR ===
  // Posicionar firma y huella como un bloque centrado dentro de la columna 2
  const col2Left = tablaInicioX + 60; // inicio columna 2
  const col2Width = 60; // ancho columna 2
  const firmaTrabajadorUrl = getSign(data, "FIRMAP");
  const huellaTrabajadorUrl = getSign(data, "HUELLA");
  console.log("Firma trabajador URL:", firmaTrabajadorUrl);
  console.log("Huella trabajador URL:", huellaTrabajadorUrl);

  // Dimensiones y separación
  const firmaW = 36; // más ancha que la huella
  const firmaH = 20;
  const huellaW = 14;
  const huellaH = 22;
  const gap = 4; // espacio entre firma y huella

  // Calcular posición inicial para centrar el conjunto dentro de la celda
  const groupWidth = firmaW + gap + huellaW;
  const startXCol2 = col2Left + (col2Width - groupWidth) / 2;
  const imageY = yPos + Math.max(2, (alturaSeccionFirmas - Math.max(firmaH, huellaH)) / 2 - 1);

  // Render de firma (izquierda del bloque)
  if (firmaTrabajadorUrl) {
    try {
      doc.addImage(firmaTrabajadorUrl, 'PNG', startXCol2, imageY, firmaW, firmaH);
      console.log("Firma trabajador agregada exitosamente");
    } catch (error) {
      console.log("Error cargando firma del trabajador:", error);
    }
  } else {
    console.log("No se encontró URL de firma del trabajador");
  }

  // Render de huella (derecha del bloque)
  if (huellaTrabajadorUrl) {
    try {
      const huellaX = startXCol2 + firmaW + gap;
      doc.addImage(huellaTrabajadorUrl, 'PNG', huellaX, imageY, huellaW, huellaH);
      console.log("Huella trabajador agregada exitosamente");
    } catch (error) {
      console.log("Error cargando huella del trabajador:", error);
    }
  } else {
    console.log("No se encontró URL de huella del trabajador");
  }

  doc.setFont("helvetica", "normal").setFontSize(7);
  // Centrar leyenda de la columna 2
  const centroColumna2 = col2Left + (col2Width / 2);
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

  yPos += alturaSeccionFirmas;


    // === FOOTER ===
    footerTR(doc, { footerOffsetY: 9});

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

