import { useCallback, useRef, useState } from "react";

// Estado de una consulta de lista (stock, alertas, kardex, lotes, historiales). `ejecutar` recibe una función
// que devuelve { ok, resultado, mensaje }. Si el usuario cambia de inventario o filtro mientras una consulta
// sigue en curso, solo se aplica la respuesta de la última: la anterior se descarta para que no pise
// la lista nueva con datos de otro inventario. `limpiar` vacía la lista y descarta lo que esté en curso.
export const useConsultaInventario = () => {
    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const peticion = useRef(0);

    const ejecutar = useCallback(async (consulta) => {
        const id = ++peticion.current;
        setCargando(true);
        setError("");
        setDatos([]);

        const res = await consulta();
        if (id !== peticion.current) return null;

        setCargando(false);
        if (!res.ok) {
            setError(res.mensaje);
            return res;
        }
        setDatos(Array.isArray(res.resultado) ? res.resultado : []);
        return res;
    }, []);

    const limpiar = useCallback(() => {
        peticion.current++;
        setDatos([]);
        setCargando(false);
        setError("");
    }, []);

    return { datos, cargando, error, ejecutar, limpiar };
};
