export const getAnexo16InitialFormState = ({ today, userlogued, userName }) => ({
  norden: "",
  nomExamen: "",
  fechaExam: today,
  codigoAnexo: null,
  //Info personal
  dni: "",
  nombres: "",
  apellidos: "",
  fechaNac: "",
  sexo: "",
  edad: "",
  //Contacto y Estado Civil
  lugarNac: "",
  domicilio: "",
  telefono: "",
  estadoCivil: "",
  gradoInstruccion: "",
  //Agentes presentes en Trabajo Actual
  ruido: true,
  polvo: true,
  vidSegmentario: true,
  vidTotal: true,
  alturaEstruct: true,
  vibraciones: true,
  cancerigenos: false,
  mutagenicos: false,
  solventes: false,
  metales: false,
  alturaGeograf: false,
  temperaturaAgente: true,
  biologicos: false,
  posturas: true,
  turnos: false,
  quimicos: false,
  cargas: true,
  movRepet: true,
  pvd: false,
  electricos: false,
  otros: false,
  //Información Laboral
  empresa: "",
  contrata: "",
  mineralExp: "",
  explotacion: "",
  alturaLaboral: "",
  //Detalles del Puesto
  puestoPostula: "N/A",
  areaPuesto: "",
  puestoActual: "N/A",
  tiempoPuesto: "N/A",
  reubicacion: false,

  //Antecedentes
  antecedentesPersonales2: "NINGUNO",
  antecedentesPersonales: "NIEGA DB, TBC, HTA, CONVULSIONES, ASMA, ALERGIAS, ACCIDENTES",
  antecedentesFamiliares: "NO CONTRIBUTORIOS",
  antecedentesPatologicos: "",
  //Hábitos
  tabaco: "NADA",
  alcohol: "NADA",
  drogas: "NADA",
  //Número de Hijos
  hijosVivos: "",
  hijosMuertos: "",
  //Inmunizaciones
  tetano: false,
  hepatitisB: false,
  fiebreAmarilla: false,

  //=============================================================================================
  //TAB LATERAL
  //=============================================================================================
  observacionesGenerales: "",
  observacionesAudio: "",
  conclusionMedico: "",

  //Resultados de Laboratorio
  vsg: "",
  glucosa: "",
  creatinina: "",
  marihuana: "",
  cocaina: "NO REACTIVO",
  hemoglobinaHematocrito: "",
  //Grupo Sanguineo
  grupoSanguineoPrevio: "",
  grupoSanguineoGrupo: "",
  grupoSanguineo: "",
  factorRh: "",
  //Resultados de Laboratorio
  colesterolTotal: "",
  LDLColesterol: "",
  HDLColesterol: "",
  VLDLColesterol: "",
  trigliceridos: "",


  //=============================================================================================
  //SEGUNDA TAB EXAMENES
  //=============================================================================================
  // Información Triaje
  //Medidas Generales
  temperatura: "",
  cintura: "",
  cadera: "",
  icc: "",
  // Signos Vitales
  frecuenciaRespiratoria: "",
  frecuenciaCardiaca: "",
  saturacionO2: "",
  // Presión Arterial
  presionSistolica: "",
  presionDiastolica: "",

  //Medidas Generales
  talla: "",
  peso: "",
  imc: "",
  imcRojo: false,

  // Audiometría - Oído Derecho
  od500: "",
  od1000: "",
  od2000: "",
  od3000: "",
  od4000: "",
  od6000: "",
  od8000: "",

  // Audiometría - Oído Izquierdo
  oi500: "",
  oi1000: "",
  oi2000: "",
  oi3000: "",
  oi4000: "",
  oi6000: "",
  oi8000: "",

  otoscopiaOd: "NORMAL",
  otoscopiaOi: "NORMAL",

  // Función Respiratoria
  fvc: "",
  funcionABSNormal: false,
  funcionABSOBSTR: false,
  fev1: "",
  fev1Fvc: "",
  fef2575: "",
  conclusionRespiratoria: "",

  // Examen Físico
  cabeza: "NORMAL",
  nariz: "CENTRAL, PERMEABLE",
  cuello: "CENTRAL, MOVIL",
  perimetro: "",
  bocaAmigdalasFaringeLaringe: "HUMECTADA, NO HIPERTROFICAS, NO CONGESTIVAS",

  piel: "NORMAL",
  pielObservaciones: "NORMAL. NO MANCHAS, AUSENCIA DE LUNARES SOSPECHOSOS DE MALIGNIDAD.",
  //Miembros y reflejos
  miembrosSuperiores: "SIMETRICOS, NO DEFORMIDADES, MOTRICIDAD CONSERVADA.",
  miembrosInferiores: "SIMETRICOS, NO DEFORMIDADES, MOTRICIDAD CONSERVADA.",
  reflejosOsteotendinosos: "CONSERVADOS",
  marcha: "NORMAL",

  // Ojos
  visionCercaOd: "",
  visionCercaOi: "",
  visionCercaOdCorregida: "",
  visionCercaOiCorregida: "",

  visionLejosOd: "",
  visionLejosOi: "",
  visionLejosOdCorregida: "",
  visionLejosOiCorregida: "",

  visionColores: "NORMAL",
  enfermedadOculares: "NINGUNA",
  enfermedadOtros: "NINGUNA",
  reflejosPupilares: "CONSERVADOS",
  visionBinocular: "",

  pulmones: "NORMAL",
  pulmonesObservaciones: "BPMV EN ACP. NO RALES.",
  torax: "BPMV EN ACP, NO RALES.",
  corazon: "RCRR, NO SOPLOS.",
  // Dentadura
  piezasMalEstado: "",
  piezasFaltan: "",
  dentaduraObservaciones: "",
  //=============================================================================================
  //TERCERA TAB RESULTADOS
  //=============================================================================================
  // Examen Físico - Abdomen
  abdomen: "RHA(+), B/D, NO DOLOROSO A LA PALPACION",
  columnaVertebral: "CENTRAL, MOVIL, CURVATURAS CONSERVADAS",
  anillosInguinales: "CONSERVADOS",
  organosGenitales: "DE CARACTER NORMAL",
  //Tacto Rectal
  tactoRectal: "NO_SE_HIZO",
  hernias: "NO",
  varices: "NO",
  ganglios: "NO LINFADENOPATIAS",
  evaluacionCognitiva: "NORMAL",
  //Información Radiológica
  numeroRx: "",
  codigoExamenRadiograficoSanguineo: null,
  fechaRx: today,
  calidadRx: "",
  simbolosRx: "N/A",
  //Conclusiones Radiográficas
  vertices: "",
  hilios: "",
  senos: "",
  mediastinos: "",
  conclusionesRadiograficas: "",
  siluetaCardiovascular: "",
  //Estado Mental y Anamnesis
  estadoMental: "DESPIERTO, OTEP, COMUNICATIVO.",
  anamnesis: "COLABORADOR REFIERE SENTIRSE BIEN, SIN PROBLEMAS DE SALUD, NO practica deporte o deporte de alto rendimiento.",
  //Clasificación y Neumoconiosis
  clasificacion: "0/0",
  clasificacionABC: "",
  clasificacionST: "St",
  reaccionesSerologicas: "NEGATIVO",
  sinNeumoconiosis: "NORMAL",
  imagenRadiograficaPolvo: "SOSPECHA",
  conNeumoconiosis: "",

  //=============================================================================================
  //CUARTA TAB RESULTADOS
  //=============================================================================================
  // Exámenes de Laboratorio
  nitritos: "",
  proteinas: "",
  cetonas: "",
  leucocitos: "",
  urobilinogeno: "",
  bilirrubina: "",
  glucosaQuimico: "",
  sangre: "",
  leucocitosSedimento: "",
  celulasEpiteliales: "",
  cilindios: "",
  bacterias: "",
  hematies: "",
  cristales: "",
  pus: "",
  otrosSedimento: "",
  colorFisico: "",
  aspectoFisico: "",
  densidadFisico: "",
  phFisico: "",
  otrosExamenes: "",
  aptoParaTrabajar: "",

  // Estado del Paciente
  nordenEstadoPaciente: "",
  nombresEstadoPaciente: "",
  tipoExamenEstadoPaciente: "",

  // Exámenes Realizados
  triaje: "",
  labClinico: "",
  electrocardiograma: "",
  rxToraxPA: "",
  fichaAudiologica: "",
  espirometria: "",
  odontograma: "",
  psicologia: "",
  anexo7D: "",
  histOcupacional: "",
  fichaAntPatologicos: "",
  cuestionarioNordico: "",
  certTrabajoAltura: "",
  detencionSAS: "",
  consentimientoDosaje: "",
  exRxSanguineos: "",
  perimetroToraxico: "",
  oftalmologia: "",

  //colores
  cocainaRed: "",
  marihuanaRed: "",
  glucosaRed: "",
  creatininaRed: "",
  imcRed: "",
  hemoglobinaRed: "",
  colesterolRed: "",

  ldlRed: "",
  hdlRed: "",
  vldlRed: "",
  trigliceridosRed: "",

  notasDoctor: "",
  //Laboratorio
  mercurioOrina: "N/A",
  plomoSangre: "N/A",
  pcr_ultrasensible: "",

  // Médico que Certifica //BUSCADOR
  nombre_medico: userName,
  user_medicoFirma: userlogued,

  observacionesGenerales2: "",
  posibleCerrar: false,
  cerrado: false,
  // otrosExamenes2: "",

  SubirDoc: false,
  nomenclatura: "RESMAG",

  //forma y tamaño - abdomen simbolos
  chkP1: false,
  chkP2: false,
  chkP3: false,
  chkP4: false,
  chkP5: false,
  chkP6: false,
  chkS1: false,
  chkS2: false,
  chkS3: false,
  chkS4: false,
  chkS5: false,
  chkS6: false,
});
