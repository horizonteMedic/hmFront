import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils";
import CabeceraLogo from "../../components/CabeceraLogo.jsx";
import footerTR from "../../components/footerTR.jsx";
import dibujarCuadroTextoDinamico from "../../components/CuadroTextoDinamico.jsx";

// Formato digitalizado de la hoja física "Historia Clínica de la Mujer y el Varón Adulto".
//
// Recibe el objeto plano que arma `construirDatosImpresion` (controller del formulario), con los
// mismos nombres de campo del formulario (n_hcl, nombre_padre, ap_obesidad, vacuna_dt_1_dosis...)
// + los datos del pie (datosFooter). Página 1 = réplica de la hoja; página 2 (solo si hay datos)
// = Examen físico / Exámenes auxiliares / Diagnóstico / Tratamiento + firma del médico.

const X = 10;
const ANCHO = 190;
const ALTO_BARRA = 5;
const ALTO_FILA = 5.5;
const ALTO_ITEM = 5;
const CASILLA = 3.2;
const FS = 7.5; // fuente base
const FS_BLOQUE = 7; // fuente de los bloques densos (Datos Generales)
const PIE_OFFSET_Y = 8;

const texto = (v) => String(v ?? "").trim();
const sinAcentos = (v) => texto(v).normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
const fechaCorta = (v) => formatearFechaCorta(texto(v)) || texto(v);

