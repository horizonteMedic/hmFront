import { URLAzure } from "../config/config";
import { getFetch } from "./apiHelpers";
import { getToday } from "./helpers";

/**
 * Declaración Jurada de Salud (formato MARSA, ítems 1–51 con respuesta NO/SÍ).
 *
 * Módulo compartido por la pestaña "Declaración Jurada" de Antecedentes Patológicos, por el reporte
 * (jaspers/DeclaracionJuradaSalud) y por quienes imprimen el reporte de antecedentes (botón Imprimir, Folio):
 * catálogo de preguntas, conversión formulario <-> backend, carga/guardado y detección de la empresa MARSA.
 */

// ===== Backend =====
// nameService de la declaración (el mismo que se le pasa a obtenerReporte).
export const TABLA_DECLARACION_JURADA_SALUD = "declaracion_jurada_salud";
const declaracionJuradaUrl = "/api/v01/ct/ocupacional/declaracion-jurada-salud";
const obtenerReporteUrl = `${declaracionJuradaUrl}/obtenerReporte`;

// ===== Preguntas =====
// [campo del backend, texto del formato] en el orden de los ítems 1–51; el número de ítem es la posición.
// OJO ítem 24: en el formato el texto aparece cortado ("…o trastornos de"); completarlo cuando se tenga el texto íntegro.
const CUADROS_CLINICOS = [
  // ===== 1–26 (columna izquierda del formato) =====
  ["anemiaSevera", "Anemia Severa"],
  ["cirugiaMayorReciente", "Cirugía mayor reciente (últimos seis meses)."],
  ["cancer", "Cáncer"],
  ["esofagitisGastritisColelitiasis", "Esofagitis, gastritis, colelitiasis, enfermedades parasitarias o inflamatorias"],
  ["ulceraPepticaGastricaDuodenal", "Ulcera péptica gástrica o duodenal."],
  ["herniasNoTratadasEventracion", "Hernias no tratadas quirúrgicamente y eventración."],
  ["abscesosHemorroidesFistulas", "Abscesos, hemorroides, fistulas, o fisuras complicadas que causan dolor persistente y sangrado en la región anal."],
  ["hepatitisViralBC", "Hepatitis Viral B o C."],
  ["enfermedadIsquemicaCardiaca", "Enfermedad isquémica cardiaca, insuficiencia miocárdica en los últimos tres meses."],
  ["historiaInfartoMiocardio", "Historia de infarto miocardio, menor de 1 año,"],
  ["historiaBypassAngioplastia", "Historia de cirugía de bypass coronario y angioplastia, menor de 6 meses"],
  ["trasplanteCorazon", "Trasplante de corazón."],
  ["arritmiaCardiacaSintomatica", "Arritmia cardiaca sintomática, o asociada a anormalidades hemodinámicas."],
  ["usoMarcapasos", "Uso de Marcapasos."],
  ["historiaTromboflebitis", "Historia reciente (seis meses) de tromboflebitis o flebotrombosis."],
  ["venasVaricosasComplicadas", "Venas varicosas asociadas a eczema varicoso, ulceras u otras complicaciones."],
  ["historiaAccidenteCerebroVascular", "Historia de accidente cerebro vascular, ataque isquémico transitorio, evidencia de arteriosclerosis general cerebral, demencia cerebral."],
  ["leucemiaEnfermedadesReticuloendotelial", "Leucemia, enfermedades del sistema reticuloendotelial."],
  ["policitemia", "Policitemia."],
  ["enfermedadesHemorragicasCoagulopatias", "Enfermedades hemorrágicas (coagulopatías)."],
  ["esplenectomia", "Esplenectomía."],
  ["enfermedadesPersonalidadPsicosis", "Enfermedades de la personalidad, caracterizadas por comportamiento antisocial. Psicosis. Fobias. Estados de ansiedad crónica y depresión recurrente."],
  ["abusoAlcoholDrogas", "Abuso de alcohol. Uso de drogas (marihuana, cocaína)."],
  ["historiaMedicaEpilepsia", "Historia médica comprobada de Epilepsia de cualquier tipo, o trastornos de"],
  ["deformidadesMusculoEsqueleticas", "Deformidades (congénitas o adquiridas) o amputaciones del aparato músculo esquelético significativas que interfieran con capacidad para desarrollar las tareas regulares y los procedimientos de evacuación."],
  ["enfermedadPielAgravadaTrabajo", "Cualquier enfermedad de la piel que pueda ser agravada por las condiciones del ambiente de trabajo al que está expuesto."],
  // ===== 27–51 (columna derecha del formato) =====
  ["enfermedadTiroidesNoControlada", "Enfermedad de la tiroides no controladas ni evaluadas por el especialista."],
  ["diabetesMellitusNoInsulinodependiente", "Diabetes mellitus no insulinodependiente no controlada, y no evaluada por el especialista."],
  ["diabetesInsulinodependiente", "Diabetes insulinodependiente."],
  ["gotaNoControlada", "Gota no controlada y no evaluada por el especialista."],
  ["calculosRenalesUreteralesVesicales", "Presencia de cálculos renales, ureterales, o vesicales no tratados adecuadamente con cirugía o litotricia."],
  ["colicosRenalesRecurrentes", "Cólicos renales recurrentes sin demostración de cálculos no evaluados por el especialista."],
  ["infeccionesUrinariasRecurrentes", "Infecciones urinarias recurrentes no evaluadas y tratadas por el especialista."],
  ["trasplanteRenal", "Trasplante renal."],
  ["prostatitisHipertrofiaProstatica", "Prostatitis, hipertrofia prostática, estrechez uretral."],
  ["menorragiaDismenorreaIncapacitante", "Menorragia, dismenorrea incapacitante, enfermedad inflamatoria pélvica, prolapso."],
  ["hidrocelesCondicionTesticular", "Hidroceles u otra condición dolorosa testicular no evaluada por el especialista."],
  ["etsNoTratadasPortadorHiv", "Enfermedades de transmisión sexual no tratadas. Portador de HIV no manejado por el especialista."],
  ["embarazo", "Embarazo."],
  ["bronquitisCronicaEnfisema", "Bronquitis crónica, enfisema, bronquiectasias."],
  ["tuberculosisPulmonarSinTratamiento", "Tuberculosis pulmonar sin tratamiento completo y sin certificación del especialista de que el paciente es no infeccioso."],
  ["malDeMontana", "Mal de Montaña."],
  ["neumoconiosis", "Neumoconiosis."],
  ["historiaAsmaMedicationFrecuente", "Historia de asma que requiera medicación frecuente o recurrente, incluyendo esteroides orales sin evaluación del especialista."],
  ["otitisExternaActiva", "Otitis externa activa, aguda o crónica, sin tratamiento por el especialista."],
  ["enfermedadesMembranaTimpanica", "Enfermedades de la membrana timpánica, o enfermedades crónicas del oído medio sin tratamiento satisfactorio y sin evaluación del especialista."],
  ["enfermedadOidoInterno", "Enfermedad del oído interno no tratado con alteraciones severas de la motilidad, vértigo."],
  ["sinusitisCronicaInfecciosa", "Sinusitis crónica infecciosa o sinusitis recurrente."],
  ["enfermedadVisionDefectoVisual", "Enfermedad de la visión o defecto visual que disminuya las capacidades necesarias para realizar el trabajo en forma segura (glaucoma, cataratas, retinopatías)."],
  ["discromatopsiaVisionMonocular", "Discromatopsia o visión monocular."],
  ["enTratamientoConAnticoagulantes", "En tratamiento con: anticoagulantes, agentes citotóxicos, insulina, anticonvulsivantes, inmunosupresores y esteroides orales, psicotrópicos, (tranquilizantes, antidepresivos, narcóticos, hipnóticos)."],
];

