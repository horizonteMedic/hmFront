import jsPDF from "jspdf";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import drawColorBox from '../../components/ColorBox.jsx';
import footerTR from '../../components/footerTR.jsx';
import { compressImage } from '../../../utils/helpers.js';

// Mapeo de etiquetas a nombres de imágenes
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

// Función para interpretar URL y obtener el tipo de diente
const interpretarUrlParaLeer = (url) => {
  if (url == null) return "Normal";
  const match = url.match(/([^/\\]+)(?=\.png$)/);
  const nombreArchivo = match?.[1];
  return nombreArchivo ? imgsToLabels[nombreArchivo] ?? "" : "";
};

// Header con logo, color box y título
const drawHeader = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false, yOffset: 10 });

  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8);
  const sedeValue = datos.sede || datos.nombreSede || "";
  doc.text("Sede: " + sedeValue, pageW - 80, 20);

  // Fecha de examen
  const fechaExamen = datos.fechaExamen || datos.fechaRegistro || datos.fecha || datos.fechaOd || "";
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);

  // Página
  doc.text("Pag. 01", pageW - 30, 10);

  // Bloque de color
  if (datos.color && datos.textoColor) {
    drawColorBox(doc, {
      color: datos.codigoColor || "#008f39",
      text: datos.textoColor,
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  }
};

// Función para dibujar datos personales en formato horizontal
const drawPatientData = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  // Dejar 45% del ancho a la izquierda para el odontograma
  const espacioIzquierdo = pageW * 0.45; // 45% del ancho
  const inicioX = espacioIzquierdo; // Desde aquí empiezan los datos
  let yPos = 40;
  const lineHeight = 6;

  // Preparar datos
  const nombres = String(datos.nombres || "");
  const dni = String(datos.dni || "");
  const edad = String(datos.edad || datos.edadOd || "").replace(" años", "").trim();
  const sexo = datos.sexo === 'F' || datos.sexo === 'Femenino' ? 'FEMENINO' : datos.sexo === 'M' || datos.sexo === 'Masculino' ? 'MASCULINO' : '';
  const empresa = String(datos.empresa || "");
  const contrata = String(datos.contrata || "");

  // Fila 1: Nombres y Apellidos
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Nombres y Apellidos:", inicioX, yPos);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(nombres, inicioX + 45, yPos);
  yPos += lineHeight;

  // Fila 2: DNI | Edad | Sexo
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", inicioX, yPos);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(dni, inicioX + 12, yPos);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", inicioX + 45, yPos);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((edad ? edad + " AÑOS" : ''), inicioX + 55, yPos);
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", inicioX + 85, yPos);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(sexo, inicioX + 95, yPos);
  yPos += lineHeight;

  // Fila 3: Empresa
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", inicioX, yPos);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(empresa, inicioX + 22, yPos);
  yPos += lineHeight;

  // Fila 4: Contrata
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contrata:", inicioX, yPos);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(contrata, inicioX + 22, yPos);
  yPos += lineHeight;

  return yPos;
};

