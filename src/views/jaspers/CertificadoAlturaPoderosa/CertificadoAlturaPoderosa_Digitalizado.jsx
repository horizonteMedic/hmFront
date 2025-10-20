import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { convertirGenero } from "../../utils/helpers.js";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function CertificadoAlturaPoderosa_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Datos de prueba por defecto
  const datosPrueba = {
    apellidosNombres: "CASTILLO PLASENCIA HADY KATHERINE",
    fechaExamen: "04/11/2024",
    tipoExamen: "PRE-OCUPACIONAL",
    sexo: "Femenino",
    documentoIdentidad: "72384273",
    edad: "31",
    areaTrabajo: "MINERÍA",
    puestoTrabajo: "DAD",
    empresa: "MINERA BOROO MISQUICHILCA S.A.",
    contrata: "CONTRATA EJEMPLO S.A.C.",
    // Datos de color
    color: 1,
    codigoColor: "#008f39",
    textoColor: "F",
    // Datos adicionales para header
    numeroFicha: "99164",
    sede: "Trujillo-Pierola",
    horaSalida: "9:33:43 PM",
    // Datos específicos
    direccionPaciente: "Av. Principal 123, Trujillo",
    fechaNacimiento: "15/03/1993",
    // Datos de digitalización
    digitalizacion: data.digitalizacion || [],
    // Datos para secciones 2 y 3
    accidentesTrabajo: "Sin accidentes de trabajo registrados",
    antecedentesFamiliares: "Sin antecedentes familiares relevantes",
    // Datos para antecedentes psiconeurológicos
    antecedentesPsiconeurologicos: [
      {
        condicion: "TEC MODERADO A GRAVE",
        si: true,
        no: false,
        descripcion: "ESTO PRUEBA"
      },
      {
        condicion: "COLVULSIONES",
        si: true,
        no: false,
        descripcion: "SI PRUEBA"
      },
      {
        condicion: "MAREOS, MIOCLONIAS, ACATISIA",
        si: true,
        no: false,
        descripcion: "PUES SI PRUEBA"
      },
      {
        condicion: "PROBLEMAS DE LA AUDICIÓN",
        si: true,
        no: false,
        descripcion: "NO PERO PRUEBA"
      },
      {
        condicion: "PROBLEMAS DEL EQUILIBRIO (MENIER, LABERINTITIS)",
        si: true,
        no: false,
        descripcion: "PRUEBA ?"
      },
      {
        condicion: "ACROFOBIA",
        si: true,
        no: false,
        descripcion: "ESTO ES LA PRUEBA"
      },
      {
        condicion: "AGORAFOBIA",
        si: true,
        no: false,
        descripcion: "CONTENIDO DE PRUEBA"
      }
    ],
    // Datos para hábitos (sección 5)
    habitos: [
      {
        tipo: "TABACO",
        cantidad: "",
        frecuencia: ""
      },
      {
        tipo: "ALCOHOL",
        cantidad: "Cerveza",
        frecuencia: "c/mes"
      },
      {
        tipo: "DROGAS",
        cantidad: "NO",
        frecuencia: "N/A"
      },
      {
        tipo: "HOJA DE COCA",
        cantidad: "20 g",
        frecuencia: "c/día"
      },
      {
        tipo: "CAFÉ",
        cantidad: "1 taza",
        frecuencia: "c/semana"
      }
    ],
    // Datos para TEST CAGE (sección 6)
    cageTest: [
      {
        pregunta: "¿Ha tenido usted la impresión de que debería beber menos?",
        si: false,
        no: true,
        puntaje: 0
      },
      {
        pregunta: "¿Le ha molestado alguna vez la gente criticándole su forma de beber?",
        si: false,
        no: true,
        puntaje: 0
      },
      {
        pregunta: "¿Se ha sentido usted alguna vez mal o con remordimientos después de beber?",
        si: false,
        no: true,
        puntaje: 0
      },
      {
        pregunta: "¿Ha necesitado beber por la mañana para calmar los nervios o librarse de una resaca?",
        si: false,
        no: true,
        puntaje: 0
      },
      {
        pregunta: "¿Piensa usted que come demasiados dulces?",
        si: false,
        no: true,
        puntaje: 0
      },
      {
        pregunta: "¿Considera usted que duerme las horas necesarias para estar a tono durante el día?",
        si: true,
        no: false,
        puntaje: 0
      },
      {
        pregunta: "¿Le han ofrecido alguna vez un porro o una dosis de cocaína?",
        si: false,
        no: true,
        puntaje: 0
      },
      {
        pregunta: "¿Se ha planteado en alguna ocasión hacer algo de ejercicio semanalmente?",
        si: false,
        no: true,
        puntaje: 0
      },
      {
        pregunta: "¿Se ha planteado seriamente en alguna ocasión dejar de fumar?",
        si: false,
        no: true,
        puntaje: 0
      },
      {
        pregunta: "¿Le han comentado alguna vez que debería comer más frutas y verduras?",
        si: false,
        no: true,
        puntaje: 0
       }
     ],
     // Datos para examen físico
     examenFisico: [
       {
         categoria: "SIGNOS VITALES",
         datos: `PRESION ARTERIAL (mmHg): ${data.presionArterial || "120/80"}    PULSO x min: ${data.pulso || "72"}    FR x min: ${data.frecuenciaRespiratoria || "16"}`
       },
       {
         categoria: "ANTROPOMETRIA",
         datos: `Peso (kg): ${data.peso || "70"}    Talla (m): ${data.talla || "1.70"}    IMC: ${data.imc || "24.22"}    C. CUELLO en cm: ${data.circunferenciaCuello || "38"}`
       },
       {
         categoria: "APRECIACION GENERAL",
         datos: data.apreciacionGeneral || "ABEb, Despierto, OTEP"
       },
       {
         categoria: "CABEZA",
         datos: data.examenCabeza || "Normocefelo, central, movil"
       },
       {
         categoria: "PIEL",
         datos: data.examenPiel || "Trigueño, turgente, hidratado"
       }
     ]
   };

  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente || "") + " " + (data.nombresPaciente || "")).trim(),
    fechaExamen: formatearFechaCorta(data.fechaFichaAnexo16_fecha),
    tipoExamen: String(data.tipoExamen),
    sexo: convertirGenero(data.sexoPaciente),
    documentoIdentidad: String(data.dniPaciente),
    edad: String(data.edadPaciente),
    areaTrabajo: data.areaPaciente,
    puestoTrabajo: data.cargoPaciente,
    empresa: data.empresa,
    contrata: data.contrata,
    // Datos de color
    color: data.color,
    codigoColor: data.codigoColor,
    textoColor: data.textoColor,
    // Datos adicionales para header
    numeroFicha: String(data.norden),
    sede: data.sede || data.nombreSede,
    // Datos específicos
    direccionPaciente: String(data.direccionPaciente),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente),
    // Datos de digitalización
    digitalizacion: data.digitalizacion,
    // Datos para secciones 2 y 3
    accidentesTrabajo: data.accidentesTrabajo,
    antecedentesFamiliares: data.antecedentesFamiliares,
    // Datos para antecedentes psiconeurológicos
    antecedentesPsiconeurologicos: data.antecedentesPsiconeurologicos || [],
    // Datos para hábitos (sección 5)
    habitos: data.habitos || [],
    // Datos para TEST CAGE (sección 6)
    cageTest: data.cageTest || [],
    // Datos para examen físico
    examenFisico: data.examenFisico || [
      {
        categoria: "SIGNOS VITALES",
        datos: `PRESION ARTERIAL (mmHg): ${data.presionArterial || "120/80"}    PULSO x min: ${data.pulso || "72"}    FR x min: ${data.frecuenciaRespiratoria || "16"}`
      },
      {
        categoria: "ANTROPOMETRIA",
        datos: `Peso (kg): ${data.peso || "70"}    Talla (m): ${data.talla || "1.70"}    IMC: ${data.imc || "24.22"}    C. CUELLO en cm: ${data.circunferenciaCuello || "38"}`
      },
      {
        categoria: "APRECIACION GENERAL",
        datos: data.apreciacionGeneral || "ABEb, Despierto, OTEP"
      },
      {
        categoria: "CABEZA",
        datos: data.examenCabeza || "Normocefelo, central, movil"
      },
      {
        categoria: "PIEL",
        datos: data.examenPiel || "Trigueño, turgente, hidratado"
      }
    ]
  };

  // Usar datos reales si existen, sino usar datos de prueba
  const datosFinales = data && data.norden ? datosReales : datosPrueba;

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("EXAMEN MÉDICO OCUPACIONAL PARA TRABAJOS EN ALTURA", pageW / 2, 30, { align: "center" });
      doc.text("MAYOR A 1.8 METROS", pageW / 2, 35, { align: "center" });
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
  drawHeader(numeroPagina);

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
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);
    
    return yPos + alturaHeader;
  };

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 40; // Posición inicial después del título
  const filaAltura = 5;

  // Header de datos personales
  yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);

  // Configurar líneas para filas de datos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres con división para Tipo de examen
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); 
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + filaAltura); // División para Tipo de examen
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

  // Quinta fila: Empresa (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Sexta fila: Contrata (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 40 + 2; // Ajustar para el header

  // Primera fila: Apellidos y Nombres con Tipo de examen
  yTexto += filaAltura;
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Ajustar ancho para la nueva división (hasta x = tablaInicioX + 140)
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 35, yTexto + 1.5, 95);

  // Columna derecha: Tipo de examen
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.tipoExamen, tablaInicioX + 155, yTexto + 1.5);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.edad + " Años", tablaInicioX + 58, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.sexo, tablaInicioX + 105, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.fechaNacimiento, tablaInicioX + 155, yTexto + 1.5);
  yTexto += filaAltura;

  // Tercera fila: Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.direccionPaciente, tablaInicioX + 25, yTexto + 1.5, 160);
  yTexto += filaAltura;

  // Cuarta fila: Puesto de Trabajo, Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.puestoTrabajo, tablaInicioX + 30, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.areaTrabajo, tablaInicioX + 118, yTexto + 1.5);
  yTexto += filaAltura;

  // Quinta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 24, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Sexta fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contrata, tablaInicioX + 24, yTexto + 1.5);
  yTexto += filaAltura;

  // === SECCIÓN 2: ACCIDENTES DE TRABAJO O ENFERMEDADES PROFESIONALES ===
  yPos = dibujarHeaderSeccion("2. ACCIDENTES DE TRABAJO O ENFERMEDADES PROFESIONALES", yPos, filaAltura);

  // Fila de datos de accidentes
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido de accidentes
  let yTextoAccidentes = yPos - filaAltura + 2.5;
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.accidentesTrabajo, tablaInicioX + 2, yTextoAccidentes + 1.5, tablaAncho - 4);

  // === SECCIÓN 3: ANTECEDENTES FAMILIARES ===
  yPos = dibujarHeaderSeccion("3. ANTECEDENTES FAMILIARES", yPos, filaAltura);

  // Fila de datos de antecedentes familiares
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Contenido de antecedentes familiares
  let yTextoFamiliares = yPos - filaAltura + 2.5;
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosFinales.antecedentesFamiliares, tablaInicioX + 2, yTextoFamiliares + 1.5, tablaAncho - 4);

  // === SECCIÓN 4: ANTECEDENTES PERSONALES ===
  yPos = dibujarHeaderSeccion("4. ANTECEDENTES PERSONALES (ver ficha de antecedentes patológicos)", yPos, filaAltura);


  // Crear tabla de antecedentes psiconeurológicos
  const filaAlturaTabla = 5;
  const col1Ancho = 80; // ANTECEDENTES PSICONEUROLÓGICOS
  const col2Ancho = 15; // SI
  const col3Ancho = 15; // NO
  const col4Ancho = 90; // DESCRIPCIÓN

  // Dibujar header de la tabla
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaTabla);
  doc.line(tablaInicioX + col1Ancho, yPos, tablaInicioX + col1Ancho, yPos + filaAlturaTabla);
  doc.line(tablaInicioX + col1Ancho + col2Ancho, yPos, tablaInicioX + col1Ancho + col2Ancho, yPos + filaAlturaTabla);
  doc.line(tablaInicioX + col1Ancho + col2Ancho + col3Ancho, yPos, tablaInicioX + col1Ancho + col2Ancho + col3Ancho, yPos + filaAlturaTabla);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaTabla);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaTabla, tablaInicioX + tablaAncho, yPos + filaAlturaTabla);

  // Contenido del header
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("ANTECEDENTES PSICONEUROLÓGICOS", tablaInicioX + 2, yPos + 3.5);
  doc.text("SI", tablaInicioX + col1Ancho + 2, yPos + 3.5);
  doc.text("NO", tablaInicioX + col1Ancho + col2Ancho + 2, yPos + 3.5);
  doc.text("DESCRIPCIÓN", tablaInicioX + col1Ancho + col2Ancho + col3Ancho + 2, yPos + 3.5);
  yPos += filaAlturaTabla;

  // Dibujar filas de datos
  datosFinales.antecedentesPsiconeurologicos.forEach((antecedente) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaTabla);
    doc.line(tablaInicioX + col1Ancho, yPos, tablaInicioX + col1Ancho, yPos + filaAlturaTabla);
    doc.line(tablaInicioX + col1Ancho + col2Ancho, yPos, tablaInicioX + col1Ancho + col2Ancho, yPos + filaAlturaTabla);
    doc.line(tablaInicioX + col1Ancho + col2Ancho + col3Ancho, yPos, tablaInicioX + col1Ancho + col2Ancho + col3Ancho, yPos + filaAlturaTabla);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaTabla);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAlturaTabla, tablaInicioX + tablaAncho, yPos + filaAlturaTabla);

    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(antecedente.condicion, tablaInicioX + 2, yPos + 3.5, col1Ancho - 4);
    
    // Marcar X en SI o NO según corresponda
    if (antecedente.si) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", tablaInicioX + col1Ancho + 7, yPos + 3.5);
    }
    if (antecedente.no) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", tablaInicioX + col1Ancho + col2Ancho + 7, yPos + 3.5);
    }
    
    // Descripción
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(antecedente.descripcion, tablaInicioX + col1Ancho + col2Ancho + col3Ancho + 2, yPos + 3.5, col4Ancho - 4);
    
    yPos += filaAlturaTabla;
  });

  // === SECCIÓN 5: HÁBITOS ===
  yPos = dibujarHeaderSeccion("5. HÁBITOS", yPos, filaAltura);

  // Crear tabla de hábitos
  const filaAlturaHabitos = 5;
  const colTipoAncho = 70; // TIPO
  const colCantidadAncho = 65; // CANTIDAD

  // Dibujar header de la tabla de hábitos
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaHabitos);
  doc.line(tablaInicioX + colTipoAncho, yPos, tablaInicioX + colTipoAncho, yPos + filaAlturaHabitos);
  doc.line(tablaInicioX + colTipoAncho + colCantidadAncho, yPos, tablaInicioX + colTipoAncho + colCantidadAncho, yPos + filaAlturaHabitos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaHabitos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaHabitos, tablaInicioX + tablaAncho, yPos + filaAlturaHabitos);

  // Contenido del header
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("TIPO", tablaInicioX + 2, yPos + 3.5);
  doc.text("CANTIDAD", tablaInicioX + colTipoAncho + 2, yPos + 3.5);
  doc.text("FRECUENCIA", tablaInicioX + colTipoAncho + colCantidadAncho + 2, yPos + 3.5);
  yPos += filaAlturaHabitos;

  // Dibujar filas de datos para hábitos
  datosFinales.habitos.forEach((habito) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaHabitos);
    doc.line(tablaInicioX + colTipoAncho, yPos, tablaInicioX + colTipoAncho, yPos + filaAlturaHabitos);
    doc.line(tablaInicioX + colTipoAncho + colCantidadAncho, yPos, tablaInicioX + colTipoAncho + colCantidadAncho, yPos + filaAlturaHabitos);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaHabitos);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAlturaHabitos, tablaInicioX + tablaAncho, yPos + filaAlturaHabitos);

    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(habito.tipo, tablaInicioX + 2, yPos + 3.5);
    doc.text(habito.cantidad || "", tablaInicioX + colTipoAncho + 2, yPos + 3.5);
    doc.text(habito.frecuencia || "", tablaInicioX + colTipoAncho + colCantidadAncho + 2, yPos + 3.5);
    
    yPos += filaAlturaHabitos;
  });

  // === SECCIÓN 6: TEST CAGE ===
  yPos = dibujarHeaderSeccion("6. TEST CAGE", yPos, filaAltura);

  // Crear tabla de TEST CAGE
  const filaAlturaCage = 4; // Altura reducida
  const colNumAncho = 8; // #
  const colPregAncho = 120; // Preguntas
  const colSiAncho = 15; // SI
  const colNoAncho = 15; // NO

  // Posiciones de columnas
  let xNum = tablaInicioX;
  let xPreg = xNum + colNumAncho;
  let xSi = xPreg + colPregAncho;
  let xNo = xSi + colSiAncho;
  let xPunt = xNo + colNoAncho;

  // Dibujar header de la tabla de CAGE
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaCage);
  doc.line(xNum, yPos, xNum, yPos + filaAlturaCage);
  doc.line(xPreg, yPos, xPreg, yPos + filaAlturaCage);
  doc.line(xSi, yPos, xSi, yPos + filaAlturaCage);
  doc.line(xNo, yPos, xNo, yPos + filaAlturaCage);
  doc.line(xPunt, yPos, xPunt, yPos + filaAlturaCage);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaCage);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaCage, tablaInicioX + tablaAncho, yPos + filaAlturaCage);

 // Contenido del header
