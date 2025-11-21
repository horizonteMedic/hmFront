import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils";
import { convertirGenero, getSign } from "../../../utils/helpers";
import drawColorBox from '../../components/ColorBox.jsx';
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';

export default function Informe_PsicolaboralBoroo_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  const datosReales = {
    apellidosNombres: String((data.apellidosPaciente) + " " + (data.nombresPaciente)).trim(),
    fechaExamen: formatearFechaCorta(data.fecha || data.fechaExamen),
    tipoExamen: String(data.nombreExamen),
    sexo: convertirGenero(data.sexoPaciente),
    documentoIdentidad: String(data.dniPaciente),
    edad: String(data.edadPaciente),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente || data.fechaNacimiento),
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
    horaSalida: String(data.horaSalida),
    direccionPaciente: String(data.direccionPaciente),
    // Datos para Aspectos Conductuales
    nivelAlertaRiesgo: data.nivelAlerta || data.nivelAlertaRiesgo || data.nivelAlertaAnteRiesgo || "-",
    tipoHostigamientoSexual: data.hostigamientoSexual || data.tipoHostigamientoSexual || "-",
    tipoConsecuenciaEncontrada: data.consecuencia || data.tipoConsecuenciaEncontrada || "-",
    // Datos para Observaciones, Recomendaciones y Conclusiones
    observaciones: data.observaciones || "",
    recomendaciones: data.recomendaciones || "",
    cumplePerfil: data.apto === true || data.cumplePerfil === true // true si cumple, false si no cumple
  };

  // Usar solo datos reales
  const datosFinales = datosReales;

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false });

    // Título principal (solo en página 1)
    if (pageNumber === 1) {
      doc.setFont("helvetica", "bold").setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.text("INFORME PSICOLABORAL", pageW / 2, 32, { align: "center" });
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

  // Función para dibujar X en las columnas
  const dibujarX = (x, y) => {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.setTextColor(0, 0, 255); // Azul para la X
    doc.text("X", x, y, { align: "center" });
    doc.setTextColor(0, 0, 0); // Resetear a negro
  };

  // Función general para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    const tablaInicioX =5;
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
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);
    
    return yPos + alturaHeader;
  };

  // === SECCIÓN 1: DATOS PERSONALES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  let yPos = 35;
  const filaAltura = 4.5;

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

  // === CONTENIDO DE LA TABLA ===
  let yTexto = 35 + filaAltura + 2.5; // Ajustar para el header

  // Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  // Ajustar ancho para la nueva división (hasta x = tablaInicioX + 140)
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres || "", tablaInicioX + 35, yTexto + 1, 95);

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
  doc.text((datosFinales.edad ? (datosFinales.edad + " AÑOS") : ""), tablaInicioX + 58, yTexto + 1);

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
  dibujarTextoConSaltoLinea(datosFinales.direccionPaciente || "", tablaInicioX + 25, yTexto + 1, 160);
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
  dibujarTextoConSaltoLinea(datosFinales.empresa || "", tablaInicioX + 24, yTexto + 1, 160);
  yTexto += filaAltura;

  // Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contrata || "", tablaInicioX + 24, yTexto + 1);
  yTexto += filaAltura;

  // === SECCIÓN: CRITERIOS PSICOLÓGICOS ===
  // Fila gris: Título CRITERIOS PSICOLÓGICOS
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  
  // Dibujar fondo gris
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  
  // Dibujar líneas del borde
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Texto del título (centrado)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CRITERIOS PSICOLÓGICOS", tablaInicioX + tablaAncho / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // Fila celeste: Aspecto Intelectual | Inferior | Promedio Inferior | Promedio | Promedio superior | Superior
  // Dividir columnas (con división interna en Aspecto Intelectual para las filas de datos)
  const colNumero = 8; // Columna para números dentro de Aspecto Intelectual
  const colAspecto = 60; // Columna para texto del aspecto (dentro de Aspecto Intelectual)
  const col1Total = colNumero + colAspecto; // Total columna Aspecto Intelectual
  // Ancho disponible para las 5 columnas de evaluación: (200 - 68) / 5 = 26.4mm
  const anchoColumnaEvaluacion = (tablaAncho - col1Total) / 5; // Todas las columnas con el mismo ancho
  const col2 = anchoColumnaEvaluacion; // Inferior
  const col3 = anchoColumnaEvaluacion; // Promedio Inferior
  const col4 = anchoColumnaEvaluacion; // Promedio
  const col5 = anchoColumnaEvaluacion; // Promedio superior
  // Superior queda con el resto del espacio (mismo ancho que las demás)
  
  // Dibujar fondo celeste
  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  
  // Dibujar líneas verticales para las columnas del header (sin división interna en header)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + col1Total, yPos, tablaInicioX + col1Total, yPos + filaAltura); // Fin Aspecto Intelectual
  doc.line(tablaInicioX + col1Total + col2, yPos, tablaInicioX + col1Total + col2, yPos + filaAltura); // División 2
  doc.line(tablaInicioX + col1Total + col2 + col3, yPos, tablaInicioX + col1Total + col2 + col3, yPos + filaAltura); // División 3
  doc.line(tablaInicioX + col1Total + col2 + col3 + col4, yPos, tablaInicioX + col1Total + col2 + col3 + col4, yPos + filaAltura); // División 4
  doc.line(tablaInicioX + col1Total + col2 + col3 + col4 + col5, yPos, tablaInicioX + col1Total + col2 + col3 + col4 + col5, yPos + filaAltura); // División 5
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  
  // Texto de las columnas del header (todos centrados)
  doc.setFont("helvetica", "bold").setFontSize(7);
  // Aspecto Intelectual centrado en toda la columna (sin división en header)
  doc.text("Aspecto Intelectual", tablaInicioX + col1Total / 2, yPos + 3.5, { align: "center" });
  // Títulos de evaluación centrados
  doc.text("Inferior", tablaInicioX + col1Total + col2 / 2, yPos + 3.5, { align: "center" });
  doc.text("Promedio Inferior", tablaInicioX + col1Total + col2 + col3 / 2, yPos + 3.5, { align: "center" });
  doc.text("Promedio", tablaInicioX + col1Total + col2 + col3 + col4 / 2, yPos + 3.5, { align: "center" });
  doc.text("Promedio superior", tablaInicioX + col1Total + col2 + col3 + col4 + col5 / 2, yPos + 3.5, { align: "center" });
  doc.text("Superior", tablaInicioX + col1Total + col2 + col3 + col4 + col5 + anchoColumnaEvaluacion / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // === FILAS DE ASPECTOS INTELECTUALES ===
  const aspectos = [
    "Razonamiento y Resolucion de problemas",
    "Memoria",
    "Atencion y Concentración",
    "Coordinación viso-motora",
    "Orientación Espacial",
    "Comprensión verbal"
  ];

  aspectos.forEach((aspecto, index) => {
    const numero = index + 1;
    const aspectoNum = numero;
    
    // Obtener datos para este aspecto
    const inferior = data[`aspectoIntelectual${aspectoNum}I`];
    const promedioInferior = data[`aspectoIntelectual${aspectoNum}NPI`];
    const promedio = data[`aspectoIntelectual${aspectoNum}NP`];
    const promedioSuperior = data[`aspectoIntelectual${aspectoNum}NPS`];
    const superior = data[`aspectoIntelectual${aspectoNum}S`];
    
    // Dibujar líneas de la fila (con división interna en Aspecto Intelectual)
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + colNumero, yPos, tablaInicioX + colNumero, yPos + filaAltura); // División número/descripción
    doc.line(tablaInicioX + col1Total, yPos, tablaInicioX + col1Total, yPos + filaAltura); // Fin Aspecto Intelectual
    doc.line(tablaInicioX + col1Total + col2, yPos, tablaInicioX + col1Total + col2, yPos + filaAltura); // División 2
    doc.line(tablaInicioX + col1Total + col2 + col3, yPos, tablaInicioX + col1Total + col2 + col3, yPos + filaAltura); // División 3
    doc.line(tablaInicioX + col1Total + col2 + col3 + col4, yPos, tablaInicioX + col1Total + col2 + col3 + col4, yPos + filaAltura); // División 4
    doc.line(tablaInicioX + col1Total + col2 + col3 + col4 + col5, yPos, tablaInicioX + col1Total + col2 + col3 + col4 + col5, yPos + filaAltura); // División 5
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    
    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);
    // Número a la izquierda
    doc.text(String(numero), tablaInicioX + 2, yPos + 3.5);
    // Descripción del aspecto a la izquierda
    doc.text(aspecto, tablaInicioX + colNumero + 2, yPos + 3.5);
    
    // Marcar X en la columna correspondiente
    const centroY = yPos + filaAltura / 2 + 1.2;
    if (inferior) {
      dibujarX(tablaInicioX + col1Total + col2 / 2, centroY);
    } else if (promedioInferior) {
      dibujarX(tablaInicioX + col1Total + col2 + col3 / 2, centroY);
    } else if (promedio) {
      dibujarX(tablaInicioX + col1Total + col2 + col3 + col4 / 2, centroY);
    } else if (promedioSuperior) {
      dibujarX(tablaInicioX + col1Total + col2 + col3 + col4 + col5 / 2, centroY);
    } else if (superior) {
      dibujarX(tablaInicioX + col1Total + col2 + col3 + col4 + col5 + anchoColumnaEvaluacion / 2, centroY);
    }
    
    yPos += filaAltura;
  });


  // Fila celeste: Aspectos de Personalidad | Bajo | Promedio Bajo | Promedio | Promedio Alto | Alto
  // Misma estructura que Aspecto Intelectual (reutilizar las mismas constantes)
  const colNumeroPersonalidad = colNumero; // Reutilizar el mismo ancho
  const col1TotalPersonalidad = col1Total; // Total columna Aspectos de Personalidad
  
  // Ancho disponible para las 5 columnas de evaluación: (200 - 68) / 5 = 26.4mm
  const anchoColumnaEvaluacionPersonalidad = anchoColumnaEvaluacion; // Mismo ancho
  const col2Personalidad = col2; // Bajo
  const col3Personalidad = col3; // Promedio Bajo
  const col4Personalidad = col4; // Promedio
  const col5Personalidad = col5; // Promedio Alto
  
  // Dibujar fondo celeste
  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  
  // Dibujar líneas verticales para las columnas del header (sin división interna en header)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + col1TotalPersonalidad, yPos, tablaInicioX + col1TotalPersonalidad, yPos + filaAltura); // Fin Aspectos de Personalidad
  doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad, yPos + filaAltura); // División 2
  doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad, yPos + filaAltura); // División 3
  doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad, yPos + filaAltura); // División 4
  doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad, yPos + filaAltura); // División 5
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  
  // Texto de las columnas del header (todos centrados)
  doc.setFont("helvetica", "bold").setFontSize(7);
  // Aspectos de Personalidad centrado en toda la columna (sin división en header)
  doc.text("Aspectos de Personalidad", tablaInicioX + col1TotalPersonalidad / 2, yPos + 3.5, { align: "center" });
  // Títulos de evaluación centrados
  doc.text("Bajo", tablaInicioX + col1TotalPersonalidad + col2Personalidad / 2, yPos + 3.5, { align: "center" });
  doc.text("Promedio Bajo", tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad / 2, yPos + 3.5, { align: "center" });
  doc.text("Promedio", tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad / 2, yPos + 3.5, { align: "center" });
  doc.text("Promedio Alto", tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad / 2, yPos + 3.5, { align: "center" });
  doc.text("Alto", tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad + anchoColumnaEvaluacionPersonalidad / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // === FILAS DE ASPECTOS DE PERSONALIDAD ===
  const aspectosPersonalidad = [
    "Estabilidad emocional",
    "Tolerancia a la frustración",
    "Autoestima",
    "Asertividad",
    "Ansiedad ESTADO",
    "Ansiedad RASGO"
  ];

  aspectosPersonalidad.forEach((aspecto, index) => {
    const numero = index + 1;
    const aspectoNum = numero;
    
    // Obtener datos para este aspecto
    const bajo = data[`aspectoPersonalidad${aspectoNum}B`];
    const promedioBajo = data[`aspectoPersonalidad${aspectoNum}NPB`];
    const promedio = data[`aspectoPersonalidad${aspectoNum}NP`];
    const promedioAlto = data[`aspectoPersonalidad${aspectoNum}NPA`];
    const alto = data[`aspectoPersonalidad${aspectoNum}A`];
    
    // Dibujar líneas de la fila (con división interna en Aspectos de Personalidad)
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + colNumeroPersonalidad, yPos, tablaInicioX + colNumeroPersonalidad, yPos + filaAltura); // División número/descripción
    doc.line(tablaInicioX + col1TotalPersonalidad, yPos, tablaInicioX + col1TotalPersonalidad, yPos + filaAltura); // Fin Aspectos de Personalidad
    doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad, yPos + filaAltura); // División 2
    doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad, yPos + filaAltura); // División 3
    doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad, yPos + filaAltura); // División 4
    doc.line(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad, yPos, tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad, yPos + filaAltura); // División 5
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    
    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);
    // Número a la izquierda
    doc.text(String(numero), tablaInicioX + 2, yPos + 3.5);
    // Descripción del aspecto a la izquierda
    doc.text(aspecto, tablaInicioX + colNumeroPersonalidad + 2, yPos + 3.5);
    
    // Marcar X en la columna correspondiente
    const centroY = yPos + filaAltura / 2 + 1.2;
    if (bajo) {
      dibujarX(tablaInicioX + col1TotalPersonalidad + col2Personalidad / 2, centroY);
    } else if (promedioBajo) {
      dibujarX(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad / 2, centroY);
    } else if (promedio) {
      dibujarX(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad / 2, centroY);
    } else if (promedioAlto) {
      dibujarX(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad / 2, centroY);
    } else if (alto) {
      dibujarX(tablaInicioX + col1TotalPersonalidad + col2Personalidad + col3Personalidad + col4Personalidad + col5Personalidad + anchoColumnaEvaluacionPersonalidad / 2, centroY);
    }
    
    yPos += filaAltura;
  });

  // === SECCIÓN: ASPECTOS CONDUCTUALES ===
  // Fila celeste: Aspectos Conductuales (sin columnas de evaluación)
  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  
  // Dibujar líneas del borde
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Texto del título centrado
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Aspectos Conductuales", tablaInicioX + tablaAncho / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // Dividir columnas para Aspectos Conductuales
  const colNumeroConductual = 8; // Columna para números
  const colDescripcionConductual = 60; // Columna para descripción
  // La columna de valor ocupa el resto del espacio disponible (más ancha que descripción)

  // === FILAS DE ASPECTOS CONDUCTUALES ===
  const aspectosConductuales = [
    {
      descripcion: "Nivel de alerta ante el riesgo",
      valor: datosFinales.nivelAlertaRiesgo || "-"
    },
    {
      descripcion: "Tipo de hostigamiento sexual",
      valor: datosFinales.tipoHostigamientoSexual || "-"
    },
    {
      descripcion: "Tipo de consecuencia encontrada",
      valor: datosFinales.tipoConsecuenciaEncontrada || "-"
    }
  ];

  aspectosConductuales.forEach((aspecto, index) => {
    const numero = index + 1;
    
    // Dibujar líneas de la fila
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + colNumeroConductual, yPos, tablaInicioX + colNumeroConductual, yPos + filaAltura); // División número
    doc.line(tablaInicioX + colNumeroConductual + colDescripcionConductual, yPos, tablaInicioX + colNumeroConductual + colDescripcionConductual, yPos + filaAltura); // División descripción/valor
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    
    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);
    // Número a la izquierda
    doc.text(String(numero), tablaInicioX + 2, yPos + 3.5);
    // Descripción del aspecto a la izquierda
    doc.text(aspecto.descripcion, tablaInicioX + colNumeroConductual + 2, yPos + 3.5);
    // Valor (o "-" si no existe) alineado a la izquierda
    doc.text(String(aspecto.valor), tablaInicioX + colNumeroConductual + colDescripcionConductual + 2, yPos + 3.5);
    
    yPos += filaAltura;
  });

  // === SECCIÓN: ASPECTOS PSICOLABORALES ===
  // Fila celeste: Aspectos Psicolaborales | Poco desarrollado | Necesita mejorar | Adecuado | Destacado | Excepcional
  // Misma estructura que Aspecto Intelectual
  const colNumeroPsicolaboral = colNumero; // Reutilizar el mismo ancho
  const col1TotalPsicolaboral = col1Total; // Total columna Aspectos Psicolaborales
  
  // Ancho disponible para las 5 columnas de evaluación: (200 - 68) / 5 = 26.4mm
  const anchoColumnaEvaluacionPsicolaboral = anchoColumnaEvaluacion; // Mismo ancho
  const col2Psicolaboral = anchoColumnaEvaluacionPsicolaboral; // Poco desarrollado
  const col3Psicolaboral = anchoColumnaEvaluacionPsicolaboral; // Necesita mejorar
  const col4Psicolaboral = anchoColumnaEvaluacionPsicolaboral; // Adecuado
  const col5Psicolaboral = anchoColumnaEvaluacionPsicolaboral; // Destacado
  
  // Dibujar fondo celeste
  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  
  // Dibujar líneas verticales para las columnas del header (sin división interna en header)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
  doc.line(tablaInicioX + col1TotalPsicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral, yPos + filaAltura); // Fin Aspectos Psicolaborales
  doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral, yPos + filaAltura); // División 2
  doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral, yPos + filaAltura); // División 3
  doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral, yPos + filaAltura); // División 4
  doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral, yPos + filaAltura); // División 5
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
  
  // Texto de las columnas del header (todos centrados)
  doc.setFont("helvetica", "bold").setFontSize(7);
  // Aspectos Psicolaborales centrado en toda la columna (sin división en header)
  doc.text("Aspectos Psicolaborales", tablaInicioX + col1TotalPsicolaboral / 2, yPos + 3.5, { align: "center" });
  // Títulos de evaluación centrados
  doc.text("Poco desarrollado", tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral / 2, yPos + 3.5, { align: "center" });
  doc.text("Necesita mejorar", tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral / 2, yPos + 3.5, { align: "center" });
  doc.text("Adecuado", tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral / 2, yPos + 3.5, { align: "center" });
  doc.text("Destacado", tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral / 2, yPos + 3.5, { align: "center" });
  doc.text("Excepcional", tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral + anchoColumnaEvaluacionPsicolaboral / 2, yPos + 3.5, { align: "center" });
  yPos += filaAltura;

  // === FILAS DE ASPECTOS PSICOLABORALES ===
  const aspectosPsicolaborales = [
    "Capacidad de influencia",
    "Adaptacion a los cambios",
    "Trabajo en equipo y colaboración",
    "Orientación a la acción y mejora de procesos",
    "Autonomia y proactividad",
    "Toma de decisiones",
    "Crecimiento personal",
    "Motivación"
  ];

  aspectosPsicolaborales.forEach((aspecto, index) => {
    const numero = index + 1;
    const aspectoNum = numero;
    
    // Obtener datos para este aspecto
    const pocoDesarrollado = data[`aspectosPsicolaborales${aspectoNum}PD`];
    const necesitaMejorar = data[`aspectosPsicolaborales${aspectoNum}NM`];
    const adecuado = data[`aspectosPsicolaborales${aspectoNum}A`];
    const destacado = data[`aspectosPsicolaborales${aspectoNum}D`];
    const excepcional = data[`aspectosPsicolaborales${aspectoNum}E`] || data[`aspectosPsicolaborales${aspectoNum}NA`];
    
    // Dibujar líneas de la fila (con división interna en Aspectos Psicolaborales)
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura); // Línea izquierda
    doc.line(tablaInicioX + colNumeroPsicolaboral, yPos, tablaInicioX + colNumeroPsicolaboral, yPos + filaAltura); // División número/descripción
    doc.line(tablaInicioX + col1TotalPsicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral, yPos + filaAltura); // Fin Aspectos Psicolaborales
    doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral, yPos + filaAltura); // División 2
    doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral, yPos + filaAltura); // División 3
    doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral, yPos + filaAltura); // División 4
    doc.line(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral, yPos, tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral, yPos + filaAltura); // División 5
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea derecha
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos); // Línea superior
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura); // Línea inferior
    
    // Contenido de la fila
    doc.setFont("helvetica", "normal").setFontSize(8);
    // Número a la izquierda
    doc.text(String(numero), tablaInicioX + 2, yPos + 3.5);
    // Descripción del aspecto a la izquierda
    doc.text(aspecto, tablaInicioX + colNumeroPsicolaboral + 2, yPos + 3.5);
    
    // Marcar X en la columna correspondiente
    const centroY = yPos + filaAltura / 2 + 1.2;
    if (pocoDesarrollado) {
      dibujarX(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral / 2, centroY);
    } else if (necesitaMejorar) {
      dibujarX(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral / 2, centroY);
    } else if (adecuado) {
      dibujarX(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral / 2, centroY);
    } else if (destacado) {
      dibujarX(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral / 2, centroY);
    } else if (excepcional) {
      dibujarX(tablaInicioX + col1TotalPsicolaboral + col2Psicolaboral + col3Psicolaboral + col4Psicolaboral + col5Psicolaboral + anchoColumnaEvaluacionPsicolaboral / 2, centroY);
    }
    
    yPos += filaAltura;
  });

  // === SECCIÓN: OBSERVACIONES ===
  // Verificar si necesitamos nueva página antes de OBSERVACIONES
  const espacioMinimo = 15; // Espacio mínimo necesario para la sección
  
  if (yPos + espacioMinimo > pageHeight - 20) { // 20mm para footer
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    drawHeader(numeroPagina);
  }
  
  // Fila celeste: OBSERVACIONES
  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  
  // Dibujar líneas del borde
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Texto del título
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("OBSERVACIONES:", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;
  
  // Fila dinámica para contenido de observaciones
  const textoObservaciones = (datosFinales.observaciones || "-").toUpperCase();
  
  // Dibujar borde superior y laterales de la fila
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  
  // Dibujar texto con salto de línea (fuente 7px)
  doc.setFont("helvetica", "normal").setFontSize(7);
  let yFinalObservaciones = dibujarTextoConSaltoLinea(textoObservaciones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
  
  // Verificar si necesitamos nueva página durante el dibujado
  const alturaMaximaObs = pageHeight - yPos - 25; // 25mm para footer y margen
  if (yFinalObservaciones - yPos > alturaMaximaObs) {
    // Texto muy largo, necesitamos nueva página
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    drawHeader(numeroPagina);
    // Redibujar texto en nueva página desde el inicio
    doc.setFont("helvetica", "normal").setFontSize(7);
    yFinalObservaciones = dibujarTextoConSaltoLinea(textoObservaciones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
  }
  
  // Calcular altura real de la fila y redibujar si es necesario
  const alturaNecesariaObservaciones = yFinalObservaciones - yPos;
  const alturaMinimaFilaObs = filaAltura;
  const alturaRealObservaciones = Math.max(alturaMinimaFilaObs, alturaNecesariaObservaciones + 2);
  
  // Redibujar los bordes con la altura correcta
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaRealObservaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaRealObservaciones);
  doc.line(tablaInicioX, yPos + alturaRealObservaciones, tablaInicioX + tablaAncho, yPos + alturaRealObservaciones);
  
  yPos += alturaRealObservaciones;

  // === SECCIÓN: RECOMENDACIONES ===
  // Verificar si necesitamos nueva página antes de RECOMENDACIONES
  if (yPos + espacioMinimo > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    drawHeader(numeroPagina);
  }
  
  // Fila celeste: RECOMENDACIONES
  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  
  // Dibujar líneas del borde
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // Texto del título
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("RECOMENDACIONES:", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;
  
  // Fila dinámica para contenido de recomendaciones
  const textoRecomendaciones = (datosFinales.recomendaciones || "-").toUpperCase();
  
  // Dibujar borde superior y laterales de la fila
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  
  // Dibujar texto con salto de línea (fuente 7px)
  doc.setFont("helvetica", "normal").setFontSize(7);
  let yFinalRecomendaciones = dibujarTextoConSaltoLinea(textoRecomendaciones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
  
  // Verificar si necesitamos nueva página durante el dibujado
  const alturaMaximaRec = pageHeight - yPos - 25; // 25mm para footer y margen
  if (yFinalRecomendaciones - yPos > alturaMaximaRec) {
    // Texto muy largo, necesitamos nueva página
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    drawHeader(numeroPagina);
    // Redibujar texto en nueva página desde el inicio
    doc.setFont("helvetica", "normal").setFontSize(7);
    yFinalRecomendaciones = dibujarTextoConSaltoLinea(textoRecomendaciones, tablaInicioX + 2, yPos + 3, tablaAncho - 4);
  }
  
  // Calcular altura real de la fila y redibujar si es necesario
  const alturaNecesariaRecomendaciones = yFinalRecomendaciones - yPos;
  const alturaMinimaFilaRec = filaAltura;
  const alturaRealRecomendaciones = Math.max(alturaMinimaFilaRec, alturaNecesariaRecomendaciones + 2);
  
  // Redibujar los bordes con la altura correcta
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaRealRecomendaciones);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaRealRecomendaciones);
  doc.line(tablaInicioX, yPos + alturaRealRecomendaciones, tablaInicioX + tablaAncho, yPos + alturaRealRecomendaciones);
  
  yPos += alturaRealRecomendaciones;

  // === SECCIÓN: CONCLUSIÓN (CUMPLE/NO CUMPLE CON EL PERFIL) ===
  // Verificar si necesitamos nueva página antes de la conclusión
  if (yPos + filaAltura + 5 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    drawHeader(numeroPagina);
  }
  
  // Fila con dos columnas iguales
  const anchoColumna = tablaAncho / 2;
  
  // Dibujar bordes de la sección
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  
  // Línea vertical central
  doc.line(tablaInicioX + anchoColumna, yPos, tablaInicioX + anchoColumna, yPos + filaAltura);
  // Bordes externos
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);
  
  // === COLUMNA IZQUIERDA: CUMPLE CON EL PERFIL ===
  // División vertical dentro de la columna izquierda (separando texto de mini celda)
  const miniCeldaSize = 6;
  const divisionCumpleX = tablaInicioX + anchoColumna - miniCeldaSize;
  doc.line(divisionCumpleX, yPos, divisionCumpleX, yPos + filaAltura);
  
  // Texto "CUMPLE CON EL PERFIL"
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CUMPLE CON EL PERFIL", tablaInicioX + 2, yPos + 3.5);
  
  // Mini celda integrada en la fila (a la derecha, antes de la línea central)
  const miniCeldaXCumple = divisionCumpleX;
  const miniCeldaYCumple = yPos;
  
  // La mini celda usa los bordes ya dibujados de la fila, solo agregamos línea inferior interna
  // (las líneas verticales y superior/inferior de la fila principal ya están dibujadas)
  
  // Marcar con X si cumplePerfil es true
  if (datosFinales.cumplePerfil === true) {
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 255); // Azul para la X
    doc.text("X", miniCeldaXCumple + miniCeldaSize / 2, miniCeldaYCumple + filaAltura / 2 + 1.2, { align: "center" });
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  // === COLUMNA DERECHA: NO CUMPLE CON EL PERFIL ===
  // División vertical dentro de la columna derecha (separando texto de mini celda)
  const divisionNoCumpleX = tablaInicioX + tablaAncho - miniCeldaSize;
  doc.line(divisionNoCumpleX, yPos, divisionNoCumpleX, yPos + filaAltura);
  
  // Texto "NO CUMPLE CON EL PERFIL"
  const xTextoNoCumple = tablaInicioX + anchoColumna + 2;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("NO CUMPLE CON EL PERFIL", xTextoNoCumple, yPos + 3.5);
  
  // Mini celda integrada en la fila (a la derecha)
  const miniCeldaXNoCumple = divisionNoCumpleX;
  const miniCeldaYNoCumple = yPos;
  
  // La mini celda usa los bordes ya dibujados de la fila
  
  // Marcar con X si cumplePerfil es false
  if (datosFinales.cumplePerfil === false) {
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 255); // Azul para la X
    doc.text("X", miniCeldaXNoCumple + miniCeldaSize / 2, miniCeldaYNoCumple + filaAltura / 2 + 1.2, { align: "center" });
    doc.setTextColor(0, 0, 0); // Resetear a negro
  }
  
  yPos += filaAltura;

  // === SECCIÓN DE FIRMA Y SELLO DEL MÉDICO ===
  // Verificar si necesitamos nueva página antes de la firma
  if (yPos + 30 > pageHeight - 20) {
    doc.addPage();
    numeroPagina++;
    yPos = 45;
    drawHeader(numeroPagina);
  }
  
  const alturaSeccionFirma = 30; // Altura para la sección de firma
  const yFirmas = yPos;
  
  // Dibujar líneas de la sección de firma (bordes)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(tablaInicioX, yFirmas, tablaInicioX, yFirmas + alturaSeccionFirma); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yFirmas, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirma); // Línea derecha
  doc.line(tablaInicioX, yFirmas, tablaInicioX + tablaAncho, yFirmas); // Línea superior
  doc.line(tablaInicioX, yFirmas + alturaSeccionFirma, tablaInicioX + tablaAncho, yFirmas + alturaSeccionFirma); // Línea inferior
  
  // === SELLO Y FIRMA DEL MÉDICO (CENTRADO) ===
  const firmaMedicoY = yFirmas + 3;
  const centroX = tablaInicioX + tablaAncho / 2; // Centro de la página
  
  // Agregar firma y sello médico
  let firmaMedicoUrl = getSign(data, "SELLOFIRMA");
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 45;
      const imgHeight = 20;
      const x = centroX - (imgWidth / 2); // Centrar horizontalmente
      const y = firmaMedicoY;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.text("Sello y Firma del Médico", centroX, yFirmas + 26, { align: "center" });
  doc.text("Responsable de la Evaluación", centroX, yFirmas + 28.5, { align: "center" });
  
  yPos += alturaSeccionFirma;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 12, fontSize: 7 });

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