// Función para dibujar el odontograma en la parte izquierda
const drawOdontograma = async (doc, yPosInicial, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 15;
  const espacioIzquierdo = pageW * 0.45; // 45% del ancho
  const anchoDisponible = espacioIzquierdo - margin; // Ancho disponible para el odontograma
  const yPos = yPosInicial; // Empezar desde donde empiezan los datos personales

  // Cargar y comprimir la imagen del odontograma
  const imagenPath = "/img/odonto/dientes.webp";
  
  let imgWidth, imgHeight, xPos, scale;
  
  try {
    const compressedDataUrl = await compressImage(imagenPath, 0.7, 600);
    if (!compressedDataUrl) {
      console.warn("No se pudo cargar la imagen del odontograma");
      return;
    }

    // Cargar la imagen comprimida
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = compressedDataUrl;
    });

    // Calcular dimensiones manteniendo aspect ratio
    const maxWidth = anchoDisponible;
    const maxHeight = pageH - yPos - 30; // Dejar espacio para el footer
    
    imgWidth = img.width;
    imgHeight = img.height;
    
    // Escalar para que quepa en el espacio disponible
    const scaleW = maxWidth / imgWidth;
    const scaleH = maxHeight / imgHeight;
    scale = Math.min(scaleW, scaleH, 1); // No agrandar más de lo original
    
    imgWidth *= scale;
    imgHeight *= scale;
    
    // Centrar horizontalmente en el espacio izquierdo
    xPos = margin + (anchoDisponible - imgWidth) / 2;
    
    // Agregar la imagen
    doc.addImage(compressedDataUrl, 'JPEG', xPos, yPos, imgWidth, imgHeight);
  } catch (error) {
    console.error("Error al cargar el odontograma:", error);
    return;
  }

  // === COLOCAR ICONOS EN LOS DIENTES ===
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

  // Posiciones de los dientes en el odontograma (ajustadas para la nueva imagen)
  // Estas posiciones son relativas a la imagen base y se escalarán según el scale
  const posicionesDientesBase = {
    // Dientes superiores (1-16) - Fila superior
    1: { x: 45, y: 415, width: 50, height: 50 },
    2: { x: 47, y: 350, width: 47, height: 47 },
    3: { x: 65, y: 275, width: 45, height: 45 },
    4: { x: 87, y: 210, width: 43, height: 43 },
    5: { x: 109, y: 155, width: 40, height: 40 },
    6: { x: 140, y: 100, width: 37, height: 37 },
    7: { x: 193, y: 62, width: 34, height: 34 },
    8: { x: 250, y: 42, width: 40, height: 40 },

    9: { x: 325, y: 42, width: 40, height: 40 },
    10: { x: 385, y: 62, width: 34, height: 34 },
    11: { x: 440, y: 100, width: 37, height: 37 },
    12: { x: 465, y: 155, width: 40, height: 40 },
    13: { x: 490, y: 210, width: 43, height: 43 },  
    14: { x: 510, y: 275, width: 45, height: 45 },
    15: { x: 520, y: 350, width: 47, height: 47 },
    16: { x: 525, y: 415, width: 50, height: 50 },
    // Dientes inferiores (17-32) - Reflejo de espejo completo (horizontal y vertical)
    // 17 es reflejo de 16, 18 de 15, etc. (invertido horizontal y vertical)
    // Posiciones X reflejadas horizontalmente desde el centro (x: 285)
    17: { x: 45, y: 585, width: 50, height: 50 },  // Reflejo de 16 (x: 525 → 45)
    18: { x: 60, y: 660, width: 47, height: 47 },  // Reflejo de 15 (x: 520 → 50)
    19: { x: 70, y: 730, width: 45, height: 45 },  // Reflejo de 14 (x: 510 → 60)
    20: { x: 100, y: 795, width: 43, height: 43 },  // Reflejo de 13 (x: 490 → 80)
    21: { x: 125, y: 847, width: 40, height: 40 }, // Reflejo de 12 (x: 465 → 105)
    22: { x: 165, y: 890, width: 37, height: 37 }, // Reflejo de 11 (x: 440 → 130)
    23: { x: 215, y: 920, width: 34, height: 34 }, // Reflejo de 10 (x: 385 → 185)
    24: { x: 265, y: 933, width: 34, height: 34 }, // Reflejo de 9 (x: 325 → 245)
   
    25: { x: 320, y: 933, width: 34, height: 34 },  // Reflejo de 8 (x: 250 → 305)
    26: { x: 370, y: 920, width: 34, height: 34 }, // Reflejo de 7 (x: 193 → 355)
    27: { x: 415, y: 890, width: 37, height: 37 }, // Reflejo de 6 (x: 140 → 405)
    28: { x: 448, y: 847, width: 40, height: 40 }, // Reflejo de 5 (x: 109 → 445)
    29: { x: 475, y: 795, width: 43, height: 43 }, // Reflejo de 4 (x: 87 → 470)
    30: { x: 500, y: 730, width: 45, height: 45 }, // Reflejo de 3 (x: 65 → 500)
    31: { x: 510, y: 660, width: 47, height: 47 }, // Reflejo de 2 (x: 47 → 510)
    32: { x: 525, y: 585, width: 50, height: 50 }, // Reflejo de 1 (x: 45 → 525)
  };

  // Procesar datos de los dientes (lbl11-lbl48)
  const datosDientes = {
    d1: interpretarUrlParaLeer(datos.lbl18),
    d2: interpretarUrlParaLeer(datos.lbl17),
    d3: interpretarUrlParaLeer(datos.lbl16),
    d4: interpretarUrlParaLeer(datos.lbl15),
    d5: interpretarUrlParaLeer(datos.lbl14),
    d6: interpretarUrlParaLeer(datos.lbl13),
    d7: interpretarUrlParaLeer(datos.lbl12),
    d8: interpretarUrlParaLeer(datos.lbl11),
    d9: interpretarUrlParaLeer(datos.lbl21),
    d10: interpretarUrlParaLeer(datos.lbl22),
    d11: interpretarUrlParaLeer(datos.lbl23),
    d12: interpretarUrlParaLeer(datos.lbl24),
    d13: interpretarUrlParaLeer(datos.lbl25),
    d14: interpretarUrlParaLeer(datos.lbl26),
    d15: interpretarUrlParaLeer(datos.lbl27),
    d16: interpretarUrlParaLeer(datos.lbl28),
    d17: interpretarUrlParaLeer(datos.lbl48),
    d18: interpretarUrlParaLeer(datos.lbl47),
    d19: interpretarUrlParaLeer(datos.lbl46),
    d20: interpretarUrlParaLeer(datos.lbl45),
    d21: interpretarUrlParaLeer(datos.lbl44),
    d22: interpretarUrlParaLeer(datos.lbl43),
    d23: interpretarUrlParaLeer(datos.lbl42),
    d24: interpretarUrlParaLeer(datos.lbl41),
    d25: interpretarUrlParaLeer(datos.lbl31),
    d26: interpretarUrlParaLeer(datos.lbl32),
    d27: interpretarUrlParaLeer(datos.lbl33),
    d28: interpretarUrlParaLeer(datos.lbl34),
    d29: interpretarUrlParaLeer(datos.lbl35),
    d30: interpretarUrlParaLeer(datos.lbl36),
    d31: interpretarUrlParaLeer(datos.lbl37),
    d32: interpretarUrlParaLeer(datos.lbl38),
  };

  // Función para colocar icono en un diente específico
  const colocarIconoEnDiente = async (numeroDiente, tipoDiente) => {
    if (
      tipoDiente &&
      tipoDiente !== "Normal" &&
      posicionesDientesBase[numeroDiente]
    ) {
      const nombreIcono = mapeoTiposIconos[tipoDiente];
      if (nombreIcono) {
        const iconPath = `/img/iconos_odonto/Icon_${nombreIcono}.png`;
        const posicionBase = posicionesDientesBase[numeroDiente];
        
        // Aplicar escala y posición de la imagen base
        const iconX = xPos + (posicionBase.x * scale);
        const iconY = yPos + (posicionBase.y * scale);
        const iconWidth = (posicionBase.width || 8) * scale;
        const iconHeight = (posicionBase.height || 8) * scale;

        try {
          // Cargar y comprimir el icono
          const iconCompressed = await compressImage(iconPath, 0.8, 100);
          if (iconCompressed) {
            doc.addImage(
              iconCompressed,
              "PNG",
              iconX,
              iconY,
              iconWidth,
              iconHeight
            );
          }
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
    const tipoDiente = datosDientes[`d${i}`];
    if (tipoDiente) {
      await colocarIconoEnDiente(i, tipoDiente);
    }
  }
};

// Función helper para cargar y comprimir imágenes
const loadImage = async (src) => {
  try {
    // Comprimir la imagen primero
    const compressedDataUrl = await compressImage(src, 0.7, 200); // Calidad 0.7, maxWidth 200 para iconos pequeños
    if (!compressedDataUrl) {
      return null;
    }
    
    // Cargar la imagen comprimida
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(`No se pudo cargar ${src}`);
      img.src = compressedDataUrl;
    });
  } catch (error) {
    console.error(`Error al comprimir/cargar imagen ${src}:`, error);
    return null;
  }
};

