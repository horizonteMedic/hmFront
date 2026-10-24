import { format } from 'date-fns';

// Empresa exclusiva de este formulario: no se elige ni se agrega otra.
export const EMPRESA_LA_ARENA = 'LA ARENA S.A.';

// "Autorizado por" que se aplica al cargar una pre-carga
export const AUTORIZA_PRECARGA = 'DR. ARTEMIO';

export const esEmpresaLaArena = (nombre) => (nombre ?? '').toUpperCase().includes(EMPRESA_LA_ARENA);

// name = campo del DTO · title = nombre completo que se muestra
export const EXAMENES_ADICIONALES = [
  { name: 'pruebaEsfuerzo', title: 'PRUEBA DE ESFUERZO' },
  { name: 'examenVigia', title: 'EXAMEN VIGIA' },
  { name: 'examenSanidad', title: 'EXAMEN SANIDAD' },
  { name: 'n_testaltura', title: 'TEST DE ALTURA' },
  { name: 'n_psicosen', title: 'PSICOSENSOMETRIA' },
  { name: 'manipAlimentos', title: 'MANIPULADOR DE ALIMENTOS' },
  { name: 'trabCalientes', title: 'TRABAJOS EN CALIENTE' },
  { name: 'visualCompl', title: 'VISUAL COMPLEMENTARIO' },
  { name: 'rxcKLumbar', title: 'RX COLUMNA LUMBAR FyL' },
  { name: 'rxcLumbosacra', title: 'RX COLUMNA LUMBOSACRA FyL' },
  { name: 'rxcDorsoLumbar', title: 'RX COLUMNA DORSOLUMBAR FyL' },
  { name: 'espaciosConfinados', title: 'ESPACIOS CONFINADOS' },
  { name: 'mercurioo', title: 'MERCURIO EN ORINA' },
  { name: 'rxcPlomos', title: 'PLOMO EN SANGRE' },
  { name: 'tmarihuana', title: 'MARIHUANA' },
  { name: 'tcocaina', title: 'COCAINA' },
  { name: 'herraManuales', title: 'HERRAMIENTAS MANUALES' },
  { name: 'n_fisttest', title: 'FIST-TEST' },
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
  nomExamen: '',
  nomEx: '',
  mineralPo: '',
  alturaPo: '',
  precioPo: '',
  tipoPago: '',
  precioAdic: '',
  autoriza: '',
  fechaAperturaPo: hoyDMA(),
  textObserv1: '',
  textObserv2: '',
  userRegistroDatos: '',
  ...Object.fromEntries(EXAMENES_ADICIONALES.map(({ name }) => [name, false])),
});
