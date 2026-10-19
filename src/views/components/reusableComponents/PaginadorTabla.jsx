import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

// Pie de tabla con "Mostrar N de X" y los botones de página. Recibe lo que devuelve usePagination.
export default function PaginadorTabla({ paginacion, total, etiqueta = "registros" }) {
    const { currentPage, setCurrentPage, recordsPerPage, totalPages, visiblePages, handleChangeRecordsPerPage } = paginacion;

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2">
                <span>Mostrar</span>
                <select className="border border-gray-300 rounded-md px-2 py-1" value={recordsPerPage} onChange={handleChangeRecordsPerPage}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={-1}>Todos</option>
                </select>
                <span>de {total} {etiqueta}</span>
            </div>

            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="mx-1 px-3 py-1 !bg-[#fc6b03] text-white rounded-md disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                {visiblePages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`mx-1 px-3 py-1 rounded-md ${currentPage === page ? "!bg-[#233245] text-white" : "bg-gray-200"}`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="mx-1 px-3 py-1 !bg-[#fc6b03] text-white rounded-md disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        </div>
    );
}
