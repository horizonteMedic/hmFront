import jsPDF from "jspdf";
import drawColorBox from '../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { normalizeList } from "../../utils/listUtils.js";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import { getSign } from "../../utils/helpers";
import footerTR from '../components/footerTR.jsx';
import { formatDateLongEs } from "../../utils/formatDateLongEs.js";

export default function InformePsicologico_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  // Contador de páginas dinámico
  let numeroPagina = 1;

  // Normalizador único de datos de entrada
  function buildDatosFinales(raw) {
    const resultadoTexto = String(
      raw?.resultado ?? raw?.resultadoPsicologico ?? raw?.aptoTexto ?? raw?.apto_resultado ?? ''
    ).toUpperCase();

    const datosReales = {
      apellidosNombres: String((((raw?.apellidos_apellidos_pa ?? '') + ' ' + (raw?.nombres_nombres_pa ?? '')).trim())),
      fechaExamen: formatDateLongEs(raw?.fechaInformePsicologico ?? raw?.fecha_examen ?? ''),
      sexo: String(raw?.sexo_sexo_pa ?? raw?.sexo ?? ''),
      documentoIdentidad: String(raw?.dni_cod_pa ?? raw?.documento ?? ''),
      edad: String(raw?.edad_edad ?? raw?.edad ?? ''),
      fechaNacimiento: formatearFechaCorta(raw?.fechanacimientopaciente_fecha_nacimiento_pa ?? raw?.fecha_nacimiento ?? ''),
      domicilio: String(raw?.direccionpaciente_direccion_pa ?? raw?.domicilio ?? ''),
      areaTrabajo: String(raw?.area_area_o ?? raw?.area_trabajo ?? ''),
      puestoTrabajo: String(raw?.cargo_cargo_de ?? raw?.puesto_trabajo ?? ''),
      empresa: String(raw?.empresa_razon_empresa ?? raw?.empresa ?? ''),
      contrata: String(
        raw?.contrata_razon_contrata ?? raw?.contrata ?? raw?.contratista_razon_contratista ?? raw?.contratista ?? ''
      ),
      sede: String(raw?.sede ?? ''),
      numeroFicha: String(raw?.n_orden ?? raw?.numero_ficha ?? ''),
      codigoEntrevista: String(
        raw?.codEntrevista ?? raw?.cod_entrevista ?? raw?.codigoEntrevista ?? raw?.codigo_entrevista ?? ''
      ),
      color: Number(raw?.color ?? 0),
      codigoColor: String(raw?.codigoColor ?? ''),
      textoColor: String(raw?.textoColor ?? ''),
      cuerpo: {
        areaIntelectual: raw?.cuerpo?.areaIntelectual,
        areaPersonalidad: raw?.cuerpo?.areaPersonalidad,
        areaOrganicidad: raw?.cuerpo?.areaOrganicidad,
        areaPsicomotricidad: raw?.cuerpo?.areaPsicomotricidad,
        recomendaciones: raw?.cuerpo?.recomendaciones
      },
      apto: (typeof raw?.apto === 'boolean') ? raw.apto
        : (typeof raw?.aptoPsicologico === 'boolean') ? raw.aptoPsicologico
        : (typeof raw?.aptoInforme === 'boolean') ? raw.aptoInforme
        : resultadoTexto.includes('NO APTO') ? false
        : resultadoTexto.includes('APTO') ? true
        : false
    };

    const datosPrueba = {
      apellidosNombres: 'PÉREZ QUISPE, JUAN CARLOS',
      fechaExamen: formatDateLongEs('30/09/2025'),
      sexo: 'M',
      documentoIdentidad: '12345678',
      edad: '32',
      fechaNacimiento: '15/04/1993',
      domicilio: 'Av. Los Olivos 123 - Lima',
      areaTrabajo: 'Planta Concentradora',
      puestoTrabajo: 'Operador de Volquete',
      empresa: 'MINERA ANDINA S.A.C.',
      contrata: 'SERVICIOS INTEGRALES S.R.L.',
      sede: 'Trujillo Nicolas de Pierola',
      numeroFicha: '000123',
      codigoEntrevista: '63183',
      color: 2,
      codigoColor: '#2E7D32',
      textoColor: 'L',
      cuerpo: {
        // Datos de prueba como string con 7 ítems y separadores mixtos
        areaIntelectual: 'Razonamiento verbal\\nCálculo básico /n Memoria de trabajo 7n Atención sostenida \\n Comprensión lectora /n Velocidad de procesamiento 7n Resolución de problemas',
        areaPersonalidad: 'Responsable \\n Colaborador /n Proactivo 7n Tolerante a la presión \\n Comunicación asertiva /n Trabajo en equipo 7n Adaptabilidad',
        areaOrganicidad: 'Orientado en tiempo \\n Orientado en espacio /n Orientado en persona 7n Juicio conservado \\n Memoria íntegra /n Conciencia clara 7n No hay signos neurológicos focales',
        areaPsicomotricidad: 'Coordinación fina adecuada \\n Coordinación gruesa adecuada /n Ritmo y secuencia 7n Trazos firmes \\n Precisión visomotora /n Equilibrio 7n Lateralidad definida',
        recomendaciones: 'Pausas activas diarias \\n Higiene del sueño /n Técnicas de respiración 7n Gestión de emociones \\n Taller de comunicación /n Reforzamiento cognitivo 7n Seguimiento psicológico'
      },
      apto: true
    };

    const selected = (raw && (raw.n_orden || raw.numero_ficha)) ? datosReales : datosPrueba;
    // Asegurar que las secciones de cuerpo sean arrays listables
    selected.cuerpo = {
      areaIntelectual: normalizeList(selected.cuerpo.areaIntelectual),
      areaPersonalidad: normalizeList(selected.cuerpo.areaPersonalidad),
      areaOrganicidad: normalizeList(selected.cuerpo.areaOrganicidad),
      areaPsicomotricidad: normalizeList(selected.cuerpo.areaPsicomotricidad),
      recomendaciones: normalizeList(selected.cuerpo.recomendaciones)
    };
    return selected;
  }

  const datosFinales = buildDatosFinales(data);

  // Header reutilizable (igual que otros formatos)
  const drawHeader = (pageNumber) => {
    // Logo y membrete
    CabeceraLogo(doc, { ...datosFinales, tieneMembrete: false, yOffset: 12 });

    // Títulos
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("INFORME PSICOLÓGICO", pageW / 2, 25, { align: "center" });

    // Número de Ficha, Sede y Página
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("Nro de ficha: ", pageW - 70, 25);
    doc.setFont("helvetica", "bold").setFontSize(18);
    doc.text(datosFinales.numeroFicha, pageW - 50, 26);
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text("Cod. Entrevista : " + (datosFinales.codigoEntrevista || ""), pageW - 70, 20);
    doc.text("Sede: " + datosFinales.sede, pageW - 70, 30);
    doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 30, 10);

    // Bloque de color
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

  // === PÁGINA 1 ===
  drawHeader(numeroPagina);

  // Fecha de examen (label en negrita, dato en normal)
  doc.setFont("helvetica", "bold").setFontSize(9);
  const labelFecha = "Fecha Examen:";
  const labelFechaX = 15;
  const labelFechaY = 35;
  doc.text(labelFecha, labelFechaX, labelFechaY);
  const labelFechaAncho = doc.getTextWidth(labelFecha + " ");
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text((datosFinales.fechaExamen || ""), labelFechaX + labelFechaAncho + 0.5, labelFechaY);

  // I. Datos de Afiliación
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("I.- DATOS DE FILIACIÓN	", 15, 40);
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Datos personales (con base ajustable)
  const baseDatosY = 45;
  const datosPersonales = [
    { label: "Apellidos y Nombres:", value: datosFinales.apellidosNombres, x: 20, y: baseDatosY, labelOffset: 0, valueOffset: 35 },
    { label: "DNI:", value: datosFinales.documentoIdentidad, x: 130, y: baseDatosY, labelOffset: 0, valueOffset: 8 },
    { label: "Sexo:", value: datosFinales.sexo, x: 163, y: baseDatosY + 5, labelOffset: 0, valueOffset: 10 },
    { label: "Edad:", value: datosFinales.edad, x: 130, y: baseDatosY + 5, labelOffset: 0, valueOffset: 10 },
    { label: "Fecha Nac.:", value: datosFinales.fechaNacimiento, x: 163, y: baseDatosY, labelOffset: 0, valueOffset: 20 },
    { label: "Domicilio:", value: datosFinales.domicilio, x: 20, y: baseDatosY + 5, labelOffset: 0, valueOffset: 20 },
    { label: "Área de Trabajo:", value: datosFinales.areaTrabajo, x: 130, y: baseDatosY + 10, labelOffset: 0, valueOffset: 27 },
    { label: "Puesto de Trabajo:", value: datosFinales.puestoTrabajo, x: 20, y: baseDatosY + 10, labelOffset: 0, valueOffset: 30 },
    { label: "Empresa:", value: datosFinales.empresa, x: 20, y: baseDatosY + 15, labelOffset: 0, valueOffset: 20 },
    { label: "Contratista:", value: datosFinales.contrata, x: 20, y: baseDatosY + 20, labelOffset: 0, valueOffset: 23 }
  ];

  datosPersonales.forEach(item => {
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(item.label, item.x + item.labelOffset, item.y);
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(item.value || "", item.x + item.valueOffset, item.y);
  });

  // Título de resultados (sin marco)
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("II.- RESULTADOS", 15, 73);
  doc.setFont("helvetica", "normal").setFontSize(9);

  // Utilidades para texto dinámico con salto de página
  const contentLeft = 20;
  const contentRight = 195;
  const contentWidth = contentRight - contentLeft; // 175
  const contentTop = 79;
  const contentBottom = 285; // margen inferior de página
  let cursorY = contentTop;
  const MIN_BLOCK_HEIGHT = 20; // mm por sección como base

  const ensureSpace = (neededHeight) => {
    if (cursorY + neededHeight <= contentBottom) return;
    // Nueva página si no alcanza
    doc.addPage();
    numeroPagina++;
    drawHeader(numeroPagina);
    // reiniciar zona de contenido sin marco
    cursorY = 25; // margen superior estándar en siguientes páginas
  };

  const writeParagraph = (text, options = {}) => {
    const maxWidth = options.maxWidth ?? contentWidth;
    const indent = options.indent ?? 0;
    const lineHeight = options.lineHeight ?? 3; // más junto
    const lines = doc.splitTextToSize(text, maxWidth - indent);
    const height = lines.length * lineHeight;
    ensureSpace(height);
    const x = contentLeft + indent;
    doc.text(lines, x, cursorY);
    cursorY += height + (options.spacing ?? 1);
  };

  const writeSubtitle = (text) => {
    ensureSpace(6);
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(text, contentLeft, cursorY);
    cursorY += 5;
    doc.setFont("helvetica", "normal").setFontSize(8);
  };

  const writeListSection = (subtitle, items, prefix = "- ") => {
    writeSubtitle(subtitle);
    const startY = cursorY;
    items.forEach(t => writeParagraph((prefix ?? "") + t));
    const consumed = cursorY - startY;
    if (consumed < MIN_BLOCK_HEIGHT) {
      const extra = MIN_BLOCK_HEIGHT - consumed;
      ensureSpace(extra);
      cursorY += extra;
    }
    // Espacio simple entre secciones
    ensureSpace(2);
    cursorY += 2;
  };

  // Cuerpo proveniente del normalizador
  const cuerpo = datosFinales.cuerpo;

  // a. Área Intelectual
  writeListSection(
    "a.- Área Intelectual (Test de Inteligencia de Barranquilla/test de Otis Intermedia)",
    cuerpo.areaIntelectual,
    "- "
  );

  // b. Personalidad
  writeListSection(
    "b.- Área de Personalidad(Test de la figura humana de machover / Inventario Multifásico de personalidad)",
    cuerpo.areaPersonalidad,
    "  "
  );

  // c. Organicidad
  writeListSection(
    "c.- Área de Organicidad(Test de Bender para adultos / test de Benton Forma C)",
    cuerpo.areaOrganicidad,
    "- "
  );

  // d. Psicomotricidad
  writeListSection(
    "d.- Área de Psicomotricidad (Prueba de Laberintos de Weschler)",
    cuerpo.areaPsicomotricidad,
    "- "
  );

  // e. Recomendaciones
  writeListSection(
    "e.- Recomendaciones",
    cuerpo.recomendaciones,
    "  "
  );

  // III.- APTO PARA EL CARGO (estilo de título como RESULTADOS)
  ensureSpace(6);
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("III.- APTO PARA EL CARGO", 15, cursorY);
  cursorY += 6;
  doc.setFont("helvetica", "normal").setFontSize(9);
  const isApto = Boolean(datosFinales.apto);
  ensureSpace(8);
  const baseY = cursorY;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(`SI ( ${isApto ? 'X' : ' '} )     NO ( ${!isApto ? 'X' : ' '} )`, contentLeft, baseY);
  cursorY += 10;

  // Firma única: solo imagen, con ejes X/Y configurables
  const placeSignatures = () => {
    const firmaX = Number(data.firmaX ?? (pageW / 2 + 35));
    const firmaY = Number(data.firmaY ?? (pageH - 70));
    const firmaW = Number(data.firmaW ?? 40);
    const firmaH = Number(data.firmaH ?? 25);
    let imagenPintada = false;
    try {
      const firma = getSign(data, "SELLOFIRMA") || getSign(data, "FIRMAP");
      if (firma) {
        doc.addImage(firma, 'PNG', firmaX, firmaY, firmaW, firmaH);
        imagenPintada = true;
      }
    } catch (e) {
      // si no hay imagen, no se dibuja nada
    }
    if (!imagenPintada && (data.showFirmaPlaceholder ?? true)) {
      doc.setFont("helvetica", "normal").setFontSize(8);
      doc.text("[FIRMA]", firmaX + (firmaW / 2), firmaY + (firmaH / 2), { align: "center" });
    }
  };

  placeSignatures();

   // === FOOTER ===
  footerTR(doc, { footerOffsetY: 5 });

  // Imprimir
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


