import jsPDF from "jspdf";
import HeaderAsistencial from "../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../components/datosPersonalesAsistencial.jsx";
import TituloSeccionAsistencial, { ALTO_FILA, FUENTE_CUERPO } from "../../components/tituloSeccionAsistencial.jsx";
import FilaEtiquetaValorAsistencial from "../../components/filaEtiquetaValorAsistencial.jsx";
import dibujarCuadroTextoDinamico from "../../components/CuadroTextoDinamico.jsx";
import footerTR from "../../components/footerTR.jsx";
import { formatearFechaLarga } from "../../../utils/formatDateUtils.js";
import { dibujarFirmas } from "../../../utils/dibujarFirmas.js";
import { getSign } from "../../../utils/helpers.js";

// Informe médico de accidentes: declaración del trabajador atendido tras un accidente (diagnóstico,
// tratamiento inicial y circunstancias), con firma y huella del trabajador y sello del médico.
//
// Formato de tablas estándar del módulo asistencial (el mismo del Triaje y el Resumen Asistencial):
// cabecera HeaderAsistencial (N° Ticket, N° Historia Clínica, sede y fecha), barra gris "DATOS PERSONALES"
// con sus filas, y una barra de título por sección con un cuadro debajo cuyo alto se ajusta al texto
// (CuadroTextoDinamico). Los cuadros sin dato quedan en blanco con una altura mínima. Si el contenido no
// entra en la página, el cuadro continúa en la siguiente (con la cabecera y el paciente repetidos).
//
// Datos que recibe (objeto plano):
//   numeroTicket, numeroHistoriaClinica, sede, fecha (fecha de atención, yyyy-MM-dd), codigoColor, textoColor,
//   nombreCompleto ("Apellidos y nombres"; si falta se usan apellidos + nombres), dni, edad, sexo, estadoCivil,
//   fechaNacimiento, lugarNacimiento, ocupacion, nivelEstudios, empresa, area, cargo,
//   medico, cmp,
//   diagnosticos      (arreglo o texto con un diagnóstico por línea),
//   tratamiento       (arreglo o texto con una indicación por línea),
//   circunstancias    (texto libre),
//   lugarFirma, fechaFirma (yyyy-MM-dd, por defecto `fecha`),
//   digitalizacion[]  (FIRMAP, HUELLA, SELLOFIRMA...), footerData.

const X = 15;
const ANCHO = 180;
const FS = FUENTE_CUERPO;
const PIE_OFFSET_Y = 8;
// Y donde empieza la línea del pie (ver footerTR.jsx) menos un respiro: el contenido no debe pasar de aquí.
const Y_LIMITE = 297 - 25 + PIE_OFFSET_Y - 3.6 - 5;
// Y donde empieza el contenido de una página de continuación (cabecera + fila del paciente).
const Y_INICIO_CONTINUACION = 43 + ALTO_FILA;
// Firma y huella del trabajador / sello del médico: imagen de 20 mm + línea y rótulos debajo.
const ALTO_FIRMAS = 32;
const SEPARACION_FIRMAS = 6;
const SELLOS = ["SELLOFIRMA", "SELLOFIRMADOCASIG", "SELLOFIRMADOCASIG-EXTRA"];

// Mismos valores de cuadro de texto que el Triaje y el Resumen Asistencial.
const INTERLINEA = 4;
const PADDING_TOP = 4.5;
const PADDING_BOTTOM = 2;
const PADDING_X = 4;

const TITULO = "INFORME MÉDICO DE ACCIDENTES";

const texto = (v) => String(v ?? "").trim();
const lista = (v) =>
  (Array.isArray(v) ? v : String(v ?? "").split(/\r\n|\r|\n|\\n/g)).map(texto).filter(Boolean);
const fechaLarga = (v) => {
  try {
    return formatearFechaLarga(texto(v));
  } catch {
    return texto(v);
  }
};

