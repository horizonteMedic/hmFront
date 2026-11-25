// Cuadro «Para ser llenado por el profesional que realiza la prueba» (ítems 6–16 del formato en papel).
export const CRITERIOS_PROFESIONAL = [
  { numero: 6, campo: "exclHemoptisis", texto: "HEMOPTISIS" },
  { numero: 7, campo: "exclNeumotorax", texto: "NEUMOTÓRAX" },
  { numero: 8, campo: "exclTraqueostomia", texto: "TRAQUEOSTOMÍA" },
  { numero: 9, campo: "exclSondaPleural", texto: "SONDA PLEURAL" },
  { numero: 10, campo: "exclAneurismas", texto: "ANEURISMAS CEREBRAL, ABDOMEN, TÓRAX" },
  { numero: 11, campo: "exclEmboliaPulmonar", texto: "EMBOLIA PULMONAR" },
  { numero: 12, campo: "exclInfartoReciente", texto: "INFARTO RECIENTE" },
  { numero: 13, campo: "exclInestabilidadCv", texto: "INESTABILIDAD CV" },
  { numero: 14, campo: "exclFiebreNauseaVomito", texto: "FIEBRE, NÁUSEA, VÓMITO" },
  { numero: 15, campo: "exclEmbarazoAvanzado", texto: "EMBARAZO AVANZADO" },
  { numero: 16, campo: "exclEmbarazoComplicado", texto: "EMBARAZO COMPLICADO" },
];

// Cuadro «Preguntas para todos los entrevistados que no tienen los criterios de exclusión…» (ítems 1–7 del formato).
// En la pregunta 5 (fumó), `campoCuantos` guarda cuántos: el DTO no trae un «cuántos» propio de esta versión,
// así que se reutiliza el de OHLA (`ohlaFumoCigarroCuantos`).
export const PREGUNTAS_ENTREVISTADOS_GENERAL = [
  { numero: 1, campo: "pregInfeccionResp", texto: "¿Tuvo una infección respiratoria (resfriado), en las últimas 3 semanas?" },
  { numero: 2, campo: "pregInfeccionOido", texto: "¿Tuvo infección en el oído en las ÚLTIMAS 3 SEMANAS?" },
  { numero: 3, campo: "pregAerosoles", texto: "¿Usó aerosoles (sprays inhalados) o nebulizaciones con broncodilatadores, en las últimas 3 horas?" },
  { numero: 4, campo: "pregBroncodilatador", texto: "¿Ha usado algún medicamento broncodilatador en las últimas 8 horas?" },
  { numero: 5, campo: "pregFumo", texto: "¿Fumó (cualquier tipo de cigarro), en las últimas dos horas?", campoCuantos: "ohlaFumoCigarroCuantos" },
  { numero: 6, campo: "pregEjercicio", texto: "¿Realizó algún ejercicio físico fuerte (como gimnasia, caminata o trotar), en la última hora?" },
  { numero: 7, campo: "pregComio", texto: "¿Comió en la última hora?" },
];

// Todos los campos booleanos de la versión general (estado inicial del formulario, lectura del reporte y POST).
export const CAMPOS_CUESTIONARIO_GENERAL = [
  ...CRITERIOS_PROFESIONAL.map(({ campo }) => campo),
  ...PREGUNTAS_ENTREVISTADOS_GENERAL.map(({ campo }) => campo),
];

// Estado inicial: todos sin responder (null), igual que las demás preguntas del cuestionario.
export const CUESTIONARIO_GENERAL_INICIAL = Object.fromEntries(CAMPOS_CUESTIONARIO_GENERAL.map((campo) => [campo, null]));

// Copia esos campos desde `origen` (respuesta del backend o formulario); lo que no venga queda en null.
export const camposCuestionarioGeneral = (origen) =>
  Object.fromEntries(CAMPOS_CUESTIONARIO_GENERAL.map((campo) => [campo, origen?.[campo] ?? null]));
