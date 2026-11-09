import { format } from 'date-fns';
import { TIPO_DNI } from '../../../../../../utils/documentoPaciente';

// Empresa exclusiva de este formulario: no se elige ni se agrega otra.
export const EMPRESA_LA_ARENA = 'LA ARENA S.A.';

// Examen médico fijo de este formulario
export const EXAMEN_ANUAL = 'ANUAL';

export const esEmpresaLaArena = (nombre) => (nombre ?? '').toUpperCase().includes(EMPRESA_LA_ARENA);

// Exámenes adicionales (campos del DTO): este formulario no los muestra, siempre van sin marcar
const EXAMENES_ADICIONALES = [
  'pruebaEsfuerzo',
  'examenVigia',
  'examenSanidad',
  'n_testaltura',
  'n_psicosen',
  'manipAlimentos',
  'trabCalientes',
  'visualCompl',
  'rxcKLumbar',
  'rxcLumbosacra',
  'rxcDorsoLumbar',
  'espaciosConfinados',
  'mercurioo',
  'rxcPlomos',
  'tmarihuana',
  'tcocaina',
  'herraManuales',
  'n_fisttest',
];

// Campos que este formulario no muestra. Al registrar una historia nueva se envían vacíos / sin marcar
// (precioAdic vacío lo envía el modelo como "S/.0"); al actualizar se conservan los de la historia.
export const VALORES_OCULTOS = {
  precioPo: '',
  tipoPago: '',
  precioAdic: '',
  autoriza: '',
  ...Object.fromEntries(EXAMENES_ADICIONALES.map((name) => [name, false])),
};

// campo del formulario -> nombre que se muestra en el aviso de "Faltan completar"
export const CAMPOS_REQUERIDOS = {
  // el documento (tipoDoc + nroDoc) se valida aparte porque depende del tipo
  nombres: 'Nombres',
  apellidos: 'Apellidos',
  razonEmpresa: 'Empresa',
  razonContrata: 'Contrata',
  n_medico: 'Médico ocupacional',
  cargoDe: 'Cargo',
  fechaAperturaPo: 'Fecha de apertura',
};

export const FECHA_APERTURA_VALIDA = /^\d{2}\/\d{2}\/\d{4}$/;

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
// El documento entra porque, con la edición habilitada, cambiarlo permite registrar una historia nueva.
export const CAMPOS_EDITABLES = [
  'tipoDoc',
  'nroDoc',
  'codPa', // sin campo propio: se revierte junto con el documento
  'nombres',
  'apellidos',
  'razonContrata',
  'n_medico',
  'protocolo',
  'cargoDe',
  'areaO',
  'nomEx',
  'mineralPo',
  'alturaPo',
  'fechaAperturaPo',
  'textObserv1',
  'textObserv2',
];

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

// Estado de un formulario en blanco (la empresa no forma parte: es fija)
export const crearDatosIniciales = () => ({
  // Documento del paciente (número en texto). codPa es el código interno del backend: no se muestra; solo
  // viaja cuando no hay número (sin documento o historia de extranjero cargada, que solo trae codPa)
  tipoDoc: TIPO_DNI,
  nroDoc: '',
  codPa: '',
  nombres: '',
  apellidos: '',
  razonContrata: '',
  n_medico: '',
  protocolo: '',
  cargoDe: '',
  areaO: '',
  nomExamen: EXAMEN_ANUAL,
  nomEx: '',
  mineralPo: '',
  alturaPo: '',
  fechaAperturaPo: hoyDMA(),
  textObserv1: '',
  textObserv2: '',
  ...VALORES_OCULTOS,

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
