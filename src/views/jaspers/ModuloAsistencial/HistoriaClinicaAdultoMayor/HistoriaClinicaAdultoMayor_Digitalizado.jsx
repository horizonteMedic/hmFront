import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils";
import { getSign } from "../../../utils/helpers";
import { dibujarFirmas } from "../../../utils/dibujarFirmas";
import HeaderAsistencial from "../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../components/datosPersonalesAsistencial.jsx";
import TituloSeccionAsistencial, { ALTO_FILA, FUENTE_CUERPO } from "../../components/tituloSeccionAsistencial.jsx";
import FilaEtiquetaValorAsistencial, {
  dibujarEtiquetaValor,
  medirEtiquetaValor,
} from "../../components/filaEtiquetaValorAsistencial.jsx";
import footerTR from "../../components/footerTR.jsx";
import dibujarCuadroTextoDinamico from "../../components/CuadroTextoDinamico.jsx";

// Formato digitalizado de la hoja física "Historia Clínica del Adulto Mayor".
//
// Recibe el objeto plano que arma `construirDatosImpresion` (controller del formulario), con los
// mismos nombres de campo del formulario (n_hcl, familiar_responsable, ap_hipertension, spg_caidas,
// vacunas, quirurgicos...) + los datos del pie (datosFooter). Sigue el orden de la hoja (datos
// personales y generales, antecedentes SI/NO, medicamentos, inmunizaciones, síndromes geriátricos,
// observaciones) y agrega lo que el formulario guarda y la hoja no trae (antecedentes quirúrgicos,
// antecedentes familiares por parentesco, examen/diagnóstico/tratamiento y firma del médico).
//
// El contenido fluye: las celdas se adaptan al texto (ver filaEtiquetaValorAsistencial.jsx) y las
// secciones saltan de página cuando no caben, repitiendo la cabecera y el pie.
//
// Estándar tipográfico (el de "Datos personales", ver tituloSeccionAsistencial.jsx): títulos de sección
// en MAYÚSCULAS (barra gris), subtítulos solo con la 1ª letra en mayúscula, y una única letra de 9pt.

const X = 10;
const ANCHO = 190;
const FS = FUENTE_CUERPO;
const PIE_OFFSET_Y = 8;
const Y_LIMITE = 272; // por debajo empieza el pie de página
const ANCHO_OPCION = 8; // ancho de cada celda SI / NO

const texto = (v) => String(v ?? "").trim();
const fechaCorta = (v) => formatearFechaCorta(texto(v)) || texto(v);

// Columnas de "Antecedentes personales": [campo del formulario, etiqueta impresa]. El detalle de
// cáncer / mordedura (solo lectura en el formulario) se imprime justo debajo de su fila.
const PERSONALES_1 = [
  ["ap_hipertension", "Hipertensión arterial"],
  ["ap_diabetes", "Diabetes"],
  ["ap_obesidad", "Obesidad / sobrepeso"],
  ["ap_infarto_cardiaco", "Infarto cardiaco / ICC"],
  ["ap_acv", "ACV (derrame cerebral)"],
  ["ap_osteoporosis", "Osteoporosis"],
  ["ap_hospitalizacion", "Hospitalización últ. 3 años"],
  ["ap_transfusion", "Transfusión"],
  ["ap_interv_quirurgica", "Interv. quirúrgica"],
  ["ap_accidentes", "Accidentes"],
  ["ap_cancer", "Cáncer (especificar)", { detalle: "tipoCancer", etiquetaDetalle: "Tipo:" }],
  ["sexualmente_activo", "Sexualmente activo (a)"],
  ["problema_sexualidad", "Problema de sexualidad"],
];

const PERSONALES_2 = [
  ["ap_tuberculosis", "Tuberculosis"],
  ["ap_its_vih", "ITS - VIH - SIDA"],
  ["ap_hepatitis_b", "Hepatitis B"],
  ["ap_malaria", "Malaria"],
  ["ap_osteoartrosis", "Osteoartrosis"],
  ["ap_glaucoma", "Glaucoma"],
  ["ap_convulsiones", "Convulsiones"],
  ["ap_depresion", "Depresión"],
  ["ap_riesgo_ocupacional", "Riesgo ocupacional"],
  ["ap_mordedura_animales", "Mordedura de animales", { detalle: "descripcionMordedura", etiquetaDetalle: "Descripción:" }],
];

