import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

// Primera, última y las vecinas de la actual; "..." donde hay saltos
const numerosDePagina = (actual, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    let inicio = Math.max(2, actual - 1);
    let fin = Math.min(total - 1, actual + 1);
    if (actual <= 3) [inicio, fin] = [2, 4];
    if (actual >= total - 2) [inicio, fin] = [total - 3, total - 1];

    const paginas = new Set([1, total]);
    for (let i = inicio; i <= fin; i++) paginas.add(i);

    const ordenadas = [...paginas].sort((a, b) => a - b);
    return ordenadas.flatMap((p, i) => (i > 0 && p - ordenadas[i - 1] > 1 ? ["...", p] : [p]));
};

const BOTON_FLECHA = "flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-500 disabled:opacity-40";

// Barra de paginación para el resultado de useListaPaginada.
export default function Paginacion({ paginacion, etiqueta = "registros" }) {
    const { pagina, totalPaginas, desde, hasta, total, irA } = paginacion;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
                {total === 0 ? `Mostrando 0 de 0 ${etiqueta}` : `Mostrando ${desde} - ${hasta} de ${total} ${etiqueta}`}
            </p>
            <div className="flex items-center gap-1">
                <button type="button" onClick={() => irA(pagina - 1)} disabled={pagina === 1} aria-label="Página anterior" className={BOTON_FLECHA}>
                    <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                </button>
                {numerosDePagina(pagina, totalPaginas).map((numero, i) =>
                    numero === "..." ? (
                        <span key={`salto-${i}`} className="flex h-8 w-8 items-center justify-center text-gray-400">...</span>
                    ) : (
                        <button
                            key={numero}
                            type="button"
                            onClick={() => irA(numero)}
                            aria-current={numero === pagina ? "page" : undefined}
                            className={`h-8 w-8 rounded-lg text-sm font-medium ${numero === pagina ? "bg-primario text-white" : "bg-[#e1e7f0] text-[#084788]"}`}
                        >
                            {numero}
                        </button>
                    )
                )}
                <button type="button" onClick={() => irA(pagina + 1)} disabled={pagina === totalPaginas} aria-label="Página siguiente" className={BOTON_FLECHA}>
                    <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                </button>
            </div>
        </div>
    );
}
