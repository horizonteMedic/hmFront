import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils";
import HeaderAsistencial from "../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../components/datosPersonalesAsistencial.jsx";
import TituloSeccionAsistencial, { ALTO_FILA, FUENTE_CUERPO } from "../../components/tituloSeccionAsistencial.jsx";
import FilaEtiquetaValorAsistencial, {
  dibujarEtiquetaValor,
  medirEtiquetaValor,
} from "../../components/filaEtiquetaValorAsistencial.jsx";
import footerTR from "../../components/footerTR.jsx";
import dibujarCuadroTextoDinamico from "../../components/CuadroTextoDinamico.jsx";

// Formato digitalizado de la hoja física "Historia Clínica de la Mujer y el Varón Adulto".
//
// Recibe el objeto plano que arma `construirDatosImpresion` (controller del formulario), con los
// mismos nombres de campo del formulario (n_hcl, nombre_padre, ap_obesidad, vacuna_dt_1_dosis...)
// + los datos del pie (datosFooter). Página 1 = réplica de la hoja; página 2 (solo si hay datos)
// = Examen físico / Exámenes auxiliares / Diagnóstico / Tratamiento + firma del médico.
//
// Estándar tipográfico (el de "Datos personales", ver tituloSeccionAsistencial.jsx): títulos de sección
// en MAYÚSCULAS (barra gris), subtítulos solo con la 1ª letra en mayúscula, y una única letra de 9pt.

const X = 10;
const ANCHO = 190;
const CASILLA = 3.2;
const FS = FUENTE_CUERPO;
const PIE_OFFSET_Y = 8;

const texto = (v) => String(v ?? "").trim();
const sinAcentos = (v) => texto(v).normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
const fechaCorta = (v) => formatearFechaCorta(texto(v)) || texto(v);

const normalizarDatos = (data) => {
  const nacionalidad = sinAcentos(data.nacionalidad);
  
  const esPeruana = nacionalidad.startsWith("PERU");

  return {
    numeroHistoriaClinica: texto(data.numeroHistoriaClinica),
    fechaApertura: fechaCorta(data.fecha_apertura_hcl),
    nombreCompleto: `${texto(data.apellidos)} ${texto(data.nombres)}`.trim(),
    dni: texto(data.dni),
    esPeruana,
    otraNacionalidad: nacionalidad && !esPeruana ? texto(data.nacionalidad) : "",
    tienePagina2: [data.examenFisico, data.examenesAuxiliares, data.diagnostico, data.tratamiento].some(
      (v) => texto(v)
    ),
  };
};

// Columnas de "Antecedentes Patológicos" (campo del formulario + etiqueta impresa).
const PATOLOGICOS = [
  [
    ["ap_obesidad", "1. Obesidad"],
    ["ap_epilepsia", "2. Epilepsia"],
    ["ap_asma", "3. Asma"],
    ["ap_tuberculosis", "4. Tuberculosis"],
  ],
  [
    ["ap_dengue", "5. Dengue"],
    ["ap_malaria", "6. Malaria"],
    ["ap_its", "7. ITS"],
    ["ap_glaucoma", "8. Glaucoma"],
  ],
  [
    ["ap_vih_sida", "9. VIH/SIDA"],
    ["ap_hepatitis_b", "10. Hepatitis B"],
    ["ap_depresion", "11. Depresión"],
    ["ap_infarto_cardiaco", "12. Infarto Cardiaco"],
  ],
  [
    ["ap_dislipidemia", "13. Dislipidemia"],
    ["ap_insuficiencia_renal", "14. Insuficiencia Renal"],
    ["ap_neoplasia", "15. Neoplasia:"],
    ["ap_transfusion_sanguinea", "16. Transfusión Sanguínea"],
  ],
];

