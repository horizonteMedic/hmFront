import jsPDF from "jspdf";
import HeaderAsistencial from "../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../components/datosPersonalesAsistencial.jsx";
import TituloSeccionAsistencial, { ALTO_FILA, FUENTE_CUERPO } from "../../components/tituloSeccionAsistencial.jsx";
import FilaEtiquetaValorAsistencial from "../../components/filaEtiquetaValorAsistencial.jsx";
import dibujarCuadroTextoDinamico from "../../components/CuadroTextoDinamico.jsx";
import footerTR from "../../components/footerTR.jsx";

// Resumen Asistencial: hoja "Historia Clínica" (Anamnesis, antecedentes, examen físico con signos
// vitales, exámenes auxiliares, diagnósticos, tratamiento y cita) con la cabecera y los datos
// personales estándar del módulo asistencial.
//
// Recibe el objeto plano que arma `construirDatosResumen` (controller del formulario) + los datos del
// pie (datosFooter). Cada sección es una barra de título (la estándar) con un cuadro debajo cuyo alto
// se ajusta al texto (CuadroTextoDinamico): si una sección crece, las siguientes bajan. Los cuadros sin
// dato quedan en blanco con una altura mínima, para que el médico pueda completarlos a mano. Si el
// contenido no entra en la página, el cuadro continúa en la siguiente (con la cabecera repetida).

const X = 10;
const ANCHO = 190;
const FS = FUENTE_CUERPO;
const PIE_OFFSET_Y = 8;
// Y donde empieza la línea del pie (ver footerTR.jsx) menos un respiro: el contenido no debe pasar de aquí.
const Y_LIMITE = 297 - 25 + PIE_OFFSET_Y - 3.6 - 5;
// Y donde empieza el contenido de una página de continuación (cabecera + fila del paciente).
const Y_INICIO_CONTINUACION = 43 + ALTO_FILA;

// Mismos valores de cuadro de texto que el Triaje asistencial.
const INTERLINEA = 4;
const PADDING_TOP = 4.5;
const PADDING_BOTTOM = 2;
const PADDING_X = 4;

const TITULO = "HISTORIA CLÍNICA";

const texto = (v) => String(v ?? "").trim();

export default async function ResumenAsistencial(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

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
      },
      { pagina: n, titulo: TITULO }
    );
  };

  // Cierra la página actual (pie) y abre otra con la cabecera estándar + una fila con el paciente.
  const nuevaPagina = async () => {
    footerTR(doc, { footerData: data, footerOffsetY: PIE_OFFSET_Y });
    doc.addPage();
    pagina += 1;
    y = await dibujarEncabezado(pagina);
    y = FilaEtiquetaValorAsistencial(
      doc,
      [
        { etiqueta: "Paciente:", valor: data.nombreCompleto, ancho: ANCHO * 0.7 },
        { etiqueta: "DNI:", valor: data.dni, ancho: ANCHO * 0.3 },
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

  // Barra de título + (opcional) filas propias de la sección + cuadro de texto que se amplía con el
  // contenido. `encabezado(y)` dibuja esas filas y devuelve la Y donde terminan; `altoEncabezado` es su alto.
  const seccion = async ({ titulo, valor, minHeight, encabezado = null, altoEncabezado = 0 }) => {
    let lineas = envolver(valor);
    const altoCuadro = (n) => Math.max(minHeight, n * INTERLINEA + PADDING_TOP + PADDING_BOTTOM);
    const total = ALTO_FILA + altoEncabezado + altoCuadro(lineas.length);

    // Un bloque que cabe en una página pero no en lo que queda de esta pasa entero a la siguiente; uno
    // más largo que una página empieza aquí si entran el título y al menos una línea.
    if (total <= Y_LIMITE - Y_INICIO_CONTINUACION) {
      if (y + total > Y_LIMITE) await nuevaPagina();
    } else if (y + ALTO_FILA + altoEncabezado + altoCuadro(1) > Y_LIMITE) {
      await nuevaPagina();
    }

    for (let primera = true; ; primera = false) {
      y = TituloSeccionAsistencial(doc, primera ? titulo : `${titulo} (continuación)`, { x: X, y, ancho: ANCHO });
      if (primera && encabezado) y = encabezado(y);

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

  // Signos vitales de la hoja: "P/A, P, FC, R, Tº, Sat O2" y "Peso, Talla", en filas de 4 celdas iguales.
  const VITALES = [
    [
      ["P/A:", data.presionArterial],
      ["P:", data.pulso],
      ["FC:", data.frecuenciaCardiaca],
      ["R:", data.frecuenciaRespiratoria],
    ],
    [
      ["Tº:", data.temperatura],
      ["Sat O2:", data.saturacionO2],
      ["Peso:", data.peso],
      ["Talla:", data.talla],
    ],
  ];
  const filasVitales = (yInicio) => {
    let yFila = yInicio;
    VITALES.forEach((fila) => {
      yFila = FilaEtiquetaValorAsistencial(
        doc,
        fila.map(([etiqueta, valor]) => ({ etiqueta, valor, ancho: ANCHO / fila.length, valorX: 17 })),
        { x: X, y: yFila }
      );
    });
    return yFila;
  };

  // ===== Encabezado y datos personales (estándar del módulo asistencial) =====
  y = await dibujarEncabezado(1);
  y = DatosPersonalesAsistencial(doc, data, { x: X, y, ancho: ANCHO });
  // Lo que trae la hoja y la tabla estándar no cubre: dirección, hora de ingreso y teléfono.
  y = FilaEtiquetaValorAsistencial(
    doc,
    [{ etiqueta: "Dirección:", valor: data.direccion, ancho: ANCHO, valorX: 22 }],
    { x: X, y }
  );
  y = FilaEtiquetaValorAsistencial(
    doc,
    [
      { etiqueta: "Hora de ingreso:", valor: data.horaIngreso, ancho: ANCHO / 2, valorX: 33 },
      { etiqueta: "Teléfono:", valor: data.celular, ancho: ANCHO / 2, valorX: 22 },
    ],
    { x: X, y }
  );

  // ===== Cuerpo de la hoja =====
  await seccion({ titulo: "Anamnesis", valor: data.anamnesis, minHeight: 24 });
  await seccion({ titulo: "Antecedentes familiares y patológicos", valor: data.antecedentes, minHeight: 14 });
  await seccion({
    titulo: "Examen físico",
    valor: data.examenFisico,
    minHeight: 22,
    encabezado: filasVitales,
    altoEncabezado: ALTO_FILA * VITALES.length,
  });
  await seccion({ titulo: "Exámenes auxiliares", valor: data.examenesAuxiliares, minHeight: 16 });
  await seccion({ titulo: "Diagnósticos", valor: data.diagnostico, minHeight: 16 });
  await seccion({ titulo: "Tratamiento", valor: data.tratamiento, minHeight: 26 });
  await seccion({ titulo: "Cita", valor: data.cita, minHeight: 8 });

  // ===== Pie =====
  footerTR(doc, { footerData: data, footerOffsetY: PIE_OFFSET_Y });

  // Si se recibió un documento existente (folio), solo se dibuja en él y se retorna.
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
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}
