import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";
import { getSign } from "../../utils/helpers";
import drawColorBox from '../components/ColorBox.jsx';

export default function Aptitud_AgroindustrialH(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Datos de prueba por defecto
  const datosPrueba = {
    numeroHistoria: "96639",
    tipoExamen: "PRE-OCUPACIONAL",
    apellidosNombres: "HADY KATHERINE CASTILLO PLASENCIA",
    documentoIdentidad: "72384273",
    genero: "FEMENINO",
    edad: "31 AÑOS",
    empresa: "MINERA BOROO MISQUICHILCA S.A.C",
    contratista: "LIMALA S.A.C MINERA BOROO MMINERA BOROO MMINERA",
    puestoPostula: "ASISTENTE ADMINISTRATIVA",
    ocupacionActual: "ADMINISTRACION",
    fechaExamen: "04/11/2024",
    // Datos de color
    color: 1,
    codigoColor: "#008f39",
    textoColor: "F",
  // Datos adicionales para header
  numeroFicha: "99164",
  sede: "Trujillo-Pierola Nicoldo de Pierola",
  // Datos de conclusiones
  conclusiones: [
    "INFORME RADIOGRAFICO: Radiografía de tórax realizada en proyección posteroanterior.",
    "CONCLUCIONES: RADIOAGRAFIA DE COLUMNA LUMBOSACRA AP-L",
    "ODONTOGRAMA: Paciente con varias piezas tratadas. Se recomienda seguimiento. prueba Campos claros, sin alteraciones pruebaHilios normales, sin adenopatíasSenos costofrénicos libresCampos pulmonares bien aireadosMediastinos sin desplazamientoSilueta cardiaca normalEstructuras óseas conservadasRadiografía de tórax sin hallazgos patológicos evidentes-RADIOGRAFIA: Paciente sin síntomas respiratorios al momento del examen",
    
  ]
  };

  const datosReales = {
    numeroHistoria: String(data.numeroHistoria || ""),
    tipoExamen: String(data.tipoExamen || ""),
    apellidosNombres: String((data.apellidos_apellidos_pa ?? "") + " " + (data.nombres_nombres_pa ?? "")).trim(),
    documentoIdentidad: String(data.dni_cod_pa ?? ""),
    genero: String(data.sexo_sexo_pa ?? ""),
    edad: String(data.edad_edad ?? ""),
    empresa: String(data.empresa_razon_empresa ?? ""),
    contratista: String(data.contrata_razon_contrata ?? ""),
    puestoPostula: String(data.cargo_cargo_de ?? ""),
    ocupacionActual: String(data.ocupacionActual ?? ""),
    fechaExamen: formatearFechaCorta(data.fechaExamen ?? ""),
    // Datos de color
    color: data.color || data.informacionSede?.color || 1,
    codigoColor: data.codigoColor || data.informacionSede?.codigoColor || "#008f39",
    textoColor: data.textoColor || data.informacionSede?.textoColor || "F",
    // Datos adicionales para header
    numeroFicha: data.numeroFicha || data.ficha || data.numero || "99164",
    sede: data.sede || data.ubicacion || data.ciudad || "Trujillo-Pierola",
    // Datos de conclusiones
    conclusiones: data.conclusiones || data.conclusionesMedicas || []
  };

  // Usar datos reales si existen, sino usar datos de prueba
  const datosFinales = data && data.n_orden ? datosReales : datosPrueba;

  // === HEADER ===
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("CERTIFICADO DE APTITUD MEDICO OCUPACIONAL", pageW / 2, 32, { align: "center" });

  // Número de Ficha y Página
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Nro de ficha: ", pageW - 53, 15);

  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(datosFinales.numeroFicha, pageW - 33, 15);
  doc.setFont("helvetica", "normal").setFontSize(9);
  
  // Calcular ancho del texto de sede para ajustar posición
  const textoSede = "Sede: " + datosFinales.sede;
  const anchoTextoSede = doc.getTextWidth(textoSede);
  const posicionSede = Math.max(15, pageW - 16 - anchoTextoSede); // Termina justo antes del bloque de color (30mm del borde derecho)
  
  doc.text(textoSede, posicionSede, 20);
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

  // === TABLA PRINCIPAL ===
  const tablaInicioX = 15;
  const tablaInicioY = 40;
  const tablaAncho = 180;
  const filaAltura = 6;
  
  // Función para calcular altura dinámica de texto
  const calcularAlturaTexto = (texto, anchoMaximo, fontSize = 9) => {
    if (!texto || texto.trim() === '') return filaAltura;
    
    doc.setFontSize(fontSize);
    const lineHeight = fontSize * 0.5; // Altura de línea aproximada (igual que dibujarTextoConSaltoLinea)
    const palabras = texto.split(' ');
    let lineas = 1;
    let lineaActual = '';
    
    for (let palabra of palabras) {
      const textoPrueba = lineaActual + (lineaActual ? ' ' : '') + palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);
      
      if (anchoTexto > anchoMaximo) {
        if (lineaActual) {
          lineas++;
          lineaActual = palabra;
        } else {
          // Si una palabra sola es muy larga, cuenta como una línea
          lineas++;
          lineaActual = '';
        }
      } else {
        lineaActual = textoPrueba;
      }
    }
    
    // Calcular altura mínima necesaria
    const alturaNecesaria = lineas * lineHeight + 4;
    return Math.max(filaAltura, alturaNecesaria); // Mínimo la altura base
  };

  // Función para dibujar texto con salto de línea automático
  const dibujarTextoConSaltoLinea = (texto, x, y, anchoMaximo, fontSize = 9) => {
    if (!texto || texto.trim() === '') return;
    
    doc.setFontSize(fontSize);
    const lineHeight = fontSize * 0.5;
    const palabras = texto.split(' ');
    let lineaActual = '';
    let yActual = y;
    
    for (let palabra of palabras) {
      const textoPrueba = lineaActual + (lineaActual ? ' ' : '') + palabra;
      const anchoTexto = doc.getTextWidth(textoPrueba);
      
      if (anchoTexto > anchoMaximo) {
        if (lineaActual) {
          // Dibujar la línea actual y pasar a la siguiente
          doc.text(lineaActual, x, yActual);
          yActual += lineHeight;
          lineaActual = palabra;
        } else {
          // Si una palabra sola es muy larga, dibujarla de todas formas
          doc.text(palabra, x, yActual);
          yActual += lineHeight;
          lineaActual = '';
        }
      } else {
        lineaActual = textoPrueba;
      }
    }
    
    // Dibujar la última línea
    if (lineaActual) {
      doc.text(lineaActual, x, yActual);
    }
  };

  // Función para dibujar texto pegado sin espacios extra
  const dibujarTextoPegado = (texto, x, y, anchoMaximo, fontSize = 9) => {
    if (!texto || texto.trim() === '') return y;
    
    doc.setFontSize(fontSize);
    const palabras = texto.split(' ');
    let linea = '';
    let yActual = y;
    const lineHeight = fontSize * 0.5;

    palabras.forEach((palabra, i) => {
      const prueba = linea + (linea ? ' ' : '') + palabra;
      if (doc.getTextWidth(prueba) > anchoMaximo) {
        doc.text(linea, x, yActual);
        linea = palabra;
        yActual += lineHeight;
      } else {
        linea = prueba;
      }
      if (i === palabras.length - 1) {
        doc.text(linea, x, yActual);
      }
    });

    return yActual + lineHeight; // Retorna posición final
  };

  // Calcular alturas dinámicas para cada fila
  const alturaFila1 = filaAltura; // Primera fila fija (N° Historia, Tipo de Examen)
  const alturaFila2 = filaAltura; // Segunda fila fija (CERTIFICA)
  const alturaFila3 = calcularAlturaTexto(datosFinales.apellidosNombres, 130); // NOMBRES Y APELLIDOS (ancho disponible después de "NOMBRES Y APELLIDOS:")
  const alturaFila4 = filaAltura; // Cuarta fila fija (DNI, GÉNERO, EDAD)
  const alturaFila5 = Math.max(
    calcularAlturaTexto(datosFinales.empresa, 70), // Ancho disponible para EMPRESA (desde posición 20 hasta 90)
    calcularAlturaTexto(datosFinales.contratista, 70) // Ancho disponible para CONTRATISTA (desde posición 110 hasta 180)
  ); // EMPRESA y CONTRATISTA
  const alturaFila6 = Math.max(
    calcularAlturaTexto(datosFinales.puestoPostula, 70), // Ancho disponible para PUESTO
    calcularAlturaTexto(datosFinales.ocupacionActual, 70) // Ancho disponible para OCUPACIÓN
  ) + 1; // PUESTO y OCUPACIÓN (con 1mm de espacio extra)

  // Dibujar líneas de la tabla con alturas dinámicas
  let yActual = tablaInicioY;
  
  // Línea superior
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);
  yActual += alturaFila1;
  
  // Línea después de fila 1
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);
  yActual += alturaFila2;
  
  // Línea después de fila 2
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);
  yActual += alturaFila3;
  
  // Línea después de fila 3
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);
  yActual += alturaFila4;
  
  // Línea después de fila 4
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);
  yActual += alturaFila5;
  
  // Línea después de fila 5
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);
  yActual += alturaFila6;
  
  // Línea inferior
  doc.line(tablaInicioX, yActual, tablaInicioX + tablaAncho, yActual);

  // Líneas verticales con alturas dinámicas
  let yPos = tablaInicioY;
  
  // Primera fila (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila1); // Línea izquierda
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + alturaFila1); // Primera división
  doc.line(tablaInicioX + 135, yPos, tablaInicioX + 135, yPos + alturaFila1); // Tercera división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila1); // Línea derecha
  yPos += alturaFila1;
  
  // Segunda fila (CERTIFICA) - sin división vertical
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila2); // Línea izquierda
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila2); // Línea derecha
  yPos += alturaFila2;
  
  // Tercera fila (NOMBRES Y APELLIDOS) - con división en 50mm
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila3); // Línea izquierda
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + alturaFila3); // División central
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila3); // Línea derecha
  yPos += alturaFila3;
  
  // Cuarta fila (DNI, GÉNERO, EDAD) - 3 columnas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila4); // Línea izquierda
  doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + alturaFila4); // Primera división
  doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + alturaFila4); // Segunda división
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila4); // Línea derecha
  yPos += alturaFila4;
  
  // Quinta fila (EMPRESA, CONTRATISTA) - 2 columnas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila5); // Línea izquierda
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + alturaFila5); // División central
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila5); // Línea derecha
  yPos += alturaFila5;
  
  // Sexta fila (PUESTO, OCUPACIÓN) - 2 columnas
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaFila6); // Línea izquierda
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + alturaFila6); // División central
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaFila6); // Línea derecha

  // === CONTENIDO DE LA TABLA ===
  
  // Calcular posiciones Y dinámicas
  let yTexto = tablaInicioY;
  
  // Primera fila: N° Historia Clínica y Tipo de Examen
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("N° HISTORIA CLINICA :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.numeroHistoria, tablaInicioX + 47, yTexto + 4);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("TIPO DE EXAMEN :", tablaInicioX + 92, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.tipoExamen, tablaInicioX + 137, yTexto + 4);
  yTexto += alturaFila1;

  // Segunda fila: Certifica que el Sr.(a) - ocupa toda la fila
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CERTIFICA que el Sr.(a)", tablaInicioX + tablaAncho / 2, yTexto + 4, { align: "center" });
  yTexto += alturaFila2;

  // Tercera fila: Nombres y Apellidos
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("NOMBRES Y APELLIDOS:", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.apellidosNombres, tablaInicioX + 55, yTexto + 4, 130);
  yTexto += alturaFila3;

  // Cuarta fila: DNI, Género, Edad (3 columnas iguales)
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DNI :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.documentoIdentidad, tablaInicioX + 15, yTexto + 4);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("GENERO :", tablaInicioX + 62, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.genero, tablaInicioX + 80, yTexto + 4);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("EDAD :", tablaInicioX + 122, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.edad, tablaInicioX + 135, yTexto + 4);
  yTexto += alturaFila4;

  // Quinta fila: Empresa y Contratista
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("EMPRESA :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.empresa, tablaInicioX + 20, yTexto + 4, 70);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("CONTRATISTA :", tablaInicioX + 92, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.contratista, tablaInicioX + 117, yTexto + 4, 70);
  yTexto += alturaFila5;

  // Sexta fila: Puesto al que Postula y Ocupación Actual
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("PUESTO POSTULA :", tablaInicioX + 2, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.puestoPostula, tablaInicioX + 35, yTexto + 4, 70);

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("OCUPACION :", tablaInicioX + 92, yTexto + 4);
  doc.setFont("helvetica", "normal").setFontSize(9);
  dibujarTextoConSaltoLinea(datosFinales.ocupacionActual, tablaInicioX + 117, yTexto + 4, 70);
  yTexto += alturaFila6;

  
  yTexto +=8; // Espacio después de la fecha

  // === TÍTULO PRINCIPAL ===
  if (datosFinales.conclusiones && datosFinales.conclusiones.length > 0) {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text("HE PASADO EXAMEN MÉDICO EN POLICLÍNICO HORIZONTE MEDIC, TENIENDO COMO:", 15, yTexto);
    yTexto += 2;
  }

  // === SECCIÓN DE CONCLUSIONES ===
  if (datosFinales.conclusiones && datosFinales.conclusiones.length > 0) {
    const marcoInicioX = 15;
    const marcoInicioY = yTexto;
    const marcoAncho = 180;
    
    // Calcular altura total necesaria para todas las conclusiones
    let alturaTotalConclusiones = 12; // Solo subtítulo
    datosFinales.conclusiones.forEach((conclusion) => {
      alturaTotalConclusiones += calcularAlturaTexto(conclusion, 170, 9); // Sin espacio extra - pegados
    });
    alturaTotalConclusiones += 1; // Mínimo espacio para el marco
    
    // Dibujar marco
    doc.rect(marcoInicioX, marcoInicioY, marcoAncho, alturaTotalConclusiones);
    
    // Subtítulo
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("CONCLUSIONES:", marcoInicioX + 5, yTexto + 6);
    yTexto += 12;

    // Dibujar cada conclusión pegada
    let yPosConclusiones = yTexto;
    datosFinales.conclusiones.forEach((conclusion) => {
      doc.setFont("helvetica", "normal").setFontSize(9);
      yPosConclusiones = dibujarTextoPegado(conclusion, marcoInicioX + 5, yPosConclusiones, 170, 9);
    });
    
    yTexto += 3; // Espacio después del marco
  }

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
