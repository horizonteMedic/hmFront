import { useEffect, useState } from "react";
import { ObtenerInventarios } from "./Inventarios/controllerInventarios";

// Carga los inventarios y mantiene el elegido en las pantallas de stock. Al abrir queda seleccionado el
// primero de la lista (el central, que ObtenerInventarios deja siempre primero); si ya había uno elegido
// y sigue existiendo, se respeta al recargar.
export const useInventarios = (token) => {
    const [inventarios, setInventarios] = useState([]);
    const [inventarioId, setInventarioId] = useState("");
    const [cargandoInventarios, setCargandoInventarios] = useState(true);
    const [errorInventarios, setErrorInventarios] = useState("");

    const cargarInventarios = async () => {
        setCargandoInventarios(true);
        const lista = await ObtenerInventarios(token, setInventarios, setErrorInventarios);
        const activos = lista.filter((inventario) => inventario.activo !== false);
        setInventarioId((actual) =>
            activos.some((inventario) => String(inventario.id) === actual) ? actual : String(activos[0]?.id ?? "")
        );
        setCargandoInventarios(false);
    };

    useEffect(() => {
        cargarInventarios();
    }, []);

    const inventarioActual = inventarios.find((inventario) => String(inventario.id) === inventarioId) ?? null;

    return {
        inventarios,
        inventarioId,
        setInventarioId,
        inventarioActual,
        cargandoInventarios,
        errorInventarios,
        cargarInventarios,
    };
};
