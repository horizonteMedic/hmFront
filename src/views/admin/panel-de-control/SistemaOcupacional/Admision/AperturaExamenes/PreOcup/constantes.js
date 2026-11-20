import { format } from 'date-fns';

// "Autorizado por" que se aplica al cargar una pre-carga
export const AUTORIZA_PRECARGA = 'DR. ARTEMIO';

export const FECHA_APERTURA_VALIDA = /^\d{2}\/\d{2}\/\d{4}$/;

export const hoyDMA = () => format(new Date(), 'dd/MM/yyyy');

// "2026-10-24" / "2026/10/24" -> "24/10/2026" ('' si no es una fecha válida)
export const aFechaDMA = (fecha) => {
  if (!fecha || typeof fecha !== 'string') return '';
  if (fecha.includes('GMT') || fecha.includes('hora estándar')) return '';
  const partes = fecha.split(/[/-]/);
  if (partes.length !== 3) return '';
  const [anio, mes, dia] = partes.map(Number);
  if (!anio || !mes || !dia) return '';
  return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${anio}`;
};

// Exámenes adicionales (campos booleanos del DTO), en el orden en que se muestran
export const EXAMENES_ADICIONALES = [
  { name: 'pruebaEsfuerzo', label: 'P.ESFUERZO', title: 'P. DE ESFUERZO' },
  { name: 'examenVigia', label: 'EXAMEN VIGIA', title: 'EXAMEN VIGIA', destacado: true },
  { name: 'examenSanidad', label: 'EXAMEN SANIDAD', title: 'EXAMEN SANIDAD', destacado: true },
  { name: 'n_testaltura', label: 'T.ALTURA', title: 'TEST DE ALTURA' },
  { name: 'n_psicosen', label: 'PSICOSEN', title: 'PSICOSENSOMETRIA' },
  { name: 'manipAlimentos', label: 'M.ALIM.', title: 'MANIPULADOR DE ALIMENTOS' },
  { name: 'trabCalientes', label: 'T.CAL', title: 'TRABAJOS EN CALIENTE' },
  { name: 'visualCompl', label: 'VIS.COMPL', title: 'VISUAL COMPLEMENTARIO' },
  { name: 'rxcKLumbar', label: 'RX.LUMBA', title: 'RX COLUMNA LUMBA FyL' },
  { name: 'rxcLumbosacra', label: 'RX.C.LUMBO', title: 'RX COLUMNA LUMBOSACRA FyL' },
  { name: 'rxcDorsoLumbar', label: 'RX.C.DORSE', title: 'RX COLUMNA DORSOLUMBAR FyL' },
  { name: 'espaciosConfinados', label: 'ESP.CONF', title: 'ESPACIOS CONFINADOS' },
  { name: 'mercurioo', label: 'MER.O', title: 'MERCURIO EN ORINA' },
  { name: 'rxcPlomos', label: 'PLOMO S.', title: 'PLOMO EN SANGRE' },
  { name: 'tmarihuana', label: 'MARIHUANA', title: 'MARIHUANA' },
  { name: 'tcocaina', label: 'COCAINA', title: 'COCAINA' },
  { name: 'herraManuales', label: 'H.MAN', title: 'HERRAMIENTAS MANUALES' },
  { name: 'n_fisttest', label: 'FIST-TEST', title: 'FIST-TEST' },
];

// campo del formulario -> nombre que se muestra en el aviso de "Faltan completar"
export const CAMPOS_REQUERIDOS = {
  codPa: 'DNI',
  nombres: 'Nombres',
  apellidos: 'Apellidos',
  razonEmpresa: 'Empresa',
  razonContrata: 'Contrata',
  n_medico: 'Médico ocupacional',
  cargoDe: 'Cargo',
  tipoPago: 'Forma de pago',
  fechaAperturaPo: 'Fecha de apertura',
};

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
// `codPa` entra porque, con la edición habilitada, cambiar el DNI permite registrar una historia nueva;
// `rucEmpresa` no tiene campo propio: se revierte junto con la empresa.
export const CAMPOS_EDITABLES = [
  'codPa',
  'nombres',
  'apellidos',
  'razonEmpresa',
  'rucEmpresa',
  'razonContrata',
  'n_medico',
  'protocolo',
  'cargoDe',
  'areaO',
  'nomExamen',
  'nomEx',
  'mineralPo',
  'alturaPo',
  'precioPo',
  'tipoPago',
  'autoriza',
  'fechaAperturaPo',
  'textObserv1',
  'textObserv2',
];

// Estado de un formulario en blanco
export const crearDatosIniciales = () => ({
  codPa: '',
  nombres: '',
  apellidos: '',
  razonEmpresa: '',
  rucEmpresa: '',
  razonContrata: '',
  n_medico: '',
  protocolo: '',
  cargoDe: '',
  areaO: '',
  nomExamen: '',
  nomEx: '',
  mineralPo: '',
  alturaPo: '',
  precioPo: '',
  tipoPago: '',
  precioAdic: '',
  autoriza: '',
  fechaAperturaPo: hoyDMA(),
  n_operacion: '',
  textObserv1: '',
  textObserv2: '',
  ...Object.fromEntries(EXAMENES_ADICIONALES.map(({ name }) => [name, false])),

  // Pre-carga de la que viene la historia (solo informativo)
  idPreNorden: null,
  preCargaUsuario: '',

  // Control de UI: false = historia nueva / true = historia ya registrada (cargada desde la tabla)
  tieneRegistro: false,

  // Auditoría. BackendHistoriaClinicaOcupacionalDTO solo trae el usuario que registró (`usuarioRegistro`):
  // no tiene fecha-hora de registro ni datos de edición, así que esos campos quedan vacíos.
  userRegistro: '',
  fechaRegistro: '',
  usuarioActualizacion: '',
  fechaActualizacion: '',
});
