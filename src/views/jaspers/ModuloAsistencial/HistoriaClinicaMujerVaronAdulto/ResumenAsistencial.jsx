import jsPDF from "jspdf";
import HeaderAsistencial from "../../components/headerAsistencial.jsx";
import DatosPersonalesAsistencial from "../../components/datosPersonalesAsistencial.jsx";
import FilaEtiquetaValorAsistencial from "../../components/filaEtiquetaValorAsistencial.jsx";
import { FUENTE_CUERPO } from "../../components/tituloSeccionAsistencial.jsx";
import footerTR from "../../components/footerTR.jsx";

// Resumen Asistencial: réplica de la hoja física "Historia Clínica" (Anamnesis, antecedentes,
// examen físico con signos vitales, exámenes auxiliares, diagnósticos, tratamiento y cita), con la
// cabecera y los datos personales estándar del módulo asistencial.
//
// Recibe el objeto plano que arma `construirDatosResumen` (controller del formulario) + los datos del
// pie (datosFooter). Los campos sin dato quedan como renglones punteados en blanco, igual que la hoja
// en papel (el médico puede completarlos a mano); los que tienen dato se escriben sobre el renglón.

const X = 10;
const ANCHO = 190;
const FS = FUENTE_CUERPO;
const FS_MIN = 7; // letra mínima en renglones fijos antes de que el campo crezca
const FS_MIN_LIBRE = 6.5; // letra mínima en áreas libres antes de recortar
const PIE_OFFSET_Y = 8;
// Y donde empieza la línea del pie (ver footerTR.jsx) menos un respiro: el contenido no debe pasar de aquí.
const Y_LIMITE_CONTENIDO = 297 - 25 + PIE_OFFSET_Y - 3.6 - 5;

const PASO = 5.5; // alto de un renglón punteado
const PASO_TRATAMIENTO = 6.5; // el tratamiento va más holgado, como en la hoja
const BASE = PASO - 1.7; // baseline del texto dentro del renglón (queda sobre la línea punteada)
const GAP = 3; // separación entre secciones
const ALTO_MIN_LIBRE = 12;
const GRIS_PUNTOS = 90;

const texto = (v) => String(v ?? "").trim();