const normalizarDatos = (data) => {
  const nivel = sinAcentos(data.nivelEstudios);
  const civil = sinAcentos(data.estadoCivil);
  const sexo = sinAcentos(data.sexo);
  const nacionalidad = sinAcentos(data.nacionalidad);

  const gradoInstruccion = /ANALFABET|SIN INSTRUCCION|SIN ESTUDIOS/.test(nivel)
    ? "ANALFABETO"
    : nivel.includes("PRIMARIA")
      ? "PRIMARIA"
      : nivel.includes("SECUNDARIA")
        ? "SECUNDARIA"
        : /SUPERIOR|TECNIC|UNIVERSIT|INSTITUTO|BACHILLER|TITULAD|MAESTR|MAGISTER|DOCTORAD|POSTGRADO/.test(nivel)
          ? "SUPERIOR"
          : "";

  const estadoCivil = /SOLTER/.test(civil)
    ? "SOLTERO"
    : /CONVIV/.test(civil)
      ? "CONVIVIENTE"
      : /CASAD/.test(civil)
        ? "CASADO"
        : civil
          ? "OTRA"
          : "";

  const esPeruana = nacionalidad.startsWith("PERU");

  return {
    numeroHistoriaClinica: texto(data.numeroHistoriaClinica),
    fechaApertura: fechaCorta(data.fecha_apertura_hcl),
    nombreCompleto: `${texto(data.apellidos)} ${texto(data.nombres)}`.trim(),
    fechaNacimiento: fechaCorta(data.fechaNacimiento),
    dni: texto(data.dni),
    ocupacion: texto(data.ocupacion),
    gradoInstruccion,
    estadoCivil,
    estadoCivilOtro: estadoCivil === "OTRA" ? texto(data.estadoCivil) : "",
    sexo: sexo.startsWith("M") ? "M" : sexo.startsWith("F") ? "F" : "",
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
// Filas "ETIQUETA: valor" de alto dinámico (ver filaEtiquetaValor): alto de línea y tope de líneas.
const ALTO_LINEA_TEXTO = 3.6;
const MAX_LINEAS_CELDA = 3;

// Inmunizaciones: prefijo de los campos del formulario y N° de dosis que soporta cada vacuna.
const VACUNAS = [
  { nombre: "DT", prefijo: "vacuna_dt", dosis: 3 },
  { nombre: "HVB", prefijo: "vacuna_hvb", dosis: 3 },
  { nombre: "ANTIAMARILICA", prefijo: "vacuna_antiamarilica", dosis: 1 },
];

export default async function HistoriaClinicaMujerVaronAdulto_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const d = normalizarDatos(data);
  const totalPaginas = d.tienePagina2 ? 2 : 1;

  // ===== Primitivas de dibujo =====
  const fuente = (estilo = "normal", size = FS) => doc.setFont("helvetica", estilo).setFontSize(size);
  const yBase = (yFila, alto = ALTO_FILA) => yFila + alto / 2 + 1.1; // baseline centrado en la fila
  const celda = (x, y, w, h) => doc.rect(x, y, w, h);

  // Texto de una línea: si no cabe en el ancho dado reduce la letra (hasta 5.5) y, en último caso, recorta.
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

  // "ETIQUETA: valor" — etiqueta en negrita y el valor a continuación, dentro de un ancho máximo.
  const etiquetaValor = (etiqueta, valor, x, y, anchoMax, size = FS) => {
    fuente("bold", size);
    doc.text(etiqueta, x, y);
    const ancho = doc.getTextWidth(etiqueta) + 1.5;
    fuente("normal", size);
    textoAjustado(valor, x + ancho, y, anchoMax - ancho);
  };

  // Fila de celdas "ETIQUETA: valor" cuyo alto crece con el texto libre del valor (hasta
  // MAX_LINEAS_CELDA líneas; si no cabe, reduce la letra). La 1ª línea va junto a la etiqueta
  // y las siguientes desde el margen izquierdo de la celda. Devuelve la Y donde termina la fila.
  const filaEtiquetaValor = (celdas, y) => {
    const armadas = celdas.map(({ etiqueta, valor, ancho }) => {
      const limpio = texto(valor).replace(/\s+/g, " ");
      fuente("bold");
      const anchoEtiqueta = doc.getTextWidth(etiqueta) + 1.5;
      const envolver = (size) => {
        fuente("normal", size);
        if (!limpio) return [];
        const [primera = ""] = doc.splitTextToSize(limpio, ancho - 4 - anchoEtiqueta);
        const resto = limpio.slice(primera.length).trim();
        return [primera, ...(resto ? doc.splitTextToSize(resto, ancho - 4) : [])];
      };
      let size = FS;
      let lineas = envolver(size);
      while (lineas.length > MAX_LINEAS_CELDA && size > 5.5) {
        size -= 0.5;
        lineas = envolver(size);
      }
      return { etiqueta, ancho, anchoEtiqueta, size, lineas: lineas.slice(0, MAX_LINEAS_CELDA) };
    });

    const alto = Math.max(
      ALTO_FILA,
      ...armadas.map(({ lineas }) => lineas.length * ALTO_LINEA_TEXTO + (ALTO_FILA - ALTO_LINEA_TEXTO))
    );
    const yPrimera = yBase(y);
    let xCelda = X;
    armadas.forEach(({ etiqueta, ancho, anchoEtiqueta, size, lineas }) => {
      celda(xCelda, y, ancho, alto);
      fuente("bold");
      doc.text(etiqueta, xCelda + 2, yPrimera);
      fuente("normal", size);
      lineas.forEach((linea, i) =>
        doc.text(linea, i === 0 ? xCelda + 2 + anchoEtiqueta : xCelda + 2, yPrimera + i * ALTO_LINEA_TEXTO)
      );
      xCelda += ancho;
    });
    return y + alto;
  };

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
  const opcion = (etiqueta, marcada, x, yTexto, size = FS) => {
    fuente("normal", size);
    doc.text(etiqueta, x, yTexto);
    const xCasilla = x + doc.getTextWidth(etiqueta) + 1.2;
    casilla(xCasilla, yTexto - CASILLA + 0.5, marcada);
    return xCasilla + CASILLA + 3;
  };

  // "Etiqueta ........ ☐" con la casilla pegada al borde derecho de la columna.
  const itemColumna = (etiqueta, marcada, xCol, wCol, yFila, { estilo = "normal", linea = false } = {}) => {
    const yt = yBase(yFila, ALTO_ITEM);
    fuente(estilo);
    doc.text(etiqueta, xCol + 2, yt);
    const xCasilla = xCol + wCol - CASILLA - 2;
    if (linea) {
      doc.setLineWidth(0.2);
      doc.line(xCol + 2 + doc.getTextWidth(etiqueta) + 1, yt + 0.4, xCasilla - 1.5, yt + 0.4);
    }
    casilla(xCasilla, yFila + (ALTO_ITEM - CASILLA) / 2, marcada);
  };

  const barra = (titulo, y) => {
    doc.setFillColor(196, 196, 196);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(X, y, ANCHO, ALTO_BARRA, "FD");
    fuente("bold", 8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(titulo, X + ANCHO / 2, y + 3.6, { align: "center" });
    return y + ALTO_BARRA;
  };

  // ===== Encabezado =====
  const dibujarEncabezado = async (pagina) => {
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    await CabeceraLogo(doc, {});

    fuente("bold", 11);
    doc.text("HISTORIA CLÍNICA DE LA MUJER Y EL VARÓN ADULTO", 140, 16, { align: "center" });

    fuente("normal", 7);
    doc.text(`Pág. ${pagina} de ${totalPaginas}`, X + ANCHO, 8, { align: "right" });

    fuente("bold", 8.5);
    doc.text("N° HCL:", 128, 24);
    doc.line(142, 24.8, X + ANCHO, 24.8);
    fuente("normal", 9);
    doc.text(d.numeroHistoriaClinica, 146, 24);

    fuente("bold", 8);
    doc.text("ESTABLECIMIENTO:", X, 32);
    fuente("normal", 8);
    doc.text("POLICLINICO HORIZONTE MEDIC", X + 33, 32);

    fuente("bold", 8);
    doc.text("FECHA DE APERTURA HCL:", 128, 32);
    doc.line(165, 32.8, X + ANCHO, 32.8);
    fuente("normal", 8);
    doc.text(d.fechaApertura, 168, 32);
  };

  // ===== Página 1: réplica de la hoja =====
  const dibujarPagina1 = (yInicio) => {
    let y = barra("DATOS GENERALES", yInicio);

    celda(X, y, 130, ALTO_FILA);
    celda(X + 130, y, 60, ALTO_FILA);
    etiquetaValor("APELLIDOS Y NOMBRES:", d.nombreCompleto, X + 2, yBase(y), 126);
    etiquetaValor("FECHA NAC.:", d.fechaNacimiento, X + 132, yBase(y), 56);
    y += ALTO_FILA;

    celda(X, y, 95, ALTO_FILA);
    celda(X + 95, y, 95, ALTO_FILA);
    etiquetaValor("NOMBRE DEL PADRE:", data.nombre_padre, X + 2, yBase(y), 91);
    etiquetaValor("NOMBRE DE LA MADRE:", data.nombre_madre, X + 97, yBase(y), 91);
    y += ALTO_FILA;

    celda(X, y, ANCHO, ALTO_FILA);
    etiquetaValor("DIRECCIÓN (Jr., Calle, Avenida, Urbanización, Caserío):", data.direccion, X + 2, yBase(y), 186);
    y += ALTO_FILA;

    // Bloque: grado de instrucción | ocupación | lugar de nacimiento | estado civil y sexo
    const altoBloque = 28;
    const paso = 4.5;
    const colX = [X, X + 58, X + 96, X + 154];
    const colW = [58, 38, 58, 36];
    colX.forEach((cx, i) => celda(cx, y, colW[i], altoBloque));
    const fila = (n) => y + 4 + paso * n; // baseline de la fila n del bloque (0 = título)

    fuente("bold", FS_BLOQUE);
    doc.text("GRADO DE INSTRUCCIÓN:", colX[0] + 2, fila(0));
    [
      ["Analfabeto", "ANALFABETO"],
      ["Primaria", "PRIMARIA"],
      ["Secundaria", "SECUNDARIA"],
      ["Superior", "SUPERIOR"],
    ].forEach(([etiqueta, clave], i) => {
      const yt = fila(i + 1);
      fuente("normal", FS_BLOQUE);
      doc.text(etiqueta, colX[0] + 2, yt);
      casilla(colX[0] + 24, yt - CASILLA + 0.5, d.gradoInstruccion === clave);
      if (clave !== "ANALFABETO") {
        fuente("normal", 5.5);
        doc.text("Último año aprobado", colX[0] + 29, yt);
        doc.line(colX[0] + 47, yt + 0.3, colX[0] + colW[0] - 2, yt + 0.3);
      }
    });

    fuente("bold", FS_BLOQUE);
    doc.text("OCUPACIÓN(ES):", colX[1] + 2, fila(0));
    fuente("normal", FS_BLOQUE);
    doc
      .splitTextToSize(d.ocupacion, colW[1] - 4)
      .slice(0, 5)
      .forEach((linea, i) => doc.text(linea, colX[1] + 2, fila(i + 1)));

    fuente("bold", FS_BLOQUE);
    doc.text("LUGAR DE NACIMIENTO:", colX[2] + 2, fila(0));
    [
      ["Localidad:", data.localidad],
      ["Distrito:", data.distrito],
      ["Provincia:", data.provincia],
      ["Departamento:", data.departamento],
    ].forEach(([etiqueta, valor], i) =>
      etiquetaValor(etiqueta, valor, colX[2] + 2, fila(i + 1), colW[2] - 4, FS_BLOQUE)
    );
    const yNac = fila(5);
    fuente("bold", FS_BLOQUE);
    doc.text("Nacionalidad:", colX[2] + 2, yNac);
    const xPeruana = colX[2] + 2 + doc.getTextWidth("Nacionalidad:") + 1.5;
    const xOtra = opcion("Peruana", d.esPeruana, xPeruana, yNac, FS_BLOQUE);
    fuente("normal", FS_BLOQUE);
    doc.text("Otra:", xOtra, yNac);
    const xOtraValor = xOtra + doc.getTextWidth("Otra:") + 1;
    textoAjustado(d.otraNacionalidad, xOtraValor, yNac, colX[2] + colW[2] - 2 - xOtraValor);

    fuente("bold", FS_BLOQUE);
    doc.text("ESTADO CIVIL:", colX[3] + 2, fila(0));
    const xConviviente = opcion("Soltero", d.estadoCivil === "SOLTERO", colX[3] + 2, fila(1), FS_BLOQUE);
    opcion("Conviviente", d.estadoCivil === "CONVIVIENTE", xConviviente, fila(1), FS_BLOQUE);
    const xOtroCivil = opcion("Casado", d.estadoCivil === "CASADO", colX[3] + 2, fila(2), FS_BLOQUE);
    fuente("normal", FS_BLOQUE);
    doc.text("Otro:", xOtroCivil, fila(2));
    const xOtroCivilValor = xOtroCivil + doc.getTextWidth("Otro:") + 1;
    textoAjustado(d.estadoCivilOtro, xOtroCivilValor, fila(2), colX[3] + colW[3] - 2 - xOtroCivilValor);
    etiquetaValor("Raza:", data.raza, colX[3] + 2, fila(3), colW[3] - 4, FS_BLOQUE);
    etiquetaValor("Religión:", data.religion, colX[3] + 2, fila(4), colW[3] - 4, FS_BLOQUE);
    fuente("bold", FS_BLOQUE);
    doc.text("Sexo:", colX[3] + 2, fila(5));
    const xM = colX[3] + 2 + doc.getTextWidth("Sexo:") + 1.5;
    const xF = opcion("M", d.sexo === "M", xM, fila(5), FS_BLOQUE);
    opcion("F", d.sexo === "F", xF, fila(5), FS_BLOQUE);
    y += altoBloque;

    // Una sola fila (suman ANCHO): "lugares" es texto libre y puede ocupar hasta 3 líneas.
    y = filaEtiquetaValor(
      [
        { etiqueta: "Lugares en que estuvo en los últimos 6 meses:", valor: data.lugares_6_meses, ancho: 80 },
        { etiqueta: "Documento de identidad:", valor: d.dni, ancho: 49 },
        { etiqueta: "GPO. SANG:", valor: data.grupo_sang, ancho: 26 },
        { etiqueta: "FACTOR RH:", valor: data.factor_rh, ancho: 35 },
      ],
      y
    );

    // ----- Antecedentes personales -----
    y = barra("ANTECEDENTES PERSONALES", y);
    const altoAP = 26;
    const apX = [X, X + 55, X + 110, X + 145];
    const apW = [55, 55, 35, 45];
    apX.forEach((cx, i) => celda(cx, y, apW[i], altoAP));

    fuente("bold", FS_BLOQUE);
    doc.text("CONSUMO DE SUSTANCIAS NOCIVAS:", apX[0] + 2, y + 4);
    [
      ["Hoja de coca", data.sustancia_hoja_coca],
      ["Bebidas Alcohólicas", data.sustancia_alcohol],
      ["Tabaco", data.sustancia_tabaco],
      ["Café", data.sustancia_cafe],
    ].forEach(([etiqueta, marcada], i) =>
      itemColumna(etiqueta, Boolean(marcada), apX[0], apW[0], y + 5 + i * 4.5)
    );

    fuente("bold", FS_BLOQUE);
    doc.text("CONSUMO DE DROGAS:", apX[1] + 2, y + 4);
    const xNoDrogas = opcion("Si", data.consumo_drogas === "SI", apX[1] + 2, y + 9);
    opcion("No", data.consumo_drogas === "NO", xNoDrogas, y + 9);
    fuente("bold", FS_BLOQUE);
    doc.text("SEDENTARISMO:", apX[1] + 2, y + 21);
    const xSed = apX[1] + 2 + doc.getTextWidth("SEDENTARISMO:") + 1.5;
    const xNoSed = opcion("Si", data.sedentarismo === "SI", xSed, y + 21);
    opcion("No", data.sedentarismo === "NO", xNoSed, y + 21);
    etiquetaValor("Especificar:", data.especificarDrogasSedentarismo, apX[1] + 2, y + 14.5, apW[1] - 4, FS_BLOQUE);

    fuente("bold", FS_BLOQUE);
    doc.text("SEXUALIDAD", apX[2] + apW[2] / 2, y + 4, { align: "center" });
    fuente("normal", FS_BLOQUE);
    doc.text("Edad de inicio de", apX[2] + apW[2] / 2, y + 8.5, { align: "center" });
    doc.text("Relaciones Sexuales:", apX[2] + apW[2] / 2, y + 12, { align: "center" });
    celda(apX[2] + (apW[2] - 14) / 2, y + 15, 14, 7);
    fuente("bold", 9);
    doc.text(texto(data.inicio_relaciones_sexuales), apX[2] + apW[2] / 2, y + 20, { align: "center" });

    fuente("bold", FS_BLOQUE);
    doc.text("DATOS MUJER:", apX[3] + 2, y + 4);
    etiquetaValor("Menarquía:", data.menarquiaAnios, apX[3] + 2, y + 10, apW[3] - 12, FS_BLOQUE);
    fuente("normal", FS_BLOQUE);
    doc.text("años", apX[3] + apW[3] - 2, y + 10, { align: "right" });
    fuente("bold", FS_BLOQUE);
    doc.text("Régimen Catamenial:", apX[3] + 2, y + 15.5);
    const yReg = y + 21;
    fuente("normal", FS_BLOQUE);
    textoAjustado(data.regimenCatamenialSangrado, apX[3] + 3, yReg, 11);
    doc.line(apX[3] + 2, yReg + 0.5, apX[3] + 14, yReg + 0.5);
    doc.text("días /", apX[3] + 16, yReg);
    textoAjustado(data.regimenCatamenialCiclo, apX[3] + 28, yReg, 8);
    doc.line(apX[3] + 27, yReg + 0.5, apX[3] + 36, yReg + 0.5);
    doc.text("día", apX[3] + 38, yReg);
    y += altoAP;

    // ----- Antecedentes patológicos -----
    y = barra("ANTECEDENTES PATOLÓGICOS", y);
    celda(X, y, ANCHO, ALTO_ITEM * 4);
    const anchoPat = ANCHO / PATOLOGICOS.length;
    PATOLOGICOS.forEach((col, ci) => {
      const cx = X + ci * anchoPat;
      col.forEach(([campo, etiqueta, tipo], i) => {
        const yFila = y + i * ALTO_ITEM;
        if (tipo === "linea") {
          const yt = yBase(yFila, ALTO_ITEM);
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
    y += ALTO_ITEM * 4;

    celda(X, y, 95, ALTO_FILA);
    celda(X + 95, y, 95, ALTO_FILA);
    fuente("bold");
    doc.text("16. ALERGIA MEDICAMENTOS", X + 2, yBase(y));
    const xSiAlergia = X + 2 + doc.getTextWidth("16. ALERGIA MEDICAMENTOS") + 4;
    const xNoAlergia = opcion("SI", data.ap_alergia_medicamentos === "SI", xSiAlergia, yBase(y));
    opcion("NO", data.ap_alergia_medicamentos === "NO", xNoAlergia, yBase(y));
    etiquetaValor("ESPECIFIQUE:", data.ap_alergia_medicamentos_especificar, X + 97, yBase(y), 91);
    y += ALTO_FILA; 

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
    doc.text("VACUNAS", X + 20, yBase(y), { align: "center" });
    doc.text("DOSIS / FECHA", X + 40 + 75, yBase(y), { align: "center" });
    y += ALTO_FILA;

    const altoVacuna = 6.5;
    VACUNAS.forEach(({ nombre, prefijo, dosis }) => {
      celda(X, y, 40, altoVacuna);
      fuente("bold");
      doc.text(nombre, X + 2, yBase(y, altoVacuna));
      for (let n = 1; n <= 3; n++) {
        const xCelda = X + 40 + (n - 1) * 50;
        // La vacuna con 1 sola dosis deja el resto de la fila como una celda vacía.
        if (n > dosis) {
          if (n === dosis + 1) celda(xCelda, y, 50 * (3 - dosis), altoVacuna);
          continue;
        }
        celda(xCelda, y, 50, altoVacuna);
        fuente("normal");
        textoAjustado(data[`${prefijo}_${n}_dosis`], xCelda + 2, yBase(y, altoVacuna), 22);
        const fechaDosis = fechaCorta(data[`${prefijo}_${n}_fecha`]);
        if (fechaDosis) doc.text(fechaDosis, xCelda + 48, yBase(y, altoVacuna), { align: "right" });
      }
      y += altoVacuna;
    });

    // ----- Vigilancia de enfermedades no transmisibles -----
    y = barra("VIGILANCIA DE ENFERMEDADES NO TRANSMISIBLES", y);
    const anchoVig = ANCHO / 3;
    [
      ["DIABETES", data.vigilancia_diabetes],
      ["HIPERTENSIÓN ARTERIAL", data.vigilancia_hipertension],
      ["VIOLENCIA INTRAFAMILIAR", data.vigilancia_violencia],
    ].forEach(([etiqueta, marcada], i) => {
      const cx = X + i * anchoVig;
      celda(cx, y, anchoVig, altoVacuna);
      const yt = yBase(y, altoVacuna);
      fuente("bold");
      doc.text(etiqueta, cx + 2, yt);
      casilla(cx + anchoVig - CASILLA - 2, y + (altoVacuna - CASILLA) / 2, Boolean(marcada));
    });
    y += altoVacuna;

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
  await dibujarEncabezado(1);
  dibujarPagina1(35);
  footerTR(doc, { footerData: data, footerOffsetY: PIE_OFFSET_Y });

  // if (d.tienePagina2) {
  //   doc.addPage();
  //   await dibujarEncabezado(2);
  //   dibujarPagina2(37);
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