// Función para dibujar la leyenda de iconos
const drawLeyenda = async (doc, yPosInicial) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15; // Margen derecho
  const espacioIzquierdo = pageW * 0.45;
  const inicioX = espacioIzquierdo;
  const anchoDisponible = pageW - espacioIzquierdo - margin; // Ancho disponible desde inicioX hasta el margen
  let yPos = yPosInicial + 4; // Espacio después de los datos personales (reducido)
  
  const iconSize = 5.5; // Tamaño de los iconos (aumentado)
  const numColumnas = 4;
  // Calcular espaciado entre columnas para que quepan todas
  const colSpacing = anchoDisponible / numColumnas; // Distribuir el ancho disponible entre las columnas
  const rowSpacing = 6; // Espacio entre filas

  // Título LEYENDA
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("LEYENDA", inicioX, yPos);
  yPos += 4; // Espacio reducido después del título

  // Definir los elementos de la leyenda organizados por columnas
  // Los iconos están en public/img/iconos_odonto/
  const basePath = "/img/iconos_odonto/";
  const leyendaItems = [
    // Columna 1
    [
      { icon: `${basePath}Icon_ausente.png`, text: "Ausente" },
      { icon: `${basePath}Icon_puente.png`, text: "Puente" },
      { icon: `${basePath}Icon_p_total.png`, text: "P. Total" }
    ],
    // Columna 2
    [
      { icon: `${basePath}Icon_cariada.png`, text: "Cariada Por Oturar" },
      { icon: `${basePath}Icon_ppr_metalica.png`, text: "P.P.R Metálica" },
      { icon: `${basePath}Icon_corona.png`, text: "Corona" }
    ],
    // Columna 3
    [
      { icon: `${basePath}Icon_por_extraer.png`, text: "Por Extraer" },
      { icon: `${basePath}Icon_ppr_acrilica.png`, text: "P.P.R Acrílica" },
      { icon: `${basePath}Icon_obturacion.png`, text: "Obturación Efectuada" }
    ],
    // Columna 4
    [
      { icon: `${basePath}Icon_fracturada.png`, text: "Fracturada" },
      { icon: `${basePath}Icon_normal.png`, text: "Normal" }
    ]
  ];

  // Calcular altura total de la leyenda para el marco
  const maxFilas = Math.max(...leyendaItems.map(col => col.length));
  const alturaLeyenda = maxFilas * rowSpacing + 2;
  const startY = yPos;

  // Cargar todas las imágenes primero
  const imagePromises = leyendaItems.flat().map(item => 
    loadImage(item.icon).catch(() => null)
  );
  const images = await Promise.all(imagePromises);

  // Dibujar cada columna
  let imageIndex = 0;
  
  leyendaItems.forEach((columna, colIndex) => {
    const colX = inicioX + (colIndex * colSpacing);
    let currentY = startY;
    
    columna.forEach((item) => {
      const img = images[imageIndex++];
      if (img) {
        try {
          // Dibujar icono
          doc.addImage(img, "PNG", colX, currentY, iconSize, iconSize);
        } catch (error) {
          console.error(`Error al dibujar icono ${item.icon}:`, error);
        }
      }
      // Dibujar texto al lado del icono (con maxWidth para que no se salga)
      doc.setFont("helvetica", "normal").setFontSize(7.5); // Tamaño de texto aumentado
      const maxTextWidth = colSpacing - iconSize - 4; // Ancho máximo del texto
      doc.text(item.text, colX + iconSize + 1.5, currentY + iconSize / 2 + 1, {
        maxWidth: maxTextWidth
      });
      currentY += rowSpacing;
    });
  });

  // Dibujar marco alrededor de la leyenda
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(inicioX - 2, startY - 2, anchoDisponible + 4, alturaLeyenda + 2);

  return startY + alturaLeyenda + 4;
};

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return "";
  if (fecha.includes("/")) return fecha;
  const [anio, mes, dia] = fecha.split("-");
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

