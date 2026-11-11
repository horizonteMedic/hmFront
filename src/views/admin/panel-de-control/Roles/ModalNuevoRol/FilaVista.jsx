import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleRight, faBuilding, faCogs, faFileAlt, faFileLines, faFolderOpen, faHandshake, faList,
  faLock, faNotesMedical, faSliders, faTentArrowDownToLine, faUser,
} from '@fortawesome/free-solid-svg-icons';
import ToggleSwitch from './ToggleSwitch';

const iconMapping = {
  'Sistema': faCogs,
  'Menú de Roles': faUser,
  'Menú de Accesos': faLock,
  'Reportes': faFileAlt,
  'Matriz Postulante': faList,
  'Configuracion': faCogs,
  'Administrar Archivos': faFileAlt,
  'Administrar Sedes': faTentArrowDownToLine,
  'Agregar Campaña': faNotesMedical,
  'Administrar Empresas': faBuilding,
  'Administrar Contratas': faHandshake,
};

/**
 * Fila del árbol de vistas (recursiva). Muestra el nombre, cuántas sub-vistas tiene asignadas, el botón de
 * acciones (solo sub-vistas) y el interruptor de asignación, que se bloquea con spinner mientras se guarda.
 */
export default function FilaVista({
  nodo, profundidad = 0, asignadas, ocupados, abiertos, forzarAbrir, conteos,
  onToggleAbierto, onAlternar, onAcciones,
}) {
  const tieneHijos = nodo.children.length > 0;
  const abierto = tieneHijos && (forzarAbrir || abiertos.has(nodo.id));
  const asignada = asignadas.has(nodo.id);
  const ocupado = ocupados.has(nodo.id);
  const conteo = conteos.get(nodo.id);
  const esRaiz = profundidad === 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors
          ${esRaiz ? 'border-slate-200 bg-slate-50' : 'border-gray-200 bg-white hover:bg-gray-50'}
          ${ocupado ? 'opacity-70' : ''}`}
      >
        {tieneHijos ? (
          <button
            type="button"
            onClick={() => onToggleAbierto(nodo.id)}
            aria-label={abierto ? `Contraer ${nodo.label}` : `Expandir ${nodo.label}`}
            aria-expanded={abierto}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-gray-500 hover:bg-gray-200"
          >
            <FontAwesomeIcon icon={faAngleRight} className={`transition-transform duration-200 ${abierto ? 'rotate-90' : ''}`} />
          </button>
        ) : (
          <span className="h-6 w-6 shrink-0" />
        )}

        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs text-white
            ${esRaiz ? 'bg-[#233245]' : 'bg-[#fc6b03]'}`}
        >
          <FontAwesomeIcon icon={iconMapping[nodo.label] ?? (tieneHijos ? faFolderOpen : faFileLines)} />
        </span>

        <button
          type="button"
          onClick={() => tieneHijos && onToggleAbierto(nodo.id)}
          title={nodo.descripcion || nodo.label}
          className={`min-w-0 flex-1 truncate text-left text-sm ${esRaiz ? 'font-bold text-[#233245]' : 'font-medium text-gray-800'}
            ${tieneHijos ? 'cursor-pointer' : 'cursor-default'}`}
        >
          {nodo.label}
        </button>

        {conteo?.total > 0 && (
          <span
            className="hidden shrink-0 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600 sm:inline"
            title="Sub-vistas asignadas"
          >
            {conteo.asignados}/{conteo.total}
          </span>
        )}

        {!esRaiz && (
          <button
            type="button"
            onClick={() => onAcciones(nodo)}
            title="Elegir las acciones permitidas en esta vista"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#fc6b03]/40 px-2 py-1 text-xs font-semibold text-[#fc6b03] transition hover:bg-[#fc6b03]/10"
          >
            <FontAwesomeIcon icon={faSliders} />
            <span className="hidden sm:inline">Acciones</span>
          </button>
        )}

        <span
          className={`hidden w-[72px] shrink-0 text-right text-xs font-semibold md:inline
            ${ocupado ? 'text-gray-500' : asignada ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          {ocupado ? 'Guardando…' : asignada ? 'Asignada' : 'Sin asignar'}
        </span>

        <ToggleSwitch
          checked={asignada}
          loading={ocupado}
          onChange={() => onAlternar(nodo)}
          label={`${asignada ? 'Quitar' : 'Asignar'} ${nodo.label}`}
        />
      </div>

      {abierto && (
        <div className="mt-1.5 ml-4 space-y-1.5 border-l-2 border-slate-200 pl-2 sm:ml-6 sm:pl-3">
          {nodo.children.map((hijo) => (
            <FilaVista
              key={hijo.id}
              nodo={hijo}
              profundidad={profundidad + 1}
              asignadas={asignadas}
              ocupados={ocupados}
              abiertos={abiertos}
              forzarAbrir={forzarAbrir}
              conteos={conteos}
              onToggleAbierto={onToggleAbierto}
              onAlternar={onAlternar}
              onAcciones={onAcciones}
            />
          ))}
        </div>
      )}
    </div>
  );
}