export default async function ResumenAsistencial(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // ===== Primitivas de dibujo =====
  const fuente = (estilo = "normal", size = FS) =>
    doc.setFont("helvetica", estilo).setFontSize(size).setTextColor(0, 0, 0);

  // Línea punteada (los renglones de la hoja).
  const punteada = (x1, x2, y) => {
    doc.setDrawColor(GRIS_PUNTOS);
    doc.setLineWidth(0.25);
    doc.setLineDashPattern([0.3, 0.9], 0);
    doc.line(x1, y, x2, y);
    doc.setLineDashPattern([], 0);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
  };

  // Parte el texto en líneas respetando los saltos de línea del valor. La 1ª línea puede ser más
  // angosta (cuando comparte renglón con la etiqueta). Usa la letra que esté configurada en el doc.
  const envolver = (valor, anchoPrimera, anchoResto) => {
    const lineas = [];
    texto(valor)
      .split(/\r?\n/)
      .map((parrafo) => parrafo.trim())
      .filter(Boolean)
      .forEach((parrafo) => {
        const [primera = ""] = doc.splitTextToSize(parrafo, lineas.length === 0 ? anchoPrimera : anchoResto);
        lineas.push(primera);
        const resto = parrafo.slice(primera.length).trim();
        if (resto) lineas.push(...doc.splitTextToSize(resto, anchoResto));
      });
    return lineas;
  };

  // Achica la letra (de FS a `min`) hasta que el texto entre en `maxLineas`; si ni así entra, deja la
  // letra mínima y devuelve todas las líneas (el llamador decide si crece o recorta).
  const ajustar = (valor, { anchoPrimera, anchoResto, maxLineas, min = FS_MIN }) => {
    let size = FS;
    let lineas;
    for (;;) {
      fuente("normal", size);
      lineas = envolver(valor, anchoPrimera, anchoResto);
      if (lineas.length <= maxLineas || size <= min) return { lineas, size };
      size -= 0.5;
    }
  };

  // Valor corto dentro de un campo de ancho fijo (signos vitales): achica la letra y, en último caso, recorta.
  const textoAjustado = (valor, x, y, anchoMax) => {
    const v = texto(valor);
    if (!v) return;
    let size = FS;
    fuente("normal", size);
    while (size > 6 && doc.getTextWidth(v) > anchoMax) {
      size -= 0.5;
      doc.setFontSize(size);
    }
    doc.text(doc.getTextWidth(v) > anchoMax ? doc.splitTextToSize(v, anchoMax)[0] : v, x, y);
  };

  // ===== Bloques (cada uno: alto + dibujar(y)) =====

  // "Etiqueta: ......" con renglones punteados; crece si el texto necesita más renglones que `minRenglones`.
  const campoRenglones = ({ etiqueta, valor, minRenglones, ancho = ANCHO }) => {
    fuente("bold");
    const anchoEtiqueta = doc.getTextWidth(etiqueta) + 1.5;
    const { lineas, size } = ajustar(valor, {
      anchoPrimera: ancho - anchoEtiqueta - 1,
      anchoResto: ancho - 1,
      maxLineas: minRenglones,
    });
    const n = Math.max(minRenglones, lineas.length);
    return {
      alto: n * PASO,
      dibujar: (y) => {
        for (let i = 0; i < n; i++) punteada(i === 0 ? X + anchoEtiqueta : X, X + ancho, y + (i + 1) * PASO - 0.7);
        fuente("bold");
        doc.text(etiqueta, X, y + BASE);
        fuente("normal", size);
        lineas.forEach((linea, i) => doc.text(linea, (i === 0 ? X + anchoEtiqueta : X) + 0.5, y + i * PASO + BASE));
      },
    };
  };

  // Área en blanco sin renglones (Anamnesis, texto del examen físico): ocupa el espacio que sobre en la
  // página. `necesario` es el alto que pide el texto a letra normal; `dibujar` achica la letra para que
  // quepa en el alto asignado y, si ni así entra, recorta con "…".
  const areaLibre = ({ etiqueta = "", valor }) => {
    fuente("bold");
    const anchoEtiqueta = etiqueta ? doc.getTextWidth(etiqueta) + 1.5 : 0;
    const interlinea = (size) => size * 0.46;
    const anchoPrimera = ANCHO - anchoEtiqueta - 1;
    fuente("normal", FS);
    const necesario = texto(valor) ? envolver(valor, anchoPrimera, ANCHO - 1).length * interlinea(FS) + 2 : 0;
    return {
      necesario: Math.max(ALTO_MIN_LIBRE, necesario),
      dibujar: (y, alto) => {
        if (etiqueta) {
          fuente("bold");
          doc.text(etiqueta, X, y + 3.5);
        }
        if (!texto(valor)) return;
        let size = FS;
        let lineas;
        let capacidad;
        for (;;) {
          fuente("normal", size);
          lineas = envolver(valor, anchoPrimera, ANCHO - 1);
          capacidad = Math.max(1, Math.floor((alto - 1) / interlinea(size)));
          if (lineas.length <= capacidad || size <= FS_MIN_LIBRE) break;
          size -= 0.5;
        }
        if (lineas.length > capacidad) {
          lineas = lineas.slice(0, capacidad);
          lineas[capacidad - 1] = `${lineas[capacidad - 1].replace(/\s+\S*$/, "")} …`;
        }
        lineas.forEach((linea, i) =>
          doc.text(linea, (i === 0 ? X + anchoEtiqueta : X) + 0.5, y + 3.5 + i * interlinea(size))
        );
      },
    };
  };

  // "Etiqueta: ........" corto con el valor escrito sobre los puntos (signos vitales).
  const campoCorto = (etiqueta, valor, x, ancho, y) => {
    fuente("bold");
    const anchoEtiqueta = doc.getTextWidth(etiqueta) + 1.5;
    punteada(x + anchoEtiqueta, x + ancho - 3, y + PASO - 0.7);
    doc.text(etiqueta, x, y + BASE);
    textoAjustado(valor, x + anchoEtiqueta + 1, y + BASE, ancho - anchoEtiqueta - 5);
  };

  // "Examen físico:  P/A  P  FC  R  Tº  Sat O2" y debajo "PESO  TALLA".
  const vitales = {
    alto: PASO * 2,
    dibujar: (y) => {
      fuente("bold");
      doc.text("Examen físico:", X, y + BASE);
      const x0 = X + doc.getTextWidth("Examen físico:") + 3;
      const fila1 = [
        ["P/A:", data.presionArterial, 34],
        ["P:", data.pulso, 22],
        ["FC:", data.frecuenciaCardiaca, 26],
        ["R:", data.frecuenciaRespiratoria, 22],
        ["Tº:", data.temperatura, 26],
        ["Sat O2:", data.saturacionO2, 32],
      ];
      const escala = (X + ANCHO - x0) / fila1.reduce((suma, [, , w]) => suma + w, 0);
      let x = x0;
      fila1.forEach(([etiqueta, valor, w]) => {
        campoCorto(etiqueta, valor, x, w * escala, y);
        x += w * escala;
      });
      campoCorto("PESO:", data.peso, X, 55, y + PASO);
      campoCorto("TALLA:", data.talla, X + 55, 55, y + PASO);
    },
  };

  // "Tratamiento:" y 4 renglones en 2 columnas (se llena la columna izquierda y luego la derecha).
  const tratamiento = (() => {
    const col = ANCHO / 2;
    const anchoCol = col - 5;
    const { lineas, size } = ajustar(data.tratamiento, { anchoPrimera: anchoCol, anchoResto: anchoCol, maxLineas: 8 });
    const filas = Math.max(4, Math.ceil(lineas.length / 2));
    return {
      alto: PASO + filas * PASO_TRATAMIENTO,
      dibujar: (y) => {
        fuente("bold");
        doc.text("Tratamiento:", X, y + BASE);
        const y0 = y + PASO;
        for (let i = 0; i < filas; i++) {
          const yLinea = y0 + (i + 1) * PASO_TRATAMIENTO - 0.9;
          punteada(X, X + col - 4, yLinea);
          punteada(X + col + 1, X + ANCHO, yLinea);
        }
        fuente("normal", size);
        lineas.forEach((linea, i) => {
          const enDerecha = i >= filas;
          const fila = enDerecha ? i - filas : i;
          doc.text(linea, (enDerecha ? X + col + 1 : X) + 0.5, y0 + fila * PASO_TRATAMIENTO + PASO_TRATAMIENTO - 2.2);
        });
      },
    };
  })();

  // ===== Encabezado y datos personales (estándar del módulo asistencial) =====
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  let y = await HeaderAsistencial(
    doc,
    {
      numeroTicket: data.numeroTicket,
      numeroHistoriaClinica: data.numeroHistoriaClinica,
      sede: data.sede,
      fecha: data.fecha,
    },
    { pagina: 1, titulo: "HISTORIA CLÍNICA" }
  );

  y = DatosPersonalesAsistencial(doc, data, { x: X, y, ancho: ANCHO });
  // Lo que trae la hoja y la tabla estándar no cubre: dirección, hora de ingreso y teléfono.
  y = FilaEtiquetaValorAsistencial(doc, [{ etiqueta: "Dirección:", valor: data.direccion, ancho: ANCHO, valorX: 22 }], { x: X, y });
  y = FilaEtiquetaValorAsistencial(
    doc,
    [
      { etiqueta: "Hora de ingreso:", valor: data.horaIngreso, ancho: ANCHO / 2, valorX: 33 },
      { etiqueta: "Teléfono:", valor: data.celular, ancho: ANCHO / 2, valorX: 22 },
    ],
    { x: X, y }
  );
  y += GAP;

  // ===== Cuerpo de la hoja =====
  const antecedentes = campoRenglones({
    etiqueta: "Antecedentes familiares y patológicos:",
    valor: data.antecedentes,
    minRenglones: 2,
  });
  const auxiliares = campoRenglones({ etiqueta: "Exámenes auxiliares:", valor: data.examenesAuxiliares, minRenglones: 3 });
  const diagnosticos = campoRenglones({ etiqueta: "Diagnósticos:", valor: data.diagnostico, minRenglones: 3 });
  const cita = campoRenglones({ etiqueta: "Cita:", valor: data.cita, minRenglones: 1, ancho: ANCHO / 2 });
  const anamnesis = areaLibre({ etiqueta: "Anamnesis:", valor: data.anamnesis });
  const examenFisico = areaLibre({ valor: data.examenFisico });

  // El espacio que queda en la página se reparte entre las dos áreas libres (como en la hoja:
  // Anamnesis ~40% y examen físico ~60%); si el texto de una necesita más, toma lo que le sobre a la otra.
  const fijos = [antecedentes, vitales, auxiliares, diagnosticos, tratamiento, cita].reduce((s, b) => s + b.alto, 0);
  const secciones = 7;
  const libre = Math.max(2 * ALTO_MIN_LIBRE, Y_LIMITE_CONTENIDO - y - fijos - GAP * (secciones - 1));
  let altoAnamnesis = libre * 0.4;
  let altoExamen = libre - altoAnamnesis;
  if (anamnesis.necesario > altoAnamnesis) {
    const toma = Math.min(anamnesis.necesario - altoAnamnesis, Math.max(0, altoExamen - examenFisico.necesario));
    altoAnamnesis += toma;
    altoExamen -= toma;
  } else if (examenFisico.necesario > altoExamen) {
    const toma = Math.min(examenFisico.necesario - altoExamen, Math.max(0, altoAnamnesis - anamnesis.necesario));
    altoExamen += toma;
    altoAnamnesis -= toma;
  }

  anamnesis.dibujar(y, altoAnamnesis);
  y += altoAnamnesis + GAP;

  antecedentes.dibujar(y);
  y += antecedentes.alto + GAP;

  vitales.dibujar(y);
  y += vitales.alto;
  examenFisico.dibujar(y, altoExamen);
  y += altoExamen + GAP;

  auxiliares.dibujar(y);
  y += auxiliares.alto + GAP;

  diagnosticos.dibujar(y);
  y += diagnosticos.alto + GAP;

  tratamiento.dibujar(y);
  y += tratamiento.alto + GAP;

  cita.dibujar(y);

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
