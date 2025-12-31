import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { convertirGenero } from "../../utils/helpers.js";
import drawColorBox from '../components/ColorBox.jsx';
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import footerTR from '../components/footerTR.jsx';

export default async function Oftalmologia(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Preparar datos reales
  const datosReales = {
    apellidosNombres: String(datos.nombres || "").trim(),
    fechaExamen: formatearFechaCorta(datos.fechaOf),
    tipoExamen: String(datos.nomExam || ""),
    sexo: convertirGenero(datos.sexo),
    documentoIdentidad: String(datos.dni || ""),
    edad: String(datos.edad || ""),
    areaTrabajo: datos.area || "",
    puestoTrabajo: datos.cargo || "",
    empresa: datos.empresa || "",
    contrata: datos.contrata || "",
    // Datos de color
    color: datos.color,
    codigoColor: datos.codigoColor,
    textoColor: datos.textoColor,
    // Datos adicionales para header
    numeroFicha: String(datos.norden || ""),
    sede: datos.sede || "",
    // Datos adicionales
    direccionPaciente: String(datos.direccion || ""),
    fechaNacimiento: formatearFechaCorta(datos.fechaNac),
  };

  // Función para convertir texto a mayúsculas
  const formatearTextoGramatical = (texto) => {
    if (!texto || typeof texto !== 'string') return texto;
    return texto.toUpperCase();
  };

  // Header reutilizable
  const drawHeader = async (pageNumber) => {
    // Logo y membrete
    await CabeceraLogo(doc, { ...datosReales, tieneMembrete: false });

    // Título principal (en todas las páginas)
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("FICHA OFTALMOLÓGICA", pageW / 2, 32.5, { align: "center" });

    // Número de Ficha y Página (alineación automática mejorada)
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosReales.numeroFicha, pageW - 60, 16);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosReales.sede, pageW - 80, 20);
    doc.text("Fecha de examen: " + datosReales.fechaExamen, pageW - 80, 25);

    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 30, 10);

    // Bloque de color (posición mejorada)
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
  };

  // === DIBUJAR HEADER ===
  await drawHeader(numeroPagina);

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
  dibujarTextoConSaltoLinea(datosReales.apellidosNombres, tablaInicioX + 35, yTexto + 1.5, 95);

  // Columna derecha: Tipo de examen
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("T. Examen:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosReales.tipoExamen), tablaInicioX + 155, yTexto + 1.5);
  yTexto += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac.
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.documentoIdentidad, tablaInicioX + 12, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + 47, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.edad + " AÑOS", tablaInicioX + 58, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosReales.sexo), tablaInicioX + 105, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + 137, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.fechaNacimiento, tablaInicioX + 155, yTexto + 1.5);
  yTexto += filaAltura;

  // Tercera fila: Domicilio
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Domicilio:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(datosReales.direccionPaciente, tablaInicioX + 25, yTexto + 1.5, 160);
  yTexto += filaAltura;

  // Cuarta fila: Puesto de Trabajo, Área de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosReales.puestoTrabajo), tablaInicioX + 30, yTexto + 1.5);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + 92, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosReales.areaTrabajo), tablaInicioX + 118, yTexto + 1.5);
  yTexto += filaAltura;

  // Quinta fila: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  dibujarTextoConSaltoLinea(formatearTextoGramatical(datosReales.empresa), tablaInicioX + 24, yTexto + 1.5, tablaAncho - 30);
  yTexto += filaAltura;

  // Sexta fila: Contratista
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yTexto + 1.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(formatearTextoGramatical(datosReales.contrata), tablaInicioX + 24, yTexto + 1.5);
  yTexto += filaAltura;

  // === SECCIÓN 2: EXAMEN OFTALMOLÓGICO ===
  yPos = dibujarHeaderSeccion("2. EXAMEN OFTALMOLÓGICO", yPos, filaAltura);

  // Calcular altura dinámica del cuadro basada en el contenido
  const calcularAlturaCuadro = () => {
    doc.setFontSize(8); // Establecer tamaño de fuente para cálculos precisos
    let alturaBase = 75; // altura mínima aumentada hasta "Enfermedades Oculares"
    const lineHeight = 6;

    // Verificar si hay texto en enfermedades oculares y calcular líneas adicionales
    if (datos.eoculares) {
      const texto = datos.eoculares.toString();
      const maxWidth = pageW - 2 * tablaInicioX - 60; // ancho disponible para texto
      const anchoTexto = doc.getTextWidth(texto);
      const lineas = Math.ceil(anchoTexto / maxWidth);
      if (lineas > 1) {
        alturaBase += (lineas - 1) * lineHeight;
      }
      alturaBase += 20; // espacio adicional aumentado para el texto
    } else {
      alturaBase += 12; // espacio mínimo aumentado si no hay texto
    }

    // Verificar si hay texto adicional en eoculares1
    if (datos.eoculares1) {
      const texto = datos.eoculares1.toString();
      const maxWidth = pageW - 2 * tablaInicioX - 60;
      const anchoTexto = doc.getTextWidth(texto);
      const lineas = Math.ceil(anchoTexto / maxWidth);
      if (lineas > 1) {
        alturaBase += (lineas - 1) * lineHeight;
      }
      alturaBase += 12; // espacio aumentado para texto adicional
    }

    return Math.max(alturaBase, 90); // altura mínima aumentada de 90mm
  };

  // Caja principal con altura dinámica
  const boxH = calcularAlturaCuadro();
  const margin = tablaInicioX;
  let y = yPos;
  doc.setLineWidth(0.3); // Línea más delgada (cambiado de 0.7 a 0.3)
  doc.rect(margin, y, pageW - 2 * margin, boxH);
  doc.setLineWidth(0.2);
  // Encabezados de la caja
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("SIN CORREGIR", margin + 83, y + 10, { align: "center" });
  doc.text("CORREGIDA", margin + 148, y + 10, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("O.D", margin + 69, y + 18, { align: "center" });
  doc.text("O.I", margin + 94, y + 18, { align: "center" });
  doc.text("O.D", margin + 134, y + 18, { align: "center" });
  doc.text("O.I", margin + 159, y + 18, { align: "center" });
  // Visión de cerca
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.rect(margin + 60, y + 22, 18, 8);
  doc.text(`${datos.vcercaSOd ?? ""}`, margin + 69, y + 27.5, {
    align: "center",
  });
  doc.rect(margin + 85, y + 22, 18, 8);
  doc.text(`${datos.vcercaSOi ?? ""}`, margin + 94, y + 27.5, {
    align: "center",
  });
  doc.rect(margin + 125, y + 22, 18, 8);
  doc.text(`${datos.vcercaCOd ?? ""}`, margin + 134, y + 27.5, {
    align: "center",
  });
  doc.rect(margin + 150, y + 22, 18, 8);
  doc.text(`${datos.vcercaCOi ?? ""}`, margin + 159, y + 27.5, {
    align: "center",
  });
  // Visión de lejos
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.rect(margin + 60, y + 32, 18, 8);
  doc.text(`${datos.vlejosSOd ?? ""}`, margin + 69, y + 37.5, {
    align: "center",
  });
  doc.rect(margin + 85, y + 32, 18, 8);
  doc.text(`${datos.vlejosSOi ?? ""}`, margin + 94, y + 37.5, {
    align: "center",
  });
  doc.rect(margin + 125, y + 32, 18, 8);
  doc.text(`${datos.vlejosCOd ?? ""}`, margin + 134, y + 37.5, {
    align: "center",
  });
  doc.rect(margin + 150, y + 32, 18, 8);
  doc.text(`${datos.vlejosCOi ?? ""}`, margin + 159, y + 37.5, {
    align: "center",
  });

  // Sección de observaciones con formato de dos columnas
  const labelX = margin + 45; // Movido más a la derecha para que no se corte
  const startY = y + 65;
  const lineHeight = 8;

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Visión de Cerca", labelX, y + 28, { align: "right" });
  doc.text(":", labelX + 2, y + 28);
  doc.text("Visión de Lejos", labelX, y + 38, { align: "right" });
  doc.text(":", labelX + 2, y + 38);

  // Visión de colores
  doc.text("Visión de Colores", labelX, startY - 13, { align: "right" });
  doc.text(":", labelX + 2, startY - 13);
  doc.text(`${(datos.vcolores ?? "").toUpperCase()}`, margin + 60, startY - 13);

  // Visión binocular
  doc.text("Visión Binocular", labelX, startY + lineHeight - 13, {
    align: "right",
  });
  doc.text(":", labelX + 2, startY + lineHeight - 13);
  doc.text(
    `${(datos.vbinocular ?? "").toUpperCase()}`,
    margin + 60,
    startY + lineHeight - 13
  );

  // Reflejos pupilares
  doc.text("Reflejos Pupilares", labelX, startY + lineHeight * 2 - 13, {
    align: "right",
  });
  doc.text(":", labelX + 2, startY + lineHeight * 2 - 13);
  doc.text(
    `${(datos.rpupilares ?? "").toUpperCase()}`,
    margin + 60,
    startY + lineHeight * 2 - 13
  );

  // Enfermedades oculares
  doc.text("Enfermedades Oculares", labelX, startY + lineHeight * 3 - 13, {
    align: "right",
  });
  doc.text(":", labelX + 2, startY + lineHeight * 3 - 13);
  doc.text(
    `${(datos.eoculares ?? "").toUpperCase()}`,
    margin + 60,
    startY + lineHeight * 3 - 13
  );

  // Observación extra - alineada con el primer dato, no con la etiqueta
  if (datos.eoculares1) {
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(
      `${(datos.eoculares1 ?? "").toUpperCase()}`,
      margin + 60,
      startY + lineHeight * 4 - 13
    );
  }

  // Arreglo de firmas que quieres cargar
  const firmasAPintar = [
    { nombre: "SELLOFIRMADOCASIG", x: 50, y: y + boxH + 20, maxw: 50 },
    { nombre: "SELLOFIRMA", x: 120, y: y + boxH + 20, maxw: 50 },
  ];

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });

  agregarFirmas(doc, datos.digitalizacion, firmasAPintar).then(() => {
    if (docExistente) {
      return doc;
    } else {
      imprimir(doc);
    }
  });
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