export default async function InformeMedicoAccidentes(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  const d = {
    nombreCompleto: texto(data.nombreCompleto) || `${texto(data.apellidos)} ${texto(data.nombres)}`.trim(),
    dni: texto(data.dni),
    medico: texto(data.medico),
    cmp: texto(data.cmp),
    // Diagnóstico y tratamiento van como lista con guion, una indicación por línea.
    diagnosticos: lista(data.diagnosticos).map((item) => `- ${item}`).join("\n"),
    tratamiento: lista(data.tratamiento).map((item) => `- ${item}`).join("\n"),
    circunstancias: lista(data.circunstancias).join("\n"),
    lugarFirma: texto(data.lugarFirma),
    fechaFirma: fechaLarga(data.fechaFirma || data.fecha),
  };

  let pagina = 1;
  let y = 0;

  // ===== Páginas =====
  const dibujarEncabezado = (n) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    return HeaderAsistencial(
      doc,
      {
        numeroTicket: data.numeroTicket,
        numeroHistoriaClinica: data.numeroHistoriaClinica,
        sede: data.sede,
        fecha: data.fecha,
        codigoColor: data.codigoColor,
        textoColor: data.textoColor,
      },
      { pagina: n, titulo: TITULO }
    );
  };

  const dibujarPie = () => footerTR(doc, { footerData: data, footerOffsetY: PIE_OFFSET_Y });

  // Cierra la página actual (pie) y abre otra con la cabecera estándar + una fila con el paciente.
  const nuevaPagina = async () => {
    dibujarPie();
    doc.addPage();
    pagina += 1;
    y = await dibujarEncabezado(pagina);
    y = FilaEtiquetaValorAsistencial(
      doc,
      [
        { etiqueta: "Paciente:", valor: d.nombreCompleto, ancho: ANCHO * 0.7 },
        { etiqueta: "DNI:", valor: d.dni, ancho: ANCHO * 0.3 },
      ],
      { x: X, y }
    );
  };

  // ===== Cuadros =====
  // Líneas del texto tal como las parte el cuadro (mismo ancho y letra), para poder repartirlas entre páginas.
  const envolver = (valor) => {
    doc.setFont("helvetica", "normal").setFontSize(FS);
    const lineas = [];
    texto(valor)
      .split("\n")
      .forEach((parrafo) => {
        if (parrafo.trim() === "") lineas.push("");
        else lineas.push(...doc.splitTextToSize(parrafo, ANCHO - PADDING_X - 2));
      });
    return lineas;
  };

  // Barra de título + cuadro de texto que se amplía con el contenido.
  const seccion = async ({ titulo, valor, minHeight }) => {
    let lineas = envolver(valor);
    const altoCuadro = (n) => Math.max(minHeight, n * INTERLINEA + PADDING_TOP + PADDING_BOTTOM);
    const total = ALTO_FILA + altoCuadro(lineas.length);

    // Un bloque que cabe en una página pero no en lo que queda de esta pasa entero a la siguiente; uno
    // más largo que una página empieza aquí si entran el título y al menos una línea.
    if (total <= Y_LIMITE - Y_INICIO_CONTINUACION) {
      if (y + total > Y_LIMITE) await nuevaPagina();
    } else if (y + ALTO_FILA + altoCuadro(1) > Y_LIMITE) {
      await nuevaPagina();
    }

    for (let primera = true; ; primera = false) {
      y = TituloSeccionAsistencial(doc, primera ? titulo : `${titulo} (continuación)`, { x: X, y, ancho: ANCHO });

      const capacidad = Math.max(1, Math.floor((Y_LIMITE - y - PADDING_TOP - PADDING_BOTTOM) / INTERLINEA));
      const parte = lineas.slice(0, capacidad);
      lineas = lineas.slice(capacidad);

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.2);
      y = dibujarCuadroTextoDinamico(doc, {
        x: X,
        y,
        ancho: ANCHO,
        texto: parte.join("\n"),
        fontSize: FS,
        lineHeight: INTERLINEA,
        paddingTop: PADDING_TOP,
        paddingBottom: PADDING_BOTTOM,
        paddingX: PADDING_X,
        minHeight: Math.min(minHeight, Y_LIMITE - y),
      });

      if (lineas.length === 0) return;
      await nuevaPagina();
    }
  };

  // ===== Encabezado y datos personales (estándar del módulo asistencial) =====
  y = await dibujarEncabezado(1);
  y = DatosPersonalesAsistencial(
    doc,
    {
      nombreCompleto: d.nombreCompleto,
      dni: d.dni,
      edad: data.edad,
      sexo: data.sexo,
      estadoCivil: data.estadoCivil,
      fechaNacimiento: data.fechaNacimiento,
      lugarNacimiento: data.lugarNacimiento,
      ocupacion: data.ocupacion,
      nivelEstudios: data.nivelEstudios,
      empresa: data.empresa,
    },
    { x: X, y, ancho: ANCHO }
  );
  // Lo que la tabla estándar no cubre: área y cargo del trabajador en la empresa.
  y = FilaEtiquetaValorAsistencial(
    doc,
    [
      { etiqueta: "Área:", valor: data.area, ancho: ANCHO / 2, valorX: 15 },
      { etiqueta: "Cargo:", valor: data.cargo, ancho: ANCHO / 2, valorX: 17 },
    ],
    { x: X, y }
  );

  // ===== Atención médica =====
  y = TituloSeccionAsistencial(doc, "Atención médica", { x: X, y, ancho: ANCHO });
  y = FilaEtiquetaValorAsistencial(
    doc,
    [
      { etiqueta: "Atendido(a) por el Dr(a).:", valor: d.medico, ancho: ANCHO * 0.7 },
      { etiqueta: "CMP:", valor: d.cmp, ancho: ANCHO * 0.3 },
    ],
    { x: X, y }
  );

  // ===== Cuerpo del informe =====
  await seccion({ titulo: "Diagnóstico", valor: d.diagnosticos, minHeight: 16 });
  await seccion({ titulo: "Tratamiento inicial", valor: d.tratamiento, minHeight: 22 });
  await seccion({ titulo: "Circunstancias del accidente (declaración del trabajador)", valor: d.circunstancias, minHeight: 30 });

  // ===== Lugar y fecha, firmas =====
  if (y + ALTO_FILA + SEPARACION_FIRMAS + ALTO_FIRMAS > Y_LIMITE) await nuevaPagina();
  y = FilaEtiquetaValorAsistencial(
    doc,
    [{ etiqueta: "Lugar y fecha:", valor: [d.lugarFirma, d.fechaFirma].filter(Boolean).join(", "), ancho: ANCHO, valorX: 28 }],
    { x: X, y }
  );

  // Firma y huella del trabajador / sello del médico
  const yFirmas = await dibujarFirmas({ doc, datos: data, y: y + SEPARACION_FIRMAS + 2, pageW });

  // DNI bajo la firma del trabajador (su columna depende de cuántos sellos se dibujan).
  const tieneFirmaTrabajador = Boolean(getSign(data, "FIRMAP") || getSign(data, "HUELLA"));
  if (tieneFirmaTrabajador && d.dni) {
    const numSellos = SELLOS.filter((nombre) => getSign(data, nombre)).length;
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(0, 0, 0);
    doc.text(`DNI: ${d.dni}`, pageW / (2 * (numSellos + 1)), yFirmas + 1.5, { align: "center" });
  }

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
