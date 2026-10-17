import { useCallback, useMemo, useRef, useState } from "react";

const esVacio = (valor) => valor == null || valor === "";

const compararValores = (a, b) =>
    typeof a === "number" && typeof b === "number"
        ? a - b
        : String(a).localeCompare(String(b), "es", { numeric: true, sensitivity: "base" });

// Valor por el que se ordena una columna: su `valorOrden` o, si no tiene, el campo de su `accessor`.
const valorDeOrden = (columna, fila) => (columna.valorOrden ? columna.valorOrden(fila) : fila[columna.accessor]);

// Una columna se puede ordenar si tiene `id` (así se sabe cuál es la ordenada) y dice por qué valor (`valorOrden`)
// o es de un campo directo (`accessor`). Una columna de solo botones, por ejemplo, no se ordena.
export const esOrdenable = (columna) => columna.id != null && Boolean(columna.valorOrden || columna.accessor);

// Marca como `sortable` las columnas que se pueden ordenar, para que TablaTemplate dibuje su flecha.
export const conOrden = (columnas) => columnas.map((columna) => ({ ...columna, sortable: esOrdenable(columna) }));

// Copia de `filas` ordenada por `columna`. Las filas sin valor quedan siempre al final, en cualquier dirección,
// y las que empatan conservan el orden que ya tenían.
export const ordenarFilas = (filas, columna, direccion) => {
    const signo = direccion === "desc" ? -1 : 1;
    return [...filas].sort((a, b) => {
        const valorA = valorDeOrden(columna, a);
        const valorB = valorDeOrden(columna, b);
        const vacioA = esVacio(valorA);
        const vacioB = esVacio(valorB);
        if (vacioA || vacioB) return vacioA === vacioB ? 0 : vacioA ? 1 : -1;
        return signo * compararValores(valorA, valorB);
    });
};

// Ordena `filas` según `orden` ({ id, direccion } de useOrdenTabla) buscando la columna en `columnas`.
// Sin orden, o si la columna ya no existe, devuelve las filas tal como vienen.
export const ordenarPorColumna = (filas, columnas, orden) => {
    const columna = orden && columnas.find((candidata) => candidata.id === orden.id);
    return columna ? ordenarFilas(filas, columna, orden.direccion) : filas;
};

// Orden de una tabla por cabecera. Cada clic en la misma columna avanza: ascendente -> descendente -> sin orden.
// Elegir otra columna empieza de nuevo en ascendente. `orden` es { id, direccion } o null (orden original).
export const useOrdenTabla = () => {
    const [orden, setOrden] = useState(null);

    const alternarOrden = useCallback((columna) => {
        setOrden((actual) => {
            if (actual?.id !== columna.id) return { id: columna.id, direccion: "asc" };
            return actual.direccion === "asc" ? { id: columna.id, direccion: "desc" } : null;
        });
    }, []);

    const quitarOrden = useCallback(() => setOrden(null), []);

    return { orden, alternarOrden, quitarOrden };
};

// Filas ordenadas de una tabla cuyas celdas se editan (cada fila lleva un `uid`). El orden solo se recalcula al
// elegir otra cabecera o al agregar o quitar filas, no al cambiar un valor: si no, al corregir una cantidad en una
// tabla ordenada por cantidad la fila saltaría de lugar mientras se escribe en ella.
export const useOrdenEstable = (filas, columnas, orden, obtenerId = (fila) => fila.uid) => {
    const filasRef = useRef(filas);
    const columnasRef = useRef(columnas);
    filasRef.current = filas;
    columnasRef.current = columnas;

    const claves = filas.map(obtenerId).join("|");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const idsOrdenados = useMemo(() => ordenarPorColumna(filasRef.current, columnasRef.current, orden).map(obtenerId), [claves, orden]);

    const porId = new Map(filas.map((fila) => [obtenerId(fila), fila]));
    return idsOrdenados.map((id) => porId.get(id)).filter(Boolean);
};