doc.setFont("helvetica", "bold").setFontSize(8);

// Calcular anchos de columnas asumiendo posiciones como bordes izquierdos
var widthNum = xPreg - xNum;
var widthPreg = xSi - xPreg;
var widthSi = xNo - xSi;
var widthNo = xPunt - xNo;
// Asumir un ancho para Puntaje, ajusta según tu layout (ej. siguiente posición o ancho fijo)
var widthPunt = 30; // Ejemplo: ajusta este valor al ancho real de la columna Puntaje

// Centrar "#"
var numText = "#";
var numTW = doc.getTextWidth(numText);
doc.text(numText, xNum + (widthNum - numTW) / 2, yPos + 3);

// Centrar "Preguntas"
var pregText = "Preguntas";
var pregTW = doc.getTextWidth(pregText);
doc.text(pregText, xPreg + (widthPreg - pregTW) / 2, yPos + 3);

// Centrar "SI"
var siText = "SI";
var siTW = doc.getTextWidth(siText);
doc.text(siText, xSi + (widthSi - siTW) / 2, yPos + 3);

// Centrar "NO"
var noText = "NO";
var noTW = doc.getTextWidth(noText);
doc.text(noText, xNo + (widthNo - noTW) / 2, yPos + 3);

// Centrar "Puntaje"
var puntText = "Puntaje";
var puntTW = doc.getTextWidth(puntText);
doc.text(puntText, xPunt + (widthPunt - puntTW) / 2, yPos + 3);

