import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook genérico de CRUD con filtro para catálogos simples {id, descripcion}.
 * Sirve tanto para Recomendación como para Restricción, ya que ambas
 * comparten exactamente la misma forma de API.
 */
export function useCatalogoSimple({ token, usuarioCreacion, api }) {
    const { list, guardar, remove } = api;

    const [items, setItems] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef(null);

    const refresh = useCallback(
        async (customFiltro) => {
            setLoading(true);
            try {
                const res = await list(customFiltro ?? filtro, token);
                setItems(Array.isArray(res) ? res : []);
            } finally {
                setLoading(false);
            }
        },
        [filtro, list, token]
    );

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            refresh(filtro);
        }, 300);
        return () => clearTimeout(debounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtro, token]);

    const crear = useCallback(
        (descripcion) =>
            guardar({ id: null, descripcion, usuarioRegistro: usuarioCreacion }, token),
        [guardar, token, usuarioCreacion]
    );

    const actualizar = useCallback(
        (id, descripcion) =>
            guardar({ id, descripcion, usuarioRegistro: usuarioCreacion }, token),
        [guardar, token, usuarioCreacion]
    );

    const eliminar = useCallback((id) => remove(id, token), [remove, token]);

    return {
        items,
        filtro,
        setFiltro,
        loading,
        refresh,
        crear,
        actualizar,
        eliminar,
    };
}
