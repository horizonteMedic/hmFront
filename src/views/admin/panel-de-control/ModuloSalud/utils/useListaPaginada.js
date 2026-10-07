import { useEffect, useState } from "react";

// Lista paginada en memoria (para una lista ya filtrada). Vuelve a la página 1 cuando cambia `reiniciarCon`
// (p. ej. el objeto de filtros) y se ajusta sola si el filtro deja menos páginas que las actuales.
export default function useListaPaginada(items, { porPaginaInicial = 10, reiniciarCon } = {}) {
    const [pagina, setPagina] = useState(1);
    const [porPagina, setPorPagina] = useState(porPaginaInicial);

    useEffect(() => {
        setPagina(1);
    }, [reiniciarCon]);

    const totalPaginas = Math.max(Math.ceil(items.length / porPagina), 1);
    const actual = Math.min(pagina, totalPaginas);
    const desde = items.length ? (actual - 1) * porPagina + 1 : 0;
    const hasta = Math.min(actual * porPagina, items.length);

    return {
        pagina: actual,
        totalPaginas,
        porPagina,
        desde,
        hasta,
        total: items.length,
        visibles: items.slice(Math.max(desde - 1, 0), hasta),
        irA: (destino) => setPagina(Math.min(Math.max(destino, 1), totalPaginas)),
        cambiarPorPagina: (cantidad) => {
            setPorPagina(cantidad);
            setPagina(1);
        },
    };
}
