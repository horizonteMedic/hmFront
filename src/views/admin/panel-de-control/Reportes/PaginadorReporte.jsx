import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// Arma la lista de páginas a mostrar, siempre con la primera y la última, y "…" donde se saltan páginas.
// Siempre son 7 casillas como máximo, para que los botones no se muevan al cambiar de página.
// Ej. con 20 páginas: en la 2 → 1 2 3 4 5 … 20 · en la 8 → 1 … 7 8 9 … 20 · en la 19 → 1 … 16 17 18 19 20
const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const paginasConSaltos = (actual, total) => {
  if (total <= 7) return rango(1, total);
  if (actual <= 4) return [...rango(1, 5), 'fin', total];
  if (actual >= total - 3) return [1, 'inicio', ...rango(total - 4, total)];
  return [1, 'inicio', actual - 1, actual, actual + 1, 'fin', total];
};

const BOTON = 'inline-flex h-[2.4em] min-w-[2.4em] items-center justify-center rounded-md px-2 font-semibold transition-colors duration-150';

// Paginador del Reporte de Pacientes. Recibe lo que devuelve usePagination.
const PaginadorReporte = ({ paginacion, total, etiqueta = 'registros' }) => {
  const { currentPage, setCurrentPage, recordsPerPage, totalPages, handleChangeRecordsPerPage } = paginacion;

  const todos = recordsPerPage === -1;
  const desde = total === 0 ? 0 : todos ? 1 : (currentPage - 1) * recordsPerPage + 1;
  const hasta = todos ? total : Math.min(currentPage * recordsPerPage, total);
  const irA = (pagina) => setCurrentPage(Math.min(Math.max(pagina, 1), totalPages));

  const flecha = (icono, destino, deshabilitado, titulo) => (
    <button
      type="button"
      onClick={() => irA(destino)}
      disabled={deshabilitado}
      title={titulo}
      aria-label={titulo}
      className={`${BOTON} border border-gray-300 bg-white text-gray-600 hover:border-[#fc6b03] hover:text-[#fc6b03] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-gray-600`}
    >
      <FontAwesomeIcon icon={icono} className="text-[0.85em]" />
    </button>
  );

  return (
    <div className="mt-3 flex flex-col items-center justify-between gap-3 md:flex-row">
      <div className="flex flex-wrap items-center gap-2 text-gray-600">
        <span>Mostrar</span>
        <select
          className="rounded-md border border-gray-300 bg-white px-2 py-1 focus:border-blue-500 focus:outline-none"
          value={recordsPerPage}
          onChange={handleChangeRecordsPerPage}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={-1}>Todos</option>
        </select>
        <span>
          · <span className="font-semibold text-gray-800">{desde}–{hasta}</span> de{' '}
          <span className="font-semibold text-gray-800">{total}</span> {etiqueta}
        </span>
      </div>

      {totalPages > 1 && (
        <nav className="flex flex-wrap items-center justify-center gap-1" aria-label="Paginación">
          {flecha(faAnglesLeft, 1, currentPage === 1, 'Primera página')}
          {flecha(faChevronLeft, currentPage - 1, currentPage === 1, 'Página anterior')}

          {paginasConSaltos(currentPage, totalPages).map((pagina) =>
            typeof pagina === 'string' ? (
              <span key={pagina} className="inline-flex h-[2.4em] min-w-[1.6em] items-end justify-center pb-1 text-gray-400 select-none">…</span>
            ) : (
              <button
                key={pagina}
                type="button"
                onClick={() => irA(pagina)}
                aria-current={pagina === currentPage ? 'page' : undefined}
                className={`${BOTON} tabular-nums ${pagina === currentPage
                  ? 'bg-primario text-white shadow-sm'
                  : 'border border-transparent text-gray-700 hover:border-gray-300 hover:bg-white'}`}
              >
                {pagina}
              </button>
            )
          )}

          {flecha(faChevronRight, currentPage + 1, currentPage === totalPages, 'Página siguiente')}
          {flecha(faAnglesRight, totalPages, currentPage === totalPages, 'Última página')}

          <span className="ml-2 hidden text-gray-500 sm:inline">
            Página <span className="font-semibold text-gray-800">{currentPage}</span> de {totalPages}
          </span>
        </nav>
      )}
    </div>
  );
};

export default PaginadorReporte;