// "Antecedentes patológicos familiares": texto libre por familiar, en filas de hasta 2 celdas.
const FAMILIARES_TEXTO = [
  [
    { etiqueta: "Padre - Especifique:", campo: "padre" },
    { etiqueta: "Madre - Especifique:", campo: "madre" },
  ],
  [
    { etiqueta: "Hermanos - Especifique:", campo: "hermanos" },
    { etiqueta: "Hijos - Especifique:", campo: "hijos" },
  ],
  [{ etiqueta: "Esposa/Cónyuge - Especifique:", campo: "esposaConyuge" }],
];

// Síndromes y problemas geriátricos: la hoja los reparte 8 + 5 (+ 3 datos de caídas en la derecha).
const SINDROMES_1 = [
  ["spg_incontinencia_urinaria", "Incontinencia urinaria"],
  ["spg_estrenimiento", "Estreñimiento"],
  ["spg_ulceras_presion", "Úlceras por presión"],
  ["spg_insomnio", "Insomnio"],
  ["spg_inmovilizacion", "Inmovilización"],
  ["spg_confusion_aguda", "Confusión aguda (delirio)"],
  ["spg_vertigo", "Vértigo"],
  ["spg_sincope", "Síncope"],
];

const SINDROMES_2 = [
  ["spg_prostatismo", "Prostatismo (síntomas prostáticos)"],
  ["spg_deprivacion_auditiva", "Deprivación auditiva"],
  ["spg_deprivacion_visual", "Deprivación visual"],
  ["spg_caidas", "Caídas"],
  ["spg_caidas_ultimo_ano", "Caídas en el último año"],
];

// Datos que bajan del backend como bloque clínico (solo lectura en el formulario).
const BLOQUE_CLINICO = [
  ["EXAMEN FÍSICO", "examenFisico"],
  ["EXÁMENES AUXILIARES", "examenesAuxiliares"],
  ["DIAGNÓSTICO", "diagnostico"],
  ["TRATAMIENTO", "tratamiento"],
  ["SEGUIMIENTO Y CONTROL", "seguimientoYControl"],
];

const COLUMNAS_QUIRURGICOS = [
  { etiqueta: "Año", campo: "anio", ancho: 18 },
  { etiqueta: "Hospital (Nombre - Lugar)", campo: "hospital", ancho: 62 },
  { etiqueta: "Operación", campo: "operacion", ancho: 50 },
  { etiqueta: "Días", campo: "diasHospitalizacion", ancho: 15 },
  { etiqueta: "Complicaciones", campo: "complicaciones", ancho: 45 },
];

// Alto que necesitan el sello y la firma del médico al final del documento (sello 20 + línea + rótulo).
const ALTO_FIRMA = 30;

const OPCIONES_CUADRO = {
  fontSize: 8,
  minHeight: 14,
  paddingTop: 8,
  lineHeight: 4,
  maxLineas: 12,
};

