import jsPDF from "jspdf";
import HeaderAsistencial from "../../components/headerAsistencial.jsx";
import TituloSeccionAsistencial from "../../components/tituloSeccionAsistencial.jsx";
import footerTR from "../../components/footerTR.jsx";
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import { getSignCompressed } from "../../../utils/helpers.js";

// Hoja de Referencia (Anexo N° 01): referencia de un paciente a otro establecimiento de salud.
//
// Cabecera y pie: los del módulo asistencial (HeaderAsistencial: N° Ticket, N° Historia Clínica, sede y
// fecha). Cuerpo: el formato de las fichas Anexo 16 (Anexo7C_Boro): tablas con borde a todo el ancho de la
// hoja, letra de 7pt, etiquetas en negrita, casillas con "X" y filas que crecen según el texto.
//
// Datos que recibe (objeto plano):
//   numeroTicket, numeroHistoriaClinica, sede, fecha (fecha de atención, yyyy-MM-dd),
//   Datos generales:   fechaReferencia (por defecto `fecha`), numeroReferencia, establecimientoOrigen,
//                      establecimientoDestino, areaAtencionDestino ("EMG" | "URGENCIA" | "APOYO DIAGNOSTICO"),
//   Usuario:           apellidoPaterno, apellidoMaterno, nombres, direccion, celular, sexo ("M" | "F"),
//                      edad, empresa, numeroCitaSgss, codigoTrabajador,
//   Historia clínica:  resumenClinico, temperatura, presionArterial, frecuenciaCardiaca,
//                      frecuenciaRespiratoria, saturacionOxigeno, fio2, msnm,
//                      examenFisico (arreglo o texto con una línea por renglón),
//                      diagnosticos (arreglo de { descripcion, cie10 } o de textos),
//                      tratamiento (arreglo o texto con una indicación por línea),
//   Datos finales:     motivoReferencia, especialidad, condicion, relacionPertenencias, autoridadTraslado,
//                      personaRecibe, fechaHoraRecepcion, datosResponsableTraslado,
//                      condicionLlegada ("ESTABLE" | "MAL ESTADO" | "FALLECIDO"),
//   digitalizacion[] (SELLOFIRMA: sello del médico que indica el traslado), footerData, codigoColor, textoColor.

const X0 = 5;
const ANCHO = 200;
const ALTO_FILA = 5;
const FUENTE = 7;
const INTERLINEA = 3;
const PRIMERA_LINEA = 3.5; // baseline de la 1ª línea respecto al borde superior de la fila
const PADDING = 2;
const CASILLA = 3;
const LIMITE_Y = 272; // último Y utilizable antes del pie de página
const PIE_OFFSET_Y = 8;
const SELLO_ANCHO = 45;
const SELLO_ALTO = 20;

const texto = (v) => String(v ?? "").trim();
const lineas = (v) => (Array.isArray(v) ? v : texto(v).split(/\r\n|\r|\n|\\n/g)).map(texto).filter(Boolean);
const fechaCorta = (v) => formatearFechaCorta(texto(v)) || texto(v);
const conUnidad = (valor, unidad) => (texto(valor) ? `${texto(valor)} ${unidad}` : "");

const normalizarDiagnosticos = (v) =>
  (Array.isArray(v) ? v : lineas(v))
    .map((item) =>
      typeof item === "object" && item !== null
        ? { descripcion: texto(item.descripcion), cie10: texto(item.cie10) }
        : { descripcion: texto(item), cie10: "" }
    )
    .filter((item) => item.descripcion || item.cie10);

