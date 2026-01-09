import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import { convertirGenero } from "../../../utils/helpers.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import drawColorBox from '../../components/ColorBox.jsx';
import { dibujarFirmas } from '../../../utils/dibujarFirmas.js';

export default async function CUESTIONARIO_CALIDAD_DE_SUEÑO_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  const datosReales = {
    apellidosNombres: String(`${data.apellidosPaciente ?? ""} ${data.nombresPaciente ?? ""}`).trim(),
    fechaExamen: formatearFechaCorta(data.fechaRegistro ?? ""),
    tipoExamen: String(data.tipoExamen ?? ""),
    sexo: convertirGenero(data.sexoPaciente) || "",
    documentoIdentidad: String(data.dniPaciente ?? ""),
    edad: String(data.edadPaciente ?? ""),
    areaTrabajo: String(data.areaPaciente ?? ""),
    puestoTrabajo: String(data.cargoPaciente ?? ""),
    empresa: String(data.empresa ?? ""),
    contrata: String(data.contrata ?? ""),
    numeroFicha: String(data.norden ?? ""),
    sede: String(data.sede ?? data.nombreSede ?? ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente ?? ""),
    codigoColor: String(data.codigoColor ?? ""),
    textoColor: String(data.textoColor ?? ""),
  };

  // === HEADER / CABECERA ===
  await CabeceraLogo(doc, { ...datosReales, tieneMembrete: false });

  // Número de Ficha y Página
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(datosReales.numeroFicha, pageW - 60, 16);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Sede: " + datosReales.sede, pageW - 80, 20);
  doc.text("Fecha de examen: " + datosReales.fechaExamen, pageW - 80, 25);

  // === COLOR BOX ===
  drawColorBox(doc, {
    color: datosReales.codigoColor,
    text: datosReales.textoColor,
    x: pageW - 30,
    y: 10,
    size: 22,
    showLine: true,
    fontSize: 30,
    textPosition: 0.9
  });

  // === TÍTULO PRINCIPAL ===
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("CUESTIONARIO DE CALIDAD DE SUEÑO", pageW / 2, 35, { align: "center" });

  // === SECCIÓN: I. DATOS DILIACIÓN ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 38;
  const filaAltura = 5;

  // Header de I. DATOS DILIACIÓN
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("I. DATOS DILIACIÓN", tablaInicioX + 2, yPos + 4);
  yPos += filaAltura;

  // Fila 1: Apellidos y Nombres
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosReales.apellidosNombres || "", tablaInicioX + 40, yPos + 4);
  yPos += filaAltura;

  // Fila 2: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  const col1W = tablaAncho / 4; // 50
  const col2W = tablaAncho / 4; // 50
  const col3W = tablaAncho / 4; // 50
  const col4W = tablaAncho / 4; // 50

  doc.rect(tablaInicioX, yPos, col1W, filaAltura, 'S');
  doc.rect(tablaInicioX + col1W, yPos, col2W, filaAltura, 'S');
  doc.rect(tablaInicioX + col1W + col2W, yPos, col3W, filaAltura, 'S');
  doc.rect(tablaInicioX + col1W + col2W + col3W, yPos, col4W, filaAltura, 'S');

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("DNI:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosReales.documentoIdentidad || "", tablaInicioX + 12, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Edad:", tablaInicioX + col1W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text((datosReales.edad || "") + " años", tablaInicioX + col1W + 14, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Sexo:", tablaInicioX + col1W + col2W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosReales.sexo || "", tablaInicioX + col1W + col2W + 14, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Fecha Nac.:", tablaInicioX + col1W + col2W + col3W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosReales.fechaNacimiento || "", tablaInicioX + col1W + col2W + col3W + 22, yPos + 4);
  yPos += filaAltura;

  // Fila 3: Puesto de Trabajo (con altura dinámica)
  doc.setFont("helvetica", "normal").setFontSize(7);
  const textoPuestoTrabajo = datosReales.puestoTrabajo || "";
  const lineasPuestoTrabajo = doc.splitTextToSize(textoPuestoTrabajo, tablaAncho - 35);
  const alturaPuestoTrabajo = Math.max(filaAltura, lineasPuestoTrabajo.length * 3.5 + 1);
  
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaPuestoTrabajo, 'S');
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  if (lineasPuestoTrabajo.length === 1) {
    doc.text(lineasPuestoTrabajo[0], tablaInicioX + 32, yPos + 4);
  } else {
    lineasPuestoTrabajo.forEach((linea, lineIdx) => {
      doc.text(linea, tablaInicioX + 32, yPos + 3.5 + (lineIdx * 3.5));
    });
  }
  yPos += alturaPuestoTrabajo;

  // Fila 4: Área de Trabajo
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Área de Trabajo:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosReales.areaTrabajo || "", tablaInicioX + 30, yPos + 4);
  yPos += filaAltura;

  // Fila 5: Empresa
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Empresa:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosReales.empresa || "", tablaInicioX + 20, yPos + 4);
  yPos += filaAltura;

  // Fila 6: Contrata
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("Contratista:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text(datosReales.contrata || "", tablaInicioX + 22, yPos + 4);
  yPos += filaAltura;

  // === FUNCIONES AUXILIARES ===
  // Función para texto con salto de línea
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo) => {
    if (!texto) return y;

    const lineas = doc.splitTextToSize(texto, anchoMaximo);
    const interlineado = 3.5;

    lineas.forEach((linea, index) => {
      doc.text(linea, x, y + (index * interlineado));
    });

    return y + (lineas.length * interlineado);
  };


  // Función para dibujar checkbox marcado
  const dibujarCheckbox = (x, y, marcado, alturaFila = filaAltura) => {
    if (marcado) {
      doc.setFont("helvetica", "bold").setFontSize(11.3);
      doc.setTextColor(0, 51, 204); // #0033cc
      doc.text("X", x, y + alturaFila / 2 + 1, { align: "center" });
      doc.setTextColor(0, 0, 0); // Volver a negro
    }
  };

  // === TEXTO INTRODUCTORIO ===
  yPos += 3;
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textoIntro = "Las siguientes preguntas hacen referencia a como ha dormido normalmente durante el último mes. Intente ajustarse en sus respuestas de la manera más exacta posible a lo ocurrido durante la mayor parte de los días y noches del último mes.";
  dibujarTextoConSaltoLinea(textoIntro, tablaInicioX, yPos, tablaAncho);
  yPos += (doc.splitTextToSize(textoIntro, tablaAncho).length * 3);

  // === PREGUNTA 1: HORA DE ACOSTARSE ===
  const colNumero = 8; // Ancho para el número de pregunta (reducido)
  const colPregunta = 90; // Ancho para el texto de la pregunta (reducido)

  // Calcular altura dinámica para la pregunta
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textoPregunta1 = "Durante el último mes, ¿Cuál ha sido, su hora de acostarse habitualmente?";
  const lineasPregunta1 = doc.splitTextToSize(textoPregunta1, colPregunta - 4);
  const alturaFila1 = Math.max(filaAltura, lineasPregunta1.length * 3 + 3.5);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila1);
  doc.line(tablaInicioX + colNumero, yPos, tablaInicioX + colNumero, yPos + alturaFila1);
  doc.line(tablaInicioX + colNumero + colPregunta, yPos, tablaInicioX + colNumero + colPregunta, yPos + alturaFila1);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila1);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila1, tablaInicioX + tablaAncho, yPos + alturaFila1);

  doc.text("1.-", tablaInicioX + 2, yPos + alturaFila1 / 2 + 0.5);
  lineasPregunta1.forEach((linea, idx) => {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(linea, tablaInicioX + colNumero + 2, yPos + 3.5 + (idx * 3));
  });
  doc.setTextColor(0, 0, 255); // Azul para la respuesta
  doc.text(String(data.pregunta1 ?? ""), tablaInicioX + colNumero + colPregunta + 2, yPos + alturaFila1 / 2 + 0.5);
  doc.setTextColor(0, 0, 0); // Volver a negro
  yPos += alturaFila1;

  // === PREGUNTA 2: TIEMPO EN QUEDARSE DORMIDO ===
  const colOpciones2 = (tablaAncho - colNumero - colPregunta) / 4; // Ancho para cada opción
  
  // Calcular altura dinámica
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textoPregunta2 = "¿Cuánto tiempo ha demorado en quedarse dormido, normalmente durante el último mes?";
  const lineasPregunta2 = doc.splitTextToSize(textoPregunta2, colPregunta - 4);
  
  // Opciones de respuesta
  const opcionesPregunta2 = [
    { texto: "Menos de 15 min", marcado: data.pregunta2A ?? false },
    { texto: "Entre 15 y 30 min", marcado: data.pregunta2B ?? false },
    { texto: "Entre 31 y 60 min", marcado: data.pregunta2C ?? false },
    { texto: "Más de 60 min", marcado: data.pregunta2D ?? false }
  ];

  // Calcular altura máxima de las opciones
  doc.setFont("helvetica", "normal").setFontSize(7);
  let maxAlturaOpciones = 0;
  opcionesPregunta2.forEach((opcion) => {
    const lineas = doc.splitTextToSize(opcion.texto, colOpciones2 - 6);
    maxAlturaOpciones = Math.max(maxAlturaOpciones, lineas.length * 3);
  });
  
  const alturaFila2 = Math.max(filaAltura, Math.max(lineasPregunta2.length * 3 + 3.5, maxAlturaOpciones + 3.5));
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila2);
  doc.line(tablaInicioX + colNumero, yPos, tablaInicioX + colNumero, yPos + alturaFila2);
  doc.line(tablaInicioX + colNumero + colPregunta, yPos, tablaInicioX + colNumero + colPregunta, yPos + alturaFila2);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones2, yPos, tablaInicioX + colNumero + colPregunta + colOpciones2, yPos + alturaFila2);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones2 * 2, yPos, tablaInicioX + colNumero + colPregunta + colOpciones2 * 2, yPos + alturaFila2);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones2 * 3, yPos, tablaInicioX + colNumero + colPregunta + colOpciones2 * 3, yPos + alturaFila2);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila2);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila2, tablaInicioX + tablaAncho, yPos + alturaFila2);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("2.-", tablaInicioX + 2, yPos + alturaFila2 / 2 + 0.5);
  lineasPregunta2.forEach((linea, idx) => {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(linea, tablaInicioX + colNumero + 2, yPos + 3.5 + (idx * 3));
  });

  opcionesPregunta2.forEach((opcion, idx) => {
    const xColumna = tablaInicioX + colNumero + colPregunta + (idx * colOpciones2);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const lineas = doc.splitTextToSize(opcion.texto, colOpciones2 - 6);
    const alturaTexto = lineas.length * 3;
    const yInicioTexto = yPos + 3.5 + (alturaFila2 - alturaTexto - 3.5) / 2;
    
    lineas.forEach((linea, lineIdx) => {
      doc.text(linea, xColumna + colOpciones2 / 2, yInicioTexto + (lineIdx * 3), { align: "center" });
    });
    dibujarCheckbox(xColumna + colOpciones2 / 2, yPos, opcion.marcado, alturaFila2);
  });
  
  yPos += alturaFila2;

  // === PREGUNTA 3: HORA DE LEVANTARSE ===
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textoPregunta3 = "Durante el último mes, ¿A qué hora se ha levantado normalmente?";
  const lineasPregunta3 = doc.splitTextToSize(textoPregunta3, colPregunta - 4);
  const alturaFila3 = Math.max(filaAltura, lineasPregunta3.length * 3 + 3.5);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila3);
  doc.line(tablaInicioX + colNumero, yPos, tablaInicioX + colNumero, yPos + alturaFila3);
  doc.line(tablaInicioX + colNumero + colPregunta, yPos, tablaInicioX + colNumero + colPregunta, yPos + alturaFila3);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila3);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila3, tablaInicioX + tablaAncho, yPos + alturaFila3);

  doc.text("3.-", tablaInicioX + 2, yPos + alturaFila3 / 2 + 0.5);
  lineasPregunta3.forEach((linea, idx) => {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(linea, tablaInicioX + colNumero + 2, yPos + 3.5 + (idx * 3));
  });
  doc.setTextColor(0, 0, 255); // Azul para la respuesta
  doc.text(String(data.pregunta3 ?? ""), tablaInicioX + colNumero + colPregunta + 2, yPos + alturaFila3 / 2 + 0.5);
  doc.setTextColor(0, 0, 0); // Volver a negro
  yPos += alturaFila3;

  // === PREGUNTA 4: HORAS DORMIDAS ===
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textoPregunta4 = "¿Cuántas horas calcula que habrá dormido verdaderamente cada noche durante el último mes?";
  const lineasPregunta4 = doc.splitTextToSize(textoPregunta4, colPregunta - 4);
  const alturaFila4 = Math.max(filaAltura, lineasPregunta4.length * 3 + 3.5);

  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila4);
  doc.line(tablaInicioX + colNumero, yPos, tablaInicioX + colNumero, yPos + alturaFila4);
  doc.line(tablaInicioX + colNumero + colPregunta, yPos, tablaInicioX + colNumero + colPregunta, yPos + alturaFila4);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila4);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila4, tablaInicioX + tablaAncho, yPos + alturaFila4);

  doc.text("4.-", tablaInicioX + 2, yPos + alturaFila4 / 2 + 0.5);
  lineasPregunta4.forEach((linea, idx) => {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(linea, tablaInicioX + colNumero + 2, yPos + 3.5 + (idx * 3));
  });
  doc.setTextColor(0, 0, 255); // Azul para la respuesta
  doc.text(String(data.pregunta4 ?? ""), tablaInicioX + colNumero + colPregunta + 2, yPos + alturaFila4 / 2 + 0.5);
  doc.setTextColor(0, 0, 0); // Volver a negro
  yPos += alturaFila4;

  // === PREGUNTA 5: PROBLEMAS PARA DORMIR ===
  // Headers de columnas - usar el mismo ancho que las preguntas anteriores para alineación
  const colPregunta5 = colNumero + colPregunta; // Ancho para la pregunta (alineado con preguntas anteriores)
  const colOpciones = (tablaAncho - colPregunta5) / 4; // Ancho para cada opción
  
  // Calcular altura necesaria para la pregunta
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textoPregunta5 = "Durante el último mes, cuántas veces ha tenido usted problemas para dormir, a causa de:";
  const lineasPregunta5 = doc.splitTextToSize(textoPregunta5, colPregunta - 4);
  
  // Calcular altura necesaria para los headers de opciones
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textosHeaders = [
    "Ninguna vez en el último mes",
    "Menos de una vez a la semana",
    "Una o dos veces a la semana",
    "Tres veces a la semana"
  ];
  let maxAlturaHeaders = 0;
  textosHeaders.forEach((texto) => {
    const lineas = doc.splitTextToSize(texto, colOpciones - 4);
    maxAlturaHeaders = Math.max(maxAlturaHeaders, lineas.length * 3);
  });
  
  const alturaFila5 = Math.max(filaAltura, Math.max(lineasPregunta5.length * 3 + 3.5, maxAlturaHeaders + 3.5));
  
  // Dibujar fila combinada: pregunta + headers
  doc.setFillColor(220, 220, 220);
  doc.rect(tablaInicioX + colPregunta5, yPos, tablaAncho - colPregunta5, alturaFila5, 'F'); // Fondo gris solo para headers
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila5);
  doc.line(tablaInicioX + colNumero, yPos, tablaInicioX + colNumero, yPos + alturaFila5);
  doc.line(tablaInicioX + colPregunta5, yPos, tablaInicioX + colPregunta5, yPos + alturaFila5);
  doc.line(tablaInicioX + colPregunta5 + colOpciones, yPos, tablaInicioX + colPregunta5 + colOpciones, yPos + alturaFila5);
  doc.line(tablaInicioX + colPregunta5 + colOpciones * 2, yPos, tablaInicioX + colPregunta5 + colOpciones * 2, yPos + alturaFila5);
  doc.line(tablaInicioX + colPregunta5 + colOpciones * 3, yPos, tablaInicioX + colPregunta5 + colOpciones * 3, yPos + alturaFila5);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila5);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila5, tablaInicioX + tablaAncho, yPos + alturaFila5);

  // Dibujar pregunta en la izquierda
  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("5.-", tablaInicioX + 2, yPos + alturaFila5 / 2 + 0.5);
  lineasPregunta5.forEach((linea, idx) => {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(linea, tablaInicioX + colNumero + 2, yPos + 3.5 + (idx * 3));
  });
  
  // Dibujar headers de opciones en la derecha con saltos de línea
  doc.setFont("helvetica", "bold").setFontSize(7);
  textosHeaders.forEach((texto, idx) => {
    const xColumna = tablaInicioX + colPregunta5 + (idx * colOpciones);
    const lineas = doc.splitTextToSize(texto, colOpciones - 4);
    const alturaTexto = lineas.length * 3;
    const yInicioTexto = yPos + 3.5 + (alturaFila5 - alturaTexto - 3.5) / 2;
    
    lineas.forEach((linea, lineIdx) => {
      doc.text(linea, xColumna + colOpciones / 2, yInicioTexto + (lineIdx * 3), { align: "center" });
    });
  });
  yPos += alturaFila5;

  // Sub-preguntas a-j
  const subPreguntas5 = [
    { letra: "a", texto: "No poder conciliar el sueño en la primera media hora", 
      nunca: data.pregunta5ANingunaVez ?? false,
      menos: data.pregunta5AMenosUnaVez ?? false,
      unaDos: data.pregunta5AUnaDosVeces ?? false,
      tres: data.pregunta5ATresVeces ?? false
    },
    { letra: "b", texto: "Se despertó durante la noche o de madrugada",
      nunca: data.pregunta5BNingunaVez ?? false,
      menos: data.pregunta5BMenosUnaVez ?? false,
      unaDos: data.pregunta5BUnaDosVeces ?? false,
      tres: data.pregunta5BTresVeces ?? false
    },
    { letra: "c", texto: "Tener que levantarse para ir al servicio",
      nunca: data.pregunta5CNingunaVez ?? false,
      menos: data.pregunta5CMenosUnaVez ?? false,
      unaDos: data.pregunta5CUnaDosVeces ?? false,
      tres: data.pregunta5CTresVeces ?? false
    },
    { letra: "d", texto: "No podía respirar bien",
      nunca: data.pregunta5DNingunaVez ?? false,
      menos: data.pregunta5DMenosUnaVez ?? false,
      unaDos: data.pregunta5DUnaDosVeces ?? false,
      tres: data.pregunta5DTresVeces ?? false
    },
    { letra: "e", texto: "Toser o roncar ruidosamente",
      nunca: data.pregunta5ENingunaVez ?? false,
      menos: data.pregunta5EMenosUnaVez ?? false,
      unaDos: data.pregunta5EUnaDosVeces ?? false,
      tres: data.pregunta5ETresVeces ?? false
    },
    { letra: "f", texto: "Sentir frío",
      nunca: data.pregunta5FNingunaVez ?? false,
      menos: data.pregunta5FMenosUnaVez ?? false,
      unaDos: data.pregunta5FUnaDosVeces ?? false,
      tres: data.pregunta5FTresVeces ?? false
    },
    { letra: "g", texto: "Sentir demasiado calor",
      nunca: data.pregunta5GNingunaVez ?? false,
      menos: data.pregunta5GMenosUnaVez ?? false,
      unaDos: data.pregunta5GUnaDosVeces ?? false,
      tres: data.pregunta5GTresVeces ?? false
    },
    { letra: "h", texto: "Tener pesadillas o malos sueños",
      nunca: data.pregunta5HNingunaVez ?? false,
      menos: data.pregunta5HMenosUnaVez ?? false,
      unaDos: data.pregunta5HUnaDosVeces ?? false,
      tres: data.pregunta5HTresVeces ?? false
    },
    { letra: "i", texto: "Sufrir dolores",
      nunca: data.pregunta5INingunaVez ?? false,
      menos: data.pregunta5IMenosUnaVez ?? false,
      unaDos: data.pregunta5IUnaDosVeces ?? false,
      tres: data.pregunta5ITresVeces ?? false
    },
    { letra: "j", texto: "Otras razones:",
      nunca: data.pregunta5JNingunaVez ?? false,
      menos: data.pregunta5JMenosUnaVez ?? false,
      unaDos: data.pregunta5JUnaDosVeces ?? false,
      tres: data.pregunta5JTresVeces ?? false
    }
  ];

  // Dibujar líneas verticales continuas desde la pregunta 5 (solo una vez, antes del loop)
  const yInicioSubPreguntas = yPos;
  const yFinSubPreguntas = yPos + (subPreguntas5.length * filaAltura);
  
  // Líneas verticales que continúan desde la pregunta 5
  doc.line(tablaInicioX, yInicioSubPreguntas, tablaInicioX, yFinSubPreguntas);
  doc.line(tablaInicioX + colNumero, yInicioSubPreguntas, tablaInicioX + colNumero, yFinSubPreguntas);
  doc.line(tablaInicioX + colPregunta5, yInicioSubPreguntas, tablaInicioX + colPregunta5, yFinSubPreguntas);
  doc.line(tablaInicioX + colPregunta5 + colOpciones, yInicioSubPreguntas, tablaInicioX + colPregunta5 + colOpciones, yFinSubPreguntas);
  doc.line(tablaInicioX + colPregunta5 + colOpciones * 2, yInicioSubPreguntas, tablaInicioX + colPregunta5 + colOpciones * 2, yFinSubPreguntas);
  doc.line(tablaInicioX + colPregunta5 + colOpciones * 3, yInicioSubPreguntas, tablaInicioX + colPregunta5 + colOpciones * 3, yFinSubPreguntas);
  doc.line(tablaInicioX + tablaAncho, yInicioSubPreguntas, tablaInicioX + tablaAncho, yFinSubPreguntas);
  
  // Línea inferior del bloque completo (cruza todo el ancho)
  doc.line(tablaInicioX, yFinSubPreguntas, tablaInicioX + tablaAncho, yFinSubPreguntas);

  subPreguntas5.forEach((subPregunta, idx) => {
    const yFilaActual = yInicioSubPreguntas + (idx * filaAltura);
    
    // Dibujar línea superior de cada fila (cruza TODO el ancho de la tabla)
    doc.line(tablaInicioX, yFilaActual, tablaInicioX + tablaAncho, yFilaActual);
    
    doc.setFont("helvetica", "normal").setFontSize(7);
    
    // Si es la pregunta "j", agregar texto de "Otras razones" si viene
    if (subPregunta.letra === "j") {
      const textoLabel = `${subPregunta.letra}. ${subPregunta.texto}`;
      doc.text(textoLabel, tablaInicioX + colNumero + 2, yPos + 2.5);
      
      // Texto de "Otras razones" (si existe en data)
      const textoOtrasRazones = String(data.pregunta5JOtrasRazones ?? "");
      if (textoOtrasRazones) {
        const anchoTextoLabel = doc.getTextWidth(textoLabel);
        doc.setFont("helvetica", "normal").setFontSize(7);
        doc.text(textoOtrasRazones, tablaInicioX + colNumero + 2 + anchoTextoLabel + 1, yPos + 2.5);
      }
    } else {
      doc.text(`${subPregunta.letra}. ${subPregunta.texto}`, tablaInicioX + colNumero + 2, yPos + 2.5);
    }
    
    dibujarCheckbox(tablaInicioX + colPregunta5 + colOpciones / 2, yPos, subPregunta.nunca, filaAltura);
    dibujarCheckbox(tablaInicioX + colPregunta5 + colOpciones + colOpciones / 2, yPos, subPregunta.menos, filaAltura);
    dibujarCheckbox(tablaInicioX + colPregunta5 + colOpciones * 2 + colOpciones / 2, yPos, subPregunta.unaDos, filaAltura);
    dibujarCheckbox(tablaInicioX + colPregunta5 + colOpciones * 3 + colOpciones / 2, yPos, subPregunta.tres, filaAltura);
    
    // Dibujar línea inferior de cada fila (cruza TODO el ancho de la tabla)
    doc.line(tablaInicioX, yFilaActual + filaAltura, tablaInicioX + tablaAncho, yFilaActual + filaAltura);
    
    yPos += filaAltura;
  });

  // === PREGUNTA 6: MEDICINAS PARA DORMIR ===
  const colOpciones6 = (tablaAncho - colNumero - colPregunta) / 4;
  
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textoPregunta6 = "Durante el último mes, ¿Cuántas veces ha tomado medicinas para dormir (por su cuenta o recetadas por el médico)?";
  const lineasPregunta6 = doc.splitTextToSize(textoPregunta6, colPregunta - 4);
  
  const opcionesPregunta6 = [
    { texto: "Ninguna vez", marcado: data.pregunta6NingunaVez ?? false },
    { texto: "Menos de una vez a la semana", marcado: data.pregunta6MenosUnaVez ?? false },
    { texto: "Una o dos veces a la semana", marcado: data.pregunta6UnaDosVeces ?? false },
    { texto: "Tres veces a la semana", marcado: data.pregunta6TresVeces ?? false }
  ];

  doc.setFont("helvetica", "normal").setFontSize(7);
  let maxAlturaOpciones6 = 0;
  opcionesPregunta6.forEach((opcion) => {
    const lineas = doc.splitTextToSize(opcion.texto, colOpciones6 - 6);
    maxAlturaOpciones6 = Math.max(maxAlturaOpciones6, lineas.length * 3);
  });
  
  const alturaFila6 = Math.max(filaAltura, Math.max(lineasPregunta6.length * 3 + 3.5, maxAlturaOpciones6 + 3.5));
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila6);
  doc.line(tablaInicioX + colNumero, yPos, tablaInicioX + colNumero, yPos + alturaFila6);
  doc.line(tablaInicioX + colNumero + colPregunta, yPos, tablaInicioX + colNumero + colPregunta, yPos + alturaFila6);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones6, yPos, tablaInicioX + colNumero + colPregunta + colOpciones6, yPos + alturaFila6);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones6 * 2, yPos, tablaInicioX + colNumero + colPregunta + colOpciones6 * 2, yPos + alturaFila6);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones6 * 3, yPos, tablaInicioX + colNumero + colPregunta + colOpciones6 * 3, yPos + alturaFila6);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila6);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila6, tablaInicioX + tablaAncho, yPos + alturaFila6);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("6.-", tablaInicioX + 2, yPos + alturaFila6 / 2 + 0.5);
  lineasPregunta6.forEach((linea, idx) => {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(linea, tablaInicioX + colNumero + 2, yPos + 3.5 + (idx * 3));
  });

  opcionesPregunta6.forEach((opcion, idx) => {
    const xColumna = tablaInicioX + colNumero + colPregunta + (idx * colOpciones6);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const lineas = doc.splitTextToSize(opcion.texto, colOpciones6 - 6);
    const alturaTexto = lineas.length * 3;
    const yInicioTexto = yPos + 3.5 + (alturaFila6 - alturaTexto - 3.5) / 2;
    
    lineas.forEach((linea, lineIdx) => {
      doc.text(linea, xColumna + colOpciones6 / 2, yInicioTexto + (lineIdx * 3), { align: "center" });
    });
    dibujarCheckbox(xColumna + colOpciones6 / 2, yPos, opcion.marcado, alturaFila6);
  });
  
  yPos += alturaFila6;

  // === PREGUNTA 7: SOMNOLENCIA SOCIAL ===
  const colOpciones7 = (tablaAncho - colNumero - colPregunta) / 4;
  
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textoPregunta7 = "Durante el último mes, ¿Cuántas veces ha sentido somnolencia / sueño mientras conducía, comía o hacia alguna otra actividad social?";
  const lineasPregunta7 = doc.splitTextToSize(textoPregunta7, colPregunta - 4);
  
  const opcionesPregunta7 = [
    { texto: "Ninguna vez", marcado: data.pregunta7NingunaVez ?? false },
    { texto: "Menos de una vez a la semana", marcado: data.pregunta7MenosUnaVez ?? false },
    { texto: "Una o dos veces a la semana", marcado: data.pregunta7UnaDosVeces ?? false },
    { texto: "Tres veces a la semana", marcado: data.pregunta7TresVeces ?? false }
  ];

  doc.setFont("helvetica", "normal").setFontSize(7);
  let maxAlturaOpciones7 = 0;
  opcionesPregunta7.forEach((opcion) => {
    const lineas = doc.splitTextToSize(opcion.texto, colOpciones7 - 6);
    maxAlturaOpciones7 = Math.max(maxAlturaOpciones7, lineas.length * 3);
  });
  
  const alturaFila7 = Math.max(filaAltura, Math.max(lineasPregunta7.length * 3 + 3.5, maxAlturaOpciones7 + 3.5));
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila7);
  doc.line(tablaInicioX + colNumero, yPos, tablaInicioX + colNumero, yPos + alturaFila7);
  doc.line(tablaInicioX + colNumero + colPregunta, yPos, tablaInicioX + colNumero + colPregunta, yPos + alturaFila7);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones7, yPos, tablaInicioX + colNumero + colPregunta + colOpciones7, yPos + alturaFila7);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones7 * 2, yPos, tablaInicioX + colNumero + colPregunta + colOpciones7 * 2, yPos + alturaFila7);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones7 * 3, yPos, tablaInicioX + colNumero + colPregunta + colOpciones7 * 3, yPos + alturaFila7);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila7);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila7, tablaInicioX + tablaAncho, yPos + alturaFila7);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("7.-", tablaInicioX + 2, yPos + alturaFila7 / 2 + 0.5);
  lineasPregunta7.forEach((linea, idx) => {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(linea, tablaInicioX + colNumero + 2, yPos + 3.5 + (idx * 3));
  });

  opcionesPregunta7.forEach((opcion, idx) => {
    const xColumna = tablaInicioX + colNumero + colPregunta + (idx * colOpciones7);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const lineas = doc.splitTextToSize(opcion.texto, colOpciones7 - 6);
    const alturaTexto = lineas.length * 3;
    const yInicioTexto = yPos + 3.5 + (alturaFila7 - alturaTexto - 3.5) / 2;
    
    lineas.forEach((linea, lineIdx) => {
      doc.text(linea, xColumna + colOpciones7 / 2, yInicioTexto + (lineIdx * 3), { align: "center" });
    });
    dibujarCheckbox(xColumna + colOpciones7 / 2, yPos, opcion.marcado, alturaFila7);
  });
  
  yPos += alturaFila7;

  // === PREGUNTA 8: DESPERTARES EN LA NOCHE ===
  const colOpciones8 = (tablaAncho - colNumero - colPregunta) / 4;
  
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textoPregunta8 = "Si se despierta en la noche, ¿Cuántas veces lo hace en promedio?";
  const lineasPregunta8 = doc.splitTextToSize(textoPregunta8, colPregunta - 4);
  
  const opcionesPregunta8 = [
    { texto: "1 vez por noche", marcado: data.pregunta8UnaVez ?? false },
    { texto: "2 vez por noche", marcado: data.pregunta8DosVeces ?? false },
    { texto: "3 vez por noche", marcado: data.pregunta8TresVeces ?? false },
    { texto: "> 3 vez por", marcado: data.pregunta8CuatroVeces ?? false }
  ];

  const alturaFila8 = Math.max(filaAltura, lineasPregunta8.length * 3 + 3.5);
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila8);
  doc.line(tablaInicioX + colNumero, yPos, tablaInicioX + colNumero, yPos + alturaFila8);
  doc.line(tablaInicioX + colNumero + colPregunta, yPos, tablaInicioX + colNumero + colPregunta, yPos + alturaFila8);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones8, yPos, tablaInicioX + colNumero + colPregunta + colOpciones8, yPos + alturaFila8);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones8 * 2, yPos, tablaInicioX + colNumero + colPregunta + colOpciones8 * 2, yPos + alturaFila8);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones8 * 3, yPos, tablaInicioX + colNumero + colPregunta + colOpciones8 * 3, yPos + alturaFila8);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila8);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila8, tablaInicioX + tablaAncho, yPos + alturaFila8);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("8.-", tablaInicioX + 2, yPos + alturaFila8 / 2 + 0.5);
  lineasPregunta8.forEach((linea, idx) => {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(linea, tablaInicioX + colNumero + 2, yPos + 3.5 + (idx * 3));
  });

  opcionesPregunta8.forEach((opcion, idx) => {
    const xColumna = tablaInicioX + colNumero + colPregunta + (idx * colOpciones8);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(opcion.texto, xColumna + colOpciones8 / 2, yPos + alturaFila8 / 2 + 0.5, { align: "center" });
    dibujarCheckbox(xColumna + colOpciones8 / 2, yPos, opcion.marcado, alturaFila8);
  });
  
  yPos += alturaFila8;

  // === PREGUNTA 9: CALIDAD DE SUEÑO GENERAL ===
  const colOpciones9 = (tablaAncho - colNumero - colPregunta) / 4;
  
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textoPregunta9 = "Durante el último mes, ¿Cuál cree que es la calidad de su sueño en general?";
  const lineasPregunta9 = doc.splitTextToSize(textoPregunta9, colPregunta - 4);
  
  const opcionesPregunta9 = [
    { texto: "Muy Buena", marcado: data.pregunta9MuyBuena ?? false },
    { texto: "Buena", marcado: data.pregunta9Buena ?? false },
    { texto: "Mala", marcado: data.pregunta9Mala ?? false },
    { texto: "Muy mala", marcado: data.pregunta9MuyMala ?? false }
  ];

  const alturaFila9 = Math.max(filaAltura, lineasPregunta9.length * 3 + 3.5);
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila9);
  doc.line(tablaInicioX + colNumero, yPos, tablaInicioX + colNumero, yPos + alturaFila9);
  doc.line(tablaInicioX + colNumero + colPregunta, yPos, tablaInicioX + colNumero + colPregunta, yPos + alturaFila9);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones9, yPos, tablaInicioX + colNumero + colPregunta + colOpciones9, yPos + alturaFila9);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones9 * 2, yPos, tablaInicioX + colNumero + colPregunta + colOpciones9 * 2, yPos + alturaFila9);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones9 * 3, yPos, tablaInicioX + colNumero + colPregunta + colOpciones9 * 3, yPos + alturaFila9);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila9);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila9, tablaInicioX + tablaAncho, yPos + alturaFila9);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("9.-", tablaInicioX + 2, yPos + alturaFila9 / 2 + 0.5);
  lineasPregunta9.forEach((linea, idx) => {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(linea, tablaInicioX + colNumero + 2, yPos + 3.5 + (idx * 3));
  });

  opcionesPregunta9.forEach((opcion, idx) => {
    const xColumna = tablaInicioX + colNumero + colPregunta + (idx * colOpciones9);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(opcion.texto, xColumna + colOpciones9 / 2, yPos + alturaFila9 / 2 + 0.5, { align: "center" });
    dibujarCheckbox(xColumna + colOpciones9 / 2, yPos, opcion.marcado, alturaFila9);
  });
  
  yPos += alturaFila9;

  // === PREGUNTA 10: ÁNIMO QUE DIFICULTA ACTIVIDAD ===
  const colOpciones10 = (tablaAncho - colNumero - colPregunta) / 4;
  
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textoPregunta10 = "Durante el último mes, ¿Su estado de ánimo le ha dificultado hacer alguna actividad?";
  const lineasPregunta10 = doc.splitTextToSize(textoPregunta10, colPregunta - 4);
  
  const opcionesPregunta10 = [
    { texto: "No", marcado: data.pregunta10No ?? false },
    { texto: "Sí, algo", marcado: data.pregunta10SiAlgo ?? false },
    { texto: "Sí, regular", marcado: data.pregunta10SiRegular ?? false },
    { texto: "Sí, mucho", marcado: data.pregunta10SiMucho ?? false }
  ];

  const alturaFila10 = Math.max(filaAltura, lineasPregunta10.length * 3 + 3.5);
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila10);
  doc.line(tablaInicioX + colNumero, yPos, tablaInicioX + colNumero, yPos + alturaFila10);
  doc.line(tablaInicioX + colNumero + colPregunta, yPos, tablaInicioX + colNumero + colPregunta, yPos + alturaFila10);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones10, yPos, tablaInicioX + colNumero + colPregunta + colOpciones10, yPos + alturaFila10);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones10 * 2, yPos, tablaInicioX + colNumero + colPregunta + colOpciones10 * 2, yPos + alturaFila10);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones10 * 3, yPos, tablaInicioX + colNumero + colPregunta + colOpciones10 * 3, yPos + alturaFila10);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila10);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila10, tablaInicioX + tablaAncho, yPos + alturaFila10);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("10.-", tablaInicioX + 2, yPos + alturaFila10 / 2 + 0.5);
  lineasPregunta10.forEach((linea, idx) => {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(linea, tablaInicioX + colNumero + 2, yPos + 3.5 + (idx * 3));
  });

  opcionesPregunta10.forEach((opcion, idx) => {
    const xColumna = tablaInicioX + colNumero + colPregunta + (idx * colOpciones10);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(opcion.texto, xColumna + colOpciones10 / 2, yPos + alturaFila10 / 2 + 0.5, { align: "center" });
    dibujarCheckbox(xColumna + colOpciones10 / 2, yPos, opcion.marcado, alturaFila10);
  });
  
  yPos += alturaFila10;

  // === PREGUNTA 11: COMPARTE HABITACIÓN ===
  const colOpciones11 = (tablaAncho - colNumero - colPregunta) / 4;
  
  doc.setFont("helvetica", "bold").setFontSize(7);
  const textoPregunta11 = "Durante el último mes, ¿Usted duerme solo o comparte la habitación (cuarto) con otra persona?";
  const lineasPregunta11 = doc.splitTextToSize(textoPregunta11, colPregunta - 4);
  
  const opcionesPregunta11 = [
    { texto: "Solo", marcado: data.pregunta11Solo ?? false },
    { texto: "Solo, pero hay alguien en la habitación de al lado", marcado: data.pregunta11SoloAlado ?? false },
    { texto: "Con otra persona en el mismo cuarto", marcado: data.pregunta11MismoCuarto ?? false },
    { texto: "Con dos o más personas en el mismo cuarto", marcado: data.pregunta11DosMasPersonasMismoCuarto ?? false }
  ];

  doc.setFont("helvetica", "normal").setFontSize(7);
  let maxAlturaOpciones11 = 0;
  opcionesPregunta11.forEach((opcion) => {
    const lineas = doc.splitTextToSize(opcion.texto, colOpciones11 - 6);
    maxAlturaOpciones11 = Math.max(maxAlturaOpciones11, lineas.length * 3);
  });
  
  const alturaFila11 = Math.max(filaAltura, Math.max(lineasPregunta11.length * 3 + 3.5, maxAlturaOpciones11 + 3.5));
  
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila11);
  doc.line(tablaInicioX + colNumero, yPos, tablaInicioX + colNumero, yPos + alturaFila11);
  doc.line(tablaInicioX + colNumero + colPregunta, yPos, tablaInicioX + colNumero + colPregunta, yPos + alturaFila11);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones11, yPos, tablaInicioX + colNumero + colPregunta + colOpciones11, yPos + alturaFila11);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones11 * 2, yPos, tablaInicioX + colNumero + colPregunta + colOpciones11 * 2, yPos + alturaFila11);
  doc.line(tablaInicioX + colNumero + colPregunta + colOpciones11 * 3, yPos, tablaInicioX + colNumero + colPregunta + colOpciones11 * 3, yPos + alturaFila11);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila11);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + alturaFila11, tablaInicioX + tablaAncho, yPos + alturaFila11);

  doc.setFont("helvetica", "bold").setFontSize(7);
  doc.text("11.-", tablaInicioX + 2, yPos + alturaFila11 / 2 + 0.5);
  lineasPregunta11.forEach((linea, idx) => {
    doc.setFont("helvetica", "bold").setFontSize(7);
    doc.text(linea, tablaInicioX + colNumero + 2, yPos + 3.5 + (idx * 3));
  });

  opcionesPregunta11.forEach((opcion, idx) => {
    const xColumna = tablaInicioX + colNumero + colPregunta + (idx * colOpciones11);
    doc.setFont("helvetica", "normal").setFontSize(7);
    const lineas = doc.splitTextToSize(opcion.texto, colOpciones11 - 6);
    const alturaTexto = lineas.length * 3;
    const yInicioTexto = yPos + 3.5 + (alturaFila11 - alturaTexto - 3.5) / 2;
    
    lineas.forEach((linea, lineIdx) => {
      doc.text(linea, xColumna + colOpciones11 / 2, yInicioTexto + (lineIdx * 3), { align: "center" });
    });
    dibujarCheckbox(xColumna + colOpciones11 / 2, yPos, opcion.marcado, alturaFila11);
  });
  
  yPos += alturaFila11;

  // === SECCIÓN DE FIRMAS ===
  const pageHeight = doc.internal.pageSize.getHeight();
  if (yPos + 30 > pageHeight - 20) {
    doc.addPage();
    yPos = 35;
  }

  // Dibujar sección de firma con borde
  const alturaSeccionFirma = 30;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaSeccionFirma, 'S');

  // Usar la función dibujarFirmas para dibujar las firmas
  await dibujarFirmas({ doc, datos: data, y: yPos + 2, pageW });

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 5 });

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

