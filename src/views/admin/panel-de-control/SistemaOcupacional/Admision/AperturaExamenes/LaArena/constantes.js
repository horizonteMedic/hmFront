import { format } from 'date-fns';

// Empresa exclusiva de este formulario: no se elige ni se agrega otra.
export const EMPRESA_LA_ARENA = 'LA ARENA S.A.';

// "Autorizado por" que se aplica al cargar una pre-carga
export const AUTORIZA_PRECARGA = 'DR. ARTEMIO';

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
  ...Object.fromEntries(EXAMENES_ADICIONALES.map((name) => [name, false])),
};

// campo del formulario -> nombre que se muestra en el aviso de "Faltan completar"
export const CAMPOS_REQUERIDOS = {
  codPa: 'DNI',
  nombres: 'Nombres',
  apellidos: 'Apellidos',
  razonEmpresa: 'Empresa',
  razonContrata: 'Contrata',
  n_medico: 'Médico ocupacional',
  cargoDe: 'Cargo',
  fechaAperturaPo: 'Fecha de apertura',
};

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

// Estado de un formulario en blanco (la empresa no forma parte: es fija)
export const crearDatosIniciales = () => ({
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
  autoriza: '',
  fechaAperturaPo: hoyDMA(),
  textObserv1: '',
  textObserv2: '',
  userRegistroDatos: '',
  ...VALORES_OCULTOS,
});
