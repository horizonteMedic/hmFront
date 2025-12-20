import jsPDF from "jspdf";

const labelsToImgs = {
  Ausente: "imgAusente",
  "Cariada por opturar": "imgPorOturar",
  "Por extraer": "imgExtraer",
  Fracturada: "imgFracturada",
  Corona: "imgCorona",
  "Obturacion Efectuada": "imgObturacionEfectuada",
  Puente: "imgPuente",
  "P.P.R Metalica": "imgPPRMetalica",
  "P.P.R Acrilica": "imgPPRAcrilica",
  "P.Total": "imgPTotal",
};

// Invertimos el objeto automáticamente
const imgsToLabels = Object.fromEntries(
  Object.entries(labelsToImgs).map(([label, img]) => [img, label])
);

const interpretarUrlParaLeer = (url) => {
  if (url == null) return "Normal";
  const match = url.match(/([^/\\]+)(?=\.png$)/);
  const nombreArchivo = match?.[1];
  return nombreArchivo ? imgsToLabels[nombreArchivo] ?? "" : "";
};

// Función para formatear fechas de YYYY-MM-DD, YYYY/MM/DD, DD/MM/YYYY o texto como "lunes 04 noviembre 2024" a "LUNES DD DE MES DEL YYYY"
const formatearFecha = (fecha) => {
  if (!fecha || fecha.trim() === "") return "";

  const meses = {
    "01": "ENERO", "02": "FEBRERO", "03": "MARZO", "04": "ABRIL",
    "05": "MAYO", "06": "JUNIO", "07": "JULIO", "08": "AGOSTO",
    "09": "SEPTIEMBRE", "10": "OCTUBRE", "11": "NOVIEMBRE", "12": "DICIEMBRE"
  };

  const mesesTexto = {
    "enero": "01", "febrero": "02", "marzo": "03", "abril": "04",
    "mayo": "05", "junio": "06", "julio": "07", "agosto": "08",
    "septiembre": "09", "octubre": "10", "noviembre": "11", "diciembre": "12"
  };

  const diasSemanaES = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

  // Función para obtener el día de la semana de una fecha
  const obtenerDiaSemana = (año, mes, dia) => {
    const fechaObj = new Date(año, mes - 1, dia); // mes - 1 porque Date usa 0-11
    return diasSemanaES[fechaObj.getDay()];
  };

  const fechaLimpia = fecha.trim().toLowerCase();

  // Verificar si es formato de texto (contiene nombres de meses)
  const contieneTextoMes = Object.keys(mesesTexto).some(mes => fechaLimpia.includes(mes));

  if (contieneTextoMes) {
    // Formato de texto: "lunes 04 noviembre 2024", "martes 5 de agosto del 2025", etc.
    // INCLUIR el día de la semana en el resultado final
    const diasSemana = ['lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes', 'sábado', 'sabado', 'domingo'];
    const palabrasIgnorar = ['de', 'del']; // Solo ignorar "de" y "del", NO los días de semana
    const todasLasPalabras = fechaLimpia.split(/\s+/);
    const palabras = todasLasPalabras.filter(palabra => !palabrasIgnorar.includes(palabra));
    let dia, mesTexto, año, diaSemana;

    // Buscar día de la semana
    diaSemana = todasLasPalabras.find(palabra => diasSemana.includes(palabra));
    if (diaSemana) diaSemana = diaSemana.toUpperCase();

    // Buscar día (número de 1-2 dígitos)
    const diaMatch = palabras.find(palabra => /^\d{1,2}$/.test(palabra));
    if (diaMatch) dia = diaMatch.padStart(2, "0");

    // Buscar mes (nombre del mes)
    mesTexto = palabras.find(palabra => mesesTexto[palabra]);

    // Buscar año (número de 4 dígitos)
    const añoMatch = palabras.find(palabra => /^\d{4}$/.test(palabra));
    if (añoMatch) año = añoMatch;

    if (dia && mesTexto && año) {
      const numeroMes = mesesTexto[mesTexto];
      const nombreMes = meses[numeroMes];
      // Incluir día de la semana si existe
      if (diaSemana) {
        return `${diaSemana} ${parseInt(dia)} DE ${nombreMes} DEL ${año}`;
      } else {
        return `${parseInt(dia)} DE ${nombreMes} DEL ${año}`;
      }
    }
  }

  // Formato numérico: YYYY-MM-DD, YYYY/MM/DD o DD/MM/YYYY
  let separador = fechaLimpia.includes('-') ? '-' : '/';
  const partes = fechaLimpia.split(separador);

  if (partes.length !== 3) return fecha; // Si no tiene formato correcto, devolver original

  let dia, mes, año;

  // Detectar formato: si el primer elemento tiene 4 dígitos es YYYY-MM-DD o YYYY/MM/DD
  if (partes[0].length === 4) {
    // Formato YYYY-MM-DD o YYYY/MM/DD
    año = partes[0];
    mes = partes[1].padStart(2, "0");
    dia = partes[2].padStart(2, "0");
  } else {
    // Formato DD-MM-YYYY o DD/MM/YYYY
    dia = partes[0].padStart(2, "0");
    mes = partes[1].padStart(2, "0");
    año = partes[2];
  }

  const nombreMes = meses[mes];
  if (!nombreMes) return fecha; // Si el mes no es válido, devolver original

  // CALCULAR el día de la semana para fechas numéricas
  const diaSemanaCalculado = obtenerDiaSemana(parseInt(año), parseInt(mes), parseInt(dia));

  return `${diaSemanaCalculado} ${parseInt(dia)} DE ${nombreMes} DEL ${año}`;
};

