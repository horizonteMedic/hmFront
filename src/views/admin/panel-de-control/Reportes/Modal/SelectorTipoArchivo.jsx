import { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faCheck, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TEXTO_ADAPTATIVO } from '../ReporteUI';

const normalizar = (texto) =>
  String(texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Modal para elegir qué tipo de archivo subir, con buscador por nombre, nomenclatura o extensión.
// `subidos` son los archivos que ya tiene esa historia clínica, para marcarlos como "Ya subido".
const SelectorTipoArchivo = ({ tipos = [], subidos = [], orden, historiaClinica, onSelect, onClose }) => {
  const [busqueda, setBusqueda] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const yaSubido = (tipo) =>
    subidos.some(s =>
      s.id_tipo_archivo === tipo.id ||
      (s.nomenclatura && tipo.nomenclatura && normalizar(s.nomenclatura) === normalizar(tipo.nomenclatura))
    );

  const filtrados = useMemo(() => {
    const term = normalizar(busqueda);
    if (!term) return tipos;
    return tipos.filter(t =>
      [t.nombre, t.nomenclatura, t.extension].some(campo => normalizar(campo).includes(term))
    );
  }, [tipos, busqueda]);

  const onKeyDownBusqueda = (e) => {
    if (e.key === 'Enter' && filtrados.length === 1) onSelect(filtrados[0]);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-gray-800/50 p-4 text-gray-800 ${TEXTO_ADAPTATIVO}`}
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-[640px] flex-col overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-primario px-4 py-2.5 text-white">
          <div>
            <h2 className="text-[1.05em] font-semibold">Subir archivo</h2>
            <p className="text-[0.85em] text-white/70">Orden {orden} · HC {historiaClinica}</p>
          </div>
          <button onClick={onClose} title="Cerrar" className="rounded px-2 py-1 text-[1.2em] hover:bg-white/10">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="border-b bg-primarioClaro px-4 py-3">
          <div className="relative">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={onKeyDownBusqueda}
              placeholder="Buscar por nombre, nomenclatura o extensión…"
              className="w-full rounded border border-gray-300 bg-white py-1.5 pl-9 pr-8 focus:border-blue-500 focus:outline-none"
            />
            {busqueda && (
              <button onClick={() => setBusqueda('')} className="absolute right-2 top-1/2 -translate-y-1/2 px-1 text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>
          <p className="mt-1.5 text-[0.85em] text-gray-500">
            {filtrados.length} de {tipos.length} tipos de archivo
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {filtrados.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No hay tipos de archivo que coincidan con “{busqueda}”.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {filtrados.map((tipo) => {
                const color = tipo.codigo || '#64748b';
                const subido = yaSubido(tipo);
                return (
                  <button
                    key={tipo.id}
                    type="button"
                    onClick={() => onSelect(tipo)}
                    className="flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition hover:shadow-md hover:brightness-95"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${color} 12%, white)`,
                      borderColor: `color-mix(in srgb, ${color} 35%, white)`,
                    }}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: `color-mix(in srgb, ${color} 25%, white)`, color }}
                    >
                      <FontAwesomeIcon icon={faArrowUp} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-gray-800">{tipo.nombre}</span>
                      <span className="flex items-center gap-1.5 text-[0.85em] text-gray-500">
                        {tipo.nomenclatura && <span className="font-bold">{tipo.nomenclatura}</span>}
                        {tipo.extension && <span className="uppercase">.{tipo.extension}</span>}
                      </span>
                    </span>
                    {subido && (
                      <span className="shrink-0 rounded bg-green-100 px-1.5 py-0.5 text-[0.8em] font-semibold text-green-700" title="Esta historia ya tiene un archivo de este tipo">
                        <FontAwesomeIcon icon={faCheck} /> Ya subido
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectorTipoArchivo;
