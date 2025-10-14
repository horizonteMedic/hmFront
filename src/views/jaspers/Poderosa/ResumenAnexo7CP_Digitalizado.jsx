import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { convertirGenero, getSign } from "../../utils/helpers";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default function ResumenAnexo7CP_Digitalizado(data = {}) {
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
    // Signos vitales de prueba
    vitalSigns: {
      fc: "64",
      fr: "19",
      pa: "120/60",
      satO2: "99",
      imc: "23.48",
      temperatura: "36.5",
      peso: "70",
      talla: "1.75"
    }
  };

  const datosReales = {
    apellidosNombres: String((data.apellidoPaciente || "") + " " + (data.nombrePaciente || "")).trim(),
    fechaExamen: formatearFechaCorta(data.fechaExamen || ""),
    tipoExamen: String(data.nombreExamen || "PRE-OCUPACIONAL"),
    sexo: convertirGenero(data.sexoPaciente) || "",
    documentoIdentidad: String(data.dniPaciente || ""),
    edad: String(data.edadPaciente ?? ""),
    areaTrabajo: data.areaPaciente || "",
    puestoTrabajo: data.cargoPaciente || "",
    empresa: data.empresa || "",
    contrata: data.contrata || "",
    // Datos de color
    color: data.color || 1,
    codigoColor: data.codigoColor || "#008f39",
    textoColor: data.textoColor || "F",
    // Datos adicionales para header
    numeroFicha: String(data.norden || ""),
    sede: data.sede || data.nombreSede || "",
    // Datos específicos
    direccionPaciente: String(data.direccionPaciente || ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente || ""),
    // Datos de digitalización
    digitalizacion: data.digitalizacion || [],
    // Signos vitales
    vitalSigns: {
      fc: String(data.frecuenciaCardiacaTriaje_f_cardiaca || ""),
      fr: String(data.frecuenciaRespiratoriaTriaje_f_respiratoria || ""),
      pa: String(data.sistolicaTriaje_sistolica || "") + "/" + String(data.diastolicaTriaje_diastolica || ""),
      satO2: String(data.saturacionOxigenoTriaje_sat_02 || ""),
      imc: String(data.imcTriaje_imc || ""),
      temperatura: String(data.temperaturaTriaje_temperatura || ""),
      peso: String(data.pesoTriaje_peso || ""),
      talla: String(data.tallaTriaje_talla || "")
    }
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
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 40, yTexto + 1.5, tablaAncho - 40);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosFinales.edad ? (datosFinales.edad + " Años") : ""), tablaInicioX + 58, yTexto + 1.5);

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
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 24, yTexto + 1.5, tablaAncho - 30);
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

  // Una sola fila con 8 columnas - Divisiones en milímetros para fácil ajuste
  const col1 = 21;  // FC
  const col2 = 42;  // FR  
  const col3 = 72;  // PA
  const col4 = 95; // Sat. O2
  const col5 = 124; // IMC
  const col6 = 144; // T°
  const col7 = 165; // Peso
  // col8 = hasta el final (Talla)

  // Dibujar líneas de la fila única
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + col1, yPos, tablaInicioX + col1, yPos + filaAltura); // División 1
  doc.line(tablaInicioX + col2, yPos, tablaInicioX + col2, yPos + filaAltura); // División 2
  doc.line(tablaInicioX + col3, yPos, tablaInicioX + col3, yPos + filaAltura); // División 3
  doc.line(tablaInicioX + col4, yPos, tablaInicioX + col4, yPos + filaAltura); // División 4
  doc.line(tablaInicioX + col5, yPos, tablaInicioX + col5, yPos + filaAltura); // División 5
  doc.line(tablaInicioX + col6, yPos, tablaInicioX + col6, yPos + filaAltura); // División 6
  doc.line(tablaInicioX + col7, yPos, tablaInicioX + col7, yPos + filaAltura); // División 7
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior

  // === CONTENIDO DE SIGNOS VITALES ===
  // FC (Frecuencia Cardíaca)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FC:", tablaInicioX + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.fc + " x min", tablaInicioX + 8, yPos + 3);

  // FR (Frecuencia Respiratoria)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FR:", tablaInicioX + col1 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.fr + " x min", tablaInicioX + col1 + 8, yPos + 3);

  // PA (Presión Arterial)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("PA:", tablaInicioX + col2 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.pa + " mmHg", tablaInicioX + col2 + 8, yPos + 3);

  // Sat. O2 (Saturación de Oxígeno)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sat. O2:", tablaInicioX + col3 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.satO2 + " %", tablaInicioX + col3 + 15, yPos + 3);

  // IMC (Índice de Masa Corporal)
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("IMC:", tablaInicioX + col4 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.imc + " kg/m2", tablaInicioX + col4 + 10, yPos + 3);

  // Temperatura
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("T°:", tablaInicioX + col5 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.temperatura + " °C", tablaInicioX + col5 + 8, yPos + 3);

  // Peso
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Peso:", tablaInicioX + col6 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.peso + " kg", tablaInicioX + col6 + 10, yPos + 3);

  // Talla
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Talla:", tablaInicioX + col7 + 2, yPos + 3);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.vitalSigns.talla + " cm", tablaInicioX + col7 + 10, yPos + 3);

  yPos += filaAltura;

  // === SECCIÓN 3: EVALUACIONES MÉDICAS ===
  // Header de evaluaciones médicas
  yPos = dibujarHeaderSeccion("3. EVALUACIONES MÉDICAS", yPos, filaAltura);

  // Fila 1: Evaluación Oftalmológica
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 2: Examen Auditiva
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 3: Radiografía de Tórax
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 4: Espirometría
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 5: Electrocardiograma
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 6: Evaluación Dental
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 7: Test Psicológico
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 8: Antecedentes de Importancia
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 9: Trabajos en Altura
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 10: Trabajos en Caliente
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // Fila 11: Ficha de Conducción
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  yPos += filaAltura;

  // === CONTENIDO DE EVALUACIONES MÉDICAS ===
  let yTextoEval = yPos - (11 * filaAltura) + 2; // Posición inicial para el texto

  // Fila 1: Evaluación Oftalmológica
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("EVALUACIÓN OFTALMOLÓGICA:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("HIPERMETROPIA", tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 2: Examen Auditiva
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("EXAMEN AUDITIVA:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NORMAL", tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 3: Radiografía de Tórax
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("RADIOGRAFÍA DE TÓRAX:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("TRAMA BRONCOVASCULAR ACENTUADA", tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 4: Espirometría
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("ESPIROMETRÍA:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("ESPIROMETRIA NORMAL", tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 5: Electrocardiograma
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("ELECTROCARDIOGRAMA:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NORMAL", tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 6: Evaluación Dental
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("EVALUACIÓN DENTAL:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NO PASO EXAMEN ODONTOLOGICO", tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 7: Test Psicológico
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("TEST PSICOLÓGICO:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("CUMPLE CON EL PERFIL DEL PUESTO", tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 8: Antecedentes de Importancia
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("ANTECEDENTES DE IMPORTANCIA:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NORMAL", tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 9: Trabajos en Altura
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("TRABAJOS EN ALTURA:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("APTO PARA TRABAJOS EN ALTURA", tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 10: Trabajos en Caliente
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("TRABAJOS EN CALIENTE:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("N/A", tablaInicioX + 52, yTextoEval + 1.5);
  yTextoEval += filaAltura;

  // Fila 11: Ficha de Conducción
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FICHA DE CONDUCCIÓN:", tablaInicioX + 2, yTextoEval + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("APTO PARA CONDUCCIÓN DE VEHICULOS Y OPERAR EQUIPOS", tablaInicioX + 52, yTextoEval + 1.5);

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
  doc.text("O - POSITIVO", tablaInicioX + 30, yTextoLab + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hemoglobina:", tablaInicioX + 102, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("13gr %", tablaInicioX + 150, yTextoLab + 1.5);
  yTextoLab += filaAltura;

  // Fila 2: Hematíes y Glucosa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Hematíes:", tablaInicioX + 2, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("N/AX mm3", tablaInicioX + 30, yTextoLab + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Glucosa:", tablaInicioX + 102, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("N/Amg/dl", tablaInicioX + 150, yTextoLab + 1.5);
  yTextoLab += filaAltura;

  // Fila 3: Drogas en Orina y Examen de Orina
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Drogas en Orina:", tablaInicioX + 2, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("COCAINA : POSITIVO MARIHUANA : POSITIVO", tablaInicioX + 30, yTextoLab + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Examen de Orina:", tablaInicioX + 102, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("NORMAL", tablaInicioX + 150, yTextoLab + 1.5);
  yTextoLab += filaAltura;

  // Fila 4: VDRL y VSG
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("VDRL:", tablaInicioX + 2, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("REACTIVO", tablaInicioX + 30, yTextoLab + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("VSG:", tablaInicioX + 102, yTextoLab + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("N/Amm", tablaInicioX + 150, yTextoLab + 1.5);

  // === SECCIÓN 5: CONCLUSION Y RECOMENDACIONES ===
  // Header gris: CONCLUSION Y RECOMENDACIONES
  yPos = dibujarHeaderSeccion("5. CONCLUSION Y RECOMENDACIONES", yPos, filaAltura);

  // Fila de datos crecientes (altura base 15mm)
  const alturaFilaDatos = 15;
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaDatos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaDatos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaDatos, tablaInicioX + tablaAncho, yPos + alturaFilaDatos);
  yPos += alturaFilaDatos;

  // === CONTENIDO DE CONCLUSION Y RECOMENDACIONES ===
  // Posición del texto dentro de la fila de datos
  let yTextoConcl = yPos - alturaFilaDatos + 2;

  // Fila de datos crecientes - CONCLUSION Y RECOMENDACIONES
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("El paciente presenta condiciones médicas que requieren seguimiento continuo. Se recomienda evaluación periódica de los parámetros alterados y seguimiento especializado según corresponda.", tablaInicioX + 2, yTextoConcl + 2, tablaAncho - 4);

  // === SECCIÓN 6: RESTRICCIONES ===
  // Header gris: RESTRICCIONES
  yPos = dibujarHeaderSeccion("6. RESTRICCIONES", yPos, filaAltura);

  // Fila de datos crecientes (altura base 15mm)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFilaDatos);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFilaDatos);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFilaDatos, tablaInicioX + tablaAncho, yPos + alturaFilaDatos);
  yPos += alturaFilaDatos;

  // === CONTENIDO DE RESTRICCIONES ===
  // Posición del texto dentro de la fila de datos
  let yTextoRestricciones = yPos - alturaFilaDatos + 2;

  // Fila de datos crecientes - RESTRICCIONES
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea("Se recomienda evitar exposición a sustancias tóxicas y realizar pausas activas durante la jornada laboral. Mantener controles médicos regulares según protocolo establecido.", tablaInicioX + 2, yTextoRestricciones + 2, tablaAncho - 4);

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
  doc.text("APTO", tablaInicioX + 35, yTextoAptitud);

  // Segunda columna: FECHA DE VENCIMIENTO
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("FECHA DE VENCIMIENTO:", tablaInicioX + 102, yTextoAptitud);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("04/11/2025", tablaInicioX + 155, yTextoAptitud);

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