// "Antecedentes Patológicos Familiares": mismos 5 campos y etiquetas del formulario (texto libre
// por familiar), en filas de hasta 2 celdas. El último va a todo el ancho.
const FAMILIARES = [
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
// Inmunizaciones: prefijo de los campos del formulario y N° de dosis que soporta cada vacuna.
const VACUNAS = [
  { nombre: "DT", prefijo: "vacuna_dt", dosis: 3 },
  { nombre: "HVB", prefijo: "vacuna_hvb", dosis: 3 },
  { nombre: "Antiamarílica", prefijo: "vacuna_antiamarilica", dosis: 1 },
];

export default async function HistoriaClinicaMujerVaronAdulto_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const d = normalizarDatos(data);

  // ===== Primitivas de dibujo =====
  const fuente = (estilo = "normal", size = FS) => doc.setFont("helvetica", estilo).setFontSize(size);
  const yBase = (yFila, alto = ALTO_FILA) => yFila + alto / 2 + 1; // baseline centrado en la fila
  const celda = (x, y, w, h) => doc.rect(x, y, w, h);

  // Texto de una línea para valores cortos de casillas fijas (números): si no cabe en el ancho dado
  // reduce la letra (hasta 5.5) y, en último caso, recorta. Los campos de texto libre NO lo usan:
  // van en celdas adaptables (filaEtiquetaValor), que achican un poco la letra y saltan de línea.
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

  // "Etiqueta: valor" — etiqueta en negrita y el valor a continuación, dentro de un ancho máximo.
  const etiquetaValor = (etiqueta, valor, x, y, anchoMax) => {
    fuente("bold");
    doc.text(etiqueta, x, y);
    const ancho = doc.getTextWidth(etiqueta) + 1.5;
    fuente("normal");
    textoAjustado(valor, x + ancho, y, anchoMax - ancho);
  };

  // Fila de celdas "Etiqueta: valor" adaptables al texto: si el valor no cabe, primero se achica un
  // poco la letra y, si aun así no entra, salta de línea (la fila crece, nunca se recorta). Ver
  // filaEtiquetaValorAsistencial.jsx. Devuelve la Y donde termina la fila.
  const filaEtiquetaValor = (celdas, y) => FilaEtiquetaValorAsistencial(doc, celdas, { x: X, y });

  const casilla = (x, y, marcada) => {
    doc.setLineWidth(0.2);
    doc.rect(x, y, CASILLA, CASILLA);
    if (marcada) {
      const m = 0.5;
      doc.setLineWidth(0.5);
      doc.line(x + m, y + m, x + CASILLA - m, y + CASILLA - m);
      doc.line(x + CASILLA - m, y + m, x + m, y + CASILLA - m);
      doc.setLineWidth(0.2);
    }
  };

  // "Etiqueta ☐" en línea: devuelve la X donde puede seguir la siguiente opción.
  const opcion = (etiqueta, marcada, x, yTexto) => {
    fuente("normal");
    doc.text(etiqueta, x, yTexto);
    const xCasilla = x + doc.getTextWidth(etiqueta) + 1.2;
    casilla(xCasilla, yTexto - CASILLA + 0.5, marcada);
    return xCasilla + CASILLA + 3;
  };

  // Ancho que ocupa una opción "Etiqueta ☐" dibujada con `opcion`.
  const anchoOpcion = (etiqueta) => {
    fuente("normal");
    return doc.getTextWidth(etiqueta) + 1.2 + CASILLA + 3;
  };

  // Contenido propio para una celda adaptable (ver filaEtiquetaValor), entre la etiqueta y el valor.
  const adornoSiNo = (valor) => ({
    ancho: 2.5 + anchoOpcion("Si") + anchoOpcion("No"),
    dibujar: (x, yTexto) => {
      const xNo = opcion("Si", valor === "SI", x + 2.5, yTexto);
      opcion("No", valor === "NO", xNo, yTexto);
    },
  });
  const adornoNacionalidad = () => {
    fuente("normal");
    return {
      ancho: anchoOpcion("Peruana") + doc.getTextWidth("Otra:") + 1,
      dibujar: (x, yTexto) => {
        const xOtra = opcion("Peruana", d.esPeruana, x, yTexto);
        fuente("normal");
        doc.text("Otra:", xOtra, yTexto);
      },
    };
  };

  // "Etiqueta ........ ☐" con la casilla pegada al borde derecho de la columna.
  const itemColumna = (etiqueta, marcada, xCol, wCol, yFila, { estilo = "normal", linea = false } = {}) => {
    const yt = yBase(yFila);
    fuente(estilo);
    doc.text(etiqueta, xCol + 2, yt);
    const xCasilla = xCol + wCol - CASILLA - 2;
    if (linea) {
      doc.setLineWidth(0.2);
      doc.line(xCol + 2 + doc.getTextWidth(etiqueta) + 1, yt + 0.4, xCasilla - 1.5, yt + 0.4);
    }
    casilla(xCasilla, yFila + (ALTO_FILA - CASILLA) / 2, marcada);
  };

  // Barra de título de sección (siempre en mayúsculas), la misma que usa "Datos personales".
  const barra = (titulo, y) => TituloSeccionAsistencial(doc, titulo, { x: X, y, ancho: ANCHO });

  // ===== Encabezado =====
  // Cabecera compartida del módulo asistencial (formato de Riesgo Cardiovascular, con N° Ticket y
  // N° Historia Clínica). Devuelve la Y donde empieza el contenido.
  const dibujarEncabezado = async (pagina) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    return HeaderAsistencial(
      doc,
      {
        numeroTicket: data.numeroTicket,
        numeroHistoriaClinica: d.numeroHistoriaClinica,
        sede: data.sede,
        fecha: d.fechaApertura,
      },
      { pagina, titulo: "HISTORIA CLÍNICA DE LA MUJER Y EL VARÓN ADULTO", etiquetaFecha: "Fecha de apertura HCL" }
    );
  };

  // ===== Página 1: réplica de la hoja =====
  const dibujarPagina1 = (yInicio) => {
    // ----- Datos personales (mismo diseño que Riesgo Cardiovascular) -----
    let y = DatosPersonalesAsistencial(doc, { ...data, nombreCompleto: d.nombreCompleto }, { x: X, y: yInicio, ancho: ANCHO });

    // ----- Datos generales: lo propio de la hoja que no cubre la tabla de datos personales -----
    y = barra("DATOS GENERALES", y);

    y = filaEtiquetaValor(
      [
        { etiqueta: "Nombre del padre:", valor: data.nombre_padre, ancho: ANCHO / 2 },
        { etiqueta: "Nombre de la madre:", valor: data.nombre_madre, ancho: ANCHO / 2 },
      ],
      y
    );
    y = filaEtiquetaValor(
      [{ etiqueta: "Dirección (Jr., calle, avenida, urbanización, caserío):", valor: data.direccion, ancho: ANCHO }],
      y
    );
    y = filaEtiquetaValor(
      [
        { etiqueta: "Localidad:", valor: data.localidad, ancho: ANCHO / 2 },
        { etiqueta: "Distrito:", valor: data.distrito, ancho: ANCHO / 2 },
      ],
      y
    );
    y = filaEtiquetaValor(
      [
        { etiqueta: "Provincia:", valor: data.provincia, ancho: ANCHO / 2 },
        { etiqueta: "Departamento:", valor: data.departamento, ancho: ANCHO / 2 },
      ],
      y
    );

    // Nacionalidad (casilla Peruana / Otra) | Raza | Religión
    y = filaEtiquetaValor(
      [
        { etiqueta: "Nacionalidad:", valor: d.otraNacionalidad, ancho: 80, adorno: adornoNacionalidad() },
        { etiqueta: "Raza:", valor: data.raza, ancho: 55 },
        { etiqueta: "Religión:", valor: data.religion, ancho: 55 },
      ],
      y
    );

    // "Lugares" es texto libre y puede ocupar varias líneas.
    y = filaEtiquetaValor(
      [{ etiqueta: "Lugares en que estuvo en los últimos 6 meses:", valor: data.lugares_6_meses, ancho: ANCHO }],
      y
    );
    y = filaEtiquetaValor(
      [
        { etiqueta: "Grupo sanguíneo:", valor: data.grupo_sang, ancho: ANCHO / 2 },
        { etiqueta: "Factor Rh:", valor: data.factor_rh, ancho: ANCHO / 2 },
      ],
      y
    );

    // ----- Antecedentes personales -----
    y = barra("ANTECEDENTES PERSONALES", y);
    const apX = [X, X + 55, X + 110, X + 145];
    const apW = [55, 55, 35, 45];
    // "Especificar" es texto libre: si ocupa varias líneas el bloque crece y empuja "Sedentarismo".
    const mEspecificar = medirEtiquetaValor(doc, {
      etiqueta: "Especificar:",
      valor: data.especificarDrogasSedentarismo,
      ancho: apW[1],
    });
    const extraAP = mEspecificar.alto - ALTO_FILA;
    const altoAP = 26 + extraAP;
    apX.forEach((cx, i) => celda(cx, y, apW[i], altoAP));
    // Las 4 columnas comparten el mismo ritmo vertical: subtítulo (n = 0) y una línea cada ALTO_FILA.
    const linea = (n) => y + 3.5 + ALTO_FILA * n;

    fuente("bold");
    doc.text("Consumo de sustancias nocivas:", apX[0] + 2, linea(0));
    [
      ["Hoja de coca", data.sustancia_hoja_coca],
      ["Bebidas alcohólicas", data.sustancia_alcohol],
      ["Tabaco", data.sustancia_tabaco],
      ["Café", data.sustancia_cafe],
    ].forEach(([etiqueta, marcada], i) =>
      itemColumna(etiqueta, Boolean(marcada), apX[0], apW[0], y + ALTO_FILA * (i + 1))
    );

    fuente("bold");
    doc.text("Consumo de drogas:", apX[1] + 2, linea(0));
    const xNoDrogas = opcion("Si", data.consumo_drogas === "SI", apX[1] + 2, linea(1));
    opcion("No", data.consumo_drogas === "NO", xNoDrogas, linea(1));
    dibujarEtiquetaValor(doc, mEspecificar, apX[1], y + ALTO_FILA * 2);
    const ySed = linea(3) + extraAP;
    fuente("bold");
    doc.text("Sedentarismo:", apX[1] + 2, ySed);
    const xSed = apX[1] + 2 + doc.getTextWidth("Sedentarismo:") + 1.5;
    const xNoSed = opcion("Si", data.sedentarismo === "SI", xSed, ySed);
    opcion("No", data.sedentarismo === "NO", xNoSed, ySed);

    fuente("bold");
    doc.text("Sexualidad", apX[2] + apW[2] / 2, linea(0), { align: "center" });
    fuente("normal");
    doc.text("Edad de inicio de", apX[2] + apW[2] / 2, linea(1), { align: "center" });
    doc.text("Relaciones sexuales:", apX[2] + apW[2] / 2, linea(2), { align: "center" });
    celda(apX[2] + (apW[2] - 14) / 2, y + 15, 14, 7);
    fuente("bold");
    doc.text(texto(data.inicio_relaciones_sexuales), apX[2] + apW[2] / 2, y + 20.2, { align: "center" });

    fuente("bold");
    doc.text("Datos mujer:", apX[3] + 2, linea(0));
    etiquetaValor("Menarquía:", data.menarquiaAnios, apX[3] + 2, linea(1), apW[3] - 12);
    fuente("normal");
    doc.text("años", apX[3] + apW[3] - 2, linea(1), { align: "right" });
    fuente("bold");
    doc.text("Régimen catamenial:", apX[3] + 2, linea(2));
    const yReg = linea(3);
    fuente("normal");
    textoAjustado(data.regimenCatamenialSangrado, apX[3] + 3, yReg, 11);
    doc.line(apX[3] + 2, yReg + 0.5, apX[3] + 14, yReg + 0.5);
    doc.text("días /", apX[3] + 16, yReg);
    textoAjustado(data.regimenCatamenialCiclo, apX[3] + 28, yReg, 8);
    doc.line(apX[3] + 27, yReg + 0.5, apX[3] + 36, yReg + 0.5);
    doc.text("día", apX[3] + 38, yReg);
    y += altoAP;

    // ----- Antecedentes patológicos -----
    y = barra("ANTECEDENTES PATOLÓGICOS", y);
    celda(X, y, ANCHO, ALTO_FILA * 4);
    const anchoPat = ANCHO / PATOLOGICOS.length;
    PATOLOGICOS.forEach((col, ci) => {
      const cx = X + ci * anchoPat;
      col.forEach(([campo, etiqueta, tipo], i) => {
        const yFila = y + i * ALTO_FILA;
        if (tipo === "linea") {
          const yt = yBase(yFila);
          fuente("normal");
          doc.text(etiqueta, cx + 2, yt);
          const xLinea = cx + 2 + doc.getTextWidth(etiqueta) + 1;
          doc.line(xLinea, yt + 0.4, cx + anchoPat - 2, yt + 0.4);
          textoAjustado(data[campo], xLinea + 1, yt, cx + anchoPat - 2 - xLinea - 1);
        } else {
          itemColumna(etiqueta, Boolean(data[campo]), cx, anchoPat, yFila);
        }
      });
    });
    y += ALTO_FILA * 4;

    y = filaEtiquetaValor(
      [
        { etiqueta: "16. Alergia medicamentos", ancho: ANCHO / 2, adorno: adornoSiNo(data.ap_alergia_medicamentos) },
        { etiqueta: "Especifique:", valor: data.ap_alergia_medicamentos_especificar, ancho: ANCHO / 2 },
      ],
      y
    );

    // ----- Antecedentes patológicos familiares -----
    y = barra("ANTECEDENTES FAMILIARES", y);
    FAMILIARES.forEach((fila) => {
      const ancho = ANCHO / fila.length;
      y = filaEtiquetaValor(
        fila.map(({ etiqueta, campo }) => ({ etiqueta, valor: data[campo], ancho })),
        y
      );
    });

    // ----- Inmunizaciones -----
    y = barra("INMUNIZACIONES", y);
    celda(X, y, 40, ALTO_FILA);
    celda(X + 40, y, 150, ALTO_FILA);
    fuente("bold");
    doc.text("Vacunas", X + 20, yBase(y), { align: "center" });
    doc.text("Dosis / fecha", X + 40 + 75, yBase(y), { align: "center" });
    y += ALTO_FILA;

    VACUNAS.forEach(({ nombre, prefijo, dosis }) => {
      // El texto de la dosis (a la izquierda) se adapta; la fecha va fija a la derecha de la celda.
      const medidas = Array.from({ length: dosis }, (_, i) =>
        medirEtiquetaValor(doc, { valor: data[`${prefijo}_${i + 1}_dosis`], ancho: 50, anchoValor: 26 })
      );
      const altoVacuna = Math.max(ALTO_FILA, ...medidas.map((m) => m.alto));
      celda(X, y, 40, altoVacuna);
      fuente("bold");
      doc.text(nombre, X + 2, yBase(y));
      for (let n = 1; n <= 3; n++) {
        const xCelda = X + 40 + (n - 1) * 50;
        // La vacuna con 1 sola dosis deja el resto de la fila como una celda vacía.
        if (n > dosis) {
          if (n === dosis + 1) celda(xCelda, y, 50 * (3 - dosis), altoVacuna);
          continue;
        }
        celda(xCelda, y, 50, altoVacuna);
        dibujarEtiquetaValor(doc, medidas[n - 1], xCelda, y);
        const fechaDosis = fechaCorta(data[`${prefijo}_${n}_fecha`]);
        if (fechaDosis) {
          fuente("normal");
          doc.text(fechaDosis, xCelda + 48, yBase(y), { align: "right" });
        }
      }
      y += altoVacuna;
    });

    // ----- Vigilancia de enfermedades no transmisibles -----
    y = barra("VIGILANCIA DE ENFERMEDADES NO TRANSMISIBLES", y);
    const anchoVig = ANCHO / 3;
    [
      ["Diabetes", data.vigilancia_diabetes],
      ["Hipertensión arterial", data.vigilancia_hipertension],
      ["Violencia intrafamiliar", data.vigilancia_violencia],
    ].forEach(([etiqueta, marcada], i) => {
      const cx = X + i * anchoVig;
      celda(cx, y, anchoVig, ALTO_FILA);
      fuente("bold");
      doc.text(etiqueta, cx + 2, yBase(y));
      casilla(cx + anchoVig - CASILLA - 2, y + (ALTO_FILA - CASILLA) / 2, Boolean(marcada));
    });
    y += ALTO_FILA;

    return y;
  };

  // ===== Página 2: atención (examen físico, auxiliares, diagnóstico, tratamiento) + firma =====
  
  // const dibujarPagina2 = (yInicio) => {
  //   let y = yInicio;
  //   celda(X, y, ANCHO, ALTO_FILA);
  //   etiquetaValor("PACIENTE:", d.nombreCompleto, X + 2, yBase(y), 130);
  //   etiquetaValor("DNI:", d.dni, X + 135, yBase(y), 53);
  //   y += ALTO_FILA + 3;

  //   [
  //     ["EXAMEN FÍSICO", data.examenFisico],
  //     ["EXÁMENES AUXILIARES", data.examenesAuxiliares],
  //     ["DIAGNÓSTICO", data.diagnostico],
  //     ["TRATAMIENTO", data.tratamiento],
  //   ].forEach(([titulo, contenido]) => {
  //     y =
  //       dibujarCuadroTextoDinamico(doc, {
  //         x: X,
  //         y,
  //         ancho: ANCHO,
  //         titulo,
  //         texto: contenido,
  //         fontSize: 8,
  //         minHeight: 32,
  //         paddingTop: 8,
  //         lineHeight: 4,
  //         maxLineas: 9,
  //       }) + 2;
  //   });

  //   // Sello y firma del médico
  //   const yFirma = 252;
  //   const xCentro = X + ANCHO * 0.75;
  //   doc.setLineWidth(0.2);
  //   doc.line(xCentro - 35, yFirma, xCentro + 35, yFirma);
  //   fuente("bold", 8);
  //   if (texto(data.nombre_medico)) {
  //     textoAjustado(`Dr(a). ${texto(data.nombre_medico)}`, xCentro, yFirma + 4, 80, { align: "center" });
  //   }
  //   fuente("normal", 7);
  //   doc.text("Sello y Firma del Médico", xCentro, yFirma + 8, { align: "center" });
  // };

  // ===== Armado del documento =====
  const yContenido = await dibujarEncabezado(1);
  dibujarPagina1(yContenido);
  footerTR(doc, { footerData: data, footerOffsetY: PIE_OFFSET_Y });

  // if (d.tienePagina2) {
  //   doc.addPage();
  //   dibujarPagina2(await dibujarEncabezado(2));
  //   footerTR(doc, { footerData: data, footerOffsetY: PIE_OFFSET_Y });
  // }

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
