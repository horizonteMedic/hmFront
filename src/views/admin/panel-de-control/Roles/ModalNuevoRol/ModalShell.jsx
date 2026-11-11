import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

/**
 * Contenedor común de los modales de accesos: fondo, cabecera con título/subtítulo, cuerpo con scroll y pie opcional.
 * Se cierra con la X, con Esc (si `cerrarConEsc`) o al hacer clic en el fondo. En móvil sube desde abajo.
 */
export default function ModalShell({
  icono,
  titulo,
  subtitulo,
  onClose,
  cerrarConEsc = true,
  ancho = 'max-w-2xl',
  capa = 'z-50',
  pie,
  children,
}) {
  useEffect(() => {
    if (!cerrarConEsc) return undefined;
    const alPresionar = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', alPresionar);
    return () => document.removeEventListener('keydown', alPresionar);
  }, [cerrarConEsc, onClose]);

  return (
    <div
      className={`fixed inset-0 ${capa} flex items-end justify-center bg-gray-900/50 sm:items-center sm:p-4`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
    >
      <div className={`flex max-h-[92vh] w-full ${ancho} flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-xl`}>
        <header className="flex items-center gap-3 bg-[#233245] px-4 py-3 text-white">
          {icono && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fc6b03]">
              <FontAwesomeIcon icon={icono} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-bold leading-tight">{titulo}</h2>
            {subtitulo && <p className="truncate text-xs text-gray-300">{subtitulo}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {pie && <footer className="border-t border-gray-200 bg-gray-50 px-4 py-2.5">{pie}</footer>}
      </div>
    </div>
  );
}

// Estados reutilizables del cuerpo (cargando / error con reintento).
export const EstadoCargando = ({ texto = 'Cargando…' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-14 text-gray-500" role="status">
    <span className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#fc6b03]" />
    <p className="text-sm">{texto}</p>
  </div>
);

export const EstadoError = ({ texto, onReintentar }) => (
  <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
    <p className="text-sm text-gray-600">{texto}</p>
    <button
      type="button"
      onClick={onReintentar}
      className="rounded-lg bg-[#233245] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a2634]"
    >
      Reintentar
    </button>
  </div>
);
