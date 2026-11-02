import { faCannabis, faCube, faLayerGroup, faSquare, faThLarge, faTint } from "@fortawesome/free-solid-svg-icons";

// Campos del DTO (POST /asistencial/laboratorio/consentimiento) de cada antecedente. El reporte (GET
// obtenerReporte) los devuelve con el mismo nombre salvo `valorReporte`.
export const ANTECEDENTES = {
  MARIHUANA: { valor: "antConsumeMarih", fecha: "fechaConsumeMarih" },
  COCAINA: { valor: "antConsumeCocacina", fecha: "fechaConsumeCocacina" },
  COCA: { valor: "antConsumeHojaCoca", fecha: "fechaConsumoHojaCoca" },
  ANFETAMINAS: { valor: "antConsumeAnfetamina", valorReporte: "antConsumeAnfetaminaOExtasis", fecha: "fechaConsumeAnfetamina" },
  METAN: { valor: "antConsumeMethanfetaminaOOpiaceos", fecha: "fechaConsumeMethanfetamina" },
  BENZO: { valor: "antConsumeBenzodiacepinas", fecha: "fechaConsumeBenzodiacepinas" },
  OPIA: { valor: "antConsumeOpiacesos", fecha: "fechaConsumeOpiacesos" },
  BARBI: { valor: "antConsumeBarbituricos", fecha: "fechaConsumeBarbituricos" },
  METADONA: { valor: "antConsumeMetadona", fecha: "fechaConsumeMetadona" },
  FENCI: { valor: "antConsumeFenciclidina", fecha: "fechaConsumeFenciclidina" },
  ANTI: { valor: "antConsumeAntidepreTricicli", fecha: "fechaConsumeAntidepreTricicli" },
};

// Cuerpo del consentimiento. `{nombre}` `{edad}` `{dni}` `{empresa}` se reemplazan por los datos del paciente
// (en negrita) y `**texto**` queda en negrita.
const textoPrueba = (sustancias) =>
  `Yo {nombre}, de {edad} años de edad, identificado con DNI Nº {dni}; habiendo recibido consejería e información acerca de la prueba para ${sustancias} en orina; y en pleno uso de mis facultades mentales **AUTORIZO** se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post – Test y mis resultados.`;

const TITULO_PRUEBA = "CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA";
const TITULO_DROGAS = "CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DROGAS";

const MARIHUANA = { key: "MARIHUANA", label: "CONSUME MARIHUANA" };
const COCAINA = { key: "COCAINA", label: "CONSUME COCAÍNA" };
const COCA_7_DIAS = { key: "COCA", label: "CONSUMIÓ HOJA DE COCA EN LOS 7 DÍAS PREVIOS" };
const COCA_14_DIAS = { key: "COCA", label: "CONSUMIÓ HOJA DE COCA EN LOS 14 DÍAS PREVIOS" };

/**
 * Consentimientos de Laboratorio asistencial. Todos usan el mismo endpoint y solo cambian el `nameConset`, el
 * texto y los antecedentes, así que una pantalla (ConsentimientoLaboratorio) y un reporte sirven a todos.
 *   permission  vista que habilita la pestaña (las de SistemaOcupacional/Laboratorio/Consentimientos más " Asistencial")
 *   titulo      líneas del título (se imprimen centradas y subrayadas)
 *   texto       cuerpo con marcadores (ver textoPrueba)
 *   nota        frase que antecede a los antecedentes (opcional)
 *   antecedentes  { key (ver ANTECEDENTES), label }
 */
