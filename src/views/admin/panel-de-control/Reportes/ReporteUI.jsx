import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { formatearFechaCorta } from '../../../utils/formatDateUtils';

// Piezas visuales compartidas por el Reporte de Pacientes y el Historial del Paciente.

// Fecha de examen en formato día/mes/año (dd/mm/aaaa). Si no se puede convertir, se muestra tal cual llegó.
export const fechaDMA = (fecha) => {
  if (!fecha) return '—';
  return formatearFechaCorta(String(fecha).slice(0, 10)) || String(fecha);
};

// Ícono "i" que muestra el texto al pasar el mouse o al enfocarlo con el teclado.
// Por defecto es para cabeceras oscuras; con `claro` se usa sobre fondos claros (p. ej. dentro de una celda).
export const InfoTooltip = ({ texto, claro = false }) => (
  <span
    className={`group/info relative inline-flex shrink-0 align-middle outline-none ${claro ? '' : 'ml-1.5'}`}
    tabIndex={0}
    aria-label={texto}
    onClick={(e) => e.stopPropagation()}
  >
    <FontAwesomeIcon
      icon={faCircleInfo}
      className={`cursor-help ${claro
        ? 'text-gray-400 group-hover/info:text-blue-600 group-focus/info:text-blue-600'
        : 'text-sky-300 group-hover/info:text-white group-focus/info:text-white'}`}
    />
    <span
      role="tooltip"
      className={`pointer-events-none absolute top-full z-30 mt-2 hidden w-56 whitespace-normal rounded-md border border-gray-300 bg-white px-3 py-2 text-left font-normal normal-case text-gray-800 shadow-lg group-hover/info:block group-focus/info:block ${claro ? 'left-0' : 'right-0'}`}
    >
      {texto}
    </span>
  </span>
);

// La raíz del proyecto está en 10px, así que aquí se usan tamaños en px que crecen con la pantalla.
// Todo lo de adentro hereda este tamaño (íconos y componentes reutilizables incluidos).
export const TEXTO_ADAPTATIVO = 'text-[11px] lg:text-[12px] 2xl:text-[13px]';

export const BOTON_BASE =
  'inline-flex items-center gap-2 rounded px-4 py-1.5 font-semibold transition-all duration-150 ease-out ' +
  'hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50';

// Mismo aspecto que SectionFieldset (barra azul primario y fondo gris claro), con la letra adaptativa.
export const Seccion = ({ titulo, acciones, children, className = '' }) => (
  <section className="rounded border bg-primarioClaro">
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-t bg-primario px-4 py-2 text-white">
      <h2 className="text-[1em] font-semibold">{titulo}</h2>
      {acciones && <div className="flex flex-wrap items-center gap-2">{acciones}</div>}
    </div>
    <div className={`p-4 ${className}`}>{children}</div>
  </section>
);