// Función para dibujar tabla de estadísticas dentales en 4 columnas
const drawEstadisticas = (doc, datos = {}, yPosInicial) => {
  const pageW = doc.internal.pageSize.getWidth();
  const espacioIzquierdo = pageW * 0.45;
  const inicioX = espacioIzquierdo;
  const margin = 15;
  const anchoDisponible = pageW - espacioIzquierdo - margin;
  let yPos = yPosInicial + 4; // Espacio reducido
  
  const filaAltura = 4; // Altura de fila reducida
  const numColumnas = 4;
  const colWidth = anchoDisponible / numColumnas; // Ancho de cada columna

  // Definir las 4 columnas con sus datos
  const columnas = [
    {
      titulo: "Piezas en mal estado",
      valor: datos.txtPiezasMalEstado || 0,
      subItems: [
        { label: "P.P.R. Metálicas", value: datos.txtPprMetalicas || 0 },
        { label: "P.P.R. Acrílicas", value: datos.txtPprAcrilicas || 0 }
      ]
    },
    {
      titulo: "Ausentes",
      valor: datos.txtAusentes || 0,
      subItems: [
        { label: "Puentes", value: datos.txtPuentes || 0 },
        { label: "Coronas", value: datos.txtCoronas || 0 }
      ]
    },
    {
      titulo: "Por Extraer",
      valor: datos.txtPorExtraer || 0,
      subItems: [
        { label: "P. Totales", value: datos.txtPTotal || 0 },
        { label: "Normales", value: datos.txtNormales || 0 }
      ]
    },
    {
      titulo: "Obturaciones Efectuadas",
      valor: datos.txtObturacionesEfectuadas || 0,
      subItems: [
        { label: "Cariadas por Oturar", value: datos.txtCariadasOturar || 0 },
        { label: "Fracturadas", value: datos.txtFracturada || 0 }
      ]
    }
  ];

  // Dibujar cada columna sin bordes, solo texto
  const startY = yPos;
  let maxY = yPos;
  
  columnas.forEach((columna, colIndex) => {
    const colX = inicioX + (colIndex * colWidth);
    let currentY = startY;
    
    // Título y valor (ambos labels en negrita)
    doc.setFont("helvetica", "bold").setFontSize(8);
    const tituloText = columna.titulo + ":";
    doc.text(tituloText, colX, currentY);
    const tituloWidth = doc.getTextWidth(tituloText);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(String(columna.valor), colX + tituloWidth + 2, currentY);
    currentY += filaAltura;
    
    // Subitems (labels en negrita)
    columna.subItems.forEach((subItem) => {
      doc.setFont("helvetica", "bold").setFontSize(8);
      const subText = subItem.label + ":";
      doc.text(subText, colX, currentY);
      const subWidth = doc.getTextWidth(subText);
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text(String(subItem.value), colX + subWidth + 2, currentY);
      currentY += filaAltura;
    });
    
    // Actualizar la posición Y máxima
    if (currentY > maxY) {
      maxY = currentY;
    }
  });

  return maxY;
};

