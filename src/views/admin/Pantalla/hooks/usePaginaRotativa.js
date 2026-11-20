import { useEffect, useMemo, useState } from "react";

/**
 * Divide `items` en páginas de `tamano` y pasa a la siguiente cada `intervaloMs`.
 * Con una sola página no rota.
 */
export function usePaginaRotativa(items, tamano, intervaloMs = 15000) {
    const [indice, setIndice] = useState(0);
    const totalPaginas = Math.max(1, Math.ceil(items.length / tamano));

    useEffect(() => {
        if (totalPaginas <= 1) return;
        const id = setInterval(() => setIndice((actual) => (actual + 1) % totalPaginas), intervaloMs);
        return () => clearInterval(id);
    }, [totalPaginas, intervaloMs]);

    // Si la lista se acorta al refrescar, evita quedar en una página que ya no existe.
    const pagina = Math.min(indice, totalPaginas - 1);
    const visibles = useMemo(
        () => items.slice(pagina * tamano, (pagina + 1) * tamano),
        [items, pagina, tamano]
    );

    return { visibles, pagina: pagina + 1, totalPaginas };
}