// Función para interpretar sexo F/M a FEMENINO/MASCULINO
const interpretarSexo = (sexo) => {
  if (!sexo) return "";
  const sexoLimpio = sexo.toString().trim().toUpperCase();
  if (sexoLimpio === "F") return "FEMENINO";
  if (sexoLimpio === "M") return "MASCULINO";
  return sexoLimpio; // Si ya está en formato completo, devolverlo
};

// === FOOTER FICHA ODONTOLÓGICA CABECERA ===
function footerFichaOdontologicaCabecera(doc, opts = {}, datos = {}) {
  const margin = 8;
  const logoW = 38;
  const y = 12;
  const xOffset = opts.xOffset !== undefined ? opts.xOffset : 25;
  const fontSize = opts.fontSize !== undefined ? opts.fontSize : 6;
  const yOffset = opts.yOffset !== undefined ? opts.yOffset : -8;
  const baseX = margin + logoW + 8 - xOffset;
  let yFila = y + 2 + yOffset;
  const rowH = 3.2;
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 0, 0);
  const filas = [
    {
      direccion:
        datos?.dirTruPierola ||
        "",
      celular: datos?.celTrujilloPie || "",
      email: datos?.emailTruPierola || "",
      telefono:
        datos?.telfTruPierola ||
        "",
    },
    {
      direccion:
        datos?.dirHuamachuco || "",
      celular: datos?.celHuamachuco || "",
      email: datos?.emailHuamachuco || "",
      telefono: datos?.telfHuamachuco || "",
    },
    {
      direccion:
        datos?.dirHuancayo ||
        "",
      celular: datos?.celHuancayo || "",
      email: datos?.emailHuancayo || "",
      telefono: datos?.telfHuancayo || "",
    },
  ];
  filas.forEach((fila) => {
    let x = baseX;
    if (fila.direccion) {
      const idx2 = fila.direccion.indexOf(":");
      if (idx2 !== -1) {
        const sedeNombre = fila.direccion.substring(0, idx2 + 1);
        const sedeResto = fila.direccion.substring(idx2 + 1);
        doc.setFont("helvetica", "bold");
        doc.text(sedeNombre, x, yFila, { baseline: "top" });
        x += doc.getTextWidth(sedeNombre) + 2;
        doc.setFont("helvetica", "normal");
        doc.text(sedeResto, x, yFila, { baseline: "top" });
        x += doc.getTextWidth(sedeResto) + 6;
      } else {
        doc.setFont("helvetica", "normal");
        doc.text(fila.direccion, x, yFila, { baseline: "top" });
        x += doc.getTextWidth(fila.direccion) + 6;
      }
    }
    if (fila.celular) {
      doc.setFont("helvetica", "bold");
      doc.text("Cel.", x, yFila, { baseline: "top" });
      x += doc.getTextWidth("Cel.");
      doc.setFont("helvetica", "normal");
      doc.text(` ${fila.celular}`, x, yFila, { baseline: "top" });
      x += doc.getTextWidth(` ${fila.celular}`) + 6;
    }
    if (fila.email) {
      doc.setFont("helvetica", "normal");
      doc.text(fila.email, x, yFila, { baseline: "top" });
      x += doc.getTextWidth(fila.email) + 6;
    }
    if (fila.telefono) {
      doc.setFont("helvetica", "bold");
      doc.text("Telf.", x, yFila, { baseline: "top" });
      x += doc.getTextWidth("Telf.");
      doc.setFont("helvetica", "normal");
      doc.text(` ${fila.telefono}`, x, yFila, { baseline: "top" });
    }
    yFila += rowH;
  });

  // Agregar website
  doc.setFont("helvetica", "normal").setFontSize(6);
  doc.text("Web : www.horizontemedic.com", baseX, yFila + 2);
}

