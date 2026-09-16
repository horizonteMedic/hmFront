import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Hook genérico para catálogos simples {id, descripcion} (Recomendación /
 * Restricción). El GET ya no admite filtro por query ni eliminación: trae
 * el listado completo una sola vez y el filtro se aplica en el front.
 */
export function useCatalogoSimple({ token, usuarioCreacion, api }) {
    const { list, guardar } = api;

    const [allItems, setAllItems] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(() => {
        setLoading(true);
        return Promise.resolve(list(token))
            .then((res) => setAllItems(Array.isArray(res) ? res : []))
            .catch(() => setAllItems([]))
            .finally(() => setLoading(false));
    }, [list, token]);

    // Se trae una sola vez al montar (timeout+cleanup evita el doble
    // disparo de React.StrictMode en desarrollo).
    useEffect(() => {
        const timeout = setTimeout(() => refresh(), 0);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const items = useMemo(() => {
        const q = (filtro || "").toUpperCase().trim();
        if (!q) return allItems;
        return allItems.filter((item) => (item.descripcion || "").toUpperCase().includes(q));
    }, [allItems, filtro]);

    const crear = useCallback(
        (descripcion) =>
            guardar(
                { id: null, descripcion, usuarioRegistro: usuarioCreacion, usuarioActualizacion: usuarioCreacion },
                token
            ),
        [guardar, token, usuarioCreacion]
    );

    const actualizar = useCallback(
        (id, descripcion) =>
            guardar(
                { id, descripcion, usuarioRegistro: usuarioCreacion, usuarioActualizacion: usuarioCreacion },
                token
            ),
        [guardar, token, usuarioCreacion]
    );

    return {
        items,
        filtro,
        setFiltro,
        loading,
        refresh,
        crear,
        actualizar,
    };
}