// Cantidad de ítems de la columna izquierda del formato (la derecha lleva el resto).
const ITEMS_COLUMNA_IZQUIERDA = 26;

// Cada pregunta: `name` = campo booleano del formulario (declaracionJurada01 … 51), `campoBackend` = campo del DTO,
// `label` = "N. texto" para <RadioTable>. Es el único lugar donde se relacionan ambos nombres.
export const PREGUNTAS_DECLARACION_JURADA = CUADROS_CLINICOS.map(([campoBackend, texto], i) => ({
  numero: i + 1,
  name: `declaracionJurada${String(i + 1).padStart(2, "0")}`,
  campoBackend,
  texto,
  label: `${i + 1}. ${texto}`,
}));

// Las dos tablas del formato: ítems 1–26 y 27–51.
export const DECLARACION_JURADA_COLUMNAS = [
  PREGUNTAS_DECLARACION_JURADA.slice(0, ITEMS_COLUMNA_IZQUIERDA),
  PREGUNTAS_DECLARACION_JURADA.slice(ITEMS_COLUMNA_IZQUIERDA),
];

// Columnas de respuesta, en el orden del formato (NO | SÍ).
export const OPCIONES_NO_SI = [
  { value: false, label: "NO" },
  { value: true, label: "SI" },
];