export default async function HojaReferencia(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  const area = texto(data.areaAtencionDestino).toUpperCase();
  const llegada = texto(data.condicionLlegada).toUpperCase();
  const sexo = texto(data.sexo).toUpperCase();
  const saturacion = texto(data.saturacionOxigeno).replace(/%$/, "");

  const d = {
    fecha: fechaCorta(data.fechaReferencia || data.fecha),
    areaEmg: /\bEMG\b|EMERGENCIA/.test(area),
    areaUrgencia: area.includes("URGENCIA"),
    areaApoyo: /APOYO|CONSULTA/.test(area),
    edad: /^\d+$/.test(texto(data.edad)) ? `${texto(data.edad)} AÑOS` : texto(data.edad),
    sexoM: sexo.startsWith("M"),
    sexoF: sexo.startsWith("F"),
    saturacion: [saturacion ? `${saturacion}%` : "", texto(data.fio2) ? `(FiO2 ${texto(data.fio2)})` : ""]
      .filter(Boolean)
      .join(" "),
    resumenClinico: lineas(data.resumenClinico),
    examenFisico: lineas(data.examenFisico),
    diagnosticos: normalizarDiagnosticos(data.diagnosticos),
    tratamiento: lineas(data.tratamiento),
    fechaHoraRecepcion: fechaCorta(data.fechaHoraRecepcion),
    llegadaEstable: llegada === "ESTABLE",
    llegadaMalEstado: llegada.includes("MAL"),
    llegadaFallecido: llegada.includes("FALLEC"),
  };

  const sello = await getSignCompressed(data, "SELLOFIRMA");

  let pagina = 1;
  let y = 0;

  // ===== Páginas =====
  const dibujarEncabezado = async (numeroPagina) => {
    const yContenido = await HeaderAsistencial(
      doc,
      {
        numeroTicket: data.numeroTicket,
        numeroHistoriaClinica: data.numeroHistoriaClinica,
        sede: data.sede,
        fecha: data.fecha,
        codigoColor: data.codigoColor,
        textoColor: data.textoColor,
      },
      { pagina: numeroPagina, titulo: "HOJA DE REFERENCIA" }
    );
    doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(0, 0, 0);
    doc.text("ANEXO N° 01", pageW / 2, 32.5, { align: "center" });
    return yContenido;
  };

  const dibujarPie = () => footerTR(doc, { footerData: data, footerOffsetY: PIE_OFFSET_Y });

  const nuevaPagina = async () => {
    dibujarPie();
    doc.addPage();
    pagina += 1;
    y = (await dibujarEncabezado(pagina)) + 2;
  };

  // Si el bloque que sigue no cabe en la página, pasa a una nueva.
  const asegurarEspacio = async (alto) => {
    if (y + alto > LIMITE_Y) await nuevaPagina();
  };

  const fuente = (estilo = "normal", size = FUENTE) =>
    doc.setFont("helvetica", estilo).setFontSize(size).setTextColor(0, 0, 0);

  // ===== Celdas =====
  // Cada celda es { ancho, alto, dibujar(x, y) }: `alto` es el que necesita su contenido y la fila
  // (ver `fila`) toma el de la más alta, así todas las celdas de una fila quedan del mismo alto.

  // "Etiqueta: valor". Si el valor no cabe a continuación de la etiqueta salta de línea; nunca se recorta.
  const celdaTexto = ({ etiqueta = "", valor = "", ancho, altoMin = ALTO_FILA }) => {
    fuente("bold");
    const anchoEtiqueta = etiqueta ? doc.getTextWidth(etiqueta) + 1.5 : 0;
    const anchoPrimera = ancho - 2 * PADDING - anchoEtiqueta;
    fuente("normal");
    const limpio = texto(valor).replace(/\s+/g, " ");
    const [primera = ""] = limpio && anchoPrimera >= 12 ? doc.splitTextToSize(limpio, anchoPrimera) : [""];
    const resto = limpio.slice(primera.length).trim();
    const partes = limpio ? [primera, ...(resto ? doc.splitTextToSize(resto, ancho - 2 * PADDING) : [])] : [];
    const alto = Math.max(altoMin, PRIMERA_LINEA + Math.max(0, partes.length - 1) * INTERLINEA + 1.5);
    return {
      ancho,
      alto,
      dibujar: (x, yCelda) => {
        if (etiqueta) {
          fuente("bold");
          doc.text(etiqueta, x + PADDING, yCelda + PRIMERA_LINEA);
        }
        fuente("normal");
        partes.forEach((linea, i) => {
          if (linea) doc.text(linea, x + PADDING + (i === 0 ? anchoEtiqueta : 0), yCelda + PRIMERA_LINEA + i * INTERLINEA);
        });
      },
    };
  };

  // Etiqueta en negrita que puede ocupar varias líneas (columna de rótulos de las filas "rótulo | valor").
  const celdaEtiqueta = (etiqueta, ancho, altoMin = ALTO_FILA) => {
    fuente("bold");
    const partes = doc.splitTextToSize(etiqueta, ancho - 2 * PADDING);
    return {
      ancho,
      alto: Math.max(altoMin, PRIMERA_LINEA + (partes.length - 1) * INTERLINEA + 1.5),
      dibujar: (x, yCelda) => {
        fuente("bold");
        partes.forEach((linea, i) => doc.text(linea, x + PADDING, yCelda + PRIMERA_LINEA + i * INTERLINEA));
      },
    };
  };

  // Texto libre en párrafos, con un título opcional en negrita en la primera línea.
  const celdaBloque = ({ ancho, titulo = "", items, altoMin = ALTO_FILA }) => {
    fuente("normal");
    const partes = items.flatMap((item) => doc.splitTextToSize(item, ancho - 2 * PADDING));
    const total = (titulo ? 1 : 0) + partes.length;
    return {
      ancho,
      alto: Math.max(altoMin, PRIMERA_LINEA + Math.max(0, total - 1) * INTERLINEA + 1.5),
      dibujar: (x, yCelda) => {
        if (titulo) {
          fuente("bold");
          doc.text(titulo, x + PADDING, yCelda + PRIMERA_LINEA);
        }
        fuente("normal");
        partes.forEach((linea, i) =>
          doc.text(linea, x + PADDING, yCelda + PRIMERA_LINEA + (i + (titulo ? 1 : 0)) * INTERLINEA)
        );
      },
    };
  };

  const casilla = (x, yCasilla, marcada) => {
    doc.setLineWidth(0.2);
    doc.rect(x, yCasilla, CASILLA, CASILLA);
    if (marcada) {
      fuente("bold");
      doc.text("X", x + CASILLA / 2 - doc.getTextWidth("X") / 2, yCasilla + CASILLA / 2 + 1);
    }
  };

  // Etiqueta opcional y opciones "☐ Texto" en línea.
  const celdaOpciones = ({ ancho, etiqueta = "", opciones, separacion = 8, centrado = false }) => {
    fuente("bold");
    const anchoEtiqueta = etiqueta ? doc.getTextWidth(etiqueta) + 3 : 0;
    fuente("normal");
    const anchos = opciones.map(({ etiqueta: e }) => CASILLA + 1.2 + doc.getTextWidth(e));
    const total = anchoEtiqueta + anchos.reduce((s, a) => s + a, 0) + separacion * (opciones.length - 1);
    const inicio = centrado ? (ancho - total) / 2 : PADDING;
    return {
      ancho,
      alto: ALTO_FILA,
      dibujar: (x, yCelda) => {
        let xActual = x + inicio;
        if (etiqueta) {
          fuente("bold");
          doc.text(etiqueta, xActual, yCelda + PRIMERA_LINEA);
          xActual += anchoEtiqueta;
        }
        opciones.forEach(({ etiqueta: e, marcada }, i) => {
          casilla(xActual, yCelda + (ALTO_FILA - CASILLA) / 2, marcada);
          fuente("normal");
          doc.text(e, xActual + CASILLA + 1.2, yCelda + (ALTO_FILA - CASILLA) / 2 + 2.3);
          xActual += anchos[i] + separacion;
        });
      },
    };
  };

  // Valor de texto con el sello del médico (si lo hay) a la derecha.
  const celdaTextoConSello = ({ ancho, valor }) => {
    const base = celdaTexto({ ancho: ancho - (sello ? SELLO_ANCHO + 4 : 0), valor });
    return {
      ancho,
      alto: Math.max(base.alto, sello ? SELLO_ALTO + 1 : 0),
      dibujar: (x, yCelda) => {
        base.dibujar(x, yCelda);
        if (sello) doc.addImage(sello, "JPEG", x + ancho - SELLO_ANCHO - 2, yCelda + 0.5, SELLO_ANCHO, SELLO_ALTO);
      },
    };
  };

  // "Impresión diagnóstica" (lista numerada) y su columna "CIE 10", que comparten el alto y la posición
  // de cada diagnóstico para que cada código quede a la altura de su diagnóstico.
  const celdasDiagnosticos = (anchoLista, anchoCie, altoMin = 16) => {
    const sangria = 9;
    fuente("normal");
    let linea = 1;
    const items = d.diagnosticos.map((dx, i) => {
      const partes = doc.splitTextToSize(dx.descripcion, anchoLista - 2 * PADDING - sangria);
      const item = { linea, partes, numero: `${i + 1}.`, cie10: dx.cie10 };
      linea += Math.max(partes.length, 1);
      return item;
    });
    const alto = Math.max(altoMin, PRIMERA_LINEA + (linea - 1) * INTERLINEA + 1.5);
    return [
      {
        ancho: anchoLista,
        alto,
        dibujar: (x, yCelda) => {
          fuente("bold");
          doc.text("IMPRESIÓN DIAGNÓSTICA:", x + PADDING, yCelda + PRIMERA_LINEA);
          fuente("normal");
          items.forEach((item) => {
            doc.text(item.numero, x + PADDING + 4, yCelda + PRIMERA_LINEA + item.linea * INTERLINEA);
            item.partes.forEach((texto_, j) =>
              doc.text(texto_, x + PADDING + sangria, yCelda + PRIMERA_LINEA + (item.linea + j) * INTERLINEA)
            );
          });
        },
      },
      {
        ancho: anchoCie,
        alto,
        dibujar: (x, yCelda) => {
          fuente("bold");
          doc.text("CIE 10", x + PADDING, yCelda + PRIMERA_LINEA);
          fuente("normal");
          items.forEach((item) => {
            if (item.cie10) doc.text(item.cie10, x + PADDING, yCelda + PRIMERA_LINEA + item.linea * INTERLINEA);
          });
        },
      },
    ];
  };

  // "Tratamiento:" con las indicaciones en lista a la derecha de la etiqueta.
  const celdaTratamiento = (ancho, altoMin = 16) => {
    const sangria = 30;
    fuente("normal");
    const items = d.tratamiento.map((item) => doc.splitTextToSize(item, ancho - 2 * PADDING - sangria - 3));
    const total = items.reduce((suma, partes) => suma + partes.length, 0);
    return {
      ancho,
      alto: Math.max(altoMin, PRIMERA_LINEA + Math.max(0, total - 1) * INTERLINEA + 1.5),
      dibujar: (x, yCelda) => {
        fuente("bold");
        doc.text("TRATAMIENTO:", x + PADDING, yCelda + PRIMERA_LINEA);
        fuente("normal");
        let linea = 0;
        items.forEach((partes) => {
          partes.forEach((texto_, j) => {
            const yTexto = yCelda + PRIMERA_LINEA + linea * INTERLINEA;
            if (j === 0) doc.text("-", x + PADDING + sangria, yTexto);
            doc.text(texto_, x + PADDING + sangria + 3, yTexto);
            linea += 1;
          });
        });
      },
    };
  };

  const celdaTituloCentrado = (titulo, ancho) => ({
    ancho,
    alto: ALTO_FILA,
    dibujar: (x, yCelda) => {
      fuente("bold");
      doc.text(titulo, x + ancho / 2, yCelda + PRIMERA_LINEA, { align: "center" });
    },
  });

  // ===== Filas y secciones =====
  // Fila de celdas con borde, todas del alto de la más alta.
  const fila = async (celdas, altoMin = ALTO_FILA) => {
    const alto = Math.max(altoMin, ...celdas.map((celda) => celda.alto));
    await asegurarEspacio(alto);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    let x = X0;
    celdas.forEach((celda) => {
      doc.rect(x, y, celda.ancho, alto);
      celda.dibujar?.(x, y);
      x += celda.ancho;
    });
    y += alto;
  };

  // Barra gris de título de sección; no se deja sola al final de una página.
  const seccion = async (titulo) => {
    await asegurarEspacio(3 * ALTO_FILA);
    y = TituloSeccionAsistencial(doc, titulo, { x: X0, y, ancho: ANCHO });
  };

  // ===== Armado del documento =====
  y = (await dibujarEncabezado(1)) + 2;

  // ----- Datos generales -----
  await seccion("DATOS GENERALES");
  await fila([
    celdaTexto({ etiqueta: "FECHA:", valor: d.fecha, ancho: 100 }),
    celdaTexto({ etiqueta: "N° DE REFERENCIA:", valor: data.numeroReferencia, ancho: 100 }),
  ]);
  await fila([celdaTexto({ etiqueta: "ESTABLECIMIENTO DE ORIGEN:", valor: data.establecimientoOrigen, ancho: ANCHO })]);
  await fila([celdaTexto({ etiqueta: "ESTABLECIMIENTO DE DESTINO:", valor: data.establecimientoDestino, ancho: ANCHO })]);
  await fila([
    celdaOpciones({
      ancho: ANCHO,
      etiqueta: "ÁREA DE ATENCIÓN DEL DESTINO:",
      opciones: [
        { etiqueta: "EMG", marcada: d.areaEmg },
        { etiqueta: "URGENCIA", marcada: d.areaUrgencia },
        { etiqueta: "APOYO DIAGNÓSTICO / CONSULTA EXTERNA", marcada: d.areaApoyo },
      ],
    }),
  ]);

  // ----- 1. Identificación del usuario -----
  await seccion("1. IDENTIFICACIÓN DEL USUARIO");
  await fila([
    celdaTexto({ etiqueta: "APELLIDO PATERNO:", valor: data.apellidoPaterno, ancho: 66.7 }),
    celdaTexto({ etiqueta: "APELLIDO MATERNO:", valor: data.apellidoMaterno, ancho: 66.7 }),
    celdaTexto({ etiqueta: "NOMBRES:", valor: data.nombres, ancho: 66.6 }),
  ]);
  await fila([
    celdaTexto({ etiqueta: "DIRECCIÓN DEL PACIENTE:", valor: data.direccion, ancho: 140 }),
    celdaTexto({ etiqueta: "CELULAR:", valor: data.celular, ancho: 60 }),
  ]);
  await fila([
    celdaOpciones({
      ancho: 50,
      etiqueta: "SEXO:",
      opciones: [
        { etiqueta: "M", marcada: d.sexoM },
        { etiqueta: "F", marcada: d.sexoF },
      ],
    }),
    celdaTexto({ etiqueta: "EDAD:", valor: d.edad, ancho: 40 }),
    celdaTexto({ etiqueta: "EMPRESA:", valor: data.empresa, ancho: 110 }),
  ]);
  await fila([
    celdaTexto({ etiqueta: "N° CITA SGSS:", valor: data.numeroCitaSgss, ancho: 66.7 }),
    celdaTexto({ etiqueta: "CÓD. TRABAJADOR:", valor: data.codigoTrabajador, ancho: 66.7 }),
    celdaTexto({ etiqueta: "N° H. CLÍNICA:", valor: data.numeroHistoriaClinica, ancho: 66.6 }),
  ]);

  // ----- 2. Resumen de historia clínica -----
  await seccion("2. RESUMEN DE HISTORIA CLÍNICA");
  await fila([celdaBloque({ ancho: ANCHO, items: d.resumenClinico, altoMin: 10 })]);
  await fila([
    celdaTexto({ etiqueta: "TEMPERATURA:", valor: conUnidad(data.temperatura, "°C"), ancho: 40 }),
    celdaTexto({ etiqueta: "PA:", valor: conUnidad(data.presionArterial, "mmHg"), ancho: 34 }),
    celdaTexto({ etiqueta: "FC:", valor: conUnidad(data.frecuenciaCardiaca, "x min"), ancho: 28 }),
    celdaTexto({ etiqueta: "FR:", valor: conUnidad(data.frecuenciaRespiratoria, "x min"), ancho: 28 }),
    celdaTexto({ etiqueta: "SAT O2:", valor: d.saturacion, ancho: 42 }),
    celdaTexto({ etiqueta: "MSNM:", valor: data.msnm, ancho: 28 }),
  ]);
  await fila([celdaBloque({ ancho: ANCHO, titulo: "EXAMEN FÍSICO", items: d.examenFisico, altoMin: 10 })]);
  await fila(celdasDiagnosticos(160, 40));
  await fila([celdaTratamiento(ANCHO)]);

  // ----- 3. Datos finales -----
  await seccion("3. DATOS FINALES");
  await fila([celdaTexto({ etiqueta: "MOTIVO DE LA REFERENCIA:", valor: data.motivoReferencia, ancho: ANCHO, altoMin: 10 })]);
  await fila([
    celdaTexto({ etiqueta: "ESPECIALIDAD:", valor: data.especialidad, ancho: 110 }),
    celdaTexto({ etiqueta: "CONDICIÓN:", valor: data.condicion, ancho: 90 }),
  ]);
  await fila([
    celdaEtiqueta("RELACIÓN DE PERTENENCIAS DEL PACIENTE:", 70),
    celdaTexto({ valor: data.relacionPertenencias, ancho: 130 }),
  ], 8);
  await fila([
    celdaEtiqueta("PERSONA Y/O AUTORIDAD QUE INDICA EL TRASLADO:", 70),
    celdaTextoConSello({ ancho: 130, valor: data.autoridadTraslado }),
  ], 8);
  await fila([
    celdaEtiqueta("FIRMA, SELLO Y CARGO DE LA PERSONA QUE LO RECIBE:", 70),
    celdaTexto({ valor: data.personaRecibe, ancho: 60 }),
    celdaEtiqueta("FECHA Y HORA:", 30),
    celdaTexto({ valor: d.fechaHoraRecepcion, ancho: 40 }),
  ], 16);
  await fila([
    celdaEtiqueta("DATOS DEL RESPONSABLE DE TRASLADO O REFERENCIA:", 70),
    celdaTexto({ valor: data.datosResponsableTraslado, ancho: 130 }),
  ], 8);

  // Condiciones del paciente a la llegada al establecimiento destino
  await asegurarEspacio(2 * ALTO_FILA);
  await fila([
    celdaTituloCentrado("CONDICIONES DEL PACIENTE A LA LLEGADA AL ESTABLECIMIENTO DESTINO DE LA REFERENCIA", ANCHO),
  ]);
  await fila([
    celdaOpciones({ ancho: 66.7, centrado: true, opciones: [{ etiqueta: "ESTABLE", marcada: d.llegadaEstable }] }),
    celdaOpciones({ ancho: 66.7, centrado: true, opciones: [{ etiqueta: "MAL ESTADO", marcada: d.llegadaMalEstado }] }),
    celdaOpciones({ ancho: 66.6, centrado: true, opciones: [{ etiqueta: "FALLECIDO", marcada: d.llegadaFallecido }] }),
  ]);

  dibujarPie();

  if (docExistente) return doc;
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