function agregarFirmas(doc, digitalizacion = [], firmasAPintar = []) {
  const addSello = (imagenUrl, x, y, maxw = 100) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imagenUrl;

      // img.onload = () => {
      //   let sigW = maxw;
      //   const sigH = 35;
      //   const baseX = x;
      //   const baseY = y;
      //   const maxW = sigW - 10;
      //   const maxH = sigH - 10;
      //   let imgW = img.width;
      //   let imgH = img.height;
      //   const scale = Math.min(maxW / imgW, maxH / imgH, 1);
      //   imgW *= scale;
      //   imgH *= scale;
      //   const imgX = baseX + (sigW - imgW) / 2;
      //   const imgY = baseY + (sigH - imgH) / 2;
      //   doc.addImage(imagenUrl, "PNG", imgX, imgY, imgW, imgH);
      //   resolve();
      // };
      img.onload = () => {
        const sigH = 35; // alto máximo
        const maxW = maxw; // ancho máximo como parámetro
        const baseX = x;
        const baseY = y;

        let imgW = img.width;
        let imgH = img.height;

        // Escala proporcional en base a ancho y alto máximos
        const scale = Math.min(maxW / imgW, sigH / imgH, 1);
        imgW *= scale;
        imgH *= scale;

        // Ahora el ancho se adapta
        const sigW = imgW;

        // Centrar la imagen
        const imgX = baseX + (sigW - imgW) / 2;
        const imgY = baseY + (sigH - imgH) / 2;

        doc.addImage(imagenUrl, "PNG", imgX, imgY, imgW, imgH);
        resolve();
      };
      img.onerror = (e) => {
        console.error("Error al cargar la imagen:", e);
        resolve();
      };
    });
  };

  const firmas = digitalizacion.reduce(
    (acc, d) => ({ ...acc, [d.nombreDigitalizacion]: d.url }),
    {}
  );

  const promesasFirmas = firmasAPintar
    .filter((f) => firmas[f.nombre])
    .map((f) => addSello(firmas[f.nombre], f.x, f.y, f.maxw));

  return Promise.all(promesasFirmas);
}