// Texto libre con el detalle de las respuestas afirmativas (`detalleAfirmativo` en el backend).
export const CAMPO_DETALLE_DECLARACION_JURADA = "declaracionJuradaDetalle";

// Campos que el usuario edita en la pestaña (resaltado/revertir de cambios del registro editable).
export const CAMPOS_DECLARACION_JURADA = [
  ...PREGUNTAS_DECLARACION_JURADA.map(({ name }) => name),
  CAMPO_DETALLE_DECLARACION_JURADA,
];

// Estado inicial de la pestaña para esparcir en el estado del formulario: todo NO, sin detalle y sin registro.
// Los `declaracionJurada*` finales no se editan: recuerdan el registro cargado para reenviar su auditoría al actualizar.
export const DECLARACION_JURADA_INICIAL = {
  ...Object.fromEntries(PREGUNTAS_DECLARACION_JURADA.map(({ name }) => [name, false])),
  [CAMPO_DETALLE_DECLARACION_JURADA]: "",
  declaracionJuradaExiste: false,
  declaracionJuradaUserRegistro: "",
  declaracionJuradaFechaRegistro: "",
};

// ===== Empresa MARSA =====
// Igual que los demás reportes (esMARSA): la empresa es "MINERA AURIFERA RETAMAS S.A." (o "MARSA" a secas).
const EMPRESAS_MARSA = ["MINERA AURIFERA RETAMAS S.A.", "MARSA"];
const normalizarEmpresa = (empresa) =>
  String(empresa ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

export const esEmpresaMarsa = (empresa) => EMPRESAS_MARSA.includes(normalizarEmpresa(empresa));

// ===== Cargar =====
// ¿El backend devolvió una declaración realmente registrada? (si no existe, el reporte puede venir vacío o con
// solo los datos del trabajador). Siempre se guarda con `userRegistro` (y el backend pone `fechaRegistro`).
export const existeDeclaracionJurada = (declaracion) =>
  Boolean(declaracion && (declaracion.userRegistro || declaracion.fechaRegistro));

// Trae la declaración de un N° de orden. `esJasper` pide los datos del reporte (con firma y huella).
// Devuelve el DTO (la respuesta viene envuelta en `resultado`) o null si no existe o el servicio no responde:
// la declaración nunca debe impedir abrir ni guardar los antecedentes.
export const obtenerDeclaracionJuradaSalud = async (nOrden, token, { esJasper = false, signal } = {}) => {
  try {
    const res = await getFetch(
      `${obtenerReporteUrl}?nOrden=${nOrden}&nameService=${TABLA_DECLARACION_JURADA_SALUD}&esJasper=${esJasper}`,
      token,
      signal
    );
    if (!res || res.error) return null;
    const declaracion = res.resultado !== undefined ? res.resultado : res;
    return declaracion && typeof declaracion === "object" ? declaracion : null;
  } catch (error) {
    if (error?.name !== "AbortError") console.error("No se pudo cargar la Declaración Jurada de Salud:", error);
    return null;
  }
};

// Campos del formulario a partir de la declaración del backend (null = sin registro: todo NO).
export const declaracionJuradaAForm = (declaracion) => ({
  ...Object.fromEntries(
    PREGUNTAS_DECLARACION_JURADA.map(({ name, campoBackend }) => [name, Boolean(declaracion?.[campoBackend])])
  ),
  [CAMPO_DETALLE_DECLARACION_JURADA]: declaracion?.detalleAfirmativo ?? "",
  declaracionJuradaExiste: existeDeclaracionJurada(declaracion),
  declaracionJuradaUserRegistro: declaracion?.userRegistro ?? "",
  declaracionJuradaFechaRegistro: declaracion?.fechaRegistro ?? "",
});

// ===== Guardar =====
// La Declaración Jurada de Salud es el formato de MARSA: solo se llena (la pestaña bloquea los cuadros) y solo se
// guarda cuando la empresa del N° de orden es MARSA. Las demás empresas nunca generan registros ni llaman al servicio.
export const debeGuardarDeclaracionJurada = (form) => esEmpresaMarsa(form?.empresa);

// Body del POST (`DeclaracionJuradaSaludDTO`): N° de orden, fecha de la declaración (la del examen), las 51 respuestas,
// el detalle y el usuario. El resto del DTO (datos del trabajador, fechas de registro/actualización) lo pone el
// backend, por eso NO se envían fechas generadas en el navegador (el body anterior las sellaba con `sellarAuditoria`
// y el backend respondió 400 MALFORMED_REQUEST). Al actualizar se reenvía el creador original (si falta, el backend lo
// deja en null) y el editor va en `usuarioActualizacion`.
const construirBodyDeclaracionJurada = (form, user) => ({
  nOrden: Number(form.norden),
  fechaDeclaracion: form.fechaExam || getToday(),
  ...Object.fromEntries(
    PREGUNTAS_DECLARACION_JURADA.map(({ name, campoBackend }) => [campoBackend, Boolean(form[name])])
  ),
  detalleAfirmativo: String(form[CAMPO_DETALLE_DECLARACION_JURADA] ?? "").trim(),
  ...(form.declaracionJuradaExiste
    ? { userRegistro: form.declaracionJuradaUserRegistro || null, usuarioActualizacion: user }
    : { userRegistro: user }),
});

// Mensaje que devuelve el backend ante un error: { resultado: { mensaje, detalle } } (o { message }). "" si no hay.
const leerMensajeError = async (res) => {
  try {
    const cuerpo = await res.json();
    const detalle = cuerpo?.resultado ?? cuerpo;
    return [detalle?.mensaje, detalle?.detalle].filter(Boolean).join(". ") || cuerpo?.message || "";
  } catch {
    return "";
  }
};

// Registra o actualiza la declaración (el mismo POST: el backend la identifica por el N° de orden).
// Devuelve { ok, status, mensaje }; no lanza.
export const guardarDeclaracionJuradaSalud = async ({ form, token, user }) => {
  try {
    const res = await fetch(`${URLAzure}${declaracionJuradaUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(construirBodyDeclaracionJurada(form, user)),
    });
    if (res.ok) return { ok: true, status: res.status, mensaje: "" };
    return { ok: false, status: res.status, mensaje: await leerMensajeError(res) };
  } catch (error) {
    console.error("No se pudo guardar la Declaración Jurada de Salud:", error);
    return { ok: false, status: 0, mensaje: "" };
  }
};

// ===== Reporte =====
// Datos extra del reporte de Antecedentes Patológicos: la Declaración Jurada, solo cuando la empresa es MARSA y la
// declaración existe. Lo usan el botón Imprimir y Folio; el jasper agrega la página si recibe `declaracionJuradaSalud`.
export const datosDeclaracionJuradaParaReporte = async (reporte, nOrden, token, signal) => {
  if (!esEmpresaMarsa(reporte?.empresa_razon_empresa)) return {};
  const declaracion = await obtenerDeclaracionJuradaSalud(nOrden, token, { esJasper: true, signal });
  return existeDeclaracionJurada(declaracion) ? { declaracionJuradaSalud: declaracion } : {};
};

// Datos de cabecera (sede y color) que el endpoint de la declaración no trae, para imprimirla como hoja suelta en
// Folio: salen del reporte de Antecedentes Patológicos. Si no responde, la hoja se imprime sin ellos.
export const datosCabeceraDeclaracionJurada = async (nOrden, token, signal) => {
  try {
    const reporte = await getFetch(
      `/api/v01/ct/antecedentesPatologicos/obtenerReporteAntecedentesPatologicos?nOrden=${nOrden}&nameService=antecedentes_patologicos&esJasper=true`,
      token,
      signal
    );
    return Object.fromEntries(
      ["sede", "codigoColor", "textoColor"].filter((campo) => reporte?.[campo]).map((campo) => [campo, reporte[campo]])
    );
  } catch (error) {
    if (error?.name !== "AbortError") console.error("No se pudo cargar la cabecera de la Declaración Jurada:", error);
    return {};
  }
};