const headerOdontograma = (doc, datos) => {
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // Footer horizontal de cabecera (datos de contacto)
  footerFichaOdontologicaCabecera(
    doc,
    { xOffset: -42, fontSize: 7.5, yOffset: -8 },
    datos
  );

  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 500;
  if (colorValido) {
    // === BLOQUE CÓDIGO DE COLOR ===
    // const color = datos.codigoColor || "#008f39";
    // const boxText = (datos.textoColor || "F").toUpperCase();
    const color = (datos.codigoColor?.trim() && datos.codigoColor.trim() !== ""
      ? datos.codigoColor.trim()
      : "#008f39");
    const boxText = (datos.textoColor?.trim() && datos.textoColor.trim() !== ""
      ? datos.textoColor.trim().toUpperCase()
      : "F");
    let boxSize = 15;
    let boxX = pageW - margin - boxSize;
    let boxY = y + 2;

    // Draw box outline in black
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
    // Solo renderiza si color es válido o para prueba
    doc.setDrawColor(color);
    doc.setLineWidth(2);
    doc.setLineCap("round");
    doc.line(boxX + boxSize + 3, boxY, boxX + boxSize + 3, boxY + boxSize);
    doc.setLineCap("butt");
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color);
    doc.text(boxText, boxX + boxSize / 2, boxY + boxSize / 2, {
      align: "center",
      baseline: "middle",
      maxWidth: boxSize - 1,
    });
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2);
  }

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default async function Odontograma_lo_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();

  // Función para obtener string de datos
  const obtenerString = (nombre) => {
    return data[nombre] != null ? `${data[nombre]}` : "";
  };

  // Función para convertir a mayúsculas los campos específicos
  const obtenerStringMayus = (nombre) => {
    const valor = data[nombre] != null ? `${data[nombre]}` : "";
    return valor.toUpperCase();
  };

  // Datos reales
  const datosReales = {
    norden: obtenerString("norden"),
    sede: obtenerStringMayus("sede"),
    nombres: obtenerStringMayus("nombres"),
    empresa: obtenerStringMayus("empresa"),
    contratista: obtenerStringMayus("contrata"),
    sexo: interpretarSexo(obtenerString("sexo")),
    edad: obtenerString("edad"),
    fecha: formatearFecha(obtenerString("fechaOd")),
    piezasMalEstado: obtenerString("txtPiezasMalEstado"),
    pprMetalicas: obtenerString("txtPprMetalicas"),
    pprAcrilicas: obtenerString("txtPprAcrilicas"),
    ausentes: obtenerString("txtAusentes"),
    puentes: obtenerString("txtPuentes"),
    coronas: obtenerString("txtCoronas"),
    porExtraer: obtenerString("txtPorExtraer"),
    pTotales: obtenerString("txtPTotal"),
    normales: obtenerString("txtNormales"),
    obturacionesEfectuadas: obtenerString("txtObturacionesEfectuadas"),
    cariadasPorOturar: obtenerString("txtCariadasOturar"),
    fracturadas: obtenerString("txtFracturada"),
    observaciones: obtenerStringMayus("txtObservaciones"),
    lugarFecha:
      obtenerStringMayus("lugar") + " - " + formatearFecha(obtenerString("fechaOd")),

    d1: interpretarUrlParaLeer(data.lbl18),
    d2: interpretarUrlParaLeer(data.lbl17),
    d3: interpretarUrlParaLeer(data.lbl16),
    d4: interpretarUrlParaLeer(data.lbl15),
    d5: interpretarUrlParaLeer(data.lbl14),
    d6: interpretarUrlParaLeer(data.lbl13),
    d7: interpretarUrlParaLeer(data.lbl12),
    d8: interpretarUrlParaLeer(data.lbl11),

    d9: interpretarUrlParaLeer(data.lbl21),
    d10: interpretarUrlParaLeer(data.lbl22),
    d11: interpretarUrlParaLeer(data.lbl23),
    d12: interpretarUrlParaLeer(data.lbl24),
    d13: interpretarUrlParaLeer(data.lbl25),
    d14: interpretarUrlParaLeer(data.lbl26),
    d15: interpretarUrlParaLeer(data.lbl27),
    d16: interpretarUrlParaLeer(data.lbl28),

    d17: interpretarUrlParaLeer(data.lbl48),
    d18: interpretarUrlParaLeer(data.lbl47),
    d19: interpretarUrlParaLeer(data.lbl46),
    d20: interpretarUrlParaLeer(data.lbl45),
    d21: interpretarUrlParaLeer(data.lbl44),
    d22: interpretarUrlParaLeer(data.lbl43),
    d23: interpretarUrlParaLeer(data.lbl42),
    d24: interpretarUrlParaLeer(data.lbl41),

    d25: interpretarUrlParaLeer(data.lbl31),
    d26: interpretarUrlParaLeer(data.lbl32),
    d27: interpretarUrlParaLeer(data.lbl33),
    d28: interpretarUrlParaLeer(data.lbl34),
    d29: interpretarUrlParaLeer(data.lbl35),
    d30: interpretarUrlParaLeer(data.lbl36),
    d31: interpretarUrlParaLeer(data.lbl37),
    d32: interpretarUrlParaLeer(data.lbl38),
  };

  const datosFinales = datosReales;

  // === 0) HEADER CON LOGO, DATOS DE CONTACTO Y BLOQUE DE COLOR ===
  headerOdontograma(doc, data);

  // === 1) Imagen de fondo para el odontograma ===
  const fondoImg = "/img/Odontograma_Digitalizado_LO.png";
  const pageH = doc.internal.pageSize.getHeight();

  // Usar todo el ancho del documento horizontal
  const imgWidth = pageW; // Todo el ancho disponible
  const imgHeight = pageH; // Todo el alto disponible

  // Empezar desde el borde superior izquierdo
  const xOffset = 0;
  const yOffset = 0;

  try {
    doc.addImage(fondoImg, "PNG", xOffset, yOffset, imgWidth, imgHeight);
  } catch (e) {
    doc.text("Imagen de odontograma no disponible", margin, yOffset + 10);
  }

  // === 2) Datos posicionados individualmente ===
  doc.setFont("helvetica", "normal").setFontSize(10);

  // === POSICIONES DE LOS DIENTES EN EL ODONTOGRAMA ===
  // Definir las posiciones de los dientes según la disposición del odontograma
  const posicionesDientes = {
    // Dientes superiores (1-16) - Fila superior
    1: { x: margin + 7, y: margin + 96, width: 8, height: 8 },
    2: { x: margin + 8, y: margin + 84, width: 8, height: 8 },
    3: { x: margin + 10, y: margin + 72, width: 8, height: 8 },
    4: { x: margin + 14, y: margin + 61, width: 7, height: 7 },
    5: { x: margin + 17, y: margin + 52, width: 7, height: 7 },
    6: { x: margin + 23, y: margin + 44, width: 6.5, height: 6.5 },
    7: { x: margin + 30, y: margin + 37.5, width: 6.5, height: 6.5 },
    8: { x: margin + 41.5, y: margin + 35, width: 6.5, height: 6.5 },

    // Dientes superiores (9-16) - Espejo de 1-8
    9: { x: margin + 53, y: margin + 35, width: 6.5, height: 6.5 },
    10: { x: margin + 63.5, y: margin + 37.5, width: 6.5, height: 6.5 },
    11: { x: margin + 72, y: margin + 44, width: 6.5, height: 6.5 },
    12: { x: margin + 75, y: margin + 52, width: 7, height: 7 },
    13: { x: margin + 79, y: margin + 61, width: 7, height: 7 },
    14: { x: margin + 82, y: margin + 72, width: 8, height: 8 },
    15: { x: margin + 84, y: margin + 84, width: 8, height: 8 },
    16: { x: margin + 85, y: margin + 96, width: 8, height: 8 },

    // Dientes inferiores (17-32) - Espejo hacia abajo de 1-16
    17: { x: margin + 8, y: margin + 122, width: 8, height: 8 },
    18: { x: margin + 9, y: margin + 134, width: 8, height: 8 },
    19: { x: margin + 11, y: margin + 145, width: 8, height: 8 },
    20: { x: margin + 16.5, y: margin + 156.5, width: 7, height: 7 },
    21: { x: margin + 20, y: margin + 165.5, width: 7, height: 7 },
    22: { x: margin + 26, y: margin + 173.5, width: 6.5, height: 6.5 },
    23: { x: margin + 34, y: margin + 178.5, width: 6.5, height: 6.5 },
    24: { x: margin + 42.4, y: margin + 181, width: 6.5, height: 6.5 },

    25: { x: margin + 52, y: margin + 181, width: 6.5, height: 6.5 },
    26: { x: margin + 60, y: margin + 178.5, width: 6.5, height: 6.5 },
    27: { x: margin + 68, y: margin + 173.5, width: 6.5, height: 6.5 },
    28: { x: margin + 73, y: margin + 165.5, width: 7, height: 7 },
    29: { x: margin + 78, y: margin + 156.5, width: 7, height: 7 },
    30: { x: margin + 81.2, y: margin + 145, width: 8, height: 8 },
    31: { x: margin + 84, y: margin + 134, width: 8, height: 8 },
    32: { x: margin + 85, y: margin + 122, width: 8, height: 8 },
  };

  // === TOP RIGHT BLOCK - N° Ficha y Sede ===
  // N° Ficha - Coordenadas individuales
  const xNorden = pageW - margin - 18; // AJUSTAR POSICIÓN X DE N° FICHA AQUÍ (2 puntos a la derecha)
  const yNorden = margin + 35; // AJUSTAR POSICIÓN Y DE N° FICHA AQUÍ
  doc.setFont("helvetica", "bold").setFontSize(22);
  doc.text(String(datosFinales.norden), xNorden, yNorden, { align: "right" });

  // Subrayado para el N° Ficha
  const textWidth = doc.getTextWidth(String(datosFinales.norden));
  const underlineY = yNorden + 1; // Posición Y del subrayado
  const underlineX = xNorden - textWidth; // Posición X del subrayado (alineado a la derecha)
  doc.setDrawColor(0, 0, 0); // Color negro
  doc.setLineWidth(0.5); // Grosor de la línea
  doc.line(underlineX, underlineY, xNorden, underlineY);

  // Sede - Coordenadas individuales
  const xSede = pageW - margin + 0.5; // AJUSTAR POSICIÓN X DE SEDE AQUÍ
  const ySede = margin + 41.5; // AJUSTAR POSICIÓN Y DE SEDE AQUÍ
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.sede, xSede, ySede, { align: "right" });

  // === PATIENT INFORMATION BLOCK ===
  // Nombres - Coordenadas individuales
  const xNombres = pageW - margin - 158; // AJUSTAR POSICIÓN X DE NOMBRES AQUÍ (más a la izquierda)
  const yNombres = margin + 47.5; // AJUSTAR POSICIÓN Y DE NOMBRES AQUÍ
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.nombres, xNombres, yNombres, { maxWidth: 85 });

  // Sexo - Coordenadas individuales
  const xSexo = pageW - margin - 61; // AJUSTAR POSICIÓN X DE SEXO AQUÍ
  const ySexo = margin + 47; // AJUSTAR POSICIÓN Y DE SEXO AQUÍ
  doc.text(datosFinales.sexo, xSexo, ySexo);

  // Empresa - Coordenadas individuales
  const xEmpresa = pageW - margin - 158; // AJUSTAR POSICIÓN X DE EMPRESA AQUÍ (más a la izquierda)
  const yEmpresa = margin + 53; // AJUSTAR POSICIÓN Y DE EMPRESA AQUÍ
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.empresa, xEmpresa, yEmpresa, { maxWidth: 82 });

  // Edad - Coordenadas individuales
  const xEdad = pageW - margin - 61; // AJUSTAR POSICIÓN X DE EDAD AQUÍ
  const yEdad = margin + 53; // AJUSTAR POSICIÓN Y DE EDAD AQUÍ
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(datosFinales.edad, xEdad, yEdad);

  // Contratista - Coordenadas individuales
  const xContratista = pageW - margin - 155; // AJUSTAR POSICIÓN X DE CONTRATISTA AQUÍ (más a la izquierda)
  const yContratista = margin + 63.5; // AJUSTAR POSICIÓN Y DE CONTRATISTA AQUÍ
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.contratista, xContratista, yContratista, {
    maxWidth: 82,
  });

  // Fecha - Coordenadas individuales
  const xFecha = pageW - margin - 60; // AJUSTAR POSICIÓN X DE FECHA AQUÍ
  const yFecha = margin + 61; // AJUSTAR POSICIÓN Y DE FECHA AQUÍ
  doc.text(datosFinales.fecha, xFecha, yFecha);

  // === SUMMARY OF DENTAL STATUS ===
  doc.setFont("helvetica", "normal").setFontSize(10);

  // Piezas en mal estado - Coordenadas individuales
  const xPiezasMalEstado = pageW - margin - 131; // AJUSTAR POSICIÓN X DE PIEZAS MAL ESTADO AQUÍ
  const yPiezasMalEstado = margin + 125; // AJUSTAR POSICIÓN Y DE PIEZAS MAL ESTADO AQUÍ
  doc.text(datosFinales.piezasMalEstado, xPiezasMalEstado, yPiezasMalEstado, {
    align: "right",
  });

  // P.P.R. Metalicas - Coordenadas individuales
  const xPprMetalicas = pageW - margin - 131; // AJUSTAR POSICIÓN X DE PPR METALICAS AQUÍ
  const yPprMetalicas = margin + 130.5; // AJUSTAR POSICIÓN Y DE PPR METALICAS AQUÍ
  doc.text(datosFinales.pprMetalicas, xPprMetalicas, yPprMetalicas, {
    align: "right",
  });

  // P.P.R. Acrilicas - Coordenadas individuales
  const xPprAcrilicas = pageW - margin - 131; // AJUSTAR POSICIÓN X DE PPR ACRILICAS AQUÍ
  const yPprAcrilicas = margin + 136; // AJUSTAR POSICIÓN Y DE PPR ACRILICAS AQUÍ
  doc.text(datosFinales.pprAcrilicas, xPprAcrilicas, yPprAcrilicas, {
    align: "right",
  });

  // Ausentes - Coordenadas individuales
  const xAusentes = pageW - margin - 101; // AJUSTAR POSICIÓN X DE AUSENTES AQUÍ
  const yAusentes = margin + 125; // AJUSTAR POSICIÓN Y DE AUSENTES AQUÍ
  doc.text(datosFinales.ausentes, xAusentes, yAusentes, { align: "right" });

  // Puentes - Coordenadas individuales
  const xPuentes = pageW - margin - 101; // AJUSTAR POSICIÓN X DE PUENTES AQUÍ
  const yPuentes = margin + 130.5; // AJUSTAR POSICIÓN Y DE PUENTES AQUÍ
  doc.text(datosFinales.puentes, xPuentes, yPuentes, { align: "right" });

  // Coronas - Coordenadas individuales
  const xCoronas = pageW - margin - 101; // AJUSTAR POSICIÓN X DE CORONAS AQUÍ
  const yCoronas = margin + 136; // AJUSTAR POSICIÓN Y DE CORONAS AQUÍ
  doc.text(datosFinales.coronas, xCoronas, yCoronas, { align: "right" });

  // Por Extraer - Coordenadas individuales
  const xPorExtraer = pageW - margin - 70; // AJUSTAR POSICIÓN X DE POR EXTRAER AQUÍ
  const yPorExtraer = margin + 125; // AJUSTAR POSICIÓN Y DE POR EXTRAER AQUÍ
  doc.text(datosFinales.porExtraer, xPorExtraer, yPorExtraer, {
    align: "right",
  });

  // P. Totales - Coordenadas individuales
  const xPTotales = pageW - margin - 70; // AJUSTAR POSICIÓN X DE P TOTALES AQUÍ
  const yPTotales = margin + 130.5; // AJUSTAR POSICIÓN Y DE P TOTALES AQUÍ
  doc.text(datosFinales.pTotales, xPTotales, yPTotales, { align: "right" });

  // Normales - Coordenadas individuales
  const xNormales = pageW - margin - 70; // AJUSTAR POSICIÓN X DE NORMALES AQUÍ
  const yNormales = margin + 136; // AJUSTAR POSICIÓN Y DE NORMALES AQUÍ
  doc.text(datosFinales.normales, xNormales, yNormales, { align: "right" });

  // Obturaciones Efectuadas - Coordenadas individuales
  const xObturacionesEfectuadas = pageW - margin - 14; // AJUSTAR POSICIÓN X DE OBTURACIONES EFECTUADAS AQUÍ
  const yObturacionesEfectuadas = margin + 126; // AJUSTAR POSICIÓN Y DE OBTURACIONES EFECTUADAS AQUÍ
  doc.text(
    datosFinales.obturacionesEfectuadas,
    xObturacionesEfectuadas,
    yObturacionesEfectuadas,
    { align: "right" }
  );

  // Cariadas por Oturar - Coordenadas individuales
  const xCariadasPorOturar = pageW - margin - 14; // AJUSTAR POSICIÓN X DE CARIADAS POR OTURAR AQUÍ
  const yCariadasPorOturar = margin + 131; // AJUSTAR POSICIÓN Y DE CARIADAS POR OTURAR AQUÍ
  doc.text(
    datosFinales.cariadasPorOturar,
    xCariadasPorOturar,
    yCariadasPorOturar,
    { align: "right" }
  );

  // Fracturadas - Coordenadas individuales
  const xFracturadas = pageW - margin - 14; // AJUSTAR POSICIÓN X DE FRACTURADAS AQUÍ
  const yFracturadas = margin + 136.5; // AJUSTAR POSICIÓN Y DE FRACTURADAS AQUÍ
  doc.text(datosFinales.fracturadas, xFracturadas, yFracturadas, {
    align: "right",
  });

  // === OBSERVACIONES Y LUGAR FECHA ===
  // Observaciones - Coordenadas individuales
  const xObservaciones = margin + 138; // AJUSTAR POSICIÓN X DE OBSERVACIONES AQUÍ
  const yObservaciones = margin + 142; // AJUSTAR POSICIÓN Y DE OBSERVACIONES AQUÍ
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosFinales.observaciones, xObservaciones, yObservaciones, {
    maxWidth: 120,
  });

  // Lugar y Fecha - Coordenadas individuales
  const xLugarFecha = margin + 134; // AJUSTAR POSICIÓN X DE LUGAR Y FECHA AQUÍ
  const yLugarFecha = margin + 156.5; // AJUSTAR POSICIÓN Y DE LUGAR Y FECHA AQUÍ
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(datosFinales.lugarFecha, xLugarFecha, yLugarFecha);

  // === 3) COLOCAR ICONOS DENTALES BASADOS EN LOS DATOS INDIVIDUALES ===
  // Mapeo de tipos de dientes a nombres de archivos de iconos
  const mapeoTiposIconos = {
    Ausente: "ausente",
    "Cariada por opturar": "cariada",
    "Por extraer": "por_extraer",
    Fracturada: "fracturada",
    Corona: "corona",
    "Obturacion Efectuada": "obturacion",
    Puente: "puente",
    "P.P.R Metalica": "ppr_metalica",
    "P.P.R Acrilica": "ppr_acrilica",
    "P.Total": "p_total",
    Normal: "normal",
  };

  // Función para colocar icono en un diente específico
  const colocarIconoEnDiente = (numeroDiente, tipoDiente) => {
    if (
      tipoDiente &&
      tipoDiente !== "Normal" &&
      posicionesDientes[numeroDiente]
    ) {
      const nombreIcono = mapeoTiposIconos[tipoDiente];
      if (nombreIcono) {
        const iconPath = `/img/iconos_odonto/Icon_${nombreIcono}.png`;
        const posicion = posicionesDientes[numeroDiente];

        try {
          doc.addImage(
            iconPath,
            "PNG",
            posicion.x,
            posicion.y,
            posicion.width || 8,
            posicion.height || 8
          );
        } catch (e) {
          console.log(
            `Error al cargar icono ${nombreIcono} para diente ${numeroDiente}:`,
            e
          );
        }
      }
    }
  };

  // Colocar iconos para cada diente según sus datos individuales
  for (let i = 1; i <= 32; i++) {
    const tipoDiente = datosFinales[`d${i}`];
    if (tipoDiente) {
      colocarIconoEnDiente(i, tipoDiente);
    }
  }

  // === 4) Generar blob y abrir en iframe para imprimir automáticamente ===
  // const blob = doc.output("blob");
  // const url = URL.createObjectURL(blob);
  // const iframe = document.createElement("iframe");
  // iframe.style.display = "none";
  // iframe.src = url;
  // document.body.appendChild(iframe);
  // iframe.onload = () => {
  //   iframe.contentWindow.focus();
  //   iframe.contentWindow.print();
  // };
  const firmasAPintar = [
    { nombre: "FIRMAP", x: 50, y: 160, maxw: 200 },
    { nombre: "HUELLA", x: 120, y: 160, maxw: 130 },
    { nombre: "SELLOFIRMA", x: 180, y: 160, maxw: 120 },
  ];
  agregarFirmas(doc, data.digitalizacion, firmasAPintar).then(() => {
    imprimir(doc);
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

      img.onload = () => {
        let sigW = maxw;
        const sigH = 35;
        const baseX = x;
        const baseY = y;
        const maxW = sigW - 10;
        const maxH = sigH - 10;
        let imgW = img.width;
        let imgH = img.height;
        const scale = Math.min(maxW / imgW, maxH / imgH, 1);
        imgW *= scale;
        imgH *= scale;
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