export const CONSENTIMIENTOS = [
  {
    id: "muestraSangre",
    permission: "Consentimiento Muestra Sangre Asistencial",
    label: "Muestra Sangre",
    icon: faTint,
    nameConset: "consent_Muestra_Sangre",
    titulo: ["CONSENTIMIENTO INFORMADO PARA LA", "TOMA DE MUESTRA DE SANGRE"],
    texto:
      "Yo {nombre}, de {edad} años de edad, identificado con DNI Nº {dni}; habiendo recibido consejería e información acerca de los exámenes en sangre que se me va a realizar según solicitud del protocolo médico de la empresa {empresa}; y en pleno uso de mis facultades mentales **AUTORIZO** se me tome la muestra de sangre para cumplir con los exámenes pertinentes.",
    antecedentes: [],
  },
  {
    id: "panel2D",
    permission: "Consentimiento Panel 2D Asistencial",
    label: "Panel 2D",
    icon: faSquare,
    nameConset: "con_panel2D",
    titulo: [TITULO_PRUEBA, "DE DOSAJE DE MARIHUANA Y COCAÍNA"],
    texto: textoPrueba("Marihuana y cocaína"),
    antecedentes: [MARIHUANA, COCA_7_DIAS, COCAINA],
  },
  {
    id: "panel3D",
    permission: "Consentimiento Panel 3D Asistencial",
    label: "Panel 3D",
    icon: faCube,
    nameConset: "con_panel3D",
    titulo: [`${TITULO_PRUEBA} DE DOSAJE`, "DE MARIHUANA, COCAÍNA Y ÉXTASIS"],
    texto: textoPrueba("Marihuana, cocaína y éxtasis"),
    antecedentes: [MARIHUANA, COCA_7_DIAS, COCAINA, { key: "ANFETAMINAS", label: "CONSUME ÉXTASIS" }],
  },
  {
    id: "panel4D",
    permission: "Consentimiento Panel 4D Asistencial",
    label: "Panel 4D",
    icon: faThLarge,
    nameConset: "con_panel4D",
    titulo: [`${TITULO_PRUEBA} DE DOSAJE DE`, "COCAÍNA, MARIHUANA, OPIÁCEOS Y METHANFETAMINAS"],
    texto: textoPrueba("cocaína, marihuana, opiáceos y methanfetaminas"),
    antecedentes: [
      MARIHUANA,
      COCA_7_DIAS,
      COCAINA,
      { key: "OPIA", label: "CONSUME OPIÁCEOS" },
      { key: "METAN", label: "CONSUME METHANFETAMINAS" },
    ],
  },
  {
    id: "panel5D",
    permission: "Consentimiento Panel 5D Asistencial",
    label: "Panel 5D",
    icon: faLayerGroup,
    nameConset: "con_panel5D",
    titulo: [`${TITULO_DROGAS} PANEL 5D`, "(COCAÍNA, MARIHUANA, ANFETAMINA, METHANFETAMINA Y BENZODIAZEPINA)"],
    texto: textoPrueba("el panel de 5 drogas"),
    nota: "Además, declaro que la información que brindaré a continuación es verdadera:",
    antecedentes: [
      MARIHUANA,
      COCAINA,
      COCA_14_DIAS,
      { key: "ANFETAMINAS", label: "CONSUME ANFETAMINAS/ÉXTASIS" },
      { key: "METAN", label: "CONSUME METHANFETAMINAS/OPIÁCEOS" },
      { key: "BENZO", label: "CONSUME BENZODIAZEPINAS" },
    ],
  },
  {
    id: "panel10D",
    permission: "Consentimiento Panel 10D Asistencial",
    label: "Panel 10D",
    icon: faLayerGroup,
    nameConset: "con_panel10D",
    titulo: [`${TITULO_DROGAS} PANEL 10D`, "(AMP-BAR-BZO-COC-MET-MTD-PCP-THC-OPI-TCA)"],
    texto: textoPrueba("el panel de 10 drogas"),
    antecedentes: [
      { key: "MARIHUANA", label: "CONSUME MARIHUANA (THC)" },
      { key: "COCAINA", label: "CONSUME COCAÍNA (COC)" },
      COCA_14_DIAS,
      { key: "ANFETAMINAS", label: "CONSUME ANFETAMINAS (AMP)" },
      { key: "METAN", label: "CONSUME METHANFETAMINAS (MET)" },
      { key: "BENZO", label: "CONSUME BENZODIAZEPINAS (BZO)" },
      { key: "OPIA", label: "CONSUME OPIÁCEOS (OPI)" },
      { key: "BARBI", label: "CONSUME BARBITÚRICOS (BAR)" },
      { key: "METADONA", label: "CONSUME METADONA (MTD)" },
      { key: "FENCI", label: "CONSUME FENCICLIDINA (PCP)" },
      { key: "ANTI", label: "CONSUME ANTIDEPRESIVOS TRICÍCLICOS (TCA)" },
    ],
  },
  {
    id: "marihuana",
    permission: "Consentimiento Cons. Marihuana Asistencial",
    label: "Cons. Marihuana",
    icon: faCannabis,
    nameConset: "consent_marihuana",
    titulo: [`${TITULO_PRUEBA} DE`, "DOSAJE DE MARIHUANA"],
    texto: textoPrueba("Marihuana"),
    antecedentes: [{ key: "MARIHUANA", label: "CONSUME MARIHUANA (THC)" }],
  },
];

// Antecedentes del formulario: uno por cada antecedente del consentimiento ({ key, value, fecha }).
export const antecedentesIniciales = (config, hoy) =>
  config.antecedentes.map(({ key }) => ({ key, value: false, fecha: hoy }));

// Texto del consentimiento partido en segmentos { texto, negrita, dato } para pintarlo en pantalla y en el reporte.
// `dato` marca los datos del paciente; los que faltan se muestran como una línea en blanco.
export const segmentosConsentimiento = (texto, datos) =>
  texto
    .split(/(\{\w+\}|\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((parte) => {
      if (parte.startsWith("{")) return { texto: String(datos[parte.slice(1, -1)] || "__________"), negrita: true, dato: true };
      if (parte.startsWith("**")) return { texto: parte.slice(2, -2), negrita: true, dato: false };
      return { texto: parte, negrita: false, dato: false };
    });

// Datos del paciente que completan el texto. El DNI de solo dígitos se completa con ceros a 8.
export const datosConsentimiento = ({ nombres, apellidos, edad, numeroDocumento, empresa }) => {
  const dni = String(numeroDocumento ?? "").trim();
  return {
    nombre: `${nombres ?? ""} ${apellidos ?? ""}`.trim(),
    edad,
    dni: /^\d+$/.test(dni) ? dni.padStart(8, "0") : dni,
    empresa,
  };
};
