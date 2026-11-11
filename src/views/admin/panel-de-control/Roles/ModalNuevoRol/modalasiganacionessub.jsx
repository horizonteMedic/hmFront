import { useCallback, useEffect, useState } from 'react';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { getFetch } from '../../getFetch/getFetch';
import { DeletePermiso, NewPermiso } from './model';
import ModalShell, { EstadoCargando, EstadoError } from './ModalShell';
import ToggleSwitch from './ToggleSwitch';
import { avisar, confirmarQuitar } from './avisos';

/**
 * Acciones (permisos) que un rol puede ejecutar dentro de una vista. Cada interruptor se guarda al instante y
 * muestra un spinner mientras dura el cambio.
 */
const ModalAsignacionesSub = ({ onClose, nombre, IDView, token, ID_ROL, nombreRol }) => {
  const [acciones, setAcciones] = useState([]); // todas las acciones posibles de la vista
  const [habilitadas, setHabilitadas] = useState([]); // las que el rol ya tiene
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [ocupadas, setOcupadas] = useState(() => new Set());

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(false);
    try {
      const [permisosRol, posibles] = await Promise.all([
        getFetch(`/api/v01/ct/permisosAsignadosPorRol/listadoVistasYOpcionesAsigPorRol/${ID_ROL}`, token),
        getFetch(`/api/v01/ct/posiblesPermisosSistema/listadoPermisosPorVista/${IDView}`, token),
      ]);
      if (!Array.isArray(permisosRol) || !posibles || posibles.error) throw new Error('Respuesta inválida de permisos');

      setHabilitadas(permisosRol.find((item) => item.nombre === nombre)?.listaPermisos ?? []);
      setAcciones(posibles.namePermiso ?? []);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setCargando(false);
    }
  }, [ID_ROL, IDView, nombre, token]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const setOcupada = (accion, valor) =>
    setOcupadas((prev) => {
      const sig = new Set(prev);
      if (valor) sig.add(accion); else sig.delete(accion);
      return sig;
    });

  const alternar = async (accion) => {
    const habilitada = habilitadas.includes(accion);
    if (habilitada && !(await confirmarQuitar(`¿Quitar "${accion}"?`, `El rol ${nombreRol} ya no podrá hacerlo en ${nombre}.`))) {
      return;
    }

    setOcupada(accion, true);
    try {
      if (habilitada) {
        await DeletePermiso(IDView, accion, ID_ROL, token);
        setHabilitadas((prev) => prev.filter((p) => p !== accion));
      } else {
        await NewPermiso(IDView, accion, ID_ROL, token);
        setHabilitadas((prev) => (prev.includes(accion) ? prev : [...prev, accion]));
      }
      avisar('success', habilitada ? `Se quitó "${accion}"` : `Se habilitó "${accion}"`);
    } catch (e) {
      console.error(e);
      avisar('error', `No se pudo ${habilitada ? 'quitar' : 'habilitar'} "${accion}"`);
    } finally {
      setOcupada(accion, false);
    }
  };

  const cuerpo = () => {
    if (cargando) return <EstadoCargando texto="Cargando acciones…" />;
    if (error) return <EstadoError texto="No se pudieron cargar las acciones de esta vista." onReintentar={cargar} />;
    if (acciones.length === 0) {
      return <p className="px-6 py-12 text-center text-sm text-gray-500">Esta vista no tiene acciones configurables.</p>;
    }

    return (
      <div className="space-y-3 p-3 sm:p-4">
        <p className="text-sm font-semibold text-[#233245]">
          {acciones.filter((a) => habilitadas.includes(a)).length} de {acciones.length} acciones habilitadas
        </p>
        <ul className="space-y-1.5">
          {acciones.map((accion) => {
            const habilitada = habilitadas.includes(accion);
            const ocupada = ocupadas.has(accion);
            return (
              <li
                key={accion}
                className={`flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2.5 transition-colors hover:bg-gray-50 ${ocupada ? 'opacity-70' : ''}`}
              >
                <span className="min-w-0 truncate text-sm font-medium text-gray-800">{accion}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className={`hidden text-xs font-semibold sm:inline ${ocupada ? 'text-gray-500' : habilitada ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {ocupada ? 'Guardando…' : habilitada ? 'Habilitada' : 'Deshabilitada'}
                  </span>
                  <ToggleSwitch
                    checked={habilitada}
                    loading={ocupada}
                    onChange={() => alternar(accion)}
                    label={`${habilitada ? 'Quitar' : 'Habilitar'} ${accion}`}
                  />
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <ModalShell
      icono={faSliders}
      titulo={`Acciones de ${nombre}`}
      subtitulo={`Rol: ${nombreRol}`}
      onClose={onClose}
      ancho="max-w-md"
      capa="z-[60]"
    >
      {cuerpo()}
    </ModalShell>
  );
};

export default ModalAsignacionesSub;