export default async function HistoriaClinicaAdultoMayor_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const numeroHistoriaClinica = texto(data.numeroHistoriaClinica);
  const nombreCompleto = texto(data.nombreCompleto) || `${texto(data.apellidos)} ${texto(data.nombres)}`.trim();

  // Documento auxiliar solo para medir cuadros de texto antes de decidir si caben en la página.
  const docMedicion = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // ===== Primitivas de dibujo =====
  const fuente = (estilo = "normal", size = FS) => doc.setFont("helvetica", estilo).setFontSize(size);
  const yBase = (yFila, alto = ALTO_FILA) => yFila + alto / 2 + 1; // baseline centrado en la fila
  const celda = (x, y, w, h) => doc.rect(x, y, w, h);

  // Texto de una línea para valores cortos de casillas fijas (etiquetas): si no cabe reduce la letra
  // (hasta 5.5) y, en último caso, recorta. El texto libre NO lo usa: va en celdas adaptables.
  const textoAjustado = (t, x, y, anchoMax, opts) => {
    const valor = texto(t);
    if (!valor) return;
    const base = doc.getFontSize();
    let size = base;
    while (size > 5.5 && doc.getTextWidth(valor) > anchoMax) {
      size -= 0.5;
      doc.setFontSize(size);
    }
    const linea = doc.getTextWidth(valor) > anchoMax ? doc.splitTextToSize(valor, anchoMax)[0] : valor;
    doc.text(linea, x, y, opts);
    doc.setFontSize(base);
  };

  const casilla = (x, y, marcada) => {
    const lado = 3.2;
    doc.setLineWidth(0.2);
    doc.rect(x, y, lado, lado);
    if (marcada) {
      const m = 0.5;
      doc.setLineWidth(0.5);
      doc.line(x + m, y + m, x + lado - m, y + lado - m);
      doc.line(x + lado - m, y + m, x + m, y + lado - m);
      doc.setLineWidth(0.2);
    }
    return lado;
  };

  // "Etiqueta ☐" en línea: devuelve la X donde puede seguir la siguiente opción.
  const opcion = (etiqueta, marcada, x, yTexto) => {
    fuente("normal");
    doc.text(etiqueta, x, yTexto);
    const xCasilla = x + doc.getTextWidth(etiqueta) + 1.2;
    const lado = casilla(xCasilla, yTexto - 3.2 + 0.5, marcada);
    return xCasilla + lado + 3;
  };

  const anchoOpcion = (etiqueta) => {
    fuente("normal");
    return doc.getTextWidth(etiqueta) + 1.2 + 3.2 + 3;
  };

  // Contenido propio para una celda adaptable, entre la etiqueta y el valor: "Si ☐ No ☐".
  const adornoSiNo = (valor) => ({
    ancho: 2.5 + anchoOpcion("Si") + anchoOpcion("No"),
    dibujar: (x, yTexto) => {
      const xNo = opcion("Si", valor === "SI", x + 2.5, yTexto);
      opcion("No", valor === "NO", xNo, yTexto);
    },
  });

  // Aspa centrada en una celda SI / NO de las tablas de la hoja.
  const marca = (x, y, w, h) => {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const m = 1.3;
    doc.setLineWidth(0.5);
    doc.line(cx - m, cy - m, cx + m, cy + m);
    doc.line(cx + m, cy - m, cx - m, cy + m);
    doc.setLineWidth(0.2);
  };

  // ===== Control de página =====
  let pagina = 1;
  let y = 0;

  // Cabecera compartida del módulo asistencial. Devuelve la Y donde empieza el contenido.
  const dibujarEncabezado = async () => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    return HeaderAsistencial(
      doc,
      {
        numeroTicket: data.numeroTicket,
        numeroHistoriaClinica,
        sede: data.sede,
        fecha: fechaCorta(data.fecha_apertura_hcl),
      },
      { pagina, titulo: "HISTORIA CLÍNICA DEL ADULTO MAYOR", etiquetaFecha: "Fecha de apertura HCL" }
    );
  };

  const cerrarPagina = () => footerTR(doc, { footerData: data, footerOffsetY: PIE_OFFSET_Y });

  const nuevaPagina = async () => {
    cerrarPagina();
    doc.addPage();
    pagina += 1;
    y = await dibujarEncabezado();
  };

  // Si el bloque que sigue no cabe en lo que queda de la página, salta a una nueva.
  const asegurar = async (alto) => {
    if (y + alto > Y_LIMITE) await nuevaPagina();
  };

  // ===== Bloques =====
  // Barra de título de sección (siempre en mayúsculas). Evita quedar huérfana al pie de la página.
  const seccion = async (titulo, altoSiguiente = ALTO_FILA * 2) => {
    await asegurar(ALTO_FILA + altoSiguiente);
    y = TituloSeccionAsistencial(doc, titulo, { x: X, y, ancho: ANCHO });
  };

  // Fila de celdas "Etiqueta: valor" adaptables al texto (la fila crece, nunca se recorta).
  const filaFlex = async (celdas) => {
    const alto = Math.max(ALTO_FILA, ...celdas.map((c) => medirEtiquetaValor(doc, c).alto));
    await asegurar(alto);
    y = FilaEtiquetaValorAsistencial(doc, celdas, { x: X, y });
  };

  // Columna de una tabla SI / NO de la hoja. Cada fila es:
  //  - "siNo": etiqueta + celdas SI / NO (valor "SI" | "NO" | vacío = sin marcar).
  //  - "valor": celda adaptable "Etiqueta: valor" de todo el ancho (detalle o dato libre).
  const prepararColumna = (filas, ancho) => {
    const items = [{ tipo: "cabecera", alto: ALTO_FILA }];
    filas.forEach((fila) => {
      if (fila.tipo === "valor") {
        const medida = medirEtiquetaValor(doc, { etiqueta: fila.etiqueta, valor: fila.valor, ancho });
        items.push({ ...fila, medida, alto: medida.alto });
      } else {
        items.push({ ...fila, tipo: "siNo", alto: ALTO_FILA });
      }
    });
    return { items, ancho, alto: items.reduce((suma, item) => suma + item.alto, 0) };
  };

  const dibujarColumna = ({ items, ancho }, x, yInicio) => {
    const anchoEtiqueta = ancho - 2 * ANCHO_OPCION;
    let yy = yInicio;
    items.forEach((item) => {
      if (item.tipo === "cabecera") {
        celda(x, yy, anchoEtiqueta, item.alto);
        celda(x + anchoEtiqueta, yy, ANCHO_OPCION, item.alto);
        celda(x + anchoEtiqueta + ANCHO_OPCION, yy, ANCHO_OPCION, item.alto);
        fuente("bold");
        doc.text("SI", x + anchoEtiqueta + ANCHO_OPCION / 2, yBase(yy), { align: "center" });
        doc.text("NO", x + anchoEtiqueta + ANCHO_OPCION * 1.5, yBase(yy), { align: "center" });
      } else if (item.tipo === "valor") {
        celda(x, yy, ancho, item.alto);
        dibujarEtiquetaValor(doc, item.medida, x, yy);
      } else {
        celda(x, yy, anchoEtiqueta, item.alto);
        celda(x + anchoEtiqueta, yy, ANCHO_OPCION, item.alto);
        celda(x + anchoEtiqueta + ANCHO_OPCION, yy, ANCHO_OPCION, item.alto);
        fuente("normal");
        textoAjustado(item.etiqueta, x + 2, yBase(yy), anchoEtiqueta - 3);
        if (item.valor === "SI") marca(x + anchoEtiqueta, yy, ANCHO_OPCION, item.alto);
        if (item.valor === "NO") marca(x + anchoEtiqueta + ANCHO_OPCION, yy, ANCHO_OPCION, item.alto);
      }
      yy += item.alto;
    });
  };

  // Filas de una columna de antecedentes: la fila SI/NO y, si es SI y tiene detalle, su detalle debajo.
  const filasAntecedentes = (lista) =>
    lista.flatMap(([campo, etiqueta, opciones]) => {
      const valor = data[campo];
      const filas = [{ etiqueta, valor }];
      const detalle = opciones ? texto(data[opciones.detalle]) : "";
      if (opciones && valor === "SI" && detalle) {
        filas.push({ tipo: "valor", etiqueta: opciones.etiquetaDetalle, valor: detalle });
      }
      return filas;
    });

  // Mide el cuadro de texto en un documento auxiliar para saber su alto exacto antes de dibujarlo.
  // `reserva` = alto extra que debe caber debajo (el último cuadro lo usa para no dejar la firma sola).
  const cuadroTexto = async (titulo, contenido, { minHeight = OPCIONES_CUADRO.minHeight, reserva = 0 } = {}) => {
    const opciones = { x: X, ancho: ANCHO, titulo, texto: contenido, ...OPCIONES_CUADRO, minHeight };
    const alto = dibujarCuadroTextoDinamico(docMedicion, { ...opciones, y: 0 });
    await asegurar(alto + 2 + reserva);
    y = dibujarCuadroTextoDinamico(doc, { ...opciones, y }) + 2;
  };

  // ===== Contenido =====
  y = await dibujarEncabezado();

  // ----- Datos personales (mismo diseño que Riesgo Cardiovascular) -----
  y = DatosPersonalesAsistencial(doc, { ...data, nombreCompleto }, { x: X, y, ancho: ANCHO, laborales: false });

  // ----- Datos generales: lo propio de la hoja que no cubre la tabla de datos personales -----
  await seccion("DATOS GENERALES", ALTO_FILA * 2);
  await filaFlex([
    { etiqueta: "Domicilio:", valor: data.domicilio, ancho: 125 },
    { etiqueta: "Teléfono:", valor: data.telefono, ancho: 65 },
  ]);
  await filaFlex([
    { etiqueta: "Ocupación:", valor: data.ocupacion, ancho: ANCHO / 2 },
    { etiqueta: "Procedencia:", valor: data.procedencia, ancho: ANCHO / 2 },
  ]);
  await filaFlex([
    { etiqueta: "Religión:", valor: data.religion, ancho: 63 },
    { etiqueta: "Raza:", valor: data.raza, ancho: 63 },
    { etiqueta: "Grupo sanguíneo:", valor: data.grupo_sanguineo, ancho: 64 },
  ]);
  await filaFlex([{ etiqueta: "Familiar o cuidador responsable:", valor: data.familiar_responsable, ancho: ANCHO }]);
  await filaFlex([
    { etiqueta: "Edad:", valor: data.edad_familiar, ancho: 35 },
    { etiqueta: "Domicilio / Teléfono:", valor: data.domicilio_telefono_familiar, ancho: 100 },
    { etiqueta: "Parentesco:", valor: data.parentesco, ancho: 55 },
  ]);

  // ----- Antecedentes personales (2 columnas SI / NO, como la hoja) -----
  const ANCHO_ANTECEDENTES = ANCHO / 2;
  const columnas = [
    prepararColumna(filasAntecedentes(PERSONALES_1), ANCHO_ANTECEDENTES),
    prepararColumna(filasAntecedentes(PERSONALES_2), ANCHO_ANTECEDENTES),
  ];
  const altoAntecedentes = Math.max(...columnas.map((c) => c.alto));
  await asegurar(ALTO_FILA + altoAntecedentes);
  y = TituloSeccionAsistencial(doc, "ANTECEDENTES PERSONALES", { x: X, y, ancho: ANCHO });
  columnas.forEach((columna, i) => dibujarColumna(columna, X + i * ANCHO_ANTECEDENTES, y));
  y += altoAntecedentes;

  // ----- Antecedentes patológicos familiares (texto por familiar) -----
  await seccion("ANTECEDENTES PATOLÓGICOS FAMILIARES");
  for (const fila of FAMILIARES_TEXTO) {
    const ancho = ANCHO / fila.length;
    await filaFlex(fila.map(({ etiqueta, campo }) => ({ etiqueta, valor: data[campo], ancho })));
  }

  // ----- Antecedentes quirúrgicos (siempre se imprime, como la tabla del formulario) -----
  const quirurgicos = Array.isArray(data.quirurgicos) ? data.quirurgicos : [];
  await seccion("ANTECEDENTES QUIRÚRGICOS", ALTO_FILA * 3);
  await filaFlex(COLUMNAS_QUIRURGICOS.map(({ etiqueta, ancho }) => ({ etiqueta, ancho })));
  if (quirurgicos.length === 0) {
    await filaFlex([{ valor: "No hay antecedentes quirúrgicos registrados", ancho: ANCHO }]);
  }
  for (const registro of quirurgicos) {
    await filaFlex(COLUMNAS_QUIRURGICOS.map(({ campo, ancho }) => ({ valor: registro[campo], ancho })));
  }

  // ----- Medicamentos -----
  await seccion("MEDICAMENTOS", ALTO_FILA * 3);
  await filaFlex([
    {
      etiqueta: "Reacción adversa a medicamentos",
      ancho: 100,
      adorno: adornoSiNo(data.reaccion_adversa_medicamentos),
    },
    {
      etiqueta: "¿Cuál?",
      valor: data.reaccion_adversa_medicamentos === "SI" ? data.reaccion_adversa_medicamentos_cual : "",
      ancho: 90,
    },
  ]);
  await filaFlex([
    {
      etiqueta: "Medicamentos de uso frecuente",
      ancho: 100,
      adorno: adornoSiNo(data.medicamentos_uso_frecuente),
    },
    {
      etiqueta: "¿Cuál?",
      valor: data.medicamentos_uso_frecuente === "SI" ? data.medicamentos_uso_frecuente_cual : "",
      ancho: 90,
    },
  ]);
  await filaFlex([
    { etiqueta: "Anotar dosis, tiempo de uso u otra observación:", valor: data.medicamentos_observacion, ancho: ANCHO },
  ]);

  // ----- Inmunizaciones: las vacunas registradas, en pares "Vacuna / Fecha" -----
  const vacunas = Array.isArray(data.vacunas) ? data.vacunas : [];
  await seccion("INMUNIZACIONES", ALTO_FILA * 2);
  if (vacunas.length === 0) {
    await filaFlex([{ valor: "No hay vacunas registradas", ancho: ANCHO }]);
  } else {
    for (let i = 0; i < vacunas.length; i += 2) {
      const celdasVacuna = (v) => [
        { etiqueta: "Vacuna:", valor: v?.vacuna, ancho: 62 },
        { etiqueta: "Fecha:", valor: v ? fechaCorta(v.fecha) : "", ancho: 33 },
      ];
      await filaFlex([...celdasVacuna(vacunas[i]), ...celdasVacuna(vacunas[i + 1])]);
    }
  }

  // ----- Síndromes y problemas geriátricos (2 columnas SI / NO, como la hoja) -----
  const ANCHO_SINDROMES = ANCHO / 2;
  const sindromes = [
    prepararColumna(
      SINDROMES_1.map(([campo, etiqueta]) => ({ etiqueta, valor: data[campo] })),
      ANCHO_SINDROMES
    ),
    prepararColumna(
      [
        ...SINDROMES_2.map(([campo, etiqueta]) => ({ etiqueta, valor: data[campo] })),
        { tipo: "valor", etiqueta: "N° de caídas:", valor: data.spg_n_caidas },
        { tipo: "valor", etiqueta: "Fracturas:", valor: data.spg_fracturas },
        { tipo: "valor", etiqueta: "Sitio anatómico:", valor: data.spg_sitio_anatomico },
      ],
      ANCHO_SINDROMES
    ),
  ];
  const altoSindromes = Math.max(...sindromes.map((c) => c.alto));
  await asegurar(ALTO_FILA + altoSindromes);
  y = TituloSeccionAsistencial(doc, "SÍNDROMES Y PROBLEMAS GERIÁTRICOS", { x: X, y, ancho: ANCHO });
  dibujarColumna(sindromes[0], X, y);
  dibujarColumna(sindromes[1], X + ANCHO_SINDROMES, y);
  y += altoSindromes;

  // ----- Observaciones y, si hay datos, examen / diagnóstico / tratamiento -----
  y += 2;
  const cuadros = [["OBSERVACIONES", data.observaciones, { minHeight: 18 }]];
  if (BLOQUE_CLINICO.some(([, campo]) => texto(data[campo]))) {
    BLOQUE_CLINICO.forEach(([titulo, campo]) => cuadros.push([titulo, data[campo], {}]));
  }
  for (const [i, [titulo, contenido, opciones]] of cuadros.entries()) {
    // El último cuadro reserva lugar para la firma, así nunca queda sola en una página.
    await cuadroTexto(titulo, contenido, { ...opciones, reserva: i === cuadros.length - 1 ? ALTO_FIRMA : 0 });
  }

  // ----- Sello y firma del médico -----
  // Con el sello digitalizado del médico asignado (SELLOFIRMADOCASIG) se dibuja igual que en el Triaje y los
  // laboratorios asistenciales (ver dibujarFirmas). Si no hay sello, o la imagen no carga, queda la línea
  // con el nombre para firmar a mano.
  y += 3;
  let firmaDibujada = false;
  if (getSign(data, "SELLOFIRMADOCASIG")) {
    doc.setDrawColor(0, 0, 0);
    doc.setTextColor(0, 0, 0);
    try {
      await dibujarFirmas({
        doc,
        datos: data,
        y,
        pageW: doc.internal.pageSize.getWidth(),
        mostrarFirmaPaciente: false,
      });
      firmaDibujada = true;
    } catch (error) {
      console.error("No se pudo dibujar el sello del médico:", error);
    }
  }
  if (!firmaDibujada) {
    const yLinea = y + 12;
    const xCentro = X + ANCHO * 0.75;
    doc.setLineWidth(0.2);
    doc.line(xCentro - 35, yLinea, xCentro + 35, yLinea);
    fuente("bold", 8);
    if (texto(data.nombre_medico)) {
      textoAjustado(`Dr(a). ${texto(data.nombre_medico)}`, xCentro, yLinea + 4, 70, { align: "center" });
    }
    fuente("normal", 7);
    doc.text("Sello y firma del médico", xCentro, yLinea + 8, { align: "center" });
  }

  cerrarPagina();

  if (docExistente) {
    return doc;
  }
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