// Función para dibujar observaciones
const drawObservaciones = (doc, datos = {}, yPosInicial) => {
  const pageW = doc.internal.pageSize.getWidth();
  const espacioIzquierdo = pageW * 0.45;
  const inicioX = espacioIzquierdo;
  const margin = 15;
  const anchoDisponible = pageW - espacioIzquierdo - margin;
  let yPos = yPosInicial + 4; // Espacio reducido

  const observaciones = String(datos.txtObservaciones || "");
  
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Observaciones:", inicioX, yPos);
  yPos += 3; // Espacio reducido

  // Texto que puede crecer con saltos de línea
  doc.setFont("helvetica", "normal").setFontSize(8);
  const lineHeight = 4;
  const observacionesLines = doc.splitTextToSize(observaciones || "-", anchoDisponible - 4);
  const alturaObservaciones = Math.max(10, observacionesLines.length * lineHeight + 2);
  
  // Dibujar recuadro
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(inicioX, yPos, anchoDisponible, alturaObservaciones);
  
  // Dibujar texto con saltos de línea
  doc.text(observacionesLines, inicioX + 2, yPos + 4);
  yPos += alturaObservaciones;

  return yPos;
};

// Función para dibujar lugar y fecha
const drawLugarFecha = (doc, datos = {}, yPosInicial) => {
  const pageW = doc.internal.pageSize.getWidth();
  const espacioIzquierdo = pageW * 0.45;
  const inicioX = espacioIzquierdo;
  let yPos = yPosInicial + 4; // Espacio reducido

  const lugar = String(datos.lugar || datos.sede || "");
  const fecha = toDDMMYYYY(datos.fechaOd || datos.fechaExamen || datos.fecha || "");
  const lugarFecha = `${lugar}, ${fecha}`;

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(lugarFecha, inicioX, yPos);
  yPos += 4; // Espacio reducido

  return yPos;
};