yPos += filaAlturaCage;

  // Dibujar filas de datos para TEST CAGE
  datosFinales.cageTest.forEach((item, index) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaCage);
    doc.line(xNum, yPos, xNum, yPos + filaAlturaCage);
    doc.line(xPreg, yPos, xPreg, yPos + filaAlturaCage);
    doc.line(xSi, yPos, xSi, yPos + filaAlturaCage);
    doc.line(xNo, yPos, xNo, yPos + filaAlturaCage);
    doc.line(xPunt, yPos, xPunt, yPos + filaAlturaCage);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaCage);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAlturaCage, tablaInicioX + tablaAncho, yPos + filaAlturaCage);

    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text((index + 1).toString(), xNum + 2, yPos + 3);
    dibujarTextoConSaltoLinea(item.pregunta, xPreg + 2, yPos + 3, colPregAncho - 4);
    
    // Marcar X en SI o NO
    if (item.si) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", xSi + 4, yPos + 3);
    }
    if (item.no) {
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("X", xNo + 4, yPos + 3);
    }
    
    // puntaje
    if (item.puntaje > 0) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(item.puntaje.toString(), xPunt + 5, yPos + 3);
    }
    
    yPos += filaAlturaCage;
  });

  // === SECCIÓN 7: ANAMNESIS ===
  yPos = dibujarHeaderSeccion("7. ANAMNESIS", yPos, filaAltura);

  // Fila de datos de anamnesis con altura de 15mm
  const filaAlturaAnamnesis = 15;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaAnamnesis);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaAnamnesis);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAlturaAnamnesis, tablaInicioX + tablaAncho, yPos + filaAlturaAnamnesis);
  yPos += filaAlturaAnamnesis;

  // === SECCIÓN 8: EXAMEN FISICO ===
  yPos = dibujarHeaderSeccion("8. EXAMEN FISICO", yPos, filaAltura);

  // Crear tabla de examen físico
  const filaAlturaExamen = 5;
  const colCategoriaAncho = 60; // Categoría
  const colDatosAncho = 140; // Datos

  // Dibujar filas de datos para examen físico
  datosFinales.examenFisico.forEach((item) => {
    // Dibujar líneas de la fila
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAlturaExamen);
    doc.line(tablaInicioX + colCategoriaAncho, yPos, tablaInicioX + colCategoriaAncho, yPos + filaAlturaExamen);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAlturaExamen);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAlturaExamen, tablaInicioX + tablaAncho, yPos + filaAlturaExamen);

    // Contenido de la fila
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(item.categoria, tablaInicioX + 2, yPos + 3.5);
    
    doc.setFont("helvetica", "normal").setFontSize(8);
    dibujarTextoConSaltoLinea(item.datos, tablaInicioX + colCategoriaAncho + 2, yPos + 3.5, colDatosAncho - 4);
    
    yPos += filaAlturaExamen;
  });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8});

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