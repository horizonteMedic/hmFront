import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import { convertirGenero, getSign } from "../../../utils/helpers.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import drawColorBox from '../../components/ColorBox.jsx';

export default function INFORME_ADICIONAL_DE_FOBIAS_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // DATOS DE PRUEBA (remover en producción)
  const datosPrueba = {
    apellidosPaciente: "GARCÍA MENDOZA",
    nombresPaciente: "JUAN CARLOS",
    fechaFichaAnexo16_fecha: "2024-01-15",
    sexoPaciente: "M",
    dniPaciente: "12345678",
    edadPaciente: "35",
    areaPaciente: "OPERACIONES MINA",
    cargoPaciente: "OPERADOR DE EQUIPO PESADO",
    empresa: "COMPAÑÍA MINERA PODEROSA S.A.",
    contrata: "CONTRATISTA EJEMPLO S.A.C.",
    norden: "00123456",
    sede: "TRUJILLO",
    fechaNacimientoPaciente: "1989-05-20",
    color: 1,
    codigoColor: "#00FF00",
    textoColor: "AT",
    inteligencia: "NIVEL PROMEDIO - CI: 105. Capacidad de razonamiento lógico y abstracto dentro de parámetros normales.",
    fobias: "NO PRESENTA FOBIAS SIGNIFICATIVAS. Evaluación mediante test de ansiedad y cuestionario de fobias específicas sin hallazgos relevantes.",
    fortalezasOportunidades: "Buena capacidad de adaptación, trabajo en equipo, liderazgo, comunicación efectiva, proactividad y compromiso con las metas organizacionales.",
    amenazasDebilidades: "Tendencia al perfeccionismo que puede generar estrés en situaciones de alta demanda. Se recomienda técnicas de manejo del tiempo.",
    observaciones: "El evaluado muestra un perfil psicológico estable y compatible con las exigencias del puesto. Presenta adecuada tolerancia a la frustración y capacidad para trabajar bajo presión. Se observa motivación intrínseca hacia el trabajo y buenas relaciones interpersonales.",
    recomendaciones: "1. Continuar con evaluaciones periódicas cada 12 meses.\n2. Participar en programas de manejo del estrés.\n3. Mantener actividades recreativas para equilibrio emocional.\n4. Fortalecer técnicas de comunicación asertiva.",
    apto: true,
  };

  // Usar datos de prueba si no hay data real
  const dataFinal = Object.keys(data).length > 0 ? data : datosPrueba;

  const datosReales = {
    apellidosNombres: String(`${dataFinal.apellidosPaciente ?? ""} ${dataFinal.nombresPaciente ?? ""}`).trim(),
    fechaExamen: formatearFechaCorta(dataFinal.fechaFichaAnexo16_fecha ?? ""),
    tipoExamen: String(dataFinal.nombreExamen ?? ""),
    sexo: convertirGenero(dataFinal.sexoPaciente) || "",
    documentoIdentidad: String(dataFinal.dniPaciente ?? ""),
    edad: String(dataFinal.edadPaciente ?? ""),
    areaTrabajo: String(dataFinal.areaPaciente ?? ""),
    puestoTrabajo: String(dataFinal.cargoPaciente ?? ""),
    empresa: String(dataFinal.empresa ?? ""),
    contrata: String(dataFinal.contrata ?? ""),
    numeroFicha: String(dataFinal.norden ?? ""),
    sede: String(dataFinal.sede ?? dataFinal.nombreSede ?? ""),
    fechaNacimiento: formatearFechaCorta(dataFinal.fechaNacimientoPaciente ?? ""),
    codigoColor: String(dataFinal.codigoColor ?? ""),
    textoColor: String(dataFinal.textoColor ?? ""),
  };

  // === HEADER / CABECERA ===
  CabeceraLogo(doc, { ...datosReales, tieneMembrete: false });

  // Número de Ficha y Página
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(datosReales.numeroFicha, pageW - 60, 16);
  doc.setFont("helvetica", "normal").setFontSize(8);
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
  doc.text("INFORME PSICOLÓGICO - FOBIAS", pageW / 2, 35, { align: "center" });

  // === SECCIÓN: DATOS PERSONALES ===
  const tablaInicioX = 10;
  const tablaAncho = 190;
  let yPos = 38;
  const filaAltura = 6;

  // Header de datos personales
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("DATOS PERSONALES", tablaInicioX + 2, yPos + 4);
  yPos += filaAltura;

  // Fila 1: Apellidos y Nombres
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.apellidosNombres || "", tablaInicioX + 40, yPos + 4);
  yPos += filaAltura;

  // Fila 2: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  const col1W = 47.5;
  const col2W = 47.5;
  const col3W = 47.5;
  const col4W = 47.5;

  doc.rect(tablaInicioX, yPos, col1W, filaAltura, 'S');
  doc.rect(tablaInicioX + col1W, yPos, col2W, filaAltura, 'S');
  doc.rect(tablaInicioX + col1W + col2W, yPos, col3W, filaAltura, 'S');
  doc.rect(tablaInicioX + col1W + col2W + col3W, yPos, col4W, filaAltura, 'S');

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.documentoIdentidad || "", tablaInicioX + 12, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + col1W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datosReales.edad || "") + " años", tablaInicioX + col1W + 14, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + col1W + col2W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.sexo || "", tablaInicioX + col1W + col2W + 14, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + col1W + col2W + col3W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.fechaNacimiento || "", tablaInicioX + col1W + col2W + col3W + 22, yPos + 4);
  yPos += filaAltura;

  // Fila 3: Puesto de Trabajo y Área de Trabajo (2 columnas)
  const col2MitadW = 95;
  doc.rect(tablaInicioX, yPos, col2MitadW, filaAltura, 'S');
  doc.rect(tablaInicioX + col2MitadW, yPos, col2MitadW, filaAltura, 'S');

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.puestoTrabajo || "", tablaInicioX + 32, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + col2MitadW + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.areaTrabajo || "", tablaInicioX + col2MitadW + 30, yPos + 4);
  yPos += filaAltura;

  // Fila 4: Empresa
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.empresa || "", tablaInicioX + 20, yPos + 4);
  yPos += filaAltura;

  // Fila 5: Contrata
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.contrata || "", tablaInicioX + 22, yPos + 4);
  yPos += filaAltura;

  // Datos adicionales para las secciones
  const datosAdicionales = {
    inteligencia: String(dataFinal.inteligencia ?? ""),
    fobias: String(dataFinal.fobias ?? ""),
    fortalezasOportunidades: String(dataFinal.fortalezasOportunidades ?? ""),
    amenazasDebilidades: String(dataFinal.amenazasDebilidades ?? ""),
    observaciones: String(dataFinal.observaciones ?? ""),
    recomendaciones: String(dataFinal.recomendaciones ?? ""),
    apto: dataFinal.apto ?? false,
  };

  // Función para dibujar header gris
  const dibujarHeaderGris = (titulo, y) => {
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, y, tablaAncho, filaAltura, 'F');
    doc.rect(tablaInicioX, y, tablaAncho, filaAltura, 'S');
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, y + 4);
    return y + filaAltura;
  };

  // Función para fila con label y data (2 columnas) - CRECIENTE
  const dibujarFilaLabelData = (label, valor, y) => {
    const labelW = 60;
    const dataW = tablaAncho - labelW;
    const padding = 2;
    doc.setFont("helvetica", "normal").setFontSize(8);
    
    // Calcular altura necesaria para el valor
    let alturaFila = filaAltura;
    if (valor && doc.getTextWidth(valor) > dataW - 4) {
      const lineas = doc.splitTextToSize(valor, dataW - 4);
      const alturaTexto = lineas.length * 3.5 + padding * 2;
      alturaFila = Math.max(filaAltura, alturaTexto);
    }
    
    // Dibujar celdas
    doc.rect(tablaInicioX, y, labelW, alturaFila, 'S');
    doc.rect(tablaInicioX + labelW, y, dataW, alturaFila, 'S');
    
    // Dibujar label
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(label, tablaInicioX + 2, y + 4);
    
    // Dibujar valor (con salto de línea si es necesario)
    doc.setFont("helvetica", "normal").setFontSize(8);
    if (valor) {
      if (doc.getTextWidth(valor) > dataW - 4) {
        const lineas = doc.splitTextToSize(valor, dataW - 4);
        lineas.forEach((linea, idx) => {
          doc.text(linea, tablaInicioX + labelW + 2, y + padding + 2 + (idx * 3.5));
        });
      } else {
        doc.text(valor, tablaInicioX + labelW + 2, y + 4);
      }
    }
    
    return y + alturaFila;
  };

  // Función para fila con texto creciente (mínimo 15mm)
  const dibujarFilaCreciente = (texto, y) => {
    const alturaMinima = 35;
    const padding = 3;
    doc.setFont("helvetica", "normal").setFontSize(8);
    
    let alturaFila = alturaMinima;
    if (texto && doc.getTextWidth(texto) > tablaAncho - 4) {
      const lineas = doc.splitTextToSize(texto, tablaAncho - 4);
      const alturaTexto = lineas.length * 3.5 + padding * 2;
      alturaFila = Math.max(alturaMinima, alturaTexto);
    }
    
    doc.rect(tablaInicioX, y, tablaAncho, alturaFila, 'S');
    
    if (texto) {
      if (doc.getTextWidth(texto) > tablaAncho - 4) {
        const lineas = doc.splitTextToSize(texto, tablaAncho - 4);
        lineas.forEach((linea, idx) => {
          doc.text(linea, tablaInicioX + 2, y + padding + 2 + (idx * 3.5));
        });
      } else {
        doc.text(texto, tablaInicioX + 2, y + padding + 2);
      }
    }
    
    return y + alturaFila;
  };

  // === SECCIÓN II: CRITERIOS PSICOLÓGICOS ===
  yPos = dibujarHeaderGris("II. CRITERIOS PSICOLÓGICOS", yPos);
  yPos = dibujarFilaLabelData("- INTELIGENCIA", datosAdicionales.inteligencia, yPos);
  yPos = dibujarFilaLabelData("- FOBIAS", datosAdicionales.fobias, yPos);

  // === SECCIÓN III: ANÁLISIS FODA ===
  yPos = dibujarHeaderGris("III. ANÁLISIS FODA", yPos);
  yPos = dibujarFilaLabelData("FORTALEZAS / OPORTUNIDADES:", datosAdicionales.fortalezasOportunidades, yPos);
  yPos = dibujarFilaLabelData("AMENAZAS / DEBILIDADES:", datosAdicionales.amenazasDebilidades, yPos);

  // === SECCIÓN IV: OBSERVACIONES ===
  yPos = dibujarHeaderGris("IV. OBSERVACIONES", yPos);
  yPos = dibujarFilaCreciente(datosAdicionales.observaciones, yPos);

  // === SECCIÓN V: RECOMENDACIONES ===
  yPos = dibujarHeaderGris("V. RECOMENDACIONES", yPos);
  yPos = dibujarFilaCreciente(datosAdicionales.recomendaciones, yPos);

  // === FILA DE FIRMA DEL MÉDICO ===
  const alturaFirma = 25;
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaFirma, 'S');
  
  // Agregar firma del médico (imagen)
  let firmaMedicoUrl = getSign(dataFinal, "SELLOFIRMA");
  if (firmaMedicoUrl) {
    try {
      const imgWidth = 45;
      const imgHeight = 20;
      const x = tablaInicioX + (tablaAncho / 2) - (imgWidth / 2);
      const y = yPos + 2;
      doc.addImage(firmaMedicoUrl, 'PNG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.log("Error cargando firma del médico:", error);
    }
  }
  yPos += alturaFirma;

  // === SECCIÓN VI: CONCLUSIONES ===
  yPos = dibujarHeaderGris("VI. CONCLUSIONES", yPos);
  
  // Fila de APTO / NO APTO con checkboxes
  const colAptoW = 47.5;
  doc.rect(tablaInicioX, yPos, colAptoW, filaAltura, 'S');
  doc.rect(tablaInicioX + colAptoW, yPos, colAptoW, filaAltura, 'S');
  doc.rect(tablaInicioX + colAptoW * 2, yPos, colAptoW, filaAltura, 'S');
  doc.rect(tablaInicioX + colAptoW * 3, yPos, colAptoW, filaAltura, 'S');

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("APTO", tablaInicioX + colAptoW / 2, yPos + 4, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosAdicionales.apto ? "X" : "", tablaInicioX + colAptoW + colAptoW / 2, yPos + 4, { align: "center" });
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("NO APTO", tablaInicioX + colAptoW * 2 + colAptoW / 2, yPos + 4, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(!datosAdicionales.apto ? "X" : "", tablaInicioX + colAptoW * 3 + colAptoW / 2, yPos + 4, { align: "center" });
  yPos += filaAltura;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });

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

