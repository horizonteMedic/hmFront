import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { getFetch } from '../../getFetch/getFetch';
import { ListViewxRol, NewVistaxRol, DeleteVistaxRol } from '../model/ListViewxRol';
import ModalAsignacionesSub from './modalasiganacionessub';
import ModalShell, { EstadoCargando, EstadoError } from './ModalShell';
import FilaVista from './FilaVista';
import { avisar, confirmarQuitar } from './avisos';
import { construirArbol, contarDescendientes, filtrarArbol, normalizar } from './vistasTree';

const FILTROS = [
  { id: 'todas', texto: 'Todas' },
  { id: 'asignadas', texto: 'Asignadas' },
  { id: 'sin', texto: 'Sin asignar' },
];

/**
 * Modal "Asignar vistas" de un rol: árbol de vistas con interruptores (cada cambio se guarda al instante y la fila
 * muestra un spinner mientras tanto), búsqueda, filtro por estado y acceso a las acciones de cada sub-vista.
 */
const MyTreeView = ({ closeModal, token, userlogued, ID_ROL, Nombre }) => {
  const [opciones, setOpciones] = useState([]);
  const [privilegios, setPrivilegios] = useState([]); // vistas asignadas al rol: [{ id, id_opcion_interfaz }]
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [texto, setTexto] = useState('');
  const [filtro, setFiltro] = useState('todas');
  const [abiertos, setAbiertos] = useState(() => new Set());
  const [ocupados, setOcupados] = useState(() => new Set());
  const [vistaAcciones, setVistaAcciones] = useState(null);
  const ultimaCarga = useRef(0);
  const abiertosIniciales = useRef(false);

  // Recarga las vistas asignadas. Si llegan varias respuestas desordenadas, solo cuenta la más reciente.
  const cargarAsignadas = useCallback(async () => {
    const id = ++ultimaCarga.current;
    const res = await ListViewxRol(ID_ROL, token);
    if (!Array.isArray(res)) throw new Error('Respuesta inválida de privilegios');
    if (id === ultimaCarga.current) setPrivilegios(res);
  }, [ID_ROL, token]);

  const cargarTodo = useCallback(async () => {
    setCargando(true);
    setError(false);
    try {
      const [lista] = await Promise.all([getFetch('/api/v01/ct/opcionesInterfaz', token), cargarAsignadas()]);
      if (!Array.isArray(lista)) throw new Error('Respuesta inválida de opciones');
      setOpciones(lista);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setCargando(false);
    }
  }, [token, cargarAsignadas]);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const arbol = useMemo(() => construirArbol(opciones), [opciones]);
  const privilegioPorVista = useMemo(() => new Map(privilegios.map((p) => [p.id_opcion_interfaz, p.id])), [privilegios]);
  const asignadas = useMemo(() => new Set(privilegioPorVista.keys()), [privilegioPorVista]);
  const conteos = useMemo(() => contarDescendientes(arbol, asignadas), [arbol, asignadas]);

  const totalVistas = opciones.length;
  const totalAsignadas = opciones.filter((o) => asignadas.has(o.id)).length;
  const porcentaje = totalVistas ? Math.round((totalAsignadas / totalVistas) * 100) : 0;

  // Al abrir, se despliegan los grupos que ya tienen sub-vistas asignadas.
  useEffect(() => {
    if (cargando || error || abiertosIniciales.current) return;
    abiertosIniciales.current = true;
    setAbiertos(new Set([...conteos].filter(([, c]) => c.asignados > 0).map(([id]) => id)));
  }, [cargando, error, conteos]);

  const filtrando = Boolean(texto.trim()) || filtro !== 'todas';
  const arbolVisible = useMemo(() => {
    if (!filtrando) return arbol;
    const buscado = normalizar(texto);
    return filtrarArbol(arbol, (nodo) =>
      (!buscado || normalizar(nodo.label).includes(buscado)) &&
      (filtro === 'todas' || (filtro === 'asignadas') === asignadas.has(nodo.id))
    );
  }, [arbol, asignadas, filtrando, texto, filtro]);

  const setOcupado = (id, valor) =>
    setOcupados((prev) => {
      const sig = new Set(prev);
      if (valor) sig.add(id); else sig.delete(id);
      return sig;
    });

  const alternarAbierto = (id) =>
    setAbiertos((prev) => {
      const sig = new Set(prev);
      if (sig.has(id)) sig.delete(id); else sig.add(id);
      return sig;
    });

  const expandirTodo = () => setAbiertos(new Set([...conteos].filter(([, c]) => c.total > 0).map(([id]) => id)));

  // Asigna o quita una vista del rol. Quitar pide confirmación; asignar se aplica directo (es reversible).
  const alternarVista = async (nodo) => {
    const privilegioId = privilegioPorVista.get(nodo.id);

    if (privilegioId && !(await confirmarQuitar(`¿Quitar "${nodo.label}"?`, `El rol ${Nombre} dejará de acceder a esta vista.`))) {
      return;
    }

    setOcupado(nodo.id, true);
    try {
      if (privilegioId) {
        await DeleteVistaxRol(privilegioId, token);
      } else {
        await NewVistaxRol({ descripcion: `Acceso a ${nodo.label}`, id_rol: ID_ROL, id_opcion_interfaz: nodo.id }, userlogued, token);
      }
      await cargarAsignadas(); // trae el id real del privilegio, necesario para poder quitarlo después
      avisar('success', privilegioId ? `Se quitó "${nodo.label}"` : `Se asignó "${nodo.label}"`);
    } catch (e) {
      console.error(e);
      avisar('error', `No se pudo ${privilegioId ? 'quitar' : 'asignar'} "${nodo.label}"`);
    } finally {
      setOcupado(nodo.id, false);
    }
  };

  const cuerpo = () => {
    if (cargando) return <EstadoCargando texto="Cargando vistas del sistema…" />;
    if (error) return <EstadoError texto="No se pudieron cargar las vistas. Verifica tu conexión e inténtalo de nuevo." onReintentar={cargarTodo} />;

    return (
      <>
        <div className="sticky top-0 z-10 space-y-3 border-b border-gray-200 bg-white p-3 sm:p-4">
          <div>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="font-semibold text-[#233245]">
                {totalAsignadas} de {totalVistas} vistas asignadas
              </span>
              <span className="text-xs text-gray-500">{porcentaje}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200" role="progressbar" aria-valuenow={porcentaje} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${porcentaje}%` }} />
            </div>
          </div>

          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Buscar una vista…"
              aria-label="Buscar una vista"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-9 text-sm focus:border-[#fc6b03] focus:outline-none focus:ring-2 focus:ring-[#fc6b03]/30"
            />
            {texto && (
              <button
                type="button"
                onClick={() => setTexto('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimesCircle} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex rounded-lg bg-gray-100 p-0.5" role="group" aria-label="Filtrar por estado">
              {FILTROS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFiltro(f.id)}
                  aria-pressed={filtro === f.id}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition
                    ${filtro === f.id ? 'bg-white text-[#233245] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {f.texto}
                </button>
              ))}
            </div>
            {!filtrando && (
              <div className="flex gap-3 text-xs font-semibold">
                <button type="button" onClick={expandirTodo} className="text-[#fc6b03] hover:underline">Expandir todo</button>
                <button type="button" onClick={() => setAbiertos(new Set())} className="text-gray-500 hover:underline">Contraer todo</button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1.5 p-3 sm:p-4">
          {arbolVisible.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-500">No se encontraron vistas con ese criterio.</p>
          ) : (
            arbolVisible.map((nodo) => (
              <FilaVista
                key={nodo.id}
                nodo={nodo}
                asignadas={asignadas}
                ocupados={ocupados}
                abiertos={abiertos}
                forzarAbrir={filtrando}
                conteos={conteos}
                onToggleAbierto={alternarAbierto}
                onAlternar={alternarVista}
                onAcciones={setVistaAcciones}
              />
            ))
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <ModalShell
        icono={faLock}
        titulo="Asignar vistas"
        subtitulo={`Rol: ${Nombre}`}
        onClose={closeModal}
        cerrarConEsc={!vistaAcciones}
        pie={<p className="text-xs text-gray-500">Los cambios se guardan automáticamente al activar o desactivar una vista.</p>}
      >
        {cuerpo()}
      </ModalShell>

      {vistaAcciones && (
        <ModalAsignacionesSub
          onClose={() => setVistaAcciones(null)}
          nombre={vistaAcciones.label}
          IDView={vistaAcciones.id}
          token={token}
          ID_ROL={ID_ROL}
          nombreRol={Nombre}
        />
      )}
    </>
  );
};

export default MyTreeView;