// Función para dibujar firmas en la columna derecha
const drawFirmasColumnaDerecha = async (doc, datos = {}, yPosInicial) => {
  const pageW = doc.internal.pageSize.getWidth();
  const espacioIzquierdo = pageW * 0.45;
  const inicioX = espacioIzquierdo;
  const margin = 15;
  const anchoDisponible = pageW - espacioIzquierdo - margin;
  let yPos = yPosInicial + 4;

  const digitalizacion = datos.digitalizacion || [];
  const firmaPaciente = digitalizacion.find(d => d.nombreDigitalizacion === "FIRMAP");
  const huellaPaciente = digitalizacion.find(d => d.nombreDigitalizacion === "HUELLA");
  const sello1 = digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const sello2 = digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMADOCASIG");
  const isValidUrl = url => url && url !== "Sin registro";

  // Función para cargar y comprimir imágenes
  const loadImg = src =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        res(compressedDataUrl);
      };
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });

  const [firmap, huellap, s1, s2] = await Promise.all([
    isValidUrl(firmaPaciente?.url) ? loadImg(firmaPaciente.url) : Promise.resolve(null),
    isValidUrl(huellaPaciente?.url) ? loadImg(huellaPaciente.url) : Promise.resolve(null),
    isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
    isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
  ]);

  const tieneFirmaPaciente = firmap !== null || huellap !== null;
  const tieneSelloProfesional = s1 !== null || s2 !== null;

  // Calcular centro de la columna derecha
  const centroColumnaX = inicioX + (anchoDisponible / 2);

  // Firma y Huella del Paciente (izquierda de la columna)
  const firmaPacienteY = yPos;
  const pacienteX = tieneSelloProfesional ? inicioX + (anchoDisponible / 4) : centroColumnaX;

  if (firmap) {
    try {
      const imgWidth = 30;
      const imgHeight = 20;
      doc.addImage(firmap, 'JPEG', pacienteX - 22, firmaPacienteY, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del paciente:", error);
    }
  }

  if (huellap) {
    try {
      const imgWidth = 12;
      const imgHeight = 20;
      doc.addImage(huellap, 'JPEG', pacienteX + 10, firmaPacienteY, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando huella del paciente:", error);
    }
  }

  if (tieneFirmaPaciente) {
    const lineYPaciente = firmaPacienteY + 23;
    const textoPaciente = "Firma y Huella del Paciente";
    const textoPacienteWidth = doc.getTextWidth(textoPaciente);
    doc.setLineWidth(0.2);
    doc.line(pacienteX - textoPacienteWidth / 2, lineYPaciente, pacienteX + textoPacienteWidth / 2, lineYPaciente);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.text(textoPaciente, pacienteX, lineYPaciente + 5, { align: "center" });
  }

  // Firma y Sello del Profesional (derecha de la columna)
  if (tieneSelloProfesional) {
    const sigW = 48;
    const sigH = 20;
    const sigY = yPos;
    const gap = 16;
    const lineY = sigY + sigH + 1;

    const dibujarLineaYTexto = (centroX, lineY, tipoSello) => {
      doc.setLineWidth(0.2);
      let texto1, texto2;
      if (tipoSello === 'SELLOFIRMA') {
        texto1 = "Firma y Sello del Profesional";
        texto2 = "Responsable de la Evaluación";
      } else if (tipoSello === 'SELLOFIRMADOCASIG') {
        texto1 = "Firma y Sello Médico Asignado";
        texto2 = null;
      } else {
        texto1 = "Firma y Sello";
        texto2 = null;
      }

      const textoWidth = doc.getTextWidth(texto1);
      const anchoLinea = Math.max(textoWidth, texto2 ? doc.getTextWidth(texto2) : 0);
      doc.line(centroX - anchoLinea / 2, lineY, centroX + anchoLinea / 2, lineY);
      doc.setFont('helvetica', 'normal').setFontSize(7);
      doc.text(texto1, centroX, lineY + 2.5, { align: "center" });
      if (texto2) {
        doc.text(texto2, centroX, lineY + 4.5, { align: "center" });
      }
    };

    const profesionalX = tieneFirmaPaciente ? inicioX + (anchoDisponible * 3 / 4) : centroColumnaX;

    if (s1 && s2) {
      const totalWidth = sigW * 2 + gap;
      const startX = profesionalX - totalWidth / 2;
      doc.addImage(s1, 'JPEG', startX, sigY, sigW, sigH);
      doc.addImage(s2, 'JPEG', startX + sigW + gap, sigY, sigW, sigH);
      dibujarLineaYTexto(startX + sigW / 2, lineY, 'SELLOFIRMA');
      dibujarLineaYTexto(startX + sigW + gap + sigW / 2, lineY, 'SELLOFIRMADOCASIG');
    } else if (s1) {
      const imgX = profesionalX - sigW / 2;
      doc.addImage(s1, 'JPEG', imgX, sigY, sigW, sigH);
      dibujarLineaYTexto(profesionalX, lineY, 'SELLOFIRMA');
    } else if (s2) {
      const imgX = profesionalX - sigW / 2;
      doc.addImage(s2, 'JPEG', imgX, sigY, sigW, sigH);
      dibujarLineaYTexto(profesionalX, lineY, 'SELLOFIRMADOCASIG');
    }

    const lineYPaciente = tieneFirmaPaciente ? firmaPacienteY + 23 : 0;
    return tieneFirmaPaciente 
      ? Math.max(lineYPaciente + 10, lineY + 9)
      : lineY + 9;
  } else {
    return tieneFirmaPaciente ? firmaPacienteY + 33 : yPos + 10;
  }
};

// Función principal del jasper
export default async function Odontograma_lo_Digitalizado(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });

  // 1) Header con logo, color box y datos
  await drawHeader(doc, datos);

  // 2) Título principal
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("FICHA ODONTOGRAFICA DE IDENTIFICACIÓN DE PERSONAL (LEVANTAMIENTO DE OBSERVACIONES)", pageW / 2, 32, { align: "center" });

  // 3) Odontograma en la parte izquierda (con iconos de dientes)
  await drawOdontograma(doc, 40, datos);

  // 4) Datos personales
  const yPosDatos = drawPatientData(doc, datos);

  // 5) Leyenda de iconos
  const yPosLeyenda = await drawLeyenda(doc, yPosDatos);

  // 6) Tabla de estadísticas dentales
  const yPosEstadisticas = drawEstadisticas(doc, datos, yPosLeyenda);

  // 7) Observaciones
  const yPosObservaciones = drawObservaciones(doc, datos, yPosEstadisticas);

  // 8) Lugar y fecha
  const yPosLugarFecha = drawLugarFecha(doc, datos, yPosObservaciones);

  // 9) Firmas en la columna derecha
  await drawFirmasColumnaDerecha(doc, datos, yPosLugarFecha);

  // 10) Footer
  footerTR(doc, { footerOffsetY: 8, fontSize: 8 });

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
